import { type RoleKey, type RoleVariantDefinition } from "./role-variants.js";
import type { Claim, EvidenceItem } from "./schemas.js";
export declare const VARIANTS_ROOT = "outputs/variants";
export declare const OUTPUT_MANIFEST_FILE = "outputs/output-manifest.json";
export type RankedClaim = {
    claim: Claim;
    score: number;
};
export type VariantGenerationManifest = {
    schemaVersion: 1;
    outputId: string;
    roleKey: RoleKey;
    displayName: string;
    generatedAt: string;
    profileFingerprint: string;
    latestRefreshId?: string;
    generatedFiles: string[];
    claimIdsUsed: string[];
    evidenceIdsUsed: string[];
    countsByApprovalStatus: Record<Claim["approvalStatus"], number>;
    countsByOutputReadiness: Record<Claim["outputReadiness"], number>;
    warnings: string[];
    draft: true;
    publicationStatus: "draft";
    freshness: "current" | "stale";
};
export type OutputManifestEntry = {
    id: string;
    variantRoleKey: RoleKey;
    generatedFiles: string[];
    generatedAt: string;
    profileFingerprint: string;
    claimIdsUsed: string[];
    evidenceIdsUsed: string[];
    publicationStatus: "draft" | "final" | "export";
    freshness: "current" | "stale";
    sourceMarkdownPath?: string;
    sourceMarkdownHash?: string;
    sourceArtifactId?: string;
};
export type OutputManifest = {
    schemaVersion: 1;
    updatedAt: string;
    outputs: OutputManifestEntry[];
};
export type VariantStatus = {
    roleKey: RoleKey;
    displayName: string;
    draft: VariantOutputState;
    final: VariantOutputState & {
        readiness?: "ready" | "not_ready";
    };
    export: VariantOutputState;
};
export type VariantOutputState = {
    generated: boolean;
    freshness: "current" | "stale" | "not_generated";
    generatedAt?: string;
    path: string;
};
export declare function generateRoleVariant(workspace: string, roleKey: RoleKey, now?: Date): Promise<VariantGenerationManifest>;
export declare function generateAllRoleVariants(workspace: string): Promise<VariantGenerationManifest[]>;
export declare function selectClaimsForVariant(variant: RoleVariantDefinition, claims: Claim[], evidence: EvidenceItem[], limit?: number): RankedClaim[];
export declare function rankClaimsForVariant(variant: RoleVariantDefinition, claims: Claim[]): RankedClaim[];
export declare function generalizeClaimForDraft(claim: Claim, supportingEvidence: EvidenceItem[], variant: RoleVariantDefinition): string;
export declare function listVariantStatuses(workspace: string, persist?: boolean): Promise<VariantStatus[]>;
export declare function formatVariantsSummary(statuses: VariantStatus[]): string;
