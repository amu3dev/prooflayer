import { z } from "zod";
export declare const JobRequirementCoverageStateSchema: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
export declare const JobRequirementEvidenceQualitySchema: z.ZodEnum<["strong", "adequate", "limited", "mixed", "unavailable"]>;
export declare const JobCoverageDependencySchema: z.ZodObject<{
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
}, {
    sha256: string;
    path: string;
}>;
export declare const JobCoverageComponentSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    normalizedLabel: z.ZodString;
    status: z.ZodEnum<["supported", "unsupported", "indeterminate"]>;
    mappedLinkIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "unsupported" | "supported" | "indeterminate";
    id: string;
    normalizedLabel: string;
    label: string;
    mappedLinkIds: string[];
}, {
    status: "unsupported" | "supported" | "indeterminate";
    id: string;
    normalizedLabel: string;
    label: string;
    mappedLinkIds: string[];
}>;
export declare const JobCoverageEvidenceLinkReferenceSchema: z.ZodEffects<z.ZodObject<{
    linkId: z.ZodString;
    linkSha256: z.ZodString;
    evidenceId: z.ZodString;
    claimId: z.ZodString;
    relationship: z.ZodEnum<["direct", "supporting", "partial", "contradiction"]>;
    contradictionApproved: z.ZodOptional<z.ZodLiteral<true>>;
    evidenceStrength: z.ZodEnum<["strong", "medium", "weak"]>;
    linkConfidence: z.ZodEnum<["high", "medium", "low"]>;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    evidenceId: string;
    evidenceStrength: "medium" | "strong" | "weak";
    relationship: "partial" | "direct" | "supporting" | "contradiction";
    linkConfidence: "high" | "medium" | "low";
    linkId: string;
    linkSha256: string;
    contradictionApproved?: true | undefined;
}, {
    claimId: string;
    evidenceId: string;
    evidenceStrength: "medium" | "strong" | "weak";
    relationship: "partial" | "direct" | "supporting" | "contradiction";
    linkConfidence: "high" | "medium" | "low";
    linkId: string;
    linkSha256: string;
    contradictionApproved?: true | undefined;
}>, {
    claimId: string;
    evidenceId: string;
    evidenceStrength: "medium" | "strong" | "weak";
    relationship: "partial" | "direct" | "supporting" | "contradiction";
    linkConfidence: "high" | "medium" | "low";
    linkId: string;
    linkSha256: string;
    contradictionApproved?: true | undefined;
}, {
    claimId: string;
    evidenceId: string;
    evidenceStrength: "medium" | "strong" | "weak";
    relationship: "partial" | "direct" | "supporting" | "contradiction";
    linkConfidence: "high" | "medium" | "low";
    linkId: string;
    linkSha256: string;
    contradictionApproved?: true | undefined;
}>;
export declare const JobCoverageEvidenceMapProvenanceSchema: z.ZodObject<{
    evidenceMapPath: z.ZodEffects<z.ZodString, string, string>;
    evidenceMapSha256: z.ZodString;
    requirementMappingId: z.ZodString;
    requirementMappingSha256: z.ZodString;
    links: z.ZodArray<z.ZodEffects<z.ZodObject<{
        linkId: z.ZodString;
        linkSha256: z.ZodString;
        evidenceId: z.ZodString;
        claimId: z.ZodString;
        relationship: z.ZodEnum<["direct", "supporting", "partial", "contradiction"]>;
        contradictionApproved: z.ZodOptional<z.ZodLiteral<true>>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak"]>;
        linkConfidence: z.ZodEnum<["high", "medium", "low"]>;
    }, "strict", z.ZodTypeAny, {
        claimId: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
        relationship: "partial" | "direct" | "supporting" | "contradiction";
        linkConfidence: "high" | "medium" | "low";
        linkId: string;
        linkSha256: string;
        contradictionApproved?: true | undefined;
    }, {
        claimId: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
        relationship: "partial" | "direct" | "supporting" | "contradiction";
        linkConfidence: "high" | "medium" | "low";
        linkId: string;
        linkSha256: string;
        contradictionApproved?: true | undefined;
    }>, {
        claimId: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
        relationship: "partial" | "direct" | "supporting" | "contradiction";
        linkConfidence: "high" | "medium" | "low";
        linkId: string;
        linkSha256: string;
        contradictionApproved?: true | undefined;
    }, {
        claimId: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
        relationship: "partial" | "direct" | "supporting" | "contradiction";
        linkConfidence: "high" | "medium" | "low";
        linkId: string;
        linkSha256: string;
        contradictionApproved?: true | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    links: {
        claimId: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
        relationship: "partial" | "direct" | "supporting" | "contradiction";
        linkConfidence: "high" | "medium" | "low";
        linkId: string;
        linkSha256: string;
        contradictionApproved?: true | undefined;
    }[];
    evidenceMapPath: string;
    evidenceMapSha256: string;
    requirementMappingId: string;
    requirementMappingSha256: string;
}, {
    links: {
        claimId: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
        relationship: "partial" | "direct" | "supporting" | "contradiction";
        linkConfidence: "high" | "medium" | "low";
        linkId: string;
        linkSha256: string;
        contradictionApproved?: true | undefined;
    }[];
    evidenceMapPath: string;
    evidenceMapSha256: string;
    requirementMappingId: string;
    requirementMappingSha256: string;
}>;
export declare const JobCoverageLinkCountsSchema: z.ZodObject<{
    direct: z.ZodNumber;
    supporting: z.ZodNumber;
    partial: z.ZodNumber;
    contradiction: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    partial: number;
    direct: number;
    supporting: number;
    contradiction: number;
}, {
    partial: number;
    direct: number;
    supporting: number;
    contradiction: number;
}>;
export declare const JobRequirementCoverageSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    requirementId: z.ZodString;
    category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
    necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
    normalizedLabel: z.ZodString;
    state: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
    mappedLinkIds: z.ZodArray<z.ZodString, "many">;
    linkCounts: z.ZodObject<{
        direct: z.ZodNumber;
        supporting: z.ZodNumber;
        partial: z.ZodNumber;
        contradiction: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        partial: number;
        direct: number;
        supporting: number;
        contradiction: number;
    }, {
        partial: number;
        direct: number;
        supporting: number;
        contradiction: number;
    }>;
    evidenceQuality: z.ZodEnum<["strong", "adequate", "limited", "mixed", "unavailable"]>;
    components: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        normalizedLabel: z.ZodString;
        status: z.ZodEnum<["supported", "unsupported", "indeterminate"]>;
        mappedLinkIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "unsupported" | "supported" | "indeterminate";
        id: string;
        normalizedLabel: string;
        label: string;
        mappedLinkIds: string[];
    }, {
        status: "unsupported" | "supported" | "indeterminate";
        id: string;
        normalizedLabel: string;
        label: string;
        mappedLinkIds: string[];
    }>, "many">;
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
    evidenceMapProvenance: z.ZodObject<{
        evidenceMapPath: z.ZodEffects<z.ZodString, string, string>;
        evidenceMapSha256: z.ZodString;
        requirementMappingId: z.ZodString;
        requirementMappingSha256: z.ZodString;
        links: z.ZodArray<z.ZodEffects<z.ZodObject<{
            linkId: z.ZodString;
            linkSha256: z.ZodString;
            evidenceId: z.ZodString;
            claimId: z.ZodString;
            relationship: z.ZodEnum<["direct", "supporting", "partial", "contradiction"]>;
            contradictionApproved: z.ZodOptional<z.ZodLiteral<true>>;
            evidenceStrength: z.ZodEnum<["strong", "medium", "weak"]>;
            linkConfidence: z.ZodEnum<["high", "medium", "low"]>;
        }, "strict", z.ZodTypeAny, {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }>, {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }, {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        links: {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }[];
        evidenceMapPath: string;
        evidenceMapSha256: string;
        requirementMappingId: string;
        requirementMappingSha256: string;
    }, {
        links: {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }[];
        evidenceMapPath: string;
        evidenceMapSha256: string;
        requirementMappingId: string;
        requirementMappingSha256: string;
    }>;
    openQuestions: z.ZodArray<z.ZodString, "many">;
    ambiguities: z.ZodArray<z.ZodString, "many">;
    warnings: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    warnings: string[];
    ambiguities: string[];
    state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    requirementId: string;
    normalizedLabel: string;
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
    mappedLinkIds: string[];
    linkCounts: {
        partial: number;
        direct: number;
        supporting: number;
        contradiction: number;
    };
    evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
    components: {
        status: "unsupported" | "supported" | "indeterminate";
        id: string;
        normalizedLabel: string;
        label: string;
        mappedLinkIds: string[];
    }[];
    evidenceMapProvenance: {
        links: {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }[];
        evidenceMapPath: string;
        evidenceMapSha256: string;
        requirementMappingId: string;
        requirementMappingSha256: string;
    };
    openQuestions: string[];
}, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    warnings: string[];
    ambiguities: string[];
    state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    requirementId: string;
    normalizedLabel: string;
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
    mappedLinkIds: string[];
    linkCounts: {
        partial: number;
        direct: number;
        supporting: number;
        contradiction: number;
    };
    evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
    components: {
        status: "unsupported" | "supported" | "indeterminate";
        id: string;
        normalizedLabel: string;
        label: string;
        mappedLinkIds: string[];
    }[];
    evidenceMapProvenance: {
        links: {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }[];
        evidenceMapPath: string;
        evidenceMapSha256: string;
        requirementMappingId: string;
        requirementMappingSha256: string;
    };
    openQuestions: string[];
}>, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    warnings: string[];
    ambiguities: string[];
    state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    requirementId: string;
    normalizedLabel: string;
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
    mappedLinkIds: string[];
    linkCounts: {
        partial: number;
        direct: number;
        supporting: number;
        contradiction: number;
    };
    evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
    components: {
        status: "unsupported" | "supported" | "indeterminate";
        id: string;
        normalizedLabel: string;
        label: string;
        mappedLinkIds: string[];
    }[];
    evidenceMapProvenance: {
        links: {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }[];
        evidenceMapPath: string;
        evidenceMapSha256: string;
        requirementMappingId: string;
        requirementMappingSha256: string;
    };
    openQuestions: string[];
}, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    warnings: string[];
    ambiguities: string[];
    state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    requirementId: string;
    normalizedLabel: string;
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
    mappedLinkIds: string[];
    linkCounts: {
        partial: number;
        direct: number;
        supporting: number;
        contradiction: number;
    };
    evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
    components: {
        status: "unsupported" | "supported" | "indeterminate";
        id: string;
        normalizedLabel: string;
        label: string;
        mappedLinkIds: string[];
    }[];
    evidenceMapProvenance: {
        links: {
            claimId: string;
            evidenceId: string;
            evidenceStrength: "medium" | "strong" | "weak";
            relationship: "partial" | "direct" | "supporting" | "contradiction";
            linkConfidence: "high" | "medium" | "low";
            linkId: string;
            linkSha256: string;
            contradictionApproved?: true | undefined;
        }[];
        evidenceMapPath: string;
        evidenceMapSha256: string;
        requirementMappingId: string;
        requirementMappingSha256: string;
    };
    openQuestions: string[];
}>;
export declare const JobCoverageCompletenessSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodEnum<["empty", "complete"]>;
    requirementCount: z.ZodNumber;
    processedRequirementCount: z.ZodNumber;
    readyForDownstreamAssessment: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementCount: number;
    processedRequirementCount: number;
    readyForDownstreamAssessment: boolean;
}, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementCount: number;
    processedRequirementCount: number;
    readyForDownstreamAssessment: boolean;
}>, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementCount: number;
    processedRequirementCount: number;
    readyForDownstreamAssessment: boolean;
}, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementCount: number;
    processedRequirementCount: number;
    readyForDownstreamAssessment: boolean;
}>;
export declare const JobRequirementCoverageModelSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    analyzer: z.ZodObject<{
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
    policy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
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
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        requirementManifest: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        evidenceMap: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        evidenceMapManifest: z.ZodObject<{
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
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
        };
        evidenceMapManifest: {
            sha256: string;
            path: string;
        };
    }, {
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
        };
        evidenceMapManifest: {
            sha256: string;
            path: string;
        };
    }>;
    requirements: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        requirementId: z.ZodString;
        category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
        necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
        normalizedLabel: z.ZodString;
        state: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
        mappedLinkIds: z.ZodArray<z.ZodString, "many">;
        linkCounts: z.ZodObject<{
            direct: z.ZodNumber;
            supporting: z.ZodNumber;
            partial: z.ZodNumber;
            contradiction: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            partial: number;
            direct: number;
            supporting: number;
            contradiction: number;
        }, {
            partial: number;
            direct: number;
            supporting: number;
            contradiction: number;
        }>;
        evidenceQuality: z.ZodEnum<["strong", "adequate", "limited", "mixed", "unavailable"]>;
        components: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            normalizedLabel: z.ZodString;
            status: z.ZodEnum<["supported", "unsupported", "indeterminate"]>;
            mappedLinkIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            status: "unsupported" | "supported" | "indeterminate";
            id: string;
            normalizedLabel: string;
            label: string;
            mappedLinkIds: string[];
        }, {
            status: "unsupported" | "supported" | "indeterminate";
            id: string;
            normalizedLabel: string;
            label: string;
            mappedLinkIds: string[];
        }>, "many">;
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
        evidenceMapProvenance: z.ZodObject<{
            evidenceMapPath: z.ZodEffects<z.ZodString, string, string>;
            evidenceMapSha256: z.ZodString;
            requirementMappingId: z.ZodString;
            requirementMappingSha256: z.ZodString;
            links: z.ZodArray<z.ZodEffects<z.ZodObject<{
                linkId: z.ZodString;
                linkSha256: z.ZodString;
                evidenceId: z.ZodString;
                claimId: z.ZodString;
                relationship: z.ZodEnum<["direct", "supporting", "partial", "contradiction"]>;
                contradictionApproved: z.ZodOptional<z.ZodLiteral<true>>;
                evidenceStrength: z.ZodEnum<["strong", "medium", "weak"]>;
                linkConfidence: z.ZodEnum<["high", "medium", "low"]>;
            }, "strict", z.ZodTypeAny, {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }>, {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }, {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            links: {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }[];
            evidenceMapPath: string;
            evidenceMapSha256: string;
            requirementMappingId: string;
            requirementMappingSha256: string;
        }, {
            links: {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }[];
            evidenceMapPath: string;
            evidenceMapSha256: string;
            requirementMappingId: string;
            requirementMappingSha256: string;
        }>;
        openQuestions: z.ZodArray<z.ZodString, "many">;
        ambiguities: z.ZodArray<z.ZodString, "many">;
        warnings: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        warnings: string[];
        ambiguities: string[];
        state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        requirementId: string;
        normalizedLabel: string;
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
        mappedLinkIds: string[];
        linkCounts: {
            partial: number;
            direct: number;
            supporting: number;
            contradiction: number;
        };
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        components: {
            status: "unsupported" | "supported" | "indeterminate";
            id: string;
            normalizedLabel: string;
            label: string;
            mappedLinkIds: string[];
        }[];
        evidenceMapProvenance: {
            links: {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }[];
            evidenceMapPath: string;
            evidenceMapSha256: string;
            requirementMappingId: string;
            requirementMappingSha256: string;
        };
        openQuestions: string[];
    }, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        warnings: string[];
        ambiguities: string[];
        state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        requirementId: string;
        normalizedLabel: string;
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
        mappedLinkIds: string[];
        linkCounts: {
            partial: number;
            direct: number;
            supporting: number;
            contradiction: number;
        };
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        components: {
            status: "unsupported" | "supported" | "indeterminate";
            id: string;
            normalizedLabel: string;
            label: string;
            mappedLinkIds: string[];
        }[];
        evidenceMapProvenance: {
            links: {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }[];
            evidenceMapPath: string;
            evidenceMapSha256: string;
            requirementMappingId: string;
            requirementMappingSha256: string;
        };
        openQuestions: string[];
    }>, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        warnings: string[];
        ambiguities: string[];
        state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        requirementId: string;
        normalizedLabel: string;
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
        mappedLinkIds: string[];
        linkCounts: {
            partial: number;
            direct: number;
            supporting: number;
            contradiction: number;
        };
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        components: {
            status: "unsupported" | "supported" | "indeterminate";
            id: string;
            normalizedLabel: string;
            label: string;
            mappedLinkIds: string[];
        }[];
        evidenceMapProvenance: {
            links: {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }[];
            evidenceMapPath: string;
            evidenceMapSha256: string;
            requirementMappingId: string;
            requirementMappingSha256: string;
        };
        openQuestions: string[];
    }, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        warnings: string[];
        ambiguities: string[];
        state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        requirementId: string;
        normalizedLabel: string;
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
        mappedLinkIds: string[];
        linkCounts: {
            partial: number;
            direct: number;
            supporting: number;
            contradiction: number;
        };
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        components: {
            status: "unsupported" | "supported" | "indeterminate";
            id: string;
            normalizedLabel: string;
            label: string;
            mappedLinkIds: string[];
        }[];
        evidenceMapProvenance: {
            links: {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }[];
            evidenceMapPath: string;
            evidenceMapSha256: string;
            requirementMappingId: string;
            requirementMappingSha256: string;
        };
        openQuestions: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodString, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "complete"]>;
        requirementCount: z.ZodNumber;
        processedRequirementCount: z.ZodNumber;
        readyForDownstreamAssessment: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        readyForDownstreamAssessment: boolean;
    }, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        readyForDownstreamAssessment: boolean;
    }>, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        readyForDownstreamAssessment: boolean;
    }, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        readyForDownstreamAssessment: boolean;
    }>;
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
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
        };
        evidenceMapManifest: {
            sha256: string;
            path: string;
        };
    };
    targetType: "job";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: string[];
    completeness: {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        readyForDownstreamAssessment: boolean;
    };
    requirements: {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        warnings: string[];
        ambiguities: string[];
        state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        requirementId: string;
        normalizedLabel: string;
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
        mappedLinkIds: string[];
        linkCounts: {
            partial: number;
            direct: number;
            supporting: number;
            contradiction: number;
        };
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        components: {
            status: "unsupported" | "supported" | "indeterminate";
            id: string;
            normalizedLabel: string;
            label: string;
            mappedLinkIds: string[];
        }[];
        evidenceMapProvenance: {
            links: {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }[];
            evidenceMapPath: string;
            evidenceMapSha256: string;
            requirementMappingId: string;
            requirementMappingSha256: string;
        };
        openQuestions: string[];
    }[];
    policy: {
        name: string;
        version: string;
    };
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
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceMap: {
            sha256: string;
            path: string;
        };
        evidenceMapManifest: {
            sha256: string;
            path: string;
        };
    };
    targetType: "job";
    targetId: string;
    analyzer: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    warnings: string[];
    completeness: {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        readyForDownstreamAssessment: boolean;
    };
    requirements: {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        warnings: string[];
        ambiguities: string[];
        state: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        requirementId: string;
        normalizedLabel: string;
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
        mappedLinkIds: string[];
        linkCounts: {
            partial: number;
            direct: number;
            supporting: number;
            contradiction: number;
        };
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        components: {
            status: "unsupported" | "supported" | "indeterminate";
            id: string;
            normalizedLabel: string;
            label: string;
            mappedLinkIds: string[];
        }[];
        evidenceMapProvenance: {
            links: {
                claimId: string;
                evidenceId: string;
                evidenceStrength: "medium" | "strong" | "weak";
                relationship: "partial" | "direct" | "supporting" | "contradiction";
                linkConfidence: "high" | "medium" | "low";
                linkId: string;
                linkSha256: string;
                contradictionApproved?: true | undefined;
            }[];
            evidenceMapPath: string;
            evidenceMapSha256: string;
            requirementMappingId: string;
            requirementMappingSha256: string;
        };
        openQuestions: string[];
    }[];
    policy: {
        name: string;
        version: string;
    };
}>;
export declare const JobRequirementCoverageManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    coverageId: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    coveragePath: z.ZodEffects<z.ZodString, string, string>;
    coverageSha256: z.ZodString;
    analyzerName: z.ZodString;
    analyzerVersion: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    sourceSha256: z.ZodString;
    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
    requirementModelSha256: z.ZodString;
    requirementManifestSha256: z.ZodString;
    evidenceMapSha256: z.ZodString;
    evidenceMapManifestSha256: z.ZodString;
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
    analyzerName: string;
    analyzerVersion: string;
    policyVersion: string;
    policyName: string;
    normalizedInputSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceMapSha256: string;
    coverageId: string;
    coveragePath: string;
    coverageSha256: string;
    evidenceMapManifestSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    analyzerName: string;
    analyzerVersion: string;
    policyVersion: string;
    policyName: string;
    normalizedInputSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceMapSha256: string;
    coverageId: string;
    coveragePath: string;
    coverageSha256: string;
    evidenceMapManifestSha256: string;
}>;
export type JobRequirementCoverageState = z.infer<typeof JobRequirementCoverageStateSchema>;
export type JobRequirementEvidenceQuality = z.infer<typeof JobRequirementEvidenceQualitySchema>;
export type JobCoverageComponent = z.infer<typeof JobCoverageComponentSchema>;
export type JobRequirementCoverage = z.infer<typeof JobRequirementCoverageSchema>;
export type JobRequirementCoverageModel = z.infer<typeof JobRequirementCoverageModelSchema>;
export type JobRequirementCoverageManifest = z.infer<typeof JobRequirementCoverageManifestSchema>;
