import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { hashBuffer, hashFile, hashText, pathExists, readJson, uniqueSorted, walkFiles, writeBufferAtomic, writeJsonAtomic, } from "./fs-utils.js";
import { JobRequirementModelManifestSchema, JobRequirementProposalManifestSchema, JobRequirementProposalSchema, ModelJobRequirementPayloadSchema, } from "./job-requirement-schemas.js";
import { JOB_REQUIREMENT_POLICY_NAME, getJobRequirementModelStatus, jobRequirementPaths, showJobRequirementModel, } from "./job-requirements.js";
import { createModelProviderFromEnvironment, } from "./model-provider.js";
import { showTargetAnalysis } from "./target-analysis.js";
import { showTarget } from "./targets.js";
export const JOB_REQUIREMENT_PROPOSAL_PROMPT_ID = "target-job-requirement-model-proposal";
export const JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION = "1";
export const JOB_REQUIREMENT_PROPOSAL_POLICY_VERSION = "1";
const PROPOSAL_FILE = "proposal.json";
const MANIFEST_FILE = "proposal-manifest.json";
const RAW_RESPONSE_FILE = "raw-model-response.txt";
export async function generateJobRequirementProposal(workspace, targetId, options = {}) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job")
        throw new Error(`Job requirement proposals reject Role Target: ${targetId}`);
    const modelStatus = await getJobRequirementModelStatus(workspace, targetId);
    if (modelStatus.status !== "current") {
        throw new Error(`A current deterministic job requirement model is required. Current status: ${modelStatus.status}.`);
    }
    const model = await showJobRequirementModel(workspace, targetId);
    const deterministicPaths = jobRequirementPaths(workspace, targetId);
    const deterministicManifest = JobRequirementModelManifestSchema.parse(await readJson(deterministicPaths.manifestPath, null));
    const provider = options.provider ?? createModelProviderFromEnvironment();
    const promptTemplateId = options.promptTemplateId ?? JOB_REQUIREMENT_PROPOSAL_PROMPT_ID;
    const promptTemplateVersion = options.promptTemplateVersion ?? JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION;
    const policyVersion = options.policyVersion ?? JOB_REQUIREMENT_PROPOSAL_POLICY_VERSION;
    const normalizedModelInput = normalizeModelInput(model);
    const normalizedModelInputSha256 = hashText(normalizedModelInput);
    const renderedPrompt = renderPrompt(model, normalizedModelInput);
    const renderedPromptSha256 = hashText(renderedPrompt);
    const requestFingerprint = hashText(JSON.stringify({
        targetId,
        targetSha256: deterministicManifest.targetSha256,
        sourceSha256: deterministicManifest.sourceSha256,
        deterministicModelSha256: deterministicManifest.modelSha256,
        normalizedModelInputSha256,
        provider: provider.identity,
        settings: provider.settings,
        promptTemplateId,
        promptTemplateVersion,
        policyVersion,
        renderedPromptSha256,
    }));
    if (!options.refresh) {
        const cached = await findCurrentCachedProposal(workspace, targetId, requestFingerprint);
        if (cached) {
            return {
                proposalId: cached.id,
                targetId,
                result: "cached",
                proposalStatus: cached.status,
                proposalPath: proposalPaths(workspace, targetId, cached.id).proposalRelativePath,
                manifestPath: proposalPaths(workspace, targetId, cached.id).manifestRelativePath,
                proposedRequirementCount: cached.proposedRequirements.length,
                validationIssueCount: cached.validationIssues.length,
                providerCallMade: false,
            };
        }
    }
    const response = await provider.generate({ renderedPrompt, settings: provider.settings });
    const rawBytes = Buffer.from(response.rawText, "utf8");
    const now = (options.now ?? (() => new Date()))().toISOString();
    const proposalId = `job-requirements-proposal_${hashText(`${requestFingerprint}\u0000${now}\u0000${options.refresh ? "refresh" : "initial"}`).slice(0, 16)}`;
    const paths = proposalPaths(workspace, targetId, proposalId);
    await writeBufferAtomic(paths.rawResponsePath, rawBytes);
    const analysis = await showTargetAnalysis(workspace, targetId);
    const parsed = parseAndValidatePayload(response.rawText, model, analysis);
    const proposal = JobRequirementProposalSchema.parse({
        schemaVersion: 1,
        id: proposalId,
        requestFingerprint,
        targetId,
        targetType: "job",
        status: parsed.validationIssues.length === 0 ? "ready-for-review" : "validation-failed",
        model: {
            ...provider.identity,
            settings: provider.settings,
        },
        prompt: {
            templateId: promptTemplateId,
            templateVersion: promptTemplateVersion,
            policyVersion,
            renderedPromptSha256,
        },
        input: {
            targetSha256: deterministicManifest.targetSha256,
            sourceSha256: deterministicManifest.sourceSha256,
            deterministicModelSha256: deterministicManifest.modelSha256,
            normalizedModelInputSha256,
        },
        proposedRequirements: parsed.proposedRequirements,
        warnings: [
            {
                id: `job-warning_${hashText(`${proposalId}\u0000review`).slice(0, 12)}`,
                code: "MODEL_PROPOSAL_REQUIRES_REVIEW",
                message: "Model-proposed job requirements are untrusted until a human review is completed.",
                sourceAnalysisItemIds: uniqueSorted(parsed.proposedRequirements.flatMap((entry) => entry.sourceAnalysisItemIds)),
            },
        ],
        validationIssues: parsed.validationIssues,
        rawResponsePath: paths.rawResponseRelativePath,
        rawResponseSha256: hashBuffer(rawBytes),
        createdAt: now,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.proposalPath, proposal);
    const manifest = JobRequirementProposalManifestSchema.parse({
        schemaVersion: 1,
        proposalId,
        requestFingerprint,
        targetId,
        targetType: "job",
        proposalPath: paths.proposalRelativePath,
        proposalSha256: await hashFile(paths.proposalPath),
        rawResponsePath: paths.rawResponseRelativePath,
        rawResponseSha256: await hashFile(paths.rawResponsePath),
        policyName: JOB_REQUIREMENT_POLICY_NAME,
        policyVersion,
        provider: provider.identity.provider,
        model: provider.identity.model,
        promptTemplateId,
        promptTemplateVersion,
        renderedPromptSha256,
        targetSha256: deterministicManifest.targetSha256,
        sourceSha256: deterministicManifest.sourceSha256,
        deterministicModelSha256: deterministicManifest.modelSha256,
        normalizedModelInputSha256,
        createdAt: now,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return {
        proposalId,
        targetId,
        result: "generated",
        proposalStatus: proposal.status,
        proposalPath: paths.proposalRelativePath,
        manifestPath: paths.manifestRelativePath,
        proposedRequirementCount: proposal.proposedRequirements.length,
        validationIssueCount: proposal.validationIssues.length,
        providerCallMade: true,
    };
}
export async function showJobRequirementProposal(workspace, proposalId) {
    const location = await locateProposal(workspace, proposalId);
    return JobRequirementProposalSchema.parse(await readJson(location.proposalPath, null));
}
export async function listJobRequirementProposals(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job")
        throw new Error(`Job requirement proposals reject Role Target: ${targetId}`);
    const root = resolveWithin(workspace, `targets/jobs/${targetId}/requirements/proposals`);
    const files = (await walkFiles(root)).filter((file) => path.basename(file) === PROPOSAL_FILE);
    const proposals = await Promise.all(files.map(async (file) => JobRequirementProposalSchema.parse(await readJson(file, null))));
    return proposals.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
}
export async function getJobRequirementProposalStatus(workspace, proposalId) {
    const location = await locateProposal(workspace, proposalId);
    const proposalExists = await pathExists(location.proposalPath);
    const manifestExists = await pathExists(location.manifestPath);
    const rawResponseExists = await pathExists(location.rawResponsePath);
    const base = {
        proposalId,
        targetId: location.targetId,
        proposalExists,
        manifestExists,
        rawResponseExists,
        proposalPath: location.proposalRelativePath,
        manifestPath: location.manifestRelativePath,
    };
    if (!proposalExists || !manifestExists || !rawResponseExists) {
        return invalidStatus(base, ["Proposal artifact set is incomplete."]);
    }
    let proposal;
    let manifest;
    try {
        proposal = JobRequirementProposalSchema.parse(await readJson(location.proposalPath, null));
        manifest = JobRequirementProposalManifestSchema.parse(await readJson(location.manifestPath, null));
    }
    catch (error) {
        return invalidStatus(base, [`Stored proposal is invalid: ${errorMessage(error)}`]);
    }
    const deterministicPaths = jobRequirementPaths(workspace, proposal.targetId);
    const proposalHashMatches = (await hashFile(location.proposalPath)) === manifest.proposalSha256;
    const rawResponseHashMatches = (await hashFile(location.rawResponsePath)) === manifest.rawResponseSha256 &&
        proposal.rawResponseSha256 === manifest.rawResponseSha256;
    const targetHashMatches = await hashMatches(deterministicPaths.targetPath, manifest.targetSha256);
    const sourceHashMatches = await hashMatches(deterministicPaths.sourcePath, manifest.sourceSha256);
    const deterministicModelHashMatches = await hashMatches(deterministicPaths.modelPath, manifest.deterministicModelSha256);
    const promptMatches = manifest.promptTemplateId === JOB_REQUIREMENT_PROPOSAL_PROMPT_ID &&
        manifest.promptTemplateVersion === JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION &&
        manifest.policyVersion === JOB_REQUIREMENT_PROPOSAL_POLICY_VERSION &&
        proposal.prompt.templateId === manifest.promptTemplateId &&
        proposal.prompt.templateVersion === manifest.promptTemplateVersion &&
        proposal.prompt.policyVersion === manifest.policyVersion;
    let normalizedInputHashMatches = false;
    if (deterministicModelHashMatches) {
        try {
            normalizedInputHashMatches =
                hashText(normalizeModelInput(await showJobRequirementModel(workspace, proposal.targetId))) ===
                    manifest.normalizedModelInputSha256;
        }
        catch {
            normalizedInputHashMatches = false;
        }
    }
    const invalidReasons = [];
    if (!proposalHashMatches)
        invalidReasons.push("Proposal SHA-256 does not match its manifest.");
    if (!rawResponseHashMatches)
        invalidReasons.push("Raw response SHA-256 does not match.");
    if (proposal.id !== proposalId ||
        manifest.proposalId !== proposalId ||
        proposal.targetId !== location.targetId ||
        manifest.targetId !== location.targetId ||
        manifest.proposalPath !== location.proposalRelativePath ||
        manifest.rawResponsePath !== location.rawResponseRelativePath) {
        invalidReasons.push("Proposal identity or persistence paths are invalid.");
    }
    if (invalidReasons.length > 0) {
        return {
            ...base,
            proposalHashMatches,
            rawResponseHashMatches,
            targetHashMatches,
            sourceHashMatches,
            deterministicModelHashMatches,
            promptMatches,
            normalizedInputHashMatches,
            status: "invalid",
            readyForReview: false,
            reasons: invalidReasons,
        };
    }
    const staleReasons = [
        ...(!targetHashMatches ? ["Job Target changed."] : []),
        ...(!sourceHashMatches ? ["Job Description changed."] : []),
        ...(!deterministicModelHashMatches ? ["Deterministic requirement model changed."] : []),
        ...(!promptMatches ? ["Prompt or proposal policy changed."] : []),
        ...(!normalizedInputHashMatches ? ["Normalized model input changed."] : []),
    ];
    const status = staleReasons.length > 0 ? "stale" : "current";
    return {
        ...base,
        proposalHashMatches,
        rawResponseHashMatches,
        targetHashMatches,
        sourceHashMatches,
        deterministicModelHashMatches,
        promptMatches,
        normalizedInputHashMatches,
        status,
        readyForReview: status === "current" && proposal.status === "ready-for-review",
        reasons: staleReasons,
    };
}
export async function replayJobRequirementProposal(workspace, proposalId) {
    const status = await getJobRequirementProposalStatus(workspace, proposalId);
    if (status.status !== "current") {
        throw new Error(`Only a current proposal can be replayed. Current status: ${status.status}`);
    }
    const proposal = await showJobRequirementProposal(workspace, proposalId);
    const model = await showJobRequirementModel(workspace, proposal.targetId);
    const analysis = await showTargetAnalysis(workspace, proposal.targetId);
    const location = await locateProposal(workspace, proposalId);
    const raw = await readFile(location.rawResponsePath, "utf8");
    const replayed = parseAndValidatePayload(raw, model, analysis);
    const replaySha256 = hashText(JSON.stringify({
        proposedRequirements: replayed.proposedRequirements,
        validationIssues: replayed.validationIssues,
    }));
    const originalSha256 = hashText(JSON.stringify({
        proposedRequirements: proposal.proposedRequirements,
        validationIssues: proposal.validationIssues,
    }));
    return { proposalId, originalSha256, replaySha256, matches: originalSha256 === replaySha256 };
}
export function formatJobRequirementProposalResult(result) {
    return [
        `Proposal ID: ${result.proposalId}`,
        `Target ID: ${result.targetId}`,
        `Result: ${result.result}`,
        `Proposal status: ${result.proposalStatus}`,
        `Proposed requirements: ${result.proposedRequirementCount}`,
        `Validation issues: ${result.validationIssueCount}`,
        `Provider call made: ${result.providerCallMade ? "yes" : "no"}`,
        `Proposal path: ${result.proposalPath}`,
        `Manifest path: ${result.manifestPath}`,
    ].join("\n");
}
export function formatJobRequirementProposalList(proposals) {
    if (proposals.length === 0)
        return "Job requirement proposals: none";
    return [
        "Job requirement proposals:",
        ...proposals.map((proposal) => `${proposal.id} | ${proposal.status} | ${proposal.model.provider}/${proposal.model.model} | ${proposal.updatedAt}`),
    ].join("\n");
}
export function formatJobRequirementProposalStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Proposal ID: ${status.proposalId}`,
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Ready for review: ${status.readyForReview ? "yes" : "no"}`,
        `Proposal hash matches: ${check(status.proposalHashMatches)}`,
        `Raw response hash matches: ${check(status.rawResponseHashMatches)}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Job Description hash matches: ${check(status.sourceHashMatches)}`,
        `Deterministic model hash matches: ${check(status.deterministicModelHashMatches)}`,
        `Prompt matches: ${check(status.promptMatches)}`,
        `Normalized input matches: ${check(status.normalizedInputHashMatches)}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
function parseAndValidatePayload(rawText, model, analysis) {
    let payload;
    const validationIssues = [];
    try {
        payload = ModelJobRequirementPayloadSchema.parse(JSON.parse(rawText));
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            validationIssues.push(...error.issues.map((issue) => ({
                code: "INVALID_MODEL_PAYLOAD",
                message: issue.message,
                path: issue.path.join("."),
            })));
        }
        else {
            validationIssues.push({
                code: "INVALID_MODEL_JSON",
                message: errorMessage(error),
            });
        }
    }
    if (!payload)
        return { proposedRequirements: [], validationIssues };
    const deterministicById = new Map(model.requirements.map((entry) => [entry.id, entry]));
    const analysisById = new Map(analysis.items.map((entry) => [entry.id, entry]));
    const proposedRequirements = [];
    for (const [index, proposed] of payload.proposedRequirements.entries()) {
        const issues = [];
        const sourceItems = proposed.sourceAnalysisItemIds
            .map((id) => analysisById.get(id))
            .filter((item) => Boolean(item));
        if (sourceItems.length !== proposed.sourceAnalysisItemIds.length) {
            issues.push("Unknown source analysis item ID.");
        }
        if (proposed.sourceRequirementIds.some((id) => !deterministicById.has(id))) {
            issues.push("Unknown deterministic requirement ID.");
        }
        if (!sourceItems.some((item) => item.rawText === proposed.sourceText)) {
            issues.push("sourceText must exactly match one referenced Job Description item.");
        }
        const allowedReferences = sourceItems.flatMap((item) => item.sourceReferences);
        if (proposed.sourceReferences.some((reference) => !allowedReferences.some((allowed) => JSON.stringify(allowed) === JSON.stringify(reference)))) {
            issues.push("Source reference is not an exact reference from the structural analysis.");
        }
        if (issues.length > 0) {
            validationIssues.push(...issues.map((message) => ({
                code: "UNSUPPORTED_PROPOSAL",
                message,
                path: `proposedRequirements.${index}`,
            })));
            continue;
        }
        const id = `proposed-job-requirement_${hashText(JSON.stringify({
            sourceAnalysisItemIds: [...proposed.sourceAnalysisItemIds].sort(),
            sourceRequirementIds: [...proposed.sourceRequirementIds].sort(),
            category: proposed.category,
            normalizedLabel: proposed.normalizedLabel,
            necessity: proposed.necessity,
        })).slice(0, 14)}`;
        proposedRequirements.push({
            id,
            ...proposed,
            sourceAnalysisItemIds: uniqueSorted(proposed.sourceAnalysisItemIds),
            sourceRequirementIds: uniqueSorted(proposed.sourceRequirementIds),
            namedTechnologies: uniqueSorted(proposed.namedTechnologies),
            keywords: uniqueSorted(proposed.keywords),
            trustState: "proposed",
        });
    }
    return {
        proposedRequirements: proposedRequirements.sort((a, b) => a.id.localeCompare(b.id)),
        validationIssues,
    };
}
function normalizeModelInput(model) {
    return JSON.stringify({
        targetId: model.targetId,
        requirements: model.requirements.map((entry) => ({
            id: entry.id,
            category: entry.category,
            normalizedLabel: entry.normalizedLabel,
            sourceText: entry.sourceText,
            necessity: entry.necessity,
            confidence: entry.confidence,
            explicitness: entry.explicitness,
            provenance: entry.provenance,
            namedTechnologies: entry.namedTechnologies,
            keywords: entry.keywords,
        })),
        ambiguities: model.ambiguities,
        contradictions: model.contradictions,
    });
}
function renderPrompt(model, normalizedInput) {
    return [
        `Prompt: ${JOB_REQUIREMENT_PROPOSAL_PROMPT_ID}`,
        `Version: ${JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION}`,
        "Propose cautious interpretations only for ambiguous or implicit Job Description requirements.",
        "Use only the supplied Job Description-derived requirement model and exact provenance.",
        "Do not assess a candidate, access candidate evidence, calculate fit, generate resumes,",
        "write application recommendations, or imply that proposal output is approved.",
        "Every proposal must retain exact sourceText, sourceAnalysisItemIds, and sourceReferences.",
        "Return strict JSON with { proposedRequirements: [...], warnings: [...] }.",
        "Do not wrap the response in Markdown.",
        `Deterministic input:\n${normalizedInput}`,
        `Target ID: ${model.targetId}`,
    ].join("\n");
}
async function findCurrentCachedProposal(workspace, targetId, requestFingerprint) {
    const candidates = await listJobRequirementProposals(workspace, targetId);
    for (const candidate of candidates) {
        if (candidate.requestFingerprint !== requestFingerprint)
            continue;
        const status = await getJobRequirementProposalStatus(workspace, candidate.id);
        if (status.status === "current")
            return candidate;
    }
    return undefined;
}
export async function locateJobRequirementProposal(workspace, proposalId) {
    return locateProposal(workspace, proposalId);
}
async function locateProposal(workspace, proposalId) {
    if (!/^[a-z0-9_-]+$/.test(proposalId))
        throw new Error(`Invalid proposal ID: ${proposalId}`);
    const files = (await walkFiles(resolveWithin(workspace, "targets/jobs")))
        .filter((file) => path.basename(file) === PROPOSAL_FILE)
        .filter((file) => path.basename(path.dirname(file)) === proposalId);
    if (files.length === 0)
        throw new Error(`Job requirement proposal not found: ${proposalId}`);
    if (files.length > 1)
        throw new Error(`Job requirement proposal ID is ambiguous: ${proposalId}`);
    const relative = path.relative(workspace, files[0]).split(path.sep).join("/");
    const match = relative.match(/^targets\/jobs\/([^/]+)\/requirements\/proposals\/([^/]+)\/proposal\.json$/);
    if (!match?.[1] || match[2] !== proposalId)
        throw new Error("Proposal path is invalid.");
    return { targetId: match[1], ...proposalPaths(workspace, match[1], proposalId) };
}
function proposalPaths(workspace, targetId, proposalId) {
    const root = `targets/jobs/${targetId}/requirements/proposals/${proposalId}`;
    const proposalRelativePath = `${root}/${PROPOSAL_FILE}`;
    const manifestRelativePath = `${root}/${MANIFEST_FILE}`;
    const rawResponseRelativePath = `${root}/${RAW_RESPONSE_FILE}`;
    return {
        proposalRelativePath,
        proposalPath: resolveWithin(workspace, proposalRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
        rawResponseRelativePath,
        rawResponsePath: resolveWithin(workspace, rawResponseRelativePath),
    };
}
function invalidStatus(base, reasons) {
    return {
        ...base,
        proposalHashMatches: null,
        rawResponseHashMatches: null,
        targetHashMatches: null,
        sourceHashMatches: null,
        deterministicModelHashMatches: null,
        promptMatches: null,
        normalizedInputHashMatches: null,
        status: "invalid",
        readyForReview: false,
        reasons,
    };
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const resolved = path.resolve(root, relativePath);
    const relation = path.relative(root, resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Job requirement proposal path escapes the workspace: ${relativePath}`);
    }
    return resolved;
}
async function hashMatches(filePath, expected) {
    return (await pathExists(filePath)) && (await hashFile(filePath)) === expected;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
