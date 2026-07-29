import type { InterpretationModelProvider } from "./model-provider.js";
import { type JobTargetInput, type TargetCreationOptions, type TargetCreationResult } from "./targets.js";
import { type EvidenceSnapshotListEntry } from "./evidence-snapshots.js";
import type { JobRequirementInputType } from "./job-evidence-map-schemas.js";
import { type JobResumeRenderOptions } from "./job-resume-rendering.js";
import { type ExportJobResumeResult } from "./job-resume-render-export.js";
import type { RoleResumeBinaryToolchain } from "./role-resume-render-export.js";
import type { RoleResumeDateFormat, RoleResumeExportFormat, RoleResumePageSize, RoleResumeRenderProfileName } from "./role-resume-render-schemas.js";
export declare const JOB_WORKFLOW_SCHEMA_VERSION: 1;
export declare const JOB_WORKFLOW_STAGES: readonly ["target", "analysis", "requirements", "evidence-pin", "evidence-review", "evidence-snapshot", "evidence-mapping", "coverage", "assessment", "planning", "scaffold", "draft-proposal", "draft-review", "approved-draft", "composition", "export"];
export type JobWorkflowStage = typeof JOB_WORKFLOW_STAGES[number];
export type JobWorkflowState = "not-started" | "running" | "paused" | "blocked" | "ready-to-continue" | "ready-to-finalize" | "complete" | "invalid";
export type JobWorkflowStageStatus = "missing" | "current" | "stale" | "invalid" | "incompatible" | "blocked" | "human-action-required";
export type JobWorkflowAction = "reused" | "built" | "rebuilt" | "paused" | "skipped" | "failed";
export interface JobWorkflowStageState {
    stage: JobWorkflowStage;
    label: string;
    status: JobWorkflowStageStatus;
    detail: string;
    reasons: string[];
}
export interface JobWorkflowStageResult {
    stage: JobWorkflowStage;
    result: JobWorkflowAction;
    detail: string;
}
export interface JobWorkflowBlocker {
    code: string;
    stage: JobWorkflowStage;
    message: string;
}
export interface JobWorkflowReviewGate {
    batchId?: string;
    workspacePath?: string;
    selectedClaimCount: number;
    pendingClaimCount: number;
    status: "missing" | "current" | "stale" | "invalid";
}
export interface JobWorkflowStatus {
    schemaVersion: typeof JOB_WORKFLOW_SCHEMA_VERSION;
    target: {
        id: string;
        type: "job";
        title: string;
        company?: string;
        location?: string;
        workingModel?: string;
        jobDescriptionPath: string;
        jobDescriptionSha256: string;
    };
    requirementSource: JobRequirementInputType;
    currentStage: JobWorkflowStage;
    overallState: JobWorkflowState;
    blocker?: JobWorkflowBlocker;
    humanActionRequired?: string;
    nextCommand: string;
    evidenceSnapshot: {
        snapshotId?: string;
        status: "missing" | "current" | "stale" | "invalid" | "incompatible";
        eligibleJobEvidenceCount: number;
    };
    availableSnapshots: EvidenceSnapshotListEntry[];
    reviewGate?: JobWorkflowReviewGate;
    currentProposalId?: string;
    currentReviewId?: string;
    currentExportFormats: RoleResumeExportFormat[];
    stages: JobWorkflowStageState[];
}
export interface RunJobWorkflowOptions {
    requirementSource?: JobRequirementInputType;
    snapshotId?: string;
    upgradeSnapshotId?: string;
    providerName?: string;
    offline?: boolean;
    rebuildStale?: boolean;
    dryRun?: boolean;
    provider?: InterpretationModelProvider;
    environment?: NodeJS.ProcessEnv;
}
export interface JobWorkflowRunResult {
    mode: "run" | "continue";
    dryRun: boolean;
    status: JobWorkflowStatus;
    stageResults: JobWorkflowStageResult[];
}
export interface FinalizeJobWorkflowOptions {
    profile?: RoleResumeRenderProfileName;
    pageSize?: RoleResumePageSize;
    dateFormat?: RoleResumeDateFormat;
    formats?: RoleResumeExportFormat[];
    outputDir?: string;
    rebuildStale?: boolean;
    dryRun?: boolean;
    toolchain?: RoleResumeBinaryToolchain;
}
export interface FinalizeJobWorkflowResult {
    dryRun: boolean;
    status: JobWorkflowStatus;
    result: "completed" | "already-current" | "partial-failure" | "paused";
    compositionResult?: "created" | "rebuilt" | "already-current";
    succeeded: ExportJobResumeResult[];
    failed: Array<{
        format: RoleResumeExportFormat;
        error: string;
    }>;
    stageResults: JobWorkflowStageResult[];
}
type InspectionOptions = {
    requirementSource?: JobRequirementInputType;
    renderOptions?: JobResumeRenderOptions;
};
export declare function createGuidedJob(workspace: string, input: JobTargetInput, options?: TargetCreationOptions): Promise<TargetCreationResult>;
export declare function inspectJobWorkflow(workspace: string, targetId: string, options?: InspectionOptions): Promise<JobWorkflowStatus>;
export declare function runJobWorkflow(workspace: string, targetId: string, options?: RunJobWorkflowOptions): Promise<JobWorkflowRunResult>;
export declare function continueJobWorkflow(workspace: string, targetId: string, options?: RunJobWorkflowOptions): Promise<JobWorkflowRunResult>;
export declare function finalizeJobWorkflow(workspace: string, targetId: string, options?: FinalizeJobWorkflowOptions): Promise<FinalizeJobWorkflowResult>;
export declare function formatGuidedJobCreation(result: TargetCreationResult): string;
export declare function formatJobWorkflowStatus(status: JobWorkflowStatus, options?: {
    verbose?: boolean;
}): string;
export declare function formatJobWorkflowRunResult(result: JobWorkflowRunResult): string;
export declare function formatFinalizeJobWorkflowResult(result: FinalizeJobWorkflowResult): string;
export declare function formatJobWorkflowJson(value: unknown): string;
export {};
