import { type ApprovedTargetInterpretation, type InterpretationCompleteness } from "./schemas.js";
export declare const APPROVED_INTERPRETER_NAME = "target-semantics-approved";
export declare const APPROVED_INTERPRETER_VERSION = "1";
export declare const APPROVED_INTERPRETATION_POLICY_VERSION = "1";
export interface ApprovalOptions {
    now?: () => Date;
    policyVersion?: string;
}
export interface ApprovalResult {
    targetId: string;
    targetType: "role" | "job";
    proposalId: string;
    result: "created" | "updated" | "already-current";
    interpretationPath: string;
    manifestPath: string;
    deterministicExpectationCount: number;
    humanApprovedCount: number;
    humanEditedCount: number;
    rejectedCount: number;
    completeness: InterpretationCompleteness;
}
export interface ApprovedInterpretationStatus {
    targetId: string;
    targetType: "role" | "job";
    interpretationExists: boolean;
    manifestExists: boolean;
    interpretationHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    structuralAnalysisHashMatches: boolean | null;
    deterministicInterpretationHashMatches: boolean | null;
    roleProfileHashMatches: boolean | null;
    proposalHashMatches: boolean | null;
    reviewHashMatches: boolean | null;
    policyVersionMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    interpretationPath: string;
    manifestPath: string;
}
export declare function approveInterpretationProposal(workspace: string, proposalId: string, options?: ApprovalOptions): Promise<ApprovalResult>;
export declare function showApprovedTargetInterpretation(workspace: string, targetId: string): Promise<ApprovedTargetInterpretation>;
export declare function getApprovedInterpretationStatus(workspace: string, targetId: string, options?: Pick<ApprovalOptions, "policyVersion">): Promise<ApprovedInterpretationStatus>;
export declare function formatApprovalResult(result: ApprovalResult): string;
export declare function formatApprovedInterpretationStatus(status: ApprovedInterpretationStatus): string;
