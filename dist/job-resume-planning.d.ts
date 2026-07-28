import { type JobFitProofAssessment, type JobRequirementFitProofAssessment } from "./job-fit-proof-assessment-schemas.js";
import { type JobRequirementEmphasisDecision, type JobResumeContentPlan, type JobResumePositioningState } from "./job-resume-plan-schemas.js";
export declare const JOB_RESUME_PLANNING_POLICY_NAME = "job-resume-content-planning-policy";
export declare const JOB_RESUME_PLANNING_POLICY_VERSION = "1";
interface JobResumePlanPaths {
    rootRelativePath: string;
    rootPath: string;
    planRelativePath: string;
    planPath: string;
    manifestRelativePath: string;
    manifestPath: string;
}
interface BuildOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface BuildJobResumePlanResult {
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    planId: string;
    planPath: string;
    manifestPath: string;
    positioningState: JobResumePositioningState;
    selectedRequirementCount: number;
    includedSectionCount: number;
    completeness: "empty" | "partial" | "complete";
    usableForDrafting: boolean;
}
export interface JobResumePlanStatus {
    targetId: string;
    planExists: boolean;
    manifestExists: boolean;
    assessmentStatus: "missing" | "current" | "stale" | "invalid";
    planHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    sourceHashMatches: boolean | null;
    requirementModelHashMatches: boolean | null;
    requirementManifestHashMatches: boolean | null;
    evidenceMapHashMatches: boolean | null;
    evidenceMapManifestHashMatches: boolean | null;
    coverageHashMatches: boolean | null;
    coverageManifestHashMatches: boolean | null;
    assessmentHashMatches: boolean | null;
    assessmentManifestHashMatches: boolean | null;
    sourcesHashMatches: boolean | null;
    evidenceItemsHashMatches: boolean | null;
    claimsHashMatches: boolean | null;
    selectedEvidenceSetHashMatches: boolean | null;
    selectedClaimSetHashMatches: boolean | null;
    policyMatches: boolean | null;
    normalizedInputHashMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    planPath: string;
    manifestPath: string;
}
export declare function jobResumePlanPaths(workspace: string, targetId: string): JobResumePlanPaths;
export declare function buildJobResumePlan(workspace: string, targetId: string, options?: BuildOptions): Promise<BuildJobResumePlanResult>;
export declare function showJobResumePlan(workspace: string, targetId: string): Promise<JobResumeContentPlan>;
export declare function getJobResumePlanStatus(workspace: string, targetId: string): Promise<JobResumePlanStatus>;
export declare function deriveJobPositioningState(overall: JobFitProofAssessment["overall"]["state"]): JobResumePositioningState;
export declare function deriveJobRequirementEmphasisDecision(assessment: Pick<JobRequirementFitProofAssessment, "necessity" | "assessmentState" | "proofStrength" | "materiality">): JobRequirementEmphasisDecision;
export declare function formatBuildJobResumePlanResult(result: BuildJobResumePlanResult): string;
export declare function formatJobResumePlanStatus(status: JobResumePlanStatus): string;
export {};
