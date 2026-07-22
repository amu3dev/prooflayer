export const RESUME_SECTION_NAMES = [
    "Summary",
    "Career Through-Line",
    "Product & Technical Strengths",
    "Technical Fluency",
    "Current Product & AI Initiatives",
    "Professional Experience",
    "Enterprise Engineering Foundation",
    "Education & Certifications",
    "Additional Information"
];
const SECTION_BY_KEY = new Map(RESUME_SECTION_NAMES.map((name) => [normalizeHeading(name), name]));
const DATE_RANGE_RE = /\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+)?\d{4}\s*(?:-|\u2013|to)\s*(?:Present|Current|Now|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+)?\d{4})\b/i;
export function isMarkdownResume(text) {
    const sectionCount = text
        .split(/\r?\n/)
        .filter((line) => /^##\s+/.test(line.trim()))
        .map((line) => line.trim().replace(/^##\s+/, ""))
        .filter((heading) => SECTION_BY_KEY.has(normalizeHeading(heading)))
        .length;
    return sectionCount >= 2;
}
export function isResumeSectionHeading(value) {
    return SECTION_BY_KEY.has(normalizeHeading(stripInlineMarkdown(value)));
}
export function isDateLocationLine(value) {
    const cleaned = stripInlineMarkdown(value).trim();
    const match = cleaned.match(DATE_RANGE_RE);
    if (!match)
        return false;
    const remainder = cleaned
        .replace(match[0], "")
        .replace(/^\s*\|\s*/, "")
        .trim();
    return remainder.length === 0 || /^[A-Za-z][A-Za-z .,/()-]*$/.test(remainder);
}
export function parseMarkdownResume(text) {
    const parsed = {
        headings: [],
        summaryParagraphs: [],
        summaryEntries: [],
        strengthLines: [],
        skillLines: [],
        projects: [],
        experiences: [],
        educationLines: [],
        additionalLines: [],
        ignoredHeadings: 0,
        ignoredFragments: 0,
        warnings: []
    };
    const lines = text.replace(/\r/g, "").split("\n");
    let section;
    let entry;
    for (let index = 0; index < lines.length; index += 1) {
        const raw = lines[index].trim();
        if (!raw)
            continue;
        const headingMatch = raw.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const heading = stripInlineMarkdown(headingMatch[2]);
            parsed.headings.push(heading);
            if (level === 2) {
                entry = undefined;
                const matchedSection = SECTION_BY_KEY.get(normalizeHeading(heading));
                section = matchedSection;
                parsed.ignoredHeadings += 1;
                if (!matchedSection)
                    parsed.warnings.push(`Unrecognized resume section: ${heading}`);
                continue;
            }
            if (level === 3 && section === "Current Product & AI Initiatives") {
                entry = { name: heading, sourceSection: section, bullets: [] };
                parsed.projects.push(entry);
                continue;
            }
            if (level === 3 && (section === "Professional Experience" || section === "Enterprise Engineering Foundation")) {
                entry = { name: heading, sourceSection: section, bullets: [] };
                parsed.experiences.push(entry);
                continue;
            }
            parsed.ignoredHeadings += 1;
            entry = undefined;
            continue;
        }
        if (!section) {
            parsed.ignoredFragments += 1;
            continue;
        }
        if (section === "Summary" || section === "Career Through-Line") {
            const value = stripListMarker(raw);
            if (isUsableNarrative(value)) {
                parsed.summaryParagraphs.push(value);
                parsed.summaryEntries.push({ text: value, sourceSection: section });
            }
            else
                parsed.ignoredFragments += 1;
            continue;
        }
        if (section === "Product & Technical Strengths") {
            const value = stripListMarker(raw);
            if (isUsableNarrative(value))
                parsed.strengthLines.push(value);
            else
                parsed.ignoredFragments += 1;
            continue;
        }
        if (section === "Technical Fluency") {
            const value = stripListMarker(raw);
            if (isUsableNarrative(value))
                parsed.skillLines.push(value);
            else
                parsed.ignoredFragments += 1;
            continue;
        }
        if (section === "Education & Certifications") {
            const value = stripListMarker(raw);
            if (isUsableEducation(value))
                parsed.educationLines.push(value);
            else
                parsed.ignoredFragments += 1;
            continue;
        }
        if (section === "Additional Information") {
            const value = stripListMarker(raw);
            if (isUsableNarrative(value))
                parsed.additionalLines.push(value);
            else
                parsed.ignoredFragments += 1;
            continue;
        }
        if (!entry) {
            if (!isNarrativeIntro(raw))
                parsed.ignoredFragments += 1;
            continue;
        }
        const boldLine = raw.match(/^\*\*(.+?)\*\*\s*(?:\|\s*(.+))?$/);
        if (boldLine) {
            const boldValue = stripInlineMarkdown(boldLine[1]);
            if (section === "Enterprise Engineering Foundation") {
                entry.role = entry.name;
                entry.company = boldValue;
            }
            else {
                entry.role = boldValue;
                if (section === "Professional Experience")
                    entry.company = entry.name;
            }
            if (boldLine[2])
                applyDateAndLocation(entry, boldLine[2]);
            continue;
        }
        if (isDateLocationLine(raw)) {
            applyDateAndLocation(entry, raw);
            continue;
        }
        if (/^[-*]\s+/.test(raw)) {
            const bullet = stripListMarker(raw);
            if (isUsableNarrative(bullet))
                entry.bullets.push(bullet);
            else
                parsed.ignoredFragments += 1;
            continue;
        }
        if (!isNarrativeIntro(raw))
            parsed.ignoredFragments += 1;
    }
    parsed.projects = parsed.projects.filter((project) => {
        const valid = Boolean(project.name && project.role);
        if (!valid)
            parsed.ignoredFragments += 1;
        return valid;
    });
    parsed.experiences = parsed.experiences.filter((experience) => {
        const valid = Boolean(experience.company && experience.role && experience.dateRange);
        if (!valid) {
            parsed.ignoredFragments += 1;
            parsed.warnings.push(`Ignored incomplete experience entry: ${experience.name}`);
        }
        return valid;
    });
    return parsed;
}
function applyDateAndLocation(entry, value) {
    const cleaned = stripInlineMarkdown(value);
    const dateRange = cleaned.match(DATE_RANGE_RE)?.[0];
    if (!dateRange)
        return;
    entry.dateRange = dateRange;
    const location = cleaned
        .replace(dateRange, "")
        .replace(/^\s*\|\s*/, "")
        .trim();
    if (location)
        entry.location = location;
}
function normalizeHeading(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function stripInlineMarkdown(value) {
    return value
        .replace(/\*\*/g, "")
        .replace(/`/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}
function stripListMarker(value) {
    return stripInlineMarkdown(value.replace(/^[-*]\s+/, ""));
}
function isUsableNarrative(value) {
    return value.length >= 20 && !isResumeSectionHeading(value) && !isDateLocationLine(value);
}
function isUsableEducation(value) {
    return value.length >= 12 && /\b(?:degree|diploma|certif(?:icate|ication|ied)?|scholarship|university|academy|college|institute|bachelor|master)\b/i.test(value);
}
function isNarrativeIntro(value) {
    const cleaned = stripInlineMarkdown(value);
    return cleaned.length >= 60 && /[.!?]$/.test(cleaned);
}
