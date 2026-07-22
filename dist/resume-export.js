import { constants as fsConstants } from "node:fs";
import { access, copyFile, mkdtemp, rename, rm, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ensureDir, hashFile, pathExists, readJson, writeJsonAtomic } from "./fs-utils.js";
export const RESUME_EXPORT_ROOT = "outputs/exports";
export const AI_PRODUCT_EXPORT_DIRECTORY = `${RESUME_EXPORT_ROOT}/ai-product`;
export const AI_PRODUCT_EXPORT_MARKDOWN = `${AI_PRODUCT_EXPORT_DIRECTORY}/Ahmed_Yosry_AI_Product_Manager_Final.md`;
export const AI_PRODUCT_EXPORT_DOCX = `${AI_PRODUCT_EXPORT_DIRECTORY}/Ahmed_Yosry_AI_Product_Manager_Final.docx`;
export const AI_PRODUCT_EXPORT_PDF = `${AI_PRODUCT_EXPORT_DIRECTORY}/Ahmed_Yosry_AI_Product_Manager_Final.pdf`;
export const AI_PRODUCT_EXPORT_MANIFEST = `${AI_PRODUCT_EXPORT_DIRECTORY}/export-manifest.json`;
export const AI_PRODUCT_FINAL_RESUME = "outputs/variants/ai-product/final-resume.md";
export const AI_PRODUCT_FINAL_MANIFEST = "outputs/variants/ai-product/final-manifest.json";
export const AI_PRODUCT_READINESS_REVIEW = "outputs/reports/ai-product-final-export-readiness-review.md";
export const TPM_EXPORT_DIRECTORY = `${RESUME_EXPORT_ROOT}/tpm`;
export const TPM_EXPORT_MARKDOWN = `${TPM_EXPORT_DIRECTORY}/Ahmed_Yosry_TPM_Final.md`;
export const TPM_EXPORT_DOCX = `${TPM_EXPORT_DIRECTORY}/Ahmed_Yosry_TPM_Final.docx`;
export const TPM_EXPORT_PDF = `${TPM_EXPORT_DIRECTORY}/Ahmed_Yosry_TPM_Final.pdf`;
export const TPM_EXPORT_MANIFEST = `${TPM_EXPORT_DIRECTORY}/export-manifest.json`;
export const TPM_FINAL_RESUME = "outputs/variants/tpm/final-resume.md";
export const TPM_FINAL_MANIFEST = "outputs/variants/tpm/final-manifest.json";
export const TPM_READINESS_REVIEW = "outputs/variants/tpm/final-public-checklist.md";
const OUTPUT_MANIFEST_PATH = "outputs/output-manifest.json";
const UPDATE_BASELINE_PATH = "kb/update-baseline.json";
const RESUME_EXPORT_CONFIGS = {
    "ai-product": {
        roleKey: "ai-product",
        sourceMarkdownPath: AI_PRODUCT_FINAL_RESUME,
        finalManifestPath: AI_PRODUCT_FINAL_MANIFEST,
        readinessReviewPath: AI_PRODUCT_READINESS_REVIEW,
        outputDirectory: AI_PRODUCT_EXPORT_DIRECTORY,
        markdownPath: AI_PRODUCT_EXPORT_MARKDOWN,
        docxPath: AI_PRODUCT_EXPORT_DOCX,
        pdfPath: AI_PRODUCT_EXPORT_PDF,
        exportManifestPath: AI_PRODUCT_EXPORT_MANIFEST,
        baseName: "Ahmed_Yosry_AI_Product_Manager_Final"
    },
    tpm: {
        roleKey: "tpm",
        sourceMarkdownPath: TPM_FINAL_RESUME,
        finalManifestPath: TPM_FINAL_MANIFEST,
        readinessReviewPath: TPM_READINESS_REVIEW,
        outputDirectory: TPM_EXPORT_DIRECTORY,
        markdownPath: TPM_EXPORT_MARKDOWN,
        docxPath: TPM_EXPORT_DOCX,
        pdfPath: TPM_EXPORT_PDF,
        exportManifestPath: TPM_EXPORT_MANIFEST,
        baseName: "Ahmed_Yosry_TPM_Final"
    }
};
export async function exportFinalResume(workspace, roleKeyInput, options = {}) {
    const config = requireSupportedExportRole(roleKeyInput);
    const roleKey = config.roleKey;
    const sourcePath = path.join(workspace, config.sourceMarkdownPath);
    const finalManifestPath = path.join(workspace, config.finalManifestPath);
    const readinessReviewPath = path.join(workspace, config.readinessReviewPath);
    if (!(await pathExists(sourcePath)))
        throw new Error(`Final resume is missing: ${config.sourceMarkdownPath}`);
    if (!(await pathExists(finalManifestPath)))
        throw new Error(`Final manifest is missing: ${config.finalManifestPath}`);
    if (!(await pathExists(readinessReviewPath)))
        throw new Error(`Export readiness review is missing: ${config.readinessReviewPath}`);
    const finalManifest = await readJson(finalManifestPath, null);
    if (!finalManifest?.profileFingerprint)
        throw new Error("Final manifest does not contain a profile fingerprint.");
    if (finalManifest.roleKey !== roleKey)
        throw new Error(`Final manifest role mismatch: expected ${roleKey}.`);
    if (finalManifest.finalizationReadiness !== "ready")
        throw new Error("Final resume is not marked ready for export.");
    const baseline = await readJson(path.join(workspace, UPDATE_BASELINE_PATH), null);
    if (!baseline || baseline.profileFingerprint !== finalManifest.profileFingerprint) {
        throw new Error("Final resume is stale relative to the current career profile. Finalize it again before export.");
    }
    const resolveTool = options.resolveTool ?? resolveExecutable;
    const pandoc = await resolveTool("pandoc");
    if (!pandoc)
        throw new Error('Required export tool "pandoc" was not found in PATH.');
    const soffice = await resolveTool("soffice");
    if (!soffice)
        throw new Error('Required export tool "soffice" (LibreOffice) was not found in PATH.');
    const sourceMarkdownHash = await hashFile(sourcePath);
    const outputDirectory = path.join(workspace, config.outputDirectory);
    await ensureDir(outputDirectory);
    const temporaryDirectory = await mkdtemp(path.join(outputDirectory, ".prooflayer-export-"));
    const temporaryMarkdown = path.join(temporaryDirectory, `${config.baseName}.md`);
    const temporaryDocx = path.join(temporaryDirectory, `${config.baseName}.docx`);
    const temporaryPdf = path.join(temporaryDirectory, `${config.baseName}.pdf`);
    const libreOfficeProfile = path.join(temporaryDirectory, "libreoffice-profile");
    const runTool = options.runTool ?? runExecutable;
    try {
        await copyFile(sourcePath, temporaryMarkdown);
        await assertNonEmptyFile(temporaryMarkdown, "Markdown");
        const exportedMarkdownHash = await hashFile(temporaryMarkdown);
        if (exportedMarkdownHash !== sourceMarkdownHash) {
            throw new Error("Exported Markdown does not match the reviewed final source.");
        }
        await runTool(pandoc, [
            sourcePath,
            "--from=gfm",
            "--to=docx",
            "--standalone",
            "--output",
            temporaryDocx
        ], { cwd: workspace });
        await assertNonEmptyFile(temporaryDocx, "DOCX");
        await runTool(soffice, [
            `-env:UserInstallation=${pathToFileURL(libreOfficeProfile).href}`,
            "--headless",
            "--convert-to",
            "pdf:writer_pdf_Export",
            "--outdir",
            temporaryDirectory,
            temporaryDocx
        ], { cwd: workspace });
        await assertNonEmptyFile(temporaryPdf, "PDF");
        if (await hashFile(sourcePath) !== sourceMarkdownHash) {
            throw new Error("Source Markdown changed during export; generated artifacts were not registered.");
        }
        const markdownPath = path.join(workspace, config.markdownPath);
        const docxPath = path.join(workspace, config.docxPath);
        const pdfPath = path.join(workspace, config.pdfPath);
        await rename(temporaryMarkdown, markdownPath);
        await rename(temporaryDocx, docxPath);
        await rename(temporaryPdf, pdfPath);
        await assertNonEmptyFile(markdownPath, "Markdown");
        await assertNonEmptyFile(docxPath, "DOCX");
        await assertNonEmptyFile(pdfPath, "PDF");
        const persistedMarkdownHash = await hashFile(markdownPath);
        if (persistedMarkdownHash !== sourceMarkdownHash) {
            throw new Error("Persisted exported Markdown does not match the reviewed final source.");
        }
        const exportedAt = (options.now ?? (() => new Date()))().toISOString();
        const manifest = {
            schemaVersion: 2,
            outputId: `role_variant_${roleKey}_export`,
            roleKey,
            sourceMarkdownPath: config.sourceMarkdownPath,
            sourceMarkdownHash,
            exportedMarkdownPath: config.markdownPath,
            exportedMarkdownHash: persistedMarkdownHash,
            exportedAt,
            generatedFiles: [config.markdownPath, config.docxPath, config.pdfPath],
            exportToolUsed: "Atomic Markdown copy + Pandoc (DOCX) + LibreOffice (PDF)",
            profileFingerprint: finalManifest.profileFingerprint,
            finalManifestPath: config.finalManifestPath,
            readinessReviewPath: config.readinessReviewPath,
            freshness: "current",
            verification: {
                exportedMarkdownMatchesSource: true
            }
        };
        await writeJsonAtomic(path.join(workspace, config.exportManifestPath), manifest);
        await registerExportOutput(workspace, manifest, finalManifest, config.exportManifestPath);
        return manifest;
    }
    finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
    }
}
export async function getResumeExportStatus(workspace, roleKeyInput) {
    return inspectConfiguredResumeExportStatus(workspace, requireSupportedExportRole(roleKeyInput));
}
export async function inspectResumeExportStatus(workspace, roleKey) {
    const config = exportConfigForRole(roleKey);
    const defaultStatus = {
        roleKey,
        generated: false,
        freshness: "not_generated",
        path: `${RESUME_EXPORT_ROOT}/${roleKey}`,
        sourceMarkdownPath: config?.sourceMarkdownPath ?? `outputs/variants/${roleKey}/final-resume.md`,
        filesPresent: false,
        markdownPresent: false,
        markdownCurrent: false,
        docxPresent: false,
        docxCurrent: false,
        pdfPresent: false,
        pdfCurrent: false,
        sourceExportMarkdownHashMatch: false,
        reasons: []
    };
    if (!config)
        return defaultStatus;
    return inspectConfiguredResumeExportStatus(workspace, config);
}
async function inspectConfiguredResumeExportStatus(workspace, config) {
    const defaultStatus = {
        roleKey: config.roleKey,
        generated: false,
        freshness: "not_generated",
        path: config.outputDirectory,
        sourceMarkdownPath: config.sourceMarkdownPath,
        filesPresent: false,
        markdownPresent: false,
        markdownCurrent: false,
        docxPresent: false,
        docxCurrent: false,
        pdfPresent: false,
        pdfCurrent: false,
        sourceExportMarkdownHashMatch: false,
        reasons: []
    };
    const manifestPath = path.join(workspace, config.exportManifestPath);
    if (!(await pathExists(manifestPath)))
        return defaultStatus;
    const manifest = await readJson(manifestPath, null);
    if (!manifest)
        return { ...defaultStatus, generated: true, freshness: "stale", reasons: ["Export manifest is invalid."] };
    const reasons = [];
    const markdownPath = path.join(workspace, config.markdownPath);
    const docxPath = path.join(workspace, config.docxPath);
    const pdfPath = path.join(workspace, config.pdfPath);
    const [markdownPresent, docxPresent, pdfPresent] = await Promise.all([
        pathExists(markdownPath),
        pathExists(docxPath),
        pathExists(pdfPath)
    ]);
    if (!markdownPresent)
        reasons.push("Exported Markdown is missing.");
    if (!docxPresent)
        reasons.push("DOCX export is missing.");
    if (!pdfPresent)
        reasons.push("PDF export is missing.");
    let sourceHashMatches = false;
    let sourceExportMarkdownHashMatch = false;
    const sourcePath = path.join(workspace, manifest.sourceMarkdownPath ?? config.sourceMarkdownPath);
    if (!(await pathExists(sourcePath))) {
        reasons.push("Source final Markdown is missing.");
    }
    else {
        const currentSourceHash = await hashFile(sourcePath);
        sourceHashMatches = currentSourceHash === manifest.sourceMarkdownHash;
        if (!sourceHashMatches)
            reasons.push("Source final Markdown hash changed.");
        if (markdownPresent) {
            const currentExportedMarkdownHash = await hashFile(markdownPath);
            sourceExportMarkdownHashMatch = currentExportedMarkdownHash === currentSourceHash;
            if (!sourceExportMarkdownHashMatch)
                reasons.push("Exported Markdown hash does not match the source.");
            if (manifest.exportedMarkdownHash && currentExportedMarkdownHash !== manifest.exportedMarkdownHash) {
                reasons.push("Exported Markdown hash changed after export.");
            }
        }
    }
    if (manifest.exportedMarkdownPath !== config.markdownPath)
        reasons.push("Export manifest does not register the Markdown artifact.");
    if (manifest.verification?.exportedMarkdownMatchesSource !== true)
        reasons.push("Export manifest lacks Markdown hash verification.");
    const baseline = await readJson(path.join(workspace, UPDATE_BASELINE_PATH), null);
    const profileMatches = Boolean(baseline && baseline.profileFingerprint === manifest.profileFingerprint);
    if (!profileMatches)
        reasons.push("Career profile fingerprint changed.");
    const finalManifestPath = manifest.finalManifestPath ?? config.finalManifestPath;
    const finalManifest = await readJson(path.join(workspace, finalManifestPath), null);
    const finalManifestMatches = Boolean(finalManifest && finalManifest.profileFingerprint === manifest.profileFingerprint);
    if (!finalManifestMatches)
        reasons.push("Final resume manifest fingerprint changed.");
    const artifactBasisCurrent = sourceHashMatches && profileMatches && finalManifestMatches;
    const markdownCurrent = markdownPresent && sourceExportMarkdownHashMatch && artifactBasisCurrent;
    const docxCurrent = docxPresent && artifactBasisCurrent;
    const pdfCurrent = pdfPresent && artifactBasisCurrent;
    return {
        roleKey: config.roleKey,
        generated: true,
        freshness: reasons.length > 0 ? "stale" : "current",
        exportedAt: manifest.exportedAt,
        path: config.outputDirectory,
        sourceMarkdownPath: manifest.sourceMarkdownPath ?? config.sourceMarkdownPath,
        sourceMarkdownHash: manifest.sourceMarkdownHash,
        filesPresent: markdownPresent && docxPresent && pdfPresent,
        markdownPresent,
        markdownCurrent,
        docxPresent,
        docxCurrent,
        pdfPresent,
        pdfCurrent,
        sourceExportMarkdownHashMatch,
        reasons
    };
}
export function formatResumeExportStatus(status) {
    return [
        `Resume export (${status.roleKey}): ${status.generated ? "generated" : "not generated"}`,
        `Freshness: ${status.freshness}`,
        `Markdown: ${formatArtifactStatus(status.markdownPresent, status.markdownCurrent)}`,
        `DOCX: ${formatArtifactStatus(status.docxPresent, status.docxCurrent)}`,
        `PDF: ${formatArtifactStatus(status.pdfPresent, status.pdfCurrent)}`,
        `Source/export Markdown hash match: ${status.sourceExportMarkdownHashMatch ? "yes" : "no"}`,
        `Files present: ${status.filesPresent ? "yes" : "no"}`,
        `Exported at: ${status.exportedAt ?? "none"}`,
        `Export path: ${status.path}`,
        `Reasons: ${status.reasons.join("; ") || "none"}`
    ].join("\n");
}
function formatArtifactStatus(present, current) {
    if (!present)
        return "missing/stale";
    return current ? "present/current" : "present/stale";
}
function requireSupportedExportRole(value) {
    const config = exportConfigForRole(value);
    if (!config)
        throw new Error("Resume export currently supports --role ai-product or --role tpm.");
    return config;
}
function exportConfigForRole(value) {
    return value === "ai-product" || value === "tpm" ? RESUME_EXPORT_CONFIGS[value] : undefined;
}
async function resolveExecutable(tool) {
    const directories = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
    for (const directory of directories) {
        const candidate = path.join(directory, tool);
        try {
            await access(candidate, fsConstants.X_OK);
            return candidate;
        }
        catch {
            // Continue through PATH until an executable candidate is found.
        }
    }
    return null;
}
async function runExecutable(executable, args, options) {
    await new Promise((resolve, reject) => {
        execFile(executable, args, {
            cwd: options.cwd,
            env: { ...process.env, ...options.env },
            maxBuffer: 10 * 1024 * 1024
        }, (error, stdout, stderr) => {
            if (!error) {
                resolve();
                return;
            }
            const details = String(stderr || stdout || error.message).trim();
            reject(new Error(`${path.basename(executable)} failed${details ? `: ${details}` : "."}`));
        });
    });
}
async function assertNonEmptyFile(filePath, label) {
    if (!(await pathExists(filePath)))
        throw new Error(`${label} export was not created.`);
    const fileStat = await stat(filePath);
    if (!fileStat.isFile() || fileStat.size === 0)
        throw new Error(`${label} export is empty or invalid.`);
}
async function registerExportOutput(workspace, manifest, finalManifest, exportManifestPath) {
    const registryPath = path.join(workspace, OUTPUT_MANIFEST_PATH);
    const registry = await readJson(registryPath, {
        schemaVersion: 1,
        updatedAt: manifest.exportedAt,
        outputs: []
    });
    const entry = {
        id: manifest.outputId,
        variantRoleKey: manifest.roleKey,
        generatedFiles: [...manifest.generatedFiles, exportManifestPath],
        generatedAt: manifest.exportedAt,
        profileFingerprint: manifest.profileFingerprint,
        claimIdsUsed: finalManifest.claimIdsUsed ?? [],
        evidenceIdsUsed: finalManifest.evidenceIdsUsed ?? [],
        publicationStatus: "export",
        freshness: "current",
        sourceMarkdownPath: manifest.sourceMarkdownPath,
        sourceMarkdownHash: manifest.sourceMarkdownHash,
        sourceArtifactId: finalManifest.outputId
    };
    const outputs = registry.outputs.filter((output) => output.id !== entry.id);
    outputs.push(entry);
    outputs.sort((a, b) => a.variantRoleKey.localeCompare(b.variantRoleKey) || a.publicationStatus.localeCompare(b.publicationStatus));
    await writeJsonAtomic(registryPath, { schemaVersion: 1, updatedAt: manifest.exportedAt, outputs });
}
