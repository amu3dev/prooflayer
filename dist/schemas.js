import { z } from "zod";
export const VisibilitySchema = z.enum([
    "public",
    "private",
    "generic_only",
    "do_not_use",
    "unknown",
    "sensitive"
]);
export const ConfidenceSchema = z.enum(["high", "medium", "low"]);
export const CorroborationLevelSchema = z.enum([
    "multi_source",
    "single_source",
    "manual_approved",
    "uncorroborated"
]);
export const ApprovalStatusSchema = z.enum(["approved", "needs_confirmation", "blocked"]);
export const OutputReadinessSchema = z.enum([
    "resume_ready",
    "generic_only",
    "internal_only",
    "do_not_use"
]);
export const VariantReviewDecisionValueSchema = z.enum([
    "pending",
    "approve",
    "revise",
    "draft_only",
    "exclude"
]);
export const VariantReviewDecisionSchema = z.object({
    claimId: z.string(),
    decision: VariantReviewDecisionValueSchema,
    approvedPublicWording: z.string().optional(),
    notes: z.string().optional(),
    decidedAt: z.string().optional(),
    decidedBy: z.string().optional(),
    reason: z.string().optional()
});
export const VariantReviewDecisionsSchema = z.object({
    schemaVersion: z.literal(1),
    roleKey: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    profileFingerprint: z.string(),
    sourceGenerationManifest: z.string(),
    decisions: z.array(VariantReviewDecisionSchema)
});
const PublicTextSchema = z.string().trim().min(1);
export const PublicProfileSchema = z.object({
    schemaVersion: z.literal(1),
    publicName: PublicTextSchema.optional(),
    headlineOverride: PublicTextSchema.optional(),
    headlineOverrides: z.record(PublicTextSchema).optional(),
    location: PublicTextSchema.optional(),
    email: z.string().trim().email().optional(),
    website: z.string().trim().url().optional(),
    linkedin: z.string().trim().url().optional(),
    github: z.string().trim().url().optional(),
    publicSummaryOverride: PublicTextSchema.optional(),
    educationWordingOverrides: z.record(PublicTextSchema).optional(),
    certificationWordingOverrides: z.record(PublicTextSchema).optional()
});
const TargetIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Target ID must contain only lowercase letters, numbers, and single hyphens.");
const TargetTextSchema = z.string().trim().min(1);
const TargetTimestampSchema = z.string().datetime();
export const RoleTargetSchema = z.object({
    schemaVersion: z.literal(1),
    id: TargetIdSchema,
    type: z.literal("role"),
    title: TargetTextSchema,
    seniority: TargetTextSchema.optional(),
    domain: TargetTextSchema.optional(),
    location: TargetTextSchema.optional(),
    workingModel: TargetTextSchema.optional(),
    createdAt: TargetTimestampSchema,
    updatedAt: TargetTimestampSchema
});
export const JobTargetSchema = z.object({
    schemaVersion: z.literal(1),
    id: TargetIdSchema,
    type: z.literal("job"),
    title: TargetTextSchema,
    company: TargetTextSchema.optional(),
    location: TargetTextSchema.optional(),
    workingModel: TargetTextSchema.optional(),
    source: z.object({
        type: z.literal("markdown"),
        path: TargetTextSchema,
        sha256: z.string().regex(/^[a-f0-9]{64}$/)
    }),
    rawDescription: z.string().min(1),
    createdAt: TargetTimestampSchema,
    updatedAt: TargetTimestampSchema
});
export const TargetSchema = z.discriminatedUnion("type", [RoleTargetSchema, JobTargetSchema]);
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
export const TargetAnalysisSourceReferenceSchema = z
    .object({
    sourceType: z.enum(["job-description-markdown", "target-json"]),
    path: z.string().min(1),
    sha256: Sha256Schema,
    startLine: z.number().int().positive(),
    endLine: z.number().int().positive(),
    startOffset: z.number().int().nonnegative().optional(),
    endOffset: z.number().int().nonnegative().optional(),
    excerptSha256: Sha256Schema,
})
    .superRefine((reference, context) => {
    if (reference.endLine < reference.startLine) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "endLine must be greater than or equal to startLine",
            path: ["endLine"],
        });
    }
    if (reference.startOffset !== undefined &&
        reference.endOffset !== undefined &&
        reference.endOffset < reference.startOffset) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "endOffset must be greater than or equal to startOffset",
            path: ["endOffset"],
        });
    }
});
export const TargetAnalysisSectionSchema = z
    .object({
    id: z.string().min(1),
    heading: z.string().nullable(),
    headingLevel: z.number().int().min(1).max(3).nullable(),
    normalizedHeading: z.string().nullable(),
    startLine: z.number().int().positive(),
    endLine: z.number().int().positive(),
    sourceReference: TargetAnalysisSourceReferenceSchema,
    classification: z.enum([
        "responsibilities",
        "required",
        "preferred",
        "qualifications",
        "about-role",
        "company",
        "benefits",
        "other",
        "unknown",
    ]),
    classificationBasis: z.enum(["explicit-heading", "none"]),
})
    .superRefine((section, context) => {
    if (section.endLine < section.startLine) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "endLine must be greater than or equal to startLine",
            path: ["endLine"],
        });
    }
});
export const TargetAnalysisItemSchema = z.object({
    id: z.string().min(1),
    sectionId: z.string().nullable(),
    kind: z.enum(["list-item", "paragraph", "front-matter-field"]),
    statement: z.string().min(1),
    rawText: z.string().min(1),
    necessity: z.enum(["required", "preferred", "contextual", "unknown"]),
    category: z.enum([
        "responsibility",
        "qualification",
        "constraint",
        "benefit",
        "company-context",
        "unknown",
    ]),
    extractionMethod: z.enum([
        "explicit-front-matter",
        "explicit-heading",
        "markdown-structure",
    ]),
    sourceReferences: z.array(TargetAnalysisSourceReferenceSchema).min(1),
});
export const TargetAnalysisWarningSchema = z.object({
    code: z.string().min(1),
    message: z.string().min(1),
});
const TargetAnalyzerSchema = z.object({
    name: z.string().min(1),
    version: z.string().min(1),
    mode: z.literal("deterministic"),
});
const TargetAnalysisInputSchema = z.object({
    targetPath: z.string().min(1),
    targetSha256: Sha256Schema,
    sourcePath: z.string().min(1).optional(),
    sourceSha256: Sha256Schema.optional(),
});
const BaseTargetAnalysisFields = {
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    analyzer: TargetAnalyzerSchema,
    input: TargetAnalysisInputSchema,
    sections: z.array(TargetAnalysisSectionSchema),
    items: z.array(TargetAnalysisItemSchema),
    warnings: z.array(TargetAnalysisWarningSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
};
export const RoleTargetAnalysisSchema = z.object({
    ...BaseTargetAnalysisFields,
    input: z.object({
        targetPath: z.string().min(1),
        targetSha256: Sha256Schema,
    }),
    sections: z.array(TargetAnalysisSectionSchema).length(0),
    items: z.array(TargetAnalysisItemSchema).length(0),
    targetType: z.literal("role"),
});
export const JobTargetAnalysisSchema = z.object({
    ...BaseTargetAnalysisFields,
    input: z.object({
        targetPath: z.string().min(1),
        targetSha256: Sha256Schema,
        sourcePath: z.string().min(1),
        sourceSha256: Sha256Schema,
    }),
    targetType: z.literal("job"),
});
export const TargetAnalysisSchema = z.discriminatedUnion("targetType", [
    RoleTargetAnalysisSchema,
    JobTargetAnalysisSchema,
]);
export const TargetAnalysisManifestSchema = z
    .object({
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    analysisPath: z.string().min(1),
    analysisSha256: Sha256Schema,
    analyzerName: z.string().min(1),
    analyzerVersion: z.string().min(1),
    targetSha256: Sha256Schema,
    sourceSha256: Sha256Schema.optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .superRefine((manifest, context) => {
    if (manifest.targetType === "job" && !manifest.sourceSha256) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Job analysis manifests require sourceSha256",
            path: ["sourceSha256"],
        });
    }
    if (manifest.targetType === "role" && manifest.sourceSha256) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Role analysis manifests must not include sourceSha256",
            path: ["sourceSha256"],
        });
    }
});
const RelativeWorkspacePathSchema = z.string().min(1).refine((value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value), "Path must be relative to the workspace");
export const TargetExpectationKindSchema = z.enum([
    "responsibility",
    "capability",
    "experience",
    "technical-skill",
    "leadership",
    "domain-knowledge",
    "business-expectation",
    "success-outcome",
    "constraint",
    "candidate-attribute",
    "qualification",
    "unknown",
]);
export const TargetExpectationNecessitySchema = z.enum([
    "required",
    "preferred",
    "contextual",
    "unknown",
]);
export const TargetExpectationImportanceSchema = z.enum([
    "critical",
    "high",
    "medium",
    "low",
    "unknown",
]);
export const ExpectationGroupKindSchema = z.enum([
    "core-responsibilities",
    "required-qualifications",
    "preferred-qualifications",
    "leadership-expectations",
    "technical-expectations",
    "domain-expectations",
    "business-expectations",
    "success-outcomes",
    "constraints",
    "candidate-attributes",
    "context-dependent",
    "other",
]);
const SlugSafeSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NormalizedCapabilityTagSchema = SlugSafeSchema;
export const RoleProfileExpectationSchema = z
    .object({
    id: SlugSafeSchema,
    kind: TargetExpectationKindSchema,
    statement: z.string().trim().min(1),
    necessity: TargetExpectationNecessitySchema,
    importance: TargetExpectationImportanceSchema,
    capabilityTags: z.array(NormalizedCapabilityTagSchema),
    group: ExpectationGroupKindSchema,
    notes: z.array(z.string().trim().min(1)),
})
    .strict()
    .superRefine((expectation, context) => {
    if (new Set(expectation.capabilityTags).size !== expectation.capabilityTags.length) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Capability tags must be unique",
            path: ["capabilityTags"],
        });
    }
});
export const RoleProfileSchema = z
    .object({
    schemaVersion: z.literal(1),
    id: SlugSafeSchema,
    title: z.string().trim().min(1),
    aliases: z.array(z.string().trim().min(1)),
    seniority: z.string().trim().min(1).nullable().optional(),
    domain: z.string().trim().min(1).nullable().optional(),
    location: z.string().trim().min(1).nullable().optional(),
    workingModel: z.string().trim().min(1).nullable().optional(),
    expectations: z.array(RoleProfileExpectationSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .strict()
    .superRefine((profile, context) => {
    const ids = profile.expectations.map((expectation) => expectation.id);
    if (new Set(ids).size !== ids.length) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Role profile expectation IDs must be unique",
            path: ["expectations"],
        });
    }
});
export const RoleProfileSourceReferenceSchema = z
    .object({
    sourceType: z.literal("role-profile-json"),
    path: RelativeWorkspacePathSchema,
    sha256: Sha256Schema,
    jsonPointer: z.string().regex(/^\/expectations\/\d+$/),
    excerptSha256: Sha256Schema,
})
    .strict();
export const TargetInterpretationSourceReferenceSchema = z.union([
    TargetAnalysisSourceReferenceSchema,
    RoleProfileSourceReferenceSchema,
]);
export const TargetExpectationSchema = z
    .object({
    id: z.string().min(1),
    kind: TargetExpectationKindSchema,
    statement: z.string().min(1),
    necessity: TargetExpectationNecessitySchema,
    importance: TargetExpectationImportanceSchema,
    explicitness: z.enum(["explicit", "strongly-implied", "inferred"]),
    capabilityTags: z.array(NormalizedCapabilityTagSchema),
    sourceAnalysisItemIds: z.array(z.string().min(1)),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema).min(1),
    interpretation: z
        .object({
        method: z.enum([
            "explicit-role-profile",
            "explicit-heading",
            "manual",
            "deterministic-rule",
        ]),
        interpreterName: z.string().min(1),
        interpreterVersion: z.string().min(1),
        policyVersion: z.string().min(1),
    })
        .strict(),
    interpretationConfidence: z.enum(["high", "medium", "low"]),
    notes: z.array(z.string()),
})
    .strict();
export const ExpectationGroupSchema = z
    .object({
    id: z.string().min(1),
    kind: ExpectationGroupKindSchema,
    title: z.string().min(1),
    expectationIds: z.array(z.string().min(1)).min(1),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema).min(1),
})
    .strict();
export const InterpretationAmbiguitySchema = z
    .object({
    id: z.string().min(1),
    code: z.enum([
        "AMBIGUOUS_NECESSITY",
        "AMBIGUOUS_EXPECTATION_KIND",
        "MULTIPLE_PLAUSIBLE_INTERPRETATIONS",
        "INSUFFICIENT_EXPLICIT_STRUCTURE",
        "ROLE_PROFILE_MISSING",
        "UNSUPPORTED_SOURCE_STRUCTURE",
        "OTHER",
    ]),
    message: z.string().min(1),
    sourceAnalysisItemIds: z.array(z.string().min(1)),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema),
    candidateInterpretations: z.array(z.string().min(1)).optional(),
})
    .strict();
export const InterpretationWarningSchema = z
    .object({
    id: z.string().min(1),
    code: z.enum([
        "ROLE_PROFILE_NOT_CONFIGURED",
        "ROLE_PROFILE_TITLE_MISMATCH",
        "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS",
        "PARAGRAPH_NOT_INTERPRETED",
        "UNCLASSIFIED_ITEM_SKIPPED",
        "NO_EXPECTATIONS_PRODUCED",
        "OTHER",
    ]),
    message: z.string().min(1),
    sourceAnalysisItemIds: z.array(z.string().min(1)),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema),
})
    .strict();
export const InterpretationCompletenessSchema = z
    .object({
    status: z.enum(["empty", "partial", "complete"]),
    usableForEvidenceMatching: z.boolean(),
    blockingReasons: z.array(z.string().min(1)),
})
    .strict()
    .superRefine((completeness, context) => {
    if (completeness.status === "empty" && completeness.usableForEvidenceMatching) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "An empty interpretation cannot be usable for evidence matching",
            path: ["usableForEvidenceMatching"],
        });
    }
});
const TargetInterpreterSchema = z
    .object({
    name: z.string().min(1),
    version: z.string().min(1),
    mode: z.enum(["deterministic", "manual"]),
    policyVersion: z.string().min(1),
})
    .strict();
const BaseTargetInterpretationFields = {
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    interpreter: TargetInterpreterSchema,
    expectations: z.array(TargetExpectationSchema),
    groups: z.array(ExpectationGroupSchema),
    ambiguities: z.array(InterpretationAmbiguitySchema),
    warnings: z.array(InterpretationWarningSchema),
    completeness: InterpretationCompletenessSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
};
const BaseInterpretationInputFields = {
    targetPath: RelativeWorkspacePathSchema,
    targetSha256: Sha256Schema,
    structuralAnalysisPath: RelativeWorkspacePathSchema,
    structuralAnalysisSha256: Sha256Schema,
};
export const RoleTargetInterpretationSchema = z.object({
    ...BaseTargetInterpretationFields,
    targetType: z.literal("role"),
    input: z
        .object({
        ...BaseInterpretationInputFields,
        roleProfilePath: RelativeWorkspacePathSchema.optional(),
        roleProfileSha256: Sha256Schema.optional(),
        roleProfileId: SlugSafeSchema.optional(),
    })
        .strict()
        .superRefine((input, context) => {
        const values = [input.roleProfilePath, input.roleProfileSha256, input.roleProfileId];
        const populated = values.filter((value) => value !== undefined).length;
        if (populated !== 0 && populated !== values.length) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Role profile path, hash, and ID must be supplied together",
            });
        }
    }),
});
export const JobTargetInterpretationSchema = z.object({
    ...BaseTargetInterpretationFields,
    targetType: z.literal("job"),
    input: z.object(BaseInterpretationInputFields).strict(),
});
export const TargetInterpretationSchema = z.discriminatedUnion("targetType", [
    RoleTargetInterpretationSchema,
    JobTargetInterpretationSchema,
]);
export const TargetInterpretationManifestSchema = z
    .object({
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    interpretationPath: RelativeWorkspacePathSchema,
    interpretationSha256: Sha256Schema,
    interpreterName: z.string().min(1),
    interpreterVersion: z.string().min(1),
    interpreterMode: z.enum(["deterministic", "manual"]),
    policyVersion: z.string().min(1),
    targetSha256: Sha256Schema,
    structuralAnalysisSha256: Sha256Schema,
    roleProfilePath: RelativeWorkspacePathSchema.optional(),
    roleProfileSha256: Sha256Schema.optional(),
    roleProfileId: SlugSafeSchema.optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .strict()
    .superRefine((manifest, context) => {
    const values = [manifest.roleProfilePath, manifest.roleProfileSha256, manifest.roleProfileId];
    const populated = values.filter((value) => value !== undefined).length;
    if (manifest.targetType === "job" && populated > 0) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Job interpretation manifests must not contain role profile metadata",
        });
    }
    if (manifest.targetType === "role" && populated !== 0 && populated !== values.length) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Role profile path, hash, and ID must be supplied together",
        });
    }
});
export const InterpretationTrustStateSchema = z.enum([
    "deterministic-approved",
    "proposed",
    "human-approved",
    "human-edited",
    "rejected",
]);
export const ModelIdentitySchema = z
    .object({
    provider: z.string().trim().min(1),
    model: z.string().trim().min(1),
    endpointType: z.string().trim().min(1).optional(),
})
    .strict();
export const ModelGenerationSettingsSchema = z
    .object({
    temperature: z.number().finite().optional(),
    topP: z.number().finite().optional(),
    maxOutputTokens: z.number().int().positive().optional(),
    seed: z.number().int().optional(),
    responseFormat: z.string().trim().min(1).optional(),
})
    .strict();
export const ProposedExpectationOperationSchema = z.enum([
    "add",
    "replace",
    "split",
    "reclassify",
    "enrich",
]);
const ProposedExpectationFields = {
    operation: ProposedExpectationOperationSchema,
    sourceExpectationIds: z.array(z.string().min(1)),
    sourceAnalysisItemIds: z.array(z.string().min(1)),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema).min(1),
    kind: TargetExpectationKindSchema,
    statement: z.string().trim().min(1),
    necessity: TargetExpectationNecessitySchema,
    importance: TargetExpectationImportanceSchema,
    explicitness: z.enum(["explicit", "strongly-implied", "inferred"]),
    capabilityTags: z.array(NormalizedCapabilityTagSchema),
    interpretationConfidence: z.enum(["high", "medium", "low"]),
    rationale: z.string().trim().min(1),
    ambiguityNotes: z.array(z.string().trim().min(1)),
};
export const ModelProposedExpectationSchema = z
    .object(ProposedExpectationFields)
    .strict()
    .superRefine((expectation, context) => {
    if (expectation.sourceExpectationIds.length + expectation.sourceAnalysisItemIds.length === 0) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A proposed expectation requires an upstream expectation or analysis item",
        });
    }
    if (new Set(expectation.capabilityTags).size !== expectation.capabilityTags.length) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Capability tags must be unique",
            path: ["capabilityTags"],
        });
    }
});
export const ModelProposedGroupSchema = z
    .object({
    kind: ExpectationGroupKindSchema,
    title: z.string().trim().min(1),
    expectationIndexes: z.array(z.number().int().nonnegative()).min(1),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema).min(1),
})
    .strict();
export const ModelProposedAmbiguitySchema = z
    .object({
    code: InterpretationAmbiguitySchema.shape.code,
    message: z.string().trim().min(1),
    sourceAnalysisItemIds: z.array(z.string().min(1)),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema),
    candidateInterpretations: z.array(z.string().trim().min(1)).optional(),
})
    .strict();
export const ModelProposedWarningSchema = z
    .object({
    code: InterpretationWarningSchema.shape.code,
    message: z.string().trim().min(1),
    sourceAnalysisItemIds: z.array(z.string().min(1)),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema),
})
    .strict();
export const ModelInterpretationPayloadSchema = z
    .object({
    proposedExpectations: z.array(ModelProposedExpectationSchema),
    proposedGroups: z.array(ModelProposedGroupSchema),
    proposedAmbiguities: z.array(ModelProposedAmbiguitySchema),
    warnings: z.array(ModelProposedWarningSchema),
})
    .strict();
export const ProposedExpectationSchema = z
    .object({
    id: z.string().min(1),
    ...ProposedExpectationFields,
    trustState: z.literal("proposed"),
})
    .strict()
    .superRefine((expectation, context) => {
    if (expectation.sourceExpectationIds.length + expectation.sourceAnalysisItemIds.length === 0) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A proposed expectation requires an upstream expectation or analysis item",
        });
    }
});
export const ProposedExpectationGroupSchema = z
    .object({
    id: z.string().min(1),
    kind: ExpectationGroupKindSchema,
    title: z.string().trim().min(1),
    expectationIds: z.array(z.string().min(1)).min(1),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema).min(1),
})
    .strict();
export const ProposalValidationIssueSchema = z
    .object({
    code: z.string().trim().min(1),
    message: z.string().trim().min(1),
    path: z.string().trim().min(1).optional(),
})
    .strict();
export const TargetInterpretationProposalSchema = z
    .object({
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    requestFingerprint: Sha256Schema,
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    status: z.enum(["generated", "validation-failed", "ready-for-review", "reviewed"]),
    model: z.object({
        provider: z.string().trim().min(1),
        model: z.string().trim().min(1),
        settings: ModelGenerationSettingsSchema,
    }).strict(),
    prompt: z.object({
        templateId: z.string().trim().min(1),
        templateVersion: z.string().trim().min(1),
        policyVersion: z.string().trim().min(1),
        renderedPromptSha256: Sha256Schema,
    }).strict(),
    input: z.object({
        targetSha256: Sha256Schema,
        structuralAnalysisSha256: Sha256Schema,
        deterministicInterpretationSha256: Sha256Schema,
        roleProfileSha256: Sha256Schema.optional(),
        normalizedModelInputSha256: Sha256Schema,
    }).strict(),
    proposedExpectations: z.array(ProposedExpectationSchema),
    proposedGroups: z.array(ProposedExpectationGroupSchema),
    proposedAmbiguities: z.array(InterpretationAmbiguitySchema),
    warnings: z.array(InterpretationWarningSchema),
    validationIssues: z.array(ProposalValidationIssueSchema),
    rawResponsePath: RelativeWorkspacePathSchema,
    rawResponseSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .strict();
export const InterpretationProposalManifestSchema = z
    .object({
    schemaVersion: z.literal(1),
    proposalId: z.string().min(1),
    requestFingerprint: Sha256Schema,
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    proposalPath: RelativeWorkspacePathSchema,
    proposalSha256: Sha256Schema,
    rawResponsePath: RelativeWorkspacePathSchema,
    rawResponseSha256: Sha256Schema,
    provider: z.string().trim().min(1),
    model: z.string().trim().min(1),
    promptTemplateId: z.string().trim().min(1),
    promptTemplateVersion: z.string().trim().min(1),
    policyVersion: z.string().trim().min(1),
    renderedPromptSha256: Sha256Schema,
    targetSha256: Sha256Schema,
    structuralAnalysisSha256: Sha256Schema,
    deterministicInterpretationSha256: Sha256Schema,
    roleProfileSha256: Sha256Schema.optional(),
    normalizedModelInputSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .strict();
export const EditedTargetExpectationSchema = z
    .object({
    kind: TargetExpectationKindSchema,
    statement: z.string().trim().min(1),
    necessity: TargetExpectationNecessitySchema,
    importance: TargetExpectationImportanceSchema,
    explicitness: z.enum(["explicit", "strongly-implied", "inferred"]),
    capabilityTags: z.array(NormalizedCapabilityTagSchema),
    interpretationConfidence: z.enum(["high", "medium", "low"]),
    notes: z.array(z.string().trim().min(1)),
})
    .strict();
export const ProposalReviewDecisionSchema = z
    .object({
    proposedExpectationId: z.string().min(1),
    decision: z.enum(["pending", "accept", "edit", "reject"]),
    editedExpectation: EditedTargetExpectationSchema.optional(),
    reviewNote: z.string().trim().min(1).optional(),
    decidedAt: z.string().datetime().optional(),
})
    .strict()
    .superRefine((decision, context) => {
    if (decision.decision === "edit" && !decision.editedExpectation) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "An edit decision requires editedExpectation",
            path: ["editedExpectation"],
        });
    }
    if (decision.decision !== "edit" && decision.editedExpectation) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only edit decisions may contain editedExpectation",
            path: ["editedExpectation"],
        });
    }
});
export const InterpretationProposalReviewSchema = z
    .object({
    schemaVersion: z.literal(1),
    proposalId: z.string().min(1),
    targetId: TargetIdSchema,
    status: z.enum(["in-progress", "completed"]),
    decisions: z.array(ProposalReviewDecisionSchema),
    reviewer: z.object({
        type: z.literal("human"),
        name: z.string().trim().min(1).optional(),
    }).strict(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .strict()
    .superRefine((review, context) => {
    const ids = review.decisions.map((decision) => decision.proposedExpectationId);
    if (new Set(ids).size !== ids.length) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Review decisions must contain unique proposed expectation IDs",
            path: ["decisions"],
        });
    }
});
export const InterpretationProposalReviewManifestSchema = z
    .object({
    schemaVersion: z.literal(1),
    proposalId: z.string().min(1),
    targetId: TargetIdSchema,
    reviewPath: RelativeWorkspacePathSchema,
    reviewSha256: Sha256Schema,
    proposalSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .strict();
export const ApprovedExpectationProvenanceSchema = z
    .object({
    proposalId: z.string().min(1),
    proposedExpectationId: z.string().min(1),
    reviewDecision: z.enum(["accept", "edit"]),
    reviewer: z.object({
        type: z.literal("human"),
        name: z.string().trim().min(1).optional(),
    }).strict(),
    modelProvider: z.string().min(1),
    modelName: z.string().min(1),
    promptTemplateVersion: z.string().min(1),
    policyVersion: z.string().min(1),
    sourceExpectationIds: z.array(z.string().min(1)),
})
    .strict();
export const ApprovedTargetExpectationSchema = TargetExpectationSchema.extend({
    trustState: z.enum(["deterministic-approved", "human-approved", "human-edited"]),
    approvalProvenance: ApprovedExpectationProvenanceSchema.optional(),
}).superRefine((expectation, context) => {
    if (expectation.trustState === "deterministic-approved" && expectation.approvalProvenance) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Deterministic expectations must not contain model approval provenance",
            path: ["approvalProvenance"],
        });
    }
    if (expectation.trustState !== "deterministic-approved" && !expectation.approvalProvenance) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Human-reviewed model expectations require approval provenance",
            path: ["approvalProvenance"],
        });
    }
});
export const ApprovedTargetInterpretationSchema = z
    .object({
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    interpreter: z.object({
        name: z.string().min(1),
        version: z.string().min(1),
        mode: z.literal("manual"),
        policyVersion: z.string().min(1),
    }).strict(),
    input: z.object({
        targetPath: RelativeWorkspacePathSchema,
        targetSha256: Sha256Schema,
        structuralAnalysisPath: RelativeWorkspacePathSchema,
        structuralAnalysisSha256: Sha256Schema,
        deterministicInterpretationPath: RelativeWorkspacePathSchema,
        deterministicInterpretationSha256: Sha256Schema,
        roleProfilePath: RelativeWorkspacePathSchema.optional(),
        roleProfileSha256: Sha256Schema.optional(),
        proposalPath: RelativeWorkspacePathSchema,
        proposalSha256: Sha256Schema,
        reviewPath: RelativeWorkspacePathSchema,
        reviewSha256: Sha256Schema,
    }).strict(),
    expectations: z.array(ApprovedTargetExpectationSchema),
    groups: z.array(ExpectationGroupSchema),
    ambiguities: z.array(InterpretationAmbiguitySchema),
    warnings: z.array(InterpretationWarningSchema),
    completeness: InterpretationCompletenessSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .strict();
export const ApprovedTargetInterpretationManifestSchema = z
    .object({
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    approvedInterpretationPath: RelativeWorkspacePathSchema,
    approvedInterpretationSha256: Sha256Schema,
    interpreterName: z.string().min(1),
    interpreterVersion: z.string().min(1),
    policyVersion: z.string().min(1),
    targetSha256: Sha256Schema,
    structuralAnalysisSha256: Sha256Schema,
    deterministicInterpretationSha256: Sha256Schema,
    roleProfileSha256: Sha256Schema.optional(),
    proposalId: z.string().min(1),
    proposalSha256: Sha256Schema,
    reviewSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})
    .strict();
export const EvidenceMatchTypeSchema = z.enum([
    "direct",
    "supporting",
    "partial",
    "contradictory",
]);
export const EvidenceMatchCoverageSchema = z.enum(["full", "partial", "conflicting"]);
export const EvidenceStrengthSchema = z.enum(["strong", "medium", "weak", "unknown"]);
export const TemporalRelevanceSchema = z.enum(["current", "recent", "historical", "unknown"]);
export const EvidenceMatchConfidenceSchema = z.enum(["high", "medium", "low"]);
export const EvidenceMatchTrustStateSchema = z.enum([
    "manual-approved",
    "proposed",
    "human-approved",
    "human-edited",
    "rejected",
]);
export const ExpectationCoverageStatusSchema = z.enum([
    "matched",
    "partially-matched",
    "unsupported",
    "not-assessed",
    "conflicting",
]);
export const ExpectationMatchProvenanceSchema = z.object({
    targetId: TargetIdSchema,
    approvedInterpretationPath: RelativeWorkspacePathSchema,
    approvedInterpretationSha256: Sha256Schema,
    expectationId: z.string().min(1),
    expectationTrustState: z.enum([
        "deterministic-approved",
        "human-approved",
        "human-edited",
    ]),
    sourceAnalysisItemIds: z.array(z.string().min(1)),
    sourceReferences: z.array(TargetInterpretationSourceReferenceSchema).min(1),
    approvalProvenance: ApprovedExpectationProvenanceSchema.optional(),
}).strict();
export const EvidenceSourceProvenanceSchema = z.object({
    sourceId: z.string().min(1),
    sourceType: z.string().min(1),
    path: RelativeWorkspacePathSchema,
    sha256: Sha256Schema,
    status: z.literal("active"),
    visibility: VisibilitySchema,
}).strict();
export const EvidenceMatchProvenanceSchema = z.object({
    evidenceId: z.string().min(1),
    evidenceType: z.string().min(1),
    reviewedStatus: z.literal("approved"),
    active: z.literal(true),
    evidenceArtifactSha256: Sha256Schema,
    reviewArtifactSha256: Sha256Schema,
    supportingClaimIds: z.array(z.string().min(1)).min(1),
    sources: z.array(EvidenceSourceProvenanceSchema).min(1),
}).strict();
export const EvidenceSnapshotEntrySchema = z.object({
    evidenceId: z.string().min(1),
    evidenceType: z.string().min(1),
    evidenceArtifactSha256: Sha256Schema,
    reviewArtifactSha256: Sha256Schema,
    supportingClaimIds: z.array(z.string().min(1)).min(1),
    active: z.literal(true),
    reviewed: z.literal(true),
    provenance: EvidenceMatchProvenanceSchema,
}).strict();
export const EvidenceSnapshotSchema = z.object({
    schemaVersion: z.literal(1),
    policyVersion: z.string().min(1),
    sourcesPath: RelativeWorkspacePathSchema,
    sourcesSha256: Sha256Schema,
    evidenceItemsPath: RelativeWorkspacePathSchema,
    evidenceItemsSha256: Sha256Schema,
    claimsPath: RelativeWorkspacePathSchema,
    claimsSha256: Sha256Schema,
    entries: z.array(EvidenceSnapshotEntrySchema),
    eligibleEvidenceIds: z.array(z.string().min(1)),
    eligibleEvidenceSetSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const EvidenceSnapshotManifestSchema = z.object({
    schemaVersion: z.literal(1),
    snapshotPath: RelativeWorkspacePathSchema,
    snapshotSha256: Sha256Schema,
    policyVersion: z.string().min(1),
    sourcesSha256: Sha256Schema,
    evidenceItemsSha256: Sha256Schema,
    claimsSha256: Sha256Schema,
    eligibleEvidenceSetSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const EvidenceMatchInterpretationSchema = z.object({
    method: z.enum(["manual", "deterministic-rule", "model-assisted"]),
    matcherName: z.string().min(1),
    matcherVersion: z.string().min(1),
    policyVersion: z.string().min(1),
}).strict();
export const MatchApprovalProvenanceSchema = z.object({
    proposalId: z.string().min(1),
    proposedMatchId: z.string().min(1),
    reviewDecision: z.enum(["accept", "edit"]),
    reviewer: z.object({ type: z.literal("human"), name: z.string().min(1).optional() }).strict(),
    modelProvider: z.string().min(1),
    modelName: z.string().min(1),
    promptTemplateVersion: z.string().min(1),
    policyVersion: z.string().min(1),
}).strict();
export const EvidenceMatchSchema = z.object({
    id: z.string().min(1),
    expectationId: z.string().min(1),
    evidenceIds: z.array(z.string().min(1)).min(1),
    matchType: EvidenceMatchTypeSchema,
    coverage: EvidenceMatchCoverageSchema,
    evidenceStrength: EvidenceStrengthSchema,
    temporalRelevance: TemporalRelevanceSchema,
    rationale: z.string().trim().min(1),
    expectationProvenance: ExpectationMatchProvenanceSchema,
    evidenceProvenance: z.array(EvidenceMatchProvenanceSchema).min(1),
    trustState: z.enum(["manual-approved", "human-approved", "human-edited"]),
    interpretation: EvidenceMatchInterpretationSchema,
    matchConfidence: EvidenceMatchConfidenceSchema,
    limitations: z.array(z.string().trim().min(1)),
    notes: z.array(z.string().trim().min(1)),
    approvalProvenance: MatchApprovalProvenanceSchema.optional(),
}).strict();
export const ExpectationCoverageRecordSchema = z.object({
    id: z.string().min(1),
    expectationId: z.string().min(1),
    status: ExpectationCoverageStatusSchema,
    approvedMatchIds: z.array(z.string().min(1)),
    proposedMatchIds: z.array(z.string().min(1)),
    blockingReasons: z.array(z.string().min(1)),
    notes: z.array(z.string().min(1)),
}).strict();
export const EvidenceMatchingWarningSchema = z.object({
    id: z.string().min(1),
    code: z.enum([
        "NO_ELIGIBLE_EVIDENCE",
        "NO_ELIGIBLE_EXPECTATIONS",
        "EXPECTATION_NOT_ASSESSED",
        "EXPECTATION_UNSUPPORTED",
        "ONLY_INDIRECT_EVIDENCE_FOUND",
        "ONLY_HISTORICAL_EVIDENCE_FOUND",
        "CONFLICTING_EVIDENCE_FOUND",
        "EVIDENCE_BECAME_INACTIVE",
        "EVIDENCE_REVIEW_STATUS_CHANGED",
        "UNKNOWN_MATCH_TYPE_PROPOSED",
        "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW",
        "EVIDENCE_NOT_FOUND",
        "EVIDENCE_PRESENT_BUT_TOO_GENERAL",
        "EVIDENCE_PRESENT_BUT_OUTDATED",
        "EVIDENCE_PRESENT_BUT_INDIRECT",
        "EVIDENCE_PRESENT_BUT_UNREVIEWED",
    ]),
    message: z.string().min(1),
    expectationId: z.string().min(1).optional(),
    evidenceIds: z.array(z.string().min(1)),
}).strict();
export const EvidenceMatchingAmbiguitySchema = z.object({
    id: z.string().min(1),
    code: z.enum([
        "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS",
        "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR",
        "DIRECT_VS_SUPPORTING_UNCLEAR",
        "TEMPORAL_RELEVANCE_UNCLEAR",
        "CONTRADICTION_UNCLEAR",
    ]),
    message: z.string().min(1),
    expectationId: z.string().min(1).optional(),
    evidenceIds: z.array(z.string().min(1)),
}).strict();
export const EvidenceMatchingCompletenessSchema = z.object({
    status: z.enum(["empty", "partial", "complete"]),
    assessedExpectationCount: z.number().int().nonnegative(),
    totalEligibleExpectationCount: z.number().int().nonnegative(),
    usableForFitAssessment: z.boolean(),
    blockingReasons: z.array(z.string().min(1)),
}).strict().superRefine((value, context) => {
    if (value.usableForFitAssessment && value.status !== "complete") {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only complete matching may be usable for future fit assessment",
            path: ["usableForFitAssessment"],
        });
    }
});
const BaseTargetEvidenceMatchingFields = {
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    approvedInterpretation: z.object({
        path: RelativeWorkspacePathSchema,
        sha256: Sha256Schema,
        manifestPath: RelativeWorkspacePathSchema,
        manifestSha256: Sha256Schema,
    }).strict(),
    evidenceSnapshot: z.object({
        manifestPath: RelativeWorkspacePathSchema,
        manifestSha256: Sha256Schema,
        eligibleEvidenceIds: z.array(z.string().min(1)),
        eligibleEvidenceSetSha256: Sha256Schema,
    }).strict(),
    matches: z.array(EvidenceMatchSchema),
    expectationCoverage: z.array(ExpectationCoverageRecordSchema),
    warnings: z.array(EvidenceMatchingWarningSchema),
    ambiguities: z.array(EvidenceMatchingAmbiguitySchema),
    completeness: EvidenceMatchingCompletenessSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
};
export const RoleTargetEvidenceMatchingSchema = z.object({
    ...BaseTargetEvidenceMatchingFields,
    targetType: z.literal("role"),
}).strict();
export const JobTargetEvidenceMatchingSchema = z.object({
    ...BaseTargetEvidenceMatchingFields,
    targetType: z.literal("job"),
}).strict();
export const TargetEvidenceMatchingSchema = z.discriminatedUnion("targetType", [
    RoleTargetEvidenceMatchingSchema,
    JobTargetEvidenceMatchingSchema,
]);
export const MatchingManifestSchema = z.object({
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    matchingPath: RelativeWorkspacePathSchema,
    matchingSha256: Sha256Schema,
    matcherName: z.string().min(1),
    matcherVersion: z.string().min(1),
    policyVersion: z.string().min(1),
    targetSha256: Sha256Schema,
    approvedInterpretationSha256: Sha256Schema,
    approvedInterpretationManifestSha256: Sha256Schema,
    evidenceSnapshotManifestSha256: Sha256Schema,
    eligibleEvidenceSetSha256: Sha256Schema,
    manualStoreSha256: Sha256Schema.optional(),
    proposalId: z.string().min(1).optional(),
    proposalSha256: Sha256Schema.optional(),
    reviewSha256: Sha256Schema.optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const ManualMatchTombstoneSchema = z.object({
    matchId: z.string().min(1),
    removedAt: z.string().datetime(),
    reason: z.string().min(1).optional(),
}).strict();
export const ManualEvidenceMatchingSchema = z.object({
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    approvedInterpretationSha256: Sha256Schema,
    eligibleEvidenceSetSha256: Sha256Schema,
    matches: z.array(EvidenceMatchSchema),
    tombstones: z.array(ManualMatchTombstoneSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const ManualMatchingManifestSchema = z.object({
    schemaVersion: z.literal(1),
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    matchingPath: RelativeWorkspacePathSchema,
    matchingSha256: Sha256Schema,
    approvedInterpretationSha256: Sha256Schema,
    eligibleEvidenceSetSha256: Sha256Schema,
    policyVersion: z.string().min(1),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
const ProposedMatchFields = {
    expectationId: z.string().min(1),
    evidenceIds: z.array(z.string().min(1)).min(1),
    matchType: EvidenceMatchTypeSchema,
    coverage: EvidenceMatchCoverageSchema,
    evidenceStrength: EvidenceStrengthSchema,
    temporalRelevance: TemporalRelevanceSchema,
    matchConfidence: EvidenceMatchConfidenceSchema,
    rationale: z.string().trim().min(1),
    limitations: z.array(z.string().trim().min(1)),
    expectationProvenance: ExpectationMatchProvenanceSchema,
    evidenceProvenance: z.array(EvidenceMatchProvenanceSchema).min(1),
};
export const ModelProposedEvidenceMatchSchema = z.object(ProposedMatchFields).strict();
export const ProposedEvidenceMatchSchema = z.object({
    id: z.string().min(1),
    ...ProposedMatchFields,
    trustState: z.literal("proposed"),
}).strict();
export const ProposedExpectationCoverageSchema = z.object({
    id: z.string().min(1),
    expectationId: z.string().min(1),
    status: ExpectationCoverageStatusSchema,
    rationale: z.string().min(1),
    blockingReasons: z.array(z.string().min(1)),
    notes: z.array(z.string().min(1)),
}).strict();
export const ModelProposedExpectationCoverageSchema = ProposedExpectationCoverageSchema.omit({ id: true });
export const ModelEvidenceMatchPayloadSchema = z.object({
    proposedMatches: z.array(ModelProposedEvidenceMatchSchema),
    proposedCoverage: z.array(ModelProposedExpectationCoverageSchema),
    warnings: z.array(EvidenceMatchingWarningSchema.omit({ id: true })),
    ambiguities: z.array(EvidenceMatchingAmbiguitySchema.omit({ id: true })),
}).strict();
export const EvidenceMatchValidationIssueSchema = z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    path: z.string().min(1).optional(),
}).strict();
export const EvidenceMatchProposalSchema = z.object({
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    requestFingerprint: Sha256Schema,
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    status: z.enum(["generated", "validation-failed", "ready-for-review", "reviewed"]),
    matcher: z.object({ name: z.string().min(1), version: z.string().min(1), policyVersion: z.string().min(1) }).strict(),
    model: z.object({ provider: z.string().min(1), model: z.string().min(1), settings: ModelGenerationSettingsSchema }).strict(),
    prompt: z.object({
        templateId: z.string().min(1),
        templateVersion: z.string().min(1),
        policyVersion: z.string().min(1),
        renderedPromptSha256: Sha256Schema,
    }).strict(),
    input: z.object({
        approvedInterpretationSha256: Sha256Schema,
        eligibleEvidenceSetSha256: Sha256Schema,
        normalizedModelInputSha256: Sha256Schema,
    }).strict(),
    proposedMatches: z.array(ProposedEvidenceMatchSchema),
    proposedCoverage: z.array(ProposedExpectationCoverageSchema),
    warnings: z.array(EvidenceMatchingWarningSchema),
    ambiguities: z.array(EvidenceMatchingAmbiguitySchema),
    validationIssues: z.array(EvidenceMatchValidationIssueSchema),
    rawResponsePath: RelativeWorkspacePathSchema,
    rawResponseSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const EvidenceMatchProposalManifestSchema = z.object({
    schemaVersion: z.literal(1),
    proposalId: z.string().min(1),
    requestFingerprint: Sha256Schema,
    targetId: TargetIdSchema,
    targetType: z.enum(["role", "job"]),
    proposalPath: RelativeWorkspacePathSchema,
    proposalSha256: Sha256Schema,
    rawResponsePath: RelativeWorkspacePathSchema,
    rawResponseSha256: Sha256Schema,
    matcherName: z.string().min(1),
    matcherVersion: z.string().min(1),
    policyVersion: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().min(1),
    promptTemplateId: z.string().min(1),
    promptTemplateVersion: z.string().min(1),
    renderedPromptSha256: Sha256Schema,
    approvedInterpretationSha256: Sha256Schema,
    evidenceSnapshotManifestSha256: Sha256Schema,
    eligibleEvidenceSetSha256: Sha256Schema,
    normalizedModelInputSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const EditedEvidenceMatchSchema = z.object({
    evidenceIds: z.array(z.string().min(1)).min(1),
    matchType: EvidenceMatchTypeSchema,
    coverage: EvidenceMatchCoverageSchema,
    evidenceStrength: EvidenceStrengthSchema,
    temporalRelevance: TemporalRelevanceSchema,
    matchConfidence: EvidenceMatchConfidenceSchema,
    rationale: z.string().trim().min(1),
    limitations: z.array(z.string().trim().min(1)),
    notes: z.array(z.string().trim().min(1)),
}).strict();
export const EvidenceMatchReviewDecisionSchema = z.object({
    proposedMatchId: z.string().min(1),
    decision: z.enum(["pending", "accept", "edit", "reject"]),
    editedMatch: EditedEvidenceMatchSchema.optional(),
    reviewNote: z.string().min(1).optional(),
    decidedAt: z.string().datetime().optional(),
}).strict().superRefine((value, context) => {
    if (value.decision === "edit" && !value.editedMatch)
        context.addIssue({ code: z.ZodIssueCode.custom, message: "Edit requires editedMatch", path: ["editedMatch"] });
    if (value.decision !== "edit" && value.editedMatch)
        context.addIssue({ code: z.ZodIssueCode.custom, message: "Only edit may contain editedMatch", path: ["editedMatch"] });
});
export const ExpectationCoverageReviewDecisionSchema = z.object({
    proposedCoverageId: z.string().min(1),
    decision: z.enum(["pending", "accept", "edit", "reject"]),
    editedStatus: ExpectationCoverageStatusSchema.optional(),
    reviewNote: z.string().min(1).optional(),
    decidedAt: z.string().datetime().optional(),
}).strict().superRefine((value, context) => {
    if (value.decision === "edit" && !value.editedStatus)
        context.addIssue({ code: z.ZodIssueCode.custom, message: "Coverage edit requires editedStatus", path: ["editedStatus"] });
    if (value.decision !== "edit" && value.editedStatus)
        context.addIssue({ code: z.ZodIssueCode.custom, message: "Only coverage edit may contain editedStatus", path: ["editedStatus"] });
});
export const EvidenceMatchProposalReviewSchema = z.object({
    schemaVersion: z.literal(1),
    proposalId: z.string().min(1),
    targetId: TargetIdSchema,
    status: z.enum(["in-progress", "completed"]),
    matchDecisions: z.array(EvidenceMatchReviewDecisionSchema),
    coverageDecisions: z.array(ExpectationCoverageReviewDecisionSchema),
    reviewer: z.object({ type: z.literal("human"), name: z.string().min(1).optional() }).strict(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const EvidenceMatchReviewManifestSchema = z.object({
    schemaVersion: z.literal(1),
    proposalId: z.string().min(1),
    targetId: TargetIdSchema,
    reviewPath: RelativeWorkspacePathSchema,
    reviewSha256: Sha256Schema,
    proposalSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const SourceSchema = z.object({
    id: z.string(),
    type: z.enum([
        "cv",
        "linkedin_export",
        "github_summary",
        "project_note",
        "recommendation",
        "certificate",
        "markdown",
        "pdf",
        "docx",
        "json",
        "csv",
        "job_description",
        "unknown"
    ]),
    path: z.string(),
    title: z.string().optional(),
    importedAt: z.string(),
    hash: z.string(),
    visibility: VisibilitySchema,
    status: z.enum(["active", "ignored", "needs_review"]),
    extractedTextPath: z.string().optional()
});
export const EvidenceItemSchema = z.object({
    id: z.string(),
    sourceIds: z.array(z.string()),
    category: z.enum([
        "role",
        "project",
        "skill",
        "certification",
        "recommendation",
        "education",
        "domain",
        "responsibility",
        "achievement",
        "tool"
    ]),
    text: z.string(),
    normalizedSummary: z.string(),
    dateRange: z.string().optional(),
    company: z.string().optional(),
    project: z.string().optional(),
    parentRoleId: z.string().optional(),
    parentProjectId: z.string().optional(),
    sourceSection: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    domains: z.array(z.string()).optional(),
    visibility: VisibilitySchema,
    sensitivityFlags: z.array(z.string()),
    confidence: ConfidenceSchema
});
export const ClaimSchema = z.object({
    id: z.string(),
    claim: z.string(),
    type: z.enum([
        "role_claim",
        "skill_claim",
        "leadership_claim",
        "impact_claim",
        "domain_claim",
        "project_claim",
        "competency_claim",
        "certification_claim",
        "education_claim",
        "responsibility_claim"
    ]),
    supportingEvidenceIds: z.array(z.string()),
    parentRoleId: z.string().optional(),
    parentProjectId: z.string().optional(),
    sourceSection: z.string().optional(),
    dateRange: z.string().optional(),
    extractionConfidence: ConfidenceSchema,
    factualConfidence: ConfidenceSchema,
    corroborationLevel: CorroborationLevelSchema,
    approvalStatus: ApprovalStatusSchema,
    outputReadiness: OutputReadinessSchema,
    // Compatibility fields retained for Slice 1 consumers.
    confidence: ConfidenceSchema,
    publicSafe: z.boolean(),
    needsConfirmation: z.boolean(),
    metricStatus: z.enum(["verified_metric", "structural_metric", "no_metric", "needs_metric"]),
    approvedWording: z.string().optional(),
    unsafeWording: z.array(z.string()).optional()
});
export const CareerProfileSchema = z.object({
    id: z.string(),
    updatedAt: z.string(),
    positioningCandidates: z.array(z.string()),
    summaryThemes: z.array(z.string()),
    roles: z.array(z.object({
        title: z.string().optional(),
        company: z.string().optional(),
        dateRange: z.string().optional(),
        evidenceIds: z.array(z.string())
    })),
    projects: z.array(z.object({
        name: z.string(),
        technologies: z.array(z.string()).optional(),
        domains: z.array(z.string()).optional(),
        evidenceIds: z.array(z.string())
    })),
    skills: z.array(z.object({
        name: z.string(),
        evidenceIds: z.array(z.string())
    })),
    domains: z.array(z.string()),
    approvedClaims: z.array(z.string()),
    claimsNeedingConfirmation: z.array(z.string()),
    blockedClaims: z.array(z.string()),
    resumeReadyClaims: z.array(z.string()),
    genericOnlyClaims: z.array(z.string()),
    internalOnlyClaims: z.array(z.string()),
    publicSafetyRules: z.array(z.string())
});
