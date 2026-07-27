import { type JobCoverageComponent, type JobRequirementCoverageModel, type JobRequirementCoverageState, type JobRequirementEvidenceQuality } from "./job-coverage-schemas.js";
import { type JobEvidenceLink, type JobEvidenceStrength } from "./job-evidence-map-schemas.js";
import { type ApprovedJobRequirement, type JobRequirement } from "./job-requirement-schemas.js";
export declare const JOB_COVERAGE_ANALYZER_NAME = "job-requirement-coverage";
export declare const JOB_COVERAGE_ANALYZER_VERSION = "1";
export declare const JOB_COVERAGE_POLICY_NAME = "job-requirement-coverage-policy";
export declare const JOB_COVERAGE_POLICY_VERSION = "1";
type Requirement = JobRequirement | ApprovedJobRequirement;
type CoverageRelationship = JobEvidenceLink["relationship"] | "contradiction";
interface JobCoveragePaths {
    rootRelativePath: string;
    rootPath: string;
    coverageRelativePath: string;
    coveragePath: string;
    manifestRelativePath: string;
    manifestPath: string;
}
interface BuildOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface BuildJobCoverageResult {
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    coveragePath: string;
    manifestPath: string;
    requirementCount: number;
    readyForDownstreamAssessment: boolean;
}
export interface JobCoverageStatus {
    targetId: string;
    coverageExists: boolean;
    manifestExists: boolean;
    coverageHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    sourceHashMatches: boolean | null;
    requirementModelHashMatches: boolean | null;
    requirementManifestHashMatches: boolean | null;
    evidenceMapStatus: "current" | "missing" | "stale" | "invalid";
    evidenceMapHashMatches: boolean | null;
    evidenceMapManifestHashMatches: boolean | null;
    analyzerMatches: boolean | null;
    policyMatches: boolean | null;
    normalizedInputHashMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    coveragePath: string;
    manifestPath: string;
}
export interface CoverageDecisionLink {
    id: string;
    relationship: CoverageRelationship;
    contradictionApproved?: boolean;
    evidenceStrength: JobEvidenceStrength;
    linkConfidence: "high" | "medium" | "low";
}
export interface CoverageDecisionInput {
    necessity: Requirement["necessity"];
    hasUnresolvedAmbiguity: boolean;
    links: CoverageDecisionLink[];
    components?: Array<Pick<JobCoverageComponent, "status">>;
}
export interface CoverageDecision {
    state: JobRequirementCoverageState;
    evidenceQuality: JobRequirementEvidenceQuality;
}
export declare function jobCoveragePaths(workspace: string, targetId: string): JobCoveragePaths;
export declare function buildJobCoverage(workspace: string, targetId: string, options?: BuildOptions): Promise<BuildJobCoverageResult>;
export declare function showJobCoverage(workspace: string, targetId: string): Promise<JobRequirementCoverageModel>;
export declare function getJobCoverageStatus(workspace: string, targetId: string): Promise<JobCoverageStatus>;
export declare function classifyJobRequirementCoverage(input: CoverageDecisionInput): CoverageDecision;
export declare function formatBuildJobCoverageResult(result: BuildJobCoverageResult): string;
export declare function formatJobCoverageStatus(status: JobCoverageStatus): string;
export {};
