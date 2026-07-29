import { type EvidenceReviewBatch } from "./evidence-review-batch-schemas.js";
export interface EvidenceReviewBatchPaths {
    rootRelativePath: string;
    rootPath: string;
    batchRelativePath: string;
    batchPath: string;
    manifestRelativePath: string;
    manifestPath: string;
    templateRootRelativePath: string;
    templateRootPath: string;
}
export interface BuildEvidenceReviewBatchResult {
    batchId: string;
    targetId: string;
    result: "created" | "already-current" | "rebuilt";
    batchPath: string;
    manifestPath: string;
    candidateClaimCount: number;
    priorityCounts: {
        high: number;
        medium: number;
        low: number;
    };
    controlledReviewSubsetClaimIds: string[];
    templatePaths: string[];
}
export interface EvidenceReviewBatchStatus {
    batchId: string;
    targetId?: string;
    batchExists: boolean;
    manifestExists: boolean;
    batchHashMatches: boolean | null;
    inputsMatch: boolean | null;
    policyMatches: boolean | null;
    templatesMatch: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    batchPath?: string;
    manifestPath?: string;
}
export declare function buildEvidenceReviewBatch(workspace: string, targetId: string, options?: {
    rebuild?: boolean;
    subsetSize?: number;
    now?: () => Date;
}): Promise<BuildEvidenceReviewBatchResult>;
export declare function showEvidenceReviewBatch(workspace: string, batchId: string): Promise<EvidenceReviewBatch>;
export declare function listEvidenceReviewBatches(workspace: string): Promise<EvidenceReviewBatchStatus[]>;
export declare function getEvidenceReviewBatchStatus(workspace: string, batchId: string): Promise<EvidenceReviewBatchStatus>;
export declare function evidenceReviewBatchPaths(workspace: string, batchId: string): EvidenceReviewBatchPaths;
export declare function formatEvidenceReviewBatchResult(result: BuildEvidenceReviewBatchResult): string;
export declare function formatEvidenceReviewBatchStatus(status: EvidenceReviewBatchStatus): string;
export declare function formatEvidenceReviewBatchList(statuses: EvidenceReviewBatchStatus[]): string;
