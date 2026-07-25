import { z } from "zod";
import { RoleResumeDraftItemTypeSchema, } from "./role-resume-draft-schemas.js";
import { RoleResumeSectionTypeSchema } from "./role-resume-plan-schemas.js";
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const RelativePathSchema = z.string().min(1).refine((value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value) && !value.split(/[\\/]/).includes(".."), "Path must be a safe workspace-relative path");
const RenderReferenceSchema = z.object({
    sectionIds: z.array(z.string().min(1)).default([]),
    draftItemIds: z.array(z.string().min(1)).default([]),
    formats: z.array(z.enum(["markdown", "html", "docx", "pdf"])).default([]),
    validationStage: z.enum(["input", "canonical", "format", "visual", "cross-format"]).optional(),
}).strict();
export const RoleResumeRenderingModeSchema = z.literal("market-positioning");
export const RoleResumeExportFormatSchema = z.enum(["markdown", "html", "docx", "pdf"]);
export const RoleResumeRenderProfileNameSchema = z.enum(["ats-standard", "compact-professional"]);
export const RoleResumePageSizeSchema = z.enum(["A4", "LETTER"]);
export const RoleResumeDateFormatSchema = z.enum(["MMM-YYYY", "YYYY", "exact-source"]);
export const RoleResumeRenderBlockTypeSchema = z.enum([
    "headline",
    "paragraph",
    "bullet",
    "role-header",
    "project-header",
    "capability",
    "technology",
    "leadership-capability",
    "education",
    "certification",
    "additional-information",
]);
export const RoleResumePageBreakRuleSchema = z.object({
    blockType: RoleResumeRenderBlockTypeSchema,
    keepWithNext: z.boolean(),
    avoidBreakInside: z.boolean(),
}).strict();
export const RoleResumeAccessibilitySettingsSchema = z.object({
    language: z.literal("en"),
    direction: z.literal("ltr"),
    logicalHeadingHierarchy: z.literal(true),
    semanticLists: z.literal(true),
    visibleLinkText: z.literal(true),
    colorOnlyMeaning: z.literal(false),
    iconsRequiredForMeaning: z.literal(false),
    singleColumnReadingOrder: z.literal(true),
    formalCertificationClaimed: z.literal(false),
}).strict();
export const RoleResumeRenderProfileSchema = z.object({
    schemaVersion: z.literal(1),
    name: RoleResumeRenderProfileNameSchema,
    version: z.literal("1"),
    page: z.object({
        size: RoleResumePageSizeSchema,
        marginTopMm: z.number().positive(),
        marginRightMm: z.number().positive(),
        marginBottomMm: z.number().positive(),
        marginLeftMm: z.number().positive(),
    }).strict(),
    typography: z.object({
        baseFontFamily: z.string().min(1),
        baseFontSizePt: z.number().min(10),
        minimumFontSizePt: z.number().min(10),
        headingScale: z.number().min(1),
        lineHeight: z.number().min(1.2),
    }).strict(),
    spacing: z.object({
        sectionBeforePt: z.number().nonnegative(),
        sectionAfterPt: z.number().nonnegative(),
        itemSpacingPt: z.number().nonnegative(),
    }).strict(),
    layout: z.object({
        columns: z.literal(1),
        useTablesForCoreContent: z.literal(false),
        showSectionDividers: z.boolean(),
    }).strict(),
    pageBreakRules: z.array(RoleResumePageBreakRuleSchema),
    accessibility: RoleResumeAccessibilitySettingsSchema,
}).strict();
export const RoleResumeApprovedDraftDependencySchema = z.object({
    id: z.string().min(1),
    path: RelativePathSchema,
    sha256: Sha256Schema,
    manifestPath: RelativePathSchema,
    manifestSha256: Sha256Schema,
}).strict();
export const RoleResumeDocumentMetadataSchema = z.object({
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
    documentType: z.literal("role-resume"),
    generatedBy: z.object({
        system: z.literal("ProofLayer"),
        policyName: z.string().min(1),
        policyVersion: z.string().min(1),
    }).strict(),
}).strict();
export const RoleResumeRenderBlockSchema = z.object({
    id: z.string().min(1),
    sectionId: z.string().min(1),
    draftItemId: z.string().min(1),
    draftItemType: RoleResumeDraftItemTypeSchema,
    type: RoleResumeRenderBlockTypeSchema,
    order: z.number().int().nonnegative(),
    text: z.string().min(1),
    trustState: z.enum(["deterministic-approved", "human-approved", "human-edited"]),
    keepWithNext: z.boolean(),
    avoidBreakInside: z.boolean(),
}).strict();
export const RoleResumeRenderSectionSchema = z.object({
    id: z.string().min(1),
    draftSectionId: z.string().min(1),
    type: RoleResumeSectionTypeSchema,
    order: z.number().int().nonnegative(),
    heading: z.string().min(1).nullable(),
    blocks: z.array(RoleResumeRenderBlockSchema),
}).strict();
export const RoleResumeRenderSourceMapEntrySchema = z.object({
    id: z.string().min(1),
    documentBlockId: z.string().min(1),
    sectionId: z.string().min(1),
    draftItemId: z.string().min(1),
    statementTextSha256: Sha256Schema,
    expectationIds: z.array(z.string().min(1)),
    assessmentIds: z.array(z.string().min(1)),
    approvedMatchIds: z.array(z.string().min(1)),
    evidenceIds: z.array(z.string().min(1)),
    claimBoundaryIds: z.array(z.string().min(1)),
    approvedDraftSha256: Sha256Schema,
    visibleTextLocation: z.object({
        sectionOrder: z.number().int().nonnegative(),
        itemOrder: z.number().int().nonnegative(),
    }).strict(),
}).strict();
export const RoleResumeRenderRiskSchema = z.object({
    id: z.string().min(1),
    code: z.string().min(1),
    severity: z.enum(["critical", "high", "medium", "low"]),
    message: z.string().min(1),
    exportId: z.string().min(1).optional(),
    ...RenderReferenceSchema.shape,
}).strict();
export const RoleResumeRenderWarningSchema = z.object({
    id: z.string().min(1),
    code: z.string().min(1),
    message: z.string().min(1),
    ...RenderReferenceSchema.shape,
}).strict();
export const RoleResumeRenderAmbiguitySchema = z.object({
    id: z.string().min(1),
    code: z.string().min(1),
    message: z.string().min(1),
    resolution: z.string().min(1),
    ...RenderReferenceSchema.shape,
}).strict();
export const RoleResumeRenderValidationSummarySchema = z.object({
    status: z.enum(["valid", "invalid"]),
    exactTextPreserved: z.boolean(),
    sectionOrderPreserved: z.boolean(),
    itemOrderPreserved: z.boolean(),
    sourceMapComplete: z.boolean(),
    privateMetadataAbsent: z.boolean(),
    risks: z.array(RoleResumeRenderRiskSchema),
    warnings: z.array(RoleResumeRenderWarningSchema),
    ambiguities: z.array(RoleResumeRenderAmbiguitySchema),
}).strict();
export const RoleResumeRenderProvenanceSchema = z.object({
    approvedDraftSha256: Sha256Schema,
    approvedDraftManifestSha256: Sha256Schema,
    approvedPlanSha256: Sha256Schema,
    compositionRulesVersion: z.string().min(1),
    normalizedOptionsSha256: Sha256Schema,
}).strict();
export const RoleResumeRenderDocumentSchema = z.object({
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    targetId: z.string().min(1),
    targetType: z.literal("role"),
    mode: RoleResumeRenderingModeSchema,
    approvedDraft: RoleResumeApprovedDraftDependencySchema,
    renderingPolicy: z.object({
        name: z.literal("role-resume-rendering-policy"),
        version: z.literal("1"),
    }).strict(),
    profile: RoleResumeRenderProfileSchema,
    dateFormat: RoleResumeDateFormatSchema,
    metadata: RoleResumeDocumentMetadataSchema,
    sections: z.array(RoleResumeRenderSectionSchema),
    sourceMap: z.array(RoleResumeRenderSourceMapEntrySchema),
    validation: RoleResumeRenderValidationSummarySchema,
    provenance: RoleResumeRenderProvenanceSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const RoleResumeRenderDocumentManifestSchema = z.object({
    schemaVersion: z.literal(1),
    canonicalDocumentId: z.string().min(1),
    targetId: z.string().min(1),
    documentPath: RelativePathSchema,
    documentSha256: Sha256Schema,
    approvedDraftSha256: Sha256Schema,
    approvedDraftManifestSha256: Sha256Schema,
    approvedPlanSha256: Sha256Schema,
    profileName: RoleResumeRenderProfileNameSchema,
    profileVersion: z.literal("1"),
    policyName: z.literal("role-resume-rendering-policy"),
    policyVersion: z.literal("1"),
    pageSize: RoleResumePageSizeSchema,
    dateFormat: RoleResumeDateFormatSchema,
    compositionRulesVersion: z.string().min(1),
    normalizedOptionsSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const RoleResumeSourceMapSchema = z.object({
    schemaVersion: z.literal(1),
    canonicalDocumentId: z.string().min(1),
    approvedDraftId: z.string().min(1),
    approvedDraftSha256: Sha256Schema,
    entries: z.array(RoleResumeRenderSourceMapEntrySchema),
}).strict();
export const RoleResumeExportValidationSummarySchema = z.object({
    status: z.enum(["valid", "invalid"]),
    nonEmpty: z.boolean(),
    formatValid: z.boolean(),
    visibleTextEquivalent: z.boolean(),
    normalizedVisibleTextSha256: Sha256Schema,
    sectionOrderPreserved: z.boolean(),
    firstMarkerPresent: z.boolean(),
    lastMarkerPresent: z.boolean(),
    pageCount: z.number().int().positive().optional(),
    pageSizeVerified: z.boolean().optional(),
    textExtractable: z.boolean().optional(),
    binaryDeterministic: z.boolean(),
    risks: z.array(RoleResumeRenderRiskSchema),
    warnings: z.array(RoleResumeRenderWarningSchema),
}).strict();
export const RoleResumeExportManifestSchema = z.object({
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
        name: z.literal("role-resume-rendering-policy"),
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
        approvedPlanSha256: Sha256Schema,
    }).strict(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
