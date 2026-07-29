import path from "node:path";
import { readFile } from "node:fs/promises";
import { KNOWN_DOMAINS, KNOWN_TECHNOLOGIES, PUBLIC_SAFETY_RULES, WORKSPACE_DIR, WORKSPACE_FOLDERS } from "./constants.js";
import { extractText } from "./extract.js";
import { normalizeProjectIdentity, preferredProjectName } from "./entity-normalization.js";
import { ensureDir, hashFile, pathExists, readJson, stableId, toPosixRelative, uniqueSorted, walkFiles, writeJson, writeJsonAtomic, writeText } from "./fs-utils.js";
import { deriveHumanTitle, escapeMarkdownInline, inlineCode, renderDerivedMarkdownBanner, renderNextAction, } from "./human-readable-markdown.js";
import { auditSourcesAndEvidence, detectSensitivity, sourceVisibilityFromPath } from "./privacy.js";
import { isDateLocationLine, isMarkdownResume, isResumeSectionHeading, parseMarkdownResume } from "./resume-parser.js";
import { CareerProfileSchema, ClaimSchema, EvidenceItemSchema, SourceSchema } from "./schemas.js";
const DATE_RANGE_RE = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)?\.?\s?\d{4}\s*(?:-|–|to)\s*(?:Present|Current|Now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)?\.?\s?\d{4})\b/i;
const EXPLICIT_NUMBER_RE = /\b\d+(?:[.,]\d+)?\s?(?:\+|%)?\b/;
const STRUCTURAL_METRIC_RE = /\b(?:\d+(?:[.,]\d+)?\s?(?:\+\s?)?(?:(?:core|distinct|supported|product|technical)\s+){0,3}(?:years?|flows?|modules?|platforms?|products?|projects?|workflows?|domains?|areas?)|multi-module|multi-surface|multiple|cross-domain|cross-platform|end-to-end)\b/i;
const IMPACT_METRIC_TERM_RE = /\b(?:users?|revenue|adoption|team size|teams?|performance|latency|conversion|retention|growth|students?|schools?|clients?|campaigns?|transactions?)\b/i;
const RESPONSIBILITY_RE = /\b(?:led|built|created|managed|owned|shaped|delivered|supported|coordinated|developed|implemented|advised|translated|designed|launched|improved|validated|scoped|prioritized)\b/i;
const ACHIEVEMENT_RE = /\b(?:achieved|accelerated|delivered|improved|increased|launched|reduced|saved|grew)\b/i;
export function workspaceRoot(cwd = process.cwd()) {
    return path.join(cwd, WORKSPACE_DIR);
}
export function resolveWorkspace(workspace) {
    return path.resolve(workspace ?? workspaceRoot());
}
export async function initWorkspace(workspace) {
    for (const folder of WORKSPACE_FOLDERS) {
        await ensureDir(path.join(workspace, folder));
    }
    const configPath = path.join(workspace, "config/prooflayer.config.json");
    if (!(await pathExists(configPath))) {
        await writeJson(configPath, {
            app: "ProofLayer",
            slice: "Career Vault Builder v1",
            createdAt: new Date().toISOString(),
            defaults: {
                jobMatchThreshold: 72,
                visibilityForUnknownSources: "unknown",
                requireEvidenceForClaims: true
            }
        });
    }
}
export async function ingestSources(workspace) {
    await initWorkspace(workspace);
    const sourcesRoot = path.join(workspace, "sources");
    const extractedRoot = path.join(workspace, "kb/extracted-text");
    const files = await walkFiles(sourcesRoot);
    const importedAt = new Date().toISOString();
    const sources = [];
    for (const file of files) {
        const relativePath = toPosixRelative(workspace, file);
        const hash = await hashFile(file);
        const id = stableId("src", [relativePath, hash]);
        const extractedTextPath = `kb/extracted-text/${id}.txt`;
        const extracted = await extractText(file);
        const source = SourceSchema.parse({
            id,
            type: detectSourceType(relativePath),
            path: relativePath,
            title: path.basename(file),
            importedAt,
            hash,
            visibility: sourceVisibilityFromPath(relativePath),
            status: extracted.supported ? "active" : "needs_review",
            extractedTextPath
        });
        const extractionNote = extracted.error ? `\n\n[Extraction note: ${extracted.error}]` : "";
        await writeText(path.join(workspace, extractedTextPath), `${extracted.text}${extractionNote}`.trim());
        sources.push(source);
    }
    sources.sort((a, b) => a.path.localeCompare(b.path));
    await writeJsonAtomic(path.join(workspace, "kb/sources.json"), sources);
    return sources;
}
export async function normalizeEvidence(workspace) {
    const sources = await readJson(path.join(workspace, "kb/sources.json"), []);
    const evidenceItems = [];
    const stats = { ignoredHeadings: 0, ignoredFragments: 0, warnings: [] };
    for (const source of sources) {
        if (!source.extractedTextPath || source.status !== "active")
            continue;
        const extractedPath = path.join(workspace, source.extractedTextPath);
        if (!(await pathExists(extractedPath)))
            continue;
        const text = await readFile(extractedPath, "utf8");
        const result = extractEvidenceResult(source, text);
        evidenceItems.push(...result.items);
        stats.ignoredHeadings += result.stats.ignoredHeadings;
        stats.ignoredFragments += result.stats.ignoredFragments;
        stats.warnings.push(...result.stats.warnings.map((warning) => `${source.path}: ${warning}`));
    }
    const deduped = dedupeEvidence(evidenceItems);
    await writeJsonAtomic(path.join(workspace, "kb/evidence-items.json"), deduped);
    await writeJsonAtomic(path.join(workspace, "kb/normalization-stats.json"), {
        ...stats,
        warnings: uniqueSorted(stats.warnings)
    });
    return deduped;
}
export async function generateClaims(workspace) {
    const evidenceItems = await readJson(path.join(workspace, "kb/evidence-items.json"), []);
    const existingClaims = await readJson(path.join(workspace, "kb/claims.json"), []);
    const claims = generateClaimsFromEvidence(evidenceItems, existingClaims);
    await writeJsonAtomic(path.join(workspace, "kb/claims.json"), claims);
    await writeNormalizationQualityReport(workspace);
    await writeTrustModelReport(workspace);
    return claims;
}
export function generateClaimsFromEvidence(evidenceItems, existingClaims = []) {
    const groupsByText = new Map();
    const parentContextById = buildClaimParentContextMap(evidenceItems);
    for (const item of evidenceItems.filter(isClaimCandidate)) {
        const textKey = normalizeClaimIdentityText(claimTextFromEvidence(item));
        const contextGroups = groupsByText.get(textKey) ?? new Map();
        const contextKey = claimContextKey(item, parentContextById);
        const group = contextGroups.get(contextKey) ?? [];
        group.push(item);
        contextGroups.set(contextKey, group);
        groupsByText.set(textKey, contextGroups);
    }
    const claims = [];
    for (const [textKey, contextGroups] of groupsByText) {
        const entries = [...contextGroups.entries()].sort(([a], [b]) => a.localeCompare(b));
        const claimText = claimTextFromEvidence(entries[0][1][0]);
        const legacyId = stableId("claim", [claimText]);
        const existingLegacyClaim = existingClaims.find((claim) => claim.id === legacyId);
        const canonicalContextKey = selectLegacyClaimContext(entries, existingLegacyClaim);
        const manualClaims = existingClaims.filter((claim) => claim.corroborationLevel === "manual_approved" && normalizeClaimIdentityText(claim.claim) === textKey);
        for (const [contextKey, items] of entries) {
            const manualClaim = manualClaimForContext(manualClaims, items, entries.length === 1);
            const id = entries.length === 1 || contextKey === canonicalContextKey
                ? legacyId
                : stableId("claim", [claimText, contextKey]);
            claims.push(buildClaim(items, manualClaim, id));
        }
    }
    return claims
        .sort((a, b) => a.id.localeCompare(b.id));
}
function normalizeClaimIdentityText(value) {
    return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}
function claimContextKey(item, parentContextById) {
    const hasParentContext = Boolean(item.parentRoleId || item.parentProjectId);
    return [
        `role:${item.parentRoleId ? parentContextById.get(item.parentRoleId) ?? `id:${item.parentRoleId}` : ""}`,
        `project:${item.parentProjectId ? parentContextById.get(item.parentProjectId) ?? `id:${item.parentProjectId}` : ""}`,
        `category:${hasParentContext ? item.category : ""}`
    ].join("|");
}
function buildClaimParentContextMap(items) {
    const contexts = new Map();
    for (const item of items) {
        if (item.category === "role") {
            contexts.set(item.id, [
                normalizeClaimIdentityText(item.company ?? ""),
                normalizeClaimIdentityText(item.dateRange ?? ""),
                normalizeClaimIdentityText(item.normalizedSummary)
            ].join("|"));
        }
        else if (item.category === "project") {
            contexts.set(item.id, [
                normalizeProjectIdentity(item.project ?? item.normalizedSummary),
                normalizeClaimIdentityText(item.dateRange ?? "")
            ].join("|"));
        }
    }
    return contexts;
}
function selectLegacyClaimContext(entries, existingLegacyClaim) {
    if (!existingLegacyClaim)
        return entries[0][0];
    const existingEvidenceIds = new Set(existingLegacyClaim.supportingEvidenceIds);
    return [...entries].sort((a, b) => {
        const overlapA = a[1].filter((item) => existingEvidenceIds.has(item.id)).length;
        const overlapB = b[1].filter((item) => existingEvidenceIds.has(item.id)).length;
        return overlapB - overlapA || a[0].localeCompare(b[0]);
    })[0][0];
}
function manualClaimForContext(manualClaims, items, allowTextFallback) {
    const parentRoleId = sharedEvidenceValue(items, (item) => item.parentRoleId);
    const parentProjectId = sharedEvidenceValue(items, (item) => item.parentProjectId);
    return manualClaims.find((claim) => claim.parentRoleId === parentRoleId && claim.parentProjectId === parentProjectId) ?? (allowTextFallback ? manualClaims[0] : undefined);
}
function sharedEvidenceValue(items, selector) {
    const values = uniqueSorted(items.map(selector).filter((value) => Boolean(value)));
    return values.length === 1 ? values[0] : undefined;
}
function buildClaim(items, manualClaim, id) {
    const claimText = claimTextFromEvidence(items[0]);
    const supportingEvidenceIds = uniqueSorted(items.map((item) => item.id));
    const sourceIds = uniqueSorted(items.flatMap((item) => item.sourceIds));
    const extractionConfidence = items.reduce((current, item) => strongestConfidence(current, item.confidence), "low");
    const competency = items.some(isGenericCompetencyEvidence);
    const broadSummary = items.some((item) => ["Summary", "Career Through-Line"].includes(item.sourceSection ?? "")) || claimText.length > 280;
    const factLike = items.some((item) => [
        "role",
        "project",
        "skill",
        "tool",
        "education",
        "certification",
        "responsibility",
        "achievement",
        "domain"
    ].includes(item.category));
    const corroborationLevel = manualClaim
        ? "manual_approved"
        : sourceIds.length > 1
            ? "multi_source"
            : sourceIds.length === 1
                ? "single_source"
                : "uncorroborated";
    const strongEvidence = items.some((item) => item.confidence === "high");
    const hasPublicEvidence = items.some((item) => item.visibility === "public" && item.sensitivityFlags.length === 0);
    const unsafe = items.some((item) => ["private", "sensitive", "do_not_use"].includes(item.visibility) || item.sensitivityFlags.length > 0);
    const factualConfidence = determineFactualConfidence({
        extractionConfidence,
        competency,
        corroborationLevel,
        hasPublicEvidence,
        factLike
    });
    const broadSummaryAllowed = !broadSummary || ["multi_source", "manual_approved"].includes(corroborationLevel);
    const metric = combinedMetricStatus(items);
    let approvalStatus = "needs_confirmation";
    if (unsafe) {
        approvalStatus = "blocked";
    }
    else if (factLike &&
        !competency &&
        factualConfidence === "high" &&
        strongEvidence &&
        hasPublicEvidence &&
        broadSummaryAllowed &&
        metric !== "needs_metric") {
        approvalStatus = "approved";
    }
    const outputReadiness = determineOutputReadiness(items, approvalStatus);
    const publicSafe = approvalStatus === "approved" && outputReadiness === "resume_ready";
    return ClaimSchema.parse({
        id,
        claim: claimText,
        type: competency ? "competency_claim" : claimTypeFromEvidence(items[0].category),
        supportingEvidenceIds,
        parentRoleId: sharedEvidenceValue(items, (item) => item.parentRoleId),
        parentProjectId: sharedEvidenceValue(items, (item) => item.parentProjectId),
        sourceSection: sharedEvidenceValue(items, (item) => item.sourceSection),
        dateRange: sharedEvidenceValue(items, (item) => item.dateRange),
        extractionConfidence,
        factualConfidence,
        corroborationLevel,
        approvalStatus,
        outputReadiness,
        confidence: factualConfidence,
        publicSafe,
        needsConfirmation: approvalStatus === "needs_confirmation",
        metricStatus: metric,
        approvedWording: approvalStatus === "approved" ? claimText : undefined,
        unsafeWording: approvalStatus === "blocked" ? items.map((item) => item.text) : []
    });
}
export async function buildProfile(workspace) {
    const evidenceItems = await readJson(path.join(workspace, "kb/evidence-items.json"), []);
    const claims = await readJson(path.join(workspace, "kb/claims.json"), []);
    const profile = CareerProfileSchema.parse({
        id: "career_profile",
        updatedAt: new Date().toISOString(),
        positioningCandidates: inferPositioningCandidates(evidenceItems, claims),
        summaryThemes: inferSummaryThemes(evidenceItems),
        roles: buildRoles(evidenceItems),
        projects: buildProjects(evidenceItems),
        skills: buildSkills(evidenceItems),
        domains: uniqueSorted(evidenceItems.flatMap((item) => item.domains ?? [])),
        approvedClaims: claims.filter((claim) => claim.approvalStatus === "approved").map((claim) => claim.claim),
        claimsNeedingConfirmation: claims.filter((claim) => claim.approvalStatus === "needs_confirmation").map((claim) => claim.claim),
        blockedClaims: claims.filter((claim) => claim.approvalStatus === "blocked").map((claim) => claim.claim),
        resumeReadyClaims: claims.filter((claim) => claim.outputReadiness === "resume_ready").map((claim) => claim.claim),
        genericOnlyClaims: claims.filter((claim) => claim.outputReadiness === "generic_only").map((claim) => claim.claim),
        internalOnlyClaims: claims.filter((claim) => claim.outputReadiness === "internal_only").map((claim) => claim.claim),
        publicSafetyRules: PUBLIC_SAFETY_RULES
    });
    await writeJsonAtomic(path.join(workspace, "kb/career-profile.json"), profile);
    await writeText(path.join(workspace, "outputs/reports/career-profile.md"), renderCareerProfile(profile));
    return profile;
}
export async function auditPrivacy(workspace) {
    const sources = await readJson(path.join(workspace, "kb/sources.json"), []);
    const evidenceItems = await readJson(path.join(workspace, "kb/evidence-items.json"), []);
    const claims = await readJson(path.join(workspace, "kb/claims.json"), []);
    const findings = auditSourcesAndEvidence(sources, evidenceItems, claims);
    await writeText(path.join(workspace, "outputs/reports/privacy-report.md"), renderPrivacyReport(findings, sources, claims));
    return findings;
}
export async function rebuild(workspace) {
    const before = await loadSnapshot(workspace);
    const sources = await ingestSources(workspace);
    const evidenceItems = await normalizeEvidence(workspace);
    const claims = await generateClaims(workspace);
    await buildProfile(workspace);
    const findings = await auditPrivacy(workspace);
    const after = { sources, evidenceItems, claims };
    await writeText(path.join(workspace, "outputs/changelogs/rebuild-changelog.md"), renderRebuildChangelog(before, after, findings));
}
function detectSourceType(relativePath) {
    const normalized = relativePath.toLowerCase();
    const ext = path.extname(relativePath).toLowerCase();
    if (normalized.includes("/cvs/"))
        return "cv";
    if (normalized.includes("/linkedin/"))
        return "linkedin_export";
    if (normalized.includes("/github/"))
        return "github_summary";
    if (normalized.includes("/project-notes/"))
        return "project_note";
    if (normalized.includes("/recommendations/"))
        return "recommendation";
    if (normalized.includes("/certificates/"))
        return "certificate";
    if (normalized.includes("/jobs/"))
        return "job_description";
    if (normalized.includes("/pdf/") || ext === ".pdf")
        return "pdf";
    if (normalized.includes("/docx/") || ext === ".docx")
        return "docx";
    if (ext === ".json")
        return "json";
    if (ext === ".csv")
        return "csv";
    if (ext === ".md" || ext === ".txt")
        return "markdown";
    return "unknown";
}
export function extractEvidenceFromSource(source, text) {
    return extractEvidenceResult(source, text).items;
}
function extractEvidenceResult(source, text) {
    const cleanText = text.replace(/\r/g, "").trim();
    if (!cleanText) {
        return { items: [], stats: { ignoredHeadings: 0, ignoredFragments: 0, warnings: [] } };
    }
    if (["cv", "markdown"].includes(source.type) && isMarkdownResume(cleanText)) {
        return extractResumeEvidence(source, cleanText);
    }
    return extractGenericEvidence(source, cleanText);
}
function extractResumeEvidence(source, text) {
    const resume = parseMarkdownResume(text);
    const items = [];
    const confidence = structuredConfidence(source.visibility);
    for (const entry of resume.summaryEntries) {
        items.push(makeEvidence(source, "responsibility", entry.text, normalizeSentence(entry.text), {
            sourceSection: entry.sourceSection,
            technologies: detectKnownValues(entry.text, KNOWN_TECHNOLOGIES),
            domains: detectKnownValues(entry.text, KNOWN_DOMAINS),
            confidence
        }));
    }
    for (const strength of resume.strengthLines) {
        items.push(makeEvidence(source, "responsibility", strength, normalizeSentence(strength), {
            sourceSection: "Product & Technical Strengths",
            technologies: detectKnownValues(strength, KNOWN_TECHNOLOGIES),
            domains: detectKnownValues(strength, KNOWN_DOMAINS),
            confidence
        }));
    }
    for (const skillLine of resume.skillLines) {
        items.push(makeEvidence(source, "skill", skillLine, normalizeSentence(skillLine), {
            sourceSection: "Technical Fluency",
            technologies: detectKnownValues(skillLine, KNOWN_TECHNOLOGIES),
            domains: detectKnownValues(skillLine, KNOWN_DOMAINS),
            confidence
        }));
    }
    for (const project of resume.projects) {
        items.push(...evidenceFromProject(source, project, confidence));
    }
    for (const experience of resume.experiences) {
        items.push(...evidenceFromExperience(source, experience, confidence));
    }
    for (const line of resume.educationLines) {
        const category = isCertificationLike(line, source) ? "certification" : "education";
        items.push(makeEvidence(source, category, line, normalizeSentence(line), {
            sourceSection: "Education & Certifications",
            confidence
        }));
    }
    return {
        items,
        stats: {
            ignoredHeadings: resume.ignoredHeadings,
            ignoredFragments: resume.ignoredFragments,
            warnings: resume.warnings
        }
    };
}
function evidenceFromProject(source, project, confidence) {
    const items = [];
    const roleContext = project.role ? ` - ${project.role}` : "";
    const dateContext = project.dateRange ? ` (${project.dateRange})` : "";
    const projectEvidence = makeEvidence(source, "project", project.name, normalizeSentence(`${project.name}${roleContext}${dateContext}`), {
        project: project.name,
        dateRange: project.dateRange,
        sourceSection: project.sourceSection ?? "Current Product & AI Initiatives",
        confidence
    });
    items.push(projectEvidence);
    for (const bullet of project.bullets) {
        items.push(makeEvidence(source, evidenceCategoryForBullet(bullet), bullet, normalizeSentence(bullet), {
            project: project.name,
            parentProjectId: projectEvidence.id,
            sourceSection: project.sourceSection ?? "Current Product & AI Initiatives",
            dateRange: project.dateRange,
            technologies: detectKnownValues(bullet, KNOWN_TECHNOLOGIES),
            domains: detectKnownValues(bullet, KNOWN_DOMAINS),
            confidence
        }));
    }
    return items;
}
function evidenceFromExperience(source, experience, confidence) {
    const company = experience.company ?? experience.name;
    const title = experience.role ?? experience.name;
    const dateContext = experience.dateRange ? ` (${experience.dateRange})` : "";
    const roleEvidence = makeEvidence(source, "role", `${title} at ${company}`, normalizeSentence(`${title} at ${company}${dateContext}`), {
        company,
        dateRange: experience.dateRange,
        sourceSection: experience.sourceSection ?? "Professional Experience",
        confidence
    });
    const items = [roleEvidence];
    for (const bullet of experience.bullets) {
        items.push(makeEvidence(source, evidenceCategoryForBullet(bullet), bullet, normalizeSentence(bullet), {
            company,
            parentRoleId: roleEvidence.id,
            sourceSection: experience.sourceSection ?? "Professional Experience",
            dateRange: experience.dateRange,
            technologies: detectKnownValues(bullet, KNOWN_TECHNOLOGIES),
            domains: detectKnownValues(bullet, KNOWN_DOMAINS),
            confidence
        }));
    }
    return items;
}
function extractGenericEvidence(source, cleanText) {
    if (source.type === "project_note")
        return extractProjectNoteEvidence(source, cleanText);
    const items = [];
    const stats = { ignoredHeadings: 0, ignoredFragments: 0, warnings: [] };
    const lines = cleanText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .slice(0, 800);
    for (let index = 0; index < lines.length; index += 1) {
        if (/^#{1,6}\s+/.test(lines[index]) || isResumeSectionHeading(lines[index])) {
            stats.ignoredHeadings += 1;
            continue;
        }
        const line = stripMarkdown(lines[index]);
        if (!isUsableEvidenceText(line)) {
            stats.ignoredFragments += 1;
            continue;
        }
        const dateRange = line.match(DATE_RANGE_RE)?.[0];
        const nextLine = stripMarkdown(lines[index + 1] ?? "");
        const technologies = detectKnownValues(line, KNOWN_TECHNOLOGIES);
        const domains = detectKnownValues(line, KNOWN_DOMAINS);
        if (isRoleLike(line, nextLine, dateRange) && !isDateLocationLine(line)) {
            items.push(makeEvidence(source, "role", line, normalizeSentence(line), {
                dateRange,
                company: extractCompany(line),
                technologies,
                domains,
                confidence: dateRange ? confidenceFromVisibility(source.visibility) : "low"
            }));
            continue;
        }
        if (isProjectLike(line, source)) {
            items.push(makeEvidence(source, "project", line, normalizeSentence(line), {
                project: extractProject(line),
                technologies: detectKnownValues(line, KNOWN_TECHNOLOGIES),
                domains: detectKnownValues(line, KNOWN_DOMAINS),
                confidence: source.type === "github_summary" ? "medium" : "low"
            }));
            continue;
        }
        if (isCertificationLike(line, source)) {
            items.push(makeEvidence(source, "certification", line, normalizeSentence(line), { confidence: source.type === "certificate" ? "high" : "medium" }));
            continue;
        }
        if (isEducationLike(line)) {
            items.push(makeEvidence(source, "education", line, normalizeSentence(line), { confidence: "medium" }));
            continue;
        }
        if (source.type === "recommendation" || /recommend/i.test(source.path)) {
            items.push(makeEvidence(source, "recommendation", line, normalizeSentence(line), { confidence: "medium" }));
            continue;
        }
        if (source.type === "markdown" && technologies.length > 0 && /\b(?:skills?|tools?|technologies|technical)\b/i.test(line)) {
            items.push(makeEvidence(source, "skill", line, normalizeSentence(line), {
                technologies,
                domains,
                confidence: confidenceFromVisibility(source.visibility)
            }));
            continue;
        }
        if (RESPONSIBILITY_RE.test(line)) {
            items.push(makeEvidence(source, evidenceCategoryForBullet(line), line, normalizeSentence(line), {
                dateRange,
                technologies,
                domains,
                confidence: "medium"
            }));
        }
    }
    return { items, stats };
}
function extractProjectNoteEvidence(source, cleanText) {
    const items = [];
    const stats = { ignoredHeadings: 0, ignoredFragments: 0, warnings: [] };
    const lines = cleanText.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 800);
    const projectName = detectProjectNoteName(source, lines);
    const narrativeIndex = lines.findIndex((line) => !/^#{1,6}\s+/.test(line) && isUsableEvidenceText(stripMarkdown(line)));
    let projectEvidence;
    if (projectName && narrativeIndex >= 0) {
        const narrative = stripMarkdown(lines[narrativeIndex]);
        projectEvidence = makeEvidence(source, "project", narrative, normalizeSentence(narrative), {
            project: projectName,
            sourceSection: "Project Note",
            technologies: detectKnownValues(narrative, KNOWN_TECHNOLOGIES),
            domains: detectKnownValues(narrative, KNOWN_DOMAINS),
            confidence: "medium"
        });
        items.push(projectEvidence);
    }
    else if (!projectName) {
        stats.warnings.push("Project note did not contain a stable project identity; no project entity was created.");
    }
    for (let index = 0; index < lines.length; index += 1) {
        const raw = lines[index];
        if (/^#{1,6}\s+/.test(raw)) {
            stats.ignoredHeadings += 1;
            continue;
        }
        if (index === narrativeIndex && projectEvidence)
            continue;
        const line = stripMarkdown(raw);
        if (!isUsableEvidenceText(line)) {
            stats.ignoredFragments += 1;
            continue;
        }
        const technologies = detectKnownValues(line, KNOWN_TECHNOLOGIES);
        const domains = detectKnownValues(line, KNOWN_DOMAINS);
        const shared = {
            project: projectName,
            parentProjectId: projectEvidence?.id,
            sourceSection: "Project Note",
            technologies,
            domains,
            confidence: "medium"
        };
        if (RESPONSIBILITY_RE.test(line)) {
            items.push(makeEvidence(source, evidenceCategoryForBullet(line), line, normalizeSentence(line), shared));
        }
        else if (technologies.length > 0) {
            items.push(makeEvidence(source, "skill", line, normalizeSentence(line), shared));
        }
        else {
            items.push(makeEvidence(source, "domain", line, normalizeSentence(line), shared));
        }
    }
    return { items, stats };
}
function detectProjectNoteName(source, lines) {
    const heading = lines.find((line) => /^#\s+/.test(line));
    const headingName = heading
        ? stripMarkdown(heading).replace(/\s+(?:update\s+)?(?:project\s+)?notes?$/i, "").trim()
        : "";
    const narrative = lines.find((line) => !/^#{1,6}\s+/.test(line));
    const narrativeName = narrative?.match(/^(.{2,80}?)\s+is\s+(?:an?|the)\s+/i)?.[1]?.trim();
    const fileName = path.basename(source.path, path.extname(source.path))
        .replace(/[-_](?:update[-_])?(?:project[-_])?note$/i, "")
        .replace(/[-_]+/g, " ")
        .trim();
    return narrativeName || headingName || fileName || undefined;
}
function makeEvidence(source, category, text, normalizedSummary, options = {}) {
    const sensitivityFlags = detectSensitivity(text);
    const visibility = sensitivityFlags.includes("secret_like_string") ? "sensitive" : source.visibility;
    return EvidenceItemSchema.parse({
        id: stableId("evi", [
            source.id,
            category,
            text,
            options.company ?? "",
            options.project ?? "",
            options.dateRange ?? "",
            options.parentRoleId ?? "",
            options.parentProjectId ?? "",
            options.sourceSection ?? ""
        ]),
        sourceIds: [source.id],
        category,
        text,
        normalizedSummary,
        dateRange: options.dateRange,
        company: options.company,
        project: options.project,
        parentRoleId: options.parentRoleId,
        parentProjectId: options.parentProjectId,
        sourceSection: options.sourceSection,
        technologies: uniqueSorted(options.technologies ?? []),
        domains: uniqueSorted(options.domains ?? []),
        visibility,
        sensitivityFlags,
        confidence: sensitivityFlags.length > 0 ? "low" : (options.confidence ?? confidenceFromVisibility(visibility))
    });
}
function confidenceFromVisibility(visibility) {
    if (visibility === "public")
        return "medium";
    if (visibility === "generic_only")
        return "medium";
    return "low";
}
function structuredConfidence(visibility) {
    return ["public", "generic_only"].includes(visibility) ? "high" : "medium";
}
function evidenceCategoryForBullet(text) {
    return ACHIEVEMENT_RE.test(text) ? "achievement" : "responsibility";
}
function stripMarkdown(line) {
    return line
        .replace(/^#{1,6}\s+/, "")
        .replace(/^[-*]\s+/, "")
        .replace(/\*\*/g, "")
        .replace(/`/g, "")
        .trim();
}
function normalizeSentence(value) {
    const cleaned = value.replace(/\s+/g, " ").trim();
    return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
}
function isUsableEvidenceText(value) {
    const cleaned = stripMarkdown(value);
    if (cleaned.length < 20 || cleaned.length > 500)
        return false;
    if (isResumeSectionHeading(cleaned) || isDateLocationLine(cleaned))
        return false;
    if (isLikelyPersonName(cleaned))
        return false;
    if (/^(?:evidence mentions|technologies\/tools found|domains found)\b/i.test(cleaned))
        return false;
    if (/[,:;-]$/.test(cleaned) || /\.{3}$/.test(cleaned))
        return false;
    return true;
}
function isLikelyPersonName(value) {
    const words = value.split(/\s+/);
    return words.length >= 2 && words.length <= 4 && words.every((word) => /^[A-Z][a-z'-]+$/.test(word));
}
function isRoleLike(line, nextLine, dateRange) {
    return Boolean(dateRange ||
        /\b(?:CTO|Chief|Head of|Product Manager|Technical Product Manager|Founder|Co-Founder|Consultant|Developer|Engineer|Project Leader|Lead)\b/i.test(line) ||
        (nextLine && /\b(?:CTO|Product|Engineer|Developer|Consultant|Founder|Lead)\b/i.test(nextLine)));
}
function isProjectLike(line, source) {
    return source.type === "project_note" ||
        source.type === "github_summary" ||
        /\b(?:project|platform|product|MVP|prototype|portfolio|initiative|workflow|app|system)\b/i.test(line);
}
function isCertificationLike(line, source) {
    return source.type === "certificate" || /\b(?:certificate|certification|certified|scholarship|course|credential)\b/i.test(line);
}
function isEducationLike(line) {
    return /\b(?:degree|university|bachelor|master|education|faculty|college|school)\b/i.test(line);
}
function extractCompany(line) {
    const withoutDate = line.replace(DATE_RANGE_RE, "").replace(/\s+\|\s+.*$/, "").trim();
    if (withoutDate.length < 2 || withoutDate.length > 90)
        return undefined;
    return withoutDate;
}
function extractProject(line) {
    const match = line.match(/\b(?:project|platform|product|app|system|initiative)\s*[:\-]\s*([^.;]+)/i);
    return match?.[1]?.trim();
}
function detectKnownValues(text, knownValues) {
    const found = knownValues.filter((value) => {
        const pattern = value === "API" ? "APIs?" : escapeRegExp(value);
        return new RegExp(`\\b${pattern}\\b`, "i").test(text);
    });
    const withoutReactNative = text.replace(/\bReact Native\b/gi, "");
    if (!/\bReact\b/i.test(withoutReactNative))
        removeValue(found, "React");
    const withoutGitHubProjects = text.replace(/\bGitHub Projects\b/gi, "");
    if (!/\bGitHub\b/i.test(withoutGitHubProjects))
        removeValue(found, "GitHub");
    return uniqueSorted(found);
}
function removeValue(values, value) {
    const index = values.indexOf(value);
    if (index >= 0)
        values.splice(index, 1);
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function dedupeEvidence(items) {
    const map = new Map();
    for (const item of items) {
        if (!map.has(item.id))
            map.set(item.id, item);
    }
    return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
}
function claimTextFromEvidence(item) {
    return item.normalizedSummary;
}
export function isClaimCandidate(item) {
    const text = stripMarkdown(item.text);
    if (isResumeSectionHeading(text) || isDateLocationLine(text))
        return false;
    if (isLikelyPersonName(text) && !["role", "project", "education", "certification"].includes(item.category))
        return false;
    if (/^(?:evidence mentions|technologies\/tools found|domains found)\b/i.test(text))
        return false;
    if (/[,:;-]$/.test(text) || /\.{3}$/.test(text))
        return false;
    if (text.length < 20 && !["role", "project", "skill", "tool", "education", "certification"].includes(item.category))
        return false;
    if (text.split(/\s+/).length === 1 && !["skill", "tool", "project"].includes(item.category))
        return false;
    return true;
}
function isGenericCompetencyEvidence(item) {
    if (item.sourceSection === "Product & Technical Strengths")
        return true;
    return /^(?:product discovery|roadmap ownership|cross-functional alignment|data-informed product thinking|platform product thinking|experimentation|AI-assisted product workflows)\b/i.test(item.text);
}
function claimTypeFromEvidence(category) {
    const map = {
        role: "role_claim",
        project: "project_claim",
        skill: "skill_claim",
        tool: "skill_claim",
        certification: "certification_claim",
        recommendation: "responsibility_claim",
        education: "education_claim",
        domain: "domain_claim",
        responsibility: "responsibility_claim",
        achievement: "impact_claim"
    };
    return map[category];
}
function metricStatus(item) {
    const hasNumber = EXPLICIT_NUMBER_RE.test(item.text);
    if (IMPACT_METRIC_TERM_RE.test(item.text) && hasNumber) {
        return item.visibility === "public" && item.confidence === "high" ? "verified_metric" : "needs_metric";
    }
    if (STRUCTURAL_METRIC_RE.test(item.text))
        return "structural_metric";
    if (/\b(?:user growth|user adoption|revenue growth|adoption rate|team size|performance improvement|at scale|large-scale|scaled to|campaign volume|client count)\b/i.test(item.text) && !hasNumber) {
        return "needs_metric";
    }
    return "no_metric";
}
function combinedMetricStatus(items) {
    const order = ["no_metric", "structural_metric", "verified_metric", "needs_metric"];
    return items.reduce((current, item) => {
        const next = metricStatus(item);
        return order.indexOf(next) > order.indexOf(current) ? next : current;
    }, "no_metric");
}
function determineFactualConfidence(options) {
    if (options.corroborationLevel === "manual_approved")
        return "high";
    if (options.extractionConfidence === "low" || !options.factLike)
        return "low";
    if (options.competency)
        return "medium";
    if (options.corroborationLevel === "multi_source" && options.extractionConfidence === "high")
        return "high";
    if (options.hasPublicEvidence && options.extractionConfidence === "high")
        return "high";
    return "medium";
}
function determineOutputReadiness(items, approvalStatus) {
    if (items.some((item) => ["sensitive", "do_not_use"].includes(item.visibility)))
        return "do_not_use";
    if (items.some((item) => item.visibility === "private"))
        return "internal_only";
    if (approvalStatus === "approved")
        return "resume_ready";
    if (items.some((item) => item.visibility === "generic_only"))
        return "generic_only";
    return "internal_only";
}
function strongestConfidence(a, b) {
    const order = ["low", "medium", "high"];
    return order.indexOf(a) >= order.indexOf(b) ? a : b;
}
function chronologicalValue(dateRange) {
    if (!dateRange)
        return 0;
    const months = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12
    };
    const points = [...dateRange.matchAll(/(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+)?(\d{4})/gi)]
        .map((match) => Number(match[2]) * 12 + (months[(match[1] ?? "jan").toLowerCase()] ?? 1));
    const start = points[0] ?? 0;
    if (/\b(?:Present|Current|Now)\b/i.test(dateRange))
        return 100_000_000 + start;
    return points.at(-1) ?? start;
}
function inferPositioningCandidates(items, claims) {
    const text = `${items.map((item) => item.text).join(" ")} ${claims.map((claim) => claim.claim).join(" ")}`;
    const candidates = new Set();
    if (/\b(product|roadmap|discovery|stakeholder|platform)\b/i.test(text))
        candidates.add("Technical Product Manager");
    if (/\b(CTO|Head of Technology|technology leadership|architecture)\b/i.test(text))
        candidates.add("Product & Technology Leader");
    if (/\b(AI|LLM|workflow|automation)\b/i.test(text))
        candidates.add("AI Product / Tooling Lead");
    if (/\b(engineering|developer|software|technical delivery)\b/i.test(text))
        candidates.add("Engineering Leader with Product Depth");
    return [...candidates];
}
function inferSummaryThemes(items) {
    const domains = uniqueSorted(items.flatMap((item) => item.domains ?? [])).slice(0, 8);
    const technologies = uniqueSorted(items.flatMap((item) => item.technologies ?? [])).slice(0, 8);
    const themes = [
        domains.length > 0 ? `Domains evidenced: ${domains.join(", ")}` : "",
        technologies.length > 0 ? `Technologies/tools evidenced: ${technologies.join(", ")}` : "",
        items.some((item) => item.category === "role") ? "Role and responsibility evidence detected." : "",
        items.some((item) => item.category === "project") ? "Project or platform evidence detected." : ""
    ];
    return themes.filter(Boolean);
}
function buildRoles(items) {
    return items
        .filter((item) => item.category === "role")
        .sort((a, b) => chronologicalValue(b.dateRange) - chronologicalValue(a.dateRange))
        .slice(0, 50)
        .map((item) => ({
        company: item.company,
        dateRange: item.dateRange,
        title: item.company ? item.text.replace(new RegExp(`\\s+at\\s+${escapeRegExp(item.company)}$`, "i"), "") : item.text,
        evidenceIds: uniqueSorted(items.filter((candidate) => candidate.id === item.id || candidate.parentRoleId === item.id).map((candidate) => candidate.id))
    }));
}
function buildProjects(items) {
    const projectItems = items
        .filter((item) => item.category === "project" && Boolean(item.project ?? item.text))
        .sort((a, b) => chronologicalValue(b.dateRange) - chronologicalValue(a.dateRange));
    const groups = new Map();
    for (const item of projectItems) {
        const identity = normalizeProjectIdentity(item.project ?? item.text);
        const group = groups.get(identity) ?? [];
        group.push(item);
        groups.set(identity, group);
    }
    return [...groups.entries()].slice(0, 50).map(([identity, projectGroup]) => {
        const projectIds = new Set(projectGroup.map((item) => item.id));
        const supportingItems = items.filter((candidate) => projectIds.has(candidate.id) || Boolean(candidate.parentProjectId && projectIds.has(candidate.parentProjectId)));
        return {
            name: preferredProjectName(identity, projectGroup.map((item) => item.project ?? item.text)),
            technologies: uniqueSorted(supportingItems.flatMap((candidate) => candidate.technologies ?? [])),
            domains: uniqueSorted(supportingItems.flatMap((candidate) => candidate.domains ?? [])),
            evidenceIds: uniqueSorted(supportingItems.map((candidate) => candidate.id))
        };
    });
}
function buildSkills(items) {
    const skills = new Map();
    for (const item of items) {
        for (const tech of item.technologies ?? []) {
            if (!skills.has(tech))
                skills.set(tech, new Set());
            skills.get(tech)?.add(item.id);
        }
    }
    return [...skills.entries()]
        .map(([name, evidenceIds]) => ({ name, evidenceIds: [...evidenceIds].sort() }))
        .sort((a, b) => a.name.localeCompare(b.name));
}
function renderCareerProfile(profile) {
    const roles = profile.roles.map((role) => `### ${escapeMarkdownInline(role.title ?? "Role title not recorded")}

- Organization: ${role.company ?? "not recorded"}
- Date range: ${role.dateRange ?? "not recorded"}
- Evidence references: ${role.evidenceIds.map(inlineCode).join(", ") || "none"}`).join("\n\n");
    const projects = profile.projects.map((project) => `### ${escapeMarkdownInline(project.name)}

- Technologies: ${project.technologies?.join(", ") || "none recorded"}
- Domains: ${project.domains?.join(", ") || "none recorded"}
- Evidence references: ${project.evidenceIds.map(inlineCode).join(", ") || "none"}`).join("\n\n");
    const skills = profile.skills.map((skill) => `- ${escapeMarkdownInline(skill.name)}\n  Evidence references: ${skill.evidenceIds.map(inlineCode).join(", ") || "none"}`).join("\n");
    return `${renderDerivedMarkdownBanner("the canonical career-profile JSON")}

# Career Profile

## Purpose

Provide a human-readable snapshot of the normalized career profile used by downstream role and output workflows.

## Current State

- Profile updated: ${profile.updatedAt}
- Positioning candidates: ${profile.positioningCandidates.length}
- Roles: ${profile.roles.length}
- Projects: ${profile.projects.length}
- Skills: ${profile.skills.length}

## Positioning Candidates

${renderList(profile.positioningCandidates)}

## Summary Themes

${renderList(profile.summaryThemes)}

## Roles

${roles || "- No role evidence detected yet."}

## Projects

${projects || "- No project evidence detected yet."}

## Skills

${skills || "- No skill evidence detected yet."}

## Domains

${renderList(profile.domains)}

## Approved Claims

${renderList(profile.approvedClaims)}

## Claims Needing Confirmation

${renderList(profile.claimsNeedingConfirmation)}

## Blocked Claims

${renderList(profile.blockedClaims)}

## Resume-Ready Claims

${renderList(profile.resumeReadyClaims)}

## Generic-Only Claims

${renderList(profile.genericOnlyClaims)}

## Internal-Only Claims

${renderList(profile.internalOnlyClaims)}

## Public Safety Rules

${renderList(profile.publicSafetyRules)}

${renderNextAction(profile.claimsNeedingConfirmation.length > 0
        ? "Review claims needing confirmation before using them in public or resume-ready outputs."
        : "No profile review action is required; downstream target workflows may consume the current canonical JSON.")}
`;
}
function renderPrivacyReport(findings, sources, claims) {
    const high = findings.filter((finding) => finding.severity === "high");
    const medium = findings.filter((finding) => finding.severity === "medium");
    const low = findings.filter((finding) => finding.severity === "low");
    const renderedFindings = findings.map((finding) => [
        `- **${finding.severity.toUpperCase()}:** ${finding.finding}`,
        `  Reference: ${finding.targetType} ${inlineCode(finding.targetId)}`,
    ].join("\n"));
    return `${renderDerivedMarkdownBanner("the source, evidence, claim, and privacy-audit JSON state")}

# Privacy Report

## Purpose

Show privacy and visibility risks that require human attention before reviewed evidence enters a public output.

## Summary

- High risk findings: ${high.length}
- Medium risk findings: ${medium.length}
- Low risk findings: ${low.length}
- Generic-only sources: ${sources.filter((source) => source.visibility === "generic_only").length}
- Generic-only claims: ${claims.filter((claim) => claim.outputReadiness === "generic_only").length}
- Verbatim public-safe claims: ${claims.filter((claim) => claim.publicSafe).length}

## Findings

${renderedFindings.join("\n") || "- No privacy findings detected."}

## Limitations

- Risky items are flagged only. ProofLayer does not delete or mutate source files.
- Generic-only content may support generalized wording but is not safe for verbatim public output.
- Review unknown/private visibility before using related evidence in public outputs.

${renderNextAction(high.length + medium.length > 0
        ? "Review high- and medium-risk findings before generating or publishing public output."
        : "No blocking privacy action is indicated by this report.")}
`;
}
async function writeNormalizationQualityReport(workspace) {
    const sources = await readJson(path.join(workspace, "kb/sources.json"), []);
    const evidenceItems = await readJson(path.join(workspace, "kb/evidence-items.json"), []);
    const claims = await readJson(path.join(workspace, "kb/claims.json"), []);
    const stats = await readJson(path.join(workspace, "kb/normalization-stats.json"), {
        ignoredHeadings: 0,
        ignoredFragments: 0,
        warnings: []
    });
    const roles = evidenceItems.filter((item) => item.category === "role").length;
    const projects = evidenceItems.filter((item) => item.category === "project").length;
    const skills = buildSkills(evidenceItems).length;
    const approvedClaims = claims.filter((claim) => claim.approvalStatus === "approved").length;
    const claimsNeedingConfirmation = claims.filter((claim) => claim.approvalStatus === "needs_confirmation").length;
    const blockedClaims = claims.filter((claim) => claim.approvalStatus === "blocked").length;
    const resumeReadyClaims = claims.filter((claim) => claim.outputReadiness === "resume_ready").length;
    const warnings = [...stats.warnings];
    if (roles === 0)
        warnings.push("No structured roles were detected.");
    if (projects === 0)
        warnings.push("No structured projects were detected.");
    if (approvedClaims === 0)
        warnings.push("No approved public-safe claims were generated.");
    const unknownSources = sources.filter((source) => source.visibility === "unknown").length;
    if (unknownSources > 0)
        warnings.push(`${unknownSources} source(s) have unknown visibility and require review.`);
    await writeText(path.join(workspace, "outputs/reports/normalization-quality-report.md"), `${renderDerivedMarkdownBanner("the normalized source, evidence, claim, and statistics JSON")}

# Normalization Quality Report

## Purpose

Summarize what normalization produced and identify structural gaps that need source or normalization review.

## Current State

- Sources: ${sources.length}
- Evidence items: ${evidenceItems.length}
- Roles detected: ${roles}
- Projects detected: ${projects}
- Skills detected: ${skills}
- Approved claims: ${approvedClaims}
- Claims needing confirmation: ${claimsNeedingConfirmation}
- Blocked claims: ${blockedClaims}
- Resume-ready claims: ${resumeReadyClaims}
- Ignored headings/fragments: ${stats.ignoredHeadings + stats.ignoredFragments}
- Ignored headings: ${stats.ignoredHeadings}
- Ignored fragments: ${stats.ignoredFragments}

## Warnings

${renderList(uniqueSorted(warnings))}

${renderNextAction(warnings.length > 0
        ? "Inspect the listed warnings and correct the relevant source or normalization input before relying on missing structures."
        : "No normalization-quality action is required.")}
`);
}
async function writeTrustModelReport(workspace) {
    const sources = await readJson(path.join(workspace, "kb/sources.json"), []);
    const claims = await readJson(path.join(workspace, "kb/claims.json"), []);
    const count = (predicate) => claims.filter(predicate).length;
    const claimTypes = [...new Set(claims.map((claim) => claim.type))].sort();
    const downgraded = claims
        .filter((claim) => claim.approvalStatus === "needs_confirmation")
        .sort((a, b) => {
        const competencyDifference = Number(b.type === "competency_claim") - Number(a.type === "competency_claim");
        return competencyDifference || a.claim.localeCompare(b.claim);
    })
        .slice(0, 10);
    const warnings = [];
    if (sources.length === 1)
        warnings.push("All current claims rely on a single source; corroboration is not yet available.");
    if (count((claim) => claim.outputReadiness === "resume_ready") === 0)
        warnings.push("No claims are resume-ready; trusted Slice 2 matching must remain disabled.");
    if (sources.some((source) => source.visibility === "generic_only"))
        warnings.push("Generic-only sources require generalized wording or manual approval before public use.");
    await writeText(path.join(workspace, "outputs/reports/trust-model-report.md"), `${renderDerivedMarkdownBanner("the canonical source and claim JSON")}

# Trust Model Report

## Purpose

Explain the global claim trust boundary and show which claims are eligible for downstream trusted matching.

## Current State

- Approved claims: ${count((claim) => claim.approvalStatus === "approved")}
- Needs confirmation: ${count((claim) => claim.approvalStatus === "needs_confirmation")}
- Blocked claims: ${count((claim) => claim.approvalStatus === "blocked")}
- Generic-only claims: ${count((claim) => claim.outputReadiness === "generic_only")}
- Resume-ready claims: ${count((claim) => claim.outputReadiness === "resume_ready")}
- Internal-only claims: ${count((claim) => claim.outputReadiness === "internal_only")}
- Do-not-use claims: ${count((claim) => claim.outputReadiness === "do_not_use")}

## Claims by Type

${renderList(claimTypes.map((type) => `${type}: ${count((claim) => claim.type === type)}`))}

## Examples of Downgraded Claims

${renderList(downgraded.map((claim) => `${claim.claim} [${claim.type}; factual confidence: ${claim.factualConfidence}; corroboration: ${claim.corroborationLevel}; output: ${claim.outputReadiness}]`))}

## Warnings and Limitations

${renderList(warnings)}

## Matching Gate

Trusted matching should use only claims with approval status "approved" and output readiness "resume_ready".

${renderNextAction(warnings.length > 0
        ? "Resolve the listed trust or visibility warnings through the established review workflow; do not edit this report."
        : "No trust-model action is required before downstream matching.")}
`);
}
async function loadSnapshot(workspace) {
    return {
        sources: await readJson(path.join(workspace, "kb/sources.json"), []),
        evidenceItems: await readJson(path.join(workspace, "kb/evidence-items.json"), []),
        claims: await readJson(path.join(workspace, "kb/claims.json"), [])
    };
}
function renderRebuildChangelog(before, after, findings) {
    const beforeSources = new Map(before.sources.map((source) => [source.id, source]));
    const afterSources = new Map(after.sources.map((source) => [source.id, source]));
    const addedSources = after.sources.filter((source) => !beforeSources.has(source.id));
    const removedSources = before.sources.filter((source) => !afterSources.has(source.id));
    const changedSources = after.sources.filter((source) => {
        const previous = beforeSources.get(source.id);
        return previous && previous.hash !== source.hash;
    });
    const beforeEvidenceIds = new Set(before.evidenceItems.map((item) => item.id));
    const beforeClaimIds = new Set(before.claims.map((claim) => claim.id));
    const addedEvidence = after.evidenceItems.filter((item) => !beforeEvidenceIds.has(item.id));
    const addedClaims = after.claims.filter((claim) => !beforeClaimIds.has(claim.id));
    const needsConfirmation = after.claims.filter((claim) => claim.needsConfirmation);
    const renderSourceChanges = (sources) => renderList(sources.map((source) => `${escapeMarkdownInline(source.title || source.type)}; source ID ${inlineCode(source.id)}; content SHA-256 ${inlineCode(source.hash)}`));
    const renderEvidenceChanges = (items) => renderList(items.map((item) => `${escapeMarkdownInline(deriveHumanTitle(item.normalizedSummary, "Evidence item"))}; evidence ID ${inlineCode(item.id)}`));
    const renderClaimChanges = (items) => renderList(items.map((claim) => `${escapeMarkdownInline(claim.claim)}; claim ID ${inlineCode(claim.id)}`));
    return `${renderDerivedMarkdownBanner("the before-and-after canonical Knowledge Base snapshots")}

# Rebuild Changelog

## Purpose

Show human-readable Knowledge Base additions, removals, and review needs from the latest rebuild without exposing private source paths.

## Current State

- Added sources: ${addedSources.length}
- Changed sources: ${changedSources.length}
- Removed sources: ${removedSources.length}
- Added evidence items: ${addedEvidence.length}
- Added claims: ${addedClaims.length}
- Claims needing confirmation: ${needsConfirmation.length}
- Privacy findings: ${findings.length}

## Added Sources

${renderSourceChanges(addedSources)}

## Changed Sources

${renderSourceChanges(changedSources)}

## Removed Sources

${renderSourceChanges(removedSources)}

## Added Evidence

${renderEvidenceChanges(addedEvidence)}

## Added Claims

${renderClaimChanges(addedClaims)}

## Claims Needing Confirmation

${renderClaimChanges(needsConfirmation)}

## Risky Privacy Findings

${renderList(findings.map((finding) => `${finding.severity.toUpperCase()}: ${finding.finding}; ${finding.targetType} reference ${inlineCode(finding.targetId)}`))}

${renderNextAction(needsConfirmation.length + findings.length > 0
        ? "Review claims needing confirmation and privacy findings before relying on rebuilt content in public outputs."
        : "No rebuild follow-up action is required.")}
`;
}
function renderList(values) {
    return values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "- None detected yet.";
}
