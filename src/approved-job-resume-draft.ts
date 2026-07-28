import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  ApprovedJobResumeDraftManifestSchema,
  ApprovedJobResumeDraftSchema,
  JobResumeDraftProposalManifestSchema,
  JobResumeDraftReviewManifestSchema,
  type ApprovedJobResumeDraft,
  type JobResumeDraftCompleteness,
  type JobResumeDraftReview,
  type JobResumeDraftRisk,
} from "./job-resume-draft-schemas.js";
import {
  buildJobResumeDraftClaimLedger,
  buildJobResumeDraftEvidenceUsage,
  getJobResumeDraftProposalStatus,
  jobResumeDraftProposalPaths,
  listJobResumeDraftProposals,
  showJobResumeDraftProposal,
  validateJobResumeDraftPayload,
} from "./job-resume-draft-proposal.js";
import {
  getJobResumeDraftReviewStatus,
  jobResumeDraftReviewPaths,
  mergeReviewedJobResumeDraft,
  showJobResumeDraftReview,
} from "./job-resume-draft-review.js";
import {
  JOB_RESUME_DRAFTING_POLICY_NAME,
  JOB_RESUME_DRAFTING_POLICY_VERSION,
  getJobResumeDraftScaffoldStatus,
  loadJobResumeDraftingContext,
  showJobResumeDraftScaffold,
} from "./job-resume-drafting.js";

export interface ApproveJobResumeDraftOptions {
  rebuild?: boolean;
  now?: () => Date;
}
export interface ApproveJobResumeDraftResult {
  targetId: string;
  proposalId: string;
  reviewId: string;
  result: "created" | "rebuilt" | "already-current";
  humanApprovedCount: number;
  humanEditedCount: number;
  rejectedItemCount: number;
  completeness: "empty" | "partial" | "complete";
  usableForRendering: boolean;
  draftPath: string;
  manifestPath: string;
}
export interface ApprovedJobResumeDraftStatus {
  targetId: string;
  draftExists: boolean;
  manifestExists: boolean;
  draftHashMatches: boolean | null;
  dependenciesMatch: boolean | null;
  scaffoldHashMatches: boolean | null;
  proposalHashMatches: boolean | null;
  reviewHashMatches: boolean | null;
  policyVersionMatches: boolean | null;
  status: "missing" | "current" | "stale" | "invalid";
  usableForRendering: boolean;
  reasons: string[];
  draftPath: string;
  manifestPath: string;
}

export async function approveJobResumeDraft(
  workspace: string,
  targetId: string,
  options: ApproveJobResumeDraftOptions = {},
): Promise<ApproveJobResumeDraftResult> {
  const proposal = await selectCompletedProposal(workspace, targetId);
  const proposalStatus = await getJobResumeDraftProposalStatus(workspace, proposal.id);
  if (proposalStatus.status !== "current" || !proposalStatus.readyForReview) {
    throw new Error("Cannot approve a stale, invalid, or unreviewable Job resume draft proposal.");
  }
  const review = await showJobResumeDraftReview(workspace, proposal.id);
  const reviewStatus = await getJobResumeDraftReviewStatus(workspace, review.id);
  if (reviewStatus.status !== "completed") {
    throw new Error(`Job resume draft review must be completed before approval. Current status: ${reviewStatus.status}`);
  }
  const context = await loadJobResumeDraftingContext(workspace, targetId);
  const scaffoldStatus = await getJobResumeDraftScaffoldStatus(workspace, targetId);
  if (scaffoldStatus.status !== "current") {
    throw new Error("Job resume draft scaffold must be current before approval.");
  }
  const scaffold = await showJobResumeDraftScaffold(workspace, targetId);
  const scaffoldSha256 = await hashFile(resolveWithin(workspace, scaffoldStatus.scaffoldPath));
  if (
    proposal.input.targetSha256 !== context.targetSha256 ||
    proposal.input.requirementModelSha256 !== context.requirementInput.modelSha256 ||
    proposal.input.evidenceMapSha256 !== context.evidenceMapSha256 ||
    proposal.input.coverageSha256 !== context.coverageSha256 ||
    proposal.input.assessmentSha256 !== context.assessmentSha256 ||
    proposal.input.contentPlanSha256 !== context.contentPlanSha256 ||
    proposal.input.scaffoldSha256 !== scaffoldSha256 ||
    proposal.input.selectedEvidenceSetSha256 !== context.selectedEvidenceSetSha256 ||
    proposal.input.selectedClaimSetSha256 !== context.selectedClaimSetSha256
  ) {
    throw new Error("Job resume draft proposal dependencies changed and approval was refused.");
  }
  const proposalPaths = jobResumeDraftProposalPaths(workspace, targetId, proposal.id);
  const reviewPaths = jobResumeDraftReviewPaths(workspace, targetId, proposal.id);
  const proposalManifest = JobResumeDraftProposalManifestSchema.parse(
    await readJson<unknown>(proposalPaths.manifestPath, null),
  );
  const reviewManifest = JobResumeDraftReviewManifestSchema.parse(
    await readJson<unknown>(reviewPaths.manifestPath, null),
  );
  if (reviewManifest.proposalSha256 !== proposalManifest.proposalSha256) {
    throw new Error("Job draft review does not reference the current proposal hash.");
  }
  const paths = approvedJobResumeDraftPaths(workspace, targetId);
  const existingStatus = await getApprovedJobResumeDraftStatus(workspace, targetId);
  if (existingStatus.status === "current" && await pathExists(paths.manifestPath)) {
    const manifest = ApprovedJobResumeDraftManifestSchema.parse(
      await readJson<unknown>(paths.manifestPath, null),
    );
    if (
      manifest.proposalId === proposal.id &&
      manifest.proposalSha256 === proposalManifest.proposalSha256 &&
      manifest.reviewId === review.id &&
      manifest.reviewSha256 === reviewManifest.reviewSha256
    ) {
      return approvalResult(
        await showApprovedJobResumeDraft(workspace, targetId),
        review,
        proposal.id,
        paths,
        "already-current",
      );
    }
  }
  if (["stale", "invalid"].includes(existingStatus.status) && !options.rebuild) {
    throw new Error(`Approved Job resume draft is ${existingStatus.status}; use explicit --rebuild.`);
  }
  const reviewed = await mergeReviewedJobResumeDraft(workspace, proposal.id, review);
  const validated = validateJobResumeDraftPayload(
    {
      sections: reviewed.sections,
      warnings: proposal.warnings,
      ambiguities: reviewed.ambiguities,
    },
    proposal.id,
    scaffold,
    context,
    scaffoldSha256,
  );
  const blocking = validated.validationIssues.filter((entry) =>
    entry.severity === "critical" || entry.severity === "high"
  );
  if (blocking.length > 0) {
    throw new Error(`Approved Job draft contains ${blocking.length} blocking validation issue(s).`);
  }
  const sections = validated.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => applyReviewTrust(item, proposal, review)),
  }));
  const claimLedger = buildJobResumeDraftClaimLedger(sections, context);
  const evidenceUsage = buildJobResumeDraftEvidenceUsage(sections, scaffold, context);
  const risks = deriveApprovedRisks(sections, validated.validationIssues, evidenceUsage);
  const completeness = deriveJobResumeDraftCompleteness(
    scaffold,
    sections,
    claimLedger,
    evidenceUsage,
    risks,
    validated.ambiguities,
  );
  const now = (options.now ?? (() => new Date()))().toISOString();
  let createdAt = now;
  if (await pathExists(paths.draftPath)) {
    try {
      createdAt = ApprovedJobResumeDraftSchema.parse(
        await readJson<unknown>(paths.draftPath, null),
      ).createdAt;
    } catch {
      // Explicit rebuild may replace a malformed approved draft.
    }
  }
  const draftId = `approved-job-resume-draft_${hashText([
    targetId,
    context.contentPlanSha256,
    proposalManifest.proposalSha256,
    reviewManifest.reviewSha256,
    JOB_RESUME_DRAFTING_POLICY_VERSION,
  ].join("\0")).slice(0, 16)}`;
  const approved = ApprovedJobResumeDraftSchema.parse({
    schemaVersion: 1,
    id: draftId,
    targetId,
    targetType: "job",
    mode: "job-specific-resume",
    targetTitle: context.target.title,
    positioningState: context.contentPlan.positioning.state,
    contentPlan: scaffold.contentPlan,
    draftingPolicy: {
      name: JOB_RESUME_DRAFTING_POLICY_NAME,
      version: JOB_RESUME_DRAFTING_POLICY_VERSION,
    },
    prompt: {
      templateId: proposal.prompt.templateId,
      templateVersion: proposal.prompt.templateVersion,
    },
    sections,
    claimLedger,
    evidenceUsage,
    risks,
    warnings: validated.warnings,
    ambiguities: validated.ambiguities,
    completeness,
    provenance: {
      targetSha256: context.targetSha256,
      jobDescriptionSha256: context.sourceSha256,
      requirementModelSha256: context.requirementInput.modelSha256,
      evidenceMapSha256: context.evidenceMapSha256,
      coverageSha256: context.coverageSha256,
      assessmentSha256: context.assessmentSha256,
      contentPlanSha256: context.contentPlanSha256,
      scaffoldSha256,
      proposalSha256: proposalManifest.proposalSha256,
      reviewSha256: reviewManifest.reviewSha256,
    },
    createdAt,
    updatedAt: now,
  });
  assertApprovedJobResumeDraft(approved);
  await writeJsonAtomic(paths.draftPath, approved);
  const manifest = ApprovedJobResumeDraftManifestSchema.parse({
    schemaVersion: 1,
    draftId: approved.id,
    targetId,
    draftPath: paths.draftRelativePath,
    draftSha256: await hashFile(paths.draftPath),
    policyName: JOB_RESUME_DRAFTING_POLICY_NAME,
    policyVersion: JOB_RESUME_DRAFTING_POLICY_VERSION,
    targetSha256: context.targetSha256,
    requirementModelSha256: context.requirementInput.modelSha256,
    evidenceMapSha256: context.evidenceMapSha256,
    coverageSha256: context.coverageSha256,
    assessmentSha256: context.assessmentSha256,
    contentPlanSha256: context.contentPlanSha256,
    scaffoldSha256,
    proposalId: proposal.id,
    proposalSha256: proposalManifest.proposalSha256,
    reviewId: review.id,
    reviewSha256: reviewManifest.reviewSha256,
    createdAt,
    updatedAt: now,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
  return approvalResult(
    approved,
    review,
    proposal.id,
    paths,
    existingStatus.status === "missing" ? "created" : "rebuilt",
  );
}

export async function showApprovedJobResumeDraft(
  workspace: string,
  targetId: string,
): Promise<ApprovedJobResumeDraft> {
  const paths = approvedJobResumeDraftPaths(workspace, targetId);
  if (!(await pathExists(paths.draftPath))) {
    throw new Error(`Approved Job resume draft not found: ${targetId}`);
  }
  return ApprovedJobResumeDraftSchema.parse(await readJson<unknown>(paths.draftPath, null));
}

export async function getApprovedJobResumeDraftStatus(
  workspace: string,
  targetId: string,
): Promise<ApprovedJobResumeDraftStatus> {
  const paths = approvedJobResumeDraftPaths(workspace, targetId);
  const draftExists = await pathExists(paths.draftPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const base = {
    targetId,
    draftExists,
    manifestExists,
    draftPath: paths.draftRelativePath,
    manifestPath: paths.manifestRelativePath,
  };
  if (!draftExists && !manifestExists) {
    return emptyStatus(base, "missing", ["No approved Job resume draft exists."]);
  }
  if (!draftExists || !manifestExists) {
    return emptyStatus(base, "invalid", ["Approved Job draft artifact set is incomplete."]);
  }
  let draft: ApprovedJobResumeDraft;
  let manifest: ReturnType<typeof ApprovedJobResumeDraftManifestSchema.parse>;
  try {
    draft = ApprovedJobResumeDraftSchema.parse(await readJson<unknown>(paths.draftPath, null));
    manifest = ApprovedJobResumeDraftManifestSchema.parse(await readJson<unknown>(paths.manifestPath, null));
    assertApprovedJobResumeDraft(draft);
  } catch (error) {
    return emptyStatus(base, "invalid", [`Stored approved Job draft is malformed: ${errorMessage(error)}`]);
  }
  const draftHashMatches = await hashFile(paths.draftPath) === manifest.draftSha256;
  if (
    !draftHashMatches ||
    manifest.draftId !== draft.id ||
    manifest.targetId !== targetId ||
    draft.targetId !== targetId ||
    manifest.draftPath !== paths.draftRelativePath
  ) {
    return { ...emptyStatus(base, "invalid", ["Approved Job draft hash, identity, or path is invalid."]), draftHashMatches };
  }
  let context;
  try {
    context = await loadJobResumeDraftingContext(workspace, targetId);
  } catch (error) {
    return { ...emptyStatus(base, "stale", [`Current drafting dependencies are unavailable: ${errorMessage(error)}`]), draftHashMatches };
  }
  const scaffoldStatus = await getJobResumeDraftScaffoldStatus(workspace, targetId);
  const scaffoldHashMatches = scaffoldStatus.status === "current"
    && await hashFile(resolveWithin(workspace, scaffoldStatus.scaffoldPath)) === manifest.scaffoldSha256;
  const proposalPaths = jobResumeDraftProposalPaths(workspace, targetId, manifest.proposalId);
  const reviewPaths = jobResumeDraftReviewPaths(workspace, targetId, manifest.proposalId);
  const proposalHashMatches = await pathExists(proposalPaths.proposalPath)
    && await hashFile(proposalPaths.proposalPath) === manifest.proposalSha256;
  const reviewHashMatches = await pathExists(reviewPaths.reviewPath)
    && await hashFile(reviewPaths.reviewPath) === manifest.reviewSha256;
  const dependenciesMatch = manifest.targetSha256 === context.targetSha256
    && manifest.requirementModelSha256 === context.requirementInput.modelSha256
    && manifest.evidenceMapSha256 === context.evidenceMapSha256
    && manifest.coverageSha256 === context.coverageSha256
    && manifest.assessmentSha256 === context.assessmentSha256
    && manifest.contentPlanSha256 === context.contentPlanSha256;
  const policyVersionMatches = manifest.policyName === JOB_RESUME_DRAFTING_POLICY_NAME
    && manifest.policyVersion === JOB_RESUME_DRAFTING_POLICY_VERSION;
  const reasons = [
    ...(!dependenciesMatch ? ["Job drafting dependencies changed."] : []),
    ...(!scaffoldHashMatches ? ["Job draft scaffold changed."] : []),
    ...(!proposalHashMatches ? ["Reviewed Job draft proposal changed or is missing."] : []),
    ...(!reviewHashMatches ? ["Job draft review changed or is missing."] : []),
    ...(!policyVersionMatches ? ["Job drafting policy changed."] : []),
  ];
  return {
    ...base,
    draftHashMatches,
    dependenciesMatch,
    scaffoldHashMatches,
    proposalHashMatches,
    reviewHashMatches,
    policyVersionMatches,
    status: reasons.length > 0 ? "stale" : "current",
    usableForRendering: reasons.length === 0 && draft.completeness.usableForRendering,
    reasons,
  };
}

export function deriveJobResumeDraftCompleteness(
  scaffold: Awaited<ReturnType<typeof showJobResumeDraftScaffold>>,
  sections: ApprovedJobResumeDraft["sections"],
  claimLedger: ApprovedJobResumeDraft["claimLedger"],
  evidenceUsage: ApprovedJobResumeDraft["evidenceUsage"],
  risks: ApprovedJobResumeDraft["risks"],
  ambiguities: ApprovedJobResumeDraft["ambiguities"],
): JobResumeDraftCompleteness {
  const required = scaffold.sections.filter((entry) => entry.inclusion === "include");
  const sectionById = new Map(sections.map((entry) => [entry.id, entry]));
  const completedRequiredSectionCount = required.filter((entry) =>
    (sectionById.get(entry.id)?.items.length ?? 0) > 0
  ).length;
  const items = sections.flatMap((entry) => entry.items);
  const validatedDraftItemCount = items.filter((entry) => entry.validation.status === "valid").length;
  const claimLedgerComplete = claimLedger.length === items.length
    && items.every((entry) => claimLedger.some((ledger) => ledger.draftItemId === entry.id));
  const selectedEvidence = new Set(scaffold.sections.flatMap((entry) => entry.allowedEvidenceIds));
  const evidenceUsageComplete = [...selectedEvidence].every((id) =>
    evidenceUsage.some((entry) => entry.evidenceId === id)
  );
  const provenanceComplete = items.every((entry) =>
    entry.requirementIds.length > 0 &&
    entry.evidenceIds.length > 0 &&
    entry.claimIds.length > 0 &&
    entry.claimBoundaryIds.length > 0 &&
    Boolean(entry.provenance.reviewDecision) &&
    Boolean(entry.provenance.reviewDecisionId)
  );
  const unresolvedCriticalIssueCount = risks.filter((entry) =>
    entry.severity === "critical" || entry.severity === "high"
  ).length;
  const unresolvedAmbiguityCount = ambiguities.filter((entry) => !entry.resolved).length;
  const blockingReasons = [
    ...(completedRequiredSectionCount !== required.length ? ["Required Job draft sections are incomplete."] : []),
    ...(validatedDraftItemCount !== items.length ? ["One or more Job draft statements are not fully valid."] : []),
    ...(!claimLedgerComplete ? ["Job draft claim ledger is incomplete."] : []),
    ...(!evidenceUsageComplete ? ["Job draft evidence-usage ledger is incomplete."] : []),
    ...(!provenanceComplete ? ["Job draft statement-level provenance is incomplete."] : []),
    ...(unresolvedCriticalIssueCount > 0 ? ["Critical or high Job draft risks remain."] : []),
    ...(unresolvedAmbiguityCount > 0 ? ["Job draft ambiguities remain unresolved."] : []),
  ];
  const status = items.length === 0
    ? "empty" as const
    : blockingReasons.length > 0
      ? "partial" as const
      : "complete" as const;
  return {
    status,
    requiredSectionCount: required.length,
    completedRequiredSectionCount,
    draftItemCount: items.length,
    validatedDraftItemCount,
    claimLedgerComplete,
    evidenceUsageComplete,
    provenanceComplete,
    unresolvedCriticalIssueCount,
    unresolvedAmbiguityCount,
    reviewComplete: true,
    usableForRendering: status === "complete",
    blockingReasons,
  };
}

export function assertApprovedJobResumeDraft(draft: ApprovedJobResumeDraft): void {
  if (draft.targetType !== "job" || draft.mode !== "job-specific-resume") {
    throw new Error("Approved Job resume draft target type or mode is invalid.");
  }
  if (
    draft.draftingPolicy.name !== JOB_RESUME_DRAFTING_POLICY_NAME ||
    draft.draftingPolicy.version !== JOB_RESUME_DRAFTING_POLICY_VERSION
  ) {
    throw new Error("Approved Job resume draft policy is unsupported.");
  }
  const items = draft.sections.flatMap((entry) => entry.items);
  if (items.some((entry) => entry.trustState === "model-proposed")) {
    throw new Error("Approved Job resume draft contains unreviewed model prose.");
  }
  if (items.some((entry) =>
    !entry.requirementIds.length ||
    !entry.evidenceIds.length ||
    !entry.claimIds.length ||
    !entry.claimBoundaryIds.length ||
    !entry.provenance.reviewDecision ||
    !entry.provenance.reviewDecisionId
  )) {
    throw new Error("Approved Job resume draft contains a statement without complete provenance.");
  }
  if (
    draft.claimLedger.length !== items.length ||
    items.some((entry) => !draft.claimLedger.some((ledger) => ledger.draftItemId === entry.id))
  ) {
    throw new Error("Approved Job resume draft claim ledger is incomplete.");
  }
  if (draft.completeness.status === "complete" && !draft.completeness.usableForRendering) {
    throw new Error("Complete approved Job draft must be structurally usable for rendering.");
  }
}

export function approvedJobResumeDraftPaths(workspace: string, targetId: string) {
  const root = `targets/jobs/${targetId}/resume-drafting/approved`;
  const draftRelativePath = `${root}/job-resume-draft.json`;
  const manifestRelativePath = `${root}/draft-manifest.json`;
  return {
    draftRelativePath,
    draftPath: resolveWithin(workspace, draftRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}
export function formatApproveJobResumeDraftResult(result: ApproveJobResumeDraftResult): string {
  return [
    `Target ID: ${result.targetId}`,
    `Proposal ID: ${result.proposalId}`,
    `Review ID: ${result.reviewId}`,
    `Result: ${result.result}`,
    `Human approved: ${result.humanApprovedCount}`,
    `Human edited: ${result.humanEditedCount}`,
    `Rejected items: ${result.rejectedItemCount}`,
    `Completeness: ${result.completeness}`,
    `Usable for future rendering: ${result.usableForRendering ? "yes" : "no"}`,
    `Approved draft path: ${result.draftPath}`,
    `Manifest path: ${result.manifestPath}`,
  ].join("\n");
}
export function formatApprovedJobResumeDraftStatus(status: ApprovedJobResumeDraftStatus): string {
  return [
    `Target ID: ${status.targetId}`,
    `Overall status: ${status.status}`,
    `Usable for rendering: ${status.usableForRendering ? "yes" : "no"}`,
    `Draft hash matches: ${status.draftHashMatches ?? "n/a"}`,
    `Dependencies match: ${status.dependenciesMatch ?? "n/a"}`,
    `Scaffold hash matches: ${status.scaffoldHashMatches ?? "n/a"}`,
    `Proposal hash matches: ${status.proposalHashMatches ?? "n/a"}`,
    `Review hash matches: ${status.reviewHashMatches ?? "n/a"}`,
    `Draft path: ${status.draftPath}`,
    `Manifest path: ${status.manifestPath}`,
    ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((entry) => `- ${entry}`)] : []),
  ].join("\n");
}

async function selectCompletedProposal(workspace: string, targetId: string) {
  const proposals = (await listJobResumeDraftProposals(workspace, targetId))
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id));
  for (const proposal of proposals) {
    const status = await getJobResumeDraftReviewStatus(workspace, proposal.id);
    if (status.status === "completed") return proposal;
  }
  throw new Error(`No completed Job resume draft review is available for target: ${targetId}`);
}
function applyReviewTrust(
  item: ApprovedJobResumeDraft["sections"][number]["items"][number],
  proposal: Awaited<ReturnType<typeof showJobResumeDraftProposal>>,
  review: JobResumeDraftReview,
) {
  const direct = review.decisions.find((entry) =>
    entry.itemType === "draft-item" && entry.itemId === item.id
  );
  const edited = direct ?? review.decisions.find((entry) => {
    if (entry.itemType !== "draft-item" || entry.decision !== "edit" || !entry.editedValue) return false;
    const value = entry.editedValue as { text?: unknown; sectionId?: unknown };
    return value.text === item.text && value.sectionId === item.sectionId;
  });
  if (!edited || edited.decision === "pending" || edited.decision === "reject") {
    throw new Error(`Approved Job draft item lacks an accepted or edited human decision: ${item.id}`);
  }
  return {
    ...item,
    trustState: edited.decision === "edit" ? "human-edited" as const : "human-approved" as const,
    provenance: {
      ...item.provenance,
      reviewDecisionId: edited.id,
      model: {
        provider: proposal.model.provider,
        model: proposal.model.model,
        promptTemplateId: proposal.prompt.templateId,
        promptTemplateVersion: proposal.prompt.templateVersion,
      },
      reviewDecision: {
        decision: edited.decision,
        reviewer: review.reviewer,
      },
    },
  };
}
function deriveApprovedRisks(
  sections: ApprovedJobResumeDraft["sections"],
  validationIssues: ReturnType<typeof validateJobResumeDraftPayload>["validationIssues"],
  evidenceUsage: ApprovedJobResumeDraft["evidenceUsage"],
): JobResumeDraftRisk[] {
  const risks: JobResumeDraftRisk[] = validationIssues.map((entry) => ({
    id: `job-resume-draft-risk_${hashText([entry.code, entry.message, ...entry.draftItemIds].join("\0")).slice(0, 16)}`,
    code: entry.code,
    severity: entry.severity,
    message: entry.message,
    sectionIds: entry.sectionIds,
    draftItemIds: entry.draftItemIds,
    requirementIds: entry.requirementIds,
    evidenceIds: entry.evidenceIds,
    claimIds: entry.claimIds,
    claimBoundaryIds: entry.claimBoundaryIds,
  }));
  for (const usage of evidenceUsage.filter((entry) => entry.status === "overused")) {
    risks.push({
      id: `job-resume-draft-risk_${hashText(["EVIDENCE_OVERUSE", usage.evidenceId].join("\0")).slice(0, 16)}`,
      code: "EVIDENCE_OVERUSE",
      severity: "medium",
      message: "One evidence item is reused beyond its planned conservative allowance.",
      sectionIds: usage.sectionIds,
      draftItemIds: usage.draftItemIds,
      requirementIds: usage.plannedRequirementIds,
      evidenceIds: [usage.evidenceId],
      claimIds: [],
      claimBoundaryIds: [],
    });
  }
  const byText = new Map<string, string[]>();
  for (const item of sections.flatMap((entry) => entry.items)) {
    const key = item.text.toLowerCase().replace(/\W+/g, " ").trim();
    byText.set(key, [...(byText.get(key) ?? []), item.id]);
  }
  for (const ids of byText.values()) {
    if (ids.length > 1) {
      risks.push({
        id: `job-resume-draft-risk_${hashText(["DUPLICATE_STATEMENT", ...ids].join("\0")).slice(0, 16)}`,
        code: "DUPLICATE_STATEMENT",
        severity: "high",
        message: "Approved Job draft contains duplicate substantive statements.",
        sectionIds: [],
        draftItemIds: ids,
        requirementIds: [],
        evidenceIds: [],
        claimIds: [],
        claimBoundaryIds: [],
      });
    }
  }
  return risks;
}
function approvalResult(
  draft: ApprovedJobResumeDraft,
  review: JobResumeDraftReview,
  proposalId: string,
  paths: ReturnType<typeof approvedJobResumeDraftPaths>,
  result: ApproveJobResumeDraftResult["result"],
): ApproveJobResumeDraftResult {
  const items = draft.sections.flatMap((entry) => entry.items);
  return {
    targetId: draft.targetId,
    proposalId,
    reviewId: review.id,
    result,
    humanApprovedCount: items.filter((entry) => entry.trustState === "human-approved").length,
    humanEditedCount: items.filter((entry) => entry.trustState === "human-edited").length,
    rejectedItemCount: review.decisions.filter((entry) =>
      entry.itemType === "draft-item" && entry.decision === "reject"
    ).length,
    completeness: draft.completeness.status,
    usableForRendering: draft.completeness.usableForRendering,
    draftPath: paths.draftRelativePath,
    manifestPath: paths.manifestRelativePath,
  };
}
function emptyStatus(
  base: Pick<ApprovedJobResumeDraftStatus, "targetId" | "draftExists" | "manifestExists" | "draftPath" | "manifestPath">,
  status: ApprovedJobResumeDraftStatus["status"],
  reasons: string[],
): ApprovedJobResumeDraftStatus {
  return {
    ...base,
    draftHashMatches: null,
    dependenciesMatch: null,
    scaffoldHashMatches: null,
    proposalHashMatches: null,
    reviewHashMatches: null,
    policyVersionMatches: null,
    status,
    usableForRendering: false,
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
