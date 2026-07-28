import { z } from "zod";
import { JobResumeDraftItemTypeSchema } from "./job-resume-draft-schemas.js";
import { JobResumeSectionTypeSchema } from "./job-resume-plan-schemas.js";
import {
  RoleResumeDateFormatSchema,
  RoleResumeExportFormatSchema,
  RoleResumeExportValidationSummarySchema,
  RoleResumePageSizeSchema,
  RoleResumeRenderBlockTypeSchema,
  RoleResumeRenderProfileNameSchema,
  RoleResumeRenderProfileSchema,
} from "./role-resume-render-schemas.js";

const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const RelativePathSchema = z.string().min(1).refine(
  (value) =>
    !value.startsWith("/")
    && !/^[A-Za-z]:[\\/]/.test(value)
    && !value.split(/[\\/]/).includes(".."),
  "Path must be a safe workspace-relative path",
);

export const JobResumeRenderingModeSchema = z.literal("job-specific-resume");

export const JobResumeApprovedDraftDependencySchema = z.object({
  id: z.string().min(1),
  path: RelativePathSchema,
  sha256: Sha256Schema,
  manifestPath: RelativePathSchema,
  manifestSha256: Sha256Schema,
}).strict();

export const JobResumeRenderBlockSchema = z.object({
  id: z.string().min(1),
  sectionId: z.string().min(1),
  draftItemId: z.string().min(1),
  draftItemType: JobResumeDraftItemTypeSchema,
  type: RoleResumeRenderBlockTypeSchema,
  order: z.number().int().nonnegative(),
  text: z.string().min(1),
  trustState: z.enum(["human-approved", "human-edited"]),
  keepWithNext: z.boolean(),
  avoidBreakInside: z.boolean(),
}).strict();

export const JobResumeRenderSectionSchema = z.object({
  id: z.string().min(1),
  draftSectionId: z.string().min(1),
  type: JobResumeSectionTypeSchema,
  order: z.number().int().nonnegative(),
  heading: z.string().min(1).nullable(),
  blocks: z.array(JobResumeRenderBlockSchema),
}).strict();

export const JobResumeRenderSourceMapEntrySchema = z.object({
  id: z.string().min(1),
  documentBlockId: z.string().min(1),
  draftSectionId: z.string().min(1),
  draftItemId: z.string().min(1),
  statementId: z.string().min(1),
  visibleTextSha256: Sha256Schema,
  requirementIds: z.array(z.string().min(1)),
  coverageIds: z.array(z.string().min(1)),
  assessmentIds: z.array(z.string().min(1)),
  evidenceMapLinkIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
  claimIds: z.array(z.string().min(1)),
  claimBoundaryIds: z.array(z.string().min(1)),
  metricPermissionIds: z.array(z.string().min(1)),
  approvedDraftSha256: Sha256Schema,
  visibleTextLocation: z.object({
    sectionOrder: z.number().int().nonnegative(),
    itemOrder: z.number().int().nonnegative(),
  }).strict(),
}).strict();

const RenderReferenceSchema = z.object({
  sectionIds: z.array(z.string().min(1)).default([]),
  draftItemIds: z.array(z.string().min(1)).default([]),
  formats: z.array(RoleResumeExportFormatSchema).default([]),
  validationStage: z.enum(["input", "canonical", "format", "visual", "cross-format"]).optional(),
}).strict();

export const JobResumeRenderRiskSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  severity: z.enum(["critical", "high", "medium", "low"]),
  message: z.string().min(1),
  exportId: z.string().min(1).optional(),
  ...RenderReferenceSchema.shape,
}).strict();

export const JobResumeRenderWarningSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  message: z.string().min(1),
  ...RenderReferenceSchema.shape,
}).strict();

export const JobResumeRenderAmbiguitySchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  message: z.string().min(1),
  resolution: z.string().min(1),
  ...RenderReferenceSchema.shape,
}).strict();

export const JobResumeRenderValidationSummarySchema = z.object({
  status: z.enum(["valid", "invalid"]),
  exactTextPreserved: z.boolean(),
  sectionOrderPreserved: z.boolean(),
  itemOrderPreserved: z.boolean(),
  sourceMapComplete: z.boolean(),
  privateMetadataAbsent: z.boolean(),
  risks: z.array(JobResumeRenderRiskSchema),
  warnings: z.array(JobResumeRenderWarningSchema),
  ambiguities: z.array(JobResumeRenderAmbiguitySchema),
}).strict();

export const JobResumeRenderDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  targetId: z.string().min(1),
  targetType: z.literal("job"),
  mode: JobResumeRenderingModeSchema,
  approvedDraft: JobResumeApprovedDraftDependencySchema,
  renderingPolicy: z.object({
    name: z.literal("job-resume-rendering-policy"),
    version: z.literal("1"),
  }).strict(),
  profile: RoleResumeRenderProfileSchema,
  dateFormat: RoleResumeDateFormatSchema,
  metadata: z.object({
    documentTitle: z.string().min(1),
    targetRoleTitle: z.string().min(1),
    candidateName: z.string().min(1).optional(),
    contact: z.object({
      email: z.string().email().optional(),
      phone: z.string().min(1).optional(),
      location: z.string().min(1).optional(),
      website: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
    }).strict().optional(),
    language: z.literal("en"),
    direction: z.literal("ltr"),
    documentType: z.literal("job-resume"),
    generatedBy: z.object({
      system: z.literal("ProofLayer"),
      policyName: z.literal("job-resume-rendering-policy"),
      policyVersion: z.literal("1"),
    }).strict(),
  }).strict(),
  sections: z.array(JobResumeRenderSectionSchema),
  sourceMap: z.array(JobResumeRenderSourceMapEntrySchema),
  validation: JobResumeRenderValidationSummarySchema,
  provenance: z.object({
    approvedDraftSha256: Sha256Schema,
    approvedDraftManifestSha256: Sha256Schema,
    contentPlanSha256: Sha256Schema,
    requirementModelSha256: Sha256Schema,
    evidenceMapSha256: Sha256Schema,
    coverageSha256: Sha256Schema,
    assessmentSha256: Sha256Schema,
    compositionRulesVersion: z.string().min(1),
    normalizedOptionsSha256: Sha256Schema,
  }).strict(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const JobResumeRenderDocumentManifestSchema = z.object({
  schemaVersion: z.literal(1),
  canonicalDocumentId: z.string().min(1),
  targetId: z.string().min(1),
  documentPath: RelativePathSchema,
  documentSha256: Sha256Schema,
  approvedDraftSha256: Sha256Schema,
  approvedDraftManifestSha256: Sha256Schema,
  contentPlanSha256: Sha256Schema,
  requirementModelSha256: Sha256Schema,
  evidenceMapSha256: Sha256Schema,
  coverageSha256: Sha256Schema,
  assessmentSha256: Sha256Schema,
  profileName: RoleResumeRenderProfileNameSchema,
  profileVersion: z.literal("1"),
  policyName: z.literal("job-resume-rendering-policy"),
  policyVersion: z.literal("1"),
  pageSize: RoleResumePageSizeSchema,
  dateFormat: RoleResumeDateFormatSchema,
  compositionRulesVersion: z.string().min(1),
  normalizedOptionsSha256: Sha256Schema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export const JobResumeSourceMapSchema = z.object({
  schemaVersion: z.literal(1),
  canonicalDocumentId: z.string().min(1),
  approvedDraftId: z.string().min(1),
  approvedDraftSha256: Sha256Schema,
  entries: z.array(JobResumeRenderSourceMapEntrySchema),
}).strict();

export const JobResumeExportManifestSchema = z.object({
  schemaVersion: z.literal(1),
  exportId: z.string().min(1),
  targetId: z.string().min(1),
  approvedDraftId: z.string().min(1),
  format: RoleResumeExportFormatSchema,
  rendererName: z.string().min(1),
  rendererVersion: z.string().min(1),
  outputPath: RelativePathSchema,
  outputSha256: Sha256Schema,
  outputSizeBytes: z.number().int().positive(),
  canonicalDocumentId: z.string().min(1),
  canonicalDocumentPath: RelativePathSchema,
  canonicalDocumentSha256: Sha256Schema,
  profile: z.object({
    name: RoleResumeRenderProfileNameSchema,
    version: z.literal("1"),
  }).strict(),
  renderingPolicy: z.object({
    name: z.literal("job-resume-rendering-policy"),
    version: z.literal("1"),
  }).strict(),
  pageSize: RoleResumePageSizeSchema,
  dateFormat: RoleResumeDateFormatSchema,
  sourceMapPath: RelativePathSchema,
  sourceMapSha256: Sha256Schema,
  validation: RoleResumeExportValidationSummarySchema,
  dependencies: z.object({
    approvedDraftSha256: Sha256Schema,
    approvedDraftManifestSha256: Sha256Schema,
    contentPlanSha256: Sha256Schema,
    requirementModelSha256: Sha256Schema,
    evidenceMapSha256: Sha256Schema,
    coverageSha256: Sha256Schema,
    assessmentSha256: Sha256Schema,
  }).strict(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export type JobResumeRenderDocument = z.infer<typeof JobResumeRenderDocumentSchema>;
export type JobResumeRenderDocumentManifest = z.infer<typeof JobResumeRenderDocumentManifestSchema>;
export type JobResumeRenderSection = z.infer<typeof JobResumeRenderSectionSchema>;
export type JobResumeRenderBlock = z.infer<typeof JobResumeRenderBlockSchema>;
export type JobResumeRenderSourceMapEntry = z.infer<typeof JobResumeRenderSourceMapEntrySchema>;
export type JobResumeSourceMap = z.infer<typeof JobResumeSourceMapSchema>;
export type JobResumeExportManifest = z.infer<typeof JobResumeExportManifestSchema>;
