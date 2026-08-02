import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  hashFile,
  pathExists,
  readJson,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  ResumeDraftAmbiguitySchema,
  ResumeDraftClaimLedgerEntrySchema,
  RoleResumeDraftItemSchema,
  RoleResumeDraftReviewManifestSchema,
  RoleResumeDraftReviewSchema,
  RoleResumeDraftSectionSchema,
  type ResumeDraftAmbiguity,
  type ResumeDraftClaimLedgerEntry,
  type RoleResumeDraftReview,
  type RoleResumeDraftReviewDecision,
  type RoleResumeDraftSection,
} from "./role-resume-draft-schemas.js";
import {
  getRoleResumeDraftProposalStatus,
  showRoleResumeDraftProposal,
  validateRoleResumeDraftPayload,
} from "./role-resume-draft-proposal.js";
import {
  loadRoleResumeDraftingContext,
  showRoleResumeDraftScaffold,
} from "./role-resume-drafting.js";

export interface RoleResumeDraftReviewStatus {
  proposalId: string;
  targetId: string;
  status: "missing" | "in-progress" | "completed" | "invalid";
  counts: Record<"pending" | "accept" | "edit" | "reject", number>;
  unresolvedCount: number;
  reviewPath: string;
  manifestPath: string;
  reasons: string[];
}
export interface ReviewedRoleResumeDraftPayload {
  sections: RoleResumeDraftSection[];
  claimLedger: ResumeDraftClaimLedgerEntry[];
  ambiguities: ResumeDraftAmbiguity[];
}

export async function initializeRoleResumeDraftReview(
  workspace: string,
  proposalId: string,
  options: { reviewerName?: string; now?: () => Date } = {},
): Promise<RoleResumeDraftReview> {
  const proposalStatus = await getRoleResumeDraftProposalStatus(workspace, proposalId);
  if (proposalStatus.status !== "current" || !proposalStatus.readyForReview) {
    throw new Error("Only a current valid role resume draft proposal may enter review.");
  }
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  const paths = roleResumeDraftReviewPaths(workspace, proposal.targetId, proposalId);
  if (await pathExists(paths.reviewPath)) return showRoleResumeDraftReview(workspace, proposalId);
  const now = (options.now ?? (() => new Date()))().toISOString();
  const decisions: RoleResumeDraftReviewDecision[] = [
    pending("section-order", `section-order_${proposal.id}`),
    ...proposal.sections.map((entry) => pending("section", entry.id)),
    ...proposal.sections.flatMap((entry) => entry.items.map((item) => pending("draft-item", item.id))),
    ...proposal.claimLedger.map((entry) => pending("claim-ledger", entry.id)),
    ...proposal.ambiguities.map((entry) => pending("ambiguity", entry.id)),
  ];
  const review = RoleResumeDraftReviewSchema.parse({
    schemaVersion: 1,
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

export async function setRoleResumeDraftReviewDecision(
  workspace: string,
  proposalId: string,
  itemType: RoleResumeDraftReviewDecision["itemType"],
  itemId: string,
  input: {
    decision: "accept" | "edit" | "reject";
    editedValue?: unknown;
    reviewNote?: string;
    now?: () => Date;
  },
): Promise<RoleResumeDraftReview> {
  const review = await showRoleResumeDraftReview(workspace, proposalId);
  if (review.status === "completed") throw new Error("Completed role resume draft reviews are immutable.");
  const index = review.decisions.findIndex((entry) => entry.itemType === itemType && entry.itemId === itemId);
  if (index < 0) throw new Error(`Unknown role resume draft review item: ${itemType}/${itemId}`);
  if (review.decisions[index].decision !== "pending") {
    throw new Error(`A review decision already exists for ${itemType}/${itemId}.`);
  }
  if (input.decision === "edit" && input.editedValue === undefined) throw new Error("Edit requires edited content.");
  if (input.decision !== "edit" && input.editedValue !== undefined) throw new Error("Only edit may include edited content.");
  const editedValue = input.decision === "edit"
    ? await validateReviewEdit(workspace, proposalId, itemType, itemId, input.editedValue)
    : undefined;
  const now = (input.now ?? (() => new Date()))().toISOString();
  review.decisions[index] = {
    itemType,
    itemId,
    decision: input.decision,
    ...(editedValue !== undefined ? { editedValue } : {}),
    ...(input.reviewNote ? { reviewNote: input.reviewNote } : {}),
    decidedAt: now,
  };
  review.updatedAt = now;
  await writeReview(workspace, review, roleResumeDraftReviewPaths(workspace, review.targetId, proposalId));
  return review;
}

export async function setRoleResumeDraftStatementReviewDecision(
  workspace: string,
  proposalId: string,
  itemId: string,
  input: {
    decision: "accept" | "edit" | "reject";
    editedValue?: unknown;
    reviewNote?: string;
    now?: () => Date;
  },
): Promise<RoleResumeDraftReview> {
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  const ledger = proposal.claimLedger.find((entry) => entry.draftItemId === itemId);
  if (!ledger) throw new Error(`Claim ledger entry is missing for draft statement: ${itemId}`);
  const review = await showRoleResumeDraftReview(workspace, proposalId);
  if (review.status === "completed") throw new Error("Completed role resume draft reviews are immutable.");
  const itemIndex = review.decisions.findIndex((entry) => entry.itemType === "draft-item" && entry.itemId === itemId);
  const ledgerIndex = review.decisions.findIndex((entry) => entry.itemType === "claim-ledger" && entry.itemId === ledger.id);
  if (itemIndex < 0 || ledgerIndex < 0) throw new Error(`Review decisions are incomplete for draft statement: ${itemId}`);
  if (review.decisions[itemIndex].decision !== "pending" || review.decisions[ledgerIndex].decision !== "pending") {
    throw new Error(`A statement or claim-ledger decision already exists for ${itemId}.`);
  }
  if (input.decision === "edit" && input.editedValue === undefined) throw new Error("Edit requires edited content.");
  if (input.decision !== "edit" && input.editedValue !== undefined) throw new Error("Only edit may include edited content.");
  const editedValue = input.decision === "edit"
    ? await validateReviewEdit(workspace, proposalId, "draft-item", itemId, input.editedValue)
    : undefined;
  const now = (input.now ?? (() => new Date()))().toISOString();
  review.decisions[itemIndex] = {
    itemType: "draft-item",
    itemId,
    decision: input.decision,
    ...(editedValue !== undefined ? { editedValue } : {}),
    ...(input.reviewNote ? { reviewNote: input.reviewNote } : {}),
    decidedAt: now,
  };
  review.decisions[ledgerIndex] = {
    itemType: "claim-ledger",
    itemId: ledger.id,
    decision: input.decision === "edit" ? "accept" : input.decision,
    reviewNote: input.decision === "reject"
      ? "Excluded with the reviewed statement."
      : "Included with the reviewed statement after claim-ledger validation.",
    decidedAt: now,
  };
  review.updatedAt = now;
  await writeReview(workspace, review, roleResumeDraftReviewPaths(workspace, review.targetId, proposalId));
  return review;
}

export async function completeRoleResumeDraftReview(
  workspace: string,
  proposalId: string,
  options: { now?: () => Date } = {},
): Promise<RoleResumeDraftReviewStatus> {
  const review = await showRoleResumeDraftReview(workspace, proposalId);
  if (review.status === "completed") return getRoleResumeDraftReviewStatus(workspace, proposalId);
  const pendingDecisions = review.decisions.filter((entry) => entry.decision === "pending");
  if (pendingDecisions.length) throw new Error(`${pendingDecisions.length} role resume draft review decisions remain pending.`);
  const merged = await mergeReviewedRoleResumeDraft(workspace, proposalId, review);
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  const scaffold = await showRoleResumeDraftScaffold(workspace, proposal.targetId);
  const context = await loadRoleResumeDraftingContext(workspace, proposal.targetId);
  const validated = validateRoleResumeDraftPayload(
    {
      sections: merged.sections,
      warnings: proposal.warnings,
      ambiguities: merged.ambiguities,
    },
    proposal.id,
    scaffold,
    context,
    proposal.input.draftScaffoldSha256,
  );
  const blocking = validated.validationIssues.filter((entry) => entry.severity === "critical" || entry.severity === "high");
  if (blocking.length) throw new Error(`Role resume draft review contains ${blocking.length} blocking validation issue(s).`);
  const required = scaffold.sections.filter((entry) => entry.status === "include");
  const emptyRequired = required.filter((entry) => {
    const section = validated.sections.find((candidate) => candidate.id === entry.id);
    return !section || !section.items.length;
  });
  if (emptyRequired.length) {
    throw new Error(`Required draft sections remain empty: ${emptyRequired.map((entry) => entry.sectionType).join(", ")}.`);
  }
  const unresolvedAmbiguities = merged.ambiguities.filter((entry) => !entry.resolved);
  if (unresolvedAmbiguities.length) throw new Error(`${unresolvedAmbiguities.length} draft ambiguities remain unresolved.`);
  if (validated.claimLedger.length !== validated.sections.flatMap((entry) => entry.items).length) {
    throw new Error("Claim ledger is incomplete.");
  }
  review.status = "completed";
  review.updatedAt = (options.now ?? (() => new Date()))().toISOString();
  await writeReview(workspace, review, roleResumeDraftReviewPaths(workspace, review.targetId, proposalId));
  return getRoleResumeDraftReviewStatus(workspace, proposalId);
}

export async function showRoleResumeDraftReview(
  workspace: string,
  proposalId: string,
): Promise<RoleResumeDraftReview> {
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  const paths = roleResumeDraftReviewPaths(workspace, proposal.targetId, proposalId);
  if (!(await pathExists(paths.reviewPath))) throw new Error(`Role resume draft review not found: ${proposalId}`);
  return RoleResumeDraftReviewSchema.parse(await readJson<unknown>(paths.reviewPath, null));
}

export async function getRoleResumeDraftReviewStatus(
  workspace: string,
  proposalId: string,
): Promise<RoleResumeDraftReviewStatus> {
  let proposal;
  try {
    proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  } catch {
    return emptyReviewStatus(proposalId, "unknown", "missing", ["Proposal or review not found."]);
  }
  const paths = roleResumeDraftReviewPaths(workspace, proposal.targetId, proposalId);
  const reviewExists = await pathExists(paths.reviewPath);
  const manifestExists = await pathExists(paths.manifestPath);
  if (!reviewExists && !manifestExists) return emptyReviewStatus(proposalId, proposal.targetId, "missing", ["Review not found."], paths);
  if (!reviewExists || !manifestExists) return emptyReviewStatus(proposalId, proposal.targetId, "invalid", ["Review artifact set is incomplete."], paths);
  try {
    const review = RoleResumeDraftReviewSchema.parse(await readJson<unknown>(paths.reviewPath, null));
    const manifest = RoleResumeDraftReviewManifestSchema.parse(await readJson<unknown>(paths.manifestPath, null));
    if (await hashFile(paths.reviewPath) !== manifest.reviewSha256) {
      return emptyReviewStatus(proposalId, proposal.targetId, "invalid", ["Review hash mismatch."], paths);
    }
    const proposalPath = resolveWithin(
      workspace,
      `targets/roles/${proposal.targetId}/resume-drafting/proposals/${proposalId}/proposal.json`,
    );
    if (await hashFile(proposalPath) !== manifest.proposalSha256) {
      return emptyReviewStatus(proposalId, proposal.targetId, "invalid", ["Proposal changed after review."], paths);
    }
    const counts = decisionCounts(review);
    return {
      proposalId,
      targetId: proposal.targetId,
      status: review.status,
      counts,
      unresolvedCount: counts.pending,
      reviewPath: paths.reviewRelativePath,
      manifestPath: paths.manifestRelativePath,
      reasons: [],
    };
  } catch (error) {
    return emptyReviewStatus(proposalId, proposal.targetId, "invalid", [errorMessage(error)], paths);
  }
}

export async function mergeReviewedRoleResumeDraft(
  workspace: string,
  proposalId: string,
  suppliedReview?: RoleResumeDraftReview,
): Promise<ReviewedRoleResumeDraftPayload> {
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  const review = suppliedReview ?? await showRoleResumeDraftReview(workspace, proposalId);
  const sectionOrderDecision = review.decisions.find((entry) => entry.itemType === "section-order");
  if (!sectionOrderDecision || sectionOrderDecision.decision === "pending") throw new Error("Section-order decision remains unresolved.");
  const requestedOrder = sectionOrderDecision.decision === "edit"
    ? parseSectionOrder(sectionOrderDecision.editedValue, proposal.sections.map((entry) => entry.id))
    : proposal.sections.slice().sort((a, b) => a.order - b.order).map((entry) => entry.id);
  const ledgerDecisionByItem = new Map(
    proposal.claimLedger.map((entry) => [
      entry.draftItemId,
      review.decisions.find((decision) => decision.itemType === "claim-ledger" && decision.itemId === entry.id),
    ]),
  );
  const sections = proposal.sections.map((section) => {
    const decision = requiredDecision(review, "section", section.id);
    if (decision.decision === "reject") return { ...section, status: "empty" as const, items: [] };
    const selected = decision.decision === "edit"
      ? RoleResumeDraftSectionSchema.parse(decision.editedValue)
      : section;
    const items = selected.items.flatMap((item) => {
      const itemDecision = requiredDecision(review, "draft-item", item.id);
      const ledgerDecision = ledgerDecisionByItem.get(item.id);
      if (!ledgerDecision || ledgerDecision.decision === "pending") throw new Error(`Claim-ledger decision remains unresolved for ${item.id}.`);
      if (itemDecision.decision === "reject" || ledgerDecision.decision === "reject") return [];
      if (itemDecision.decision === "edit") return [RoleResumeDraftItemSchema.parse(itemDecision.editedValue)];
      return [item];
    });
    return { ...selected, items };
  }).sort((a, b) => requestedOrder.indexOf(a.id) - requestedOrder.indexOf(b.id))
    .map((entry, order) => ({ ...entry, order }));
  const ambiguities = proposal.ambiguities.flatMap((entry) => {
    const decision = requiredDecision(review, "ambiguity", entry.id);
    if (decision.decision === "reject") return [];
    if (decision.decision === "edit") return [ResumeDraftAmbiguitySchema.parse(decision.editedValue)];
    return [entry];
  });
  const context = await loadRoleResumeDraftingContext(workspace, proposal.targetId);
  const scaffold = await showRoleResumeDraftScaffold(workspace, proposal.targetId);
  const validated = validateRoleResumeDraftPayload(
    { sections, warnings: proposal.warnings, ambiguities },
    proposal.id,
    scaffold,
    context,
    proposal.input.draftScaffoldSha256,
  );
  return {
    sections: validated.sections,
    claimLedger: validated.claimLedger,
    ambiguities: validated.ambiguities,
  };
}

export async function readRoleResumeDraftReviewEdit(filePath: string): Promise<unknown> {
  const text = await readFile(path.resolve(filePath), "utf8");
  try {
    return JSON.parse(text);
  } catch {
    return text.trim();
  }
}

export function formatRoleResumeDraftReviewStatus(status: RoleResumeDraftReviewStatus) {
  return [
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
  type: RoleResumeDraftReviewDecision["itemType"],
  itemId: string,
  value: unknown,
) {
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  if (type === "section-order") return parseSectionOrder(value, proposal.sections.map((entry) => entry.id));
  if (type === "ambiguity") {
    const parsed = ResumeDraftAmbiguitySchema.parse(value);
    if (parsed.id !== itemId || !parsed.resolved || !parsed.resolutionRationale) {
      throw new Error("Edited ambiguity must preserve its ID and include a resolution rationale.");
    }
    return parsed;
  }
  if (type === "claim-ledger") {
    const parsed = ResumeDraftClaimLedgerEntrySchema.parse(value);
    if (parsed.id !== itemId) throw new Error("Edited claim-ledger ID must not change.");
    return parsed;
  }
  if (type === "section") {
    const parsed = RoleResumeDraftSectionSchema.parse(value);
    if (parsed.id !== itemId) throw new Error("Edited section ID must not change.");
    await validateSimulatedEdit(workspace, proposalId, type, itemId, parsed);
    return parsed;
  }
  const original = proposal.sections.flatMap((entry) => entry.items).find((entry) => entry.id === itemId);
  if (!original) throw new Error(`Unknown role resume draft item: ${itemId}`);
  const parsed = typeof value === "string"
    ? RoleResumeDraftItemSchema.parse({ ...original, text: value })
    : RoleResumeDraftItemSchema.parse(value);
  if (parsed.id !== itemId) throw new Error("Edited draft-item ID must not change in the review decision.");
  await validateSimulatedEdit(workspace, proposalId, type, itemId, parsed);
  return parsed;
}

async function validateSimulatedEdit(
  workspace: string,
  proposalId: string,
  type: "section" | "draft-item",
  itemId: string,
  value: RoleResumeDraftSection | ReturnType<typeof RoleResumeDraftItemSchema.parse>,
) {
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  const sections = proposal.sections.map((section) => {
    if (type === "section" && section.id === itemId) return value as RoleResumeDraftSection;
    if (type === "draft-item") {
      return {
        ...section,
        items: section.items.map((item) => item.id === itemId ? value as ReturnType<typeof RoleResumeDraftItemSchema.parse> : item),
      };
    }
    return section;
  });
  const scaffold = await showRoleResumeDraftScaffold(workspace, proposal.targetId);
  const context = await loadRoleResumeDraftingContext(workspace, proposal.targetId);
  const result = validateRoleResumeDraftPayload(
    { sections, warnings: proposal.warnings, ambiguities: proposal.ambiguities },
    proposal.id,
    scaffold,
    context,
    proposal.input.draftScaffoldSha256,
  );
  const sourceSectionId = type === "section"
    ? itemId
    : proposal.sections.find((entry) => entry.items.some((item) => item.id === itemId))?.id;
  const blocking = result.validationIssues.filter((entry) =>
    (entry.severity === "critical" || entry.severity === "high")
    && (!entry.sectionIds.length || sourceSectionId && entry.sectionIds.includes(sourceSectionId)));
  if (blocking.length) throw new Error(`Edited draft content failed validation: ${blocking.map((entry) => entry.code).join(", ")}.`);
}

async function writeReview(
  workspace: string,
  review: RoleResumeDraftReview,
  paths: ReturnType<typeof roleResumeDraftReviewPaths>,
) {
  const proposalPath = resolveWithin(
    workspace,
    `targets/roles/${review.targetId}/resume-drafting/proposals/${review.proposalId}/proposal.json`,
  );
  await writeJsonAtomic(paths.reviewPath, review);
  const existing = await readJson<{ createdAt?: string }>(paths.manifestPath, {});
  const manifest = RoleResumeDraftReviewManifestSchema.parse({
    schemaVersion: 1,
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
  itemType: RoleResumeDraftReviewDecision["itemType"],
  itemId: string,
): RoleResumeDraftReviewDecision {
  return { itemType, itemId, decision: "pending" };
}
function requiredDecision(
  review: RoleResumeDraftReview,
  itemType: RoleResumeDraftReviewDecision["itemType"],
  itemId: string,
) {
  const decision = review.decisions.find((entry) => entry.itemType === itemType && entry.itemId === itemId);
  if (!decision || decision.decision === "pending") throw new Error(`Unresolved review decision: ${itemType}/${itemId}`);
  return decision;
}
function parseSectionOrder(value: unknown, expectedIds: string[]): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error("Section-order edit must be an array of section IDs.");
  }
  const ids = value as string[];
  if (ids.length !== expectedIds.length || [...ids].sort().some((entry, index) => entry !== [...expectedIds].sort()[index])) {
    throw new Error("Section-order edit must contain every section ID exactly once.");
  }
  return ids;
}
function decisionCounts(review: RoleResumeDraftReview) {
  return review.decisions.reduce((counts, entry) => {
    counts[entry.decision] += 1;
    return counts;
  }, { pending: 0, accept: 0, edit: 0, reject: 0 });
}
export function roleResumeDraftReviewPaths(workspace: string, targetId: string, proposalId: string) {
  const root = `targets/roles/${targetId}/resume-drafting/reviews/${proposalId}`;
  return {
    reviewRelativePath: `${root}/review.json`,
    reviewPath: resolveWithin(workspace, `${root}/review.json`),
    manifestRelativePath: `${root}/review-manifest.json`,
    manifestPath: resolveWithin(workspace, `${root}/review-manifest.json`),
  };
}
function emptyReviewStatus(
  proposalId: string,
  targetId: string,
  status: RoleResumeDraftReviewStatus["status"],
  reasons: string[],
  paths?: ReturnType<typeof roleResumeDraftReviewPaths>,
): RoleResumeDraftReviewStatus {
  return {
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
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) throw new Error("Resolved path leaves workspace.");
  return absolute;
}
function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
