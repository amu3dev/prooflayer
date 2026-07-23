import { type InterpretationModelProvider } from "./model-provider.js";
import { type ModelRoleResumePlanPayload, type RoleResumeContentPlan, type RoleResumePlanProposal } from "./role-resume-plan-schemas.js";
import { loadRoleResumePlanningContext } from "./role-resume-planning.js";
export declare const ROLE_RESUME_PLAN_PROMPT_TEMPLATE_ID = "target-role-resume-plan-proposal";
export declare const ROLE_RESUME_PLAN_PROMPT_TEMPLATE_VERSION = "1";
export declare const ROLE_RESUME_PLAN_PROMPT_POLICY_VERSION = "1";
export interface GenerateRoleResumePlanProposalOptions {
    refresh?: boolean;
    provider?: InterpretationModelProvider;
    now?: () => Date;
}
export interface GenerateRoleResumePlanProposalResult {
    targetId: string;
    proposalId: string;
    result: "created" | "cache-hit" | "validation-failed";
    proposalPath: string;
    manifestPath: string;
    rawResponsePath: string;
    validationIssueCount: number;
    requestFingerprint: string;
}
export interface RoleResumePlanProposalStatus {
    proposalId: string;
    targetId: string;
    proposalExists: boolean;
    manifestExists: boolean;
    rawResponseExists: boolean;
    proposalHashMatches: boolean | null;
    rawResponseHashMatches: boolean | null;
    deterministicPlanHashMatches: boolean | null;
    dependenciesMatch: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    readyForReview: boolean;
    reasons: string[];
}
export declare function generateRoleResumePlanProposal(workspace: string, targetId: string, options?: GenerateRoleResumePlanProposalOptions): Promise<GenerateRoleResumePlanProposalResult>;
export declare function showRoleResumePlanProposal(workspace: string, proposalId: string): Promise<RoleResumePlanProposal>;
export declare function listRoleResumePlanProposals(workspace: string, targetId: string): Promise<RoleResumePlanProposal[]>;
export declare function getRoleResumePlanProposalStatus(workspace: string, proposalId: string): Promise<RoleResumePlanProposalStatus>;
export declare function replayRoleResumePlanProposal(workspace: string, proposalId: string): Promise<{
    proposalId: string;
    originalSha256: string;
    replaySha256: string;
    matches: boolean;
}>;
export declare function renderRoleResumePlanPrompt(input: unknown): string;
export declare function formatRoleResumePlanProposalResult(result: GenerateRoleResumePlanProposalResult): string;
export declare function formatRoleResumePlanProposalList(proposals: RoleResumePlanProposal[]): string;
export declare function formatRoleResumePlanProposalStatus(status: RoleResumePlanProposalStatus): string;
export declare function assertRoleResumePlanProposalAgainstDeterministic(payload: ModelRoleResumePlanPayload, deterministic: RoleResumeContentPlan, context: Awaited<ReturnType<typeof loadRoleResumePlanningContext>>): void;
