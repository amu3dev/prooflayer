import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { hashBuffer, hashFile, hashText, pathExists, readJson, walkFiles, writeBufferAtomic, writeJsonAtomic, } from "./fs-utils.js";
import { ClaimSchema, EvidenceItemSchema, EvidenceMatchProposalManifestSchema, EvidenceMatchProposalSchema, ModelEvidenceMatchPayloadSchema, } from "./schemas.js";
import { createModelProviderFromEnvironment, } from "./model-provider.js";
import { EVIDENCE_MATCHER_NAME, EVIDENCE_MATCHER_VERSION, EVIDENCE_MATCHING_POLICY_VERSION, expectationProvenance, loadMatchingContext, } from "./evidence-matching.js";
import { showTarget } from "./targets.js";
import { stableJson } from "./target-proposal.js";
export const MATCH_PROPOSAL_PROMPT_TEMPLATE_ID = "target-evidence-match-proposal";
export const MATCH_PROPOSAL_PROMPT_TEMPLATE_VERSION = "1";
export const MATCH_PROPOSAL_POLICY_VERSION = "1";
const PROPOSAL_FILE = "proposal.json";
const MANIFEST_FILE = "proposal-manifest.json";
const RAW_FILE = "raw-model-response.txt";
export async function generateEvidenceMatchProposal(workspace, targetId, options = {}) {
    const context = await loadMatchingContext(workspace, targetId, {
        persistSnapshot: true,
        rebuildSnapshot: options.refresh,
        now: options.now,
    });
    if (context.eligibleExpectations.length === 0)
        throw new Error("No approved expectations are eligible for matching.");
    if (context.snapshot.entries.length === 0)
        throw new Error("No reviewed active evidence is eligible for matching.");
    const evidence = await loadEvidenceContent(workspace, context);
    const provider = options.provider ?? createModelProviderFromEnvironment(options.environment);
    const promptVersion = options.promptTemplateVersion ?? MATCH_PROPOSAL_PROMPT_TEMPLATE_VERSION;
    const policyVersion = options.policyVersion ?? MATCH_PROPOSAL_POLICY_VERSION;
    const normalizedInput = {
        target: { id: context.target.id, type: context.target.type, title: context.target.title },
        expectations: context.eligibleExpectations,
        evidence,
        policy: {
            absenceIsNotContradiction: true,
            noCandidateFacts: true,
            noFitAssessment: true,
            noResumeLanguage: true,
        },
    };
    const normalizedModelInputSha256 = hashText(stableJson(normalizedInput));
    const renderedPrompt = renderEvidenceMatchPrompt(normalizedInput, promptVersion, policyVersion);
    const renderedPromptSha256 = hashText(renderedPrompt);
    const requestFingerprint = hashText(stableJson({
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        eligibleEvidenceSetSha256: context.snapshot.eligibleEvidenceSetSha256,
        matcherName: EVIDENCE_MATCHER_NAME,
        matcherVersion: EVIDENCE_MATCHER_VERSION,
        matchingPolicyVersion: EVIDENCE_MATCHING_POLICY_VERSION,
        provider: provider.providerId,
        model: provider.identity.model,
        settings: provider.settings,
        promptTemplateId: MATCH_PROPOSAL_PROMPT_TEMPLATE_ID,
        promptTemplateVersion: promptVersion,
        policyVersion,
        normalizedModelInputSha256,
    }));
    if (!options.refresh) {
        const cached = await findCached(workspace, targetId, requestFingerprint);
        if (cached)
            return resultFromProposal(cached.proposal, cached.location, "cache-hit");
    }
    const response = await provider.generate({ renderedPrompt, settings: provider.settings });
    if (!response.rawText)
        throw new Error("Model provider returned an empty response.");
    const rawBytes = Buffer.from(response.rawText, "utf8");
    const rawResponseSha256 = hashBuffer(rawBytes);
    const now = (options.now ?? (() => new Date()))().toISOString();
    const count = await countProposals(workspace, context.target);
    const proposalId = `match-proposal_${hashText([requestFingerprint, rawResponseSha256, now, String(count)].join("\u0000")).slice(0, 16)}`;
    const location = proposalLocation(workspace, context.target, proposalId);
    const proposal = normalizeRawProposal({
        rawText: response.rawText,
        proposalId,
        context,
        evidence,
        requestFingerprint,
        provider: provider.providerId,
        model: provider.identity.model,
        settings: provider.settings,
        promptVersion,
        policyVersion,
        renderedPromptSha256,
        normalizedModelInputSha256,
        rawResponsePath: location.rawRelativePath,
        rawResponseSha256,
        createdAt: now,
        updatedAt: now,
    });
    await writeBufferAtomic(location.rawPath, rawBytes);
    await writeJsonAtomic(location.proposalPath, proposal);
    const manifest = EvidenceMatchProposalManifestSchema.parse({
        schemaVersion: 1,
        proposalId,
        requestFingerprint,
        targetId,
        targetType: context.target.type,
        proposalPath: location.proposalRelativePath,
        proposalSha256: await hashFile(location.proposalPath),
        rawResponsePath: location.rawRelativePath,
        rawResponseSha256,
        matcherName: EVIDENCE_MATCHER_NAME,
        matcherVersion: EVIDENCE_MATCHER_VERSION,
        policyVersion,
        provider: provider.providerId,
        model: provider.identity.model,
        promptTemplateId: MATCH_PROPOSAL_PROMPT_TEMPLATE_ID,
        promptTemplateVersion: promptVersion,
        renderedPromptSha256,
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        evidenceSnapshotManifestSha256: context.snapshotManifestSha256,
        eligibleEvidenceSetSha256: context.snapshot.eligibleEvidenceSetSha256,
        normalizedModelInputSha256,
        createdAt: now,
        updatedAt: now,
    });
    await writeJsonAtomic(location.manifestPath, manifest);
    return resultFromProposal(proposal, location, proposal.status === "ready-for-review" ? "created" : "validation-failed");
}
export async function showEvidenceMatchProposal(workspace, proposalId) {
    const located = await locateProposal(workspace, proposalId);
    return EvidenceMatchProposalSchema.parse(await readJson(located.location.proposalPath, null));
}
export async function listEvidenceMatchProposals(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const root = `${targetRoot(target)}/matching/proposals`;
    const files = (await walkFiles(path.join(workspace, root))).filter((file) => path.basename(file) === PROPOSAL_FILE);
    const proposals = await Promise.all(files.map(async (file) => EvidenceMatchProposalSchema.parse(await readJson(file, null))));
    return proposals.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}
export async function getEvidenceMatchProposalStatus(workspace, proposalId) {
    const located = await locateProposal(workspace, proposalId);
    const { location, target } = located;
    const base = {
        proposalId,
        targetId: target.id,
        targetType: target.type,
        proposalPath: location.proposalRelativePath,
        manifestPath: location.manifestRelativePath,
        rawResponsePath: location.rawRelativePath,
    };
    if (!(await pathExists(location.proposalPath)) || !(await pathExists(location.manifestPath)) || !(await pathExists(location.rawPath))) {
        return invalidStatus(base, ["Match proposal artifact set is incomplete."]);
    }
    let proposal;
    let manifest;
    try {
        proposal = EvidenceMatchProposalSchema.parse(await readJson(location.proposalPath, null));
        manifest = EvidenceMatchProposalManifestSchema.parse(await readJson(location.manifestPath, null));
    }
    catch (error) {
        return invalidStatus(base, [`Stored match proposal is malformed: ${errorMessage(error)}`]);
    }
    const proposalHashMatches = (await hashFile(location.proposalPath)) === manifest.proposalSha256;
    const rawResponseHashMatches = (await hashFile(location.rawPath)) === manifest.rawResponseSha256;
    const snapshotManifestPath = resolveWithin(workspace, `${targetRoot(target)}/matching/evidence-snapshot-manifest.json`);
    const evidenceSnapshotManifestHashMatches = (await pathExists(snapshotManifestPath)) &&
        (await hashFile(snapshotManifestPath)) === manifest.evidenceSnapshotManifestSha256;
    const invalidReasons = [];
    if (!proposalHashMatches)
        invalidReasons.push("Proposal SHA-256 does not match its manifest.");
    if (!rawResponseHashMatches)
        invalidReasons.push("Raw model response SHA-256 does not match its manifest.");
    if (proposal.id !== proposalId || manifest.proposalId !== proposalId || proposal.targetId !== target.id || manifest.targetId !== target.id)
        invalidReasons.push("Proposal identity is invalid.");
    if (manifest.proposalPath !== location.proposalRelativePath || manifest.rawResponsePath !== location.rawRelativePath)
        invalidReasons.push("Proposal paths disagree with the manifest.");
    if (invalidReasons.length)
        return invalidStatus(base, invalidReasons, proposalHashMatches, rawResponseHashMatches);
    let context;
    try {
        context = await loadMatchingContext(workspace, target.id, { persistSnapshot: false });
    }
    catch (error) {
        return {
            ...base,
            status: "stale",
            readyForReview: false,
            proposalHashMatches,
            rawResponseHashMatches,
            approvedInterpretationHashMatches: false,
            evidenceSnapshotManifestHashMatches,
            evidenceSnapshotHashMatches: false,
            reasons: [`Current dependencies are unavailable: ${errorMessage(error)}`],
        };
    }
    const approvedInterpretationHashMatches = context.approvedInterpretationSha256 === manifest.approvedInterpretationSha256;
    const evidenceSnapshotHashMatches = context.snapshot.eligibleEvidenceSetSha256 === manifest.eligibleEvidenceSetSha256;
    const staleReasons = [
        ...(!approvedInterpretationHashMatches ? ["Approved interpretation changed."] : []),
        ...(!evidenceSnapshotManifestHashMatches ? ["Evidence snapshot manifest changed or is missing."] : []),
        ...(!evidenceSnapshotHashMatches ? ["Eligible evidence snapshot changed."] : []),
        ...(manifest.matcherName !== EVIDENCE_MATCHER_NAME || manifest.matcherVersion !== EVIDENCE_MATCHER_VERSION ? ["Matcher identity changed."] : []),
        ...(manifest.policyVersion !== MATCH_PROPOSAL_POLICY_VERSION ? ["Match proposal policy changed."] : []),
        ...(manifest.promptTemplateVersion !== MATCH_PROPOSAL_PROMPT_TEMPLATE_VERSION ? ["Match prompt template version changed."] : []),
    ];
    return {
        ...base,
        status: staleReasons.length ? "stale" : proposal.status === "validation-failed" ? "invalid" : "current",
        readyForReview: staleReasons.length === 0 && proposal.status === "ready-for-review",
        proposalHashMatches,
        rawResponseHashMatches,
        approvedInterpretationHashMatches,
        evidenceSnapshotManifestHashMatches,
        evidenceSnapshotHashMatches,
        reasons: staleReasons.length ? staleReasons : proposal.validationIssues.map((issue) => issue.message),
    };
}
export async function replayEvidenceMatchProposal(workspace, proposalId) {
    const status = await getEvidenceMatchProposalStatus(workspace, proposalId);
    if (status.status !== "current")
        throw new Error(`Replay requires a current proposal. Current status: ${status.status}`);
    const located = await locateProposal(workspace, proposalId);
    const original = await showEvidenceMatchProposal(workspace, proposalId);
    const manifest = EvidenceMatchProposalManifestSchema.parse(await readJson(located.location.manifestPath, null));
    const context = await loadMatchingContext(workspace, original.targetId, { persistSnapshot: false });
    const evidence = await loadEvidenceContent(workspace, context);
    const replayed = normalizeRawProposal({
        rawText: await readFile(located.location.rawPath, "utf8"),
        proposalId,
        context,
        evidence,
        requestFingerprint: original.requestFingerprint,
        provider: original.model.provider,
        model: original.model.model,
        settings: original.model.settings,
        promptVersion: original.prompt.templateVersion,
        policyVersion: original.prompt.policyVersion,
        renderedPromptSha256: original.prompt.renderedPromptSha256,
        normalizedModelInputSha256: original.input.normalizedModelInputSha256,
        rawResponsePath: original.rawResponsePath,
        rawResponseSha256: original.rawResponseSha256,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt,
    });
    const replaySha256 = hashText(`${JSON.stringify(replayed, null, 2)}\n`);
    return { proposalId, originalSha256: manifest.proposalSha256, replaySha256, matches: replaySha256 === manifest.proposalSha256 };
}
export function renderEvidenceMatchPrompt(input, templateVersion = MATCH_PROPOSAL_PROMPT_TEMPLATE_VERSION, policyVersion = MATCH_PROPOSAL_POLICY_VERSION) {
    return [
        `Prompt: ${MATCH_PROPOSAL_PROMPT_TEMPLATE_ID} v${templateVersion}; policy v${policyVersion}`,
        "Link only supplied approved target expectations to supplied reviewed eligible evidence using exact IDs and exact provenance.",
        "Never invent candidate facts, achievements, metrics, employers, projects, titles, skills, dates, or impact.",
        "Never evaluate overall fit, calculate a score, recommend applying, generate strengths or weaknesses, or write resume or cover-letter content.",
        "Distinguish direct, supporting, partial, and contradictory evidence. Absence of evidence is unsupported or not-assessed, never contradiction.",
        "Senior titles alone are not direct proof of every leadership expectation. Tool mentions alone are not production expertise. Project existence alone is not business impact.",
        "Keep limitations explicit for supporting, partial, weak, historical, or contradictory links.",
        "Return one strict JSON object with proposedMatches, proposedCoverage, warnings, and ambiguities. Do not use Markdown fences.",
        "INPUT_JSON",
        stableJson(input),
    ].join("\n");
}
export function formatMatchProposalResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Target type: ${result.targetType}`,
        `Proposal ID: ${result.proposalId}`,
        `Result: ${result.result}`,
        `Proposal path: ${result.proposalPath}`,
        `Manifest path: ${result.manifestPath}`,
        `Raw response path: ${result.rawResponsePath}`,
        `Proposed matches: ${result.proposedMatchCount}`,
        `Proposed coverage records: ${result.proposedCoverageCount}`,
        `Validation issues: ${result.validationIssueCount}`,
        `Request fingerprint: ${result.requestFingerprint}`,
    ].join("\n");
}
export function formatMatchProposalList(proposals) {
    if (!proposals.length)
        return "Match proposals: none";
    return ["Match proposals:", ...proposals.map((proposal) => `${proposal.id} | ${proposal.status} | ${proposal.model.model} | ${proposal.createdAt}`)].join("\n");
}
export function formatMatchProposalStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Proposal ID: ${status.proposalId}`,
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Ready for review: ${status.readyForReview ? "yes" : "no"}`,
        `Proposal hash matches: ${check(status.proposalHashMatches)}`,
        `Raw response hash matches: ${check(status.rawResponseHashMatches)}`,
        `Approved interpretation matches: ${check(status.approvedInterpretationHashMatches)}`,
        `Evidence snapshot manifest matches: ${check(status.evidenceSnapshotManifestHashMatches)}`,
        `Evidence snapshot matches: ${check(status.evidenceSnapshotHashMatches)}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
function normalizeRawProposal(input) {
    const issues = [];
    let payload;
    try {
        payload = ModelEvidenceMatchPayloadSchema.parse(JSON.parse(input.rawText));
    }
    catch (error) {
        issues.push(...issuesFromError(error));
    }
    if (payload)
        issues.push(...validatePayload(payload, input.context, input.evidence));
    const proposedMatches = payload && issues.length === 0
        ? payload.proposedMatches.map((match, index) => ({
            id: `proposed-match_${hashText([input.proposalId, match.expectationId, [...match.evidenceIds].sort().join(","), match.matchType, String(index), EVIDENCE_MATCHING_POLICY_VERSION].join("\u0000")).slice(0, 14)}`,
            ...match,
            evidenceIds: [...new Set(match.evidenceIds)].sort(),
            trustState: "proposed",
        })).sort((a, b) => a.id.localeCompare(b.id))
        : [];
    const proposedCoverage = payload && issues.length === 0
        ? payload.proposedCoverage.map((coverage) => ({
            id: `proposed-coverage_${hashText([input.proposalId, coverage.expectationId, coverage.status, EVIDENCE_MATCHING_POLICY_VERSION].join("\u0000")).slice(0, 14)}`,
            ...coverage,
        })).sort((a, b) => a.id.localeCompare(b.id))
        : [];
    const warnings = payload && issues.length === 0
        ? payload.warnings.map((entry, index) => ({ id: `match-warning_${hashText(`${input.proposalId}\u0000${index}\u0000${stableJson(entry)}`).slice(0, 12)}`, ...entry }))
        : [];
    const ambiguities = payload && issues.length === 0
        ? payload.ambiguities.map((entry, index) => ({ id: `match-ambiguity_${hashText(`${input.proposalId}\u0000${index}\u0000${stableJson(entry)}`).slice(0, 12)}`, ...entry }))
        : [];
    return EvidenceMatchProposalSchema.parse({
        schemaVersion: 1,
        id: input.proposalId,
        requestFingerprint: input.requestFingerprint,
        targetId: input.context.target.id,
        targetType: input.context.target.type,
        status: issues.length ? "validation-failed" : "ready-for-review",
        matcher: { name: EVIDENCE_MATCHER_NAME, version: EVIDENCE_MATCHER_VERSION, policyVersion: EVIDENCE_MATCHING_POLICY_VERSION },
        model: { provider: input.provider, model: input.model, settings: input.settings },
        prompt: { templateId: MATCH_PROPOSAL_PROMPT_TEMPLATE_ID, templateVersion: input.promptVersion, policyVersion: input.policyVersion, renderedPromptSha256: input.renderedPromptSha256 },
        input: {
            approvedInterpretationSha256: input.context.approvedInterpretationSha256,
            eligibleEvidenceSetSha256: input.context.snapshot.eligibleEvidenceSetSha256,
            normalizedModelInputSha256: input.normalizedModelInputSha256,
        },
        proposedMatches,
        proposedCoverage,
        warnings,
        ambiguities,
        validationIssues: deduplicateIssues(issues),
        rawResponsePath: input.rawResponsePath,
        rawResponseSha256: input.rawResponseSha256,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
    });
}
function validatePayload(payload, context, evidence) {
    const issues = [];
    const expectationById = new Map(context.eligibleExpectations.map((entry) => [entry.id, entry]));
    const evidenceById = new Map(evidence.map((entry) => [entry.evidenceId, entry]));
    const matchIdentities = new Set();
    payload.proposedMatches.forEach((match, index) => {
        const matchIdentity = [match.expectationId, [...match.evidenceIds].sort().join(","), match.matchType, EVIDENCE_MATCHING_POLICY_VERSION].join("|");
        if (matchIdentities.has(matchIdentity))
            issues.push(issue("DUPLICATE_PROPOSED_MATCH", "Exact duplicate proposed match.", `proposedMatches.${index}`));
        matchIdentities.add(matchIdentity);
        const expectation = expectationById.get(match.expectationId);
        if (!expectation)
            issues.push(issue("UNKNOWN_EXPECTATION_ID", `Unknown or ineligible expectation: ${match.expectationId}`, `proposedMatches.${index}`));
        const linked = match.evidenceIds.map((id) => evidenceById.get(id));
        for (const id of match.evidenceIds)
            if (!evidenceById.has(id))
                issues.push(issue("UNKNOWN_EVIDENCE_ID", `Unknown or ineligible evidence: ${id}`, `proposedMatches.${index}`));
        if (expectation && stableJson(match.expectationProvenance) !== stableJson(expectationProvenance(context, expectation))) {
            issues.push(issue("INVALID_EXPECTATION_PROVENANCE", "Expectation provenance does not match the approved interpretation.", `proposedMatches.${index}.expectationProvenance`));
        }
        const validLinked = linked.filter((entry) => Boolean(entry));
        if (validLinked.length === linked.length) {
            const expectedProvenance = validLinked.map((entry) => entry.provenance).sort((a, b) => a.evidenceId.localeCompare(b.evidenceId));
            const actualProvenance = [...match.evidenceProvenance].sort((a, b) => a.evidenceId.localeCompare(b.evidenceId));
            if (stableJson(expectedProvenance) !== stableJson(actualProvenance))
                issues.push(issue("INVALID_EVIDENCE_PROVENANCE", "Evidence provenance does not match the eligible snapshot.", `proposedMatches.${index}.evidenceProvenance`));
        }
        if (["supporting", "partial", "contradictory"].includes(match.matchType) && match.limitations.length === 0)
            issues.push(issue("MISSING_LIMITATIONS", `${match.matchType} matches require explicit limitations.`, `proposedMatches.${index}.limitations`));
        if (match.matchType === "contradictory" && match.coverage !== "conflicting")
            issues.push(issue("INVALID_CONTRADICTION", "Contradictory matches require conflicting coverage.", `proposedMatches.${index}`));
        if (match.matchType !== "contradictory" && match.coverage === "conflicting")
            issues.push(issue("INVALID_CONTRADICTION", "Conflicting coverage requires contradictory evidence.", `proposedMatches.${index}`));
        if (match.matchType === "contradictory" && !/contradic|conflict|inconsisten|oppos/i.test(`${match.rationale} ${match.limitations.join(" ")}`))
            issues.push(issue("ABSENCE_AS_CONTRADICTION", "Contradiction requires explicit conflict rationale, not absence of evidence.", `proposedMatches.${index}`));
        const evidenceTypes = validLinked.map((entry) => entry.evidenceType);
        if (match.matchType === "direct" && evidenceTypes.length > 0 && evidenceTypes.every((type) => type === "role"))
            issues.push(issue("TITLE_ONLY_DIRECT_MATCH", "Role titles alone cannot directly prove a complete expectation.", `proposedMatches.${index}`));
        if (match.matchType === "direct" && evidenceTypes.length > 0 && evidenceTypes.every((type) => ["skill", "tool"].includes(type)))
            issues.push(issue("TOOL_ONLY_DIRECT_MATCH", "Tool mentions alone cannot directly prove production expertise.", `proposedMatches.${index}`));
        if (match.matchType === "direct" && match.coverage === "full" && evidenceTypes.length > 0 && evidenceTypes.every((type) => type === "project"))
            issues.push(issue("PROJECT_EXISTENCE_AS_IMPACT", "Project existence alone cannot prove full business impact.", `proposedMatches.${index}`));
        const forbidden = forbiddenContent(match.rationale);
        if (forbidden)
            issues.push(issue("FORBIDDEN_CONTENT", forbidden, `proposedMatches.${index}.rationale`));
        const sourceText = validLinked.flatMap((entry) => [entry.summary, ...entry.reviewedClaims.map((claim) => claim.claim)]).join(" ");
        const unsupportedNumbers = numericTokens(`${match.rationale} ${match.limitations.join(" ")}`).filter((token) => !numericTokens(sourceText).includes(token));
        if (unsupportedNumbers.length)
            issues.push(issue("INVENTED_METRIC", `Rationale contains unsupported numeric token(s): ${unsupportedNumbers.join(", ")}`, `proposedMatches.${index}.rationale`));
    });
    const coverageExpectationIds = new Set();
    payload.proposedCoverage.forEach((coverage, index) => {
        if (coverageExpectationIds.has(coverage.expectationId))
            issues.push(issue("DUPLICATE_PROPOSED_COVERAGE", "Only one proposed coverage record is allowed per expectation.", `proposedCoverage.${index}`));
        coverageExpectationIds.add(coverage.expectationId);
        if (!expectationById.has(coverage.expectationId))
            issues.push(issue("UNKNOWN_EXPECTATION_ID", `Unknown coverage expectation: ${coverage.expectationId}`, `proposedCoverage.${index}`));
        if (coverage.status === "conflicting" && !/contradic|conflict|inconsisten|oppos/i.test(`${coverage.rationale} ${coverage.blockingReasons.join(" ")}`))
            issues.push(issue("ABSENCE_AS_CONTRADICTION", "Conflicting coverage requires explicit contradictory evidence.", `proposedCoverage.${index}`));
        const forbidden = forbiddenContent(coverage.rationale);
        if (forbidden)
            issues.push(issue("FORBIDDEN_CONTENT", forbidden, `proposedCoverage.${index}.rationale`));
    });
    return deduplicateIssues(issues);
}
function forbiddenContent(text) {
    const checks = [
        [/\b(candidate|applicant)\s+(is|has|lacks|matches|fits|should|demonstrates)\b/i, "Output creates or evaluates a candidate fact."],
        [/\b(fit score|percentage fit|hiring probability|proof readiness)\b/i, "Output contains aggregate fit or proof-readiness language."],
        [/\b(strengths?|weaknesses?)\s+(summary|include|are|is)\b/i, "Output contains a strengths or weaknesses assessment."],
        [/\b(resume bullet|resume wording|cover letter|curriculum vitae)\b/i, "Output contains resume or application writing."],
        [/\b(should|recommend)\s+(apply|hire|interview)\b/i, "Output contains an application or hiring recommendation."],
        [/\b(overall fit|good fit|strong fit|poor fit)\b/i, "Output evaluates overall candidate fit."],
    ];
    return checks.find(([pattern]) => pattern.test(text))?.[1];
}
async function loadEvidenceContent(workspace, context) {
    const evidenceItems = (await readJson(path.join(workspace, "kb", "evidence-items.json"), [])).map((entry) => EvidenceItemSchema.parse(entry));
    const claims = (await readJson(path.join(workspace, "kb", "claims.json"), [])).map((entry) => ClaimSchema.parse(entry));
    const evidenceById = new Map(evidenceItems.map((entry) => [entry.id, entry]));
    const claimById = new Map(claims.map((entry) => [entry.id, entry]));
    return context.snapshot.entries.map((entry) => {
        const evidence = evidenceById.get(entry.evidenceId);
        if (!evidence)
            throw new Error(`Eligible evidence disappeared: ${entry.evidenceId}`);
        const reviewedClaims = entry.supportingClaimIds.map((id) => claimById.get(id)).filter((claim) => Boolean(claim));
        if (reviewedClaims.length !== entry.supportingClaimIds.length)
            throw new Error(`Eligible evidence review provenance is broken: ${entry.evidenceId}`);
        return {
            evidenceId: entry.evidenceId,
            evidenceType: entry.evidenceType,
            summary: evidence.normalizedSummary,
            reviewedClaims: reviewedClaims.map((claim) => ({ id: claim.id, claim: claim.approvedWording ?? claim.claim })),
            provenance: entry.provenance,
        };
    });
}
async function findCached(workspace, targetId, fingerprint) {
    for (const proposal of await listEvidenceMatchProposals(workspace, targetId)) {
        if (proposal.requestFingerprint !== fingerprint || proposal.status !== "ready-for-review")
            continue;
        const status = await getEvidenceMatchProposalStatus(workspace, proposal.id);
        if (status.status === "current")
            return { proposal, location: (await locateProposal(workspace, proposal.id)).location };
    }
    return undefined;
}
async function locateProposal(workspace, proposalId) {
    if (!/^match-proposal_[a-f0-9]+$/.test(proposalId))
        throw new Error(`Invalid match proposal ID: ${proposalId}`);
    const files = (await walkFiles(path.join(workspace, "targets"))).filter((file) => path.basename(file) === PROPOSAL_FILE && path.basename(path.dirname(file)) === proposalId && path.basename(path.dirname(path.dirname(file))) === "proposals");
    if (!files.length)
        throw new Error(`Match proposal not found: ${proposalId}`);
    if (files.length > 1)
        throw new Error(`Match proposal ID is ambiguous: ${proposalId}`);
    const proposal = EvidenceMatchProposalSchema.parse(await readJson(files[0], null));
    const target = await showTarget(workspace, proposal.targetId);
    return { target, location: proposalLocation(workspace, target, proposalId) };
}
function proposalLocation(workspace, target, proposalId) {
    const root = `${targetRoot(target)}/matching/proposals/${proposalId}`;
    const proposalRelativePath = `${root}/${PROPOSAL_FILE}`;
    const manifestRelativePath = `${root}/${MANIFEST_FILE}`;
    const rawRelativePath = `${root}/${RAW_FILE}`;
    return {
        proposalRelativePath,
        proposalPath: resolveWithin(workspace, proposalRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
        rawRelativePath,
        rawPath: resolveWithin(workspace, rawRelativePath),
    };
}
async function countProposals(workspace, target) {
    return (await walkFiles(path.join(workspace, `${targetRoot(target)}/matching/proposals`))).filter((file) => path.basename(file) === PROPOSAL_FILE).length;
}
function resultFromProposal(proposal, location, result) {
    return {
        targetId: proposal.targetId,
        targetType: proposal.targetType,
        proposalId: proposal.id,
        result,
        proposalPath: location.proposalRelativePath,
        manifestPath: location.manifestRelativePath,
        rawResponsePath: location.rawRelativePath,
        proposedMatchCount: proposal.proposedMatches.length,
        proposedCoverageCount: proposal.proposedCoverage.length,
        validationIssueCount: proposal.validationIssues.length,
        requestFingerprint: proposal.requestFingerprint,
    };
}
function invalidStatus(base, reasons, proposalHashMatches = null, rawResponseHashMatches = null) {
    return { ...base, status: "invalid", readyForReview: false, proposalHashMatches, rawResponseHashMatches, approvedInterpretationHashMatches: null, evidenceSnapshotManifestHashMatches: null, evidenceSnapshotHashMatches: null, reasons };
}
function targetRoot(target) {
    return `targets/${target.type === "role" ? "roles" : "jobs"}/${target.id}`;
}
function resolveWithin(workspace, relativePath) {
    const resolved = path.resolve(workspace, relativePath);
    const relation = path.relative(path.resolve(workspace), resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation))
        throw new Error(`Match proposal path escapes workspace: ${relativePath}`);
    return resolved;
}
function numericTokens(text) {
    return text.match(/\b\d+(?:\.\d+)?%?\b/g) ?? [];
}
function issuesFromError(error) {
    if (error instanceof SyntaxError)
        return [issue("MALFORMED_JSON", "Model response is not valid JSON.")];
    if (error instanceof z.ZodError)
        return error.issues.map((entry) => issue("SCHEMA_MISMATCH", entry.message, entry.path.join(".")));
    return [issue("INVALID_RESPONSE", errorMessage(error))];
}
function issue(code, message, issuePath) {
    return { code, message, ...(issuePath ? { path: issuePath } : {}) };
}
function deduplicateIssues(issues) {
    return [...new Map(issues.map((entry) => [`${entry.code}|${entry.path ?? ""}|${entry.message}`, entry])).values()]
        .sort((a, b) => `${a.path ?? ""}|${a.code}`.localeCompare(`${b.path ?? ""}|${b.code}`));
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
export async function matchProposalFileTimestamps(workspace, proposalId) {
    const located = await locateProposal(workspace, proposalId);
    const [proposal, manifest, raw] = await Promise.all([stat(located.location.proposalPath), stat(located.location.manifestPath), stat(located.location.rawPath)]);
    return { proposalMtimeMs: proposal.mtimeMs, manifestMtimeMs: manifest.mtimeMs, rawMtimeMs: raw.mtimeMs };
}
