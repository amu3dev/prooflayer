import { type JobRequirementProposal } from "./job-requirement-schemas.js";
import { type InterpretationModelProvider } from "./model-provider.js";
export declare const JOB_REQUIREMENT_PROPOSAL_PROMPT_ID = "target-job-requirement-model-proposal";
export declare const JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION = "1";
export declare const JOB_REQUIREMENT_PROPOSAL_POLICY_VERSION = "1";
interface ProposalOptions {
    refresh?: boolean;
    now?: () => Date;
    provider?: InterpretationModelProvider;
    promptTemplateId?: string;
    promptTemplateVersion?: string;
    policyVersion?: string;
}
export interface GenerateJobRequirementProposalResult {
    proposalId: string;
    targetId: string;
    result: "generated" | "cached";
    proposalStatus: JobRequirementProposal["status"];
    proposalPath: string;
    manifestPath: string;
    proposedRequirementCount: number;
    validationIssueCount: number;
    providerCallMade: boolean;
}
export interface JobRequirementProposalStatus {
    proposalId: string;
    targetId: string;
    proposalExists: boolean;
    manifestExists: boolean;
    rawResponseExists: boolean;
    proposalHashMatches: boolean | null;
    rawResponseHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    sourceHashMatches: boolean | null;
    deterministicModelHashMatches: boolean | null;
    promptMatches: boolean | null;
    normalizedInputHashMatches: boolean | null;
    status: "current" | "stale" | "invalid";
    readyForReview: boolean;
    reasons: string[];
    proposalPath: string;
    manifestPath: string;
}
interface ProposalPaths {
    proposalRelativePath: string;
    proposalPath: string;
    manifestRelativePath: string;
    manifestPath: string;
    rawResponseRelativePath: string;
    rawResponsePath: string;
}
export declare function generateJobRequirementProposal(workspace: string, targetId: string, options?: ProposalOptions): Promise<GenerateJobRequirementProposalResult>;
export declare function showJobRequirementProposal(workspace: string, proposalId: string): Promise<JobRequirementProposal>;
export declare function listJobRequirementProposals(workspace: string, targetId: string): Promise<JobRequirementProposal[]>;
export declare function getJobRequirementProposalStatus(workspace: string, proposalId: string): Promise<JobRequirementProposalStatus>;
export declare function replayJobRequirementProposal(workspace: string, proposalId: string): Promise<{
    proposalId: string;
    originalSha256: string;
    replaySha256: string;
    matches: boolean;
}>;
export declare function formatJobRequirementProposalResult(result: GenerateJobRequirementProposalResult): string;
export declare function formatJobRequirementProposalList(proposals: JobRequirementProposal[]): string;
export declare function formatJobRequirementProposalStatus(status: JobRequirementProposalStatus): string;
export declare function locateJobRequirementProposal(workspace: string, proposalId: string): Promise<ProposalPaths & {
    targetId: string;
}>;
export {};
