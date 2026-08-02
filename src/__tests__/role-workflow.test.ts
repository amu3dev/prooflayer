import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { submitEvidenceReviewUiClaim } from "../evidence-review-ui.js";
import { FakeInterpretationModelProvider } from "../model-provider.js";
import {
  continueRoleWorkflow,
  formatRoleWorkflowStatus,
  getGeneratedRoleUnderstandingStatus,
  inspectRoleWorkflow,
  replayGeneratedRoleUnderstanding,
  runRoleWorkflow,
  showGeneratedRoleUnderstanding,
  ROLE_UNDERSTANDING_PROMPT_ID,
} from "../role-workflow.js";
import { createRoleTarget } from "../targets.js";
import { createEvidenceReviewUiFixture, validApprovedFields } from "./evidence-review-ui-fixture.js";
import { createProductShellFixture } from "./product-shell-fixture.js";

const FIRST = "2026-07-31T10:00:00.000Z";
const SECOND = "2026-07-31T11:00:00.000Z";

describe("guided title-only Role Resume workflow", () => {
  it("creates a conservative CTO understanding from title only and preserves it on unchanged reruns", async () => {
    const fixture = await createProductShellFixture({ runJob: false });
    const target = await createRoleTarget(fixture.workspace, { title: "CTO" }, { now: () => new Date(FIRST) });
    const missing = await inspectRoleWorkflow(fixture.workspace, target.target.id);
    const sourcePath = path.join(fixture.workspace, fixture.source.path);
    const sourceBefore = await stat(sourcePath);
    const first = await runRoleWorkflow(fixture.workspace, target.target.id, { offline: true, now: () => new Date(FIRST) });
    const understanding = await showGeneratedRoleUnderstanding(fixture.workspace, target.target.id);
    const understandingPath = path.join(fixture.workspace, (await getGeneratedRoleUnderstandingStatus(fixture.workspace, target.target.id)).understandingPath);
    const before = await stat(understandingPath);
    const bytes = await readFile(understandingPath);
    const rerun = await runRoleWorkflow(fixture.workspace, target.target.id, { offline: true, now: () => new Date(SECOND) });

    expect(first.result).toBe("created");
    expect(missing.nextAction).toMatch(/generate a conservative role understanding/i);
    expect(formatRoleWorkflowStatus(missing)).toContain("Role understanding needed");
    expect(rerun.result).toBe("already-current");
    expect(understanding).toMatchObject({
      title: "CTO",
      state: "generated-with-ambiguity",
      specialization: { id: "general-cto", source: "conservative-default" },
      trust: {
        state: "generated-unapproved",
        historicalCandidateFact: false,
        usableForConservativeProjection: true,
        requiresHumanReviewBeforeCanonicalApproval: true,
      },
      source: { type: "built-in-taxonomy" },
    });
    expect(understanding.expectations.length).toBeGreaterThanOrEqual(6);
    expect(understanding.ambiguities).toHaveLength(1);
    expect(await readFile(understandingPath)).toEqual(bytes);
    expect((await stat(understandingPath)).mtimeMs).toBe(before.mtimeMs);
    expect((await stat(sourcePath)).mtimeMs).toBe(sourceBefore.mtimeMs);
    await expect(stat(path.join(fixture.workspace, "targets/roles/role-cto/interpretation/approved"))).rejects.toThrow();
  });

  it("uses the existing provider abstraction for an untrusted proposal without auto-approval", async () => {
    const fixture = await createProductShellFixture({ runJob: false });
    const target = await createRoleTarget(fixture.workspace, { title: "Product Operations Lead" });
    const provider = new FakeInterpretationModelProvider(JSON.stringify({
      summary: "A product operations role connecting planning, delivery systems, and decision quality.",
      seniority: "lead",
      positioning: "Product operations leadership grounded in delivery systems",
      expectations: [
        expectation("responsibility", "Shape planning and delivery operating rhythms.", ["planning", "delivery"]),
        expectation("capability", "Use evidence to improve product decisions.", ["evidence", "product"]),
        expectation("leadership", "Align product and engineering stakeholders.", ["product", "engineering", "alignment"]),
      ],
    }));
    const result = await runRoleWorkflow(fixture.workspace, target.target.id, { provider, now: () => new Date(FIRST) });
    const understanding = await showGeneratedRoleUnderstanding(fixture.workspace, target.target.id);

    expect(result.providerCallMade).toBe(true);
    expect(provider.callCount).toBe(1);
    expect(understanding.source).toMatchObject({ type: "model-proposal", promptId: ROLE_UNDERSTANDING_PROMPT_ID });
    expect(understanding.trust.state).toBe("generated-unapproved");
    expect(result.status.canonical.approvedInterpretation).toBe("missing");
    expect(result.status.stages.find((entry) => entry.stage === "draft-review")?.status).toBe("waiting");
    expect(await readFile(path.join(fixture.workspace, understanding.source.type === "model-proposal" ? understanding.source.rawResponsePath : ""), "utf8")).toContain("planning and delivery");
    expect((await replayGeneratedRoleUnderstanding(fixture.workspace, target.target.id)).matches).toBe(true);
    const cached = await runRoleWorkflow(fixture.workspace, target.target.id, { provider });
    expect(cached.result).toBe("already-current");
    expect(provider.callCount).toBe(1);
  });

  it("persists one explicit CTO specialization and does not ask it again", async () => {
    const fixture = await createProductShellFixture({ runJob: false });
    const target = await createRoleTarget(fixture.workspace, { title: "CTO" });
    await runRoleWorkflow(fixture.workspace, target.target.id, { offline: true, now: () => new Date(FIRST) });
    const refined = await continueRoleWorkflow(fixture.workspace, target.target.id, {
      offline: true,
      specialization: "startup-product-cto",
      rebuildStale: true,
      now: () => new Date(SECOND),
    });
    const rerun = await continueRoleWorkflow(fixture.workspace, target.target.id, { offline: true });

    expect(refined.result).toBe("rebuilt");
    expect(refined.status.understanding?.specialization).toEqual({
      id: "startup-product-cto",
      label: "Startup / Product CTO",
      source: "user-choice",
    });
    expect(refined.status.ambiguity).toBeUndefined();
    expect(rerun.result).toBe("already-current");
    expect(rerun.status.ambiguity).toBeUndefined();
  });

  it("selects only reviewed Role-eligible evidence and keeps the links conservative", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    for (const claimId of ["claim_review_ui_1", "claim_review_ui_2", "claim_review_ui_3"]) {
      await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, claimId, validApprovedFields());
    }
    const target = await createRoleTarget(fixture.workspace, { title: "AI Product Manager" });
    const result = await runRoleWorkflow(fixture.workspace, target.target.id, { offline: true });
    const after = await inspectRoleWorkflow(fixture.workspace, target.target.id);

    expect(result.status.selectedEvidenceIds.length).toBeGreaterThan(0);
    expect(after.evidenceLinks.every((entry) => ["supporting", "partial"].includes(entry.relationship))).toBe(true);
    expect(after.strongestThemes.every((entry) => entry.evidence.length > 0)).toBe(true);
    expect(after.draftPreview).toMatchObject({
      status: "evidence-backed-preview",
      requiresHumanReview: true,
      canonicalApprovedDraft: false,
    });
    expect(after.draftPreview.items.every((entry) => entry.text.startsWith("Supported"))).toBe(true);
    expect(after.canonical.approvedMatching).toBe("missing");
    expect(after.canonical.assessment).toBe("missing");
    expect(after.limitations.join(" ")).toMatch(/unapproved|conservative/i);
  });

  it("does not let one broad evidence item inflate several required expectations", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_1", validApprovedFields());
    const target = await createRoleTarget(fixture.workspace, { title: "CTO" });
    const result = await runRoleWorkflow(fixture.workspace, target.target.id, { offline: true });
    const supporting = result.status.evidenceLinks.filter((entry) => entry.relationship === "supporting");

    expect(new Set(supporting.map((entry) => entry.claimId)).size).toBe(supporting.length);
    expect(new Set(supporting.map((entry) => entry.evidenceId)).size).toBe(supporting.length);
    expect(result.status.fit).not.toBe("strong");
    expect(result.status.materialGaps.length).toBeGreaterThan(0);
  });

  it("requires explicit rebuild for stale understanding and rejects Job Targets", async () => {
    const fixture = await createProductShellFixture({ runJob: false });
    const target = await createRoleTarget(fixture.workspace, { title: "Engineering Manager" });
    await runRoleWorkflow(fixture.workspace, target.target.id, { offline: true });
    const targetPath = path.join(fixture.workspace, "targets/roles", target.target.id, "target.json");
    const stored = JSON.parse(await readFile(targetPath, "utf8"));
    stored.updatedAt = SECOND;
    await import("../fs-utils.js").then(({ writeJsonAtomic }) => writeJsonAtomic(targetPath, stored));
    expect((await getGeneratedRoleUnderstandingStatus(fixture.workspace, target.target.id)).status).toBe("stale");
    expect((await runRoleWorkflow(fixture.workspace, target.target.id, { offline: true })).result).toBe("paused");
    await expect(runRoleWorkflow(fixture.workspace, fixture.jobTargetId, { offline: true })).rejects.toThrow(/Role Targets only/);
  });
});

function expectation(kind: "responsibility" | "capability" | "leadership", statement: string, capabilityTags: string[]) {
  return {
    kind,
    statement,
    necessity: "required",
    importance: "high",
    capabilityTags,
    group: kind === "leadership" ? "leadership" : kind === "responsibility" ? "responsibilities" : "capabilities",
  };
}
