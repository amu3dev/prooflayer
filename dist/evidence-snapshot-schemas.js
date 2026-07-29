import { z } from "zod";
import { ApprovalStatusSchema, ClaimSchema, ConfidenceSchema, EvidenceItemSchema, OutputReadinessSchema, VisibilitySchema, } from "./schemas.js";
export const EVIDENCE_SNAPSHOT_SCHEMA_VERSION = 1;
export const EVIDENCE_SNAPSHOT_CONTRACT_NAME = "evidence-snapshot";
export const EVIDENCE_SNAPSHOT_POLICY_NAME = "evidence-snapshot-policy";
export const EVIDENCE_SNAPSHOT_POLICY_VERSION = "1";
export const EVIDENCE_SNAPSHOT_EXPORTER_NAME = "evidence-snapshot-exporter";
export const EVIDENCE_SNAPSHOT_EXPORTER_VERSION = "1";
export const EvidenceSnapshotSha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
export const EvidenceSnapshotIdSchema = z.string().regex(/^evidence-snapshot-[a-f0-9]{20}$/);
export const EvidenceSnapshotRelativePathSchema = z.string().min(1).refine((value) => !value.startsWith("/") &&
    !/^[A-Za-z]:[\\/]/.test(value) &&
    !value.split(/[\\/]/).includes(".."), "Path must be a safe relative path");
export const EvidenceSnapshotEligibilityReasonSchema = z.enum([
    "claim-not-approved",
    "claim-not-resume-ready",
    "claim-not-public-safe",
    "claim-needs-confirmation",
    "evidence-not-public",
    "evidence-sensitive",
    "source-missing",
    "source-inactive",
    "source-not-public",
    "job-description-source",
    "no-eligible-claim",
    "no-eligible-evidence",
]);
export const EvidenceSnapshotEligibilitySchema = z.object({
    roleMatching: z.boolean(),
    jobMapping: z.boolean(),
    reasons: z.array(EvidenceSnapshotEligibilityReasonSchema),
}).strict();
export const EvidenceSnapshotSourceReferenceSchema = z.object({
    sourceId: z.string().min(1),
    sourceType: z.string().min(1),
    logicalPath: EvidenceSnapshotRelativePathSchema,
    sha256: EvidenceSnapshotSha256Schema,
    status: z.enum(["active", "ignored", "needs_review"]),
    visibility: VisibilitySchema,
}).strict();
export const EvidenceSnapshotEvidenceRecordSchema = z.object({
    id: z.string().min(1),
    contentSha256: EvidenceSnapshotSha256Schema,
    category: EvidenceItemSchema.shape.category,
    sourceIds: z.array(z.string().min(1)),
    visibility: VisibilitySchema,
    sensitivityFlags: z.array(z.string()),
    confidence: ConfidenceSchema,
    supportingClaimIds: z.array(z.string().min(1)),
    eligibility: EvidenceSnapshotEligibilitySchema,
    sources: z.array(EvidenceSnapshotSourceReferenceSchema),
    content: EvidenceItemSchema.optional(),
}).strict();
export const EvidenceSnapshotClaimRecordSchema = z.object({
    id: z.string().min(1),
    contentSha256: EvidenceSnapshotSha256Schema,
    supportingEvidenceIds: z.array(z.string().min(1)),
    approvalStatus: ApprovalStatusSchema,
    outputReadiness: OutputReadinessSchema,
    publicSafe: z.boolean(),
    needsConfirmation: z.boolean(),
    metricStatus: ClaimSchema.shape.metricStatus,
    factualConfidence: ConfidenceSchema,
    eligibility: EvidenceSnapshotEligibilitySchema,
    content: ClaimSchema.optional(),
}).strict();
export const EvidenceSnapshotVerifiedMetricSchema = z.object({
    id: z.string().min(1),
    claimId: z.string().min(1),
    evidenceIds: z.array(z.string().min(1)).min(1),
    exactText: z.string().min(1),
    textSha256: EvidenceSnapshotSha256Schema,
    scope: z.object({
        parentRoleId: z.string().min(1).optional(),
        parentProjectId: z.string().min(1).optional(),
        dateRange: z.string().min(1).optional(),
    }).strict(),
}).strict();
export const EvidenceSnapshotWarningSchema = z.object({
    id: z.string().min(1),
    code: z.enum([
        "ZERO_ELIGIBLE_JOB_EVIDENCE",
        "ZERO_ELIGIBLE_ROLE_EVIDENCE",
        "INELIGIBLE_CONTENT_REDACTED",
        "VERIFIED_METRIC_CONTENT_REDACTED",
    ]),
    message: z.string().min(1),
    recordIds: z.array(z.string().min(1)),
}).strict();
export const EvidenceSnapshotSourceArtifactSchema = z.object({
    id: z.enum(["sources", "evidence-items", "claims"]),
    path: EvidenceSnapshotRelativePathSchema,
    sha256: EvidenceSnapshotSha256Schema,
}).strict();
export const EvidenceFoundationSnapshotSchema = z.object({
    schemaVersion: z.literal(EVIDENCE_SNAPSHOT_SCHEMA_VERSION),
    id: EvidenceSnapshotIdSchema,
    contract: z.object({
        name: z.literal(EVIDENCE_SNAPSHOT_CONTRACT_NAME),
        version: z.literal("1"),
    }).strict(),
    policy: z.object({
        name: z.literal(EVIDENCE_SNAPSHOT_POLICY_NAME),
        version: z.literal(EVIDENCE_SNAPSHOT_POLICY_VERSION),
    }).strict(),
    producer: z.object({
        name: z.literal(EVIDENCE_SNAPSHOT_EXPORTER_NAME),
        version: z.literal(EVIDENCE_SNAPSHOT_EXPORTER_VERSION),
        mode: z.literal("deterministic"),
    }).strict(),
    sourceFoundation: z.object({
        id: z.literal("prooflayer-reviewed-evidence-foundation"),
        inventorySha256: EvidenceSnapshotSha256Schema,
        artifacts: z.array(EvidenceSnapshotSourceArtifactSchema).length(3),
    }).strict(),
    evidenceItems: z.array(EvidenceSnapshotEvidenceRecordSchema),
    claims: z.array(EvidenceSnapshotClaimRecordSchema),
    verifiedMetrics: z.array(EvidenceSnapshotVerifiedMetricSchema),
    eligibleRoleEvidenceIds: z.array(z.string().min(1)),
    eligibleJobEvidenceIds: z.array(z.string().min(1)),
    eligibleRoleClaimIds: z.array(z.string().min(1)),
    eligibleJobClaimIds: z.array(z.string().min(1)),
    eligibleRoleEvidenceSetSha256: EvidenceSnapshotSha256Schema,
    eligibleJobEvidenceSetSha256: EvidenceSnapshotSha256Schema,
    completeness: z.object({
        status: z.literal("complete"),
        sourceArtifactCount: z.number().int().nonnegative(),
        evidenceItemCount: z.number().int().nonnegative(),
        claimCount: z.number().int().nonnegative(),
        approvedClaimCount: z.number().int().nonnegative(),
        eligibleRoleEvidenceCount: z.number().int().nonnegative(),
        eligibleJobEvidenceCount: z.number().int().nonnegative(),
        verifiedMetricCount: z.number().int().nonnegative(),
        provenanceComplete: z.boolean(),
        eligibilityPreserved: z.boolean(),
    }).strict(),
    warnings: z.array(EvidenceSnapshotWarningSchema),
}).strict();
export const EvidenceSnapshotManifestSchemaV1 = z.object({
    schemaVersion: z.literal(EVIDENCE_SNAPSHOT_SCHEMA_VERSION),
    snapshotId: EvidenceSnapshotIdSchema,
    snapshotPath: EvidenceSnapshotRelativePathSchema,
    contentSha256: EvidenceSnapshotSha256Schema,
    contractName: z.literal(EVIDENCE_SNAPSHOT_CONTRACT_NAME),
    contractVersion: z.literal("1"),
    policyName: z.literal(EVIDENCE_SNAPSHOT_POLICY_NAME),
    policyVersion: z.literal(EVIDENCE_SNAPSHOT_POLICY_VERSION),
    producerName: z.literal(EVIDENCE_SNAPSHOT_EXPORTER_NAME),
    producerVersion: z.literal(EVIDENCE_SNAPSHOT_EXPORTER_VERSION),
    sourceInventorySha256: EvidenceSnapshotSha256Schema,
    sourceArtifactCount: z.number().int().nonnegative(),
    evidenceItemCount: z.number().int().nonnegative(),
    claimCount: z.number().int().nonnegative(),
    approvedClaimCount: z.number().int().nonnegative(),
    eligibleRoleEvidenceCount: z.number().int().nonnegative(),
    eligibleJobEvidenceCount: z.number().int().nonnegative(),
    verifiedMetricCount: z.number().int().nonnegative(),
    files: z.array(z.object({
        path: EvidenceSnapshotRelativePathSchema,
        sha256: EvidenceSnapshotSha256Schema,
    }).strict()).min(1),
    completeness: z.literal("complete"),
    validationResult: z.literal("valid"),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
