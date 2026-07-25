import { type RoleResumeExportFormat, type RoleResumeExportManifest, type RoleResumeExportValidationSummary, type RoleResumeRenderDocument } from "./role-resume-render-schemas.js";
import { type RoleResumeRenderOptions } from "./role-resume-rendering.js";
export interface RoleResumeExportOptions extends RoleResumeRenderOptions {
    format: RoleResumeExportFormat;
    outputDir?: string;
    toolchain?: RoleResumeBinaryToolchain;
}
export interface RoleResumeBinaryToolchain {
    createDocx(input: {
        markdownPath: string;
        outputPath: string;
        document: RoleResumeRenderDocument;
        temporaryDirectory: string;
    }): Promise<void>;
    createPdf(input: {
        htmlPath: string;
        outputPath: string;
        document: RoleResumeRenderDocument;
        temporaryDirectory: string;
    }): Promise<void>;
    extractDocxText(filePath: string): Promise<string>;
    extractPdf(filePath: string, expectedPageSize: RoleResumeRenderDocument["profile"]["page"]["size"]): Promise<{
        text: string;
        pageCount: number;
        pageSizeVerified: boolean;
    }>;
}
export interface ExportRoleResumeResult {
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
export interface ExportAllRoleResumeResult {
    targetId: string;
    canonicalDocumentId: string;
    succeeded: ExportRoleResumeResult[];
    failed: Array<{
        format: RoleResumeExportFormat;
        error: string;
    }>;
}
export interface RoleResumeExportStatus {
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
export declare function exportRoleResume(workspace: string, targetId: string, options: RoleResumeExportOptions): Promise<ExportRoleResumeResult>;
export declare function exportAllRoleResume(workspace: string, targetId: string, options: Omit<RoleResumeExportOptions, "format">): Promise<ExportAllRoleResumeResult>;
export declare function listRoleResumeExports(workspace: string, targetId: string): Promise<RoleResumeExportManifest[]>;
export declare function showRoleResumeExport(workspace: string, exportId: string): Promise<RoleResumeExportManifest>;
export declare function getRoleResumeExportStatus(workspace: string, exportId: string): Promise<RoleResumeExportStatus>;
export declare function validateStoredRoleResumeExport(workspace: string, exportId: string, toolchain?: RoleResumeBinaryToolchain): Promise<RoleResumeExportValidationSummary>;
export declare function formatExportRoleResumeResult(result: ExportRoleResumeResult): string;
export declare function formatExportAllRoleResumeResult(result: ExportAllRoleResumeResult): string;
export declare function formatRoleResumeExportList(manifests: RoleResumeExportManifest[]): string;
export declare function formatRoleResumeExportStatus(status: RoleResumeExportStatus): string;
export declare function deterministicResumeFilename(document: RoleResumeRenderDocument, format: RoleResumeExportFormat): string;
export declare function normalizeOutputDirectory(value?: string): string;
export declare function validateRoleResumeOutput(document: RoleResumeRenderDocument, format: RoleResumeExportFormat, outputPath: string, toolchain: RoleResumeBinaryToolchain, exportId: string): Promise<RoleResumeExportValidationSummary>;
export declare function defaultRoleResumeBinaryToolchain(): RoleResumeBinaryToolchain;
