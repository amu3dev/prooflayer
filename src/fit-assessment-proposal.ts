import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  hashBuffer,
  hashFile,
  hashText,
  pathExists,
  readJson,
  walkFiles,
  writeBufferAtomic,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  FitAssessmentProposalManifestSchema,
  FitAssessmentProposalSchema,
  ModelFitAssessmentPayloadSchema,
  type FitAssessmentAmbiguity,
  type FitAssessmentProposal,
  type FitAssessmentProposalManifest,
  type FitAssessmentValidationIssue,
  type FitAssessmentWarning,
  type ModelFitAssessmentPayload,
  type ProposedExpectationFitAssessment,
  type TargetFitAssessment,
} from "./fit-assessment-schemas.js";
import {
  FIT_ASSESSMENT_POLICY_NAME,
  FIT_ASSESSMENT_POLICY_VERSION,
  getFitAssessmentStatus,
  loadAssessmentContext,
  showFitAssessment,
  type AssessmentContext,
} from "./fit-assessment.js";
import {
  createModelProviderFromEnvironment,
  type InterpretationModelProvider,
} from "./model-provider.js";
import type { Target } from "./schemas.js";
import { showTarget } from "./targets.js";
import { stableJson } from "./target-proposal.js";

export const ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_ID = "target-fit-assessment-proposal";
export const ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_VERSION = "1";
export const ASSESSMENT_PROPOSAL_POLICY_VERSION = "1";

const PROPOSAL_FILE = "proposal.json";
const MANIFEST_FILE = "proposal-manifest.json";
const RAW_FILE = "raw-model-response.txt";

export interface AssessmentProposalGenerationOptions {
  provider?: InterpretationModelProvider;
  environment?: NodeJS.ProcessEnv;
  refresh?: boolean;
  now?: () => Date;
  promptTemplateVersion?: string;
  policyVersion?: string;
}

export interface AssessmentProposalGenerationResult {
  targetId: string;
  targetType: "role" | "job";
  mode: "role-positioning" | "job-specific";
  proposalId: string;
  result: "created" | "cache-hit" | "validation-failed";
  proposalPath: string;
  manifestPath: string;
  rawResponsePath: string;
  proposedAssessmentCount: number;
  validationIssueCount: number;
  requestFingerprint: string;
}

export interface AssessmentProposalStatus {
  proposalId: string;
  targetId: string;
  targetType: "role" | "job";
  mode: "role-positioning" | "job-specific";
  status: "current" | "stale" | "invalid";
  readyForReview: boolean;
  proposalHashMatches: boolean | null;
  rawResponseHashMatches: boolean | null;
  deterministicAssessmentHashMatches: boolean | null;
  approvedInterpretationHashMatches: boolean | null;
  approvedMatchingHashMatches: boolean | null;
  evidenceSnapshotHashMatches: boolean | null;
  reasons: string[];
  proposalPath: string;
  manifestPath: string;
  rawResponsePath: string;
}

interface ProposalLocation {
  proposalRelativePath: string;
  proposalPath: string;
  manifestRelativePath: string;
  manifestPath: string;
  rawRelativePath: string;
  rawPath: string;
}

export async function generateFitAssessmentProposal(
  workspace: string,
  targetId: string,
  options: AssessmentProposalGenerationOptions = {},
): Promise<AssessmentProposalGenerationResult> {
  const deterministicStatus = await getFitAssessmentStatus(workspace, targetId, "deterministic");
  if (deterministicStatus.status !== "current") {
    throw new Error(`A current deterministic assessment is required before model assistance. Current status: ${deterministicStatus.status}`);
  }
  const context = await loadAssessmentContext(workspace, targetId);
  const deterministic = await showFitAssessment(workspace, targetId, "deterministic");
  const deterministicAssessmentSha256 = await hashFile(resolveWithin(workspace, deterministicStatus.assessmentPath));
  const provider = options.provider ?? createModelProviderFromEnvironment(options.environment);
  const promptVersion = options.promptTemplateVersion ?? ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_VERSION;
  const policyVersion = options.policyVersion ?? ASSESSMENT_PROPOSAL_POLICY_VERSION;
  const normalizedInput = {
    target: { id: context.target.id, type: context.target.type, title: context.target.title, mode: context.mode },
    approvedInterpretation: {
      sha256: context.approvedInterpretationSha256,
      expectations: context.approvedInterpretation.expectations,
    },
    approvedMatching: {
      sha256: context.approvedMatchingSha256,
      matches: context.approvedMatching.matches,
      coverage: context.approvedMatching.expectationCoverage,
      completeness: context.approvedMatching.completeness,
    },
    deterministicAssessment: deterministic,
    policy: {
      noCandidateFacts: true,
      noEvidenceMutation: true,
      noResumeLanguage: true,
      noApplicationRecommendation: true,
      noHiringPrediction: true,
      noFitPercentage: true,
      absenceOfEvidenceDoesNotProveAbsenceOfCapability: true,
    },
  };
  const normalizedModelInputSha256 = hashText(stableJson(normalizedInput));
  const renderedPrompt = renderFitAssessmentPrompt(normalizedInput, promptVersion, policyVersion);
  const renderedPromptSha256 = hashText(renderedPrompt);
  const requestFingerprint = hashText(stableJson({
    targetSha256: context.targetSha256,
    approvedInterpretationSha256: context.approvedInterpretationSha256,
    approvedMatchingSha256: context.approvedMatchingSha256,
    evidenceSnapshotSha256: context.evidenceSnapshotSha256,
    deterministicAssessmentSha256,
    assessmentPolicyName: FIT_ASSESSMENT_POLICY_NAME,
    assessmentPolicyVersion: FIT_ASSESSMENT_POLICY_VERSION,
    provider: provider.providerId,
    model: provider.identity.model,
    settings: provider.settings,
    promptTemplateId: ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_ID,
    promptTemplateVersion: promptVersion,
    policyVersion,
    normalizedModelInputSha256,
  }));
  if (!options.refresh) {
    const cached = await findCached(workspace, targetId, requestFingerprint);
    if (cached) return resultFromProposal(cached.proposal, cached.location, "cache-hit");
  }
  const response = await provider.generate({ renderedPrompt, settings: provider.settings });
  if (!response.rawText) throw new Error("Model provider returned an empty response.");
  const rawBytes = Buffer.from(response.rawText, "utf8");
  const rawResponseSha256 = hashBuffer(rawBytes);
  const now = (options.now ?? (() => new Date()))().toISOString();
  const count = await countProposals(workspace, context.target);
  const proposalId = `assessment-proposal_${hashText([requestFingerprint, rawResponseSha256, now, String(count)].join("\u0000")).slice(0, 16)}`;
  const location = proposalLocation(workspace, context.target, proposalId);
  const proposal = normalizeRawProposal({
    rawText: response.rawText,
    proposalId,
    context,
    deterministic,
    deterministicAssessmentSha256,
    requestFingerprint,
    provider: provider.providerId,
    model: provider.identity.model,
    settings: provider.settings,
    promptVersion,
    policyVersion,
    renderedPromptSha256,
    normalizedModelInputSha256,
    rawResponsePath: location.rawRelativePath,
    rawResponseSha256,
    createdAt: now,
    updatedAt: now,
  });
  await writeBufferAtomic(location.rawPath, rawBytes);
  await writeJsonAtomic(location.proposalPath, proposal);
  const manifest = FitAssessmentProposalManifestSchema.parse({
    schemaVersion: 1,
    proposalId,
    requestFingerprint,
    targetId,
    targetType: context.target.type,
    mode: context.mode,
    proposalPath: location.proposalRelativePath,
    proposalSha256: await hashFile(location.proposalPath),
    rawResponsePath: location.rawRelativePath,
    rawResponseSha256,
    policyName: FIT_ASSESSMENT_POLICY_NAME,
    policyVersion,
    provider: provider.providerId,
    model: provider.identity.model,
    promptTemplateId: ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_ID,
    promptTemplateVersion: promptVersion,
    renderedPromptSha256,
    targetSha256: context.targetSha256,
    approvedInterpretationSha256: context.approvedInterpretationSha256,
    approvedMatchingSha256: context.approvedMatchingSha256,
    evidenceSnapshotSha256: context.evidenceSnapshotSha256,
    deterministicAssessmentSha256,
    normalizedModelInputSha256,
    createdAt: now,
    updatedAt: now,
  });
  await writeJsonAtomic(location.manifestPath, manifest);
  return resultFromProposal(proposal, location, proposal.status === "ready-for-review" ? "created" : "validation-failed");
}

export async function showFitAssessmentProposal(workspace: string, proposalId: string): Promise<FitAssessmentProposal> {
  const located = await locateProposal(workspace, proposalId);
  return FitAssessmentProposalSchema.parse(await readJson<unknown>(located.location.proposalPath, null));
}

export async function listFitAssessmentProposals(workspace: string, targetId: string): Promise<FitAssessmentProposal[]> {
  const target = await showTarget(workspace, targetId);
  const files = (await walkFiles(path.join(workspace, `${targetRoot(target)}/assessment/proposals`)))
    .filter((file) => path.basename(file) === PROPOSAL_FILE);
  const proposals = await Promise.all(files.map(async (file) => FitAssessmentProposalSchema.parse(await readJson<unknown>(file, null))));
  return proposals.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}

export async function getFitAssessmentProposalStatus(workspace: string, proposalId: string): Promise<AssessmentProposalStatus> {
  const located = await locateProposal(workspace, proposalId);
  const { target, location } = located;
  const mode = target.type === "role" ? "role-positioning" : "job-specific";
  const base = { proposalId, targetId: target.id, targetType: target.type, mode, proposalPath: location.proposalRelativePath, manifestPath: location.manifestRelativePath, rawResponsePath: location.rawRelativePath } as const;
  if (!(await pathExists(location.proposalPath)) || !(await pathExists(location.manifestPath)) || !(await pathExists(location.rawPath))) {
    return invalidStatus(base, ["Assessment proposal artifact set is incomplete."]);
  }
  let proposal: FitAssessmentProposal;
  let manifest: FitAssessmentProposalManifest;
  try {
    proposal = FitAssessmentProposalSchema.parse(await readJson<unknown>(location.proposalPath, null));
    manifest = FitAssessmentProposalManifestSchema.parse(await readJson<unknown>(location.manifestPath, null));
  } catch (error) {
    return invalidStatus(base, [`Stored assessment proposal is malformed: ${errorMessage(error)}`]);
  }
  const proposalHashMatches = (await hashFile(location.proposalPath)) === manifest.proposalSha256;
  const rawResponseHashMatches = (await hashFile(location.rawPath)) === manifest.rawResponseSha256;
  const invalidReasons: string[] = [];
  if (!proposalHashMatches) invalidReasons.push("Proposal SHA-256 does not match its manifest.");
  if (!rawResponseHashMatches) invalidReasons.push("Raw model response SHA-256 does not match its manifest.");
  if (
    proposal.id !== proposalId || manifest.proposalId !== proposalId ||
    proposal.targetId !== target.id || manifest.targetId !== target.id ||
    proposal.targetType !== target.type || manifest.targetType !== target.type ||
    proposal.mode !== mode || manifest.mode !== mode ||
    manifest.proposalPath !== location.proposalRelativePath || manifest.rawResponsePath !== location.rawRelativePath
  ) invalidReasons.push("Proposal identity, mode, or paths are invalid.");
  if (invalidReasons.length) return invalidStatus(base, invalidReasons, proposalHashMatches, rawResponseHashMatches);
  let context: AssessmentContext;
  try {
    context = await loadAssessmentContext(workspace, target.id);
  } catch (error) {
    return {
      ...base,
      status: "stale",
      readyForReview: false,
      proposalHashMatches,
      rawResponseHashMatches,
      deterministicAssessmentHashMatches: false,
      approvedInterpretationHashMatches: false,
      approvedMatchingHashMatches: false,
      evidenceSnapshotHashMatches: false,
      reasons: [`Current assessment dependencies are unavailable: ${errorMessage(error)}`],
    };
  }
  const deterministicStatus = await getFitAssessmentStatus(workspace, target.id, "deterministic");
  const deterministicAssessmentHashMatches = deterministicStatus.status === "current" &&
    (await hashFile(resolveWithin(workspace, deterministicStatus.assessmentPath))) === manifest.deterministicAssessmentSha256;
  const approvedInterpretationHashMatches = context.approvedInterpretationSha256 === manifest.approvedInterpretationSha256;
  const approvedMatchingHashMatches = context.approvedMatchingSha256 === manifest.approvedMatchingSha256;
  const evidenceSnapshotHashMatches = context.evidenceSnapshotSha256 === manifest.evidenceSnapshotSha256;
  const staleReasons = [
    ...(context.targetSha256 !== manifest.targetSha256 ? ["Target changed."] : []),
    ...(!deterministicAssessmentHashMatches ? ["Deterministic assessment changed or is unavailable."] : []),
    ...(!approvedInterpretationHashMatches ? ["Approved interpretation changed."] : []),
    ...(!approvedMatchingHashMatches ? ["Approved evidence matching changed."] : []),
    ...(!evidenceSnapshotHashMatches ? ["Reviewed evidence snapshot changed."] : []),
    ...(manifest.policyName !== FIT_ASSESSMENT_POLICY_NAME || manifest.policyVersion !== ASSESSMENT_PROPOSAL_POLICY_VERSION ? ["Assessment proposal policy changed."] : []),
    ...(manifest.promptTemplateVersion !== ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_VERSION ? ["Assessment prompt template changed."] : []),
  ];
  return {
    ...base,
    status: staleReasons.length ? "stale" : proposal.status === "validation-failed" ? "invalid" : "current",
    readyForReview: staleReasons.length === 0 && proposal.status === "ready-for-review",
    proposalHashMatches,
    rawResponseHashMatches,
    deterministicAssessmentHashMatches,
    approvedInterpretationHashMatches,
    approvedMatchingHashMatches,
    evidenceSnapshotHashMatches,
    reasons: staleReasons.length ? staleReasons : proposal.validationIssues.map((issue) => issue.message),
  };
}

export async function replayFitAssessmentProposal(
  workspace: string,
  proposalId: string,
): Promise<{ proposalId: string; originalSha256: string; replaySha256: string; matches: boolean }> {
  const status = await getFitAssessmentProposalStatus(workspace, proposalId);
  if (status.status !== "current") throw new Error(`Replay requires a current assessment proposal. Current status: ${status.status}`);
  const located = await locateProposal(workspace, proposalId);
  const original = await showFitAssessmentProposal(workspace, proposalId);
  const manifest = FitAssessmentProposalManifestSchema.parse(await readJson<unknown>(located.location.manifestPath, null));
  const context = await loadAssessmentContext(workspace, original.targetId);
  const deterministic = await showFitAssessment(workspace, original.targetId, "deterministic");
  const replayed = normalizeRawProposal({
    rawText: await readFile(located.location.rawPath, "utf8"),
    proposalId,
    context,
    deterministic,
    deterministicAssessmentSha256: original.input.deterministicAssessmentSha256,
    requestFingerprint: original.requestFingerprint,
    provider: original.model.provider,
    model: original.model.model,
    settings: original.model.settings,
    promptVersion: original.prompt.templateVersion,
    policyVersion: original.prompt.policyVersion,
    renderedPromptSha256: original.prompt.renderedPromptSha256,
    normalizedModelInputSha256: original.input.normalizedModelInputSha256,
    rawResponsePath: original.rawResponsePath,
    rawResponseSha256: original.rawResponseSha256,
    createdAt: original.createdAt,
    updatedAt: original.updatedAt,
  });
  const replaySha256 = hashText(`${JSON.stringify(replayed, null, 2)}\n`);
  return { proposalId, originalSha256: manifest.proposalSha256, replaySha256, matches: replaySha256 === manifest.proposalSha256 };
}

export function renderFitAssessmentPrompt(input: unknown, templateVersion = ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_VERSION, policyVersion = ASSESSMENT_PROPOSAL_POLICY_VERSION): string {
  return [
    `Prompt: ${ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_ID} v${templateVersion}; policy v${policyVersion}`,
    "Interpret only the supplied approved target expectations, approved evidence matching, and deterministic assessment using exact IDs and provenance.",
    "You may propose explanations, visible limitations, conservative gap classifications, evidence-improvement actions, and a summary narrative.",
    "Do not alter approved matching, necessity, importance, trust state, or source provenance.",
    "Never invent candidate capabilities, employers, projects, skills, dates, achievements, metrics, adoption, impact, or evidence.",
    "Never write resume bullets, cover letters, screening answers, hiring predictions, application recommendations, candidate rankings, hidden scores, or fit percentages.",
    "Unsupported means current reviewed evidence does not prove an expectation; it does not prove the candidate lacks the capability.",
    "Assessment confidence concerns the assessment record, not hiring probability.",
    "Return one strict JSON object with proposedExpectationAssessments, proposedSummary, warnings, and ambiguities. Do not use Markdown fences.",
    "INPUT_JSON",
    stableJson(input),
  ].join("\n");
}

export function formatFitAssessmentProposalResult(result: AssessmentProposalGenerationResult): string {
  return [
    `Target ID: ${result.targetId}`,
    `Target type: ${result.targetType}`,
    `Assessment mode: ${result.mode}`,
    `Proposal ID: ${result.proposalId}`,
    `Result: ${result.result}`,
    `Proposal path: ${result.proposalPath}`,
    `Manifest path: ${result.manifestPath}`,
    `Raw response path: ${result.rawResponsePath}`,
    `Proposed expectation assessments: ${result.proposedAssessmentCount}`,
    `Validation issues: ${result.validationIssueCount}`,
    `Request fingerprint: ${result.requestFingerprint}`,
  ].join("\n");
}

export function formatFitAssessmentProposalList(proposals: FitAssessmentProposal[]): string {
  if (!proposals.length) return "Assessment proposals: none";
  return ["Assessment proposals:", ...proposals.map((proposal) => `${proposal.id} | ${proposal.status} | ${proposal.model.model} | ${proposal.createdAt}`)].join("\n");
}

export function formatFitAssessmentProposalStatus(status: AssessmentProposalStatus): string {
  const check = (value: boolean | null): string => value === null ? "not applicable" : value ? "yes" : "no";
  return [
    `Proposal ID: ${status.proposalId}`,
    `Target ID: ${status.targetId}`,
    `Assessment mode: ${status.mode}`,
    `Overall status: ${status.status}`,
    `Ready for review: ${status.readyForReview ? "yes" : "no"}`,
    `Proposal hash matches: ${check(status.proposalHashMatches)}`,
    `Raw response hash matches: ${check(status.rawResponseHashMatches)}`,
    `Deterministic assessment matches: ${check(status.deterministicAssessmentHashMatches)}`,
    `Approved interpretation matches: ${check(status.approvedInterpretationHashMatches)}`,
    `Approved matching matches: ${check(status.approvedMatchingHashMatches)}`,
    `Evidence snapshot matches: ${check(status.evidenceSnapshotHashMatches)}`,
    ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
  ].join("\n");
}

export async function fitAssessmentProposalFileTimestamps(workspace: string, proposalId: string): Promise<{ proposal: number; manifest: number; raw: number }> {
  const located = await locateProposal(workspace, proposalId);
  const [proposal, manifest, raw] = await Promise.all([
    stat(located.location.proposalPath),
    stat(located.location.manifestPath),
    stat(located.location.rawPath),
  ]);
  return { proposal: proposal.mtimeMs, manifest: manifest.mtimeMs, raw: raw.mtimeMs };
}

function normalizeRawProposal(input: {
  rawText: string;
  proposalId: string;
  context: AssessmentContext;
  deterministic: TargetFitAssessment;
  deterministicAssessmentSha256: string;
  requestFingerprint: string;
  provider: string;
  model: string;
  settings: InterpretationModelProvider["settings"];
  promptVersion: string;
  policyVersion: string;
  renderedPromptSha256: string;
  normalizedModelInputSha256: string;
  rawResponsePath: string;
  rawResponseSha256: string;
  createdAt: string;
  updatedAt: string;
}): FitAssessmentProposal {
  const issues: FitAssessmentValidationIssue[] = [];
  let payload: ModelFitAssessmentPayload | undefined;
  try {
    payload = ModelFitAssessmentPayloadSchema.parse(JSON.parse(input.rawText));
  } catch (error) {
    issues.push(...issuesFromError(error));
  }
  if (payload) issues.push(...validatePayload(payload, input.deterministic));
  const proposedExpectationAssessments: ProposedExpectationFitAssessment[] = payload && issues.length === 0
    ? payload.proposedExpectationAssessments.map((entry) => ({
        id: `proposed-assessment_${hashText([input.proposalId, entry.expectationAssessmentId, FIT_ASSESSMENT_POLICY_VERSION].join("\u0000")).slice(0, 14)}`,
        ...entry,
        approvedMatchIds: uniqueSorted(entry.approvedMatchIds),
        evidenceIds: uniqueSorted(entry.evidenceIds),
        trustState: "proposed" as const,
      })).sort((a, b) => a.expectationId.localeCompare(b.expectationId))
    : [];
  const warnings: FitAssessmentWarning[] = payload && issues.length === 0
    ? [
        ...payload.warnings.map((entry, index) => ({ id: `assessment-warning_${hashText(`${input.proposalId}\u0000${index}\u0000${stableJson(entry)}`).slice(0, 12)}`, ...entry })),
        {
          id: `assessment-warning_${hashText(`${input.proposalId}\u0000human-review`).slice(0, 12)}`,
          code: "MODEL_ASSESSMENT_REQUIRES_HUMAN_REVIEW" as const,
          message: "Model-assisted assessment remains a proposal until every item and summary receives human review.",
          expectationIds: [],
          evidenceIds: [],
        },
      ]
    : [];
  const ambiguities: FitAssessmentAmbiguity[] = payload && issues.length === 0
    ? payload.ambiguities.map((entry, index) => ({ id: `assessment-ambiguity_${hashText(`${input.proposalId}\u0000${index}\u0000${stableJson(entry)}`).slice(0, 12)}`, ...entry }))
    : [];
  return FitAssessmentProposalSchema.parse({
    schemaVersion: 1,
    id: input.proposalId,
    requestFingerprint: input.requestFingerprint,
    targetId: input.context.target.id,
    targetType: input.context.target.type,
    mode: input.context.mode,
    status: issues.length ? "validation-failed" : "ready-for-review",
    assessmentPolicy: { name: FIT_ASSESSMENT_POLICY_NAME, version: FIT_ASSESSMENT_POLICY_VERSION },
    model: { provider: input.provider, model: input.model, settings: input.settings },
    prompt: { templateId: ASSESSMENT_PROPOSAL_PROMPT_TEMPLATE_ID, templateVersion: input.promptVersion, policyVersion: input.policyVersion, renderedPromptSha256: input.renderedPromptSha256 },
    input: {
      targetSha256: input.context.targetSha256,
      approvedInterpretationSha256: input.context.approvedInterpretationSha256,
      approvedMatchingSha256: input.context.approvedMatchingSha256,
      evidenceSnapshotSha256: input.context.evidenceSnapshotSha256,
      deterministicAssessmentSha256: input.deterministicAssessmentSha256,
      normalizedModelInputSha256: input.normalizedModelInputSha256,
    },
    proposedExpectationAssessments,
    ...(payload && issues.length === 0 ? { proposedSummary: payload.proposedSummary } : {}),
    warnings,
    ambiguities,
    validationIssues: deduplicateIssues(issues),
    rawResponsePath: input.rawResponsePath,
    rawResponseSha256: input.rawResponseSha256,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  });
}

function validatePayload(payload: ModelFitAssessmentPayload, deterministic: TargetFitAssessment): FitAssessmentValidationIssue[] {
  const issues: FitAssessmentValidationIssue[] = [];
  const deterministicById = new Map(deterministic.expectationAssessments.map((entry) => [entry.id, entry]));
  const expectationIds = new Set<string>();
  payload.proposedExpectationAssessments.forEach((entry, index) => {
    if (expectationIds.has(entry.expectationId)) issues.push(issue("DUPLICATE_EXPECTATION_ASSESSMENT", "Only one proposal is allowed per expectation.", `proposedExpectationAssessments.${index}`));
    expectationIds.add(entry.expectationId);
    const source = deterministicById.get(entry.expectationAssessmentId);
    if (!source || source.expectationId !== entry.expectationId) {
      issues.push(issue("UNKNOWN_EXPECTATION_ID", `Unknown deterministic expectation assessment: ${entry.expectationAssessmentId}`, `proposedExpectationAssessments.${index}`));
      return;
    }
    if (stableJson(entry.provenance) !== stableJson(source.provenance)) issues.push(issue("INVALID_PROVENANCE", "Proposal provenance does not match the deterministic assessment.", `proposedExpectationAssessments.${index}.provenance`));
    if (stableJson(uniqueSorted(entry.approvedMatchIds)) !== stableJson(source.approvedMatchIds)) issues.push(issue("UNKNOWN_MATCH_ID", "Proposal match IDs must exactly preserve approved matching.", `proposedExpectationAssessments.${index}.approvedMatchIds`));
    if (stableJson(uniqueSorted(entry.evidenceIds)) !== stableJson(source.evidenceIds)) issues.push(issue("UNKNOWN_EVIDENCE_ID", "Proposal evidence IDs must exactly preserve reviewed evidence provenance.", `proposedExpectationAssessments.${index}.evidenceIds`));
    validateAssessmentSemantics(entry, source, issues, index);
    const text = [entry.rationale, ...entry.limitations, ...entry.recommendedEvidenceActions.map((action) => action.rationale)].join(" ");
    const forbidden = forbiddenContent(text);
    if (forbidden) issues.push(issue("FORBIDDEN_CONTENT", forbidden, `proposedExpectationAssessments.${index}`));
    const unsupportedNumbers = numericTokens(text).filter((token) => !numericTokens(stableJson(source)).includes(token));
    if (unsupportedNumbers.length) issues.push(issue("INVENTED_METRIC", `Proposal contains unsupported numeric token(s): ${unsupportedNumbers.join(", ")}`, `proposedExpectationAssessments.${index}`));
  });
  if (payload.proposedExpectationAssessments.length !== deterministic.expectationAssessments.length || expectationIds.size !== deterministic.expectationAssessments.length) {
    issues.push(issue("INCOMPLETE_EXPECTATION_SET", "Proposal must contain exactly one assessment for every deterministic expectation."));
  }
  if (payload.proposedSummary.mode !== deterministic.mode) issues.push(issue("MODE_MISMATCH", "Proposed summary mode does not match the target."));
  const summaryForbidden = forbiddenContent(payload.proposedSummary.narrative);
  if (summaryForbidden) issues.push(issue("FORBIDDEN_CONTENT", summaryForbidden, "proposedSummary.narrative"));
  if (/\d+(?:\.\d+)?%\s*(?:fit|match|alignment)?/i.test(payload.proposedSummary.narrative)) issues.push(issue("FIT_PERCENTAGE", "Fit percentages are forbidden.", "proposedSummary.narrative"));
  if (issues.length === 0) {
    try { validateProposedSummary(payload, deterministic); }
    catch (error) { issues.push(issue("SUMMARY_INCONSISTENT", errorMessage(error), "proposedSummary")); }
  }
  return deduplicateIssues(issues);
}

function validateAssessmentSemantics(
  proposed: ModelFitAssessmentPayload["proposedExpectationAssessments"][number],
  source: TargetFitAssessment["expectationAssessments"][number],
  issues: FitAssessmentValidationIssue[],
  index: number,
): void {
  const coverage = source.provenance.deterministicInputs.coverageStatus;
  if (proposed.supportStatus === "strongly-supported") {
    const canBeStrong = coverage === "matched" && source.provenance.deterministicInputs.matchTypes.includes("direct") && source.provenance.deterministicInputs.evidenceStrengths.includes("strong");
    if (!canBeStrong) issues.push(issue("IMPOSSIBLE_SUPPORT_STATUS", "Strong support requires approved direct strong evidence.", `proposedExpectationAssessments.${index}.supportStatus`));
  }
  if (proposed.supportStatus === "unsupported" && proposed.approvedMatchIds.length) issues.push(issue("IMPOSSIBLE_SUPPORT_STATUS", "Unsupported cannot retain approved supporting matches.", `proposedExpectationAssessments.${index}.supportStatus`));
  if (proposed.supportStatus === "conflicting" && !source.provenance.deterministicInputs.matchTypes.includes("contradictory")) issues.push(issue("IMPOSSIBLE_SUPPORT_STATUS", "Conflict requires approved contradictory evidence.", `proposedExpectationAssessments.${index}.supportStatus`));
  if (proposed.supportStatus === "not-assessed" && coverage !== "not-assessed") issues.push(issue("IMPOSSIBLE_SUPPORT_STATUS", "Not-assessed requires not-assessed approved coverage.", `proposedExpectationAssessments.${index}.supportStatus`));
  if (proposed.gapType === "experience-gap-possible" && !/possible|unclear|may|cannot confirm/i.test(`${proposed.rationale} ${proposed.limitations.join(" ")}`)) issues.push(issue("DEFINITE_EXPERIENCE_GAP", "Possible experience gaps must preserve uncertainty.", `proposedExpectationAssessments.${index}.gapType`));
}

function validateProposedSummary(payload: ModelFitAssessmentPayload, deterministic: TargetFitAssessment): void {
  const byExpectation = new Map(deterministic.expectationAssessments.map((entry) => [entry.expectationId, entry]));
  const merged = payload.proposedExpectationAssessments.map((entry) => {
    const source = byExpectation.get(entry.expectationId);
    if (!source) throw new Error(`Unknown expectation: ${entry.expectationId}`);
    return { ...source, ...entry, id: source.id, expectation: source.expectation, trustState: source.trustState };
  });
  if (payload.proposedSummary.mode === "role-positioning") {
    const counts = statusCounts(merged);
    if (
      payload.proposedSummary.stronglySupportedCount !== counts.stronglySupported ||
      payload.proposedSummary.supportedCount !== counts.supported ||
      payload.proposedSummary.partiallySupportedCount !== counts.partiallySupported ||
      payload.proposedSummary.unsupportedCount !== counts.unsupported ||
      payload.proposedSummary.conflictingCount !== counts.conflicting ||
      payload.proposedSummary.notAssessedCount !== counts.notAssessed
    ) throw new Error("Role summary counts do not match proposed expectation assessments.");
    return;
  }
  const groups = [
    [payload.proposedSummary.requiredExpectationSummary, merged.filter((entry) => entry.expectation.necessity === "required")],
    [payload.proposedSummary.preferredExpectationSummary, merged.filter((entry) => entry.expectation.necessity === "preferred")],
    [payload.proposedSummary.contextualExpectationSummary, merged.filter((entry) => !["required", "preferred"].includes(entry.expectation.necessity))],
  ] as const;
  for (const [summary, entries] of groups) {
    const counts = statusCounts(entries);
    const expected = { total: entries.length, stronglySupported: counts.stronglySupported, supported: counts.supported, partiallySupported: counts.partiallySupported, unsupported: counts.unsupported, conflicting: counts.conflicting, notAssessed: counts.notAssessed };
    if (stableJson(summary) !== stableJson(expected)) throw new Error("Job summary counts do not match proposed expectation assessments.");
  }
}

function forbiddenContent(text: string): string | undefined {
  const checks: Array<[RegExp, string]> = [
    [/\b(resume bullet|resume wording|cover letter|screening answer|curriculum vitae)\b/i, "Output contains resume or application writing."],
    [/\b(should|recommend)\s+(apply|hire|interview)\b/i, "Output contains an application or hiring recommendation."],
    [/\b(hiring|acceptance|ATS)\s+(probability|chance|likelihood|score)\b/i, "Output contains a hiring or ATS prediction."],
    [/\b(fit score|percentage fit|overall fit|good fit|strong fit|poor fit)\b/i, "Output contains forbidden aggregate fit language."],
    [/\b(increased|grew|achieved|delivered)\s+(revenue|users|adoption|performance|conversion)\b/i, "Output invents or strengthens an unsupported achievement."],
    [/\b(definitely|clearly)\s+(lacks|has no)\s+(experience|capability|skill)\b/i, "Output treats missing evidence as definite missing capability."],
  ];
  return checks.find(([pattern]) => pattern.test(text))?.[1];
}

async function findCached(workspace: string, targetId: string, fingerprint: string): Promise<{ proposal: FitAssessmentProposal; location: ProposalLocation } | undefined> {
  for (const proposal of await listFitAssessmentProposals(workspace, targetId)) {
    if (proposal.requestFingerprint !== fingerprint || proposal.status !== "ready-for-review") continue;
    const status = await getFitAssessmentProposalStatus(workspace, proposal.id);
    if (status.status === "current") return { proposal, location: (await locateProposal(workspace, proposal.id)).location };
  }
  return undefined;
}

async function locateProposal(workspace: string, proposalId: string): Promise<{ target: Target; location: ProposalLocation }> {
  if (!/^assessment-proposal_[a-f0-9]+$/.test(proposalId)) throw new Error(`Invalid assessment proposal ID: ${proposalId}`);
  const files = (await walkFiles(path.join(workspace, "targets"))).filter((file) => path.basename(file) === PROPOSAL_FILE && path.basename(path.dirname(file)) === proposalId && path.basename(path.dirname(path.dirname(file))) === "proposals");
  if (!files.length) throw new Error(`Assessment proposal not found: ${proposalId}`);
  if (files.length > 1) throw new Error(`Assessment proposal ID is ambiguous: ${proposalId}`);
  const proposal = FitAssessmentProposalSchema.parse(await readJson<unknown>(files[0], null));
  const target = await showTarget(workspace, proposal.targetId);
  return { target, location: proposalLocation(workspace, target, proposalId) };
}

function proposalLocation(workspace: string, target: Target, proposalId: string): ProposalLocation {
  const root = `${targetRoot(target)}/assessment/proposals/${proposalId}`;
  const proposalRelativePath = `${root}/${PROPOSAL_FILE}`;
  const manifestRelativePath = `${root}/${MANIFEST_FILE}`;
  const rawRelativePath = `${root}/${RAW_FILE}`;
  return {
    proposalRelativePath,
    proposalPath: resolveWithin(workspace, proposalRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
    rawRelativePath,
    rawPath: resolveWithin(workspace, rawRelativePath),
  };
}

async function countProposals(workspace: string, target: Target): Promise<number> {
  return (await walkFiles(path.join(workspace, `${targetRoot(target)}/assessment/proposals`))).filter((file) => path.basename(file) === PROPOSAL_FILE).length;
}

function resultFromProposal(proposal: FitAssessmentProposal, location: ProposalLocation, result: AssessmentProposalGenerationResult["result"]): AssessmentProposalGenerationResult {
  return {
    targetId: proposal.targetId,
    targetType: proposal.targetType,
    mode: proposal.mode,
    proposalId: proposal.id,
    result,
    proposalPath: location.proposalRelativePath,
    manifestPath: location.manifestRelativePath,
    rawResponsePath: location.rawRelativePath,
    proposedAssessmentCount: proposal.proposedExpectationAssessments.length,
    validationIssueCount: proposal.validationIssues.length,
    requestFingerprint: proposal.requestFingerprint,
  };
}

function invalidStatus(
  base: Pick<AssessmentProposalStatus, "proposalId" | "targetId" | "targetType" | "mode" | "proposalPath" | "manifestPath" | "rawResponsePath">,
  reasons: string[],
  proposalHashMatches: boolean | null = null,
  rawResponseHashMatches: boolean | null = null,
): AssessmentProposalStatus {
  return { ...base, status: "invalid", readyForReview: false, proposalHashMatches, rawResponseHashMatches, deterministicAssessmentHashMatches: null, approvedInterpretationHashMatches: null, approvedMatchingHashMatches: null, evidenceSnapshotHashMatches: null, reasons };
}

function statusCounts(entries: Array<{ supportStatus: string }>) {
  return entries.reduce((counts, entry) => {
    if (entry.supportStatus === "strongly-supported") counts.stronglySupported += 1;
    else if (entry.supportStatus === "supported") counts.supported += 1;
    else if (entry.supportStatus === "partially-supported") counts.partiallySupported += 1;
    else if (entry.supportStatus === "unsupported") counts.unsupported += 1;
    else if (entry.supportStatus === "conflicting") counts.conflicting += 1;
    else counts.notAssessed += 1;
    return counts;
  }, { stronglySupported: 0, supported: 0, partiallySupported: 0, unsupported: 0, conflicting: 0, notAssessed: 0 });
}

function targetRoot(target: Target): string {
  return `targets/${target.type === "role" ? "roles" : "jobs"}/${target.id}`;
}

function resolveWithin(workspace: string, relativePath: string): string {
  const resolved = path.resolve(workspace, relativePath);
  const relation = path.relative(path.resolve(workspace), resolved);
  if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) throw new Error(`Assessment proposal path escapes workspace: ${relativePath}`);
  return resolved;
}

function numericTokens(text: string): string[] {
  return text.match(/\b\d+(?:\.\d+)?%?\b/g) ?? [];
}

function issuesFromError(error: unknown): FitAssessmentValidationIssue[] {
  if (error instanceof SyntaxError) return [issue("MALFORMED_JSON", "Model response is not valid JSON.")];
  if (error instanceof z.ZodError) return error.issues.map((entry) => issue("SCHEMA_MISMATCH", entry.message, entry.path.join(".")));
  return [issue("INVALID_RESPONSE", errorMessage(error))];
}

function issue(code: string, message: string, issuePath?: string): FitAssessmentValidationIssue {
  return { code, message, ...(issuePath ? { path: issuePath } : {}) };
}

function deduplicateIssues(issues: FitAssessmentValidationIssue[]): FitAssessmentValidationIssue[] {
  return [...new Map(issues.map((entry) => [`${entry.code}|${entry.path ?? ""}|${entry.message}`, entry])).values()]
    .sort((a, b) => `${a.code}|${a.path ?? ""}`.localeCompare(`${b.code}|${b.path ?? ""}`));
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
