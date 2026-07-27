import { z } from "zod";
import {
  JobEvidenceLinkConfidenceSchema,
  JobEvidenceStrengthSchema,
  JobRequirementInputTypeSchema,
  JobRequirementLinkProvenanceSchema,
} from "./job-evidence-map-schemas.js";
import {
  JobRequirementCategorySchema,
  JobRequirementNecessitySchema,
} from "./job-requirement-schemas.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const TargetIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const RelativeWorkspacePathSchema = z.string().min(1).refine(
  (value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value),
  "Path must be relative to the workspace",
);

export const JobRequirementCoverageStateSchema = z.enum([
  "supported",
  "partially-supported",
  "unsupported",
  "contradicted",
  "indeterminate",
]);

export const JobRequirementEvidenceQualitySchema = z.enum([
  "strong",
  "adequate",
  "limited",
  "mixed",
  "unavailable",
]);

export const JobCoverageDependencySchema = z.object({
  path: RelativeWorkspacePathSchema,
  sha256: Sha256Schema,
}).strict();

export const JobCoverageComponentSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1),
  normalizedLabel: z.string().trim().min(1),
  status: z.enum(["supported", "unsupported", "indeterminate"]),
  mappedLinkIds: z.array(z.string().min(1)),
}).strict();

export const JobCoverageEvidenceLinkReferenceSchema = z.object({
  linkId: z.string().min(1),
  linkSha256: Sha256Schema,
  evidenceId: z.string().min(1),
  claimId: z.string().min(1),
  relationship: z.enum(["direct", "supporting", "partial", "contradiction"]),
  contradictionApproved: z.literal(true).optional(),
  evidenceStrength: JobEvidenceStrengthSchema,
  linkConfidence: JobEvidenceLinkConfidenceSchema,
}).strict().superRefine((value, context) => {
  if (
    value.relationship === "contradiction" &&
    value.contradictionApproved !== true
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Contradiction references require explicit approval",
      path: ["contradictionApproved"],
    });
  }
});

export const JobCoverageEvidenceMapProvenanceSchema = z.object({
  evidenceMapPath: RelativeWorkspacePathSchema,
  evidenceMapSha256: Sha256Schema,
  requirementMappingId: z.string().min(1),
  requirementMappingSha256: Sha256Schema,
  links: z.array(JobCoverageEvidenceLinkReferenceSchema),
}).strict();

export const JobCoverageLinkCountsSchema = z.object({
  direct: z.number().int().nonnegative(),
  supporting: z.number().int().nonnegative(),
  partial: z.number().int().nonnegative(),
  contradiction: z.number().int().nonnegative(),
}).strict();

export const JobRequirementCoverageSchema = z.object({
  id: z.string().min(1),
  requirementId: z.string().min(1),
  category: JobRequirementCategorySchema,
  necessity: JobRequirementNecessitySchema,
  normalizedLabel: z.string().trim().min(1),
  state: JobRequirementCoverageStateSchema,
  mappedLinkIds: z.array(z.string().min(1)),
  linkCounts: JobCoverageLinkCountsSchema,
  evidenceQuality: JobRequirementEvidenceQualitySchema,
  components: z.array(JobCoverageComponentSchema),
  requirementProvenance: JobRequirementLinkProvenanceSchema,
  evidenceMapProvenance: JobCoverageEvidenceMapProvenanceSchema,
  openQuestions: z.array(z.string().trim().min(1)),
  ambiguities: z.array(z.string().trim().min(1)),
  warnings: z.array(z.string().trim().min(1)),
}).strict().superRefine((value, context) => {
  const countedLinks =
    value.linkCounts.direct +
    value.linkCounts.supporting +
    value.linkCounts.partial +
    value.linkCounts.contradiction;
  if (countedLinks !== value.mappedLinkIds.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Link counts must equal the number of mapped links",
      path: ["linkCounts"],
    });
  }
  if (value.state === "unsupported" && value.mappedLinkIds.length > 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Unsupported coverage cannot contain mapped links",
      path: ["mappedLinkIds"],
    });
  }
  if (value.state === "contradicted" && value.linkCounts.contradiction === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Contradicted coverage requires an explicit contradiction link",
      path: ["linkCounts", "contradiction"],
    });
  }
  if (
    value.mappedLinkIds.length === 0 &&
    value.evidenceQuality !== "unavailable"
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Coverage without links must have unavailable evidence quality",
      path: ["evidenceQuality"],
    });
  }
});

export const JobCoverageCompletenessSchema = z.object({
  status: z.enum(["empty", "complete"]),
  requirementCount: z.number().int().nonnegative(),
  processedRequirementCount: z.number().int().nonnegative(),
  readyForDownstreamAssessment: z.boolean(),
  blockingReasons: z.array(z.string().min(1)),
}).strict().superRefine((value, context) => {
  if (value.requirementCount !== value.processedRequirementCount) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Every requirement must have one coverage record",
      path: ["processedRequirementCount"],
    });
  }
  if (value.readyForDownstreamAssessment && value.status !== "complete") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Only complete coverage is ready for downstream assessment",
      path: ["readyForDownstreamAssessment"],
    });
  }
});

export const JobRequirementCoverageModelSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  analyzer: z.object({
    name: z.string().min(1),
    version: z.string().min(1),
    mode: z.literal("deterministic"),
  }).strict(),
  policy: z.object({
    name: z.string().min(1),
    version: z.string().min(1),
  }).strict(),
  input: z.object({
    target: JobCoverageDependencySchema,
    jobDescription: JobCoverageDependencySchema,
    requirementModelType: JobRequirementInputTypeSchema,
    requirementModel: JobCoverageDependencySchema,
    requirementManifest: JobCoverageDependencySchema,
    evidenceMap: JobCoverageDependencySchema,
    evidenceMapManifest: JobCoverageDependencySchema,
    normalizedInputSha256: Sha256Schema,
  }).strict(),
  requirements: z.array(JobRequirementCoverageSchema),
  warnings: z.array(z.string().trim().min(1)),
  completeness: JobCoverageCompletenessSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const JobRequirementCoverageManifestSchema = z.object({
  schemaVersion: z.literal(1),
  coverageId: z.string().min(1),
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  coveragePath: RelativeWorkspacePathSchema,
  coverageSha256: Sha256Schema,
  analyzerName: z.string().min(1),
  analyzerVersion: z.string().min(1),
  policyName: z.string().min(1),
  policyVersion: z.string().min(1),
  targetSha256: Sha256Schema,
  sourceSha256: Sha256Schema,
  requirementModelType: JobRequirementInputTypeSchema,
  requirementModelSha256: Sha256Schema,
  requirementManifestSha256: Sha256Schema,
  evidenceMapSha256: Sha256Schema,
  evidenceMapManifestSha256: Sha256Schema,
  normalizedInputSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export type JobRequirementCoverageState = z.infer<
  typeof JobRequirementCoverageStateSchema
>;
export type JobRequirementEvidenceQuality = z.infer<
  typeof JobRequirementEvidenceQualitySchema
>;
export type JobCoverageComponent = z.infer<typeof JobCoverageComponentSchema>;
export type JobRequirementCoverage = z.infer<
  typeof JobRequirementCoverageSchema
>;
export type JobRequirementCoverageModel = z.infer<
  typeof JobRequirementCoverageModelSchema
>;
export type JobRequirementCoverageManifest = z.infer<
  typeof JobRequirementCoverageManifestSchema
>;
