import { z } from "zod";
export declare const VisibilitySchema: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
export declare const ConfidenceSchema: z.ZodEnum<["high", "medium", "low"]>;
export declare const CorroborationLevelSchema: z.ZodEnum<["multi_source", "single_source", "manual_approved", "uncorroborated"]>;
export declare const ApprovalStatusSchema: z.ZodEnum<["approved", "needs_confirmation", "blocked"]>;
export declare const OutputReadinessSchema: z.ZodEnum<["resume_ready", "generic_only", "internal_only", "do_not_use"]>;
export declare const VariantReviewDecisionValueSchema: z.ZodEnum<["pending", "approve", "revise", "draft_only", "exclude"]>;
export declare const VariantReviewDecisionSchema: z.ZodObject<{
    claimId: z.ZodString;
    decision: z.ZodEnum<["pending", "approve", "revise", "draft_only", "exclude"]>;
    approvedPublicWording: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
    decidedBy: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    claimId: string;
    decision: "pending" | "approve" | "revise" | "draft_only" | "exclude";
    approvedPublicWording?: string | undefined;
    notes?: string | undefined;
    decidedAt?: string | undefined;
    decidedBy?: string | undefined;
    reason?: string | undefined;
}, {
    claimId: string;
    decision: "pending" | "approve" | "revise" | "draft_only" | "exclude";
    approvedPublicWording?: string | undefined;
    notes?: string | undefined;
    decidedAt?: string | undefined;
    decidedBy?: string | undefined;
    reason?: string | undefined;
}>;
export declare const VariantReviewDecisionsSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    roleKey: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    profileFingerprint: z.ZodString;
    sourceGenerationManifest: z.ZodString;
    decisions: z.ZodArray<z.ZodObject<{
        claimId: z.ZodString;
        decision: z.ZodEnum<["pending", "approve", "revise", "draft_only", "exclude"]>;
        approvedPublicWording: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
        decidedBy: z.ZodOptional<z.ZodString>;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        claimId: string;
        decision: "pending" | "approve" | "revise" | "draft_only" | "exclude";
        approvedPublicWording?: string | undefined;
        notes?: string | undefined;
        decidedAt?: string | undefined;
        decidedBy?: string | undefined;
        reason?: string | undefined;
    }, {
        claimId: string;
        decision: "pending" | "approve" | "revise" | "draft_only" | "exclude";
        approvedPublicWording?: string | undefined;
        notes?: string | undefined;
        decidedAt?: string | undefined;
        decidedBy?: string | undefined;
        reason?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    roleKey: string;
    createdAt: string;
    updatedAt: string;
    profileFingerprint: string;
    sourceGenerationManifest: string;
    decisions: {
        claimId: string;
        decision: "pending" | "approve" | "revise" | "draft_only" | "exclude";
        approvedPublicWording?: string | undefined;
        notes?: string | undefined;
        decidedAt?: string | undefined;
        decidedBy?: string | undefined;
        reason?: string | undefined;
    }[];
}, {
    schemaVersion: 1;
    roleKey: string;
    createdAt: string;
    updatedAt: string;
    profileFingerprint: string;
    sourceGenerationManifest: string;
    decisions: {
        claimId: string;
        decision: "pending" | "approve" | "revise" | "draft_only" | "exclude";
        approvedPublicWording?: string | undefined;
        notes?: string | undefined;
        decidedAt?: string | undefined;
        decidedBy?: string | undefined;
        reason?: string | undefined;
    }[];
}>;
export declare const PublicProfileSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    publicName: z.ZodOptional<z.ZodString>;
    headlineOverride: z.ZodOptional<z.ZodString>;
    headlineOverrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    location: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodOptional<z.ZodString>;
    github: z.ZodOptional<z.ZodString>;
    publicSummaryOverride: z.ZodOptional<z.ZodString>;
    educationWordingOverrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    certificationWordingOverrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    publicName?: string | undefined;
    headlineOverride?: string | undefined;
    headlineOverrides?: Record<string, string> | undefined;
    location?: string | undefined;
    email?: string | undefined;
    website?: string | undefined;
    linkedin?: string | undefined;
    github?: string | undefined;
    publicSummaryOverride?: string | undefined;
    educationWordingOverrides?: Record<string, string> | undefined;
    certificationWordingOverrides?: Record<string, string> | undefined;
}, {
    schemaVersion: 1;
    publicName?: string | undefined;
    headlineOverride?: string | undefined;
    headlineOverrides?: Record<string, string> | undefined;
    location?: string | undefined;
    email?: string | undefined;
    website?: string | undefined;
    linkedin?: string | undefined;
    github?: string | undefined;
    publicSummaryOverride?: string | undefined;
    educationWordingOverrides?: Record<string, string> | undefined;
    certificationWordingOverrides?: Record<string, string> | undefined;
}>;
export declare const RoleTargetSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    type: z.ZodLiteral<"role">;
    title: z.ZodString;
    seniority: z.ZodOptional<z.ZodString>;
    domain: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    workingModel: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "role";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    location?: string | undefined;
    seniority?: string | undefined;
    domain?: string | undefined;
    workingModel?: string | undefined;
}, {
    type: "role";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    location?: string | undefined;
    seniority?: string | undefined;
    domain?: string | undefined;
    workingModel?: string | undefined;
}>;
export declare const JobTargetSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    type: z.ZodLiteral<"job">;
    title: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    workingModel: z.ZodOptional<z.ZodString>;
    source: z.ZodObject<{
        type: z.ZodLiteral<"markdown">;
        path: z.ZodString;
        sha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        type: "markdown";
    }, {
        sha256: string;
        path: string;
        type: "markdown";
    }>;
    rawDescription: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "job";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    source: {
        sha256: string;
        path: string;
        type: "markdown";
    };
    rawDescription: string;
    location?: string | undefined;
    workingModel?: string | undefined;
    company?: string | undefined;
}, {
    type: "job";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    source: {
        sha256: string;
        path: string;
        type: "markdown";
    };
    rawDescription: string;
    location?: string | undefined;
    workingModel?: string | undefined;
    company?: string | undefined;
}>;
export declare const TargetSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    type: z.ZodLiteral<"role">;
    title: z.ZodString;
    seniority: z.ZodOptional<z.ZodString>;
    domain: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    workingModel: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "role";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    location?: string | undefined;
    seniority?: string | undefined;
    domain?: string | undefined;
    workingModel?: string | undefined;
}, {
    type: "role";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    location?: string | undefined;
    seniority?: string | undefined;
    domain?: string | undefined;
    workingModel?: string | undefined;
}>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    type: z.ZodLiteral<"job">;
    title: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    workingModel: z.ZodOptional<z.ZodString>;
    source: z.ZodObject<{
        type: z.ZodLiteral<"markdown">;
        path: z.ZodString;
        sha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        type: "markdown";
    }, {
        sha256: string;
        path: string;
        type: "markdown";
    }>;
    rawDescription: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "job";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    source: {
        sha256: string;
        path: string;
        type: "markdown";
    };
    rawDescription: string;
    location?: string | undefined;
    workingModel?: string | undefined;
    company?: string | undefined;
}, {
    type: "job";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    source: {
        sha256: string;
        path: string;
        type: "markdown";
    };
    rawDescription: string;
    location?: string | undefined;
    workingModel?: string | undefined;
    company?: string | undefined;
}>]>;
export declare const TargetAnalysisSourceReferenceSchema: z.ZodEffects<z.ZodObject<{
    sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
    path: z.ZodString;
    sha256: z.ZodString;
    startLine: z.ZodNumber;
    endLine: z.ZodNumber;
    startOffset: z.ZodOptional<z.ZodNumber>;
    endOffset: z.ZodOptional<z.ZodNumber>;
    excerptSha256: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sha256: string;
    path: string;
    sourceType: "job-description-markdown" | "target-json";
    startLine: number;
    endLine: number;
    excerptSha256: string;
    startOffset?: number | undefined;
    endOffset?: number | undefined;
}, {
    sha256: string;
    path: string;
    sourceType: "job-description-markdown" | "target-json";
    startLine: number;
    endLine: number;
    excerptSha256: string;
    startOffset?: number | undefined;
    endOffset?: number | undefined;
}>, {
    sha256: string;
    path: string;
    sourceType: "job-description-markdown" | "target-json";
    startLine: number;
    endLine: number;
    excerptSha256: string;
    startOffset?: number | undefined;
    endOffset?: number | undefined;
}, {
    sha256: string;
    path: string;
    sourceType: "job-description-markdown" | "target-json";
    startLine: number;
    endLine: number;
    excerptSha256: string;
    startOffset?: number | undefined;
    endOffset?: number | undefined;
}>;
export declare const TargetAnalysisSectionSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    parentSectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    heading: z.ZodNullable<z.ZodString>;
    headingLevel: z.ZodNullable<z.ZodNumber>;
    normalizedHeading: z.ZodNullable<z.ZodString>;
    startLine: z.ZodNumber;
    endLine: z.ZodNumber;
    sourceReference: z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>;
    classification: z.ZodEnum<["responsibilities", "required", "preferred", "qualifications", "about-role", "company", "benefits", "other", "unknown"]>;
    classificationBasis: z.ZodEnum<["explicit-heading", "none"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    startLine: number;
    endLine: number;
    heading: string | null;
    headingLevel: number | null;
    normalizedHeading: string | null;
    sourceReference: {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    };
    classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
    classificationBasis: "explicit-heading" | "none";
    parentSectionId?: string | null | undefined;
}, {
    id: string;
    startLine: number;
    endLine: number;
    heading: string | null;
    headingLevel: number | null;
    normalizedHeading: string | null;
    sourceReference: {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    };
    classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
    classificationBasis: "explicit-heading" | "none";
    parentSectionId?: string | null | undefined;
}>, {
    id: string;
    startLine: number;
    endLine: number;
    heading: string | null;
    headingLevel: number | null;
    normalizedHeading: string | null;
    sourceReference: {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    };
    classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
    classificationBasis: "explicit-heading" | "none";
    parentSectionId?: string | null | undefined;
}, {
    id: string;
    startLine: number;
    endLine: number;
    heading: string | null;
    headingLevel: number | null;
    normalizedHeading: string | null;
    sourceReference: {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    };
    classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
    classificationBasis: "explicit-heading" | "none";
    parentSectionId?: string | null | undefined;
}>;
export declare const TargetAnalysisItemSchema: z.ZodObject<{
    id: z.ZodString;
    sectionId: z.ZodNullable<z.ZodString>;
    kind: z.ZodEnum<["list-item", "paragraph", "front-matter-field"]>;
    statement: z.ZodString;
    rawText: z.ZodString;
    necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
    category: z.ZodEnum<["responsibility", "qualification", "constraint", "benefit", "company-context", "unknown"]>;
    extractionMethod: z.ZodEnum<["explicit-front-matter", "explicit-heading", "markdown-structure"]>;
    sourceReferences: z.ZodArray<z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    sectionId: string | null;
    kind: "list-item" | "paragraph" | "front-matter-field";
    statement: string;
    rawText: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
    extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
    sourceReferences: {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }[];
}, {
    id: string;
    sectionId: string | null;
    kind: "list-item" | "paragraph" | "front-matter-field";
    statement: string;
    rawText: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
    extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
    sourceReferences: {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }[];
}>;
export declare const TargetAnalysisWarningSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
}, {
    code: string;
    message: string;
}>;
export declare const RoleTargetAnalysisSchema: z.ZodObject<{
    input: z.ZodObject<{
        targetPath: z.ZodString;
        targetSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
    }, {
        targetPath: string;
        targetSha256: string;
    }>;
    sections: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        parentSectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        heading: z.ZodNullable<z.ZodString>;
        headingLevel: z.ZodNullable<z.ZodNumber>;
        normalizedHeading: z.ZodNullable<z.ZodString>;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        sourceReference: z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>;
        classification: z.ZodEnum<["responsibilities", "required", "preferred", "qualifications", "about-role", "company", "benefits", "other", "unknown"]>;
        classificationBasis: z.ZodEnum<["explicit-heading", "none"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }>, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }>, "many">;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sectionId: z.ZodNullable<z.ZodString>;
        kind: z.ZodEnum<["list-item", "paragraph", "front-matter-field"]>;
        statement: z.ZodString;
        rawText: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        category: z.ZodEnum<["responsibility", "qualification", "constraint", "benefit", "company-context", "unknown"]>;
        extractionMethod: z.ZodEnum<["explicit-front-matter", "explicit-heading", "markdown-structure"]>;
        sourceReferences: z.ZodArray<z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }, {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }>, "many">;
    targetType: z.ZodLiteral<"role">;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    analyzer: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodLiteral<"deterministic">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "deterministic";
    }, {
        name: string;
        version: string;
        mode: "deterministic";
    }>;
    warnings: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>, "many">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
    };
    sections: {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }[];
    items: {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }[];
    targetType: "role";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: {
        code: string;
        message: string;
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
    };
    sections: {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }[];
    items: {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }[];
    targetType: "role";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: {
        code: string;
        message: string;
    }[];
}>;
export declare const JobTargetAnalysisSchema: z.ZodObject<{
    input: z.ZodObject<{
        targetPath: z.ZodString;
        targetSha256: z.ZodString;
        sourcePath: z.ZodString;
        sourceSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
        sourcePath: string;
        sourceSha256: string;
    }, {
        targetPath: string;
        targetSha256: string;
        sourcePath: string;
        sourceSha256: string;
    }>;
    targetType: z.ZodLiteral<"job">;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    analyzer: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodLiteral<"deterministic">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "deterministic";
    }, {
        name: string;
        version: string;
        mode: "deterministic";
    }>;
    sections: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        parentSectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        heading: z.ZodNullable<z.ZodString>;
        headingLevel: z.ZodNullable<z.ZodNumber>;
        normalizedHeading: z.ZodNullable<z.ZodString>;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        sourceReference: z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>;
        classification: z.ZodEnum<["responsibilities", "required", "preferred", "qualifications", "about-role", "company", "benefits", "other", "unknown"]>;
        classificationBasis: z.ZodEnum<["explicit-heading", "none"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }>, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }>, "many">;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sectionId: z.ZodNullable<z.ZodString>;
        kind: z.ZodEnum<["list-item", "paragraph", "front-matter-field"]>;
        statement: z.ZodString;
        rawText: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        category: z.ZodEnum<["responsibility", "qualification", "constraint", "benefit", "company-context", "unknown"]>;
        extractionMethod: z.ZodEnum<["explicit-front-matter", "explicit-heading", "markdown-structure"]>;
        sourceReferences: z.ZodArray<z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }, {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>, "many">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        sourcePath: string;
        sourceSha256: string;
    };
    sections: {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }[];
    items: {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }[];
    targetType: "job";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: {
        code: string;
        message: string;
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        sourcePath: string;
        sourceSha256: string;
    };
    sections: {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }[];
    items: {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }[];
    targetType: "job";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: {
        code: string;
        message: string;
    }[];
}>;
export declare const TargetAnalysisSchema: z.ZodDiscriminatedUnion<"targetType", [z.ZodObject<{
    input: z.ZodObject<{
        targetPath: z.ZodString;
        targetSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
    }, {
        targetPath: string;
        targetSha256: string;
    }>;
    sections: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        parentSectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        heading: z.ZodNullable<z.ZodString>;
        headingLevel: z.ZodNullable<z.ZodNumber>;
        normalizedHeading: z.ZodNullable<z.ZodString>;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        sourceReference: z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>;
        classification: z.ZodEnum<["responsibilities", "required", "preferred", "qualifications", "about-role", "company", "benefits", "other", "unknown"]>;
        classificationBasis: z.ZodEnum<["explicit-heading", "none"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }>, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }>, "many">;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sectionId: z.ZodNullable<z.ZodString>;
        kind: z.ZodEnum<["list-item", "paragraph", "front-matter-field"]>;
        statement: z.ZodString;
        rawText: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        category: z.ZodEnum<["responsibility", "qualification", "constraint", "benefit", "company-context", "unknown"]>;
        extractionMethod: z.ZodEnum<["explicit-front-matter", "explicit-heading", "markdown-structure"]>;
        sourceReferences: z.ZodArray<z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }, {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }>, "many">;
    targetType: z.ZodLiteral<"role">;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    analyzer: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodLiteral<"deterministic">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "deterministic";
    }, {
        name: string;
        version: string;
        mode: "deterministic";
    }>;
    warnings: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>, "many">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
    };
    sections: {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }[];
    items: {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }[];
    targetType: "role";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: {
        code: string;
        message: string;
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
    };
    sections: {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }[];
    items: {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }[];
    targetType: "role";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: {
        code: string;
        message: string;
    }[];
}>, z.ZodObject<{
    input: z.ZodObject<{
        targetPath: z.ZodString;
        targetSha256: z.ZodString;
        sourcePath: z.ZodString;
        sourceSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
        sourcePath: string;
        sourceSha256: string;
    }, {
        targetPath: string;
        targetSha256: string;
        sourcePath: string;
        sourceSha256: string;
    }>;
    targetType: z.ZodLiteral<"job">;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    analyzer: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodLiteral<"deterministic">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "deterministic";
    }, {
        name: string;
        version: string;
        mode: "deterministic";
    }>;
    sections: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        parentSectionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        heading: z.ZodNullable<z.ZodString>;
        headingLevel: z.ZodNullable<z.ZodNumber>;
        normalizedHeading: z.ZodNullable<z.ZodString>;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        sourceReference: z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>;
        classification: z.ZodEnum<["responsibilities", "required", "preferred", "qualifications", "about-role", "company", "benefits", "other", "unknown"]>;
        classificationBasis: z.ZodEnum<["explicit-heading", "none"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }>, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }, {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }>, "many">;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sectionId: z.ZodNullable<z.ZodString>;
        kind: z.ZodEnum<["list-item", "paragraph", "front-matter-field"]>;
        statement: z.ZodString;
        rawText: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        category: z.ZodEnum<["responsibility", "qualification", "constraint", "benefit", "company-context", "unknown"]>;
        extractionMethod: z.ZodEnum<["explicit-front-matter", "explicit-heading", "markdown-structure"]>;
        sourceReferences: z.ZodArray<z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }, {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>, "many">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        sourcePath: string;
        sourceSha256: string;
    };
    sections: {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }[];
    items: {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }[];
    targetType: "job";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: {
        code: string;
        message: string;
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        sourcePath: string;
        sourceSha256: string;
    };
    sections: {
        id: string;
        startLine: number;
        endLine: number;
        heading: string | null;
        headingLevel: number | null;
        normalizedHeading: string | null;
        sourceReference: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        };
        classification: "unknown" | "company" | "responsibilities" | "required" | "preferred" | "qualifications" | "about-role" | "benefits" | "other";
        classificationBasis: "explicit-heading" | "none";
        parentSectionId?: string | null | undefined;
    }[];
    items: {
        id: string;
        sectionId: string | null;
        kind: "list-item" | "paragraph" | "front-matter-field";
        statement: string;
        rawText: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        category: "unknown" | "responsibility" | "qualification" | "constraint" | "benefit" | "company-context";
        extractionMethod: "explicit-heading" | "explicit-front-matter" | "markdown-structure";
        sourceReferences: {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }[];
    }[];
    targetType: "job";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: {
        code: string;
        message: string;
    }[];
}>]>;
export declare const TargetAnalysisManifestSchema: z.ZodEffects<z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    analysisPath: z.ZodString;
    analysisSha256: z.ZodString;
    analyzerName: z.ZodString;
    analyzerVersion: z.ZodString;
    targetSha256: z.ZodString;
    sourceSha256: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    analysisPath: string;
    analysisSha256: string;
    analyzerName: string;
    analyzerVersion: string;
    sourceSha256?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    analysisPath: string;
    analysisSha256: string;
    analyzerName: string;
    analyzerVersion: string;
    sourceSha256?: string | undefined;
}>, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    analysisPath: string;
    analysisSha256: string;
    analyzerName: string;
    analyzerVersion: string;
    sourceSha256?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    analysisPath: string;
    analysisSha256: string;
    analyzerName: string;
    analyzerVersion: string;
    sourceSha256?: string | undefined;
}>;
export declare const TargetExpectationKindSchema: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
export declare const TargetExpectationNecessitySchema: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
export declare const TargetExpectationImportanceSchema: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
export declare const ExpectationGroupKindSchema: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
export declare const RoleProfileExpectationSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
    statement: z.ZodString;
    necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
    importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    capabilityTags: z.ZodArray<z.ZodString, "many">;
    group: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
    notes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
}, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
}>, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
}, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
}>;
export declare const RoleProfileSchema: z.ZodEffects<z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    title: z.ZodString;
    aliases: z.ZodArray<z.ZodString, "many">;
    seniority: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    domain: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    workingModel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expectations: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        group: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    }, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    }>, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    }, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    }>, "many">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    aliases: string[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    }[];
    location?: string | null | undefined;
    seniority?: string | null | undefined;
    domain?: string | null | undefined;
    workingModel?: string | null | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    aliases: string[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    }[];
    location?: string | null | undefined;
    seniority?: string | null | undefined;
    domain?: string | null | undefined;
    workingModel?: string | null | undefined;
}>, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    aliases: string[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    }[];
    location?: string | null | undefined;
    seniority?: string | null | undefined;
    domain?: string | null | undefined;
    workingModel?: string | null | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    aliases: string[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    }[];
    location?: string | null | undefined;
    seniority?: string | null | undefined;
    domain?: string | null | undefined;
    workingModel?: string | null | undefined;
}>;
export declare const RoleProfileSourceReferenceSchema: z.ZodObject<{
    sourceType: z.ZodLiteral<"role-profile-json">;
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
    jsonPointer: z.ZodString;
    excerptSha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
    sourceType: "role-profile-json";
    excerptSha256: string;
    jsonPointer: string;
}, {
    sha256: string;
    path: string;
    sourceType: "role-profile-json";
    excerptSha256: string;
    jsonPointer: string;
}>;
export declare const TargetInterpretationSourceReferenceSchema: z.ZodUnion<[z.ZodEffects<z.ZodObject<{
    sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
    path: z.ZodString;
    sha256: z.ZodString;
    startLine: z.ZodNumber;
    endLine: z.ZodNumber;
    startOffset: z.ZodOptional<z.ZodNumber>;
    endOffset: z.ZodOptional<z.ZodNumber>;
    excerptSha256: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sha256: string;
    path: string;
    sourceType: "job-description-markdown" | "target-json";
    startLine: number;
    endLine: number;
    excerptSha256: string;
    startOffset?: number | undefined;
    endOffset?: number | undefined;
}, {
    sha256: string;
    path: string;
    sourceType: "job-description-markdown" | "target-json";
    startLine: number;
    endLine: number;
    excerptSha256: string;
    startOffset?: number | undefined;
    endOffset?: number | undefined;
}>, {
    sha256: string;
    path: string;
    sourceType: "job-description-markdown" | "target-json";
    startLine: number;
    endLine: number;
    excerptSha256: string;
    startOffset?: number | undefined;
    endOffset?: number | undefined;
}, {
    sha256: string;
    path: string;
    sourceType: "job-description-markdown" | "target-json";
    startLine: number;
    endLine: number;
    excerptSha256: string;
    startOffset?: number | undefined;
    endOffset?: number | undefined;
}>, z.ZodObject<{
    sourceType: z.ZodLiteral<"role-profile-json">;
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
    jsonPointer: z.ZodString;
    excerptSha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
    sourceType: "role-profile-json";
    excerptSha256: string;
    jsonPointer: string;
}, {
    sha256: string;
    path: string;
    sourceType: "role-profile-json";
    excerptSha256: string;
    jsonPointer: string;
}>]>;
export declare const TargetExpectationSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
    statement: z.ZodString;
    necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
    importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
    capabilityTags: z.ZodArray<z.ZodString, "many">;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
    interpretation: z.ZodObject<{
        method: z.ZodEnum<["explicit-role-profile", "explicit-heading", "manual", "deterministic-rule"]>;
        interpreterName: z.ZodString;
        interpreterVersion: z.ZodString;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    }, {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    }>;
    interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
    notes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretation: {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    };
    interpretationConfidence: "high" | "medium" | "low";
}, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretation: {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    };
    interpretationConfidence: "high" | "medium" | "low";
}>;
export declare const ExpectationGroupSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
    title: z.ZodString;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
}, "strict", z.ZodTypeAny, {
    id: string;
    title: string;
    kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    expectationIds: string[];
}, {
    id: string;
    title: string;
    kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    expectationIds: string[];
}>;
export declare const InterpretationAmbiguitySchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_EXPECTATION_KIND", "MULTIPLE_PLAUSIBLE_INTERPRETATIONS", "INSUFFICIENT_EXPLICIT_STRUCTURE", "ROLE_PROFILE_MISSING", "UNSUPPORTED_SOURCE_STRUCTURE", "OTHER"]>;
    message: z.ZodString;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
    candidateInterpretations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
    message: string;
    id: string;
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    sourceAnalysisItemIds: string[];
    candidateInterpretations?: string[] | undefined;
}, {
    code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
    message: string;
    id: string;
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    sourceAnalysisItemIds: string[];
    candidateInterpretations?: string[] | undefined;
}>;
export declare const InterpretationWarningSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["ROLE_PROFILE_NOT_CONFIGURED", "ROLE_PROFILE_TITLE_MISMATCH", "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", "PARAGRAPH_NOT_INTERPRETED", "UNCLASSIFIED_ITEM_SKIPPED", "NO_EXPECTATIONS_PRODUCED", "OTHER"]>;
    message: z.ZodString;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
}, "strict", z.ZodTypeAny, {
    code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
    message: string;
    id: string;
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    sourceAnalysisItemIds: string[];
}, {
    code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
    message: string;
    id: string;
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    sourceAnalysisItemIds: string[];
}>;
export declare const InterpretationCompletenessSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodEnum<["empty", "partial", "complete"]>;
    usableForEvidenceMatching: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "partial" | "complete";
    usableForEvidenceMatching: boolean;
    blockingReasons: string[];
}, {
    status: "empty" | "partial" | "complete";
    usableForEvidenceMatching: boolean;
    blockingReasons: string[];
}>, {
    status: "empty" | "partial" | "complete";
    usableForEvidenceMatching: boolean;
    blockingReasons: string[];
}, {
    status: "empty" | "partial" | "complete";
    usableForEvidenceMatching: boolean;
    blockingReasons: string[];
}>;
export declare const RoleTargetInterpretationSchema: z.ZodObject<{
    targetType: z.ZodLiteral<"role">;
    input: z.ZodEffects<z.ZodObject<{
        roleProfilePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        roleProfileSha256: z.ZodOptional<z.ZodString>;
        roleProfileId: z.ZodOptional<z.ZodString>;
        targetPath: z.ZodEffects<z.ZodString, string, string>;
        targetSha256: z.ZodString;
        structuralAnalysisPath: z.ZodEffects<z.ZodString, string, string>;
        structuralAnalysisSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    }, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    }>, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    }, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    }>;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    interpreter: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodEnum<["deterministic", "manual"]>;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    }, {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    }>;
    expectations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["explicit-role-profile", "explicit-heading", "manual", "deterministic-rule"]>;
            interpreterName: z.ZodString;
            interpreterVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }>;
        interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }>, "many">;
    groups: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
        title: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_EXPECTATION_KIND", "MULTIPLE_PLAUSIBLE_INTERPRETATIONS", "INSUFFICIENT_EXPLICIT_STRUCTURE", "ROLE_PROFILE_MISSING", "UNSUPPORTED_SOURCE_STRUCTURE", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        candidateInterpretations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["ROLE_PROFILE_NOT_CONFIGURED", "ROLE_PROFILE_TITLE_MISMATCH", "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", "PARAGRAPH_NOT_INTERPRETED", "UNCLASSIFIED_ITEM_SKIPPED", "NO_EXPECTATIONS_PRODUCED", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        usableForEvidenceMatching: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    };
    targetType: "role";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    };
    targetType: "role";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}>;
export declare const JobTargetInterpretationSchema: z.ZodObject<{
    targetType: z.ZodLiteral<"job">;
    input: z.ZodObject<{
        targetPath: z.ZodEffects<z.ZodString, string, string>;
        targetSha256: z.ZodString;
        structuralAnalysisPath: z.ZodEffects<z.ZodString, string, string>;
        structuralAnalysisSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
    }, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
    }>;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    interpreter: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodEnum<["deterministic", "manual"]>;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    }, {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    }>;
    expectations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["explicit-role-profile", "explicit-heading", "manual", "deterministic-rule"]>;
            interpreterName: z.ZodString;
            interpreterVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }>;
        interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }>, "many">;
    groups: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
        title: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_EXPECTATION_KIND", "MULTIPLE_PLAUSIBLE_INTERPRETATIONS", "INSUFFICIENT_EXPLICIT_STRUCTURE", "ROLE_PROFILE_MISSING", "UNSUPPORTED_SOURCE_STRUCTURE", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        candidateInterpretations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["ROLE_PROFILE_NOT_CONFIGURED", "ROLE_PROFILE_TITLE_MISMATCH", "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", "PARAGRAPH_NOT_INTERPRETED", "UNCLASSIFIED_ITEM_SKIPPED", "NO_EXPECTATIONS_PRODUCED", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        usableForEvidenceMatching: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}>;
export declare const TargetInterpretationSchema: z.ZodDiscriminatedUnion<"targetType", [z.ZodObject<{
    targetType: z.ZodLiteral<"role">;
    input: z.ZodEffects<z.ZodObject<{
        roleProfilePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        roleProfileSha256: z.ZodOptional<z.ZodString>;
        roleProfileId: z.ZodOptional<z.ZodString>;
        targetPath: z.ZodEffects<z.ZodString, string, string>;
        targetSha256: z.ZodString;
        structuralAnalysisPath: z.ZodEffects<z.ZodString, string, string>;
        structuralAnalysisSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    }, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    }>, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    }, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    }>;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    interpreter: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodEnum<["deterministic", "manual"]>;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    }, {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    }>;
    expectations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["explicit-role-profile", "explicit-heading", "manual", "deterministic-rule"]>;
            interpreterName: z.ZodString;
            interpreterVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }>;
        interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }>, "many">;
    groups: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
        title: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_EXPECTATION_KIND", "MULTIPLE_PLAUSIBLE_INTERPRETATIONS", "INSUFFICIENT_EXPLICIT_STRUCTURE", "ROLE_PROFILE_MISSING", "UNSUPPORTED_SOURCE_STRUCTURE", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        candidateInterpretations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["ROLE_PROFILE_NOT_CONFIGURED", "ROLE_PROFILE_TITLE_MISMATCH", "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", "PARAGRAPH_NOT_INTERPRETED", "UNCLASSIFIED_ITEM_SKIPPED", "NO_EXPECTATIONS_PRODUCED", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        usableForEvidenceMatching: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    };
    targetType: "role";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
        roleProfileId?: string | undefined;
    };
    targetType: "role";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}>, z.ZodObject<{
    targetType: z.ZodLiteral<"job">;
    input: z.ZodObject<{
        targetPath: z.ZodEffects<z.ZodString, string, string>;
        targetSha256: z.ZodString;
        structuralAnalysisPath: z.ZodEffects<z.ZodString, string, string>;
        structuralAnalysisSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
    }, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
    }>;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    interpreter: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodEnum<["deterministic", "manual"]>;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    }, {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    }>;
    expectations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["explicit-role-profile", "explicit-heading", "manual", "deterministic-rule"]>;
            interpreterName: z.ZodString;
            interpreterVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }>;
        interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }>, "many">;
    groups: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
        title: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_EXPECTATION_KIND", "MULTIPLE_PLAUSIBLE_INTERPRETATIONS", "INSUFFICIENT_EXPLICIT_STRUCTURE", "ROLE_PROFILE_MISSING", "UNSUPPORTED_SOURCE_STRUCTURE", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        candidateInterpretations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["ROLE_PROFILE_NOT_CONFIGURED", "ROLE_PROFILE_TITLE_MISMATCH", "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", "PARAGRAPH_NOT_INTERPRETED", "UNCLASSIFIED_ITEM_SKIPPED", "NO_EXPECTATIONS_PRODUCED", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        usableForEvidenceMatching: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "deterministic" | "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}>]>;
export declare const TargetInterpretationManifestSchema: z.ZodEffects<z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    interpretationPath: z.ZodEffects<z.ZodString, string, string>;
    interpretationSha256: z.ZodString;
    interpreterName: z.ZodString;
    interpreterVersion: z.ZodString;
    interpreterMode: z.ZodEnum<["deterministic", "manual"]>;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    structuralAnalysisSha256: z.ZodString;
    roleProfilePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    roleProfileSha256: z.ZodOptional<z.ZodString>;
    roleProfileId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    interpreterName: string;
    interpreterVersion: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    interpretationPath: string;
    interpretationSha256: string;
    interpreterMode: "deterministic" | "manual";
    roleProfilePath?: string | undefined;
    roleProfileSha256?: string | undefined;
    roleProfileId?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    interpreterName: string;
    interpreterVersion: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    interpretationPath: string;
    interpretationSha256: string;
    interpreterMode: "deterministic" | "manual";
    roleProfilePath?: string | undefined;
    roleProfileSha256?: string | undefined;
    roleProfileId?: string | undefined;
}>, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    interpreterName: string;
    interpreterVersion: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    interpretationPath: string;
    interpretationSha256: string;
    interpreterMode: "deterministic" | "manual";
    roleProfilePath?: string | undefined;
    roleProfileSha256?: string | undefined;
    roleProfileId?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    interpreterName: string;
    interpreterVersion: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    interpretationPath: string;
    interpretationSha256: string;
    interpreterMode: "deterministic" | "manual";
    roleProfilePath?: string | undefined;
    roleProfileSha256?: string | undefined;
    roleProfileId?: string | undefined;
}>;
export declare const InterpretationTrustStateSchema: z.ZodEnum<["deterministic-approved", "proposed", "human-approved", "human-edited", "rejected"]>;
export declare const ModelIdentitySchema: z.ZodObject<{
    provider: z.ZodString;
    model: z.ZodString;
    endpointType: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    provider: string;
    model: string;
    endpointType?: string | undefined;
}, {
    provider: string;
    model: string;
    endpointType?: string | undefined;
}>;
export declare const ModelGenerationSettingsSchema: z.ZodObject<{
    temperature: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    seed: z.ZodOptional<z.ZodNumber>;
    responseFormat: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    temperature?: number | undefined;
    topP?: number | undefined;
    maxOutputTokens?: number | undefined;
    seed?: number | undefined;
    responseFormat?: string | undefined;
}, {
    temperature?: number | undefined;
    topP?: number | undefined;
    maxOutputTokens?: number | undefined;
    seed?: number | undefined;
    responseFormat?: string | undefined;
}>;
export declare const ProposedExpectationOperationSchema: z.ZodEnum<["add", "replace", "split", "reclassify", "enrich"]>;
export declare const ModelProposedExpectationSchema: z.ZodEffects<z.ZodObject<{
    operation: z.ZodEnum<["add", "replace", "split", "reclassify", "enrich"]>;
    sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
    kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
    statement: z.ZodString;
    necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
    importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
    capabilityTags: z.ZodArray<z.ZodString, "many">;
    interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
    rationale: z.ZodString;
    ambiguityNotes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretationConfidence: "high" | "medium" | "low";
    operation: "replace" | "split" | "add" | "reclassify" | "enrich";
    sourceExpectationIds: string[];
    rationale: string;
    ambiguityNotes: string[];
}, {
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretationConfidence: "high" | "medium" | "low";
    operation: "replace" | "split" | "add" | "reclassify" | "enrich";
    sourceExpectationIds: string[];
    rationale: string;
    ambiguityNotes: string[];
}>, {
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretationConfidence: "high" | "medium" | "low";
    operation: "replace" | "split" | "add" | "reclassify" | "enrich";
    sourceExpectationIds: string[];
    rationale: string;
    ambiguityNotes: string[];
}, {
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretationConfidence: "high" | "medium" | "low";
    operation: "replace" | "split" | "add" | "reclassify" | "enrich";
    sourceExpectationIds: string[];
    rationale: string;
    ambiguityNotes: string[];
}>;
export declare const ModelProposedGroupSchema: z.ZodObject<{
    kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
    title: z.ZodString;
    expectationIndexes: z.ZodArray<z.ZodNumber, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
}, "strict", z.ZodTypeAny, {
    title: string;
    kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    expectationIndexes: number[];
}, {
    title: string;
    kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    expectationIndexes: number[];
}>;
export declare const ModelProposedAmbiguitySchema: z.ZodObject<{
    code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_EXPECTATION_KIND", "MULTIPLE_PLAUSIBLE_INTERPRETATIONS", "INSUFFICIENT_EXPLICIT_STRUCTURE", "ROLE_PROFILE_MISSING", "UNSUPPORTED_SOURCE_STRUCTURE", "OTHER"]>;
    message: z.ZodString;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
    candidateInterpretations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
    message: string;
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    sourceAnalysisItemIds: string[];
    candidateInterpretations?: string[] | undefined;
}, {
    code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
    message: string;
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    sourceAnalysisItemIds: string[];
    candidateInterpretations?: string[] | undefined;
}>;
export declare const ModelProposedWarningSchema: z.ZodObject<{
    code: z.ZodEnum<["ROLE_PROFILE_NOT_CONFIGURED", "ROLE_PROFILE_TITLE_MISMATCH", "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", "PARAGRAPH_NOT_INTERPRETED", "UNCLASSIFIED_ITEM_SKIPPED", "NO_EXPECTATIONS_PRODUCED", "OTHER"]>;
    message: z.ZodString;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
}, "strict", z.ZodTypeAny, {
    code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
    message: string;
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    sourceAnalysisItemIds: string[];
}, {
    code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
    message: string;
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    sourceAnalysisItemIds: string[];
}>;
export declare const ModelInterpretationPayloadSchema: z.ZodObject<{
    proposedExpectations: z.ZodArray<z.ZodEffects<z.ZodObject<{
        operation: z.ZodEnum<["add", "replace", "split", "reclassify", "enrich"]>;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
        rationale: z.ZodString;
        ambiguityNotes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
    }, {
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
    }>, {
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
    }, {
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
    }>, "many">;
    proposedGroups: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
        title: z.ZodString;
        expectationIndexes: z.ZodArray<z.ZodNumber, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIndexes: number[];
    }, {
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIndexes: number[];
    }>, "many">;
    proposedAmbiguities: z.ZodArray<z.ZodObject<{
        code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_EXPECTATION_KIND", "MULTIPLE_PLAUSIBLE_INTERPRETATIONS", "INSUFFICIENT_EXPLICIT_STRUCTURE", "ROLE_PROFILE_MISSING", "UNSUPPORTED_SOURCE_STRUCTURE", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        candidateInterpretations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        code: z.ZodEnum<["ROLE_PROFILE_NOT_CONFIGURED", "ROLE_PROFILE_TITLE_MISMATCH", "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", "PARAGRAPH_NOT_INTERPRETED", "UNCLASSIFIED_ITEM_SKIPPED", "NO_EXPECTATIONS_PRODUCED", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    proposedExpectations: {
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
    }[];
    proposedGroups: {
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIndexes: number[];
    }[];
    proposedAmbiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
}, {
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    proposedExpectations: {
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
    }[];
    proposedGroups: {
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIndexes: number[];
    }[];
    proposedAmbiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
}>;
export declare const ProposedExpectationSchema: z.ZodEffects<z.ZodObject<{
    trustState: z.ZodLiteral<"proposed">;
    operation: z.ZodEnum<["add", "replace", "split", "reclassify", "enrich"]>;
    sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
    kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
    statement: z.ZodString;
    necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
    importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
    capabilityTags: z.ZodArray<z.ZodString, "many">;
    interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
    rationale: z.ZodString;
    ambiguityNotes: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretationConfidence: "high" | "medium" | "low";
    operation: "replace" | "split" | "add" | "reclassify" | "enrich";
    sourceExpectationIds: string[];
    rationale: string;
    ambiguityNotes: string[];
    trustState: "proposed";
}, {
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretationConfidence: "high" | "medium" | "low";
    operation: "replace" | "split" | "add" | "reclassify" | "enrich";
    sourceExpectationIds: string[];
    rationale: string;
    ambiguityNotes: string[];
    trustState: "proposed";
}>, {
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretationConfidence: "high" | "medium" | "low";
    operation: "replace" | "split" | "add" | "reclassify" | "enrich";
    sourceExpectationIds: string[];
    rationale: string;
    ambiguityNotes: string[];
    trustState: "proposed";
}, {
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretationConfidence: "high" | "medium" | "low";
    operation: "replace" | "split" | "add" | "reclassify" | "enrich";
    sourceExpectationIds: string[];
    rationale: string;
    ambiguityNotes: string[];
    trustState: "proposed";
}>;
export declare const ProposedExpectationGroupSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
    title: z.ZodString;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
}, "strict", z.ZodTypeAny, {
    id: string;
    title: string;
    kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    expectationIds: string[];
}, {
    id: string;
    title: string;
    kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    expectationIds: string[];
}>;
export declare const ProposalValidationIssueSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    path?: string | undefined;
}, {
    code: string;
    message: string;
    path?: string | undefined;
}>;
export declare const TargetInterpretationProposalSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    status: z.ZodEnum<["generated", "validation-failed", "ready-for-review", "reviewed"]>;
    model: z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        settings: z.ZodObject<{
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodOptional<z.ZodNumber>;
            seed: z.ZodOptional<z.ZodNumber>;
            responseFormat: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        }, {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        provider: string;
        model: string;
        settings: {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        };
    }, {
        provider: string;
        model: string;
        settings: {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        };
    }>;
    prompt: z.ZodObject<{
        templateId: z.ZodString;
        templateVersion: z.ZodString;
        policyVersion: z.ZodString;
        renderedPromptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        policyVersion: string;
        templateId: string;
        templateVersion: string;
        renderedPromptSha256: string;
    }, {
        policyVersion: string;
        templateId: string;
        templateVersion: string;
        renderedPromptSha256: string;
    }>;
    input: z.ZodObject<{
        targetSha256: z.ZodString;
        structuralAnalysisSha256: z.ZodString;
        deterministicInterpretationSha256: z.ZodString;
        roleProfileSha256: z.ZodOptional<z.ZodString>;
        normalizedModelInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        structuralAnalysisSha256: string;
        deterministicInterpretationSha256: string;
        normalizedModelInputSha256: string;
        roleProfileSha256?: string | undefined;
    }, {
        targetSha256: string;
        structuralAnalysisSha256: string;
        deterministicInterpretationSha256: string;
        normalizedModelInputSha256: string;
        roleProfileSha256?: string | undefined;
    }>;
    proposedExpectations: z.ZodArray<z.ZodEffects<z.ZodObject<{
        trustState: z.ZodLiteral<"proposed">;
        operation: z.ZodEnum<["add", "replace", "split", "reclassify", "enrich"]>;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
        rationale: z.ZodString;
        ambiguityNotes: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
    }, {
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
    }>, {
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
    }, {
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
    }>, "many">;
    proposedGroups: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
        title: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }>, "many">;
    proposedAmbiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_EXPECTATION_KIND", "MULTIPLE_PLAUSIBLE_INTERPRETATIONS", "INSUFFICIENT_EXPLICIT_STRUCTURE", "ROLE_PROFILE_MISSING", "UNSUPPORTED_SOURCE_STRUCTURE", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        candidateInterpretations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["ROLE_PROFILE_NOT_CONFIGURED", "ROLE_PROFILE_TITLE_MISMATCH", "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", "PARAGRAPH_NOT_INTERPRETED", "UNCLASSIFIED_ITEM_SKIPPED", "NO_EXPECTATIONS_PRODUCED", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }>, "many">;
    validationIssues: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        path?: string | undefined;
    }, {
        code: string;
        message: string;
        path?: string | undefined;
    }>, "many">;
    rawResponsePath: z.ZodEffects<z.ZodString, string, string>;
    rawResponseSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    status: "generated" | "validation-failed" | "ready-for-review" | "reviewed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        targetSha256: string;
        structuralAnalysisSha256: string;
        deterministicInterpretationSha256: string;
        normalizedModelInputSha256: string;
        roleProfileSha256?: string | undefined;
    };
    targetType: "role" | "job";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    model: {
        provider: string;
        model: string;
        settings: {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        };
    };
    proposedExpectations: {
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
    }[];
    proposedGroups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    proposedAmbiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    requestFingerprint: string;
    prompt: {
        policyVersion: string;
        templateId: string;
        templateVersion: string;
        renderedPromptSha256: string;
    };
    validationIssues: {
        code: string;
        message: string;
        path?: string | undefined;
    }[];
    rawResponsePath: string;
    rawResponseSha256: string;
}, {
    status: "generated" | "validation-failed" | "ready-for-review" | "reviewed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        targetSha256: string;
        structuralAnalysisSha256: string;
        deterministicInterpretationSha256: string;
        normalizedModelInputSha256: string;
        roleProfileSha256?: string | undefined;
    };
    targetType: "role" | "job";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    model: {
        provider: string;
        model: string;
        settings: {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        };
    };
    proposedExpectations: {
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretationConfidence: "high" | "medium" | "low";
        operation: "replace" | "split" | "add" | "reclassify" | "enrich";
        sourceExpectationIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
    }[];
    proposedGroups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    proposedAmbiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    requestFingerprint: string;
    prompt: {
        policyVersion: string;
        templateId: string;
        templateVersion: string;
        renderedPromptSha256: string;
    };
    validationIssues: {
        code: string;
        message: string;
        path?: string | undefined;
    }[];
    rawResponsePath: string;
    rawResponseSha256: string;
}>;
export declare const InterpretationProposalManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    proposalPath: z.ZodEffects<z.ZodString, string, string>;
    proposalSha256: z.ZodString;
    rawResponsePath: z.ZodEffects<z.ZodString, string, string>;
    rawResponseSha256: z.ZodString;
    provider: z.ZodString;
    model: z.ZodString;
    promptTemplateId: z.ZodString;
    promptTemplateVersion: z.ZodString;
    policyVersion: z.ZodString;
    renderedPromptSha256: z.ZodString;
    targetSha256: z.ZodString;
    structuralAnalysisSha256: z.ZodString;
    deterministicInterpretationSha256: z.ZodString;
    roleProfileSha256: z.ZodOptional<z.ZodString>;
    normalizedModelInputSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    provider: string;
    model: string;
    requestFingerprint: string;
    renderedPromptSha256: string;
    deterministicInterpretationSha256: string;
    normalizedModelInputSha256: string;
    rawResponsePath: string;
    rawResponseSha256: string;
    proposalId: string;
    proposalPath: string;
    proposalSha256: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    roleProfileSha256?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    provider: string;
    model: string;
    requestFingerprint: string;
    renderedPromptSha256: string;
    deterministicInterpretationSha256: string;
    normalizedModelInputSha256: string;
    rawResponsePath: string;
    rawResponseSha256: string;
    proposalId: string;
    proposalPath: string;
    proposalSha256: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    roleProfileSha256?: string | undefined;
}>;
export declare const EditedTargetExpectationSchema: z.ZodObject<{
    kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
    statement: z.ZodString;
    necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
    importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
    capabilityTags: z.ZodArray<z.ZodString, "many">;
    interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
    notes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    interpretationConfidence: "high" | "medium" | "low";
}, {
    notes: string[];
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    interpretationConfidence: "high" | "medium" | "low";
}>;
export declare const ProposalReviewDecisionSchema: z.ZodEffects<z.ZodObject<{
    proposedExpectationId: z.ZodString;
    decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
    editedExpectation: z.ZodOptional<z.ZodObject<{
        kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        interpretationConfidence: "high" | "medium" | "low";
    }, {
        notes: string[];
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        interpretationConfidence: "high" | "medium" | "low";
    }>>;
    reviewNote: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedExpectationId: string;
    decidedAt?: string | undefined;
    editedExpectation?: {
        notes: string[];
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        interpretationConfidence: "high" | "medium" | "low";
    } | undefined;
    reviewNote?: string | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedExpectationId: string;
    decidedAt?: string | undefined;
    editedExpectation?: {
        notes: string[];
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        interpretationConfidence: "high" | "medium" | "low";
    } | undefined;
    reviewNote?: string | undefined;
}>, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedExpectationId: string;
    decidedAt?: string | undefined;
    editedExpectation?: {
        notes: string[];
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        interpretationConfidence: "high" | "medium" | "low";
    } | undefined;
    reviewNote?: string | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedExpectationId: string;
    decidedAt?: string | undefined;
    editedExpectation?: {
        notes: string[];
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        interpretationConfidence: "high" | "medium" | "low";
    } | undefined;
    reviewNote?: string | undefined;
}>;
export declare const InterpretationProposalReviewSchema: z.ZodEffects<z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    status: z.ZodEnum<["in-progress", "completed"]>;
    decisions: z.ZodArray<z.ZodEffects<z.ZodObject<{
        proposedExpectationId: z.ZodString;
        decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
        editedExpectation: z.ZodOptional<z.ZodObject<{
            kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
            statement: z.ZodString;
            necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
            importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
            explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
            capabilityTags: z.ZodArray<z.ZodString, "many">;
            interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
            notes: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        }, {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        }>>;
        reviewNote: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedExpectationId: string;
        decidedAt?: string | undefined;
        editedExpectation?: {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        } | undefined;
        reviewNote?: string | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedExpectationId: string;
        decidedAt?: string | undefined;
        editedExpectation?: {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        } | undefined;
        reviewNote?: string | undefined;
    }>, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedExpectationId: string;
        decidedAt?: string | undefined;
        editedExpectation?: {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        } | undefined;
        reviewNote?: string | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedExpectationId: string;
        decidedAt?: string | undefined;
        editedExpectation?: {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        } | undefined;
        reviewNote?: string | undefined;
    }>, "many">;
    reviewer: z.ZodObject<{
        type: z.ZodLiteral<"human">;
        name: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        type: "human";
        name?: string | undefined;
    }, {
        type: "human";
        name?: string | undefined;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    status: "in-progress" | "completed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    decisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedExpectationId: string;
        decidedAt?: string | undefined;
        editedExpectation?: {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        } | undefined;
        reviewNote?: string | undefined;
    }[];
    targetId: string;
    proposalId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
}, {
    status: "in-progress" | "completed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    decisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedExpectationId: string;
        decidedAt?: string | undefined;
        editedExpectation?: {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        } | undefined;
        reviewNote?: string | undefined;
    }[];
    targetId: string;
    proposalId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
}>, {
    status: "in-progress" | "completed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    decisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedExpectationId: string;
        decidedAt?: string | undefined;
        editedExpectation?: {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        } | undefined;
        reviewNote?: string | undefined;
    }[];
    targetId: string;
    proposalId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
}, {
    status: "in-progress" | "completed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    decisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedExpectationId: string;
        decidedAt?: string | undefined;
        editedExpectation?: {
            notes: string[];
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            interpretationConfidence: "high" | "medium" | "low";
        } | undefined;
        reviewNote?: string | undefined;
    }[];
    targetId: string;
    proposalId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
}>;
export declare const InterpretationProposalReviewManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    reviewPath: z.ZodEffects<z.ZodString, string, string>;
    reviewSha256: z.ZodString;
    proposalSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    proposalId: string;
    proposalSha256: string;
    reviewPath: string;
    reviewSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    proposalId: string;
    proposalSha256: string;
    reviewPath: string;
    reviewSha256: string;
}>;
export declare const ApprovedExpectationProvenanceSchema: z.ZodObject<{
    proposalId: z.ZodString;
    proposedExpectationId: z.ZodString;
    reviewDecision: z.ZodEnum<["accept", "edit"]>;
    reviewer: z.ZodObject<{
        type: z.ZodLiteral<"human">;
        name: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        type: "human";
        name?: string | undefined;
    }, {
        type: "human";
        name?: string | undefined;
    }>;
    modelProvider: z.ZodString;
    modelName: z.ZodString;
    promptTemplateVersion: z.ZodString;
    policyVersion: z.ZodString;
    sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    policyVersion: string;
    sourceExpectationIds: string[];
    proposalId: string;
    promptTemplateVersion: string;
    proposedExpectationId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
    reviewDecision: "accept" | "edit";
    modelProvider: string;
    modelName: string;
}, {
    policyVersion: string;
    sourceExpectationIds: string[];
    proposalId: string;
    promptTemplateVersion: string;
    proposedExpectationId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
    reviewDecision: "accept" | "edit";
    modelProvider: string;
    modelName: string;
}>;
export declare const ApprovedTargetExpectationSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
    statement: z.ZodString;
    necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
    importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
    capabilityTags: z.ZodArray<z.ZodString, "many">;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
    interpretation: z.ZodObject<{
        method: z.ZodEnum<["explicit-role-profile", "explicit-heading", "manual", "deterministic-rule"]>;
        interpreterName: z.ZodString;
        interpreterVersion: z.ZodString;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    }, {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    }>;
    interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
    notes: z.ZodArray<z.ZodString, "many">;
} & {
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
    approvalProvenance: z.ZodOptional<z.ZodObject<{
        proposalId: z.ZodString;
        proposedExpectationId: z.ZodString;
        reviewDecision: z.ZodEnum<["accept", "edit"]>;
        reviewer: z.ZodObject<{
            type: z.ZodLiteral<"human">;
            name: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            type: "human";
            name?: string | undefined;
        }, {
            type: "human";
            name?: string | undefined;
        }>;
        modelProvider: z.ZodString;
        modelName: z.ZodString;
        promptTemplateVersion: z.ZodString;
        policyVersion: z.ZodString;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    }, {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    }>>;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretation: {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    };
    interpretationConfidence: "high" | "medium" | "low";
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    approvalProvenance?: {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    } | undefined;
}, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretation: {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    };
    interpretationConfidence: "high" | "medium" | "low";
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    approvalProvenance?: {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    } | undefined;
}>, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretation: {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    };
    interpretationConfidence: "high" | "medium" | "low";
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    approvalProvenance?: {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    } | undefined;
}, {
    notes: string[];
    id: string;
    kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    statement: string;
    necessity: "unknown" | "required" | "preferred" | "contextual";
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    capabilityTags: string[];
    explicitness: "explicit" | "strongly-implied" | "inferred";
    sourceAnalysisItemIds: string[];
    interpretation: {
        method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
        interpreterName: string;
        interpreterVersion: string;
        policyVersion: string;
    };
    interpretationConfidence: "high" | "medium" | "low";
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    approvalProvenance?: {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    } | undefined;
}>;
export declare const ApprovedTargetInterpretationSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    interpreter: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodLiteral<"manual">;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "manual";
        policyVersion: string;
    }, {
        name: string;
        version: string;
        mode: "manual";
        policyVersion: string;
    }>;
    input: z.ZodObject<{
        targetPath: z.ZodEffects<z.ZodString, string, string>;
        targetSha256: z.ZodString;
        structuralAnalysisPath: z.ZodEffects<z.ZodString, string, string>;
        structuralAnalysisSha256: z.ZodString;
        deterministicInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
        deterministicInterpretationSha256: z.ZodString;
        roleProfilePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        roleProfileSha256: z.ZodOptional<z.ZodString>;
        proposalPath: z.ZodEffects<z.ZodString, string, string>;
        proposalSha256: z.ZodString;
        reviewPath: z.ZodEffects<z.ZodString, string, string>;
        reviewSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        deterministicInterpretationSha256: string;
        proposalPath: string;
        proposalSha256: string;
        reviewPath: string;
        reviewSha256: string;
        deterministicInterpretationPath: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
    }, {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        deterministicInterpretationSha256: string;
        proposalPath: string;
        proposalSha256: string;
        reviewPath: string;
        reviewSha256: string;
        deterministicInterpretationPath: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
    }>;
    expectations: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        explicitness: z.ZodEnum<["explicit", "strongly-implied", "inferred"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["explicit-role-profile", "explicit-heading", "manual", "deterministic-rule"]>;
            interpreterName: z.ZodString;
            interpreterVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }, {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        }>;
        interpretationConfidence: z.ZodEnum<["high", "medium", "low"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    } & {
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        approvalProvenance: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedExpectationId: z.ZodString;
            reviewDecision: z.ZodEnum<["accept", "edit"]>;
            reviewer: z.ZodObject<{
                type: z.ZodLiteral<"human">;
                name: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "human";
                name?: string | undefined;
            }, {
                type: "human";
                name?: string | undefined;
            }>;
            modelProvider: z.ZodString;
            modelName: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        }, {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        }>>;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }>, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }, {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }>, "many">;
    groups: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["core-responsibilities", "required-qualifications", "preferred-qualifications", "leadership-expectations", "technical-expectations", "domain-expectations", "business-expectations", "success-outcomes", "constraints", "candidate-attributes", "context-dependent", "other"]>;
        title: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }, {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_EXPECTATION_KIND", "MULTIPLE_PLAUSIBLE_INTERPRETATIONS", "INSUFFICIENT_EXPLICIT_STRUCTURE", "ROLE_PROFILE_MISSING", "UNSUPPORTED_SOURCE_STRUCTURE", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        candidateInterpretations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }, {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["ROLE_PROFILE_NOT_CONFIGURED", "ROLE_PROFILE_TITLE_MISMATCH", "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", "PARAGRAPH_NOT_INTERPRETED", "UNCLASSIFIED_ITEM_SKIPPED", "NO_EXPECTATIONS_PRODUCED", "OTHER"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }, {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        usableForEvidenceMatching: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }, {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        deterministicInterpretationSha256: string;
        proposalPath: string;
        proposalSha256: string;
        reviewPath: string;
        reviewSha256: string;
        deterministicInterpretationPath: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
    };
    targetType: "role" | "job";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    input: {
        targetPath: string;
        targetSha256: string;
        structuralAnalysisPath: string;
        structuralAnalysisSha256: string;
        deterministicInterpretationSha256: string;
        proposalPath: string;
        proposalSha256: string;
        reviewPath: string;
        reviewSha256: string;
        deterministicInterpretationPath: string;
        roleProfilePath?: string | undefined;
        roleProfileSha256?: string | undefined;
    };
    targetType: "role" | "job";
    targetId: string;
    warnings: {
        code: "OTHER" | "ROLE_PROFILE_NOT_CONFIGURED" | "ROLE_PROFILE_TITLE_MISMATCH" | "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS" | "PARAGRAPH_NOT_INTERPRETED" | "UNCLASSIFIED_ITEM_SKIPPED" | "NO_EXPECTATIONS_PRODUCED";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
    }[];
    expectations: {
        notes: string[];
        id: string;
        kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        statement: string;
        necessity: "unknown" | "required" | "preferred" | "contextual";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        explicitness: "explicit" | "strongly-implied" | "inferred";
        sourceAnalysisItemIds: string[];
        interpretation: {
            method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
            interpreterName: string;
            interpreterVersion: string;
            policyVersion: string;
        };
        interpretationConfidence: "high" | "medium" | "low";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }[];
    interpreter: {
        name: string;
        version: string;
        mode: "manual";
        policyVersion: string;
    };
    groups: {
        id: string;
        title: string;
        kind: "other" | "core-responsibilities" | "required-qualifications" | "preferred-qualifications" | "leadership-expectations" | "technical-expectations" | "domain-expectations" | "business-expectations" | "success-outcomes" | "constraints" | "candidate-attributes" | "context-dependent";
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        expectationIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "AMBIGUOUS_EXPECTATION_KIND" | "MULTIPLE_PLAUSIBLE_INTERPRETATIONS" | "INSUFFICIENT_EXPLICIT_STRUCTURE" | "ROLE_PROFILE_MISSING" | "UNSUPPORTED_SOURCE_STRUCTURE" | "OTHER";
        message: string;
        id: string;
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        sourceAnalysisItemIds: string[];
        candidateInterpretations?: string[] | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        usableForEvidenceMatching: boolean;
        blockingReasons: string[];
    };
}>;
export declare const ApprovedTargetInterpretationManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
    approvedInterpretationSha256: z.ZodString;
    interpreterName: z.ZodString;
    interpreterVersion: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    structuralAnalysisSha256: z.ZodString;
    deterministicInterpretationSha256: z.ZodString;
    roleProfileSha256: z.ZodOptional<z.ZodString>;
    proposalId: z.ZodString;
    proposalSha256: z.ZodString;
    reviewSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    interpreterName: string;
    interpreterVersion: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    deterministicInterpretationSha256: string;
    proposalId: string;
    proposalSha256: string;
    reviewSha256: string;
    approvedInterpretationPath: string;
    approvedInterpretationSha256: string;
    roleProfileSha256?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    interpreterName: string;
    interpreterVersion: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    deterministicInterpretationSha256: string;
    proposalId: string;
    proposalSha256: string;
    reviewSha256: string;
    approvedInterpretationPath: string;
    approvedInterpretationSha256: string;
    roleProfileSha256?: string | undefined;
}>;
export declare const EvidenceMatchTypeSchema: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
export declare const EvidenceMatchCoverageSchema: z.ZodEnum<["full", "partial", "conflicting"]>;
export declare const EvidenceStrengthSchema: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
export declare const TemporalRelevanceSchema: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
export declare const EvidenceMatchConfidenceSchema: z.ZodEnum<["high", "medium", "low"]>;
export declare const EvidenceMatchTrustStateSchema: z.ZodEnum<["manual-approved", "proposed", "human-approved", "human-edited", "rejected"]>;
export declare const ExpectationCoverageStatusSchema: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
export declare const ExpectationMatchProvenanceSchema: z.ZodObject<{
    targetId: z.ZodString;
    approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
    approvedInterpretationSha256: z.ZodString;
    expectationId: z.ZodString;
    expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
        sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
        path: z.ZodString;
        sha256: z.ZodString;
        startLine: z.ZodNumber;
        endLine: z.ZodNumber;
        startOffset: z.ZodOptional<z.ZodNumber>;
        endOffset: z.ZodOptional<z.ZodNumber>;
        excerptSha256: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }, {
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    }>, z.ZodObject<{
        sourceType: z.ZodLiteral<"role-profile-json">;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        jsonPointer: z.ZodString;
        excerptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }, {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    }>]>, "many">;
    approvalProvenance: z.ZodOptional<z.ZodObject<{
        proposalId: z.ZodString;
        proposedExpectationId: z.ZodString;
        reviewDecision: z.ZodEnum<["accept", "edit"]>;
        reviewer: z.ZodObject<{
            type: z.ZodLiteral<"human">;
            name: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            type: "human";
            name?: string | undefined;
        }, {
            type: "human";
            name?: string | undefined;
        }>;
        modelProvider: z.ZodString;
        modelName: z.ZodString;
        promptTemplateVersion: z.ZodString;
        policyVersion: z.ZodString;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    }, {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    }>>;
}, "strict", z.ZodTypeAny, {
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    targetId: string;
    sourceAnalysisItemIds: string[];
    approvedInterpretationPath: string;
    approvedInterpretationSha256: string;
    expectationId: string;
    expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
    approvalProvenance?: {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    } | undefined;
}, {
    sourceReferences: ({
        sha256: string;
        path: string;
        sourceType: "job-description-markdown" | "target-json";
        startLine: number;
        endLine: number;
        excerptSha256: string;
        startOffset?: number | undefined;
        endOffset?: number | undefined;
    } | {
        sha256: string;
        path: string;
        sourceType: "role-profile-json";
        excerptSha256: string;
        jsonPointer: string;
    })[];
    targetId: string;
    sourceAnalysisItemIds: string[];
    approvedInterpretationPath: string;
    approvedInterpretationSha256: string;
    expectationId: string;
    expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
    approvalProvenance?: {
        policyVersion: string;
        sourceExpectationIds: string[];
        proposalId: string;
        promptTemplateVersion: string;
        proposedExpectationId: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
    } | undefined;
}>;
export declare const EvidenceSourceProvenanceSchema: z.ZodObject<{
    sourceId: z.ZodString;
    sourceType: z.ZodString;
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
    status: z.ZodLiteral<"active">;
    visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
    status: "active";
    sourceType: string;
    sourceId: string;
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
}, {
    sha256: string;
    path: string;
    status: "active";
    sourceType: string;
    sourceId: string;
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
}>;
export declare const EvidenceMatchProvenanceSchema: z.ZodObject<{
    evidenceId: z.ZodString;
    evidenceType: z.ZodString;
    reviewedStatus: z.ZodLiteral<"approved">;
    active: z.ZodLiteral<true>;
    evidenceArtifactSha256: z.ZodString;
    reviewArtifactSha256: z.ZodString;
    supportingClaimIds: z.ZodArray<z.ZodString, "many">;
    sources: z.ZodArray<z.ZodObject<{
        sourceId: z.ZodString;
        sourceType: z.ZodString;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        status: z.ZodLiteral<"active">;
        visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        status: "active";
        sourceType: string;
        sourceId: string;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    }, {
        sha256: string;
        path: string;
        status: "active";
        sourceType: string;
        sourceId: string;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    active: true;
    evidenceId: string;
    evidenceType: string;
    reviewedStatus: "approved";
    evidenceArtifactSha256: string;
    reviewArtifactSha256: string;
    supportingClaimIds: string[];
    sources: {
        sha256: string;
        path: string;
        status: "active";
        sourceType: string;
        sourceId: string;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    }[];
}, {
    active: true;
    evidenceId: string;
    evidenceType: string;
    reviewedStatus: "approved";
    evidenceArtifactSha256: string;
    reviewArtifactSha256: string;
    supportingClaimIds: string[];
    sources: {
        sha256: string;
        path: string;
        status: "active";
        sourceType: string;
        sourceId: string;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    }[];
}>;
export declare const EvidenceSnapshotEntrySchema: z.ZodObject<{
    evidenceId: z.ZodString;
    evidenceType: z.ZodString;
    evidenceArtifactSha256: z.ZodString;
    reviewArtifactSha256: z.ZodString;
    supportingClaimIds: z.ZodArray<z.ZodString, "many">;
    active: z.ZodLiteral<true>;
    reviewed: z.ZodLiteral<true>;
    provenance: z.ZodObject<{
        evidenceId: z.ZodString;
        evidenceType: z.ZodString;
        reviewedStatus: z.ZodLiteral<"approved">;
        active: z.ZodLiteral<true>;
        evidenceArtifactSha256: z.ZodString;
        reviewArtifactSha256: z.ZodString;
        supportingClaimIds: z.ZodArray<z.ZodString, "many">;
        sources: z.ZodArray<z.ZodObject<{
            sourceId: z.ZodString;
            sourceType: z.ZodString;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            status: z.ZodLiteral<"active">;
            visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }, {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }, {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }>;
}, "strict", z.ZodTypeAny, {
    reviewed: true;
    active: true;
    evidenceId: string;
    evidenceType: string;
    evidenceArtifactSha256: string;
    reviewArtifactSha256: string;
    supportingClaimIds: string[];
    provenance: {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    };
}, {
    reviewed: true;
    active: true;
    evidenceId: string;
    evidenceType: string;
    evidenceArtifactSha256: string;
    reviewArtifactSha256: string;
    supportingClaimIds: string[];
    provenance: {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    };
}>;
export declare const EvidenceSnapshotSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    policyVersion: z.ZodString;
    sourcesPath: z.ZodEffects<z.ZodString, string, string>;
    sourcesSha256: z.ZodString;
    evidenceItemsPath: z.ZodEffects<z.ZodString, string, string>;
    evidenceItemsSha256: z.ZodString;
    claimsPath: z.ZodEffects<z.ZodString, string, string>;
    claimsSha256: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        evidenceType: z.ZodString;
        evidenceArtifactSha256: z.ZodString;
        reviewArtifactSha256: z.ZodString;
        supportingClaimIds: z.ZodArray<z.ZodString, "many">;
        active: z.ZodLiteral<true>;
        reviewed: z.ZodLiteral<true>;
        provenance: z.ZodObject<{
            evidenceId: z.ZodString;
            evidenceType: z.ZodString;
            reviewedStatus: z.ZodLiteral<"approved">;
            active: z.ZodLiteral<true>;
            evidenceArtifactSha256: z.ZodString;
            reviewArtifactSha256: z.ZodString;
            supportingClaimIds: z.ZodArray<z.ZodString, "many">;
            sources: z.ZodArray<z.ZodObject<{
                sourceId: z.ZodString;
                sourceType: z.ZodString;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                status: z.ZodLiteral<"active">;
                visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }>;
    }, "strict", z.ZodTypeAny, {
        reviewed: true;
        active: true;
        evidenceId: string;
        evidenceType: string;
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        provenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        };
    }, {
        reviewed: true;
        active: true;
        evidenceId: string;
        evidenceType: string;
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        provenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        };
    }>, "many">;
    eligibleEvidenceIds: z.ZodArray<z.ZodString, "many">;
    eligibleEvidenceSetSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    entries: {
        reviewed: true;
        active: true;
        evidenceId: string;
        evidenceType: string;
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        provenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        };
    }[];
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    policyVersion: string;
    sourcesPath: string;
    sourcesSha256: string;
    evidenceItemsPath: string;
    evidenceItemsSha256: string;
    claimsPath: string;
    claimsSha256: string;
    eligibleEvidenceIds: string[];
    eligibleEvidenceSetSha256: string;
}, {
    entries: {
        reviewed: true;
        active: true;
        evidenceId: string;
        evidenceType: string;
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        provenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        };
    }[];
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    policyVersion: string;
    sourcesPath: string;
    sourcesSha256: string;
    evidenceItemsPath: string;
    evidenceItemsSha256: string;
    claimsPath: string;
    claimsSha256: string;
    eligibleEvidenceIds: string[];
    eligibleEvidenceSetSha256: string;
}>;
export declare const EvidenceSnapshotManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    snapshotPath: z.ZodEffects<z.ZodString, string, string>;
    snapshotSha256: z.ZodString;
    policyVersion: z.ZodString;
    sourcesSha256: z.ZodString;
    evidenceItemsSha256: z.ZodString;
    claimsSha256: z.ZodString;
    eligibleEvidenceSetSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    policyVersion: string;
    sourcesSha256: string;
    evidenceItemsSha256: string;
    claimsSha256: string;
    eligibleEvidenceSetSha256: string;
    snapshotPath: string;
    snapshotSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    policyVersion: string;
    sourcesSha256: string;
    evidenceItemsSha256: string;
    claimsSha256: string;
    eligibleEvidenceSetSha256: string;
    snapshotPath: string;
    snapshotSha256: string;
}>;
export declare const EvidenceMatchInterpretationSchema: z.ZodObject<{
    method: z.ZodEnum<["manual", "deterministic-rule", "model-assisted"]>;
    matcherName: z.ZodString;
    matcherVersion: z.ZodString;
    policyVersion: z.ZodString;
}, "strict", z.ZodTypeAny, {
    method: "manual" | "deterministic-rule" | "model-assisted";
    policyVersion: string;
    matcherName: string;
    matcherVersion: string;
}, {
    method: "manual" | "deterministic-rule" | "model-assisted";
    policyVersion: string;
    matcherName: string;
    matcherVersion: string;
}>;
export declare const MatchApprovalProvenanceSchema: z.ZodObject<{
    proposalId: z.ZodString;
    proposedMatchId: z.ZodString;
    reviewDecision: z.ZodEnum<["accept", "edit"]>;
    reviewer: z.ZodObject<{
        type: z.ZodLiteral<"human">;
        name: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        type: "human";
        name?: string | undefined;
    }, {
        type: "human";
        name?: string | undefined;
    }>;
    modelProvider: z.ZodString;
    modelName: z.ZodString;
    promptTemplateVersion: z.ZodString;
    policyVersion: z.ZodString;
}, "strict", z.ZodTypeAny, {
    policyVersion: string;
    proposalId: string;
    promptTemplateVersion: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
    reviewDecision: "accept" | "edit";
    modelProvider: string;
    modelName: string;
    proposedMatchId: string;
}, {
    policyVersion: string;
    proposalId: string;
    promptTemplateVersion: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
    reviewDecision: "accept" | "edit";
    modelProvider: string;
    modelName: string;
    proposedMatchId: string;
}>;
export declare const EvidenceMatchSchema: z.ZodObject<{
    id: z.ZodString;
    expectationId: z.ZodString;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
    coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
    evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
    temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
    rationale: z.ZodString;
    expectationProvenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
        approvedInterpretationSha256: z.ZodString;
        expectationId: z.ZodString;
        expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        approvalProvenance: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedExpectationId: z.ZodString;
            reviewDecision: z.ZodEnum<["accept", "edit"]>;
            reviewer: z.ZodObject<{
                type: z.ZodLiteral<"human">;
                name: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "human";
                name?: string | undefined;
            }, {
                type: "human";
                name?: string | undefined;
            }>;
            modelProvider: z.ZodString;
            modelName: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        }, {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        }>>;
    }, "strict", z.ZodTypeAny, {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }, {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }>;
    evidenceProvenance: z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        evidenceType: z.ZodString;
        reviewedStatus: z.ZodLiteral<"approved">;
        active: z.ZodLiteral<true>;
        evidenceArtifactSha256: z.ZodString;
        reviewArtifactSha256: z.ZodString;
        supportingClaimIds: z.ZodArray<z.ZodString, "many">;
        sources: z.ZodArray<z.ZodObject<{
            sourceId: z.ZodString;
            sourceType: z.ZodString;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            status: z.ZodLiteral<"active">;
            visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }, {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }, {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }>, "many">;
    trustState: z.ZodEnum<["manual-approved", "human-approved", "human-edited"]>;
    interpretation: z.ZodObject<{
        method: z.ZodEnum<["manual", "deterministic-rule", "model-assisted"]>;
        matcherName: z.ZodString;
        matcherVersion: z.ZodString;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        method: "manual" | "deterministic-rule" | "model-assisted";
        policyVersion: string;
        matcherName: string;
        matcherVersion: string;
    }, {
        method: "manual" | "deterministic-rule" | "model-assisted";
        policyVersion: string;
        matcherName: string;
        matcherVersion: string;
    }>;
    matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
    limitations: z.ZodArray<z.ZodString, "many">;
    notes: z.ZodArray<z.ZodString, "many">;
    approvalProvenance: z.ZodOptional<z.ZodObject<{
        proposalId: z.ZodString;
        proposedMatchId: z.ZodString;
        reviewDecision: z.ZodEnum<["accept", "edit"]>;
        reviewer: z.ZodObject<{
            type: z.ZodLiteral<"human">;
            name: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            type: "human";
            name?: string | undefined;
        }, {
            type: "human";
            name?: string | undefined;
        }>;
        modelProvider: z.ZodString;
        modelName: z.ZodString;
        promptTemplateVersion: z.ZodString;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        policyVersion: string;
        proposalId: string;
        promptTemplateVersion: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
        proposedMatchId: string;
    }, {
        policyVersion: string;
        proposalId: string;
        promptTemplateVersion: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
        proposedMatchId: string;
    }>>;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    id: string;
    interpretation: {
        method: "manual" | "deterministic-rule" | "model-assisted";
        policyVersion: string;
        matcherName: string;
        matcherVersion: string;
    };
    rationale: string;
    trustState: "human-approved" | "human-edited" | "manual-approved";
    expectationId: string;
    evidenceIds: string[];
    matchType: "partial" | "direct" | "supporting" | "contradictory";
    coverage: "partial" | "full" | "conflicting";
    evidenceStrength: "unknown" | "medium" | "strong" | "weak";
    temporalRelevance: "unknown" | "current" | "recent" | "historical";
    expectationProvenance: {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    };
    evidenceProvenance: {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }[];
    matchConfidence: "high" | "medium" | "low";
    limitations: string[];
    approvalProvenance?: {
        policyVersion: string;
        proposalId: string;
        promptTemplateVersion: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
        proposedMatchId: string;
    } | undefined;
}, {
    notes: string[];
    id: string;
    interpretation: {
        method: "manual" | "deterministic-rule" | "model-assisted";
        policyVersion: string;
        matcherName: string;
        matcherVersion: string;
    };
    rationale: string;
    trustState: "human-approved" | "human-edited" | "manual-approved";
    expectationId: string;
    evidenceIds: string[];
    matchType: "partial" | "direct" | "supporting" | "contradictory";
    coverage: "partial" | "full" | "conflicting";
    evidenceStrength: "unknown" | "medium" | "strong" | "weak";
    temporalRelevance: "unknown" | "current" | "recent" | "historical";
    expectationProvenance: {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    };
    evidenceProvenance: {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }[];
    matchConfidence: "high" | "medium" | "low";
    limitations: string[];
    approvalProvenance?: {
        policyVersion: string;
        proposalId: string;
        promptTemplateVersion: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        modelProvider: string;
        modelName: string;
        proposedMatchId: string;
    } | undefined;
}>;
export declare const ExpectationCoverageRecordSchema: z.ZodObject<{
    id: z.ZodString;
    expectationId: z.ZodString;
    status: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    proposedMatchIds: z.ZodArray<z.ZodString, "many">;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
    notes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
    id: string;
    blockingReasons: string[];
    expectationId: string;
    approvedMatchIds: string[];
    proposedMatchIds: string[];
}, {
    notes: string[];
    status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
    id: string;
    blockingReasons: string[];
    expectationId: string;
    approvedMatchIds: string[];
    proposedMatchIds: string[];
}>;
export declare const EvidenceMatchingWarningSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["NO_ELIGIBLE_EVIDENCE", "NO_ELIGIBLE_EXPECTATIONS", "EXPECTATION_NOT_ASSESSED", "EXPECTATION_UNSUPPORTED", "ONLY_INDIRECT_EVIDENCE_FOUND", "ONLY_HISTORICAL_EVIDENCE_FOUND", "CONFLICTING_EVIDENCE_FOUND", "EVIDENCE_BECAME_INACTIVE", "EVIDENCE_REVIEW_STATUS_CHANGED", "UNKNOWN_MATCH_TYPE_PROPOSED", "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW", "EVIDENCE_NOT_FOUND", "EVIDENCE_PRESENT_BUT_TOO_GENERAL", "EVIDENCE_PRESENT_BUT_OUTDATED", "EVIDENCE_PRESENT_BUT_INDIRECT", "EVIDENCE_PRESENT_BUT_UNREVIEWED"]>;
    message: z.ZodString;
    expectationId: z.ZodOptional<z.ZodString>;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
    message: string;
    id: string;
    evidenceIds: string[];
    expectationId?: string | undefined;
}, {
    code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
    message: string;
    id: string;
    evidenceIds: string[];
    expectationId?: string | undefined;
}>;
export declare const EvidenceMatchingAmbiguitySchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS", "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR", "DIRECT_VS_SUPPORTING_UNCLEAR", "TEMPORAL_RELEVANCE_UNCLEAR", "CONTRADICTION_UNCLEAR"]>;
    message: z.ZodString;
    expectationId: z.ZodOptional<z.ZodString>;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
    message: string;
    id: string;
    evidenceIds: string[];
    expectationId?: string | undefined;
}, {
    code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
    message: string;
    id: string;
    evidenceIds: string[];
    expectationId?: string | undefined;
}>;
export declare const EvidenceMatchingCompletenessSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodEnum<["empty", "partial", "complete"]>;
    assessedExpectationCount: z.ZodNumber;
    totalEligibleExpectationCount: z.ZodNumber;
    usableForFitAssessment: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    assessedExpectationCount: number;
    totalEligibleExpectationCount: number;
    usableForFitAssessment: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    assessedExpectationCount: number;
    totalEligibleExpectationCount: number;
    usableForFitAssessment: boolean;
}>, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    assessedExpectationCount: number;
    totalEligibleExpectationCount: number;
    usableForFitAssessment: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    assessedExpectationCount: number;
    totalEligibleExpectationCount: number;
    usableForFitAssessment: boolean;
}>;
export declare const RoleTargetEvidenceMatchingSchema: z.ZodObject<{
    targetType: z.ZodLiteral<"role">;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    approvedInterpretation: z.ZodObject<{
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    }, {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    }>;
    evidenceSnapshot: z.ZodObject<{
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
        eligibleEvidenceIds: z.ZodArray<z.ZodString, "many">;
        eligibleEvidenceSetSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    }, {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    }>;
    matches: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
        coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
        temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
        rationale: z.ZodString;
        expectationProvenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
            approvedInterpretationSha256: z.ZodString;
            expectationId: z.ZodString;
            expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
            sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
            sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
                sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
                path: z.ZodString;
                sha256: z.ZodString;
                startLine: z.ZodNumber;
                endLine: z.ZodNumber;
                startOffset: z.ZodOptional<z.ZodNumber>;
                endOffset: z.ZodOptional<z.ZodNumber>;
                excerptSha256: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, z.ZodObject<{
                sourceType: z.ZodLiteral<"role-profile-json">;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                jsonPointer: z.ZodString;
                excerptSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }>]>, "many">;
            approvalProvenance: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedExpectationId: z.ZodString;
                reviewDecision: z.ZodEnum<["accept", "edit"]>;
                reviewer: z.ZodObject<{
                    type: z.ZodLiteral<"human">;
                    name: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    type: "human";
                    name?: string | undefined;
                }, {
                    type: "human";
                    name?: string | undefined;
                }>;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }>>;
        }, "strict", z.ZodTypeAny, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }>;
        evidenceProvenance: z.ZodArray<z.ZodObject<{
            evidenceId: z.ZodString;
            evidenceType: z.ZodString;
            reviewedStatus: z.ZodLiteral<"approved">;
            active: z.ZodLiteral<true>;
            evidenceArtifactSha256: z.ZodString;
            reviewArtifactSha256: z.ZodString;
            supportingClaimIds: z.ZodArray<z.ZodString, "many">;
            sources: z.ZodArray<z.ZodObject<{
                sourceId: z.ZodString;
                sourceType: z.ZodString;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                status: z.ZodLiteral<"active">;
                visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }>, "many">;
        trustState: z.ZodEnum<["manual-approved", "human-approved", "human-edited"]>;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["manual", "deterministic-rule", "model-assisted"]>;
            matcherName: z.ZodString;
            matcherVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }>;
        matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
        limitations: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
        approvalProvenance: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedMatchId: z.ZodString;
            reviewDecision: z.ZodEnum<["accept", "edit"]>;
            reviewer: z.ZodObject<{
                type: z.ZodLiteral<"human">;
                name: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "human";
                name?: string | undefined;
            }, {
                type: "human";
                name?: string | undefined;
            }>;
            modelProvider: z.ZodString;
            modelName: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }>>;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }>, "many">;
    expectationCoverage: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        status: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        proposedMatchIds: z.ZodArray<z.ZodString, "many">;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_ELIGIBLE_EVIDENCE", "NO_ELIGIBLE_EXPECTATIONS", "EXPECTATION_NOT_ASSESSED", "EXPECTATION_UNSUPPORTED", "ONLY_INDIRECT_EVIDENCE_FOUND", "ONLY_HISTORICAL_EVIDENCE_FOUND", "CONFLICTING_EVIDENCE_FOUND", "EVIDENCE_BECAME_INACTIVE", "EVIDENCE_REVIEW_STATUS_CHANGED", "UNKNOWN_MATCH_TYPE_PROPOSED", "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW", "EVIDENCE_NOT_FOUND", "EVIDENCE_PRESENT_BUT_TOO_GENERAL", "EVIDENCE_PRESENT_BUT_OUTDATED", "EVIDENCE_PRESENT_BUT_INDIRECT", "EVIDENCE_PRESENT_BUT_UNREVIEWED"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS", "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR", "DIRECT_VS_SUPPORTING_UNCLEAR", "TEMPORAL_RELEVANCE_UNCLEAR", "CONTRADICTION_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        assessedExpectationCount: z.ZodNumber;
        totalEligibleExpectationCount: z.ZodNumber;
        usableForFitAssessment: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    evidenceSnapshot: {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    };
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    expectationCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    evidenceSnapshot: {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    };
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    expectationCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }[];
}>;
export declare const JobTargetEvidenceMatchingSchema: z.ZodObject<{
    targetType: z.ZodLiteral<"job">;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    approvedInterpretation: z.ZodObject<{
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    }, {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    }>;
    evidenceSnapshot: z.ZodObject<{
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
        eligibleEvidenceIds: z.ZodArray<z.ZodString, "many">;
        eligibleEvidenceSetSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    }, {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    }>;
    matches: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
        coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
        temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
        rationale: z.ZodString;
        expectationProvenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
            approvedInterpretationSha256: z.ZodString;
            expectationId: z.ZodString;
            expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
            sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
            sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
                sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
                path: z.ZodString;
                sha256: z.ZodString;
                startLine: z.ZodNumber;
                endLine: z.ZodNumber;
                startOffset: z.ZodOptional<z.ZodNumber>;
                endOffset: z.ZodOptional<z.ZodNumber>;
                excerptSha256: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, z.ZodObject<{
                sourceType: z.ZodLiteral<"role-profile-json">;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                jsonPointer: z.ZodString;
                excerptSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }>]>, "many">;
            approvalProvenance: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedExpectationId: z.ZodString;
                reviewDecision: z.ZodEnum<["accept", "edit"]>;
                reviewer: z.ZodObject<{
                    type: z.ZodLiteral<"human">;
                    name: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    type: "human";
                    name?: string | undefined;
                }, {
                    type: "human";
                    name?: string | undefined;
                }>;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }>>;
        }, "strict", z.ZodTypeAny, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }>;
        evidenceProvenance: z.ZodArray<z.ZodObject<{
            evidenceId: z.ZodString;
            evidenceType: z.ZodString;
            reviewedStatus: z.ZodLiteral<"approved">;
            active: z.ZodLiteral<true>;
            evidenceArtifactSha256: z.ZodString;
            reviewArtifactSha256: z.ZodString;
            supportingClaimIds: z.ZodArray<z.ZodString, "many">;
            sources: z.ZodArray<z.ZodObject<{
                sourceId: z.ZodString;
                sourceType: z.ZodString;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                status: z.ZodLiteral<"active">;
                visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }>, "many">;
        trustState: z.ZodEnum<["manual-approved", "human-approved", "human-edited"]>;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["manual", "deterministic-rule", "model-assisted"]>;
            matcherName: z.ZodString;
            matcherVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }>;
        matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
        limitations: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
        approvalProvenance: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedMatchId: z.ZodString;
            reviewDecision: z.ZodEnum<["accept", "edit"]>;
            reviewer: z.ZodObject<{
                type: z.ZodLiteral<"human">;
                name: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "human";
                name?: string | undefined;
            }, {
                type: "human";
                name?: string | undefined;
            }>;
            modelProvider: z.ZodString;
            modelName: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }>>;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }>, "many">;
    expectationCoverage: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        status: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        proposedMatchIds: z.ZodArray<z.ZodString, "many">;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_ELIGIBLE_EVIDENCE", "NO_ELIGIBLE_EXPECTATIONS", "EXPECTATION_NOT_ASSESSED", "EXPECTATION_UNSUPPORTED", "ONLY_INDIRECT_EVIDENCE_FOUND", "ONLY_HISTORICAL_EVIDENCE_FOUND", "CONFLICTING_EVIDENCE_FOUND", "EVIDENCE_BECAME_INACTIVE", "EVIDENCE_REVIEW_STATUS_CHANGED", "UNKNOWN_MATCH_TYPE_PROPOSED", "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW", "EVIDENCE_NOT_FOUND", "EVIDENCE_PRESENT_BUT_TOO_GENERAL", "EVIDENCE_PRESENT_BUT_OUTDATED", "EVIDENCE_PRESENT_BUT_INDIRECT", "EVIDENCE_PRESENT_BUT_UNREVIEWED"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS", "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR", "DIRECT_VS_SUPPORTING_UNCLEAR", "TEMPORAL_RELEVANCE_UNCLEAR", "CONTRADICTION_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        assessedExpectationCount: z.ZodNumber;
        totalEligibleExpectationCount: z.ZodNumber;
        usableForFitAssessment: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    evidenceSnapshot: {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    };
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    expectationCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    evidenceSnapshot: {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    };
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    expectationCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }[];
}>;
export declare const TargetEvidenceMatchingSchema: z.ZodDiscriminatedUnion<"targetType", [z.ZodObject<{
    targetType: z.ZodLiteral<"role">;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    approvedInterpretation: z.ZodObject<{
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    }, {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    }>;
    evidenceSnapshot: z.ZodObject<{
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
        eligibleEvidenceIds: z.ZodArray<z.ZodString, "many">;
        eligibleEvidenceSetSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    }, {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    }>;
    matches: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
        coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
        temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
        rationale: z.ZodString;
        expectationProvenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
            approvedInterpretationSha256: z.ZodString;
            expectationId: z.ZodString;
            expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
            sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
            sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
                sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
                path: z.ZodString;
                sha256: z.ZodString;
                startLine: z.ZodNumber;
                endLine: z.ZodNumber;
                startOffset: z.ZodOptional<z.ZodNumber>;
                endOffset: z.ZodOptional<z.ZodNumber>;
                excerptSha256: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, z.ZodObject<{
                sourceType: z.ZodLiteral<"role-profile-json">;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                jsonPointer: z.ZodString;
                excerptSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }>]>, "many">;
            approvalProvenance: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedExpectationId: z.ZodString;
                reviewDecision: z.ZodEnum<["accept", "edit"]>;
                reviewer: z.ZodObject<{
                    type: z.ZodLiteral<"human">;
                    name: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    type: "human";
                    name?: string | undefined;
                }, {
                    type: "human";
                    name?: string | undefined;
                }>;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }>>;
        }, "strict", z.ZodTypeAny, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }>;
        evidenceProvenance: z.ZodArray<z.ZodObject<{
            evidenceId: z.ZodString;
            evidenceType: z.ZodString;
            reviewedStatus: z.ZodLiteral<"approved">;
            active: z.ZodLiteral<true>;
            evidenceArtifactSha256: z.ZodString;
            reviewArtifactSha256: z.ZodString;
            supportingClaimIds: z.ZodArray<z.ZodString, "many">;
            sources: z.ZodArray<z.ZodObject<{
                sourceId: z.ZodString;
                sourceType: z.ZodString;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                status: z.ZodLiteral<"active">;
                visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }>, "many">;
        trustState: z.ZodEnum<["manual-approved", "human-approved", "human-edited"]>;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["manual", "deterministic-rule", "model-assisted"]>;
            matcherName: z.ZodString;
            matcherVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }>;
        matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
        limitations: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
        approvalProvenance: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedMatchId: z.ZodString;
            reviewDecision: z.ZodEnum<["accept", "edit"]>;
            reviewer: z.ZodObject<{
                type: z.ZodLiteral<"human">;
                name: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "human";
                name?: string | undefined;
            }, {
                type: "human";
                name?: string | undefined;
            }>;
            modelProvider: z.ZodString;
            modelName: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }>>;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }>, "many">;
    expectationCoverage: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        status: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        proposedMatchIds: z.ZodArray<z.ZodString, "many">;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_ELIGIBLE_EVIDENCE", "NO_ELIGIBLE_EXPECTATIONS", "EXPECTATION_NOT_ASSESSED", "EXPECTATION_UNSUPPORTED", "ONLY_INDIRECT_EVIDENCE_FOUND", "ONLY_HISTORICAL_EVIDENCE_FOUND", "CONFLICTING_EVIDENCE_FOUND", "EVIDENCE_BECAME_INACTIVE", "EVIDENCE_REVIEW_STATUS_CHANGED", "UNKNOWN_MATCH_TYPE_PROPOSED", "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW", "EVIDENCE_NOT_FOUND", "EVIDENCE_PRESENT_BUT_TOO_GENERAL", "EVIDENCE_PRESENT_BUT_OUTDATED", "EVIDENCE_PRESENT_BUT_INDIRECT", "EVIDENCE_PRESENT_BUT_UNREVIEWED"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS", "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR", "DIRECT_VS_SUPPORTING_UNCLEAR", "TEMPORAL_RELEVANCE_UNCLEAR", "CONTRADICTION_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        assessedExpectationCount: z.ZodNumber;
        totalEligibleExpectationCount: z.ZodNumber;
        usableForFitAssessment: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    evidenceSnapshot: {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    };
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    expectationCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    evidenceSnapshot: {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    };
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    expectationCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }[];
}>, z.ZodObject<{
    targetType: z.ZodLiteral<"job">;
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    approvedInterpretation: z.ZodObject<{
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    }, {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    }>;
    evidenceSnapshot: z.ZodObject<{
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
        eligibleEvidenceIds: z.ZodArray<z.ZodString, "many">;
        eligibleEvidenceSetSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    }, {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    }>;
    matches: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
        coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
        temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
        rationale: z.ZodString;
        expectationProvenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
            approvedInterpretationSha256: z.ZodString;
            expectationId: z.ZodString;
            expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
            sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
            sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
                sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
                path: z.ZodString;
                sha256: z.ZodString;
                startLine: z.ZodNumber;
                endLine: z.ZodNumber;
                startOffset: z.ZodOptional<z.ZodNumber>;
                endOffset: z.ZodOptional<z.ZodNumber>;
                excerptSha256: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, z.ZodObject<{
                sourceType: z.ZodLiteral<"role-profile-json">;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                jsonPointer: z.ZodString;
                excerptSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }>]>, "many">;
            approvalProvenance: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedExpectationId: z.ZodString;
                reviewDecision: z.ZodEnum<["accept", "edit"]>;
                reviewer: z.ZodObject<{
                    type: z.ZodLiteral<"human">;
                    name: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    type: "human";
                    name?: string | undefined;
                }, {
                    type: "human";
                    name?: string | undefined;
                }>;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }>>;
        }, "strict", z.ZodTypeAny, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }>;
        evidenceProvenance: z.ZodArray<z.ZodObject<{
            evidenceId: z.ZodString;
            evidenceType: z.ZodString;
            reviewedStatus: z.ZodLiteral<"approved">;
            active: z.ZodLiteral<true>;
            evidenceArtifactSha256: z.ZodString;
            reviewArtifactSha256: z.ZodString;
            supportingClaimIds: z.ZodArray<z.ZodString, "many">;
            sources: z.ZodArray<z.ZodObject<{
                sourceId: z.ZodString;
                sourceType: z.ZodString;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                status: z.ZodLiteral<"active">;
                visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }>, "many">;
        trustState: z.ZodEnum<["manual-approved", "human-approved", "human-edited"]>;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["manual", "deterministic-rule", "model-assisted"]>;
            matcherName: z.ZodString;
            matcherVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }>;
        matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
        limitations: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
        approvalProvenance: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedMatchId: z.ZodString;
            reviewDecision: z.ZodEnum<["accept", "edit"]>;
            reviewer: z.ZodObject<{
                type: z.ZodLiteral<"human">;
                name: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "human";
                name?: string | undefined;
            }, {
                type: "human";
                name?: string | undefined;
            }>;
            modelProvider: z.ZodString;
            modelName: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }>>;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }>, "many">;
    expectationCoverage: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        status: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        proposedMatchIds: z.ZodArray<z.ZodString, "many">;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_ELIGIBLE_EVIDENCE", "NO_ELIGIBLE_EXPECTATIONS", "EXPECTATION_NOT_ASSESSED", "EXPECTATION_UNSUPPORTED", "ONLY_INDIRECT_EVIDENCE_FOUND", "ONLY_HISTORICAL_EVIDENCE_FOUND", "CONFLICTING_EVIDENCE_FOUND", "EVIDENCE_BECAME_INACTIVE", "EVIDENCE_REVIEW_STATUS_CHANGED", "UNKNOWN_MATCH_TYPE_PROPOSED", "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW", "EVIDENCE_NOT_FOUND", "EVIDENCE_PRESENT_BUT_TOO_GENERAL", "EVIDENCE_PRESENT_BUT_OUTDATED", "EVIDENCE_PRESENT_BUT_INDIRECT", "EVIDENCE_PRESENT_BUT_UNREVIEWED"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS", "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR", "DIRECT_VS_SUPPORTING_UNCLEAR", "TEMPORAL_RELEVANCE_UNCLEAR", "CONTRADICTION_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        assessedExpectationCount: z.ZodNumber;
        totalEligibleExpectationCount: z.ZodNumber;
        usableForFitAssessment: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    evidenceSnapshot: {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    };
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    expectationCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        usableForFitAssessment: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    evidenceSnapshot: {
        eligibleEvidenceIds: string[];
        eligibleEvidenceSetSha256: string;
        manifestPath: string;
        manifestSha256: string;
    };
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    expectationCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        expectationId: string;
        approvedMatchIds: string[];
        proposedMatchIds: string[];
    }[];
}>]>;
export declare const MatchingManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    matchingPath: z.ZodEffects<z.ZodString, string, string>;
    matchingSha256: z.ZodString;
    matcherName: z.ZodString;
    matcherVersion: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedInterpretationManifestSha256: z.ZodString;
    evidenceSnapshotManifestSha256: z.ZodString;
    eligibleEvidenceSetSha256: z.ZodString;
    manualStoreSha256: z.ZodOptional<z.ZodString>;
    proposalId: z.ZodOptional<z.ZodString>;
    proposalSha256: z.ZodOptional<z.ZodString>;
    reviewSha256: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    eligibleEvidenceSetSha256: string;
    matcherName: string;
    matcherVersion: string;
    matchingPath: string;
    matchingSha256: string;
    approvedInterpretationManifestSha256: string;
    evidenceSnapshotManifestSha256: string;
    proposalId?: string | undefined;
    proposalSha256?: string | undefined;
    reviewSha256?: string | undefined;
    manualStoreSha256?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    eligibleEvidenceSetSha256: string;
    matcherName: string;
    matcherVersion: string;
    matchingPath: string;
    matchingSha256: string;
    approvedInterpretationManifestSha256: string;
    evidenceSnapshotManifestSha256: string;
    proposalId?: string | undefined;
    proposalSha256?: string | undefined;
    reviewSha256?: string | undefined;
    manualStoreSha256?: string | undefined;
}>;
export declare const ManualMatchTombstoneSchema: z.ZodObject<{
    matchId: z.ZodString;
    removedAt: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    matchId: string;
    removedAt: string;
    reason?: string | undefined;
}, {
    matchId: string;
    removedAt: string;
    reason?: string | undefined;
}>;
export declare const ManualEvidenceMatchingSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    approvedInterpretationSha256: z.ZodString;
    eligibleEvidenceSetSha256: z.ZodString;
    matches: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
        coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
        temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
        rationale: z.ZodString;
        expectationProvenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
            approvedInterpretationSha256: z.ZodString;
            expectationId: z.ZodString;
            expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
            sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
            sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
                sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
                path: z.ZodString;
                sha256: z.ZodString;
                startLine: z.ZodNumber;
                endLine: z.ZodNumber;
                startOffset: z.ZodOptional<z.ZodNumber>;
                endOffset: z.ZodOptional<z.ZodNumber>;
                excerptSha256: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, z.ZodObject<{
                sourceType: z.ZodLiteral<"role-profile-json">;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                jsonPointer: z.ZodString;
                excerptSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }>]>, "many">;
            approvalProvenance: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedExpectationId: z.ZodString;
                reviewDecision: z.ZodEnum<["accept", "edit"]>;
                reviewer: z.ZodObject<{
                    type: z.ZodLiteral<"human">;
                    name: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    type: "human";
                    name?: string | undefined;
                }, {
                    type: "human";
                    name?: string | undefined;
                }>;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }>>;
        }, "strict", z.ZodTypeAny, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }>;
        evidenceProvenance: z.ZodArray<z.ZodObject<{
            evidenceId: z.ZodString;
            evidenceType: z.ZodString;
            reviewedStatus: z.ZodLiteral<"approved">;
            active: z.ZodLiteral<true>;
            evidenceArtifactSha256: z.ZodString;
            reviewArtifactSha256: z.ZodString;
            supportingClaimIds: z.ZodArray<z.ZodString, "many">;
            sources: z.ZodArray<z.ZodObject<{
                sourceId: z.ZodString;
                sourceType: z.ZodString;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                status: z.ZodLiteral<"active">;
                visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }>, "many">;
        trustState: z.ZodEnum<["manual-approved", "human-approved", "human-edited"]>;
        interpretation: z.ZodObject<{
            method: z.ZodEnum<["manual", "deterministic-rule", "model-assisted"]>;
            matcherName: z.ZodString;
            matcherVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }, {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        }>;
        matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
        limitations: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
        approvalProvenance: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedMatchId: z.ZodString;
            reviewDecision: z.ZodEnum<["accept", "edit"]>;
            reviewer: z.ZodObject<{
                type: z.ZodLiteral<"human">;
                name: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "human";
                name?: string | undefined;
            }, {
                type: "human";
                name?: string | undefined;
            }>;
            modelProvider: z.ZodString;
            modelName: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }, {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        }>>;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }, {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }>, "many">;
    tombstones: z.ZodArray<z.ZodObject<{
        matchId: z.ZodString;
        removedAt: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        matchId: string;
        removedAt: string;
        reason?: string | undefined;
    }, {
        matchId: string;
        removedAt: string;
        reason?: string | undefined;
    }>, "many">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role" | "job";
    targetId: string;
    approvedInterpretationSha256: string;
    eligibleEvidenceSetSha256: string;
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    tombstones: {
        matchId: string;
        removedAt: string;
        reason?: string | undefined;
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role" | "job";
    targetId: string;
    approvedInterpretationSha256: string;
    eligibleEvidenceSetSha256: string;
    matches: {
        notes: string[];
        id: string;
        interpretation: {
            method: "manual" | "deterministic-rule" | "model-assisted";
            policyVersion: string;
            matcherName: string;
            matcherVersion: string;
        };
        rationale: string;
        trustState: "human-approved" | "human-edited" | "manual-approved";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
        approvalProvenance?: {
            policyVersion: string;
            proposalId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
            proposedMatchId: string;
        } | undefined;
    }[];
    tombstones: {
        matchId: string;
        removedAt: string;
        reason?: string | undefined;
    }[];
}>;
export declare const ManualMatchingManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    matchingPath: z.ZodEffects<z.ZodString, string, string>;
    matchingSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    eligibleEvidenceSetSha256: z.ZodString;
    policyVersion: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    eligibleEvidenceSetSha256: string;
    matchingPath: string;
    matchingSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    eligibleEvidenceSetSha256: string;
    matchingPath: string;
    matchingSha256: string;
}>;
export declare const ModelProposedEvidenceMatchSchema: z.ZodObject<{
    expectationId: z.ZodString;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
    coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
    evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
    temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
    matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
    rationale: z.ZodString;
    limitations: z.ZodArray<z.ZodString, "many">;
    expectationProvenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
        approvedInterpretationSha256: z.ZodString;
        expectationId: z.ZodString;
        expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        approvalProvenance: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedExpectationId: z.ZodString;
            reviewDecision: z.ZodEnum<["accept", "edit"]>;
            reviewer: z.ZodObject<{
                type: z.ZodLiteral<"human">;
                name: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "human";
                name?: string | undefined;
            }, {
                type: "human";
                name?: string | undefined;
            }>;
            modelProvider: z.ZodString;
            modelName: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        }, {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        }>>;
    }, "strict", z.ZodTypeAny, {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }, {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }>;
    evidenceProvenance: z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        evidenceType: z.ZodString;
        reviewedStatus: z.ZodLiteral<"approved">;
        active: z.ZodLiteral<true>;
        evidenceArtifactSha256: z.ZodString;
        reviewArtifactSha256: z.ZodString;
        supportingClaimIds: z.ZodArray<z.ZodString, "many">;
        sources: z.ZodArray<z.ZodObject<{
            sourceId: z.ZodString;
            sourceType: z.ZodString;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            status: z.ZodLiteral<"active">;
            visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }, {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }, {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    rationale: string;
    expectationId: string;
    evidenceIds: string[];
    matchType: "partial" | "direct" | "supporting" | "contradictory";
    coverage: "partial" | "full" | "conflicting";
    evidenceStrength: "unknown" | "medium" | "strong" | "weak";
    temporalRelevance: "unknown" | "current" | "recent" | "historical";
    expectationProvenance: {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    };
    evidenceProvenance: {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }[];
    matchConfidence: "high" | "medium" | "low";
    limitations: string[];
}, {
    rationale: string;
    expectationId: string;
    evidenceIds: string[];
    matchType: "partial" | "direct" | "supporting" | "contradictory";
    coverage: "partial" | "full" | "conflicting";
    evidenceStrength: "unknown" | "medium" | "strong" | "weak";
    temporalRelevance: "unknown" | "current" | "recent" | "historical";
    expectationProvenance: {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    };
    evidenceProvenance: {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }[];
    matchConfidence: "high" | "medium" | "low";
    limitations: string[];
}>;
export declare const ProposedEvidenceMatchSchema: z.ZodObject<{
    trustState: z.ZodLiteral<"proposed">;
    expectationId: z.ZodString;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
    coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
    evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
    temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
    matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
    rationale: z.ZodString;
    limitations: z.ZodArray<z.ZodString, "many">;
    expectationProvenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
        approvedInterpretationSha256: z.ZodString;
        expectationId: z.ZodString;
        expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
        sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
            sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
            path: z.ZodString;
            sha256: z.ZodString;
            startLine: z.ZodNumber;
            endLine: z.ZodNumber;
            startOffset: z.ZodOptional<z.ZodNumber>;
            endOffset: z.ZodOptional<z.ZodNumber>;
            excerptSha256: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }, {
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        }>, z.ZodObject<{
            sourceType: z.ZodLiteral<"role-profile-json">;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            jsonPointer: z.ZodString;
            excerptSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }, {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        }>]>, "many">;
        approvalProvenance: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedExpectationId: z.ZodString;
            reviewDecision: z.ZodEnum<["accept", "edit"]>;
            reviewer: z.ZodObject<{
                type: z.ZodLiteral<"human">;
                name: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "human";
                name?: string | undefined;
            }, {
                type: "human";
                name?: string | undefined;
            }>;
            modelProvider: z.ZodString;
            modelName: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        }, {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        }>>;
    }, "strict", z.ZodTypeAny, {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }, {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    }>;
    evidenceProvenance: z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        evidenceType: z.ZodString;
        reviewedStatus: z.ZodLiteral<"approved">;
        active: z.ZodLiteral<true>;
        evidenceArtifactSha256: z.ZodString;
        reviewArtifactSha256: z.ZodString;
        supportingClaimIds: z.ZodArray<z.ZodString, "many">;
        sources: z.ZodArray<z.ZodObject<{
            sourceId: z.ZodString;
            sourceType: z.ZodString;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            status: z.ZodLiteral<"active">;
            visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }, {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }, {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }>, "many">;
    id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    rationale: string;
    trustState: "proposed";
    expectationId: string;
    evidenceIds: string[];
    matchType: "partial" | "direct" | "supporting" | "contradictory";
    coverage: "partial" | "full" | "conflicting";
    evidenceStrength: "unknown" | "medium" | "strong" | "weak";
    temporalRelevance: "unknown" | "current" | "recent" | "historical";
    expectationProvenance: {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    };
    evidenceProvenance: {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }[];
    matchConfidence: "high" | "medium" | "low";
    limitations: string[];
}, {
    id: string;
    rationale: string;
    trustState: "proposed";
    expectationId: string;
    evidenceIds: string[];
    matchType: "partial" | "direct" | "supporting" | "contradictory";
    coverage: "partial" | "full" | "conflicting";
    evidenceStrength: "unknown" | "medium" | "strong" | "weak";
    temporalRelevance: "unknown" | "current" | "recent" | "historical";
    expectationProvenance: {
        sourceReferences: ({
            sha256: string;
            path: string;
            sourceType: "job-description-markdown" | "target-json";
            startLine: number;
            endLine: number;
            excerptSha256: string;
            startOffset?: number | undefined;
            endOffset?: number | undefined;
        } | {
            sha256: string;
            path: string;
            sourceType: "role-profile-json";
            excerptSha256: string;
            jsonPointer: string;
        })[];
        targetId: string;
        sourceAnalysisItemIds: string[];
        approvedInterpretationPath: string;
        approvedInterpretationSha256: string;
        expectationId: string;
        expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
        approvalProvenance?: {
            policyVersion: string;
            sourceExpectationIds: string[];
            proposalId: string;
            promptTemplateVersion: string;
            proposedExpectationId: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            modelProvider: string;
            modelName: string;
        } | undefined;
    };
    evidenceProvenance: {
        active: true;
        evidenceId: string;
        evidenceType: string;
        reviewedStatus: "approved";
        evidenceArtifactSha256: string;
        reviewArtifactSha256: string;
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
    }[];
    matchConfidence: "high" | "medium" | "low";
    limitations: string[];
}>;
export declare const ProposedExpectationCoverageSchema: z.ZodObject<{
    id: z.ZodString;
    expectationId: z.ZodString;
    status: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
    rationale: z.ZodString;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
    notes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
    id: string;
    blockingReasons: string[];
    rationale: string;
    expectationId: string;
}, {
    notes: string[];
    status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
    id: string;
    blockingReasons: string[];
    rationale: string;
    expectationId: string;
}>;
export declare const ModelProposedExpectationCoverageSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    expectationId: z.ZodString;
    status: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
    rationale: z.ZodString;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
    notes: z.ZodArray<z.ZodString, "many">;
}, "id">, "strict", z.ZodTypeAny, {
    notes: string[];
    status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
    blockingReasons: string[];
    rationale: string;
    expectationId: string;
}, {
    notes: string[];
    status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
    blockingReasons: string[];
    rationale: string;
    expectationId: string;
}>;
export declare const ModelEvidenceMatchPayloadSchema: z.ZodObject<{
    proposedMatches: z.ZodArray<z.ZodObject<{
        expectationId: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
        coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
        temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
        matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        expectationProvenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
            approvedInterpretationSha256: z.ZodString;
            expectationId: z.ZodString;
            expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
            sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
            sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
                sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
                path: z.ZodString;
                sha256: z.ZodString;
                startLine: z.ZodNumber;
                endLine: z.ZodNumber;
                startOffset: z.ZodOptional<z.ZodNumber>;
                endOffset: z.ZodOptional<z.ZodNumber>;
                excerptSha256: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, z.ZodObject<{
                sourceType: z.ZodLiteral<"role-profile-json">;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                jsonPointer: z.ZodString;
                excerptSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }>]>, "many">;
            approvalProvenance: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedExpectationId: z.ZodString;
                reviewDecision: z.ZodEnum<["accept", "edit"]>;
                reviewer: z.ZodObject<{
                    type: z.ZodLiteral<"human">;
                    name: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    type: "human";
                    name?: string | undefined;
                }, {
                    type: "human";
                    name?: string | undefined;
                }>;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }>>;
        }, "strict", z.ZodTypeAny, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }>;
        evidenceProvenance: z.ZodArray<z.ZodObject<{
            evidenceId: z.ZodString;
            evidenceType: z.ZodString;
            reviewedStatus: z.ZodLiteral<"approved">;
            active: z.ZodLiteral<true>;
            evidenceArtifactSha256: z.ZodString;
            reviewArtifactSha256: z.ZodString;
            supportingClaimIds: z.ZodArray<z.ZodString, "many">;
            sources: z.ZodArray<z.ZodObject<{
                sourceId: z.ZodString;
                sourceType: z.ZodString;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                status: z.ZodLiteral<"active">;
                visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        rationale: string;
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }, {
        rationale: string;
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }>, "many">;
    proposedCoverage: z.ZodArray<z.ZodObject<Omit<{
        id: z.ZodString;
        expectationId: z.ZodString;
        status: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
        rationale: z.ZodString;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "id">, "strict", z.ZodTypeAny, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        blockingReasons: string[];
        rationale: string;
        expectationId: string;
    }, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        blockingReasons: string[];
        rationale: string;
        expectationId: string;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<Omit<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_ELIGIBLE_EVIDENCE", "NO_ELIGIBLE_EXPECTATIONS", "EXPECTATION_NOT_ASSESSED", "EXPECTATION_UNSUPPORTED", "ONLY_INDIRECT_EVIDENCE_FOUND", "ONLY_HISTORICAL_EVIDENCE_FOUND", "CONFLICTING_EVIDENCE_FOUND", "EVIDENCE_BECAME_INACTIVE", "EVIDENCE_REVIEW_STATUS_CHANGED", "UNKNOWN_MATCH_TYPE_PROPOSED", "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW", "EVIDENCE_NOT_FOUND", "EVIDENCE_PRESENT_BUT_TOO_GENERAL", "EVIDENCE_PRESENT_BUT_OUTDATED", "EVIDENCE_PRESENT_BUT_INDIRECT", "EVIDENCE_PRESENT_BUT_UNREVIEWED"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "id">, "strict", z.ZodTypeAny, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<Omit<{
        id: z.ZodString;
        code: z.ZodEnum<["MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS", "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR", "DIRECT_VS_SUPPORTING_UNCLEAR", "TEMPORAL_RELEVANCE_UNCLEAR", "CONTRADICTION_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "id">, "strict", z.ZodTypeAny, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    proposedMatches: {
        rationale: string;
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }[];
    proposedCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        blockingReasons: string[];
        rationale: string;
        expectationId: string;
    }[];
}, {
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    proposedMatches: {
        rationale: string;
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }[];
    proposedCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        blockingReasons: string[];
        rationale: string;
        expectationId: string;
    }[];
}>;
export declare const EvidenceMatchValidationIssueSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    path?: string | undefined;
}, {
    code: string;
    message: string;
    path?: string | undefined;
}>;
export declare const EvidenceMatchProposalSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    status: z.ZodEnum<["generated", "validation-failed", "ready-for-review", "reviewed"]>;
    matcher: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
        policyVersion: string;
    }, {
        name: string;
        version: string;
        policyVersion: string;
    }>;
    model: z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        settings: z.ZodObject<{
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            maxOutputTokens: z.ZodOptional<z.ZodNumber>;
            seed: z.ZodOptional<z.ZodNumber>;
            responseFormat: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        }, {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        provider: string;
        model: string;
        settings: {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        };
    }, {
        provider: string;
        model: string;
        settings: {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        };
    }>;
    prompt: z.ZodObject<{
        templateId: z.ZodString;
        templateVersion: z.ZodString;
        policyVersion: z.ZodString;
        renderedPromptSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        policyVersion: string;
        templateId: string;
        templateVersion: string;
        renderedPromptSha256: string;
    }, {
        policyVersion: string;
        templateId: string;
        templateVersion: string;
        renderedPromptSha256: string;
    }>;
    input: z.ZodObject<{
        approvedInterpretationSha256: z.ZodString;
        eligibleEvidenceSetSha256: z.ZodString;
        normalizedModelInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        eligibleEvidenceSetSha256: string;
    }, {
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        eligibleEvidenceSetSha256: string;
    }>;
    proposedMatches: z.ZodArray<z.ZodObject<{
        trustState: z.ZodLiteral<"proposed">;
        expectationId: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
        coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
        temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
        matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        expectationProvenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationPath: z.ZodEffects<z.ZodString, string, string>;
            approvedInterpretationSha256: z.ZodString;
            expectationId: z.ZodString;
            expectationTrustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
            sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
            sourceReferences: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodObject<{
                sourceType: z.ZodEnum<["job-description-markdown", "target-json"]>;
                path: z.ZodString;
                sha256: z.ZodString;
                startLine: z.ZodNumber;
                endLine: z.ZodNumber;
                startOffset: z.ZodOptional<z.ZodNumber>;
                endOffset: z.ZodOptional<z.ZodNumber>;
                excerptSha256: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }, {
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            }>, z.ZodObject<{
                sourceType: z.ZodLiteral<"role-profile-json">;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                jsonPointer: z.ZodString;
                excerptSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }, {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            }>]>, "many">;
            approvalProvenance: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedExpectationId: z.ZodString;
                reviewDecision: z.ZodEnum<["accept", "edit"]>;
                reviewer: z.ZodObject<{
                    type: z.ZodLiteral<"human">;
                    name: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    type: "human";
                    name?: string | undefined;
                }, {
                    type: "human";
                    name?: string | undefined;
                }>;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }, {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            }>>;
        }, "strict", z.ZodTypeAny, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }, {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }>;
        evidenceProvenance: z.ZodArray<z.ZodObject<{
            evidenceId: z.ZodString;
            evidenceType: z.ZodString;
            reviewedStatus: z.ZodLiteral<"approved">;
            active: z.ZodLiteral<true>;
            evidenceArtifactSha256: z.ZodString;
            reviewArtifactSha256: z.ZodString;
            supportingClaimIds: z.ZodArray<z.ZodString, "many">;
            sources: z.ZodArray<z.ZodObject<{
                sourceId: z.ZodString;
                sourceType: z.ZodString;
                path: z.ZodEffects<z.ZodString, string, string>;
                sha256: z.ZodString;
                status: z.ZodLiteral<"active">;
                visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
            }, "strict", z.ZodTypeAny, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }, {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }, {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }>, "many">;
        id: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        id: string;
        rationale: string;
        trustState: "proposed";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }, {
        id: string;
        rationale: string;
        trustState: "proposed";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }>, "many">;
    proposedCoverage: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        status: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
        rationale: z.ZodString;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        rationale: string;
        expectationId: string;
    }, {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        rationale: string;
        expectationId: string;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_ELIGIBLE_EVIDENCE", "NO_ELIGIBLE_EXPECTATIONS", "EXPECTATION_NOT_ASSESSED", "EXPECTATION_UNSUPPORTED", "ONLY_INDIRECT_EVIDENCE_FOUND", "ONLY_HISTORICAL_EVIDENCE_FOUND", "CONFLICTING_EVIDENCE_FOUND", "EVIDENCE_BECAME_INACTIVE", "EVIDENCE_REVIEW_STATUS_CHANGED", "UNKNOWN_MATCH_TYPE_PROPOSED", "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW", "EVIDENCE_NOT_FOUND", "EVIDENCE_PRESENT_BUT_TOO_GENERAL", "EVIDENCE_PRESENT_BUT_OUTDATED", "EVIDENCE_PRESENT_BUT_INDIRECT", "EVIDENCE_PRESENT_BUT_UNREVIEWED"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS", "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR", "DIRECT_VS_SUPPORTING_UNCLEAR", "TEMPORAL_RELEVANCE_UNCLEAR", "CONTRADICTION_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    validationIssues: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        path?: string | undefined;
    }, {
        code: string;
        message: string;
        path?: string | undefined;
    }>, "many">;
    rawResponsePath: z.ZodEffects<z.ZodString, string, string>;
    rawResponseSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    status: "generated" | "validation-failed" | "ready-for-review" | "reviewed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        eligibleEvidenceSetSha256: string;
    };
    targetType: "role" | "job";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    model: {
        provider: string;
        model: string;
        settings: {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        };
    };
    requestFingerprint: string;
    prompt: {
        policyVersion: string;
        templateId: string;
        templateVersion: string;
        renderedPromptSha256: string;
    };
    validationIssues: {
        code: string;
        message: string;
        path?: string | undefined;
    }[];
    rawResponsePath: string;
    rawResponseSha256: string;
    proposedMatches: {
        id: string;
        rationale: string;
        trustState: "proposed";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }[];
    proposedCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        rationale: string;
        expectationId: string;
    }[];
    matcher: {
        name: string;
        version: string;
        policyVersion: string;
    };
}, {
    status: "generated" | "validation-failed" | "ready-for-review" | "reviewed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        eligibleEvidenceSetSha256: string;
    };
    targetType: "role" | "job";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "NO_ELIGIBLE_EXPECTATIONS" | "EXPECTATION_NOT_ASSESSED" | "EXPECTATION_UNSUPPORTED" | "ONLY_INDIRECT_EVIDENCE_FOUND" | "ONLY_HISTORICAL_EVIDENCE_FOUND" | "CONFLICTING_EVIDENCE_FOUND" | "EVIDENCE_BECAME_INACTIVE" | "EVIDENCE_REVIEW_STATUS_CHANGED" | "UNKNOWN_MATCH_TYPE_PROPOSED" | "MODEL_PROPOSAL_REQUIRED_HUMAN_REVIEW" | "EVIDENCE_NOT_FOUND" | "EVIDENCE_PRESENT_BUT_TOO_GENERAL" | "EVIDENCE_PRESENT_BUT_OUTDATED" | "EVIDENCE_PRESENT_BUT_INDIRECT" | "EVIDENCE_PRESENT_BUT_UNREVIEWED";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    ambiguities: {
        code: "MULTIPLE_PLAUSIBLE_EVIDENCE_LINKS" | "PARTIAL_COVERAGE_BOUNDARY_UNCLEAR" | "DIRECT_VS_SUPPORTING_UNCLEAR" | "TEMPORAL_RELEVANCE_UNCLEAR" | "CONTRADICTION_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    model: {
        provider: string;
        model: string;
        settings: {
            temperature?: number | undefined;
            topP?: number | undefined;
            maxOutputTokens?: number | undefined;
            seed?: number | undefined;
            responseFormat?: string | undefined;
        };
    };
    requestFingerprint: string;
    prompt: {
        policyVersion: string;
        templateId: string;
        templateVersion: string;
        renderedPromptSha256: string;
    };
    validationIssues: {
        code: string;
        message: string;
        path?: string | undefined;
    }[];
    rawResponsePath: string;
    rawResponseSha256: string;
    proposedMatches: {
        id: string;
        rationale: string;
        trustState: "proposed";
        expectationId: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        expectationProvenance: {
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            targetId: string;
            sourceAnalysisItemIds: string[];
            approvedInterpretationPath: string;
            approvedInterpretationSha256: string;
            expectationId: string;
            expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        };
        evidenceProvenance: {
            active: true;
            evidenceId: string;
            evidenceType: string;
            reviewedStatus: "approved";
            evidenceArtifactSha256: string;
            reviewArtifactSha256: string;
            supportingClaimIds: string[];
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
        }[];
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }[];
    proposedCoverage: {
        notes: string[];
        status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        id: string;
        blockingReasons: string[];
        rationale: string;
        expectationId: string;
    }[];
    matcher: {
        name: string;
        version: string;
        policyVersion: string;
    };
}>;
export declare const EvidenceMatchProposalManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    proposalPath: z.ZodEffects<z.ZodString, string, string>;
    proposalSha256: z.ZodString;
    rawResponsePath: z.ZodEffects<z.ZodString, string, string>;
    rawResponseSha256: z.ZodString;
    matcherName: z.ZodString;
    matcherVersion: z.ZodString;
    policyVersion: z.ZodString;
    provider: z.ZodString;
    model: z.ZodString;
    promptTemplateId: z.ZodString;
    promptTemplateVersion: z.ZodString;
    renderedPromptSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    evidenceSnapshotManifestSha256: z.ZodString;
    eligibleEvidenceSetSha256: z.ZodString;
    normalizedModelInputSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    provider: string;
    model: string;
    requestFingerprint: string;
    renderedPromptSha256: string;
    normalizedModelInputSha256: string;
    rawResponsePath: string;
    rawResponseSha256: string;
    proposalId: string;
    proposalPath: string;
    proposalSha256: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    approvedInterpretationSha256: string;
    eligibleEvidenceSetSha256: string;
    matcherName: string;
    matcherVersion: string;
    evidenceSnapshotManifestSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    provider: string;
    model: string;
    requestFingerprint: string;
    renderedPromptSha256: string;
    normalizedModelInputSha256: string;
    rawResponsePath: string;
    rawResponseSha256: string;
    proposalId: string;
    proposalPath: string;
    proposalSha256: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    approvedInterpretationSha256: string;
    eligibleEvidenceSetSha256: string;
    matcherName: string;
    matcherVersion: string;
    evidenceSnapshotManifestSha256: string;
}>;
export declare const EditedEvidenceMatchSchema: z.ZodObject<{
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
    coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
    evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
    temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
    matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
    rationale: z.ZodString;
    limitations: z.ZodArray<z.ZodString, "many">;
    notes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    rationale: string;
    evidenceIds: string[];
    matchType: "partial" | "direct" | "supporting" | "contradictory";
    coverage: "partial" | "full" | "conflicting";
    evidenceStrength: "unknown" | "medium" | "strong" | "weak";
    temporalRelevance: "unknown" | "current" | "recent" | "historical";
    matchConfidence: "high" | "medium" | "low";
    limitations: string[];
}, {
    notes: string[];
    rationale: string;
    evidenceIds: string[];
    matchType: "partial" | "direct" | "supporting" | "contradictory";
    coverage: "partial" | "full" | "conflicting";
    evidenceStrength: "unknown" | "medium" | "strong" | "weak";
    temporalRelevance: "unknown" | "current" | "recent" | "historical";
    matchConfidence: "high" | "medium" | "low";
    limitations: string[];
}>;
export declare const EvidenceMatchReviewDecisionSchema: z.ZodEffects<z.ZodObject<{
    proposedMatchId: z.ZodString;
    decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
    editedMatch: z.ZodOptional<z.ZodObject<{
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
        coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
        temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
        matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        rationale: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }, {
        notes: string[];
        rationale: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    }>>;
    reviewNote: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedMatchId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedMatch?: {
        notes: string[];
        rationale: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    } | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedMatchId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedMatch?: {
        notes: string[];
        rationale: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    } | undefined;
}>, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedMatchId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedMatch?: {
        notes: string[];
        rationale: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    } | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedMatchId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedMatch?: {
        notes: string[];
        rationale: string;
        evidenceIds: string[];
        matchType: "partial" | "direct" | "supporting" | "contradictory";
        coverage: "partial" | "full" | "conflicting";
        evidenceStrength: "unknown" | "medium" | "strong" | "weak";
        temporalRelevance: "unknown" | "current" | "recent" | "historical";
        matchConfidence: "high" | "medium" | "low";
        limitations: string[];
    } | undefined;
}>;
export declare const ExpectationCoverageReviewDecisionSchema: z.ZodEffects<z.ZodObject<{
    proposedCoverageId: z.ZodString;
    decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
    editedStatus: z.ZodOptional<z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>>;
    reviewNote: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedCoverageId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedCoverageId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
}>, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedCoverageId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedCoverageId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
}>;
export declare const EvidenceMatchProposalReviewSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    status: z.ZodEnum<["in-progress", "completed"]>;
    matchDecisions: z.ZodArray<z.ZodEffects<z.ZodObject<{
        proposedMatchId: z.ZodString;
        decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
        editedMatch: z.ZodOptional<z.ZodObject<{
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            matchType: z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>;
            coverage: z.ZodEnum<["full", "partial", "conflicting"]>;
            evidenceStrength: z.ZodEnum<["strong", "medium", "weak", "unknown"]>;
            temporalRelevance: z.ZodEnum<["current", "recent", "historical", "unknown"]>;
            matchConfidence: z.ZodEnum<["high", "medium", "low"]>;
            rationale: z.ZodString;
            limitations: z.ZodArray<z.ZodString, "many">;
            notes: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            notes: string[];
            rationale: string;
            evidenceIds: string[];
            matchType: "partial" | "direct" | "supporting" | "contradictory";
            coverage: "partial" | "full" | "conflicting";
            evidenceStrength: "unknown" | "medium" | "strong" | "weak";
            temporalRelevance: "unknown" | "current" | "recent" | "historical";
            matchConfidence: "high" | "medium" | "low";
            limitations: string[];
        }, {
            notes: string[];
            rationale: string;
            evidenceIds: string[];
            matchType: "partial" | "direct" | "supporting" | "contradictory";
            coverage: "partial" | "full" | "conflicting";
            evidenceStrength: "unknown" | "medium" | "strong" | "weak";
            temporalRelevance: "unknown" | "current" | "recent" | "historical";
            matchConfidence: "high" | "medium" | "low";
            limitations: string[];
        }>>;
        reviewNote: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedMatchId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedMatch?: {
            notes: string[];
            rationale: string;
            evidenceIds: string[];
            matchType: "partial" | "direct" | "supporting" | "contradictory";
            coverage: "partial" | "full" | "conflicting";
            evidenceStrength: "unknown" | "medium" | "strong" | "weak";
            temporalRelevance: "unknown" | "current" | "recent" | "historical";
            matchConfidence: "high" | "medium" | "low";
            limitations: string[];
        } | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedMatchId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedMatch?: {
            notes: string[];
            rationale: string;
            evidenceIds: string[];
            matchType: "partial" | "direct" | "supporting" | "contradictory";
            coverage: "partial" | "full" | "conflicting";
            evidenceStrength: "unknown" | "medium" | "strong" | "weak";
            temporalRelevance: "unknown" | "current" | "recent" | "historical";
            matchConfidence: "high" | "medium" | "low";
            limitations: string[];
        } | undefined;
    }>, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedMatchId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedMatch?: {
            notes: string[];
            rationale: string;
            evidenceIds: string[];
            matchType: "partial" | "direct" | "supporting" | "contradictory";
            coverage: "partial" | "full" | "conflicting";
            evidenceStrength: "unknown" | "medium" | "strong" | "weak";
            temporalRelevance: "unknown" | "current" | "recent" | "historical";
            matchConfidence: "high" | "medium" | "low";
            limitations: string[];
        } | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedMatchId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedMatch?: {
            notes: string[];
            rationale: string;
            evidenceIds: string[];
            matchType: "partial" | "direct" | "supporting" | "contradictory";
            coverage: "partial" | "full" | "conflicting";
            evidenceStrength: "unknown" | "medium" | "strong" | "weak";
            temporalRelevance: "unknown" | "current" | "recent" | "historical";
            matchConfidence: "high" | "medium" | "low";
            limitations: string[];
        } | undefined;
    }>, "many">;
    coverageDecisions: z.ZodArray<z.ZodEffects<z.ZodObject<{
        proposedCoverageId: z.ZodString;
        decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
        editedStatus: z.ZodOptional<z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>>;
        reviewNote: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedCoverageId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedCoverageId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
    }>, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedCoverageId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedCoverageId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
    }>, "many">;
    reviewer: z.ZodObject<{
        type: z.ZodLiteral<"human">;
        name: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        type: "human";
        name?: string | undefined;
    }, {
        type: "human";
        name?: string | undefined;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    status: "in-progress" | "completed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    proposalId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
    matchDecisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedMatchId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedMatch?: {
            notes: string[];
            rationale: string;
            evidenceIds: string[];
            matchType: "partial" | "direct" | "supporting" | "contradictory";
            coverage: "partial" | "full" | "conflicting";
            evidenceStrength: "unknown" | "medium" | "strong" | "weak";
            temporalRelevance: "unknown" | "current" | "recent" | "historical";
            matchConfidence: "high" | "medium" | "low";
            limitations: string[];
        } | undefined;
    }[];
    coverageDecisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedCoverageId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
    }[];
}, {
    status: "in-progress" | "completed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    proposalId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
    matchDecisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedMatchId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedMatch?: {
            notes: string[];
            rationale: string;
            evidenceIds: string[];
            matchType: "partial" | "direct" | "supporting" | "contradictory";
            coverage: "partial" | "full" | "conflicting";
            evidenceStrength: "unknown" | "medium" | "strong" | "weak";
            temporalRelevance: "unknown" | "current" | "recent" | "historical";
            matchConfidence: "high" | "medium" | "low";
            limitations: string[];
        } | undefined;
    }[];
    coverageDecisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedCoverageId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedStatus?: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed" | undefined;
    }[];
}>;
export declare const EvidenceMatchReviewManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    reviewPath: z.ZodEffects<z.ZodString, string, string>;
    reviewSha256: z.ZodString;
    proposalSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    proposalId: string;
    proposalSha256: string;
    reviewPath: string;
    reviewSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    proposalId: string;
    proposalSha256: string;
    reviewPath: string;
    reviewSha256: string;
}>;
export declare const SourceSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["cv", "linkedin_export", "github_summary", "project_note", "recommendation", "certificate", "markdown", "pdf", "docx", "json", "csv", "job_description", "unknown"]>;
    path: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    importedAt: z.ZodString;
    hash: z.ZodString;
    visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
    status: z.ZodEnum<["active", "ignored", "needs_review"]>;
    extractedTextPath: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: "unknown" | "markdown" | "cv" | "linkedin_export" | "github_summary" | "project_note" | "recommendation" | "certificate" | "pdf" | "docx" | "json" | "csv" | "job_description";
    status: "active" | "ignored" | "needs_review";
    id: string;
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    importedAt: string;
    hash: string;
    title?: string | undefined;
    extractedTextPath?: string | undefined;
}, {
    path: string;
    type: "unknown" | "markdown" | "cv" | "linkedin_export" | "github_summary" | "project_note" | "recommendation" | "certificate" | "pdf" | "docx" | "json" | "csv" | "job_description";
    status: "active" | "ignored" | "needs_review";
    id: string;
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    importedAt: string;
    hash: string;
    title?: string | undefined;
    extractedTextPath?: string | undefined;
}>;
export declare const EvidenceItemSchema: z.ZodObject<{
    id: z.ZodString;
    sourceIds: z.ZodArray<z.ZodString, "many">;
    category: z.ZodEnum<["role", "project", "skill", "certification", "recommendation", "education", "domain", "responsibility", "achievement", "tool"]>;
    text: z.ZodString;
    normalizedSummary: z.ZodString;
    dateRange: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    project: z.ZodOptional<z.ZodString>;
    parentRoleId: z.ZodOptional<z.ZodString>;
    parentProjectId: z.ZodOptional<z.ZodString>;
    sourceSection: z.ZodOptional<z.ZodString>;
    technologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    domains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
    sensitivityFlags: z.ZodArray<z.ZodString, "many">;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    sourceIds: string[];
    text: string;
    normalizedSummary: string;
    sensitivityFlags: string[];
    confidence: "high" | "medium" | "low";
    company?: string | undefined;
    project?: string | undefined;
    dateRange?: string | undefined;
    parentRoleId?: string | undefined;
    parentProjectId?: string | undefined;
    sourceSection?: string | undefined;
    technologies?: string[] | undefined;
    domains?: string[] | undefined;
}, {
    id: string;
    category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    sourceIds: string[];
    text: string;
    normalizedSummary: string;
    sensitivityFlags: string[];
    confidence: "high" | "medium" | "low";
    company?: string | undefined;
    project?: string | undefined;
    dateRange?: string | undefined;
    parentRoleId?: string | undefined;
    parentProjectId?: string | undefined;
    sourceSection?: string | undefined;
    technologies?: string[] | undefined;
    domains?: string[] | undefined;
}>;
export declare const ClaimSchema: z.ZodObject<{
    id: z.ZodString;
    claim: z.ZodString;
    type: z.ZodEnum<["role_claim", "skill_claim", "leadership_claim", "impact_claim", "domain_claim", "project_claim", "competency_claim", "certification_claim", "education_claim", "responsibility_claim"]>;
    supportingEvidenceIds: z.ZodArray<z.ZodString, "many">;
    parentRoleId: z.ZodOptional<z.ZodString>;
    parentProjectId: z.ZodOptional<z.ZodString>;
    sourceSection: z.ZodOptional<z.ZodString>;
    dateRange: z.ZodOptional<z.ZodString>;
    extractionConfidence: z.ZodEnum<["high", "medium", "low"]>;
    factualConfidence: z.ZodEnum<["high", "medium", "low"]>;
    corroborationLevel: z.ZodEnum<["multi_source", "single_source", "manual_approved", "uncorroborated"]>;
    approvalStatus: z.ZodEnum<["approved", "needs_confirmation", "blocked"]>;
    outputReadiness: z.ZodEnum<["resume_ready", "generic_only", "internal_only", "do_not_use"]>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    publicSafe: z.ZodBoolean;
    needsConfirmation: z.ZodBoolean;
    metricStatus: z.ZodEnum<["verified_metric", "structural_metric", "no_metric", "needs_metric"]>;
    approvedWording: z.ZodOptional<z.ZodString>;
    unsafeWording: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "role_claim" | "skill_claim" | "leadership_claim" | "impact_claim" | "domain_claim" | "project_claim" | "competency_claim" | "certification_claim" | "education_claim" | "responsibility_claim";
    id: string;
    confidence: "high" | "medium" | "low";
    claim: string;
    supportingEvidenceIds: string[];
    extractionConfidence: "high" | "medium" | "low";
    factualConfidence: "high" | "medium" | "low";
    corroborationLevel: "multi_source" | "single_source" | "manual_approved" | "uncorroborated";
    approvalStatus: "approved" | "needs_confirmation" | "blocked";
    outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
    publicSafe: boolean;
    needsConfirmation: boolean;
    metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
    dateRange?: string | undefined;
    parentRoleId?: string | undefined;
    parentProjectId?: string | undefined;
    sourceSection?: string | undefined;
    approvedWording?: string | undefined;
    unsafeWording?: string[] | undefined;
}, {
    type: "role_claim" | "skill_claim" | "leadership_claim" | "impact_claim" | "domain_claim" | "project_claim" | "competency_claim" | "certification_claim" | "education_claim" | "responsibility_claim";
    id: string;
    confidence: "high" | "medium" | "low";
    claim: string;
    supportingEvidenceIds: string[];
    extractionConfidence: "high" | "medium" | "low";
    factualConfidence: "high" | "medium" | "low";
    corroborationLevel: "multi_source" | "single_source" | "manual_approved" | "uncorroborated";
    approvalStatus: "approved" | "needs_confirmation" | "blocked";
    outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
    publicSafe: boolean;
    needsConfirmation: boolean;
    metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
    dateRange?: string | undefined;
    parentRoleId?: string | undefined;
    parentProjectId?: string | undefined;
    sourceSection?: string | undefined;
    approvedWording?: string | undefined;
    unsafeWording?: string[] | undefined;
}>;
export declare const CareerProfileSchema: z.ZodObject<{
    id: z.ZodString;
    updatedAt: z.ZodString;
    positioningCandidates: z.ZodArray<z.ZodString, "many">;
    summaryThemes: z.ZodArray<z.ZodString, "many">;
    roles: z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        dateRange: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        evidenceIds: string[];
        title?: string | undefined;
        company?: string | undefined;
        dateRange?: string | undefined;
    }, {
        evidenceIds: string[];
        title?: string | undefined;
        company?: string | undefined;
        dateRange?: string | undefined;
    }>, "many">;
    projects: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        technologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        domains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        evidenceIds: string[];
        technologies?: string[] | undefined;
        domains?: string[] | undefined;
    }, {
        name: string;
        evidenceIds: string[];
        technologies?: string[] | undefined;
        domains?: string[] | undefined;
    }>, "many">;
    skills: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        evidenceIds: string[];
    }, {
        name: string;
        evidenceIds: string[];
    }>, "many">;
    domains: z.ZodArray<z.ZodString, "many">;
    approvedClaims: z.ZodArray<z.ZodString, "many">;
    claimsNeedingConfirmation: z.ZodArray<z.ZodString, "many">;
    blockedClaims: z.ZodArray<z.ZodString, "many">;
    resumeReadyClaims: z.ZodArray<z.ZodString, "many">;
    genericOnlyClaims: z.ZodArray<z.ZodString, "many">;
    internalOnlyClaims: z.ZodArray<z.ZodString, "many">;
    publicSafetyRules: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    updatedAt: string;
    id: string;
    domains: string[];
    positioningCandidates: string[];
    summaryThemes: string[];
    roles: {
        evidenceIds: string[];
        title?: string | undefined;
        company?: string | undefined;
        dateRange?: string | undefined;
    }[];
    projects: {
        name: string;
        evidenceIds: string[];
        technologies?: string[] | undefined;
        domains?: string[] | undefined;
    }[];
    skills: {
        name: string;
        evidenceIds: string[];
    }[];
    approvedClaims: string[];
    claimsNeedingConfirmation: string[];
    blockedClaims: string[];
    resumeReadyClaims: string[];
    genericOnlyClaims: string[];
    internalOnlyClaims: string[];
    publicSafetyRules: string[];
}, {
    updatedAt: string;
    id: string;
    domains: string[];
    positioningCandidates: string[];
    summaryThemes: string[];
    roles: {
        evidenceIds: string[];
        title?: string | undefined;
        company?: string | undefined;
        dateRange?: string | undefined;
    }[];
    projects: {
        name: string;
        evidenceIds: string[];
        technologies?: string[] | undefined;
        domains?: string[] | undefined;
    }[];
    skills: {
        name: string;
        evidenceIds: string[];
    }[];
    approvedClaims: string[];
    claimsNeedingConfirmation: string[];
    blockedClaims: string[];
    resumeReadyClaims: string[];
    genericOnlyClaims: string[];
    internalOnlyClaims: string[];
    publicSafetyRules: string[];
}>;
export type Visibility = z.infer<typeof VisibilitySchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
export type CorroborationLevel = z.infer<typeof CorroborationLevelSchema>;
export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>;
export type OutputReadiness = z.infer<typeof OutputReadinessSchema>;
export type VariantReviewDecisionValue = z.infer<typeof VariantReviewDecisionValueSchema>;
export type VariantReviewDecision = z.infer<typeof VariantReviewDecisionSchema>;
export type VariantReviewDecisions = z.infer<typeof VariantReviewDecisionsSchema>;
export type PublicProfile = z.infer<typeof PublicProfileSchema>;
export type RoleTarget = z.infer<typeof RoleTargetSchema>;
export type JobTarget = z.infer<typeof JobTargetSchema>;
export type Target = z.infer<typeof TargetSchema>;
export type TargetAnalysisSourceReference = z.infer<typeof TargetAnalysisSourceReferenceSchema>;
export type TargetAnalysisSection = z.infer<typeof TargetAnalysisSectionSchema>;
export type TargetAnalysisItem = z.infer<typeof TargetAnalysisItemSchema>;
export type TargetAnalysisWarning = z.infer<typeof TargetAnalysisWarningSchema>;
export type RoleTargetAnalysis = z.infer<typeof RoleTargetAnalysisSchema>;
export type JobTargetAnalysis = z.infer<typeof JobTargetAnalysisSchema>;
export type TargetAnalysis = z.infer<typeof TargetAnalysisSchema>;
export type TargetAnalysisManifest = z.infer<typeof TargetAnalysisManifestSchema>;
export type TargetExpectationKind = z.infer<typeof TargetExpectationKindSchema>;
export type TargetExpectationNecessity = z.infer<typeof TargetExpectationNecessitySchema>;
export type TargetExpectationImportance = z.infer<typeof TargetExpectationImportanceSchema>;
export type ExpectationGroupKind = z.infer<typeof ExpectationGroupKindSchema>;
export type RoleProfileExpectation = z.infer<typeof RoleProfileExpectationSchema>;
export type RoleProfile = z.infer<typeof RoleProfileSchema>;
export type RoleProfileSourceReference = z.infer<typeof RoleProfileSourceReferenceSchema>;
export type TargetInterpretationSourceReference = z.infer<typeof TargetInterpretationSourceReferenceSchema>;
export type TargetExpectation = z.infer<typeof TargetExpectationSchema>;
export type ExpectationGroup = z.infer<typeof ExpectationGroupSchema>;
export type InterpretationAmbiguity = z.infer<typeof InterpretationAmbiguitySchema>;
export type InterpretationWarning = z.infer<typeof InterpretationWarningSchema>;
export type RoleTargetInterpretation = z.infer<typeof RoleTargetInterpretationSchema>;
export type JobTargetInterpretation = z.infer<typeof JobTargetInterpretationSchema>;
export type TargetInterpretation = z.infer<typeof TargetInterpretationSchema>;
export type TargetInterpretationManifest = z.infer<typeof TargetInterpretationManifestSchema>;
export type InterpretationCompleteness = z.infer<typeof InterpretationCompletenessSchema>;
export type InterpretationTrustState = z.infer<typeof InterpretationTrustStateSchema>;
export type ModelIdentity = z.infer<typeof ModelIdentitySchema>;
export type ModelGenerationSettings = z.infer<typeof ModelGenerationSettingsSchema>;
export type ModelInterpretationPayload = z.infer<typeof ModelInterpretationPayloadSchema>;
export type ProposedExpectation = z.infer<typeof ProposedExpectationSchema>;
export type ProposedExpectationGroup = z.infer<typeof ProposedExpectationGroupSchema>;
export type ProposalValidationIssue = z.infer<typeof ProposalValidationIssueSchema>;
export type TargetInterpretationProposal = z.infer<typeof TargetInterpretationProposalSchema>;
export type InterpretationProposalManifest = z.infer<typeof InterpretationProposalManifestSchema>;
export type EditedTargetExpectation = z.infer<typeof EditedTargetExpectationSchema>;
export type ProposalReviewDecision = z.infer<typeof ProposalReviewDecisionSchema>;
export type InterpretationProposalReview = z.infer<typeof InterpretationProposalReviewSchema>;
export type InterpretationProposalReviewManifest = z.infer<typeof InterpretationProposalReviewManifestSchema>;
export type ApprovedTargetExpectation = z.infer<typeof ApprovedTargetExpectationSchema>;
export type ApprovedTargetInterpretation = z.infer<typeof ApprovedTargetInterpretationSchema>;
export type ApprovedTargetInterpretationManifest = z.infer<typeof ApprovedTargetInterpretationManifestSchema>;
export type EvidenceMatchType = z.infer<typeof EvidenceMatchTypeSchema>;
export type EvidenceMatchCoverage = z.infer<typeof EvidenceMatchCoverageSchema>;
export type EvidenceStrength = z.infer<typeof EvidenceStrengthSchema>;
export type TemporalRelevance = z.infer<typeof TemporalRelevanceSchema>;
export type EvidenceMatchConfidence = z.infer<typeof EvidenceMatchConfidenceSchema>;
export type EvidenceMatchTrustState = z.infer<typeof EvidenceMatchTrustStateSchema>;
export type ExpectationCoverageStatus = z.infer<typeof ExpectationCoverageStatusSchema>;
export type ExpectationMatchProvenance = z.infer<typeof ExpectationMatchProvenanceSchema>;
export type EvidenceMatchProvenance = z.infer<typeof EvidenceMatchProvenanceSchema>;
export type EvidenceSnapshotEntry = z.infer<typeof EvidenceSnapshotEntrySchema>;
export type EvidenceSnapshot = z.infer<typeof EvidenceSnapshotSchema>;
export type EvidenceSnapshotManifest = z.infer<typeof EvidenceSnapshotManifestSchema>;
export type EvidenceMatch = z.infer<typeof EvidenceMatchSchema>;
export type ExpectationCoverageRecord = z.infer<typeof ExpectationCoverageRecordSchema>;
export type EvidenceMatchingWarning = z.infer<typeof EvidenceMatchingWarningSchema>;
export type EvidenceMatchingAmbiguity = z.infer<typeof EvidenceMatchingAmbiguitySchema>;
export type EvidenceMatchingCompleteness = z.infer<typeof EvidenceMatchingCompletenessSchema>;
export type TargetEvidenceMatching = z.infer<typeof TargetEvidenceMatchingSchema>;
export type MatchingManifest = z.infer<typeof MatchingManifestSchema>;
export type ManualEvidenceMatching = z.infer<typeof ManualEvidenceMatchingSchema>;
export type ManualMatchingManifest = z.infer<typeof ManualMatchingManifestSchema>;
export type ModelEvidenceMatchPayload = z.infer<typeof ModelEvidenceMatchPayloadSchema>;
export type ProposedEvidenceMatch = z.infer<typeof ProposedEvidenceMatchSchema>;
export type ProposedExpectationCoverage = z.infer<typeof ProposedExpectationCoverageSchema>;
export type EvidenceMatchProposal = z.infer<typeof EvidenceMatchProposalSchema>;
export type EvidenceMatchProposalManifest = z.infer<typeof EvidenceMatchProposalManifestSchema>;
export type EvidenceMatchValidationIssue = z.infer<typeof EvidenceMatchValidationIssueSchema>;
export type EditedEvidenceMatch = z.infer<typeof EditedEvidenceMatchSchema>;
export type EvidenceMatchReviewDecision = z.infer<typeof EvidenceMatchReviewDecisionSchema>;
export type ExpectationCoverageReviewDecision = z.infer<typeof ExpectationCoverageReviewDecisionSchema>;
export type EvidenceMatchProposalReview = z.infer<typeof EvidenceMatchProposalReviewSchema>;
export type EvidenceMatchReviewManifest = z.infer<typeof EvidenceMatchReviewManifestSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type CareerProfile = z.infer<typeof CareerProfileSchema>;
