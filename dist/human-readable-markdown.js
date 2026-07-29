export const HUMAN_READABLE_MARKDOWN_CONTRACT_NAME = "human-readable-markdown-contract";
export const HUMAN_READABLE_MARKDOWN_CONTRACT_VERSION = "1";
const DEFAULT_TITLE_LENGTH = 96;
export function renderDerivedMarkdownBanner(canonicalSource) {
    return [
        "> GENERATED, READ-ONLY VIEW",
        ">",
        `> This Markdown is a human-readable view derived from ${canonicalSource}.`,
        "> Canonical JSON remains the source of truth.",
        "> Editing this file does not change ProofLayer state.",
    ].join("\n");
}
export function deriveHumanTitle(value, fallback, maxLength = DEFAULT_TITLE_LENGTH) {
    const normalized = normalizeHumanText(value ?? "");
    if (!normalized)
        return fallback;
    const firstSentence = normalized.match(/^.*?(?:[.!?](?=\s|$)|$)/)?.[0]?.trim() || normalized;
    if (firstSentence.length <= maxLength)
        return firstSentence;
    const candidate = firstSentence.slice(0, Math.max(1, maxLength - 3)).trimEnd();
    const lastBoundary = candidate.lastIndexOf(" ");
    const shortened = lastBoundary >= Math.floor(maxLength * 0.55)
        ? candidate.slice(0, lastBoundary)
        : candidate;
    return `${shortened.replace(/[,:;\-]+$/u, "")}...`;
}
export function normalizeHumanText(value) {
    return value
        .replace(/\r\n?/g, "\n")
        .replace(/^\s*#{1,6}\s+/gm, "")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim();
}
export function escapeMarkdownInline(value) {
    return value
        .replaceAll("\\", "\\\\")
        .replace(/([`*_[\]<>|])/g, "\\$1")
        .replace(/\r?\n/g, " ");
}
export function quoteMarkdown(value) {
    const lines = value.replace(/\r\n?/g, "\n").split("\n");
    return lines.map((line) => `> ${line}`).join("\n");
}
export function inlineCode(value) {
    return `\`${value.replaceAll("`", "\\`")}\``;
}
export function renderMarkdownList(values, emptyMessage = "None.") {
    return values.length > 0
        ? values.map((value) => `- ${value}`).join("\n")
        : `- ${emptyMessage}`;
}
export function renderNextAction(action) {
    return [
        "## Next Action",
        "",
        action,
    ].join("\n");
}
