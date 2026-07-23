import { type EditedExpectationFitAssessment, type FitAssessmentProposalReview, type FitAssessmentReviewDecision, type FitAssessmentSummary } from "./fit-assessment-schemas.js";
export interface FitAssessmentReviewOptions {
    reviewerName?: string;
    now?: () => Date;
}
export interface FitAssessmentReviewStatus {
    proposalId: string;
    targetId: string;
    reviewExists: boolean;
    manifestExists: boolean;
    reviewHashMatches: boolean | null;
    proposalHashMatches: boolean | null;
    status: "missing" | "in-progress" | "completed" | "invalid";
    expectationCounts: Record<FitAssessmentReviewDecision["decision"], number>;
    summaryDecision: "pending" | "accept" | "edit" | "reject";
    reasons: string[];
    reviewPath: string;
    manifestPath: string;
}
export declare function initializeFitAssessmentReview(workspace: string, proposalId: string, options?: FitAssessmentReviewOptions): Promise<FitAssessmentReviewStatus>;
export declare function setFitAssessmentReviewDecision(workspace: string, proposalId: string, proposedAssessmentId: string, input: {
    decision: "accept" | "reject" | "edit";
    editedAssessment?: EditedExpectationFitAssessment;
    reviewNote?: string;
}, options?: Pick<FitAssessmentReviewOptions, "now">): Promise<FitAssessmentReviewStatus>;
export declare function setFitAssessmentSummaryReviewDecision(workspace: string, proposalId: string, input: {
    decision: "accept" | "reject" | "edit";
    editedSummary?: FitAssessmentSummary;
    reviewNote?: string;
}, options?: Pick<FitAssessmentReviewOptions, "now">): Promise<FitAssessmentReviewStatus>;
export declare function completeFitAssessmentReview(workspace: string, proposalId: string, options?: Pick<FitAssessmentReviewOptions, "now">): Promise<FitAssessmentReviewStatus>;
export declare function showFitAssessmentReview(workspace: string, proposalId: string): Promise<FitAssessmentProposalReview>;
export declare function getFitAssessmentReviewStatus(workspace: string, proposalId: string): Promise<FitAssessmentReviewStatus>;
export declare function readEditedFitAssessmentFile(filePath: string): Promise<EditedExpectationFitAssessment>;
export declare function readEditedFitAssessmentSummaryFile(filePath: string): Promise<FitAssessmentSummary>;
export declare function formatFitAssessmentReviewStatus(status: FitAssessmentReviewStatus): string;
