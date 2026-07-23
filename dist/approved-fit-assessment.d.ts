export interface ApproveFitAssessmentOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface ApproveFitAssessmentResult {
    targetId: string;
    targetType: "role" | "job";
    mode: "role-positioning" | "job-specific";
    proposalId: string;
    result: "created" | "rebuilt" | "already-current";
    deterministicApprovedCount: number;
    humanApprovedCount: number;
    humanEditedCount: number;
    rejectedFallbackCount: number;
    completeness: "empty" | "partial" | "complete";
    usableForResumeConstruction: boolean;
    usableForApplicationConstruction: boolean;
    assessmentPath: string;
    manifestPath: string;
}
export declare function approveFitAssessmentProposal(workspace: string, proposalId: string, options?: ApproveFitAssessmentOptions): Promise<ApproveFitAssessmentResult>;
export declare function formatApproveFitAssessmentResult(result: ApproveFitAssessmentResult): string;
