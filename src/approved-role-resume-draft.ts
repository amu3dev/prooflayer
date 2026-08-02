import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  ApprovedRoleResumeDraftManifestSchema,
  ApprovedRoleResumeDraftSchema,
  RoleResumeDraftProposalManifestSchema,
  RoleResumeDraftReviewManifestSchema,
  type ApprovedRoleResumeDraft,
  type ResumeDraftRisk,
  type RoleResumeDraftCompleteness,
  type RoleResumeDraftReview,
} from "./role-resume-draft-schemas.js";
import {
  buildClaimLedger,
  buildEvidenceUsage,
  getRoleResumeDraftProposalStatus,
  showRoleResumeDraftProposal,
  validateRoleResumeDraftPayload,
} from "./role-resume-draft-proposal.js";
import {
  getRoleResumeDraftReviewStatus,
  mergeReviewedRoleResumeDraft,
  roleResumeDraftReviewPaths,
  showRoleResumeDraftReview,
} from "./role-resume-draft-review.js";
import {
  ROLE_RESUME_DRAFTING_POLICY_NAME,
  ROLE_RESUME_DRAFTING_POLICY_VERSION,
  getRoleResumeDraftScaffoldStatus,
  loadRoleResumeDraftingContext,
  showRoleResumeDraftScaffold,
} from "./role-resume-drafting.js";
import {
  evaluateRoleResumeDraftAgainstComposition,
  getRoleResumeCompositionStatus,
  showRoleResumeComposition,
} from "./role-resume-composition.js";

export interface ApproveRoleResumeDraftOptions {
  rebuild?: boolean;
  now?: () => Date;
}
export interface ApproveRoleResumeDraftResult {
  targetId: string;
  proposalId: string;
  result: "created" | "rebuilt" | "already-current";
  deterministicApprovedCount: number;
  humanApprovedCount: number;
  humanEditedCount: number;
  rejectedItemCount: number;
  completeness: "complete" | "constrained-but-usable" | "incomplete" | "blocked";
  usableForRendering: boolean;
  draftPath: string;
  manifestPath: string;
}
export interface ApprovedRoleResumeDraftStatus {
  targetId: string;
  draftExists: boolean;
  manifestExists: boolean;
  draftHashMatches: boolean | null;
  dependenciesMatch: boolean | null;
  scaffoldHashMatches: boolean | null;
  compositionHashMatches: boolean | null;
  proposalHashMatches: boolean | null;
  reviewHashMatches: boolean | null;
  policyVersionMatches: boolean | null;
  status: "missing" | "current" | "stale" | "invalid";
  usableForRendering: boolean;
  reasons: string[];
  draftPath: string;
  manifestPath: string;
}

export async function approveRoleResumeDraftProposal(
  workspace: string,
  proposalId: string,
  options: ApproveRoleResumeDraftOptions = {},
): Promise<ApproveRoleResumeDraftResult> {
  const proposalStatus = await getRoleResumeDraftProposalStatus(workspace, proposalId);
  if (proposalStatus.status !== "current" || !proposalStatus.readyForReview) {
    throw new Error("Cannot approve a stale, invalid, or unreviewable role resume draft proposal.");
  }
  const reviewStatus = await getRoleResumeDraftReviewStatus(workspace, proposalId);
  if (reviewStatus.status !== "completed") {
    throw new Error(`Role resume draft review must be completed before approval. Current status: ${reviewStatus.status}`);
  }
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  const review = await showRoleResumeDraftReview(workspace, proposalId);
  const context = await loadRoleResumeDraftingContext(workspace, proposal.targetId);
  const scaffoldStatus = await getRoleResumeDraftScaffoldStatus(workspace, proposal.targetId);
  if (scaffoldStatus.status !== "current") throw new Error("Role resume draft scaffold must be current before approval.");
  const scaffold = await showRoleResumeDraftScaffold(workspace, proposal.targetId);
  const scaffoldSha256 = await hashFile(resolveWithin(workspace, scaffoldStatus.scaffoldPath));
  if (
    proposal.input.targetSha256 !== context.targetSha256 ||
    proposal.input.approvedInterpretationSha256 !== context.approvedInterpretationSha256 ||
    proposal.input.approvedMatchingSha256 !== context.approvedMatchingSha256 ||
    proposal.input.evidenceSnapshotSha256 !== context.evidenceSnapshotSha256 ||
    proposal.input.approvedAssessmentSha256 !== context.approvedAssessmentSha256 ||
    proposal.input.approvedPlanSha256 !== context.approvedPlanSha256 ||
    proposal.input.compositionSha256 !== context.compositionSha256 ||
    proposal.input.draftScaffoldSha256 !== scaffoldSha256
  ) throw new Error("Role resume draft proposal dependencies changed and approval was refused.");

  const proposalPaths = {
    proposalPath: resolveWithin(workspace, `targets/roles/${proposal.targetId}/resume-drafting/proposals/${proposalId}/proposal.json`),
    manifestPath: resolveWithin(workspace, `targets/roles/${proposal.targetId}/resume-drafting/proposals/${proposalId}/proposal-manifest.json`),
  };
  const reviewPaths = roleResumeDraftReviewPaths(workspace, proposal.targetId, proposalId);
  const proposalManifest = RoleResumeDraftProposalManifestSchema.parse(await readJson<unknown>(proposalPaths.manifestPath, null));
  const reviewManifest = RoleResumeDraftReviewManifestSchema.parse(await readJson<unknown>(reviewPaths.manifestPath, null));
  if (reviewManifest.proposalSha256 !== proposalManifest.proposalSha256) {
    throw new Error("Draft review does not reference the current proposal hash.");
  }

  const paths = approvedRoleResumeDraftPaths(workspace, proposal.targetId);
  const existingStatus = await getApprovedRoleResumeDraftStatus(workspace, proposal.targetId);
  if (existingStatus.status === "current" && await pathExists(paths.manifestPath)) {
    const manifest = ApprovedRoleResumeDraftManifestSchema.parse(await readJson<unknown>(paths.manifestPath, null));
    if (
      manifest.proposalId === proposalId &&
      manifest.proposalSha256 === proposalManifest.proposalSha256 &&
      manifest.reviewSha256 === reviewManifest.reviewSha256
    ) {
      return approvalResult(
        await showApprovedRoleResumeDraft(workspace, proposal.targetId),
        review,
        proposalId,
        paths,
        "already-current",
      );
    }
  }
  if (["stale", "invalid"].includes(existingStatus.status) && !options.rebuild) {
    throw new Error(`Approved role resume draft is ${existingStatus.status}; use explicit --rebuild.`);
  }

  const reviewed = await mergeReviewedRoleResumeDraft(workspace, proposalId, review);
  const validated = validateRoleResumeDraftPayload(
    { sections: reviewed.sections, warnings: proposal.warnings, ambiguities: reviewed.ambiguities },
    proposal.id,
    scaffold,
    context,
    scaffoldSha256,
  );
  const blocking = validated.validationIssues.filter((entry) => entry.severity === "critical" || entry.severity === "high");
  if (blocking.length) throw new Error(`Approved draft contains ${blocking.length} blocking validation issue(s).`);
  const sections = validated.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => applyReviewTrust(item, proposal, review)),
  }));
  const claimLedger = buildClaimLedger(sections, context);
  const evidenceUsage = buildEvidenceUsage(sections, scaffold);
  const risks = deriveApprovedDraftRisks(sections, validated.validationIssues, evidenceUsage);
  const completeness = deriveRoleResumeDraftCompleteness(
    scaffold,
    context.composition,
    sections,
    claimLedger,
    risks,
    validated.ambiguities,
  );
  if (!completeness.usableForRendering) {
    throw new Error(`Role resume approval is blocked because composition completeness is ${completeness.status}: ${completeness.blockingReasons.join(" ")}`);
  }
  const now = (options.now ?? (() => new Date()))().toISOString();
  let createdAt = now;
  if (await pathExists(paths.draftPath)) {
    try {
      createdAt = ApprovedRoleResumeDraftSchema.parse(await readJson<unknown>(paths.draftPath, null)).createdAt;
    } catch {
      // Explicit rebuild may replace an invalid approved artifact.
    }
  }
  const draftId = `approved-role-resume-draft_${hashText([
    context.target.id,
    context.approvedPlanSha256,
    context.compositionSha256,
    proposalManifest.proposalSha256,
    reviewManifest.reviewSha256,
    ROLE_RESUME_DRAFTING_POLICY_VERSION,
  ].join("\0")).slice(0, 16)}`;
  const approved = ApprovedRoleResumeDraftSchema.parse({
    schemaVersion: 1,
    id: draftId,
    targetId: context.target.id,
    targetType: "role",
    mode: "market-positioning",
    roleTitle: context.target.title,
    approvedInterpretation: scaffold.approvedInterpretation,
    approvedMatching: scaffold.approvedMatching,
    approvedAssessment: scaffold.approvedAssessment,
    approvedPlan: scaffold.approvedPlan,
    composition: scaffold.composition,
    draftingPolicy: {
      name: ROLE_RESUME_DRAFTING_POLICY_NAME,
      version: ROLE_RESUME_DRAFTING_POLICY_VERSION,
    },
    sections,
    claimLedger,
    evidenceUsage,
    exclusions: context.approvedPlan.exclusions.map((entry) => ({
      id: `draft-exclusion_${hashText([draftId, entry.id].join("\0")).slice(0, 16)}`,
      sourceExclusionId: entry.id,
      reason: entry.rationale,
      expectationIds: entry.expectationIds,
      evidenceIds: entry.evidenceIds,
    })),
    risks,
    warnings: validated.warnings,
    ambiguities: validated.ambiguities,
    completeness,
    provenance: {
      targetSha256: context.targetSha256,
      approvedInterpretationSha256: context.approvedInterpretationSha256,
      approvedInterpretationManifestSha256: context.approvedInterpretationManifestSha256,
      approvedMatchingSha256: context.approvedMatchingSha256,
      approvedMatchingManifestSha256: context.approvedMatchingManifestSha256,
      evidenceSnapshotSha256: context.evidenceSnapshotSha256,
      approvedAssessmentSha256: context.approvedAssessmentSha256,
      approvedAssessmentManifestSha256: context.approvedAssessmentManifestSha256,
      approvedPlanSha256: context.approvedPlanSha256,
      approvedPlanManifestSha256: context.approvedPlanManifestSha256,
      compositionSha256: context.compositionSha256,
      compositionManifestSha256: context.compositionManifestSha256,
      scaffoldSha256,
      proposalSha256: proposalManifest.proposalSha256,
      reviewSha256: reviewManifest.reviewSha256,
    },
    createdAt,
    updatedAt: now,
  });
  assertApprovedRoleResumeDraft(approved);
  await writeJsonAtomic(paths.draftPath, approved);
  const manifest = ApprovedRoleResumeDraftManifestSchema.parse({
    schemaVersion: 1,
    draftId: approved.id,
    targetId: approved.targetId,
    draftPath: paths.draftRelativePath,
    draftSha256: await hashFile(paths.draftPath),
    policyName: ROLE_RESUME_DRAFTING_POLICY_NAME,
    policyVersion: ROLE_RESUME_DRAFTING_POLICY_VERSION,
    targetSha256: context.targetSha256,
    approvedInterpretationSha256: context.approvedInterpretationSha256,
    approvedMatchingSha256: context.approvedMatchingSha256,
    evidenceSnapshotSha256: context.evidenceSnapshotSha256,
    approvedAssessmentSha256: context.approvedAssessmentSha256,
    approvedPlanSha256: context.approvedPlanSha256,
    compositionSha256: context.compositionSha256,
    scaffoldSha256,
    proposalId,
    proposalSha256: proposalManifest.proposalSha256,
    reviewSha256: reviewManifest.reviewSha256,
    createdAt,
    updatedAt: now,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
  return approvalResult(
    approved,
    review,
    proposalId,
    paths,
    existingStatus.status === "missing" ? "created" : "rebuilt",
  );
}

export async function showApprovedRoleResumeDraft(
  workspace: string,
  targetId: string,
): Promise<ApprovedRoleResumeDraft> {
  const paths = approvedRoleResumeDraftPaths(workspace, targetId);
  if (!(await pathExists(paths.draftPath))) throw new Error(`Approved role resume draft not found: ${targetId}`);
  return ApprovedRoleResumeDraftSchema.parse(await readJson<unknown>(paths.draftPath, null));
}

export async function getApprovedRoleResumeDraftStatus(
  workspace: string,
  targetId: string,
): Promise<ApprovedRoleResumeDraftStatus> {
  const paths = approvedRoleResumeDraftPaths(workspace, targetId);
  const draftExists = await pathExists(paths.draftPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const base = { targetId, draftExists, manifestExists, draftPath: paths.draftRelativePath, manifestPath: paths.manifestRelativePath };
  if (!draftExists && !manifestExists) return emptyStatus(base, "missing", ["No approved role resume draft exists."]);
  if (!draftExists || !manifestExists) return emptyStatus(base, "invalid", ["Approved draft artifact set is incomplete."]);
  let draft: ApprovedRoleResumeDraft;
  let manifest: ReturnType<typeof ApprovedRoleResumeDraftManifestSchema.parse>;
  try {
    draft = ApprovedRoleResumeDraftSchema.parse(await readJson<unknown>(paths.draftPath, null));
    manifest = ApprovedRoleResumeDraftManifestSchema.parse(await readJson<unknown>(paths.manifestPath, null));
    assertApprovedRoleResumeDraft(draft);
  } catch (error) {
    return emptyStatus(base, "invalid", [`Stored approved draft is malformed: ${errorMessage(error)}`]);
  }
  const draftHashMatches = await hashFile(paths.draftPath) === manifest.draftSha256;
  if (
    !draftHashMatches ||
    manifest.draftId !== draft.id ||
    manifest.targetId !== targetId ||
    draft.targetId !== targetId ||
    manifest.draftPath !== paths.draftRelativePath
  ) return { ...emptyStatus(base, "invalid", ["Approved draft hash, identity, or path is invalid."]), draftHashMatches };
  let context;
  try {
    context = await loadRoleResumeDraftingContext(workspace, targetId);
  } catch (error) {
    return { ...emptyStatus(base, "stale", [`Current drafting dependencies are unavailable: ${errorMessage(error)}`]), draftHashMatches };
  }
  const scaffoldStatus = await getRoleResumeDraftScaffoldStatus(workspace, targetId);
  const scaffoldHashMatches = scaffoldStatus.status === "current"
    && await hashFile(resolveWithin(workspace, scaffoldStatus.scaffoldPath)) === manifest.scaffoldSha256;
  const proposalPath = resolveWithin(workspace, `targets/roles/${targetId}/resume-drafting/proposals/${manifest.proposalId}/proposal.json`);
  const reviewPath = roleResumeDraftReviewPaths(workspace, targetId, manifest.proposalId).reviewPath;
  const proposalHashMatches = await pathExists(proposalPath) && await hashFile(proposalPath) === manifest.proposalSha256;
  const reviewHashMatches = await pathExists(reviewPath) && await hashFile(reviewPath) === manifest.reviewSha256;
  const compositionStatus = await getRoleResumeCompositionStatus(workspace, targetId);
  const compositionHashMatches = compositionStatus.status === "current"
    && context.compositionSha256 === manifest.compositionSha256;
  const dependenciesMatch = manifest.targetSha256 === context.targetSha256
    && manifest.approvedInterpretationSha256 === context.approvedInterpretationSha256
    && manifest.approvedMatchingSha256 === context.approvedMatchingSha256
    && manifest.evidenceSnapshotSha256 === context.evidenceSnapshotSha256
    && manifest.approvedAssessmentSha256 === context.approvedAssessmentSha256
    && manifest.approvedPlanSha256 === context.approvedPlanSha256
    && manifest.compositionSha256 === context.compositionSha256;
  const policyVersionMatches = manifest.policyName === ROLE_RESUME_DRAFTING_POLICY_NAME
    && manifest.policyVersion === ROLE_RESUME_DRAFTING_POLICY_VERSION;
  const reasons = [
    ...(!dependenciesMatch ? ["Approved drafting dependencies changed."] : []),
    ...(!compositionHashMatches ? ["Resume composition changed."] : []),
    ...(!scaffoldHashMatches ? ["Draft scaffold changed."] : []),
    ...(!proposalHashMatches ? ["Reviewed draft proposal changed or is missing."] : []),
    ...(!reviewHashMatches ? ["Draft review changed or is missing."] : []),
    ...(!policyVersionMatches ? ["Drafting policy changed."] : []),
  ];
  return {
    ...base,
    draftHashMatches,
    dependenciesMatch,
    scaffoldHashMatches,
    compositionHashMatches,
    proposalHashMatches,
    reviewHashMatches,
    policyVersionMatches,
    status: reasons.length ? "stale" : "current",
    usableForRendering: reasons.length === 0 && draft.completeness.usableForRendering,
    reasons,
  };
}

export function deriveRoleResumeDraftCompleteness(
  scaffold: Awaited<ReturnType<typeof showRoleResumeDraftScaffold>>,
  composition: Awaited<ReturnType<typeof showRoleResumeComposition>>,
  sections: ApprovedRoleResumeDraft["sections"],
  claimLedger: ApprovedRoleResumeDraft["claimLedger"],
  risks: ApprovedRoleResumeDraft["risks"],
  ambiguities: ApprovedRoleResumeDraft["ambiguities"],
): RoleResumeDraftCompleteness {
  const required = scaffold.sections.filter((entry) => entry.status === "include");
  const optional = scaffold.sections.filter((entry) => entry.status === "optional");
  const sectionById = new Map(sections.map((entry) => [entry.id, entry]));
  const completedRequiredSectionCount = required.filter((entry) => (sectionById.get(entry.id)?.items.length ?? 0) > 0).length;
  const completedOptionalSectionCount = optional.filter((entry) => (sectionById.get(entry.id)?.items.length ?? 0) > 0).length;
  const items = sections.flatMap((entry) => entry.items);
  const validatedDraftItemCount = items.filter((entry) => entry.validation.status === "valid").length;
  const claimLedgerComplete = claimLedger.length === items.length
    && items.every((entry) => claimLedger.some((ledger) => ledger.draftItemId === entry.id));
  const slotById = new Map(composition.slots.map((entry) => [entry.id, entry]));
  const provenanceComplete = items.every((entry) => {
    const slot = slotById.get(entry.compositionSlotId);
    return Boolean(
      slot
      && entry.provenance.approvedPlanId.length > 0
      && entry.provenance.compositionId === composition.id
      && entry.provenance.compositionSlotId === entry.compositionSlotId
      && entry.provenance.reviewDecision
      && (slot.mode === "fixed" || entry.evidenceIds.length > 0 && entry.claimBoundaryIds.length > 0),
    );
  });
  const unresolvedCriticalIssueCount = risks.filter((entry) => entry.severity === "critical").length;
  const unresolvedAmbiguityCount = ambiguities.filter((entry) => !entry.resolved).length;
  const compositionEvaluation = evaluateRoleResumeDraftAgainstComposition(composition, sections);
  const blockingReasons = [
    ...compositionEvaluation.blockingReasons,
    ...(completedRequiredSectionCount !== required.length ? ["Required draft sections are incomplete."] : []),
    ...(validatedDraftItemCount !== items.length ? ["One or more draft items are not fully valid."] : []),
    ...(!claimLedgerComplete ? ["Claim ledger is incomplete."] : []),
    ...(!provenanceComplete ? ["Statement-level provenance is incomplete."] : []),
    ...(unresolvedCriticalIssueCount ? ["Critical draft risks remain."] : []),
    ...(unresolvedAmbiguityCount ? ["Draft ambiguities remain unresolved."] : []),
  ];
  const status: RoleResumeDraftCompleteness["status"] = compositionEvaluation.status === "blocked"
    ? "blocked"
    : blockingReasons.length
      ? "incomplete"
      : compositionEvaluation.status;
  const usableForRendering = (status === "complete" || status === "constrained-but-usable")
    && blockingReasons.length === 0;
  return {
    status,
    requiredSectionCount: required.length,
    completedRequiredSectionCount,
    optionalSectionCount: optional.length,
    completedOptionalSectionCount,
    draftItemCount: items.length,
    validatedDraftItemCount,
    claimLedgerComplete,
    provenanceComplete: Boolean(provenanceComplete),
    unresolvedCriticalIssueCount,
    unresolvedAmbiguityCount,
    identityPresent: compositionEvaluation.identityPresent,
    chronologyComplete: compositionEvaluation.careerEntriesAccounted
      && compositionEvaluation.includedExperienceCount === composition.experienceEntries.filter((entry) => entry.decision === "include").length,
    selectedEvidenceAccounted: compositionEvaluation.selectedEvidenceAccounted,
    experienceEntryCount: compositionEvaluation.includedExperienceCount,
    projectEntryCount: compositionEvaluation.includedProjectCount,
    skillCount: items.filter((entry) => entry.itemType === "technology").length,
    evidenceBackedBulletCount: compositionEvaluation.evidenceBackedBulletSlotCount,
    usableForRendering,
    blockingReasons,
  };
}

export function assertApprovedRoleResumeDraft(draft: ApprovedRoleResumeDraft): void {
  if (draft.targetType !== "role" || draft.mode !== "market-positioning") {
    throw new Error("Approved role resume draft target type or mode is invalid.");
  }
  if (
    draft.draftingPolicy.name !== ROLE_RESUME_DRAFTING_POLICY_NAME ||
    draft.draftingPolicy.version !== ROLE_RESUME_DRAFTING_POLICY_VERSION
  ) throw new Error("Approved draft policy is unsupported.");
  const items = draft.sections.flatMap((entry) => entry.items);
  if (items.some((entry) => entry.trustState === "model-proposed" || entry.trustState === "deterministic-proposed")) {
    throw new Error("Approved draft contains proposed trust state.");
  }
  if (items.some((entry) => !entry.compositionSlotId || !entry.provenance.compositionId || !entry.provenance.reviewDecision)) {
    throw new Error("Approved draft contains a substantive statement without complete provenance.");
  }
  if (draft.claimLedger.length !== items.length || items.some((entry) => !draft.claimLedger.some((ledger) => ledger.draftItemId === entry.id))) {
    throw new Error("Approved draft claim ledger is incomplete.");
  }
  if (["complete", "constrained-but-usable"].includes(draft.completeness.status) && !draft.completeness.usableForRendering) {
    throw new Error("Usable approved draft must be structurally usable for rendering.");
  }
  if (["incomplete", "blocked"].includes(draft.completeness.status) || !draft.completeness.usableForRendering) {
    throw new Error("Incomplete role resume drafts cannot be approved for rendering.");
  }
}

export function approvedRoleResumeDraftPaths(workspace: string, targetId: string) {
  const root = `targets/roles/${targetId}/resume-drafting/approved`;
  const draftRelativePath = `${root}/role-resume-draft.json`;
  const manifestRelativePath = `${root}/draft-manifest.json`;
  return {
    draftRelativePath,
    draftPath: resolveWithin(workspace, draftRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}
export function formatApproveRoleResumeDraftResult(result: ApproveRoleResumeDraftResult) {
  return [
    `Target ID: ${result.targetId}`,
    `Proposal ID: ${result.proposalId}`,
    `Result: ${result.result}`,
    `Deterministic approved: ${result.deterministicApprovedCount}`,
    `Human approved: ${result.humanApprovedCount}`,
    `Human edited: ${result.humanEditedCount}`,
    `Rejected items: ${result.rejectedItemCount}`,
    `Completeness: ${result.completeness}`,
    `Usable for future rendering: ${result.usableForRendering ? "yes" : "no"}`,
    `Approved draft path: ${result.draftPath}`,
    `Manifest path: ${result.manifestPath}`,
  ].join("\n");
}
export function formatApprovedRoleResumeDraftStatus(status: ApprovedRoleResumeDraftStatus) {
  return [
    `Target ID: ${status.targetId}`,
    `Overall status: ${status.status}`,
    `Usable for rendering: ${status.usableForRendering ? "yes" : "no"}`,
    `Draft hash matches: ${status.draftHashMatches ?? "n/a"}`,
    `Dependencies match: ${status.dependenciesMatch ?? "n/a"}`,
    `Composition matches: ${status.compositionHashMatches ?? "n/a"}`,
    `Scaffold hash matches: ${status.scaffoldHashMatches ?? "n/a"}`,
    `Proposal hash matches: ${status.proposalHashMatches ?? "n/a"}`,
    `Review hash matches: ${status.reviewHashMatches ?? "n/a"}`,
    `Draft path: ${status.draftPath}`,
    `Manifest path: ${status.manifestPath}`,
    ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((entry) => `- ${entry}`)] : []),
  ].join("\n");
}

function applyReviewTrust(
  item: ApprovedRoleResumeDraft["sections"][number]["items"][number],
  proposal: Awaited<ReturnType<typeof showRoleResumeDraftProposal>>,
  review: RoleResumeDraftReview,
) {
  const direct = review.decisions.find((entry) => entry.itemType === "draft-item" && entry.itemId === item.id);
  const edited = direct ?? review.decisions.find((entry) => {
    if (entry.itemType !== "draft-item" || entry.decision !== "edit" || !entry.editedValue) return false;
    const value = entry.editedValue as { text?: unknown; sectionId?: unknown };
    return value.text === item.text && value.sectionId === item.sectionId;
  });
  if (!edited || edited.decision === "pending" || edited.decision === "reject") {
    throw new Error(`Approved draft item lacks an accepted or edited human decision: ${item.id}`);
  }
  const trustState = edited.decision === "edit" ? "human-edited" as const : "human-approved" as const;
  return {
    ...item,
    trustState,
    provenance: {
      ...item.provenance,
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
function deriveApprovedDraftRisks(
  sections: ApprovedRoleResumeDraft["sections"],
  validationIssues: ReturnType<typeof validateRoleResumeDraftPayload>["validationIssues"],
  evidenceUsage: ApprovedRoleResumeDraft["evidenceUsage"],
): ResumeDraftRisk[] {
  const risks: ResumeDraftRisk[] = validationIssues.map((entry) => ({
    id: `draft-risk_${hashText([entry.code, entry.message, ...entry.draftItemIds].join("\0")).slice(0, 16)}`,
    code: entry.code,
    severity: entry.severity,
    message: entry.message,
    sectionIds: entry.sectionIds,
    draftItemIds: entry.draftItemIds,
    expectationIds: entry.expectationIds,
    matchIds: entry.matchIds,
    evidenceIds: entry.evidenceIds,
    claimBoundaryIds: entry.claimBoundaryIds,
  }));
  for (const usage of evidenceUsage.filter((entry) => entry.status === "overused")) {
    risks.push({
      id: `draft-risk_${hashText(["EVIDENCE_REUSED_EXCESSIVELY", usage.evidenceId].join("\0")).slice(0, 16)}`,
      code: "EVIDENCE_REUSED_EXCESSIVELY",
      severity: "medium",
      message: "One evidence item is reused beyond its conservative section allowance.",
      sectionIds: usage.sectionIds,
      draftItemIds: usage.draftItemIds,
      expectationIds: [],
      matchIds: [],
      evidenceIds: [usage.evidenceId],
      claimBoundaryIds: [],
    });
  }
  const duplicate = new Map<string, string[]>();
  for (const item of sections.flatMap((entry) => entry.items)) {
    const key = item.text.toLowerCase().replace(/\W+/g, " ").trim();
    duplicate.set(key, [...(duplicate.get(key) ?? []), item.id]);
  }
  for (const ids of duplicate.values()) if (ids.length > 1) {
    risks.push({
      id: `draft-risk_${hashText(["DUPLICATE_CLAIM", ...ids].join("\0")).slice(0, 16)}`,
      code: "DUPLICATE_CLAIM",
      severity: "high",
      message: "Approved draft contains duplicate substantive statements.",
      sectionIds: [],
      draftItemIds: ids,
      expectationIds: [],
      matchIds: [],
      evidenceIds: [],
      claimBoundaryIds: [],
    });
  }
  return risks;
}
function approvalResult(
  draft: ApprovedRoleResumeDraft,
  review: RoleResumeDraftReview,
  proposalId: string,
  paths: ReturnType<typeof approvedRoleResumeDraftPaths>,
  result: ApproveRoleResumeDraftResult["result"],
): ApproveRoleResumeDraftResult {
  const items = draft.sections.flatMap((entry) => entry.items);
  return {
    targetId: draft.targetId,
    proposalId,
    result,
    deterministicApprovedCount: items.filter((entry) => entry.trustState === "deterministic-approved").length,
    humanApprovedCount: items.filter((entry) => entry.trustState === "human-approved").length,
    humanEditedCount: items.filter((entry) => entry.trustState === "human-edited").length,
    rejectedItemCount: review.decisions.filter((entry) => entry.itemType === "draft-item" && entry.decision === "reject").length,
    completeness: draft.completeness.status,
    usableForRendering: draft.completeness.usableForRendering,
    draftPath: paths.draftRelativePath,
    manifestPath: paths.manifestRelativePath,
  };
}
function emptyStatus(
  base: Pick<ApprovedRoleResumeDraftStatus, "targetId" | "draftExists" | "manifestExists" | "draftPath" | "manifestPath">,
  status: ApprovedRoleResumeDraftStatus["status"],
  reasons: string[],
): ApprovedRoleResumeDraftStatus {
  return {
    ...base,
    draftHashMatches: null,
    dependenciesMatch: null,
    scaffoldHashMatches: null,
    compositionHashMatches: null,
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
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) throw new Error("Resolved path leaves workspace.");
  return absolute;
}
function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
