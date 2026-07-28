import { z } from "zod";
export declare const JobResumePlanningModeSchema: z.ZodLiteral<"job-specific-resume">;
export declare const JobResumePositioningStateSchema: z.ZodEnum<["direct", "adjacent", "stretch", "insufficient-proof", "indeterminate"]>;
export declare const JobRequirementEmphasisDecisionSchema: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
export declare const JobEvidenceSelectionDecisionSchema: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
export declare const JobResumeSectionTypeSchema: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
export declare const JobResumeSectionInclusionSchema: z.ZodEnum<["include", "optional", "exclude"]>;
export declare const JobResumeContentTypeSchema: z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>;
export declare const JobClaimBoundaryStateSchema: z.ZodEnum<["allowed", "allowed-with-qualifier", "requires-caution", "prohibited"]>;
export declare const JobClaimBoundaryKindSchema: z.ZodEnum<["requirement-claim", "target-title", "project-employment", "metric", "scope"]>;
export declare const JobMetricPermissionStateSchema: z.ZodEnum<["allowed", "prohibited"]>;
export declare const JobGapHandlingDecisionSchema: z.ZodEnum<["exclude-positive-positioning", "defer", "supported-adjacent-claim", "drafting-caution"]>;
export declare const JobPlanDependencySchema: z.ZodObject<{
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
export declare const JobPlanFileDependencySchema: z.ZodObject<{
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
}, {
    sha256: string;
    path: string;
}>;
export declare const JobPlanCoverageReferenceSchema: z.ZodObject<{
    coverageEntryId: z.ZodString;
    coverageEntrySha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    coverageEntryId: string;
    coverageEntrySha256: string;
}, {
    coverageEntryId: string;
    coverageEntrySha256: string;
}>;
export declare const JobPlanAssessmentReferenceSchema: z.ZodObject<{
    assessmentEntryId: z.ZodString;
    assessmentEntrySha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    assessmentEntryId: string;
    assessmentEntrySha256: string;
}, {
    assessmentEntryId: string;
    assessmentEntrySha256: string;
}>;
export declare const JobPlanEvidenceLinkReferenceSchema: z.ZodObject<{
    linkId: z.ZodString;
    linkSha256: z.ZodString;
    requirementId: z.ZodString;
    evidenceId: z.ZodString;
    claimId: z.ZodString;
    relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
    requirementProvenance: z.ZodObject<{
        requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
        requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
        requirementModelSha256: z.ZodString;
        requirementId: z.ZodString;
        sourceTextSha256: z.ZodString;
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
    }, "strict", z.ZodTypeAny, {
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
        requirementId: string;
        requirementModelType: "approved" | "deterministic";
        requirementModelPath: string;
        requirementModelSha256: string;
        sourceTextSha256: string;
    }, {
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
        requirementId: string;
        requirementModelType: "approved" | "deterministic";
        requirementModelPath: string;
        requirementModelSha256: string;
        sourceTextSha256: string;
    }>;
    evidenceProvenance: z.ZodObject<{
        evidenceId: z.ZodString;
        evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
        evidenceItemSha256: z.ZodString;
        claimId: z.ZodString;
        claimPath: z.ZodEffects<z.ZodString, string, string>;
        claimSha256: z.ZodString;
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
        claimId: string;
        evidenceId: string;
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
        evidenceItemPath: string;
        evidenceItemSha256: string;
        claimPath: string;
        claimSha256: string;
    }, {
        claimId: string;
        evidenceId: string;
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
        evidenceItemPath: string;
        evidenceItemSha256: string;
        claimPath: string;
        claimSha256: string;
    }>;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    evidenceId: string;
    evidenceProvenance: {
        claimId: string;
        evidenceId: string;
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
        evidenceItemPath: string;
        evidenceItemSha256: string;
        claimPath: string;
        claimSha256: string;
    };
    requirementId: string;
    relationship: "partial" | "direct" | "supporting";
    requirementProvenance: {
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
        requirementId: string;
        requirementModelType: "approved" | "deterministic";
        requirementModelPath: string;
        requirementModelSha256: string;
        sourceTextSha256: string;
    };
    linkId: string;
    linkSha256: string;
}, {
    claimId: string;
    evidenceId: string;
    evidenceProvenance: {
        claimId: string;
        evidenceId: string;
        sources: {
            sha256: string;
            path: string;
            status: "active";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        }[];
        evidenceItemPath: string;
        evidenceItemSha256: string;
        claimPath: string;
        claimSha256: string;
    };
    requirementId: string;
    relationship: "partial" | "direct" | "supporting";
    requirementProvenance: {
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
        requirementId: string;
        requirementModelType: "approved" | "deterministic";
        requirementModelPath: string;
        requirementModelSha256: string;
        sourceTextSha256: string;
    };
    linkId: string;
    linkSha256: string;
}>;
export declare const JobPlanElementProvenanceSchema: z.ZodObject<{
    targetId: z.ZodString;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    coverageReferences: z.ZodArray<z.ZodObject<{
        coverageEntryId: z.ZodString;
        coverageEntrySha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        coverageEntryId: string;
        coverageEntrySha256: string;
    }, {
        coverageEntryId: string;
        coverageEntrySha256: string;
    }>, "many">;
    assessmentReferences: z.ZodArray<z.ZodObject<{
        assessmentEntryId: z.ZodString;
        assessmentEntrySha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        assessmentEntryId: string;
        assessmentEntrySha256: string;
    }, {
        assessmentEntryId: string;
        assessmentEntrySha256: string;
    }>, "many">;
    evidenceLinkReferences: z.ZodArray<z.ZodObject<{
        linkId: z.ZodString;
        linkSha256: z.ZodString;
        requirementId: z.ZodString;
        evidenceId: z.ZodString;
        claimId: z.ZodString;
        relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
        requirementProvenance: z.ZodObject<{
            requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
            requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
            requirementModelSha256: z.ZodString;
            requirementId: z.ZodString;
            sourceTextSha256: z.ZodString;
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
        }, "strict", z.ZodTypeAny, {
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
            requirementId: string;
            requirementModelType: "approved" | "deterministic";
            requirementModelPath: string;
            requirementModelSha256: string;
            sourceTextSha256: string;
        }, {
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
            requirementId: string;
            requirementModelType: "approved" | "deterministic";
            requirementModelPath: string;
            requirementModelSha256: string;
            sourceTextSha256: string;
        }>;
        evidenceProvenance: z.ZodObject<{
            evidenceId: z.ZodString;
            evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
            evidenceItemSha256: z.ZodString;
            claimId: z.ZodString;
            claimPath: z.ZodEffects<z.ZodString, string, string>;
            claimSha256: z.ZodString;
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
            claimId: string;
            evidenceId: string;
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
            evidenceItemPath: string;
            evidenceItemSha256: string;
            claimPath: string;
            claimSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
            evidenceItemPath: string;
            evidenceItemSha256: string;
            claimPath: string;
            claimSha256: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        claimId: string;
        evidenceId: string;
        evidenceProvenance: {
            claimId: string;
            evidenceId: string;
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
            evidenceItemPath: string;
            evidenceItemSha256: string;
            claimPath: string;
            claimSha256: string;
        };
        requirementId: string;
        relationship: "partial" | "direct" | "supporting";
        requirementProvenance: {
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
            requirementId: string;
            requirementModelType: "approved" | "deterministic";
            requirementModelPath: string;
            requirementModelSha256: string;
            sourceTextSha256: string;
        };
        linkId: string;
        linkSha256: string;
    }, {
        claimId: string;
        evidenceId: string;
        evidenceProvenance: {
            claimId: string;
            evidenceId: string;
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
            evidenceItemPath: string;
            evidenceItemSha256: string;
            claimPath: string;
            claimSha256: string;
        };
        requirementId: string;
        relationship: "partial" | "direct" | "supporting";
        requirementProvenance: {
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
            requirementId: string;
            requirementModelType: "approved" | "deterministic";
            requirementModelPath: string;
            requirementModelSha256: string;
            sourceTextSha256: string;
        };
        linkId: string;
        linkSha256: string;
    }>, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    planningPolicy: z.ZodObject<{
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
    evidenceIds: string[];
    requirementIds: string[];
    planningPolicy: {
        name: string;
        version: string;
    };
    coverageReferences: {
        coverageEntryId: string;
        coverageEntrySha256: string;
    }[];
    assessmentReferences: {
        assessmentEntryId: string;
        assessmentEntrySha256: string;
    }[];
    evidenceLinkReferences: {
        claimId: string;
        evidenceId: string;
        evidenceProvenance: {
            claimId: string;
            evidenceId: string;
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
            evidenceItemPath: string;
            evidenceItemSha256: string;
            claimPath: string;
            claimSha256: string;
        };
        requirementId: string;
        relationship: "partial" | "direct" | "supporting";
        requirementProvenance: {
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
            requirementId: string;
            requirementModelType: "approved" | "deterministic";
            requirementModelPath: string;
            requirementModelSha256: string;
            sourceTextSha256: string;
        };
        linkId: string;
        linkSha256: string;
    }[];
    claimIds: string[];
}, {
    targetId: string;
    evidenceIds: string[];
    requirementIds: string[];
    planningPolicy: {
        name: string;
        version: string;
    };
    coverageReferences: {
        coverageEntryId: string;
        coverageEntrySha256: string;
    }[];
    assessmentReferences: {
        assessmentEntryId: string;
        assessmentEntrySha256: string;
    }[];
    evidenceLinkReferences: {
        claimId: string;
        evidenceId: string;
        evidenceProvenance: {
            claimId: string;
            evidenceId: string;
            sources: {
                sha256: string;
                path: string;
                status: "active";
                sourceType: string;
                sourceId: string;
                visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            }[];
            evidenceItemPath: string;
            evidenceItemSha256: string;
            claimPath: string;
            claimSha256: string;
        };
        requirementId: string;
        relationship: "partial" | "direct" | "supporting";
        requirementProvenance: {
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
            requirementId: string;
            requirementModelType: "approved" | "deterministic";
            requirementModelPath: string;
            requirementModelSha256: string;
            sourceTextSha256: string;
        };
        linkId: string;
        linkSha256: string;
    }[];
    claimIds: string[];
}>;
export declare const JobResumePositioningSchema: z.ZodObject<{
    state: z.ZodEnum<["direct", "adjacent", "stretch", "insufficient-proof", "indeterminate"]>;
    sourceOverallAssessment: z.ZodEnum<["strong", "credible", "mixed", "limited", "insufficient", "indeterminate"]>;
    targetTitle: z.ZodString;
    targetTitleUse: z.ZodLiteral<"positioning-only">;
    primaryRequirementIds: z.ZodArray<z.ZodString, "many">;
    supportingRequirementIds: z.ZodArray<z.ZodString, "many">;
    cautionRequirementIds: z.ZodArray<z.ZodString, "many">;
    rationaleCode: z.ZodEnum<["strong-reviewed-proof", "credible-reviewed-proof", "mixed-reviewed-proof", "limited-reviewed-proof", "insufficient-reviewed-proof", "indeterminate-reviewed-proof"]>;
    prohibitedUses: z.ZodArray<z.ZodEnum<["employment-history", "seniority-proof", "authority-proof", "scope-proof"]>, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageReferences: z.ZodArray<z.ZodObject<{
            coverageEntryId: z.ZodString;
            coverageEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }>, "many">;
        assessmentReferences: z.ZodArray<z.ZodObject<{
            assessmentEntryId: z.ZodString;
            assessmentEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }>, "many">;
        evidenceLinkReferences: z.ZodArray<z.ZodObject<{
            linkId: z.ZodString;
            linkSha256: z.ZodString;
            requirementId: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
            requirementProvenance: z.ZodObject<{
                requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                requirementModelSha256: z.ZodString;
                requirementId: z.ZodString;
                sourceTextSha256: z.ZodString;
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
            }, "strict", z.ZodTypeAny, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }>;
            evidenceProvenance: z.ZodObject<{
                evidenceId: z.ZodString;
                evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                evidenceItemSha256: z.ZodString;
                claimId: z.ZodString;
                claimPath: z.ZodEffects<z.ZodString, string, string>;
                claimSha256: z.ZodString;
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
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }>, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        planningPolicy: z.ZodObject<{
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
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }, {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }>;
}, "strict", z.ZodTypeAny, {
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    prohibitedUses: ("employment-history" | "seniority-proof" | "authority-proof" | "scope-proof")[];
    state: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
    sourceOverallAssessment: "strong" | "limited" | "insufficient" | "mixed" | "indeterminate" | "credible";
    targetTitle: string;
    targetTitleUse: "positioning-only";
    primaryRequirementIds: string[];
    supportingRequirementIds: string[];
    cautionRequirementIds: string[];
    rationaleCode: "strong-reviewed-proof" | "credible-reviewed-proof" | "mixed-reviewed-proof" | "limited-reviewed-proof" | "insufficient-reviewed-proof" | "indeterminate-reviewed-proof";
}, {
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    prohibitedUses: ("employment-history" | "seniority-proof" | "authority-proof" | "scope-proof")[];
    state: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
    sourceOverallAssessment: "strong" | "limited" | "insufficient" | "mixed" | "indeterminate" | "credible";
    targetTitle: string;
    targetTitleUse: "positioning-only";
    primaryRequirementIds: string[];
    supportingRequirementIds: string[];
    cautionRequirementIds: string[];
    rationaleCode: "strong-reviewed-proof" | "credible-reviewed-proof" | "mixed-reviewed-proof" | "limited-reviewed-proof" | "insufficient-reviewed-proof" | "indeterminate-reviewed-proof";
}>;
export declare const JobRequirementEmphasisSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    requirementId: z.ZodString;
    category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
    necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
    assessmentState: z.ZodEnum<["strength", "supported", "partial", "gap", "contradiction", "indeterminate"]>;
    coverageState: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
    proofStrength: z.ZodEnum<["strong", "adequate", "limited", "unavailable", "conflicting"]>;
    materiality: z.ZodEnum<["critical", "material", "secondary", "contextual", "unknown"]>;
    decision: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
    selectedLinkIds: z.ZodArray<z.ZodString, "many">;
    selectedEvidenceIds: z.ZodArray<z.ZodString, "many">;
    selectedClaimIds: z.ZodArray<z.ZodString, "many">;
    allowedTerminology: z.ZodArray<z.ZodString, "many">;
    allowedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
    rationaleCode: z.ZodEnum<["mandatory-strong-support", "mandatory-defensible-support", "preferred-defensible-support", "contextual-defensible-support", "mandatory-partial-support", "nonmandatory-partial-support", "unsupported-requirement", "contradicted-requirement", "indeterminate-requirement"]>;
    cautionCodes: z.ZodArray<z.ZodEnum<["do-not-overstate-partial-proof", "do-not-present-gap-as-strength", "do-not-use-adjacent-proof-as-direct", "do-not-hide-contradiction", "preserve-ambiguity"]>, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageReferences: z.ZodArray<z.ZodObject<{
            coverageEntryId: z.ZodString;
            coverageEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }>, "many">;
        assessmentReferences: z.ZodArray<z.ZodObject<{
            assessmentEntryId: z.ZodString;
            assessmentEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }>, "many">;
        evidenceLinkReferences: z.ZodArray<z.ZodObject<{
            linkId: z.ZodString;
            linkSha256: z.ZodString;
            requirementId: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
            requirementProvenance: z.ZodObject<{
                requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                requirementModelSha256: z.ZodString;
                requirementId: z.ZodString;
                sourceTextSha256: z.ZodString;
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
            }, "strict", z.ZodTypeAny, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }>;
            evidenceProvenance: z.ZodObject<{
                evidenceId: z.ZodString;
                evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                evidenceItemSha256: z.ZodString;
                claimId: z.ZodString;
                claimPath: z.ZodEffects<z.ZodString, string, string>;
                claimSha256: z.ZodString;
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
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }>, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        planningPolicy: z.ZodObject<{
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
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }, {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }>;
}, "strict", z.ZodTypeAny, {
    decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
    id: string;
    necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
    requirementId: string;
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
    proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
    rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
    selectedLinkIds: string[];
    selectedEvidenceIds: string[];
    selectedClaimIds: string[];
    allowedTerminology: string[];
    cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
}, {
    decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
    id: string;
    necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
    requirementId: string;
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
    proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
    rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
    selectedLinkIds: string[];
    selectedEvidenceIds: string[];
    selectedClaimIds: string[];
    allowedTerminology: string[];
    cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
}>, {
    decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
    id: string;
    necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
    requirementId: string;
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
    proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
    rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
    selectedLinkIds: string[];
    selectedEvidenceIds: string[];
    selectedClaimIds: string[];
    allowedTerminology: string[];
    cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
}, {
    decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
    id: string;
    necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
    requirementId: string;
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
    proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
    rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
    selectedLinkIds: string[];
    selectedEvidenceIds: string[];
    selectedClaimIds: string[];
    allowedTerminology: string[];
    cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
}>;
export declare const JobEvidenceRequirementUseSchema: z.ZodObject<{
    requirementId: z.ZodString;
    linkIds: z.ZodArray<z.ZodString, "many">;
    decision: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
    intendedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
    purposeCode: z.ZodEnum<["primary-requirement-proof", "secondary-requirement-proof", "supporting-context", "deferred-proof", "excluded-proof"]>;
}, "strict", z.ZodTypeAny, {
    decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
    requirementId: string;
    linkIds: string[];
    intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
}, {
    decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
    requirementId: string;
    linkIds: string[];
    intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
}>;
export declare const JobResumeEvidenceSelectionSchema: z.ZodObject<{
    id: z.ZodString;
    evidenceId: z.ZodString;
    claimIds: z.ZodArray<z.ZodString, "many">;
    decision: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
    relationships: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial"]>, "many">;
    requirementUses: z.ZodArray<z.ZodObject<{
        requirementId: z.ZodString;
        linkIds: z.ZodArray<z.ZodString, "many">;
        decision: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
        intendedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
        purposeCode: z.ZodEnum<["primary-requirement-proof", "secondary-requirement-proof", "supporting-context", "deferred-proof", "excluded-proof"]>;
    }, "strict", z.ZodTypeAny, {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        requirementId: string;
        linkIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
    }, {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        requirementId: string;
        linkIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
    }>, "many">;
    intendedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
    primaryRequirementId: z.ZodOptional<z.ZodString>;
    reuseWarning: z.ZodBoolean;
    boundaryIds: z.ZodArray<z.ZodString, "many">;
    limitationCodes: z.ZodArray<z.ZodEnum<["partial-relationship", "supporting-relationship-only", "limited-proof", "project-scoped", "historical-scope-only", "no-verified-metric", "multiple-section-reuse"]>, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageReferences: z.ZodArray<z.ZodObject<{
            coverageEntryId: z.ZodString;
            coverageEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }>, "many">;
        assessmentReferences: z.ZodArray<z.ZodObject<{
            assessmentEntryId: z.ZodString;
            assessmentEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }>, "many">;
        evidenceLinkReferences: z.ZodArray<z.ZodObject<{
            linkId: z.ZodString;
            linkSha256: z.ZodString;
            requirementId: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
            requirementProvenance: z.ZodObject<{
                requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                requirementModelSha256: z.ZodString;
                requirementId: z.ZodString;
                sourceTextSha256: z.ZodString;
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
            }, "strict", z.ZodTypeAny, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }>;
            evidenceProvenance: z.ZodObject<{
                evidenceId: z.ZodString;
                evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                evidenceItemSha256: z.ZodString;
                claimId: z.ZodString;
                claimPath: z.ZodEffects<z.ZodString, string, string>;
                claimSha256: z.ZodString;
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
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }>, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        planningPolicy: z.ZodObject<{
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
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }, {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }>;
}, "strict", z.ZodTypeAny, {
    decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
    id: string;
    evidenceId: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    relationships: ("partial" | "direct" | "supporting")[];
    claimIds: string[];
    intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    requirementUses: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        requirementId: string;
        linkIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
    }[];
    reuseWarning: boolean;
    boundaryIds: string[];
    limitationCodes: ("partial-relationship" | "supporting-relationship-only" | "limited-proof" | "project-scoped" | "historical-scope-only" | "no-verified-metric" | "multiple-section-reuse")[];
    primaryRequirementId?: string | undefined;
}, {
    decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
    id: string;
    evidenceId: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    relationships: ("partial" | "direct" | "supporting")[];
    claimIds: string[];
    intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    requirementUses: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        requirementId: string;
        linkIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
    }[];
    reuseWarning: boolean;
    boundaryIds: string[];
    limitationCodes: ("partial-relationship" | "supporting-relationship-only" | "limited-proof" | "project-scoped" | "historical-scope-only" | "no-verified-metric" | "multiple-section-reuse")[];
    primaryRequirementId?: string | undefined;
}>;
export declare const JobResumeClaimBoundarySchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<["requirement-claim", "target-title", "project-employment", "metric", "scope"]>;
    requirementId: z.ZodOptional<z.ZodString>;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    state: z.ZodEnum<["allowed", "allowed-with-qualifier", "requires-caution", "prohibited"]>;
    allowedClaimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    prohibitedClaimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    requiredQualifierCodes: z.ZodArray<z.ZodEnum<["evidence-scoped-wording", "project-scoped-wording", "adjacent-not-direct", "partial-support-only", "exact-reviewed-metric-only", "target-title-positioning-only"]>, "many">;
    prohibitedInferenceCodes: z.ZodArray<z.ZodEnum<["target-title-as-employment", "project-as-employment", "responsibility-as-achievement", "contribution-as-ownership", "collaboration-as-management", "technical-exposure-as-expertise", "adjacent-technology-as-exact-experience", "domain-adjacency-as-direct-experience", "unsupported-seniority", "unsupported-authority", "unsupported-team-size", "unsupported-geography", "unsupported-scale", "unsupported-adoption", "unsupported-dates", "unsupported-outcomes", "unverified-metric"]>, "many">;
    rationaleCode: z.ZodEnum<["direct-reviewed-proof", "qualified-partial-proof", "deferred-or-ambiguous-proof", "unsupported-or-conflicting-proof", "target-title-not-history", "project-scope-not-employment", "metric-requires-verification", "scope-limited-to-reviewed-evidence"]>;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageReferences: z.ZodArray<z.ZodObject<{
            coverageEntryId: z.ZodString;
            coverageEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }>, "many">;
        assessmentReferences: z.ZodArray<z.ZodObject<{
            assessmentEntryId: z.ZodString;
            assessmentEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }>, "many">;
        evidenceLinkReferences: z.ZodArray<z.ZodObject<{
            linkId: z.ZodString;
            linkSha256: z.ZodString;
            requirementId: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
            requirementProvenance: z.ZodObject<{
                requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                requirementModelSha256: z.ZodString;
                requirementId: z.ZodString;
                sourceTextSha256: z.ZodString;
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
            }, "strict", z.ZodTypeAny, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }>;
            evidenceProvenance: z.ZodObject<{
                evidenceId: z.ZodString;
                evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                evidenceItemSha256: z.ZodString;
                claimId: z.ZodString;
                claimPath: z.ZodEffects<z.ZodString, string, string>;
                claimSha256: z.ZodString;
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
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }>, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        planningPolicy: z.ZodObject<{
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
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }, {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }>;
}, "strict", z.ZodTypeAny, {
    id: string;
    kind: "scope" | "target-title" | "requirement-claim" | "project-employment" | "metric";
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    evidenceIds: string[];
    allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
    prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
    state: "allowed" | "prohibited" | "allowed-with-qualifier" | "requires-caution";
    claimIds: string[];
    rationaleCode: "direct-reviewed-proof" | "qualified-partial-proof" | "deferred-or-ambiguous-proof" | "unsupported-or-conflicting-proof" | "target-title-not-history" | "project-scope-not-employment" | "metric-requires-verification" | "scope-limited-to-reviewed-evidence";
    requiredQualifierCodes: ("evidence-scoped-wording" | "project-scoped-wording" | "adjacent-not-direct" | "partial-support-only" | "exact-reviewed-metric-only" | "target-title-positioning-only")[];
    prohibitedInferenceCodes: ("target-title-as-employment" | "project-as-employment" | "responsibility-as-achievement" | "contribution-as-ownership" | "collaboration-as-management" | "technical-exposure-as-expertise" | "adjacent-technology-as-exact-experience" | "domain-adjacency-as-direct-experience" | "unsupported-seniority" | "unsupported-authority" | "unsupported-team-size" | "unsupported-geography" | "unsupported-scale" | "unsupported-adoption" | "unsupported-dates" | "unsupported-outcomes" | "unverified-metric")[];
    requirementId?: string | undefined;
}, {
    id: string;
    kind: "scope" | "target-title" | "requirement-claim" | "project-employment" | "metric";
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    evidenceIds: string[];
    allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
    prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
    state: "allowed" | "prohibited" | "allowed-with-qualifier" | "requires-caution";
    claimIds: string[];
    rationaleCode: "direct-reviewed-proof" | "qualified-partial-proof" | "deferred-or-ambiguous-proof" | "unsupported-or-conflicting-proof" | "target-title-not-history" | "project-scope-not-employment" | "metric-requires-verification" | "scope-limited-to-reviewed-evidence";
    requiredQualifierCodes: ("evidence-scoped-wording" | "project-scoped-wording" | "adjacent-not-direct" | "partial-support-only" | "exact-reviewed-metric-only" | "target-title-positioning-only")[];
    prohibitedInferenceCodes: ("target-title-as-employment" | "project-as-employment" | "responsibility-as-achievement" | "contribution-as-ownership" | "collaboration-as-management" | "technical-exposure-as-expertise" | "adjacent-technology-as-exact-experience" | "domain-adjacency-as-direct-experience" | "unsupported-seniority" | "unsupported-authority" | "unsupported-team-size" | "unsupported-geography" | "unsupported-scale" | "unsupported-adoption" | "unsupported-dates" | "unsupported-outcomes" | "unverified-metric")[];
    requirementId?: string | undefined;
}>;
export declare const JobMetricPermissionSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    evidenceId: z.ZodString;
    claimId: z.ZodString;
    state: z.ZodEnum<["allowed", "prohibited"]>;
    exactApprovedMetricText: z.ZodOptional<z.ZodString>;
    scope: z.ZodObject<{
        parentRoleId: z.ZodOptional<z.ZodString>;
        parentProjectId: z.ZodOptional<z.ZodString>;
        sourceSection: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
        sourceSection?: string | undefined;
    }, {
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
        sourceSection?: string | undefined;
    }>;
    qualifierCodes: z.ZodArray<z.ZodEnum<["use-exact-approved-text", "preserve-reviewed-scope", "do-not-round", "do-not-combine", "do-not-infer-scale"]>, "many">;
    allowedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageReferences: z.ZodArray<z.ZodObject<{
            coverageEntryId: z.ZodString;
            coverageEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }>, "many">;
        assessmentReferences: z.ZodArray<z.ZodObject<{
            assessmentEntryId: z.ZodString;
            assessmentEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }>, "many">;
        evidenceLinkReferences: z.ZodArray<z.ZodObject<{
            linkId: z.ZodString;
            linkSha256: z.ZodString;
            requirementId: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
            requirementProvenance: z.ZodObject<{
                requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                requirementModelSha256: z.ZodString;
                requirementId: z.ZodString;
                sourceTextSha256: z.ZodString;
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
            }, "strict", z.ZodTypeAny, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }>;
            evidenceProvenance: z.ZodObject<{
                evidenceId: z.ZodString;
                evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                evidenceItemSha256: z.ZodString;
                claimId: z.ZodString;
                claimPath: z.ZodEffects<z.ZodString, string, string>;
                claimSha256: z.ZodString;
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
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }>, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        planningPolicy: z.ZodObject<{
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
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }, {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }>;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    id: string;
    evidenceId: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    scope: {
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
        sourceSection?: string | undefined;
    };
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    state: "allowed" | "prohibited";
    qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
    exactApprovedMetricText?: string | undefined;
}, {
    claimId: string;
    id: string;
    evidenceId: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    scope: {
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
        sourceSection?: string | undefined;
    };
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    state: "allowed" | "prohibited";
    qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
    exactApprovedMetricText?: string | undefined;
}>, {
    claimId: string;
    id: string;
    evidenceId: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    scope: {
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
        sourceSection?: string | undefined;
    };
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    state: "allowed" | "prohibited";
    qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
    exactApprovedMetricText?: string | undefined;
}, {
    claimId: string;
    id: string;
    evidenceId: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    scope: {
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
        sourceSection?: string | undefined;
    };
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    state: "allowed" | "prohibited";
    qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
    exactApprovedMetricText?: string | undefined;
}>;
export declare const JobGapHandlingRuleSchema: z.ZodObject<{
    id: z.ZodString;
    requirementId: z.ZodString;
    assessmentState: z.ZodEnum<["strength", "supported", "partial", "gap", "contradiction", "indeterminate"]>;
    decision: z.ZodEnum<["exclude-positive-positioning", "defer", "supported-adjacent-claim", "drafting-caution"]>;
    adjacentEvidenceIds: z.ZodArray<z.ZodString, "many">;
    adjacentClaimIds: z.ZodArray<z.ZodString, "many">;
    constraintCodes: z.ZodArray<z.ZodEnum<["not-positive-positioning", "not-direct-satisfaction", "no-compensating-narrative", "no-gap-closing-advice", "no-application-advice"]>, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageReferences: z.ZodArray<z.ZodObject<{
            coverageEntryId: z.ZodString;
            coverageEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }>, "many">;
        assessmentReferences: z.ZodArray<z.ZodObject<{
            assessmentEntryId: z.ZodString;
            assessmentEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }>, "many">;
        evidenceLinkReferences: z.ZodArray<z.ZodObject<{
            linkId: z.ZodString;
            linkSha256: z.ZodString;
            requirementId: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
            requirementProvenance: z.ZodObject<{
                requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                requirementModelSha256: z.ZodString;
                requirementId: z.ZodString;
                sourceTextSha256: z.ZodString;
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
            }, "strict", z.ZodTypeAny, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }>;
            evidenceProvenance: z.ZodObject<{
                evidenceId: z.ZodString;
                evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                evidenceItemSha256: z.ZodString;
                claimId: z.ZodString;
                claimPath: z.ZodEffects<z.ZodString, string, string>;
                claimSha256: z.ZodString;
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
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }>, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        planningPolicy: z.ZodObject<{
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
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }, {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }>;
}, "strict", z.ZodTypeAny, {
    decision: "defer" | "exclude-positive-positioning" | "supported-adjacent-claim" | "drafting-caution";
    id: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    requirementId: string;
    assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
    adjacentEvidenceIds: string[];
    adjacentClaimIds: string[];
    constraintCodes: ("not-positive-positioning" | "not-direct-satisfaction" | "no-compensating-narrative" | "no-gap-closing-advice" | "no-application-advice")[];
}, {
    decision: "defer" | "exclude-positive-positioning" | "supported-adjacent-claim" | "drafting-caution";
    id: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    requirementId: string;
    assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
    adjacentEvidenceIds: string[];
    adjacentClaimIds: string[];
    constraintCodes: ("not-positive-positioning" | "not-direct-satisfaction" | "no-compensating-narrative" | "no-gap-closing-advice" | "no-application-advice")[];
}>;
export declare const JobResumeSectionPlanSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
    inclusion: z.ZodEnum<["include", "optional", "exclude"]>;
    order: z.ZodNumber;
    objectiveCode: z.ZodEnum<["position-target-without-history-claim", "summarize-selected-proof-themes", "group-job-relevant-capabilities", "surface-reviewed-outcomes", "organize-reviewed-employment-evidence", "organize-project-scoped-evidence", "group-reviewed-technical-capabilities", "group-reviewed-leadership-capabilities", "retain-relevant-education", "retain-relevant-certifications", "retain-approved-additional-information"]>;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    boundaryIds: z.ZodArray<z.ZodString, "many">;
    exclusionIds: z.ZodArray<z.ZodString, "many">;
    allowedContentTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    maximumItemCount: z.ZodOptional<z.ZodNumber>;
    riskCodes: z.ZodArray<z.ZodString, "many">;
    warningCodes: z.ZodArray<z.ZodString, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageReferences: z.ZodArray<z.ZodObject<{
            coverageEntryId: z.ZodString;
            coverageEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }>, "many">;
        assessmentReferences: z.ZodArray<z.ZodObject<{
            assessmentEntryId: z.ZodString;
            assessmentEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }>, "many">;
        evidenceLinkReferences: z.ZodArray<z.ZodObject<{
            linkId: z.ZodString;
            linkSha256: z.ZodString;
            requirementId: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
            requirementProvenance: z.ZodObject<{
                requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                requirementModelSha256: z.ZodString;
                requirementId: z.ZodString;
                sourceTextSha256: z.ZodString;
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
            }, "strict", z.ZodTypeAny, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }>;
            evidenceProvenance: z.ZodObject<{
                evidenceId: z.ZodString;
                evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                evidenceItemSha256: z.ZodString;
                claimId: z.ZodString;
                claimPath: z.ZodEffects<z.ZodString, string, string>;
                claimSha256: z.ZodString;
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
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }>, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        planningPolicy: z.ZodObject<{
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
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }, {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }>;
}, "strict", z.ZodTypeAny, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    id: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    evidenceIds: string[];
    requirementIds: string[];
    order: number;
    allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
    claimIds: string[];
    boundaryIds: string[];
    inclusion: "exclude" | "include" | "optional";
    objectiveCode: "position-target-without-history-claim" | "summarize-selected-proof-themes" | "group-job-relevant-capabilities" | "surface-reviewed-outcomes" | "organize-reviewed-employment-evidence" | "organize-project-scoped-evidence" | "group-reviewed-technical-capabilities" | "group-reviewed-leadership-capabilities" | "retain-relevant-education" | "retain-relevant-certifications" | "retain-approved-additional-information";
    exclusionIds: string[];
    riskCodes: string[];
    warningCodes: string[];
    maximumItemCount?: number | undefined;
}, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    id: string;
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    evidenceIds: string[];
    requirementIds: string[];
    order: number;
    allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
    claimIds: string[];
    boundaryIds: string[];
    inclusion: "exclude" | "include" | "optional";
    objectiveCode: "position-target-without-history-claim" | "summarize-selected-proof-themes" | "group-job-relevant-capabilities" | "surface-reviewed-outcomes" | "organize-reviewed-employment-evidence" | "organize-project-scoped-evidence" | "group-reviewed-technical-capabilities" | "group-reviewed-leadership-capabilities" | "retain-relevant-education" | "retain-relevant-certifications" | "retain-approved-additional-information";
    exclusionIds: string[];
    riskCodes: string[];
    warningCodes: string[];
    maximumItemCount?: number | undefined;
}>;
export declare const JobResumeContentExclusionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["unsupported-requirement", "contradicted-requirement", "indeterminate-requirement", "unverified-metric", "target-title-history", "project-as-employment", "non-resume-ready-evidence", "private-evidence", "unapproved-claim", "unsupported-terminology", "unsupported-seniority-or-scope", "irrelevant-evidence", "duplicate-evidence-use"]>;
    sourceType: z.ZodEnum<["requirement", "evidence", "claim", "target", "policy"]>;
    sourceIds: z.ZodArray<z.ZodString, "many">;
    reasonCode: z.ZodEnum<["no-reviewed-proof", "explicit-contradiction", "unresolved-ambiguity", "metric-not-verified", "target-title-is-not-history", "project-scope-is-not-employment", "evidence-not-eligible", "claim-not-eligible", "terminology-not-supported", "scope-not-supported", "not-selected-for-job-plan", "deduplicated-use"]>;
    severity: z.ZodEnum<["blocking", "high", "medium", "low"]>;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        coverageReferences: z.ZodArray<z.ZodObject<{
            coverageEntryId: z.ZodString;
            coverageEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }, {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }>, "many">;
        assessmentReferences: z.ZodArray<z.ZodObject<{
            assessmentEntryId: z.ZodString;
            assessmentEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }, {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }>, "many">;
        evidenceLinkReferences: z.ZodArray<z.ZodObject<{
            linkId: z.ZodString;
            linkSha256: z.ZodString;
            requirementId: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
            requirementProvenance: z.ZodObject<{
                requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                requirementModelSha256: z.ZodString;
                requirementId: z.ZodString;
                sourceTextSha256: z.ZodString;
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
            }, "strict", z.ZodTypeAny, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }, {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            }>;
            evidenceProvenance: z.ZodObject<{
                evidenceId: z.ZodString;
                evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                evidenceItemSha256: z.ZodString;
                claimId: z.ZodString;
                claimPath: z.ZodEffects<z.ZodString, string, string>;
                claimSha256: z.ZodString;
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
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            }>;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }>, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        planningPolicy: z.ZodObject<{
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
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }, {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    }>;
}, "strict", z.ZodTypeAny, {
    type: "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement" | "project-as-employment" | "unverified-metric" | "target-title-history" | "non-resume-ready-evidence" | "private-evidence" | "unapproved-claim" | "unsupported-terminology" | "unsupported-seniority-or-scope" | "irrelevant-evidence" | "duplicate-evidence-use";
    id: string;
    sourceType: "claim" | "target" | "evidence" | "policy" | "requirement";
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    sourceIds: string[];
    severity: "high" | "medium" | "low" | "blocking";
    reasonCode: "no-reviewed-proof" | "explicit-contradiction" | "unresolved-ambiguity" | "metric-not-verified" | "target-title-is-not-history" | "project-scope-is-not-employment" | "evidence-not-eligible" | "claim-not-eligible" | "terminology-not-supported" | "scope-not-supported" | "not-selected-for-job-plan" | "deduplicated-use";
}, {
    type: "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement" | "project-as-employment" | "unverified-metric" | "target-title-history" | "non-resume-ready-evidence" | "private-evidence" | "unapproved-claim" | "unsupported-terminology" | "unsupported-seniority-or-scope" | "irrelevant-evidence" | "duplicate-evidence-use";
    id: string;
    sourceType: "claim" | "target" | "evidence" | "policy" | "requirement";
    provenance: {
        targetId: string;
        evidenceIds: string[];
        requirementIds: string[];
        planningPolicy: {
            name: string;
            version: string;
        };
        coverageReferences: {
            coverageEntryId: string;
            coverageEntrySha256: string;
        }[];
        assessmentReferences: {
            assessmentEntryId: string;
            assessmentEntrySha256: string;
        }[];
        evidenceLinkReferences: {
            claimId: string;
            evidenceId: string;
            evidenceProvenance: {
                claimId: string;
                evidenceId: string;
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
                evidenceItemPath: string;
                evidenceItemSha256: string;
                claimPath: string;
                claimSha256: string;
            };
            requirementId: string;
            relationship: "partial" | "direct" | "supporting";
            requirementProvenance: {
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
                requirementId: string;
                requirementModelType: "approved" | "deterministic";
                requirementModelPath: string;
                requirementModelSha256: string;
                sourceTextSha256: string;
            };
            linkId: string;
            linkSha256: string;
        }[];
        claimIds: string[];
    };
    sourceIds: string[];
    severity: "high" | "medium" | "low" | "blocking";
    reasonCode: "no-reviewed-proof" | "explicit-contradiction" | "unresolved-ambiguity" | "metric-not-verified" | "target-title-is-not-history" | "project-scope-is-not-employment" | "evidence-not-eligible" | "claim-not-eligible" | "terminology-not-supported" | "scope-not-supported" | "not-selected-for-job-plan" | "deduplicated-use";
}>;
export declare const JobResumePlanningRiskSchema: z.ZodObject<{
    requirementIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodEnum<["MANDATORY_REQUIREMENT_NOT_POSITIONABLE", "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK", "TARGET_TITLE_HISTORY_RISK", "PROJECT_AS_EMPLOYMENT_RISK", "RESPONSIBILITY_AS_ACHIEVEMENT_RISK", "UNSUPPORTED_METRIC_RISK", "UNSUPPORTED_SCOPE_RISK", "UNSUPPORTED_SENIORITY_RISK", "EVIDENCE_OVERUSE_RISK", "REQUIREMENT_TERMINOLOGY_MISMATCH", "DEPENDENCY_STALE", "PROVENANCE_INCOMPLETE"]>;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: "PROVENANCE_INCOMPLETE" | "MANDATORY_REQUIREMENT_NOT_POSITIONABLE" | "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK" | "TARGET_TITLE_HISTORY_RISK" | "PROJECT_AS_EMPLOYMENT_RISK" | "RESPONSIBILITY_AS_ACHIEVEMENT_RISK" | "UNSUPPORTED_METRIC_RISK" | "UNSUPPORTED_SCOPE_RISK" | "UNSUPPORTED_SENIORITY_RISK" | "EVIDENCE_OVERUSE_RISK" | "REQUIREMENT_TERMINOLOGY_MISMATCH" | "DEPENDENCY_STALE";
    message: string;
    id: string;
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
    requirementIds: string[];
    claimIds: string[];
}, {
    code: "PROVENANCE_INCOMPLETE" | "MANDATORY_REQUIREMENT_NOT_POSITIONABLE" | "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK" | "TARGET_TITLE_HISTORY_RISK" | "PROJECT_AS_EMPLOYMENT_RISK" | "RESPONSIBILITY_AS_ACHIEVEMENT_RISK" | "UNSUPPORTED_METRIC_RISK" | "UNSUPPORTED_SCOPE_RISK" | "UNSUPPORTED_SENIORITY_RISK" | "EVIDENCE_OVERUSE_RISK" | "REQUIREMENT_TERMINOLOGY_MISMATCH" | "DEPENDENCY_STALE";
    message: string;
    id: string;
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
    requirementIds: string[];
    claimIds: string[];
}>;
export declare const JobResumePlanningWarningSchema: z.ZodObject<{
    requirementIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodEnum<["JOB_SPECIFIC_PLAN_ONLY", "NOT_A_RESUME", "NO_APPLICATION_RECOMMENDATION", "NO_ATS_SCORE", "REVIEWED_EVIDENCE_ONLY", "MATERIAL_GAP_EXCLUDED", "NO_VERIFIED_METRIC_AVAILABLE", "OPTIONAL_ESCALATION_NOT_PERFORMED"]>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "JOB_SPECIFIC_PLAN_ONLY" | "NOT_A_RESUME" | "NO_ATS_SCORE" | "MATERIAL_GAP_EXCLUDED" | "NO_VERIFIED_METRIC_AVAILABLE" | "OPTIONAL_ESCALATION_NOT_PERFORMED";
    message: string;
    id: string;
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
}, {
    code: "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "JOB_SPECIFIC_PLAN_ONLY" | "NOT_A_RESUME" | "NO_ATS_SCORE" | "MATERIAL_GAP_EXCLUDED" | "NO_VERIFIED_METRIC_AVAILABLE" | "OPTIONAL_ESCALATION_NOT_PERFORMED";
    message: string;
    id: string;
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
}>;
export declare const JobResumePlanningAmbiguitySchema: z.ZodObject<{
    requirementIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    claimIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodEnum<["REQUIREMENT_POSITIONING_DEFERRED", "ADJACENT_EVIDENCE_NOT_DIRECT", "PROJECT_EMPLOYMENT_BOUNDARY", "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY", "TERMINOLOGY_USE_UNCLEAR", "EVIDENCE_REUSE_BOUNDARY", "UPSTREAM_AMBIGUITY_PRESERVED"]>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: "REQUIREMENT_POSITIONING_DEFERRED" | "ADJACENT_EVIDENCE_NOT_DIRECT" | "PROJECT_EMPLOYMENT_BOUNDARY" | "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY" | "TERMINOLOGY_USE_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY" | "UPSTREAM_AMBIGUITY_PRESERVED";
    message: string;
    id: string;
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
}, {
    code: "REQUIREMENT_POSITIONING_DEFERRED" | "ADJACENT_EVIDENCE_NOT_DIRECT" | "PROJECT_EMPLOYMENT_BOUNDARY" | "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY" | "TERMINOLOGY_USE_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY" | "UPSTREAM_AMBIGUITY_PRESERVED";
    message: string;
    id: string;
    evidenceIds: string[];
    requirementIds: string[];
    claimIds: string[];
}>;
export declare const JobResumePlanCompletenessSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodEnum<["empty", "partial", "complete"]>;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    plannedRequirementIds: z.ZodArray<z.ZodString, "many">;
    selectedRequirementIds: z.ZodArray<z.ZodString, "many">;
    deferredRequirementIds: z.ZodArray<z.ZodString, "many">;
    excludedRequirementIds: z.ZodArray<z.ZodString, "many">;
    includedSectionTypes: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
    claimBoundariesComplete: z.ZodBoolean;
    provenanceComplete: z.ZodBoolean;
    criticalConstraintsRepresented: z.ZodBoolean;
    usableForDrafting: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    requirementIds: string[];
    claimBoundariesComplete: boolean;
    provenanceComplete: boolean;
    plannedRequirementIds: string[];
    selectedRequirementIds: string[];
    deferredRequirementIds: string[];
    excludedRequirementIds: string[];
    includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    criticalConstraintsRepresented: boolean;
    usableForDrafting: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    requirementIds: string[];
    claimBoundariesComplete: boolean;
    provenanceComplete: boolean;
    plannedRequirementIds: string[];
    selectedRequirementIds: string[];
    deferredRequirementIds: string[];
    excludedRequirementIds: string[];
    includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    criticalConstraintsRepresented: boolean;
    usableForDrafting: boolean;
}>, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    requirementIds: string[];
    claimBoundariesComplete: boolean;
    provenanceComplete: boolean;
    plannedRequirementIds: string[];
    selectedRequirementIds: string[];
    deferredRequirementIds: string[];
    excludedRequirementIds: string[];
    includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    criticalConstraintsRepresented: boolean;
    usableForDrafting: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    requirementIds: string[];
    claimBoundariesComplete: boolean;
    provenanceComplete: boolean;
    plannedRequirementIds: string[];
    selectedRequirementIds: string[];
    deferredRequirementIds: string[];
    excludedRequirementIds: string[];
    includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    criticalConstraintsRepresented: boolean;
    usableForDrafting: boolean;
}>;
export declare const JobResumeContentPlanSchema: z.ZodEffects<z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    mode: z.ZodLiteral<"job-specific-resume">;
    policy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodLiteral<"deterministic">;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "deterministic";
    }, {
        name: string;
        version: string;
        mode: "deterministic";
    }>;
    input: z.ZodObject<{
        target: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        jobDescription: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
        requirementModel: z.ZodObject<{
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
        evidenceMap: z.ZodObject<{
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
        coverage: z.ZodObject<{
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
        assessment: z.ZodObject<{
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
        sources: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        evidenceItems: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        claims: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        selectedEvidenceSetSha256: z.ZodString;
        selectedClaimSetSha256: z.ZodString;
        normalizedInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sources: {
            sha256: string;
            path: string;
        };
        coverage: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        evidenceItems: {
            sha256: string;
            path: string;
        };
        assessment: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        claims: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
    }, {
        sources: {
            sha256: string;
            path: string;
        };
        coverage: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        evidenceItems: {
            sha256: string;
            path: string;
        };
        assessment: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        claims: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
    }>;
    positioning: z.ZodObject<{
        state: z.ZodEnum<["direct", "adjacent", "stretch", "insufficient-proof", "indeterminate"]>;
        sourceOverallAssessment: z.ZodEnum<["strong", "credible", "mixed", "limited", "insufficient", "indeterminate"]>;
        targetTitle: z.ZodString;
        targetTitleUse: z.ZodLiteral<"positioning-only">;
        primaryRequirementIds: z.ZodArray<z.ZodString, "many">;
        supportingRequirementIds: z.ZodArray<z.ZodString, "many">;
        cautionRequirementIds: z.ZodArray<z.ZodString, "many">;
        rationaleCode: z.ZodEnum<["strong-reviewed-proof", "credible-reviewed-proof", "mixed-reviewed-proof", "limited-reviewed-proof", "insufficient-reviewed-proof", "indeterminate-reviewed-proof"]>;
        prohibitedUses: z.ZodArray<z.ZodEnum<["employment-history", "seniority-proof", "authority-proof", "scope-proof"]>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageReferences: z.ZodArray<z.ZodObject<{
                coverageEntryId: z.ZodString;
                coverageEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }>, "many">;
            assessmentReferences: z.ZodArray<z.ZodObject<{
                assessmentEntryId: z.ZodString;
                assessmentEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }>, "many">;
            evidenceLinkReferences: z.ZodArray<z.ZodObject<{
                linkId: z.ZodString;
                linkSha256: z.ZodString;
                requirementId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
                requirementProvenance: z.ZodObject<{
                    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                    requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                    requirementModelSha256: z.ZodString;
                    requirementId: z.ZodString;
                    sourceTextSha256: z.ZodString;
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
                }, "strict", z.ZodTypeAny, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }>;
                evidenceProvenance: z.ZodObject<{
                    evidenceId: z.ZodString;
                    evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                    evidenceItemSha256: z.ZodString;
                    claimId: z.ZodString;
                    claimPath: z.ZodEffects<z.ZodString, string, string>;
                    claimSha256: z.ZodString;
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
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }, {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }>;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }>, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            planningPolicy: z.ZodObject<{
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
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }, {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }>;
    }, "strict", z.ZodTypeAny, {
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        prohibitedUses: ("employment-history" | "seniority-proof" | "authority-proof" | "scope-proof")[];
        state: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
        sourceOverallAssessment: "strong" | "limited" | "insufficient" | "mixed" | "indeterminate" | "credible";
        targetTitle: string;
        targetTitleUse: "positioning-only";
        primaryRequirementIds: string[];
        supportingRequirementIds: string[];
        cautionRequirementIds: string[];
        rationaleCode: "strong-reviewed-proof" | "credible-reviewed-proof" | "mixed-reviewed-proof" | "limited-reviewed-proof" | "insufficient-reviewed-proof" | "indeterminate-reviewed-proof";
    }, {
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        prohibitedUses: ("employment-history" | "seniority-proof" | "authority-proof" | "scope-proof")[];
        state: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
        sourceOverallAssessment: "strong" | "limited" | "insufficient" | "mixed" | "indeterminate" | "credible";
        targetTitle: string;
        targetTitleUse: "positioning-only";
        primaryRequirementIds: string[];
        supportingRequirementIds: string[];
        cautionRequirementIds: string[];
        rationaleCode: "strong-reviewed-proof" | "credible-reviewed-proof" | "mixed-reviewed-proof" | "limited-reviewed-proof" | "insufficient-reviewed-proof" | "indeterminate-reviewed-proof";
    }>;
    requirementEmphasis: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        requirementId: z.ZodString;
        category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
        necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
        assessmentState: z.ZodEnum<["strength", "supported", "partial", "gap", "contradiction", "indeterminate"]>;
        coverageState: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
        proofStrength: z.ZodEnum<["strong", "adequate", "limited", "unavailable", "conflicting"]>;
        materiality: z.ZodEnum<["critical", "material", "secondary", "contextual", "unknown"]>;
        decision: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
        selectedLinkIds: z.ZodArray<z.ZodString, "many">;
        selectedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        selectedClaimIds: z.ZodArray<z.ZodString, "many">;
        allowedTerminology: z.ZodArray<z.ZodString, "many">;
        allowedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
        rationaleCode: z.ZodEnum<["mandatory-strong-support", "mandatory-defensible-support", "preferred-defensible-support", "contextual-defensible-support", "mandatory-partial-support", "nonmandatory-partial-support", "unsupported-requirement", "contradicted-requirement", "indeterminate-requirement"]>;
        cautionCodes: z.ZodArray<z.ZodEnum<["do-not-overstate-partial-proof", "do-not-present-gap-as-strength", "do-not-use-adjacent-proof-as-direct", "do-not-hide-contradiction", "preserve-ambiguity"]>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageReferences: z.ZodArray<z.ZodObject<{
                coverageEntryId: z.ZodString;
                coverageEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }>, "many">;
            assessmentReferences: z.ZodArray<z.ZodObject<{
                assessmentEntryId: z.ZodString;
                assessmentEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }>, "many">;
            evidenceLinkReferences: z.ZodArray<z.ZodObject<{
                linkId: z.ZodString;
                linkSha256: z.ZodString;
                requirementId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
                requirementProvenance: z.ZodObject<{
                    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                    requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                    requirementModelSha256: z.ZodString;
                    requirementId: z.ZodString;
                    sourceTextSha256: z.ZodString;
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
                }, "strict", z.ZodTypeAny, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }>;
                evidenceProvenance: z.ZodObject<{
                    evidenceId: z.ZodString;
                    evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                    evidenceItemSha256: z.ZodString;
                    claimId: z.ZodString;
                    claimPath: z.ZodEffects<z.ZodString, string, string>;
                    claimSha256: z.ZodString;
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
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }, {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }>;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }>, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            planningPolicy: z.ZodObject<{
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
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }, {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }>;
    }, "strict", z.ZodTypeAny, {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
        requirementId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
        selectedLinkIds: string[];
        selectedEvidenceIds: string[];
        selectedClaimIds: string[];
        allowedTerminology: string[];
        cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
    }, {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
        requirementId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
        selectedLinkIds: string[];
        selectedEvidenceIds: string[];
        selectedClaimIds: string[];
        allowedTerminology: string[];
        cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
    }>, {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
        requirementId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
        selectedLinkIds: string[];
        selectedEvidenceIds: string[];
        selectedClaimIds: string[];
        allowedTerminology: string[];
        cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
    }, {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
        requirementId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
        selectedLinkIds: string[];
        selectedEvidenceIds: string[];
        selectedClaimIds: string[];
        allowedTerminology: string[];
        cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
    }>, "many">;
    evidenceSelections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        evidenceId: z.ZodString;
        claimIds: z.ZodArray<z.ZodString, "many">;
        decision: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
        relationships: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial"]>, "many">;
        requirementUses: z.ZodArray<z.ZodObject<{
            requirementId: z.ZodString;
            linkIds: z.ZodArray<z.ZodString, "many">;
            decision: z.ZodEnum<["primary", "secondary", "supporting", "defer", "exclude"]>;
            intendedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
            purposeCode: z.ZodEnum<["primary-requirement-proof", "secondary-requirement-proof", "supporting-context", "deferred-proof", "excluded-proof"]>;
        }, "strict", z.ZodTypeAny, {
            decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
            requirementId: string;
            linkIds: string[];
            intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
        }, {
            decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
            requirementId: string;
            linkIds: string[];
            intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
        }>, "many">;
        intendedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
        primaryRequirementId: z.ZodOptional<z.ZodString>;
        reuseWarning: z.ZodBoolean;
        boundaryIds: z.ZodArray<z.ZodString, "many">;
        limitationCodes: z.ZodArray<z.ZodEnum<["partial-relationship", "supporting-relationship-only", "limited-proof", "project-scoped", "historical-scope-only", "no-verified-metric", "multiple-section-reuse"]>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageReferences: z.ZodArray<z.ZodObject<{
                coverageEntryId: z.ZodString;
                coverageEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }>, "many">;
            assessmentReferences: z.ZodArray<z.ZodObject<{
                assessmentEntryId: z.ZodString;
                assessmentEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }>, "many">;
            evidenceLinkReferences: z.ZodArray<z.ZodObject<{
                linkId: z.ZodString;
                linkSha256: z.ZodString;
                requirementId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
                requirementProvenance: z.ZodObject<{
                    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                    requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                    requirementModelSha256: z.ZodString;
                    requirementId: z.ZodString;
                    sourceTextSha256: z.ZodString;
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
                }, "strict", z.ZodTypeAny, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }>;
                evidenceProvenance: z.ZodObject<{
                    evidenceId: z.ZodString;
                    evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                    evidenceItemSha256: z.ZodString;
                    claimId: z.ZodString;
                    claimPath: z.ZodEffects<z.ZodString, string, string>;
                    claimSha256: z.ZodString;
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
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }, {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }>;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }>, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            planningPolicy: z.ZodObject<{
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
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }, {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }>;
    }, "strict", z.ZodTypeAny, {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        relationships: ("partial" | "direct" | "supporting")[];
        claimIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        requirementUses: {
            decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
            requirementId: string;
            linkIds: string[];
            intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
        }[];
        reuseWarning: boolean;
        boundaryIds: string[];
        limitationCodes: ("partial-relationship" | "supporting-relationship-only" | "limited-proof" | "project-scoped" | "historical-scope-only" | "no-verified-metric" | "multiple-section-reuse")[];
        primaryRequirementId?: string | undefined;
    }, {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        relationships: ("partial" | "direct" | "supporting")[];
        claimIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        requirementUses: {
            decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
            requirementId: string;
            linkIds: string[];
            intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
        }[];
        reuseWarning: boolean;
        boundaryIds: string[];
        limitationCodes: ("partial-relationship" | "supporting-relationship-only" | "limited-proof" | "project-scoped" | "historical-scope-only" | "no-verified-metric" | "multiple-section-reuse")[];
        primaryRequirementId?: string | undefined;
    }>, "many">;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        inclusion: z.ZodEnum<["include", "optional", "exclude"]>;
        order: z.ZodNumber;
        objectiveCode: z.ZodEnum<["position-target-without-history-claim", "summarize-selected-proof-themes", "group-job-relevant-capabilities", "surface-reviewed-outcomes", "organize-reviewed-employment-evidence", "organize-project-scoped-evidence", "group-reviewed-technical-capabilities", "group-reviewed-leadership-capabilities", "retain-relevant-education", "retain-relevant-certifications", "retain-approved-additional-information"]>;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        boundaryIds: z.ZodArray<z.ZodString, "many">;
        exclusionIds: z.ZodArray<z.ZodString, "many">;
        allowedContentTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        maximumItemCount: z.ZodOptional<z.ZodNumber>;
        riskCodes: z.ZodArray<z.ZodString, "many">;
        warningCodes: z.ZodArray<z.ZodString, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageReferences: z.ZodArray<z.ZodObject<{
                coverageEntryId: z.ZodString;
                coverageEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }>, "many">;
            assessmentReferences: z.ZodArray<z.ZodObject<{
                assessmentEntryId: z.ZodString;
                assessmentEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }>, "many">;
            evidenceLinkReferences: z.ZodArray<z.ZodObject<{
                linkId: z.ZodString;
                linkSha256: z.ZodString;
                requirementId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
                requirementProvenance: z.ZodObject<{
                    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                    requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                    requirementModelSha256: z.ZodString;
                    requirementId: z.ZodString;
                    sourceTextSha256: z.ZodString;
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
                }, "strict", z.ZodTypeAny, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }>;
                evidenceProvenance: z.ZodObject<{
                    evidenceId: z.ZodString;
                    evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                    evidenceItemSha256: z.ZodString;
                    claimId: z.ZodString;
                    claimPath: z.ZodEffects<z.ZodString, string, string>;
                    claimSha256: z.ZodString;
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
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }, {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }>;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }>, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            planningPolicy: z.ZodObject<{
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
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }, {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }>;
    }, "strict", z.ZodTypeAny, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        requirementIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        claimIds: string[];
        boundaryIds: string[];
        inclusion: "exclude" | "include" | "optional";
        objectiveCode: "position-target-without-history-claim" | "summarize-selected-proof-themes" | "group-job-relevant-capabilities" | "surface-reviewed-outcomes" | "organize-reviewed-employment-evidence" | "organize-project-scoped-evidence" | "group-reviewed-technical-capabilities" | "group-reviewed-leadership-capabilities" | "retain-relevant-education" | "retain-relevant-certifications" | "retain-approved-additional-information";
        exclusionIds: string[];
        riskCodes: string[];
        warningCodes: string[];
        maximumItemCount?: number | undefined;
    }, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        requirementIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        claimIds: string[];
        boundaryIds: string[];
        inclusion: "exclude" | "include" | "optional";
        objectiveCode: "position-target-without-history-claim" | "summarize-selected-proof-themes" | "group-job-relevant-capabilities" | "surface-reviewed-outcomes" | "organize-reviewed-employment-evidence" | "organize-project-scoped-evidence" | "group-reviewed-technical-capabilities" | "group-reviewed-leadership-capabilities" | "retain-relevant-education" | "retain-relevant-certifications" | "retain-approved-additional-information";
        exclusionIds: string[];
        riskCodes: string[];
        warningCodes: string[];
        maximumItemCount?: number | undefined;
    }>, "many">;
    claimBoundaries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["requirement-claim", "target-title", "project-employment", "metric", "scope"]>;
        requirementId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        state: z.ZodEnum<["allowed", "allowed-with-qualifier", "requires-caution", "prohibited"]>;
        allowedClaimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        prohibitedClaimTypes: z.ZodArray<z.ZodEnum<["target-title", "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        requiredQualifierCodes: z.ZodArray<z.ZodEnum<["evidence-scoped-wording", "project-scoped-wording", "adjacent-not-direct", "partial-support-only", "exact-reviewed-metric-only", "target-title-positioning-only"]>, "many">;
        prohibitedInferenceCodes: z.ZodArray<z.ZodEnum<["target-title-as-employment", "project-as-employment", "responsibility-as-achievement", "contribution-as-ownership", "collaboration-as-management", "technical-exposure-as-expertise", "adjacent-technology-as-exact-experience", "domain-adjacency-as-direct-experience", "unsupported-seniority", "unsupported-authority", "unsupported-team-size", "unsupported-geography", "unsupported-scale", "unsupported-adoption", "unsupported-dates", "unsupported-outcomes", "unverified-metric"]>, "many">;
        rationaleCode: z.ZodEnum<["direct-reviewed-proof", "qualified-partial-proof", "deferred-or-ambiguous-proof", "unsupported-or-conflicting-proof", "target-title-not-history", "project-scope-not-employment", "metric-requires-verification", "scope-limited-to-reviewed-evidence"]>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageReferences: z.ZodArray<z.ZodObject<{
                coverageEntryId: z.ZodString;
                coverageEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }>, "many">;
            assessmentReferences: z.ZodArray<z.ZodObject<{
                assessmentEntryId: z.ZodString;
                assessmentEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }>, "many">;
            evidenceLinkReferences: z.ZodArray<z.ZodObject<{
                linkId: z.ZodString;
                linkSha256: z.ZodString;
                requirementId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
                requirementProvenance: z.ZodObject<{
                    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                    requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                    requirementModelSha256: z.ZodString;
                    requirementId: z.ZodString;
                    sourceTextSha256: z.ZodString;
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
                }, "strict", z.ZodTypeAny, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }>;
                evidenceProvenance: z.ZodObject<{
                    evidenceId: z.ZodString;
                    evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                    evidenceItemSha256: z.ZodString;
                    claimId: z.ZodString;
                    claimPath: z.ZodEffects<z.ZodString, string, string>;
                    claimSha256: z.ZodString;
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
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }, {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }>;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }>, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            planningPolicy: z.ZodObject<{
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
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }, {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        kind: "scope" | "target-title" | "requirement-claim" | "project-employment" | "metric";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        state: "allowed" | "prohibited" | "allowed-with-qualifier" | "requires-caution";
        claimIds: string[];
        rationaleCode: "direct-reviewed-proof" | "qualified-partial-proof" | "deferred-or-ambiguous-proof" | "unsupported-or-conflicting-proof" | "target-title-not-history" | "project-scope-not-employment" | "metric-requires-verification" | "scope-limited-to-reviewed-evidence";
        requiredQualifierCodes: ("evidence-scoped-wording" | "project-scoped-wording" | "adjacent-not-direct" | "partial-support-only" | "exact-reviewed-metric-only" | "target-title-positioning-only")[];
        prohibitedInferenceCodes: ("target-title-as-employment" | "project-as-employment" | "responsibility-as-achievement" | "contribution-as-ownership" | "collaboration-as-management" | "technical-exposure-as-expertise" | "adjacent-technology-as-exact-experience" | "domain-adjacency-as-direct-experience" | "unsupported-seniority" | "unsupported-authority" | "unsupported-team-size" | "unsupported-geography" | "unsupported-scale" | "unsupported-adoption" | "unsupported-dates" | "unsupported-outcomes" | "unverified-metric")[];
        requirementId?: string | undefined;
    }, {
        id: string;
        kind: "scope" | "target-title" | "requirement-claim" | "project-employment" | "metric";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        state: "allowed" | "prohibited" | "allowed-with-qualifier" | "requires-caution";
        claimIds: string[];
        rationaleCode: "direct-reviewed-proof" | "qualified-partial-proof" | "deferred-or-ambiguous-proof" | "unsupported-or-conflicting-proof" | "target-title-not-history" | "project-scope-not-employment" | "metric-requires-verification" | "scope-limited-to-reviewed-evidence";
        requiredQualifierCodes: ("evidence-scoped-wording" | "project-scoped-wording" | "adjacent-not-direct" | "partial-support-only" | "exact-reviewed-metric-only" | "target-title-positioning-only")[];
        prohibitedInferenceCodes: ("target-title-as-employment" | "project-as-employment" | "responsibility-as-achievement" | "contribution-as-ownership" | "collaboration-as-management" | "technical-exposure-as-expertise" | "adjacent-technology-as-exact-experience" | "domain-adjacency-as-direct-experience" | "unsupported-seniority" | "unsupported-authority" | "unsupported-team-size" | "unsupported-geography" | "unsupported-scale" | "unsupported-adoption" | "unsupported-dates" | "unsupported-outcomes" | "unverified-metric")[];
        requirementId?: string | undefined;
    }>, "many">;
    metricPermissions: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        evidenceId: z.ZodString;
        claimId: z.ZodString;
        state: z.ZodEnum<["allowed", "prohibited"]>;
        exactApprovedMetricText: z.ZodOptional<z.ZodString>;
        scope: z.ZodObject<{
            parentRoleId: z.ZodOptional<z.ZodString>;
            parentProjectId: z.ZodOptional<z.ZodString>;
            sourceSection: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        }, {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        }>;
        qualifierCodes: z.ZodArray<z.ZodEnum<["use-exact-approved-text", "preserve-reviewed-scope", "do-not-round", "do-not-combine", "do-not-infer-scale"]>, "many">;
        allowedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageReferences: z.ZodArray<z.ZodObject<{
                coverageEntryId: z.ZodString;
                coverageEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }>, "many">;
            assessmentReferences: z.ZodArray<z.ZodObject<{
                assessmentEntryId: z.ZodString;
                assessmentEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }>, "many">;
            evidenceLinkReferences: z.ZodArray<z.ZodObject<{
                linkId: z.ZodString;
                linkSha256: z.ZodString;
                requirementId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
                requirementProvenance: z.ZodObject<{
                    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                    requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                    requirementModelSha256: z.ZodString;
                    requirementId: z.ZodString;
                    sourceTextSha256: z.ZodString;
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
                }, "strict", z.ZodTypeAny, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }>;
                evidenceProvenance: z.ZodObject<{
                    evidenceId: z.ZodString;
                    evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                    evidenceItemSha256: z.ZodString;
                    claimId: z.ZodString;
                    claimPath: z.ZodEffects<z.ZodString, string, string>;
                    claimSha256: z.ZodString;
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
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }, {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }>;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }>, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            planningPolicy: z.ZodObject<{
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
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }, {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }>;
    }, "strict", z.ZodTypeAny, {
        claimId: string;
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        scope: {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        };
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        state: "allowed" | "prohibited";
        qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
        exactApprovedMetricText?: string | undefined;
    }, {
        claimId: string;
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        scope: {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        };
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        state: "allowed" | "prohibited";
        qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
        exactApprovedMetricText?: string | undefined;
    }>, {
        claimId: string;
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        scope: {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        };
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        state: "allowed" | "prohibited";
        qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
        exactApprovedMetricText?: string | undefined;
    }, {
        claimId: string;
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        scope: {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        };
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        state: "allowed" | "prohibited";
        qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
        exactApprovedMetricText?: string | undefined;
    }>, "many">;
    gapHandling: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        requirementId: z.ZodString;
        assessmentState: z.ZodEnum<["strength", "supported", "partial", "gap", "contradiction", "indeterminate"]>;
        decision: z.ZodEnum<["exclude-positive-positioning", "defer", "supported-adjacent-claim", "drafting-caution"]>;
        adjacentEvidenceIds: z.ZodArray<z.ZodString, "many">;
        adjacentClaimIds: z.ZodArray<z.ZodString, "many">;
        constraintCodes: z.ZodArray<z.ZodEnum<["not-positive-positioning", "not-direct-satisfaction", "no-compensating-narrative", "no-gap-closing-advice", "no-application-advice"]>, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageReferences: z.ZodArray<z.ZodObject<{
                coverageEntryId: z.ZodString;
                coverageEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }>, "many">;
            assessmentReferences: z.ZodArray<z.ZodObject<{
                assessmentEntryId: z.ZodString;
                assessmentEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }>, "many">;
            evidenceLinkReferences: z.ZodArray<z.ZodObject<{
                linkId: z.ZodString;
                linkSha256: z.ZodString;
                requirementId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
                requirementProvenance: z.ZodObject<{
                    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                    requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                    requirementModelSha256: z.ZodString;
                    requirementId: z.ZodString;
                    sourceTextSha256: z.ZodString;
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
                }, "strict", z.ZodTypeAny, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }>;
                evidenceProvenance: z.ZodObject<{
                    evidenceId: z.ZodString;
                    evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                    evidenceItemSha256: z.ZodString;
                    claimId: z.ZodString;
                    claimPath: z.ZodEffects<z.ZodString, string, string>;
                    claimSha256: z.ZodString;
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
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }, {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }>;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }>, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            planningPolicy: z.ZodObject<{
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
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }, {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }>;
    }, "strict", z.ZodTypeAny, {
        decision: "defer" | "exclude-positive-positioning" | "supported-adjacent-claim" | "drafting-caution";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        requirementId: string;
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        adjacentEvidenceIds: string[];
        adjacentClaimIds: string[];
        constraintCodes: ("not-positive-positioning" | "not-direct-satisfaction" | "no-compensating-narrative" | "no-gap-closing-advice" | "no-application-advice")[];
    }, {
        decision: "defer" | "exclude-positive-positioning" | "supported-adjacent-claim" | "drafting-caution";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        requirementId: string;
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        adjacentEvidenceIds: string[];
        adjacentClaimIds: string[];
        constraintCodes: ("not-positive-positioning" | "not-direct-satisfaction" | "no-compensating-narrative" | "no-gap-closing-advice" | "no-application-advice")[];
    }>, "many">;
    exclusions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["unsupported-requirement", "contradicted-requirement", "indeterminate-requirement", "unverified-metric", "target-title-history", "project-as-employment", "non-resume-ready-evidence", "private-evidence", "unapproved-claim", "unsupported-terminology", "unsupported-seniority-or-scope", "irrelevant-evidence", "duplicate-evidence-use"]>;
        sourceType: z.ZodEnum<["requirement", "evidence", "claim", "target", "policy"]>;
        sourceIds: z.ZodArray<z.ZodString, "many">;
        reasonCode: z.ZodEnum<["no-reviewed-proof", "explicit-contradiction", "unresolved-ambiguity", "metric-not-verified", "target-title-is-not-history", "project-scope-is-not-employment", "evidence-not-eligible", "claim-not-eligible", "terminology-not-supported", "scope-not-supported", "not-selected-for-job-plan", "deduplicated-use"]>;
        severity: z.ZodEnum<["blocking", "high", "medium", "low"]>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            requirementIds: z.ZodArray<z.ZodString, "many">;
            coverageReferences: z.ZodArray<z.ZodObject<{
                coverageEntryId: z.ZodString;
                coverageEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }, {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }>, "many">;
            assessmentReferences: z.ZodArray<z.ZodObject<{
                assessmentEntryId: z.ZodString;
                assessmentEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }, {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }>, "many">;
            evidenceLinkReferences: z.ZodArray<z.ZodObject<{
                linkId: z.ZodString;
                linkSha256: z.ZodString;
                requirementId: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
                requirementProvenance: z.ZodObject<{
                    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
                    requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
                    requirementModelSha256: z.ZodString;
                    requirementId: z.ZodString;
                    sourceTextSha256: z.ZodString;
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
                }, "strict", z.ZodTypeAny, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }, {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                }>;
                evidenceProvenance: z.ZodObject<{
                    evidenceId: z.ZodString;
                    evidenceItemPath: z.ZodEffects<z.ZodString, string, string>;
                    evidenceItemSha256: z.ZodString;
                    claimId: z.ZodString;
                    claimPath: z.ZodEffects<z.ZodString, string, string>;
                    claimSha256: z.ZodString;
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
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }, {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                }>;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }>, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            claimIds: z.ZodArray<z.ZodString, "many">;
            planningPolicy: z.ZodObject<{
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
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }, {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        }>;
    }, "strict", z.ZodTypeAny, {
        type: "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement" | "project-as-employment" | "unverified-metric" | "target-title-history" | "non-resume-ready-evidence" | "private-evidence" | "unapproved-claim" | "unsupported-terminology" | "unsupported-seniority-or-scope" | "irrelevant-evidence" | "duplicate-evidence-use";
        id: string;
        sourceType: "claim" | "target" | "evidence" | "policy" | "requirement";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        sourceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
        reasonCode: "no-reviewed-proof" | "explicit-contradiction" | "unresolved-ambiguity" | "metric-not-verified" | "target-title-is-not-history" | "project-scope-is-not-employment" | "evidence-not-eligible" | "claim-not-eligible" | "terminology-not-supported" | "scope-not-supported" | "not-selected-for-job-plan" | "deduplicated-use";
    }, {
        type: "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement" | "project-as-employment" | "unverified-metric" | "target-title-history" | "non-resume-ready-evidence" | "private-evidence" | "unapproved-claim" | "unsupported-terminology" | "unsupported-seniority-or-scope" | "irrelevant-evidence" | "duplicate-evidence-use";
        id: string;
        sourceType: "claim" | "target" | "evidence" | "policy" | "requirement";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        sourceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
        reasonCode: "no-reviewed-proof" | "explicit-contradiction" | "unresolved-ambiguity" | "metric-not-verified" | "target-title-is-not-history" | "project-scope-is-not-employment" | "evidence-not-eligible" | "claim-not-eligible" | "terminology-not-supported" | "scope-not-supported" | "not-selected-for-job-plan" | "deduplicated-use";
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodEnum<["MANDATORY_REQUIREMENT_NOT_POSITIONABLE", "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK", "TARGET_TITLE_HISTORY_RISK", "PROJECT_AS_EMPLOYMENT_RISK", "RESPONSIBILITY_AS_ACHIEVEMENT_RISK", "UNSUPPORTED_METRIC_RISK", "UNSUPPORTED_SCOPE_RISK", "UNSUPPORTED_SENIORITY_RISK", "EVIDENCE_OVERUSE_RISK", "REQUIREMENT_TERMINOLOGY_MISMATCH", "DEPENDENCY_STALE", "PROVENANCE_INCOMPLETE"]>;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: "PROVENANCE_INCOMPLETE" | "MANDATORY_REQUIREMENT_NOT_POSITIONABLE" | "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK" | "TARGET_TITLE_HISTORY_RISK" | "PROJECT_AS_EMPLOYMENT_RISK" | "RESPONSIBILITY_AS_ACHIEVEMENT_RISK" | "UNSUPPORTED_METRIC_RISK" | "UNSUPPORTED_SCOPE_RISK" | "UNSUPPORTED_SENIORITY_RISK" | "EVIDENCE_OVERUSE_RISK" | "REQUIREMENT_TERMINOLOGY_MISMATCH" | "DEPENDENCY_STALE";
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
    }, {
        code: "PROVENANCE_INCOMPLETE" | "MANDATORY_REQUIREMENT_NOT_POSITIONABLE" | "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK" | "TARGET_TITLE_HISTORY_RISK" | "PROJECT_AS_EMPLOYMENT_RISK" | "RESPONSIBILITY_AS_ACHIEVEMENT_RISK" | "UNSUPPORTED_METRIC_RISK" | "UNSUPPORTED_SCOPE_RISK" | "UNSUPPORTED_SENIORITY_RISK" | "EVIDENCE_OVERUSE_RISK" | "REQUIREMENT_TERMINOLOGY_MISMATCH" | "DEPENDENCY_STALE";
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodEnum<["JOB_SPECIFIC_PLAN_ONLY", "NOT_A_RESUME", "NO_APPLICATION_RECOMMENDATION", "NO_ATS_SCORE", "REVIEWED_EVIDENCE_ONLY", "MATERIAL_GAP_EXCLUDED", "NO_VERIFIED_METRIC_AVAILABLE", "OPTIONAL_ESCALATION_NOT_PERFORMED"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "JOB_SPECIFIC_PLAN_ONLY" | "NOT_A_RESUME" | "NO_ATS_SCORE" | "MATERIAL_GAP_EXCLUDED" | "NO_VERIFIED_METRIC_AVAILABLE" | "OPTIONAL_ESCALATION_NOT_PERFORMED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }, {
        code: "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "JOB_SPECIFIC_PLAN_ONLY" | "NOT_A_RESUME" | "NO_ATS_SCORE" | "MATERIAL_GAP_EXCLUDED" | "NO_VERIFIED_METRIC_AVAILABLE" | "OPTIONAL_ESCALATION_NOT_PERFORMED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        requirementIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        claimIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodEnum<["REQUIREMENT_POSITIONING_DEFERRED", "ADJACENT_EVIDENCE_NOT_DIRECT", "PROJECT_EMPLOYMENT_BOUNDARY", "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY", "TERMINOLOGY_USE_UNCLEAR", "EVIDENCE_REUSE_BOUNDARY", "UPSTREAM_AMBIGUITY_PRESERVED"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: "REQUIREMENT_POSITIONING_DEFERRED" | "ADJACENT_EVIDENCE_NOT_DIRECT" | "PROJECT_EMPLOYMENT_BOUNDARY" | "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY" | "TERMINOLOGY_USE_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY" | "UPSTREAM_AMBIGUITY_PRESERVED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }, {
        code: "REQUIREMENT_POSITIONING_DEFERRED" | "ADJACENT_EVIDENCE_NOT_DIRECT" | "PROJECT_EMPLOYMENT_BOUNDARY" | "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY" | "TERMINOLOGY_USE_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY" | "UPSTREAM_AMBIGUITY_PRESERVED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        plannedRequirementIds: z.ZodArray<z.ZodString, "many">;
        selectedRequirementIds: z.ZodArray<z.ZodString, "many">;
        deferredRequirementIds: z.ZodArray<z.ZodString, "many">;
        excludedRequirementIds: z.ZodArray<z.ZodString, "many">;
        includedSectionTypes: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
        claimBoundariesComplete: z.ZodBoolean;
        provenanceComplete: z.ZodBoolean;
        criticalConstraintsRepresented: z.ZodBoolean;
        usableForDrafting: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        claimBoundariesComplete: boolean;
        provenanceComplete: boolean;
        plannedRequirementIds: string[];
        selectedRequirementIds: string[];
        deferredRequirementIds: string[];
        excludedRequirementIds: string[];
        includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        criticalConstraintsRepresented: boolean;
        usableForDrafting: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        claimBoundariesComplete: boolean;
        provenanceComplete: boolean;
        plannedRequirementIds: string[];
        selectedRequirementIds: string[];
        deferredRequirementIds: string[];
        excludedRequirementIds: string[];
        includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        criticalConstraintsRepresented: boolean;
        usableForDrafting: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        claimBoundariesComplete: boolean;
        provenanceComplete: boolean;
        plannedRequirementIds: string[];
        selectedRequirementIds: string[];
        deferredRequirementIds: string[];
        excludedRequirementIds: string[];
        includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        criticalConstraintsRepresented: boolean;
        usableForDrafting: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        claimBoundariesComplete: boolean;
        provenanceComplete: boolean;
        plannedRequirementIds: string[];
        selectedRequirementIds: string[];
        deferredRequirementIds: string[];
        excludedRequirementIds: string[];
        includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        criticalConstraintsRepresented: boolean;
        usableForDrafting: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    input: {
        sources: {
            sha256: string;
            path: string;
        };
        coverage: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        evidenceItems: {
            sha256: string;
            path: string;
        };
        assessment: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        claims: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
    };
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        requirementIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        claimIds: string[];
        boundaryIds: string[];
        inclusion: "exclude" | "include" | "optional";
        objectiveCode: "position-target-without-history-claim" | "summarize-selected-proof-themes" | "group-job-relevant-capabilities" | "surface-reviewed-outcomes" | "organize-reviewed-employment-evidence" | "organize-project-scoped-evidence" | "group-reviewed-technical-capabilities" | "group-reviewed-leadership-capabilities" | "retain-relevant-education" | "retain-relevant-certifications" | "retain-approved-additional-information";
        exclusionIds: string[];
        riskCodes: string[];
        warningCodes: string[];
        maximumItemCount?: number | undefined;
    }[];
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "JOB_SPECIFIC_PLAN_ONLY" | "NOT_A_RESUME" | "NO_ATS_SCORE" | "MATERIAL_GAP_EXCLUDED" | "NO_VERIFIED_METRIC_AVAILABLE" | "OPTIONAL_ESCALATION_NOT_PERFORMED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }[];
    ambiguities: {
        code: "REQUIREMENT_POSITIONING_DEFERRED" | "ADJACENT_EVIDENCE_NOT_DIRECT" | "PROJECT_EMPLOYMENT_BOUNDARY" | "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY" | "TERMINOLOGY_USE_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY" | "UPSTREAM_AMBIGUITY_PRESERVED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        claimBoundariesComplete: boolean;
        provenanceComplete: boolean;
        plannedRequirementIds: string[];
        selectedRequirementIds: string[];
        deferredRequirementIds: string[];
        excludedRequirementIds: string[];
        includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        criticalConstraintsRepresented: boolean;
        usableForDrafting: boolean;
    };
    risks: {
        code: "PROVENANCE_INCOMPLETE" | "MANDATORY_REQUIREMENT_NOT_POSITIONABLE" | "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK" | "TARGET_TITLE_HISTORY_RISK" | "PROJECT_AS_EMPLOYMENT_RISK" | "RESPONSIBILITY_AS_ACHIEVEMENT_RISK" | "UNSUPPORTED_METRIC_RISK" | "UNSUPPORTED_SCOPE_RISK" | "UNSUPPORTED_SENIORITY_RISK" | "EVIDENCE_OVERUSE_RISK" | "REQUIREMENT_TERMINOLOGY_MISMATCH" | "DEPENDENCY_STALE";
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    positioning: {
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        prohibitedUses: ("employment-history" | "seniority-proof" | "authority-proof" | "scope-proof")[];
        state: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
        sourceOverallAssessment: "strong" | "limited" | "insufficient" | "mixed" | "indeterminate" | "credible";
        targetTitle: string;
        targetTitleUse: "positioning-only";
        primaryRequirementIds: string[];
        supportingRequirementIds: string[];
        cautionRequirementIds: string[];
        rationaleCode: "strong-reviewed-proof" | "credible-reviewed-proof" | "mixed-reviewed-proof" | "limited-reviewed-proof" | "insufficient-reviewed-proof" | "indeterminate-reviewed-proof";
    };
    evidenceSelections: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        relationships: ("partial" | "direct" | "supporting")[];
        claimIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        requirementUses: {
            decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
            requirementId: string;
            linkIds: string[];
            intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
        }[];
        reuseWarning: boolean;
        boundaryIds: string[];
        limitationCodes: ("partial-relationship" | "supporting-relationship-only" | "limited-proof" | "project-scoped" | "historical-scope-only" | "no-verified-metric" | "multiple-section-reuse")[];
        primaryRequirementId?: string | undefined;
    }[];
    claimBoundaries: {
        id: string;
        kind: "scope" | "target-title" | "requirement-claim" | "project-employment" | "metric";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        state: "allowed" | "prohibited" | "allowed-with-qualifier" | "requires-caution";
        claimIds: string[];
        rationaleCode: "direct-reviewed-proof" | "qualified-partial-proof" | "deferred-or-ambiguous-proof" | "unsupported-or-conflicting-proof" | "target-title-not-history" | "project-scope-not-employment" | "metric-requires-verification" | "scope-limited-to-reviewed-evidence";
        requiredQualifierCodes: ("evidence-scoped-wording" | "project-scoped-wording" | "adjacent-not-direct" | "partial-support-only" | "exact-reviewed-metric-only" | "target-title-positioning-only")[];
        prohibitedInferenceCodes: ("target-title-as-employment" | "project-as-employment" | "responsibility-as-achievement" | "contribution-as-ownership" | "collaboration-as-management" | "technical-exposure-as-expertise" | "adjacent-technology-as-exact-experience" | "domain-adjacency-as-direct-experience" | "unsupported-seniority" | "unsupported-authority" | "unsupported-team-size" | "unsupported-geography" | "unsupported-scale" | "unsupported-adoption" | "unsupported-dates" | "unsupported-outcomes" | "unverified-metric")[];
        requirementId?: string | undefined;
    }[];
    exclusions: {
        type: "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement" | "project-as-employment" | "unverified-metric" | "target-title-history" | "non-resume-ready-evidence" | "private-evidence" | "unapproved-claim" | "unsupported-terminology" | "unsupported-seniority-or-scope" | "irrelevant-evidence" | "duplicate-evidence-use";
        id: string;
        sourceType: "claim" | "target" | "evidence" | "policy" | "requirement";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        sourceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
        reasonCode: "no-reviewed-proof" | "explicit-contradiction" | "unresolved-ambiguity" | "metric-not-verified" | "target-title-is-not-history" | "project-scope-is-not-employment" | "evidence-not-eligible" | "claim-not-eligible" | "terminology-not-supported" | "scope-not-supported" | "not-selected-for-job-plan" | "deduplicated-use";
    }[];
    requirementEmphasis: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
        requirementId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
        selectedLinkIds: string[];
        selectedEvidenceIds: string[];
        selectedClaimIds: string[];
        allowedTerminology: string[];
        cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
    }[];
    metricPermissions: {
        claimId: string;
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        scope: {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        };
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        state: "allowed" | "prohibited";
        qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
        exactApprovedMetricText?: string | undefined;
    }[];
    gapHandling: {
        decision: "defer" | "exclude-positive-positioning" | "supported-adjacent-claim" | "drafting-caution";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        requirementId: string;
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        adjacentEvidenceIds: string[];
        adjacentClaimIds: string[];
        constraintCodes: ("not-positive-positioning" | "not-direct-satisfaction" | "no-compensating-narrative" | "no-gap-closing-advice" | "no-application-advice")[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    input: {
        sources: {
            sha256: string;
            path: string;
        };
        coverage: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        evidenceItems: {
            sha256: string;
            path: string;
        };
        assessment: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        claims: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
    };
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        requirementIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        claimIds: string[];
        boundaryIds: string[];
        inclusion: "exclude" | "include" | "optional";
        objectiveCode: "position-target-without-history-claim" | "summarize-selected-proof-themes" | "group-job-relevant-capabilities" | "surface-reviewed-outcomes" | "organize-reviewed-employment-evidence" | "organize-project-scoped-evidence" | "group-reviewed-technical-capabilities" | "group-reviewed-leadership-capabilities" | "retain-relevant-education" | "retain-relevant-certifications" | "retain-approved-additional-information";
        exclusionIds: string[];
        riskCodes: string[];
        warningCodes: string[];
        maximumItemCount?: number | undefined;
    }[];
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "JOB_SPECIFIC_PLAN_ONLY" | "NOT_A_RESUME" | "NO_ATS_SCORE" | "MATERIAL_GAP_EXCLUDED" | "NO_VERIFIED_METRIC_AVAILABLE" | "OPTIONAL_ESCALATION_NOT_PERFORMED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }[];
    ambiguities: {
        code: "REQUIREMENT_POSITIONING_DEFERRED" | "ADJACENT_EVIDENCE_NOT_DIRECT" | "PROJECT_EMPLOYMENT_BOUNDARY" | "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY" | "TERMINOLOGY_USE_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY" | "UPSTREAM_AMBIGUITY_PRESERVED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        claimBoundariesComplete: boolean;
        provenanceComplete: boolean;
        plannedRequirementIds: string[];
        selectedRequirementIds: string[];
        deferredRequirementIds: string[];
        excludedRequirementIds: string[];
        includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        criticalConstraintsRepresented: boolean;
        usableForDrafting: boolean;
    };
    risks: {
        code: "PROVENANCE_INCOMPLETE" | "MANDATORY_REQUIREMENT_NOT_POSITIONABLE" | "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK" | "TARGET_TITLE_HISTORY_RISK" | "PROJECT_AS_EMPLOYMENT_RISK" | "RESPONSIBILITY_AS_ACHIEVEMENT_RISK" | "UNSUPPORTED_METRIC_RISK" | "UNSUPPORTED_SCOPE_RISK" | "UNSUPPORTED_SENIORITY_RISK" | "EVIDENCE_OVERUSE_RISK" | "REQUIREMENT_TERMINOLOGY_MISMATCH" | "DEPENDENCY_STALE";
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    positioning: {
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        prohibitedUses: ("employment-history" | "seniority-proof" | "authority-proof" | "scope-proof")[];
        state: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
        sourceOverallAssessment: "strong" | "limited" | "insufficient" | "mixed" | "indeterminate" | "credible";
        targetTitle: string;
        targetTitleUse: "positioning-only";
        primaryRequirementIds: string[];
        supportingRequirementIds: string[];
        cautionRequirementIds: string[];
        rationaleCode: "strong-reviewed-proof" | "credible-reviewed-proof" | "mixed-reviewed-proof" | "limited-reviewed-proof" | "insufficient-reviewed-proof" | "indeterminate-reviewed-proof";
    };
    evidenceSelections: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        relationships: ("partial" | "direct" | "supporting")[];
        claimIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        requirementUses: {
            decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
            requirementId: string;
            linkIds: string[];
            intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
        }[];
        reuseWarning: boolean;
        boundaryIds: string[];
        limitationCodes: ("partial-relationship" | "supporting-relationship-only" | "limited-proof" | "project-scoped" | "historical-scope-only" | "no-verified-metric" | "multiple-section-reuse")[];
        primaryRequirementId?: string | undefined;
    }[];
    claimBoundaries: {
        id: string;
        kind: "scope" | "target-title" | "requirement-claim" | "project-employment" | "metric";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        state: "allowed" | "prohibited" | "allowed-with-qualifier" | "requires-caution";
        claimIds: string[];
        rationaleCode: "direct-reviewed-proof" | "qualified-partial-proof" | "deferred-or-ambiguous-proof" | "unsupported-or-conflicting-proof" | "target-title-not-history" | "project-scope-not-employment" | "metric-requires-verification" | "scope-limited-to-reviewed-evidence";
        requiredQualifierCodes: ("evidence-scoped-wording" | "project-scoped-wording" | "adjacent-not-direct" | "partial-support-only" | "exact-reviewed-metric-only" | "target-title-positioning-only")[];
        prohibitedInferenceCodes: ("target-title-as-employment" | "project-as-employment" | "responsibility-as-achievement" | "contribution-as-ownership" | "collaboration-as-management" | "technical-exposure-as-expertise" | "adjacent-technology-as-exact-experience" | "domain-adjacency-as-direct-experience" | "unsupported-seniority" | "unsupported-authority" | "unsupported-team-size" | "unsupported-geography" | "unsupported-scale" | "unsupported-adoption" | "unsupported-dates" | "unsupported-outcomes" | "unverified-metric")[];
        requirementId?: string | undefined;
    }[];
    exclusions: {
        type: "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement" | "project-as-employment" | "unverified-metric" | "target-title-history" | "non-resume-ready-evidence" | "private-evidence" | "unapproved-claim" | "unsupported-terminology" | "unsupported-seniority-or-scope" | "irrelevant-evidence" | "duplicate-evidence-use";
        id: string;
        sourceType: "claim" | "target" | "evidence" | "policy" | "requirement";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        sourceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
        reasonCode: "no-reviewed-proof" | "explicit-contradiction" | "unresolved-ambiguity" | "metric-not-verified" | "target-title-is-not-history" | "project-scope-is-not-employment" | "evidence-not-eligible" | "claim-not-eligible" | "terminology-not-supported" | "scope-not-supported" | "not-selected-for-job-plan" | "deduplicated-use";
    }[];
    requirementEmphasis: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
        requirementId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
        selectedLinkIds: string[];
        selectedEvidenceIds: string[];
        selectedClaimIds: string[];
        allowedTerminology: string[];
        cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
    }[];
    metricPermissions: {
        claimId: string;
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        scope: {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        };
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        state: "allowed" | "prohibited";
        qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
        exactApprovedMetricText?: string | undefined;
    }[];
    gapHandling: {
        decision: "defer" | "exclude-positive-positioning" | "supported-adjacent-claim" | "drafting-caution";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        requirementId: string;
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        adjacentEvidenceIds: string[];
        adjacentClaimIds: string[];
        constraintCodes: ("not-positive-positioning" | "not-direct-satisfaction" | "no-compensating-narrative" | "no-gap-closing-advice" | "no-application-advice")[];
    }[];
}>, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    input: {
        sources: {
            sha256: string;
            path: string;
        };
        coverage: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        evidenceItems: {
            sha256: string;
            path: string;
        };
        assessment: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        claims: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
    };
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        requirementIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        claimIds: string[];
        boundaryIds: string[];
        inclusion: "exclude" | "include" | "optional";
        objectiveCode: "position-target-without-history-claim" | "summarize-selected-proof-themes" | "group-job-relevant-capabilities" | "surface-reviewed-outcomes" | "organize-reviewed-employment-evidence" | "organize-project-scoped-evidence" | "group-reviewed-technical-capabilities" | "group-reviewed-leadership-capabilities" | "retain-relevant-education" | "retain-relevant-certifications" | "retain-approved-additional-information";
        exclusionIds: string[];
        riskCodes: string[];
        warningCodes: string[];
        maximumItemCount?: number | undefined;
    }[];
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "JOB_SPECIFIC_PLAN_ONLY" | "NOT_A_RESUME" | "NO_ATS_SCORE" | "MATERIAL_GAP_EXCLUDED" | "NO_VERIFIED_METRIC_AVAILABLE" | "OPTIONAL_ESCALATION_NOT_PERFORMED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }[];
    ambiguities: {
        code: "REQUIREMENT_POSITIONING_DEFERRED" | "ADJACENT_EVIDENCE_NOT_DIRECT" | "PROJECT_EMPLOYMENT_BOUNDARY" | "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY" | "TERMINOLOGY_USE_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY" | "UPSTREAM_AMBIGUITY_PRESERVED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        claimBoundariesComplete: boolean;
        provenanceComplete: boolean;
        plannedRequirementIds: string[];
        selectedRequirementIds: string[];
        deferredRequirementIds: string[];
        excludedRequirementIds: string[];
        includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        criticalConstraintsRepresented: boolean;
        usableForDrafting: boolean;
    };
    risks: {
        code: "PROVENANCE_INCOMPLETE" | "MANDATORY_REQUIREMENT_NOT_POSITIONABLE" | "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK" | "TARGET_TITLE_HISTORY_RISK" | "PROJECT_AS_EMPLOYMENT_RISK" | "RESPONSIBILITY_AS_ACHIEVEMENT_RISK" | "UNSUPPORTED_METRIC_RISK" | "UNSUPPORTED_SCOPE_RISK" | "UNSUPPORTED_SENIORITY_RISK" | "EVIDENCE_OVERUSE_RISK" | "REQUIREMENT_TERMINOLOGY_MISMATCH" | "DEPENDENCY_STALE";
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    positioning: {
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        prohibitedUses: ("employment-history" | "seniority-proof" | "authority-proof" | "scope-proof")[];
        state: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
        sourceOverallAssessment: "strong" | "limited" | "insufficient" | "mixed" | "indeterminate" | "credible";
        targetTitle: string;
        targetTitleUse: "positioning-only";
        primaryRequirementIds: string[];
        supportingRequirementIds: string[];
        cautionRequirementIds: string[];
        rationaleCode: "strong-reviewed-proof" | "credible-reviewed-proof" | "mixed-reviewed-proof" | "limited-reviewed-proof" | "insufficient-reviewed-proof" | "indeterminate-reviewed-proof";
    };
    evidenceSelections: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        relationships: ("partial" | "direct" | "supporting")[];
        claimIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        requirementUses: {
            decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
            requirementId: string;
            linkIds: string[];
            intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
        }[];
        reuseWarning: boolean;
        boundaryIds: string[];
        limitationCodes: ("partial-relationship" | "supporting-relationship-only" | "limited-proof" | "project-scoped" | "historical-scope-only" | "no-verified-metric" | "multiple-section-reuse")[];
        primaryRequirementId?: string | undefined;
    }[];
    claimBoundaries: {
        id: string;
        kind: "scope" | "target-title" | "requirement-claim" | "project-employment" | "metric";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        state: "allowed" | "prohibited" | "allowed-with-qualifier" | "requires-caution";
        claimIds: string[];
        rationaleCode: "direct-reviewed-proof" | "qualified-partial-proof" | "deferred-or-ambiguous-proof" | "unsupported-or-conflicting-proof" | "target-title-not-history" | "project-scope-not-employment" | "metric-requires-verification" | "scope-limited-to-reviewed-evidence";
        requiredQualifierCodes: ("evidence-scoped-wording" | "project-scoped-wording" | "adjacent-not-direct" | "partial-support-only" | "exact-reviewed-metric-only" | "target-title-positioning-only")[];
        prohibitedInferenceCodes: ("target-title-as-employment" | "project-as-employment" | "responsibility-as-achievement" | "contribution-as-ownership" | "collaboration-as-management" | "technical-exposure-as-expertise" | "adjacent-technology-as-exact-experience" | "domain-adjacency-as-direct-experience" | "unsupported-seniority" | "unsupported-authority" | "unsupported-team-size" | "unsupported-geography" | "unsupported-scale" | "unsupported-adoption" | "unsupported-dates" | "unsupported-outcomes" | "unverified-metric")[];
        requirementId?: string | undefined;
    }[];
    exclusions: {
        type: "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement" | "project-as-employment" | "unverified-metric" | "target-title-history" | "non-resume-ready-evidence" | "private-evidence" | "unapproved-claim" | "unsupported-terminology" | "unsupported-seniority-or-scope" | "irrelevant-evidence" | "duplicate-evidence-use";
        id: string;
        sourceType: "claim" | "target" | "evidence" | "policy" | "requirement";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        sourceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
        reasonCode: "no-reviewed-proof" | "explicit-contradiction" | "unresolved-ambiguity" | "metric-not-verified" | "target-title-is-not-history" | "project-scope-is-not-employment" | "evidence-not-eligible" | "claim-not-eligible" | "terminology-not-supported" | "scope-not-supported" | "not-selected-for-job-plan" | "deduplicated-use";
    }[];
    requirementEmphasis: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
        requirementId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
        selectedLinkIds: string[];
        selectedEvidenceIds: string[];
        selectedClaimIds: string[];
        allowedTerminology: string[];
        cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
    }[];
    metricPermissions: {
        claimId: string;
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        scope: {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        };
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        state: "allowed" | "prohibited";
        qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
        exactApprovedMetricText?: string | undefined;
    }[];
    gapHandling: {
        decision: "defer" | "exclude-positive-positioning" | "supported-adjacent-claim" | "drafting-caution";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        requirementId: string;
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        adjacentEvidenceIds: string[];
        adjacentClaimIds: string[];
        constraintCodes: ("not-positive-positioning" | "not-direct-satisfaction" | "no-compensating-narrative" | "no-gap-closing-advice" | "no-application-advice")[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific-resume";
    input: {
        sources: {
            sha256: string;
            path: string;
        };
        coverage: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        evidenceItems: {
            sha256: string;
            path: string;
        };
        assessment: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        claims: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
            manifestPath: string;
            manifestSha256: string;
        };
        selectedEvidenceSetSha256: string;
        selectedClaimSetSha256: string;
    };
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        requirementIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        claimIds: string[];
        boundaryIds: string[];
        inclusion: "exclude" | "include" | "optional";
        objectiveCode: "position-target-without-history-claim" | "summarize-selected-proof-themes" | "group-job-relevant-capabilities" | "surface-reviewed-outcomes" | "organize-reviewed-employment-evidence" | "organize-project-scoped-evidence" | "group-reviewed-technical-capabilities" | "group-reviewed-leadership-capabilities" | "retain-relevant-education" | "retain-relevant-certifications" | "retain-approved-additional-information";
        exclusionIds: string[];
        riskCodes: string[];
        warningCodes: string[];
        maximumItemCount?: number | undefined;
    }[];
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "JOB_SPECIFIC_PLAN_ONLY" | "NOT_A_RESUME" | "NO_ATS_SCORE" | "MATERIAL_GAP_EXCLUDED" | "NO_VERIFIED_METRIC_AVAILABLE" | "OPTIONAL_ESCALATION_NOT_PERFORMED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }[];
    ambiguities: {
        code: "REQUIREMENT_POSITIONING_DEFERRED" | "ADJACENT_EVIDENCE_NOT_DIRECT" | "PROJECT_EMPLOYMENT_BOUNDARY" | "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY" | "TERMINOLOGY_USE_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY" | "UPSTREAM_AMBIGUITY_PRESERVED";
        message: string;
        id: string;
        evidenceIds: string[];
        requirementIds: string[];
        claimIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        claimBoundariesComplete: boolean;
        provenanceComplete: boolean;
        plannedRequirementIds: string[];
        selectedRequirementIds: string[];
        deferredRequirementIds: string[];
        excludedRequirementIds: string[];
        includedSectionTypes: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        criticalConstraintsRepresented: boolean;
        usableForDrafting: boolean;
    };
    risks: {
        code: "PROVENANCE_INCOMPLETE" | "MANDATORY_REQUIREMENT_NOT_POSITIONABLE" | "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK" | "TARGET_TITLE_HISTORY_RISK" | "PROJECT_AS_EMPLOYMENT_RISK" | "RESPONSIBILITY_AS_ACHIEVEMENT_RISK" | "UNSUPPORTED_METRIC_RISK" | "UNSUPPORTED_SCOPE_RISK" | "UNSUPPORTED_SENIORITY_RISK" | "EVIDENCE_OVERUSE_RISK" | "REQUIREMENT_TERMINOLOGY_MISMATCH" | "DEPENDENCY_STALE";
        message: string;
        id: string;
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
        requirementIds: string[];
        claimIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    positioning: {
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        prohibitedUses: ("employment-history" | "seniority-proof" | "authority-proof" | "scope-proof")[];
        state: "direct" | "indeterminate" | "adjacent" | "stretch" | "insufficient-proof";
        sourceOverallAssessment: "strong" | "limited" | "insufficient" | "mixed" | "indeterminate" | "credible";
        targetTitle: string;
        targetTitleUse: "positioning-only";
        primaryRequirementIds: string[];
        supportingRequirementIds: string[];
        cautionRequirementIds: string[];
        rationaleCode: "strong-reviewed-proof" | "credible-reviewed-proof" | "mixed-reviewed-proof" | "limited-reviewed-proof" | "insufficient-reviewed-proof" | "indeterminate-reviewed-proof";
    };
    evidenceSelections: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        relationships: ("partial" | "direct" | "supporting")[];
        claimIds: string[];
        intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        requirementUses: {
            decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
            requirementId: string;
            linkIds: string[];
            intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            purposeCode: "primary-requirement-proof" | "secondary-requirement-proof" | "supporting-context" | "deferred-proof" | "excluded-proof";
        }[];
        reuseWarning: boolean;
        boundaryIds: string[];
        limitationCodes: ("partial-relationship" | "supporting-relationship-only" | "limited-proof" | "project-scoped" | "historical-scope-only" | "no-verified-metric" | "multiple-section-reuse")[];
        primaryRequirementId?: string | undefined;
    }[];
    claimBoundaries: {
        id: string;
        kind: "scope" | "target-title" | "requirement-claim" | "project-employment" | "metric";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        evidenceIds: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "role-title" | "capability-theme" | "scope" | "quantified-outcome" | "technology" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome" | "target-title")[];
        state: "allowed" | "prohibited" | "allowed-with-qualifier" | "requires-caution";
        claimIds: string[];
        rationaleCode: "direct-reviewed-proof" | "qualified-partial-proof" | "deferred-or-ambiguous-proof" | "unsupported-or-conflicting-proof" | "target-title-not-history" | "project-scope-not-employment" | "metric-requires-verification" | "scope-limited-to-reviewed-evidence";
        requiredQualifierCodes: ("evidence-scoped-wording" | "project-scoped-wording" | "adjacent-not-direct" | "partial-support-only" | "exact-reviewed-metric-only" | "target-title-positioning-only")[];
        prohibitedInferenceCodes: ("target-title-as-employment" | "project-as-employment" | "responsibility-as-achievement" | "contribution-as-ownership" | "collaboration-as-management" | "technical-exposure-as-expertise" | "adjacent-technology-as-exact-experience" | "domain-adjacency-as-direct-experience" | "unsupported-seniority" | "unsupported-authority" | "unsupported-team-size" | "unsupported-geography" | "unsupported-scale" | "unsupported-adoption" | "unsupported-dates" | "unsupported-outcomes" | "unverified-metric")[];
        requirementId?: string | undefined;
    }[];
    exclusions: {
        type: "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement" | "project-as-employment" | "unverified-metric" | "target-title-history" | "non-resume-ready-evidence" | "private-evidence" | "unapproved-claim" | "unsupported-terminology" | "unsupported-seniority-or-scope" | "irrelevant-evidence" | "duplicate-evidence-use";
        id: string;
        sourceType: "claim" | "target" | "evidence" | "policy" | "requirement";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        sourceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
        reasonCode: "no-reviewed-proof" | "explicit-contradiction" | "unresolved-ambiguity" | "metric-not-verified" | "target-title-is-not-history" | "project-scope-is-not-employment" | "evidence-not-eligible" | "claim-not-eligible" | "terminology-not-supported" | "scope-not-supported" | "not-selected-for-job-plan" | "deduplicated-use";
    }[];
    requirementEmphasis: {
        decision: "exclude" | "supporting" | "primary" | "secondary" | "defer";
        id: string;
        necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        materiality: "unknown" | "contextual" | "critical" | "secondary" | "material";
        requirementId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
        selectedLinkIds: string[];
        selectedEvidenceIds: string[];
        selectedClaimIds: string[];
        allowedTerminology: string[];
        cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
    }[];
    metricPermissions: {
        claimId: string;
        id: string;
        evidenceId: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        scope: {
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
            sourceSection?: string | undefined;
        };
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        state: "allowed" | "prohibited";
        qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
        exactApprovedMetricText?: string | undefined;
    }[];
    gapHandling: {
        decision: "defer" | "exclude-positive-positioning" | "supported-adjacent-claim" | "drafting-caution";
        id: string;
        provenance: {
            targetId: string;
            evidenceIds: string[];
            requirementIds: string[];
            planningPolicy: {
                name: string;
                version: string;
            };
            coverageReferences: {
                coverageEntryId: string;
                coverageEntrySha256: string;
            }[];
            assessmentReferences: {
                assessmentEntryId: string;
                assessmentEntrySha256: string;
            }[];
            evidenceLinkReferences: {
                claimId: string;
                evidenceId: string;
                evidenceProvenance: {
                    claimId: string;
                    evidenceId: string;
                    sources: {
                        sha256: string;
                        path: string;
                        status: "active";
                        sourceType: string;
                        sourceId: string;
                        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                    }[];
                    evidenceItemPath: string;
                    evidenceItemSha256: string;
                    claimPath: string;
                    claimSha256: string;
                };
                requirementId: string;
                relationship: "partial" | "direct" | "supporting";
                requirementProvenance: {
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
                    requirementId: string;
                    requirementModelType: "approved" | "deterministic";
                    requirementModelPath: string;
                    requirementModelSha256: string;
                    sourceTextSha256: string;
                };
                linkId: string;
                linkSha256: string;
            }[];
            claimIds: string[];
        };
        requirementId: string;
        assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
        adjacentEvidenceIds: string[];
        adjacentClaimIds: string[];
        constraintCodes: ("not-positive-positioning" | "not-direct-satisfaction" | "no-compensating-narrative" | "no-gap-closing-advice" | "no-application-advice")[];
    }[];
}>;
export declare const JobResumeContentPlanManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    manifestId: z.ZodString;
    planId: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    mode: z.ZodLiteral<"job-specific-resume">;
    planPath: z.ZodEffects<z.ZodString, string, string>;
    planSha256: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    sourceSha256: z.ZodString;
    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
    requirementModelSha256: z.ZodString;
    requirementManifestSha256: z.ZodString;
    evidenceMapSha256: z.ZodString;
    evidenceMapManifestSha256: z.ZodString;
    coverageSha256: z.ZodString;
    coverageManifestSha256: z.ZodString;
    assessmentSha256: z.ZodString;
    assessmentManifestSha256: z.ZodString;
    sourcesSha256: z.ZodString;
    evidenceItemsSha256: z.ZodString;
    claimsSha256: z.ZodString;
    selectedEvidenceSetSha256: z.ZodString;
    selectedClaimSetSha256: z.ZodString;
    normalizedInputSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    mode: "job-specific-resume";
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    policyVersion: string;
    sourcesSha256: string;
    evidenceItemsSha256: string;
    claimsSha256: string;
    assessmentSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    planId: string;
    planPath: string;
    planSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    evidenceMapManifestSha256: string;
    coverageManifestSha256: string;
    selectedEvidenceSetSha256: string;
    selectedClaimSetSha256: string;
    manifestId: string;
    assessmentManifestSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    mode: "job-specific-resume";
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    policyVersion: string;
    sourcesSha256: string;
    evidenceItemsSha256: string;
    claimsSha256: string;
    assessmentSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    planId: string;
    planPath: string;
    planSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    evidenceMapManifestSha256: string;
    coverageManifestSha256: string;
    selectedEvidenceSetSha256: string;
    selectedClaimSetSha256: string;
    manifestId: string;
    assessmentManifestSha256: string;
}>;
export type JobResumePositioningState = z.infer<typeof JobResumePositioningStateSchema>;
export type JobRequirementEmphasisDecision = z.infer<typeof JobRequirementEmphasisDecisionSchema>;
export type JobResumeSectionType = z.infer<typeof JobResumeSectionTypeSchema>;
export type JobResumeContentType = z.infer<typeof JobResumeContentTypeSchema>;
export type JobRequirementEmphasis = z.infer<typeof JobRequirementEmphasisSchema>;
export type JobResumeEvidenceSelection = z.infer<typeof JobResumeEvidenceSelectionSchema>;
export type JobResumeClaimBoundary = z.infer<typeof JobResumeClaimBoundarySchema>;
export type JobMetricPermission = z.infer<typeof JobMetricPermissionSchema>;
export type JobGapHandlingRule = z.infer<typeof JobGapHandlingRuleSchema>;
export type JobResumeSectionPlan = z.infer<typeof JobResumeSectionPlanSchema>;
export type JobResumeContentExclusion = z.infer<typeof JobResumeContentExclusionSchema>;
export type JobResumePlanningRisk = z.infer<typeof JobResumePlanningRiskSchema>;
export type JobResumePlanningWarning = z.infer<typeof JobResumePlanningWarningSchema>;
export type JobResumePlanningAmbiguity = z.infer<typeof JobResumePlanningAmbiguitySchema>;
export type JobResumeContentPlan = z.infer<typeof JobResumeContentPlanSchema>;
export type JobResumeContentPlanManifest = z.infer<typeof JobResumeContentPlanManifestSchema>;
