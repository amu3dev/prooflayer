#!/usr/bin/env node
import { Command } from "commander";
import { readFile } from "node:fs/promises";
import {
  auditPrivacy,
  buildProfile,
  generateClaims,
  ingestSources,
  initWorkspace,
  normalizeEvidence,
  resolveWorkspace
} from "./operations.js";
import {
  formatChangesSummary,
  formatStatusSummary,
  getLatestChanges,
  getWorkspaceStatus,
  refreshWorkspace
} from "./update-impact.js";
import { isRoleKey } from "./role-variants.js";
import {
  formatVariantsSummary,
  generateAllRoleVariants,
  generateRoleVariant,
  listVariantStatuses
} from "./variant-generator.js";
import {
  finalizeVariant,
  formatVariantReviewStatus,
  getVariantReviewStatus,
  initializeVariantReview
} from "./variant-review.js";
import {
  formatPublicProfileSummary,
  initializePublicProfile,
  loadPublicProfile
} from "./public-profile.js";
import {
  exportFinalResume,
  formatResumeExportStatus,
  getResumeExportStatus
} from "./resume-export.js";
import {
  createJobTarget,
  createRoleTarget,
  formatTargetCreation,
  formatTargetJson,
  formatTargetList,
  listTargets,
  showTarget
} from "./targets.js";
import {
  buildEvidenceSnapshot,
  formatEvidenceSnapshotBuild,
  formatEvidenceSnapshotList,
  formatEvidenceSnapshotStatus,
  getEvidenceSnapshotStatus,
  listEvidenceSnapshots,
  loadEvidenceSnapshot,
  validateEvidenceSnapshot,
} from "./evidence-snapshots.js";
import {
  createEvidenceClaimReview,
  formatEvidenceClaimReviewList,
  formatEvidenceClaimReviewResult,
  formatEvidenceClaimReviewStatus,
  getEvidenceClaimReviewStatus,
  listEvidenceClaimReviews,
  readEvidenceClaimReviewInputFile,
  showEvidenceClaimReview,
} from "./evidence-claim-review.js";
import {
  buildEvidenceReviewBatch,
  formatEvidenceReviewBatchList,
  formatEvidenceReviewBatchResult,
  formatEvidenceReviewBatchStatus,
  getEvidenceReviewBatchStatus,
  listEvidenceReviewBatches,
  showEvidenceReviewBatch,
} from "./evidence-review-batch.js";
import {
  formatEvidenceReviewWorkspaceResult,
  formatEvidenceReviewWorkspaceStatus,
  getEvidenceReviewWorkspaceStatus,
  renderEvidenceReviewWorkspace,
  showEvidenceReviewWorkspace,
} from "./evidence-review-workspace.js";
import {
  formatTargetEvidencePinResult,
  formatTargetEvidencePinStatus,
  getTargetEvidencePinStatus,
  loadTargetEvidencePin,
  pinTargetEvidenceSnapshot,
  upgradeTargetEvidenceSnapshot,
} from "./target-evidence-pin.js";
import {
  analyzeTarget,
  formatAnalyzeTargetResult,
  formatTargetAnalysisStatus,
  getTargetAnalysisStatus,
  showTargetAnalysis
} from "./target-analysis.js";
import {
  formatInterpretTargetResult,
  formatTargetInterpretationStatus,
  getTargetInterpretationStatus,
  interpretTarget,
  showTargetInterpretation
} from "./target-interpretation.js";
import {
  buildJobRequirements,
  formatBuildJobRequirementsResult,
  formatJobRequirementModelStatus,
  getJobRequirementModelStatus,
  showJobRequirementModel,
} from "./job-requirements.js";
import {
  formatJobRequirementProposalList,
  formatJobRequirementProposalResult,
  formatJobRequirementProposalStatus,
  generateJobRequirementProposal,
  getJobRequirementProposalStatus,
  listJobRequirementProposals,
  replayJobRequirementProposal,
  showJobRequirementProposal,
} from "./job-requirement-proposal.js";
import {
  completeJobRequirementReview,
  formatJobRequirementReviewStatus,
  getJobRequirementReviewStatus,
  initializeJobRequirementReview,
  readEditedJobRequirementFile,
  setJobRequirementReviewDecision,
  showJobRequirementReview,
} from "./job-requirement-review.js";
import {
  approveJobRequirements,
  formatApproveJobRequirementsResult,
  formatApprovedJobRequirementsStatus,
  getApprovedJobRequirementsStatus,
  showApprovedJobRequirements,
} from "./approved-job-requirements.js";
import {
  buildJobEvidenceMap,
  formatBuildJobEvidenceMapResult,
  formatJobEvidenceMapStatus,
  getJobEvidenceMapStatus,
  showJobEvidenceMap,
} from "./job-evidence-mapping.js";
import {
  JobRequirementInputTypeSchema,
} from "./job-evidence-map-schemas.js";
import {
  buildJobCoverage,
  formatBuildJobCoverageResult,
  formatJobCoverageStatus,
  getJobCoverageStatus,
  showJobCoverage,
} from "./job-coverage.js";
import {
  buildJobFitProofAssessment,
  formatBuildJobFitProofAssessmentResult,
  formatJobFitProofAssessmentStatus,
  getJobFitProofAssessmentStatus,
  showJobFitProofAssessment,
} from "./job-fit-proof-assessment.js";
import {
  buildJobResumePlan,
  formatBuildJobResumePlanResult,
  formatJobResumePlanStatus,
  getJobResumePlanStatus,
  showJobResumePlan,
} from "./job-resume-planning.js";
import {
  buildJobResumeDraftScaffold,
  formatBuildJobResumeDraftScaffoldResult,
  formatJobResumeDraftScaffoldStatus,
  getJobResumeDraftScaffoldStatus,
  showJobResumeDraftScaffold,
} from "./job-resume-drafting.js";
import {
  formatJobResumeDraftProposalList,
  formatJobResumeDraftProposalResult,
  formatJobResumeDraftProposalStatus,
  generateJobResumeDraftProposal,
  getJobResumeDraftProposalStatus,
  listJobResumeDraftProposals,
  replayJobResumeDraftProposal,
  showJobResumeDraftProposal,
} from "./job-resume-draft-proposal.js";
import {
  completeJobResumeDraftReview,
  formatJobResumeDraftReviewStatus,
  getJobResumeDraftReviewStatus,
  initializeJobResumeDraftReview,
  readJobResumeDraftReviewEdit,
  setJobResumeDraftReviewDecision,
  showJobResumeDraftReview,
} from "./job-resume-draft-review.js";
import {
  approveJobResumeDraft,
  formatApprovedJobResumeDraftStatus,
  formatApproveJobResumeDraftResult,
  getApprovedJobResumeDraftStatus,
  showApprovedJobResumeDraft,
} from "./approved-job-resume-draft.js";
import type { JobResumeDraftReviewDecision } from "./job-resume-draft-schemas.js";
import {
  composeJobResumeRenderDocument,
  formatComposeJobResumeResult,
  formatJobResumeRenderDocumentStatus,
  getJobResumeRenderDocumentStatus,
  showJobResumeRenderDocument,
} from "./job-resume-rendering.js";
import {
  exportAllJobResume,
  exportJobResume,
  formatExportAllJobResumeResult,
  formatExportJobResumeResult,
  formatJobResumeExportList,
  formatJobResumeExportStatus,
  getJobResumeExportStatus,
  listJobResumeExports,
  showJobResumeExport,
  validateStoredJobResumeExport,
} from "./job-resume-render-export.js";
import {
  formatProposalGenerationResult,
  formatProposalList,
  formatProposalStatus,
  generateInterpretationProposal,
  getInterpretationProposalStatus,
  listInterpretationProposals,
  replayInterpretationProposal,
  showInterpretationProposal
} from "./target-proposal.js";
import {
  completeProposalReview,
  formatProposalReviewStatus,
  getProposalReviewStatus,
  initializeProposalReview,
  readEditedExpectationFile,
  setProposalReviewDecision,
  showProposalReview
} from "./target-proposal-review.js";
import {
  approveInterpretationProposal,
  formatApprovalResult,
  formatApprovedInterpretationStatus,
  getApprovedInterpretationStatus,
  showApprovedTargetInterpretation
} from "./approved-interpretation.js";
import {
  addManualEvidenceMatch,
  formatApprovedMatchingStatus,
  formatManualMatchList,
  formatManualMatchResult,
  getApprovedEvidenceMatchingStatus,
  listManualEvidenceMatches,
  removeManualEvidenceMatch,
  showApprovedEvidenceMatching,
  showManualEvidenceMatch,
} from "./evidence-matching.js";
import {
  formatMatchProposalList,
  formatMatchProposalResult,
  formatMatchProposalStatus,
  generateEvidenceMatchProposal,
  getEvidenceMatchProposalStatus,
  listEvidenceMatchProposals,
  replayEvidenceMatchProposal,
  showEvidenceMatchProposal,
} from "./evidence-match-proposal.js";
import {
  completeEvidenceMatchReview,
  formatEvidenceMatchReviewStatus,
  getEvidenceMatchReviewStatus,
  initializeEvidenceMatchReview,
  readEditedEvidenceMatchFile,
  setEvidenceCoverageReviewDecision,
  setEvidenceMatchReviewDecision,
  showEvidenceMatchReview,
} from "./evidence-match-review.js";
import {
  approveEvidenceMatchProposal,
  formatApproveEvidenceMatchingResult,
} from "./approved-evidence-matching.js";
import {
  buildFitAssessment,
  formatBuildFitAssessmentResult,
  formatFitAssessmentStatus,
  getFitAssessmentStatus,
  showFitAssessment,
} from "./fit-assessment.js";
import {
  formatFitAssessmentProposalList,
  formatFitAssessmentProposalResult,
  formatFitAssessmentProposalStatus,
  generateFitAssessmentProposal,
  getFitAssessmentProposalStatus,
  listFitAssessmentProposals,
  replayFitAssessmentProposal,
  showFitAssessmentProposal,
} from "./fit-assessment-proposal.js";
import {
  completeFitAssessmentReview,
  formatFitAssessmentReviewStatus,
  getFitAssessmentReviewStatus,
  initializeFitAssessmentReview,
  readEditedFitAssessmentFile,
  readEditedFitAssessmentSummaryFile,
  setFitAssessmentReviewDecision,
  setFitAssessmentSummaryReviewDecision,
  showFitAssessmentReview,
} from "./fit-assessment-review.js";
import {
  approveFitAssessmentProposal,
  formatApproveFitAssessmentResult,
} from "./approved-fit-assessment.js";
import {
  buildRoleResumePlan,
  formatBuildRoleResumePlanResult,
  formatRoleResumePlanStatus,
  getRoleResumePlanStatus,
  showRoleResumePlan,
} from "./role-resume-planning.js";
import {
  formatRoleResumePlanProposalList,
  formatRoleResumePlanProposalResult,
  formatRoleResumePlanProposalStatus,
  generateRoleResumePlanProposal,
  getRoleResumePlanProposalStatus,
  listRoleResumePlanProposals,
  replayRoleResumePlanProposal,
  showRoleResumePlanProposal,
} from "./role-resume-plan-proposal.js";
import {
  completeRoleResumePlanReview,
  formatRoleResumePlanReviewStatus,
  getRoleResumePlanReviewStatus,
  initializeRoleResumePlanReview,
  readRoleResumePlanReviewEdit,
  setRoleResumePlanReviewDecision,
  showRoleResumePlanReview,
} from "./role-resume-plan-review.js";
import {
  approveRoleResumePlanProposal,
  formatApproveRoleResumePlanResult,
} from "./approved-role-resume-plan.js";
import type { RoleResumePlanReviewDecision } from "./role-resume-plan-schemas.js";
import {
  buildRoleResumeDraftScaffold,
  formatBuildRoleResumeDraftScaffoldResult,
  formatRoleResumeDraftScaffoldStatus,
  getRoleResumeDraftScaffoldStatus,
  showRoleResumeDraftScaffold,
} from "./role-resume-drafting.js";
import {
  formatRoleResumeDraftProposalList,
  formatRoleResumeDraftProposalResult,
  formatRoleResumeDraftProposalStatus,
  generateRoleResumeDraftProposal,
  getRoleResumeDraftProposalStatus,
  listRoleResumeDraftProposals,
  replayRoleResumeDraftProposal,
  showRoleResumeDraftProposal,
} from "./role-resume-draft-proposal.js";
import {
  completeRoleResumeDraftReview,
  formatRoleResumeDraftReviewStatus,
  getRoleResumeDraftReviewStatus,
  initializeRoleResumeDraftReview,
  readRoleResumeDraftReviewEdit,
  setRoleResumeDraftReviewDecision,
  showRoleResumeDraftReview,
} from "./role-resume-draft-review.js";
import {
  approveRoleResumeDraftProposal,
  formatApprovedRoleResumeDraftStatus,
  formatApproveRoleResumeDraftResult,
  getApprovedRoleResumeDraftStatus,
  showApprovedRoleResumeDraft,
} from "./approved-role-resume-draft.js";
import type { RoleResumeDraftReviewDecision } from "./role-resume-draft-schemas.js";
import {
  composeRoleResumeRenderDocument,
  formatComposeRoleResumeResult,
  formatRoleResumeRenderDocumentStatus,
  getRoleResumeRenderDocumentStatus,
  normalizeRoleResumeRenderOptions,
  showRoleResumeRenderDocument,
} from "./role-resume-rendering.js";
import {
  exportAllRoleResume,
  exportRoleResume,
  formatExportAllRoleResumeResult,
  formatExportRoleResumeResult,
  formatRoleResumeExportList,
  formatRoleResumeExportStatus,
  getRoleResumeExportStatus,
  listRoleResumeExports,
  showRoleResumeExport,
  validateStoredRoleResumeExport,
} from "./role-resume-render-export.js";
import {
  RoleResumeDateFormatSchema,
  RoleResumeExportFormatSchema,
  RoleResumePageSizeSchema,
  RoleResumeRenderProfileNameSchema,
} from "./role-resume-render-schemas.js";
import {
  continueJobWorkflow,
  createGuidedJob,
  finalizeJobWorkflow,
  formatFinalizeJobWorkflowResult,
  formatGuidedJobCreation,
  formatJobWorkflowJson,
  formatJobWorkflowRunResult,
  formatJobWorkflowStatus,
  inspectJobWorkflow,
  runJobWorkflow,
} from "./job-workflow.js";

const program = new Command();

program
  .name("prooflayer")
  .description("ProofLayer Career Vault Builder v1")
  .option("-w, --workspace <path>", "workspace path");

program
  .command("init")
  .description("Create the local ProofLayer workspace folders and config.")
  .action(async () => {
    const workspace = getWorkspace();
    await initWorkspace(workspace);
    console.log(`Initialized workspace: ${workspace}`);
  });

program
  .command("ingest")
  .description("Scan workspace/sources and create kb/sources.json plus extracted text.")
  .action(async () => {
    const workspace = getWorkspace();
    const sources = await ingestSources(workspace);
    console.log(`Ingested sources: ${sources.length}`);
  });

program
  .command("normalize")
  .description("Normalize extracted text into kb/evidence-items.json.")
  .action(async () => {
    const workspace = getWorkspace();
    const evidence = await normalizeEvidence(workspace);
    console.log(`Evidence items created: ${evidence.length}`);
  });

program
  .command("claims")
  .description("Generate conservative evidence-backed claims.")
  .action(async () => {
    const workspace = getWorkspace();
    const claims = await generateClaims(workspace);
    console.log(`Claims created: ${claims.length}`);
  });

program
  .command("profile")
  .description("Build career profile JSON and Markdown report.")
  .action(async () => {
    const workspace = getWorkspace();
    const profile = await buildProfile(workspace);
    console.log(`Career profile built: ${profile.id}`);
  });

const audit = program.command("audit").description("Run audits.");

audit
  .command("privacy")
  .description("Create outputs/reports/privacy-report.md.")
  .action(async () => {
    const workspace = getWorkspace();
    const findings = await auditPrivacy(workspace);
    console.log(`Privacy findings: ${findings.length}`);
  });

const generate = program.command("generate").description("Generate deterministic draft outputs.");

generate
  .command("role")
  .description("Generate one role variant or all supported variants in draft mode.")
  .option("--role <role-key>", "role key: tpm, ai-product, fullstack, or fractional-cto")
  .option("--all", "generate all supported role variants")
  .action(async (options: { role?: string; all?: boolean }) => {
    const workspace = getWorkspace();
    if (options.all && options.role) throw new Error("Use either --all or --role, not both.");
    if (options.all) {
      const manifests = await generateAllRoleVariants(workspace);
      console.log(`Generated role variants: ${manifests.map((manifest) => manifest.roleKey).join(", ")}`);
      return;
    }
    if (!options.role || !isRoleKey(options.role)) {
      throw new Error("Provide --role with one of: tpm, ai-product, fullstack, fractional-cto; or use --all.");
    }
    const manifest = await generateRoleVariant(workspace, options.role);
    console.log(`Generated ${manifest.roleKey} draft: outputs/variants/${manifest.roleKey}`);
  });

program
  .command("variants")
  .description("List generated role variants and current/stale status.")
  .action(async () => {
    const workspace = getWorkspace();
    console.log(formatVariantsSummary(await listVariantStatuses(workspace)));
  });

const review = program.command("review").description("Review claims used by a specific generated variant.");

review
  .command("variant")
  .requiredOption("--role <role-key>", "role key: tpm or ai-product")
  .description("Create or update output-specific review decisions without overwriting existing decisions.")
  .action(async (options: { role: string }) => {
    const workspace = getWorkspace();
    console.log(formatVariantReviewStatus(await initializeVariantReview(workspace, options.role)));
  });

review
  .command("status")
  .requiredOption("--role <role-key>", "role key: tpm or ai-product")
  .description("Show output-specific decision counts and finalization readiness.")
  .action(async (options: { role: string }) => {
    const workspace = getWorkspace();
    console.log(formatVariantReviewStatus(await getVariantReviewStatus(workspace, options.role)));
  });

const finalize = program.command("finalize").description("Generate reviewed final/public candidate outputs.");

finalize
  .command("variant")
  .requiredOption("--role <role-key>", "role key: tpm or ai-product")
  .description("Finalize one reviewed role variant using approved or revised claims only.")
  .action(async (options: { role: string }) => {
    const workspace = getWorkspace();
    const manifest = await finalizeVariant(workspace, options.role);
    console.log(`Finalized ${manifest.roleKey} candidate: ${manifest.finalizationReadiness === "ready" ? "ready" : "not ready"}`);
    console.log(`Final checklist: outputs/variants/${manifest.roleKey}/final-public-checklist.md`);
  });

const publicProfile = program.command("public-profile").description("Manage manually approved public profile metadata.");

publicProfile
  .command("init")
  .description("Create config/public-profile.json without overwriting an existing profile.")
  .action(async () => {
    const workspace = getWorkspace();
    const result = await initializePublicProfile(workspace);
    console.log(`${result.created ? "Created" : "Preserved existing"} public profile: ${result.path}`);
  });

publicProfile
  .command("show")
  .description("Show a safe summary of configured public profile metadata.")
  .action(async () => {
    const workspace = getWorkspace();
    console.log(formatPublicProfileSummary(await loadPublicProfile(workspace)));
  });

const exportCommand = program.command("export").description("Export reviewed final artifacts.");

exportCommand
  .command("resume")
  .requiredOption("--role <role-key>", "role key: ai-product or tpm")
  .description("Export a reviewed final resume as Markdown, DOCX, and PDF without changing its source Markdown.")
  .action(async (options: { role: string }) => {
    const workspace = getWorkspace();
    const manifest = await exportFinalResume(workspace, options.role);
    console.log(`Exported ${manifest.roleKey} resume with ${manifest.exportToolUsed}.`);
    console.log(`Markdown: ${manifest.exportedMarkdownPath}`);
    console.log(`DOCX: ${manifest.generatedFiles.find((file) => file.endsWith(".docx"))}`);
    console.log(`PDF: ${manifest.generatedFiles.find((file) => file.endsWith(".pdf"))}`);
    console.log(`Export manifest: outputs/exports/${manifest.roleKey}/export-manifest.json`);
  });

exportCommand
  .command("status")
  .requiredOption("--role <role-key>", "role key: ai-product or tpm")
  .description("Show generated/current/stale status for a reviewed resume export.")
  .action(async (options: { role: string }) => {
    const workspace = getWorkspace();
    console.log(formatResumeExportStatus(await getResumeExportStatus(workspace, options.role)));
  });

const evidence = program
  .command("evidence")
  .description("Export and inspect immutable reviewed Evidence Foundation snapshots.");

const claimReview = evidence
  .command("claim-review")
  .description("Create and inspect immutable human claim-review decisions.");

claimReview
  .command("create <claim-id>")
  .requiredOption("--decision <decision>", "controlled review decision")
  .requiredOption("--input <path>", "complete JSON review input")
  .description("Create one evidence claim review without mutating the source claim.")
  .action(async (claimId: string, options: { decision: string; input: string }) => {
    const input = await readEvidenceClaimReviewInputFile(options.input);
    if (input.decision !== options.decision) {
      throw new Error(
        `CLI decision ${options.decision} does not match review input decision ${input.decision}.`,
      );
    }
    console.log(formatEvidenceClaimReviewResult(
      await createEvidenceClaimReview(getWorkspace(), claimId, input),
    ));
  });

claimReview
  .command("show <claim-id>")
  .description("Print the current effective review for one claim as stable JSON.")
  .action(async (claimId: string) => {
    process.stdout.write(`${JSON.stringify(
      await showEvidenceClaimReview(getWorkspace(), claimId),
      null,
      2,
    )}\n`);
  });

claimReview
  .command("status <claim-id>")
  .option("--review-id <review-id>", "inspect a specific review version")
  .description("Inspect claim-review lifecycle, dependencies, and supersession.")
  .action(async (claimId: string, options: { reviewId?: string }) => {
    console.log(formatEvidenceClaimReviewStatus(
      await getEvidenceClaimReviewStatus(getWorkspace(), claimId, options.reviewId),
    ));
  });

claimReview
  .command("list")
  .description("List reviewed and unreviewed Evidence Foundation claims.")
  .action(async () => {
    console.log(formatEvidenceClaimReviewList(
      await listEvidenceClaimReviews(getWorkspace()),
    ));
  });

const reviewBatch = evidence
  .command("review-batch")
  .description("Organize human evidence review without making approval decisions.");

reviewBatch
  .command("build")
  .requiredOption("--target <target-id>", "current Job Target used only for review priority")
  .option("--subset-size <count>", "controlled template subset size", "12")
  .option("--rebuild", "explicitly rebuild an invalid task-owned batch")
  .description("Build a deterministic target-guided human review batch and blank templates.")
  .action(async (options: { target: string; subsetSize: string; rebuild?: boolean }) => {
    console.log(formatEvidenceReviewBatchResult(
      await buildEvidenceReviewBatch(getWorkspace(), options.target, {
        subsetSize: Number.parseInt(options.subsetSize, 10),
        rebuild: options.rebuild,
      }),
    ));
  });

reviewBatch
  .command("list")
  .description("List persisted evidence review batches.")
  .action(async () => {
    console.log(formatEvidenceReviewBatchList(
      await listEvidenceReviewBatches(getWorkspace()),
    ));
  });

reviewBatch
  .command("show <batch-id>")
  .description("Print one review batch as stable JSON.")
  .action(async (batchId: string) => {
    process.stdout.write(`${JSON.stringify(
      await showEvidenceReviewBatch(getWorkspace(), batchId),
      null,
      2,
    )}\n`);
  });

reviewBatch
  .command("status <batch-id>")
  .description("Inspect review-batch lifecycle and dependency state.")
  .action(async (batchId: string) => {
    console.log(formatEvidenceReviewBatchStatus(
      await getEvidenceReviewBatchStatus(getWorkspace(), batchId),
    ));
  });

const reviewWorkspace = evidence
  .command("review-workspace")
  .description("Render immutable review templates as read-only human workspace Markdown.");

reviewWorkspace
  .command("render <batch-id>")
  .option("--rebuild", "explicitly replace stale or invalid derived Markdown")
  .description("Render one deterministic Markdown workspace per selected review template.")
  .action(async (batchId: string, options: { rebuild?: boolean }) => {
    console.log(formatEvidenceReviewWorkspaceResult(
      await renderEvidenceReviewWorkspace(getWorkspace(), batchId, {
        rebuild: options.rebuild,
      }),
    ));
  });

reviewWorkspace
  .command("show <batch-id>")
  .description("Print the current read-only review workspace index Markdown.")
  .action(async (batchId: string) => {
    process.stdout.write(await showEvidenceReviewWorkspace(getWorkspace(), batchId));
  });

reviewWorkspace
  .command("status <batch-id>")
  .description("Inspect review workspace Markdown, manifest, input, and renderer lifecycle.")
  .action(async (batchId: string) => {
    console.log(formatEvidenceReviewWorkspaceStatus(
      await getEvidenceReviewWorkspaceStatus(getWorkspace(), batchId),
    ));
  });

evidence
  .command("snapshot-build")
  .description("Export the current reviewed Evidence Foundation as an immutable content-addressed snapshot.")
  .action(async () => {
    console.log(formatEvidenceSnapshotBuild(
      await buildEvidenceSnapshot(getWorkspace()),
    ));
  });

evidence
  .command("snapshot-list")
  .description("List immutable Evidence Foundation snapshots.")
  .action(async () => {
    console.log(formatEvidenceSnapshotList(
      await listEvidenceSnapshots(getWorkspace()),
    ));
  });

evidence
  .command("snapshot-show <snapshot-id>")
  .description("Print one normalized Evidence Snapshot as stable JSON.")
  .action(async (snapshotId: string) => {
    process.stdout.write(
      `${JSON.stringify(
        (await loadEvidenceSnapshot(getWorkspace(), snapshotId)).snapshot,
        null,
        2,
      )}\n`,
    );
  });

evidence
  .command("snapshot-status <snapshot-id>")
  .description("Inspect Evidence Snapshot integrity and compatibility.")
  .action(async (snapshotId: string) => {
    console.log(formatEvidenceSnapshotStatus(
      await getEvidenceSnapshotStatus(getWorkspace(), snapshotId),
    ));
  });

evidence
  .command("snapshot-validate <snapshot-id>")
  .description("Fail unless an Evidence Snapshot is current and valid.")
  .action(async (snapshotId: string) => {
    console.log(formatEvidenceSnapshotStatus(
      await validateEvidenceSnapshot(getWorkspace(), snapshotId),
    ));
  });

const target = program.command("target").description("Create and inspect deterministic role and job targets.");

const job = program
  .command("job")
  .description("Run the guided Job application workflow while preserving trust boundaries and lifecycle controls.");

job
  .command("create")
  .requiredOption("--file <path>", "Markdown job description path")
  .option("--title <title>", "explicit title; overrides front matter")
  .option("--company <company>", "explicit company; overrides front matter")
  .option("--location <location>", "explicit location; overrides front matter")
  .option("--working-model <model>", "explicit working model; overrides front matter")
  .option("--replace", "explicitly replace an existing target with the same deterministic ID")
  .description("Create an exact Job Target without running downstream pipeline stages.")
  .action(async (options: GuidedJobCreateCliOptions) => {
    console.log(formatGuidedJobCreation(await createGuidedJob(
      getWorkspace(),
      {
        file: options.file,
        title: options.title,
        company: options.company,
        location: options.location,
        workingModel: options.workingModel,
      },
      { replace: options.replace },
    )));
  });

job
  .command("run <target-id>")
  .option("--requirements-source <source>", "deterministic or approved", "deterministic")
  .option("--snapshot <snapshot-id>", "explicit snapshot to pin when the target has no pin")
  .option("--provider <provider-name>", "configured provider name")
  .option("--offline", "explicitly permit a configured deterministic fake provider")
  .option("--rebuild-stale", "explicitly rebuild affected stale or invalid deterministic stages")
  .option("--dry-run", "inspect actions without writes or model calls")
  .description("Run safe stages from the current lifecycle state until completion or an explicit gate.")
  .action(async (targetId: string, options: GuidedJobRunCliOptions) => {
    console.log(formatJobWorkflowRunResult(await runJobWorkflow(
      getWorkspace(),
      targetId,
      parseGuidedJobRunOptions(options),
    )));
  });

job
  .command("continue <target-id>")
  .option("--requirements-source <source>", "deterministic or approved", "deterministic")
  .option("--snapshot <snapshot-id>", "explicit snapshot to pin when the target has no pin")
  .option("--upgrade-snapshot <snapshot-id>", "explicitly replace the current target snapshot pin")
  .option("--provider <provider-name>", "configured provider name")
  .option("--offline", "explicitly permit a configured deterministic fake provider")
  .option("--rebuild-stale", "explicitly rebuild affected stale or invalid deterministic stages")
  .option("--dry-run", "inspect actions without writes or model calls")
  .description("Resume after a known human or dependency gate without bypassing review.")
  .action(async (targetId: string, options: GuidedJobRunCliOptions) => {
    console.log(formatJobWorkflowRunResult(await continueJobWorkflow(
      getWorkspace(),
      targetId,
      parseGuidedJobRunOptions(options),
    )));
  });

job
  .command("status <target-id>")
  .option("--json", "print stable machine-readable status")
  .option("--verbose", "include stage details and lifecycle reasons")
  .description("Inspect the guided Job workflow without mutating any artifact.")
  .action(async (targetId: string, options: { json?: boolean; verbose?: boolean }) => {
    const status = await inspectJobWorkflow(getWorkspace(), targetId);
    process.stdout.write(options.json
      ? formatJobWorkflowJson(status)
      : `${formatJobWorkflowStatus(status, { verbose: options.verbose })}\n`);
  });

job
  .command("finalize <target-id>")
  .option("--profile <profile>", "ats-standard or compact-professional")
  .option("--page-size <size>", "A4 or LETTER")
  .option("--date-format <format>", "MMM-YYYY, YYYY, or exact-source")
  .option("--formats <formats>", "comma-separated markdown,html,docx,pdf", "markdown,html,docx")
  .option("--output-dir <path>", "safe relative subdirectory below the Job target export root")
  .option("--rebuild-stale", "explicitly replace stale or invalid canonical/export artifacts")
  .option("--dry-run", "inspect finalization without writes")
  .description("Compose and export a current approved Job Resume Draft without changing wording.")
  .action(async (targetId: string, options: GuidedJobFinalizeCliOptions) => {
    console.log(formatFinalizeJobWorkflowResult(await finalizeJobWorkflow(
      getWorkspace(),
      targetId,
      {
        profile: options.profile ? RoleResumeRenderProfileNameSchema.parse(options.profile) : undefined,
        pageSize: options.pageSize ? RoleResumePageSizeSchema.parse(options.pageSize) : undefined,
        dateFormat: options.dateFormat ? RoleResumeDateFormatSchema.parse(options.dateFormat) : undefined,
        formats: parseGuidedExportFormats(options.formats),
        outputDir: options.outputDir,
        rebuildStale: options.rebuildStale,
        dryRun: options.dryRun,
      },
    )));
  });

target
  .command("create-role")
  .requiredOption("--title <title>", "target role title")
  .option("--seniority <seniority>", "optional seniority")
  .option("--domain <domain>", "optional target domain")
  .option("--location <location>", "optional target location")
  .option("--working-model <model>", "optional working model")
  .option("--replace", "explicitly replace an existing target with the same deterministic ID")
  .description("Create a normalized role target without generating outputs or calculating fit.")
  .action(async (options: {
    title: string;
    seniority?: string;
    domain?: string;
    location?: string;
    workingModel?: string;
    replace?: boolean;
  }) => {
    const workspace = getWorkspace();
    console.log(formatTargetCreation(await createRoleTarget(workspace, options, { replace: options.replace })));
  });

target
  .command("create-job")
  .requiredOption("--file <path>", "Markdown job description path")
  .option("--title <title>", "explicit title; overrides front matter")
  .option("--company <company>", "explicit company; overrides front matter")
  .option("--location <location>", "explicit location; overrides front matter")
  .option("--working-model <model>", "explicit working model; overrides front matter")
  .option("--replace", "explicitly replace an existing target with the same deterministic ID")
  .description("Import an exact Markdown job target without extracting requirements or calculating fit.")
  .action(async (options: {
    file: string;
    title?: string;
    company?: string;
    location?: string;
    workingModel?: string;
    replace?: boolean;
  }) => {
    const workspace = getWorkspace();
    console.log(formatTargetCreation(await createJobTarget(workspace, options, { replace: options.replace })));
  });

target
  .command("list")
  .description("List stored role and job targets.")
  .action(async () => {
    const workspace = getWorkspace();
    console.log(formatTargetList(await listTargets(workspace)));
  });

target
  .command("show <target-id>")
  .description("Print one complete normalized target as stable JSON.")
  .action(async (targetId: string) => {
    const workspace = getWorkspace();
    process.stdout.write(formatTargetJson(await showTarget(workspace, targetId)));
  });

target
  .command("evidence-pin <target-id>")
  .requiredOption("--snapshot <snapshot-id>", "immutable Evidence Snapshot ID")
  .description("Explicitly pin a Role or Job Target to one Evidence Snapshot.")
  .action(async (targetId: string, options: { snapshot: string }) => {
    console.log(formatTargetEvidencePinResult(
      await pinTargetEvidenceSnapshot(
        getWorkspace(),
        targetId,
        options.snapshot,
      ),
    ));
  });

target
  .command("evidence-show <target-id>")
  .description("Print a target's explicit Evidence Snapshot pin as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(
        (await loadTargetEvidencePin(getWorkspace(), targetId)).pin,
        null,
        2,
      )}\n`,
    );
  });

target
  .command("evidence-status <target-id>")
  .description("Inspect a target's Evidence Snapshot pin and compatibility.")
  .action(async (targetId: string) => {
    console.log(formatTargetEvidencePinStatus(
      await getTargetEvidencePinStatus(getWorkspace(), targetId),
    ));
  });

target
  .command("evidence-upgrade <target-id>")
  .requiredOption("--snapshot <snapshot-id>", "replacement Evidence Snapshot ID")
  .description("Explicitly replace a target's pin without rebuilding downstream artifacts.")
  .action(async (targetId: string, options: { snapshot: string }) => {
    console.log(formatTargetEvidencePinResult(
      await upgradeTargetEvidenceSnapshot(
        getWorkspace(),
        targetId,
        options.snapshot,
      ),
    ));
  });

target
  .command("analyze <target-id>")
  .option("--rebuild", "explicitly rebuild current, stale, or invalid stored analysis")
  .description("Create deterministic structural analysis without semantic inference or evidence matching.")
  .action(async (targetId: string, options: { rebuild?: boolean }) => {
    const workspace = getWorkspace();
    console.log(formatAnalyzeTargetResult(await analyzeTarget(workspace, targetId, options)));
  });

target
  .command("analysis-show <target-id>")
  .description("Print the complete normalized target analysis as stable JSON.")
  .action(async (targetId: string) => {
    const workspace = getWorkspace();
    process.stdout.write(`${JSON.stringify(await showTargetAnalysis(workspace, targetId), null, 2)}\n`);
  });

target
  .command("analysis-status <target-id>")
  .description("Inspect target-analysis freshness and integrity without regenerating it.")
  .action(async (targetId: string) => {
    const workspace = getWorkspace();
    console.log(formatTargetAnalysisStatus(await getTargetAnalysisStatus(workspace, targetId)));
  });

target
  .command("interpret <target-id>")
  .option("--role-profile <path>", "explicit workspace-local role profile JSON")
  .option("--rebuild", "explicitly rebuild stale or invalid stored interpretation")
  .description("Interpret explicit target expectations without loading candidate evidence or calculating fit.")
  .action(async (targetId: string, options: { roleProfile?: string; rebuild?: boolean }) => {
    const workspace = getWorkspace();
    console.log(formatInterpretTargetResult(await interpretTarget(workspace, targetId, options)));
  });

target
  .command("interpretation-show <target-id>")
  .description("Print the complete normalized semantic target interpretation as stable JSON.")
  .action(async (targetId: string) => {
    const workspace = getWorkspace();
    process.stdout.write(`${JSON.stringify(await showTargetInterpretation(workspace, targetId), null, 2)}\n`);
  });

target
  .command("interpretation-status <target-id>")
  .option("--role-profile <path>", "explicit workspace-local role profile JSON")
  .description("Inspect interpretation freshness and integrity without regenerating it.")
  .action(async (targetId: string, options: { roleProfile?: string }) => {
    const workspace = getWorkspace();
    console.log(
      formatTargetInterpretationStatus(
        await getTargetInterpretationStatus(workspace, targetId, options),
      ),
    );
  });

const jobRequirements = target
  .command("job-requirements")
  .description("Build, inspect, review, and approve Job Description requirement models.");

jobRequirements
  .command("build <target-id>")
  .option("--rebuild", "explicitly rebuild a stale or invalid deterministic model")
  .description("Build explicit deterministic requirements from a current Job Target analysis.")
  .action(async (targetId: string, options: { rebuild?: boolean }) => {
    console.log(formatBuildJobRequirementsResult(
      await buildJobRequirements(getWorkspace(), targetId, options),
    ));
  });

jobRequirements
  .command("show <target-id>")
  .description("Print the deterministic Job Requirement Model as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobRequirementModel(getWorkspace(), targetId), null, 2)}\n`,
    );
  });

jobRequirements
  .command("status <target-id>")
  .description("Inspect deterministic Job Requirement Model lifecycle and dependencies.")
  .action(async (targetId: string) => {
    console.log(formatJobRequirementModelStatus(
      await getJobRequirementModelStatus(getWorkspace(), targetId),
    ));
  });

jobRequirements
  .command("approve <target-id>")
  .option("--proposal <proposal-id>", "explicit completed proposal review to approve")
  .option("--rebuild", "explicitly replace a stale or invalid approved model")
  .description("Approve a completed human review without making a model call.")
  .action(async (
    targetId: string,
    options: { proposal?: string; rebuild?: boolean },
  ) => {
    console.log(formatApproveJobRequirementsResult(
      await approveJobRequirements(getWorkspace(), targetId, {
        proposalId: options.proposal,
        rebuild: options.rebuild,
      }),
    ));
  });

jobRequirements
  .command("approved-show <target-id>")
  .description("Print the human-reviewed approved Job Requirement Model as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showApprovedJobRequirements(getWorkspace(), targetId), null, 2)}\n`,
    );
  });

jobRequirements
  .command("approved-status <target-id>")
  .description("Inspect approved Job Requirement Model integrity and freshness.")
  .action(async (targetId: string) => {
    console.log(formatApprovedJobRequirementsStatus(
      await getApprovedJobRequirementsStatus(getWorkspace(), targetId),
    ));
  });

const jobMatching = target
  .command("job-matching")
  .description("Build and inspect deterministic Job Requirement-to-evidence maps.");

jobMatching
  .command("build <target-id>")
  .option("--rebuild", "explicitly rebuild a stale or invalid evidence map")
  .option(
    "--requirements-source <source>",
    "usable requirement source: deterministic (default) or approved",
    "deterministic",
  )
  .description("Map a usable Job Requirement Model to approved public-safe evidence.")
  .action(async (
    targetId: string,
    options: { rebuild?: boolean; requirementsSource: string },
  ) => {
    console.log(formatBuildJobEvidenceMapResult(
      await buildJobEvidenceMap(getWorkspace(), targetId, {
        rebuild: options.rebuild,
        requirementSource: JobRequirementInputTypeSchema.parse(
          options.requirementsSource,
        ),
      }),
    ));
  });

jobMatching
  .command("show <target-id>")
  .description("Print the deterministic Job Evidence Map as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobEvidenceMap(getWorkspace(), targetId), null, 2)}\n`,
    );
  });

jobMatching
  .command("status <target-id>")
  .description("Inspect Job Evidence Map integrity, dependencies, and lifecycle.")
  .action(async (targetId: string) => {
    console.log(formatJobEvidenceMapStatus(
      await getJobEvidenceMapStatus(getWorkspace(), targetId),
    ));
  });

const jobCoverage = target
  .command("job-coverage")
  .description("Build and inspect deterministic per-requirement Job coverage.");

jobCoverage
  .command("build <target-id>")
  .option("--rebuild", "explicitly rebuild stale or invalid coverage")
  .description("Classify each requirement from the current stored Job Evidence Map.")
  .action(async (targetId: string, options: { rebuild?: boolean }) => {
    console.log(formatBuildJobCoverageResult(
      await buildJobCoverage(getWorkspace(), targetId, options),
    ));
  });

jobCoverage
  .command("show <target-id>")
  .description("Print deterministic Job Requirement Coverage as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobCoverage(getWorkspace(), targetId), null, 2)}\n`,
    );
  });

jobCoverage
  .command("status <target-id>")
  .description("Inspect Job Requirement Coverage integrity, dependencies, and lifecycle.")
  .action(async (targetId: string) => {
    console.log(formatJobCoverageStatus(
      await getJobCoverageStatus(getWorkspace(), targetId),
    ));
  });

const jobAssessment = target
  .command("job-assessment")
  .description("Build and inspect deterministic Job fit and proof assessment.");

jobAssessment
  .command("build <target-id>")
  .option("--rebuild", "explicitly rebuild stale or invalid assessment")
  .description("Assess current Job coverage without rematching evidence.")
  .action(async (targetId: string, options: { rebuild?: boolean }) => {
    console.log(formatBuildJobFitProofAssessmentResult(
      await buildJobFitProofAssessment(getWorkspace(), targetId, options),
    ));
  });

jobAssessment
  .command("show <target-id>")
  .description("Print deterministic Job fit and proof assessment as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobFitProofAssessment(getWorkspace(), targetId), null, 2)}\n`,
    );
  });

jobAssessment
  .command("status <target-id>")
  .description("Inspect Job fit and proof assessment integrity and lifecycle.")
  .action(async (targetId: string) => {
    console.log(formatJobFitProofAssessmentStatus(
      await getJobFitProofAssessmentStatus(getWorkspace(), targetId),
    ));
  });

const jobResumePlan = target
  .command("job-resume-plan")
  .description("Build and inspect deterministic job-specific resume content plans without writing resume prose.");

jobResumePlan
  .command("build <target-id>")
  .option("--rebuild", "explicitly rebuild a stale or invalid plan")
  .description("Plan one Job-specific resume from current assessment and reviewed mapped evidence.")
  .action(async (targetId: string, options: { rebuild?: boolean }) => {
    console.log(formatBuildJobResumePlanResult(
      await buildJobResumePlan(getWorkspace(), targetId, options),
    ));
  });

jobResumePlan
  .command("show <target-id>")
  .description("Print the deterministic Job Resume Content Plan as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobResumePlan(getWorkspace(), targetId), null, 2)}\n`,
    );
  });

jobResumePlan
  .command("status <target-id>")
  .description("Inspect Job Resume Content Plan integrity, dependencies, and lifecycle.")
  .action(async (targetId: string) => {
    console.log(formatJobResumePlanStatus(
      await getJobResumePlanStatus(getWorkspace(), targetId),
    ));
  });

const jobResumeDraft = target
  .command("job-resume-draft")
  .description("Build deterministic Job draft scaffolds and approve human-reviewed structured Job resumes.");

jobResumeDraft
  .command("scaffold-build <target-id>")
  .option("--rebuild", "explicitly rebuild a stale or invalid Job draft scaffold")
  .description("Build a prose-free scaffold from the current usable Job Resume Content Plan.")
  .action(async (targetId: string, options: { rebuild?: boolean }) => {
    console.log(formatBuildJobResumeDraftScaffoldResult(
      await buildJobResumeDraftScaffold(getWorkspace(), targetId, options),
    ));
  });

jobResumeDraft
  .command("scaffold-show <target-id>")
  .description("Print the deterministic Job resume draft scaffold as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobResumeDraftScaffold(getWorkspace(), targetId), null, 2)}\n`,
    );
  });

jobResumeDraft
  .command("scaffold-status <target-id>")
  .description("Inspect Job scaffold integrity and dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatJobResumeDraftScaffoldStatus(
      await getJobResumeDraftScaffoldStatus(getWorkspace(), targetId),
    ));
  });

jobResumeDraft
  .command("approve <target-id>")
  .option("--rebuild", "explicitly replace a stale approved Job draft after completed review")
  .description("Create an approved structured Job Resume Draft without a model call or rendering.")
  .action(async (targetId: string, options: { rebuild?: boolean }) => {
    console.log(formatApproveJobResumeDraftResult(
      await approveJobResumeDraft(getWorkspace(), targetId, options),
    ));
  });

jobResumeDraft
  .command("approved-show <target-id>")
  .description("Print the current approved structured Job Resume Draft as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showApprovedJobResumeDraft(getWorkspace(), targetId), null, 2)}\n`,
    );
  });

jobResumeDraft
  .command("approved-status <target-id>")
  .description("Inspect approved Job draft integrity, provenance, and lifecycle.")
  .action(async (targetId: string) => {
    console.log(formatApprovedJobResumeDraftStatus(
      await getApprovedJobResumeDraftStatus(getWorkspace(), targetId),
    ));
  });

const jobResumeDraftProposal = target
  .command("job-resume-draft-proposal")
  .description("Generate, inspect, replay, and human-review model-assisted Job resume draft proposals.");

jobResumeDraftProposal
  .command("generate <target-id>")
  .option("--refresh", "bypass a current cached proposal and call the configured provider")
  .description("Generate untrusted structured Job resume wording; no output is auto-approved.")
  .action(async (targetId: string, options: { refresh?: boolean }) => {
    console.log(formatJobResumeDraftProposalResult(
      await generateJobResumeDraftProposal(getWorkspace(), targetId, options),
    ));
  });

jobResumeDraftProposal
  .command("list <target-id>")
  .description("List stored structured Job Resume Draft proposals.")
  .action(async (targetId: string) => {
    console.log(formatJobResumeDraftProposalList(
      await listJobResumeDraftProposals(getWorkspace(), targetId),
    ));
  });

jobResumeDraftProposal
  .command("show <proposal-id>")
  .description("Print one normalized structured Job Resume Draft proposal as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobResumeDraftProposal(getWorkspace(), proposalId), null, 2)}\n`,
    );
  });

jobResumeDraftProposal
  .command("status <proposal-id>")
  .description("Inspect Job draft proposal integrity, dependencies, and review eligibility.")
  .action(async (proposalId: string) => {
    console.log(formatJobResumeDraftProposalStatus(
      await getJobResumeDraftProposalStatus(getWorkspace(), proposalId),
    ));
  });

jobResumeDraftProposal
  .command("replay <proposal-id>")
  .description("Replay exact stored response validation without a provider call.")
  .action(async (proposalId: string) => {
    const result = await replayJobResumeDraftProposal(getWorkspace(), proposalId);
    console.log(`Proposal ID: ${result.proposalId}`);
    console.log(`Original SHA-256: ${result.originalSha256}`);
    console.log(`Replay SHA-256: ${result.replaySha256}`);
    console.log(`Replay matches: ${result.matches ? "yes" : "no"}`);
  });

jobResumeDraftProposal
  .command("review-create <proposal-id>")
  .option("--reviewer <name>", "optional human reviewer name")
  .description("Create pending section, statement, ledger, ordering, and ambiguity decisions.")
  .action(async (proposalId: string, options: { reviewer?: string }) => {
    const review = await initializeJobResumeDraftReview(getWorkspace(), proposalId, {
      reviewerName: options.reviewer,
    });
    console.log(formatJobResumeDraftReviewStatus(
      await getJobResumeDraftReviewStatus(getWorkspace(), review.id),
    ));
  });

jobResumeDraftProposal
  .command("review-show <review-id>")
  .description("Print one complete Job Resume Draft review as stable JSON.")
  .action(async (reviewId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobResumeDraftReview(getWorkspace(), reviewId), null, 2)}\n`,
    );
  });

jobResumeDraftProposal
  .command("review-status <review-id>")
  .description("Inspect Job draft decision counts and manifest integrity.")
  .action(async (reviewId: string) => {
    console.log(formatJobResumeDraftReviewStatus(
      await getJobResumeDraftReviewStatus(getWorkspace(), reviewId),
    ));
  });

for (const itemType of ["section", "draft-item", "claim-ledger", "section-order", "ambiguity"] as JobResumeDraftReviewDecision["itemType"][]) {
  jobResumeDraftProposal
    .command(`review-set-${itemType} <proposal-id> <item-id>`)
    .option("--accept", "accept the proposed draft element unchanged")
    .option("--reject", "reject the proposed draft element")
    .option("--edit-file <path>", "file containing edited text or complete edited JSON")
    .option("--note <note>", "optional review rationale")
    .description(`Set exactly one pending ${itemType} Job draft decision.`)
    .action(async (
      proposalId: string,
      itemId: string,
      options: { accept?: boolean; reject?: boolean; editFile?: string; note?: string },
    ) => {
      const choices = Number(Boolean(options.accept)) +
        Number(Boolean(options.reject)) +
        Number(Boolean(options.editFile));
      if (choices !== 1) {
        throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
      }
      const editedValue = options.editFile
        ? await readJobResumeDraftReviewEdit(options.editFile)
        : undefined;
      await setJobResumeDraftReviewDecision(getWorkspace(), proposalId, itemType, itemId, {
        decision: options.accept ? "accept" : options.reject ? "reject" : "edit",
        editedValue,
        reviewNote: options.note,
      });
      const review = await showJobResumeDraftReview(getWorkspace(), proposalId);
      console.log(formatJobResumeDraftReviewStatus(
        await getJobResumeDraftReviewStatus(getWorkspace(), review.id),
      ));
    });
}

jobResumeDraftProposal
  .command("review-complete <proposal-id>")
  .description("Complete review only after every required Job draft decision is valid and resolved.")
  .action(async (proposalId: string) => {
    console.log(formatJobResumeDraftReviewStatus(
      await completeJobResumeDraftReview(getWorkspace(), proposalId),
    ));
  });

const jobResumeRender = target
  .command("job-resume-render")
  .description("Compose and export current approved Job Resume Drafts without changing approved wording.");

jobResumeRender
  .command("compose <target-id>")
  .option("--profile <profile>", "ats-standard or compact-professional")
  .option("--page-size <size>", "A4 or LETTER")
  .option("--date-format <format>", "MMM-YYYY, YYYY, or exact-source")
  .option("--rebuild", "explicitly replace a stale or invalid canonical Job render document")
  .description("Compose the canonical deterministic render document from the current approved Job Resume Draft.")
  .action(async (targetId: string, options: ResumeRenderCliOptions) => {
    console.log(formatComposeJobResumeResult(await composeJobResumeRenderDocument(
      getWorkspace(),
      targetId,
      parseResumeRenderOptions(options),
    )));
  });

jobResumeRender
  .command("compose-show <target-id>")
  .description("Print the canonical Job resume render document as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobResumeRenderDocument(getWorkspace(), targetId), null, 2)}\n`,
    );
  });

jobResumeRender
  .command("compose-status <target-id>")
  .option("--profile <profile>", "ats-standard or compact-professional")
  .option("--page-size <size>", "A4 or LETTER")
  .option("--date-format <format>", "MMM-YYYY, YYYY, or exact-source")
  .description("Inspect Job canonical render integrity, approved-draft freshness, policy version, and options.")
  .action(async (targetId: string, options: ResumeRenderCliOptions) => {
    console.log(formatJobResumeRenderDocumentStatus(
      await getJobResumeRenderDocumentStatus(
        getWorkspace(),
        targetId,
        normalizeRoleResumeRenderOptions(parseResumeRenderOptions(options)),
      ),
    ));
  });

jobResumeRender
  .command("export <target-id>")
  .requiredOption("--format <format>", "markdown, html, docx, or pdf")
  .option("--profile <profile>", "ats-standard or compact-professional")
  .option("--page-size <size>", "A4 or LETTER")
  .option("--date-format <format>", "MMM-YYYY, YYYY, or exact-source")
  .option("--output-dir <path>", "safe relative subdirectory below the Job target export root")
  .option("--rebuild", "explicitly replace stale or invalid canonical/export artifacts")
  .description("Export one faithful format from the canonical Job resume render document.")
  .action(async (targetId: string, options: ResumeRenderExportCliOptions) => {
    console.log(formatExportJobResumeResult(await exportJobResume(getWorkspace(), targetId, {
      ...parseResumeRenderOptions(options),
      format: RoleResumeExportFormatSchema.parse(options.format),
      outputDir: options.outputDir,
    })));
  });

jobResumeRender
  .command("export-all <target-id>")
  .option("--profile <profile>", "ats-standard or compact-professional")
  .option("--page-size <size>", "A4 or LETTER")
  .option("--date-format <format>", "MMM-YYYY, YYYY, or exact-source")
  .option("--output-dir <path>", "safe relative subdirectory below the Job target export root")
  .option("--rebuild", "explicitly replace stale or invalid canonical/export artifacts")
  .description("Export Markdown, HTML, DOCX, and PDF from one canonical Job render document.")
  .action(async (targetId: string, options: ResumeRenderExportCliOptions) => {
    console.log(formatExportAllJobResumeResult(await exportAllJobResume(
      getWorkspace(),
      targetId,
      {
        ...parseResumeRenderOptions(options),
        outputDir: options.outputDir,
      },
    )));
  });

jobResumeRender
  .command("export-list <target-id>")
  .description("List persisted Job resume exports for one Job Target.")
  .action(async (targetId: string) => {
    console.log(formatJobResumeExportList(
      await listJobResumeExports(getWorkspace(), targetId),
    ));
  });

jobResumeRender
  .command("export-show <export-id>")
  .description("Print one Job resume export manifest as stable JSON.")
  .action(async (exportId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobResumeExport(getWorkspace(), exportId), null, 2)}\n`,
    );
  });

jobResumeRender
  .command("export-status <export-id>")
  .description("Inspect Job output, source-map, canonical dependency, renderer, and validation freshness.")
  .action(async (exportId: string) => {
    console.log(formatJobResumeExportStatus(
      await getJobResumeExportStatus(getWorkspace(), exportId),
    ));
  });

jobResumeRender
  .command("validate <export-id>")
  .description("Re-run structural and extracted-text validation for one stored Job resume export.")
  .action(async (exportId: string) => {
    process.stdout.write(
      `${JSON.stringify(await validateStoredJobResumeExport(getWorkspace(), exportId), null, 2)}\n`,
    );
  });

const jobRequirementProposal = target
  .command("job-requirements-proposal")
  .description("Generate and human-review optional model-assisted requirement proposals.");

jobRequirementProposal
  .command("generate <target-id>")
  .option("--refresh", "bypass a current cached proposal and call the configured provider")
  .description("Generate an untrusted proposal without candidate evidence or automatic approval.")
  .action(async (targetId: string, options: { refresh?: boolean }) => {
    console.log(formatJobRequirementProposalResult(
      await generateJobRequirementProposal(getWorkspace(), targetId, options),
    ));
  });

jobRequirementProposal
  .command("list <target-id>")
  .description("List stored Job Requirement Model proposals.")
  .action(async (targetId: string) => {
    console.log(formatJobRequirementProposalList(
      await listJobRequirementProposals(getWorkspace(), targetId),
    ));
  });

jobRequirementProposal
  .command("show <proposal-id>")
  .description("Print one normalized Job Requirement Model proposal as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobRequirementProposal(getWorkspace(), proposalId), null, 2)}\n`,
    );
  });

jobRequirementProposal
  .command("status <proposal-id>")
  .description("Inspect Job Requirement Model proposal lifecycle and review eligibility.")
  .action(async (proposalId: string) => {
    console.log(formatJobRequirementProposalStatus(
      await getJobRequirementProposalStatus(getWorkspace(), proposalId),
    ));
  });

jobRequirementProposal
  .command("replay <proposal-id>")
  .description("Replay cached response normalization without a model call.")
  .action(async (proposalId: string) => {
    const replay = await replayJobRequirementProposal(getWorkspace(), proposalId);
    console.log(`Proposal ID: ${replay.proposalId}`);
    console.log(`Original SHA-256: ${replay.originalSha256}`);
    console.log(`Replay SHA-256: ${replay.replaySha256}`);
    console.log(`Replay matches: ${replay.matches ? "yes" : "no"}`);
  });

jobRequirementProposal
  .command("review <proposal-id>")
  .option("--reviewer <name>", "optional human reviewer name")
  .description("Initialize a non-interactive review with pending decisions.")
  .action(async (proposalId: string, options: { reviewer?: string }) => {
    console.log(formatJobRequirementReviewStatus(
      await initializeJobRequirementReview(getWorkspace(), proposalId, {
        reviewerName: options.reviewer,
      }),
    ));
  });

jobRequirementProposal
  .command("review-show <proposal-id>")
  .description("Print a complete Job Requirement Model review as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(
      `${JSON.stringify(await showJobRequirementReview(getWorkspace(), proposalId), null, 2)}\n`,
    );
  });

jobRequirementProposal
  .command("review-status <proposal-id>")
  .description("Inspect Job Requirement Model review decisions and integrity.")
  .action(async (proposalId: string) => {
    console.log(formatJobRequirementReviewStatus(
      await getJobRequirementReviewStatus(getWorkspace(), proposalId),
    ));
  });

jobRequirementProposal
  .command("review-set <proposal-id> <requirement-id>")
  .option("--accept", "accept the reviewed requirement unchanged")
  .option("--reject", "exclude the reviewed requirement")
  .option("--edit-file <path>", "JSON file containing reviewed normalized fields")
  .option("--note <note>", "optional human review note")
  .description("Set exactly one pending requirement review decision.")
  .action(async (
    proposalId: string,
    requirementId: string,
    options: { accept?: boolean; reject?: boolean; editFile?: string; note?: string },
  ) => {
    const choices =
      Number(Boolean(options.accept)) +
      Number(Boolean(options.reject)) +
      Number(Boolean(options.editFile));
    if (choices !== 1) {
      throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
    }
    const editedRequirement = options.editFile
      ? await readEditedJobRequirementFile(options.editFile)
      : undefined;
    console.log(formatJobRequirementReviewStatus(
      await setJobRequirementReviewDecision(
        getWorkspace(),
        proposalId,
        requirementId,
        {
          decision: options.accept ? "accept" : options.reject ? "reject" : "edit",
          editedRequirement,
          reviewNote: options.note,
        },
      ),
    ));
  });

jobRequirementProposal
  .command("review-complete <proposal-id>")
  .description("Complete review after every deterministic and proposed requirement is decided.")
  .action(async (proposalId: string) => {
    console.log(formatJobRequirementReviewStatus(
      await completeJobRequirementReview(getWorkspace(), proposalId),
    ));
  });

const proposal = target.command("proposal").description("Generate, inspect, replay, and review model-assisted interpretation proposals.");

proposal
  .command("generate <target-id>")
  .option("--refresh", "bypass a valid cached proposal and call the configured provider again")
  .description("Generate a model-assisted proposal without approving it or loading candidate evidence.")
  .action(async (targetId: string, options: { refresh?: boolean }) => {
    const workspace = getWorkspace();
    console.log(formatProposalGenerationResult(
      await generateInterpretationProposal(workspace, targetId, { refresh: options.refresh }),
    ));
  });

proposal
  .command("list <target-id>")
  .description("List stored interpretation proposals for a target.")
  .action(async (targetId: string) => {
    console.log(formatProposalList(await listInterpretationProposals(getWorkspace(), targetId)));
  });

proposal
  .command("show <proposal-id>")
  .description("Print one normalized proposal as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showInterpretationProposal(getWorkspace(), proposalId), null, 2)}\n`);
  });

proposal
  .command("status <proposal-id>")
  .description("Inspect proposal integrity, dependencies, and review eligibility.")
  .action(async (proposalId: string) => {
    console.log(formatProposalStatus(await getInterpretationProposalStatus(getWorkspace(), proposalId)));
  });

proposal
  .command("replay <proposal-id>")
  .description("Replay normalization and validation from the exact cached raw response without a model call.")
  .action(async (proposalId: string) => {
    const result = await replayInterpretationProposal(getWorkspace(), proposalId);
    console.log(`Proposal ID: ${result.proposalId}`);
    console.log(`Original SHA-256: ${result.originalSha256}`);
    console.log(`Replay SHA-256: ${result.replaySha256}`);
    console.log(`Replay matches: ${result.matches ? "yes" : "no"}`);
  });

proposal
  .command("review-init <proposal-id>")
  .option("--reviewer <name>", "optional human reviewer name")
  .description("Initialize a non-interactive human review with pending decisions.")
  .action(async (proposalId: string, options: { reviewer?: string }) => {
    console.log(formatProposalReviewStatus(
      await initializeProposalReview(getWorkspace(), proposalId, { reviewerName: options.reviewer }),
    ));
  });

proposal
  .command("review-show <proposal-id>")
  .description("Print the complete review artifact as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showProposalReview(getWorkspace(), proposalId), null, 2)}\n`);
  });

proposal
  .command("review-status <proposal-id>")
  .description("Inspect review decision counts and manifest integrity.")
  .action(async (proposalId: string) => {
    console.log(formatProposalReviewStatus(await getProposalReviewStatus(getWorkspace(), proposalId)));
  });

proposal
  .command("review-set <proposal-id> <expectation-id>")
  .option("--accept", "accept the proposed expectation unchanged")
  .option("--reject", "reject the proposed expectation")
  .option("--edit-file <path>", "JSON file containing reviewed edited expectation fields")
  .option("--note <note>", "optional human review note")
  .description("Set exactly one pending proposal decision.")
  .action(async (
    proposalId: string,
    expectationId: string,
    options: { accept?: boolean; reject?: boolean; editFile?: string; note?: string },
  ) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
    if (choices !== 1) throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
    const editedExpectation = options.editFile
      ? await readEditedExpectationFile(options.editFile)
      : undefined;
    const decision = options.accept ? "accept" : options.reject ? "reject" : "edit";
    console.log(formatProposalReviewStatus(await setProposalReviewDecision(
      getWorkspace(),
      proposalId,
      expectationId,
      { decision, editedExpectation, reviewNote: options.note },
    )));
  });

proposal
  .command("review-complete <proposal-id>")
  .description("Complete a review after every proposed expectation has one decision.")
  .action(async (proposalId: string) => {
    console.log(formatProposalReviewStatus(await completeProposalReview(getWorkspace(), proposalId)));
  });

const approvedInterpretation = target.command("interpretation").description("Approve and inspect human-reviewed semantic target interpretations.");

approvedInterpretation
  .command("approve <proposal-id>")
  .description("Create a separate approved interpretation from deterministic input, proposal, and completed review.")
  .action(async (proposalId: string) => {
    console.log(formatApprovalResult(await approveInterpretationProposal(getWorkspace(), proposalId)));
  });

approvedInterpretation
  .command("approved-show <target-id>")
  .description("Print a reviewed approved target interpretation as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showApprovedTargetInterpretation(getWorkspace(), targetId), null, 2)}\n`);
  });

approvedInterpretation
  .command("approved-status <target-id>")
  .description("Inspect approved interpretation integrity and dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatApprovedInterpretationStatus(
      await getApprovedInterpretationStatus(getWorkspace(), targetId),
    ));
  });

const manualMatch = target.command("match").description("Create and inspect human-approved target-to-evidence links.");

manualMatch
  .command("add <target-id>")
  .requiredOption("--expectation <expectation-id>", "approved target expectation ID")
  .requiredOption("--evidence <evidence-id...>", "one or more reviewed eligible evidence IDs")
  .requiredOption("--type <type>", "direct, supporting, partial, or contradictory")
  .requiredOption("--coverage <coverage>", "full, partial, or conflicting")
  .requiredOption("--strength <strength>", "strong, medium, weak, or unknown")
  .requiredOption("--temporal <relevance>", "current, recent, historical, or unknown")
  .requiredOption("--confidence <confidence>", "high, medium, or low")
  .requiredOption("--rationale-file <path>", "UTF-8 file containing the human rationale")
  .option("--limitation <limitation...>", "explicit limitations")
  .option("--note <note...>", "review notes")
  .description("Add a manual-approved evidence match without invoking a model.")
  .action(async (targetId: string, options: {
    expectation: string;
    evidence: string[];
    type: "direct" | "supporting" | "partial" | "contradictory";
    coverage: "full" | "partial" | "conflicting";
    strength: "strong" | "medium" | "weak" | "unknown";
    temporal: "current" | "recent" | "historical" | "unknown";
    confidence: "high" | "medium" | "low";
    rationaleFile: string;
    limitation?: string[];
    note?: string[];
  }) => {
    const rationale = await readFile(options.rationaleFile, "utf8");
    console.log(formatManualMatchResult(await addManualEvidenceMatch(getWorkspace(), targetId, {
      expectationId: options.expectation,
      evidenceIds: options.evidence,
      matchType: options.type,
      coverage: options.coverage,
      evidenceStrength: options.strength,
      temporalRelevance: options.temporal,
      matchConfidence: options.confidence,
      rationale,
      limitations: options.limitation,
      notes: options.note,
    })));
  });

manualMatch
  .command("list <target-id>")
  .description("List manual-approved matches for one target.")
  .action(async (targetId: string) => {
    console.log(formatManualMatchList(await listManualEvidenceMatches(getWorkspace(), targetId)));
  });

manualMatch
  .command("show <match-id>")
  .description("Print one manual-approved match as stable JSON.")
  .action(async (matchId: string) => {
    process.stdout.write(`${JSON.stringify(await showManualEvidenceMatch(getWorkspace(), matchId), null, 2)}\n`);
  });

manualMatch
  .command("remove <match-id>")
  .option("--reason <reason>", "audit reason for removal")
  .description("Remove a manual match while preserving a tombstone.")
  .action(async (matchId: string, options: { reason?: string }) => {
    await removeManualEvidenceMatch(getWorkspace(), matchId, { reason: options.reason });
    console.log(`Removed manual match with audit tombstone: ${matchId}`);
  });

const matchProposal = target.command("match-proposal").description("Generate, inspect, replay, and review optional model-assisted match proposals.");

matchProposal
  .command("generate <target-id>")
  .option("--refresh", "bypass a current cached proposal")
  .description("Generate match proposals only; no match is approved automatically.")
  .action(async (targetId: string, options: { refresh?: boolean }) => {
    console.log(formatMatchProposalResult(await generateEvidenceMatchProposal(getWorkspace(), targetId, { refresh: options.refresh })));
  });

matchProposal
  .command("list <target-id>")
  .description("List stored match proposals for a target.")
  .action(async (targetId: string) => {
    console.log(formatMatchProposalList(await listEvidenceMatchProposals(getWorkspace(), targetId)));
  });

matchProposal
  .command("show <proposal-id>")
  .description("Print one normalized match proposal as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showEvidenceMatchProposal(getWorkspace(), proposalId), null, 2)}\n`);
  });

matchProposal
  .command("status <proposal-id>")
  .description("Inspect match proposal integrity, dependencies, and review eligibility.")
  .action(async (proposalId: string) => {
    console.log(formatMatchProposalStatus(await getEvidenceMatchProposalStatus(getWorkspace(), proposalId)));
  });

matchProposal
  .command("replay <proposal-id>")
  .description("Replay strict validation from the exact cached raw response without a provider call.")
  .action(async (proposalId: string) => {
    const result = await replayEvidenceMatchProposal(getWorkspace(), proposalId);
    console.log(`Proposal ID: ${result.proposalId}`);
    console.log(`Original SHA-256: ${result.originalSha256}`);
    console.log(`Replay SHA-256: ${result.replaySha256}`);
    console.log(`Replay matches: ${result.matches ? "yes" : "no"}`);
  });

matchProposal
  .command("review-init <proposal-id>")
  .option("--reviewer <name>", "optional human reviewer name")
  .description("Initialize pending human decisions for every proposed match and coverage record.")
  .action(async (proposalId: string, options: { reviewer?: string }) => {
    console.log(formatEvidenceMatchReviewStatus(await initializeEvidenceMatchReview(getWorkspace(), proposalId, { reviewerName: options.reviewer })));
  });

matchProposal
  .command("review-show <proposal-id>")
  .description("Print the complete match review as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showEvidenceMatchReview(getWorkspace(), proposalId), null, 2)}\n`);
  });

matchProposal
  .command("review-status <proposal-id>")
  .description("Inspect match and coverage decision counts and integrity.")
  .action(async (proposalId: string) => {
    console.log(formatEvidenceMatchReviewStatus(await getEvidenceMatchReviewStatus(getWorkspace(), proposalId)));
  });

matchProposal
  .command("review-set <proposal-id> <proposed-match-id>")
  .option("--accept", "accept the proposed match unchanged")
  .option("--reject", "reject the proposed match")
  .option("--edit-file <path>", "JSON file containing reviewed edited match fields")
  .option("--note <note>", "optional review note")
  .description("Set exactly one pending proposed-match decision.")
  .action(async (proposalId: string, proposedMatchId: string, options: { accept?: boolean; reject?: boolean; editFile?: string; note?: string }) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
    if (choices !== 1) throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
    const editedMatch = options.editFile ? await readEditedEvidenceMatchFile(options.editFile) : undefined;
    console.log(formatEvidenceMatchReviewStatus(await setEvidenceMatchReviewDecision(getWorkspace(), proposalId, proposedMatchId, {
      decision: options.accept ? "accept" : options.reject ? "reject" : "edit",
      editedMatch,
      reviewNote: options.note,
    })));
  });

matchProposal
  .command("review-set-coverage <proposal-id> <proposed-coverage-id>")
  .option("--accept", "accept the proposed coverage status")
  .option("--reject", "reject the proposed coverage decision")
  .option("--status <status>", "replace with matched, partially-matched, unsupported, not-assessed, or conflicting")
  .option("--note <note>", "optional review note")
  .description("Set exactly one pending expectation-coverage decision.")
  .action(async (proposalId: string, proposedCoverageId: string, options: { accept?: boolean; reject?: boolean; status?: "matched" | "partially-matched" | "unsupported" | "not-assessed" | "conflicting"; note?: string }) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.status));
    if (choices !== 1) throw new Error("Choose exactly one of --accept, --reject, or --status.");
    console.log(formatEvidenceMatchReviewStatus(await setEvidenceCoverageReviewDecision(getWorkspace(), proposalId, proposedCoverageId, {
      decision: options.accept ? "accept" : options.reject ? "reject" : "edit",
      editedStatus: options.status,
      reviewNote: options.note,
    })));
  });

matchProposal
  .command("review-complete <proposal-id>")
  .description("Complete review only after every proposed match and coverage record has one decision.")
  .action(async (proposalId: string) => {
    console.log(formatEvidenceMatchReviewStatus(await completeEvidenceMatchReview(getWorkspace(), proposalId)));
  });

const approvedMatching = target.command("matching").description("Approve and inspect reviewed target-to-evidence matching.");

approvedMatching
  .command("status <target-id>")
  .description("Inspect approved matching lifecycle and dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatApprovedMatchingStatus(await getApprovedEvidenceMatchingStatus(getWorkspace(), targetId)));
  });

approvedMatching
  .command("show <target-id>")
  .description("Print approved target evidence matching as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showApprovedEvidenceMatching(getWorkspace(), targetId), null, 2)}\n`);
  });

approvedMatching
  .command("approve <proposal-id>")
  .option("--rebuild", "explicitly rebuild stale approved matching after review")
  .description("Merge manual-approved and human-reviewed matches without a provider call.")
  .action(async (proposalId: string, options: { rebuild?: boolean }) => {
    console.log(formatApproveEvidenceMatchingResult(await approveEvidenceMatchProposal(getWorkspace(), proposalId, { rebuild: options.rebuild })));
  });

approvedMatching
  .command("approved-show <target-id>")
  .description("Print approved matching as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showApprovedEvidenceMatching(getWorkspace(), targetId), null, 2)}\n`);
  });

approvedMatching
  .command("approved-status <target-id>")
  .description("Inspect approved matching integrity and dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatApprovedMatchingStatus(await getApprovedEvidenceMatchingStatus(getWorkspace(), targetId)));
  });

const assess = target.command("assess").description("Build and inspect deterministic fit and proof assessments from current approved inputs.");

assess
  .command("build <target-id>")
  .option("--rebuild", "explicitly rebuild a stale or invalid deterministic assessment")
  .description("Build expectation-level support and proof analysis without generating resume or application content.")
  .action(async (targetId: string, options: { rebuild?: boolean }) => {
    console.log(formatBuildFitAssessmentResult(await buildFitAssessment(getWorkspace(), targetId, { rebuild: options.rebuild })));
  });

assess
  .command("show <target-id>")
  .description("Print the deterministic fit and proof assessment as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showFitAssessment(getWorkspace(), targetId, "deterministic"), null, 2)}\n`);
  });

assess
  .command("status <target-id>")
  .description("Inspect deterministic assessment integrity and dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatFitAssessmentStatus(await getFitAssessmentStatus(getWorkspace(), targetId, "deterministic")));
  });

const assessProposal = target.command("assess-proposal").description("Generate, inspect, replay, and review optional model-assisted assessment proposals.");

assessProposal
  .command("generate <target-id>")
  .option("--refresh", "bypass a valid cached proposal and call the configured provider again")
  .description("Generate an assessment proposal only; no output is approved automatically.")
  .action(async (targetId: string, options: { refresh?: boolean }) => {
    console.log(formatFitAssessmentProposalResult(await generateFitAssessmentProposal(getWorkspace(), targetId, { refresh: options.refresh })));
  });

assessProposal
  .command("list <target-id>")
  .description("List stored fit assessment proposals for a target.")
  .action(async (targetId: string) => {
    console.log(formatFitAssessmentProposalList(await listFitAssessmentProposals(getWorkspace(), targetId)));
  });

assessProposal
  .command("show <proposal-id>")
  .description("Print one normalized fit assessment proposal as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showFitAssessmentProposal(getWorkspace(), proposalId), null, 2)}\n`);
  });

assessProposal
  .command("status <proposal-id>")
  .description("Inspect proposal integrity, dependencies, and review eligibility.")
  .action(async (proposalId: string) => {
    console.log(formatFitAssessmentProposalStatus(await getFitAssessmentProposalStatus(getWorkspace(), proposalId)));
  });

assessProposal
  .command("replay <proposal-id>")
  .description("Replay strict normalization from the exact stored raw response without a provider call.")
  .action(async (proposalId: string) => {
    const result = await replayFitAssessmentProposal(getWorkspace(), proposalId);
    console.log(`Proposal ID: ${result.proposalId}`);
    console.log(`Original SHA-256: ${result.originalSha256}`);
    console.log(`Replay SHA-256: ${result.replaySha256}`);
    console.log(`Replay matches: ${result.matches ? "yes" : "no"}`);
  });

assessProposal
  .command("review-init <proposal-id>")
  .option("--reviewer <name>", "optional human reviewer name")
  .description("Initialize pending decisions for every proposed assessment and its summary.")
  .action(async (proposalId: string, options: { reviewer?: string }) => {
    console.log(formatFitAssessmentReviewStatus(await initializeFitAssessmentReview(getWorkspace(), proposalId, { reviewerName: options.reviewer })));
  });

assessProposal
  .command("review-show <proposal-id>")
  .description("Print the complete assessment review as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showFitAssessmentReview(getWorkspace(), proposalId), null, 2)}\n`);
  });

assessProposal
  .command("review-status <proposal-id>")
  .description("Inspect assessment decision counts and manifest integrity.")
  .action(async (proposalId: string) => {
    console.log(formatFitAssessmentReviewStatus(await getFitAssessmentReviewStatus(getWorkspace(), proposalId)));
  });

assessProposal
  .command("review-set <proposal-id> <expectation-assessment-id>")
  .option("--accept", "accept the proposed expectation assessment unchanged")
  .option("--reject", "reject and use the deterministic fallback")
  .option("--edit-file <path>", "JSON file containing complete reviewed assessment fields")
  .option("--note <note>", "optional review note")
  .description("Set exactly one pending expectation-assessment decision.")
  .action(async (proposalId: string, assessmentId: string, options: { accept?: boolean; reject?: boolean; editFile?: string; note?: string }) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
    if (choices !== 1) throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
    const editedAssessment = options.editFile ? await readEditedFitAssessmentFile(options.editFile) : undefined;
    console.log(formatFitAssessmentReviewStatus(await setFitAssessmentReviewDecision(getWorkspace(), proposalId, assessmentId, {
      decision: options.accept ? "accept" : options.reject ? "reject" : "edit",
      editedAssessment,
      reviewNote: options.note,
    })));
  });

assessProposal
  .command("review-set-summary <proposal-id>")
  .option("--accept", "accept the proposed summary unchanged")
  .option("--reject", "reject and use the deterministic summary")
  .option("--edit-file <path>", "JSON file containing a complete reviewed role or job summary")
  .option("--note <note>", "optional review note")
  .description("Set the pending assessment-summary decision.")
  .action(async (proposalId: string, options: { accept?: boolean; reject?: boolean; editFile?: string; note?: string }) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
    if (choices !== 1) throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
    const editedSummary = options.editFile ? await readEditedFitAssessmentSummaryFile(options.editFile) : undefined;
    console.log(formatFitAssessmentReviewStatus(await setFitAssessmentSummaryReviewDecision(getWorkspace(), proposalId, {
      decision: options.accept ? "accept" : options.reject ? "reject" : "edit",
      editedSummary,
      reviewNote: options.note,
    })));
  });

assessProposal
  .command("review-complete <proposal-id>")
  .description("Complete review only after every expectation and summary has one decision.")
  .action(async (proposalId: string) => {
    console.log(formatFitAssessmentReviewStatus(await completeFitAssessmentReview(getWorkspace(), proposalId)));
  });

const assessment = target.command("assessment").description("Approve and inspect human-reviewed fit and proof assessments.");

assessment
  .command("approve <proposal-id>")
  .option("--rebuild", "explicitly rebuild a stale approved assessment after reviewing dependency changes")
  .description("Create an approved assessment without a provider call.")
  .action(async (proposalId: string, options: { rebuild?: boolean }) => {
    console.log(formatApproveFitAssessmentResult(await approveFitAssessmentProposal(getWorkspace(), proposalId, { rebuild: options.rebuild })));
  });

assessment
  .command("approved-show <target-id>")
  .description("Print the current approved fit and proof assessment as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showFitAssessment(getWorkspace(), targetId, "approved"), null, 2)}\n`);
  });

assessment
  .command("approved-status <target-id>")
  .description("Inspect approved assessment integrity and dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatFitAssessmentStatus(await getFitAssessmentStatus(getWorkspace(), targetId, "approved")));
  });

const resumePlan = target.command("resume-plan").description("Build, approve, and inspect role-positioning resume content plans without writing resume prose.");

resumePlan
  .command("build <target-id>")
  .option("--rebuild", "explicitly rebuild a stale or invalid deterministic plan")
  .option("--allow-partial", "allow an explicitly partial planning artifact that remains unusable for drafting")
  .description("Build a deterministic Role Resume Content Plan from current approved role artifacts.")
  .action(async (targetId: string, options: { rebuild?: boolean; allowPartial?: boolean }) => {
    console.log(formatBuildRoleResumePlanResult(await buildRoleResumePlan(getWorkspace(), targetId, { rebuild: options.rebuild, allowPartial: options.allowPartial })));
  });

resumePlan
  .command("show <target-id>")
  .description("Print the deterministic Role Resume Content Plan as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumePlan(getWorkspace(), targetId), null, 2)}\n`);
  });

resumePlan
  .command("status <target-id>")
  .description("Inspect deterministic role resume plan integrity and dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatRoleResumePlanStatus(await getRoleResumePlanStatus(getWorkspace(), targetId)));
  });

resumePlan
  .command("approve <proposal-id>")
  .option("--rebuild", "explicitly rebuild a stale approved plan after reviewing dependency changes")
  .description("Create an approved Role Resume Content Plan without a provider call.")
  .action(async (proposalId: string, options: { rebuild?: boolean }) => {
    console.log(formatApproveRoleResumePlanResult(await approveRoleResumePlanProposal(getWorkspace(), proposalId, { rebuild: options.rebuild })));
  });

resumePlan
  .command("approved-show <target-id>")
  .description("Print the current approved Role Resume Content Plan as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumePlan(getWorkspace(), targetId, "approved"), null, 2)}\n`);
  });

resumePlan
  .command("approved-status <target-id>")
  .description("Inspect approved role resume plan integrity and dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatRoleResumePlanStatus(await getRoleResumePlanStatus(getWorkspace(), targetId, "approved")));
  });

const resumePlanProposal = target.command("resume-plan-proposal").description("Generate, inspect, replay, and review optional model-assisted Role Resume Content Plan proposals.");

resumePlanProposal
  .command("generate <target-id>")
  .option("--refresh", "bypass a valid cached proposal and call the configured provider again")
  .description("Generate a structured plan proposal only; no output is approved automatically.")
  .action(async (targetId: string, options: { refresh?: boolean }) => {
    console.log(formatRoleResumePlanProposalResult(await generateRoleResumePlanProposal(getWorkspace(), targetId, { refresh: options.refresh })));
  });

resumePlanProposal
  .command("list <target-id>")
  .description("List stored Role Resume Content Plan proposals.")
  .action(async (targetId: string) => {
    console.log(formatRoleResumePlanProposalList(await listRoleResumePlanProposals(getWorkspace(), targetId)));
  });

resumePlanProposal
  .command("show <proposal-id>")
  .description("Print one normalized Role Resume Content Plan proposal as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumePlanProposal(getWorkspace(), proposalId), null, 2)}\n`);
  });

resumePlanProposal
  .command("status <proposal-id>")
  .description("Inspect proposal integrity, dependencies, and review eligibility.")
  .action(async (proposalId: string) => {
    console.log(formatRoleResumePlanProposalStatus(await getRoleResumePlanProposalStatus(getWorkspace(), proposalId)));
  });

resumePlanProposal
  .command("replay <proposal-id>")
  .description("Replay strict normalization from the exact stored raw response without a provider call.")
  .action(async (proposalId: string) => {
    const result = await replayRoleResumePlanProposal(getWorkspace(), proposalId);
    console.log(`Proposal ID: ${result.proposalId}`);
    console.log(`Original SHA-256: ${result.originalSha256}`);
    console.log(`Replay SHA-256: ${result.replaySha256}`);
    console.log(`Replay matches: ${result.matches ? "yes" : "no"}`);
  });

resumePlanProposal
  .command("review-init <proposal-id>")
  .option("--reviewer <name>", "optional human reviewer name")
  .description("Initialize pending decisions for every proposed plan element.")
  .action(async (proposalId: string, options: { reviewer?: string }) => {
    await initializeRoleResumePlanReview(getWorkspace(), proposalId, { reviewerName: options.reviewer });
    console.log(formatRoleResumePlanReviewStatus(await getRoleResumePlanReviewStatus(getWorkspace(), proposalId)));
  });

resumePlanProposal
  .command("review-show <proposal-id>")
  .description("Print the complete Role Resume Content Plan review as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumePlanReview(getWorkspace(), proposalId), null, 2)}\n`);
  });

resumePlanProposal
  .command("review-status <proposal-id>")
  .description("Inspect plan decision counts and manifest integrity.")
  .action(async (proposalId: string) => {
    console.log(formatRoleResumePlanReviewStatus(await getRoleResumePlanReviewStatus(getWorkspace(), proposalId)));
  });

for (const itemType of ["positioning", "section", "expectation", "evidence", "claim-boundary", "exclusion"] as RoleResumePlanReviewDecision["itemType"][]) {
  resumePlanProposal
    .command(`review-set-${itemType} <proposal-id> <item-id>`)
    .option("--accept", "accept the proposed plan element unchanged")
    .option("--reject", "reject and use the deterministic fallback")
    .option("--edit-file <path>", "JSON file containing the complete edited plan element")
    .option("--note <note>", "optional review note")
    .description(`Set exactly one pending ${itemType} plan decision.`)
    .action(async (proposalId: string, itemId: string, options: { accept?: boolean; reject?: boolean; editFile?: string; note?: string }) => {
      const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
      if (choices !== 1) throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
      const editedValue = options.editFile ? await readRoleResumePlanReviewEdit(options.editFile) : undefined;
      await setRoleResumePlanReviewDecision(getWorkspace(), proposalId, itemType, itemId, {
        decision: options.accept ? "accept" : options.reject ? "reject" : "edit",
        editedValue,
        reviewNote: options.note,
      });
      console.log(formatRoleResumePlanReviewStatus(await getRoleResumePlanReviewStatus(getWorkspace(), proposalId)));
    });
}

resumePlanProposal
  .command("review-complete <proposal-id>")
  .description("Complete review only after every proposed plan element has one valid decision.")
  .action(async (proposalId: string) => {
    console.log(formatRoleResumePlanReviewStatus(await completeRoleResumePlanReview(getWorkspace(), proposalId)));
  });

const resumeDraft = target.command("resume-draft").description("Build deterministic role resume draft scaffolds and approve reviewed structured drafts.");

resumeDraft
  .command("scaffold-build <target-id>")
  .option("--rebuild", "explicitly rebuild a stale or invalid deterministic draft scaffold")
  .description("Build a prose-free deterministic draft scaffold from the current approved Role Resume Content Plan.")
  .action(async (targetId: string, options: { rebuild?: boolean }) => {
    console.log(formatBuildRoleResumeDraftScaffoldResult(await buildRoleResumeDraftScaffold(getWorkspace(), targetId, { rebuild: options.rebuild })));
  });

resumeDraft
  .command("scaffold-show <target-id>")
  .description("Print the deterministic role resume draft scaffold as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumeDraftScaffold(getWorkspace(), targetId), null, 2)}\n`);
  });

resumeDraft
  .command("scaffold-status <target-id>")
  .description("Inspect scaffold integrity and approved dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatRoleResumeDraftScaffoldStatus(await getRoleResumeDraftScaffoldStatus(getWorkspace(), targetId)));
  });

resumeDraft
  .command("approve <proposal-id>")
  .option("--rebuild", "explicitly rebuild a stale approved structured draft after review")
  .description("Create an approved structured Role Resume Draft without a model call or document rendering.")
  .action(async (proposalId: string, options: { rebuild?: boolean }) => {
    console.log(formatApproveRoleResumeDraftResult(await approveRoleResumeDraftProposal(getWorkspace(), proposalId, { rebuild: options.rebuild })));
  });

resumeDraft
  .command("approved-show <target-id>")
  .description("Print the current approved structured Role Resume Draft as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showApprovedRoleResumeDraft(getWorkspace(), targetId), null, 2)}\n`);
  });

resumeDraft
  .command("approved-status <target-id>")
  .description("Inspect approved draft integrity, provenance, and dependency freshness.")
  .action(async (targetId: string) => {
    console.log(formatApprovedRoleResumeDraftStatus(await getApprovedRoleResumeDraftStatus(getWorkspace(), targetId)));
  });

const resumeDraftProposal = target.command("resume-draft-proposal").description("Generate, inspect, replay, and review optional model-assisted structured Role Resume Draft proposals.");

resumeDraftProposal
  .command("generate <target-id>")
  .option("--refresh", "bypass a valid cached proposal and call the configured provider again")
  .description("Generate structured draft wording only; no output is approved or rendered automatically.")
  .action(async (targetId: string, options: { refresh?: boolean }) => {
    console.log(formatRoleResumeDraftProposalResult(await generateRoleResumeDraftProposal(getWorkspace(), targetId, { refresh: options.refresh })));
  });

resumeDraftProposal
  .command("list <target-id>")
  .description("List stored structured Role Resume Draft proposals.")
  .action(async (targetId: string) => {
    console.log(formatRoleResumeDraftProposalList(await listRoleResumeDraftProposals(getWorkspace(), targetId)));
  });

resumeDraftProposal
  .command("show <proposal-id>")
  .description("Print one normalized structured Role Resume Draft proposal as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumeDraftProposal(getWorkspace(), proposalId), null, 2)}\n`);
  });

resumeDraftProposal
  .command("status <proposal-id>")
  .description("Inspect draft proposal integrity, dependencies, and review eligibility.")
  .action(async (proposalId: string) => {
    console.log(formatRoleResumeDraftProposalStatus(await getRoleResumeDraftProposalStatus(getWorkspace(), proposalId)));
  });

resumeDraftProposal
  .command("replay <proposal-id>")
  .description("Replay parsing and validation from the exact stored raw response without a provider call.")
  .action(async (proposalId: string) => {
    const result = await replayRoleResumeDraftProposal(getWorkspace(), proposalId);
    console.log(`Proposal ID: ${result.proposalId}`);
    console.log(`Original SHA-256: ${result.originalSha256}`);
    console.log(`Replay SHA-256: ${result.replaySha256}`);
    console.log(`Replay matches: ${result.matches ? "yes" : "no"}`);
  });

resumeDraftProposal
  .command("review-init <proposal-id>")
  .option("--reviewer <name>", "optional human reviewer name")
  .description("Initialize pending section, statement, claim-ledger, ordering, and ambiguity decisions.")
  .action(async (proposalId: string, options: { reviewer?: string }) => {
    await initializeRoleResumeDraftReview(getWorkspace(), proposalId, { reviewerName: options.reviewer });
    console.log(formatRoleResumeDraftReviewStatus(await getRoleResumeDraftReviewStatus(getWorkspace(), proposalId)));
  });

resumeDraftProposal
  .command("review-show <proposal-id>")
  .description("Print the complete Role Resume Draft review as stable JSON.")
  .action(async (proposalId: string) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumeDraftReview(getWorkspace(), proposalId), null, 2)}\n`);
  });

resumeDraftProposal
  .command("review-status <proposal-id>")
  .description("Inspect structured draft decision counts and manifest integrity.")
  .action(async (proposalId: string) => {
    console.log(formatRoleResumeDraftReviewStatus(await getRoleResumeDraftReviewStatus(getWorkspace(), proposalId)));
  });

for (const itemType of ["section", "draft-item", "claim-ledger", "section-order", "ambiguity"] as RoleResumeDraftReviewDecision["itemType"][]) {
  resumeDraftProposal
    .command(`review-set-${itemType} <proposal-id> <item-id>`)
    .option("--accept", "accept the proposed draft element unchanged")
    .option("--reject", "reject the proposed draft element")
    .option("--edit-file <path>", "file containing edited text or complete edited JSON")
    .option("--note <note>", "optional review rationale")
    .description(`Set exactly one pending ${itemType} draft decision.`)
    .action(async (proposalId: string, itemId: string, options: { accept?: boolean; reject?: boolean; editFile?: string; note?: string }) => {
      const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
      if (choices !== 1) throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
      const editedValue = options.editFile ? await readRoleResumeDraftReviewEdit(options.editFile) : undefined;
      await setRoleResumeDraftReviewDecision(getWorkspace(), proposalId, itemType, itemId, {
        decision: options.accept ? "accept" : options.reject ? "reject" : "edit",
        editedValue,
        reviewNote: options.note,
      });
      console.log(formatRoleResumeDraftReviewStatus(await getRoleResumeDraftReviewStatus(getWorkspace(), proposalId)));
    });
}

resumeDraftProposal
  .command("review-complete <proposal-id>")
  .description("Complete review only after every required structured draft decision is valid and resolved.")
  .action(async (proposalId: string) => {
    console.log(formatRoleResumeDraftReviewStatus(await completeRoleResumeDraftReview(getWorkspace(), proposalId)));
  });

const resumeRender = target.command("resume-render").description("Compose and export current approved Role Resume Drafts without changing approved wording.");

resumeRender
  .command("compose <target-id>")
  .option("--profile <profile>", "ats-standard or compact-professional")
  .option("--page-size <size>", "A4 or LETTER")
  .option("--date-format <format>", "MMM-YYYY, YYYY, or exact-source")
  .option("--rebuild", "explicitly replace a stale or invalid canonical render document")
  .description("Compose the canonical deterministic render document from the current approved Role Resume Draft.")
  .action(async (targetId: string, options: ResumeRenderCliOptions) => {
    console.log(formatComposeRoleResumeResult(await composeRoleResumeRenderDocument(
      getWorkspace(),
      targetId,
      parseResumeRenderOptions(options),
    )));
  });

resumeRender
  .command("compose-show <target-id>")
  .description("Print the canonical role resume render document as stable JSON.")
  .action(async (targetId: string) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumeRenderDocument(getWorkspace(), targetId), null, 2)}\n`);
  });

resumeRender
  .command("compose-status <target-id>")
  .option("--profile <profile>", "ats-standard or compact-professional")
  .option("--page-size <size>", "A4 or LETTER")
  .option("--date-format <format>", "MMM-YYYY, YYYY, or exact-source")
  .description("Inspect canonical render integrity, approved-draft freshness, policy version, and requested options.")
  .action(async (targetId: string, options: ResumeRenderCliOptions) => {
    console.log(formatRoleResumeRenderDocumentStatus(await getRoleResumeRenderDocumentStatus(
      getWorkspace(),
      targetId,
      normalizeRoleResumeRenderOptions(parseResumeRenderOptions(options)),
    )));
  });

resumeRender
  .command("export <target-id>")
  .requiredOption("--format <format>", "markdown, html, docx, or pdf")
  .option("--profile <profile>", "ats-standard or compact-professional")
  .option("--page-size <size>", "A4 or LETTER")
  .option("--date-format <format>", "MMM-YYYY, YYYY, or exact-source")
  .option("--output-dir <path>", "safe relative subdirectory below the target export root")
  .option("--rebuild", "explicitly replace stale or invalid canonical/export artifacts")
  .description("Export one faithful format from the canonical role resume render document.")
  .action(async (targetId: string, options: ResumeRenderExportCliOptions) => {
    console.log(formatExportRoleResumeResult(await exportRoleResume(getWorkspace(), targetId, {
      ...parseResumeRenderOptions(options),
      format: RoleResumeExportFormatSchema.parse(options.format),
      outputDir: options.outputDir,
    })));
  });

resumeRender
  .command("export-all <target-id>")
  .option("--profile <profile>", "ats-standard or compact-professional")
  .option("--page-size <size>", "A4 or LETTER")
  .option("--date-format <format>", "MMM-YYYY, YYYY, or exact-source")
  .option("--output-dir <path>", "safe relative subdirectory below the target export root")
  .option("--rebuild", "explicitly replace stale or invalid canonical/export artifacts")
  .description("Export Markdown, HTML, DOCX, and PDF from one canonical render document.")
  .action(async (targetId: string, options: ResumeRenderExportCliOptions) => {
    console.log(formatExportAllRoleResumeResult(await exportAllRoleResume(getWorkspace(), targetId, {
      ...parseResumeRenderOptions(options),
      outputDir: options.outputDir,
    })));
  });

resumeRender
  .command("export-list <target-id>")
  .description("List persisted role resume exports for one Role Target.")
  .action(async (targetId: string) => {
    console.log(formatRoleResumeExportList(await listRoleResumeExports(getWorkspace(), targetId)));
  });

resumeRender
  .command("export-show <export-id>")
  .description("Print one role resume export manifest as stable JSON.")
  .action(async (exportId: string) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumeExport(getWorkspace(), exportId), null, 2)}\n`);
  });

resumeRender
  .command("export-status <export-id>")
  .description("Inspect output, source-map, canonical dependency, renderer, and validation freshness.")
  .action(async (exportId: string) => {
    console.log(formatRoleResumeExportStatus(await getRoleResumeExportStatus(getWorkspace(), exportId)));
  });

resumeRender
  .command("validate <export-id>")
  .description("Re-run structural and extracted-text validation for one stored role resume export.")
  .action(async (exportId: string) => {
    process.stdout.write(`${JSON.stringify(await validateStoredRoleResumeExport(getWorkspace(), exportId), null, 2)}\n`);
  });

program
  .command("refresh")
  .description("Refresh the knowledge base and explain changes since the last successful state.")
  .action(async () => {
    const workspace = getWorkspace();
    const latest = await refreshWorkspace(workspace);
    console.log(`Refresh complete: ${workspace}`);
    console.log(formatChangesSummary(latest));
  });

program
  .command("changes")
  .description("Show a concise summary of the latest refresh changes.")
  .action(async () => {
    const workspace = getWorkspace();
    console.log(formatChangesSummary(await getLatestChanges(workspace)));
  });

program
  .command("status")
  .description("Show knowledge freshness, trust, privacy, and output staleness status.")
  .action(async () => {
    const workspace = getWorkspace();
    console.log(formatStatusSummary(await getWorkspaceStatus(workspace)));
  });

program
  .command("rebuild")
  .description("Backward-compatible alias for refresh.")
  .action(async () => {
    const workspace = getWorkspace();
    const latest = await refreshWorkspace(workspace);
    console.log(`Rebuild complete: ${workspace}`);
    console.log(formatChangesSummary(latest));
  });

function getWorkspace(): string {
  const options = program.opts<{ workspace?: string }>();
  return resolveWorkspace(options.workspace);
}

interface ResumeRenderCliOptions {
  profile?: string;
  pageSize?: string;
  dateFormat?: string;
  rebuild?: boolean;
}

interface ResumeRenderExportCliOptions extends ResumeRenderCliOptions {
  format?: string;
  outputDir?: string;
}

interface GuidedJobCreateCliOptions {
  file: string;
  title?: string;
  company?: string;
  location?: string;
  workingModel?: string;
  replace?: boolean;
}

interface GuidedJobRunCliOptions {
  requirementsSource?: string;
  snapshot?: string;
  upgradeSnapshot?: string;
  provider?: string;
  offline?: boolean;
  rebuildStale?: boolean;
  dryRun?: boolean;
}

interface GuidedJobFinalizeCliOptions {
  profile?: string;
  pageSize?: string;
  dateFormat?: string;
  formats: string;
  outputDir?: string;
  rebuildStale?: boolean;
  dryRun?: boolean;
}

function parseGuidedJobRunOptions(options: GuidedJobRunCliOptions) {
  return {
    requirementSource: JobRequirementInputTypeSchema.parse(
      options.requirementsSource ?? "deterministic",
    ),
    snapshotId: options.snapshot,
    upgradeSnapshotId: options.upgradeSnapshot,
    providerName: options.provider,
    offline: options.offline,
    rebuildStale: options.rebuildStale,
    dryRun: options.dryRun,
  };
}

function parseGuidedExportFormats(value: string) {
  const formats = value.split(",").map((entry) => entry.trim()).filter(Boolean);
  if (formats.length === 0) throw new Error("--formats must include at least one format.");
  return formats.map((format) => RoleResumeExportFormatSchema.parse(format));
}

function parseResumeRenderOptions(options: ResumeRenderCliOptions) {
  return {
    profile: options.profile ? RoleResumeRenderProfileNameSchema.parse(options.profile) : undefined,
    pageSize: options.pageSize ? RoleResumePageSizeSchema.parse(options.pageSize) : undefined,
    dateFormat: options.dateFormat ? RoleResumeDateFormatSchema.parse(options.dateFormat) : undefined,
    rebuild: options.rebuild,
  };
}

await program.parseAsync();
