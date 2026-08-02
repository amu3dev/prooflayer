import { z } from "zod";
export declare const JobRequirementCategorySchema: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
export declare const JobRequirementNecessitySchema: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
export declare const JobRequirementConfidenceSchema: z.ZodEnum<["high", "medium", "low"]>;
export declare const JobRequirementExplicitnessSchema: z.ZodEnum<["explicit", "inferred"]>;
export declare const JobRequirementTrustStateSchema: z.ZodEnum<["deterministic-unreviewed", "proposed", "human-approved", "human-edited"]>;
export declare const JobRequirementRelationshipSchema: z.ZodObject<{
    type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
    requirementId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: "requires" | "related-to" | "alternative-to";
    requirementId: string;
}, {
    type: "requires" | "related-to" | "alternative-to";
    requirementId: string;
}>;
export declare const JobRequirementProvenanceSchema: z.ZodObject<{
    sourceAnalysisItemId: z.ZodString;
    sourceSectionId: z.ZodNullable<z.ZodString>;
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
    sourceAnalysisItemId: string;
    sourceSectionId: string | null;
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
    sourceAnalysisItemId: string;
    sourceSectionId: string | null;
}>;
export declare const JobRequirementSchema: z.ZodObject<{
    trustState: z.ZodEnum<["deterministic-unreviewed", "proposed", "human-approved", "human-edited"]>;
    category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
    normalizedLabel: z.ZodString;
    sourceText: z.ZodString;
    necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    explicitness: z.ZodEnum<["explicit", "inferred"]>;
    provenance: z.ZodObject<{
        sourceAnalysisItemId: z.ZodString;
        sourceSectionId: z.ZodNullable<z.ZodString>;
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
        sourceAnalysisItemId: string;
        sourceSectionId: string | null;
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
        sourceAnalysisItemId: string;
        sourceSectionId: string | null;
    }>;
    relationships: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
        requirementId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }>, "many">;
    namedTechnologies: z.ZodArray<z.ZodString, "many">;
    keywords: z.ZodArray<z.ZodString, "many">;
    notes: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    explicitness: "explicit" | "inferred";
    trustState: "proposed" | "human-approved" | "human-edited" | "deterministic-unreviewed";
    provenance: {
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
        sourceAnalysisItemId: string;
        sourceSectionId: string | null;
    };
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    sourceText: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
}, {
    notes: string[];
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    explicitness: "explicit" | "inferred";
    trustState: "proposed" | "human-approved" | "human-edited" | "deterministic-unreviewed";
    provenance: {
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
        sourceAnalysisItemId: string;
        sourceSectionId: string | null;
    };
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    sourceText: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
}>;
export declare const JobRequirementAmbiguitySchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_CATEGORY", "VAGUE_SCOPE", "COMPOUND_STATEMENT", "OTHER"]>;
    message: z.ZodString;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
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
    code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
    message: string;
    id: string;
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
    sourceAnalysisItemIds: string[];
    requirementIds: string[];
}, {
    code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
    message: string;
    id: string;
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
    sourceAnalysisItemIds: string[];
    requirementIds: string[];
}>;
export declare const JobRequirementContradictionSchema: z.ZodObject<{
    id: z.ZodString;
    message: z.ZodString;
    requirementIds: z.ZodArray<z.ZodString, "many">;
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
    message: string;
    id: string;
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
    requirementIds: string[];
}, {
    message: string;
    id: string;
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
    requirementIds: string[];
}>;
export declare const JobRequirementRiskSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["AMBIGUOUS_MANDATORY_STATUS", "UNCLASSIFIED_REQUIREMENT", "CONTRADICTORY_REQUIREMENT", "SOURCE_STRUCTURE_INCOMPLETE"]>;
    severity: z.ZodEnum<["high", "medium", "low"]>;
    message: z.ZodString;
    requirementIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
    message: string;
    id: string;
    severity: "high" | "medium" | "low";
    requirementIds: string[];
}, {
    code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
    message: string;
    id: string;
    severity: "high" | "medium" | "low";
    requirementIds: string[];
}>;
export declare const JobRequirementWarningSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["NO_REQUIREMENTS_FOUND", "FRONT_MATTER_EXCLUDED", "UNKNOWN_SECTION", "AMBIGUOUS_ITEM_PRESERVED", "MODEL_PROPOSAL_REQUIRES_REVIEW"]>;
    message: z.ZodString;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
    message: string;
    id: string;
    sourceAnalysisItemIds: string[];
}, {
    code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
    message: string;
    id: string;
    sourceAnalysisItemIds: string[];
}>;
export declare const JobRequirementCompletenessSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodEnum<["empty", "partial", "complete"]>;
    sourceItemCount: z.ZodNumber;
    modeledItemCount: z.ZodNumber;
    unmodeledItemIds: z.ZodArray<z.ZodString, "many">;
    usableForHumanReview: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    sourceItemCount: number;
    modeledItemCount: number;
    unmodeledItemIds: string[];
    usableForHumanReview: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    sourceItemCount: number;
    modeledItemCount: number;
    unmodeledItemIds: string[];
    usableForHumanReview: boolean;
}>, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    sourceItemCount: number;
    modeledItemCount: number;
    unmodeledItemIds: string[];
    usableForHumanReview: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    sourceItemCount: number;
    modeledItemCount: number;
    unmodeledItemIds: string[];
    usableForHumanReview: boolean;
}>;
export declare const JobRequirementDependencySchema: z.ZodObject<{
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
}, {
    sha256: string;
    path: string;
}>;
export declare const JobRequirementModelSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
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
        structuralAnalysis: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        structuralAnalysisManifest: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        normalizedInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        target: {
            sha256: string;
            path: string;
        };
        structuralAnalysis: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        structuralAnalysisManifest: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
    }, {
        target: {
            sha256: string;
            path: string;
        };
        structuralAnalysis: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        structuralAnalysisManifest: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
    }>;
    requirements: z.ZodArray<z.ZodObject<{
        trustState: z.ZodEnum<["deterministic-unreviewed", "proposed", "human-approved", "human-edited"]>;
        category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
        normalizedLabel: z.ZodString;
        sourceText: z.ZodString;
        necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        explicitness: z.ZodEnum<["explicit", "inferred"]>;
        provenance: z.ZodObject<{
            sourceAnalysisItemId: z.ZodString;
            sourceSectionId: z.ZodNullable<z.ZodString>;
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        }>;
        relationships: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
            requirementId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }>, "many">;
        namedTechnologies: z.ZodArray<z.ZodString, "many">;
        keywords: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        trustState: "proposed" | "human-approved" | "human-edited" | "deterministic-unreviewed";
        provenance: {
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        };
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }, {
        notes: string[];
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        trustState: "proposed" | "human-approved" | "human-edited" | "deterministic-unreviewed";
        provenance: {
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        };
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }>, "many">;
    namedTechnologies: z.ZodArray<z.ZodString, "many">;
    keywords: z.ZodArray<z.ZodString, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_CATEGORY", "VAGUE_SCOPE", "COMPOUND_STATEMENT", "OTHER"]>;
        message: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
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
        code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
        message: string;
        id: string;
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
        sourceAnalysisItemIds: string[];
        requirementIds: string[];
    }, {
        code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
        message: string;
        id: string;
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
        sourceAnalysisItemIds: string[];
        requirementIds: string[];
    }>, "many">;
    contradictions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        message: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
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
        message: string;
        id: string;
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
        requirementIds: string[];
    }, {
        message: string;
        id: string;
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
        requirementIds: string[];
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_MANDATORY_STATUS", "UNCLASSIFIED_REQUIREMENT", "CONTRADICTORY_REQUIREMENT", "SOURCE_STRUCTURE_INCOMPLETE"]>;
        severity: z.ZodEnum<["high", "medium", "low"]>;
        message: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low";
        requirementIds: string[];
    }, {
        code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low";
        requirementIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_REQUIREMENTS_FOUND", "FRONT_MATTER_EXCLUDED", "UNKNOWN_SECTION", "AMBIGUOUS_ITEM_PRESERVED", "MODEL_PROPOSAL_REQUIRES_REVIEW"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
        sourceAnalysisItemIds: string[];
    }, {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
        sourceAnalysisItemIds: string[];
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        sourceItemCount: z.ZodNumber;
        modeledItemCount: z.ZodNumber;
        unmodeledItemIds: z.ZodArray<z.ZodString, "many">;
        usableForHumanReview: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    }>;
    trustState: z.ZodLiteral<"deterministic-unreviewed">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        target: {
            sha256: string;
            path: string;
        };
        structuralAnalysis: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        structuralAnalysisManifest: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
        sourceAnalysisItemIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
        message: string;
        id: string;
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
        sourceAnalysisItemIds: string[];
        requirementIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    };
    trustState: "deterministic-unreviewed";
    requirements: {
        notes: string[];
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        trustState: "proposed" | "human-approved" | "human-edited" | "deterministic-unreviewed";
        provenance: {
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        };
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }[];
    risks: {
        code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low";
        requirementIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    namedTechnologies: string[];
    keywords: string[];
    contradictions: {
        message: string;
        id: string;
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
        requirementIds: string[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        target: {
            sha256: string;
            path: string;
        };
        structuralAnalysis: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        structuralAnalysisManifest: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
        sourceAnalysisItemIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
        message: string;
        id: string;
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
        sourceAnalysisItemIds: string[];
        requirementIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    };
    trustState: "deterministic-unreviewed";
    requirements: {
        notes: string[];
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        trustState: "proposed" | "human-approved" | "human-edited" | "deterministic-unreviewed";
        provenance: {
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        };
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }[];
    risks: {
        code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low";
        requirementIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    namedTechnologies: string[];
    keywords: string[];
    contradictions: {
        message: string;
        id: string;
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
        requirementIds: string[];
    }[];
}>;
export declare const JobRequirementModelManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    modelId: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    modelPath: z.ZodEffects<z.ZodString, string, string>;
    modelSha256: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    sourceSha256: z.ZodString;
    structuralAnalysisSha256: z.ZodString;
    structuralAnalysisManifestSha256: z.ZodString;
    normalizedInputSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    modelId: string;
    modelPath: string;
    modelSha256: string;
    structuralAnalysisManifestSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    modelId: string;
    modelPath: string;
    modelSha256: string;
    structuralAnalysisManifestSha256: string;
}>;
export declare const ModelProposedJobRequirementSchema: z.ZodObject<{
    sourceRequirementIds: z.ZodArray<z.ZodString, "many">;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
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
    category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
    normalizedLabel: z.ZodString;
    sourceText: z.ZodString;
    necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    explicitness: z.ZodEnum<["explicit", "inferred"]>;
    relationships: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
        requirementId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }>, "many">;
    namedTechnologies: z.ZodArray<z.ZodString, "many">;
    keywords: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    ambiguityNotes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
    explicitness: "explicit" | "inferred";
    sourceAnalysisItemIds: string[];
    rationale: string;
    ambiguityNotes: string[];
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    sourceText: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
    sourceRequirementIds: string[];
}, {
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
    explicitness: "explicit" | "inferred";
    sourceAnalysisItemIds: string[];
    rationale: string;
    ambiguityNotes: string[];
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    sourceText: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
    sourceRequirementIds: string[];
}>;
export declare const ProposedJobRequirementSchema: z.ZodObject<{
    trustState: z.ZodLiteral<"proposed">;
    sourceRequirementIds: z.ZodArray<z.ZodString, "many">;
    sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
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
    category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
    normalizedLabel: z.ZodString;
    sourceText: z.ZodString;
    necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    explicitness: z.ZodEnum<["explicit", "inferred"]>;
    relationships: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
        requirementId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }>, "many">;
    namedTechnologies: z.ZodArray<z.ZodString, "many">;
    keywords: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    ambiguityNotes: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
    explicitness: "explicit" | "inferred";
    sourceAnalysisItemIds: string[];
    rationale: string;
    ambiguityNotes: string[];
    trustState: "proposed";
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    sourceText: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
    sourceRequirementIds: string[];
}, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
    explicitness: "explicit" | "inferred";
    sourceAnalysisItemIds: string[];
    rationale: string;
    ambiguityNotes: string[];
    trustState: "proposed";
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    sourceText: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
    sourceRequirementIds: string[];
}>;
export declare const ModelJobRequirementPayloadSchema: z.ZodObject<{
    proposedRequirements: z.ZodArray<z.ZodObject<{
        sourceRequirementIds: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
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
        category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
        normalizedLabel: z.ZodString;
        sourceText: z.ZodString;
        necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        explicitness: z.ZodEnum<["explicit", "inferred"]>;
        relationships: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
            requirementId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }>, "many">;
        namedTechnologies: z.ZodArray<z.ZodString, "many">;
        keywords: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        ambiguityNotes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
        explicitness: "explicit" | "inferred";
        sourceAnalysisItemIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
        sourceRequirementIds: string[];
    }, {
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
        explicitness: "explicit" | "inferred";
        sourceAnalysisItemIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
        sourceRequirementIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    warnings: string[];
    proposedRequirements: {
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
        explicitness: "explicit" | "inferred";
        sourceAnalysisItemIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
        sourceRequirementIds: string[];
    }[];
}, {
    warnings: string[];
    proposedRequirements: {
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
        explicitness: "explicit" | "inferred";
        sourceAnalysisItemIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
        sourceRequirementIds: string[];
    }[];
}>;
export declare const JobRequirementProposalSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    status: z.ZodEnum<["generated", "validation-failed", "ready-for-review", "reviewed"]>;
    model: z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        endpointType: z.ZodOptional<z.ZodString>;
    } & {
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
        endpointType?: string | undefined;
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
        endpointType?: string | undefined;
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
        sourceSha256: z.ZodString;
        deterministicModelSha256: z.ZodString;
        normalizedModelInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        sourceSha256: string;
        normalizedModelInputSha256: string;
        deterministicModelSha256: string;
    }, {
        targetSha256: string;
        sourceSha256: string;
        normalizedModelInputSha256: string;
        deterministicModelSha256: string;
    }>;
    proposedRequirements: z.ZodArray<z.ZodObject<{
        trustState: z.ZodLiteral<"proposed">;
        sourceRequirementIds: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
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
        category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
        normalizedLabel: z.ZodString;
        sourceText: z.ZodString;
        necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        explicitness: z.ZodEnum<["explicit", "inferred"]>;
        relationships: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
            requirementId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }>, "many">;
        namedTechnologies: z.ZodArray<z.ZodString, "many">;
        keywords: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        ambiguityNotes: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
        explicitness: "explicit" | "inferred";
        sourceAnalysisItemIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
        sourceRequirementIds: string[];
    }, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
        explicitness: "explicit" | "inferred";
        sourceAnalysisItemIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
        sourceRequirementIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_REQUIREMENTS_FOUND", "FRONT_MATTER_EXCLUDED", "UNKNOWN_SECTION", "AMBIGUOUS_ITEM_PRESERVED", "MODEL_PROPOSAL_REQUIRES_REVIEW"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
        sourceAnalysisItemIds: string[];
    }, {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
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
        sourceSha256: string;
        normalizedModelInputSha256: string;
        deterministicModelSha256: string;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
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
        endpointType?: string | undefined;
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
    proposedRequirements: {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
        explicitness: "explicit" | "inferred";
        sourceAnalysisItemIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
        sourceRequirementIds: string[];
    }[];
}, {
    status: "generated" | "validation-failed" | "ready-for-review" | "reviewed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        targetSha256: string;
        sourceSha256: string;
        normalizedModelInputSha256: string;
        deterministicModelSha256: string;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
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
        endpointType?: string | undefined;
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
    proposedRequirements: {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
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
        explicitness: "explicit" | "inferred";
        sourceAnalysisItemIds: string[];
        rationale: string;
        ambiguityNotes: string[];
        trustState: "proposed";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
        sourceRequirementIds: string[];
    }[];
}>;
export declare const JobRequirementProposalManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    proposalPath: z.ZodEffects<z.ZodString, string, string>;
    proposalSha256: z.ZodString;
    rawResponsePath: z.ZodEffects<z.ZodString, string, string>;
    rawResponseSha256: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    provider: z.ZodString;
    model: z.ZodString;
    promptTemplateId: z.ZodString;
    promptTemplateVersion: z.ZodString;
    renderedPromptSha256: z.ZodString;
    targetSha256: z.ZodString;
    sourceSha256: z.ZodString;
    deterministicModelSha256: z.ZodString;
    normalizedModelInputSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
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
    policyName: string;
    deterministicModelSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
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
    policyName: string;
    deterministicModelSha256: string;
}>;
export declare const EditedJobRequirementSchema: z.ZodObject<{
    category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
    normalizedLabel: z.ZodString;
    necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    explicitness: z.ZodEnum<["explicit", "inferred"]>;
    relationships: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
        requirementId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }>, "many">;
    namedTechnologies: z.ZodArray<z.ZodString, "many">;
    keywords: z.ZodArray<z.ZodString, "many">;
    notes: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    explicitness: "explicit" | "inferred";
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
}, {
    notes: string[];
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    explicitness: "explicit" | "inferred";
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
}>;
export declare const JobRequirementReviewDecisionSchema: z.ZodEffects<z.ZodObject<{
    requirementId: z.ZodString;
    source: z.ZodEnum<["deterministic", "proposal"]>;
    decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
    editedRequirement: z.ZodOptional<z.ZodObject<{
        category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
        normalizedLabel: z.ZodString;
        necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        explicitness: z.ZodEnum<["explicit", "inferred"]>;
        relationships: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
            requirementId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }>, "many">;
        namedTechnologies: z.ZodArray<z.ZodString, "many">;
        keywords: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }, {
        notes: string[];
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }>>;
    reviewNote: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    decision: "pending" | "accept" | "edit" | "reject";
    source: "deterministic" | "proposal";
    requirementId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedRequirement?: {
        notes: string[];
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    } | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    source: "deterministic" | "proposal";
    requirementId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedRequirement?: {
        notes: string[];
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    } | undefined;
}>, {
    decision: "pending" | "accept" | "edit" | "reject";
    source: "deterministic" | "proposal";
    requirementId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedRequirement?: {
        notes: string[];
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    } | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    source: "deterministic" | "proposal";
    requirementId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedRequirement?: {
        notes: string[];
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    } | undefined;
}>;
export declare const JobRequirementProposalReviewSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    status: z.ZodEnum<["in-progress", "completed"]>;
    decisions: z.ZodArray<z.ZodEffects<z.ZodObject<{
        requirementId: z.ZodString;
        source: z.ZodEnum<["deterministic", "proposal"]>;
        decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
        editedRequirement: z.ZodOptional<z.ZodObject<{
            category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
            normalizedLabel: z.ZodString;
            necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            explicitness: z.ZodEnum<["explicit", "inferred"]>;
            relationships: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
                requirementId: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }, {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }>, "many">;
            namedTechnologies: z.ZodArray<z.ZodString, "many">;
            keywords: z.ZodArray<z.ZodString, "many">;
            notes: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            notes: string[];
            necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
            category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
            explicitness: "explicit" | "inferred";
            confidence: "high" | "medium" | "low";
            normalizedLabel: string;
            relationships: {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }[];
            namedTechnologies: string[];
            keywords: string[];
        }, {
            notes: string[];
            necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
            category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
            explicitness: "explicit" | "inferred";
            confidence: "high" | "medium" | "low";
            normalizedLabel: string;
            relationships: {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }[];
            namedTechnologies: string[];
            keywords: string[];
        }>>;
        reviewNote: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        decision: "pending" | "accept" | "edit" | "reject";
        source: "deterministic" | "proposal";
        requirementId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedRequirement?: {
            notes: string[];
            necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
            category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
            explicitness: "explicit" | "inferred";
            confidence: "high" | "medium" | "low";
            normalizedLabel: string;
            relationships: {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }[];
            namedTechnologies: string[];
            keywords: string[];
        } | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        source: "deterministic" | "proposal";
        requirementId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedRequirement?: {
            notes: string[];
            necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
            category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
            explicitness: "explicit" | "inferred";
            confidence: "high" | "medium" | "low";
            normalizedLabel: string;
            relationships: {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }[];
            namedTechnologies: string[];
            keywords: string[];
        } | undefined;
    }>, {
        decision: "pending" | "accept" | "edit" | "reject";
        source: "deterministic" | "proposal";
        requirementId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedRequirement?: {
            notes: string[];
            necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
            category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
            explicitness: "explicit" | "inferred";
            confidence: "high" | "medium" | "low";
            normalizedLabel: string;
            relationships: {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }[];
            namedTechnologies: string[];
            keywords: string[];
        } | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        source: "deterministic" | "proposal";
        requirementId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedRequirement?: {
            notes: string[];
            necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
            category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
            explicitness: "explicit" | "inferred";
            confidence: "high" | "medium" | "low";
            normalizedLabel: string;
            relationships: {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }[];
            namedTechnologies: string[];
            keywords: string[];
        } | undefined;
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
        source: "deterministic" | "proposal";
        requirementId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedRequirement?: {
            notes: string[];
            necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
            category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
            explicitness: "explicit" | "inferred";
            confidence: "high" | "medium" | "low";
            normalizedLabel: string;
            relationships: {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }[];
            namedTechnologies: string[];
            keywords: string[];
        } | undefined;
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
        source: "deterministic" | "proposal";
        requirementId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedRequirement?: {
            notes: string[];
            necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
            category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
            explicitness: "explicit" | "inferred";
            confidence: "high" | "medium" | "low";
            normalizedLabel: string;
            relationships: {
                type: "requires" | "related-to" | "alternative-to";
                requirementId: string;
            }[];
            namedTechnologies: string[];
            keywords: string[];
        } | undefined;
    }[];
    targetId: string;
    proposalId: string;
    reviewer: {
        type: "human";
        name?: string | undefined;
    };
}>;
export declare const JobRequirementReviewManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    reviewPath: z.ZodEffects<z.ZodString, string, string>;
    reviewSha256: z.ZodString;
    proposalSha256: z.ZodString;
    deterministicModelSha256: z.ZodString;
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
    deterministicModelSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetId: string;
    proposalId: string;
    proposalSha256: string;
    reviewPath: string;
    reviewSha256: string;
    deterministicModelSha256: string;
}>;
export declare const ApprovedJobRequirementSchema: z.ZodObject<{
    category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
    normalizedLabel: z.ZodString;
    sourceText: z.ZodString;
    necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    explicitness: z.ZodEnum<["explicit", "inferred"]>;
    provenance: z.ZodObject<{
        sourceAnalysisItemId: z.ZodString;
        sourceSectionId: z.ZodNullable<z.ZodString>;
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
        sourceAnalysisItemId: string;
        sourceSectionId: string | null;
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
        sourceAnalysisItemId: string;
        sourceSectionId: string | null;
    }>;
    relationships: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
        requirementId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }, {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }>, "many">;
    namedTechnologies: z.ZodArray<z.ZodString, "many">;
    keywords: z.ZodArray<z.ZodString, "many">;
    notes: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
} & {
    trustState: z.ZodEnum<["human-approved", "human-edited"]>;
    approvalProvenance: z.ZodObject<{
        proposalId: z.ZodString;
        reviewedRequirementId: z.ZodString;
        source: z.ZodEnum<["deterministic", "proposal"]>;
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
        promptTemplateId: z.ZodString;
        promptTemplateVersion: z.ZodString;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        source: "deterministic" | "proposal";
        policyVersion: string;
        proposalId: string;
        promptTemplateId: string;
        promptTemplateVersion: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        reviewedRequirementId: string;
    }, {
        source: "deterministic" | "proposal";
        policyVersion: string;
        proposalId: string;
        promptTemplateId: string;
        promptTemplateVersion: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        reviewedRequirementId: string;
    }>;
}, "strict", z.ZodTypeAny, {
    notes: string[];
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    explicitness: "explicit" | "inferred";
    trustState: "human-approved" | "human-edited";
    approvalProvenance: {
        source: "deterministic" | "proposal";
        policyVersion: string;
        proposalId: string;
        promptTemplateId: string;
        promptTemplateVersion: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        reviewedRequirementId: string;
    };
    provenance: {
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
        sourceAnalysisItemId: string;
        sourceSectionId: string | null;
    };
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    sourceText: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
}, {
    notes: string[];
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    explicitness: "explicit" | "inferred";
    trustState: "human-approved" | "human-edited";
    approvalProvenance: {
        source: "deterministic" | "proposal";
        policyVersion: string;
        proposalId: string;
        promptTemplateId: string;
        promptTemplateVersion: string;
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
        reviewDecision: "accept" | "edit";
        reviewedRequirementId: string;
    };
    provenance: {
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
        sourceAnalysisItemId: string;
        sourceSectionId: string | null;
    };
    confidence: "high" | "medium" | "low";
    normalizedLabel: string;
    sourceText: string;
    relationships: {
        type: "requires" | "related-to" | "alternative-to";
        requirementId: string;
    }[];
    namedTechnologies: string[];
    keywords: string[];
}>;
export declare const ApprovedJobRequirementModelSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    policy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        mode: z.ZodLiteral<"manual">;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
        mode: "manual";
    }, {
        name: string;
        version: string;
        mode: "manual";
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
        structuralAnalysis: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        deterministicModel: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        proposal: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        review: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        normalizedInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        target: {
            sha256: string;
            path: string;
        };
        structuralAnalysis: {
            sha256: string;
            path: string;
        };
        proposal: {
            sha256: string;
            path: string;
        };
        review: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        deterministicModel: {
            sha256: string;
            path: string;
        };
    }, {
        target: {
            sha256: string;
            path: string;
        };
        structuralAnalysis: {
            sha256: string;
            path: string;
        };
        proposal: {
            sha256: string;
            path: string;
        };
        review: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        deterministicModel: {
            sha256: string;
            path: string;
        };
    }>;
    requirements: z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
        normalizedLabel: z.ZodString;
        sourceText: z.ZodString;
        necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        explicitness: z.ZodEnum<["explicit", "inferred"]>;
        provenance: z.ZodObject<{
            sourceAnalysisItemId: z.ZodString;
            sourceSectionId: z.ZodNullable<z.ZodString>;
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        }>;
        relationships: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["requires", "related-to", "alternative-to"]>;
            requirementId: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }, {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }>, "many">;
        namedTechnologies: z.ZodArray<z.ZodString, "many">;
        keywords: z.ZodArray<z.ZodString, "many">;
        notes: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
    } & {
        trustState: z.ZodEnum<["human-approved", "human-edited"]>;
        approvalProvenance: z.ZodObject<{
            proposalId: z.ZodString;
            reviewedRequirementId: z.ZodString;
            source: z.ZodEnum<["deterministic", "proposal"]>;
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
            promptTemplateId: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            source: "deterministic" | "proposal";
            policyVersion: string;
            proposalId: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            reviewedRequirementId: string;
        }, {
            source: "deterministic" | "proposal";
            policyVersion: string;
            proposalId: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            reviewedRequirementId: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        trustState: "human-approved" | "human-edited";
        approvalProvenance: {
            source: "deterministic" | "proposal";
            policyVersion: string;
            proposalId: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            reviewedRequirementId: string;
        };
        provenance: {
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        };
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }, {
        notes: string[];
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        trustState: "human-approved" | "human-edited";
        approvalProvenance: {
            source: "deterministic" | "proposal";
            policyVersion: string;
            proposalId: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            reviewedRequirementId: string;
        };
        provenance: {
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        };
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }>, "many">;
    namedTechnologies: z.ZodArray<z.ZodString, "many">;
    keywords: z.ZodArray<z.ZodString, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_NECESSITY", "AMBIGUOUS_CATEGORY", "VAGUE_SCOPE", "COMPOUND_STATEMENT", "OTHER"]>;
        message: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
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
        code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
        message: string;
        id: string;
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
        sourceAnalysisItemIds: string[];
        requirementIds: string[];
    }, {
        code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
        message: string;
        id: string;
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
        sourceAnalysisItemIds: string[];
        requirementIds: string[];
    }>, "many">;
    contradictions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        message: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
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
        message: string;
        id: string;
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
        requirementIds: string[];
    }, {
        message: string;
        id: string;
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
        requirementIds: string[];
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["AMBIGUOUS_MANDATORY_STATUS", "UNCLASSIFIED_REQUIREMENT", "CONTRADICTORY_REQUIREMENT", "SOURCE_STRUCTURE_INCOMPLETE"]>;
        severity: z.ZodEnum<["high", "medium", "low"]>;
        message: z.ZodString;
        requirementIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low";
        requirementIds: string[];
    }, {
        code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low";
        requirementIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_REQUIREMENTS_FOUND", "FRONT_MATTER_EXCLUDED", "UNKNOWN_SECTION", "AMBIGUOUS_ITEM_PRESERVED", "MODEL_PROPOSAL_REQUIRES_REVIEW"]>;
        message: z.ZodString;
        sourceAnalysisItemIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
        sourceAnalysisItemIds: string[];
    }, {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
        sourceAnalysisItemIds: string[];
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        sourceItemCount: z.ZodNumber;
        modeledItemCount: z.ZodNumber;
        unmodeledItemIds: z.ZodArray<z.ZodString, "many">;
        usableForHumanReview: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    }>;
    trustState: z.ZodLiteral<"human-reviewed">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        target: {
            sha256: string;
            path: string;
        };
        structuralAnalysis: {
            sha256: string;
            path: string;
        };
        proposal: {
            sha256: string;
            path: string;
        };
        review: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        deterministicModel: {
            sha256: string;
            path: string;
        };
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
        sourceAnalysisItemIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
        message: string;
        id: string;
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
        sourceAnalysisItemIds: string[];
        requirementIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    };
    trustState: "human-reviewed";
    requirements: {
        notes: string[];
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        trustState: "human-approved" | "human-edited";
        approvalProvenance: {
            source: "deterministic" | "proposal";
            policyVersion: string;
            proposalId: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            reviewedRequirementId: string;
        };
        provenance: {
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        };
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }[];
    risks: {
        code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low";
        requirementIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
        mode: "manual";
    };
    namedTechnologies: string[];
    keywords: string[];
    contradictions: {
        message: string;
        id: string;
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
        requirementIds: string[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        target: {
            sha256: string;
            path: string;
        };
        structuralAnalysis: {
            sha256: string;
            path: string;
        };
        proposal: {
            sha256: string;
            path: string;
        };
        review: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        deterministicModel: {
            sha256: string;
            path: string;
        };
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_REQUIREMENTS_FOUND" | "FRONT_MATTER_EXCLUDED" | "UNKNOWN_SECTION" | "AMBIGUOUS_ITEM_PRESERVED" | "MODEL_PROPOSAL_REQUIRES_REVIEW";
        message: string;
        id: string;
        sourceAnalysisItemIds: string[];
    }[];
    ambiguities: {
        code: "AMBIGUOUS_NECESSITY" | "OTHER" | "AMBIGUOUS_CATEGORY" | "VAGUE_SCOPE" | "COMPOUND_STATEMENT";
        message: string;
        id: string;
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
        sourceAnalysisItemIds: string[];
        requirementIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        sourceItemCount: number;
        modeledItemCount: number;
        unmodeledItemIds: string[];
        usableForHumanReview: boolean;
    };
    trustState: "human-reviewed";
    requirements: {
        notes: string[];
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        explicitness: "explicit" | "inferred";
        trustState: "human-approved" | "human-edited";
        approvalProvenance: {
            source: "deterministic" | "proposal";
            policyVersion: string;
            proposalId: string;
            promptTemplateId: string;
            promptTemplateVersion: string;
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
            reviewDecision: "accept" | "edit";
            reviewedRequirementId: string;
        };
        provenance: {
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
            sourceAnalysisItemId: string;
            sourceSectionId: string | null;
        };
        confidence: "high" | "medium" | "low";
        normalizedLabel: string;
        sourceText: string;
        relationships: {
            type: "requires" | "related-to" | "alternative-to";
            requirementId: string;
        }[];
        namedTechnologies: string[];
        keywords: string[];
    }[];
    risks: {
        code: "AMBIGUOUS_MANDATORY_STATUS" | "UNCLASSIFIED_REQUIREMENT" | "CONTRADICTORY_REQUIREMENT" | "SOURCE_STRUCTURE_INCOMPLETE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low";
        requirementIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
        mode: "manual";
    };
    namedTechnologies: string[];
    keywords: string[];
    contradictions: {
        message: string;
        id: string;
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
        requirementIds: string[];
    }[];
}>;
export declare const ApprovedJobRequirementManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    modelId: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    approvedModelPath: z.ZodEffects<z.ZodString, string, string>;
    approvedModelSha256: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    sourceSha256: z.ZodString;
    structuralAnalysisSha256: z.ZodString;
    deterministicModelSha256: z.ZodString;
    proposalId: z.ZodString;
    proposalSha256: z.ZodString;
    reviewSha256: z.ZodString;
    promptTemplateId: z.ZodString;
    promptTemplateVersion: z.ZodString;
    normalizedInputSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    proposalId: string;
    proposalSha256: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    reviewSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    modelId: string;
    deterministicModelSha256: string;
    approvedModelPath: string;
    approvedModelSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    policyVersion: string;
    structuralAnalysisSha256: string;
    proposalId: string;
    proposalSha256: string;
    promptTemplateId: string;
    promptTemplateVersion: string;
    reviewSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    modelId: string;
    deterministicModelSha256: string;
    approvedModelPath: string;
    approvedModelSha256: string;
}>;
export type JobRequirementCategory = z.infer<typeof JobRequirementCategorySchema>;
export type JobRequirementNecessity = z.infer<typeof JobRequirementNecessitySchema>;
export type JobRequirement = z.infer<typeof JobRequirementSchema>;
export type JobRequirementModel = z.infer<typeof JobRequirementModelSchema>;
export type JobRequirementModelManifest = z.infer<typeof JobRequirementModelManifestSchema>;
export type ModelJobRequirementPayload = z.infer<typeof ModelJobRequirementPayloadSchema>;
export type ProposedJobRequirement = z.infer<typeof ProposedJobRequirementSchema>;
export type JobRequirementProposal = z.infer<typeof JobRequirementProposalSchema>;
export type JobRequirementProposalManifest = z.infer<typeof JobRequirementProposalManifestSchema>;
export type EditedJobRequirement = z.infer<typeof EditedJobRequirementSchema>;
export type JobRequirementReviewDecision = z.infer<typeof JobRequirementReviewDecisionSchema>;
export type JobRequirementProposalReview = z.infer<typeof JobRequirementProposalReviewSchema>;
export type JobRequirementReviewManifest = z.infer<typeof JobRequirementReviewManifestSchema>;
export type ApprovedJobRequirement = z.infer<typeof ApprovedJobRequirementSchema>;
export type ApprovedJobRequirementModel = z.infer<typeof ApprovedJobRequirementModelSchema>;
export type ApprovedJobRequirementManifest = z.infer<typeof ApprovedJobRequirementManifestSchema>;
