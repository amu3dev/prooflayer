import { readFile } from "node:fs/promises";
import path from "node:path";
import { hashFile, pathExists, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { EditedExpectationFitAssessmentSchema, FitAssessmentProposalManifestSchema, FitAssessmentProposalReviewSchema, FitAssessmentReviewManifestSchema, FitAssessmentSummarySchema, } from "./fit-assessment-schemas.js";
import { getFitAssessmentProposalStatus, showFitAssessmentProposal, } from "./fit-assessment-proposal.js";
import { showFitAssessment } from "./fit-assessment.js";
const REVIEW_FILE = "review.json";
const MANIFEST_FILE = "review-manifest.json";
export async function initializeFitAssessmentReview(workspace, proposalId, options = {}) {
    const proposalStatus = await getFitAssessmentProposalStatus(workspace, proposalId);
    if (!proposalStatus.readyForReview)
        throw new Error(`Assessment proposal is not ready for review. Current status: ${proposalStatus.status}`);
    const proposal = await showFitAssessmentProposal(workspace, proposalId);
    const paths = reviewPaths(workspace, proposal.targetType, proposal.targetId, proposalId);
    if (await pathExists(paths.reviewPath))
        return getFitAssessmentReviewStatus(workspace, proposalId);
    const now = (options.now ?? (() => new Date()))().toISOString();
    const review = FitAssessmentProposalReviewSchema.parse({
        schemaVersion: 1,
        proposalId,
        targetId: proposal.targetId,
        status: "in-progress",
        expectationDecisions: proposal.proposedExpectationAssessments.map((entry) => ({ proposedAssessmentId: entry.id, decision: "pending" })),
        summaryDecision: { decision: "pending" },
        reviewer: { type: "human", ...(options.reviewerName?.trim() ? { name: options.reviewerName.trim() } : {}) },
        createdAt: now,
        updatedAt: now,
    });
    await persistReview(workspace, review, paths);
    return getFitAssessmentReviewStatus(workspace, proposalId);
}
export async function setFitAssessmentReviewDecision(workspace, proposalId, proposedAssessmentId, input, options = {}) {
    await assertProposalReviewable(workspace, proposalId);
    const proposal = await showFitAssessmentProposal(workspace, proposalId);
    const proposed = proposal.proposedExpectationAssessments.find((entry) => entry.id === proposedAssessmentId);
    if (!proposed)
        throw new Error(`Unknown proposed expectation assessment ID: ${proposedAssessmentId}`);
    const review = await showFitAssessmentReview(workspace, proposalId);
    assertMutable(review);
    const existing = review.expectationDecisions.find((entry) => entry.proposedAssessmentId === proposedAssessmentId);
    if (!existing)
        throw new Error(`Review is missing proposed assessment: ${proposedAssessmentId}`);
    if (existing.decision !== "pending")
        throw new Error(`A decision already exists for proposed assessment: ${proposedAssessmentId}`);
    if (input.decision === "edit") {
        if (!input.editedAssessment)
            throw new Error("Edit requires edited assessment content.");
        validateEditedAssessment(input.editedAssessment, proposed);
    }
    else if (input.editedAssessment) {
        throw new Error("Only an edit decision may include edited assessment content.");
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    const updated = FitAssessmentProposalReviewSchema.parse({
        ...review,
        expectationDecisions: review.expectationDecisions.map((entry) => entry.proposedAssessmentId === proposedAssessmentId
            ? {
                proposedAssessmentId,
                decision: input.decision,
                ...(input.editedAssessment ? { editedAssessment: input.editedAssessment } : {}),
                ...(input.reviewNote?.trim() ? { reviewNote: input.reviewNote.trim() } : {}),
                decidedAt: now,
            }
            : entry),
        updatedAt: now,
    });
    await persistReview(workspace, updated, pathsForProposal(workspace, proposal));
    return getFitAssessmentReviewStatus(workspace, proposalId);
}
export async function setFitAssessmentSummaryReviewDecision(workspace, proposalId, input, options = {}) {
    await assertProposalReviewable(workspace, proposalId);
    const proposal = await showFitAssessmentProposal(workspace, proposalId);
    const review = await showFitAssessmentReview(workspace, proposalId);
    assertMutable(review);
    if (review.summaryDecision.decision !== "pending")
        throw new Error("A summary review decision already exists.");
    if (input.decision === "edit") {
        if (!input.editedSummary)
            throw new Error("Summary edit requires edited summary content.");
        if (input.editedSummary.mode !== proposal.mode)
            throw new Error("Edited summary mode must match the target mode.");
        validateForbiddenText(input.editedSummary.narrative);
    }
    else if (input.editedSummary) {
        throw new Error("Only a summary edit may include edited summary content.");
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    const updated = FitAssessmentProposalReviewSchema.parse({
        ...review,
        summaryDecision: {
            decision: input.decision,
            ...(input.editedSummary ? { editedSummary: input.editedSummary } : {}),
            ...(input.reviewNote?.trim() ? { reviewNote: input.reviewNote.trim() } : {}),
            decidedAt: now,
        },
        updatedAt: now,
    });
    await persistReview(workspace, updated, pathsForProposal(workspace, proposal));
    return getFitAssessmentReviewStatus(workspace, proposalId);
}
export async function completeFitAssessmentReview(workspace, proposalId, options = {}) {
    await assertProposalReviewable(workspace, proposalId);
    const proposal = await showFitAssessmentProposal(workspace, proposalId);
    const review = await showFitAssessmentReview(workspace, proposalId);
    if (review.status === "completed")
        return getFitAssessmentReviewStatus(workspace, proposalId);
    const pending = review.expectationDecisions.filter((entry) => entry.decision === "pending").length;
    if (pending || review.summaryDecision.decision === "pending") {
        throw new Error(`Review cannot be completed: ${pending} expectation decision(s) and ${review.summaryDecision.decision === "pending" ? 1 : 0} summary decision remain pending.`);
    }
    assertExactCoverage(review, proposal.proposedExpectationAssessments.map((entry) => entry.id));
    await validateCompletedReview(workspace, review, proposal);
    const now = (options.now ?? (() => new Date()))().toISOString();
    const completed = FitAssessmentProposalReviewSchema.parse({ ...review, status: "completed", updatedAt: now });
    await persistReview(workspace, completed, pathsForProposal(workspace, proposal));
    return getFitAssessmentReviewStatus(workspace, proposalId);
}
export async function showFitAssessmentReview(workspace, proposalId) {
    const proposal = await showFitAssessmentProposal(workspace, proposalId);
    const paths = pathsForProposal(workspace, proposal);
    if (!(await pathExists(paths.reviewPath)))
        throw new Error(`Assessment review not found for proposal: ${proposalId}`);
    return FitAssessmentProposalReviewSchema.parse(await readJson(paths.reviewPath, null));
}
export async function getFitAssessmentReviewStatus(workspace, proposalId) {
    const proposal = await showFitAssessmentProposal(workspace, proposalId);
    const paths = pathsForProposal(workspace, proposal);
    const reviewExists = await pathExists(paths.reviewPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const emptyCounts = { pending: 0, accept: 0, edit: 0, reject: 0 };
    const base = { proposalId, targetId: proposal.targetId, reviewExists, manifestExists, expectationCounts: { ...emptyCounts }, summaryDecision: "pending", reviewPath: paths.reviewRelativePath, manifestPath: paths.manifestRelativePath };
    if (!reviewExists && !manifestExists)
        return { ...base, reviewHashMatches: null, proposalHashMatches: null, status: "missing", reasons: ["No assessment review exists."] };
    if (!reviewExists || !manifestExists)
        return { ...base, reviewHashMatches: null, proposalHashMatches: null, status: "invalid", reasons: ["Assessment review artifact set is incomplete."] };
    try {
        const review = FitAssessmentProposalReviewSchema.parse(await readJson(paths.reviewPath, null));
        const manifest = FitAssessmentReviewManifestSchema.parse(await readJson(paths.manifestPath, null));
        const proposalManifest = FitAssessmentProposalManifestSchema.parse(await readJson(proposalManifestPath(workspace, proposal.targetType, proposal.targetId, proposalId), null));
        const reviewHashMatches = (await hashFile(paths.reviewPath)) === manifest.reviewSha256;
        const proposalHashMatches = proposalManifest.proposalSha256 === manifest.proposalSha256;
        const reasons = [];
        if (!reviewHashMatches)
            reasons.push("Review SHA-256 does not match its manifest.");
        if (!proposalHashMatches)
            reasons.push("Review references a different proposal hash.");
        if (review.proposalId !== proposalId || review.targetId !== proposal.targetId || manifest.proposalId !== proposalId || manifest.targetId !== proposal.targetId || manifest.reviewPath !== paths.reviewRelativePath)
            reasons.push("Review identity or paths are invalid.");
        try {
            assertExactCoverage(review, proposal.proposedExpectationAssessments.map((entry) => entry.id));
            if (review.status === "completed")
                await validateCompletedReview(workspace, review, proposal);
        }
        catch (error) {
            reasons.push(errorMessage(error));
        }
        return {
            ...base,
            reviewHashMatches,
            proposalHashMatches,
            status: reasons.length ? "invalid" : review.status,
            expectationCounts: countDecisions(review.expectationDecisions.map((entry) => entry.decision)),
            summaryDecision: review.summaryDecision.decision,
            reasons,
        };
    }
    catch (error) {
        return { ...base, reviewHashMatches: null, proposalHashMatches: null, status: "invalid", reasons: [`Stored assessment review is invalid: ${errorMessage(error)}`] };
    }
}
export async function readEditedFitAssessmentFile(filePath) {
    try {
        return EditedExpectationFitAssessmentSchema.parse(JSON.parse(await readFile(path.resolve(filePath), "utf8")));
    }
    catch (error) {
        throw new Error(`Invalid edited fit assessment JSON: ${errorMessage(error)}`);
    }
}
export async function readEditedFitAssessmentSummaryFile(filePath) {
    try {
        return FitAssessmentSummarySchema.parse(JSON.parse(await readFile(path.resolve(filePath), "utf8")));
    }
    catch (error) {
        throw new Error(`Invalid edited fit assessment summary JSON: ${errorMessage(error)}`);
    }
}
export function formatFitAssessmentReviewStatus(status) {
    return [
        `Proposal ID: ${status.proposalId}`,
        `Target ID: ${status.targetId}`,
        `Review status: ${status.status}`,
        `Expectation decisions: pending=${status.expectationCounts.pending}, accepted=${status.expectationCounts.accept}, edited=${status.expectationCounts.edit}, rejected=${status.expectationCounts.reject}`,
        `Summary decision: ${status.summaryDecision}`,
        `Review path: ${status.reviewPath}`,
        `Manifest path: ${status.manifestPath}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
async function validateCompletedReview(workspace, review, proposal) {
    if (!proposal.proposedSummary)
        throw new Error("Assessment proposal has no valid summary.");
    const deterministic = await showFitAssessment(workspace, proposal.targetId, "deterministic");
    const proposedById = new Map(proposal.proposedExpectationAssessments.map((entry) => [entry.id, entry]));
    const deterministicByExpectation = new Map(deterministic.expectationAssessments.map((entry) => [entry.expectationId, entry]));
    const merged = review.expectationDecisions.map((decision) => {
        const proposed = proposedById.get(decision.proposedAssessmentId);
        if (!proposed)
            throw new Error(`Unknown reviewed assessment: ${decision.proposedAssessmentId}`);
        const source = deterministicByExpectation.get(proposed.expectationId);
        if (!source)
            throw new Error(`Deterministic fallback is missing: ${proposed.expectationId}`);
        if (decision.decision === "reject")
            return source;
        if (decision.decision === "edit") {
            if (!decision.editedAssessment)
                throw new Error(`Edited assessment content is missing: ${decision.proposedAssessmentId}`);
            validateEditedAssessment(decision.editedAssessment, proposed);
            return { ...source, ...decision.editedAssessment };
        }
        if (decision.decision === "accept")
            return { ...source, ...proposed, id: source.id, expectation: source.expectation, trustState: source.trustState };
        throw new Error(`Pending review decision remains: ${decision.proposedAssessmentId}`);
    });
    const summary = review.summaryDecision.decision === "accept"
        ? proposal.proposedSummary
        : review.summaryDecision.decision === "edit"
            ? review.summaryDecision.editedSummary
            : review.summaryDecision.decision === "reject"
                ? deterministic.summary
                : undefined;
    if (!summary)
        throw new Error("Completed review lacks a valid summary decision.");
    validateSummaryCounts(summary, merged);
    validateForbiddenText(summary.narrative);
}
function validateEditedAssessment(edited, proposed) {
    if (!sameSet(edited.approvedMatchIds, proposed.approvedMatchIds))
        throw new Error("Edited assessment cannot change approved match IDs.");
    if (!sameSet(edited.evidenceIds, proposed.evidenceIds))
        throw new Error("Edited assessment cannot change reviewed evidence IDs.");
    const coverage = proposed.provenance.deterministicInputs.coverageStatus;
    if (edited.supportStatus === "strongly-supported" && !(coverage === "matched" && proposed.provenance.deterministicInputs.matchTypes.includes("direct") && proposed.provenance.deterministicInputs.evidenceStrengths.includes("strong")))
        throw new Error("Strong support requires approved direct strong evidence.");
    if (edited.supportStatus === "unsupported" && edited.approvedMatchIds.length)
        throw new Error("Unsupported assessment cannot contain approved supporting matches.");
    if (edited.supportStatus === "conflicting" && !proposed.provenance.deterministicInputs.matchTypes.includes("contradictory"))
        throw new Error("Conflicting assessment requires approved contradictory evidence.");
    if (edited.supportStatus === "not-assessed" && coverage !== "not-assessed")
        throw new Error("Not-assessed requires approved not-assessed coverage.");
    if (edited.gapType === "experience-gap-possible" && !/possible|unclear|may|cannot confirm/i.test(`${edited.rationale} ${edited.limitations.join(" ")}`))
        throw new Error("Possible experience gaps must preserve uncertainty.");
    validateForbiddenText([edited.rationale, ...edited.limitations, ...edited.recommendedEvidenceActions.map((entry) => entry.rationale)].join(" "));
}
function validateSummaryCounts(summary, entries) {
    if (summary.mode === "role-positioning") {
        const counts = statusCounts(entries);
        if (summary.stronglySupportedCount !== counts.stronglySupported || summary.supportedCount !== counts.supported || summary.partiallySupportedCount !== counts.partiallySupported || summary.unsupportedCount !== counts.unsupported || summary.conflictingCount !== counts.conflicting || summary.notAssessedCount !== counts.notAssessed)
            throw new Error("Edited role summary counts are inconsistent with reviewed assessment decisions.");
        return;
    }
    const groups = [
        [summary.requiredExpectationSummary, entries.filter((entry) => entry.expectation.necessity === "required")],
        [summary.preferredExpectationSummary, entries.filter((entry) => entry.expectation.necessity === "preferred")],
        [summary.contextualExpectationSummary, entries.filter((entry) => !["required", "preferred"].includes(entry.expectation.necessity))],
    ];
    for (const [actual, grouped] of groups) {
        const counts = statusCounts(grouped);
        if (actual.total !== grouped.length || actual.stronglySupported !== counts.stronglySupported || actual.supported !== counts.supported || actual.partiallySupported !== counts.partiallySupported || actual.unsupported !== counts.unsupported || actual.conflicting !== counts.conflicting || actual.notAssessed !== counts.notAssessed)
            throw new Error("Edited job summary counts are inconsistent with reviewed assessment decisions.");
    }
}
function validateForbiddenText(text) {
    const checks = [
        /\b\d+(?:\.\d+)?%\s*(fit|match|alignment)?\b/i,
        /\b(resume bullet|cover letter|screening answer|curriculum vitae)\b/i,
        /\b(should|recommend)\s+(apply|hire|interview)\b/i,
        /\b(hiring|acceptance|ATS)\s+(probability|chance|likelihood|score)\b/i,
        /\b(definitely|clearly)\s+(lacks|has no)\s+(experience|capability|skill)\b/i,
    ];
    if (checks.some((pattern) => pattern.test(text)))
        throw new Error("Reviewed assessment contains forbidden fit, application, resume, prediction, or definite experience-gap language.");
}
async function assertProposalReviewable(workspace, proposalId) {
    const status = await getFitAssessmentProposalStatus(workspace, proposalId);
    if (!status.readyForReview)
        throw new Error(`Only a current ready-for-review assessment proposal may be reviewed. Current status: ${status.status}`);
}
function assertMutable(review) {
    if (review.status === "completed")
        throw new Error("Completed assessment reviews cannot be modified.");
}
function assertExactCoverage(review, proposalIds) {
    const reviewed = review.expectationDecisions.map((entry) => entry.proposedAssessmentId);
    if (!sameSet(reviewed, proposalIds))
        throw new Error("Review decisions do not exactly cover proposed expectation assessments.");
}
function countDecisions(decisions) {
    return decisions.reduce((counts, decision) => {
        counts[decision] += 1;
        return counts;
    }, { pending: 0, accept: 0, edit: 0, reject: 0 });
}
async function persistReview(workspace, review, paths) {
    const proposal = await showFitAssessmentProposal(workspace, review.proposalId);
    const manifest = FitAssessmentProposalManifestSchema.parse(await readJson(proposalManifestPath(workspace, proposal.targetType, proposal.targetId, proposal.id), null));
    await writeJsonAtomic(paths.reviewPath, review);
    await writeJsonAtomic(paths.manifestPath, FitAssessmentReviewManifestSchema.parse({
        schemaVersion: 1,
        proposalId: review.proposalId,
        targetId: review.targetId,
        reviewPath: paths.reviewRelativePath,
        reviewSha256: await hashFile(paths.reviewPath),
        proposalSha256: manifest.proposalSha256,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
    }));
}
function pathsForProposal(workspace, proposal) {
    return reviewPaths(workspace, proposal.targetType, proposal.targetId, proposal.id);
}
function reviewPaths(workspace, targetType, targetId, proposalId) {
    const root = `targets/${targetType === "role" ? "roles" : "jobs"}/${targetId}/assessment/reviews/${proposalId}`;
    const reviewRelativePath = `${root}/${REVIEW_FILE}`;
    const manifestRelativePath = `${root}/${MANIFEST_FILE}`;
    return {
        reviewRelativePath,
        reviewPath: resolveWithin(workspace, reviewRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
function proposalManifestPath(workspace, targetType, targetId, proposalId) {
    return resolveWithin(workspace, `targets/${targetType === "role" ? "roles" : "jobs"}/${targetId}/assessment/proposals/${proposalId}/proposal-manifest.json`);
}
function resolveWithin(workspace, relativePath) {
    const resolved = path.resolve(workspace, relativePath);
    const relation = path.relative(path.resolve(workspace), resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation))
        throw new Error(`Assessment review path escapes workspace: ${relativePath}`);
    return resolved;
}
function sameSet(left, right) {
    return new Set(left).size === left.length && new Set(right).size === right.length && left.length === right.length && left.every((entry) => right.includes(entry));
}
function statusCounts(entries) {
    return entries.reduce((counts, entry) => {
        if (entry.supportStatus === "strongly-supported")
            counts.stronglySupported += 1;
        else if (entry.supportStatus === "supported")
            counts.supported += 1;
        else if (entry.supportStatus === "partially-supported")
            counts.partiallySupported += 1;
        else if (entry.supportStatus === "unsupported")
            counts.unsupported += 1;
        else if (entry.supportStatus === "conflicting")
            counts.conflicting += 1;
        else
            counts.notAssessed += 1;
        return counts;
    }, { stronglySupported: 0, supported: 0, partiallySupported: 0, unsupported: 0, conflicting: 0, notAssessed: 0 });
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
