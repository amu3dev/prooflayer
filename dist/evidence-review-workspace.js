import { readFile } from "node:fs/promises";
import path from "node:path";
import { hashFile, hashText, pathExists, readJson, writeBufferAtomic, writeJsonAtomic, } from "./fs-utils.js";
import { deriveHumanTitle, escapeMarkdownInline, inlineCode, quoteMarkdown, renderDerivedMarkdownBanner, renderNextAction, } from "./human-readable-markdown.js";
import { EvidenceReviewBatchManifestSchema, EvidenceReviewBatchSchema, EvidenceReviewInputTemplateSchema, } from "./evidence-review-batch-schemas.js";
import { evidenceReviewBatchPaths, getEvidenceReviewBatchStatus, } from "./evidence-review-batch.js";
import { JobRequirementModelSchema, } from "./job-requirement-schemas.js";
import { ClaimSchema, EvidenceItemSchema, SourceSchema, } from "./schemas.js";
import { stableJson } from "./target-proposal.js";
import { showTarget } from "./targets.js";
export const EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME = "evidence-review-workspace-renderer";
export const EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION = "3";
const WORKSPACE_DIR = "review-workspace";
const INDEX_FILE = "index.review.md";
const INDEX_MANIFEST_FILE = "index.manifest.json";
const READ_ONLY_BANNER = renderDerivedMarkdownBanner("the immutable evidence-review batch, review template, and Evidence Foundation JSON");
export async function renderEvidenceReviewWorkspace(workspace, batchId, options = {}) {
    const batchStatus = await getEvidenceReviewBatchStatus(workspace, batchId);
    if (batchStatus.status !== "current") {
        throw new Error(`Evidence review batch must be current before rendering: ${batchStatus.status}.`);
    }
    const paths = evidenceReviewWorkspacePaths(workspace, batchId);
    const status = await getEvidenceReviewWorkspaceStatus(workspace, batchId);
    if (status.status === "current") {
        const manifest = parseIndexManifest(await readJson(paths.indexManifestPath, null));
        return renderResult(manifest, "already-current");
    }
    if ((status.status === "stale" || status.status === "invalid") && !options.rebuild) {
        throw new Error(`Evidence review workspace is ${status.status}; use explicit --rebuild to replace derived rendering files.`);
    }
    const input = await loadEvidenceReviewWorkspaceData(workspace, batchId);
    const timestamp = (options.now ?? (() => new Date()))().toISOString();
    const claimManifests = [];
    for (const claimInput of input.claims) {
        const claimPaths = claimWorkspacePaths(workspace, batchId, claimInput.claim.id);
        const markdown = renderClaimMarkdown(input, claimInput);
        const outputSha256 = hashText(markdown);
        const existing = await readClaimManifestIfValid(claimPaths.manifestPath);
        const createdAt = existing?.createdAt ?? timestamp;
        await writeBufferAtomic(claimPaths.outputPath, Buffer.from(markdown, "utf8"));
        const manifest = createClaimManifest(input, claimInput, claimPaths.outputRelativePath, outputSha256, createdAt, timestamp);
        await writeJsonAtomic(claimPaths.manifestPath, manifest);
        claimManifests.push(manifest);
    }
    const claimManifestRecords = await Promise.all(claimManifests.map(async (manifest) => {
        const claimPaths = claimWorkspacePaths(workspace, batchId, manifest.claimId);
        return {
            claimId: manifest.claimId,
            renderId: manifest.renderId,
            output: manifest.output,
            manifest: {
                path: claimPaths.manifestRelativePath,
                sha256: await hashFile(claimPaths.manifestPath),
            },
        };
    }));
    const normalizedInputSha256 = indexInputSha256(input, claimManifests);
    const renderId = indexRenderId(input.batch.id, normalizedInputSha256);
    const indexMarkdown = renderIndexMarkdown(input, renderId);
    const indexOutputSha256 = hashText(indexMarkdown);
    const existingIndex = await readIndexManifestIfValid(paths.indexManifestPath);
    const createdAt = existingIndex?.createdAt ?? timestamp;
    await writeBufferAtomic(paths.indexPath, Buffer.from(indexMarkdown, "utf8"));
    const indexManifest = createIndexManifest(input, renderId, normalizedInputSha256, paths.indexRelativePath, indexOutputSha256, claimManifestRecords, createdAt, timestamp);
    await writeJsonAtomic(paths.indexManifestPath, indexManifest);
    const renderedStatus = await getEvidenceReviewWorkspaceStatus(workspace, batchId);
    if (renderedStatus.status !== "current") {
        throw new Error(`Rendered evidence review workspace failed validation: ${renderedStatus.reasons.join(" ")}`);
    }
    return renderResult(indexManifest, status.status === "missing" ? "created" : "rebuilt");
}
export async function showEvidenceReviewWorkspace(workspace, batchId) {
    const status = await getEvidenceReviewWorkspaceStatus(workspace, batchId);
    if (status.status !== "current") {
        throw new Error(`Evidence review workspace is ${status.status}: ${batchId}`);
    }
    return readFile(evidenceReviewWorkspacePaths(workspace, batchId).indexPath, "utf8");
}
export async function getEvidenceReviewWorkspaceStatus(workspace, batchId) {
    const paths = evidenceReviewWorkspacePaths(workspace, batchId);
    const workspaceExists = await pathExists(paths.rootPath);
    const indexExists = await pathExists(paths.indexPath);
    const indexManifestExists = await pathExists(paths.indexManifestPath);
    const base = {
        batchId,
        workspaceExists,
        indexExists,
        indexManifestExists,
        indexPath: paths.indexRelativePath,
        indexManifestPath: paths.indexManifestRelativePath,
    };
    if (!workspaceExists) {
        return emptyStatus(base, "missing", ["Evidence review workspace does not exist."]);
    }
    if (!indexExists || !indexManifestExists) {
        return emptyStatus(base, "invalid", ["Evidence review workspace index artifact set is incomplete."]);
    }
    let manifest;
    try {
        manifest = parseIndexManifest(await readJson(paths.indexManifestPath, null));
    }
    catch (error) {
        return emptyStatus(base, "invalid", [`Workspace index manifest is invalid: ${errorMessage(error)}`]);
    }
    const reasons = [];
    const indexHashMatches = await hashFile(paths.indexPath) === manifest.output.sha256;
    let manifestSetMatches = true;
    let claimOutputHashesMatch = true;
    const claimManifests = [];
    for (const record of manifest.claimWorkspaces) {
        try {
            const manifestPath = resolveWithin(workspace, record.manifest.path);
            const outputPath = resolveWithin(workspace, record.output.path);
            if (!(await pathExists(manifestPath)) || !(await pathExists(outputPath))) {
                manifestSetMatches = false;
                continue;
            }
            if (await hashFile(manifestPath) !== record.manifest.sha256)
                manifestSetMatches = false;
            if (await hashFile(outputPath) !== record.output.sha256)
                claimOutputHashesMatch = false;
            const claimManifest = parseClaimManifest(await readJson(manifestPath, null));
            claimManifests.push(claimManifest);
            if (claimManifest.claimId !== record.claimId ||
                claimManifest.renderId !== record.renderId ||
                claimManifest.output.path !== record.output.path ||
                claimManifest.output.sha256 !== record.output.sha256 ||
                claimManifest.manifestId !== workspaceManifestId(claimManifest.renderId, claimManifest.output.path, claimManifest.output.sha256)) {
                manifestSetMatches = false;
            }
        }
        catch {
            manifestSetMatches = false;
        }
    }
    if (claimManifests.length !== manifest.claimWorkspaces.length)
        manifestSetMatches = false;
    const outputHashesMatch = indexHashMatches && claimOutputHashesMatch;
    if (!outputHashesMatch)
        reasons.push("Rendered Markdown hash does not match its manifest.");
    if (!manifestSetMatches)
        reasons.push("Claim workspace output or manifest set is incomplete or inconsistent.");
    if (manifest.batchId !== batchId ||
        manifest.output.path !== paths.indexRelativePath ||
        manifest.manifestId !== workspaceManifestId(manifest.renderId, manifest.output.path, manifest.output.sha256)) {
        reasons.push("Workspace index identity or path is invalid.");
        manifestSetMatches = false;
    }
    let inputsMatch = false;
    let rendererMatches = false;
    try {
        const input = await loadEvidenceReviewWorkspaceData(workspace, batchId);
        const expectedClaims = input.claims.map((claim) => createExpectedClaimManifestInput(input, claim));
        const storedClaims = new Map(claimManifests.map((claim) => [claim.claimId, claim]));
        const claimInputsMatch = expectedClaims.every((expected) => {
            const stored = storedClaims.get(expected.claimId);
            return stored &&
                stored.renderId === expected.renderId &&
                stableJson(stored.input) === stableJson(expected.input) &&
                stored.templateId === expected.templateId;
        });
        const expectedIndexInput = indexInputSha256(input, expectedClaims);
        inputsMatch =
            claimInputsMatch &&
                manifest.input.batch.sha256 === input.batchSha256 &&
                manifest.input.batchManifest.sha256 === input.batchManifestSha256 &&
                manifest.input.targetSha256 === input.targetSha256 &&
                manifest.input.requirementModelSha256 === input.requirementModelSha256 &&
                manifest.input.requirementManifestSha256 === input.requirementManifestSha256 &&
                manifest.input.claimsSha256 === input.claimsSha256 &&
                manifest.input.evidenceSha256 === input.evidenceSha256 &&
                manifest.input.sourcesSha256 === input.sourcesSha256 &&
                manifest.input.normalizedInputSha256 === expectedIndexInput &&
                manifest.renderId === indexRenderId(batchId, expectedIndexInput);
        const batchStatus = await getEvidenceReviewBatchStatus(workspace, batchId);
        if (batchStatus.status !== "current") {
            inputsMatch = false;
            reasons.push(`Canonical review batch is ${batchStatus.status}.`);
        }
        rendererMatches =
            manifest.renderer.name === EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME &&
                manifest.renderer.version === EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION &&
                claimManifests.every((claim) => claim.renderer.name === EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME &&
                    claim.renderer.version === EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION);
    }
    catch (error) {
        reasons.push(`Canonical rendering input is invalid: ${errorMessage(error)}`);
    }
    if (!inputsMatch)
        reasons.push("Canonical batch, template, evidence, provenance, or requirement input changed.");
    if (!rendererMatches)
        reasons.push("Review workspace renderer version changed.");
    const invalid = !outputHashesMatch || !manifestSetMatches;
    return {
        ...base,
        targetId: manifest.targetId,
        outputHashesMatch,
        manifestSetMatches,
        inputsMatch,
        rendererMatches,
        claimWorkspaceCount: manifest.claimWorkspaces.length,
        status: invalid ? "invalid" : inputsMatch && rendererMatches ? "current" : "stale",
        reasons: unique(reasons),
    };
}
export function evidenceReviewWorkspacePaths(workspace, batchId) {
    const batchPaths = evidenceReviewBatchPaths(workspace, batchId);
    const rootRelativePath = `${batchPaths.rootRelativePath}/${WORKSPACE_DIR}`;
    const indexRelativePath = `${rootRelativePath}/${INDEX_FILE}`;
    const indexManifestRelativePath = `${rootRelativePath}/${INDEX_MANIFEST_FILE}`;
    return {
        rootRelativePath,
        rootPath: resolveWithin(workspace, rootRelativePath),
        indexRelativePath,
        indexPath: resolveWithin(workspace, indexRelativePath),
        indexManifestRelativePath,
        indexManifestPath: resolveWithin(workspace, indexManifestRelativePath),
    };
}
export function formatEvidenceReviewWorkspaceResult(result) {
    return [
        `Batch ID: ${result.batchId}`,
        `Target ID: ${result.targetId}`,
        `Render result: ${result.result}`,
        `Rendering ID: ${result.renderId}`,
        `Index: ${result.indexPath}`,
        `Index manifest: ${result.indexManifestPath}`,
        `Claim workspaces: ${result.claimWorkspaceCount}`,
        ...result.claimWorkspacePaths.map((entry) => `- ${entry}`),
    ].join("\n");
}
export function formatEvidenceReviewWorkspaceStatus(status) {
    return [
        `Batch ID: ${status.batchId}`,
        `Target ID: ${status.targetId ?? "unknown"}`,
        `Status: ${status.status}`,
        `Index exists: ${status.indexExists ? "yes" : "no"}`,
        `Index manifest exists: ${status.indexManifestExists ? "yes" : "no"}`,
        `Output hashes match: ${formatCheck(status.outputHashesMatch)}`,
        `Manifest set matches: ${formatCheck(status.manifestSetMatches)}`,
        `Inputs match: ${formatCheck(status.inputsMatch)}`,
        `Renderer matches: ${formatCheck(status.rendererMatches)}`,
        `Claim workspaces: ${status.claimWorkspaceCount}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
export async function loadEvidenceReviewWorkspaceData(workspace, batchId) {
    const batchPaths = evidenceReviewBatchPaths(workspace, batchId);
    const batch = EvidenceReviewBatchSchema.parse(await readJson(batchPaths.batchPath, null));
    const batchManifest = EvidenceReviewBatchManifestSchema.parse(await readJson(batchPaths.manifestPath, null));
    if (batch.id !== batchId || batchManifest.batchId !== batchId) {
        throw new Error("Batch identity does not match the requested workspace.");
    }
    const target = await showTarget(workspace, batch.targetId);
    if (target.type !== "job")
        throw new Error(`Review workspace requires a Job Target: ${batch.targetId}`);
    const requirementModelPath = resolveWithin(workspace, batch.input.requirementModelPath);
    const requirementManifestPath = resolveWithin(workspace, batch.input.requirementManifestPath);
    const requirementModel = JobRequirementModelSchema.parse(await readJson(requirementModelPath, null));
    if (requirementModel.targetId !== batch.targetId) {
        throw new Error("Requirement Model belongs to another target.");
    }
    const claimsPath = resolveWithin(workspace, batch.input.claimsPath);
    const evidencePath = resolveWithin(workspace, batch.input.evidencePath);
    const sourcesPath = resolveWithin(workspace, "kb/sources.json");
    const claims = (await readJson(claimsPath, [])).map((entry) => ClaimSchema.parse(entry));
    const evidence = (await readJson(evidencePath, [])).map((entry) => EvidenceItemSchema.parse(entry));
    const sources = (await readJson(sourcesPath, [])).map((entry) => SourceSchema.parse(entry));
    const claimById = new Map(claims.map((entry) => [entry.id, entry]));
    const evidenceById = new Map(evidence.map((entry) => [entry.id, entry]));
    const sourceById = new Map(sources.map((entry) => [entry.id, entry]));
    const requirementById = new Map(requirementModel.requirements.map((entry) => [entry.id, entry]));
    const templateByPath = new Map(batchManifest.templateFiles.map((entry) => [entry.path, entry]));
    const selectedEntries = batch.claims.filter(({ selectedForControlledReview }) => selectedForControlledReview);
    if (selectedEntries.length !== batch.controlledReviewSubsetClaimIds.length) {
        throw new Error("Controlled review subset does not match selected batch entries.");
    }
    const claimInputs = [];
    for (const entry of selectedEntries) {
        const claim = claimById.get(entry.claimId);
        if (!claim)
            throw new Error(`Batch references missing claim: ${entry.claimId}`);
        if (!entry.reviewInputTemplatePath) {
            throw new Error(`Selected claim is missing its review template: ${entry.claimId}`);
        }
        const templateRecord = templateByPath.get(entry.reviewInputTemplatePath);
        if (!templateRecord)
            throw new Error(`Batch manifest does not register template: ${entry.claimId}`);
        const templatePath = resolveWithin(workspace, entry.reviewInputTemplatePath);
        const template = EvidenceReviewInputTemplateSchema.parse(await readJson(templatePath, null));
        if (template.templateForClaimId !== claim.id || template.reviewInput.claimId !== claim.id) {
            throw new Error(`Review template claim identity is invalid: ${claim.id}`);
        }
        const linkedEvidence = entry.evidenceItemIds.map((id) => {
            const item = evidenceById.get(id);
            if (!item)
                throw new Error(`Batch references missing evidence: ${id}`);
            return item;
        }).sort(byId);
        const linkedSources = unique(linkedEvidence.flatMap(({ sourceIds }) => sourceIds)).map((id) => {
            const source = sourceById.get(id);
            if (!source)
                throw new Error(`Evidence references missing source provenance: ${id}`);
            return source;
        }).sort(byId);
        const linkedRequirements = entry.matchingRequirementIds.map((id) => {
            const requirement = requirementById.get(id);
            if (!requirement)
                throw new Error(`Batch references missing requirement: ${id}`);
            return requirement;
        }).sort(byId);
        const templateSha256 = await hashFile(templatePath);
        const claimRecordSha256 = hashText(stableJson(claim));
        const evidenceSetSha256 = hashText(stableJson(linkedEvidence));
        const provenanceSetSha256 = hashText(stableJson(linkedSources));
        const requirementSetSha256 = hashText(stableJson(linkedRequirements));
        const templateId = `evidence-review-input-template_${hashText(stableJson({
            claimId: claim.id,
            path: entry.reviewInputTemplatePath,
            sha256: templateSha256,
        })).slice(0, 20)}`;
        const normalizedInputSha256 = hashText(stableJson({
            renderer: {
                name: EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME,
                version: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
            },
            batchId,
            batchEntry: entry,
            templateId,
            templateSha256,
            claimRecordSha256,
            evidenceSetSha256,
            provenanceSetSha256,
            requirementSetSha256,
        }));
        claimInputs.push({
            entry,
            claim,
            evidence: linkedEvidence,
            sources: linkedSources,
            requirements: linkedRequirements,
            template,
            templateId,
            templatePath: entry.reviewInputTemplatePath,
            templateSha256,
            claimRecordSha256,
            evidenceSetSha256,
            provenanceSetSha256,
            requirementSetSha256,
            normalizedInputSha256,
            renderId: claimRenderId(batchId, claim.id, normalizedInputSha256),
        });
    }
    return {
        batch,
        batchManifest,
        batchSha256: await hashFile(batchPaths.batchPath),
        batchManifestSha256: await hashFile(batchPaths.manifestPath),
        target,
        targetSha256: await hashFile(resolveWithin(workspace, batch.input.targetPath)),
        requirementModel,
        requirementModelSha256: await hashFile(requirementModelPath),
        requirementManifestSha256: await hashFile(requirementManifestPath),
        claimsSha256: await hashFile(claimsPath),
        evidenceSha256: await hashFile(evidencePath),
        sourcesSha256: await hashFile(sourcesPath),
        claims: claimInputs,
    };
}
function renderClaimMarkdown(input, item) {
    const evidenceCategories = unique(item.evidence.map(({ category }) => category));
    const sourcesByEvidence = new Map(item.evidence.map((evidence) => [
        evidence.id,
        evidence.sourceIds.map((sourceId) => item.sources.find(({ id }) => id === sourceId)),
    ]));
    const claimTitle = deriveHumanTitle(item.claim.claim, "Untitled claim");
    const lines = [
        READ_ONLY_BANNER,
        "",
        `# Review Claim: ${escapeMarkdownInline(claimTitle)}`,
        "",
        "## Purpose",
        "",
        "Assess whether this exact claim is factually supported, correctly scoped, public-safe, resume-ready, and eligible for Role or Job use.",
        "",
        "## Target and Review Context",
        "",
        `- Target: ${targetLabel(input.target)}`,
        `- Priority: ${item.entry.priority}`,
        `- Reason selected: ${evidenceReviewSelectionReason(item.entry)}`,
        "",
        "## Claim Being Reviewed",
        "",
        quoteMarkdown(item.claim.claim),
        "",
        "## Current Review State",
        "",
        "- Reviewer decision: not submitted in the canonical JSON template",
        `- Source approval status: ${item.claim.approvalStatus}`,
        `- Source output readiness: ${item.claim.outputReadiness}`,
        `- Public-safe: ${item.claim.publicSafe ? "yes" : "no"}`,
        `- Needs confirmation: ${item.claim.needsConfirmation ? "yes" : "no"}`,
        `- Metric status: ${item.claim.metricStatus}`,
        "- Role Matching eligibility: not decided",
        "- Job Mapping eligibility: not decided",
        "",
        "This workspace grants no approval or eligibility. Only a submitted canonical JSON review can change review state.",
        "",
        "## Claim Classification",
        "",
        `- Claim type: ${item.claim.type}`,
        `- Work context: ${display(item.claim.sourceSection)}`,
        `- Date range: ${display(item.claim.dateRange)}`,
        `- Evidence categories: ${displayList(evidenceCategories)}`,
        "- Reviewed work context: not decided",
        "- Reviewed claim nature: not decided",
        "",
        "## Supporting Evidence",
        "",
        ...item.evidence.flatMap((evidence, index) => [
            `### Evidence ${index + 1}: ${escapeMarkdownInline(deriveHumanTitle(evidence.normalizedSummary, "Untitled evidence"))}`,
            "",
            quoteMarkdown(evidence.normalizedSummary),
            "",
            "**Exact source excerpt**",
            "",
            quoteMarkdown(evidence.text),
            "",
            `- Category: ${evidence.category}`,
            `- Confidence: ${evidence.confidence}`,
            `- Visibility: ${evidence.visibility}`,
            `- Date range: ${display(evidence.dateRange)}`,
            `- Company: ${display(evidence.company)}`,
            `- Project: ${display(evidence.project)}`,
            `- Source section: ${display(evidence.sourceSection)}`,
            `- Technologies: ${displayList(evidence.technologies)}`,
            `- Domains: ${displayList(evidence.domains)}`,
            "",
        ]),
        "",
        "## Matching Job Requirements",
        "",
        ...(item.requirements.length === 0
            ? ["No matching Job Requirement references were recorded by this batch.", ""]
            : item.requirements.flatMap((requirement, index) => [
                `### Requirement ${index + 1}: ${escapeMarkdownInline(deriveHumanTitle(requirement.normalizedLabel, "Untitled requirement"))}`,
                "",
                quoteMarkdown(requirement.sourceText),
                "",
                `- Category: ${requirement.category}`,
                `- Necessity: ${requirement.necessity}`,
                `- Confidence: ${requirement.confidence}`,
                `- Explicitness: ${requirement.explicitness}`,
                `- Named technologies: ${displayList(requirement.namedTechnologies)}`,
                `- Keywords: ${displayList(requirement.keywords)}`,
                "",
            ])),
        "",
        "## Reviewer Decision Workspace",
        "",
        "The canonical JSON review template currently contains no decision. Reviewers should decide whether to approve, qualify, edit, reject, defer, or mark the claim as insufficiently supported.",
        "",
        "- Decision: not submitted",
        "- Corrected wording: not submitted",
        "- Required qualifiers: none submitted",
        "- Factual support: not submitted",
        "- Scope: not submitted",
        "- Public safety: not submitted",
        "- Resume readiness: not submitted",
        "- Metric review: not submitted",
        "",
        "Submit decisions through the canonical JSON template; this Markdown is never parsed.",
        "",
        "## Validation Checklist",
        "",
        "- [ ] Claim wording is supported by the evidence",
        "- [ ] Scope is accurate and not overstated",
        "- [ ] Project and employment context remain distinct",
        "- [ ] Responsibility is not presented as achievement",
        "- [ ] Public-safety and resume-readiness states are explicit",
        "- [ ] Role and Job eligibility are explicit",
        "- [ ] Any metric is verified exactly",
        "",
        "## Risks and Warnings",
        "",
        "- Priority and terminology overlap organize review work; they do not prove support or fit.",
        "- Generic-only or non-public evidence must not be copied into public output without an approved safe projection.",
        "- Private reviewer rationale is intentionally absent from this derived workspace.",
        "",
        renderNextAction(`Complete and submit the canonical review template at ${inlineCode(item.templatePath)}. Do not edit this Markdown.`),
        "",
        "## Internal References and Provenance",
        "",
        `- Claim ID: ${inlineCode(item.claim.id)}`,
        `- Batch ID: ${inlineCode(input.batch.id)}`,
        `- Review Template ID: ${inlineCode(item.templateId)}`,
        `- Workspace Rendering ID: ${inlineCode(item.renderId)}`,
        `- Claim parent role ID: ${displayCode(item.claim.parentRoleId)}`,
        `- Claim parent project ID: ${displayCode(item.claim.parentProjectId)}`,
        `- Claim record SHA-256: ${inlineCode(item.claimRecordSha256)}`,
        `- Reviewed claim text SHA-256: ${inlineCode(item.template.reviewedClaimSha256)}`,
        `- Review template SHA-256: ${inlineCode(item.templateSha256)}`,
        `- Evidence set SHA-256: ${inlineCode(item.evidenceSetSha256)}`,
        `- Provenance set SHA-256: ${inlineCode(item.provenanceSetSha256)}`,
        `- Requirement set SHA-256: ${inlineCode(item.requirementSetSha256)}`,
        "",
        ...item.evidence.flatMap((evidence, index) => [
            `### Evidence ${index + 1} References`,
            "",
            `- Evidence ID: ${inlineCode(evidence.id)}`,
            `- Parent role ID: ${displayCode(evidence.parentRoleId)}`,
            `- Parent project ID: ${displayCode(evidence.parentProjectId)}`,
            `- Evidence record SHA-256: ${inlineCode(hashText(stableJson(evidence)))}`,
            ...sourcesByEvidence.get(evidence.id).flatMap((source) => [
                `- Source label: ${escapeMarkdownInline(source.title || source.type)}`,
                `- Source ID: ${inlineCode(source.id)}`,
                `- Source type: ${source.type}`,
                `- Source content SHA-256: ${inlineCode(source.hash)}`,
                `- Source visibility: ${source.visibility}`,
                `- Source status: ${source.status}`,
            ]),
            "",
        ]),
        ...item.requirements.flatMap((requirement, index) => [
            `### Requirement ${index + 1} References`,
            "",
            `- Requirement ID: ${inlineCode(requirement.id)}`,
            `- Source analysis item ID: ${inlineCode(requirement.provenance.sourceAnalysisItemId)}`,
            `- Source section ID: ${displayCode(requirement.provenance.sourceSectionId ?? undefined)}`,
            ...requirement.provenance.sourceReferences.flatMap((reference) => [
                `- Source reference: ${inlineCode(reference.path)} lines ${reference.startLine}-${reference.endLine}`,
                `- Source SHA-256: ${inlineCode(reference.sha256)}`,
                `- Excerpt SHA-256: ${inlineCode(reference.excerptSha256)}`,
                `- Byte offsets: ${displayOffsets(reference.startOffset, reference.endOffset)}`,
            ]),
            "",
        ]),
    ];
    return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}
function renderIndexMarkdown(input, renderId) {
    const selectedPriority = {
        high: input.claims.filter(({ entry }) => entry.priority === "high").length,
        medium: input.claims.filter(({ entry }) => entry.priority === "medium").length,
        low: input.claims.filter(({ entry }) => entry.priority === "low").length,
    };
    const targetLabel = [
        input.target.title,
        input.target.company,
        input.target.location,
        input.target.workingModel,
    ].filter(Boolean).join(" | ");
    const priorityGroups = ["high", "medium", "low"].flatMap((priority) => {
        const claims = input.claims.filter(({ entry }) => entry.priority === priority);
        if (claims.length === 0)
            return [];
        return [
            `### ${priority[0].toUpperCase()}${priority.slice(1)} Priority`,
            "",
            ...claims.flatMap((claim) => [
                `- [${escapeMarkdownInline(deriveHumanTitle(claim.claim.claim, "Untitled claim"))}](./${claimFileName(claim.claim.id)})`,
                `  - Why selected: ${evidenceReviewSelectionReason(claim.entry)}`,
                `  - Claim ID: ${inlineCode(claim.claim.id)}`,
            ]),
            "",
        ];
    });
    const lines = [
        READ_ONLY_BANNER,
        "",
        "# Evidence Review Workspace",
        "",
        "## Purpose",
        "",
        "Review a controlled set of candidate claims against their supporting evidence and the exact requirements that caused them to be selected.",
        "",
        "## Target",
        "",
        `- Target: ${targetLabel}`,
        "",
        "## Current Review State",
        "",
        `- Claims selected for controlled review: ${input.claims.length}`,
        "- Completed decisions represented by this workspace: 0",
        `- Pending canonical JSON submissions: ${input.claims.length}`,
        `- High: ${input.batch.priorityCounts.high} candidates; ${selectedPriority.high} selected`,
        `- Medium: ${input.batch.priorityCounts.medium} candidates; ${selectedPriority.medium} selected`,
        `- Low: ${input.batch.priorityCounts.low} candidates; ${selectedPriority.low} selected`,
        "",
        "All canonical review templates are intentionally blank. This workspace displays review context but grants no approval, eligibility, or fit.",
        "",
        "## Claims to Review",
        "",
        ...priorityGroups,
        "## Warnings and Limitations",
        "",
        `- ${input.batch.warning}`,
        "- Matching terminology is a review-selection signal, not proof that a claim satisfies a requirement.",
        "- Private reviewer rationale and raw model responses are not included.",
        "- Markdown is presentation-only and is never parsed or consumed by ProofLayer.",
        "",
        renderNextAction(input.claims.length > 0
            ? "Open the first high-priority claim workspace, evaluate its evidence and requirement context, then submit the decision through that claim's canonical JSON review template."
            : "No claim review is pending for this batch."),
        "",
        "## Internal References",
        "",
        `- Batch ID: ${inlineCode(input.batch.id)}`,
        `- Target ID: ${inlineCode(input.target.id)}`,
        `- Batch creation time: ${input.batch.createdAt}`,
        `- Workspace Rendering ID: ${inlineCode(renderId)}`,
        "",
    ];
    return `${lines.join("\n")}\n`;
}
function createClaimManifest(input, claim, outputPath, outputSha256, createdAt, updatedAt) {
    const expected = createExpectedClaimManifestInput(input, claim);
    return {
        schemaVersion: 1,
        manifestId: workspaceManifestId(expected.renderId, outputPath, outputSha256),
        artifactType: "evidence-review-workspace-claim",
        renderId: expected.renderId,
        batchId: input.batch.id,
        claimId: claim.claim.id,
        templateId: claim.templateId,
        renderer: {
            name: EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME,
            version: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
            mode: "deterministic",
        },
        output: { path: outputPath, sha256: outputSha256 },
        input: expected.input,
        createdAt,
        updatedAt,
    };
}
function createExpectedClaimManifestInput(input, claim) {
    return {
        claimId: claim.claim.id,
        renderId: claim.renderId,
        templateId: claim.templateId,
        input: {
            batch: {
                path: evidenceReviewBatchPaths("", input.batch.id).batchRelativePath,
                sha256: input.batchSha256,
            },
            batchManifest: {
                path: evidenceReviewBatchPaths("", input.batch.id).manifestRelativePath,
                sha256: input.batchManifestSha256,
            },
            template: {
                path: claim.templatePath,
                sha256: claim.templateSha256,
            },
            claimRecordSha256: claim.claimRecordSha256,
            evidenceSetSha256: claim.evidenceSetSha256,
            provenanceSetSha256: claim.provenanceSetSha256,
            requirementSetSha256: claim.requirementSetSha256,
            normalizedInputSha256: claim.normalizedInputSha256,
        },
    };
}
function createIndexManifest(input, renderId, normalizedInputSha256, outputPath, outputSha256, claimWorkspaces, createdAt, updatedAt) {
    const batchPaths = evidenceReviewBatchPaths("", input.batch.id);
    return {
        schemaVersion: 1,
        manifestId: workspaceManifestId(renderId, outputPath, outputSha256),
        artifactType: "evidence-review-workspace-index",
        renderId,
        batchId: input.batch.id,
        targetId: input.target.id,
        renderer: {
            name: EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME,
            version: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
            mode: "deterministic",
        },
        output: { path: outputPath, sha256: outputSha256 },
        input: {
            batch: { path: batchPaths.batchRelativePath, sha256: input.batchSha256 },
            batchManifest: {
                path: batchPaths.manifestRelativePath,
                sha256: input.batchManifestSha256,
            },
            targetSha256: input.targetSha256,
            requirementModelSha256: input.requirementModelSha256,
            requirementManifestSha256: input.requirementManifestSha256,
            claimsSha256: input.claimsSha256,
            evidenceSha256: input.evidenceSha256,
            sourcesSha256: input.sourcesSha256,
            normalizedInputSha256,
        },
        claimWorkspaces,
        createdAt,
        updatedAt,
    };
}
function indexInputSha256(input, claims) {
    return hashText(stableJson({
        renderer: {
            name: EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME,
            version: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
        },
        batchId: input.batch.id,
        batchSha256: input.batchSha256,
        batchManifestSha256: input.batchManifestSha256,
        targetSha256: input.targetSha256,
        requirementModelSha256: input.requirementModelSha256,
        requirementManifestSha256: input.requirementManifestSha256,
        claimsSha256: input.claimsSha256,
        evidenceSha256: input.evidenceSha256,
        sourcesSha256: input.sourcesSha256,
        claims: claims.map(({ claimId, renderId, templateId, input: claimInput }) => ({
            claimId,
            renderId,
            templateId,
            normalizedInputSha256: claimInput.normalizedInputSha256,
        })),
    }));
}
function claimWorkspacePaths(workspace, batchId, claimId) {
    if (!/^[A-Za-z0-9._-]+$/.test(claimId))
        throw new Error(`Unsafe claim ID: ${claimId}`);
    const root = evidenceReviewWorkspacePaths(workspace, batchId);
    const outputRelativePath = `${root.rootRelativePath}/${claimFileName(claimId)}`;
    const manifestRelativePath = `${root.rootRelativePath}/${claimId}.manifest.json`;
    return {
        outputRelativePath,
        outputPath: resolveWithin(workspace, outputRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
function claimFileName(claimId) {
    return `${claimId}.review.md`;
}
function claimRenderId(batchId, claimId, normalizedInputSha256) {
    return `evidence-review-workspace-claim_${hashText(stableJson({
        batchId,
        claimId,
        normalizedInputSha256,
        rendererVersion: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
    })).slice(0, 20)}`;
}
function indexRenderId(batchId, normalizedInputSha256) {
    return `evidence-review-workspace-index_${hashText(stableJson({
        batchId,
        normalizedInputSha256,
        rendererVersion: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
    })).slice(0, 20)}`;
}
function workspaceManifestId(renderId, outputPath, outputSha256) {
    return `evidence-review-workspace-manifest_${hashText(stableJson({
        renderId,
        outputPath,
        outputSha256,
    })).slice(0, 20)}`;
}
function renderResult(manifest, result) {
    return {
        batchId: manifest.batchId,
        targetId: manifest.targetId,
        result,
        renderId: manifest.renderId,
        indexPath: manifest.output.path,
        indexManifestPath: evidenceReviewWorkspacePaths("", manifest.batchId).indexManifestRelativePath,
        claimWorkspaceCount: manifest.claimWorkspaces.length,
        claimWorkspacePaths: manifest.claimWorkspaces.map(({ output }) => output.path),
    };
}
export function evidenceReviewSelectionReason(entry) {
    const explanations = {
        "mandatory-requirement-terminology": "overlaps wording from a mandatory requirement",
        "preferred-requirement-terminology": "overlaps wording from a preferred requirement",
        "contextual-requirement-terminology": "overlaps wording from a contextual expectation",
        "named-technology-or-domain": "shares an explicitly named technology or domain",
        "reviewed-category": "comes from a review-relevant evidence category",
        "potential-metric": "may contain a metric that requires exact verification",
        "no-explicit-overlap": "was selected as a low-priority control without explicit requirement wording overlap",
    };
    const basis = entry.priorityBasis.map((value) => explanations[value]).join("; ");
    const terms = entry.matchingTerms.length
        ? ` Shared terms: ${entry.matchingTerms.join(", ")}.`
        : " No shared requirement terms were recorded.";
    return `${basis}.${terms}`;
}
function targetLabel(target) {
    return [
        target.title,
        target.company,
        target.location,
        target.workingModel,
    ].filter(Boolean).join(" | ");
}
function display(value) {
    return value?.trim() ? value : "not recorded";
}
function displayCode(value) {
    return value ? inlineCode(value) : "not recorded";
}
function displayList(value) {
    return value?.length ? value.join(", ") : "none recorded";
}
function displayOffsets(start, end) {
    return start === undefined || end === undefined ? "not recorded" : `${start}-${end}`;
}
function parseClaimManifest(value) {
    if (!isRecord(value) || value.schemaVersion !== 1 ||
        value.artifactType !== "evidence-review-workspace-claim" ||
        typeof value.manifestId !== "string" || typeof value.renderId !== "string" ||
        typeof value.batchId !== "string" || typeof value.claimId !== "string" ||
        typeof value.templateId !== "string" || !isRenderer(value.renderer) ||
        !isDependency(value.output) || !isRecord(value.input) ||
        !isDependency(value.input.batch) || !isDependency(value.input.batchManifest) ||
        !isDependency(value.input.template) ||
        !stringsAt(value.input, [
            "claimRecordSha256",
            "evidenceSetSha256",
            "provenanceSetSha256",
            "requirementSetSha256",
            "normalizedInputSha256",
        ]) ||
        typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") {
        throw new Error("Malformed claim workspace manifest.");
    }
    return value;
}
function parseIndexManifest(value) {
    if (!isRecord(value) || value.schemaVersion !== 1 ||
        value.artifactType !== "evidence-review-workspace-index" ||
        typeof value.manifestId !== "string" || typeof value.renderId !== "string" ||
        typeof value.batchId !== "string" || typeof value.targetId !== "string" ||
        !isRenderer(value.renderer) || !isDependency(value.output) ||
        !isRecord(value.input) || !isDependency(value.input.batch) ||
        !isDependency(value.input.batchManifest) ||
        !stringsAt(value.input, [
            "targetSha256",
            "requirementModelSha256",
            "requirementManifestSha256",
            "claimsSha256",
            "evidenceSha256",
            "sourcesSha256",
            "normalizedInputSha256",
        ]) ||
        !Array.isArray(value.claimWorkspaces) ||
        !value.claimWorkspaces.every((entry) => isRecord(entry) && typeof entry.claimId === "string" &&
            typeof entry.renderId === "string" && isDependency(entry.output) &&
            isDependency(entry.manifest)) ||
        typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") {
        throw new Error("Malformed index workspace manifest.");
    }
    return value;
}
async function readClaimManifestIfValid(filePath) {
    if (!(await pathExists(filePath)))
        return null;
    try {
        return parseClaimManifest(await readJson(filePath, null));
    }
    catch {
        return null;
    }
}
async function readIndexManifestIfValid(filePath) {
    if (!(await pathExists(filePath)))
        return null;
    try {
        return parseIndexManifest(await readJson(filePath, null));
    }
    catch {
        return null;
    }
}
function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isDependency(value) {
    return isRecord(value) && typeof value.path === "string" &&
        typeof value.sha256 === "string" && /^[a-f0-9]{64}$/.test(value.sha256);
}
function isRenderer(value) {
    return isRecord(value) && typeof value.name === "string" &&
        typeof value.version === "string" && value.mode === "deterministic";
}
function stringsAt(value, keys) {
    return keys.every((key) => typeof value[key] === "string" && /^[a-f0-9]{64}$/.test(value[key]));
}
function emptyStatus(base, status, reasons) {
    return {
        ...base,
        outputHashesMatch: null,
        manifestSetMatches: null,
        inputsMatch: null,
        rendererMatches: null,
        claimWorkspaceCount: 0,
        status,
        reasons,
    };
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const resolved = path.resolve(root, relativePath);
    const relation = path.relative(root, resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Path escapes workspace: ${relativePath}`);
    }
    return resolved;
}
function unique(values) {
    return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
function byId(left, right) {
    return left.id.localeCompare(right.id);
}
function formatCheck(value) {
    return value === null ? "not applicable" : value ? "yes" : "no";
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
