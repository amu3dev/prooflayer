import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, stat, writeFile, } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getApprovedJobResumeDraftStatus, } from "../approved-job-resume-draft.js";
import { completeJobResumeDraftReview, getJobResumeDraftReviewStatus, setJobResumeDraftReviewDecision, showJobResumeDraftReview, } from "../job-resume-draft-review.js";
import { JOB_RESUME_DRAFTING_POLICY_NAME, JOB_RESUME_DRAFTING_POLICY_VERSION, getJobResumeDraftScaffoldStatus, loadJobResumeDraftingContext, showJobResumeDraftScaffold, } from "../job-resume-drafting.js";
import { composeJobResumeRenderDocument, showJobResumeRenderDocument, } from "../job-resume-rendering.js";
import { canonicalVisibleText } from "../role-resume-format-renderers.js";
import { getEvidenceReviewWorkspaceStatus, } from "../evidence-review-workspace.js";
import { listEvidenceReviewBatches } from "../evidence-review-batch.js";
import { buildEvidenceSnapshot } from "../evidence-snapshots.js";
import { hashFile, hashText, writeJsonAtomic } from "../fs-utils.js";
import { continueJobWorkflow, createGuidedJob, finalizeJobWorkflow, formatGuidedJobCreation, formatJobWorkflowJson, formatJobWorkflowStatus, inspectJobWorkflow, runJobWorkflow, } from "../job-workflow.js";
import { FakeInterpretationModelProvider } from "../model-provider.js";
import { stableJson } from "../target-proposal.js";
import { getTargetEvidencePinStatus, pinTargetEvidenceSnapshot, } from "../target-evidence-pin.js";
import { getTargetAnalysisStatus } from "../target-analysis.js";
import { createRoleTarget } from "../targets.js";
import { createExplicitFixtureReviews, pinCurrentEvidenceSnapshot, } from "./evidence-snapshot-fixture.js";
const FIRST_TIME = "2026-07-29T08:00:00.000Z";
const SECOND_TIME = "2026-07-30T08:00:00.000Z";
const JOB_DESCRIPTION = [
    "---",
    "title: Technical Product Manager",
    "company: Example Systems",
    "---",
    "",
    "## Responsibilities",
    "- Lead API platform delivery.",
    "- Coordinate stakeholder roadmap decisions.",
    "",
    "## Required Qualifications",
    "- TypeScript and Node.js experience is required.",
    "",
    "## Preferred Qualifications",
    "- React Native experience is preferred.",
    "- Experience delivering 3 platform releases is preferred.",
    "",
].join("\n");
describe("guided Job workflow", () => {
    it("creates an exact Job Target and does not run downstream stages", async () => {
        const workspace = await temporaryWorkspace();
        const sourcePath = path.join(workspace, "imports", "job.md");
        const bytes = Buffer.from(JOB_DESCRIPTION, "utf8");
        await mkdir(path.dirname(sourcePath), { recursive: true });
        await writeFile(sourcePath, bytes);
        const result = await createGuidedJob(workspace, { file: sourcePath }, {
            now: () => new Date(FIRST_TIME),
        });
        const output = formatGuidedJobCreation(result);
        const persisted = path.join(workspace, result.persistedSourcePath);
        expect(await readFile(persisted)).toEqual(bytes);
        expect(result.target.type === "job" && result.target.source.sha256).toBe(createHash("sha256").update(bytes).digest("hex"));
        expect(output.indexOf("Technical Product Manager")).toBeLessThan(output.indexOf(result.target.id));
        expect(output).toContain(`prooflayer job run ${result.target.id}`);
        expect((await getTargetAnalysisStatus(workspace, result.target.id)).status).toBe("missing");
    });
    it("builds missing deterministic preparation in order and pauses for snapshot selection", async () => {
        const fixture = await baseWorkspace();
        const first = await runJobWorkflow(fixture.workspace, fixture.targetId);
        const analysisPath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "analysis/target-analysis.json");
        const before = await stat(analysisPath);
        const second = await runJobWorkflow(fixture.workspace, fixture.targetId);
        const after = await stat(analysisPath);
        expect(first.status.currentStage).toBe("evidence-pin");
        expect(first.status.overallState).toBe("paused");
        expect(first.stageResults.find((entry) => entry.stage === "analysis")?.result).toBe("built");
        expect(first.stageResults.find((entry) => entry.stage === "requirements")?.result).toBe("built");
        expect(second.stageResults.find((entry) => entry.stage === "analysis")?.result).toBe("reused");
        expect(after.mtimeMs).toBe(before.mtimeMs);
    });
    it("pins only an explicitly supplied snapshot and creates a review workspace without approving evidence", async () => {
        const fixture = await baseWorkspace();
        const snapshot = await buildEvidenceSnapshot(fixture.workspace, {
            now: () => new Date(FIRST_TIME),
        });
        const result = await runJobWorkflow(fixture.workspace, fixture.targetId, {
            snapshotId: snapshot.snapshotId,
        });
        const pin = await getTargetEvidencePinStatus(fixture.workspace, fixture.targetId);
        const batches = await listEvidenceReviewBatches(fixture.workspace);
        const batch = batches.find((entry) => entry.targetId === fixture.targetId);
        expect(pin).toMatchObject({ status: "current", snapshotId: snapshot.snapshotId });
        expect(result.status.currentStage).toBe("evidence-review");
        expect(result.status.reviewGate?.pendingClaimCount).toBeGreaterThan(0);
        expect(batch?.status).toBe("current");
        expect((await getEvidenceReviewWorkspaceStatus(fixture.workspace, batch.batchId)).status).toBe("current");
        expect(result.stageResults.some((entry) => entry.stage === "evidence-review" && entry.result === "built")).toBe(true);
        expect(result.status.evidenceSnapshot.eligibleJobEvidenceCount).toBe(0);
    });
    it("preserves an existing different snapshot pin and requires explicit upgrade", async () => {
        const fixture = await eligibleWorkspace();
        const before = await getTargetEvidencePinStatus(fixture.workspace, fixture.targetId);
        const result = await runJobWorkflow(fixture.workspace, fixture.targetId, {
            snapshotId: "evidence-snapshot-different",
        });
        const after = await getTargetEvidencePinStatus(fixture.workspace, fixture.targetId);
        expect(result.status.blocker?.code).toBe("EXPLICIT_SNAPSHOT_UPGRADE_REQUIRED");
        expect(result.status.nextCommand).toContain("target evidence-upgrade");
        expect(after.snapshotId).toBe(before.snapshotId);
    });
    it("builds a new immutable snapshot after completed evidence reviews but does not auto-upgrade", async () => {
        const fixture = await baseWorkspace();
        await runJobWorkflow(fixture.workspace, fixture.targetId);
        const original = await buildEvidenceSnapshot(fixture.workspace, {
            now: () => new Date(FIRST_TIME),
        });
        await runJobWorkflow(fixture.workspace, fixture.targetId, {
            snapshotId: original.snapshotId,
        });
        await createExplicitFixtureReviews(fixture.workspace, () => new Date(SECOND_TIME));
        const result = await continueJobWorkflow(fixture.workspace, fixture.targetId);
        const pin = await getTargetEvidencePinStatus(fixture.workspace, fixture.targetId);
        expect(result.status.currentStage).toBe("evidence-snapshot");
        expect(result.status.blocker?.code).toBe("EXPLICIT_SNAPSHOT_UPGRADE_REQUIRED");
        expect(result.status.nextCommand).toMatch(/--upgrade-snapshot evidence-snapshot-/);
        expect(pin.snapshotId).toBe(original.snapshotId);
    });
    it("pauses cleanly when the pinned snapshot contains no claims", async () => {
        const workspace = await temporaryWorkspace();
        const sourcePath = path.join(workspace, "imports", "job.md");
        await mkdir(path.dirname(sourcePath), { recursive: true });
        await writeFile(sourcePath, JOB_DESCRIPTION, "utf8");
        const target = await createGuidedJob(workspace, { file: sourcePath });
        const kb = path.join(workspace, "kb");
        await mkdir(kb, { recursive: true });
        await writeJsonAtomic(path.join(kb, "sources.json"), []);
        await writeJsonAtomic(path.join(kb, "evidence-items.json"), []);
        await writeJsonAtomic(path.join(kb, "claims.json"), []);
        const snapshot = await buildEvidenceSnapshot(workspace);
        await pinTargetEvidenceSnapshot(workspace, target.target.id, snapshot.snapshotId);
        const result = await runJobWorkflow(workspace, target.target.id);
        expect(result.status.blocker?.code).toBe("NO_EVIDENCE_CLAIMS_AVAILABLE");
        expect(result.status.nextCommand).toBe("prooflayer refresh");
        expect((await listEvidenceReviewBatches(workspace)).filter((entry) => entry.targetId === target.target.id)).toHaveLength(0);
    });
    it("makes no writes or model calls during a dry run", async () => {
        const fixture = await baseWorkspace();
        const provider = new FakeInterpretationModelProvider("{}");
        const before = await workspaceInventory(fixture.workspace);
        const result = await runJobWorkflow(fixture.workspace, fixture.targetId, {
            dryRun: true,
            provider,
            rebuildStale: true,
        });
        const after = await workspaceInventory(fixture.workspace);
        expect(result.dryRun).toBe(true);
        expect(provider.callCount).toBe(0);
        expect(after).toEqual(before);
        expect((await getTargetAnalysisStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
    });
    it("continues through eligible deterministic stages but pauses before proposal without a provider", async () => {
        const fixture = await eligibleWorkspace();
        const result = await runJobWorkflow(fixture.workspace, fixture.targetId);
        expect(result.status.currentStage).toBe("draft-proposal");
        expect(result.status.blocker?.code).toBe("MODEL_PROVIDER_REQUIRED");
        expect((await getJobResumeDraftScaffoldStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
        expect((await getApprovedJobResumeDraftStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
    });
    it("generates an untrusted proposal explicitly, initializes review, and never auto-approves", async () => {
        const fixture = await eligibleWorkspace();
        await runJobWorkflow(fixture.workspace, fixture.targetId);
        const payload = await validDraftPayload(fixture.workspace, fixture.targetId);
        const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
        const result = await runJobWorkflow(fixture.workspace, fixture.targetId, { provider });
        expect(provider.callCount).toBe(1);
        expect(result.status.currentStage).toBe("draft-review");
        expect(result.status.overallState).toBe("paused");
        expect(result.status.humanActionRequired).toMatch(/accept, edit, or reject/i);
        expect(result.status.currentProposalId).toBeTruthy();
        expect((await getJobResumeDraftReviewStatus(fixture.workspace, result.status.currentProposalId)).status).toBe("in-progress");
        expect((await getApprovedJobResumeDraftStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
    });
    it("does not mutate incomplete review and approves only after completed human decisions", async () => {
        const fixture = await reviewedProposalWorkspace();
        const before = await workspaceInventory(fixture.workspace);
        const paused = await continueJobWorkflow(fixture.workspace, fixture.targetId);
        const after = await workspaceInventory(fixture.workspace);
        expect(paused.status.currentStage).toBe("draft-review");
        expect(after).toEqual(before);
        expect(fixture.provider.callCount).toBe(1);
        const review = await showJobResumeDraftReview(fixture.workspace, fixture.proposalId);
        for (const decision of review.decisions) {
            await setJobResumeDraftReviewDecision(fixture.workspace, fixture.proposalId, decision.itemType, decision.itemId, { decision: "accept", now: () => new Date(SECOND_TIME) });
        }
        await completeJobResumeDraftReview(fixture.workspace, fixture.proposalId, {
            now: () => new Date(SECOND_TIME),
        });
        const continued = await continueJobWorkflow(fixture.workspace, fixture.targetId);
        expect(fixture.provider.callCount).toBe(1);
        expect(continued.status.overallState).toBe("ready-to-finalize");
        expect(continued.status.currentStage).toBe("composition");
        expect((await getApprovedJobResumeDraftStatus(fixture.workspace, fixture.targetId))).toMatchObject({ status: "current", usableForRendering: true });
    }, 15_000);
    it("renders stable human and JSON status with meaning before identifiers", async () => {
        const fixture = await baseWorkspace();
        const status = await inspectJobWorkflow(fixture.workspace, fixture.targetId);
        const human = formatJobWorkflowStatus(status, { verbose: true });
        const firstJson = formatJobWorkflowJson(status);
        const secondJson = formatJobWorkflowJson(await inspectJobWorkflow(fixture.workspace, fixture.targetId));
        expect(human.indexOf("Technical Product Manager")).toBeLessThan(human.indexOf(fixture.targetId));
        expect(human).toContain("Current stage:");
        expect(human).toContain("Next action:");
        expect(JSON.parse(firstJson).stages).toHaveLength(16);
        expect(secondJson).toBe(firstJson);
    });
    it("refuses finalization before a current approved draft without writing", async () => {
        const fixture = await baseWorkspace();
        const before = await workspaceInventory(fixture.workspace);
        const result = await finalizeJobWorkflow(fixture.workspace, fixture.targetId);
        const after = await workspaceInventory(fixture.workspace);
        expect(result.result).toBe("paused");
        expect(result.succeeded).toEqual([]);
        expect(result.failed).toEqual([]);
        expect(after).toEqual(before);
    });
    it("finalizes only an approved draft, defaults to safe formats, and reuses unchanged exports", async () => {
        const fixture = await approvedDraftWorkspace();
        await composeJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const document = await showJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const toolchain = fakeToolchain(canonicalVisibleText(document));
        const first = await finalizeJobWorkflow(fixture.workspace, fixture.targetId, {
            toolchain,
        });
        const firstInventory = await workspaceInventory(fixture.workspace);
        const second = await finalizeJobWorkflow(fixture.workspace, fixture.targetId, {
            toolchain,
        });
        const secondInventory = await workspaceInventory(fixture.workspace);
        expect(first.result).toBe("completed");
        expect(first.succeeded.map((entry) => entry.format).sort()).toEqual([
            "docx",
            "html",
            "markdown",
        ]);
        expect(first.failed).toEqual([]);
        expect(second.result).toBe("already-current");
        expect(secondInventory).toEqual(firstInventory);
    }, 30_000);
    it("reports optional PDF failure honestly while preserving successful exports", async () => {
        const fixture = await approvedDraftWorkspace();
        await composeJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const document = await showJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const result = await finalizeJobWorkflow(fixture.workspace, fixture.targetId, {
            formats: ["markdown", "pdf"],
            toolchain: fakeToolchain(canonicalVisibleText(document), { failPdf: true }),
        });
        expect(result.result).toBe("partial-failure");
        expect(result.succeeded.map((entry) => entry.format)).toContain("markdown");
        expect(result.failed).toEqual([
            expect.objectContaining({ format: "pdf", error: expect.stringContaining("unavailable") }),
        ]);
    }, 20_000);
    it("rejects Role Targets at the guided boundary", async () => {
        const workspace = await temporaryWorkspace();
        const role = await createRoleTarget(workspace, { title: "Engineering Manager" });
        await expect(inspectJobWorkflow(workspace, role.target.id)).rejects.toThrow("Guided Job workflow requires a Job Target");
    });
});
async function baseWorkspace() {
    const workspace = await temporaryWorkspace();
    const sourcePath = path.join(workspace, "imports", "job.md");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, JOB_DESCRIPTION, "utf8");
    const target = await createGuidedJob(workspace, { file: sourcePath });
    await writeCandidateKnowledgeBase(workspace);
    return { workspace, targetId: target.target.id };
}
async function eligibleWorkspace() {
    const fixture = await baseWorkspace();
    await pinCurrentEvidenceSnapshot(fixture.workspace, fixture.targetId, () => new Date(FIRST_TIME));
    return fixture;
}
async function reviewedProposalWorkspace() {
    const fixture = await eligibleWorkspace();
    await runJobWorkflow(fixture.workspace, fixture.targetId);
    const payload = await validDraftPayload(fixture.workspace, fixture.targetId);
    const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
    const generated = await runJobWorkflow(fixture.workspace, fixture.targetId, { provider });
    return {
        ...fixture,
        provider,
        proposalId: generated.status.currentProposalId,
    };
}
async function approvedDraftWorkspace() {
    const fixture = await reviewedProposalWorkspace();
    const review = await showJobResumeDraftReview(fixture.workspace, fixture.proposalId);
    for (const decision of review.decisions) {
        await setJobResumeDraftReviewDecision(fixture.workspace, fixture.proposalId, decision.itemType, decision.itemId, { decision: "accept", now: () => new Date(SECOND_TIME) });
    }
    await completeJobResumeDraftReview(fixture.workspace, fixture.proposalId, {
        now: () => new Date(SECOND_TIME),
    });
    await continueJobWorkflow(fixture.workspace, fixture.targetId);
    return fixture;
}
async function validDraftPayload(workspace, targetId) {
    const scaffold = await showJobResumeDraftScaffold(workspace, targetId);
    const context = await loadJobResumeDraftingContext(workspace, targetId);
    const scaffoldSha256 = await hashFile(path.join(workspace, "targets/jobs", targetId, "resume-drafting/scaffold/job-resume-draft-scaffold.json"));
    const boundaries = new Map(context.contentPlan.claimBoundaries.map((entry) => [entry.id, entry]));
    const claims = new Map(context.claims.map((entry) => [entry.id, entry]));
    const links = new Map(context.evidenceMap.links.map((entry) => [entry.id, entry]));
    const metrics = new Map(context.contentPlan.metricPermissions.map((entry) => [entry.id, entry]));
    return {
        sections: scaffold.sections.map((guard) => {
            const shouldDraft = guard.inclusion !== "exclude"
                && guard.allowedEvidenceIds.length > 0
                && guard.allowedClaimIds.length > 0
                && guard.allowedRequirementIds.length > 0;
            const items = shouldDraft ? [createItem()] : [];
            return {
                id: guard.id,
                planSectionId: guard.planSectionId,
                type: guard.sectionType,
                order: guard.order,
                status: guard.inclusion === "exclude" ? "excluded"
                    : items.length ? "drafted" : "empty",
                objectiveCode: guard.objectiveCode,
                items,
                provenance: {
                    targetId,
                    planId: context.contentPlan.id,
                    planSectionId: guard.planSectionId,
                    contentPlanSha256: context.contentPlanSha256,
                    draftingPolicy: {
                        name: JOB_RESUME_DRAFTING_POLICY_NAME,
                        version: JOB_RESUME_DRAFTING_POLICY_VERSION,
                    },
                },
            };
            function createItem() {
                const allowedMetricPermission = guard.sectionType === "selected-impact"
                    ? guard.allowedMetricPermissionIds
                        .map((id) => metrics.get(id))
                        .find((entry) => entry?.state === "allowed")
                    : undefined;
                const eligibleLinks = guard.allowedEvidenceMapLinkIds
                    .map((id) => links.get(id))
                    .filter((entry) => entry
                    && guard.allowedRequirementIds.includes(entry.requirementId)
                    && guard.allowedEvidenceIds.includes(entry.evidenceId)
                    && guard.allowedClaimIds.includes(entry.claimId));
                const link = (allowedMetricPermission
                    ? eligibleLinks.find((entry) => entry?.evidenceId === allowedMetricPermission.evidenceId
                        && entry.claimId === allowedMetricPermission.claimId)
                    : undefined)
                    ?? eligibleLinks.find((entry) => {
                        if (!entry)
                            return false;
                        const claim = claims.get(entry.claimId);
                        const preferred = preferredClaimTypes(guard.sectionType, claim?.type);
                        return guard.allowedClaimBoundaryIds.map((id) => boundaries.get(id)).some((boundary) => boundary
                            && boundary.state !== "prohibited"
                            && boundary.requirementId === entry.requirementId
                            && boundary.evidenceIds.includes(entry.evidenceId)
                            && boundary.claimIds.includes(entry.claimId)
                            && preferred.some((type) => guard.allowedClaimTypes.includes(type)
                                && boundary.allowedClaimTypes.includes(type)));
                    })
                    ?? eligibleLinks[0];
                if (!link)
                    throw new Error(`No consistent planned link for ${guard.sectionType}`);
                const claim = claims.get(link.claimId);
                const titleBoundary = guard.sectionType === "headline"
                    ? guard.allowedClaimBoundaryIds
                        .map((id) => boundaries.get(id))
                        .find((entry) => entry?.kind === "target-title")
                    : undefined;
                const metricBoundary = guard.allowedMetricPermissionIds.length > 0
                    ? guard.allowedClaimBoundaryIds
                        .map((id) => boundaries.get(id))
                        .find((entry) => entry?.kind === "metric" && entry.claimIds.includes(link.claimId))
                    : undefined;
                const claimBoundary = guard.allowedClaimBoundaryIds
                    .map((id) => boundaries.get(id))
                    .find((entry) => entry
                    && entry.state !== "prohibited"
                    && entry.requirementId === link.requirementId
                    && entry.evidenceIds.includes(link.evidenceId)
                    && entry.claimIds.includes(link.claimId)
                    && (allowedMetricPermission
                        ? true
                        : preferredClaimTypes(guard.sectionType, claim.type).some((type) => guard.allowedClaimTypes.includes(type)
                            && entry.allowedClaimTypes.includes(type))));
                const boundary = titleBoundary ?? metricBoundary ?? claimBoundary;
                if (!boundary)
                    throw new Error(`No allowed boundary for ${guard.sectionType}`);
                const metricPermission = guard.allowedMetricPermissionIds
                    .map((id) => metrics.get(id))
                    .find((entry) => entry?.state === "allowed" && entry.claimId === claim.id);
                const coverage = context.coverage.requirements.find((entry) => entry.requirementId === link.requirementId);
                const assessment = context.assessment.requirementAssessments.find((entry) => entry.requirementId === link.requirementId);
                const claimType = guard.sectionType === "headline"
                    ? "target-title"
                    : metricPermission
                        ? "quantified-outcome"
                        : preferredClaimTypes(guard.sectionType, claim.type).find((entry) => boundary.allowedClaimTypes.includes(entry)
                            && guard.allowedClaimTypes.includes(entry))
                            ?? boundary.allowedClaimTypes.find((entry) => guard.allowedClaimTypes.includes(entry))
                            ?? guard.allowedClaimTypes[0];
                const text = metricPermission?.exactApprovedMetricText
                    ?? draftText(guard.sectionType, context.target.title, claim.approvedWording);
                return {
                    id: `model-item-${guard.sectionType}`,
                    sectionId: guard.id,
                    itemType: itemTypeForSection(guard.sectionType),
                    text,
                    requirementIds: [link.requirementId],
                    coverageIds: [coverage.id],
                    assessmentIds: [assessment.id],
                    evidenceMapLinkIds: [link.id],
                    evidenceIds: [link.evidenceId],
                    claimIds: [link.claimId],
                    claimBoundaryIds: [boundary.id],
                    metricPermissionIds: metricPermission ? [metricPermission.id] : [],
                    claimTypes: [claimType],
                    metricReferences: metricPermission ? [{
                            metricPermissionId: metricPermission.id,
                            evidenceId: metricPermission.evidenceId,
                            claimId: metricPermission.claimId,
                            exactApprovedText: metricPermission.exactApprovedMetricText,
                            permissionSha256: hashText(stableJson(metricPermission)),
                        }] : [],
                    scopeReferences: [],
                    qualifiers: [...new Set([
                            ...guard.requiredQualifierCodes,
                            ...boundary.requiredQualifierCodes,
                        ])].sort(),
                    trustState: "model-proposed",
                    validation: { status: "valid", issues: [] },
                    provenance: {
                        targetId,
                        planId: context.contentPlan.id,
                        planSectionId: guard.planSectionId,
                        proposalId: "model-placeholder",
                        draftingPolicy: {
                            name: JOB_RESUME_DRAFTING_POLICY_NAME,
                            version: JOB_RESUME_DRAFTING_POLICY_VERSION,
                        },
                        artifactHashes: {
                            requirementModelSha256: context.requirementInput.modelSha256,
                            evidenceMapSha256: context.evidenceMapSha256,
                            coverageSha256: context.coverageSha256,
                            assessmentSha256: context.assessmentSha256,
                            contentPlanSha256: context.contentPlanSha256,
                            scaffoldSha256,
                        },
                    },
                };
            }
        }),
        warnings: [],
        ambiguities: [],
    };
}
function itemTypeForSection(type) {
    return {
        headline: "headline",
        "professional-summary": "summary",
        "core-capabilities": "capability",
        "selected-impact": "impact",
        "professional-experience": "experience-bullet",
        "selected-projects": "project",
        "technical-capabilities": "technology",
        "leadership-capabilities": "leadership-capability",
        education: "education",
        certifications: "certification",
        "additional-information": "additional-information",
    }[type];
}
function draftText(sectionType, targetTitle, approvedWording) {
    const mobile = /React Native/i.test(approvedWording);
    return {
        headline: `${targetTitle} | API Platform Delivery`,
        "professional-summary": mobile
            ? "React Native product prototyping."
            : "API platform delivery with TypeScript and Node.js; stakeholder roadmap coordination.",
        "core-capabilities": mobile
            ? "Product prototyping with React Native."
            : "API platform delivery, TypeScript, and Node.js.",
        "professional-experience": "Coordinated stakeholder roadmap decisions.",
        "selected-projects": approvedWording,
        "technical-capabilities": mobile
            ? "React Native."
            : "TypeScript, Node.js, and API platform delivery.",
        "leadership-capabilities": mobile
            ? "Product prototype delivery."
            : "Stakeholder roadmap coordination.",
    }[sectionType] ?? approvedWording;
}
function preferredClaimTypes(sectionType, claimType) {
    if (sectionType === "professional-experience") {
        return claimType === "impact_claim"
            ? ["achievement", "delivery-outcome", "responsibility"]
            : ["responsibility", "scope", "capability-theme", "leadership-behavior"];
    }
    if (sectionType === "selected-projects")
        return ["project", "technology", "capability-theme"];
    if (sectionType === "technical-capabilities")
        return ["technology", "capability-theme"];
    if (sectionType === "leadership-capabilities") {
        return ["leadership-behavior", "responsibility", "capability-theme"];
    }
    if (sectionType === "selected-impact") {
        return ["achievement", "delivery-outcome", "product-outcome", "business-outcome"];
    }
    return ["capability-theme", "responsibility", "technology", "project", "achievement"];
}
function fakeToolchain(visibleText, options = {}) {
    return {
        async createDocx({ outputPath }) {
            await writeFile(outputPath, Buffer.from("PK\u0003\u0004ProofLayer guided Job DOCX fixture"));
        },
        async createPdf({ outputPath }) {
            if (options.failPdf)
                throw new Error("LibreOffice test adapter unavailable");
            await writeFile(outputPath, Buffer.from("%PDF-1.7\n% guided fixture\n"));
        },
        async extractDocxText() {
            return visibleText;
        },
        async extractPdf(_filePath, expectedPageSize) {
            return {
                text: visibleText,
                pageCount: 1,
                pageSizeVerified: ["A4", "LETTER"].includes(expectedPageSize),
            };
        },
    };
}
async function writeCandidateKnowledgeBase(workspace) {
    const sources = [{
            id: "src_reviewed",
            type: "markdown",
            path: "sources/markdown/reviewed-evidence.md",
            title: "Reviewed evidence",
            importedAt: FIRST_TIME,
            hash: hashText("reviewed source bytes"),
            visibility: "public",
            status: "active",
        }];
    const evidence = [
        {
            id: "evi_platform_role",
            sourceIds: ["src_reviewed"],
            category: "responsibility",
            text: "Led API platform delivery with TypeScript and Node.js and coordinated stakeholder roadmap decisions.",
            normalizedSummary: "Led API platform delivery with TypeScript and Node.js and coordinated stakeholder roadmap decisions.",
            parentRoleId: "role_platform_lead",
            sourceSection: "Professional Experience",
            technologies: ["API", "TypeScript", "Node.js"],
            domains: ["platform"],
            visibility: "public",
            sensitivityFlags: [],
            confidence: "high",
        },
        {
            id: "evi_mobile_project",
            sourceIds: ["src_reviewed"],
            category: "project",
            text: "Built a React Native product prototype.",
            normalizedSummary: "Built a React Native product prototype.",
            parentProjectId: "project_mobile_prototype",
            sourceSection: "Selected Projects",
            technologies: ["React Native"],
            domains: ["mobile"],
            visibility: "public",
            sensitivityFlags: [],
            confidence: "high",
        },
        {
            id: "evi_verified_releases",
            sourceIds: ["src_reviewed"],
            category: "achievement",
            text: "Delivered 3 platform releases.",
            normalizedSummary: "Delivered 3 platform releases.",
            parentRoleId: "role_platform_lead",
            sourceSection: "Professional Experience",
            domains: ["platform"],
            visibility: "public",
            sensitivityFlags: [],
            confidence: "high",
        },
    ];
    const claims = [
        approvedClaim("claim_platform_role", evidence[0], "responsibility_claim", "no_metric"),
        approvedClaim("claim_mobile_project", evidence[1], "project_claim", "no_metric"),
        approvedClaim("claim_verified_releases", evidence[2], "impact_claim", "verified_metric"),
    ];
    const kb = path.join(workspace, "kb");
    await mkdir(kb, { recursive: true });
    await writeJsonAtomic(path.join(kb, "sources.json"), sources);
    await writeJsonAtomic(path.join(kb, "evidence-items.json"), evidence);
    await writeJsonAtomic(path.join(kb, "claims.json"), claims);
}
function approvedClaim(id, evidence, type, metricStatus) {
    return {
        id,
        claim: evidence.text,
        approvedWording: evidence.text,
        type,
        supportingEvidenceIds: [evidence.id],
        ...(evidence.parentRoleId ? { parentRoleId: evidence.parentRoleId } : {}),
        ...(evidence.parentProjectId ? { parentProjectId: evidence.parentProjectId } : {}),
        sourceSection: evidence.sourceSection,
        extractionConfidence: "high",
        factualConfidence: "high",
        corroborationLevel: "manual_approved",
        approvalStatus: "approved",
        outputReadiness: "resume_ready",
        confidence: "high",
        publicSafe: true,
        needsConfirmation: false,
        metricStatus,
        unsafeWording: [],
    };
}
async function workspaceInventory(workspace) {
    const files = [];
    await walk(workspace);
    return Promise.all(files.sort().map(async (filePath) => ({
        path: path.relative(workspace, filePath),
        sha256: await hashFile(filePath),
        mtimeMs: (await stat(filePath)).mtimeMs,
    })));
    async function walk(directory) {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
            const entryPath = path.join(directory, entry.name);
            if (entry.isDirectory())
                await walk(entryPath);
            else if (entry.isFile())
                files.push(entryPath);
        }
    }
}
async function temporaryWorkspace() {
    return mkdtemp(path.join(tmpdir(), "prooflayer-guided-job-"));
}
