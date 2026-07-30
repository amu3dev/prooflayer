import { isEvidenceReviewMetricCandidate } from "./evidence-review-numeric.js";
export const EVIDENCE_REVIEW_SIMPLE_INTENTS = [
    "approve",
    "approve-with-edit",
    "reject",
    "insufficient-proof",
    "defer",
];
export const evidenceReviewSimpleIntentOptions = [
    {
        value: "approve",
        label: "Approve",
        description: "The claim is supported as written and safe for approved downstream use.",
    },
    {
        value: "approve-with-edit",
        label: "Edit and Approve",
        description: "Use narrower wording and retain an explicit qualifier.",
    },
    {
        value: "reject",
        label: "Reject",
        description: "The claim should not be eligible for downstream use.",
    },
    {
        value: "insufficient-proof",
        label: "Not Enough Evidence",
        description: "The available evidence cannot support a decision yet.",
    },
    {
        value: "defer",
        label: "Decide Later",
        description: "Keep the claim out of downstream use until a later review.",
    },
];
export const evidenceReviewRejectionReasons = [
    ["unsupported", "Unsupported by the evidence"],
    ["overstated", "Overstated"],
    ["incorrect", "Incorrect"],
    ["private-restricted", "Private or restricted"],
    ["wrong-scope", "Wrong scope"],
    ["duplicate", "Duplicate"],
    ["other", "Other"],
];
const WORK_CONTEXTS = new Set([
    "employment",
    "project",
    "education",
    "certification",
    "skill",
    "other",
    "ambiguous",
]);
const CLAIM_NATURES = new Set([
    "responsibility",
    "achievement",
    "capability",
    "credential",
    "other",
    "ambiguous",
]);
export function projectEvidenceReviewIntent(claim, fields) {
    const intent = simpleIntent(fields.intent);
    const publicSafety = derivePublicSafety(claim);
    const workContext = deriveWorkContext(claim, fields.workContext);
    const claimNature = deriveClaimNature(claim, fields.claimNature);
    const metricCandidate = isMetricCandidate(claim);
    const questions = [];
    const fieldErrors = {};
    const sourceWarnings = sourceWarningsFor(claim);
    if (!intent) {
        fieldErrors.intent = ["Choose one review decision."];
        return incompleteProjection("needs-input", claim, "Choose a decision", publicSafety.state, "indeterminate", false, false, metricCandidate ? "indeterminate" : "not-a-metric", [], sourceWarnings, fieldErrors, questions);
    }
    if (isApprovalIntent(intent) && publicSafety.state !== "public-safe") {
        fieldErrors.intent = [publicSafety.approvalMessage];
        return incompleteProjection("blocked", claim, intentLabel(intent), publicSafety.state, "not-resume-ready", false, false, metricCandidate ? "unverified" : "not-a-metric", [], [...sourceWarnings, publicSafety.approvalMessage], fieldErrors, questions);
    }
    if (intent === "approve" && claim.sourceUnsafeWording.length > 0) {
        const message = "Approve as written is unavailable because source metadata identifies wording that requires review. Use Edit and Approve or Advanced Review.";
        fieldErrors.intent = [message];
        return incompleteProjection("blocked", claim, intentLabel(intent), publicSafety.state, "not-resume-ready", false, false, metricCandidate ? "unverified" : "not-a-metric", [], [...sourceWarnings, message], fieldErrors, questions);
    }
    if (isApprovalIntent(intent) && workContext.value === "ambiguous") {
        questions.push("workContext");
        fieldErrors.workContext = ["Choose whether this is employment, project, education, certification, skill, or other work."];
    }
    if (isApprovalIntent(intent) && claimNature.value === "ambiguous") {
        questions.push("claimNature");
        fieldErrors.claimNature = ["Choose whether this is a responsibility, achievement, capability, credential, or other claim."];
    }
    const correctedClaim = optional(fields.correctedClaim);
    const requiredQualifiers = lines(fields.requiredQualifiers);
    if (intent === "approve-with-edit") {
        questions.push("correctedClaim", "requiredQualifiers");
        if (!correctedClaim) {
            fieldErrors.correctedClaim = ["Enter the narrower wording to approve."];
        }
        if (requiredQualifiers.length === 0) {
            fieldErrors.requiredQualifiers = ["Add at least one qualifier that must remain with the edited claim."];
        }
    }
    const rejectionReason = rejectionReasonValue(fields.rejectionReason);
    if (intent === "reject") {
        questions.push("rejectionReason");
        if (!rejectionReason) {
            fieldErrors.rejectionReason = ["Choose the main reason for rejecting this claim."];
        }
        if (rejectionReason === "other" && !optional(fields.reviewerNote)) {
            fieldErrors.reviewerNote = ["Add a short note explaining the other rejection reason."];
        }
    }
    const finalClaimWording = correctedClaim ?? claim.text;
    const metric = metricProjection(claim, fields, intent, finalClaimWording);
    questions.push(...metric.questions);
    mergeFieldErrors(fieldErrors, metric.fieldErrors);
    const canonical = canonicalStates(intent, rejectionReason, publicSafety.state);
    const warnings = sortedUnique([
        ...sourceWarnings,
        ...workContext.warnings,
        ...claimNature.warnings,
        ...metric.warnings,
    ]);
    const ambiguities = sortedUnique([
        ...(workContext.value === "ambiguous" ? ["Work context remains ambiguous."] : []),
        ...(claimNature.value === "ambiguous" ? ["Claim nature remains ambiguous."] : []),
    ]);
    const qualifiers = intent === "approve-with-edit" ? requiredQualifiers : [];
    const preview = {
        decision: canonical.decision,
        finalClaimWording,
        publicSafety: canonical.publicSafety,
        resumeReadiness: canonical.resumeReadiness,
        eligibleForRoleMatching: canonical.eligible,
        eligibleForJobMapping: canonical.eligible,
        metricState: metric.state,
        qualifiers,
        warnings,
    };
    if (Object.keys(fieldErrors).length > 0) {
        return {
            status: "needs-input",
            fieldErrors,
            questions: sortedUnique(questions),
            preview,
        };
    }
    const reviewerNote = optional(fields.reviewerNote);
    const input = {
        schemaVersion: 1,
        claimId: claim.id,
        reviewedClaimSha256: claim.template.reviewedClaimSha256,
        decision: canonical.decision,
        ...(intent === "approve-with-edit" && correctedClaim ? { correctedClaim } : {}),
        requiredQualifiers: qualifiers,
        factualSupport: canonical.factualSupport,
        scope: canonical.scope,
        publicSafety: canonical.publicSafety,
        resumeReadiness: canonical.resumeReadiness,
        eligibleForRoleMatching: canonical.eligible,
        eligibleForJobMapping: canonical.eligible,
        metricReview: {
            state: metric.state,
            ...(metric.exactText ? { exactText: metric.exactText } : {}),
            ...(metric.unit ? { unit: metric.unit } : {}),
            ...(metric.scope ? { scope: metric.scope } : {}),
            qualifiers: metric.qualifiers,
        },
        classification: {
            workContext: workContext.value,
            claimNature: claimNature.value,
        },
        risks: [],
        warnings,
        ambiguities,
        reviewerRationale: reviewRationale(intent, rejectionReason, reviewerNote),
    };
    return {
        status: "ready",
        input,
        fieldErrors: {},
        questions: sortedUnique(questions),
        preview,
    };
}
function canonicalStates(intent, rejectionReason, sourcePublicSafety) {
    if (intent === "approve") {
        return {
            decision: "approved",
            factualSupport: "supported",
            scope: "exact",
            publicSafety: "public-safe",
            resumeReadiness: "resume-ready",
            eligible: true,
        };
    }
    if (intent === "approve-with-edit") {
        return {
            decision: "approved-with-qualifier",
            factualSupport: "partially-supported",
            scope: "qualified",
            publicSafety: "public-safe",
            resumeReadiness: "resume-ready",
            eligible: true,
        };
    }
    if (intent === "reject") {
        const reasonStates = {
            unsupported: { factualSupport: "unsupported", scope: "ambiguous" },
            overstated: { factualSupport: "partially-supported", scope: "overstated" },
            incorrect: { factualSupport: "contradicted", scope: "invalid" },
            "private-restricted": { factualSupport: "supported", scope: "exact" },
            "wrong-scope": { factualSupport: "partially-supported", scope: "invalid" },
            duplicate: { factualSupport: "supported", scope: "exact" },
            other: { factualSupport: "indeterminate", scope: "ambiguous" },
        };
        const states = rejectionReason ? reasonStates[rejectionReason] : reasonStates.other;
        return {
            decision: "rejected",
            ...states,
            publicSafety: rejectionReason === "private-restricted"
                ? sourcePublicSafety === "public-safe" ? "restricted" : sourcePublicSafety
                : sourcePublicSafety,
            resumeReadiness: "not-resume-ready",
            eligible: false,
        };
    }
    if (intent === "insufficient-proof") {
        return {
            decision: "insufficient-proof",
            factualSupport: "indeterminate",
            scope: "ambiguous",
            publicSafety: sourcePublicSafety === "private" || sourcePublicSafety === "restricted"
                ? sourcePublicSafety
                : "indeterminate",
            resumeReadiness: "not-resume-ready",
            eligible: false,
        };
    }
    return {
        decision: "deferred",
        factualSupport: "indeterminate",
        scope: "ambiguous",
        publicSafety: sourcePublicSafety === "private" || sourcePublicSafety === "restricted"
            ? sourcePublicSafety
            : "indeterminate",
        resumeReadiness: "indeterminate",
        eligible: false,
    };
}
function metricProjection(claim, fields, intent, approvedWording) {
    if (!isMetricCandidate(claim)) {
        return {
            state: "not-a-metric",
            qualifiers: [],
            questions: [],
            fieldErrors: {},
            warnings: [],
        };
    }
    if (!isApprovalIntent(intent)) {
        return {
            state: intent === "reject" && fields.rejectionReason === "incorrect"
                ? "contradicted"
                : intent === "defer" ? "indeterminate" : "unverified",
            qualifiers: [],
            questions: [],
            fieldErrors: {},
            warnings: ["The potential metric was not verified by this decision."],
        };
    }
    const exactText = optional(fields.metricExactText);
    const unit = optional(fields.metricUnit);
    const scope = optional(fields.metricScope);
    const qualifiers = lines(fields.metricQualifiers);
    const confirmed = fields.metricSourceConfirmed === "true";
    const fieldErrors = {};
    if (!exactText)
        fieldErrors.metricExactText = ["Confirm the exact approved metric wording."];
    if (exactText && exactText !== approvedWording) {
        fieldErrors.metricExactText = ["Metric wording must exactly match the claim wording being approved."];
    }
    if (!unit)
        fieldErrors.metricUnit = ["Confirm the metric unit exactly as written."];
    if (!scope)
        fieldErrors.metricScope = ["Describe the exact scope of this metric."];
    if (!confirmed) {
        fieldErrors.metricSourceConfirmed = ["Confirm that the exact metric is directly supported by the displayed evidence."];
    }
    return {
        state: "verified",
        ...(exactText ? { exactText } : {}),
        ...(unit ? { unit } : {}),
        ...(scope ? { scope } : {}),
        qualifiers,
        questions: [
            "metricExactText",
            "metricUnit",
            "metricScope",
            "metricSourceConfirmed",
        ],
        fieldErrors,
        warnings: ["The exact metric wording, unit, scope, and source support require confirmation."],
    };
}
function derivePublicSafety(claim) {
    const visibilities = [
        ...claim.evidence.map(({ visibility }) => visibility),
        ...claim.evidence.flatMap(({ sources }) => sources.map(({ visibility }) => visibility)),
    ];
    const sensitivityFlags = claim.evidence.flatMap((evidence) => evidence.sensitivityFlags);
    if (visibilities.includes("do_not_use")) {
        return {
            state: "restricted",
            approvalMessage: "Simple approval is unavailable because the evidence is marked do-not-use.",
        };
    }
    if (visibilities.some((visibility) => visibility === "private" || visibility === "sensitive") ||
        sensitivityFlags.length > 0) {
        return {
            state: "private",
            approvalMessage: "Simple approval is unavailable because the evidence is private or sensitive.",
        };
    }
    const statuses = claim.evidence.flatMap(({ sources }) => sources.map(({ status }) => status));
    if (visibilities.length > 0 &&
        visibilities.every((visibility) => visibility === "public" || visibility === "generic_only") &&
        statuses.every((status) => status === "active")) {
        return {
            state: "public-safe",
            approvalMessage: "The displayed evidence permits public-safe review.",
        };
    }
    return {
        state: "indeterminate",
        approvalMessage: "Simple approval is unavailable because public safety is not unambiguous. Use another decision or Advanced Review.",
    };
}
function deriveWorkContext(claim, fallback) {
    const type = claim.sourceClassification.type;
    if (type === "education_claim")
        return { value: "education", warnings: [] };
    if (type === "certification_claim")
        return { value: "certification", warnings: [] };
    const categories = new Set(claim.evidence.map(({ category }) => category));
    const hasProject = Boolean(claim.sourceClassification.parentProjectId) ||
        claim.evidence.some(({ parentProjectId, category }) => Boolean(parentProjectId) || category === "project");
    const hasEmployment = Boolean(claim.sourceClassification.parentRoleId) ||
        claim.evidence.some(({ parentRoleId, category }) => Boolean(parentRoleId) || category === "role");
    if (hasProject && !hasEmployment)
        return { value: "project", warnings: [] };
    if (hasEmployment && !hasProject)
        return { value: "employment", warnings: [] };
    const section = claim.sourceClassification.section?.trim().toLocaleLowerCase("en-US");
    if (section === "summary" || section === "career through-line") {
        return { value: "other", warnings: [] };
    }
    if (categories.size > 0 && [...categories].every((category) => category === "skill" || category === "tool" || category === "domain")) {
        return { value: "skill", warnings: [] };
    }
    if (fallback && WORK_CONTEXTS.has(fallback) && fallback !== "ambiguous") {
        return {
            value: fallback,
            warnings: ["Work context was supplied by the reviewer because immutable metadata was ambiguous."],
        };
    }
    return { value: "ambiguous", warnings: [] };
}
function deriveClaimNature(claim, fallback) {
    if (claim.sourceClassification.type === "impact_claim" ||
        claim.evidence.some(({ category }) => category === "achievement")) {
        return { value: "achievement", warnings: [] };
    }
    if (claim.sourceClassification.type === "responsibility_claim") {
        return { value: "responsibility", warnings: [] };
    }
    if (claim.sourceClassification.type === "education_claim" ||
        claim.sourceClassification.type === "certification_claim") {
        return { value: "credential", warnings: [] };
    }
    if ([
        "role_claim",
        "skill_claim",
        "leadership_claim",
        "domain_claim",
        "project_claim",
        "competency_claim",
    ].includes(claim.sourceClassification.type)) {
        return { value: "capability", warnings: [] };
    }
    if (fallback && CLAIM_NATURES.has(fallback) && fallback !== "ambiguous") {
        return {
            value: fallback,
            warnings: ["Claim nature was supplied by the reviewer because immutable metadata was ambiguous."],
        };
    }
    return { value: "ambiguous", warnings: [] };
}
function sourceWarningsFor(claim) {
    return sortedUnique([
        ...(claim.sourceNeedsConfirmation
            ? ["Source metadata requires human confirmation before downstream use."]
            : []),
        ...(claim.sourceUnsafeWording.length > 0
            ? ["Source metadata identifies wording that requires caution."]
            : []),
    ]);
}
function reviewRationale(intent, rejectionReason, reviewerNote) {
    const rationale = intent === "approve"
        ? "The reviewer approved the displayed claim as supported within its recorded evidence and classification boundaries."
        : intent === "approve-with-edit"
            ? "The reviewer approved narrower wording with an explicit qualifier after reviewing the displayed evidence."
            : intent === "reject"
                ? `The reviewer rejected the claim because it was ${rejectionReasonLabel(rejectionReason).toLowerCase()}.`
                : intent === "insufficient-proof"
                    ? "The reviewer found that the displayed evidence was insufficient for downstream eligibility."
                    : "The reviewer deferred the decision; the claim remains ineligible for downstream use.";
    return reviewerNote ? `${rationale} Reviewer note: ${reviewerNote}` : rationale;
}
function incompleteProjection(status, claim, decision, publicSafety, resumeReadiness, eligibleForRoleMatching, eligibleForJobMapping, metricState, qualifiers, warnings, fieldErrors, questions) {
    return {
        status,
        fieldErrors,
        questions,
        preview: {
            decision,
            finalClaimWording: claim.text,
            publicSafety,
            resumeReadiness,
            eligibleForRoleMatching,
            eligibleForJobMapping,
            metricState,
            qualifiers,
            warnings,
        },
    };
}
function isMetricCandidate(claim) {
    return isEvidenceReviewMetricCandidate(claim.text, claim.sourceMetricStatus);
}
function isApprovalIntent(intent) {
    return intent === "approve" || intent === "approve-with-edit";
}
function simpleIntent(value) {
    return EVIDENCE_REVIEW_SIMPLE_INTENTS.includes(value)
        ? value
        : undefined;
}
function rejectionReasonValue(value) {
    return evidenceReviewRejectionReasons.some(([candidate]) => candidate === value)
        ? value
        : undefined;
}
function intentLabel(intent) {
    return evidenceReviewSimpleIntentOptions.find(({ value }) => value === intent)?.label ?? intent;
}
function rejectionReasonLabel(reason) {
    return evidenceReviewRejectionReasons.find(([value]) => value === reason)?.[1] ?? "another recorded reason";
}
function mergeFieldErrors(destination, source) {
    for (const [field, messages] of Object.entries(source)) {
        destination[field] = [...(destination[field] ?? []), ...messages];
    }
}
function lines(value) {
    return (value ?? "").split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean);
}
function optional(value) {
    const normalized = value?.trim();
    return normalized || undefined;
}
function sortedUnique(values) {
    return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
