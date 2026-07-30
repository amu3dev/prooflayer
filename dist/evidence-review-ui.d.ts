import { type CreateEvidenceClaimReviewResult } from "./evidence-claim-review.js";
export declare const EVIDENCE_REVIEW_UI_NAME = "ProofLayer Local Evidence Review UI";
export declare const evidenceReviewUiFormOptions: {
    readonly decisions: ["approved", "approved-with-qualifier", "needs-edit", "rejected", "insufficient-proof", "deferred"];
    readonly factualSupport: ["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"];
    readonly scopes: ["exact", "qualified", "overstated", "underspecified", "ambiguous", "invalid"];
    readonly publicSafety: ["public-safe", "private", "restricted", "indeterminate"];
    readonly resumeReadiness: ["resume-ready", "not-resume-ready", "needs-edit", "indeterminate"];
    readonly metricStates: ["verified", "unverified", "contradicted", "not-a-metric", "indeterminate"];
    readonly workContexts: ["employment", "project", "education", "certification", "skill", "other", "ambiguous"];
    readonly claimNatures: ["responsibility", "achievement", "capability", "credential", "other", "ambiguous"];
};
export interface EvidenceReviewUiSource {
    id: string;
    label: string;
    type: string;
    visibility: string;
    status: string;
    sha256: string;
}
export interface EvidenceReviewUiEvidence {
    id: string;
    title: string;
    summary: string;
    sourceExcerpt?: string;
    excerptWithheld: boolean;
    category: string;
    confidence: string;
    visibility: string;
    sensitivityFlags: string[];
    parentRoleId?: string;
    parentProjectId?: string;
    dateRange?: string;
    company?: string;
    project?: string;
    technologies: string[];
    domains: string[];
    sources: EvidenceReviewUiSource[];
}
export interface EvidenceReviewUiRequirement {
    id: string;
    title: string;
    sourceText: string;
    category: string;
    necessity: string;
    confidence: string;
    explicitness: string;
    namedTechnologies: string[];
    keywords: string[];
    sourceReferences: Array<{
        label: string;
        startLine: number;
        endLine: number;
        sha256: string;
        excerptSha256: string;
    }>;
}
export interface EvidenceReviewUiClaim {
    id: string;
    title: string;
    text: string;
    priority: "high" | "medium" | "low";
    selectionReason: string;
    potentialMetric: boolean;
    sourceApprovalStatus: string;
    sourceOutputReadiness: string;
    sourcePublicSafe: boolean;
    sourceNeedsConfirmation: boolean;
    sourceMetricStatus: string;
    sourceUnsafeWording: string[];
    sourceClassification: {
        type: string;
        section?: string;
        dateRange?: string;
        parentRoleId?: string;
        parentProjectId?: string;
    };
    review: {
        lifecycle: "missing" | "current" | "stale" | "invalid" | "superseded";
        id?: string;
        decision?: string;
        factualSupport?: string;
        scope?: string;
        publicSafety?: string;
        resumeReadiness?: string;
        eligibleForRoleMatching?: boolean;
        eligibleForJobMapping?: boolean;
        requiredQualifiers: string[];
        workContext?: string;
        claimNature?: string;
    };
    evidence: EvidenceReviewUiEvidence[];
    requirements: EvidenceReviewUiRequirement[];
    template: {
        path: string;
        sha256: string;
        reviewedClaimSha256: string;
    };
    audit: {
        batchId: string;
        targetId: string;
        claimRecordSha256: string;
        evidenceSetSha256: string;
        provenanceSetSha256: string;
        requirementSetSha256: string;
    };
}
export interface EvidenceReviewUiBatch {
    batchId: string;
    target: {
        id: string;
        title: string;
        company?: string;
        location?: string;
        workingModel?: string;
    };
    stage: "Evidence Review";
    purpose: string;
    warning: string;
    claims: EvidenceReviewUiClaim[];
    progress: {
        selected: number;
        reviewed: number;
        pending: number;
        selectedPriority: {
            high: number;
            medium: number;
            low: number;
        };
        decisions: Record<string, number>;
    };
    complete: boolean;
    nextPendingClaimId?: string;
    nextCommand: string;
}
export interface EvidenceReviewUiSubmission {
    result: CreateEvidenceClaimReviewResult;
    nextPendingClaimId?: string;
    batchComplete: boolean;
}
export declare class EvidenceReviewUiSubmissionError extends Error {
    readonly fieldErrors: Record<string, string[]>;
    constructor(message: string, fieldErrors?: Record<string, string[]>);
}
export declare function loadEvidenceReviewUiBatch(workspace: string, batchId: string): Promise<EvidenceReviewUiBatch>;
export declare function loadEvidenceReviewUiClaim(workspace: string, batchId: string, claimId: string): Promise<{
    batch: EvidenceReviewUiBatch;
    claim: EvidenceReviewUiClaim;
}>;
export declare function submitEvidenceReviewUiClaim(workspace: string, batchId: string, claimId: string, fields: Record<string, string | undefined>, options?: {
    readOnly?: boolean;
}): Promise<EvidenceReviewUiSubmission>;
export declare function validateEvidenceReviewUiBatch(workspace: string, batchId: string): Promise<EvidenceReviewUiBatch>;
