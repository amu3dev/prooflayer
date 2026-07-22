import { mkdtemp, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  approveInterpretationProposal,
  getApprovedInterpretationStatus,
  showApprovedTargetInterpretation,
} from "../approved-interpretation.js";
import {
  FakeInterpretationModelProvider,
  OpenAICompatibleInterpretationModelProvider,
  loadModelProviderConfiguration,
} from "../model-provider.js";
import { analyzeTarget, showTargetAnalysis } from "../target-analysis.js";
import { interpretTarget, showTargetInterpretation } from "../target-interpretation.js";
import {
  PROPOSAL_POLICY_VERSION,
  PROPOSAL_PROMPT_TEMPLATE_ID,
  PROPOSAL_PROMPT_TEMPLATE_VERSION,
  generateInterpretationProposal,
  getInterpretationProposalStatus,
  proposalFileTimestamps,
  replayInterpretationProposal,
  showInterpretationProposal,
} from "../target-proposal.js";
import {
  completeProposalReview,
  getProposalReviewStatus,
  initializeProposalReview,
  setProposalReviewDecision,
  showProposalReview,
} from "../target-proposal-review.js";
import { createJobTarget, createRoleTarget } from "../targets.js";
import { hashFile, writeJsonAtomic } from "../fs-utils.js";
import type {
  EditedTargetExpectation,
  ModelInterpretationPayload,
  RoleProfile,
  TargetAnalysis,
  TargetInterpretation,
} from "../schemas.js";

const FIRST_TIME = "2026-07-21T10:00:00.000Z";
const SECOND_TIME = "2026-07-21T11:00:00.000Z";
const SECRET = "secret-key-that-must-not-be-persisted";

describe("Slice 2.3B model-assisted proposal and review", () => {
  it("validates provider configuration without requiring network access", () => {
    expect(() => loadModelProviderConfiguration({})).toThrow("PROOFLAYER_MODEL_PROVIDER");
    expect(() => loadModelProviderConfiguration({
      PROOFLAYER_MODEL_PROVIDER: "openai-compatible",
      PROOFLAYER_MODEL_NAME: "test-model",
    })).toThrow("PROOFLAYER_MODEL_BASE_URL");
    expect(loadModelProviderConfiguration({
      PROOFLAYER_MODEL_PROVIDER: "openai-compatible",
      PROOFLAYER_MODEL_NAME: "test-model",
      PROOFLAYER_MODEL_BASE_URL: "http://127.0.0.1:9999/v1",
      PROOFLAYER_MODEL_TIMEOUT_MS: "1000",
      PROOFLAYER_MODEL_API_KEY: SECRET,
    })).toMatchObject({ providerId: "openai-compatible", model: "test-model", timeoutMs: 1000 });
  });

  it("generates a valid Job proposal with prompt, source, and raw-response provenance", async () => {
    const fixture = await jobFixture();
    const payload = await validPayload(fixture.workspace, fixture.targetId);
    const raw = JSON.stringify(payload);
    const provider = new FakeInterpretationModelProvider(raw);
    const result = await generateInterpretationProposal(fixture.workspace, fixture.targetId, {
      provider,
      now: () => new Date(FIRST_TIME),
    });
    expect(result.result).toBe("created");
    expect(provider.callCount).toBe(1);
    const proposal = await showInterpretationProposal(fixture.workspace, result.proposalId);
    expect(proposal).toMatchObject({
      status: "ready-for-review",
      prompt: {
        templateId: PROPOSAL_PROMPT_TEMPLATE_ID,
        templateVersion: PROPOSAL_PROMPT_TEMPLATE_VERSION,
        policyVersion: PROPOSAL_POLICY_VERSION,
      },
    });
    expect(proposal.proposedExpectations).toHaveLength(3);
    expect(proposal.proposedExpectations.every((entry) => entry.trustState === "proposed")).toBe(true);
    expect(await readFile(path.join(fixture.workspace, proposal.rawResponsePath), "utf8")).toBe(raw);
    expect(await hashFile(path.join(fixture.workspace, proposal.rawResponsePath))).toBe(proposal.rawResponseSha256);
    expect((await getInterpretationProposalStatus(fixture.workspace, result.proposalId)).readyForReview).toBe(true);
  });

  it("supports Role proposals only when a reviewed Role Profile backs deterministic interpretation", async () => {
    const fixture = await roleFixture(true);
    const payload = await validPayload(fixture.workspace, fixture.targetId);
    const result = await generateInterpretationProposal(
      fixture.workspace,
      fixture.targetId,
      { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)) },
    );
    expect((await showInterpretationProposal(fixture.workspace, result.proposalId)).targetType).toBe("role");

    const missingProfile = await roleFixture(false);
    await expect(generateInterpretationProposal(
      missingProfile.workspace,
      missingProfile.targetId,
      { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)) },
    )).rejects.toThrow("requires a current deterministic interpretation backed by a Role Profile");
  });

  it("keeps compound split statements unsimplified by the engine and preserves source IDs", async () => {
    const fixture = await jobFixture();
    const payload = await validPayload(fixture.workspace, fixture.targetId);
    const result = await generateInterpretationProposal(
      fixture.workspace,
      fixture.targetId,
      { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)) },
    );
    const proposal = await showInterpretationProposal(fixture.workspace, result.proposalId);
    expect(proposal.proposedExpectations.slice(0, 2).map((entry) => entry.operation)).toEqual(["split", "split"]);
    expect(proposal.proposedExpectations[0].sourceAnalysisItemIds).toEqual(payload.proposedExpectations[0].sourceAnalysisItemIds);
    expect(proposal.proposedExpectations[0].statement).toBe(payload.proposedExpectations[0].statement);
    expect(proposal.proposedExpectations[2]).toMatchObject({
      kind: "qualification",
      importance: "high",
      capabilityTags: ["platform-delivery"],
      explicitness: "strongly-implied",
    });
  });

  it("returns cache-hit without calling the provider or rewriting artifacts", async () => {
    const fixture = await jobFixture();
    const payload = await validPayload(fixture.workspace, fixture.targetId);
    const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
    const first = await generateInterpretationProposal(fixture.workspace, fixture.targetId, {
      provider,
      now: () => new Date(FIRST_TIME),
    });
    const before = await proposalFileTimestamps(fixture.workspace, first.proposalId);
    const second = await generateInterpretationProposal(fixture.workspace, fixture.targetId, {
      provider,
      now: () => new Date(SECOND_TIME),
    });
    expect(second.result).toBe("cache-hit");
    expect(second.proposalId).toBe(first.proposalId);
    expect(provider.callCount).toBe(1);
    expect(await proposalFileTimestamps(fixture.workspace, first.proposalId)).toEqual(before);
  });

  it("refresh and fingerprint input changes create new proposals", async () => {
    const fixture = await jobFixture();
    const payload = await validPayload(fixture.workspace, fixture.targetId);
    const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
    const first = await generateInterpretationProposal(fixture.workspace, fixture.targetId, {
      provider,
      now: () => new Date(FIRST_TIME),
    });
    const refreshed = await generateInterpretationProposal(fixture.workspace, fixture.targetId, {
      provider,
      refresh: true,
      now: () => new Date(SECOND_TIME),
    });
    expect(refreshed.proposalId).not.toBe(first.proposalId);
    expect(provider.callCount).toBe(2);

    const changedSettings = new FakeInterpretationModelProvider(JSON.stringify(payload), {
      settings: { temperature: 0.2, maxOutputTokens: 4096, responseFormat: "json_object" },
    });
    const settingsResult = await generateInterpretationProposal(fixture.workspace, fixture.targetId, {
      provider: changedSettings,
    });
    expect(settingsResult.result).toBe("created");
    expect(settingsResult.requestFingerprint).not.toBe(first.requestFingerprint);
  });

  it("replays exact raw output without a provider call and reproduces the proposal hash", async () => {
    const fixture = await jobFixture();
    const payload = await validPayload(fixture.workspace, fixture.targetId);
    const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
    const result = await generateInterpretationProposal(fixture.workspace, fixture.targetId, { provider });
    const replay = await replayInterpretationProposal(fixture.workspace, result.proposalId);
    expect(replay.matches).toBe(true);
    expect(replay.replaySha256).toBe(replay.originalSha256);
    expect(provider.callCount).toBe(1);
  });

  it("preserves malformed output as validation-failed and never marks it reviewable", async () => {
    const fixture = await jobFixture();
    const result = await generateInterpretationProposal(
      fixture.workspace,
      fixture.targetId,
      { provider: new FakeInterpretationModelProvider("{not-json") },
    );
    expect(result.result).toBe("validation-failed");
    const proposal = await showInterpretationProposal(fixture.workspace, result.proposalId);
    expect(proposal.validationIssues.some((entry) => entry.code === "MALFORMED_JSON")).toBe(true);
    expect((await getInterpretationProposalStatus(fixture.workspace, result.proposalId)).status).toBe("invalid");
    await expect(initializeProposalReview(fixture.workspace, result.proposalId)).rejects.toThrow("not ready for review");
  });

  it("rejects unsupported source IDs, missing provenance, invalid tags, and unsupported enums", async () => {
    const fixture = await jobFixture();
    const payload = await validPayload(fixture.workspace, fixture.targetId);
    payload.proposedExpectations[0].sourceAnalysisItemIds = ["item_not-real"];
    const unsupported = await generateInterpretationProposal(
      fixture.workspace,
      fixture.targetId,
      { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)) },
    );
    expect((await showInterpretationProposal(fixture.workspace, unsupported.proposalId)).validationIssues)
      .toEqual(expect.arrayContaining([expect.objectContaining({ code: "UNSUPPORTED_SOURCE_ID" })]));

    const noProvenance = await validPayload(fixture.workspace, fixture.targetId) as unknown as Record<string, unknown>;
    (noProvenance.proposedExpectations as Array<Record<string, unknown>>)[0].sourceReferences = [];
    const invalidTag = await validPayload(fixture.workspace, fixture.targetId) as unknown as Record<string, unknown>;
    (invalidTag.proposedExpectations as Array<Record<string, unknown>>)[0].capabilityTags = ["Not Slug Safe"];
    const invalidEnum = await validPayload(fixture.workspace, fixture.targetId) as unknown as Record<string, unknown>;
    (invalidEnum.proposedExpectations as Array<Record<string, unknown>>)[0].importance = "urgent";
    for (const raw of [noProvenance, invalidTag, invalidEnum]) {
      const generated = await generateInterpretationProposal(
        fixture.workspace,
        fixture.targetId,
        { provider: new FakeInterpretationModelProvider(JSON.stringify(raw)), refresh: true },
      );
      expect(generated.result).toBe("validation-failed");
    }
  });

  it("rejects candidate evaluation, fit, resume, and hiring recommendation language", async () => {
    const phrases = [
      "Ahmed is a strong match.",
      "The candidate fits this role.",
      "The fit score is high.",
      "Use this wording in the resume.",
      "We should hire the candidate.",
    ];
    for (const phrase of phrases) {
      const fixture = await jobFixture();
      const payload = await validPayload(fixture.workspace, fixture.targetId);
      payload.proposedExpectations[0].rationale = phrase;
      const result = await generateInterpretationProposal(
        fixture.workspace,
        fixture.targetId,
        { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)) },
      );
      const proposal = await showInterpretationProposal(fixture.workspace, result.proposalId);
      expect(proposal.validationIssues.some((entry) => entry.code === "FORBIDDEN_CONTENT")).toBe(true);
    }
  });

  it("never persists an OpenAI-compatible API key", async () => {
    const fixture = await jobFixture();
    const payload = await validPayload(fixture.workspace, fixture.targetId);
    const transport = async () => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify(payload) }, finish_reason: "stop" }],
    }), { status: 200, headers: { "content-type": "application/json" } });
    const provider = new OpenAICompatibleInterpretationModelProvider({
      providerId: "openai-compatible",
      model: "test-model",
      baseUrl: "http://local.test/v1",
      apiKey: SECRET,
      timeoutMs: 1000,
      settings: { temperature: 0, maxOutputTokens: 4096, responseFormat: "json_object" },
    }, transport as typeof fetch);
    const result = await generateInterpretationProposal(fixture.workspace, fixture.targetId, { provider });
    const root = path.join(fixture.workspace, "targets");
    const files = await recursiveFiles(root);
    const persisted = (await Promise.all(files.map((file) => readFile(file)))).map((value) => value.toString("utf8")).join("\n");
    expect(persisted).not.toContain(SECRET);
    expect((await showInterpretationProposal(fixture.workspace, result.proposalId)).model.provider).toBe("openai-compatible");
  });

  it("initializes review decisions without mutating the proposal", async () => {
    const fixture = await proposalFixture();
    const proposalPath = path.join(fixture.workspace, fixture.proposalPath);
    const before = await readFile(proposalPath);
    const status = await initializeProposalReview(fixture.workspace, fixture.proposalId, {
      reviewerName: "Reviewer",
      now: () => new Date(FIRST_TIME),
    });
    expect(status.status).toBe("in-progress");
    expect(status.counts.pending).toBe(3);
    expect(await readFile(proposalPath)).toEqual(before);
    expect((await showProposalReview(fixture.workspace, fixture.proposalId)).reviewer.name).toBe("Reviewer");
  });

  it("supports accept, reject, and edit decisions with strict review validation", async () => {
    const fixture = await proposalFixture();
    await initializeProposalReview(fixture.workspace, fixture.proposalId);
    const proposal = await showInterpretationProposal(fixture.workspace, fixture.proposalId);
    await setProposalReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedExpectations[0].id, { decision: "accept" });
    await setProposalReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedExpectations[1].id, { decision: "reject" });
    await expect(setProposalReviewDecision(
      fixture.workspace,
      fixture.proposalId,
      proposal.proposedExpectations[0].id,
      { decision: "accept" },
    )).rejects.toThrow("already exists");
    await expect(setProposalReviewDecision(
      fixture.workspace,
      fixture.proposalId,
      "proposed_not-real",
      { decision: "accept" },
    )).rejects.toThrow("Unknown proposed expectation ID");
    await expect(setProposalReviewDecision(
      fixture.workspace,
      fixture.proposalId,
      proposal.proposedExpectations[2].id,
      { decision: "edit" },
    )).rejects.toThrow();
    await setProposalReviewDecision(
      fixture.workspace,
      fixture.proposalId,
      proposal.proposedExpectations[2].id,
      { decision: "edit", editedExpectation: editedExpectation("Reviewed platform delivery qualification.") },
    );
    const status = await completeProposalReview(fixture.workspace, fixture.proposalId);
    expect(status).toMatchObject({ status: "completed", counts: { accept: 1, reject: 1, edit: 1, pending: 0 } });
    expect(status.reviewHashMatches).toBe(true);
    expect(status.proposalHashMatches).toBe(true);
  });

  it("refuses review completion while decisions remain pending", async () => {
    const fixture = await proposalFixture();
    await initializeProposalReview(fixture.workspace, fixture.proposalId);
    await expect(completeProposalReview(fixture.workspace, fixture.proposalId)).rejects.toThrow("remain undecided");
  });

  it("approves deterministic, accepted, and edited expectations while excluding rejected items", async () => {
    const fixture = await reviewedProposalFixture();
    const deterministicPath = path.join(
      fixture.workspace,
      `targets/jobs/${fixture.targetId}/interpretation/target-interpretation.json`,
    );
    const deterministicBefore = await readFile(deterministicPath);
    const result = await approveInterpretationProposal(fixture.workspace, fixture.proposalId, {
      now: () => new Date(SECOND_TIME),
    });
    expect(result).toMatchObject({
      result: "created",
      humanApprovedCount: 1,
      humanEditedCount: 1,
      rejectedCount: 1,
    });
    const approved = await showApprovedTargetInterpretation(fixture.workspace, fixture.targetId);
    expect(approved.expectations.some((entry) => entry.trustState === "deterministic-approved")).toBe(true);
    expect(approved.expectations.some((entry) => entry.trustState === "human-approved")).toBe(true);
    expect(approved.expectations.some((entry) => entry.trustState === "human-edited" && entry.statement === "Reviewed platform delivery qualification.")).toBe(true);
    expect(approved.expectations.some((entry) => entry.statement === fixture.rejectedStatement)).toBe(false);
    expect(approved.expectations.filter((entry) => entry.approvalProvenance).every((entry) => entry.approvalProvenance?.proposalId === fixture.proposalId)).toBe(true);
    expect(await readFile(deterministicPath)).toEqual(deterministicBefore);
    expect((await getApprovedInterpretationStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
  });

  it("approval is deterministic, performs no model call, and preserves unchanged timestamps", async () => {
    const fixture = await reviewedProposalFixture();
    const first = await approveInterpretationProposal(fixture.workspace, fixture.proposalId, { now: () => new Date(FIRST_TIME) });
    const approvedPath = path.join(fixture.workspace, first.interpretationPath);
    const manifestPath = path.join(fixture.workspace, first.manifestPath);
    const [bytes, manifestBytes, approvedStat, manifestStat] = await Promise.all([
      readFile(approvedPath),
      readFile(manifestPath),
      stat(approvedPath),
      stat(manifestPath),
    ]);
    const second = await approveInterpretationProposal(fixture.workspace, fixture.proposalId, { now: () => new Date(SECOND_TIME) });
    expect(second.result).toBe("already-current");
    expect(await readFile(approvedPath)).toEqual(bytes);
    expect(await readFile(manifestPath)).toEqual(manifestBytes);
    expect((await stat(approvedPath)).mtimeMs).toBe(approvedStat.mtimeMs);
    expect((await stat(manifestPath)).mtimeMs).toBe(manifestStat.mtimeMs);
    expect(fixture.provider.callCount).toBe(1);
  });

  it("approval fails for incomplete review, stale proposal, and invalid proposal", async () => {
    const incomplete = await proposalFixture();
    await initializeProposalReview(incomplete.workspace, incomplete.proposalId);
    await expect(approveInterpretationProposal(incomplete.workspace, incomplete.proposalId)).rejects.toThrow("completed");

    const stale = await reviewedProposalFixture();
    const targetPath = path.join(stale.workspace, `targets/jobs/${stale.targetId}/target.json`);
    const target = JSON.parse(await readFile(targetPath, "utf8")) as Record<string, unknown>;
    target.location = "Changed";
    await writeFile(targetPath, `${JSON.stringify(target, null, 2)}\n`, "utf8");
    expect((await getInterpretationProposalStatus(stale.workspace, stale.proposalId)).status).toBe("stale");
    await expect(approveInterpretationProposal(stale.workspace, stale.proposalId)).rejects.toThrow("stale");

    const invalid = await jobFixture();
    const malformed = await generateInterpretationProposal(
      invalid.workspace,
      invalid.targetId,
      { provider: new FakeInterpretationModelProvider("[]") },
    );
    await expect(approveInterpretationProposal(invalid.workspace, malformed.proposalId)).rejects.toThrow("invalid");
  });

  it("uses explicit completeness metadata without candidate-fit fields", async () => {
    const missing = await roleFixture(false);
    const deterministic = await showTargetInterpretation(missing.workspace, missing.targetId);
    expect(deterministic.completeness).toEqual({
      status: "empty",
      usableForEvidenceMatching: false,
      blockingReasons: ["No reviewed Role Profile supplied deterministic expectations."],
    });
    expect(JSON.stringify(deterministic.completeness)).not.toMatch(/fit|confidence|proof/i);

    const fixture = await reviewedProposalFixture();
    await approveInterpretationProposal(fixture.workspace, fixture.proposalId);
    const approved = await showApprovedTargetInterpretation(fixture.workspace, fixture.targetId);
    expect(["partial", "complete"]).toContain(approved.completeness.status);
    expect(approved.completeness.usableForEvidenceMatching).toBe(true);
  });

  it("creates no candidate evidence, matching, fit, resume, or application outputs", async () => {
    const fixture = await reviewedProposalFixture();
    await approveInterpretationProposal(fixture.workspace, fixture.proposalId);
    expect(await directoryExists(path.join(fixture.workspace, "kb"))).toBe(false);
    expect(await directoryExists(path.join(fixture.workspace, "outputs"))).toBe(false);
    const approved = JSON.stringify(await showApprovedTargetInterpretation(fixture.workspace, fixture.targetId));
    expect(approved).not.toMatch(/fitScore|proofReadiness|candidateEvidence|strengths|weaknesses|resume/);
  });
});

async function jobFixture() {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-proposal-job-"));
  const input = path.join(workspace, "job.md");
  await writeFile(input, [
    "---",
    "title: Engineering Manager",
    "company: ExampleCo",
    "---",
    "## Responsibilities",
    "- Lead the engineering team, mentor managers, and improve delivery predictability.",
    "## Required Qualifications",
    "- Experience delivering platform products across API and web surfaces.",
    "## Company",
    "A product company.",
    "",
  ].join("\n"), "utf8");
  const created = await createJobTarget(workspace, { file: input }, { now: () => new Date(FIRST_TIME) });
  await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  await interpretTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  return { workspace, targetId: created.target.id };
}

async function roleFixture(withProfile: boolean) {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-proposal-role-"));
  const created = await createRoleTarget(workspace, { title: "Engineering Manager" }, { now: () => new Date(FIRST_TIME) });
  await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  let roleProfile: string | undefined;
  if (withProfile) {
    roleProfile = path.join(workspace, "role-profiles", "engineering-manager.json");
    const profile: RoleProfile = {
      schemaVersion: 1,
      id: "engineering-manager",
      title: "Engineering Manager",
      aliases: [],
      expectations: [{
        id: "lead-teams",
        kind: "leadership",
        statement: "Lead engineering teams and delivery.",
        necessity: "required",
        importance: "high",
        capabilityTags: ["people-management"],
        group: "leadership-expectations",
        notes: [],
      }],
      createdAt: FIRST_TIME,
      updatedAt: FIRST_TIME,
    };
    await writeJsonAtomic(roleProfile, profile);
  }
  await interpretTarget(workspace, created.target.id, {
    ...(roleProfile ? { roleProfile } : {}),
    now: () => new Date(FIRST_TIME),
  });
  return { workspace, targetId: created.target.id };
}

async function validPayload(workspace: string, targetId: string): Promise<ModelInterpretationPayload> {
  const analysis = await showTargetAnalysis(workspace, targetId);
  const interpretation = await showTargetInterpretation(workspace, targetId);
  if (analysis.targetType === "role") return rolePayload(interpretation);
  const responsibility = analysis.items.find((item) => item.kind === "list-item" && item.category === "responsibility");
  const qualification = analysis.items.find((item) => item.kind === "list-item" && item.category === "qualification");
  if (!responsibility || !qualification) throw new Error("Test fixture lacks required items.");
  const responsibilityExpectation = interpretation.expectations.find((entry) => entry.sourceAnalysisItemIds.includes(responsibility.id));
  const qualificationExpectation = interpretation.expectations.find((entry) => entry.sourceAnalysisItemIds.includes(qualification.id));
  if (!responsibilityExpectation || !qualificationExpectation) throw new Error("Test fixture lacks deterministic expectations.");
  return {
    proposedExpectations: [
      {
        operation: "split",
        sourceExpectationIds: [responsibilityExpectation.id],
        sourceAnalysisItemIds: [responsibility.id],
        sourceReferences: responsibility.sourceReferences,
        kind: "leadership",
        statement: "Lead the engineering team.",
        necessity: "contextual",
        importance: "critical",
        explicitness: "explicit",
        capabilityTags: ["people-management"],
        interpretationConfidence: "high",
        rationale: "The source explicitly assigns team leadership.",
        ambiguityNotes: [],
      },
      {
        operation: "split",
        sourceExpectationIds: [responsibilityExpectation.id],
        sourceAnalysisItemIds: [responsibility.id],
        sourceReferences: responsibility.sourceReferences,
        kind: "success-outcome",
        statement: "Improve delivery predictability.",
        necessity: "contextual",
        importance: "high",
        explicitness: "explicit",
        capabilityTags: ["delivery-management"],
        interpretationConfidence: "high",
        rationale: "The source explicitly names delivery predictability.",
        ambiguityNotes: [],
      },
      {
        operation: "reclassify",
        sourceExpectationIds: [qualificationExpectation.id],
        sourceAnalysisItemIds: [qualification.id],
        sourceReferences: qualification.sourceReferences,
        kind: "qualification",
        statement: qualification.statement,
        necessity: "required",
        importance: "high",
        explicitness: "strongly-implied",
        capabilityTags: ["platform-delivery"],
        interpretationConfidence: "medium",
        rationale: "The required section establishes platform delivery as a qualification.",
        ambiguityNotes: ["The source does not define a duration."],
      },
    ],
    proposedGroups: [{
      kind: "leadership-expectations",
      title: "Leadership Expectations",
      expectationIndexes: [0, 1],
      sourceReferences: responsibility.sourceReferences,
    }],
    proposedAmbiguities: [],
    warnings: [],
  };
}

function rolePayload(interpretation: TargetInterpretation): ModelInterpretationPayload {
  const source = interpretation.expectations[0];
  if (!source) throw new Error("Role fixture lacks a deterministic expectation.");
  return {
    proposedExpectations: [{
      operation: "enrich",
      sourceExpectationIds: [source.id],
      sourceAnalysisItemIds: [],
      sourceReferences: source.sourceReferences,
      kind: "leadership",
      statement: source.statement,
      necessity: source.necessity,
      importance: source.importance,
      explicitness: "explicit",
      capabilityTags: ["people-management"],
      interpretationConfidence: "high",
      rationale: "The reviewed Role Profile explicitly defines this expectation.",
      ambiguityNotes: [],
    }],
    proposedGroups: [],
    proposedAmbiguities: [],
    warnings: [],
  };
}

async function proposalFixture() {
  const fixture = await jobFixture();
  const payload = await validPayload(fixture.workspace, fixture.targetId);
  const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
  const generated = await generateInterpretationProposal(fixture.workspace, fixture.targetId, {
    provider,
    now: () => new Date(FIRST_TIME),
  });
  return { ...fixture, provider, proposalId: generated.proposalId, proposalPath: generated.proposalPath };
}

async function reviewedProposalFixture() {
  const fixture = await proposalFixture();
  await initializeProposalReview(fixture.workspace, fixture.proposalId, { now: () => new Date(FIRST_TIME) });
  const proposal = await showInterpretationProposal(fixture.workspace, fixture.proposalId);
  await setProposalReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedExpectations[0].id, { decision: "accept" });
  await setProposalReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedExpectations[1].id, { decision: "reject" });
  await setProposalReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedExpectations[2].id, {
    decision: "edit",
    editedExpectation: editedExpectation("Reviewed platform delivery qualification."),
  });
  await completeProposalReview(fixture.workspace, fixture.proposalId);
  return { ...fixture, rejectedStatement: proposal.proposedExpectations[1].statement };
}

function editedExpectation(statement: string): EditedTargetExpectation {
  return {
    kind: "qualification",
    statement,
    necessity: "required",
    importance: "high",
    explicitness: "explicit",
    capabilityTags: ["platform-delivery"],
    interpretationConfidence: "high",
    notes: ["Reviewed by a human."],
  };
}

async function recursiveFiles(root: string): Promise<string[]> {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(root, entry.name);
    return entry.isDirectory() ? recursiveFiles(target) : [target];
  }));
  return nested.flat();
}

async function directoryExists(target: string): Promise<boolean> {
  try {
    return (await stat(target)).isDirectory();
  } catch {
    return false;
  }
}
