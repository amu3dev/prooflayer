#!/usr/bin/env node
import { Command } from "commander";
import { readFile } from "node:fs/promises";
import { auditPrivacy, buildProfile, generateClaims, ingestSources, initWorkspace, normalizeEvidence, resolveWorkspace } from "./operations.js";
import { formatChangesSummary, formatStatusSummary, getLatestChanges, getWorkspaceStatus, refreshWorkspace } from "./update-impact.js";
import { isRoleKey } from "./role-variants.js";
import { formatVariantsSummary, generateAllRoleVariants, generateRoleVariant, listVariantStatuses } from "./variant-generator.js";
import { finalizeVariant, formatVariantReviewStatus, getVariantReviewStatus, initializeVariantReview } from "./variant-review.js";
import { formatPublicProfileSummary, initializePublicProfile, loadPublicProfile } from "./public-profile.js";
import { exportFinalResume, formatResumeExportStatus, getResumeExportStatus } from "./resume-export.js";
import { createJobTarget, createRoleTarget, formatTargetCreation, formatTargetJson, formatTargetList, listTargets, showTarget } from "./targets.js";
import { analyzeTarget, formatAnalyzeTargetResult, formatTargetAnalysisStatus, getTargetAnalysisStatus, showTargetAnalysis } from "./target-analysis.js";
import { formatInterpretTargetResult, formatTargetInterpretationStatus, getTargetInterpretationStatus, interpretTarget, showTargetInterpretation } from "./target-interpretation.js";
import { formatProposalGenerationResult, formatProposalList, formatProposalStatus, generateInterpretationProposal, getInterpretationProposalStatus, listInterpretationProposals, replayInterpretationProposal, showInterpretationProposal } from "./target-proposal.js";
import { completeProposalReview, formatProposalReviewStatus, getProposalReviewStatus, initializeProposalReview, readEditedExpectationFile, setProposalReviewDecision, showProposalReview } from "./target-proposal-review.js";
import { approveInterpretationProposal, formatApprovalResult, formatApprovedInterpretationStatus, getApprovedInterpretationStatus, showApprovedTargetInterpretation } from "./approved-interpretation.js";
import { addManualEvidenceMatch, formatApprovedMatchingStatus, formatManualMatchList, formatManualMatchResult, getApprovedEvidenceMatchingStatus, listManualEvidenceMatches, removeManualEvidenceMatch, showApprovedEvidenceMatching, showManualEvidenceMatch, } from "./evidence-matching.js";
import { formatMatchProposalList, formatMatchProposalResult, formatMatchProposalStatus, generateEvidenceMatchProposal, getEvidenceMatchProposalStatus, listEvidenceMatchProposals, replayEvidenceMatchProposal, showEvidenceMatchProposal, } from "./evidence-match-proposal.js";
import { completeEvidenceMatchReview, formatEvidenceMatchReviewStatus, getEvidenceMatchReviewStatus, initializeEvidenceMatchReview, readEditedEvidenceMatchFile, setEvidenceCoverageReviewDecision, setEvidenceMatchReviewDecision, showEvidenceMatchReview, } from "./evidence-match-review.js";
import { approveEvidenceMatchProposal, formatApproveEvidenceMatchingResult, } from "./approved-evidence-matching.js";
import { buildFitAssessment, formatBuildFitAssessmentResult, formatFitAssessmentStatus, getFitAssessmentStatus, showFitAssessment, } from "./fit-assessment.js";
import { formatFitAssessmentProposalList, formatFitAssessmentProposalResult, formatFitAssessmentProposalStatus, generateFitAssessmentProposal, getFitAssessmentProposalStatus, listFitAssessmentProposals, replayFitAssessmentProposal, showFitAssessmentProposal, } from "./fit-assessment-proposal.js";
import { completeFitAssessmentReview, formatFitAssessmentReviewStatus, getFitAssessmentReviewStatus, initializeFitAssessmentReview, readEditedFitAssessmentFile, readEditedFitAssessmentSummaryFile, setFitAssessmentReviewDecision, setFitAssessmentSummaryReviewDecision, showFitAssessmentReview, } from "./fit-assessment-review.js";
import { approveFitAssessmentProposal, formatApproveFitAssessmentResult, } from "./approved-fit-assessment.js";
import { buildRoleResumePlan, formatBuildRoleResumePlanResult, formatRoleResumePlanStatus, getRoleResumePlanStatus, showRoleResumePlan, } from "./role-resume-planning.js";
import { formatRoleResumePlanProposalList, formatRoleResumePlanProposalResult, formatRoleResumePlanProposalStatus, generateRoleResumePlanProposal, getRoleResumePlanProposalStatus, listRoleResumePlanProposals, replayRoleResumePlanProposal, showRoleResumePlanProposal, } from "./role-resume-plan-proposal.js";
import { completeRoleResumePlanReview, formatRoleResumePlanReviewStatus, getRoleResumePlanReviewStatus, initializeRoleResumePlanReview, readRoleResumePlanReviewEdit, setRoleResumePlanReviewDecision, showRoleResumePlanReview, } from "./role-resume-plan-review.js";
import { approveRoleResumePlanProposal, formatApproveRoleResumePlanResult, } from "./approved-role-resume-plan.js";
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
    .action(async (options) => {
    const workspace = getWorkspace();
    if (options.all && options.role)
        throw new Error("Use either --all or --role, not both.");
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
    .action(async (options) => {
    const workspace = getWorkspace();
    console.log(formatVariantReviewStatus(await initializeVariantReview(workspace, options.role)));
});
review
    .command("status")
    .requiredOption("--role <role-key>", "role key: tpm or ai-product")
    .description("Show output-specific decision counts and finalization readiness.")
    .action(async (options) => {
    const workspace = getWorkspace();
    console.log(formatVariantReviewStatus(await getVariantReviewStatus(workspace, options.role)));
});
const finalize = program.command("finalize").description("Generate reviewed final/public candidate outputs.");
finalize
    .command("variant")
    .requiredOption("--role <role-key>", "role key: tpm or ai-product")
    .description("Finalize one reviewed role variant using approved or revised claims only.")
    .action(async (options) => {
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
    .action(async (options) => {
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
    .action(async (options) => {
    const workspace = getWorkspace();
    console.log(formatResumeExportStatus(await getResumeExportStatus(workspace, options.role)));
});
const target = program.command("target").description("Create and inspect deterministic role and job targets.");
target
    .command("create-role")
    .requiredOption("--title <title>", "target role title")
    .option("--seniority <seniority>", "optional seniority")
    .option("--domain <domain>", "optional target domain")
    .option("--location <location>", "optional target location")
    .option("--working-model <model>", "optional working model")
    .option("--replace", "explicitly replace an existing target with the same deterministic ID")
    .description("Create a normalized role target without generating outputs or calculating fit.")
    .action(async (options) => {
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
    .action(async (options) => {
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
    .action(async (targetId) => {
    const workspace = getWorkspace();
    process.stdout.write(formatTargetJson(await showTarget(workspace, targetId)));
});
target
    .command("analyze <target-id>")
    .option("--rebuild", "explicitly rebuild current, stale, or invalid stored analysis")
    .description("Create deterministic structural analysis without semantic inference or evidence matching.")
    .action(async (targetId, options) => {
    const workspace = getWorkspace();
    console.log(formatAnalyzeTargetResult(await analyzeTarget(workspace, targetId, options)));
});
target
    .command("analysis-show <target-id>")
    .description("Print the complete normalized target analysis as stable JSON.")
    .action(async (targetId) => {
    const workspace = getWorkspace();
    process.stdout.write(`${JSON.stringify(await showTargetAnalysis(workspace, targetId), null, 2)}\n`);
});
target
    .command("analysis-status <target-id>")
    .description("Inspect target-analysis freshness and integrity without regenerating it.")
    .action(async (targetId) => {
    const workspace = getWorkspace();
    console.log(formatTargetAnalysisStatus(await getTargetAnalysisStatus(workspace, targetId)));
});
target
    .command("interpret <target-id>")
    .option("--role-profile <path>", "explicit workspace-local role profile JSON")
    .option("--rebuild", "explicitly rebuild stale or invalid stored interpretation")
    .description("Interpret explicit target expectations without loading candidate evidence or calculating fit.")
    .action(async (targetId, options) => {
    const workspace = getWorkspace();
    console.log(formatInterpretTargetResult(await interpretTarget(workspace, targetId, options)));
});
target
    .command("interpretation-show <target-id>")
    .description("Print the complete normalized semantic target interpretation as stable JSON.")
    .action(async (targetId) => {
    const workspace = getWorkspace();
    process.stdout.write(`${JSON.stringify(await showTargetInterpretation(workspace, targetId), null, 2)}\n`);
});
target
    .command("interpretation-status <target-id>")
    .option("--role-profile <path>", "explicit workspace-local role profile JSON")
    .description("Inspect interpretation freshness and integrity without regenerating it.")
    .action(async (targetId, options) => {
    const workspace = getWorkspace();
    console.log(formatTargetInterpretationStatus(await getTargetInterpretationStatus(workspace, targetId, options)));
});
const proposal = target.command("proposal").description("Generate, inspect, replay, and review model-assisted interpretation proposals.");
proposal
    .command("generate <target-id>")
    .option("--refresh", "bypass a valid cached proposal and call the configured provider again")
    .description("Generate a model-assisted proposal without approving it or loading candidate evidence.")
    .action(async (targetId, options) => {
    const workspace = getWorkspace();
    console.log(formatProposalGenerationResult(await generateInterpretationProposal(workspace, targetId, { refresh: options.refresh })));
});
proposal
    .command("list <target-id>")
    .description("List stored interpretation proposals for a target.")
    .action(async (targetId) => {
    console.log(formatProposalList(await listInterpretationProposals(getWorkspace(), targetId)));
});
proposal
    .command("show <proposal-id>")
    .description("Print one normalized proposal as stable JSON.")
    .action(async (proposalId) => {
    process.stdout.write(`${JSON.stringify(await showInterpretationProposal(getWorkspace(), proposalId), null, 2)}\n`);
});
proposal
    .command("status <proposal-id>")
    .description("Inspect proposal integrity, dependencies, and review eligibility.")
    .action(async (proposalId) => {
    console.log(formatProposalStatus(await getInterpretationProposalStatus(getWorkspace(), proposalId)));
});
proposal
    .command("replay <proposal-id>")
    .description("Replay normalization and validation from the exact cached raw response without a model call.")
    .action(async (proposalId) => {
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
    .action(async (proposalId, options) => {
    console.log(formatProposalReviewStatus(await initializeProposalReview(getWorkspace(), proposalId, { reviewerName: options.reviewer })));
});
proposal
    .command("review-show <proposal-id>")
    .description("Print the complete review artifact as stable JSON.")
    .action(async (proposalId) => {
    process.stdout.write(`${JSON.stringify(await showProposalReview(getWorkspace(), proposalId), null, 2)}\n`);
});
proposal
    .command("review-status <proposal-id>")
    .description("Inspect review decision counts and manifest integrity.")
    .action(async (proposalId) => {
    console.log(formatProposalReviewStatus(await getProposalReviewStatus(getWorkspace(), proposalId)));
});
proposal
    .command("review-set <proposal-id> <expectation-id>")
    .option("--accept", "accept the proposed expectation unchanged")
    .option("--reject", "reject the proposed expectation")
    .option("--edit-file <path>", "JSON file containing reviewed edited expectation fields")
    .option("--note <note>", "optional human review note")
    .description("Set exactly one pending proposal decision.")
    .action(async (proposalId, expectationId, options) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
    if (choices !== 1)
        throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
    const editedExpectation = options.editFile
        ? await readEditedExpectationFile(options.editFile)
        : undefined;
    const decision = options.accept ? "accept" : options.reject ? "reject" : "edit";
    console.log(formatProposalReviewStatus(await setProposalReviewDecision(getWorkspace(), proposalId, expectationId, { decision, editedExpectation, reviewNote: options.note })));
});
proposal
    .command("review-complete <proposal-id>")
    .description("Complete a review after every proposed expectation has one decision.")
    .action(async (proposalId) => {
    console.log(formatProposalReviewStatus(await completeProposalReview(getWorkspace(), proposalId)));
});
const approvedInterpretation = target.command("interpretation").description("Approve and inspect human-reviewed semantic target interpretations.");
approvedInterpretation
    .command("approve <proposal-id>")
    .description("Create a separate approved interpretation from deterministic input, proposal, and completed review.")
    .action(async (proposalId) => {
    console.log(formatApprovalResult(await approveInterpretationProposal(getWorkspace(), proposalId)));
});
approvedInterpretation
    .command("approved-show <target-id>")
    .description("Print a reviewed approved target interpretation as stable JSON.")
    .action(async (targetId) => {
    process.stdout.write(`${JSON.stringify(await showApprovedTargetInterpretation(getWorkspace(), targetId), null, 2)}\n`);
});
approvedInterpretation
    .command("approved-status <target-id>")
    .description("Inspect approved interpretation integrity and dependency freshness.")
    .action(async (targetId) => {
    console.log(formatApprovedInterpretationStatus(await getApprovedInterpretationStatus(getWorkspace(), targetId)));
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
    .action(async (targetId, options) => {
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
    .action(async (targetId) => {
    console.log(formatManualMatchList(await listManualEvidenceMatches(getWorkspace(), targetId)));
});
manualMatch
    .command("show <match-id>")
    .description("Print one manual-approved match as stable JSON.")
    .action(async (matchId) => {
    process.stdout.write(`${JSON.stringify(await showManualEvidenceMatch(getWorkspace(), matchId), null, 2)}\n`);
});
manualMatch
    .command("remove <match-id>")
    .option("--reason <reason>", "audit reason for removal")
    .description("Remove a manual match while preserving a tombstone.")
    .action(async (matchId, options) => {
    await removeManualEvidenceMatch(getWorkspace(), matchId, { reason: options.reason });
    console.log(`Removed manual match with audit tombstone: ${matchId}`);
});
const matchProposal = target.command("match-proposal").description("Generate, inspect, replay, and review optional model-assisted match proposals.");
matchProposal
    .command("generate <target-id>")
    .option("--refresh", "bypass a current cached proposal")
    .description("Generate match proposals only; no match is approved automatically.")
    .action(async (targetId, options) => {
    console.log(formatMatchProposalResult(await generateEvidenceMatchProposal(getWorkspace(), targetId, { refresh: options.refresh })));
});
matchProposal
    .command("list <target-id>")
    .description("List stored match proposals for a target.")
    .action(async (targetId) => {
    console.log(formatMatchProposalList(await listEvidenceMatchProposals(getWorkspace(), targetId)));
});
matchProposal
    .command("show <proposal-id>")
    .description("Print one normalized match proposal as stable JSON.")
    .action(async (proposalId) => {
    process.stdout.write(`${JSON.stringify(await showEvidenceMatchProposal(getWorkspace(), proposalId), null, 2)}\n`);
});
matchProposal
    .command("status <proposal-id>")
    .description("Inspect match proposal integrity, dependencies, and review eligibility.")
    .action(async (proposalId) => {
    console.log(formatMatchProposalStatus(await getEvidenceMatchProposalStatus(getWorkspace(), proposalId)));
});
matchProposal
    .command("replay <proposal-id>")
    .description("Replay strict validation from the exact cached raw response without a provider call.")
    .action(async (proposalId) => {
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
    .action(async (proposalId, options) => {
    console.log(formatEvidenceMatchReviewStatus(await initializeEvidenceMatchReview(getWorkspace(), proposalId, { reviewerName: options.reviewer })));
});
matchProposal
    .command("review-show <proposal-id>")
    .description("Print the complete match review as stable JSON.")
    .action(async (proposalId) => {
    process.stdout.write(`${JSON.stringify(await showEvidenceMatchReview(getWorkspace(), proposalId), null, 2)}\n`);
});
matchProposal
    .command("review-status <proposal-id>")
    .description("Inspect match and coverage decision counts and integrity.")
    .action(async (proposalId) => {
    console.log(formatEvidenceMatchReviewStatus(await getEvidenceMatchReviewStatus(getWorkspace(), proposalId)));
});
matchProposal
    .command("review-set <proposal-id> <proposed-match-id>")
    .option("--accept", "accept the proposed match unchanged")
    .option("--reject", "reject the proposed match")
    .option("--edit-file <path>", "JSON file containing reviewed edited match fields")
    .option("--note <note>", "optional review note")
    .description("Set exactly one pending proposed-match decision.")
    .action(async (proposalId, proposedMatchId, options) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
    if (choices !== 1)
        throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
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
    .action(async (proposalId, proposedCoverageId, options) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.status));
    if (choices !== 1)
        throw new Error("Choose exactly one of --accept, --reject, or --status.");
    console.log(formatEvidenceMatchReviewStatus(await setEvidenceCoverageReviewDecision(getWorkspace(), proposalId, proposedCoverageId, {
        decision: options.accept ? "accept" : options.reject ? "reject" : "edit",
        editedStatus: options.status,
        reviewNote: options.note,
    })));
});
matchProposal
    .command("review-complete <proposal-id>")
    .description("Complete review only after every proposed match and coverage record has one decision.")
    .action(async (proposalId) => {
    console.log(formatEvidenceMatchReviewStatus(await completeEvidenceMatchReview(getWorkspace(), proposalId)));
});
const approvedMatching = target.command("matching").description("Approve and inspect reviewed target-to-evidence matching.");
approvedMatching
    .command("status <target-id>")
    .description("Inspect approved matching lifecycle and dependency freshness.")
    .action(async (targetId) => {
    console.log(formatApprovedMatchingStatus(await getApprovedEvidenceMatchingStatus(getWorkspace(), targetId)));
});
approvedMatching
    .command("show <target-id>")
    .description("Print approved target evidence matching as stable JSON.")
    .action(async (targetId) => {
    process.stdout.write(`${JSON.stringify(await showApprovedEvidenceMatching(getWorkspace(), targetId), null, 2)}\n`);
});
approvedMatching
    .command("approve <proposal-id>")
    .option("--rebuild", "explicitly rebuild stale approved matching after review")
    .description("Merge manual-approved and human-reviewed matches without a provider call.")
    .action(async (proposalId, options) => {
    console.log(formatApproveEvidenceMatchingResult(await approveEvidenceMatchProposal(getWorkspace(), proposalId, { rebuild: options.rebuild })));
});
approvedMatching
    .command("approved-show <target-id>")
    .description("Print approved matching as stable JSON.")
    .action(async (targetId) => {
    process.stdout.write(`${JSON.stringify(await showApprovedEvidenceMatching(getWorkspace(), targetId), null, 2)}\n`);
});
approvedMatching
    .command("approved-status <target-id>")
    .description("Inspect approved matching integrity and dependency freshness.")
    .action(async (targetId) => {
    console.log(formatApprovedMatchingStatus(await getApprovedEvidenceMatchingStatus(getWorkspace(), targetId)));
});
const assess = target.command("assess").description("Build and inspect deterministic fit and proof assessments from current approved inputs.");
assess
    .command("build <target-id>")
    .option("--rebuild", "explicitly rebuild a stale or invalid deterministic assessment")
    .description("Build expectation-level support and proof analysis without generating resume or application content.")
    .action(async (targetId, options) => {
    console.log(formatBuildFitAssessmentResult(await buildFitAssessment(getWorkspace(), targetId, { rebuild: options.rebuild })));
});
assess
    .command("show <target-id>")
    .description("Print the deterministic fit and proof assessment as stable JSON.")
    .action(async (targetId) => {
    process.stdout.write(`${JSON.stringify(await showFitAssessment(getWorkspace(), targetId, "deterministic"), null, 2)}\n`);
});
assess
    .command("status <target-id>")
    .description("Inspect deterministic assessment integrity and dependency freshness.")
    .action(async (targetId) => {
    console.log(formatFitAssessmentStatus(await getFitAssessmentStatus(getWorkspace(), targetId, "deterministic")));
});
const assessProposal = target.command("assess-proposal").description("Generate, inspect, replay, and review optional model-assisted assessment proposals.");
assessProposal
    .command("generate <target-id>")
    .option("--refresh", "bypass a valid cached proposal and call the configured provider again")
    .description("Generate an assessment proposal only; no output is approved automatically.")
    .action(async (targetId, options) => {
    console.log(formatFitAssessmentProposalResult(await generateFitAssessmentProposal(getWorkspace(), targetId, { refresh: options.refresh })));
});
assessProposal
    .command("list <target-id>")
    .description("List stored fit assessment proposals for a target.")
    .action(async (targetId) => {
    console.log(formatFitAssessmentProposalList(await listFitAssessmentProposals(getWorkspace(), targetId)));
});
assessProposal
    .command("show <proposal-id>")
    .description("Print one normalized fit assessment proposal as stable JSON.")
    .action(async (proposalId) => {
    process.stdout.write(`${JSON.stringify(await showFitAssessmentProposal(getWorkspace(), proposalId), null, 2)}\n`);
});
assessProposal
    .command("status <proposal-id>")
    .description("Inspect proposal integrity, dependencies, and review eligibility.")
    .action(async (proposalId) => {
    console.log(formatFitAssessmentProposalStatus(await getFitAssessmentProposalStatus(getWorkspace(), proposalId)));
});
assessProposal
    .command("replay <proposal-id>")
    .description("Replay strict normalization from the exact stored raw response without a provider call.")
    .action(async (proposalId) => {
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
    .action(async (proposalId, options) => {
    console.log(formatFitAssessmentReviewStatus(await initializeFitAssessmentReview(getWorkspace(), proposalId, { reviewerName: options.reviewer })));
});
assessProposal
    .command("review-show <proposal-id>")
    .description("Print the complete assessment review as stable JSON.")
    .action(async (proposalId) => {
    process.stdout.write(`${JSON.stringify(await showFitAssessmentReview(getWorkspace(), proposalId), null, 2)}\n`);
});
assessProposal
    .command("review-status <proposal-id>")
    .description("Inspect assessment decision counts and manifest integrity.")
    .action(async (proposalId) => {
    console.log(formatFitAssessmentReviewStatus(await getFitAssessmentReviewStatus(getWorkspace(), proposalId)));
});
assessProposal
    .command("review-set <proposal-id> <expectation-assessment-id>")
    .option("--accept", "accept the proposed expectation assessment unchanged")
    .option("--reject", "reject and use the deterministic fallback")
    .option("--edit-file <path>", "JSON file containing complete reviewed assessment fields")
    .option("--note <note>", "optional review note")
    .description("Set exactly one pending expectation-assessment decision.")
    .action(async (proposalId, assessmentId, options) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
    if (choices !== 1)
        throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
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
    .action(async (proposalId, options) => {
    const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
    if (choices !== 1)
        throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
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
    .action(async (proposalId) => {
    console.log(formatFitAssessmentReviewStatus(await completeFitAssessmentReview(getWorkspace(), proposalId)));
});
const assessment = target.command("assessment").description("Approve and inspect human-reviewed fit and proof assessments.");
assessment
    .command("approve <proposal-id>")
    .option("--rebuild", "explicitly rebuild a stale approved assessment after reviewing dependency changes")
    .description("Create an approved assessment without a provider call.")
    .action(async (proposalId, options) => {
    console.log(formatApproveFitAssessmentResult(await approveFitAssessmentProposal(getWorkspace(), proposalId, { rebuild: options.rebuild })));
});
assessment
    .command("approved-show <target-id>")
    .description("Print the current approved fit and proof assessment as stable JSON.")
    .action(async (targetId) => {
    process.stdout.write(`${JSON.stringify(await showFitAssessment(getWorkspace(), targetId, "approved"), null, 2)}\n`);
});
assessment
    .command("approved-status <target-id>")
    .description("Inspect approved assessment integrity and dependency freshness.")
    .action(async (targetId) => {
    console.log(formatFitAssessmentStatus(await getFitAssessmentStatus(getWorkspace(), targetId, "approved")));
});
const resumePlan = target.command("resume-plan").description("Build, approve, and inspect role-positioning resume content plans without writing resume prose.");
resumePlan
    .command("build <target-id>")
    .option("--rebuild", "explicitly rebuild a stale or invalid deterministic plan")
    .option("--allow-partial", "allow an explicitly partial planning artifact that remains unusable for drafting")
    .description("Build a deterministic Role Resume Content Plan from current approved role artifacts.")
    .action(async (targetId, options) => {
    console.log(formatBuildRoleResumePlanResult(await buildRoleResumePlan(getWorkspace(), targetId, { rebuild: options.rebuild, allowPartial: options.allowPartial })));
});
resumePlan
    .command("show <target-id>")
    .description("Print the deterministic Role Resume Content Plan as stable JSON.")
    .action(async (targetId) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumePlan(getWorkspace(), targetId), null, 2)}\n`);
});
resumePlan
    .command("status <target-id>")
    .description("Inspect deterministic role resume plan integrity and dependency freshness.")
    .action(async (targetId) => {
    console.log(formatRoleResumePlanStatus(await getRoleResumePlanStatus(getWorkspace(), targetId)));
});
resumePlan
    .command("approve <proposal-id>")
    .option("--rebuild", "explicitly rebuild a stale approved plan after reviewing dependency changes")
    .description("Create an approved Role Resume Content Plan without a provider call.")
    .action(async (proposalId, options) => {
    console.log(formatApproveRoleResumePlanResult(await approveRoleResumePlanProposal(getWorkspace(), proposalId, { rebuild: options.rebuild })));
});
resumePlan
    .command("approved-show <target-id>")
    .description("Print the current approved Role Resume Content Plan as stable JSON.")
    .action(async (targetId) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumePlan(getWorkspace(), targetId, "approved"), null, 2)}\n`);
});
resumePlan
    .command("approved-status <target-id>")
    .description("Inspect approved role resume plan integrity and dependency freshness.")
    .action(async (targetId) => {
    console.log(formatRoleResumePlanStatus(await getRoleResumePlanStatus(getWorkspace(), targetId, "approved")));
});
const resumePlanProposal = target.command("resume-plan-proposal").description("Generate, inspect, replay, and review optional model-assisted Role Resume Content Plan proposals.");
resumePlanProposal
    .command("generate <target-id>")
    .option("--refresh", "bypass a valid cached proposal and call the configured provider again")
    .description("Generate a structured plan proposal only; no output is approved automatically.")
    .action(async (targetId, options) => {
    console.log(formatRoleResumePlanProposalResult(await generateRoleResumePlanProposal(getWorkspace(), targetId, { refresh: options.refresh })));
});
resumePlanProposal
    .command("list <target-id>")
    .description("List stored Role Resume Content Plan proposals.")
    .action(async (targetId) => {
    console.log(formatRoleResumePlanProposalList(await listRoleResumePlanProposals(getWorkspace(), targetId)));
});
resumePlanProposal
    .command("show <proposal-id>")
    .description("Print one normalized Role Resume Content Plan proposal as stable JSON.")
    .action(async (proposalId) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumePlanProposal(getWorkspace(), proposalId), null, 2)}\n`);
});
resumePlanProposal
    .command("status <proposal-id>")
    .description("Inspect proposal integrity, dependencies, and review eligibility.")
    .action(async (proposalId) => {
    console.log(formatRoleResumePlanProposalStatus(await getRoleResumePlanProposalStatus(getWorkspace(), proposalId)));
});
resumePlanProposal
    .command("replay <proposal-id>")
    .description("Replay strict normalization from the exact stored raw response without a provider call.")
    .action(async (proposalId) => {
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
    .action(async (proposalId, options) => {
    await initializeRoleResumePlanReview(getWorkspace(), proposalId, { reviewerName: options.reviewer });
    console.log(formatRoleResumePlanReviewStatus(await getRoleResumePlanReviewStatus(getWorkspace(), proposalId)));
});
resumePlanProposal
    .command("review-show <proposal-id>")
    .description("Print the complete Role Resume Content Plan review as stable JSON.")
    .action(async (proposalId) => {
    process.stdout.write(`${JSON.stringify(await showRoleResumePlanReview(getWorkspace(), proposalId), null, 2)}\n`);
});
resumePlanProposal
    .command("review-status <proposal-id>")
    .description("Inspect plan decision counts and manifest integrity.")
    .action(async (proposalId) => {
    console.log(formatRoleResumePlanReviewStatus(await getRoleResumePlanReviewStatus(getWorkspace(), proposalId)));
});
for (const itemType of ["positioning", "section", "expectation", "evidence", "claim-boundary", "exclusion"]) {
    resumePlanProposal
        .command(`review-set-${itemType} <proposal-id> <item-id>`)
        .option("--accept", "accept the proposed plan element unchanged")
        .option("--reject", "reject and use the deterministic fallback")
        .option("--edit-file <path>", "JSON file containing the complete edited plan element")
        .option("--note <note>", "optional review note")
        .description(`Set exactly one pending ${itemType} plan decision.`)
        .action(async (proposalId, itemId, options) => {
        const choices = Number(Boolean(options.accept)) + Number(Boolean(options.reject)) + Number(Boolean(options.editFile));
        if (choices !== 1)
            throw new Error("Choose exactly one of --accept, --reject, or --edit-file.");
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
    .action(async (proposalId) => {
    console.log(formatRoleResumePlanReviewStatus(await completeRoleResumePlanReview(getWorkspace(), proposalId)));
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
function getWorkspace() {
    const options = program.opts();
    return resolveWorkspace(options.workspace);
}
await program.parseAsync();
