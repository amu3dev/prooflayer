import path from "node:path";
import { hashFile, hashText, pathExists, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { ApprovedTargetInterpretationManifestSchema, ApprovedTargetInterpretationSchema, InterpretationProposalManifestSchema, InterpretationProposalReviewManifestSchema, TargetInterpretationManifestSchema, } from "./schemas.js";
import { showTargetAnalysis } from "./target-analysis.js";
import { showTargetInterpretation } from "./target-interpretation.js";
import { getInterpretationProposalStatus, showInterpretationProposal, } from "./target-proposal.js";
import { getProposalReviewStatus, showProposalReview, } from "./target-proposal-review.js";
import { showTarget } from "./targets.js";
export const APPROVED_INTERPRETER_NAME = "target-semantics-approved";
export const APPROVED_INTERPRETER_VERSION = "1";
export const APPROVED_INTERPRETATION_POLICY_VERSION = "1";
const APPROVED_FILE = "target-interpretation.json";
const APPROVED_MANIFEST_FILE = "interpretation-manifest.json";
export async function approveInterpretationProposal(workspace, proposalId, options = {}) {
    const proposalStatus = await getInterpretationProposalStatus(workspace, proposalId);
    if (proposalStatus.status !== "current" || !proposalStatus.readyForReview) {
        throw new Error(`Cannot approve a ${proposalStatus.status} or invalid proposal.`);
    }
    const reviewStatus = await getProposalReviewStatus(workspace, proposalId);
    if (reviewStatus.status !== "completed") {
        throw new Error(`Proposal review must be completed before approval. Current status: ${reviewStatus.status}`);
    }
    const proposal = await showInterpretationProposal(workspace, proposalId);
    const review = await showProposalReview(workspace, proposalId);
    const target = await showTarget(workspace, proposal.targetId);
    const paths = approvedPaths(workspace, target);
    const policyVersion = options.policyVersion ?? APPROVED_INTERPRETATION_POLICY_VERSION;
    const proposalManifest = InterpretationProposalManifestSchema.parse(await readJson(proposalManifestPath(workspace, target, proposalId), null));
    const reviewManifest = InterpretationProposalReviewManifestSchema.parse(await readJson(reviewManifestPath(workspace, target, proposalId), null));
    const deterministicManifest = TargetInterpretationManifestSchema.parse(await readJson(deterministicManifestPath(workspace, target), null));
    if (reviewManifest.proposalSha256 !== proposalManifest.proposalSha256) {
        throw new Error("Review manifest does not reference the current proposal hash.");
    }
    const existingStatus = await getApprovedInterpretationStatus(workspace, target.id, { policyVersion });
    if (existingStatus.status === "current") {
        const manifest = ApprovedTargetInterpretationManifestSchema.parse(await readJson(paths.manifestPath, null));
        if (manifest.proposalId === proposalId &&
            manifest.proposalSha256 === proposalManifest.proposalSha256 &&
            manifest.reviewSha256 === reviewManifest.reviewSha256) {
            const current = await showApprovedTargetInterpretation(workspace, target.id);
            return resultFromApproved(current, manifest, "already-current", review.decisions.filter((entry) => entry.decision === "reject").length);
        }
    }
    if (existingStatus.status === "invalid") {
        throw new Error("Existing approved interpretation is invalid and was not overwritten.");
    }
    const deterministic = await showTargetInterpretation(workspace, target.id);
    const analysis = await showTargetAnalysis(workspace, target.id);
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.interpretationPath)) {
        try {
            createdAt = (await showApprovedTargetInterpretation(workspace, target.id)).createdAt;
        }
        catch {
            // A valid prior identity is optional when explicitly replacing a stale artifact.
        }
    }
    const deterministicExpectations = deterministic.expectations.map((expectation) => ({
        ...expectation,
        trustState: "deterministic-approved",
    }));
    const decisionById = new Map(review.decisions.map((decision) => [decision.proposedExpectationId, decision]));
    const approvedByProposalId = new Map();
    for (const proposed of proposal.proposedExpectations) {
        const decision = decisionById.get(proposed.id);
        if (!decision || decision.decision === "pending" || decision.decision === "reject")
            continue;
        const edited = decision.decision === "edit" ? decision.editedExpectation : undefined;
        if (decision.decision === "edit" && !edited)
            throw new Error(`Edit decision is missing edited content: ${proposed.id}`);
        const trustState = decision.decision === "edit" ? "human-edited" : "human-approved";
        const approved = {
            id: `approved_${hashText(`${proposal.id}\u0000${proposed.id}\u0000${decision.decision}`).slice(0, 14)}`,
            kind: edited?.kind ?? proposed.kind,
            statement: edited?.statement ?? proposed.statement,
            necessity: edited?.necessity ?? proposed.necessity,
            importance: edited?.importance ?? proposed.importance,
            explicitness: edited?.explicitness ?? proposed.explicitness,
            capabilityTags: edited?.capabilityTags ?? proposed.capabilityTags,
            sourceAnalysisItemIds: proposed.sourceAnalysisItemIds,
            sourceReferences: proposed.sourceReferences,
            interpretation: {
                method: "manual",
                interpreterName: APPROVED_INTERPRETER_NAME,
                interpreterVersion: APPROVED_INTERPRETER_VERSION,
                policyVersion,
            },
            interpretationConfidence: edited?.interpretationConfidence ?? proposed.interpretationConfidence,
            notes: [
                ...(edited?.notes ?? proposed.ambiguityNotes),
                proposed.rationale,
                ...(decision.reviewNote ? [decision.reviewNote] : []),
            ],
            trustState,
            approvalProvenance: {
                proposalId: proposal.id,
                proposedExpectationId: proposed.id,
                reviewDecision: decision.decision,
                reviewer: review.reviewer,
                modelProvider: proposal.model.provider,
                modelName: proposal.model.model,
                promptTemplateVersion: proposal.prompt.templateVersion,
                policyVersion: proposal.prompt.policyVersion,
                sourceExpectationIds: proposed.sourceExpectationIds,
            },
        };
        approvedByProposalId.set(proposed.id, approved);
    }
    const expectations = [...deterministicExpectations, ...approvedByProposalId.values()]
        .sort((a, b) => a.id.localeCompare(b.id));
    const modelGroups = proposal.proposedGroups.flatMap((group) => {
        const expectationIds = group.expectationIds
            .map((id) => approvedByProposalId.get(id)?.id)
            .filter((id) => Boolean(id));
        if (expectationIds.length === 0)
            return [];
        return [{
                id: `approved-group_${hashText(`${proposal.id}\u0000${group.id}`).slice(0, 12)}`,
                kind: group.kind,
                title: group.title,
                expectationIds,
                sourceReferences: group.sourceReferences,
            }];
    });
    const completeness = approvedCompleteness(expectations, analysis.items.filter((item) => item.kind !== "front-matter-field").map((item) => item.id));
    const approved = ApprovedTargetInterpretationSchema.parse({
        schemaVersion: 1,
        targetId: target.id,
        targetType: target.type,
        interpreter: {
            name: APPROVED_INTERPRETER_NAME,
            version: APPROVED_INTERPRETER_VERSION,
            mode: "manual",
            policyVersion,
        },
        input: {
            targetPath: deterministic.input.targetPath,
            targetSha256: deterministic.input.targetSha256,
            structuralAnalysisPath: deterministic.input.structuralAnalysisPath,
            structuralAnalysisSha256: deterministic.input.structuralAnalysisSha256,
            deterministicInterpretationPath: deterministicPath(target),
            deterministicInterpretationSha256: proposal.input.deterministicInterpretationSha256,
            ...(proposal.input.roleProfileSha256 && deterministic.targetType === "role" && deterministic.input.roleProfilePath
                ? {
                    roleProfilePath: deterministic.input.roleProfilePath,
                    roleProfileSha256: proposal.input.roleProfileSha256,
                }
                : {}),
            proposalPath: proposalManifest.proposalPath,
            proposalSha256: proposalManifest.proposalSha256,
            reviewPath: reviewManifest.reviewPath,
            reviewSha256: reviewManifest.reviewSha256,
        },
        expectations,
        groups: [...deterministic.groups, ...modelGroups].sort((a, b) => a.id.localeCompare(b.id)),
        ambiguities: [...deterministic.ambiguities, ...proposal.proposedAmbiguities].sort((a, b) => a.id.localeCompare(b.id)),
        warnings: [...deterministic.warnings, ...proposal.warnings].sort((a, b) => a.id.localeCompare(b.id)),
        completeness,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.interpretationPath, approved);
    const manifest = ApprovedTargetInterpretationManifestSchema.parse({
        schemaVersion: 1,
        targetId: target.id,
        targetType: target.type,
        approvedInterpretationPath: paths.interpretationRelativePath,
        approvedInterpretationSha256: await hashFile(paths.interpretationPath),
        interpreterName: APPROVED_INTERPRETER_NAME,
        interpreterVersion: APPROVED_INTERPRETER_VERSION,
        policyVersion,
        targetSha256: deterministic.input.targetSha256,
        structuralAnalysisSha256: deterministic.input.structuralAnalysisSha256,
        deterministicInterpretationSha256: proposal.input.deterministicInterpretationSha256,
        ...(proposal.input.roleProfileSha256 ? { roleProfileSha256: proposal.input.roleProfileSha256 } : {}),
        proposalId,
        proposalSha256: proposalManifest.proposalSha256,
        reviewSha256: reviewManifest.reviewSha256,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return resultFromApproved(approved, manifest, existingStatus.status === "missing" ? "created" : "updated", review.decisions.filter((entry) => entry.decision === "reject").length);
}
export async function showApprovedTargetInterpretation(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const paths = approvedPaths(workspace, target);
    if (!(await pathExists(paths.interpretationPath)))
        throw new Error(`Approved interpretation not found for target: ${targetId}`);
    return ApprovedTargetInterpretationSchema.parse(await readJson(paths.interpretationPath, null));
}
export async function getApprovedInterpretationStatus(workspace, targetId, options = {}) {
    const target = await showTarget(workspace, targetId);
    const paths = approvedPaths(workspace, target);
    const interpretationExists = await pathExists(paths.interpretationPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = {
        targetId,
        targetType: target.type,
        interpretationExists,
        manifestExists,
        interpretationPath: paths.interpretationRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!interpretationExists && !manifestExists)
        return emptyStatus(base, "missing", ["No approved interpretation exists."]);
    if (!interpretationExists || !manifestExists)
        return emptyStatus(base, "invalid", ["Approved interpretation artifact set is incomplete."]);
    let approved;
    let manifest;
    try {
        approved = ApprovedTargetInterpretationSchema.parse(await readJson(paths.interpretationPath, null));
        manifest = ApprovedTargetInterpretationManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyStatus(base, "invalid", [`Approved interpretation is invalid: ${errorMessage(error)}`]);
    }
    const interpretationHashMatches = (await hashFile(paths.interpretationPath)) === manifest.approvedInterpretationSha256;
    const targetHashMatches = await currentHash(workspace, approved.input.targetPath, manifest.targetSha256);
    const structuralAnalysisHashMatches = await currentHash(workspace, approved.input.structuralAnalysisPath, manifest.structuralAnalysisSha256);
    const deterministicInterpretationHashMatches = await currentHash(workspace, approved.input.deterministicInterpretationPath, manifest.deterministicInterpretationSha256);
    const roleProfileHashMatches = approved.input.roleProfilePath && manifest.roleProfileSha256
        ? await currentHash(workspace, approved.input.roleProfilePath, manifest.roleProfileSha256)
        : null;
    const proposalLifecycle = await getInterpretationProposalStatus(workspace, manifest.proposalId);
    const reviewLifecycle = await getProposalReviewStatus(workspace, manifest.proposalId);
    const proposalHashMatches = await currentHash(workspace, approved.input.proposalPath, manifest.proposalSha256) &&
        proposalLifecycle.status === "current";
    const reviewHashMatches = await currentHash(workspace, approved.input.reviewPath, manifest.reviewSha256) &&
        reviewLifecycle.status === "completed";
    const policyVersionMatches = (options.policyVersion ?? APPROVED_INTERPRETATION_POLICY_VERSION) === manifest.policyVersion;
    const invalidReasons = [];
    if (!interpretationHashMatches)
        invalidReasons.push("Approved interpretation SHA-256 does not match its manifest.");
    if (approved.targetId !== target.id || manifest.targetId !== target.id ||
        approved.targetType !== target.type || manifest.targetType !== target.type ||
        manifest.approvedInterpretationPath !== paths.interpretationRelativePath)
        invalidReasons.push("Approved interpretation identity or path is invalid.");
    if (invalidReasons.length > 0) {
        return {
            ...base,
            interpretationHashMatches,
            targetHashMatches,
            structuralAnalysisHashMatches,
            deterministicInterpretationHashMatches,
            roleProfileHashMatches,
            proposalHashMatches,
            reviewHashMatches,
            policyVersionMatches,
            status: "invalid",
            reasons: invalidReasons,
        };
    }
    const staleReasons = [
        ...(!targetHashMatches ? ["Target dependency changed."] : []),
        ...(!structuralAnalysisHashMatches ? ["Structural analysis dependency changed."] : []),
        ...(!deterministicInterpretationHashMatches ? ["Deterministic interpretation dependency changed."] : []),
        ...(roleProfileHashMatches === false ? ["Role Profile dependency changed."] : []),
        ...(!proposalHashMatches ? ["Proposal dependency changed."] : []),
        ...(!reviewHashMatches ? ["Review dependency changed."] : []),
        ...(!policyVersionMatches ? ["Approved interpretation policy changed."] : []),
    ];
    return {
        ...base,
        interpretationHashMatches,
        targetHashMatches,
        structuralAnalysisHashMatches,
        deterministicInterpretationHashMatches,
        roleProfileHashMatches,
        proposalHashMatches,
        reviewHashMatches,
        policyVersionMatches,
        status: staleReasons.length > 0 ? "stale" : "current",
        reasons: staleReasons,
    };
}
export function formatApprovalResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Target type: ${result.targetType}`,
        `Proposal ID: ${result.proposalId}`,
        `Approval result: ${result.result}`,
        `Approved interpretation: ${result.interpretationPath}`,
        `Manifest: ${result.manifestPath}`,
        `Deterministic-approved: ${result.deterministicExpectationCount}`,
        `Human-approved: ${result.humanApprovedCount}`,
        `Human-edited: ${result.humanEditedCount}`,
        `Rejected: ${result.rejectedCount}`,
        `Completeness: ${result.completeness.status}`,
        `Usable for future evidence matching: ${result.completeness.usableForEvidenceMatching ? "yes" : "no"}`,
    ].join("\n");
}
export function formatApprovedInterpretationStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Interpretation hash matches: ${check(status.interpretationHashMatches)}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Structural analysis hash matches: ${check(status.structuralAnalysisHashMatches)}`,
        `Deterministic interpretation hash matches: ${check(status.deterministicInterpretationHashMatches)}`,
        `Role Profile hash matches: ${check(status.roleProfileHashMatches)}`,
        `Proposal hash matches: ${check(status.proposalHashMatches)}`,
        `Review hash matches: ${check(status.reviewHashMatches)}`,
        `Policy version matches: ${check(status.policyVersionMatches)}`,
        ...(status.reasons.length > 0 ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
function approvedCompleteness(expectations, analysisItemIds) {
    if (expectations.length === 0) {
        return { status: "empty", usableForEvidenceMatching: false, blockingReasons: ["No approved expectations exist."] };
    }
    const relevant = analysisItemIds;
    if (relevant.length === 0)
        return { status: "complete", usableForEvidenceMatching: true, blockingReasons: [] };
    const covered = new Set(expectations.flatMap((expectation) => expectation.sourceAnalysisItemIds));
    const uncovered = relevant.filter((id) => !covered.has(id));
    return uncovered.length === 0
        ? { status: "complete", usableForEvidenceMatching: true, blockingReasons: [] }
        : {
            status: "partial",
            usableForEvidenceMatching: true,
            blockingReasons: [`${uncovered.length} structural analysis item(s) remain outside approved expectations.`],
        };
}
function resultFromApproved(approved, manifest, result, rejectedCount) {
    return {
        targetId: approved.targetId,
        targetType: approved.targetType,
        proposalId: manifest.proposalId,
        result,
        interpretationPath: manifest.approvedInterpretationPath,
        manifestPath: manifest.approvedInterpretationPath.replace(APPROVED_FILE, APPROVED_MANIFEST_FILE),
        deterministicExpectationCount: approved.expectations.filter((entry) => entry.trustState === "deterministic-approved").length,
        humanApprovedCount: approved.expectations.filter((entry) => entry.trustState === "human-approved").length,
        humanEditedCount: approved.expectations.filter((entry) => entry.trustState === "human-edited").length,
        rejectedCount,
        completeness: approved.completeness,
    };
}
function approvedPaths(workspace, target) {
    const root = `${targetRoot(target)}/interpretation/approved`;
    const interpretationRelativePath = `${root}/${APPROVED_FILE}`;
    const manifestRelativePath = `${root}/${APPROVED_MANIFEST_FILE}`;
    return {
        interpretationRelativePath,
        interpretationPath: resolveWithin(workspace, interpretationRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
function targetRoot(target) {
    return `targets/${target.type === "role" ? "roles" : "jobs"}/${target.id}`;
}
function deterministicPath(target) {
    return `${targetRoot(target)}/interpretation/target-interpretation.json`;
}
function deterministicManifestPath(workspace, target) {
    return resolveWithin(workspace, `${targetRoot(target)}/interpretation/interpretation-manifest.json`);
}
function proposalManifestPath(workspace, target, proposalId) {
    return resolveWithin(workspace, `${targetRoot(target)}/interpretation/proposals/${proposalId}/proposal-manifest.json`);
}
function reviewManifestPath(workspace, target, proposalId) {
    return resolveWithin(workspace, `${targetRoot(target)}/interpretation/reviews/${proposalId}/review-manifest.json`);
}
async function currentHash(workspace, relativePath, expected) {
    const absolutePath = resolveWithin(workspace, relativePath);
    return (await pathExists(absolutePath)) && (await hashFile(absolutePath)) === expected;
}
function emptyStatus(base, status, reasons) {
    return {
        ...base,
        interpretationHashMatches: null,
        targetHashMatches: null,
        structuralAnalysisHashMatches: null,
        deterministicInterpretationHashMatches: null,
        roleProfileHashMatches: null,
        proposalHashMatches: null,
        reviewHashMatches: null,
        policyVersionMatches: null,
        status,
        reasons,
    };
}
function resolveWithin(workspace, relativePath) {
    const resolved = path.resolve(workspace, relativePath);
    const relation = path.relative(path.resolve(workspace), resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Approved interpretation path escapes workspace: ${relativePath}`);
    }
    return resolved;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
