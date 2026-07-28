import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  uniqueSorted,
  writeBufferAtomic,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  ModelJobResumeDraftPayloadSchema,
  JobResumeDraftProposalManifestSchema,
  JobResumeDraftProposalSchema,
  type JobResumeDraftAmbiguity,
  type JobResumeDraftClaimLedgerEntry,
  type JobResumeDraftEvidenceUsage,
  type JobResumeDraftItem,
  type JobResumeDraftProposal,
  type JobResumeDraftProposalManifest,
  type JobResumeDraftScaffold,
  type JobResumeDraftSection,
  type JobResumeDraftValidationIssue,
  type ModelJobResumeDraftPayload,
} from "./job-resume-draft-schemas.js";
import {
  JOB_RESUME_DRAFTING_POLICY_NAME,
  JOB_RESUME_DRAFTING_POLICY_VERSION,
  getJobResumeDraftScaffoldStatus,
  loadJobResumeDraftingContext,
  showJobResumeDraftScaffold,
} from "./job-resume-drafting.js";
import {
  createModelProviderFromEnvironment,
  type InterpretationModelProvider,
} from "./model-provider.js";
import { stableJson } from "./target-proposal.js";

export const JOB_RESUME_DRAFT_PROMPT_TEMPLATE_ID = "target-job-resume-draft-proposal";
export const JOB_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION = "1";
export const JOB_RESUME_DRAFT_PROMPT_POLICY_VERSION = "1";

export interface GenerateJobResumeDraftProposalOptions {
  refresh?: boolean;
  provider?: InterpretationModelProvider;
  now?: () => Date;
}
export interface GenerateJobResumeDraftProposalResult {
  targetId: string;
  proposalId: string;
  result: "created" | "cache-hit" | "validation-failed";
  proposalPath: string;
  manifestPath: string;
  rawResponsePath: string;
  sectionCount: number;
  draftItemCount: number;
  validationIssueCount: number;
  requestFingerprint: string;
}
export interface JobResumeDraftProposalStatus {
  proposalId: string;
  targetId: string;
  proposalExists: boolean;
  manifestExists: boolean;
  rawResponseExists: boolean;
  proposalHashMatches: boolean | null;
  rawResponseHashMatches: boolean | null;
  scaffoldHashMatches: boolean | null;
  dependenciesMatch: boolean | null;
  policyVersionMatches: boolean | null;
  status: "missing" | "current" | "stale" | "invalid";
  readyForReview: boolean;
  reasons: string[];
}

export async function generateJobResumeDraftProposal(
  workspace: string,
  targetId: string,
  options: GenerateJobResumeDraftProposalOptions = {},
): Promise<GenerateJobResumeDraftProposalResult> {
  const scaffoldStatus = await getJobResumeDraftScaffoldStatus(workspace, targetId);
  if (scaffoldStatus.status !== "current") {
    throw new Error(`Job resume draft scaffold must be current before proposal generation. Current status: ${scaffoldStatus.status}`);
  }
  const context = await loadJobResumeDraftingContext(workspace, targetId);
  const scaffold = await showJobResumeDraftScaffold(workspace, targetId);
  const scaffoldSha256 = await hashFile(resolveWithin(workspace, scaffoldStatus.scaffoldPath));
  const provider = options.provider ?? createModelProviderFromEnvironment();
  const normalizedInput = createJobResumeDraftModelInput(context, scaffold);
  const normalizedModelInputSha256 = hashText(stableJson(normalizedInput));
  const renderedPrompt = renderJobResumeDraftPrompt(normalizedInput);
  const renderedPromptSha256 = hashText(renderedPrompt);
  const requestFingerprint = hashText(stableJson({
    targetSha256: context.targetSha256,
    requirementModelSha256: context.requirementInput.modelSha256,
    evidenceMapSha256: context.evidenceMapSha256,
    coverageSha256: context.coverageSha256,
    assessmentSha256: context.assessmentSha256,
    contentPlanSha256: context.contentPlanSha256,
    scaffoldSha256,
    selectedEvidenceSetSha256: context.selectedEvidenceSetSha256,
    selectedClaimSetSha256: context.selectedClaimSetSha256,
    policy: {
      name: JOB_RESUME_DRAFTING_POLICY_NAME,
      version: JOB_RESUME_DRAFTING_POLICY_VERSION,
    },
    provider: provider.providerId,
    model: provider.identity.model,
    settings: provider.settings,
    promptTemplateId: JOB_RESUME_DRAFT_PROMPT_TEMPLATE_ID,
    promptTemplateVersion: JOB_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION,
    promptPolicyVersion: JOB_RESUME_DRAFT_PROMPT_POLICY_VERSION,
    normalizedModelInputSha256,
  }));
  if (!options.refresh) {
    const cached = await findCachedProposal(workspace, targetId, requestFingerprint);
    if (cached) {
      const status = await getJobResumeDraftProposalStatus(workspace, cached.id);
      if (status.status === "current") return proposalResult(cached, "cache-hit");
    }
  }
  const response = await provider.generate({
    renderedPrompt,
    settings: provider.settings,
  });
  if (!response.rawText.length) throw new Error("Model provider returned an empty response.");
  const now = (options.now ?? (() => new Date()))().toISOString();
  const rawResponseSha256 = hashText(response.rawText);
  const proposalId = await nextProposalId(
    workspace,
    targetId,
    requestFingerprint,
    rawResponseSha256,
  );
  const paths = jobResumeDraftProposalPaths(workspace, targetId, proposalId);
  const normalized = normalizeJobResumeDraftResponse(
    response.rawText,
    proposalId,
    scaffold,
    context,
    scaffoldSha256,
  );
  const blocking = normalized.validationIssues.some((entry) =>
    entry.severity === "critical" || entry.severity === "high"
  );
  const proposal = JobResumeDraftProposalSchema.parse({
    schemaVersion: 1,
    id: proposalId,
    requestFingerprint,
    targetId,
    targetType: "job",
    mode: "job-specific-resume",
    status: blocking ? "validation-failed" : "ready-for-review",
    draftingPolicy: {
      name: JOB_RESUME_DRAFTING_POLICY_NAME,
      version: JOB_RESUME_DRAFTING_POLICY_VERSION,
    },
    model: {
      provider: provider.providerId,
      model: provider.identity.model,
      settings: provider.settings,
    },
    prompt: {
      templateId: JOB_RESUME_DRAFT_PROMPT_TEMPLATE_ID,
      templateVersion: JOB_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION,
      policyVersion: JOB_RESUME_DRAFT_PROMPT_POLICY_VERSION,
      renderedPromptSha256,
    },
    input: {
      targetSha256: context.targetSha256,
      requirementModelSha256: context.requirementInput.modelSha256,
      evidenceMapSha256: context.evidenceMapSha256,
      coverageSha256: context.coverageSha256,
      assessmentSha256: context.assessmentSha256,
      contentPlanSha256: context.contentPlanSha256,
      scaffoldSha256,
      selectedEvidenceSetSha256: context.selectedEvidenceSetSha256,
      selectedClaimSetSha256: context.selectedClaimSetSha256,
      normalizedModelInputSha256,
    },
    sections: normalized.sections,
    claimLedger: normalized.claimLedger,
    evidenceUsage: normalized.evidenceUsage,
    warnings: normalized.warnings,
    ambiguities: normalized.ambiguities,
    validationIssues: normalized.validationIssues,
    rawResponsePath: paths.rawRelativePath,
    rawResponseSha256,
    createdAt: now,
    updatedAt: now,
  });
  await writeBufferAtomic(paths.rawPath, Buffer.from(response.rawText, "utf8"));
  await writeJsonAtomic(paths.proposalPath, proposal);
  const manifest = JobResumeDraftProposalManifestSchema.parse({
    schemaVersion: 1,
    proposalId,
    requestFingerprint,
    targetId,
    proposalPath: paths.proposalRelativePath,
    proposalSha256: await hashFile(paths.proposalPath),
    rawResponsePath: paths.rawRelativePath,
    rawResponseSha256,
    provider: provider.providerId,
    model: provider.identity.model,
    promptTemplateId: JOB_RESUME_DRAFT_PROMPT_TEMPLATE_ID,
    promptTemplateVersion: JOB_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION,
    policyVersion: JOB_RESUME_DRAFT_PROMPT_POLICY_VERSION,
    renderedPromptSha256,
    normalizedModelInputSha256,
    targetSha256: context.targetSha256,
    requirementModelSha256: context.requirementInput.modelSha256,
    evidenceMapSha256: context.evidenceMapSha256,
    coverageSha256: context.coverageSha256,
    assessmentSha256: context.assessmentSha256,
    contentPlanSha256: context.contentPlanSha256,
    scaffoldSha256,
    selectedEvidenceSetSha256: context.selectedEvidenceSetSha256,
    selectedClaimSetSha256: context.selectedClaimSetSha256,
    createdAt: now,
    updatedAt: now,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
  return proposalResult(proposal, blocking ? "validation-failed" : "created");
}

export async function showJobResumeDraftProposal(
  workspace: string,
  proposalId: string,
): Promise<JobResumeDraftProposal> {
  const location = await locateProposal(workspace, proposalId);
  if (!location) throw new Error(`Job resume draft proposal not found: ${proposalId}`);
  return JobResumeDraftProposalSchema.parse(await readJson<unknown>(location.proposalPath, null));
}

export async function listJobResumeDraftProposals(
  workspace: string,
  targetId: string,
): Promise<JobResumeDraftProposal[]> {
  const root = resolveWithin(workspace, `targets/jobs/${targetId}/resume-drafting/proposals`);
  if (!(await pathExists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true });
  const proposals = await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
    try {
      return JobResumeDraftProposalSchema.parse(
        await readJson<unknown>(path.join(root, entry.name, "proposal.json"), null),
      );
    } catch {
      return null;
    }
  }));
  return proposals
    .filter((entry): entry is JobResumeDraftProposal => Boolean(entry))
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export async function getJobResumeDraftProposalStatus(
  workspace: string,
  proposalId: string,
): Promise<JobResumeDraftProposalStatus> {
  const location = await locateProposal(workspace, proposalId);
  if (!location) return emptyProposalStatus(proposalId, "unknown", "missing", ["Proposal not found."]);
  const proposalExists = await pathExists(location.proposalPath);
  const manifestExists = await pathExists(location.manifestPath);
  if (!proposalExists || !manifestExists) {
    return emptyProposalStatus(proposalId, location.targetId, "invalid", ["Proposal artifact set is incomplete."], {
      proposalExists,
      manifestExists,
    });
  }
  let proposal: JobResumeDraftProposal;
  let manifest: JobResumeDraftProposalManifest;
  try {
    proposal = JobResumeDraftProposalSchema.parse(await readJson<unknown>(location.proposalPath, null));
    manifest = JobResumeDraftProposalManifestSchema.parse(await readJson<unknown>(location.manifestPath, null));
  } catch (error) {
    return emptyProposalStatus(proposalId, location.targetId, "invalid", [`Malformed proposal: ${errorMessage(error)}`]);
  }
  const rawPath = resolveWithin(workspace, proposal.rawResponsePath);
  const rawResponseExists = await pathExists(rawPath);
  const proposalHashMatches = await hashFile(location.proposalPath) === manifest.proposalSha256;
  const rawResponseHashMatches = rawResponseExists
    && await hashFile(rawPath) === manifest.rawResponseSha256
    && proposal.rawResponseSha256 === manifest.rawResponseSha256;
  const scaffoldStatus = await getJobResumeDraftScaffoldStatus(workspace, proposal.targetId);
  const scaffoldHashMatches = scaffoldStatus.status === "current"
    && await hashFile(resolveWithin(workspace, scaffoldStatus.scaffoldPath)) === manifest.scaffoldSha256;
  let dependenciesMatch = false;
  try {
    const context = await loadJobResumeDraftingContext(workspace, proposal.targetId);
    dependenciesMatch = context.targetSha256 === manifest.targetSha256
      && context.requirementInput.modelSha256 === manifest.requirementModelSha256
      && context.evidenceMapSha256 === manifest.evidenceMapSha256
      && context.coverageSha256 === manifest.coverageSha256
      && context.assessmentSha256 === manifest.assessmentSha256
      && context.contentPlanSha256 === manifest.contentPlanSha256
      && context.selectedEvidenceSetSha256 === manifest.selectedEvidenceSetSha256
      && context.selectedClaimSetSha256 === manifest.selectedClaimSetSha256;
  } catch {
    dependenciesMatch = false;
  }
  const policyVersionMatches = manifest.policyVersion === JOB_RESUME_DRAFT_PROMPT_POLICY_VERSION
    && proposal.draftingPolicy.name === JOB_RESUME_DRAFTING_POLICY_NAME
    && proposal.draftingPolicy.version === JOB_RESUME_DRAFTING_POLICY_VERSION
    && proposal.prompt.templateId === JOB_RESUME_DRAFT_PROMPT_TEMPLATE_ID
    && proposal.prompt.templateVersion === JOB_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION;
  const invalid = !proposalHashMatches
    || !rawResponseHashMatches
    || proposal.id !== manifest.proposalId
    || proposal.requestFingerprint !== manifest.requestFingerprint;
  const stale = !scaffoldHashMatches || !dependenciesMatch || !policyVersionMatches;
  const status = invalid ? "invalid" : stale ? "stale" : "current";
  return {
    proposalId,
    targetId: proposal.targetId,
    proposalExists,
    manifestExists,
    rawResponseExists,
    proposalHashMatches,
    rawResponseHashMatches,
    scaffoldHashMatches,
    dependenciesMatch,
    policyVersionMatches,
    status,
    readyForReview: status === "current"
      && proposal.status === "ready-for-review"
      && !proposal.validationIssues.some((entry) => entry.severity === "critical" || entry.severity === "high"),
    reasons: [
      ...(!proposalHashMatches ? ["Proposal hash mismatch."] : []),
      ...(!rawResponseHashMatches ? ["Raw response hash mismatch."] : []),
      ...(!scaffoldHashMatches ? ["Draft scaffold changed."] : []),
      ...(!dependenciesMatch ? ["Job drafting dependencies changed."] : []),
      ...(!policyVersionMatches ? ["Drafting or prompt policy changed."] : []),
      ...proposal.validationIssues
        .filter((entry) => entry.severity === "critical" || entry.severity === "high")
        .map((entry) => entry.message),
    ],
  };
}

export async function replayJobResumeDraftProposal(workspace: string, proposalId: string) {
  const status = await getJobResumeDraftProposalStatus(workspace, proposalId);
  if (status.status !== "current") {
    throw new Error(`Replay requires a current Job resume draft proposal. Current status: ${status.status}`);
  }
  const proposal = await showJobResumeDraftProposal(workspace, proposalId);
  const scaffold = await showJobResumeDraftScaffold(workspace, proposal.targetId);
  const context = await loadJobResumeDraftingContext(workspace, proposal.targetId);
  const raw = await readFile(resolveWithin(workspace, proposal.rawResponsePath), "utf8");
  const normalized = normalizeJobResumeDraftResponse(
    raw,
    proposal.id,
    scaffold,
    context,
    proposal.input.scaffoldSha256,
  );
  const replayed = JobResumeDraftProposalSchema.parse({
    ...proposal,
    sections: normalized.sections,
    claimLedger: normalized.claimLedger,
    evidenceUsage: normalized.evidenceUsage,
    warnings: normalized.warnings,
    ambiguities: normalized.ambiguities,
    validationIssues: normalized.validationIssues,
    status: normalized.validationIssues.some((entry) => entry.severity === "critical" || entry.severity === "high")
      ? "validation-failed"
      : "ready-for-review",
  });
  const originalSha256 = hashText(`${stableJson(proposal)}\n`);
  const replaySha256 = hashText(`${stableJson(replayed)}\n`);
  return {
    proposalId,
    originalSha256,
    replaySha256,
    matches: originalSha256 === replaySha256,
  };
}

export function renderJobResumeDraftPrompt(input: unknown): string {
  return [
    `${JOB_RESUME_DRAFT_PROMPT_TEMPLATE_ID} v${JOB_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION}`,
    "Return strict JSON only using the supplied structured draft payload shape.",
    "The Job Resume Content Plan is the sole planning authority. Do not reinterpret, rematch, reassess, or replan.",
    "Draft only supplied sections and return one structured item per substantive resume statement.",
    "Preserve exact target, plan-section, requirement, coverage, assessment, evidence-map-link, evidence, claim, boundary, and metric-permission IDs.",
    "Use only approved wording and selected evidence supplied in this request.",
    "The Job Target title is positioning context only and is never current or historical employment.",
    "Project evidence remains visibly project-scoped. Responsibilities are not achievements without approved outcome evidence.",
    "Use a number only when an exact verified metric permission is supplied, and preserve its wording unchanged.",
    "Do not invent employers, projects, technologies, dates, metrics, team size, revenue, customers, users, geography, seniority, management scope, authority, adoption, or scale.",
    "Do not produce ATS scores, hiring predictions, application recommendations, cover letters, screening answers, rendered documents, or exports.",
    `Policy: ${JOB_RESUME_DRAFTING_POLICY_NAME} v${JOB_RESUME_DRAFTING_POLICY_VERSION}.`,
    stableJson(input),
  ].join("\n\n");
}

export function createJobResumeDraftModelInput(
  context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>,
  scaffold: JobResumeDraftScaffold,
) {
  const evidenceIds = new Set(scaffold.sections.flatMap((entry) => entry.allowedEvidenceIds));
  const claimIds = new Set(scaffold.sections.flatMap((entry) => entry.allowedClaimIds));
  const selectedEvidence = context.evidenceItems
    .filter((entry) => evidenceIds.has(entry.id))
    .map((entry) => ({
      id: entry.id,
      category: entry.category,
      normalizedSummary: entry.normalizedSummary,
      dateRange: entry.dateRange,
      company: entry.company,
      project: entry.project,
      technologies: entry.technologies,
      domains: entry.domains,
      parentRoleId: entry.parentRoleId,
      parentProjectId: entry.parentProjectId,
    }));
  const selectedClaims = context.claims
    .filter((entry) => claimIds.has(entry.id))
    .map((entry) => ({
      id: entry.id,
      approvedWording: entry.approvedWording,
      type: entry.type,
      supportingEvidenceIds: entry.supportingEvidenceIds,
      parentRoleId: entry.parentRoleId,
      parentProjectId: entry.parentProjectId,
      metricStatus: entry.metricStatus,
    }));
  return {
    target: {
      id: context.target.id,
      type: "job",
      title: context.target.title,
      company: context.target.company,
      location: context.target.location,
      workingModel: context.target.workingModel,
      titleUse: "positioning-only",
    },
    contentPlan: {
      id: context.contentPlan.id,
      positioning: context.contentPlan.positioning,
      requirementEmphasis: context.contentPlan.requirementEmphasis,
      evidenceSelections: context.contentPlan.evidenceSelections,
      sections: context.contentPlan.sections,
      claimBoundaries: context.contentPlan.claimBoundaries,
      metricPermissions: context.contentPlan.metricPermissions,
      exclusions: context.contentPlan.exclusions,
      risks: context.contentPlan.risks,
      warnings: context.contentPlan.warnings,
      ambiguities: context.contentPlan.ambiguities,
    },
    draftScaffold: scaffold,
    selectedApprovedEvidence: selectedEvidence,
    selectedApprovedClaims: selectedClaims,
    policy: {
      name: JOB_RESUME_DRAFTING_POLICY_NAME,
      version: JOB_RESUME_DRAFTING_POLICY_VERSION,
      contentPlanIsSoleAuthority: true,
      statementProvenanceRequired: true,
      exactVerifiedMetricsOnly: true,
      targetTitleIsNotEmploymentEvidence: true,
      projectScopeIsNotEmploymentScope: true,
      applicationJudgmentForbidden: true,
    },
  };
}

export function validateJobResumeDraftPayload(
  payload: ModelJobResumeDraftPayload,
  proposalId: string,
  scaffold: JobResumeDraftScaffold,
  context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>,
  scaffoldSha256: string,
) {
  const issues: JobResumeDraftValidationIssue[] = [];
  const scaffoldById = new Map(scaffold.sections.map((entry) => [entry.id, entry]));
  const planSectionById = new Map(context.contentPlan.sections.map((entry) => [entry.id, entry]));
  const evidenceById = new Map(context.evidenceItems.map((entry) => [entry.id, entry]));
  const claimById = new Map(context.claims.map((entry) => [entry.id, entry]));
  const linkById = new Map(context.evidenceMap.links.map((entry) => [entry.id, entry]));
  const coverageById = new Map(context.coverage.requirements.map((entry) => [entry.id, entry]));
  const assessmentById = new Map(context.assessment.requirementAssessments.map((entry) => [entry.id, entry]));
  const boundaryById = new Map(context.contentPlan.claimBoundaries.map((entry) => [entry.id, entry]));
  const metricById = new Map(context.contentPlan.metricPermissions.map((entry) => [entry.id, entry]));
  const expectedSectionIds = scaffold.sections.map((entry) => entry.id);
  const actualSectionIds = payload.sections.map((entry) => entry.id);
  if (!sameSet(expectedSectionIds, actualSectionIds)) {
    issues.push(issue("SECTION_SET_MISMATCH", "Proposal section IDs must exactly match the scaffold.", "critical"));
  }
  if (new Set(actualSectionIds).size !== actualSectionIds.length) {
    issues.push(issue("DUPLICATE_SECTION", "Proposal contains duplicate section IDs.", "critical"));
  }
  const normalizedSections = payload.sections.map<JobResumeDraftSection>((section) => {
    const guard = scaffoldById.get(section.id);
    if (!guard) {
      issues.push(issue("UNKNOWN_SECTION", `Unknown scaffold section: ${section.id}`, "critical", {
        sectionIds: [section.id],
      }));
      return section;
    }
    const sectionIssues: JobResumeDraftValidationIssue[] = [];
    if (
      section.planSectionId !== guard.planSectionId ||
      section.type !== guard.sectionType ||
      section.order !== guard.order ||
      section.objectiveCode !== guard.objectiveCode
    ) {
      sectionIssues.push(issue("SECTION_BOUNDARY_CHANGED", "Section identity, type, order, or objective differs from the scaffold.", "critical", {
        sectionIds: [section.id],
      }));
    }
    if (guard.inclusion === "exclude" && (section.status !== "excluded" || section.items.length > 0)) {
      sectionIssues.push(issue("EXCLUDED_SECTION_DRAFTED", "An excluded section contains draft content.", "critical", {
        sectionIds: [section.id],
      }));
    }
    if (section.items.length > guard.maximumItemCount) {
      sectionIssues.push(issue("SECTION_ITEM_LIMIT_EXCEEDED", "Section exceeds its planned item limit.", "high", {
        sectionIds: [section.id],
      }));
    }
    const allowedItemTypes = itemTypesForSection(guard.sectionType);
    const normalizedItems = section.items.map((item) => {
      const itemIssues: JobResumeDraftValidationIssue[] = [];
      if (item.sectionId !== section.id || !allowedItemTypes.includes(item.itemType)) {
        itemIssues.push(issue("INVALID_ITEM_TYPE", "Draft item type or section reference is invalid.", "critical", refs(item)));
      }
      validateSubset("requirement", item.requirementIds, guard.allowedRequirementIds, item, itemIssues);
      validateSubset("coverage", item.coverageIds, guard.allowedCoverageIds, item, itemIssues);
      validateSubset("assessment", item.assessmentIds, guard.allowedAssessmentIds, item, itemIssues);
      validateSubset("evidence-map link", item.evidenceMapLinkIds, guard.allowedEvidenceMapLinkIds, item, itemIssues);
      validateSubset("evidence", item.evidenceIds, guard.allowedEvidenceIds, item, itemIssues);
      validateSubset("claim", item.claimIds, guard.allowedClaimIds, item, itemIssues);
      validateSubset("claim boundary", item.claimBoundaryIds, guard.allowedClaimBoundaryIds, item, itemIssues);
      validateSubset("metric permission", item.metricPermissionIds, guard.allowedMetricPermissionIds, item, itemIssues);
      if (!item.requirementIds.length || !item.evidenceIds.length || !item.claimIds.length || !item.claimBoundaryIds.length) {
        itemIssues.push(issue("PROVENANCE_INCOMPLETE", "Every substantive draft item requires requirement, evidence, claim, and boundary references.", "critical", refs(item)));
      }
      if (item.claimTypes.some((entry) => !guard.allowedClaimTypes.includes(entry))) {
        itemIssues.push(issue("CLAIM_TYPE_NOT_ALLOWED", "Draft item uses a claim type not permitted by the plan section.", "critical", refs(item)));
      }
      validateReferenceExistence(item, {
        coverageById,
        assessmentById,
        linkById,
        evidenceById,
        claimById,
        boundaryById,
        metricById,
      }, itemIssues);
      validateLinkConsistency(item, linkById, itemIssues);
      validateClaimEligibility(item, claimById, evidenceById, itemIssues);
      validateClaimBoundaries(item, boundaryById, itemIssues);
      validateMetrics(item, metricById, evidenceById, itemIssues);
      validateLanguage(item, scaffold, context, evidenceById, claimById, itemIssues);
      if (guard.maximumSentenceCount && sentenceCount(item.text) > guard.maximumSentenceCount) {
        itemIssues.push(issue("SENTENCE_LIMIT_EXCEEDED", "Draft item exceeds the planned sentence limit.", "high", refs(item)));
      }
      if (guard.requiredQualifierCodes.some((code) => !item.qualifiers.includes(code))) {
        itemIssues.push(issue("REQUIRED_QUALIFIER_MISSING", "Draft item omits a qualifier required by the content plan.", "high", refs(item)));
      }
      const id = `job-resume-draft-item_${hashText([
        proposalId,
        section.id,
        item.itemType,
        normalizeText(item.text),
        uniqueSorted(item.requirementIds).join(","),
        uniqueSorted(item.evidenceIds).join(","),
        uniqueSorted(item.claimIds).join(","),
        uniqueSorted(item.claimBoundaryIds).join(","),
      ].join("\0")).slice(0, 16)}`;
      const status: JobResumeDraftItem["validation"]["status"] = itemIssues.some((entry) =>
        entry.severity === "critical" || entry.severity === "high"
      ) ? "invalid" : itemIssues.length ? "requires-review" : "valid";
      issues.push(...itemIssues);
      return {
        ...item,
        id,
        sectionId: section.id,
        requirementIds: uniqueSorted(item.requirementIds),
        coverageIds: uniqueSorted(item.coverageIds),
        assessmentIds: uniqueSorted(item.assessmentIds),
        evidenceMapLinkIds: uniqueSorted(item.evidenceMapLinkIds),
        evidenceIds: uniqueSorted(item.evidenceIds),
        claimIds: uniqueSorted(item.claimIds),
        claimBoundaryIds: uniqueSorted(item.claimBoundaryIds),
        metricPermissionIds: uniqueSorted(item.metricPermissionIds),
        claimTypes: typedUnique(item.claimTypes),
        qualifiers: uniqueSorted(item.qualifiers),
        trustState: "model-proposed" as const,
        validation: { status, issues: itemIssues },
        provenance: {
          targetId: context.target.id,
          planId: context.contentPlan.id,
          planSectionId: guard.planSectionId,
          proposalId,
          draftingPolicy: {
            name: JOB_RESUME_DRAFTING_POLICY_NAME,
            version: JOB_RESUME_DRAFTING_POLICY_VERSION,
          },
          artifactHashes: {
            requirementModelSha256: context.requirementInput.modelSha256,
            evidenceMapSha256: context.evidenceMapSha256,
            coverageSha256: context.coverageSha256,
            assessmentSha256: context.assessmentSha256,
            contentPlanSha256: context.contentPlanSha256,
            scaffoldSha256,
          },
        },
      };
    });
    issues.push(...sectionIssues);
    return {
      ...section,
      planSectionId: guard.planSectionId,
      type: guard.sectionType,
      order: guard.order,
      objectiveCode: guard.objectiveCode,
      status: guard.inclusion === "exclude"
        ? "excluded" as const
        : normalizedItems.length === 0
          ? "empty" as const
          : sectionIssues.length || normalizedItems.some((entry) => entry.validation.status !== "valid")
            ? "requires-review" as const
            : "drafted" as const,
      items: normalizedItems,
      provenance: {
        targetId: context.target.id,
        planId: context.contentPlan.id,
        planSectionId: guard.planSectionId,
        contentPlanSha256: context.contentPlanSha256,
        draftingPolicy: {
          name: JOB_RESUME_DRAFTING_POLICY_NAME,
          version: JOB_RESUME_DRAFTING_POLICY_VERSION,
        },
      },
    };
  });
  const itemIds = normalizedSections.flatMap((entry) => entry.items.map((item) => item.id));
  if (new Set(itemIds).size !== itemIds.length) {
    issues.push(issue("DUPLICATE_DRAFT_ITEM", "Proposal contains duplicate draft items.", "high"));
  }
  issues.push(...duplicateAndOveruseIssues(normalizedSections));
  const claimLedger = buildJobResumeDraftClaimLedger(normalizedSections, context);
  const evidenceUsage = buildJobResumeDraftEvidenceUsage(normalizedSections, scaffold, context);
  const warnings = uniqueWarnings([
    ...payload.warnings,
    warning(proposalId, "MODEL_DRAFT_REQUIRES_HUMAN_REVIEW", "Model-proposed resume wording requires complete human review before approval."),
    warning(proposalId, "JOB_SPECIFIC_DRAFT_ONLY", "This is a structured Job-specific draft, not a rendered or exported resume."),
    warning(proposalId, "NO_APPLICATION_RECOMMENDATION", "This draft does not contain an application recommendation, ATS score, or hiring prediction."),
  ]);
  return {
    sections: normalizedSections,
    claimLedger,
    evidenceUsage,
    warnings,
    ambiguities: payload.ambiguities,
    validationIssues: uniqueIssues(issues),
  };
}

export function buildJobResumeDraftClaimLedger(
  sections: JobResumeDraftSection[],
  context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>,
): JobResumeDraftClaimLedgerEntry[] {
  const emphasisByRequirement = new Map(
    context.contentPlan.requirementEmphasis.map((entry) => [entry.requirementId, entry]),
  );
  return sections.flatMap((section) => section.items.map((item) => {
    const states = item.requirementIds.map((id) => emphasisByRequirement.get(id));
    const supportStatus = states.some((entry) => entry?.assessmentState === "strength" || entry?.assessmentState === "supported")
      ? "direct" as const
      : states.some((entry) => entry?.assessmentState === "partial")
        ? "qualified" as const
        : "contextual" as const;
    return {
      id: `job-resume-draft-claim_${hashText([
        item.id,
        hashText(item.text),
        JOB_RESUME_DRAFTING_POLICY_VERSION,
      ].join("\0")).slice(0, 16)}`,
      draftItemId: item.id,
      statementText: item.text,
      statementSha256: hashText(item.text),
      requirementIds: item.requirementIds,
      coverageIds: item.coverageIds,
      assessmentIds: item.assessmentIds,
      evidenceMapLinkIds: item.evidenceMapLinkIds,
      evidenceIds: item.evidenceIds,
      claimIds: item.claimIds,
      claimBoundaryIds: item.claimBoundaryIds,
      metricPermissionIds: item.metricPermissionIds,
      supportStatus,
      metricStatus: item.metricReferences.length
        ? "verified-metric-used" as const
        : item.claimTypes.includes("quantified-outcome")
          ? "metric-prohibited" as const
          : "not-applicable" as const,
      scopeStatus: item.scopeReferences.some((entry) => entry.status === "qualified")
        ? "qualified-scope" as const
        : item.validation.status === "requires-review"
          ? "requires-review" as const
          : "within-approved-scope" as const,
      validationStatus: item.validation.status,
      validationIssues: item.validation.issues,
      provenance: item.provenance,
    };
  }));
}

export function buildJobResumeDraftEvidenceUsage(
  sections: JobResumeDraftSection[],
  scaffold: JobResumeDraftScaffold,
  context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>,
): JobResumeDraftEvidenceUsage[] {
  const selectionByEvidence = new Map(
    context.contentPlan.evidenceSelections.map((entry) => [entry.evidenceId, entry]),
  );
  const selected = uniqueSorted(scaffold.sections.flatMap((entry) => entry.allowedEvidenceIds));
  const itemContexts = sections.flatMap((section) => section.items.map((item) => ({ section, item })));
  return selected.map((evidenceId) => {
    const planSelection = selectionByEvidence.get(evidenceId);
    const used = itemContexts.filter(({ item }) => item.evidenceIds.includes(evidenceId));
    const plannedSectionCount = new Set(planSelection?.intendedSections ?? []).size;
    const maximumUses = Math.max(1, plannedSectionCount * 2);
    const overused = used.length > maximumUses;
    return {
      id: `job-resume-evidence-usage_${hashText([scaffold.id, evidenceId].join("\0")).slice(0, 16)}`,
      evidenceId,
      allocation: planSelection?.decision ?? "exclude",
      plannedRequirementIds: uniqueSorted(planSelection?.requirementUses.map((entry) => entry.requirementId) ?? []),
      draftItemIds: uniqueSorted(used.map(({ item }) => item.id)),
      sectionIds: uniqueSorted(used.map(({ section }) => section.id)),
      usageCount: used.length,
      repeatedUse: used.length > 1,
      status: planSelection?.decision === "exclude"
        ? "excluded" as const
        : used.length === 0
          ? "unused-selected-evidence" as const
          : overused
            ? "overused" as const
            : "within-plan" as const,
      warnings: [
        ...(used.length === 0 ? ["Selected evidence was not used in the proposal."] : []),
        ...(overused ? ["Evidence is reused beyond its conservative planned allowance."] : []),
      ],
    };
  });
}

export function formatJobResumeDraftProposalResult(result: GenerateJobResumeDraftProposalResult): string {
  return [
    `Target ID: ${result.targetId}`,
    `Proposal ID: ${result.proposalId}`,
    `Result: ${result.result}`,
    `Proposal path: ${result.proposalPath}`,
    `Manifest path: ${result.manifestPath}`,
    `Raw response path: ${result.rawResponsePath}`,
    `Sections: ${result.sectionCount}`,
    `Draft items: ${result.draftItemCount}`,
    `Validation issues: ${result.validationIssueCount}`,
    `Request fingerprint: ${result.requestFingerprint}`,
  ].join("\n");
}
export function formatJobResumeDraftProposalList(proposals: JobResumeDraftProposal[]): string {
  return proposals.length
    ? proposals.map((entry) =>
      `${entry.id} | ${entry.status} | items=${entry.sections.flatMap((section) => section.items).length} | ${entry.createdAt}`
    ).join("\n")
    : "No Job resume draft proposals found.";
}
export function formatJobResumeDraftProposalStatus(status: JobResumeDraftProposalStatus): string {
  return [
    `Proposal ID: ${status.proposalId}`,
    `Target ID: ${status.targetId}`,
    `Overall status: ${status.status}`,
    `Ready for review: ${status.readyForReview ? "yes" : "no"}`,
    `Proposal hash matches: ${status.proposalHashMatches ?? "n/a"}`,
    `Raw response hash matches: ${status.rawResponseHashMatches ?? "n/a"}`,
    `Scaffold hash matches: ${status.scaffoldHashMatches ?? "n/a"}`,
    `Dependencies match: ${status.dependenciesMatch ?? "n/a"}`,
    ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((entry) => `- ${entry}`)] : []),
  ].join("\n");
}

function normalizeJobResumeDraftResponse(
  raw: string,
  proposalId: string,
  scaffold: JobResumeDraftScaffold,
  context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>,
  scaffoldSha256: string,
) {
  let payload: ModelJobResumeDraftPayload;
  try {
    payload = ModelJobResumeDraftPayloadSchema.parse(JSON.parse(raw));
  } catch (error) {
    return {
      sections: [],
      claimLedger: [],
      evidenceUsage: buildJobResumeDraftEvidenceUsage([], scaffold, context),
      warnings: [],
      ambiguities: [],
      validationIssues: [issue("MALFORMED_OR_SCHEMA_INVALID", errorMessage(error), "critical")],
    };
  }
  return validateJobResumeDraftPayload(payload, proposalId, scaffold, context, scaffoldSha256);
}

function validateReferenceExistence(
  item: JobResumeDraftItem,
  lookups: {
    coverageById: Map<string, unknown>;
    assessmentById: Map<string, unknown>;
    linkById: Map<string, unknown>;
    evidenceById: Map<string, unknown>;
    claimById: Map<string, unknown>;
    boundaryById: Map<string, unknown>;
    metricById: Map<string, unknown>;
  },
  issues: JobResumeDraftValidationIssue[],
) {
  const checks: Array<[string, string[], Map<string, unknown>]> = [
    ["coverage", item.coverageIds, lookups.coverageById],
    ["assessment", item.assessmentIds, lookups.assessmentById],
    ["evidence map link", item.evidenceMapLinkIds, lookups.linkById],
    ["evidence", item.evidenceIds, lookups.evidenceById],
    ["claim", item.claimIds, lookups.claimById],
    ["claim boundary", item.claimBoundaryIds, lookups.boundaryById],
    ["metric permission", item.metricPermissionIds, lookups.metricById],
  ];
  for (const [name, values, lookup] of checks) {
    for (const id of values) {
      if (!lookup.has(id)) {
        issues.push(issue(`UNKNOWN_${name.toUpperCase().replace(/\s+/g, "_")}`, `Unknown ${name}: ${id}`, "critical", refs(item)));
      }
    }
  }
}

function validateLinkConsistency(
  item: JobResumeDraftItem,
  linkById: Map<string, Awaited<ReturnType<typeof loadJobResumeDraftingContext>>["evidenceMap"]["links"][number]>,
  issues: JobResumeDraftValidationIssue[],
) {
  for (const linkId of item.evidenceMapLinkIds) {
    const link = linkById.get(linkId);
    if (!link) continue;
    if (
      !item.requirementIds.includes(link.requirementId) ||
      !item.evidenceIds.includes(link.evidenceId) ||
      !item.claimIds.includes(link.claimId)
    ) {
      issues.push(issue("EVIDENCE_LINK_PROVENANCE_MISMATCH", "Evidence-map link references do not agree with the statement provenance.", "critical", refs(item)));
    }
  }
}

function validateClaimEligibility(
  item: JobResumeDraftItem,
  claimById: Map<string, Awaited<ReturnType<typeof loadJobResumeDraftingContext>>["claims"][number]>,
  evidenceById: Map<string, Awaited<ReturnType<typeof loadJobResumeDraftingContext>>["evidenceItems"][number]>,
  issues: JobResumeDraftValidationIssue[],
) {
  for (const claimId of item.claimIds) {
    const claim = claimById.get(claimId);
    if (!claim) continue;
    if (
      claim.approvalStatus !== "approved" ||
      claim.outputReadiness !== "resume_ready" ||
      !claim.publicSafe ||
      claim.needsConfirmation ||
      !claim.approvedWording
    ) {
      issues.push(issue("CLAIM_NOT_RESUME_READY", "Draft item references a claim that is not approved and resume-ready.", "critical", refs(item)));
    }
    if (!item.evidenceIds.some((id) => claim.supportingEvidenceIds.includes(id))) {
      issues.push(issue("CLAIM_EVIDENCE_MISMATCH", "Draft claim does not cite its reviewed supporting evidence.", "critical", refs(item)));
    }
  }
  for (const evidenceId of item.evidenceIds) {
    const evidence = evidenceById.get(evidenceId);
    if (!evidence || evidence.visibility !== "public" || evidence.sensitivityFlags.length > 0) {
      issues.push(issue("EVIDENCE_NOT_PUBLIC_SAFE", "Draft item references evidence that is not public-safe.", "critical", refs(item)));
    }
  }
}

function validateClaimBoundaries(
  item: JobResumeDraftItem,
  boundaryById: Map<string, Awaited<ReturnType<typeof loadJobResumeDraftingContext>>["contentPlan"]["claimBoundaries"][number]>,
  issues: JobResumeDraftValidationIssue[],
) {
  const metricAuthorized = item.metricReferences.length > 0 &&
    item.claimTypes.includes("quantified-outcome");
  for (const boundaryId of item.claimBoundaryIds) {
    const boundary = boundaryById.get(boundaryId);
    if (!boundary) continue;
    if (boundary.state === "prohibited") {
      issues.push(issue("CLAIM_BOUNDARY_PROHIBITED", "Draft item references a prohibited claim boundary.", "critical", refs(item)));
    }
    if (item.claimTypes.some((type) =>
      type !== "quantified-outcome" || !metricAuthorized
        ? !boundary.allowedClaimTypes.includes(type)
        : false
    )) {
      issues.push(issue("CLAIM_EXCEEDS_BOUNDARY", "Draft item exceeds an allowed claim boundary.", "critical", refs(item)));
    }
    if (item.claimTypes.some((type) =>
      type !== "quantified-outcome" || !metricAuthorized
        ? boundary.prohibitedClaimTypes.includes(type)
        : false
    )) {
      issues.push(issue("CLAIM_TYPE_PROHIBITED_BY_BOUNDARY", "Draft item uses a claim type prohibited by its boundary.", "critical", refs(item)));
    }
    if (!boundary.requiredQualifierCodes.every((code) => item.qualifiers.includes(code))) {
      issues.push(issue("QUALIFIED_CLAIM_MISSING_QUALIFIER", "Draft item omits a qualifier required by its claim boundary.", "high", refs(item)));
    }
  }
}

function validateMetrics(
  item: JobResumeDraftItem,
  metricById: Map<string, Awaited<ReturnType<typeof loadJobResumeDraftingContext>>["contentPlan"]["metricPermissions"][number]>,
  evidenceById: Map<string, Awaited<ReturnType<typeof loadJobResumeDraftingContext>>["evidenceItems"][number]>,
  issues: JobResumeDraftValidationIssue[],
) {
  const permittedDateText = item.evidenceIds
    .map((id) => evidenceById.get(id)?.dateRange ?? "")
    .join(" ");
  const numericTokens = [...item.text.matchAll(/\b\d+(?:\.\d+)?%?\b/g)]
    .map((match) => match[0])
    .filter((value) => !/^(?:19|20)\d{2}$/.test(value) || !permittedDateText.includes(value));
  for (const reference of item.metricReferences) {
    const permission = metricById.get(reference.metricPermissionId);
    if (
      !permission ||
      permission.state !== "allowed" ||
      permission.evidenceId !== reference.evidenceId ||
      permission.claimId !== reference.claimId ||
      permission.exactApprovedMetricText !== reference.exactApprovedText ||
      hashText(stableJson(permission)) !== reference.permissionSha256 ||
      !item.metricPermissionIds.includes(permission.id)
    ) {
      issues.push(issue("INVALID_METRIC_PERMISSION", "Metric reference does not match an exact allowed plan permission.", "critical", refs(item)));
      continue;
    }
    if (item.text !== reference.exactApprovedText && !item.text.includes(reference.exactApprovedText)) {
      issues.push(issue("ALTERED_VERIFIED_METRIC", "Draft wording changed or omitted the exact approved metric text.", "critical", refs(item)));
    }
  }
  if (numericTokens.length > 0 && item.metricReferences.length === 0) {
    issues.push(issue("UNVERIFIED_METRIC", "Numeric wording requires an exact verified metric permission.", "critical", refs(item)));
  }
  if (item.metricReferences.length > 0 && !item.claimTypes.includes("quantified-outcome")) {
    issues.push(issue("METRIC_CLAIM_TYPE_MISSING", "Metric wording requires quantified-outcome claim permission.", "high", refs(item)));
  }
}

function validateLanguage(
  item: JobResumeDraftItem,
  scaffold: JobResumeDraftScaffold,
  context: Awaited<ReturnType<typeof loadJobResumeDraftingContext>>,
  evidenceById: Map<string, Awaited<ReturnType<typeof loadJobResumeDraftingContext>>["evidenceItems"][number]>,
  claimById: Map<string, Awaited<ReturnType<typeof loadJobResumeDraftingContext>>["claims"][number]>,
  issues: JobResumeDraftValidationIssue[],
) {
  const evidence = item.evidenceIds.map((id) => evidenceById.get(id)).filter((entry) => Boolean(entry));
  const claims = item.claimIds.map((id) => claimById.get(id)).filter((entry) => Boolean(entry));
  const evidenceText = evidence.map((entry) =>
    `${entry!.text} ${entry!.normalizedSummary} ${entry!.dateRange ?? ""} ${entry!.company ?? ""} ${entry!.project ?? ""}`
  ).join(" ");
  const approvedText = `${evidenceText} ${claims.map((entry) => entry!.approvedWording ?? "").join(" ")}`;
  const forbidden: Array<[RegExp, string, string]> = [
    [/\b(visionary leader|world-class|best-in-class|results-driven|thought leader|transformational executive)\b/i, "GENERIC_UNSUPPORTED_LANGUAGE", "Draft contains unsupported inflated language."],
    [/\b(ATS score|ATS optimization|keyword stuffing|hiring probability|recommend(?:ed)? (?:applying|application)|cover letter|screening answer)\b/i, "FORBIDDEN_OUTPUT", "Draft contains prohibited application or ATS content."],
    [/\b(?:current(?:ly)?\s+)?(?:works?|serves?|employed)\s+as\b/i, "CURRENT_EMPLOYMENT_INFERENCE", "Draft implies unsupported current employment."],
    [/\b(?:manages?|managed|directs?|directed)\s+\d+\b/i, "UNSUPPORTED_TEAM_SIZE", "Draft invents management scope or team size."],
    [/\b(?:revenue|budget)\s+(?:of\s+)?[$€£]?\d+/i, "UNSUPPORTED_COMMERCIAL_METRIC", "Draft invents revenue or budget scope."],
    [/\b\d+\s+(?:users?|customers?|employees?|engineers?|reports?)\b/i, "UNSUPPORTED_SCALE", "Draft invents user, customer, or organizational scale."],
    [/\b(?:global|enterprise-wide|company-wide|organization-wide)\s+(?:ownership|authority|leadership|scope)\b/i, "UNSUPPORTED_SCOPE", "Draft invents organizational scope."],
  ];
  for (const [pattern, code, message] of forbidden) {
    if (pattern.test(item.text) && !pattern.test(approvedText)) {
      issues.push(issue(code, message, "critical", refs(item)));
    }
  }
  if (
    item.itemType === "experience-role" &&
    normalizeText(item.text).includes(normalizeText(scaffold.targetTitle)) &&
    !normalizeText(evidenceText).includes(normalizeText(scaffold.targetTitle))
  ) {
    issues.push(issue("TARGET_TITLE_AS_EMPLOYMENT", "Job Target title cannot be represented as current or historical employment.", "critical", refs(item)));
  }
  if (
    ["experience-role", "experience-bullet"].includes(item.itemType) &&
    evidence.length > 0 &&
    evidence.every((entry) => entry!.category === "project" || Boolean(entry!.parentProjectId)) &&
    !evidence.some((entry) => entry!.category === "role" || Boolean(entry!.parentRoleId))
  ) {
    issues.push(issue("PROJECT_SCOPE_AS_EMPLOYMENT", "Project-only evidence cannot be represented as employment experience.", "critical", refs(item)));
  }
  if (
    item.claimTypes.some((type) => ["achievement", "delivery-outcome", "product-outcome", "business-outcome"].includes(type)) &&
    evidence.length > 0 &&
    evidence.every((entry) => entry!.category === "responsibility")
  ) {
    issues.push(issue("RESPONSIBILITY_PRESENTED_AS_ACHIEVEMENT", "Responsibility evidence cannot be upgraded to an achievement.", "critical", refs(item)));
  }
  for (const verb of [...item.text.toLowerCase().matchAll(/\b(owned|managed|directed|established|led)\b/g)].map((match) => match[1])) {
    if (!new RegExp(`\\b${verb}\\b`, "i").test(approvedText)) {
      issues.push(issue("UNSUPPORTED_ACTION_VERB", `Action verb '${verb}' is stronger than the approved evidence.`, "high", refs(item)));
    }
  }
  if (/\b(?:senior|principal|head|chief|executive|cto|vp)\b/i.test(item.text) && !/\b(?:senior|principal|head|chief|executive|cto|vp)\b/i.test(approvedText)) {
    issues.push(issue("UNSUPPORTED_SENIORITY", "Draft introduces unsupported seniority or authority.", "critical", refs(item)));
  }
  if (/\b\d+\s+years?\s+(?:of\s+)?experience\b/i.test(item.text)) {
    issues.push(issue("UNSUPPORTED_AGGREGATE_DURATION", "Aggregate experience duration is not authorized by the plan.", "critical", refs(item)));
  }
  if (item.itemType === "technology") {
    const technologies = evidence
      .flatMap((entry) => entry!.technologies)
      .filter((value): value is string => Boolean(value));
    if (technologies.length > 0 && !technologies.some((technology) =>
      normalizeText(item.text).includes(normalizeText(technology))
    )) {
      issues.push(issue("INVENTED_TECHNOLOGY", "Technical wording is absent from the cited approved evidence.", "critical", refs(item)));
    }
  }
  const years = [...item.text.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => match[0]);
  if (years.some((year) => !approvedText.includes(year))) {
    issues.push(issue("INVENTED_DATE", "Draft introduces a date absent from approved evidence.", "critical", refs(item)));
  }
  if (/\bproduction(?:-grade)?\b/i.test(item.text) && !/\bproduction(?:-grade)?\b/i.test(approvedText)) {
    issues.push(issue("UNSUPPORTED_PRODUCTION_SCOPE", "Draft upgrades evidence to unsupported production scope.", "critical", refs(item)));
  }
  if (/\b(?:adopted by|commercial adoption|customer adoption|market adoption)\b/i.test(item.text)
    && !/\b(?:adopted by|commercial adoption|customer adoption|market adoption)\b/i.test(approvedText)) {
    issues.push(issue("UNSUPPORTED_ADOPTION", "Draft introduces unsupported adoption or traction.", "critical", refs(item)));
  }
  if (/\b(?:hiring authority|budget (?:ownership|control)|performance reviews?|executive reporting|direct reports?)\b/i.test(item.text)
    && !/\b(?:hiring authority|budget (?:ownership|control)|performance reviews?|executive reporting|direct reports?)\b/i.test(approvedText)) {
    issues.push(issue("UNSUPPORTED_MANAGEMENT_SCOPE", "Draft introduces unsupported management authority.", "critical", refs(item)));
  }
  const planSection = context.contentPlan.sections.find((entry) =>
    entry.id === item.provenance.planSectionId
  );
  const allowedTerms = context.contentPlan.requirementEmphasis
    .filter((entry) => item.requirementIds.includes(entry.requirementId))
    .flatMap((entry) => entry.allowedTerminology);
  const normalizedItemText = normalizeText(item.text);
  const normalizedApprovedText = normalizeText(approvedText);
  const unsupportedNamedTechnologies = context.requirementInput.model.namedTechnologies
    .filter((technology) => normalizedItemText.includes(normalizeText(technology)))
    .filter((technology) =>
      !allowedTerms.some((term) => normalizeText(term) === normalizeText(technology)) &&
      !normalizedApprovedText.includes(normalizeText(technology))
    );
  if (unsupportedNamedTechnologies.length > 0) {
    issues.push(issue(
      "UNSUPPORTED_JOB_DESCRIPTION_TERMINOLOGY",
      "Draft introduces named Job Description technology without planned evidence support.",
      "high",
      refs(item),
    ));
  }
  if (planSection && allowedTerms.length === 0 && item.requirementIds.length > 0 && item.text.includes(context.target.company ?? "\0")) {
    issues.push(issue("UNSUPPORTED_JOB_DESCRIPTION_TERMINOLOGY", "Draft introduces Job Description terminology without planned evidence support.", "high", refs(item)));
  }
}

function duplicateAndOveruseIssues(sections: JobResumeDraftSection[]): JobResumeDraftValidationIssue[] {
  const items = sections.flatMap((section) => section.items);
  const issues: JobResumeDraftValidationIssue[] = [];
  const byText = new Map<string, JobResumeDraftItem[]>();
  for (const item of items) {
    const key = normalizeText(item.text);
    byText.set(key, [...(byText.get(key) ?? []), item]);
  }
  for (const duplicates of byText.values()) {
    if (duplicates.length > 1) {
      issues.push(issue("DUPLICATE_STATEMENT", "The same substantive statement appears more than once.", "high", {
        sectionIds: uniqueSorted(duplicates.map((entry) => entry.sectionId)),
        draftItemIds: duplicates.map((entry) => entry.id),
        evidenceIds: uniqueSorted(duplicates.flatMap((entry) => entry.evidenceIds)),
      }));
    }
  }
  const openings = items.map((entry) => normalizeText(entry.text).split(" ")[0]).filter(Boolean);
  for (const opening of new Set(openings)) {
    if (openings.filter((entry) => entry === opening).length >= 4) {
      issues.push(issue("REPEATED_BULLET_OPENING", `Opening word '${opening}' is repeated excessively.`, "medium"));
    }
  }
  return issues;
}

function itemTypesForSection(type: JobResumeDraftScaffold["sections"][number]["sectionType"]): JobResumeDraftItem["itemType"][] {
  return ({
    headline: ["headline"],
    "professional-summary": ["summary"],
    "core-capabilities": ["capability"],
    "selected-impact": ["impact"],
    "professional-experience": ["experience-role", "experience-bullet"],
    "selected-projects": ["project"],
    "technical-capabilities": ["technology"],
    "leadership-capabilities": ["leadership-capability"],
    education: ["education"],
    certifications: ["certification"],
    "additional-information": ["additional-information"],
  })[type] as JobResumeDraftItem["itemType"][];
}
function validateSubset(
  label: string,
  actual: string[],
  allowed: string[],
  item: JobResumeDraftItem,
  issues: JobResumeDraftValidationIssue[],
) {
  const unknown = actual.filter((entry) => !allowed.includes(entry));
  if (unknown.length > 0) {
    issues.push(issue(
      `UNKNOWN_${label.toUpperCase().replace(/\s+/g, "_")}`,
      `Draft item references unplanned ${label} IDs: ${unknown.join(", ")}.`,
      "critical",
      refs(item),
    ));
  }
}
function refs(item: Pick<JobResumeDraftItem,
  "sectionId" | "id" | "requirementIds" | "coverageIds" | "assessmentIds" |
  "evidenceMapLinkIds" | "evidenceIds" | "claimIds" | "claimBoundaryIds"
>) {
  return {
    sectionIds: [item.sectionId],
    draftItemIds: [item.id],
    requirementIds: item.requirementIds,
    coverageIds: item.coverageIds,
    assessmentIds: item.assessmentIds,
    evidenceMapLinkIds: item.evidenceMapLinkIds,
    evidenceIds: item.evidenceIds,
    claimIds: item.claimIds,
    claimBoundaryIds: item.claimBoundaryIds,
  };
}
function issue(
  code: string,
  message: string,
  severity: JobResumeDraftValidationIssue["severity"],
  references: Partial<ReturnType<typeof emptyReferences>> = {},
): JobResumeDraftValidationIssue {
  return { code, message, severity, ...emptyReferences(), ...references };
}
function warning(proposalId: string, code: string, message: string) {
  return {
    id: `job-resume-draft-warning_${hashText([proposalId, code].join("\0")).slice(0, 16)}`,
    code,
    message,
    sectionIds: [],
    draftItemIds: [],
    requirementIds: [],
    evidenceIds: [],
    claimIds: [],
    claimBoundaryIds: [],
  };
}
function emptyReferences() {
  return {
    sectionIds: [] as string[],
    draftItemIds: [] as string[],
    requirementIds: [] as string[],
    coverageIds: [] as string[],
    assessmentIds: [] as string[],
    evidenceMapLinkIds: [] as string[],
    evidenceIds: [] as string[],
    claimIds: [] as string[],
    claimBoundaryIds: [] as string[],
  };
}
function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#./%-]+/g, " ").trim().replace(/\s+/g, " ");
}
function sentenceCount(value: string) {
  return value.split(/[.!?]+(?:\s|$)/).map((entry) => entry.trim()).filter(Boolean).length;
}
function sameSet(left: string[], right: string[]) {
  return left.length === right.length
    && [...left].sort().every((entry, index) => entry === [...right].sort()[index]);
}
function typedUnique<T extends string>(values: T[]): T[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
function uniqueIssues(values: JobResumeDraftValidationIssue[]) {
  const seen = new Set<string>();
  return values.filter((entry) => {
    const key = stableJson(entry);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function uniqueWarnings(values: JobResumeDraftProposal["warnings"]) {
  const seen = new Set<string>();
  return values.filter((entry) => {
    const key = `${entry.code}\0${entry.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function proposalResult(
  proposal: JobResumeDraftProposal,
  result: GenerateJobResumeDraftProposalResult["result"],
): GenerateJobResumeDraftProposalResult {
  const paths = jobResumeDraftProposalPaths("", proposal.targetId, proposal.id, true);
  return {
    targetId: proposal.targetId,
    proposalId: proposal.id,
    result,
    proposalPath: paths.proposalRelativePath,
    manifestPath: paths.manifestRelativePath,
    rawResponsePath: proposal.rawResponsePath,
    sectionCount: proposal.sections.length,
    draftItemCount: proposal.sections.reduce((count, section) => count + section.items.length, 0),
    validationIssueCount: proposal.validationIssues.length,
    requestFingerprint: proposal.requestFingerprint,
  };
}
async function findCachedProposal(workspace: string, targetId: string, fingerprint: string) {
  return (await listJobResumeDraftProposals(workspace, targetId))
    .find((entry) => entry.requestFingerprint === fingerprint && entry.status === "ready-for-review");
}
async function nextProposalId(
  workspace: string,
  targetId: string,
  requestFingerprint: string,
  rawResponseSha256: string,
) {
  for (let ordinal = 1; ; ordinal += 1) {
    const proposalId = `job-resume-draft-proposal_${hashText([
      requestFingerprint,
      rawResponseSha256,
      String(ordinal),
    ].join("\0")).slice(0, 16)}`;
    const paths = jobResumeDraftProposalPaths(workspace, targetId, proposalId);
    if (!(await pathExists(paths.proposalPath)) && !(await pathExists(paths.manifestPath)) && !(await pathExists(paths.rawPath))) {
      return proposalId;
    }
  }
}
export function jobResumeDraftProposalPaths(
  workspace: string,
  targetId: string,
  proposalId: string,
  relativeOnly = false,
) {
  const root = `targets/jobs/${targetId}/resume-drafting/proposals/${proposalId}`;
  const values = {
    proposalRelativePath: `${root}/proposal.json`,
    manifestRelativePath: `${root}/proposal-manifest.json`,
    rawRelativePath: `${root}/raw-model-response.txt`,
  };
  return relativeOnly
    ? { ...values, proposalPath: "", manifestPath: "", rawPath: "" }
    : {
      ...values,
      proposalPath: resolveWithin(workspace, values.proposalRelativePath),
      manifestPath: resolveWithin(workspace, values.manifestRelativePath),
      rawPath: resolveWithin(workspace, values.rawRelativePath),
    };
}
async function locateProposal(workspace: string, proposalId: string) {
  const jobsRoot = path.join(workspace, "targets/jobs");
  if (!(await pathExists(jobsRoot))) return null;
  for (const target of await readdir(jobsRoot, { withFileTypes: true })) {
    if (!target.isDirectory()) continue;
    const paths = jobResumeDraftProposalPaths(workspace, target.name, proposalId);
    if (await pathExists(paths.proposalPath) || await pathExists(paths.manifestPath)) {
      return { targetId: target.name, ...paths };
    }
  }
  return null;
}
function emptyProposalStatus(
  proposalId: string,
  targetId: string,
  status: JobResumeDraftProposalStatus["status"],
  reasons: string[],
  existence: { proposalExists?: boolean; manifestExists?: boolean } = {},
): JobResumeDraftProposalStatus {
  return {
    proposalId,
    targetId,
    proposalExists: existence.proposalExists ?? false,
    manifestExists: existence.manifestExists ?? false,
    rawResponseExists: false,
    proposalHashMatches: null,
    rawResponseHashMatches: null,
    scaffoldHashMatches: null,
    dependenciesMatch: null,
    policyVersionMatches: null,
    status,
    readyForReview: false,
    reasons,
  };
}
function resolveWithin(workspace: string, relativePath: string) {
  const absolute = path.resolve(workspace, relativePath);
  const root = path.resolve(workspace);
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
    throw new Error("Resolved path leaves workspace.");
  }
  return absolute;
}
function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
