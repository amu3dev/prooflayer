import { type JobResumeRenderDocument } from "./job-resume-render-schemas.js";
import { type NormalizedRoleResumeRenderOptions, type RoleResumeRenderOptions } from "./role-resume-rendering.js";
import type { RoleResumeDateFormat, RoleResumePageSize, RoleResumeRenderProfileName } from "./role-resume-render-schemas.js";
export declare const JOB_RESUME_RENDERING_POLICY_NAME = "job-resume-rendering-policy";
export declare const JOB_RESUME_RENDERING_POLICY_VERSION = "1";
export declare const JOB_RESUME_COMPOSITION_RULES_VERSION = "1";
export type JobResumeRenderOptions = RoleResumeRenderOptions;
export interface ComposeJobResumeResult {
    targetId: string;
    canonicalDocumentId: string;
    result: "created" | "rebuilt" | "already-current";
    profile: RoleResumeRenderProfileName;
    pageSize: RoleResumePageSize;
    dateFormat: RoleResumeDateFormat;
    sectionCount: number;
    blockCount: number;
    warningCount: number;
    documentPath: string;
    manifestPath: string;
}
export interface JobResumeRenderDocumentStatus {
    targetId: string;
    documentExists: boolean;
    manifestExists: boolean;
    documentHashMatches: boolean | null;
    approvedDraftCurrent: boolean | null;
    approvedDraftHashMatches: boolean | null;
    approvedDraftManifestHashMatches: boolean | null;
    policyVersionMatches: boolean | null;
    profileVersionMatches: boolean | null;
    optionsMatch: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    documentPath: string;
    manifestPath: string;
}
export declare function composeJobResumeRenderDocument(workspace: string, targetId: string, options?: JobResumeRenderOptions): Promise<ComposeJobResumeResult>;
export declare function showJobResumeRenderDocument(workspace: string, targetId: string): Promise<JobResumeRenderDocument>;
export declare function getJobResumeRenderDocumentStatus(workspace: string, targetId: string, requestedOptions?: NormalizedRoleResumeRenderOptions): Promise<JobResumeRenderDocumentStatus>;
export declare function jobResumeRenderDocumentPaths(workspace: string, targetId: string): {
    documentRelativePath: string;
    documentPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export declare function formatComposeJobResumeResult(result: ComposeJobResumeResult): string;
export declare function formatJobResumeRenderDocumentStatus(status: JobResumeRenderDocumentStatus): string;
