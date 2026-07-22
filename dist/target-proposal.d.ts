import { type TargetInterpretationProposal } from "./schemas.js";
import { type InterpretationModelProvider } from "./model-provider.js";
export declare const PROPOSAL_PROMPT_TEMPLATE_ID = "target-interpretation-proposal";
export declare const PROPOSAL_PROMPT_TEMPLATE_VERSION = "1";
export declare const PROPOSAL_POLICY_VERSION = "1";
export interface ProposalGenerationOptions {
    provider?: InterpretationModelProvider;
    environment?: NodeJS.ProcessEnv;
    refresh?: boolean;
    now?: () => Date;
    promptTemplateVersion?: string;
    policyVersion?: string;
}
export interface ProposalGenerationResult {
    targetId: string;
    targetType: "role" | "job";
    proposalId: string;
    result: "created" | "cache-hit" | "validation-failed";
    proposalPath: string;
    manifestPath: string;
    rawResponsePath: string;
    proposedExpectationCount: number;
    validationIssueCount: number;
    requestFingerprint: string;
}
export interface ProposalStatus {
    proposalId: string;
    targetId: string;
    targetType: "role" | "job";
    proposalExists: boolean;
    manifestExists: boolean;
    rawResponseExists: boolean;
    proposalHashMatches: boolean | null;
    rawResponseHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    structuralAnalysisHashMatches: boolean | null;
    deterministicInterpretationHashMatches: boolean | null;
    roleProfileHashMatches: boolean | null;
    status: "current" | "stale" | "invalid";
    readyForReview: boolean;
    reasons: string[];
    proposalPath: string;
    manifestPath: string;
    rawResponsePath: string;
}
export interface ProposalListEntry {
    proposalId: string;
    targetId: string;
    status: ProposalStatus["status"];
    proposalStatus: TargetInterpretationProposal["status"];
    model: string;
    createdAt: string;
}
export declare function generateInterpretationProposal(workspace: string, targetId: string, options?: ProposalGenerationOptions): Promise<ProposalGenerationResult>;
export declare function replayInterpretationProposal(workspace: string, proposalId: string): Promise<{
    proposalId: string;
    originalSha256: string;
    replaySha256: string;
    matches: boolean;
}>;
export declare function showInterpretationProposal(workspace: string, proposalId: string): Promise<TargetInterpretationProposal>;
export declare function listInterpretationProposals(workspace: string, targetId: string): Promise<ProposalListEntry[]>;
export declare function getInterpretationProposalStatus(workspace: string, proposalId: string): Promise<ProposalStatus>;
export declare function formatProposalGenerationResult(result: ProposalGenerationResult): string;
export declare function formatProposalList(entries: ProposalListEntry[]): string;
export declare function formatProposalStatus(status: ProposalStatus): string;
export declare function renderProposalPrompt(normalizedInput: unknown, templateVersion?: string, policyVersion?: string): string;
export declare function stableJson(value: unknown): string;
export declare function proposalFileTimestamps(workspace: string, proposalId: string): Promise<{
    proposalMtimeMs: number;
    manifestMtimeMs: number;
    rawResponseMtimeMs: number;
}>;
