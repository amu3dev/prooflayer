import { readFile } from "node:fs/promises";
import path from "node:path";
import { hashFile, pathExists, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { ResumeClaimBoundarySchema, ResumeContentExclusionSchema, ResumeEvidenceSelectionSchema, ResumeExpectationSelectionSchema, RolePositioningPlanSchema, RoleResumePlanReviewManifestSchema, RoleResumePlanReviewSchema, RoleResumeSectionPlanSchema, } from "./role-resume-plan-schemas.js";
import { assertRoleResumePlanProposalAgainstDeterministic, getRoleResumePlanProposalStatus, showRoleResumePlanProposal, } from "./role-resume-plan-proposal.js";
import { loadRoleResumePlanningContext, showRoleResumePlan, } from "./role-resume-planning.js";
export async function initializeRoleResumePlanReview(workspace, proposalId, options = {}) {
    const proposalStatus = await getRoleResumePlanProposalStatus(workspace, proposalId);
    if (proposalStatus.status !== "current" || !proposalStatus.readyForReview)
        throw new Error("Only a current valid role resume plan proposal may enter review.");
    const proposal = await showRoleResumePlanProposal(workspace, proposalId);
    if (!proposal.proposedPlan)
        throw new Error("Proposal has no structured plan.");
    const paths = reviewPaths(workspace, proposal.targetId, proposalId);
    if (await pathExists(paths.reviewPath))
        return showRoleResumePlanReview(workspace, proposalId);
    const now = (options.now ?? (() => new Date()))().toISOString();
    const decisions = [
        pending("positioning", positioningId(proposal.proposedPlan.positioning, proposalId)),
        ...proposal.proposedPlan.sections.map((entry) => pending("section", entry.id)),
        ...proposal.proposedPlan.expectationSelections.map((entry) => pending("expectation", entry.id)),
        ...proposal.proposedPlan.evidenceSelections.map((entry) => pending("evidence", entry.id)),
        ...proposal.proposedPlan.claimBoundaries.map((entry) => pending("claim-boundary", entry.id)),
        ...proposal.proposedPlan.exclusions.map((entry) => pending("exclusion", entry.id)),
    ];
    const review = RoleResumePlanReviewSchema.parse({
        schemaVersion: 1,
        proposalId,
        targetId: proposal.targetId,
        status: "in-progress",
        decisions,
        reviewer: { type: "human", ...(options.reviewerName ? { name: options.reviewerName } : {}) },
        createdAt: now,
        updatedAt: now,
    });
    await writeReview(workspace, review, paths);
    return review;
}
export async function setRoleResumePlanReviewDecision(workspace, proposalId, itemType, itemId, input) {
    const review = await showRoleResumePlanReview(workspace, proposalId);
    if (review.status === "completed")
        throw new Error("Completed role resume plan reviews are immutable.");
    const index = review.decisions.findIndex((entry) => entry.itemType === itemType && entry.itemId === itemId);
    if (index < 0)
        throw new Error(`Unknown role resume plan review item: ${itemType}/${itemId}`);
    if (review.decisions[index].decision !== "pending")
        throw new Error(`A review decision already exists for ${itemType}/${itemId}.`);
    if (input.decision === "edit" && input.editedValue === undefined)
        throw new Error("Edit requires edited content.");
    if (input.decision !== "edit" && input.editedValue !== undefined)
        throw new Error("Only edit may include edited content.");
    if (input.decision === "edit")
        await validateEdit(workspace, proposalId, itemType, itemId, input.editedValue);
    const now = (input.now ?? (() => new Date()))().toISOString();
    review.decisions[index] = {
        itemType,
        itemId,
        decision: input.decision,
        ...(input.editedValue !== undefined ? { editedValue: input.editedValue } : {}),
        ...(input.reviewNote ? { reviewNote: input.reviewNote } : {}),
        decidedAt: now,
    };
    review.updatedAt = now;
    await writeReview(workspace, review, reviewPaths(workspace, review.targetId, proposalId));
    return review;
}
export async function completeRoleResumePlanReview(workspace, proposalId, options = {}) {
    const review = await showRoleResumePlanReview(workspace, proposalId);
    if (review.status === "completed")
        return getRoleResumePlanReviewStatus(workspace, proposalId);
    const pending = review.decisions.filter((entry) => entry.decision === "pending");
    if (pending.length)
        throw new Error(`${pending.length} role resume plan review decisions remain pending.`);
    const merged = await mergeReviewedPayload(workspace, proposalId, review);
    const deterministic = await showRoleResumePlan(workspace, review.targetId);
    const context = await loadRoleResumePlanningContext(workspace, review.targetId);
    assertRoleResumePlanProposalAgainstDeterministic(merged, deterministic, context);
    review.status = "completed";
    review.updatedAt = (options.now ?? (() => new Date()))().toISOString();
    await writeReview(workspace, review, reviewPaths(workspace, review.targetId, proposalId));
    return getRoleResumePlanReviewStatus(workspace, proposalId);
}
export async function showRoleResumePlanReview(workspace, proposalId) {
    const proposal = await showRoleResumePlanProposal(workspace, proposalId);
    const paths = reviewPaths(workspace, proposal.targetId, proposalId);
    if (!(await pathExists(paths.reviewPath)))
        throw new Error(`Role resume plan review not found: ${proposalId}`);
    return RoleResumePlanReviewSchema.parse(await readJson(paths.reviewPath, null));
}
export async function getRoleResumePlanReviewStatus(workspace, proposalId) {
    let proposal;
    try {
        proposal = await showRoleResumePlanProposal(workspace, proposalId);
    }
    catch {
        return emptyReviewStatus(proposalId, "unknown", "missing", ["Proposal or review not found."]);
    }
    const paths = reviewPaths(workspace, proposal.targetId, proposalId);
    if (!(await pathExists(paths.reviewPath)) && !(await pathExists(paths.manifestPath)))
        return emptyReviewStatus(proposalId, proposal.targetId, "missing", ["Review not found."], paths);
    if (!(await pathExists(paths.reviewPath)) || !(await pathExists(paths.manifestPath)))
        return emptyReviewStatus(proposalId, proposal.targetId, "invalid", ["Review artifact set is incomplete."], paths);
    try {
        const review = RoleResumePlanReviewSchema.parse(await readJson(paths.reviewPath, null));
        const manifest = RoleResumePlanReviewManifestSchema.parse(await readJson(paths.manifestPath, null));
        if (await hashFile(paths.reviewPath) !== manifest.reviewSha256)
            return emptyReviewStatus(proposalId, proposal.targetId, "invalid", ["Review hash mismatch."], paths);
        const proposalLocation = resolveWithin(workspace, `targets/roles/${proposal.targetId}/resume-planning/proposals/${proposalId}/proposal.json`);
        if (await hashFile(proposalLocation) !== manifest.proposalSha256)
            return emptyReviewStatus(proposalId, proposal.targetId, "invalid", ["Proposal changed after review."], paths);
        const counts = decisionCounts(review);
        return { proposalId, targetId: proposal.targetId, status: review.status, counts, unresolvedCount: counts.pending, reviewPath: paths.reviewRelativePath, manifestPath: paths.manifestRelativePath, reasons: [] };
    }
    catch (error) {
        return emptyReviewStatus(proposalId, proposal.targetId, "invalid", [errorMessage(error)], paths);
    }
}
export async function readRoleResumePlanReviewEdit(filePath) {
    const text = await readFile(path.resolve(filePath), "utf8");
    return JSON.parse(text);
}
export async function mergeReviewedPayload(workspace, proposalId, review) {
    const proposal = await showRoleResumePlanProposal(workspace, proposalId);
    if (!proposal.proposedPlan)
        throw new Error("Proposal has no structured plan.");
    const currentReview = review ?? await showRoleResumePlanReview(workspace, proposalId);
    const deterministic = await showRoleResumePlan(workspace, proposal.targetId);
    const choose = (type, proposed, fallback) => proposed.map((item) => {
        const decision = currentReview.decisions.find((entry) => entry.itemType === type && entry.itemId === item.id);
        if (!decision || decision.decision === "pending")
            throw new Error(`Unresolved review decision: ${type}/${item.id}`);
        if (decision.decision === "accept")
            return item;
        if (decision.decision === "edit")
            return decision.editedValue;
        const replacement = fallback.find((entry) => entry.id === item.id);
        if (!replacement)
            throw new Error(`Rejected item has no deterministic fallback: ${type}/${item.id}`);
        return replacement;
    });
    const positionDecision = currentReview.decisions.find((entry) => entry.itemType === "positioning");
    if (!positionDecision || positionDecision.decision === "pending")
        throw new Error("Positioning decision remains unresolved.");
    const positioning = positionDecision.decision === "accept" ? proposal.proposedPlan.positioning
        : positionDecision.decision === "edit" ? positionDecision.editedValue
            : deterministic.positioning;
    return {
        positioning,
        sections: choose("section", proposal.proposedPlan.sections, deterministic.sections),
        expectationSelections: choose("expectation", proposal.proposedPlan.expectationSelections, deterministic.expectationSelections),
        evidenceSelections: choose("evidence", proposal.proposedPlan.evidenceSelections, deterministic.evidenceSelections),
        claimBoundaries: choose("claim-boundary", proposal.proposedPlan.claimBoundaries, deterministic.claimBoundaries),
        exclusions: choose("exclusion", proposal.proposedPlan.exclusions, deterministic.exclusions),
        warnings: proposal.proposedPlan.warnings,
        ambiguities: proposal.proposedPlan.ambiguities,
    };
}
export function formatRoleResumePlanReviewStatus(status) {
    return [`Proposal ID: ${status.proposalId}`, `Target ID: ${status.targetId}`, `Review status: ${status.status}`, `Decisions: pending=${status.counts.pending}, accepted=${status.counts.accept}, edited=${status.counts.edit}, rejected=${status.counts.reject}`, `Review path: ${status.reviewPath}`, `Manifest path: ${status.manifestPath}`, ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((entry) => `- ${entry}`)] : [])].join("\n");
}
async function validateEdit(workspace, proposalId, type, itemId, value) {
    const schemas = {
        positioning: RolePositioningPlanSchema,
        section: RoleResumeSectionPlanSchema,
        expectation: ResumeExpectationSelectionSchema,
        evidence: ResumeEvidenceSelectionSchema,
        "claim-boundary": ResumeClaimBoundarySchema,
        exclusion: ResumeContentExclusionSchema,
    };
    const parsed = schemas[type].parse(value);
    if (type !== "positioning" && "id" in parsed && parsed.id !== itemId)
        throw new Error("Edited item ID must not change.");
    const proposal = await showRoleResumePlanProposal(workspace, proposalId);
    if (!proposal.proposedPlan)
        throw new Error("Proposal has no structured plan.");
    const review = await showRoleResumePlanReview(workspace, proposalId);
    const simulated = {
        ...review,
        decisions: review.decisions.map((entry) => entry.itemType === type && entry.itemId === itemId
            ? { ...entry, decision: "edit", editedValue: parsed, decidedAt: new Date().toISOString() }
            : entry.decision === "pending" ? { ...entry, decision: "reject", decidedAt: new Date().toISOString() } : entry),
    };
    const payload = await mergeReviewedPayload(workspace, proposalId, simulated);
    const deterministic = await showRoleResumePlan(workspace, proposal.targetId);
    const context = await loadRoleResumePlanningContext(workspace, proposal.targetId);
    assertRoleResumePlanProposalAgainstDeterministic(payload, deterministic, context);
}
async function writeReview(workspace, review, paths) {
    const proposalPath = resolveWithin(workspace, `targets/roles/${review.targetId}/resume-planning/proposals/${review.proposalId}/proposal.json`);
    await writeJsonAtomic(paths.reviewPath, review);
    const existing = await readJson(paths.manifestPath, {});
    const manifest = RoleResumePlanReviewManifestSchema.parse({
        schemaVersion: 1,
        proposalId: review.proposalId,
        targetId: review.targetId,
        reviewPath: paths.reviewRelativePath,
        reviewSha256: await hashFile(paths.reviewPath),
        proposalSha256: await hashFile(proposalPath),
        createdAt: existing.createdAt ?? review.createdAt,
        updatedAt: review.updatedAt,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
}
function pending(itemType, itemId) { return { itemType, itemId, decision: "pending" }; }
function positioningId(_positioning, proposalId) { return `positioning_${proposalId}`; }
function decisionCounts(review) {
    return review.decisions.reduce((counts, entry) => { counts[entry.decision] += 1; return counts; }, { pending: 0, accept: 0, edit: 0, reject: 0 });
}
function reviewPaths(workspace, targetId, proposalId) {
    const root = `targets/roles/${targetId}/resume-planning/reviews/${proposalId}`;
    return { reviewRelativePath: `${root}/review.json`, reviewPath: resolveWithin(workspace, `${root}/review.json`), manifestRelativePath: `${root}/review-manifest.json`, manifestPath: resolveWithin(workspace, `${root}/review-manifest.json`) };
}
function emptyReviewStatus(proposalId, targetId, status, reasons, paths) {
    return { proposalId, targetId, status, counts: { pending: 0, accept: 0, edit: 0, reject: 0 }, unresolvedCount: 0, reviewPath: paths?.reviewRelativePath ?? "", manifestPath: paths?.manifestRelativePath ?? "", reasons };
}
function resolveWithin(workspace, relativePath) {
    const absolute = path.resolve(workspace, relativePath);
    const root = path.resolve(workspace);
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`))
        throw new Error("Resolved path leaves workspace.");
    return absolute;
}
function errorMessage(error) { return error instanceof Error ? error.message : String(error); }
