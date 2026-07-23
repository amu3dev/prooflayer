import path from "node:path";
import { hashFile, pathExists, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { FitAssessmentProposalManifestSchema, FitAssessmentReviewManifestSchema, TargetFitAssessmentSchema, } from "./fit-assessment-schemas.js";
import { FIT_ASSESSMENT_POLICY_NAME, FIT_ASSESSMENT_POLICY_VERSION, assertAssessmentConsistency, assessmentPaths, createAssessmentManifest, deriveAmbiguities, deriveCompleteness, deriveRisks, deriveWarnings, getFitAssessmentStatus, loadAssessmentContext, showFitAssessment, } from "./fit-assessment.js";
import { getFitAssessmentProposalStatus, showFitAssessmentProposal, } from "./fit-assessment-proposal.js";
import { getFitAssessmentReviewStatus, showFitAssessmentReview, } from "./fit-assessment-review.js";
export async function approveFitAssessmentProposal(workspace, proposalId, options = {}) {
    const proposalStatus = await getFitAssessmentProposalStatus(workspace, proposalId);
    if (proposalStatus.status !== "current" || !proposalStatus.readyForReview) {
        throw new Error(`Cannot approve a ${proposalStatus.status} or invalid assessment proposal.`);
    }
    const reviewStatus = await getFitAssessmentReviewStatus(workspace, proposalId);
    if (reviewStatus.status !== "completed")
        throw new Error(`Assessment proposal review must be completed before approval. Current status: ${reviewStatus.status}`);
    const proposal = await showFitAssessmentProposal(workspace, proposalId);
    const review = await showFitAssessmentReview(workspace, proposalId);
    const deterministicStatus = await getFitAssessmentStatus(workspace, proposal.targetId, "deterministic");
    if (deterministicStatus.status !== "current")
        throw new Error(`Deterministic assessment must be current before approval. Current status: ${deterministicStatus.status}`);
    const deterministic = await showFitAssessment(workspace, proposal.targetId, "deterministic");
    const context = await loadAssessmentContext(workspace, proposal.targetId);
    if (proposal.input.approvedInterpretationSha256 !== context.approvedInterpretationSha256 ||
        proposal.input.approvedMatchingSha256 !== context.approvedMatchingSha256 ||
        proposal.input.evidenceSnapshotSha256 !== context.evidenceSnapshotSha256 ||
        proposal.input.deterministicAssessmentSha256 !== await hashFile(resolveWithin(workspace, deterministicStatus.assessmentPath)))
        throw new Error("Assessment proposal dependencies changed and approval was refused.");
    const root = targetRoot(proposal.targetType, proposal.targetId);
    const proposalManifestPath = resolveWithin(workspace, `${root}/assessment/proposals/${proposalId}/proposal-manifest.json`);
    const reviewManifestPath = resolveWithin(workspace, `${root}/assessment/reviews/${proposalId}/review-manifest.json`);
    const proposalManifest = FitAssessmentProposalManifestSchema.parse(await readJson(proposalManifestPath, null));
    const reviewManifest = FitAssessmentReviewManifestSchema.parse(await readJson(reviewManifestPath, null));
    if (reviewManifest.proposalSha256 !== proposalManifest.proposalSha256)
        throw new Error("Assessment review does not reference the current proposal hash.");
    const paths = assessmentPaths(workspace, context.target, "approved");
    const existingStatus = await getFitAssessmentStatus(workspace, proposal.targetId, "approved");
    if (existingStatus.status === "current" && await pathExists(paths.manifestPath)) {
        const currentManifest = (await readJson(paths.manifestPath, {}));
        if (currentManifest.proposalId === proposalId && currentManifest.proposalSha256 === proposalManifest.proposalSha256 && currentManifest.reviewSha256 === reviewManifest.reviewSha256) {
            return approvalResult(await showFitAssessment(workspace, proposal.targetId, "approved"), review, paths, proposalId, "already-current");
        }
    }
    if (["stale", "invalid"].includes(existingStatus.status) && !options.rebuild) {
        throw new Error(`Approved assessment is ${existingStatus.status}; use explicit --rebuild after reviewing dependency changes.`);
    }
    const proposedById = new Map(proposal.proposedExpectationAssessments.map((entry) => [entry.id, entry]));
    const deterministicByExpectation = new Map(deterministic.expectationAssessments.map((entry) => [entry.expectationId, entry]));
    const finalAssessments = review.expectationDecisions.map((decision) => {
        const proposed = proposedById.get(decision.proposedAssessmentId);
        if (!proposed)
            throw new Error(`Unknown reviewed proposed assessment: ${decision.proposedAssessmentId}`);
        const fallback = deterministicByExpectation.get(proposed.expectationId);
        if (!fallback)
            throw new Error(`Deterministic fallback is missing: ${proposed.expectationId}`);
        if (decision.decision === "reject")
            return fallback;
        if (decision.decision === "pending")
            throw new Error(`Pending assessment decision remains: ${decision.proposedAssessmentId}`);
        const content = decision.decision === "edit" ? decision.editedAssessment : proposed;
        if (!content)
            throw new Error(`Reviewed assessment content is missing: ${decision.proposedAssessmentId}`);
        return {
            ...fallback,
            ...reviewedAssessmentContent(content),
            id: fallback.id,
            expectationId: fallback.expectationId,
            expectation: fallback.expectation,
            provenance: {
                ...fallback.provenance,
                modelProposal: {
                    proposalId,
                    proposedAssessmentId: proposed.id,
                    provider: proposal.model.provider,
                    model: proposal.model.model,
                    promptTemplateVersion: proposal.prompt.templateVersion,
                    policyVersion: proposal.prompt.policyVersion,
                },
                reviewDecision: {
                    decision: decision.decision,
                    reviewer: review.reviewer,
                },
            },
            trustState: decision.decision === "edit" ? "human-edited" : "human-approved",
        };
    }).sort((a, b) => a.expectationId.localeCompare(b.expectationId));
    const summary = reviewedSummary(review.summaryDecision, proposal.proposedSummary, deterministic.summary);
    const completeness = deriveCompleteness(context.target.type, finalAssessments, context.approvedMatching.completeness.status);
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.assessmentPath)) {
        try {
            createdAt = TargetFitAssessmentSchema.parse(await readJson(paths.assessmentPath, null)).createdAt;
        }
        catch { /* Explicit rebuild recovers malformed output. */ }
    }
    const base = {
        ...deterministic,
        expectationAssessments: finalAssessments,
        summary,
        risks: deriveRisks(context.target.id, finalAssessments, completeness),
        warnings: deriveWarnings(context.target.id, finalAssessments, completeness),
        ambiguities: deriveAmbiguities(context.target.id, finalAssessments),
        completeness,
        createdAt,
        updatedAt: now,
        assessmentPolicy: { name: FIT_ASSESSMENT_POLICY_NAME, version: FIT_ASSESSMENT_POLICY_VERSION },
    };
    const approved = TargetFitAssessmentSchema.parse(base);
    assertAssessmentConsistency(approved, context);
    await writeJsonAtomic(paths.assessmentPath, approved);
    const manifest = createAssessmentManifest(approved, context, paths.assessmentRelativePath, await hashFile(paths.assessmentPath), "approved", createdAt, now, { proposalId, proposalSha256: proposalManifest.proposalSha256, reviewSha256: reviewManifest.reviewSha256 });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return approvalResult(approved, review, paths, proposalId, existingStatus.status === "missing" ? "created" : "rebuilt");
}
function reviewedAssessmentContent(content) {
    return {
        supportStatus: content.supportStatus,
        proofQuality: content.proofQuality,
        evidenceSufficiency: content.evidenceSufficiency,
        defensibility: content.defensibility,
        freshnessRisk: content.freshnessRisk,
        contradictionRisk: content.contradictionRisk,
        gapType: content.gapType,
        assessmentConfidence: content.assessmentConfidence,
        materiality: content.materiality,
        approvedMatchIds: content.approvedMatchIds,
        evidenceIds: content.evidenceIds,
        rationale: content.rationale,
        limitations: content.limitations,
        recommendedEvidenceActions: content.recommendedEvidenceActions,
    };
}
export function formatApproveFitAssessmentResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Target type: ${result.targetType}`,
        `Assessment mode: ${result.mode}`,
        `Proposal ID: ${result.proposalId}`,
        `Result: ${result.result}`,
        `Deterministic fallbacks: ${result.deterministicApprovedCount}`,
        `Human approved: ${result.humanApprovedCount}`,
        `Human edited: ${result.humanEditedCount}`,
        `Rejected proposal fallbacks: ${result.rejectedFallbackCount}`,
        `Completeness: ${result.completeness}`,
        `Usable for future resume construction: ${result.usableForResumeConstruction ? "yes" : "no"}`,
        `Usable for future application construction: ${result.usableForApplicationConstruction ? "yes" : "no"}`,
        `Approved assessment path: ${result.assessmentPath}`,
        `Manifest path: ${result.manifestPath}`,
    ].join("\n");
}
function reviewedSummary(decision, proposed, deterministic) {
    if (decision.decision === "reject")
        return deterministic;
    if (decision.decision === "accept") {
        if (!proposed)
            throw new Error("Accepted assessment proposal has no summary.");
        return proposed;
    }
    if (decision.decision === "edit") {
        if (!decision.editedSummary)
            throw new Error("Edited assessment summary is missing.");
        return decision.editedSummary;
    }
    throw new Error("Assessment summary review is incomplete.");
}
function approvalResult(assessment, review, paths, proposalId, result) {
    const counts = assessment.expectationAssessments.reduce((byTrust, entry) => {
        byTrust[entry.trustState] += 1;
        return byTrust;
    }, { "deterministic-approved": 0, "human-approved": 0, "human-edited": 0 });
    return {
        targetId: assessment.targetId,
        targetType: assessment.targetType,
        mode: assessment.mode,
        proposalId,
        result,
        deterministicApprovedCount: counts["deterministic-approved"],
        humanApprovedCount: counts["human-approved"],
        humanEditedCount: counts["human-edited"],
        rejectedFallbackCount: review.expectationDecisions.filter((entry) => entry.decision === "reject").length,
        completeness: assessment.completeness.status,
        usableForResumeConstruction: assessment.completeness.usableForResumeConstruction,
        usableForApplicationConstruction: assessment.completeness.usableForApplicationConstruction,
        assessmentPath: paths.assessmentRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
}
function targetRoot(targetType, targetId) {
    return `targets/${targetType === "role" ? "roles" : "jobs"}/${targetId}`;
}
function resolveWithin(workspace, relativePath) {
    const resolved = path.resolve(workspace, relativePath);
    const relation = path.relative(path.resolve(workspace), resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation))
        throw new Error(`Approved assessment path escapes workspace: ${relativePath}`);
    return resolved;
}
