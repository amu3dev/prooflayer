import { mkdtemp, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ensureDir,
  hashFile,
  hashText,
  pathExists,
  readJson,
  walkFiles,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  canonicalVisibleText,
  renderRoleResumeHtml,
  renderRoleResumeMarkdown,
  ROLE_RESUME_DOCX_RENDERER_VERSION,
  ROLE_RESUME_HTML_RENDERER_VERSION,
  ROLE_RESUME_MARKDOWN_RENDERER_VERSION,
  ROLE_RESUME_PDF_RENDERER_VERSION,
} from "./role-resume-format-renderers.js";
import {
  defaultRoleResumeBinaryToolchain,
  normalizeOutputDirectory,
  validateRoleResumeOutput,
  type RoleResumeBinaryToolchain,
} from "./role-resume-render-export.js";
import {
  JobResumeExportManifestSchema,
  JobResumeSourceMapSchema,
  type JobResumeExportManifest,
  type JobResumeRenderDocument,
} from "./job-resume-render-schemas.js";
import {
  composeJobResumeRenderDocument,
  getJobResumeRenderDocumentStatus,
  jobResumeRenderDocumentPaths,
  showJobResumeRenderDocument,
  JOB_RESUME_RENDERING_POLICY_NAME,
  JOB_RESUME_RENDERING_POLICY_VERSION,
  type JobResumeRenderOptions,
} from "./job-resume-rendering.js";
import {
  RoleResumeExportFormatSchema,
  type RoleResumeExportFormat,
  type RoleResumeExportValidationSummary,
} from "./role-resume-render-schemas.js";

const FORMAT_RENDERER_VERSIONS: Record<RoleResumeExportFormat, string> = {
  markdown: ROLE_RESUME_MARKDOWN_RENDERER_VERSION,
  html: ROLE_RESUME_HTML_RENDERER_VERSION,
  docx: ROLE_RESUME_DOCX_RENDERER_VERSION,
  pdf: ROLE_RESUME_PDF_RENDERER_VERSION,
};
const FORMAT_RENDERER_NAMES: Record<RoleResumeExportFormat, string> = {
  markdown: "prooflayer-markdown",
  html: "prooflayer-html",
  docx: "pandoc-docx",
  pdf: "libreoffice-pdf",
};

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
  failed: Array<{ format: RoleResumeExportFormat; error: string }>;
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

export async function exportJobResume(
  workspace: string,
  targetId: string,
  options: JobResumeExportOptions,
): Promise<ExportJobResumeResult> {
  const format = RoleResumeExportFormatSchema.parse(options.format);
  await composeJobResumeRenderDocument(workspace, targetId, options);
  const canonicalStatus = await getJobResumeRenderDocumentStatus(workspace, targetId);
  if (canonicalStatus.status !== "current") {
    throw new Error(`Canonical Job resume render document must be current before export. Current status: ${canonicalStatus.status}`);
  }
  const document = await showJobResumeRenderDocument(workspace, targetId);
  const canonicalPaths = jobResumeRenderDocumentPaths(workspace, targetId);
  const canonicalDocumentSha256 = await hashFile(canonicalPaths.documentPath);
  const normalizedOutputDirectory = normalizeOutputDirectory(options.outputDir);
  const rendererVersion = FORMAT_RENDERER_VERSIONS[format];
  const exportId = `job-resume-export_${hashText([
    canonicalDocumentSha256,
    document.approvedDraft.sha256,
    document.profile.name,
    document.profile.version,
    JOB_RESUME_RENDERING_POLICY_NAME,
    JOB_RESUME_RENDERING_POLICY_VERSION,
    document.profile.page.size,
    document.dateFormat,
    format,
    rendererVersion,
    normalizedOutputDirectory,
  ].join("\0")).slice(0, 16)}`;
  const paths = jobResumeExportPaths(
    workspace,
    targetId,
    exportId,
    format,
    normalizedOutputDirectory,
    document,
  );
  const existingStatus = await getJobResumeExportStatus(workspace, exportId);
  if (existingStatus.status === "current") {
    return exportResult(
      await showJobResumeExport(workspace, exportId),
      paths,
      "already-current",
    );
  }
  if (["stale", "invalid"].includes(existingStatus.status) && !options.rebuild) {
    throw new Error(`Job resume export is ${existingStatus.status}; use explicit --rebuild.`);
  }
  await assertOutputDirectorySafe(
    paths.exportDirectory,
    paths.manifestPath,
    options.rebuild ?? false,
    [paths.filename, "source-map.json"],
  );
  await ensureDir(path.dirname(paths.exportDirectory));
  const temporaryDirectory = await mkdtemp(
    path.join(path.dirname(paths.exportDirectory), ".prooflayer-job-render-"),
  );
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
    } else if (format === "html") {
      await writeFile(temporaryOutputPath, html, "utf8");
    } else if (format === "docx") {
      await toolchain.createDocx({
        markdownPath: temporaryMarkdownPath,
        outputPath: temporaryOutputPath,
        document,
        temporaryDirectory,
      });
    } else {
      await toolchain.createPdf({
        htmlPath: temporaryHtmlPath,
        outputPath: temporaryOutputPath,
        document,
        temporaryDirectory,
      });
    }
    const validation = await validateRoleResumeOutput(
      document,
      format,
      temporaryOutputPath,
      toolchain,
      exportId,
    );
    if (validation.status !== "valid") {
      throw new Error(
        `Rendered ${format} failed validation: ${validation.risks.map((risk) => risk.code).join(", ") || "unknown error"}`,
      );
    }
    await ensureDir(paths.exportDirectory);
    await rename(temporaryOutputPath, paths.outputPath);
    const sourceMap = JobResumeSourceMapSchema.parse({
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
        createdAt = JobResumeExportManifestSchema.parse(
          await readJson<unknown>(paths.manifestPath, null),
        ).createdAt;
      } catch {
        // Explicit rebuild may replace an invalid export manifest.
      }
    }
    const manifest = JobResumeExportManifestSchema.parse({
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
        name: JOB_RESUME_RENDERING_POLICY_NAME,
        version: JOB_RESUME_RENDERING_POLICY_VERSION,
      },
      pageSize: document.profile.page.size,
      dateFormat: document.dateFormat,
      sourceMapPath: paths.sourceMapRelativePath,
      sourceMapSha256: await hashFile(paths.sourceMapPath),
      validation,
      dependencies: {
        approvedDraftSha256: document.approvedDraft.sha256,
        approvedDraftManifestSha256: document.approvedDraft.manifestSha256,
        contentPlanSha256: document.provenance.contentPlanSha256,
        requirementModelSha256: document.provenance.requirementModelSha256,
        evidenceMapSha256: document.provenance.evidenceMapSha256,
        coverageSha256: document.provenance.coverageSha256,
        assessmentSha256: document.provenance.assessmentSha256,
      },
      createdAt,
      updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return exportResult(
      manifest,
      paths,
      existingStatus.status === "missing" ? "created" : "rebuilt",
    );
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

export async function exportAllJobResume(
  workspace: string,
  targetId: string,
  options: Omit<JobResumeExportOptions, "format">,
): Promise<ExportAllJobResumeResult> {
  await composeJobResumeRenderDocument(workspace, targetId, options);
  const document = await showJobResumeRenderDocument(workspace, targetId);
  const succeeded: ExportJobResumeResult[] = [];
  const failed: ExportAllJobResumeResult["failed"] = [];
  for (const format of RoleResumeExportFormatSchema.options) {
    try {
      succeeded.push(await exportJobResume(workspace, targetId, { ...options, format }));
    } catch (error) {
      failed.push({ format, error: errorMessage(error) });
    }
  }
  return {
    targetId,
    canonicalDocumentId: document.id,
    succeeded,
    failed,
  };
}

export async function listJobResumeExports(
  workspace: string,
  targetId: string,
): Promise<JobResumeExportManifest[]> {
  const root = resolveWithin(
    workspace,
    `targets/jobs/${targetId}/resume-rendering/exports`,
  );
  if (!(await pathExists(root))) return [];
  const files = (await walkFiles(root)).filter(
    (file) => path.basename(file) === "export-manifest.json",
  );
  const manifests = await Promise.all(files.map(async (file) => {
    try {
      return JobResumeExportManifestSchema.parse(await readJson<unknown>(file, null));
    } catch {
      return null;
    }
  }));
  return manifests
    .filter((manifest): manifest is JobResumeExportManifest => Boolean(manifest))
    .sort((left, right) =>
      left.format.localeCompare(right.format) || left.exportId.localeCompare(right.exportId));
}

export async function showJobResumeExport(
  workspace: string,
  exportId: string,
): Promise<JobResumeExportManifest> {
  const location = await locateJobResumeExport(workspace, exportId);
  if (!location) throw new Error(`Job resume export not found: ${exportId}`);
  return JobResumeExportManifestSchema.parse(
    await readJson<unknown>(location.manifestPath, null),
  );
}

export async function getJobResumeExportStatus(
  workspace: string,
  exportId: string,
): Promise<JobResumeExportStatus> {
  const location = await locateJobResumeExport(workspace, exportId);
  if (!location) {
    return emptyExportStatus(exportId, "unknown", "missing", ["Export not found."]);
  }
  if (!(await pathExists(location.manifestPath))) {
    return emptyExportStatus(exportId, location.targetId, "invalid", ["Export manifest is missing."]);
  }
  let manifest: JobResumeExportManifest;
  try {
    manifest = JobResumeExportManifestSchema.parse(
      await readJson<unknown>(location.manifestPath, null),
    );
  } catch (error) {
    return emptyExportStatus(exportId, location.targetId, "invalid", [
      `Export manifest is malformed: ${errorMessage(error)}`,
    ]);
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
    manifestExists: true,
    sourceMapExists,
    outputPath: manifest.outputPath,
    manifestPath: toRelative(workspace, location.manifestPath),
    sourceMapPath: manifest.sourceMapPath,
  };
  if (!outputExists || !sourceMapExists) {
    return {
      ...emptyExportStatus(exportId, manifest.targetId, "invalid", [
        "Export output or source map is missing.",
      ]),
      ...base,
    };
  }
  const outputHashMatches = await hashFile(outputPath) === manifest.outputSha256;
  const sourceMapHashMatches = await hashFile(sourceMapPath) === manifest.sourceMapSha256;
  if (!outputHashMatches || !sourceMapHashMatches) {
    return {
      ...emptyExportStatus(exportId, manifest.targetId, "invalid", [
        "Export output or source-map hash changed.",
      ]),
      ...base,
      outputHashMatches,
      sourceMapHashMatches,
      validationStatus: manifest.validation.status,
    };
  }
  const canonicalStatus = await getJobResumeRenderDocumentStatus(
    workspace,
    manifest.targetId,
  );
  const canonicalDocumentCurrent = canonicalStatus.status === "current";
  const canonicalPath = resolveWithin(workspace, manifest.canonicalDocumentPath);
  const canonicalDocumentHashMatches = await pathExists(canonicalPath)
    && await hashFile(canonicalPath) === manifest.canonicalDocumentSha256;
  const rendererVersionMatches =
    manifest.rendererVersion === FORMAT_RENDERER_VERSIONS[manifest.format]
    && manifest.renderingPolicy.name === JOB_RESUME_RENDERING_POLICY_NAME
    && manifest.renderingPolicy.version === JOB_RESUME_RENDERING_POLICY_VERSION;
  const reasons = [
    ...(!canonicalDocumentCurrent ? ["Canonical Job render document is not current."] : []),
    ...(!canonicalDocumentHashMatches ? ["Canonical Job render document hash changed."] : []),
    ...(!rendererVersionMatches ? ["Format renderer or Job rendering policy version changed."] : []),
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

export async function validateStoredJobResumeExport(
  workspace: string,
  exportId: string,
  toolchain: RoleResumeBinaryToolchain = defaultRoleResumeBinaryToolchain(),
): Promise<RoleResumeExportValidationSummary> {
  const manifest = await showJobResumeExport(workspace, exportId);
  const status = await getJobResumeExportStatus(workspace, exportId);
  if (status.status === "missing" || !status.outputPath) {
    throw new Error(`Job resume export not found: ${exportId}`);
  }
  return validateRoleResumeOutput(
    await showJobResumeRenderDocument(workspace, manifest.targetId),
    manifest.format,
    resolveWithin(workspace, status.outputPath),
    toolchain,
    exportId,
  );
}

export function formatExportJobResumeResult(result: ExportJobResumeResult): string {
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

export function formatExportAllJobResumeResult(result: ExportAllJobResumeResult): string {
  return [
    `Target ID: ${result.targetId}`,
    `Canonical document ID: ${result.canonicalDocumentId}`,
    `Succeeded: ${result.succeeded.map((entry) => entry.format).join(", ") || "none"}`,
    `Failed: ${result.failed.map((entry) => `${entry.format} (${entry.error})`).join("; ") || "none"}`,
    ...result.succeeded.map((entry) => `- ${entry.format}: ${entry.outputPath}`),
  ].join("\n");
}

export function formatJobResumeExportList(manifests: JobResumeExportManifest[]): string {
  if (!manifests.length) return "No Job resume exports found.";
  return manifests.map((manifest) =>
    `${manifest.exportId} | ${manifest.format} | ${manifest.profile.name} | ${manifest.outputPath} | ${manifest.updatedAt}`,
  ).join("\n");
}

export function formatJobResumeExportStatus(status: JobResumeExportStatus): string {
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

export function deterministicJobResumeFilename(
  document: JobResumeRenderDocument,
  format: RoleResumeExportFormat,
): string {
  const role = slug(document.metadata.targetRoleTitle) || "target-role";
  return `job-resume-${role}-${document.profile.name}-${format}.${extension(format)}`;
}

function jobResumeExportPaths(
  workspace: string,
  targetId: string,
  exportId: string,
  format: RoleResumeExportFormat,
  outputDirectory: string,
  document: JobResumeRenderDocument,
) {
  const root = `targets/jobs/${targetId}/resume-rendering/exports`;
  const exportRelativeDirectory = outputDirectory
    ? `${root}/${outputDirectory}/${exportId}`
    : `${root}/${exportId}`;
  const filename = deterministicJobResumeFilename(document, format);
  const outputRelativePath = `${exportRelativeDirectory}/${filename}`;
  const sourceMapRelativePath = `${exportRelativeDirectory}/source-map.json`;
  const manifestRelativePath = `${exportRelativeDirectory}/export-manifest.json`;
  return {
    filename,
    exportDirectory: resolveWithin(workspace, exportRelativeDirectory),
    outputRelativePath,
    outputPath: resolveWithin(workspace, outputRelativePath),
    sourceMapRelativePath,
    sourceMapPath: resolveWithin(workspace, sourceMapRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}

async function locateJobResumeExport(workspace: string, exportId: string) {
  const jobsRoot = resolveWithin(workspace, "targets/jobs");
  if (!(await pathExists(jobsRoot))) return null;
  for (const job of await readdir(jobsRoot, { withFileTypes: true })) {
    if (!job.isDirectory()) continue;
    const exportsRoot = path.join(
      jobsRoot,
      job.name,
      "resume-rendering",
      "exports",
    );
    if (!(await pathExists(exportsRoot))) continue;
    const manifests = (await walkFiles(exportsRoot)).filter(
      (file) => path.basename(file) === "export-manifest.json",
    );
    for (const manifestPath of manifests) {
      try {
        const manifest = JobResumeExportManifestSchema.parse(
          await readJson<unknown>(manifestPath, null),
        );
        if (manifest.exportId === exportId) {
          return { targetId: job.name, manifestPath };
        }
      } catch {
        if (manifestPath.split(path.sep).includes(exportId)) {
          return { targetId: job.name, manifestPath };
        }
      }
    }
  }
  return null;
}

async function assertOutputDirectorySafe(
  exportDirectory: string,
  manifestPath: string,
  rebuild: boolean,
  taskOwnedFilenames: string[],
) {
  if (!(await pathExists(exportDirectory))) return;
  if (!(await pathExists(manifestPath))) {
    const contents = await readdir(exportDirectory);
    if (contents.length && !rebuild) {
      throw new Error("Incomplete Job export exists; use explicit --rebuild.");
    }
    if (contents.some((entry) => !taskOwnedFilenames.includes(entry))) {
      throw new Error("Export directory contains unrelated files and has no ProofLayer manifest.");
    }
  }
}

function exportResult(
  manifest: JobResumeExportManifest,
  paths: ReturnType<typeof jobResumeExportPaths>,
  result: ExportJobResumeResult["result"],
): ExportJobResumeResult {
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

function emptyExportStatus(
  exportId: string,
  targetId: string,
  status: JobResumeExportStatus["status"],
  reasons: string[],
): JobResumeExportStatus {
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

function extension(format: RoleResumeExportFormat) {
  return format === "markdown" ? "md" : format;
}

function slug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function resolveWithin(workspace: string, relativePath: string) {
  if (path.isAbsolute(relativePath) || /^[A-Za-z]:[\\/]/.test(relativePath)) {
    throw new Error("Persisted output paths must be workspace-relative.");
  }
  const root = path.resolve(workspace);
  const absolute = path.resolve(root, relativePath);
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
    throw new Error("Output path escapes the ProofLayer workspace.");
  }
  return absolute;
}

function toRelative(workspace: string, filePath: string) {
  return path.relative(workspace, filePath).split(path.sep).join("/");
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function expectedJobResumeVisibleText(document: JobResumeRenderDocument) {
  return canonicalVisibleText(document);
}
