import { type ResumeDraftAmbiguity, type ResumeDraftClaimLedgerEntry, type RoleResumeDraftReview, type RoleResumeDraftReviewDecision, type RoleResumeDraftSection } from "./role-resume-draft-schemas.js";
export interface RoleResumeDraftReviewStatus {
    proposalId: string;
    targetId: string;
    status: "missing" | "in-progress" | "completed" | "invalid";
    counts: Record<"pending" | "accept" | "edit" | "reject", number>;
    unresolvedCount: number;
    reviewPath: string;
    manifestPath: string;
    reasons: string[];
}
export interface ReviewedRoleResumeDraftPayload {
    sections: RoleResumeDraftSection[];
    claimLedger: ResumeDraftClaimLedgerEntry[];
    ambiguities: ResumeDraftAmbiguity[];
}
export declare function initializeRoleResumeDraftReview(workspace: string, proposalId: string, options?: {
    reviewerName?: string;
    now?: () => Date;
}): Promise<RoleResumeDraftReview>;
export declare function setRoleResumeDraftReviewDecision(workspace: string, proposalId: string, itemType: RoleResumeDraftReviewDecision["itemType"], itemId: string, input: {
    decision: "accept" | "edit" | "reject";
    editedValue?: unknown;
    reviewNote?: string;
    now?: () => Date;
}): Promise<RoleResumeDraftReview>;
export declare function completeRoleResumeDraftReview(workspace: string, proposalId: string, options?: {
    now?: () => Date;
}): Promise<RoleResumeDraftReviewStatus>;
export declare function showRoleResumeDraftReview(workspace: string, proposalId: string): Promise<RoleResumeDraftReview>;
export declare function getRoleResumeDraftReviewStatus(workspace: string, proposalId: string): Promise<RoleResumeDraftReviewStatus>;
export declare function mergeReviewedRoleResumeDraft(workspace: string, proposalId: string, suppliedReview?: RoleResumeDraftReview): Promise<ReviewedRoleResumeDraftPayload>;
export declare function readRoleResumeDraftReviewEdit(filePath: string): Promise<unknown>;
export declare function formatRoleResumeDraftReviewStatus(status: RoleResumeDraftReviewStatus): string;
export declare function roleResumeDraftReviewPaths(workspace: string, targetId: string, proposalId: string): {
    reviewRelativePath: string;
    reviewPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
