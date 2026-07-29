import { type TargetEvidencePin, type TargetEvidencePinManifest } from "./evidence-pin-schemas.js";
import { type LoadedEvidenceSnapshot } from "./evidence-snapshots.js";
import type { Target } from "./schemas.js";
export interface TargetEvidencePinPaths {
    rootRelativePath: string;
    rootPath: string;
    pinRelativePath: string;
    pinPath: string;
    manifestRelativePath: string;
    manifestPath: string;
    targetRelativePath: string;
    targetPath: string;
}
export interface TargetEvidencePinResult {
    targetId: string;
    targetType: Target["type"];
    snapshotId: string;
    result: "pinned" | "upgraded" | "already-current";
    pinPath: string;
    manifestPath: string;
    snapshotPath: string;
    snapshotContentSha256: string;
    eligibleRoleEvidenceCount: number;
    eligibleJobEvidenceCount: number;
}
export interface TargetEvidencePinStatus {
    targetId: string;
    targetType: Target["type"] | null;
    pinExists: boolean;
    manifestExists: boolean;
    targetHashMatches: boolean | null;
    pinHashMatches: boolean | null;
    snapshotStatus: "missing" | "current" | "invalid" | "incompatible" | null;
    snapshotContentHashMatches: boolean | null;
    snapshotManifestHashMatches: boolean | null;
    identityMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid" | "incompatible";
    reasons: string[];
    pinPath: string | null;
    manifestPath: string | null;
    snapshotId: string | null;
}
export interface LoadedTargetEvidencePin {
    pin: Readonly<TargetEvidencePin>;
    manifest: Readonly<TargetEvidencePinManifest>;
    snapshot: LoadedEvidenceSnapshot;
    paths: TargetEvidencePinPaths;
}
export declare function pinTargetEvidenceSnapshot(workspace: string, targetId: string, snapshotId: string, options?: {
    now?: () => Date;
}): Promise<TargetEvidencePinResult>;
export declare function upgradeTargetEvidenceSnapshot(workspace: string, targetId: string, snapshotId: string, options?: {
    now?: () => Date;
}): Promise<TargetEvidencePinResult>;
export declare function getTargetEvidencePinStatus(workspace: string, targetId: string): Promise<TargetEvidencePinStatus>;
export declare function loadTargetEvidencePin(workspace: string, targetId: string): Promise<LoadedTargetEvidencePin>;
export declare function targetEvidencePinPaths(workspace: string, target: Target): TargetEvidencePinPaths;
export declare function formatTargetEvidencePinResult(result: TargetEvidencePinResult): string;
export declare function formatTargetEvidencePinStatus(status: TargetEvidencePinStatus): string;
