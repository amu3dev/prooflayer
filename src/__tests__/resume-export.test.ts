import { mkdir, mkdtemp, readFile, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { hashFile } from "../fs-utils.js";
import {
  AI_PRODUCT_EXPORT_DOCX,
  AI_PRODUCT_EXPORT_MARKDOWN,
  AI_PRODUCT_EXPORT_MANIFEST,
  AI_PRODUCT_EXPORT_PDF,
  AI_PRODUCT_FINAL_RESUME,
  TPM_EXPORT_DOCX,
  TPM_EXPORT_MARKDOWN,
  TPM_EXPORT_MANIFEST,
  TPM_EXPORT_PDF,
  TPM_FINAL_RESUME,
  exportFinalResume,
  formatResumeExportStatus,
  getResumeExportStatus,
  type ExportToolName,
  type ResumeExportOptions
} from "../resume-export.js";
import type { OutputManifest } from "../variant-generator.js";

describe("Slice 1.8 final resume export", () => {
  it("refuses unsupported roles and a missing final resume", async () => {
    const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-export-missing-"));
    await expect(exportFinalResume(workspace, "fullstack")).rejects.toThrow(
      "Resume export currently supports --role ai-product or --role tpm."
    );
    await expect(exportFinalResume(workspace, "ai-product")).rejects.toThrow(
      `Final resume is missing: ${AI_PRODUCT_FINAL_RESUME}`
    );
  });

  it.each([
    ["pandoc", 'Required export tool "pandoc" was not found in PATH.'],
    ["soffice", 'Required export tool "soffice" (LibreOffice) was not found in PATH.']
  ] as const)("fails clearly when %s is unavailable", async (missingTool, expectedMessage) => {
    const workspace = await createExportWorkspace();
    await expect(exportFinalResume(workspace, "ai-product", {
      resolveTool: async (tool) => tool === missingTool ? null : `/tools/${tool}`
    })).rejects.toThrow(expectedMessage);
  });

  it("exports immutable source content, registers artifacts, and detects source-hash staleness", async () => {
    const workspace = await createExportWorkspace();
    const sourcePath = path.join(workspace, AI_PRODUCT_FINAL_RESUME);
    const sourceBefore = await readFile(sourcePath, "utf8");
    const sourceBytesBefore = await readFile(sourcePath);
    const sourceHashBefore = await hashFile(sourcePath);
    const tpmPaths = [
      "outputs/variants/tpm/final-resume.md",
      "outputs/variants/tpm/final-website-copy.md",
      "outputs/variants/tpm/final-public-checklist.md",
      "outputs/variants/tpm/final-manifest.json"
    ];
    const tpmBefore = new Map(await Promise.all(tpmPaths.map(async (file) => [file, await readFile(path.join(workspace, file), "utf8")] as const)));

    const manifest = await exportFinalResume(workspace, "ai-product", fakeExportOptions());
    const docxPath = path.join(workspace, AI_PRODUCT_EXPORT_DOCX);
    const markdownPath = path.join(workspace, AI_PRODUCT_EXPORT_MARKDOWN);
    const pdfPath = path.join(workspace, AI_PRODUCT_EXPORT_PDF);
    const persistedManifest = JSON.parse(await readFile(path.join(workspace, AI_PRODUCT_EXPORT_MANIFEST), "utf8")) as typeof manifest;
    const outputManifest = JSON.parse(await readFile(path.join(workspace, "outputs/output-manifest.json"), "utf8")) as OutputManifest;
    const exportEntry = outputManifest.outputs.find((output) => output.publicationStatus === "export");

    expect(await readFile(markdownPath)).toEqual(sourceBytesBefore);
    expect(await readFile(docxPath, "utf8")).toBe("fixture DOCX");
    expect(await readFile(pdfPath, "utf8")).toBe("fixture PDF");
    expect(persistedManifest.sourceMarkdownHash).toBe(sourceHashBefore);
    expect(persistedManifest.exportedMarkdownPath).toBe(AI_PRODUCT_EXPORT_MARKDOWN);
    expect(persistedManifest.exportedMarkdownHash).toBe(sourceHashBefore);
    expect(persistedManifest.generatedFiles).toEqual([
      AI_PRODUCT_EXPORT_MARKDOWN,
      AI_PRODUCT_EXPORT_DOCX,
      AI_PRODUCT_EXPORT_PDF
    ]);
    expect(persistedManifest.verification.exportedMarkdownMatchesSource).toBe(true);
    expect(persistedManifest.profileFingerprint).toBe("profile-fingerprint");
    expect(persistedManifest.freshness).toBe("current");
    expect(exportEntry?.id).toBe("role_variant_ai-product_export");
    expect(exportEntry?.sourceMarkdownHash).toBe(sourceHashBefore);
    expect(exportEntry?.generatedFiles).toContain(AI_PRODUCT_EXPORT_MARKDOWN);
    expect(exportEntry?.generatedFiles).toContain(AI_PRODUCT_EXPORT_MANIFEST);
    expect(outputManifest.outputs.map((output) => output.publicationStatus).sort()).toEqual(["export", "final"]);
    expect(await readFile(sourcePath, "utf8")).toBe(sourceBefore);
    for (const file of tpmPaths) expect(await readFile(path.join(workspace, file), "utf8")).toBe(tpmBefore.get(file));

    const current = await getResumeExportStatus(workspace, "ai-product");
    expect(current.generated).toBe(true);
    expect(current.freshness).toBe("current");
    expect(current.filesPresent).toBe(true);
    expect(current.markdownPresent).toBe(true);
    expect(current.markdownCurrent).toBe(true);
    expect(current.docxCurrent).toBe(true);
    expect(current.pdfCurrent).toBe(true);
    expect(current.sourceExportMarkdownHashMatch).toBe(true);
    expect(formatResumeExportStatus(current)).toContain("Markdown: present/current");
    expect(formatResumeExportStatus(current)).toContain("Source/export Markdown hash match: yes");

    await writeFile(sourcePath, `${sourceBefore}\nChanged after export.\n`, "utf8");
    const stale = await getResumeExportStatus(workspace, "ai-product");
    expect(stale.freshness).toBe("stale");
    expect(stale.reasons).toContain("Source final Markdown hash changed.");
  });

  it("marks missing or modified Markdown stale and re-export repairs the exact copy", async () => {
    const workspace = await createExportWorkspace();
    const sourcePath = path.join(workspace, AI_PRODUCT_FINAL_RESUME);
    const markdownPath = path.join(workspace, AI_PRODUCT_EXPORT_MARKDOWN);
    const sourceBefore = await readFile(sourcePath);
    const sourceHashBefore = await hashFile(sourcePath);

    await exportFinalResume(workspace, "ai-product", fakeExportOptions());
    await unlink(markdownPath);
    const missing = await getResumeExportStatus(workspace, "ai-product");
    expect(missing.freshness).toBe("stale");
    expect(missing.markdownPresent).toBe(false);
    expect(missing.reasons).toContain("Exported Markdown is missing.");

    await writeFile(markdownPath, "tampered exported Markdown\n", "utf8");
    const modified = await getResumeExportStatus(workspace, "ai-product");
    expect(modified.freshness).toBe("stale");
    expect(modified.markdownCurrent).toBe(false);
    expect(modified.sourceExportMarkdownHashMatch).toBe(false);
    expect(modified.reasons).toContain("Exported Markdown hash does not match the source.");

    const repairedManifest = await exportFinalResume(workspace, "ai-product", fakeExportOptions());
    expect(await readFile(markdownPath)).toEqual(sourceBefore);
    expect(repairedManifest.exportedMarkdownHash).toBe(sourceHashBefore);
    expect((await getResumeExportStatus(workspace, "ai-product")).freshness).toBe("current");
    expect(await readFile(sourcePath)).toEqual(sourceBefore);
  });

  it("exports TPM separately while preserving the current AI Product export", async () => {
    const workspace = await createExportWorkspace();
    await exportFinalResume(workspace, "ai-product", fakeExportOptions());
    const aiDocxBefore = await readFile(path.join(workspace, AI_PRODUCT_EXPORT_DOCX), "utf8");
    const aiMarkdownBefore = await readFile(path.join(workspace, AI_PRODUCT_EXPORT_MARKDOWN));
    const aiPdfBefore = await readFile(path.join(workspace, AI_PRODUCT_EXPORT_PDF), "utf8");
    const aiManifestBefore = await readFile(path.join(workspace, AI_PRODUCT_EXPORT_MANIFEST), "utf8");
    const tpmSourcePath = path.join(workspace, TPM_FINAL_RESUME);
    const tpmSourceBefore = await readFile(tpmSourcePath, "utf8");

    const manifest = await exportFinalResume(workspace, "tpm", fakeExportOptions());
    const outputManifest = JSON.parse(await readFile(path.join(workspace, "outputs/output-manifest.json"), "utf8")) as OutputManifest;
    const exportEntries = outputManifest.outputs.filter((output) => output.publicationStatus === "export");

    expect(manifest.roleKey).toBe("tpm");
    expect(manifest.generatedFiles).toEqual([TPM_EXPORT_MARKDOWN, TPM_EXPORT_DOCX, TPM_EXPORT_PDF]);
    expect(manifest.sourceMarkdownPath).toBe(TPM_FINAL_RESUME);
    expect(await readFile(path.join(workspace, TPM_EXPORT_MARKDOWN), "utf8")).toBe(tpmSourceBefore);
    expect(await readFile(path.join(workspace, TPM_EXPORT_DOCX), "utf8")).toBe("fixture DOCX");
    expect(await readFile(path.join(workspace, TPM_EXPORT_PDF), "utf8")).toBe("fixture PDF");
    expect(JSON.parse(await readFile(path.join(workspace, TPM_EXPORT_MANIFEST), "utf8")).roleKey).toBe("tpm");
    expect(exportEntries.map((entry) => entry.variantRoleKey).sort()).toEqual(["ai-product", "tpm"]);
    expect(exportEntries.find((entry) => entry.variantRoleKey === "tpm")?.generatedFiles).toContain(TPM_EXPORT_MARKDOWN);
    expect(await readFile(tpmSourcePath, "utf8")).toBe(tpmSourceBefore);
    expect(await readFile(path.join(workspace, AI_PRODUCT_EXPORT_MARKDOWN))).toEqual(aiMarkdownBefore);
    expect(await readFile(path.join(workspace, AI_PRODUCT_EXPORT_DOCX), "utf8")).toBe(aiDocxBefore);
    expect(await readFile(path.join(workspace, AI_PRODUCT_EXPORT_PDF), "utf8")).toBe(aiPdfBefore);
    expect(await readFile(path.join(workspace, AI_PRODUCT_EXPORT_MANIFEST), "utf8")).toBe(aiManifestBefore);
    expect((await getResumeExportStatus(workspace, "ai-product")).freshness).toBe("current");
    expect((await getResumeExportStatus(workspace, "tpm")).freshness).toBe("current");

    await writeFile(tpmSourcePath, `${tpmSourceBefore}\nChanged after TPM export.\n`, "utf8");
    const staleTpm = await getResumeExportStatus(workspace, "tpm");
    expect(staleTpm.freshness).toBe("stale");
    expect(staleTpm.reasons).toContain("Source final Markdown hash changed.");
    expect((await getResumeExportStatus(workspace, "ai-product")).freshness).toBe("current");
  });
});

async function createExportWorkspace(): Promise<string> {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-export-"));
  const files: Record<string, string> = {
    [AI_PRODUCT_FINAL_RESUME]: "# Ahmed Yosry\n\nAI Product Manager\n",
    "outputs/variants/ai-product/final-manifest.json": JSON.stringify({
      outputId: "role_variant_ai-product_final",
      roleKey: "ai-product",
      profileFingerprint: "profile-fingerprint",
      claimIdsUsed: ["claim_ai"],
      evidenceIdsUsed: ["evi_ai"],
      finalizationReadiness: "ready",
      freshness: "current"
    }),
    "outputs/reports/ai-product-final-export-readiness-review.md": "# Review\n\nReady.\n",
    "kb/update-baseline.json": JSON.stringify({ profileFingerprint: "profile-fingerprint" }),
    [TPM_FINAL_RESUME]: "TPM resume must remain unchanged.\n",
    "outputs/variants/tpm/final-website-copy.md": "TPM website must remain unchanged.\n",
    "outputs/variants/tpm/final-public-checklist.md": "TPM checklist must remain unchanged.\n",
    "outputs/variants/tpm/final-manifest.json": JSON.stringify({
      outputId: "role_variant_tpm_final",
      roleKey: "tpm",
      profileFingerprint: "profile-fingerprint",
      claimIdsUsed: ["claim_tpm"],
      evidenceIdsUsed: ["evi_tpm"],
      finalizationReadiness: "ready",
      freshness: "current"
    }),
    "outputs/output-manifest.json": JSON.stringify({
      schemaVersion: 1,
      updatedAt: "2026-07-18T09:00:00.000Z",
      outputs: [{
        id: "role_variant_ai-product_final",
        variantRoleKey: "ai-product",
        generatedFiles: [AI_PRODUCT_FINAL_RESUME],
        generatedAt: "2026-07-18T09:00:00.000Z",
        profileFingerprint: "profile-fingerprint",
        claimIdsUsed: ["claim_ai"],
        evidenceIdsUsed: ["evi_ai"],
        publicationStatus: "final",
        freshness: "current"
      }]
    })
  };
  for (const [relativePath, contents] of Object.entries(files)) {
    const filePath = path.join(workspace, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents, "utf8");
  }
  return workspace;
}

function fakeExportOptions(): ResumeExportOptions {
  return {
    now: () => new Date("2026-07-18T10:00:00.000Z"),
    resolveTool: async (tool: ExportToolName) => `/tools/${tool}`,
    runTool: async (executable, args) => {
      if (executable.endsWith("pandoc")) {
        const outputIndex = args.indexOf("--output");
        await writeFile(args[outputIndex + 1], "fixture DOCX", "utf8");
        return;
      }
      const outputDirectory = args[args.indexOf("--outdir") + 1];
      const inputDocx = args.at(-1) ?? "resume.docx";
      const outputPdf = path.join(outputDirectory, `${path.basename(inputDocx, ".docx")}.pdf`);
      await writeFile(outputPdf, "fixture PDF", "utf8");
    }
  };
}
