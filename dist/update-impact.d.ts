import { type PrivacyCounts, type TrustCounts, type UpdateImpact } from "./change-detector.js";
export declare const UPDATE_BASELINE_PATH = "kb/update-baseline.json";
export declare const UPDATE_IMPACT_REPORT_PATH = "outputs/reports/update-impact-report.md";
export declare const LATEST_REFRESH_PATH = "outputs/changelogs/latest-refresh.json";
export declare const OUTPUT_MANIFEST_PATH = "outputs/output-manifest.json";
export type ChangeCounts = {
    added: number;
    removed: number;
    changed: number;
    unchanged: number;
};
export type OutputStaleness = {
    status: "none_registered" | "current" | "stale";
    registered: number;
    current: number;
    stale: number;
    drafts: number;
    finals: number;
    exports: number;
};
export type LatestRefresh = {
    schemaVersion: 1;
    refreshId: string;
    refreshedAt: string;
    firstRefresh: boolean;
    reportPath: string;
    profileFingerprint: string;
    previousProfileFingerprint?: string;
    profileFingerprintChanged: boolean;
    changes: {
        sources: ChangeCounts;
        evidence: ChangeCounts;
        claims: ChangeCounts;
        roles: ChangeCounts;
        projects: ChangeCounts;
        skills: ChangeCounts;
        domains: ChangeCounts;
    };
    trustTransitions: UpdateImpact["trustTransitions"];
    privacyTransitions: UpdateImpact["privacyTransitions"];
    trustCounts: TrustCounts;
    privacyCounts: PrivacyCounts;
    independentSourceFamilies: number;
    outputs: OutputStaleness;
    attentionRequired: boolean;
    warnings: string[];
};
export type WorkspaceStatus = {
    initialized: boolean;
    sourceCount: number;
    lastSuccessfulRefresh?: string;
    profileFingerprint?: string;
    warningCount: number;
    trustCounts: TrustCounts;
    privacyCounts: PrivacyCounts;
    outputs: OutputStaleness;
};
export type RefreshOptions = {
    now?: () => Date;
    runPipeline?: (workspace: string) => Promise<void>;
};
export declare function refreshWorkspace(workspace: string, options?: RefreshOptions): Promise<LatestRefresh>;
export declare function getLatestChanges(workspace: string): Promise<LatestRefresh | null>;
export declare function getWorkspaceStatus(workspace: string): Promise<WorkspaceStatus>;
export declare function formatChangesSummary(latest: LatestRefresh | null): string;
export declare function formatStatusSummary(status: WorkspaceStatus): string;
export declare function inspectOutputStaleness(workspace: string, profileFingerprint: string): Promise<OutputStaleness>;
