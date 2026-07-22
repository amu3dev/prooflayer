import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  hashFile,
  pathExists,
  readJson,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  EditedTargetExpectationSchema,
  InterpretationProposalReviewManifestSchema,
  InterpretationProposalReviewSchema,
  InterpretationProposalManifestSchema,
  type EditedTargetExpectation,
  type InterpretationProposalReview,
  type InterpretationProposalReviewManifest,
  type ProposalReviewDecision,
} from "./schemas.js";
import {
  getInterpretationProposalStatus,
  showInterpretationProposal,
} from "./target-proposal.js";
import { showTarget } from "./targets.js";

const REVIEW_FILE = "review.json";
const REVIEW_MANIFEST_FILE = "review-manifest.json";

export interface ReviewOptions {
  reviewerName?: string;
  now?: () => Date;
}

export interface ReviewStatus {
  proposalId: string;
  targetId: string;
  reviewExists: boolean;
  manifestExists: boolean;
  reviewHashMatches: boolean | null;
  proposalHashMatches: boolean | null;
  status: "missing" | "in-progress" | "completed" | "invalid";
  counts: Record<ProposalReviewDecision["decision"], number>;
  reasons: string[];
  reviewPath: string;
  manifestPath: string;
}

export async function initializeProposalReview(
  workspace: string,
  proposalId: string,
  options: ReviewOptions = {},
): Promise<ReviewStatus> {
  const proposalStatus = await getInterpretationProposalStatus(workspace, proposalId);
  if (!proposalStatus.readyForReview) {
    throw new Error(`Proposal is not ready for review. Current status: ${proposalStatus.status}`);
  }
  const proposal = await showInterpretationProposal(workspace, proposalId);
  const paths = reviewPaths(workspace, proposal.targetType, proposal.targetId, proposalId);
  if (await pathExists(paths.reviewPath)) return getProposalReviewStatus(workspace, proposalId);
  const now = (options.now ?? (() => new Date()))().toISOString();
  const review = InterpretationProposalReviewSchema.parse({
    schemaVersion: 1,
    proposalId,
    targetId: proposal.targetId,
    status: "in-progress",
    decisions: proposal.proposedExpectations.map((expectation) => ({
      proposedExpectationId: expectation.id,
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
  return getProposalReviewStatus(workspace, proposalId);
}

export async function setProposalReviewDecision(
  workspace: string,
  proposalId: string,
  expectationId: string,
  input: {
    decision: "accept" | "reject" | "edit";
    editedExpectation?: EditedTargetExpectation;
    reviewNote?: string;
  },
  options: Pick<ReviewOptions, "now"> = {},
): Promise<ReviewStatus> {
  const proposalStatus = await getInterpretationProposalStatus(workspace, proposalId);
  if (!proposalStatus.readyForReview) throw new Error("Only a current ready-for-review proposal may be reviewed.");
  const proposal = await showInterpretationProposal(workspace, proposalId);
  if (!proposal.proposedExpectations.some((expectation) => expectation.id === expectationId)) {
    throw new Error(`Unknown proposed expectation ID: ${expectationId}`);
  }
  const review = await showProposalReview(workspace, proposalId);
  if (review.status === "completed") throw new Error("Completed reviews cannot be modified.");
  const existing = review.decisions.find((decision) => decision.proposedExpectationId === expectationId);
  if (!existing) throw new Error(`Review is missing proposed expectation ID: ${expectationId}`);
  if (existing.decision !== "pending") {
    throw new Error(`A decision already exists for proposed expectation: ${expectationId}`);
  }
  const now = (options.now ?? (() => new Date()))().toISOString();
  const updated = InterpretationProposalReviewSchema.parse({
    ...review,
    decisions: review.decisions.map((decision) => decision.proposedExpectationId === expectationId
      ? {
          proposedExpectationId: expectationId,
          decision: input.decision,
          ...(input.editedExpectation ? { editedExpectation: input.editedExpectation } : {}),
          ...(input.reviewNote?.trim() ? { reviewNote: input.reviewNote.trim() } : {}),
          decidedAt: now,
        }
      : decision),
    updatedAt: now,
  });
  const paths = reviewPaths(workspace, proposal.targetType, proposal.targetId, proposalId);
  await persistReview(workspace, updated, paths);
  return getProposalReviewStatus(workspace, proposalId);
}

export async function completeProposalReview(
  workspace: string,
  proposalId: string,
  options: Pick<ReviewOptions, "now"> = {},
): Promise<ReviewStatus> {
  const proposalStatus = await getInterpretationProposalStatus(workspace, proposalId);
  if (!proposalStatus.readyForReview) throw new Error("Only a current ready-for-review proposal may be completed.");
  const proposal = await showInterpretationProposal(workspace, proposalId);
  const review = await showProposalReview(workspace, proposalId);
  if (review.status === "completed") return getProposalReviewStatus(workspace, proposalId);
  const pending = review.decisions.filter((decision) => decision.decision === "pending");
  if (pending.length > 0) {
    throw new Error(`Review cannot be completed: ${pending.length} proposed expectation(s) remain undecided.`);
  }
  const proposalIds = new Set(proposal.proposedExpectations.map((expectation) => expectation.id));
  if (review.decisions.length !== proposalIds.size || review.decisions.some((decision) => !proposalIds.has(decision.proposedExpectationId))) {
    throw new Error("Review decisions do not exactly cover the proposal expectations.");
  }
  const now = (options.now ?? (() => new Date()))().toISOString();
  const completed = InterpretationProposalReviewSchema.parse({
    ...review,
    status: "completed",
    updatedAt: now,
  });
  await persistReview(
    workspace,
    completed,
    reviewPaths(workspace, proposal.targetType, proposal.targetId, proposalId),
  );
  return getProposalReviewStatus(workspace, proposalId);
}

export async function showProposalReview(
  workspace: string,
  proposalId: string,
): Promise<InterpretationProposalReview> {
  const proposal = await showInterpretationProposal(workspace, proposalId);
  const paths = reviewPaths(workspace, proposal.targetType, proposal.targetId, proposalId);
  if (!(await pathExists(paths.reviewPath))) throw new Error(`Review not found for proposal: ${proposalId}`);
  return InterpretationProposalReviewSchema.parse(await readJson<unknown>(paths.reviewPath, null));
}

export async function getProposalReviewStatus(
  workspace: string,
  proposalId: string,
): Promise<ReviewStatus> {
  const proposal = await showInterpretationProposal(workspace, proposalId);
  const paths = reviewPaths(workspace, proposal.targetType, proposal.targetId, proposalId);
  const reviewExists = await pathExists(paths.reviewPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const emptyCounts = { pending: 0, accept: 0, edit: 0, reject: 0 };
  if (!reviewExists && !manifestExists) {
    return {
      proposalId,
      targetId: proposal.targetId,
      reviewExists,
      manifestExists,
      reviewHashMatches: null,
      proposalHashMatches: null,
      status: "missing",
      counts: emptyCounts,
      reasons: ["No review exists."],
      reviewPath: paths.reviewRelativePath,
      manifestPath: paths.manifestRelativePath,
    };
  }
  if (!reviewExists || !manifestExists) {
    return {
      proposalId,
      targetId: proposal.targetId,
      reviewExists,
      manifestExists,
      reviewHashMatches: null,
      proposalHashMatches: null,
      status: "invalid",
      counts: emptyCounts,
      reasons: ["Review artifact set is incomplete."],
      reviewPath: paths.reviewRelativePath,
      manifestPath: paths.manifestRelativePath,
    };
  }
  try {
    const review = InterpretationProposalReviewSchema.parse(await readJson<unknown>(paths.reviewPath, null));
    const manifest = InterpretationProposalReviewManifestSchema.parse(await readJson<unknown>(paths.manifestPath, null));
    const proposalManifestPath = proposalManifestPathFor(workspace, proposal.targetType, proposal.targetId, proposalId);
    const proposalManifest = InterpretationProposalManifestSchema.parse(await readJson<unknown>(proposalManifestPath, null));
    const reviewHashMatches = (await hashFile(paths.reviewPath)) === manifest.reviewSha256;
    const proposalHashMatches = proposalManifest.proposalSha256 === manifest.proposalSha256;
    const reasons: string[] = [];
    if (!reviewHashMatches) reasons.push("Review SHA-256 does not match its manifest.");
    if (!proposalHashMatches) reasons.push("Review references a different proposal hash.");
    if (
      review.proposalId !== proposalId ||
      review.targetId !== proposal.targetId ||
      manifest.proposalId !== proposalId ||
      manifest.targetId !== proposal.targetId ||
      manifest.reviewPath !== paths.reviewRelativePath
    ) {
      reasons.push("Review identity or paths disagree with the proposal and manifest.");
    }
    const proposalIds = new Set(proposal.proposedExpectations.map((expectation) => expectation.id));
    if (review.decisions.length !== proposalIds.size || review.decisions.some((decision) => !proposalIds.has(decision.proposedExpectationId))) {
      reasons.push("Review decisions do not exactly cover proposal expectations.");
    }
    const counts = review.decisions.reduce((result, decision) => {
      result[decision.decision] += 1;
      return result;
    }, { ...emptyCounts });
    return {
      proposalId,
      targetId: proposal.targetId,
      reviewExists,
      manifestExists,
      reviewHashMatches,
      proposalHashMatches,
      status: reasons.length > 0 ? "invalid" : review.status,
      counts,
      reasons,
      reviewPath: paths.reviewRelativePath,
      manifestPath: paths.manifestRelativePath,
    };
  } catch (error) {
    return {
      proposalId,
      targetId: proposal.targetId,
      reviewExists,
      manifestExists,
      reviewHashMatches: null,
      proposalHashMatches: null,
      status: "invalid",
      counts: emptyCounts,
      reasons: [`Stored review is invalid: ${errorMessage(error)}`],
      reviewPath: paths.reviewRelativePath,
      manifestPath: paths.manifestRelativePath,
    };
  }
}

export async function readEditedExpectationFile(filePath: string): Promise<EditedTargetExpectation> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(path.resolve(filePath), "utf8"));
  } catch (error) {
    throw new Error(`Invalid edited expectation JSON: ${errorMessage(error)}`);
  }
  return EditedTargetExpectationSchema.parse(parsed);
}

export function formatProposalReviewStatus(status: ReviewStatus): string {
  return [
    `Proposal ID: ${status.proposalId}`,
    `Target ID: ${status.targetId}`,
    `Review status: ${status.status}`,
    `Pending: ${status.counts.pending}`,
    `Accepted: ${status.counts.accept}`,
    `Edited: ${status.counts.edit}`,
    `Rejected: ${status.counts.reject}`,
    `Review path: ${status.reviewPath}`,
    `Manifest path: ${status.manifestPath}`,
    ...(status.reasons.length > 0 ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
  ].join("\n");
}

async function persistReview(
  workspace: string,
  review: InterpretationProposalReview,
  paths: ReturnType<typeof reviewPaths>,
): Promise<void> {
  const proposal = await showInterpretationProposal(workspace, review.proposalId);
  const proposalManifest = InterpretationProposalManifestSchema.parse(
    await readJson<unknown>(
      proposalManifestPathFor(workspace, proposal.targetType, proposal.targetId, proposal.id),
      null,
    ),
  );
  await writeJsonAtomic(paths.reviewPath, review);
  const manifest = InterpretationProposalReviewManifestSchema.parse({
    schemaVersion: 1,
    proposalId: review.proposalId,
    targetId: review.targetId,
    reviewPath: paths.reviewRelativePath,
    reviewSha256: await hashFile(paths.reviewPath),
    proposalSha256: proposalManifest.proposalSha256,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
}

function reviewPaths(workspace: string, targetType: "role" | "job", targetId: string, proposalId: string) {
  const root = `targets/${targetType === "role" ? "roles" : "jobs"}/${targetId}/interpretation/reviews/${proposalId}`;
  const reviewRelativePath = `${root}/${REVIEW_FILE}`;
  const manifestRelativePath = `${root}/${REVIEW_MANIFEST_FILE}`;
  return {
    reviewRelativePath,
    reviewPath: resolveWithin(workspace, reviewRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}

function proposalManifestPathFor(
  workspace: string,
  targetType: "role" | "job",
  targetId: string,
  proposalId: string,
): string {
  return resolveWithin(
    workspace,
    `targets/${targetType === "role" ? "roles" : "jobs"}/${targetId}/interpretation/proposals/${proposalId}/proposal-manifest.json`,
  );
}

function resolveWithin(workspace: string, relativePath: string): string {
  const resolved = path.resolve(workspace, relativePath);
  const relation = path.relative(path.resolve(workspace), resolved);
  if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
    throw new Error(`Review path escapes workspace: ${relativePath}`);
  }
  return resolved;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
