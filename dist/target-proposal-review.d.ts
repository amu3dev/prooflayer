import { type EditedTargetExpectation, type InterpretationProposalReview, type ProposalReviewDecision } from "./schemas.js";
export interface ReviewOptions {
    reviewerName?: string;
    now?: () => Date;
}
export interface ReviewStatus {
    proposalId: string;
    targetId: string;
    reviewExists: boolean;
    manifestExists: boolean;
    reviewHashMatches: boolean | null;
    proposalHashMatches: boolean | null;
    status: "missing" | "in-progress" | "completed" | "invalid";
    counts: Record<ProposalReviewDecision["decision"], number>;
    reasons: string[];
    reviewPath: string;
    manifestPath: string;
}
export declare function initializeProposalReview(workspace: string, proposalId: string, options?: ReviewOptions): Promise<ReviewStatus>;
export declare function setProposalReviewDecision(workspace: string, proposalId: string, expectationId: string, input: {
    decision: "accept" | "reject" | "edit";
    editedExpectation?: EditedTargetExpectation;
    reviewNote?: string;
}, options?: Pick<ReviewOptions, "now">): Promise<ReviewStatus>;
export declare function completeProposalReview(workspace: string, proposalId: string, options?: Pick<ReviewOptions, "now">): Promise<ReviewStatus>;
export declare function showProposalReview(workspace: string, proposalId: string): Promise<InterpretationProposalReview>;
export declare function getProposalReviewStatus(workspace: string, proposalId: string): Promise<ReviewStatus>;
export declare function readEditedExpectationFile(filePath: string): Promise<EditedTargetExpectation>;
export declare function formatProposalReviewStatus(status: ReviewStatus): string;
