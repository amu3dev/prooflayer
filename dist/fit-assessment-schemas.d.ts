import { z } from "zod";
export declare const AssessmentModeSchema: z.ZodEnum<["role-positioning", "job-specific"]>;
export declare const SupportStatusSchema: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
export declare const ProofQualitySchema: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
export declare const EvidenceSufficiencySchema: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
export declare const DefensibilitySchema: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
export declare const FreshnessRiskSchema: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
export declare const ContradictionRiskSchema: z.ZodEnum<["none", "low", "medium", "high"]>;
export declare const GapTypeSchema: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
export declare const AssessmentConfidenceSchema: z.ZodEnum<["high", "medium", "low"]>;
export declare const MaterialitySchema: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
export declare const AssessmentTrustStateSchema: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
export declare const EvidenceActionTypeSchema: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
export declare const EvidenceActionRecommendationSchema: z.ZodObject<{
    type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
    priority: z.ZodEnum<["high", "medium", "low"]>;
    rationale: z.ZodString;
    relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
    rationale: string;
    priority: "high" | "medium" | "low";
    relatedEvidenceIds: string[];
}, {
    type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
    rationale: string;
    priority: "high" | "medium" | "low";
    relatedEvidenceIds: string[];
}>;
export declare const AssessmentDependencySchema: z.ZodObject<{
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
export declare const ExpectationAssessmentProvenanceSchema: z.ZodObject<{
    targetId: z.ZodString;
    expectationId: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedInterpretationManifestSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    approvedMatchingManifestSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    assessmentPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>;
    deterministicInputs: z.ZodObject<{
        coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
        matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
        evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
        temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
        matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
    }, "strict", z.ZodTypeAny, {
        temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
        coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
        evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
        matchConfidences: ("high" | "medium" | "low")[];
    }, {
        temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
        coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
        evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
        matchConfidences: ("high" | "medium" | "low")[];
    }>;
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
    modelProposal: z.ZodOptional<z.ZodObject<{
        proposalId: z.ZodString;
        proposedAssessmentId: z.ZodString;
        provider: z.ZodString;
        model: z.ZodString;
        promptTemplateVersion: z.ZodString;
        policyVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        policyVersion: string;
        provider: string;
        model: string;
        proposalId: string;
        promptTemplateVersion: string;
        proposedAssessmentId: string;
    }, {
        policyVersion: string;
        provider: string;
        model: string;
        proposalId: string;
        promptTemplateVersion: string;
        proposedAssessmentId: string;
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
    approvedInterpretationSha256: string;
    expectationId: string;
    evidenceIds: string[];
    approvedMatchIds: string[];
    approvedInterpretationManifestSha256: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    deterministicInputs: {
        temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
        coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
        evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
        matchConfidences: ("high" | "medium" | "low")[];
    };
    reviewDecision?: {
        decision: "accept" | "edit";
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
    } | undefined;
    modelProposal?: {
        policyVersion: string;
        provider: string;
        model: string;
        proposalId: string;
        promptTemplateVersion: string;
        proposedAssessmentId: string;
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
    approvedInterpretationSha256: string;
    expectationId: string;
    evidenceIds: string[];
    approvedMatchIds: string[];
    approvedInterpretationManifestSha256: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    deterministicInputs: {
        temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
        coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
        matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
        evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
        matchConfidences: ("high" | "medium" | "low")[];
    };
    reviewDecision?: {
        decision: "accept" | "edit";
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
    } | undefined;
    modelProposal?: {
        policyVersion: string;
        provider: string;
        model: string;
        proposalId: string;
        promptTemplateVersion: string;
        proposedAssessmentId: string;
    } | undefined;
}>;
export declare const ExpectationSnapshotSchema: z.ZodObject<{
    text: z.ZodString;
    type: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
    necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
    importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
}, "strict", z.ZodTypeAny, {
    type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    necessity: "unknown" | "required" | "preferred" | "contextual";
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    text: string;
}, {
    type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
    necessity: "unknown" | "required" | "preferred" | "contextual";
    importance: "unknown" | "high" | "medium" | "low" | "critical";
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    text: string;
}>;
export declare const ExpectationFitAssessmentSchema: z.ZodObject<{
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        expectationId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedInterpretationManifestSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedMatchingManifestSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        assessmentPolicy: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
            version: string;
        }, {
            name: string;
            version: string;
        }>;
        deterministicInputs: z.ZodObject<{
            coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
            matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
            evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
            temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
            matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
        }, "strict", z.ZodTypeAny, {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        }, {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        }>;
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
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedAssessmentId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        }, {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        } | undefined;
    }>;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
    supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
    proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
    evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
    defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
    freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
    contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
    gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
    assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
    materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    limitations: z.ZodArray<z.ZodString, "many">;
    recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        rationale: z.ZodString;
        relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }, {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }>, "many">;
    id: z.ZodString;
    expectationId: z.ZodString;
    expectation: z.ZodObject<{
        text: z.ZodString;
        type: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
        necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
    }, "strict", z.ZodTypeAny, {
        type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        text: string;
    }, {
        type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        text: string;
    }>;
}, "strict", z.ZodTypeAny, {
    id: string;
    rationale: string;
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    expectationId: string;
    provenance: {
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        } | undefined;
    };
    evidenceIds: string[];
    limitations: string[];
    approvedMatchIds: string[];
    expectation: {
        type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        text: string;
    };
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    contradictionRisk: "high" | "medium" | "low" | "none";
    gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
    assessmentConfidence: "high" | "medium" | "low";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    recommendedEvidenceActions: {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }[];
}, {
    id: string;
    rationale: string;
    trustState: "deterministic-approved" | "human-approved" | "human-edited";
    expectationId: string;
    provenance: {
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        } | undefined;
    };
    evidenceIds: string[];
    limitations: string[];
    approvedMatchIds: string[];
    expectation: {
        type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
        necessity: "unknown" | "required" | "preferred" | "contextual";
        importance: "unknown" | "high" | "medium" | "low" | "critical";
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        text: string;
    };
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    contradictionRisk: "high" | "medium" | "low" | "none";
    gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
    assessmentConfidence: "high" | "medium" | "low";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    recommendedEvidenceActions: {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }[];
}>;
export declare const AssessmentRiskSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["CRITICAL_REQUIREMENT_UNSUPPORTED", "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED", "MATERIAL_CONTRADICTION", "EVIDENCE_TOO_GENERAL", "EVIDENCE_TOO_OLD", "EVIDENCE_TOO_WEAK", "COMPOUND_EXPECTATION_PARTIALLY_COVERED", "ASSESSMENT_INCOMPLETE", "MATCHING_STALE", "INTERPRETATION_STALE", "PROVENANCE_INCOMPLETE"]>;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    message: z.ZodString;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
}, {
    code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "critical";
}>;
export declare const FitAssessmentWarningSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["NO_APPROVED_MATCHING", "MATCHING_NOT_COMPLETE", "NO_SUPPORTED_EXPECTATIONS", "NO_REQUIRED_EXPECTATIONS_IDENTIFIED", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE", "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW"]>;
    message: z.ZodString;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
}, {
    code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
}>;
export declare const FitAssessmentAmbiguitySchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR", "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR", "MATERIALITY_UNCLEAR", "FRESHNESS_RELEVANCE_UNCLEAR", "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR", "CONTRADICTION_MATERIALITY_UNCLEAR"]>;
    message: z.ZodString;
    expectationId: z.ZodOptional<z.ZodString>;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
    message: string;
    id: string;
    evidenceIds: string[];
    expectationId?: string | undefined;
}, {
    code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
    message: string;
    id: string;
    evidenceIds: string[];
    expectationId?: string | undefined;
}>;
export declare const FitAssessmentCompletenessSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodEnum<["empty", "partial", "complete"]>;
    assessedExpectationCount: z.ZodNumber;
    totalEligibleExpectationCount: z.ZodNumber;
    summaryAvailable: z.ZodBoolean;
    usableForResumeConstruction: z.ZodBoolean;
    usableForApplicationConstruction: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    assessedExpectationCount: number;
    totalEligibleExpectationCount: number;
    summaryAvailable: boolean;
    usableForResumeConstruction: boolean;
    usableForApplicationConstruction: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    assessedExpectationCount: number;
    totalEligibleExpectationCount: number;
    summaryAvailable: boolean;
    usableForResumeConstruction: boolean;
    usableForApplicationConstruction: boolean;
}>, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    assessedExpectationCount: number;
    totalEligibleExpectationCount: number;
    summaryAvailable: boolean;
    usableForResumeConstruction: boolean;
    usableForApplicationConstruction: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    assessedExpectationCount: number;
    totalEligibleExpectationCount: number;
    summaryAvailable: boolean;
    usableForResumeConstruction: boolean;
    usableForApplicationConstruction: boolean;
}>;
export declare const RequirementSetAssessmentSchema: z.ZodObject<{
    total: z.ZodNumber;
    stronglySupported: z.ZodNumber;
    supported: z.ZodNumber;
    partiallySupported: z.ZodNumber;
    unsupported: z.ZodNumber;
    conflicting: z.ZodNumber;
    notAssessed: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    conflicting: number;
    unsupported: number;
    supported: number;
    total: number;
    stronglySupported: number;
    partiallySupported: number;
    notAssessed: number;
}, {
    conflicting: number;
    unsupported: number;
    supported: number;
    total: number;
    stronglySupported: number;
    partiallySupported: number;
    notAssessed: number;
}>;
export declare const RoleFitAssessmentSummarySchema: z.ZodObject<{
    mode: z.ZodLiteral<"role-positioning">;
    overallPositioning: z.ZodEnum<["well-supported", "supported-with-gaps", "partially-supported", "insufficient-evidence", "conflicting", "incomplete"]>;
    stronglySupportedCount: z.ZodNumber;
    supportedCount: z.ZodNumber;
    partiallySupportedCount: z.ZodNumber;
    unsupportedCount: z.ZodNumber;
    conflictingCount: z.ZodNumber;
    notAssessedCount: z.ZodNumber;
    criticalGapExpectationIds: z.ZodArray<z.ZodString, "many">;
    evidenceImprovementExpectationIds: z.ZodArray<z.ZodString, "many">;
    narrative: z.ZodString;
}, "strict", z.ZodTypeAny, {
    mode: "role-positioning";
    overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
    stronglySupportedCount: number;
    supportedCount: number;
    partiallySupportedCount: number;
    unsupportedCount: number;
    conflictingCount: number;
    notAssessedCount: number;
    criticalGapExpectationIds: string[];
    evidenceImprovementExpectationIds: string[];
    narrative: string;
}, {
    mode: "role-positioning";
    overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
    stronglySupportedCount: number;
    supportedCount: number;
    partiallySupportedCount: number;
    unsupportedCount: number;
    conflictingCount: number;
    notAssessedCount: number;
    criticalGapExpectationIds: string[];
    evidenceImprovementExpectationIds: string[];
    narrative: string;
}>;
export declare const JobFitAssessmentSummarySchema: z.ZodObject<{
    mode: z.ZodLiteral<"job-specific">;
    opportunityAlignment: z.ZodEnum<["strong-alignment", "credible-alignment", "mixed-alignment", "weak-evidence-alignment", "material-conflict", "incomplete"]>;
    requiredExpectationSummary: z.ZodObject<{
        total: z.ZodNumber;
        stronglySupported: z.ZodNumber;
        supported: z.ZodNumber;
        partiallySupported: z.ZodNumber;
        unsupported: z.ZodNumber;
        conflicting: z.ZodNumber;
        notAssessed: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }>;
    preferredExpectationSummary: z.ZodObject<{
        total: z.ZodNumber;
        stronglySupported: z.ZodNumber;
        supported: z.ZodNumber;
        partiallySupported: z.ZodNumber;
        unsupported: z.ZodNumber;
        conflicting: z.ZodNumber;
        notAssessed: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }>;
    contextualExpectationSummary: z.ZodObject<{
        total: z.ZodNumber;
        stronglySupported: z.ZodNumber;
        supported: z.ZodNumber;
        partiallySupported: z.ZodNumber;
        unsupported: z.ZodNumber;
        conflicting: z.ZodNumber;
        notAssessed: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }>;
    materialRiskExpectationIds: z.ZodArray<z.ZodString, "many">;
    unsupportedRequiredExpectationIds: z.ZodArray<z.ZodString, "many">;
    conflictingExpectationIds: z.ZodArray<z.ZodString, "many">;
    narrative: z.ZodString;
}, "strict", z.ZodTypeAny, {
    mode: "job-specific";
    narrative: string;
    opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
    requiredExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    preferredExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    contextualExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    materialRiskExpectationIds: string[];
    unsupportedRequiredExpectationIds: string[];
    conflictingExpectationIds: string[];
}, {
    mode: "job-specific";
    narrative: string;
    opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
    requiredExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    preferredExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    contextualExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    materialRiskExpectationIds: string[];
    unsupportedRequiredExpectationIds: string[];
    conflictingExpectationIds: string[];
}>;
export declare const FitAssessmentSummarySchema: z.ZodDiscriminatedUnion<"mode", [z.ZodObject<{
    mode: z.ZodLiteral<"role-positioning">;
    overallPositioning: z.ZodEnum<["well-supported", "supported-with-gaps", "partially-supported", "insufficient-evidence", "conflicting", "incomplete"]>;
    stronglySupportedCount: z.ZodNumber;
    supportedCount: z.ZodNumber;
    partiallySupportedCount: z.ZodNumber;
    unsupportedCount: z.ZodNumber;
    conflictingCount: z.ZodNumber;
    notAssessedCount: z.ZodNumber;
    criticalGapExpectationIds: z.ZodArray<z.ZodString, "many">;
    evidenceImprovementExpectationIds: z.ZodArray<z.ZodString, "many">;
    narrative: z.ZodString;
}, "strict", z.ZodTypeAny, {
    mode: "role-positioning";
    overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
    stronglySupportedCount: number;
    supportedCount: number;
    partiallySupportedCount: number;
    unsupportedCount: number;
    conflictingCount: number;
    notAssessedCount: number;
    criticalGapExpectationIds: string[];
    evidenceImprovementExpectationIds: string[];
    narrative: string;
}, {
    mode: "role-positioning";
    overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
    stronglySupportedCount: number;
    supportedCount: number;
    partiallySupportedCount: number;
    unsupportedCount: number;
    conflictingCount: number;
    notAssessedCount: number;
    criticalGapExpectationIds: string[];
    evidenceImprovementExpectationIds: string[];
    narrative: string;
}>, z.ZodObject<{
    mode: z.ZodLiteral<"job-specific">;
    opportunityAlignment: z.ZodEnum<["strong-alignment", "credible-alignment", "mixed-alignment", "weak-evidence-alignment", "material-conflict", "incomplete"]>;
    requiredExpectationSummary: z.ZodObject<{
        total: z.ZodNumber;
        stronglySupported: z.ZodNumber;
        supported: z.ZodNumber;
        partiallySupported: z.ZodNumber;
        unsupported: z.ZodNumber;
        conflicting: z.ZodNumber;
        notAssessed: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }>;
    preferredExpectationSummary: z.ZodObject<{
        total: z.ZodNumber;
        stronglySupported: z.ZodNumber;
        supported: z.ZodNumber;
        partiallySupported: z.ZodNumber;
        unsupported: z.ZodNumber;
        conflicting: z.ZodNumber;
        notAssessed: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }>;
    contextualExpectationSummary: z.ZodObject<{
        total: z.ZodNumber;
        stronglySupported: z.ZodNumber;
        supported: z.ZodNumber;
        partiallySupported: z.ZodNumber;
        unsupported: z.ZodNumber;
        conflicting: z.ZodNumber;
        notAssessed: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }, {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    }>;
    materialRiskExpectationIds: z.ZodArray<z.ZodString, "many">;
    unsupportedRequiredExpectationIds: z.ZodArray<z.ZodString, "many">;
    conflictingExpectationIds: z.ZodArray<z.ZodString, "many">;
    narrative: z.ZodString;
}, "strict", z.ZodTypeAny, {
    mode: "job-specific";
    narrative: string;
    opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
    requiredExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    preferredExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    contextualExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    materialRiskExpectationIds: string[];
    unsupportedRequiredExpectationIds: string[];
    conflictingExpectationIds: string[];
}, {
    mode: "job-specific";
    narrative: string;
    opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
    requiredExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    preferredExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    contextualExpectationSummary: {
        conflicting: number;
        unsupported: number;
        supported: number;
        total: number;
        stronglySupported: number;
        partiallySupported: number;
        notAssessed: number;
    };
    materialRiskExpectationIds: string[];
    unsupportedRequiredExpectationIds: string[];
    conflictingExpectationIds: string[];
}>]>;
export declare const RoleFitAssessmentSchema: z.ZodObject<{
    targetType: z.ZodLiteral<"role">;
    mode: z.ZodLiteral<"role-positioning">;
    summary: z.ZodObject<{
        mode: z.ZodLiteral<"role-positioning">;
        overallPositioning: z.ZodEnum<["well-supported", "supported-with-gaps", "partially-supported", "insufficient-evidence", "conflicting", "incomplete"]>;
        stronglySupportedCount: z.ZodNumber;
        supportedCount: z.ZodNumber;
        partiallySupportedCount: z.ZodNumber;
        unsupportedCount: z.ZodNumber;
        conflictingCount: z.ZodNumber;
        notAssessedCount: z.ZodNumber;
        criticalGapExpectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceImprovementExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }>;
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
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
    evidenceSnapshotSha256: z.ZodString;
    assessmentPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>;
    expectationAssessments: z.ZodArray<z.ZodObject<{
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            expectationId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedInterpretationManifestSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedMatchingManifestSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            assessmentPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
            deterministicInputs: z.ZodObject<{
                coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
                matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
                evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
                temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
                matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
            }, "strict", z.ZodTypeAny, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }>;
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
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedAssessmentId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            }, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
        proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
        evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
        defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
        freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
        contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
        gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
        assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
        materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            rationale: z.ZodString;
            relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }>, "many">;
        id: z.ZodString;
        expectationId: z.ZodString;
        expectation: z.ZodObject<{
            text: z.ZodString;
            type: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
            necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
            importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        }, "strict", z.ZodTypeAny, {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        }, {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["CRITICAL_REQUIREMENT_UNSUPPORTED", "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED", "MATERIAL_CONTRADICTION", "EVIDENCE_TOO_GENERAL", "EVIDENCE_TOO_OLD", "EVIDENCE_TOO_WEAK", "COMPOUND_EXPECTATION_PARTIALLY_COVERED", "ASSESSMENT_INCOMPLETE", "MATCHING_STALE", "INTERPRETATION_STALE", "PROVENANCE_INCOMPLETE"]>;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }, {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_APPROVED_MATCHING", "MATCHING_NOT_COMPLETE", "NO_SUPPORTED_EXPECTATIONS", "NO_REQUIRED_EXPECTATIONS_IDENTIFIED", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE", "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR", "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR", "MATERIALITY_UNCLEAR", "FRESHNESS_RELEVANCE_UNCLEAR", "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR", "CONTRADICTION_MATERIALITY_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        assessedExpectationCount: z.ZodNumber;
        totalEligibleExpectationCount: z.ZodNumber;
        summaryAvailable: z.ZodBoolean;
        usableForResumeConstruction: z.ZodBoolean;
        usableForApplicationConstruction: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "role-positioning";
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "role-positioning";
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}>;
export declare const JobFitAssessmentSchema: z.ZodObject<{
    targetType: z.ZodLiteral<"job">;
    mode: z.ZodLiteral<"job-specific">;
    summary: z.ZodObject<{
        mode: z.ZodLiteral<"job-specific">;
        opportunityAlignment: z.ZodEnum<["strong-alignment", "credible-alignment", "mixed-alignment", "weak-evidence-alignment", "material-conflict", "incomplete"]>;
        requiredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        preferredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        contextualExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        materialRiskExpectationIds: z.ZodArray<z.ZodString, "many">;
        unsupportedRequiredExpectationIds: z.ZodArray<z.ZodString, "many">;
        conflictingExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }>;
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
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
    evidenceSnapshotSha256: z.ZodString;
    assessmentPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>;
    expectationAssessments: z.ZodArray<z.ZodObject<{
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            expectationId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedInterpretationManifestSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedMatchingManifestSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            assessmentPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
            deterministicInputs: z.ZodObject<{
                coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
                matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
                evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
                temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
                matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
            }, "strict", z.ZodTypeAny, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }>;
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
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedAssessmentId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            }, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
        proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
        evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
        defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
        freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
        contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
        gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
        assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
        materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            rationale: z.ZodString;
            relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }>, "many">;
        id: z.ZodString;
        expectationId: z.ZodString;
        expectation: z.ZodObject<{
            text: z.ZodString;
            type: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
            necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
            importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        }, "strict", z.ZodTypeAny, {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        }, {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["CRITICAL_REQUIREMENT_UNSUPPORTED", "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED", "MATERIAL_CONTRADICTION", "EVIDENCE_TOO_GENERAL", "EVIDENCE_TOO_OLD", "EVIDENCE_TOO_WEAK", "COMPOUND_EXPECTATION_PARTIALLY_COVERED", "ASSESSMENT_INCOMPLETE", "MATCHING_STALE", "INTERPRETATION_STALE", "PROVENANCE_INCOMPLETE"]>;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }, {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_APPROVED_MATCHING", "MATCHING_NOT_COMPLETE", "NO_SUPPORTED_EXPECTATIONS", "NO_REQUIRED_EXPECTATIONS_IDENTIFIED", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE", "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR", "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR", "MATERIALITY_UNCLEAR", "FRESHNESS_RELEVANCE_UNCLEAR", "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR", "CONTRADICTION_MATERIALITY_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        assessedExpectationCount: z.ZodNumber;
        totalEligibleExpectationCount: z.ZodNumber;
        summaryAvailable: z.ZodBoolean;
        usableForResumeConstruction: z.ZodBoolean;
        usableForApplicationConstruction: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific";
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific";
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}>;
export declare const TargetFitAssessmentSchema: z.ZodEffects<z.ZodDiscriminatedUnion<"targetType", [z.ZodObject<{
    targetType: z.ZodLiteral<"role">;
    mode: z.ZodLiteral<"role-positioning">;
    summary: z.ZodObject<{
        mode: z.ZodLiteral<"role-positioning">;
        overallPositioning: z.ZodEnum<["well-supported", "supported-with-gaps", "partially-supported", "insufficient-evidence", "conflicting", "incomplete"]>;
        stronglySupportedCount: z.ZodNumber;
        supportedCount: z.ZodNumber;
        partiallySupportedCount: z.ZodNumber;
        unsupportedCount: z.ZodNumber;
        conflictingCount: z.ZodNumber;
        notAssessedCount: z.ZodNumber;
        criticalGapExpectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceImprovementExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }>;
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
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
    evidenceSnapshotSha256: z.ZodString;
    assessmentPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>;
    expectationAssessments: z.ZodArray<z.ZodObject<{
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            expectationId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedInterpretationManifestSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedMatchingManifestSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            assessmentPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
            deterministicInputs: z.ZodObject<{
                coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
                matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
                evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
                temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
                matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
            }, "strict", z.ZodTypeAny, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }>;
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
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedAssessmentId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            }, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
        proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
        evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
        defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
        freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
        contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
        gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
        assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
        materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            rationale: z.ZodString;
            relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }>, "many">;
        id: z.ZodString;
        expectationId: z.ZodString;
        expectation: z.ZodObject<{
            text: z.ZodString;
            type: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
            necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
            importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        }, "strict", z.ZodTypeAny, {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        }, {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["CRITICAL_REQUIREMENT_UNSUPPORTED", "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED", "MATERIAL_CONTRADICTION", "EVIDENCE_TOO_GENERAL", "EVIDENCE_TOO_OLD", "EVIDENCE_TOO_WEAK", "COMPOUND_EXPECTATION_PARTIALLY_COVERED", "ASSESSMENT_INCOMPLETE", "MATCHING_STALE", "INTERPRETATION_STALE", "PROVENANCE_INCOMPLETE"]>;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }, {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_APPROVED_MATCHING", "MATCHING_NOT_COMPLETE", "NO_SUPPORTED_EXPECTATIONS", "NO_REQUIRED_EXPECTATIONS_IDENTIFIED", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE", "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR", "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR", "MATERIALITY_UNCLEAR", "FRESHNESS_RELEVANCE_UNCLEAR", "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR", "CONTRADICTION_MATERIALITY_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        assessedExpectationCount: z.ZodNumber;
        totalEligibleExpectationCount: z.ZodNumber;
        summaryAvailable: z.ZodBoolean;
        usableForResumeConstruction: z.ZodBoolean;
        usableForApplicationConstruction: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "role-positioning";
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "role-positioning";
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}>, z.ZodObject<{
    targetType: z.ZodLiteral<"job">;
    mode: z.ZodLiteral<"job-specific">;
    summary: z.ZodObject<{
        mode: z.ZodLiteral<"job-specific">;
        opportunityAlignment: z.ZodEnum<["strong-alignment", "credible-alignment", "mixed-alignment", "weak-evidence-alignment", "material-conflict", "incomplete"]>;
        requiredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        preferredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        contextualExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        materialRiskExpectationIds: z.ZodArray<z.ZodString, "many">;
        unsupportedRequiredExpectationIds: z.ZodArray<z.ZodString, "many">;
        conflictingExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }>;
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
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
    evidenceSnapshotSha256: z.ZodString;
    assessmentPolicy: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        version: string;
    }, {
        name: string;
        version: string;
    }>;
    expectationAssessments: z.ZodArray<z.ZodObject<{
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            expectationId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedInterpretationManifestSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedMatchingManifestSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            assessmentPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
            deterministicInputs: z.ZodObject<{
                coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
                matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
                evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
                temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
                matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
            }, "strict", z.ZodTypeAny, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }>;
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
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedAssessmentId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            }, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
        proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
        evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
        defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
        freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
        contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
        gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
        assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
        materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            rationale: z.ZodString;
            relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }>, "many">;
        id: z.ZodString;
        expectationId: z.ZodString;
        expectation: z.ZodObject<{
            text: z.ZodString;
            type: z.ZodEnum<["responsibility", "capability", "experience", "technical-skill", "leadership", "domain-knowledge", "business-expectation", "success-outcome", "constraint", "candidate-attribute", "qualification", "unknown"]>;
            necessity: z.ZodEnum<["required", "preferred", "contextual", "unknown"]>;
            importance: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited"]>;
        }, "strict", z.ZodTypeAny, {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        }, {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        }>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["CRITICAL_REQUIREMENT_UNSUPPORTED", "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED", "MATERIAL_CONTRADICTION", "EVIDENCE_TOO_GENERAL", "EVIDENCE_TOO_OLD", "EVIDENCE_TOO_WEAK", "COMPOUND_EXPECTATION_PARTIALLY_COVERED", "ASSESSMENT_INCOMPLETE", "MATCHING_STALE", "INTERPRETATION_STALE", "PROVENANCE_INCOMPLETE"]>;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }, {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_APPROVED_MATCHING", "MATCHING_NOT_COMPLETE", "NO_SUPPORTED_EXPECTATIONS", "NO_REQUIRED_EXPECTATIONS_IDENTIFIED", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE", "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR", "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR", "MATERIALITY_UNCLEAR", "FRESHNESS_RELEVANCE_UNCLEAR", "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR", "CONTRADICTION_MATERIALITY_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
    completeness: z.ZodEffects<z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        assessedExpectationCount: z.ZodNumber;
        totalEligibleExpectationCount: z.ZodNumber;
        summaryAvailable: z.ZodBoolean;
        usableForResumeConstruction: z.ZodBoolean;
        usableForApplicationConstruction: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }>, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        assessedExpectationCount: number;
        totalEligibleExpectationCount: number;
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific";
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific";
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}>]>, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "role-positioning";
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
} | {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific";
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "role-positioning";
    targetType: "role";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
} | {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "job-specific";
    targetType: "job";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
        summaryAvailable: boolean;
        usableForResumeConstruction: boolean;
        usableForApplicationConstruction: boolean;
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    evidenceSnapshotSha256: string;
    assessmentPolicy: {
        name: string;
        version: string;
    };
    summary: {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    };
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationAssessments: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "human-approved" | "human-edited";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        expectation: {
            type: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            necessity: "unknown" | "required" | "preferred" | "contextual";
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            text: string;
        };
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }[];
}>;
export declare const FitAssessmentManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    artifactType: z.ZodEnum<["deterministic", "approved"]>;
    assessmentId: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    mode: z.ZodEnum<["role-positioning", "job-specific"]>;
    assessmentPath: z.ZodEffects<z.ZodString, string, string>;
    assessmentSha256: z.ZodString;
    policyName: z.ZodString;
    policyVersion: z.ZodString;
    targetSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedInterpretationManifestSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    approvedMatchingManifestSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    expectationSetSha256: z.ZodString;
    approvedMatchSetSha256: z.ZodString;
    proposalId: z.ZodOptional<z.ZodString>;
    proposalSha256: z.ZodOptional<z.ZodString>;
    reviewSha256: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    mode: "role-positioning" | "job-specific";
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    policyName: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    artifactType: "approved" | "deterministic";
    assessmentId: string;
    assessmentPath: string;
    assessmentSha256: string;
    expectationSetSha256: string;
    approvedMatchSetSha256: string;
    proposalId?: string | undefined;
    proposalSha256?: string | undefined;
    reviewSha256?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    mode: "role-positioning" | "job-specific";
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    policyName: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    artifactType: "approved" | "deterministic";
    assessmentId: string;
    assessmentPath: string;
    assessmentSha256: string;
    expectationSetSha256: string;
    approvedMatchSetSha256: string;
    proposalId?: string | undefined;
    proposalSha256?: string | undefined;
    reviewSha256?: string | undefined;
}>;
export declare const ModelProposedExpectationFitAssessmentSchema: z.ZodObject<{
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        expectationId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedInterpretationManifestSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedMatchingManifestSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        assessmentPolicy: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
            version: string;
        }, {
            name: string;
            version: string;
        }>;
        deterministicInputs: z.ZodObject<{
            coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
            matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
            evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
            temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
            matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
        }, "strict", z.ZodTypeAny, {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        }, {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        }>;
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
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedAssessmentId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        }, {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        } | undefined;
    }>;
    supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
    proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
    evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
    defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
    freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
    contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
    gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
    assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
    materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    limitations: z.ZodArray<z.ZodString, "many">;
    recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        rationale: z.ZodString;
        relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }, {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }>, "many">;
    expectationAssessmentId: z.ZodString;
    expectationId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    rationale: string;
    expectationId: string;
    provenance: {
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        } | undefined;
    };
    evidenceIds: string[];
    limitations: string[];
    approvedMatchIds: string[];
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    contradictionRisk: "high" | "medium" | "low" | "none";
    gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
    assessmentConfidence: "high" | "medium" | "low";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    recommendedEvidenceActions: {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }[];
    expectationAssessmentId: string;
}, {
    rationale: string;
    expectationId: string;
    provenance: {
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        } | undefined;
    };
    evidenceIds: string[];
    limitations: string[];
    approvedMatchIds: string[];
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    contradictionRisk: "high" | "medium" | "low" | "none";
    gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
    assessmentConfidence: "high" | "medium" | "low";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    recommendedEvidenceActions: {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }[];
    expectationAssessmentId: string;
}>;
export declare const ProposedExpectationFitAssessmentSchema: z.ZodObject<{
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        expectationId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedInterpretationManifestSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedMatchingManifestSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        assessmentPolicy: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
            version: string;
        }, {
            name: string;
            version: string;
        }>;
        deterministicInputs: z.ZodObject<{
            coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
            matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
            evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
            temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
            matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
        }, "strict", z.ZodTypeAny, {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        }, {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        }>;
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
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            proposedAssessmentId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
            policyVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        }, {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        } | undefined;
    }>;
    trustState: z.ZodLiteral<"proposed">;
    supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
    proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
    evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
    defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
    freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
    contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
    gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
    assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
    materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    limitations: z.ZodArray<z.ZodString, "many">;
    recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        rationale: z.ZodString;
        relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }, {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }>, "many">;
    id: z.ZodString;
    expectationAssessmentId: z.ZodString;
    expectationId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    rationale: string;
    trustState: "proposed";
    expectationId: string;
    provenance: {
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        } | undefined;
    };
    evidenceIds: string[];
    limitations: string[];
    approvedMatchIds: string[];
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    contradictionRisk: "high" | "medium" | "low" | "none";
    gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
    assessmentConfidence: "high" | "medium" | "low";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    recommendedEvidenceActions: {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }[];
    expectationAssessmentId: string;
}, {
    id: string;
    rationale: string;
    trustState: "proposed";
    expectationId: string;
    provenance: {
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
        approvedInterpretationSha256: string;
        expectationId: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedInterpretationManifestSha256: string;
        approvedMatchingSha256: string;
        approvedMatchingManifestSha256: string;
        evidenceSnapshotSha256: string;
        assessmentPolicy: {
            name: string;
            version: string;
        };
        deterministicInputs: {
            temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
            coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
            evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
            matchConfidences: ("high" | "medium" | "low")[];
        };
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            policyVersion: string;
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
            proposedAssessmentId: string;
        } | undefined;
    };
    evidenceIds: string[];
    limitations: string[];
    approvedMatchIds: string[];
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    contradictionRisk: "high" | "medium" | "low" | "none";
    gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
    assessmentConfidence: "high" | "medium" | "low";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    recommendedEvidenceActions: {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }[];
    expectationAssessmentId: string;
}>;
export declare const ModelFitAssessmentPayloadSchema: z.ZodObject<{
    proposedExpectationAssessments: z.ZodArray<z.ZodObject<{
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            expectationId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedInterpretationManifestSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedMatchingManifestSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            assessmentPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
            deterministicInputs: z.ZodObject<{
                coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
                matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
                evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
                temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
                matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
            }, "strict", z.ZodTypeAny, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }>;
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
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedAssessmentId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            }, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        }>;
        supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
        proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
        evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
        defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
        freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
        contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
        gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
        assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
        materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            rationale: z.ZodString;
            relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }>, "many">;
        expectationAssessmentId: z.ZodString;
        expectationId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        rationale: string;
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
        expectationAssessmentId: string;
    }, {
        rationale: string;
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
        expectationAssessmentId: string;
    }>, "many">;
    proposedSummary: z.ZodDiscriminatedUnion<"mode", [z.ZodObject<{
        mode: z.ZodLiteral<"role-positioning">;
        overallPositioning: z.ZodEnum<["well-supported", "supported-with-gaps", "partially-supported", "insufficient-evidence", "conflicting", "incomplete"]>;
        stronglySupportedCount: z.ZodNumber;
        supportedCount: z.ZodNumber;
        partiallySupportedCount: z.ZodNumber;
        unsupportedCount: z.ZodNumber;
        conflictingCount: z.ZodNumber;
        notAssessedCount: z.ZodNumber;
        criticalGapExpectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceImprovementExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }>, z.ZodObject<{
        mode: z.ZodLiteral<"job-specific">;
        opportunityAlignment: z.ZodEnum<["strong-alignment", "credible-alignment", "mixed-alignment", "weak-evidence-alignment", "material-conflict", "incomplete"]>;
        requiredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        preferredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        contextualExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        materialRiskExpectationIds: z.ZodArray<z.ZodString, "many">;
        unsupportedRequiredExpectationIds: z.ZodArray<z.ZodString, "many">;
        conflictingExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }>]>;
    warnings: z.ZodArray<z.ZodObject<Omit<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_APPROVED_MATCHING", "MATCHING_NOT_COMPLETE", "NO_SUPPORTED_EXPECTATIONS", "NO_REQUIRED_EXPECTATIONS_IDENTIFIED", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE", "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "id">, "strict", z.ZodTypeAny, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        expectationIds: string[];
        evidenceIds: string[];
    }, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        expectationIds: string[];
        evidenceIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<Omit<{
        id: z.ZodString;
        code: z.ZodEnum<["EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR", "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR", "MATERIALITY_UNCLEAR", "FRESHNESS_RELEVANCE_UNCLEAR", "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR", "CONTRADICTION_MATERIALITY_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "id">, "strict", z.ZodTypeAny, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    proposedExpectationAssessments: {
        rationale: string;
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
        expectationAssessmentId: string;
    }[];
    proposedSummary: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    } | {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    };
}, {
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }[];
    proposedExpectationAssessments: {
        rationale: string;
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
        expectationAssessmentId: string;
    }[];
    proposedSummary: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    } | {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    };
}>;
export declare const FitAssessmentValidationIssueSchema: z.ZodObject<{
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
export declare const FitAssessmentProposalSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    mode: z.ZodEnum<["role-positioning", "job-specific"]>;
    status: z.ZodEnum<["generated", "validation-failed", "ready-for-review", "reviewed"]>;
    assessmentPolicy: z.ZodObject<{
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
        deterministicAssessmentSha256: z.ZodString;
        normalizedModelInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicAssessmentSha256: string;
    }, {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicAssessmentSha256: string;
    }>;
    proposedExpectationAssessments: z.ZodArray<z.ZodObject<{
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            expectationId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedInterpretationManifestSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedMatchingManifestSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            assessmentPolicy: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                version: string;
            }, {
                name: string;
                version: string;
            }>;
            deterministicInputs: z.ZodObject<{
                coverageStatus: z.ZodEnum<["matched", "partially-matched", "unsupported", "not-assessed", "conflicting"]>;
                matchTypes: z.ZodArray<z.ZodEnum<["direct", "supporting", "partial", "contradictory"]>, "many">;
                evidenceStrengths: z.ZodArray<z.ZodEnum<["strong", "medium", "weak", "unknown"]>, "many">;
                temporalRelevance: z.ZodArray<z.ZodEnum<["current", "recent", "historical", "unknown"]>, "many">;
                matchConfidences: z.ZodArray<z.ZodEnum<["high", "medium", "low"]>, "many">;
            }, "strict", z.ZodTypeAny, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }, {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            }>;
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
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                proposedAssessmentId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
                policyVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            }, {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        }>;
        trustState: z.ZodLiteral<"proposed">;
        supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
        proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
        evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
        defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
        freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
        contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
        gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
        assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
        materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            rationale: z.ZodString;
            relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }>, "many">;
        id: z.ZodString;
        expectationAssessmentId: z.ZodString;
        expectationId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        id: string;
        rationale: string;
        trustState: "proposed";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
        expectationAssessmentId: string;
    }, {
        id: string;
        rationale: string;
        trustState: "proposed";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
        expectationAssessmentId: string;
    }>, "many">;
    proposedSummary: z.ZodOptional<z.ZodDiscriminatedUnion<"mode", [z.ZodObject<{
        mode: z.ZodLiteral<"role-positioning">;
        overallPositioning: z.ZodEnum<["well-supported", "supported-with-gaps", "partially-supported", "insufficient-evidence", "conflicting", "incomplete"]>;
        stronglySupportedCount: z.ZodNumber;
        supportedCount: z.ZodNumber;
        partiallySupportedCount: z.ZodNumber;
        unsupportedCount: z.ZodNumber;
        conflictingCount: z.ZodNumber;
        notAssessedCount: z.ZodNumber;
        criticalGapExpectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceImprovementExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }>, z.ZodObject<{
        mode: z.ZodLiteral<"job-specific">;
        opportunityAlignment: z.ZodEnum<["strong-alignment", "credible-alignment", "mixed-alignment", "weak-evidence-alignment", "material-conflict", "incomplete"]>;
        requiredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        preferredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        contextualExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        materialRiskExpectationIds: z.ZodArray<z.ZodString, "many">;
        unsupportedRequiredExpectationIds: z.ZodArray<z.ZodString, "many">;
        conflictingExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }>]>>;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["NO_APPROVED_MATCHING", "MATCHING_NOT_COMPLETE", "NO_SUPPORTED_EXPECTATIONS", "NO_REQUIRED_EXPECTATIONS_IDENTIFIED", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE", "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW"]>;
        message: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }, {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR", "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR", "MATERIALITY_UNCLEAR", "FRESHNESS_RELEVANCE_UNCLEAR", "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR", "CONTRADICTION_MATERIALITY_UNCLEAR"]>;
        message: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
        message: string;
        id: string;
        evidenceIds: string[];
        expectationId?: string | undefined;
    }, {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
    mode: "role-positioning" | "job-specific";
    input: {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicAssessmentSha256: string;
    };
    targetType: "role" | "job";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
    assessmentPolicy: {
        name: string;
        version: string;
    };
    proposedExpectationAssessments: {
        id: string;
        rationale: string;
        trustState: "proposed";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
        expectationAssessmentId: string;
    }[];
    proposedSummary?: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    } | {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    } | undefined;
}, {
    status: "generated" | "validation-failed" | "ready-for-review" | "reviewed";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "role-positioning" | "job-specific";
    input: {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicAssessmentSha256: string;
    };
    targetType: "role" | "job";
    targetId: string;
    warnings: {
        code: "NO_APPROVED_MATCHING" | "MATCHING_NOT_COMPLETE" | "NO_SUPPORTED_EXPECTATIONS" | "NO_REQUIRED_EXPECTATIONS_IDENTIFIED" | "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE" | "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
    }[];
    ambiguities: {
        code: "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR" | "SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR" | "MATERIALITY_UNCLEAR" | "FRESHNESS_RELEVANCE_UNCLEAR" | "COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR" | "CONTRADICTION_MATERIALITY_UNCLEAR";
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
    assessmentPolicy: {
        name: string;
        version: string;
    };
    proposedExpectationAssessments: {
        id: string;
        rationale: string;
        trustState: "proposed";
        expectationId: string;
        provenance: {
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
            approvedInterpretationSha256: string;
            expectationId: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedInterpretationManifestSha256: string;
            approvedMatchingSha256: string;
            approvedMatchingManifestSha256: string;
            evidenceSnapshotSha256: string;
            assessmentPolicy: {
                name: string;
                version: string;
            };
            deterministicInputs: {
                temporalRelevance: ("unknown" | "current" | "recent" | "historical")[];
                coverageStatus: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
                matchTypes: ("partial" | "direct" | "supporting" | "contradictory")[];
                evidenceStrengths: ("unknown" | "medium" | "strong" | "weak")[];
                matchConfidences: ("high" | "medium" | "low")[];
            };
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                policyVersion: string;
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
                proposedAssessmentId: string;
            } | undefined;
        };
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
        expectationAssessmentId: string;
    }[];
    proposedSummary?: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    } | {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    } | undefined;
}>;
export declare const FitAssessmentProposalManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    mode: z.ZodEnum<["role-positioning", "job-specific"]>;
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
    approvedInterpretationSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    deterministicAssessmentSha256: z.ZodString;
    normalizedModelInputSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    mode: "role-positioning" | "job-specific";
    targetSha256: string;
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
    policyName: string;
    approvedMatchingSha256: string;
    evidenceSnapshotSha256: string;
    deterministicAssessmentSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    mode: "role-positioning" | "job-specific";
    targetSha256: string;
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
    policyName: string;
    approvedMatchingSha256: string;
    evidenceSnapshotSha256: string;
    deterministicAssessmentSha256: string;
}>;
export declare const EditedExpectationFitAssessmentSchema: z.ZodObject<{
    supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
    proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
    evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
    defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
    freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
    contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
    gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
    assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
    materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    limitations: z.ZodArray<z.ZodString, "many">;
    recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        rationale: z.ZodString;
        relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }, {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    rationale: string;
    evidenceIds: string[];
    limitations: string[];
    approvedMatchIds: string[];
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    contradictionRisk: "high" | "medium" | "low" | "none";
    gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
    assessmentConfidence: "high" | "medium" | "low";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    recommendedEvidenceActions: {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }[];
}, {
    rationale: string;
    evidenceIds: string[];
    limitations: string[];
    approvedMatchIds: string[];
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    contradictionRisk: "high" | "medium" | "low" | "none";
    gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
    assessmentConfidence: "high" | "medium" | "low";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    recommendedEvidenceActions: {
        type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
        rationale: string;
        priority: "high" | "medium" | "low";
        relatedEvidenceIds: string[];
    }[];
}>;
export declare const FitAssessmentReviewDecisionSchema: z.ZodEffects<z.ZodObject<{
    proposedAssessmentId: z.ZodString;
    decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
    editedAssessment: z.ZodOptional<z.ZodObject<{
        supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
        proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
        evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
        defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
        freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
        contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
        gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
        assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
        materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        limitations: z.ZodArray<z.ZodString, "many">;
        recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
            priority: z.ZodEnum<["high", "medium", "low"]>;
            rationale: z.ZodString;
            relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }, {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        rationale: string;
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }, {
        rationale: string;
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    }>>;
    reviewNote: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedAssessmentId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedAssessment?: {
        rationale: string;
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    } | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedAssessmentId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedAssessment?: {
        rationale: string;
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    } | undefined;
}>, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedAssessmentId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedAssessment?: {
        rationale: string;
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    } | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    proposedAssessmentId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedAssessment?: {
        rationale: string;
        evidenceIds: string[];
        limitations: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        contradictionRisk: "high" | "medium" | "low" | "none";
        gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
        assessmentConfidence: "high" | "medium" | "low";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        recommendedEvidenceActions: {
            type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
            rationale: string;
            priority: "high" | "medium" | "low";
            relatedEvidenceIds: string[];
        }[];
    } | undefined;
}>;
export declare const FitAssessmentSummaryReviewDecisionSchema: z.ZodEffects<z.ZodObject<{
    decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
    editedSummary: z.ZodOptional<z.ZodDiscriminatedUnion<"mode", [z.ZodObject<{
        mode: z.ZodLiteral<"role-positioning">;
        overallPositioning: z.ZodEnum<["well-supported", "supported-with-gaps", "partially-supported", "insufficient-evidence", "conflicting", "incomplete"]>;
        stronglySupportedCount: z.ZodNumber;
        supportedCount: z.ZodNumber;
        partiallySupportedCount: z.ZodNumber;
        unsupportedCount: z.ZodNumber;
        conflictingCount: z.ZodNumber;
        notAssessedCount: z.ZodNumber;
        criticalGapExpectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceImprovementExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }, {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    }>, z.ZodObject<{
        mode: z.ZodLiteral<"job-specific">;
        opportunityAlignment: z.ZodEnum<["strong-alignment", "credible-alignment", "mixed-alignment", "weak-evidence-alignment", "material-conflict", "incomplete"]>;
        requiredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        preferredExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        contextualExpectationSummary: z.ZodObject<{
            total: z.ZodNumber;
            stronglySupported: z.ZodNumber;
            supported: z.ZodNumber;
            partiallySupported: z.ZodNumber;
            unsupported: z.ZodNumber;
            conflicting: z.ZodNumber;
            notAssessed: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }, {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        }>;
        materialRiskExpectationIds: z.ZodArray<z.ZodString, "many">;
        unsupportedRequiredExpectationIds: z.ZodArray<z.ZodString, "many">;
        conflictingExpectationIds: z.ZodArray<z.ZodString, "many">;
        narrative: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }, {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    }>]>>;
    reviewNote: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    decision: "pending" | "accept" | "edit" | "reject";
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedSummary?: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    } | {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    } | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedSummary?: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    } | {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    } | undefined;
}>, {
    decision: "pending" | "accept" | "edit" | "reject";
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedSummary?: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    } | {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    } | undefined;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedSummary?: {
        mode: "role-positioning";
        overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
        stronglySupportedCount: number;
        supportedCount: number;
        partiallySupportedCount: number;
        unsupportedCount: number;
        conflictingCount: number;
        notAssessedCount: number;
        criticalGapExpectationIds: string[];
        evidenceImprovementExpectationIds: string[];
        narrative: string;
    } | {
        mode: "job-specific";
        narrative: string;
        opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
        requiredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        preferredExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        contextualExpectationSummary: {
            conflicting: number;
            unsupported: number;
            supported: number;
            total: number;
            stronglySupported: number;
            partiallySupported: number;
            notAssessed: number;
        };
        materialRiskExpectationIds: string[];
        unsupportedRequiredExpectationIds: string[];
        conflictingExpectationIds: string[];
    } | undefined;
}>;
export declare const FitAssessmentProposalReviewSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    status: z.ZodEnum<["in-progress", "completed"]>;
    expectationDecisions: z.ZodArray<z.ZodEffects<z.ZodObject<{
        proposedAssessmentId: z.ZodString;
        decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
        editedAssessment: z.ZodOptional<z.ZodObject<{
            supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
            proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
            evidenceSufficiency: z.ZodEnum<["sufficient", "partially-sufficient", "insufficient", "not-evaluated"]>;
            defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
            freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
            contradictionRisk: z.ZodEnum<["none", "low", "medium", "high"]>;
            gapType: z.ZodEnum<["none", "evidence-gap", "coverage-gap", "freshness-gap", "specificity-gap", "experience-gap-possible", "contradiction", "not-assessed"]>;
            assessmentConfidence: z.ZodEnum<["high", "medium", "low"]>;
            materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            limitations: z.ZodArray<z.ZodString, "many">;
            recommendedEvidenceActions: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["add-specific-example", "add-quantified-outcome", "add-recent-example", "clarify-role-scope", "separate-compound-claim", "verify-claim", "resolve-contradiction", "review-unreviewed-source", "no-action"]>;
                priority: z.ZodEnum<["high", "medium", "low"]>;
                rationale: z.ZodString;
                relatedEvidenceIds: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }, {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            rationale: string;
            evidenceIds: string[];
            limitations: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            contradictionRisk: "high" | "medium" | "low" | "none";
            gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
            assessmentConfidence: "high" | "medium" | "low";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            recommendedEvidenceActions: {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }[];
        }, {
            rationale: string;
            evidenceIds: string[];
            limitations: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            contradictionRisk: "high" | "medium" | "low" | "none";
            gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
            assessmentConfidence: "high" | "medium" | "low";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            recommendedEvidenceActions: {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }[];
        }>>;
        reviewNote: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedAssessmentId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedAssessment?: {
            rationale: string;
            evidenceIds: string[];
            limitations: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            contradictionRisk: "high" | "medium" | "low" | "none";
            gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
            assessmentConfidence: "high" | "medium" | "low";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            recommendedEvidenceActions: {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }[];
        } | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedAssessmentId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedAssessment?: {
            rationale: string;
            evidenceIds: string[];
            limitations: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            contradictionRisk: "high" | "medium" | "low" | "none";
            gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
            assessmentConfidence: "high" | "medium" | "low";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            recommendedEvidenceActions: {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }[];
        } | undefined;
    }>, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedAssessmentId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedAssessment?: {
            rationale: string;
            evidenceIds: string[];
            limitations: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            contradictionRisk: "high" | "medium" | "low" | "none";
            gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
            assessmentConfidence: "high" | "medium" | "low";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            recommendedEvidenceActions: {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }[];
        } | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedAssessmentId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedAssessment?: {
            rationale: string;
            evidenceIds: string[];
            limitations: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            contradictionRisk: "high" | "medium" | "low" | "none";
            gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
            assessmentConfidence: "high" | "medium" | "low";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            recommendedEvidenceActions: {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }[];
        } | undefined;
    }>, "many">;
    summaryDecision: z.ZodEffects<z.ZodObject<{
        decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
        editedSummary: z.ZodOptional<z.ZodDiscriminatedUnion<"mode", [z.ZodObject<{
            mode: z.ZodLiteral<"role-positioning">;
            overallPositioning: z.ZodEnum<["well-supported", "supported-with-gaps", "partially-supported", "insufficient-evidence", "conflicting", "incomplete"]>;
            stronglySupportedCount: z.ZodNumber;
            supportedCount: z.ZodNumber;
            partiallySupportedCount: z.ZodNumber;
            unsupportedCount: z.ZodNumber;
            conflictingCount: z.ZodNumber;
            notAssessedCount: z.ZodNumber;
            criticalGapExpectationIds: z.ZodArray<z.ZodString, "many">;
            evidenceImprovementExpectationIds: z.ZodArray<z.ZodString, "many">;
            narrative: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            mode: "role-positioning";
            overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
            stronglySupportedCount: number;
            supportedCount: number;
            partiallySupportedCount: number;
            unsupportedCount: number;
            conflictingCount: number;
            notAssessedCount: number;
            criticalGapExpectationIds: string[];
            evidenceImprovementExpectationIds: string[];
            narrative: string;
        }, {
            mode: "role-positioning";
            overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
            stronglySupportedCount: number;
            supportedCount: number;
            partiallySupportedCount: number;
            unsupportedCount: number;
            conflictingCount: number;
            notAssessedCount: number;
            criticalGapExpectationIds: string[];
            evidenceImprovementExpectationIds: string[];
            narrative: string;
        }>, z.ZodObject<{
            mode: z.ZodLiteral<"job-specific">;
            opportunityAlignment: z.ZodEnum<["strong-alignment", "credible-alignment", "mixed-alignment", "weak-evidence-alignment", "material-conflict", "incomplete"]>;
            requiredExpectationSummary: z.ZodObject<{
                total: z.ZodNumber;
                stronglySupported: z.ZodNumber;
                supported: z.ZodNumber;
                partiallySupported: z.ZodNumber;
                unsupported: z.ZodNumber;
                conflicting: z.ZodNumber;
                notAssessed: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            }, {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            }>;
            preferredExpectationSummary: z.ZodObject<{
                total: z.ZodNumber;
                stronglySupported: z.ZodNumber;
                supported: z.ZodNumber;
                partiallySupported: z.ZodNumber;
                unsupported: z.ZodNumber;
                conflicting: z.ZodNumber;
                notAssessed: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            }, {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            }>;
            contextualExpectationSummary: z.ZodObject<{
                total: z.ZodNumber;
                stronglySupported: z.ZodNumber;
                supported: z.ZodNumber;
                partiallySupported: z.ZodNumber;
                unsupported: z.ZodNumber;
                conflicting: z.ZodNumber;
                notAssessed: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            }, {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            }>;
            materialRiskExpectationIds: z.ZodArray<z.ZodString, "many">;
            unsupportedRequiredExpectationIds: z.ZodArray<z.ZodString, "many">;
            conflictingExpectationIds: z.ZodArray<z.ZodString, "many">;
            narrative: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            mode: "job-specific";
            narrative: string;
            opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
            requiredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            preferredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            contextualExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            materialRiskExpectationIds: string[];
            unsupportedRequiredExpectationIds: string[];
            conflictingExpectationIds: string[];
        }, {
            mode: "job-specific";
            narrative: string;
            opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
            requiredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            preferredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            contextualExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            materialRiskExpectationIds: string[];
            unsupportedRequiredExpectationIds: string[];
            conflictingExpectationIds: string[];
        }>]>>;
        reviewNote: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        decision: "pending" | "accept" | "edit" | "reject";
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedSummary?: {
            mode: "role-positioning";
            overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
            stronglySupportedCount: number;
            supportedCount: number;
            partiallySupportedCount: number;
            unsupportedCount: number;
            conflictingCount: number;
            notAssessedCount: number;
            criticalGapExpectationIds: string[];
            evidenceImprovementExpectationIds: string[];
            narrative: string;
        } | {
            mode: "job-specific";
            narrative: string;
            opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
            requiredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            preferredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            contextualExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            materialRiskExpectationIds: string[];
            unsupportedRequiredExpectationIds: string[];
            conflictingExpectationIds: string[];
        } | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedSummary?: {
            mode: "role-positioning";
            overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
            stronglySupportedCount: number;
            supportedCount: number;
            partiallySupportedCount: number;
            unsupportedCount: number;
            conflictingCount: number;
            notAssessedCount: number;
            criticalGapExpectationIds: string[];
            evidenceImprovementExpectationIds: string[];
            narrative: string;
        } | {
            mode: "job-specific";
            narrative: string;
            opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
            requiredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            preferredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            contextualExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            materialRiskExpectationIds: string[];
            unsupportedRequiredExpectationIds: string[];
            conflictingExpectationIds: string[];
        } | undefined;
    }>, {
        decision: "pending" | "accept" | "edit" | "reject";
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedSummary?: {
            mode: "role-positioning";
            overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
            stronglySupportedCount: number;
            supportedCount: number;
            partiallySupportedCount: number;
            unsupportedCount: number;
            conflictingCount: number;
            notAssessedCount: number;
            criticalGapExpectationIds: string[];
            evidenceImprovementExpectationIds: string[];
            narrative: string;
        } | {
            mode: "job-specific";
            narrative: string;
            opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
            requiredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            preferredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            contextualExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            materialRiskExpectationIds: string[];
            unsupportedRequiredExpectationIds: string[];
            conflictingExpectationIds: string[];
        } | undefined;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedSummary?: {
            mode: "role-positioning";
            overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
            stronglySupportedCount: number;
            supportedCount: number;
            partiallySupportedCount: number;
            unsupportedCount: number;
            conflictingCount: number;
            notAssessedCount: number;
            criticalGapExpectationIds: string[];
            evidenceImprovementExpectationIds: string[];
            narrative: string;
        } | {
            mode: "job-specific";
            narrative: string;
            opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
            requiredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            preferredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            contextualExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            materialRiskExpectationIds: string[];
            unsupportedRequiredExpectationIds: string[];
            conflictingExpectationIds: string[];
        } | undefined;
    }>;
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
    expectationDecisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedAssessmentId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedAssessment?: {
            rationale: string;
            evidenceIds: string[];
            limitations: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            contradictionRisk: "high" | "medium" | "low" | "none";
            gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
            assessmentConfidence: "high" | "medium" | "low";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            recommendedEvidenceActions: {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }[];
        } | undefined;
    }[];
    summaryDecision: {
        decision: "pending" | "accept" | "edit" | "reject";
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedSummary?: {
            mode: "role-positioning";
            overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
            stronglySupportedCount: number;
            supportedCount: number;
            partiallySupportedCount: number;
            unsupportedCount: number;
            conflictingCount: number;
            notAssessedCount: number;
            criticalGapExpectationIds: string[];
            evidenceImprovementExpectationIds: string[];
            narrative: string;
        } | {
            mode: "job-specific";
            narrative: string;
            opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
            requiredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            preferredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            contextualExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            materialRiskExpectationIds: string[];
            unsupportedRequiredExpectationIds: string[];
            conflictingExpectationIds: string[];
        } | undefined;
    };
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
    expectationDecisions: {
        decision: "pending" | "accept" | "edit" | "reject";
        proposedAssessmentId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedAssessment?: {
            rationale: string;
            evidenceIds: string[];
            limitations: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            evidenceSufficiency: "sufficient" | "partially-sufficient" | "insufficient" | "not-evaluated";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            contradictionRisk: "high" | "medium" | "low" | "none";
            gapType: "none" | "not-assessed" | "evidence-gap" | "coverage-gap" | "freshness-gap" | "specificity-gap" | "experience-gap-possible" | "contradiction";
            assessmentConfidence: "high" | "medium" | "low";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            recommendedEvidenceActions: {
                type: "add-specific-example" | "add-quantified-outcome" | "add-recent-example" | "clarify-role-scope" | "separate-compound-claim" | "verify-claim" | "resolve-contradiction" | "review-unreviewed-source" | "no-action";
                rationale: string;
                priority: "high" | "medium" | "low";
                relatedEvidenceIds: string[];
            }[];
        } | undefined;
    }[];
    summaryDecision: {
        decision: "pending" | "accept" | "edit" | "reject";
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedSummary?: {
            mode: "role-positioning";
            overallPositioning: "conflicting" | "partially-supported" | "well-supported" | "supported-with-gaps" | "insufficient-evidence" | "incomplete";
            stronglySupportedCount: number;
            supportedCount: number;
            partiallySupportedCount: number;
            unsupportedCount: number;
            conflictingCount: number;
            notAssessedCount: number;
            criticalGapExpectationIds: string[];
            evidenceImprovementExpectationIds: string[];
            narrative: string;
        } | {
            mode: "job-specific";
            narrative: string;
            opportunityAlignment: "incomplete" | "strong-alignment" | "credible-alignment" | "mixed-alignment" | "weak-evidence-alignment" | "material-conflict";
            requiredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            preferredExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            contextualExpectationSummary: {
                conflicting: number;
                unsupported: number;
                supported: number;
                total: number;
                stronglySupported: number;
                partiallySupported: number;
                notAssessed: number;
            };
            materialRiskExpectationIds: string[];
            unsupportedRequiredExpectationIds: string[];
            conflictingExpectationIds: string[];
        } | undefined;
    };
}>;
export declare const FitAssessmentReviewManifestSchema: z.ZodObject<{
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
export type AssessmentMode = z.infer<typeof AssessmentModeSchema>;
export type SupportStatus = z.infer<typeof SupportStatusSchema>;
export type ProofQuality = z.infer<typeof ProofQualitySchema>;
export type EvidenceSufficiency = z.infer<typeof EvidenceSufficiencySchema>;
export type Defensibility = z.infer<typeof DefensibilitySchema>;
export type FreshnessRisk = z.infer<typeof FreshnessRiskSchema>;
export type ContradictionRisk = z.infer<typeof ContradictionRiskSchema>;
export type GapType = z.infer<typeof GapTypeSchema>;
export type AssessmentConfidence = z.infer<typeof AssessmentConfidenceSchema>;
export type Materiality = z.infer<typeof MaterialitySchema>;
export type AssessmentTrustState = z.infer<typeof AssessmentTrustStateSchema>;
export type EvidenceActionType = z.infer<typeof EvidenceActionTypeSchema>;
export type EvidenceActionRecommendation = z.infer<typeof EvidenceActionRecommendationSchema>;
export type ExpectationAssessmentProvenance = z.infer<typeof ExpectationAssessmentProvenanceSchema>;
export type ExpectationFitAssessment = z.infer<typeof ExpectationFitAssessmentSchema>;
export type AssessmentRisk = z.infer<typeof AssessmentRiskSchema>;
export type FitAssessmentWarning = z.infer<typeof FitAssessmentWarningSchema>;
export type FitAssessmentAmbiguity = z.infer<typeof FitAssessmentAmbiguitySchema>;
export type FitAssessmentCompleteness = z.infer<typeof FitAssessmentCompletenessSchema>;
export type RoleFitAssessmentSummary = z.infer<typeof RoleFitAssessmentSummarySchema>;
export type JobFitAssessmentSummary = z.infer<typeof JobFitAssessmentSummarySchema>;
export type FitAssessmentSummary = z.infer<typeof FitAssessmentSummarySchema>;
export type TargetFitAssessment = z.infer<typeof TargetFitAssessmentSchema>;
export type FitAssessmentManifest = z.infer<typeof FitAssessmentManifestSchema>;
export type ModelFitAssessmentPayload = z.infer<typeof ModelFitAssessmentPayloadSchema>;
export type ProposedExpectationFitAssessment = z.infer<typeof ProposedExpectationFitAssessmentSchema>;
export type FitAssessmentProposal = z.infer<typeof FitAssessmentProposalSchema>;
export type FitAssessmentProposalManifest = z.infer<typeof FitAssessmentProposalManifestSchema>;
export type FitAssessmentValidationIssue = z.infer<typeof FitAssessmentValidationIssueSchema>;
export type EditedExpectationFitAssessment = z.infer<typeof EditedExpectationFitAssessmentSchema>;
export type FitAssessmentProposalReview = z.infer<typeof FitAssessmentProposalReviewSchema>;
export type FitAssessmentReviewDecision = z.infer<typeof FitAssessmentReviewDecisionSchema>;
export type FitAssessmentSummaryReviewDecision = z.infer<typeof FitAssessmentSummaryReviewDecisionSchema>;
export type FitAssessmentReviewManifest = z.infer<typeof FitAssessmentReviewManifestSchema>;
