import { type JobResumeDraftClaimLedgerEntry, type JobResumeDraftEvidenceUsage, type JobResumeDraftProposal, type JobResumeDraftScaffold, type JobResumeDraftSection, type ModelJobResumeDraftPayload } from "./job-resume-draft-schemas.js";
import { loadJobResumeDraftingContext } from "./job-resume-drafting.js";
import { type InterpretationModelProvider } from "./model-provider.js";
export declare const JOB_RESUME_DRAFT_PROMPT_TEMPLATE_ID = "target-job-resume-draft-proposal";
export declare const JOB_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION = "1";
export declare const JOB_RESUME_DRAFT_PROMPT_POLICY_VERSION = "1";
export interface GenerateJobResumeDraftProposalOptions {
    refresh?: boolean;
    provider?: InterpretationModelProvider;
    now?: () => Date;
}
export interface GenerateJobResumeDraftProposalResult {
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
export interface JobResumeDraftProposalStatus {
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
export declare function generateJobResumeDraftProposal(workspace: string, targetId: string, options?: GenerateJobResumeDraftProposalOptions): Promise<GenerateJobResumeDraftProposalResult>;
export declare function showJobResumeDraftProposal(workspace: string, proposalId: string): Promise<JobResumeDraftProposal>;
export declare function listJobResumeDraftProposals(workspace: string, targetId: string): Promise<JobResumeDraftProposal[]>;
export declare function getJobResumeDraftProposalStatus(workspace: string, proposalId: string): Promise<JobResumeDraftProposalStatus>;
export declare function replayJobResumeDraftProposal(workspace: string, proposalId: string): Promise<{
    proposalId: string;
    originalSha256: string;
    replaySha256: string;
    matches: boolean;
}>;
export declare function renderJobResumeDraftPrompt(input: unknown): string;
export declare function createJobResumeDraftModelInput(context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>, scaffold: JobResumeDraftScaffold): {
    target: {
        id: string;
        type: string;
        title: string;
        company: string | undefined;
        location: string | undefined;
        workingModel: string | undefined;
        titleUse: string;
    };
    contentPlan: {
        id: string;
        positioning: {
            provenance: {
                targetId: string;
                evidenceIds: string[];
                requirementIds: string[];
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
                        evidenceItemSha256: string;
                        evidenceItemPath: string;
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
                planningPolicy: {
                    name: string;
                    version: string;
                };
            };
            state: "direct" | "insufficient-proof" | "indeterminate" | "adjacent" | "stretch";
            sourceOverallAssessment: "strong" | "limited" | "insufficient" | "indeterminate" | "mixed" | "credible";
            targetTitle: string;
            targetTitleUse: "positioning-only";
            primaryRequirementIds: string[];
            supportingRequirementIds: string[];
            cautionRequirementIds: string[];
            rationaleCode: "strong-reviewed-proof" | "credible-reviewed-proof" | "mixed-reviewed-proof" | "limited-reviewed-proof" | "insufficient-reviewed-proof" | "indeterminate-reviewed-proof";
            prohibitedUses: ("employment-history" | "seniority-proof" | "authority-proof" | "scope-proof")[];
        };
        requirementEmphasis: {
            decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
            id: string;
            necessity: "preferred" | "contextual" | "mandatory" | "ambiguous";
            category: "unknown" | "responsibility" | "required-capability" | "preferred-capability" | "technical-expectation" | "domain-expectation" | "leadership-expectation" | "operating-context" | "experience-seniority" | "education-certification" | "language" | "location-travel-visa-work-mode" | "screening" | "metric-scale";
            provenance: {
                targetId: string;
                evidenceIds: string[];
                requirementIds: string[];
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
                        evidenceItemSha256: string;
                        evidenceItemPath: string;
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
                planningPolicy: {
                    name: string;
                    version: string;
                };
            };
            materiality: "unknown" | "contextual" | "critical" | "material" | "secondary";
            requirementId: string;
            coverageState: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
            assessmentState: "partial" | "supported" | "contradiction" | "indeterminate" | "strength" | "gap";
            proofStrength: "conflicting" | "strong" | "adequate" | "limited" | "unavailable";
            rationaleCode: "mandatory-strong-support" | "mandatory-defensible-support" | "preferred-defensible-support" | "contextual-defensible-support" | "mandatory-partial-support" | "nonmandatory-partial-support" | "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement";
            selectedLinkIds: string[];
            selectedEvidenceIds: string[];
            selectedClaimIds: string[];
            allowedTerminology: string[];
            allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            cautionCodes: ("do-not-overstate-partial-proof" | "do-not-present-gap-as-strength" | "do-not-use-adjacent-proof-as-direct" | "do-not-hide-contradiction" | "preserve-ambiguity")[];
        }[];
        evidenceSelections: {
            decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
            id: string;
            evidenceId: string;
            provenance: {
                targetId: string;
                evidenceIds: string[];
                requirementIds: string[];
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
                        evidenceItemSha256: string;
                        evidenceItemPath: string;
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
                planningPolicy: {
                    name: string;
                    version: string;
                };
            };
            relationships: ("partial" | "direct" | "supporting")[];
            claimIds: string[];
            intendedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            requirementUses: {
                decision: "exclude" | "supporting" | "secondary" | "primary" | "defer";
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
        sections: {
            type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
            id: string;
            provenance: {
                targetId: string;
                evidenceIds: string[];
                requirementIds: string[];
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
                        evidenceItemSha256: string;
                        evidenceItemPath: string;
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
                planningPolicy: {
                    name: string;
                    version: string;
                };
            };
            evidenceIds: string[];
            requirementIds: string[];
            claimIds: string[];
            boundaryIds: string[];
            inclusion: "exclude" | "include" | "optional";
            order: number;
            objectiveCode: "position-target-without-history-claim" | "summarize-selected-proof-themes" | "group-job-relevant-capabilities" | "surface-reviewed-outcomes" | "organize-reviewed-employment-evidence" | "organize-project-scoped-evidence" | "group-reviewed-technical-capabilities" | "group-reviewed-leadership-capabilities" | "retain-relevant-education" | "retain-relevant-certifications" | "retain-approved-additional-information";
            exclusionIds: string[];
            allowedContentTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            riskCodes: string[];
            warningCodes: string[];
            maximumItemCount?: number | undefined;
        }[];
        claimBoundaries: {
            id: string;
            kind: "scope" | "target-title" | "requirement-claim" | "project-employment" | "metric";
            provenance: {
                targetId: string;
                evidenceIds: string[];
                requirementIds: string[];
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
                        evidenceItemSha256: string;
                        evidenceItemPath: string;
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
                planningPolicy: {
                    name: string;
                    version: string;
                };
            };
            evidenceIds: string[];
            state: "allowed" | "allowed-with-qualifier" | "requires-caution" | "prohibited";
            claimIds: string[];
            rationaleCode: "direct-reviewed-proof" | "qualified-partial-proof" | "deferred-or-ambiguous-proof" | "unsupported-or-conflicting-proof" | "target-title-not-history" | "project-scope-not-employment" | "metric-requires-verification" | "scope-limited-to-reviewed-evidence";
            allowedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            prohibitedClaimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "target-title" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
            requiredQualifierCodes: ("evidence-scoped-wording" | "project-scoped-wording" | "adjacent-not-direct" | "partial-support-only" | "exact-reviewed-metric-only" | "target-title-positioning-only")[];
            prohibitedInferenceCodes: ("target-title-as-employment" | "project-as-employment" | "responsibility-as-achievement" | "contribution-as-ownership" | "collaboration-as-management" | "technical-exposure-as-expertise" | "adjacent-technology-as-exact-experience" | "domain-adjacency-as-direct-experience" | "unsupported-seniority" | "unsupported-authority" | "unsupported-team-size" | "unsupported-geography" | "unsupported-scale" | "unsupported-adoption" | "unsupported-dates" | "unsupported-outcomes" | "unverified-metric")[];
            requirementId?: string | undefined;
        }[];
        metricPermissions: {
            claimId: string;
            id: string;
            evidenceId: string;
            provenance: {
                targetId: string;
                evidenceIds: string[];
                requirementIds: string[];
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
                        evidenceItemSha256: string;
                        evidenceItemPath: string;
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
                planningPolicy: {
                    name: string;
                    version: string;
                };
            };
            scope: {
                parentRoleId?: string | undefined;
                parentProjectId?: string | undefined;
                sourceSection?: string | undefined;
            };
            state: "allowed" | "prohibited";
            allowedSections: ("education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information")[];
            qualifierCodes: ("use-exact-approved-text" | "preserve-reviewed-scope" | "do-not-round" | "do-not-combine" | "do-not-infer-scale")[];
            exactApprovedMetricText?: string | undefined;
        }[];
        exclusions: {
            type: "unsupported-requirement" | "contradicted-requirement" | "indeterminate-requirement" | "project-as-employment" | "unverified-metric" | "target-title-history" | "non-resume-ready-evidence" | "private-evidence" | "unapproved-claim" | "unsupported-terminology" | "unsupported-seniority-or-scope" | "irrelevant-evidence" | "duplicate-evidence-use";
            id: string;
            sourceType: "claim" | "target" | "evidence" | "policy" | "requirement";
            provenance: {
                targetId: string;
                evidenceIds: string[];
                requirementIds: string[];
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
                        evidenceItemSha256: string;
                        evidenceItemPath: string;
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
                planningPolicy: {
                    name: string;
                    version: string;
                };
            };
            sourceIds: string[];
            severity: "high" | "medium" | "low" | "blocking";
            reasonCode: "no-reviewed-proof" | "explicit-contradiction" | "unresolved-ambiguity" | "metric-not-verified" | "target-title-is-not-history" | "project-scope-is-not-employment" | "evidence-not-eligible" | "claim-not-eligible" | "terminology-not-supported" | "scope-not-supported" | "not-selected-for-job-plan" | "deduplicated-use";
        }[];
        risks: {
            code: "PROVENANCE_INCOMPLETE" | "MANDATORY_REQUIREMENT_NOT_POSITIONABLE" | "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK" | "TARGET_TITLE_HISTORY_RISK" | "PROJECT_AS_EMPLOYMENT_RISK" | "RESPONSIBILITY_AS_ACHIEVEMENT_RISK" | "UNSUPPORTED_METRIC_RISK" | "UNSUPPORTED_SCOPE_RISK" | "UNSUPPORTED_SENIORITY_RISK" | "EVIDENCE_OVERUSE_RISK" | "REQUIREMENT_TERMINOLOGY_MISMATCH" | "DEPENDENCY_STALE";
            message: string;
            id: string;
            evidenceIds: string[];
            severity: "high" | "medium" | "low" | "critical";
            requirementIds: string[];
            claimIds: string[];
        }[];
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
    };
    draftScaffold: {
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
        positioningState: "direct" | "insufficient-proof" | "indeterminate" | "adjacent" | "stretch";
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
    }[];
    selectedApprovedClaims: {
        id: string;
        approvedWording: string | undefined;
        type: "role_claim" | "skill_claim" | "leadership_claim" | "impact_claim" | "domain_claim" | "project_claim" | "competency_claim" | "certification_claim" | "education_claim" | "responsibility_claim";
        supportingEvidenceIds: string[];
        parentRoleId: string | undefined;
        parentProjectId: string | undefined;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
    }[];
    policy: {
        name: string;
        version: string;
        contentPlanIsSoleAuthority: boolean;
        statementProvenanceRequired: boolean;
        exactVerifiedMetricsOnly: boolean;
        targetTitleIsNotEmploymentEvidence: boolean;
        projectScopeIsNotEmploymentScope: boolean;
        applicationJudgmentForbidden: boolean;
    };
};
export declare function validateJobResumeDraftPayload(payload: ModelJobResumeDraftPayload, proposalId: string, scaffold: JobResumeDraftScaffold, context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>, scaffoldSha256: string): {
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
            qualifiers: string[];
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
};
export declare function buildJobResumeDraftClaimLedger(sections: JobResumeDraftSection[], context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>): JobResumeDraftClaimLedgerEntry[];
export declare function buildJobResumeDraftEvidenceUsage(sections: JobResumeDraftSection[], scaffold: JobResumeDraftScaffold, context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>): JobResumeDraftEvidenceUsage[];
export declare function formatJobResumeDraftProposalResult(result: GenerateJobResumeDraftProposalResult): string;
export declare function formatJobResumeDraftProposalList(proposals: JobResumeDraftProposal[]): string;
export declare function formatJobResumeDraftProposalStatus(status: JobResumeDraftProposalStatus): string;
export declare function jobResumeDraftProposalPaths(workspace: string, targetId: string, proposalId: string, relativeOnly?: boolean): {
    proposalPath: string;
    manifestPath: string;
    rawPath: string;
    proposalRelativePath: string;
    manifestRelativePath: string;
    rawRelativePath: string;
};
