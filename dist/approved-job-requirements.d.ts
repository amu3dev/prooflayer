import { type ApprovedJobRequirementModel } from "./job-requirement-schemas.js";
export declare const APPROVED_JOB_REQUIREMENT_POLICY_NAME = "approved-job-requirement-modeling-policy";
export declare const APPROVED_JOB_REQUIREMENT_POLICY_VERSION = "1";
interface ApproveOptions {
    proposalId?: string;
    rebuild?: boolean;
    now?: () => Date;
    policyName?: string;
    policyVersion?: string;
}
export interface ApproveJobRequirementsResult {
    targetId: string;
    proposalId: string;
    result: "created" | "updated" | "already-current";
    approvedModelPath: string;
    manifestPath: string;
    approvedCount: number;
    editedCount: number;
    rejectedCount: number;
    completeness: ApprovedJobRequirementModel["completeness"];
}
export interface ApprovedJobRequirementsStatus {
    targetId: string;
    approvedModelExists: boolean;
    manifestExists: boolean;
    approvedModelHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    sourceHashMatches: boolean | null;
    structuralAnalysisHashMatches: boolean | null;
    deterministicModelHashMatches: boolean | null;
    proposalHashMatches: boolean | null;
    reviewHashMatches: boolean | null;
    promptMatches: boolean | null;
    policyMatches: boolean | null;
    normalizedInputHashMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    approvedModelPath: string;
    manifestPath: string;
}
export declare function approveJobRequirements(workspace: string, targetId: string, options?: ApproveOptions): Promise<ApproveJobRequirementsResult>;
export declare function showApprovedJobRequirements(workspace: string, targetId: string): Promise<ApprovedJobRequirementModel>;
export declare function getApprovedJobRequirementsStatus(workspace: string, targetId: string, options?: Pick<ApproveOptions, "policyName" | "policyVersion">): Promise<ApprovedJobRequirementsStatus>;
export declare function formatApproveJobRequirementsResult(result: ApproveJobRequirementsResult): string;
export declare function formatApprovedJobRequirementsStatus(status: ApprovedJobRequirementsStatus): string;
export {};
