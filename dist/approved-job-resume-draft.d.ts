import { type ApprovedJobResumeDraft, type JobResumeDraftCompleteness } from "./job-resume-draft-schemas.js";
import { showJobResumeDraftScaffold } from "./job-resume-drafting.js";
export interface ApproveJobResumeDraftOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface ApproveJobResumeDraftResult {
    targetId: string;
    proposalId: string;
    reviewId: string;
    result: "created" | "rebuilt" | "already-current";
    humanApprovedCount: number;
    humanEditedCount: number;
    rejectedItemCount: number;
    completeness: "empty" | "partial" | "complete";
    usableForRendering: boolean;
    draftPath: string;
    manifestPath: string;
}
export interface ApprovedJobResumeDraftStatus {
    targetId: string;
    draftExists: boolean;
    manifestExists: boolean;
    draftHashMatches: boolean | null;
    dependenciesMatch: boolean | null;
    scaffoldHashMatches: boolean | null;
    proposalHashMatches: boolean | null;
    reviewHashMatches: boolean | null;
    policyVersionMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    usableForRendering: boolean;
    reasons: string[];
    draftPath: string;
    manifestPath: string;
}
export declare function approveJobResumeDraft(workspace: string, targetId: string, options?: ApproveJobResumeDraftOptions): Promise<ApproveJobResumeDraftResult>;
export declare function showApprovedJobResumeDraft(workspace: string, targetId: string): Promise<ApprovedJobResumeDraft>;
export declare function getApprovedJobResumeDraftStatus(workspace: string, targetId: string): Promise<ApprovedJobResumeDraftStatus>;
export declare function deriveJobResumeDraftCompleteness(scaffold: Awaited<ReturnType<typeof showJobResumeDraftScaffold>>, sections: ApprovedJobResumeDraft["sections"], claimLedger: ApprovedJobResumeDraft["claimLedger"], evidenceUsage: ApprovedJobResumeDraft["evidenceUsage"], risks: ApprovedJobResumeDraft["risks"], ambiguities: ApprovedJobResumeDraft["ambiguities"]): JobResumeDraftCompleteness;
export declare function assertApprovedJobResumeDraft(draft: ApprovedJobResumeDraft): void;
export declare function approvedJobResumeDraftPaths(workspace: string, targetId: string): {
    draftRelativePath: string;
    draftPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export declare function formatApproveJobResumeDraftResult(result: ApproveJobResumeDraftResult): string;
export declare function formatApprovedJobResumeDraftStatus(status: ApprovedJobResumeDraftStatus): string;
