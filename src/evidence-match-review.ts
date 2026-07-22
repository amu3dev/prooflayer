import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  hashFile,
  pathExists,
  readJson,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  EditedEvidenceMatchSchema,
  EvidenceMatchProposalManifestSchema,
  EvidenceMatchProposalReviewSchema,
  EvidenceMatchReviewManifestSchema,
  type EditedEvidenceMatch,
  type EvidenceMatchProposalReview,
  type EvidenceMatchReviewDecision,
  type ExpectationCoverageReviewDecision,
  type ExpectationCoverageStatus,
} from "./schemas.js";
import {
  getEvidenceMatchProposalStatus,
  showEvidenceMatchProposal,
} from "./evidence-match-proposal.js";
import { loadMatchingContext } from "./evidence-matching.js";

const REVIEW_FILE = "review.json";
const REVIEW_MANIFEST_FILE = "review-manifest.json";

export interface EvidenceMatchReviewOptions {
  reviewerName?: string;
  now?: () => Date;
}

export interface EvidenceMatchReviewStatus {
  proposalId: string;
  targetId: string;
  reviewExists: boolean;
  manifestExists: boolean;
  reviewHashMatches: boolean | null;
  proposalHashMatches: boolean | null;
  status: "missing" | "in-progress" | "completed" | "invalid";
  matchCounts: Record<EvidenceMatchReviewDecision["decision"], number>;
  coverageCounts: Record<ExpectationCoverageReviewDecision["decision"], number>;
  reasons: string[];
  reviewPath: string;
  manifestPath: string;
}

export async function initializeEvidenceMatchReview(
  workspace: string,
  proposalId: string,
  options: EvidenceMatchReviewOptions = {},
): Promise<EvidenceMatchReviewStatus> {
  const proposalStatus = await getEvidenceMatchProposalStatus(workspace, proposalId);
  if (!proposalStatus.readyForReview) {
    throw new Error(`Match proposal is not ready for review. Current status: ${proposalStatus.status}`);
  }
  const proposal = await showEvidenceMatchProposal(workspace, proposalId);
  const paths = reviewPaths(workspace, proposal.targetType, proposal.targetId, proposalId);
  if (await pathExists(paths.reviewPath)) return getEvidenceMatchReviewStatus(workspace, proposalId);
  const now = (options.now ?? (() => new Date()))().toISOString();
  const review = EvidenceMatchProposalReviewSchema.parse({
    schemaVersion: 1,
    proposalId,
    targetId: proposal.targetId,
    status: "in-progress",
    matchDecisions: proposal.proposedMatches.map((match) => ({
      proposedMatchId: match.id,
      decision: "pending",
    })),
    coverageDecisions: proposal.proposedCoverage.map((coverage) => ({
      proposedCoverageId: coverage.id,
      decision: "pending",
    })),
    reviewer: {
      type: "human",
      ...(options.reviewerName?.trim() ? { name: options.reviewerName.trim() } : {}),
    },
    createdAt: now,
    updatedAt: now,
  });
  await persistReview(workspace, review, paths);
  return getEvidenceMatchReviewStatus(workspace, proposalId);
}

export async function setEvidenceMatchReviewDecision(
  workspace: string,
  proposalId: string,
  proposedMatchId: string,
  input: {
    decision: "accept" | "reject" | "edit";
    editedMatch?: EditedEvidenceMatch;
    reviewNote?: string;
  },
  options: Pick<EvidenceMatchReviewOptions, "now"> = {},
): Promise<EvidenceMatchReviewStatus> {
  await assertProposalReviewable(workspace, proposalId);
  const proposal = await showEvidenceMatchProposal(workspace, proposalId);
  if (!proposal.proposedMatches.some((match) => match.id === proposedMatchId)) {
    throw new Error(`Unknown proposed match ID: ${proposedMatchId}`);
  }
  const review = await showEvidenceMatchReview(workspace, proposalId);
  assertMutableReview(review);
  const existing = review.matchDecisions.find((decision) => decision.proposedMatchId === proposedMatchId);
  if (!existing) throw new Error(`Review is missing proposed match ID: ${proposedMatchId}`);
  if (existing.decision !== "pending") throw new Error(`A decision already exists for proposed match: ${proposedMatchId}`);
  if (input.decision === "edit") {
    if (!input.editedMatch) throw new Error("Edit requires an edited match.");
    await validateEditedMatch(workspace, proposal.targetId, input.editedMatch);
  } else if (input.editedMatch) {
    throw new Error("Only an edit decision may include edited match content.");
  }
  const now = (options.now ?? (() => new Date()))().toISOString();
  const updated = EvidenceMatchProposalReviewSchema.parse({
    ...review,
    matchDecisions: review.matchDecisions.map((decision) => decision.proposedMatchId === proposedMatchId
      ? {
          proposedMatchId,
          decision: input.decision,
          ...(input.editedMatch ? { editedMatch: input.editedMatch } : {}),
          ...(input.reviewNote?.trim() ? { reviewNote: input.reviewNote.trim() } : {}),
          decidedAt: now,
        }
      : decision),
    updatedAt: now,
  });
  await persistReview(workspace, updated, pathsForProposal(workspace, proposal));
  return getEvidenceMatchReviewStatus(workspace, proposalId);
}

export async function setEvidenceCoverageReviewDecision(
  workspace: string,
  proposalId: string,
  proposedCoverageId: string,
  input: {
    decision: "accept" | "reject" | "edit";
    editedStatus?: ExpectationCoverageStatus;
    reviewNote?: string;
  },
  options: Pick<EvidenceMatchReviewOptions, "now"> = {},
): Promise<EvidenceMatchReviewStatus> {
  await assertProposalReviewable(workspace, proposalId);
  const proposal = await showEvidenceMatchProposal(workspace, proposalId);
  if (!proposal.proposedCoverage.some((coverage) => coverage.id === proposedCoverageId)) {
    throw new Error(`Unknown proposed coverage ID: ${proposedCoverageId}`);
  }
  const review = await showEvidenceMatchReview(workspace, proposalId);
  assertMutableReview(review);
  const existing = review.coverageDecisions.find((decision) => decision.proposedCoverageId === proposedCoverageId);
  if (!existing) throw new Error(`Review is missing proposed coverage ID: ${proposedCoverageId}`);
  if (existing.decision !== "pending") throw new Error(`A decision already exists for proposed coverage: ${proposedCoverageId}`);
  if (input.decision === "edit" && !input.editedStatus) throw new Error("Coverage edit requires an edited status.");
  if (input.decision !== "edit" && input.editedStatus) throw new Error("Only a coverage edit may include edited status.");
  const now = (options.now ?? (() => new Date()))().toISOString();
  const updated = EvidenceMatchProposalReviewSchema.parse({
    ...review,
    coverageDecisions: review.coverageDecisions.map((decision) => decision.proposedCoverageId === proposedCoverageId
      ? {
          proposedCoverageId,
          decision: input.decision,
          ...(input.editedStatus ? { editedStatus: input.editedStatus } : {}),
          ...(input.reviewNote?.trim() ? { reviewNote: input.reviewNote.trim() } : {}),
          decidedAt: now,
        }
      : decision),
    updatedAt: now,
  });
  await persistReview(workspace, updated, pathsForProposal(workspace, proposal));
  return getEvidenceMatchReviewStatus(workspace, proposalId);
}

export async function completeEvidenceMatchReview(
  workspace: string,
  proposalId: string,
  options: Pick<EvidenceMatchReviewOptions, "now"> = {},
): Promise<EvidenceMatchReviewStatus> {
  await assertProposalReviewable(workspace, proposalId);
  const proposal = await showEvidenceMatchProposal(workspace, proposalId);
  const review = await showEvidenceMatchReview(workspace, proposalId);
  if (review.status === "completed") return getEvidenceMatchReviewStatus(workspace, proposalId);
  const pendingMatches = review.matchDecisions.filter((decision) => decision.decision === "pending").length;
  const pendingCoverage = review.coverageDecisions.filter((decision) => decision.decision === "pending").length;
  if (pendingMatches || pendingCoverage) {
    throw new Error(`Review cannot be completed: ${pendingMatches} match and ${pendingCoverage} coverage decision(s) remain pending.`);
  }
  assertExactReviewCoverage(review, proposal.proposedMatches.map((match) => match.id), proposal.proposedCoverage.map((coverage) => coverage.id));
  validateCompletedDecisionSemantics(review, proposal);
  const now = (options.now ?? (() => new Date()))().toISOString();
  const completed = EvidenceMatchProposalReviewSchema.parse({ ...review, status: "completed", updatedAt: now });
  await persistReview(workspace, completed, pathsForProposal(workspace, proposal));
  return getEvidenceMatchReviewStatus(workspace, proposalId);
}

export async function showEvidenceMatchReview(
  workspace: string,
  proposalId: string,
): Promise<EvidenceMatchProposalReview> {
  const proposal = await showEvidenceMatchProposal(workspace, proposalId);
  const paths = pathsForProposal(workspace, proposal);
  if (!(await pathExists(paths.reviewPath))) throw new Error(`Match review not found for proposal: ${proposalId}`);
  return EvidenceMatchProposalReviewSchema.parse(await readJson<unknown>(paths.reviewPath, null));
}

export async function getEvidenceMatchReviewStatus(
  workspace: string,
  proposalId: string,
): Promise<EvidenceMatchReviewStatus> {
  const proposal = await showEvidenceMatchProposal(workspace, proposalId);
  const paths = pathsForProposal(workspace, proposal);
  const reviewExists = await pathExists(paths.reviewPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const emptyCounts = { pending: 0, accept: 0, edit: 0, reject: 0 };
  const base = {
    proposalId,
    targetId: proposal.targetId,
    reviewExists,
    manifestExists,
    matchCounts: { ...emptyCounts },
    coverageCounts: { ...emptyCounts },
    reviewPath: paths.reviewRelativePath,
    manifestPath: paths.manifestRelativePath,
  };
  if (!reviewExists && !manifestExists) {
    return { ...base, reviewHashMatches: null, proposalHashMatches: null, status: "missing", reasons: ["No match review exists."] };
  }
  if (!reviewExists || !manifestExists) {
    return { ...base, reviewHashMatches: null, proposalHashMatches: null, status: "invalid", reasons: ["Match review artifact set is incomplete."] };
  }
  try {
    const review = EvidenceMatchProposalReviewSchema.parse(await readJson<unknown>(paths.reviewPath, null));
    const manifest = EvidenceMatchReviewManifestSchema.parse(await readJson<unknown>(paths.manifestPath, null));
    const proposalManifest = EvidenceMatchProposalManifestSchema.parse(await readJson<unknown>(proposalManifestPath(workspace, proposal.targetType, proposal.targetId, proposalId), null));
    const reviewHashMatches = (await hashFile(paths.reviewPath)) === manifest.reviewSha256;
    const proposalHashMatches = proposalManifest.proposalSha256 === manifest.proposalSha256;
    const reasons: string[] = [];
    if (!reviewHashMatches) reasons.push("Review SHA-256 does not match its manifest.");
    if (!proposalHashMatches) reasons.push("Review references a different proposal hash.");
    if (review.proposalId !== proposalId || review.targetId !== proposal.targetId || manifest.proposalId !== proposalId || manifest.targetId !== proposal.targetId || manifest.reviewPath !== paths.reviewRelativePath) {
      reasons.push("Review identity or paths disagree with the proposal and manifest.");
    }
    try {
      assertExactReviewCoverage(review, proposal.proposedMatches.map((match) => match.id), proposal.proposedCoverage.map((coverage) => coverage.id));
      if (review.status === "completed") validateCompletedDecisionSemantics(review, proposal);
    } catch (error) {
      reasons.push(errorMessage(error));
    }
    const matchCounts = countDecisions(review.matchDecisions.map((decision) => decision.decision));
    const coverageCounts = countDecisions(review.coverageDecisions.map((decision) => decision.decision));
    return {
      ...base,
      reviewHashMatches,
      proposalHashMatches,
      status: reasons.length ? "invalid" : review.status,
      matchCounts,
      coverageCounts,
      reasons,
    };
  } catch (error) {
    return { ...base, reviewHashMatches: null, proposalHashMatches: null, status: "invalid", reasons: [`Stored match review is invalid: ${errorMessage(error)}`] };
  }
}

export async function readEditedEvidenceMatchFile(filePath: string): Promise<EditedEvidenceMatch> {
  try {
    return EditedEvidenceMatchSchema.parse(JSON.parse(await readFile(path.resolve(filePath), "utf8")));
  } catch (error) {
    throw new Error(`Invalid edited evidence match JSON: ${errorMessage(error)}`);
  }
}

export function formatEvidenceMatchReviewStatus(status: EvidenceMatchReviewStatus): string {
  return [
    `Proposal ID: ${status.proposalId}`,
    `Target ID: ${status.targetId}`,
    `Review status: ${status.status}`,
    `Match decisions: pending=${status.matchCounts.pending}, accepted=${status.matchCounts.accept}, edited=${status.matchCounts.edit}, rejected=${status.matchCounts.reject}`,
    `Coverage decisions: pending=${status.coverageCounts.pending}, accepted=${status.coverageCounts.accept}, edited=${status.coverageCounts.edit}, rejected=${status.coverageCounts.reject}`,
    `Review path: ${status.reviewPath}`,
    `Manifest path: ${status.manifestPath}`,
    ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
  ].join("\n");
}

async function assertProposalReviewable(workspace: string, proposalId: string): Promise<void> {
  const status = await getEvidenceMatchProposalStatus(workspace, proposalId);
  if (!status.readyForReview) throw new Error(`Only a current ready-for-review match proposal may be reviewed. Current status: ${status.status}`);
}

async function validateEditedMatch(workspace: string, targetId: string, edited: EditedEvidenceMatch): Promise<void> {
  const context = await loadMatchingContext(workspace, targetId, { persistSnapshot: false });
  const eligible = new Set(context.snapshot.eligibleEvidenceIds);
  if (new Set(edited.evidenceIds).size !== edited.evidenceIds.length) throw new Error("Edited match contains duplicate evidence IDs.");
  const invalid = edited.evidenceIds.filter((id) => !eligible.has(id));
  if (invalid.length) throw new Error(`Edited match references ineligible evidence: ${invalid.join(", ")}`);
  if (edited.matchType === "contradictory" && edited.coverage !== "conflicting") throw new Error("Contradictory edited matches require conflicting coverage.");
  if (edited.matchType !== "contradictory" && edited.coverage === "conflicting") throw new Error("Conflicting edited coverage requires a contradictory match.");
  if (["supporting", "partial", "contradictory"].includes(edited.matchType) && edited.limitations.length === 0) throw new Error(`${edited.matchType} edited matches require limitations.`);
}

function assertMutableReview(review: EvidenceMatchProposalReview): void {
  if (review.status === "completed") throw new Error("Completed match reviews cannot be modified.");
}

function assertExactReviewCoverage(review: EvidenceMatchProposalReview, matchIds: string[], coverageIds: string[]): void {
  const reviewedMatches = review.matchDecisions.map((decision) => decision.proposedMatchId);
  const reviewedCoverage = review.coverageDecisions.map((decision) => decision.proposedCoverageId);
  if (!sameUniqueSet(reviewedMatches, matchIds)) throw new Error("Review match decisions do not exactly cover proposed matches.");
  if (!sameUniqueSet(reviewedCoverage, coverageIds)) throw new Error("Review coverage decisions do not exactly cover proposed coverage records.");
}

function validateCompletedDecisionSemantics(
  review: EvidenceMatchProposalReview,
  proposal: Awaited<ReturnType<typeof showEvidenceMatchProposal>>,
): void {
  const proposedMatchById = new Map(proposal.proposedMatches.map((match) => [match.id, match]));
  const proposedCoverageById = new Map(proposal.proposedCoverage.map((coverage) => [coverage.id, coverage]));
  const acceptedByExpectation = new Map<string, Array<{ matchType: string; coverage: string }>>();
  for (const decision of review.matchDecisions) {
    if (decision.decision === "pending" || decision.decision === "reject") continue;
    const proposed = proposedMatchById.get(decision.proposedMatchId);
    if (!proposed) throw new Error(`Unknown reviewed proposed match: ${decision.proposedMatchId}`);
    const item = decision.decision === "edit" ? decision.editedMatch : proposed;
    if (!item) throw new Error(`Edited match content is missing: ${decision.proposedMatchId}`);
    const matches = acceptedByExpectation.get(proposed.expectationId) ?? [];
    matches.push({ matchType: item.matchType, coverage: item.coverage });
    acceptedByExpectation.set(proposed.expectationId, matches);
  }
  for (const decision of review.coverageDecisions) {
    if (decision.decision === "pending" || decision.decision === "reject") continue;
    const proposed = proposedCoverageById.get(decision.proposedCoverageId);
    if (!proposed) throw new Error(`Unknown reviewed proposed coverage: ${decision.proposedCoverageId}`);
    const status = decision.decision === "edit" ? decision.editedStatus : proposed.status;
    if (!status) throw new Error(`Edited coverage status is missing: ${decision.proposedCoverageId}`);
    const accepted = acceptedByExpectation.get(proposed.expectationId) ?? [];
    const hasDirectFull = accepted.some((match) => match.matchType === "direct" && match.coverage === "full");
    const hasContradiction = accepted.some((match) => match.matchType === "contradictory" && match.coverage === "conflicting");
    if (["unsupported", "not-assessed"].includes(status) && accepted.length > 0) {
      throw new Error(`${status} coverage cannot coexist with an accepted evidence match.`);
    }
    if (status === "matched" && !hasDirectFull) throw new Error("Matched coverage requires an accepted direct full-coverage match.");
    if (status === "partially-matched" && (accepted.length === 0 || hasDirectFull)) throw new Error("Partially matched coverage requires accepted partial/supporting evidence and no direct full match.");
    if (status === "conflicting" && !hasContradiction) throw new Error("Conflicting coverage requires an accepted contradictory evidence match.");
  }
}

function sameUniqueSet(actual: string[], expected: string[]): boolean {
  return new Set(actual).size === actual.length && new Set(expected).size === expected.length && actual.length === expected.length && actual.every((id) => expected.includes(id));
}

function countDecisions(decisions: Array<"pending" | "accept" | "edit" | "reject">) {
  return decisions.reduce((counts, decision) => {
    counts[decision] += 1;
    return counts;
  }, { pending: 0, accept: 0, edit: 0, reject: 0 });
}

async function persistReview(
  workspace: string,
  review: EvidenceMatchProposalReview,
  paths: ReturnType<typeof reviewPaths>,
): Promise<void> {
  const proposal = await showEvidenceMatchProposal(workspace, review.proposalId);
  const manifest = EvidenceMatchProposalManifestSchema.parse(await readJson<unknown>(proposalManifestPath(workspace, proposal.targetType, proposal.targetId, proposal.id), null));
  await writeJsonAtomic(paths.reviewPath, review);
  await writeJsonAtomic(paths.manifestPath, EvidenceMatchReviewManifestSchema.parse({
    schemaVersion: 1,
    proposalId: review.proposalId,
    targetId: review.targetId,
    reviewPath: paths.reviewRelativePath,
    reviewSha256: await hashFile(paths.reviewPath),
    proposalSha256: manifest.proposalSha256,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }));
}

function pathsForProposal(workspace: string, proposal: { targetType: "role" | "job"; targetId: string; id: string }) {
  return reviewPaths(workspace, proposal.targetType, proposal.targetId, proposal.id);
}

function reviewPaths(workspace: string, targetType: "role" | "job", targetId: string, proposalId: string) {
  const root = `${targetRoot(targetType, targetId)}/matching/reviews/${proposalId}`;
  const reviewRelativePath = `${root}/${REVIEW_FILE}`;
  const manifestRelativePath = `${root}/${REVIEW_MANIFEST_FILE}`;
  return {
    reviewRelativePath,
    reviewPath: resolveWithin(workspace, reviewRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}

function proposalManifestPath(workspace: string, targetType: "role" | "job", targetId: string, proposalId: string): string {
  return resolveWithin(workspace, `${targetRoot(targetType, targetId)}/matching/proposals/${proposalId}/proposal-manifest.json`);
}

function targetRoot(targetType: "role" | "job", targetId: string): string {
  return `targets/${targetType === "role" ? "roles" : "jobs"}/${targetId}`;
}

function resolveWithin(workspace: string, relativePath: string): string {
  const resolved = path.resolve(workspace, relativePath);
  const relation = path.relative(path.resolve(workspace), resolved);
  if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) throw new Error(`Match review path escapes workspace: ${relativePath}`);
  return resolved;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
