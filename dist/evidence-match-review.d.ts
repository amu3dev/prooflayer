import { type EditedEvidenceMatch, type EvidenceMatchProposalReview, type EvidenceMatchReviewDecision, type ExpectationCoverageReviewDecision, type ExpectationCoverageStatus } from "./schemas.js";
export interface EvidenceMatchReviewOptions {
    reviewerName?: string;
    now?: () => Date;
}
export interface EvidenceMatchReviewStatus {
    proposalId: string;
    targetId: string;
    reviewExists: boolean;
    manifestExists: boolean;
    reviewHashMatches: boolean | null;
    proposalHashMatches: boolean | null;
    status: "missing" | "in-progress" | "completed" | "invalid";
    matchCounts: Record<EvidenceMatchReviewDecision["decision"], number>;
    coverageCounts: Record<ExpectationCoverageReviewDecision["decision"], number>;
    reasons: string[];
    reviewPath: string;
    manifestPath: string;
}
export declare function initializeEvidenceMatchReview(workspace: string, proposalId: string, options?: EvidenceMatchReviewOptions): Promise<EvidenceMatchReviewStatus>;
export declare function setEvidenceMatchReviewDecision(workspace: string, proposalId: string, proposedMatchId: string, input: {
    decision: "accept" | "reject" | "edit";
    editedMatch?: EditedEvidenceMatch;
    reviewNote?: string;
}, options?: Pick<EvidenceMatchReviewOptions, "now">): Promise<EvidenceMatchReviewStatus>;
export declare function setEvidenceCoverageReviewDecision(workspace: string, proposalId: string, proposedCoverageId: string, input: {
    decision: "accept" | "reject" | "edit";
    editedStatus?: ExpectationCoverageStatus;
    reviewNote?: string;
}, options?: Pick<EvidenceMatchReviewOptions, "now">): Promise<EvidenceMatchReviewStatus>;
export declare function completeEvidenceMatchReview(workspace: string, proposalId: string, options?: Pick<EvidenceMatchReviewOptions, "now">): Promise<EvidenceMatchReviewStatus>;
export declare function showEvidenceMatchReview(workspace: string, proposalId: string): Promise<EvidenceMatchProposalReview>;
export declare function getEvidenceMatchReviewStatus(workspace: string, proposalId: string): Promise<EvidenceMatchReviewStatus>;
export declare function readEditedEvidenceMatchFile(filePath: string): Promise<EditedEvidenceMatch>;
export declare function formatEvidenceMatchReviewStatus(status: EvidenceMatchReviewStatus): string;
