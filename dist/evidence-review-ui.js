import { createEvidenceClaimReview, listEvidenceClaimReviews, loadEffectiveEvidenceClaimReviews, } from "./evidence-claim-review.js";
import { EvidenceClaimFactualSupportSchema, EvidenceClaimMetricReviewStateSchema, EvidenceClaimNatureSchema, EvidenceClaimPublicSafetySchema, EvidenceClaimResumeReadinessSchema, EvidenceClaimReviewDecisionSchema, EvidenceClaimReviewInputSchema, EvidenceClaimScopeStateSchema, EvidenceClaimWorkContextSchema, } from "./evidence-claim-review-schemas.js";
import { getEvidenceReviewBatchStatus } from "./evidence-review-batch.js";
import { evidenceReviewSelectionReason, loadEvidenceReviewWorkspaceData, } from "./evidence-review-workspace.js";
import { deriveHumanTitle } from "./human-readable-markdown.js";
export const EVIDENCE_REVIEW_UI_NAME = "ProofLayer Local Evidence Review UI";
export const evidenceReviewUiFormOptions = {
    decisions: EvidenceClaimReviewDecisionSchema.options,
    factualSupport: EvidenceClaimFactualSupportSchema.options,
    scopes: EvidenceClaimScopeStateSchema.options,
    publicSafety: EvidenceClaimPublicSafetySchema.options,
    resumeReadiness: EvidenceClaimResumeReadinessSchema.options,
    metricStates: EvidenceClaimMetricReviewStateSchema.options,
    workContexts: EvidenceClaimWorkContextSchema.options,
    claimNatures: EvidenceClaimNatureSchema.options,
};
export class EvidenceReviewUiSubmissionError extends Error {
    fieldErrors;
    constructor(message, fieldErrors = {}) {
        super(message);
        this.name = "EvidenceReviewUiSubmissionError";
        this.fieldErrors = fieldErrors;
    }
}
export async function loadEvidenceReviewUiBatch(workspace, batchId) {
    const status = await getEvidenceReviewBatchStatus(workspace, batchId);
    if (status.status !== "current") {
        throw new Error(`Evidence review batch must be current before opening the UI: ${status.status}.`);
    }
    const data = await loadEvidenceReviewWorkspaceData(workspace, batchId);
    const [effectiveReviews, reviewEntries] = await Promise.all([
        loadEffectiveEvidenceClaimReviews(workspace),
        listEvidenceClaimReviews(workspace),
    ]);
    const reviewEntryByClaim = new Map(reviewEntries.map((entry) => [entry.claimId, entry]));
    const claims = data.claims.map((claim) => toUiClaim(data.batch.id, data.target.id, claim, reviewEntryByClaim.get(claim.claim.id)?.status ?? "missing", effectiveReviews.get(claim.claim.id)?.review));
    const reviewed = claims.filter(({ review }) => review.lifecycle === "current").length;
    const selectedPriority = {
        high: claims.filter(({ priority }) => priority === "high").length,
        medium: claims.filter(({ priority }) => priority === "medium").length,
        low: claims.filter(({ priority }) => priority === "low").length,
    };
    const decisions = {};
    for (const claim of claims) {
        if (claim.review.lifecycle !== "current" || !claim.review.decision)
            continue;
        decisions[claim.review.decision] = (decisions[claim.review.decision] ?? 0) + 1;
    }
    const nextPendingClaimId = claims.find(({ review }) => review.lifecycle !== "current")?.id;
    return {
        batchId: data.batch.id,
        target: {
            id: data.target.id,
            title: data.target.title,
            ...(data.target.company ? { company: data.target.company } : {}),
            ...(data.target.location ? { location: data.target.location } : {}),
            ...(data.target.workingModel ? { workingModel: data.target.workingModel } : {}),
        },
        stage: "Evidence Review",
        purpose: "Review selected candidate claims against their evidence and matching Job requirements before they can become eligible downstream.",
        warning: data.batch.warning,
        claims,
        progress: {
            selected: claims.length,
            reviewed,
            pending: claims.length - reviewed,
            selectedPriority,
            decisions,
        },
        complete: claims.length > 0 && reviewed === claims.length,
        ...(nextPendingClaimId ? { nextPendingClaimId } : {}),
        nextCommand: `prooflayer job continue ${data.target.id}`,
    };
}
export async function loadEvidenceReviewUiClaim(workspace, batchId, claimId) {
    const batch = await loadEvidenceReviewUiBatch(workspace, batchId);
    const claim = batch.claims.find((entry) => entry.id === claimId);
    if (!claim)
        throw new Error("Unknown claim or claim does not belong to the active review batch.");
    return { batch, claim };
}
export async function submitEvidenceReviewUiClaim(workspace, batchId, claimId, fields, options = {}) {
    if (options.readOnly) {
        throw new EvidenceReviewUiSubmissionError("This review session is read-only.");
    }
    const { claim } = await loadEvidenceReviewUiClaim(workspace, batchId, claimId);
    const rawInput = reviewInputFromFields(claim, fields);
    const parsed = EvidenceClaimReviewInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        throw new EvidenceReviewUiSubmissionError("Review validation failed. Correct the highlighted fields and submit again.", zodFieldErrors(parsed.error.issues));
    }
    let input = parsed.data;
    if (fields.confirmSupersession === "true") {
        if (!claim.review.id || claim.review.lifecycle !== "current") {
            throw new EvidenceReviewUiSubmissionError("There is no current review to supersede.", { confirmSupersession: ["A current review is required before supersession."] });
        }
        input = { ...input, supersedesReviewId: claim.review.id };
    }
    let result;
    try {
        result = await createEvidenceClaimReview(workspace, claimId, input);
    }
    catch (error) {
        const message = safeErrorMessage(error);
        throw new EvidenceReviewUiSubmissionError(message, inferServiceFieldErrors(message));
    }
    const refreshed = await loadEvidenceReviewUiBatch(workspace, batchId);
    return {
        result,
        ...(refreshed.nextPendingClaimId ? { nextPendingClaimId: refreshed.nextPendingClaimId } : {}),
        batchComplete: refreshed.complete,
    };
}
export async function validateEvidenceReviewUiBatch(workspace, batchId) {
    return loadEvidenceReviewUiBatch(workspace, batchId);
}
function toUiClaim(batchId, targetId, item, lifecycle, review) {
    const sourceById = new Map(item.sources.map((source) => [source.id, source]));
    const evidence = item.evidence.map((entry) => {
        const sources = entry.sourceIds.map((sourceId) => sourceById.get(sourceId)).filter((source) => Boolean(source));
        const excerptWithheld = !["public", "generic_only"].includes(entry.visibility) ||
            entry.sensitivityFlags.length > 0 ||
            sources.some((source) => !["public", "generic_only"].includes(source.visibility));
        return {
            id: entry.id,
            title: deriveHumanTitle(entry.normalizedSummary || entry.text, "Untitled evidence"),
            summary: entry.normalizedSummary,
            ...(!excerptWithheld ? { sourceExcerpt: entry.text } : {}),
            excerptWithheld,
            category: entry.category,
            confidence: entry.confidence,
            visibility: entry.visibility,
            ...(entry.dateRange ? { dateRange: entry.dateRange } : {}),
            ...(entry.company ? { company: entry.company } : {}),
            ...(entry.project ? { project: entry.project } : {}),
            technologies: entry.technologies ?? [],
            domains: entry.domains ?? [],
            sources: sources.map((source) => ({
                id: source.id,
                label: source.title || source.type,
                type: source.type,
                visibility: source.visibility,
                status: source.status,
                sha256: source.hash,
            })),
        };
    });
    const requirements = item.requirements.map((requirement) => ({
        id: requirement.id,
        title: deriveHumanTitle(requirement.normalizedLabel || requirement.sourceText, "Untitled requirement"),
        sourceText: requirement.sourceText,
        category: requirement.category,
        necessity: requirement.necessity,
        confidence: requirement.confidence,
        explicitness: requirement.explicitness,
        namedTechnologies: requirement.namedTechnologies,
        keywords: requirement.keywords,
        sourceReferences: requirement.provenance.sourceReferences.map((reference) => ({
            label: "Persisted Job Description",
            startLine: reference.startLine,
            endLine: reference.endLine,
            sha256: reference.sha256,
            excerptSha256: reference.excerptSha256,
        })),
    }));
    return {
        id: item.claim.id,
        title: deriveHumanTitle(item.claim.claim, "Untitled claim"),
        text: item.claim.claim,
        priority: item.entry.priority,
        selectionReason: evidenceReviewSelectionReason(item.entry),
        potentialMetric: item.entry.potentialMetric,
        sourceApprovalStatus: item.claim.approvalStatus,
        sourceOutputReadiness: item.claim.outputReadiness,
        sourcePublicSafe: item.claim.publicSafe,
        sourceNeedsConfirmation: item.claim.needsConfirmation,
        sourceMetricStatus: item.claim.metricStatus,
        sourceClassification: {
            type: item.claim.type,
            ...(item.claim.sourceSection ? { section: item.claim.sourceSection } : {}),
            ...(item.claim.dateRange ? { dateRange: item.claim.dateRange } : {}),
            ...(item.claim.parentRoleId ? { parentRoleId: item.claim.parentRoleId } : {}),
            ...(item.claim.parentProjectId ? { parentProjectId: item.claim.parentProjectId } : {}),
        },
        review: {
            lifecycle,
            ...(review
                ? {
                    id: review.id,
                    decision: review.decision,
                    factualSupport: review.factualSupport,
                    scope: review.scope,
                    publicSafety: review.publicSafety,
                    resumeReadiness: review.resumeReadiness,
                    eligibleForRoleMatching: review.eligibleForRoleMatching,
                    eligibleForJobMapping: review.eligibleForJobMapping,
                    requiredQualifiers: review.requiredQualifiers,
                    workContext: review.classification.workContext,
                    claimNature: review.classification.claimNature,
                }
                : { requiredQualifiers: [] }),
        },
        evidence,
        requirements,
        template: {
            path: item.templatePath,
            sha256: item.templateSha256,
            reviewedClaimSha256: item.template.reviewedClaimSha256,
        },
        audit: {
            batchId,
            targetId,
            claimRecordSha256: item.claimRecordSha256,
            evidenceSetSha256: item.evidenceSetSha256,
            provenanceSetSha256: item.provenanceSetSha256,
            requirementSetSha256: item.requirementSetSha256,
        },
    };
}
function reviewInputFromFields(claim, fields) {
    const correctedClaim = optional(fields.correctedClaim);
    const metricExactText = optional(fields.metricExactText);
    const metricUnit = optional(fields.metricUnit);
    const metricScope = optional(fields.metricScope);
    return {
        schemaVersion: 1,
        claimId: claim.id,
        reviewedClaimSha256: claim.template.reviewedClaimSha256,
        decision: fields.decision,
        ...(correctedClaim ? { correctedClaim } : {}),
        requiredQualifiers: lines(fields.requiredQualifiers),
        factualSupport: fields.factualSupport,
        scope: fields.scope,
        publicSafety: fields.publicSafety,
        resumeReadiness: fields.resumeReadiness,
        eligibleForRoleMatching: booleanField(fields.eligibleForRoleMatching),
        eligibleForJobMapping: booleanField(fields.eligibleForJobMapping),
        metricReview: {
            state: fields.metricState,
            ...(metricExactText ? { exactText: metricExactText } : {}),
            ...(metricUnit ? { unit: metricUnit } : {}),
            ...(metricScope ? { scope: metricScope } : {}),
            qualifiers: lines(fields.metricQualifiers),
        },
        classification: {
            workContext: fields.workContext,
            claimNature: fields.claimNature,
        },
        risks: riskLines(fields.risks),
        warnings: lines(fields.warnings),
        ambiguities: lines(fields.ambiguities),
        reviewerRationale: fields.reviewerRationale,
    };
}
function riskLines(value) {
    return lines(value).map((line) => {
        const [severity = "", code = "", ...message] = line.split("|").map((part) => part.trim());
        return { severity, code, message: message.join(" | ") };
    });
}
function lines(value) {
    return (value ?? "").split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean);
}
function optional(value) {
    const normalized = value?.trim();
    return normalized || undefined;
}
function booleanField(value) {
    if (value === "true")
        return true;
    if (value === "false")
        return false;
    return undefined;
}
function zodFieldErrors(issues) {
    const result = {};
    for (const issue of issues) {
        const key = formFieldForPath(issue.path.map(String).join("."));
        result[key] = [...(result[key] ?? []), issue.message];
    }
    return result;
}
function formFieldForPath(path) {
    const aliases = {
        "metricReview.state": "metricState",
        "metricReview.exactText": "metricExactText",
        "metricReview.unit": "metricUnit",
        "metricReview.scope": "metricScope",
        "metricReview.qualifiers": "metricQualifiers",
        "classification.workContext": "workContext",
        "classification.claimNature": "claimNature",
    };
    return aliases[path] ?? path.split(".")[0] ?? "form";
}
function inferServiceFieldErrors(message) {
    const field = /qualifier|corrected claim/i.test(message) ? "correctedClaim"
        : /metric/i.test(message) ? "metricState"
            : /resume-ready|resume readiness/i.test(message) ? "resumeReadiness"
                : /public|private|restricted/i.test(message) ? "publicSafety"
                    : /eligib/i.test(message) ? "eligibleForJobMapping"
                        : /project|employment|work context/i.test(message) ? "workContext"
                            : /achievement|responsibility/i.test(message) ? "claimNature"
                                : /supersed/i.test(message) ? "confirmSupersession"
                                    : "form";
    return { [field]: [message] };
}
function safeErrorMessage(error) {
    const message = error instanceof Error ? error.message : String(error);
    return message
        .replace(/\/Users\/[^/\s]+(?:\/[^\s:]+)*/g, "<local-path>")
        .replace(/[A-Za-z]:\\[^\s:]+/g, "<local-path>");
}
