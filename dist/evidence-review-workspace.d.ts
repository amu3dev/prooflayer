export declare const EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME = "evidence-review-workspace-renderer";
export declare const EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION = "3";
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
