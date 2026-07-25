import { type RoleResumeDateFormat, type RoleResumePageSize, type RoleResumeRenderDocument, type RoleResumeRenderProfile, type RoleResumeRenderProfileName } from "./role-resume-render-schemas.js";
export declare const ROLE_RESUME_RENDERING_POLICY_NAME = "role-resume-rendering-policy";
export declare const ROLE_RESUME_RENDERING_POLICY_VERSION = "1";
export declare const ROLE_RESUME_COMPOSITION_RULES_VERSION = "1";
export declare const ROLE_RESUME_RENDER_PROFILE_VERSION = "1";
export interface RoleResumeRenderOptions {
    profile?: RoleResumeRenderProfileName;
    pageSize?: RoleResumePageSize;
    dateFormat?: RoleResumeDateFormat;
    rebuild?: boolean;
    now?: () => Date;
}
export interface NormalizedRoleResumeRenderOptions {
    profile: RoleResumeRenderProfileName;
    pageSize: RoleResumePageSize;
    dateFormat: RoleResumeDateFormat;
}
export interface ComposeRoleResumeResult {
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
export interface RoleResumeRenderDocumentStatus {
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
export declare function normalizeRoleResumeRenderOptions(options?: RoleResumeRenderOptions): NormalizedRoleResumeRenderOptions;
export declare function resolveRoleResumeRenderProfile(profileName: RoleResumeRenderProfileName, pageSize: RoleResumePageSize): RoleResumeRenderProfile;
export declare function composeRoleResumeRenderDocument(workspace: string, targetId: string, options?: RoleResumeRenderOptions): Promise<ComposeRoleResumeResult>;
export declare function showRoleResumeRenderDocument(workspace: string, targetId: string): Promise<RoleResumeRenderDocument>;
export declare function getRoleResumeRenderDocumentStatus(workspace: string, targetId: string, requestedOptions?: NormalizedRoleResumeRenderOptions): Promise<RoleResumeRenderDocumentStatus>;
export declare function roleResumeRenderDocumentPaths(workspace: string, targetId: string): {
    documentRelativePath: string;
    documentPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export declare function formatComposeRoleResumeResult(result: ComposeRoleResumeResult): string;
export declare function formatRoleResumeRenderDocumentStatus(status: RoleResumeRenderDocumentStatus): string;
