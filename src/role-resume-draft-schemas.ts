import { z } from "zod";
import { ModelGenerationSettingsSchema } from "./schemas.js";
import {
  PlanDependencySchema,
  ResumeContentTypeSchema,
  RoleResumeSectionTypeSchema,
} from "./role-resume-plan-schemas.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const RelativePathSchema = z.string().min(1).refine(
  (value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value),
  "Path must be relative to the workspace",
);
const ReferenceIds = {
  sourceExpectationIds: z.array(z.string().min(1)),
  sourceAssessmentIds: z.array(z.string().min(1)),
  approvedMatchIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
  claimBoundaryIds: z.array(z.string().min(1)),
};

export const RoleResumeDraftingModeSchema = z.literal("market-positioning");
export const RoleResumeDraftTrustStateSchema = z.enum([
  "model-proposed",
  "deterministic-proposed",
  "deterministic-approved",
  "human-approved",
  "human-edited",
]);
export const RoleResumeDraftItemTypeSchema = z.enum([
  "headline",
  "summary",
  "capability",
  "impact",
  "experience-role",
  "experience-bullet",
  "project",
  "technology",
  "leadership-capability",
  "education",
  "certification",
  "additional-information",
]);
export const ResumeDraftValidationIssueSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  severity: z.enum(["critical", "high", "medium", "low"]),
  sectionIds: z.array(z.string().min(1)).default([]),
  draftItemIds: z.array(z.string().min(1)).default([]),
  expectationIds: z.array(z.string().min(1)).default([]),
  matchIds: z.array(z.string().min(1)).default([]),
  evidenceIds: z.array(z.string().min(1)).default([]),
  claimBoundaryIds: z.array(z.string().min(1)).default([]),
}).strict();
export const RoleResumeDraftItemValidationSchema = z.object({
  status: z.enum(["valid", "invalid", "requires-review"]),
  issues: z.array(ResumeDraftValidationIssueSchema),
}).strict();
export const ResumeMetricReferenceSchema = z.object({
  evidenceId: z.string().min(1),
  sourcePath: RelativePathSchema.optional(),
  originalValue: z.string().min(1),
  normalizedValue: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  temporalContext: z.string().min(1).optional(),
  attributionScope: z.string().min(1).optional(),
  reviewStatus: z.literal("reviewed"),
}).strict();
export const ResumeScopeReferenceSchema = z.object({
  type: z.enum(["role", "team", "product", "technical", "temporal", "project"]),
  value: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)),
  status: z.enum(["approved", "qualified"]),
}).strict();
export const RoleResumeDraftItemProvenanceSchema = z.object({
  targetId: z.string().min(1),
  approvedPlanId: z.string().min(1),
  planSectionId: z.string().min(1),
  proposalId: z.string().min(1).optional(),
  draftingPolicy: z.object({ name: z.string().min(1), version: z.string().min(1) }).strict(),
  artifactHashes: z.object({
    approvedInterpretationSha256: Sha256Schema,
    approvedMatchingSha256: Sha256Schema,
    approvedAssessmentSha256: Sha256Schema,
    approvedPlanSha256: Sha256Schema,
    scaffoldSha256: Sha256Schema,
  }).strict(),
  model: z.object({
    provider: z.string().min(1),
    model: z.string().min(1),
    promptTemplateId: z.string().min(1),
    promptTemplateVersion: z.string().min(1),
  }).strict().optional(),
  reviewDecision: z.object({
    decision: z.enum(["accept", "edit"]),
    reviewer: z.object({ type: z.literal("human"), name: z.string().min(1).optional() }).strict(),
  }).strict().optional(),
}).strict();
export const RoleResumeDraftItemSchema = z.object({
  id: z.string().min(1),
  sectionId: z.string().min(1),
  itemType: RoleResumeDraftItemTypeSchema,
  text: z.string().min(1),
  ...ReferenceIds,
  claimTypes: z.array(ResumeContentTypeSchema),
  metricReferences: z.array(ResumeMetricReferenceSchema),
  scopeReferences: z.array(ResumeScopeReferenceSchema),
  qualifiers: z.array(z.string().min(1)),
  trustState: RoleResumeDraftTrustStateSchema,
  validation: RoleResumeDraftItemValidationSchema,
  provenance: RoleResumeDraftItemProvenanceSchema,
}).strict();
export const RoleResumeDraftSectionProvenanceSchema = z.object({
  targetId: z.string().min(1),
  approvedPlanId: z.string().min(1),
  planSectionId: z.string().min(1),
  approvedPlanSha256: Sha256Schema,
  draftingPolicy: z.object({ name: z.string().min(1), version: z.string().min(1) }).strict(),
}).strict();
export const RoleResumeDraftSectionSchema = z.object({
  id: z.string().min(1),
  planSectionId: z.string().min(1),
  type: RoleResumeSectionTypeSchema,
  order: z.number().int().nonnegative(),
  status: z.enum(["drafted", "empty", "excluded", "requires-review"]),
  objective: z.string().min(1),
  items: z.array(RoleResumeDraftItemSchema),
  provenance: RoleResumeDraftSectionProvenanceSchema,
}).strict();

export const RoleResumeDraftScaffoldSectionSchema = z.object({
  id: z.string().min(1),
  planSectionId: z.string().min(1),
  sectionType: RoleResumeSectionTypeSchema,
  status: z.enum(["include", "optional", "exclude"]),
  order: z.number().int().nonnegative(),
  objective: z.string().min(1),
  allowedExpectationIds: z.array(z.string().min(1)),
  allowedAssessmentIds: z.array(z.string().min(1)),
  allowedMatchIds: z.array(z.string().min(1)),
  allowedEvidenceIds: z.array(z.string().min(1)),
  allowedClaimBoundaryIds: z.array(z.string().min(1)),
  allowedClaimTypes: z.array(ResumeContentTypeSchema),
  prohibitedClaimTypes: z.array(ResumeContentTypeSchema),
  maximumItemCount: z.number().int().positive(),
  maximumSentenceCount: z.number().int().positive().optional(),
  metricPermission: z.enum(["reviewed-only", "prohibited"]),
  scopePermissions: z.array(z.string().min(1)),
  cautionNotes: z.array(z.string().min(1)),
  prohibitedInferences: z.array(z.string().min(1)),
  requiredQualifiers: z.array(z.string().min(1)),
  placeholderIds: z.array(z.string().min(1)),
}).strict();
export const ResumeDraftingConstraintSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  description: z.string().min(1),
  sectionIds: z.array(z.string().min(1)),
  blocking: z.boolean(),
}).strict();
export const RoleResumeDraftScaffoldProvenanceSchema = z.object({
  targetSha256: Sha256Schema,
  approvedInterpretationSha256: Sha256Schema,
  approvedInterpretationManifestSha256: Sha256Schema,
  approvedMatchingSha256: Sha256Schema,
  approvedMatchingManifestSha256: Sha256Schema,
  evidenceSnapshotSha256: Sha256Schema,
  approvedAssessmentSha256: Sha256Schema,
  approvedAssessmentManifestSha256: Sha256Schema,
  approvedPlanSha256: Sha256Schema,
  approvedPlanManifestSha256: Sha256Schema,
  expectationSetSha256: Sha256Schema,
  assessmentSetSha256: Sha256Schema,
  approvedMatchSetSha256: Sha256Schema,
  evidenceSetSha256: Sha256Schema,
}).strict();
export const RoleResumeDraftScaffoldSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  targetId: z.string().min(1),
  targetType: z.literal("role"),
  mode: RoleResumeDraftingModeSchema,
  roleTitle: z.string().min(1),
  approvedInterpretation: PlanDependencySchema,
  approvedMatching: PlanDependencySchema,
  approvedAssessment: PlanDependencySchema,
  approvedPlan: PlanDependencySchema,
  draftingPolicy: z.object({ name: z.string().min(1), version: z.string().min(1) }).strict(),
  sections: z.array(RoleResumeDraftScaffoldSectionSchema),
  draftingConstraints: z.array(ResumeDraftingConstraintSchema),
  provenance: RoleResumeDraftScaffoldProvenanceSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();
export const RoleResumeDraftScaffoldManifestSchema = z.object({
  schemaVersion: z.literal(1),
  scaffoldId: z.string().min(1),
  targetId: z.string().min(1),
  scaffoldPath: RelativePathSchema,
  scaffoldSha256: Sha256Schema,
  policyName: z.string().min(1),
  policyVersion: z.string().min(1),
  targetSha256: Sha256Schema,
  approvedInterpretationSha256: Sha256Schema,
  approvedInterpretationManifestSha256: Sha256Schema,
  approvedMatchingSha256: Sha256Schema,
  approvedMatchingManifestSha256: Sha256Schema,
  evidenceSnapshotSha256: Sha256Schema,
  approvedAssessmentSha256: Sha256Schema,
  approvedAssessmentManifestSha256: Sha256Schema,
  approvedPlanSha256: Sha256Schema,
  approvedPlanManifestSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const ResumeDraftClaimLedgerEntrySchema = z.object({
  id: z.string().min(1),
  draftItemId: z.string().min(1),
  statementTextSha256: Sha256Schema,
  claimTypes: z.array(ResumeContentTypeSchema),
  expectationIds: z.array(z.string().min(1)),
  assessmentIds: z.array(z.string().min(1)),
  approvedMatchIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
  claimBoundaryIds: z.array(z.string().min(1)),
  supportLevel: z.enum(["direct", "corroborated", "qualified", "contextual"]),
  metricStatus: z.enum(["not-applicable", "reviewed-metric-used", "metric-prohibited"]),
  scopeStatus: z.enum(["within-approved-scope", "qualified-scope", "requires-review"]),
  validationStatus: z.enum(["valid", "invalid", "requires-review"]),
  validationIssues: z.array(ResumeDraftValidationIssueSchema),
}).strict();
export const ResumeDraftEvidenceUsageSchema = z.object({
  evidenceId: z.string().min(1),
  draftItemIds: z.array(z.string().min(1)),
  sectionIds: z.array(z.string().min(1)),
  claimTypes: z.array(ResumeContentTypeSchema),
  usageCount: z.number().int().nonnegative(),
  status: z.enum(["within-policy", "overused", "unused-selected-evidence", "prohibited-use"]),
  notes: z.array(z.string().min(1)),
}).strict();
export const ResumeDraftExclusionSchema = z.object({
  id: z.string().min(1),
  sourceExclusionId: z.string().min(1),
  reason: z.string().min(1),
  expectationIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
}).strict();
const RiskReferences = {
  sectionIds: z.array(z.string().min(1)),
  draftItemIds: z.array(z.string().min(1)),
  expectationIds: z.array(z.string().min(1)),
  matchIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
  claimBoundaryIds: z.array(z.string().min(1)),
};
export const ResumeDraftRiskSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  severity: z.enum(["critical", "high", "medium", "low"]),
  message: z.string().min(1),
  ...RiskReferences,
}).strict();
export const ResumeDraftWarningSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  message: z.string().min(1),
  ...RiskReferences,
}).strict();
export const ResumeDraftAmbiguitySchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  message: z.string().min(1),
  resolved: z.boolean(),
  resolutionRationale: z.string().min(1).optional(),
  ...RiskReferences,
}).strict();
export const RoleResumeDraftCompletenessSchema = z.object({
  status: z.enum(["empty", "partial", "complete"]),
  requiredSectionCount: z.number().int().nonnegative(),
  completedRequiredSectionCount: z.number().int().nonnegative(),
  optionalSectionCount: z.number().int().nonnegative(),
  completedOptionalSectionCount: z.number().int().nonnegative(),
  draftItemCount: z.number().int().nonnegative(),
  validatedDraftItemCount: z.number().int().nonnegative(),
  claimLedgerComplete: z.boolean(),
  provenanceComplete: z.boolean(),
  unresolvedCriticalIssueCount: z.number().int().nonnegative(),
  unresolvedAmbiguityCount: z.number().int().nonnegative(),
  usableForRendering: z.boolean(),
  blockingReasons: z.array(z.string().min(1)),
}).strict();
export const RoleResumeDraftProvenanceSchema = z.object({
  targetSha256: Sha256Schema,
  approvedInterpretationSha256: Sha256Schema,
  approvedInterpretationManifestSha256: Sha256Schema,
  approvedMatchingSha256: Sha256Schema,
  approvedMatchingManifestSha256: Sha256Schema,
  evidenceSnapshotSha256: Sha256Schema,
  approvedAssessmentSha256: Sha256Schema,
  approvedAssessmentManifestSha256: Sha256Schema,
  approvedPlanSha256: Sha256Schema,
  approvedPlanManifestSha256: Sha256Schema,
  scaffoldSha256: Sha256Schema,
  proposalSha256: Sha256Schema,
  reviewSha256: Sha256Schema,
}).strict();

export const ModelRoleResumeDraftPayloadSchema = z.object({
  sections: z.array(RoleResumeDraftSectionSchema),
  warnings: z.array(ResumeDraftWarningSchema).default([]),
  ambiguities: z.array(ResumeDraftAmbiguitySchema).default([]),
}).strict();
export const RoleResumeDraftProposalSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  requestFingerprint: Sha256Schema,
  targetId: z.string().min(1),
  targetType: z.literal("role"),
  mode: RoleResumeDraftingModeSchema,
  status: z.enum(["generated", "validation-failed", "ready-for-review", "reviewed"]),
  draftingPolicy: z.object({ name: z.string().min(1), version: z.string().min(1) }).strict(),
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
    approvedAssessmentSha256: Sha256Schema,
    approvedPlanSha256: Sha256Schema,
    draftScaffoldSha256: Sha256Schema,
    normalizedModelInputSha256: Sha256Schema,
  }).strict(),
  sections: z.array(RoleResumeDraftSectionSchema),
  claimLedger: z.array(ResumeDraftClaimLedgerEntrySchema),
  evidenceUsage: z.array(ResumeDraftEvidenceUsageSchema),
  warnings: z.array(ResumeDraftWarningSchema),
  ambiguities: z.array(ResumeDraftAmbiguitySchema),
  validationIssues: z.array(ResumeDraftValidationIssueSchema),
  rawResponsePath: RelativePathSchema,
  rawResponseSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();
export const RoleResumeDraftProposalManifestSchema = z.object({
  schemaVersion: z.literal(1),
  proposalId: z.string().min(1),
  requestFingerprint: Sha256Schema,
  targetId: z.string().min(1),
  proposalPath: RelativePathSchema,
  proposalSha256: Sha256Schema,
  rawResponsePath: RelativePathSchema,
  rawResponseSha256: Sha256Schema,
  provider: z.string().min(1),
  model: z.string().min(1),
  promptTemplateId: z.string().min(1),
  promptTemplateVersion: z.string().min(1),
  policyVersion: z.string().min(1),
  renderedPromptSha256: Sha256Schema,
  normalizedModelInputSha256: Sha256Schema,
  targetSha256: Sha256Schema,
  approvedInterpretationSha256: Sha256Schema,
  approvedMatchingSha256: Sha256Schema,
  evidenceSnapshotSha256: Sha256Schema,
  approvedAssessmentSha256: Sha256Schema,
  approvedPlanSha256: Sha256Schema,
  draftScaffoldSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();
export const RoleResumeDraftReviewDecisionSchema = z.object({
  itemType: z.enum(["section", "draft-item", "claim-ledger", "section-order", "ambiguity"]),
  itemId: z.string().min(1),
  decision: z.enum(["pending", "accept", "edit", "reject"]),
  editedValue: z.unknown().optional(),
  reviewNote: z.string().min(1).optional(),
  decidedAt: z.string().datetime().optional(),
}).strict();
export const RoleResumeDraftReviewSchema = z.object({
  schemaVersion: z.literal(1),
  proposalId: z.string().min(1),
  targetId: z.string().min(1),
  status: z.enum(["in-progress", "completed"]),
  decisions: z.array(RoleResumeDraftReviewDecisionSchema),
  reviewer: z.object({ type: z.literal("human"), name: z.string().min(1).optional() }).strict(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();
export const RoleResumeDraftReviewManifestSchema = z.object({
  schemaVersion: z.literal(1),
  proposalId: z.string().min(1),
  targetId: z.string().min(1),
  reviewPath: RelativePathSchema,
  reviewSha256: Sha256Schema,
  proposalSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const ApprovedRoleResumeDraftSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  targetId: z.string().min(1),
  targetType: z.literal("role"),
  mode: RoleResumeDraftingModeSchema,
  roleTitle: z.string().min(1),
  approvedInterpretation: PlanDependencySchema,
  approvedMatching: PlanDependencySchema,
  approvedAssessment: PlanDependencySchema,
  approvedPlan: PlanDependencySchema,
  draftingPolicy: z.object({ name: z.string().min(1), version: z.string().min(1) }).strict(),
  sections: z.array(RoleResumeDraftSectionSchema),
  claimLedger: z.array(ResumeDraftClaimLedgerEntrySchema),
  evidenceUsage: z.array(ResumeDraftEvidenceUsageSchema),
  exclusions: z.array(ResumeDraftExclusionSchema),
  risks: z.array(ResumeDraftRiskSchema),
  warnings: z.array(ResumeDraftWarningSchema),
  ambiguities: z.array(ResumeDraftAmbiguitySchema),
  completeness: RoleResumeDraftCompletenessSchema,
  provenance: RoleResumeDraftProvenanceSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();
export const ApprovedRoleResumeDraftManifestSchema = z.object({
  schemaVersion: z.literal(1),
  draftId: z.string().min(1),
  targetId: z.string().min(1),
  draftPath: RelativePathSchema,
  draftSha256: Sha256Schema,
  policyName: z.string().min(1),
  policyVersion: z.string().min(1),
  targetSha256: Sha256Schema,
  approvedInterpretationSha256: Sha256Schema,
  approvedMatchingSha256: Sha256Schema,
  evidenceSnapshotSha256: Sha256Schema,
  approvedAssessmentSha256: Sha256Schema,
  approvedPlanSha256: Sha256Schema,
  scaffoldSha256: Sha256Schema,
  proposalId: z.string().min(1),
  proposalSha256: Sha256Schema,
  reviewSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export type RoleResumeDraftItemType = z.infer<typeof RoleResumeDraftItemTypeSchema>;
export type ResumeDraftValidationIssue = z.infer<typeof ResumeDraftValidationIssueSchema>;
export type RoleResumeDraftItem = z.infer<typeof RoleResumeDraftItemSchema>;
export type RoleResumeDraftSection = z.infer<typeof RoleResumeDraftSectionSchema>;
export type RoleResumeDraftScaffoldSection = z.infer<typeof RoleResumeDraftScaffoldSectionSchema>;
export type RoleResumeDraftScaffold = z.infer<typeof RoleResumeDraftScaffoldSchema>;
export type RoleResumeDraftScaffoldManifest = z.infer<typeof RoleResumeDraftScaffoldManifestSchema>;
export type ResumeDraftClaimLedgerEntry = z.infer<typeof ResumeDraftClaimLedgerEntrySchema>;
export type ResumeDraftEvidenceUsage = z.infer<typeof ResumeDraftEvidenceUsageSchema>;
export type ResumeDraftExclusion = z.infer<typeof ResumeDraftExclusionSchema>;
export type ResumeDraftRisk = z.infer<typeof ResumeDraftRiskSchema>;
export type ResumeDraftWarning = z.infer<typeof ResumeDraftWarningSchema>;
export type ResumeDraftAmbiguity = z.infer<typeof ResumeDraftAmbiguitySchema>;
export type RoleResumeDraftCompleteness = z.infer<typeof RoleResumeDraftCompletenessSchema>;
export type ModelRoleResumeDraftPayload = z.infer<typeof ModelRoleResumeDraftPayloadSchema>;
export type RoleResumeDraftProposal = z.infer<typeof RoleResumeDraftProposalSchema>;
export type RoleResumeDraftProposalManifest = z.infer<typeof RoleResumeDraftProposalManifestSchema>;
export type RoleResumeDraftReviewDecision = z.infer<typeof RoleResumeDraftReviewDecisionSchema>;
export type RoleResumeDraftReview = z.infer<typeof RoleResumeDraftReviewSchema>;
export type ApprovedRoleResumeDraft = z.infer<typeof ApprovedRoleResumeDraftSchema>;
