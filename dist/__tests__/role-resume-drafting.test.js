import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { approveRoleResumeDraftProposal, getApprovedRoleResumeDraftStatus, showApprovedRoleResumeDraft, } from "../approved-role-resume-draft.js";
import { approveInterpretationProposal, showApprovedTargetInterpretation } from "../approved-interpretation.js";
import { assessmentPaths, buildFitAssessment, createAssessmentManifest, loadAssessmentContext, showFitAssessment, } from "../fit-assessment.js";
import { expectationProvenance, loadMatchingContext, manualMatchId, writeApprovedMatching, } from "../evidence-matching.js";
import { hashFile, hashText, writeJsonAtomic } from "../fs-utils.js";
import { FakeInterpretationModelProvider, } from "../model-provider.js";
import { ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_ID, generateRoleResumeDraftProposal, getRoleResumeDraftProposalStatus, replayRoleResumeDraftProposal, showRoleResumeDraftProposal, } from "../role-resume-draft-proposal.js";
import { completeRoleResumeDraftReview, initializeRoleResumeDraftReview, setRoleResumeDraftReviewDecision, } from "../role-resume-draft-review.js";
import { ROLE_RESUME_DRAFTING_POLICY_NAME, ROLE_RESUME_DRAFTING_POLICY_VERSION, buildRoleResumeDraftScaffold, getRoleResumeDraftScaffoldStatus, loadRoleResumeDraftingContext, roleResumeDraftScaffoldPaths, showRoleResumeDraftScaffold, } from "../role-resume-drafting.js";
import { createRoleResumePlanManifest, buildRoleResumePlan, loadRoleResumePlanningContext, roleResumePlanPaths, showRoleResumePlan, } from "../role-resume-planning.js";
import { analyzeTarget } from "../target-analysis.js";
import { interpretTarget } from "../target-interpretation.js";
import { generateInterpretationProposal, showInterpretationProposal, stableJson, } from "../target-proposal.js";
import { completeProposalReview, initializeProposalReview, setProposalReviewDecision, } from "../target-proposal-review.js";
import { createJobTarget, createRoleTarget, showTarget } from "../targets.js";
import { canonicalVisibleText, extractVisibleTextFromHtml, extractVisibleTextFromMarkdown, } from "../role-resume-format-renderers.js";
import { exportAllRoleResume, exportRoleResume, getRoleResumeExportStatus, listRoleResumeExports, normalizeOutputDirectory, showRoleResumeExport, validateStoredRoleResumeExport, } from "../role-resume-render-export.js";
import { composeRoleResumeRenderDocument, getRoleResumeRenderDocumentStatus, resolveRoleResumeRenderProfile, roleResumeRenderDocumentPaths, showRoleResumeRenderDocument, ROLE_RESUME_RENDERING_POLICY_NAME, ROLE_RESUME_RENDERING_POLICY_VERSION, } from "../role-resume-rendering.js";
import { RoleResumeDateFormatSchema, RoleResumePageSizeSchema, RoleResumeRenderProfileNameSchema, } from "../role-resume-render-schemas.js";
const FIRST_TIME = "2026-07-23T12:00:00.000Z";
const SECOND_TIME = "2026-07-23T13:00:00.000Z";
describe("Slice 2.6B role resume draft proposal", () => {
    it("builds a stable prose-free deterministic scaffold from only current approved Role artifacts", async () => {
        const fixture = await draftingFixture();
        const result = await buildRoleResumeDraftScaffold(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const scaffold = await showRoleResumeDraftScaffold(fixture.workspace, fixture.targetId);
        expect(result.result).toBe("created");
        expect(scaffold.draftingPolicy).toEqual({
            name: ROLE_RESUME_DRAFTING_POLICY_NAME,
            version: ROLE_RESUME_DRAFTING_POLICY_VERSION,
        });
        expect(scaffold.targetType).toBe("role");
        expect(scaffold.mode).toBe("market-positioning");
        expect(scaffold.sections.map((entry) => entry.planSectionId)).toEqual((await showRoleResumePlan(fixture.workspace, fixture.targetId, "approved")).sections
            .slice()
            .sort((a, b) => a.order - b.order || a.type.localeCompare(b.type))
            .map((entry) => entry.id));
        expect(scaffold.sections.find((entry) => entry.sectionType === "headline")?.allowedEvidenceIds.length).toBeGreaterThan(0);
        expect(scaffold.draftingConstraints.map((entry) => entry.code)).toEqual(expect.arrayContaining([
            "APPROVED_PLAN_IS_CONSTRAINT_SYSTEM",
            "STATEMENT_PROVENANCE_REQUIRED",
            "TARGET_TITLE_IS_POSITIONING_ONLY",
            "PROJECT_SCOPE_MUST_REMAIN_PROJECT_SCOPE",
            "RESPONSIBILITY_IS_NOT_ACHIEVEMENT",
            "REVIEWED_METRICS_ONLY",
            "NO_JOB_SPECIFIC_CONTENT",
        ]));
        expect(stableJson(scaffold)).not.toMatch(/\b(?:Led|Built|Delivered|Managed|Results-driven)\b[^"]{12,}/);
    });
    it("rejects Job Targets and missing, partial, stale, or unusable approved plans", async () => {
        const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-draft-job-"));
        const source = path.join(workspace, "job.md");
        await writeFile(source, "---\ntitle: Engineering Manager\n---\n\n## Requirements\n- Lead delivery.\n", "utf8");
        const job = await createJobTarget(workspace, { file: source });
        await expect(buildRoleResumeDraftScaffold(workspace, job.target.id)).rejects.toThrow(/Role Targets only/);
        const fixture = await draftingFixture({ promotePlan: false });
        await expect(buildRoleResumeDraftScaffold(fixture.workspace, fixture.targetId)).rejects.toThrow(/Approved Role Resume Content Plan/);
        const stale = await draftingFixture();
        const planPaths = roleResumePlanPaths(stale.workspace, stale.targetId, "approved");
        const plan = JSON.parse(await readFile(planPaths.planPath, "utf8"));
        plan.updatedAt = SECOND_TIME;
        await writeJsonAtomic(planPaths.planPath, plan);
        await expect(buildRoleResumeDraftScaffold(stale.workspace, stale.targetId)).rejects.toThrow(/current/);
    });
    it("preserves scaffold IDs, hashes, timestamps, and mtimes on unchanged reruns", async () => {
        const fixture = await draftingFixture();
        expect((await getRoleResumeDraftScaffoldStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
        const first = await buildRoleResumeDraftScaffold(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const scaffold = await showRoleResumeDraftScaffold(fixture.workspace, fixture.targetId);
        const mtime = (await stat(path.join(fixture.workspace, first.scaffoldPath))).mtimeMs;
        const second = await buildRoleResumeDraftScaffold(fixture.workspace, fixture.targetId, { now: () => new Date(SECOND_TIME) });
        expect(second.result).toBe("already-current");
        expect(second.scaffoldId).toBe(first.scaffoldId);
        expect((await showRoleResumeDraftScaffold(fixture.workspace, fixture.targetId)).createdAt).toBe(scaffold.createdAt);
        expect((await showRoleResumeDraftScaffold(fixture.workspace, fixture.targetId)).updatedAt).toBe(scaffold.updatedAt);
        expect((await stat(path.join(fixture.workspace, second.scaffoldPath))).mtimeMs).toBe(mtime);
        expect((await getRoleResumeDraftScaffoldStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
    });
    it("creates a valid traceable proposal, caches unchanged input, refreshes, and replays exact raw bytes", async () => {
        const fixture = await scaffoldFixture();
        const payload = await validDraftPayload(fixture.workspace, fixture.targetId);
        const raw = JSON.stringify(payload);
        const provider = new CapturingFakeProvider(raw);
        const first = await generateRoleResumeDraftProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(FIRST_TIME) });
        const proposal = await showRoleResumeDraftProposal(fixture.workspace, first.proposalId);
        const second = await generateRoleResumeDraftProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(SECOND_TIME) });
        const refreshed = await generateRoleResumeDraftProposal(fixture.workspace, fixture.targetId, { provider, refresh: true, now: () => new Date(SECOND_TIME) });
        const replay = await replayRoleResumeDraftProposal(fixture.workspace, first.proposalId);
        expect(first.result).toBe("created");
        expect(second).toMatchObject({ result: "cache-hit", proposalId: first.proposalId });
        expect(refreshed.proposalId).not.toBe(first.proposalId);
        expect(provider.callCount).toBe(2);
        expect(replay.matches).toBe(true);
        expect(await readFile(path.join(fixture.workspace, proposal.rawResponsePath), "utf8")).toBe(raw);
        expect(proposal.rawResponseSha256).toBe(hashText(raw));
        expect(proposal.prompt.templateId).toBe(ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_ID);
        expect(proposal.prompt.renderedPromptSha256).toBe(hashText(provider.lastPrompt));
        expect(proposal.input.normalizedModelInputSha256).toMatch(/^[a-f0-9]{64}$/);
        expect(proposal.claimLedger).toHaveLength(proposal.sections.flatMap((entry) => entry.items).length);
        expect(proposal.claimLedger.every((entry) => entry.evidenceIds.length > 0 && entry.claimBoundaryIds.length > 0)).toBe(true);
        expect(proposal.evidenceUsage.every((entry) => entry.usageCount === entry.draftItemIds.length)).toBe(true);
        expect((await getRoleResumeDraftProposalStatus(fixture.workspace, first.proposalId))).toMatchObject({
            status: "current",
            readyForReview: true,
            proposalHashMatches: true,
            rawResponseHashMatches: true,
            scaffoldHashMatches: true,
        });
    });
    it("derives proposal identity from content and a deterministic refresh ordinal, never timestamps", async () => {
        const firstFixture = await scaffoldFixture();
        const secondFixture = await scaffoldFixture();
        const firstPayload = await validDraftPayload(firstFixture.workspace, firstFixture.targetId);
        const secondPayload = await validDraftPayload(secondFixture.workspace, secondFixture.targetId);
        const first = await generateRoleResumeDraftProposal(firstFixture.workspace, firstFixture.targetId, {
            provider: new FakeInterpretationModelProvider(JSON.stringify(firstPayload)),
            now: () => new Date(FIRST_TIME),
        });
        const sameContentDifferentTime = await generateRoleResumeDraftProposal(secondFixture.workspace, secondFixture.targetId, {
            provider: new FakeInterpretationModelProvider(JSON.stringify(secondPayload)),
            now: () => new Date(SECOND_TIME),
        });
        const refreshed = await generateRoleResumeDraftProposal(firstFixture.workspace, firstFixture.targetId, {
            provider: new FakeInterpretationModelProvider(JSON.stringify(firstPayload)),
            refresh: true,
            now: () => new Date(SECOND_TIME),
        });
        expect(sameContentDifferentTime.proposalId).toBe(first.proposalId);
        expect(refreshed.proposalId).not.toBe(first.proposalId);
    });
    describe("strict proposal validation", () => {
        let shared;
        beforeAll(async () => {
            shared = await scaffoldFixture();
        });
        it.each([
            ["unknown section", (payload) => { payload.sections[0].id = "unknown-section"; }],
            ["missing section", (payload) => { payload.sections.pop(); }],
            ["duplicate section", (payload) => { payload.sections.push(structuredClone(payload.sections[0])); }],
            ["wrong section order", (payload) => { payload.sections[0].order += 4; }],
            ["excluded section content", (payload) => {
                    const excluded = payload.sections.find((entry) => entry.status === "excluded");
                    excluded.status = "drafted";
                    excluded.items = [structuredClone(firstItem(payload))];
                    excluded.items[0].sectionId = excluded.id;
                }],
            ["unknown expectation", (payload) => { firstItem(payload).sourceExpectationIds = ["unknown-expectation"]; }],
            ["unknown assessment", (payload) => { firstItem(payload).sourceAssessmentIds = ["unknown-assessment"]; }],
            ["unknown match", (payload) => { firstItem(payload).approvedMatchIds = ["unknown-match"]; }],
            ["unknown evidence", (payload) => { firstItem(payload).evidenceIds = ["unknown-evidence"]; }],
            ["unknown claim boundary", (payload) => { firstItem(payload).claimBoundaryIds = ["unknown-boundary"]; }],
            ["missing evidence provenance", (payload) => { firstItem(payload).evidenceIds = []; }],
            ["missing boundary provenance", (payload) => { firstItem(payload).claimBoundaryIds = []; }],
            ["unsupported claim type", (payload) => { firstItem(payload).claimTypes = ["business-outcome"]; }],
            ["invented metric", (payload) => { firstItem(payload).text += " Improved 73%."; }],
            ["invented team size", (payload) => { firstItem(payload).text = "Managed 42 engineers."; }],
            ["invented revenue", (payload) => { firstItem(payload).text = "Managed revenue of $500000."; }],
            ["invented customers", (payload) => { firstItem(payload).text = "Supported 900 customers."; }],
            ["invented users", (payload) => { firstItem(payload).text = "Supported 900 users."; }],
            ["unsupported seniority", (payload) => { firstItem(payload).text = "Global CTO and platform leader."; }],
            ["current-employment assertion", (payload) => { firstItem(payload).text = "Currently serves as Engineering Manager."; }],
            ["target title as history", (payload) => {
                    const item = experienceItem(payload);
                    item.itemType = "experience-role";
                    item.text = "Engineering Manager";
                }],
            ["project as employment", (payload) => {
                    const project = projectItem(payload);
                    const experience = experienceItem(payload);
                    experience.itemType = "experience-role";
                    experience.text = "Worked on a project as formal employment";
                    experience.sourceExpectationIds = project.sourceExpectationIds;
                    experience.sourceAssessmentIds = project.sourceAssessmentIds;
                    experience.approvedMatchIds = project.approvedMatchIds;
                    experience.evidenceIds = project.evidenceIds;
                    experience.claimBoundaryIds = project.claimBoundaryIds;
                    experience.claimTypes = ["scope"];
                }],
            ["responsibility as achievement", (payload) => {
                    const item = experienceItem(payload);
                    item.claimTypes = ["achievement"];
                    item.text = "Achieved organization-wide transformation.";
                }],
            ["ATS score", (payload) => { firstItem(payload).text = "ATS score: strong."; }],
            ["ATS optimization", (payload) => { firstItem(payload).text = "ATS optimization for the target role."; }],
            ["hiring probability", (payload) => { firstItem(payload).text = "Hiring probability is high."; }],
            ["application advice", (payload) => { firstItem(payload).text = "Recommended application path."; }],
            ["cover letter", (payload) => { firstItem(payload).text = "Cover letter language."; }],
            ["screening answer", (payload) => { firstItem(payload).text = "Screening answer content."; }],
            ["unsupported authority owned", (payload) => { experienceItem(payload).text = "Owned platform delivery."; }],
            ["unsupported authority managed", (payload) => { experienceItem(payload).text = "Managed platform delivery."; }],
            ["unsupported authority directed", (payload) => { experienceItem(payload).text = "Directed platform delivery."; }],
            ["unsupported authority established", (payload) => { experienceItem(payload).text = "Established platform delivery."; }],
            ["unsupported authority led", (payload) => { experienceItem(payload).text = "Led platform delivery."; }],
            ["production from experiment", (payload) => { projectItem(payload).text = "Production-grade TypeScript platform."; }],
            ["unknown technology", (payload) => { technologyItem(payload).text = "Kubernetes"; }],
            ["aggregate duration", (payload) => { firstItem(payload).text = "20 years of experience."; }],
            ["summary sentence limit", (payload) => {
                    summaryItem(payload).text = "One. Two. Three. Four. Five.";
                }],
            ["duplicate claim", (payload) => {
                    const section = payload.sections.find((entry) => entry.type === "core-capabilities");
                    section.items.push(structuredClone(section.items[0]));
                }],
            ["proven track record", (payload) => { summaryItem(payload).text = "Proven track record in platform delivery."; }],
            ["proven expert", (payload) => { summaryItem(payload).text = "Proven expert in platform delivery."; }],
            ["enterprise-wide authority", (payload) => { summaryItem(payload).text = "Enterprise-wide ownership of delivery."; }],
            ["invented employee scale", (payload) => { firstItem(payload).text = "Supported 100 employees."; }],
            ["invented engineer scale", (payload) => { firstItem(payload).text = "Coordinated 100 engineers."; }],
            ["invented report scale", (payload) => { firstItem(payload).text = "Supported 100 reports."; }],
            ["invented budget", (payload) => { firstItem(payload).text = "Managed budget of $500000."; }],
            ["global ownership", (payload) => { firstItem(payload).text = "Global ownership of platform delivery."; }],
            ["global authority", (payload) => { firstItem(payload).text = "Global authority for platform delivery."; }],
            ["global leadership", (payload) => { firstItem(payload).text = "Global leadership of platform delivery."; }],
            ["global scope", (payload) => { firstItem(payload).text = "Global scope for platform delivery."; }],
            ["company-wide ownership", (payload) => { firstItem(payload).text = "Company-wide ownership of platform delivery."; }],
            ["organization-wide authority", (payload) => { firstItem(payload).text = "Organization-wide authority for platform delivery."; }],
            ["unsupported direct reports", (payload) => { experienceItem(payload).text = "Held responsibility for direct reports."; }],
            ["unsupported hiring authority", (payload) => { experienceItem(payload).text = "Held hiring authority for the team."; }],
            ["unsupported budget control", (payload) => { experienceItem(payload).text = "Held budget control for delivery."; }],
            ["unsupported performance reviews", (payload) => { experienceItem(payload).text = "Conducted performance reviews."; }],
            ["unsupported executive reporting", (payload) => { experienceItem(payload).text = "Owned executive reporting."; }],
            ["unsupported expertise level", (payload) => { technologyItem(payload).text = "Expertise in TypeScript"; }],
            ["unsupported commercial adoption", (payload) => { projectItem(payload).text = "Achieved commercial adoption."; }],
            ["unsupported customer adoption", (payload) => { projectItem(payload).text = "Adopted by customers."; }],
            ["invented date", (payload) => { experienceItem(payload).text = "Delivered platform work in 2024."; }],
            ["unsupported active certification", (payload) => {
                    const item = payload.sections.find((entry) => entry.type === "certifications").items[0];
                    item.text = "Current active product certification";
                }],
        ])("rejects %s", async (_label, mutate) => {
            const payload = await validDraftPayload(shared.workspace, shared.targetId);
            mutate(payload);
            const result = await generateRoleResumeDraftProposal(shared.workspace, shared.targetId, {
                provider: new FakeInterpretationModelProvider(JSON.stringify(payload)),
                refresh: true,
            });
            expect(result.result).toBe("validation-failed");
            expect(result.validationIssueCount).toBeGreaterThan(0);
        });
        it.each([
            "visionary leader",
            "world-class",
            "best-in-class",
            "exceptional",
            "renowned",
            "highly accomplished",
            "results-driven",
            "dynamic professional",
            "thought leader",
            "industry-leading",
            "transformational leader",
        ])("rejects unsupported inflated phrase: %s", async (phrase) => {
            const payload = await validDraftPayload(shared.workspace, shared.targetId);
            summaryItem(payload).text = `${phrase} in platform delivery.`;
            const result = await generateRoleResumeDraftProposal(shared.workspace, shared.targetId, {
                provider: new FakeInterpretationModelProvider(JSON.stringify(payload)),
                refresh: true,
            });
            expect(result.result).toBe("validation-failed");
        });
        it.each([
            ["malformed JSON", "{"],
            ["empty JSON object", "{}"],
            ["free-form JSON", JSON.stringify({ text: "A free-form resume paragraph." })],
            ["array response", "[]"],
        ])("handles %s without accepting unstructured output", async (_label, raw) => {
            const result = await generateRoleResumeDraftProposal(shared.workspace, shared.targetId, {
                provider: new FakeInterpretationModelProvider(raw),
                refresh: true,
            });
            expect(result.result).toBe("validation-failed");
        });
    });
    it("accepts an exact reviewed metric and rejects altered, rounded, or unreferenced metrics", async () => {
        const fixture = await scaffoldFixture({ verifiedMetric: true });
        const payload = await validDraftPayload(fixture.workspace, fixture.targetId);
        const item = payload.sections.find((entry) => entry.type === "selected-impact").items[0];
        const evidenceId = item.evidenceIds[0];
        item.text = "Delivered 3 reviewed platform workflows.";
        item.claimTypes = ["quantified-outcome"];
        item.metricReferences = [{
                evidenceId,
                originalValue: "3",
                normalizedValue: "3",
                unit: "workflows",
                attributionScope: "reviewed platform delivery evidence",
                reviewStatus: "reviewed",
            }];
        expect((await generateRoleResumeDraftProposal(fixture.workspace, fixture.targetId, {
            provider: new FakeInterpretationModelProvider(JSON.stringify(payload)),
        })).result).toBe("created");
        for (const text of ["Delivered 4 reviewed platform workflows.", "Delivered 3.0 reviewed platform workflows."]) {
            const changed = structuredClone(payload);
            experienceItem(changed).text = text;
            expect((await generateRoleResumeDraftProposal(fixture.workspace, fixture.targetId, {
                provider: new FakeInterpretationModelProvider(JSON.stringify(changed)),
                refresh: true,
            })).result).toBe("validation-failed");
        }
    });
    it("initializes immutable human review, validates edits, and requires every decision", async () => {
        const fixture = await proposalFixture();
        const proposalPath = path.join(fixture.workspace, fixture.generated.proposalPath);
        const proposalHash = await hashFile(proposalPath);
        const review = await initializeRoleResumeDraftReview(fixture.workspace, fixture.generated.proposalId, {
            reviewerName: "Reviewer",
            now: () => new Date(FIRST_TIME),
        });
        expect(review.decisions.some((entry) => entry.itemType === "section-order")).toBe(true);
        expect(review.decisions.filter((entry) => entry.itemType === "draft-item")).toHaveLength(fixture.proposal.sections.flatMap((entry) => entry.items).length);
        await expect(completeRoleResumeDraftReview(fixture.workspace, fixture.generated.proposalId)).rejects.toThrow(/remain pending/);
        const summary = fixture.proposal.sections.find((entry) => entry.type === "professional-summary").items[0];
        await setRoleResumeDraftReviewDecision(fixture.workspace, fixture.generated.proposalId, "draft-item", summary.id, {
            decision: "edit",
            editedValue: { ...summary, text: "Platform delivery experience supported by reviewed role evidence." },
        });
        await expect(setRoleResumeDraftReviewDecision(fixture.workspace, fixture.generated.proposalId, "draft-item", summary.id, {
            decision: "reject",
        })).rejects.toThrow(/already exists/);
        const invalid = fixture.proposal.sections.find((entry) => entry.type === "professional-experience").items[0];
        await expect(setRoleResumeDraftReviewDecision(fixture.workspace, fixture.generated.proposalId, "draft-item", invalid.id, {
            decision: "edit",
            editedValue: { ...invalid, text: "Managed 99 engineers." },
        })).rejects.toThrow(/failed validation/);
        await resolveReview(fixture.workspace, fixture.generated.proposalId, review, new Set([`draft-item:${summary.id}`]));
        expect((await completeRoleResumeDraftReview(fixture.workspace, fixture.generated.proposalId, {
            now: () => new Date(SECOND_TIME),
        })).status).toBe("completed");
        expect(await hashFile(proposalPath)).toBe(proposalHash);
        await expect(setRoleResumeDraftReviewDecision(fixture.workspace, fixture.generated.proposalId, "section-order", `section-order_${fixture.proposal.id}`, {
            decision: "accept",
        })).rejects.toThrow(/immutable/);
    });
    it("approves only accepted or human-edited wording without a model call and preserves statement provenance", async () => {
        const fixture = await completedReviewFixture({ editSummary: true });
        const providerCalls = fixture.provider.callCount;
        const first = await approveRoleResumeDraftProposal(fixture.workspace, fixture.generated.proposalId, {
            now: () => new Date(FIRST_TIME),
        });
        const approved = await showApprovedRoleResumeDraft(fixture.workspace, fixture.targetId);
        const second = await approveRoleResumeDraftProposal(fixture.workspace, fixture.generated.proposalId, {
            now: () => new Date(SECOND_TIME),
        });
        expect(first.result).toBe("created");
        expect(second.result).toBe("already-current");
        expect(fixture.provider.callCount).toBe(providerCalls);
        expect(approved.completeness).toMatchObject({ status: "complete", usableForRendering: true });
        expect(approved.sections.flatMap((entry) => entry.items).every((entry) => ["human-approved", "human-edited"].includes(entry.trustState)
            && entry.evidenceIds.length > 0
            && entry.claimBoundaryIds.length > 0
            && entry.provenance.reviewDecision
            && entry.provenance.model)).toBe(true);
        expect(approved.claimLedger).toHaveLength(approved.sections.flatMap((entry) => entry.items).length);
        expect(stableJson(approved)).not.toMatch(/"trustState":"(?:model-proposed|deterministic-proposed)"/);
        expect((await getApprovedRoleResumeDraftStatus(fixture.workspace, fixture.targetId))).toMatchObject({
            status: "current",
            usableForRendering: true,
            draftHashMatches: true,
            proposalHashMatches: true,
            reviewHashMatches: true,
        });
        expect((await showApprovedRoleResumeDraft(fixture.workspace, fixture.targetId)).createdAt).toBe(FIRST_TIME);
    });
    it("omits rejected optional wording and refuses approval for incomplete or stale review dependencies", async () => {
        const pending = await proposalFixture();
        await initializeRoleResumeDraftReview(pending.workspace, pending.generated.proposalId);
        await expect(approveRoleResumeDraftProposal(pending.workspace, pending.generated.proposalId)).rejects.toThrow(/completed/);
        const rejected = await completedReviewFixture({ rejectOptional: true });
        const approvedResult = await approveRoleResumeDraftProposal(rejected.workspace, rejected.generated.proposalId);
        expect(approvedResult.rejectedItemCount).toBeGreaterThan(0);
        const stale = await completedReviewFixture();
        const planPaths = roleResumePlanPaths(stale.workspace, stale.targetId, "approved");
        const plan = JSON.parse(await readFile(planPaths.planPath, "utf8"));
        plan.updatedAt = SECOND_TIME;
        await writeJsonAtomic(planPaths.planPath, plan);
        await expect(approveRoleResumeDraftProposal(stale.workspace, stale.generated.proposalId)).rejects.toThrow(/stale|invalid|unreviewable/);
    });
    it("reports missing, current, stale, and invalid lifecycle states", async () => {
        const fixture = await scaffoldFixture();
        expect((await getApprovedRoleResumeDraftStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
        const completed = await completedReviewFixture();
        await approveRoleResumeDraftProposal(completed.workspace, completed.generated.proposalId);
        expect((await getApprovedRoleResumeDraftStatus(completed.workspace, completed.targetId)).status).toBe("current");
        const paths = roleResumeDraftScaffoldPaths(fixture.workspace, fixture.targetId);
        const manifest = JSON.parse(await readFile(paths.manifestPath, "utf8"));
        manifest.scaffoldSha256 = hashText("tampered");
        await writeJsonAtomic(paths.manifestPath, manifest);
        expect((await getRoleResumeDraftScaffoldStatus(fixture.workspace, fixture.targetId)).status).toBe("invalid");
    });
    it("keeps all approved upstream artifacts byte-identical and creates no rendered resume or export", async () => {
        const fixture = await draftingFixture();
        const upstream = await upstreamHashes(fixture.workspace, fixture.targetId);
        const completed = await completedReviewFixture({ existing: fixture });
        await approveRoleResumeDraftProposal(completed.workspace, completed.generated.proposalId);
        expect(await upstreamHashes(fixture.workspace, fixture.targetId)).toEqual(upstream);
        const files = await allFiles(fixture.workspace);
        expect(files.some((entry) => /resume\.(?:md|docx|pdf|html)$/i.test(entry))).toBe(false);
        expect(files.some((entry) => /outputs[\\/](?:exports|variants)/.test(entry))).toBe(false);
    });
});
describe("Slice 2.6C deterministic role resume rendering and export", () => {
    it("composes a canonical document from only the current approved Role Resume Draft", async () => {
        const fixture = await renderingFixture();
        const upstream = await upstreamHashes(fixture.workspace, fixture.targetId);
        const result = await composeRoleResumeRenderDocument(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const document = await showRoleResumeRenderDocument(fixture.workspace, fixture.targetId);
        const approved = await showApprovedRoleResumeDraft(fixture.workspace, fixture.targetId);
        expect(result.result).toBe("created");
        expect(document.renderingPolicy).toEqual({
            name: ROLE_RESUME_RENDERING_POLICY_NAME,
            version: ROLE_RESUME_RENDERING_POLICY_VERSION,
        });
        expect(document.sections.flatMap((section) => section.blocks).map((block) => block.text)).toEqual(approved.sections
            .filter((section) => section.status !== "excluded" && section.items.length)
            .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
            .flatMap((section) => section.items.map((item) => item.text)));
        expect(document.sourceMap).toHaveLength(document.sections.flatMap((section) => section.blocks).length);
        expect(document.validation).toMatchObject({
            status: "valid",
            exactTextPreserved: true,
            sectionOrderPreserved: true,
            itemOrderPreserved: true,
            sourceMapComplete: true,
            privateMetadataAbsent: true,
        });
        expect(document.metadata.candidateName).toBeUndefined();
        expect(document.validation.warnings.map((warning) => warning.code)).toEqual(expect.arrayContaining([
            "NO_CANDIDATE_NAME_AVAILABLE",
            "NO_CONTACT_INFORMATION_AVAILABLE",
            "ACCESSIBILITY_NOT_FORMALLY_CERTIFIED",
            "EXPORT_NOT_JOB_SPECIFIC",
        ]));
        expect(await upstreamHashes(fixture.workspace, fixture.targetId)).toEqual(upstream);
    });
    it("preserves canonical IDs, hashes, timestamps, and mtimes on unchanged reruns", async () => {
        const fixture = await renderingFixture();
        const first = await composeRoleResumeRenderDocument(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const paths = roleResumeRenderDocumentPaths(fixture.workspace, fixture.targetId);
        const documentHash = await hashFile(paths.documentPath);
        const manifestHash = await hashFile(paths.manifestPath);
        const mtime = (await stat(paths.documentPath)).mtimeMs;
        const second = await composeRoleResumeRenderDocument(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        expect(second).toMatchObject({ result: "already-current", canonicalDocumentId: first.canonicalDocumentId });
        expect(await hashFile(paths.documentPath)).toBe(documentHash);
        expect(await hashFile(paths.manifestPath)).toBe(manifestHash);
        expect((await stat(paths.documentPath)).mtimeMs).toBe(mtime);
        expect((await getRoleResumeRenderDocumentStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
    });
    it("treats profile, page, and date changes as stale and requires explicit rebuild", async () => {
        const fixture = await renderingFixture();
        await composeRoleResumeRenderDocument(fixture.workspace, fixture.targetId, {
            profile: "ats-standard",
            pageSize: "A4",
            dateFormat: "MMM-YYYY",
        });
        const requested = { profile: "compact-professional", pageSize: "LETTER", dateFormat: "YYYY" };
        expect((await getRoleResumeRenderDocumentStatus(fixture.workspace, fixture.targetId, requested)).status).toBe("stale");
        await expect(composeRoleResumeRenderDocument(fixture.workspace, fixture.targetId, requested)).rejects.toThrow(/--rebuild/);
        const rebuilt = await composeRoleResumeRenderDocument(fixture.workspace, fixture.targetId, { ...requested, rebuild: true });
        const document = await showRoleResumeRenderDocument(fixture.workspace, fixture.targetId);
        expect(rebuilt.result).toBe("rebuilt");
        expect(document.profile).toMatchObject({ name: "compact-professional", page: { size: "LETTER" } });
        expect(document.dateFormat).toBe("YYYY");
    });
    it("rejects Job Targets and never consumes Job Description content", async () => {
        const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-render-job-"));
        const source = path.join(workspace, "job.md");
        await writeFile(source, "---\ntitle: Engineering Manager\n---\n\n## Requirements\n- Lead production delivery.\n", "utf8");
        const job = await createJobTarget(workspace, { file: source });
        await expect(composeRoleResumeRenderDocument(workspace, job.target.id)).rejects.toThrow(/Role Targets only/);
        expect((await allFiles(workspace)).some((file) => file.includes("resume-rendering"))).toBe(false);
    });
    it("renders Markdown and self-contained HTML with exact normalized visible text", async () => {
        const fixture = await renderingFixture();
        await composeRoleResumeRenderDocument(fixture.workspace, fixture.targetId);
        const document = await showRoleResumeRenderDocument(fixture.workspace, fixture.targetId);
        const markdown = await exportRoleResume(fixture.workspace, fixture.targetId, { format: "markdown" });
        const html = await exportRoleResume(fixture.workspace, fixture.targetId, { format: "html" });
        const markdownText = await readFile(path.join(fixture.workspace, markdown.outputPath), "utf8");
        const htmlText = await readFile(path.join(fixture.workspace, html.outputPath), "utf8");
        expect(extractVisibleTextFromMarkdown(markdownText)).toBe(canonicalVisibleText(document));
        expect(extractVisibleTextFromHtml(htmlText)).toBe(canonicalVisibleText(document));
        expect(htmlText).toContain("<!doctype html>");
        expect(htmlText).toContain("@page { size: A4;");
        expect(htmlText).not.toMatch(/<script\b|https?:\/\/[^"' )]+\.(?:css|js)/i);
        expect(markdown.outputPath).toMatch(/role-resume-engineering-manager-ats-standard-markdown\.md$/);
        expect(html.outputPath).toMatch(/role-resume-engineering-manager-ats-standard-html\.html$/);
    });
    it("exports all four formats from one canonical document with complete source maps", async () => {
        const fixture = await renderingFixture();
        await composeRoleResumeRenderDocument(fixture.workspace, fixture.targetId);
        const document = await showRoleResumeRenderDocument(fixture.workspace, fixture.targetId);
        const toolchain = fakeRoleResumeToolchain(canonicalVisibleText(document));
        const result = await exportAllRoleResume(fixture.workspace, fixture.targetId, { toolchain });
        const exports = await listRoleResumeExports(fixture.workspace, fixture.targetId);
        expect(result.failed).toEqual([]);
        expect(result.succeeded.map((entry) => entry.format).sort()).toEqual(["docx", "html", "markdown", "pdf"]);
        expect(new Set(result.succeeded.map((entry) => entry.exportId)).size).toBe(4);
        expect(new Set(exports.map((entry) => entry.canonicalDocumentId))).toEqual(new Set([document.id]));
        expect(exports.every((entry) => entry.validation.status === "valid"
            && entry.validation.visibleTextEquivalent
            && entry.sourceMapSha256.match(/^[a-f0-9]{64}$/))).toBe(true);
        expect(exports.find((entry) => entry.format === "pdf")?.validation).toMatchObject({
            pageCount: 1,
            pageSizeVerified: true,
            textExtractable: true,
        });
    });
    it("reuses current exports without rewrites and repairs tampering only with --rebuild", async () => {
        const fixture = await renderingFixture();
        const first = await exportRoleResume(fixture.workspace, fixture.targetId, {
            format: "markdown",
            now: () => new Date(FIRST_TIME),
        });
        const output = path.join(fixture.workspace, first.outputPath);
        const manifest = path.join(fixture.workspace, first.manifestPath);
        const mtime = (await stat(output)).mtimeMs;
        const second = await exportRoleResume(fixture.workspace, fixture.targetId, {
            format: "markdown",
            now: () => new Date(SECOND_TIME),
        });
        expect(second.result).toBe("already-current");
        expect((await stat(output)).mtimeMs).toBe(mtime);
        await writeFile(output, "tampered", "utf8");
        expect((await getRoleResumeExportStatus(fixture.workspace, first.exportId)).status).toBe("invalid");
        await expect(exportRoleResume(fixture.workspace, fixture.targetId, { format: "markdown" })).rejects.toThrow(/--rebuild/);
        const repaired = await exportRoleResume(fixture.workspace, fixture.targetId, { format: "markdown", rebuild: true });
        expect(repaired.result).toBe("rebuilt");
        expect((await getRoleResumeExportStatus(fixture.workspace, first.exportId)).status).toBe("current");
        expect(await hashFile(manifest)).toMatch(/^[a-f0-9]{64}$/);
    });
    it("reports missing, stale, and invalid render/export lifecycle states", async () => {
        const fixture = await renderingFixture();
        expect((await getRoleResumeRenderDocumentStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
        const exported = await exportRoleResume(fixture.workspace, fixture.targetId, { format: "html" });
        expect((await getRoleResumeExportStatus(fixture.workspace, exported.exportId)).status).toBe("current");
        const renderPaths = roleResumeRenderDocumentPaths(fixture.workspace, fixture.targetId);
        const document = JSON.parse(await readFile(renderPaths.documentPath, "utf8"));
        document.updatedAt = SECOND_TIME;
        await writeJsonAtomic(renderPaths.documentPath, document);
        expect((await getRoleResumeRenderDocumentStatus(fixture.workspace, fixture.targetId)).status).toBe("invalid");
        expect((await getRoleResumeExportStatus(fixture.workspace, exported.exportId)).status).toBe("stale");
        expect((await getRoleResumeExportStatus(fixture.workspace, "missing-export")).status).toBe("missing");
    });
    it("validates stored output fidelity and exposes complete deterministic manifests", async () => {
        const fixture = await renderingFixture();
        const exported = await exportRoleResume(fixture.workspace, fixture.targetId, { format: "markdown" });
        const validation = await validateStoredRoleResumeExport(fixture.workspace, exported.exportId, fakeRoleResumeToolchain("unused"));
        const manifest = await showRoleResumeExport(fixture.workspace, exported.exportId);
        expect(validation).toMatchObject({
            status: "valid",
            nonEmpty: true,
            formatValid: true,
            visibleTextEquivalent: true,
            sectionOrderPreserved: true,
            firstMarkerPresent: true,
            lastMarkerPresent: true,
            binaryDeterministic: true,
        });
        expect(manifest).toMatchObject({
            targetId: fixture.targetId,
            approvedDraftId: expect.any(String),
            canonicalDocumentId: expect.any(String),
            rendererName: "prooflayer-markdown",
            rendererVersion: "1",
            renderingPolicy: { name: ROLE_RESUME_RENDERING_POLICY_NAME, version: ROLE_RESUME_RENDERING_POLICY_VERSION },
        });
        expect(manifest.outputSha256).toBe(await hashFile(path.join(fixture.workspace, manifest.outputPath)));
        expect(manifest.sourceMapSha256).toBe(await hashFile(path.join(fixture.workspace, manifest.sourceMapPath)));
    });
    it("preserves every metric, date, title, qualifier, and project-scoped statement exactly", async () => {
        const fixture = await renderingFixture({ verifiedMetric: true });
        await composeRoleResumeRenderDocument(fixture.workspace, fixture.targetId);
        const approved = await showApprovedRoleResumeDraft(fixture.workspace, fixture.targetId);
        const document = await showRoleResumeRenderDocument(fixture.workspace, fixture.targetId);
        const approvedItems = approved.sections.flatMap((section) => section.items);
        const renderedBlocks = document.sections.flatMap((section) => section.blocks);
        expect(renderedBlocks.map((entry) => entry.text)).toEqual(approvedItems.map((entry) => entry.text));
        for (const item of approvedItems) {
            const block = renderedBlocks.find((entry) => entry.draftItemId === item.id);
            expect(block.text).toBe(item.text);
            expect(document.sourceMap.find((entry) => entry.draftItemId === item.id)).toMatchObject({
                evidenceIds: item.evidenceIds,
                claimBoundaryIds: item.claimBoundaryIds,
            });
        }
        expect(JSON.stringify(document)).not.toMatch(/ATS score|hiring probability|application recommendation/i);
    });
    it("keeps render profiles ATS-safe, single-column, readable, and deterministic", () => {
        const ats = resolveRoleResumeRenderProfile("ats-standard", "A4");
        const compact = resolveRoleResumeRenderProfile("compact-professional", "LETTER");
        for (const profile of [ats, compact]) {
            expect(profile.layout).toMatchObject({ columns: 1, useTablesForCoreContent: false });
            expect(profile.typography.minimumFontSizePt).toBeGreaterThanOrEqual(10);
            expect(profile.typography.baseFontSizePt).toBeGreaterThanOrEqual(profile.typography.minimumFontSizePt);
            expect(profile.accessibility).toMatchObject({
                logicalHeadingHierarchy: true,
                semanticLists: true,
                colorOnlyMeaning: false,
                iconsRequiredForMeaning: false,
                singleColumnReadingOrder: true,
                formalCertificationClaimed: false,
            });
        }
        expect(resolveRoleResumeRenderProfile("ats-standard", "A4")).toEqual(ats);
    });
    it("rejects unsupported profiles, pages, date formats, formats, and unsafe output directories", () => {
        expect(() => RoleResumeRenderProfileNameSchema.parse("decorative")).toThrow();
        expect(() => RoleResumePageSizeSchema.parse("LEGAL")).toThrow();
        expect(() => RoleResumeDateFormatSchema.parse("MM/DD")).toThrow();
        for (const unsafe of ["../outside", "/tmp/outside", ".", "safe/../outside", "safe//../outside"]) {
            expect(() => normalizeOutputDirectory(unsafe)).toThrow();
        }
        expect(normalizeOutputDirectory("./reviewed/exports/")).toBe("reviewed/exports");
    });
    it("does not persist absolute paths, private IDs, model content, or contact guesses into visible output", async () => {
        const fixture = await renderingFixture();
        const markdown = await exportRoleResume(fixture.workspace, fixture.targetId, { format: "markdown" });
        const html = await exportRoleResume(fixture.workspace, fixture.targetId, { format: "html" });
        const visible = [
            await readFile(path.join(fixture.workspace, markdown.outputPath), "utf8"),
            await readFile(path.join(fixture.workspace, html.outputPath), "utf8"),
        ].join("\n");
        expect(visible).not.toContain(fixture.workspace);
        expect(visible).not.toMatch(/\/Users\/|\/home\/|evidence_[a-z0-9]|claim_[a-z0-9]|sha256/i);
        expect(visible).not.toMatch(/@example\.com|\+\d[\d\s()-]{7,}/);
        expect(visible).not.toMatch(/model-proposed|rawResponse|promptTemplate/i);
    });
});
async function draftingFixture(options = {}) {
    const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-role-draft-"));
    const created = await createRoleTarget(workspace, { title: "Engineering Manager" }, { now: () => new Date(FIRST_TIME) });
    await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
    const profilePath = path.join(workspace, "role-profiles", "engineering-manager.json");
    const definitions = [
        ["platform-delivery", "Lead platform delivery across teams.", "leadership", "required", "critical"],
        ["stakeholder-alignment", "Coordinate stakeholders and delivery decisions.", "responsibility", "required", "high"],
        ["technical-tradeoffs", "Evaluate technical tradeoffs through project work.", "technical-skill", "required", "medium"],
        ["qualification", "Present a reviewed professional certification.", "qualification", "contextual", "low"],
    ];
    const profile = {
        schemaVersion: 1,
        id: "engineering-manager",
        title: "Engineering Manager",
        aliases: [],
        expectations: definitions.map(([id, statement, kind, necessity, importance]) => ({
            id,
            kind,
            statement,
            necessity,
            importance,
            capabilityTags: [id],
            group: "leadership-expectations",
            notes: [],
        })),
        createdAt: FIRST_TIME,
        updatedAt: FIRST_TIME,
    };
    await writeJsonAtomic(profilePath, profile);
    await interpretTarget(workspace, created.target.id, { roleProfile: profilePath, now: () => new Date(FIRST_TIME) });
    await approveTargetInterpretation(workspace, created.target.id);
    const interpretation = await showApprovedTargetInterpretation(workspace, created.target.id);
    await writeEvidenceKb(workspace, interpretation.expectations.length, options.verifiedMetric ?? false);
    await writeMatchingPattern(workspace, created.target.id);
    await buildFitAssessment(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
    await promoteDeterministicAssessment(workspace, created.target.id);
    await buildRoleResumePlan(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
    if (options.promotePlan !== false)
        await promoteDeterministicPlan(workspace, created.target.id);
    return { workspace, targetId: created.target.id };
}
async function scaffoldFixture(options = {}) {
    const fixture = await draftingFixture(options);
    await buildRoleResumeDraftScaffold(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    return fixture;
}
async function proposalFixture(existing) {
    const fixture = existing ?? await draftingFixture();
    await buildRoleResumeDraftScaffold(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    const provider = new CapturingFakeProvider(JSON.stringify(await validDraftPayload(fixture.workspace, fixture.targetId)));
    const generated = await generateRoleResumeDraftProposal(fixture.workspace, fixture.targetId, {
        provider,
        now: () => new Date(FIRST_TIME),
    });
    const proposal = await showRoleResumeDraftProposal(fixture.workspace, generated.proposalId);
    return { ...fixture, provider, generated, proposal };
}
async function completedReviewFixture(options = {}) {
    const fixture = await proposalFixture(options.existing);
    const review = await initializeRoleResumeDraftReview(fixture.workspace, fixture.generated.proposalId, {
        reviewerName: "Reviewer",
        now: () => new Date(FIRST_TIME),
    });
    const handled = new Set();
    if (options.editSummary) {
        const item = fixture.proposal.sections.find((entry) => entry.type === "professional-summary").items[0];
        await setRoleResumeDraftReviewDecision(fixture.workspace, fixture.generated.proposalId, "draft-item", item.id, {
            decision: "edit",
            editedValue: { ...item, text: "Platform delivery experience supported by reviewed role evidence." },
        });
        handled.add(`draft-item:${item.id}`);
    }
    if (options.rejectOptional) {
        const optional = fixture.proposal.sections.find((entry) => entry.type === "selected-projects")?.items[0];
        if (optional) {
            await setRoleResumeDraftReviewDecision(fixture.workspace, fixture.generated.proposalId, "draft-item", optional.id, {
                decision: "reject",
            });
            handled.add(`draft-item:${optional.id}`);
        }
    }
    await resolveReview(fixture.workspace, fixture.generated.proposalId, review, handled);
    await completeRoleResumeDraftReview(fixture.workspace, fixture.generated.proposalId, {
        now: () => new Date(SECOND_TIME),
    });
    return fixture;
}
async function renderingFixture(options = {}) {
    const fixture = await completedReviewFixture({
        existing: await draftingFixture({ verifiedMetric: options.verifiedMetric }),
    });
    await approveRoleResumeDraftProposal(fixture.workspace, fixture.generated.proposalId, {
        now: () => new Date(FIRST_TIME),
    });
    return fixture;
}
function fakeRoleResumeToolchain(extractedText) {
    return {
        async createDocx({ outputPath }) {
            await writeFile(outputPath, Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x50, 0x72, 0x6f, 0x6f, 0x66]));
        },
        async createPdf({ outputPath }) {
            await writeFile(outputPath, Buffer.from("%PDF-1.7\n% ProofLayer deterministic test fixture\n", "utf8"));
        },
        async extractDocxText() {
            return extractedText;
        },
        async extractPdf() {
            return { text: extractedText, pageCount: 1, pageSizeVerified: true };
        },
    };
}
async function resolveReview(workspace, proposalId, review, handled = new Set()) {
    for (const decision of review.decisions) {
        const key = `${decision.itemType}:${decision.itemId}`;
        if (handled.has(key))
            continue;
        await setRoleResumeDraftReviewDecision(workspace, proposalId, decision.itemType, decision.itemId, {
            decision: "accept",
        });
    }
}
async function validDraftPayload(workspace, targetId) {
    const scaffold = await showRoleResumeDraftScaffold(workspace, targetId);
    const context = await loadRoleResumeDraftingContext(workspace, targetId);
    const zero = "0".repeat(64);
    return {
        sections: scaffold.sections.map((guard) => {
            const plan = context.approvedPlan.sections.find((entry) => entry.id === guard.planSectionId);
            if (guard.status === "exclude" || !guard.allowedEvidenceIds.length || !guard.allowedClaimBoundaryIds.length) {
                return {
                    id: guard.id,
                    planSectionId: guard.planSectionId,
                    type: guard.sectionType,
                    order: guard.order,
                    status: guard.status === "exclude" ? "excluded" : "empty",
                    objective: guard.objective,
                    items: [],
                    provenance: {
                        targetId,
                        approvedPlanId: context.approvedPlan.id,
                        planSectionId: guard.planSectionId,
                        approvedPlanSha256: context.approvedPlanSha256,
                        draftingPolicy: { name: ROLE_RESUME_DRAFTING_POLICY_NAME, version: ROLE_RESUME_DRAFTING_POLICY_VERSION },
                    },
                };
            }
            const boundary = context.approvedPlan.claimBoundaries.find((entry) => guard.allowedClaimBoundaryIds.includes(entry.id)
                && entry.evidenceIds.some((id) => guard.allowedEvidenceIds.includes(id)));
            const expectationId = boundary.expectationId;
            const selection = context.approvedPlan.expectationSelections.find((entry) => entry.expectationId === expectationId);
            const evidenceId = boundary.evidenceIds.find((id) => guard.allowedEvidenceIds.includes(id));
            const claimType = guard.sectionType === "headline"
                ? "capability-theme"
                : guard.allowedClaimTypes.find((entry) => boundary.allowedClaimTypes.includes(entry));
            const itemType = ({
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
            })[guard.sectionType];
            const text = ({
                headline: `Engineering Manager | ${context.approvedPlan.positioning.primaryThemes[0].label}`,
                "professional-summary": "Platform delivery experience grounded in reviewed role evidence.",
                "core-capabilities": "Platform delivery",
                "selected-impact": "Supported platform delivery within reviewed scope.",
                "professional-experience": "Contributed to platform delivery within reviewed scope.",
                "selected-projects": "Project work using TypeScript within reviewed scope.",
                "technical-capabilities": "TypeScript",
                "leadership-capabilities": "Cross-functional coordination",
                education: "Reviewed education evidence.",
                certifications: "Reviewed professional certification.",
                "additional-information": "Reviewed additional information.",
            })[guard.sectionType];
            return {
                id: guard.id,
                planSectionId: guard.planSectionId,
                type: guard.sectionType,
                order: guard.order,
                status: "drafted",
                objective: plan.objective,
                items: [{
                        id: guard.placeholderIds[0],
                        sectionId: guard.id,
                        itemType,
                        text,
                        sourceExpectationIds: [expectationId],
                        sourceAssessmentIds: [selection.assessmentId],
                        approvedMatchIds: selection.approvedMatchIds.filter((id) => guard.allowedMatchIds.includes(id)),
                        evidenceIds: [evidenceId],
                        claimBoundaryIds: [boundary.id],
                        claimTypes: [claimType],
                        metricReferences: [],
                        scopeReferences: [],
                        qualifiers: guard.requiredQualifiers,
                        trustState: "model-proposed",
                        validation: { status: "valid", issues: [] },
                        provenance: {
                            targetId,
                            approvedPlanId: context.approvedPlan.id,
                            planSectionId: guard.planSectionId,
                            draftingPolicy: { name: ROLE_RESUME_DRAFTING_POLICY_NAME, version: ROLE_RESUME_DRAFTING_POLICY_VERSION },
                            artifactHashes: {
                                approvedInterpretationSha256: zero,
                                approvedMatchingSha256: zero,
                                approvedAssessmentSha256: zero,
                                approvedPlanSha256: zero,
                                scaffoldSha256: zero,
                            },
                        },
                    }],
                provenance: {
                    targetId,
                    approvedPlanId: context.approvedPlan.id,
                    planSectionId: guard.planSectionId,
                    approvedPlanSha256: context.approvedPlanSha256,
                    draftingPolicy: { name: ROLE_RESUME_DRAFTING_POLICY_NAME, version: ROLE_RESUME_DRAFTING_POLICY_VERSION },
                },
            };
        }),
        warnings: [],
        ambiguities: [],
    };
}
function firstItem(payload) {
    return payload.sections.flatMap((entry) => entry.items)[0];
}
function summaryItem(payload) {
    return payload.sections.find((entry) => entry.type === "professional-summary").items[0];
}
function experienceItem(payload) {
    return payload.sections.find((entry) => entry.type === "professional-experience").items[0];
}
function projectItem(payload) {
    return payload.sections.find((entry) => entry.type === "selected-projects").items[0];
}
function technologyItem(payload) {
    return payload.sections.find((entry) => entry.type === "technical-capabilities").items[0];
}
async function approveTargetInterpretation(workspace, targetId) {
    const payload = {
        proposedExpectations: [],
        proposedGroups: [],
        proposedAmbiguities: [],
        warnings: [],
    };
    const generated = await generateInterpretationProposal(workspace, targetId, {
        provider: new FakeInterpretationModelProvider(JSON.stringify(payload)),
        now: () => new Date(FIRST_TIME),
    });
    await initializeProposalReview(workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
    const proposal = await showInterpretationProposal(workspace, generated.proposalId);
    for (const expectation of proposal.proposedExpectations) {
        await setProposalReviewDecision(workspace, generated.proposalId, expectation.id, { decision: "accept" });
    }
    await completeProposalReview(workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
    await approveInterpretationProposal(workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
}
async function writeEvidenceKb(workspace, count, verifiedMetric) {
    const sources = [];
    const evidence = [];
    const claims = [];
    for (let index = 0; index < count; index += 1) {
        const sourceId = `src_draft_${index}`;
        const evidenceId = `evi_draft_${index}`;
        const text = index === 0 && verifiedMetric
            ? "Delivered 3 reviewed platform workflows."
            : `Reviewed role evidence for expectation ${index}.`;
        sources.push({
            id: sourceId,
            type: "markdown",
            path: `sources/markdown/evidence-${index}.md`,
            title: `Reviewed evidence ${index}`,
            importedAt: FIRST_TIME,
            hash: hashText(`source-${index}`),
            visibility: "public",
            status: "active",
        });
        evidence.push({
            id: evidenceId,
            sourceIds: [sourceId],
            category: index === 0 ? "role" : index === 1 ? "responsibility" : index === 2 ? "project" : "certification",
            text,
            normalizedSummary: text,
            sourceSection: index === 2 ? "Selected Projects" : index === 3 ? "Education & Certifications" : "Professional Experience",
            technologies: index === 2 ? ["TypeScript"] : [],
            domains: ["platform"],
            parentRoleId: index < 2 ? "role_platform" : undefined,
            parentProjectId: index === 2 ? "project_platform" : undefined,
            visibility: "public",
            sensitivityFlags: [],
            confidence: "high",
        });
        claims.push({
            id: `claim_draft_${index}`,
            claim: text,
            approvedWording: text,
            type: index === 2 ? "project_claim" : index === 3 ? "certification_claim" : "responsibility_claim",
            supportingEvidenceIds: [evidenceId],
            sourceSection: evidence[index].sourceSection,
            extractionConfidence: "high",
            factualConfidence: "high",
            corroborationLevel: "manual_approved",
            approvalStatus: "approved",
            outputReadiness: "resume_ready",
            confidence: "high",
            publicSafe: true,
            needsConfirmation: false,
            metricStatus: index === 0 && verifiedMetric ? "verified_metric" : "no_metric",
            unsafeWording: [],
        });
    }
    await writeJsonAtomic(path.join(workspace, "kb/sources.json"), sources);
    await writeJsonAtomic(path.join(workspace, "kb/evidence-items.json"), evidence);
    await writeJsonAtomic(path.join(workspace, "kb/claims.json"), claims);
}
async function writeMatchingPattern(workspace, targetId) {
    const context = await loadMatchingContext(workspace, targetId, { persistSnapshot: true, now: () => new Date(FIRST_TIME) });
    const matches = context.eligibleExpectations.map((expectation, index) => {
        const evidence = context.snapshot.entries[index];
        return matchFixture(context, expectation.id, evidence.evidenceId, index === 0 || index === 2 ? "strong" : "adequate", "direct", "full", index === 0 || index === 2 ? "strong" : "medium", "current", index === 0 || index === 2 ? "high" : "medium");
    });
    await writeApprovedMatching(workspace, context, matches, new Map(), {}, { now: () => new Date(FIRST_TIME) });
}
function matchFixture(context, expectationId, evidenceId, suffix, matchType, coverage, evidenceStrength, temporalRelevance, matchConfidence) {
    const expectation = context.eligibleExpectations.find((entry) => entry.id === expectationId);
    const evidence = context.snapshot.entries.find((entry) => entry.evidenceId === evidenceId);
    return {
        id: `${manualMatchId(context.target.id, expectationId, [evidenceId], matchType)}-${suffix}`,
        expectationId,
        evidenceIds: [evidenceId],
        matchType,
        coverage,
        evidenceStrength,
        temporalRelevance,
        rationale: "Reviewed evidence supports this expectation within the listed limits.",
        expectationProvenance: expectationProvenance(context, expectation),
        evidenceProvenance: [evidence.provenance],
        trustState: "manual-approved",
        interpretation: { method: "manual", matcherName: "target-evidence-matcher", matcherVersion: "1", policyVersion: "1" },
        matchConfidence,
        limitations: coverage === "full" ? [] : ["Only part of the expectation is covered."],
        notes: [],
    };
}
async function promoteDeterministicAssessment(workspace, targetId) {
    const context = await loadAssessmentContext(workspace, targetId);
    const target = await showTarget(workspace, targetId);
    const assessment = await showFitAssessment(workspace, targetId);
    const paths = assessmentPaths(workspace, target, "approved");
    await writeJsonAtomic(paths.assessmentPath, assessment);
    await writeJsonAtomic(paths.manifestPath, createAssessmentManifest(assessment, context, paths.assessmentRelativePath, await hashFile(paths.assessmentPath), "approved", assessment.createdAt, assessment.updatedAt));
}
async function promoteDeterministicPlan(workspace, targetId) {
    const context = await loadRoleResumePlanningContext(workspace, targetId);
    const plan = await showRoleResumePlan(workspace, targetId);
    const paths = roleResumePlanPaths(workspace, targetId, "approved");
    await writeJsonAtomic(paths.planPath, plan);
    await writeJsonAtomic(paths.manifestPath, createRoleResumePlanManifest(plan, context, paths.planRelativePath, await hashFile(paths.planPath), "approved", plan.createdAt, plan.updatedAt));
}
async function upstreamHashes(workspace, targetId) {
    const context = await loadRoleResumeDraftingContext(workspace, targetId);
    const files = [
        `targets/roles/${targetId}/target.json`,
        context.approvedInterpretationPath,
        context.approvedInterpretationManifestPath,
        context.approvedMatchingPath,
        context.approvedMatchingManifestPath,
        context.approvedAssessmentPath,
        context.approvedAssessmentManifestPath,
        context.approvedPlanPath,
        context.approvedPlanManifestPath,
        "kb/sources.json",
        "kb/evidence-items.json",
        "kb/claims.json",
    ];
    return Object.fromEntries(await Promise.all(files.map(async (file) => [file, await hashFile(path.join(workspace, file))])));
}
async function allFiles(root) {
    const { readdir } = await import("node:fs/promises");
    const result = [];
    async function walk(directory) {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory())
                await walk(absolute);
            else if (entry.isFile())
                result.push(absolute);
        }
    }
    await walk(root);
    return result.sort();
}
class CapturingFakeProvider {
    delegate;
    providerId;
    identity;
    settings;
    lastPrompt = "";
    constructor(rawText) {
        this.delegate = new FakeInterpretationModelProvider(rawText);
        this.providerId = this.delegate.providerId;
        this.identity = this.delegate.identity;
        this.settings = this.delegate.settings;
    }
    get callCount() {
        return this.delegate.callCount;
    }
    async generate(request) {
        this.lastPrompt = request.renderedPrompt;
        return this.delegate.generate();
    }
}
