import { readdir } from "node:fs/promises";
import path from "node:path";
import { hashFile, hashText, pathExists, readJson, writeBufferAtomic, writeJsonAtomic, } from "./fs-utils.js";
import { createModelProviderFromEnvironment, } from "./model-provider.js";
import { ModelRoleResumePlanPayloadSchema, RoleResumeContentPlanSchema, RoleResumePlanProposalManifestSchema, RoleResumePlanProposalSchema, } from "./role-resume-plan-schemas.js";
import { ROLE_RESUME_PLANNING_POLICY_NAME, ROLE_RESUME_PLANNING_POLICY_VERSION, assertRoleResumePlanConsistency, getRoleResumePlanStatus, loadRoleResumePlanningContext, showRoleResumePlan, } from "./role-resume-planning.js";
import { stableJson } from "./target-proposal.js";
export const ROLE_RESUME_PLAN_PROMPT_TEMPLATE_ID = "target-role-resume-plan-proposal";
export const ROLE_RESUME_PLAN_PROMPT_TEMPLATE_VERSION = "1";
export const ROLE_RESUME_PLAN_PROMPT_POLICY_VERSION = "1";
export async function generateRoleResumePlanProposal(workspace, targetId, options = {}) {
    const deterministicStatus = await getRoleResumePlanStatus(workspace, targetId);
    if (deterministicStatus.status !== "current")
        throw new Error(`Deterministic role resume plan must be current before proposal generation. Current status: ${deterministicStatus.status}`);
    const context = await loadRoleResumePlanningContext(workspace, targetId);
    const deterministic = await showRoleResumePlan(workspace, targetId);
    const deterministicPlanSha256 = await hashFile(resolveWithin(workspace, deterministicStatus.planPath));
    const provider = options.provider ?? createModelProviderFromEnvironment();
    const normalizedInput = modelInput(context, deterministic);
    const normalizedModelInputSha256 = hashText(stableJson(normalizedInput));
    const renderedPrompt = renderRoleResumePlanPrompt(normalizedInput);
    const renderedPromptSha256 = hashText(renderedPrompt);
    const requestFingerprint = hashText(stableJson({
        targetSha256: context.targetSha256,
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        approvedMatchingSha256: context.approvedMatchingSha256,
        evidenceSnapshotSha256: context.evidenceSnapshotSha256,
        approvedAssessmentSha256: context.approvedAssessmentSha256,
        deterministicPlanSha256,
        policy: { name: ROLE_RESUME_PLANNING_POLICY_NAME, version: ROLE_RESUME_PLANNING_POLICY_VERSION },
        provider: provider.providerId,
        model: provider.identity.model,
        settings: provider.settings,
        promptTemplateId: ROLE_RESUME_PLAN_PROMPT_TEMPLATE_ID,
        promptTemplateVersion: ROLE_RESUME_PLAN_PROMPT_TEMPLATE_VERSION,
        promptPolicyVersion: ROLE_RESUME_PLAN_PROMPT_POLICY_VERSION,
        normalizedModelInputSha256,
    }));
    if (!options.refresh) {
        const cached = await findCachedProposal(workspace, targetId, requestFingerprint);
        if (cached) {
            const status = await getRoleResumePlanProposalStatus(workspace, cached.id);
            if (status.status === "current")
                return proposalResult(cached, "cache-hit");
        }
    }
    const response = await provider.generate({ renderedPrompt, settings: provider.settings });
    if (!response.rawText.length)
        throw new Error("Model provider returned an empty response.");
    const now = (options.now ?? (() => new Date()))().toISOString();
    const rawHash = hashText(response.rawText);
    const proposalId = `role-resume-plan-proposal_${hashText([requestFingerprint, rawHash, now].join("\0")).slice(0, 16)}`;
    const paths = proposalPaths(workspace, targetId, proposalId);
    const normalized = normalizeResponse(response.rawText, deterministic, context);
    const proposal = RoleResumePlanProposalSchema.parse({
        schemaVersion: 1,
        id: proposalId,
        requestFingerprint,
        targetId,
        targetType: "role",
        mode: "market-positioning",
        status: normalized.issues.length ? "validation-failed" : "ready-for-review",
        planningPolicy: { name: ROLE_RESUME_PLANNING_POLICY_NAME, version: ROLE_RESUME_PLANNING_POLICY_VERSION },
        model: { provider: provider.providerId, model: provider.identity.model, settings: provider.settings },
        prompt: {
            templateId: ROLE_RESUME_PLAN_PROMPT_TEMPLATE_ID,
            templateVersion: ROLE_RESUME_PLAN_PROMPT_TEMPLATE_VERSION,
            policyVersion: ROLE_RESUME_PLAN_PROMPT_POLICY_VERSION,
            renderedPromptSha256,
        },
        input: {
            targetSha256: context.targetSha256,
            approvedInterpretationSha256: context.approvedInterpretationSha256,
            approvedMatchingSha256: context.approvedMatchingSha256,
            evidenceSnapshotSha256: context.evidenceSnapshotSha256,
            approvedAssessmentSha256: context.approvedAssessmentSha256,
            deterministicPlanSha256,
            normalizedModelInputSha256,
        },
        ...(normalized.payload ? { proposedPlan: withProposedTrust(normalized.payload) } : {}),
        validationIssues: normalized.issues,
        rawResponsePath: paths.rawRelativePath,
        rawResponseSha256: rawHash,
        createdAt: now,
        updatedAt: now,
    });
    await writeBufferAtomic(paths.rawPath, Buffer.from(response.rawText, "utf8"));
    await writeJsonAtomic(paths.proposalPath, proposal);
    const manifest = RoleResumePlanProposalManifestSchema.parse({
        schemaVersion: 1,
        proposalId,
        requestFingerprint,
        targetId,
        proposalPath: paths.proposalRelativePath,
        proposalSha256: await hashFile(paths.proposalPath),
        rawResponsePath: paths.rawRelativePath,
        rawResponseSha256: rawHash,
        provider: provider.providerId,
        model: provider.identity.model,
        promptTemplateId: ROLE_RESUME_PLAN_PROMPT_TEMPLATE_ID,
        promptTemplateVersion: ROLE_RESUME_PLAN_PROMPT_TEMPLATE_VERSION,
        policyVersion: ROLE_RESUME_PLAN_PROMPT_POLICY_VERSION,
        renderedPromptSha256,
        normalizedModelInputSha256,
        targetSha256: context.targetSha256,
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        approvedMatchingSha256: context.approvedMatchingSha256,
        evidenceSnapshotSha256: context.evidenceSnapshotSha256,
        approvedAssessmentSha256: context.approvedAssessmentSha256,
        deterministicPlanSha256,
        createdAt: now,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return proposalResult(proposal, normalized.issues.length ? "validation-failed" : "created");
}
export async function showRoleResumePlanProposal(workspace, proposalId) {
    const location = await locateProposal(workspace, proposalId);
    if (!location)
        throw new Error(`Role resume plan proposal not found: ${proposalId}`);
    return RoleResumePlanProposalSchema.parse(await readJson(location.proposalPath, null));
}
export async function listRoleResumePlanProposals(workspace, targetId) {
    const root = resolveWithin(workspace, `targets/roles/${targetId}/resume-planning/proposals`);
    if (!(await pathExists(root)))
        return [];
    const entries = await readdir(root, { withFileTypes: true });
    const proposals = await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
        try {
            return RoleResumePlanProposalSchema.parse(await readJson(path.join(root, entry.name, "proposal.json"), null));
        }
        catch {
            return null;
        }
    }));
    return proposals.filter((entry) => Boolean(entry)).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
export async function getRoleResumePlanProposalStatus(workspace, proposalId) {
    const location = await locateProposal(workspace, proposalId);
    if (!location)
        return { proposalId, targetId: "unknown", proposalExists: false, manifestExists: false, rawResponseExists: false, proposalHashMatches: null, rawResponseHashMatches: null, deterministicPlanHashMatches: null, dependenciesMatch: null, status: "missing", readyForReview: false, reasons: ["Proposal not found."] };
    const proposalExists = await pathExists(location.proposalPath);
    const manifestExists = await pathExists(location.manifestPath);
    if (!proposalExists || !manifestExists)
        return { proposalId, targetId: location.targetId, proposalExists, manifestExists, rawResponseExists: false, proposalHashMatches: null, rawResponseHashMatches: null, deterministicPlanHashMatches: null, dependenciesMatch: null, status: "invalid", readyForReview: false, reasons: ["Proposal artifact set is incomplete."] };
    let proposal;
    let manifest;
    try {
        proposal = RoleResumePlanProposalSchema.parse(await readJson(location.proposalPath, null));
        manifest = RoleResumePlanProposalManifestSchema.parse(await readJson(location.manifestPath, null));
    }
    catch (error) {
        return { proposalId, targetId: location.targetId, proposalExists, manifestExists, rawResponseExists: false, proposalHashMatches: null, rawResponseHashMatches: null, deterministicPlanHashMatches: null, dependenciesMatch: null, status: "invalid", readyForReview: false, reasons: [`Malformed proposal: ${errorMessage(error)}`] };
    }
    const rawPath = resolveWithin(workspace, proposal.rawResponsePath);
    const rawResponseExists = await pathExists(rawPath);
    const proposalHashMatches = await hashFile(location.proposalPath) === manifest.proposalSha256;
    const rawResponseHashMatches = rawResponseExists && await hashFile(rawPath) === manifest.rawResponseSha256 && proposal.rawResponseSha256 === manifest.rawResponseSha256;
    const deterministicStatus = await getRoleResumePlanStatus(workspace, proposal.targetId);
    const deterministicPlanHashMatches = deterministicStatus.status === "current"
        && await hashFile(resolveWithin(workspace, deterministicStatus.planPath)) === manifest.deterministicPlanSha256;
    let dependenciesMatch = false;
    try {
        const context = await loadRoleResumePlanningContext(workspace, proposal.targetId);
        dependenciesMatch = context.targetSha256 === manifest.targetSha256
            && context.approvedInterpretationSha256 === manifest.approvedInterpretationSha256
            && context.approvedMatchingSha256 === manifest.approvedMatchingSha256
            && context.evidenceSnapshotSha256 === manifest.evidenceSnapshotSha256
            && context.approvedAssessmentSha256 === manifest.approvedAssessmentSha256;
    }
    catch {
        dependenciesMatch = false;
    }
    const invalid = !proposalHashMatches || !rawResponseHashMatches || proposal.id !== manifest.proposalId || proposal.requestFingerprint !== manifest.requestFingerprint;
    const stale = !deterministicPlanHashMatches || !dependenciesMatch;
    const status = invalid ? "invalid" : stale ? "stale" : "current";
    return {
        proposalId,
        targetId: proposal.targetId,
        proposalExists,
        manifestExists,
        rawResponseExists,
        proposalHashMatches,
        rawResponseHashMatches,
        deterministicPlanHashMatches,
        dependenciesMatch,
        status,
        readyForReview: status === "current" && proposal.status === "ready-for-review" && proposal.validationIssues.length === 0,
        reasons: [
            ...(!proposalHashMatches ? ["Proposal hash mismatch."] : []),
            ...(!rawResponseHashMatches ? ["Raw response hash mismatch."] : []),
            ...(!deterministicPlanHashMatches ? ["Deterministic plan changed."] : []),
            ...(!dependenciesMatch ? ["Approved planning dependencies changed."] : []),
            ...proposal.validationIssues.map((entry) => entry.message),
        ],
    };
}
export async function replayRoleResumePlanProposal(workspace, proposalId) {
    const status = await getRoleResumePlanProposalStatus(workspace, proposalId);
    if (status.status !== "current")
        throw new Error(`Replay requires a current role resume plan proposal. Current status: ${status.status}`);
    const proposal = await showRoleResumePlanProposal(workspace, proposalId);
    const deterministic = await showRoleResumePlan(workspace, proposal.targetId);
    const context = await loadRoleResumePlanningContext(workspace, proposal.targetId);
    const raw = await import("node:fs/promises").then(({ readFile }) => readFile(resolveWithin(workspace, proposal.rawResponsePath), "utf8"));
    const normalized = normalizeResponse(raw, deterministic, context);
    const replayed = RoleResumePlanProposalSchema.parse({
        ...proposal,
        ...(normalized.payload ? { proposedPlan: withProposedTrust(normalized.payload) } : { proposedPlan: undefined }),
        validationIssues: normalized.issues,
        status: normalized.issues.length ? "validation-failed" : "ready-for-review",
    });
    const originalSha256 = hashText(`${stableJson(proposal)}\n`);
    const replaySha256 = hashText(`${stableJson(replayed)}\n`);
    return { proposalId, originalSha256, replaySha256, matches: originalSha256 === replaySha256 };
}
export function renderRoleResumePlanPrompt(input) {
    return [
        `${ROLE_RESUME_PLAN_PROMPT_TEMPLATE_ID} v${ROLE_RESUME_PLAN_PROMPT_TEMPLATE_VERSION}`,
        "Return strict JSON only using the supplied Role Resume Content Plan payload shape.",
        "Planning selects and structures approved content. Do not write a headline, summary, resume bullet, or finished resume prose.",
        "Preserve every supplied target, expectation, assessment, match, evidence, and plan-element ID exactly.",
        "Do not invent employers, projects, dates, technologies, achievements, metrics, seniority, team size, organizational scope, or authority.",
        "The target title is positioning context, not current or historical employment evidence.",
        "Unsupported expectations remain excluded or deferred. Do not strengthen claim boundaries.",
        "Do not produce job-specific tailoring, ATS scores, hiring probabilities, application recommendations, cover letters, or screening answers.",
        `Policy: ${ROLE_RESUME_PLANNING_POLICY_NAME} v${ROLE_RESUME_PLANNING_POLICY_VERSION}.`,
        stableJson(input),
    ].join("\n\n");
}
export function formatRoleResumePlanProposalResult(result) {
    return [`Target ID: ${result.targetId}`, `Proposal ID: ${result.proposalId}`, `Result: ${result.result}`, `Proposal path: ${result.proposalPath}`, `Manifest path: ${result.manifestPath}`, `Raw response path: ${result.rawResponsePath}`, `Validation issues: ${result.validationIssueCount}`, `Request fingerprint: ${result.requestFingerprint}`].join("\n");
}
export function formatRoleResumePlanProposalList(proposals) {
    return proposals.length ? proposals.map((entry) => `${entry.id} | ${entry.status} | ${entry.createdAt}`).join("\n") : "No role resume plan proposals found.";
}
export function formatRoleResumePlanProposalStatus(status) {
    return [`Proposal ID: ${status.proposalId}`, `Target ID: ${status.targetId}`, `Overall status: ${status.status}`, `Ready for review: ${status.readyForReview ? "yes" : "no"}`, `Proposal hash matches: ${status.proposalHashMatches ?? "n/a"}`, `Raw response hash matches: ${status.rawResponseHashMatches ?? "n/a"}`, `Deterministic plan matches: ${status.deterministicPlanHashMatches ?? "n/a"}`, ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((entry) => `- ${entry}`)] : [])].join("\n");
}
function normalizeResponse(raw, deterministic, context) {
    const issues = [];
    let payload;
    try {
        payload = ModelRoleResumePlanPayloadSchema.parse(JSON.parse(raw));
    }
    catch (error) {
        issues.push({ code: "MALFORMED_OR_SCHEMA_INVALID", message: errorMessage(error) });
        return { payload, issues };
    }
    const output = stableJson(payload);
    const forbidden = [
        [/\b(results-driven|proven track record|experienced technology leader with|led cross-functional teams to|delivered \d+%|award-winning|world-class)\b/i, "FINISHED_RESUME_PROSE"],
        [/\b(ATS score|hiring probability|recommend(?:ed)? (?:applying|application)|cover letter|screening answer)\b/i, "FORBIDDEN_OUTPUT"],
        [/\bcurrent(?:ly)?\s+(?:works?|serves?|employed)\s+as\b/i, "CURRENT_EMPLOYMENT_INFERENCE"],
        [/\b\d+(?:\.\d+)?%\s*(?:fit|match|improvement|growth|revenue)\b/i, "INVENTED_METRIC_OR_SCORE"],
        [/\b(?:manages?|managed|directs?|directed)\s+\d+\b/i, "INVENTED_TEAM_SIZE"],
        [/(?:^|["\n])\s*(?:led|built|delivered|managed|directed|increased|reduced|improved|achieved|launched)\b[^.]{12,}[.!]/im, "RESUME_BULLET_OR_INVENTED_ACHIEVEMENT"],
        [/\b(?:worked|employed|served)\s+(?:at|for)\s+[A-Z][A-Za-z0-9.-]+\b/, "INVENTED_EMPLOYER"],
    ];
    for (const [pattern, code] of forbidden)
        if (pattern.test(output))
            issues.push({ code, message: `Model output violates planning boundary: ${code}.` });
    const scopePattern = /\b(?:enterprise|organization|company)-wide\s+(?:ownership|authority|scope)\b/gi;
    if ((output.match(scopePattern) ?? []).length > (stableJson(deterministic).match(scopePattern) ?? []).length) {
        issues.push({ code: "INVENTED_ORGANIZATIONAL_SCOPE", message: "Model output introduces organizational scope beyond the deterministic guardrails." });
    }
    const numeric = [...output.matchAll(/\b\d+(?:\.\d+)?%?\b/g)].map((entry) => entry[0]);
    const allowedNumbers = new Set([...stableJson(modelInput(context, deterministic)).matchAll(/\b\d+(?:\.\d+)?%?\b/g)].map((entry) => entry[0]));
    if (numeric.some((value) => !allowedNumbers.has(value)))
        issues.push({ code: "INVENTED_METRIC", message: "Model output contains a numeric token absent from approved input." });
    try {
        assertRoleResumePlanProposalAgainstDeterministic(payload, deterministic, context);
    }
    catch (error) {
        issues.push({ code: "INVALID_PLAN_REFERENCE_OR_BOUNDARY", message: errorMessage(error) });
    }
    return { payload, issues };
}
export function assertRoleResumePlanProposalAgainstDeterministic(payload, deterministic, context) {
    assertPlanningVocabulary(payload, deterministic);
    if (payload.positioning.targetRoleTitle !== deterministic.positioning.targetRoleTitle)
        throw new Error("Target role title changed.");
    if (positioningRank(payload.positioning.positioningScope) > positioningRank(deterministic.positioning.positioningScope))
        throw new Error("Positioning scope was strengthened beyond the approved assessment.");
    sameIds(payload.sections, deterministic.sections, "section");
    sameIds(payload.expectationSelections, deterministic.expectationSelections, "expectation selection");
    sameIds(payload.evidenceSelections, deterministic.evidenceSelections, "evidence selection");
    sameIds(payload.claimBoundaries, deterministic.claimBoundaries, "claim boundary");
    sameIds(payload.exclusions, deterministic.exclusions, "exclusion");
    for (const proposed of payload.sections) {
        const base = deterministic.sections.find((entry) => entry.id === proposed.id);
        if (base.type !== proposed.type || (base.status === "exclude" && proposed.status !== "exclude"))
            throw new Error(`Section exceeds deterministic plan: ${proposed.id}`);
    }
    for (const proposed of payload.expectationSelections) {
        const base = deterministic.expectationSelections.find((entry) => entry.id === proposed.id);
        if (proposed.expectationId !== base.expectationId || proposed.assessmentId !== base.assessmentId)
            throw new Error(`Expectation references changed: ${proposed.id}`);
        if (!sameSet(proposed.approvedMatchIds, base.approvedMatchIds) || !sameSet(proposed.evidenceIds, base.evidenceIds))
            throw new Error(`Expectation provenance changed: ${proposed.id}`);
        if (selectionRank(proposed.decision) > selectionRank(base.decision))
            throw new Error(`Expectation selection was strengthened beyond deterministic boundary: ${proposed.id}`);
    }
    for (const proposed of payload.evidenceSelections) {
        const base = deterministic.evidenceSelections.find((entry) => entry.id === proposed.id);
        if (proposed.evidenceId !== base.evidenceId || !sameSet(proposed.approvedMatchIds, base.approvedMatchIds) || !sameSet(proposed.expectationIds, base.expectationIds))
            throw new Error(`Evidence provenance changed: ${proposed.id}`);
        if (evidenceRank(proposed.decision) > evidenceRank(base.decision))
            throw new Error(`Evidence selection was strengthened beyond deterministic boundary: ${proposed.id}`);
    }
    for (const proposed of payload.claimBoundaries) {
        const base = deterministic.claimBoundaries.find((entry) => entry.id === proposed.id);
        if (proposed.expectationId !== base.expectationId || !sameSet(proposed.evidenceIds, base.evidenceIds))
            throw new Error(`Claim boundary provenance changed: ${proposed.id}`);
        if (boundaryRank(proposed.boundaryType) > boundaryRank(base.boundaryType))
            throw new Error(`Claim boundary was strengthened: ${proposed.id}`);
        if (proposed.allowedClaimTypes.some((type) => !base.allowedClaimTypes.includes(type)))
            throw new Error(`Claim type exceeds boundary: ${proposed.id}`);
    }
    const candidate = RoleResumeContentPlanSchema.parse({
        ...deterministic,
        positioning: payload.positioning,
        sections: payload.sections,
        expectationSelections: payload.expectationSelections,
        evidenceSelections: payload.evidenceSelections,
        claimBoundaries: payload.claimBoundaries,
        exclusions: payload.exclusions,
        warnings: payload.warnings,
        ambiguities: payload.ambiguities,
    });
    assertRoleResumePlanConsistency(candidate, context);
}
function modelInput(context, deterministic) {
    return {
        target: { id: context.target.id, type: context.target.type, title: context.target.title, seniority: context.target.seniority, domain: context.target.domain },
        approvedExpectations: context.approvedInterpretation.expectations,
        approvedMatching: { matches: context.approvedMatching.matches, coverage: context.approvedMatching.expectationCoverage },
        approvedAssessment: context.approvedAssessment,
        deterministicPlan: deterministic,
        policy: {
            name: ROLE_RESUME_PLANNING_POLICY_NAME,
            version: ROLE_RESUME_PLANNING_POLICY_VERSION,
            planningOnly: true,
            resumeProseForbidden: true,
            metricsRequireReviewedEvidence: true,
            targetTitleIsNotEmploymentEvidence: true,
        },
    };
}
function withProposedTrust(payload) {
    const mark = (entry) => ({ ...entry, trustState: "proposed" });
    return {
        ...payload,
        positioning: mark({
            ...payload.positioning,
            primaryThemes: payload.positioning.primaryThemes.map(mark),
            secondaryThemes: payload.positioning.secondaryThemes.map(mark),
            differentiationThemes: payload.positioning.differentiationThemes.map(mark),
        }),
        sections: payload.sections.map(mark),
        expectationSelections: payload.expectationSelections.map(mark),
        evidenceSelections: payload.evidenceSelections.map(mark),
        claimBoundaries: payload.claimBoundaries.map(mark),
        exclusions: payload.exclusions.map(mark),
    };
}
function sameIds(a, b, label) {
    if (!sameSet(a.map((entry) => entry.id), b.map((entry) => entry.id)))
        throw new Error(`Proposal ${label} IDs do not exactly match deterministic plan.`);
}
function sameSet(a, b) { return a.length === b.length && [...a].sort().every((value, index) => value === [...b].sort()[index]); }
function selectionRank(value) { return ({ exclude: 0, defer: 1, supporting: 2, secondary: 3, primary: 4 })[value] ?? -1; }
function evidenceRank(value) { return ({ exclude: 0, "limited-use": 1, allowed: 2, preferred: 3 })[value] ?? -1; }
function boundaryRank(value) { return ({ prohibited: 0, "requires-review": 1, "allowed-with-caution": 2, allowed: 3 })[value] ?? -1; }
function positioningRank(value) { return ({ "insufficient-evidence": 0, "stretch-positioning": 1, "adjacent-role-positioning": 2, "direct-role-positioning": 3 })[value] ?? -1; }
function assertPlanningVocabulary(payload, deterministic) {
    const sourceWords = new Set(words(stableJson(deterministic)));
    const planningWords = new Set(words([
        "adjust arrange clarify consolidate contextual de-emphasize defer differentiate emphasize evidence evidence-backed",
        "future group include limit narrow only organize planning prioritize proposed qualified rationale reorder retain reviewed role-planning safe scope",
        "section select structure supporting theme use caution cautious content role approved primary secondary",
    ].join(" ")));
    const unknown = words(stableJson(payload)).filter((word) => !sourceWords.has(word) && !planningWords.has(word));
    if (unknown.length)
        throw new Error(`Proposal introduces unsupported vocabulary: ${[...new Set(unknown)].slice(0, 8).join(", ")}.`);
}
function words(value) {
    return [...value.toLowerCase().matchAll(/[a-z][a-z0-9.+/#-]{2,}/g)].map((entry) => entry[0]);
}
function proposalResult(proposal, result) {
    const paths = proposalPaths("", proposal.targetId, proposal.id, true);
    return { targetId: proposal.targetId, proposalId: proposal.id, result, proposalPath: paths.proposalRelativePath, manifestPath: paths.manifestRelativePath, rawResponsePath: proposal.rawResponsePath, validationIssueCount: proposal.validationIssues.length, requestFingerprint: proposal.requestFingerprint };
}
async function findCachedProposal(workspace, targetId, fingerprint) {
    const proposals = await listRoleResumePlanProposals(workspace, targetId);
    return proposals.find((entry) => entry.requestFingerprint === fingerprint && entry.status === "ready-for-review");
}
function proposalPaths(workspace, targetId, proposalId, relativeOnly = false) {
    const root = `targets/roles/${targetId}/resume-planning/proposals/${proposalId}`;
    const values = { proposalRelativePath: `${root}/proposal.json`, manifestRelativePath: `${root}/proposal-manifest.json`, rawRelativePath: `${root}/raw-model-response.txt` };
    return relativeOnly ? { ...values, proposalPath: "", manifestPath: "", rawPath: "" } : { ...values, proposalPath: resolveWithin(workspace, values.proposalRelativePath), manifestPath: resolveWithin(workspace, values.manifestRelativePath), rawPath: resolveWithin(workspace, values.rawRelativePath) };
}
async function locateProposal(workspace, proposalId) {
    const rolesRoot = path.join(workspace, "targets/roles");
    if (!(await pathExists(rolesRoot)))
        return null;
    for (const target of await readdir(rolesRoot, { withFileTypes: true })) {
        if (!target.isDirectory())
            continue;
        const root = proposalPaths(workspace, target.name, proposalId);
        if (await pathExists(root.proposalPath) || await pathExists(root.manifestPath))
            return { targetId: target.name, ...root };
    }
    return null;
}
function resolveWithin(workspace, relativePath) {
    const absolute = path.resolve(workspace, relativePath);
    const root = path.resolve(workspace);
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`))
        throw new Error("Resolved path leaves workspace.");
    return absolute;
}
function errorMessage(error) { return error instanceof Error ? error.message : String(error); }
