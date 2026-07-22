import { mkdtemp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LATEST_REFRESH_PATH, UPDATE_BASELINE_PATH, refreshWorkspace } from "../update-impact.js";
const SAMPLE_RESUME = `# Example Candidate

## Summary

Technical product leader connecting product discovery, platform delivery, and cross-functional execution.

## Professional Experience

### Example Platform Company
**Technical Product Manager**
Jan 2024 - Present | Remote

- Shaped roadmap priorities and translated platform constraints into delivery decisions.

## Education & Certifications

- Bachelor's Degree in Computer Science, Example University
- Technical Product Manager Certification, Example Institute
`;
describe("Slice 1.6.1 persisted pipeline integration", () => {
    it("runs a real refresh and atomically persists the complete knowledge state", async () => {
        const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-pipeline-"));
        const sourceDir = path.join(workspace, "sources/cvs");
        await mkdir(sourceDir, { recursive: true });
        await writeFile(path.join(sourceDir, "resume.md"), SAMPLE_RESUME, "utf8");
        const latest = await refreshWorkspace(workspace, {
            now: () => new Date("2026-07-16T08:00:00.000Z")
        });
        const sources = await readJsonArray(path.join(workspace, "kb/sources.json"));
        const evidence = await readJsonArray(path.join(workspace, "kb/evidence-items.json"));
        const claims = await readJsonArray(path.join(workspace, "kb/claims.json"));
        const profile = JSON.parse(await readFile(path.join(workspace, "kb/career-profile.json"), "utf8"));
        const baseline = JSON.parse(await readFile(path.join(workspace, UPDATE_BASELINE_PATH), "utf8"));
        const changelog = JSON.parse(await readFile(path.join(workspace, LATEST_REFRESH_PATH), "utf8"));
        expect(sources).toHaveLength(1);
        expect(evidence.length).toBeGreaterThan(0);
        expect(claims.length).toBeGreaterThan(0);
        expect(profile.id).toBe("career_profile");
        expect(baseline.successfulRefreshAt).toBe("2026-07-16T08:00:00.000Z");
        expect(changelog.refreshId).toBe(latest.refreshId);
        expect(await findTemporaryFiles(workspace)).toEqual([]);
    });
    it("uses atomic JSON persistence for the requested core files", async () => {
        const operationsSource = await readFile(new URL("../operations.ts", import.meta.url), "utf8");
        const updateImpactSource = await readFile(new URL("../update-impact.ts", import.meta.url), "utf8");
        for (const file of [
            "sources.json",
            "evidence-items.json",
            "claims.json",
            "career-profile.json",
            "normalization-stats.json"
        ]) {
            expect(operationsSource).toContain(`writeJsonAtomic(path.join(workspace, "kb/${file}")`);
            expect(operationsSource).not.toContain(`writeJson(path.join(workspace, "kb/${file}")`);
        }
        expect(updateImpactSource).toContain("writeJsonAtomic(path.join(workspace, LATEST_REFRESH_PATH), latest)");
    });
});
async function readJsonArray(filePath) {
    const value = JSON.parse(await readFile(filePath, "utf8"));
    expect(Array.isArray(value)).toBe(true);
    return value;
}
async function findTemporaryFiles(root) {
    const entries = await readdir(root, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(root, entry.name);
        if (entry.isDirectory())
            return findTemporaryFiles(fullPath);
        return entry.name.endsWith(".tmp") ? [fullPath] : [];
    }));
    return nested.flat();
}
