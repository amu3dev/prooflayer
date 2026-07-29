import { z } from "zod";
export declare const RoleResumeDraftingModeSchema: z.ZodLiteral<"market-positioning">;
export declare const RoleResumeDraftTrustStateSchema: z.ZodEnum<["model-proposed", "deterministic-proposed", "deterministic-approved", "human-approved", "human-edited"]>;
export declare const RoleResumeDraftItemTypeSchema: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
export declare const ResumeDraftValidationIssueSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    expectationIds: string[];
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
    matchIds: string[];
}, {
    code: string;
    message: string;
    severity: "high" | "medium" | "low" | "critical";
    expectationIds?: string[] | undefined;
    evidenceIds?: string[] | undefined;
    sectionIds?: string[] | undefined;
    draftItemIds?: string[] | undefined;
    claimBoundaryIds?: string[] | undefined;
    matchIds?: string[] | undefined;
}>;
export declare const RoleResumeDraftItemValidationSchema: z.ZodObject<{
    status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
    issues: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }, {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        expectationIds?: string[] | undefined;
        evidenceIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
        matchIds?: string[] | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    issues: {
        code: string;
        message: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    status: "valid" | "invalid" | "requires-review";
}, {
    issues: {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        expectationIds?: string[] | undefined;
        evidenceIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
        matchIds?: string[] | undefined;
    }[];
    status: "valid" | "invalid" | "requires-review";
}>;
export declare const ResumeMetricReferenceSchema: z.ZodObject<{
    evidenceId: z.ZodString;
    sourcePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    originalValue: z.ZodString;
    normalizedValue: z.ZodOptional<z.ZodString>;
    unit: z.ZodOptional<z.ZodString>;
    temporalContext: z.ZodOptional<z.ZodString>;
    attributionScope: z.ZodOptional<z.ZodString>;
    reviewStatus: z.ZodLiteral<"reviewed">;
}, "strict", z.ZodTypeAny, {
    evidenceId: string;
    originalValue: string;
    reviewStatus: "reviewed";
    sourcePath?: string | undefined;
    normalizedValue?: string | undefined;
    unit?: string | undefined;
    temporalContext?: string | undefined;
    attributionScope?: string | undefined;
}, {
    evidenceId: string;
    originalValue: string;
    reviewStatus: "reviewed";
    sourcePath?: string | undefined;
    normalizedValue?: string | undefined;
    unit?: string | undefined;
    temporalContext?: string | undefined;
    attributionScope?: string | undefined;
}>;
export declare const ResumeScopeReferenceSchema: z.ZodObject<{
    type: z.ZodEnum<["role", "team", "product", "technical", "temporal", "project"]>;
    value: z.ZodString;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    status: z.ZodEnum<["approved", "qualified"]>;
}, "strict", z.ZodTypeAny, {
    value: string;
    type: "role" | "project" | "technical" | "temporal" | "team" | "product";
    status: "approved" | "qualified";
    evidenceIds: string[];
}, {
    value: string;
    type: "role" | "project" | "technical" | "temporal" | "team" | "product";
    status: "approved" | "qualified";
    evidenceIds: string[];
}>;
export declare const RoleResumeDraftItemProvenanceSchema: z.ZodObject<{
    targetId: z.ZodString;
    approvedPlanId: z.ZodString;
    planSectionId: z.ZodString;
    proposalId: z.ZodOptional<z.ZodString>;
    draftingPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>;
    artifactHashes: z.ZodObject<{
        approvedInterpretationSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        approvedPlanSha256: z.ZodString;
        scaffoldSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        scaffoldSha256: string;
        approvedAssessmentSha256: string;
        approvedPlanSha256: string;
    }, {
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        scaffoldSha256: string;
        approvedAssessmentSha256: string;
        approvedPlanSha256: string;
    }>;
    model: z.ZodOptional<z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        promptTemplateId: z.ZodString;
        promptTemplateVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        provider: string;
        model: string;
        promptTemplateId: string;
        promptTemplateVersion: string;
    }, {
        provider: string;
        model: string;
        promptTemplateId: string;
        promptTemplateVersion: string;
    }>>;
    reviewDecision: z.ZodOptional<z.ZodObject<{
        decision: z.ZodEnum<["accept", "edit"]>;
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
    }, "strict", z.ZodTypeAny, {
        decision: "accept" | "edit";
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
    }, {
        decision: "accept" | "edit";
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
    }>>;
}, "strict", z.ZodTypeAny, {
    targetId: string;
    planSectionId: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    artifactHashes: {
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        scaffoldSha256: string;
        approvedAssessmentSha256: string;
        approvedPlanSha256: string;
    };
    approvedPlanId: string;
    model?: {
        provider: string;
        model: string;
        promptTemplateId: string;
        promptTemplateVersion: string;
    } | undefined;
    proposalId?: string | undefined;
    reviewDecision?: {
        decision: "accept" | "edit";
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
    } | undefined;
}, {
    targetId: string;
    planSectionId: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    artifactHashes: {
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        scaffoldSha256: string;
        approvedAssessmentSha256: string;
        approvedPlanSha256: string;
    };
    approvedPlanId: string;
    model?: {
        provider: string;
        model: string;
        promptTemplateId: string;
        promptTemplateVersion: string;
    } | undefined;
    proposalId?: string | undefined;
    reviewDecision?: {
        decision: "accept" | "edit";
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
    } | undefined;
}>;
export declare const RoleResumeDraftItemSchema: z.ZodObject<{
    claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    metricReferences: z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        sourcePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        originalValue: z.ZodString;
        normalizedValue: z.ZodOptional<z.ZodString>;
        unit: z.ZodOptional<z.ZodString>;
        temporalContext: z.ZodOptional<z.ZodString>;
        attributionScope: z.ZodOptional<z.ZodString>;
        reviewStatus: z.ZodLiteral<"reviewed">;
    }, "strict", z.ZodTypeAny, {
        evidenceId: string;
        originalValue: string;
        reviewStatus: "reviewed";
        sourcePath?: string | undefined;
        normalizedValue?: string | undefined;
        unit?: string | undefined;
        temporalContext?: string | undefined;
        attributionScope?: string | undefined;
    }, {
        evidenceId: string;
        originalValue: string;
        reviewStatus: "reviewed";
        sourcePath?: string | undefined;
        normalizedValue?: string | undefined;
        unit?: string | undefined;
        temporalContext?: string | undefined;
        attributionScope?: string | undefined;
    }>, "many">;
    scopeReferences: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["role", "team", "product", "technical", "temporal", "project"]>;
        value: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        status: z.ZodEnum<["approved", "qualified"]>;
    }, "strict", z.ZodTypeAny, {
        value: string;
        type: "role" | "project" | "technical" | "temporal" | "team" | "product";
        status: "approved" | "qualified";
        evidenceIds: string[];
    }, {
        value: string;
        type: "role" | "project" | "technical" | "temporal" | "team" | "product";
        status: "approved" | "qualified";
        evidenceIds: string[];
    }>, "many">;
    qualifiers: z.ZodArray<z.ZodString, "many">;
    trustState: z.ZodEnum<["model-proposed", "deterministic-proposed", "deterministic-approved", "human-approved", "human-edited"]>;
    validation: z.ZodObject<{
        status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
        issues: z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            claimBoundaryIds: string[];
            matchIds: string[];
        }, {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            expectationIds?: string[] | undefined;
            evidenceIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
            matchIds?: string[] | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        issues: {
            code: string;
            message: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            claimBoundaryIds: string[];
            matchIds: string[];
        }[];
        status: "valid" | "invalid" | "requires-review";
    }, {
        issues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            expectationIds?: string[] | undefined;
            evidenceIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
            matchIds?: string[] | undefined;
        }[];
        status: "valid" | "invalid" | "requires-review";
    }>;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedPlanId: z.ZodString;
        planSectionId: z.ZodString;
        proposalId: z.ZodOptional<z.ZodString>;
        draftingPolicy: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
            version: string;
        }, {
            name: string;
            version: string;
        }>;
        artifactHashes: z.ZodObject<{
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            approvedPlanSha256: z.ZodString;
            scaffoldSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            approvedInterpretationSha256: string;
            approvedMatchingSha256: string;
            scaffoldSha256: string;
            approvedAssessmentSha256: string;
            approvedPlanSha256: string;
        }, {
            approvedInterpretationSha256: string;
            approvedMatchingSha256: string;
            scaffoldSha256: string;
            approvedAssessmentSha256: string;
            approvedPlanSha256: string;
        }>;
        model: z.ZodOptional<z.ZodObject<{
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateId: z.ZodString;
            promptTemplateVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            provider: string;
            model: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
        }, {
            provider: string;
            model: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
        }>>;
        reviewDecision: z.ZodOptional<z.ZodObject<{
            decision: z.ZodEnum<["accept", "edit"]>;
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
        }, "strict", z.ZodTypeAny, {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        }, {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        }>>;
    }, "strict", z.ZodTypeAny, {
        targetId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            approvedInterpretationSha256: string;
            approvedMatchingSha256: string;
            scaffoldSha256: string;
            approvedAssessmentSha256: string;
            approvedPlanSha256: string;
        };
        approvedPlanId: string;
        model?: {
            provider: string;
            model: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
        } | undefined;
        proposalId?: string | undefined;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
    }, {
        targetId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            approvedInterpretationSha256: string;
            approvedMatchingSha256: string;
            scaffoldSha256: string;
            approvedAssessmentSha256: string;
            approvedPlanSha256: string;
        };
        approvedPlanId: string;
        model?: {
            provider: string;
            model: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
        } | undefined;
        proposalId?: string | undefined;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
    }>;
    sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
    sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    sectionId: z.ZodString;
    itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
    text: z.ZodString;
}, "strict", z.ZodTypeAny, {
    validation: {
        issues: {
            code: string;
            message: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            claimBoundaryIds: string[];
            matchIds: string[];
        }[];
        status: "valid" | "invalid" | "requires-review";
    };
    id: string;
    sectionId: string;
    sourceExpectationIds: string[];
    trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
    provenance: {
        targetId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            approvedInterpretationSha256: string;
            approvedMatchingSha256: string;
            scaffoldSha256: string;
            approvedAssessmentSha256: string;
            approvedPlanSha256: string;
        };
        approvedPlanId: string;
        model?: {
            provider: string;
            model: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
        } | undefined;
        proposalId?: string | undefined;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
    };
    evidenceIds: string[];
    approvedMatchIds: string[];
    text: string;
    claimBoundaryIds: string[];
    itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    metricReferences: {
        evidenceId: string;
        originalValue: string;
        reviewStatus: "reviewed";
        sourcePath?: string | undefined;
        normalizedValue?: string | undefined;
        unit?: string | undefined;
        temporalContext?: string | undefined;
        attributionScope?: string | undefined;
    }[];
    scopeReferences: {
        value: string;
        type: "role" | "project" | "technical" | "temporal" | "team" | "product";
        status: "approved" | "qualified";
        evidenceIds: string[];
    }[];
    qualifiers: string[];
    sourceAssessmentIds: string[];
}, {
    validation: {
        issues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            expectationIds?: string[] | undefined;
            evidenceIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
            matchIds?: string[] | undefined;
        }[];
        status: "valid" | "invalid" | "requires-review";
    };
    id: string;
    sectionId: string;
    sourceExpectationIds: string[];
    trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
    provenance: {
        targetId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            approvedInterpretationSha256: string;
            approvedMatchingSha256: string;
            scaffoldSha256: string;
            approvedAssessmentSha256: string;
            approvedPlanSha256: string;
        };
        approvedPlanId: string;
        model?: {
            provider: string;
            model: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
        } | undefined;
        proposalId?: string | undefined;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
    };
    evidenceIds: string[];
    approvedMatchIds: string[];
    text: string;
    claimBoundaryIds: string[];
    itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    metricReferences: {
        evidenceId: string;
        originalValue: string;
        reviewStatus: "reviewed";
        sourcePath?: string | undefined;
        normalizedValue?: string | undefined;
        unit?: string | undefined;
        temporalContext?: string | undefined;
        attributionScope?: string | undefined;
    }[];
    scopeReferences: {
        value: string;
        type: "role" | "project" | "technical" | "temporal" | "team" | "product";
        status: "approved" | "qualified";
        evidenceIds: string[];
    }[];
    qualifiers: string[];
    sourceAssessmentIds: string[];
}>;
export declare const RoleResumeDraftSectionProvenanceSchema: z.ZodObject<{
    targetId: z.ZodString;
    approvedPlanId: z.ZodString;
    planSectionId: z.ZodString;
    approvedPlanSha256: z.ZodString;
    draftingPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>;
}, "strict", z.ZodTypeAny, {
    targetId: string;
    planSectionId: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    approvedPlanId: string;
    approvedPlanSha256: string;
}, {
    targetId: string;
    planSectionId: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    approvedPlanId: string;
    approvedPlanSha256: string;
}>;
export declare const RoleResumeDraftSectionSchema: z.ZodObject<{
    id: z.ZodString;
    planSectionId: z.ZodString;
    type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
    order: z.ZodNumber;
    status: z.ZodEnum<["drafted", "empty", "excluded", "requires-review"]>;
    objective: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        metricReferences: z.ZodArray<z.ZodObject<{
            evidenceId: z.ZodString;
            sourcePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            originalValue: z.ZodString;
            normalizedValue: z.ZodOptional<z.ZodString>;
            unit: z.ZodOptional<z.ZodString>;
            temporalContext: z.ZodOptional<z.ZodString>;
            attributionScope: z.ZodOptional<z.ZodString>;
            reviewStatus: z.ZodLiteral<"reviewed">;
        }, "strict", z.ZodTypeAny, {
            evidenceId: string;
            originalValue: string;
            reviewStatus: "reviewed";
            sourcePath?: string | undefined;
            normalizedValue?: string | undefined;
            unit?: string | undefined;
            temporalContext?: string | undefined;
            attributionScope?: string | undefined;
        }, {
            evidenceId: string;
            originalValue: string;
            reviewStatus: "reviewed";
            sourcePath?: string | undefined;
            normalizedValue?: string | undefined;
            unit?: string | undefined;
            temporalContext?: string | undefined;
            attributionScope?: string | undefined;
        }>, "many">;
        scopeReferences: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["role", "team", "product", "technical", "temporal", "project"]>;
            value: z.ZodString;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            status: z.ZodEnum<["approved", "qualified"]>;
        }, "strict", z.ZodTypeAny, {
            value: string;
            type: "role" | "project" | "technical" | "temporal" | "team" | "product";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }, {
            value: string;
            type: "role" | "project" | "technical" | "temporal" | "team" | "product";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }>, "many">;
        qualifiers: z.ZodArray<z.ZodString, "many">;
        trustState: z.ZodEnum<["model-proposed", "deterministic-proposed", "deterministic-approved", "human-approved", "human-edited"]>;
        validation: z.ZodObject<{
            status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
            issues: z.ZodArray<z.ZodObject<{
                code: z.ZodString;
                message: z.ZodString;
                severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
                sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strict", z.ZodTypeAny, {
                code: string;
                message: string;
                expectationIds: string[];
                evidenceIds: string[];
                severity: "high" | "medium" | "low" | "critical";
                sectionIds: string[];
                draftItemIds: string[];
                claimBoundaryIds: string[];
                matchIds: string[];
            }, {
                code: string;
                message: string;
                severity: "high" | "medium" | "low" | "critical";
                expectationIds?: string[] | undefined;
                evidenceIds?: string[] | undefined;
                sectionIds?: string[] | undefined;
                draftItemIds?: string[] | undefined;
                claimBoundaryIds?: string[] | undefined;
                matchIds?: string[] | undefined;
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            issues: {
                code: string;
                message: string;
                expectationIds: string[];
                evidenceIds: string[];
                severity: "high" | "medium" | "low" | "critical";
                sectionIds: string[];
                draftItemIds: string[];
                claimBoundaryIds: string[];
                matchIds: string[];
            }[];
            status: "valid" | "invalid" | "requires-review";
        }, {
            issues: {
                code: string;
                message: string;
                severity: "high" | "medium" | "low" | "critical";
                expectationIds?: string[] | undefined;
                evidenceIds?: string[] | undefined;
                sectionIds?: string[] | undefined;
                draftItemIds?: string[] | undefined;
                claimBoundaryIds?: string[] | undefined;
                matchIds?: string[] | undefined;
            }[];
            status: "valid" | "invalid" | "requires-review";
        }>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedPlanId: z.ZodString;
            planSectionId: z.ZodString;
            proposalId: z.ZodOptional<z.ZodString>;
            draftingPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
            artifactHashes: z.ZodObject<{
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                approvedPlanSha256: z.ZodString;
                scaffoldSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                approvedInterpretationSha256: string;
                approvedMatchingSha256: string;
                scaffoldSha256: string;
                approvedAssessmentSha256: string;
                approvedPlanSha256: string;
            }, {
                approvedInterpretationSha256: string;
                approvedMatchingSha256: string;
                scaffoldSha256: string;
                approvedAssessmentSha256: string;
                approvedPlanSha256: string;
            }>;
            model: z.ZodOptional<z.ZodObject<{
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateId: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                promptTemplateId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                promptTemplateId: string;
                promptTemplateVersion: string;
            }>>;
            reviewDecision: z.ZodOptional<z.ZodObject<{
                decision: z.ZodEnum<["accept", "edit"]>;
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
            }, "strict", z.ZodTypeAny, {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            }, {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            }>>;
        }, "strict", z.ZodTypeAny, {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                approvedInterpretationSha256: string;
                approvedMatchingSha256: string;
                scaffoldSha256: string;
                approvedAssessmentSha256: string;
                approvedPlanSha256: string;
            };
            approvedPlanId: string;
            model?: {
                provider: string;
                model: string;
                promptTemplateId: string;
                promptTemplateVersion: string;
            } | undefined;
            proposalId?: string | undefined;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
        }, {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                approvedInterpretationSha256: string;
                approvedMatchingSha256: string;
                scaffoldSha256: string;
                approvedAssessmentSha256: string;
                approvedPlanSha256: string;
            };
            approvedPlanId: string;
            model?: {
                provider: string;
                model: string;
                promptTemplateId: string;
                promptTemplateVersion: string;
            } | undefined;
            proposalId?: string | undefined;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
        }>;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        sectionId: z.ZodString;
        itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
        text: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        validation: {
            issues: {
                code: string;
                message: string;
                expectationIds: string[];
                evidenceIds: string[];
                severity: "high" | "medium" | "low" | "critical";
                sectionIds: string[];
                draftItemIds: string[];
                claimBoundaryIds: string[];
                matchIds: string[];
            }[];
            status: "valid" | "invalid" | "requires-review";
        };
        id: string;
        sectionId: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                approvedInterpretationSha256: string;
                approvedMatchingSha256: string;
                scaffoldSha256: string;
                approvedAssessmentSha256: string;
                approvedPlanSha256: string;
            };
            approvedPlanId: string;
            model?: {
                provider: string;
                model: string;
                promptTemplateId: string;
                promptTemplateVersion: string;
            } | undefined;
            proposalId?: string | undefined;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        text: string;
        claimBoundaryIds: string[];
        itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        metricReferences: {
            evidenceId: string;
            originalValue: string;
            reviewStatus: "reviewed";
            sourcePath?: string | undefined;
            normalizedValue?: string | undefined;
            unit?: string | undefined;
            temporalContext?: string | undefined;
            attributionScope?: string | undefined;
        }[];
        scopeReferences: {
            value: string;
            type: "role" | "project" | "technical" | "temporal" | "team" | "product";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }[];
        qualifiers: string[];
        sourceAssessmentIds: string[];
    }, {
        validation: {
            issues: {
                code: string;
                message: string;
                severity: "high" | "medium" | "low" | "critical";
                expectationIds?: string[] | undefined;
                evidenceIds?: string[] | undefined;
                sectionIds?: string[] | undefined;
                draftItemIds?: string[] | undefined;
                claimBoundaryIds?: string[] | undefined;
                matchIds?: string[] | undefined;
            }[];
            status: "valid" | "invalid" | "requires-review";
        };
        id: string;
        sectionId: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                approvedInterpretationSha256: string;
                approvedMatchingSha256: string;
                scaffoldSha256: string;
                approvedAssessmentSha256: string;
                approvedPlanSha256: string;
            };
            approvedPlanId: string;
            model?: {
                provider: string;
                model: string;
                promptTemplateId: string;
                promptTemplateVersion: string;
            } | undefined;
            proposalId?: string | undefined;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        text: string;
        claimBoundaryIds: string[];
        itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        metricReferences: {
            evidenceId: string;
            originalValue: string;
            reviewStatus: "reviewed";
            sourcePath?: string | undefined;
            normalizedValue?: string | undefined;
            unit?: string | undefined;
            temporalContext?: string | undefined;
            attributionScope?: string | undefined;
        }[];
        scopeReferences: {
            value: string;
            type: "role" | "project" | "technical" | "temporal" | "team" | "product";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }[];
        qualifiers: string[];
        sourceAssessmentIds: string[];
    }>, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedPlanId: z.ZodString;
        planSectionId: z.ZodString;
        approvedPlanSha256: z.ZodString;
        draftingPolicy: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
            version: string;
        }, {
            name: string;
            version: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        targetId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        approvedPlanId: string;
        approvedPlanSha256: string;
    }, {
        targetId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        approvedPlanId: string;
        approvedPlanSha256: string;
    }>;
}, "strict", z.ZodTypeAny, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    status: "empty" | "requires-review" | "drafted" | "excluded";
    id: string;
    items: {
        validation: {
            issues: {
                code: string;
                message: string;
                expectationIds: string[];
                evidenceIds: string[];
                severity: "high" | "medium" | "low" | "critical";
                sectionIds: string[];
                draftItemIds: string[];
                claimBoundaryIds: string[];
                matchIds: string[];
            }[];
            status: "valid" | "invalid" | "requires-review";
        };
        id: string;
        sectionId: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                approvedInterpretationSha256: string;
                approvedMatchingSha256: string;
                scaffoldSha256: string;
                approvedAssessmentSha256: string;
                approvedPlanSha256: string;
            };
            approvedPlanId: string;
            model?: {
                provider: string;
                model: string;
                promptTemplateId: string;
                promptTemplateVersion: string;
            } | undefined;
            proposalId?: string | undefined;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        text: string;
        claimBoundaryIds: string[];
        itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        metricReferences: {
            evidenceId: string;
            originalValue: string;
            reviewStatus: "reviewed";
            sourcePath?: string | undefined;
            normalizedValue?: string | undefined;
            unit?: string | undefined;
            temporalContext?: string | undefined;
            attributionScope?: string | undefined;
        }[];
        scopeReferences: {
            value: string;
            type: "role" | "project" | "technical" | "temporal" | "team" | "product";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }[];
        qualifiers: string[];
        sourceAssessmentIds: string[];
    }[];
    provenance: {
        targetId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        approvedPlanId: string;
        approvedPlanSha256: string;
    };
    order: number;
    planSectionId: string;
    objective: string;
}, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    status: "empty" | "requires-review" | "drafted" | "excluded";
    id: string;
    items: {
        validation: {
            issues: {
                code: string;
                message: string;
                severity: "high" | "medium" | "low" | "critical";
                expectationIds?: string[] | undefined;
                evidenceIds?: string[] | undefined;
                sectionIds?: string[] | undefined;
                draftItemIds?: string[] | undefined;
                claimBoundaryIds?: string[] | undefined;
                matchIds?: string[] | undefined;
            }[];
            status: "valid" | "invalid" | "requires-review";
        };
        id: string;
        sectionId: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                approvedInterpretationSha256: string;
                approvedMatchingSha256: string;
                scaffoldSha256: string;
                approvedAssessmentSha256: string;
                approvedPlanSha256: string;
            };
            approvedPlanId: string;
            model?: {
                provider: string;
                model: string;
                promptTemplateId: string;
                promptTemplateVersion: string;
            } | undefined;
            proposalId?: string | undefined;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        text: string;
        claimBoundaryIds: string[];
        itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        metricReferences: {
            evidenceId: string;
            originalValue: string;
            reviewStatus: "reviewed";
            sourcePath?: string | undefined;
            normalizedValue?: string | undefined;
            unit?: string | undefined;
            temporalContext?: string | undefined;
            attributionScope?: string | undefined;
        }[];
        scopeReferences: {
            value: string;
            type: "role" | "project" | "technical" | "temporal" | "team" | "product";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }[];
        qualifiers: string[];
        sourceAssessmentIds: string[];
    }[];
    provenance: {
        targetId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        approvedPlanId: string;
        approvedPlanSha256: string;
    };
    order: number;
    planSectionId: string;
    objective: string;
}>;
export declare const RoleResumeDraftScaffoldSectionSchema: z.ZodObject<{
    id: z.ZodString;
    planSectionId: z.ZodString;
    sectionType: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
    status: z.ZodEnum<["include", "optional", "exclude"]>;
    order: z.ZodNumber;
    objective: z.ZodString;
    allowedExpectationIds: z.ZodArray<z.ZodString, "many">;
    allowedAssessmentIds: z.ZodArray<z.ZodString, "many">;
    allowedMatchIds: z.ZodArray<z.ZodString, "many">;
    allowedEvidenceIds: z.ZodArray<z.ZodString, "many">;
    allowedClaimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    allowedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    prohibitedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    maximumItemCount: z.ZodNumber;
    maximumSentenceCount: z.ZodOptional<z.ZodNumber>;
    metricPermission: z.ZodEnum<["reviewed-only", "prohibited"]>;
    scopePermissions: z.ZodArray<z.ZodString, "many">;
    cautionNotes: z.ZodArray<z.ZodString, "many">;
    prohibitedInferences: z.ZodArray<z.ZodString, "many">;
    requiredQualifiers: z.ZodArray<z.ZodString, "many">;
    placeholderIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "exclude" | "include" | "optional";
    id: string;
    allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    order: number;
    maximumItemCount: number;
    planSectionId: string;
    sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    allowedAssessmentIds: string[];
    allowedEvidenceIds: string[];
    allowedClaimBoundaryIds: string[];
    placeholderIds: string[];
    objective: string;
    cautionNotes: string[];
    prohibitedInferences: string[];
    requiredQualifiers: string[];
    allowedExpectationIds: string[];
    allowedMatchIds: string[];
    metricPermission: "prohibited" | "reviewed-only";
    scopePermissions: string[];
    maximumSentenceCount?: number | undefined;
}, {
    status: "exclude" | "include" | "optional";
    id: string;
    allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    order: number;
    maximumItemCount: number;
    planSectionId: string;
    sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    allowedAssessmentIds: string[];
    allowedEvidenceIds: string[];
    allowedClaimBoundaryIds: string[];
    placeholderIds: string[];
    objective: string;
    cautionNotes: string[];
    prohibitedInferences: string[];
    requiredQualifiers: string[];
    allowedExpectationIds: string[];
    allowedMatchIds: string[];
    metricPermission: "prohibited" | "reviewed-only";
    scopePermissions: string[];
    maximumSentenceCount?: number | undefined;
}>;
export declare const ResumeDraftingConstraintSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    description: z.ZodString;
    sectionIds: z.ZodArray<z.ZodString, "many">;
    blocking: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    code: string;
    id: string;
    blocking: boolean;
    sectionIds: string[];
    description: string;
}, {
    code: string;
    id: string;
    blocking: boolean;
    sectionIds: string[];
    description: string;
}>;
export declare const RoleResumeDraftScaffoldProvenanceSchema: z.ZodObject<{
    targetSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedInterpretationManifestSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    approvedMatchingManifestSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    approvedAssessmentSha256: z.ZodString;
    approvedAssessmentManifestSha256: z.ZodString;
    approvedPlanSha256: z.ZodString;
    approvedPlanManifestSha256: z.ZodString;
    expectationSetSha256: z.ZodString;
    assessmentSetSha256: z.ZodString;
    approvedMatchSetSha256: z.ZodString;
    evidenceSetSha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    targetSha256: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    expectationSetSha256: string;
    approvedMatchSetSha256: string;
    approvedAssessmentSha256: string;
    approvedAssessmentManifestSha256: string;
    assessmentSetSha256: string;
    evidenceSetSha256: string;
    approvedPlanSha256: string;
    approvedPlanManifestSha256: string;
}, {
    targetSha256: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    expectationSetSha256: string;
    approvedMatchSetSha256: string;
    approvedAssessmentSha256: string;
    approvedAssessmentManifestSha256: string;
    assessmentSetSha256: string;
    evidenceSetSha256: string;
    approvedPlanSha256: string;
    approvedPlanManifestSha256: string;
}>;
export declare const RoleResumeDraftScaffoldSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"role">;
    mode: z.ZodLiteral<"market-positioning">;
    roleTitle: z.ZodString;
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
    approvedMatching: z.ZodObject<{
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
    approvedAssessment: z.ZodObject<{
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
    approvedPlan: z.ZodObject<{
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
    draftingPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        planSectionId: z.ZodString;
        sectionType: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        status: z.ZodEnum<["include", "optional", "exclude"]>;
        order: z.ZodNumber;
        objective: z.ZodString;
        allowedExpectationIds: z.ZodArray<z.ZodString, "many">;
        allowedAssessmentIds: z.ZodArray<z.ZodString, "many">;
        allowedMatchIds: z.ZodArray<z.ZodString, "many">;
        allowedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        allowedClaimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        allowedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        prohibitedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        maximumItemCount: z.ZodNumber;
        maximumSentenceCount: z.ZodOptional<z.ZodNumber>;
        metricPermission: z.ZodEnum<["reviewed-only", "prohibited"]>;
        scopePermissions: z.ZodArray<z.ZodString, "many">;
        cautionNotes: z.ZodArray<z.ZodString, "many">;
        prohibitedInferences: z.ZodArray<z.ZodString, "many">;
        requiredQualifiers: z.ZodArray<z.ZodString, "many">;
        placeholderIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "exclude" | "include" | "optional";
        id: string;
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        order: number;
        maximumItemCount: number;
        planSectionId: string;
        sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        allowedAssessmentIds: string[];
        allowedEvidenceIds: string[];
        allowedClaimBoundaryIds: string[];
        placeholderIds: string[];
        objective: string;
        cautionNotes: string[];
        prohibitedInferences: string[];
        requiredQualifiers: string[];
        allowedExpectationIds: string[];
        allowedMatchIds: string[];
        metricPermission: "prohibited" | "reviewed-only";
        scopePermissions: string[];
        maximumSentenceCount?: number | undefined;
    }, {
        status: "exclude" | "include" | "optional";
        id: string;
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        order: number;
        maximumItemCount: number;
        planSectionId: string;
        sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        allowedAssessmentIds: string[];
        allowedEvidenceIds: string[];
        allowedClaimBoundaryIds: string[];
        placeholderIds: string[];
        objective: string;
        cautionNotes: string[];
        prohibitedInferences: string[];
        requiredQualifiers: string[];
        allowedExpectationIds: string[];
        allowedMatchIds: string[];
        metricPermission: "prohibited" | "reviewed-only";
        scopePermissions: string[];
        maximumSentenceCount?: number | undefined;
    }>, "many">;
    draftingConstraints: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodString;
        description: z.ZodString;
        sectionIds: z.ZodArray<z.ZodString, "many">;
        blocking: z.ZodBoolean;
    }, "strict", z.ZodTypeAny, {
        code: string;
        id: string;
        blocking: boolean;
        sectionIds: string[];
        description: string;
    }, {
        code: string;
        id: string;
        blocking: boolean;
        sectionIds: string[];
        description: string;
    }>, "many">;
    provenance: z.ZodObject<{
        targetSha256: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedInterpretationManifestSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedMatchingManifestSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        approvedAssessmentManifestSha256: z.ZodString;
        approvedPlanSha256: z.ZodString;
        approvedPlanManifestSha256: z.ZodString;
        expectationSetSha256: z.ZodString;
        assessmentSetSha256: z.ZodString;
        approvedMatchSetSha256: z.ZodString;
        evidenceSetSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        approvedInterpretationSha256: string;
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        expectationSetSha256: string;
        approvedMatchSetSha256: string;
        approvedAssessmentSha256: string;
        approvedAssessmentManifestSha256: string;
        assessmentSetSha256: string;
        evidenceSetSha256: string;
        approvedPlanSha256: string;
        approvedPlanManifestSha256: string;
    }, {
        targetSha256: string;
        approvedInterpretationSha256: string;
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        expectationSetSha256: string;
        approvedMatchSetSha256: string;
        approvedAssessmentSha256: string;
        approvedAssessmentManifestSha256: string;
        assessmentSetSha256: string;
        evidenceSetSha256: string;
        approvedPlanSha256: string;
        approvedPlanManifestSha256: string;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "market-positioning";
    sections: {
        status: "exclude" | "include" | "optional";
        id: string;
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        order: number;
        maximumItemCount: number;
        planSectionId: string;
        sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        allowedAssessmentIds: string[];
        allowedEvidenceIds: string[];
        allowedClaimBoundaryIds: string[];
        placeholderIds: string[];
        objective: string;
        cautionNotes: string[];
        prohibitedInferences: string[];
        requiredQualifiers: string[];
        allowedExpectationIds: string[];
        allowedMatchIds: string[];
        metricPermission: "prohibited" | "reviewed-only";
        scopePermissions: string[];
        maximumSentenceCount?: number | undefined;
    }[];
    targetType: "role";
    targetId: string;
    provenance: {
        targetSha256: string;
        approvedInterpretationSha256: string;
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        expectationSetSha256: string;
        approvedMatchSetSha256: string;
        approvedAssessmentSha256: string;
        approvedAssessmentManifestSha256: string;
        assessmentSetSha256: string;
        evidenceSetSha256: string;
        approvedPlanSha256: string;
        approvedPlanManifestSha256: string;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    draftingPolicy: {
        name: string;
        version: string;
    };
    draftingConstraints: {
        code: string;
        id: string;
        blocking: boolean;
        sectionIds: string[];
        description: string;
    }[];
    roleTitle: string;
    approvedAssessment: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    approvedPlan: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "market-positioning";
    sections: {
        status: "exclude" | "include" | "optional";
        id: string;
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        order: number;
        maximumItemCount: number;
        planSectionId: string;
        sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        allowedAssessmentIds: string[];
        allowedEvidenceIds: string[];
        allowedClaimBoundaryIds: string[];
        placeholderIds: string[];
        objective: string;
        cautionNotes: string[];
        prohibitedInferences: string[];
        requiredQualifiers: string[];
        allowedExpectationIds: string[];
        allowedMatchIds: string[];
        metricPermission: "prohibited" | "reviewed-only";
        scopePermissions: string[];
        maximumSentenceCount?: number | undefined;
    }[];
    targetType: "role";
    targetId: string;
    provenance: {
        targetSha256: string;
        approvedInterpretationSha256: string;
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        expectationSetSha256: string;
        approvedMatchSetSha256: string;
        approvedAssessmentSha256: string;
        approvedAssessmentManifestSha256: string;
        assessmentSetSha256: string;
        evidenceSetSha256: string;
        approvedPlanSha256: string;
        approvedPlanManifestSha256: string;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    draftingPolicy: {
        name: string;
        version: string;
    };
    draftingConstraints: {
        code: string;
        id: string;
        blocking: boolean;
        sectionIds: string[];
        description: string;
    }[];
    roleTitle: string;
    approvedAssessment: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    approvedPlan: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
}>;
export declare const RoleResumeDraftScaffoldManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    scaffoldId: z.ZodString;
    targetId: z.ZodString;
    scaffoldPath: z.ZodEffects<z.ZodString, string, string>;
    scaffoldSha256: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedInterpretationManifestSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    approvedMatchingManifestSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    approvedAssessmentSha256: z.ZodString;
    approvedAssessmentManifestSha256: z.ZodString;
    approvedPlanSha256: z.ZodString;
    approvedPlanManifestSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    policyName: string;
    scaffoldSha256: string;
    scaffoldId: string;
    scaffoldPath: string;
    approvedAssessmentSha256: string;
    approvedAssessmentManifestSha256: string;
    approvedPlanSha256: string;
    approvedPlanManifestSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    policyName: string;
    scaffoldSha256: string;
    scaffoldId: string;
    scaffoldPath: string;
    approvedAssessmentSha256: string;
    approvedAssessmentManifestSha256: string;
    approvedPlanSha256: string;
    approvedPlanManifestSha256: string;
}>;
export declare const ResumeDraftClaimLedgerEntrySchema: z.ZodObject<{
    id: z.ZodString;
    draftItemId: z.ZodString;
    statementTextSha256: z.ZodString;
    claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    assessmentIds: z.ZodArray<z.ZodString, "many">;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    supportLevel: z.ZodEnum<["direct", "corroborated", "qualified", "contextual"]>;
    metricStatus: z.ZodEnum<["not-applicable", "reviewed-metric-used", "metric-prohibited"]>;
    scopeStatus: z.ZodEnum<["within-approved-scope", "qualified-scope", "requires-review"]>;
    validationStatus: z.ZodEnum<["valid", "invalid", "requires-review"]>;
    validationIssues: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }, {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        expectationIds?: string[] | undefined;
        evidenceIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
        matchIds?: string[] | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    id: string;
    expectationIds: string[];
    validationIssues: {
        code: string;
        message: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    evidenceIds: string[];
    approvedMatchIds: string[];
    metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
    assessmentIds: string[];
    claimBoundaryIds: string[];
    claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    draftItemId: string;
    scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
    validationStatus: "valid" | "invalid" | "requires-review";
    statementTextSha256: string;
    supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
}, {
    id: string;
    expectationIds: string[];
    validationIssues: {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        expectationIds?: string[] | undefined;
        evidenceIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
        matchIds?: string[] | undefined;
    }[];
    evidenceIds: string[];
    approvedMatchIds: string[];
    metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
    assessmentIds: string[];
    claimBoundaryIds: string[];
    claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    draftItemId: string;
    scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
    validationStatus: "valid" | "invalid" | "requires-review";
    statementTextSha256: string;
    supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
}>;
export declare const ResumeDraftEvidenceUsageSchema: z.ZodObject<{
    evidenceId: z.ZodString;
    draftItemIds: z.ZodArray<z.ZodString, "many">;
    sectionIds: z.ZodArray<z.ZodString, "many">;
    claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    usageCount: z.ZodNumber;
    status: z.ZodEnum<["within-policy", "overused", "unused-selected-evidence", "prohibited-use"]>;
    notes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
    evidenceId: string;
    sectionIds: string[];
    draftItemIds: string[];
    claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    usageCount: number;
}, {
    notes: string[];
    status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
    evidenceId: string;
    sectionIds: string[];
    draftItemIds: string[];
    claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    usageCount: number;
}>;
export declare const ResumeDraftExclusionSchema: z.ZodObject<{
    id: z.ZodString;
    sourceExclusionId: z.ZodString;
    reason: z.ZodString;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    reason: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    sourceExclusionId: string;
}, {
    reason: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    sourceExclusionId: string;
}>;
export declare const ResumeDraftRiskSchema: z.ZodObject<{
    sectionIds: z.ZodArray<z.ZodString, "many">;
    draftItemIds: z.ZodArray<z.ZodString, "many">;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    matchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodString;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
    matchIds: string[];
}, {
    code: string;
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
    matchIds: string[];
}>;
export declare const ResumeDraftWarningSchema: z.ZodObject<{
    sectionIds: z.ZodArray<z.ZodString, "many">;
    draftItemIds: z.ZodArray<z.ZodString, "many">;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    matchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodString;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
    matchIds: string[];
}, {
    code: string;
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
    matchIds: string[];
}>;
export declare const ResumeDraftAmbiguitySchema: z.ZodObject<{
    sectionIds: z.ZodArray<z.ZodString, "many">;
    draftItemIds: z.ZodArray<z.ZodString, "many">;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    matchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodString;
    message: z.ZodString;
    resolved: z.ZodBoolean;
    resolutionRationale: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
    resolved: boolean;
    matchIds: string[];
    resolutionRationale?: string | undefined;
}, {
    code: string;
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
    resolved: boolean;
    matchIds: string[];
    resolutionRationale?: string | undefined;
}>;
export declare const RoleResumeDraftCompletenessSchema: z.ZodObject<{
    status: z.ZodEnum<["empty", "partial", "complete"]>;
    requiredSectionCount: z.ZodNumber;
    completedRequiredSectionCount: z.ZodNumber;
    optionalSectionCount: z.ZodNumber;
    completedOptionalSectionCount: z.ZodNumber;
    draftItemCount: z.ZodNumber;
    validatedDraftItemCount: z.ZodNumber;
    claimLedgerComplete: z.ZodBoolean;
    provenanceComplete: z.ZodBoolean;
    unresolvedCriticalIssueCount: z.ZodNumber;
    unresolvedAmbiguityCount: z.ZodNumber;
    usableForRendering: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    provenanceComplete: boolean;
    requiredSectionCount: number;
    completedRequiredSectionCount: number;
    draftItemCount: number;
    validatedDraftItemCount: number;
    claimLedgerComplete: boolean;
    unresolvedCriticalIssueCount: number;
    unresolvedAmbiguityCount: number;
    usableForRendering: boolean;
    optionalSectionCount: number;
    completedOptionalSectionCount: number;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    provenanceComplete: boolean;
    requiredSectionCount: number;
    completedRequiredSectionCount: number;
    draftItemCount: number;
    validatedDraftItemCount: number;
    claimLedgerComplete: boolean;
    unresolvedCriticalIssueCount: number;
    unresolvedAmbiguityCount: number;
    usableForRendering: boolean;
    optionalSectionCount: number;
    completedOptionalSectionCount: number;
}>;
export declare const RoleResumeDraftProvenanceSchema: z.ZodObject<{
    targetSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedInterpretationManifestSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    approvedMatchingManifestSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    approvedAssessmentSha256: z.ZodString;
    approvedAssessmentManifestSha256: z.ZodString;
    approvedPlanSha256: z.ZodString;
    approvedPlanManifestSha256: z.ZodString;
    scaffoldSha256: z.ZodString;
    proposalSha256: z.ZodString;
    reviewSha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    targetSha256: string;
    proposalSha256: string;
    reviewSha256: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    scaffoldSha256: string;
    approvedAssessmentSha256: string;
    approvedAssessmentManifestSha256: string;
    approvedPlanSha256: string;
    approvedPlanManifestSha256: string;
}, {
    targetSha256: string;
    proposalSha256: string;
    reviewSha256: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    scaffoldSha256: string;
    approvedAssessmentSha256: string;
    approvedAssessmentManifestSha256: string;
    approvedPlanSha256: string;
    approvedPlanManifestSha256: string;
}>;
export declare const ModelRoleResumeDraftPayloadSchema: z.ZodObject<{
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        planSectionId: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        order: z.ZodNumber;
        status: z.ZodEnum<["drafted", "empty", "excluded", "requires-review"]>;
        objective: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            metricReferences: z.ZodArray<z.ZodObject<{
                evidenceId: z.ZodString;
                sourcePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                originalValue: z.ZodString;
                normalizedValue: z.ZodOptional<z.ZodString>;
                unit: z.ZodOptional<z.ZodString>;
                temporalContext: z.ZodOptional<z.ZodString>;
                attributionScope: z.ZodOptional<z.ZodString>;
                reviewStatus: z.ZodLiteral<"reviewed">;
            }, "strict", z.ZodTypeAny, {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }, {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }>, "many">;
            scopeReferences: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["role", "team", "product", "technical", "temporal", "project"]>;
                value: z.ZodString;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                status: z.ZodEnum<["approved", "qualified"]>;
            }, "strict", z.ZodTypeAny, {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }, {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }>, "many">;
            qualifiers: z.ZodArray<z.ZodString, "many">;
            trustState: z.ZodEnum<["model-proposed", "deterministic-proposed", "deterministic-approved", "human-approved", "human-edited"]>;
            validation: z.ZodObject<{
                status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
                issues: z.ZodArray<z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
                    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                }, "strict", z.ZodTypeAny, {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }, {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }>, "many">;
            }, "strict", z.ZodTypeAny, {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            }, {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            }>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedPlanId: z.ZodString;
                planSectionId: z.ZodString;
                proposalId: z.ZodOptional<z.ZodString>;
                draftingPolicy: z.ZodObject<{
                    name: z.ZodString;
                    version: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    version: string;
                }, {
                    name: string;
                    version: string;
                }>;
                artifactHashes: z.ZodObject<{
                    approvedInterpretationSha256: z.ZodString;
                    approvedMatchingSha256: z.ZodString;
                    approvedAssessmentSha256: z.ZodString;
                    approvedPlanSha256: z.ZodString;
                    scaffoldSha256: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                }, {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                }>;
                model: z.ZodOptional<z.ZodObject<{
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateId: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                }>>;
                reviewDecision: z.ZodOptional<z.ZodObject<{
                    decision: z.ZodEnum<["accept", "edit"]>;
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
                }, "strict", z.ZodTypeAny, {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                }, {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                }>>;
            }, "strict", z.ZodTypeAny, {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            }, {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            }>;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
            id: z.ZodString;
            sectionId: z.ZodString;
            itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
            text: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedPlanId: z.ZodString;
            planSectionId: z.ZodString;
            approvedPlanSha256: z.ZodString;
            draftingPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        }, {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }>, "many">;
    warnings: z.ZodDefault<z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        matchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }>, "many">>;
    ambiguities: z.ZodDefault<z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        matchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
        resolved: z.ZodBoolean;
        resolutionRationale: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }>, "many">>;
}, "strict", z.ZodTypeAny, {
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }[];
    warnings: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }[];
}, {
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }[];
    warnings?: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[] | undefined;
    ambiguities?: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }[] | undefined;
}>;
export declare const RoleResumeDraftProposalSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"role">;
    mode: z.ZodLiteral<"market-positioning">;
    status: z.ZodEnum<["generated", "validation-failed", "ready-for-review", "reviewed"]>;
    draftingPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
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
        targetSha256: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        approvedPlanSha256: z.ZodString;
        draftScaffoldSha256: z.ZodString;
        normalizedModelInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        approvedAssessmentSha256: string;
        approvedPlanSha256: string;
        draftScaffoldSha256: string;
    }, {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        approvedAssessmentSha256: string;
        approvedPlanSha256: string;
        draftScaffoldSha256: string;
    }>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        planSectionId: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        order: z.ZodNumber;
        status: z.ZodEnum<["drafted", "empty", "excluded", "requires-review"]>;
        objective: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            metricReferences: z.ZodArray<z.ZodObject<{
                evidenceId: z.ZodString;
                sourcePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                originalValue: z.ZodString;
                normalizedValue: z.ZodOptional<z.ZodString>;
                unit: z.ZodOptional<z.ZodString>;
                temporalContext: z.ZodOptional<z.ZodString>;
                attributionScope: z.ZodOptional<z.ZodString>;
                reviewStatus: z.ZodLiteral<"reviewed">;
            }, "strict", z.ZodTypeAny, {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }, {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }>, "many">;
            scopeReferences: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["role", "team", "product", "technical", "temporal", "project"]>;
                value: z.ZodString;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                status: z.ZodEnum<["approved", "qualified"]>;
            }, "strict", z.ZodTypeAny, {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }, {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }>, "many">;
            qualifiers: z.ZodArray<z.ZodString, "many">;
            trustState: z.ZodEnum<["model-proposed", "deterministic-proposed", "deterministic-approved", "human-approved", "human-edited"]>;
            validation: z.ZodObject<{
                status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
                issues: z.ZodArray<z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
                    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                }, "strict", z.ZodTypeAny, {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }, {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }>, "many">;
            }, "strict", z.ZodTypeAny, {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            }, {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            }>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedPlanId: z.ZodString;
                planSectionId: z.ZodString;
                proposalId: z.ZodOptional<z.ZodString>;
                draftingPolicy: z.ZodObject<{
                    name: z.ZodString;
                    version: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    version: string;
                }, {
                    name: string;
                    version: string;
                }>;
                artifactHashes: z.ZodObject<{
                    approvedInterpretationSha256: z.ZodString;
                    approvedMatchingSha256: z.ZodString;
                    approvedAssessmentSha256: z.ZodString;
                    approvedPlanSha256: z.ZodString;
                    scaffoldSha256: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                }, {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                }>;
                model: z.ZodOptional<z.ZodObject<{
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateId: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                }>>;
                reviewDecision: z.ZodOptional<z.ZodObject<{
                    decision: z.ZodEnum<["accept", "edit"]>;
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
                }, "strict", z.ZodTypeAny, {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                }, {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                }>>;
            }, "strict", z.ZodTypeAny, {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            }, {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            }>;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
            id: z.ZodString;
            sectionId: z.ZodString;
            itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
            text: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedPlanId: z.ZodString;
            planSectionId: z.ZodString;
            approvedPlanSha256: z.ZodString;
            draftingPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        }, {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }>, "many">;
    claimLedger: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        draftItemId: z.ZodString;
        statementTextSha256: z.ZodString;
        claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        supportLevel: z.ZodEnum<["direct", "corroborated", "qualified", "contextual"]>;
        metricStatus: z.ZodEnum<["not-applicable", "reviewed-metric-used", "metric-prohibited"]>;
        scopeStatus: z.ZodEnum<["within-approved-scope", "qualified-scope", "requires-review"]>;
        validationStatus: z.ZodEnum<["valid", "invalid", "requires-review"]>;
        validationIssues: z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            claimBoundaryIds: string[];
            matchIds: string[];
        }, {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            expectationIds?: string[] | undefined;
            evidenceIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
            matchIds?: string[] | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        expectationIds: string[];
        validationIssues: {
            code: string;
            message: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            claimBoundaryIds: string[];
            matchIds: string[];
        }[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
        assessmentIds: string[];
        claimBoundaryIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        draftItemId: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
        statementTextSha256: string;
        supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
    }, {
        id: string;
        expectationIds: string[];
        validationIssues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            expectationIds?: string[] | undefined;
            evidenceIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
            matchIds?: string[] | undefined;
        }[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
        assessmentIds: string[];
        claimBoundaryIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        draftItemId: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
        statementTextSha256: string;
        supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
    }>, "many">;
    evidenceUsage: z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        sectionIds: z.ZodArray<z.ZodString, "many">;
        claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        usageCount: z.ZodNumber;
        status: z.ZodEnum<["within-policy", "overused", "unused-selected-evidence", "prohibited-use"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
        evidenceId: string;
        sectionIds: string[];
        draftItemIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        usageCount: number;
    }, {
        notes: string[];
        status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
        evidenceId: string;
        sectionIds: string[];
        draftItemIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        usageCount: number;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        matchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        matchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
        resolved: z.ZodBoolean;
        resolutionRationale: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }>, "many">;
    validationIssues: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }, {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        expectationIds?: string[] | undefined;
        evidenceIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
        matchIds?: string[] | undefined;
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
    mode: "market-positioning";
    input: {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        approvedAssessmentSha256: string;
        approvedPlanSha256: string;
        draftScaffoldSha256: string;
    };
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }[];
    targetType: "role";
    targetId: string;
    warnings: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
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
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    rawResponsePath: string;
    rawResponseSha256: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    claimLedger: {
        id: string;
        expectationIds: string[];
        validationIssues: {
            code: string;
            message: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            claimBoundaryIds: string[];
            matchIds: string[];
        }[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
        assessmentIds: string[];
        claimBoundaryIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        draftItemId: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
        statementTextSha256: string;
        supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
    }[];
    evidenceUsage: {
        notes: string[];
        status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
        evidenceId: string;
        sectionIds: string[];
        draftItemIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        usageCount: number;
    }[];
}, {
    status: "generated" | "validation-failed" | "ready-for-review" | "reviewed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "market-positioning";
    input: {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        approvedAssessmentSha256: string;
        approvedPlanSha256: string;
        draftScaffoldSha256: string;
    };
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }[];
    targetType: "role";
    targetId: string;
    warnings: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
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
        severity: "high" | "medium" | "low" | "critical";
        expectationIds?: string[] | undefined;
        evidenceIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
        matchIds?: string[] | undefined;
    }[];
    rawResponsePath: string;
    rawResponseSha256: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    claimLedger: {
        id: string;
        expectationIds: string[];
        validationIssues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            expectationIds?: string[] | undefined;
            evidenceIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
            matchIds?: string[] | undefined;
        }[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
        assessmentIds: string[];
        claimBoundaryIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        draftItemId: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
        statementTextSha256: string;
        supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
    }[];
    evidenceUsage: {
        notes: string[];
        status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
        evidenceId: string;
        sectionIds: string[];
        draftItemIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        usageCount: number;
    }[];
}>;
export declare const RoleResumeDraftProposalManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
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
    normalizedModelInputSha256: z.ZodString;
    targetSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    approvedAssessmentSha256: z.ZodString;
    approvedPlanSha256: z.ZodString;
    draftScaffoldSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
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
    approvedMatchingSha256: string;
    evidenceSnapshotSha256: string;
    approvedAssessmentSha256: string;
    approvedPlanSha256: string;
    draftScaffoldSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
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
    approvedMatchingSha256: string;
    evidenceSnapshotSha256: string;
    approvedAssessmentSha256: string;
    approvedPlanSha256: string;
    draftScaffoldSha256: string;
}>;
export declare const RoleResumeDraftReviewDecisionSchema: z.ZodObject<{
    itemType: z.ZodEnum<["section", "draft-item", "claim-ledger", "section-order", "ambiguity"]>;
    itemId: z.ZodString;
    decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
    editedValue: z.ZodOptional<z.ZodUnknown>;
    reviewNote: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    decision: "pending" | "accept" | "edit" | "reject";
    itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
    itemId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedValue?: unknown;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
    itemId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedValue?: unknown;
}>;
export declare const RoleResumeDraftReviewSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    status: z.ZodEnum<["in-progress", "completed"]>;
    decisions: z.ZodArray<z.ZodObject<{
        itemType: z.ZodEnum<["section", "draft-item", "claim-ledger", "section-order", "ambiguity"]>;
        itemId: z.ZodString;
        decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
        editedValue: z.ZodOptional<z.ZodUnknown>;
        reviewNote: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        decision: "pending" | "accept" | "edit" | "reject";
        itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
        itemId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedValue?: unknown;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
        itemId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedValue?: unknown;
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
        itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
        itemId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedValue?: unknown;
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
        itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
        itemId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedValue?: unknown;
    }[];
    targetId: string;
    proposalId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
}>;
export declare const RoleResumeDraftReviewManifestSchema: z.ZodObject<{
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
export declare const ApprovedRoleResumeDraftSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"role">;
    mode: z.ZodLiteral<"market-positioning">;
    roleTitle: z.ZodString;
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
    approvedMatching: z.ZodObject<{
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
    approvedAssessment: z.ZodObject<{
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
    approvedPlan: z.ZodObject<{
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
    draftingPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        planSectionId: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        order: z.ZodNumber;
        status: z.ZodEnum<["drafted", "empty", "excluded", "requires-review"]>;
        objective: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            metricReferences: z.ZodArray<z.ZodObject<{
                evidenceId: z.ZodString;
                sourcePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
                originalValue: z.ZodString;
                normalizedValue: z.ZodOptional<z.ZodString>;
                unit: z.ZodOptional<z.ZodString>;
                temporalContext: z.ZodOptional<z.ZodString>;
                attributionScope: z.ZodOptional<z.ZodString>;
                reviewStatus: z.ZodLiteral<"reviewed">;
            }, "strict", z.ZodTypeAny, {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }, {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }>, "many">;
            scopeReferences: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["role", "team", "product", "technical", "temporal", "project"]>;
                value: z.ZodString;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                status: z.ZodEnum<["approved", "qualified"]>;
            }, "strict", z.ZodTypeAny, {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }, {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }>, "many">;
            qualifiers: z.ZodArray<z.ZodString, "many">;
            trustState: z.ZodEnum<["model-proposed", "deterministic-proposed", "deterministic-approved", "human-approved", "human-edited"]>;
            validation: z.ZodObject<{
                status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
                issues: z.ZodArray<z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
                    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                }, "strict", z.ZodTypeAny, {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }, {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }>, "many">;
            }, "strict", z.ZodTypeAny, {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            }, {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            }>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedPlanId: z.ZodString;
                planSectionId: z.ZodString;
                proposalId: z.ZodOptional<z.ZodString>;
                draftingPolicy: z.ZodObject<{
                    name: z.ZodString;
                    version: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    version: string;
                }, {
                    name: string;
                    version: string;
                }>;
                artifactHashes: z.ZodObject<{
                    approvedInterpretationSha256: z.ZodString;
                    approvedMatchingSha256: z.ZodString;
                    approvedAssessmentSha256: z.ZodString;
                    approvedPlanSha256: z.ZodString;
                    scaffoldSha256: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                }, {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                }>;
                model: z.ZodOptional<z.ZodObject<{
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateId: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                }>>;
                reviewDecision: z.ZodOptional<z.ZodObject<{
                    decision: z.ZodEnum<["accept", "edit"]>;
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
                }, "strict", z.ZodTypeAny, {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                }, {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                }>>;
            }, "strict", z.ZodTypeAny, {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            }, {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            }>;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
            id: z.ZodString;
            sectionId: z.ZodString;
            itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
            text: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedPlanId: z.ZodString;
            planSectionId: z.ZodString;
            approvedPlanSha256: z.ZodString;
            draftingPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        }, {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }>, "many">;
    claimLedger: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        draftItemId: z.ZodString;
        statementTextSha256: z.ZodString;
        claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        supportLevel: z.ZodEnum<["direct", "corroborated", "qualified", "contextual"]>;
        metricStatus: z.ZodEnum<["not-applicable", "reviewed-metric-used", "metric-prohibited"]>;
        scopeStatus: z.ZodEnum<["within-approved-scope", "qualified-scope", "requires-review"]>;
        validationStatus: z.ZodEnum<["valid", "invalid", "requires-review"]>;
        validationIssues: z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            expectationIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            matchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            claimBoundaryIds: string[];
            matchIds: string[];
        }, {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            expectationIds?: string[] | undefined;
            evidenceIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
            matchIds?: string[] | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        expectationIds: string[];
        validationIssues: {
            code: string;
            message: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            claimBoundaryIds: string[];
            matchIds: string[];
        }[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
        assessmentIds: string[];
        claimBoundaryIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        draftItemId: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
        statementTextSha256: string;
        supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
    }, {
        id: string;
        expectationIds: string[];
        validationIssues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            expectationIds?: string[] | undefined;
            evidenceIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
            matchIds?: string[] | undefined;
        }[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
        assessmentIds: string[];
        claimBoundaryIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        draftItemId: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
        statementTextSha256: string;
        supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
    }>, "many">;
    evidenceUsage: z.ZodArray<z.ZodObject<{
        evidenceId: z.ZodString;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        sectionIds: z.ZodArray<z.ZodString, "many">;
        claimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        usageCount: z.ZodNumber;
        status: z.ZodEnum<["within-policy", "overused", "unused-selected-evidence", "prohibited-use"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
        evidenceId: string;
        sectionIds: string[];
        draftItemIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        usageCount: number;
    }, {
        notes: string[];
        status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
        evidenceId: string;
        sectionIds: string[];
        draftItemIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        usageCount: number;
    }>, "many">;
    exclusions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sourceExclusionId: z.ZodString;
        reason: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        reason: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sourceExclusionId: string;
    }, {
        reason: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sourceExclusionId: string;
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        matchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        matchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        matchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
        resolved: z.ZodBoolean;
        resolutionRationale: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }>, "many">;
    completeness: z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        requiredSectionCount: z.ZodNumber;
        completedRequiredSectionCount: z.ZodNumber;
        optionalSectionCount: z.ZodNumber;
        completedOptionalSectionCount: z.ZodNumber;
        draftItemCount: z.ZodNumber;
        validatedDraftItemCount: z.ZodNumber;
        claimLedgerComplete: z.ZodBoolean;
        provenanceComplete: z.ZodBoolean;
        unresolvedCriticalIssueCount: z.ZodNumber;
        unresolvedAmbiguityCount: z.ZodNumber;
        usableForRendering: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        provenanceComplete: boolean;
        requiredSectionCount: number;
        completedRequiredSectionCount: number;
        draftItemCount: number;
        validatedDraftItemCount: number;
        claimLedgerComplete: boolean;
        unresolvedCriticalIssueCount: number;
        unresolvedAmbiguityCount: number;
        usableForRendering: boolean;
        optionalSectionCount: number;
        completedOptionalSectionCount: number;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        provenanceComplete: boolean;
        requiredSectionCount: number;
        completedRequiredSectionCount: number;
        draftItemCount: number;
        validatedDraftItemCount: number;
        claimLedgerComplete: boolean;
        unresolvedCriticalIssueCount: number;
        unresolvedAmbiguityCount: number;
        usableForRendering: boolean;
        optionalSectionCount: number;
        completedOptionalSectionCount: number;
    }>;
    provenance: z.ZodObject<{
        targetSha256: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedInterpretationManifestSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedMatchingManifestSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        approvedAssessmentManifestSha256: z.ZodString;
        approvedPlanSha256: z.ZodString;
        approvedPlanManifestSha256: z.ZodString;
        scaffoldSha256: z.ZodString;
        proposalSha256: z.ZodString;
        reviewSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        proposalSha256: string;
        reviewSha256: string;
        approvedInterpretationSha256: string;
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        scaffoldSha256: string;
        approvedAssessmentSha256: string;
        approvedAssessmentManifestSha256: string;
        approvedPlanSha256: string;
        approvedPlanManifestSha256: string;
    }, {
        targetSha256: string;
        proposalSha256: string;
        reviewSha256: string;
        approvedInterpretationSha256: string;
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        scaffoldSha256: string;
        approvedAssessmentSha256: string;
        approvedAssessmentManifestSha256: string;
        approvedPlanSha256: string;
        approvedPlanManifestSha256: string;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "market-positioning";
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    expectationIds: string[];
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    sectionIds: string[];
                    draftItemIds: string[];
                    claimBoundaryIds: string[];
                    matchIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }[];
    targetType: "role";
    targetId: string;
    warnings: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        provenanceComplete: boolean;
        requiredSectionCount: number;
        completedRequiredSectionCount: number;
        draftItemCount: number;
        validatedDraftItemCount: number;
        claimLedgerComplete: boolean;
        unresolvedCriticalIssueCount: number;
        unresolvedAmbiguityCount: number;
        usableForRendering: boolean;
        optionalSectionCount: number;
        completedOptionalSectionCount: number;
    };
    provenance: {
        targetSha256: string;
        proposalSha256: string;
        reviewSha256: string;
        approvedInterpretationSha256: string;
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        scaffoldSha256: string;
        approvedAssessmentSha256: string;
        approvedAssessmentManifestSha256: string;
        approvedPlanSha256: string;
        approvedPlanManifestSha256: string;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    exclusions: {
        reason: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sourceExclusionId: string;
    }[];
    draftingPolicy: {
        name: string;
        version: string;
    };
    claimLedger: {
        id: string;
        expectationIds: string[];
        validationIssues: {
            code: string;
            message: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            sectionIds: string[];
            draftItemIds: string[];
            claimBoundaryIds: string[];
            matchIds: string[];
        }[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
        assessmentIds: string[];
        claimBoundaryIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        draftItemId: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
        statementTextSha256: string;
        supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
    }[];
    evidenceUsage: {
        notes: string[];
        status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
        evidenceId: string;
        sectionIds: string[];
        draftItemIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        usageCount: number;
    }[];
    roleTitle: string;
    approvedAssessment: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    approvedPlan: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "market-positioning";
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    expectationIds?: string[] | undefined;
                    evidenceIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                    matchIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "human-approved" | "human-edited" | "model-proposed" | "deterministic-proposed";
            provenance: {
                targetId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    approvedInterpretationSha256: string;
                    approvedMatchingSha256: string;
                    scaffoldSha256: string;
                    approvedAssessmentSha256: string;
                    approvedPlanSha256: string;
                };
                approvedPlanId: string;
                model?: {
                    provider: string;
                    model: string;
                    promptTemplateId: string;
                    promptTemplateVersion: string;
                } | undefined;
                proposalId?: string | undefined;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            text: string;
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                evidenceId: string;
                originalValue: string;
                reviewStatus: "reviewed";
                sourcePath?: string | undefined;
                normalizedValue?: string | undefined;
                unit?: string | undefined;
                temporalContext?: string | undefined;
                attributionScope?: string | undefined;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "project" | "technical" | "temporal" | "team" | "product";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            sourceAssessmentIds: string[];
        }[];
        provenance: {
            targetId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            approvedPlanId: string;
            approvedPlanSha256: string;
        };
        order: number;
        planSectionId: string;
        objective: string;
    }[];
    targetType: "role";
    targetId: string;
    warnings: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        matchIds: string[];
        resolutionRationale?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        provenanceComplete: boolean;
        requiredSectionCount: number;
        completedRequiredSectionCount: number;
        draftItemCount: number;
        validatedDraftItemCount: number;
        claimLedgerComplete: boolean;
        unresolvedCriticalIssueCount: number;
        unresolvedAmbiguityCount: number;
        usableForRendering: boolean;
        optionalSectionCount: number;
        completedOptionalSectionCount: number;
    };
    provenance: {
        targetSha256: string;
        proposalSha256: string;
        reviewSha256: string;
        approvedInterpretationSha256: string;
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        scaffoldSha256: string;
        approvedAssessmentSha256: string;
        approvedAssessmentManifestSha256: string;
        approvedPlanSha256: string;
        approvedPlanManifestSha256: string;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: string;
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        matchIds: string[];
    }[];
    exclusions: {
        reason: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        sourceExclusionId: string;
    }[];
    draftingPolicy: {
        name: string;
        version: string;
    };
    claimLedger: {
        id: string;
        expectationIds: string[];
        validationIssues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            expectationIds?: string[] | undefined;
            evidenceIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
            matchIds?: string[] | undefined;
        }[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        metricStatus: "metric-prohibited" | "not-applicable" | "reviewed-metric-used";
        assessmentIds: string[];
        claimBoundaryIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        draftItemId: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
        statementTextSha256: string;
        supportLevel: "contextual" | "direct" | "qualified" | "corroborated";
    }[];
    evidenceUsage: {
        notes: string[];
        status: "overused" | "unused-selected-evidence" | "within-policy" | "prohibited-use";
        evidenceId: string;
        sectionIds: string[];
        draftItemIds: string[];
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "technology" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        usageCount: number;
    }[];
    roleTitle: string;
    approvedAssessment: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    approvedPlan: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
}>;
export declare const ApprovedRoleResumeDraftManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    draftId: z.ZodString;
    targetId: z.ZodString;
    draftPath: z.ZodEffects<z.ZodString, string, string>;
    draftSha256: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    approvedAssessmentSha256: z.ZodString;
    approvedPlanSha256: z.ZodString;
    scaffoldSha256: z.ZodString;
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
    targetId: string;
    policyVersion: string;
    proposalId: string;
    proposalSha256: string;
    reviewSha256: string;
    approvedInterpretationSha256: string;
    approvedMatchingSha256: string;
    evidenceSnapshotSha256: string;
    policyName: string;
    scaffoldSha256: string;
    draftId: string;
    draftPath: string;
    draftSha256: string;
    approvedAssessmentSha256: string;
    approvedPlanSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetId: string;
    policyVersion: string;
    proposalId: string;
    proposalSha256: string;
    reviewSha256: string;
    approvedInterpretationSha256: string;
    approvedMatchingSha256: string;
    evidenceSnapshotSha256: string;
    policyName: string;
    scaffoldSha256: string;
    draftId: string;
    draftPath: string;
    draftSha256: string;
    approvedAssessmentSha256: string;
    approvedPlanSha256: string;
}>;
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
