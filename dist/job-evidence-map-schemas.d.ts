import { z } from "zod";
export declare const JobEvidenceRelationshipSchema: z.ZodEnum<["direct", "supporting", "partial"]>;
export declare const JobEvidenceStrengthSchema: z.ZodEnum<["strong", "medium", "weak"]>;
export declare const JobEvidenceLinkConfidenceSchema: z.ZodEnum<["high", "medium", "low"]>;
export declare const JobRequirementInputTypeSchema: z.ZodEnum<["deterministic", "approved"]>;
export declare const JobEvidenceMapDependencySchema: z.ZodObject<{
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
}, {
    sha256: string;
    path: string;
}>;
export declare const JobRequirementLinkProvenanceSchema: z.ZodObject<{
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
export declare const JobCandidateEvidenceProvenanceSchema: z.ZodObject<{
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
    evidenceItemSha256: string;
    evidenceItemPath: string;
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
    evidenceItemSha256: string;
    evidenceItemPath: string;
    claimPath: string;
    claimSha256: string;
}>;
export declare const JobEvidenceMatchedSignalSchema: z.ZodObject<{
    type: z.ZodEnum<["exact-phrase", "technology", "domain", "keyword"]>;
    value: z.ZodString;
}, "strict", z.ZodTypeAny, {
    value: string;
    type: "domain" | "exact-phrase" | "technology" | "keyword";
}, {
    value: string;
    type: "domain" | "exact-phrase" | "technology" | "keyword";
}>;
export declare const JobEvidenceLinkSchema: z.ZodObject<{
    id: z.ZodString;
    requirementId: z.ZodString;
    evidenceId: z.ZodString;
    claimId: z.ZodString;
    relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
    evidenceStrength: z.ZodEnum<["strong", "medium", "weak"]>;
    linkConfidence: z.ZodEnum<["high", "medium", "low"]>;
    matchedSignals: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["exact-phrase", "technology", "domain", "keyword"]>;
        value: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        value: string;
        type: "domain" | "exact-phrase" | "technology" | "keyword";
    }, {
        value: string;
        type: "domain" | "exact-phrase" | "technology" | "keyword";
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
        evidenceItemSha256: string;
        evidenceItemPath: string;
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
        evidenceItemSha256: string;
        evidenceItemPath: string;
        claimPath: string;
        claimSha256: string;
    }>;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    id: string;
    evidenceId: string;
    evidenceStrength: "medium" | "strong" | "weak";
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
        evidenceItemSha256: string;
        evidenceItemPath: string;
        claimPath: string;
        claimSha256: string;
    };
    requirementId: string;
    relationship: "partial" | "direct" | "supporting";
    linkConfidence: "high" | "medium" | "low";
    matchedSignals: {
        value: string;
        type: "domain" | "exact-phrase" | "technology" | "keyword";
    }[];
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
}, {
    claimId: string;
    id: string;
    evidenceId: string;
    evidenceStrength: "medium" | "strong" | "weak";
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
        evidenceItemSha256: string;
        evidenceItemPath: string;
        claimPath: string;
        claimSha256: string;
    };
    requirementId: string;
    relationship: "partial" | "direct" | "supporting";
    linkConfidence: "high" | "medium" | "low";
    matchedSignals: {
        value: string;
        type: "domain" | "exact-phrase" | "technology" | "keyword";
    }[];
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
}>;
export declare const JobRequirementEvidenceMappingSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    requirementId: z.ZodString;
    status: z.ZodEnum<["supported", "unsupported"]>;
    linkIds: z.ZodArray<z.ZodString, "many">;
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
}, "strict", z.ZodTypeAny, {
    status: "unsupported" | "supported";
    id: string;
    requirementId: string;
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
    linkIds: string[];
}, {
    status: "unsupported" | "supported";
    id: string;
    requirementId: string;
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
    linkIds: string[];
}>, {
    status: "unsupported" | "supported";
    id: string;
    requirementId: string;
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
    linkIds: string[];
}, {
    status: "unsupported" | "supported";
    id: string;
    requirementId: string;
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
    linkIds: string[];
}>;
export declare const JobEvidenceMapWarningSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["NO_ELIGIBLE_EVIDENCE", "REQUIREMENT_UNSUPPORTED"]>;
    message: z.ZodString;
    requirementId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    code: "NO_ELIGIBLE_EVIDENCE" | "REQUIREMENT_UNSUPPORTED";
    message: string;
    id: string;
    requirementId?: string | undefined;
}, {
    code: "NO_ELIGIBLE_EVIDENCE" | "REQUIREMENT_UNSUPPORTED";
    message: string;
    id: string;
    requirementId?: string | undefined;
}>;
export declare const JobEvidenceMapCompletenessSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodEnum<["empty", "complete"]>;
    requirementCount: z.ZodNumber;
    processedRequirementCount: z.ZodNumber;
    supportedRequirementCount: z.ZodNumber;
    unsupportedRequirementCount: z.ZodNumber;
    linkCount: z.ZodNumber;
    readyForDownstreamAssessment: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementCount: number;
    processedRequirementCount: number;
    supportedRequirementCount: number;
    unsupportedRequirementCount: number;
    linkCount: number;
    readyForDownstreamAssessment: boolean;
}, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementCount: number;
    processedRequirementCount: number;
    supportedRequirementCount: number;
    unsupportedRequirementCount: number;
    linkCount: number;
    readyForDownstreamAssessment: boolean;
}>, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementCount: number;
    processedRequirementCount: number;
    supportedRequirementCount: number;
    unsupportedRequirementCount: number;
    linkCount: number;
    readyForDownstreamAssessment: boolean;
}, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementCount: number;
    processedRequirementCount: number;
    supportedRequirementCount: number;
    unsupportedRequirementCount: number;
    linkCount: number;
    readyForDownstreamAssessment: boolean;
}>;
export declare const JobEvidenceMapSchema: z.ZodObject<{
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
    input: z.ZodEffects<z.ZodObject<{
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
        evidencePin: z.ZodOptional<z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>>;
        evidencePinManifest: z.ZodOptional<z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>>;
        evidenceSnapshot: z.ZodOptional<z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>>;
        evidenceSnapshotManifest: z.ZodOptional<z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>>;
        evidenceSnapshotId: z.ZodOptional<z.ZodString>;
        evidenceSnapshotSchemaVersion: z.ZodOptional<z.ZodLiteral<1>>;
        evidenceSnapshotContractName: z.ZodOptional<z.ZodLiteral<"evidence-snapshot">>;
        evidenceSnapshotPolicyName: z.ZodOptional<z.ZodLiteral<"evidence-snapshot-policy">>;
        evidenceSnapshotPolicyVersion: z.ZodOptional<z.ZodLiteral<"2">>;
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
        eligibleEvidenceSetSha256: z.ZodString;
        normalizedInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sources: {
            sha256: string;
            path: string;
        };
        eligibleEvidenceSetSha256: string;
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        claims: {
            sha256: string;
            path: string;
        };
        evidenceItems: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceSnapshot?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePin?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePinManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotId?: string | undefined;
        evidenceSnapshotSchemaVersion?: 1 | undefined;
        evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
        evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
        evidenceSnapshotPolicyVersion?: "2" | undefined;
    }, {
        sources: {
            sha256: string;
            path: string;
        };
        eligibleEvidenceSetSha256: string;
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        claims: {
            sha256: string;
            path: string;
        };
        evidenceItems: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceSnapshot?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePin?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePinManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotId?: string | undefined;
        evidenceSnapshotSchemaVersion?: 1 | undefined;
        evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
        evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
        evidenceSnapshotPolicyVersion?: "2" | undefined;
    }>, {
        sources: {
            sha256: string;
            path: string;
        };
        eligibleEvidenceSetSha256: string;
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        claims: {
            sha256: string;
            path: string;
        };
        evidenceItems: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceSnapshot?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePin?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePinManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotId?: string | undefined;
        evidenceSnapshotSchemaVersion?: 1 | undefined;
        evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
        evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
        evidenceSnapshotPolicyVersion?: "2" | undefined;
    }, {
        sources: {
            sha256: string;
            path: string;
        };
        eligibleEvidenceSetSha256: string;
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        claims: {
            sha256: string;
            path: string;
        };
        evidenceItems: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceSnapshot?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePin?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePinManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotId?: string | undefined;
        evidenceSnapshotSchemaVersion?: 1 | undefined;
        evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
        evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
        evidenceSnapshotPolicyVersion?: "2" | undefined;
    }>;
    links: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        requirementId: z.ZodString;
        evidenceId: z.ZodString;
        claimId: z.ZodString;
        relationship: z.ZodEnum<["direct", "supporting", "partial"]>;
        evidenceStrength: z.ZodEnum<["strong", "medium", "weak"]>;
        linkConfidence: z.ZodEnum<["high", "medium", "low"]>;
        matchedSignals: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["exact-phrase", "technology", "domain", "keyword"]>;
            value: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            value: string;
            type: "domain" | "exact-phrase" | "technology" | "keyword";
        }, {
            value: string;
            type: "domain" | "exact-phrase" | "technology" | "keyword";
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
            evidenceItemSha256: string;
            evidenceItemPath: string;
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
            evidenceItemSha256: string;
            evidenceItemPath: string;
            claimPath: string;
            claimSha256: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        claimId: string;
        id: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
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
            evidenceItemSha256: string;
            evidenceItemPath: string;
            claimPath: string;
            claimSha256: string;
        };
        requirementId: string;
        relationship: "partial" | "direct" | "supporting";
        linkConfidence: "high" | "medium" | "low";
        matchedSignals: {
            value: string;
            type: "domain" | "exact-phrase" | "technology" | "keyword";
        }[];
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
    }, {
        claimId: string;
        id: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
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
            evidenceItemSha256: string;
            evidenceItemPath: string;
            claimPath: string;
            claimSha256: string;
        };
        requirementId: string;
        relationship: "partial" | "direct" | "supporting";
        linkConfidence: "high" | "medium" | "low";
        matchedSignals: {
            value: string;
            type: "domain" | "exact-phrase" | "technology" | "keyword";
        }[];
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
    }>, "many">;
    requirementMappings: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        requirementId: z.ZodString;
        status: z.ZodEnum<["supported", "unsupported"]>;
        linkIds: z.ZodArray<z.ZodString, "many">;
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
    }, "strict", z.ZodTypeAny, {
        status: "unsupported" | "supported";
        id: string;
        requirementId: string;
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
        linkIds: string[];
    }, {
        status: "unsupported" | "supported";
        id: string;
        requirementId: string;
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
        linkIds: string[];
    }>, {
        status: "unsupported" | "supported";
        id: string;
        requirementId: string;
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
        linkIds: string[];
    }, {
        status: "unsupported" | "supported";
        id: string;
        requirementId: string;
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
        linkIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_ELIGIBLE_EVIDENCE", "REQUIREMENT_UNSUPPORTED"]>;
        message: z.ZodString;
        requirementId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        code: "NO_ELIGIBLE_EVIDENCE" | "REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        requirementId?: string | undefined;
    }, {
        code: "NO_ELIGIBLE_EVIDENCE" | "REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        requirementId?: string | undefined;
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "complete"]>;
        requirementCount: z.ZodNumber;
        processedRequirementCount: z.ZodNumber;
        supportedRequirementCount: z.ZodNumber;
        unsupportedRequirementCount: z.ZodNumber;
        linkCount: z.ZodNumber;
        readyForDownstreamAssessment: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        supportedRequirementCount: number;
        unsupportedRequirementCount: number;
        linkCount: number;
        readyForDownstreamAssessment: boolean;
    }, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        supportedRequirementCount: number;
        unsupportedRequirementCount: number;
        linkCount: number;
        readyForDownstreamAssessment: boolean;
    }>, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        supportedRequirementCount: number;
        unsupportedRequirementCount: number;
        linkCount: number;
        readyForDownstreamAssessment: boolean;
    }, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        supportedRequirementCount: number;
        unsupportedRequirementCount: number;
        linkCount: number;
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
        sources: {
            sha256: string;
            path: string;
        };
        eligibleEvidenceSetSha256: string;
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        claims: {
            sha256: string;
            path: string;
        };
        evidenceItems: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceSnapshot?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePin?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePinManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotId?: string | undefined;
        evidenceSnapshotSchemaVersion?: 1 | undefined;
        evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
        evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
        evidenceSnapshotPolicyVersion?: "2" | undefined;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        requirementId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        supportedRequirementCount: number;
        unsupportedRequirementCount: number;
        linkCount: number;
        readyForDownstreamAssessment: boolean;
    };
    policy: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    links: {
        claimId: string;
        id: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
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
            evidenceItemSha256: string;
            evidenceItemPath: string;
            claimPath: string;
            claimSha256: string;
        };
        requirementId: string;
        relationship: "partial" | "direct" | "supporting";
        linkConfidence: "high" | "medium" | "low";
        matchedSignals: {
            value: string;
            type: "domain" | "exact-phrase" | "technology" | "keyword";
        }[];
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
    }[];
    requirementMappings: {
        status: "unsupported" | "supported";
        id: string;
        requirementId: string;
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
        linkIds: string[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        sources: {
            sha256: string;
            path: string;
        };
        eligibleEvidenceSetSha256: string;
        target: {
            sha256: string;
            path: string;
        };
        jobDescription: {
            sha256: string;
            path: string;
        };
        normalizedInputSha256: string;
        claims: {
            sha256: string;
            path: string;
        };
        evidenceItems: {
            sha256: string;
            path: string;
        };
        requirementModelType: "approved" | "deterministic";
        requirementModel: {
            sha256: string;
            path: string;
        };
        requirementManifest: {
            sha256: string;
            path: string;
        };
        evidenceSnapshot?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePin?: {
            sha256: string;
            path: string;
        } | undefined;
        evidencePinManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotManifest?: {
            sha256: string;
            path: string;
        } | undefined;
        evidenceSnapshotId?: string | undefined;
        evidenceSnapshotSchemaVersion?: 1 | undefined;
        evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
        evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
        evidenceSnapshotPolicyVersion?: "2" | undefined;
    };
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_ELIGIBLE_EVIDENCE" | "REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        requirementId?: string | undefined;
    }[];
    completeness: {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementCount: number;
        processedRequirementCount: number;
        supportedRequirementCount: number;
        unsupportedRequirementCount: number;
        linkCount: number;
        readyForDownstreamAssessment: boolean;
    };
    policy: {
        name: string;
        version: string;
        mode: "deterministic";
    };
    links: {
        claimId: string;
        id: string;
        evidenceId: string;
        evidenceStrength: "medium" | "strong" | "weak";
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
            evidenceItemSha256: string;
            evidenceItemPath: string;
            claimPath: string;
            claimSha256: string;
        };
        requirementId: string;
        relationship: "partial" | "direct" | "supporting";
        linkConfidence: "high" | "medium" | "low";
        matchedSignals: {
            value: string;
            type: "domain" | "exact-phrase" | "technology" | "keyword";
        }[];
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
    }[];
    requirementMappings: {
        status: "unsupported" | "supported";
        id: string;
        requirementId: string;
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
        linkIds: string[];
    }[];
}>;
export declare const JobEvidenceMapManifestSchema: z.ZodEffects<z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    mapId: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    mapPath: z.ZodEffects<z.ZodString, string, string>;
    mapSha256: z.ZodString;
    mapperName: z.ZodString;
    mapperVersion: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    sourceSha256: z.ZodString;
    requirementModelType: z.ZodEnum<["deterministic", "approved"]>;
    requirementModelSha256: z.ZodString;
    requirementManifestSha256: z.ZodString;
    evidencePinSha256: z.ZodOptional<z.ZodString>;
    evidencePinManifestSha256: z.ZodOptional<z.ZodString>;
    evidenceSnapshotId: z.ZodOptional<z.ZodString>;
    evidenceSnapshotSha256: z.ZodOptional<z.ZodString>;
    evidenceSnapshotManifestSha256: z.ZodOptional<z.ZodString>;
    evidenceSnapshotSchemaVersion: z.ZodOptional<z.ZodLiteral<1>>;
    evidenceSnapshotContractName: z.ZodOptional<z.ZodLiteral<"evidence-snapshot">>;
    evidenceSnapshotPolicyName: z.ZodOptional<z.ZodLiteral<"evidence-snapshot-policy">>;
    evidenceSnapshotPolicyVersion: z.ZodOptional<z.ZodLiteral<"2">>;
    sourcesSha256: z.ZodString;
    evidenceItemsSha256: z.ZodString;
    claimsSha256: z.ZodString;
    eligibleEvidenceSetSha256: z.ZodString;
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
    sourcesSha256: string;
    evidenceItemsSha256: string;
    claimsSha256: string;
    eligibleEvidenceSetSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    mapId: string;
    mapPath: string;
    mapSha256: string;
    mapperName: string;
    mapperVersion: string;
    requirementManifestSha256: string;
    evidenceSnapshotManifestSha256?: string | undefined;
    evidenceSnapshotSha256?: string | undefined;
    evidenceSnapshotId?: string | undefined;
    evidenceSnapshotSchemaVersion?: 1 | undefined;
    evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
    evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
    evidenceSnapshotPolicyVersion?: "2" | undefined;
    evidencePinSha256?: string | undefined;
    evidencePinManifestSha256?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    policyVersion: string;
    sourcesSha256: string;
    evidenceItemsSha256: string;
    claimsSha256: string;
    eligibleEvidenceSetSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    mapId: string;
    mapPath: string;
    mapSha256: string;
    mapperName: string;
    mapperVersion: string;
    requirementManifestSha256: string;
    evidenceSnapshotManifestSha256?: string | undefined;
    evidenceSnapshotSha256?: string | undefined;
    evidenceSnapshotId?: string | undefined;
    evidenceSnapshotSchemaVersion?: 1 | undefined;
    evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
    evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
    evidenceSnapshotPolicyVersion?: "2" | undefined;
    evidencePinSha256?: string | undefined;
    evidencePinManifestSha256?: string | undefined;
}>, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    policyVersion: string;
    sourcesSha256: string;
    evidenceItemsSha256: string;
    claimsSha256: string;
    eligibleEvidenceSetSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    mapId: string;
    mapPath: string;
    mapSha256: string;
    mapperName: string;
    mapperVersion: string;
    requirementManifestSha256: string;
    evidenceSnapshotManifestSha256?: string | undefined;
    evidenceSnapshotSha256?: string | undefined;
    evidenceSnapshotId?: string | undefined;
    evidenceSnapshotSchemaVersion?: 1 | undefined;
    evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
    evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
    evidenceSnapshotPolicyVersion?: "2" | undefined;
    evidencePinSha256?: string | undefined;
    evidencePinManifestSha256?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    sourceSha256: string;
    targetType: "job";
    targetId: string;
    policyVersion: string;
    sourcesSha256: string;
    evidenceItemsSha256: string;
    claimsSha256: string;
    eligibleEvidenceSetSha256: string;
    policyName: string;
    normalizedInputSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    mapId: string;
    mapPath: string;
    mapSha256: string;
    mapperName: string;
    mapperVersion: string;
    requirementManifestSha256: string;
    evidenceSnapshotManifestSha256?: string | undefined;
    evidenceSnapshotSha256?: string | undefined;
    evidenceSnapshotId?: string | undefined;
    evidenceSnapshotSchemaVersion?: 1 | undefined;
    evidenceSnapshotContractName?: "evidence-snapshot" | undefined;
    evidenceSnapshotPolicyName?: "evidence-snapshot-policy" | undefined;
    evidenceSnapshotPolicyVersion?: "2" | undefined;
    evidencePinSha256?: string | undefined;
    evidencePinManifestSha256?: string | undefined;
}>;
export type JobEvidenceRelationship = z.infer<typeof JobEvidenceRelationshipSchema>;
export type JobEvidenceStrength = z.infer<typeof JobEvidenceStrengthSchema>;
export type JobEvidenceLinkConfidence = z.infer<typeof JobEvidenceLinkConfidenceSchema>;
export type JobRequirementInputType = z.infer<typeof JobRequirementInputTypeSchema>;
export type JobEvidenceLink = z.infer<typeof JobEvidenceLinkSchema>;
export type JobEvidenceMap = z.infer<typeof JobEvidenceMapSchema>;
export type JobEvidenceMapManifest = z.infer<typeof JobEvidenceMapManifestSchema>;
