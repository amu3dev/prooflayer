import { z } from "zod";
import { RoleResumeDraftItemTypeSchema } from "./role-resume-draft-schemas.js";
import {
  PlanDependencySchema,
  ResumeContentTypeSchema,
  RoleResumeSectionTypeSchema,
} from "./role-resume-plan-schemas.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const RelativePathSchema = z.string().min(1).refine(
  (value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value) && !value.split(/[\\/]/).includes(".."),
  "Path must be a safe workspace-relative path",
);

export const RoleResumeCompositionPolicySchema = z.object({
  name: z.literal("role-resume-composition-policy"),
  version: z.literal("1"),
}).strict();

export const RoleResumeCompositionIdentitySchema = z.object({
  name: z.string().min(1).optional(),
  contactItems: z.array(z.string().min(1)),
  source: z.enum(["public-profile", "unavailable"]),
}).strict();

export const RoleResumeCompositionEntrySchema = z.object({
  id: z.string().min(1),
  sourceType: z.enum(["role", "project"]),
  sourceIndex: z.number().int().nonnegative(),
  label: z.string().min(1),
  title: z.string().min(1).optional(),
  organization: z.string().min(1).optional(),
  dateRange: z.string().min(1).optional(),
  technologies: z.array(z.string().min(1)),
  domains: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
  selectedEvidenceIds: z.array(z.string().min(1)),
  decision: z.enum(["include", "exclude"]),
  rationale: z.string().min(1),
  order: z.number().int().nonnegative(),
}).strict();

export const RoleResumeCompositionSkillSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)),
  decision: z.enum(["include", "exclude"]),
  rationale: z.string().min(1),
  order: z.number().int().nonnegative(),
}).strict();

export const RoleResumeCompositionSlotSchema = z.object({
  id: z.string().min(1),
  sectionType: RoleResumeSectionTypeSchema,
  itemType: RoleResumeDraftItemTypeSchema,
  mode: z.enum(["fixed", "provider-worded"]),
  required: z.boolean(),
  order: z.number().int().nonnegative(),
  exactText: z.string().min(1).optional(),
  careerEntryId: z.string().min(1).optional(),
  sourceLabel: z.string().min(1),
  sourceExpectationIds: z.array(z.string().min(1)),
  sourceAssessmentIds: z.array(z.string().min(1)),
  approvedMatchIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
  claimBoundaryIds: z.array(z.string().min(1)),
  claimTypes: z.array(ResumeContentTypeSchema),
  qualifiers: z.array(z.string().min(1)),
  rationale: z.string().min(1),
}).strict().superRefine((slot, context) => {
  if (slot.mode === "fixed" && !slot.exactText) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Fixed composition slots require exact text." });
  }
  if (slot.mode === "provider-worded" && !slot.evidenceIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Provider-worded composition slots require approved evidence." });
  }
});

export const RoleResumeCompositionSectionSchema = z.object({
  id: z.string().min(1),
  planSectionId: z.string().min(1),
  type: RoleResumeSectionTypeSchema,
  status: z.enum(["include", "optional", "exclude"]),
  order: z.number().int().nonnegative(),
  objective: z.string().min(1),
  slotIds: z.array(z.string().min(1)),
  requiredSlotIds: z.array(z.string().min(1)),
}).strict();

export const RoleResumeCompositionExclusionSchema = z.object({
  id: z.string().min(1),
  subjectType: z.enum(["role", "project", "skill", "evidence", "section"]),
  subjectId: z.string().min(1),
  label: z.string().min(1),
  reason: z.string().min(1),
}).strict();

export const RoleResumeCompositionCompletenessSchema = z.object({
  status: z.enum(["complete", "constrained-but-usable", "incomplete", "blocked"]),
  usableForDrafting: z.boolean(),
  matureCareerTwin: z.boolean(),
  identityPresent: z.boolean(),
  headlinePlanned: z.boolean(),
  summaryPlanned: z.boolean(),
  capabilityThemeCount: z.number().int().nonnegative(),
  includedExperienceCount: z.number().int().nonnegative(),
  includedProjectCount: z.number().int().nonnegative(),
  includedSkillCount: z.number().int().nonnegative(),
  evidenceBackedBulletSlotCount: z.number().int().nonnegative(),
  selectedEvidenceCount: z.number().int().nonnegative(),
  accountedSelectedEvidenceCount: z.number().int().nonnegative(),
  careerEntriesAccounted: z.boolean(),
  selectedEvidenceAccounted: z.boolean(),
  blockingReasons: z.array(z.string().min(1)),
  warnings: z.array(z.string().min(1)),
}).strict();

export const RoleResumeCompositionSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  targetId: z.string().min(1),
  targetType: z.literal("role"),
  mode: z.literal("market-positioning"),
  roleTitle: z.string().min(1),
  policy: RoleResumeCompositionPolicySchema,
  approvedPlan: PlanDependencySchema,
  identity: RoleResumeCompositionIdentitySchema,
  experienceEntries: z.array(RoleResumeCompositionEntrySchema),
  projectEntries: z.array(RoleResumeCompositionEntrySchema),
  skills: z.array(RoleResumeCompositionSkillSchema),
  sections: z.array(RoleResumeCompositionSectionSchema),
  slots: z.array(RoleResumeCompositionSlotSchema),
  exclusions: z.array(RoleResumeCompositionExclusionSchema),
  completeness: RoleResumeCompositionCompletenessSchema,
  provenance: z.object({
    targetSha256: Sha256Schema,
    approvedPlanSha256: Sha256Schema,
    approvedPlanManifestSha256: Sha256Schema,
    approvedInterpretationSha256: Sha256Schema,
    approvedMatchingSha256: Sha256Schema,
    approvedAssessmentSha256: Sha256Schema,
    evidenceSnapshotSha256: Sha256Schema,
    careerProfilePath: RelativePathSchema,
    careerProfileSha256: Sha256Schema,
    publicProfilePath: RelativePathSchema,
    publicProfileSha256: Sha256Schema,
    eligibleEvidenceSetSha256: Sha256Schema,
    selectedEvidenceSetSha256: Sha256Schema,
  }).strict(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const RoleResumeCompositionManifestSchema = z.object({
  schemaVersion: z.literal(1),
  compositionId: z.string().min(1),
  targetId: z.string().min(1),
  compositionPath: RelativePathSchema,
  compositionSha256: Sha256Schema,
  policyName: z.literal("role-resume-composition-policy"),
  policyVersion: z.literal("1"),
  targetSha256: Sha256Schema,
  approvedPlanSha256: Sha256Schema,
  approvedPlanManifestSha256: Sha256Schema,
  evidenceSnapshotSha256: Sha256Schema,
  careerProfileSha256: Sha256Schema,
  publicProfileSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export type RoleResumeComposition = z.infer<typeof RoleResumeCompositionSchema>;
export type RoleResumeCompositionManifest = z.infer<typeof RoleResumeCompositionManifestSchema>;
export type RoleResumeCompositionSlot = z.infer<typeof RoleResumeCompositionSlotSchema>;
export type RoleResumeCompositionCompleteness = z.infer<typeof RoleResumeCompositionCompletenessSchema>;
