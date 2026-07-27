import { mkdir, mkdtemp, readFile, stat, writeFile, } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { JOB_COVERAGE_ANALYZER_NAME, JOB_COVERAGE_ANALYZER_VERSION, JOB_COVERAGE_POLICY_NAME, JOB_COVERAGE_POLICY_VERSION, buildJobCoverage, classifyJobRequirementCoverage, getJobCoverageStatus, jobCoveragePaths, showJobCoverage, } from "../job-coverage.js";
import { buildJobEvidenceMap, jobEvidenceMapPaths, } from "../job-evidence-mapping.js";
import { buildJobRequirements, showJobRequirementModel, } from "../job-requirements.js";
import { hashFile, hashText, writeJsonAtomic, } from "../fs-utils.js";
import { analyzeTarget } from "../target-analysis.js";
import { createJobTarget, createRoleTarget } from "../targets.js";
const FIRST_TIME = "2026-07-26T12:00:00.000Z";
const SECOND_TIME = "2026-07-27T12:00:00.000Z";
const JOB_DESCRIPTION = [
    "---",
    "title: Technical Product Manager",
    "company: Example Systems",
    "---",
    "",
    "## Responsibilities",
    "- Own roadmap decisions.",
    "- Lead API platform delivery.",
    "",
    "## Required Qualifications",
    "- Required experience with TypeScript, Node.js, and Docker.",
    "- Arabic and English are required.",
    "",
    "## Preferred Qualifications",
    "- React Native experience is preferred.",
    "",
].join("\n");
describe("Slice 2.7C deterministic Job Requirement Coverage", () => {
    it("classifies all five states without scores or hidden weighting", () => {
        const direct = link("direct", "strong", "high");
        const partial = link("partial", "strong", "medium");
        const contradiction = {
            ...link("contradiction", "strong", "high"),
            contradictionApproved: true,
        };
        const weakDirect = link("direct", "weak", "low");
        expect(classifyJobRequirementCoverage({
            necessity: "mandatory",
            hasUnresolvedAmbiguity: false,
            links: [direct],
        })).toEqual({ state: "supported", evidenceQuality: "strong" });
        expect(classifyJobRequirementCoverage({
            necessity: "mandatory",
            hasUnresolvedAmbiguity: false,
            links: [partial],
        })).toEqual({ state: "partially-supported", evidenceQuality: "adequate" });
        expect(classifyJobRequirementCoverage({
            necessity: "mandatory",
            hasUnresolvedAmbiguity: false,
            links: [],
        })).toEqual({ state: "unsupported", evidenceQuality: "unavailable" });
        expect(classifyJobRequirementCoverage({
            necessity: "mandatory",
            hasUnresolvedAmbiguity: false,
            links: [contradiction],
        })).toEqual({ state: "contradicted", evidenceQuality: "mixed" });
        expect(classifyJobRequirementCoverage({
            necessity: "mandatory",
            hasUnresolvedAmbiguity: false,
            links: [link("contradiction", "strong", "high")],
        }).state).toBe("indeterminate");
        expect(classifyJobRequirementCoverage({
            necessity: "mandatory",
            hasUnresolvedAmbiguity: false,
            links: [weakDirect, { ...weakDirect, id: "link_2" }],
        })).toEqual({ state: "indeterminate", evidenceQuality: "limited" });
    });
    it("builds one deterministic coverage entry for every mapped requirement", async () => {
        const fixture = await coverageWorkspace();
        const result = await buildJobCoverage(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const coverage = await showJobCoverage(fixture.workspace, fixture.targetId);
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const paths = jobCoveragePaths(fixture.workspace, fixture.targetId);
        expect(result).toMatchObject({
            result: "created",
            coveragePath: `targets/jobs/${fixture.targetId}/coverage/deterministic/job-requirement-coverage.json`,
        });
        expect(coverage).toMatchObject({
            schemaVersion: 1,
            targetType: "job",
            analyzer: {
                name: JOB_COVERAGE_ANALYZER_NAME,
                version: JOB_COVERAGE_ANALYZER_VERSION,
                mode: "deterministic",
            },
            policy: {
                name: JOB_COVERAGE_POLICY_NAME,
                version: JOB_COVERAGE_POLICY_VERSION,
            },
            completeness: {
                status: "complete",
                readyForDownstreamAssessment: true,
            },
        });
        expect(coverage.requirements).toHaveLength(model.requirements.length);
        expect(new Set(coverage.requirements.map((entry) => entry.requirementId))).toEqual(new Set(model.requirements.map((entry) => entry.id)));
        expect(await readFile(paths.coveragePath, "utf8")).not.toMatch(/fit score|coverage percentage|hiring probability|apply recommendation|resume plan/i);
    });
    it("handles compound requirements conservatively without splitting artifacts", async () => {
        const fixture = await coverageWorkspace();
        await buildJobCoverage(fixture.workspace, fixture.targetId);
        const coverage = await showJobCoverage(fixture.workspace, fixture.targetId);
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const technical = requirementFor(model, "TypeScript, Node.js, and Docker");
        const entry = coverage.requirements.find((candidate) => candidate.requirementId === technical.id);
        expect(entry.state).toBe("partially-supported");
        expect(entry.components).toEqual([
            expect.objectContaining({ label: "Docker", status: "unsupported" }),
            expect.objectContaining({ label: "Node.js", status: "supported" }),
            expect.objectContaining({ label: "TypeScript", status: "supported" }),
        ]);
        expect(entry.linkCounts).toMatchObject({
            direct: 0,
            supporting: 0,
            partial: 1,
            contradiction: 0,
        });
        expect(entry.warnings.join(" ")).toContain("Docker");
    });
    it("distinguishes direct, supporting, unsupported, and ambiguous boundaries", async () => {
        const fixture = await coverageWorkspace();
        await buildJobCoverage(fixture.workspace, fixture.targetId);
        const coverage = await showJobCoverage(fixture.workspace, fixture.targetId);
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const reactNative = requirementFor(model, "React Native");
        const roadmap = requirementFor(model, "Own roadmap decisions");
        const languages = requirementFor(model, "Arabic and English");
        expect(entryFor(coverage, reactNative.id).state).toBe("supported");
        expect(entryFor(coverage, roadmap.id).state).toBe("partially-supported");
        expect(entryFor(coverage, languages.id)).toMatchObject({
            state: "unsupported",
            evidenceQuality: "unavailable",
            mappedLinkIds: [],
        });
        expect(classifyJobRequirementCoverage({
            necessity: "ambiguous",
            hasUnresolvedAmbiguity: true,
            links: [],
        }).state).toBe("indeterminate");
    });
    it("preserves exact requirement and evidence-map provenance", async () => {
        const fixture = await coverageWorkspace();
        await buildJobCoverage(fixture.workspace, fixture.targetId);
        const coverage = await showJobCoverage(fixture.workspace, fixture.targetId);
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const technical = requirementFor(model, "TypeScript, Node.js, and Docker");
        const entry = entryFor(coverage, technical.id);
        const mapPaths = jobEvidenceMapPaths(fixture.workspace, fixture.targetId);
        expect(entry.requirementProvenance).toMatchObject({
            requirementId: technical.id,
            sourceTextSha256: hashText(technical.sourceText),
            sourceReferences: technical.provenance.sourceReferences,
        });
        expect(entry.evidenceMapProvenance).toMatchObject({
            evidenceMapPath: mapPaths.mapRelativePath,
            evidenceMapSha256: await hashFile(mapPaths.mapPath),
            requirementMappingId: expect.any(String),
            requirementMappingSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
            links: [
                expect.objectContaining({
                    linkId: expect.any(String),
                    linkSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
                    evidenceId: "evi_platform_delivery",
                    claimId: "claim_platform_delivery",
                }),
            ],
        });
    });
    it("does not mutate or regenerate requirement, map, or candidate evidence inputs", async () => {
        const fixture = await coverageWorkspace();
        const mapPaths = jobEvidenceMapPaths(fixture.workspace, fixture.targetId);
        const requirementModel = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const protectedPaths = [
            path.join(fixture.workspace, "targets/jobs", fixture.targetId, "target.json"),
            path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md"),
            requirementModel.input.structuralAnalysis.path,
            requirementModel.input.structuralAnalysisManifest.path,
            mapPaths.mapPath,
            mapPaths.manifestPath,
            path.join(fixture.workspace, "kb/sources.json"),
            path.join(fixture.workspace, "kb/evidence-items.json"),
            path.join(fixture.workspace, "kb/claims.json"),
        ].map((entry) => path.isAbsolute(entry) ? entry : path.join(fixture.workspace, entry));
        const before = await Promise.all(protectedPaths.map(hashFile));
        await buildJobCoverage(fixture.workspace, fixture.targetId);
        expect(await Promise.all(protectedPaths.map(hashFile))).toEqual(before);
    });
    it("preserves stable IDs, hashes, bytes, and timestamps on unchanged reruns", async () => {
        const fixture = await coverageWorkspace();
        const first = await buildJobCoverage(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const paths = jobCoveragePaths(fixture.workspace, fixture.targetId);
        const before = {
            coverage: await readFile(paths.coveragePath),
            manifest: await readFile(paths.manifestPath),
            coverageStat: await stat(paths.coveragePath),
            manifestStat: await stat(paths.manifestPath),
            parsed: await showJobCoverage(fixture.workspace, fixture.targetId),
        };
        const second = await buildJobCoverage(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        const after = {
            coverage: await readFile(paths.coveragePath),
            manifest: await readFile(paths.manifestPath),
            coverageStat: await stat(paths.coveragePath),
            manifestStat: await stat(paths.manifestPath),
            parsed: await showJobCoverage(fixture.workspace, fixture.targetId),
        };
        expect(first.result).toBe("created");
        expect(second.result).toBe("already-current");
        expect(after.coverage).toEqual(before.coverage);
        expect(after.manifest).toEqual(before.manifest);
        expect(after.coverageStat.mtimeMs).toBe(before.coverageStat.mtimeMs);
        expect(after.manifestStat.mtimeMs).toBe(before.manifestStat.mtimeMs);
        expect(after.parsed.requirements.map((entry) => entry.id)).toEqual(before.parsed.requirements.map((entry) => entry.id));
        expect(after.parsed.createdAt).toBe(FIRST_TIME);
        expect(after.parsed.updatedAt).toBe(FIRST_TIME);
    });
    it("reports missing, current, stale, and invalid lifecycle states", async () => {
        const fixture = await coverageWorkspace();
        expect((await getJobCoverageStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("missing");
        await buildJobCoverage(fixture.workspace, fixture.targetId);
        expect(await getJobCoverageStatus(fixture.workspace, fixture.targetId)).toMatchObject({
            status: "current",
            evidenceMapStatus: "current",
            coverageHashMatches: true,
            normalizedInputHashMatches: true,
        });
        const claimsPath = path.join(fixture.workspace, "kb/claims.json");
        const claims = JSON.parse(await readFile(claimsPath, "utf8"));
        claims[0] = {
            ...claims[0],
            approvedWording: `${claims[0].approvedWording} Updated.`,
        };
        await writeJsonAtomic(claimsPath, claims);
        expect((await getJobCoverageStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("stale");
        await expect(buildJobCoverage(fixture.workspace, fixture.targetId)).rejects.toThrow("requires a current Job Evidence Map");
        const fresh = await coverageWorkspace();
        await buildJobCoverage(fresh.workspace, fresh.targetId);
        const paths = jobCoveragePaths(fresh.workspace, fresh.targetId);
        await writeFile(paths.coveragePath, `${await readFile(paths.coveragePath, "utf8")} `, "utf8");
        expect((await getJobCoverageStatus(fresh.workspace, fresh.targetId)).status)
            .toBe("invalid");
    });
    it("rejects Role Targets, missing maps, and broken map provenance", async () => {
        const workspace = await temporaryWorkspace();
        const role = await createRoleTarget(workspace, {
            title: "Technical Product Manager",
        });
        await expect(buildJobCoverage(workspace, role.target.id)).rejects.toThrow("rejects Role Target");
        const sourcePath = path.join(workspace, "imports", "job.md");
        await mkdir(path.dirname(sourcePath), { recursive: true });
        await writeFile(sourcePath, JOB_DESCRIPTION, "utf8");
        const job = await createJobTarget(workspace, { file: sourcePath });
        await expect(buildJobCoverage(workspace, job.target.id)).rejects.toThrow("requires a current Job Evidence Map");
        const fixture = await coverageWorkspace();
        const mapPaths = jobEvidenceMapPaths(fixture.workspace, fixture.targetId);
        const map = JSON.parse(await readFile(mapPaths.mapPath, "utf8"));
        map.links[0].evidenceProvenance.claimId = "claim_broken";
        await writeJsonAtomic(mapPaths.mapPath, map);
        const manifest = JSON.parse(await readFile(mapPaths.manifestPath, "utf8"));
        manifest.mapSha256 = await hashFile(mapPaths.mapPath);
        await writeJsonAtomic(mapPaths.manifestPath, manifest);
        await expect(buildJobCoverage(fixture.workspace, fixture.targetId)).rejects.toThrow("invalid");
    });
    it("rejects stale requirement models and stale evidence maps", async () => {
        const staleRequirement = await coverageWorkspace();
        const jobDescriptionPath = path.join(staleRequirement.workspace, "targets/jobs", staleRequirement.targetId, "job-description.md");
        await writeFile(jobDescriptionPath, `${JOB_DESCRIPTION}\nChanged requirement source.`, "utf8");
        await expect(buildJobCoverage(staleRequirement.workspace, staleRequirement.targetId)).rejects.toThrow("Job Requirement Model is not current");
        const staleMap = await coverageWorkspace();
        const claimsPath = path.join(staleMap.workspace, "kb/claims.json");
        const claims = JSON.parse(await readFile(claimsPath, "utf8"));
        claims[0] = {
            ...claims[0],
            approvedWording: `${claims[0].approvedWording} Changed.`,
        };
        await writeJsonAtomic(claimsPath, claims);
        await expect(buildJobCoverage(staleMap.workspace, staleMap.targetId)).rejects.toThrow(/Reviewed claims changed or are missing/);
    });
});
function link(relationship, evidenceStrength, linkConfidence) {
    return {
        id: `link_${relationship}`,
        relationship,
        evidenceStrength,
        linkConfidence,
    };
}
async function temporaryWorkspace() {
    return mkdtemp(path.join(tmpdir(), "prooflayer-job-coverage-"));
}
async function coverageWorkspace() {
    const workspace = await temporaryWorkspace();
    const sourcePath = path.join(workspace, "imports", "job.md");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, JOB_DESCRIPTION, "utf8");
    const created = await createJobTarget(workspace, { file: sourcePath });
    await analyzeTarget(workspace, created.target.id, {
        now: () => new Date(FIRST_TIME),
    });
    await buildJobRequirements(workspace, created.target.id, {
        now: () => new Date(FIRST_TIME),
    });
    await writeCandidateKnowledgeBase(workspace);
    await buildJobEvidenceMap(workspace, created.target.id, {
        now: () => new Date(FIRST_TIME),
    });
    return { workspace, targetId: created.target.id };
}
async function writeCandidateKnowledgeBase(workspace) {
    const sources = [
        sourceFixture({
            id: "src_public",
            path: "sources/markdown/platform-evidence.md",
        }),
    ];
    const evidence = [
        evidenceFixture({
            id: "evi_platform_delivery",
            text: "Shaped roadmap decisions and led API platform delivery with TypeScript and Node.js.",
            normalizedSummary: "Shaped roadmap decisions and led API platform delivery with TypeScript and Node.js.",
            technologies: ["API", "TypeScript", "Node.js"],
            domains: ["platform"],
            confidence: "high",
        }),
        evidenceFixture({
            id: "evi_mobile",
            text: "Built a React Native product prototype.",
            normalizedSummary: "Built a React Native product prototype.",
            technologies: ["React Native"],
            domains: ["mobile"],
            confidence: "medium",
        }),
    ];
    const claims = [
        claimFixture({
            id: "claim_platform_delivery",
            claim: "Shaped roadmap decisions and led API platform delivery with TypeScript and Node.js.",
            approvedWording: "Shaped roadmap decisions and led API platform delivery with TypeScript and Node.js.",
            supportingEvidenceIds: ["evi_platform_delivery"],
        }),
        claimFixture({
            id: "claim_mobile",
            claim: "Built a React Native product prototype.",
            approvedWording: "Built a React Native product prototype.",
            supportingEvidenceIds: ["evi_mobile"],
            factualConfidence: "medium",
            confidence: "medium",
        }),
    ];
    const kb = path.join(workspace, "kb");
    await mkdir(kb, { recursive: true });
    await writeJsonAtomic(path.join(kb, "sources.json"), sources);
    await writeJsonAtomic(path.join(kb, "evidence-items.json"), evidence);
    await writeJsonAtomic(path.join(kb, "claims.json"), claims);
}
function sourceFixture(overrides) {
    return {
        id: "src_public",
        type: "markdown",
        path: "sources/markdown/evidence.md",
        title: "Reviewed evidence",
        importedAt: FIRST_TIME,
        hash: hashText("reviewed source bytes"),
        visibility: "public",
        status: "active",
        ...overrides,
    };
}
function evidenceFixture(overrides) {
    return {
        id: "evi_default",
        sourceIds: ["src_public"],
        category: "responsibility",
        text: "Reviewed candidate evidence.",
        normalizedSummary: "Reviewed candidate evidence.",
        sourceSection: "Professional Experience",
        technologies: [],
        domains: [],
        visibility: "public",
        sensitivityFlags: [],
        confidence: "high",
        ...overrides,
    };
}
function claimFixture(overrides) {
    return {
        id: "claim_default",
        claim: "Reviewed candidate evidence.",
        approvedWording: "Reviewed candidate evidence.",
        type: "responsibility_claim",
        supportingEvidenceIds: ["evi_default"],
        sourceSection: "Professional Experience",
        extractionConfidence: "high",
        factualConfidence: "high",
        corroborationLevel: "manual_approved",
        approvalStatus: "approved",
        outputReadiness: "resume_ready",
        confidence: "high",
        publicSafe: true,
        needsConfirmation: false,
        metricStatus: "no_metric",
        unsafeWording: [],
        ...overrides,
    };
}
function requirementFor(model, text) {
    const requirement = model.requirements.find((entry) => entry.sourceText.includes(text));
    if (!requirement)
        throw new Error(`Requirement fixture not found: ${text}`);
    return requirement;
}
function entryFor(coverage, requirementId) {
    const entry = coverage.requirements.find((candidate) => candidate.requirementId === requirementId);
    if (!entry)
        throw new Error(`Coverage entry not found: ${requirementId}`);
    return entry;
}
