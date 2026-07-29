import { type EvidenceClaimReview, type EvidenceClaimReviewInput, type EvidenceClaimReviewManifest, type EvidenceClaimReviewSnapshotProjection } from "./evidence-claim-review-schemas.js";
export interface EvidenceClaimReviewPaths {
    rootRelativePath: string;
    rootPath: string;
    reviewRelativePath: string;
    reviewPath: string;
    manifestRelativePath: string;
    manifestPath: string;
}
export interface CreateEvidenceClaimReviewResult {
    reviewId: string;
    claimId: string;
    result: "created" | "already-current";
    status: "current";
    reviewPath: string;
    manifestPath: string;
    decision: EvidenceClaimReview["decision"];
    eligibleForRoleMatching: boolean;
    eligibleForJobMapping: boolean;
    approvedProjectionId?: string;
}
export interface EvidenceClaimReviewStatus {
    claimId: string;
    reviewId?: string;
    reviewExists: boolean;
    manifestExists: boolean;
    reviewHashMatches: boolean | null;
    claimHashMatches: boolean | null;
    evidenceHashMatches: boolean | null;
    provenanceHashMatches: boolean | null;
    policyMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid" | "superseded";
    supersededByReviewId?: string;
    reasons: string[];
    reviewPath?: string;
    manifestPath?: string;
}
export interface EvidenceClaimReviewListEntry {
    claimId: string;
    effectiveReviewId?: string;
    status: EvidenceClaimReviewStatus["status"];
    decision?: EvidenceClaimReview["decision"];
    eligibleForRoleMatching?: boolean;
    eligibleForJobMapping?: boolean;
    versionCount: number;
}
export interface LoadedEffectiveEvidenceClaimReview {
    review: EvidenceClaimReview;
    manifest: EvidenceClaimReviewManifest;
    reviewSha256: string;
    projection: EvidenceClaimReviewSnapshotProjection;
}
export declare function readEvidenceClaimReviewInputFile(filePath: string): Promise<EvidenceClaimReviewInput>;
export declare function createEvidenceClaimReview(workspace: string, claimId: string, rawInput: EvidenceClaimReviewInput, options?: {
    now?: () => Date;
}): Promise<CreateEvidenceClaimReviewResult>;
export declare function showEvidenceClaimReview(workspace: string, claimId: string): Promise<EvidenceClaimReview>;
export declare function listEvidenceClaimReviews(workspace: string): Promise<EvidenceClaimReviewListEntry[]>;
export declare function getEvidenceClaimReviewStatus(workspace: string, claimId: string, requestedReviewId?: string): Promise<EvidenceClaimReviewStatus>;
export declare function loadEffectiveEvidenceClaimReviews(workspace: string): Promise<Map<string, LoadedEffectiveEvidenceClaimReview>>;
export declare function evidenceClaimReviewPaths(workspace: string, claimId: string, reviewId: string): EvidenceClaimReviewPaths;
export declare function formatEvidenceClaimReviewResult(result: CreateEvidenceClaimReviewResult): string;
export declare function formatEvidenceClaimReviewStatus(status: EvidenceClaimReviewStatus): string;
export declare function formatEvidenceClaimReviewList(entries: EvidenceClaimReviewListEntry[]): string;
