import { type TargetAnalysis } from "./schemas.js";
export declare const TARGET_ANALYZER_NAME = "target-structure";
export declare const TARGET_ANALYZER_VERSION = "2";
interface AnalyzeOptions {
    rebuild?: boolean;
    now?: () => Date;
    analyzerName?: string;
    analyzerVersion?: string;
}
export interface AnalyzeTargetResult {
    targetId: string;
    targetType: "role" | "job";
    result: "created" | "rebuilt" | "already-current";
    analyzerName: string;
    analyzerVersion: string;
    analysisPath: string;
    manifestPath: string;
    sectionCount: number;
    itemCount: number;
    warningCount: number;
    sourceSha256?: string;
}
export interface TargetAnalysisStatus {
    targetId: string;
    targetType: "role" | "job";
    analysisExists: boolean;
    manifestExists: boolean;
    targetHashMatches: boolean | null;
    sourceHashMatches: boolean | null;
    analyzerVersionMatches: boolean | null;
    analysisHashMatches: boolean | null;
    status: "current" | "missing" | "stale" | "invalid";
    reasons: string[];
    analysisPath: string;
    manifestPath: string;
}
export declare function getTargetAnalysisStatus(workspace: string, targetId: string, options?: Pick<AnalyzeOptions, "analyzerName" | "analyzerVersion">): Promise<TargetAnalysisStatus>;
export declare function analyzeTarget(workspace: string, targetId: string, options?: AnalyzeOptions): Promise<AnalyzeTargetResult>;
export declare function showTargetAnalysis(workspace: string, targetId: string): Promise<TargetAnalysis>;
export declare function formatAnalyzeTargetResult(result: AnalyzeTargetResult): string;
export declare function formatTargetAnalysisStatus(status: TargetAnalysisStatus): string;
export declare function analysisFileTimestamps(workspace: string, targetId: string): Promise<{
    analysisMtimeMs: number;
    manifestMtimeMs: number;
}>;
export {};
