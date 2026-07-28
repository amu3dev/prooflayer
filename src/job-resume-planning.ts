import path from "node:path";
import {
  approvedJobRequirementPaths,
  getApprovedJobRequirementsStatus,
  showApprovedJobRequirements,
} from "./approved-job-requirements.js";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  uniqueSorted,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  getJobCoverageStatus,
  jobCoveragePaths,
  showJobCoverage,
} from "./job-coverage.js";
import {
  JobRequirementCoverageManifestSchema,
  type JobRequirementCoverage,
  type JobRequirementCoverageModel,
} from "./job-coverage-schemas.js";
import {
  getJobFitProofAssessmentStatus,
  jobFitProofAssessmentPaths,
  showJobFitProofAssessment,
} from "./job-fit-proof-assessment.js";
import {
  JobFitProofAssessmentManifestSchema,
  type JobFitProofAssessment,
  type JobRequirementFitProofAssessment,
} from "./job-fit-proof-assessment-schemas.js";
import {
  jobEvidenceMapPaths,
  showJobEvidenceMap,
} from "./job-evidence-mapping.js";
import {
  JobEvidenceMapManifestSchema,
  type JobEvidenceLink,
  type JobEvidenceMap,
  type JobRequirementInputType,
} from "./job-evidence-map-schemas.js";
import {
  type ApprovedJobRequirementModel,
  type JobRequirementModel,
} from "./job-requirement-schemas.js";
import {
  getJobRequirementModelStatus,
  jobRequirementPaths,
  showJobRequirementModel,
} from "./job-requirements.js";
import {
  JobResumeContentPlanManifestSchema,
  JobResumeContentPlanSchema,
  type JobGapHandlingRule,
  type JobMetricPermission,
  type JobRequirementEmphasis,
  type JobRequirementEmphasisDecision,
  type JobResumeClaimBoundary,
  type JobResumeContentExclusion,
  type JobResumeContentPlan,
  type JobResumeContentPlanManifest,
  type JobResumeContentType,
  type JobResumeEvidenceSelection,
  type JobResumePlanningAmbiguity,
  type JobResumePlanningRisk,
  type JobResumePlanningWarning,
  type JobResumePositioningState,
  type JobResumeSectionPlan,
  type JobResumeSectionType,
} from "./job-resume-plan-schemas.js";
import {
  ClaimSchema,
  EvidenceItemSchema,
  SourceSchema,
  type Claim,
  type EvidenceItem,
  type JobTarget,
  type Source,
} from "./schemas.js";
import { showTarget } from "./targets.js";
import { stableJson } from "./target-proposal.js";

export const JOB_RESUME_PLANNING_POLICY_NAME =
  "job-resume-content-planning-policy";
export const JOB_RESUME_PLANNING_POLICY_VERSION = "1";

const PLAN_FILE = "job-resume-content-plan.json";
const MANIFEST_FILE = "job-resume-content-plan-manifest.json";

type RequirementModel = JobRequirementModel | ApprovedJobRequirementModel;

interface JobResumePlanPaths {
  rootRelativePath: string;
  rootPath: string;
  planRelativePath: string;
  planPath: string;
  manifestRelativePath: string;
  manifestPath: string;
}

interface RequirementInput {
  type: JobRequirementInputType;
  model: RequirementModel;
  modelPath: string;
  modelSha256: string;
  manifestPath: string;
  manifestSha256: string;
}

export interface JobResumePlanningContext {
  target: JobTarget;
  targetSha256: string;
  sourceSha256: string;
  requirementInput: RequirementInput;
  evidenceMap: JobEvidenceMap;
  evidenceMapPath: string;
  evidenceMapSha256: string;
  evidenceMapManifestPath: string;
  evidenceMapManifestSha256: string;
  coverage: JobRequirementCoverageModel;
  coveragePath: string;
  coverageSha256: string;
  coverageManifestPath: string;
  coverageManifestSha256: string;
  assessment: JobFitProofAssessment;
  assessmentPath: string;
  assessmentSha256: string;
  assessmentManifestPath: string;
  assessmentManifestSha256: string;
  sources: Source[];
  evidenceItems: EvidenceItem[];
  claims: Claim[];
  sourcesSha256: string;
  evidenceItemsSha256: string;
  claimsSha256: string;
  selectedEvidenceSetSha256: string;
  selectedClaimSetSha256: string;
  normalizedInputSha256: string;
}

interface BuildOptions {
  rebuild?: boolean;
  now?: () => Date;
}

export interface BuildJobResumePlanResult {
  targetId: string;
  result: "created" | "rebuilt" | "already-current";
  planId: string;
  planPath: string;
  manifestPath: string;
  positioningState: JobResumePositioningState;
  selectedRequirementCount: number;
  includedSectionCount: number;
  completeness: "empty" | "partial" | "complete";
  usableForDrafting: boolean;
}

export interface JobResumePlanStatus {
  targetId: string;
  planExists: boolean;
  manifestExists: boolean;
  assessmentStatus: "missing" | "current" | "stale" | "invalid";
  planHashMatches: boolean | null;
  targetHashMatches: boolean | null;
  sourceHashMatches: boolean | null;
  requirementModelHashMatches: boolean | null;
  requirementManifestHashMatches: boolean | null;
  evidenceMapHashMatches: boolean | null;
  evidenceMapManifestHashMatches: boolean | null;
  coverageHashMatches: boolean | null;
  coverageManifestHashMatches: boolean | null;
  assessmentHashMatches: boolean | null;
  assessmentManifestHashMatches: boolean | null;
  sourcesHashMatches: boolean | null;
  evidenceItemsHashMatches: boolean | null;
  claimsHashMatches: boolean | null;
  selectedEvidenceSetHashMatches: boolean | null;
  selectedClaimSetHashMatches: boolean | null;
  policyMatches: boolean | null;
  normalizedInputHashMatches: boolean | null;
  status: "missing" | "current" | "stale" | "invalid";
  reasons: string[];
  planPath: string;
  manifestPath: string;
}

export function jobResumePlanPaths(
  workspace: string,
  targetId: string,
): JobResumePlanPaths {
  const rootRelativePath =
    `targets/jobs/${targetId}/resume-planning/deterministic`;
  const planRelativePath = `${rootRelativePath}/${PLAN_FILE}`;
  const manifestRelativePath = `${rootRelativePath}/${MANIFEST_FILE}`;
  return {
    rootRelativePath,
    rootPath: resolveWithin(workspace, rootRelativePath),
    planRelativePath,
    planPath: resolveWithin(workspace, planRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}

export async function buildJobResumePlan(
  workspace: string,
  targetId: string,
  options: BuildOptions = {},
): Promise<BuildJobResumePlanResult> {
  const context = await loadJobResumePlanningContext(workspace, targetId);
  const status = await getJobResumePlanStatus(workspace, targetId);
  const paths = jobResumePlanPaths(workspace, targetId);
  if (status.status === "current") {
    return resultFromPlan(
      await showJobResumePlan(workspace, targetId),
      paths,
      "already-current",
    );
  }
  if (
    (status.status === "stale" || status.status === "invalid") &&
    !options.rebuild
  ) {
    throw new Error(
      `Stored Job Resume Content Plan is ${status.status} and was not overwritten. Review dependencies, then use --rebuild. ${status.reasons.join(" ")}`,
    );
  }
  const now = (options.now ?? (() => new Date()))().toISOString();
  let createdAt = now;
  if (status.planExists) {
    try {
      const previous = await showJobResumePlan(workspace, targetId);
      if (previous.targetId === targetId) createdAt = previous.createdAt;
    } catch {
      // Explicit rebuild may replace an invalid artifact without trusting it.
    }
  }
  const plan = createJobResumePlan(context, createdAt, now);
  await writeJsonAtomic(paths.planPath, plan);
  const manifest = createManifest(
    plan,
    context,
    paths.planRelativePath,
    await hashFile(paths.planPath),
    createdAt,
    now,
  );
  await writeJsonAtomic(paths.manifestPath, manifest);
  return resultFromPlan(
    plan,
    paths,
    status.status === "missing" ? "created" : "rebuilt",
  );
}

export async function showJobResumePlan(
  workspace: string,
  targetId: string,
): Promise<JobResumeContentPlan> {
  await requireJobTarget(workspace, targetId);
  const paths = jobResumePlanPaths(workspace, targetId);
  if (!(await pathExists(paths.planPath))) {
    throw new Error(`Job Resume Content Plan not found for target: ${targetId}`);
  }
  return JobResumeContentPlanSchema.parse(
    await readJson<unknown>(paths.planPath, null),
  );
}

export async function getJobResumePlanStatus(
  workspace: string,
  targetId: string,
): Promise<JobResumePlanStatus> {
  await requireJobTarget(workspace, targetId);
  const paths = jobResumePlanPaths(workspace, targetId);
  const planExists = await pathExists(paths.planPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const assessmentStatus = await getJobFitProofAssessmentStatus(
    workspace,
    targetId,
  );
  const base = {
    targetId,
    planExists,
    manifestExists,
    assessmentStatus: assessmentStatus.status,
    planPath: paths.planRelativePath,
    manifestPath: paths.manifestRelativePath,
  };
  if (!planExists && !manifestExists) {
    return emptyStatus(base, "missing", [
      "No deterministic Job Resume Content Plan exists.",
    ]);
  }
  if (!planExists || !manifestExists) {
    return emptyStatus(base, "invalid", [
      "Job Resume Content Plan artifact set is incomplete.",
    ]);
  }
  let plan: JobResumeContentPlan;
  let manifest: JobResumeContentPlanManifest;
  try {
    plan = JobResumeContentPlanSchema.parse(
      await readJson<unknown>(paths.planPath, null),
    );
    manifest = JobResumeContentPlanManifestSchema.parse(
      await readJson<unknown>(paths.manifestPath, null),
    );
  } catch (error) {
    return emptyStatus(base, "invalid", [
      `Stored Job Resume Content Plan is invalid: ${errorMessage(error)}`,
    ]);
  }
  const planHashMatches =
    (await hashFile(paths.planPath)) === manifest.planSha256;
  const identityReasons = validateStoredIdentity(plan, manifest, paths);
  if (!planHashMatches) {
    identityReasons.push(
      "Job Resume Content Plan SHA-256 does not match its manifest.",
    );
  }
  if (identityReasons.length > 0) {
    return {
      ...emptyStatus(base, "invalid", uniqueSorted(identityReasons)),
      planHashMatches,
    };
  }
  if (assessmentStatus.status !== "current") {
    return {
      ...emptyStatus(base, "stale", [
        `Job Fit and Proof Assessment status is ${assessmentStatus.status}.`,
        ...assessmentStatus.reasons,
      ]),
      planHashMatches,
    };
  }
  let context: JobResumePlanningContext;
  try {
    context = await loadJobResumePlanningContext(workspace, targetId);
  } catch (error) {
    return {
      ...emptyStatus(base, "stale", [errorMessage(error)]),
      planHashMatches,
    };
  }
  const checks = dependencyMatches(manifest, context);
  const staleReasons = Object.entries(checks)
    .filter(([, matches]) => !matches)
    .map(([name]) => dependencyReason(name));
  if (staleReasons.length > 0) {
    return statusWithChecks(
      base,
      planHashMatches,
      checks,
      "stale",
      staleReasons,
    );
  }
  const expected = createJobResumePlan(
    context,
    plan.createdAt,
    plan.updatedAt,
  );
  if (stableJson(planSemantics(plan)) !== stableJson(planSemantics(expected))) {
    return statusWithChecks(
      base,
      planHashMatches,
      checks,
      "invalid",
      [
        "Stored plan content does not match deterministic planning of the current Job assessment.",
      ],
    );
  }
  return statusWithChecks(
    base,
    planHashMatches,
    checks,
    "current",
    [],
  );
}

export function deriveJobPositioningState(
  overall: JobFitProofAssessment["overall"]["state"],
): JobResumePositioningState {
  if (overall === "strong" || overall === "credible") return "direct";
  if (overall === "mixed") return "adjacent";
  if (overall === "limited") return "stretch";
  if (overall === "insufficient") return "insufficient-proof";
  return "indeterminate";
}

export function deriveJobRequirementEmphasisDecision(
  assessment: Pick<
    JobRequirementFitProofAssessment,
    "necessity" | "assessmentState" | "proofStrength" | "materiality"
  >,
): JobRequirementEmphasisDecision {
  if (assessment.assessmentState === "contradiction") return "exclude";
  if (assessment.assessmentState === "indeterminate") return "defer";
  if (assessment.assessmentState === "gap") {
    return assessment.necessity === "mandatory" ? "defer" : "exclude";
  }
  if (assessment.assessmentState === "partial") {
    return assessment.necessity === "mandatory"
      ? "secondary"
      : "supporting";
  }
  if (assessment.necessity === "mandatory") return "primary";
  if (assessment.necessity === "preferred") return "secondary";
  return "supporting";
}

export function formatBuildJobResumePlanResult(
  result: BuildJobResumePlanResult,
): string {
  return [
    `Target ID: ${result.targetId}`,
    "Target type: job",
    "Planning mode: job-specific-resume",
    `Build result: ${result.result}`,
    `Plan ID: ${result.planId}`,
    `Positioning: ${result.positioningState}`,
    `Selected requirements: ${result.selectedRequirementCount}`,
    `Included sections: ${result.includedSectionCount}`,
    `Completeness: ${result.completeness}`,
    `Usable for drafting: ${result.usableForDrafting ? "yes" : "no"}`,
    `Plan: ${result.planPath}`,
    `Manifest: ${result.manifestPath}`,
  ].join("\n");
}

export function formatJobResumePlanStatus(
  status: JobResumePlanStatus,
): string {
  const check = (value: boolean | null): string =>
    value === null ? "not applicable" : value ? "yes" : "no";
  return [
    `Target ID: ${status.targetId}`,
    `Overall status: ${status.status}`,
    `Job assessment status: ${status.assessmentStatus}`,
    `Plan hash matches: ${check(status.planHashMatches)}`,
    `Target hash matches: ${check(status.targetHashMatches)}`,
    `Job Description hash matches: ${check(status.sourceHashMatches)}`,
    `Requirement model hash matches: ${check(status.requirementModelHashMatches)}`,
    `Requirement manifest hash matches: ${check(status.requirementManifestHashMatches)}`,
    `Evidence map hash matches: ${check(status.evidenceMapHashMatches)}`,
    `Evidence map manifest hash matches: ${check(status.evidenceMapManifestHashMatches)}`,
    `Coverage hash matches: ${check(status.coverageHashMatches)}`,
    `Coverage manifest hash matches: ${check(status.coverageManifestHashMatches)}`,
    `Assessment hash matches: ${check(status.assessmentHashMatches)}`,
    `Assessment manifest hash matches: ${check(status.assessmentManifestHashMatches)}`,
    `Sources hash matches: ${check(status.sourcesHashMatches)}`,
    `Evidence items hash matches: ${check(status.evidenceItemsHashMatches)}`,
    `Claims hash matches: ${check(status.claimsHashMatches)}`,
    `Selected evidence set matches: ${check(status.selectedEvidenceSetHashMatches)}`,
    `Selected claim set matches: ${check(status.selectedClaimSetHashMatches)}`,
    `Policy matches: ${check(status.policyMatches)}`,
    `Normalized input matches: ${check(status.normalizedInputHashMatches)}`,
    `Plan: ${status.planPath}`,
    `Manifest: ${status.manifestPath}`,
    ...(status.reasons.length
      ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)]
      : []),
  ].join("\n");
}

function createJobResumePlan(
  context: JobResumePlanningContext,
  createdAt: string,
  updatedAt: string,
): JobResumeContentPlan {
  const planId = deterministicPlanId(context);
  const requirementEmphasis = deriveRequirementEmphasis(context, planId);
  const claimBoundaries = deriveClaimBoundaries(
    context,
    planId,
    requirementEmphasis,
  );
  const evidenceSelections = deriveEvidenceSelections(
    context,
    planId,
    requirementEmphasis,
    claimBoundaries,
  );
  const metricPermissions = deriveMetricPermissions(
    context,
    planId,
    requirementEmphasis,
  );
  const gapHandling = deriveGapHandling(
    context,
    planId,
    requirementEmphasis,
  );
  const exclusions = deriveExclusions(
    context,
    planId,
    requirementEmphasis,
    evidenceSelections,
    metricPermissions,
  );
  const positioning = derivePositioning(
    context,
    requirementEmphasis,
  );
  const risks = deriveRisks(
    context,
    planId,
    requirementEmphasis,
    evidenceSelections,
    metricPermissions,
  );
  const warnings = deriveWarnings(
    context,
    planId,
    requirementEmphasis,
    metricPermissions,
  );
  const ambiguities = deriveAmbiguities(
    context,
    planId,
    requirementEmphasis,
    evidenceSelections,
  );
  const sections = deriveSections(
    context,
    planId,
    requirementEmphasis,
    evidenceSelections,
    claimBoundaries,
    metricPermissions,
    exclusions,
    risks,
    warnings,
  );
  const completeness = deriveCompleteness(
    context,
    positioning.state,
    requirementEmphasis,
    sections,
    claimBoundaries,
    gapHandling,
  );
  return JobResumeContentPlanSchema.parse({
    schemaVersion: 1,
    id: planId,
    targetId: context.target.id,
    targetType: "job",
    mode: "job-specific-resume",
    policy: {
      name: JOB_RESUME_PLANNING_POLICY_NAME,
      version: JOB_RESUME_PLANNING_POLICY_VERSION,
      mode: "deterministic",
    },
    input: planInput(context),
    positioning,
    requirementEmphasis,
    evidenceSelections,
    sections,
    claimBoundaries,
    metricPermissions,
    gapHandling,
    exclusions,
    risks,
    warnings,
    ambiguities,
    completeness,
    createdAt,
    updatedAt,
  });
}

function deriveRequirementEmphasis(
  context: JobResumePlanningContext,
  planId: string,
): JobRequirementEmphasis[] {
  const linksByRequirement = groupBy(
    context.evidenceMap.links,
    (link) => link.requirementId,
  );
  const coverageByRequirement = new Map(
    context.coverage.requirements.map((entry) => [entry.requirementId, entry]),
  );
  return context.assessment.requirementAssessments
    .map((assessment) => {
      const coverage = coverageByRequirement.get(assessment.requirementId);
      if (!coverage) {
        throw new Error(
          `Assessment references missing coverage: ${assessment.requirementId}`,
        );
      }
      const links = linksByRequirement.get(assessment.requirementId) ?? [];
      const decision = deriveJobRequirementEmphasisDecision(assessment);
      const selected = ["primary", "secondary", "supporting"].includes(decision);
      const selectedLinks = selected ? links : [];
      return {
        id: `job-requirement-emphasis_${hashText(
          [
            planId,
            assessment.requirementId,
            decision,
            JOB_RESUME_PLANNING_POLICY_VERSION,
          ].join("\0"),
        ).slice(0, 16)}`,
        requirementId: assessment.requirementId,
        category: assessment.category,
        necessity: assessment.necessity,
        assessmentState: assessment.assessmentState,
        coverageState: assessment.coverageState,
        proofStrength: assessment.proofStrength,
        materiality: assessment.materiality,
        decision,
        selectedLinkIds: selectedLinks.map((link) => link.id).sort(),
        selectedEvidenceIds: uniqueSorted(
          selectedLinks.map((link) => link.evidenceId),
        ),
        selectedClaimIds: uniqueSorted(
          selectedLinks.map((link) => link.claimId),
        ),
        allowedTerminology: selected
          ? permittedTerminology(selectedLinks)
          : [],
        allowedSections: selected
          ? allowedSectionsForRequirement(context, assessment, selectedLinks)
          : [],
        rationaleCode: emphasisRationale(assessment),
        cautionCodes: emphasisCautions(assessment),
        provenance: elementProvenance(
          context,
          [assessment.requirementId],
          selectedLinks.map((link) => link.id),
        ),
      };
    })
    .sort((left, right) =>
      left.requirementId.localeCompare(right.requirementId),
    );
}

function derivePositioning(
  context: JobResumePlanningContext,
  emphasis: JobRequirementEmphasis[],
) {
  const state = deriveJobPositioningState(context.assessment.overall.state);
  const selected = emphasis.filter((entry) =>
    ["primary", "secondary", "supporting"].includes(entry.decision),
  );
  const primaryRequirementIds = selected
    .filter((entry) => entry.decision === "primary")
    .map((entry) => entry.requirementId);
  const supportingRequirementIds = selected
    .filter((entry) => entry.decision !== "primary")
    .map((entry) => entry.requirementId);
  const cautionRequirementIds = emphasis
    .filter((entry) =>
      entry.decision === "defer" ||
      entry.decision === "exclude" ||
      entry.cautionCodes.length > 0,
    )
    .map((entry) => entry.requirementId);
  return {
    state,
    sourceOverallAssessment: context.assessment.overall.state,
    targetTitle: context.target.title,
    targetTitleUse: "positioning-only" as const,
    primaryRequirementIds,
    supportingRequirementIds,
    cautionRequirementIds,
    rationaleCode: positioningRationale(context.assessment.overall.state),
    prohibitedUses: [
      "employment-history" as const,
      "seniority-proof" as const,
      "authority-proof" as const,
      "scope-proof" as const,
    ],
    provenance: elementProvenance(
      context,
      emphasis.map((entry) => entry.requirementId),
      uniqueSorted(emphasis.flatMap((entry) => entry.selectedLinkIds)),
    ),
  };
}

function deriveClaimBoundaries(
  context: JobResumePlanningContext,
  planId: string,
  emphasis: JobRequirementEmphasis[],
): JobResumeClaimBoundary[] {
  const boundaries: JobResumeClaimBoundary[] = emphasis.map((entry) => {
    const state: JobResumeClaimBoundary["state"] =
      entry.decision === "exclude"
        ? "prohibited"
        : entry.decision === "defer"
          ? "requires-caution"
          : entry.assessmentState === "partial"
            ? "allowed-with-qualifier"
            : "allowed";
    const allowed = state === "allowed" || state === "allowed-with-qualifier"
      ? contentTypesForRequirement(entry)
      : [];
    return {
      id: `job-claim-boundary_${hashText(
        [planId, entry.requirementId, state, "requirement"].join("\0"),
      ).slice(0, 16)}`,
      kind: "requirement-claim",
      requirementId: entry.requirementId,
      evidenceIds: entry.selectedEvidenceIds,
      claimIds: entry.selectedClaimIds,
      state,
      allowedClaimTypes: allowed,
      prohibitedClaimTypes: allContentTypes().filter(
        (type) => !allowed.includes(type),
      ),
      requiredQualifierCodes:
        state === "allowed-with-qualifier"
          ? ["evidence-scoped-wording", "partial-support-only"]
          : state === "requires-caution"
            ? ["evidence-scoped-wording", "adjacent-not-direct"]
            : [],
      prohibitedInferenceCodes: baseProhibitedInferences(),
      rationaleCode:
        state === "allowed"
          ? "direct-reviewed-proof"
          : state === "allowed-with-qualifier"
            ? "qualified-partial-proof"
            : state === "requires-caution"
              ? "deferred-or-ambiguous-proof"
              : "unsupported-or-conflicting-proof",
      provenance: elementProvenance(
        context,
        [entry.requirementId],
        entry.selectedLinkIds,
      ),
    };
  });
  boundaries.push({
    id: `job-claim-boundary_${hashText(
      [planId, context.target.id, "target-title"].join("\0"),
    ).slice(0, 16)}`,
    kind: "target-title",
    evidenceIds: [],
    claimIds: [],
    state: "allowed-with-qualifier",
    allowedClaimTypes: ["target-title"],
    prohibitedClaimTypes: allContentTypes().filter(
      (type) => type !== "target-title",
    ),
    requiredQualifierCodes: ["target-title-positioning-only"],
    prohibitedInferenceCodes: baseProhibitedInferences(),
    rationaleCode: "target-title-not-history",
    provenance: elementProvenance(context, [], []),
  });
  const projectEvidence = selectedEvidence(context, emphasis).filter(
    (evidence) => evidence.category === "project" || evidence.parentProjectId,
  );
  for (const evidence of projectEvidence) {
    const links = context.evidenceMap.links.filter(
      (link) => link.evidenceId === evidence.id,
    );
    boundaries.push({
      id: `job-claim-boundary_${hashText(
        [planId, evidence.id, "project-employment"].join("\0"),
      ).slice(0, 16)}`,
      kind: "project-employment",
      evidenceIds: [evidence.id],
      claimIds: uniqueSorted(links.map((link) => link.claimId)),
      state: "allowed-with-qualifier",
      allowedClaimTypes: [
        "project",
        "technology",
        "domain",
        "product-outcome",
      ],
      prohibitedClaimTypes: ["role-title"],
      requiredQualifierCodes: ["project-scoped-wording"],
      prohibitedInferenceCodes: baseProhibitedInferences(),
      rationaleCode: "project-scope-not-employment",
      provenance: elementProvenance(
        context,
        uniqueSorted(links.map((link) => link.requirementId)),
        links.map((link) => link.id),
      ),
    });
  }
  return boundaries.sort((left, right) => left.id.localeCompare(right.id));
}

function deriveEvidenceSelections(
  context: JobResumePlanningContext,
  planId: string,
  emphasis: JobRequirementEmphasis[],
  boundaries: JobResumeClaimBoundary[],
): JobResumeEvidenceSelection[] {
  const emphasisByRequirement = new Map(
    emphasis.map((entry) => [entry.requirementId, entry]),
  );
  const linksByEvidence = groupBy(
    context.evidenceMap.links,
    (link) => link.evidenceId,
  );
  return [...linksByEvidence.entries()]
    .map(([evidenceId, links]) => {
      const sortedUses = links
        .map((link) => {
          const requirement = emphasisByRequirement.get(link.requirementId);
          if (!requirement) {
            throw new Error(
              `Evidence link references unknown planning requirement: ${link.requirementId}`,
            );
          }
          const decision = evidenceUseDecision(requirement.decision, link);
          return {
            requirementId: link.requirementId,
            linkIds: [link.id],
            decision,
            intendedSections: ["defer", "exclude"].includes(decision)
              ? []
              : requirement.allowedSections,
            purposeCode: evidencePurpose(decision),
          };
        })
        .sort((left, right) =>
          requirementUseRank(left.decision) -
            requirementUseRank(right.decision) ||
          left.requirementId.localeCompare(right.requirementId),
        );
      const selectedUses = sortedUses.filter(
        (entry) => !["defer", "exclude"].includes(entry.decision),
      );
      if (selectedUses.filter((entry) => entry.decision === "primary").length > 1) {
        let primarySeen = false;
        for (const use of sortedUses) {
          if (use.decision !== "primary") continue;
          if (!primarySeen) primarySeen = true;
          else {
            use.decision = "supporting";
            use.purposeCode = "supporting-context";
          }
        }
      }
      const decision = sortedUses
        .map((entry) => entry.decision)
        .sort((left, right) =>
          requirementUseRank(left) - requirementUseRank(right),
        )[0];
      const intendedSections = uniqueSorted(
        sortedUses.flatMap((entry) => entry.intendedSections),
      ) as JobResumeSectionType[];
      const evidence = requiredEvidence(context, evidenceId);
      const selectedRequirementIds = sortedUses
        .filter((entry) => !["defer", "exclude"].includes(entry.decision))
        .map((entry) => entry.requirementId);
      const reuseWarning =
        new Set(selectedRequirementIds).size > 1 ||
        intendedSections.length > 2;
      return {
        id: `job-evidence-selection_${hashText(
          [planId, evidenceId, JOB_RESUME_PLANNING_POLICY_VERSION].join("\0"),
        ).slice(0, 16)}`,
        evidenceId,
        claimIds: uniqueSorted(links.map((link) => link.claimId)),
        decision,
        relationships: uniqueSorted(
          links.map((link) => link.relationship),
        ) as JobResumeEvidenceSelection["relationships"],
        requirementUses: sortedUses,
        intendedSections,
        ...(decision === "primary"
          ? {
              primaryRequirementId: sortedUses.find(
                (entry) => entry.decision === "primary",
              )?.requirementId,
            }
          : {}),
        reuseWarning,
        boundaryIds: boundaries
          .filter((boundary) => boundary.evidenceIds.includes(evidenceId))
          .map((boundary) => boundary.id)
          .sort(),
        limitationCodes: uniqueSorted([
          ...(links.some((link) => link.relationship === "partial")
            ? ["partial-relationship" as const]
            : []),
          ...(links.every((link) => link.relationship === "supporting")
            ? ["supporting-relationship-only" as const]
            : []),
          ...(links.some(
            (link) =>
              link.evidenceStrength === "weak" ||
              link.linkConfidence === "low",
          )
            ? ["limited-proof" as const]
            : []),
          ...(evidence.category === "project" || evidence.parentProjectId
            ? ["project-scoped" as const]
            : []),
          ...(!hasVerifiedMetric(context, evidenceId)
            ? ["no-verified-metric" as const]
            : []),
          ...(reuseWarning ? ["multiple-section-reuse" as const] : []),
        ]) as JobResumeEvidenceSelection["limitationCodes"],
        provenance: elementProvenance(
          context,
          uniqueSorted(links.map((link) => link.requirementId)),
          links.map((link) => link.id),
        ),
      };
    })
    .sort((left, right) => left.evidenceId.localeCompare(right.evidenceId));
}

function deriveMetricPermissions(
  context: JobResumePlanningContext,
  planId: string,
  emphasis: JobRequirementEmphasis[],
): JobMetricPermission[] {
  const selectedClaimIds = new Set(
    emphasis
      .filter((entry) =>
        ["primary", "secondary", "supporting"].includes(entry.decision),
      )
      .flatMap((entry) => entry.selectedClaimIds),
  );
  const pairs = new Map<string, { evidence: EvidenceItem; claim: Claim }>();
  for (const link of context.evidenceMap.links) {
    if (!selectedClaimIds.has(link.claimId)) continue;
    const evidence = requiredEvidence(context, link.evidenceId);
    const claim = requiredClaim(context, link.claimId);
    pairs.set(`${evidence.id}\0${claim.id}`, { evidence, claim });
  }
  return [...pairs.values()]
    .map(({ evidence, claim }) => {
      const allowed =
        claim.metricStatus === "verified_metric" &&
        claim.approvalStatus === "approved" &&
        claim.outputReadiness === "resume_ready" &&
        claim.publicSafe &&
        !claim.needsConfirmation &&
        Boolean(claim.approvedWording);
      const links = context.evidenceMap.links.filter(
        (link) =>
          link.evidenceId === evidence.id && link.claimId === claim.id,
      );
      return {
        id: `job-metric-permission_${hashText(
          [planId, evidence.id, claim.id, allowed ? "allowed" : "prohibited"].join("\0"),
        ).slice(0, 16)}`,
        evidenceId: evidence.id,
        claimId: claim.id,
        state: allowed ? "allowed" as const : "prohibited" as const,
        ...(allowed
          ? { exactApprovedMetricText: claim.approvedWording }
          : {}),
        scope: {
          ...(claim.parentRoleId
            ? { parentRoleId: claim.parentRoleId }
            : evidence.parentRoleId
              ? { parentRoleId: evidence.parentRoleId }
              : {}),
          ...(claim.parentProjectId
            ? { parentProjectId: claim.parentProjectId }
            : evidence.parentProjectId
              ? { parentProjectId: evidence.parentProjectId }
              : {}),
          ...(claim.sourceSection
            ? { sourceSection: claim.sourceSection }
            : evidence.sourceSection
              ? { sourceSection: evidence.sourceSection }
              : {}),
        },
        qualifierCodes: [
          ...(allowed ? ["use-exact-approved-text" as const] : []),
          "preserve-reviewed-scope" as const,
          "do-not-round" as const,
          "do-not-combine" as const,
          "do-not-infer-scale" as const,
        ],
        allowedSections: allowed
          ? metricSections(evidence)
          : [],
        provenance: elementProvenance(
          context,
          uniqueSorted(links.map((link) => link.requirementId)),
          links.map((link) => link.id),
        ),
      };
    })
    .sort((left, right) =>
      `${left.evidenceId}\0${left.claimId}`.localeCompare(
        `${right.evidenceId}\0${right.claimId}`,
      ),
    );
}

function deriveGapHandling(
  context: JobResumePlanningContext,
  planId: string,
  emphasis: JobRequirementEmphasis[],
): JobGapHandlingRule[] {
  return emphasis
    .filter(
      (entry) =>
        entry.assessmentState === "partial" ||
        entry.assessmentState === "gap" ||
        entry.assessmentState === "contradiction" ||
        entry.assessmentState === "indeterminate",
    )
    .map((entry) => ({
      id: `job-gap-handling_${hashText(
        [planId, entry.requirementId, entry.assessmentState].join("\0"),
      ).slice(0, 16)}`,
      requirementId: entry.requirementId,
      assessmentState: entry.assessmentState,
      decision:
        entry.assessmentState === "partial"
          ? "drafting-caution" as const
          : entry.assessmentState === "indeterminate"
            ? "defer" as const
            : "exclude-positive-positioning" as const,
      adjacentEvidenceIds:
        entry.assessmentState === "partial"
          ? entry.selectedEvidenceIds
          : [],
      adjacentClaimIds:
        entry.assessmentState === "partial"
          ? entry.selectedClaimIds
          : [],
      constraintCodes: [
        "not-positive-positioning" as const,
        "not-direct-satisfaction" as const,
        "no-compensating-narrative" as const,
        "no-gap-closing-advice" as const,
        "no-application-advice" as const,
      ],
      provenance: elementProvenance(
        context,
        [entry.requirementId],
        entry.selectedLinkIds,
      ),
    }))
    .sort((left, right) =>
      left.requirementId.localeCompare(right.requirementId),
    );
}

function deriveSections(
  context: JobResumePlanningContext,
  planId: string,
  emphasis: JobRequirementEmphasis[],
  evidenceSelections: JobResumeEvidenceSelection[],
  boundaries: JobResumeClaimBoundary[],
  metrics: JobMetricPermission[],
  exclusions: JobResumeContentExclusion[],
  risks: JobResumePlanningRisk[],
  warnings: JobResumePlanningWarning[],
): JobResumeSectionPlan[] {
  const selected = emphasis.filter((entry) =>
    ["primary", "secondary", "supporting"].includes(entry.decision),
  );
  const usableEvidence = evidenceSelections.filter(
    (entry) => !["defer", "exclude"].includes(entry.decision),
  );
  const evidenceById = new Map(
    context.evidenceItems.map((entry) => [entry.id, entry]),
  );
  const hasExperience = usableEvidence.some((entry) => {
    const evidence = evidenceById.get(entry.evidenceId);
    return evidence?.category === "role" || Boolean(evidence?.parentRoleId);
  });
  const hasProjects = usableEvidence.some((entry) => {
    const evidence = evidenceById.get(entry.evidenceId);
    return evidence?.category === "project" || Boolean(evidence?.parentProjectId);
  });
  const hasImpact =
    metrics.some((entry) => entry.state === "allowed") ||
    usableEvidence.some(
      (entry) => evidenceById.get(entry.evidenceId)?.category === "achievement",
    );
  const hasTechnical = selected.some(
    (entry) => entry.category === "technical-expectation",
  );
  const hasLeadership = selected.some(
    (entry) => entry.category === "leadership-expectation",
  );
  const hasEducation = usableEvidence.some(
    (entry) => evidenceById.get(entry.evidenceId)?.category === "education",
  );
  const hasCertification = usableEvidence.some(
    (entry) => evidenceById.get(entry.evidenceId)?.category === "certification",
  );
  const specs: Array<{
    type: JobResumeSectionType;
    inclusion: JobResumeSectionPlan["inclusion"];
    objectiveCode: JobResumeSectionPlan["objectiveCode"];
    allowedContentTypes: JobResumeContentType[];
    maximumItemCount?: number;
  }> = [
    {
      type: "headline",
      inclusion: "include",
      objectiveCode: "position-target-without-history-claim",
      allowedContentTypes: ["target-title", "capability-theme"],
      maximumItemCount: 1,
    },
    {
      type: "professional-summary",
      inclusion: selected.length ? "include" : "exclude",
      objectiveCode: "summarize-selected-proof-themes",
      allowedContentTypes: ["capability-theme", "scope", "domain"],
      maximumItemCount: 1,
    },
    {
      type: "core-capabilities",
      inclusion: selected.length ? "include" : "exclude",
      objectiveCode: "group-job-relevant-capabilities",
      allowedContentTypes: [
        "capability-theme",
        "technology",
        "domain",
        "leadership-behavior",
      ],
      maximumItemCount: 8,
    },
    {
      type: "selected-impact",
      inclusion: hasImpact ? "optional" : "exclude",
      objectiveCode: "surface-reviewed-outcomes",
      allowedContentTypes: [
        "achievement",
        "delivery-outcome",
        "product-outcome",
        "business-outcome",
        "quantified-outcome",
      ],
      maximumItemCount: 4,
    },
    {
      type: "professional-experience",
      inclusion: hasExperience ? "include" : "exclude",
      objectiveCode: "organize-reviewed-employment-evidence",
      allowedContentTypes: [
        "role-title",
        "scope",
        "responsibility",
        "achievement",
        "delivery-outcome",
      ],
      maximumItemCount: 8,
    },
    {
      type: "selected-projects",
      inclusion: hasProjects ? "optional" : "exclude",
      objectiveCode: "organize-project-scoped-evidence",
      allowedContentTypes: [
        "project",
        "technology",
        "domain",
        "product-outcome",
      ],
      maximumItemCount: 4,
    },
    {
      type: "technical-capabilities",
      inclusion: hasTechnical ? "optional" : "exclude",
      objectiveCode: "group-reviewed-technical-capabilities",
      allowedContentTypes: ["technology", "domain", "capability-theme"],
      maximumItemCount: 12,
    },
    {
      type: "leadership-capabilities",
      inclusion: hasLeadership ? "optional" : "exclude",
      objectiveCode: "group-reviewed-leadership-capabilities",
      allowedContentTypes: ["leadership-behavior", "scope"],
      maximumItemCount: 6,
    },
    {
      type: "education",
      inclusion: hasEducation ? "optional" : "exclude",
      objectiveCode: "retain-relevant-education",
      allowedContentTypes: ["education"],
      maximumItemCount: 4,
    },
    {
      type: "certifications",
      inclusion: hasCertification ? "optional" : "exclude",
      objectiveCode: "retain-relevant-certifications",
      allowedContentTypes: ["certification"],
      maximumItemCount: 6,
    },
    {
      type: "additional-information",
      inclusion: "exclude",
      objectiveCode: "retain-approved-additional-information",
      allowedContentTypes: [],
    },
  ];
  let includedOrder = 0;
  let excludedOrder = specs.length;
  return specs.map((spec) => {
    const relevantRequirements =
      spec.inclusion === "exclude"
        ? []
        : selected.filter((entry) =>
            entry.allowedSections.includes(spec.type),
          );
    const evidenceIds = uniqueSorted(
      relevantRequirements.flatMap((entry) => entry.selectedEvidenceIds),
    ).filter((evidenceId) =>
      evidenceAllowedInSection(context, evidenceId, spec.type, metrics),
    );
    const claimIds = uniqueSorted(
      context.evidenceMap.links
        .filter((link) => evidenceIds.includes(link.evidenceId))
        .map((link) => link.claimId),
    );
    const boundaryIds = boundaries
      .filter(
        (boundary) =>
          boundary.kind === "target-title" && spec.type === "headline" ||
          boundary.evidenceIds.some((id) => evidenceIds.includes(id)) ||
          boundary.requirementId !== undefined &&
            relevantRequirements.some(
              (entry) => entry.requirementId === boundary.requirementId,
            ),
      )
      .map((entry) => entry.id)
      .sort();
    const exclusionIds = exclusions
      .filter((entry) =>
        entry.sourceIds.some(
          (id) =>
            evidenceIds.includes(id) ||
            claimIds.includes(id) ||
            relevantRequirements.some(
              (requirement) => requirement.requirementId === id,
            ),
        ),
      )
      .map((entry) => entry.id)
      .sort();
    return {
      id: `job-section-plan_${hashText(
        [planId, spec.type, JOB_RESUME_PLANNING_POLICY_VERSION].join("\0"),
      ).slice(0, 16)}`,
      type: spec.type,
      inclusion: spec.inclusion,
      order:
        spec.inclusion === "exclude"
          ? excludedOrder++
          : includedOrder++,
      objectiveCode: spec.objectiveCode,
      requirementIds: relevantRequirements
        .map((entry) => entry.requirementId)
        .sort(),
      evidenceIds,
      claimIds,
      boundaryIds,
      exclusionIds,
      allowedContentTypes: spec.allowedContentTypes,
      ...(spec.maximumItemCount
        ? { maximumItemCount: spec.maximumItemCount }
        : {}),
      riskCodes: uniqueSorted(
        risks
          .filter((risk) =>
            risk.requirementIds.some((id) =>
              relevantRequirements.some(
                (entry) => entry.requirementId === id,
              ),
            ) ||
            risk.evidenceIds.some((id) => evidenceIds.includes(id)),
          )
          .map((risk) => risk.code),
      ),
      warningCodes: uniqueSorted(
        warnings
          .filter(
            (warning) =>
              warning.requirementIds.length === 0 ||
              warning.requirementIds.some((id) =>
                relevantRequirements.some(
                  (entry) => entry.requirementId === id,
                ),
              ),
          )
          .map((warning) => warning.code),
      ),
      provenance: elementProvenance(
        context,
        relevantRequirements.map((entry) => entry.requirementId),
        uniqueSorted(
          context.evidenceMap.links
            .filter((link) => evidenceIds.includes(link.evidenceId))
            .map((link) => link.id),
        ),
      ),
    };
  });
}

function deriveExclusions(
  context: JobResumePlanningContext,
  planId: string,
  emphasis: JobRequirementEmphasis[],
  evidenceSelections: JobResumeEvidenceSelection[],
  metricPermissions: JobMetricPermission[],
): JobResumeContentExclusion[] {
  const exclusions: JobResumeContentExclusion[] = [];
  for (const entry of emphasis.filter((candidate) =>
    ["defer", "exclude"].includes(candidate.decision),
  )) {
    const type =
      entry.assessmentState === "contradiction"
        ? "contradicted-requirement" as const
        : entry.assessmentState === "indeterminate"
          ? "indeterminate-requirement" as const
          : "unsupported-requirement" as const;
    exclusions.push(exclusion(
      context,
      planId,
      type,
      "requirement",
      [entry.requirementId],
      entry.assessmentState === "contradiction"
        ? "explicit-contradiction"
        : entry.assessmentState === "indeterminate"
          ? "unresolved-ambiguity"
          : "no-reviewed-proof",
      entry.necessity === "mandatory" ? "high" : "medium",
      [entry.requirementId],
      [],
    ));
  }
  exclusions.push(exclusion(
    context,
    planId,
    "target-title-history",
    "target",
    [context.target.id],
    "target-title-is-not-history",
    "blocking",
    [],
    [],
  ));
  for (const selection of evidenceSelections) {
    const evidence = requiredEvidence(context, selection.evidenceId);
    if (evidence.category === "project" || evidence.parentProjectId) {
      exclusions.push(exclusion(
        context,
        planId,
        "project-as-employment",
        "evidence",
        [evidence.id],
        "project-scope-is-not-employment",
        "blocking",
        selection.requirementUses.map((entry) => entry.requirementId),
        selection.requirementUses.flatMap((entry) => entry.linkIds),
      ));
    }
    if (selection.reuseWarning) {
      exclusions.push(exclusion(
        context,
        planId,
        "duplicate-evidence-use",
        "evidence",
        [evidence.id],
        "deduplicated-use",
        "low",
        selection.requirementUses.map((entry) => entry.requirementId),
        selection.requirementUses.flatMap((entry) => entry.linkIds),
      ));
    }
  }
  for (const metric of metricPermissions.filter(
    (entry) => entry.state === "prohibited",
  )) {
    exclusions.push(exclusion(
      context,
      planId,
      "unverified-metric",
      "claim",
      [metric.claimId],
      "metric-not-verified",
      "blocking",
      metric.provenance.requirementIds,
      metric.provenance.evidenceLinkReferences.map((entry) => entry.linkId),
    ));
  }
  return exclusions.sort((left, right) => left.id.localeCompare(right.id));
}

function deriveRisks(
  context: JobResumePlanningContext,
  planId: string,
  emphasis: JobRequirementEmphasis[],
  evidence: JobResumeEvidenceSelection[],
  metrics: JobMetricPermission[],
): JobResumePlanningRisk[] {
  const risks: JobResumePlanningRisk[] = [];
  const add = (
    code: JobResumePlanningRisk["code"],
    severity: JobResumePlanningRisk["severity"],
    message: string,
    requirementIds: string[] = [],
    evidenceIds: string[] = [],
    claimIds: string[] = [],
  ) => risks.push({
    id: findingId(planId, "risk", code, [...requirementIds, ...evidenceIds, ...claimIds]),
    code,
    severity,
    message,
    requirementIds: uniqueSorted(requirementIds),
    evidenceIds: uniqueSorted(evidenceIds),
    claimIds: uniqueSorted(claimIds),
  });
  const mandatoryDeferred = emphasis.filter(
    (entry) =>
      entry.necessity === "mandatory" &&
      ["defer", "exclude"].includes(entry.decision),
  );
  if (mandatoryDeferred.length) add(
    "MANDATORY_REQUIREMENT_NOT_POSITIONABLE",
    "critical",
    "One or more mandatory requirements cannot be included in positive positioning.",
    mandatoryDeferred.map((entry) => entry.requirementId),
  );
  const partial = emphasis.filter((entry) => entry.assessmentState === "partial");
  if (partial.length) add(
    "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK",
    "high",
    "Partial requirement proof must remain qualified and cannot be presented as direct satisfaction.",
    partial.map((entry) => entry.requirementId),
    partial.flatMap((entry) => entry.selectedEvidenceIds),
    partial.flatMap((entry) => entry.selectedClaimIds),
  );
  add(
    "TARGET_TITLE_HISTORY_RISK",
    "critical",
    "The Job Target title is positioning metadata and must not become employment history.",
  );
  const projects = evidence.filter((entry) => {
    const item = requiredEvidence(context, entry.evidenceId);
    return item.category === "project" || Boolean(item.parentProjectId);
  });
  if (projects.length) add(
    "PROJECT_AS_EMPLOYMENT_RISK",
    "critical",
    "Project evidence must remain project-scoped unless employment provenance exists.",
    projects.flatMap((entry) =>
      entry.requirementUses.map((use) => use.requirementId),
    ),
    projects.map((entry) => entry.evidenceId),
    projects.flatMap((entry) => entry.claimIds),
  );
  const responsibilities = evidence.filter(
    (entry) =>
      requiredEvidence(context, entry.evidenceId).category === "responsibility",
  );
  if (responsibilities.length) add(
    "RESPONSIBILITY_AS_ACHIEVEMENT_RISK",
    "high",
    "Responsibility evidence must not be rewritten as an achievement or outcome.",
    responsibilities.flatMap((entry) =>
      entry.requirementUses.map((use) => use.requirementId),
    ),
    responsibilities.map((entry) => entry.evidenceId),
    responsibilities.flatMap((entry) => entry.claimIds),
  );
  if (metrics.some((entry) => entry.state === "prohibited")) add(
    "UNSUPPORTED_METRIC_RISK",
    "critical",
    "Quantification is prohibited for selected claims without an approved resume-ready verified metric.",
    [],
    metrics.filter((entry) => entry.state === "prohibited").map((entry) => entry.evidenceId),
    metrics.filter((entry) => entry.state === "prohibited").map((entry) => entry.claimId),
  );
  const reused = evidence.filter((entry) => entry.reuseWarning);
  if (reused.length) add(
    "EVIDENCE_OVERUSE_RISK",
    "medium",
    "Repeated evidence use requires distinct section purpose and one primary allocation.",
    reused.flatMap((entry) =>
      entry.requirementUses.map((use) => use.requirementId),
    ),
    reused.map((entry) => entry.evidenceId),
    reused.flatMap((entry) => entry.claimIds),
  );
  return risks.sort((left, right) => left.id.localeCompare(right.id));
}

function deriveWarnings(
  context: JobResumePlanningContext,
  planId: string,
  emphasis: JobRequirementEmphasis[],
  metrics: JobMetricPermission[],
): JobResumePlanningWarning[] {
  const definitions: Array<[
    JobResumePlanningWarning["code"],
    string,
    string[],
  ]> = [
    [
      "JOB_SPECIFIC_PLAN_ONLY",
      "This plan is scoped to one Job Target and must not mutate reusable Role artifacts.",
      [],
    ],
    [
      "NOT_A_RESUME",
      "This artifact contains planning metadata only and is not resume prose.",
      [],
    ],
    [
      "NO_APPLICATION_RECOMMENDATION",
      "This plan does not recommend whether to apply.",
      [],
    ],
    [
      "NO_ATS_SCORE",
      "This plan contains no ATS, fit, competitiveness, or hiring score.",
      [],
    ],
    [
      "REVIEWED_EVIDENCE_ONLY",
      "Only current approved public-safe resume-ready evidence already present in the Job Evidence Map is selected.",
      [],
    ],
  ];
  const materialGaps = emphasis.filter(
    (entry) =>
      ["critical", "material"].includes(entry.materiality) &&
      ["defer", "exclude"].includes(entry.decision),
  );
  if (materialGaps.length) definitions.push([
    "MATERIAL_GAP_EXCLUDED",
    "Material gaps are excluded from positive positioning and remain explicit planning constraints.",
    materialGaps.map((entry) => entry.requirementId),
  ]);
  if (!metrics.some((entry) => entry.state === "allowed")) definitions.push([
    "NO_VERIFIED_METRIC_AVAILABLE",
    "No selected claim has an approved resume-ready verified metric; quantification is prohibited.",
    [],
  ]);
  if (
    context.assessment.ambiguities.length > 0 ||
    emphasis.some((entry) => entry.decision === "defer")
  ) definitions.push([
    "OPTIONAL_ESCALATION_NOT_PERFORMED",
    "Unresolved ambiguity is preserved; no model or human-adjudication workflow was introduced.",
    emphasis.filter((entry) => entry.decision === "defer").map((entry) => entry.requirementId),
  ]);
  return definitions.map(([code, message, requirementIds]) => ({
    id: findingId(planId, "warning", code, requirementIds),
    code,
    message,
    requirementIds: uniqueSorted(requirementIds),
    evidenceIds: [],
    claimIds: [],
  })).sort((left, right) => left.id.localeCompare(right.id));
}

function deriveAmbiguities(
  context: JobResumePlanningContext,
  planId: string,
  emphasis: JobRequirementEmphasis[],
  evidence: JobResumeEvidenceSelection[],
): JobResumePlanningAmbiguity[] {
  const ambiguities: JobResumePlanningAmbiguity[] = [];
  const add = (
    code: JobResumePlanningAmbiguity["code"],
    message: string,
    requirementIds: string[] = [],
    evidenceIds: string[] = [],
    claimIds: string[] = [],
  ) => ambiguities.push({
    id: findingId(planId, "ambiguity", code, [...requirementIds, ...evidenceIds]),
    code,
    message,
    requirementIds: uniqueSorted(requirementIds),
    evidenceIds: uniqueSorted(evidenceIds),
    claimIds: uniqueSorted(claimIds),
  });
  const deferred = emphasis.filter((entry) => entry.decision === "defer");
  if (deferred.length) add(
    "REQUIREMENT_POSITIONING_DEFERRED",
    "Requirement positioning remains deferred rather than being strengthened without proof.",
    deferred.map((entry) => entry.requirementId),
  );
  const partial = emphasis.filter((entry) => entry.assessmentState === "partial");
  if (partial.length) add(
    "ADJACENT_EVIDENCE_NOT_DIRECT",
    "Partial evidence may support adjacent wording but not direct requirement satisfaction.",
    partial.map((entry) => entry.requirementId),
    partial.flatMap((entry) => entry.selectedEvidenceIds),
    partial.flatMap((entry) => entry.selectedClaimIds),
  );
  const project = evidence.filter((entry) => {
    const item = requiredEvidence(context, entry.evidenceId);
    return item.category === "project" || Boolean(item.parentProjectId);
  });
  if (project.length) add(
    "PROJECT_EMPLOYMENT_BOUNDARY",
    "Project evidence remains separate from employment history.",
    project.flatMap((entry) =>
      entry.requirementUses.map((use) => use.requirementId),
    ),
    project.map((entry) => entry.evidenceId),
    project.flatMap((entry) => entry.claimIds),
  );
  const responsibility = evidence.filter(
    (entry) =>
      requiredEvidence(context, entry.evidenceId).category === "responsibility",
  );
  if (responsibility.length) add(
    "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY",
    "Responsibility evidence remains distinct from achievement evidence.",
    responsibility.flatMap((entry) =>
      entry.requirementUses.map((use) => use.requirementId),
    ),
    responsibility.map((entry) => entry.evidenceId),
    responsibility.flatMap((entry) => entry.claimIds),
  );
  const reused = evidence.filter((entry) => entry.reuseWarning);
  if (reused.length) add(
    "EVIDENCE_REUSE_BOUNDARY",
    "Evidence reused for multiple requirements must retain one primary use and distinct secondary purposes.",
    reused.flatMap((entry) =>
      entry.requirementUses.map((use) => use.requirementId),
    ),
    reused.map((entry) => entry.evidenceId),
    reused.flatMap((entry) => entry.claimIds),
  );
  for (const upstream of context.assessment.ambiguities) add(
    "UPSTREAM_AMBIGUITY_PRESERVED",
    upstream.message,
    [upstream.requirementId],
    [],
    [],
  );
  return ambiguities.sort((left, right) => left.id.localeCompare(right.id));
}

function deriveCompleteness(
  context: JobResumePlanningContext,
  positioning: JobResumePositioningState,
  emphasis: JobRequirementEmphasis[],
  sections: JobResumeSectionPlan[],
  boundaries: JobResumeClaimBoundary[],
  gaps: JobGapHandlingRule[],
) {
  const requirementIds = emphasis.map((entry) => entry.requirementId).sort();
  const selectedRequirementIds = emphasis
    .filter((entry) =>
      ["primary", "secondary", "supporting"].includes(entry.decision),
    )
    .map((entry) => entry.requirementId)
    .sort();
  const deferredRequirementIds = emphasis
    .filter((entry) => entry.decision === "defer")
    .map((entry) => entry.requirementId)
    .sort();
  const excludedRequirementIds = emphasis
    .filter((entry) => entry.decision === "exclude")
    .map((entry) => entry.requirementId)
    .sort();
  const requiredBoundaries = new Set(requirementIds);
  const boundedRequirements = new Set(
    boundaries
      .filter((entry) => entry.kind === "requirement-claim")
      .map((entry) => entry.requirementId)
      .filter((entry): entry is string => Boolean(entry)),
  );
  const claimBoundariesComplete =
    boundaries.some((entry) => entry.kind === "target-title") &&
    [...requiredBoundaries].every((id) => boundedRequirements.has(id));
  const gapRequirements = emphasis
    .filter((entry) =>
      ["partial", "gap", "contradiction", "indeterminate"].includes(
        entry.assessmentState,
      ),
    )
    .map((entry) => entry.requirementId);
  const handledGaps = new Set(gaps.map((entry) => entry.requirementId));
  const criticalConstraintsRepresented = gapRequirements.every((id) =>
    handledGaps.has(id)
  );
  const provenanceComplete = emphasis.every(
    (entry) =>
      entry.provenance.requirementIds.includes(entry.requirementId) &&
      entry.provenance.coverageReferences.length === 1 &&
      entry.provenance.assessmentReferences.length === 1,
  );
  const includedSectionTypes = sections
    .filter((entry) => entry.inclusion !== "exclude")
    .map((entry) => entry.type);
  const status =
    requirementIds.length === 0
      ? "empty" as const
      : claimBoundariesComplete &&
          provenanceComplete &&
          criticalConstraintsRepresented &&
          includedSectionTypes.includes("headline")
        ? "complete" as const
        : "partial" as const;
  const blockingReasons = uniqueSorted([
    ...(status !== "complete"
      ? ["The deterministic plan is not structurally complete."]
      : []),
    ...(selectedRequirementIds.length === 0
      ? ["No requirement has defensible selected evidence for drafting."]
      : []),
    ...(positioning === "insufficient-proof"
      ? ["Overall proof is insufficient for job-specific resume drafting."]
      : []),
    ...(positioning === "indeterminate"
      ? ["Overall proof remains indeterminate for job-specific resume drafting."]
      : []),
  ]);
  return {
    status,
    requirementIds,
    plannedRequirementIds: [...requirementIds],
    selectedRequirementIds,
    deferredRequirementIds,
    excludedRequirementIds,
    includedSectionTypes,
    claimBoundariesComplete,
    provenanceComplete,
    criticalConstraintsRepresented,
    usableForDrafting:
      status === "complete" &&
      selectedRequirementIds.length > 0 &&
      positioning !== "insufficient-proof" &&
      positioning !== "indeterminate",
    blockingReasons,
  };
}

export async function loadJobResumePlanningContext(
  workspace: string,
  targetId: string,
): Promise<JobResumePlanningContext> {
  const target = await requireJobTarget(workspace, targetId);
  const assessmentStatus = await getJobFitProofAssessmentStatus(
    workspace,
    targetId,
  );
  if (assessmentStatus.status !== "current") {
    throw new Error(
      `Job Resume Content Planning requires a current Job Fit and Proof Assessment. Current status: ${assessmentStatus.status}. ${assessmentStatus.reasons.join(" ")}`,
    );
  }
  const coverageStatus = await getJobCoverageStatus(workspace, targetId);
  if (coverageStatus.status !== "current") {
    throw new Error(
      `Job Resume Content Planning requires current Job Requirement Coverage. Current status: ${coverageStatus.status}.`,
    );
  }
  const assessmentPaths = jobFitProofAssessmentPaths(workspace, targetId);
  const coveragePaths = jobCoveragePaths(workspace, targetId);
  const mapPaths = jobEvidenceMapPaths(workspace, targetId);
  const [assessment, coverage, evidenceMap] = await Promise.all([
    showJobFitProofAssessment(workspace, targetId),
    showJobCoverage(workspace, targetId),
    showJobEvidenceMap(workspace, targetId),
  ]);
  const [assessmentManifest, coverageManifest, mapManifest] = await Promise.all([
    readJson<unknown>(assessmentPaths.manifestPath, null).then((value) =>
      JobFitProofAssessmentManifestSchema.parse(value),
    ),
    readJson<unknown>(coveragePaths.manifestPath, null).then((value) =>
      JobRequirementCoverageManifestSchema.parse(value),
    ),
    readJson<unknown>(mapPaths.manifestPath, null).then((value) =>
      JobEvidenceMapManifestSchema.parse(value),
    ),
  ]);
  if (
    assessment.targetId !== targetId ||
    coverage.targetId !== targetId ||
    evidenceMap.targetId !== targetId ||
    assessmentManifest.targetId !== targetId ||
    coverageManifest.targetId !== targetId ||
    mapManifest.targetId !== targetId
  ) {
    throw new Error(
      "Job Resume Content Planning rejects cross-target dependencies.",
    );
  }
  const requirementInput = await loadRequirementInput(
    workspace,
    targetId,
    evidenceMap.input.requirementModelType,
  );
  const [
    targetSha256,
    sourceSha256,
    evidenceMapSha256,
    evidenceMapManifestSha256,
    coverageSha256,
    coverageManifestSha256,
    assessmentSha256,
    assessmentManifestSha256,
  ] = await Promise.all([
    hashFile(resolveWithin(workspace, `targets/jobs/${targetId}/target.json`)),
    hashFile(
      resolveWithin(workspace, `targets/jobs/${targetId}/job-description.md`),
    ),
    hashFile(mapPaths.mapPath),
    hashFile(mapPaths.manifestPath),
    hashFile(coveragePaths.coveragePath),
    hashFile(coveragePaths.manifestPath),
    hashFile(assessmentPaths.assessmentPath),
    hashFile(assessmentPaths.manifestPath),
  ]);
  const sourcesPath = resolveWithin(workspace, "kb/sources.json");
  const evidenceItemsPath = resolveWithin(workspace, "kb/evidence-items.json");
  const claimsPath = resolveWithin(workspace, "kb/claims.json");
  const [sourcesRaw, evidenceRaw, claimsRaw] = await Promise.all([
    readJson<unknown>(sourcesPath, []),
    readJson<unknown>(evidenceItemsPath, []),
    readJson<unknown>(claimsPath, []),
  ]);
  const sources = SourceSchema.array().parse(sourcesRaw);
  const evidenceItems = EvidenceItemSchema.array().parse(evidenceRaw);
  const claims = ClaimSchema.array().parse(claimsRaw);
  const [sourcesSha256, evidenceItemsSha256, claimsSha256] = await Promise.all([
    hashFile(sourcesPath),
    hashFile(evidenceItemsPath),
    hashFile(claimsPath),
  ]);
  const dependencyProblems = validateDependencyAgreement({
    targetId,
    targetSha256,
    sourceSha256,
    requirementInput,
    evidenceMap,
    evidenceMapSha256,
    evidenceMapManifestSha256,
    coverage,
    coverageSha256,
    coverageManifestSha256,
    assessment,
    assessmentSha256,
    assessmentManifestSha256,
    sourcesSha256,
    evidenceItemsSha256,
    claimsSha256,
  });
  if (dependencyProblems.length) {
    throw new Error(
      `Job Resume Content Planning dependency provenance is invalid. ${dependencyProblems.join(" ")}`,
    );
  }
  validateReferencedCandidateEvidence(evidenceMap, sources, evidenceItems, claims);
  const selectedEvidence = uniqueSorted(
    evidenceMap.links.map((link) => link.evidenceId),
  ).map((id) => {
    const evidence = evidenceItems.find((entry) => entry.id === id);
    if (!evidence) throw new Error(`Mapped evidence is missing: ${id}`);
    return evidence;
  });
  const selectedClaims = uniqueSorted(
    evidenceMap.links.map((link) => link.claimId),
  ).map((id) => {
    const claim = claims.find((entry) => entry.id === id);
    if (!claim) throw new Error(`Mapped claim is missing: ${id}`);
    return claim;
  });
  const selectedEvidenceSetSha256 = hashText(stableJson(selectedEvidence));
  const selectedClaimSetSha256 = hashText(stableJson(selectedClaims));
  const normalizedInputSha256 = normalizedPlanningInputHash({
    targetId,
    targetSha256,
    sourceSha256,
    requirementModelType: requirementInput.type,
    requirementModelSha256: requirementInput.modelSha256,
    requirementManifestSha256: requirementInput.manifestSha256,
    evidenceMapSha256,
    evidenceMapManifestSha256,
    coverageSha256,
    coverageManifestSha256,
    assessmentSha256,
    assessmentManifestSha256,
    sourcesSha256,
    evidenceItemsSha256,
    claimsSha256,
    selectedEvidenceSetSha256,
    selectedClaimSetSha256,
  });
  return {
    target,
    targetSha256,
    sourceSha256,
    requirementInput,
    evidenceMap,
    evidenceMapPath: mapPaths.mapRelativePath,
    evidenceMapSha256,
    evidenceMapManifestPath: mapPaths.manifestRelativePath,
    evidenceMapManifestSha256,
    coverage,
    coveragePath: coveragePaths.coverageRelativePath,
    coverageSha256,
    coverageManifestPath: coveragePaths.manifestRelativePath,
    coverageManifestSha256,
    assessment,
    assessmentPath: assessmentPaths.assessmentRelativePath,
    assessmentSha256,
    assessmentManifestPath: assessmentPaths.manifestRelativePath,
    assessmentManifestSha256,
    sources,
    evidenceItems,
    claims,
    sourcesSha256,
    evidenceItemsSha256,
    claimsSha256,
    selectedEvidenceSetSha256,
    selectedClaimSetSha256,
    normalizedInputSha256,
  };
}

async function loadRequirementInput(
  workspace: string,
  targetId: string,
  type: JobRequirementInputType,
): Promise<RequirementInput> {
  if (type === "deterministic") {
    const status = await getJobRequirementModelStatus(workspace, targetId);
    if (status.status !== "current") {
      throw new Error(
        `Deterministic Job Requirement Model status is ${status.status}.`,
      );
    }
    const paths = jobRequirementPaths(workspace, targetId);
    return {
      type,
      model: await showJobRequirementModel(workspace, targetId),
      modelPath: paths.modelRelativePath,
      modelSha256: await hashFile(paths.modelPath),
      manifestPath: paths.manifestRelativePath,
      manifestSha256: await hashFile(paths.manifestPath),
    };
  }
  const status = await getApprovedJobRequirementsStatus(workspace, targetId);
  if (status.status !== "current") {
    throw new Error(
      `Approved Job Requirement Model status is ${status.status}.`,
    );
  }
  const paths = approvedJobRequirementPaths(workspace, targetId);
  return {
    type,
    model: await showApprovedJobRequirements(workspace, targetId),
    modelPath: paths.approvedModelRelativePath,
    modelSha256: await hashFile(paths.approvedModelPath),
    manifestPath: paths.manifestRelativePath,
    manifestSha256: await hashFile(paths.manifestPath),
  };
}

function validateDependencyAgreement(input: {
  targetId: string;
  targetSha256: string;
  sourceSha256: string;
  requirementInput: RequirementInput;
  evidenceMap: JobEvidenceMap;
  evidenceMapSha256: string;
  evidenceMapManifestSha256: string;
  coverage: JobRequirementCoverageModel;
  coverageSha256: string;
  coverageManifestSha256: string;
  assessment: JobFitProofAssessment;
  assessmentSha256: string;
  assessmentManifestSha256: string;
  sourcesSha256: string;
  evidenceItemsSha256: string;
  claimsSha256: string;
}): string[] {
  const {
    targetId,
    targetSha256,
    sourceSha256,
    requirementInput,
    evidenceMap,
    evidenceMapSha256,
    evidenceMapManifestSha256,
    coverage,
    coverageSha256,
    coverageManifestSha256,
    assessment,
    assessmentSha256,
    assessmentManifestSha256,
    sourcesSha256,
    evidenceItemsSha256,
    claimsSha256,
  } = input;
  return uniqueSorted([
    ...(requirementInput.model.targetId !== targetId
      ? ["Requirement Model belongs to another target."]
      : []),
    ...(evidenceMap.input.target.sha256 !== targetSha256
      ? ["Evidence Map target hash changed."]
      : []),
    ...(evidenceMap.input.jobDescription.sha256 !== sourceSha256
      ? ["Evidence Map Job Description hash changed."]
      : []),
    ...(evidenceMap.input.requirementModel.sha256 !==
    requirementInput.modelSha256
      ? ["Evidence Map requirement-model hash changed."]
      : []),
    ...(evidenceMap.input.requirementManifest.sha256 !==
    requirementInput.manifestSha256
      ? ["Evidence Map requirement-manifest hash changed."]
      : []),
    ...(evidenceMap.input.sources.sha256 !== sourcesSha256
      ? ["Source registry changed."]
      : []),
    ...(evidenceMap.input.evidenceItems.sha256 !== evidenceItemsSha256
      ? ["Reviewed evidence items changed."]
      : []),
    ...(evidenceMap.input.claims.sha256 !== claimsSha256
      ? ["Reviewed claims changed."]
      : []),
    ...(coverage.input.evidenceMap.sha256 !== evidenceMapSha256
      ? ["Coverage does not reference the current Evidence Map."]
      : []),
    ...(coverage.input.evidenceMapManifest.sha256 !==
    evidenceMapManifestSha256
      ? ["Coverage does not reference the current Evidence Map manifest."]
      : []),
    ...(assessment.input.coverage.sha256 !== coverageSha256
      ? ["Assessment does not reference the current coverage."]
      : []),
    ...(assessment.input.coverageManifest.sha256 !== coverageManifestSha256
      ? ["Assessment does not reference the current coverage manifest."]
      : []),
    ...(assessment.input.evidenceMap.sha256 !== evidenceMapSha256
      ? ["Assessment does not reference the current Evidence Map."]
      : []),
    ...(assessment.input.evidenceMapManifest.sha256 !==
    evidenceMapManifestSha256
      ? ["Assessment does not reference the current Evidence Map manifest."]
      : []),
    ...(assessment.input.requirementModel.sha256 !==
    requirementInput.modelSha256
      ? ["Assessment does not reference the current Requirement Model."]
      : []),
    ...(assessment.input.requirementManifest.sha256 !==
    requirementInput.manifestSha256
      ? ["Assessment does not reference the current Requirement Model manifest."]
      : []),
    ...(assessmentSha256.length !== 64 || assessmentManifestSha256.length !== 64
      ? ["Assessment artifact hashes are invalid."]
      : []),
  ]);
}

function validateReferencedCandidateEvidence(
  map: JobEvidenceMap,
  sources: Source[],
  evidenceItems: EvidenceItem[],
  claims: Claim[],
): void {
  const sourceById = new Map(sources.map((entry) => [entry.id, entry]));
  const evidenceById = new Map(evidenceItems.map((entry) => [entry.id, entry]));
  const claimById = new Map(claims.map((entry) => [entry.id, entry]));
  for (const link of map.links) {
    const evidence = evidenceById.get(link.evidenceId);
    const claim = claimById.get(link.claimId);
    if (!evidence || !claim) {
      throw new Error(
        `Job Resume Content Planning found broken mapped evidence provenance: ${link.id}`,
      );
    }
    if (
      evidence.visibility !== "public" ||
      evidence.sensitivityFlags.length > 0 ||
      claim.approvalStatus !== "approved" ||
      claim.outputReadiness !== "resume_ready" ||
      !claim.publicSafe ||
      claim.needsConfirmation ||
      !claim.approvedWording ||
      !claim.supportingEvidenceIds.includes(evidence.id)
    ) {
      throw new Error(
        `Job Resume Content Planning rejects ineligible evidence or claim: ${link.id}`,
      );
    }
    if (
      hashText(stableJson(evidence)) !==
        link.evidenceProvenance.evidenceItemSha256 ||
      hashText(stableJson(claim)) !== link.evidenceProvenance.claimSha256
    ) {
      throw new Error(
        `Job Resume Content Planning found changed mapped evidence provenance: ${link.id}`,
      );
    }
    for (const sourceId of evidence.sourceIds) {
      const source = sourceById.get(sourceId);
      if (
        !source ||
        source.visibility !== "public" ||
        source.status !== "active" ||
        source.type === "job_description"
      ) {
        throw new Error(
          `Job Resume Content Planning rejects private, inactive, or target-source evidence: ${link.id}`,
        );
      }
    }
  }
}

function planInput(context: JobResumePlanningContext) {
  return {
    target: {
      path: `targets/jobs/${context.target.id}/target.json`,
      sha256: context.targetSha256,
    },
    jobDescription: {
      path: `targets/jobs/${context.target.id}/job-description.md`,
      sha256: context.sourceSha256,
    },
    requirementModelType: context.requirementInput.type,
    requirementModel: {
      path: context.requirementInput.modelPath,
      sha256: context.requirementInput.modelSha256,
      manifestPath: context.requirementInput.manifestPath,
      manifestSha256: context.requirementInput.manifestSha256,
    },
    evidenceMap: {
      path: context.evidenceMapPath,
      sha256: context.evidenceMapSha256,
      manifestPath: context.evidenceMapManifestPath,
      manifestSha256: context.evidenceMapManifestSha256,
    },
    coverage: {
      path: context.coveragePath,
      sha256: context.coverageSha256,
      manifestPath: context.coverageManifestPath,
      manifestSha256: context.coverageManifestSha256,
    },
    assessment: {
      path: context.assessmentPath,
      sha256: context.assessmentSha256,
      manifestPath: context.assessmentManifestPath,
      manifestSha256: context.assessmentManifestSha256,
    },
    sources: { path: "kb/sources.json", sha256: context.sourcesSha256 },
    evidenceItems: {
      path: "kb/evidence-items.json",
      sha256: context.evidenceItemsSha256,
    },
    claims: { path: "kb/claims.json", sha256: context.claimsSha256 },
    selectedEvidenceSetSha256: context.selectedEvidenceSetSha256,
    selectedClaimSetSha256: context.selectedClaimSetSha256,
    normalizedInputSha256: context.normalizedInputSha256,
  };
}

function createManifest(
  plan: JobResumeContentPlan,
  context: JobResumePlanningContext,
  planPath: string,
  planSha256: string,
  createdAt: string,
  updatedAt: string,
): JobResumeContentPlanManifest {
  return JobResumeContentPlanManifestSchema.parse({
    schemaVersion: 1,
    manifestId: deterministicManifestId(plan.id, planPath),
    planId: plan.id,
    targetId: plan.targetId,
    targetType: "job",
    mode: "job-specific-resume",
    planPath,
    planSha256,
    policyName: JOB_RESUME_PLANNING_POLICY_NAME,
    policyVersion: JOB_RESUME_PLANNING_POLICY_VERSION,
    targetSha256: context.targetSha256,
    sourceSha256: context.sourceSha256,
    requirementModelType: context.requirementInput.type,
    requirementModelSha256: context.requirementInput.modelSha256,
    requirementManifestSha256: context.requirementInput.manifestSha256,
    evidenceMapSha256: context.evidenceMapSha256,
    evidenceMapManifestSha256: context.evidenceMapManifestSha256,
    coverageSha256: context.coverageSha256,
    coverageManifestSha256: context.coverageManifestSha256,
    assessmentSha256: context.assessmentSha256,
    assessmentManifestSha256: context.assessmentManifestSha256,
    sourcesSha256: context.sourcesSha256,
    evidenceItemsSha256: context.evidenceItemsSha256,
    claimsSha256: context.claimsSha256,
    selectedEvidenceSetSha256: context.selectedEvidenceSetSha256,
    selectedClaimSetSha256: context.selectedClaimSetSha256,
    normalizedInputSha256: context.normalizedInputSha256,
    createdAt,
    updatedAt,
  });
}

function deterministicPlanId(context: JobResumePlanningContext): string {
  return `job-resume-content-plan_${hashText(
    [
      context.target.id,
      context.normalizedInputSha256,
      JOB_RESUME_PLANNING_POLICY_VERSION,
    ].join("\0"),
  ).slice(0, 16)}`;
}

function deterministicManifestId(planId: string, planPath: string): string {
  return `job-resume-content-plan-manifest_${hashText(
    [planId, planPath, JOB_RESUME_PLANNING_POLICY_VERSION].join("\0"),
  ).slice(0, 16)}`;
}

function normalizedPlanningInputHash(input: {
  targetId: string;
  targetSha256: string;
  sourceSha256: string;
  requirementModelType: JobRequirementInputType;
  requirementModelSha256: string;
  requirementManifestSha256: string;
  evidenceMapSha256: string;
  evidenceMapManifestSha256: string;
  coverageSha256: string;
  coverageManifestSha256: string;
  assessmentSha256: string;
  assessmentManifestSha256: string;
  sourcesSha256: string;
  evidenceItemsSha256: string;
  claimsSha256: string;
  selectedEvidenceSetSha256: string;
  selectedClaimSetSha256: string;
}): string {
  return hashText(stableJson({
    ...input,
    policyName: JOB_RESUME_PLANNING_POLICY_NAME,
    policyVersion: JOB_RESUME_PLANNING_POLICY_VERSION,
  }));
}

function elementProvenance(
  context: JobResumePlanningContext,
  requirementIds: string[],
  linkIds: string[],
) {
  const requirementSet = new Set(requirementIds);
  const linkSet = new Set(linkIds);
  const coverage = context.coverage.requirements.filter((entry) =>
    requirementSet.has(entry.requirementId),
  );
  const assessments = context.assessment.requirementAssessments.filter(
    (entry) => requirementSet.has(entry.requirementId),
  );
  const links = context.evidenceMap.links.filter((entry) =>
    linkSet.has(entry.id),
  );
  const requirementProvenance = new Map(
    coverage.map((entry) => [
      entry.requirementId,
      entry.requirementProvenance,
    ]),
  );
  return {
    targetId: context.target.id,
    requirementIds: uniqueSorted(requirementIds),
    coverageReferences: coverage
      .map((entry) => ({
        coverageEntryId: entry.id,
        coverageEntrySha256: hashText(stableJson(entry)),
      }))
      .sort((left, right) =>
        left.coverageEntryId.localeCompare(right.coverageEntryId),
      ),
    assessmentReferences: assessments
      .map((entry) => ({
        assessmentEntryId: entry.id,
        assessmentEntrySha256: hashText(stableJson(entry)),
      }))
      .sort((left, right) =>
        left.assessmentEntryId.localeCompare(right.assessmentEntryId),
      ),
    evidenceLinkReferences: links
      .map((link) => ({
        linkId: link.id,
        linkSha256: hashText(stableJson(link)),
        requirementId: link.requirementId,
        evidenceId: link.evidenceId,
        claimId: link.claimId,
        relationship: link.relationship,
        requirementProvenance:
          requirementProvenance.get(link.requirementId) ??
          link.requirementProvenance,
        evidenceProvenance: link.evidenceProvenance,
      }))
      .sort((left, right) => left.linkId.localeCompare(right.linkId)),
    evidenceIds: uniqueSorted(links.map((entry) => entry.evidenceId)),
    claimIds: uniqueSorted(links.map((entry) => entry.claimId)),
    planningPolicy: {
      name: JOB_RESUME_PLANNING_POLICY_NAME,
      version: JOB_RESUME_PLANNING_POLICY_VERSION,
    },
  };
}

function emphasisRationale(
  assessment: JobRequirementFitProofAssessment,
): JobRequirementEmphasis["rationaleCode"] {
  if (assessment.assessmentState === "contradiction") {
    return "contradicted-requirement";
  }
  if (assessment.assessmentState === "indeterminate") {
    return "indeterminate-requirement";
  }
  if (assessment.assessmentState === "gap") return "unsupported-requirement";
  if (assessment.assessmentState === "partial") {
    return assessment.necessity === "mandatory"
      ? "mandatory-partial-support"
      : "nonmandatory-partial-support";
  }
  if (assessment.necessity === "mandatory") {
    return assessment.assessmentState === "strength"
      ? "mandatory-strong-support"
      : "mandatory-defensible-support";
  }
  return assessment.necessity === "preferred"
    ? "preferred-defensible-support"
    : "contextual-defensible-support";
}

function emphasisCautions(
  assessment: JobRequirementFitProofAssessment,
): JobRequirementEmphasis["cautionCodes"] {
  if (assessment.assessmentState === "partial") {
    return [
      "do-not-overstate-partial-proof",
      "do-not-use-adjacent-proof-as-direct",
    ];
  }
  if (assessment.assessmentState === "gap") {
    return ["do-not-present-gap-as-strength"];
  }
  if (assessment.assessmentState === "contradiction") {
    return ["do-not-hide-contradiction"];
  }
  if (assessment.assessmentState === "indeterminate") {
    return ["preserve-ambiguity"];
  }
  return [];
}

function positioningRationale(
  overall: JobFitProofAssessment["overall"]["state"],
) {
  const values = {
    strong: "strong-reviewed-proof",
    credible: "credible-reviewed-proof",
    mixed: "mixed-reviewed-proof",
    limited: "limited-reviewed-proof",
    insufficient: "insufficient-reviewed-proof",
    indeterminate: "indeterminate-reviewed-proof",
  } as const;
  return values[overall];
}

function permittedTerminology(links: JobEvidenceLink[]): string[] {
  return uniqueSorted(
    links.flatMap((link) =>
      link.matchedSignals
        .filter((signal) => signal.type !== "exact-phrase")
        .map((signal) => signal.value),
    ),
  );
}

function allowedSectionsForRequirement(
  context: JobResumePlanningContext,
  assessment: JobRequirementFitProofAssessment,
  links: JobEvidenceLink[],
): JobResumeSectionType[] {
  const sections: JobResumeSectionType[] = [
    "professional-summary",
    "core-capabilities",
  ];
  if (
    assessment.assessmentState === "strength" &&
    assessment.necessity === "mandatory"
  ) sections.push("headline");
  if (assessment.category === "technical-expectation") {
    sections.push("technical-capabilities");
  }
  if (assessment.category === "leadership-expectation") {
    sections.push("leadership-capabilities");
  }
  for (const link of links) {
    const evidence = requiredEvidence(context, link.evidenceId);
    if (evidence.category === "role" || evidence.parentRoleId) {
      sections.push("professional-experience");
    }
    if (evidence.category === "project" || evidence.parentProjectId) {
      sections.push("selected-projects");
    }
    if (evidence.category === "achievement") sections.push("selected-impact");
    if (evidence.category === "education") sections.push("education");
    if (evidence.category === "certification") sections.push("certifications");
  }
  return uniqueSorted(sections) as JobResumeSectionType[];
}

function contentTypesForRequirement(
  emphasis: JobRequirementEmphasis,
): JobResumeContentType[] {
  const byCategory: Partial<
    Record<JobRequirementEmphasis["category"], JobResumeContentType[]>
  > = {
    responsibility: ["responsibility"],
    "required-capability": ["capability-theme"],
    "preferred-capability": ["capability-theme"],
    "technical-expectation": ["technology", "capability-theme"],
    "domain-expectation": ["domain", "capability-theme"],
    "leadership-expectation": ["leadership-behavior", "scope"],
    "operating-context": ["scope", "domain"],
    "experience-seniority": ["scope"],
    "education-certification": ["education", "certification"],
    language: ["capability-theme"],
    "location-travel-visa-work-mode": ["scope"],
    screening: ["capability-theme"],
    "metric-scale": ["scope"],
  };
  return byCategory[emphasis.category] ?? ["capability-theme"];
}

function baseProhibitedInferences():
  JobResumeClaimBoundary["prohibitedInferenceCodes"] {
  return [
    "target-title-as-employment",
    "project-as-employment",
    "responsibility-as-achievement",
    "contribution-as-ownership",
    "collaboration-as-management",
    "technical-exposure-as-expertise",
    "adjacent-technology-as-exact-experience",
    "domain-adjacency-as-direct-experience",
    "unsupported-seniority",
    "unsupported-authority",
    "unsupported-team-size",
    "unsupported-geography",
    "unsupported-scale",
    "unsupported-adoption",
    "unsupported-dates",
    "unsupported-outcomes",
    "unverified-metric",
  ];
}

function allContentTypes(): JobResumeContentType[] {
  return [
    "target-title",
    "role-title",
    "capability-theme",
    "scope",
    "responsibility",
    "achievement",
    "quantified-outcome",
    "technology",
    "domain",
    "leadership-behavior",
    "delivery-outcome",
    "product-outcome",
    "business-outcome",
    "education",
    "certification",
    "project",
  ];
}

function evidenceUseDecision(
  requirementDecision: JobRequirementEmphasisDecision,
  link: JobEvidenceLink,
): JobRequirementEmphasisDecision {
  if (requirementDecision === "defer" || requirementDecision === "exclude") {
    return requirementDecision;
  }
  if (
    requirementDecision === "primary" &&
    link.relationship === "direct" &&
    link.evidenceStrength === "strong" &&
    link.linkConfidence === "high"
  ) return "primary";
  if (
    requirementDecision === "primary" ||
    requirementDecision === "secondary"
  ) {
    return link.relationship === "partial" ? "supporting" : "secondary";
  }
  return "supporting";
}

function evidencePurpose(
  decision: JobRequirementEmphasisDecision,
) {
  const values = {
    primary: "primary-requirement-proof",
    secondary: "secondary-requirement-proof",
    supporting: "supporting-context",
    defer: "deferred-proof",
    exclude: "excluded-proof",
  } as const;
  return values[decision];
}

function requirementUseRank(
  decision: JobRequirementEmphasisDecision,
): number {
  return {
    primary: 0,
    secondary: 1,
    supporting: 2,
    defer: 3,
    exclude: 4,
  }[decision];
}

function metricSections(evidence: EvidenceItem): JobResumeSectionType[] {
  if (evidence.category === "project" || evidence.parentProjectId) {
    return ["selected-impact", "selected-projects"];
  }
  if (evidence.category === "role" || evidence.parentRoleId) {
    return ["selected-impact", "professional-experience"];
  }
  return ["selected-impact"];
}

function evidenceAllowedInSection(
  context: JobResumePlanningContext,
  evidenceId: string,
  section: JobResumeSectionType,
  metrics: JobMetricPermission[],
): boolean {
  const evidence = requiredEvidence(context, evidenceId);
  if (section === "professional-experience") {
    return evidence.category === "role" || Boolean(evidence.parentRoleId);
  }
  if (section === "selected-projects") {
    return evidence.category === "project" || Boolean(evidence.parentProjectId);
  }
  if (section === "education") return evidence.category === "education";
  if (section === "certifications") return evidence.category === "certification";
  if (section === "selected-impact") {
    return (
      evidence.category === "achievement" ||
      metrics.some(
        (entry) => entry.state === "allowed" && entry.evidenceId === evidenceId,
      )
    );
  }
  return true;
}

function hasVerifiedMetric(
  context: JobResumePlanningContext,
  evidenceId: string,
): boolean {
  return context.evidenceMap.links
    .filter((link) => link.evidenceId === evidenceId)
    .some((link) => {
      const claim = requiredClaim(context, link.claimId);
      return (
        claim.metricStatus === "verified_metric" &&
        claim.approvalStatus === "approved" &&
        claim.outputReadiness === "resume_ready" &&
        claim.publicSafe &&
        !claim.needsConfirmation &&
        Boolean(claim.approvedWording)
      );
    });
}

function selectedEvidence(
  context: JobResumePlanningContext,
  emphasis: JobRequirementEmphasis[],
): EvidenceItem[] {
  const ids = uniqueSorted(
    emphasis
      .filter((entry) =>
        ["primary", "secondary", "supporting"].includes(entry.decision),
      )
      .flatMap((entry) => entry.selectedEvidenceIds),
  );
  return ids.map((id) => requiredEvidence(context, id));
}

function exclusion(
  context: JobResumePlanningContext,
  planId: string,
  type: JobResumeContentExclusion["type"],
  sourceType: JobResumeContentExclusion["sourceType"],
  sourceIds: string[],
  reasonCode: JobResumeContentExclusion["reasonCode"],
  severity: JobResumeContentExclusion["severity"],
  requirementIds: string[],
  linkIds: string[],
): JobResumeContentExclusion {
  return {
    id: `job-plan-exclusion_${hashText(
      [planId, type, sourceType, ...[...sourceIds].sort()].join("\0"),
    ).slice(0, 16)}`,
    type,
    sourceType,
    sourceIds: uniqueSorted(sourceIds),
    reasonCode,
    severity,
    provenance: elementProvenance(context, requirementIds, linkIds),
  };
}

function findingId(
  planId: string,
  kind: string,
  code: string,
  references: string[],
): string {
  return `job-plan-${kind}_${hashText(
    [planId, code, ...uniqueSorted(references)].join("\0"),
  ).slice(0, 16)}`;
}

function requiredEvidence(
  context: JobResumePlanningContext,
  evidenceId: string,
): EvidenceItem {
  const evidence = context.evidenceItems.find((entry) => entry.id === evidenceId);
  if (!evidence) throw new Error(`Mapped evidence is missing: ${evidenceId}`);
  return evidence;
}

function requiredClaim(
  context: JobResumePlanningContext,
  claimId: string,
): Claim {
  const claim = context.claims.find((entry) => entry.id === claimId);
  if (!claim) throw new Error(`Mapped claim is missing: ${claimId}`);
  return claim;
}

function groupBy<T>(
  entries: T[],
  key: (entry: T) => string,
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const entry of entries) {
    const value = key(entry);
    grouped.set(value, [...(grouped.get(value) ?? []), entry]);
  }
  return grouped;
}

function dependencyMatches(
  manifest: JobResumeContentPlanManifest,
  context: JobResumePlanningContext,
): Record<string, boolean> {
  return {
    targetHashMatches: manifest.targetSha256 === context.targetSha256,
    sourceHashMatches: manifest.sourceSha256 === context.sourceSha256,
    requirementModelHashMatches:
      manifest.requirementModelType === context.requirementInput.type &&
      manifest.requirementModelSha256 === context.requirementInput.modelSha256,
    requirementManifestHashMatches:
      manifest.requirementManifestSha256 ===
      context.requirementInput.manifestSha256,
    evidenceMapHashMatches:
      manifest.evidenceMapSha256 === context.evidenceMapSha256,
    evidenceMapManifestHashMatches:
      manifest.evidenceMapManifestSha256 ===
      context.evidenceMapManifestSha256,
    coverageHashMatches: manifest.coverageSha256 === context.coverageSha256,
    coverageManifestHashMatches:
      manifest.coverageManifestSha256 === context.coverageManifestSha256,
    assessmentHashMatches:
      manifest.assessmentSha256 === context.assessmentSha256,
    assessmentManifestHashMatches:
      manifest.assessmentManifestSha256 === context.assessmentManifestSha256,
    sourcesHashMatches: manifest.sourcesSha256 === context.sourcesSha256,
    evidenceItemsHashMatches:
      manifest.evidenceItemsSha256 === context.evidenceItemsSha256,
    claimsHashMatches: manifest.claimsSha256 === context.claimsSha256,
    selectedEvidenceSetHashMatches:
      manifest.selectedEvidenceSetSha256 ===
      context.selectedEvidenceSetSha256,
    selectedClaimSetHashMatches:
      manifest.selectedClaimSetSha256 === context.selectedClaimSetSha256,
    policyMatches:
      manifest.policyName === JOB_RESUME_PLANNING_POLICY_NAME &&
      manifest.policyVersion === JOB_RESUME_PLANNING_POLICY_VERSION,
    normalizedInputHashMatches:
      manifest.normalizedInputSha256 === context.normalizedInputSha256,
  };
}

function dependencyReason(name: string): string {
  const values: Record<string, string> = {
    targetHashMatches: "Job Target changed.",
    sourceHashMatches: "Job Description changed.",
    requirementModelHashMatches: "Job Requirement Model changed.",
    requirementManifestHashMatches: "Job Requirement Model manifest changed.",
    evidenceMapHashMatches: "Job Evidence Map changed.",
    evidenceMapManifestHashMatches: "Job Evidence Map manifest changed.",
    coverageHashMatches: "Job Requirement Coverage changed.",
    coverageManifestHashMatches: "Job Requirement Coverage manifest changed.",
    assessmentHashMatches: "Job Fit and Proof Assessment changed.",
    assessmentManifestHashMatches:
      "Job Fit and Proof Assessment manifest changed.",
    sourcesHashMatches: "Source registry changed.",
    evidenceItemsHashMatches: "Reviewed evidence items changed.",
    claimsHashMatches: "Reviewed claims changed.",
    selectedEvidenceSetHashMatches: "Selected reviewed evidence set changed.",
    selectedClaimSetHashMatches: "Selected reviewed claim set changed.",
    policyMatches: "Job resume planning policy changed.",
    normalizedInputHashMatches: "Normalized planning input changed.",
  };
  return values[name] ?? `Planning dependency changed: ${name}.`;
}

function validateStoredIdentity(
  plan: JobResumeContentPlan,
  manifest: JobResumeContentPlanManifest,
  paths: JobResumePlanPaths,
): string[] {
  const reasons: string[] = [];
  if (
    manifest.manifestId !==
      deterministicManifestId(plan.id, paths.planRelativePath) ||
    plan.id !== manifest.planId ||
    plan.targetId !== manifest.targetId ||
    plan.targetType !== "job" ||
    manifest.targetType !== "job" ||
    plan.mode !== "job-specific-resume" ||
    manifest.mode !== "job-specific-resume" ||
    manifest.planPath !== paths.planRelativePath
  ) reasons.push("Job Resume Content Plan identity or persistence path is invalid.");
  if (
    plan.input.target.sha256 !== manifest.targetSha256 ||
    plan.input.jobDescription.sha256 !== manifest.sourceSha256 ||
    plan.input.requirementModelType !== manifest.requirementModelType ||
    plan.input.requirementModel.sha256 !== manifest.requirementModelSha256 ||
    plan.input.requirementModel.manifestSha256 !==
      manifest.requirementManifestSha256 ||
    plan.input.evidenceMap.sha256 !== manifest.evidenceMapSha256 ||
    plan.input.evidenceMap.manifestSha256 !==
      manifest.evidenceMapManifestSha256 ||
    plan.input.coverage.sha256 !== manifest.coverageSha256 ||
    plan.input.coverage.manifestSha256 !==
      manifest.coverageManifestSha256 ||
    plan.input.assessment.sha256 !== manifest.assessmentSha256 ||
    plan.input.assessment.manifestSha256 !==
      manifest.assessmentManifestSha256 ||
    plan.input.sources.sha256 !== manifest.sourcesSha256 ||
    plan.input.evidenceItems.sha256 !== manifest.evidenceItemsSha256 ||
    plan.input.claims.sha256 !== manifest.claimsSha256 ||
    plan.input.selectedEvidenceSetSha256 !==
      manifest.selectedEvidenceSetSha256 ||
    plan.input.selectedClaimSetSha256 !== manifest.selectedClaimSetSha256 ||
    plan.input.normalizedInputSha256 !== manifest.normalizedInputSha256
  ) reasons.push("Job Resume Content Plan and manifest disagree on dependencies.");
  return reasons;
}

function planSemantics(plan: JobResumeContentPlan) {
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...semantic } = plan;
  return semantic;
}

function resultFromPlan(
  plan: JobResumeContentPlan,
  paths: JobResumePlanPaths,
  result: BuildJobResumePlanResult["result"],
): BuildJobResumePlanResult {
  return {
    targetId: plan.targetId,
    result,
    planId: plan.id,
    planPath: paths.planRelativePath,
    manifestPath: paths.manifestRelativePath,
    positioningState: plan.positioning.state,
    selectedRequirementCount:
      plan.completeness.selectedRequirementIds.length,
    includedSectionCount: plan.completeness.includedSectionTypes.length,
    completeness: plan.completeness.status,
    usableForDrafting: plan.completeness.usableForDrafting,
  };
}

type StatusBase = Pick<
  JobResumePlanStatus,
  | "targetId"
  | "planExists"
  | "manifestExists"
  | "assessmentStatus"
  | "planPath"
  | "manifestPath"
>;

function emptyStatus(
  base: StatusBase,
  status: "missing" | "stale" | "invalid",
  reasons: string[],
): JobResumePlanStatus {
  return {
    ...base,
    planHashMatches: null,
    targetHashMatches: null,
    sourceHashMatches: null,
    requirementModelHashMatches: null,
    requirementManifestHashMatches: null,
    evidenceMapHashMatches: null,
    evidenceMapManifestHashMatches: null,
    coverageHashMatches: null,
    coverageManifestHashMatches: null,
    assessmentHashMatches: null,
    assessmentManifestHashMatches: null,
    sourcesHashMatches: null,
    evidenceItemsHashMatches: null,
    claimsHashMatches: null,
    selectedEvidenceSetHashMatches: null,
    selectedClaimSetHashMatches: null,
    policyMatches: null,
    normalizedInputHashMatches: null,
    status,
    reasons: uniqueSorted(reasons),
  };
}

function statusWithChecks(
  base: StatusBase,
  planHashMatches: boolean,
  checks: Record<string, boolean>,
  status: JobResumePlanStatus["status"],
  reasons: string[],
): JobResumePlanStatus {
  return {
    ...base,
    planHashMatches,
    targetHashMatches: checks.targetHashMatches,
    sourceHashMatches: checks.sourceHashMatches,
    requirementModelHashMatches: checks.requirementModelHashMatches,
    requirementManifestHashMatches: checks.requirementManifestHashMatches,
    evidenceMapHashMatches: checks.evidenceMapHashMatches,
    evidenceMapManifestHashMatches: checks.evidenceMapManifestHashMatches,
    coverageHashMatches: checks.coverageHashMatches,
    coverageManifestHashMatches: checks.coverageManifestHashMatches,
    assessmentHashMatches: checks.assessmentHashMatches,
    assessmentManifestHashMatches: checks.assessmentManifestHashMatches,
    sourcesHashMatches: checks.sourcesHashMatches,
    evidenceItemsHashMatches: checks.evidenceItemsHashMatches,
    claimsHashMatches: checks.claimsHashMatches,
    selectedEvidenceSetHashMatches: checks.selectedEvidenceSetHashMatches,
    selectedClaimSetHashMatches: checks.selectedClaimSetHashMatches,
    policyMatches: checks.policyMatches,
    normalizedInputHashMatches: checks.normalizedInputHashMatches,
    status,
    reasons: uniqueSorted(reasons),
  };
}

async function requireJobTarget(
  workspace: string,
  targetId: string,
): Promise<JobTarget> {
  const target = await showTarget(workspace, targetId);
  if (target.type !== "job") {
    throw new Error(`Job Resume Content Planning rejects Role Target: ${targetId}`);
  }
  return target;
}

function resolveWithin(workspace: string, relativePath: string): string {
  const root = path.resolve(workspace);
  const resolved = path.resolve(root, relativePath);
  const relation = path.relative(root, resolved);
  if (
    relation === ".." ||
    relation.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relation)
  ) {
    throw new Error(
      `Job Resume Content Planning path escapes the workspace: ${relativePath}`,
    );
  }
  return resolved;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
