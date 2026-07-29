import { z } from "zod";
export declare const JobResumeDraftingModeSchema: z.ZodLiteral<"job-specific-resume">;
export declare const JobResumeDraftTrustStateSchema: z.ZodEnum<["model-proposed", "human-approved", "human-edited"]>;
export declare const JobResumeDraftItemTypeSchema: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
export declare const JobResumeDraftValidationIssueSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
    requirementIds: string[];
    claimIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    coverageIds: string[];
    assessmentIds: string[];
    evidenceMapLinkIds: string[];
    claimBoundaryIds: string[];
}, {
    code: string;
    message: string;
    severity: "high" | "medium" | "low" | "critical";
    evidenceIds?: string[] | undefined;
    requirementIds?: string[] | undefined;
    claimIds?: string[] | undefined;
    sectionIds?: string[] | undefined;
    draftItemIds?: string[] | undefined;
    coverageIds?: string[] | undefined;
    assessmentIds?: string[] | undefined;
    evidenceMapLinkIds?: string[] | undefined;
    claimBoundaryIds?: string[] | undefined;
}>;
export declare const JobResumeDraftItemValidationSchema: z.ZodObject<{
    status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
    issues: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
    }, {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        evidenceIds?: string[] | undefined;
        requirementIds?: string[] | undefined;
        claimIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        coverageIds?: string[] | undefined;
        assessmentIds?: string[] | undefined;
        evidenceMapLinkIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    issues: {
        code: string;
        message: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
    }[];
    status: "valid" | "invalid" | "requires-review";
}, {
    issues: {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        evidenceIds?: string[] | undefined;
        requirementIds?: string[] | undefined;
        claimIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        coverageIds?: string[] | undefined;
        assessmentIds?: string[] | undefined;
        evidenceMapLinkIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
    }[];
    status: "valid" | "invalid" | "requires-review";
}>;
export declare const JobResumeMetricReferenceSchema: z.ZodObject<{
    metricPermissionId: z.ZodString;
    evidenceId: z.ZodString;
    claimId: z.ZodString;
    exactApprovedText: z.ZodString;
    permissionSha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    evidenceId: string;
    metricPermissionId: string;
    exactApprovedText: string;
    permissionSha256: string;
}, {
    claimId: string;
    evidenceId: string;
    metricPermissionId: string;
    exactApprovedText: string;
    permissionSha256: string;
}>;
export declare const JobResumeScopeReferenceSchema: z.ZodObject<{
    type: z.ZodEnum<["role", "project", "technical", "temporal", "domain"]>;
    value: z.ZodString;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    status: z.ZodEnum<["approved", "qualified"]>;
}, "strict", z.ZodTypeAny, {
    value: string;
    type: "role" | "domain" | "project" | "technical" | "temporal";
    status: "approved" | "qualified";
    evidenceIds: string[];
}, {
    value: string;
    type: "role" | "domain" | "project" | "technical" | "temporal";
    status: "approved" | "qualified";
    evidenceIds: string[];
}>;
export declare const JobResumeDraftItemProvenanceSchema: z.ZodObject<{
    targetId: z.ZodString;
    planId: z.ZodString;
    planSectionId: z.ZodString;
    proposalId: z.ZodOptional<z.ZodString>;
    reviewDecisionId: z.ZodOptional<z.ZodString>;
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
        requirementModelSha256: z.ZodString;
        evidenceMapSha256: z.ZodString;
        coverageSha256: z.ZodString;
        assessmentSha256: z.ZodString;
        contentPlanSha256: z.ZodString;
        scaffoldSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
    }, {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
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
    planId: string;
    planSectionId: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    artifactHashes: {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
    };
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
    reviewDecisionId?: string | undefined;
}, {
    targetId: string;
    planId: string;
    planSectionId: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    artifactHashes: {
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
    };
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
    reviewDecisionId?: string | undefined;
}>;
export declare const JobResumeDraftItemSchema: z.ZodObject<{
    claimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    metricReferences: z.ZodArray<z.ZodObject<{
        metricPermissionId: z.ZodString;
        evidenceId: z.ZodString;
        claimId: z.ZodString;
        exactApprovedText: z.ZodString;
        permissionSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        claimId: string;
        evidenceId: string;
        metricPermissionId: string;
        exactApprovedText: string;
        permissionSha256: string;
    }, {
        claimId: string;
        evidenceId: string;
        metricPermissionId: string;
        exactApprovedText: string;
        permissionSha256: string;
    }>, "many">;
    scopeReferences: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["role", "project", "technical", "temporal", "domain"]>;
        value: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        status: z.ZodEnum<["approved", "qualified"]>;
    }, "strict", z.ZodTypeAny, {
        value: string;
        type: "role" | "domain" | "project" | "technical" | "temporal";
        status: "approved" | "qualified";
        evidenceIds: string[];
    }, {
        value: string;
        type: "role" | "domain" | "project" | "technical" | "temporal";
        status: "approved" | "qualified";
        evidenceIds: string[];
    }>, "many">;
    qualifiers: z.ZodArray<z.ZodString, "many">;
    trustState: z.ZodEnum<["model-proposed", "human-approved", "human-edited"]>;
    validation: z.ZodObject<{
        status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
        issues: z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
            sectionIds: string[];
            draftItemIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
        }, {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            evidenceIds?: string[] | undefined;
            requirementIds?: string[] | undefined;
            claimIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            coverageIds?: string[] | undefined;
            assessmentIds?: string[] | undefined;
            evidenceMapLinkIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        issues: {
            code: string;
            message: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
            sectionIds: string[];
            draftItemIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
        }[];
        status: "valid" | "invalid" | "requires-review";
    }, {
        issues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            evidenceIds?: string[] | undefined;
            requirementIds?: string[] | undefined;
            claimIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            coverageIds?: string[] | undefined;
            assessmentIds?: string[] | undefined;
            evidenceMapLinkIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
        }[];
        status: "valid" | "invalid" | "requires-review";
    }>;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        planId: z.ZodString;
        planSectionId: z.ZodString;
        proposalId: z.ZodOptional<z.ZodString>;
        reviewDecisionId: z.ZodOptional<z.ZodString>;
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
            requirementModelSha256: z.ZodString;
            evidenceMapSha256: z.ZodString;
            coverageSha256: z.ZodString;
            assessmentSha256: z.ZodString;
            contentPlanSha256: z.ZodString;
            scaffoldSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        }, {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
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
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        };
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
        reviewDecisionId?: string | undefined;
    }, {
        targetId: string;
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        };
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
        reviewDecisionId?: string | undefined;
    }>;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    coverageIds: z.ZodArray<z.ZodString, "many">;
    assessmentIds: z.ZodArray<z.ZodString, "many">;
    evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    metricPermissionIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    sectionId: z.ZodString;
    itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
    text: z.ZodString;
}, "strict", z.ZodTypeAny, {
    validation: {
        issues: {
            code: string;
            message: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
            sectionIds: string[];
            draftItemIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
        }[];
        status: "valid" | "invalid" | "requires-review";
    };
    id: string;
    sectionId: string;
    trustState: "human-approved" | "human-edited" | "model-proposed";
    provenance: {
        targetId: string;
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        };
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
        reviewDecisionId?: string | undefined;
    };
    evidenceIds: string[];
    text: string;
    requirementIds: string[];
    claimIds: string[];
    coverageIds: string[];
    assessmentIds: string[];
    evidenceMapLinkIds: string[];
    claimBoundaryIds: string[];
    itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    metricReferences: {
        claimId: string;
        evidenceId: string;
        metricPermissionId: string;
        exactApprovedText: string;
        permissionSha256: string;
    }[];
    scopeReferences: {
        value: string;
        type: "role" | "domain" | "project" | "technical" | "temporal";
        status: "approved" | "qualified";
        evidenceIds: string[];
    }[];
    qualifiers: string[];
    metricPermissionIds: string[];
}, {
    validation: {
        issues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            evidenceIds?: string[] | undefined;
            requirementIds?: string[] | undefined;
            claimIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            coverageIds?: string[] | undefined;
            assessmentIds?: string[] | undefined;
            evidenceMapLinkIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
        }[];
        status: "valid" | "invalid" | "requires-review";
    };
    id: string;
    sectionId: string;
    trustState: "human-approved" | "human-edited" | "model-proposed";
    provenance: {
        targetId: string;
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        };
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
        reviewDecisionId?: string | undefined;
    };
    evidenceIds: string[];
    text: string;
    requirementIds: string[];
    claimIds: string[];
    coverageIds: string[];
    assessmentIds: string[];
    evidenceMapLinkIds: string[];
    claimBoundaryIds: string[];
    itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
    claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    metricReferences: {
        claimId: string;
        evidenceId: string;
        metricPermissionId: string;
        exactApprovedText: string;
        permissionSha256: string;
    }[];
    scopeReferences: {
        value: string;
        type: "role" | "domain" | "project" | "technical" | "temporal";
        status: "approved" | "qualified";
        evidenceIds: string[];
    }[];
    qualifiers: string[];
    metricPermissionIds: string[];
}>;
export declare const JobResumeDraftSectionSchema: z.ZodObject<{
    id: z.ZodString;
    planSectionId: z.ZodString;
    type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
    order: z.ZodNumber;
    status: z.ZodEnum<["drafted", "empty", "excluded", "requires-review"]>;
    objectiveCode: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        claimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        metricReferences: z.ZodArray<z.ZodObject<{
            metricPermissionId: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            exactApprovedText: z.ZodString;
            permissionSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            metricPermissionId: string;
            exactApprovedText: string;
            permissionSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            metricPermissionId: string;
            exactApprovedText: string;
            permissionSha256: string;
        }>, "many">;
        scopeReferences: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["role", "project", "technical", "temporal", "domain"]>;
            value: z.ZodString;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            status: z.ZodEnum<["approved", "qualified"]>;
        }, "strict", z.ZodTypeAny, {
            value: string;
            type: "role" | "domain" | "project" | "technical" | "temporal";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }, {
            value: string;
            type: "role" | "domain" | "project" | "technical" | "temporal";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }>, "many">;
        qualifiers: z.ZodArray<z.ZodString, "many">;
        trustState: z.ZodEnum<["model-proposed", "human-approved", "human-edited"]>;
        validation: z.ZodObject<{
            status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
            issues: z.ZodArray<z.ZodObject<{
                code: z.ZodString;
                message: z.ZodString;
                severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
                sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strict", z.ZodTypeAny, {
                code: string;
                message: string;
                evidenceIds: string[];
                severity: "high" | "medium" | "low" | "critical";
                requirementIds: string[];
                claimIds: string[];
                sectionIds: string[];
                draftItemIds: string[];
                coverageIds: string[];
                assessmentIds: string[];
                evidenceMapLinkIds: string[];
                claimBoundaryIds: string[];
            }, {
                code: string;
                message: string;
                severity: "high" | "medium" | "low" | "critical";
                evidenceIds?: string[] | undefined;
                requirementIds?: string[] | undefined;
                claimIds?: string[] | undefined;
                sectionIds?: string[] | undefined;
                draftItemIds?: string[] | undefined;
                coverageIds?: string[] | undefined;
                assessmentIds?: string[] | undefined;
                evidenceMapLinkIds?: string[] | undefined;
                claimBoundaryIds?: string[] | undefined;
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            issues: {
                code: string;
                message: string;
                evidenceIds: string[];
                severity: "high" | "medium" | "low" | "critical";
                requirementIds: string[];
                claimIds: string[];
                sectionIds: string[];
                draftItemIds: string[];
                coverageIds: string[];
                assessmentIds: string[];
                evidenceMapLinkIds: string[];
                claimBoundaryIds: string[];
            }[];
            status: "valid" | "invalid" | "requires-review";
        }, {
            issues: {
                code: string;
                message: string;
                severity: "high" | "medium" | "low" | "critical";
                evidenceIds?: string[] | undefined;
                requirementIds?: string[] | undefined;
                claimIds?: string[] | undefined;
                sectionIds?: string[] | undefined;
                draftItemIds?: string[] | undefined;
                coverageIds?: string[] | undefined;
                assessmentIds?: string[] | undefined;
                evidenceMapLinkIds?: string[] | undefined;
                claimBoundaryIds?: string[] | undefined;
            }[];
            status: "valid" | "invalid" | "requires-review";
        }>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            planId: z.ZodString;
            planSectionId: z.ZodString;
            proposalId: z.ZodOptional<z.ZodString>;
            reviewDecisionId: z.ZodOptional<z.ZodString>;
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
                requirementModelSha256: z.ZodString;
                evidenceMapSha256: z.ZodString;
                coverageSha256: z.ZodString;
                assessmentSha256: z.ZodString;
                contentPlanSha256: z.ZodString;
                scaffoldSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            }, {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
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
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        }, {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        }>;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        metricPermissionIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        sectionId: z.ZodString;
        itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
        text: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        validation: {
            issues: {
                code: string;
                message: string;
                evidenceIds: string[];
                severity: "high" | "medium" | "low" | "critical";
                requirementIds: string[];
                claimIds: string[];
                sectionIds: string[];
                draftItemIds: string[];
                coverageIds: string[];
                assessmentIds: string[];
                evidenceMapLinkIds: string[];
                claimBoundaryIds: string[];
            }[];
            status: "valid" | "invalid" | "requires-review";
        };
        id: string;
        sectionId: string;
        trustState: "human-approved" | "human-edited" | "model-proposed";
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        text: string;
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        metricReferences: {
            claimId: string;
            evidenceId: string;
            metricPermissionId: string;
            exactApprovedText: string;
            permissionSha256: string;
        }[];
        scopeReferences: {
            value: string;
            type: "role" | "domain" | "project" | "technical" | "temporal";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }[];
        qualifiers: string[];
        metricPermissionIds: string[];
    }, {
        validation: {
            issues: {
                code: string;
                message: string;
                severity: "high" | "medium" | "low" | "critical";
                evidenceIds?: string[] | undefined;
                requirementIds?: string[] | undefined;
                claimIds?: string[] | undefined;
                sectionIds?: string[] | undefined;
                draftItemIds?: string[] | undefined;
                coverageIds?: string[] | undefined;
                assessmentIds?: string[] | undefined;
                evidenceMapLinkIds?: string[] | undefined;
                claimBoundaryIds?: string[] | undefined;
            }[];
            status: "valid" | "invalid" | "requires-review";
        };
        id: string;
        sectionId: string;
        trustState: "human-approved" | "human-edited" | "model-proposed";
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        text: string;
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        metricReferences: {
            claimId: string;
            evidenceId: string;
            metricPermissionId: string;
            exactApprovedText: string;
            permissionSha256: string;
        }[];
        scopeReferences: {
            value: string;
            type: "role" | "domain" | "project" | "technical" | "temporal";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }[];
        qualifiers: string[];
        metricPermissionIds: string[];
    }>, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        planId: z.ZodString;
        planSectionId: z.ZodString;
        contentPlanSha256: z.ZodString;
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
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        contentPlanSha256: string;
    }, {
        targetId: string;
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        contentPlanSha256: string;
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
                evidenceIds: string[];
                severity: "high" | "medium" | "low" | "critical";
                requirementIds: string[];
                claimIds: string[];
                sectionIds: string[];
                draftItemIds: string[];
                coverageIds: string[];
                assessmentIds: string[];
                evidenceMapLinkIds: string[];
                claimBoundaryIds: string[];
            }[];
            status: "valid" | "invalid" | "requires-review";
        };
        id: string;
        sectionId: string;
        trustState: "human-approved" | "human-edited" | "model-proposed";
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        text: string;
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        metricReferences: {
            claimId: string;
            evidenceId: string;
            metricPermissionId: string;
            exactApprovedText: string;
            permissionSha256: string;
        }[];
        scopeReferences: {
            value: string;
            type: "role" | "domain" | "project" | "technical" | "temporal";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }[];
        qualifiers: string[];
        metricPermissionIds: string[];
    }[];
    provenance: {
        targetId: string;
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        contentPlanSha256: string;
    };
    order: number;
    objectiveCode: string;
    planSectionId: string;
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
                evidenceIds?: string[] | undefined;
                requirementIds?: string[] | undefined;
                claimIds?: string[] | undefined;
                sectionIds?: string[] | undefined;
                draftItemIds?: string[] | undefined;
                coverageIds?: string[] | undefined;
                assessmentIds?: string[] | undefined;
                evidenceMapLinkIds?: string[] | undefined;
                claimBoundaryIds?: string[] | undefined;
            }[];
            status: "valid" | "invalid" | "requires-review";
        };
        id: string;
        sectionId: string;
        trustState: "human-approved" | "human-edited" | "model-proposed";
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        text: string;
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        metricReferences: {
            claimId: string;
            evidenceId: string;
            metricPermissionId: string;
            exactApprovedText: string;
            permissionSha256: string;
        }[];
        scopeReferences: {
            value: string;
            type: "role" | "domain" | "project" | "technical" | "temporal";
            status: "approved" | "qualified";
            evidenceIds: string[];
        }[];
        qualifiers: string[];
        metricPermissionIds: string[];
    }[];
    provenance: {
        targetId: string;
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        contentPlanSha256: string;
    };
    order: number;
    objectiveCode: string;
    planSectionId: string;
}>;
export declare const JobResumeDraftScaffoldSectionSchema: z.ZodObject<{
    id: z.ZodString;
    planSectionId: z.ZodString;
    sectionType: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
    inclusion: z.ZodEnum<["include", "optional", "exclude"]>;
    order: z.ZodNumber;
    objectiveCode: z.ZodString;
    allowedRequirementIds: z.ZodArray<z.ZodString, "many">;
    allowedCoverageIds: z.ZodArray<z.ZodString, "many">;
    allowedAssessmentIds: z.ZodArray<z.ZodString, "many">;
    allowedEvidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
    allowedEvidenceIds: z.ZodArray<z.ZodString, "many">;
    allowedClaimIds: z.ZodArray<z.ZodString, "many">;
    allowedClaimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    allowedMetricPermissionIds: z.ZodArray<z.ZodString, "many">;
    allowedClaimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    maximumItemCount: z.ZodNumber;
    maximumSentenceCount: z.ZodOptional<z.ZodNumber>;
    requiredQualifierCodes: z.ZodArray<z.ZodString, "many">;
    prohibitedInferenceCodes: z.ZodArray<z.ZodString, "many">;
    exclusionIds: z.ZodArray<z.ZodString, "many">;
    riskCodes: z.ZodArray<z.ZodString, "many">;
    warningCodes: z.ZodArray<z.ZodString, "many">;
    ambiguityIds: z.ZodArray<z.ZodString, "many">;
    placeholderIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    id: string;
    ambiguityIds: string[];
    allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    requiredQualifierCodes: string[];
    prohibitedInferenceCodes: string[];
    inclusion: "exclude" | "include" | "optional";
    order: number;
    objectiveCode: string;
    exclusionIds: string[];
    maximumItemCount: number;
    riskCodes: string[];
    warningCodes: string[];
    planSectionId: string;
    sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    allowedRequirementIds: string[];
    allowedCoverageIds: string[];
    allowedAssessmentIds: string[];
    allowedEvidenceMapLinkIds: string[];
    allowedEvidenceIds: string[];
    allowedClaimIds: string[];
    allowedClaimBoundaryIds: string[];
    allowedMetricPermissionIds: string[];
    placeholderIds: string[];
    maximumSentenceCount?: number | undefined;
}, {
    id: string;
    ambiguityIds: string[];
    allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    requiredQualifierCodes: string[];
    prohibitedInferenceCodes: string[];
    inclusion: "exclude" | "include" | "optional";
    order: number;
    objectiveCode: string;
    exclusionIds: string[];
    maximumItemCount: number;
    riskCodes: string[];
    warningCodes: string[];
    planSectionId: string;
    sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    allowedRequirementIds: string[];
    allowedCoverageIds: string[];
    allowedAssessmentIds: string[];
    allowedEvidenceMapLinkIds: string[];
    allowedEvidenceIds: string[];
    allowedClaimIds: string[];
    allowedClaimBoundaryIds: string[];
    allowedMetricPermissionIds: string[];
    placeholderIds: string[];
    maximumSentenceCount?: number | undefined;
}>;
export declare const JobResumeDraftingConstraintSchema: z.ZodObject<{
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
export declare const JobResumeDraftScaffoldProvenanceSchema: z.ZodObject<{
    targetSha256: z.ZodString;
    jobDescriptionSha256: z.ZodString;
    requirementModelSha256: z.ZodString;
    requirementManifestSha256: z.ZodString;
    evidenceMapSha256: z.ZodString;
    evidenceMapManifestSha256: z.ZodString;
    coverageSha256: z.ZodString;
    coverageManifestSha256: z.ZodString;
    assessmentSha256: z.ZodString;
    assessmentManifestSha256: z.ZodString;
    contentPlanSha256: z.ZodString;
    contentPlanManifestSha256: z.ZodString;
    selectedEvidenceSetSha256: z.ZodString;
    selectedClaimSetSha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    targetSha256: string;
    assessmentSha256: string;
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    evidenceMapManifestSha256: string;
    coverageManifestSha256: string;
    selectedEvidenceSetSha256: string;
    selectedClaimSetSha256: string;
    assessmentManifestSha256: string;
    contentPlanSha256: string;
    jobDescriptionSha256: string;
    contentPlanManifestSha256: string;
}, {
    targetSha256: string;
    assessmentSha256: string;
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    evidenceMapManifestSha256: string;
    coverageManifestSha256: string;
    selectedEvidenceSetSha256: string;
    selectedClaimSetSha256: string;
    assessmentManifestSha256: string;
    contentPlanSha256: string;
    jobDescriptionSha256: string;
    contentPlanManifestSha256: string;
}>;
export declare const JobResumeDraftScaffoldSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    mode: z.ZodLiteral<"job-specific-resume">;
    targetTitle: z.ZodString;
    positioningState: z.ZodEnum<["direct", "adjacent", "stretch", "insufficient-proof", "indeterminate"]>;
    contentPlan: z.ZodObject<{
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
        inclusion: z.ZodEnum<["include", "optional", "exclude"]>;
        order: z.ZodNumber;
        objectiveCode: z.ZodString;
        allowedRequirementIds: z.ZodArray<z.ZodString, "many">;
        allowedCoverageIds: z.ZodArray<z.ZodString, "many">;
        allowedAssessmentIds: z.ZodArray<z.ZodString, "many">;
        allowedEvidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
        allowedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        allowedClaimIds: z.ZodArray<z.ZodString, "many">;
        allowedClaimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        allowedMetricPermissionIds: z.ZodArray<z.ZodString, "many">;
        allowedClaimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        maximumItemCount: z.ZodNumber;
        maximumSentenceCount: z.ZodOptional<z.ZodNumber>;
        requiredQualifierCodes: z.ZodArray<z.ZodString, "many">;
        prohibitedInferenceCodes: z.ZodArray<z.ZodString, "many">;
        exclusionIds: z.ZodArray<z.ZodString, "many">;
        riskCodes: z.ZodArray<z.ZodString, "many">;
        warningCodes: z.ZodArray<z.ZodString, "many">;
        ambiguityIds: z.ZodArray<z.ZodString, "many">;
        placeholderIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        ambiguityIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        requiredQualifierCodes: string[];
        prohibitedInferenceCodes: string[];
        inclusion: "exclude" | "include" | "optional";
        order: number;
        objectiveCode: string;
        exclusionIds: string[];
        maximumItemCount: number;
        riskCodes: string[];
        warningCodes: string[];
        planSectionId: string;
        sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        allowedRequirementIds: string[];
        allowedCoverageIds: string[];
        allowedAssessmentIds: string[];
        allowedEvidenceMapLinkIds: string[];
        allowedEvidenceIds: string[];
        allowedClaimIds: string[];
        allowedClaimBoundaryIds: string[];
        allowedMetricPermissionIds: string[];
        placeholderIds: string[];
        maximumSentenceCount?: number | undefined;
    }, {
        id: string;
        ambiguityIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        requiredQualifierCodes: string[];
        prohibitedInferenceCodes: string[];
        inclusion: "exclude" | "include" | "optional";
        order: number;
        objectiveCode: string;
        exclusionIds: string[];
        maximumItemCount: number;
        riskCodes: string[];
        warningCodes: string[];
        planSectionId: string;
        sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        allowedRequirementIds: string[];
        allowedCoverageIds: string[];
        allowedAssessmentIds: string[];
        allowedEvidenceMapLinkIds: string[];
        allowedEvidenceIds: string[];
        allowedClaimIds: string[];
        allowedClaimBoundaryIds: string[];
        allowedMetricPermissionIds: string[];
        placeholderIds: string[];
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
        jobDescriptionSha256: z.ZodString;
        requirementModelSha256: z.ZodString;
        requirementManifestSha256: z.ZodString;
        evidenceMapSha256: z.ZodString;
        evidenceMapManifestSha256: z.ZodString;
        coverageSha256: z.ZodString;
        coverageManifestSha256: z.ZodString;
        assessmentSha256: z.ZodString;
        assessmentManifestSha256: z.ZodString;
        contentPlanSha256: z.ZodString;
        contentPlanManifestSha256: z.ZodString;
        selectedEvidenceSetSha256: z.ZodString;
        selectedClaimSetSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        evidenceMapManifestSha256: string;
        coverageManifestSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        assessmentManifestSha256: string;
        contentPlanSha256: string;
        jobDescriptionSha256: string;
        contentPlanManifestSha256: string;
    }, {
        targetSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        evidenceMapManifestSha256: string;
        coverageManifestSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        assessmentManifestSha256: string;
        contentPlanSha256: string;
        jobDescriptionSha256: string;
        contentPlanManifestSha256: string;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    sections: {
        id: string;
        ambiguityIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        requiredQualifierCodes: string[];
        prohibitedInferenceCodes: string[];
        inclusion: "exclude" | "include" | "optional";
        order: number;
        objectiveCode: string;
        exclusionIds: string[];
        maximumItemCount: number;
        riskCodes: string[];
        warningCodes: string[];
        planSectionId: string;
        sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        allowedRequirementIds: string[];
        allowedCoverageIds: string[];
        allowedAssessmentIds: string[];
        allowedEvidenceMapLinkIds: string[];
        allowedEvidenceIds: string[];
        allowedClaimIds: string[];
        allowedClaimBoundaryIds: string[];
        allowedMetricPermissionIds: string[];
        placeholderIds: string[];
        maximumSentenceCount?: number | undefined;
    }[];
    targetType: "job";
    targetId: string;
    provenance: {
        targetSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        evidenceMapManifestSha256: string;
        coverageManifestSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        assessmentManifestSha256: string;
        contentPlanSha256: string;
        jobDescriptionSha256: string;
        contentPlanManifestSha256: string;
    };
    targetTitle: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    positioningState: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
    contentPlan: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    draftingConstraints: {
        code: string;
        id: string;
        blocking: boolean;
        sectionIds: string[];
        description: string;
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    sections: {
        id: string;
        ambiguityIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        requiredQualifierCodes: string[];
        prohibitedInferenceCodes: string[];
        inclusion: "exclude" | "include" | "optional";
        order: number;
        objectiveCode: string;
        exclusionIds: string[];
        maximumItemCount: number;
        riskCodes: string[];
        warningCodes: string[];
        planSectionId: string;
        sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        allowedRequirementIds: string[];
        allowedCoverageIds: string[];
        allowedAssessmentIds: string[];
        allowedEvidenceMapLinkIds: string[];
        allowedEvidenceIds: string[];
        allowedClaimIds: string[];
        allowedClaimBoundaryIds: string[];
        allowedMetricPermissionIds: string[];
        placeholderIds: string[];
        maximumSentenceCount?: number | undefined;
    }[];
    targetType: "job";
    targetId: string;
    provenance: {
        targetSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        evidenceMapManifestSha256: string;
        coverageManifestSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        assessmentManifestSha256: string;
        contentPlanSha256: string;
        jobDescriptionSha256: string;
        contentPlanManifestSha256: string;
    };
    targetTitle: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    positioningState: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
    contentPlan: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    draftingConstraints: {
        code: string;
        id: string;
        blocking: boolean;
        sectionIds: string[];
        description: string;
    }[];
}>;
export declare const JobResumeDraftScaffoldManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    scaffoldId: z.ZodString;
    targetId: z.ZodString;
    scaffoldPath: z.ZodEffects<z.ZodString, string, string>;
    scaffoldSha256: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    provenance: z.ZodObject<{
        targetSha256: z.ZodString;
        jobDescriptionSha256: z.ZodString;
        requirementModelSha256: z.ZodString;
        requirementManifestSha256: z.ZodString;
        evidenceMapSha256: z.ZodString;
        evidenceMapManifestSha256: z.ZodString;
        coverageSha256: z.ZodString;
        coverageManifestSha256: z.ZodString;
        assessmentSha256: z.ZodString;
        assessmentManifestSha256: z.ZodString;
        contentPlanSha256: z.ZodString;
        contentPlanManifestSha256: z.ZodString;
        selectedEvidenceSetSha256: z.ZodString;
        selectedClaimSetSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        evidenceMapManifestSha256: string;
        coverageManifestSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        assessmentManifestSha256: string;
        contentPlanSha256: string;
        jobDescriptionSha256: string;
        contentPlanManifestSha256: string;
    }, {
        targetSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        evidenceMapManifestSha256: string;
        coverageManifestSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        assessmentManifestSha256: string;
        contentPlanSha256: string;
        jobDescriptionSha256: string;
        contentPlanManifestSha256: string;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    policyVersion: string;
    provenance: {
        targetSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        evidenceMapManifestSha256: string;
        coverageManifestSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        assessmentManifestSha256: string;
        contentPlanSha256: string;
        jobDescriptionSha256: string;
        contentPlanManifestSha256: string;
    };
    policyName: string;
    scaffoldSha256: string;
    scaffoldId: string;
    scaffoldPath: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    policyVersion: string;
    provenance: {
        targetSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        evidenceMapManifestSha256: string;
        coverageManifestSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        assessmentManifestSha256: string;
        contentPlanSha256: string;
        jobDescriptionSha256: string;
        contentPlanManifestSha256: string;
    };
    policyName: string;
    scaffoldSha256: string;
    scaffoldId: string;
    scaffoldPath: string;
}>;
export declare const JobResumeDraftClaimLedgerEntrySchema: z.ZodObject<{
    supportStatus: z.ZodEnum<["direct", "qualified", "contextual"]>;
    metricStatus: z.ZodEnum<["verified-metric-used", "metric-prohibited", "not-applicable"]>;
    scopeStatus: z.ZodEnum<["within-approved-scope", "qualified-scope", "requires-review"]>;
    validationStatus: z.ZodEnum<["valid", "invalid", "requires-review"]>;
    validationIssues: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
    }, {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        evidenceIds?: string[] | undefined;
        requirementIds?: string[] | undefined;
        claimIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        coverageIds?: string[] | undefined;
        assessmentIds?: string[] | undefined;
        evidenceMapLinkIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
    }>, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        planId: z.ZodString;
        planSectionId: z.ZodString;
        proposalId: z.ZodOptional<z.ZodString>;
        reviewDecisionId: z.ZodOptional<z.ZodString>;
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
            requirementModelSha256: z.ZodString;
            evidenceMapSha256: z.ZodString;
            coverageSha256: z.ZodString;
            assessmentSha256: z.ZodString;
            contentPlanSha256: z.ZodString;
            scaffoldSha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        }, {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
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
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        };
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
        reviewDecisionId?: string | undefined;
    }, {
        targetId: string;
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        };
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
        reviewDecisionId?: string | undefined;
    }>;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    coverageIds: z.ZodArray<z.ZodString, "many">;
    assessmentIds: z.ZodArray<z.ZodString, "many">;
    evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    metricPermissionIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    draftItemId: z.ZodString;
    statementText: z.ZodString;
    statementSha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    validationIssues: {
        code: string;
        message: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
    }[];
    provenance: {
        targetId: string;
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        };
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
        reviewDecisionId?: string | undefined;
    };
    evidenceIds: string[];
    metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
    supportStatus: "contextual" | "direct" | "qualified";
    requirementIds: string[];
    claimIds: string[];
    coverageIds: string[];
    assessmentIds: string[];
    evidenceMapLinkIds: string[];
    claimBoundaryIds: string[];
    metricPermissionIds: string[];
    draftItemId: string;
    statementText: string;
    statementSha256: string;
    scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
    validationStatus: "valid" | "invalid" | "requires-review";
}, {
    id: string;
    validationIssues: {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        evidenceIds?: string[] | undefined;
        requirementIds?: string[] | undefined;
        claimIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        coverageIds?: string[] | undefined;
        assessmentIds?: string[] | undefined;
        evidenceMapLinkIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
    }[];
    provenance: {
        targetId: string;
        planId: string;
        planSectionId: string;
        draftingPolicy: {
            name: string;
            version: string;
        };
        artifactHashes: {
            assessmentSha256: string;
            requirementModelSha256: string;
            evidenceMapSha256: string;
            coverageSha256: string;
            contentPlanSha256: string;
            scaffoldSha256: string;
        };
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
        reviewDecisionId?: string | undefined;
    };
    evidenceIds: string[];
    metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
    supportStatus: "contextual" | "direct" | "qualified";
    requirementIds: string[];
    claimIds: string[];
    coverageIds: string[];
    assessmentIds: string[];
    evidenceMapLinkIds: string[];
    claimBoundaryIds: string[];
    metricPermissionIds: string[];
    draftItemId: string;
    statementText: string;
    statementSha256: string;
    scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
    validationStatus: "valid" | "invalid" | "requires-review";
}>;
export declare const JobResumeDraftEvidenceUsageSchema: z.ZodObject<{
    id: z.ZodString;
    evidenceId: z.ZodString;
    allocation: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
    plannedRequirementIds: z.ZodArray<z.ZodString, "many">;
    draftItemIds: z.ZodArray<z.ZodString, "many">;
    sectionIds: z.ZodArray<z.ZodString, "many">;
    usageCount: z.ZodNumber;
    repeatedUse: z.ZodBoolean;
    status: z.ZodEnum<["within-plan", "overused", "unused-selected-evidence", "excluded"]>;
    warnings: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
    id: string;
    warnings: string[];
    evidenceId: string;
    plannedRequirementIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
    usageCount: number;
    repeatedUse: boolean;
}, {
    status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
    id: string;
    warnings: string[];
    evidenceId: string;
    plannedRequirementIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
    usageCount: number;
    repeatedUse: boolean;
}>;
export declare const JobResumeDraftRiskSchema: z.ZodObject<{
    sectionIds: z.ZodArray<z.ZodString, "many">;
    draftItemIds: z.ZodArray<z.ZodString, "many">;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodString;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
    requirementIds: string[];
    claimIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
}, {
    code: string;
    message: string;
    id: string;
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
    requirementIds: string[];
    claimIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
}>;
export declare const JobResumeDraftWarningSchema: z.ZodObject<{
    sectionIds: z.ZodArray<z.ZodString, "many">;
    draftItemIds: z.ZodArray<z.ZodString, "many">;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodString;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
}, {
    code: string;
    message: string;
    id: string;
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
}>;
export declare const JobResumeDraftAmbiguitySchema: z.ZodObject<{
    sectionIds: z.ZodArray<z.ZodString, "many">;
    draftItemIds: z.ZodArray<z.ZodString, "many">;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
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
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
    resolved: boolean;
    resolutionRationale?: string | undefined;
}, {
    code: string;
    message: string;
    id: string;
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
    sectionIds: string[];
    draftItemIds: string[];
    claimBoundaryIds: string[];
    resolved: boolean;
    resolutionRationale?: string | undefined;
}>;
export declare const JobResumeDraftCompletenessSchema: z.ZodObject<{
    status: z.ZodEnum<["empty", "partial", "complete"]>;
    requiredSectionCount: z.ZodNumber;
    completedRequiredSectionCount: z.ZodNumber;
    draftItemCount: z.ZodNumber;
    validatedDraftItemCount: z.ZodNumber;
    claimLedgerComplete: z.ZodBoolean;
    evidenceUsageComplete: z.ZodBoolean;
    provenanceComplete: z.ZodBoolean;
    unresolvedCriticalIssueCount: z.ZodNumber;
    unresolvedAmbiguityCount: z.ZodNumber;
    reviewComplete: z.ZodBoolean;
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
    evidenceUsageComplete: boolean;
    unresolvedCriticalIssueCount: number;
    unresolvedAmbiguityCount: number;
    reviewComplete: boolean;
    usableForRendering: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    provenanceComplete: boolean;
    requiredSectionCount: number;
    completedRequiredSectionCount: number;
    draftItemCount: number;
    validatedDraftItemCount: number;
    claimLedgerComplete: boolean;
    evidenceUsageComplete: boolean;
    unresolvedCriticalIssueCount: number;
    unresolvedAmbiguityCount: number;
    reviewComplete: boolean;
    usableForRendering: boolean;
}>;
export declare const ModelJobResumeDraftPayloadSchema: z.ZodObject<{
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        planSectionId: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        order: z.ZodNumber;
        status: z.ZodEnum<["drafted", "empty", "excluded", "requires-review"]>;
        objectiveCode: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            claimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            metricReferences: z.ZodArray<z.ZodObject<{
                metricPermissionId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                exactApprovedText: z.ZodString;
                permissionSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }>, "many">;
            scopeReferences: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["role", "project", "technical", "temporal", "domain"]>;
                value: z.ZodString;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                status: z.ZodEnum<["approved", "qualified"]>;
            }, "strict", z.ZodTypeAny, {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }, {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }>, "many">;
            qualifiers: z.ZodArray<z.ZodString, "many">;
            trustState: z.ZodEnum<["model-proposed", "human-approved", "human-edited"]>;
            validation: z.ZodObject<{
                status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
                issues: z.ZodArray<z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
                    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                }, "strict", z.ZodTypeAny, {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }, {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }>, "many">;
            }, "strict", z.ZodTypeAny, {
                issues: {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            }, {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            }>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                planId: z.ZodString;
                planSectionId: z.ZodString;
                proposalId: z.ZodOptional<z.ZodString>;
                reviewDecisionId: z.ZodOptional<z.ZodString>;
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
                    requirementModelSha256: z.ZodString;
                    evidenceMapSha256: z.ZodString;
                    coverageSha256: z.ZodString;
                    assessmentSha256: z.ZodString;
                    contentPlanSha256: z.ZodString;
                    scaffoldSha256: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                }, {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
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
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            }, {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            }>;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
            metricPermissionIds: z.ZodArray<z.ZodString, "many">;
            id: z.ZodString;
            sectionId: z.ZodString;
            itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
            text: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            planId: z.ZodString;
            planSectionId: z.ZodString;
            contentPlanSha256: z.ZodString;
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
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        }, {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
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
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
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
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
    }>, "many">;
    warnings: z.ZodDefault<z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }>, "many">>;
    ambiguities: z.ZodDefault<z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
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
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        resolutionRationale?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
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
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
    }[];
    warnings: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
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
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
    }[];
    warnings?: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }[] | undefined;
    ambiguities?: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        resolutionRationale?: string | undefined;
    }[] | undefined;
}>;
export declare const JobResumeDraftProposalSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    mode: z.ZodLiteral<"job-specific-resume">;
    status: z.ZodEnum<["validation-failed", "ready-for-review", "reviewed"]>;
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
        requirementModelSha256: z.ZodString;
        evidenceMapSha256: z.ZodString;
        coverageSha256: z.ZodString;
        assessmentSha256: z.ZodString;
        contentPlanSha256: z.ZodString;
        scaffoldSha256: z.ZodString;
        selectedEvidenceSetSha256: z.ZodString;
        selectedClaimSetSha256: z.ZodString;
        normalizedModelInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        normalizedModelInputSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
    }, {
        targetSha256: string;
        normalizedModelInputSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
    }>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        planSectionId: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        order: z.ZodNumber;
        status: z.ZodEnum<["drafted", "empty", "excluded", "requires-review"]>;
        objectiveCode: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            claimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            metricReferences: z.ZodArray<z.ZodObject<{
                metricPermissionId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                exactApprovedText: z.ZodString;
                permissionSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }>, "many">;
            scopeReferences: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["role", "project", "technical", "temporal", "domain"]>;
                value: z.ZodString;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                status: z.ZodEnum<["approved", "qualified"]>;
            }, "strict", z.ZodTypeAny, {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }, {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }>, "many">;
            qualifiers: z.ZodArray<z.ZodString, "many">;
            trustState: z.ZodEnum<["model-proposed", "human-approved", "human-edited"]>;
            validation: z.ZodObject<{
                status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
                issues: z.ZodArray<z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
                    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                }, "strict", z.ZodTypeAny, {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }, {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }>, "many">;
            }, "strict", z.ZodTypeAny, {
                issues: {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            }, {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            }>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                planId: z.ZodString;
                planSectionId: z.ZodString;
                proposalId: z.ZodOptional<z.ZodString>;
                reviewDecisionId: z.ZodOptional<z.ZodString>;
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
                    requirementModelSha256: z.ZodString;
                    evidenceMapSha256: z.ZodString;
                    coverageSha256: z.ZodString;
                    assessmentSha256: z.ZodString;
                    contentPlanSha256: z.ZodString;
                    scaffoldSha256: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                }, {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
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
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            }, {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            }>;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
            metricPermissionIds: z.ZodArray<z.ZodString, "many">;
            id: z.ZodString;
            sectionId: z.ZodString;
            itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
            text: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            planId: z.ZodString;
            planSectionId: z.ZodString;
            contentPlanSha256: z.ZodString;
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
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        }, {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
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
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
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
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
    }>, "many">;
    claimLedger: z.ZodArray<z.ZodObject<{
        supportStatus: z.ZodEnum<["direct", "qualified", "contextual"]>;
        metricStatus: z.ZodEnum<["verified-metric-used", "metric-prohibited", "not-applicable"]>;
        scopeStatus: z.ZodEnum<["within-approved-scope", "qualified-scope", "requires-review"]>;
        validationStatus: z.ZodEnum<["valid", "invalid", "requires-review"]>;
        validationIssues: z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
            sectionIds: string[];
            draftItemIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
        }, {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            evidenceIds?: string[] | undefined;
            requirementIds?: string[] | undefined;
            claimIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            coverageIds?: string[] | undefined;
            assessmentIds?: string[] | undefined;
            evidenceMapLinkIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
        }>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            planId: z.ZodString;
            planSectionId: z.ZodString;
            proposalId: z.ZodOptional<z.ZodString>;
            reviewDecisionId: z.ZodOptional<z.ZodString>;
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
                requirementModelSha256: z.ZodString;
                evidenceMapSha256: z.ZodString;
                coverageSha256: z.ZodString;
                assessmentSha256: z.ZodString;
                contentPlanSha256: z.ZodString;
                scaffoldSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            }, {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
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
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        }, {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        }>;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        metricPermissionIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        draftItemId: z.ZodString;
        statementText: z.ZodString;
        statementSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        id: string;
        validationIssues: {
            code: string;
            message: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
            sectionIds: string[];
            draftItemIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
        supportStatus: "contextual" | "direct" | "qualified";
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        statementText: string;
        statementSha256: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
    }, {
        id: string;
        validationIssues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            evidenceIds?: string[] | undefined;
            requirementIds?: string[] | undefined;
            claimIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            coverageIds?: string[] | undefined;
            assessmentIds?: string[] | undefined;
            evidenceMapLinkIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
        supportStatus: "contextual" | "direct" | "qualified";
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        statementText: string;
        statementSha256: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
    }>, "many">;
    evidenceUsage: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        evidenceId: z.ZodString;
        allocation: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
        plannedRequirementIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        sectionIds: z.ZodArray<z.ZodString, "many">;
        usageCount: z.ZodNumber;
        repeatedUse: z.ZodBoolean;
        status: z.ZodEnum<["within-plan", "overused", "unused-selected-evidence", "excluded"]>;
        warnings: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
        id: string;
        warnings: string[];
        evidenceId: string;
        plannedRequirementIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        usageCount: number;
        repeatedUse: boolean;
    }, {
        status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
        id: string;
        warnings: string[];
        evidenceId: string;
        plannedRequirementIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        usageCount: number;
        repeatedUse: boolean;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
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
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        resolutionRationale?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        resolutionRationale?: string | undefined;
    }>, "many">;
    validationIssues: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
    }, {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
        evidenceIds?: string[] | undefined;
        requirementIds?: string[] | undefined;
        claimIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        coverageIds?: string[] | undefined;
        assessmentIds?: string[] | undefined;
        evidenceMapLinkIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
    }>, "many">;
    rawResponsePath: z.ZodEffects<z.ZodString, string, string>;
    rawResponseSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    status: "validation-failed" | "ready-for-review" | "reviewed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    input: {
        targetSha256: string;
        normalizedModelInputSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
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
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
    }[];
    targetType: "job";
    targetId: string;
    warnings: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
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
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
    }[];
    rawResponsePath: string;
    rawResponseSha256: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    claimLedger: {
        id: string;
        validationIssues: {
            code: string;
            message: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
            sectionIds: string[];
            draftItemIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
        supportStatus: "contextual" | "direct" | "qualified";
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        statementText: string;
        statementSha256: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
    }[];
    evidenceUsage: {
        status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
        id: string;
        warnings: string[];
        evidenceId: string;
        plannedRequirementIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        usageCount: number;
        repeatedUse: boolean;
    }[];
}, {
    status: "validation-failed" | "ready-for-review" | "reviewed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    input: {
        targetSha256: string;
        normalizedModelInputSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
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
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
    }[];
    targetType: "job";
    targetId: string;
    warnings: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
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
        evidenceIds?: string[] | undefined;
        requirementIds?: string[] | undefined;
        claimIds?: string[] | undefined;
        sectionIds?: string[] | undefined;
        draftItemIds?: string[] | undefined;
        coverageIds?: string[] | undefined;
        assessmentIds?: string[] | undefined;
        evidenceMapLinkIds?: string[] | undefined;
        claimBoundaryIds?: string[] | undefined;
    }[];
    rawResponsePath: string;
    rawResponseSha256: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    claimLedger: {
        id: string;
        validationIssues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            evidenceIds?: string[] | undefined;
            requirementIds?: string[] | undefined;
            claimIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            coverageIds?: string[] | undefined;
            assessmentIds?: string[] | undefined;
            evidenceMapLinkIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
        supportStatus: "contextual" | "direct" | "qualified";
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        statementText: string;
        statementSha256: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
    }[];
    evidenceUsage: {
        status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
        id: string;
        warnings: string[];
        evidenceId: string;
        plannedRequirementIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        usageCount: number;
        repeatedUse: boolean;
    }[];
}>;
export declare const JobResumeDraftProposalManifestSchema: z.ZodObject<{
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
    requirementModelSha256: z.ZodString;
    evidenceMapSha256: z.ZodString;
    coverageSha256: z.ZodString;
    assessmentSha256: z.ZodString;
    contentPlanSha256: z.ZodString;
    scaffoldSha256: z.ZodString;
    selectedEvidenceSetSha256: z.ZodString;
    selectedClaimSetSha256: z.ZodString;
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
    assessmentSha256: string;
    requirementModelSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    selectedEvidenceSetSha256: string;
    selectedClaimSetSha256: string;
    contentPlanSha256: string;
    scaffoldSha256: string;
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
    assessmentSha256: string;
    requirementModelSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    selectedEvidenceSetSha256: string;
    selectedClaimSetSha256: string;
    contentPlanSha256: string;
    scaffoldSha256: string;
}>;
export declare const JobResumeDraftReviewDecisionSchema: z.ZodObject<{
    id: z.ZodString;
    itemType: z.ZodEnum<["section", "draft-item", "claim-ledger", "section-order", "ambiguity"]>;
    itemId: z.ZodString;
    decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
    editedValue: z.ZodOptional<z.ZodUnknown>;
    reviewNote: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    decision: "pending" | "accept" | "edit" | "reject";
    id: string;
    itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
    itemId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedValue?: unknown;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    id: string;
    itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
    itemId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedValue?: unknown;
}>;
export declare const JobResumeDraftReviewSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    status: z.ZodEnum<["in-progress", "completed"]>;
    decisions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        itemType: z.ZodEnum<["section", "draft-item", "claim-ledger", "section-order", "ambiguity"]>;
        itemId: z.ZodString;
        decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
        editedValue: z.ZodOptional<z.ZodUnknown>;
        reviewNote: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        decision: "pending" | "accept" | "edit" | "reject";
        id: string;
        itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
        itemId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedValue?: unknown;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        id: string;
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
        id: string;
        itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
        itemId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedValue?: unknown;
    }[];
    id: string;
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
        id: string;
        itemType: "section" | "ambiguity" | "draft-item" | "claim-ledger" | "section-order";
        itemId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedValue?: unknown;
    }[];
    id: string;
    targetId: string;
    proposalId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
}>;
export declare const JobResumeDraftReviewManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    reviewId: z.ZodString;
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
    reviewId: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    proposalId: string;
    proposalSha256: string;
    reviewPath: string;
    reviewSha256: string;
    reviewId: string;
}>;
export declare const ApprovedJobResumeDraftSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    mode: z.ZodLiteral<"job-specific-resume">;
    targetTitle: z.ZodString;
    positioningState: z.ZodEnum<["direct", "adjacent", "stretch", "insufficient-proof", "indeterminate"]>;
    contentPlan: z.ZodObject<{
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
    prompt: z.ZodObject<{
        templateId: z.ZodString;
        templateVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        templateId: string;
        templateVersion: string;
    }, {
        templateId: string;
        templateVersion: string;
    }>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        planSectionId: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        order: z.ZodNumber;
        status: z.ZodEnum<["drafted", "empty", "excluded", "requires-review"]>;
        objectiveCode: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            claimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            metricReferences: z.ZodArray<z.ZodObject<{
                metricPermissionId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                exactApprovedText: z.ZodString;
                permissionSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }>, "many">;
            scopeReferences: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["role", "project", "technical", "temporal", "domain"]>;
                value: z.ZodString;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                status: z.ZodEnum<["approved", "qualified"]>;
            }, "strict", z.ZodTypeAny, {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }, {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }>, "many">;
            qualifiers: z.ZodArray<z.ZodString, "many">;
            trustState: z.ZodEnum<["model-proposed", "human-approved", "human-edited"]>;
            validation: z.ZodObject<{
                status: z.ZodEnum<["valid", "invalid", "requires-review"]>;
                issues: z.ZodArray<z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
                    sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                    claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                }, "strict", z.ZodTypeAny, {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }, {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }>, "many">;
            }, "strict", z.ZodTypeAny, {
                issues: {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            }, {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            }>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                planId: z.ZodString;
                planSectionId: z.ZodString;
                proposalId: z.ZodOptional<z.ZodString>;
                reviewDecisionId: z.ZodOptional<z.ZodString>;
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
                    requirementModelSha256: z.ZodString;
                    evidenceMapSha256: z.ZodString;
                    coverageSha256: z.ZodString;
                    assessmentSha256: z.ZodString;
                    contentPlanSha256: z.ZodString;
                    scaffoldSha256: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                }, {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
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
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            }, {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            }>;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
            metricPermissionIds: z.ZodArray<z.ZodString, "many">;
            id: z.ZodString;
            sectionId: z.ZodString;
            itemType: z.ZodEnum<["headline", "summary", "capability", "impact", "experience-role", "experience-bullet", "project", "technology", "leadership-capability", "education", "certification", "additional-information"]>;
            text: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }, {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    severity: "high" | "medium" | "low" | "critical";
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            planId: z.ZodString;
            planSectionId: z.ZodString;
            contentPlanSha256: z.ZodString;
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
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        }, {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
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
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
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
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
    }>, "many">;
    claimLedger: z.ZodArray<z.ZodObject<{
        supportStatus: z.ZodEnum<["direct", "qualified", "contextual"]>;
        metricStatus: z.ZodEnum<["verified-metric-used", "metric-prohibited", "not-applicable"]>;
        scopeStatus: z.ZodEnum<["within-approved-scope", "qualified-scope", "requires-review"]>;
        validationStatus: z.ZodEnum<["valid", "invalid", "requires-review"]>;
        validationIssues: z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
            sectionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            draftItemIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            requirementIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            coverageIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            assessmentIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            evidenceMapLinkIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            evidenceIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            claimIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            claimBoundaryIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
            sectionIds: string[];
            draftItemIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
        }, {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            evidenceIds?: string[] | undefined;
            requirementIds?: string[] | undefined;
            claimIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            coverageIds?: string[] | undefined;
            assessmentIds?: string[] | undefined;
            evidenceMapLinkIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
        }>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            planId: z.ZodString;
            planSectionId: z.ZodString;
            proposalId: z.ZodOptional<z.ZodString>;
            reviewDecisionId: z.ZodOptional<z.ZodString>;
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
                requirementModelSha256: z.ZodString;
                evidenceMapSha256: z.ZodString;
                coverageSha256: z.ZodString;
                assessmentSha256: z.ZodString;
                contentPlanSha256: z.ZodString;
                scaffoldSha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            }, {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
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
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        }, {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        }>;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        evidenceMapLinkIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        metricPermissionIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        draftItemId: z.ZodString;
        statementText: z.ZodString;
        statementSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        id: string;
        validationIssues: {
            code: string;
            message: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
            sectionIds: string[];
            draftItemIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
        supportStatus: "contextual" | "direct" | "qualified";
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        statementText: string;
        statementSha256: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
    }, {
        id: string;
        validationIssues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            evidenceIds?: string[] | undefined;
            requirementIds?: string[] | undefined;
            claimIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            coverageIds?: string[] | undefined;
            assessmentIds?: string[] | undefined;
            evidenceMapLinkIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
        supportStatus: "contextual" | "direct" | "qualified";
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        statementText: string;
        statementSha256: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
    }>, "many">;
    evidenceUsage: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        evidenceId: z.ZodString;
        allocation: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
        plannedRequirementIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        sectionIds: z.ZodArray<z.ZodString, "many">;
        usageCount: z.ZodNumber;
        repeatedUse: z.ZodBoolean;
        status: z.ZodEnum<["within-plan", "overused", "unused-selected-evidence", "excluded"]>;
        warnings: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
        id: string;
        warnings: string[];
        evidenceId: string;
        plannedRequirementIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        usageCount: number;
        repeatedUse: boolean;
    }, {
        status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
        id: string;
        warnings: string[];
        evidenceId: string;
        plannedRequirementIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        usageCount: number;
        repeatedUse: boolean;
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        claimBoundaryIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodString;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        sectionIds: z.ZodArray<z.ZodString, "many">;
        draftItemIds: z.ZodArray<z.ZodString, "many">;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
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
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        resolutionRationale?: string | undefined;
    }, {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
        resolutionRationale?: string | undefined;
    }>, "many">;
    completeness: z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        requiredSectionCount: z.ZodNumber;
        completedRequiredSectionCount: z.ZodNumber;
        draftItemCount: z.ZodNumber;
        validatedDraftItemCount: z.ZodNumber;
        claimLedgerComplete: z.ZodBoolean;
        evidenceUsageComplete: z.ZodBoolean;
        provenanceComplete: z.ZodBoolean;
        unresolvedCriticalIssueCount: z.ZodNumber;
        unresolvedAmbiguityCount: z.ZodNumber;
        reviewComplete: z.ZodBoolean;
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
        evidenceUsageComplete: boolean;
        unresolvedCriticalIssueCount: number;
        unresolvedAmbiguityCount: number;
        reviewComplete: boolean;
        usableForRendering: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        provenanceComplete: boolean;
        requiredSectionCount: number;
        completedRequiredSectionCount: number;
        draftItemCount: number;
        validatedDraftItemCount: number;
        claimLedgerComplete: boolean;
        evidenceUsageComplete: boolean;
        unresolvedCriticalIssueCount: number;
        unresolvedAmbiguityCount: number;
        reviewComplete: boolean;
        usableForRendering: boolean;
    }>;
    provenance: z.ZodObject<{
        targetSha256: z.ZodString;
        jobDescriptionSha256: z.ZodString;
        requirementModelSha256: z.ZodString;
        evidenceMapSha256: z.ZodString;
        coverageSha256: z.ZodString;
        assessmentSha256: z.ZodString;
        contentPlanSha256: z.ZodString;
        scaffoldSha256: z.ZodString;
        proposalSha256: z.ZodString;
        reviewSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        proposalSha256: string;
        reviewSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
        jobDescriptionSha256: string;
    }, {
        targetSha256: string;
        proposalSha256: string;
        reviewSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
        jobDescriptionSha256: string;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "empty" | "requires-review" | "drafted" | "excluded";
        id: string;
        items: {
            validation: {
                issues: {
                    code: string;
                    message: string;
                    evidenceIds: string[];
                    severity: "high" | "medium" | "low" | "critical";
                    requirementIds: string[];
                    claimIds: string[];
                    sectionIds: string[];
                    draftItemIds: string[];
                    coverageIds: string[];
                    assessmentIds: string[];
                    evidenceMapLinkIds: string[];
                    claimBoundaryIds: string[];
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
    }[];
    targetType: "job";
    targetId: string;
    warnings: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
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
        evidenceUsageComplete: boolean;
        unresolvedCriticalIssueCount: number;
        unresolvedAmbiguityCount: number;
        reviewComplete: boolean;
        usableForRendering: boolean;
    };
    prompt: {
        templateId: string;
        templateVersion: string;
    };
    provenance: {
        targetSha256: string;
        proposalSha256: string;
        reviewSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
        jobDescriptionSha256: string;
    };
    risks: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }[];
    targetTitle: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    positioningState: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
    contentPlan: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    claimLedger: {
        id: string;
        validationIssues: {
            code: string;
            message: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
            sectionIds: string[];
            draftItemIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
        supportStatus: "contextual" | "direct" | "qualified";
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        statementText: string;
        statementSha256: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
    }[];
    evidenceUsage: {
        status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
        id: string;
        warnings: string[];
        evidenceId: string;
        plannedRequirementIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        usageCount: number;
        repeatedUse: boolean;
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
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
                    evidenceIds?: string[] | undefined;
                    requirementIds?: string[] | undefined;
                    claimIds?: string[] | undefined;
                    sectionIds?: string[] | undefined;
                    draftItemIds?: string[] | undefined;
                    coverageIds?: string[] | undefined;
                    assessmentIds?: string[] | undefined;
                    evidenceMapLinkIds?: string[] | undefined;
                    claimBoundaryIds?: string[] | undefined;
                }[];
                status: "valid" | "invalid" | "requires-review";
            };
            id: string;
            sectionId: string;
            trustState: "human-approved" | "human-edited" | "model-proposed";
            provenance: {
                targetId: string;
                planId: string;
                planSectionId: string;
                draftingPolicy: {
                    name: string;
                    version: string;
                };
                artifactHashes: {
                    assessmentSha256: string;
                    requirementModelSha256: string;
                    evidenceMapSha256: string;
                    coverageSha256: string;
                    contentPlanSha256: string;
                    scaffoldSha256: string;
                };
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
                reviewDecisionId?: string | undefined;
            };
            evidenceIds: string[];
            text: string;
            requirementIds: string[];
            claimIds: string[];
            coverageIds: string[];
            assessmentIds: string[];
            evidenceMapLinkIds: string[];
            claimBoundaryIds: string[];
            itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability";
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            metricReferences: {
                claimId: string;
                evidenceId: string;
                metricPermissionId: string;
                exactApprovedText: string;
                permissionSha256: string;
            }[];
            scopeReferences: {
                value: string;
                type: "role" | "domain" | "project" | "technical" | "temporal";
                status: "approved" | "qualified";
                evidenceIds: string[];
            }[];
            qualifiers: string[];
            metricPermissionIds: string[];
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            contentPlanSha256: string;
        };
        order: number;
        objectiveCode: string;
        planSectionId: string;
    }[];
    targetType: "job";
    targetId: string;
    warnings: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }[];
    ambiguities: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
        resolved: boolean;
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
        evidenceUsageComplete: boolean;
        unresolvedCriticalIssueCount: number;
        unresolvedAmbiguityCount: number;
        reviewComplete: boolean;
        usableForRendering: boolean;
    };
    prompt: {
        templateId: string;
        templateVersion: string;
    };
    provenance: {
        targetSha256: string;
        proposalSha256: string;
        reviewSha256: string;
        assessmentSha256: string;
        requirementModelSha256: string;
        evidenceMapSha256: string;
        coverageSha256: string;
        contentPlanSha256: string;
        scaffoldSha256: string;
        jobDescriptionSha256: string;
    };
    risks: {
        code: string;
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        claimBoundaryIds: string[];
    }[];
    targetTitle: string;
    draftingPolicy: {
        name: string;
        version: string;
    };
    positioningState: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
    contentPlan: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    claimLedger: {
        id: string;
        validationIssues: {
            code: string;
            message: string;
            severity: "high" | "medium" | "low" | "critical";
            evidenceIds?: string[] | undefined;
            requirementIds?: string[] | undefined;
            claimIds?: string[] | undefined;
            sectionIds?: string[] | undefined;
            draftItemIds?: string[] | undefined;
            coverageIds?: string[] | undefined;
            assessmentIds?: string[] | undefined;
            evidenceMapLinkIds?: string[] | undefined;
            claimBoundaryIds?: string[] | undefined;
        }[];
        provenance: {
            targetId: string;
            planId: string;
            planSectionId: string;
            draftingPolicy: {
                name: string;
                version: string;
            };
            artifactHashes: {
                assessmentSha256: string;
                requirementModelSha256: string;
                evidenceMapSha256: string;
                coverageSha256: string;
                contentPlanSha256: string;
                scaffoldSha256: string;
            };
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
            reviewDecisionId?: string | undefined;
        };
        evidenceIds: string[];
        metricStatus: "verified-metric-used" | "metric-prohibited" | "not-applicable";
        supportStatus: "contextual" | "direct" | "qualified";
        requirementIds: string[];
        claimIds: string[];
        coverageIds: string[];
        assessmentIds: string[];
        evidenceMapLinkIds: string[];
        claimBoundaryIds: string[];
        metricPermissionIds: string[];
        draftItemId: string;
        statementText: string;
        statementSha256: string;
        scopeStatus: "requires-review" | "within-approved-scope" | "qualified-scope";
        validationStatus: "valid" | "invalid" | "requires-review";
    }[];
    evidenceUsage: {
        status: "excluded" | "within-plan" | "overused" | "unused-selected-evidence";
        id: string;
        warnings: string[];
        evidenceId: string;
        plannedRequirementIds: string[];
        sectionIds: string[];
        draftItemIds: string[];
        allocation: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        usageCount: number;
        repeatedUse: boolean;
    }[];
}>;
export declare const ApprovedJobResumeDraftManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    draftId: z.ZodString;
    targetId: z.ZodString;
    draftPath: z.ZodEffects<z.ZodString, string, string>;
    draftSha256: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    requirementModelSha256: z.ZodString;
    evidenceMapSha256: z.ZodString;
    coverageSha256: z.ZodString;
    assessmentSha256: z.ZodString;
    contentPlanSha256: z.ZodString;
    scaffoldSha256: z.ZodString;
    proposalId: z.ZodString;
    proposalSha256: z.ZodString;
    reviewId: z.ZodString;
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
    assessmentSha256: string;
    policyName: string;
    requirementModelSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    contentPlanSha256: string;
    scaffoldSha256: string;
    reviewId: string;
    draftId: string;
    draftPath: string;
    draftSha256: string;
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
    assessmentSha256: string;
    policyName: string;
    requirementModelSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    contentPlanSha256: string;
    scaffoldSha256: string;
    reviewId: string;
    draftId: string;
    draftPath: string;
    draftSha256: string;
}>;
export type JobResumeDraftItemType = z.infer<typeof JobResumeDraftItemTypeSchema>;
export type JobResumeDraftItem = z.infer<typeof JobResumeDraftItemSchema>;
export type JobResumeDraftSection = z.infer<typeof JobResumeDraftSectionSchema>;
export type JobResumeDraftScaffoldSection = z.infer<typeof JobResumeDraftScaffoldSectionSchema>;
export type JobResumeDraftScaffold = z.infer<typeof JobResumeDraftScaffoldSchema>;
export type JobResumeDraftScaffoldManifest = z.infer<typeof JobResumeDraftScaffoldManifestSchema>;
export type JobResumeDraftValidationIssue = z.infer<typeof JobResumeDraftValidationIssueSchema>;
export type JobResumeDraftClaimLedgerEntry = z.infer<typeof JobResumeDraftClaimLedgerEntrySchema>;
export type JobResumeDraftEvidenceUsage = z.infer<typeof JobResumeDraftEvidenceUsageSchema>;
export type JobResumeDraftWarning = z.infer<typeof JobResumeDraftWarningSchema>;
export type JobResumeDraftRisk = z.infer<typeof JobResumeDraftRiskSchema>;
export type JobResumeDraftAmbiguity = z.infer<typeof JobResumeDraftAmbiguitySchema>;
export type JobResumeDraftCompleteness = z.infer<typeof JobResumeDraftCompletenessSchema>;
export type ModelJobResumeDraftPayload = z.infer<typeof ModelJobResumeDraftPayloadSchema>;
export type JobResumeDraftProposal = z.infer<typeof JobResumeDraftProposalSchema>;
export type JobResumeDraftProposalManifest = z.infer<typeof JobResumeDraftProposalManifestSchema>;
export type JobResumeDraftReviewDecision = z.infer<typeof JobResumeDraftReviewDecisionSchema>;
export type JobResumeDraftReview = z.infer<typeof JobResumeDraftReviewSchema>;
export type ApprovedJobResumeDraft = z.infer<typeof ApprovedJobResumeDraftSchema>;
