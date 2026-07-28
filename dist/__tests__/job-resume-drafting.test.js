import { mkdir, mkdtemp, readFile, stat, writeFile, } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { approveJobResumeDraft, getApprovedJobResumeDraftStatus, showApprovedJobResumeDraft, } from "../approved-job-resume-draft.js";
import { exportAllJobResume, exportJobResume, getJobResumeExportStatus, listJobResumeExports, showJobResumeExport, validateStoredJobResumeExport, } from "../job-resume-render-export.js";
import { composeJobResumeRenderDocument, getJobResumeRenderDocumentStatus, jobResumeRenderDocumentPaths, showJobResumeRenderDocument, JOB_RESUME_RENDERING_POLICY_NAME, JOB_RESUME_RENDERING_POLICY_VERSION, } from "../job-resume-rendering.js";
import { canonicalVisibleText, extractVisibleTextFromHtml, extractVisibleTextFromMarkdown, } from "../role-resume-format-renderers.js";
import { buildJobCoverage, jobCoveragePaths } from "../job-coverage.js";
import { buildJobEvidenceMap, jobEvidenceMapPaths } from "../job-evidence-mapping.js";
import { buildJobFitProofAssessment, jobFitProofAssessmentPaths, } from "../job-fit-proof-assessment.js";
import { buildJobResumeDraftEvidenceUsage, generateJobResumeDraftProposal, getJobResumeDraftProposalStatus, jobResumeDraftProposalPaths, replayJobResumeDraftProposal, showJobResumeDraftProposal, validateJobResumeDraftPayload, } from "../job-resume-draft-proposal.js";
import { completeJobResumeDraftReview, getJobResumeDraftReviewStatus, initializeJobResumeDraftReview, setJobResumeDraftReviewDecision, showJobResumeDraftReview, } from "../job-resume-draft-review.js";
import { JOB_RESUME_DRAFTING_POLICY_NAME, JOB_RESUME_DRAFTING_POLICY_VERSION, buildJobResumeDraftScaffold, getJobResumeDraftScaffoldStatus, loadJobResumeDraftingContext, showJobResumeDraftScaffold, } from "../job-resume-drafting.js";
import { buildJobResumePlan, jobResumePlanPaths } from "../job-resume-planning.js";
import { buildJobRequirements, jobRequirementPaths } from "../job-requirements.js";
import { FakeInterpretationModelProvider } from "../model-provider.js";
import { hashFile, hashText, pathExists, writeJsonAtomic } from "../fs-utils.js";
import { analyzeTarget } from "../target-analysis.js";
import { stableJson } from "../target-proposal.js";
import { createJobTarget, createRoleTarget } from "../targets.js";
const FIRST_TIME = "2026-07-28T08:00:00.000Z";
const SECOND_TIME = "2026-07-29T08:00:00.000Z";
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
describe("Slice 2.7F Job-specific Resume Draft Construction", () => {
    it("builds a stable prose-free scaffold from a current usable Job plan", async () => {
        const fixture = await draftingWorkspace();
        const first = await buildJobResumeDraftScaffold(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const paths = {
            scaffold: path.join(fixture.workspace, first.scaffoldPath),
            manifest: path.join(fixture.workspace, first.manifestPath),
        };
        const before = {
            scaffold: await readFile(paths.scaffold),
            manifest: await readFile(paths.manifest),
            scaffoldMtime: (await stat(paths.scaffold)).mtimeMs,
            manifestMtime: (await stat(paths.manifest)).mtimeMs,
        };
        const second = await buildJobResumeDraftScaffold(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        const scaffold = await showJobResumeDraftScaffold(fixture.workspace, fixture.targetId);
        expect(first).toMatchObject({ result: "created" });
        expect(second).toMatchObject({ result: "already-current", scaffoldId: first.scaffoldId });
        expect(scaffold).toMatchObject({
            schemaVersion: 1,
            targetType: "job",
            mode: "job-specific-resume",
            draftingPolicy: {
                name: JOB_RESUME_DRAFTING_POLICY_NAME,
                version: JOB_RESUME_DRAFTING_POLICY_VERSION,
            },
        });
        expect(scaffold.sections).toHaveLength((await loadJobResumeDraftingContext(fixture.workspace, fixture.targetId)).contentPlan.sections.length);
        expect(scaffold.sections.flatMap((entry) => entry.placeholderIds).length).toBeGreaterThan(0);
        expect(JSON.stringify(scaffold)).not.toMatch(/"text"\s*:/);
        expect(await readFile(paths.scaffold)).toEqual(before.scaffold);
        expect(await readFile(paths.manifest)).toEqual(before.manifest);
        expect((await stat(paths.scaffold)).mtimeMs).toBe(before.scaffoldMtime);
        expect((await stat(paths.manifest)).mtimeMs).toBe(before.manifestMtime);
        expect((await getJobResumeDraftScaffoldStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
    });
    it("accepts Job Targets and rejects Role Targets and unusable plans", async () => {
        const workspace = await temporaryWorkspace();
        const role = await createRoleTarget(workspace, { title: "Engineering Manager" });
        await expect(buildJobResumeDraftScaffold(workspace, role.target.id)).rejects.toThrow(/Job Targets|Job Resume/i);
        const noProof = await draftingWorkspace({ noEvidence: true });
        await expect(buildJobResumeDraftScaffold(noProof.workspace, noProof.targetId)).rejects.toThrow(/usable for drafting/i);
    });
    it("generates only through an explicit provider call, caches, refreshes, and replays exactly", async () => {
        const fixture = await proposalFixture();
        const upstreamBefore = await upstreamArtifactHashes(fixture.workspace, fixture.targetId);
        const payload = await validDraftPayload(fixture.workspace, fixture.targetId);
        const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
        const first = await generateJobResumeDraftProposal(fixture.workspace, fixture.targetId, {
            provider,
            now: () => new Date(FIRST_TIME),
        });
        const cached = await generateJobResumeDraftProposal(fixture.workspace, fixture.targetId, {
            provider,
            now: () => new Date(SECOND_TIME),
        });
        const refreshed = await generateJobResumeDraftProposal(fixture.workspace, fixture.targetId, {
            provider,
            refresh: true,
            now: () => new Date(SECOND_TIME),
        });
        const replayed = await replayJobResumeDraftProposal(fixture.workspace, first.proposalId);
        const paths = jobResumeDraftProposalPaths(fixture.workspace, fixture.targetId, first.proposalId);
        const manifest = JSON.parse(await readFile(paths.manifestPath, "utf8"));
        expect(first.result, JSON.stringify((await showJobResumeDraftProposal(fixture.workspace, first.proposalId)).validationIssues, null, 2)).toBe("created");
        expect(cached).toMatchObject({ result: "cache-hit", proposalId: first.proposalId });
        expect(refreshed.result).toBe("created");
        expect(refreshed.proposalId).not.toBe(first.proposalId);
        expect(provider.callCount).toBe(2);
        expect(replayed).toMatchObject({ matches: true });
        expect(await hashFile(paths.rawPath)).toBe(manifest.rawResponseSha256);
        expect(await hashFile(paths.proposalPath)).toBe(manifest.proposalSha256);
        expect(replayed.originalSha256).toBe(replayed.replaySha256);
        expect((await getJobResumeDraftProposalStatus(fixture.workspace, first.proposalId))).toMatchObject({
            status: "current",
            readyForReview: true,
        });
        expect(await upstreamArtifactHashes(fixture.workspace, fixture.targetId)).toEqual(upstreamBefore);
    });
    it("retains statement-level provenance and complete claim/evidence ledgers", async () => {
        const fixture = await generatedFixture();
        const proposal = await showJobResumeDraftProposal(fixture.workspace, fixture.proposalId);
        const items = proposal.sections.flatMap((entry) => entry.items);
        expect(items.length).toBeGreaterThan(0);
        expect(proposal.claimLedger).toHaveLength(items.length);
        expect(proposal.claimLedger.every((entry) => entry.statementSha256 === hashText(entry.statementText) &&
            entry.requirementIds.length > 0 &&
            entry.evidenceMapLinkIds.length > 0 &&
            entry.evidenceIds.length > 0 &&
            entry.claimIds.length > 0 &&
            entry.claimBoundaryIds.length > 0)).toBe(true);
        expect(items.every((entry) => entry.provenance.targetId === fixture.targetId &&
            entry.provenance.planId.length > 0 &&
            entry.provenance.planSectionId.length > 0 &&
            entry.provenance.artifactHashes.contentPlanSha256.length === 64)).toBe(true);
        expect(proposal.evidenceUsage.length).toBeGreaterThan(0);
        expect(new Set(proposal.evidenceUsage.map((entry) => entry.evidenceId)).size)
            .toBe(proposal.evidenceUsage.length);
    });
    it("rejects hallucinated scope, target-title history, project employment, and unverified metrics", async () => {
        const fixture = await proposalFixture();
        const scaffold = await showJobResumeDraftScaffold(fixture.workspace, fixture.targetId);
        const context = await loadJobResumeDraftingContext(fixture.workspace, fixture.targetId);
        const base = await validDraftPayload(fixture.workspace, fixture.targetId);
        const scaffoldSha = await hashFile(path.join(fixture.workspace, "targets", "jobs", fixture.targetId, "resume-drafting", "scaffold", "job-resume-draft-scaffold.json"));
        const mutations = [
            ["invented metric", (payload) => { firstItem(payload).text += " Improved 73%."; }],
            ["target title history", (payload) => {
                    const item = itemByType(payload, "experience-bullet");
                    item.itemType = "experience-role";
                    item.text = "Technical Product Manager";
                }],
            ["project employment", (payload) => {
                    const project = itemByType(payload, "project");
                    const experience = itemByType(payload, "experience-bullet");
                    experience.evidenceIds = project.evidenceIds;
                    experience.claimIds = project.claimIds;
                    experience.evidenceMapLinkIds = project.evidenceMapLinkIds;
                    experience.requirementIds = project.requirementIds;
                }],
            ["ATS score", (payload) => { firstItem(payload).text = "ATS score: 95."; }],
            ["unsupported scale", (payload) => { firstItem(payload).text = "Managed 40 engineers."; }],
            ["invented technology", (payload) => {
                    itemByType(payload, "technology").text = "Kubernetes";
                }],
        ];
        for (const [name, mutate] of mutations) {
            const payload = structuredClone(base);
            mutate(payload);
            const result = validateJobResumeDraftPayload(payload, `test-${name}`, scaffold, context, scaffoldSha);
            expect(result.validationIssues.some((entry) => entry.severity === "critical" || entry.severity === "high"), name).toBe(true);
        }
    });
    it("permits only an exact plan-authorized verified metric", async () => {
        const fixture = await proposalFixture();
        const payload = await validDraftPayload(fixture.workspace, fixture.targetId);
        const metricItem = payload.sections.flatMap((entry) => entry.items)
            .find((entry) => entry.metricReferences.length > 0);
        expect(metricItem).toBeDefined();
        expect(metricItem?.text).toContain("Delivered 3 platform releases.");
        const changed = structuredClone(payload);
        const changedMetric = changed.sections.flatMap((entry) => entry.items)
            .find((entry) => entry.metricReferences.length > 0);
        changedMetric.text = "Delivered approximately 4 platform releases.";
        const scaffold = await showJobResumeDraftScaffold(fixture.workspace, fixture.targetId);
        const context = await loadJobResumeDraftingContext(fixture.workspace, fixture.targetId);
        const result = validateJobResumeDraftPayload(changed, "changed-metric", scaffold, context, await hashFile(path.join(fixture.workspace, "targets/jobs", fixture.targetId, "resume-drafting/scaffold/job-resume-draft-scaffold.json")));
        expect(result.validationIssues.map((entry) => entry.code)).toEqual(expect.arrayContaining([
            "ALTERED_VERIFIED_METRIC",
        ]));
    });
    it("requires review, validates human edits with the same rules, and never auto-approves model prose", async () => {
        const fixture = await generatedFixture();
        const review = await initializeJobResumeDraftReview(fixture.workspace, fixture.proposalId, {
            reviewerName: "Reviewer",
            now: () => new Date(FIRST_TIME),
        });
        expect(review.decisions.every((entry) => entry.decision === "pending")).toBe(true);
        await expect(approveJobResumeDraft(fixture.workspace, fixture.targetId)).rejects.toThrow(/completed.*review/i);
        const first = (await showJobResumeDraftProposal(fixture.workspace, fixture.proposalId))
            .sections.flatMap((entry) => entry.items)[0];
        await expect(setJobResumeDraftReviewDecision(fixture.workspace, fixture.proposalId, "draft-item", first.id, { decision: "edit", editedValue: "Managed 80 engineers." })).rejects.toThrow(/validation/i);
        expect((await showJobResumeDraftReview(fixture.workspace, review.id)).decisions
            .find((entry) => entry.itemId === first.id)?.decision).toBe("pending");
    });
    it("supports accept, edit, and reject decisions while keeping proposal immutable", async () => {
        const fixture = await generatedFixture();
        const proposalPath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "resume-drafting/proposals", fixture.proposalId, "proposal.json");
        const proposalBefore = await readFile(proposalPath);
        const review = await initializeJobResumeDraftReview(fixture.workspace, fixture.proposalId);
        const proposal = await showJobResumeDraftProposal(fixture.workspace, fixture.proposalId);
        const scaffold = await showJobResumeDraftScaffold(fixture.workspace, fixture.targetId);
        const optionalSection = proposal.sections.find((section) => scaffold.sections.find((entry) => entry.id === section.id)?.inclusion === "optional");
        const editedItem = proposal.sections
            .find((section) => section.type === "professional-experience")
            ?.items[0];
        expect(editedItem).toBeDefined();
        for (const decision of review.decisions) {
            const reject = decision.itemType === "section" && decision.itemId === optionalSection?.id;
            const edit = decision.itemType === "draft-item" && decision.itemId === editedItem?.id;
            await setJobResumeDraftReviewDecision(fixture.workspace, fixture.proposalId, decision.itemType, decision.itemId, {
                decision: reject ? "reject" : edit ? "edit" : "accept",
                ...(edit
                    ? {
                        editedValue: {
                            ...editedItem,
                            text: "Led API platform delivery with TypeScript and Node.js and coordinated stakeholder roadmap decisions.",
                        },
                    }
                    : {}),
                now: () => new Date(SECOND_TIME),
            });
        }
        await completeJobResumeDraftReview(fixture.workspace, fixture.proposalId, {
            now: () => new Date(SECOND_TIME),
        });
        const completed = await getJobResumeDraftReviewStatus(fixture.workspace, review.id);
        expect(completed.status).toBe("completed");
        expect(completed.counts.accept).toBeGreaterThan(0);
        expect(completed.counts.edit).toBe(1);
        if (optionalSection)
            expect(completed.counts.reject).toBeGreaterThan(0);
        expect(await readFile(proposalPath)).toEqual(proposalBefore);
    });
    it("approves deterministically with no provider call and excludes rejected wording", async () => {
        const fixture = await completedReviewFixture();
        const upstreamBefore = await upstreamArtifactHashes(fixture.workspace, fixture.targetId);
        const proposal = await showJobResumeDraftProposal(fixture.workspace, fixture.proposalId);
        const providerCallsBefore = fixture.provider.callCount;
        const result = await approveJobResumeDraft(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const approved = await showApprovedJobResumeDraft(fixture.workspace, fixture.targetId);
        const second = await approveJobResumeDraft(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        expect(result).toMatchObject({ result: "created", usableForRendering: true });
        expect(second).toMatchObject({ result: "already-current" });
        expect(fixture.provider.callCount).toBe(providerCallsBefore);
        expect(approved.sections.flatMap((entry) => entry.items).every((entry) => ["human-approved", "human-edited"].includes(entry.trustState) &&
            Boolean(entry.provenance.reviewDecisionId))).toBe(true);
        expect(approved.completeness).toMatchObject({
            status: "complete",
            reviewComplete: true,
            claimLedgerComplete: true,
            evidenceUsageComplete: true,
            provenanceComplete: true,
            usableForRendering: true,
        });
        expect(approved.prompt.templateId).toBe("target-job-resume-draft-proposal");
        expect(approved.sections.flatMap((entry) => entry.items).length)
            .toBeLessThanOrEqual(proposal.sections.flatMap((entry) => entry.items).length);
        expect((await getApprovedJobResumeDraftStatus(fixture.workspace, fixture.targetId))).toMatchObject({
            status: "current",
            usableForRendering: true,
        });
        expect(await upstreamArtifactHashes(fixture.workspace, fixture.targetId)).toEqual(upstreamBefore);
    });
    it("marks scaffold, proposal, review, and approved draft stale or invalid after dependency changes", async () => {
        const fixture = await completedReviewFixture();
        await approveJobResumeDraft(fixture.workspace, fixture.targetId);
        const planPath = jobResumePlanPaths(fixture.workspace, fixture.targetId).planPath;
        const plan = JSON.parse(await readFile(planPath, "utf8"));
        await writeJsonAtomic(planPath, { ...plan, updatedAt: SECOND_TIME });
        expect((await getJobResumeDraftScaffoldStatus(fixture.workspace, fixture.targetId)).status).toBe("stale");
        expect((await getJobResumeDraftProposalStatus(fixture.workspace, fixture.proposalId)).status).toBe("stale");
        expect((await getJobResumeDraftReviewStatus(fixture.workspace, fixture.review.id)).status).toBe("stale");
        expect((await getApprovedJobResumeDraftStatus(fixture.workspace, fixture.targetId)).status).toBe("stale");
    });
    it("reports missing lifecycle artifacts without generating them", async () => {
        const workspace = await temporaryWorkspace();
        expect((await getJobResumeDraftScaffoldStatus(workspace, "job-missing")).status).toBe("missing");
        expect((await getJobResumeDraftProposalStatus(workspace, "proposal-missing")).status).toBe("missing");
        expect((await getJobResumeDraftReviewStatus(workspace, "review-missing")).status).toBe("missing");
        expect((await getApprovedJobResumeDraftStatus(workspace, "job-missing")).status).toBe("missing");
    });
    it("detects duplicate statements, unsupported Job technology, and evidence overuse", async () => {
        const fixture = await proposalFixture();
        const payload = await validDraftPayload(fixture.workspace, fixture.targetId);
        const scaffold = await showJobResumeDraftScaffold(fixture.workspace, fixture.targetId);
        const context = await loadJobResumeDraftingContext(fixture.workspace, fixture.targetId);
        const scaffoldSha = await hashFile(path.join(fixture.workspace, "targets/jobs", fixture.targetId, "resume-drafting/scaffold/job-resume-draft-scaffold.json"));
        const drafted = payload.sections.flatMap((entry) => entry.items);
        drafted[2].text = drafted[0].text;
        drafted.find((entry) => entry.itemType === "experience-bullet").text += " React Native.";
        const validated = validateJobResumeDraftPayload(payload, "duplicate-and-terminology", scaffold, context, scaffoldSha);
        expect(validated.validationIssues.map((entry) => entry.code)).toEqual(expect.arrayContaining([
            "DUPLICATE_STATEMENT",
            "UNSUPPORTED_JOB_DESCRIPTION_TERMINOLOGY",
        ]));
        const repeatedSections = structuredClone(validated.sections);
        const sourceItem = repeatedSections.flatMap((entry) => entry.items)[0];
        for (const section of repeatedSections) {
            if (section.items.length > 0)
                section.items = Array.from({ length: 20 }, () => sourceItem);
        }
        expect(buildJobResumeDraftEvidenceUsage(repeatedSections, scaffold, context)
            .some((entry) => entry.status === "overused")).toBe(true);
    });
    it("stops at the approved structured draft without rendering or export artifacts", async () => {
        const fixture = await completedReviewFixture();
        await approveJobResumeDraft(fixture.workspace, fixture.targetId);
        const targetRoot = path.join(fixture.workspace, "targets/jobs", fixture.targetId);
        expect(await pathExists(path.join(targetRoot, "resume-rendering"))).toBe(false);
        expect(await pathExists(path.join(targetRoot, "exports"))).toBe(false);
        expect(await pathExists(path.join(fixture.workspace, "outputs/exports"))).toBe(false);
    });
});
describe("Slice 2.7G deterministic Job resume rendering and export", () => {
    it("composes one exact Job canonical document with complete statement provenance", async () => {
        const fixture = await renderingWorkspace();
        const upstream = await upstreamArtifactHashes(fixture.workspace, fixture.targetId);
        const result = await composeJobResumeRenderDocument(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const document = await showJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const approved = await showApprovedJobResumeDraft(fixture.workspace, fixture.targetId);
        const approvedItems = approved.sections
            .filter((section) => section.status !== "excluded" && section.items.length > 0)
            .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id))
            .flatMap((section) => section.items);
        expect(result.result).toBe("created");
        expect(document).toMatchObject({
            targetType: "job",
            mode: "job-specific-resume",
            renderingPolicy: {
                name: JOB_RESUME_RENDERING_POLICY_NAME,
                version: JOB_RESUME_RENDERING_POLICY_VERSION,
            },
            validation: {
                status: "valid",
                exactTextPreserved: true,
                sectionOrderPreserved: true,
                itemOrderPreserved: true,
                sourceMapComplete: true,
                privateMetadataAbsent: true,
            },
        });
        expect(document.sections.flatMap((section) => section.blocks).map((block) => block.text))
            .toEqual(approvedItems.map((item) => item.text));
        expect(document.sourceMap).toHaveLength(approvedItems.length);
        expect(document.sourceMap.every((entry) => entry.requirementIds.length > 0
            && entry.coverageIds.length > 0
            && entry.assessmentIds.length > 0
            && entry.evidenceMapLinkIds.length > 0
            && entry.evidenceIds.length > 0
            && entry.claimIds.length > 0
            && entry.claimBoundaryIds.length > 0
            && entry.visibleTextSha256.length === 64)).toBe(true);
        expect(await upstreamArtifactHashes(fixture.workspace, fixture.targetId)).toEqual(upstream);
    });
    it("preserves canonical IDs, hashes, bytes, timestamps, and mtimes on unchanged reruns", async () => {
        const fixture = await renderingWorkspace();
        const first = await composeJobResumeRenderDocument(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const paths = jobResumeRenderDocumentPaths(fixture.workspace, fixture.targetId);
        const before = {
            document: await readFile(paths.documentPath),
            manifest: await readFile(paths.manifestPath),
            documentMtime: (await stat(paths.documentPath)).mtimeMs,
            manifestMtime: (await stat(paths.manifestPath)).mtimeMs,
        };
        const second = await composeJobResumeRenderDocument(fixture.workspace, fixture.targetId, { now: () => new Date(SECOND_TIME) });
        expect(second).toMatchObject({
            result: "already-current",
            canonicalDocumentId: first.canonicalDocumentId,
        });
        expect(await readFile(paths.documentPath)).toEqual(before.document);
        expect(await readFile(paths.manifestPath)).toEqual(before.manifest);
        expect((await stat(paths.documentPath)).mtimeMs).toBe(before.documentMtime);
        expect((await stat(paths.manifestPath)).mtimeMs).toBe(before.manifestMtime);
        expect((await getJobResumeRenderDocumentStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
    });
    it("supports both profiles and page sizes while requiring explicit rebuild for option changes", async () => {
        const fixture = await renderingWorkspace();
        await composeJobResumeRenderDocument(fixture.workspace, fixture.targetId, {
            profile: "ats-standard",
            pageSize: "A4",
            dateFormat: "MMM-YYYY",
        });
        const requested = {
            profile: "compact-professional",
            pageSize: "LETTER",
            dateFormat: "exact-source",
        };
        await expect(composeJobResumeRenderDocument(fixture.workspace, fixture.targetId, requested)).rejects.toThrow(/--rebuild/);
        const rebuilt = await composeJobResumeRenderDocument(fixture.workspace, fixture.targetId, { ...requested, rebuild: true });
        const document = await showJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        expect(rebuilt.result).toBe("rebuilt");
        expect(document.profile).toMatchObject({
            name: "compact-professional",
            page: { size: "LETTER" },
            layout: { columns: 1, useTablesForCoreContent: false },
            typography: { minimumFontSizePt: 10 },
        });
    });
    it("accepts only current approved Job drafts and rejects Role Targets", async () => {
        const workspace = await temporaryWorkspace();
        const role = await createRoleTarget(workspace, { title: "Engineering Manager" });
        await expect(composeJobResumeRenderDocument(workspace, role.target.id)).rejects.toThrow(/Job Targets only/);
        const unapproved = await draftingWorkspace();
        await expect(composeJobResumeRenderDocument(unapproved.workspace, unapproved.targetId)).rejects.toThrow(/Approved Job Resume Draft/);
    });
    it("renders byte-stable Markdown and HTML with exact approved visible text", async () => {
        const fixture = await renderingWorkspace();
        const markdown = await exportJobResume(fixture.workspace, fixture.targetId, { format: "markdown", now: () => new Date(FIRST_TIME) });
        const html = await exportJobResume(fixture.workspace, fixture.targetId, { format: "html", now: () => new Date(FIRST_TIME) });
        const document = await showJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const markdownBytes = await readFile(path.join(fixture.workspace, markdown.outputPath));
        const htmlBytes = await readFile(path.join(fixture.workspace, html.outputPath));
        const markdownAgain = await exportJobResume(fixture.workspace, fixture.targetId, { format: "markdown", now: () => new Date(SECOND_TIME) });
        const htmlAgain = await exportJobResume(fixture.workspace, fixture.targetId, { format: "html", now: () => new Date(SECOND_TIME) });
        expect(extractVisibleTextFromMarkdown(markdownBytes.toString("utf8")))
            .toBe(canonicalVisibleText(document));
        expect(extractVisibleTextFromHtml(htmlBytes.toString("utf8")))
            .toBe(canonicalVisibleText(document));
        expect(markdownAgain.result).toBe("already-current");
        expect(htmlAgain.result).toBe("already-current");
        expect(await readFile(path.join(fixture.workspace, markdown.outputPath)))
            .toEqual(markdownBytes);
        expect(await readFile(path.join(fixture.workspace, html.outputPath)))
            .toEqual(htmlBytes);
        expect(markdown.outputPath).toMatch(/job-resume-technical-product-manager-ats-standard-markdown\.md$/);
        expect(htmlBytes.toString("utf8")).not.toMatch(/<script\b|https?:\/\/[^"' )]+\.(?:css|js)/i);
    });
    it("exports all formats through the shared engine with cross-format fidelity", async () => {
        const fixture = await renderingWorkspace();
        await composeJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const document = await showJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const toolchain = fakeJobResumeToolchain(canonicalVisibleText(document));
        const result = await exportAllJobResume(fixture.workspace, fixture.targetId, {
            toolchain,
        });
        const exports = await listJobResumeExports(fixture.workspace, fixture.targetId);
        expect(result.failed).toEqual([]);
        expect(result.succeeded.map((entry) => entry.format).sort())
            .toEqual(["docx", "html", "markdown", "pdf"]);
        expect(new Set(result.succeeded.map((entry) => entry.exportId)).size).toBe(4);
        expect(exports).toHaveLength(4);
        expect(exports.every((entry) => entry.validation.status === "valid"
            && entry.validation.visibleTextEquivalent
            && entry.canonicalDocumentId === document.id
            && entry.sourceMapSha256.length === 64)).toBe(true);
        expect(exports.find((entry) => entry.format === "pdf")?.validation).toMatchObject({
            pageCount: 1,
            pageSizeVerified: true,
            textExtractable: true,
        });
    }, 15_000);
    it("reports PDF adapter failure honestly without invalidating successful formats", async () => {
        const fixture = await renderingWorkspace();
        await composeJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const document = await showJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const toolchain = fakeJobResumeToolchain(canonicalVisibleText(document), {
            failPdf: true,
        });
        const result = await exportAllJobResume(fixture.workspace, fixture.targetId, {
            toolchain,
        });
        expect(result.succeeded.map((entry) => entry.format).sort())
            .toEqual(["docx", "html", "markdown"]);
        expect(result.failed).toHaveLength(1);
        expect(result.failed[0]).toMatchObject({ format: "pdf" });
        expect(result.failed[0].error).toMatch(/LibreOffice test adapter unavailable/);
        expect((await listJobResumeExports(fixture.workspace, fixture.targetId))
            .map((entry) => entry.format).sort()).toEqual(["docx", "html", "markdown"]);
    }, 15_000);
    it("validates manifests and repairs tampered exports only with explicit rebuild", async () => {
        const fixture = await renderingWorkspace();
        const exported = await exportJobResume(fixture.workspace, fixture.targetId, { format: "markdown" });
        const outputPath = path.join(fixture.workspace, exported.outputPath);
        const manifest = await showJobResumeExport(fixture.workspace, exported.exportId);
        const validation = await validateStoredJobResumeExport(fixture.workspace, exported.exportId, fakeJobResumeToolchain("unused"));
        expect(validation).toMatchObject({
            status: "valid",
            visibleTextEquivalent: true,
            binaryDeterministic: true,
        });
        expect(manifest.outputSha256).toBe(await hashFile(outputPath));
        expect(manifest.sourceMapSha256).toBe(await hashFile(path.join(fixture.workspace, manifest.sourceMapPath)));
        await writeFile(outputPath, "tampered", "utf8");
        expect((await getJobResumeExportStatus(fixture.workspace, exported.exportId)).status).toBe("invalid");
        await expect(exportJobResume(fixture.workspace, fixture.targetId, {
            format: "markdown",
        })).rejects.toThrow(/--rebuild/);
        expect((await exportJobResume(fixture.workspace, fixture.targetId, {
            format: "markdown",
            rebuild: true,
        })).result).toBe("rebuilt");
    });
    it("preserves approved metrics, titles, dates, qualifiers, and project scope without visible internals", async () => {
        const fixture = await renderingWorkspace();
        const approved = await showApprovedJobResumeDraft(fixture.workspace, fixture.targetId);
        const markdown = await exportJobResume(fixture.workspace, fixture.targetId, { format: "markdown" });
        const document = await showJobResumeRenderDocument(fixture.workspace, fixture.targetId);
        const visible = await readFile(path.join(fixture.workspace, markdown.outputPath), "utf8");
        const approvedItems = approved.sections
            .filter((section) => section.status !== "excluded")
            .flatMap((section) => section.items);
        expect(document.sections.flatMap((section) => section.blocks).map((block) => block.text))
            .toEqual(approvedItems.map((item) => item.text));
        expect(visible).not.toContain(fixture.workspace);
        expect(visible).not.toMatch(/requirement_|coverage_|assessment_|evidence_|claim_|sha256|ATS score|hiring probability|application recommendation/i);
        expect(JSON.stringify(document.sourceMap)).toContain("requirementIds");
    });
    it("rejects unsafe output paths and exposes missing, current, stale, and invalid lifecycle states", async () => {
        const fixture = await renderingWorkspace();
        expect((await getJobResumeRenderDocumentStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
        await expect(exportJobResume(fixture.workspace, fixture.targetId, {
            format: "markdown",
            outputDir: "../outside",
        })).rejects.toThrow(/path traversal|relative/i);
        const exported = await exportJobResume(fixture.workspace, fixture.targetId, { format: "html" });
        expect((await getJobResumeExportStatus(fixture.workspace, exported.exportId)).status).toBe("current");
        expect((await getJobResumeExportStatus(fixture.workspace, "missing-job-export")).status).toBe("missing");
        const paths = jobResumeRenderDocumentPaths(fixture.workspace, fixture.targetId);
        const document = JSON.parse(await readFile(paths.documentPath, "utf8"));
        document.updatedAt = SECOND_TIME;
        await writeJsonAtomic(paths.documentPath, document);
        expect((await getJobResumeRenderDocumentStatus(fixture.workspace, fixture.targetId)).status).toBe("invalid");
        expect((await getJobResumeExportStatus(fixture.workspace, exported.exportId)).status).toBe("stale");
    });
});
async function temporaryWorkspace() {
    return mkdtemp(path.join(tmpdir(), "prooflayer-job-resume-draft-"));
}
async function draftingWorkspace(options = {}) {
    const workspace = await temporaryWorkspace();
    const sourcePath = path.join(workspace, "imports", "job.md");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, JOB_DESCRIPTION, "utf8");
    const target = await createJobTarget(workspace, { file: sourcePath });
    await analyzeTarget(workspace, target.target.id, { now: () => new Date(FIRST_TIME) });
    await buildJobRequirements(workspace, target.target.id, { now: () => new Date(FIRST_TIME) });
    if (options.noEvidence)
        await writeEmptyKnowledgeBase(workspace);
    else
        await writeCandidateKnowledgeBase(workspace);
    await buildJobEvidenceMap(workspace, target.target.id, { now: () => new Date(FIRST_TIME) });
    await buildJobCoverage(workspace, target.target.id, { now: () => new Date(FIRST_TIME) });
    await buildJobFitProofAssessment(workspace, target.target.id, { now: () => new Date(FIRST_TIME) });
    await buildJobResumePlan(workspace, target.target.id, { now: () => new Date(FIRST_TIME) });
    return { workspace, targetId: target.target.id };
}
async function proposalFixture() {
    const fixture = await draftingWorkspace();
    await buildJobResumeDraftScaffold(fixture.workspace, fixture.targetId, {
        now: () => new Date(FIRST_TIME),
    });
    return fixture;
}
async function generatedFixture() {
    const fixture = await proposalFixture();
    const payload = await validDraftPayload(fixture.workspace, fixture.targetId);
    const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
    const generated = await generateJobResumeDraftProposal(fixture.workspace, fixture.targetId, {
        provider,
        now: () => new Date(FIRST_TIME),
    });
    return { ...fixture, provider, proposalId: generated.proposalId };
}
async function completedReviewFixture() {
    const fixture = await generatedFixture();
    const review = await initializeJobResumeDraftReview(fixture.workspace, fixture.proposalId, {
        reviewerName: "Reviewer",
        now: () => new Date(FIRST_TIME),
    });
    await acceptAllDecisions(fixture.workspace, fixture.proposalId, review);
    await completeJobResumeDraftReview(fixture.workspace, fixture.proposalId, {
        now: () => new Date(FIRST_TIME),
    });
    return { ...fixture, review };
}
async function renderingWorkspace() {
    const fixture = await completedReviewFixture();
    await approveJobResumeDraft(fixture.workspace, fixture.targetId, {
        now: () => new Date(FIRST_TIME),
    });
    return fixture;
}
function fakeJobResumeToolchain(visibleText, options = {}) {
    return {
        async createDocx({ outputPath }) {
            await writeFile(outputPath, Buffer.from("PK\u0003\u0004ProofLayer Job DOCX fixture"));
        },
        async createPdf({ outputPath }) {
            if (options.failPdf) {
                throw new Error("LibreOffice test adapter unavailable");
            }
            await writeFile(outputPath, Buffer.from("%PDF-1.7\n% ProofLayer Job PDF fixture\n", "utf8"));
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
async function validDraftPayload(workspace, targetId) {
    const scaffold = await showJobResumeDraftScaffold(workspace, targetId);
    const context = await loadJobResumeDraftingContext(workspace, targetId);
    const scaffoldSha = await hashFile(path.join(workspace, "targets/jobs", targetId, "resume-drafting/scaffold/job-resume-draft-scaffold.json"));
    const boundaryById = new Map(context.contentPlan.claimBoundaries.map((entry) => [entry.id, entry]));
    const claimById = new Map(context.claims.map((entry) => [entry.id, entry]));
    const linkById = new Map(context.evidenceMap.links.map((entry) => [entry.id, entry]));
    const metricById = new Map(context.contentPlan.metricPermissions.map((entry) => [entry.id, entry]));
    return {
        sections: scaffold.sections.map((guard) => {
            const shouldDraft = guard.inclusion !== "exclude"
                && guard.allowedEvidenceIds.length > 0
                && guard.allowedClaimIds.length > 0
                && guard.allowedRequirementIds.length > 0;
            const items = shouldDraft ? [createDraftItem()] : [];
            return {
                id: guard.id,
                planSectionId: guard.planSectionId,
                type: guard.sectionType,
                order: guard.order,
                status: guard.inclusion === "exclude" ? "excluded" : items.length ? "drafted" : "empty",
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
            function createDraftItem() {
                const allowedMetricPermission = guard.sectionType === "selected-impact"
                    ? guard.allowedMetricPermissionIds
                        .map((id) => metricById.get(id))
                        .find((entry) => entry?.state === "allowed")
                    : undefined;
                const eligibleLinks = guard.allowedEvidenceMapLinkIds
                    .map((id) => linkById.get(id))
                    .filter((entry) => entry &&
                    guard.allowedRequirementIds.includes(entry.requirementId) &&
                    guard.allowedEvidenceIds.includes(entry.evidenceId) &&
                    guard.allowedClaimIds.includes(entry.claimId));
                const link = (allowedMetricPermission
                    ? eligibleLinks.find((entry) => entry?.evidenceId === allowedMetricPermission.evidenceId &&
                        entry.claimId === allowedMetricPermission.claimId)
                    : undefined)
                    ?? eligibleLinks.find((entry) => {
                        if (!entry)
                            return false;
                        const claim = claimById.get(entry.claimId);
                        const preferred = preferredClaimTypes(guard.sectionType, claim?.type);
                        return guard.allowedClaimBoundaryIds.map((id) => boundaryById.get(id)).some((boundary) => boundary &&
                            boundary.state !== "prohibited" &&
                            boundary.requirementId === entry.requirementId &&
                            boundary.evidenceIds.includes(entry.evidenceId) &&
                            boundary.claimIds.includes(entry.claimId) &&
                            preferred.some((type) => guard.allowedClaimTypes.includes(type) &&
                                boundary.allowedClaimTypes.includes(type)));
                    })
                    ?? eligibleLinks[0];
                if (!link)
                    throw new Error(`No consistent planned link for ${guard.sectionType}`);
                const claim = claimById.get(link.claimId);
                const titleBoundary = guard.sectionType === "headline"
                    ? guard.allowedClaimBoundaryIds.map((id) => boundaryById.get(id)).find((entry) => entry?.kind === "target-title")
                    : undefined;
                const metricBoundary = guard.allowedMetricPermissionIds.length > 0
                    ? guard.allowedClaimBoundaryIds.map((id) => boundaryById.get(id)).find((entry) => entry?.kind === "metric" && entry.claimIds.includes(link.claimId))
                    : undefined;
                const claimBoundary = guard.allowedClaimBoundaryIds.map((id) => boundaryById.get(id)).find((entry) => entry &&
                    entry.state !== "prohibited" &&
                    entry.requirementId === link.requirementId &&
                    entry.evidenceIds.includes(link.evidenceId) &&
                    entry.claimIds.includes(link.claimId) &&
                    (allowedMetricPermission
                        ? true
                        : preferredClaimTypes(guard.sectionType, claim.type).some((type) => guard.allowedClaimTypes.includes(type) &&
                            entry.allowedClaimTypes.includes(type))));
                const boundary = titleBoundary ?? metricBoundary ?? claimBoundary;
                if (!boundary)
                    throw new Error(`No allowed boundary for ${guard.sectionType}`);
                const metricPermission = guard.allowedMetricPermissionIds
                    .map((id) => metricById.get(id))
                    .find((entry) => entry?.state === "allowed" && entry.claimId === claim.id);
                const claimType = guard.sectionType === "headline"
                    ? "target-title"
                    : metricPermission
                        ? "quantified-outcome"
                        : preferredClaimTypes(guard.sectionType, claim.type).find((entry) => boundary.allowedClaimTypes.includes(entry) &&
                            guard.allowedClaimTypes.includes(entry))
                            ?? boundary.allowedClaimTypes.find((entry) => guard.allowedClaimTypes.includes(entry))
                            ?? guard.allowedClaimTypes[0];
                const text = metricPermission?.exactApprovedMetricText
                    ?? draftText(guard.sectionType, context.target.title, claim.approvedWording);
                const assessment = context.assessment.requirementAssessments.find((entry) => entry.requirementId === link.requirementId);
                const coverage = context.coverage.requirements.find((entry) => entry.requirementId === link.requirementId);
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
                    qualifiers: unique([
                        ...guard.requiredQualifierCodes,
                        ...boundary.requiredQualifierCodes,
                    ]),
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
                            scaffoldSha256: scaffoldSha,
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
    if (sectionType === "leadership-capabilities")
        return ["leadership-behavior", "responsibility", "capability-theme"];
    if (sectionType === "selected-impact")
        return ["achievement", "delivery-outcome", "product-outcome", "business-outcome"];
    return ["capability-theme", "responsibility", "technology", "project", "achievement"];
}
async function acceptAllDecisions(workspace, proposalId, review, options = {}) {
    for (const decision of review.decisions) {
        const reject = decision.itemType === "section" && decision.itemId === options.rejectSectionId;
        await setJobResumeDraftReviewDecision(workspace, proposalId, decision.itemType, decision.itemId, {
            decision: reject ? "reject" : "accept",
            now: () => new Date(SECOND_TIME),
        });
    }
}
function firstItem(payload) {
    return payload.sections.flatMap((entry) => entry.items)[0];
}
function itemByType(payload, itemType) {
    const item = payload.sections.flatMap((entry) => entry.items).find((entry) => entry.itemType === itemType);
    if (!item)
        throw new Error(`No draft item of type ${itemType}`);
    return item;
}
function unique(values) {
    return [...new Set(values)].sort();
}
async function upstreamArtifactHashes(workspace, targetId) {
    const requirements = jobRequirementPaths(workspace, targetId);
    const evidenceMap = jobEvidenceMapPaths(workspace, targetId);
    const coverage = jobCoveragePaths(workspace, targetId);
    const assessment = jobFitProofAssessmentPaths(workspace, targetId);
    const plan = jobResumePlanPaths(workspace, targetId);
    const paths = [
        path.join(workspace, "targets/jobs", targetId, "target.json"),
        path.join(workspace, "targets/jobs", targetId, "job-description.md"),
        requirements.modelPath,
        requirements.manifestPath,
        evidenceMap.mapPath,
        evidenceMap.manifestPath,
        coverage.coveragePath,
        coverage.manifestPath,
        assessment.assessmentPath,
        assessment.manifestPath,
        plan.planPath,
        plan.manifestPath,
        path.join(workspace, "kb/sources.json"),
        path.join(workspace, "kb/evidence-items.json"),
        path.join(workspace, "kb/claims.json"),
    ];
    return Promise.all(paths.map(async (filePath) => [filePath, await hashFile(filePath)]));
}
async function writeEmptyKnowledgeBase(workspace) {
    const kb = path.join(workspace, "kb");
    await mkdir(kb, { recursive: true });
    await writeJsonAtomic(path.join(kb, "sources.json"), []);
    await writeJsonAtomic(path.join(kb, "evidence-items.json"), []);
    await writeJsonAtomic(path.join(kb, "claims.json"), []);
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
