import { setRoleResumeDraftReviewDecision, type RoleResumeDraftReviewStatus } from "./role-resume-draft-review.js";
import { type ExportRoleResumeResult } from "./role-resume-render-export.js";
import type { InterpretationModelProvider } from "./model-provider.js";
import type { RoleResumeDraftProposal, RoleResumeDraftReview } from "./role-resume-draft-schemas.js";
import type { RoleResumeExportFormat } from "./role-resume-render-schemas.js";
import { type JobWorkflowStatus } from "./job-workflow.js";
import type { RoleTarget, Target } from "./schemas.js";
import { type JobTargetInput, type RoleTargetInput } from "./targets.js";
import { type ProductWorkflowActionName } from "./prooflayer-ui-request-scope.js";
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
    primaryAction?: {
        kind: "create" | "continue" | "review" | "approve" | "export" | "view" | "blocked";
        label: string;
        detail: string;
        method: "GET" | "POST";
        href: string;
        action?: ProductWorkflowActionName;
    };
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
        state: "proposal" | "review-in-progress" | "review-complete" | "approved";
        proposalId: string;
        sections: Array<{
            type: string;
            heading: string;
            items: string[];
        }>;
        items: string[];
        requiresHumanReview: boolean;
        warnings: string[];
        review?: Pick<RoleResumeDraftReviewStatus, "status" | "counts" | "unresolvedCount">;
    };
    exports?: Array<{
        format: RoleResumeExportFormat;
        exportId: string;
        status: string;
        outputPath?: string;
    }>;
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
export declare function continueRoleResumeJourney(workspace: string, targetId: string, specialization?: string, options?: {
    provider?: InterpretationModelProvider;
    now?: () => Date;
    rebuild?: boolean;
}): Promise<RoleJourneyProjection>;
export declare function inspectRoleResumeJourney(workspace: string, targetId?: string): Promise<RoleJourneyProjection>;
export declare function advanceRoleResumePreparation(workspace: string, targetId: string, options?: {
    provider?: InterpretationModelProvider;
    now?: () => Date;
    rebuild?: boolean;
}): Promise<{
    result: "advanced" | "paused" | "already-current";
    message?: string;
}>;
export declare function inspectRoleResumeDraftForProduct(workspace: string, targetId: string, proposalId?: string): Promise<{
    proposal: RoleResumeDraftProposal;
    review: RoleResumeDraftReview;
    reviewStatus: RoleResumeDraftReviewStatus;
}>;
export declare function setRoleResumeDraftReviewDecisionForProduct(workspace: string, targetId: string, proposalId: string, itemType: Parameters<typeof setRoleResumeDraftReviewDecision>[2], itemId: string, input: Parameters<typeof setRoleResumeDraftReviewDecision>[4]): Promise<RoleResumeDraftReviewStatus>;
export declare function completeRoleResumeDraftReviewForProduct(workspace: string, targetId: string, proposalId: string): Promise<RoleResumeDraftReviewStatus>;
export declare function approveRoleResumeDraftForProduct(workspace: string, targetId: string, proposalId: string): Promise<{
    targetId: string;
    proposalId: string;
    result: string;
}>;
export declare function exportRoleResumeForProduct(workspace: string, targetId: string, options?: {
    rebuild?: boolean;
    now?: () => Date;
}): Promise<ExportRoleResumeResult[]>;
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
