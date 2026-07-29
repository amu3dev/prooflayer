import type { InterpretationModelProvider } from "./model-provider.js";
import {
  createModelProvider,
  loadModelProviderConfiguration,
} from "./model-provider.js";
import {
  createJobTarget,
  showTarget,
  type JobTargetInput,
  type TargetCreationOptions,
  type TargetCreationResult,
} from "./targets.js";
import { analyzeTarget, getTargetAnalysisStatus } from "./target-analysis.js";
import {
  buildJobRequirements,
  getJobRequirementModelStatus,
} from "./job-requirements.js";
import { getApprovedJobRequirementsStatus } from "./approved-job-requirements.js";
import {
  buildEvidenceSnapshot,
  calculateEvidenceFoundationSnapshot,
  listEvidenceSnapshots,
  type EvidenceSnapshotListEntry,
} from "./evidence-snapshots.js";
import {
  getTargetEvidencePinStatus,
  loadTargetEvidencePin,
  pinTargetEvidenceSnapshot,
  upgradeTargetEvidenceSnapshot,
} from "./target-evidence-pin.js";
import {
  buildJobEvidenceMap,
  getJobEvidenceMapStatus,
  showJobEvidenceMap,
} from "./job-evidence-mapping.js";
import type { JobRequirementInputType } from "./job-evidence-map-schemas.js";
import { buildJobCoverage, getJobCoverageStatus } from "./job-coverage.js";
import {
  buildJobFitProofAssessment,
  getJobFitProofAssessmentStatus,
} from "./job-fit-proof-assessment.js";
import {
  buildJobResumePlan,
  getJobResumePlanStatus,
  showJobResumePlan,
} from "./job-resume-planning.js";
import {
  buildJobResumeDraftScaffold,
  getJobResumeDraftScaffoldStatus,
} from "./job-resume-drafting.js";
import {
  generateJobResumeDraftProposal,
  getJobResumeDraftProposalStatus,
  listJobResumeDraftProposals,
} from "./job-resume-draft-proposal.js";
import {
  getJobResumeDraftReviewStatus,
  initializeJobResumeDraftReview,
} from "./job-resume-draft-review.js";
import {
  approveJobResumeDraft,
  getApprovedJobResumeDraftStatus,
} from "./approved-job-resume-draft.js";
import {
  composeJobResumeRenderDocument,
  getJobResumeRenderDocumentStatus,
  type JobResumeRenderOptions,
} from "./job-resume-rendering.js";
import {
  exportJobResume,
  getJobResumeExportStatus,
  listJobResumeExports,
  type ExportJobResumeResult,
} from "./job-resume-render-export.js";
import type { RoleResumeBinaryToolchain } from "./role-resume-render-export.js";
import { normalizeRoleResumeRenderOptions } from "./role-resume-rendering.js";
import type {
  RoleResumeDateFormat,
  RoleResumeExportFormat,
  RoleResumePageSize,
  RoleResumeRenderProfileName,
} from "./role-resume-render-schemas.js";
import {
  buildEvidenceReviewBatch,
  listEvidenceReviewBatches,
  showEvidenceReviewBatch,
} from "./evidence-review-batch.js";
import {
  getEvidenceReviewWorkspaceStatus,
  renderEvidenceReviewWorkspace,
} from "./evidence-review-workspace.js";
import { listEvidenceClaimReviews } from "./evidence-claim-review.js";
import { stableJson } from "./target-proposal.js";
import type { JobTarget } from "./schemas.js";

export const JOB_WORKFLOW_SCHEMA_VERSION = 1 as const;

export const JOB_WORKFLOW_STAGES = [
  "target",
  "analysis",
  "requirements",
  "evidence-pin",
  "evidence-review",
  "evidence-snapshot",
  "evidence-mapping",
  "coverage",
  "assessment",
  "planning",
  "scaffold",
  "draft-proposal",
  "draft-review",
  "approved-draft",
  "composition",
  "export",
] as const;

export type JobWorkflowStage = typeof JOB_WORKFLOW_STAGES[number];
export type JobWorkflowState =
  | "not-started"
  | "running"
  | "paused"
  | "blocked"
  | "ready-to-continue"
  | "ready-to-finalize"
  | "complete"
  | "invalid";
export type JobWorkflowStageStatus =
  | "missing"
  | "current"
  | "stale"
  | "invalid"
  | "incompatible"
  | "blocked"
  | "human-action-required";
export type JobWorkflowAction =
  | "reused"
  | "built"
  | "rebuilt"
  | "paused"
  | "skipped"
  | "failed";

export interface JobWorkflowStageState {
  stage: JobWorkflowStage;
  label: string;
  status: JobWorkflowStageStatus;
  detail: string;
  reasons: string[];
}

export interface JobWorkflowStageResult {
  stage: JobWorkflowStage;
  result: JobWorkflowAction;
  detail: string;
}

export interface JobWorkflowBlocker {
  code: string;
  stage: JobWorkflowStage;
  message: string;
}

export interface JobWorkflowReviewGate {
  batchId?: string;
  workspacePath?: string;
  selectedClaimCount: number;
  pendingClaimCount: number;
  status: "missing" | "current" | "stale" | "invalid";
}

export interface JobWorkflowStatus {
  schemaVersion: typeof JOB_WORKFLOW_SCHEMA_VERSION;
  target: {
    id: string;
    type: "job";
    title: string;
    company?: string;
    location?: string;
    workingModel?: string;
    jobDescriptionPath: string;
    jobDescriptionSha256: string;
  };
  requirementSource: JobRequirementInputType;
  currentStage: JobWorkflowStage;
  overallState: JobWorkflowState;
  blocker?: JobWorkflowBlocker;
  humanActionRequired?: string;
  nextCommand: string;
  evidenceSnapshot: {
    snapshotId?: string;
    status: "missing" | "current" | "stale" | "invalid" | "incompatible";
    eligibleJobEvidenceCount: number;
  };
  availableSnapshots: EvidenceSnapshotListEntry[];
  reviewGate?: JobWorkflowReviewGate;
  currentProposalId?: string;
  currentReviewId?: string;
  currentExportFormats: RoleResumeExportFormat[];
  stages: JobWorkflowStageState[];
}

export interface RunJobWorkflowOptions {
  requirementSource?: JobRequirementInputType;
  snapshotId?: string;
  upgradeSnapshotId?: string;
  providerName?: string;
  offline?: boolean;
  rebuildStale?: boolean;
  dryRun?: boolean;
  provider?: InterpretationModelProvider;
  environment?: NodeJS.ProcessEnv;
}

export interface JobWorkflowRunResult {
  mode: "run" | "continue";
  dryRun: boolean;
  status: JobWorkflowStatus;
  stageResults: JobWorkflowStageResult[];
}

export interface FinalizeJobWorkflowOptions {
  profile?: RoleResumeRenderProfileName;
  pageSize?: RoleResumePageSize;
  dateFormat?: RoleResumeDateFormat;
  formats?: RoleResumeExportFormat[];
  outputDir?: string;
  rebuildStale?: boolean;
  dryRun?: boolean;
  toolchain?: RoleResumeBinaryToolchain;
}

export interface FinalizeJobWorkflowResult {
  dryRun: boolean;
  status: JobWorkflowStatus;
  result: "completed" | "already-current" | "partial-failure" | "paused";
  compositionResult?: "created" | "rebuilt" | "already-current";
  succeeded: ExportJobResumeResult[];
  failed: Array<{ format: RoleResumeExportFormat; error: string }>;
  stageResults: JobWorkflowStageResult[];
}

type InspectionOptions = {
  requirementSource?: JobRequirementInputType;
  renderOptions?: JobResumeRenderOptions;
};

type ReviewContext = JobWorkflowReviewGate & {
  batchTargetId?: string;
};

const DEFAULT_FINAL_FORMATS: RoleResumeExportFormat[] = [
  "markdown",
  "html",
  "docx",
];

const STAGE_LABELS: Record<JobWorkflowStage, string> = {
  target: "Job Target",
  analysis: "Structural Analysis",
  requirements: "Requirement Model",
  "evidence-pin": "Evidence Snapshot Pin",
  "evidence-review": "Evidence Review",
  "evidence-snapshot": "Evidence Snapshot",
  "evidence-mapping": "Evidence Map",
  coverage: "Requirement Coverage",
  assessment: "Fit and Proof Assessment",
  planning: "Resume Content Plan",
  scaffold: "Draft Scaffold",
  "draft-proposal": "Draft Proposal",
  "draft-review": "Draft Review",
  "approved-draft": "Approved Draft",
  composition: "Canonical Composition",
  export: "Export",
};

export async function createGuidedJob(
  workspace: string,
  input: JobTargetInput,
  options: TargetCreationOptions = {},
): Promise<TargetCreationResult> {
  return createJobTarget(workspace, input, options);
}

export async function inspectJobWorkflow(
  workspace: string,
  targetId: string,
  options: InspectionOptions = {},
): Promise<JobWorkflowStatus> {
  const requirementSource = options.requirementSource ?? "deterministic";
  const target = await requireJobTarget(workspace, targetId);
  const stages = blankStages();
  setStage(stages, "target", "current", "Job Target and exact Job Description are available.");
  const availableSnapshots = await listEvidenceSnapshots(workspace);
  const base = baseStatus(target, requirementSource, availableSnapshots, stages);

  const analysis = await getTargetAnalysisStatus(workspace, targetId);
  setLifecycleStage(stages, "analysis", analysis.status, analysis.reasons,
    "Structural analysis is current.");
  if (analysis.status !== "current") {
    return stopForLifecycle(base, "analysis", analysis.status, analysis.reasons);
  }

  const requirements = requirementSource === "approved"
    ? await getApprovedJobRequirementsStatus(workspace, targetId)
    : await getJobRequirementModelStatus(workspace, targetId);
  setLifecycleStage(stages, "requirements", requirements.status, requirements.reasons,
    `${capitalize(requirementSource)} requirement source is current.`);
  if (requirements.status !== "current") {
    if (requirementSource === "approved" && requirements.status === "missing") {
      return finish(base, {
        currentStage: "requirements",
        overallState: "paused",
        blocker: {
          code: "APPROVED_REQUIREMENTS_REQUIRED",
          stage: "requirements",
          message: "The approved requirement source was requested but no current approved model exists.",
        },
        humanActionRequired: "Complete requirement proposal review and deterministic approval, or use the deterministic requirement source.",
        nextCommand: `prooflayer job run ${targetId} --requirements-source deterministic`,
      });
    }
    return stopForLifecycle(base, "requirements", requirements.status, requirements.reasons);
  }

  const pinStatus = await getTargetEvidencePinStatus(workspace, targetId);
  setLifecycleStage(stages, "evidence-pin", pinStatus.status, pinStatus.reasons,
    pinStatus.snapshotId
      ? `Pinned to immutable Evidence Snapshot ${pinStatus.snapshotId}.`
      : "No Evidence Snapshot is pinned.");
  if (pinStatus.status === "missing") {
    return finish(base, {
      currentStage: "evidence-pin",
      overallState: "paused",
      blocker: {
        code: "EVIDENCE_SNAPSHOT_SELECTION_REQUIRED",
        stage: "evidence-pin",
        message: "No immutable Evidence Snapshot is pinned to this Job Target.",
      },
      humanActionRequired: "Select one current Evidence Snapshot explicitly.",
      nextCommand: availableSnapshots.find((entry) => entry.status === "current")
        ? `prooflayer job run ${targetId} --snapshot <snapshot-id>`
        : "prooflayer evidence snapshot-build",
    });
  }
  if (pinStatus.status !== "current") {
    return stopForLifecycle(base, "evidence-pin", pinStatus.status, pinStatus.reasons);
  }

  const loadedPin = await loadTargetEvidencePin(workspace, targetId);
  const eligibleJobEvidenceCount = loadedPin.snapshot.snapshot.completeness.eligibleJobEvidenceCount;
  setStage(stages, "evidence-snapshot", "current",
    `Pinned snapshot is current with ${eligibleJobEvidenceCount} eligible Job evidence item(s).`);
  base.evidenceSnapshot = {
    snapshotId: loadedPin.snapshot.snapshot.id,
    status: "current",
    eligibleJobEvidenceCount,
  };

  const reviewGate = await inspectReviewGate(workspace, targetId);
  if (reviewGate) base.reviewGate = reviewGate;
  if (eligibleJobEvidenceCount === 0) {
    setStage(stages, "evidence-review", "human-action-required",
      reviewGate?.status === "current"
        ? `${reviewGate.pendingClaimCount} selected claim review(s) remain pending.`
        : "A current Evidence Review workspace is required.");
    return finish(base, {
      currentStage: "evidence-review",
      overallState: "paused",
      blocker: {
        code: "NO_ELIGIBLE_JOB_EVIDENCE",
        stage: "evidence-review",
        message: "The pinned Evidence Snapshot contains no reviewed, public-safe, resume-ready evidence eligible for Job Mapping.",
      },
      humanActionRequired: reviewGate?.pendingClaimCount
        ? `Complete ${reviewGate.pendingClaimCount} canonical claim-review JSON template(s).`
        : reviewGate && reviewGate.status !== "current"
          ? "Explicitly rebuild the stale or invalid controlled Evidence Review workspace."
          : "Create or refresh the controlled Evidence Review workspace without changing evidence truth.",
      nextCommand: reviewGate?.pendingClaimCount
        ? `prooflayer job continue ${targetId}`
        : reviewGate && reviewGate.status !== "current"
          ? `prooflayer job run ${targetId} --rebuild-stale`
          : `prooflayer job run ${targetId}`,
    });
  }
  setStage(stages, "evidence-review", "current",
    "No Evidence Review gate blocks this snapshot; eligible Job evidence is available.");

  const mapping = await getJobEvidenceMapStatus(workspace, targetId);
  let mappingStatus = mapping.status;
  let mappingReasons = mapping.reasons;
  if (mapping.status === "current") {
    const storedMap = await showJobEvidenceMap(workspace, targetId);
    if (storedMap.input.requirementModelType !== requirementSource) {
      mappingStatus = "stale";
      mappingReasons = [
        `Current Evidence Map uses ${storedMap.input.requirementModelType} requirements; ${requirementSource} was requested.`,
      ];
    }
  }
  setLifecycleStage(stages, "evidence-mapping", mappingStatus, mappingReasons,
    "Evidence Map is current and uses only the pinned snapshot.");
  if (mappingStatus !== "current") {
    return stopForLifecycle(base, "evidence-mapping", mappingStatus, mappingReasons);
  }

  const coverage = await getJobCoverageStatus(workspace, targetId);
  setLifecycleStage(stages, "coverage", coverage.status, coverage.reasons,
    "Requirement Coverage is current.");
  if (coverage.status !== "current") {
    return stopForLifecycle(base, "coverage", coverage.status, coverage.reasons);
  }

  const assessment = await getJobFitProofAssessmentStatus(workspace, targetId);
  setLifecycleStage(stages, "assessment", assessment.status, assessment.reasons,
    "Fit and Proof Assessment is current and qualitative.");
  if (assessment.status !== "current") {
    return stopForLifecycle(base, "assessment", assessment.status, assessment.reasons);
  }

  const planning = await getJobResumePlanStatus(workspace, targetId);
  setLifecycleStage(stages, "planning", planning.status, planning.reasons,
    "Job Resume Content Plan is current.");
  if (planning.status !== "current") {
    return stopForLifecycle(base, "planning", planning.status, planning.reasons);
  }
  const plan = await showJobResumePlan(workspace, targetId);
  if (!plan.completeness.usableForDrafting) {
    setStage(stages, "planning", "current",
      `Plan is ${plan.completeness.status} but is not usable for drafting.`);
    setStage(stages, "evidence-review", "human-action-required",
      reviewGate?.status === "current"
        ? `${reviewGate.pendingClaimCount} selected claim review(s) remain pending.`
        : "Additional controlled Evidence Review is required before drafting can proceed.");
    return finish(base, {
      currentStage: "evidence-review",
      overallState: "paused",
      blocker: {
        code: "PLAN_NOT_USABLE_FOR_DRAFTING",
        stage: "planning",
        message: "The current plan preserves evidence gaps and is not usable for drafting.",
      },
      humanActionRequired: reviewGate?.pendingClaimCount
        ? `Complete ${reviewGate.pendingClaimCount} canonical claim review(s).`
        : "Review eligible evidence and planning constraints through the controlled Evidence Review workflow.",
      nextCommand: `prooflayer job continue ${targetId}`,
    });
  }

  const scaffold = await getJobResumeDraftScaffoldStatus(workspace, targetId);
  setLifecycleStage(stages, "scaffold", scaffold.status, scaffold.reasons,
    "Prose-free draft scaffold is current.");
  if (scaffold.status !== "current") {
    return stopForLifecycle(base, "scaffold", scaffold.status, scaffold.reasons);
  }

  const proposal = await currentProposal(workspace, targetId);
  if (!proposal) {
    setStage(stages, "draft-proposal", "missing", "No current draft proposal exists.");
    return finish(base, {
      currentStage: "draft-proposal",
      overallState: "ready-to-continue",
      nextCommand: `prooflayer job run ${targetId}`,
    });
  }
  base.currentProposalId = proposal.proposalId;
  setStage(stages, "draft-proposal", proposal.status, proposal.readyForReview
    ? "Untrusted proposal is current and ready for human review."
    : "Proposal is not eligible for human review.", proposal.reasons);
  if (proposal.status !== "current" || !proposal.readyForReview) {
    return finish(base, {
      currentStage: "draft-proposal",
      overallState: proposal.status === "invalid" ? "invalid" : "blocked",
      blocker: {
        code: "DRAFT_PROPOSAL_NOT_REVIEWABLE",
        stage: "draft-proposal",
        message: proposal.reasons.join(" ") || "The current proposal failed strict validation.",
      },
      nextCommand: `prooflayer target job-resume-draft-proposal status ${proposal.proposalId}`,
    });
  }

  const review = await getJobResumeDraftReviewStatus(workspace, proposal.proposalId);
  if (review.status === "missing") {
    setStage(stages, "draft-review", "missing", "A human review workspace has not been initialized.");
    return finish(base, {
      currentStage: "draft-review",
      overallState: "ready-to-continue",
      nextCommand: `prooflayer job continue ${targetId}`,
    });
  }
  base.currentReviewId = review.reviewId;
  if (review.status === "in-progress") {
    setStage(stages, "draft-review", "human-action-required",
      `${review.unresolvedCount} draft review decision(s) remain unresolved.`);
    return finish(base, {
      currentStage: "draft-review",
      overallState: "paused",
      humanActionRequired: `Complete ${review.unresolvedCount} accept, edit, or reject decision(s).`,
      blocker: {
        code: "DRAFT_REVIEW_REQUIRED",
        stage: "draft-review",
        message: "Model-authored or human-edited prose cannot be approved without completed human review.",
      },
      nextCommand: `prooflayer job continue ${targetId}`,
    });
  }
  if (review.status !== "completed") {
    setStage(stages, "draft-review", review.status === "stale" ? "stale" : "invalid",
      "Draft review is not current.", review.reasons);
    return stopForLifecycle(base, "draft-review",
      review.status === "stale" ? "stale" : "invalid", review.reasons);
  }
  setStage(stages, "draft-review", "current", "Human review is complete.");

  const approved = await getApprovedJobResumeDraftStatus(workspace, targetId);
  setLifecycleStage(stages, "approved-draft", approved.status, approved.reasons,
    approved.usableForRendering
      ? "Approved structured draft is current and usable for rendering."
      : "Approved structured draft is not usable for rendering.");
  if (approved.status === "missing") {
    return finish(base, {
      currentStage: "approved-draft",
      overallState: "ready-to-continue",
      nextCommand: `prooflayer job continue ${targetId}`,
    });
  }
  if (approved.status !== "current" || !approved.usableForRendering) {
    return stopForLifecycle(base, "approved-draft", approved.status, approved.reasons);
  }

  const renderOptions = options.renderOptions ?? {};
  const composition = await getJobResumeRenderDocumentStatus(
    workspace,
    targetId,
    normalizeRoleResumeRenderOptions(renderOptions),
  );
  setLifecycleStage(stages, "composition", composition.status, composition.reasons,
    "Canonical render document is current.");
  if (composition.status !== "current") {
    return finish(base, {
      currentStage: "composition",
      overallState: "ready-to-finalize",
      nextCommand: `prooflayer job finalize ${targetId}`,
      ...(composition.status === "stale" || composition.status === "invalid"
        ? {
            blocker: {
              code: "RENDER_REBUILD_REQUIRED",
              stage: "composition" as const,
              message: "Canonical rendering is stale or invalid and requires explicit --rebuild-stale.",
            },
            nextCommand: `prooflayer job finalize ${targetId} --rebuild-stale`,
          }
        : {}),
    });
  }

  const exportManifests = await listJobResumeExports(workspace, targetId);
  const exportStatuses = await Promise.all(exportManifests.map((entry) =>
    getJobResumeExportStatus(workspace, entry.exportId)));
  const currentExportFormats = [...new Set(exportStatuses
    .filter((entry) => entry.status === "current" && entry.format)
    .map((entry) => entry.format!))].sort();
  base.currentExportFormats = currentExportFormats;
  const defaultExportsCurrent = DEFAULT_FINAL_FORMATS.every((format) =>
    currentExportFormats.includes(format));
  setStage(stages, "export", defaultExportsCurrent ? "current" : "missing",
    defaultExportsCurrent
      ? "Default Markdown, HTML, and DOCX exports are current."
      : "One or more default exports are missing or not current.");
  return finish(base, {
    currentStage: "export",
    overallState: defaultExportsCurrent ? "complete" : "ready-to-finalize",
    nextCommand: defaultExportsCurrent
      ? `prooflayer job status ${targetId}`
      : `prooflayer job finalize ${targetId}`,
  });
}

export async function runJobWorkflow(
  workspace: string,
  targetId: string,
  options: RunJobWorkflowOptions = {},
): Promise<JobWorkflowRunResult> {
  return orchestrateJobWorkflow(workspace, targetId, "run", options);
}

export async function continueJobWorkflow(
  workspace: string,
  targetId: string,
  options: RunJobWorkflowOptions = {},
): Promise<JobWorkflowRunResult> {
  return orchestrateJobWorkflow(workspace, targetId, "continue", options);
}

async function orchestrateJobWorkflow(
  workspace: string,
  targetId: string,
  mode: "run" | "continue",
  options: RunJobWorkflowOptions,
): Promise<JobWorkflowRunResult> {
  if (options.snapshotId && options.upgradeSnapshotId) {
    throw new Error("Choose either --snapshot or --upgrade-snapshot, not both.");
  }
  if (mode === "run" && options.upgradeSnapshotId) {
    throw new Error("Snapshot upgrades are continuation actions. Use prooflayer job continue --upgrade-snapshot.");
  }
  const requirementSource = options.requirementSource ?? "deterministic";
  const transitions: JobWorkflowStageResult[] = [];
  await requireJobTarget(workspace, targetId);

  if (options.snapshotId) {
    const currentPin = await getTargetEvidencePinStatus(workspace, targetId);
    if (
      currentPin.status !== "missing"
      && currentPin.snapshotId
      && currentPin.snapshotId !== options.snapshotId
    ) {
      const status = await inspectJobWorkflow(workspace, targetId, { requirementSource });
      status.overallState = "paused";
      status.blocker = {
        code: "EXPLICIT_SNAPSHOT_UPGRADE_REQUIRED",
        stage: "evidence-pin",
        message: `Target is already pinned to ${currentPin.snapshotId}; it was not changed.`,
      };
      status.humanActionRequired = "Use an explicit snapshot upgrade after verifying the replacement snapshot.";
      status.nextCommand = mode === "continue"
        ? `prooflayer job continue ${targetId} --upgrade-snapshot ${options.snapshotId}`
        : `prooflayer target evidence-upgrade ${targetId} --snapshot ${options.snapshotId}`;
      return {
        mode,
        dryRun: options.dryRun ?? false,
        status,
        stageResults: summarizeStageResults(status, [{
          stage: "evidence-pin",
          result: "paused",
          detail: "Existing Evidence Snapshot pin was preserved.",
        }]),
      };
    }
  }

  if (options.dryRun) {
    const status = await inspectJobWorkflow(workspace, targetId, { requirementSource });
    const results = dryRunResults(status, options);
    if (options.upgradeSnapshotId) {
      results.unshift({
        stage: "evidence-pin",
        result: "skipped",
        detail: `Dry run: the target pin would be explicitly upgraded to ${options.upgradeSnapshotId}.`,
      });
    }
    return {
      mode,
      dryRun: true,
      status,
      stageResults: results,
    };
  }

  if (options.upgradeSnapshotId) {
    const pinStatus = await getTargetEvidencePinStatus(workspace, targetId);
    if (pinStatus.status !== "current") {
      const status = await inspectJobWorkflow(workspace, targetId, { requirementSource });
      return resultForPause(mode, status, transitions,
        `Snapshot upgrade requires a current existing pin; current pin status is ${pinStatus.status}.`);
    }
    const upgraded = await upgradeTargetEvidenceSnapshot(
      workspace,
      targetId,
      options.upgradeSnapshotId,
    );
    transitions.push({
      stage: "evidence-pin",
      result: upgraded.result === "already-current" ? "reused" : "rebuilt",
      detail: upgraded.result === "already-current"
        ? `Snapshot ${upgraded.snapshotId} was already pinned.`
        : `Explicitly upgraded the target pin to ${upgraded.snapshotId}.`,
    });
  }

  for (let iteration = 0; iteration < JOB_WORKFLOW_STAGES.length * 2; iteration += 1) {
    const status = await inspectJobWorkflow(workspace, targetId, { requirementSource });
    if (["complete", "ready-to-finalize"].includes(status.overallState)) {
      return completeRunResult(mode, status, transitions);
    }

    const stageState = stageByName(status, status.currentStage);
    if (status.currentStage === "analysis") {
      if (!canBuildLifecycle(stageState, options.rebuildStale)) {
        return completeRunResult(mode, status, transitions);
      }
      const built = await analyzeTarget(workspace, targetId, {
        rebuild: stageState.status !== "missing",
      });
      transitions.push({
        stage: "analysis",
        result: built.result === "already-current" ? "reused" : built.result === "created" ? "built" : "rebuilt",
        detail: `Structural analysis ${built.result}.`,
      });
      continue;
    }

    if (status.currentStage === "requirements") {
      if (requirementSource === "approved") {
        return completeRunResult(mode, status, transitions);
      }
      if (!canBuildLifecycle(stageState, options.rebuildStale)) {
        return completeRunResult(mode, status, transitions);
      }
      const built = await buildJobRequirements(workspace, targetId, {
        rebuild: stageState.status !== "missing",
      });
      transitions.push({
        stage: "requirements",
        result: built.result === "already-current" ? "reused" : built.result === "created" ? "built" : "rebuilt",
        detail: `Deterministic requirement model ${built.result}.`,
      });
      continue;
    }

    if (status.currentStage === "evidence-pin") {
      if (!options.snapshotId) return completeRunResult(mode, status, transitions);
      const currentPin = await getTargetEvidencePinStatus(workspace, targetId);
      if (currentPin.status === "current" && currentPin.snapshotId !== options.snapshotId) {
        status.blocker = {
          code: "EXPLICIT_SNAPSHOT_UPGRADE_REQUIRED",
          stage: "evidence-pin",
          message: `Target is already pinned to ${currentPin.snapshotId}; it was not changed.`,
        };
        status.nextCommand = `prooflayer target evidence-upgrade ${targetId} --snapshot ${options.snapshotId}`;
        return completeRunResult(mode, status, transitions);
      }
      const pinned = await pinTargetEvidenceSnapshot(workspace, targetId, options.snapshotId);
      transitions.push({
        stage: "evidence-pin",
        result: pinned.result === "already-current" ? "reused" : "built",
        detail: `Explicitly pinned Evidence Snapshot ${pinned.snapshotId}.`,
      });
      continue;
    }

    if (status.currentStage === "evidence-review") {
      const pinned = await loadTargetEvidencePin(workspace, targetId);
      if (pinned.snapshot.snapshot.completeness.claimCount === 0) {
        status.overallState = "paused";
        status.blocker = {
          code: "NO_EVIDENCE_CLAIMS_AVAILABLE",
          stage: "evidence-review",
          message: "The pinned Evidence Snapshot contains no claims that can be organized for review.",
        };
        status.humanActionRequired = "Refresh the Evidence Foundation before creating a new immutable snapshot.";
        status.nextCommand = "prooflayer refresh";
        return completeRunResult(mode, status, transitions);
      }
      const review = await ensureReviewWorkspace(
        workspace,
        targetId,
        options.rebuildStale ?? false,
        transitions,
      );
      const refreshed = await inspectJobWorkflow(workspace, targetId, { requirementSource });
      if (review.pendingClaimCount > 0) {
        return completeRunResult(mode, refreshed, transitions);
      }
      if (mode === "continue") {
        const pin = await loadTargetEvidencePin(workspace, targetId);
        const calculated = await calculateEvidenceFoundationSnapshot(workspace);
        if (calculated.id !== pin.snapshot.snapshot.id) {
          const built = await buildEvidenceSnapshot(workspace);
          transitions.push({
            stage: "evidence-snapshot",
            result: built.result === "created" ? "built" : "reused",
            detail: `Built immutable Evidence Snapshot ${built.snapshotId}; target pin was not changed.`,
          });
          refreshed.currentStage = "evidence-snapshot";
          refreshed.overallState = "paused";
          refreshed.blocker = {
            code: "EXPLICIT_SNAPSHOT_UPGRADE_REQUIRED",
            stage: "evidence-snapshot",
            message: "Completed reviews produced a different immutable snapshot; explicit target upgrade is required.",
          };
          refreshed.humanActionRequired = "Confirm the exact snapshot ID before replacing the target pin.";
          refreshed.nextCommand = `prooflayer job continue ${targetId} --upgrade-snapshot ${built.snapshotId}`;
          return completeRunResult(mode, refreshed, transitions);
        }
      }
      return completeRunResult(mode, refreshed, transitions);
    }

    if (status.currentStage === "evidence-mapping") {
      if (!canBuildLifecycle(stageState, options.rebuildStale)) {
        return completeRunResult(mode, status, transitions);
      }
      const built = await buildJobEvidenceMap(workspace, targetId, {
        rebuild: stageState.status !== "missing",
        requirementSource,
      });
      transitions.push({
        stage: "evidence-mapping",
        result: built.result === "already-current" ? "reused" : built.result === "created" ? "built" : "rebuilt",
        detail: `Job Evidence Map ${built.result}.`,
      });
      continue;
    }

    if (status.currentStage === "coverage") {
      if (!canBuildLifecycle(stageState, options.rebuildStale)) {
        return completeRunResult(mode, status, transitions);
      }
      const built = await buildJobCoverage(workspace, targetId, {
        rebuild: stageState.status !== "missing",
      });
      transitions.push(stageBuildResult("coverage", built.result, "Requirement Coverage"));
      continue;
    }

    if (status.currentStage === "assessment") {
      if (!canBuildLifecycle(stageState, options.rebuildStale)) {
        return completeRunResult(mode, status, transitions);
      }
      const built = await buildJobFitProofAssessment(workspace, targetId, {
        rebuild: stageState.status !== "missing",
      });
      transitions.push(stageBuildResult("assessment", built.result, "Fit and Proof Assessment"));
      continue;
    }

    if (status.currentStage === "planning") {
      if (!canBuildLifecycle(stageState, options.rebuildStale)) {
        return completeRunResult(mode, status, transitions);
      }
      const built = await buildJobResumePlan(workspace, targetId, {
        rebuild: stageState.status !== "missing",
      });
      transitions.push(stageBuildResult("planning", built.result, "Resume Content Plan"));
      continue;
    }

    if (status.currentStage === "scaffold") {
      if (!canBuildLifecycle(stageState, options.rebuildStale)) {
        return completeRunResult(mode, status, transitions);
      }
      const built = await buildJobResumeDraftScaffold(workspace, targetId, {
        rebuild: stageState.status !== "missing",
      });
      transitions.push(stageBuildResult("scaffold", built.result, "Draft Scaffold"));
      continue;
    }

    if (status.currentStage === "draft-proposal") {
      if (stageState.status !== "missing") {
        return completeRunResult(mode, status, transitions);
      }
      const provider = resolveGuidedProvider(options);
      if (!provider.provider) {
        status.overallState = "paused";
        status.blocker = {
          code: "MODEL_PROVIDER_REQUIRED",
          stage: "draft-proposal",
          message: provider.error ?? "A configured model provider is required for proposal generation.",
        };
        status.humanActionRequired = "Configure an explicit provider, or use a configured fake provider with --offline.";
        status.nextCommand = `prooflayer job continue ${targetId} --provider <configured-provider-name>`;
        return completeRunResult(mode, status, transitions);
      }
      const generated = await generateJobResumeDraftProposal(workspace, targetId, {
        provider: provider.provider,
      });
      transitions.push({
        stage: "draft-proposal",
        result: generated.result === "cache-hit" ? "reused" : generated.result === "created" ? "built" : "failed",
        detail: `Draft proposal ${generated.result}; no wording was approved.`,
      });
      if (generated.result === "validation-failed") {
        const failedStatus = await inspectJobWorkflow(workspace, targetId, { requirementSource });
        return completeRunResult(mode, failedStatus, transitions);
      }
      const review = await initializeJobResumeDraftReview(workspace, generated.proposalId);
      transitions.push({
        stage: "draft-review",
        result: "built",
        detail: `Initialized pending human review ${review.id}; no decision was completed automatically.`,
      });
      const paused = await inspectJobWorkflow(workspace, targetId, { requirementSource });
      return completeRunResult(mode, paused, transitions);
    }

    if (status.currentStage === "draft-review") {
      const proposalId = status.currentProposalId;
      if (!proposalId) return completeRunResult(mode, status, transitions);
      const review = await getJobResumeDraftReviewStatus(workspace, proposalId);
      if (review.status === "missing") {
        const initialized = await initializeJobResumeDraftReview(workspace, proposalId);
        transitions.push({
          stage: "draft-review",
          result: "built",
          detail: `Initialized pending human review ${initialized.id}; no decision was completed automatically.`,
        });
        return completeRunResult(
          mode,
          await inspectJobWorkflow(workspace, targetId, { requirementSource }),
          transitions,
        );
      }
      return completeRunResult(mode, status, transitions);
    }

    if (status.currentStage === "approved-draft") {
      if (mode !== "continue") return completeRunResult(mode, status, transitions);
      const approved = await getApprovedJobResumeDraftStatus(workspace, targetId);
      if (!["missing", "stale", "invalid"].includes(approved.status)) {
        return completeRunResult(mode, status, transitions);
      }
      if (approved.status !== "missing" && !options.rebuildStale) {
        return completeRunResult(mode, status, transitions);
      }
      const result = await approveJobResumeDraft(workspace, targetId, {
        rebuild: approved.status !== "missing",
      });
      transitions.push({
        stage: "approved-draft",
        result: result.result === "already-current" ? "reused" : result.result === "created" ? "built" : "rebuilt",
        detail: `${result.result}; deterministic approval made no model call.`,
      });
      return completeRunResult(
        mode,
        await inspectJobWorkflow(workspace, targetId, { requirementSource }),
        transitions,
      );
    }

    return completeRunResult(mode, status, transitions);
  }
  throw new Error("Guided Job workflow exceeded the bounded stage transition count.");
}

export async function finalizeJobWorkflow(
  workspace: string,
  targetId: string,
  options: FinalizeJobWorkflowOptions = {},
): Promise<FinalizeJobWorkflowResult> {
  const renderOptions: JobResumeRenderOptions = {
    profile: options.profile,
    pageSize: options.pageSize,
    dateFormat: options.dateFormat,
    rebuild: options.rebuildStale,
  };
  const before = await inspectJobWorkflow(workspace, targetId, { renderOptions });
  const approved = await getApprovedJobResumeDraftStatus(workspace, targetId);
  if (approved.status !== "current" || !approved.usableForRendering) {
    return {
      dryRun: options.dryRun ?? false,
      status: before,
      result: "paused",
      succeeded: [],
      failed: [],
      stageResults: summarizeStageResults(before, []),
    };
  }
  const formats = uniqueFormats(options.formats ?? DEFAULT_FINAL_FORMATS);
  if (options.dryRun) {
    const stageResults = summarizeStageResults(before, [
      { stage: "composition", result: "skipped", detail: "Dry run: canonical composition would be created or reused." },
      ...formats.map((format): JobWorkflowStageResult => ({
        stage: "export",
        result: "skipped",
        detail: `Dry run: ${format} would be exported or reused.`,
      })),
    ]);
    return {
      dryRun: true,
      status: before,
      result: "paused",
      succeeded: [],
      failed: [],
      stageResults,
    };
  }

  const composition = await composeJobResumeRenderDocument(workspace, targetId, renderOptions);
  const succeeded: ExportJobResumeResult[] = [];
  const failed: Array<{ format: RoleResumeExportFormat; error: string }> = [];
  for (const format of formats) {
    try {
      succeeded.push(await exportJobResume(workspace, targetId, {
        ...renderOptions,
        format,
        outputDir: options.outputDir,
        toolchain: options.toolchain,
      }));
    } catch (error) {
      failed.push({ format, error: errorMessage(error) });
    }
  }
  const after = await inspectJobWorkflow(workspace, targetId, { renderOptions });
  const nonPdfFailure = failed.some((entry) => entry.format !== "pdf");
  const allCurrent = succeeded.length > 0 && succeeded.every((entry) => entry.result === "already-current");
  return {
    dryRun: false,
    status: after,
    result: failed.length > 0
      ? "partial-failure"
      : allCurrent && composition.result === "already-current"
        ? "already-current"
        : nonPdfFailure
          ? "paused"
          : "completed",
    compositionResult: composition.result,
    succeeded,
    failed,
    stageResults: summarizeStageResults(after, [
      {
        stage: "composition",
        result: composition.result === "already-current" ? "reused" : composition.result === "created" ? "built" : "rebuilt",
        detail: `Canonical composition ${composition.result}.`,
      },
      ...succeeded.map((entry): JobWorkflowStageResult => ({
        stage: "export",
        result: entry.result === "already-current" ? "reused" : entry.result === "created" ? "built" : "rebuilt",
        detail: `${entry.format} export ${entry.result}: ${entry.outputPath}`,
      })),
      ...failed.map((entry): JobWorkflowStageResult => ({
        stage: "export",
        result: "failed",
        detail: `${entry.format} export failed: ${entry.error}`,
      })),
    ]),
  };
}

export function formatGuidedJobCreation(result: TargetCreationResult): string {
  const target = result.target;
  if (target.type !== "job") throw new Error("Guided Job creation requires a Job Target result.");
  return [
    "Job Target created",
    "",
    target.title,
    ...(target.company ? [target.company] : []),
    ...(target.location ? [target.location] : []),
    ...(target.workingModel ? [capitalize(target.workingModel)] : []),
    "",
    "Target ID:",
    target.id,
    "",
    "Job Description:",
    result.persistedSourcePath ?? target.source.path,
    "",
    "Job Description SHA-256:",
    target.source.sha256,
    "",
    "Next:",
    `prooflayer job run ${target.id}`,
  ].join("\n");
}

export function formatJobWorkflowStatus(
  status: JobWorkflowStatus,
  options: { verbose?: boolean } = {},
): string {
  const lines = [
    "ProofLayer Job Workflow",
    "",
    status.target.title,
    ...(status.target.company ? [status.target.company] : []),
    ...(status.target.location ? [status.target.location] : []),
    ...(status.target.workingModel ? [capitalize(status.target.workingModel)] : []),
    "",
    "Current stage:",
    STAGE_LABELS[status.currentStage],
    "",
    "Overall state:",
    humanState(status.overallState),
  ];
  if (status.blocker) {
    lines.push("", "Why:", status.blocker.message);
  }
  if (status.humanActionRequired) {
    lines.push("", "Human action required:", status.humanActionRequired);
  }
  lines.push(
    "",
    "Evidence Snapshot:",
    status.evidenceSnapshot.snapshotId ?? "Not pinned",
    "",
    "Eligible Job evidence:",
    String(status.evidenceSnapshot.eligibleJobEvidenceCount),
  );
  if (status.reviewGate?.workspacePath) {
    lines.push(
      "",
      "Review workspace:",
      status.reviewGate.workspacePath,
      "",
      "Pending claims:",
      String(status.reviewGate.pendingClaimCount),
    );
  }
  if (!status.evidenceSnapshot.snapshotId && status.availableSnapshots.length > 0) {
    lines.push("", "Available Evidence Snapshots:");
    for (const snapshot of status.availableSnapshots) {
      lines.push(`- ${snapshot.snapshotId} | ${snapshot.status} | eligible Job evidence: ${snapshot.eligibleJobEvidenceCount ?? "unknown"}`);
    }
  }
  lines.push("", "Pipeline:");
  for (const stage of status.stages) {
    lines.push(`${stageMarker(stage.status)} ${stage.label}: ${stage.status}`);
    if (options.verbose) {
      lines.push(`  ${stage.detail}`);
      for (const reason of stage.reasons) lines.push(`  - ${reason}`);
    }
  }
  lines.push(
    "",
    "Next action:",
    status.nextCommand,
    "",
    "Internal references:",
    `- Target ID: ${status.target.id}`,
    `- Job Description SHA-256: ${status.target.jobDescriptionSha256}`,
    `- Requirement source: ${status.requirementSource}`,
  );
  return lines.join("\n");
}

export function formatJobWorkflowRunResult(result: JobWorkflowRunResult): string {
  const heading = result.dryRun ? "ProofLayer Job Workflow dry run" : "ProofLayer Job Workflow result";
  const transitions = result.stageResults.filter((entry) =>
    entry.result !== "reused" || result.dryRun);
  return [
    heading,
    "",
    formatJobWorkflowStatus(result.status),
    "",
    "Stage actions:",
    ...(transitions.length > 0
      ? transitions.map((entry) => `- ${STAGE_LABELS[entry.stage]}: ${entry.result} - ${entry.detail}`)
      : ["- No writes or stage transitions were required."]),
  ].join("\n");
}

export function formatFinalizeJobWorkflowResult(result: FinalizeJobWorkflowResult): string {
  const heading = result.dryRun
    ? "Job Resume finalization dry run"
    : result.result === "paused"
      ? "Job Resume finalization paused"
      : "Job Resume finalized";
  const lines = [
    heading,
    "",
    result.status.target.title,
    ...(result.status.target.company ? [result.status.target.company] : []),
    "",
    "Result:",
    result.result,
    "",
  ];
  for (const format of ["markdown", "html", "docx", "pdf"] as RoleResumeExportFormat[]) {
    const success = result.succeeded.find((entry) => entry.format === format);
    const failure = result.failed.find((entry) => entry.format === format);
    lines.push(`${capitalize(format)}:`);
    lines.push(success?.outputPath ?? (failure ? `Failed - ${failure.error}` : "Not requested"));
    lines.push("");
  }
  lines.push(
    "Validation:",
    result.result === "paused" || result.dryRun
      ? "Not run"
      : result.failed.some((entry) => entry.format !== "pdf")
        ? "Failed"
        : "Passed for every created artifact",
    "",
    "Next:",
    result.status.nextCommand,
  );
  return lines.join("\n");
}

export function formatJobWorkflowJson(value: unknown): string {
  return `${JSON.stringify(JSON.parse(stableJson(value)), null, 2)}\n`;
}

async function requireJobTarget(workspace: string, targetId: string): Promise<JobTarget> {
  const target = await showTarget(workspace, targetId);
  if (target.type !== "job") {
    throw new Error(`Guided Job workflow requires a Job Target; received ${target.type} target ${targetId}.`);
  }
  return target;
}

function baseStatus(
  target: JobTarget,
  requirementSource: JobRequirementInputType,
  availableSnapshots: EvidenceSnapshotListEntry[],
  stages: JobWorkflowStageState[],
): JobWorkflowStatus {
  return {
    schemaVersion: JOB_WORKFLOW_SCHEMA_VERSION,
    target: {
      id: target.id,
      type: "job",
      title: target.title,
      ...(target.company ? { company: target.company } : {}),
      ...(target.location ? { location: target.location } : {}),
      ...(target.workingModel ? { workingModel: target.workingModel } : {}),
      jobDescriptionPath: `targets/jobs/${target.id}/job-description.md`,
      jobDescriptionSha256: target.source.sha256,
    },
    requirementSource,
    currentStage: "target",
    overallState: "not-started",
    nextCommand: `prooflayer job run ${target.id}`,
    evidenceSnapshot: {
      status: "missing",
      eligibleJobEvidenceCount: 0,
    },
    availableSnapshots,
    currentExportFormats: [],
    stages,
  };
}

function finish(
  status: JobWorkflowStatus,
  update: Partial<JobWorkflowStatus> & Pick<JobWorkflowStatus, "currentStage" | "overallState" | "nextCommand">,
): JobWorkflowStatus {
  return { ...status, ...update };
}

function stopForLifecycle(
  status: JobWorkflowStatus,
  stage: JobWorkflowStage,
  lifecycle: string,
  reasons: string[],
): JobWorkflowStatus {
  const missing = lifecycle === "missing";
  const rebuildable = lifecycle === "stale" || lifecycle === "invalid";
  return finish(status, {
    currentStage: stage,
    overallState: missing ? (stage === "analysis" ? "not-started" : "ready-to-continue")
      : lifecycle === "invalid" ? "invalid" : "blocked",
    ...(missing ? {} : {
      blocker: {
        code: `${stage.toUpperCase().replaceAll("-", "_")}_${lifecycle.toUpperCase()}`,
        stage,
        message: reasons.join(" ") || `${STAGE_LABELS[stage]} is ${lifecycle}.`,
      },
    }),
    nextCommand: rebuildable
      ? `prooflayer job run ${status.target.id} --rebuild-stale`
      : `prooflayer job run ${status.target.id}`,
  });
}

function blankStages(): JobWorkflowStageState[] {
  return JOB_WORKFLOW_STAGES.map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    status: "blocked",
    detail: "Waiting for an earlier stage.",
    reasons: [],
  }));
}

function setStage(
  stages: JobWorkflowStageState[],
  stage: JobWorkflowStage,
  status: JobWorkflowStageStatus,
  detail: string,
  reasons: string[] = [],
): void {
  const entry = stages.find((candidate) => candidate.stage === stage);
  if (!entry) throw new Error(`Unknown Job workflow stage: ${stage}`);
  entry.status = status;
  entry.detail = detail;
  entry.reasons = [...reasons];
}

function setLifecycleStage(
  stages: JobWorkflowStageState[],
  stage: JobWorkflowStage,
  status: "missing" | "current" | "stale" | "invalid" | "incompatible" | string,
  reasons: string[],
  currentDetail: string,
): void {
  const normalized = ["missing", "current", "stale", "invalid", "incompatible"].includes(status)
    ? status as JobWorkflowStageStatus
    : "invalid";
  setStage(stages, stage, normalized, normalized === "current"
    ? currentDetail
    : reasons.join(" ") || `${STAGE_LABELS[stage]} is ${normalized}.`, reasons);
}

function stageByName(status: JobWorkflowStatus, stage: JobWorkflowStage): JobWorkflowStageState {
  const value = status.stages.find((entry) => entry.stage === stage);
  if (!value) throw new Error(`Workflow status omitted stage ${stage}.`);
  return value;
}

function canBuildLifecycle(stage: JobWorkflowStageState, rebuildStale = false): boolean {
  if (stage.status === "missing") return true;
  return rebuildStale && (stage.status === "stale" || stage.status === "invalid");
}

async function inspectReviewGate(
  workspace: string,
  targetId: string,
): Promise<ReviewContext | undefined> {
  const statuses = (await listEvidenceReviewBatches(workspace))
    .filter((entry) => entry.targetId === targetId);
  if (statuses.length === 0) return undefined;
  const batches = await Promise.all(statuses.map(async (status) => ({
    status,
    batch: status.status === "current"
      ? await showEvidenceReviewBatch(workspace, status.batchId)
      : undefined,
  })));
  batches.sort((left, right) => {
    const count = (right.batch?.controlledReviewSubsetClaimIds.length ?? 0)
      - (left.batch?.controlledReviewSubsetClaimIds.length ?? 0);
    return count || left.status.batchId.localeCompare(right.status.batchId);
  });
  const selected = batches[0]!;
  const claimIds = selected.batch?.controlledReviewSubsetClaimIds ?? [];
  const reviewEntries = await listEvidenceClaimReviews(workspace);
  const effectiveByClaim = new Map(reviewEntries.map((entry) => [entry.claimId, entry]));
  const pendingClaimCount = claimIds.filter((claimId) =>
    effectiveByClaim.get(claimId)?.status !== "current").length;
  const workspaceStatus = selected.status.status === "current"
    ? await getEvidenceReviewWorkspaceStatus(workspace, selected.status.batchId)
    : undefined;
  return {
    batchId: selected.status.batchId,
    batchTargetId: selected.status.targetId,
    workspacePath: workspaceStatus?.indexPath,
    selectedClaimCount: claimIds.length,
    pendingClaimCount,
    status: selected.status.status,
  };
}

async function ensureReviewWorkspace(
  workspace: string,
  targetId: string,
  rebuildStale: boolean,
  transitions: JobWorkflowStageResult[],
): Promise<ReviewContext> {
  let context = await inspectReviewGate(workspace, targetId);
  if (!context || context.status !== "current") {
    if (context && !rebuildStale) {
      return context;
    }
    const batch = await buildEvidenceReviewBatch(workspace, targetId, {
      rebuild: Boolean(context && context.status !== "current"),
    });
    transitions.push({
      stage: "evidence-review",
      result: batch.result === "already-current" ? "reused" : batch.result === "created" ? "built" : "rebuilt",
      detail: `Controlled review batch ${batch.result}; no claim decision was created.`,
    });
    context = await inspectReviewGate(workspace, targetId);
  }
  if (!context?.batchId) throw new Error("Evidence Review batch creation did not produce an inspectable batch.");
  const workspaceStatus = await getEvidenceReviewWorkspaceStatus(workspace, context.batchId);
  if (workspaceStatus.status !== "current") {
    if (["stale", "invalid"].includes(workspaceStatus.status) && !rebuildStale) {
      return { ...context, status: workspaceStatus.status };
    }
    const rendered = await renderEvidenceReviewWorkspace(workspace, context.batchId, {
      rebuild: workspaceStatus.status !== "missing",
    });
    transitions.push({
      stage: "evidence-review",
      result: rendered.result === "already-current" ? "reused" : rendered.result === "created" ? "built" : "rebuilt",
      detail: `Human-readable review workspace ${rendered.result}; no claim decision was created.`,
    });
  }
  return (await inspectReviewGate(workspace, targetId))!;
}

async function currentProposal(workspace: string, targetId: string) {
  const proposals = await listJobResumeDraftProposals(workspace, targetId);
  for (const proposal of [...proposals].reverse()) {
    const status = await getJobResumeDraftProposalStatus(workspace, proposal.id);
    if (status.status === "current") return status;
  }
  if (proposals.length === 0) return undefined;
  return getJobResumeDraftProposalStatus(workspace, proposals.at(-1)!.id);
}

function resolveGuidedProvider(options: RunJobWorkflowOptions): {
  provider?: InterpretationModelProvider;
  error?: string;
} {
  if (options.provider) return { provider: options.provider };
  try {
    const configuration = loadModelProviderConfiguration(options.environment ?? process.env);
    if (options.offline && configuration.providerId !== "fake") {
      return { error: "--offline requires an explicitly configured fake provider." };
    }
    if (!options.offline && configuration.providerId === "fake") {
      return { error: "A fake provider is configured; pass --offline explicitly to permit it." };
    }
    if (options.providerName && configuration.providerId !== options.providerName) {
      return {
        error: `Configured provider is ${configuration.providerId}, not ${options.providerName}.`,
      };
    }
    return { provider: createModelProvider(configuration) };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

function dryRunResults(
  status: JobWorkflowStatus,
  options: RunJobWorkflowOptions,
): JobWorkflowStageResult[] {
  return status.stages.map((stage) => {
    if (stage.status === "current") {
      return { stage: stage.stage, result: "reused", detail: "Dry run: current artifact would be reused." };
    }
    if (stage.stage === status.currentStage && stage.status === "human-action-required") {
      return { stage: stage.stage, result: "paused", detail: `Dry run: ${stage.detail}` };
    }
    if (stage.stage === status.currentStage && stage.status === "missing") {
      const explicitSnapshot = stage.stage === "evidence-pin" && options.snapshotId;
      return {
        stage: stage.stage,
        result: "skipped",
        detail: explicitSnapshot
          ? `Dry run: snapshot ${options.snapshotId} would be pinned explicitly.`
          : `Dry run: ${STAGE_LABELS[stage.stage]} would be built if its dependencies permit it.`,
      };
    }
    if (stage.stage === status.currentStage && ["stale", "invalid"].includes(stage.status)) {
      return {
        stage: stage.stage,
        result: options.rebuildStale ? "skipped" : "paused",
        detail: options.rebuildStale
          ? `Dry run: ${STAGE_LABELS[stage.stage]} would be rebuilt explicitly.`
          : `Dry run: ${STAGE_LABELS[stage.stage]} requires --rebuild-stale.`,
      };
    }
    return { stage: stage.stage, result: "skipped", detail: "Dry run: waiting for an earlier stage." };
  });
}

function stageBuildResult(
  stage: JobWorkflowStage,
  result: "created" | "rebuilt" | "already-current",
  label: string,
): JobWorkflowStageResult {
  return {
    stage,
    result: result === "already-current" ? "reused" : result === "created" ? "built" : "rebuilt",
    detail: `${label} ${result}.`,
  };
}

function completeRunResult(
  mode: "run" | "continue",
  status: JobWorkflowStatus,
  transitions: JobWorkflowStageResult[],
): JobWorkflowRunResult {
  return {
    mode,
    dryRun: false,
    status,
    stageResults: summarizeStageResults(status, transitions),
  };
}

function resultForPause(
  mode: "run" | "continue",
  status: JobWorkflowStatus,
  transitions: JobWorkflowStageResult[],
  message: string,
): JobWorkflowRunResult {
  status.overallState = "blocked";
  status.blocker = {
    code: "GUIDED_WORKFLOW_BLOCKED",
    stage: status.currentStage,
    message,
  };
  return completeRunResult(mode, status, transitions);
}

function summarizeStageResults(
  status: JobWorkflowStatus,
  transitions: JobWorkflowStageResult[],
): JobWorkflowStageResult[] {
  const byStage = new Map<JobWorkflowStage, JobWorkflowStageResult[]>();
  for (const transition of transitions) {
    const values = byStage.get(transition.stage) ?? [];
    values.push(transition);
    byStage.set(transition.stage, values);
  }
  return status.stages.flatMap((stage) => {
    const explicit = byStage.get(stage.stage);
    if (explicit?.length) return explicit;
    if (stage.status === "current") {
      return [{ stage: stage.stage, result: "reused" as const, detail: stage.detail }];
    }
    if (stage.status === "human-action-required") {
      return [{ stage: stage.stage, result: "paused" as const, detail: stage.detail }];
    }
    if (["stale", "invalid", "incompatible"].includes(stage.status)) {
      return [{ stage: stage.stage, result: "paused" as const, detail: stage.detail }];
    }
    return [{ stage: stage.stage, result: "skipped" as const, detail: stage.detail }];
  });
}

function uniqueFormats(formats: RoleResumeExportFormat[]): RoleResumeExportFormat[] {
  return [...new Set(formats)];
}

function stageMarker(status: JobWorkflowStageStatus): string {
  if (status === "current") return "[x]";
  if (status === "human-action-required") return "[pause]";
  if (["stale", "invalid", "incompatible"].includes(status)) return "[!]";
  if (status === "blocked") return "[-]";
  return "[ ]";
}

function humanState(state: JobWorkflowState): string {
  return state.split("-").map(capitalize).join(" ");
}

function capitalize(value: string): string {
  return value.length ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
