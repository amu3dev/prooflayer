export interface ApproveRoleResumePlanOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface ApproveRoleResumePlanResult {
    targetId: string;
    proposalId: string;
    result: "created" | "rebuilt" | "already-current";
    deterministicApprovedCount: number;
    humanApprovedCount: number;
    humanEditedCount: number;
    rejectedFallbackCount: number;
    completeness: "empty" | "partial" | "complete";
    usableForResumeDrafting: boolean;
    planPath: string;
    manifestPath: string;
}
export declare function approveRoleResumePlanProposal(workspace: string, proposalId: string, options?: ApproveRoleResumePlanOptions): Promise<ApproveRoleResumePlanResult>;
export declare function formatApproveRoleResumePlanResult(result: ApproveRoleResumePlanResult): string;
