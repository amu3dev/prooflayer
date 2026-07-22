import { constants as fsConstants } from "node:fs";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { hashBuffer, hashFile, hashText, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { JobTargetSchema, TargetAnalysisManifestSchema, TargetAnalysisSchema, } from "./schemas.js";
import { showTarget } from "./targets.js";
export const TARGET_ANALYZER_NAME = "target-structure";
export const TARGET_ANALYZER_VERSION = "1";
const ANALYSIS_FILE = "target-analysis.json";
const MANIFEST_FILE = "analysis-manifest.json";
const HEADING_CLASSIFICATIONS = new Map([
    ["responsibilities", "responsibilities"],
    ["key responsibilities", "responsibilities"],
    ["role responsibilities", "responsibilities"],
    ["what you will do", "responsibilities"],
    ["what youll do", "responsibilities"],
    ["requirements", "required"],
    ["required qualifications", "required"],
    ["minimum qualifications", "required"],
    ["must have", "required"],
    ["must haves", "required"],
    ["preferred", "preferred"],
    ["preferred qualifications", "preferred"],
    ["nice to have", "preferred"],
    ["bonus", "preferred"],
    ["qualifications", "qualifications"],
    ["experience and qualifications", "qualifications"],
    ["about the role", "about-role"],
    ["the role", "about-role"],
    ["role overview", "about-role"],
    ["position overview", "about-role"],
    ["about us", "company"],
    ["about the company", "company"],
    ["company", "company"],
    ["benefits", "benefits"],
    ["what we offer", "benefits"],
    ["perks and benefits", "benefits"],
    ["application process", "other"],
    ["how to apply", "other"],
]);
const FRONT_MATTER_FIELDS = new Set(["title", "company", "location", "workingmodel"]);
function normalizedRelative(relativePath) {
    return relativePath.split(path.sep).join("/");
}
function resolveWithinWorkspace(workspace, relativePath) {
    const workspacePath = path.resolve(workspace);
    const resolved = path.resolve(workspacePath, relativePath);
    const relation = path.relative(workspacePath, resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Analysis path escapes the workspace: ${relativePath}`);
    }
    return resolved;
}
function targetPaths(workspace, target) {
    const collection = target.type === "role" ? "roles" : "jobs";
    const directory = path.join("targets", collection, target.id);
    const targetRelativePath = normalizedRelative(path.join(directory, "target.json"));
    const analysisRelativePath = normalizedRelative(path.join(directory, "analysis", ANALYSIS_FILE));
    const manifestRelativePath = normalizedRelative(path.join(directory, "analysis", MANIFEST_FILE));
    const sourceRelativePath = target.type === "job"
        ? normalizedRelative(path.join(directory, "job-description.md"))
        : undefined;
    return {
        targetRelativePath,
        targetPath: resolveWithinWorkspace(workspace, targetRelativePath),
        sourceRelativePath,
        sourcePath: sourceRelativePath
            ? resolveWithinWorkspace(workspace, sourceRelativePath)
            : undefined,
        analysisRelativePath,
        analysisPath: resolveWithinWorkspace(workspace, analysisRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithinWorkspace(workspace, manifestRelativePath),
    };
}
async function exists(filePath) {
    try {
        await access(filePath, fsConstants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
function decodeUtf8(buffer, label) {
    let decoded;
    try {
        decoded = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(buffer);
    }
    catch {
        throw new Error(`${label} is not readable UTF-8 text`);
    }
    if (!Buffer.from(decoded, "utf8").equals(buffer)) {
        throw new Error(`${label} cannot be preserved as exact UTF-8 text`);
    }
    return decoded;
}
function sourceLines(buffer) {
    const lines = [];
    let startOffset = 0;
    let number = 1;
    for (let index = 0; index < buffer.length; index += 1) {
        if (buffer[index] !== 0x0a)
            continue;
        const endOffset = index + 1;
        const lineBytes = buffer.subarray(startOffset, index);
        const contentBytes = lineBytes.at(-1) === 0x0d ? lineBytes.subarray(0, -1) : lineBytes;
        lines.push({
            number,
            startOffset,
            endOffset,
            content: decodeUtf8(contentBytes, `Line ${number}`),
        });
        startOffset = endOffset;
        number += 1;
    }
    if (startOffset < buffer.length || buffer.length === 0) {
        const lineBytes = buffer.subarray(startOffset);
        const contentBytes = lineBytes.at(-1) === 0x0d ? lineBytes.subarray(0, -1) : lineBytes;
        lines.push({
            number,
            startOffset,
            endOffset: buffer.length,
            content: decodeUtf8(contentBytes, `Line ${number}`),
        });
    }
    return lines;
}
function stableId(prefix, values) {
    return `${prefix}_${hashText(values.map((value) => String(value ?? "")).join("\u0000")).slice(0, 12)}`;
}
function normalizeHeading(heading) {
    return heading
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[’']/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/\s+/g, " ");
}
function sectionSemantics(classification) {
    switch (classification) {
        case "required":
            return { necessity: "required", category: "qualification" };
        case "preferred":
            return { necessity: "preferred", category: "qualification" };
        case "responsibilities":
            return { necessity: "contextual", category: "responsibility" };
        case "qualifications":
            return { necessity: "unknown", category: "qualification" };
        case "benefits":
            return { necessity: "contextual", category: "benefit" };
        case "company":
            return { necessity: "contextual", category: "company-context" };
        case "about-role":
            return { necessity: "contextual", category: "unknown" };
        default:
            return { necessity: "unknown", category: "unknown" };
    }
}
function sourceReference(buffer, lines, sourcePath, sourceSha256, startIndex, endIndex) {
    const start = lines[startIndex];
    const end = lines[endIndex];
    if (!start || !end)
        throw new Error("Cannot create a source reference outside the source document");
    const excerpt = buffer.subarray(start.startOffset, end.endOffset);
    return {
        sourceType: "job-description-markdown",
        path: sourcePath,
        sha256: sourceSha256,
        startLine: start.number,
        endLine: end.number,
        startOffset: start.startOffset,
        endOffset: end.endOffset,
        excerptSha256: hashBuffer(excerpt),
    };
}
function frontMatterRange(lines) {
    if (lines[0]?.content.trim() !== "---")
        return null;
    for (let index = 1; index < lines.length; index += 1) {
        if (lines[index]?.content.trim() === "---")
            return { start: 0, end: index };
    }
    return null;
}
function parseHeading(content) {
    const match = content.match(/^ {0,3}(#{1,3})[ \t]+(.+?)[ \t]*#*[ \t]*$/);
    if (!match?.[1] || !match[2])
        return null;
    const heading = match[2].trim();
    return heading ? { heading, level: match[1].length } : null;
}
function listStatement(content) {
    const unordered = content.match(/^\s*[-*+]\s+(.+)$/);
    if (unordered?.[1])
        return unordered[1].trim();
    const ordered = content.match(/^\s*\d+\.\s+(.+)$/);
    return ordered?.[1]?.trim() || null;
}
function makeSection(targetId, buffer, lines, sourcePath, sourceSha256, startIndex, endIndex, heading) {
    const normalizedHeading = heading ? normalizeHeading(heading.heading) : null;
    const mapped = normalizedHeading ? HEADING_CLASSIFICATIONS.get(normalizedHeading) : undefined;
    return {
        id: stableId("section", [
            targetId,
            sourcePath,
            normalizedHeading,
            heading?.level ?? null,
            lines[startIndex]?.number ?? 0,
            lines[endIndex]?.number ?? 0,
        ]),
        heading: heading?.heading ?? null,
        headingLevel: heading?.level ?? null,
        normalizedHeading,
        startLine: lines[startIndex]?.number ?? 1,
        endLine: lines[endIndex]?.number ?? 1,
        sourceReference: sourceReference(buffer, lines, sourcePath, sourceSha256, startIndex, endIndex),
        classification: mapped ?? "unknown",
        classificationBasis: mapped ? "explicit-heading" : "none",
    };
}
function parseJobMarkdown(targetId, buffer, sourcePath, sourceSha256) {
    const lines = sourceLines(buffer);
    const frontMatter = frontMatterRange(lines);
    const bodyStart = frontMatter ? frontMatter.end + 1 : 0;
    const sections = [];
    const items = [];
    if (frontMatter) {
        for (let index = frontMatter.start + 1; index < frontMatter.end; index += 1) {
            const line = lines[index];
            const match = line?.content.match(/^\s*([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*?)\s*$/);
            if (!line || !match?.[1] || !match[2])
                continue;
            const normalizedKey = match[1].toLowerCase().replace(/[-_]/g, "");
            if (!FRONT_MATTER_FIELDS.has(normalizedKey))
                continue;
            const reference = sourceReference(buffer, lines, sourcePath, sourceSha256, index, index);
            items.push({
                id: stableId("item", [targetId, "front-matter-field", line.number, reference.excerptSha256]),
                sectionId: null,
                kind: "front-matter-field",
                statement: `${match[1]}: ${match[2]}`,
                rawText: line.content,
                necessity: "unknown",
                category: "unknown",
                extractionMethod: "explicit-front-matter",
                sourceReferences: [reference],
            });
        }
    }
    const headingIndexes = [];
    for (let index = bodyStart; index < lines.length; index += 1) {
        if (parseHeading(lines[index]?.content ?? ""))
            headingIndexes.push(index);
    }
    const firstContent = lines.findIndex((line, index) => index >= bodyStart && line.content.trim().length > 0);
    if (firstContent >= 0 && (headingIndexes[0] === undefined || firstContent < headingIndexes[0])) {
        let endIndex = (headingIndexes[0] ?? lines.length) - 1;
        while (endIndex > firstContent && !lines[endIndex]?.content.trim())
            endIndex -= 1;
        sections.push(makeSection(targetId, buffer, lines, sourcePath, sourceSha256, firstContent, endIndex, null));
    }
    for (let headingPosition = 0; headingPosition < headingIndexes.length; headingPosition += 1) {
        const startIndex = headingIndexes[headingPosition];
        if (startIndex === undefined)
            continue;
        let endIndex = (headingIndexes[headingPosition + 1] ?? lines.length) - 1;
        while (endIndex > startIndex && !lines[endIndex]?.content.trim())
            endIndex -= 1;
        sections.push(makeSection(targetId, buffer, lines, sourcePath, sourceSha256, startIndex, endIndex, parseHeading(lines[startIndex]?.content ?? "")));
    }
    for (const section of sections) {
        const startIndex = section.startLine - 1 + (section.heading ? 1 : 0);
        const endIndex = section.endLine - 1;
        const semantics = sectionSemantics(section.classification);
        let index = startIndex;
        while (index <= endIndex) {
            const line = lines[index];
            if (!line || !line.content.trim()) {
                index += 1;
                continue;
            }
            const listItem = listStatement(line.content);
            if (listItem) {
                const reference = sourceReference(buffer, lines, sourcePath, sourceSha256, index, index);
                items.push({
                    id: stableId("item", [targetId, section.id, "list-item", line.number, reference.excerptSha256]),
                    sectionId: section.id,
                    kind: "list-item",
                    statement: listItem,
                    rawText: line.content,
                    necessity: semantics.necessity,
                    category: semantics.category,
                    extractionMethod: section.classificationBasis === "explicit-heading"
                        ? "explicit-heading"
                        : "markdown-structure",
                    sourceReferences: [reference],
                });
                index += 1;
                continue;
            }
            if (parseHeading(line.content)) {
                index += 1;
                continue;
            }
            const paragraphStart = index;
            let paragraphEnd = index;
            while (paragraphEnd + 1 <= endIndex) {
                const next = lines[paragraphEnd + 1];
                if (!next || !next.content.trim() || parseHeading(next.content) || listStatement(next.content))
                    break;
                paragraphEnd += 1;
            }
            const reference = sourceReference(buffer, lines, sourcePath, sourceSha256, paragraphStart, paragraphEnd);
            const paragraphLines = lines.slice(paragraphStart, paragraphEnd + 1);
            items.push({
                id: stableId("item", [
                    targetId,
                    section.id,
                    "paragraph",
                    paragraphLines[0]?.number ?? 0,
                    reference.excerptSha256,
                ]),
                sectionId: section.id,
                kind: "paragraph",
                statement: paragraphLines.map((entry) => entry.content.trim()).join(" "),
                rawText: paragraphLines.map((entry) => entry.content).join("\n"),
                necessity: semantics.necessity,
                category: semantics.category,
                extractionMethod: section.classificationBasis === "explicit-heading"
                    ? "explicit-heading"
                    : "markdown-structure",
                sourceReferences: [reference],
            });
            index = paragraphEnd + 1;
        }
    }
    return {
        sections,
        items,
        warnings: sections.length === 0 && items.length === 0
            ? [
                {
                    code: "NO_SUPPORTED_MARKDOWN_STRUCTURE",
                    message: "No supported Markdown sections or items were found in the job description.",
                },
            ]
            : [],
    };
}
async function loadValidatedInput(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const paths = targetPaths(workspace, target);
    const targetSha256 = await hashFile(paths.targetPath);
    if (target.type === "role")
        return { target, paths, targetSha256 };
    const jobTarget = JobTargetSchema.parse(target);
    if (!paths.sourcePath)
        throw new Error(`Persisted job description path is missing for ${target.id}`);
    let sourceBuffer;
    try {
        sourceBuffer = await readFile(paths.sourcePath);
    }
    catch {
        throw new Error(`Persisted job description is missing: ${paths.sourceRelativePath}`);
    }
    if (sourceBuffer.length === 0)
        throw new Error(`Persisted job description is empty: ${paths.sourceRelativePath}`);
    const sourceSha256 = hashBuffer(sourceBuffer);
    if (sourceSha256 !== jobTarget.source.sha256) {
        throw new Error(`Persisted job description hash does not match target source SHA-256 for ${target.id}`);
    }
    const decoded = decodeUtf8(sourceBuffer, "Persisted job description");
    if (decoded !== jobTarget.rawDescription) {
        throw new Error(`Persisted job description does not match rawDescription for ${target.id}`);
    }
    return { target, paths, targetSha256, sourceBuffer, sourceSha256 };
}
async function storedStatus(workspace, target, paths, targetSha256, analyzerName, analyzerVersion) {
    const analysisExists = await exists(paths.analysisPath);
    const manifestExists = await exists(paths.manifestPath);
    const base = {
        targetId: target.id,
        targetType: target.type,
        analysisExists,
        manifestExists,
        analysisPath: paths.analysisRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!analysisExists && !manifestExists) {
        return {
            ...base,
            targetHashMatches: null,
            sourceHashMatches: target.type === "job" ? null : null,
            analyzerVersionMatches: null,
            analysisHashMatches: null,
            status: "missing",
            reasons: ["No stored analysis or analysis manifest exists."],
        };
    }
    if (!analysisExists || !manifestExists) {
        return {
            ...base,
            targetHashMatches: null,
            sourceHashMatches: target.type === "job" ? null : null,
            analyzerVersionMatches: null,
            analysisHashMatches: null,
            status: "invalid",
            reasons: ["The stored analysis and manifest are incomplete."],
        };
    }
    let analysis;
    let manifest;
    try {
        analysis = TargetAnalysisSchema.parse(await readJson(paths.analysisPath, null));
        manifest = TargetAnalysisManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return {
            ...base,
            targetHashMatches: null,
            sourceHashMatches: target.type === "job" ? null : null,
            analyzerVersionMatches: null,
            analysisHashMatches: null,
            status: "invalid",
            reasons: [`Stored analysis data is invalid: ${error.message}`],
        };
    }
    const actualAnalysisHash = await hashFile(paths.analysisPath);
    const analysisHashMatches = actualAnalysisHash === manifest.analysisSha256;
    const targetHashMatches = targetSha256 === manifest.targetSha256;
    const analyzerVersionMatches = manifest.analyzerName === analyzerName &&
        manifest.analyzerVersion === analyzerVersion &&
        analysis.analyzer.name === analyzerName &&
        analysis.analyzer.version === analyzerVersion;
    let sourceHashMatches = null;
    if (target.type === "job") {
        try {
            if (!paths.sourcePath)
                throw new Error("missing path");
            if (analysis.targetType !== "job")
                throw new Error("analysis type mismatch");
            const sourceBuffer = await readFile(paths.sourcePath);
            const sourceHash = hashBuffer(sourceBuffer);
            sourceHashMatches =
                sourceHash === target.source.sha256 &&
                    sourceHash === manifest.sourceSha256 &&
                    sourceHash === analysis.input.sourceSha256 &&
                    decodeUtf8(sourceBuffer, "Persisted job description") === target.rawDescription;
        }
        catch {
            sourceHashMatches = false;
        }
    }
    const agreementErrors = [];
    if (analysis.targetId !== target.id || manifest.targetId !== target.id) {
        agreementErrors.push("Stored analysis target ID does not match the requested target.");
    }
    if (analysis.targetType !== target.type || manifest.targetType !== target.type) {
        agreementErrors.push("Stored analysis target type does not match the target.");
    }
    if (manifest.analysisPath !== paths.analysisRelativePath) {
        agreementErrors.push("Manifest analysis path does not match the expected workspace path.");
    }
    if (analysis.input.targetPath !== paths.targetRelativePath) {
        agreementErrors.push("Stored analysis target path does not match the expected workspace path.");
    }
    if (analysis.input.targetSha256 !== manifest.targetSha256) {
        agreementErrors.push("Stored analysis and manifest disagree on the target hash.");
    }
    if (target.type === "job" && analysis.targetType === "job") {
        if (analysis.input.sourcePath !== paths.sourceRelativePath) {
            agreementErrors.push("Stored analysis source path does not match the persisted job description path.");
        }
        if (analysis.input.sourceSha256 !== manifest.sourceSha256) {
            agreementErrors.push("Stored analysis and manifest disagree on the source hash.");
        }
    }
    if (analysis.analyzer.name !== manifest.analyzerName ||
        analysis.analyzer.version !== manifest.analyzerVersion) {
        agreementErrors.push("Stored analysis and manifest disagree on analyzer metadata.");
    }
    if (!analysisHashMatches)
        agreementErrors.push("Stored analysis SHA-256 does not match the manifest.");
    if (agreementErrors.length > 0) {
        return {
            ...base,
            targetHashMatches,
            sourceHashMatches,
            analyzerVersionMatches,
            analysisHashMatches,
            status: "invalid",
            reasons: agreementErrors,
        };
    }
    const staleReasons = [];
    if (!targetHashMatches)
        staleReasons.push("Target input hash changed after analysis.");
    if (sourceHashMatches === false)
        staleReasons.push("Job-description source hash or raw content changed.");
    if (!analyzerVersionMatches)
        staleReasons.push("Analyzer name or version changed.");
    return {
        ...base,
        targetHashMatches,
        sourceHashMatches,
        analyzerVersionMatches,
        analysisHashMatches,
        status: staleReasons.length > 0 ? "stale" : "current",
        reasons: staleReasons,
    };
}
export async function getTargetAnalysisStatus(workspace, targetId, options = {}) {
    const target = await showTarget(workspace, targetId);
    const paths = targetPaths(workspace, target);
    const targetSha256 = await hashFile(paths.targetPath);
    return storedStatus(workspace, target, paths, targetSha256, options.analyzerName ?? TARGET_ANALYZER_NAME, options.analyzerVersion ?? TARGET_ANALYZER_VERSION);
}
export async function analyzeTarget(workspace, targetId, options = {}) {
    const analyzerName = options.analyzerName ?? TARGET_ANALYZER_NAME;
    const analyzerVersion = options.analyzerVersion ?? TARGET_ANALYZER_VERSION;
    const input = await loadValidatedInput(workspace, targetId);
    const status = await storedStatus(workspace, input.target, input.paths, input.targetSha256, analyzerName, analyzerVersion);
    if (status.status === "current" && !options.rebuild) {
        const analysis = TargetAnalysisSchema.parse(await readJson(input.paths.analysisPath, null));
        return {
            targetId: input.target.id,
            targetType: input.target.type,
            result: "already-current",
            analyzerName,
            analyzerVersion,
            analysisPath: input.paths.analysisRelativePath,
            manifestPath: input.paths.manifestRelativePath,
            sectionCount: analysis.sections.length,
            itemCount: analysis.items.length,
            warningCount: analysis.warnings.length,
            ...(input.sourceSha256 ? { sourceSha256: input.sourceSha256 } : {}),
        };
    }
    if (status.status === "invalid" && !options.rebuild) {
        throw new Error(`Stored analysis is invalid and was not overwritten. Re-run with --rebuild after review. ${status.reasons.join(" ")}`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (status.analysisExists) {
        try {
            const stored = TargetAnalysisSchema.parse(await readJson(input.paths.analysisPath, null));
            if (stored.targetId === input.target.id && stored.targetType === input.target.type) {
                createdAt = stored.createdAt;
            }
        }
        catch {
            // An explicit rebuild may replace invalid analysis while starting a new analysis history.
        }
    }
    let sections = [];
    let items = [];
    let warnings = [];
    if (input.target.type === "role") {
        warnings = [
            {
                code: "ROLE_SEMANTIC_INTERPRETATION_NOT_AVAILABLE",
                message: "No deterministic requirement source is available for this role target.",
            },
        ];
    }
    else {
        if (!input.sourceBuffer || !input.sourceSha256 || !input.paths.sourceRelativePath) {
            throw new Error(`Validated job source is unavailable for ${input.target.id}`);
        }
        ({ sections, items, warnings } = parseJobMarkdown(input.target.id, input.sourceBuffer, input.paths.sourceRelativePath, input.sourceSha256));
    }
    const analysis = TargetAnalysisSchema.parse({
        schemaVersion: 1,
        targetId: input.target.id,
        targetType: input.target.type,
        analyzer: { name: analyzerName, version: analyzerVersion, mode: "deterministic" },
        input: {
            targetPath: input.paths.targetRelativePath,
            targetSha256: input.targetSha256,
            ...(input.paths.sourceRelativePath ? { sourcePath: input.paths.sourceRelativePath } : {}),
            ...(input.sourceSha256 ? { sourceSha256: input.sourceSha256 } : {}),
        },
        sections,
        items,
        warnings,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(input.paths.analysisPath, analysis);
    const analysisSha256 = await hashFile(input.paths.analysisPath);
    const manifest = TargetAnalysisManifestSchema.parse({
        schemaVersion: 1,
        targetId: input.target.id,
        targetType: input.target.type,
        analysisPath: input.paths.analysisRelativePath,
        analysisSha256,
        analyzerName,
        analyzerVersion,
        targetSha256: input.targetSha256,
        ...(input.sourceSha256 ? { sourceSha256: input.sourceSha256 } : {}),
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(input.paths.manifestPath, manifest);
    return {
        targetId: input.target.id,
        targetType: input.target.type,
        result: status.status === "missing" ? "created" : "rebuilt",
        analyzerName,
        analyzerVersion,
        analysisPath: input.paths.analysisRelativePath,
        manifestPath: input.paths.manifestRelativePath,
        sectionCount: analysis.sections.length,
        itemCount: analysis.items.length,
        warningCount: analysis.warnings.length,
        ...(input.sourceSha256 ? { sourceSha256: input.sourceSha256 } : {}),
    };
}
export async function showTargetAnalysis(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const paths = targetPaths(workspace, target);
    if (!(await exists(paths.analysisPath)))
        throw new Error(`Analysis not found for target: ${targetId}`);
    return TargetAnalysisSchema.parse(await readJson(paths.analysisPath, null));
}
export function formatAnalyzeTargetResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Target type: ${result.targetType}`,
        `Analysis status: ${result.result}`,
        `Analyzer: ${result.analyzerName} v${result.analyzerVersion} (deterministic)`,
        `Analysis path: ${result.analysisPath}`,
        `Manifest path: ${result.manifestPath}`,
        `Sections: ${result.sectionCount}`,
        `Items: ${result.itemCount}`,
        `Warnings: ${result.warningCount}`,
        ...(result.sourceSha256 ? [`Source SHA-256: ${result.sourceSha256}`] : []),
    ].join("\n");
}
export function formatTargetAnalysisStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Target ID: ${status.targetId}`,
        `Target type: ${status.targetType}`,
        `Overall status: ${status.status}`,
        `Analysis exists: ${status.analysisExists ? "yes" : "no"}`,
        `Manifest exists: ${status.manifestExists ? "yes" : "no"}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Source hash matches: ${check(status.sourceHashMatches)}`,
        `Analyzer version matches: ${check(status.analyzerVersionMatches)}`,
        `Analysis hash matches: ${check(status.analysisHashMatches)}`,
        `Analysis path: ${status.analysisPath}`,
        `Manifest path: ${status.manifestPath}`,
        ...(status.reasons.length > 0
            ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)]
            : []),
    ].join("\n");
}
export async function analysisFileTimestamps(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const paths = targetPaths(workspace, target);
    const [analysisStat, manifestStat] = await Promise.all([
        stat(paths.analysisPath),
        stat(paths.manifestPath),
    ]);
    return { analysisMtimeMs: analysisStat.mtimeMs, manifestMtimeMs: manifestStat.mtimeMs };
}
