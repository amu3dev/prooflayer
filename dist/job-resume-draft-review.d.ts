import { type JobResumeDraftAmbiguity, type JobResumeDraftClaimLedgerEntry, type JobResumeDraftReview, type JobResumeDraftReviewDecision, type JobResumeDraftSection } from "./job-resume-draft-schemas.js";
export interface JobResumeDraftReviewStatus {
    reviewId: string;
    proposalId: string;
    targetId: string;
    status: "missing" | "in-progress" | "completed" | "stale" | "invalid";
    counts: Record<"pending" | "accept" | "edit" | "reject", number>;
    unresolvedCount: number;
    reviewPath: string;
    manifestPath: string;
    reasons: string[];
}
export interface ReviewedJobResumeDraftPayload {
    sections: JobResumeDraftSection[];
    claimLedger: JobResumeDraftClaimLedgerEntry[];
    ambiguities: JobResumeDraftAmbiguity[];
}
export declare function initializeJobResumeDraftReview(workspace: string, proposalId: string, options?: {
    reviewerName?: string;
    now?: () => Date;
}): Promise<JobResumeDraftReview>;
export declare function setJobResumeDraftReviewDecision(workspace: string, proposalId: string, itemType: JobResumeDraftReviewDecision["itemType"], itemId: string, input: {
    decision: "accept" | "edit" | "reject";
    editedValue?: unknown;
    reviewNote?: string;
    now?: () => Date;
}): Promise<JobResumeDraftReview>;
export declare function completeJobResumeDraftReview(workspace: string, proposalId: string, options?: {
    now?: () => Date;
}): Promise<JobResumeDraftReviewStatus>;
export declare function showJobResumeDraftReview(workspace: string, reviewOrProposalId: string): Promise<JobResumeDraftReview>;
export declare function getJobResumeDraftReviewStatus(workspace: string, reviewOrProposalId: string): Promise<JobResumeDraftReviewStatus>;
export declare function mergeReviewedJobResumeDraft(workspace: string, proposalId: string, suppliedReview?: JobResumeDraftReview): Promise<ReviewedJobResumeDraftPayload>;
export declare function readJobResumeDraftReviewEdit(filePath: string): Promise<unknown>;
export declare function formatJobResumeDraftReviewStatus(status: JobResumeDraftReviewStatus): string;
export declare function jobResumeDraftReviewPaths(workspace: string, targetId: string, proposalId: string): {
    reviewRelativePath: string;
    reviewPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
