import { type JobWorkflowStatus } from "./job-workflow.js";
import type { RoleTarget, Target } from "./schemas.js";
import { type JobTargetInput, type RoleTargetInput } from "./targets.js";
export interface ProductProgressStep {
    label: string;
    state: "complete" | "current" | "waiting" | "blocked";
    detail: string;
}
export interface RoleJourneyProjection {
    target?: RoleTarget;
    progress: ProductProgressStep[];
    careerReady: boolean;
    currentValue: string;
    blocker?: string;
    nextAction: string;
    understanding?: {
        state: "generated" | "generated-with-ambiguity" | "reviewed" | "stale" | "invalid";
        summary: string;
        sourceLabel: string;
        specialization: string;
        expectations: string[];
    };
    positioning?: {
        label: string;
        fit: "strong" | "credible" | "mixed" | "stretch" | "insufficient evidence";
        strongestThemes: Array<{
            theme: string;
            evidence: string;
        }>;
        weakerThemes: string[];
        gaps: string[];
        limitations: string[];
    };
    materialQuestion?: {
        question: string;
        options: Array<{
            id: string;
            label: string;
        }>;
        selectedOptionId: string;
    };
    draftPreview?: {
        items: string[];
        requiresHumanReview: true;
    };
    advanced: Array<{
        label: string;
        status: string;
    }>;
}
export interface JobJourneyProjection {
    target: Extract<Target, {
        type: "job";
    }>;
    workflow: JobWorkflowStatus;
    fit: {
        label: "strong" | "credible" | "mixed" | "stretch" | "insufficient evidence";
        statement: string;
        mandatory: {
            total: number;
            supported: number;
            partial: number;
        };
        preferred: {
            total: number;
            supported: number;
            partial: number;
        };
        strengths: string[];
        gaps: string[];
        limitations: string[];
    };
    progress: ProductProgressStep[];
    nextAction: string;
    advancedReviewBatchId?: string;
}
export interface AddCareerSourceInput {
    title: string;
    content: Uint8Array;
}
export declare function startRoleResumeJourney(workspace: string, input: RoleTargetInput): Promise<RoleJourneyProjection>;
export declare function continueRoleResumeJourney(workspace: string, targetId: string, specialization?: string): Promise<RoleJourneyProjection>;
export declare function inspectRoleResumeJourney(workspace: string, targetId?: string): Promise<RoleJourneyProjection>;
export declare function runProductJobJourney(workspace: string, targetId: string): Promise<JobJourneyProjection>;
export declare function createProductJobJourney(workspace: string, input: Omit<JobTargetInput, "file"> & {
    description: string;
}): Promise<JobJourneyProjection>;
export declare function inspectProductJobJourney(workspace: string, targetId: string): Promise<JobJourneyProjection>;
export declare function addCareerSource(workspace: string, input: AddCareerSourceInput): Promise<{
    path: string;
    result: "created" | "already-present";
}>;
export declare function existingProductTargets(workspace: string): Promise<{
    roles: RoleTarget[];
    jobs: Array<Extract<Target, {
        type: "job";
    }>>;
}>;
