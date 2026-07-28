import { z } from "zod";
import {
  JobCoverageEvidenceMapProvenanceSchema,
  JobRequirementCoverageStateSchema,
  JobRequirementEvidenceQualitySchema,
} from "./job-coverage-schemas.js";
import {
  JobRequirementCategorySchema,
  JobRequirementNecessitySchema,
} from "./job-requirement-schemas.js";
import {
  JobRequirementInputTypeSchema,
  JobRequirementLinkProvenanceSchema,
} from "./job-evidence-map-schemas.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const TargetIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const RelativeWorkspacePathSchema = z.string().min(1).refine(
  (value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value),
  "Path must be relative to the workspace",
);

export const JobRequirementAssessmentStateSchema = z.enum([
  "strength",
  "supported",
  "partial",
  "gap",
  "contradiction",
  "indeterminate",
]);

export const JobAssessmentProofStrengthSchema = z.enum([
  "strong",
  "adequate",
  "limited",
  "unavailable",
  "conflicting",
]);

export const JobAssessmentMaterialitySchema = z.enum([
  "critical",
  "material",
  "secondary",
  "contextual",
  "unknown",
]);

export const JobAssessmentGapTypeSchema = z.enum([
  "missing-proof",
  "partial-proof",
  "depth-gap",
  "scope-gap",
  "recency-gap",
  "domain-gap",
  "technology-gap",
  "leadership-gap",
  "experience-gap",
  "language-gap",
  "location-or-work-constraint-gap",
  "education-or-certification-gap",
  "contradiction",
  "ambiguous",
]);

export const JobOverallAssessmentStateSchema = z.enum([
  "strong",
  "credible",
  "mixed",
  "limited",
  "insufficient",
  "indeterminate",
]);

export const JobAssessmentDependencySchema = z.object({
  path: RelativeWorkspacePathSchema,
  sha256: Sha256Schema,
}).strict();

export const JobAssessmentCoverageProvenanceSchema = z.object({
  coveragePath: RelativeWorkspacePathSchema,
  coverageSha256: Sha256Schema,
  coverageEntryId: z.string().min(1),
  coverageEntrySha256: Sha256Schema,
}).strict();

export const JobRequirementAssessmentProvenanceSchema = z.object({
  requirement: JobRequirementLinkProvenanceSchema,
  coverage: JobAssessmentCoverageProvenanceSchema,
  evidenceMap: JobCoverageEvidenceMapProvenanceSchema,
}).strict();

export const JobAssessmentRiskSchema = z.object({
  id: z.string().min(1),
  code: z.enum([
    "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED",
    "MANDATORY_REQUIREMENT_PARTIAL",
    "EXPLICIT_REQUIREMENT_CONTRADICTED",
    "PROOF_QUALITY_LIMITED",
    "REQUIREMENT_SCOPE_NOT_EVIDENCED",
    "REQUIREMENT_DEPTH_NOT_EVIDENCED",
    "REQUIREMENT_RECENCY_NOT_EVIDENCED",
    "AMBIGUOUS_REQUIREMENT_MATERIALITY",
    "COVERAGE_PROVENANCE_INCOMPLETE",
    "ASSESSMENT_DEPENDENCY_STALE",
  ]),
  severity: z.enum(["critical", "high", "medium", "low"]),
  message: z.string().trim().min(1),
  requirementId: z.string().min(1),
  coverageEntryId: z.string().min(1),
  evidenceLinkIds: z.array(z.string().min(1)),
}).strict();

export const JobAssessmentWarningSchema = z.object({
  id: z.string().min(1),
  code: z.enum([
    "QUALITATIVE_ASSESSMENT_ONLY",
    "NO_HIRING_PREDICTION",
    "NO_APPLICATION_RECOMMENDATION",
    "REVIEWED_EVIDENCE_ONLY",
    "AMBIGUOUS_REQUIREMENT_REMAINS",
    "PREFERRED_REQUIREMENT_UNSUPPORTED",
    "CONTEXTUAL_REQUIREMENT_UNSUPPORTED",
  ]),
  message: z.string().trim().min(1),
  requirementId: z.string().min(1).optional(),
  coverageEntryId: z.string().min(1).optional(),
  evidenceLinkIds: z.array(z.string().min(1)),
}).strict();

export const JobAssessmentAmbiguitySchema = z.object({
  id: z.string().min(1),
  code: z.enum([
    "REQUIREMENT_AMBIGUITY_PRESERVED",
    "COVERAGE_INDETERMINATE",
    "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT",
  ]),
  message: z.string().trim().min(1),
  requirementId: z.string().min(1),
  coverageEntryId: z.string().min(1),
  evidenceLinkIds: z.array(z.string().min(1)),
}).strict();

export const JobRequirementFitProofAssessmentSchema = z.object({
  id: z.string().min(1),
  requirementId: z.string().min(1),
  category: JobRequirementCategorySchema,
  necessity: JobRequirementNecessitySchema,
  coverageState: JobRequirementCoverageStateSchema,
  assessmentState: JobRequirementAssessmentStateSchema,
  mappedEvidenceLinkIds: z.array(z.string().min(1)),
  evidenceQuality: JobRequirementEvidenceQualitySchema,
  proofStrength: JobAssessmentProofStrengthSchema,
  materiality: JobAssessmentMaterialitySchema,
  gapType: JobAssessmentGapTypeSchema.optional(),
  assessmentStatement: z.string().trim().min(1),
  riskIds: z.array(z.string().min(1)),
  warningIds: z.array(z.string().min(1)),
  ambiguityIds: z.array(z.string().min(1)),
  provenance: JobRequirementAssessmentProvenanceSchema,
}).strict().superRefine((value, context) => {
  const needsGap = [
    "partial",
    "gap",
    "contradiction",
    "indeterminate",
  ].includes(value.assessmentState);
  if (needsGap && !value.gapType) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Non-supported assessment states require a gap type",
      path: ["gapType"],
    });
  }
  if (!needsGap && value.gapType) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Strength and supported states cannot contain a gap type",
      path: ["gapType"],
    });
  }
  if (
    value.assessmentState === "strength" &&
    value.proofStrength !== "strong"
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A strength assessment requires strong proof",
      path: ["proofStrength"],
    });
  }
  if (
    value.assessmentState === "contradiction" &&
    (value.gapType !== "contradiction" ||
      value.proofStrength !== "conflicting")
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Contradictions require contradiction gap type and conflicting proof",
      path: ["assessmentState"],
    });
  }
});

export const JobOverallFitProofAssessmentSchema = z.object({
  state: JobOverallAssessmentStateSchema,
  strengthRequirementIds: z.array(z.string().min(1)),
  supportedRequirementIds: z.array(z.string().min(1)),
  partialRequirementIds: z.array(z.string().min(1)),
  gapRequirementIds: z.array(z.string().min(1)),
  contradictionRequirementIds: z.array(z.string().min(1)),
  indeterminateRequirementIds: z.array(z.string().min(1)),
  statement: z.string().trim().min(1),
}).strict();

export const JobFitProofAssessmentCompletenessSchema = z.object({
  status: z.enum(["empty", "complete"]),
  requirementIds: z.array(z.string().min(1)),
  assessedRequirementIds: z.array(z.string().min(1)),
  readyForDownstreamPlanning: z.boolean(),
  blockingReasons: z.array(z.string().trim().min(1)),
}).strict().superRefine((value, context) => {
  const required = new Set(value.requirementIds);
  const assessed = new Set(value.assessedRequirementIds);
  if (
    required.size !== value.requirementIds.length ||
    assessed.size !== value.assessedRequirementIds.length ||
    required.size !== assessed.size ||
    [...required].some((id) => !assessed.has(id))
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Assessment must cover every requirement exactly once",
      path: ["assessedRequirementIds"],
    });
  }
  if (
    value.readyForDownstreamPlanning &&
    value.status !== "complete"
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Only complete assessment is ready for downstream planning",
      path: ["readyForDownstreamPlanning"],
    });
  }
});

export const JobFitProofAssessmentSchema = z.object({
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
    target: JobAssessmentDependencySchema,
    jobDescription: JobAssessmentDependencySchema,
    requirementModelType: JobRequirementInputTypeSchema,
    requirementModel: JobAssessmentDependencySchema,
    requirementManifest: JobAssessmentDependencySchema,
    evidenceMap: JobAssessmentDependencySchema,
    evidenceMapManifest: JobAssessmentDependencySchema,
    coverage: JobAssessmentDependencySchema,
    coverageManifest: JobAssessmentDependencySchema,
    normalizedInputSha256: Sha256Schema,
  }).strict(),
  requirementAssessments: z.array(JobRequirementFitProofAssessmentSchema),
  overall: JobOverallFitProofAssessmentSchema,
  risks: z.array(JobAssessmentRiskSchema),
  warnings: z.array(JobAssessmentWarningSchema),
  ambiguities: z.array(JobAssessmentAmbiguitySchema),
  completeness: JobFitProofAssessmentCompletenessSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict().superRefine((value, context) => {
  const requirementIds = value.requirementAssessments.map(
    (entry) => entry.requirementId,
  );
  if (new Set(requirementIds).size !== requirementIds.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Requirement assessment identities must be unique",
      path: ["requirementAssessments"],
    });
  }
  const riskIds = new Set(value.risks.map((entry) => entry.id));
  const warningIds = new Set(value.warnings.map((entry) => entry.id));
  const ambiguityIds = new Set(value.ambiguities.map((entry) => entry.id));
  for (const [index, assessment] of value.requirementAssessments.entries()) {
    for (const riskId of assessment.riskIds) {
      if (!riskIds.has(riskId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown risk reference: ${riskId}`,
          path: ["requirementAssessments", index, "riskIds"],
        });
      }
    }
    for (const warningId of assessment.warningIds) {
      if (!warningIds.has(warningId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown warning reference: ${warningId}`,
          path: ["requirementAssessments", index, "warningIds"],
        });
      }
    }
    for (const ambiguityId of assessment.ambiguityIds) {
      if (!ambiguityIds.has(ambiguityId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown ambiguity reference: ${ambiguityId}`,
          path: ["requirementAssessments", index, "ambiguityIds"],
        });
      }
    }
  }
});

export const JobFitProofAssessmentManifestSchema = z.object({
  schemaVersion: z.literal(1),
  assessmentId: z.string().min(1),
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  assessmentPath: RelativeWorkspacePathSchema,
  assessmentSha256: Sha256Schema,
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
  coverageSha256: Sha256Schema,
  coverageManifestSha256: Sha256Schema,
  normalizedInputSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export type JobRequirementAssessmentState = z.infer<
  typeof JobRequirementAssessmentStateSchema
>;
export type JobAssessmentProofStrength = z.infer<
  typeof JobAssessmentProofStrengthSchema
>;
export type JobAssessmentMateriality = z.infer<
  typeof JobAssessmentMaterialitySchema
>;
export type JobAssessmentGapType = z.infer<typeof JobAssessmentGapTypeSchema>;
export type JobOverallAssessmentState = z.infer<
  typeof JobOverallAssessmentStateSchema
>;
export type JobAssessmentRisk = z.infer<typeof JobAssessmentRiskSchema>;
export type JobAssessmentWarning = z.infer<typeof JobAssessmentWarningSchema>;
export type JobAssessmentAmbiguity = z.infer<
  typeof JobAssessmentAmbiguitySchema
>;
export type JobRequirementFitProofAssessment = z.infer<
  typeof JobRequirementFitProofAssessmentSchema
>;
export type JobFitProofAssessment = z.infer<
  typeof JobFitProofAssessmentSchema
>;
export type JobFitProofAssessmentManifest = z.infer<
  typeof JobFitProofAssessmentManifestSchema
>;
