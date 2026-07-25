import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { approveFitAssessmentProposal } from "../approved-fit-assessment.js";
import { approveInterpretationProposal, showApprovedTargetInterpretation } from "../approved-interpretation.js";
import { FIT_ASSESSMENT_POLICY_NAME, FIT_ASSESSMENT_POLICY_VERSION, buildFitAssessment, deriveMateriality, deriveSupportStatus, getFitAssessmentStatus, loadAssessmentContext, showFitAssessment, } from "../fit-assessment.js";
import { ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_ID, fitAssessmentProposalFileTimestamps, generateFitAssessmentProposal, getFitAssessmentProposalStatus, renderFitAssessmentPrompt, replayFitAssessmentProposal, showFitAssessmentProposal, } from "../fit-assessment-proposal.js";
import { completeFitAssessmentReview, getFitAssessmentReviewStatus, initializeFitAssessmentReview, setFitAssessmentReviewDecision, setFitAssessmentSummaryReviewDecision, } from "../fit-assessment-review.js";
import { expectationProvenance, getApprovedEvidenceMatchingStatus, loadMatchingContext, manualMatchId, showApprovedEvidenceMatching, writeApprovedMatching, } from "../evidence-matching.js";
import { hashFile, hashText, writeJsonAtomic } from "../fs-utils.js";
import { FakeInterpretationModelProvider } from "../model-provider.js";
import { analyzeTarget } from "../target-analysis.js";
import { interpretTarget, showTargetInterpretation } from "../target-interpretation.js";
import { generateInterpretationProposal, showInterpretationProposal, } from "../target-proposal.js";
import { completeProposalReview, initializeProposalReview, setProposalReviewDecision, } from "../target-proposal-review.js";
import { createJobTarget, createRoleTarget } from "../targets.js";
const FIRST_TIME = "2026-07-23T10:00:00.000Z";
const SECOND_TIME = "2026-07-23T11:00:00.000Z";
describe("Slice 2.5 fit and proof assessment", () => {
    it("derives conservative support, proof, sufficiency, defensibility, risk, gap, confidence, and materiality records", async () => {
        const fixture = await roleAssessmentFixture({ includeNotAssessed: true });
        const result = await buildFitAssessment(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const assessment = await showFitAssessment(fixture.workspace, fixture.targetId);
        expect(result.result).toBe("created");
        expect(assessment.mode).toBe("role-positioning");
        expect(assessment.expectationAssessments.slice(0, 5).map((entry) => entry.supportStatus)).toEqual([
            "strongly-supported",
            "supported",
            "partially-supported",
            "unsupported",
            "conflicting",
        ]);
        expect(assessment.expectationAssessments[0]).toMatchObject({ proofQuality: "strong", evidenceSufficiency: "sufficient", defensibility: "high", freshnessRisk: "none", contradictionRisk: "none", materiality: "critical", assessmentConfidence: "high", gapType: "none" });
        expect(assessment.expectationAssessments[1]).toMatchObject({ proofQuality: "adequate", supportStatus: "supported" });
        expect(assessment.expectationAssessments[2]).toMatchObject({ proofQuality: "limited", evidenceSufficiency: "partially-sufficient", defensibility: "low", gapType: "coverage-gap" });
        expect(assessment.expectationAssessments[3]).toMatchObject({ proofQuality: "none", evidenceSufficiency: "insufficient", gapType: "evidence-gap" });
        expect(assessment.expectationAssessments[4]).toMatchObject({ proofQuality: "conflicting", contradictionRisk: "high", gapType: "contradiction" });
        expect(assessment.expectationAssessments.at(-1)).toMatchObject({ proofQuality: "unknown", evidenceSufficiency: "not-evaluated", defensibility: "uncertain", gapType: "not-assessed" });
        expect(assessment.warnings.some((entry) => entry.code === "UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE")).toBe(true);
        expect(assessment.ambiguities.some((entry) => entry.code === "EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR")).toBe(true);
        expect(assessment.risks.some((entry) => entry.code === "MATERIAL_CONTRADICTION")).toBe(true);
        expect(JSON.stringify(assessment)).not.toMatch(/fitScore|fitPercentage|hiringProbability|applyRecommendation/);
    });
    it("keeps incomplete role assessment unusable downstream and labels summary incomplete", async () => {
        const fixture = await roleAssessmentFixture({ includeNotAssessed: true });
        await buildFitAssessment(fixture.workspace, fixture.targetId);
        const assessment = await showFitAssessment(fixture.workspace, fixture.targetId);
        expect(assessment.completeness).toMatchObject({ status: "partial", usableForResumeConstruction: false, usableForApplicationConstruction: false });
        expect(assessment.summary).toMatchObject({ mode: "role-positioning", overallPositioning: "incomplete" });
    });
    it("makes a complete role assessment structurally usable only for future resume construction", async () => {
        const fixture = await roleAssessmentFixture();
        await buildFitAssessment(fixture.workspace, fixture.targetId);
        const assessment = await showFitAssessment(fixture.workspace, fixture.targetId);
        expect(assessment.completeness).toMatchObject({ status: "complete", usableForResumeConstruction: true, usableForApplicationConstruction: false });
        expect(assessment.summary.mode).toBe("role-positioning");
        expect(assessment.summary).not.toHaveProperty("opportunityAlignment");
    });
    it("makes a complete job assessment structurally usable only for future application construction", async () => {
        const fixture = await jobAssessmentFixture();
        await buildFitAssessment(fixture.workspace, fixture.targetId);
        const assessment = await showFitAssessment(fixture.workspace, fixture.targetId);
        expect(assessment.mode).toBe("job-specific");
        expect(assessment.completeness).toMatchObject({ status: "complete", usableForResumeConstruction: false, usableForApplicationConstruction: true });
        expect(assessment.summary.mode).toBe("job-specific");
        if (assessment.summary.mode === "job-specific") {
            expect(assessment.summary.requiredExpectationSummary.total).toBeGreaterThan(0);
            expect(assessment.summary.preferredExpectationSummary.total).toBeGreaterThan(0);
            expect(assessment.summary.unsupportedRequiredExpectationIds).toEqual(expect.any(Array));
        }
    });
    it("uses explicit ordered rules rather than match count or item order", async () => {
        const fixture = await roleAssessmentFixture();
        const context = await loadMatchingContext(fixture.workspace, fixture.targetId, { persistSnapshot: false });
        const expectation = context.eligibleExpectations[0];
        const evidence = context.snapshot.entries[0];
        const weakMatches = Array.from({ length: 3 }, (_, index) => matchFixture(context, expectation.id, evidence.evidenceId, `weak-${index}`, "supporting", "partial", "weak", "current", "low"));
        expect(deriveSupportStatus("partially-matched", weakMatches)).toBe("partially-supported");
        expect(deriveMateriality("required", "critical")).toBe("critical");
        expect(deriveMateriality("preferred", "critical")).toBe("medium");
        expect(deriveMateriality("contextual", "critical")).toBe("medium");
        expect(deriveMateriality("unknown", "critical")).toBe("unknown");
    });
    it("keeps stable IDs, hashes, and timestamps on an unchanged deterministic rerun", async () => {
        const fixture = await roleAssessmentFixture();
        const first = await buildFitAssessment(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
        const firstAssessment = await showFitAssessment(fixture.workspace, fixture.targetId);
        const firstStat = await stat(path.join(fixture.workspace, first.assessmentPath));
        const second = await buildFitAssessment(fixture.workspace, fixture.targetId, { now: () => new Date(SECOND_TIME) });
        const secondAssessment = await showFitAssessment(fixture.workspace, fixture.targetId);
        const secondStat = await stat(path.join(fixture.workspace, second.assessmentPath));
        expect(second.result).toBe("already-current");
        expect(secondAssessment.id).toBe(firstAssessment.id);
        expect(secondAssessment.expectationAssessments.map((entry) => entry.id)).toEqual(firstAssessment.expectationAssessments.map((entry) => entry.id));
        expect(secondAssessment.createdAt).toBe(firstAssessment.createdAt);
        expect(secondAssessment.updatedAt).toBe(firstAssessment.updatedAt);
        expect(secondStat.mtimeMs).toBe(firstStat.mtimeMs);
    });
    it("reports missing, current, stale, and invalid deterministic lifecycle states", async () => {
        const missing = await roleAssessmentFixture();
        expect((await getFitAssessmentStatus(missing.workspace, missing.targetId)).status).toBe("missing");
        await buildFitAssessment(missing.workspace, missing.targetId);
        expect((await getFitAssessmentStatus(missing.workspace, missing.targetId)).status).toBe("current");
        const claimsPath = path.join(missing.workspace, "kb/claims.json");
        const claims = JSON.parse(await readFile(claimsPath, "utf8"));
        claims[0].approvedWording = "Changed reviewed wording.";
        await writeJsonAtomic(claimsPath, claims);
        expect((await getFitAssessmentStatus(missing.workspace, missing.targetId)).status).toBe("stale");
        const invalid = await roleAssessmentFixture();
        const built = await buildFitAssessment(invalid.workspace, invalid.targetId);
        const manifestPath = path.join(invalid.workspace, built.manifestPath);
        const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
        manifest.assessmentSha256 = hashText("tampered");
        await writeJsonAtomic(manifestPath, manifest);
        expect((await getFitAssessmentStatus(invalid.workspace, invalid.targetId)).status).toBe("invalid");
    });
    it("creates valid model proposals for role and job targets with exact IDs and provenance", async () => {
        for (const fixture of [await roleAssessmentFixture(), await jobAssessmentFixture()]) {
            await buildFitAssessment(fixture.workspace, fixture.targetId);
            const payload = await validAssessmentPayload(fixture.workspace, fixture.targetId);
            const generated = await generateFitAssessmentProposal(fixture.workspace, fixture.targetId, { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)), now: () => new Date(FIRST_TIME) });
            const proposal = await showFitAssessmentProposal(fixture.workspace, generated.proposalId);
            expect(proposal.status).toBe("ready-for-review");
            expect(proposal.mode).toBe(fixture.targetType === "role" ? "role-positioning" : "job-specific");
            expect(proposal.proposedExpectationAssessments.map((entry) => entry.expectationId)).toEqual(payload.proposedExpectationAssessments.map((entry) => entry.expectationId).sort());
            expect(proposal.proposedExpectationAssessments.every((entry) => entry.trustState === "proposed")).toBe(true);
            expect((await getFitAssessmentProposalStatus(fixture.workspace, generated.proposalId)).readyForReview).toBe(true);
        }
    });
    it("preserves raw response, prompt hash, normalized input hash, cache behavior, refresh, and replay", async () => {
        const fixture = await roleAssessmentFixture();
        await buildFitAssessment(fixture.workspace, fixture.targetId);
        const payload = await validAssessmentPayload(fixture.workspace, fixture.targetId);
        const raw = JSON.stringify(payload);
        const provider = new FakeInterpretationModelProvider(raw);
        const first = await generateFitAssessmentProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(FIRST_TIME) });
        const before = await fitAssessmentProposalFileTimestamps(fixture.workspace, first.proposalId);
        const cached = await generateFitAssessmentProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(SECOND_TIME) });
        expect(cached.result).toBe("cache-hit");
        expect(cached.proposalId).toBe(first.proposalId);
        expect(provider.callCount).toBe(1);
        expect(await fitAssessmentProposalFileTimestamps(fixture.workspace, first.proposalId)).toEqual(before);
        expect((await replayFitAssessmentProposal(fixture.workspace, first.proposalId)).matches).toBe(true);
        const refreshed = await generateFitAssessmentProposal(fixture.workspace, fixture.targetId, { provider, refresh: true, now: () => new Date(SECOND_TIME) });
        expect(refreshed.proposalId).not.toBe(first.proposalId);
        expect(provider.callCount).toBe(2);
        const proposal = await showFitAssessmentProposal(fixture.workspace, first.proposalId);
        expect(await readFile(path.join(fixture.workspace, proposal.rawResponsePath), "utf8")).toBe(raw);
        expect(await hashFile(path.join(fixture.workspace, proposal.rawResponsePath))).toBe(proposal.rawResponseSha256);
        const manifest = JSON.parse(await readFile(path.join(fixture.workspace, first.manifestPath), "utf8"));
        expect(manifest.promptTemplateId).toBe(ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_ID);
        expect(manifest.renderedPromptSha256).toBe(proposal.prompt.renderedPromptSha256);
        expect(manifest.normalizedModelInputSha256).toBe(proposal.input.normalizedModelInputSha256);
        expect(proposal.prompt.renderedPromptSha256).toMatch(/^[a-f0-9]{64}$/);
    });
    it.each([
        ["unknown expectation", (payload) => { payload.proposedExpectationAssessments[0].expectationId = "expectation_unknown"; }, "UNKNOWN_EXPECTATION_ID"],
        ["unknown match", (payload) => { payload.proposedExpectationAssessments[0].approvedMatchIds = ["match_unknown"]; }, "UNKNOWN_MATCH_ID"],
        ["unknown evidence", (payload) => { payload.proposedExpectationAssessments[0].evidenceIds = ["evi_unknown"]; }, "UNKNOWN_EVIDENCE_ID"],
        ["invented metric", (payload) => { payload.proposedExpectationAssessments[0].rationale = "Improved adoption by 9000 percent."; }, "INVENTED_METRIC"],
        ["resume output", (payload) => { payload.proposedExpectationAssessments[0].rationale = "Use this as a resume bullet."; }, "FORBIDDEN_CONTENT"],
        ["apply recommendation", (payload) => { payload.proposedSummary.narrative = "Recommend apply for this role."; }, "FORBIDDEN_CONTENT"],
        ["fit percentage", (payload) => { payload.proposedSummary.narrative = "This is an 82% fit."; }, "FIT_PERCENTAGE"],
        ["definite experience gap", (payload) => { payload.proposedExpectationAssessments[3].rationale = "The candidate clearly lacks experience."; }, "FORBIDDEN_CONTENT"],
    ])("rejects forbidden model output: %s", async (_name, mutate, issueCode) => {
        const fixture = await roleAssessmentFixture();
        await buildFitAssessment(fixture.workspace, fixture.targetId);
        const payload = await validAssessmentPayload(fixture.workspace, fixture.targetId);
        mutate(payload);
        const generated = await generateFitAssessmentProposal(fixture.workspace, fixture.targetId, { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)) });
        const proposal = await showFitAssessmentProposal(fixture.workspace, generated.proposalId);
        expect(proposal.status).toBe("validation-failed");
        expect(proposal.validationIssues.some((entry) => entry.code === issueCode)).toBe(true);
    });
    it("rejects malformed and empty provider responses without review eligibility", async () => {
        const fixture = await roleAssessmentFixture();
        await buildFitAssessment(fixture.workspace, fixture.targetId);
        await expect(generateFitAssessmentProposal(fixture.workspace, fixture.targetId, { provider: new FakeInterpretationModelProvider("") })).rejects.toThrow("empty response");
        const malformed = await generateFitAssessmentProposal(fixture.workspace, fixture.targetId, { provider: new FakeInterpretationModelProvider("{bad") });
        expect((await getFitAssessmentProposalStatus(fixture.workspace, malformed.proposalId)).readyForReview).toBe(false);
    });
    it("reviews accept, edit, reject, and summary fallback without mutating the proposal", async () => {
        const fixture = await assessmentProposalFixture();
        const proposalPath = path.join(fixture.workspace, fixture.generated.proposalPath);
        const beforeHash = await hashFile(proposalPath);
        await initializeFitAssessmentReview(fixture.workspace, fixture.generated.proposalId, { reviewerName: "Reviewer", now: () => new Date(FIRST_TIME) });
        const proposal = await showFitAssessmentProposal(fixture.workspace, fixture.generated.proposalId);
        await setFitAssessmentReviewDecision(fixture.workspace, proposal.id, proposal.proposedExpectationAssessments[0].id, { decision: "accept" });
        await setFitAssessmentReviewDecision(fixture.workspace, proposal.id, proposal.proposedExpectationAssessments[1].id, { decision: "edit", editedAssessment: editedAssessment(proposal.proposedExpectationAssessments[1]) });
        for (const entry of proposal.proposedExpectationAssessments.slice(2)) {
            await setFitAssessmentReviewDecision(fixture.workspace, proposal.id, entry.id, { decision: "reject" });
        }
        await setFitAssessmentSummaryReviewDecision(fixture.workspace, proposal.id, { decision: "reject" });
        expect(await hashFile(proposalPath)).toBe(beforeHash);
        const completed = await completeFitAssessmentReview(fixture.workspace, proposal.id, { now: () => new Date(SECOND_TIME) });
        expect(completed.status).toBe("completed");
        expect(completed.expectationCounts).toMatchObject({ accept: 1, edit: 1, reject: proposal.proposedExpectationAssessments.length - 2, pending: 0 });
        expect(completed.summaryDecision).toBe("reject");
    });
    it("prevents duplicate decisions, unknown IDs, incomplete review, and unsafe edits", async () => {
        const fixture = await assessmentProposalFixture();
        await initializeFitAssessmentReview(fixture.workspace, fixture.generated.proposalId);
        const proposal = await showFitAssessmentProposal(fixture.workspace, fixture.generated.proposalId);
        const first = proposal.proposedExpectationAssessments[0];
        await setFitAssessmentReviewDecision(fixture.workspace, proposal.id, first.id, { decision: "accept" });
        await expect(setFitAssessmentReviewDecision(fixture.workspace, proposal.id, first.id, { decision: "reject" })).rejects.toThrow("already exists");
        await expect(setFitAssessmentReviewDecision(fixture.workspace, proposal.id, "proposed-assessment_unknown", { decision: "accept" })).rejects.toThrow("Unknown");
        await expect(completeFitAssessmentReview(fixture.workspace, proposal.id)).rejects.toThrow("remain pending");
        const second = proposal.proposedExpectationAssessments[1];
        const unsafe = editedAssessment(second);
        unsafe.rationale = "Use this resume bullet.";
        await expect(setFitAssessmentReviewDecision(fixture.workspace, proposal.id, second.id, { decision: "edit", editedAssessment: unsafe })).rejects.toThrow("forbidden");
    });
    it("approves reviewed assessment deterministically with explicit trust states and no provider call", async () => {
        const fixture = await completedAssessmentReviewFixture();
        const beforeCalls = fixture.provider.callCount;
        const approvedResult = await approveFitAssessmentProposal(fixture.workspace, fixture.generated.proposalId, { now: () => new Date(SECOND_TIME) });
        expect(fixture.provider.callCount).toBe(beforeCalls);
        const proposal = await showFitAssessmentProposal(fixture.workspace, fixture.generated.proposalId);
        expect(approvedResult).toMatchObject({ result: "created", humanApprovedCount: 1, humanEditedCount: 1, rejectedFallbackCount: proposal.proposedExpectationAssessments.length - 2, deterministicApprovedCount: proposal.proposedExpectationAssessments.length - 2 });
        const approved = await showFitAssessment(fixture.workspace, fixture.targetId, "approved");
        expect(approved.expectationAssessments.slice(0, 2).map((entry) => entry.trustState)).toEqual(["human-approved", "human-edited"]);
        expect(approved.expectationAssessments.slice(2).every((entry) => entry.trustState === "deterministic-approved")).toBe(true);
        expect(approved.expectationAssessments.every((entry) => entry.trustState !== "proposed")).toBe(true);
        expect((await getFitAssessmentStatus(fixture.workspace, fixture.targetId, "approved")).status).toBe("current");
        const rerun = await approveFitAssessmentProposal(fixture.workspace, fixture.generated.proposalId, { now: () => new Date("2026-07-23T12:00:00.000Z") });
        expect(rerun.result).toBe("already-current");
    });
    it("refuses approval for incomplete review or stale proposal dependencies", async () => {
        const incomplete = await assessmentProposalFixture();
        await initializeFitAssessmentReview(incomplete.workspace, incomplete.generated.proposalId);
        await expect(approveFitAssessmentProposal(incomplete.workspace, incomplete.generated.proposalId)).rejects.toThrow("completed");
        const stale = await completedAssessmentReviewFixture();
        const claimsPath = path.join(stale.workspace, "kb/claims.json");
        const claims = JSON.parse(await readFile(claimsPath, "utf8"));
        claims[0].approvedWording = "Changed after proposal review.";
        await writeJsonAtomic(claimsPath, claims);
        await expect(approveFitAssessmentProposal(stale.workspace, stale.generated.proposalId)).rejects.toThrow(/stale|invalid/);
    });
    it("preserves manifest hashes and complete provenance through deterministic, proposal, review, and approval artifacts", async () => {
        const fixture = await completedAssessmentReviewFixture();
        const result = await approveFitAssessmentProposal(fixture.workspace, fixture.generated.proposalId);
        const deterministicStatus = await getFitAssessmentStatus(fixture.workspace, fixture.targetId);
        const proposalStatus = await getFitAssessmentProposalStatus(fixture.workspace, fixture.generated.proposalId);
        const reviewStatus = await getFitAssessmentReviewStatus(fixture.workspace, fixture.generated.proposalId);
        const approvedStatus = await getFitAssessmentStatus(fixture.workspace, fixture.targetId, "approved");
        expect([deterministicStatus.status, proposalStatus.status, reviewStatus.status, approvedStatus.status]).toEqual(["current", "current", "completed", "current"]);
        const manifests = [
            deterministicStatus.manifestPath,
            fixture.generated.manifestPath,
            reviewStatus.manifestPath,
            result.manifestPath,
        ];
        for (const relative of manifests)
            expect(JSON.parse(await readFile(path.join(fixture.workspace, relative), "utf8"))).toBeTruthy();
        const approved = await showFitAssessment(fixture.workspace, fixture.targetId, "approved");
        expect(approved.expectationAssessments[0].provenance).toMatchObject({
            targetId: fixture.targetId,
            assessmentPolicy: { name: FIT_ASSESSMENT_POLICY_NAME, version: FIT_ASSESSMENT_POLICY_VERSION },
            modelProposal: { proposalId: fixture.generated.proposalId },
            reviewDecision: { decision: "accept" },
        });
    });
    it("keeps role and job summaries distinct and emits no resume, cover letter, or application artifact", async () => {
        const role = await roleAssessmentFixture();
        const job = await jobAssessmentFixture();
        for (const fixture of [role, job]) {
            await buildFitAssessment(fixture.workspace, fixture.targetId);
            const filesBefore = await directoryFileNames(fixture.workspace);
            const serialized = JSON.stringify(await showFitAssessment(fixture.workspace, fixture.targetId));
            expect(serialized).not.toMatch(/resume-draft|cover-letter|screening-answer|application-package|fitPercentage|hiringProbability/i);
            expect(await directoryFileNames(fixture.workspace)).toEqual(filesBefore);
        }
    });
    it("does not persist provider credentials or absolute private source paths", async () => {
        const fixture = await assessmentProposalFixture();
        const root = path.join(fixture.workspace, `targets/roles/${fixture.targetId}/assessment`);
        for (const file of await allFiles(root)) {
            const text = await readFile(file, "utf8");
            expect(text).not.toContain("PROOFLAYER_MODEL_API_KEY");
            expect(text).not.toContain("/Users/example/");
        }
    });
    it("keeps approved interpretation and matching hashes unchanged while assessing", async () => {
        const fixture = await roleAssessmentFixture();
        const context = await loadAssessmentContext(fixture.workspace, fixture.targetId);
        const before = {
            interpretation: await hashFile(path.join(fixture.workspace, context.approvedInterpretationPath)),
            interpretationManifest: await hashFile(path.join(fixture.workspace, context.approvedInterpretationManifestPath)),
            matching: await hashFile(path.join(fixture.workspace, context.approvedMatchingPath)),
            matchingManifest: await hashFile(path.join(fixture.workspace, context.approvedMatchingManifestPath)),
        };
        await buildFitAssessment(fixture.workspace, fixture.targetId);
        expect(await hashFile(path.join(fixture.workspace, context.approvedInterpretationPath))).toBe(before.interpretation);
        expect(await hashFile(path.join(fixture.workspace, context.approvedInterpretationManifestPath))).toBe(before.interpretationManifest);
        expect(await hashFile(path.join(fixture.workspace, context.approvedMatchingPath))).toBe(before.matching);
        expect(await hashFile(path.join(fixture.workspace, context.approvedMatchingManifestPath))).toBe(before.matchingManifest);
        expect((await getApprovedEvidenceMatchingStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
    });
    it("documents prompt boundaries directly in the rendered model request", () => {
        const prompt = renderFitAssessmentPrompt({ example: true });
        expect(hashText(prompt)).toMatch(/^[a-f0-9]{64}$/);
        expect(prompt).toContain("fit percentages");
        expect(prompt).toContain("does not prove the candidate lacks the capability");
        expect(prompt).toContain("Never write resume bullets");
        expect(prompt).toContain(ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_ID);
    });
});
async function roleAssessmentFixture(options = {}) {
    const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-assessment-role-"));
    const created = await createRoleTarget(workspace, { title: "Engineering Manager" }, { now: () => new Date(FIRST_TIME) });
    await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
    const roleProfilePath = path.join(workspace, "role-profiles", "engineering-manager.json");
    const definitions = [
        ["platform-delivery", "Lead platform delivery across teams.", "required", "critical"],
        ["stakeholder-alignment", "Coordinate stakeholders and delivery decisions.", "required", "high"],
        ["technical-tradeoffs", "Evaluate technical tradeoffs across a compound platform scope.", "required", "medium"],
        ["coaching-system", "Establish a specific engineering coaching system.", "preferred", "medium"],
        ["scope-consistency", "Maintain consistent delivery scope and accountability.", "contextual", "high"],
        ...(options.includeNotAssessed ? [["unassessed", "Demonstrate another reviewed capability.", "unknown", "unknown"]] : []),
    ];
    const roleProfile = {
        schemaVersion: 1,
        id: "engineering-manager",
        title: "Engineering Manager",
        aliases: [],
        expectations: definitions.map(([id, statement, necessity, importance]) => ({ id, kind: "leadership", statement, necessity, importance, capabilityTags: [id], group: "leadership-expectations", notes: [] })),
        createdAt: FIRST_TIME,
        updatedAt: FIRST_TIME,
    };
    await writeJsonAtomic(roleProfilePath, roleProfile);
    await interpretTarget(workspace, created.target.id, { roleProfile: roleProfilePath, now: () => new Date(FIRST_TIME) });
    await approveTargetInterpretation(workspace, created.target.id);
    await writeEvidenceKb(workspace, (await showApprovedTargetInterpretation(workspace, created.target.id)).expectations.length);
    await writeMatchingPattern(workspace, created.target.id, options.includeNotAssessed ?? false);
    return { workspace, targetId: created.target.id, targetType: "role" };
}
async function jobAssessmentFixture() {
    const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-assessment-job-"));
    const input = path.join(workspace, "job.md");
    await writeFile(input, [
        "---",
        "title: Engineering Manager",
        "company: ExampleCo",
        "---",
        "## Required Qualifications",
        "- Lead platform delivery across teams.",
        "- Coordinate stakeholders and delivery decisions.",
        "## Preferred Qualifications",
        "- Evaluate technical tradeoffs across a compound platform scope.",
        "## Responsibilities",
        "- Establish a specific engineering coaching system.",
        "- Maintain consistent delivery scope and accountability.",
        "",
    ].join("\n"), "utf8");
    const created = await createJobTarget(workspace, { file: input }, { now: () => new Date(FIRST_TIME) });
    await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
    await interpretTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
    await approveTargetInterpretation(workspace, created.target.id);
    await writeEvidenceKb(workspace, (await showApprovedTargetInterpretation(workspace, created.target.id)).expectations.length);
    await writeMatchingPattern(workspace, created.target.id, false);
    return { workspace, targetId: created.target.id, targetType: "job" };
}
async function approveTargetInterpretation(workspace, targetId) {
    const deterministic = await showTargetInterpretation(workspace, targetId);
    const payload = {
        proposedExpectations: deterministic.expectations.map((source) => ({
            operation: "enrich",
            sourceExpectationIds: [source.id],
            sourceAnalysisItemIds: source.sourceAnalysisItemIds,
            sourceReferences: source.sourceReferences,
            kind: source.kind,
            statement: source.statement,
            necessity: source.necessity,
            importance: source.importance,
            explicitness: source.explicitness,
            capabilityTags: source.capabilityTags,
            interpretationConfidence: source.interpretationConfidence,
            rationale: "Reviewed target input explicitly supports this expectation.",
            ambiguityNotes: [],
        })),
        proposedGroups: [],
        proposedAmbiguities: [],
        warnings: [],
    };
    const generated = await generateInterpretationProposal(workspace, targetId, { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)), now: () => new Date(FIRST_TIME) });
    await initializeProposalReview(workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
    const proposal = await showInterpretationProposal(workspace, generated.proposalId);
    for (const expectation of proposal.proposedExpectations) {
        await setProposalReviewDecision(workspace, generated.proposalId, expectation.id, { decision: "accept" });
    }
    await completeProposalReview(workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
    await approveInterpretationProposal(workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
}
async function writeEvidenceKb(workspace, count) {
    const sources = [];
    const evidence = [];
    const claims = [];
    for (let index = 0; index < count; index += 1) {
        const sourceId = `src_assessment_${index}`;
        const evidenceId = `evi_assessment_${index}`;
        const claimId = `claim_assessment_${index}`;
        sources.push({ id: sourceId, type: "markdown", path: `sources/markdown/evidence-${index}.md`, title: `Reviewed evidence ${index}`, importedAt: FIRST_TIME, hash: hashText(`source-${index}`), visibility: "public", status: "active" });
        evidence.push({ id: evidenceId, sourceIds: [sourceId], category: index === 3 ? "role" : "responsibility", text: `Reviewed evidence for expectation ${index}.`, normalizedSummary: `Reviewed evidence for expectation ${index}.`, sourceSection: "Professional Experience", technologies: [], domains: ["platform"], visibility: "public", sensitivityFlags: [], confidence: "high" });
        claims.push({ id: claimId, claim: `Reviewed evidence for expectation ${index}.`, approvedWording: `Reviewed evidence for expectation ${index}.`, type: "responsibility_claim", supportingEvidenceIds: [evidenceId], sourceSection: "Professional Experience", extractionConfidence: "high", factualConfidence: "high", corroborationLevel: "manual_approved", approvalStatus: "approved", outputReadiness: "resume_ready", confidence: "high", publicSafe: true, needsConfirmation: false, metricStatus: "no_metric", unsafeWording: [] });
    }
    await writeJsonAtomic(path.join(workspace, "kb/sources.json"), sources);
    await writeJsonAtomic(path.join(workspace, "kb/evidence-items.json"), evidence);
    await writeJsonAtomic(path.join(workspace, "kb/claims.json"), claims);
}
async function writeMatchingPattern(workspace, targetId, includeNotAssessed) {
    const context = await loadMatchingContext(workspace, targetId, { persistSnapshot: true, now: () => new Date(FIRST_TIME) });
    const matches = [];
    const explicit = new Map();
    context.eligibleExpectations.forEach((expectation, index) => {
        const evidence = context.snapshot.entries[index];
        if (!evidence)
            throw new Error(`Missing evidence fixture at index ${index}`);
        if (index === 0)
            matches.push(matchFixture(context, expectation.id, evidence.evidenceId, "strong", "direct", "full", "strong", "current", "high"));
        else if (index === 1)
            matches.push(matchFixture(context, expectation.id, evidence.evidenceId, "adequate", "direct", "full", "medium", "recent", "medium"));
        else if (index === 2)
            matches.push(matchFixture(context, expectation.id, evidence.evidenceId, "partial", "partial", "partial", "medium", "current", "medium"));
        else if (index === 3)
            explicit.set(expectation.id, "unsupported");
        else if (index === 4)
            matches.push(matchFixture(context, expectation.id, evidence.evidenceId, "conflict", "contradictory", "conflicting", "strong", "current", "high"));
        else if (includeNotAssessed && index === context.eligibleExpectations.length - 1)
            explicit.set(expectation.id, "not-assessed");
        else
            explicit.set(expectation.id, "unsupported");
    });
    await writeApprovedMatching(workspace, context, matches, explicit, {}, { now: () => new Date(FIRST_TIME) });
    expect((await showApprovedEvidenceMatching(workspace, targetId)).matches.length).toBe(matches.length);
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
        rationale: matchType === "contradictory" ? "Reviewed evidence explicitly conflicts with this expectation." : "Reviewed evidence supports this expectation within the listed limits.",
        expectationProvenance: expectationProvenance(context, expectation),
        evidenceProvenance: [evidence.provenance],
        trustState: "manual-approved",
        interpretation: { method: "manual", matcherName: "target-evidence-matcher", matcherVersion: "1", policyVersion: "1" },
        matchConfidence,
        limitations: matchType === "direct" ? [] : [matchType === "contradictory" ? "Reviewed evidence conflicts." : "Only part of the expectation is covered."],
        notes: [],
    };
}
async function validAssessmentPayload(workspace, targetId) {
    const deterministic = await showFitAssessment(workspace, targetId);
    return {
        proposedExpectationAssessments: deterministic.expectationAssessments.map((entry) => ({
            expectationAssessmentId: entry.id,
            expectationId: entry.expectationId,
            supportStatus: entry.supportStatus,
            proofQuality: entry.proofQuality,
            evidenceSufficiency: entry.evidenceSufficiency,
            defensibility: entry.defensibility,
            freshnessRisk: entry.freshnessRisk,
            contradictionRisk: entry.contradictionRisk,
            gapType: entry.gapType,
            assessmentConfidence: entry.assessmentConfidence,
            materiality: entry.materiality,
            approvedMatchIds: entry.approvedMatchIds,
            evidenceIds: entry.evidenceIds,
            rationale: entry.rationale,
            limitations: entry.limitations,
            recommendedEvidenceActions: entry.recommendedEvidenceActions,
            provenance: entry.provenance,
        })),
        proposedSummary: deterministic.summary,
        warnings: [],
        ambiguities: [],
    };
}
async function assessmentProposalFixture() {
    const fixture = await roleAssessmentFixture();
    await buildFitAssessment(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    const payload = await validAssessmentPayload(fixture.workspace, fixture.targetId);
    const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
    const generated = await generateFitAssessmentProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(FIRST_TIME) });
    return { ...fixture, provider, generated };
}
async function completedAssessmentReviewFixture() {
    const fixture = await assessmentProposalFixture();
    await initializeFitAssessmentReview(fixture.workspace, fixture.generated.proposalId, { reviewerName: "Reviewer", now: () => new Date(FIRST_TIME) });
    const proposal = await showFitAssessmentProposal(fixture.workspace, fixture.generated.proposalId);
    await setFitAssessmentReviewDecision(fixture.workspace, proposal.id, proposal.proposedExpectationAssessments[0].id, { decision: "accept" });
    await setFitAssessmentReviewDecision(fixture.workspace, proposal.id, proposal.proposedExpectationAssessments[1].id, { decision: "edit", editedAssessment: editedAssessment(proposal.proposedExpectationAssessments[1]) });
    for (const entry of proposal.proposedExpectationAssessments.slice(2))
        await setFitAssessmentReviewDecision(fixture.workspace, proposal.id, entry.id, { decision: "reject" });
    await setFitAssessmentSummaryReviewDecision(fixture.workspace, proposal.id, { decision: "reject" });
    await completeFitAssessmentReview(fixture.workspace, proposal.id, { now: () => new Date(SECOND_TIME) });
    return fixture;
}
function editedAssessment(source) {
    return {
        supportStatus: source.supportStatus,
        proofQuality: source.proofQuality,
        evidenceSufficiency: source.evidenceSufficiency,
        defensibility: source.defensibility,
        freshnessRisk: source.freshnessRisk,
        contradictionRisk: source.contradictionRisk,
        gapType: source.gapType,
        assessmentConfidence: source.assessmentConfidence,
        materiality: source.materiality,
        approvedMatchIds: source.approvedMatchIds,
        evidenceIds: source.evidenceIds,
        rationale: `${source.rationale} Human review clarified the explanation without changing approved evidence.`,
        limitations: source.limitations,
        recommendedEvidenceActions: source.recommendedEvidenceActions,
    };
}
async function directoryFileNames(root) {
    return (await allFiles(root)).map((file) => path.relative(root, file)).sort();
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
