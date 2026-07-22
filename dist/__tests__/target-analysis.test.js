import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { hashFile } from "../fs-utils.js";
import { TARGET_ANALYZER_NAME, TARGET_ANALYZER_VERSION, analyzeTarget, formatAnalyzeTargetResult, formatTargetAnalysisStatus, getTargetAnalysisStatus, showTargetAnalysis, } from "../target-analysis.js";
import { createJobTarget, createRoleTarget } from "../targets.js";
const FIRST_TIME = "2026-07-19T12:00:00.000Z";
const SECOND_TIME = "2026-07-20T12:00:00.000Z";
const STRUCTURED_JOB = [
    "---",
    "title: Engineering Manager",
    "company: ExampleCo",
    "location: Berlin, Germany",
    "workingModel: Hybrid",
    "---",
    "",
    "# Engineering Manager",
    "Lead a platform team without changing this source wording.",
    "",
    "## Responsibilities",
    "- Coordinate product and engineering delivery as one intact statement.",
    "1. Support roadmap decisions across platform work.",
    "",
    "## Required Qualifications",
    "* Experience delivering software platforms.",
    "",
    "## Preferred Qualifications",
    "+ Experience with distributed systems.",
    "",
    "## Culture and Values",
    "Collaborate openly",
    "across disciplines.",
    "",
].join("\n");
describe("Slice 2.2 target analysis foundation", () => {
    it("creates a minimal role analysis without inventing role requirements", async () => {
        const workspace = await temporaryWorkspace();
        const role = await createRoleTarget(workspace, { title: "Engineering Manager" }, { now: () => new Date(FIRST_TIME) });
        const result = await analyzeTarget(workspace, role.target.id, {
            now: () => new Date(FIRST_TIME),
        });
        const analysis = await showTargetAnalysis(workspace, role.target.id);
        expect(result.result).toBe("created");
        expect(analysis.targetType).toBe("role");
        expect(analysis.sections).toEqual([]);
        expect(analysis.items).toEqual([]);
        expect(analysis.warnings).toEqual([
            {
                code: "ROLE_SEMANTIC_INTERPRETATION_NOT_AVAILABLE",
                message: "No deterministic requirement source is available for this role target.",
            },
        ]);
        expect(formatAnalyzeTargetResult(result)).toContain("Sections: 0");
    });
    it("detects headings and classifies only explicit mapped headings", async () => {
        const fixture = await structuredJobWorkspace();
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const analysis = await showTargetAnalysis(fixture.workspace, fixture.targetId);
        expect(analysis.sections.map((section) => [section.heading, section.classification])).toEqual([
            ["Engineering Manager", "unknown"],
            ["Responsibilities", "responsibilities"],
            ["Required Qualifications", "required"],
            ["Preferred Qualifications", "preferred"],
            ["Culture and Values", "unknown"],
        ]);
        expect(analysis.sections.find((section) => section.heading === "Responsibilities"))
            .toMatchObject({ headingLevel: 2, normalizedHeading: "responsibilities", classificationBasis: "explicit-heading" });
        expect(analysis.sections.find((section) => section.heading === "Culture and Values"))
            .toMatchObject({ classification: "unknown", classificationBasis: "none" });
    });
    it("extracts unordered lists, ordered lists, and intact paragraphs without semantic splitting", async () => {
        const fixture = await structuredJobWorkspace();
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const analysis = await showTargetAnalysis(fixture.workspace, fixture.targetId);
        const nonMetadata = analysis.items.filter((item) => item.kind !== "front-matter-field");
        expect(nonMetadata.map((item) => item.kind)).toEqual([
            "paragraph",
            "list-item",
            "list-item",
            "list-item",
            "list-item",
            "paragraph",
        ]);
        expect(nonMetadata.find((item) => item.statement.startsWith("Coordinate"))).toMatchObject({
            statement: "Coordinate product and engineering delivery as one intact statement.",
            rawText: "- Coordinate product and engineering delivery as one intact statement.",
            necessity: "contextual",
            category: "responsibility",
        });
        expect(nonMetadata.find((item) => item.statement.startsWith("Support roadmap")))
            .toMatchObject({ necessity: "contextual", category: "responsibility" });
        expect(nonMetadata.find((item) => item.statement.startsWith("Experience delivering")))
            .toMatchObject({ necessity: "required", category: "qualification" });
        expect(nonMetadata.find((item) => item.statement.startsWith("Experience with distributed")))
            .toMatchObject({ necessity: "preferred", category: "qualification" });
        expect(nonMetadata.at(-1)?.statement).toBe("Collaborate openly across disciplines.");
    });
    it("source-references front matter without turning metadata into requirements", async () => {
        const fixture = await structuredJobWorkspace();
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const analysis = await showTargetAnalysis(fixture.workspace, fixture.targetId);
        const metadata = analysis.items.filter((item) => item.kind === "front-matter-field");
        expect(metadata).toHaveLength(4);
        expect(metadata.map((item) => item.statement)).toEqual([
            "title: Engineering Manager",
            "company: ExampleCo",
            "location: Berlin, Germany",
            "workingModel: Hybrid",
        ]);
        expect(metadata.every((item) => item.necessity === "unknown")).toBe(true);
        expect(metadata.every((item) => item.category === "unknown")).toBe(true);
        expect(metadata.every((item) => item.extractionMethod === "explicit-front-matter")).toBe(true);
        expect(metadata[0]?.sourceReferences[0]).toMatchObject({ startLine: 2, endLine: 2 });
    });
    it("uses 1-based inclusive lines and exact byte-range excerpt hashes", async () => {
        const fixture = await structuredJobWorkspace();
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const analysis = await showTargetAnalysis(fixture.workspace, fixture.targetId);
        const sourcePath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md");
        const source = await readFile(sourcePath);
        const responsibility = analysis.items.find((item) => item.statement.startsWith("Coordinate"));
        const reference = responsibility?.sourceReferences[0];
        expect(reference).toMatchObject({
            sourceType: "job-description-markdown",
            startLine: 12,
            endLine: 12,
        });
        expect(reference?.sha256).toBe(createHash("sha256").update(source).digest("hex"));
        const exactExcerpt = source.subarray(reference?.startOffset, reference?.endOffset);
        expect(createHash("sha256").update(exactExcerpt).digest("hex")).toBe(reference?.excerptSha256);
        expect(exactExcerpt.toString("utf8")).toBe("- Coordinate product and engineering delivery as one intact statement.\n");
    });
    it("does not rewrite unchanged analysis and preserves timestamps and stable IDs", async () => {
        const fixture = await structuredJobWorkspace();
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const analysisPath = targetArtifact(fixture.workspace, fixture.targetId, "target-analysis.json");
        const manifestPath = targetArtifact(fixture.workspace, fixture.targetId, "analysis-manifest.json");
        const [firstAnalysis, firstManifest, firstAnalysisStat, firstManifestStat] = await Promise.all([
            readFile(analysisPath),
            readFile(manifestPath),
            stat(analysisPath),
            stat(manifestPath),
        ]);
        const firstParsed = await showTargetAnalysis(fixture.workspace, fixture.targetId);
        const result = await analyzeTarget(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        const [secondAnalysis, secondManifest, secondAnalysisStat, secondManifestStat] = await Promise.all([
            readFile(analysisPath),
            readFile(manifestPath),
            stat(analysisPath),
            stat(manifestPath),
        ]);
        expect(result.result).toBe("already-current");
        expect(secondAnalysis).toEqual(firstAnalysis);
        expect(secondManifest).toEqual(firstManifest);
        expect(secondAnalysisStat.mtimeMs).toBe(firstAnalysisStat.mtimeMs);
        expect(secondManifestStat.mtimeMs).toBe(firstManifestStat.mtimeMs);
        expect((await showTargetAnalysis(fixture.workspace, fixture.targetId)).updatedAt).toBe(FIRST_TIME);
        await analyzeTarget(fixture.workspace, fixture.targetId, {
            rebuild: true,
            now: () => new Date(SECOND_TIME),
        });
        const rebuilt = await showTargetAnalysis(fixture.workspace, fixture.targetId);
        expect(rebuilt.createdAt).toBe(FIRST_TIME);
        expect(rebuilt.updatedAt).toBe(SECOND_TIME);
        expect(rebuilt.sections.map((section) => section.id)).toEqual(firstParsed.sections.map((section) => section.id));
        expect(rebuilt.items.map((item) => item.id)).toEqual(firstParsed.items.map((item) => item.id));
    });
    it("reports missing and current status without regeneration", async () => {
        const fixture = await structuredJobWorkspace();
        const missing = await getTargetAnalysisStatus(fixture.workspace, fixture.targetId);
        expect(missing.status).toBe("missing");
        expect(missing.analysisExists).toBe(false);
        expect(formatTargetAnalysisStatus(missing)).toContain("Overall status: missing");
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const current = await getTargetAnalysisStatus(fixture.workspace, fixture.targetId);
        expect(current).toMatchObject({
            status: "current",
            targetHashMatches: true,
            sourceHashMatches: true,
            analyzerVersionMatches: true,
            analysisHashMatches: true,
        });
    });
    it("marks analyzer changes stale and preserves createdAt when rebuilt", async () => {
        const fixture = await structuredJobWorkspace();
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const stale = await getTargetAnalysisStatus(fixture.workspace, fixture.targetId, {
            analyzerVersion: "2",
        });
        expect(stale.status).toBe("stale");
        expect(stale.analyzerVersionMatches).toBe(false);
        await analyzeTarget(fixture.workspace, fixture.targetId, {
            analyzerVersion: "2",
            now: () => new Date(SECOND_TIME),
        });
        const rebuilt = await showTargetAnalysis(fixture.workspace, fixture.targetId);
        expect(rebuilt.analyzer).toEqual({ name: TARGET_ANALYZER_NAME, version: "2", mode: "deterministic" });
        expect(rebuilt.createdAt).toBe(FIRST_TIME);
        expect(rebuilt.updatedAt).toBe(SECOND_TIME);
    });
    it("marks changed source stale and rejects missing or mismatched persisted sources", async () => {
        const fixture = await structuredJobWorkspace();
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const sourcePath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md");
        await writeFile(sourcePath, `${STRUCTURED_JOB}\nChanged after import.`, "utf8");
        const changed = await getTargetAnalysisStatus(fixture.workspace, fixture.targetId);
        expect(changed.status).toBe("stale");
        expect(changed.sourceHashMatches).toBe(false);
        await expect(analyzeTarget(fixture.workspace, fixture.targetId)).rejects.toThrow("Persisted job description hash does not match");
        await rm(sourcePath);
        await expect(analyzeTarget(fixture.workspace, fixture.targetId)).rejects.toThrow("Persisted job description is missing");
    });
    it("detects invalid manifests and analysis hash mismatches without silent overwrite", async () => {
        const fixture = await structuredJobWorkspace();
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const manifestPath = targetArtifact(fixture.workspace, fixture.targetId, "analysis-manifest.json");
        await writeFile(manifestPath, "{ invalid", "utf8");
        expect((await getTargetAnalysisStatus(fixture.workspace, fixture.targetId)).status).toBe("invalid");
        await expect(analyzeTarget(fixture.workspace, fixture.targetId)).rejects.toThrow("Stored analysis is invalid and was not overwritten");
        await analyzeTarget(fixture.workspace, fixture.targetId, {
            rebuild: true,
            now: () => new Date(SECOND_TIME),
        });
        const analysisPath = targetArtifact(fixture.workspace, fixture.targetId, "target-analysis.json");
        await writeFile(analysisPath, `${await readFile(analysisPath, "utf8")} `, "utf8");
        const hashMismatch = await getTargetAnalysisStatus(fixture.workspace, fixture.targetId);
        expect(hashMismatch.status).toBe("invalid");
        expect(hashMismatch.analysisHashMatches).toBe(false);
    });
    it("detects target hash changes while keeping target input separate from analysis", async () => {
        const fixture = await structuredJobWorkspace();
        const targetPath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "target.json");
        const targetBefore = JSON.parse(await readFile(targetPath, "utf8"));
        const sourceBefore = await readFile(path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md"));
        await analyzeTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        expect(JSON.parse(await readFile(targetPath, "utf8"))).toEqual(targetBefore);
        expect(await readFile(path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md"))).toEqual(sourceBefore);
        expect(await readFile(targetArtifact(fixture.workspace, fixture.targetId, "target-analysis.json")))
            .not.toEqual(await readFile(targetPath));
        targetBefore.location = "Remote Europe";
        await writeFile(targetPath, `${JSON.stringify(targetBefore, null, 2)}\n`, "utf8");
        const status = await getTargetAnalysisStatus(fixture.workspace, fixture.targetId);
        expect(status.status).toBe("stale");
        expect(status.targetHashMatches).toBe(false);
        expect(status.sourceHashMatches).toBe(true);
    });
    it("persists a manifest that verifies the exact analysis, target, and source hashes", async () => {
        const fixture = await structuredJobWorkspace();
        const result = await analyzeTarget(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const analysisPath = targetArtifact(fixture.workspace, fixture.targetId, "target-analysis.json");
        const manifestPath = targetArtifact(fixture.workspace, fixture.targetId, "analysis-manifest.json");
        const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
        expect(result.analysisPath).toBe(`targets/jobs/${fixture.targetId}/analysis/target-analysis.json`);
        expect(result.manifestPath).toBe(`targets/jobs/${fixture.targetId}/analysis/analysis-manifest.json`);
        expect(manifest).toMatchObject({
            schemaVersion: 1,
            targetId: fixture.targetId,
            targetType: "job",
            analysisPath: result.analysisPath,
            analysisSha256: await hashFile(analysisPath),
            analyzerName: TARGET_ANALYZER_NAME,
            analyzerVersion: TARGET_ANALYZER_VERSION,
            targetSha256: await hashFile(path.join(fixture.workspace, "targets/jobs", fixture.targetId, "target.json")),
            sourceSha256: await hashFile(path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md")),
        });
    });
});
async function temporaryWorkspace() {
    return mkdtemp(path.join(tmpdir(), "prooflayer-analysis-"));
}
async function structuredJobWorkspace() {
    const workspace = await temporaryWorkspace();
    const sourcePath = path.join(workspace, "jobs", "exampleco-engineering-manager.md");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, STRUCTURED_JOB, "utf8");
    const result = await createJobTarget(workspace, { file: sourcePath }, {
        now: () => new Date(FIRST_TIME),
    });
    return { workspace, targetId: result.target.id };
}
function targetArtifact(workspace, targetId, fileName) {
    return path.join(workspace, "targets/jobs", targetId, "analysis", fileName);
}
