import { z } from "zod";
import {
  EvidenceSourceProvenanceSchema,
  TargetAnalysisSourceReferenceSchema,
} from "./schemas.js";
import {
  EVIDENCE_SNAPSHOT_CONTRACT_NAME,
  EVIDENCE_SNAPSHOT_POLICY_NAME,
  EVIDENCE_SNAPSHOT_POLICY_VERSION,
  EVIDENCE_SNAPSHOT_SCHEMA_VERSION,
  EvidenceSnapshotIdSchema,
} from "./evidence-snapshot-schemas.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const TargetIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const RelativeWorkspacePathSchema = z.string().min(1).refine(
  (value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value),
  "Path must be relative to the workspace",
);

export const JobEvidenceRelationshipSchema = z.enum([
  "direct",
  "supporting",
  "partial",
]);

export const JobEvidenceStrengthSchema = z.enum(["strong", "medium", "weak"]);
export const JobEvidenceLinkConfidenceSchema = z.enum(["high", "medium", "low"]);
export const JobRequirementInputTypeSchema = z.enum(["deterministic", "approved"]);

export const JobEvidenceMapDependencySchema = z.object({
  path: RelativeWorkspacePathSchema,
  sha256: Sha256Schema,
}).strict();

export const JobRequirementLinkProvenanceSchema = z.object({
  requirementModelType: JobRequirementInputTypeSchema,
  requirementModelPath: RelativeWorkspacePathSchema,
  requirementModelSha256: Sha256Schema,
  requirementId: z.string().min(1),
  sourceTextSha256: Sha256Schema,
  sourceReferences: z.array(TargetAnalysisSourceReferenceSchema).min(1),
}).strict();

export const JobCandidateEvidenceProvenanceSchema = z.object({
  evidenceId: z.string().min(1),
  evidenceItemPath: RelativeWorkspacePathSchema,
  evidenceItemSha256: Sha256Schema,
  claimId: z.string().min(1),
  claimPath: RelativeWorkspacePathSchema,
  claimSha256: Sha256Schema,
  sources: z.array(EvidenceSourceProvenanceSchema).min(1),
}).strict();

export const JobEvidenceMatchedSignalSchema = z.object({
  type: z.enum(["exact-phrase", "technology", "domain", "keyword"]),
  value: z.string().trim().min(1),
}).strict();

export const JobEvidenceLinkSchema = z.object({
  id: z.string().min(1),
  requirementId: z.string().min(1),
  evidenceId: z.string().min(1),
  claimId: z.string().min(1),
  relationship: JobEvidenceRelationshipSchema,
  evidenceStrength: JobEvidenceStrengthSchema,
  linkConfidence: JobEvidenceLinkConfidenceSchema,
  matchedSignals: z.array(JobEvidenceMatchedSignalSchema).min(1),
  requirementProvenance: JobRequirementLinkProvenanceSchema,
  evidenceProvenance: JobCandidateEvidenceProvenanceSchema,
}).strict();

export const JobRequirementEvidenceMappingSchema = z.object({
  id: z.string().min(1),
  requirementId: z.string().min(1),
  status: z.enum(["supported", "unsupported"]),
  linkIds: z.array(z.string().min(1)),
  requirementProvenance: JobRequirementLinkProvenanceSchema,
}).strict().superRefine((value, context) => {
  if (value.status === "supported" && value.linkIds.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Supported requirements must reference at least one evidence link",
      path: ["linkIds"],
    });
  }
  if (value.status === "unsupported" && value.linkIds.length > 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Unsupported requirements cannot reference evidence links",
      path: ["linkIds"],
    });
  }
});

export const JobEvidenceMapWarningSchema = z.object({
  id: z.string().min(1),
  code: z.enum(["NO_ELIGIBLE_EVIDENCE", "REQUIREMENT_UNSUPPORTED"]),
  message: z.string().min(1),
  requirementId: z.string().min(1).optional(),
}).strict();

export const JobEvidenceMapCompletenessSchema = z.object({
  status: z.enum(["empty", "complete"]),
  requirementCount: z.number().int().nonnegative(),
  processedRequirementCount: z.number().int().nonnegative(),
  supportedRequirementCount: z.number().int().nonnegative(),
  unsupportedRequirementCount: z.number().int().nonnegative(),
  linkCount: z.number().int().nonnegative(),
  readyForDownstreamAssessment: z.boolean(),
  blockingReasons: z.array(z.string().min(1)),
}).strict().superRefine((value, context) => {
  if (value.processedRequirementCount !== value.requirementCount) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Every requirement must be processed",
      path: ["processedRequirementCount"],
    });
  }
  if (
    value.supportedRequirementCount + value.unsupportedRequirementCount !==
    value.requirementCount
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Supported and unsupported counts must cover every requirement",
      path: ["supportedRequirementCount"],
    });
  }
  if (value.readyForDownstreamAssessment && value.status !== "complete") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Only a complete map can be ready for downstream assessment",
      path: ["readyForDownstreamAssessment"],
    });
  }
});

const JobEvidenceMapInputSchema = z.object({
  target: JobEvidenceMapDependencySchema,
  jobDescription: JobEvidenceMapDependencySchema,
  requirementModelType: JobRequirementInputTypeSchema,
  requirementModel: JobEvidenceMapDependencySchema,
  requirementManifest: JobEvidenceMapDependencySchema,
  evidencePin: JobEvidenceMapDependencySchema.optional(),
  evidencePinManifest: JobEvidenceMapDependencySchema.optional(),
  evidenceSnapshot: JobEvidenceMapDependencySchema.optional(),
  evidenceSnapshotManifest: JobEvidenceMapDependencySchema.optional(),
  evidenceSnapshotId: EvidenceSnapshotIdSchema.optional(),
  evidenceSnapshotSchemaVersion: z.literal(
    EVIDENCE_SNAPSHOT_SCHEMA_VERSION,
  ).optional(),
  evidenceSnapshotContractName: z.literal(
    EVIDENCE_SNAPSHOT_CONTRACT_NAME,
  ).optional(),
  evidenceSnapshotPolicyName: z.literal(
    EVIDENCE_SNAPSHOT_POLICY_NAME,
  ).optional(),
  evidenceSnapshotPolicyVersion: z.literal(
    EVIDENCE_SNAPSHOT_POLICY_VERSION,
  ).optional(),
  sources: JobEvidenceMapDependencySchema,
  evidenceItems: JobEvidenceMapDependencySchema,
  claims: JobEvidenceMapDependencySchema,
  eligibleEvidenceSetSha256: Sha256Schema,
  normalizedInputSha256: Sha256Schema,
}).strict().superRefine((value, context) => {
  const snapshotFields = [
    value.evidencePin,
    value.evidencePinManifest,
    value.evidenceSnapshot,
    value.evidenceSnapshotManifest,
    value.evidenceSnapshotId,
    value.evidenceSnapshotSchemaVersion,
    value.evidenceSnapshotContractName,
    value.evidenceSnapshotPolicyName,
    value.evidenceSnapshotPolicyVersion,
  ];
  const hasSnapshotInput = snapshotFields.every((entry) => entry !== undefined);
  const hasAnySnapshotInput = snapshotFields.some(
    (entry) => entry !== undefined,
  );
  if (hasAnySnapshotInput && !hasSnapshotInput) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Pinned Evidence Snapshot dependency fields must be complete when present.",
    });
  }
});

export const JobEvidenceMapSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  policy: z.object({
    name: z.string().min(1),
    version: z.string().min(1),
    mode: z.literal("deterministic"),
  }).strict(),
  input: JobEvidenceMapInputSchema,
  links: z.array(JobEvidenceLinkSchema),
  requirementMappings: z.array(JobRequirementEvidenceMappingSchema),
  warnings: z.array(JobEvidenceMapWarningSchema),
  completeness: JobEvidenceMapCompletenessSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const JobEvidenceMapManifestSchema = z.object({
  schemaVersion: z.literal(1),
  mapId: z.string().min(1),
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  mapPath: RelativeWorkspacePathSchema,
  mapSha256: Sha256Schema,
  mapperName: z.string().min(1),
  mapperVersion: z.string().min(1),
  policyName: z.string().min(1),
  policyVersion: z.string().min(1),
  targetSha256: Sha256Schema,
  sourceSha256: Sha256Schema,
  requirementModelType: JobRequirementInputTypeSchema,
  requirementModelSha256: Sha256Schema,
  requirementManifestSha256: Sha256Schema,
  evidencePinSha256: Sha256Schema.optional(),
  evidencePinManifestSha256: Sha256Schema.optional(),
  evidenceSnapshotId: EvidenceSnapshotIdSchema.optional(),
  evidenceSnapshotSha256: Sha256Schema.optional(),
  evidenceSnapshotManifestSha256: Sha256Schema.optional(),
  evidenceSnapshotSchemaVersion: z.literal(
    EVIDENCE_SNAPSHOT_SCHEMA_VERSION,
  ).optional(),
  evidenceSnapshotContractName: z.literal(
    EVIDENCE_SNAPSHOT_CONTRACT_NAME,
  ).optional(),
  evidenceSnapshotPolicyName: z.literal(
    EVIDENCE_SNAPSHOT_POLICY_NAME,
  ).optional(),
  evidenceSnapshotPolicyVersion: z.literal(
    EVIDENCE_SNAPSHOT_POLICY_VERSION,
  ).optional(),
  sourcesSha256: Sha256Schema,
  evidenceItemsSha256: Sha256Schema,
  claimsSha256: Sha256Schema,
  eligibleEvidenceSetSha256: Sha256Schema,
  normalizedInputSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict().superRefine((value, context) => {
  const snapshotFields = [
    value.evidencePinSha256,
    value.evidencePinManifestSha256,
    value.evidenceSnapshotId,
    value.evidenceSnapshotSha256,
    value.evidenceSnapshotManifestSha256,
    value.evidenceSnapshotSchemaVersion,
    value.evidenceSnapshotContractName,
    value.evidenceSnapshotPolicyName,
    value.evidenceSnapshotPolicyVersion,
  ];
  const hasSnapshotInput = snapshotFields.every((entry) => entry !== undefined);
  const hasAnySnapshotInput = snapshotFields.some(
    (entry) => entry !== undefined,
  );
  if (hasAnySnapshotInput && !hasSnapshotInput) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Pinned Evidence Snapshot manifest fields must be complete when present.",
    });
  }
});

export type JobEvidenceRelationship = z.infer<typeof JobEvidenceRelationshipSchema>;
export type JobEvidenceStrength = z.infer<typeof JobEvidenceStrengthSchema>;
export type JobEvidenceLinkConfidence = z.infer<typeof JobEvidenceLinkConfidenceSchema>;
export type JobRequirementInputType = z.infer<typeof JobRequirementInputTypeSchema>;
export type JobEvidenceLink = z.infer<typeof JobEvidenceLinkSchema>;
export type JobEvidenceMap = z.infer<typeof JobEvidenceMapSchema>;
export type JobEvidenceMapManifest = z.infer<typeof JobEvidenceMapManifestSchema>;
