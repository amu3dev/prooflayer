import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  createEvidenceClaimReview,
  evidenceClaimReviewPaths,
  getEvidenceClaimReviewStatus,
  listEvidenceClaimReviews,
  showEvidenceClaimReview,
} from "../evidence-claim-review.js";
import {
  buildEvidenceReviewBatch,
  evidenceReviewBatchPaths,
  getEvidenceReviewBatchStatus,
  showEvidenceReviewBatch,
} from "../evidence-review-batch.js";
import {
  buildEvidenceSnapshot,
  loadEvidenceSnapshot,
} from "../evidence-snapshots.js";
import { hashFile, hashText, writeJsonAtomic } from "../fs-utils.js";
import { buildJobRequirements } from "../job-requirements.js";
import type { Claim, EvidenceItem, Source } from "../schemas.js";
import { analyzeTarget } from "../target-analysis.js";
import { createJobTarget, createRoleTarget } from "../targets.js";
import { NATTERBOX_JOB_DESCRIPTION } from "./fixtures/natterbox-job-description.js";

const TIME_1 = "2026-07-29T10:00:00.000Z";
const TIME_2 = "2026-07-30T10:00:00.000Z";

describe("human-controlled Evidence Foundation review and eligibility", () => {
  it("keeps unreviewed claims ineligible and projects no source approval", async () => {
    const fixture = await reviewWorkspace();
    const snapshotResult = await buildEvidenceSnapshot(fixture.workspace);
    const { snapshot } = await loadEvidenceSnapshot(fixture.workspace, snapshotResult.snapshotId);

    expect((await getEvidenceClaimReviewStatus(fixture.workspace, "claim_platform")).status)
      .toBe("missing");
    expect(snapshot.completeness).toMatchObject({
      reviewedClaimCount: 0,
      approvedClaimCount: 0,
      eligibleRoleEvidenceCount: 0,
      eligibleJobEvidenceCount: 0,
    });
    expect(snapshot.claims[0]).toMatchObject({
      eligibility: { roleMatching: false, jobMapping: false },
      sourceState: { approvalStatus: "needs_confirmation" },
    });
    expect(snapshot.claims[0]!.eligibility.reasons).toContain("claim-unreviewed");
  });

  it("creates an approved review, preserves source bytes, and projects eligibility", async () => {
    const fixture = await reviewWorkspace();
    const before = await foundationHashes(fixture.workspace);
    const first = await createEvidenceClaimReview(
      fixture.workspace,
      "claim_platform",
      approvedInput(fixture.claims[0]!),
      { now: () => new Date(TIME_1) },
    );
    const paths = evidenceClaimReviewPaths(fixture.workspace, "claim_platform", first.reviewId);
    const bytes = await readFile(paths.reviewPath);
    const modified = (await stat(paths.reviewPath)).mtimeMs;
    const second = await createEvidenceClaimReview(
      fixture.workspace,
      "claim_platform",
      approvedInput(fixture.claims[0]!),
      { now: () => new Date(TIME_2) },
    );
    const snapshotResult = await buildEvidenceSnapshot(fixture.workspace);
    const { snapshot } = await loadEvidenceSnapshot(fixture.workspace, snapshotResult.snapshotId);
    const record = snapshot.claims.find(({ id }) => id === "claim_platform")!;

    expect(first.result).toBe("created");
    expect(second).toMatchObject({ result: "already-current", reviewId: first.reviewId });
    expect(await readFile(paths.reviewPath)).toEqual(bytes);
    expect((await stat(paths.reviewPath)).mtimeMs).toBe(modified);
    expect(await foundationHashes(fixture.workspace)).toEqual(before);
    expect(record).toMatchObject({
      approvalStatus: "approved",
      outputReadiness: "resume_ready",
      publicSafe: true,
      needsConfirmation: false,
      review: {
        reviewId: first.reviewId,
        decision: "approved",
        eligibleForRoleMatching: true,
        eligibleForJobMapping: true,
      },
      eligibility: { roleMatching: true, jobMapping: true },
    });
    expect(record.content?.claim).toBe(fixture.claims[0]!.claim);
    expect(JSON.stringify(snapshot)).not.toContain("Reviewer verified exact support");
  });

  it("creates a new corrected projection without mutating the original claim", async () => {
    const fixture = await reviewWorkspace();
    const sourceBytes = await readFile(path.join(fixture.workspace, "kb/claims.json"));
    const input = approvedInput(fixture.claims[0]!, {
      decision: "approved-with-qualifier",
      correctedClaim: "Supported platform delivery with engineering.",
      requiredQualifiers: ["Supported"],
      factualSupport: "partially-supported",
      scope: "qualified",
    });
    const result = await createEvidenceClaimReview(fixture.workspace, "claim_platform", input);
    const review = await showEvidenceClaimReview(fixture.workspace, "claim_platform");
    const snapshotResult = await buildEvidenceSnapshot(fixture.workspace);
    const { snapshot } = await loadEvidenceSnapshot(fixture.workspace, snapshotResult.snapshotId);
    const projected = snapshot.claims.find(({ id }) => id === "claim_platform")!;

    expect(result.approvedProjectionId).toMatch(/^approved-claim-projection_/);
    expect(review.approvedProjection).toMatchObject({
      id: result.approvedProjectionId,
      text: "Supported platform delivery with engineering.",
      requiredQualifiers: ["Supported"],
    });
    expect(projected.content?.claim).toBe("Supported platform delivery with engineering.");
    expect(projected.id).toBe("claim_platform");
    expect(await readFile(path.join(fixture.workspace, "kb/claims.json"))).toEqual(sourceBytes);

    await expect(createEvidenceClaimReview(
      (await reviewWorkspace()).workspace,
      "claim_platform",
      { ...input, correctedClaim: "Delivered 900 Salesforce deployments." },
    )).rejects.toThrow(/unsupported numeric value|unsupported facts/);
  });

  it.each([
    ["rejected cannot be ready", { decision: "rejected", factualSupport: "unsupported" }],
    ["unsupported cannot be approved", { factualSupport: "unsupported" }],
    ["private cannot be eligible", { publicSafety: "private" }],
    ["overstated cannot be ready", { scope: "overstated" }],
    ["needs-edit cannot silently retain corrected wording", {
      decision: "needs-edit",
      correctedClaim: "Supported platform delivery with engineering.",
      factualSupport: "partially-supported",
      scope: "underspecified",
      resumeReadiness: "needs-edit",
      eligibleForRoleMatching: false,
      eligibleForJobMapping: false,
    }],
  ] as const)("rejects inconsistent input: %s", async (_label, changes) => {
    const fixture = await reviewWorkspace();
    await expect(createEvidenceClaimReview(
      fixture.workspace,
      "claim_platform",
      { ...approvedInput(fixture.claims[0]!), ...changes },
    )).rejects.toThrow();
  });

  it("never promotes private source material to public-safe", async () => {
    const fixture = await reviewWorkspace({ privateEvidence: true });
    await expect(createEvidenceClaimReview(
      fixture.workspace,
      "claim_platform",
      approvedInput(fixture.claims[0]!),
    )).rejects.toThrow(/cannot be reviewed as public-safe/);
  });

  it("allows factual approval without resume readiness and projects Role and Job eligibility separately", async () => {
    const factualOnly = await reviewWorkspace();
    await createEvidenceClaimReview(
      factualOnly.workspace,
      "claim_platform",
      approvedInput(factualOnly.claims[0]!, {
        resumeReadiness: "not-resume-ready",
        eligibleForRoleMatching: false,
        eligibleForJobMapping: false,
      }),
    );
    const factualSnapshotResult = await buildEvidenceSnapshot(factualOnly.workspace);
    const factualSnapshot = (await loadEvidenceSnapshot(
      factualOnly.workspace,
      factualSnapshotResult.snapshotId,
    )).snapshot;
    expect(factualSnapshot.completeness).toMatchObject({
      approvedClaimCount: 1,
      eligibleRoleEvidenceCount: 0,
      eligibleJobEvidenceCount: 0,
    });

    const roleOnly = await reviewWorkspace();
    await createEvidenceClaimReview(
      roleOnly.workspace,
      "claim_platform",
      approvedInput(roleOnly.claims[0]!, {
        eligibleForRoleMatching: true,
        eligibleForJobMapping: false,
      }),
    );
    const roleSnapshotResult = await buildEvidenceSnapshot(roleOnly.workspace);
    const roleSnapshot = (await loadEvidenceSnapshot(
      roleOnly.workspace,
      roleSnapshotResult.snapshotId,
    )).snapshot;
    expect(roleSnapshot.completeness).toMatchObject({
      eligibleRoleEvidenceCount: 1,
      eligibleJobEvidenceCount: 0,
    });
  });

  it("verifies only exact source-supported metric wording", async () => {
    const fixture = await reviewWorkspace({ metric: true });
    const metricClaim = fixture.claims.find(({ id }) => id === "claim_metric")!;
    await createEvidenceClaimReview(
      fixture.workspace,
      metricClaim.id,
      approvedInput(metricClaim, {
        metricReview: {
          state: "verified",
          exactText: "Delivered 3 reviewed platform releases.",
          unit: "releases",
          scope: "reviewed platform delivery",
          qualifiers: ["reviewed"],
        },
        classification: { workContext: "employment", claimNature: "achievement" },
      }),
    );
    const snapshotResult = await buildEvidenceSnapshot(fixture.workspace);
    const { snapshot } = await loadEvidenceSnapshot(fixture.workspace, snapshotResult.snapshotId);
    expect(snapshot.verifiedMetrics).toEqual([
      expect.objectContaining({
        claimId: metricClaim.id,
        exactText: "Delivered 3 reviewed platform releases.",
      }),
    ]);

    const invalid = await reviewWorkspace({ metric: true });
    const invalidClaim = invalid.claims.find(({ id }) => id === "claim_metric")!;
    await expect(createEvidenceClaimReview(
      invalid.workspace,
      invalidClaim.id,
      approvedInput(invalidClaim, {
        metricReview: {
          state: "verified",
          exactText: "Delivered 30 reviewed platform releases.",
          unit: "releases",
          scope: "reviewed platform delivery",
          qualifiers: ["reviewed"],
        },
        classification: { workContext: "employment", claimNature: "achievement" },
      }),
    )).rejects.toThrow(/exactly match|directly supported/);
  });

  it("supersedes explicitly, keeps prior versions, and reports lifecycle", async () => {
    const fixture = await reviewWorkspace();
    const first = await createEvidenceClaimReview(
      fixture.workspace,
      "claim_platform",
      approvedInput(fixture.claims[0]!),
      { now: () => new Date(TIME_1) },
    );
    await expect(createEvidenceClaimReview(
      fixture.workspace,
      "claim_platform",
      deferredInput(fixture.claims[0]!),
    )).rejects.toThrow(/supersedesReviewId/);
    const secondInput = deferredInput(fixture.claims[0]!, first.reviewId);
    const second = await createEvidenceClaimReview(
      fixture.workspace,
      "claim_platform",
      secondInput,
      { now: () => new Date(TIME_2) },
    );

    expect((await getEvidenceClaimReviewStatus(
      fixture.workspace,
      "claim_platform",
      first.reviewId,
    ))).toMatchObject({ status: "superseded", supersededByReviewId: second.reviewId });
    expect((await getEvidenceClaimReviewStatus(fixture.workspace, "claim_platform"))).toMatchObject({
      status: "current",
      reviewId: second.reviewId,
    });
    expect((await listEvidenceClaimReviews(fixture.workspace)).find(
      ({ claimId }) => claimId === "claim_platform",
    )).toMatchObject({ versionCount: 2, decision: "deferred", status: "current" });
    expect(await readFile(evidenceClaimReviewPaths(
      fixture.workspace,
      "claim_platform",
      first.reviewId,
    ).reviewPath)).toBeTruthy();
  });

  it("marks a review stale after source evidence changes and invalid after corruption", async () => {
    const fixture = await reviewWorkspace();
    const result = await createEvidenceClaimReview(
      fixture.workspace,
      "claim_platform",
      approvedInput(fixture.claims[0]!),
    );
    const evidencePath = path.join(fixture.workspace, "kb/evidence-items.json");
    const evidence = JSON.parse(await readFile(evidencePath, "utf8")) as EvidenceItem[];
    evidence[0] = { ...evidence[0]!, normalizedSummary: `${evidence[0]!.normalizedSummary} Changed.` };
    await writeJsonAtomic(evidencePath, evidence);
    expect((await getEvidenceClaimReviewStatus(fixture.workspace, "claim_platform", result.reviewId)).status)
      .toBe("stale");

    const corrupt = await reviewWorkspace();
    const corruptResult = await createEvidenceClaimReview(
      corrupt.workspace,
      "claim_platform",
      approvedInput(corrupt.claims[0]!),
    );
    const paths = evidenceClaimReviewPaths(corrupt.workspace, "claim_platform", corruptResult.reviewId);
    await writeFile(paths.reviewPath, "{}\n", "utf8");
    expect((await getEvidenceClaimReviewStatus(corrupt.workspace, "claim_platform", corruptResult.reviewId)).status)
      .toBe("invalid");
  });
});

describe("deterministic evidence review batches", () => {
  it("builds an exact Natterbox-guided batch without creating decisions", async () => {
    const fixture = await natterboxBatchWorkspace();
    const first = await buildEvidenceReviewBatch(fixture.workspace, fixture.targetId, {
      subsetSize: 12,
      now: () => new Date(TIME_1),
    });
    const paths = evidenceReviewBatchPaths(fixture.workspace, first.batchId);
    const bytes = await readFile(paths.batchPath);
    const modified = (await stat(paths.batchPath)).mtimeMs;
    const second = await buildEvidenceReviewBatch(fixture.workspace, fixture.targetId, {
      subsetSize: 12,
      now: () => new Date(TIME_2),
    });
    const batch = await showEvidenceReviewBatch(fixture.workspace, first.batchId);

    expect(first).toMatchObject({
      result: "created",
      candidateClaimCount: 15,
    });
    expect(second).toMatchObject({ result: "already-current", batchId: first.batchId });
    expect(await readFile(paths.batchPath)).toEqual(bytes);
    expect((await stat(paths.batchPath)).mtimeMs).toBe(modified);
    expect(batch.claims.some(({ matchingTerms }) =>
      matchingTerms.includes("artificial intelligence") || matchingTerms.includes("platform"))).toBe(true);
    expect(batch.controlledReviewSubsetClaimIds).toHaveLength(12);
    expect(first.templatePaths).toHaveLength(12);
    for (const templatePath of first.templatePaths) {
      const template = JSON.parse(await readFile(path.join(fixture.workspace, templatePath), "utf8"));
      expect(template.reviewInput).toMatchObject({
        decision: null,
        factualSupport: null,
        publicSafety: null,
        eligibleForJobMapping: null,
      });
    }
    expect((await listEvidenceClaimReviews(fixture.workspace)).every(({ status }) => status === "missing"))
      .toBe(true);
  });

  it("marks a batch stale when claims change and rejects Role Targets", async () => {
    const fixture = await natterboxBatchWorkspace();
    const result = await buildEvidenceReviewBatch(fixture.workspace, fixture.targetId);
    const claimsPath = path.join(fixture.workspace, "kb/claims.json");
    const claims = JSON.parse(await readFile(claimsPath, "utf8")) as Claim[];
    claims[0] = { ...claims[0]!, factualConfidence: "low" };
    await writeJsonAtomic(claimsPath, claims);
    expect((await getEvidenceReviewBatchStatus(fixture.workspace, result.batchId)).status)
      .toBe("stale");

    const role = await createRoleTarget(fixture.workspace, { title: "Product Owner" });
    await expect(buildEvidenceReviewBatch(fixture.workspace, role.target.id))
      .rejects.toThrow(/require a Job Target/);
  });
});

async function reviewWorkspace(options: { privateEvidence?: boolean; metric?: boolean } = {}) {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-evidence-review-"));
  const source: Source = {
    id: "src_reviewed",
    type: "markdown",
    path: "sources/reviewed.md",
    importedAt: TIME_1,
    hash: hashText("reviewed source"),
    visibility: options.privateEvidence ? "private" : "generic_only",
    status: "active",
  };
  const evidence: EvidenceItem[] = [{
    id: "evi_platform",
    sourceIds: [source.id],
    category: "responsibility",
    text: "Supported platform delivery with engineering and product discovery.",
    normalizedSummary: "Supported platform delivery with engineering and product discovery.",
    parentRoleId: "role_product",
    sourceSection: "Experience",
    technologies: ["TypeScript"],
    domains: ["platform"],
    visibility: options.privateEvidence ? "private" : "generic_only",
    sensitivityFlags: [],
    confidence: "high",
  }];
  const claims: Claim[] = [{
    id: "claim_platform",
    claim: "Supported platform delivery with engineering and product discovery.",
    type: "responsibility_claim",
    supportingEvidenceIds: ["evi_platform"],
    parentRoleId: "role_product",
    sourceSection: "Experience",
    extractionConfidence: "high",
    factualConfidence: "high",
    corroborationLevel: "single_source",
    approvalStatus: "needs_confirmation",
    outputReadiness: "generic_only",
    confidence: "high",
    publicSafe: false,
    needsConfirmation: true,
    metricStatus: "no_metric",
    unsafeWording: [],
  }];
  if (options.metric) {
    evidence.push({
      id: "evi_metric",
      sourceIds: [source.id],
      category: "achievement",
      text: "Delivered 3 reviewed platform releases.",
      normalizedSummary: "Delivered 3 reviewed platform releases.",
      parentRoleId: "role_product",
      visibility: "generic_only",
      sensitivityFlags: [],
      confidence: "high",
    });
    claims.push({
      ...claims[0]!,
      id: "claim_metric",
      claim: "Delivered 3 reviewed platform releases.",
      type: "impact_claim",
      supportingEvidenceIds: ["evi_metric"],
      metricStatus: "needs_metric",
    });
  }
  await writeKnowledgeBase(workspace, [source], evidence, claims);
  return { workspace, claims };
}

async function natterboxBatchWorkspace() {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-review-batch-"));
  const inputPath = path.join(workspace, "imports", "natterbox.md");
  await mkdir(path.dirname(inputPath), { recursive: true });
  await writeFile(inputPath, NATTERBOX_JOB_DESCRIPTION, "utf8");
  const target = await createJobTarget(workspace, {
    file: inputPath,
    title: "Product Owner - Conversational AI and Agents",
    company: "Natterbox",
  });
  await analyzeTarget(workspace, target.target.id, { now: () => new Date(TIME_1) });
  await buildJobRequirements(workspace, target.target.id, { now: () => new Date(TIME_1) });
  const fixture = await reviewWorkspace();
  const sources = JSON.parse(await readFile(path.join(fixture.workspace, "kb/sources.json"), "utf8")) as Source[];
  const evidence = JSON.parse(await readFile(path.join(fixture.workspace, "kb/evidence-items.json"), "utf8")) as EvidenceItem[];
  const baseClaim = (JSON.parse(await readFile(path.join(fixture.workspace, "kb/claims.json"), "utf8")) as Claim[])[0]!;
  const themes = [
    "AI product workflows and LLM evaluation", "hands-on product ownership", "product discovery and prioritisation",
    "UX usability and design-led development", "platform extensibility", "engineering collaboration",
    "go-to-market collaboration", "commercial outcomes", "user outcomes", "CRM integration adjacency",
    "customer experience", "mobile product prototype", "telecom SaaS delivery", "roadmap delivery", "technical strategy",
  ];
  const claims = themes.map((theme, index): Claim => ({
    ...baseClaim,
    id: `claim_batch_${String(index + 1).padStart(2, "0")}`,
    claim: `Supported ${theme}.`,
  }));
  const batchEvidence = claims.map((claim, index): EvidenceItem => ({
    ...evidence[0]!,
    id: `evi_batch_${String(index + 1).padStart(2, "0")}`,
    text: claim.claim,
    normalizedSummary: claim.claim,
  }));
  claims.forEach((claim, index) => {
    claim.supportingEvidenceIds = [batchEvidence[index]!.id];
  });
  await writeKnowledgeBase(workspace, sources, batchEvidence, claims);
  return { workspace, targetId: target.target.id };
}

function approvedInput(claim: Claim, overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 1 as const,
    claimId: claim.id,
    reviewedClaimSha256: hashText(claim.claim),
    decision: "approved" as const,
    requiredQualifiers: [],
    factualSupport: "supported" as const,
    scope: "exact" as const,
    publicSafety: "public-safe" as const,
    resumeReadiness: "resume-ready" as const,
    eligibleForRoleMatching: true,
    eligibleForJobMapping: true,
    metricReview: { state: "not-a-metric" as const, qualifiers: [] },
    classification: { workContext: "employment" as const, claimNature: "responsibility" as const },
    risks: [],
    warnings: [],
    ambiguities: [],
    reviewerRationale: "Reviewer verified exact support and global eligibility boundaries.",
    ...overrides,
  };
}

function deferredInput(claim: Claim, supersedesReviewId?: string) {
  return {
    ...approvedInput(claim),
    decision: "deferred" as const,
    factualSupport: "indeterminate" as const,
    scope: "ambiguous" as const,
    publicSafety: "indeterminate" as const,
    resumeReadiness: "indeterminate" as const,
    eligibleForRoleMatching: false,
    eligibleForJobMapping: false,
    ...(supersedesReviewId ? { supersedesReviewId } : {}),
  };
}

async function writeKnowledgeBase(
  workspace: string,
  sources: Source[],
  evidence: EvidenceItem[],
  claims: Claim[],
): Promise<void> {
  const kb = path.join(workspace, "kb");
  await mkdir(kb, { recursive: true });
  await writeJsonAtomic(path.join(kb, "sources.json"), sources);
  await writeJsonAtomic(path.join(kb, "evidence-items.json"), evidence);
  await writeJsonAtomic(path.join(kb, "claims.json"), claims);
}

async function foundationHashes(workspace: string): Promise<string[]> {
  return Promise.all([
    "kb/sources.json",
    "kb/evidence-items.json",
    "kb/claims.json",
  ].map((entry) => hashFile(path.join(workspace, entry))));
}
