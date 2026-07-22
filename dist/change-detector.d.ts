import type { PrivacyFinding } from "./privacy.js";
import type { CareerProfile, Claim, EvidenceItem, Source, Visibility } from "./schemas.js";
export declare const UPDATE_BASELINE_VERSION = 1;
export type TrustCounts = {
    approved: number;
    needsConfirmation: number;
    blocked: number;
    resumeReady: number;
    genericOnly: number;
    internalOnly: number;
    doNotUse: number;
};
export type PrivacyCounts = {
    high: number;
    medium: number;
    low: number;
};
export type SourceSnapshot = {
    key: string;
    type: Source["type"];
    normalizedPath: string;
    versionHash: string;
    visibility: Visibility;
    status: Source["status"];
    sourceFamily: string;
};
export type EvidenceSnapshot = {
    key: string;
    versionHash: string;
    category: EvidenceItem["category"];
    parentContext: string;
    visibility: Visibility;
    confidence: EvidenceItem["confidence"];
    sensitivityCount: number;
};
export type ClaimSnapshot = {
    key: string;
    versionHash: string;
    type: Claim["type"];
    parentContext: string;
    approvalStatus: Claim["approvalStatus"];
    outputReadiness: Claim["outputReadiness"];
    factualConfidence: Claim["factualConfidence"];
    corroborationLevel: Claim["corroborationLevel"];
    publicSafe: boolean;
    metricStatus: Claim["metricStatus"];
};
export type AreaSnapshot = {
    key: string;
    versionHash: string;
};
export type ProfileAreaSnapshots = {
    roles: AreaSnapshot[];
    projects: AreaSnapshot[];
    skills: AreaSnapshot[];
    domains: AreaSnapshot[];
};
export type RefreshBaseline = {
    schemaVersion: typeof UPDATE_BASELINE_VERSION;
    successfulRefreshAt: string;
    profileFingerprint: string;
    sources: SourceSnapshot[];
    evidence: EvidenceSnapshot[];
    claims: ClaimSnapshot[];
    profileAreas: ProfileAreaSnapshots;
    trustCounts: TrustCounts;
    privacyCounts: PrivacyCounts;
    independentSourceFamilies: number;
};
export type CollectionDelta<T> = {
    added: T[];
    removed: T[];
    changed: Array<{
        before: T;
        after: T;
    }>;
    unchanged: T[];
};
export type StatusTransition = {
    target: "source" | "evidence" | "claim";
    key: string;
    field: string;
    from: string | number | boolean;
    to: string | number | boolean;
};
export type UpdateImpact = {
    firstRefresh: boolean;
    sources: CollectionDelta<SourceSnapshot>;
    evidence: CollectionDelta<EvidenceSnapshot>;
    claims: CollectionDelta<ClaimSnapshot>;
    profileAreas: {
        roles: CollectionDelta<AreaSnapshot>;
        projects: CollectionDelta<AreaSnapshot>;
        skills: CollectionDelta<AreaSnapshot>;
        domains: CollectionDelta<AreaSnapshot>;
    };
    trustTransitions: StatusTransition[];
    privacyTransitions: StatusTransition[];
    trustCountsBefore: TrustCounts;
    trustCountsAfter: TrustCounts;
    privacyCountsBefore: PrivacyCounts;
    privacyCountsAfter: PrivacyCounts;
    profileFingerprintChanged: boolean;
};
export type KnowledgeState = {
    sources: Source[];
    evidenceItems: EvidenceItem[];
    claims: Claim[];
    profile: CareerProfile;
    privacyFindings: PrivacyFinding[];
};
export declare function createRefreshBaseline(state: KnowledgeState, successfulRefreshAt?: string): RefreshBaseline;
export declare function detectUpdateImpact(previous: RefreshBaseline | null, current: RefreshBaseline): UpdateImpact;
export declare function countChanges<T>(delta: CollectionDelta<T>): {
    added: number;
    removed: number;
    changed: number;
    unchanged: number;
};
export declare function sourceFamilyFor(source: Source): string;
