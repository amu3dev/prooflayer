import { z } from "zod";
export declare const RoleResumePlanningModeSchema: z.ZodLiteral<"market-positioning">;
export declare const RoleResumePlanTrustStateSchema: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
export declare const RoleResumeSectionTypeSchema: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
export declare const ResumeContentTypeSchema: z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>;
export declare const PlanDependencySchema: z.ZodObject<{
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
export declare const PlanElementProvenanceSchema: z.ZodObject<{
    targetId: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    approvedAssessmentSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    assessmentIds: z.ZodArray<z.ZodString, "many">;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
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
    deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
    modelProposal: z.ZodOptional<z.ZodObject<{
        proposalId: z.ZodString;
        provider: z.ZodString;
        model: z.ZodString;
        promptTemplateVersion: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        provider: string;
        model: string;
        proposalId: string;
        promptTemplateVersion: string;
    }, {
        provider: string;
        model: string;
        proposalId: string;
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
    expectationIds: string[];
    approvedInterpretationSha256: string;
    evidenceIds: string[];
    approvedMatchIds: string[];
    approvedMatchingSha256: string;
    evidenceSnapshotSha256: string;
    deterministicInputs: Record<string, string | number | boolean | string[]>;
    planningPolicy: {
        name: string;
        version: string;
    };
    assessmentIds: string[];
    approvedAssessmentSha256: string;
    reviewDecision?: {
        decision: "accept" | "edit";
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
    } | undefined;
    modelProposal?: {
        provider: string;
        model: string;
        proposalId: string;
        promptTemplateVersion: string;
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
    expectationIds: string[];
    approvedInterpretationSha256: string;
    evidenceIds: string[];
    approvedMatchIds: string[];
    approvedMatchingSha256: string;
    evidenceSnapshotSha256: string;
    deterministicInputs: Record<string, string | number | boolean | string[]>;
    planningPolicy: {
        name: string;
        version: string;
    };
    assessmentIds: string[];
    approvedAssessmentSha256: string;
    reviewDecision?: {
        decision: "accept" | "edit";
        reviewer: {
            type: "human";
            name?: string | undefined;
        };
    } | undefined;
    modelProposal?: {
        provider: string;
        model: string;
        proposalId: string;
        promptTemplateVersion: string;
    } | undefined;
}>;
export declare const PositioningThemeSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
    sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
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
        deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        }, {
            provider: string;
            model: string;
            proposalId: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    }>;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
}, "strict", z.ZodTypeAny, {
    id: string;
    sourceExpectationIds: string[];
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    approvedMatchIds: string[];
    label: string;
    sourceAssessmentIds: string[];
    emphasis: "supporting" | "secondary" | "primary";
}, {
    id: string;
    sourceExpectationIds: string[];
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    approvedMatchIds: string[];
    label: string;
    sourceAssessmentIds: string[];
    emphasis: "supporting" | "secondary" | "primary";
}>;
export declare const PositioningCautionSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    expectationIds: string[];
    rationale: string;
    evidenceIds: string[];
    label: string;
}, {
    id: string;
    expectationIds: string[];
    rationale: string;
    evidenceIds: string[];
    label: string;
}>;
export declare const RolePositioningPlanSchema: z.ZodObject<{
    targetRoleTitle: z.ZodString;
    positioningScope: z.ZodEnum<["direct-role-positioning", "adjacent-role-positioning", "stretch-positioning", "insufficient-evidence"]>;
    primaryThemes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }, {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }>, "many">;
    secondaryThemes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }, {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }>, "many">;
    differentiationThemes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }, {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }>, "many">;
    cautionThemes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        id: string;
        expectationIds: string[];
        rationale: string;
        evidenceIds: string[];
        label: string;
    }, {
        id: string;
        expectationIds: string[];
        rationale: string;
        evidenceIds: string[];
        label: string;
    }>, "many">;
    narrativeOrder: z.ZodArray<z.ZodString, "many">;
    audience: z.ZodObject<{
        primary: z.ZodEnum<["recruiter", "hiring-manager", "executive", "mixed"]>;
        notes: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        notes: string[];
        primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
    }, {
        notes: string[];
        primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
    }>;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
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
        deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        }, {
            provider: string;
            model: string;
            proposalId: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    }>;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
}, "strict", z.ZodTypeAny, {
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    targetRoleTitle: string;
    positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
    primaryThemes: {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }[];
    secondaryThemes: {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }[];
    differentiationThemes: {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }[];
    cautionThemes: {
        id: string;
        expectationIds: string[];
        rationale: string;
        evidenceIds: string[];
        label: string;
    }[];
    narrativeOrder: string[];
    audience: {
        notes: string[];
        primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
    };
}, {
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    targetRoleTitle: string;
    positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
    primaryThemes: {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }[];
    secondaryThemes: {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }[];
    differentiationThemes: {
        id: string;
        sourceExpectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        label: string;
        sourceAssessmentIds: string[];
        emphasis: "supporting" | "secondary" | "primary";
    }[];
    cautionThemes: {
        id: string;
        expectationIds: string[];
        rationale: string;
        evidenceIds: string[];
        label: string;
    }[];
    narrativeOrder: string[];
    audience: {
        notes: string[];
        primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
    };
}>;
export declare const RoleResumeSectionPlanSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
    status: z.ZodEnum<["include", "optional", "exclude"]>;
    objective: z.ZodString;
    order: z.ZodNumber;
    sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
    sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    allowedContentTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    prohibitedContentTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    emphasisNotes: z.ZodArray<z.ZodString, "many">;
    cautionNotes: z.ZodArray<z.ZodString, "many">;
    maximumItemCount: z.ZodOptional<z.ZodNumber>;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
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
        deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        }, {
            provider: string;
            model: string;
            proposalId: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    }>;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
}, "strict", z.ZodTypeAny, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    status: "exclude" | "include" | "optional";
    id: string;
    sourceExpectationIds: string[];
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    approvedMatchIds: string[];
    order: number;
    allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    sourceAssessmentIds: string[];
    objective: string;
    prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    emphasisNotes: string[];
    cautionNotes: string[];
    maximumItemCount?: number | undefined;
}, {
    type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
    status: "exclude" | "include" | "optional";
    id: string;
    sourceExpectationIds: string[];
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    approvedMatchIds: string[];
    order: number;
    allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    sourceAssessmentIds: string[];
    objective: string;
    prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    emphasisNotes: string[];
    cautionNotes: string[];
    maximumItemCount?: number | undefined;
}>;
export declare const ResumeExpectationSelectionSchema: z.ZodObject<{
    id: z.ZodString;
    expectationId: z.ZodString;
    assessmentId: z.ZodString;
    decision: z.ZodEnum<["primary", "secondary", "supporting", "exclude", "defer"]>;
    supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
    defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
    materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
    rationale: z.ZodString;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    allowedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
    restrictions: z.ZodArray<z.ZodString, "many">;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
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
        deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        }, {
            provider: string;
            model: string;
            proposalId: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    }>;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
}, "strict", z.ZodTypeAny, {
    decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
    id: string;
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    approvedMatchIds: string[];
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    assessmentId: string;
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    restrictions: string[];
}, {
    decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
    id: string;
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    approvedMatchIds: string[];
    supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
    defensibility: "high" | "medium" | "low" | "none" | "uncertain";
    materiality: "unknown" | "high" | "medium" | "low" | "critical";
    assessmentId: string;
    allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
    restrictions: string[];
}>;
export declare const ResumeEvidenceSelectionSchema: z.ZodObject<{
    id: z.ZodString;
    evidenceId: z.ZodString;
    decision: z.ZodEnum<["preferred", "allowed", "limited-use", "exclude"]>;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    permittedUses: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    prohibitedUses: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
    freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
    limitations: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
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
        deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        }, {
            provider: string;
            model: string;
            proposalId: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    }>;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
}, "strict", z.ZodTypeAny, {
    decision: "exclude" | "preferred" | "allowed" | "limited-use";
    id: string;
    expectationIds: string[];
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
    evidenceId: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    limitations: string[];
    approvedMatchIds: string[];
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
}, {
    decision: "exclude" | "preferred" | "allowed" | "limited-use";
    id: string;
    expectationIds: string[];
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
    evidenceId: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    limitations: string[];
    approvedMatchIds: string[];
    proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
    freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
    prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
}>;
export declare const ResumeClaimBoundarySchema: z.ZodObject<{
    id: z.ZodString;
    expectationId: z.ZodOptional<z.ZodString>;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    boundaryType: z.ZodEnum<["allowed", "allowed-with-caution", "prohibited", "requires-review"]>;
    allowedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    prohibitedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
    allowedScope: z.ZodOptional<z.ZodObject<{
        roleScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        teamScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        productScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        technicalScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        temporalScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        roleScope?: string[] | undefined;
        teamScope?: string[] | undefined;
        productScope?: string[] | undefined;
        technicalScope?: string[] | undefined;
        temporalScope?: string[] | undefined;
    }, {
        roleScope?: string[] | undefined;
        teamScope?: string[] | undefined;
        productScope?: string[] | undefined;
        technicalScope?: string[] | undefined;
        temporalScope?: string[] | undefined;
    }>>;
    prohibitedInferences: z.ZodArray<z.ZodString, "many">;
    requiredQualifiers: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
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
        deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        }, {
            provider: string;
            model: string;
            proposalId: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    }>;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
}, "strict", z.ZodTypeAny, {
    id: string;
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    requiredQualifiers: string[];
    allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
    prohibitedInferences: string[];
    expectationId?: string | undefined;
    allowedScope?: {
        roleScope?: string[] | undefined;
        teamScope?: string[] | undefined;
        productScope?: string[] | undefined;
        technicalScope?: string[] | undefined;
        temporalScope?: string[] | undefined;
    } | undefined;
}, {
    id: string;
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    requiredQualifiers: string[];
    allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
    prohibitedInferences: string[];
    expectationId?: string | undefined;
    allowedScope?: {
        roleScope?: string[] | undefined;
        teamScope?: string[] | undefined;
        productScope?: string[] | undefined;
        technicalScope?: string[] | undefined;
        temporalScope?: string[] | undefined;
    } | undefined;
}>;
export declare const ResumeContentExclusionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["unsupported-expectation", "conflicting-expectation", "weak-evidence", "stale-evidence", "insufficient-specificity", "missing-metric", "privacy-restricted", "publication-restricted", "unapproved-source", "job-specific-only", "duplicate-theme", "not-relevant-to-role"]>;
    expectationIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    rationale: z.ZodString;
    severity: z.ZodEnum<["blocking", "high", "medium", "low"]>;
    provenance: z.ZodObject<{
        targetId: z.ZodString;
        approvedInterpretationSha256: z.ZodString;
        approvedMatchingSha256: z.ZodString;
        approvedAssessmentSha256: z.ZodString;
        evidenceSnapshotSha256: z.ZodString;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        assessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
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
        deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        modelProposal: z.ZodOptional<z.ZodObject<{
            proposalId: z.ZodString;
            provider: z.ZodString;
            model: z.ZodString;
            promptTemplateVersion: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        }, {
            provider: string;
            model: string;
            proposalId: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    }>;
    trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
}, "strict", z.ZodTypeAny, {
    type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
    id: string;
    expectationIds: string[];
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "blocking";
}, {
    type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
    id: string;
    expectationIds: string[];
    rationale: string;
    trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
        expectationIds: string[];
        approvedInterpretationSha256: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        deterministicInputs: Record<string, string | number | boolean | string[]>;
        planningPolicy: {
            name: string;
            version: string;
        };
        assessmentIds: string[];
        approvedAssessmentSha256: string;
        reviewDecision?: {
            decision: "accept" | "edit";
            reviewer: {
                type: "human";
                name?: string | undefined;
            };
        } | undefined;
        modelProposal?: {
            provider: string;
            model: string;
            proposalId: string;
            promptTemplateVersion: string;
        } | undefined;
    };
    evidenceIds: string[];
    severity: "high" | "medium" | "low" | "blocking";
}>;
export declare const ResumePlanningRiskSchema: z.ZodObject<{
    expectationIds: z.ZodArray<z.ZodString, "many">;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodEnum<["NO_PRIMARY_POSITIONING_THEME", "CRITICAL_EXPECTATION_EXCLUDED", "PRIMARY_THEME_PARTIALLY_SUPPORTED", "PRIMARY_THEME_USES_LIMITED_EVIDENCE", "HISTORICAL_EVIDENCE_OVERRELIANCE", "INSUFFICIENT_RECENT_EVIDENCE", "INSUFFICIENT_SPECIFICITY", "QUANTIFIED_OUTCOME_NOT_AVAILABLE", "CONTRADICTORY_EVIDENCE_PRESENT", "EVIDENCE_REUSED_EXCESSIVELY", "PLAN_INCOMPLETE", "ASSESSMENT_STALE", "MATCHING_STALE", "INTERPRETATION_STALE", "PROVENANCE_INCOMPLETE"]>;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE" | "NO_PRIMARY_POSITIONING_THEME" | "CRITICAL_EXPECTATION_EXCLUDED" | "PRIMARY_THEME_PARTIALLY_SUPPORTED" | "PRIMARY_THEME_USES_LIMITED_EVIDENCE" | "HISTORICAL_EVIDENCE_OVERRELIANCE" | "INSUFFICIENT_RECENT_EVIDENCE" | "INSUFFICIENT_SPECIFICITY" | "QUANTIFIED_OUTCOME_NOT_AVAILABLE" | "CONTRADICTORY_EVIDENCE_PRESENT" | "EVIDENCE_REUSED_EXCESSIVELY" | "PLAN_INCOMPLETE" | "ASSESSMENT_STALE";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    approvedMatchIds: string[];
    severity: "high" | "medium" | "low" | "critical";
}, {
    code: "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE" | "NO_PRIMARY_POSITIONING_THEME" | "CRITICAL_EXPECTATION_EXCLUDED" | "PRIMARY_THEME_PARTIALLY_SUPPORTED" | "PRIMARY_THEME_USES_LIMITED_EVIDENCE" | "HISTORICAL_EVIDENCE_OVERRELIANCE" | "INSUFFICIENT_RECENT_EVIDENCE" | "INSUFFICIENT_SPECIFICITY" | "QUANTIFIED_OUTCOME_NOT_AVAILABLE" | "CONTRADICTORY_EVIDENCE_PRESENT" | "EVIDENCE_REUSED_EXCESSIVELY" | "PLAN_INCOMPLETE" | "ASSESSMENT_STALE";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    approvedMatchIds: string[];
    severity: "high" | "medium" | "low" | "critical";
}>;
export declare const ResumePlanningWarningSchema: z.ZodObject<{
    expectationIds: z.ZodArray<z.ZodString, "many">;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodEnum<["NO_APPROVED_ROLE_ASSESSMENT", "ASSESSMENT_NOT_COMPLETE", "NO_STRONGLY_SUPPORTED_EXPECTATIONS", "NO_PRIMARY_EXPECTATIONS_SELECTED", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "NO_QUANTIFIED_OUTCOMES_AVAILABLE", "ROLE_POSITIONING_REQUIRES_CAUTION", "MODEL_PLAN_REQUIRES_HUMAN_REVIEW", "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE"]>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    approvedMatchIds: string[];
}, {
    code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    approvedMatchIds: string[];
}>;
export declare const ResumePlanningAmbiguitySchema: z.ZodObject<{
    expectationIds: z.ZodArray<z.ZodString, "many">;
    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    id: z.ZodString;
    code: z.ZodEnum<["PRIMARY_VS_SECONDARY_THEME_UNCLEAR", "ROLE_SCOPE_UNCLEAR", "SENIORITY_BOUNDARY_UNCLEAR", "LEADERSHIP_SCOPE_UNCLEAR", "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR", "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR", "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR", "EVIDENCE_REUSE_BOUNDARY_UNCLEAR", "SECTION_INCLUSION_UNCLEAR"]>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    approvedMatchIds: string[];
}, {
    code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
    message: string;
    id: string;
    expectationIds: string[];
    evidenceIds: string[];
    approvedMatchIds: string[];
}>;
export declare const RoleResumePlanCompletenessSchema: z.ZodObject<{
    status: z.ZodEnum<["empty", "partial", "complete"]>;
    eligibleExpectationCount: z.ZodNumber;
    selectedExpectationCount: z.ZodNumber;
    excludedExpectationCount: z.ZodNumber;
    deferredExpectationCount: z.ZodNumber;
    plannedSectionCount: z.ZodNumber;
    primaryThemeCount: z.ZodNumber;
    claimBoundariesComplete: z.ZodBoolean;
    provenanceComplete: z.ZodBoolean;
    usableForResumeDrafting: z.ZodBoolean;
    blockingReasons: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    provenanceComplete: boolean;
    claimBoundariesComplete: boolean;
    eligibleExpectationCount: number;
    selectedExpectationCount: number;
    excludedExpectationCount: number;
    deferredExpectationCount: number;
    plannedSectionCount: number;
    primaryThemeCount: number;
    usableForResumeDrafting: boolean;
}, {
    status: "empty" | "partial" | "complete";
    blockingReasons: string[];
    provenanceComplete: boolean;
    claimBoundariesComplete: boolean;
    eligibleExpectationCount: number;
    selectedExpectationCount: number;
    excludedExpectationCount: number;
    deferredExpectationCount: number;
    plannedSectionCount: number;
    primaryThemeCount: number;
    usableForResumeDrafting: boolean;
}>;
export declare const RoleResumePlanProvenanceSchema: z.ZodObject<{
    targetSha256: z.ZodString;
    approvedInterpretationSha256: z.ZodString;
    approvedInterpretationManifestSha256: z.ZodString;
    approvedMatchingSha256: z.ZodString;
    approvedMatchingManifestSha256: z.ZodString;
    evidenceSnapshotSha256: z.ZodString;
    approvedAssessmentSha256: z.ZodString;
    approvedAssessmentManifestSha256: z.ZodString;
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
}>;
export declare const RoleResumeContentPlanSchema: z.ZodObject<{
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
    positioning: z.ZodObject<{
        targetRoleTitle: z.ZodString;
        positioningScope: z.ZodEnum<["direct-role-positioning", "adjacent-role-positioning", "stretch-positioning", "insufficient-evidence"]>;
        primaryThemes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }>, "many">;
        secondaryThemes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }>, "many">;
        differentiationThemes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }>, "many">;
        cautionThemes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }, {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }>, "many">;
        narrativeOrder: z.ZodArray<z.ZodString, "many">;
        audience: z.ZodObject<{
            primary: z.ZodEnum<["recruiter", "hiring-manager", "executive", "mixed"]>;
            notes: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        }, {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        }>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        targetRoleTitle: string;
        positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
        primaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        secondaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        differentiationThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        cautionThemes: {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }[];
        narrativeOrder: string[];
        audience: {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        };
    }, {
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        targetRoleTitle: string;
        positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
        primaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        secondaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        differentiationThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        cautionThemes: {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }[];
        narrativeOrder: string[];
        audience: {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        };
    }>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        status: z.ZodEnum<["include", "optional", "exclude"]>;
        objective: z.ZodString;
        order: z.ZodNumber;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        allowedContentTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        prohibitedContentTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        emphasisNotes: z.ZodArray<z.ZodString, "many">;
        cautionNotes: z.ZodArray<z.ZodString, "many">;
        maximumItemCount: z.ZodOptional<z.ZodNumber>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "exclude" | "include" | "optional";
        id: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        sourceAssessmentIds: string[];
        objective: string;
        prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        emphasisNotes: string[];
        cautionNotes: string[];
        maximumItemCount?: number | undefined;
    }, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "exclude" | "include" | "optional";
        id: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        sourceAssessmentIds: string[];
        objective: string;
        prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        emphasisNotes: string[];
        cautionNotes: string[];
        maximumItemCount?: number | undefined;
    }>, "many">;
    expectationSelections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        assessmentId: z.ZodString;
        decision: z.ZodEnum<["primary", "secondary", "supporting", "exclude", "defer"]>;
        supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
        defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
        materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        rationale: z.ZodString;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        allowedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
        restrictions: z.ZodArray<z.ZodString, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        assessmentId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        restrictions: string[];
    }, {
        decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        assessmentId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        restrictions: string[];
    }>, "many">;
    evidenceSelections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        evidenceId: z.ZodString;
        decision: z.ZodEnum<["preferred", "allowed", "limited-use", "exclude"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        permittedUses: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        prohibitedUses: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
        freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
        limitations: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        decision: "exclude" | "preferred" | "allowed" | "limited-use";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
        evidenceId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        limitations: string[];
        approvedMatchIds: string[];
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    }, {
        decision: "exclude" | "preferred" | "allowed" | "limited-use";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
        evidenceId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        limitations: string[];
        approvedMatchIds: string[];
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    }>, "many">;
    claimBoundaries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        boundaryType: z.ZodEnum<["allowed", "allowed-with-caution", "prohibited", "requires-review"]>;
        allowedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        prohibitedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        allowedScope: z.ZodOptional<z.ZodObject<{
            roleScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            teamScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            productScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            technicalScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temporalScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        }, {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        }>>;
        prohibitedInferences: z.ZodArray<z.ZodString, "many">;
        requiredQualifiers: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        requiredQualifiers: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
        prohibitedInferences: string[];
        expectationId?: string | undefined;
        allowedScope?: {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        } | undefined;
    }, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        requiredQualifiers: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
        prohibitedInferences: string[];
        expectationId?: string | undefined;
        allowedScope?: {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        } | undefined;
    }>, "many">;
    exclusions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["unsupported-expectation", "conflicting-expectation", "weak-evidence", "stale-evidence", "insufficient-specificity", "missing-metric", "privacy-restricted", "publication-restricted", "unapproved-source", "job-specific-only", "duplicate-theme", "not-relevant-to-role"]>;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        severity: z.ZodEnum<["blocking", "high", "medium", "low"]>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
    }, {
        type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
    }>, "many">;
    risks: z.ZodArray<z.ZodObject<{
        expectationIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodEnum<["NO_PRIMARY_POSITIONING_THEME", "CRITICAL_EXPECTATION_EXCLUDED", "PRIMARY_THEME_PARTIALLY_SUPPORTED", "PRIMARY_THEME_USES_LIMITED_EVIDENCE", "HISTORICAL_EVIDENCE_OVERRELIANCE", "INSUFFICIENT_RECENT_EVIDENCE", "INSUFFICIENT_SPECIFICITY", "QUANTIFIED_OUTCOME_NOT_AVAILABLE", "CONTRADICTORY_EVIDENCE_PRESENT", "EVIDENCE_REUSED_EXCESSIVELY", "PLAN_INCOMPLETE", "ASSESSMENT_STALE", "MATCHING_STALE", "INTERPRETATION_STALE", "PROVENANCE_INCOMPLETE"]>;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE" | "NO_PRIMARY_POSITIONING_THEME" | "CRITICAL_EXPECTATION_EXCLUDED" | "PRIMARY_THEME_PARTIALLY_SUPPORTED" | "PRIMARY_THEME_USES_LIMITED_EVIDENCE" | "HISTORICAL_EVIDENCE_OVERRELIANCE" | "INSUFFICIENT_RECENT_EVIDENCE" | "INSUFFICIENT_SPECIFICITY" | "QUANTIFIED_OUTCOME_NOT_AVAILABLE" | "CONTRADICTORY_EVIDENCE_PRESENT" | "EVIDENCE_REUSED_EXCESSIVELY" | "PLAN_INCOMPLETE" | "ASSESSMENT_STALE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }, {
        code: "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE" | "NO_PRIMARY_POSITIONING_THEME" | "CRITICAL_EXPECTATION_EXCLUDED" | "PRIMARY_THEME_PARTIALLY_SUPPORTED" | "PRIMARY_THEME_USES_LIMITED_EVIDENCE" | "HISTORICAL_EVIDENCE_OVERRELIANCE" | "INSUFFICIENT_RECENT_EVIDENCE" | "INSUFFICIENT_SPECIFICITY" | "QUANTIFIED_OUTCOME_NOT_AVAILABLE" | "CONTRADICTORY_EVIDENCE_PRESENT" | "EVIDENCE_REUSED_EXCESSIVELY" | "PLAN_INCOMPLETE" | "ASSESSMENT_STALE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        expectationIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodEnum<["NO_APPROVED_ROLE_ASSESSMENT", "ASSESSMENT_NOT_COMPLETE", "NO_STRONGLY_SUPPORTED_EXPECTATIONS", "NO_PRIMARY_EXPECTATIONS_SELECTED", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "NO_QUANTIFIED_OUTCOMES_AVAILABLE", "ROLE_POSITIONING_REQUIRES_CAUTION", "MODEL_PLAN_REQUIRES_HUMAN_REVIEW", "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }, {
        code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        expectationIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodEnum<["PRIMARY_VS_SECONDARY_THEME_UNCLEAR", "ROLE_SCOPE_UNCLEAR", "SENIORITY_BOUNDARY_UNCLEAR", "LEADERSHIP_SCOPE_UNCLEAR", "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR", "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR", "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR", "EVIDENCE_REUSE_BOUNDARY_UNCLEAR", "SECTION_INCLUSION_UNCLEAR"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }, {
        code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }>, "many">;
    completeness: z.ZodObject<{
        status: z.ZodEnum<["empty", "partial", "complete"]>;
        eligibleExpectationCount: z.ZodNumber;
        selectedExpectationCount: z.ZodNumber;
        excludedExpectationCount: z.ZodNumber;
        deferredExpectationCount: z.ZodNumber;
        plannedSectionCount: z.ZodNumber;
        primaryThemeCount: z.ZodNumber;
        claimBoundariesComplete: z.ZodBoolean;
        provenanceComplete: z.ZodBoolean;
        usableForResumeDrafting: z.ZodBoolean;
        blockingReasons: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        provenanceComplete: boolean;
        claimBoundariesComplete: boolean;
        eligibleExpectationCount: number;
        selectedExpectationCount: number;
        excludedExpectationCount: number;
        deferredExpectationCount: number;
        plannedSectionCount: number;
        primaryThemeCount: number;
        usableForResumeDrafting: boolean;
    }, {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        provenanceComplete: boolean;
        claimBoundariesComplete: boolean;
        eligibleExpectationCount: number;
        selectedExpectationCount: number;
        excludedExpectationCount: number;
        deferredExpectationCount: number;
        plannedSectionCount: number;
        primaryThemeCount: number;
        usableForResumeDrafting: boolean;
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
        status: "exclude" | "include" | "optional";
        id: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        sourceAssessmentIds: string[];
        objective: string;
        prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        emphasisNotes: string[];
        cautionNotes: string[];
        maximumItemCount?: number | undefined;
    }[];
    targetType: "role";
    targetId: string;
    warnings: {
        code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }[];
    ambiguities: {
        code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        provenanceComplete: boolean;
        claimBoundariesComplete: boolean;
        eligibleExpectationCount: number;
        selectedExpectationCount: number;
        excludedExpectationCount: number;
        deferredExpectationCount: number;
        plannedSectionCount: number;
        primaryThemeCount: number;
        usableForResumeDrafting: boolean;
    };
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
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE" | "NO_PRIMARY_POSITIONING_THEME" | "CRITICAL_EXPECTATION_EXCLUDED" | "PRIMARY_THEME_PARTIALLY_SUPPORTED" | "PRIMARY_THEME_USES_LIMITED_EVIDENCE" | "HISTORICAL_EVIDENCE_OVERRELIANCE" | "INSUFFICIENT_RECENT_EVIDENCE" | "INSUFFICIENT_SPECIFICITY" | "QUANTIFIED_OUTCOME_NOT_AVAILABLE" | "CONTRADICTORY_EVIDENCE_PRESENT" | "EVIDENCE_REUSED_EXCESSIVELY" | "PLAN_INCOMPLETE" | "ASSESSMENT_STALE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    planningPolicy: {
        name: string;
        version: string;
    };
    positioning: {
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        targetRoleTitle: string;
        positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
        primaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        secondaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        differentiationThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        cautionThemes: {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }[];
        narrativeOrder: string[];
        audience: {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        };
    };
    evidenceSelections: {
        decision: "exclude" | "preferred" | "allowed" | "limited-use";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
        evidenceId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        limitations: string[];
        approvedMatchIds: string[];
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    }[];
    claimBoundaries: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        requiredQualifiers: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
        prohibitedInferences: string[];
        expectationId?: string | undefined;
        allowedScope?: {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        } | undefined;
    }[];
    exclusions: {
        type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
    }[];
    roleTitle: string;
    approvedAssessment: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationSelections: {
        decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        assessmentId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        restrictions: string[];
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "market-positioning";
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "exclude" | "include" | "optional";
        id: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        sourceAssessmentIds: string[];
        objective: string;
        prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        emphasisNotes: string[];
        cautionNotes: string[];
        maximumItemCount?: number | undefined;
    }[];
    targetType: "role";
    targetId: string;
    warnings: {
        code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }[];
    ambiguities: {
        code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }[];
    completeness: {
        status: "empty" | "partial" | "complete";
        blockingReasons: string[];
        provenanceComplete: boolean;
        claimBoundariesComplete: boolean;
        eligibleExpectationCount: number;
        selectedExpectationCount: number;
        excludedExpectationCount: number;
        deferredExpectationCount: number;
        plannedSectionCount: number;
        primaryThemeCount: number;
        usableForResumeDrafting: boolean;
    };
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
    };
    approvedInterpretation: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    risks: {
        code: "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE" | "NO_PRIMARY_POSITIONING_THEME" | "CRITICAL_EXPECTATION_EXCLUDED" | "PRIMARY_THEME_PARTIALLY_SUPPORTED" | "PRIMARY_THEME_USES_LIMITED_EVIDENCE" | "HISTORICAL_EVIDENCE_OVERRELIANCE" | "INSUFFICIENT_RECENT_EVIDENCE" | "INSUFFICIENT_SPECIFICITY" | "QUANTIFIED_OUTCOME_NOT_AVAILABLE" | "CONTRADICTORY_EVIDENCE_PRESENT" | "EVIDENCE_REUSED_EXCESSIVELY" | "PLAN_INCOMPLETE" | "ASSESSMENT_STALE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
        severity: "high" | "medium" | "low" | "critical";
    }[];
    approvedMatching: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    planningPolicy: {
        name: string;
        version: string;
    };
    positioning: {
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        targetRoleTitle: string;
        positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
        primaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        secondaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        differentiationThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        cautionThemes: {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }[];
        narrativeOrder: string[];
        audience: {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        };
    };
    evidenceSelections: {
        decision: "exclude" | "preferred" | "allowed" | "limited-use";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
        evidenceId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        limitations: string[];
        approvedMatchIds: string[];
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    }[];
    claimBoundaries: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        requiredQualifiers: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
        prohibitedInferences: string[];
        expectationId?: string | undefined;
        allowedScope?: {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        } | undefined;
    }[];
    exclusions: {
        type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
    }[];
    roleTitle: string;
    approvedAssessment: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    expectationSelections: {
        decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        assessmentId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        restrictions: string[];
    }[];
}>;
export declare const RoleResumePlanManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    artifactType: z.ZodEnum<["deterministic", "approved"]>;
    planId: z.ZodString;
    targetId: z.ZodString;
    mode: z.ZodLiteral<"market-positioning">;
    planPath: z.ZodEffects<z.ZodString, string, string>;
    planSha256: z.ZodString;
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
    expectationSetSha256: z.ZodString;
    assessmentSetSha256: z.ZodString;
    approvedMatchSetSha256: z.ZodString;
    evidenceSetSha256: z.ZodString;
    proposalId: z.ZodOptional<z.ZodString>;
    proposalSha256: z.ZodOptional<z.ZodString>;
    reviewSha256: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    mode: "market-positioning";
    targetSha256: string;
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    policyName: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    artifactType: "approved" | "deterministic";
    expectationSetSha256: string;
    approvedMatchSetSha256: string;
    planId: string;
    planPath: string;
    planSha256: string;
    approvedAssessmentSha256: string;
    approvedAssessmentManifestSha256: string;
    assessmentSetSha256: string;
    evidenceSetSha256: string;
    proposalId?: string | undefined;
    proposalSha256?: string | undefined;
    reviewSha256?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    mode: "market-positioning";
    targetSha256: string;
    targetId: string;
    policyVersion: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestSha256: string;
    policyName: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    artifactType: "approved" | "deterministic";
    expectationSetSha256: string;
    approvedMatchSetSha256: string;
    planId: string;
    planPath: string;
    planSha256: string;
    approvedAssessmentSha256: string;
    approvedAssessmentManifestSha256: string;
    assessmentSetSha256: string;
    evidenceSetSha256: string;
    proposalId?: string | undefined;
    proposalSha256?: string | undefined;
    reviewSha256?: string | undefined;
}>;
export declare const ModelRoleResumePlanPayloadSchema: z.ZodObject<{
    positioning: z.ZodObject<{
        targetRoleTitle: z.ZodString;
        positioningScope: z.ZodEnum<["direct-role-positioning", "adjacent-role-positioning", "stretch-positioning", "insufficient-evidence"]>;
        primaryThemes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }>, "many">;
        secondaryThemes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }>, "many">;
        differentiationThemes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }, {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }>, "many">;
        cautionThemes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }, {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }>, "many">;
        narrativeOrder: z.ZodArray<z.ZodString, "many">;
        audience: z.ZodObject<{
            primary: z.ZodEnum<["recruiter", "hiring-manager", "executive", "mixed"]>;
            notes: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        }, {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        }>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        targetRoleTitle: string;
        positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
        primaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        secondaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        differentiationThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        cautionThemes: {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }[];
        narrativeOrder: string[];
        audience: {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        };
    }, {
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        targetRoleTitle: string;
        positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
        primaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        secondaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        differentiationThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        cautionThemes: {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }[];
        narrativeOrder: string[];
        audience: {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        };
    }>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
        status: z.ZodEnum<["include", "optional", "exclude"]>;
        objective: z.ZodString;
        order: z.ZodNumber;
        sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
        sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        allowedContentTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        prohibitedContentTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        emphasisNotes: z.ZodArray<z.ZodString, "many">;
        cautionNotes: z.ZodArray<z.ZodString, "many">;
        maximumItemCount: z.ZodOptional<z.ZodNumber>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "exclude" | "include" | "optional";
        id: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        sourceAssessmentIds: string[];
        objective: string;
        prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        emphasisNotes: string[];
        cautionNotes: string[];
        maximumItemCount?: number | undefined;
    }, {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "exclude" | "include" | "optional";
        id: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        sourceAssessmentIds: string[];
        objective: string;
        prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        emphasisNotes: string[];
        cautionNotes: string[];
        maximumItemCount?: number | undefined;
    }>, "many">;
    expectationSelections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodString;
        assessmentId: z.ZodString;
        decision: z.ZodEnum<["primary", "secondary", "supporting", "exclude", "defer"]>;
        supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
        defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
        materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
        rationale: z.ZodString;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        allowedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
        restrictions: z.ZodArray<z.ZodString, "many">;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        assessmentId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        restrictions: string[];
    }, {
        decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        assessmentId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        restrictions: string[];
    }>, "many">;
    evidenceSelections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        evidenceId: z.ZodString;
        decision: z.ZodEnum<["preferred", "allowed", "limited-use", "exclude"]>;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        permittedUses: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        prohibitedUses: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
        freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
        limitations: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        decision: "exclude" | "preferred" | "allowed" | "limited-use";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
        evidenceId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        limitations: string[];
        approvedMatchIds: string[];
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    }, {
        decision: "exclude" | "preferred" | "allowed" | "limited-use";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
        evidenceId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        limitations: string[];
        approvedMatchIds: string[];
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    }>, "many">;
    claimBoundaries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expectationId: z.ZodOptional<z.ZodString>;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        boundaryType: z.ZodEnum<["allowed", "allowed-with-caution", "prohibited", "requires-review"]>;
        allowedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        prohibitedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
        allowedScope: z.ZodOptional<z.ZodObject<{
            roleScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            teamScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            productScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            technicalScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            temporalScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        }, {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        }>>;
        prohibitedInferences: z.ZodArray<z.ZodString, "many">;
        requiredQualifiers: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        requiredQualifiers: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
        prohibitedInferences: string[];
        expectationId?: string | undefined;
        allowedScope?: {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        } | undefined;
    }, {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        requiredQualifiers: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
        prohibitedInferences: string[];
        expectationId?: string | undefined;
        allowedScope?: {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        } | undefined;
    }>, "many">;
    exclusions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["unsupported-expectation", "conflicting-expectation", "weak-evidence", "stale-evidence", "insufficient-specificity", "missing-metric", "privacy-restricted", "publication-restricted", "unapproved-source", "job-specific-only", "duplicate-theme", "not-relevant-to-role"]>;
        expectationIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        rationale: z.ZodString;
        severity: z.ZodEnum<["blocking", "high", "medium", "low"]>;
        provenance: z.ZodObject<{
            targetId: z.ZodString;
            approvedInterpretationSha256: z.ZodString;
            approvedMatchingSha256: z.ZodString;
            approvedAssessmentSha256: z.ZodString;
            evidenceSnapshotSha256: z.ZodString;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            assessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
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
            deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            modelProposal: z.ZodOptional<z.ZodObject<{
                proposalId: z.ZodString;
                provider: z.ZodString;
                model: z.ZodString;
                promptTemplateVersion: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            }, {
                provider: string;
                model: string;
                proposalId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        }>;
        trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
    }, "strict", z.ZodTypeAny, {
        type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
    }, {
        type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        expectationIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodEnum<["NO_APPROVED_ROLE_ASSESSMENT", "ASSESSMENT_NOT_COMPLETE", "NO_STRONGLY_SUPPORTED_EXPECTATIONS", "NO_PRIMARY_EXPECTATIONS_SELECTED", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "NO_QUANTIFIED_OUTCOMES_AVAILABLE", "ROLE_POSITIONING_REQUIRES_CAUTION", "MODEL_PLAN_REQUIRES_HUMAN_REVIEW", "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }, {
        code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        expectationIds: z.ZodArray<z.ZodString, "many">;
        approvedMatchIds: z.ZodArray<z.ZodString, "many">;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        code: z.ZodEnum<["PRIMARY_VS_SECONDARY_THEME_UNCLEAR", "ROLE_SCOPE_UNCLEAR", "SENIORITY_BOUNDARY_UNCLEAR", "LEADERSHIP_SCOPE_UNCLEAR", "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR", "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR", "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR", "EVIDENCE_REUSE_BOUNDARY_UNCLEAR", "SECTION_INCLUSION_UNCLEAR"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }, {
        code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "exclude" | "include" | "optional";
        id: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        sourceAssessmentIds: string[];
        objective: string;
        prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        emphasisNotes: string[];
        cautionNotes: string[];
        maximumItemCount?: number | undefined;
    }[];
    warnings: {
        code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }[];
    ambiguities: {
        code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }[];
    positioning: {
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        targetRoleTitle: string;
        positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
        primaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        secondaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        differentiationThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        cautionThemes: {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }[];
        narrativeOrder: string[];
        audience: {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        };
    };
    evidenceSelections: {
        decision: "exclude" | "preferred" | "allowed" | "limited-use";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
        evidenceId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        limitations: string[];
        approvedMatchIds: string[];
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    }[];
    claimBoundaries: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        requiredQualifiers: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
        prohibitedInferences: string[];
        expectationId?: string | undefined;
        allowedScope?: {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        } | undefined;
    }[];
    exclusions: {
        type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
    }[];
    expectationSelections: {
        decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        assessmentId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        restrictions: string[];
    }[];
}, {
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "exclude" | "include" | "optional";
        id: string;
        sourceExpectationIds: string[];
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        order: number;
        allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        sourceAssessmentIds: string[];
        objective: string;
        prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        emphasisNotes: string[];
        cautionNotes: string[];
        maximumItemCount?: number | undefined;
    }[];
    warnings: {
        code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }[];
    ambiguities: {
        code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
        message: string;
        id: string;
        expectationIds: string[];
        evidenceIds: string[];
        approvedMatchIds: string[];
    }[];
    positioning: {
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        targetRoleTitle: string;
        positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
        primaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        secondaryThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        differentiationThemes: {
            id: string;
            sourceExpectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            label: string;
            sourceAssessmentIds: string[];
            emphasis: "supporting" | "secondary" | "primary";
        }[];
        cautionThemes: {
            id: string;
            expectationIds: string[];
            rationale: string;
            evidenceIds: string[];
            label: string;
        }[];
        narrativeOrder: string[];
        audience: {
            notes: string[];
            primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
        };
    };
    evidenceSelections: {
        decision: "exclude" | "preferred" | "allowed" | "limited-use";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
        evidenceId: string;
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        limitations: string[];
        approvedMatchIds: string[];
        proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
        freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
        prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
    }[];
    claimBoundaries: {
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        requiredQualifiers: string[];
        allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
        prohibitedInferences: string[];
        expectationId?: string | undefined;
        allowedScope?: {
            roleScope?: string[] | undefined;
            teamScope?: string[] | undefined;
            productScope?: string[] | undefined;
            technicalScope?: string[] | undefined;
            temporalScope?: string[] | undefined;
        } | undefined;
    }[];
    exclusions: {
        type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
        id: string;
        expectationIds: string[];
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        severity: "high" | "medium" | "low" | "blocking";
    }[];
    expectationSelections: {
        decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
        id: string;
        rationale: string;
        trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
            expectationIds: string[];
            approvedInterpretationSha256: string;
            evidenceIds: string[];
            approvedMatchIds: string[];
            approvedMatchingSha256: string;
            evidenceSnapshotSha256: string;
            deterministicInputs: Record<string, string | number | boolean | string[]>;
            planningPolicy: {
                name: string;
                version: string;
            };
            assessmentIds: string[];
            approvedAssessmentSha256: string;
            reviewDecision?: {
                decision: "accept" | "edit";
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
            } | undefined;
            modelProposal?: {
                provider: string;
                model: string;
                proposalId: string;
                promptTemplateVersion: string;
            } | undefined;
        };
        evidenceIds: string[];
        approvedMatchIds: string[];
        supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
        defensibility: "high" | "medium" | "low" | "none" | "uncertain";
        materiality: "unknown" | "high" | "medium" | "low" | "critical";
        assessmentId: string;
        allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
        restrictions: string[];
    }[];
}>;
export declare const ResumePlanValidationIssueSchema: z.ZodObject<{
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
export declare const RoleResumePlanProposalSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    requestFingerprint: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"role">;
    mode: z.ZodLiteral<"market-positioning">;
    status: z.ZodEnum<["generated", "validation-failed", "ready-for-review", "reviewed"]>;
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
        deterministicPlanSha256: z.ZodString;
        normalizedModelInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        approvedAssessmentSha256: string;
        deterministicPlanSha256: string;
    }, {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        approvedAssessmentSha256: string;
        deterministicPlanSha256: string;
    }>;
    proposedPlan: z.ZodOptional<z.ZodObject<{
        positioning: z.ZodObject<{
            targetRoleTitle: z.ZodString;
            positioningScope: z.ZodEnum<["direct-role-positioning", "adjacent-role-positioning", "stretch-positioning", "insufficient-evidence"]>;
            primaryThemes: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
                sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                rationale: z.ZodString;
                emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
                provenance: z.ZodObject<{
                    targetId: z.ZodString;
                    approvedInterpretationSha256: z.ZodString;
                    approvedMatchingSha256: z.ZodString;
                    approvedAssessmentSha256: z.ZodString;
                    evidenceSnapshotSha256: z.ZodString;
                    expectationIds: z.ZodArray<z.ZodString, "many">;
                    assessmentIds: z.ZodArray<z.ZodString, "many">;
                    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                    evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                    deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                    modelProposal: z.ZodOptional<z.ZodObject<{
                        proposalId: z.ZodString;
                        provider: z.ZodString;
                        model: z.ZodString;
                        promptTemplateVersion: z.ZodString;
                    }, "strict", z.ZodTypeAny, {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    }, {
                        provider: string;
                        model: string;
                        proposalId: string;
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                }>;
                trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
            }, "strict", z.ZodTypeAny, {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }, {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }>, "many">;
            secondaryThemes: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
                sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                rationale: z.ZodString;
                emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
                provenance: z.ZodObject<{
                    targetId: z.ZodString;
                    approvedInterpretationSha256: z.ZodString;
                    approvedMatchingSha256: z.ZodString;
                    approvedAssessmentSha256: z.ZodString;
                    evidenceSnapshotSha256: z.ZodString;
                    expectationIds: z.ZodArray<z.ZodString, "many">;
                    assessmentIds: z.ZodArray<z.ZodString, "many">;
                    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                    evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                    deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                    modelProposal: z.ZodOptional<z.ZodObject<{
                        proposalId: z.ZodString;
                        provider: z.ZodString;
                        model: z.ZodString;
                        promptTemplateVersion: z.ZodString;
                    }, "strict", z.ZodTypeAny, {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    }, {
                        provider: string;
                        model: string;
                        proposalId: string;
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                }>;
                trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
            }, "strict", z.ZodTypeAny, {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }, {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }>, "many">;
            differentiationThemes: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
                sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                rationale: z.ZodString;
                emphasis: z.ZodEnum<["primary", "secondary", "supporting"]>;
                provenance: z.ZodObject<{
                    targetId: z.ZodString;
                    approvedInterpretationSha256: z.ZodString;
                    approvedMatchingSha256: z.ZodString;
                    approvedAssessmentSha256: z.ZodString;
                    evidenceSnapshotSha256: z.ZodString;
                    expectationIds: z.ZodArray<z.ZodString, "many">;
                    assessmentIds: z.ZodArray<z.ZodString, "many">;
                    approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                    evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                    deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                    modelProposal: z.ZodOptional<z.ZodObject<{
                        proposalId: z.ZodString;
                        provider: z.ZodString;
                        model: z.ZodString;
                        promptTemplateVersion: z.ZodString;
                    }, "strict", z.ZodTypeAny, {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    }, {
                        provider: string;
                        model: string;
                        proposalId: string;
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                }>;
                trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
            }, "strict", z.ZodTypeAny, {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }, {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }>, "many">;
            cautionThemes: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
                rationale: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                id: string;
                expectationIds: string[];
                rationale: string;
                evidenceIds: string[];
                label: string;
            }, {
                id: string;
                expectationIds: string[];
                rationale: string;
                evidenceIds: string[];
                label: string;
            }>, "many">;
            narrativeOrder: z.ZodArray<z.ZodString, "many">;
            audience: z.ZodObject<{
                primary: z.ZodEnum<["recruiter", "hiring-manager", "executive", "mixed"]>;
                notes: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                notes: string[];
                primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
            }, {
                notes: string[];
                primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
            }>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            targetRoleTitle: string;
            positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
            primaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            secondaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            differentiationThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            cautionThemes: {
                id: string;
                expectationIds: string[];
                rationale: string;
                evidenceIds: string[];
                label: string;
            }[];
            narrativeOrder: string[];
            audience: {
                notes: string[];
                primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
            };
        }, {
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            targetRoleTitle: string;
            positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
            primaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            secondaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            differentiationThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            cautionThemes: {
                id: string;
                expectationIds: string[];
                rationale: string;
                evidenceIds: string[];
                label: string;
            }[];
            narrativeOrder: string[];
            audience: {
                notes: string[];
                primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
            };
        }>;
        sections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>;
            status: z.ZodEnum<["include", "optional", "exclude"]>;
            objective: z.ZodString;
            order: z.ZodNumber;
            sourceExpectationIds: z.ZodArray<z.ZodString, "many">;
            sourceAssessmentIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            allowedContentTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            prohibitedContentTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            emphasisNotes: z.ZodArray<z.ZodString, "many">;
            cautionNotes: z.ZodArray<z.ZodString, "many">;
            maximumItemCount: z.ZodOptional<z.ZodNumber>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
            status: "exclude" | "include" | "optional";
            id: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            order: number;
            allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            sourceAssessmentIds: string[];
            objective: string;
            prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            emphasisNotes: string[];
            cautionNotes: string[];
            maximumItemCount?: number | undefined;
        }, {
            type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
            status: "exclude" | "include" | "optional";
            id: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            order: number;
            allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            sourceAssessmentIds: string[];
            objective: string;
            prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            emphasisNotes: string[];
            cautionNotes: string[];
            maximumItemCount?: number | undefined;
        }>, "many">;
        expectationSelections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            expectationId: z.ZodString;
            assessmentId: z.ZodString;
            decision: z.ZodEnum<["primary", "secondary", "supporting", "exclude", "defer"]>;
            supportStatus: z.ZodEnum<["strongly-supported", "supported", "partially-supported", "unsupported", "conflicting", "not-assessed"]>;
            defensibility: z.ZodEnum<["high", "medium", "low", "none", "uncertain"]>;
            materiality: z.ZodEnum<["critical", "high", "medium", "low", "unknown"]>;
            rationale: z.ZodString;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            allowedSections: z.ZodArray<z.ZodEnum<["headline", "professional-summary", "core-capabilities", "selected-impact", "professional-experience", "selected-projects", "technical-capabilities", "leadership-capabilities", "education", "certifications", "additional-information"]>, "many">;
            restrictions: z.ZodArray<z.ZodString, "many">;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            assessmentId: string;
            allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            restrictions: string[];
        }, {
            decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            assessmentId: string;
            allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            restrictions: string[];
        }>, "many">;
        evidenceSelections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            evidenceId: z.ZodString;
            decision: z.ZodEnum<["preferred", "allowed", "limited-use", "exclude"]>;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            permittedUses: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            prohibitedUses: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            proofQuality: z.ZodEnum<["strong", "adequate", "limited", "weak", "none", "conflicting", "unknown"]>;
            freshnessRisk: z.ZodEnum<["none", "low", "medium", "high", "unknown"]>;
            limitations: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            decision: "exclude" | "preferred" | "allowed" | "limited-use";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
            evidenceId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            limitations: string[];
            approvedMatchIds: string[];
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        }, {
            decision: "exclude" | "preferred" | "allowed" | "limited-use";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
            evidenceId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            limitations: string[];
            approvedMatchIds: string[];
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        }>, "many">;
        claimBoundaries: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            expectationId: z.ZodOptional<z.ZodString>;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            boundaryType: z.ZodEnum<["allowed", "allowed-with-caution", "prohibited", "requires-review"]>;
            allowedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            prohibitedClaimTypes: z.ZodArray<z.ZodEnum<["role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome", "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome", "business-outcome", "education", "certification", "project"]>, "many">;
            allowedScope: z.ZodOptional<z.ZodObject<{
                roleScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                teamScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                productScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                technicalScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                temporalScope: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strict", z.ZodTypeAny, {
                roleScope?: string[] | undefined;
                teamScope?: string[] | undefined;
                productScope?: string[] | undefined;
                technicalScope?: string[] | undefined;
                temporalScope?: string[] | undefined;
            }, {
                roleScope?: string[] | undefined;
                teamScope?: string[] | undefined;
                productScope?: string[] | undefined;
                technicalScope?: string[] | undefined;
                temporalScope?: string[] | undefined;
            }>>;
            prohibitedInferences: z.ZodArray<z.ZodString, "many">;
            requiredQualifiers: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            requiredQualifiers: string[];
            allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
            prohibitedInferences: string[];
            expectationId?: string | undefined;
            allowedScope?: {
                roleScope?: string[] | undefined;
                teamScope?: string[] | undefined;
                productScope?: string[] | undefined;
                technicalScope?: string[] | undefined;
                temporalScope?: string[] | undefined;
            } | undefined;
        }, {
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            requiredQualifiers: string[];
            allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
            prohibitedInferences: string[];
            expectationId?: string | undefined;
            allowedScope?: {
                roleScope?: string[] | undefined;
                teamScope?: string[] | undefined;
                productScope?: string[] | undefined;
                technicalScope?: string[] | undefined;
                temporalScope?: string[] | undefined;
            } | undefined;
        }>, "many">;
        exclusions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodEnum<["unsupported-expectation", "conflicting-expectation", "weak-evidence", "stale-evidence", "insufficient-specificity", "missing-metric", "privacy-restricted", "publication-restricted", "unapproved-source", "job-specific-only", "duplicate-theme", "not-relevant-to-role"]>;
            expectationIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            rationale: z.ZodString;
            severity: z.ZodEnum<["blocking", "high", "medium", "low"]>;
            provenance: z.ZodObject<{
                targetId: z.ZodString;
                approvedInterpretationSha256: z.ZodString;
                approvedMatchingSha256: z.ZodString;
                approvedAssessmentSha256: z.ZodString;
                evidenceSnapshotSha256: z.ZodString;
                expectationIds: z.ZodArray<z.ZodString, "many">;
                assessmentIds: z.ZodArray<z.ZodString, "many">;
                approvedMatchIds: z.ZodArray<z.ZodString, "many">;
                evidenceIds: z.ZodArray<z.ZodString, "many">;
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
                deterministicInputs: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                modelProposal: z.ZodOptional<z.ZodObject<{
                    proposalId: z.ZodString;
                    provider: z.ZodString;
                    model: z.ZodString;
                    promptTemplateVersion: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                }, {
                    provider: string;
                    model: string;
                    proposalId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            }>;
            trustState: z.ZodEnum<["deterministic-approved", "human-approved", "human-edited", "proposed"]>;
        }, "strict", z.ZodTypeAny, {
            type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "blocking";
        }, {
            type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "blocking";
        }>, "many">;
        warnings: z.ZodArray<z.ZodObject<{
            expectationIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            id: z.ZodString;
            code: z.ZodEnum<["NO_APPROVED_ROLE_ASSESSMENT", "ASSESSMENT_NOT_COMPLETE", "NO_STRONGLY_SUPPORTED_EXPECTATIONS", "NO_PRIMARY_EXPECTATIONS_SELECTED", "ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "NO_QUANTIFIED_OUTCOMES_AVAILABLE", "ROLE_POSITIONING_REQUIRES_CAUTION", "MODEL_PLAN_REQUIRES_HUMAN_REVIEW", "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE"]>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }, {
            code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }>, "many">;
        ambiguities: z.ZodArray<z.ZodObject<{
            expectationIds: z.ZodArray<z.ZodString, "many">;
            approvedMatchIds: z.ZodArray<z.ZodString, "many">;
            evidenceIds: z.ZodArray<z.ZodString, "many">;
            id: z.ZodString;
            code: z.ZodEnum<["PRIMARY_VS_SECONDARY_THEME_UNCLEAR", "ROLE_SCOPE_UNCLEAR", "SENIORITY_BOUNDARY_UNCLEAR", "LEADERSHIP_SCOPE_UNCLEAR", "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR", "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR", "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR", "EVIDENCE_REUSE_BOUNDARY_UNCLEAR", "SECTION_INCLUSION_UNCLEAR"]>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }, {
            code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        sections: {
            type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
            status: "exclude" | "include" | "optional";
            id: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            order: number;
            allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            sourceAssessmentIds: string[];
            objective: string;
            prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            emphasisNotes: string[];
            cautionNotes: string[];
            maximumItemCount?: number | undefined;
        }[];
        warnings: {
            code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }[];
        ambiguities: {
            code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }[];
        positioning: {
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            targetRoleTitle: string;
            positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
            primaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            secondaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            differentiationThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            cautionThemes: {
                id: string;
                expectationIds: string[];
                rationale: string;
                evidenceIds: string[];
                label: string;
            }[];
            narrativeOrder: string[];
            audience: {
                notes: string[];
                primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
            };
        };
        evidenceSelections: {
            decision: "exclude" | "preferred" | "allowed" | "limited-use";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
            evidenceId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            limitations: string[];
            approvedMatchIds: string[];
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        }[];
        claimBoundaries: {
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            requiredQualifiers: string[];
            allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
            prohibitedInferences: string[];
            expectationId?: string | undefined;
            allowedScope?: {
                roleScope?: string[] | undefined;
                teamScope?: string[] | undefined;
                productScope?: string[] | undefined;
                technicalScope?: string[] | undefined;
                temporalScope?: string[] | undefined;
            } | undefined;
        }[];
        exclusions: {
            type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "blocking";
        }[];
        expectationSelections: {
            decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            assessmentId: string;
            allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            restrictions: string[];
        }[];
    }, {
        sections: {
            type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
            status: "exclude" | "include" | "optional";
            id: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            order: number;
            allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            sourceAssessmentIds: string[];
            objective: string;
            prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            emphasisNotes: string[];
            cautionNotes: string[];
            maximumItemCount?: number | undefined;
        }[];
        warnings: {
            code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }[];
        ambiguities: {
            code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }[];
        positioning: {
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            targetRoleTitle: string;
            positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
            primaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            secondaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            differentiationThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            cautionThemes: {
                id: string;
                expectationIds: string[];
                rationale: string;
                evidenceIds: string[];
                label: string;
            }[];
            narrativeOrder: string[];
            audience: {
                notes: string[];
                primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
            };
        };
        evidenceSelections: {
            decision: "exclude" | "preferred" | "allowed" | "limited-use";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
            evidenceId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            limitations: string[];
            approvedMatchIds: string[];
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        }[];
        claimBoundaries: {
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            requiredQualifiers: string[];
            allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
            prohibitedInferences: string[];
            expectationId?: string | undefined;
            allowedScope?: {
                roleScope?: string[] | undefined;
                teamScope?: string[] | undefined;
                productScope?: string[] | undefined;
                technicalScope?: string[] | undefined;
                temporalScope?: string[] | undefined;
            } | undefined;
        }[];
        exclusions: {
            type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "blocking";
        }[];
        expectationSelections: {
            decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            assessmentId: string;
            allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            restrictions: string[];
        }[];
    }>>;
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
    mode: "market-positioning";
    input: {
        targetSha256: string;
        normalizedModelInputSha256: string;
        approvedInterpretationSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        approvedAssessmentSha256: string;
        deterministicPlanSha256: string;
    };
    targetType: "role";
    targetId: string;
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
    planningPolicy: {
        name: string;
        version: string;
    };
    proposedPlan?: {
        sections: {
            type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
            status: "exclude" | "include" | "optional";
            id: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            order: number;
            allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            sourceAssessmentIds: string[];
            objective: string;
            prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            emphasisNotes: string[];
            cautionNotes: string[];
            maximumItemCount?: number | undefined;
        }[];
        warnings: {
            code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }[];
        ambiguities: {
            code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }[];
        positioning: {
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            targetRoleTitle: string;
            positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
            primaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            secondaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            differentiationThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            cautionThemes: {
                id: string;
                expectationIds: string[];
                rationale: string;
                evidenceIds: string[];
                label: string;
            }[];
            narrativeOrder: string[];
            audience: {
                notes: string[];
                primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
            };
        };
        evidenceSelections: {
            decision: "exclude" | "preferred" | "allowed" | "limited-use";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
            evidenceId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            limitations: string[];
            approvedMatchIds: string[];
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        }[];
        claimBoundaries: {
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            requiredQualifiers: string[];
            allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
            prohibitedInferences: string[];
            expectationId?: string | undefined;
            allowedScope?: {
                roleScope?: string[] | undefined;
                teamScope?: string[] | undefined;
                productScope?: string[] | undefined;
                technicalScope?: string[] | undefined;
                temporalScope?: string[] | undefined;
            } | undefined;
        }[];
        exclusions: {
            type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "blocking";
        }[];
        expectationSelections: {
            decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            assessmentId: string;
            allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            restrictions: string[];
        }[];
    } | undefined;
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
        deterministicPlanSha256: string;
    };
    targetType: "role";
    targetId: string;
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
    planningPolicy: {
        name: string;
        version: string;
    };
    proposedPlan?: {
        sections: {
            type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
            status: "exclude" | "include" | "optional";
            id: string;
            sourceExpectationIds: string[];
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            order: number;
            allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            sourceAssessmentIds: string[];
            objective: string;
            prohibitedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            emphasisNotes: string[];
            cautionNotes: string[];
            maximumItemCount?: number | undefined;
        }[];
        warnings: {
            code: "ONLY_SUPPORTING_EVIDENCE_AVAILABLE" | "ONLY_HISTORICAL_EVIDENCE_AVAILABLE" | "NO_APPROVED_ROLE_ASSESSMENT" | "ASSESSMENT_NOT_COMPLETE" | "NO_STRONGLY_SUPPORTED_EXPECTATIONS" | "NO_PRIMARY_EXPECTATIONS_SELECTED" | "NO_QUANTIFIED_OUTCOMES_AVAILABLE" | "ROLE_POSITIONING_REQUIRES_CAUTION" | "MODEL_PLAN_REQUIRES_HUMAN_REVIEW" | "PLAN_DOES_NOT_CONTAIN_RESUME_PROSE";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }[];
        ambiguities: {
            code: "PRIMARY_VS_SECONDARY_THEME_UNCLEAR" | "ROLE_SCOPE_UNCLEAR" | "SENIORITY_BOUNDARY_UNCLEAR" | "LEADERSHIP_SCOPE_UNCLEAR" | "CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR" | "PROJECT_VS_EMPLOYMENT_EVIDENCE_BOUNDARY_UNCLEAR" | "ACHIEVEMENT_VS_RESPONSIBILITY_UNCLEAR" | "EVIDENCE_REUSE_BOUNDARY_UNCLEAR" | "SECTION_INCLUSION_UNCLEAR";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            approvedMatchIds: string[];
        }[];
        positioning: {
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            targetRoleTitle: string;
            positioningScope: "insufficient-evidence" | "direct-role-positioning" | "adjacent-role-positioning" | "stretch-positioning";
            primaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            secondaryThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            differentiationThemes: {
                id: string;
                sourceExpectationIds: string[];
                rationale: string;
                trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                    expectationIds: string[];
                    approvedInterpretationSha256: string;
                    evidenceIds: string[];
                    approvedMatchIds: string[];
                    approvedMatchingSha256: string;
                    evidenceSnapshotSha256: string;
                    deterministicInputs: Record<string, string | number | boolean | string[]>;
                    planningPolicy: {
                        name: string;
                        version: string;
                    };
                    assessmentIds: string[];
                    approvedAssessmentSha256: string;
                    reviewDecision?: {
                        decision: "accept" | "edit";
                        reviewer: {
                            type: "human";
                            name?: string | undefined;
                        };
                    } | undefined;
                    modelProposal?: {
                        provider: string;
                        model: string;
                        proposalId: string;
                        promptTemplateVersion: string;
                    } | undefined;
                };
                evidenceIds: string[];
                approvedMatchIds: string[];
                label: string;
                sourceAssessmentIds: string[];
                emphasis: "supporting" | "secondary" | "primary";
            }[];
            cautionThemes: {
                id: string;
                expectationIds: string[];
                rationale: string;
                evidenceIds: string[];
                label: string;
            }[];
            narrativeOrder: string[];
            audience: {
                notes: string[];
                primary: "mixed" | "recruiter" | "hiring-manager" | "executive";
            };
        };
        evidenceSelections: {
            decision: "exclude" | "preferred" | "allowed" | "limited-use";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
            evidenceId: string;
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            limitations: string[];
            approvedMatchIds: string[];
            proofQuality: "unknown" | "none" | "conflicting" | "strong" | "weak" | "adequate" | "limited";
            freshnessRisk: "unknown" | "high" | "medium" | "low" | "none";
            prohibitedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            permittedUses: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        }[];
        claimBoundaries: {
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            requiredQualifiers: string[];
            allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
            prohibitedInferences: string[];
            expectationId?: string | undefined;
            allowedScope?: {
                roleScope?: string[] | undefined;
                teamScope?: string[] | undefined;
                productScope?: string[] | undefined;
                technicalScope?: string[] | undefined;
                temporalScope?: string[] | undefined;
            } | undefined;
        }[];
        exclusions: {
            type: "unsupported-expectation" | "conflicting-expectation" | "weak-evidence" | "stale-evidence" | "insufficient-specificity" | "missing-metric" | "privacy-restricted" | "publication-restricted" | "unapproved-source" | "job-specific-only" | "duplicate-theme" | "not-relevant-to-role";
            id: string;
            expectationIds: string[];
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "blocking";
        }[];
        expectationSelections: {
            decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
            id: string;
            rationale: string;
            trustState: "deterministic-approved" | "proposed" | "human-approved" | "human-edited";
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
                expectationIds: string[];
                approvedInterpretationSha256: string;
                evidenceIds: string[];
                approvedMatchIds: string[];
                approvedMatchingSha256: string;
                evidenceSnapshotSha256: string;
                deterministicInputs: Record<string, string | number | boolean | string[]>;
                planningPolicy: {
                    name: string;
                    version: string;
                };
                assessmentIds: string[];
                approvedAssessmentSha256: string;
                reviewDecision?: {
                    decision: "accept" | "edit";
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                } | undefined;
                modelProposal?: {
                    provider: string;
                    model: string;
                    proposalId: string;
                    promptTemplateVersion: string;
                } | undefined;
            };
            evidenceIds: string[];
            approvedMatchIds: string[];
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "supported" | "partially-supported" | "strongly-supported";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            assessmentId: string;
            allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            restrictions: string[];
        }[];
    } | undefined;
}>;
export declare const RoleResumePlanProposalManifestSchema: z.ZodObject<{
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
    deterministicPlanSha256: z.ZodString;
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
    deterministicPlanSha256: string;
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
    deterministicPlanSha256: string;
}>;
export declare const RoleResumePlanReviewDecisionSchema: z.ZodObject<{
    itemType: z.ZodEnum<["positioning", "section", "expectation", "evidence", "claim-boundary", "exclusion"]>;
    itemId: z.ZodString;
    decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
    editedValue: z.ZodOptional<z.ZodUnknown>;
    reviewNote: z.ZodOptional<z.ZodString>;
    decidedAt: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    decision: "pending" | "accept" | "edit" | "reject";
    itemType: "section" | "expectation" | "evidence" | "positioning" | "claim-boundary" | "exclusion";
    itemId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedValue?: unknown;
}, {
    decision: "pending" | "accept" | "edit" | "reject";
    itemType: "section" | "expectation" | "evidence" | "positioning" | "claim-boundary" | "exclusion";
    itemId: string;
    decidedAt?: string | undefined;
    reviewNote?: string | undefined;
    editedValue?: unknown;
}>;
export declare const RoleResumePlanReviewSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    proposalId: z.ZodString;
    targetId: z.ZodString;
    status: z.ZodEnum<["in-progress", "completed"]>;
    decisions: z.ZodArray<z.ZodObject<{
        itemType: z.ZodEnum<["positioning", "section", "expectation", "evidence", "claim-boundary", "exclusion"]>;
        itemId: z.ZodString;
        decision: z.ZodEnum<["pending", "accept", "edit", "reject"]>;
        editedValue: z.ZodOptional<z.ZodUnknown>;
        reviewNote: z.ZodOptional<z.ZodString>;
        decidedAt: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        decision: "pending" | "accept" | "edit" | "reject";
        itemType: "section" | "expectation" | "evidence" | "positioning" | "claim-boundary" | "exclusion";
        itemId: string;
        decidedAt?: string | undefined;
        reviewNote?: string | undefined;
        editedValue?: unknown;
    }, {
        decision: "pending" | "accept" | "edit" | "reject";
        itemType: "section" | "expectation" | "evidence" | "positioning" | "claim-boundary" | "exclusion";
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
        itemType: "section" | "expectation" | "evidence" | "positioning" | "claim-boundary" | "exclusion";
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
        itemType: "section" | "expectation" | "evidence" | "positioning" | "claim-boundary" | "exclusion";
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
export declare const RoleResumePlanReviewManifestSchema: z.ZodObject<{
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
export type RoleResumeSectionType = z.infer<typeof RoleResumeSectionTypeSchema>;
export type ResumeContentType = z.infer<typeof ResumeContentTypeSchema>;
export type RolePositioningPlan = z.infer<typeof RolePositioningPlanSchema>;
export type RoleResumeSectionPlan = z.infer<typeof RoleResumeSectionPlanSchema>;
export type ResumeExpectationSelection = z.infer<typeof ResumeExpectationSelectionSchema>;
export type ResumeEvidenceSelection = z.infer<typeof ResumeEvidenceSelectionSchema>;
export type ResumeClaimBoundary = z.infer<typeof ResumeClaimBoundarySchema>;
export type ResumeContentExclusion = z.infer<typeof ResumeContentExclusionSchema>;
export type ResumePlanningRisk = z.infer<typeof ResumePlanningRiskSchema>;
export type ResumePlanningWarning = z.infer<typeof ResumePlanningWarningSchema>;
export type ResumePlanningAmbiguity = z.infer<typeof ResumePlanningAmbiguitySchema>;
export type RoleResumePlanCompleteness = z.infer<typeof RoleResumePlanCompletenessSchema>;
export type RoleResumeContentPlan = z.infer<typeof RoleResumeContentPlanSchema>;
export type RoleResumePlanManifest = z.infer<typeof RoleResumePlanManifestSchema>;
export type ModelRoleResumePlanPayload = z.infer<typeof ModelRoleResumePlanPayloadSchema>;
export type RoleResumePlanProposal = z.infer<typeof RoleResumePlanProposalSchema>;
export type RoleResumePlanProposalManifest = z.infer<typeof RoleResumePlanProposalManifestSchema>;
export type RoleResumePlanReview = z.infer<typeof RoleResumePlanReviewSchema>;
export type RoleResumePlanReviewDecision = z.infer<typeof RoleResumePlanReviewDecisionSchema>;
export type RoleResumePlanReviewManifest = z.infer<typeof RoleResumePlanReviewManifestSchema>;
