import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  JobResumeDraftAmbiguitySchema,
  JobResumeDraftClaimLedgerEntrySchema,
  JobResumeDraftItemSchema,
  JobResumeDraftReviewManifestSchema,
  JobResumeDraftReviewSchema,
  JobResumeDraftSectionSchema,
  type JobResumeDraftAmbiguity,
  type JobResumeDraftClaimLedgerEntry,
  type JobResumeDraftReview,
  type JobResumeDraftReviewDecision,
  type JobResumeDraftSection,
} from "./job-resume-draft-schemas.js";
import {
  getJobResumeDraftProposalStatus,
  showJobResumeDraftProposal,
  validateJobResumeDraftPayload,
} from "./job-resume-draft-proposal.js";
import {
  loadJobResumeDraftingContext,
  showJobResumeDraftScaffold,
} from "./job-resume-drafting.js";

export interface JobResumeDraftReviewStatus {
  reviewId: string;
  proposalId: string;
  targetId: string;
  status: "missing" | "in-progress" | "completed" | "stale" | "invalid";
  counts: Record<"pending" | "accept" | "edit" | "reject", number>;
  unresolvedCount: number;
  reviewPath: string;
  manifestPath: string;
  reasons: string[];
}
export interface ReviewedJobResumeDraftPayload {
  sections: JobResumeDraftSection[];
  claimLedger: JobResumeDraftClaimLedgerEntry[];
  ambiguities: JobResumeDraftAmbiguity[];
}

export async function initializeJobResumeDraftReview(
  workspace: string,
  proposalId: string,
  options: { reviewerName?: string; now?: () => Date } = {},
): Promise<JobResumeDraftReview> {
  const proposalStatus = await getJobResumeDraftProposalStatus(workspace, proposalId);
  if (proposalStatus.status !== "current" || !proposalStatus.readyForReview) {
    throw new Error("Only a current valid Job resume draft proposal may enter review.");
  }
  const proposal = await showJobResumeDraftProposal(workspace, proposalId);
  const paths = jobResumeDraftReviewPaths(workspace, proposal.targetId, proposalId);
  if (await pathExists(paths.reviewPath)) return showJobResumeDraftReview(workspace, proposalId);
  const now = (options.now ?? (() => new Date()))().toISOString();
  const reviewId = `job-resume-draft-review_${hashText([
    proposal.id,
    proposal.requestFingerprint,
  ].join("\0")).slice(0, 16)}`;
  const decisions: JobResumeDraftReviewDecision[] = [
    pending(reviewId, "section-order", `section-order_${proposal.id}`),
    ...proposal.sections.map((entry) => pending(reviewId, "section", entry.id)),
    ...proposal.sections.flatMap((entry) =>
      entry.items.map((item) => pending(reviewId, "draft-item", item.id))
    ),
    ...proposal.claimLedger.map((entry) => pending(reviewId, "claim-ledger", entry.id)),
    ...proposal.ambiguities.map((entry) => pending(reviewId, "ambiguity", entry.id)),
  ];
  const review = JobResumeDraftReviewSchema.parse({
    schemaVersion: 1,
    id: reviewId,
    proposalId,
    targetId: proposal.targetId,
    status: "in-progress",
    decisions,
    reviewer: {
      type: "human",
      ...(options.reviewerName ? { name: options.reviewerName } : {}),
    },
    createdAt: now,
    updatedAt: now,
  });
  await writeReview(workspace, review, paths);
  return review;
}

export async function setJobResumeDraftReviewDecision(
  workspace: string,
  proposalId: string,
  itemType: JobResumeDraftReviewDecision["itemType"],
  itemId: string,
  input: {
    decision: "accept" | "edit" | "reject";
    editedValue?: unknown;
    reviewNote?: string;
    now?: () => Date;
  },
): Promise<JobResumeDraftReview> {
  const review = await showJobResumeDraftReview(workspace, proposalId);
  if (review.status === "completed") throw new Error("Completed Job resume draft reviews are immutable.");
  const index = review.decisions.findIndex((entry) =>
    entry.itemType === itemType && entry.itemId === itemId
  );
  if (index < 0) throw new Error(`Unknown Job resume draft review item: ${itemType}/${itemId}`);
  if (review.decisions[index].decision !== "pending") {
    throw new Error(`A review decision already exists for ${itemType}/${itemId}.`);
  }
  if (input.decision === "edit" && input.editedValue === undefined) {
    throw new Error("Edit requires edited content.");
  }
  if (input.decision !== "edit" && input.editedValue !== undefined) {
    throw new Error("Only edit may include edited content.");
  }
  const editedValue = input.decision === "edit"
    ? await validateReviewEdit(workspace, proposalId, itemType, itemId, input.editedValue)
    : undefined;
  const now = (input.now ?? (() => new Date()))().toISOString();
  review.decisions[index] = {
    ...review.decisions[index],
    decision: input.decision,
    ...(editedValue !== undefined ? { editedValue } : {}),
    ...(input.reviewNote ? { reviewNote: input.reviewNote } : {}),
    decidedAt: now,
  };
  review.updatedAt = now;
  await writeReview(workspace, review, jobResumeDraftReviewPaths(workspace, review.targetId, proposalId));
  return review;
}

export async function completeJobResumeDraftReview(
  workspace: string,
  proposalId: string,
  options: { now?: () => Date } = {},
): Promise<JobResumeDraftReviewStatus> {
  const review = await showJobResumeDraftReview(workspace, proposalId);
  if (review.status === "completed") return getJobResumeDraftReviewStatus(workspace, review.id);
  const pendingDecisions = review.decisions.filter((entry) => entry.decision === "pending");
  if (pendingDecisions.length > 0) {
    throw new Error(`${pendingDecisions.length} Job resume draft review decisions remain pending.`);
  }
  const merged = await mergeReviewedJobResumeDraft(workspace, proposalId, review);
  const proposal = await showJobResumeDraftProposal(workspace, proposalId);
  const scaffold = await showJobResumeDraftScaffold(workspace, proposal.targetId);
  const context = await loadJobResumeDraftingContext(workspace, proposal.targetId);
  const validated = validateJobResumeDraftPayload(
    { sections: merged.sections, warnings: proposal.warnings, ambiguities: merged.ambiguities },
    proposal.id,
    scaffold,
    context,
    proposal.input.scaffoldSha256,
  );
  const blocking = validated.validationIssues.filter((entry) =>
    entry.severity === "critical" || entry.severity === "high"
  );
  if (blocking.length > 0) {
    throw new Error(`Job resume draft review contains ${blocking.length} blocking validation issue(s).`);
  }
  const required = scaffold.sections.filter((entry) => entry.inclusion === "include");
  const emptyRequired = required.filter((entry) => {
    const section = validated.sections.find((candidate) => candidate.id === entry.id);
    return !section || section.items.length === 0;
  });
  if (emptyRequired.length > 0) {
    throw new Error(`Required Job draft sections remain empty: ${emptyRequired.map((entry) => entry.sectionType).join(", ")}.`);
  }
  const unresolvedAmbiguities = merged.ambiguities.filter((entry) => !entry.resolved);
  if (unresolvedAmbiguities.length > 0) {
    throw new Error(`${unresolvedAmbiguities.length} Job draft ambiguities remain unresolved.`);
  }
  const items = validated.sections.flatMap((entry) => entry.items);
  if (validated.claimLedger.length !== items.length) throw new Error("Job draft claim ledger is incomplete.");
  review.status = "completed";
  review.updatedAt = (options.now ?? (() => new Date()))().toISOString();
  await writeReview(workspace, review, jobResumeDraftReviewPaths(workspace, review.targetId, proposalId));
  return getJobResumeDraftReviewStatus(workspace, review.id);
}

export async function showJobResumeDraftReview(
  workspace: string,
  reviewOrProposalId: string,
): Promise<JobResumeDraftReview> {
  const location = await locateReview(workspace, reviewOrProposalId);
  if (!location) throw new Error(`Job resume draft review not found: ${reviewOrProposalId}`);
  return JobResumeDraftReviewSchema.parse(await readJson<unknown>(location.reviewPath, null));
}

export async function getJobResumeDraftReviewStatus(
  workspace: string,
  reviewOrProposalId: string,
): Promise<JobResumeDraftReviewStatus> {
  const location = await locateReview(workspace, reviewOrProposalId);
  if (!location) return emptyReviewStatus(reviewOrProposalId, "unknown", "unknown", "missing", ["Review not found."]);
  const reviewExists = await pathExists(location.reviewPath);
  const manifestExists = await pathExists(location.manifestPath);
  if (!reviewExists || !manifestExists) {
    return emptyReviewStatus(reviewOrProposalId, location.proposalId, location.targetId, "invalid", ["Review artifact set is incomplete."], location);
  }
  try {
    const review = JobResumeDraftReviewSchema.parse(await readJson<unknown>(location.reviewPath, null));
    const manifest = JobResumeDraftReviewManifestSchema.parse(await readJson<unknown>(location.manifestPath, null));
    if (await hashFile(location.reviewPath) !== manifest.reviewSha256 || manifest.reviewId !== review.id) {
      return emptyReviewStatus(review.id, review.proposalId, review.targetId, "invalid", ["Review hash or identity mismatch."], location);
    }
    const proposalPath = resolveWithin(
      workspace,
      `targets/jobs/${review.targetId}/resume-drafting/proposals/${review.proposalId}/proposal.json`,
    );
    if (!(await pathExists(proposalPath)) || await hashFile(proposalPath) !== manifest.proposalSha256) {
      return emptyReviewStatus(review.id, review.proposalId, review.targetId, "invalid", ["Proposal changed after review."], location);
    }
    const proposalStatus = await getJobResumeDraftProposalStatus(workspace, review.proposalId);
    if (proposalStatus.status !== "current") {
      return emptyReviewStatus(
        review.id,
        review.proposalId,
        review.targetId,
        proposalStatus.status === "stale" ? "stale" : "invalid",
        ["Reviewed proposal is not current."],
        location,
      );
    }
    const counts = decisionCounts(review);
    return {
      reviewId: review.id,
      proposalId: review.proposalId,
      targetId: review.targetId,
      status: review.status,
      counts,
      unresolvedCount: counts.pending,
      reviewPath: location.reviewRelativePath,
      manifestPath: location.manifestRelativePath,
      reasons: [],
    };
  } catch (error) {
    return emptyReviewStatus(reviewOrProposalId, location.proposalId, location.targetId, "invalid", [errorMessage(error)], location);
  }
}

export async function mergeReviewedJobResumeDraft(
  workspace: string,
  proposalId: string,
  suppliedReview?: JobResumeDraftReview,
): Promise<ReviewedJobResumeDraftPayload> {
  const proposal = await showJobResumeDraftProposal(workspace, proposalId);
  const review = suppliedReview ?? await showJobResumeDraftReview(workspace, proposalId);
  const sectionOrderDecision = requiredDecision(review, "section-order", `section-order_${proposal.id}`);
  const requestedOrder = sectionOrderDecision.decision === "edit"
    ? parseSectionOrder(sectionOrderDecision.editedValue, proposal.sections.map((entry) => entry.id))
    : proposal.sections.slice().sort((left, right) => left.order - right.order).map((entry) => entry.id);
  const ledgerDecisionByItem = new Map(
    proposal.claimLedger.map((entry) => [
      entry.draftItemId,
      review.decisions.find((decision) => decision.itemType === "claim-ledger" && decision.itemId === entry.id),
    ]),
  );
  const sections = proposal.sections.map((section) => {
    const sectionDecision = requiredDecision(review, "section", section.id);
    if (sectionDecision.decision === "reject") {
      return { ...section, status: "empty" as const, items: [] };
    }
    const selected = sectionDecision.decision === "edit"
      ? JobResumeDraftSectionSchema.parse(sectionDecision.editedValue)
      : section;
    const items = selected.items.flatMap((item) => {
      const itemDecision = requiredDecision(review, "draft-item", item.id);
      const ledgerDecision = ledgerDecisionByItem.get(item.id);
      if (!ledgerDecision || ledgerDecision.decision === "pending") {
        throw new Error(`Claim-ledger decision remains unresolved for ${item.id}.`);
      }
      if (itemDecision.decision === "reject" || ledgerDecision.decision === "reject") return [];
      if (itemDecision.decision === "edit") {
        return [JobResumeDraftItemSchema.parse(itemDecision.editedValue)];
      }
      return [item];
    });
    return { ...selected, items };
  }).sort((left, right) => requestedOrder.indexOf(left.id) - requestedOrder.indexOf(right.id))
    .map((entry, order) => ({ ...entry, order }));
  const ambiguities = proposal.ambiguities.flatMap((entry) => {
    const decision = requiredDecision(review, "ambiguity", entry.id);
    if (decision.decision === "reject") return [];
    if (decision.decision === "edit") {
      return [JobResumeDraftAmbiguitySchema.parse(decision.editedValue)];
    }
    return [entry];
  });
  const context = await loadJobResumeDraftingContext(workspace, proposal.targetId);
  const scaffold = await showJobResumeDraftScaffold(workspace, proposal.targetId);
  const validated = validateJobResumeDraftPayload(
    { sections, warnings: proposal.warnings, ambiguities },
    proposal.id,
    scaffold,
    context,
    proposal.input.scaffoldSha256,
  );
  return {
    sections: validated.sections,
    claimLedger: validated.claimLedger,
    ambiguities: validated.ambiguities,
  };
}

export async function readJobResumeDraftReviewEdit(filePath: string): Promise<unknown> {
  const text = await readFile(path.resolve(filePath), "utf8");
  try {
    return JSON.parse(text);
  } catch {
    return text.trim();
  }
}

export function formatJobResumeDraftReviewStatus(status: JobResumeDraftReviewStatus): string {
  return [
    `Review ID: ${status.reviewId}`,
    `Proposal ID: ${status.proposalId}`,
    `Target ID: ${status.targetId}`,
    `Review status: ${status.status}`,
    `Decisions: pending=${status.counts.pending}, accepted=${status.counts.accept}, edited=${status.counts.edit}, rejected=${status.counts.reject}`,
    `Review path: ${status.reviewPath}`,
    `Manifest path: ${status.manifestPath}`,
    ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((entry) => `- ${entry}`)] : []),
  ].join("\n");
}

async function validateReviewEdit(
  workspace: string,
  proposalId: string,
  itemType: JobResumeDraftReviewDecision["itemType"],
  itemId: string,
  value: unknown,
) {
  const proposal = await showJobResumeDraftProposal(workspace, proposalId);
  if (itemType === "section-order") {
    return parseSectionOrder(value, proposal.sections.map((entry) => entry.id));
  }
  if (itemType === "ambiguity") {
    const parsed = JobResumeDraftAmbiguitySchema.parse(value);
    if (parsed.id !== itemId || !parsed.resolved || !parsed.resolutionRationale) {
      throw new Error("Edited ambiguity must preserve its ID and include a resolution rationale.");
    }
    return parsed;
  }
  if (itemType === "claim-ledger") {
    const parsed = JobResumeDraftClaimLedgerEntrySchema.parse(value);
    if (parsed.id !== itemId) throw new Error("Edited claim-ledger ID must not change.");
    return parsed;
  }
  if (itemType === "section") {
    const parsed = JobResumeDraftSectionSchema.parse(value);
    if (parsed.id !== itemId) throw new Error("Edited section ID must not change.");
    await validateSimulatedEdit(workspace, proposalId, itemType, itemId, parsed);
    return parsed;
  }
  const original = proposal.sections.flatMap((entry) => entry.items).find((entry) => entry.id === itemId);
  if (!original) throw new Error(`Unknown Job resume draft item: ${itemId}`);
  const parsed = typeof value === "string"
    ? JobResumeDraftItemSchema.parse({ ...original, text: value })
    : JobResumeDraftItemSchema.parse(value);
  if (parsed.id !== itemId) throw new Error("Edited draft-item ID must not change in the review decision.");
  await validateSimulatedEdit(workspace, proposalId, itemType, itemId, parsed);
  return parsed;
}

async function validateSimulatedEdit(
  workspace: string,
  proposalId: string,
  itemType: "section" | "draft-item",
  itemId: string,
  value: JobResumeDraftSection | ReturnType<typeof JobResumeDraftItemSchema.parse>,
) {
  const proposal = await showJobResumeDraftProposal(workspace, proposalId);
  const sections = proposal.sections.map((section) => {
    if (itemType === "section" && section.id === itemId) return value as JobResumeDraftSection;
    if (itemType === "draft-item") {
      return {
        ...section,
        items: section.items.map((item) =>
          item.id === itemId ? value as ReturnType<typeof JobResumeDraftItemSchema.parse> : item
        ),
      };
    }
    return section;
  });
  const scaffold = await showJobResumeDraftScaffold(workspace, proposal.targetId);
  const context = await loadJobResumeDraftingContext(workspace, proposal.targetId);
  const result = validateJobResumeDraftPayload(
    { sections, warnings: proposal.warnings, ambiguities: proposal.ambiguities },
    proposal.id,
    scaffold,
    context,
    proposal.input.scaffoldSha256,
  );
  const sourceSectionId = itemType === "section"
    ? itemId
    : proposal.sections.find((entry) => entry.items.some((item) => item.id === itemId))?.id;
  const blocking = result.validationIssues.filter((entry) =>
    (entry.severity === "critical" || entry.severity === "high")
    && (entry.sectionIds.length === 0 || sourceSectionId && entry.sectionIds.includes(sourceSectionId))
  );
  if (blocking.length > 0) {
    throw new Error(`Edited Job draft content failed validation: ${blocking.map((entry) => entry.code).join(", ")}.`);
  }
}

async function writeReview(
  workspace: string,
  review: JobResumeDraftReview,
  paths: ReturnType<typeof jobResumeDraftReviewPaths>,
) {
  const proposalPath = resolveWithin(
    workspace,
    `targets/jobs/${review.targetId}/resume-drafting/proposals/${review.proposalId}/proposal.json`,
  );
  await writeJsonAtomic(paths.reviewPath, review);
  const existing = await readJson<{ createdAt?: string }>(paths.manifestPath, {});
  const manifest = JobResumeDraftReviewManifestSchema.parse({
    schemaVersion: 1,
    reviewId: review.id,
    proposalId: review.proposalId,
    targetId: review.targetId,
    reviewPath: paths.reviewRelativePath,
    reviewSha256: await hashFile(paths.reviewPath),
    proposalSha256: await hashFile(proposalPath),
    createdAt: existing.createdAt ?? review.createdAt,
    updatedAt: review.updatedAt,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
}
function pending(
  reviewId: string,
  itemType: JobResumeDraftReviewDecision["itemType"],
  itemId: string,
): JobResumeDraftReviewDecision {
  return {
    id: `job-resume-draft-review-decision_${hashText([reviewId, itemType, itemId].join("\0")).slice(0, 16)}`,
    itemType,
    itemId,
    decision: "pending",
  };
}
function requiredDecision(
  review: JobResumeDraftReview,
  itemType: JobResumeDraftReviewDecision["itemType"],
  itemId: string,
) {
  const decision = review.decisions.find((entry) => entry.itemType === itemType && entry.itemId === itemId);
  if (!decision || decision.decision === "pending") {
    throw new Error(`Unresolved Job draft review decision: ${itemType}/${itemId}`);
  }
  return decision;
}
function parseSectionOrder(value: unknown, expectedIds: string[]): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error("Section-order edit must be an array of section IDs.");
  }
  const ids = value as string[];
  if (
    ids.length !== expectedIds.length ||
    [...ids].sort().some((entry, index) => entry !== [...expectedIds].sort()[index])
  ) {
    throw new Error("Section-order edit must contain every section ID exactly once.");
  }
  return ids;
}
function decisionCounts(review: JobResumeDraftReview) {
  return review.decisions.reduce((counts, entry) => {
    counts[entry.decision] += 1;
    return counts;
  }, { pending: 0, accept: 0, edit: 0, reject: 0 });
}
export function jobResumeDraftReviewPaths(workspace: string, targetId: string, proposalId: string) {
  const root = `targets/jobs/${targetId}/resume-drafting/reviews/${proposalId}`;
  return {
    reviewRelativePath: `${root}/review.json`,
    reviewPath: resolveWithin(workspace, `${root}/review.json`),
    manifestRelativePath: `${root}/review-manifest.json`,
    manifestPath: resolveWithin(workspace, `${root}/review-manifest.json`),
  };
}
async function locateReview(workspace: string, reviewOrProposalId: string) {
  const jobsRoot = path.join(workspace, "targets/jobs");
  if (!(await pathExists(jobsRoot))) return null;
  for (const target of await readdir(jobsRoot, { withFileTypes: true })) {
    if (!target.isDirectory()) continue;
    const reviewsRoot = path.join(jobsRoot, target.name, "resume-drafting/reviews");
    if (!(await pathExists(reviewsRoot))) continue;
    for (const proposal of await readdir(reviewsRoot, { withFileTypes: true })) {
      if (!proposal.isDirectory()) continue;
      const paths = jobResumeDraftReviewPaths(workspace, target.name, proposal.name);
      if (!(await pathExists(paths.reviewPath)) && !(await pathExists(paths.manifestPath))) continue;
      if (proposal.name === reviewOrProposalId) {
        return { targetId: target.name, proposalId: proposal.name, ...paths };
      }
      try {
        const review = JobResumeDraftReviewSchema.parse(await readJson<unknown>(paths.reviewPath, null));
        if (review.id === reviewOrProposalId) {
          return { targetId: target.name, proposalId: proposal.name, ...paths };
        }
      } catch {
        // The status command will report malformed content if addressed by proposal ID.
      }
    }
  }
  return null;
}
function emptyReviewStatus(
  reviewId: string,
  proposalId: string,
  targetId: string,
  status: JobResumeDraftReviewStatus["status"],
  reasons: string[],
  paths?: ReturnType<typeof jobResumeDraftReviewPaths>,
): JobResumeDraftReviewStatus {
  return {
    reviewId,
    proposalId,
    targetId,
    status,
    counts: { pending: 0, accept: 0, edit: 0, reject: 0 },
    unresolvedCount: 0,
    reviewPath: paths?.reviewRelativePath ?? "",
    manifestPath: paths?.manifestRelativePath ?? "",
    reasons,
  };
}
function resolveWithin(workspace: string, relativePath: string) {
  const absolute = path.resolve(workspace, relativePath);
  const root = path.resolve(workspace);
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
    throw new Error("Resolved path leaves workspace.");
  }
  return absolute;
}
function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
