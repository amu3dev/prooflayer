import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildEvidenceReviewBatch,
  evidenceReviewBatchPaths,
} from "../evidence-review-batch.js";
import {
  evidenceReviewWorkspacePaths,
  getEvidenceReviewWorkspaceStatus,
  renderEvidenceReviewWorkspace,
  showEvidenceReviewWorkspace,
} from "../evidence-review-workspace.js";
import { listEvidenceClaimReviews } from "../evidence-claim-review.js";
import { hashFile, hashText, writeJsonAtomic } from "../fs-utils.js";
import { buildJobRequirements } from "../job-requirements.js";
import type { Claim, EvidenceItem, Source } from "../schemas.js";
import { analyzeTarget } from "../target-analysis.js";
import { createJobTarget } from "../targets.js";
import { NATTERBOX_JOB_DESCRIPTION } from "./fixtures/natterbox-job-description.js";

const TIME_1 = "2026-07-29T10:00:00.000Z";
const TIME_2 = "2026-07-30T10:00:00.000Z";

describe("deterministic Evidence Review Workspace rendering", () => {
  it("renders a self-contained read-only index and claim workspaces from canonical JSON", async () => {
    const fixture = await workspaceFixture();
    const before = await canonicalBytes(fixture.workspace, fixture.batchId);
    const result = await renderEvidenceReviewWorkspace(
      fixture.workspace,
      fixture.batchId,
      { now: () => new Date(TIME_1) },
    );
    const index = await showEvidenceReviewWorkspace(fixture.workspace, fixture.batchId);
    const claimMarkdown = await Promise.all(result.claimWorkspacePaths.map((entry) =>
      readFile(path.join(fixture.workspace, entry), "utf8")));

    expect(result).toMatchObject({
      result: "created",
      claimWorkspaceCount: 4,
    });
    expect(index).toContain("> GENERATED, READ-ONLY VIEW");
    expect(index).toContain("Editing this file does not change ProofLayer state.");
    expect(index).toContain("## Purpose");
    expect(index).toContain("## Current Review State");
    expect(index).toContain("## Claims to Review");
    expect(index).toContain("### High Priority");
    expect(index).toContain("## Next Action");
    expect(index).toContain("## Internal References");
    expect(index.match(/\.review\.md\)/g)).toHaveLength(4);
    expect(claimMarkdown).toHaveLength(4);
    for (const markdown of claimMarkdown) {
      expect(markdown).toContain("# Review Claim:");
      expect(markdown).toContain("## Purpose");
      expect(markdown).toContain("## Claim Being Reviewed");
      expect(markdown).toContain("## Supporting Evidence");
      expect(markdown).toContain("## Matching Job Requirements");
      expect(markdown).toContain("## Claim Classification");
      expect(markdown).toContain("## Current Review State");
      expect(markdown).toContain("## Reviewer Decision Workspace");
      expect(markdown).toContain("## Validation Checklist");
      expect(markdown).toContain("## Next Action");
      expect(markdown).toContain("## Internal References and Provenance");
      expect(markdown).toContain("Source content SHA-256");
      expect(markdown).not.toContain("/Users/synthetic-private/");
      expect(markdown).not.toContain("reviewerRationale");
      expect(markdown).toContain("Private reviewer rationale is intentionally absent");
    }
    expect(claimMarkdown.some((markdown) =>
      markdown.includes("Supported platform extensibility."))).toBe(true);
    expect(claimMarkdown.some((markdown) =>
      markdown.includes("Nice to have") || markdown.includes("preferred"))).toBe(true);
    const workspacePaths = evidenceReviewWorkspacePaths(fixture.workspace, fixture.batchId);
    const manifest = JSON.parse(await readFile(workspacePaths.indexManifestPath, "utf8")) as {
      output: { path: string; sha256: string };
      claimWorkspaces: Array<{
        claimId: string;
        output: { path: string; sha256: string };
        manifest: { path: string; sha256: string };
      }>;
    };
    expect(await hashFile(path.join(fixture.workspace, manifest.output.path)))
      .toBe(manifest.output.sha256);
    for (const claim of manifest.claimWorkspaces) {
      expect(await hashFile(path.join(fixture.workspace, claim.output.path)))
        .toBe(claim.output.sha256);
      expect(await hashFile(path.join(fixture.workspace, claim.manifest.path)))
        .toBe(claim.manifest.sha256);
    }
    const linkedIds = [...index.matchAll(/\]\(\.\/(claim_[^)]+)\.review\.md\)/g)]
      .map((match) => match[1]!);
    const batch = JSON.parse(await readFile(
      evidenceReviewBatchPaths(fixture.workspace, fixture.batchId).batchPath,
      "utf8",
    )) as {
      claims: Array<{ claimId: string; selectedForControlledReview: boolean }>;
    };
    expect(linkedIds).toEqual(batch.claims
      .filter(({ selectedForControlledReview }) => selectedForControlledReview)
      .map(({ claimId }) => claimId));
    for (const theme of [
      "Supported AI product workflows and engineering collaboration.",
      "Supported product discovery and prioritisation.",
      "Supported platform extensibility.",
      "Supported unrelated education administration.",
    ]) {
      const claimId = `claim_workspace_${[
        "Supported AI product workflows and engineering collaboration.",
        "Supported product discovery and prioritisation.",
        "Supported platform extensibility.",
        "Supported unrelated education administration.",
      ].indexOf(theme) + 1}`;
      expect(index.indexOf(theme)).toBeLessThan(index.indexOf(claimId));
      const rendered = claimMarkdown.find((markdown) => markdown.includes(theme))!;
      expect(rendered.indexOf(theme)).toBeLessThan(rendered.indexOf(claimId));
      expect(rendered.indexOf(theme)).toBeLessThan(rendered.indexOf(`evi_workspace_${[
        "Supported AI product workflows and engineering collaboration.",
        "Supported product discovery and prioritisation.",
        "Supported platform extensibility.",
        "Supported unrelated education administration.",
      ].indexOf(theme) + 1}`));
    }
    expect(await canonicalBytes(fixture.workspace, fixture.batchId)).toEqual(before);
    expect((await listEvidenceClaimReviews(fixture.workspace)).every(
      ({ status }) => status === "missing",
    )).toBe(true);
    const tamperedManifest = JSON.parse(
      await readFile(workspacePaths.indexManifestPath, "utf8"),
    ) as Record<string, unknown>;
    tamperedManifest.manifestId = "evidence-review-workspace-manifest_00000000000000000000";
    await writeJsonAtomic(workspacePaths.indexManifestPath, tamperedManifest);
    expect((await getEvidenceReviewWorkspaceStatus(fixture.workspace, fixture.batchId)).status)
      .toBe("invalid");
  });

  it("returns already-current and preserves IDs, hashes, bytes, timestamps, and mtimes", async () => {
    const fixture = await workspaceFixture();
    const first = await renderEvidenceReviewWorkspace(
      fixture.workspace,
      fixture.batchId,
      { now: () => new Date(TIME_1) },
    );
    const paths = evidenceReviewWorkspacePaths(fixture.workspace, fixture.batchId);
    const indexBytes = await readFile(paths.indexPath);
    const manifestBytes = await readFile(paths.indexManifestPath);
    const indexMtime = (await stat(paths.indexPath)).mtimeMs;
    const manifestMtime = (await stat(paths.indexManifestPath)).mtimeMs;
    const second = await renderEvidenceReviewWorkspace(
      fixture.workspace,
      fixture.batchId,
      { rebuild: true, now: () => new Date(TIME_2) },
    );

    expect(second).toMatchObject({
      result: "already-current",
      renderId: first.renderId,
    });
    expect(await readFile(paths.indexPath)).toEqual(indexBytes);
    expect(await readFile(paths.indexManifestPath)).toEqual(manifestBytes);
    expect((await stat(paths.indexPath)).mtimeMs).toBe(indexMtime);
    expect((await stat(paths.indexManifestPath)).mtimeMs).toBe(manifestMtime);
    expect(await getEvidenceReviewWorkspaceStatus(fixture.workspace, fixture.batchId))
      .toMatchObject({
        status: "current",
        outputHashesMatch: true,
        manifestSetMatches: true,
        inputsMatch: true,
        rendererMatches: true,
      });
  });

  it("marks an older Markdown renderer version stale without changing canonical JSON", async () => {
    const fixture = await workspaceFixture();
    await renderEvidenceReviewWorkspace(fixture.workspace, fixture.batchId);
    const before = await canonicalBytes(fixture.workspace, fixture.batchId);
    const paths = evidenceReviewWorkspacePaths(fixture.workspace, fixture.batchId);
    const manifest = JSON.parse(await readFile(paths.indexManifestPath, "utf8")) as {
      renderer: { name: string; version: string; mode: "deterministic" };
    };
    manifest.renderer.version = "1";
    await writeJsonAtomic(paths.indexManifestPath, manifest);

    expect(await getEvidenceReviewWorkspaceStatus(fixture.workspace, fixture.batchId))
      .toMatchObject({
        status: "stale",
        rendererMatches: false,
        inputsMatch: true,
      });
    expect(await canonicalBytes(fixture.workspace, fixture.batchId)).toEqual(before);
  });

  it("reports missing, stale, rebuilt, and invalid lifecycle without consuming Markdown edits", async () => {
    const fixture = await workspaceFixture();
    expect(await getEvidenceReviewWorkspaceStatus(fixture.workspace, fixture.batchId))
      .toMatchObject({ status: "missing" });
    await renderEvidenceReviewWorkspace(fixture.workspace, fixture.batchId);
    const before = await canonicalBytes(fixture.workspace, fixture.batchId);
    const sourcesPath = path.join(fixture.workspace, "kb/sources.json");
    const sources = JSON.parse(await readFile(sourcesPath, "utf8")) as Source[];
    sources[0] = { ...sources[0]!, title: "Updated deterministic source label" };
    await writeJsonAtomic(sourcesPath, sources);

    expect(await getEvidenceReviewWorkspaceStatus(fixture.workspace, fixture.batchId))
      .toMatchObject({ status: "stale", inputsMatch: false });
    await expect(renderEvidenceReviewWorkspace(fixture.workspace, fixture.batchId))
      .rejects.toThrow(/use explicit --rebuild/);
    const rebuilt = await renderEvidenceReviewWorkspace(
      fixture.workspace,
      fixture.batchId,
      { rebuild: true, now: () => new Date(TIME_2) },
    );
    expect(rebuilt.result).toBe("rebuilt");
    expect((await getEvidenceReviewWorkspaceStatus(fixture.workspace, fixture.batchId)).status)
      .toBe("current");
    const after = await canonicalBytes(fixture.workspace, fixture.batchId);
    expect(after.batch).toEqual(before.batch);
    expect(after.template).toEqual(before.template);
    const canonicalBeforeEdit = await canonicalBytes(fixture.workspace, fixture.batchId);
    await writeFile(
      path.join(fixture.workspace, rebuilt.claimWorkspacePaths[0]!),
      "# Human edit that ProofLayer must ignore\n",
      "utf8",
    );

    expect(await getEvidenceReviewWorkspaceStatus(fixture.workspace, fixture.batchId))
      .toMatchObject({ status: "invalid", outputHashesMatch: false });
    expect(await canonicalBytes(fixture.workspace, fixture.batchId)).toEqual(canonicalBeforeEdit);
    expect((await listEvidenceClaimReviews(fixture.workspace)).every(
      ({ status }) => status === "missing",
    )).toBe(true);
  });
});

async function workspaceFixture() {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-review-workspace-"));
  const inputPath = path.join(workspace, "imports", "natterbox.md");
  await mkdir(path.dirname(inputPath), { recursive: true });
  await writeFile(inputPath, NATTERBOX_JOB_DESCRIPTION, "utf8");
  const target = await createJobTarget(workspace, {
    file: inputPath,
    title: "Product Owner - Conversational AI and Agents",
    company: "Natterbox",
    location: "London, England, United Kingdom",
    workingModel: "hybrid",
  });
  await analyzeTarget(workspace, target.target.id, { now: () => new Date(TIME_1) });
  await buildJobRequirements(workspace, target.target.id, { now: () => new Date(TIME_1) });

  const source: Source = {
    id: "src_review_workspace",
    type: "markdown",
    path: "/Users/synthetic-private/evidence.md",
    title: "Reviewed synthetic evidence",
    importedAt: TIME_1,
    hash: hashText("synthetic reviewed source"),
    visibility: "generic_only",
    status: "active",
  };
  const themes = [
    "Supported AI product workflows and engineering collaboration.",
    "Supported product discovery and prioritisation.",
    "Supported platform extensibility.",
    "Supported unrelated education administration.",
  ];
  const evidence = themes.map((text, index): EvidenceItem => ({
    id: `evi_workspace_${index + 1}`,
    sourceIds: [source.id],
    category: index === 3 ? "education" : index === 2 ? "project" : "responsibility",
    text,
    normalizedSummary: text,
    ...(index === 2 ? { project: "Synthetic Platform Project", parentProjectId: "project_platform" } : {}),
    ...(index !== 2 ? { parentRoleId: "role_product" } : {}),
    sourceSection: index === 3 ? "Education" : "Experience",
    technologies: index === 0 ? ["TypeScript"] : [],
    domains: index === 0 ? ["AI"] : index === 2 ? ["platform"] : [],
    visibility: "generic_only",
    sensitivityFlags: [],
    confidence: "high",
  }));
  const claims = themes.map((text, index): Claim => ({
    id: `claim_workspace_${index + 1}`,
    claim: text,
    type: index === 3 ? "education_claim" : index === 2 ? "project_claim" : "responsibility_claim",
    supportingEvidenceIds: [evidence[index]!.id],
    ...(index === 2 ? { parentProjectId: "project_platform" } : {}),
    ...(index !== 2 ? { parentRoleId: "role_product" } : {}),
    sourceSection: index === 3 ? "Education" : "Experience",
    extractionConfidence: "high",
    factualConfidence: "medium",
    corroborationLevel: "single_source",
    approvalStatus: "needs_confirmation",
    outputReadiness: "generic_only",
    confidence: "medium",
    publicSafe: false,
    needsConfirmation: true,
    metricStatus: "no_metric",
    unsafeWording: [],
  }));
  const kb = path.join(workspace, "kb");
  await mkdir(kb, { recursive: true });
  await writeJsonAtomic(path.join(kb, "sources.json"), [source]);
  await writeJsonAtomic(path.join(kb, "evidence-items.json"), evidence);
  await writeJsonAtomic(path.join(kb, "claims.json"), claims);
  const batch = await buildEvidenceReviewBatch(workspace, target.target.id, {
    subsetSize: 4,
    now: () => new Date(TIME_1),
  });
  return { workspace, batchId: batch.batchId };
}

async function canonicalBytes(workspace: string, batchId: string) {
  const batchPaths = evidenceReviewBatchPaths(workspace, batchId);
  const batch = JSON.parse(await readFile(batchPaths.batchPath, "utf8")) as {
    controlledReviewSubsetClaimIds: string[];
  };
  const firstClaim = batch.controlledReviewSubsetClaimIds[0]!;
  return {
    batch: await readFile(batchPaths.batchPath),
    batchManifest: await readFile(batchPaths.manifestPath),
    template: await readFile(path.join(
      batchPaths.templateRootPath,
      `${firstClaim}.json`,
    )),
  };
}
