import { z } from "zod";
export declare const JobResumeRenderingModeSchema: z.ZodLiteral<"job-specific-resume">;
export declare const JobResumeApprovedDraftDependencySchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
    manifestPath: z.ZodEffects<z.ZodString, string, string>;
    manifestSha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
    id: string;
    manifestPath: string;
    manifestSha256: string;
}, {
    sha256: string;
    path: string;
    id: string;
    manifestPath: string;
    manifestSha256: string;
}>;
export declare const JobResumeRenderBlockSchema: z.ZodObject<{
    id: z.ZodString;
    sectionId: z.ZodString;
    draftItemId: z.ZodString;
    draftItemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
    type: z.ZodEnum<["headline", "paragraph", "bullet", "role-header", "project-header", "capability", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
    order: z.ZodNumber;
    text: z.ZodString;
    trustState: z.ZodEnum<["human-approved", "human-edited"]>;
    keepWithNext: z.ZodBoolean;
    avoidBreakInside: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
    id: string;
    sectionId: string;
    trustState: "human-approved" | "human-edited";
    text: string;
    order: number;
    draftItemId: string;
    keepWithNext: boolean;
    avoidBreakInside: boolean;
    draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
}, {
    type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
    id: string;
    sectionId: string;
    trustState: "human-approved" | "human-edited";
    text: string;
    order: number;
    draftItemId: string;
    keepWithNext: boolean;
    avoidBreakInside: boolean;
    draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
}>;
export declare const JobResumeRenderSectionSchema: z.ZodObject<{
    id: z.ZodString;
    draftSectionId: z.ZodString;
    type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
    order: z.ZodNumber;
    heading: z.ZodNullable<z.ZodString>;
    blocks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sectionId: z.ZodString;
        draftItemId: z.ZodString;
        draftItemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
        type: z.ZodEnum<["headline", "paragraph", "bullet", "role-header", "project-header", "capability", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
        order: z.ZodNumber;
        text: z.ZodString;
        trustState: z.ZodEnum<["human-approved", "human-edited"]>;
        keepWithNext: z.ZodBoolean;
        avoidBreakInside: z.ZodBoolean;
    }, "strict", z.ZodTypeAny, {
        type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
        id: string;
        sectionId: string;
        trustState: "human-approved" | "human-edited";
        text: string;
        order: number;
        draftItemId: string;
        keepWithNext: boolean;
        avoidBreakInside: boolean;
        draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    }, {
        type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
        id: string;
        sectionId: string;
        trustState: "human-approved" | "human-edited";
        text: string;
        order: number;
        draftItemId: string;
        keepWithNext: boolean;
        avoidBreakInside: boolean;
        draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    id: string;
    heading: string | null;
    order: number;
    draftSectionId: string;
    blocks: {
        type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
        id: string;
        sectionId: string;
        trustState: "human-approved" | "human-edited";
        text: string;
        order: number;
        draftItemId: string;
        keepWithNext: boolean;
        avoidBreakInside: boolean;
        draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    }[];
}, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    id: string;
    heading: string | null;
    order: number;
    draftSectionId: string;
    blocks: {
        type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
        id: string;
        sectionId: string;
        trustState: "human-approved" | "human-edited";
        text: string;
        order: number;
        draftItemId: string;
        keepWithNext: boolean;
        avoidBreakInside: boolean;
        draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    }[];
}>;
export declare const JobResumeRenderSourceMapEntrySchema: z.ZodObject<{
    id: z.ZodString;
    documentBlockId: z.ZodString;
    draftSectionId: z.ZodString;
    draftItemId: z.ZodString;
    statementId: z.ZodString;
    visibleTextSha256: z.ZodString;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    coverageIds: z.ZodArray<z.ZodString, "many">;
    assessmentIds: z.ZodArray<z.ZodString, "many">;
    evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    metricPermissionIds: z.ZodArray<z.ZodString, "many">;
    approvedDraftSha256: z.ZodString;
    visibleTextLocation: z.ZodObject<{
        sectionOrder: z.ZodNumber;
        itemOrder: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        sectionOrder: number;
        itemOrder: number;
    }, {
        sectionOrder: number;
        itemOrder: number;
    }>;
}, "strict", z.ZodTypeAny, {
    id: string;
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
    coverageIds: string[];
    assessmentIds: string[];
    evidenceMapLinkIds: string[];
    claimBoundaryIds: string[];
    metricPermissionIds: string[];
    draftItemId: string;
    draftSectionId: string;
    documentBlockId: string;
    approvedDraftSha256: string;
    visibleTextLocation: {
        sectionOrder: number;
        itemOrder: number;
    };
    statementId: string;
    visibleTextSha256: string;
}, {
    id: string;
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
    coverageIds: string[];
    assessmentIds: string[];
    evidenceMapLinkIds: string[];
    claimBoundaryIds: string[];
    metricPermissionIds: string[];
    draftItemId: string;
    draftSectionId: string;
    documentBlockId: string;
    approvedDraftSha256: string;
    visibleTextLocation: {
        sectionOrder: number;
        itemOrder: number;
    };
    statementId: string;
    visibleTextSha256: string;
}>;
export declare const JobResumeRenderRiskSchema: z.ZodObject<{
    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
    validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
    id: z.ZodString;
    code: z.ZodString;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    message: z.ZodString;
    exportId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    severity: "high" | "medium" | "low" | "critical";
    sectionIds: string[];
    draftItemIds: string[];
    formats: ("markdown" | "pdf" | "docx" | "html")[];
    validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    exportId?: string | undefined;
}, {
    code: string;
    message: string;
    id: string;
    severity: "high" | "medium" | "low" | "critical";
    sectionIds?: string[] | undefined;
    draftItemIds?: string[] | undefined;
    formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
    validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    exportId?: string | undefined;
}>;
export declare const JobResumeRenderWarningSchema: z.ZodObject<{
    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
    validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
    id: z.ZodString;
    code: z.ZodString;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    sectionIds: string[];
    draftItemIds: string[];
    formats: ("markdown" | "pdf" | "docx" | "html")[];
    validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
}, {
    code: string;
    message: string;
    id: string;
    sectionIds?: string[] | undefined;
    draftItemIds?: string[] | undefined;
    formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
    validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
}>;
export declare const JobResumeRenderAmbiguitySchema: z.ZodObject<{
    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
    validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
    id: z.ZodString;
    code: z.ZodString;
    message: z.ZodString;
    resolution: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    sectionIds: string[];
    draftItemIds: string[];
    formats: ("markdown" | "pdf" | "docx" | "html")[];
    resolution: string;
    validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
}, {
    code: string;
    message: string;
    id: string;
    resolution: string;
    sectionIds?: string[] | undefined;
    draftItemIds?: string[] | undefined;
    formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
    validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
}>;
export declare const JobResumeRenderValidationSummarySchema: z.ZodObject<{
    status: z.ZodEnum<["valid", "invalid"]>;
    exactTextPreserved: z.ZodBoolean;
    sectionOrderPreserved: z.ZodBoolean;
    itemOrderPreserved: z.ZodBoolean;
    sourceMapComplete: z.ZodBoolean;
    privateMetadataAbsent: z.ZodBoolean;
    risks: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
        validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
        id: z.ZodString;
        code: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
        exportId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        formats: ("markdown" | "pdf" | "docx" | "html")[];
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        exportId?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        exportId?: string | undefined;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
        validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        sectionIds: string[];
        draftItemIds: string[];
        formats: ("markdown" | "pdf" | "docx" | "html")[];
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
        validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
        resolution: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        sectionIds: string[];
        draftItemIds: string[];
        formats: ("markdown" | "pdf" | "docx" | "html")[];
        resolution: string;
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        resolution: string;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    status: "valid" | "invalid";
    warnings: {
        code: string;
        message: string;
        id: string;
        sectionIds: string[];
        draftItemIds: string[];
        formats: ("markdown" | "pdf" | "docx" | "html")[];
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        sectionIds: string[];
        draftItemIds: string[];
        formats: ("markdown" | "pdf" | "docx" | "html")[];
        resolution: string;
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    }[];
    risks: {
        code: string;
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        formats: ("markdown" | "pdf" | "docx" | "html")[];
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        exportId?: string | undefined;
    }[];
    exactTextPreserved: boolean;
    sectionOrderPreserved: boolean;
    itemOrderPreserved: boolean;
    sourceMapComplete: boolean;
    privateMetadataAbsent: boolean;
}, {
    status: "valid" | "invalid";
    warnings: {
        code: string;
        message: string;
        id: string;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        resolution: string;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
    }[];
    risks: {
        code: string;
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
        validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        exportId?: string | undefined;
    }[];
    exactTextPreserved: boolean;
    sectionOrderPreserved: boolean;
    itemOrderPreserved: boolean;
    sourceMapComplete: boolean;
    privateMetadataAbsent: boolean;
}>;
export declare const JobResumeRenderDocumentSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    mode: z.ZodLiteral<"job-specific-resume">;
    approvedDraft: z.ZodObject<{
        id: z.ZodString;
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
        id: string;
        manifestPath: string;
        manifestSha256: string;
    }, {
        sha256: string;
        path: string;
        id: string;
        manifestPath: string;
        manifestSha256: string;
    }>;
    renderingPolicy: z.ZodObject<{
        name: z.ZodLiteral<"job-resume-rendering-policy">;
        version: z.ZodLiteral<"1">;
    }, "strict", z.ZodTypeAny, {
        name: "job-resume-rendering-policy";
        version: "1";
    }, {
        name: "job-resume-rendering-policy";
        version: "1";
    }>;
    profile: z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        name: z.ZodEnum<["ats-standard", "compact-professional"]>;
        version: z.ZodLiteral<"1">;
        page: z.ZodObject<{
            size: z.ZodEnum<["A4", "LETTER"]>;
            marginTopMm: z.ZodNumber;
            marginRightMm: z.ZodNumber;
            marginBottomMm: z.ZodNumber;
            marginLeftMm: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            size: "A4" | "LETTER";
            marginTopMm: number;
            marginRightMm: number;
            marginBottomMm: number;
            marginLeftMm: number;
        }, {
            size: "A4" | "LETTER";
            marginTopMm: number;
            marginRightMm: number;
            marginBottomMm: number;
            marginLeftMm: number;
        }>;
        typography: z.ZodObject<{
            baseFontFamily: z.ZodString;
            baseFontSizePt: z.ZodNumber;
            minimumFontSizePt: z.ZodNumber;
            headingScale: z.ZodNumber;
            lineHeight: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            baseFontFamily: string;
            baseFontSizePt: number;
            minimumFontSizePt: number;
            headingScale: number;
            lineHeight: number;
        }, {
            baseFontFamily: string;
            baseFontSizePt: number;
            minimumFontSizePt: number;
            headingScale: number;
            lineHeight: number;
        }>;
        spacing: z.ZodObject<{
            sectionBeforePt: z.ZodNumber;
            sectionAfterPt: z.ZodNumber;
            itemSpacingPt: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            sectionBeforePt: number;
            sectionAfterPt: number;
            itemSpacingPt: number;
        }, {
            sectionBeforePt: number;
            sectionAfterPt: number;
            itemSpacingPt: number;
        }>;
        layout: z.ZodObject<{
            columns: z.ZodLiteral<1>;
            useTablesForCoreContent: z.ZodLiteral<false>;
            showSectionDividers: z.ZodBoolean;
        }, "strict", z.ZodTypeAny, {
            columns: 1;
            useTablesForCoreContent: false;
            showSectionDividers: boolean;
        }, {
            columns: 1;
            useTablesForCoreContent: false;
            showSectionDividers: boolean;
        }>;
        pageBreakRules: z.ZodArray<z.ZodObject<{
            blockType: z.ZodEnum<["headline", "paragraph", "bullet", "role-header", "project-header", "capability", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
            keepWithNext: z.ZodBoolean;
            avoidBreakInside: z.ZodBoolean;
        }, "strict", z.ZodTypeAny, {
            blockType: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            keepWithNext: boolean;
            avoidBreakInside: boolean;
        }, {
            blockType: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            keepWithNext: boolean;
            avoidBreakInside: boolean;
        }>, "many">;
        accessibility: z.ZodObject<{
            language: z.ZodLiteral<"en">;
            direction: z.ZodLiteral<"ltr">;
            logicalHeadingHierarchy: z.ZodLiteral<true>;
            semanticLists: z.ZodLiteral<true>;
            visibleLinkText: z.ZodLiteral<true>;
            colorOnlyMeaning: z.ZodLiteral<false>;
            iconsRequiredForMeaning: z.ZodLiteral<false>;
            singleColumnReadingOrder: z.ZodLiteral<true>;
            formalCertificationClaimed: z.ZodLiteral<false>;
        }, "strict", z.ZodTypeAny, {
            language: "en";
            direction: "ltr";
            logicalHeadingHierarchy: true;
            semanticLists: true;
            visibleLinkText: true;
            colorOnlyMeaning: false;
            iconsRequiredForMeaning: false;
            singleColumnReadingOrder: true;
            formalCertificationClaimed: false;
        }, {
            language: "en";
            direction: "ltr";
            logicalHeadingHierarchy: true;
            semanticLists: true;
            visibleLinkText: true;
            colorOnlyMeaning: false;
            iconsRequiredForMeaning: false;
            singleColumnReadingOrder: true;
            formalCertificationClaimed: false;
        }>;
    }, "strict", z.ZodTypeAny, {
        schemaVersion: 1;
        name: "ats-standard" | "compact-professional";
        version: "1";
        page: {
            size: "A4" | "LETTER";
            marginTopMm: number;
            marginRightMm: number;
            marginBottomMm: number;
            marginLeftMm: number;
        };
        typography: {
            baseFontFamily: string;
            baseFontSizePt: number;
            minimumFontSizePt: number;
            headingScale: number;
            lineHeight: number;
        };
        spacing: {
            sectionBeforePt: number;
            sectionAfterPt: number;
            itemSpacingPt: number;
        };
        layout: {
            columns: 1;
            useTablesForCoreContent: false;
            showSectionDividers: boolean;
        };
        pageBreakRules: {
            blockType: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            keepWithNext: boolean;
            avoidBreakInside: boolean;
        }[];
        accessibility: {
            language: "en";
            direction: "ltr";
            logicalHeadingHierarchy: true;
            semanticLists: true;
            visibleLinkText: true;
            colorOnlyMeaning: false;
            iconsRequiredForMeaning: false;
            singleColumnReadingOrder: true;
            formalCertificationClaimed: false;
        };
    }, {
        schemaVersion: 1;
        name: "ats-standard" | "compact-professional";
        version: "1";
        page: {
            size: "A4" | "LETTER";
            marginTopMm: number;
            marginRightMm: number;
            marginBottomMm: number;
            marginLeftMm: number;
        };
        typography: {
            baseFontFamily: string;
            baseFontSizePt: number;
            minimumFontSizePt: number;
            headingScale: number;
            lineHeight: number;
        };
        spacing: {
            sectionBeforePt: number;
            sectionAfterPt: number;
            itemSpacingPt: number;
        };
        layout: {
            columns: 1;
            useTablesForCoreContent: false;
            showSectionDividers: boolean;
        };
        pageBreakRules: {
            blockType: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            keepWithNext: boolean;
            avoidBreakInside: boolean;
        }[];
        accessibility: {
            language: "en";
            direction: "ltr";
            logicalHeadingHierarchy: true;
            semanticLists: true;
            visibleLinkText: true;
            colorOnlyMeaning: false;
            iconsRequiredForMeaning: false;
            singleColumnReadingOrder: true;
            formalCertificationClaimed: false;
        };
    }>;
    dateFormat: z.ZodEnum<["MMM-YYYY", "YYYY", "exact-source"]>;
    metadata: z.ZodObject<{
        documentTitle: z.ZodString;
        targetRoleTitle: z.ZodString;
        candidateName: z.ZodOptional<z.ZodString>;
        contact: z.ZodOptional<z.ZodObject<{
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
            website: z.ZodOptional<z.ZodString>;
            linkedin: z.ZodOptional<z.ZodString>;
            github: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            location?: string | undefined;
            email?: string | undefined;
            website?: string | undefined;
            linkedin?: string | undefined;
            github?: string | undefined;
            phone?: string | undefined;
        }, {
            location?: string | undefined;
            email?: string | undefined;
            website?: string | undefined;
            linkedin?: string | undefined;
            github?: string | undefined;
            phone?: string | undefined;
        }>>;
        language: z.ZodLiteral<"en">;
        direction: z.ZodLiteral<"ltr">;
        documentType: z.ZodLiteral<"job-resume">;
        generatedBy: z.ZodObject<{
            system: z.ZodLiteral<"ProofLayer">;
            policyName: z.ZodLiteral<"job-resume-rendering-policy">;
            policyVersion: z.ZodLiteral<"1">;
        }, "strict", z.ZodTypeAny, {
            policyVersion: "1";
            policyName: "job-resume-rendering-policy";
            system: "ProofLayer";
        }, {
            policyVersion: "1";
            policyName: "job-resume-rendering-policy";
            system: "ProofLayer";
        }>;
    }, "strict", z.ZodTypeAny, {
        language: "en";
        targetRoleTitle: string;
        direction: "ltr";
        documentTitle: string;
        documentType: "job-resume";
        generatedBy: {
            policyVersion: "1";
            policyName: "job-resume-rendering-policy";
            system: "ProofLayer";
        };
        candidateName?: string | undefined;
        contact?: {
            location?: string | undefined;
            email?: string | undefined;
            website?: string | undefined;
            linkedin?: string | undefined;
            github?: string | undefined;
            phone?: string | undefined;
        } | undefined;
    }, {
        language: "en";
        targetRoleTitle: string;
        direction: "ltr";
        documentTitle: string;
        documentType: "job-resume";
        generatedBy: {
            policyVersion: "1";
            policyName: "job-resume-rendering-policy";
            system: "ProofLayer";
        };
        candidateName?: string | undefined;
        contact?: {
            location?: string | undefined;
            email?: string | undefined;
            website?: string | undefined;
            linkedin?: string | undefined;
            github?: string | undefined;
            phone?: string | undefined;
        } | undefined;
    }>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        draftSectionId: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        order: z.ZodNumber;
        heading: z.ZodNullable<z.ZodString>;
        blocks: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            sectionId: z.ZodString;
            draftItemId: z.ZodString;
            draftItemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
            type: z.ZodEnum<["headline", "paragraph", "bullet", "role-header", "project-header", "capability", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
            order: z.ZodNumber;
            text: z.ZodString;
            trustState: z.ZodEnum<["human-approved", "human-edited"]>;
            keepWithNext: z.ZodBoolean;
            avoidBreakInside: z.ZodBoolean;
        }, "strict", z.ZodTypeAny, {
            type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }, {
            type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        heading: string | null;
        order: number;
        draftSectionId: string;
        blocks: {
            type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }[];
    }, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        heading: string | null;
        order: number;
        draftSectionId: string;
        blocks: {
            type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }[];
    }>, "many">;
    sourceMap: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        documentBlockId: z.ZodString;
        draftSectionId: z.ZodString;
        draftItemId: z.ZodString;
        statementId: z.ZodString;
        visibleTextSha256: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        metricPermissionIds: z.ZodArray<z.ZodString, "many">;
        approvedDraftSha256: z.ZodString;
        visibleTextLocation: z.ZodObject<{
            sectionOrder: z.ZodNumber;
            itemOrder: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            sectionOrder: number;
            itemOrder: number;
        }, {
            sectionOrder: number;
            itemOrder: number;
        }>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        draftSectionId: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
        statementId: string;
        visibleTextSha256: string;
    }, {
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        draftSectionId: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
        statementId: string;
        visibleTextSha256: string;
    }>, "many">;
    validation: z.ZodObject<{
        status: z.ZodEnum<["valid", "invalid"]>;
        exactTextPreserved: z.ZodBoolean;
        sectionOrderPreserved: z.ZodBoolean;
        itemOrderPreserved: z.ZodBoolean;
        sourceMapComplete: z.ZodBoolean;
        privateMetadataAbsent: z.ZodBoolean;
        risks: z.ZodArray<z.ZodObject<{
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
            validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
            id: z.ZodString;
            code: z.ZodString;
            severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
            message: z.ZodString;
            exportId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }, {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }>, "many">;
        warnings: z.ZodArray<z.ZodObject<{
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
            validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
            id: z.ZodString;
            code: z.ZodString;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            id: string;
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }, {
            code: string;
            message: string;
            id: string;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }>, "many">;
        ambiguities: z.ZodArray<z.ZodObject<{
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
            validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
            id: z.ZodString;
            code: z.ZodString;
            message: z.ZodString;
            resolution: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            id: string;
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            resolution: string;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }, {
            code: string;
            message: string;
            id: string;
            resolution: string;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "valid" | "invalid";
        warnings: {
            code: string;
            message: string;
            id: string;
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        ambiguities: {
            code: string;
            message: string;
            id: string;
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            resolution: string;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        risks: {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }[];
        exactTextPreserved: boolean;
        sectionOrderPreserved: boolean;
        itemOrderPreserved: boolean;
        sourceMapComplete: boolean;
        privateMetadataAbsent: boolean;
    }, {
        status: "valid" | "invalid";
        warnings: {
            code: string;
            message: string;
            id: string;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        ambiguities: {
            code: string;
            message: string;
            id: string;
            resolution: string;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        risks: {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }[];
        exactTextPreserved: boolean;
        sectionOrderPreserved: boolean;
        itemOrderPreserved: boolean;
        sourceMapComplete: boolean;
        privateMetadataAbsent: boolean;
    }>;
    provenance: z.ZodObject<{
        approvedDraftSha256: z.ZodString;
        approvedDraftManifestSha256: z.ZodString;
        contentPlanSha256: z.ZodString;
        requirementModelSha256: z.ZodString;
        evidenceMapSha256: z.ZodString;
        coverageSha256: z.ZodString;
        assessmentSha256: z.ZodString;
        compositionRulesVersion: z.ZodString;
        normalizedOptionsSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
        compositionRulesVersion: string;
        normalizedOptionsSha256: string;
    }, {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
        compositionRulesVersion: string;
        normalizedOptionsSha256: string;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    validation: {
        status: "valid" | "invalid";
        warnings: {
            code: string;
            message: string;
            id: string;
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        ambiguities: {
            code: string;
            message: string;
            id: string;
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            resolution: string;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        risks: {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }[];
        exactTextPreserved: boolean;
        sectionOrderPreserved: boolean;
        itemOrderPreserved: boolean;
        sourceMapComplete: boolean;
        privateMetadataAbsent: boolean;
    };
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        heading: string | null;
        order: number;
        draftSectionId: string;
        blocks: {
            type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }[];
    }[];
    targetType: "job";
    targetId: string;
    provenance: {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
        compositionRulesVersion: string;
        normalizedOptionsSha256: string;
    };
    profile: {
        schemaVersion: 1;
        name: "ats-standard" | "compact-professional";
        version: "1";
        page: {
            size: "A4" | "LETTER";
            marginTopMm: number;
            marginRightMm: number;
            marginBottomMm: number;
            marginLeftMm: number;
        };
        typography: {
            baseFontFamily: string;
            baseFontSizePt: number;
            minimumFontSizePt: number;
            headingScale: number;
            lineHeight: number;
        };
        spacing: {
            sectionBeforePt: number;
            sectionAfterPt: number;
            itemSpacingPt: number;
        };
        layout: {
            columns: 1;
            useTablesForCoreContent: false;
            showSectionDividers: boolean;
        };
        pageBreakRules: {
            blockType: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            keepWithNext: boolean;
            avoidBreakInside: boolean;
        }[];
        accessibility: {
            language: "en";
            direction: "ltr";
            logicalHeadingHierarchy: true;
            semanticLists: true;
            visibleLinkText: true;
            colorOnlyMeaning: false;
            iconsRequiredForMeaning: false;
            singleColumnReadingOrder: true;
            formalCertificationClaimed: false;
        };
    };
    approvedDraft: {
        sha256: string;
        path: string;
        id: string;
        manifestPath: string;
        manifestSha256: string;
    };
    renderingPolicy: {
        name: "job-resume-rendering-policy";
        version: "1";
    };
    dateFormat: "MMM-YYYY" | "YYYY" | "exact-source";
    metadata: {
        language: "en";
        targetRoleTitle: string;
        direction: "ltr";
        documentTitle: string;
        documentType: "job-resume";
        generatedBy: {
            policyVersion: "1";
            policyName: "job-resume-rendering-policy";
            system: "ProofLayer";
        };
        candidateName?: string | undefined;
        contact?: {
            location?: string | undefined;
            email?: string | undefined;
            website?: string | undefined;
            linkedin?: string | undefined;
            github?: string | undefined;
            phone?: string | undefined;
        } | undefined;
    };
    sourceMap: {
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        draftSectionId: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
        statementId: string;
        visibleTextSha256: string;
    }[];
}, {
    validation: {
        status: "valid" | "invalid";
        warnings: {
            code: string;
            message: string;
            id: string;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        ambiguities: {
            code: string;
            message: string;
            id: string;
            resolution: string;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        risks: {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }[];
        exactTextPreserved: boolean;
        sectionOrderPreserved: boolean;
        itemOrderPreserved: boolean;
        sourceMapComplete: boolean;
        privateMetadataAbsent: boolean;
    };
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        heading: string | null;
        order: number;
        draftSectionId: string;
        blocks: {
            type: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }[];
    }[];
    targetType: "job";
    targetId: string;
    provenance: {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
        compositionRulesVersion: string;
        normalizedOptionsSha256: string;
    };
    profile: {
        schemaVersion: 1;
        name: "ats-standard" | "compact-professional";
        version: "1";
        page: {
            size: "A4" | "LETTER";
            marginTopMm: number;
            marginRightMm: number;
            marginBottomMm: number;
            marginLeftMm: number;
        };
        typography: {
            baseFontFamily: string;
            baseFontSizePt: number;
            minimumFontSizePt: number;
            headingScale: number;
            lineHeight: number;
        };
        spacing: {
            sectionBeforePt: number;
            sectionAfterPt: number;
            itemSpacingPt: number;
        };
        layout: {
            columns: 1;
            useTablesForCoreContent: false;
            showSectionDividers: boolean;
        };
        pageBreakRules: {
            blockType: "paragraph" | "capability" | "certification" | "education" | "technology" | "headline" | "additional-information" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            keepWithNext: boolean;
            avoidBreakInside: boolean;
        }[];
        accessibility: {
            language: "en";
            direction: "ltr";
            logicalHeadingHierarchy: true;
            semanticLists: true;
            visibleLinkText: true;
            colorOnlyMeaning: false;
            iconsRequiredForMeaning: false;
            singleColumnReadingOrder: true;
            formalCertificationClaimed: false;
        };
    };
    approvedDraft: {
        sha256: string;
        path: string;
        id: string;
        manifestPath: string;
        manifestSha256: string;
    };
    renderingPolicy: {
        name: "job-resume-rendering-policy";
        version: "1";
    };
    dateFormat: "MMM-YYYY" | "YYYY" | "exact-source";
    metadata: {
        language: "en";
        targetRoleTitle: string;
        direction: "ltr";
        documentTitle: string;
        documentType: "job-resume";
        generatedBy: {
            policyVersion: "1";
            policyName: "job-resume-rendering-policy";
            system: "ProofLayer";
        };
        candidateName?: string | undefined;
        contact?: {
            location?: string | undefined;
            email?: string | undefined;
            website?: string | undefined;
            linkedin?: string | undefined;
            github?: string | undefined;
            phone?: string | undefined;
        } | undefined;
    };
    sourceMap: {
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        draftSectionId: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
        statementId: string;
        visibleTextSha256: string;
    }[];
}>;
export declare const JobResumeRenderDocumentManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    canonicalDocumentId: z.ZodString;
    targetId: z.ZodString;
    documentPath: z.ZodEffects<z.ZodString, string, string>;
    documentSha256: z.ZodString;
    approvedDraftSha256: z.ZodString;
    approvedDraftManifestSha256: z.ZodString;
    contentPlanSha256: z.ZodString;
    requirementModelSha256: z.ZodString;
    evidenceMapSha256: z.ZodString;
    coverageSha256: z.ZodString;
    assessmentSha256: z.ZodString;
    profileName: z.ZodEnum<["ats-standard", "compact-professional"]>;
    profileVersion: z.ZodLiteral<"1">;
    policyName: z.ZodLiteral<"job-resume-rendering-policy">;
    policyVersion: z.ZodLiteral<"1">;
    pageSize: z.ZodEnum<["A4", "LETTER"]>;
    dateFormat: z.ZodEnum<["MMM-YYYY", "YYYY", "exact-source"]>;
    compositionRulesVersion: z.ZodString;
    normalizedOptionsSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    policyVersion: "1";
    assessmentSha256: string;
    policyName: "job-resume-rendering-policy";
    requirementModelSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    contentPlanSha256: string;
    approvedDraftSha256: string;
    approvedDraftManifestSha256: string;
    compositionRulesVersion: string;
    normalizedOptionsSha256: string;
    dateFormat: "MMM-YYYY" | "YYYY" | "exact-source";
    canonicalDocumentId: string;
    documentPath: string;
    documentSha256: string;
    profileName: "ats-standard" | "compact-professional";
    profileVersion: "1";
    pageSize: "A4" | "LETTER";
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    policyVersion: "1";
    assessmentSha256: string;
    policyName: "job-resume-rendering-policy";
    requirementModelSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    contentPlanSha256: string;
    approvedDraftSha256: string;
    approvedDraftManifestSha256: string;
    compositionRulesVersion: string;
    normalizedOptionsSha256: string;
    dateFormat: "MMM-YYYY" | "YYYY" | "exact-source";
    canonicalDocumentId: string;
    documentPath: string;
    documentSha256: string;
    profileName: "ats-standard" | "compact-professional";
    profileVersion: "1";
    pageSize: "A4" | "LETTER";
}>;
export declare const JobResumeSourceMapSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    canonicalDocumentId: z.ZodString;
    approvedDraftId: z.ZodString;
    approvedDraftSha256: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        documentBlockId: z.ZodString;
        draftSectionId: z.ZodString;
        draftItemId: z.ZodString;
        statementId: z.ZodString;
        visibleTextSha256: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        metricPermissionIds: z.ZodArray<z.ZodString, "many">;
        approvedDraftSha256: z.ZodString;
        visibleTextLocation: z.ZodObject<{
            sectionOrder: z.ZodNumber;
            itemOrder: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            sectionOrder: number;
            itemOrder: number;
        }, {
            sectionOrder: number;
            itemOrder: number;
        }>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        draftSectionId: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
        statementId: string;
        visibleTextSha256: string;
    }, {
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        draftSectionId: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
        statementId: string;
        visibleTextSha256: string;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    entries: {
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        draftSectionId: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
        statementId: string;
        visibleTextSha256: string;
    }[];
    schemaVersion: 1;
    approvedDraftSha256: string;
    canonicalDocumentId: string;
    approvedDraftId: string;
}, {
    entries: {
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        draftSectionId: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
        statementId: string;
        visibleTextSha256: string;
    }[];
    schemaVersion: 1;
    approvedDraftSha256: string;
    canonicalDocumentId: string;
    approvedDraftId: string;
}>;
export declare const JobResumeExportManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    exportId: z.ZodString;
    targetId: z.ZodString;
    approvedDraftId: z.ZodString;
    format: z.ZodEnum<["markdown", "html", "docx", "pdf"]>;
    rendererName: z.ZodString;
    rendererVersion: z.ZodString;
    outputPath: z.ZodEffects<z.ZodString, string, string>;
    outputSha256: z.ZodString;
    outputSizeBytes: z.ZodNumber;
    canonicalDocumentId: z.ZodString;
    canonicalDocumentPath: z.ZodEffects<z.ZodString, string, string>;
    canonicalDocumentSha256: z.ZodString;
    profile: z.ZodObject<{
        name: z.ZodEnum<["ats-standard", "compact-professional"]>;
        version: z.ZodLiteral<"1">;
    }, "strict", z.ZodTypeAny, {
        name: "ats-standard" | "compact-professional";
        version: "1";
    }, {
        name: "ats-standard" | "compact-professional";
        version: "1";
    }>;
    renderingPolicy: z.ZodObject<{
        name: z.ZodLiteral<"job-resume-rendering-policy">;
        version: z.ZodLiteral<"1">;
    }, "strict", z.ZodTypeAny, {
        name: "job-resume-rendering-policy";
        version: "1";
    }, {
        name: "job-resume-rendering-policy";
        version: "1";
    }>;
    pageSize: z.ZodEnum<["A4", "LETTER"]>;
    dateFormat: z.ZodEnum<["MMM-YYYY", "YYYY", "exact-source"]>;
    sourceMapPath: z.ZodEffects<z.ZodString, string, string>;
    sourceMapSha256: z.ZodString;
    validation: z.ZodObject<{
        status: z.ZodEnum<["valid", "invalid"]>;
        nonEmpty: z.ZodBoolean;
        formatValid: z.ZodBoolean;
        visibleTextEquivalent: z.ZodBoolean;
        normalizedVisibleTextSha256: z.ZodString;
        sectionOrderPreserved: z.ZodBoolean;
        firstMarkerPresent: z.ZodBoolean;
        lastMarkerPresent: z.ZodBoolean;
        pageCount: z.ZodOptional<z.ZodNumber>;
        pageSizeVerified: z.ZodOptional<z.ZodBoolean>;
        textExtractable: z.ZodOptional<z.ZodBoolean>;
        binaryDeterministic: z.ZodBoolean;
        risks: z.ZodArray<z.ZodObject<{
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
            validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
            id: z.ZodString;
            code: z.ZodString;
            severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
            message: z.ZodString;
            exportId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }, {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }>, "many">;
        warnings: z.ZodArray<z.ZodObject<{
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["markdown", "html", "docx", "pdf"]>, "many">>;
            validationStage: z.ZodOptional<z.ZodEnum<["input", "canonical", "format", "visual", "cross-format"]>>;
            id: z.ZodString;
            code: z.ZodString;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            id: string;
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }, {
            code: string;
            message: string;
            id: string;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "valid" | "invalid";
        warnings: {
            code: string;
            message: string;
            id: string;
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        risks: {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }[];
        sectionOrderPreserved: boolean;
        nonEmpty: boolean;
        formatValid: boolean;
        visibleTextEquivalent: boolean;
        normalizedVisibleTextSha256: string;
        firstMarkerPresent: boolean;
        lastMarkerPresent: boolean;
        binaryDeterministic: boolean;
        pageCount?: number | undefined;
        pageSizeVerified?: boolean | undefined;
        textExtractable?: boolean | undefined;
    }, {
        status: "valid" | "invalid";
        warnings: {
            code: string;
            message: string;
            id: string;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        risks: {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }[];
        sectionOrderPreserved: boolean;
        nonEmpty: boolean;
        formatValid: boolean;
        visibleTextEquivalent: boolean;
        normalizedVisibleTextSha256: string;
        firstMarkerPresent: boolean;
        lastMarkerPresent: boolean;
        binaryDeterministic: boolean;
        pageCount?: number | undefined;
        pageSizeVerified?: boolean | undefined;
        textExtractable?: boolean | undefined;
    }>;
    dependencies: z.ZodObject<{
        approvedDraftSha256: z.ZodString;
        approvedDraftManifestSha256: z.ZodString;
        contentPlanSha256: z.ZodString;
        requirementModelSha256: z.ZodString;
        evidenceMapSha256: z.ZodString;
        coverageSha256: z.ZodString;
        assessmentSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
    }, {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    validation: {
        status: "valid" | "invalid";
        warnings: {
            code: string;
            message: string;
            id: string;
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        risks: {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            formats: ("markdown" | "pdf" | "docx" | "html")[];
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }[];
        sectionOrderPreserved: boolean;
        nonEmpty: boolean;
        formatValid: boolean;
        visibleTextEquivalent: boolean;
        normalizedVisibleTextSha256: string;
        firstMarkerPresent: boolean;
        lastMarkerPresent: boolean;
        binaryDeterministic: boolean;
        pageCount?: number | undefined;
        pageSizeVerified?: boolean | undefined;
        textExtractable?: boolean | undefined;
    };
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    profile: {
        name: "ats-standard" | "compact-professional";
        version: "1";
    };
    dependencies: {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
    };
    format: "markdown" | "pdf" | "docx" | "html";
    exportId: string;
    renderingPolicy: {
        name: "job-resume-rendering-policy";
        version: "1";
    };
    dateFormat: "MMM-YYYY" | "YYYY" | "exact-source";
    canonicalDocumentId: string;
    pageSize: "A4" | "LETTER";
    approvedDraftId: string;
    rendererName: string;
    rendererVersion: string;
    outputPath: string;
    outputSha256: string;
    outputSizeBytes: number;
    canonicalDocumentPath: string;
    canonicalDocumentSha256: string;
    sourceMapPath: string;
    sourceMapSha256: string;
}, {
    validation: {
        status: "valid" | "invalid";
        warnings: {
            code: string;
            message: string;
            id: string;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
        }[];
        risks: {
            code: string;
            message: string;
            id: string;
            severity: "high" | "medium" | "low" | "critical";
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            formats?: ("markdown" | "pdf" | "docx" | "html")[] | undefined;
            validationStage?: "input" | "canonical" | "format" | "visual" | "cross-format" | undefined;
            exportId?: string | undefined;
        }[];
        sectionOrderPreserved: boolean;
        nonEmpty: boolean;
        formatValid: boolean;
        visibleTextEquivalent: boolean;
        normalizedVisibleTextSha256: string;
        firstMarkerPresent: boolean;
        lastMarkerPresent: boolean;
        binaryDeterministic: boolean;
        pageCount?: number | undefined;
        pageSizeVerified?: boolean | undefined;
        textExtractable?: boolean | undefined;
    };
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    profile: {
        name: "ats-standard" | "compact-professional";
        version: "1";
    };
    dependencies: {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
    };
    format: "markdown" | "pdf" | "docx" | "html";
    exportId: string;
    renderingPolicy: {
        name: "job-resume-rendering-policy";
        version: "1";
    };
    dateFormat: "MMM-YYYY" | "YYYY" | "exact-source";
    canonicalDocumentId: string;
    pageSize: "A4" | "LETTER";
    approvedDraftId: string;
    rendererName: string;
    rendererVersion: string;
    outputPath: string;
    outputSha256: string;
    outputSizeBytes: number;
    canonicalDocumentPath: string;
    canonicalDocumentSha256: string;
    sourceMapPath: string;
    sourceMapSha256: string;
}>;
export type JobResumeRenderDocument = z.infer<typeof JobResumeRenderDocumentSchema>;
export type JobResumeRenderDocumentManifest = z.infer<typeof JobResumeRenderDocumentManifestSchema>;
export type JobResumeRenderSection = z.infer<typeof JobResumeRenderSectionSchema>;
export type JobResumeRenderBlock = z.infer<typeof JobResumeRenderBlockSchema>;
export type JobResumeRenderSourceMapEntry = z.infer<typeof JobResumeRenderSourceMapEntrySchema>;
export type JobResumeSourceMap = z.infer<typeof JobResumeSourceMapSchema>;
export type JobResumeExportManifest = z.infer<typeof JobResumeExportManifestSchema>;
