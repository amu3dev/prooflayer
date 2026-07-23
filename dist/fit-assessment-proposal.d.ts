import { type FitAssessmentProposal } from "./fit-assessment-schemas.js";
import { type InterpretationModelProvider } from "./model-provider.js";
export declare const ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_ID = "target-fit-assessment-proposal";
export declare const ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_VERSION = "1";
export declare const ASSESSMENT_PROPOSAL_POLICY_VERSION = "1";
export interface AssessmentProposalGenerationOptions {
    provider?: InterpretationModelProvider;
    environment?: NodeJS.ProcessEnv;
    refresh?: boolean;
    now?: () => Date;
    promptTemplateVersion?: string;
    policyVersion?: string;
}
export interface AssessmentProposalGenerationResult {
    targetId: string;
    targetType: "role" | "job";
    mode: "role-positioning" | "job-specific";
    proposalId: string;
    result: "created" | "cache-hit" | "validation-failed";
    proposalPath: string;
    manifestPath: string;
    rawResponsePath: string;
    proposedAssessmentCount: number;
    validationIssueCount: number;
    requestFingerprint: string;
}
export interface AssessmentProposalStatus {
    proposalId: string;
    targetId: string;
    targetType: "role" | "job";
    mode: "role-positioning" | "job-specific";
    status: "current" | "stale" | "invalid";
    readyForReview: boolean;
    proposalHashMatches: boolean | null;
    rawResponseHashMatches: boolean | null;
    deterministicAssessmentHashMatches: boolean | null;
    approvedInterpretationHashMatches: boolean | null;
    approvedMatchingHashMatches: boolean | null;
    evidenceSnapshotHashMatches: boolean | null;
    reasons: string[];
    proposalPath: string;
    manifestPath: string;
    rawResponsePath: string;
}
export declare function generateFitAssessmentProposal(workspace: string, targetId: string, options?: AssessmentProposalGenerationOptions): Promise<AssessmentProposalGenerationResult>;
export declare function showFitAssessmentProposal(workspace: string, proposalId: string): Promise<FitAssessmentProposal>;
export declare function listFitAssessmentProposals(workspace: string, targetId: string): Promise<FitAssessmentProposal[]>;
export declare function getFitAssessmentProposalStatus(workspace: string, proposalId: string): Promise<AssessmentProposalStatus>;
export declare function replayFitAssessmentProposal(workspace: string, proposalId: string): Promise<{
    proposalId: string;
    originalSha256: string;
    replaySha256: string;
    matches: boolean;
}>;
export declare function renderFitAssessmentPrompt(input: unknown, templateVersion?: string, policyVersion?: string): string;
export declare function formatFitAssessmentProposalResult(result: AssessmentProposalGenerationResult): string;
export declare function formatFitAssessmentProposalList(proposals: FitAssessmentProposal[]): string;
export declare function formatFitAssessmentProposalStatus(status: AssessmentProposalStatus): string;
export declare function fitAssessmentProposalFileTimestamps(workspace: string, proposalId: string): Promise<{
    proposal: number;
    manifest: number;
    raw: number;
}>;
