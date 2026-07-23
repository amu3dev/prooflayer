import { z } from "zod";
import {
  ModelGenerationSettingsSchema,
  TargetExpectationImportanceSchema,
  TargetExpectationKindSchema,
  TargetExpectationNecessitySchema,
  TargetInterpretationSourceReferenceSchema,
} from "./schemas.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const RelativeWorkspacePathSchema = z.string().min(1).refine(
  (value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value),
  "Path must be relative to the workspace",
);

export const AssessmentModeSchema = z.enum(["role-positioning", "job-specific"]);
export const SupportStatusSchema = z.enum([
  "strongly-supported",
  "supported",
  "partially-supported",
  "unsupported",
  "conflicting",
  "not-assessed",
]);
export const ProofQualitySchema = z.enum([
  "strong",
  "adequate",
  "limited",
  "weak",
  "none",
  "conflicting",
  "unknown",
]);
export const EvidenceSufficiencySchema = z.enum([
  "sufficient",
  "partially-sufficient",
  "insufficient",
  "not-evaluated",
]);
export const DefensibilitySchema = z.enum(["high", "medium", "low", "none", "uncertain"]);
export const FreshnessRiskSchema = z.enum(["none", "low", "medium", "high", "unknown"]);
export const ContradictionRiskSchema = z.enum(["none", "low", "medium", "high"]);
export const GapTypeSchema = z.enum([
  "none",
  "evidence-gap",
  "coverage-gap",
  "freshness-gap",
  "specificity-gap",
  "experience-gap-possible",
  "contradiction",
  "not-assessed",
]);
export const AssessmentConfidenceSchema = z.enum(["high", "medium", "low"]);
export const MaterialitySchema = z.enum(["critical", "high", "medium", "low", "unknown"]);
export const AssessmentTrustStateSchema = z.enum([
  "deterministic-approved",
  "human-approved",
  "human-edited",
]);

export const EvidenceActionTypeSchema = z.enum([
  "add-specific-example",
  "add-quantified-outcome",
  "add-recent-example",
  "clarify-role-scope",
  "separate-compound-claim",
  "verify-claim",
  "resolve-contradiction",
  "review-unreviewed-source",
  "no-action",
]);

export const EvidenceActionRecommendationSchema = z.object({
  type: EvidenceActionTypeSchema,
  priority: z.enum(["high", "medium", "low"]),
  rationale: z.string().trim().min(1),
  relatedEvidenceIds: z.array(z.string().min(1)),
}).strict();

export const AssessmentDependencySchema = z.object({
  path: RelativeWorkspacePathSchema,
  sha256: Sha256Schema,
  manifestPath: RelativeWorkspacePathSchema,
  manifestSha256: Sha256Schema,
}).strict();

export const ExpectationAssessmentProvenanceSchema = z.object({
  targetId: z.string().min(1),
  expectationId: z.string().min(1),
  approvedInterpretationSha256: Sha256Schema,
  approvedInterpretationManifestSha256: Sha256Schema,
  approvedMatchingSha256: Sha256Schema,
  approvedMatchingManifestSha256: Sha256Schema,
  evidenceSnapshotSha256: Sha256Schema,
  approvedMatchIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
  assessmentPolicy: z.object({ name: z.string().min(1), version: z.string().min(1) }).strict(),
  deterministicInputs: z.object({
    coverageStatus: z.enum(["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]),
    matchTypes: z.array(z.enum(["direct", "supporting", "partial", "contradictory"])),
    evidenceStrengths: z.array(z.enum(["strong", "medium", "weak", "unknown"])),
    temporalRelevance: z.array(z.enum(["current", "recent", "historical", "unknown"])),
    matchConfidences: z.array(z.enum(["high", "medium", "low"])),
  }).strict(),
  sourceReferences: z.array(TargetInterpretationSourceReferenceSchema),
  modelProposal: z.object({
    proposalId: z.string().min(1),
    proposedAssessmentId: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().min(1),
    promptTemplateVersion: z.string().min(1),
    policyVersion: z.string().min(1),
  }).strict().optional(),
  reviewDecision: z.object({
    decision: z.enum(["accept", "edit"]),
    reviewer: z.object({ type: z.literal("human"), name: z.string().min(1).optional() }).strict(),
  }).strict().optional(),
}).strict();

export const ExpectationSnapshotSchema = z.object({
  text: z.string().min(1),
  type: TargetExpectationKindSchema,
  necessity: TargetExpectationNecessitySchema,
  importance: TargetExpectationImportanceSchema,
  trustState: z.enum(["deterministic-approved", "human-approved", "human-edited"]),
}).strict();

const ExpectationAssessmentFields = {
  supportStatus: SupportStatusSchema,
  proofQuality: ProofQualitySchema,
  evidenceSufficiency: EvidenceSufficiencySchema,
  defensibility: DefensibilitySchema,
  freshnessRisk: FreshnessRiskSchema,
  contradictionRisk: ContradictionRiskSchema,
  gapType: GapTypeSchema,
  assessmentConfidence: AssessmentConfidenceSchema,
  materiality: MaterialitySchema,
  approvedMatchIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
  rationale: z.string().trim().min(1),
  limitations: z.array(z.string().trim().min(1)),
  recommendedEvidenceActions: z.array(EvidenceActionRecommendationSchema),
};

export const ExpectationFitAssessmentSchema = z.object({
  id: z.string().min(1),
  expectationId: z.string().min(1),
  expectation: ExpectationSnapshotSchema,
  ...ExpectationAssessmentFields,
  provenance: ExpectationAssessmentProvenanceSchema,
  trustState: AssessmentTrustStateSchema,
}).strict();

export const AssessmentRiskSchema = z.object({
  id: z.string().min(1),
  code: z.enum([
    "CRITICAL_REQUIREMENT_UNSUPPORTED",
    "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED",
    "MATERIAL_CONTRADICTION",
    "EVIDENCE_TOO_GENERAL",
    "EVIDENCE_TOO_OLD",
    "EVIDENCE_TOO_WEAK",
    "COMPOUND_EXPECTATION_PARTIALLY_COVERED",
    "ASSESSMENT_INCOMPLETE",
    "MATCHING_STALE",
    "INTERPRETATION_STALE",
    "PROVENANCE_INCOMPLETE",
  ]),
  severity: z.enum(["critical", "high", "medium", "low"]),
  message: z.string().min(1),
  expectationIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
}).strict();

export const FitAssessmentWarningSchema = z.object({
  id: z.string().min(1),
  code: z.enum([
    "NO_APPROVED_MATCHING",
    "MATCHING_NOT_COMPLETE",
    "NO_SUPPORTED_EXPECTATIONS",
    "NO_REQUIRED_EXPECTATIONS_IDENTIFIED",
    "ONLY_SUPPORTING_EVIDENCE_AVAILABLE",
    "ONLY_HISTORICAL_EVIDENCE_AVAILABLE",
    "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE",
    "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW",
  ]),
  message: z.string().min(1),
  expectationIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
}).strict();

export const FitAssessmentAmbiguitySchema = z.object({
  id: z.string().min(1),
  code: z.enum([
    "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR",
    "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR",
    "MATERIALITY_UNCLEAR",
    "FRESHNESS_RELEVANCE_UNCLEAR",
    "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR",
    "CONTRADICTION_MATERIALITY_UNCLEAR",
  ]),
  message: z.string().min(1),
  expectationId: z.string().min(1).optional(),
  evidenceIds: z.array(z.string().min(1)),
}).strict();

export const FitAssessmentCompletenessSchema = z.object({
  status: z.enum(["empty", "partial", "complete"]),
  assessedExpectationCount: z.number().int().nonnegative(),
  totalEligibleExpectationCount: z.number().int().nonnegative(),
  summaryAvailable: z.boolean(),
  usableForResumeConstruction: z.boolean(),
  usableForApplicationConstruction: z.boolean(),
  blockingReasons: z.array(z.string().min(1)),
}).strict().superRefine((value, context) => {
  if (value.status !== "complete" && (value.usableForResumeConstruction || value.usableForApplicationConstruction)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Incomplete assessments cannot be used downstream" });
  }
});

export const RequirementSetAssessmentSchema = z.object({
  total: z.number().int().nonnegative(),
  stronglySupported: z.number().int().nonnegative(),
  supported: z.number().int().nonnegative(),
  partiallySupported: z.number().int().nonnegative(),
  unsupported: z.number().int().nonnegative(),
  conflicting: z.number().int().nonnegative(),
  notAssessed: z.number().int().nonnegative(),
}).strict();

export const RoleFitAssessmentSummarySchema = z.object({
  mode: z.literal("role-positioning"),
  overallPositioning: z.enum([
    "well-supported",
    "supported-with-gaps",
    "partially-supported",
    "insufficient-evidence",
    "conflicting",
    "incomplete",
  ]),
  stronglySupportedCount: z.number().int().nonnegative(),
  supportedCount: z.number().int().nonnegative(),
  partiallySupportedCount: z.number().int().nonnegative(),
  unsupportedCount: z.number().int().nonnegative(),
  conflictingCount: z.number().int().nonnegative(),
  notAssessedCount: z.number().int().nonnegative(),
  criticalGapExpectationIds: z.array(z.string().min(1)),
  evidenceImprovementExpectationIds: z.array(z.string().min(1)),
  narrative: z.string().min(1),
}).strict();

export const JobFitAssessmentSummarySchema = z.object({
  mode: z.literal("job-specific"),
  opportunityAlignment: z.enum([
    "strong-alignment",
    "credible-alignment",
    "mixed-alignment",
    "weak-evidence-alignment",
    "material-conflict",
    "incomplete",
  ]),
  requiredExpectationSummary: RequirementSetAssessmentSchema,
  preferredExpectationSummary: RequirementSetAssessmentSchema,
  contextualExpectationSummary: RequirementSetAssessmentSchema,
  materialRiskExpectationIds: z.array(z.string().min(1)),
  unsupportedRequiredExpectationIds: z.array(z.string().min(1)),
  conflictingExpectationIds: z.array(z.string().min(1)),
  narrative: z.string().min(1),
}).strict();

export const FitAssessmentSummarySchema = z.discriminatedUnion("mode", [
  RoleFitAssessmentSummarySchema,
  JobFitAssessmentSummarySchema,
]);

const BaseAssessmentFields = {
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  targetId: z.string().min(1),
  approvedInterpretation: AssessmentDependencySchema,
  approvedMatching: AssessmentDependencySchema,
  evidenceSnapshotSha256: Sha256Schema,
  assessmentPolicy: z.object({ name: z.string().min(1), version: z.string().min(1) }).strict(),
  expectationAssessments: z.array(ExpectationFitAssessmentSchema),
  risks: z.array(AssessmentRiskSchema),
  warnings: z.array(FitAssessmentWarningSchema),
  ambiguities: z.array(FitAssessmentAmbiguitySchema),
  completeness: FitAssessmentCompletenessSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
};

export const RoleFitAssessmentSchema = z.object({
  ...BaseAssessmentFields,
  targetType: z.literal("role"),
  mode: z.literal("role-positioning"),
  summary: RoleFitAssessmentSummarySchema,
}).strict();

export const JobFitAssessmentSchema = z.object({
  ...BaseAssessmentFields,
  targetType: z.literal("job"),
  mode: z.literal("job-specific"),
  summary: JobFitAssessmentSummarySchema,
}).strict();

export const TargetFitAssessmentSchema = z.discriminatedUnion("targetType", [
  RoleFitAssessmentSchema,
  JobFitAssessmentSchema,
]).superRefine((assessment, context) => {
  const ids = assessment.expectationAssessments.map((entry) => entry.id);
  const expectationIds = assessment.expectationAssessments.map((entry) => entry.expectationId);
  if (new Set(ids).size !== ids.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Assessment IDs must be unique" });
  if (new Set(expectationIds).size !== expectationIds.length) context.addIssue({ code: z.ZodIssueCode.custom, message: "Expectation assessments must be unique" });
});

export const FitAssessmentManifestSchema = z.object({
  schemaVersion: z.literal(1),
  artifactType: z.enum(["deterministic", "approved"]),
  assessmentId: z.string().min(1),
  targetId: z.string().min(1),
  targetType: z.enum(["role", "job"]),
  mode: AssessmentModeSchema,
  assessmentPath: RelativeWorkspacePathSchema,
  assessmentSha256: Sha256Schema,
  policyName: z.string().min(1),
  policyVersion: z.string().min(1),
  targetSha256: Sha256Schema,
  approvedInterpretationSha256: Sha256Schema,
  approvedInterpretationManifestSha256: Sha256Schema,
  approvedMatchingSha256: Sha256Schema,
  approvedMatchingManifestSha256: Sha256Schema,
  evidenceSnapshotSha256: Sha256Schema,
  expectationSetSha256: Sha256Schema,
  approvedMatchSetSha256: Sha256Schema,
  proposalId: z.string().min(1).optional(),
  proposalSha256: Sha256Schema.optional(),
  reviewSha256: Sha256Schema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const ModelProposedExpectationFitAssessmentSchema = z.object({
  expectationAssessmentId: z.string().min(1),
  expectationId: z.string().min(1),
  ...ExpectationAssessmentFields,
  provenance: ExpectationAssessmentProvenanceSchema,
}).strict();

export const ProposedExpectationFitAssessmentSchema = z.object({
  id: z.string().min(1),
  expectationAssessmentId: z.string().min(1),
  expectationId: z.string().min(1),
  ...ExpectationAssessmentFields,
  provenance: ExpectationAssessmentProvenanceSchema,
  trustState: z.literal("proposed"),
}).strict();

export const ModelFitAssessmentPayloadSchema = z.object({
  proposedExpectationAssessments: z.array(ModelProposedExpectationFitAssessmentSchema),
  proposedSummary: FitAssessmentSummarySchema,
  warnings: z.array(FitAssessmentWarningSchema.omit({ id: true })),
  ambiguities: z.array(FitAssessmentAmbiguitySchema.omit({ id: true })),
}).strict();

export const FitAssessmentValidationIssueSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  path: z.string().min(1).optional(),
}).strict();

export const FitAssessmentProposalSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  requestFingerprint: Sha256Schema,
  targetId: z.string().min(1),
  targetType: z.enum(["role", "job"]),
  mode: AssessmentModeSchema,
  status: z.enum(["generated", "validation-failed", "ready-for-review", "reviewed"]),
  assessmentPolicy: z.object({ name: z.string().min(1), version: z.string().min(1) }).strict(),
  model: z.object({ provider: z.string().min(1), model: z.string().min(1), settings: ModelGenerationSettingsSchema }).strict(),
  prompt: z.object({
    templateId: z.string().min(1),
    templateVersion: z.string().min(1),
    policyVersion: z.string().min(1),
    renderedPromptSha256: Sha256Schema,
  }).strict(),
  input: z.object({
    targetSha256: Sha256Schema,
    approvedInterpretationSha256: Sha256Schema,
    approvedMatchingSha256: Sha256Schema,
    evidenceSnapshotSha256: Sha256Schema,
    deterministicAssessmentSha256: Sha256Schema,
    normalizedModelInputSha256: Sha256Schema,
  }).strict(),
  proposedExpectationAssessments: z.array(ProposedExpectationFitAssessmentSchema),
  proposedSummary: FitAssessmentSummarySchema.optional(),
  warnings: z.array(FitAssessmentWarningSchema),
  ambiguities: z.array(FitAssessmentAmbiguitySchema),
  validationIssues: z.array(FitAssessmentValidationIssueSchema),
  rawResponsePath: RelativeWorkspacePathSchema,
  rawResponseSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const FitAssessmentProposalManifestSchema = z.object({
  schemaVersion: z.literal(1),
  proposalId: z.string().min(1),
  requestFingerprint: Sha256Schema,
  targetId: z.string().min(1),
  targetType: z.enum(["role", "job"]),
  mode: AssessmentModeSchema,
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
  approvedInterpretationSha256: Sha256Schema,
  approvedMatchingSha256: Sha256Schema,
  evidenceSnapshotSha256: Sha256Schema,
  deterministicAssessmentSha256: Sha256Schema,
  normalizedModelInputSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const EditedExpectationFitAssessmentSchema = z.object({
  ...ExpectationAssessmentFields,
}).strict();

export const FitAssessmentReviewDecisionSchema = z.object({
  proposedAssessmentId: z.string().min(1),
  decision: z.enum(["pending", "accept", "edit", "reject"]),
  editedAssessment: EditedExpectationFitAssessmentSchema.optional(),
  reviewNote: z.string().min(1).optional(),
  decidedAt: z.string().datetime().optional(),
}).strict().superRefine((value, context) => {
  if (value.decision === "edit" && !value.editedAssessment) context.addIssue({ code: z.ZodIssueCode.custom, message: "Edit requires editedAssessment" });
  if (value.decision !== "edit" && value.editedAssessment) context.addIssue({ code: z.ZodIssueCode.custom, message: "Only edit may contain editedAssessment" });
});

export const FitAssessmentSummaryReviewDecisionSchema = z.object({
  decision: z.enum(["pending", "accept", "edit", "reject"]),
  editedSummary: FitAssessmentSummarySchema.optional(),
  reviewNote: z.string().min(1).optional(),
  decidedAt: z.string().datetime().optional(),
}).strict().superRefine((value, context) => {
  if (value.decision === "edit" && !value.editedSummary) context.addIssue({ code: z.ZodIssueCode.custom, message: "Summary edit requires editedSummary" });
  if (value.decision !== "edit" && value.editedSummary) context.addIssue({ code: z.ZodIssueCode.custom, message: "Only summary edit may contain editedSummary" });
});

export const FitAssessmentProposalReviewSchema = z.object({
  schemaVersion: z.literal(1),
  proposalId: z.string().min(1),
  targetId: z.string().min(1),
  status: z.enum(["in-progress", "completed"]),
  expectationDecisions: z.array(FitAssessmentReviewDecisionSchema),
  summaryDecision: FitAssessmentSummaryReviewDecisionSchema,
  reviewer: z.object({ type: z.literal("human"), name: z.string().min(1).optional() }).strict(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const FitAssessmentReviewManifestSchema = z.object({
  schemaVersion: z.literal(1),
  proposalId: z.string().min(1),
  targetId: z.string().min(1),
  reviewPath: RelativeWorkspacePathSchema,
  reviewSha256: Sha256Schema,
  proposalSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export type AssessmentMode = z.infer<typeof AssessmentModeSchema>;
export type SupportStatus = z.infer<typeof SupportStatusSchema>;
export type ProofQuality = z.infer<typeof ProofQualitySchema>;
export type EvidenceSufficiency = z.infer<typeof EvidenceSufficiencySchema>;
export type Defensibility = z.infer<typeof DefensibilitySchema>;
export type FreshnessRisk = z.infer<typeof FreshnessRiskSchema>;
export type ContradictionRisk = z.infer<typeof ContradictionRiskSchema>;
export type GapType = z.infer<typeof GapTypeSchema>;
export type AssessmentConfidence = z.infer<typeof AssessmentConfidenceSchema>;
export type Materiality = z.infer<typeof MaterialitySchema>;
export type AssessmentTrustState = z.infer<typeof AssessmentTrustStateSchema>;
export type EvidenceActionType = z.infer<typeof EvidenceActionTypeSchema>;
export type EvidenceActionRecommendation = z.infer<typeof EvidenceActionRecommendationSchema>;
export type ExpectationAssessmentProvenance = z.infer<typeof ExpectationAssessmentProvenanceSchema>;
export type ExpectationFitAssessment = z.infer<typeof ExpectationFitAssessmentSchema>;
export type AssessmentRisk = z.infer<typeof AssessmentRiskSchema>;
export type FitAssessmentWarning = z.infer<typeof FitAssessmentWarningSchema>;
export type FitAssessmentAmbiguity = z.infer<typeof FitAssessmentAmbiguitySchema>;
export type FitAssessmentCompleteness = z.infer<typeof FitAssessmentCompletenessSchema>;
export type RoleFitAssessmentSummary = z.infer<typeof RoleFitAssessmentSummarySchema>;
export type JobFitAssessmentSummary = z.infer<typeof JobFitAssessmentSummarySchema>;
export type FitAssessmentSummary = z.infer<typeof FitAssessmentSummarySchema>;
export type TargetFitAssessment = z.infer<typeof TargetFitAssessmentSchema>;
export type FitAssessmentManifest = z.infer<typeof FitAssessmentManifestSchema>;
export type ModelFitAssessmentPayload = z.infer<typeof ModelFitAssessmentPayloadSchema>;
export type ProposedExpectationFitAssessment = z.infer<typeof ProposedExpectationFitAssessmentSchema>;
export type FitAssessmentProposal = z.infer<typeof FitAssessmentProposalSchema>;
export type FitAssessmentProposalManifest = z.infer<typeof FitAssessmentProposalManifestSchema>;
export type FitAssessmentValidationIssue = z.infer<typeof FitAssessmentValidationIssueSchema>;
export type EditedExpectationFitAssessment = z.infer<typeof EditedExpectationFitAssessmentSchema>;
export type FitAssessmentProposalReview = z.infer<typeof FitAssessmentProposalReviewSchema>;
export type FitAssessmentReviewDecision = z.infer<typeof FitAssessmentReviewDecisionSchema>;
export type FitAssessmentSummaryReviewDecision = z.infer<typeof FitAssessmentSummaryReviewDecisionSchema>;
export type FitAssessmentReviewManifest = z.infer<typeof FitAssessmentReviewManifestSchema>;
