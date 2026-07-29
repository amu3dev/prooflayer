import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildEvidenceReviewBatch } from "../evidence-review-batch.js";
import { hashText, writeJsonAtomic } from "../fs-utils.js";
import { buildJobRequirements } from "../job-requirements.js";
import type { Claim, EvidenceItem, Source } from "../schemas.js";
import { analyzeTarget } from "../target-analysis.js";
import { createJobTarget } from "../targets.js";
import { NATTERBOX_JOB_DESCRIPTION } from "./fixtures/natterbox-job-description.js";

export const UI_FIXTURE_TIME = "2026-07-29T10:00:00.000Z";

export async function createEvidenceReviewUiFixture(
  options: { visibility?: Source["visibility"] } = {},
) {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-review-ui-"));
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
  await analyzeTarget(workspace, target.target.id, { now: () => new Date(UI_FIXTURE_TIME) });
  await buildJobRequirements(workspace, target.target.id, { now: () => new Date(UI_FIXTURE_TIME) });

  const visibility = options.visibility ?? "generic_only";
  const source: Source = {
    id: "src_review_ui",
    type: "markdown",
    path: "/Users/synthetic-private/review-ui-evidence.md",
    title: "Synthetic reviewed evidence",
    importedAt: UI_FIXTURE_TIME,
    hash: hashText("synthetic reviewed UI source"),
    visibility,
    status: "active",
  };
  const themes = [
    "Supported AI product workflows and engineering collaboration.",
    "Supported product discovery and prioritisation.",
    "Supported platform extensibility <script>alert('unsafe')</script>.",
    "Supported unrelated education administration.",
  ];
  const evidence = themes.map((text, index): EvidenceItem => ({
    id: `evi_review_ui_${index + 1}`,
    sourceIds: [source.id],
    category: index === 3 ? "education" : index === 2 ? "project" : "responsibility",
    text,
    normalizedSummary: text,
    ...(index === 2
      ? { project: "Synthetic Platform Project", parentProjectId: "project_platform" }
      : { parentRoleId: "role_product" }),
    sourceSection: index === 3 ? "Education" : "Experience",
    technologies: index === 0 ? ["TypeScript"] : [],
    domains: index === 0 ? ["AI"] : index === 2 ? ["platform"] : [],
    visibility,
    sensitivityFlags: [],
    confidence: "high",
  }));
  const claims = themes.map((text, index): Claim => ({
    id: `claim_review_ui_${index + 1}`,
    claim: text,
    type: index === 3
      ? "education_claim"
      : index === 2
        ? "project_claim"
        : "responsibility_claim",
    supportingEvidenceIds: [evidence[index]!.id],
    ...(index === 2
      ? { parentProjectId: "project_platform" }
      : { parentRoleId: "role_product" }),
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
    now: () => new Date(UI_FIXTURE_TIME),
  });
  return {
    workspace,
    batchId: batch.batchId,
    targetId: target.target.id,
    claims,
    evidence,
  };
}

export function validApprovedFields(
  overrides: Record<string, string | undefined> = {},
): Record<string, string | undefined> {
  return {
    decision: "approved",
    reviewerRationale: "The reviewed claim is directly supported and remains within the recorded scope.",
    factualSupport: "supported",
    scope: "exact",
    publicSafety: "public-safe",
    resumeReadiness: "resume-ready",
    eligibleForRoleMatching: "true",
    eligibleForJobMapping: "true",
    metricState: "not-a-metric",
    workContext: "project",
    claimNature: "capability",
    ...overrides,
  };
}
