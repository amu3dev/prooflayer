import { type RoleResumeBinaryToolchain } from "./role-resume-render-export.js";
import { type JobResumeExportManifest, type JobResumeRenderDocument } from "./job-resume-render-schemas.js";
import { type JobResumeRenderOptions } from "./job-resume-rendering.js";
import { type RoleResumeExportFormat, type RoleResumeExportValidationSummary } from "./role-resume-render-schemas.js";
export interface JobResumeExportOptions extends JobResumeRenderOptions {
    format: RoleResumeExportFormat;
    outputDir?: string;
    toolchain?: RoleResumeBinaryToolchain;
}
export interface ExportJobResumeResult {
    targetId: string;
    exportId: string;
    format: RoleResumeExportFormat;
    result: "created" | "rebuilt" | "already-current";
    outputPath: string;
    manifestPath: string;
    sourceMapPath: string;
    outputSha256: string;
    outputSizeBytes: number;
    visibleTextEquivalent: boolean;
    pageCount?: number;
}
export interface ExportAllJobResumeResult {
    targetId: string;
    canonicalDocumentId: string;
    succeeded: ExportJobResumeResult[];
    failed: Array<{
        format: RoleResumeExportFormat;
        error: string;
    }>;
}
export interface JobResumeExportStatus {
    exportId: string;
    targetId: string;
    format?: RoleResumeExportFormat;
    outputExists: boolean;
    manifestExists: boolean;
    sourceMapExists: boolean;
    outputHashMatches: boolean | null;
    sourceMapHashMatches: boolean | null;
    canonicalDocumentCurrent: boolean | null;
    canonicalDocumentHashMatches: boolean | null;
    rendererVersionMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    validationStatus?: "valid" | "invalid";
    reasons: string[];
    outputPath?: string;
    manifestPath?: string;
    sourceMapPath?: string;
}
export declare function exportJobResume(workspace: string, targetId: string, options: JobResumeExportOptions): Promise<ExportJobResumeResult>;
export declare function exportAllJobResume(workspace: string, targetId: string, options: Omit<JobResumeExportOptions, "format">): Promise<ExportAllJobResumeResult>;
export declare function listJobResumeExports(workspace: string, targetId: string): Promise<JobResumeExportManifest[]>;
export declare function showJobResumeExport(workspace: string, exportId: string): Promise<JobResumeExportManifest>;
export declare function getJobResumeExportStatus(workspace: string, exportId: string): Promise<JobResumeExportStatus>;
export declare function validateStoredJobResumeExport(workspace: string, exportId: string, toolchain?: RoleResumeBinaryToolchain): Promise<RoleResumeExportValidationSummary>;
export declare function formatExportJobResumeResult(result: ExportJobResumeResult): string;
export declare function formatExportAllJobResumeResult(result: ExportAllJobResumeResult): string;
export declare function formatJobResumeExportList(manifests: JobResumeExportManifest[]): string;
export declare function formatJobResumeExportStatus(status: JobResumeExportStatus): string;
export declare function deterministicJobResumeFilename(document: JobResumeRenderDocument, format: RoleResumeExportFormat): string;
export declare function expectedJobResumeVisibleText(document: JobResumeRenderDocument): string;
