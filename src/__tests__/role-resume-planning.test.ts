import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { approveRoleResumePlanProposal } from "../approved-role-resume-plan.js";
import { approveInterpretationProposal, showApprovedTargetInterpretation } from "../approved-interpretation.js";
import {
  assessmentPaths,
  buildFitAssessment,
  createAssessmentManifest,
  loadAssessmentContext,
  showFitAssessment,
} from "../fit-assessment.js";
import {
  expectationProvenance,
  loadMatchingContext,
  manualMatchId,
  writeApprovedMatching,
} from "../evidence-matching.js";
import { hashFile, hashText, writeJsonAtomic } from "../fs-utils.js";
import {
  FakeInterpretationModelProvider,
  type InterpretationModelProvider,
  type ModelInterpretationRequest,
} from "../model-provider.js";
import {
  ROLE_RESUME_PLAN_PROMPT_TEMPLATE_ID,
  generateRoleResumePlanProposal,
  getRoleResumePlanProposalStatus,
  replayRoleResumePlanProposal,
  showRoleResumePlanProposal,
} from "../role-resume-plan-proposal.js";
import {
  completeRoleResumePlanReview,
  getRoleResumePlanReviewStatus,
  initializeRoleResumePlanReview,
  setRoleResumePlanReviewDecision,
  showRoleResumePlanReview,
} from "../role-resume-plan-review.js";
import type { ModelRoleResumePlanPayload } from "../role-resume-plan-schemas.js";
import {
  ROLE_RESUME_PLANNING_POLICY_NAME,
  ROLE_RESUME_PLANNING_POLICY_VERSION,
  buildRoleResumePlan,
  derivePositioningScope,
  getRoleResumePlanStatus,
  showRoleResumePlan,
} from "../role-resume-planning.js";
import type {
  Claim,
  EvidenceItem,
  EvidenceMatch,
  ModelInterpretationPayload,
  RoleProfile,
  Source,
} from "../schemas.js";
import { analyzeTarget } from "../target-analysis.js";
import { interpretTarget } from "../target-interpretation.js";
import {
  generateInterpretationProposal,
  showInterpretationProposal,
  stableJson,
} from "../target-proposal.js";
import {
  completeProposalReview,
  initializeProposalReview,
  setProposalReviewDecision,
} from "../target-proposal-review.js";
import { createJobTarget, createRoleTarget, showTarget } from "../targets.js";

const FIRST_TIME = "2026-07-23T10:00:00.000Z";
const SECOND_TIME = "2026-07-23T11:00:00.000Z";

describe("Slice 2.6A role resume content planning", () => {
  it("builds a deterministic plan from current approved role artifacts using conservative ordered rules", async () => {
    const fixture = await planningFixture();
    const result = await buildRoleResumePlan(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    const plan = await showRoleResumePlan(fixture.workspace, fixture.targetId);

    expect(result.result).toBe("created");
    expect(plan.planningPolicy).toEqual({
      name: ROLE_RESUME_PLANNING_POLICY_NAME,
      version: ROLE_RESUME_PLANNING_POLICY_VERSION,
    });
    expect(plan.mode).toBe("market-positioning");
    expect(decisionCounts(plan.expectationSelections.map((entry) => entry.decision))).toEqual({
      primary: 2,
      supporting: 1,
      exclude: 2,
      defer: 1,
    });
    expect(decisionCounts(plan.evidenceSelections.map((entry) => entry.decision))).toEqual({
      preferred: 1,
      allowed: 1,
      exclude: 3,
      "limited-use": 1,
    });
    expect(plan.expectationSelections.find((entry) => entry.supportStatus === "conflicting")?.decision).toBe("exclude");
    const interpretation = await showApprovedTargetInterpretation(fixture.workspace, fixture.targetId);
    const technicalId = interpretation.expectations.find((entry) => entry.statement.startsWith("Evaluate technical tradeoffs"))!.id;
    const coachingId = interpretation.expectations.find((entry) => entry.statement.startsWith("Establish a specific"))!.id;
    expect(plan.claimBoundaries.find((entry) => entry.expectationId === technicalId)?.boundaryType).toBe("requires-review");
    expect(plan.claimBoundaries.find((entry) => entry.expectationId === coachingId)?.boundaryType).toBe("prohibited");
    expect(plan.claimBoundaries.every((entry) => !entry.allowedClaimTypes.includes("quantified-outcome"))).toBe(true);
    expect(plan.sections.find((entry) => entry.type === "headline")).toMatchObject({ status: "include", order: 0 });
    expect(plan.sections.filter((entry) => entry.status !== "exclude").map((entry) => entry.order)).toEqual(
      plan.sections.filter((entry) => entry.status !== "exclude").map((_, index) => index),
    );
    expect(plan.positioning.narrativeOrder).toEqual([
      "target-role-identity",
      "primary-themes",
      "selected-impact",
      "professional-experience",
      "supporting-projects-and-technical-depth",
      "education-and-certifications",
    ]);
    expect(plan.completeness).toMatchObject({ status: "complete", usableForResumeDrafting: true });
    expect(stableJson(plan)).not.toMatch(/fitScore|fitPercentage|hiringProbability|applicationRecommendation/);
    expect(stableJson(plan)).not.toMatch(/Results-driven|Led cross-functional teams to|Delivered \d+%/i);
  });

  it("maps all positioning scopes without turning scope into an employability judgment", async () => {
    const fixture = await planningFixture();
    await buildRoleResumePlan(fixture.workspace, fixture.targetId);
    const assessment = await showFitAssessment(fixture.workspace, fixture.targetId, "approved");
    if (assessment.summary.mode !== "role-positioning") throw new Error("Expected role summary.");
    const summary = assessment.summary;
    expect(derivePositioningScope({ ...summary, overallPositioning: "well-supported" })).toBe("direct-role-positioning");
    expect(derivePositioningScope({ ...summary, overallPositioning: "supported-with-gaps" })).toBe("adjacent-role-positioning");
    expect(derivePositioningScope({ ...summary, overallPositioning: "partially-supported" })).toBe("stretch-positioning");
    expect(derivePositioningScope({ ...summary, overallPositioning: "conflicting" })).toBe("stretch-positioning");
    expect(derivePositioningScope({ ...summary, overallPositioning: "insufficient-evidence" })).toBe("insufficient-evidence");
    expect(stableJson(await showRoleResumePlan(fixture.workspace, fixture.targetId)).toLowerCase()).not.toContain("employability");
  });

  it("allows quantified outcomes only when approved resume-ready evidence contains a verified metric", async () => {
    const withoutMetric = await planningFixture();
    await buildRoleResumePlan(withoutMetric.workspace, withoutMetric.targetId);
    expect((await showRoleResumePlan(withoutMetric.workspace, withoutMetric.targetId)).claimBoundaries.every(
      (entry) => !entry.allowedClaimTypes.includes("quantified-outcome"),
    )).toBe(true);

    const withMetric = await planningFixture({ verifiedMetric: true });
    await buildRoleResumePlan(withMetric.workspace, withMetric.targetId);
    const plan = await showRoleResumePlan(withMetric.workspace, withMetric.targetId);
    const interpretation = await showApprovedTargetInterpretation(withMetric.workspace, withMetric.targetId);
    const platformId = interpretation.expectations.find((entry) => entry.statement.startsWith("Lead platform delivery"))!.id;
    expect(plan.claimBoundaries.find((entry) => entry.expectationId === platformId)?.allowedClaimTypes).toContain("quantified-outcome");
    expect(plan.claimBoundaries.filter((entry) => entry.expectationId !== platformId).every(
      (entry) => !entry.allowedClaimTypes.includes("quantified-outcome"),
    )).toBe(true);
  });

  it("rejects Job Targets and requires complete approved role assessment unless partial planning is explicit", async () => {
    const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-plan-job-"));
    const source = path.join(workspace, "job.md");
    await writeFile(source, "---\ntitle: Engineering Manager\n---\n\n## Requirements\n- Lead delivery.\n", "utf8");
    const job = await createJobTarget(workspace, { file: source });
    await expect(buildRoleResumePlan(workspace, job.target.id)).rejects.toThrow(/Role Targets only/);

    const partial = await planningFixture({ includeNotAssessed: true });
    await expect(buildRoleResumePlan(partial.workspace, partial.targetId)).rejects.toThrow(/complete and usable/);
    const result = await buildRoleResumePlan(partial.workspace, partial.targetId, { allowPartial: true });
    expect(result.completeness).toBe("partial");
    expect(result.usableForResumeDrafting).toBe(false);
  });

  it("preserves stable IDs and timestamps on unchanged reruns and reports missing, current, stale, and invalid states", async () => {
    const fixture = await planningFixture();
    expect((await getRoleResumePlanStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
    const first = await buildRoleResumePlan(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    const firstPlan = await showRoleResumePlan(fixture.workspace, fixture.targetId);
    const firstMtime = (await stat(path.join(fixture.workspace, first.planPath))).mtimeMs;
    const second = await buildRoleResumePlan(fixture.workspace, fixture.targetId, { now: () => new Date(SECOND_TIME) });
    const secondPlan = await showRoleResumePlan(fixture.workspace, fixture.targetId);
    expect(second.result).toBe("already-current");
    expect(secondPlan.id).toBe(firstPlan.id);
    expect(secondPlan.sections.map((entry) => entry.id)).toEqual(firstPlan.sections.map((entry) => entry.id));
    expect(secondPlan.createdAt).toBe(FIRST_TIME);
    expect(secondPlan.updatedAt).toBe(FIRST_TIME);
    expect((await stat(path.join(fixture.workspace, second.planPath))).mtimeMs).toBe(firstMtime);
    expect((await getRoleResumePlanStatus(fixture.workspace, fixture.targetId)).status).toBe("current");

    const assessmentPath = path.join(fixture.workspace, firstPlan.approvedAssessment.path);
    const assessment = JSON.parse(await readFile(assessmentPath, "utf8"));
    assessment.updatedAt = SECOND_TIME;
    await writeJsonAtomic(assessmentPath, assessment);
    expect((await getRoleResumePlanStatus(fixture.workspace, fixture.targetId)).status).toBe("stale");

    const invalid = await planningFixture();
    const built = await buildRoleResumePlan(invalid.workspace, invalid.targetId);
    const manifestPath = path.join(invalid.workspace, built.manifestPath);
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.planSha256 = hashText("tampered");
    await writeJsonAtomic(manifestPath, manifest);
    expect((await getRoleResumePlanStatus(invalid.workspace, invalid.targetId)).status).toBe("invalid");
  });

  it("creates a traceable proposal, caches identical requests, refreshes explicitly, and replays exact raw bytes", async () => {
    const fixture = await planningFixture();
    await buildRoleResumePlan(fixture.workspace, fixture.targetId);
    const payload = await modelPayload(fixture.workspace, fixture.targetId);
    const raw = JSON.stringify(payload);
    const provider = new CapturingFakeProvider(raw);
    const first = await generateRoleResumePlanProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(FIRST_TIME) });
    const proposal = await showRoleResumePlanProposal(fixture.workspace, first.proposalId);
    const second = await generateRoleResumePlanProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(SECOND_TIME) });
    const refreshed = await generateRoleResumePlanProposal(fixture.workspace, fixture.targetId, { provider, refresh: true, now: () => new Date(SECOND_TIME) });
    const replay = await replayRoleResumePlanProposal(fixture.workspace, first.proposalId);

    expect(first.result).toBe("created");
    expect(second.result).toBe("cache-hit");
    expect(second.proposalId).toBe(first.proposalId);
    expect(refreshed.proposalId).not.toBe(first.proposalId);
    expect(provider.callCount).toBe(2);
    expect(replay.matches).toBe(true);
    expect(await readFile(path.join(fixture.workspace, proposal.rawResponsePath), "utf8")).toBe(raw);
    expect(proposal.rawResponseSha256).toBe(hashText(raw));
    expect(proposal.prompt.templateId).toBe(ROLE_RESUME_PLAN_PROMPT_TEMPLATE_ID);
    expect(proposal.prompt.renderedPromptSha256).toBe(hashText(provider.lastPrompt));
    expect(proposal.input.normalizedModelInputSha256).toMatch(/^[a-f0-9]{64}$/);
    const manifest = JSON.parse(await readFile(path.join(fixture.workspace, first.manifestPath), "utf8"));
    expect(manifest.renderedPromptSha256).toBe(proposal.prompt.renderedPromptSha256);
    expect(manifest.normalizedModelInputSha256).toBe(proposal.input.normalizedModelInputSha256);
    expect((await getRoleResumePlanProposalStatus(fixture.workspace, first.proposalId))).toMatchObject({
      status: "current",
      readyForReview: true,
      proposalHashMatches: true,
      rawResponseHashMatches: true,
    });
  });

  it.each([
    ["finished summary", (payload: ModelRoleResumePlanPayload) => { payload.positioning.audience.notes = ["Results-driven Engineering Manager with platform expertise."]; }],
    ["resume bullet", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["Led cross-functional teams to deliver scalable platforms."]; }],
    ["invented metric", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["Plan around 73% growth."]; }],
    ["team size", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["Managed 42 engineers."]; }],
    ["ATS score", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["ATS score is suitable."]; }],
    ["application advice", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["Recommended application path."]; }],
    ["hiring probability", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["Hiring probability is high."]; }],
    ["job-specific tailoring", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["Tailor this plan to the job description."]; }],
    ["invented employer", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["Worked for ExampleCo on platform delivery."]; }],
    ["invented technology", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["Prioritize kubernetes expertise."]; }],
    ["invented scope", (payload: ModelRoleResumePlanPayload) => { payload.sections[0].emphasisNotes = ["Claim enterprise-wide ownership."]; }],
    ["unknown expectation", (payload: ModelRoleResumePlanPayload) => { payload.expectationSelections[0].expectationId = "unknown-expectation"; }],
    ["unknown assessment", (payload: ModelRoleResumePlanPayload) => { payload.expectationSelections[0].assessmentId = "unknown-assessment"; }],
    ["unknown match", (payload: ModelRoleResumePlanPayload) => { payload.expectationSelections[0].approvedMatchIds = ["unknown-match"]; }],
    ["unknown evidence", (payload: ModelRoleResumePlanPayload) => { payload.evidenceSelections[0].evidenceId = "unknown-evidence"; }],
  ])("invalidates model output containing %s", async (_label, mutate) => {
    const fixture = await planningFixture();
    await buildRoleResumePlan(fixture.workspace, fixture.targetId);
    const payload = await modelPayload(fixture.workspace, fixture.targetId);
    mutate(payload);
    const generated = await generateRoleResumePlanProposal(fixture.workspace, fixture.targetId, {
      provider: new FakeInterpretationModelProvider(JSON.stringify(payload)),
    });
    expect(generated.result).toBe("validation-failed");
    expect(generated.validationIssueCount).toBeGreaterThan(0);
  });

  it("supports accept, edit, and reject review decisions without mutating the proposal", async () => {
    const fixture = await proposalFixture();
    const proposalPath = path.join(fixture.workspace, fixture.generated.proposalPath);
    const proposalHash = await hashFile(proposalPath);
    const review = await initializeRoleResumePlanReview(fixture.workspace, fixture.generated.proposalId, {
      reviewerName: "Reviewer",
      now: () => new Date(FIRST_TIME),
    });
    const positioning = review.decisions.find((entry) => entry.itemType === "positioning")!;
    const section = review.decisions.find((entry) => entry.itemType === "section")!;
    const sectionValue = fixture.proposal.proposedPlan!.sections.find((entry) => entry.id === section.itemId)!;
    await setRoleResumePlanReviewDecision(fixture.workspace, fixture.generated.proposalId, "positioning", positioning.itemId, { decision: "accept" });
    await setRoleResumePlanReviewDecision(fixture.workspace, fixture.generated.proposalId, "section", section.itemId, {
      decision: "edit",
      editedValue: { ...sectionValue, emphasisNotes: ["Emphasize only reviewed role-planning evidence."] },
    });
    for (const decision of review.decisions.filter((entry) => ![
      `positioning:${positioning.itemId}`,
      `section:${section.itemId}`,
    ].includes(`${entry.itemType}:${entry.itemId}`))) {
      await setRoleResumePlanReviewDecision(fixture.workspace, fixture.generated.proposalId, decision.itemType, decision.itemId, { decision: "reject" });
    }
    const completed = await completeRoleResumePlanReview(fixture.workspace, fixture.generated.proposalId, { now: () => new Date(SECOND_TIME) });
    expect(completed.status).toBe("completed");
    expect(completed.counts).toMatchObject({ accept: 1, edit: 1, reject: review.decisions.length - 2, pending: 0 });
    expect(await hashFile(proposalPath)).toBe(proposalHash);
    await expect(setRoleResumePlanReviewDecision(fixture.workspace, fixture.generated.proposalId, "section", section.itemId, { decision: "reject" })).rejects.toThrow(/immutable/);
  });

  it("requires complete review and creates an approved plan without a model call", async () => {
    const fixture = await completedReviewFixture();
    const providerCalls = fixture.provider.callCount;
    const first = await approveRoleResumePlanProposal(fixture.workspace, fixture.generated.proposalId, { now: () => new Date(FIRST_TIME) });
    const approved = await showRoleResumePlan(fixture.workspace, fixture.targetId, "approved");
    const second = await approveRoleResumePlanProposal(fixture.workspace, fixture.generated.proposalId, { now: () => new Date(SECOND_TIME) });

    expect(first.result).toBe("created");
    expect(second.result).toBe("already-current");
    expect(providerCalls).toBe(fixture.provider.callCount);
    expect(approved.completeness).toMatchObject({ status: "complete", usableForResumeDrafting: true });
    expect(stableJson(approved)).not.toMatch(/"trustState":"(?:proposed|rejected)"/);
    expect([first.humanApprovedCount, first.humanEditedCount, first.deterministicApprovedCount].every((count) => count > 0)).toBe(true);
    expect((await getRoleResumePlanStatus(fixture.workspace, fixture.targetId, "approved")).status).toBe("current");
    expect(second.planPath).toBe(first.planPath);
    expect((await showRoleResumePlan(fixture.workspace, fixture.targetId, "approved")).createdAt).toBe(FIRST_TIME);
  });

  it("keeps approved upstream artifacts byte-identical and emits no resume or export artifacts", async () => {
    const fixture = await planningFixture();
    const upstream = await upstreamHashes(fixture.workspace, fixture.targetId);
    await buildRoleResumePlan(fixture.workspace, fixture.targetId);
    expect(await upstreamHashes(fixture.workspace, fixture.targetId)).toEqual(upstream);
    const files = await allFiles(fixture.workspace);
    expect(files.some((entry) => /resume\.(?:md|docx|pdf)$/i.test(entry))).toBe(false);
    expect(files.some((entry) => /outputs[\\/](?:exports|variants)/.test(entry))).toBe(false);
  });
});

async function planningFixture(options: { includeNotAssessed?: boolean; verifiedMetric?: boolean } = {}) {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-role-plan-"));
  const created = await createRoleTarget(workspace, { title: "Engineering Manager" }, { now: () => new Date(FIRST_TIME) });
  await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  const roleProfilePath = path.join(workspace, "role-profiles", "engineering-manager.json");
  const definitions = [
    ["platform-delivery", "Lead platform delivery across teams.", "leadership", "required", "critical"],
    ["stakeholder-alignment", "Coordinate stakeholders and delivery decisions.", "responsibility", "required", "high"],
    ["technical-tradeoffs", "Evaluate technical tradeoffs across a compound platform scope.", "technical-skill", "required", "medium"],
    ["coaching-system", "Establish a specific engineering coaching system.", "leadership", "preferred", "medium"],
    ["scope-consistency", "Maintain consistent delivery scope and accountability.", "capability", "contextual", "high"],
    ["platform-domain", "Apply platform domain context.", "domain-knowledge", "contextual", "low"],
    ...(options.includeNotAssessed
      ? [["unassessed", "Demonstrate another reviewed capability.", "capability", "unknown", "unknown"]]
      : []),
  ] as Array<[string, string, RoleProfile["expectations"][number]["kind"], "required" | "preferred" | "contextual" | "unknown", "critical" | "high" | "medium" | "low" | "unknown"]>;
  const roleProfile: RoleProfile = {
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
  await writeJsonAtomic(roleProfilePath, roleProfile);
  await interpretTarget(workspace, created.target.id, { roleProfile: roleProfilePath, now: () => new Date(FIRST_TIME) });
  await approveTargetInterpretation(workspace, created.target.id);
  const approved = await showApprovedTargetInterpretation(workspace, created.target.id);
  const metricIndex = options.verifiedMetric
    ? approved.expectations.findIndex((entry) => entry.statement.startsWith("Lead platform delivery"))
    : -1;
  await writeEvidenceKb(workspace, approved.expectations.length, metricIndex);
  await writeMatchingPattern(workspace, created.target.id, options.includeNotAssessed ?? false);
  await buildFitAssessment(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  await promoteDeterministicAssessment(workspace, created.target.id);
  return { workspace, targetId: created.target.id };
}

async function approveTargetInterpretation(workspace: string, targetId: string): Promise<void> {
  const payload: ModelInterpretationPayload = {
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

async function writeEvidenceKb(workspace: string, count: number, verifiedMetricIndex: number): Promise<void> {
  const sources: Source[] = [];
  const evidence: EvidenceItem[] = [];
  const claims: Claim[] = [];
  for (let index = 0; index < count; index += 1) {
    const sourceId = `src_plan_${index}`;
    const evidenceId = `evi_plan_${index}`;
    const claimId = `claim_plan_${index}`;
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
      category: index === 2 ? "project" : index === 5 ? "certification" : index === 0 ? "role" : "responsibility",
      text: `Reviewed role evidence for expectation ${index}.`,
      normalizedSummary: `Reviewed role evidence for expectation ${index}.`,
      sourceSection: index === 2 ? "Selected Projects" : "Professional Experience",
      technologies: index === 2 ? ["TypeScript"] : [],
      domains: ["platform"],
      visibility: "public",
      sensitivityFlags: [],
      confidence: "high",
    });
    claims.push({
      id: claimId,
      claim: `Reviewed role evidence for expectation ${index}.`,
      approvedWording: `Reviewed role evidence for expectation ${index}.`,
      type: "responsibility_claim",
      supportingEvidenceIds: [evidenceId],
      sourceSection: "Professional Experience",
      extractionConfidence: "high",
      factualConfidence: "high",
      corroborationLevel: "manual_approved",
      approvalStatus: "approved",
      outputReadiness: "resume_ready",
      confidence: "high",
      publicSafe: true,
      needsConfirmation: false,
      metricStatus: index === verifiedMetricIndex ? "verified_metric" : "no_metric",
      unsafeWording: [],
    });
  }
  await writeJsonAtomic(path.join(workspace, "kb/sources.json"), sources);
  await writeJsonAtomic(path.join(workspace, "kb/evidence-items.json"), evidence);
  await writeJsonAtomic(path.join(workspace, "kb/claims.json"), claims);
}

async function writeMatchingPattern(workspace: string, targetId: string, includeNotAssessed: boolean): Promise<void> {
  const context = await loadMatchingContext(workspace, targetId, { persistSnapshot: true, now: () => new Date(FIRST_TIME) });
  const matches: EvidenceMatch[] = [];
  const explicit = new Map<string, "unsupported" | "not-assessed">();
  context.eligibleExpectations.forEach((expectation, index) => {
    const evidence = context.snapshot.entries[index];
    if (!evidence) throw new Error(`Missing evidence fixture at index ${index}`);
    if (expectation.statement.startsWith("Lead platform delivery")) matches.push(matchFixture(context, expectation.id, evidence.evidenceId, "strong", "direct", "full", "strong", "current", "high"));
    else if (expectation.statement.startsWith("Coordinate stakeholders")) matches.push(matchFixture(context, expectation.id, evidence.evidenceId, "adequate", "direct", "full", "medium", "recent", "medium"));
    else if (expectation.statement.startsWith("Evaluate technical tradeoffs")) matches.push(matchFixture(context, expectation.id, evidence.evidenceId, "partial", "partial", "partial", "medium", "current", "medium"));
    else if (expectation.statement.startsWith("Establish a specific")) explicit.set(expectation.id, "unsupported");
    else if (expectation.statement.startsWith("Maintain consistent")) matches.push(matchFixture(context, expectation.id, evidence.evidenceId, "conflict", "contradictory", "conflicting", "strong", "current", "high"));
    else if (expectation.statement.startsWith("Apply platform domain")) matches.push(matchFixture(context, expectation.id, evidence.evidenceId, "historical", "direct", "full", "medium", "historical", "medium"));
    else if (includeNotAssessed) explicit.set(expectation.id, "not-assessed");
    else explicit.set(expectation.id, "unsupported");
  });
  await writeApprovedMatching(workspace, context, matches, explicit, {}, { now: () => new Date(FIRST_TIME) });
}

function matchFixture(
  context: Awaited<ReturnType<typeof loadMatchingContext>>,
  expectationId: string,
  evidenceId: string,
  suffix: string,
  matchType: EvidenceMatch["matchType"],
  coverage: EvidenceMatch["coverage"],
  evidenceStrength: EvidenceMatch["evidenceStrength"],
  temporalRelevance: EvidenceMatch["temporalRelevance"],
  matchConfidence: EvidenceMatch["matchConfidence"],
): EvidenceMatch {
  const expectation = context.eligibleExpectations.find((entry) => entry.id === expectationId)!;
  const evidence = context.snapshot.entries.find((entry) => entry.evidenceId === evidenceId)!;
  return {
    id: `${manualMatchId(context.target.id, expectationId, [evidenceId], matchType)}-${suffix}`,
    expectationId,
    evidenceIds: [evidenceId],
    matchType,
    coverage,
    evidenceStrength,
    temporalRelevance,
    rationale: matchType === "contradictory"
      ? "Reviewed evidence explicitly conflicts with this expectation."
      : "Reviewed evidence supports this expectation within the listed limits.",
    expectationProvenance: expectationProvenance(context, expectation),
    evidenceProvenance: [evidence.provenance],
    trustState: "manual-approved",
    interpretation: {
      method: "manual",
      matcherName: "target-evidence-matcher",
      matcherVersion: "1",
      policyVersion: "1",
    },
    matchConfidence,
    limitations: matchType === "direct"
      ? []
      : [matchType === "contradictory" ? "Reviewed evidence conflicts." : "Only part of the expectation is covered."],
    notes: [],
  };
}

async function promoteDeterministicAssessment(workspace: string, targetId: string): Promise<void> {
  const context = await loadAssessmentContext(workspace, targetId);
  const target = await showTarget(workspace, targetId);
  const assessment = await showFitAssessment(workspace, targetId);
  const paths = assessmentPaths(workspace, target, "approved");
  await writeJsonAtomic(paths.assessmentPath, assessment);
  const manifest = createAssessmentManifest(
    assessment,
    context,
    paths.assessmentRelativePath,
    await hashFile(paths.assessmentPath),
    "approved",
    assessment.createdAt,
    assessment.updatedAt,
  );
  await writeJsonAtomic(paths.manifestPath, manifest);
}

async function modelPayload(workspace: string, targetId: string): Promise<ModelRoleResumePlanPayload> {
  const plan = await showRoleResumePlan(workspace, targetId);
  return structuredClone({
    positioning: plan.positioning,
    sections: plan.sections,
    expectationSelections: plan.expectationSelections,
    evidenceSelections: plan.evidenceSelections,
    claimBoundaries: plan.claimBoundaries,
    exclusions: plan.exclusions,
    warnings: plan.warnings,
    ambiguities: plan.ambiguities,
  });
}

async function proposalFixture() {
  const fixture = await planningFixture();
  await buildRoleResumePlan(fixture.workspace, fixture.targetId);
  const provider = new FakeInterpretationModelProvider(JSON.stringify(await modelPayload(fixture.workspace, fixture.targetId)));
  const generated = await generateRoleResumePlanProposal(fixture.workspace, fixture.targetId, {
    provider,
    now: () => new Date(FIRST_TIME),
  });
  const proposal = await showRoleResumePlanProposal(fixture.workspace, generated.proposalId);
  return { ...fixture, provider, generated, proposal };
}

async function completedReviewFixture() {
  const fixture = await proposalFixture();
  const review = await initializeRoleResumePlanReview(fixture.workspace, fixture.generated.proposalId, {
    reviewerName: "Reviewer",
    now: () => new Date(FIRST_TIME),
  });
  const positioning = review.decisions.find((entry) => entry.itemType === "positioning")!;
  const section = review.decisions.find((entry) => entry.itemType === "section")!;
  const sectionValue = fixture.proposal.proposedPlan!.sections.find((entry) => entry.id === section.itemId)!;
  await setRoleResumePlanReviewDecision(fixture.workspace, fixture.generated.proposalId, "positioning", positioning.itemId, { decision: "accept" });
  await setRoleResumePlanReviewDecision(fixture.workspace, fixture.generated.proposalId, "section", section.itemId, {
    decision: "edit",
    editedValue: { ...sectionValue, emphasisNotes: ["Emphasize only reviewed role-planning evidence."] },
  });
  for (const decision of review.decisions.filter((entry) => ![
    `positioning:${positioning.itemId}`,
    `section:${section.itemId}`,
  ].includes(`${entry.itemType}:${entry.itemId}`))) {
    await setRoleResumePlanReviewDecision(fixture.workspace, fixture.generated.proposalId, decision.itemType, decision.itemId, { decision: "reject" });
  }
  await completeRoleResumePlanReview(fixture.workspace, fixture.generated.proposalId, { now: () => new Date(SECOND_TIME) });
  expect((await getRoleResumePlanReviewStatus(fixture.workspace, fixture.generated.proposalId)).status).toBe("completed");
  return fixture;
}

async function upstreamHashes(workspace: string, targetId: string) {
  const target = await showTarget(workspace, targetId);
  const context = await loadAssessmentContext(workspace, targetId);
  const files = [
    `targets/roles/${target.id}/target.json`,
    context.approvedInterpretationPath,
    context.approvedInterpretationManifestPath,
    context.approvedMatchingPath,
    context.approvedMatchingManifestPath,
    assessmentPaths(workspace, target, "approved").assessmentRelativePath,
    assessmentPaths(workspace, target, "approved").manifestRelativePath,
    "kb/sources.json",
    "kb/evidence-items.json",
    "kb/claims.json",
  ];
  return Object.fromEntries(await Promise.all(files.map(async (file) => [file, await hashFile(path.join(workspace, file))])));
}

async function allFiles(root: string): Promise<string[]> {
  const { readdir } = await import("node:fs/promises");
  const result: string[] = [];
  async function walk(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile()) result.push(absolute);
    }
  }
  await walk(root);
  return result.sort();
}

function decisionCounts(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

class CapturingFakeProvider implements InterpretationModelProvider {
  private readonly delegate: FakeInterpretationModelProvider;
  readonly providerId: string;
  readonly identity: FakeInterpretationModelProvider["identity"];
  readonly settings: FakeInterpretationModelProvider["settings"];
  lastPrompt = "";

  constructor(rawText: string) {
    this.delegate = new FakeInterpretationModelProvider(rawText);
    this.providerId = this.delegate.providerId;
    this.identity = this.delegate.identity;
    this.settings = this.delegate.settings;
  }

  get callCount() {
    return this.delegate.callCount;
  }

  async generate(request: ModelInterpretationRequest) {
    this.lastPrompt = request.renderedPrompt;
    return this.delegate.generate();
  }
}
