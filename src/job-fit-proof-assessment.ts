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
  JobFitProofAssessmentManifestSchema,
  JobFitProofAssessmentSchema,
  JobRequirementFitProofAssessmentSchema,
  type JobAssessmentAmbiguity,
  type JobAssessmentGapType,
  type JobAssessmentMateriality,
  type JobAssessmentProofStrength,
  type JobAssessmentRisk,
  type JobAssessmentWarning,
  type JobFitProofAssessment,
  type JobFitProofAssessmentManifest,
  type JobOverallAssessmentState,
  type JobRequirementAssessmentState,
  type JobRequirementFitProofAssessment,
} from "./job-fit-proof-assessment-schemas.js";
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
  jobEvidenceMapPaths,
  showJobEvidenceMap,
} from "./job-evidence-mapping.js";
import {
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
import { type JobTarget } from "./schemas.js";
import { showTarget } from "./targets.js";
import { stableJson } from "./target-proposal.js";

export const JOB_FIT_PROOF_ASSESSMENT_ANALYZER_NAME =
  "job-fit-proof-assessment";
export const JOB_FIT_PROOF_ASSESSMENT_ANALYZER_VERSION = "1";
export const JOB_FIT_PROOF_ASSESSMENT_POLICY_NAME =
  "job-fit-proof-assessment-policy";
export const JOB_FIT_PROOF_ASSESSMENT_POLICY_VERSION = "1";

const ASSESSMENT_FILE = "job-fit-proof-assessment.json";
const MANIFEST_FILE = "job-fit-proof-assessment-manifest.json";

type RequirementModel = JobRequirementModel | ApprovedJobRequirementModel;

interface JobAssessmentPaths {
  rootRelativePath: string;
  rootPath: string;
  assessmentRelativePath: string;
  assessmentPath: string;
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

interface AssessmentDependencies {
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
  normalizedInputSha256: string;
}

interface BuildOptions {
  rebuild?: boolean;
  now?: () => Date;
}

export interface BuildJobFitProofAssessmentResult {
  targetId: string;
  result: "created" | "rebuilt" | "already-current";
  assessmentPath: string;
  manifestPath: string;
  requirementCount: number;
  overallState: JobOverallAssessmentState;
  readyForDownstreamPlanning: boolean;
}

export interface JobFitProofAssessmentStatus {
  targetId: string;
  assessmentExists: boolean;
  manifestExists: boolean;
  coverageStatus: "missing" | "current" | "stale" | "invalid";
  assessmentHashMatches: boolean | null;
  targetHashMatches: boolean | null;
  sourceHashMatches: boolean | null;
  requirementModelHashMatches: boolean | null;
  requirementManifestHashMatches: boolean | null;
  evidenceMapHashMatches: boolean | null;
  evidenceMapManifestHashMatches: boolean | null;
  coverageHashMatches: boolean | null;
  coverageManifestHashMatches: boolean | null;
  analyzerMatches: boolean | null;
  policyMatches: boolean | null;
  normalizedInputHashMatches: boolean | null;
  status: "missing" | "current" | "stale" | "invalid";
  reasons: string[];
  assessmentPath: string;
  manifestPath: string;
}

export interface RequirementAssessmentDecision {
  assessmentState: JobRequirementAssessmentState;
  proofStrength: JobAssessmentProofStrength;
  materiality: JobAssessmentMateriality;
  gapType?: JobAssessmentGapType;
  statement: string;
}

export function jobFitProofAssessmentPaths(
  workspace: string,
  targetId: string,
): JobAssessmentPaths {
  const rootRelativePath = `targets/jobs/${targetId}/assessment/deterministic`;
  const assessmentRelativePath = `${rootRelativePath}/${ASSESSMENT_FILE}`;
  const manifestRelativePath = `${rootRelativePath}/${MANIFEST_FILE}`;
  return {
    rootRelativePath,
    rootPath: resolveWithin(workspace, rootRelativePath),
    assessmentRelativePath,
    assessmentPath: resolveWithin(workspace, assessmentRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}

export async function buildJobFitProofAssessment(
  workspace: string,
  targetId: string,
  options: BuildOptions = {},
): Promise<BuildJobFitProofAssessmentResult> {
  const dependencies = await loadCurrentDependencies(workspace, targetId);
  const status = await getJobFitProofAssessmentStatus(workspace, targetId);
  const paths = jobFitProofAssessmentPaths(workspace, targetId);

  if (status.status === "current") {
    return resultFromAssessment(
      await showJobFitProofAssessment(workspace, targetId),
      paths,
      "already-current",
    );
  }
  if (
    (status.status === "stale" || status.status === "invalid") &&
    !options.rebuild
  ) {
    throw new Error(
      `Stored Job Fit and Proof Assessment is ${status.status} and was not overwritten. Review dependencies, then use --rebuild. ${status.reasons.join(" ")}`,
    );
  }

  const now = (options.now ?? (() => new Date()))().toISOString();
  let createdAt = now;
  if (status.assessmentExists) {
    try {
      const previous = await showJobFitProofAssessment(workspace, targetId);
      if (previous.targetId === targetId) createdAt = previous.createdAt;
    } catch {
      // Explicit rebuild may replace an invalid artifact without trusting it.
    }
  }

  const analyzed = analyzeAssessment(dependencies);
  const assessment = JobFitProofAssessmentSchema.parse({
    schemaVersion: 1,
    id: `job-fit-proof-assessment_${hashText(
      `${targetId}\u0000${dependencies.normalizedInputSha256}\u0000${JOB_FIT_PROOF_ASSESSMENT_POLICY_VERSION}`,
    ).slice(0, 14)}`,
    targetId,
    targetType: "job",
    analyzer: {
      name: JOB_FIT_PROOF_ASSESSMENT_ANALYZER_NAME,
      version: JOB_FIT_PROOF_ASSESSMENT_ANALYZER_VERSION,
      mode: "deterministic",
    },
    policy: {
      name: JOB_FIT_PROOF_ASSESSMENT_POLICY_NAME,
      version: JOB_FIT_PROOF_ASSESSMENT_POLICY_VERSION,
    },
    input: dependencyInput(dependencies),
    ...analyzed,
    createdAt,
    updatedAt: now,
  });
  await writeJsonAtomic(paths.assessmentPath, assessment);
  const manifest = JobFitProofAssessmentManifestSchema.parse({
    schemaVersion: 1,
    assessmentId: assessment.id,
    targetId,
    targetType: "job",
    assessmentPath: paths.assessmentRelativePath,
    assessmentSha256: await hashFile(paths.assessmentPath),
    analyzerName: JOB_FIT_PROOF_ASSESSMENT_ANALYZER_NAME,
    analyzerVersion: JOB_FIT_PROOF_ASSESSMENT_ANALYZER_VERSION,
    policyName: JOB_FIT_PROOF_ASSESSMENT_POLICY_NAME,
    policyVersion: JOB_FIT_PROOF_ASSESSMENT_POLICY_VERSION,
    targetSha256: dependencies.targetSha256,
    sourceSha256: dependencies.sourceSha256,
    requirementModelType: dependencies.requirementInput.type,
    requirementModelSha256: dependencies.requirementInput.modelSha256,
    requirementManifestSha256: dependencies.requirementInput.manifestSha256,
    evidenceMapSha256: dependencies.evidenceMapSha256,
    evidenceMapManifestSha256: dependencies.evidenceMapManifestSha256,
    coverageSha256: dependencies.coverageSha256,
    coverageManifestSha256: dependencies.coverageManifestSha256,
    normalizedInputSha256: dependencies.normalizedInputSha256,
    createdAt,
    updatedAt: now,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
  return resultFromAssessment(
    assessment,
    paths,
    status.status === "missing" ? "created" : "rebuilt",
  );
}

export async function showJobFitProofAssessment(
  workspace: string,
  targetId: string,
): Promise<JobFitProofAssessment> {
  await requireJobTarget(workspace, targetId);
  const paths = jobFitProofAssessmentPaths(workspace, targetId);
  if (!(await pathExists(paths.assessmentPath))) {
    throw new Error(`Job Fit and Proof Assessment not found for target: ${targetId}`);
  }
  return JobFitProofAssessmentSchema.parse(
    await readJson<unknown>(paths.assessmentPath, null),
  );
}

export async function getJobFitProofAssessmentStatus(
  workspace: string,
  targetId: string,
): Promise<JobFitProofAssessmentStatus> {
  await requireJobTarget(workspace, targetId);
  const paths = jobFitProofAssessmentPaths(workspace, targetId);
  const assessmentExists = await pathExists(paths.assessmentPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const coverageStatus = await getJobCoverageStatus(workspace, targetId);
  const base = {
    targetId,
    assessmentExists,
    manifestExists,
    coverageStatus: coverageStatus.status,
    assessmentPath: paths.assessmentRelativePath,
    manifestPath: paths.manifestRelativePath,
  };

  if (!assessmentExists && !manifestExists) {
    return emptyStatus(base, "missing", [
      "No deterministic Job Fit and Proof Assessment exists.",
    ]);
  }
  if (!assessmentExists || !manifestExists) {
    return emptyStatus(base, "invalid", [
      "Job Fit and Proof Assessment artifact set is incomplete.",
    ]);
  }

  let assessment: JobFitProofAssessment;
  let manifest: JobFitProofAssessmentManifest;
  try {
    assessment = JobFitProofAssessmentSchema.parse(
      await readJson<unknown>(paths.assessmentPath, null),
    );
    manifest = JobFitProofAssessmentManifestSchema.parse(
      await readJson<unknown>(paths.manifestPath, null),
    );
  } catch (error) {
    return emptyStatus(base, "invalid", [
      `Stored Job Fit and Proof Assessment is invalid: ${errorMessage(error)}`,
    ]);
  }

  const assessmentHashMatches =
    (await hashFile(paths.assessmentPath)) === manifest.assessmentSha256;
  const identityReasons = validateStoredIdentity(assessment, manifest, paths);
  if (!assessmentHashMatches) {
    identityReasons.push(
      "Job Fit and Proof Assessment SHA-256 does not match its manifest.",
    );
  }
  if (identityReasons.length > 0) {
    return {
      ...emptyStatus(base, "invalid", uniqueSorted(identityReasons)),
      assessmentHashMatches,
    };
  }
  if (coverageStatus.status !== "current") {
    return {
      ...emptyStatus(base, "stale", [
        `Job Requirement Coverage status is ${coverageStatus.status}.`,
        ...coverageStatus.reasons,
      ]),
      assessmentHashMatches,
    };
  }

  let dependencies: AssessmentDependencies;
  try {
    dependencies = await loadCurrentDependencies(workspace, targetId);
  } catch (error) {
    return {
      ...emptyStatus(base, "stale", [errorMessage(error)]),
      assessmentHashMatches,
    };
  }
  const checks = dependencyMatches(manifest, dependencies);
  const staleReasons = Object.entries(checks)
    .filter(([, matches]) => !matches)
    .map(([name]) => dependencyReason(name));
  if (staleReasons.length > 0) {
    return statusWithChecks(
      base,
      assessmentHashMatches,
      checks,
      "stale",
      staleReasons,
    );
  }
  const expected = analyzeAssessment(dependencies);
  if (stableJson(assessmentSemantics(assessment)) !== stableJson(expected)) {
    return statusWithChecks(
      base,
      assessmentHashMatches,
      checks,
      "invalid",
      [
        "Stored assessment content does not match deterministic analysis of the current Job Requirement Coverage.",
      ],
    );
  }
  return statusWithChecks(
    base,
    assessmentHashMatches,
    checks,
    "current",
    [],
  );
}

export function classifyJobRequirementAssessment(
  coverage: Pick<
    JobRequirementCoverage,
    "state" | "evidenceQuality" | "necessity" | "category" | "warnings"
  >,
): RequirementAssessmentDecision {
  const assessmentState: JobRequirementAssessmentState =
    coverage.state === "supported"
      ? coverage.evidenceQuality === "strong"
        ? "strength"
        : "supported"
      : coverage.state === "partially-supported"
        ? "partial"
        : coverage.state === "unsupported"
          ? "gap"
          : coverage.state === "contradicted"
            ? "contradiction"
            : "indeterminate";
  const proofStrength: JobAssessmentProofStrength =
    assessmentState === "contradiction"
      ? "conflicting"
      : coverage.evidenceQuality === "strong"
        ? "strong"
        : coverage.evidenceQuality === "adequate"
          ? "adequate"
          : coverage.evidenceQuality === "unavailable"
            ? "unavailable"
            : "limited";
  const materiality: JobAssessmentMateriality =
    coverage.necessity === "ambiguous"
      ? "unknown"
      : coverage.necessity === "preferred"
        ? "secondary"
        : coverage.necessity === "contextual"
          ? "contextual"
          : assessmentState === "gap" || assessmentState === "contradiction"
            ? "critical"
            : "material";
  const gapType = gapTypeFor(coverage, assessmentState);
  return {
    assessmentState,
    proofStrength,
    materiality,
    ...(gapType ? { gapType } : {}),
    statement: assessmentStatement(assessmentState),
  };
}

export function classifyOverallJobAssessment(
  assessments: Array<
    Pick<
      JobRequirementFitProofAssessment,
      "requirementId" | "necessity" | "assessmentState" | "proofStrength"
    >
  >,
): JobOverallAssessmentState {
  const mandatory = assessments.filter(
    (entry) => entry.necessity === "mandatory",
  );
  if (assessments.length === 0 || mandatory.length === 0) {
    return "indeterminate";
  }
  if (mandatory.some((entry) => entry.assessmentState === "indeterminate")) {
    return "indeterminate";
  }
  if (mandatory.some((entry) => entry.assessmentState === "contradiction")) {
    return "insufficient";
  }
  const supported = mandatory.filter(
    (entry) =>
      entry.assessmentState === "strength" ||
      entry.assessmentState === "supported",
  );
  const gaps = mandatory.filter((entry) => entry.assessmentState === "gap");
  const partial = mandatory.filter(
    (entry) => entry.assessmentState === "partial",
  );
  if (gaps.length === mandatory.length || gaps.length >= 2) {
    return "insufficient";
  }
  if (supported.length === 0 && partial.length > 0) return "limited";
  if (gaps.length === 1 || partial.length >= 2) return "mixed";
  if (assessments.some((entry) => entry.assessmentState === "contradiction")) {
    return "mixed";
  }
  const allMandatorySupported = mandatory.every(
    (entry) =>
      entry.assessmentState === "strength" ||
      entry.assessmentState === "supported",
  );
  const strongProof = mandatory.every(
    (entry) =>
      entry.proofStrength === "strong" ||
      entry.proofStrength === "adequate",
  );
  if (
    allMandatorySupported &&
    strongProof &&
    mandatory.some((entry) => entry.assessmentState === "strength")
  ) {
    return "strong";
  }
  return "credible";
}

export function formatBuildJobFitProofAssessmentResult(
  result: BuildJobFitProofAssessmentResult,
): string {
  return [
    `Target ID: ${result.targetId}`,
    `Build result: ${result.result}`,
    `Assessment: ${result.assessmentPath}`,
    `Manifest: ${result.manifestPath}`,
    `Requirements assessed: ${result.requirementCount}`,
    `Overall assessment: ${result.overallState}`,
    `Ready for downstream planning: ${result.readyForDownstreamPlanning ? "yes" : "no"}`,
  ].join("\n");
}

export function formatJobFitProofAssessmentStatus(
  status: JobFitProofAssessmentStatus,
): string {
  const check = (value: boolean | null): string =>
    value === null ? "not applicable" : value ? "yes" : "no";
  return [
    `Target ID: ${status.targetId}`,
    `Overall status: ${status.status}`,
    `Job Requirement Coverage status: ${status.coverageStatus}`,
    `Assessment hash matches: ${check(status.assessmentHashMatches)}`,
    `Target hash matches: ${check(status.targetHashMatches)}`,
    `Job Description hash matches: ${check(status.sourceHashMatches)}`,
    `Requirement model hash matches: ${check(status.requirementModelHashMatches)}`,
    `Requirement manifest hash matches: ${check(status.requirementManifestHashMatches)}`,
    `Evidence map hash matches: ${check(status.evidenceMapHashMatches)}`,
    `Evidence map manifest hash matches: ${check(status.evidenceMapManifestHashMatches)}`,
    `Coverage hash matches: ${check(status.coverageHashMatches)}`,
    `Coverage manifest hash matches: ${check(status.coverageManifestHashMatches)}`,
    `Analyzer matches: ${check(status.analyzerMatches)}`,
    `Policy matches: ${check(status.policyMatches)}`,
    `Normalized input matches: ${check(status.normalizedInputHashMatches)}`,
    `Assessment: ${status.assessmentPath}`,
    `Manifest: ${status.manifestPath}`,
    ...(status.reasons.length
      ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)]
      : []),
  ].join("\n");
}

function analyzeAssessment(
  dependencies: AssessmentDependencies,
): Pick<
  JobFitProofAssessment,
  | "requirementAssessments"
  | "overall"
  | "risks"
  | "warnings"
  | "ambiguities"
  | "completeness"
> {
  const requirements = new Map(
    dependencies.requirementInput.model.requirements.map((entry) => [
      entry.id,
      entry,
    ]),
  );
  const risks: JobAssessmentRisk[] = [];
  const warnings: JobAssessmentWarning[] = globalWarnings();
  const ambiguities: JobAssessmentAmbiguity[] = [];
  const requirementAssessments = dependencies.coverage.requirements
    .map((coverage) => {
      const requirement = requirements.get(coverage.requirementId);
      if (!requirement) {
        throw new Error(
          `Coverage references unknown requirement: ${coverage.requirementId}`,
        );
      }
      const decision = classifyJobRequirementAssessment(coverage);
      const riskIds = addRequirementRisks(risks, coverage, decision);
      const warningIds = addRequirementWarnings(warnings, coverage, decision);
      const ambiguityIds = addRequirementAmbiguities(
        ambiguities,
        coverage,
        decision,
      );
      return JobRequirementFitProofAssessmentSchema.parse(
        {
          id: `job-requirement-assessment_${hashText(
            `${dependencies.target.id}\u0000${requirement.id}\u0000${JOB_FIT_PROOF_ASSESSMENT_POLICY_VERSION}`,
          ).slice(0, 14)}`,
          requirementId: requirement.id,
          category: requirement.category,
          necessity: requirement.necessity,
          coverageState: coverage.state,
          assessmentState: decision.assessmentState,
          mappedEvidenceLinkIds: coverage.mappedLinkIds,
          evidenceQuality: coverage.evidenceQuality,
          proofStrength: decision.proofStrength,
          materiality: decision.materiality,
          ...(decision.gapType ? { gapType: decision.gapType } : {}),
          assessmentStatement: decision.statement,
          riskIds,
          warningIds,
          ambiguityIds,
          provenance: {
            requirement: coverage.requirementProvenance,
            coverage: {
              coveragePath: dependencies.coveragePath,
              coverageSha256: dependencies.coverageSha256,
              coverageEntryId: coverage.id,
              coverageEntrySha256: hashText(stableJson(coverage)),
            },
            evidenceMap: coverage.evidenceMapProvenance,
          },
        },
      );
    })
    .sort((left, right) =>
      left.requirementId.localeCompare(right.requirementId),
    );
  const overallState = classifyOverallJobAssessment(requirementAssessments);
  const idsFor = (state: JobRequirementAssessmentState): string[] =>
    requirementAssessments
      .filter((entry) => entry.assessmentState === state)
      .map((entry) => entry.requirementId)
      .sort((left, right) => left.localeCompare(right));
  const requirementIds = requirementAssessments
    .map((entry) => entry.requirementId)
    .sort((left, right) => left.localeCompare(right));
  const blockingReasons = uniqueSorted([
    ...(requirementIds.length === 0
      ? [
          "The current Job Requirement Coverage contains no requirements to assess.",
        ]
      : []),
    ...(overallState === "indeterminate"
      ? ["Mandatory requirement materiality or proof remains indeterminate."]
      : []),
  ]);
  return {
    requirementAssessments,
    overall: {
      state: overallState,
      strengthRequirementIds: idsFor("strength"),
      supportedRequirementIds: idsFor("supported"),
      partialRequirementIds: idsFor("partial"),
      gapRequirementIds: idsFor("gap"),
      contradictionRequirementIds: idsFor("contradiction"),
      indeterminateRequirementIds: idsFor("indeterminate"),
      statement: overallStatement(overallState),
    },
    risks: risks.sort((left, right) => left.id.localeCompare(right.id)),
    warnings: warnings.sort((left, right) => left.id.localeCompare(right.id)),
    ambiguities: ambiguities.sort((left, right) =>
      left.id.localeCompare(right.id),
    ),
    completeness: {
      status: requirementIds.length === 0 ? "empty" : "complete",
      requirementIds,
      assessedRequirementIds: [...requirementIds],
      readyForDownstreamPlanning:
        requirementIds.length > 0 && overallState !== "indeterminate",
      blockingReasons,
    },
  };
}

function gapTypeFor(
  coverage: Pick<
    JobRequirementCoverage,
    "state" | "necessity" | "category" | "warnings"
  >,
  state: JobRequirementAssessmentState,
): JobAssessmentGapType | undefined {
  if (state === "strength" || state === "supported") return undefined;
  if (state === "contradiction") return "contradiction";
  if (state === "indeterminate" || coverage.necessity === "ambiguous") {
    return "ambiguous";
  }
  const warningText = coverage.warnings.join(" ").toLowerCase();
  if (/\brecen(?:t|cy)\b/.test(warningText)) return "recency-gap";
  if (/\bdepth\b/.test(warningText)) return "depth-gap";
  if (/\bscope\b/.test(warningText)) return "scope-gap";
  const categoryGap: Partial<
    Record<JobRequirementCoverage["category"], JobAssessmentGapType>
  > = {
    "technical-expectation": "technology-gap",
    "domain-expectation": "domain-gap",
    "leadership-expectation": "leadership-gap",
    "experience-seniority": "experience-gap",
    language: "language-gap",
    "location-travel-visa-work-mode": "location-or-work-constraint-gap",
    "education-certification": "education-or-certification-gap",
  };
  return (
    categoryGap[coverage.category] ??
    (state === "partial" ? "partial-proof" : "missing-proof")
  );
}

function assessmentStatement(state: JobRequirementAssessmentState): string {
  const statements: Record<JobRequirementAssessmentState, string> = {
    strength:
      "Reviewed evidence provides strong direct support for this requirement.",
    supported:
      "Reviewed evidence provides defensible support for this requirement.",
    partial:
      "Reviewed evidence provides partial or indirect support for this requirement.",
    gap: "The current reviewed evidence does not provide proof for this requirement; this does not establish absence of capability.",
    contradiction:
      "An explicit approved contradiction conflicts with this requirement.",
    indeterminate:
      "Current coverage and provenance cannot resolve this requirement defensibly.",
  };
  return statements[state];
}

function overallStatement(state: JobOverallAssessmentState): string {
  const statements: Record<JobOverallAssessmentState, string> = {
    strong:
      "Mandatory requirements have strong or adequate reviewed proof, including at least one explicit strength.",
    credible:
      "Mandatory requirements have defensible reviewed proof with no critical unresolved gap.",
    mixed:
      "Reviewed proof is meaningful, but material partial support, a gap, or a non-mandatory contradiction remains.",
    limited:
      "Reviewed proof is limited across material mandatory requirements.",
    insufficient:
      "Critical mandatory proof gaps or contradictions prevent a defensible positive assessment.",
    indeterminate:
      "The available requirement coverage is not sufficient to determine a defensible overall assessment.",
  };
  return statements[state];
}

function globalWarnings(): JobAssessmentWarning[] {
  return [
    [
      "QUALITATIVE_ASSESSMENT_ONLY",
      "This artifact uses controlled qualitative states and contains no numeric fit score.",
    ],
    [
      "NO_HIRING_PREDICTION",
      "This assessment does not predict interview, hiring, or employment outcomes.",
    ],
    [
      "NO_APPLICATION_RECOMMENDATION",
      "This assessment does not recommend whether to apply or how to change application content.",
    ],
    [
      "REVIEWED_EVIDENCE_ONLY",
      "Assessment is limited to the reviewed evidence already referenced by the current Job Evidence Map.",
    ],
  ].map(([code, message]) => ({
    id: findingId("warning", code, "global", message),
    code: code as JobAssessmentWarning["code"],
    message,
    evidenceLinkIds: [],
  }));
}

function addRequirementRisks(
  risks: JobAssessmentRisk[],
  coverage: JobRequirementCoverage,
  decision: RequirementAssessmentDecision,
): string[] {
  const candidates: Array<{
    code: JobAssessmentRisk["code"];
    severity: JobAssessmentRisk["severity"];
    message: string;
  }> = [];
  if (
    coverage.necessity === "mandatory" &&
    decision.assessmentState === "gap"
  ) {
    candidates.push({
      code: "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED",
      severity: "critical",
      message:
        "A mandatory requirement has no proof in the current reviewed evidence map.",
    });
  }
  if (
    coverage.necessity === "mandatory" &&
    decision.assessmentState === "partial"
  ) {
    candidates.push({
      code: "MANDATORY_REQUIREMENT_PARTIAL",
      severity: "high",
      message:
        "A mandatory requirement has only partial or indirect reviewed support.",
    });
  }
  if (decision.assessmentState === "contradiction") {
    candidates.push({
      code: "EXPLICIT_REQUIREMENT_CONTRADICTED",
      severity: coverage.necessity === "mandatory" ? "critical" : "high",
      message:
        "An explicit approved contradiction is linked to this requirement.",
    });
  }
  if (decision.proofStrength === "limited") {
    candidates.push({
      code: "PROOF_QUALITY_LIMITED",
      severity: coverage.necessity === "mandatory" ? "high" : "medium",
      message:
        "Mapped proof quality is limited and is not upgraded by link quantity.",
    });
  }
  if (decision.materiality === "unknown") {
    candidates.push({
      code: "AMBIGUOUS_REQUIREMENT_MATERIALITY",
      severity: "medium",
      message:
        "Requirement materiality remains unknown because necessity is ambiguous.",
    });
  }
  const warningText = coverage.warnings.join(" ").toLowerCase();
  for (const [pattern, code, message] of [
    [
      /\bscope\b/,
      "REQUIREMENT_SCOPE_NOT_EVIDENCED",
      "Explicit requirement scope is not fully evidenced.",
    ],
    [
      /\bdepth\b/,
      "REQUIREMENT_DEPTH_NOT_EVIDENCED",
      "Explicit requirement depth is not fully evidenced.",
    ],
    [
      /\brecen(?:t|cy)\b/,
      "REQUIREMENT_RECENCY_NOT_EVIDENCED",
      "Explicit requirement recency is not fully evidenced.",
    ],
  ] as const) {
    if (pattern.test(warningText)) {
      candidates.push({ code, severity: "medium", message });
    }
  }
  return candidates
    .map((candidate) => {
      const risk: JobAssessmentRisk = {
        id: findingId(
          "risk",
          candidate.code,
          coverage.requirementId,
          candidate.message,
        ),
        ...candidate,
        requirementId: coverage.requirementId,
        coverageEntryId: coverage.id,
        evidenceLinkIds: coverage.mappedLinkIds,
      };
      risks.push(risk);
      return risk.id;
    })
    .sort((left, right) => left.localeCompare(right));
}

function addRequirementWarnings(
  warnings: JobAssessmentWarning[],
  coverage: JobRequirementCoverage,
  decision: RequirementAssessmentDecision,
): string[] {
  const candidates: Array<{
    code: JobAssessmentWarning["code"];
    message: string;
  }> = [];
  if (coverage.necessity === "ambiguous") {
    candidates.push({
      code: "AMBIGUOUS_REQUIREMENT_REMAINS",
      message:
        "Requirement necessity remains ambiguous and is not silently hardened.",
    });
  }
  if (
    coverage.necessity === "preferred" &&
    decision.assessmentState === "gap"
  ) {
    candidates.push({
      code: "PREFERRED_REQUIREMENT_UNSUPPORTED",
      message:
        "A preferred requirement has no proof in the current reviewed evidence map.",
    });
  }
  if (
    coverage.necessity === "contextual" &&
    decision.assessmentState === "gap"
  ) {
    candidates.push({
      code: "CONTEXTUAL_REQUIREMENT_UNSUPPORTED",
      message:
        "A contextual requirement has no proof in the current reviewed evidence map.",
    });
  }
  return candidates
    .map((candidate) => {
      const warning: JobAssessmentWarning = {
        id: findingId(
          "warning",
          candidate.code,
          coverage.requirementId,
          candidate.message,
        ),
        ...candidate,
        requirementId: coverage.requirementId,
        coverageEntryId: coverage.id,
        evidenceLinkIds: coverage.mappedLinkIds,
      };
      warnings.push(warning);
      return warning.id;
    })
    .sort((left, right) => left.localeCompare(right));
}

function addRequirementAmbiguities(
  ambiguities: JobAssessmentAmbiguity[],
  coverage: JobRequirementCoverage,
  decision: RequirementAssessmentDecision,
): string[] {
  const candidates: Array<{
    code: JobAssessmentAmbiguity["code"];
    message: string;
  }> = coverage.ambiguities.map((message) => ({
    code: "REQUIREMENT_AMBIGUITY_PRESERVED" as const,
    message,
  }));
  if (decision.assessmentState === "indeterminate") {
    candidates.push({
      code: "COVERAGE_INDETERMINATE",
      message:
        "Current deterministic coverage cannot resolve this requirement.",
    });
  }
  if (decision.assessmentState === "gap") {
    candidates.push({
      code: "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT",
      message:
        "Absence of reviewed proof does not establish absence of capability.",
    });
  }
  return candidates
    .map((candidate) => {
      const ambiguity: JobAssessmentAmbiguity = {
        id: findingId(
          "ambiguity",
          candidate.code,
          coverage.requirementId,
          candidate.message,
        ),
        ...candidate,
        requirementId: coverage.requirementId,
        coverageEntryId: coverage.id,
        evidenceLinkIds: coverage.mappedLinkIds,
      };
      ambiguities.push(ambiguity);
      return ambiguity.id;
    })
    .sort((left, right) => left.localeCompare(right));
}

function findingId(
  kind: string,
  code: string,
  context: string,
  message: string,
): string {
  return `job-assessment-${kind}_${hashText(
    `${code}\u0000${context}\u0000${message}`,
  ).slice(0, 14)}`;
}

async function loadCurrentDependencies(
  workspace: string,
  targetId: string,
): Promise<AssessmentDependencies> {
  const target = await requireJobTarget(workspace, targetId);
  const coverageStatus = await getJobCoverageStatus(workspace, targetId);
  if (coverageStatus.status !== "current") {
    throw new Error(
      `Job Fit and Proof Assessment requires current Job Requirement Coverage. Current status: ${coverageStatus.status}. ${coverageStatus.reasons.join(" ")}`,
    );
  }
  const coveragePaths = jobCoveragePaths(workspace, targetId);
  const coverage = await showJobCoverage(workspace, targetId);
  const coverageManifest = JobRequirementCoverageManifestSchema.parse(
    await readJson<unknown>(coveragePaths.manifestPath, null),
  );
  if (!coverage.completeness.readyForDownstreamAssessment) {
    throw new Error(
      "Job Requirement Coverage is current but is not ready for downstream assessment.",
    );
  }
  const requirementInput = await loadRequirementInput(
    workspace,
    targetId,
    coverage.input.requirementModelType,
  );
  const mapPaths = jobEvidenceMapPaths(workspace, targetId);
  const evidenceMap = await showJobEvidenceMap(workspace, targetId);
  const targetSha256 = await hashFile(
    resolveWithin(workspace, `targets/jobs/${targetId}/target.json`),
  );
  const sourceSha256 = await hashFile(
    resolveWithin(workspace, `targets/jobs/${targetId}/job-description.md`),
  );
  const evidenceMapSha256 = await hashFile(mapPaths.mapPath);
  const evidenceMapManifestSha256 = await hashFile(mapPaths.manifestPath);
  const coverageSha256 = await hashFile(coveragePaths.coveragePath);
  const coverageManifestSha256 = await hashFile(coveragePaths.manifestPath);
  const dependencyProblems = uniqueSorted([
    ...(coverage.input.target.sha256 !== targetSha256
      ? ["Job Target hash disagrees with coverage."]
      : []),
    ...(coverage.input.jobDescription.sha256 !== sourceSha256
      ? ["Job Description hash disagrees with coverage."]
      : []),
    ...(coverage.input.requirementModel.sha256 !== requirementInput.modelSha256
      ? ["Job Requirement Model hash disagrees with coverage."]
      : []),
    ...(coverage.input.requirementManifest.sha256 !==
    requirementInput.manifestSha256
      ? ["Job Requirement Model manifest hash disagrees with coverage."]
      : []),
    ...(coverage.input.evidenceMap.sha256 !== evidenceMapSha256
      ? ["Job Evidence Map hash disagrees with coverage."]
      : []),
    ...(coverage.input.evidenceMapManifest.sha256 !==
    evidenceMapManifestSha256
      ? ["Job Evidence Map manifest hash disagrees with coverage."]
      : []),
    ...(coverageManifest.coverageSha256 !== coverageSha256
      ? [
          "Coverage manifest does not identify the current coverage artifact.",
        ]
      : []),
  ]);
  if (dependencyProblems.length > 0) {
    throw new Error(
      `Assessment dependency provenance is invalid. ${dependencyProblems.join(" ")}`,
    );
  }
  const normalizedInputSha256 = assessmentInputHash({
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

function dependencyInput(dependencies: AssessmentDependencies) {
  return {
    target: {
      path: `targets/jobs/${dependencies.target.id}/target.json`,
      sha256: dependencies.targetSha256,
    },
    jobDescription: {
      path: `targets/jobs/${dependencies.target.id}/job-description.md`,
      sha256: dependencies.sourceSha256,
    },
    requirementModelType: dependencies.requirementInput.type,
    requirementModel: {
      path: dependencies.requirementInput.modelPath,
      sha256: dependencies.requirementInput.modelSha256,
    },
    requirementManifest: {
      path: dependencies.requirementInput.manifestPath,
      sha256: dependencies.requirementInput.manifestSha256,
    },
    evidenceMap: {
      path: dependencies.evidenceMapPath,
      sha256: dependencies.evidenceMapSha256,
    },
    evidenceMapManifest: {
      path: dependencies.evidenceMapManifestPath,
      sha256: dependencies.evidenceMapManifestSha256,
    },
    coverage: {
      path: dependencies.coveragePath,
      sha256: dependencies.coverageSha256,
    },
    coverageManifest: {
      path: dependencies.coverageManifestPath,
      sha256: dependencies.coverageManifestSha256,
    },
    normalizedInputSha256: dependencies.normalizedInputSha256,
  };
}

function assessmentInputHash(input: {
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
}): string {
  return hashText(
    stableJson({
      ...input,
      analyzerName: JOB_FIT_PROOF_ASSESSMENT_ANALYZER_NAME,
      analyzerVersion: JOB_FIT_PROOF_ASSESSMENT_ANALYZER_VERSION,
      policyName: JOB_FIT_PROOF_ASSESSMENT_POLICY_NAME,
      policyVersion: JOB_FIT_PROOF_ASSESSMENT_POLICY_VERSION,
    }),
  );
}

function dependencyMatches(
  manifest: JobFitProofAssessmentManifest,
  dependencies: AssessmentDependencies,
): Record<string, boolean> {
  return {
    targetHashMatches: manifest.targetSha256 === dependencies.targetSha256,
    sourceHashMatches: manifest.sourceSha256 === dependencies.sourceSha256,
    requirementModelHashMatches:
      manifest.requirementModelType === dependencies.requirementInput.type &&
      manifest.requirementModelSha256 ===
        dependencies.requirementInput.modelSha256,
    requirementManifestHashMatches:
      manifest.requirementManifestSha256 ===
      dependencies.requirementInput.manifestSha256,
    evidenceMapHashMatches:
      manifest.evidenceMapSha256 === dependencies.evidenceMapSha256,
    evidenceMapManifestHashMatches:
      manifest.evidenceMapManifestSha256 ===
      dependencies.evidenceMapManifestSha256,
    coverageHashMatches:
      manifest.coverageSha256 === dependencies.coverageSha256,
    coverageManifestHashMatches:
      manifest.coverageManifestSha256 ===
      dependencies.coverageManifestSha256,
    analyzerMatches:
      manifest.analyzerName === JOB_FIT_PROOF_ASSESSMENT_ANALYZER_NAME &&
      manifest.analyzerVersion === JOB_FIT_PROOF_ASSESSMENT_ANALYZER_VERSION,
    policyMatches:
      manifest.policyName === JOB_FIT_PROOF_ASSESSMENT_POLICY_NAME &&
      manifest.policyVersion === JOB_FIT_PROOF_ASSESSMENT_POLICY_VERSION,
    normalizedInputHashMatches:
      manifest.normalizedInputSha256 === dependencies.normalizedInputSha256,
  };
}

function dependencyReason(name: string): string {
  const reasons: Record<string, string> = {
    targetHashMatches: "Job Target changed.",
    sourceHashMatches: "Persisted Job Description changed.",
    requirementModelHashMatches: "Job Requirement Model changed.",
    requirementManifestHashMatches: "Job Requirement Model manifest changed.",
    evidenceMapHashMatches: "Job Evidence Map changed.",
    evidenceMapManifestHashMatches: "Job Evidence Map manifest changed.",
    coverageHashMatches: "Job Requirement Coverage changed.",
    coverageManifestHashMatches: "Job Requirement Coverage manifest changed.",
    analyzerMatches: "Job fit and proof assessment analyzer changed.",
    policyMatches: "Job fit and proof assessment policy changed.",
    normalizedInputHashMatches: "Normalized assessment input changed.",
  };
  return reasons[name] ?? `Assessment dependency changed: ${name}.`;
}

function validateStoredIdentity(
  assessment: JobFitProofAssessment,
  manifest: JobFitProofAssessmentManifest,
  paths: JobAssessmentPaths,
): string[] {
  const reasons: string[] = [];
  if (
    assessment.id !== manifest.assessmentId ||
    assessment.targetId !== manifest.targetId ||
    assessment.targetType !== "job" ||
    manifest.targetType !== "job" ||
    manifest.assessmentPath !== paths.assessmentRelativePath
  ) {
    reasons.push(
      "Job Fit and Proof Assessment identity or persistence path is invalid.",
    );
  }
  if (
    assessment.input.target.sha256 !== manifest.targetSha256 ||
    assessment.input.jobDescription.sha256 !== manifest.sourceSha256 ||
    assessment.input.requirementModelType !== manifest.requirementModelType ||
    assessment.input.requirementModel.sha256 !==
      manifest.requirementModelSha256 ||
    assessment.input.requirementManifest.sha256 !==
      manifest.requirementManifestSha256 ||
    assessment.input.evidenceMap.sha256 !== manifest.evidenceMapSha256 ||
    assessment.input.evidenceMapManifest.sha256 !==
      manifest.evidenceMapManifestSha256 ||
    assessment.input.coverage.sha256 !== manifest.coverageSha256 ||
    assessment.input.coverageManifest.sha256 !==
      manifest.coverageManifestSha256 ||
    assessment.input.normalizedInputSha256 !== manifest.normalizedInputSha256
  ) {
    reasons.push(
      "Job Fit and Proof Assessment and manifest disagree on dependency hashes.",
    );
  }
  return reasons;
}

function assessmentSemantics(assessment: JobFitProofAssessment) {
  return {
    requirementAssessments: assessment.requirementAssessments,
    overall: assessment.overall,
    risks: assessment.risks,
    warnings: assessment.warnings,
    ambiguities: assessment.ambiguities,
    completeness: assessment.completeness,
  };
}

function resultFromAssessment(
  assessment: JobFitProofAssessment,
  paths: JobAssessmentPaths,
  result: BuildJobFitProofAssessmentResult["result"],
): BuildJobFitProofAssessmentResult {
  return {
    targetId: assessment.targetId,
    result,
    assessmentPath: paths.assessmentRelativePath,
    manifestPath: paths.manifestRelativePath,
    requirementCount: assessment.requirementAssessments.length,
    overallState: assessment.overall.state,
    readyForDownstreamPlanning:
      assessment.completeness.readyForDownstreamPlanning,
  };
}

type StatusBase = Pick<
  JobFitProofAssessmentStatus,
  | "targetId"
  | "assessmentExists"
  | "manifestExists"
  | "coverageStatus"
  | "assessmentPath"
  | "manifestPath"
>;

function emptyStatus(
  base: StatusBase,
  status: "missing" | "stale" | "invalid",
  reasons: string[],
): JobFitProofAssessmentStatus {
  return {
    ...base,
    assessmentHashMatches: null,
    targetHashMatches: null,
    sourceHashMatches: null,
    requirementModelHashMatches: null,
    requirementManifestHashMatches: null,
    evidenceMapHashMatches: null,
    evidenceMapManifestHashMatches: null,
    coverageHashMatches: null,
    coverageManifestHashMatches: null,
    analyzerMatches: null,
    policyMatches: null,
    normalizedInputHashMatches: null,
    status,
    reasons: uniqueSorted(reasons),
  };
}

function statusWithChecks(
  base: StatusBase,
  assessmentHashMatches: boolean,
  checks: Record<string, boolean>,
  status: JobFitProofAssessmentStatus["status"],
  reasons: string[],
): JobFitProofAssessmentStatus {
  return {
    ...base,
    assessmentHashMatches,
    targetHashMatches: checks.targetHashMatches,
    sourceHashMatches: checks.sourceHashMatches,
    requirementModelHashMatches: checks.requirementModelHashMatches,
    requirementManifestHashMatches: checks.requirementManifestHashMatches,
    evidenceMapHashMatches: checks.evidenceMapHashMatches,
    evidenceMapManifestHashMatches: checks.evidenceMapManifestHashMatches,
    coverageHashMatches: checks.coverageHashMatches,
    coverageManifestHashMatches: checks.coverageManifestHashMatches,
    analyzerMatches: checks.analyzerMatches,
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
    throw new Error(
      `Job Fit and Proof Assessment rejects Role Target: ${targetId}`,
    );
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
      `Job Fit and Proof Assessment path escapes the workspace: ${relativePath}`,
    );
  }
  return resolved;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
