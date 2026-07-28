import { constants as fsConstants } from "node:fs";
import { access, mkdtemp, readFile, readdir, rename, rm, stat, utimes, writeFile, } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { ensureDir, hashFile, hashText, pathExists, readJson, walkFiles, writeJsonAtomic, } from "./fs-utils.js";
import { canonicalVisibleSegments, canonicalVisibleText, extractVisibleTextFromHtml, extractVisibleTextFromMarkdown, firstAndLastMarkers, normalizeVisibleText, renderRoleResumeHtml, renderRoleResumeMarkdown, ROLE_RESUME_DOCX_RENDERER_VERSION, ROLE_RESUME_HTML_RENDERER_VERSION, ROLE_RESUME_MARKDOWN_RENDERER_VERSION, ROLE_RESUME_PDF_RENDERER_VERSION, } from "./role-resume-format-renderers.js";
import { RoleResumeExportFormatSchema, RoleResumeExportManifestSchema, RoleResumeSourceMapSchema, } from "./role-resume-render-schemas.js";
import { composeRoleResumeRenderDocument, getRoleResumeRenderDocumentStatus, normalizeRoleResumeRenderOptions, roleResumeRenderDocumentPaths, showRoleResumeRenderDocument, ROLE_RESUME_RENDERING_POLICY_NAME, ROLE_RESUME_RENDERING_POLICY_VERSION, } from "./role-resume-rendering.js";
const FORMAT_RENDERER_VERSIONS = {
    markdown: ROLE_RESUME_MARKDOWN_RENDERER_VERSION,
    html: ROLE_RESUME_HTML_RENDERER_VERSION,
    docx: ROLE_RESUME_DOCX_RENDERER_VERSION,
    pdf: ROLE_RESUME_PDF_RENDERER_VERSION,
};
const FORMAT_RENDERER_NAMES = {
    markdown: "prooflayer-markdown",
    html: "prooflayer-html",
    docx: "pandoc-docx",
    pdf: "libreoffice-pdf",
};
export async function exportRoleResume(workspace, targetId, options) {
    const format = RoleResumeExportFormatSchema.parse(options.format);
    const normalizedOptions = normalizeRoleResumeRenderOptions(options);
    await composeRoleResumeRenderDocument(workspace, targetId, options);
    const canonicalStatus = await getRoleResumeRenderDocumentStatus(workspace, targetId, normalizedOptions);
    if (canonicalStatus.status !== "current") {
        throw new Error(`Canonical role resume render document must be current before export. Current status: ${canonicalStatus.status}`);
    }
    const document = await showRoleResumeRenderDocument(workspace, targetId);
    const canonicalPaths = roleResumeRenderDocumentPaths(workspace, targetId);
    const canonicalDocumentSha256 = await hashFile(canonicalPaths.documentPath);
    const normalizedOutputDirectory = normalizeOutputDirectory(options.outputDir);
    const rendererVersion = FORMAT_RENDERER_VERSIONS[format];
    const exportId = `role-resume-export_${hashText([
        canonicalDocumentSha256,
        document.approvedDraft.sha256,
        document.profile.name,
        document.profile.version,
        ROLE_RESUME_RENDERING_POLICY_NAME,
        ROLE_RESUME_RENDERING_POLICY_VERSION,
        document.profile.page.size,
        document.dateFormat,
        format,
        rendererVersion,
        normalizedOutputDirectory,
    ].join("\0")).slice(0, 16)}`;
    const paths = roleResumeExportPaths(workspace, targetId, exportId, format, normalizedOutputDirectory, document);
    const existingStatus = await getRoleResumeExportStatus(workspace, exportId);
    if (existingStatus.status === "current") {
        const manifest = await showRoleResumeExport(workspace, exportId);
        return exportResult(manifest, paths, "already-current");
    }
    if (["stale", "invalid"].includes(existingStatus.status) && !options.rebuild) {
        throw new Error(`Role resume export is ${existingStatus.status}; use explicit --rebuild.`);
    }
    await assertOutputDirectorySafe(paths.exportDirectory, paths.manifestPath);
    await ensureDir(path.dirname(paths.exportDirectory));
    const temporaryDirectory = await mkdtemp(path.join(path.dirname(paths.exportDirectory), ".prooflayer-role-render-"));
    const temporaryOutputPath = path.join(temporaryDirectory, paths.filename);
    const temporaryMarkdownPath = path.join(temporaryDirectory, "canonical-resume.md");
    const temporaryHtmlPath = path.join(temporaryDirectory, "canonical-resume.html");
    const markdown = renderRoleResumeMarkdown(document);
    const html = renderRoleResumeHtml(document);
    const toolchain = options.toolchain ?? defaultRoleResumeBinaryToolchain();
    try {
        await writeFile(temporaryMarkdownPath, markdown, "utf8");
        await writeFile(temporaryHtmlPath, html, "utf8");
        if (format === "markdown") {
            await writeFile(temporaryOutputPath, markdown, "utf8");
        }
        else if (format === "html") {
            await writeFile(temporaryOutputPath, html, "utf8");
        }
        else if (format === "docx") {
            await toolchain.createDocx({
                markdownPath: temporaryMarkdownPath,
                outputPath: temporaryOutputPath,
                document,
                temporaryDirectory,
            });
        }
        else {
            await toolchain.createPdf({
                htmlPath: temporaryHtmlPath,
                outputPath: temporaryOutputPath,
                document,
                temporaryDirectory,
            });
        }
        const validation = await validateRoleResumeOutput(document, format, temporaryOutputPath, toolchain, exportId);
        if (validation.status !== "valid") {
            throw new Error(`Rendered ${format} failed validation: ${validation.risks.map((risk) => risk.code).join(", ") || "unknown error"}`);
        }
        await ensureDir(paths.exportDirectory);
        await rename(temporaryOutputPath, paths.outputPath);
        const sourceMap = RoleResumeSourceMapSchema.parse({
            schemaVersion: 1,
            canonicalDocumentId: document.id,
            approvedDraftId: document.approvedDraft.id,
            approvedDraftSha256: document.approvedDraft.sha256,
            entries: document.sourceMap,
        });
        await writeJsonAtomic(paths.sourceMapPath, sourceMap);
        const outputStats = await stat(paths.outputPath);
        const now = (options.now ?? (() => new Date()))().toISOString();
        let createdAt = now;
        if (await pathExists(paths.manifestPath)) {
            try {
                createdAt = RoleResumeExportManifestSchema.parse(await readJson(paths.manifestPath, null)).createdAt;
            }
            catch {
                // Explicit rebuild may replace an invalid export manifest.
            }
        }
        const manifest = RoleResumeExportManifestSchema.parse({
            schemaVersion: 1,
            exportId,
            targetId,
            approvedDraftId: document.approvedDraft.id,
            format,
            rendererName: FORMAT_RENDERER_NAMES[format],
            rendererVersion,
            outputPath: paths.outputRelativePath,
            outputSha256: await hashFile(paths.outputPath),
            outputSizeBytes: outputStats.size,
            canonicalDocumentId: document.id,
            canonicalDocumentPath: canonicalPaths.documentRelativePath,
            canonicalDocumentSha256,
            profile: {
                name: document.profile.name,
                version: document.profile.version,
            },
            renderingPolicy: {
                name: ROLE_RESUME_RENDERING_POLICY_NAME,
                version: ROLE_RESUME_RENDERING_POLICY_VERSION,
            },
            pageSize: document.profile.page.size,
            dateFormat: document.dateFormat,
            sourceMapPath: paths.sourceMapRelativePath,
            sourceMapSha256: await hashFile(paths.sourceMapPath),
            validation,
            dependencies: {
                approvedDraftSha256: document.approvedDraft.sha256,
                approvedDraftManifestSha256: document.approvedDraft.manifestSha256,
                approvedPlanSha256: document.provenance.approvedPlanSha256,
            },
            createdAt,
            updatedAt: now,
        });
        await writeJsonAtomic(paths.manifestPath, manifest);
        return exportResult(manifest, paths, existingStatus.status === "missing" ? "created" : "rebuilt");
    }
    finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
    }
}
export async function exportAllRoleResume(workspace, targetId, options) {
    await composeRoleResumeRenderDocument(workspace, targetId, options);
    const document = await showRoleResumeRenderDocument(workspace, targetId);
    const succeeded = [];
    const failed = [];
    for (const format of RoleResumeExportFormatSchema.options) {
        try {
            succeeded.push(await exportRoleResume(workspace, targetId, { ...options, format }));
        }
        catch (error) {
            failed.push({ format, error: errorMessage(error) });
        }
    }
    return { targetId, canonicalDocumentId: document.id, succeeded, failed };
}
export async function listRoleResumeExports(workspace, targetId) {
    const root = resolveWithin(workspace, `targets/roles/${targetId}/resume-rendering/exports`);
    if (!(await pathExists(root)))
        return [];
    const files = (await walkFiles(root)).filter((file) => path.basename(file) === "export-manifest.json");
    const manifests = await Promise.all(files.map(async (file) => {
        try {
            return RoleResumeExportManifestSchema.parse(await readJson(file, null));
        }
        catch {
            return null;
        }
    }));
    return manifests
        .filter((manifest) => Boolean(manifest))
        .sort((a, b) => a.format.localeCompare(b.format) || a.exportId.localeCompare(b.exportId));
}
export async function showRoleResumeExport(workspace, exportId) {
    const location = await locateRoleResumeExport(workspace, exportId);
    if (!location)
        throw new Error(`Role resume export not found: ${exportId}`);
    return RoleResumeExportManifestSchema.parse(await readJson(location.manifestPath, null));
}
export async function getRoleResumeExportStatus(workspace, exportId) {
    const location = await locateRoleResumeExport(workspace, exportId);
    if (!location)
        return emptyExportStatus(exportId, "unknown", "missing", ["Export not found."]);
    const manifestExists = await pathExists(location.manifestPath);
    if (!manifestExists)
        return emptyExportStatus(exportId, location.targetId, "invalid", ["Export manifest is missing."]);
    let manifest;
    try {
        manifest = RoleResumeExportManifestSchema.parse(await readJson(location.manifestPath, null));
    }
    catch (error) {
        return emptyExportStatus(exportId, location.targetId, "invalid", [`Export manifest is malformed: ${errorMessage(error)}`]);
    }
    const outputPath = resolveWithin(workspace, manifest.outputPath);
    const sourceMapPath = resolveWithin(workspace, manifest.sourceMapPath);
    const outputExists = await pathExists(outputPath);
    const sourceMapExists = await pathExists(sourceMapPath);
    const base = {
        exportId,
        targetId: manifest.targetId,
        format: manifest.format,
        outputExists,
        manifestExists,
        sourceMapExists,
        outputPath: manifest.outputPath,
        manifestPath: toRelative(workspace, location.manifestPath),
        sourceMapPath: manifest.sourceMapPath,
    };
    if (!outputExists || !sourceMapExists) {
        return {
            ...emptyExportStatus(exportId, manifest.targetId, "invalid", ["Export output or source map is missing."]),
            ...base,
        };
    }
    const outputHashMatches = await hashFile(outputPath) === manifest.outputSha256;
    const sourceMapHashMatches = await hashFile(sourceMapPath) === manifest.sourceMapSha256;
    if (!outputHashMatches || !sourceMapHashMatches) {
        return {
            ...emptyExportStatus(exportId, manifest.targetId, "invalid", ["Export output or source-map hash changed."]),
            ...base,
            outputHashMatches,
            sourceMapHashMatches,
            validationStatus: manifest.validation.status,
        };
    }
    const canonicalStatus = await getRoleResumeRenderDocumentStatus(workspace, manifest.targetId);
    const canonicalDocumentCurrent = canonicalStatus.status === "current";
    const canonicalPath = resolveWithin(workspace, manifest.canonicalDocumentPath);
    const canonicalDocumentHashMatches = await pathExists(canonicalPath)
        && await hashFile(canonicalPath) === manifest.canonicalDocumentSha256;
    const rendererVersionMatches = manifest.rendererVersion === FORMAT_RENDERER_VERSIONS[manifest.format]
        && manifest.renderingPolicy.name === ROLE_RESUME_RENDERING_POLICY_NAME
        && manifest.renderingPolicy.version === ROLE_RESUME_RENDERING_POLICY_VERSION;
    const reasons = [
        ...(!canonicalDocumentCurrent ? ["Canonical render document is not current."] : []),
        ...(!canonicalDocumentHashMatches ? ["Canonical render document hash changed."] : []),
        ...(!rendererVersionMatches ? ["Format renderer or rendering policy version changed."] : []),
        ...(manifest.validation.status !== "valid" ? ["Stored export validation is invalid."] : []),
    ];
    return {
        ...base,
        outputHashMatches,
        sourceMapHashMatches,
        canonicalDocumentCurrent,
        canonicalDocumentHashMatches,
        rendererVersionMatches,
        status: reasons.length ? "stale" : "current",
        validationStatus: manifest.validation.status,
        reasons,
    };
}
export async function validateStoredRoleResumeExport(workspace, exportId, toolchain = defaultRoleResumeBinaryToolchain()) {
    const manifest = await showRoleResumeExport(workspace, exportId);
    const status = await getRoleResumeExportStatus(workspace, exportId);
    if (status.status === "missing" || !status.outputPath)
        throw new Error(`Role resume export not found: ${exportId}`);
    const document = await showRoleResumeRenderDocument(workspace, manifest.targetId);
    return validateRoleResumeOutput(document, manifest.format, resolveWithin(workspace, status.outputPath), toolchain, exportId);
}
export function formatExportRoleResumeResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Export ID: ${result.exportId}`,
        `Format: ${result.format}`,
        `Result: ${result.result}`,
        `Output path: ${result.outputPath}`,
        `Output SHA-256: ${result.outputSha256}`,
        `Output size: ${result.outputSizeBytes}`,
        `Visible text equivalent: ${result.visibleTextEquivalent ? "yes" : "no"}`,
        `Page count: ${result.pageCount ?? "n/a"}`,
        `Source map path: ${result.sourceMapPath}`,
        `Manifest path: ${result.manifestPath}`,
    ].join("\n");
}
export function formatExportAllRoleResumeResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Canonical document ID: ${result.canonicalDocumentId}`,
        `Succeeded: ${result.succeeded.map((entry) => entry.format).join(", ") || "none"}`,
        `Failed: ${result.failed.map((entry) => `${entry.format} (${entry.error})`).join("; ") || "none"}`,
        ...result.succeeded.map((entry) => `- ${entry.format}: ${entry.outputPath}`),
    ].join("\n");
}
export function formatRoleResumeExportList(manifests) {
    if (!manifests.length)
        return "No role resume exports found.";
    return manifests.map((manifest) => `${manifest.exportId} | ${manifest.format} | ${manifest.profile.name} | ${manifest.outputPath} | ${manifest.updatedAt}`).join("\n");
}
export function formatRoleResumeExportStatus(status) {
    return [
        `Export ID: ${status.exportId}`,
        `Target ID: ${status.targetId}`,
        `Format: ${status.format ?? "unknown"}`,
        `Overall status: ${status.status}`,
        `Output exists: ${status.outputExists ? "yes" : "no"}`,
        `Source map exists: ${status.sourceMapExists ? "yes" : "no"}`,
        `Output hash matches: ${status.outputHashMatches ?? "n/a"}`,
        `Source-map hash matches: ${status.sourceMapHashMatches ?? "n/a"}`,
        `Canonical document current: ${status.canonicalDocumentCurrent ?? "n/a"}`,
        `Renderer version matches: ${status.rendererVersionMatches ?? "n/a"}`,
        `Validation: ${status.validationStatus ?? "n/a"}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((entry) => `- ${entry}`)] : []),
    ].join("\n");
}
export function deterministicResumeFilename(document, format) {
    const role = slug(document.metadata.targetRoleTitle) || "target-role";
    return `role-resume-${role}-${document.profile.name}-${format}.${extension(format)}`;
}
export function normalizeOutputDirectory(value) {
    if (!value)
        return "";
    if (path.isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value)) {
        throw new Error("Output directory must be relative to the target resume-rendering exports directory.");
    }
    const normalized = value.replace(/\\/g, "/").replace(/^\.\/+/, "").replace(/\/+/g, "/").replace(/\/$/, "");
    if (!normalized || normalized.split("/").some((segment) => segment === ".." || segment === "." || !segment)) {
        throw new Error("Output directory contains path traversal or invalid segments.");
    }
    return normalized;
}
export async function validateRoleResumeOutput(document, format, outputPath, toolchain, exportId) {
    const risks = [];
    const warnings = [];
    const addRisk = (code, message) => risks.push({
        id: `render-risk_${hashText([exportId, format, code].join("\0")).slice(0, 16)}`,
        code,
        severity: "critical",
        message,
        exportId,
        sectionIds: [],
        draftItemIds: [],
        formats: [format],
        validationStage: "format",
    });
    const addWarning = (code, message) => warnings.push({
        id: `render-warning_${hashText([exportId, format, code].join("\0")).slice(0, 16)}`,
        code,
        message,
        sectionIds: [],
        draftItemIds: [],
        formats: [format],
        validationStage: "format",
    });
    if (!(await pathExists(outputPath))) {
        addRisk("EMPTY_OUTPUT", "Renderer did not create an output file.");
        return invalidValidation(risks, warnings);
    }
    const fileStats = await stat(outputPath);
    const nonEmpty = fileStats.size > 0;
    if (!nonEmpty)
        addRisk("EMPTY_OUTPUT", "Rendered output is zero bytes.");
    let extractedText = "";
    let formatValid = nonEmpty;
    let pageCount;
    let pageSizeVerified;
    let textExtractable;
    try {
        if (format === "markdown") {
            extractedText = extractVisibleTextFromMarkdown(await readFile(outputPath, "utf8"));
        }
        else if (format === "html") {
            const html = await readFile(outputPath, "utf8");
            if (!/^<!doctype html>/i.test(html) || /<script\b/i.test(html) || /https?:\/\/[^"' )]+(?:\.css|\.js)/i.test(html)) {
                formatValid = false;
                addRisk("HTML_INVALID", "HTML is missing the expected document structure or contains prohibited executable/remote resources.");
            }
            extractedText = extractVisibleTextFromHtml(html);
        }
        else if (format === "docx") {
            if (!(await validZipPackage(outputPath))) {
                formatValid = false;
                addRisk("DOCX_INVALID", "DOCX is not a valid ZIP package.");
            }
            extractedText = normalizeVisibleText(await toolchain.extractDocxText(outputPath));
            textExtractable = Boolean(extractedText);
            if (!textExtractable)
                addRisk("DOCX_INVALID", "DOCX text is not extractable.");
            addWarning("DOCX_BINARY_METADATA_NORMALIZED", "DOCX package metadata and ZIP timestamps are normalized where local tooling permits.");
        }
        else {
            const signature = (await readFile(outputPath)).subarray(0, 5).toString("ascii");
            if (signature !== "%PDF-") {
                formatValid = false;
                addRisk("PDF_INVALID", "PDF signature is invalid.");
            }
            const extracted = await toolchain.extractPdf(outputPath, document.profile.page.size);
            extractedText = normalizeExtractedPdfText(extracted.text);
            pageCount = extracted.pageCount;
            pageSizeVerified = extracted.pageSizeVerified;
            textExtractable = Boolean(extractedText);
            if (!pageCount)
                addRisk("EMPTY_PAGE", "PDF has no non-empty pages.");
            if (!textExtractable)
                addRisk("PDF_TEXT_NOT_EXTRACTABLE", "PDF text is not extractable.");
            if (!pageSizeVerified)
                addRisk("PDF_INVALID", "PDF page size does not match the selected render profile.");
            addWarning("PDF_BINARY_DETERMINISM_NOT_GUARANTEED", "The local PDF adapter may embed volatile package metadata; semantic and extracted-text determinism are enforced.");
        }
    }
    catch (error) {
        formatValid = false;
        addRisk(`${format.toUpperCase()}_INVALID`, `Format validation failed: ${errorMessage(error)}`);
    }
    const expected = canonicalVisibleText(document);
    const expectedComparisonText = normalizeComparisonText(expected);
    const extractedComparisonText = normalizeComparisonText(extractedText);
    const visibleTextEquivalent = format === "markdown" || format === "html"
        ? expected === extractedText
        : expectedComparisonText === extractedComparisonText;
    if (!visibleTextEquivalent)
        addRisk("VISIBLE_TEXT_MISMATCH", "Normalized visible output text differs from the canonical render document.");
    const markers = firstAndLastMarkers(document);
    const firstMarkerPresent = Boolean(markers.first && extractedComparisonText.includes(normalizeComparisonText(markers.first)));
    const lastMarkerPresent = Boolean(markers.last && extractedComparisonText.includes(normalizeComparisonText(markers.last)));
    if (!firstMarkerPresent || !lastMarkerPresent)
        addRisk("FORMAT_FIDELITY_MISMATCH", "Expected first or last visible text marker is missing.");
    const segments = canonicalVisibleSegments(document).map(normalizeComparisonText);
    let searchOffset = 0;
    const positions = segments.map((segment) => {
        const position = extractedComparisonText.indexOf(segment, searchOffset);
        if (position >= 0)
            searchOffset = position + segment.length;
        return position;
    });
    const sectionOrderPreserved = positions.every((position) => position >= 0);
    if (!sectionOrderPreserved)
        addRisk("SECTION_ORDER_MISMATCH", "Visible content order differs from the canonical document.");
    if (format === "pdf" && pageCount && pageCount > 1) {
        addWarning("OUTPUT_SPANS_MULTIPLE_PAGES", `PDF spans ${pageCount} pages; page count is an output property and content was not changed.`);
    }
    const longToken = canonicalVisibleSegments(document).find((segment) => /\S{80,}/.test(segment));
    if (longToken)
        addWarning("LONG_URL_MAY_WRAP", "A long unbroken token may wrap; approved text was preserved.");
    const binaryDeterministic = format === "markdown" || format === "html";
    return {
        status: risks.length ? "invalid" : "valid",
        nonEmpty,
        formatValid,
        visibleTextEquivalent,
        normalizedVisibleTextSha256: hashText(extractedComparisonText),
        sectionOrderPreserved,
        firstMarkerPresent,
        lastMarkerPresent,
        pageCount,
        pageSizeVerified,
        textExtractable,
        binaryDeterministic,
        risks,
        warnings,
    };
}
export function defaultRoleResumeBinaryToolchain() {
    return {
        async createDocx({ markdownPath, outputPath, document, temporaryDirectory }) {
            const pandoc = await requireExecutable("pandoc");
            await runExecutable(pandoc, [
                markdownPath,
                "--from=gfm",
                "--to=docx",
                "--standalone",
                "--output",
                outputPath,
            ], { cwd: temporaryDirectory });
            await normalizeDocxPackage(outputPath, document, temporaryDirectory);
        },
        async createPdf({ outputPath, document, temporaryDirectory }) {
            const pandoc = await requireExecutable("pandoc");
            const libreOffice = await requireLibreOffice();
            const markdownPath = path.join(temporaryDirectory, "canonical-resume.md");
            const docxPath = outputPath.replace(/\.pdf$/i, ".docx");
            const libreOfficeProfile = path.join(temporaryDirectory, "libreoffice-profile");
            await runExecutable(pandoc, [
                markdownPath,
                "--from=gfm",
                "--to=docx",
                "--standalone",
                "--output",
                docxPath,
            ], { cwd: temporaryDirectory });
            await normalizeDocxPackage(docxPath, document, temporaryDirectory);
            await runExecutable(libreOffice, [
                `-env:UserInstallation=${pathToFileURL(libreOfficeProfile).href}`,
                "--headless",
                "--convert-to",
                "pdf:writer_pdf_Export",
                "--outdir",
                path.dirname(outputPath),
                docxPath,
            ], { cwd: temporaryDirectory });
            if (!(await pathExists(outputPath)))
                throw new Error("LibreOffice PDF renderer did not create an output file.");
        },
        async extractDocxText(filePath) {
            const result = await mammoth.extractRawText({ path: filePath });
            return normalizeVisibleText(result.value);
        },
        async extractPdf(filePath, expectedPageSize) {
            const result = await pdfParse(await readFile(filePath));
            const expectedSize = await verifyPdfPageSize(filePath, expectedPageSize);
            return {
                text: normalizeVisibleText(result.text),
                pageCount: result.numpages ?? 0,
                pageSizeVerified: expectedSize,
            };
        },
    };
}
function roleResumeExportPaths(workspace, targetId, exportId, format, outputDirectory, document) {
    const root = `targets/roles/${targetId}/resume-rendering/exports`;
    const exportRelativeDirectory = outputDirectory
        ? `${root}/${outputDirectory}/${exportId}`
        : `${root}/${exportId}`;
    const filename = deterministicResumeFilename(document, format);
    const outputRelativePath = `${exportRelativeDirectory}/${filename}`;
    const sourceMapRelativePath = `${exportRelativeDirectory}/source-map.json`;
    const manifestRelativePath = `${exportRelativeDirectory}/export-manifest.json`;
    return {
        filename,
        exportRelativeDirectory,
        exportDirectory: resolveWithin(workspace, exportRelativeDirectory),
        outputRelativePath,
        outputPath: resolveWithin(workspace, outputRelativePath),
        sourceMapRelativePath,
        sourceMapPath: resolveWithin(workspace, sourceMapRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
async function locateRoleResumeExport(workspace, exportId) {
    const rolesRoot = resolveWithin(workspace, "targets/roles");
    if (!(await pathExists(rolesRoot)))
        return null;
    for (const role of await readdir(rolesRoot, { withFileTypes: true })) {
        if (!role.isDirectory())
            continue;
        const exportsRoot = path.join(rolesRoot, role.name, "resume-rendering", "exports");
        if (!(await pathExists(exportsRoot)))
            continue;
        const manifests = (await walkFiles(exportsRoot)).filter((file) => path.basename(file) === "export-manifest.json");
        for (const manifestPath of manifests) {
            try {
                const manifest = RoleResumeExportManifestSchema.parse(await readJson(manifestPath, null));
                if (manifest.exportId === exportId)
                    return { targetId: role.name, manifestPath };
            }
            catch {
                if (manifestPath.split(path.sep).includes(exportId))
                    return { targetId: role.name, manifestPath };
            }
        }
    }
    return null;
}
async function normalizeDocxPackage(docxPath, document, temporaryDirectory) {
    const unzip = await requireExecutable("unzip");
    const zip = await requireExecutable("zip");
    const packageDirectory = path.join(temporaryDirectory, "docx-package");
    await ensureDir(packageDirectory);
    await runExecutable(unzip, ["-q", docxPath, "-d", packageDirectory], { cwd: temporaryDirectory });
    const documentXmlPath = path.join(packageDirectory, "word", "document.xml");
    let documentXml = await readFile(documentXmlPath, "utf8");
    const width = document.profile.page.size === "A4" ? 11906 : 12240;
    const height = document.profile.page.size === "A4" ? 16838 : 15840;
    const pageSettings = `<w:pgSz w:w="${width}" w:h="${height}" /><w:pgMar w:top="${toTwips(document.profile.page.marginTopMm)}" w:right="${toTwips(document.profile.page.marginRightMm)}" w:bottom="${toTwips(document.profile.page.marginBottomMm)}" w:left="${toTwips(document.profile.page.marginLeftMm)}" w:header="720" w:footer="720" w:gutter="0" />`;
    documentXml = documentXml.replace(/<w:pgSz\b[^>]*\/>/g, "").replace(/<w:pgMar\b[^>]*\/>/g, "");
    documentXml = documentXml.replace("<w:sectPr>", `<w:sectPr>${pageSettings}`);
    await writeFile(documentXmlPath, documentXml, "utf8");
    const corePath = path.join(packageDirectory, "docProps", "core.xml");
    if (await pathExists(corePath)) {
        let core = await readFile(corePath, "utf8");
        core = core
            .replace(/<dc:creator>[\s\S]*?<\/dc:creator>/, "<dc:creator>ProofLayer</dc:creator>")
            .replace(/<cp:lastModifiedBy>[\s\S]*?<\/cp:lastModifiedBy>/, "<cp:lastModifiedBy>ProofLayer</cp:lastModifiedBy>")
            .replace(/<dcterms:created[^>]*>[\s\S]*?<\/dcterms:created>/, '<dcterms:created xsi:type="dcterms:W3CDTF">2000-01-01T00:00:00Z</dcterms:created>')
            .replace(/<dcterms:modified[^>]*>[\s\S]*?<\/dcterms:modified>/, '<dcterms:modified xsi:type="dcterms:W3CDTF">2000-01-01T00:00:00Z</dcterms:modified>');
        await writeFile(corePath, core, "utf8");
    }
    const files = await walkFiles(packageDirectory);
    if (files.some((file) => /vbaProject\.bin$/i.test(file)))
        throw new Error("DOCX package unexpectedly contains a macro project.");
    const relationships = files.filter((file) => file.endsWith(".rels"));
    for (const relationship of relationships) {
        const xml = await readFile(relationship, "utf8");
        const externalTargets = [...xml.matchAll(/Target="([^"]+)"[^>]*TargetMode="External"/g)].map((match) => match[1]);
        if (externalTargets.some((target) => !/^(?:https?|mailto|tel):/i.test(target))) {
            throw new Error("DOCX package contains an unsafe external relationship.");
        }
    }
    const fixedTime = new Date("2000-01-01T00:00:00.000Z");
    await Promise.all(files.map((file) => utimes(file, fixedTime, fixedTime)));
    await rm(docxPath, { force: true });
    const relativeFiles = files.map((file) => toRelative(packageDirectory, file)).sort((a, b) => a.localeCompare(b));
    await runExecutable(zip, ["-X", "-q", docxPath, ...relativeFiles], { cwd: packageDirectory });
}
async function verifyPdfPageSize(filePath, expectedPageSize) {
    const pdf = (await readFile(filePath)).toString("latin1");
    const match = pdf.match(/\/MediaBox\s*\[\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\]/i);
    if (!match)
        return false;
    const actual = [
        Math.abs(Number(match[3]) - Number(match[1])),
        Math.abs(Number(match[4]) - Number(match[2])),
    ].sort((a, b) => a - b);
    const expected = expectedPageSize === "A4"
        ? [595.28, 841.89]
        : [612, 792];
    return Math.abs(actual[0] - expected[0]) <= 2 && Math.abs(actual[1] - expected[1]) <= 2;
}
function normalizeExtractedPdfText(value) {
    return normalizeVisibleText(value
        .replace(/[\u2022\u2023\u2043\u25e6\u25aa\uf0b7]/g, "")
        .replace(/-\r?\n(?=[\p{L}\p{N}])/gu, ""));
}
function normalizeComparisonText(value) {
    return value
        .normalize("NFC")
        .replace(/[\u2022\u2023\u2043\u25e6\u25aa\uf0b7]/g, " ")
        .replace(/-\r?\n(?=[\p{L}\p{N}])/gu, "")
        .replace(/\s+/g, " ")
        .trim();
}
async function assertOutputDirectorySafe(exportDirectory, manifestPath) {
    if (!(await pathExists(exportDirectory)))
        return;
    if (!(await pathExists(manifestPath))) {
        const contents = await readdir(exportDirectory);
        if (contents.length)
            throw new Error("Export directory contains unrelated files and has no ProofLayer manifest.");
    }
}
async function validZipPackage(filePath) {
    const signature = (await readFile(filePath)).subarray(0, 4);
    return signature[0] === 0x50 && signature[1] === 0x4b;
}
function invalidValidation(risks, warnings) {
    return {
        status: "invalid",
        nonEmpty: false,
        formatValid: false,
        visibleTextEquivalent: false,
        normalizedVisibleTextSha256: hashText(""),
        sectionOrderPreserved: false,
        firstMarkerPresent: false,
        lastMarkerPresent: false,
        binaryDeterministic: false,
        risks,
        warnings,
    };
}
function exportResult(manifest, paths, result) {
    return {
        targetId: manifest.targetId,
        exportId: manifest.exportId,
        format: manifest.format,
        result,
        outputPath: manifest.outputPath,
        manifestPath: paths.manifestRelativePath,
        sourceMapPath: manifest.sourceMapPath,
        outputSha256: manifest.outputSha256,
        outputSizeBytes: manifest.outputSizeBytes,
        visibleTextEquivalent: manifest.validation.visibleTextEquivalent,
        pageCount: manifest.validation.pageCount,
    };
}
function emptyExportStatus(exportId, targetId, status, reasons) {
    return {
        exportId,
        targetId,
        outputExists: false,
        manifestExists: false,
        sourceMapExists: false,
        outputHashMatches: null,
        sourceMapHashMatches: null,
        canonicalDocumentCurrent: null,
        canonicalDocumentHashMatches: null,
        rendererVersionMatches: null,
        status,
        reasons,
    };
}
function extension(format) {
    return format === "markdown" ? "md" : format;
}
function slug(value) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}
function toTwips(mm) {
    return Math.round(mm * 56.6929133858);
}
async function requireExecutable(name) {
    const executable = await resolveExecutable(name);
    if (!executable)
        throw new Error(`Required local renderer tool "${name}" was not found in PATH.`);
    return executable;
}
async function requireLibreOffice() {
    const executable = await resolveExecutable("soffice") ?? await resolveExecutable("libreoffice");
    if (!executable)
        throw new Error("Local PDF renderer unavailable: LibreOffice was not found.");
    return executable;
}
async function resolveExecutable(name) {
    for (const directory of (process.env.PATH ?? "").split(path.delimiter).filter(Boolean)) {
        const candidate = path.join(directory, name);
        try {
            await access(candidate, fsConstants.X_OK);
            return candidate;
        }
        catch {
            // Continue through PATH.
        }
    }
    return null;
}
async function runExecutable(executable, args, options) {
    await runExecutableCapture(executable, args, options);
}
async function runExecutableCapture(executable, args, options) {
    return new Promise((resolve, reject) => {
        execFile(executable, args, {
            cwd: options.cwd,
            env: { ...process.env, ...options.env },
            maxBuffer: 20 * 1024 * 1024,
        }, (error, stdout, stderr) => {
            if (!error)
                return resolve(String(stdout));
            const details = String(stderr || stdout || error.message).trim();
            reject(new Error(`${path.basename(executable)} failed${details ? `: ${details}` : "."}`));
        });
    });
}
function resolveWithin(workspace, relativePath) {
    if (path.isAbsolute(relativePath) || /^[A-Za-z]:[\\/]/.test(relativePath)) {
        throw new Error("Persisted output paths must be workspace-relative.");
    }
    const root = path.resolve(workspace);
    const absolute = path.resolve(root, relativePath);
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`))
        throw new Error("Output path escapes the ProofLayer workspace.");
    return absolute;
}
function toRelative(workspace, filePath) {
    return path.relative(workspace, filePath).split(path.sep).join("/");
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
