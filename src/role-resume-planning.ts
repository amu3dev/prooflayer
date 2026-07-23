import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  uniqueSorted,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  ClaimSchema,
  EvidenceItemSchema,
  type Claim,
  type EvidenceItem,
  type EvidenceMatch,
  type RoleTarget,
} from "./schemas.js";
import {
  FitAssessmentManifestSchema,
  type ExpectationFitAssessment,
  type TargetFitAssessment,
} from "./fit-assessment-schemas.js";
import { showTarget } from "./targets.js";
import {
  getFitAssessmentStatus,
  loadAssessmentContext,
  showFitAssessment,
  type AssessmentContext,
} from "./fit-assessment.js";
import {
  RoleResumeContentPlanSchema,
  RoleResumePlanManifestSchema,
  type ResumeClaimBoundary,
  type ResumeContentExclusion,
  type ResumeContentType,
  type ResumeEvidenceSelection,
  type ResumeExpectationSelection,
  type ResumePlanningAmbiguity,
  type ResumePlanningRisk,
  type ResumePlanningWarning,
  type RolePositioningPlan,
  type RoleResumeContentPlan,
  type RoleResumePlanCompleteness,
  type RoleResumePlanManifest,
  type RoleResumeSectionPlan,
  type RoleResumeSectionType,
} from "./role-resume-plan-schemas.js";
import { stableJson } from "./target-proposal.js";

export const ROLE_RESUME_PLANNING_POLICY_NAME = "role-resume-content-planning-policy";
export const ROLE_RESUME_PLANNING_POLICY_VERSION = "1";

const PLAN_FILE = "role-resume-plan.json";
const MANIFEST_FILE = "plan-manifest.json";

export interface RoleResumePlanningContext extends AssessmentContext {
  target: RoleTarget;
  approvedAssessment: TargetFitAssessment & { targetType: "role"; mode: "role-positioning" };
  approvedAssessmentPath: string;
  approvedAssessmentSha256: string;
  approvedAssessmentManifestPath: string;
  approvedAssessmentManifestSha256: string;
  assessmentSetSha256: string;
  evidenceSetSha256: string;
  evidenceItems: EvidenceItem[];
  reviewedMetricEvidenceIds: Set<string>;
}

export interface BuildRoleResumePlanOptions {
  rebuild?: boolean;
  allowPartial?: boolean;
  now?: () => Date;
}

export interface BuildRoleResumePlanResult {
  targetId: string;
  result: "created" | "rebuilt" | "already-current";
  planId: string;
  planPath: string;
  manifestPath: string;
  positioningScope: RolePositioningPlan["positioningScope"];
  sectionCount: number;
  selectedExpectationCount: number;
  completeness: RoleResumePlanCompleteness["status"];
  usableForResumeDrafting: boolean;
  warningCount: number;
  riskCount: number;
}

export interface RoleResumePlanStatus {
  targetId: string;
  artifactType: "deterministic" | "approved";
  planExists: boolean;
  manifestExists: boolean;
  planHashMatches: boolean | null;
  targetHashMatches: boolean | null;
  interpretationHashMatches: boolean | null;
  matchingHashMatches: boolean | null;
  assessmentHashMatches: boolean | null;
  evidenceSnapshotHashMatches: boolean | null;
  policyVersionMatches: boolean | null;
  proposalHashMatches: boolean | null;
  reviewHashMatches: boolean | null;
  status: "missing" | "current" | "stale" | "invalid";
  reasons: string[];
  planPath: string;
  manifestPath: string;
}

export async function loadRoleResumePlanningContext(
  workspace: string,
  targetId: string,
  options: { allowPartial?: boolean } = {},
): Promise<RoleResumePlanningContext> {
  const target = await showTarget(workspace, targetId);
  if (target.type !== "role") throw new Error("Role Resume Content Planning accepts Role Targets only; Job Targets are rejected.");
  const base = await loadAssessmentContext(workspace, targetId);
  const status = await getFitAssessmentStatus(workspace, targetId, "approved");
  if (status.status !== "current") throw new Error(`Approved role assessment must be current before planning. Current status: ${status.status}`);
  const assessment = await showFitAssessment(workspace, targetId, "approved");
  if (assessment.targetType !== "role" || assessment.mode !== "role-positioning") throw new Error("Approved assessment is not a role-positioning assessment.");
  if (!options.allowPartial && (assessment.completeness.status !== "complete" || !assessment.completeness.usableForResumeConstruction)) {
    throw new Error("Approved role assessment must be complete and usable for resume construction.");
  }
  if (
    assessment.approvedInterpretation.sha256 !== base.approvedInterpretationSha256 ||
    assessment.approvedMatching.sha256 !== base.approvedMatchingSha256 ||
    assessment.evidenceSnapshotSha256 !== base.evidenceSnapshotSha256
  ) throw new Error("Approved assessment dependencies do not match current interpretation, matching, or evidence snapshot.");

  const assessmentManifest = FitAssessmentManifestSchema.parse(
    await readJson<unknown>(resolveWithin(workspace, status.manifestPath), null),
  );
  const evidenceItems = (await readJson<unknown[]>(path.join(workspace, "kb/evidence-items.json"), [])).map((entry) => EvidenceItemSchema.parse(entry));
  const claims = (await readJson<unknown[]>(path.join(workspace, "kb/claims.json"), [])).map((entry) => ClaimSchema.parse(entry));
  const reviewedMetricEvidenceIds = new Set(claims
    .filter((claim) => claim.approvalStatus === "approved" && claim.outputReadiness === "resume_ready" && claim.metricStatus === "verified_metric")
    .flatMap((claim) => claim.supportingEvidenceIds));
  return {
    ...base,
    target,
    approvedAssessment: assessment,
    approvedAssessmentPath: status.assessmentPath,
    approvedAssessmentSha256: assessmentManifest.assessmentSha256,
    approvedAssessmentManifestPath: status.manifestPath,
    approvedAssessmentManifestSha256: await hashFile(resolveWithin(workspace, status.manifestPath)),
    assessmentSetSha256: hashText(stableJson(assessment.expectationAssessments)),
    evidenceSetSha256: hashText(stableJson(base.approvedMatching.evidenceSnapshot.eligibleEvidenceIds)),
    evidenceItems,
    reviewedMetricEvidenceIds,
  };
}

export async function buildRoleResumePlan(
  workspace: string,
  targetId: string,
  options: BuildRoleResumePlanOptions = {},
): Promise<BuildRoleResumePlanResult> {
  const context = await loadRoleResumePlanningContext(workspace, targetId, { allowPartial: options.allowPartial });
  const paths = roleResumePlanPaths(workspace, targetId, "deterministic");
  const status = await getRoleResumePlanStatus(workspace, targetId, "deterministic");
  if (status.status === "current") return planResult(await showRoleResumePlan(workspace, targetId), paths, "already-current");
  if (["stale", "invalid"].includes(status.status) && !options.rebuild) {
    throw new Error(`Deterministic role resume plan is ${status.status}; use explicit --rebuild after reviewing dependency changes.`);
  }
  const now = (options.now ?? (() => new Date()))().toISOString();
  let createdAt = now;
  if (await pathExists(paths.planPath)) {
    try { createdAt = RoleResumeContentPlanSchema.parse(await readJson<unknown>(paths.planPath, null)).createdAt; } catch { /* explicit rebuild */ }
  }
  const plan = deriveRoleResumeContentPlan(context, createdAt, now, options.allowPartial ?? false);
  assertRoleResumePlanConsistency(plan, context);
  await writeJsonAtomic(paths.planPath, plan);
  const manifest = createRoleResumePlanManifest(plan, context, paths.planRelativePath, await hashFile(paths.planPath), "deterministic", createdAt, now);
  await writeJsonAtomic(paths.manifestPath, manifest);
  return planResult(plan, paths, status.status === "missing" ? "created" : "rebuilt");
}

export async function showRoleResumePlan(
  workspace: string,
  targetId: string,
  artifactType: "deterministic" | "approved" = "deterministic",
): Promise<RoleResumeContentPlan> {
  const paths = roleResumePlanPaths(workspace, targetId, artifactType);
  if (!(await pathExists(paths.planPath))) throw new Error(`${artifactType} role resume plan not found: ${targetId}`);
  return RoleResumeContentPlanSchema.parse(await readJson<unknown>(paths.planPath, null));
}

export async function getRoleResumePlanStatus(
  workspace: string,
  targetId: string,
  artifactType: "deterministic" | "approved" = "deterministic",
): Promise<RoleResumePlanStatus> {
  const paths = roleResumePlanPaths(workspace, targetId, artifactType);
  const planExists = await pathExists(paths.planPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const base = { targetId, artifactType, planExists, manifestExists, planPath: paths.planRelativePath, manifestPath: paths.manifestRelativePath } as const;
  if (!planExists && !manifestExists) return emptyStatus(base, "missing", [`No ${artifactType} role resume plan exists.`]);
  if (!planExists || !manifestExists) return emptyStatus(base, "invalid", ["Role resume plan artifact set is incomplete."]);
  let plan: RoleResumeContentPlan;
  let manifest: RoleResumePlanManifest;
  try {
    plan = RoleResumeContentPlanSchema.parse(await readJson<unknown>(paths.planPath, null));
    manifest = RoleResumePlanManifestSchema.parse(await readJson<unknown>(paths.manifestPath, null));
  } catch (error) {
    return emptyStatus(base, "invalid", [`Stored plan is malformed: ${errorMessage(error)}`]);
  }
  const planHashMatches = await hashFile(paths.planPath) === manifest.planSha256;
  if (!planHashMatches || manifest.artifactType !== artifactType || manifest.planId !== plan.id || manifest.planPath !== paths.planRelativePath || plan.targetId !== targetId) {
    return { ...emptyStatus(base, "invalid", ["Plan hash, identity, artifact type, or path is invalid."]), planHashMatches };
  }
  let context: RoleResumePlanningContext;
  try { context = await loadRoleResumePlanningContext(workspace, targetId, { allowPartial: true }); }
  catch (error) { return { ...emptyStatus(base, "stale", [`Current planning dependencies are unavailable: ${errorMessage(error)}`]), planHashMatches }; }
  try { assertRoleResumePlanConsistency(plan, context); }
  catch (error) { return { ...emptyStatus(base, "invalid", [`Stored plan is inconsistent: ${errorMessage(error)}`]), planHashMatches }; }
  const targetHashMatches = manifest.targetSha256 === context.targetSha256;
  const interpretationHashMatches = manifest.approvedInterpretationSha256 === context.approvedInterpretationSha256
    && manifest.approvedInterpretationManifestSha256 === context.approvedInterpretationManifestSha256;
  const matchingHashMatches = manifest.approvedMatchingSha256 === context.approvedMatchingSha256
    && manifest.approvedMatchingManifestSha256 === context.approvedMatchingManifestSha256;
  const assessmentHashMatches = manifest.approvedAssessmentSha256 === context.approvedAssessmentSha256
    && manifest.approvedAssessmentManifestSha256 === context.approvedAssessmentManifestSha256;
  const evidenceSnapshotHashMatches = manifest.evidenceSnapshotSha256 === context.evidenceSnapshotSha256;
  const resolvedSetsMatch = manifest.expectationSetSha256 === context.expectationSetSha256
    && manifest.assessmentSetSha256 === context.assessmentSetSha256
    && manifest.approvedMatchSetSha256 === context.approvedMatchSetSha256
    && manifest.evidenceSetSha256 === context.evidenceSetSha256;
  const policyVersionMatches = manifest.policyName === ROLE_RESUME_PLANNING_POLICY_NAME && manifest.policyVersion === ROLE_RESUME_PLANNING_POLICY_VERSION;
  const proposalHashMatches = manifest.proposalId && manifest.proposalSha256
    ? await dependencyHashMatches(workspace, targetId, "proposals", manifest.proposalId, "proposal.json", manifest.proposalSha256)
    : null;
  const reviewHashMatches = manifest.proposalId && manifest.reviewSha256
    ? await dependencyHashMatches(workspace, targetId, "reviews", manifest.proposalId, "review.json", manifest.reviewSha256)
    : null;
  const reasons = [
    ...(!targetHashMatches ? ["Target hash changed."] : []),
    ...(!interpretationHashMatches ? ["Approved interpretation changed."] : []),
    ...(!matchingHashMatches ? ["Approved matching changed."] : []),
    ...(!assessmentHashMatches ? ["Approved assessment changed."] : []),
    ...(!evidenceSnapshotHashMatches ? ["Evidence snapshot changed."] : []),
    ...(!resolvedSetsMatch ? ["Resolved expectation, assessment, match, or evidence set changed."] : []),
    ...(!policyVersionMatches ? ["Planning policy changed."] : []),
    ...(proposalHashMatches === false ? ["Reviewed proposal changed or is missing."] : []),
    ...(reviewHashMatches === false ? ["Plan review changed or is missing."] : []),
  ];
  return {
    ...base,
    planHashMatches,
    targetHashMatches,
    interpretationHashMatches,
    matchingHashMatches,
    assessmentHashMatches,
    evidenceSnapshotHashMatches,
    policyVersionMatches,
    proposalHashMatches,
    reviewHashMatches,
    status: reasons.length ? "stale" : "current",
    reasons,
  };
}

export function deriveRoleResumeContentPlan(
  context: RoleResumePlanningContext,
  createdAt: string,
  updatedAt: string,
  allowPartial = false,
): RoleResumeContentPlan {
  const planId = deterministicRoleResumePlanId(context);
  const selections = context.approvedAssessment.expectationAssessments
    .map((entry) => deriveExpectationSelection(context, planId, entry))
    .sort((a, b) => a.expectationId.localeCompare(b.expectationId));
  const evidenceSelections = deriveEvidenceSelections(context, planId, selections);
  const claimBoundaries = selections.map((selection) => deriveClaimBoundary(context, planId, selection));
  const positioning = derivePositioning(context, planId, selections);
  const sections = deriveSections(context, planId, selections, evidenceSelections, claimBoundaries, positioning);
  const exclusions = deriveExclusions(context, planId, selections, evidenceSelections);
  const completeness = derivePlanCompleteness(selections, sections, positioning, claimBoundaries, context.approvedAssessment.completeness.status, allowPartial);
  const risks = derivePlanRisks(context.target.id, selections, evidenceSelections, completeness);
  const warnings = derivePlanWarnings(context.target.id, selections, evidenceSelections, positioning);
  const ambiguities = derivePlanAmbiguities(context.target.id, selections, evidenceSelections);
  return RoleResumeContentPlanSchema.parse({
    schemaVersion: 1,
    id: planId,
    targetId: context.target.id,
    targetType: "role",
    mode: "market-positioning",
    roleTitle: context.target.title,
    approvedInterpretation: dependency(context.approvedInterpretationPath, context.approvedInterpretationSha256, context.approvedInterpretationManifestPath, context.approvedInterpretationManifestSha256),
    approvedMatching: dependency(context.approvedMatchingPath, context.approvedMatchingSha256, context.approvedMatchingManifestPath, context.approvedMatchingManifestSha256),
    approvedAssessment: dependency(context.approvedAssessmentPath, context.approvedAssessmentSha256, context.approvedAssessmentManifestPath, context.approvedAssessmentManifestSha256),
    planningPolicy: policy(),
    positioning,
    sections,
    expectationSelections: selections,
    evidenceSelections,
    claimBoundaries,
    exclusions,
    risks,
    warnings,
    ambiguities,
    completeness,
    provenance: planProvenance(context),
    createdAt,
    updatedAt,
  });
}

export function deriveExpectationSelection(
  context: RoleResumePlanningContext,
  planId: string,
  entry: ExpectationFitAssessment,
): ResumeExpectationSelection {
  let decision: ResumeExpectationSelection["decision"];
  if (["unsupported", "conflicting"].includes(entry.supportStatus) || entry.defensibility === "none") decision = "exclude";
  else if (entry.supportStatus === "not-assessed") decision = "defer";
  else if (entry.supportStatus === "partially-supported" || entry.defensibility === "low") decision = "defer";
  else if (["critical", "high"].includes(entry.materiality) && ["high", "medium"].includes(entry.defensibility)) decision = "primary";
  else if (entry.materiality === "medium") decision = "secondary";
  else decision = "supporting";
  const restrictions = [
    ...(entry.freshnessRisk === "high" ? ["Historical evidence must not imply current hands-on depth."] : []),
    ...(entry.supportStatus === "partially-supported" ? ["Future wording must remain qualified and narrow."] : []),
    ...(entry.approvedMatchIds.length === 0 ? ["No resume claim may be drafted without approved supporting evidence."] : []),
  ];
  return {
    id: `expectation-selection_${hashText([planId, entry.expectationId, ROLE_RESUME_PLANNING_POLICY_VERSION].join("\0")).slice(0, 16)}`,
    expectationId: entry.expectationId,
    assessmentId: entry.id,
    decision,
    supportStatus: entry.supportStatus,
    defensibility: entry.defensibility,
    materiality: entry.materiality,
    rationale: selectionRationale(decision),
    approvedMatchIds: entry.approvedMatchIds,
    evidenceIds: entry.evidenceIds,
    allowedSections: allowedSectionsFor(entry, decision),
    restrictions,
    provenance: elementProvenance(context, entry),
    trustState: "deterministic-approved",
  };
}

export function derivePositioningScope(summary: TargetFitAssessment["summary"]): RolePositioningPlan["positioningScope"] {
  if (summary.mode !== "role-positioning") throw new Error("Role positioning requires a role assessment summary.");
  if (summary.overallPositioning === "well-supported") return "direct-role-positioning";
  if (summary.overallPositioning === "supported-with-gaps") return "adjacent-role-positioning";
  if (["partially-supported", "conflicting"].includes(summary.overallPositioning)) return "stretch-positioning";
  return "insufficient-evidence";
}

export function assertRoleResumePlanConsistency(plan: RoleResumeContentPlan, context: RoleResumePlanningContext): void {
  if (plan.targetType !== "role" || plan.mode !== "market-positioning" || plan.targetId !== context.target.id) throw new Error("Plan target identity or mode is invalid.");
  if (plan.roleTitle !== context.target.title || plan.positioning.targetRoleTitle !== context.target.title) throw new Error("Target role title changed or was treated as another identity.");
  if (plan.planningPolicy.name !== ROLE_RESUME_PLANNING_POLICY_NAME || plan.planningPolicy.version !== ROLE_RESUME_PLANNING_POLICY_VERSION) throw new Error("Planning policy identity is invalid.");
  if (plan.approvedInterpretation.sha256 !== context.approvedInterpretationSha256 || plan.approvedMatching.sha256 !== context.approvedMatchingSha256 || plan.approvedAssessment.sha256 !== context.approvedAssessmentSha256) {
    throw new Error("Plan dependency provenance is stale.");
  }
  const expectations = new Map(context.approvedAssessment.expectationAssessments.map((entry) => [entry.expectationId, entry]));
  const assessments = new Set(context.approvedAssessment.expectationAssessments.map((entry) => entry.id));
  const matches = new Set(context.approvedMatching.matches.map((entry) => entry.id));
  const evidence = new Set(context.approvedMatching.evidenceSnapshot.eligibleEvidenceIds);
  if (plan.expectationSelections.length !== expectations.size) throw new Error("Plan must resolve every approved role expectation.");
  if (new Set(plan.expectationSelections.map((entry) => entry.expectationId)).size !== plan.expectationSelections.length) throw new Error("Expectation selections must be unique.");
  const assertReferences = (
    label: string,
    references: { expectationIds: string[]; assessmentIds: string[]; approvedMatchIds: string[]; evidenceIds: string[] },
  ) => {
    if (references.expectationIds.some((id) => !expectations.has(id))) throw new Error(`${label} references an unknown expectation.`);
    if (references.assessmentIds.some((id) => !assessments.has(id))) throw new Error(`${label} references an unknown assessment.`);
    if (references.approvedMatchIds.some((id) => !matches.has(id))) throw new Error(`${label} references an unknown approved match.`);
    if (references.evidenceIds.some((id) => !evidence.has(id))) throw new Error(`${label} references unknown reviewed evidence.`);
  };
  const assertProvenance = (label: string, provenance: RoleResumeContentPlan["positioning"]["provenance"]) => {
    if (
      provenance.targetId !== context.target.id ||
      provenance.approvedInterpretationSha256 !== context.approvedInterpretationSha256 ||
      provenance.approvedMatchingSha256 !== context.approvedMatchingSha256 ||
      provenance.approvedAssessmentSha256 !== context.approvedAssessmentSha256 ||
      provenance.evidenceSnapshotSha256 !== context.evidenceSnapshotSha256 ||
      provenance.planningPolicy.name !== ROLE_RESUME_PLANNING_POLICY_NAME ||
      provenance.planningPolicy.version !== ROLE_RESUME_PLANNING_POLICY_VERSION
    ) throw new Error(`${label} has stale or incomplete provenance.`);
    assertReferences(`${label} provenance`, provenance);
  };
  for (const selection of plan.expectationSelections) {
    const assessment = expectations.get(selection.expectationId);
    if (!assessment || assessment.id !== selection.assessmentId || !assessments.has(selection.assessmentId)) throw new Error(`Unknown expectation or assessment selection: ${selection.id}`);
    if (selection.approvedMatchIds.some((id) => !matches.has(id)) || selection.evidenceIds.some((id) => !evidence.has(id))) throw new Error(`Selection has unknown match or evidence: ${selection.id}`);
    if (selection.decision === "primary" && (!["strongly-supported", "supported"].includes(selection.supportStatus) || !["high", "medium"].includes(selection.defensibility))) {
      throw new Error("Primary selections require supported, defensible evidence.");
    }
    if (selection.supportStatus === "conflicting" && selection.decision !== "exclude") throw new Error("Conflicting expectations must be excluded.");
    assertProvenance(`Expectation selection ${selection.id}`, selection.provenance);
  }
  if (new Set(plan.evidenceSelections.map((entry) => entry.evidenceId)).size !== plan.evidenceSelections.length) throw new Error("Evidence selections must be unique.");
  for (const selected of plan.evidenceSelections) {
    if (!evidence.has(selected.evidenceId)) throw new Error(`Unknown evidence selection: ${selected.evidenceId}`);
    assertReferences(`Evidence selection ${selected.id}`, {
      expectationIds: selected.expectationIds,
      assessmentIds: selected.provenance.assessmentIds,
      approvedMatchIds: selected.approvedMatchIds,
      evidenceIds: [selected.evidenceId],
    });
    assertProvenance(`Evidence selection ${selected.id}`, selected.provenance);
  }
  for (const boundary of plan.claimBoundaries) {
    if (boundary.expectationId && !expectations.has(boundary.expectationId)) throw new Error(`Unknown claim-boundary expectation: ${boundary.id}`);
    if (boundary.evidenceIds.some((id) => !evidence.has(id))) throw new Error(`Unknown claim-boundary evidence: ${boundary.id}`);
    const selection = plan.expectationSelections.find((entry) => entry.expectationId === boundary.expectationId);
    if (selection?.decision === "exclude" && boundary.boundaryType !== "prohibited") throw new Error("Excluded expectations require prohibited claim boundaries.");
    if (["allowed", "allowed-with-caution"].includes(boundary.boundaryType) && boundary.evidenceIds.some((id) => plan.evidenceSelections.find((entry) => entry.evidenceId === id)?.decision === "exclude")) {
      throw new Error("Excluded evidence cannot support an allowed claim boundary.");
    }
    if (boundary.allowedClaimTypes.includes("quantified-outcome") && !boundary.evidenceIds.some((id) => context.reviewedMetricEvidenceIds.has(id))) {
      throw new Error("Quantified outcomes require an approved reviewed metric.");
    }
    assertProvenance(`Claim boundary ${boundary.id}`, boundary.provenance);
  }
  const included = plan.sections.filter((section) => section.status !== "exclude").sort((a, b) => a.order - b.order);
  if (included.some((section, index) => section.order !== index)) throw new Error("Included section order must be unique and contiguous from zero.");
  if (new Set(plan.sections.map((entry) => entry.type)).size !== plan.sections.length) throw new Error("Duplicate resume sections are forbidden.");
  if (new Set(plan.sections.map((entry) => entry.id)).size !== plan.sections.length) throw new Error("Section IDs must be unique.");
  for (const section of plan.sections) {
    assertReferences(`Section ${section.id}`, {
      expectationIds: section.sourceExpectationIds,
      assessmentIds: section.sourceAssessmentIds,
      approvedMatchIds: section.approvedMatchIds,
      evidenceIds: section.evidenceIds,
    });
    if (section.status === "exclude" && (section.sourceExpectationIds.length || section.sourceAssessmentIds.length || section.approvedMatchIds.length || section.evidenceIds.length)) {
      throw new Error("Excluded sections must not retain selected content.");
    }
    assertProvenance(`Section ${section.id}`, section.provenance);
  }
  const themes = [...plan.positioning.primaryThemes, ...plan.positioning.secondaryThemes, ...plan.positioning.differentiationThemes];
  if (new Set(themes.map((entry) => normalizeThemeLabel(entry.label))).size !== themes.length) throw new Error("Duplicate positioning themes are forbidden.");
  for (const theme of themes) {
    if (!theme.sourceExpectationIds.length || !theme.sourceAssessmentIds.length) throw new Error("Positioning themes require approved expectation and assessment provenance.");
    assertReferences(`Positioning theme ${theme.id}`, {
      expectationIds: theme.sourceExpectationIds,
      assessmentIds: theme.sourceAssessmentIds,
      approvedMatchIds: theme.approvedMatchIds,
      evidenceIds: theme.evidenceIds,
    });
    const expectedDecision = theme.emphasis === "primary" ? "primary" : theme.emphasis === "secondary" ? "secondary" : "supporting";
    const sourceDecisions = theme.sourceExpectationIds.map((id) => plan.expectationSelections.find((entry) => entry.expectationId === id)?.decision);
    if (!sourceDecisions.includes(expectedDecision) || sourceDecisions.some((decision) => !["primary", "secondary", "supporting"].includes(decision ?? ""))) {
      throw new Error("Positioning theme emphasis exceeds its selected expectation boundary.");
    }
    assertProvenance(`Positioning theme ${theme.id}`, theme.provenance);
  }
  assertProvenance("Positioning", plan.positioning.provenance);
  for (const exclusion of plan.exclusions) {
    assertReferences(`Exclusion ${exclusion.id}`, {
      expectationIds: exclusion.expectationIds,
      assessmentIds: exclusion.provenance.assessmentIds,
      approvedMatchIds: exclusion.provenance.approvedMatchIds,
      evidenceIds: exclusion.evidenceIds,
    });
    assertProvenance(`Exclusion ${exclusion.id}`, exclusion.provenance);
  }
  if (containsFinishedResumeProse(plan)) throw new Error("Role Resume Content Plans must not contain finished resume prose.");
  if (/\b\d+(?:\.\d+)?%\s*(?:fit|match)\b/i.test(stableJson(plan))) throw new Error("Hidden fit scores are forbidden.");
}

export function createRoleResumePlanManifest(
  plan: RoleResumeContentPlan,
  context: RoleResumePlanningContext,
  planPath: string,
  planSha256: string,
  artifactType: "deterministic" | "approved",
  createdAt: string,
  updatedAt: string,
  review: { proposalId?: string; proposalSha256?: string; reviewSha256?: string } = {},
): RoleResumePlanManifest {
  return RoleResumePlanManifestSchema.parse({
    schemaVersion: 1,
    artifactType,
    planId: plan.id,
    targetId: plan.targetId,
    mode: plan.mode,
    planPath,
    planSha256,
    policyName: ROLE_RESUME_PLANNING_POLICY_NAME,
    policyVersion: ROLE_RESUME_PLANNING_POLICY_VERSION,
    ...plan.provenance,
    ...review,
    createdAt,
    updatedAt,
  });
}

export function deterministicRoleResumePlanId(context: RoleResumePlanningContext): string {
  return `role-resume-plan_${hashText([context.target.id, context.approvedInterpretationSha256, context.approvedMatchingSha256, context.approvedAssessmentSha256, ROLE_RESUME_PLANNING_POLICY_VERSION].join("\0")).slice(0, 16)}`;
}

export function roleResumePlanPaths(workspace: string, targetId: string, artifactType: "deterministic" | "approved") {
  const root = `targets/roles/${targetId}/resume-planning/${artifactType}`;
  return {
    root,
    planRelativePath: `${root}/${PLAN_FILE}`,
    planPath: resolveWithin(workspace, `${root}/${PLAN_FILE}`),
    manifestRelativePath: `${root}/${MANIFEST_FILE}`,
    manifestPath: resolveWithin(workspace, `${root}/${MANIFEST_FILE}`),
  };
}

export function formatBuildRoleResumePlanResult(result: BuildRoleResumePlanResult): string {
  return [
    `Target ID: ${result.targetId}`,
    "Target type: role",
    "Planning mode: market-positioning",
    `Result: ${result.result}`,
    `Plan ID: ${result.planId}`,
    `Positioning scope: ${result.positioningScope}`,
    `Sections: ${result.sectionCount}`,
    `Selected expectations: ${result.selectedExpectationCount}`,
    `Completeness: ${result.completeness}`,
    `Usable for future resume drafting: ${result.usableForResumeDrafting ? "yes" : "no"}`,
    `Plan path: ${result.planPath}`,
    `Manifest path: ${result.manifestPath}`,
  ].join("\n");
}

export function formatRoleResumePlanStatus(status: RoleResumePlanStatus): string {
  const check = (value: boolean | null) => value === null ? "not applicable" : value ? "yes" : "no";
  return [
    `Target ID: ${status.targetId}`,
    `Artifact type: ${status.artifactType}`,
    `Overall status: ${status.status}`,
    `Plan hash matches: ${check(status.planHashMatches)}`,
    `Interpretation matches: ${check(status.interpretationHashMatches)}`,
    `Matching matches: ${check(status.matchingHashMatches)}`,
    `Assessment matches: ${check(status.assessmentHashMatches)}`,
    `Evidence snapshot matches: ${check(status.evidenceSnapshotHashMatches)}`,
    `Policy version matches: ${check(status.policyVersionMatches)}`,
    ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
  ].join("\n");
}

function deriveEvidenceSelections(
  context: RoleResumePlanningContext,
  planId: string,
  selections: ResumeExpectationSelection[],
): ResumeEvidenceSelection[] {
  const byEvidence = new Map<string, EvidenceMatch[]>();
  for (const match of context.approvedMatching.matches) {
    for (const evidenceId of match.evidenceIds) byEvidence.set(evidenceId, [...(byEvidence.get(evidenceId) ?? []), match]);
  }
  return context.approvedMatching.evidenceSnapshot.eligibleEvidenceIds.map((evidenceId) => {
    const matches = (byEvidence.get(evidenceId) ?? []).sort((a, b) => a.id.localeCompare(b.id));
    const selectedMatches = matches.filter((match) => selections.some((selection) => selection.expectationId === match.expectationId && !["exclude", "defer"].includes(selection.decision)));
    const contradictory = matches.some((match) => match.matchType === "contradictory" || match.coverage === "conflicting");
    const historical = matches.length > 0 && matches.every((match) => match.temporalRelevance === "historical");
    const strong = selectedMatches.some((match) => match.matchType === "direct" && match.coverage === "full" && match.evidenceStrength === "strong" && match.matchConfidence === "high");
    let decision: ResumeEvidenceSelection["decision"] = "exclude";
    if (contradictory) decision = "exclude";
    else if (strong && !historical) decision = "preferred";
    else if (selectedMatches.length && historical) decision = "limited-use";
    else if (selectedMatches.length) decision = "allowed";
    const expectationIds = uniqueSorted(matches.map((match) => match.expectationId));
    const assessmentEntries = context.approvedAssessment.expectationAssessments.filter((entry) => expectationIds.includes(entry.expectationId));
    const bestQuality = assessmentEntries.map((entry) => entry.proofQuality).sort((a, b) => qualityRank(a) - qualityRank(b))[0] ?? "unknown";
    const freshnessRisk = assessmentEntries.map((entry) => entry.freshnessRisk).sort((a, b) => freshnessRank(b) - freshnessRank(a))[0] ?? "unknown";
    const permittedUses = uniqueSorted(assessmentEntries.flatMap((entry) => contentTypesFor(entry))) as ResumeContentType[];
    return {
      id: `evidence-selection_${hashText([planId, evidenceId, ROLE_RESUME_PLANNING_POLICY_VERSION].join("\0")).slice(0, 16)}`,
      evidenceId,
      decision,
      approvedMatchIds: matches.map((match) => match.id),
      expectationIds,
      permittedUses,
      prohibitedUses: decision === "exclude" ? [...ResumeContentTypes] : [
        ...(!context.reviewedMetricEvidenceIds.has(evidenceId) ? ["quantified-outcome" as const] : []),
      ],
      proofQuality: bestQuality,
      freshnessRisk,
      limitations: uniqueSorted(matches.flatMap((match) => match.limitations)),
      rationale: evidenceRationale(decision),
      provenance: elementProvenance(context, assessmentEntries),
      trustState: "deterministic-approved" as const,
    };
  }).sort((a, b) => a.evidenceId.localeCompare(b.evidenceId));
}

function deriveClaimBoundary(
  context: RoleResumePlanningContext,
  planId: string,
  selection: ResumeExpectationSelection,
): ResumeClaimBoundary {
  let boundaryType: ResumeClaimBoundary["boundaryType"];
  if (selection.decision === "exclude") boundaryType = "prohibited";
  else if (selection.decision === "defer") boundaryType = "requires-review";
  else if (selection.supportStatus === "partially-supported" || selection.defensibility === "low") boundaryType = "allowed-with-caution";
  else boundaryType = "allowed";
  const assessment = context.approvedAssessment.expectationAssessments.find((entry) => entry.expectationId === selection.expectationId)!;
  const baseTypes = contentTypesFor(assessment);
  const hasMetric = selection.evidenceIds.some((id) => context.reviewedMetricEvidenceIds.has(id));
  const allowedClaimTypes = boundaryType === "prohibited" ? [] : uniqueSorted([
    ...baseTypes,
    ...(hasMetric ? ["quantified-outcome" as const] : []),
  ]) as ResumeContentType[];
  const prohibitedClaimTypes = ResumeContentTypes.filter((type) => !allowedClaimTypes.includes(type));
  const prohibitedInferences = [
    "Do not infer people-management scale, direct reports, budget ownership, or executive reporting lines.",
    "Do not treat the target role title as current or historical employment evidence.",
    "Do not infer enterprise-wide ownership from project-level evidence.",
    ...(!hasMetric ? ["Do not infer quantified business impact where no reviewed metric exists."] : []),
    ...(assessment.freshnessRisk === "high" ? ["Do not infer current hands-on depth from historical evidence."] : []),
  ];
  return {
    id: `claim-boundary_${hashText([planId, selection.expectationId, [...selection.evidenceIds].sort().join(","), boundaryType, ROLE_RESUME_PLANNING_POLICY_VERSION].join("\0")).slice(0, 16)}`,
    expectationId: selection.expectationId,
    evidenceIds: selection.evidenceIds,
    boundaryType,
    allowedClaimTypes,
    prohibitedClaimTypes,
    prohibitedInferences,
    requiredQualifiers: boundaryType === "allowed-with-caution" ? ["Use narrow, evidence-scoped wording."] : [],
    rationale: boundaryRationale(boundaryType),
    provenance: elementProvenance(context, assessment),
    trustState: "deterministic-approved",
  };
}

function derivePositioning(
  context: RoleResumePlanningContext,
  planId: string,
  selections: ResumeExpectationSelection[],
): RolePositioningPlan {
  const selected = selections.filter((entry) => ["primary", "secondary", "supporting"].includes(entry.decision));
  const groups = new Map<string, ResumeExpectationSelection[]>();
  for (const selection of selected) {
    const expectation = context.approvedInterpretation.expectations.find((entry) => entry.id === selection.expectationId)!;
    const label = humanize(expectation.capabilityTags[0] ?? expectation.kind);
    const key = normalizeThemeLabel(label);
    groups.set(key, [...(groups.get(key) ?? []), selection]);
  }
  const themeRank = { primary: 0, secondary: 1, supporting: 2 } as const;
  const themes = [...groups.entries()].map(([key, groupedSelections]) => {
    const emphasis = groupedSelections
      .map((entry) => entry.decision as "primary" | "secondary" | "supporting")
      .sort((a, b) => themeRank[a] - themeRank[b])[0];
    const assessments = groupedSelections.map((selection) => context.approvedAssessment.expectationAssessments.find((entry) => entry.expectationId === selection.expectationId)!).filter(Boolean);
    const sourceExpectationIds = uniqueSorted(groupedSelections.map((entry) => entry.expectationId));
    const label = humanize(context.approvedInterpretation.expectations.find((entry) => entry.id === sourceExpectationIds[0])!.capabilityTags[0]
      ?? context.approvedInterpretation.expectations.find((entry) => entry.id === sourceExpectationIds[0])!.kind);
    return {
      id: `positioning-theme_${hashText([planId, key, sourceExpectationIds.join(","), emphasis].join("\0")).slice(0, 16)}`,
      label,
      sourceExpectationIds,
      sourceAssessmentIds: uniqueSorted(groupedSelections.map((entry) => entry.assessmentId)),
      approvedMatchIds: uniqueSorted(groupedSelections.flatMap((entry) => entry.approvedMatchIds)),
      evidenceIds: uniqueSorted(groupedSelections.flatMap((entry) => entry.evidenceIds)),
      rationale: `${emphasis} role-positioning theme consolidated from approved assessment evidence.`,
      emphasis,
      provenance: elementProvenance(context, assessments),
      trustState: "deterministic-approved" as const,
    };
  }).sort((a, b) => a.label.localeCompare(b.label));
  const primaryThemes = themes.filter((entry) => entry.emphasis === "primary");
  const secondaryThemes = themes.filter((entry) => entry.emphasis === "secondary");
  const supporting = themes.filter((entry) => entry.emphasis === "supporting");
  return {
    targetRoleTitle: context.target.title,
    positioningScope: derivePositioningScope(context.approvedAssessment.summary),
    primaryThemes,
    secondaryThemes,
    differentiationThemes: supporting.slice(0, 3),
    cautionThemes: selections.filter((entry) => ["defer", "exclude"].includes(entry.decision)).map((entry) => ({
      id: `positioning-caution_${hashText([planId, entry.expectationId].join("\0")).slice(0, 16)}`,
      label: humanize(entry.supportStatus),
      expectationIds: [entry.expectationId],
      evidenceIds: entry.evidenceIds,
      rationale: entry.rationale,
    })),
    narrativeOrder: ["target-role-identity", "primary-themes", "selected-impact", "professional-experience", "supporting-projects-and-technical-depth", "education-and-certifications"],
    audience: { primary: "mixed", notes: ["Plan for recruiter scan and hiring-manager evidence review."] },
    provenance: elementProvenance(context, context.approvedAssessment.expectationAssessments),
    trustState: "deterministic-approved",
  };
}

function deriveSections(
  context: RoleResumePlanningContext,
  planId: string,
  selections: ResumeExpectationSelection[],
  evidence: ResumeEvidenceSelection[],
  boundaries: ResumeClaimBoundary[],
  positioning: RolePositioningPlan,
): RoleResumeSectionPlan[] {
  const selected = selections.filter((entry) => !["exclude", "defer"].includes(entry.decision));
  const selectedIds = selected.flatMap((entry) => entry.expectationId);
  const selectedAssessments = context.approvedAssessment.expectationAssessments.filter((entry) => selectedIds.includes(entry.expectationId));
  const usableEvidence = evidence.filter((entry) => entry.decision !== "exclude").map((entry) => entry.evidenceId);
  const hasImpact = boundaries.some((entry) => entry.allowedClaimTypes.some((type) => ["achievement", "delivery-outcome", "product-outcome", "business-outcome", "quantified-outcome"].includes(type)));
  const hasProjects = context.evidenceItems.some((entry) => usableEvidence.includes(entry.id) && entry.category === "project");
  const hasTechnical = selectedAssessments.some((entry) => entry.expectation.type === "technical-skill");
  const hasLeadership = selectedAssessments.some((entry) => entry.expectation.type === "leadership");
  const hasEducation = context.evidenceItems.some((entry) => usableEvidence.includes(entry.id) && entry.category === "education");
  const hasCertification = context.evidenceItems.some((entry) => usableEvidence.includes(entry.id) && entry.category === "certification");
  const specs: Array<[RoleResumeSectionType, RoleResumeSectionPlan["status"], ResumeContentType[], string, number?]> = [
    ["headline", "include", ["role-title", "capability-theme"], "Define target role identity and approved positioning themes.", 1],
    ["professional-summary", positioning.primaryThemes.length ? "include" : "exclude", ["capability-theme", "scope", "domain"], "Structure a concise evidence-backed positioning summary without drafting prose.", 1],
    ["core-capabilities", selected.length ? "include" : "exclude", ["capability-theme", "leadership-behavior", "technology", "domain"], "Organize approved capability themes tied to selected expectations.", 8],
    ["selected-impact", hasImpact ? "optional" : "exclude", ["achievement", "delivery-outcome", "product-outcome", "business-outcome", "quantified-outcome"], "Select only reviewed outcomes; responsibilities must not become achievements.", 4],
    ["professional-experience", usableEvidence.length ? "include" : "exclude", ["role-title", "scope", "responsibility", "achievement"], "Select relevant reviewed role evidence clusters without rewriting role descriptions.", 8],
    ["selected-projects", hasProjects ? "optional" : "exclude", ["project", "technology", "product-outcome"], "Use project evidence only within explicit project scope.", 4],
    ["technical-capabilities", hasTechnical ? "optional" : "exclude", ["technology", "domain", "capability-theme"], "Group only reviewed technologies and technical domains.", 12],
    ["leadership-capabilities", hasLeadership ? "optional" : "exclude", ["leadership-behavior", "scope"], "Plan only defensible leadership dimensions without authority inflation.", 6],
    ["education", hasEducation ? "optional" : "exclude", ["education"], "Retain exact reviewed education facts.", 4],
    ["certifications", hasCertification ? "optional" : "exclude", ["certification"], "Retain exact reviewed certification facts.", 6],
    ["additional-information", "exclude", [], "Exclude content that is not needed for the role-positioning plan."],
  ];
  let nextOrder = 0;
  return specs.map(([type, status, allowed, objective, maximumItemCount]) => {
    const relevant = status === "exclude"
      ? []
      : type === "selected-impact"
        ? selected.filter((entry) => boundaries.some((boundary) =>
          boundary.expectationId === entry.expectationId &&
          boundary.allowedClaimTypes.some((claimType) =>
            ["achievement", "delivery-outcome", "product-outcome", "business-outcome", "quantified-outcome"].includes(claimType))))
        : selected.filter((entry) => entry.allowedSections.includes(type));
    const order = status === "exclude" ? specs.length + nextOrder++ : nextOrder++;
    return {
      id: `section-plan_${hashText([planId, type, ROLE_RESUME_PLANNING_POLICY_VERSION].join("\0")).slice(0, 16)}`,
      type,
      status,
      objective,
      order: status === "exclude" ? order : specs.filter(([candidate, candidateStatus]) => candidateStatus !== "exclude" && specs.findIndex(([value]) => value === candidate) < specs.findIndex(([value]) => value === type)).length,
      sourceExpectationIds: relevant.map((entry) => entry.expectationId),
      sourceAssessmentIds: relevant.map((entry) => entry.assessmentId),
      approvedMatchIds: uniqueSorted(relevant.flatMap((entry) => entry.approvedMatchIds)),
      evidenceIds: uniqueSorted(relevant.flatMap((entry) => entry.evidenceIds)),
      allowedContentTypes: allowed,
      prohibitedContentTypes: ResumeContentTypes.filter((candidate) => !allowed.includes(candidate)),
      emphasisNotes: status === "exclude" ? [] : ["Use only selected approved expectations and evidence."],
      cautionNotes: [
        "Do not infer seniority, organizational authority, current employment, or unreviewed metrics.",
        ...(type === "selected-projects" ? ["Project evidence remains project-scoped."] : []),
      ],
      ...(maximumItemCount ? { maximumItemCount } : {}),
      provenance: elementProvenance(context, relevant.map((entry) => context.approvedAssessment.expectationAssessments.find((assessment) => assessment.expectationId === entry.expectationId)!).filter(Boolean)),
      trustState: "deterministic-approved" as const,
    };
  });
}

function deriveExclusions(
  context: RoleResumePlanningContext,
  planId: string,
  selections: ResumeExpectationSelection[],
  evidence: ResumeEvidenceSelection[],
): ResumeContentExclusion[] {
  const exclusions: ResumeContentExclusion[] = [];
  for (const selection of selections.filter((entry) => entry.decision === "exclude")) {
    const type = selection.supportStatus === "conflicting" ? "conflicting-expectation" : "unsupported-expectation";
    exclusions.push({
      id: `content-exclusion_${hashText([planId, type, selection.expectationId].join("\0")).slice(0, 16)}`,
      type,
      expectationIds: [selection.expectationId],
      evidenceIds: selection.evidenceIds,
      rationale: `Exclude from future resume drafting because support is ${selection.supportStatus}.`,
      severity: ["critical", "high"].includes(selection.materiality) ? "high" : "medium",
      provenance: elementProvenance(context, context.approvedAssessment.expectationAssessments.find((entry) => entry.expectationId === selection.expectationId)!),
      trustState: "deterministic-approved",
    });
  }
  for (const selection of evidence.filter((entry) => entry.decision === "exclude")) {
    exclusions.push({
      id: `content-exclusion_${hashText([planId, "weak-evidence", selection.evidenceId].join("\0")).slice(0, 16)}`,
      type: "weak-evidence",
      expectationIds: selection.expectationIds,
      evidenceIds: [selection.evidenceId],
      rationale: "Exclude evidence that is contradictory or not tied to a selected expectation.",
      severity: "medium",
      provenance: selection.provenance,
      trustState: "deterministic-approved",
    });
  }
  if (![...context.reviewedMetricEvidenceIds].length) exclusions.push({
    id: `content-exclusion_${hashText([planId, "missing-metric"].join("\0")).slice(0, 16)}`,
    type: "missing-metric",
    expectationIds: [],
    evidenceIds: [],
    rationale: "Quantified outcomes are prohibited because no approved reviewed metric is available.",
    severity: "medium",
    provenance: elementProvenance(context, []),
    trustState: "deterministic-approved",
  });
  return exclusions.sort((a, b) => a.id.localeCompare(b.id));
}

export function derivePlanCompleteness(
  selections: ResumeExpectationSelection[],
  sections: RoleResumeSectionPlan[],
  positioning: RolePositioningPlan,
  boundaries: ResumeClaimBoundary[],
  assessmentStatus: "empty" | "partial" | "complete",
  allowPartial: boolean,
): RoleResumePlanCompleteness {
  const selected = selections.filter((entry) => ["primary", "secondary", "supporting"].includes(entry.decision));
  const blockingReasons = [
    ...(assessmentStatus !== "complete" ? ["Approved role assessment is incomplete."] : []),
    ...(!positioning.primaryThemes.length ? ["No defensible primary positioning theme exists."] : []),
    ...(boundaries.length !== selections.length ? ["Claim boundaries are incomplete."] : []),
  ];
  const status = !selected.length ? "empty" : blockingReasons.length ? "partial" : "complete";
  return {
    status,
    eligibleExpectationCount: selections.length,
    selectedExpectationCount: selected.length,
    excludedExpectationCount: selections.filter((entry) => entry.decision === "exclude").length,
    deferredExpectationCount: selections.filter((entry) => entry.decision === "defer").length,
    plannedSectionCount: sections.filter((entry) => entry.status !== "exclude").length,
    primaryThemeCount: positioning.primaryThemes.length,
    claimBoundariesComplete: boundaries.length === selections.length,
    provenanceComplete: true,
    usableForResumeDrafting: status === "complete" && (!allowPartial || assessmentStatus === "complete"),
    blockingReasons,
  };
}

export function derivePlanRisks(
  targetId: string,
  selections: ResumeExpectationSelection[],
  evidence: ResumeEvidenceSelection[],
  completeness: RoleResumePlanCompleteness,
): ResumePlanningRisk[] {
  const risks: ResumePlanningRisk[] = [];
  const add = (code: ResumePlanningRisk["code"], severity: ResumePlanningRisk["severity"], message: string, expectationIds: string[] = [], evidenceIds: string[] = []) => risks.push({
    id: `planning-risk_${hashText([targetId, code, expectationIds.join(","), evidenceIds.join(",")].join("\0")).slice(0, 12)}`,
    code, severity, message, expectationIds, approvedMatchIds: uniqueSorted(selections.filter((entry) => expectationIds.includes(entry.expectationId)).flatMap((entry) => entry.approvedMatchIds)), evidenceIds,
  });
  if (!selections.some((entry) => entry.decision === "primary")) add("NO_PRIMARY_POSITIONING_THEME", "critical", "No defensible primary positioning theme is available.");
  const criticalExcluded = selections.filter((entry) => ["critical", "high"].includes(entry.materiality) && entry.decision === "exclude");
  if (criticalExcluded.length) add("CRITICAL_EXPECTATION_EXCLUDED", "high", "Material role expectations are excluded from future drafting.", criticalExcluded.map((entry) => entry.expectationId));
  const primaryWithLimitedEvidence = selections.filter((entry) => entry.decision === "primary" && entry.evidenceIds.some((id) => evidence.find((candidate) => candidate.evidenceId === id)?.decision === "limited-use"));
  if (primaryWithLimitedEvidence.length) add("PRIMARY_THEME_USES_LIMITED_EVIDENCE", "high", "A primary positioning theme relies on limited-use evidence.", primaryWithLimitedEvidence.map((entry) => entry.expectationId), uniqueSorted(primaryWithLimitedEvidence.flatMap((entry) => entry.evidenceIds)));
  const historical = evidence.filter((entry) => entry.decision !== "exclude" && entry.freshnessRisk === "high");
  if (historical.length) add("HISTORICAL_EVIDENCE_OVERRELIANCE", "medium", "Historical evidence must not imply current hands-on depth.", [], historical.map((entry) => entry.evidenceId));
  const contradictory = selections.filter((entry) => entry.supportStatus === "conflicting");
  if (contradictory.length) add("CONTRADICTORY_EVIDENCE_PRESENT", "high", "Contradictory reviewed evidence remains explicitly excluded.", contradictory.map((entry) => entry.expectationId), uniqueSorted(contradictory.flatMap((entry) => entry.evidenceIds)));
  const reuseCounts = new Map<string, string[]>();
  for (const selection of selections.filter((entry) => !["exclude", "defer"].includes(entry.decision))) {
    for (const evidenceId of selection.evidenceIds) reuseCounts.set(evidenceId, [...(reuseCounts.get(evidenceId) ?? []), selection.expectationId]);
  }
  const overused = [...reuseCounts.entries()].filter(([, expectationIds]) => expectationIds.length > 3);
  if (overused.length) add("EVIDENCE_REUSED_EXCESSIVELY", "medium", "One or more evidence items support too many selected expectations and require explicit drafting restraint.", uniqueSorted(overused.flatMap(([, ids]) => ids)), overused.map(([id]) => id));
  if (!completeness.usableForResumeDrafting) add("PLAN_INCOMPLETE", "critical", "Plan is not structurally usable for future resume drafting.");
  return risks;
}

export function derivePlanWarnings(
  targetId: string,
  selections: ResumeExpectationSelection[],
  evidence: ResumeEvidenceSelection[],
  positioning: RolePositioningPlan,
): ResumePlanningWarning[] {
  const warnings: ResumePlanningWarning[] = [];
  const add = (code: ResumePlanningWarning["code"], message: string) => warnings.push({
    id: `planning-warning_${hashText([targetId, code].join("\0")).slice(0, 12)}`,
    code, message, expectationIds: [], approvedMatchIds: [], evidenceIds: [],
  });
  if (!selections.some((entry) => entry.supportStatus === "strongly-supported")) add("NO_STRONGLY_SUPPORTED_EXPECTATIONS", "No expectation has strong direct current proof.");
  if (!selections.some((entry) => entry.decision === "primary")) add("NO_PRIMARY_EXPECTATIONS_SELECTED", "No primary expectation is safe to select.");
  const usableEvidence = evidence.filter((entry) => entry.decision !== "exclude");
  if (usableEvidence.length > 0 && usableEvidence.every((entry) => entry.freshnessRisk === "high")) add("ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "Only historical evidence is available.");
  if (usableEvidence.length > 0 && usableEvidence.every((entry) => entry.decision === "limited-use")) add("ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "Only limited-use evidence is available for future drafting.");
  if (!evidence.some((entry) => entry.permittedUses.includes("quantified-outcome"))) add("NO_QUANTIFIED_OUTCOMES_AVAILABLE", "No reviewed metric is available for quantified outcomes.");
  if (positioning.positioningScope !== "direct-role-positioning") add("ROLE_POSITIONING_REQUIRES_CAUTION", "Role positioning requires explicit evidence-boundary caution.");
  add("PLAN_DOES_NOT_CONTAIN_RESUME_PROSE", "This artifact structures content and intentionally contains no finished resume prose.");
  return warnings;
}

export function derivePlanAmbiguities(
  targetId: string,
  selections: ResumeExpectationSelection[],
  evidence: ResumeEvidenceSelection[],
): ResumePlanningAmbiguity[] {
  const ambiguities: ResumePlanningAmbiguity[] = [];
  const add = (code: ResumePlanningAmbiguity["code"], message: string, expectationIds: string[] = [], evidenceIds: string[] = []) => ambiguities.push({
    id: `planning-ambiguity_${hashText([targetId, code, expectationIds.join(","), evidenceIds.join(",")].join("\0")).slice(0, 12)}`,
    code, message, expectationIds, approvedMatchIds: uniqueSorted(selections.filter((entry) => expectationIds.includes(entry.expectationId)).flatMap((entry) => entry.approvedMatchIds)), evidenceIds,
  });
  const deferred = selections.filter((entry) => entry.decision === "defer");
  if (deferred.length) add("PRIMARY_VS_SECONDARY_THEME_UNCLEAR", "Deferred expectations require evidence review before positioning.", deferred.map((entry) => entry.expectationId));
  const historical = evidence.filter((entry) => entry.freshnessRisk === "high");
  if (historical.length) add("CURRENT_VS_HISTORICAL_CAPABILITY_UNCLEAR", "Historical evidence requires temporal qualification.", [], historical.map((entry) => entry.evidenceId));
  const reuseCounts = new Map<string, number>();
  for (const selection of selections.filter((entry) => !["exclude", "defer"].includes(entry.decision))) {
    for (const evidenceId of selection.evidenceIds) reuseCounts.set(evidenceId, (reuseCounts.get(evidenceId) ?? 0) + 1);
  }
  const reused = [...reuseCounts.entries()].filter(([, count]) => count > 1).map(([id]) => id);
  if (reused.length) add("EVIDENCE_REUSE_BOUNDARY_UNCLEAR", "Evidence reused across multiple selected expectations must not become duplicate resume claims.", [], reused);
  return ambiguities;
}

const ResumeContentTypes = [
  "role-title", "capability-theme", "scope", "responsibility", "achievement", "quantified-outcome",
  "technology", "domain", "leadership-behavior", "delivery-outcome", "product-outcome",
  "business-outcome", "education", "certification", "project",
] as const;

function contentTypesFor(entry: ExpectationFitAssessment): ResumeContentType[] {
  const byKind: Record<ExpectationFitAssessment["expectation"]["type"], ResumeContentType[]> = {
    responsibility: ["responsibility"],
    capability: ["capability-theme"],
    experience: ["scope", "responsibility"],
    "technical-skill": ["technology", "capability-theme"],
    leadership: ["leadership-behavior", "scope"],
    "domain-knowledge": ["domain"],
    "business-expectation": ["business-outcome"],
    "success-outcome": ["achievement", "delivery-outcome", "product-outcome", "business-outcome"],
    constraint: ["scope"],
    "candidate-attribute": ["capability-theme"],
    qualification: ["education", "certification"],
    unknown: ["capability-theme"],
  };
  return byKind[entry.expectation.type];
}

function allowedSectionsFor(entry: ExpectationFitAssessment, decision: ResumeExpectationSelection["decision"]): RoleResumeSectionType[] {
  if (["exclude", "defer"].includes(decision)) return [];
  const sections: RoleResumeSectionType[] = ["professional-summary", "core-capabilities", "professional-experience"];
  if (entry.expectation.type === "technical-skill") sections.push("technical-capabilities", "selected-projects");
  if (entry.expectation.type === "leadership") sections.push("leadership-capabilities");
  if (entry.expectation.type === "success-outcome") sections.push("selected-impact");
  if (entry.expectation.type === "qualification") sections.push("education", "certifications");
  return uniqueSorted(sections) as RoleResumeSectionType[];
}

function elementProvenance(context: RoleResumePlanningContext, input: ExpectationFitAssessment | ExpectationFitAssessment[]) {
  const entries = (Array.isArray(input) ? input : [input]).filter(Boolean);
  return {
    targetId: context.target.id,
    approvedInterpretationSha256: context.approvedInterpretationSha256,
    approvedMatchingSha256: context.approvedMatchingSha256,
    approvedAssessmentSha256: context.approvedAssessmentSha256,
    evidenceSnapshotSha256: context.evidenceSnapshotSha256,
    expectationIds: uniqueSorted(entries.map((entry) => entry.expectationId)),
    assessmentIds: uniqueSorted(entries.map((entry) => entry.id)),
    approvedMatchIds: uniqueSorted(entries.flatMap((entry) => entry.approvedMatchIds)),
    evidenceIds: uniqueSorted(entries.flatMap((entry) => entry.evidenceIds)),
    sourceReferences: entries.flatMap((entry) => entry.provenance.sourceReferences),
    planningPolicy: policy(),
    deterministicInputs: { ruleSet: ROLE_RESUME_PLANNING_POLICY_VERSION },
  };
}

function planProvenance(context: RoleResumePlanningContext) {
  return {
    targetSha256: context.targetSha256,
    approvedInterpretationSha256: context.approvedInterpretationSha256,
    approvedInterpretationManifestSha256: context.approvedInterpretationManifestSha256,
    approvedMatchingSha256: context.approvedMatchingSha256,
    approvedMatchingManifestSha256: context.approvedMatchingManifestSha256,
    evidenceSnapshotSha256: context.evidenceSnapshotSha256,
    approvedAssessmentSha256: context.approvedAssessmentSha256,
    approvedAssessmentManifestSha256: context.approvedAssessmentManifestSha256,
    expectationSetSha256: context.expectationSetSha256,
    assessmentSetSha256: context.assessmentSetSha256,
    approvedMatchSetSha256: context.approvedMatchSetSha256,
    evidenceSetSha256: context.evidenceSetSha256,
  };
}

function dependency(pathValue: string, sha256: string, manifestPath: string, manifestSha256: string) {
  return { path: pathValue, sha256, manifestPath, manifestSha256 };
}
function policy() { return { name: ROLE_RESUME_PLANNING_POLICY_NAME, version: ROLE_RESUME_PLANNING_POLICY_VERSION }; }
function selectionRationale(decision: ResumeExpectationSelection["decision"]) {
  return ({
    primary: "Material, supported, and defensible expectation selected to anchor positioning.",
    secondary: "Credible expectation selected as secondary positioning support.",
    supporting: "Lower-materiality expectation retained for context or breadth.",
    exclude: "Unsupported or conflicting expectation excluded from future resume claims.",
    defer: "Some relevance exists, but stronger or clearer evidence is required before drafting.",
  })[decision];
}
function evidenceRationale(decision: ResumeEvidenceSelection["decision"]) {
  return ({
    preferred: "Direct, strong, current reviewed evidence for a selected expectation.",
    allowed: "Defensible reviewed evidence that is not the strongest available proof.",
    "limited-use": "Evidence requires narrow or temporal qualification.",
    exclude: "Evidence is contradictory or not tied to a selected expectation.",
  })[decision];
}
function boundaryRationale(type: ResumeClaimBoundary["boundaryType"]) {
  return ({
    allowed: "Reviewed evidence permits a narrow future claim within explicit scope.",
    "allowed-with-caution": "Future wording must remain qualified and evidence-scoped.",
    prohibited: "Reviewed evidence does not support a future resume claim.",
    "requires-review": "Ambiguity or partial proof prevents automatic claim planning.",
  })[type];
}
function qualityRank(value: ResumeEvidenceSelection["proofQuality"]) {
  return ({ strong: 0, adequate: 1, limited: 2, weak: 3, none: 4, conflicting: 5, unknown: 6 })[value];
}
function freshnessRank(value: ResumeEvidenceSelection["freshnessRisk"]) {
  return ({ none: 0, low: 1, medium: 2, high: 3, unknown: 4 })[value];
}
function humanize(value: string) { return value.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function normalizeThemeLabel(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
function containsFinishedResumeProse(plan: RoleResumeContentPlan) {
  const structured = allStringValues(plan).join("\n");
  return /\b(results-driven|proven track record|experienced technology leader with|led cross-functional teams to|delivered \d+%|award-winning|world-class)\b/i.test(structured)
    || /(?:^|[\n"])\s*(?:led|built|delivered|managed|directed|increased|reduced|improved|achieved|launched)\b[^.]{12,}[.!]/im.test(structured);
}
function allStringValues(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStringValues);
  if (value && typeof value === "object") return Object.values(value as Record<string, unknown>).flatMap(allStringValues);
  return [];
}
function planResult(plan: RoleResumeContentPlan, paths: ReturnType<typeof roleResumePlanPaths>, result: BuildRoleResumePlanResult["result"]): BuildRoleResumePlanResult {
  return {
    targetId: plan.targetId,
    result,
    planId: plan.id,
    planPath: paths.planRelativePath,
    manifestPath: paths.manifestRelativePath,
    positioningScope: plan.positioning.positioningScope,
    sectionCount: plan.sections.length,
    selectedExpectationCount: plan.completeness.selectedExpectationCount,
    completeness: plan.completeness.status,
    usableForResumeDrafting: plan.completeness.usableForResumeDrafting,
    warningCount: plan.warnings.length,
    riskCount: plan.risks.length,
  };
}
function emptyStatus(base: Pick<RoleResumePlanStatus, "targetId" | "artifactType" | "planExists" | "manifestExists" | "planPath" | "manifestPath">, status: RoleResumePlanStatus["status"], reasons: string[]): RoleResumePlanStatus {
  return {
    ...base,
    planHashMatches: null,
    targetHashMatches: null,
    interpretationHashMatches: null,
    matchingHashMatches: null,
    assessmentHashMatches: null,
    evidenceSnapshotHashMatches: null,
    policyVersionMatches: null,
    proposalHashMatches: null,
    reviewHashMatches: null,
    status,
    reasons,
  };
}
async function dependencyHashMatches(workspace: string, targetId: string, category: string, id: string, file: string, expected: string) {
  const candidate = resolveWithin(workspace, `targets/roles/${targetId}/resume-planning/${category}/${id}/${file}`);
  return await pathExists(candidate) && await hashFile(candidate) === expected;
}
function resolveWithin(workspace: string, relativePath: string) {
  const absolute = path.resolve(workspace, relativePath);
  const root = path.resolve(workspace);
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) throw new Error("Resolved path leaves workspace.");
  return absolute;
}
function errorMessage(error: unknown) { return error instanceof Error ? error.message : String(error); }
