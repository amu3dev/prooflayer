import { EvidenceReviewInputTemplateSchema, type EvidenceReviewBatch, type EvidenceReviewBatchManifest } from "./evidence-review-batch-schemas.js";
import { JobRequirementModelSchema, type JobRequirement } from "./job-requirement-schemas.js";
import { type Claim, type EvidenceItem, type JobTarget, type Source } from "./schemas.js";
export declare const EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME = "evidence-review-workspace-renderer";
export declare const EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION = "3";
export type EvidenceReviewBatchClaim = EvidenceReviewBatch["claims"][number];
export interface EvidenceReviewWorkspaceClaimData {
    entry: EvidenceReviewBatchClaim;
    claim: Claim;
    evidence: EvidenceItem[];
    sources: Source[];
    requirements: JobRequirement[];
    template: ReturnType<typeof EvidenceReviewInputTemplateSchema.parse>;
    templateId: string;
    templatePath: string;
    templateSha256: string;
    claimRecordSha256: string;
    evidenceSetSha256: string;
    provenanceSetSha256: string;
    requirementSetSha256: string;
    normalizedInputSha256: string;
    renderId: string;
}
export interface EvidenceReviewWorkspaceData {
    batch: EvidenceReviewBatch;
    batchManifest: EvidenceReviewBatchManifest;
    batchSha256: string;
    batchManifestSha256: string;
    target: JobTarget;
    targetSha256: string;
    requirementModel: ReturnType<typeof JobRequirementModelSchema.parse>;
    requirementModelSha256: string;
    requirementManifestSha256: string;
    claimsSha256: string;
    evidenceSha256: string;
    sourcesSha256: string;
    claims: EvidenceReviewWorkspaceClaimData[];
}
export interface EvidenceReviewWorkspacePaths {
    rootRelativePath: string;
    rootPath: string;
    indexRelativePath: string;
    indexPath: string;
    indexManifestRelativePath: string;
    indexManifestPath: string;
}
export interface RenderEvidenceReviewWorkspaceResult {
    batchId: string;
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    renderId: string;
    indexPath: string;
    indexManifestPath: string;
    claimWorkspaceCount: number;
    claimWorkspacePaths: string[];
}
export interface EvidenceReviewWorkspaceStatus {
    batchId: string;
    targetId?: string;
    workspaceExists: boolean;
    indexExists: boolean;
    indexManifestExists: boolean;
    outputHashesMatch: boolean | null;
    manifestSetMatches: boolean | null;
    inputsMatch: boolean | null;
    rendererMatches: boolean | null;
    claimWorkspaceCount: number;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    indexPath: string;
    indexManifestPath: string;
}
export declare function renderEvidenceReviewWorkspace(workspace: string, batchId: string, options?: {
    rebuild?: boolean;
    now?: () => Date;
}): Promise<RenderEvidenceReviewWorkspaceResult>;
export declare function showEvidenceReviewWorkspace(workspace: string, batchId: string): Promise<string>;
export declare function getEvidenceReviewWorkspaceStatus(workspace: string, batchId: string): Promise<EvidenceReviewWorkspaceStatus>;
export declare function evidenceReviewWorkspacePaths(workspace: string, batchId: string): EvidenceReviewWorkspacePaths;
export declare function formatEvidenceReviewWorkspaceResult(result: RenderEvidenceReviewWorkspaceResult): string;
export declare function formatEvidenceReviewWorkspaceStatus(status: EvidenceReviewWorkspaceStatus): string;
export declare function loadEvidenceReviewWorkspaceData(workspace: string, batchId: string): Promise<EvidenceReviewWorkspaceData>;
export declare function evidenceReviewSelectionReason(entry: EvidenceReviewBatchClaim): string;
