import { type InterpretationModelProvider } from "./model-provider.js";
import { type ModelRoleResumeDraftPayload, type ResumeDraftClaimLedgerEntry, type ResumeDraftEvidenceUsage, type RoleResumeDraftProposal, type RoleResumeDraftScaffold, type RoleResumeDraftSection } from "./role-resume-draft-schemas.js";
import { loadRoleResumeDraftingContext } from "./role-resume-drafting.js";
export declare const ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_ID = "target-role-resume-draft-proposal";
export declare const ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION = "1";
export declare const ROLE_RESUME_DRAFT_PROMPT_POLICY_VERSION = "1";
export interface GenerateRoleResumeDraftProposalOptions {
    refresh?: boolean;
    provider?: InterpretationModelProvider;
    now?: () => Date;
}
export interface GenerateRoleResumeDraftProposalResult {
    targetId: string;
    proposalId: string;
    result: "created" | "cache-hit" | "validation-failed";
    proposalPath: string;
    manifestPath: string;
    rawResponsePath: string;
    sectionCount: number;
    draftItemCount: number;
    validationIssueCount: number;
    requestFingerprint: string;
}
export interface RoleResumeDraftProposalStatus {
    proposalId: string;
    targetId: string;
    proposalExists: boolean;
    manifestExists: boolean;
    rawResponseExists: boolean;
    proposalHashMatches: boolean | null;
    rawResponseHashMatches: boolean | null;
    scaffoldHashMatches: boolean | null;
    dependenciesMatch: boolean | null;
    policyVersionMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    readyForReview: boolean;
    reasons: string[];
}
export declare function generateRoleResumeDraftProposal(workspace: string, targetId: string, options?: GenerateRoleResumeDraftProposalOptions): Promise<GenerateRoleResumeDraftProposalResult>;
export declare function showRoleResumeDraftProposal(workspace: string, proposalId: string): Promise<RoleResumeDraftProposal>;
export declare function listRoleResumeDraftProposals(workspace: string, targetId: string): Promise<RoleResumeDraftProposal[]>;
export declare function getRoleResumeDraftProposalStatus(workspace: string, proposalId: string): Promise<RoleResumeDraftProposalStatus>;
export declare function replayRoleResumeDraftProposal(workspace: string, proposalId: string): Promise<{
    proposalId: string;
    originalSha256: string;
    replaySha256: string;
    matches: boolean;
}>;
export declare function renderRoleResumeDraftPrompt(input: unknown): string;
export declare function createRoleResumeDraftModelInput(context: Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>, scaffold: RoleResumeDraftScaffold): {
    target: {
        id: string;
        type: "role";
        title: string;
        seniority: string | undefined;
        domain: string | undefined;
    };
    approvedInterpretation: {
        expectations: {
            notes: string[];
            id: string;
            kind: "unknown" | "responsibility" | "qualification" | "constraint" | "capability" | "experience" | "technical-skill" | "leadership" | "domain-knowledge" | "business-expectation" | "success-outcome" | "candidate-attribute";
            statement: string;
            necessity: "unknown" | "required" | "preferred" | "contextual";
            sourceReferences: ({
                sha256: string;
                path: string;
                sourceType: "job-description-markdown" | "target-json";
                startLine: number;
                endLine: number;
                excerptSha256: string;
                startOffset?: number | undefined;
                endOffset?: number | undefined;
            } | {
                sha256: string;
                path: string;
                sourceType: "role-profile-json";
                excerptSha256: string;
                jsonPointer: string;
            })[];
            importance: "unknown" | "high" | "medium" | "low" | "critical";
            capabilityTags: string[];
            explicitness: "explicit" | "strongly-implied" | "inferred";
            sourceAnalysisItemIds: string[];
            interpretation: {
                method: "explicit-heading" | "explicit-role-profile" | "manual" | "deterministic-rule";
                interpreterName: string;
                interpreterVersion: string;
                policyVersion: string;
            };
            interpretationConfidence: "high" | "medium" | "low";
            trustState: "deterministic-approved" | "human-approved" | "human-edited";
            approvalProvenance?: {
                policyVersion: string;
                sourceExpectationIds: string[];
                proposalId: string;
                promptTemplateVersion: string;
                proposedExpectationId: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
            } | undefined;
        }[];
    };
    approvedMatching: {
        matches: {
            notes: string[];
            id: string;
            interpretation: {
                method: "manual" | "deterministic-rule" | "model-assisted";
                policyVersion: string;
                matcherName: string;
                matcherVersion: string;
            };
            rationale: string;
            trustState: "human-approved" | "human-edited" | "manual-approved";
            expectationId: string;
            evidenceIds: string[];
            matchType: "partial" | "direct" | "supporting" | "contradictory";
            coverage: "partial" | "full" | "conflicting";
            evidenceStrength: "unknown" | "medium" | "strong" | "weak";
            temporalRelevance: "unknown" | "current" | "recent" | "historical";
            expectationProvenance: {
                sourceReferences: ({
                    sha256: string;
                    path: string;
                    sourceType: "job-description-markdown" | "target-json";
                    startLine: number;
                    endLine: number;
                    excerptSha256: string;
                    startOffset?: number | undefined;
                    endOffset?: number | undefined;
                } | {
                    sha256: string;
                    path: string;
                    sourceType: "role-profile-json";
                    excerptSha256: string;
                    jsonPointer: string;
                })[];
                targetId: string;
                sourceAnalysisItemIds: string[];
                approvedInterpretationPath: string;
                approvedInterpretationSha256: string;
                expectationId: string;
                expectationTrustState: "deterministic-approved" | "human-approved" | "human-edited";
                approvalProvenance?: {
                    policyVersion: string;
                    sourceExpectationIds: string[];
                    proposalId: string;
                    promptTemplateVersion: string;
                    proposedExpectationId: string;
                    reviewer: {
                        type: "human";
                        name?: string | undefined;
                    };
                    reviewDecision: "accept" | "edit";
                    modelProvider: string;
                    modelName: string;
                } | undefined;
            };
            evidenceProvenance: {
                active: true;
                evidenceId: string;
                evidenceType: string;
                reviewedStatus: "approved";
                evidenceArtifactSha256: string;
                reviewArtifactSha256: string;
                supportingClaimIds: string[];
                sources: {
                    sha256: string;
                    path: string;
                    status: "active";
                    sourceType: string;
                    sourceId: string;
                    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
                }[];
            }[];
            matchConfidence: "high" | "medium" | "low";
            limitations: string[];
            approvalProvenance?: {
                policyVersion: string;
                proposalId: string;
                promptTemplateVersion: string;
                reviewer: {
                    type: "human";
                    name?: string | undefined;
                };
                reviewDecision: "accept" | "edit";
                modelProvider: string;
                modelName: string;
                proposedMatchId: string;
            } | undefined;
        }[];
        expectationCoverage: {
            notes: string[];
            status: "conflicting" | "matched" | "partially-matched" | "unsupported" | "not-assessed";
            id: string;
            blockingReasons: string[];
            expectationId: string;
            approvedMatchIds: string[];
            proposedMatchIds: string[];
        }[];
    };
    approvedAssessment: {
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
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "strongly-supported" | "supported" | "partially-supported";
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
        risks: {
            code: "CRITICAL_REQUIREMENT_UNSUPPORTED" | "REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED" | "MATERIAL_CONTRADICTION" | "EVIDENCE_TOO_GENERAL" | "EVIDENCE_TOO_OLD" | "EVIDENCE_TOO_WEAK" | "COMPOUND_EXPECTATION_PARTIALLY_COVERED" | "ASSESSMENT_INCOMPLETE" | "MATCHING_STALE" | "INTERPRETATION_STALE" | "PROVENANCE_INCOMPLETE";
            message: string;
            id: string;
            expectationIds: string[];
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
        }[];
    } & {
        targetType: "role";
        mode: "role-positioning";
    };
    approvedPlan: {
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
        approvedMatching: {
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
            allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            boundaryType: "allowed" | "prohibited" | "requires-review" | "allowed-with-caution";
            prohibitedInferences: string[];
            requiredQualifiers: string[];
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
            supportStatus: "conflicting" | "unsupported" | "not-assessed" | "strongly-supported" | "supported" | "partially-supported";
            defensibility: "high" | "medium" | "low" | "none" | "uncertain";
            materiality: "unknown" | "high" | "medium" | "low" | "critical";
            assessmentId: string;
            allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            restrictions: string[];
        }[];
    };
    draftScaffold: {
        schemaVersion: 1;
        createdAt: string;
        updatedAt: string;
        id: string;
        mode: "market-positioning";
        sections: {
            status: "exclude" | "include" | "optional";
            id: string;
            allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
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
    };
    selectedApprovedEvidence: {
        id: string;
        category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
        normalizedSummary: string;
        dateRange: string | undefined;
        company: string | undefined;
        project: string | undefined;
        technologies: string[] | undefined;
        domains: string[] | undefined;
        parentRoleId: string | undefined;
        parentProjectId: string | undefined;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        sensitivityFlags: string[];
    }[];
    reviewedMetricEvidenceIds: string[];
    policy: {
        name: string;
        version: string;
        statementProvenanceRequired: boolean;
        reviewedMetricsOnly: boolean;
        targetTitleIsNotEmploymentEvidence: boolean;
        projectScopeIsNotEmploymentScope: boolean;
        jobSpecificContentForbidden: boolean;
    };
};
export declare function validateRoleResumeDraftPayload(payload: ModelRoleResumeDraftPayload, proposalId: string, scaffold: RoleResumeDraftScaffold, context: Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>, scaffoldSha256: string): {
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
            claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
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
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
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
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        usageCount: number;
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
};
export declare function buildClaimLedger(sections: RoleResumeDraftSection[], context: Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>): ResumeDraftClaimLedgerEntry[];
export declare function buildEvidenceUsage(sections: RoleResumeDraftSection[], scaffold: RoleResumeDraftScaffold): ResumeDraftEvidenceUsage[];
export declare function formatRoleResumeDraftProposalResult(result: GenerateRoleResumeDraftProposalResult): string;
export declare function formatRoleResumeDraftProposalList(proposals: RoleResumeDraftProposal[]): string;
export declare function formatRoleResumeDraftProposalStatus(status: RoleResumeDraftProposalStatus): string;
export declare function roleResumeDraftProposalPaths(workspace: string, targetId: string, proposalId: string, relativeOnly?: boolean): {
    proposalPath: string;
    manifestPath: string;
    rawPath: string;
    proposalRelativePath: string;
    manifestRelativePath: string;
    rawRelativePath: string;
};
