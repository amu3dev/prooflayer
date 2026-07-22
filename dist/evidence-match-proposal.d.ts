import { type EvidenceMatchProposal } from "./schemas.js";
import { type InterpretationModelProvider } from "./model-provider.js";
export declare const MATCH_PROPOSAL_PROMPT_TEMPLATE_ID = "target-evidence-match-proposal";
export declare const MATCH_PROPOSAL_PROMPT_TEMPLATE_VERSION = "1";
export declare const MATCH_PROPOSAL_POLICY_VERSION = "1";
export interface MatchProposalGenerationOptions {
    provider?: InterpretationModelProvider;
    environment?: NodeJS.ProcessEnv;
    refresh?: boolean;
    now?: () => Date;
    promptTemplateVersion?: string;
    policyVersion?: string;
}
export interface MatchProposalGenerationResult {
    targetId: string;
    targetType: "role" | "job";
    proposalId: string;
    result: "created" | "cache-hit" | "validation-failed";
    proposalPath: string;
    manifestPath: string;
    rawResponsePath: string;
    proposedMatchCount: number;
    proposedCoverageCount: number;
    validationIssueCount: number;
    requestFingerprint: string;
}
export interface MatchProposalStatus {
    proposalId: string;
    targetId: string;
    targetType: "role" | "job";
    status: "current" | "stale" | "invalid";
    readyForReview: boolean;
    proposalHashMatches: boolean | null;
    rawResponseHashMatches: boolean | null;
    approvedInterpretationHashMatches: boolean | null;
    evidenceSnapshotManifestHashMatches: boolean | null;
    evidenceSnapshotHashMatches: boolean | null;
    reasons: string[];
    proposalPath: string;
    manifestPath: string;
    rawResponsePath: string;
}
export declare function generateEvidenceMatchProposal(workspace: string, targetId: string, options?: MatchProposalGenerationOptions): Promise<MatchProposalGenerationResult>;
export declare function showEvidenceMatchProposal(workspace: string, proposalId: string): Promise<EvidenceMatchProposal>;
export declare function listEvidenceMatchProposals(workspace: string, targetId: string): Promise<EvidenceMatchProposal[]>;
export declare function getEvidenceMatchProposalStatus(workspace: string, proposalId: string): Promise<MatchProposalStatus>;
export declare function replayEvidenceMatchProposal(workspace: string, proposalId: string): Promise<{
    proposalId: string;
    originalSha256: string;
    replaySha256: string;
    matches: boolean;
}>;
export declare function renderEvidenceMatchPrompt(input: unknown, templateVersion?: string, policyVersion?: string): string;
export declare function formatMatchProposalResult(result: MatchProposalGenerationResult): string;
export declare function formatMatchProposalList(proposals: EvidenceMatchProposal[]): string;
export declare function formatMatchProposalStatus(status: MatchProposalStatus): string;
export declare function matchProposalFileTimestamps(workspace: string, proposalId: string): Promise<{
    proposalMtimeMs: number;
    manifestMtimeMs: number;
    rawMtimeMs: number;
}>;
