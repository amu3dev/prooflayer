import { type EditedJobRequirement, type JobRequirementProposalReview, type JobRequirementReviewDecision } from "./job-requirement-schemas.js";
interface ReviewOptions {
    reviewerName?: string;
    now?: () => Date;
}
export interface JobRequirementReviewStatus {
    proposalId: string;
    targetId: string;
    reviewExists: boolean;
    manifestExists: boolean;
    reviewHashMatches: boolean | null;
    proposalHashMatches: boolean | null;
    deterministicModelHashMatches: boolean | null;
    status: "missing" | "in-progress" | "completed" | "invalid";
    counts: Record<JobRequirementReviewDecision["decision"], number>;
    reasons: string[];
    reviewPath: string;
    manifestPath: string;
}
export declare function initializeJobRequirementReview(workspace: string, proposalId: string, options?: ReviewOptions): Promise<JobRequirementReviewStatus>;
export declare function setJobRequirementReviewDecision(workspace: string, proposalId: string, requirementId: string, input: {
    decision: "accept" | "edit" | "reject";
    editedRequirement?: EditedJobRequirement;
    reviewNote?: string;
}, options?: Pick<ReviewOptions, "now">): Promise<JobRequirementReviewStatus>;
export declare function completeJobRequirementReview(workspace: string, proposalId: string, options?: Pick<ReviewOptions, "now">): Promise<JobRequirementReviewStatus>;
export declare function showJobRequirementReview(workspace: string, proposalId: string): Promise<JobRequirementProposalReview>;
export declare function getJobRequirementReviewStatus(workspace: string, proposalId: string): Promise<JobRequirementReviewStatus>;
export declare function readEditedJobRequirementFile(filePath: string): Promise<EditedJobRequirement>;
export declare function formatJobRequirementReviewStatus(status: JobRequirementReviewStatus): string;
export declare function jobRequirementReviewPaths(workspace: string, targetId: string, proposalId: string): {
    reviewRelativePath: string;
    reviewPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export {};
