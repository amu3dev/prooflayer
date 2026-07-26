import { z } from "zod";
import {
  ModelGenerationSettingsSchema,
  ModelIdentitySchema,
  TargetAnalysisSourceReferenceSchema,
} from "./schemas.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const TargetIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const RelativeWorkspacePathSchema = z.string().min(1).refine(
  (value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value),
  "Path must be relative to the workspace",
);

export const JobRequirementCategorySchema = z.enum([
  "responsibility",
  "required-capability",
  "preferred-capability",
  "technical-expectation",
  "domain-expectation",
  "leadership-expectation",
  "operating-context",
  "experience-seniority",
  "education-certification",
  "language",
  "location-travel-visa-work-mode",
  "screening",
  "metric-scale",
  "unknown",
]);

export const JobRequirementNecessitySchema = z.enum([
  "mandatory",
  "preferred",
  "contextual",
  "ambiguous",
]);

export const JobRequirementConfidenceSchema = z.enum(["high", "medium", "low"]);
export const JobRequirementExplicitnessSchema = z.enum(["explicit", "inferred"]);
export const JobRequirementTrustStateSchema = z.enum([
  "deterministic-unreviewed",
  "proposed",
  "human-approved",
  "human-edited",
]);

export const JobRequirementRelationshipSchema = z.object({
  type: z.enum(["requires", "related-to", "alternative-to"]),
  requirementId: z.string().min(1),
}).strict();

export const JobRequirementProvenanceSchema = z.object({
  sourceAnalysisItemId: z.string().min(1),
  sourceSectionId: z.string().min(1).nullable(),
  sourceReferences: z.array(TargetAnalysisSourceReferenceSchema).min(1),
}).strict();

const JobRequirementFields = {
  category: JobRequirementCategorySchema,
  normalizedLabel: z.string().trim().min(1),
  sourceText: z.string().min(1),
  necessity: JobRequirementNecessitySchema,
  confidence: JobRequirementConfidenceSchema,
  explicitness: JobRequirementExplicitnessSchema,
  provenance: JobRequirementProvenanceSchema,
  relationships: z.array(JobRequirementRelationshipSchema),
  namedTechnologies: z.array(z.string().trim().min(1)),
  keywords: z.array(z.string().trim().min(1)),
  notes: z.array(z.string().trim().min(1)),
};

export const JobRequirementSchema = z.object({
  id: z.string().min(1),
  ...JobRequirementFields,
  trustState: JobRequirementTrustStateSchema,
}).strict();

export const JobRequirementAmbiguitySchema = z.object({
  id: z.string().min(1),
  code: z.enum([
    "AMBIGUOUS_NECESSITY",
    "AMBIGUOUS_CATEGORY",
    "VAGUE_SCOPE",
    "COMPOUND_STATEMENT",
    "OTHER",
  ]),
  message: z.string().min(1),
  requirementIds: z.array(z.string().min(1)),
  sourceAnalysisItemIds: z.array(z.string().min(1)),
  sourceReferences: z.array(TargetAnalysisSourceReferenceSchema),
}).strict();

export const JobRequirementContradictionSchema = z.object({
  id: z.string().min(1),
  message: z.string().min(1),
  requirementIds: z.array(z.string().min(1)).min(2),
  sourceReferences: z.array(TargetAnalysisSourceReferenceSchema).min(2),
}).strict();

export const JobRequirementRiskSchema = z.object({
  id: z.string().min(1),
  code: z.enum([
    "AMBIGUOUS_MANDATORY_STATUS",
    "UNCLASSIFIED_REQUIREMENT",
    "CONTRADICTORY_REQUIREMENT",
    "SOURCE_STRUCTURE_INCOMPLETE",
  ]),
  severity: z.enum(["high", "medium", "low"]),
  message: z.string().min(1),
  requirementIds: z.array(z.string().min(1)),
}).strict();

export const JobRequirementWarningSchema = z.object({
  id: z.string().min(1),
  code: z.enum([
    "NO_REQUIREMENTS_FOUND",
    "FRONT_MATTER_EXCLUDED",
    "UNKNOWN_SECTION",
    "AMBIGUOUS_ITEM_PRESERVED",
    "MODEL_PROPOSAL_REQUIRES_REVIEW",
  ]),
  message: z.string().min(1),
  sourceAnalysisItemIds: z.array(z.string().min(1)),
}).strict();

export const JobRequirementCompletenessSchema = z.object({
  status: z.enum(["empty", "partial", "complete"]),
  sourceItemCount: z.number().int().nonnegative(),
  modeledItemCount: z.number().int().nonnegative(),
  unmodeledItemIds: z.array(z.string().min(1)),
  usableForHumanReview: z.boolean(),
  blockingReasons: z.array(z.string().min(1)),
}).strict().superRefine((value, context) => {
  if (value.status === "empty" && value.usableForHumanReview) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "An empty requirement model cannot be usable for human review",
      path: ["usableForHumanReview"],
    });
  }
});

export const JobRequirementDependencySchema = z.object({
  path: RelativeWorkspacePathSchema,
  sha256: Sha256Schema,
}).strict();

export const JobRequirementModelSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  policy: z.object({
    name: z.string().min(1),
    version: z.string().min(1),
    mode: z.literal("deterministic"),
  }).strict(),
  input: z.object({
    target: JobRequirementDependencySchema,
    jobDescription: JobRequirementDependencySchema,
    structuralAnalysis: JobRequirementDependencySchema,
    structuralAnalysisManifest: JobRequirementDependencySchema,
    normalizedInputSha256: Sha256Schema,
  }).strict(),
  requirements: z.array(JobRequirementSchema),
  namedTechnologies: z.array(z.string().min(1)),
  keywords: z.array(z.string().min(1)),
  ambiguities: z.array(JobRequirementAmbiguitySchema),
  contradictions: z.array(JobRequirementContradictionSchema),
  risks: z.array(JobRequirementRiskSchema),
  warnings: z.array(JobRequirementWarningSchema),
  completeness: JobRequirementCompletenessSchema,
  trustState: z.literal("deterministic-unreviewed"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const JobRequirementModelManifestSchema = z.object({
  schemaVersion: z.literal(1),
  modelId: z.string().min(1),
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  modelPath: RelativeWorkspacePathSchema,
  modelSha256: Sha256Schema,
  policyName: z.string().min(1),
  policyVersion: z.string().min(1),
  targetSha256: Sha256Schema,
  sourceSha256: Sha256Schema,
  structuralAnalysisSha256: Sha256Schema,
  structuralAnalysisManifestSha256: Sha256Schema,
  normalizedInputSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

const ProposedJobRequirementFields = {
  sourceRequirementIds: z.array(z.string().min(1)),
  sourceAnalysisItemIds: z.array(z.string().min(1)).min(1),
  sourceReferences: z.array(TargetAnalysisSourceReferenceSchema).min(1),
  category: JobRequirementCategorySchema,
  normalizedLabel: z.string().trim().min(1),
  sourceText: z.string().min(1),
  necessity: JobRequirementNecessitySchema,
  confidence: JobRequirementConfidenceSchema,
  explicitness: JobRequirementExplicitnessSchema,
  relationships: z.array(JobRequirementRelationshipSchema),
  namedTechnologies: z.array(z.string().trim().min(1)),
  keywords: z.array(z.string().trim().min(1)),
  rationale: z.string().trim().min(1),
  ambiguityNotes: z.array(z.string().trim().min(1)),
};

export const ModelProposedJobRequirementSchema = z.object({
  ...ProposedJobRequirementFields,
}).strict();

export const ProposedJobRequirementSchema = z.object({
  id: z.string().min(1),
  ...ProposedJobRequirementFields,
  trustState: z.literal("proposed"),
}).strict();

export const ModelJobRequirementPayloadSchema = z.object({
  proposedRequirements: z.array(ModelProposedJobRequirementSchema),
  warnings: z.array(z.string().trim().min(1)),
}).strict();

export const JobRequirementProposalSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  requestFingerprint: Sha256Schema,
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  status: z.enum(["generated", "validation-failed", "ready-for-review", "reviewed"]),
  model: ModelIdentitySchema.extend({
    settings: ModelGenerationSettingsSchema,
  }).strict(),
  prompt: z.object({
    templateId: z.string().min(1),
    templateVersion: z.string().min(1),
    policyVersion: z.string().min(1),
    renderedPromptSha256: Sha256Schema,
  }).strict(),
  input: z.object({
    targetSha256: Sha256Schema,
    sourceSha256: Sha256Schema,
    deterministicModelSha256: Sha256Schema,
    normalizedModelInputSha256: Sha256Schema,
  }).strict(),
  proposedRequirements: z.array(ProposedJobRequirementSchema),
  warnings: z.array(JobRequirementWarningSchema),
  validationIssues: z.array(z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    path: z.string().min(1).optional(),
  }).strict()),
  rawResponsePath: RelativeWorkspacePathSchema,
  rawResponseSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const JobRequirementProposalManifestSchema = z.object({
  schemaVersion: z.literal(1),
  proposalId: z.string().min(1),
  requestFingerprint: Sha256Schema,
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  proposalPath: RelativeWorkspacePathSchema,
  proposalSha256: Sha256Schema,
  rawResponsePath: RelativeWorkspacePathSchema,
  rawResponseSha256: Sha256Schema,
  policyName: z.string().min(1),
  policyVersion: z.string().min(1),
  provider: z.string().min(1),
  model: z.string().min(1),
  promptTemplateId: z.string().min(1),
  promptTemplateVersion: z.string().min(1),
  renderedPromptSha256: Sha256Schema,
  targetSha256: Sha256Schema,
  sourceSha256: Sha256Schema,
  deterministicModelSha256: Sha256Schema,
  normalizedModelInputSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const EditedJobRequirementSchema = z.object({
  category: JobRequirementCategorySchema,
  normalizedLabel: z.string().trim().min(1),
  necessity: JobRequirementNecessitySchema,
  confidence: JobRequirementConfidenceSchema,
  explicitness: JobRequirementExplicitnessSchema,
  relationships: z.array(JobRequirementRelationshipSchema),
  namedTechnologies: z.array(z.string().trim().min(1)),
  keywords: z.array(z.string().trim().min(1)),
  notes: z.array(z.string().trim().min(1)),
}).strict();

export const JobRequirementReviewDecisionSchema = z.object({
  requirementId: z.string().min(1),
  source: z.enum(["deterministic", "proposal"]),
  decision: z.enum(["pending", "accept", "edit", "reject"]),
  editedRequirement: EditedJobRequirementSchema.optional(),
  reviewNote: z.string().trim().min(1).optional(),
  decidedAt: z.string().datetime().optional(),
}).strict().superRefine((value, context) => {
  if (value.decision === "edit" && !value.editedRequirement) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Edit requires editedRequirement" });
  }
  if (value.decision !== "edit" && value.editedRequirement) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Only edit decisions may contain editedRequirement",
    });
  }
});

export const JobRequirementProposalReviewSchema = z.object({
  schemaVersion: z.literal(1),
  proposalId: z.string().min(1),
  targetId: TargetIdSchema,
  status: z.enum(["in-progress", "completed"]),
  decisions: z.array(JobRequirementReviewDecisionSchema),
  reviewer: z.object({
    type: z.literal("human"),
    name: z.string().trim().min(1).optional(),
  }).strict(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const JobRequirementReviewManifestSchema = z.object({
  schemaVersion: z.literal(1),
  proposalId: z.string().min(1),
  targetId: TargetIdSchema,
  reviewPath: RelativeWorkspacePathSchema,
  reviewSha256: Sha256Schema,
  proposalSha256: Sha256Schema,
  deterministicModelSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const ApprovedJobRequirementSchema = JobRequirementSchema.extend({
  trustState: z.enum(["human-approved", "human-edited"]),
  approvalProvenance: z.object({
    proposalId: z.string().min(1),
    reviewedRequirementId: z.string().min(1),
    source: z.enum(["deterministic", "proposal"]),
    reviewDecision: z.enum(["accept", "edit"]),
    reviewer: z.object({
      type: z.literal("human"),
      name: z.string().trim().min(1).optional(),
    }).strict(),
    promptTemplateId: z.string().min(1),
    promptTemplateVersion: z.string().min(1),
    policyVersion: z.string().min(1),
  }).strict(),
}).strict();

export const ApprovedJobRequirementModelSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  policy: z.object({
    name: z.string().min(1),
    version: z.string().min(1),
    mode: z.literal("manual"),
  }).strict(),
  input: z.object({
    target: JobRequirementDependencySchema,
    jobDescription: JobRequirementDependencySchema,
    structuralAnalysis: JobRequirementDependencySchema,
    deterministicModel: JobRequirementDependencySchema,
    proposal: JobRequirementDependencySchema,
    review: JobRequirementDependencySchema,
    normalizedInputSha256: Sha256Schema,
  }).strict(),
  requirements: z.array(ApprovedJobRequirementSchema),
  namedTechnologies: z.array(z.string().min(1)),
  keywords: z.array(z.string().min(1)),
  ambiguities: z.array(JobRequirementAmbiguitySchema),
  contradictions: z.array(JobRequirementContradictionSchema),
  risks: z.array(JobRequirementRiskSchema),
  warnings: z.array(JobRequirementWarningSchema),
  completeness: JobRequirementCompletenessSchema,
  trustState: z.literal("human-reviewed"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const ApprovedJobRequirementManifestSchema = z.object({
  schemaVersion: z.literal(1),
  modelId: z.string().min(1),
  targetId: TargetIdSchema,
  targetType: z.literal("job"),
  approvedModelPath: RelativeWorkspacePathSchema,
  approvedModelSha256: Sha256Schema,
  policyName: z.string().min(1),
  policyVersion: z.string().min(1),
  targetSha256: Sha256Schema,
  sourceSha256: Sha256Schema,
  structuralAnalysisSha256: Sha256Schema,
  deterministicModelSha256: Sha256Schema,
  proposalId: z.string().min(1),
  proposalSha256: Sha256Schema,
  reviewSha256: Sha256Schema,
  promptTemplateId: z.string().min(1),
  promptTemplateVersion: z.string().min(1),
  normalizedInputSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export type JobRequirementCategory = z.infer<typeof JobRequirementCategorySchema>;
export type JobRequirementNecessity = z.infer<typeof JobRequirementNecessitySchema>;
export type JobRequirement = z.infer<typeof JobRequirementSchema>;
export type JobRequirementModel = z.infer<typeof JobRequirementModelSchema>;
export type JobRequirementModelManifest = z.infer<typeof JobRequirementModelManifestSchema>;
export type ModelJobRequirementPayload = z.infer<typeof ModelJobRequirementPayloadSchema>;
export type ProposedJobRequirement = z.infer<typeof ProposedJobRequirementSchema>;
export type JobRequirementProposal = z.infer<typeof JobRequirementProposalSchema>;
export type JobRequirementProposalManifest = z.infer<typeof JobRequirementProposalManifestSchema>;
export type EditedJobRequirement = z.infer<typeof EditedJobRequirementSchema>;
export type JobRequirementReviewDecision = z.infer<typeof JobRequirementReviewDecisionSchema>;
export type JobRequirementProposalReview = z.infer<typeof JobRequirementProposalReviewSchema>;
export type JobRequirementReviewManifest = z.infer<typeof JobRequirementReviewManifestSchema>;
export type ApprovedJobRequirement = z.infer<typeof ApprovedJobRequirementSchema>;
export type ApprovedJobRequirementModel = z.infer<typeof ApprovedJobRequirementModelSchema>;
export type ApprovedJobRequirementManifest = z.infer<typeof ApprovedJobRequirementManifestSchema>;
