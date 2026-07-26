import { mkdir, mkdtemp, readFile, stat, writeFile, } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { approveJobRequirements, } from "../approved-job-requirements.js";
import { completeJobRequirementReview, initializeJobRequirementReview, setJobRequirementReviewDecision, showJobRequirementReview, } from "../job-requirement-review.js";
import { generateJobRequirementProposal, } from "../job-requirement-proposal.js";
import { JOB_EVIDENCE_MAPPER_NAME, JOB_EVIDENCE_MAPPER_VERSION, JOB_EVIDENCE_MAPPING_POLICY_NAME, JOB_EVIDENCE_MAPPING_POLICY_VERSION, buildJobEvidenceMap, getJobEvidenceMapStatus, jobEvidenceMapPaths, showJobEvidenceMap, } from "../job-evidence-mapping.js";
import { buildJobRequirements, showJobRequirementModel, } from "../job-requirements.js";
import { hashFile, hashText, writeJsonAtomic, } from "../fs-utils.js";
import { FakeInterpretationModelProvider } from "../model-provider.js";
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
    "- Experience in telecom environments.",
    "- Arabic and English are required.",
    "",
    "## Preferred Qualifications",
    "- React Native experience is preferred.",
    "",
].join("\n");
describe("Slice 2.7B deterministic Job Evidence Mapping", () => {
    it("builds the primary deterministic map with only the required downstream artifact", async () => {
        const fixture = await matchingWorkspace();
        const result = await buildJobEvidenceMap(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const map = await showJobEvidenceMap(fixture.workspace, fixture.targetId);
        const paths = jobEvidenceMapPaths(fixture.workspace, fixture.targetId);
        expect(result).toMatchObject({
            result: "created",
            requirementSource: "deterministic",
            mapPath: `targets/jobs/${fixture.targetId}/matching/deterministic/job-evidence-map.json`,
        });
        expect(map).toMatchObject({
            schemaVersion: 1,
            targetId: fixture.targetId,
            targetType: "job",
            policy: {
                name: JOB_EVIDENCE_MAPPING_POLICY_NAME,
                version: JOB_EVIDENCE_MAPPING_POLICY_VERSION,
                mode: "deterministic",
            },
            completeness: {
                status: "complete",
                readyForDownstreamAssessment: true,
            },
        });
        expect(await readFile(paths.mapPath, "utf8")).not.toMatch(/fitScore|coveragePercentage|hiring|recommendation|resume bullet/i);
        expect(paths.rootRelativePath).toBe(`targets/jobs/${fixture.targetId}/matching/deterministic`);
    });
    it("uses explicit reviewed signals for direct, supporting, and partial links", async () => {
        const fixture = await matchingWorkspace();
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId);
        const map = await showJobEvidenceMap(fixture.workspace, fixture.targetId);
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const technical = requirementFor(model, "TypeScript, Node.js, and Docker");
        const roadmap = requirementFor(model, "Own roadmap decisions");
        const reactNative = requirementFor(model, "React Native");
        expect(map.links.find((link) => link.requirementId === technical.id &&
            link.evidenceId === "evi_platform_delivery")).toMatchObject({
            relationship: "partial",
            evidenceStrength: "strong",
            linkConfidence: "medium",
        });
        expect(map.links.find((link) => link.requirementId === roadmap.id &&
            link.evidenceId === "evi_platform_delivery")).toMatchObject({
            relationship: "supporting",
        });
        expect(map.links.find((link) => link.requirementId === reactNative.id &&
            link.evidenceId === "evi_mobile")).toMatchObject({
            relationship: "direct",
            evidenceStrength: "medium",
            linkConfidence: "medium",
        });
        expect(new Set(map.links.map((link) => link.relationship))).toEqual(new Set(["direct", "supporting", "partial"]));
    });
    it("marks absent evidence unsupported without creating a link or score", async () => {
        const fixture = await matchingWorkspace();
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId);
        const map = await showJobEvidenceMap(fixture.workspace, fixture.targetId);
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const language = requirementFor(model, "Arabic and English");
        const mapping = map.requirementMappings.find((entry) => entry.requirementId === language.id);
        expect(mapping).toMatchObject({ status: "unsupported", linkIds: [] });
        expect(map.warnings).toContainEqual(expect.objectContaining({
            code: "REQUIREMENT_UNSUPPORTED",
            requirementId: language.id,
        }));
        expect(JSON.stringify(map)).not.toMatch(/fit|competitive|suitability|ATS score/i);
    });
    it("excludes private, draft, proposed, rejected, and non-resume-ready claims", async () => {
        const fixture = await matchingWorkspace();
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId);
        const map = await showJobEvidenceMap(fixture.workspace, fixture.targetId);
        expect(new Set(map.links.map((link) => link.evidenceId))).toEqual(new Set(["evi_mobile", "evi_platform_delivery"]));
        expect(map.links.map((link) => link.claimId)).not.toContain("claim_draft");
        expect(map.links.map((link) => link.claimId)).not.toContain("claim_private");
        expect(map.links.map((link) => link.claimId)).not.toContain("claim_rejected");
    });
    it("preserves stable IDs, hashes, bytes, and timestamps on unchanged reruns", async () => {
        const fixture = await matchingWorkspace();
        const first = await buildJobEvidenceMap(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const paths = jobEvidenceMapPaths(fixture.workspace, fixture.targetId);
        const before = {
            map: await readFile(paths.mapPath),
            manifest: await readFile(paths.manifestPath),
            mapStat: await stat(paths.mapPath),
            manifestStat: await stat(paths.manifestPath),
            parsed: await showJobEvidenceMap(fixture.workspace, fixture.targetId),
        };
        const second = await buildJobEvidenceMap(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        const after = {
            map: await readFile(paths.mapPath),
            manifest: await readFile(paths.manifestPath),
            mapStat: await stat(paths.mapPath),
            manifestStat: await stat(paths.manifestPath),
            parsed: await showJobEvidenceMap(fixture.workspace, fixture.targetId),
        };
        expect(first.result).toBe("created");
        expect(second.result).toBe("already-current");
        expect(after.map).toEqual(before.map);
        expect(after.manifest).toEqual(before.manifest);
        expect(after.mapStat.mtimeMs).toBe(before.mapStat.mtimeMs);
        expect(after.manifestStat.mtimeMs).toBe(before.manifestStat.mtimeMs);
        expect(after.parsed.links.map((entry) => entry.id)).toEqual(before.parsed.links.map((entry) => entry.id));
        expect(after.parsed.createdAt).toBe(FIRST_TIME);
        expect(after.parsed.updatedAt).toBe(FIRST_TIME);
    });
    it("preserves exact requirement and reviewed evidence provenance", async () => {
        const fixture = await matchingWorkspace();
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId);
        const map = await showJobEvidenceMap(fixture.workspace, fixture.targetId);
        const link = map.links.find((entry) => entry.evidenceId === "evi_platform_delivery" &&
            entry.matchedSignals.some((signal) => signal.value === "typescript"));
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const requirement = model.requirements.find((entry) => entry.id === link.requirementId);
        expect(link.requirementProvenance).toMatchObject({
            requirementModelType: "deterministic",
            requirementId: requirement.id,
            sourceTextSha256: hashText(requirement.sourceText),
            sourceReferences: requirement.provenance.sourceReferences,
        });
        expect(link.evidenceProvenance).toMatchObject({
            evidenceId: "evi_platform_delivery",
            claimId: "claim_platform_delivery",
            evidenceItemPath: "kb/evidence-items.json",
            claimPath: "kb/claims.json",
            sources: [expect.objectContaining({
                    sourceId: "src_public",
                    path: "sources/markdown/platform-evidence.md",
                    status: "active",
                    visibility: "public",
                })],
        });
    });
    it("reports missing, current, stale, and invalid lifecycle states", async () => {
        const fixture = await matchingWorkspace();
        expect((await getJobEvidenceMapStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("missing");
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId);
        expect(await getJobEvidenceMapStatus(fixture.workspace, fixture.targetId)).toMatchObject({
            status: "current",
            mapHashMatches: true,
            requirementModelStatus: "current",
            eligibleEvidenceSetHashMatches: true,
            normalizedInputHashMatches: true,
        });
        const claimsPath = path.join(fixture.workspace, "kb/claims.json");
        const claims = JSON.parse(await readFile(claimsPath, "utf8"));
        claims[0] = { ...claims[0], approvedWording: `${claims[0].approvedWording} Updated.` };
        await writeJsonAtomic(claimsPath, claims);
        expect((await getJobEvidenceMapStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("stale");
        await expect(buildJobEvidenceMap(fixture.workspace, fixture.targetId)).rejects.toThrow("use --rebuild");
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId, { rebuild: true });
        const paths = jobEvidenceMapPaths(fixture.workspace, fixture.targetId);
        await writeFile(paths.mapPath, `${await readFile(paths.mapPath, "utf8")} `, "utf8");
        expect((await getJobEvidenceMapStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("invalid");
    });
    it("rejects Role Targets, stale dependencies, and unresolved critical requirement models", async () => {
        const workspace = await temporaryWorkspace();
        const role = await createRoleTarget(workspace, { title: "Technical Product Manager" });
        await expect(buildJobEvidenceMap(workspace, role.target.id)).rejects.toThrow("rejects Role Target");
        const fixture = await matchingWorkspace();
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId);
        const jobPath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md");
        await writeFile(jobPath, `${JOB_DESCRIPTION}\nChanged.`, "utf8");
        expect((await getJobEvidenceMapStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("stale");
        await expect(buildJobEvidenceMap(fixture.workspace, fixture.targetId, {
            rebuild: true,
        })).rejects.toThrow("must be current");
        const ambiguous = await criticalAmbiguityWorkspace();
        await expect(buildJobEvidenceMap(ambiguous.workspace, ambiguous.targetId))
            .rejects.toThrow("unresolved critical ambiguity");
    });
    it("accepts an equivalent current approved reviewed requirement model explicitly", async () => {
        const fixture = await matchingWorkspace();
        const deterministic = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const payload = {
            proposedRequirements: [],
            warnings: [],
        };
        const generated = await generateJobRequirementProposal(fixture.workspace, fixture.targetId, {
            provider: new FakeInterpretationModelProvider(JSON.stringify(payload)),
            now: () => new Date(FIRST_TIME),
        });
        await initializeJobRequirementReview(fixture.workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
        const review = await showJobRequirementReview(fixture.workspace, generated.proposalId);
        for (const decision of review.decisions) {
            await setJobRequirementReviewDecision(fixture.workspace, generated.proposalId, decision.requirementId, { decision: "accept" }, { now: () => new Date(FIRST_TIME) });
        }
        await completeJobRequirementReview(fixture.workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
        await approveJobRequirements(fixture.workspace, fixture.targetId, {
            proposalId: generated.proposalId,
            now: () => new Date(FIRST_TIME),
        });
        const result = await buildJobEvidenceMap(fixture.workspace, fixture.targetId, {
            requirementSource: "approved",
            now: () => new Date(SECOND_TIME),
        });
        const map = await showJobEvidenceMap(fixture.workspace, fixture.targetId);
        expect(deterministic.completeness.status).toBe("complete");
        expect(result.requirementSource).toBe("approved");
        expect(map.input.requirementModelType).toBe("approved");
        expect(map.links.every((entry) => entry.requirementProvenance.requirementModelType === "approved")).toBe(true);
    });
    it("uses manifest hashes for map integrity without mutating target, source, or evidence", async () => {
        const fixture = await matchingWorkspace();
        const protectedPaths = [
            path.join(fixture.workspace, "targets/jobs", fixture.targetId, "target.json"),
            path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md"),
            path.join(fixture.workspace, "kb/sources.json"),
            path.join(fixture.workspace, "kb/evidence-items.json"),
            path.join(fixture.workspace, "kb/claims.json"),
        ];
        const before = await Promise.all(protectedPaths.map((file) => hashFile(file)));
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId);
        const after = await Promise.all(protectedPaths.map((file) => hashFile(file)));
        const paths = jobEvidenceMapPaths(fixture.workspace, fixture.targetId);
        const manifest = JSON.parse(await readFile(paths.manifestPath, "utf8"));
        expect(after).toEqual(before);
        expect(manifest).toMatchObject({
            mapperName: JOB_EVIDENCE_MAPPER_NAME,
            mapperVersion: JOB_EVIDENCE_MAPPER_VERSION,
            policyName: JOB_EVIDENCE_MAPPING_POLICY_NAME,
            policyVersion: JOB_EVIDENCE_MAPPING_POLICY_VERSION,
            mapSha256: await hashFile(paths.mapPath),
        });
    });
});
async function temporaryWorkspace() {
    return mkdtemp(path.join(tmpdir(), "prooflayer-job-evidence-mapping-"));
}
async function matchingWorkspace() {
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
    return { workspace, targetId: created.target.id };
}
async function criticalAmbiguityWorkspace() {
    const workspace = await temporaryWorkspace();
    const sourcePath = path.join(workspace, "imports", "ambiguous-job.md");
    const description = [
        "---",
        "title: Product Manager",
        "---",
        "",
        "## Required Qualifications",
        "- Product discovery experience.",
        "",
        "## Preferred Qualifications",
        "- Product discovery experience.",
        "",
    ].join("\n");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, description, "utf8");
    const created = await createJobTarget(workspace, { file: sourcePath });
    await analyzeTarget(workspace, created.target.id);
    await buildJobRequirements(workspace, created.target.id);
    await writeCandidateKnowledgeBase(workspace);
    return { workspace, targetId: created.target.id };
}
async function writeCandidateKnowledgeBase(workspace) {
    const publicSource = sourceFixture({
        id: "src_public",
        path: "sources/markdown/platform-evidence.md",
    });
    const privateSource = sourceFixture({
        id: "src_private",
        path: "sources/markdown/private-evidence.md",
        visibility: "private",
    });
    const sources = [publicSource, privateSource];
    const evidence = [
        evidenceFixture({
            id: "evi_platform_delivery",
            text: "Shaped roadmap decisions and led API platform delivery with TypeScript and Node.js.",
            normalizedSummary: "Shaped roadmap decisions and led API platform delivery with TypeScript and Node.js.",
            technologies: ["API", "TypeScript", "Node.js"],
            domains: ["platform", "telecom"],
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
        evidenceFixture({
            id: "evi_private",
            sourceIds: ["src_private"],
            text: "Private Docker delivery evidence.",
            normalizedSummary: "Private Docker delivery evidence.",
            technologies: ["Docker"],
            visibility: "private",
        }),
        evidenceFixture({
            id: "evi_draft",
            text: "Draft Arabic and English evidence.",
            normalizedSummary: "Draft Arabic and English evidence.",
        }),
        evidenceFixture({
            id: "evi_rejected",
            text: "Rejected Docker evidence.",
            normalizedSummary: "Rejected Docker evidence.",
            technologies: ["Docker"],
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
        claimFixture({
            id: "claim_private",
            claim: "Private Docker delivery evidence.",
            approvedWording: "Private Docker delivery evidence.",
            supportingEvidenceIds: ["evi_private"],
        }),
        claimFixture({
            id: "claim_draft",
            claim: "Draft Arabic and English evidence.",
            supportingEvidenceIds: ["evi_draft"],
            approvalStatus: "needs_confirmation",
            outputReadiness: "generic_only",
            publicSafe: false,
            needsConfirmation: true,
        }),
        claimFixture({
            id: "claim_rejected",
            claim: "Rejected Docker evidence.",
            supportingEvidenceIds: ["evi_rejected"],
            approvalStatus: "blocked",
            outputReadiness: "do_not_use",
            publicSafe: false,
            needsConfirmation: true,
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
