import type { RoleResumeRenderDocument } from "./role-resume-render-schemas.js";
export declare const ROLE_RESUME_MARKDOWN_RENDERER_VERSION = "1";
export declare const ROLE_RESUME_HTML_RENDERER_VERSION = "1";
export declare const ROLE_RESUME_DOCX_RENDERER_VERSION = "1";
export declare const ROLE_RESUME_PDF_RENDERER_VERSION = "1";
export declare function renderRoleResumeMarkdown(document: RoleResumeRenderDocument): string;
export declare function renderRoleResumeHtml(document: RoleResumeRenderDocument): string;
export declare function canonicalVisibleSegments(document: RoleResumeRenderDocument): string[];
export declare function canonicalVisibleText(document: RoleResumeRenderDocument): string;
export declare function extractVisibleTextFromMarkdown(markdown: string): string;
export declare function extractVisibleTextFromHtml(html: string): string;
export declare function normalizeVisibleText(value: string): string;
export declare function visibleTextEquivalent(document: RoleResumeRenderDocument, extractedText: string): boolean;
export declare function firstAndLastMarkers(document: RoleResumeRenderDocument): {
    first: string;
    last: string;
};
export declare function escapeHtml(value: string): string;
