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
  InterpretationProposalManifestSchema,
  ModelInterpretationPayloadSchema,
  TargetInterpretationProposalSchema,
  type InterpretationAmbiguity,
  type InterpretationProposalManifest,
  type InterpretationWarning,
  type ModelInterpretationPayload,
  type ProposalValidationIssue,
  type ProposedExpectation,
  type ProposedExpectationGroup,
  type Target,
  type TargetAnalysis,
  type TargetInterpretation,
  type TargetInterpretationProposal,
  type TargetInterpretationSourceReference,
} from "./schemas.js";
import {
  createModelProviderFromEnvironment,
  type InterpretationModelProvider,
} from "./model-provider.js";
import { getTargetAnalysisStatus, showTargetAnalysis } from "./target-analysis.js";
import {
  getTargetInterpretationStatus,
  showTargetInterpretation,
} from "./target-interpretation.js";
import { showTarget } from "./targets.js";

export const PROPOSAL_PROMPT_TEMPLATE_ID = "target-interpretation-proposal";
export const PROPOSAL_PROMPT_TEMPLATE_VERSION = "1";
export const PROPOSAL_POLICY_VERSION = "1";

const PROPOSAL_FILE = "proposal.json";
const PROPOSAL_MANIFEST_FILE = "proposal-manifest.json";
const RAW_RESPONSE_FILE = "raw-model-response.txt";

interface ProposalDependencies {
  target: Target;
  targetPath: string;
  targetSha256: string;
  analysis: TargetAnalysis;
  analysisPath: string;
  analysisSha256: string;
  interpretation: TargetInterpretation;
  interpretationPath: string;
  interpretationSha256: string;
  roleProfileSha256?: string;
}

export interface ProposalGenerationOptions {
  provider?: InterpretationModelProvider;
  environment?: NodeJS.ProcessEnv;
  refresh?: boolean;
  now?: () => Date;
  promptTemplateVersion?: string;
  policyVersion?: string;
}

export interface ProposalGenerationResult {
  targetId: string;
  targetType: "role" | "job";
  proposalId: string;
  result: "created" | "cache-hit" | "validation-failed";
  proposalPath: string;
  manifestPath: string;
  rawResponsePath: string;
  proposedExpectationCount: number;
  validationIssueCount: number;
  requestFingerprint: string;
}

export interface ProposalStatus {
  proposalId: string;
  targetId: string;
  targetType: "role" | "job";
  proposalExists: boolean;
  manifestExists: boolean;
  rawResponseExists: boolean;
  proposalHashMatches: boolean | null;
  rawResponseHashMatches: boolean | null;
  targetHashMatches: boolean | null;
  structuralAnalysisHashMatches: boolean | null;
  deterministicInterpretationHashMatches: boolean | null;
  roleProfileHashMatches: boolean | null;
  status: "current" | "stale" | "invalid";
  readyForReview: boolean;
  reasons: string[];
  proposalPath: string;
  manifestPath: string;
  rawResponsePath: string;
}

export interface ProposalListEntry {
  proposalId: string;
  targetId: string;
  status: ProposalStatus["status"];
  proposalStatus: TargetInterpretationProposal["status"];
  model: string;
  createdAt: string;
}

interface ProposalLocation {
  rootRelativePath: string;
  rootPath: string;
  proposalRelativePath: string;
  proposalPath: string;
  manifestRelativePath: string;
  manifestPath: string;
  rawResponseRelativePath: string;
  rawResponsePath: string;
}

export async function generateInterpretationProposal(
  workspace: string,
  targetId: string,
  options: ProposalGenerationOptions = {},
): Promise<ProposalGenerationResult> {
  const dependencies = await loadCurrentDependencies(workspace, targetId);
  if (dependencies.target.type === "role" && !dependencies.roleProfileSha256) {
    throw new Error("Role proposal generation requires a current deterministic interpretation backed by a Role Profile.");
  }
  const provider = options.provider ?? createModelProviderFromEnvironment(options.environment);
  const promptVersion = options.promptTemplateVersion ?? PROPOSAL_PROMPT_TEMPLATE_VERSION;
  const policyVersion = options.policyVersion ?? PROPOSAL_POLICY_VERSION;
  const normalizedInput = normalizedModelInput(dependencies);
  const normalizedModelInputSha256 = hashText(stableJson(normalizedInput));
  const renderedPrompt = renderProposalPrompt(normalizedInput, promptVersion, policyVersion);
  const renderedPromptSha256 = hashText(renderedPrompt);
  const requestFingerprint = hashText(stableJson({
    targetSha256: dependencies.targetSha256,
    structuralAnalysisSha256: dependencies.analysisSha256,
    deterministicInterpretationSha256: dependencies.interpretationSha256,
    roleProfileSha256: dependencies.roleProfileSha256 ?? null,
    provider: provider.providerId,
    model: provider.identity.model,
    settings: provider.settings,
    promptTemplateId: PROPOSAL_PROMPT_TEMPLATE_ID,
    promptTemplateVersion: promptVersion,
    policyVersion,
    normalizedModelInputSha256,
  }));

  if (!options.refresh) {
    const cached = await findCachedProposal(workspace, targetId, requestFingerprint);
    if (cached) {
      const proposal = await showInterpretationProposal(workspace, cached.proposalId);
      return resultFromProposal(proposal, cached.location, "cache-hit");
    }
  }

  const response = await provider.generate({ renderedPrompt, settings: provider.settings });
  if (response.rawText.length === 0) throw new Error("Model provider returned an empty response.");
  const rawBytes = Buffer.from(response.rawText, "utf8");
  const rawResponseSha256 = hashBuffer(rawBytes);
  const now = (options.now ?? (() => new Date()))().toISOString();
  const proposalCount = await countTargetProposals(workspace, dependencies.target);
  const proposalId = `proposal_${hashText([
    requestFingerprint,
    rawResponseSha256,
    now,
    String(proposalCount),
  ].join("\u0000")).slice(0, 16)}`;
  const location = proposalLocation(workspace, dependencies.target, proposalId);
  const normalized = normalizeRawProposal({
    rawText: response.rawText,
    proposalId,
    targetId,
    targetType: dependencies.target.type,
    requestFingerprint,
    provider: provider.providerId,
    model: provider.identity.model,
    settings: provider.settings,
    promptVersion,
    policyVersion,
    renderedPromptSha256,
    dependencies,
    normalizedModelInputSha256,
    rawResponsePath: location.rawResponseRelativePath,
    rawResponseSha256,
    createdAt: now,
    updatedAt: now,
  });

  await writeBufferAtomic(location.rawResponsePath, rawBytes);
  await writeJsonAtomic(location.proposalPath, normalized);
  const proposalSha256 = await hashFile(location.proposalPath);
  const manifest = InterpretationProposalManifestSchema.parse({
    schemaVersion: 1,
    proposalId,
    requestFingerprint,
    targetId,
    targetType: dependencies.target.type,
    proposalPath: location.proposalRelativePath,
    proposalSha256,
    rawResponsePath: location.rawResponseRelativePath,
    rawResponseSha256,
    provider: provider.providerId,
    model: provider.identity.model,
    promptTemplateId: PROPOSAL_PROMPT_TEMPLATE_ID,
    promptTemplateVersion: promptVersion,
    policyVersion,
    renderedPromptSha256,
    targetSha256: dependencies.targetSha256,
    structuralAnalysisSha256: dependencies.analysisSha256,
    deterministicInterpretationSha256: dependencies.interpretationSha256,
    ...(dependencies.roleProfileSha256
      ? { roleProfileSha256: dependencies.roleProfileSha256 }
      : {}),
    normalizedModelInputSha256,
    createdAt: now,
    updatedAt: now,
  });
  await writeJsonAtomic(location.manifestPath, manifest);
  return resultFromProposal(
    normalized,
    location,
    normalized.status === "ready-for-review" ? "created" : "validation-failed",
  );
}

export async function replayInterpretationProposal(
  workspace: string,
  proposalId: string,
): Promise<{ proposalId: string; originalSha256: string; replaySha256: string; matches: boolean }> {
  const located = await locateProposal(workspace, proposalId);
  const status = await getInterpretationProposalStatus(workspace, proposalId);
  if (status.status !== "current") {
    throw new Error(`Proposal replay requires current dependencies. Current status: ${status.status}`);
  }
  const proposal = await showInterpretationProposal(workspace, proposalId);
  const manifest = InterpretationProposalManifestSchema.parse(
    await readJson<unknown>(located.location.manifestPath, null),
  );
  const dependencies = await loadCurrentDependencies(workspace, proposal.targetId);
  const rawText = await readFile(located.location.rawResponsePath, "utf8");
  const replayed = normalizeRawProposal({
    rawText,
    proposalId,
    targetId: proposal.targetId,
    targetType: proposal.targetType,
    requestFingerprint: proposal.requestFingerprint,
    provider: proposal.model.provider,
    model: proposal.model.model,
    settings: proposal.model.settings,
    promptVersion: proposal.prompt.templateVersion,
    policyVersion: proposal.prompt.policyVersion,
    renderedPromptSha256: proposal.prompt.renderedPromptSha256,
    dependencies,
    normalizedModelInputSha256: proposal.input.normalizedModelInputSha256,
    rawResponsePath: proposal.rawResponsePath,
    rawResponseSha256: proposal.rawResponseSha256,
    createdAt: proposal.createdAt,
    updatedAt: proposal.updatedAt,
  });
  const replaySha256 = hashText(`${JSON.stringify(replayed, null, 2)}\n`);
  return {
    proposalId,
    originalSha256: manifest.proposalSha256,
    replaySha256,
    matches: replaySha256 === manifest.proposalSha256,
  };
}

export async function showInterpretationProposal(
  workspace: string,
  proposalId: string,
): Promise<TargetInterpretationProposal> {
  const located = await locateProposal(workspace, proposalId);
  return TargetInterpretationProposalSchema.parse(
    await readJson<unknown>(located.location.proposalPath, null),
  );
}

export async function listInterpretationProposals(
  workspace: string,
  targetId: string,
): Promise<ProposalListEntry[]> {
  const target = await showTarget(workspace, targetId);
  const root = targetRoot(target);
  const files = (await walkFiles(path.join(workspace, root, "interpretation", "proposals")))
    .filter((file) => path.basename(file) === PROPOSAL_FILE);
  const entries: ProposalListEntry[] = [];
  for (const file of files) {
    const proposal = TargetInterpretationProposalSchema.parse(await readJson<unknown>(file, null));
    const status = await getInterpretationProposalStatus(workspace, proposal.id);
    entries.push({
      proposalId: proposal.id,
      targetId: proposal.targetId,
      status: status.status,
      proposalStatus: proposal.status,
      model: proposal.model.model,
      createdAt: proposal.createdAt,
    });
  }
  return entries.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.proposalId.localeCompare(b.proposalId));
}

export async function getInterpretationProposalStatus(
  workspace: string,
  proposalId: string,
): Promise<ProposalStatus> {
  const located = await locateProposal(workspace, proposalId);
  const location = located.location;
  const base = {
    proposalId,
    targetId: located.target.id,
    targetType: located.target.type,
    proposalPath: location.proposalRelativePath,
    manifestPath: location.manifestRelativePath,
    rawResponsePath: location.rawResponseRelativePath,
  } as const;
  const proposalExists = await pathExists(location.proposalPath);
  const manifestExists = await pathExists(location.manifestPath);
  const rawResponseExists = await pathExists(location.rawResponsePath);
  if (!proposalExists || !manifestExists || !rawResponseExists) {
    return {
      ...base,
      proposalExists,
      manifestExists,
      rawResponseExists,
      proposalHashMatches: null,
      rawResponseHashMatches: null,
      targetHashMatches: null,
      structuralAnalysisHashMatches: null,
      deterministicInterpretationHashMatches: null,
      roleProfileHashMatches: null,
      status: "invalid",
      readyForReview: false,
      reasons: ["Proposal artifact set is incomplete."],
    };
  }
  let proposal: TargetInterpretationProposal;
  let manifest: InterpretationProposalManifest;
  try {
    proposal = TargetInterpretationProposalSchema.parse(
      await readJson<unknown>(location.proposalPath, null),
    );
    manifest = InterpretationProposalManifestSchema.parse(
      await readJson<unknown>(location.manifestPath, null),
    );
  } catch (error) {
    return invalidStatus(base, proposalExists, manifestExists, rawResponseExists, [
      `Stored proposal data is invalid: ${errorMessage(error)}`,
    ]);
  }
  const reasons: string[] = [];
  const proposalHashMatches = (await hashFile(location.proposalPath)) === manifest.proposalSha256;
  const rawResponseHashMatches = (await hashFile(location.rawResponsePath)) === manifest.rawResponseSha256;
  if (!proposalHashMatches) reasons.push("Proposal SHA-256 does not match its manifest.");
  if (!rawResponseHashMatches) reasons.push("Raw response SHA-256 does not match its manifest.");
  if (
    proposal.id !== proposalId ||
    manifest.proposalId !== proposalId ||
    proposal.targetId !== located.target.id ||
    manifest.targetId !== located.target.id ||
    proposal.rawResponsePath !== location.rawResponseRelativePath ||
    manifest.proposalPath !== location.proposalRelativePath ||
    manifest.rawResponsePath !== location.rawResponseRelativePath
  ) {
    reasons.push("Proposal identity or artifact paths disagree with the manifest.");
  }
  if (reasons.length > 0) {
    return invalidStatus(
      base,
      proposalExists,
      manifestExists,
      rawResponseExists,
      reasons,
      proposalHashMatches,
      rawResponseHashMatches,
    );
  }
  let dependencies: ProposalDependencies;
  try {
    dependencies = await loadCurrentDependencies(workspace, proposal.targetId);
  } catch (error) {
    return {
      ...base,
      proposalExists,
      manifestExists,
      rawResponseExists,
      proposalHashMatches,
      rawResponseHashMatches,
      targetHashMatches: false,
      structuralAnalysisHashMatches: false,
      deterministicInterpretationHashMatches: false,
      roleProfileHashMatches: proposal.input.roleProfileSha256 ? false : null,
      status: "stale",
      readyForReview: false,
      reasons: [`Upstream dependency is not current: ${errorMessage(error)}`],
    };
  }
  const targetHashMatches = dependencies.targetSha256 === manifest.targetSha256;
  const structuralAnalysisHashMatches = dependencies.analysisSha256 === manifest.structuralAnalysisSha256;
  const deterministicInterpretationHashMatches =
    dependencies.interpretationSha256 === manifest.deterministicInterpretationSha256;
  const roleProfileHashMatches = manifest.roleProfileSha256
    ? dependencies.roleProfileSha256 === manifest.roleProfileSha256
    : null;
  const staleReasons = [
    ...(!targetHashMatches ? ["Target hash changed."] : []),
    ...(!structuralAnalysisHashMatches ? ["Structural analysis hash changed."] : []),
    ...(!deterministicInterpretationHashMatches ? ["Deterministic interpretation hash changed."] : []),
    ...(roleProfileHashMatches === false ? ["Role Profile hash changed."] : []),
    ...(manifest.promptTemplateVersion !== PROPOSAL_PROMPT_TEMPLATE_VERSION
      ? ["Proposal prompt template version changed."]
      : []),
    ...(manifest.policyVersion !== PROPOSAL_POLICY_VERSION
      ? ["Proposal validation policy version changed."]
      : []),
  ];
  return {
    ...base,
    proposalExists,
    manifestExists,
    rawResponseExists,
    proposalHashMatches,
    rawResponseHashMatches,
    targetHashMatches,
    structuralAnalysisHashMatches,
    deterministicInterpretationHashMatches,
    roleProfileHashMatches,
    status: staleReasons.length > 0 ? "stale" : proposal.status === "validation-failed" ? "invalid" : "current",
    readyForReview: staleReasons.length === 0 && proposal.status === "ready-for-review",
    reasons: staleReasons.length > 0
      ? staleReasons
      : proposal.validationIssues.map((issue) => issue.message),
  };
}

export function formatProposalGenerationResult(result: ProposalGenerationResult): string {
  return [
    `Target ID: ${result.targetId}`,
    `Target type: ${result.targetType}`,
    `Proposal ID: ${result.proposalId}`,
    `Result: ${result.result}`,
    `Proposal path: ${result.proposalPath}`,
    `Manifest path: ${result.manifestPath}`,
    `Raw response path: ${result.rawResponsePath}`,
    `Proposed expectations: ${result.proposedExpectationCount}`,
    `Validation issues: ${result.validationIssueCount}`,
    `Request fingerprint: ${result.requestFingerprint}`,
  ].join("\n");
}

export function formatProposalList(entries: ProposalListEntry[]): string {
  if (entries.length === 0) return "Proposals: none";
  return [
    "Proposals:",
    ...entries.map((entry) => [
      entry.proposalId,
      entry.proposalStatus,
      entry.status,
      entry.model,
      entry.createdAt,
    ].join(" | ")),
  ].join("\n");
}

export function formatProposalStatus(status: ProposalStatus): string {
  const check = (value: boolean | null): string => value === null ? "not applicable" : value ? "yes" : "no";
  return [
    `Proposal ID: ${status.proposalId}`,
    `Target ID: ${status.targetId}`,
    `Overall status: ${status.status}`,
    `Ready for review: ${status.readyForReview ? "yes" : "no"}`,
    `Proposal hash matches: ${check(status.proposalHashMatches)}`,
    `Raw response hash matches: ${check(status.rawResponseHashMatches)}`,
    `Target hash matches: ${check(status.targetHashMatches)}`,
    `Structural analysis hash matches: ${check(status.structuralAnalysisHashMatches)}`,
    `Deterministic interpretation hash matches: ${check(status.deterministicInterpretationHashMatches)}`,
    `Role Profile hash matches: ${check(status.roleProfileHashMatches)}`,
    ...(status.reasons.length > 0 ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
  ].join("\n");
}

export function renderProposalPrompt(
  normalizedInput: unknown,
  templateVersion = PROPOSAL_PROMPT_TEMPLATE_VERSION,
  policyVersion = PROPOSAL_POLICY_VERSION,
): string {
  return [
    `Prompt: ${PROPOSAL_PROMPT_TEMPLATE_ID} v${templateVersion}; policy v${policyVersion}`,
    "Interpret only the supplied target knowledge. Never evaluate a candidate or use candidate evidence.",
    "Return one strict JSON object with proposedExpectations, proposedGroups, proposedAmbiguities, and warnings.",
    "Every proposed expectation must preserve valid sourceExpectationIds or sourceAnalysisItemIds and exact sourceReferences.",
    "Do not write resume language, fit language, strengths, weaknesses, hiring advice, or application recommendations.",
    "Keep explicitness, uncertainty, interpretation confidence, rationale, and ambiguity visible.",
    "Capability tags must be unique lowercase slug-safe values.",
    "Proposed groups use zero-based expectationIndexes into proposedExpectations.",
    "Do not wrap the JSON in Markdown fences.",
    "INPUT_JSON",
    stableJson(normalizedInput),
  ].join("\n");
}

export function stableJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, sortValue(entry)]),
    );
  }
  return value;
}

function normalizedModelInput(dependencies: ProposalDependencies): unknown {
  return {
    target: dependencies.target,
    structuralAnalysis: dependencies.analysis,
    deterministicInterpretation: dependencies.interpretation,
  };
}

function normalizeRawProposal(input: {
  rawText: string;
  proposalId: string;
  targetId: string;
  targetType: "role" | "job";
  requestFingerprint: string;
  provider: string;
  model: string;
  settings: InterpretationModelProvider["settings"];
  promptVersion: string;
  policyVersion: string;
  renderedPromptSha256: string;
  dependencies: ProposalDependencies;
  normalizedModelInputSha256: string;
  rawResponsePath: string;
  rawResponseSha256: string;
  createdAt: string;
  updatedAt: string;
}): TargetInterpretationProposal {
  const issues: ProposalValidationIssue[] = [];
  let payload: ModelInterpretationPayload | undefined;
  try {
    payload = ModelInterpretationPayloadSchema.parse(JSON.parse(input.rawText));
  } catch (error) {
    issues.push(...issuesFromError(error));
  }
  if (payload) issues.push(...validatePayload(payload, input.dependencies));
  const proposedExpectations: ProposedExpectation[] = payload && issues.length === 0
    ? payload.proposedExpectations.map((expectation, index) => ({
        id: `proposed_${hashText(`${input.proposalId}\u0000${index}\u0000${stableJson(expectation)}`).slice(0, 14)}`,
        ...expectation,
        capabilityTags: [...new Set(expectation.capabilityTags)].sort((a, b) => a.localeCompare(b)),
        trustState: "proposed" as const,
      }))
    : [];
  const proposedGroups: ProposedExpectationGroup[] = payload && issues.length === 0
    ? payload.proposedGroups.map((group, index) => ({
        id: `proposed-group_${hashText(`${input.proposalId}\u0000${index}\u0000${stableJson(group)}`).slice(0, 12)}`,
        kind: group.kind,
        title: group.title,
        expectationIds: group.expectationIndexes.map((entry) => proposedExpectations[entry]?.id as string),
        sourceReferences: group.sourceReferences,
      }))
    : [];
  const proposedAmbiguities: InterpretationAmbiguity[] = payload && issues.length === 0
    ? payload.proposedAmbiguities.map((entry, index) => ({
        id: `proposed-ambiguity_${hashText(`${input.proposalId}\u0000${index}\u0000${stableJson(entry)}`).slice(0, 12)}`,
        ...entry,
      }))
    : [];
  const warnings: InterpretationWarning[] = payload && issues.length === 0
    ? payload.warnings.map((entry, index) => ({
        id: `proposed-warning_${hashText(`${input.proposalId}\u0000${index}\u0000${stableJson(entry)}`).slice(0, 12)}`,
        ...entry,
      }))
    : [];
  return TargetInterpretationProposalSchema.parse({
    schemaVersion: 1,
    id: input.proposalId,
    requestFingerprint: input.requestFingerprint,
    targetId: input.targetId,
    targetType: input.targetType,
    status: issues.length === 0 ? "ready-for-review" : "validation-failed",
    model: { provider: input.provider, model: input.model, settings: input.settings },
    prompt: {
      templateId: PROPOSAL_PROMPT_TEMPLATE_ID,
      templateVersion: input.promptVersion,
      policyVersion: input.policyVersion,
      renderedPromptSha256: input.renderedPromptSha256,
    },
    input: {
      targetSha256: input.dependencies.targetSha256,
      structuralAnalysisSha256: input.dependencies.analysisSha256,
      deterministicInterpretationSha256: input.dependencies.interpretationSha256,
      ...(input.dependencies.roleProfileSha256
        ? { roleProfileSha256: input.dependencies.roleProfileSha256 }
        : {}),
      normalizedModelInputSha256: input.normalizedModelInputSha256,
    },
    proposedExpectations,
    proposedGroups,
    proposedAmbiguities,
    warnings,
    validationIssues: issues,
    rawResponsePath: input.rawResponsePath,
    rawResponseSha256: input.rawResponseSha256,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  });
}

function validatePayload(
  payload: ModelInterpretationPayload,
  dependencies: ProposalDependencies,
): ProposalValidationIssue[] {
  const issues: ProposalValidationIssue[] = [];
  const analysisItems = new Map(dependencies.analysis.items.map((item) => [item.id, item]));
  const expectations = new Map(dependencies.interpretation.expectations.map((item) => [item.id, item]));
  const allReferences = new Set([
    ...dependencies.analysis.items.flatMap((item) => item.sourceReferences.map(referenceKey)),
    ...dependencies.interpretation.expectations.flatMap((item) => item.sourceReferences.map(referenceKey)),
  ]);
  payload.proposedExpectations.forEach((expectation, index) => {
    for (const id of expectation.sourceAnalysisItemIds) {
      if (!analysisItems.has(id)) issues.push(issue("UNSUPPORTED_SOURCE_ID", `Unknown source analysis item: ${id}`, `proposedExpectations.${index}`));
    }
    for (const id of expectation.sourceExpectationIds) {
      if (!expectations.has(id)) issues.push(issue("UNSUPPORTED_SOURCE_ID", `Unknown source expectation: ${id}`, `proposedExpectations.${index}`));
    }
    for (const reference of expectation.sourceReferences) {
      if (!allReferences.has(referenceKey(reference))) {
        issues.push(issue("INVALID_PROVENANCE", "Source reference is not present in current upstream artifacts.", `proposedExpectations.${index}.sourceReferences`));
      }
      if (path.isAbsolute(reference.path)) {
        issues.push(issue("ABSOLUTE_PATH", "Source references must use workspace-relative paths.", `proposedExpectations.${index}.sourceReferences`));
      }
    }
    const forbidden = forbiddenContent([
      expectation.statement,
      expectation.rationale,
      ...expectation.ambiguityNotes,
    ].join(" "));
    if (forbidden) issues.push(issue("FORBIDDEN_CONTENT", forbidden, `proposedExpectations.${index}`));
  });
  payload.proposedGroups.forEach((group, index) => {
    for (const expectationIndex of group.expectationIndexes) {
      if (!payload.proposedExpectations[expectationIndex]) {
        issues.push(issue("INVALID_GROUP_MEMBER", `Unknown proposed expectation index: ${expectationIndex}`, `proposedGroups.${index}`));
      }
    }
    for (const reference of group.sourceReferences) {
      if (!allReferences.has(referenceKey(reference))) {
        issues.push(issue("INVALID_PROVENANCE", "Group source reference is not present upstream.", `proposedGroups.${index}.sourceReferences`));
      }
    }
  });
  for (const [collectionName, entries] of [
    ["proposedAmbiguities", payload.proposedAmbiguities],
    ["warnings", payload.warnings],
  ] as const) {
    entries.forEach((entry, index) => {
      for (const id of entry.sourceAnalysisItemIds) {
        if (!analysisItems.has(id)) issues.push(issue("UNSUPPORTED_SOURCE_ID", `Unknown source analysis item: ${id}`, `${collectionName}.${index}`));
      }
      for (const reference of entry.sourceReferences) {
        if (!allReferences.has(referenceKey(reference))) {
          issues.push(issue("INVALID_PROVENANCE", "Source reference is not present upstream.", `${collectionName}.${index}.sourceReferences`));
        }
      }
      const forbidden = forbiddenContent(entry.message);
      if (forbidden) issues.push(issue("FORBIDDEN_CONTENT", forbidden, `${collectionName}.${index}`));
    });
  }
  return deduplicateIssues(issues);
}

function forbiddenContent(text: string): string | undefined {
  const checks: Array<[RegExp, string]> = [
    [/\bahmed\b/i, "Model output mentions the candidate by name."],
    [/\b(candidate|applicant)\s+(is|has|lacks|matches|fits|should)\b/i, "Model output evaluates a candidate."],
    [/\b(fit score|candidate fit|proof readiness|hiring probability)\b/i, "Model output contains fit or proof-readiness language."],
    [/\b(strengths?|weaknesses?)\b/i, "Model output contains candidate strengths or weaknesses language."],
    [/\b(resume|curriculum vitae|\bcv\b|cover letter)\b/i, "Model output contains resume or application language."],
    [/\b(recommend(ed|ation)?\s+(hire|apply|candidate)|should\s+(hire|apply))\b/i, "Model output contains a hiring or application recommendation."],
  ];
  return checks.find(([pattern]) => pattern.test(text))?.[1];
}

function issuesFromError(error: unknown): ProposalValidationIssue[] {
  if (error instanceof SyntaxError) return [issue("MALFORMED_JSON", "Model response is not valid JSON.")];
  if (error instanceof z.ZodError) {
    return error.issues.map((entry) => issue(
      "SCHEMA_MISMATCH",
      entry.message,
      entry.path.join("."),
    ));
  }
  return [issue("INVALID_RESPONSE", errorMessage(error))];
}

function issue(code: string, message: string, issuePath?: string): ProposalValidationIssue {
  return { code, message, ...(issuePath ? { path: issuePath } : {}) };
}

function deduplicateIssues(issues: ProposalValidationIssue[]): ProposalValidationIssue[] {
  return [...new Map(issues.map((entry) => [`${entry.code}|${entry.path ?? ""}|${entry.message}`, entry])).values()]
    .sort((a, b) => `${a.path ?? ""}|${a.code}`.localeCompare(`${b.path ?? ""}|${b.code}`));
}

function referenceKey(reference: TargetInterpretationSourceReference): string {
  return stableJson(reference);
}

async function loadCurrentDependencies(workspace: string, targetId: string): Promise<ProposalDependencies> {
  const target = await showTarget(workspace, targetId);
  const root = targetRoot(target);
  const targetPath = `${root}/target.json`;
  const analysisPath = `${root}/analysis/target-analysis.json`;
  const interpretationPath = `${root}/interpretation/target-interpretation.json`;
  const analysisStatus = await getTargetAnalysisStatus(workspace, targetId);
  if (analysisStatus.status !== "current") {
    throw new Error(`Structural analysis must be current before proposal generation. Current status: ${analysisStatus.status}`);
  }
  const interpretationStatus = await getTargetInterpretationStatus(workspace, targetId);
  if (interpretationStatus.status !== "current") {
    throw new Error(`Deterministic interpretation must be current before proposal generation. Current status: ${interpretationStatus.status}`);
  }
  const analysis = await showTargetAnalysis(workspace, targetId);
  const interpretation = await showTargetInterpretation(workspace, targetId);
  return {
    target,
    targetPath,
    targetSha256: await hashFile(resolveWithin(workspace, targetPath)),
    analysis,
    analysisPath,
    analysisSha256: await hashFile(resolveWithin(workspace, analysisPath)),
    interpretation,
    interpretationPath,
    interpretationSha256: await hashFile(resolveWithin(workspace, interpretationPath)),
    ...(interpretation.targetType === "role" && interpretation.input.roleProfileSha256
      ? { roleProfileSha256: interpretation.input.roleProfileSha256 }
      : {}),
  };
}

async function findCachedProposal(
  workspace: string,
  targetId: string,
  fingerprint: string,
): Promise<{ proposalId: string; location: ProposalLocation } | undefined> {
  const entries = await listInterpretationProposals(workspace, targetId);
  for (const entry of entries) {
    if (entry.status !== "current" || entry.proposalStatus !== "ready-for-review") continue;
    const proposal = await showInterpretationProposal(workspace, entry.proposalId);
    if (proposal.requestFingerprint === fingerprint) {
      const located = await locateProposal(workspace, entry.proposalId);
      return { proposalId: entry.proposalId, location: located.location };
    }
  }
  return undefined;
}

async function locateProposal(
  workspace: string,
  proposalId: string,
): Promise<{ target: Target; location: ProposalLocation }> {
  if (!/^proposal_[a-f0-9]+$/.test(proposalId)) throw new Error(`Invalid proposal ID: ${proposalId}`);
  const files = (await walkFiles(path.join(workspace, "targets")))
    .filter((file) => path.basename(file) === PROPOSAL_FILE && path.basename(path.dirname(file)) === proposalId);
  if (files.length === 0) throw new Error(`Proposal not found: ${proposalId}`);
  if (files.length > 1) throw new Error(`Proposal ID is ambiguous: ${proposalId}`);
  const proposal = TargetInterpretationProposalSchema.parse(await readJson<unknown>(files[0], null));
  const target = await showTarget(workspace, proposal.targetId);
  return { target, location: proposalLocation(workspace, target, proposalId) };
}

function proposalLocation(workspace: string, target: Target, proposalId: string): ProposalLocation {
  const rootRelativePath = `${targetRoot(target)}/interpretation/proposals/${proposalId}`;
  const proposalRelativePath = `${rootRelativePath}/${PROPOSAL_FILE}`;
  const manifestRelativePath = `${rootRelativePath}/${PROPOSAL_MANIFEST_FILE}`;
  const rawResponseRelativePath = `${rootRelativePath}/${RAW_RESPONSE_FILE}`;
  return {
    rootRelativePath,
    rootPath: resolveWithin(workspace, rootRelativePath),
    proposalRelativePath,
    proposalPath: resolveWithin(workspace, proposalRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
    rawResponseRelativePath,
    rawResponsePath: resolveWithin(workspace, rawResponseRelativePath),
  };
}

function targetRoot(target: Target): string {
  return `targets/${target.type === "role" ? "roles" : "jobs"}/${target.id}`;
}

function resolveWithin(workspace: string, relativePath: string): string {
  const resolved = path.resolve(workspace, relativePath);
  const relation = path.relative(path.resolve(workspace), resolved);
  if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
    throw new Error(`Proposal path escapes workspace: ${relativePath}`);
  }
  return resolved;
}

async function countTargetProposals(workspace: string, target: Target): Promise<number> {
  return (await walkFiles(path.join(workspace, targetRoot(target), "interpretation", "proposals")))
    .filter((file) => path.basename(file) === PROPOSAL_FILE).length;
}

function resultFromProposal(
  proposal: TargetInterpretationProposal,
  location: ProposalLocation,
  result: ProposalGenerationResult["result"],
): ProposalGenerationResult {
  return {
    targetId: proposal.targetId,
    targetType: proposal.targetType,
    proposalId: proposal.id,
    result,
    proposalPath: location.proposalRelativePath,
    manifestPath: location.manifestRelativePath,
    rawResponsePath: location.rawResponseRelativePath,
    proposedExpectationCount: proposal.proposedExpectations.length,
    validationIssueCount: proposal.validationIssues.length,
    requestFingerprint: proposal.requestFingerprint,
  };
}

function invalidStatus(
  base: Pick<ProposalStatus, "proposalId" | "targetId" | "targetType" | "proposalPath" | "manifestPath" | "rawResponsePath">,
  proposalExists: boolean,
  manifestExists: boolean,
  rawResponseExists: boolean,
  reasons: string[],
  proposalHashMatches: boolean | null = null,
  rawResponseHashMatches: boolean | null = null,
): ProposalStatus {
  return {
    ...base,
    proposalExists,
    manifestExists,
    rawResponseExists,
    proposalHashMatches,
    rawResponseHashMatches,
    targetHashMatches: null,
    structuralAnalysisHashMatches: null,
    deterministicInterpretationHashMatches: null,
    roleProfileHashMatches: null,
    status: "invalid",
    readyForReview: false,
    reasons,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function proposalFileTimestamps(
  workspace: string,
  proposalId: string,
): Promise<{ proposalMtimeMs: number; manifestMtimeMs: number; rawResponseMtimeMs: number }> {
  const located = await locateProposal(workspace, proposalId);
  const [proposal, manifest, raw] = await Promise.all([
    stat(located.location.proposalPath),
    stat(located.location.manifestPath),
    stat(located.location.rawResponsePath),
  ]);
  return {
    proposalMtimeMs: proposal.mtimeMs,
    manifestMtimeMs: manifest.mtimeMs,
    rawResponseMtimeMs: raw.mtimeMs,
  };
}
