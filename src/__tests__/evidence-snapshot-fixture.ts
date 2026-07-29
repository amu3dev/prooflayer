import { readFile } from "node:fs/promises";
import path from "node:path";
import { createEvidenceClaimReview } from "../evidence-claim-review.js";
import { buildEvidenceSnapshot } from "../evidence-snapshots.js";
import { hashText } from "../fs-utils.js";
import type { Claim, EvidenceItem, Source } from "../schemas.js";
import { pinTargetEvidenceSnapshot } from "../target-evidence-pin.js";

export async function pinCurrentEvidenceSnapshot(
  workspace: string,
  targetId: string,
  now?: () => Date,
): Promise<string> {
  await createExplicitFixtureReviews(workspace, now);
  const snapshot = await buildEvidenceSnapshot(workspace, { now });
  await pinTargetEvidenceSnapshot(
    workspace,
    targetId,
    snapshot.snapshotId,
    { now },
  );
  return snapshot.snapshotId;
}

export async function createExplicitFixtureReviews(
  workspace: string,
  now?: () => Date,
): Promise<void> {
  const [claims, evidence, sources] = await Promise.all([
    readJsonFile<Claim[]>(path.join(workspace, "kb/claims.json")),
    readJsonFile<EvidenceItem[]>(path.join(workspace, "kb/evidence-items.json")),
    readJsonFile<Source[]>(path.join(workspace, "kb/sources.json")),
  ]);
  const evidenceById = new Map(evidence.map((entry) => [entry.id, entry]));
  const sourceById = new Map(sources.map((entry) => [entry.id, entry]));
  for (const claim of claims) {
    if (
      claim.approvalStatus !== "approved" ||
      claim.outputReadiness !== "resume_ready" ||
      !claim.publicSafe ||
      claim.needsConfirmation
    ) continue;
    const supporting = claim.supportingEvidenceIds.map((id) => evidenceById.get(id));
    if (supporting.some((entry) => !entry)) continue;
    const sourceRecords = supporting.flatMap((entry) => entry!.sourceIds)
      .map((id) => sourceById.get(id));
    if (
      supporting.some((entry) =>
        ["private", "do_not_use", "sensitive"].includes(entry!.visibility) ||
        entry!.sensitivityFlags.length > 0) ||
      sourceRecords.some((entry) =>
        !entry || ["private", "do_not_use", "sensitive"].includes(entry.visibility))
    ) continue;
    const metric = claim.metricStatus === "verified_metric" &&
      supporting.some((entry) => normalize(entry!.text).includes(normalize(claim.approvedWording ?? claim.claim)));
    const metricText = claim.approvedWording ?? claim.claim;
    await createEvidenceClaimReview(workspace, claim.id, {
      schemaVersion: 1,
      claimId: claim.id,
      reviewedClaimSha256: hashText(claim.claim),
      decision: "approved",
      requiredQualifiers: [],
      factualSupport: "supported",
      scope: "exact",
      publicSafety: "public-safe",
      resumeReadiness: "resume-ready",
      eligibleForRoleMatching: true,
      eligibleForJobMapping: true,
      metricReview: metric
        ? {
            state: "verified",
            exactText: metricText,
            unit: metricUnit(metricText),
            scope: claim.parentRoleId ?? claim.parentProjectId ?? claim.sourceSection ?? "reviewed evidence",
            qualifiers: [],
          }
        : { state: claim.metricStatus === "no_metric" ? "not-a-metric" : "unverified", qualifiers: [] },
      classification: {
        workContext: claim.parentProjectId
          ? "project"
          : claim.parentRoleId
            ? "employment"
            : claim.type === "education_claim"
              ? "education"
              : claim.type === "certification_claim"
                ? "certification"
                : "other",
        claimNature: claim.type === "impact_claim"
          ? "achievement"
          : claim.type === "responsibility_claim"
            ? "responsibility"
            : claim.type === "education_claim" || claim.type === "certification_claim"
              ? "credential"
              : "capability",
      },
      risks: [],
      warnings: [],
      ambiguities: [],
      reviewerRationale: "Explicit synthetic fixture review for eligibility-boundary tests.",
    }, { now });
  }
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9%+]+/g, " ").trim();
}

function metricUnit(value: string): string {
  const match = value.match(/\b\d+(?:[.,]\d+)?(?:%|\+)?\s+([A-Za-z][A-Za-z-]*)/);
  return match?.[1] ?? (value.includes("%") ? "%" : "units");
}
