import { type EvidenceFoundationSnapshot, type EvidenceSnapshotManifestV1 } from "./evidence-snapshot-schemas.js";
export interface EvidenceSnapshotPaths {
    rootRelativePath: string;
    rootPath: string;
    snapshotRelativePath: string;
    snapshotPath: string;
    manifestRelativePath: string;
    manifestPath: string;
}
export interface BuildEvidenceSnapshotResult {
    snapshotId: string;
    result: "created" | "already-current";
    snapshotPath: string;
    manifestPath: string;
    contentSha256: string;
    evidenceItemCount: number;
    claimCount: number;
    approvedClaimCount: number;
    eligibleRoleEvidenceCount: number;
    eligibleJobEvidenceCount: number;
    verifiedMetricCount: number;
    warningCount: number;
}
export interface EvidenceSnapshotStatus {
    snapshotId: string;
    snapshotExists: boolean;
    manifestExists: boolean;
    contentHashMatches: boolean | null;
    identityMatches: boolean | null;
    sourceInventoryHashMatches: boolean | null;
    recordHashesMatch: boolean | null;
    eligibilityConsistent: boolean | null;
    provenanceComplete: boolean | null;
    manifestMatches: boolean | null;
    status: "missing" | "current" | "invalid" | "incompatible";
    reasons: string[];
    snapshotPath: string;
    manifestPath: string;
}
export interface LoadedEvidenceSnapshot {
    snapshot: Readonly<EvidenceFoundationSnapshot>;
    manifest: Readonly<EvidenceSnapshotManifestV1>;
    paths: EvidenceSnapshotPaths;
    manifestSha256: string;
}
export interface EvidenceSnapshotListEntry {
    snapshotId: string;
    status: EvidenceSnapshotStatus["status"];
    contentSha256?: string;
    evidenceItemCount?: number;
    approvedClaimCount?: number;
    eligibleRoleEvidenceCount?: number;
    eligibleJobEvidenceCount?: number;
    createdAt?: string;
}
export declare function buildEvidenceSnapshot(workspace: string, options?: {
    now?: () => Date;
}): Promise<BuildEvidenceSnapshotResult>;
export declare function calculateEvidenceFoundationSnapshot(workspace: string): Promise<EvidenceFoundationSnapshot>;
export declare function getEvidenceSnapshotStatus(workspace: string, snapshotId: string): Promise<EvidenceSnapshotStatus>;
export declare function loadEvidenceSnapshot(workspace: string, snapshotId: string): Promise<LoadedEvidenceSnapshot>;
export declare function validateEvidenceSnapshot(workspace: string, snapshotId: string): Promise<EvidenceSnapshotStatus>;
export declare function listEvidenceSnapshots(workspace: string): Promise<EvidenceSnapshotListEntry[]>;
export declare function evidenceSnapshotPaths(workspace: string, snapshotId: string): EvidenceSnapshotPaths;
export declare function formatEvidenceSnapshotBuild(result: BuildEvidenceSnapshotResult): string;
export declare function formatEvidenceSnapshotList(entries: EvidenceSnapshotListEntry[]): string;
export declare function formatEvidenceSnapshotStatus(status: EvidenceSnapshotStatus): string;
