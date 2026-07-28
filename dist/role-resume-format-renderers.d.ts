import type { RoleResumeRenderBlock, RoleResumeRenderDocument } from "./role-resume-render-schemas.js";
export declare const ROLE_RESUME_MARKDOWN_RENDERER_VERSION = "1";
export declare const ROLE_RESUME_HTML_RENDERER_VERSION = "1";
export declare const ROLE_RESUME_DOCX_RENDERER_VERSION = "1";
export declare const ROLE_RESUME_PDF_RENDERER_VERSION = "1";
export interface ResumeRenderBlockLike {
    type: RoleResumeRenderBlock["type"];
    text: string;
    keepWithNext: boolean;
    avoidBreakInside: boolean;
}
export interface ResumeRenderSectionLike {
    heading: string | null;
    blocks: ResumeRenderBlockLike[];
}
export interface ResumeRenderDocumentLike {
    profile: RoleResumeRenderDocument["profile"];
    metadata: Pick<RoleResumeRenderDocument["metadata"], "documentTitle" | "language" | "direction">;
    sections: ResumeRenderSectionLike[];
}
export declare function renderRoleResumeMarkdown(document: ResumeRenderDocumentLike): string;
export declare function renderRoleResumeHtml(document: ResumeRenderDocumentLike): string;
export declare function canonicalVisibleSegments(document: ResumeRenderDocumentLike): string[];
export declare function canonicalVisibleText(document: ResumeRenderDocumentLike): string;
export declare function extractVisibleTextFromMarkdown(markdown: string): string;
export declare function extractVisibleTextFromHtml(html: string): string;
export declare function normalizeVisibleText(value: string): string;
export declare function visibleTextEquivalent(document: ResumeRenderDocumentLike, extractedText: string): boolean;
export declare function firstAndLastMarkers(document: ResumeRenderDocumentLike): {
    first: string;
    last: string;
};
export declare function escapeHtml(value: string): string;
