import { type JobRequirementModel } from "./job-requirement-schemas.js";
export declare const JOB_REQUIREMENT_POLICY_NAME = "job-requirement-modeling-policy";
export declare const JOB_REQUIREMENT_POLICY_VERSION = "1";
interface RequirementPaths {
    rootRelativePath: string;
    rootPath: string;
    modelRelativePath: string;
    modelPath: string;
    manifestRelativePath: string;
    manifestPath: string;
    targetRelativePath: string;
    targetPath: string;
    sourceRelativePath: string;
    sourcePath: string;
    analysisRelativePath: string;
    analysisPath: string;
    analysisManifestRelativePath: string;
    analysisManifestPath: string;
}
interface BuildOptions {
    rebuild?: boolean;
    now?: () => Date;
    policyName?: string;
    policyVersion?: string;
}
export interface BuildJobRequirementsResult {
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    modelPath: string;
    manifestPath: string;
    requirementCount: number;
    ambiguityCount: number;
    contradictionCount: number;
    warningCount: number;
    completeness: JobRequirementModel["completeness"];
}
export interface JobRequirementModelStatus {
    targetId: string;
    modelExists: boolean;
    manifestExists: boolean;
    modelHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    sourceHashMatches: boolean | null;
    structuralAnalysisHashMatches: boolean | null;
    structuralManifestHashMatches: boolean | null;
    policyMatches: boolean | null;
    normalizedInputHashMatches: boolean | null;
    structuralAnalysisStatus: "current" | "missing" | "stale" | "invalid";
    status: "current" | "missing" | "stale" | "invalid";
    reasons: string[];
    modelPath: string;
    manifestPath: string;
}
export declare function jobRequirementPaths(workspace: string, targetId: string): RequirementPaths;
export declare function buildJobRequirements(workspace: string, targetId: string, options?: BuildOptions): Promise<BuildJobRequirementsResult>;
export declare function showJobRequirementModel(workspace: string, targetId: string): Promise<JobRequirementModel>;
export declare function getJobRequirementModelStatus(workspace: string, targetId: string, options?: Pick<BuildOptions, "policyName" | "policyVersion">): Promise<JobRequirementModelStatus>;
export declare function formatBuildJobRequirementsResult(result: BuildJobRequirementsResult): string;
export declare function formatJobRequirementModelStatus(status: JobRequirementModelStatus): string;
export {};
