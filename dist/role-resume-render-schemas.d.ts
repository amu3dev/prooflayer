import { z } from "zod";
export declare const RoleResumeRenderingModeSchema: z.ZodLiteral<"market-positioning">;
export declare const RoleResumeExportFormatSchema: z.ZodEnum<["markdown", "html", "docx", "pdf"]>;
export declare const RoleResumeRenderProfileNameSchema: z.ZodEnum<["ats-standard", "compact-professional"]>;
export declare const RoleResumePageSizeSchema: z.ZodEnum<["A4", "LETTER"]>;
export declare const RoleResumeDateFormatSchema: z.ZodEnum<["MMM-YYYY", "YYYY", "exact-source"]>;
export declare const RoleResumeRenderBlockTypeSchema: z.ZodEnum<["headline", "paragraph", "bullet", "role-header", "project-header", "capability", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
export declare const RoleResumePageBreakRuleSchema: z.ZodObject<{
    blockType: z.ZodEnum<["headline", "paragraph", "bullet", "role-header", "project-header", "capability", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
    keepWithNext: z.ZodBoolean;
    avoidBreakInside: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
    keepWithNext: boolean;
    avoidBreakInside: boolean;
}, {
    blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
    keepWithNext: boolean;
    avoidBreakInside: boolean;
}>;
export declare const RoleResumeAccessibilitySettingsSchema: z.ZodObject<{
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
export declare const RoleResumeRenderProfileSchema: z.ZodObject<{
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
        blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
        keepWithNext: boolean;
        avoidBreakInside: boolean;
    }, {
        blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
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
        blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
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
        blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
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
export declare const RoleResumeApprovedDraftDependencySchema: z.ZodObject<{
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
export declare const RoleResumeDocumentMetadataSchema: z.ZodObject<{
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
    documentType: z.ZodLiteral<"role-resume">;
    generatedBy: z.ZodObject<{
        system: z.ZodLiteral<"ProofLayer">;
        policyName: z.ZodString;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        policyVersion: string;
        policyName: string;
        system: "ProofLayer";
    }, {
        policyVersion: string;
        policyName: string;
        system: "ProofLayer";
    }>;
}, "strict", z.ZodTypeAny, {
    targetRoleTitle: string;
    language: "en";
    direction: "ltr";
    documentTitle: string;
    documentType: "role-resume";
    generatedBy: {
        policyVersion: string;
        policyName: string;
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
    targetRoleTitle: string;
    language: "en";
    direction: "ltr";
    documentTitle: string;
    documentType: "role-resume";
    generatedBy: {
        policyVersion: string;
        policyName: string;
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
export declare const RoleResumeRenderBlockSchema: z.ZodObject<{
    id: z.ZodString;
    sectionId: z.ZodString;
    draftItemId: z.ZodString;
    draftItemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
    type: z.ZodEnum<["headline", "paragraph", "bullet", "role-header", "project-header", "capability", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
    order: z.ZodNumber;
    text: z.ZodString;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
    keepWithNext: z.ZodBoolean;
    avoidBreakInside: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
    id: string;
    sectionId: string;
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    text: string;
    order: number;
    draftItemId: string;
    keepWithNext: boolean;
    avoidBreakInside: boolean;
    draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
}, {
    type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
    id: string;
    sectionId: string;
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    text: string;
    order: number;
    draftItemId: string;
    keepWithNext: boolean;
    avoidBreakInside: boolean;
    draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
}>;
export declare const RoleResumeRenderSectionSchema: z.ZodObject<{
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
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        keepWithNext: z.ZodBoolean;
        avoidBreakInside: z.ZodBoolean;
    }, "strict", z.ZodTypeAny, {
        type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
        id: string;
        sectionId: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        text: string;
        order: number;
        draftItemId: string;
        keepWithNext: boolean;
        avoidBreakInside: boolean;
        draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    }, {
        type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
        id: string;
        sectionId: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        text: string;
        order: number;
        draftItemId: string;
        keepWithNext: boolean;
        avoidBreakInside: boolean;
        draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    id: string;
    heading: string | null;
    order: number;
    draftSectionId: string;
    blocks: {
        type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
        id: string;
        sectionId: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        text: string;
        order: number;
        draftItemId: string;
        keepWithNext: boolean;
        avoidBreakInside: boolean;
        draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    }[];
}, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    id: string;
    heading: string | null;
    order: number;
    draftSectionId: string;
    blocks: {
        type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
        id: string;
        sectionId: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        text: string;
        order: number;
        draftItemId: string;
        keepWithNext: boolean;
        avoidBreakInside: boolean;
        draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    }[];
}>;
export declare const RoleResumeRenderSourceMapEntrySchema: z.ZodObject<{
    id: z.ZodString;
    documentBlockId: z.ZodString;
    sectionId: z.ZodString;
    draftItemId: z.ZodString;
    statementTextSha256: z.ZodString;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    assessmentIds: z.ZodArray<z.ZodString, "many">;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
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
    sectionId: string;
    expectationIds: string[];
    evidenceIds: string[];
    approvedMatchIds: string[];
    assessmentIds: string[];
    claimBoundaryIds: string[];
    draftItemId: string;
    statementTextSha256: string;
    documentBlockId: string;
    approvedDraftSha256: string;
    visibleTextLocation: {
        sectionOrder: number;
        itemOrder: number;
    };
}, {
    id: string;
    sectionId: string;
    expectationIds: string[];
    evidenceIds: string[];
    approvedMatchIds: string[];
    assessmentIds: string[];
    claimBoundaryIds: string[];
    draftItemId: string;
    statementTextSha256: string;
    documentBlockId: string;
    approvedDraftSha256: string;
    visibleTextLocation: {
        sectionOrder: number;
        itemOrder: number;
    };
}>;
export declare const RoleResumeRenderRiskSchema: z.ZodObject<{
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
export declare const RoleResumeRenderWarningSchema: z.ZodObject<{
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
export declare const RoleResumeRenderAmbiguitySchema: z.ZodObject<{
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
export declare const RoleResumeRenderValidationSummarySchema: z.ZodObject<{
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
export declare const RoleResumeRenderProvenanceSchema: z.ZodObject<{
    approvedDraftSha256: z.ZodString;
    approvedDraftManifestSha256: z.ZodString;
    approvedPlanSha256: z.ZodString;
    compositionRulesVersion: z.ZodString;
    normalizedOptionsSha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    approvedPlanSha256: string;
    approvedDraftSha256: string;
    approvedDraftManifestSha256: string;
    compositionRulesVersion: string;
    normalizedOptionsSha256: string;
}, {
    approvedPlanSha256: string;
    approvedDraftSha256: string;
    approvedDraftManifestSha256: string;
    compositionRulesVersion: string;
    normalizedOptionsSha256: string;
}>;
export declare const RoleResumeRenderDocumentSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"role">;
    mode: z.ZodLiteral<"market-positioning">;
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
        name: z.ZodLiteral<"role-resume-rendering-policy">;
        version: z.ZodLiteral<"1">;
    }, "strict", z.ZodTypeAny, {
        name: "role-resume-rendering-policy";
        version: "1";
    }, {
        name: "role-resume-rendering-policy";
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
            blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            keepWithNext: boolean;
            avoidBreakInside: boolean;
        }, {
            blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
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
            blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
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
            blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
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
        documentType: z.ZodLiteral<"role-resume">;
        generatedBy: z.ZodObject<{
            system: z.ZodLiteral<"ProofLayer">;
            policyName: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            policyName: string;
            system: "ProofLayer";
        }, {
            policyVersion: string;
            policyName: string;
            system: "ProofLayer";
        }>;
    }, "strict", z.ZodTypeAny, {
        targetRoleTitle: string;
        language: "en";
        direction: "ltr";
        documentTitle: string;
        documentType: "role-resume";
        generatedBy: {
            policyVersion: string;
            policyName: string;
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
        targetRoleTitle: string;
        language: "en";
        direction: "ltr";
        documentTitle: string;
        documentType: "role-resume";
        generatedBy: {
            policyVersion: string;
            policyName: string;
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
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
            keepWithNext: z.ZodBoolean;
            avoidBreakInside: z.ZodBoolean;
        }, "strict", z.ZodTypeAny, {
            type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }, {
            type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        heading: string | null;
        order: number;
        draftSectionId: string;
        blocks: {
            type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }[];
    }, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        heading: string | null;
        order: number;
        draftSectionId: string;
        blocks: {
            type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }[];
    }>, "many">;
    sourceMap: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        documentBlockId: z.ZodString;
        sectionId: z.ZodString;
        draftItemId: z.ZodString;
        statementTextSha256: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
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
        sectionId: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        assessmentIds: string[];
        claimBoundaryIds: string[];
        draftItemId: string;
        statementTextSha256: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
    }, {
        id: string;
        sectionId: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        assessmentIds: string[];
        claimBoundaryIds: string[];
        draftItemId: string;
        statementTextSha256: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
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
        approvedPlanSha256: z.ZodString;
        compositionRulesVersion: z.ZodString;
        normalizedOptionsSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        approvedPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
        compositionRulesVersion: string;
        normalizedOptionsSha256: string;
    }, {
        approvedPlanSha256: string;
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
    mode: "market-positioning";
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        heading: string | null;
        order: number;
        draftSectionId: string;
        blocks: {
            type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }[];
    }[];
    targetType: "role";
    targetId: string;
    provenance: {
        approvedPlanSha256: string;
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
            blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
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
        name: "role-resume-rendering-policy";
        version: "1";
    };
    dateFormat: "MMM-YYYY" | "YYYY" | "exact-source";
    metadata: {
        targetRoleTitle: string;
        language: "en";
        direction: "ltr";
        documentTitle: string;
        documentType: "role-resume";
        generatedBy: {
            policyVersion: string;
            policyName: string;
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
        sectionId: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        assessmentIds: string[];
        claimBoundaryIds: string[];
        draftItemId: string;
        statementTextSha256: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
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
    mode: "market-positioning";
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        heading: string | null;
        order: number;
        draftSectionId: string;
        blocks: {
            type: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
            id: string;
            sectionId: string;
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
            order: number;
            draftItemId: string;
            keepWithNext: boolean;
            avoidBreakInside: boolean;
            draftItemType: "capability" | "project" | "certification" | "education" | "summary" | "headline" | "additional-information" | "technology" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        }[];
    }[];
    targetType: "role";
    targetId: string;
    provenance: {
        approvedPlanSha256: string;
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
            blockType: "paragraph" | "capability" | "certification" | "education" | "headline" | "additional-information" | "technology" | "leadership-capability" | "bullet" | "role-header" | "project-header";
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
        name: "role-resume-rendering-policy";
        version: "1";
    };
    dateFormat: "MMM-YYYY" | "YYYY" | "exact-source";
    metadata: {
        targetRoleTitle: string;
        language: "en";
        direction: "ltr";
        documentTitle: string;
        documentType: "role-resume";
        generatedBy: {
            policyVersion: string;
            policyName: string;
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
        sectionId: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        assessmentIds: string[];
        claimBoundaryIds: string[];
        draftItemId: string;
        statementTextSha256: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
    }[];
}>;
export declare const RoleResumeRenderDocumentManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    canonicalDocumentId: z.ZodString;
    targetId: z.ZodString;
    documentPath: z.ZodEffects<z.ZodString, string, string>;
    documentSha256: z.ZodString;
    approvedDraftSha256: z.ZodString;
    approvedDraftManifestSha256: z.ZodString;
    approvedPlanSha256: z.ZodString;
    profileName: z.ZodEnum<["ats-standard", "compact-professional"]>;
    profileVersion: z.ZodLiteral<"1">;
    policyName: z.ZodLiteral<"role-resume-rendering-policy">;
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
    policyName: "role-resume-rendering-policy";
    approvedPlanSha256: string;
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
    policyName: "role-resume-rendering-policy";
    approvedPlanSha256: string;
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
export declare const RoleResumeSourceMapSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    canonicalDocumentId: z.ZodString;
    approvedDraftId: z.ZodString;
    approvedDraftSha256: z.ZodString;
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        documentBlockId: z.ZodString;
        sectionId: z.ZodString;
        draftItemId: z.ZodString;
        statementTextSha256: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
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
        sectionId: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        assessmentIds: string[];
        claimBoundaryIds: string[];
        draftItemId: string;
        statementTextSha256: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
    }, {
        id: string;
        sectionId: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        assessmentIds: string[];
        claimBoundaryIds: string[];
        draftItemId: string;
        statementTextSha256: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    entries: {
        id: string;
        sectionId: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        assessmentIds: string[];
        claimBoundaryIds: string[];
        draftItemId: string;
        statementTextSha256: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
    }[];
    schemaVersion: 1;
    approvedDraftSha256: string;
    canonicalDocumentId: string;
    approvedDraftId: string;
}, {
    entries: {
        id: string;
        sectionId: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        assessmentIds: string[];
        claimBoundaryIds: string[];
        draftItemId: string;
        statementTextSha256: string;
        documentBlockId: string;
        approvedDraftSha256: string;
        visibleTextLocation: {
            sectionOrder: number;
            itemOrder: number;
        };
    }[];
    schemaVersion: 1;
    approvedDraftSha256: string;
    canonicalDocumentId: string;
    approvedDraftId: string;
}>;
export declare const RoleResumeExportValidationSummarySchema: z.ZodObject<{
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
export declare const RoleResumeExportManifestSchema: z.ZodObject<{
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
        name: z.ZodLiteral<"role-resume-rendering-policy">;
        version: z.ZodLiteral<"1">;
    }, "strict", z.ZodTypeAny, {
        name: "role-resume-rendering-policy";
        version: "1";
    }, {
        name: "role-resume-rendering-policy";
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
        approvedPlanSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        approvedPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
    }, {
        approvedPlanSha256: string;
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
    format: "markdown" | "pdf" | "docx" | "html";
    exportId: string;
    renderingPolicy: {
        name: "role-resume-rendering-policy";
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
    dependencies: {
        approvedPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
    };
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
    format: "markdown" | "pdf" | "docx" | "html";
    exportId: string;
    renderingPolicy: {
        name: "role-resume-rendering-policy";
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
    dependencies: {
        approvedPlanSha256: string;
        approvedDraftSha256: string;
        approvedDraftManifestSha256: string;
    };
}>;
export type RoleResumeExportFormat = z.infer<typeof RoleResumeExportFormatSchema>;
export type RoleResumeRenderProfileName = z.infer<typeof RoleResumeRenderProfileNameSchema>;
export type RoleResumePageSize = z.infer<typeof RoleResumePageSizeSchema>;
export type RoleResumeDateFormat = z.infer<typeof RoleResumeDateFormatSchema>;
export type RoleResumeRenderProfile = z.infer<typeof RoleResumeRenderProfileSchema>;
export type RoleResumeRenderBlock = z.infer<typeof RoleResumeRenderBlockSchema>;
export type RoleResumeRenderSection = z.infer<typeof RoleResumeRenderSectionSchema>;
export type RoleResumeRenderSourceMapEntry = z.infer<typeof RoleResumeRenderSourceMapEntrySchema>;
export type RoleResumeRenderDocument = z.infer<typeof RoleResumeRenderDocumentSchema>;
export type RoleResumeRenderDocumentManifest = z.infer<typeof RoleResumeRenderDocumentManifestSchema>;
export type RoleResumeSourceMap = z.infer<typeof RoleResumeSourceMapSchema>;
export type RoleResumeExportValidationSummary = z.infer<typeof RoleResumeExportValidationSummarySchema>;
export type RoleResumeExportManifest = z.infer<typeof RoleResumeExportManifestSchema>;
