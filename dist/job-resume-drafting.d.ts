import { type JobResumeDraftScaffold, type JobResumeDraftScaffoldManifest } from "./job-resume-draft-schemas.js";
import { type JobResumeContentPlan } from "./job-resume-plan-schemas.js";
import { type JobResumePlanningContext } from "./job-resume-planning.js";
export declare const JOB_RESUME_DRAFTING_POLICY_NAME = "job-resume-drafting-policy";
export declare const JOB_RESUME_DRAFTING_POLICY_VERSION = "1";
export interface JobResumeDraftingContext extends JobResumePlanningContext {
    contentPlan: JobResumeContentPlan;
    contentPlanPath: string;
    contentPlanSha256: string;
    contentPlanManifestPath: string;
    contentPlanManifestSha256: string;
}
export interface BuildJobResumeDraftScaffoldOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface BuildJobResumeDraftScaffoldResult {
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    scaffoldId: string;
    scaffoldPath: string;
    manifestPath: string;
    includedSectionCount: number;
    excludedSectionCount: number;
    placeholderCount: number;
}
export interface JobResumeDraftScaffoldStatus {
    targetId: string;
    scaffoldExists: boolean;
    manifestExists: boolean;
    scaffoldHashMatches: boolean | null;
    dependenciesMatch: boolean | null;
    policyVersionMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    scaffoldPath: string;
    manifestPath: string;
}
export declare function loadJobResumeDraftingContext(workspace: string, targetId: string): Promise<JobResumeDraftingContext>;
export declare function buildJobResumeDraftScaffold(workspace: string, targetId: string, options?: BuildJobResumeDraftScaffoldOptions): Promise<BuildJobResumeDraftScaffoldResult>;
export declare function deriveJobResumeDraftScaffold(context: JobResumeDraftingContext, createdAt: string, updatedAt: string): JobResumeDraftScaffold;
export declare function showJobResumeDraftScaffold(workspace: string, targetId: string): Promise<JobResumeDraftScaffold>;
export declare function getJobResumeDraftScaffoldStatus(workspace: string, targetId: string): Promise<JobResumeDraftScaffoldStatus>;
export declare function assertJobResumeDraftScaffoldConsistency(scaffold: JobResumeDraftScaffold, context: JobResumeDraftingContext): void;
export declare function deterministicJobResumeDraftScaffoldId(context: JobResumeDraftingContext): string;
export declare function jobResumeDraftScaffoldPaths(workspace: string, targetId: string): {
    scaffoldRelativePath: string;
    scaffoldPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export declare function createJobResumeDraftScaffoldManifest(scaffold: JobResumeDraftScaffold, context: JobResumeDraftingContext, scaffoldPath: string, scaffoldSha256: string, createdAt: string, updatedAt: string): JobResumeDraftScaffoldManifest;
export declare function formatBuildJobResumeDraftScaffoldResult(result: BuildJobResumeDraftScaffoldResult): string;
export declare function formatJobResumeDraftScaffoldStatus(status: JobResumeDraftScaffoldStatus): string;
