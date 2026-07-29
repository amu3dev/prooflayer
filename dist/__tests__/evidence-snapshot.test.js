import { mkdir, mkdtemp, readFile, stat, writeFile, } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildEvidenceSnapshot, evidenceSnapshotPaths, getEvidenceSnapshotStatus, listEvidenceSnapshots, loadEvidenceSnapshot, validateEvidenceSnapshot, } from "../evidence-snapshots.js";
import { hashFile, hashText, writeJsonAtomic, } from "../fs-utils.js";
import { getTargetEvidencePinStatus, loadTargetEvidencePin, pinTargetEvidenceSnapshot, targetEvidencePinPaths, upgradeTargetEvidenceSnapshot, } from "../target-evidence-pin.js";
import { buildJobEvidenceMap, getJobEvidenceMapStatus, showJobEvidenceMap, } from "../job-evidence-mapping.js";
import { buildJobRequirements } from "../job-requirements.js";
import { analyzeTarget } from "../target-analysis.js";
import { createJobTarget, createRoleTarget, showTarget, } from "../targets.js";
const FIRST_TIME = "2026-07-29T08:00:00.000Z";
const SECOND_TIME = "2026-07-30T08:00:00.000Z";
const JOB_DESCRIPTION = [
    "Technical Product Manager",
    "",
    "Requirements",
    "- TypeScript platform delivery is required.",
    "",
].join("\n");
describe("Evidence Snapshot Contract v1", () => {
    it("exports deterministic immutable content with exact eligibility state", async () => {
        const fixture = await evidenceWorkspace();
        const before = await foundationHashes(fixture.workspace);
        const first = await buildEvidenceSnapshot(fixture.workspace, {
            now: () => new Date(FIRST_TIME),
        });
        const paths = evidenceSnapshotPaths(fixture.workspace, first.snapshotId);
        const firstBytes = await readFile(paths.snapshotPath);
        const firstStats = await stat(paths.snapshotPath);
        const second = await buildEvidenceSnapshot(fixture.workspace, {
            now: () => new Date(SECOND_TIME),
        });
        const loaded = await loadEvidenceSnapshot(fixture.workspace, first.snapshotId);
        expect(first.result).toBe("created");
        expect(second).toMatchObject({
            result: "already-current",
            snapshotId: first.snapshotId,
            contentSha256: first.contentSha256,
        });
        expect(await readFile(paths.snapshotPath)).toEqual(firstBytes);
        expect((await stat(paths.snapshotPath)).mtimeMs).toBe(firstStats.mtimeMs);
        expect(loaded.snapshot).toMatchObject({
            schemaVersion: 1,
            contract: { name: "evidence-snapshot", version: "1" },
            policy: { name: "evidence-snapshot-policy", version: "1" },
            completeness: {
                evidenceItemCount: 3,
                claimCount: 4,
                approvedClaimCount: 2,
                eligibleJobEvidenceCount: 1,
                eligibleRoleEvidenceCount: 1,
                verifiedMetricCount: 1,
            },
        });
        expect(loaded.snapshot.eligibleJobEvidenceIds).toEqual(["evi_public"]);
        expect(loaded.snapshot.eligibleJobClaimIds).toEqual([
            "claim_public_metric",
        ]);
        expect(loaded.snapshot.evidenceItems.map(({ id }) => id)).toEqual([
            "evi_pending",
            "evi_private",
            "evi_public",
        ]);
        expect(loaded.snapshot.claims.map(({ id }) => id)).toEqual([
            "claim_pending",
            "claim_private",
            "claim_public_metric",
            "claim_unverified_number",
        ]);
        expect(loaded.snapshot.claims.find(({ id }) => id === "claim_pending"))
            .toMatchObject({
            approvalStatus: "needs_confirmation",
            outputReadiness: "generic_only",
            publicSafe: false,
            eligibility: {
                jobMapping: false,
                roleMatching: false,
            },
        });
        expect(loaded.snapshot.evidenceItems.find(({ id }) => id === "evi_private"))
            .toMatchObject({
            visibility: "private",
            eligibility: {
                jobMapping: false,
                roleMatching: false,
            },
        });
        expect(loaded.snapshot.evidenceItems.find(({ id }) => id === "evi_private"))
            .not.toHaveProperty("content");
        expect(await foundationHashes(fixture.workspace)).toEqual(before);
    });
    it("preserves exact verified metrics and never promotes unverified numbers", async () => {
        const fixture = await evidenceWorkspace();
        const result = await buildEvidenceSnapshot(fixture.workspace);
        const { snapshot } = await loadEvidenceSnapshot(fixture.workspace, result.snapshotId);
        expect(snapshot.verifiedMetrics).toEqual([
            expect.objectContaining({
                claimId: "claim_public_metric",
                exactText: "Delivered 3 reviewed platform releases.",
                textSha256: hashText("Delivered 3 reviewed platform releases."),
            }),
        ]);
        expect(snapshot.verifiedMetrics.map(({ claimId }) => claimId))
            .not.toContain("claim_unverified_number");
        expect(snapshot.claims.find(({ id }) => id === "claim_unverified_number")).toMatchObject({ metricStatus: "needs_metric" });
    });
    it("uses identical identity for identical source bytes regardless of export timestamp", async () => {
        const left = await evidenceWorkspace();
        const right = await evidenceWorkspace();
        const first = await buildEvidenceSnapshot(left.workspace, {
            now: () => new Date(FIRST_TIME),
        });
        const second = await buildEvidenceSnapshot(right.workspace, {
            now: () => new Date(SECOND_TIME),
        });
        expect(second.snapshotId).toBe(first.snapshotId);
        expect(second.contentSha256).toBe(first.contentSha256);
        expect(await readFile(evidenceSnapshotPaths(left.workspace, first.snapshotId).snapshotPath)).toEqual(await readFile(evidenceSnapshotPaths(right.workspace, second.snapshotId).snapshotPath));
    });
    it("exports no absolute private source paths or secrets", async () => {
        const fixture = await evidenceWorkspace();
        const result = await buildEvidenceSnapshot(fixture.workspace);
        const bytes = await readFile(evidenceSnapshotPaths(fixture.workspace, result.snapshotId).snapshotPath, "utf8");
        expect(bytes).not.toContain("/Users/");
        expect(bytes).not.toContain(fixture.workspace);
        expect(bytes).not.toContain("private-source.md");
        expect(bytes).not.toMatch(/api[_-]?key|access[_-]?token|password/i);
        expect(bytes).toContain("evidence-foundation/sources/src_private");
    });
    it("represents a valid zero-eligible snapshot honestly", async () => {
        const workspace = await temporaryWorkspace();
        await writeKnowledgeBase(workspace, {
            sources: [],
            evidence: [],
            claims: [],
        });
        const result = await buildEvidenceSnapshot(workspace);
        const { snapshot } = await loadEvidenceSnapshot(workspace, result.snapshotId);
        expect(snapshot.completeness).toMatchObject({
            status: "complete",
            eligibleJobEvidenceCount: 0,
            eligibleRoleEvidenceCount: 0,
        });
        expect(new Set(snapshot.warnings.map(({ code }) => code))).toEqual(new Set([
            "ZERO_ELIGIBLE_JOB_EVIDENCE",
            "ZERO_ELIGIBLE_ROLE_EVIDENCE",
        ]));
        await expect(validateEvidenceSnapshot(workspace, result.snapshotId))
            .resolves.toMatchObject({ status: "current" });
    });
    it("validates manifest hashes, source inventory, and list metadata", async () => {
        const fixture = await evidenceWorkspace();
        const result = await buildEvidenceSnapshot(fixture.workspace);
        const status = await getEvidenceSnapshotStatus(fixture.workspace, result.snapshotId);
        const entries = await listEvidenceSnapshots(fixture.workspace);
        expect(status).toMatchObject({
            status: "current",
            contentHashMatches: true,
            identityMatches: true,
            sourceInventoryHashMatches: true,
            recordHashesMatch: true,
            eligibilityConsistent: true,
            provenanceComplete: true,
            manifestMatches: true,
        });
        expect(entries).toEqual([
            expect.objectContaining({
                snapshotId: result.snapshotId,
                status: "current",
                contentSha256: result.contentSha256,
                evidenceItemCount: 3,
                approvedClaimCount: 2,
            }),
        ]);
    });
    it("detects corrupted content, manifest, duplicate IDs, and future schemas", async () => {
        const corrupted = await evidenceWorkspace();
        const corruptedResult = await buildEvidenceSnapshot(corrupted.workspace);
        const corruptedPaths = evidenceSnapshotPaths(corrupted.workspace, corruptedResult.snapshotId);
        await writeFile(corruptedPaths.snapshotPath, "{}", "utf8");
        expect((await getEvidenceSnapshotStatus(corrupted.workspace, corruptedResult.snapshotId)).status).toBe("incompatible");
        const manifestFixture = await evidenceWorkspace();
        const manifestResult = await buildEvidenceSnapshot(manifestFixture.workspace);
        const manifestPaths = evidenceSnapshotPaths(manifestFixture.workspace, manifestResult.snapshotId);
        const manifest = JSON.parse(await readFile(manifestPaths.manifestPath, "utf8"));
        manifest.contentSha256 = "0".repeat(64);
        await writeJsonAtomic(manifestPaths.manifestPath, manifest);
        expect((await getEvidenceSnapshotStatus(manifestFixture.workspace, manifestResult.snapshotId)).status).toBe("invalid");
        const duplicateFixture = await evidenceWorkspace();
        const duplicateResult = await buildEvidenceSnapshot(duplicateFixture.workspace);
        const duplicatePaths = evidenceSnapshotPaths(duplicateFixture.workspace, duplicateResult.snapshotId);
        const duplicate = JSON.parse(await readFile(duplicatePaths.snapshotPath, "utf8"));
        duplicate.evidenceItems.push(duplicate.evidenceItems[0]);
        await writeJsonAtomic(duplicatePaths.snapshotPath, duplicate);
        expect((await getEvidenceSnapshotStatus(duplicateFixture.workspace, duplicateResult.snapshotId)).status).toBe("invalid");
        const futureFixture = await evidenceWorkspace();
        const futureResult = await buildEvidenceSnapshot(futureFixture.workspace);
        const futurePaths = evidenceSnapshotPaths(futureFixture.workspace, futureResult.snapshotId);
        const future = JSON.parse(await readFile(futurePaths.snapshotPath, "utf8"));
        future.schemaVersion = 2;
        await writeJsonAtomic(futurePaths.snapshotPath, future);
        expect((await getEvidenceSnapshotStatus(futureFixture.workspace, futureResult.snapshotId)).status).toBe("incompatible");
    });
    it("returns deeply frozen read-only consumer objects", async () => {
        const fixture = await evidenceWorkspace();
        const result = await buildEvidenceSnapshot(fixture.workspace);
        const loaded = await loadEvidenceSnapshot(fixture.workspace, result.snapshotId);
        expect(Object.isFrozen(loaded.snapshot)).toBe(true);
        expect(Object.isFrozen(loaded.snapshot.evidenceItems)).toBe(true);
        expect(Object.isFrozen(loaded.snapshot.evidenceItems[0])).toBe(true);
        expect(() => loaded.snapshot.evidenceItems.push(loaded.snapshot.evidenceItems[0])).toThrow();
    });
    it("pins Job and Role targets explicitly with stable unchanged behavior", async () => {
        const fixture = await targetWorkspace();
        const snapshot = await buildEvidenceSnapshot(fixture.workspace, {
            now: () => new Date(FIRST_TIME),
        });
        const jobPin = await pinTargetEvidenceSnapshot(fixture.workspace, fixture.jobTargetId, snapshot.snapshotId, { now: () => new Date(FIRST_TIME) });
        const rolePin = await pinTargetEvidenceSnapshot(fixture.workspace, fixture.roleTargetId, snapshot.snapshotId, { now: () => new Date(FIRST_TIME) });
        const jobPaths = (await loadTargetEvidencePin(fixture.workspace, fixture.jobTargetId)).paths;
        const before = {
            pin: await readFile(jobPaths.pinPath),
            manifest: await readFile(jobPaths.manifestPath),
            pinMtime: (await stat(jobPaths.pinPath)).mtimeMs,
        };
        const repeated = await pinTargetEvidenceSnapshot(fixture.workspace, fixture.jobTargetId, snapshot.snapshotId, { now: () => new Date(SECOND_TIME) });
        expect(jobPin.result).toBe("pinned");
        expect(rolePin).toMatchObject({ targetType: "role", result: "pinned" });
        expect(repeated).toMatchObject({
            result: "already-current",
            snapshotId: snapshot.snapshotId,
        });
        expect(await readFile(jobPaths.pinPath)).toEqual(before.pin);
        expect(await readFile(jobPaths.manifestPath)).toEqual(before.manifest);
        expect((await stat(jobPaths.pinPath)).mtimeMs).toBe(before.pinMtime);
        expect(await getTargetEvidencePinStatus(fixture.workspace, fixture.jobTargetId)).toMatchObject({
            status: "current",
            snapshotId: snapshot.snapshotId,
            targetHashMatches: true,
            snapshotContentHashMatches: true,
        });
    });
    it("rejects missing snapshots and refuses silent pin replacement", async () => {
        const fixture = await targetWorkspace();
        await expect(pinTargetEvidenceSnapshot(fixture.workspace, fixture.jobTargetId, `evidence-snapshot-${"0".repeat(20)}`)).rejects.toThrow(/missing/i);
        const first = await buildEvidenceSnapshot(fixture.workspace);
        await pinTargetEvidenceSnapshot(fixture.workspace, fixture.jobTargetId, first.snapshotId);
        await addApprovedEvidence(fixture.workspace);
        const second = await buildEvidenceSnapshot(fixture.workspace);
        expect(second.snapshotId).not.toBe(first.snapshotId);
        await expect(pinTargetEvidenceSnapshot(fixture.workspace, fixture.jobTargetId, second.snapshotId)).rejects.toThrow("evidence-upgrade");
    });
    it("rejects invalid or incompatible snapshots and cross-target pin reuse", async () => {
        const invalidFixture = await targetWorkspace();
        const invalidSnapshot = await buildEvidenceSnapshot(invalidFixture.workspace);
        const invalidPaths = evidenceSnapshotPaths(invalidFixture.workspace, invalidSnapshot.snapshotId);
        const invalidManifest = JSON.parse(await readFile(invalidPaths.manifestPath, "utf8"));
        invalidManifest.contentSha256 = "0".repeat(64);
        await writeJsonAtomic(invalidPaths.manifestPath, invalidManifest);
        await expect(pinTargetEvidenceSnapshot(invalidFixture.workspace, invalidFixture.jobTargetId, invalidSnapshot.snapshotId)).rejects.toThrow(/invalid/i);
        const incompatibleFixture = await targetWorkspace();
        const incompatibleSnapshot = await buildEvidenceSnapshot(incompatibleFixture.workspace);
        const incompatiblePaths = evidenceSnapshotPaths(incompatibleFixture.workspace, incompatibleSnapshot.snapshotId);
        const incompatible = JSON.parse(await readFile(incompatiblePaths.snapshotPath, "utf8"));
        incompatible.schemaVersion = 2;
        await writeJsonAtomic(incompatiblePaths.snapshotPath, incompatible);
        await expect(pinTargetEvidenceSnapshot(incompatibleFixture.workspace, incompatibleFixture.jobTargetId, incompatibleSnapshot.snapshotId)).rejects.toThrow(/incompatible/i);
        const crossFixture = await targetWorkspace();
        const crossSnapshot = await buildEvidenceSnapshot(crossFixture.workspace);
        await pinTargetEvidenceSnapshot(crossFixture.workspace, crossFixture.jobTargetId, crossSnapshot.snapshotId);
        const jobPaths = targetEvidencePinPaths(crossFixture.workspace, await showTarget(crossFixture.workspace, crossFixture.jobTargetId));
        const rolePaths = targetEvidencePinPaths(crossFixture.workspace, await showTarget(crossFixture.workspace, crossFixture.roleTargetId));
        await mkdir(rolePaths.rootPath, { recursive: true });
        await writeFile(rolePaths.pinPath, await readFile(jobPaths.pinPath));
        await writeFile(rolePaths.manifestPath, await readFile(jobPaths.manifestPath));
        expect((await getTargetEvidencePinStatus(crossFixture.workspace, crossFixture.roleTargetId)).status).toBe("invalid");
    });
    it("does not auto-upgrade and explicit upgrade stales but does not rebuild a Job map", async () => {
        const fixture = await jobMappingWorkspace();
        const firstSnapshot = await buildEvidenceSnapshot(fixture.workspace, {
            now: () => new Date(FIRST_TIME),
        });
        await pinTargetEvidenceSnapshot(fixture.workspace, fixture.targetId, firstSnapshot.snapshotId, { now: () => new Date(FIRST_TIME) });
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const beforeMap = await showJobEvidenceMap(fixture.workspace, fixture.targetId);
        await addApprovedEvidence(fixture.workspace);
        const secondSnapshot = await buildEvidenceSnapshot(fixture.workspace, {
            now: () => new Date(SECOND_TIME),
        });
        expect((await getTargetEvidencePinStatus(fixture.workspace, fixture.targetId)).snapshotId).toBe(firstSnapshot.snapshotId);
        expect((await getJobEvidenceMapStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
        await upgradeTargetEvidenceSnapshot(fixture.workspace, fixture.targetId, secondSnapshot.snapshotId, { now: () => new Date(SECOND_TIME) });
        expect((await getJobEvidenceMapStatus(fixture.workspace, fixture.targetId)).status).toBe("stale");
        expect(await showJobEvidenceMap(fixture.workspace, fixture.targetId)).toEqual(beforeMap);
    });
    it("Job Mapping consumes only eligible pinned content and preserves snapshot provenance", async () => {
        const fixture = await jobMappingWorkspace();
        const snapshot = await buildEvidenceSnapshot(fixture.workspace);
        await pinTargetEvidenceSnapshot(fixture.workspace, fixture.targetId, snapshot.snapshotId);
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId);
        const map = await showJobEvidenceMap(fixture.workspace, fixture.targetId);
        expect(map.input).toMatchObject({
            evidenceSnapshotId: snapshot.snapshotId,
            evidenceSnapshotSchemaVersion: 1,
            evidenceSnapshotContractName: "evidence-snapshot",
            evidenceSnapshotPolicyName: "evidence-snapshot-policy",
            evidenceSnapshotPolicyVersion: "1",
        });
        expect(new Set(map.links.map(({ evidenceId }) => evidenceId))).toEqual(new Set(["evi_public"]));
        expect(map.links.map(({ evidenceId }) => evidenceId))
            .not.toContain("evi_private");
    });
    it("builds a safe zero-link Job map from a valid empty-eligible snapshot", async () => {
        const fixture = await jobMappingWorkspace({ empty: true });
        const snapshot = await buildEvidenceSnapshot(fixture.workspace);
        await pinTargetEvidenceSnapshot(fixture.workspace, fixture.targetId, snapshot.snapshotId);
        await buildJobEvidenceMap(fixture.workspace, fixture.targetId);
        const map = await showJobEvidenceMap(fixture.workspace, fixture.targetId);
        expect(map.links).toEqual([]);
        expect(map.warnings).toContainEqual(expect.objectContaining({
            code: "NO_ELIGIBLE_EVIDENCE",
        }));
        expect(map.completeness.readyForDownstreamAssessment).toBe(true);
    });
});
async function temporaryWorkspace() {
    return mkdtemp(path.join(tmpdir(), "prooflayer-evidence-snapshot-"));
}
async function evidenceWorkspace(options = {}) {
    const workspace = await temporaryWorkspace();
    const data = knowledgeBase();
    await writeKnowledgeBase(workspace, {
        sources: options.reverse ? [...data.sources].reverse() : data.sources,
        evidence: options.reverse ? [...data.evidence].reverse() : data.evidence,
        claims: options.reverse ? [...data.claims].reverse() : data.claims,
    });
    return { workspace };
}
async function targetWorkspace() {
    const fixture = await evidenceWorkspace();
    const jobSource = path.join(fixture.workspace, "imports", "job.md");
    await mkdir(path.dirname(jobSource), { recursive: true });
    await writeFile(jobSource, JOB_DESCRIPTION, "utf8");
    const job = await createJobTarget(fixture.workspace, {
        file: jobSource,
        title: "Technical Product Manager",
    });
    const role = await createRoleTarget(fixture.workspace, {
        title: "Technical Product Manager",
    });
    return {
        workspace: fixture.workspace,
        jobTargetId: job.target.id,
        roleTargetId: role.target.id,
    };
}
async function jobMappingWorkspace(options = {}) {
    const workspace = await temporaryWorkspace();
    const sourcePath = path.join(workspace, "imports", "job.md");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, JOB_DESCRIPTION, "utf8");
    const target = await createJobTarget(workspace, {
        file: sourcePath,
        title: "Technical Product Manager",
    });
    await analyzeTarget(workspace, target.target.id, {
        now: () => new Date(FIRST_TIME),
    });
    await buildJobRequirements(workspace, target.target.id, {
        now: () => new Date(FIRST_TIME),
    });
    if (options.empty) {
        await writeKnowledgeBase(workspace, {
            sources: [],
            evidence: [],
            claims: [],
        });
    }
    else {
        const data = knowledgeBase();
        await writeKnowledgeBase(workspace, data);
    }
    return { workspace, targetId: target.target.id };
}
function knowledgeBase() {
    const sources = [
        sourceFixture({
            id: "src_public",
            path: "/Users/synthetic-private/evidence/public-source.md",
        }),
        sourceFixture({
            id: "src_private",
            path: "/Users/synthetic-private/evidence/private-source.md",
            visibility: "private",
        }),
    ];
    const evidence = [
        evidenceFixture({
            id: "evi_public",
            text: "Delivered 3 reviewed platform releases using TypeScript.",
            normalizedSummary: "Delivered 3 reviewed platform releases using TypeScript.",
            technologies: ["TypeScript"],
        }),
        evidenceFixture({
            id: "evi_private",
            sourceIds: ["src_private"],
            text: "Private product evidence.",
            normalizedSummary: "Private product evidence.",
            visibility: "private",
        }),
        evidenceFixture({
            id: "evi_pending",
            text: "Pending evidence with 20 users.",
            normalizedSummary: "Pending evidence with 20 users.",
        }),
    ];
    const claims = [
        claimFixture({
            id: "claim_public_metric",
            claim: "Delivered 3 reviewed platform releases.",
            approvedWording: "Delivered 3 reviewed platform releases.",
            supportingEvidenceIds: ["evi_public"],
            metricStatus: "verified_metric",
        }),
        claimFixture({
            id: "claim_private",
            claim: "Private product evidence.",
            approvedWording: "Private product evidence.",
            supportingEvidenceIds: ["evi_private"],
        }),
        claimFixture({
            id: "claim_pending",
            claim: "Pending evidence with 20 users.",
            supportingEvidenceIds: ["evi_pending"],
            approvalStatus: "needs_confirmation",
            outputReadiness: "generic_only",
            publicSafe: false,
            needsConfirmation: true,
            metricStatus: "needs_metric",
        }),
        claimFixture({
            id: "claim_unverified_number",
            claim: "Worked with 20 users.",
            supportingEvidenceIds: ["evi_pending"],
            approvalStatus: "blocked",
            outputReadiness: "do_not_use",
            publicSafe: false,
            needsConfirmation: true,
            metricStatus: "needs_metric",
        }),
    ];
    return { sources, evidence, claims };
}
async function addApprovedEvidence(workspace) {
    const evidencePath = path.join(workspace, "kb/evidence-items.json");
    const claimsPath = path.join(workspace, "kb/claims.json");
    const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
    const claims = JSON.parse(await readFile(claimsPath, "utf8"));
    evidence.push(evidenceFixture({
        id: "evi_added",
        text: "Added approved platform evidence.",
        normalizedSummary: "Added approved platform evidence.",
    }));
    claims.push(claimFixture({
        id: "claim_added",
        claim: "Added approved platform evidence.",
        approvedWording: "Added approved platform evidence.",
        supportingEvidenceIds: ["evi_added"],
    }));
    await writeJsonAtomic(evidencePath, evidence);
    await writeJsonAtomic(claimsPath, claims);
}
async function writeKnowledgeBase(workspace, data) {
    const kb = path.join(workspace, "kb");
    await mkdir(kb, { recursive: true });
    await writeJsonAtomic(path.join(kb, "sources.json"), data.sources);
    await writeJsonAtomic(path.join(kb, "evidence-items.json"), data.evidence);
    await writeJsonAtomic(path.join(kb, "claims.json"), data.claims);
}
async function foundationHashes(workspace) {
    return Promise.all([
        hashFile(path.join(workspace, "kb/sources.json")),
        hashFile(path.join(workspace, "kb/evidence-items.json")),
        hashFile(path.join(workspace, "kb/claims.json")),
    ]);
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
