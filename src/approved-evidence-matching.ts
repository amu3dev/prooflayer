import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
} from "./fs-utils.js";
import {
  EvidenceMatchProposalManifestSchema,
  EvidenceMatchReviewManifestSchema,
  ManualEvidenceMatchingSchema,
  type EvidenceMatch,
  type ExpectationCoverageStatus,
  type ManualEvidenceMatching,
} from "./schemas.js";
import {
  EVIDENCE_MATCHER_NAME,
  EVIDENCE_MATCHER_VERSION,
  EVIDENCE_MATCHING_POLICY_VERSION,
  expectationProvenance,
  getApprovedEvidenceMatchingStatus,
  loadMatchingContext,
  writeApprovedMatching,
} from "./evidence-matching.js";
import {
  getEvidenceMatchProposalStatus,
  showEvidenceMatchProposal,
} from "./evidence-match-proposal.js";
import {
  getEvidenceMatchReviewStatus,
  showEvidenceMatchReview,
} from "./evidence-match-review.js";
import { showTarget } from "./targets.js";

export interface ApproveEvidenceMatchingOptions {
  rebuild?: boolean;
  now?: () => Date;
}

export interface ApproveEvidenceMatchingResult {
  targetId: string;
  targetType: "role" | "job";
  proposalId: string;
  result: "created" | "rebuilt" | "already-current";
  approvedMatchCount: number;
  manualApprovedCount: number;
  humanApprovedCount: number;
  humanEditedCount: number;
  rejectedCount: number;
  completeness: "empty" | "partial" | "complete";
  usableForFitAssessment: boolean;
  matchingPath: string;
  manifestPath: string;
}

export async function approveEvidenceMatchProposal(
  workspace: string,
  proposalId: string,
  options: ApproveEvidenceMatchingOptions = {},
): Promise<ApproveEvidenceMatchingResult> {
  const proposalStatus = await getEvidenceMatchProposalStatus(workspace, proposalId);
  if (proposalStatus.status !== "current" || !proposalStatus.readyForReview) {
    throw new Error(`Cannot approve a ${proposalStatus.status} or invalid match proposal.`);
  }
  const reviewStatus = await getEvidenceMatchReviewStatus(workspace, proposalId);
  if (reviewStatus.status !== "completed") {
    throw new Error(`Match proposal review must be completed before approval. Current status: ${reviewStatus.status}`);
  }
  const proposal = await showEvidenceMatchProposal(workspace, proposalId);
  const review = await showEvidenceMatchReview(workspace, proposalId);
  const context = await loadMatchingContext(workspace, proposal.targetId, {
    persistSnapshot: true,
    rebuildSnapshot: options.rebuild,
    now: options.now,
  });
  if (proposal.input.approvedInterpretationSha256 !== context.approvedInterpretationSha256 || proposal.input.eligibleEvidenceSetSha256 !== context.snapshot.eligibleEvidenceSetSha256) {
    throw new Error("Match proposal dependencies changed and approval was refused.");
  }
  const target = await showTarget(workspace, proposal.targetId);
  const root = targetRoot(target.type, target.id);
  const proposalManifestPath = resolveWithin(workspace, `${root}/matching/proposals/${proposalId}/proposal-manifest.json`);
  const reviewManifestPath = resolveWithin(workspace, `${root}/matching/reviews/${proposalId}/review-manifest.json`);
  const proposalManifest = EvidenceMatchProposalManifestSchema.parse(await readJson<unknown>(proposalManifestPath, null));
  const reviewManifest = EvidenceMatchReviewManifestSchema.parse(await readJson<unknown>(reviewManifestPath, null));
  if (reviewManifest.proposalSha256 !== proposalManifest.proposalSha256) throw new Error("Match review does not reference the current proposal hash.");

  const expectationById = new Map(context.eligibleExpectations.map((expectation) => [expectation.id, expectation]));
  const evidenceById = new Map(context.snapshot.entries.map((entry) => [entry.evidenceId, entry]));
  const decisionById = new Map(review.matchDecisions.map((decision) => [decision.proposedMatchId, decision]));
  const reviewedMatches: EvidenceMatch[] = [];
  for (const proposed of proposal.proposedMatches) {
    const decision = decisionById.get(proposed.id);
    if (!decision || decision.decision === "pending" || decision.decision === "reject") continue;
    const expectation = expectationById.get(proposed.expectationId);
    if (!expectation) throw new Error(`Approved expectation is no longer eligible: ${proposed.expectationId}`);
    const edited = decision.decision === "edit" ? decision.editedMatch : undefined;
    if (decision.decision === "edit" && !edited) throw new Error(`Edited match content is missing: ${proposed.id}`);
    const evidenceIds = [...new Set(edited?.evidenceIds ?? proposed.evidenceIds)].sort();
    const evidenceEntries = evidenceIds.map((id) => evidenceById.get(id));
    if (evidenceEntries.some((entry) => !entry)) throw new Error(`Reviewed match references evidence that is no longer eligible: ${proposed.id}`);
    const matchType = edited?.matchType ?? proposed.matchType;
    const trustState = decision.decision === "edit" ? "human-edited" : "human-approved";
    reviewedMatches.push({
      id: `match_${hashText([context.target.id, expectation.id, evidenceIds.join(","), matchType, EVIDENCE_MATCHING_POLICY_VERSION].join("\u0000")).slice(0, 14)}`,
      expectationId: expectation.id,
      evidenceIds,
      matchType,
      coverage: edited?.coverage ?? proposed.coverage,
      evidenceStrength: edited?.evidenceStrength ?? proposed.evidenceStrength,
      temporalRelevance: edited?.temporalRelevance ?? proposed.temporalRelevance,
      rationale: edited?.rationale ?? proposed.rationale,
      expectationProvenance: expectationProvenance(context, expectation),
      evidenceProvenance: evidenceEntries.map((entry) => entry!.provenance),
      trustState,
      interpretation: {
        method: "model-assisted",
        matcherName: EVIDENCE_MATCHER_NAME,
        matcherVersion: EVIDENCE_MATCHER_VERSION,
        policyVersion: EVIDENCE_MATCHING_POLICY_VERSION,
      },
      matchConfidence: edited?.matchConfidence ?? proposed.matchConfidence,
      limitations: edited?.limitations ?? proposed.limitations,
      notes: [
        ...(edited?.notes ?? []),
        ...(decision.reviewNote ? [decision.reviewNote] : []),
      ],
      approvalProvenance: {
        proposalId,
        proposedMatchId: proposed.id,
        reviewDecision: decision.decision,
        reviewer: review.reviewer,
        modelProvider: proposal.model.provider,
        modelName: proposal.model.model,
        promptTemplateVersion: proposal.prompt.templateVersion,
        policyVersion: proposal.prompt.policyVersion,
      },
    });
  }

  const explicitCoverage = new Map<string, ExpectationCoverageStatus>();
  const coverageById = new Map(proposal.proposedCoverage.map((coverage) => [coverage.id, coverage]));
  for (const decision of review.coverageDecisions) {
    if (decision.decision === "pending" || decision.decision === "reject") continue;
    const proposed = coverageById.get(decision.proposedCoverageId);
    if (!proposed) throw new Error(`Unknown reviewed coverage record: ${decision.proposedCoverageId}`);
    if (!expectationById.has(proposed.expectationId)) throw new Error(`Coverage references an ineligible expectation: ${proposed.expectationId}`);
    explicitCoverage.set(proposed.expectationId, decision.decision === "edit" ? decision.editedStatus! : proposed.status);
  }

  const manual = await loadManualMatches(workspace, target.type, target.id, context.approvedInterpretationSha256, context.snapshot.eligibleEvidenceSetSha256);
  const manualPath = resolveWithin(workspace, `${root}/matching/manual/target-evidence-matching.json`);
  const manualStoreSha256 = await pathExists(manualPath) ? await hashFile(manualPath) : undefined;
  const proposedMatchIds = proposal.proposedMatches.reduce((byExpectation, match) => {
    const ids = byExpectation.get(match.expectationId) ?? [];
    ids.push(match.id);
    byExpectation.set(match.expectationId, ids);
    return byExpectation;
  }, new Map<string, string[]>());
  const written = await writeApprovedMatching(
    workspace,
    context,
    [...manual.matches, ...reviewedMatches],
    explicitCoverage,
    {
      proposalId,
      proposalSha256: proposalManifest.proposalSha256,
      reviewSha256: reviewManifest.reviewSha256,
      ...(manualStoreSha256 ? { manualStoreSha256 } : {}),
    },
    { ...options, proposedMatchIds },
  );
  const trustCounts = written.matching.matches.reduce((counts, match) => {
    counts[match.trustState] += 1;
    return counts;
  }, { "manual-approved": 0, "human-approved": 0, "human-edited": 0 });
  return {
    targetId: target.id,
    targetType: target.type,
    proposalId,
    result: written.result,
    approvedMatchCount: written.matching.matches.length,
    manualApprovedCount: trustCounts["manual-approved"],
    humanApprovedCount: trustCounts["human-approved"],
    humanEditedCount: trustCounts["human-edited"],
    rejectedCount: review.matchDecisions.filter((decision) => decision.decision === "reject").length,
    completeness: written.matching.completeness.status,
    usableForFitAssessment: written.matching.completeness.usableForFitAssessment,
    matchingPath: written.manifest.matchingPath,
    manifestPath: `${root}/matching/approved/matching-manifest.json`,
  };
}

export function formatApproveEvidenceMatchingResult(result: ApproveEvidenceMatchingResult): string {
  return [
    `Target ID: ${result.targetId}`,
    `Target type: ${result.targetType}`,
    `Proposal ID: ${result.proposalId}`,
    `Result: ${result.result}`,
    `Approved matches: ${result.approvedMatchCount}`,
    `Manual approved: ${result.manualApprovedCount}`,
    `Human approved: ${result.humanApprovedCount}`,
    `Human edited: ${result.humanEditedCount}`,
    `Rejected proposals: ${result.rejectedCount}`,
    `Completeness: ${result.completeness}`,
    `Structurally usable for future fit assessment: ${result.usableForFitAssessment ? "yes" : "no"}`,
    `Approved matching path: ${result.matchingPath}`,
    `Manifest path: ${result.manifestPath}`,
  ].join("\n");
}

async function loadManualMatches(
  workspace: string,
  targetType: "role" | "job",
  targetId: string,
  approvedInterpretationSha256: string,
  eligibleEvidenceSetSha256: string,
): Promise<ManualEvidenceMatching> {
  const filePath = resolveWithin(workspace, `${targetRoot(targetType, targetId)}/matching/manual/target-evidence-matching.json`);
  if (!(await pathExists(filePath))) {
    const now = new Date().toISOString();
    return ManualEvidenceMatchingSchema.parse({
      schemaVersion: 1,
      targetId,
      targetType,
      approvedInterpretationSha256,
      eligibleEvidenceSetSha256,
      matches: [],
      tombstones: [],
      createdAt: now,
      updatedAt: now,
    });
  }
  const stored = ManualEvidenceMatchingSchema.parse(await readJson<unknown>(filePath, null));
  if (stored.approvedInterpretationSha256 !== approvedInterpretationSha256 || stored.eligibleEvidenceSetSha256 !== eligibleEvidenceSetSha256) {
    throw new Error("Manual matching store is stale and cannot be merged silently.");
  }
  return stored;
}

export async function approvedMatchingLifecycle(workspace: string, targetId: string): Promise<string> {
  return (await getApprovedEvidenceMatchingStatus(workspace, targetId)).status;
}

function targetRoot(targetType: "role" | "job", targetId: string): string {
  return `targets/${targetType === "role" ? "roles" : "jobs"}/${targetId}`;
}

function resolveWithin(workspace: string, relativePath: string): string {
  const resolved = path.resolve(workspace, relativePath);
  const relation = path.relative(path.resolve(workspace), resolved);
  if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) throw new Error(`Approved matching path escapes workspace: ${relativePath}`);
  return resolved;
}
