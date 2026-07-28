import { type JobAssessmentGapType, type JobAssessmentMateriality, type JobAssessmentProofStrength, type JobFitProofAssessment, type JobOverallAssessmentState, type JobRequirementAssessmentState, type JobRequirementFitProofAssessment } from "./job-fit-proof-assessment-schemas.js";
import { type JobRequirementCoverage } from "./job-coverage-schemas.js";
export declare const JOB_FIT_PROOF_ASSESSMENT_ANALYZER_NAME = "job-fit-proof-assessment";
export declare const JOB_FIT_PROOF_ASSESSMENT_ANALYZER_VERSION = "1";
export declare const JOB_FIT_PROOF_ASSESSMENT_POLICY_NAME = "job-fit-proof-assessment-policy";
export declare const JOB_FIT_PROOF_ASSESSMENT_POLICY_VERSION = "1";
interface JobAssessmentPaths {
    rootRelativePath: string;
    rootPath: string;
    assessmentRelativePath: string;
    assessmentPath: string;
    manifestRelativePath: string;
    manifestPath: string;
}
interface BuildOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface BuildJobFitProofAssessmentResult {
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    assessmentPath: string;
    manifestPath: string;
    requirementCount: number;
    overallState: JobOverallAssessmentState;
    readyForDownstreamPlanning: boolean;
}
export interface JobFitProofAssessmentStatus {
    targetId: string;
    assessmentExists: boolean;
    manifestExists: boolean;
    coverageStatus: "missing" | "current" | "stale" | "invalid";
    assessmentHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    sourceHashMatches: boolean | null;
    requirementModelHashMatches: boolean | null;
    requirementManifestHashMatches: boolean | null;
    evidenceMapHashMatches: boolean | null;
    evidenceMapManifestHashMatches: boolean | null;
    coverageHashMatches: boolean | null;
    coverageManifestHashMatches: boolean | null;
    analyzerMatches: boolean | null;
    policyMatches: boolean | null;
    normalizedInputHashMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    assessmentPath: string;
    manifestPath: string;
}
export interface RequirementAssessmentDecision {
    assessmentState: JobRequirementAssessmentState;
    proofStrength: JobAssessmentProofStrength;
    materiality: JobAssessmentMateriality;
    gapType?: JobAssessmentGapType;
    statement: string;
}
export declare function jobFitProofAssessmentPaths(workspace: string, targetId: string): JobAssessmentPaths;
export declare function buildJobFitProofAssessment(workspace: string, targetId: string, options?: BuildOptions): Promise<BuildJobFitProofAssessmentResult>;
export declare function showJobFitProofAssessment(workspace: string, targetId: string): Promise<JobFitProofAssessment>;
export declare function getJobFitProofAssessmentStatus(workspace: string, targetId: string): Promise<JobFitProofAssessmentStatus>;
export declare function classifyJobRequirementAssessment(coverage: Pick<JobRequirementCoverage, "state" | "evidenceQuality" | "necessity" | "category" | "warnings">): RequirementAssessmentDecision;
export declare function classifyOverallJobAssessment(assessments: Array<Pick<JobRequirementFitProofAssessment, "requirementId" | "necessity" | "assessmentState" | "proofStrength">>): JobOverallAssessmentState;
export declare function formatBuildJobFitProofAssessmentResult(result: BuildJobFitProofAssessmentResult): string;
export declare function formatJobFitProofAssessmentStatus(status: JobFitProofAssessmentStatus): string;
export {};
