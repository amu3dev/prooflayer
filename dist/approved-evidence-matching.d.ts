export interface ApproveEvidenceMatchingOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface ApproveEvidenceMatchingResult {
    targetId: string;
    targetType: "role" | "job";
    proposalId: string;
    result: "created" | "rebuilt" | "already-current";
    approvedMatchCount: number;
    manualApprovedCount: number;
    humanApprovedCount: number;
    humanEditedCount: number;
    rejectedCount: number;
    completeness: "empty" | "partial" | "complete";
    usableForFitAssessment: boolean;
    matchingPath: string;
    manifestPath: string;
}
export declare function approveEvidenceMatchProposal(workspace: string, proposalId: string, options?: ApproveEvidenceMatchingOptions): Promise<ApproveEvidenceMatchingResult>;
export declare function formatApproveEvidenceMatchingResult(result: ApproveEvidenceMatchingResult): string;
export declare function approvedMatchingLifecycle(workspace: string, targetId: string): Promise<string>;
