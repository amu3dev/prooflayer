import { type ApprovedRoleResumeDraft, type RoleResumeDraftCompleteness } from "./role-resume-draft-schemas.js";
import { showRoleResumeDraftScaffold } from "./role-resume-drafting.js";
import { showRoleResumeComposition } from "./role-resume-composition.js";
export interface ApproveRoleResumeDraftOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface ApproveRoleResumeDraftResult {
    targetId: string;
    proposalId: string;
    result: "created" | "rebuilt" | "already-current";
    deterministicApprovedCount: number;
    humanApprovedCount: number;
    humanEditedCount: number;
    rejectedItemCount: number;
    completeness: "complete" | "constrained-but-usable" | "incomplete" | "blocked";
    usableForRendering: boolean;
    draftPath: string;
    manifestPath: string;
}
export interface ApprovedRoleResumeDraftStatus {
    targetId: string;
    draftExists: boolean;
    manifestExists: boolean;
    draftHashMatches: boolean | null;
    dependenciesMatch: boolean | null;
    scaffoldHashMatches: boolean | null;
    compositionHashMatches: boolean | null;
    proposalHashMatches: boolean | null;
    reviewHashMatches: boolean | null;
    policyVersionMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    usableForRendering: boolean;
    reasons: string[];
    draftPath: string;
    manifestPath: string;
}
export declare function approveRoleResumeDraftProposal(workspace: string, proposalId: string, options?: ApproveRoleResumeDraftOptions): Promise<ApproveRoleResumeDraftResult>;
export declare function showApprovedRoleResumeDraft(workspace: string, targetId: string): Promise<ApprovedRoleResumeDraft>;
export declare function getApprovedRoleResumeDraftStatus(workspace: string, targetId: string): Promise<ApprovedRoleResumeDraftStatus>;
export declare function deriveRoleResumeDraftCompleteness(scaffold: Awaited<ReturnType<typeof showRoleResumeDraftScaffold>>, composition: Awaited<ReturnType<typeof showRoleResumeComposition>>, sections: ApprovedRoleResumeDraft["sections"], claimLedger: ApprovedRoleResumeDraft["claimLedger"], risks: ApprovedRoleResumeDraft["risks"], ambiguities: ApprovedRoleResumeDraft["ambiguities"]): RoleResumeDraftCompleteness;
export declare function assertApprovedRoleResumeDraft(draft: ApprovedRoleResumeDraft): void;
export declare function approvedRoleResumeDraftPaths(workspace: string, targetId: string): {
    draftRelativePath: string;
    draftPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export declare function formatApproveRoleResumeDraftResult(result: ApproveRoleResumeDraftResult): string;
export declare function formatApprovedRoleResumeDraftStatus(status: ApprovedRoleResumeDraftStatus): string;
