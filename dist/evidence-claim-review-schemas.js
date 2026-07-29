import { z } from "zod";
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const RelativePathSchema = z.string().min(1).refine((value) => !value.startsWith("/") &&
    !/^[A-Za-z]:[\\/]/.test(value) &&
    !value.split(/[\\/]/).includes(".."), "Path must be a safe workspace-relative path");
export const EVIDENCE_CLAIM_REVIEW_SCHEMA_VERSION = 1;
export const EVIDENCE_CLAIM_REVIEW_POLICY_NAME = "evidence-claim-review-policy";
export const EVIDENCE_CLAIM_REVIEW_POLICY_VERSION = "1";
export const EvidenceClaimReviewDecisionSchema = z.enum([
    "approved",
    "approved-with-qualifier",
    "needs-edit",
    "rejected",
    "insufficient-proof",
    "deferred",
]);
export const EvidenceClaimFactualSupportSchema = z.enum([
    "supported",
    "partially-supported",
    "unsupported",
    "contradicted",
    "indeterminate",
]);
export const EvidenceClaimScopeStateSchema = z.enum([
    "exact",
    "qualified",
    "overstated",
    "underspecified",
    "ambiguous",
    "invalid",
]);
export const EvidenceClaimPublicSafetySchema = z.enum([
    "public-safe",
    "private",
    "restricted",
    "indeterminate",
]);
export const EvidenceClaimResumeReadinessSchema = z.enum([
    "resume-ready",
    "not-resume-ready",
    "needs-edit",
    "indeterminate",
]);
export const EvidenceClaimMetricReviewStateSchema = z.enum([
    "verified",
    "unverified",
    "contradicted",
    "not-a-metric",
    "indeterminate",
]);
export const EvidenceClaimWorkContextSchema = z.enum([
    "employment",
    "project",
    "education",
    "certification",
    "skill",
    "other",
    "ambiguous",
]);
export const EvidenceClaimNatureSchema = z.enum([
    "responsibility",
    "achievement",
    "capability",
    "credential",
    "other",
    "ambiguous",
]);
export const EvidenceClaimReviewRiskInputSchema = z.object({
    code: z.string().trim().min(1),
    severity: z.enum(["critical", "high", "medium", "low"]),
    message: z.string().trim().min(1),
}).strict();
export const EvidenceClaimReviewInputSchema = z.object({
    schemaVersion: z.literal(EVIDENCE_CLAIM_REVIEW_SCHEMA_VERSION),
    claimId: z.string().trim().min(1),
    reviewedClaimSha256: Sha256Schema,
    decision: EvidenceClaimReviewDecisionSchema,
    correctedClaim: z.string().trim().min(1).optional(),
    requiredQualifiers: z.array(z.string().trim().min(1)).default([]),
    factualSupport: EvidenceClaimFactualSupportSchema,
    scope: EvidenceClaimScopeStateSchema,
    publicSafety: EvidenceClaimPublicSafetySchema,
    resumeReadiness: EvidenceClaimResumeReadinessSchema,
    eligibleForRoleMatching: z.boolean(),
    eligibleForJobMapping: z.boolean(),
    metricReview: z.object({
        state: EvidenceClaimMetricReviewStateSchema,
        exactText: z.string().min(1).optional(),
        unit: z.string().trim().min(1).optional(),
        scope: z.string().trim().min(1).optional(),
        qualifiers: z.array(z.string().trim().min(1)).default([]),
    }).strict(),
    classification: z.object({
        workContext: EvidenceClaimWorkContextSchema,
        claimNature: EvidenceClaimNatureSchema,
    }).strict(),
    risks: z.array(EvidenceClaimReviewRiskInputSchema).default([]),
    warnings: z.array(z.string().trim().min(1)).default([]),
    ambiguities: z.array(z.string().trim().min(1)).default([]),
    reviewerRationale: z.string().trim().min(1),
    supersedesReviewId: z.string().regex(/^evidence-claim-review_[a-f0-9]{20}$/).optional(),
}).strict();
export const EvidenceClaimReviewSourceReferenceSchema = z.object({
    sourceId: z.string().min(1),
    sourceType: z.string().min(1),
    logicalPath: RelativePathSchema,
    sha256: Sha256Schema,
    visibility: z.string().min(1),
    status: z.string().min(1),
}).strict();
export const EvidenceClaimReviewEvidenceReferenceSchema = z.object({
    evidenceItemId: z.string().min(1),
    evidenceItemSha256: Sha256Schema,
    category: z.string().min(1),
    parentRoleId: z.string().min(1).optional(),
    parentProjectId: z.string().min(1).optional(),
    sourceReferences: z.array(EvidenceClaimReviewSourceReferenceSchema).min(1),
}).strict();
export const EvidenceClaimReviewRiskSchema = EvidenceClaimReviewRiskInputSchema.extend({
    id: z.string().regex(/^evidence-review-risk_[a-f0-9]{16}$/),
}).strict();
export const EvidenceClaimReviewProjectionSchema = z.object({
    id: z.string().regex(/^approved-claim-projection_[a-f0-9]{20}$/),
    claimId: z.string().min(1),
    text: z.string().min(1),
    textSha256: Sha256Schema,
    requiredQualifiers: z.array(z.string().min(1)),
}).strict();
export const EvidenceClaimReviewSchema = z.object({
    schemaVersion: z.literal(EVIDENCE_CLAIM_REVIEW_SCHEMA_VERSION),
    id: z.string().regex(/^evidence-claim-review_[a-f0-9]{20}$/),
    policy: z.object({
        name: z.literal(EVIDENCE_CLAIM_REVIEW_POLICY_NAME),
        version: z.literal(EVIDENCE_CLAIM_REVIEW_POLICY_VERSION),
        mode: z.literal("human-controlled"),
    }).strict(),
    claimId: z.string().min(1),
    primaryEvidenceItemId: z.string().min(1),
    evidenceItemIds: z.array(z.string().min(1)).min(1),
    reviewedClaimText: z.string().min(1),
    reviewedClaimSha256: Sha256Schema,
    claimRecordSha256: Sha256Schema,
    evidenceInventorySha256: Sha256Schema,
    provenanceInventorySha256: Sha256Schema,
    evidenceReferences: z.array(EvidenceClaimReviewEvidenceReferenceSchema).min(1),
    decision: EvidenceClaimReviewDecisionSchema,
    approvedProjection: EvidenceClaimReviewProjectionSchema.optional(),
    requiredQualifiers: z.array(z.string().min(1)),
    factualSupport: EvidenceClaimFactualSupportSchema,
    scope: EvidenceClaimScopeStateSchema,
    publicSafety: EvidenceClaimPublicSafetySchema,
    resumeReadiness: EvidenceClaimResumeReadinessSchema,
    eligibleForRoleMatching: z.boolean(),
    eligibleForJobMapping: z.boolean(),
    metricReview: z.object({
        state: EvidenceClaimMetricReviewStateSchema,
        exactText: z.string().min(1).optional(),
        exactTextSha256: Sha256Schema.optional(),
        unit: z.string().min(1).optional(),
        scope: z.string().min(1).optional(),
        qualifiers: z.array(z.string().min(1)),
    }).strict(),
    classification: z.object({
        workContext: EvidenceClaimWorkContextSchema,
        claimNature: EvidenceClaimNatureSchema,
    }).strict(),
    risks: z.array(EvidenceClaimReviewRiskSchema),
    warnings: z.array(z.string().min(1)),
    ambiguities: z.array(z.string().min(1)),
    reviewerRationale: z.string().min(1),
    supersedesReviewId: z.string().regex(/^evidence-claim-review_[a-f0-9]{20}$/).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const EvidenceClaimReviewManifestSchema = z.object({
    schemaVersion: z.literal(EVIDENCE_CLAIM_REVIEW_SCHEMA_VERSION),
    reviewId: z.string().regex(/^evidence-claim-review_[a-f0-9]{20}$/),
    claimId: z.string().min(1),
    reviewPath: RelativePathSchema,
    reviewSha256: Sha256Schema,
    policyName: z.literal(EVIDENCE_CLAIM_REVIEW_POLICY_NAME),
    policyVersion: z.literal(EVIDENCE_CLAIM_REVIEW_POLICY_VERSION),
    claimRecordSha256: Sha256Schema,
    evidenceInventorySha256: Sha256Schema,
    provenanceInventorySha256: Sha256Schema,
    supersedesReviewId: z.string().regex(/^evidence-claim-review_[a-f0-9]{20}$/).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const EvidenceClaimReviewSnapshotProjectionSchema = z.object({
    reviewId: z.string().regex(/^evidence-claim-review_[a-f0-9]{20}$/),
    reviewSha256: Sha256Schema,
    decision: EvidenceClaimReviewDecisionSchema,
    approvedProjectionId: z.string().regex(/^approved-claim-projection_[a-f0-9]{20}$/).optional(),
    approvedTextSha256: Sha256Schema.optional(),
    publicSafety: EvidenceClaimPublicSafetySchema,
    resumeReadiness: EvidenceClaimResumeReadinessSchema,
    eligibleForRoleMatching: z.boolean(),
    eligibleForJobMapping: z.boolean(),
    metricState: EvidenceClaimMetricReviewStateSchema,
    requiredQualifiers: z.array(z.string().min(1)),
    workContext: EvidenceClaimWorkContextSchema,
    claimNature: EvidenceClaimNatureSchema,
}).strict();
