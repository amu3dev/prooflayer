import { readFile } from "node:fs/promises";
import path from "node:path";
import { hashText, pathExists, readJson, writeBufferAtomic } from "./fs-utils.js";
import {
  approveRoleResumeDraftProposal,
  getApprovedRoleResumeDraftStatus,
  showApprovedRoleResumeDraft,
} from "./approved-role-resume-draft.js";
import { getApprovedJobResumeDraftStatus } from "./approved-job-resume-draft.js";
import { showJobFitProofAssessment, getJobFitProofAssessmentStatus } from "./job-fit-proof-assessment.js";
import { showJobRequirementModel, getJobRequirementModelStatus } from "./job-requirements.js";
import { buildRoleResumeDraftScaffold, getRoleResumeDraftScaffoldStatus, loadRoleResumeDraftingContext, showRoleResumeDraftScaffold } from "./role-resume-drafting.js";
import { buildRoleResumePlan, getRoleResumePlanStatus, promoteDeterministicRoleResumePlan, showRoleResumePlan } from "./role-resume-planning.js";
import { getJobResumeDraftScaffoldStatus } from "./job-resume-drafting.js";
import { getJobResumePlanStatus, showJobResumePlan } from "./job-resume-planning.js";
import {
  generateRoleResumeDraftProposal,
  getRoleResumeDraftProposalStatus,
  listRoleResumeDraftProposals,
  showRoleResumeDraftProposal,
} from "./role-resume-draft-proposal.js";
import {
  completeRoleResumeDraftReview,
  getRoleResumeDraftReviewStatus,
  initializeRoleResumeDraftReview,
  setRoleResumeDraftReviewDecision,
  setRoleResumeDraftStatementReviewDecision,
  showRoleResumeDraftReview,
  type RoleResumeDraftReviewStatus,
} from "./role-resume-draft-review.js";
import {
  exportRoleResume,
  listRoleResumeExports,
  type ExportRoleResumeResult,
} from "./role-resume-render-export.js";
import {
  createModelProvider,
  loadModelProviderConfiguration,
  type InterpretationModelProvider,
} from "./model-provider.js";
import type { RoleResumeDraftProposal, RoleResumeDraftReview, RoleResumeDraftSection } from "./role-resume-draft-schemas.js";
import type { RoleResumeExportFormat } from "./role-resume-render-schemas.js";
import { inspectJobWorkflow, runJobWorkflow, type JobWorkflowStatus } from "./job-workflow.js";
import {
  continueRoleWorkflow,
  confirmGeneratedRoleDirection,
  inspectRoleWorkflow,
  runRoleWorkflow,
  type RoleWorkflowStatus,
} from "./role-workflow.js";
import {
  EvidenceItemSchema,
  type EvidenceMatch,
  type ExpectationCoverageStatus,
  type RoleTarget,
  type Target,
} from "./schemas.js";
import {
  EVIDENCE_MATCHER_NAME,
  EVIDENCE_MATCHER_VERSION,
  EVIDENCE_MATCHING_POLICY_VERSION,
  expectationProvenance,
  getApprovedEvidenceMatchingStatus,
  loadMatchingContext,
  manualMatchId,
  writeApprovedMatching,
} from "./evidence-matching.js";
import { calculateEvidenceFoundationSnapshot } from "./evidence-snapshots.js";
import {
  buildFitAssessment,
  getFitAssessmentStatus,
  promoteDeterministicRoleFitAssessment,
} from "./fit-assessment.js";
import { analyzeTarget, getTargetAnalysisStatus } from "./target-analysis.js";
import {
  createJobTarget,
  createRoleTarget,
  listTargets,
  showTarget,
  type JobTargetInput,
  type RoleTargetInput,
} from "./targets.js";
import { PRODUCT_WORKFLOW_ACTIONS, type ProductWorkflowActionName } from "./prooflayer-ui-request-scope.js";

export interface ProductProgressStep {
  label: string;
  state: "complete" | "current" | "waiting" | "blocked";
  detail: string;
}

export interface RoleJourneyProjection {
  target?: RoleTarget;
  progress: ProductProgressStep[];
  careerReady: boolean;
  currentValue: string;
  blocker?: string;
  nextAction: string;
  primaryAction?: {
    kind: "create" | "continue" | "review" | "approve" | "export" | "view" | "blocked";
    label: string;
    detail: string;
    method: "GET" | "POST";
    href: string;
    action?: ProductWorkflowActionName;
  };
  understanding?: {
    state: "generated" | "generated-with-ambiguity" | "reviewed" | "stale" | "invalid";
    summary: string;
    sourceLabel: string;
    specialization: string;
    expectations: string[];
  };
  positioning?: {
    label: string;
    fit: "strong" | "credible" | "mixed" | "stretch" | "insufficient evidence";
    strongestThemes: Array<{ theme: string; evidence: string }>;
    weakerThemes: string[];
    gaps: string[];
    limitations: string[];
  };
  materialQuestion?: {
    question: string;
    options: Array<{ id: string; label: string }>;
    selectedOptionId: string;
  };
  draftPreview?: {
    state: "proposal" | "review-in-progress" | "review-complete" | "approved";
    proposalId: string;
    sections: Array<{ type: string; heading: string; items: string[] }>;
    items: string[];
    requiresHumanReview: boolean;
    warnings: string[];
    review?: Pick<RoleResumeDraftReviewStatus, "status" | "counts" | "unresolvedCount">;
  };
  exports?: Array<{ format: RoleResumeExportFormat; exportId: string; status: string; outputPath?: string }>;
  advanced: Array<{ label: string; status: string }>;
}

export interface JobJourneyProjection {
  target: Extract<Target, { type: "job" }>;
  workflow: JobWorkflowStatus;
  fit: {
    label: "strong" | "credible" | "mixed" | "stretch" | "insufficient evidence";
    statement: string;
    mandatory: { total: number; supported: number; partial: number };
    preferred: { total: number; supported: number; partial: number };
    strengths: string[];
    gaps: string[];
    limitations: string[];
  };
  progress: ProductProgressStep[];
  nextAction: string;
  advancedReviewBatchId?: string;
}

export interface AddCareerSourceInput {
  title: string;
  content: Uint8Array;
}

export async function startRoleResumeJourney(
  workspace: string,
  input: RoleTargetInput,
): Promise<RoleJourneyProjection> {
  const targetId = `role-${slugify(input.title)}`;
  let target: RoleTarget;
  try {
    const existing = await showTarget(workspace, targetId);
    if (existing.type !== "role") throw new Error(`Target identity belongs to a ${existing.type} target.`);
    assertRoleInputCompatible(existing, input);
    target = existing;
  } catch (error) {
    if (!isMissingTarget(error)) throw error;
    const created = await createRoleTarget(workspace, input);
    target = created.target as RoleTarget;
  }

  const analysis = await getTargetAnalysisStatus(workspace, target.id);
  if (analysis.status === "missing") await analyzeTarget(workspace, target.id);
  await runRoleWorkflow(workspace, target.id, { offline: true });
  return inspectRoleResumeJourney(workspace, target.id);
}

export async function continueRoleResumeJourney(
  workspace: string,
  targetId: string,
  specialization?: string,
  options: { provider?: InterpretationModelProvider; now?: () => Date; rebuild?: boolean } = {},
): Promise<RoleJourneyProjection> {
  await continueGuidedRoleResumeWorkflow(workspace, targetId, {
    offline: true,
    specialization,
    rebuildStale: Boolean(specialization),
    provider: options.provider,
    now: options.now,
    rebuild: options.rebuild,
  });
  return inspectRoleResumeJourney(workspace, targetId);
}

export async function confirmRoleDirectionForProduct(
  workspace: string,
  targetId: string,
  options: { reviewerName?: string; now?: () => Date } = {},
) {
  return confirmGeneratedRoleDirection(workspace, targetId, options);
}

export async function reviseRoleDirectionForProduct(
  workspace: string,
  targetId: string,
  specialization: string,
  options: { now?: () => Date } = {},
): Promise<RoleJourneyProjection> {
  await continueRoleWorkflow(workspace, targetId, {
    offline: true,
    specialization,
    rebuildStale: true,
    now: options.now,
  });
  return inspectRoleResumeJourney(workspace, targetId);
}

export async function continueGuidedRoleResumeWorkflow(
  workspace: string,
  targetId: string,
  options: {
    providerName?: string;
    provider?: InterpretationModelProvider;
    environment?: NodeJS.ProcessEnv;
    offline?: boolean;
    specialization?: string;
    rebuildStale?: boolean;
    rebuild?: boolean;
    dryRun?: boolean;
    refresh?: boolean;
    now?: () => Date;
  } = {},
) {
  const roleResult = await continueRoleWorkflow(workspace, targetId, options);
  if (options.dryRun || roleResult.result === "paused") {
    return { roleResult, preparation: { result: options.dryRun ? "already-current" as const : "paused" as const, providerCallMade: false } };
  }
  let provider = options.provider;
  if (!provider && options.providerName) {
    const configuration = loadModelProviderConfiguration(options.environment ?? process.env);
    if (configuration.providerId !== options.providerName) {
      throw new Error(`Configured writing provider ${configuration.providerId} does not match requested provider ${options.providerName}.`);
    }
    if (configuration.providerId === "fake" && !options.offline) {
      throw new Error("The fake writing provider requires explicit --offline.");
    }
    if (configuration.providerId !== "fake" && options.offline) {
      throw new Error("--offline requires an explicitly configured fake writing provider.");
    }
    provider = createModelProvider(configuration);
  }
  const preparation = await advanceRoleResumePreparation(workspace, targetId, {
    provider,
    environment: options.environment,
    rebuild: options.rebuild ?? options.rebuildStale,
    now: options.now,
  });
  return {
    roleResult: {
      ...roleResult,
      result: preparation.result === "paused"
        ? "paused" as const
        : roleResult.result === "already-current" && preparation.result === "already-current"
          ? "already-current" as const
          : "created" as const,
      providerCallMade: roleResult.providerCallMade || preparation.providerCallMade,
      status: await inspectRoleWorkflow(workspace, targetId),
    },
    preparation,
  };
}

export async function inspectRoleResumeJourney(
  workspace: string,
  targetId?: string,
): Promise<RoleJourneyProjection> {
  if (!targetId) {
    return {
      progress: defaultRoleProgress(),
      careerReady: false,
      currentValue: "Enter a target role to begin. Your existing Career Twin remains the source of career facts.",
      nextAction: "Enter the role you want this resume to target.",
      primaryAction: {
        kind: "create",
        label: "Understand This Role",
        detail: "Start with a role title; your existing Career Twin supplies the career context.",
        method: "POST",
        href: "/resume/role",
        action: PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
      },
      advanced: [],
    };
  }
  const target = await showTarget(workspace, targetId);
  if (target.type !== "role") throw new Error("Role Resume journey accepts only Role Targets.");
  const workflow = await inspectRoleWorkflow(workspace, targetId);
  return projectRoleJourney(workspace, workflow);
}

export async function advanceRoleResumePreparation(
  workspace: string,
  targetId: string,
  options: { provider?: InterpretationModelProvider; environment?: NodeJS.ProcessEnv; now?: () => Date; rebuild?: boolean } = {},
): Promise<{ result: "advanced" | "paused" | "already-current"; message?: string; providerCallMade: boolean }> {
  let advanced = false;
  let workflow = await inspectRoleWorkflow(workspace, targetId);
  if (workflow.canonical.approvedDraft === "current") return { result: "already-current", providerCallMade: false };
  if (workflow.canonical.approvedInterpretation !== "current") {
    return { result: "paused", message: "Confirm the generated Role direction before selecting experience.", providerCallMade: false };
  }

  const matchingStatus = await getApprovedEvidenceMatchingStatus(workspace, targetId);
  if (matchingStatus.status === "missing") {
    await approveGuidedRoleEvidenceSelection(workspace, workflow, { now: options.now });
    advanced = true;
  } else if (["stale", "invalid"].includes(matchingStatus.status)) {
    if (!options.rebuild) return { result: "paused", message: `Role evidence selection is ${matchingStatus.status}; rebuild is required.`, providerCallMade: false };
    await approveGuidedRoleEvidenceSelection(workspace, workflow, { now: options.now, rebuild: true });
    advanced = true;
  }

  let approvedAssessment = await getFitAssessmentStatus(workspace, targetId, "approved");
  if (approvedAssessment.status !== "current") {
    if (["stale", "invalid"].includes(approvedAssessment.status) && !options.rebuild) {
      return { result: "paused", message: `Role fit assessment is ${approvedAssessment.status}; rebuild is required.`, providerCallMade: false };
    }
    const deterministic = await getFitAssessmentStatus(workspace, targetId, "deterministic");
    if (deterministic.status !== "current") {
      await buildFitAssessment(workspace, targetId, { rebuild: options.rebuild, now: options.now });
    }
    await promoteDeterministicRoleFitAssessment(workspace, targetId, { rebuild: options.rebuild, now: options.now });
    approvedAssessment = await getFitAssessmentStatus(workspace, targetId, "approved");
    advanced = true;
  }

  let approvedPlan = await getRoleResumePlanStatus(workspace, targetId, "approved");
  if (approvedPlan.status !== "current") {
    if (["stale", "invalid"].includes(approvedPlan.status) && !options.rebuild) {
      return { result: "paused", message: `Role Resume Content Plan is ${approvedPlan.status}; rebuild is required.`, providerCallMade: false };
    }
    const deterministic = await getRoleResumePlanStatus(workspace, targetId, "deterministic");
    if (deterministic.status !== "current") {
      await buildRoleResumePlan(workspace, targetId, { rebuild: options.rebuild, now: options.now });
    }
    try {
      await promoteDeterministicRoleResumePlan(workspace, targetId, { rebuild: options.rebuild, now: options.now });
    } catch (error) {
      return { result: "paused", message: errorMessage(error), providerCallMade: false };
    }
    approvedPlan = await getRoleResumePlanStatus(workspace, targetId, "approved");
    advanced = true;
  }

  const scaffoldStatus = await getRoleResumeDraftScaffoldStatus(workspace, targetId);
  if (scaffoldStatus.status !== "current") {
    if (["stale", "invalid"].includes(scaffoldStatus.status) && !options.rebuild) {
      return { result: "paused", message: `Resume structure is ${scaffoldStatus.status}; rebuild is required.`, providerCallMade: false };
    }
    await buildRoleResumeDraftScaffold(workspace, targetId, { rebuild: options.rebuild, now: options.now });
    advanced = true;
  }

  workflow = await inspectRoleWorkflow(workspace, targetId);

  const latest = await latestRoleResumeDraftProposalForProduct(workspace, targetId);
  if (latest?.status === "current" && latest.readyForReview) {
    const review = await getRoleResumeDraftReviewStatus(workspace, latest.id);
    if (review.status === "missing") await initializeRoleResumeDraftReview(workspace, latest.id);
    return { result: advanced ? "advanced" : "already-current", providerCallMade: false };
  }
  if (latest && ["stale", "invalid"].includes(latest.status)) {
    return { result: "paused", message: "The existing resume wording proposal needs an explicit rebuild before review.", providerCallMade: false };
  }

  try {
    await generateRoleResumeDraftProposal(workspace, targetId, {
      ...(options.provider ? { provider: options.provider } : {}),
      ...(options.now ? { now: options.now } : {}),
    });
  } catch (error) {
    if (isMissingWritingProvider(error)) {
      return { result: "paused", message: "Configure a writing provider to prepare reviewable resume wording.", providerCallMade: false };
    }
    throw error;
  }
  const proposals = await listRoleResumeDraftProposals(workspace, targetId);
  const proposal = proposals[proposals.length - 1];
  if (!proposal) throw new Error("The writing provider did not produce a stored resume proposal.");
  const status = await getRoleResumeDraftProposalStatus(workspace, proposal.id);
  if (status.status === "current" && status.readyForReview) await initializeRoleResumeDraftReview(workspace, proposal.id);
  return { result: "advanced", providerCallMade: true };
}

async function approveGuidedRoleEvidenceSelection(
  workspace: string,
  workflow: RoleWorkflowStatus,
  options: { rebuild?: boolean; now?: () => Date } = {},
) {
  const context = await loadMatchingContext(workspace, workflow.target.id, {
    persistSnapshot: true,
    rebuildSnapshot: options.rebuild,
    now: options.now,
  });
  const expectationByStatement = new Map(
    context.eligibleExpectations.map((entry) => [normalizeText(entry.statement), entry]),
  );
  const matches: EvidenceMatch[] = [];
  const matchedExpectations = new Set<string>();
  const seen = new Set<string>();
  for (const link of workflow.evidenceLinks) {
    const expectation = expectationByStatement.get(normalizeText(link.expectation));
    const evidence = context.snapshot.entries.find((entry) => entry.evidenceId === link.evidenceId);
    if (!expectation || !evidence) continue;
    const key = `${expectation.id}\u0000${evidence.evidenceId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    matchedExpectations.add(expectation.id);
    const direct = link.relationship === "supporting";
    matches.push({
      id: manualMatchId(
        workflow.target.id,
        expectation.id,
        [evidence.evidenceId],
        direct ? "direct" : "partial",
      ),
      expectationId: expectation.id,
      evidenceIds: [evidence.evidenceId],
      matchType: direct ? "direct" : "partial",
      coverage: direct ? "full" : "partial",
      evidenceStrength: direct ? "medium" : "weak",
      temporalRelevance: "unknown",
      rationale: link.rationale,
      expectationProvenance: expectationProvenance(context, expectation),
      evidenceProvenance: [evidence.provenance],
      trustState: "manual-approved",
      interpretation: {
        method: "manual",
        matcherName: EVIDENCE_MATCHER_NAME,
        matcherVersion: EVIDENCE_MATCHER_VERSION,
        policyVersion: EVIDENCE_MATCHING_POLICY_VERSION,
      },
      matchConfidence: direct ? "medium" : "low",
      limitations: direct
        ? ["The guided selection preserves the reviewed claim boundary and does not authorize broader scope."]
        : ["This is adjacent or partial evidence and must remain qualified in downstream wording."],
      notes: ["Confirmed through the guided Role Resume continuation after the selected evidence was shown."],
    });
  }
  const explicitCoverage = new Map<string, ExpectationCoverageStatus>();
  for (const expectation of context.eligibleExpectations) {
    if (!matchedExpectations.has(expectation.id)) explicitCoverage.set(expectation.id, "unsupported");
  }
  return writeApprovedMatching(
    workspace,
    context,
    matches,
    explicitCoverage,
    {},
    { rebuild: options.rebuild, now: options.now },
  );
}

export async function inspectRoleResumeDraftForProduct(
  workspace: string,
  targetId: string,
  proposalId?: string,
): Promise<{
  proposal: RoleResumeDraftProposal;
  review: RoleResumeDraftReview;
  reviewStatus: RoleResumeDraftReviewStatus;
  itemContext: Record<string, {
    evidence: Array<{ id: string; summary: string }>;
    claims: Array<{ id: string; text: string }>;
    boundaries: Array<{ id: string; rationale: string; qualifiers: string[] }>;
    ledgerEffect: string;
  }>;
}> {
  const proposal = proposalId
    ? await showRoleResumeDraftProposal(workspace, proposalId)
    : await latestCurrentRoleResumeDraftProposal(workspace, targetId);
  if (proposal.targetId !== targetId) throw new Error("Role draft proposal belongs to a different Role Target.");
  const reviewStatus = await getRoleResumeDraftReviewStatus(workspace, proposal.id);
  if (reviewStatus.status === "missing") {
    await initializeRoleResumeDraftReview(workspace, proposal.id);
  }
  const context = await loadRoleResumeDraftingContext(workspace, targetId);
  const evidenceItems = (await readJson<unknown[]>(path.join(workspace, "kb/evidence-items.json"), []))
    .map((entry) => EvidenceItemSchema.parse(entry));
  const foundationSnapshot = await calculateEvidenceFoundationSnapshot(workspace);
  const claims = foundationSnapshot.claims.flatMap((entry) => entry.content ? [entry.content] : []);
  const evidenceById = new Map(evidenceItems.map((entry) => [entry.id, entry]));
  const claimByEvidenceId = new Map<string, typeof claims>();
  for (const claim of claims) {
    for (const evidenceId of claim.supportingEvidenceIds) {
      claimByEvidenceId.set(evidenceId, [...(claimByEvidenceId.get(evidenceId) ?? []), claim]);
    }
  }
  const boundaryById = new Map(context.approvedPlan.claimBoundaries.map((entry) => [entry.id, entry]));
  const itemContext = Object.fromEntries(proposal.sections.flatMap((section) => section.items).map((item) => {
    const evidence = item.evidenceIds.flatMap((id) => {
      const entry = evidenceById.get(id);
      return entry ? [{ id, summary: entry.normalizedSummary ?? entry.text }] : [];
    });
    const itemClaims = [...new Map(item.evidenceIds.flatMap((id) => claimByEvidenceId.get(id) ?? [])
      .map((claim) => [claim.id, { id: claim.id, text: claim.approvedWording ?? claim.claim }])).values()];
    const boundaries = item.claimBoundaryIds.flatMap((id) => {
      const entry = boundaryById.get(id);
      return entry ? [{ id, rationale: entry.rationale, qualifiers: entry.requiredQualifiers }] : [];
    });
    return [item.id, {
      evidence,
      claims: itemClaims,
      boundaries,
      ledgerEffect: "Looks Good or a valid edit includes this statement in the claim ledger; Remove or Needs Attention excludes it from approval.",
    }];
  }));
  return {
    proposal,
    review: await showRoleResumeDraftReview(workspace, proposal.id),
    reviewStatus: await getRoleResumeDraftReviewStatus(workspace, proposal.id),
    itemContext,
  };
}

export async function setRoleResumeDraftReviewDecisionForProduct(
  workspace: string,
  targetId: string,
  proposalId: string,
  itemType: Parameters<typeof setRoleResumeDraftReviewDecision>[2],
  itemId: string,
  input: Parameters<typeof setRoleResumeDraftReviewDecision>[4],
): Promise<RoleResumeDraftReviewStatus> {
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  if (proposal.targetId !== targetId) throw new Error("Role draft review belongs to a different Role Target.");
  if (itemType === "draft-item") {
    await setRoleResumeDraftStatementReviewDecision(workspace, proposalId, itemId, input);
  } else {
    await setRoleResumeDraftReviewDecision(workspace, proposalId, itemType, itemId, input);
  }
  return getRoleResumeDraftReviewStatus(workspace, proposalId);
}

export async function completeRoleResumeDraftReviewForProduct(
  workspace: string,
  targetId: string,
  proposalId: string,
): Promise<RoleResumeDraftReviewStatus> {
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  if (proposal.targetId !== targetId) throw new Error("Role draft review belongs to a different Role Target.");
  return completeRoleResumeDraftReview(workspace, proposalId);
}

export async function approveRoleResumeDraftForProduct(
  workspace: string,
  targetId: string,
  proposalId: string,
): Promise<{ targetId: string; proposalId: string; result: string }> {
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  if (proposal.targetId !== targetId) throw new Error("Role draft proposal belongs to a different Role Target.");
  const result = await approveRoleResumeDraftProposal(workspace, proposalId);
  return { targetId: result.targetId, proposalId: result.proposalId, result: result.result };
}

export async function exportRoleResumeForProduct(
  workspace: string,
  targetId: string,
  options: { rebuild?: boolean; now?: () => Date } = {},
): Promise<ExportRoleResumeResult[]> {
  const approved = await getApprovedRoleResumeDraftStatus(workspace, targetId);
  if (approved.status !== "current" || !approved.usableForRendering) {
    throw new Error(`An approved Role Resume Draft must be current before export. Current status: ${approved.status}`);
  }
  const results: ExportRoleResumeResult[] = [];
  for (const format of ["markdown", "html", "docx"] as const) {
    results.push(await exportRoleResume(workspace, targetId, {
      format,
      rebuild: options.rebuild,
      now: options.now,
    }));
  }
  return results;
}

async function latestRoleResumeDraftProposalForProduct(workspace: string, targetId: string) {
  const proposals = await listRoleResumeDraftProposals(workspace, targetId);
  for (const proposal of proposals.slice().reverse()) {
    const status = await getRoleResumeDraftProposalStatus(workspace, proposal.id);
    if (status.status !== "missing") return { ...status, id: proposal.id };
  }
  return undefined;
}

async function latestCurrentRoleResumeDraftProposal(workspace: string, targetId: string): Promise<RoleResumeDraftProposal> {
  const latest = await latestRoleResumeDraftProposalForProduct(workspace, targetId);
  if (!latest || latest.status !== "current" || !latest.readyForReview) {
    throw new Error("No current reviewable Role Resume Draft proposal exists for this target.");
  }
  return showRoleResumeDraftProposal(workspace, latest.id);
}

async function roleDraftPreview(
  workspace: string,
  workflow: RoleWorkflowStatus,
  hasDraft: boolean,
): Promise<NonNullable<RoleJourneyProjection["draftPreview"]> | undefined> {
  if (!hasDraft) return undefined;
  let proposalId = workflow.draftProposal?.id;
  let source: RoleResumeDraftProposal | Awaited<ReturnType<typeof showApprovedRoleResumeDraft>>;
  let state: NonNullable<RoleJourneyProjection["draftPreview"]>["state"];
  if (workflow.canonical.approvedDraft === "current") {
    source = await showApprovedRoleResumeDraft(workspace, workflow.target.id);
    proposalId = workflow.draftProposal?.id ?? source.id;
    state = "approved";
  } else if (proposalId) {
    source = await showRoleResumeDraftProposal(workspace, proposalId);
    state = workflow.draftReview?.status === "completed"
      ? "review-complete"
      : workflow.draftReview?.status === "in-progress"
        ? "review-in-progress"
        : "proposal";
  } else {
    return undefined;
  }
  const review = proposalId ? await getRoleResumeDraftReviewStatus(workspace, proposalId) : undefined;
  const sections = source.sections
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      type: section.type,
      heading: roleSectionHeading(section.type),
      items: section.items.map((item) => item.text),
    }));
  return {
    state,
    proposalId: proposalId!,
    sections,
    items: sections.flatMap((section) => section.items),
    requiresHumanReview: state !== "approved",
    warnings: source.warnings.map((warning) => warning.message),
    ...(review && review.status !== "missing" ? { review } : {}),
  };
}

function rolePrimaryAction(
  workflow: RoleWorkflowStatus,
  state: { interpretationConfirmed: boolean; prepared: boolean; proposalReady: boolean; reviewInProgress: boolean; reviewComplete: boolean; approved: boolean; exported: boolean },
): RoleJourneyProjection["primaryAction"] {
  const targetQuery = `?target=${encodeURIComponent(workflow.target.id)}`;
  if (state.exported) return {
    kind: "view",
    label: "Download Resume",
    detail: "Your current role resume exports are ready.",
    method: "GET",
    href: `/resume/role/download${targetQuery}`,
  };
  if (state.approved) return {
    kind: "export",
    label: "Prepare Downloads",
    detail: "Export the approved wording as Markdown, HTML, and DOCX.",
    method: "POST",
    href: "/resume/role",
    action: PRODUCT_WORKFLOW_ACTIONS.exportRoleResume,
  };
  if (state.reviewComplete && workflow.draftProposal?.id) return {
    kind: "approve",
    label: "Approve Resume",
    detail: "Approval is deterministic and uses only the completed human review.",
    method: "GET",
    href: `/resume/role/review${targetQuery}&proposal=${encodeURIComponent(workflow.draftProposal.id)}`,
  };
  if ((state.proposalReady || state.reviewInProgress) && workflow.draftProposal?.id) return {
    kind: "review",
    label: "Review Resume",
    detail: "Review the actual resume wording before it can be approved.",
    method: "GET",
    href: `/resume/role/review${targetQuery}&proposal=${encodeURIComponent(workflow.draftProposal.id)}`,
  };
  if (state.prepared) return {
    kind: "blocked",
    label: "Configure Writing Provider",
    detail: "Resume structure is ready. Configure the local writing provider, then continue preparation.",
    method: "GET",
    href: `/resume/role${targetQuery}#writing-provider`,
  };
  if (workflow.understandingStatus === "current" && !state.interpretationConfirmed) return {
    kind: "approve",
    label: "Confirm Role Direction",
    detail: "Review the generated role understanding and confirm it before ProofLayer selects experience.",
    method: "POST",
    href: "/resume/role",
    action: PRODUCT_WORKFLOW_ACTIONS.confirmRoleDirection,
  };
  if (workflow.understandingStatus === "current") return {
    kind: "continue",
    label: "Continue Preparing Resume",
    detail: workflow.canonical.scaffold === "current"
      ? "Continue to prepare wording with a configured writing provider."
      : "Continue the guided Role workflow using your existing Career Twin.",
    method: "POST",
    href: "/resume/role",
    action: PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow,
  };
  return {
    kind: "continue",
    label: "Understand This Role",
    detail: "Use the saved role target and your existing Career Twin.",
    method: "POST",
    href: "/resume/role",
    action: PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow,
  };
}

function roleSectionHeading(type: RoleResumeDraftSection["type"]): string {
  const labels: Record<RoleResumeDraftSection["type"], string> = {
    headline: "Headline",
    "professional-summary": "Professional Summary",
    "core-capabilities": "Core Capabilities",
    "selected-impact": "Selected Impact",
    "professional-experience": "Professional Experience",
    "selected-projects": "Selected Projects",
    "technical-capabilities": "Technical Capabilities",
    "leadership-capabilities": "Leadership Capabilities",
    education: "Education",
    certifications: "Certifications",
    "additional-information": "Additional Information",
  };
  return labels[type];
}

function isMissingWritingProvider(error: unknown): boolean {
  return error instanceof Error && /PROOFLAYER_MODEL_PROVIDER is required|PROOFLAYER_MODEL_NAME is required|PROOFLAYER_MODEL_RESPONSE_FILE is required/.test(error.message);
}

async function projectRoleJourney(workspace: string, workflow: RoleWorkflowStatus): Promise<RoleJourneyProjection> {
  const roleUnderstood = workflow.understandingStatus === "current";
  const interpretationConfirmed = workflow.canonical.approvedInterpretation === "current";
  const selected = workflow.canonical.approvedMatching === "current";
  const prepared = workflow.canonical.scaffold === "current";
  const proposalReady = workflow.draftProposal?.status === "current" && workflow.draftProposal.readyForReview;
  const reviewInProgress = workflow.draftReview?.status === "in-progress";
  const reviewComplete = workflow.draftReview?.status === "completed";
  const approved = workflow.canonical.approvedDraft === "current";
  const exported = ["markdown", "html", "docx"].every((format) =>
    workflow.exports.some((entry) => entry.format === format && entry.status === "current"),
  );
  const draft = await roleDraftPreview(workspace, workflow, proposalReady || reviewInProgress || reviewComplete || approved);
  const primaryAction = rolePrimaryAction(workflow, {
    interpretationConfirmed,
    prepared,
    proposalReady,
    reviewInProgress,
    reviewComplete,
    approved,
    exported,
  });
  const progress: ProductProgressStep[] = [
    step("Role understood", roleUnderstood, !roleUnderstood,
      roleUnderstood ? `${workflow.understanding!.expectations.length} conservative generated expectations are available.` : "The title is saved; ProofLayer can generate a conservative role understanding."),
    step("Relevant experience selected", selected, roleUnderstood && !selected,
      selected ? `${workflow.selectedEvidenceIds.length} reviewed evidence item(s) support the current positioning.` : "No eligible evidence can yet be connected safely."),
    step("Resume prepared", prepared, selected && !prepared,
      prepared ? "The resume structure is prepared from the approved Role workflow." : "Resume preparation waits for current approved planning inputs."),
    step(proposalReady || reviewInProgress ? "Ready for review" : prepared ? "Writing provider required" : "Resume draft", proposalReady || reviewInProgress, prepared && !proposalReady && !reviewInProgress,
      proposalReady || reviewInProgress ? "A resume draft is ready for human review." : "No reviewable resume wording exists yet."),
    step("Approved", approved, reviewComplete && !approved,
      approved ? "The reviewed structured resume is approved." : reviewComplete ? "Review is complete; deterministic approval is the next action." : "Approval follows completed human review."),
    step("Exported", exported, approved && !exported,
      exported ? "Current resume exports are available." : "Exports follow an approved resume."),
  ];
  return {
    target: workflow.target,
    progress,
    careerReady: workflow.selectedEvidenceIds.length > 0,
    currentValue: draft
      ? draft.state === "approved"
        ? "Your approved role resume is ready for export or viewing."
        : "A reviewable role resume draft is ready. The wording remains unapproved until you review it."
      : prepared
        ? "Resume structure is prepared from your existing Career Twin; wording still requires an explicit writing provider."
        : interpretationConfirmed
          ? "Your Role direction is confirmed. ProofLayer can now select and prepare only defensible Career Twin evidence."
          : roleUnderstood
            ? "ProofLayer generated a conservative role understanding for your confirmation. No source re-upload is required."
      : "Your target and existing Career Twin are saved; no source re-upload is required.",
    ...(workflow.blocker ? { blocker: workflow.blocker.message } : {}),
    nextAction: workflow.nextAction,
    primaryAction,
    ...(workflow.understanding ? {
      understanding: {
        state: interpretationConfirmed ? "reviewed" : workflow.understanding.state,
        summary: workflow.understanding.summary,
        sourceLabel: workflow.understanding.source.type === "built-in-taxonomy"
          ? "Conservative built-in role model"
          : `Untrusted ${workflow.understanding.source.provider} proposal`,
        specialization: workflow.understanding.specialization.label,
        expectations: workflow.understanding.expectations.map((entry) => entry.statement),
      },
      positioning: {
        label: workflow.positioning,
        fit: workflow.fit,
        strongestThemes: workflow.strongestThemes.map(({ theme, evidence }) => ({ theme, evidence })),
        weakerThemes: workflow.weakerThemes,
        gaps: workflow.materialGaps,
        limitations: workflow.limitations,
      },
    } : {}),
    ...(workflow.ambiguity ? {
      materialQuestion: {
        question: workflow.ambiguity.question,
        options: workflow.ambiguity.options,
        selectedOptionId: workflow.ambiguity.selectedOptionId,
      },
    } : {}),
    ...(draft ? { draftPreview: draft } : (workflow.draftPreview.status === "evidence-backed-preview" || workflow.selectedEvidenceIds.length > 0) ? {
      draftPreview: {
        state: "proposal" as const,
        proposalId: "guided-preview",
        sections: [{ type: "selected-evidence", heading: "Evidence currently available", items: Array.from(new Set([
          ...workflow.draftPreview.items.map((entry) => entry.text),
          ...workflow.strongestThemes.map((entry) => entry.evidence),
        ])) }],
        items: Array.from(new Set([
          ...workflow.draftPreview.items.map((entry) => entry.text),
          ...workflow.strongestThemes.map((entry) => entry.evidence),
        ])),
        requiresHumanReview: true,
        warnings: ["This is an evidence preview, not a resume draft."],
      },
    } : {}),
    exports: workflow.exports,
    advanced: [
      { label: "Generated role understanding", status: workflow.understandingStatus },
      { label: "Approved interpretation", status: workflow.canonical.approvedInterpretation },
      { label: "Approved evidence matching", status: workflow.canonical.approvedMatching },
      { label: "Approved assessment", status: workflow.canonical.assessment },
      { label: "Approved content plan", status: workflow.canonical.plan },
      { label: "Draft structure", status: workflow.canonical.scaffold },
      { label: "Approved draft", status: workflow.canonical.approvedDraft },
      { label: "Rendering", status: workflow.canonical.rendering },
      { label: "Draft proposal", status: workflow.draftProposal?.status ?? "missing" },
      { label: "Draft review", status: workflow.draftReview?.status ?? "missing" },
      { label: "Resume exports", status: exported ? "current" : workflow.exports.length ? "needs-attention" : "missing" },
    ],
  };
}

export async function runProductJobJourney(
  workspace: string,
  targetId: string,
): Promise<JobJourneyProjection> {
  let result = await runJobWorkflow(workspace, targetId);
  if (result.status.currentStage === "evidence-pin" && result.status.evidenceSnapshot.status === "missing") {
    const current = result.status.availableSnapshots.filter((entry) => entry.status === "current");
    if (current.length === 1) {
      result = await runJobWorkflow(workspace, targetId, { snapshotId: current[0]!.snapshotId });
    }
  }
  return inspectProductJobJourney(workspace, targetId);
}

export async function createProductJobJourney(
  workspace: string,
  input: Omit<JobTargetInput, "file"> & { description: string },
): Promise<JobJourneyProjection> {
  const description = exactUtf8Text(input.description, "Job Description");
  const hash = hashText(description);
  const existingTarget = (await listTargets(workspace)).find((target) =>
    target.type === "job" && target.source.sha256 === hash);
  if (existingTarget?.type === "job") {
    assertJobInputCompatible(existingTarget, input);
    return runProductJobJourney(workspace, existingTarget.id);
  }

  const inputPath = path.join(workspace, "inputs/jobs", `job-description-${hash.slice(0, 12)}.md`);
  if (await pathExists(inputPath)) {
    const existing = await readFile(inputPath);
    if (!existing.equals(Buffer.from(description, "utf8"))) {
      throw new Error("Existing imported Job Description has different bytes and was not overwritten.");
    }
  } else {
    await writeBufferAtomic(inputPath, Buffer.from(description, "utf8"));
  }
  const created = await createJobTarget(workspace, {
    file: inputPath,
    title: input.title,
    company: input.company,
    location: input.location,
    workingModel: input.workingModel,
  });
  return runProductJobJourney(workspace, created.target.id);
}

export async function inspectProductJobJourney(
  workspace: string,
  targetId: string,
): Promise<JobJourneyProjection> {
  const target = await showTarget(workspace, targetId);
  if (target.type !== "job") throw new Error("Job Tailoring accepts only Job Targets.");
  const workflow = await inspectJobWorkflow(workspace, targetId);
  const requirementStatus = await getJobRequirementModelStatus(workspace, targetId);
  const assessmentStatus = await getJobFitProofAssessmentStatus(workspace, targetId);
  const planStatus = await getJobResumePlanStatus(workspace, targetId);
  const scaffoldStatus = await getJobResumeDraftScaffoldStatus(workspace, targetId);
  const approvedStatus = await getApprovedJobResumeDraftStatus(workspace, targetId);
  const requirements = requirementStatus.status === "current"
    ? (await showJobRequirementModel(workspace, targetId)).requirements
    : [];
  const assessment = assessmentStatus.status === "current"
    ? await showJobFitProofAssessment(workspace, targetId)
    : undefined;
  const requirementById = new Map(requirements.map((requirement) => [requirement.id, requirement]));
  const assessments = assessment?.requirementAssessments ?? [];
  const mandatory = assessments.filter((entry) => entry.necessity === "mandatory");
  const preferred = assessments.filter((entry) => entry.necessity === "preferred");
  const mandatoryRequirementCount = requirements.filter((entry) => entry.necessity === "mandatory").length;
  const preferredRequirementCount = requirements.filter((entry) => entry.necessity === "preferred").length;
  const strengths = assessments
    .filter((entry) => entry.assessmentState === "strength" || entry.assessmentState === "supported")
    .map((entry) => requirementById.get(entry.requirementId)?.normalizedLabel)
    .filter((value): value is string => Boolean(value));
  const gaps = assessments
    .filter((entry) => entry.assessmentState === "gap" && ["critical", "material"].includes(entry.materiality))
    .map((entry) => requirementById.get(entry.requirementId)?.normalizedLabel)
    .filter((value): value is string => Boolean(value));
  const overall = assessment?.overall.state;
  const fitLabel = workflow.evidenceSnapshot.eligibleJobEvidenceCount === 0
    ? "insufficient evidence" as const
    : overall === "strong" || overall === "credible" || overall === "mixed"
      ? overall
      : overall === "limited"
        ? "stretch" as const
        : "insufficient evidence" as const;
  const plan = planStatus.status === "current" ? await showJobResumePlan(workspace, targetId) : undefined;
  const planningUsable = plan?.completeness.usableForDrafting ?? false;
  const progress: ProductProgressStep[] = [
    step("Job understood", requirementStatus.status === "current", false,
      requirementStatus.status === "current" ? `${requirements.length} requirements were structured from the Job Description.` : "Job understanding has not completed."),
    step("Fit analyzed", assessmentStatus.status === "current", requirementStatus.status === "current" && assessmentStatus.status !== "current",
      assessmentStatus.status === "current" ? `Current evidence supports a ${fitLabel} assessment.` : "Fit waits for current evidence coverage."),
    step("Resume tailored", planningUsable, planStatus.status === "current" && !planningUsable,
      planningUsable ? "A defensible job-specific content plan is ready." : "Material proof gaps prevent safe tailoring."),
    step("Ready for review", approvedStatus.status === "current", scaffoldStatus.status === "current" && approvedStatus.status !== "current",
      approvedStatus.status === "current" ? "An approved structured draft is ready." : "No approved draft is ready for review."),
    step("Exported", workflow.overallState === "complete", approvedStatus.status === "current" && workflow.overallState !== "complete",
      workflow.overallState === "complete" ? "Current resume exports are available." : "No current job-specific export is available."),
  ];
  return {
    target,
    workflow,
    fit: {
      label: fitLabel,
      statement: assessment?.overall.statement
        ?? "Fit is not assessed until current requirement coverage is available.",
      mandatory: countAssessment(mandatory, mandatoryRequirementCount),
      preferred: countAssessment(preferred, preferredRequirementCount),
      strengths,
      gaps,
      limitations: [
        ...(workflow.evidenceSnapshot.eligibleJobEvidenceCount === 0
          ? ["The current pinned evidence snapshot has no public-safe, resume-ready evidence eligible for Job Mapping."]
          : []),
        ...(assessment?.ambiguities.slice(0, 3).map((entry) => entry.message) ?? []),
      ],
    },
    progress,
    nextAction: productJobNextAction(workflow, planningUsable),
    ...(workflow.reviewGate?.batchId ? { advancedReviewBatchId: workflow.reviewGate.batchId } : {}),
  };
}

export async function addCareerSource(
  workspace: string,
  input: AddCareerSourceInput,
): Promise<{ path: string; result: "created" | "already-present" }> {
  const title = requiredText(input.title, "Source title");
  if (input.content.byteLength === 0) throw new Error("Source content must not be empty.");
  const text = new TextDecoder("utf-8", { fatal: true }).decode(input.content);
  if (!Buffer.from(text, "utf8").equals(Buffer.from(input.content))) {
    throw new Error("Source content must be exact UTF-8 text.");
  }
  const hash = hashText(text);
  const relativePath = `sources/markdown/${slugify(title)}-${hash.slice(0, 12)}.md`;
  const absolutePath = path.join(workspace, relativePath);
  if (await pathExists(absolutePath)) {
    const existing = await readFile(absolutePath);
    if (!existing.equals(Buffer.from(input.content))) {
      throw new Error("A source with this identity already exists with different bytes.");
    }
    return { path: relativePath, result: "already-present" };
  }
  await writeBufferAtomic(absolutePath, input.content);
  return { path: relativePath, result: "created" };
}

export async function existingProductTargets(workspace: string): Promise<{
  roles: RoleTarget[];
  jobs: Array<Extract<Target, { type: "job" }>>;
}> {
  const targets = await listTargets(workspace);
  return {
    roles: targets.filter((target): target is RoleTarget => target.type === "role"),
    jobs: targets.filter((target): target is Extract<Target, { type: "job" }> => target.type === "job"),
  };
}

function countAssessment(entries: Array<{ assessmentState: string }>, knownRequirementCount: number) {
  return {
    total: knownRequirementCount,
    supported: entries.filter((entry) => ["strength", "supported"].includes(entry.assessmentState)).length,
    partial: entries.filter((entry) => entry.assessmentState === "partial").length,
  };
}

function productJobNextAction(workflow: JobWorkflowStatus, planningUsable: boolean): string {
  if (workflow.evidenceSnapshot.eligibleJobEvidenceCount === 0) {
    if ((workflow.reviewGate?.pendingClaimCount ?? 0) > 0) {
      return "Confirm only the material evidence questions needed for this job.";
    }
    return "Add or update a source that can provide public-safe, resume-ready proof for material requirements.";
  }
  if (!planningUsable) return "Resolve the smallest material evidence gap shown above before drafting.";
  if (workflow.overallState === "ready-to-finalize") return "Review the approved draft, then export it.";
  if (workflow.overallState === "complete") return "No action is required; the tailored resume is current.";
  return workflow.humanActionRequired ?? "Continue the next guided step.";
}

function defaultRoleProgress(): ProductProgressStep[] {
  return [
    { label: "Role understood", state: "current", detail: "Enter a role title to begin." },
    { label: "Relevant experience selected", state: "waiting", detail: "Uses your existing Career Twin." },
    { label: "Resume prepared", state: "waiting", detail: "No resume prose exists yet." },
    { label: "Ready for review", state: "waiting", detail: "Human review remains required for model-authored prose." },
    { label: "Approved", state: "waiting", detail: "Approval follows completed human review." },
    { label: "Exported", state: "waiting", detail: "Exports follow an approved draft." },
  ];
}

function step(label: string, complete: boolean, current: boolean, detail: string): ProductProgressStep {
  return { label, state: complete ? "complete" : current ? "current" : "waiting", detail };
}

function assertRoleInputCompatible(existing: RoleTarget, input: RoleTargetInput): void {
  const fields: Array<keyof Omit<RoleTargetInput, "title">> = ["seniority", "domain", "location", "workingModel"];
  if (existing.title !== requiredText(input.title, "Role title")) {
    throw new Error("Existing Role Target title differs from the requested title.");
  }
  for (const field of fields) {
    const requested = input[field]?.trim().toLowerCase();
    const stored = existing[field]?.trim().toLowerCase();
    if (requested && requested !== stored) {
      throw new Error(`Existing Role Target ${field} differs; it was not overwritten.`);
    }
  }
}

function assertJobInputCompatible(
  existing: Extract<Target, { type: "job" }>,
  input: Omit<JobTargetInput, "file">,
): void {
  const requestedTitle = input.title?.replace(/\s+/g, " ").trim();
  if (requestedTitle && requestedTitle !== existing.title) {
    throw new Error("Existing Job Target title differs from the supplied title.");
  }
  for (const field of ["company", "location", "workingModel"] as const) {
    const requested = input[field]?.replace(/\s+/g, " ").trim().toLowerCase();
    const stored = existing[field]?.replace(/\s+/g, " ").trim().toLowerCase();
    if (requested && requested !== stored) {
      throw new Error(`Existing Job Target ${field} differs; it was not overwritten.`);
    }
  }
}

function exactUtf8Text(value: string, label: string): string {
  if (!value.trim()) throw new Error(`${label} must not be empty.`);
  const bytes = Buffer.from(value, "utf8");
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (decoded !== value) throw new Error(`${label} must be valid UTF-8 text.`);
  return value;
}

function requiredText(value: string | undefined, label: string): string {
  const normalized = value?.replace(/\s+/g, " ").trim();
  if (!normalized) throw new Error(`${label} must not be blank.`);
  return normalized;
}

function slugify(value: string): string {
  const slug = value.normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  if (!slug) throw new Error("A safe target identifier could not be derived.");
  return slug;
}

function isMissingTarget(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("Target not found:");
}

function normalizeText(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
