import { type ApprovedTargetExpectation, type ApprovedTargetInterpretation, type EvidenceMatch, type EvidenceMatchConfidence, type EvidenceMatchCoverage, type EvidenceMatchType, type EvidenceMatchingCompleteness, type EvidenceMatchingWarning, type EvidenceSnapshot, type EvidenceSnapshotManifest, type EvidenceStrength, type ExpectationCoverageRecord, type ExpectationCoverageStatus, type ExpectationMatchProvenance, type MatchingManifest, type Target, type TargetEvidenceMatching, type TemporalRelevance } from "./schemas.js";
export declare const EVIDENCE_ELIGIBILITY_POLICY_VERSION = "2";
export declare const EVIDENCE_MATCHER_NAME = "target-evidence-matcher";
export declare const EVIDENCE_MATCHER_VERSION = "1";
export declare const EVIDENCE_MATCHING_POLICY_VERSION = "1";
export interface EvidenceMatcher {
    readonly name: string;
    readonly version: string;
    readonly mode: "manual" | "deterministic" | "model-assisted";
    readonly policyVersion: string;
    match(input: EvidenceMatchingInput): Promise<EvidenceMatchingResult>;
}
export interface EvidenceMatchingInput {
    target: Target;
    approvedInterpretation: ApprovedTargetInterpretation;
    evidenceSnapshot: EvidenceSnapshot;
}
export interface EvidenceMatchingResult {
    matches: EvidenceMatch[];
    coverage: ExpectationCoverageRecord[];
}
export interface MatchingContext {
    target: Target;
    targetSha256: string;
    approvedInterpretation: ApprovedTargetInterpretation;
    approvedInterpretationPath: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestPath: string;
    approvedInterpretationManifestSha256: string;
    eligibleExpectations: ApprovedTargetExpectation[];
    snapshot: EvidenceSnapshot;
    snapshotPath: string;
    snapshotManifest: EvidenceSnapshotManifest;
    snapshotManifestPath: string;
    snapshotManifestSha256: string;
}
export interface ManualMatchInput {
    expectationId: string;
    evidenceIds: string[];
    matchType: EvidenceMatchType;
    coverage: EvidenceMatchCoverage;
    evidenceStrength: EvidenceStrength;
    temporalRelevance: TemporalRelevance;
    matchConfidence: EvidenceMatchConfidence;
    rationale: string;
    limitations?: string[];
    notes?: string[];
}
export interface ManualMatchResult {
    match: EvidenceMatch;
    result: "created";
    manualPath: string;
    manualManifestPath: string;
    approvedPath: string;
}
export interface ApprovedMatchingStatus {
    targetId: string;
    targetType: "role" | "job";
    matchingExists: boolean;
    manifestExists: boolean;
    matchingHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    approvedInterpretationHashMatches: boolean | null;
    approvedInterpretationManifestHashMatches: boolean | null;
    evidenceSnapshotManifestHashMatches: boolean | null;
    eligibleEvidenceSetHashMatches: boolean | null;
    manualStoreHashMatches: boolean | null;
    policyVersionMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    matchingPath: string;
    manifestPath: string;
}
export declare function loadMatchingContext(workspace: string, targetId: string, options?: {
    persistSnapshot?: boolean;
    rebuildSnapshot?: boolean;
    now?: () => Date;
}): Promise<MatchingContext>;
export declare function calculateEvidenceSnapshot(workspace: string, now?: (() => Date) | undefined, targetType?: "role" | "job"): Promise<EvidenceSnapshot>;
export declare function addManualEvidenceMatch(workspace: string, targetId: string, input: ManualMatchInput, options?: {
    now?: () => Date;
}): Promise<ManualMatchResult>;
export declare function removeManualEvidenceMatch(workspace: string, matchId: string, options?: {
    reason?: string;
    now?: () => Date;
}): Promise<void>;
export declare function listManualEvidenceMatches(workspace: string, targetId: string): Promise<EvidenceMatch[]>;
export declare function showManualEvidenceMatch(workspace: string, matchId: string): Promise<EvidenceMatch>;
export declare function showApprovedEvidenceMatching(workspace: string, targetId: string): Promise<TargetEvidenceMatching>;
export declare function getApprovedEvidenceMatchingStatus(workspace: string, targetId: string): Promise<ApprovedMatchingStatus>;
export declare function expectationProvenance(context: MatchingContext, expectation: ApprovedTargetExpectation): ExpectationMatchProvenance;
export declare function deriveCoverage(targetId: string, expectations: ApprovedTargetExpectation[], approvedMatches: EvidenceMatch[], explicitStatuses?: Map<string, ExpectationCoverageStatus>, proposedMatchIds?: Map<string, string[]>): ExpectationCoverageRecord[];
export declare function matchingCompleteness(coverage: ExpectationCoverageRecord[]): EvidenceMatchingCompleteness;
export declare function matchingWarnings(targetId: string, coverage: ExpectationCoverageRecord[], eligibleEvidenceCount: number): EvidenceMatchingWarning[];
export declare function manualMatchId(targetId: string, expectationId: string, evidenceIds: string[], matchType: EvidenceMatchType): string;
export declare function coverageId(targetId: string, expectationId: string): string;
export declare function formatManualMatchResult(result: ManualMatchResult): string;
export declare function formatManualMatchList(matches: EvidenceMatch[]): string;
export declare function formatApprovedMatchingStatus(status: ApprovedMatchingStatus): string;
export declare function writeApprovedMatching(workspace: string, context: MatchingContext, matches: EvidenceMatch[], explicitCoverage: Map<string, ExpectationCoverageStatus>, dependencies: {
    proposalId?: string;
    proposalSha256?: string;
    reviewSha256?: string;
    manualStoreSha256?: string;
}, options?: {
    rebuild?: boolean;
    now?: () => Date;
    proposedMatchIds?: Map<string, string[]>;
}): Promise<{
    matching: TargetEvidenceMatching;
    manifest: MatchingManifest;
    result: "created" | "rebuilt" | "already-current";
}>;
