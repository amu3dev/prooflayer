import { z } from "zod";
export declare const JobRequirementAssessmentStateSchema: z.ZodEnum<["strength", "supported", "partial", "gap", "contradiction", "indeterminate"]>;
export declare const JobAssessmentProofStrengthSchema: z.ZodEnum<["strong", "adequate", "limited", "unavailable", "conflicting"]>;
export declare const JobAssessmentMaterialitySchema: z.ZodEnum<["critical", "material", "secondary", "contextual", "unknown"]>;
export declare const JobAssessmentGapTypeSchema: z.ZodEnum<["missing-proof", "partial-proof", "depth-gap", "scope-gap", "recency-gap", "domain-gap", "technology-gap", "leadership-gap", "experience-gap", "language-gap", "location-or-work-constraint-gap", "education-or-certification-gap", "contradiction", "ambiguous"]>;
export declare const JobOverallAssessmentStateSchema: z.ZodEnum<["strong", "credible", "mixed", "limited", "insufficient", "indeterminate"]>;
export declare const JobAssessmentDependencySchema: z.ZodObject<{
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
}, {
    sha256: string;
    path: string;
}>;
export declare const JobAssessmentCoverageProvenanceSchema: z.ZodObject<{
    coveragePath: z.ZodEffects<z.ZodString, string, string>;
    coverageSha256: z.ZodString;
    coverageEntryId: z.ZodString;
    coverageEntrySha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    coveragePath: string;
    coverageSha256: string;
    coverageEntryId: string;
    coverageEntrySha256: string;
}, {
    coveragePath: string;
    coverageSha256: string;
    coverageEntryId: string;
    coverageEntrySha256: string;
}>;
export declare const JobRequirementAssessmentProvenanceSchema: z.ZodObject<{
    requirement: z.ZodObject<{
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
    coverage: z.ZodObject<{
        coveragePath: z.ZodEffects<z.ZodString, string, string>;
        coverageSha256: z.ZodString;
        coverageEntryId: z.ZodString;
        coverageEntrySha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        coveragePath: string;
        coverageSha256: string;
        coverageEntryId: string;
        coverageEntrySha256: string;
    }, {
        coveragePath: string;
        coverageSha256: string;
        coverageEntryId: string;
        coverageEntrySha256: string;
    }>;
    evidenceMap: z.ZodObject<{
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
}, "strict", z.ZodTypeAny, {
    coverage: {
        coveragePath: string;
        coverageSha256: string;
        coverageEntryId: string;
        coverageEntrySha256: string;
    };
    evidenceMap: {
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
    requirement: {
        sourceReferences: {
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
    coverage: {
        coveragePath: string;
        coverageSha256: string;
        coverageEntryId: string;
        coverageEntrySha256: string;
    };
    evidenceMap: {
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
    requirement: {
        sourceReferences: {
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
export declare const JobAssessmentRiskSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED", "MANDATORY_REQUIREMENT_PARTIAL", "EXPLICIT_REQUIREMENT_CONTRADICTED", "PROOF_QUALITY_LIMITED", "REQUIREMENT_SCOPE_NOT_EVIDENCED", "REQUIREMENT_DEPTH_NOT_EVIDENCED", "REQUIREMENT_RECENCY_NOT_EVIDENCED", "AMBIGUOUS_REQUIREMENT_MATERIALITY", "COVERAGE_PROVENANCE_INCOMPLETE", "ASSESSMENT_DEPENDENCY_STALE"]>;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    message: z.ZodString;
    requirementId: z.ZodString;
    coverageEntryId: z.ZodString;
    evidenceLinkIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED" | "MANDATORY_REQUIREMENT_PARTIAL" | "EXPLICIT_REQUIREMENT_CONTRADICTED" | "PROOF_QUALITY_LIMITED" | "REQUIREMENT_SCOPE_NOT_EVIDENCED" | "REQUIREMENT_DEPTH_NOT_EVIDENCED" | "REQUIREMENT_RECENCY_NOT_EVIDENCED" | "AMBIGUOUS_REQUIREMENT_MATERIALITY" | "COVERAGE_PROVENANCE_INCOMPLETE" | "ASSESSMENT_DEPENDENCY_STALE";
    message: string;
    id: string;
    severity: "high" | "medium" | "low" | "critical";
    requirementId: string;
    coverageEntryId: string;
    evidenceLinkIds: string[];
}, {
    code: "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED" | "MANDATORY_REQUIREMENT_PARTIAL" | "EXPLICIT_REQUIREMENT_CONTRADICTED" | "PROOF_QUALITY_LIMITED" | "REQUIREMENT_SCOPE_NOT_EVIDENCED" | "REQUIREMENT_DEPTH_NOT_EVIDENCED" | "REQUIREMENT_RECENCY_NOT_EVIDENCED" | "AMBIGUOUS_REQUIREMENT_MATERIALITY" | "COVERAGE_PROVENANCE_INCOMPLETE" | "ASSESSMENT_DEPENDENCY_STALE";
    message: string;
    id: string;
    severity: "high" | "medium" | "low" | "critical";
    requirementId: string;
    coverageEntryId: string;
    evidenceLinkIds: string[];
}>;
export declare const JobAssessmentWarningSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["QUALITATIVE_ASSESSMENT_ONLY", "NO_HIRING_PREDICTION", "NO_APPLICATION_RECOMMENDATION", "REVIEWED_EVIDENCE_ONLY", "AMBIGUOUS_REQUIREMENT_REMAINS", "PREFERRED_REQUIREMENT_UNSUPPORTED", "CONTEXTUAL_REQUIREMENT_UNSUPPORTED"]>;
    message: z.ZodString;
    requirementId: z.ZodOptional<z.ZodString>;
    coverageEntryId: z.ZodOptional<z.ZodString>;
    evidenceLinkIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "QUALITATIVE_ASSESSMENT_ONLY" | "NO_HIRING_PREDICTION" | "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "AMBIGUOUS_REQUIREMENT_REMAINS" | "PREFERRED_REQUIREMENT_UNSUPPORTED" | "CONTEXTUAL_REQUIREMENT_UNSUPPORTED";
    message: string;
    id: string;
    evidenceLinkIds: string[];
    requirementId?: string | undefined;
    coverageEntryId?: string | undefined;
}, {
    code: "QUALITATIVE_ASSESSMENT_ONLY" | "NO_HIRING_PREDICTION" | "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "AMBIGUOUS_REQUIREMENT_REMAINS" | "PREFERRED_REQUIREMENT_UNSUPPORTED" | "CONTEXTUAL_REQUIREMENT_UNSUPPORTED";
    message: string;
    id: string;
    evidenceLinkIds: string[];
    requirementId?: string | undefined;
    coverageEntryId?: string | undefined;
}>;
export declare const JobAssessmentAmbiguitySchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["REQUIREMENT_AMBIGUITY_PRESERVED", "COVERAGE_INDETERMINATE", "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT"]>;
    message: z.ZodString;
    requirementId: z.ZodString;
    coverageEntryId: z.ZodString;
    evidenceLinkIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "REQUIREMENT_AMBIGUITY_PRESERVED" | "COVERAGE_INDETERMINATE" | "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT";
    message: string;
    id: string;
    requirementId: string;
    coverageEntryId: string;
    evidenceLinkIds: string[];
}, {
    code: "REQUIREMENT_AMBIGUITY_PRESERVED" | "COVERAGE_INDETERMINATE" | "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT";
    message: string;
    id: string;
    requirementId: string;
    coverageEntryId: string;
    evidenceLinkIds: string[];
}>;
export declare const JobRequirementFitProofAssessmentSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    requirementId: z.ZodString;
    category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
    necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
    coverageState: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
    assessmentState: z.ZodEnum<["strength", "supported", "partial", "gap", "contradiction", "indeterminate"]>;
    mappedEvidenceLinkIds: z.ZodArray<z.ZodString, "many">;
    evidenceQuality: z.ZodEnum<["strong", "adequate", "limited", "mixed", "unavailable"]>;
    proofStrength: z.ZodEnum<["strong", "adequate", "limited", "unavailable", "conflicting"]>;
    materiality: z.ZodEnum<["critical", "material", "secondary", "contextual", "unknown"]>;
    gapType: z.ZodOptional<z.ZodEnum<["missing-proof", "partial-proof", "depth-gap", "scope-gap", "recency-gap", "domain-gap", "technology-gap", "leadership-gap", "experience-gap", "language-gap", "location-or-work-constraint-gap", "education-or-certification-gap", "contradiction", "ambiguous"]>>;
    assessmentStatement: z.ZodString;
    riskIds: z.ZodArray<z.ZodString, "many">;
    warningIds: z.ZodArray<z.ZodString, "many">;
    ambiguityIds: z.ZodArray<z.ZodString, "many">;
    provenance: z.ZodObject<{
        requirement: z.ZodObject<{
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
        coverage: z.ZodObject<{
            coveragePath: z.ZodEffects<z.ZodString, string, string>;
            coverageSha256: z.ZodString;
            coverageEntryId: z.ZodString;
            coverageEntrySha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            coveragePath: string;
            coverageSha256: string;
            coverageEntryId: string;
            coverageEntrySha256: string;
        }, {
            coveragePath: string;
            coverageSha256: string;
            coverageEntryId: string;
            coverageEntrySha256: string;
        }>;
        evidenceMap: z.ZodObject<{
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
    }, "strict", z.ZodTypeAny, {
        coverage: {
            coveragePath: string;
            coverageSha256: string;
            coverageEntryId: string;
            coverageEntrySha256: string;
        };
        evidenceMap: {
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
        requirement: {
            sourceReferences: {
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
        coverage: {
            coveragePath: string;
            coverageSha256: string;
            coverageEntryId: string;
            coverageEntrySha256: string;
        };
        evidenceMap: {
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
        requirement: {
            sourceReferences: {
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
}, "strict", z.ZodTypeAny, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    provenance: {
        coverage: {
            coveragePath: string;
            coverageSha256: string;
            coverageEntryId: string;
            coverageEntrySha256: string;
        };
        evidenceMap: {
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
        requirement: {
            sourceReferences: {
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
    };
    materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
    requirementId: string;
    evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
    coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
    mappedEvidenceLinkIds: string[];
    proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
    assessmentStatement: string;
    riskIds: string[];
    warningIds: string[];
    ambiguityIds: string[];
    gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
}, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    provenance: {
        coverage: {
            coveragePath: string;
            coverageSha256: string;
            coverageEntryId: string;
            coverageEntrySha256: string;
        };
        evidenceMap: {
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
        requirement: {
            sourceReferences: {
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
    };
    materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
    requirementId: string;
    evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
    coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
    mappedEvidenceLinkIds: string[];
    proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
    assessmentStatement: string;
    riskIds: string[];
    warningIds: string[];
    ambiguityIds: string[];
    gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
}>, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    provenance: {
        coverage: {
            coveragePath: string;
            coverageSha256: string;
            coverageEntryId: string;
            coverageEntrySha256: string;
        };
        evidenceMap: {
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
        requirement: {
            sourceReferences: {
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
    };
    materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
    requirementId: string;
    evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
    coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
    mappedEvidenceLinkIds: string[];
    proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
    assessmentStatement: string;
    riskIds: string[];
    warningIds: string[];
    ambiguityIds: string[];
    gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
}, {
    id: string;
    necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
    category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
    provenance: {
        coverage: {
            coveragePath: string;
            coverageSha256: string;
            coverageEntryId: string;
            coverageEntrySha256: string;
        };
        evidenceMap: {
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
        requirement: {
            sourceReferences: {
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
    };
    materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
    requirementId: string;
    evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
    coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
    mappedEvidenceLinkIds: string[];
    proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
    assessmentStatement: string;
    riskIds: string[];
    warningIds: string[];
    ambiguityIds: string[];
    gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
}>;
export declare const JobOverallFitProofAssessmentSchema: z.ZodObject<{
    state: z.ZodEnum<["strong", "credible", "mixed", "limited", "insufficient", "indeterminate"]>;
    strengthRequirementIds: z.ZodArray<z.ZodString, "many">;
    supportedRequirementIds: z.ZodArray<z.ZodString, "many">;
    partialRequirementIds: z.ZodArray<z.ZodString, "many">;
    gapRequirementIds: z.ZodArray<z.ZodString, "many">;
    contradictionRequirementIds: z.ZodArray<z.ZodString, "many">;
    indeterminateRequirementIds: z.ZodArray<z.ZodString, "many">;
    statement: z.ZodString;
}, "strict", z.ZodTypeAny, {
    statement: string;
    state: "strong" | "indeterminate" | "limited" | "insufficient" | "mixed" | "credible";
    strengthRequirementIds: string[];
    supportedRequirementIds: string[];
    partialRequirementIds: string[];
    gapRequirementIds: string[];
    contradictionRequirementIds: string[];
    indeterminateRequirementIds: string[];
}, {
    statement: string;
    state: "strong" | "indeterminate" | "limited" | "insufficient" | "mixed" | "credible";
    strengthRequirementIds: string[];
    supportedRequirementIds: string[];
    partialRequirementIds: string[];
    gapRequirementIds: string[];
    contradictionRequirementIds: string[];
    indeterminateRequirementIds: string[];
}>;
export declare const JobFitProofAssessmentCompletenessSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodEnum<["empty", "complete"]>;
    requirementIds: z.ZodArray<z.ZodString, "many">;
    assessedRequirementIds: z.ZodArray<z.ZodString, "many">;
    readyForDownstreamPlanning: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementIds: string[];
    assessedRequirementIds: string[];
    readyForDownstreamPlanning: boolean;
}, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementIds: string[];
    assessedRequirementIds: string[];
    readyForDownstreamPlanning: boolean;
}>, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementIds: string[];
    assessedRequirementIds: string[];
    readyForDownstreamPlanning: boolean;
}, {
    status: "empty" | "complete";
    blockingReasons: string[];
    requirementIds: string[];
    assessedRequirementIds: string[];
    readyForDownstreamPlanning: boolean;
}>;
export declare const JobFitProofAssessmentSchema: z.ZodEffects<z.ZodObject<{
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
        coverage: z.ZodObject<{
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
        }, {
            sha256: string;
            path: string;
        }>;
        coverageManifest: z.ZodObject<{
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
        coverage: {
            sha256: string;
            path: string;
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
        coverageManifest: {
            sha256: string;
            path: string;
        };
    }, {
        coverage: {
            sha256: string;
            path: string;
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
        coverageManifest: {
            sha256: string;
            path: string;
        };
    }>;
    requirementAssessments: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        requirementId: z.ZodString;
        category: z.ZodEnum<["responsibility", "required-capability", "preferred-capability", "technical-expectation", "domain-expectation", "leadership-expectation", "operating-context", "experience-seniority", "education-certification", "language", "location-travel-visa-work-mode", "screening", "metric-scale", "unknown"]>;
        necessity: z.ZodEnum<["mandatory", "preferred", "contextual", "ambiguous"]>;
        coverageState: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
        assessmentState: z.ZodEnum<["strength", "supported", "partial", "gap", "contradiction", "indeterminate"]>;
        mappedEvidenceLinkIds: z.ZodArray<z.ZodString, "many">;
        evidenceQuality: z.ZodEnum<["strong", "adequate", "limited", "mixed", "unavailable"]>;
        proofStrength: z.ZodEnum<["strong", "adequate", "limited", "unavailable", "conflicting"]>;
        materiality: z.ZodEnum<["critical", "material", "secondary", "contextual", "unknown"]>;
        gapType: z.ZodOptional<z.ZodEnum<["missing-proof", "partial-proof", "depth-gap", "scope-gap", "recency-gap", "domain-gap", "technology-gap", "leadership-gap", "experience-gap", "language-gap", "location-or-work-constraint-gap", "education-or-certification-gap", "contradiction", "ambiguous"]>>;
        assessmentStatement: z.ZodString;
        riskIds: z.ZodArray<z.ZodString, "many">;
        warningIds: z.ZodArray<z.ZodString, "many">;
        ambiguityIds: z.ZodArray<z.ZodString, "many">;
        provenance: z.ZodObject<{
            requirement: z.ZodObject<{
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
            coverage: z.ZodObject<{
                coveragePath: z.ZodEffects<z.ZodString, string, string>;
                coverageSha256: z.ZodString;
                coverageEntryId: z.ZodString;
                coverageEntrySha256: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            }, {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            }>;
            evidenceMap: z.ZodObject<{
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
        }, "strict", z.ZodTypeAny, {
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
    }, "strict", z.ZodTypeAny, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
        };
        materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
        requirementId: string;
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
        mappedEvidenceLinkIds: string[];
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        assessmentStatement: string;
        riskIds: string[];
        warningIds: string[];
        ambiguityIds: string[];
        gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
    }, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
        };
        materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
        requirementId: string;
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
        mappedEvidenceLinkIds: string[];
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        assessmentStatement: string;
        riskIds: string[];
        warningIds: string[];
        ambiguityIds: string[];
        gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
    }>, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
        };
        materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
        requirementId: string;
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
        mappedEvidenceLinkIds: string[];
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        assessmentStatement: string;
        riskIds: string[];
        warningIds: string[];
        ambiguityIds: string[];
        gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
    }, {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
        };
        materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
        requirementId: string;
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
        mappedEvidenceLinkIds: string[];
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        assessmentStatement: string;
        riskIds: string[];
        warningIds: string[];
        ambiguityIds: string[];
        gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
    }>, "many">;
    overall: z.ZodObject<{
        state: z.ZodEnum<["strong", "credible", "mixed", "limited", "insufficient", "indeterminate"]>;
        strengthRequirementIds: z.ZodArray<z.ZodString, "many">;
        supportedRequirementIds: z.ZodArray<z.ZodString, "many">;
        partialRequirementIds: z.ZodArray<z.ZodString, "many">;
        gapRequirementIds: z.ZodArray<z.ZodString, "many">;
        contradictionRequirementIds: z.ZodArray<z.ZodString, "many">;
        indeterminateRequirementIds: z.ZodArray<z.ZodString, "many">;
        statement: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        statement: string;
        state: "strong" | "indeterminate" | "limited" | "insufficient" | "mixed" | "credible";
        strengthRequirementIds: string[];
        supportedRequirementIds: string[];
        partialRequirementIds: string[];
        gapRequirementIds: string[];
        contradictionRequirementIds: string[];
        indeterminateRequirementIds: string[];
    }, {
        statement: string;
        state: "strong" | "indeterminate" | "limited" | "insufficient" | "mixed" | "credible";
        strengthRequirementIds: string[];
        supportedRequirementIds: string[];
        partialRequirementIds: string[];
        gapRequirementIds: string[];
        contradictionRequirementIds: string[];
        indeterminateRequirementIds: string[];
    }>;
    risks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED", "MANDATORY_REQUIREMENT_PARTIAL", "EXPLICIT_REQUIREMENT_CONTRADICTED", "PROOF_QUALITY_LIMITED", "REQUIREMENT_SCOPE_NOT_EVIDENCED", "REQUIREMENT_DEPTH_NOT_EVIDENCED", "REQUIREMENT_RECENCY_NOT_EVIDENCED", "AMBIGUOUS_REQUIREMENT_MATERIALITY", "COVERAGE_PROVENANCE_INCOMPLETE", "ASSESSMENT_DEPENDENCY_STALE"]>;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
        requirementId: z.ZodString;
        coverageEntryId: z.ZodString;
        evidenceLinkIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED" | "MANDATORY_REQUIREMENT_PARTIAL" | "EXPLICIT_REQUIREMENT_CONTRADICTED" | "PROOF_QUALITY_LIMITED" | "REQUIREMENT_SCOPE_NOT_EVIDENCED" | "REQUIREMENT_DEPTH_NOT_EVIDENCED" | "REQUIREMENT_RECENCY_NOT_EVIDENCED" | "AMBIGUOUS_REQUIREMENT_MATERIALITY" | "COVERAGE_PROVENANCE_INCOMPLETE" | "ASSESSMENT_DEPENDENCY_STALE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }, {
        code: "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED" | "MANDATORY_REQUIREMENT_PARTIAL" | "EXPLICIT_REQUIREMENT_CONTRADICTED" | "PROOF_QUALITY_LIMITED" | "REQUIREMENT_SCOPE_NOT_EVIDENCED" | "REQUIREMENT_DEPTH_NOT_EVIDENCED" | "REQUIREMENT_RECENCY_NOT_EVIDENCED" | "AMBIGUOUS_REQUIREMENT_MATERIALITY" | "COVERAGE_PROVENANCE_INCOMPLETE" | "ASSESSMENT_DEPENDENCY_STALE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["QUALITATIVE_ASSESSMENT_ONLY", "NO_HIRING_PREDICTION", "NO_APPLICATION_RECOMMENDATION", "REVIEWED_EVIDENCE_ONLY", "AMBIGUOUS_REQUIREMENT_REMAINS", "PREFERRED_REQUIREMENT_UNSUPPORTED", "CONTEXTUAL_REQUIREMENT_UNSUPPORTED"]>;
        message: z.ZodString;
        requirementId: z.ZodOptional<z.ZodString>;
        coverageEntryId: z.ZodOptional<z.ZodString>;
        evidenceLinkIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "QUALITATIVE_ASSESSMENT_ONLY" | "NO_HIRING_PREDICTION" | "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "AMBIGUOUS_REQUIREMENT_REMAINS" | "PREFERRED_REQUIREMENT_UNSUPPORTED" | "CONTEXTUAL_REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        evidenceLinkIds: string[];
        requirementId?: string | undefined;
        coverageEntryId?: string | undefined;
    }, {
        code: "QUALITATIVE_ASSESSMENT_ONLY" | "NO_HIRING_PREDICTION" | "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "AMBIGUOUS_REQUIREMENT_REMAINS" | "PREFERRED_REQUIREMENT_UNSUPPORTED" | "CONTEXTUAL_REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        evidenceLinkIds: string[];
        requirementId?: string | undefined;
        coverageEntryId?: string | undefined;
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["REQUIREMENT_AMBIGUITY_PRESERVED", "COVERAGE_INDETERMINATE", "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT"]>;
        message: z.ZodString;
        requirementId: z.ZodString;
        coverageEntryId: z.ZodString;
        evidenceLinkIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "REQUIREMENT_AMBIGUITY_PRESERVED" | "COVERAGE_INDETERMINATE" | "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT";
        message: string;
        id: string;
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }, {
        code: "REQUIREMENT_AMBIGUITY_PRESERVED" | "COVERAGE_INDETERMINATE" | "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT";
        message: string;
        id: string;
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "complete"]>;
        requirementIds: z.ZodArray<z.ZodString, "many">;
        assessedRequirementIds: z.ZodArray<z.ZodString, "many">;
        readyForDownstreamPlanning: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        assessedRequirementIds: string[];
        readyForDownstreamPlanning: boolean;
    }, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        assessedRequirementIds: string[];
        readyForDownstreamPlanning: boolean;
    }>, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        assessedRequirementIds: string[];
        readyForDownstreamPlanning: boolean;
    }, {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        assessedRequirementIds: string[];
        readyForDownstreamPlanning: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        coverage: {
            sha256: string;
            path: string;
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
        coverageManifest: {
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
    warnings: {
        code: "QUALITATIVE_ASSESSMENT_ONLY" | "NO_HIRING_PREDICTION" | "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "AMBIGUOUS_REQUIREMENT_REMAINS" | "PREFERRED_REQUIREMENT_UNSUPPORTED" | "CONTEXTUAL_REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        evidenceLinkIds: string[];
        requirementId?: string | undefined;
        coverageEntryId?: string | undefined;
    }[];
    ambiguities: {
        code: "REQUIREMENT_AMBIGUITY_PRESERVED" | "COVERAGE_INDETERMINATE" | "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT";
        message: string;
        id: string;
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }[];
    completeness: {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        assessedRequirementIds: string[];
        readyForDownstreamPlanning: boolean;
    };
    risks: {
        code: "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED" | "MANDATORY_REQUIREMENT_PARTIAL" | "EXPLICIT_REQUIREMENT_CONTRADICTED" | "PROOF_QUALITY_LIMITED" | "REQUIREMENT_SCOPE_NOT_EVIDENCED" | "REQUIREMENT_DEPTH_NOT_EVIDENCED" | "REQUIREMENT_RECENCY_NOT_EVIDENCED" | "AMBIGUOUS_REQUIREMENT_MATERIALITY" | "COVERAGE_PROVENANCE_INCOMPLETE" | "ASSESSMENT_DEPENDENCY_STALE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
    };
    requirementAssessments: {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
        };
        materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
        requirementId: string;
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
        mappedEvidenceLinkIds: string[];
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        assessmentStatement: string;
        riskIds: string[];
        warningIds: string[];
        ambiguityIds: string[];
        gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
    }[];
    overall: {
        statement: string;
        state: "strong" | "indeterminate" | "limited" | "insufficient" | "mixed" | "credible";
        strengthRequirementIds: string[];
        supportedRequirementIds: string[];
        partialRequirementIds: string[];
        gapRequirementIds: string[];
        contradictionRequirementIds: string[];
        indeterminateRequirementIds: string[];
    };
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        coverage: {
            sha256: string;
            path: string;
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
        coverageManifest: {
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
    warnings: {
        code: "QUALITATIVE_ASSESSMENT_ONLY" | "NO_HIRING_PREDICTION" | "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "AMBIGUOUS_REQUIREMENT_REMAINS" | "PREFERRED_REQUIREMENT_UNSUPPORTED" | "CONTEXTUAL_REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        evidenceLinkIds: string[];
        requirementId?: string | undefined;
        coverageEntryId?: string | undefined;
    }[];
    ambiguities: {
        code: "REQUIREMENT_AMBIGUITY_PRESERVED" | "COVERAGE_INDETERMINATE" | "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT";
        message: string;
        id: string;
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }[];
    completeness: {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        assessedRequirementIds: string[];
        readyForDownstreamPlanning: boolean;
    };
    risks: {
        code: "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED" | "MANDATORY_REQUIREMENT_PARTIAL" | "EXPLICIT_REQUIREMENT_CONTRADICTED" | "PROOF_QUALITY_LIMITED" | "REQUIREMENT_SCOPE_NOT_EVIDENCED" | "REQUIREMENT_DEPTH_NOT_EVIDENCED" | "REQUIREMENT_RECENCY_NOT_EVIDENCED" | "AMBIGUOUS_REQUIREMENT_MATERIALITY" | "COVERAGE_PROVENANCE_INCOMPLETE" | "ASSESSMENT_DEPENDENCY_STALE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
    };
    requirementAssessments: {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
        };
        materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
        requirementId: string;
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
        mappedEvidenceLinkIds: string[];
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        assessmentStatement: string;
        riskIds: string[];
        warningIds: string[];
        ambiguityIds: string[];
        gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
    }[];
    overall: {
        statement: string;
        state: "strong" | "indeterminate" | "limited" | "insufficient" | "mixed" | "credible";
        strengthRequirementIds: string[];
        supportedRequirementIds: string[];
        partialRequirementIds: string[];
        gapRequirementIds: string[];
        contradictionRequirementIds: string[];
        indeterminateRequirementIds: string[];
    };
}>, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        coverage: {
            sha256: string;
            path: string;
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
        coverageManifest: {
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
    warnings: {
        code: "QUALITATIVE_ASSESSMENT_ONLY" | "NO_HIRING_PREDICTION" | "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "AMBIGUOUS_REQUIREMENT_REMAINS" | "PREFERRED_REQUIREMENT_UNSUPPORTED" | "CONTEXTUAL_REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        evidenceLinkIds: string[];
        requirementId?: string | undefined;
        coverageEntryId?: string | undefined;
    }[];
    ambiguities: {
        code: "REQUIREMENT_AMBIGUITY_PRESERVED" | "COVERAGE_INDETERMINATE" | "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT";
        message: string;
        id: string;
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }[];
    completeness: {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        assessedRequirementIds: string[];
        readyForDownstreamPlanning: boolean;
    };
    risks: {
        code: "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED" | "MANDATORY_REQUIREMENT_PARTIAL" | "EXPLICIT_REQUIREMENT_CONTRADICTED" | "PROOF_QUALITY_LIMITED" | "REQUIREMENT_SCOPE_NOT_EVIDENCED" | "REQUIREMENT_DEPTH_NOT_EVIDENCED" | "REQUIREMENT_RECENCY_NOT_EVIDENCED" | "AMBIGUOUS_REQUIREMENT_MATERIALITY" | "COVERAGE_PROVENANCE_INCOMPLETE" | "ASSESSMENT_DEPENDENCY_STALE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
    };
    requirementAssessments: {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
        };
        materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
        requirementId: string;
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
        mappedEvidenceLinkIds: string[];
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        assessmentStatement: string;
        riskIds: string[];
        warningIds: string[];
        ambiguityIds: string[];
        gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
    }[];
    overall: {
        statement: string;
        state: "strong" | "indeterminate" | "limited" | "insufficient" | "mixed" | "credible";
        strengthRequirementIds: string[];
        supportedRequirementIds: string[];
        partialRequirementIds: string[];
        gapRequirementIds: string[];
        contradictionRequirementIds: string[];
        indeterminateRequirementIds: string[];
    };
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        coverage: {
            sha256: string;
            path: string;
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
        coverageManifest: {
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
    warnings: {
        code: "QUALITATIVE_ASSESSMENT_ONLY" | "NO_HIRING_PREDICTION" | "NO_APPLICATION_RECOMMENDATION" | "REVIEWED_EVIDENCE_ONLY" | "AMBIGUOUS_REQUIREMENT_REMAINS" | "PREFERRED_REQUIREMENT_UNSUPPORTED" | "CONTEXTUAL_REQUIREMENT_UNSUPPORTED";
        message: string;
        id: string;
        evidenceLinkIds: string[];
        requirementId?: string | undefined;
        coverageEntryId?: string | undefined;
    }[];
    ambiguities: {
        code: "REQUIREMENT_AMBIGUITY_PRESERVED" | "COVERAGE_INDETERMINATE" | "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT";
        message: string;
        id: string;
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }[];
    completeness: {
        status: "empty" | "complete";
        blockingReasons: string[];
        requirementIds: string[];
        assessedRequirementIds: string[];
        readyForDownstreamPlanning: boolean;
    };
    risks: {
        code: "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED" | "MANDATORY_REQUIREMENT_PARTIAL" | "EXPLICIT_REQUIREMENT_CONTRADICTED" | "PROOF_QUALITY_LIMITED" | "REQUIREMENT_SCOPE_NOT_EVIDENCED" | "REQUIREMENT_DEPTH_NOT_EVIDENCED" | "REQUIREMENT_RECENCY_NOT_EVIDENCED" | "AMBIGUOUS_REQUIREMENT_MATERIALITY" | "COVERAGE_PROVENANCE_INCOMPLETE" | "ASSESSMENT_DEPENDENCY_STALE";
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
        requirementId: string;
        coverageEntryId: string;
        evidenceLinkIds: string[];
    }[];
    policy: {
        name: string;
        version: string;
    };
    requirementAssessments: {
        id: string;
        necessity: "preferred" | "contextual" | "ambiguous" | "mandatory";
        category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
        provenance: {
            coverage: {
                coveragePath: string;
                coverageSha256: string;
                coverageEntryId: string;
                coverageEntrySha256: string;
            };
            evidenceMap: {
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
            requirement: {
                sourceReferences: {
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
        };
        materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
        requirementId: string;
        evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
        coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
        assessmentState: "partial" | "supported" | "indeterminate" | "contradiction" | "strength" | "gap";
        mappedEvidenceLinkIds: string[];
        proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
        assessmentStatement: string;
        riskIds: string[];
        warningIds: string[];
        ambiguityIds: string[];
        gapType?: "ambiguous" | "contradiction" | "missing-proof" | "partial-proof" | "depth-gap" | "scope-gap" | "recency-gap" | "domain-gap" | "technology-gap" | "leadership-gap" | "experience-gap" | "language-gap" | "location-or-work-constraint-gap" | "education-or-certification-gap" | undefined;
    }[];
    overall: {
        statement: string;
        state: "strong" | "indeterminate" | "limited" | "insufficient" | "mixed" | "credible";
        strengthRequirementIds: string[];
        supportedRequirementIds: string[];
        partialRequirementIds: string[];
        gapRequirementIds: string[];
        contradictionRequirementIds: string[];
        indeterminateRequirementIds: string[];
    };
}>;
export declare const JobFitProofAssessmentManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    assessmentId: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    assessmentPath: z.ZodEffects<z.ZodString, string, string>;
    assessmentSha256: z.ZodString;
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
    coverageSha256: z.ZodString;
    coverageManifestSha256: z.ZodString;
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
    assessmentId: string;
    assessmentPath: string;
    assessmentSha256: string;
    normalizedInputSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    evidenceMapManifestSha256: string;
    coverageManifestSha256: string;
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
    assessmentId: string;
    assessmentPath: string;
    assessmentSha256: string;
    normalizedInputSha256: string;
    requirementModelType: "approved" | "deterministic";
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceMapSha256: string;
    coverageSha256: string;
    evidenceMapManifestSha256: string;
    coverageManifestSha256: string;
}>;
export type JobRequirementAssessmentState = z.infer<typeof JobRequirementAssessmentStateSchema>;
export type JobAssessmentProofStrength = z.infer<typeof JobAssessmentProofStrengthSchema>;
export type JobAssessmentMateriality = z.infer<typeof JobAssessmentMaterialitySchema>;
export type JobAssessmentGapType = z.infer<typeof JobAssessmentGapTypeSchema>;
export type JobOverallAssessmentState = z.infer<typeof JobOverallAssessmentStateSchema>;
export type JobAssessmentRisk = z.infer<typeof JobAssessmentRiskSchema>;
export type JobAssessmentWarning = z.infer<typeof JobAssessmentWarningSchema>;
export type JobAssessmentAmbiguity = z.infer<typeof JobAssessmentAmbiguitySchema>;
export type JobRequirementFitProofAssessment = z.infer<typeof JobRequirementFitProofAssessmentSchema>;
export type JobFitProofAssessment = z.infer<typeof JobFitProofAssessmentSchema>;
export type JobFitProofAssessmentManifest = z.infer<typeof JobFitProofAssessmentManifestSchema>;
