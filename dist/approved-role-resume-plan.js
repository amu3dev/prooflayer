import path from "node:path";
import { hashFile, hashText, pathExists, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { RoleResumeContentPlanSchema, RoleResumePlanProposalManifestSchema, RoleResumePlanReviewManifestSchema, } from "./role-resume-plan-schemas.js";
import { ROLE_RESUME_PLANNING_POLICY_NAME, ROLE_RESUME_PLANNING_POLICY_VERSION, assertRoleResumePlanConsistency, createRoleResumePlanManifest, derivePlanAmbiguities, derivePlanCompleteness, derivePlanRisks, derivePlanWarnings, getRoleResumePlanStatus, loadRoleResumePlanningContext, roleResumePlanPaths, showRoleResumePlan, } from "./role-resume-planning.js";
import { getRoleResumePlanProposalStatus, showRoleResumePlanProposal, } from "./role-resume-plan-proposal.js";
import { getRoleResumePlanReviewStatus, mergeReviewedPayload, showRoleResumePlanReview, } from "./role-resume-plan-review.js";
export async function approveRoleResumePlanProposal(workspace, proposalId, options = {}) {
    const proposalStatus = await getRoleResumePlanProposalStatus(workspace, proposalId);
    if (proposalStatus.status !== "current" || !proposalStatus.readyForReview)
        throw new Error("Cannot approve a stale, invalid, or unreviewable role resume plan proposal.");
    const reviewStatus = await getRoleResumePlanReviewStatus(workspace, proposalId);
    if (reviewStatus.status !== "completed")
        throw new Error(`Role resume plan review must be completed before approval. Current status: ${reviewStatus.status}`);
    const proposal = await showRoleResumePlanProposal(workspace, proposalId);
    const review = await showRoleResumePlanReview(workspace, proposalId);
    const context = await loadRoleResumePlanningContext(workspace, proposal.targetId);
    const deterministicStatus = await getRoleResumePlanStatus(workspace, proposal.targetId);
    if (deterministicStatus.status !== "current")
        throw new Error("Deterministic role resume plan must be current before approval.");
    const deterministic = await showRoleResumePlan(workspace, proposal.targetId);
    const deterministicHash = await hashFile(resolveWithin(workspace, deterministicStatus.planPath));
    if (proposal.input.targetSha256 !== context.targetSha256 ||
        proposal.input.approvedInterpretationSha256 !== context.approvedInterpretationSha256 ||
        proposal.input.approvedMatchingSha256 !== context.approvedMatchingSha256 ||
        proposal.input.evidenceSnapshotSha256 !== context.evidenceSnapshotSha256 ||
        proposal.input.approvedAssessmentSha256 !== context.approvedAssessmentSha256 ||
        proposal.input.deterministicPlanSha256 !== deterministicHash)
        throw new Error("Role resume plan proposal dependencies changed and approval was refused.");
    const root = `targets/roles/${proposal.targetId}/resume-planning`;
    const proposalManifestPath = resolveWithin(workspace, `${root}/proposals/${proposalId}/proposal-manifest.json`);
    const reviewManifestPath = resolveWithin(workspace, `${root}/reviews/${proposalId}/review-manifest.json`);
    const proposalManifest = RoleResumePlanProposalManifestSchema.parse(await readJson(proposalManifestPath, null));
    const reviewManifest = RoleResumePlanReviewManifestSchema.parse(await readJson(reviewManifestPath, null));
    if (reviewManifest.proposalSha256 !== proposalManifest.proposalSha256)
        throw new Error("Review does not reference the current proposal hash.");
    const paths = roleResumePlanPaths(workspace, proposal.targetId, "approved");
    const existingStatus = await getRoleResumePlanStatus(workspace, proposal.targetId, "approved");
    if (existingStatus.status === "current" && await pathExists(paths.manifestPath)) {
        const manifest = await readJson(paths.manifestPath, {});
        if (manifest.proposalId === proposalId && manifest.proposalSha256 === proposalManifest.proposalSha256 && manifest.reviewSha256 === reviewManifest.reviewSha256) {
            return approvalResult(await showRoleResumePlan(workspace, proposal.targetId, "approved"), review, paths, proposalId, "already-current");
        }
    }
    if (["stale", "invalid"].includes(existingStatus.status) && !options.rebuild)
        throw new Error(`Approved role resume plan is ${existingStatus.status}; use explicit --rebuild.`);
    const merged = await mergeReviewedPayload(workspace, proposalId, review);
    const reviewed = applyReviewTrust(merged, review, proposal);
    const completeness = derivePlanCompleteness(reviewed.expectationSelections, reviewed.sections, reviewed.positioning, reviewed.claimBoundaries, context.approvedAssessment.completeness.status, false);
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.planPath)) {
        try {
            createdAt = RoleResumeContentPlanSchema.parse(await readJson(paths.planPath, null)).createdAt;
        }
        catch { /* explicit rebuild */ }
    }
    const approved = RoleResumeContentPlanSchema.parse({
        ...deterministic,
        id: `approved-role-resume-plan_${hashText([context.target.id, context.approvedAssessmentSha256, proposalManifest.proposalSha256, reviewManifest.reviewSha256, ROLE_RESUME_PLANNING_POLICY_VERSION].join("\0")).slice(0, 16)}`,
        positioning: reviewed.positioning,
        sections: reviewed.sections,
        expectationSelections: reviewed.expectationSelections,
        evidenceSelections: reviewed.evidenceSelections,
        claimBoundaries: reviewed.claimBoundaries,
        exclusions: reviewed.exclusions,
        risks: derivePlanRisks(context.target.id, reviewed.expectationSelections, reviewed.evidenceSelections, completeness),
        warnings: derivePlanWarnings(context.target.id, reviewed.expectationSelections, reviewed.evidenceSelections, reviewed.positioning),
        ambiguities: derivePlanAmbiguities(context.target.id, reviewed.expectationSelections, reviewed.evidenceSelections),
        completeness,
        planningPolicy: { name: ROLE_RESUME_PLANNING_POLICY_NAME, version: ROLE_RESUME_PLANNING_POLICY_VERSION },
        createdAt,
        updatedAt: now,
    });
    assertRoleResumePlanConsistency(approved, context);
    if (containsUnapprovedTrust(approved))
        throw new Error("Approved plan contains proposed or rejected trust state.");
    await writeJsonAtomic(paths.planPath, approved);
    const manifest = createRoleResumePlanManifest(approved, context, paths.planRelativePath, await hashFile(paths.planPath), "approved", createdAt, now, { proposalId, proposalSha256: proposalManifest.proposalSha256, reviewSha256: reviewManifest.reviewSha256 });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return approvalResult(approved, review, paths, proposalId, existingStatus.status === "missing" ? "created" : "rebuilt");
}
export function formatApproveRoleResumePlanResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Proposal ID: ${result.proposalId}`,
        `Result: ${result.result}`,
        `Deterministic fallbacks: ${result.deterministicApprovedCount}`,
        `Human approved: ${result.humanApprovedCount}`,
        `Human edited: ${result.humanEditedCount}`,
        `Rejected fallbacks: ${result.rejectedFallbackCount}`,
        `Completeness: ${result.completeness}`,
        `Usable for future resume drafting: ${result.usableForResumeDrafting ? "yes" : "no"}`,
        `Approved plan path: ${result.planPath}`,
        `Manifest path: ${result.manifestPath}`,
    ].join("\n");
}
function applyReviewTrust(payload, review, proposal) {
    const decorate = (type, value) => {
        const decision = review.decisions.find((entry) => entry.itemType === type && entry.itemId === value.id);
        if (!decision || decision.decision === "pending")
            throw new Error(`Missing completed review decision: ${type}/${value.id}`);
        if (decision.decision === "reject")
            return { ...value, trustState: "deterministic-approved" };
        return {
            ...value,
            trustState: decision.decision === "edit" ? "human-edited" : "human-approved",
            provenance: {
                ...value.provenance,
                modelProposal: {
                    proposalId: proposal.id,
                    provider: proposal.model.provider,
                    model: proposal.model.model,
                    promptTemplateVersion: proposal.prompt.templateVersion,
                },
                reviewDecision: { decision: decision.decision, reviewer: review.reviewer },
            },
        };
    };
    const positioningDecision = review.decisions.find((entry) => entry.itemType === "positioning");
    if (!positioningDecision || positioningDecision.decision === "pending")
        throw new Error("Positioning review is incomplete.");
    const positionTrust = positioningDecision.decision === "reject" ? "deterministic-approved"
        : positioningDecision.decision === "edit" ? "human-edited" : "human-approved";
    const positioningReviewProvenance = positioningDecision.decision === "reject" ? {} : {
        modelProposal: {
            proposalId: proposal.id,
            provider: proposal.model.provider,
            model: proposal.model.model,
            promptTemplateVersion: proposal.prompt.templateVersion,
        },
        reviewDecision: { decision: positioningDecision.decision, reviewer: review.reviewer },
    };
    const positioning = {
        ...payload.positioning,
        trustState: positionTrust,
        primaryThemes: payload.positioning.primaryThemes.map((entry) => ({
            ...entry,
            trustState: positionTrust,
            provenance: { ...entry.provenance, ...positioningReviewProvenance },
        })),
        secondaryThemes: payload.positioning.secondaryThemes.map((entry) => ({
            ...entry,
            trustState: positionTrust,
            provenance: { ...entry.provenance, ...positioningReviewProvenance },
        })),
        differentiationThemes: payload.positioning.differentiationThemes.map((entry) => ({
            ...entry,
            trustState: positionTrust,
            provenance: { ...entry.provenance, ...positioningReviewProvenance },
        })),
        provenance: {
            ...payload.positioning.provenance,
            ...positioningReviewProvenance,
        },
    };
    return {
        ...payload,
        positioning,
        sections: payload.sections.map((entry) => decorate("section", entry)),
        expectationSelections: payload.expectationSelections.map((entry) => decorate("expectation", entry)),
        evidenceSelections: payload.evidenceSelections.map((entry) => decorate("evidence", entry)),
        claimBoundaries: payload.claimBoundaries.map((entry) => decorate("claim-boundary", entry)),
        exclusions: payload.exclusions.map((entry) => decorate("exclusion", entry)),
    };
}
function containsUnapprovedTrust(plan) {
    return JSON.stringify(plan).includes('"trustState":"proposed"') || JSON.stringify(plan).includes('"trustState":"rejected"');
}
function approvalResult(plan, review, paths, proposalId, result) {
    const counts = review.decisions.reduce((value, entry) => { value[entry.decision] += 1; return value; }, { pending: 0, accept: 0, edit: 0, reject: 0 });
    const approvedElements = [plan.positioning, ...plan.sections, ...plan.expectationSelections, ...plan.evidenceSelections, ...plan.claimBoundaries, ...plan.exclusions];
    return {
        targetId: plan.targetId,
        proposalId,
        result,
        deterministicApprovedCount: approvedElements.filter((entry) => entry.trustState === "deterministic-approved").length,
        humanApprovedCount: approvedElements.filter((entry) => entry.trustState === "human-approved").length,
        humanEditedCount: approvedElements.filter((entry) => entry.trustState === "human-edited").length,
        rejectedFallbackCount: counts.reject,
        completeness: plan.completeness.status,
        usableForResumeDrafting: plan.completeness.usableForResumeDrafting,
        planPath: paths.planRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
}
function resolveWithin(workspace, relativePath) {
    const absolute = path.resolve(workspace, relativePath);
    const root = path.resolve(workspace);
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`))
        throw new Error("Resolved path leaves workspace.");
    return absolute;
}
