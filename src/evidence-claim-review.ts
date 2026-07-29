import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  walkFiles,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  EVIDENCE_CLAIM_REVIEW_POLICY_NAME,
  EVIDENCE_CLAIM_REVIEW_POLICY_VERSION,
  EVIDENCE_CLAIM_REVIEW_SCHEMA_VERSION,
  EvidenceClaimReviewInputSchema,
  EvidenceClaimReviewManifestSchema,
  EvidenceClaimReviewSchema,
  type EvidenceClaimReview,
  type EvidenceClaimReviewInput,
  type EvidenceClaimReviewManifest,
  type EvidenceClaimReviewSnapshotProjection,
} from "./evidence-claim-review-schemas.js";
import {
  ClaimSchema,
  EvidenceItemSchema,
  SourceSchema,
  type Claim,
  type EvidenceItem,
  type Source,
} from "./schemas.js";
import { stableJson } from "./target-proposal.js";

const REVIEW_ROOT = "evidence-reviews/claims";
const REVIEW_FILE = "evidence-claim-review.json";
const MANIFEST_FILE = "evidence-claim-review-manifest.json";

export interface EvidenceClaimReviewPaths {
  rootRelativePath: string;
  rootPath: string;
  reviewRelativePath: string;
  reviewPath: string;
  manifestRelativePath: string;
  manifestPath: string;
}

export interface CreateEvidenceClaimReviewResult {
  reviewId: string;
  claimId: string;
  result: "created" | "already-current";
  status: "current";
  reviewPath: string;
  manifestPath: string;
  decision: EvidenceClaimReview["decision"];
  eligibleForRoleMatching: boolean;
  eligibleForJobMapping: boolean;
  approvedProjectionId?: string;
}

export interface EvidenceClaimReviewStatus {
  claimId: string;
  reviewId?: string;
  reviewExists: boolean;
  manifestExists: boolean;
  reviewHashMatches: boolean | null;
  claimHashMatches: boolean | null;
  evidenceHashMatches: boolean | null;
  provenanceHashMatches: boolean | null;
  policyMatches: boolean | null;
  status: "missing" | "current" | "stale" | "invalid" | "superseded";
  supersededByReviewId?: string;
  reasons: string[];
  reviewPath?: string;
  manifestPath?: string;
}

export interface EvidenceClaimReviewListEntry {
  claimId: string;
  effectiveReviewId?: string;
  status: EvidenceClaimReviewStatus["status"];
  decision?: EvidenceClaimReview["decision"];
  eligibleForRoleMatching?: boolean;
  eligibleForJobMapping?: boolean;
  versionCount: number;
}

export interface LoadedEffectiveEvidenceClaimReview {
  review: EvidenceClaimReview;
  manifest: EvidenceClaimReviewManifest;
  reviewSha256: string;
  projection: EvidenceClaimReviewSnapshotProjection;
}

interface FoundationData {
  claims: Claim[];
  evidence: EvidenceItem[];
  sources: Source[];
  claimById: Map<string, Claim>;
  evidenceById: Map<string, EvidenceItem>;
  sourceById: Map<string, Source>;
}

export async function readEvidenceClaimReviewInputFile(
  filePath: string,
): Promise<EvidenceClaimReviewInput> {
  return EvidenceClaimReviewInputSchema.parse(
    await readJson<unknown>(path.resolve(filePath), null),
  );
}

export async function createEvidenceClaimReview(
  workspace: string,
  claimId: string,
  rawInput: EvidenceClaimReviewInput,
  options: { now?: () => Date } = {},
): Promise<CreateEvidenceClaimReviewResult> {
  const input = EvidenceClaimReviewInputSchema.parse(rawInput);
  if (input.claimId !== claimId) {
    throw new Error(`Review input claim ID does not match requested claim: ${claimId}`);
  }
  const foundation = await loadFoundation(workspace);
  const claim = foundation.claimById.get(claimId);
  if (!claim) throw new Error(`Unknown Evidence Foundation claim ID: ${claimId}`);
  const dependencies = reviewDependencies(claim, foundation);
  validateReviewInput(input, claim, dependencies.evidence, dependencies.sources);
  const identity = reviewIdentityInput(input, claim, dependencies);
  const reviewId = `evidence-claim-review_${hashText(stableJson(identity)).slice(0, 20)}`;

  const reviews = await loadClaimReviewVersions(workspace, claimId);
  const effective = effectiveReviewFrom(reviews);
  if (effective?.review.id === reviewId && !input.supersedesReviewId) {
    const paths = evidenceClaimReviewPaths(workspace, claimId, reviewId);
    const status = await getEvidenceClaimReviewStatus(workspace, claimId, reviewId);
    if (status.status !== "current") {
      throw new Error(`Unchanged claim review is ${status.status}; it was not overwritten.`);
    }
    return resultFor(effective.review, paths, "already-current");
  }
  if (effective && input.supersedesReviewId !== effective.review.id) {
    throw new Error(
      `Claim ${claimId} already has effective review ${effective.review.id}; ` +
      "a replacement must explicitly set supersedesReviewId to that review.",
    );
  }
  if (!effective && input.supersedesReviewId) {
    throw new Error(`Cannot supersede missing effective review: ${input.supersedesReviewId}`);
  }

  const paths = evidenceClaimReviewPaths(workspace, claimId, reviewId);
  if (await pathExists(paths.rootPath)) {
    const status = await getEvidenceClaimReviewStatus(workspace, claimId, reviewId);
    if (status.status !== "current" && status.status !== "superseded") {
      throw new Error(
        `Evidence claim review identity exists but is ${status.status}; it was not overwritten.`,
      );
    }
    const existing = await loadReviewAt(paths);
    if (stableJson(reviewSemanticContent(existing.review)) !== stableJson(reviewSemanticFromInput(input))) {
      throw new Error(`Evidence claim review identity collision: ${reviewId}`);
    }
    return resultFor(existing.review, paths, "already-current");
  }

  const timestamp = (options.now ?? (() => new Date()))().toISOString();
  const approvedText = input.decision === "approved-with-qualifier"
    ? input.correctedClaim!
    : input.decision === "approved"
      ? claim.claim
      : undefined;
  const approvedProjection = approvedText
    ? {
        id: `approved-claim-projection_${hashText(stableJson({
          claimId,
          text: approvedText,
          qualifiers: sortedUnique(input.requiredQualifiers),
          reviewIdentity: reviewId,
        })).slice(0, 20)}`,
        claimId,
        text: approvedText,
        textSha256: hashText(approvedText),
        requiredQualifiers: sortedUnique(input.requiredQualifiers),
      }
    : undefined;
  const review = EvidenceClaimReviewSchema.parse({
    schemaVersion: EVIDENCE_CLAIM_REVIEW_SCHEMA_VERSION,
    id: reviewId,
    policy: {
      name: EVIDENCE_CLAIM_REVIEW_POLICY_NAME,
      version: EVIDENCE_CLAIM_REVIEW_POLICY_VERSION,
      mode: "human-controlled",
    },
    claimId,
    primaryEvidenceItemId: dependencies.evidence[0]!.id,
    evidenceItemIds: dependencies.evidence.map(({ id }) => id).sort(),
    reviewedClaimText: claim.claim,
    reviewedClaimSha256: hashText(claim.claim),
    claimRecordSha256: dependencies.claimRecordSha256,
    evidenceInventorySha256: dependencies.evidenceInventorySha256,
    provenanceInventorySha256: dependencies.provenanceInventorySha256,
    evidenceReferences: dependencies.evidence.map((evidence) => ({
      evidenceItemId: evidence.id,
      evidenceItemSha256: hashText(stableJson(evidence)),
      category: evidence.category,
      ...(evidence.parentRoleId ? { parentRoleId: evidence.parentRoleId } : {}),
      ...(evidence.parentProjectId ? { parentProjectId: evidence.parentProjectId } : {}),
      sourceReferences: evidence.sourceIds.map((sourceId) => {
        const source = foundation.sourceById.get(sourceId)!;
        return {
          sourceId,
          sourceType: source.type,
          logicalPath: `evidence-foundation/sources/${safeSegment(sourceId)}`,
          sha256: source.hash,
          visibility: source.visibility,
          status: source.status,
        };
      }).sort((left, right) => left.sourceId.localeCompare(right.sourceId)),
    })),
    decision: input.decision,
    ...(approvedProjection ? { approvedProjection } : {}),
    requiredQualifiers: sortedUnique(input.requiredQualifiers),
    factualSupport: input.factualSupport,
    scope: input.scope,
    publicSafety: input.publicSafety,
    resumeReadiness: input.resumeReadiness,
    eligibleForRoleMatching: input.eligibleForRoleMatching,
    eligibleForJobMapping: input.eligibleForJobMapping,
    metricReview: {
      state: input.metricReview.state,
      ...(input.metricReview.exactText
        ? {
            exactText: input.metricReview.exactText,
            exactTextSha256: hashText(input.metricReview.exactText),
          }
        : {}),
      ...(input.metricReview.unit ? { unit: input.metricReview.unit } : {}),
      ...(input.metricReview.scope ? { scope: input.metricReview.scope } : {}),
      qualifiers: sortedUnique(input.metricReview.qualifiers),
    },
    classification: input.classification,
    risks: input.risks.map((risk) => ({
      id: `evidence-review-risk_${hashText(stableJson({ claimId, ...risk })).slice(0, 16)}`,
      ...risk,
    })).sort((left, right) => left.id.localeCompare(right.id)),
    warnings: sortedUnique(input.warnings),
    ambiguities: sortedUnique(input.ambiguities),
    reviewerRationale: input.reviewerRationale,
    ...(input.supersedesReviewId
      ? { supersedesReviewId: input.supersedesReviewId }
      : {}),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  await writeJsonAtomic(paths.reviewPath, review);
  const reviewSha256 = await hashFile(paths.reviewPath);
  const manifest = EvidenceClaimReviewManifestSchema.parse({
    schemaVersion: EVIDENCE_CLAIM_REVIEW_SCHEMA_VERSION,
    reviewId,
    claimId,
    reviewPath: paths.reviewRelativePath,
    reviewSha256,
    policyName: EVIDENCE_CLAIM_REVIEW_POLICY_NAME,
    policyVersion: EVIDENCE_CLAIM_REVIEW_POLICY_VERSION,
    claimRecordSha256: dependencies.claimRecordSha256,
    evidenceInventorySha256: dependencies.evidenceInventorySha256,
    provenanceInventorySha256: dependencies.provenanceInventorySha256,
    ...(input.supersedesReviewId
      ? { supersedesReviewId: input.supersedesReviewId }
      : {}),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
  const status = await getEvidenceClaimReviewStatus(workspace, claimId, reviewId);
  if (status.status !== "current") {
    throw new Error(`Created claim review failed validation: ${status.reasons.join(" ")}`);
  }
  return resultFor(review, paths, "created");
}

export async function showEvidenceClaimReview(
  workspace: string,
  claimId: string,
): Promise<EvidenceClaimReview> {
  const reviews = await loadClaimReviewVersions(workspace, claimId);
  const effective = effectiveReviewFrom(reviews);
  if (!effective) throw new Error(`No effective evidence claim review exists for: ${claimId}`);
  const status = await getEvidenceClaimReviewStatus(workspace, claimId, effective.review.id);
  if (status.status !== "current") {
    throw new Error(`Effective claim review is ${status.status}: ${status.reasons.join(" ")}`);
  }
  return effective.review;
}

export async function listEvidenceClaimReviews(
  workspace: string,
): Promise<EvidenceClaimReviewListEntry[]> {
  const foundation = await loadFoundation(workspace);
  return Promise.all(foundation.claims.map(async (claim) => {
    const reviews = await loadClaimReviewVersions(workspace, claim.id);
    const effective = effectiveReviewFrom(reviews);
    if (!effective) {
      return { claimId: claim.id, status: "missing" as const, versionCount: 0 };
    }
    const status = await getEvidenceClaimReviewStatus(workspace, claim.id, effective.review.id);
    return {
      claimId: claim.id,
      effectiveReviewId: effective.review.id,
      status: status.status,
      decision: effective.review.decision,
      eligibleForRoleMatching: effective.review.eligibleForRoleMatching,
      eligibleForJobMapping: effective.review.eligibleForJobMapping,
      versionCount: reviews.length,
    };
  })).then((entries) => entries.sort((left, right) => left.claimId.localeCompare(right.claimId)));
}

export async function getEvidenceClaimReviewStatus(
  workspace: string,
  claimId: string,
  requestedReviewId?: string,
): Promise<EvidenceClaimReviewStatus> {
  const versions = await discoverClaimReviewPaths(workspace, claimId);
  if (versions.length === 0) return missingStatus(claimId);
  const selectedPaths = requestedReviewId
    ? versions.find((entry) => path.basename(entry.rootPath) === requestedReviewId)
    : (() => {
        const parsed = versions.flatMap((entry) => {
          try {
            return [{ entry, review: undefined as EvidenceClaimReview | undefined }];
          } catch {
            return [];
          }
        });
        return parsed.length === 1 ? parsed[0]!.entry : undefined;
      })();
  if (!selectedPaths && requestedReviewId) {
    return { ...missingStatus(claimId), reviewId: requestedReviewId };
  }
  if (!selectedPaths) {
    const loaded = await loadClaimReviewVersions(workspace, claimId);
    const effective = effectiveReviewFrom(loaded);
    if (!effective) {
      return {
        ...missingStatus(claimId),
        status: "invalid",
        reasons: ["Claim review history has no unique effective review."],
      };
    }
    return getEvidenceClaimReviewStatus(workspace, claimId, effective.review.id);
  }
  const reviewExists = await pathExists(selectedPaths.reviewPath);
  const manifestExists = await pathExists(selectedPaths.manifestPath);
  const base = {
    claimId,
    reviewId: requestedReviewId ?? path.basename(selectedPaths.rootPath),
    reviewExists,
    manifestExists,
    reviewPath: selectedPaths.reviewRelativePath,
    manifestPath: selectedPaths.manifestRelativePath,
  };
  if (!reviewExists || !manifestExists) {
    return invalidStatus(base, ["Claim review artifact set is incomplete."]);
  }
  let review: EvidenceClaimReview;
  let manifest: EvidenceClaimReviewManifest;
  try {
    ({ review, manifest } = await loadReviewAt(selectedPaths));
  } catch (error) {
    return invalidStatus(base, [`Claim review artifact is invalid: ${errorMessage(error)}`]);
  }
  let foundation: FoundationData;
  try {
    foundation = await loadFoundation(workspace);
  } catch (error) {
    return invalidStatus(base, [`Evidence Foundation is invalid: ${errorMessage(error)}`]);
  }
  const claim = foundation.claimById.get(claimId);
  if (!claim) return invalidStatus(base, ["Reviewed source claim no longer exists."]);
  let dependencies: ReturnType<typeof reviewDependencies>;
  try {
    dependencies = reviewDependencies(claim, foundation);
  } catch (error) {
    return invalidStatus(base, [errorMessage(error)]);
  }
  const reviewHashMatches = await hashFile(selectedPaths.reviewPath) === manifest.reviewSha256;
  const claimHashMatches =
    review.claimRecordSha256 === dependencies.claimRecordSha256 &&
    manifest.claimRecordSha256 === dependencies.claimRecordSha256 &&
    review.reviewedClaimSha256 === hashText(claim.claim);
  const evidenceHashMatches =
    review.evidenceInventorySha256 === dependencies.evidenceInventorySha256 &&
    manifest.evidenceInventorySha256 === dependencies.evidenceInventorySha256;
  const provenanceHashMatches =
    review.provenanceInventorySha256 === dependencies.provenanceInventorySha256 &&
    manifest.provenanceInventorySha256 === dependencies.provenanceInventorySha256;
  const policyMatches =
    review.policy.name === EVIDENCE_CLAIM_REVIEW_POLICY_NAME &&
    review.policy.version === EVIDENCE_CLAIM_REVIEW_POLICY_VERSION &&
    manifest.policyName === EVIDENCE_CLAIM_REVIEW_POLICY_NAME &&
    manifest.policyVersion === EVIDENCE_CLAIM_REVIEW_POLICY_VERSION;
  const identityMatches =
    review.id === base.reviewId &&
    review.claimId === claimId &&
    manifest.reviewId === review.id &&
    manifest.claimId === claimId &&
    manifest.reviewPath === selectedPaths.reviewRelativePath &&
    manifest.supersedesReviewId === review.supersedesReviewId;
  const reasons = [
    ...(!reviewHashMatches ? ["Review SHA-256 does not match its manifest."] : []),
    ...(!identityMatches ? ["Review identity or persistence path is invalid."] : []),
    ...(!claimHashMatches ? ["Source claim content changed after review."] : []),
    ...(!evidenceHashMatches ? ["Supporting evidence content changed after review."] : []),
    ...(!provenanceHashMatches ? ["Source provenance changed after review."] : []),
    ...(!policyMatches ? ["Claim review policy changed after review."] : []),
  ];
  const superseding = await findSupersedingReview(workspace, claimId, review.id);
  if (superseding) {
    return {
      ...base,
      reviewHashMatches,
      claimHashMatches,
      evidenceHashMatches,
      provenanceHashMatches,
      policyMatches,
      status: "superseded",
      supersededByReviewId: superseding,
      reasons: ["Review was explicitly superseded."],
    };
  }
  return {
    ...base,
    reviewHashMatches,
    claimHashMatches,
    evidenceHashMatches,
    provenanceHashMatches,
    policyMatches,
    status: reasons.length === 0 ? "current" : "stale",
    reasons,
  };
}

export async function loadEffectiveEvidenceClaimReviews(
  workspace: string,
): Promise<Map<string, LoadedEffectiveEvidenceClaimReview>> {
  const entries = await listEvidenceClaimReviews(workspace);
  const result = new Map<string, LoadedEffectiveEvidenceClaimReview>();
  for (const entry of entries) {
    if (!entry.effectiveReviewId || entry.status !== "current") continue;
    const paths = evidenceClaimReviewPaths(workspace, entry.claimId, entry.effectiveReviewId);
    const { review, manifest } = await loadReviewAt(paths);
    const reviewSha256 = await hashFile(paths.reviewPath);
    result.set(entry.claimId, {
      review,
      manifest,
      reviewSha256,
      projection: {
        reviewId: review.id,
        reviewSha256,
        decision: review.decision,
        ...(review.approvedProjection
          ? {
              approvedProjectionId: review.approvedProjection.id,
              approvedTextSha256: review.approvedProjection.textSha256,
            }
          : {}),
        publicSafety: review.publicSafety,
        resumeReadiness: review.resumeReadiness,
        eligibleForRoleMatching: review.eligibleForRoleMatching,
        eligibleForJobMapping: review.eligibleForJobMapping,
        metricState: review.metricReview.state,
        requiredQualifiers: review.requiredQualifiers,
        workContext: review.classification.workContext,
        claimNature: review.classification.claimNature,
      },
    });
  }
  return result;
}

export function evidenceClaimReviewPaths(
  workspace: string,
  claimId: string,
  reviewId: string,
): EvidenceClaimReviewPaths {
  const safeClaimId = safeSegment(claimId);
  if (safeClaimId !== claimId) throw new Error(`Unsafe claim ID: ${claimId}`);
  if (!/^evidence-claim-review_[a-f0-9]{20}$/.test(reviewId)) {
    throw new Error(`Invalid evidence claim review ID: ${reviewId}`);
  }
  const rootRelativePath = `${REVIEW_ROOT}/${claimId}/reviews/${reviewId}`;
  const reviewRelativePath = `${rootRelativePath}/${REVIEW_FILE}`;
  const manifestRelativePath = `${rootRelativePath}/${MANIFEST_FILE}`;
  return {
    rootRelativePath,
    rootPath: resolveWithin(workspace, rootRelativePath),
    reviewRelativePath,
    reviewPath: resolveWithin(workspace, reviewRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}

export function formatEvidenceClaimReviewResult(
  result: CreateEvidenceClaimReviewResult,
): string {
  return [
    `Review ID: ${result.reviewId}`,
    `Claim ID: ${result.claimId}`,
    `Result: ${result.result}`,
    `Status: ${result.status}`,
    `Decision: ${result.decision}`,
    `Role Matching eligible: ${result.eligibleForRoleMatching ? "yes" : "no"}`,
    `Job Mapping eligible: ${result.eligibleForJobMapping ? "yes" : "no"}`,
    ...(result.approvedProjectionId
      ? [`Approved projection ID: ${result.approvedProjectionId}`]
      : []),
    `Review: ${result.reviewPath}`,
    `Manifest: ${result.manifestPath}`,
  ].join("\n");
}

export function formatEvidenceClaimReviewStatus(
  status: EvidenceClaimReviewStatus,
): string {
  return [
    `Claim ID: ${status.claimId}`,
    `Review ID: ${status.reviewId ?? "none"}`,
    `Status: ${status.status}`,
    `Review exists: ${status.reviewExists ? "yes" : "no"}`,
    `Manifest exists: ${status.manifestExists ? "yes" : "no"}`,
    ...(status.supersededByReviewId
      ? [`Superseded by: ${status.supersededByReviewId}`]
      : []),
    ...(status.reviewPath ? [`Review: ${status.reviewPath}`] : []),
    ...(status.manifestPath ? [`Manifest: ${status.manifestPath}`] : []),
    ...(status.reasons.length > 0
      ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)]
      : []),
  ].join("\n");
}

export function formatEvidenceClaimReviewList(
  entries: EvidenceClaimReviewListEntry[],
): string {
  const reviewed = entries.filter(({ effectiveReviewId }) => effectiveReviewId);
  if (reviewed.length === 0) return `Evidence claim reviews: none (${entries.length} unreviewed claims)`;
  return [
    `Evidence claim reviews: ${reviewed.length} reviewed, ${entries.length - reviewed.length} unreviewed`,
    ...reviewed.map((entry) => [
      entry.claimId,
      entry.effectiveReviewId,
      entry.status,
      entry.decision,
      `role=${entry.eligibleForRoleMatching ? "yes" : "no"}`,
      `job=${entry.eligibleForJobMapping ? "yes" : "no"}`,
      `versions=${entry.versionCount}`,
    ].join(" | ")),
  ].join("\n");
}

function validateReviewInput(
  input: EvidenceClaimReviewInput,
  claim: Claim,
  evidence: EvidenceItem[],
  sources: Source[],
): void {
  if (input.reviewedClaimSha256 !== hashText(claim.claim)) {
    throw new Error("Review input claim hash does not match the immutable source claim text.");
  }
  if (evidence.length === 0) throw new Error("Claim has no supporting evidence to review.");
  if (sources.length === 0 || evidence.some((item) => item.sourceIds.length === 0)) {
    throw new Error("Claim provenance is incomplete.");
  }
  const hardPrivate = evidence.some((item) =>
    ["private", "do_not_use", "sensitive"].includes(item.visibility) ||
    item.sensitivityFlags.length > 0) ||
    sources.some((source) =>
      ["private", "do_not_use", "sensitive"].includes(source.visibility));
  if (hardPrivate && input.publicSafety === "public-safe") {
    throw new Error("Private, do-not-use, sensitive, or explicitly flagged evidence cannot be reviewed as public-safe.");
  }
  if (evidence.some((item) => item.sourceIds.some((id) => !sources.some((source) => source.id === id)))) {
    throw new Error("Claim references missing source provenance.");
  }
  const approved = input.decision === "approved" || input.decision === "approved-with-qualifier";
  const sufficientSupport = input.factualSupport === "supported" ||
    (input.decision === "approved-with-qualifier" && input.factualSupport === "partially-supported");
  const defensibleScope = input.scope === "exact" ||
    (input.decision === "approved-with-qualifier" && input.scope === "qualified");
  const hasCriticalRisk = input.risks.some(({ severity }) => severity === "critical");
  if (approved && !sufficientSupport) {
    throw new Error("Approved decisions require supported or safely qualified factual support.");
  }
  if (approved && !defensibleScope) {
    throw new Error("Approved decisions require exact or safely qualified scope.");
  }
  if (input.decision !== "approved-with-qualifier" && input.correctedClaim) {
    throw new Error("Only approved-with-qualifier may provide corrected claim text.");
  }
  if (input.decision === "approved-with-qualifier") {
    if (!input.correctedClaim) {
      throw new Error("approved-with-qualifier requires corrected claim text.");
    }
    if (input.requiredQualifiers.length === 0) {
      throw new Error("approved-with-qualifier requires at least one explicit qualifier.");
    }
    if (normalized(input.correctedClaim) === normalized(claim.claim)) {
      throw new Error("approved-with-qualifier must provide a genuinely narrowed or clarified claim.");
    }
    validateCorrectedClaim(input.correctedClaim, claim, evidence);
  }
  const resumeReadyAllowed =
    approved &&
    sufficientSupport &&
    defensibleScope &&
    input.publicSafety === "public-safe" &&
    !hasCriticalRisk;
  if (input.resumeReadiness === "resume-ready" && !resumeReadyAllowed) {
    throw new Error(
      "Resume-ready requires approval, sufficient support, defensible scope, public safety, and no critical risk.",
    );
  }
  if (input.resumeReadiness !== "resume-ready" &&
      (input.eligibleForRoleMatching || input.eligibleForJobMapping)) {
    throw new Error("Role or Job eligibility requires resume-ready status.");
  }
  if (input.publicSafety !== "public-safe" &&
      (input.resumeReadiness === "resume-ready" || input.eligibleForRoleMatching || input.eligibleForJobMapping)) {
    throw new Error("Private, restricted, or indeterminate claims cannot be matching-eligible.");
  }
  if (!approved && (input.resumeReadiness === "resume-ready" || input.eligibleForRoleMatching || input.eligibleForJobMapping)) {
    throw new Error("Rejected, deferred, needs-edit, or insufficient-proof decisions cannot be eligible.");
  }
  validateClassification(input, claim, evidence);
  validateMetricReview(input, claim, evidence);
}

function validateCorrectedClaim(
  corrected: string,
  claim: Claim,
  evidence: EvidenceItem[],
): void {
  const corpus = [claim.claim, ...evidence.flatMap((item) => [
    item.text,
    item.normalizedSummary,
    ...(item.technologies ?? []),
    ...(item.domains ?? []),
    item.company ?? "",
    item.project ?? "",
  ])].join(" ");
  const sourceNumbers = numberTokens(corpus);
  const newNumbers = numberTokens(corrected).filter((number) => !sourceNumbers.includes(number));
  if (newNumbers.length > 0) {
    throw new Error("Corrected claim introduces an unsupported numeric value.");
  }
  const sourceTokens = new Set(significantTokens(corpus));
  const unsupported = significantTokens(corrected).filter((token) =>
    !sourceTokens.has(token) && !CORRECTION_GLUE_WORDS.has(token));
  if (unsupported.length > 0) {
    throw new Error(
      `Corrected claim introduces unsupported facts: ${[...new Set(unsupported)].sort().join(", ")}`,
    );
  }
  if (/\b(qualified for|ideal for|best fit|perfect fit|hire|hiring|job target)\b/i.test(corrected)) {
    throw new Error("Corrected claims cannot contain target-specific suitability wording.");
  }
}

function validateClassification(
  input: EvidenceClaimReviewInput,
  claim: Claim,
  evidence: EvidenceItem[],
): void {
  const hasProject = Boolean(claim.parentProjectId) || evidence.some((item) =>
    Boolean(item.parentProjectId) || item.category === "project");
  const hasEmployment = Boolean(claim.parentRoleId) || evidence.some((item) =>
    Boolean(item.parentRoleId) || item.category === "role");
  if (input.classification.workContext === "employment" && hasProject && !hasEmployment) {
    throw new Error("Project-scoped evidence cannot be classified as employment without explicit role provenance.");
  }
  if (input.classification.claimNature === "achievement" &&
      !evidence.some((item) => item.category === "achievement") &&
      claim.type !== "impact_claim") {
    throw new Error("Responsibility evidence cannot be classified as an achievement without outcome proof.");
  }
}

function validateMetricReview(
  input: EvidenceClaimReviewInput,
  claim: Claim,
  evidence: EvidenceItem[],
): void {
  const metric = input.metricReview;
  if (metric.state !== "verified") {
    if (metric.exactText || metric.unit || metric.scope || metric.qualifiers.length > 0) {
      throw new Error("Only a verified metric may include metric wording, unit, scope, or qualifiers.");
    }
    return;
  }
  if (input.decision !== "approved" && input.decision !== "approved-with-qualifier") {
    throw new Error("A verified metric requires an approved review decision.");
  }
  const approvedText = input.correctedClaim ?? claim.claim;
  if (!metric.exactText || metric.exactText !== approvedText) {
    throw new Error("Verified metric wording must exactly match the approved claim projection.");
  }
  if (!metric.unit || !metric.scope || numberTokens(metric.exactText).length === 0) {
    throw new Error("Verified metrics require an exact numeric value, unit, and scope.");
  }
  if (!normalized(metric.exactText).includes(normalized(metric.unit))) {
    throw new Error("Verified metric unit must be preserved in the exact approved wording.");
  }
  if (metric.qualifiers.some((qualifier) =>
    !normalized(metric.exactText!).includes(normalized(qualifier)))) {
    throw new Error("Verified metric qualifiers must be preserved in exact wording.");
  }
  const directlySupported = evidence.some((item) =>
    normalized(item.text).includes(normalized(metric.exactText!)) ||
    normalized(item.normalizedSummary).includes(normalized(metric.exactText!)));
  if (!directlySupported) {
    throw new Error("Verified metric exact wording is not directly supported by referenced evidence.");
  }
}

function reviewDependencies(claim: Claim, foundation: FoundationData) {
  const evidence = [...claim.supportingEvidenceIds].sort().map((id) => {
    const item = foundation.evidenceById.get(id);
    if (!item) throw new Error(`Claim references unknown evidence item: ${id}`);
    return item;
  });
  const sourceIds = sortedUnique(evidence.flatMap((item) => item.sourceIds));
  const sources = sourceIds.map((id) => {
    const source = foundation.sourceById.get(id);
    if (!source) throw new Error(`Evidence references unknown source: ${id}`);
    return source;
  });
  const claimRecordSha256 = hashText(stableJson(claim));
  const evidenceInventorySha256 = hashText(stableJson(evidence.map((item) => ({
    id: item.id,
    sha256: hashText(stableJson(item)),
  }))));
  const provenanceInventorySha256 = hashText(stableJson(sources.map((source) => ({
    id: source.id,
    hash: source.hash,
    status: source.status,
    visibility: source.visibility,
    type: source.type,
  }))));
  return {
    evidence,
    sources,
    claimRecordSha256,
    evidenceInventorySha256,
    provenanceInventorySha256,
  };
}

async function loadFoundation(workspace: string): Promise<FoundationData> {
  const [rawClaims, rawEvidence, rawSources] = await Promise.all([
    readJson<unknown[]>(resolveWithin(workspace, "kb/claims.json"), []),
    readJson<unknown[]>(resolveWithin(workspace, "kb/evidence-items.json"), []),
    readJson<unknown[]>(resolveWithin(workspace, "kb/sources.json"), []),
  ]);
  const claims = rawClaims.map((value) => ClaimSchema.parse(value)).sort(byId);
  const evidence = rawEvidence.map((value) => EvidenceItemSchema.parse(value)).sort(byId);
  const sources = rawSources.map((value) => SourceSchema.parse(value)).sort(byId);
  return {
    claims,
    evidence,
    sources,
    claimById: uniqueMap(claims, "claim"),
    evidenceById: uniqueMap(evidence, "evidence item"),
    sourceById: uniqueMap(sources, "source"),
  };
}

async function discoverClaimReviewPaths(
  workspace: string,
  claimId: string,
): Promise<EvidenceClaimReviewPaths[]> {
  const root = resolveWithin(workspace, `${REVIEW_ROOT}/${safeSegment(claimId)}/reviews`);
  const files = (await walkFiles(root)).filter((file) => path.basename(file) === REVIEW_FILE);
  return files.map((file) => evidenceClaimReviewPaths(
    workspace,
    claimId,
    path.basename(path.dirname(file)),
  )).sort((left, right) => left.rootRelativePath.localeCompare(right.rootRelativePath));
}

async function loadClaimReviewVersions(
  workspace: string,
  claimId: string,
): Promise<Array<{ review: EvidenceClaimReview; manifest: EvidenceClaimReviewManifest; paths: EvidenceClaimReviewPaths }>> {
  const paths = await discoverClaimReviewPaths(workspace, claimId);
  const loaded = [];
  for (const entry of paths) {
    try {
      loaded.push({ ...(await loadReviewAt(entry)), paths: entry });
    } catch {
      // Status reports malformed versions; they cannot become effective.
    }
  }
  return loaded;
}

async function loadReviewAt(paths: EvidenceClaimReviewPaths): Promise<{
  review: EvidenceClaimReview;
  manifest: EvidenceClaimReviewManifest;
}> {
  return {
    review: EvidenceClaimReviewSchema.parse(await readJson<unknown>(paths.reviewPath, null)),
    manifest: EvidenceClaimReviewManifestSchema.parse(
      await readJson<unknown>(paths.manifestPath, null),
    ),
  };
}

function effectiveReviewFrom<T extends { review: EvidenceClaimReview }>(reviews: T[]): T | undefined {
  const superseded = new Set(reviews.flatMap(({ review }) =>
    review.supersedesReviewId ? [review.supersedesReviewId] : []));
  const leaves = reviews.filter(({ review }) => !superseded.has(review.id));
  return leaves.length === 1 ? leaves[0] : undefined;
}

async function findSupersedingReview(
  workspace: string,
  claimId: string,
  reviewId: string,
): Promise<string | undefined> {
  const reviews = await loadClaimReviewVersions(workspace, claimId);
  return reviews.find(({ review }) => review.supersedesReviewId === reviewId)?.review.id;
}

function reviewIdentityInput(
  input: EvidenceClaimReviewInput,
  claim: Claim,
  dependencies: ReturnType<typeof reviewDependencies>,
) {
  return {
    schemaVersion: EVIDENCE_CLAIM_REVIEW_SCHEMA_VERSION,
    policy: {
      name: EVIDENCE_CLAIM_REVIEW_POLICY_NAME,
      version: EVIDENCE_CLAIM_REVIEW_POLICY_VERSION,
    },
    claimId: claim.id,
    claimRecordSha256: dependencies.claimRecordSha256,
    evidenceInventorySha256: dependencies.evidenceInventorySha256,
    provenanceInventorySha256: dependencies.provenanceInventorySha256,
    review: reviewSemanticFromInput(input),
  };
}

function reviewSemanticFromInput(input: EvidenceClaimReviewInput) {
  return {
    decision: input.decision,
    correctedClaim: input.correctedClaim,
    requiredQualifiers: sortedUnique(input.requiredQualifiers),
    factualSupport: input.factualSupport,
    scope: input.scope,
    publicSafety: input.publicSafety,
    resumeReadiness: input.resumeReadiness,
    eligibleForRoleMatching: input.eligibleForRoleMatching,
    eligibleForJobMapping: input.eligibleForJobMapping,
    metricReview: {
      ...input.metricReview,
      qualifiers: sortedUnique(input.metricReview.qualifiers),
    },
    classification: input.classification,
    risks: input.risks.map(({ code, severity, message }) => ({ code, severity, message }))
      .sort((left, right) => stableJson(left).localeCompare(stableJson(right))),
    warnings: sortedUnique(input.warnings),
    ambiguities: sortedUnique(input.ambiguities),
    reviewerRationale: input.reviewerRationale,
    supersedesReviewId: input.supersedesReviewId,
  };
}

function reviewSemanticContent(review: EvidenceClaimReview) {
  return {
    decision: review.decision,
    correctedClaim: review.decision === "approved-with-qualifier"
      ? review.approvedProjection?.text
      : undefined,
    requiredQualifiers: review.requiredQualifiers,
    factualSupport: review.factualSupport,
    scope: review.scope,
    publicSafety: review.publicSafety,
    resumeReadiness: review.resumeReadiness,
    eligibleForRoleMatching: review.eligibleForRoleMatching,
    eligibleForJobMapping: review.eligibleForJobMapping,
    metricReview: {
      state: review.metricReview.state,
      exactText: review.metricReview.exactText,
      unit: review.metricReview.unit,
      scope: review.metricReview.scope,
      qualifiers: review.metricReview.qualifiers,
    },
    classification: review.classification,
    risks: review.risks.map(({ code, severity, message }) => ({ code, severity, message })),
    warnings: review.warnings,
    ambiguities: review.ambiguities,
    reviewerRationale: review.reviewerRationale,
    supersedesReviewId: review.supersedesReviewId,
  };
}

function resultFor(
  review: EvidenceClaimReview,
  paths: EvidenceClaimReviewPaths,
  result: CreateEvidenceClaimReviewResult["result"],
): CreateEvidenceClaimReviewResult {
  return {
    reviewId: review.id,
    claimId: review.claimId,
    result,
    status: "current",
    reviewPath: paths.reviewRelativePath,
    manifestPath: paths.manifestRelativePath,
    decision: review.decision,
    eligibleForRoleMatching: review.eligibleForRoleMatching,
    eligibleForJobMapping: review.eligibleForJobMapping,
    ...(review.approvedProjection
      ? { approvedProjectionId: review.approvedProjection.id }
      : {}),
  };
}

function missingStatus(claimId: string): EvidenceClaimReviewStatus {
  return {
    claimId,
    reviewExists: false,
    manifestExists: false,
    reviewHashMatches: null,
    claimHashMatches: null,
    evidenceHashMatches: null,
    provenanceHashMatches: null,
    policyMatches: null,
    status: "missing",
    reasons: ["No evidence claim review exists."],
  };
}

function invalidStatus(
  base: Pick<EvidenceClaimReviewStatus, "claimId" | "reviewId" | "reviewExists" | "manifestExists" | "reviewPath" | "manifestPath">,
  reasons: string[],
): EvidenceClaimReviewStatus {
  return {
    ...base,
    reviewHashMatches: null,
    claimHashMatches: null,
    evidenceHashMatches: null,
    provenanceHashMatches: null,
    policyMatches: null,
    status: "invalid",
    reasons,
  };
}

function significantTokens(value: string): string[] {
  return normalized(value).split(" ").filter((token) =>
    token.length > 2 && !TOKEN_STOP_WORDS.has(token) && !/^\d/.test(token));
}

function numberTokens(value: string): string[] {
  return value.match(/\b\d+(?:[.,]\d+)?(?:%|\+)?\b/g) ?? [];
}

function normalized(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9%+]+/g, " ").trim();
}

const TOKEN_STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "into", "that", "this", "through", "across",
  "using", "used", "use", "was", "were", "are", "but", "not", "only", "their", "its",
]);

const CORRECTION_GLUE_WORDS = new Set([
  "built", "designed", "developed", "supported", "contributed", "worked", "helped",
  "shaped", "coordinated", "translated", "improved", "validated", "reviewed", "assisted",
  "within", "related", "focused", "including", "involved", "around", "experience", "work",
]);

function safeSegment(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]/g, "-");
}

function resolveWithin(workspace: string, relativePath: string): string {
  const root = path.resolve(workspace);
  const resolved = path.resolve(root, relativePath);
  const relation = path.relative(root, resolved);
  if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
    throw new Error(`Path escapes workspace: ${relativePath}`);
  }
  return resolved;
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function uniqueMap<T extends { id: string }>(values: T[], label: string): Map<string, T> {
  const result = new Map<string, T>();
  for (const value of values) {
    if (result.has(value.id)) throw new Error(`Duplicate ${label} ID: ${value.id}`);
    result.set(value.id, value);
  }
  return result;
}

function byId<T extends { id: string }>(left: T, right: T): number {
  return left.id.localeCompare(right.id);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
