import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  approveEvidenceMatchProposal,
} from "../approved-evidence-matching.js";
import {
  approveInterpretationProposal,
} from "../approved-interpretation.js";
import {
  addManualEvidenceMatch,
  calculateEvidenceSnapshot,
  coverageId,
  deriveCoverage,
  expectationProvenance,
  getApprovedEvidenceMatchingStatus,
  listManualEvidenceMatches,
  loadMatchingContext,
  manualMatchId,
  matchingCompleteness,
  removeManualEvidenceMatch,
  showApprovedEvidenceMatching,
} from "../evidence-matching.js";
import {
  generateEvidenceMatchProposal,
  getEvidenceMatchProposalStatus,
  matchProposalFileTimestamps,
  renderEvidenceMatchPrompt,
  replayEvidenceMatchProposal,
  showEvidenceMatchProposal,
} from "../evidence-match-proposal.js";
import {
  completeEvidenceMatchReview,
  getEvidenceMatchReviewStatus,
  initializeEvidenceMatchReview,
  setEvidenceCoverageReviewDecision,
  setEvidenceMatchReviewDecision,
  showEvidenceMatchReview,
} from "../evidence-match-review.js";
import { hashFile, hashText, writeJsonAtomic } from "../fs-utils.js";
import { FakeInterpretationModelProvider } from "../model-provider.js";
import type {
  Claim,
  EditedEvidenceMatch,
  EvidenceItem,
  EvidenceMatch,
  ModelEvidenceMatchPayload,
  ModelInterpretationPayload,
  RoleProfile,
  Source,
} from "../schemas.js";
import { analyzeTarget } from "../target-analysis.js";
import { interpretTarget, showTargetInterpretation } from "../target-interpretation.js";
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
import { createJobTarget, createRoleTarget } from "../targets.js";

const FIRST_TIME = "2026-07-22T10:00:00.000Z";
const SECOND_TIME = "2026-07-22T11:00:00.000Z";

describe("Slice 2.4 evidence matching", () => {
  it("loads only current approved expectations and globally reviewed active public evidence", async () => {
    const fixture = await roleMatchingFixture();
    const context = await loadMatchingContext(fixture.workspace, fixture.targetId);
    expect(context.eligibleExpectations.length).toBeGreaterThan(0);
    expect(context.eligibleExpectations.every((entry) => ["deterministic-approved", "human-approved", "human-edited"].includes(entry.trustState))).toBe(true);
    expect(context.snapshot.eligibleEvidenceIds).toEqual([fixture.evidenceId]);
    expect(context.snapshot.entries[0]).toMatchObject({ active: true, reviewed: true });
  });

  it("excludes unreviewed, inactive, private, and job-description evidence", async () => {
    const fixture = await roleMatchingFixture();
    const sources = JSON.parse(await readFile(path.join(fixture.workspace, "kb/sources.json"), "utf8")) as Source[];
    const evidence = JSON.parse(await readFile(path.join(fixture.workspace, "kb/evidence-items.json"), "utf8")) as EvidenceItem[];
    const claims = JSON.parse(await readFile(path.join(fixture.workspace, "kb/claims.json"), "utf8")) as Claim[];
    sources.push(
      sourceFixture({ id: "src_private", path: "sources/markdown/private.md", visibility: "private" }),
      sourceFixture({ id: "src_inactive", path: "sources/markdown/inactive.md", status: "ignored" }),
      sourceFixture({ id: "src_job", path: "sources/jobs/job.md", type: "job_description" }),
    );
    evidence.push(
      evidenceFixture({ id: "evi_unreviewed" }),
      evidenceFixture({ id: "evi_private", sourceIds: ["src_private"] }),
      evidenceFixture({ id: "evi_inactive", sourceIds: ["src_inactive"] }),
      evidenceFixture({ id: "evi_job", sourceIds: ["src_job"] }),
    );
    claims.push(
      claimFixture({ id: "claim_private", supportingEvidenceIds: ["evi_private"] }),
      claimFixture({ id: "claim_inactive", supportingEvidenceIds: ["evi_inactive"] }),
      claimFixture({ id: "claim_job", supportingEvidenceIds: ["evi_job"] }),
    );
    await writeJsonAtomic(path.join(fixture.workspace, "kb/sources.json"), sources);
    await writeJsonAtomic(path.join(fixture.workspace, "kb/evidence-items.json"), evidence);
    await writeJsonAtomic(path.join(fixture.workspace, "kb/claims.json"), claims);
    expect((await calculateEvidenceSnapshot(fixture.workspace)).eligibleEvidenceIds).toEqual([fixture.evidenceId]);
  });

  it("keeps evidence snapshot identity stable and changes it with evidence or review state", async () => {
    const fixture = await roleMatchingFixture();
    const first = await calculateEvidenceSnapshot(fixture.workspace, () => new Date(FIRST_TIME));
    const second = await calculateEvidenceSnapshot(fixture.workspace, () => new Date(SECOND_TIME));
    expect(second.eligibleEvidenceSetSha256).toBe(first.eligibleEvidenceSetSha256);
    const evidencePath = path.join(fixture.workspace, "kb/evidence-items.json");
    const evidence = JSON.parse(await readFile(evidencePath, "utf8")) as EvidenceItem[];
    evidence[0].normalizedSummary = "Changed reviewed platform delivery evidence.";
    await writeJsonAtomic(evidencePath, evidence);
    expect((await calculateEvidenceSnapshot(fixture.workspace)).eligibleEvidenceSetSha256).not.toBe(first.eligibleEvidenceSetSha256);
    const claimsPath = path.join(fixture.workspace, "kb/claims.json");
    const claims = JSON.parse(await readFile(claimsPath, "utf8")) as Claim[];
    claims[0] = { ...claims[0], approvalStatus: "needs_confirmation", outputReadiness: "generic_only", publicSafe: false, needsConfirmation: true };
    await writeJsonAtomic(claimsPath, claims);
    expect((await calculateEvidenceSnapshot(fixture.workspace)).eligibleEvidenceIds).toEqual([]);
  });

  it.each([
    ["direct", "full", []],
    ["supporting", "partial", ["Support is indirect."]],
    ["partial", "partial", ["Only part of the expectation is shown."]],
    ["contradictory", "conflicting", ["Reviewed evidence explicitly conflicts."]],
  ] as const)("adds a valid %s manual match with provenance and stable identity", async (matchType, coverage, limitations) => {
    const fixture = await roleMatchingFixture();
    const context = await loadMatchingContext(fixture.workspace, fixture.targetId);
    const expectationId = context.eligibleExpectations[0].id;
    const result = await addManualEvidenceMatch(fixture.workspace, fixture.targetId, {
      expectationId,
      evidenceIds: [fixture.evidenceId],
      matchType,
      coverage,
      evidenceStrength: "strong",
      temporalRelevance: "current",
      matchConfidence: "high",
      rationale: matchType === "contradictory" ? "Reviewed evidence explicitly conflicts with this expectation." : "Reviewed evidence links directly to this expectation.",
      limitations: [...limitations],
    }, { now: () => new Date(FIRST_TIME) });
    expect(result.match.id).toBe(manualMatchId(fixture.targetId, expectationId, [fixture.evidenceId], matchType));
    expect(result.match).toMatchObject({ trustState: "manual-approved", expectationId, evidenceIds: [fixture.evidenceId] });
    expect(result.match.expectationProvenance.approvedInterpretationSha256).toBe(context.approvedInterpretationSha256);
    expect(result.match.evidenceProvenance[0].reviewedStatus).toBe("approved");
  });

  it("rejects missing rationale, unknown IDs, ineligible evidence, and duplicate manual links", async () => {
    const fixture = await roleMatchingFixture();
    const context = await loadMatchingContext(fixture.workspace, fixture.targetId);
    const base = manualInput(context.eligibleExpectations[0].id, fixture.evidenceId);
    await expect(addManualEvidenceMatch(fixture.workspace, fixture.targetId, { ...base, rationale: " " })).rejects.toThrow("rationale");
    await expect(addManualEvidenceMatch(fixture.workspace, fixture.targetId, { ...base, expectationId: "expectation_missing" })).rejects.toThrow("Unknown or ineligible expectation");
    await expect(addManualEvidenceMatch(fixture.workspace, fixture.targetId, { ...base, evidenceIds: ["evi_missing"] })).rejects.toThrow("unknown or ineligible evidence");
    await addManualEvidenceMatch(fixture.workspace, fixture.targetId, base);
    await expect(addManualEvidenceMatch(fixture.workspace, fixture.targetId, base)).rejects.toThrow("Duplicate manual match");
  });

  it("preserves removal auditability with a tombstone", async () => {
    const fixture = await roleMatchingFixture();
    const context = await loadMatchingContext(fixture.workspace, fixture.targetId);
    const created = await addManualEvidenceMatch(fixture.workspace, fixture.targetId, manualInput(context.eligibleExpectations[0].id, fixture.evidenceId));
    await removeManualEvidenceMatch(fixture.workspace, created.match.id, { reason: "Superseded reviewed link." });
    expect(await listManualEvidenceMatches(fixture.workspace, fixture.targetId)).toEqual([]);
    const raw = await readFile(path.join(fixture.workspace, `targets/roles/${fixture.targetId}/matching/manual/target-evidence-matching.json`), "utf8");
    expect(raw).toContain(created.match.id);
    expect(raw).toContain("Superseded reviewed link.");
  });

  it("derives conservative coverage without numeric fit output", async () => {
    const fixture = await roleMatchingFixture();
    const context = await loadMatchingContext(fixture.workspace, fixture.targetId);
    const expectation = context.eligibleExpectations[0];
    const provenance = expectationProvenance(context, expectation);
    const direct = matchFixture(fixture.targetId, expectation.id, fixture.evidenceId, context, provenance, "direct", "full");
    expect(deriveCoverage(fixture.targetId, [expectation], [direct])[0].status).toBe("matched");
    expect(deriveCoverage(fixture.targetId, [expectation], [{ ...direct, matchType: "supporting", coverage: "partial", limitations: ["Indirect."] }])[0].status).toBe("partially-matched");
    expect(deriveCoverage(fixture.targetId, [expectation], [], new Map([[expectation.id, "unsupported"]]))[0].status).toBe("unsupported");
    expect(deriveCoverage(fixture.targetId, [expectation], [matchFixture(fixture.targetId, expectation.id, fixture.evidenceId, context, provenance, "contradictory", "conflicting")])[0].status).toBe("conflicting");
    const notAssessed = deriveCoverage(fixture.targetId, [expectation], []);
    expect(notAssessed[0].status).toBe("not-assessed");
    expect(matchingCompleteness(notAssessed)).toMatchObject({ status: "empty", usableForFitAssessment: false });
    expect(JSON.stringify(notAssessed)).not.toMatch(/fitScore|percentage|proofReadiness/i);
    expect(notAssessed[0].id).toBe(coverageId(fixture.targetId, expectation.id));
  });

  it("generates role match proposals with exact provenance, cache, refresh, and replay", async () => {
    const fixture = await roleMatchingFixture();
    const payload = await validMatchPayload(fixture.workspace, fixture.targetId);
    const raw = JSON.stringify(payload);
    const provider = new FakeInterpretationModelProvider(raw);
    const first = await generateEvidenceMatchProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(FIRST_TIME) });
    const before = await matchProposalFileTimestamps(fixture.workspace, first.proposalId);
    const cached = await generateEvidenceMatchProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(SECOND_TIME) });
    expect(cached.result).toBe("cache-hit");
    expect(cached.proposalId).toBe(first.proposalId);
    expect(provider.callCount).toBe(1);
    expect(await matchProposalFileTimestamps(fixture.workspace, first.proposalId)).toEqual(before);
    expect((await replayEvidenceMatchProposal(fixture.workspace, first.proposalId)).matches).toBe(true);
    const refreshed = await generateEvidenceMatchProposal(fixture.workspace, fixture.targetId, { provider, refresh: true, now: () => new Date(SECOND_TIME) });
    expect(refreshed.proposalId).not.toBe(first.proposalId);
    expect(provider.callCount).toBe(2);
    const proposal = await showEvidenceMatchProposal(fixture.workspace, first.proposalId);
    expect(await readFile(path.join(fixture.workspace, proposal.rawResponsePath), "utf8")).toBe(raw);
    expect(await hashFile(path.join(fixture.workspace, proposal.rawResponsePath))).toBe(proposal.rawResponseSha256);
    const context = await loadMatchingContext(fixture.workspace, fixture.targetId, { persistSnapshot: false });
    const normalizedInput = {
      target: { id: context.target.id, type: context.target.type, title: context.target.title },
      expectations: context.eligibleExpectations,
      evidence: [{
        evidenceId: fixture.evidenceId,
        evidenceType: "responsibility",
        summary: "Led platform delivery across API and web product surfaces.",
        reviewedClaims: [{ id: "claim_platform_delivery", claim: "Led platform delivery across API and web product surfaces." }],
        provenance: context.snapshot.entries[0].provenance,
      }],
      policy: { absenceIsNotContradiction: true, noCandidateFacts: true, noFitAssessment: true, noResumeLanguage: true },
    };
    expect(hashText(stableJson(normalizedInput))).toBe(proposal.input.normalizedModelInputSha256);
    expect(hashText(renderEvidenceMatchPrompt(normalizedInput))).toBe(proposal.prompt.renderedPromptSha256);
    const manifest = JSON.parse(await readFile(path.join(fixture.workspace, `targets/roles/${fixture.targetId}/matching/proposals/${first.proposalId}/proposal-manifest.json`), "utf8"));
    expect(manifest.renderedPromptSha256).toBe(proposal.prompt.renderedPromptSha256);
    expect(manifest.normalizedModelInputSha256).toBe(proposal.input.normalizedModelInputSha256);
  });

  it("supports a Job Target match proposal without coupling matching to a resume variant", async () => {
    const fixture = await jobMatchingFixture();
    const payload = await validMatchPayload(fixture.workspace, fixture.targetId);
    const result = await generateEvidenceMatchProposal(fixture.workspace, fixture.targetId, { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)) });
    expect((await showEvidenceMatchProposal(fixture.workspace, result.proposalId)).targetType).toBe("job");
  });

  it.each([
    ["unknown expectation", (payload: ModelEvidenceMatchPayload) => { payload.proposedMatches[0].expectationId = "expectation_unknown"; }, "UNKNOWN_EXPECTATION_ID"],
    ["unknown evidence", (payload: ModelEvidenceMatchPayload) => { payload.proposedMatches[0].evidenceIds = ["evi_unknown"]; }, "UNKNOWN_EVIDENCE_ID"],
    ["invented metric", (payload: ModelEvidenceMatchPayload) => { payload.proposedMatches[0].rationale = "Delivered 9000 users."; }, "INVENTED_METRIC"],
    ["fit output", (payload: ModelEvidenceMatchPayload) => { payload.proposedMatches[0].rationale = "The candidate is a strong fit."; }, "FORBIDDEN_CONTENT"],
    ["resume output", (payload: ModelEvidenceMatchPayload) => { payload.proposedMatches[0].rationale = "Use this resume bullet."; }, "FORBIDDEN_CONTENT"],
  ] as const)("rejects invalid model proposal content: %s", async (_name, mutate, issueCode) => {
    const fixture = await roleMatchingFixture();
    const payload = await validMatchPayload(fixture.workspace, fixture.targetId);
    mutate(payload);
    const result = await generateEvidenceMatchProposal(fixture.workspace, fixture.targetId, { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)) });
    const proposal = await showEvidenceMatchProposal(fixture.workspace, result.proposalId);
    expect(proposal.status).toBe("validation-failed");
    expect(proposal.validationIssues.some((issue) => issue.code === issueCode)).toBe(true);
  });

  it("handles empty and malformed provider responses without review eligibility", async () => {
    const fixture = await roleMatchingFixture();
    await expect(generateEvidenceMatchProposal(fixture.workspace, fixture.targetId, { provider: new FakeInterpretationModelProvider("") })).rejects.toThrow("empty response");
    const malformed = await generateEvidenceMatchProposal(fixture.workspace, fixture.targetId, { provider: new FakeInterpretationModelProvider("{bad") });
    expect((await getEvidenceMatchProposalStatus(fixture.workspace, malformed.proposalId)).readyForReview).toBe(false);
  });

  it("reviews accept, edit, reject, and coverage decisions without mutating the proposal", async () => {
    const fixture = await matchProposalFixture(3);
    const proposalPath = path.join(fixture.workspace, fixture.proposalPath);
    const before = await readFile(proposalPath);
    await initializeEvidenceMatchReview(fixture.workspace, fixture.proposalId, { reviewerName: "Reviewer" });
    const proposal = await showEvidenceMatchProposal(fixture.workspace, fixture.proposalId);
    const direct = proposal.proposedMatches.find((match) => match.matchType === "direct")!;
    const supporting = proposal.proposedMatches.find((match) => match.matchType === "supporting")!;
    const rejected = proposal.proposedMatches.find((match) => ![direct.id, supporting.id].includes(match.id))!;
    await setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, direct.id, { decision: "accept" });
    await setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, supporting.id, { decision: "edit", editedMatch: editedMatch(fixture.evidenceId) });
    await setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, rejected.id, { decision: "reject" });
    await setEvidenceCoverageReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedCoverage[0].id, { decision: "accept" });
    expect((await completeEvidenceMatchReview(fixture.workspace, fixture.proposalId)).status).toBe("completed");
    expect(await readFile(proposalPath)).toEqual(before);
    expect((await showEvidenceMatchReview(fixture.workspace, fixture.proposalId)).reviewer.name).toBe("Reviewer");
  });

  it("rejects invalid review edits, duplicate decisions, and incomplete completion", async () => {
    const fixture = await matchProposalFixture(1);
    await initializeEvidenceMatchReview(fixture.workspace, fixture.proposalId);
    const proposal = await showEvidenceMatchProposal(fixture.workspace, fixture.proposalId);
    await expect(setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, "proposed_unknown", { decision: "accept" })).rejects.toThrow("Unknown proposed match");
    await expect(setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedMatches[0].id, { decision: "edit", editedMatch: editedMatch("evi_unknown") })).rejects.toThrow("ineligible evidence");
    await expect(completeEvidenceMatchReview(fixture.workspace, fixture.proposalId)).rejects.toThrow("remain pending");
    await setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedMatches[0].id, { decision: "accept" });
    await expect(setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedMatches[0].id, { decision: "accept" })).rejects.toThrow("already exists");
  });

  it("approves reviewed links, merges manual links, excludes rejected links, and preserves lineage", async () => {
    const fixture = await matchProposalFixture(3);
    const context = await loadMatchingContext(fixture.workspace, fixture.targetId);
    await addManualEvidenceMatch(fixture.workspace, fixture.targetId, manualInput(context.eligibleExpectations[1].id, fixture.evidenceId));
    await initializeEvidenceMatchReview(fixture.workspace, fixture.proposalId, { reviewerName: "Reviewer" });
    const proposal = await showEvidenceMatchProposal(fixture.workspace, fixture.proposalId);
    const direct = proposal.proposedMatches.find((match) => match.matchType === "direct")!;
    const supporting = proposal.proposedMatches.find((match) => match.matchType === "supporting")!;
    const rejected = proposal.proposedMatches.find((match) => ![direct.id, supporting.id].includes(match.id))!;
    await setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, direct.id, { decision: "accept" });
    await setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, supporting.id, { decision: "edit", editedMatch: editedMatch(fixture.evidenceId) });
    await setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, rejected.id, { decision: "reject" });
    await setEvidenceCoverageReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedCoverage[0].id, { decision: "accept" });
    await completeEvidenceMatchReview(fixture.workspace, fixture.proposalId);
    const result = await approveEvidenceMatchProposal(fixture.workspace, fixture.proposalId);
    const approved = await showApprovedEvidenceMatching(fixture.workspace, fixture.targetId);
    expect(result.rejectedCount).toBe(1);
    expect(approved.matches.some((match) => match.trustState === "manual-approved")).toBe(true);
    expect(approved.matches.some((match) => match.trustState === "human-approved" && match.approvalProvenance?.reviewDecision === "accept")).toBe(true);
    expect(approved.matches.some((match) => match.trustState === "human-edited" && match.approvalProvenance?.reviewDecision === "edit")).toBe(true);
    expect(approved.matches.every((match) => !["proposed", "rejected"].includes(match.trustState))).toBe(true);
    expect((await getApprovedEvidenceMatchingStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
  });

  it("approval is deterministic and refuses incomplete, stale, or invalid proposal dependencies", async () => {
    const fixture = await completedMatchReviewFixture();
    const first = await approveEvidenceMatchProposal(fixture.workspace, fixture.proposalId, { now: () => new Date(FIRST_TIME) });
    const matchingPath = path.join(fixture.workspace, first.matchingPath);
    const before = await readFile(matchingPath);
    const beforeStat = await stat(matchingPath);
    const second = await approveEvidenceMatchProposal(fixture.workspace, fixture.proposalId, { now: () => new Date(SECOND_TIME) });
    expect(second.result).toBe("already-current");
    expect(await readFile(matchingPath)).toEqual(before);
    expect((await stat(matchingPath)).mtimeMs).toBe(beforeStat.mtimeMs);

    const incomplete = await matchProposalFixture(1);
    await initializeEvidenceMatchReview(incomplete.workspace, incomplete.proposalId);
    await expect(approveEvidenceMatchProposal(incomplete.workspace, incomplete.proposalId)).rejects.toThrow("completed");

    const evidencePath = path.join(fixture.workspace, "kb/evidence-items.json");
    const evidence = JSON.parse(await readFile(evidencePath, "utf8")) as EvidenceItem[];
    evidence[0].normalizedSummary = "Changed evidence after review.";
    await writeJsonAtomic(evidencePath, evidence);
    expect((await getEvidenceMatchProposalStatus(fixture.workspace, fixture.proposalId)).status).toBe("stale");
    await expect(approveEvidenceMatchProposal(fixture.workspace, fixture.proposalId)).rejects.toThrow("stale");
  });

  it("reports missing, current, stale, and provenance-invalid approved matching states", async () => {
    const fixture = await completedMatchReviewFixture();
    expect((await getApprovedEvidenceMatchingStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
    const approvedResult = await approveEvidenceMatchProposal(fixture.workspace, fixture.proposalId);
    expect((await getApprovedEvidenceMatchingStatus(fixture.workspace, fixture.targetId)).status).toBe("current");
    const evidencePath = path.join(fixture.workspace, "kb/evidence-items.json");
    const evidence = JSON.parse(await readFile(evidencePath, "utf8")) as EvidenceItem[];
    evidence[0].normalizedSummary = "Changed reviewed evidence.";
    await writeJsonAtomic(evidencePath, evidence);
    expect((await getApprovedEvidenceMatchingStatus(fixture.workspace, fixture.targetId)).status).toBe("stale");

    const invalid = await completedMatchReviewFixture();
    const invalidResult = await approveEvidenceMatchProposal(invalid.workspace, invalid.proposalId);
    const matchingPath = path.join(invalid.workspace, invalidResult.matchingPath);
    const manifestPath = path.join(invalid.workspace, invalidResult.manifestPath);
    const matching = JSON.parse(await readFile(matchingPath, "utf8"));
    matching.matches[0].evidenceProvenance[0].evidenceArtifactSha256 = hashText("tampered provenance");
    await writeJsonAtomic(matchingPath, matching);
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.matchingSha256 = await hashFile(matchingPath);
    await writeJsonAtomic(manifestPath, manifest);
    expect((await getApprovedEvidenceMatchingStatus(invalid.workspace, invalid.targetId)).status).toBe("invalid");
    expect(approvedResult.matchingPath).toContain("matching/approved/");
  });

  it("creates no fit, proof-readiness, strengths, resume, or application output", async () => {
    const fixture = await completedMatchReviewFixture();
    await approveEvidenceMatchProposal(fixture.workspace, fixture.proposalId);
    const root = path.join(fixture.workspace, `targets/roles/${fixture.targetId}/matching`);
    const approved = await readFile(path.join(root, "approved/target-evidence-matching.json"), "utf8");
    expect(approved).not.toMatch(/fitScore|fitPercentage|proofReadiness|strengthsReport|weaknessesReport|resume-draft|application/i);
    await expect(stat(path.join(fixture.workspace, "outputs"))).rejects.toThrow();
  });
});

async function roleMatchingFixture() {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-matching-role-"));
  const created = await createRoleTarget(workspace, { title: "Engineering Manager" }, { now: () => new Date(FIRST_TIME) });
  await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  const roleProfilePath = path.join(workspace, "role-profiles", "engineering-manager.json");
  const roleProfile: RoleProfile = {
    schemaVersion: 1,
    id: "engineering-manager",
    title: "Engineering Manager",
    aliases: [],
    expectations: [{
      id: "platform-delivery",
      kind: "leadership",
      statement: "Lead platform delivery across teams.",
      necessity: "required",
      importance: "high",
      capabilityTags: ["platform-delivery"],
      group: "leadership-expectations",
      notes: [],
    }],
    createdAt: FIRST_TIME,
    updatedAt: FIRST_TIME,
  };
  await writeJsonAtomic(roleProfilePath, roleProfile);
  await interpretTarget(workspace, created.target.id, { roleProfile: roleProfilePath, now: () => new Date(FIRST_TIME) });
  await approveTargetInterpretation(workspace, created.target.id);
  const evidenceId = "evi_platform_delivery";
  await writeEvidenceKb(workspace, evidenceId);
  return { workspace, targetId: created.target.id, evidenceId };
}

async function jobMatchingFixture() {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-matching-job-"));
  const input = path.join(workspace, "job.md");
  await writeFile(input, [
    "---",
    "title: Engineering Manager",
    "company: ExampleCo",
    "---",
    "## Required Qualifications",
    "- Experience delivering platform products across API and web surfaces.",
    "",
  ].join("\n"), "utf8");
  const created = await createJobTarget(workspace, { file: input }, { now: () => new Date(FIRST_TIME) });
  await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  await interpretTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  await approveTargetInterpretation(workspace, created.target.id);
  const evidenceId = "evi_platform_delivery";
  await writeEvidenceKb(workspace, evidenceId);
  return { workspace, targetId: created.target.id, evidenceId };
}

async function approveTargetInterpretation(workspace: string, targetId: string): Promise<void> {
  const deterministic = await showTargetInterpretation(workspace, targetId);
  const source = deterministic.expectations[0];
  if (!source) throw new Error("Fixture lacks a deterministic expectation.");
  const payload: ModelInterpretationPayload = {
    proposedExpectations: [{
      operation: "enrich",
      sourceExpectationIds: [source.id],
      sourceAnalysisItemIds: source.sourceAnalysisItemIds,
      sourceReferences: source.sourceReferences,
      kind: source.kind,
      statement: source.statement,
      necessity: source.necessity,
      importance: source.importance,
      explicitness: "explicit",
      capabilityTags: source.capabilityTags,
      interpretationConfidence: "high",
      rationale: "Reviewed target input explicitly supports this expectation.",
      ambiguityNotes: [],
    }],
    proposedGroups: [],
    proposedAmbiguities: [],
    warnings: [],
  };
  const generated = await generateInterpretationProposal(workspace, targetId, { provider: new FakeInterpretationModelProvider(JSON.stringify(payload)), now: () => new Date(FIRST_TIME) });
  await initializeProposalReview(workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
  const proposal = await showInterpretationProposal(workspace, generated.proposalId);
  await setProposalReviewDecision(workspace, generated.proposalId, proposal.proposedExpectations[0].id, { decision: "accept" });
  await completeProposalReview(workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
  await approveInterpretationProposal(workspace, generated.proposalId, { now: () => new Date(FIRST_TIME) });
}

async function writeEvidenceKb(workspace: string, evidenceId: string): Promise<void> {
  const source = sourceFixture({});
  const evidence = evidenceFixture({ id: evidenceId });
  const claim = claimFixture({ supportingEvidenceIds: [evidenceId] });
  await writeJsonAtomic(path.join(workspace, "kb/sources.json"), [source]);
  await writeJsonAtomic(path.join(workspace, "kb/evidence-items.json"), [evidence]);
  await writeJsonAtomic(path.join(workspace, "kb/claims.json"), [claim]);
}

async function validMatchPayload(workspace: string, targetId: string, matchCount = 1): Promise<ModelEvidenceMatchPayload> {
  const context = await loadMatchingContext(workspace, targetId, { persistSnapshot: true });
  const expectation = context.eligibleExpectations[0];
  const evidence = context.snapshot.entries[0];
  if (!expectation || !evidence) throw new Error("Matching fixture lacks eligible input.");
  const matchTypes = ["direct", "supporting", "partial"] as const;
  return {
    proposedMatches: Array.from({ length: matchCount }, (_, index) => ({
      expectationId: expectation.id,
      evidenceIds: [evidence.evidenceId],
      matchType: matchTypes[index % matchTypes.length],
      coverage: index === 0 ? "full" : "partial",
      evidenceStrength: index === 0 ? "strong" : "medium",
      temporalRelevance: "current",
      matchConfidence: index === 0 ? "high" : "medium",
      rationale: index === 0 ? "Reviewed delivery evidence directly supports the approved expectation." : "Reviewed delivery evidence supports part of the approved expectation.",
      limitations: index === 0 ? [] : ["The reviewed evidence covers only part of the expectation."],
      expectationProvenance: expectationProvenance(context, expectation),
      evidenceProvenance: [evidence.provenance],
    })),
    proposedCoverage: [{
      expectationId: expectation.id,
      status: "matched",
      rationale: "A reviewed direct full-coverage match is proposed.",
      blockingReasons: [],
      notes: [],
    }],
    warnings: [],
    ambiguities: [],
  };
}

async function matchProposalFixture(matchCount: number) {
  const fixture = await roleMatchingFixture();
  const payload = await validMatchPayload(fixture.workspace, fixture.targetId, matchCount);
  const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
  const generated = await generateEvidenceMatchProposal(fixture.workspace, fixture.targetId, { provider, now: () => new Date(FIRST_TIME) });
  return { ...fixture, provider, proposalId: generated.proposalId, proposalPath: generated.proposalPath };
}

async function completedMatchReviewFixture() {
  const fixture = await matchProposalFixture(1);
  await initializeEvidenceMatchReview(fixture.workspace, fixture.proposalId);
  const proposal = await showEvidenceMatchProposal(fixture.workspace, fixture.proposalId);
  await setEvidenceMatchReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedMatches[0].id, { decision: "accept" });
  await setEvidenceCoverageReviewDecision(fixture.workspace, fixture.proposalId, proposal.proposedCoverage[0].id, { decision: "accept" });
  await completeEvidenceMatchReview(fixture.workspace, fixture.proposalId);
  return fixture;
}

function sourceFixture(overrides: Partial<Source>): Source {
  return {
    id: "src_public",
    type: "markdown",
    path: "sources/markdown/platform-evidence.md",
    title: "Reviewed platform evidence",
    importedAt: FIRST_TIME,
    hash: hashText("reviewed source bytes"),
    visibility: "public",
    status: "active",
    ...overrides,
  };
}

function evidenceFixture(overrides: Partial<EvidenceItem>): EvidenceItem {
  return {
    id: "evi_platform_delivery",
    sourceIds: ["src_public"],
    category: "responsibility",
    text: "Led platform delivery across API and web product surfaces.",
    normalizedSummary: "Led platform delivery across API and web product surfaces.",
    sourceSection: "Professional Experience",
    technologies: ["API"],
    domains: ["platform"],
    visibility: "public",
    sensitivityFlags: [],
    confidence: "high",
    ...overrides,
  };
}

function claimFixture(overrides: Partial<Claim>): Claim {
  return {
    id: "claim_platform_delivery",
    claim: "Led platform delivery across API and web product surfaces.",
    approvedWording: "Led platform delivery across API and web product surfaces.",
    type: "responsibility_claim",
    supportingEvidenceIds: ["evi_platform_delivery"],
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

function manualInput(expectationId: string, evidenceId: string) {
  return {
    expectationId,
    evidenceIds: [evidenceId],
    matchType: "direct" as const,
    coverage: "full" as const,
    evidenceStrength: "strong" as const,
    temporalRelevance: "current" as const,
    matchConfidence: "high" as const,
    rationale: "Reviewed evidence directly supports this expectation.",
    limitations: [],
  };
}

function editedMatch(evidenceId: string): EditedEvidenceMatch {
  return {
    evidenceIds: [evidenceId],
    matchType: "partial",
    coverage: "partial",
    evidenceStrength: "medium",
    temporalRelevance: "recent",
    matchConfidence: "medium",
    rationale: "Human review confirmed partial support from reviewed delivery evidence.",
    limitations: ["The evidence does not cover the complete expectation."],
    notes: ["Human-edited match."],
  };
}

function matchFixture(
  targetId: string,
  expectationId: string,
  evidenceId: string,
  context: Awaited<ReturnType<typeof loadMatchingContext>>,
  provenance: ReturnType<typeof expectationProvenance>,
  matchType: EvidenceMatch["matchType"],
  coverage: EvidenceMatch["coverage"],
): EvidenceMatch {
  return {
    id: manualMatchId(targetId, expectationId, [evidenceId], matchType),
    expectationId,
    evidenceIds: [evidenceId],
    matchType,
    coverage,
    evidenceStrength: "strong",
    temporalRelevance: "current",
    rationale: matchType === "contradictory" ? "Reviewed evidence explicitly conflicts." : "Reviewed evidence supports this expectation.",
    expectationProvenance: provenance,
    evidenceProvenance: [context.snapshot.entries[0].provenance],
    trustState: "manual-approved",
    interpretation: { method: "manual", matcherName: "target-evidence-matcher", matcherVersion: "1", policyVersion: "1" },
    matchConfidence: "high",
    limitations: matchType === "direct" ? [] : ["Explicit limitation."],
    notes: [],
  };
}
