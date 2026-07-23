import { type ModelRoleResumePlanPayload, type RoleResumePlanReview, type RoleResumePlanReviewDecision } from "./role-resume-plan-schemas.js";
export interface RoleResumePlanReviewStatus {
    proposalId: string;
    targetId: string;
    status: "missing" | "in-progress" | "completed" | "invalid";
    counts: Record<"pending" | "accept" | "edit" | "reject", number>;
    unresolvedCount: number;
    reviewPath: string;
    manifestPath: string;
    reasons: string[];
}
export declare function initializeRoleResumePlanReview(workspace: string, proposalId: string, options?: {
    reviewerName?: string;
    now?: () => Date;
}): Promise<RoleResumePlanReview>;
export declare function setRoleResumePlanReviewDecision(workspace: string, proposalId: string, itemType: RoleResumePlanReviewDecision["itemType"], itemId: string, input: {
    decision: "accept" | "edit" | "reject";
    editedValue?: unknown;
    reviewNote?: string;
    now?: () => Date;
}): Promise<RoleResumePlanReview>;
export declare function completeRoleResumePlanReview(workspace: string, proposalId: string, options?: {
    now?: () => Date;
}): Promise<RoleResumePlanReviewStatus>;
export declare function showRoleResumePlanReview(workspace: string, proposalId: string): Promise<RoleResumePlanReview>;
export declare function getRoleResumePlanReviewStatus(workspace: string, proposalId: string): Promise<RoleResumePlanReviewStatus>;
export declare function readRoleResumePlanReviewEdit(filePath: string): Promise<unknown>;
export declare function mergeReviewedPayload(workspace: string, proposalId: string, review?: RoleResumePlanReview): Promise<ModelRoleResumePlanPayload>;
export declare function formatRoleResumePlanReviewStatus(status: RoleResumePlanReviewStatus): string;
