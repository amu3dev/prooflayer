import type {
  RoleResumeRenderBlock,
  RoleResumeRenderDocument,
  RoleResumeRenderSection,
} from "./role-resume-render-schemas.js";

export const ROLE_RESUME_MARKDOWN_RENDERER_VERSION = "1";
export const ROLE_RESUME_HTML_RENDERER_VERSION = "1";
export const ROLE_RESUME_DOCX_RENDERER_VERSION = "1";
export const ROLE_RESUME_PDF_RENDERER_VERSION = "1";

const BULLET_BLOCKS = new Set<RoleResumeRenderBlock["type"]>([
  "bullet",
  "capability",
  "technology",
  "leadership-capability",
  "education",
  "certification",
]);

export function renderRoleResumeMarkdown(document: RoleResumeRenderDocument): string {
  const sections = document.sections.map((section) => renderMarkdownSection(section));
  return `${sections.filter(Boolean).join("\n\n").trim()}\n`;
}

export function renderRoleResumeHtml(document: RoleResumeRenderDocument): string {
  const profile = document.profile;
  const pageSize = profile.page.size === "LETTER" ? "Letter" : "A4";
  const sections = document.sections.map((section) => renderHtmlSection(section)).join("\n");
  return `<!doctype html>
<html lang="${document.metadata.language}" dir="${document.metadata.direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(document.metadata.documentTitle)}</title>
  <style>
    @page { size: ${pageSize}; margin: ${profile.page.marginTopMm}mm ${profile.page.marginRightMm}mm ${profile.page.marginBottomMm}mm ${profile.page.marginLeftMm}mm; }
    * { box-sizing: border-box; }
    html { background: #fff; color: #111; }
    body { margin: 0 auto; max-width: 190mm; font-family: ${cssFont(profile.typography.baseFontFamily)}; font-size: ${profile.typography.baseFontSizePt}pt; line-height: ${profile.typography.lineHeight}; }
    h1, h2, h3, p, ul { margin-top: 0; }
    h1 { font-size: ${round(profile.typography.baseFontSizePt * profile.typography.headingScale * 1.18)}pt; line-height: 1.15; margin-bottom: ${profile.spacing.sectionAfterPt}pt; break-after: avoid; }
    h2 { font-size: ${round(profile.typography.baseFontSizePt * profile.typography.headingScale)}pt; line-height: 1.2; margin-bottom: ${profile.spacing.sectionAfterPt}pt; break-after: avoid; }
    h3 { font-size: ${round(profile.typography.baseFontSizePt * 1.04)}pt; line-height: 1.25; margin-bottom: ${profile.spacing.itemSpacingPt}pt; break-after: avoid; }
    section { margin-top: ${profile.spacing.sectionBeforePt}pt; margin-bottom: ${profile.spacing.sectionAfterPt}pt; }
    p { margin-bottom: ${profile.spacing.itemSpacingPt}pt; orphans: 2; widows: 2; }
    ul { margin-bottom: ${profile.spacing.itemSpacingPt}pt; padding-left: 18pt; }
    li { margin-bottom: ${profile.spacing.itemSpacingPt}pt; break-inside: avoid; }
    .keep-with-next { break-after: avoid; }
    .avoid-break { break-inside: avoid; }
    a { color: inherit; text-decoration: underline; overflow-wrap: anywhere; }
    @media print { html, body { background: #fff; } }
  </style>
</head>
<body>
<main>
${sections}
</main>
</body>
</html>
`;
}

export function canonicalVisibleSegments(document: RoleResumeRenderDocument): string[] {
  return document.sections.flatMap((section) => [
    ...(section.heading ? [section.heading] : []),
    ...section.blocks.map((block) => block.text),
  ]);
}

export function canonicalVisibleText(document: RoleResumeRenderDocument): string {
  return normalizeVisibleText(canonicalVisibleSegments(document).join("\n"));
}

export function extractVisibleTextFromMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  return normalizeVisibleText(lines.map((line) =>
    line
      .replace(/^#{1,6}\s+/, "")
      .replace(/^[-*+]\s+/, "")
      .replace(/\\([\\`*_[\]{}()#+.!>|-])/g, "$1"),
  ).join("\n"));
}

export function extractVisibleTextFromHtml(html: string): string {
  const body = html
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(?:h1|h2|h3|p|li|section|main)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return normalizeVisibleText(decodeHtml(body));
}

export function normalizeVisibleText(value: string): string {
  return value
    .normalize("NFC")
    .replace(/\u00a0/g, " ")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

export function visibleTextEquivalent(document: RoleResumeRenderDocument, extractedText: string): boolean {
  return canonicalVisibleText(document) === normalizeVisibleText(extractedText);
}

export function firstAndLastMarkers(document: RoleResumeRenderDocument) {
  const segments = canonicalVisibleSegments(document).filter(Boolean);
  return {
    first: segments[0] ?? "",
    last: segments.at(-1) ?? "",
  };
}

function renderMarkdownSection(section: RoleResumeRenderSection): string {
  const lines: string[] = [];
  if (section.heading) lines.push(`## ${escapeMarkdown(section.heading)}`);
  let bulletOpen = false;
  for (const block of section.blocks) {
    if (block.type === "headline") {
      bulletOpen = false;
      lines.push(`# ${escapeMarkdown(block.text)}`);
    } else if (block.type === "role-header" || block.type === "project-header") {
      bulletOpen = false;
      lines.push(`### ${escapeMarkdown(block.text)}`);
    } else if (BULLET_BLOCKS.has(block.type)) {
      bulletOpen = true;
      lines.push(`- ${escapeMarkdown(block.text)}`);
    } else {
      if (bulletOpen) lines.push("");
      bulletOpen = false;
      lines.push(escapeMarkdown(block.text));
    }
  }
  return stableBlankLines(lines);
}

function renderHtmlSection(section: RoleResumeRenderSection): string {
  const content: string[] = [];
  if (section.heading) content.push(`<h2>${escapeHtml(section.heading)}</h2>`);
  let bullets: string[] = [];
  const flushBullets = () => {
    if (!bullets.length) return;
    content.push(`<ul>\n${bullets.join("\n")}\n</ul>`);
    bullets = [];
  };
  for (const block of section.blocks) {
    const classes = [
      ...(block.keepWithNext ? ["keep-with-next"] : []),
      ...(block.avoidBreakInside ? ["avoid-break"] : []),
    ];
    const classAttribute = classes.length ? ` class="${classes.join(" ")}"` : "";
    const text = escapeHtml(block.text);
    if (block.type === "headline") {
      flushBullets();
      content.push(`<h1${classAttribute}>${text}</h1>`);
    } else if (block.type === "role-header" || block.type === "project-header") {
      flushBullets();
      content.push(`<h3${classAttribute}>${text}</h3>`);
    } else if (BULLET_BLOCKS.has(block.type)) {
      bullets.push(`<li${classAttribute}>${text}</li>`);
    } else {
      flushBullets();
      content.push(`<p${classAttribute}>${text}</p>`);
    }
  }
  flushBullets();
  return `<section>\n${content.join("\n")}\n</section>`;
}

function escapeMarkdown(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/([`*_[\]{}()#+.!>|])/g, "\\$1")
    .replace(/\n/g, "  \n");
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br>");
}

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function stableBlankLines(lines: string[]): string {
  return lines
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cssFont(value: string): string {
  return `"${value.replace(/["\\]/g, "")}", sans-serif`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
