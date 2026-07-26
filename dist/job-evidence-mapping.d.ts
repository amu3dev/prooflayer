import { type JobEvidenceMap, type JobRequirementInputType } from "./job-evidence-map-schemas.js";
export declare const JOB_EVIDENCE_MAPPER_NAME = "job-evidence-mapper";
export declare const JOB_EVIDENCE_MAPPER_VERSION = "1";
export declare const JOB_EVIDENCE_MAPPING_POLICY_NAME = "job-evidence-mapping-policy";
export declare const JOB_EVIDENCE_MAPPING_POLICY_VERSION = "1";
interface JobEvidenceMapPaths {
    rootRelativePath: string;
    rootPath: string;
    mapRelativePath: string;
    mapPath: string;
    manifestRelativePath: string;
    manifestPath: string;
}
interface BuildOptions {
    rebuild?: boolean;
    requirementSource?: JobRequirementInputType;
    now?: () => Date;
}
export interface BuildJobEvidenceMapResult {
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    requirementSource: JobRequirementInputType;
    mapPath: string;
    manifestPath: string;
    requirementCount: number;
    supportedRequirementCount: number;
    unsupportedRequirementCount: number;
    linkCount: number;
}
export interface JobEvidenceMapStatus {
    targetId: string;
    mapExists: boolean;
    manifestExists: boolean;
    mapHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    sourceHashMatches: boolean | null;
    requirementModelStatus: "current" | "missing" | "stale" | "invalid" | null;
    requirementModelHashMatches: boolean | null;
    requirementManifestHashMatches: boolean | null;
    sourcesHashMatches: boolean | null;
    evidenceItemsHashMatches: boolean | null;
    claimsHashMatches: boolean | null;
    eligibleEvidenceSetHashMatches: boolean | null;
    policyMatches: boolean | null;
    normalizedInputHashMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    mapPath: string;
    manifestPath: string;
}
export declare function jobEvidenceMapPaths(workspace: string, targetId: string): JobEvidenceMapPaths;
export declare function buildJobEvidenceMap(workspace: string, targetId: string, options?: BuildOptions): Promise<BuildJobEvidenceMapResult>;
export declare function showJobEvidenceMap(workspace: string, targetId: string): Promise<JobEvidenceMap>;
export declare function getJobEvidenceMapStatus(workspace: string, targetId: string): Promise<JobEvidenceMapStatus>;
export declare function formatBuildJobEvidenceMapResult(result: BuildJobEvidenceMapResult): string;
export declare function formatJobEvidenceMapStatus(status: JobEvidenceMapStatus): string;
export {};
