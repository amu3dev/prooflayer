import { z } from "zod";
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const RelativePathSchema = z.string().min(1).refine((value) => !value.startsWith("/") &&
    !/^[A-Za-z]:[\\/]/.test(value) &&
    !value.split(/[\\/]/).includes(".."), "Path must be a safe workspace-relative path");
export const EVIDENCE_REVIEW_BATCH_SCHEMA_VERSION = 1;
export const EVIDENCE_REVIEW_BATCH_POLICY_NAME = "evidence-review-batch-policy";
export const EVIDENCE_REVIEW_BATCH_POLICY_VERSION = "1";
export const EvidenceReviewBatchPrioritySchema = z.enum(["high", "medium", "low"]);
export const EvidenceReviewBatchClaimSchema = z.object({
    claimId: z.string().min(1),
    claimSha256: Sha256Schema,
    evidenceItemIds: z.array(z.string().min(1)).min(1),
    priority: EvidenceReviewBatchPrioritySchema,
    priorityBasis: z.array(z.enum([
        "mandatory-requirement-terminology",
        "preferred-requirement-terminology",
        "contextual-requirement-terminology",
        "named-technology-or-domain",
        "reviewed-category",
        "potential-metric",
        "no-explicit-overlap",
    ])).min(1),
    matchingRequirementIds: z.array(z.string().min(1)),
    matchingTerms: z.array(z.string().min(1)),
    potentialMetric: z.boolean(),
    selectedForControlledReview: z.boolean(),
    reviewInputTemplatePath: RelativePathSchema.optional(),
}).strict();
export const EvidenceReviewBatchSchema = z.object({
    schemaVersion: z.literal(EVIDENCE_REVIEW_BATCH_SCHEMA_VERSION),
    id: z.string().regex(/^evidence-review-batch_[a-f0-9]{20}$/),
    targetId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    targetType: z.literal("job"),
    purpose: z.literal("human-review-work-organization"),
    policy: z.object({
        name: z.literal(EVIDENCE_REVIEW_BATCH_POLICY_NAME),
        version: z.literal(EVIDENCE_REVIEW_BATCH_POLICY_VERSION),
        mode: z.literal("deterministic"),
    }).strict(),
    input: z.object({
        targetPath: RelativePathSchema,
        targetSha256: Sha256Schema,
        requirementModelPath: RelativePathSchema,
        requirementModelSha256: Sha256Schema,
        requirementManifestPath: RelativePathSchema,
        requirementManifestSha256: Sha256Schema,
        claimsPath: RelativePathSchema,
        claimsSha256: Sha256Schema,
        evidencePath: RelativePathSchema,
        evidenceSha256: Sha256Schema,
        normalizedInputSha256: Sha256Schema,
    }).strict(),
    claims: z.array(EvidenceReviewBatchClaimSchema),
    controlledReviewSubsetClaimIds: z.array(z.string().min(1)),
    priorityCounts: z.object({
        high: z.number().int().nonnegative(),
        medium: z.number().int().nonnegative(),
        low: z.number().int().nonnegative(),
    }).strict(),
    candidateClaimCount: z.number().int().nonnegative(),
    warning: z.literal("Batch priority organizes human review only; it does not establish factual support, approval, eligibility, or fit."),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const EvidenceReviewInputTemplateSchema = z.object({
    schemaVersion: z.literal(1),
    templateForClaimId: z.string().min(1),
    reviewedClaimSha256: Sha256Schema,
    instructions: z.array(z.string().min(1)).min(1),
    reviewInput: z.object({
        schemaVersion: z.literal(1),
        claimId: z.string().min(1),
        reviewedClaimSha256: Sha256Schema,
        decision: z.null(),
        correctedClaim: z.null(),
        requiredQualifiers: z.array(z.never()),
        factualSupport: z.null(),
        scope: z.null(),
        publicSafety: z.null(),
        resumeReadiness: z.null(),
        eligibleForRoleMatching: z.null(),
        eligibleForJobMapping: z.null(),
        metricReview: z.object({
            state: z.null(),
            exactText: z.null(),
            unit: z.null(),
            scope: z.null(),
            qualifiers: z.array(z.never()),
        }).strict(),
        classification: z.object({
            workContext: z.null(),
            claimNature: z.null(),
        }).strict(),
        risks: z.array(z.never()),
        warnings: z.array(z.never()),
        ambiguities: z.array(z.never()),
        reviewerRationale: z.null(),
    }).strict(),
}).strict();
export const EvidenceReviewBatchManifestSchema = z.object({
    schemaVersion: z.literal(EVIDENCE_REVIEW_BATCH_SCHEMA_VERSION),
    batchId: z.string().regex(/^evidence-review-batch_[a-f0-9]{20}$/),
    targetId: z.string().min(1),
    batchPath: RelativePathSchema,
    batchSha256: Sha256Schema,
    policyName: z.literal(EVIDENCE_REVIEW_BATCH_POLICY_NAME),
    policyVersion: z.literal(EVIDENCE_REVIEW_BATCH_POLICY_VERSION),
    normalizedInputSha256: Sha256Schema,
    targetSha256: Sha256Schema,
    requirementModelSha256: Sha256Schema,
    requirementManifestSha256: Sha256Schema,
    claimsSha256: Sha256Schema,
    evidenceSha256: Sha256Schema,
    templateFiles: z.array(z.object({
        path: RelativePathSchema,
        sha256: Sha256Schema,
    }).strict()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
