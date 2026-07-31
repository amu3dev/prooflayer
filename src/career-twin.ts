import path from "node:path";
import { loadEffectiveEvidenceClaimReviews } from "./evidence-claim-review.js";
import { listEvidenceReviewBatches, showEvidenceReviewBatch } from "./evidence-review-batch.js";
import { pathExists, readJson } from "./fs-utils.js";
import { loadPublicProfile } from "./public-profile.js";
import {
  CareerProfileSchema,
  ClaimSchema,
  EvidenceItemSchema,
  SourceSchema,
  type CareerProfile,
  type Claim,
  type EvidenceItem,
  type Source,
  type Target,
} from "./schemas.js";
import { listTargets } from "./targets.js";
import { getLatestChanges, getWorkspaceStatus, type LatestRefresh } from "./update-impact.js";
import type { OutputManifest, OutputManifestEntry } from "./variant-generator.js";

export type CareerTwinTrustLabel =
  | "Ready to use"
  | "Some details may need confirmation"
  | "Blocked from public use";

export interface CareerTwinSourceProjection {
  id: string;
  label: string;
  type: string;
  status: string;
  visibility: string;
  importedAt: string;
}

export interface CareerTwinQuestion {
  id: string;
  title: string;
  question: string;
  reason: string;
  priority: "high" | "medium" | "low";
  batchId: string;
  targetId: string;
  claimId: string;
}

export interface CareerTwinOutputProjection {
  id: string;
  label: string;
  kind: "draft" | "final" | "export";
  freshness: "current" | "stale";
  generatedAt: string;
  files: string[];
}

export interface CareerTwinProjection {
  identity: {
    name: string;
    headline: string;
    location?: string;
    summary: string;
  };
  profile: CareerProfile;
  roles: CareerProfile["roles"];
  projects: CareerProfile["projects"];
  skills: CareerProfile["skills"];
  capabilities: string[];
  domains: string[];
  outcomes: string[];
  verifiedMetrics: string[];
  sources: CareerTwinSourceProjection[];
  sourceTypeCounts: Array<{ type: string; label: string; count: number }>;
  questions: CareerTwinQuestion[];
  targets: Target[];
  outputs: CareerTwinOutputProjection[];
  status: {
    trustLabel: CareerTwinTrustLabel;
    readyForOutputs: boolean;
    sourceCount: number;
    evidenceCount: number;
    claimCount: number;
    reviewedClaimCount: number;
    resumeReadyClaimCount: number;
    unresolvedClaimCount: number;
    unresolvedMaterialQuestionCount: number;
    lastUpdate?: string;
    attentionRequired: boolean;
    sourceMessage: string;
  };
  latestRefresh: LatestRefresh | null;
  advancedReviewBatchId?: string;
}

export async function projectCareerTwin(workspace: string): Promise<CareerTwinProjection> {
  const [profile, sources, evidence, claims, publicProfile, latestRefresh, workspaceStatus, targets, outputManifest] =
    await Promise.all([
      loadCareerProfile(workspace),
      loadArray(workspace, "kb/sources.json", SourceSchema),
      loadArray(workspace, "kb/evidence-items.json", EvidenceItemSchema),
      loadArray(workspace, "kb/claims.json", ClaimSchema),
      loadPublicProfile(workspace),
      getLatestChanges(workspace),
      getWorkspaceStatus(workspace),
      listTargets(workspace),
      readJson<OutputManifest>(path.join(workspace, "outputs/output-manifest.json"), {
        schemaVersion: 1,
        updatedAt: new Date(0).toISOString(),
        outputs: [],
      }),
    ]);
  const effectiveReviews = await loadEffectiveEvidenceClaimReviews(workspace);
  const reviewBatches = await listEvidenceReviewBatches(workspace);
  const claimById = new Map(claims.map((claim) => [claim.id, claim]));
  const questions: CareerTwinQuestion[] = [];
  let advancedReviewBatchId: string | undefined;

  for (const status of reviewBatches.filter((entry) => entry.status === "current")) {
    const batch = await showEvidenceReviewBatch(workspace, status.batchId);
    const unresolved = batch.claims.filter((entry) =>
      entry.selectedForControlledReview && !effectiveReviews.has(entry.claimId));
    if (unresolved.length > 0 && !advancedReviewBatchId) advancedReviewBatchId = batch.id;
    for (const entry of unresolved) {
      const claim = claimById.get(entry.claimId);
      if (!claim) continue;
      questions.push({
        id: `clarification-${batch.id}-${claim.id}`,
        title: deterministicTitle(claim.claim),
        question: clarificationQuestion(claim),
        reason: humanSelectionReason(entry.priorityBasis),
        priority: entry.priority,
        batchId: batch.id,
        targetId: batch.targetId,
        claimId: claim.id,
      });
    }
  }

  const reviewed = [...effectiveReviews.values()];
  const approved = reviewed.filter(({ review }) =>
    ["approved", "approved-with-qualifier"].includes(review.decision));
  const resumeReady = approved.filter(({ review }) =>
    review.publicSafety === "public-safe" && review.resumeReadiness === "resume-ready");
  const outcomes = resumeReady
    .filter(({ review }) => review.classification.claimNature === "achievement")
    .map(({ review }) => review.approvedProjection?.text ?? review.reviewedClaimText);
  const verifiedMetrics = resumeReady
    .filter(({ review }) => review.metricReview.state === "verified" && review.metricReview.exactText)
    .map(({ review }) => review.metricReview.exactText!);
  const currentOutputs = outputManifest.outputs
    .filter((entry) => entry.freshness === "current")
    .sort((left, right) => right.generatedAt.localeCompare(left.generatedAt));
  const readyForOutputs = resumeReady.length > 0 || currentOutputs.some((entry) =>
    entry.publicationStatus === "final" || entry.publicationStatus === "export");
  const trustLabel: CareerTwinTrustLabel = readyForOutputs
    ? questions.length > 0 || claims.length > reviewed.length
      ? "Some details may need confirmation"
      : "Ready to use"
    : claims.some((claim) => claim.approvalStatus === "blocked")
      ? "Blocked from public use"
      : "Some details may need confirmation";
  const sourceProjections = sources.map((source) => ({
    id: source.id,
    label: source.title ?? sourceTypeLabel(source.type),
    type: source.type,
    status: source.status,
    visibility: source.visibility,
    importedAt: source.importedAt,
  }));

  return {
    identity: {
      name: publicProfile?.publicName ?? "Your Career Twin",
      headline: publicProfile?.headlineOverride
        ?? profile.positioningCandidates[0]
        ?? "Professional profile",
      ...(publicProfile?.location ? { location: publicProfile.location } : {}),
      summary: publicProfile?.publicSummaryOverride
        ?? profile.summaryThemes.slice(0, 2).join(" ")
        ?? "ProofLayer is organizing your professional history from the sources you provide.",
    },
    profile,
    roles: profile.roles,
    projects: profile.projects,
    skills: profile.skills,
    capabilities: [...new Set([...profile.positioningCandidates, ...profile.summaryThemes])].slice(0, 8),
    domains: profile.domains,
    outcomes,
    verifiedMetrics,
    sources: sourceProjections,
    sourceTypeCounts: countSourceTypes(sources),
    questions: questions.sort((left, right) =>
      priorityRank(left.priority) - priorityRank(right.priority) || left.title.localeCompare(right.title)),
    targets,
    outputs: currentOutputs.map(toOutputProjection),
    status: {
      trustLabel,
      readyForOutputs,
      sourceCount: sources.length,
      evidenceCount: evidence.length,
      claimCount: claims.length,
      reviewedClaimCount: reviewed.length,
      resumeReadyClaimCount: resumeReady.length,
      unresolvedClaimCount: Math.max(0, claims.length - reviewed.length),
      unresolvedMaterialQuestionCount: questions.length,
      lastUpdate: latestRefresh?.refreshedAt ?? profile.updatedAt,
      attentionRequired: latestRefresh?.attentionRequired ?? workspaceStatus.warningCount > 0,
      sourceMessage: sources.length > 0
        ? "This is enough to start. You can add more later."
        : "Add what you have. One source is enough to begin.",
    },
    latestRefresh,
    ...(advancedReviewBatchId ? { advancedReviewBatchId } : {}),
  };
}

async function loadCareerProfile(workspace: string): Promise<CareerProfile> {
  const profilePath = path.join(workspace, "kb/career-profile.json");
  if (!(await pathExists(profilePath))) {
    return CareerProfileSchema.parse({
      id: "career_profile",
      updatedAt: new Date(0).toISOString(),
      positioningCandidates: [],
      summaryThemes: [],
      roles: [],
      projects: [],
      skills: [],
      domains: [],
      approvedClaims: [],
      claimsNeedingConfirmation: [],
      blockedClaims: [],
      resumeReadyClaims: [],
      genericOnlyClaims: [],
      internalOnlyClaims: [],
      publicSafetyRules: [],
    });
  }
  return CareerProfileSchema.parse(await readJson<unknown>(profilePath, null));
}

async function loadArray<T>(
  workspace: string,
  relativePath: string,
  schema: { array: () => { parse: (value: unknown) => T[] } },
): Promise<T[]> {
  return schema.array().parse(await readJson<unknown>(path.join(workspace, relativePath), []));
}

function toOutputProjection(entry: OutputManifestEntry): CareerTwinOutputProjection {
  const role = entry.variantRoleKey === "ai-product"
    ? "AI Product Manager"
    : entry.variantRoleKey === "tpm"
      ? "Technical Product Manager"
      : entry.variantRoleKey.replaceAll("-", " ");
  return {
    id: entry.id,
    label: `${titleCase(role)} ${entry.publicationStatus === "export" ? "export package" : entry.publicationStatus}`,
    kind: entry.publicationStatus,
    freshness: entry.freshness,
    generatedAt: entry.generatedAt,
    files: entry.generatedFiles,
  };
}

function countSourceTypes(sources: Source[]): CareerTwinProjection["sourceTypeCounts"] {
  const counts = new Map<string, number>();
  for (const source of sources) counts.set(source.type, (counts.get(source.type) ?? 0) + 1);
  return [...counts.entries()]
    .map(([type, count]) => ({ type, label: sourceTypeLabel(type), count }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

function sourceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    cv: "CV or resume",
    linkedin_export: "LinkedIn profile export",
    github_summary: "GitHub summary",
    project_note: "Project notes",
    recommendation: "Recommendation",
    certificate: "Certificate",
    markdown: "Written notes",
    pdf: "PDF document",
    docx: "Word document",
  };
  return labels[type] ?? titleCase(type.replaceAll("_", " "));
}

function clarificationQuestion(claim: Claim): string {
  if (claim.metricStatus === "needs_metric") return `Is the number in “${deterministicTitle(claim.claim)}” exact and safe to use?`;
  if (claim.type === "project_claim") return `Is “${deterministicTitle(claim.claim)}” project work, employment responsibility, or both?`;
  return `Can this statement be confirmed and used in a public resume: “${deterministicTitle(claim.claim)}”?`;
}

function humanSelectionReason(values: string[]): string {
  const value = values[0];
  if (!value) return "This detail could materially affect a current output.";
  return value.replaceAll("_", " ").replace(/\.$/, "") + ".";
}

function deterministicTitle(value: string, limit = 92): string {
  const first = value.trim().split(/(?<=[.!?])\s+/, 1)[0] ?? value.trim();
  return first.length <= limit ? first : `${first.slice(0, limit - 1).trimEnd()}…`;
}

function priorityRank(priority: CareerTwinQuestion["priority"]): number {
  return priority === "high" ? 0 : priority === "medium" ? 1 : 2;
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
