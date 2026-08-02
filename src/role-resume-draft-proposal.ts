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
  createModelProviderFromEnvironment,
  type InterpretationModelProvider,
} from "./model-provider.js";
import {
  ModelRoleResumeDraftPayloadSchema,
  RoleResumeDraftProposalManifestSchema,
  RoleResumeDraftProposalSchema,
  type ModelRoleResumeDraftPayload,
  type ResumeDraftAmbiguity,
  type ResumeDraftClaimLedgerEntry,
  type ResumeDraftEvidenceUsage,
  type ResumeDraftValidationIssue,
  type RoleResumeDraftItem,
  type RoleResumeDraftProposal,
  type RoleResumeDraftProposalManifest,
  type RoleResumeDraftScaffold,
  type RoleResumeDraftSection,
} from "./role-resume-draft-schemas.js";
import type { ResumeContentType } from "./role-resume-plan-schemas.js";
import {
  ROLE_RESUME_DRAFTING_POLICY_NAME,
  ROLE_RESUME_DRAFTING_POLICY_VERSION,
  getRoleResumeDraftScaffoldStatus,
  loadRoleResumeDraftingContext,
  showRoleResumeDraftScaffold,
} from "./role-resume-drafting.js";
import { stableJson } from "./target-proposal.js";

export const ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_ID = "target-role-resume-draft-proposal";
export const ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION = "2";
export const ROLE_RESUME_DRAFT_PROMPT_POLICY_VERSION = "2";

export interface GenerateRoleResumeDraftProposalOptions {
  refresh?: boolean;
  provider?: InterpretationModelProvider;
  now?: () => Date;
}
export interface GenerateRoleResumeDraftProposalResult {
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
export interface RoleResumeDraftProposalStatus {
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

export async function generateRoleResumeDraftProposal(
  workspace: string,
  targetId: string,
  options: GenerateRoleResumeDraftProposalOptions = {},
): Promise<GenerateRoleResumeDraftProposalResult> {
  const scaffoldStatus = await getRoleResumeDraftScaffoldStatus(workspace, targetId);
  if (scaffoldStatus.status !== "current") {
    throw new Error(`Role resume draft scaffold must be current before proposal generation. Current status: ${scaffoldStatus.status}`);
  }
  const context = await loadRoleResumeDraftingContext(workspace, targetId);
  const scaffold = await showRoleResumeDraftScaffold(workspace, targetId);
  const draftScaffoldSha256 = await hashFile(resolveWithin(workspace, scaffoldStatus.scaffoldPath));
  const provider = options.provider ?? createModelProviderFromEnvironment();
  const normalizedInput = createRoleResumeDraftModelInput(context, scaffold);
  const normalizedModelInputSha256 = hashText(stableJson(normalizedInput));
  const renderedPrompt = renderRoleResumeDraftPrompt(normalizedInput);
  const renderedPromptSha256 = hashText(renderedPrompt);
  const requestFingerprint = hashText(stableJson({
    targetSha256: context.targetSha256,
    approvedInterpretationSha256: context.approvedInterpretationSha256,
    approvedMatchingSha256: context.approvedMatchingSha256,
    evidenceSnapshotSha256: context.evidenceSnapshotSha256,
    approvedAssessmentSha256: context.approvedAssessmentSha256,
    approvedPlanSha256: context.approvedPlanSha256,
    compositionSha256: context.compositionSha256,
    draftScaffoldSha256,
    policy: { name: ROLE_RESUME_DRAFTING_POLICY_NAME, version: ROLE_RESUME_DRAFTING_POLICY_VERSION },
    provider: provider.providerId,
    model: provider.identity.model,
    settings: provider.settings,
    promptTemplateId: ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_ID,
    promptTemplateVersion: ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION,
    promptPolicyVersion: ROLE_RESUME_DRAFT_PROMPT_POLICY_VERSION,
    normalizedModelInputSha256,
  }));
  if (!options.refresh) {
    const cached = await findCachedProposal(workspace, targetId, requestFingerprint);
    if (cached) {
      const status = await getRoleResumeDraftProposalStatus(workspace, cached.id);
      if (status.status === "current") return proposalResult(cached, "cache-hit");
    }
  }
  const response = await provider.generate({ renderedPrompt, settings: provider.settings });
  if (!response.rawText.length) throw new Error("Model provider returned an empty response.");
  const now = (options.now ?? (() => new Date()))().toISOString();
  const rawResponseSha256 = hashText(response.rawText);
  const proposalId = await nextRoleResumeDraftProposalId(
    workspace,
    targetId,
    requestFingerprint,
    rawResponseSha256,
  );
  const paths = roleResumeDraftProposalPaths(workspace, targetId, proposalId);
  const normalized = normalizeRoleResumeDraftResponse(
    response.rawText,
    proposalId,
    scaffold,
    context,
    draftScaffoldSha256,
  );
  const proposal = RoleResumeDraftProposalSchema.parse({
    schemaVersion: 1,
    id: proposalId,
    requestFingerprint,
    targetId,
    targetType: "role",
    mode: "market-positioning",
    status: normalized.validationIssues.some((entry) => entry.severity === "critical" || entry.severity === "high")
      ? "validation-failed"
      : "ready-for-review",
    draftingPolicy: {
      name: ROLE_RESUME_DRAFTING_POLICY_NAME,
      version: ROLE_RESUME_DRAFTING_POLICY_VERSION,
    },
    model: {
      provider: provider.providerId,
      model: provider.identity.model,
      settings: provider.settings,
    },
    prompt: {
      templateId: ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_ID,
      templateVersion: ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION,
      policyVersion: ROLE_RESUME_DRAFT_PROMPT_POLICY_VERSION,
      renderedPromptSha256,
    },
    input: {
      targetSha256: context.targetSha256,
      approvedInterpretationSha256: context.approvedInterpretationSha256,
      approvedMatchingSha256: context.approvedMatchingSha256,
      evidenceSnapshotSha256: context.evidenceSnapshotSha256,
      approvedAssessmentSha256: context.approvedAssessmentSha256,
      approvedPlanSha256: context.approvedPlanSha256,
      compositionSha256: context.compositionSha256,
      draftScaffoldSha256,
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
  const manifest = RoleResumeDraftProposalManifestSchema.parse({
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
    promptTemplateId: ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_ID,
    promptTemplateVersion: ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION,
    policyVersion: ROLE_RESUME_DRAFT_PROMPT_POLICY_VERSION,
    renderedPromptSha256,
    normalizedModelInputSha256,
    targetSha256: context.targetSha256,
    approvedInterpretationSha256: context.approvedInterpretationSha256,
    approvedMatchingSha256: context.approvedMatchingSha256,
    evidenceSnapshotSha256: context.evidenceSnapshotSha256,
    approvedAssessmentSha256: context.approvedAssessmentSha256,
    approvedPlanSha256: context.approvedPlanSha256,
    compositionSha256: context.compositionSha256,
    draftScaffoldSha256,
    createdAt: now,
    updatedAt: now,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
  return proposalResult(
    proposal,
    proposal.status === "validation-failed" ? "validation-failed" : "created",
  );
}

export async function showRoleResumeDraftProposal(
  workspace: string,
  proposalId: string,
): Promise<RoleResumeDraftProposal> {
  const location = await locateProposal(workspace, proposalId);
  if (!location) throw new Error(`Role resume draft proposal not found: ${proposalId}`);
  return RoleResumeDraftProposalSchema.parse(await readJson<unknown>(location.proposalPath, null));
}

export async function listRoleResumeDraftProposals(
  workspace: string,
  targetId: string,
): Promise<RoleResumeDraftProposal[]> {
  const root = resolveWithin(workspace, `targets/roles/${targetId}/resume-drafting/proposals`);
  if (!(await pathExists(root))) return [];
  const entries = await readdir(root, { withFileTypes: true });
  const proposals = await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
    try {
      return RoleResumeDraftProposalSchema.parse(
        await readJson<unknown>(path.join(root, entry.name, "proposal.json"), null),
      );
    } catch {
      return null;
    }
  }));
  return proposals
    .filter((entry): entry is RoleResumeDraftProposal => Boolean(entry))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getRoleResumeDraftProposalStatus(
  workspace: string,
  proposalId: string,
): Promise<RoleResumeDraftProposalStatus> {
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
  let proposal: RoleResumeDraftProposal;
  let manifest: RoleResumeDraftProposalManifest;
  try {
    proposal = RoleResumeDraftProposalSchema.parse(await readJson<unknown>(location.proposalPath, null));
    manifest = RoleResumeDraftProposalManifestSchema.parse(await readJson<unknown>(location.manifestPath, null));
  } catch (error) {
    return emptyProposalStatus(proposalId, location.targetId, "invalid", [`Malformed proposal: ${errorMessage(error)}`], {
      proposalExists,
      manifestExists,
    });
  }
  const rawPath = resolveWithin(workspace, proposal.rawResponsePath);
  const rawResponseExists = await pathExists(rawPath);
  const proposalHashMatches = await hashFile(location.proposalPath) === manifest.proposalSha256;
  const rawResponseHashMatches = rawResponseExists
    && await hashFile(rawPath) === manifest.rawResponseSha256
    && proposal.rawResponseSha256 === manifest.rawResponseSha256;
  const scaffoldStatus = await getRoleResumeDraftScaffoldStatus(workspace, proposal.targetId);
  const scaffoldHashMatches = scaffoldStatus.status === "current"
    && await hashFile(resolveWithin(workspace, scaffoldStatus.scaffoldPath)) === manifest.draftScaffoldSha256;
  let dependenciesMatch = false;
  try {
    const context = await loadRoleResumeDraftingContext(workspace, proposal.targetId);
    dependenciesMatch = context.targetSha256 === manifest.targetSha256
      && context.approvedInterpretationSha256 === manifest.approvedInterpretationSha256
      && context.approvedMatchingSha256 === manifest.approvedMatchingSha256
      && context.evidenceSnapshotSha256 === manifest.evidenceSnapshotSha256
      && context.approvedAssessmentSha256 === manifest.approvedAssessmentSha256
      && context.approvedPlanSha256 === manifest.approvedPlanSha256
      && context.compositionSha256 === manifest.compositionSha256;
  } catch {
    dependenciesMatch = false;
  }
  const policyVersionMatches = manifest.policyVersion === ROLE_RESUME_DRAFT_PROMPT_POLICY_VERSION
    && proposal.draftingPolicy.name === ROLE_RESUME_DRAFTING_POLICY_NAME
    && proposal.draftingPolicy.version === ROLE_RESUME_DRAFTING_POLICY_VERSION;
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
      ...(!dependenciesMatch ? ["Approved drafting dependencies changed."] : []),
      ...(!policyVersionMatches ? ["Drafting or prompt policy changed."] : []),
      ...proposal.validationIssues
        .filter((entry) => entry.severity === "critical" || entry.severity === "high")
        .map((entry) => entry.message),
    ],
  };
}

export async function replayRoleResumeDraftProposal(workspace: string, proposalId: string) {
  const status = await getRoleResumeDraftProposalStatus(workspace, proposalId);
  if (status.status !== "current") {
    throw new Error(`Replay requires a current role resume draft proposal. Current status: ${status.status}`);
  }
  const proposal = await showRoleResumeDraftProposal(workspace, proposalId);
  const scaffold = await showRoleResumeDraftScaffold(workspace, proposal.targetId);
  const context = await loadRoleResumeDraftingContext(workspace, proposal.targetId);
  const raw = await readFile(resolveWithin(workspace, proposal.rawResponsePath), "utf8");
  const normalized = normalizeRoleResumeDraftResponse(
    raw,
    proposal.id,
    scaffold,
    context,
    proposal.input.draftScaffoldSha256,
  );
  const replayed = RoleResumeDraftProposalSchema.parse({
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
  return { proposalId, originalSha256, replaySha256, matches: originalSha256 === replaySha256 };
}

export function renderRoleResumeDraftPrompt(input: unknown): string {
  return [
    `${ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_ID} v${ROLE_RESUME_DRAFT_PROMPT_TEMPLATE_VERSION}`,
    "Return strict JSON only using the supplied structured draft payload shape.",
    "The approved Role Resume Content Plan is a constraint system. Drafting may not exceed it.",
    "Return the complete professional Role resume described by the deterministic Resume Composition brief.",
    "Preserve every required composition slot. Fixed identity, contact, title, company, date, project, skill, education, and certification text must be returned exactly.",
    "You may word only targeted headlines, professional summaries, capability phrases, and evidence-backed bullets.",
    "Preserve exact target, composition-slot, scaffold-section, plan-section, expectation, assessment, match, evidence, and claim-boundary IDs.",
    "Every substantive statement must cite only the approved evidence actually used.",
    "Do not invent employers, projects, technologies, dates, metrics, team size, revenue, customers, users, geography, seniority, management scope, or authority.",
    "The target role title is positioning context. It is not current or historical employment evidence.",
    "Project evidence remains project-scoped. Responsibilities are not achievements without reviewed outcome evidence.",
    "Quantified wording is allowed only with the exact supplied reviewed metric reference.",
    "Do not perform job-specific tailoring, ATS optimization, hiring prediction, application advice, cover-letter writing, or screening-answer writing.",
    `Policy: ${ROLE_RESUME_DRAFTING_POLICY_NAME} v${ROLE_RESUME_DRAFTING_POLICY_VERSION}.`,
    stableJson(input),
  ].join("\n\n");
}

export function createRoleResumeDraftModelInput(
  context: Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>,
  scaffold: RoleResumeDraftScaffold,
) {
  const allowedEvidenceIds = new Set(scaffold.sections.flatMap((entry) => entry.allowedEvidenceIds));
  const selectedEvidence = context.evidenceItems
    .filter((entry) => allowedEvidenceIds.has(entry.id))
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
      visibility: entry.visibility,
      sensitivityFlags: entry.sensitivityFlags,
    }));
  return {
    target: {
      id: context.target.id,
      type: context.target.type,
      title: context.target.title,
      seniority: context.target.seniority,
      domain: context.target.domain,
    },
    targetProfile: {
      mode: "market-positioning",
      positioningScope: context.approvedPlan.positioning.positioningScope,
      primaryThemes: context.approvedPlan.positioning.primaryThemes.map((entry) => entry.label),
      secondaryThemes: context.approvedPlan.positioning.secondaryThemes.map((entry) => entry.label),
    },
    pageProfile: {
      name: "ats-standard",
      pageSize: "A4",
      layout: "single-column",
      purpose: "Content-fit guidance only; rendering may change presentation but not approved wording.",
    },
    approvedInterpretation: {
      expectations: context.approvedInterpretation.expectations,
    },
    approvedMatching: {
      matches: context.approvedMatching.matches,
      expectationCoverage: context.approvedMatching.expectationCoverage,
    },
    approvedAssessment: context.approvedAssessment,
    approvedPlan: context.approvedPlan,
    resumeComposition: context.composition,
    draftScaffold: scaffold,
    selectedApprovedEvidence: selectedEvidence,
    reviewedMetricEvidenceIds: uniqueSorted([...context.reviewedMetricEvidenceIds]),
    reviewedMetrics: context.reviewedMetrics,
    policy: {
      name: ROLE_RESUME_DRAFTING_POLICY_NAME,
      version: ROLE_RESUME_DRAFTING_POLICY_VERSION,
      statementProvenanceRequired: true,
      reviewedMetricsOnly: true,
      targetTitleIsNotEmploymentEvidence: true,
      projectScopeIsNotEmploymentScope: true,
      jobSpecificContentForbidden: true,
      fixedCompositionFactsMustRemainExact: true,
      completeCareerChronologyRequired: true,
    },
  };
}

export function validateRoleResumeDraftPayload(
  payload: ModelRoleResumeDraftPayload,
  proposalId: string,
  scaffold: RoleResumeDraftScaffold,
  context: Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>,
  scaffoldSha256: string,
) {
  const issues: ResumeDraftValidationIssue[] = [];
  const scaffoldById = new Map(scaffold.sections.map((entry) => [entry.id, entry]));
  const planById = new Map(context.approvedPlan.sections.map((entry) => [entry.id, entry]));
  const evidenceById = new Map(context.evidenceItems.map((entry) => [entry.id, entry]));
  const assessmentById = new Map(context.approvedAssessment.expectationAssessments.map((entry) => [entry.id, entry]));
  const matchById = new Map(context.approvedMatching.matches.map((entry) => [entry.id, entry]));
  const boundaryById = new Map(context.approvedPlan.claimBoundaries.map((entry) => [entry.id, entry]));
  const compositionSlotById = new Map(context.composition.slots.map((entry) => [entry.id, entry]));
  const expectedSectionIds = scaffold.sections.map((entry) => entry.id);
  const actualSectionIds = payload.sections.map((entry) => entry.id);
  if (!sameSet(expectedSectionIds, actualSectionIds)) {
    issues.push(issue("SECTION_SET_MISMATCH", "Proposal section IDs must exactly match the scaffold.", "critical"));
  }
  if (new Set(actualSectionIds).size !== actualSectionIds.length) {
    issues.push(issue("DUPLICATE_SECTION", "Proposal contains duplicate section IDs.", "critical"));
  }

  const normalizedSections: RoleResumeDraftSection[] = payload.sections.map<RoleResumeDraftSection>((section) => {
    const guard = scaffoldById.get(section.id);
    if (!guard) {
      issues.push(issue("UNKNOWN_SECTION", `Unknown scaffold section: ${section.id}`, "critical", { sectionIds: [section.id] }));
      return section;
    }
    const sectionIssues: ResumeDraftValidationIssue[] = [];
    if (
      section.planSectionId !== guard.planSectionId ||
      section.type !== guard.sectionType ||
      section.order !== guard.order
    ) {
      sectionIssues.push(issue("SECTION_BOUNDARY_CHANGED", "Section identity, type, or order differs from the scaffold.", "critical", { sectionIds: [section.id] }));
    }
    if (guard.status === "exclude" && (section.status !== "excluded" || section.items.length)) {
      sectionIssues.push(issue("EXCLUDED_SECTION_DRAFTED", "An excluded section contains draft content.", "critical", { sectionIds: [section.id] }));
    }
    if (section.items.length > guard.maximumItemCount) {
      sectionIssues.push(issue("SECTION_ITEM_LIMIT_EXCEEDED", "Section exceeds its approved item limit.", "high", { sectionIds: [section.id] }));
    }
    const allowedItemTypes = itemTypesForSection(guard.sectionType);
    const normalizedItems = section.items.map((item) => {
      const itemIssues: ResumeDraftValidationIssue[] = [];
      const compositionSlot = compositionSlotById.get(item.compositionSlotId);
      if (!compositionSlot || !guard.compositionSlotIds.includes(item.compositionSlotId)) {
        itemIssues.push(issue("UNKNOWN_COMPOSITION_SLOT", "Draft item does not reference an allowed Resume Composition slot.", "critical", refs(item)));
      } else {
        if (compositionSlot.sectionType !== section.type || compositionSlot.itemType !== item.itemType) {
          itemIssues.push(issue("COMPOSITION_SLOT_TYPE_CHANGED", "Draft item changed its composition section or item type.", "critical", refs(item)));
        }
        if (compositionSlot.mode === "fixed" && item.text !== compositionSlot.exactText) {
          itemIssues.push(issue("FIXED_CAREER_FACT_CHANGED", `Fixed Career Twin content must remain exact: ${compositionSlot.sourceLabel}.`, "critical", refs(item)));
        }
        if (
          !sameSet(item.sourceExpectationIds, compositionSlot.sourceExpectationIds)
          || !sameSet(item.sourceAssessmentIds, compositionSlot.sourceAssessmentIds)
          || !sameSet(item.approvedMatchIds, compositionSlot.approvedMatchIds)
          || !sameSet(item.evidenceIds, compositionSlot.evidenceIds)
          || !sameSet(item.claimBoundaryIds, compositionSlot.claimBoundaryIds)
        ) {
          itemIssues.push(issue("COMPOSITION_PROVENANCE_CHANGED", "Draft item references differ from its deterministic composition slot.", "critical", refs(item)));
        }
      }
      if (item.sectionId !== section.id || !allowedItemTypes.includes(item.itemType)) {
        itemIssues.push(issue("INVALID_ITEM_TYPE", "Draft item type or section reference is invalid.", "critical", {
          sectionIds: [section.id],
          draftItemIds: [item.id],
        }));
      }
      validateReferenceSubset("expectation", item.sourceExpectationIds, guard.allowedExpectationIds, itemIssues, item);
      validateReferenceSubset("assessment", item.sourceAssessmentIds, guard.allowedAssessmentIds, itemIssues, item);
      validateReferenceSubset("match", item.approvedMatchIds, guard.allowedMatchIds, itemIssues, item);
      validateReferenceSubset("evidence", item.evidenceIds, guard.allowedEvidenceIds, itemIssues, item);
      validateReferenceSubset("claim boundary", item.claimBoundaryIds, guard.allowedClaimBoundaryIds, itemIssues, item);
      if (compositionSlot?.mode !== "fixed" && (!item.evidenceIds.length || !item.claimBoundaryIds.length)) {
        itemIssues.push(issue("PROVENANCE_INCOMPLETE", "Every substantive draft item requires evidence and claim-boundary references.", "critical", refs(item)));
      }
      if (item.claimTypes.some((entry) => !guard.allowedClaimTypes.includes(entry))) {
        itemIssues.push(issue("CLAIM_TYPE_NOT_ALLOWED", "Draft item uses a claim type not allowed by the plan section.", "critical", refs(item)));
      }
      if (item.claimTypes.some((entry) => guard.prohibitedClaimTypes.includes(entry))) {
        itemIssues.push(issue("PROHIBITED_CLAIM_TYPE", "Draft item uses a prohibited claim type.", "critical", refs(item)));
      }
      for (const id of item.sourceAssessmentIds) if (!assessmentById.has(id)) itemIssues.push(issue("UNKNOWN_ASSESSMENT", `Unknown assessment: ${id}`, "critical", refs(item)));
      for (const id of item.approvedMatchIds) if (!matchById.has(id)) itemIssues.push(issue("UNKNOWN_MATCH", `Unknown approved match: ${id}`, "critical", refs(item)));
      for (const id of item.evidenceIds) if (!evidenceById.has(id)) itemIssues.push(issue("UNKNOWN_EVIDENCE", `Unknown evidence: ${id}`, "critical", refs(item)));
      for (const id of item.claimBoundaryIds) if (!boundaryById.has(id)) itemIssues.push(issue("UNKNOWN_CLAIM_BOUNDARY", `Unknown claim boundary: ${id}`, "critical", refs(item)));
      if (compositionSlot?.mode !== "fixed") {
        validateClaimBoundaries(item, boundaryById, itemIssues);
        validateMetrics(item, guard.metricPermission, context, evidenceById, itemIssues);
        validateLanguage(item, scaffold, context, evidenceById, itemIssues);
      }
      if (guard.maximumSentenceCount && sentenceCount(item.text) > guard.maximumSentenceCount) {
        itemIssues.push(issue("SENTENCE_LIMIT_EXCEEDED", "Draft item exceeds the approved sentence limit.", "high", refs(item)));
      }
      if (guard.requiredQualifiers.some((qualifier) => !item.qualifiers.includes(qualifier))) {
        itemIssues.push(issue("REQUIRED_QUALIFIER_MISSING", "Draft item omits a qualifier required by the claim boundary.", "high", refs(item)));
      }
      const id = `role-resume-draft-item_${hashText([
        proposalId,
        section.id,
        item.compositionSlotId,
        item.itemType,
        normalizeText(item.text),
        uniqueSorted(item.sourceExpectationIds).join(","),
        uniqueSorted(item.evidenceIds).join(","),
        uniqueSorted(item.claimBoundaryIds).join(","),
      ].join("\0")).slice(0, 16)}`;
      const validationStatus: RoleResumeDraftItem["validation"]["status"] = itemIssues.some((entry) => entry.severity === "critical" || entry.severity === "high")
        ? "invalid"
        : itemIssues.length ? "requires-review" : "valid";
      issues.push(...itemIssues);
      return {
        ...item,
        id,
        sectionId: section.id,
        sourceExpectationIds: uniqueSorted(item.sourceExpectationIds),
        sourceAssessmentIds: uniqueSorted(item.sourceAssessmentIds),
        approvedMatchIds: uniqueSorted(item.approvedMatchIds),
        evidenceIds: uniqueSorted(item.evidenceIds),
        claimBoundaryIds: uniqueSorted(item.claimBoundaryIds),
        claimTypes: typedUnique(item.claimTypes),
        qualifiers: uniqueSorted(item.qualifiers),
        trustState: "model-proposed" as const,
        validation: { status: validationStatus, issues: itemIssues },
        provenance: {
          targetId: context.target.id,
          approvedPlanId: context.approvedPlan.id,
          compositionId: context.composition.id,
          compositionSlotId: item.compositionSlotId,
          planSectionId: guard.planSectionId,
          proposalId,
          draftingPolicy: {
            name: ROLE_RESUME_DRAFTING_POLICY_NAME,
            version: ROLE_RESUME_DRAFTING_POLICY_VERSION,
          },
          artifactHashes: {
            approvedInterpretationSha256: context.approvedInterpretationSha256,
            approvedMatchingSha256: context.approvedMatchingSha256,
            approvedAssessmentSha256: context.approvedAssessmentSha256,
            approvedPlanSha256: context.approvedPlanSha256,
            compositionSha256: context.compositionSha256,
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
      objective: planById.get(guard.planSectionId)?.objective ?? section.objective,
      status: guard.status === "exclude"
        ? "excluded" as const
        : normalizedItems.length
          ? sectionIssues.length || normalizedItems.some((entry) => entry.validation.status !== "valid")
            ? "requires-review" as const
            : "drafted" as const
          : "empty" as const,
      items: normalizedItems,
      provenance: {
        targetId: context.target.id,
        approvedPlanId: context.approvedPlan.id,
        compositionId: context.composition.id,
        planSectionId: guard.planSectionId,
        approvedPlanSha256: context.approvedPlanSha256,
        draftingPolicy: {
          name: ROLE_RESUME_DRAFTING_POLICY_NAME,
          version: ROLE_RESUME_DRAFTING_POLICY_VERSION,
        },
      },
    };
  });

  const itemIds = normalizedSections.flatMap((entry) => entry.items.map((item) => item.id));
  const representedSlotIds = normalizedSections.flatMap((entry) => entry.items.map((item) => item.compositionSlotId));
  const missingRequiredSlots = scaffold.sections.flatMap((entry) => entry.requiredCompositionSlotIds)
    .filter((id) => !representedSlotIds.includes(id));
  if (missingRequiredSlots.length) {
    issues.push(issue("REQUIRED_COMPOSITION_CONTENT_MISSING", `Proposal omitted ${missingRequiredSlots.length} required Resume Composition slot(s).`, "critical"));
  }
  if (new Set(representedSlotIds).size !== representedSlotIds.length) {
    issues.push(issue("DUPLICATE_COMPOSITION_SLOT", "Proposal represents one Resume Composition slot more than once.", "critical"));
  }
  if (new Set(itemIds).size !== itemIds.length) {
    issues.push(issue("DUPLICATE_DRAFT_ITEM", "Proposal contains duplicate draft items.", "high"));
  }
  issues.push(...duplicateIssues(normalizedSections));
  const claimLedger = buildClaimLedger(normalizedSections, context);
  const evidenceUsage = buildEvidenceUsage(normalizedSections, scaffold);
  const warnings = uniqueWarnings([
    ...payload.warnings,
    {
      id: `draft-warning_${hashText([proposalId, "MODEL_DRAFT_REQUIRES_HUMAN_REVIEW"].join("\0")).slice(0, 16)}`,
      code: "MODEL_DRAFT_REQUIRES_HUMAN_REVIEW",
      message: "Model-proposed resume wording requires complete human review before approval.",
      ...emptyReferences(),
    },
    {
      id: `draft-warning_${hashText([proposalId, "DRAFT_NOT_RENDERED"].join("\0")).slice(0, 16)}`,
      code: "DRAFT_NOT_RENDERED",
      message: "This structured draft has not been rendered.",
      ...emptyReferences(),
    },
    {
      id: `draft-warning_${hashText([proposalId, "DRAFT_NOT_EXPORTED"].join("\0")).slice(0, 16)}`,
      code: "DRAFT_NOT_EXPORTED",
      message: "This structured draft has not been exported as Markdown, HTML, DOCX, or PDF.",
      ...emptyReferences(),
    },
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

export function buildClaimLedger(
  sections: RoleResumeDraftSection[],
  context: Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>,
): ResumeDraftClaimLedgerEntry[] {
  const assessmentById = new Map(
    context.approvedAssessment.expectationAssessments.map((entry) => [entry.id, entry]),
  );
  return sections.flatMap((section) => section.items.map((item) => {
    const assessments = item.sourceAssessmentIds
      .map((id) => assessmentById.get(id))
      .filter((entry) => Boolean(entry));
    const strongest = assessments.some((entry) => entry!.supportStatus === "strongly-supported")
      ? "direct"
      : item.evidenceIds.length > 1
        ? "corroborated"
        : assessments.some((entry) => entry!.supportStatus === "partially-supported")
          ? "qualified"
          : "contextual";
    return {
      id: `resume-draft-claim_${hashText([
        item.id,
        hashText(normalizeText(item.text)),
        ROLE_RESUME_DRAFTING_POLICY_VERSION,
      ].join("\0")).slice(0, 16)}`,
      draftItemId: item.id,
      statementTextSha256: hashText(item.text),
      claimTypes: item.claimTypes,
      expectationIds: item.sourceExpectationIds,
      assessmentIds: item.sourceAssessmentIds,
      approvedMatchIds: item.approvedMatchIds,
      evidenceIds: item.evidenceIds,
      claimBoundaryIds: item.claimBoundaryIds,
      supportLevel: strongest,
      metricStatus: item.metricReferences.length
        ? "reviewed-metric-used"
        : item.claimTypes.includes("quantified-outcome")
          ? "metric-prohibited"
          : "not-applicable",
      scopeStatus: item.scopeReferences.some((entry) => entry.status === "qualified")
        ? "qualified-scope"
        : item.validation.status === "requires-review"
          ? "requires-review"
          : "within-approved-scope",
      validationStatus: item.validation.status,
      validationIssues: item.validation.issues,
    };
  }));
}

export function buildEvidenceUsage(
  sections: RoleResumeDraftSection[],
  scaffold: RoleResumeDraftScaffold,
): ResumeDraftEvidenceUsage[] {
  const selected = uniqueSorted(scaffold.sections.flatMap((entry) => entry.allowedEvidenceIds));
  const items = sections.flatMap((section) => section.items.map((item) => ({ section, item })));
  return selected.map((evidenceId) => {
    const used = items.filter(({ item }) => item.evidenceIds.includes(evidenceId));
    const claimTypes = typedUnique(used.flatMap(({ item }) => item.claimTypes));
    const maximumUses = Math.max(1, scaffold.sections.filter((entry) => entry.allowedEvidenceIds.includes(evidenceId)).length * 2);
    return {
      evidenceId,
      draftItemIds: uniqueSorted(used.map(({ item }) => item.id)),
      sectionIds: uniqueSorted(used.map(({ section }) => section.id)),
      claimTypes,
      usageCount: used.length,
      status: used.length === 0
        ? "unused-selected-evidence"
        : used.length > maximumUses
          ? "overused"
          : "within-policy",
      notes: used.length === 0
        ? ["Selected evidence was not used in this proposal."]
        : used.length > maximumUses
          ? ["Evidence appears in more draft items than the conservative policy permits."]
          : [],
    };
  });
}

export function formatRoleResumeDraftProposalResult(result: GenerateRoleResumeDraftProposalResult) {
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
export function formatRoleResumeDraftProposalList(proposals: RoleResumeDraftProposal[]) {
  return proposals.length
    ? proposals.map((entry) => `${entry.id} | ${entry.status} | items=${entry.sections.flatMap((section) => section.items).length} | ${entry.createdAt}`).join("\n")
    : "No role resume draft proposals found.";
}
export function formatRoleResumeDraftProposalStatus(status: RoleResumeDraftProposalStatus) {
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

function normalizeRoleResumeDraftResponse(
  raw: string,
  proposalId: string,
  scaffold: RoleResumeDraftScaffold,
  context: Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>,
  scaffoldSha256: string,
) {
  let payload: ModelRoleResumeDraftPayload;
  try {
    payload = ModelRoleResumeDraftPayloadSchema.parse(JSON.parse(raw));
  } catch (error) {
    return {
      sections: [],
      claimLedger: [],
      evidenceUsage: buildEvidenceUsage([], scaffold),
      warnings: [],
      ambiguities: [],
      validationIssues: [issue("MALFORMED_OR_SCHEMA_INVALID", errorMessage(error), "critical")],
    };
  }
  return validateRoleResumeDraftPayload(payload, proposalId, scaffold, context, scaffoldSha256);
}

function validateClaimBoundaries(
  item: RoleResumeDraftItem,
  boundaryById: Map<string, Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>["approvedPlan"]["claimBoundaries"][number]>,
  issues: ResumeDraftValidationIssue[],
) {
  for (const id of item.claimBoundaryIds) {
    const boundary = boundaryById.get(id);
    if (!boundary) continue;
    if (boundary.boundaryType === "prohibited") {
      issues.push(issue("CLAIM_BOUNDARY_PROHIBITED", "Draft item references a prohibited claim boundary.", "critical", refs(item)));
    }
    const headlinePositioningClaim = item.itemType === "headline"
      && item.claimTypes.every((type) => type === "role-title" || type === "capability-theme");
    if (!headlinePositioningClaim && item.claimTypes.some((type) => !boundary.allowedClaimTypes.includes(type))) {
      issues.push(issue("CLAIM_EXCEEDS_BOUNDARY", "Draft item exceeds an approved claim boundary.", "critical", refs(item)));
    }
    if (!headlinePositioningClaim && item.claimTypes.some((type) => boundary.prohibitedClaimTypes.includes(type))) {
      issues.push(issue("CLAIM_TYPE_PROHIBITED_BY_BOUNDARY", "Draft item uses a claim type prohibited by its boundary.", "critical", refs(item)));
    }
    if (boundary.boundaryType === "allowed-with-caution" || boundary.boundaryType === "requires-review") {
      if (!boundary.requiredQualifiers.every((qualifier) => item.qualifiers.includes(qualifier))) {
        issues.push(issue("QUALIFIED_CLAIM_MISSING_QUALIFIER", "Cautious claim wording omits a required qualifier.", "high", refs(item)));
      }
    }
  }
}

function validateMetrics(
  item: RoleResumeDraftItem,
  permission: "reviewed-only" | "prohibited",
  context: Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>,
  evidenceById: Map<string, Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>["evidenceItems"][number]>,
  issues: ResumeDraftValidationIssue[],
) {
  const evidenceText = item.evidenceIds
    .map((id) => evidenceById.get(id))
    .filter((entry) => Boolean(entry))
    .map((entry) => `${entry!.text} ${entry!.normalizedSummary} ${entry!.dateRange ?? ""}`)
    .join(" ");
  const numeric = [...item.text.matchAll(/\b\d+(?:\.\d+)?%?\b/g)]
    .map((entry) => entry[0])
    .filter((value) => !/^(?:19|20)\d{2}$/.test(value) || !evidenceText.includes(value));
  if ((numeric.length || item.metricReferences.length || item.claimTypes.includes("quantified-outcome")) && permission === "prohibited") {
    issues.push(issue("UNSUPPORTED_METRIC", "Quantified wording is prohibited for this section.", "critical", refs(item)));
  }
  for (const metric of item.metricReferences) {
    if (!context.reviewedMetricEvidenceIds.has(metric.evidenceId) || !item.evidenceIds.includes(metric.evidenceId)) {
      issues.push(issue("UNREVIEWED_METRIC", "Metric reference is not tied to approved resume-ready verified evidence.", "critical", refs(item)));
      continue;
    }
    const evidence = evidenceById.get(metric.evidenceId);
    const source = `${evidence?.text ?? ""} ${evidence?.normalizedSummary ?? ""}`;
    if (!source.includes(metric.originalValue) || !item.text.includes(metric.originalValue)) {
      issues.push(issue("ALTERED_METRIC", "Metric wording does not preserve the exact reviewed value.", "critical", refs(item)));
    }
    if (!metric.unit || !metric.attributionScope) {
      issues.push(issue("METRIC_CONTEXT_INCOMPLETE", "Reviewed metric requires unit and attribution scope.", "high", refs(item)));
    }
  }
  if (numeric.length && !item.metricReferences.length) {
    issues.push(issue("METRIC_REFERENCE_MISSING", "Numeric wording requires an exact reviewed metric reference.", "critical", refs(item)));
  }
  const referencedValues = new Set(item.metricReferences.map((metric) => metric.originalValue));
  if (numeric.some((value) => !referencedValues.has(value))) {
    issues.push(issue("ALTERED_METRIC", "Every visible numeric value must exactly match its reviewed metric reference.", "critical", refs(item)));
  }
  if (item.metricReferences.length && !item.claimTypes.includes("quantified-outcome")) {
    issues.push(issue("METRIC_CLAIM_TYPE_MISSING", "Metric reference requires quantified-outcome claim permission.", "high", refs(item)));
  }
}

function validateLanguage(
  item: RoleResumeDraftItem,
  scaffold: RoleResumeDraftScaffold,
  context: Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>,
  evidenceById: Map<string, Awaited<ReturnType<typeof loadRoleResumeDraftingContext>>["evidenceItems"][number]>,
  issues: ResumeDraftValidationIssue[],
) {
  const text = item.text.trim();
  const evidenceText = item.evidenceIds
    .map((id) => evidenceById.get(id))
    .filter((entry) => Boolean(entry))
    .map((entry) => `${entry!.text} ${entry!.normalizedSummary} ${entry!.company ?? ""} ${entry!.project ?? ""} ${entry!.dateRange ?? ""} ${(entry!.technologies ?? []).join(" ")}`)
    .join(" ");
  const approvedText = `${evidenceText} ${context.target.title} ${context.approvedPlan.positioning.primaryThemes.map((entry) => entry.label).join(" ")}`;
  const forbidden: Array<[RegExp, string, string]> = [
    [/\b(visionary leader|world-class|best-in-class|exceptional|renowned|highly accomplished|results-driven|dynamic professional|thought leader|industry-leading|transformational leader)\b/i, "GENERIC_UNSUPPORTED_LANGUAGE", "Draft contains unsupported inflated language."],
    [/\b(proven expert|proven track record)\b/i, "UNSUPPORTED_PROVEN_CLAIM", "Draft contains an unsupported proven/expert claim."],
    [/\b(ATS score|ATS optimization|keyword stuffing|hiring probability|recommend(?:ed)? (?:applying|application)|cover letter|screening answer)\b/i, "FORBIDDEN_OUTPUT", "Draft contains prohibited application or ATS content."],
    [/\b(?:current(?:ly)?\s+)?(?:works?|serves?|employed)\s+as\b/i, "CURRENT_EMPLOYMENT_INFERENCE", "Draft implies unsupported current employment."],
    [/\b(?:manages?|managed|directs?|directed)\s+\d+\b/i, "UNSUPPORTED_TEAM_SIZE", "Draft invents management scope or team size."],
    [/\b(?:revenue|budget)\s+(?:of\s+)?[$€£]?\d+/i, "UNSUPPORTED_COMMERCIAL_METRIC", "Draft invents revenue or budget scope."],
    [/\b\d+\s+(?:users?|customers?|employees?|engineers?|reports?)\b/i, "UNSUPPORTED_SCALE", "Draft invents user, customer, or organizational scale."],
    [/\b(?:global|enterprise-wide|company-wide|organization-wide)\s+(?:ownership|authority|leadership|scope)\b/i, "UNSUPPORTED_SCOPE", "Draft invents organizational scope."],
  ];
  for (const [pattern, code, message] of forbidden) {
    if (pattern.test(text) && !pattern.test(approvedText)) issues.push(issue(code, message, "critical", refs(item)));
  }
  if (
    item.itemType === "experience-role" &&
    normalizeText(text).includes(normalizeText(scaffold.roleTitle)) &&
    !normalizeText(evidenceText).includes(normalizeText(scaffold.roleTitle))
  ) {
    issues.push(issue("TARGET_TITLE_AS_EMPLOYMENT", "Target role title cannot be represented as historical employment.", "critical", refs(item)));
  }
  const evidence = item.evidenceIds.map((id) => evidenceById.get(id)).filter((entry) => Boolean(entry));
  if (
    ["experience-role", "experience-bullet"].includes(item.itemType) &&
    evidence.length &&
    evidence.every((entry) => entry!.category === "project" || Boolean(entry!.parentProjectId)) &&
    !evidence.some((entry) => entry!.category === "role" || Boolean(entry!.parentRoleId))
  ) {
    issues.push(issue("PROJECT_SCOPE_AS_EMPLOYMENT", "Project-only evidence cannot be represented as employment experience.", "critical", refs(item)));
  }
  if (
    item.claimTypes.some((entry) => ["achievement", "delivery-outcome", "product-outcome", "business-outcome"].includes(entry)) &&
    evidence.length &&
    evidence.every((entry) => entry!.category === "responsibility")
  ) {
    issues.push(issue("RESPONSIBILITY_PRESENTED_AS_ACHIEVEMENT", "Responsibility evidence cannot be converted into an outcome.", "critical", refs(item)));
  }
  const authorityVerbs = [...text.toLowerCase().matchAll(/\b(owned|managed|directed|established|led)\b/g)].map((entry) => entry[1]);
  for (const verb of authorityVerbs) {
    if (!new RegExp(`\\b${verb}\\b`, "i").test(evidenceText)) {
      issues.push(issue("UNSUPPORTED_ACTION_VERB", `Action verb '${verb}' is stronger than the cited evidence.`, "high", refs(item)));
    }
  }
  if (/\b(?:senior|principal|head|chief|executive|cto|vp)\b/i.test(text) && !/\b(?:senior|principal|head|chief|executive|cto|vp)\b/i.test(approvedText)) {
    issues.push(issue("UNSUPPORTED_SENIORITY", "Draft introduces unsupported seniority or executive scope.", "critical", refs(item)));
  }
  if (/\b\d+\s+years?\s+(?:of\s+)?experience\b/i.test(text)) {
    issues.push(issue("UNSUPPORTED_AGGREGATE_DURATION", "Aggregate years of experience are not calculated in this slice.", "critical", refs(item)));
  }
  if (/\b(?:reviewed (?:role|project|professional|education|evidence)|within reviewed scope|evaluated .+ in a reviewed project)\b/i.test(text)) {
    issues.push(issue("AUDIT_PLACEHOLDER_LANGUAGE", "Draft contains internal audit phrasing instead of market-facing resume language.", "high", refs(item)));
  }
  if (/\b(I|my|me)\b/.test(text)) {
    issues.push(issue("FIRST_PERSON_LANGUAGE", "First-person language requires review and is not permitted by the default drafting policy.", "medium", refs(item)));
  }
  const organizationMatch = text.match(/\b(?:at|for)\s+([A-Z][A-Za-z0-9&.-]*(?:\s+[A-Z][A-Za-z0-9&.-]*){0,3})/);
  if (organizationMatch && !approvedText.includes(organizationMatch[1])) {
    issues.push(issue("INVENTED_EMPLOYER", "Draft introduces an organization absent from cited reviewed evidence.", "critical", refs(item)));
  }
  if (item.itemType === "technology") {
    const knownTechnologies = evidence
      .flatMap((entry) => entry!.technologies)
      .filter((value): value is string => Boolean(value));
    if (knownTechnologies.length && !knownTechnologies.some((technology) => normalizeText(text).includes(normalizeText(technology)))) {
      issues.push(issue("INVENTED_TECHNOLOGY", "Technical capability wording is not present in cited reviewed evidence.", "critical", refs(item)));
    }
  }
  if (/\bproduction(?:-grade)?\b/i.test(text) && !/\bproduction(?:-grade)?\b/i.test(evidenceText)) {
    issues.push(issue("EXPERIMENT_PRESENTED_AS_PRODUCTION", "Draft upgrades experimental evidence to unsupported production scope.", "critical", refs(item)));
  }
  if (
    /\b(?:adopted by|commercial adoption|customer adoption|market adoption)\b/i.test(text) &&
    !/\b(?:adopted by|commercial adoption|customer adoption|market adoption)\b/i.test(evidenceText)
  ) {
    issues.push(issue("UNSUPPORTED_ADOPTION", "Draft introduces adoption or commercial traction absent from cited evidence.", "critical", refs(item)));
  }
  if (
    /\b(?:hiring authority|budget (?:ownership|control)|performance reviews?|executive reporting|direct reports?)\b/i.test(text) &&
    !/\b(?:hiring authority|budget (?:ownership|control)|performance reviews?|executive reporting|direct reports?)\b/i.test(evidenceText)
  ) {
    issues.push(issue("UNSUPPORTED_MANAGEMENT_SCOPE", "Draft introduces management or organizational authority absent from cited evidence.", "critical", refs(item)));
  }
  if (/\bexpert(?:ise)?\s+(?:in|with)\b/i.test(text) && !/\bexpert(?:ise)?\s+(?:in|with)\b/i.test(evidenceText)) {
    issues.push(issue("UNSUPPORTED_EXPERTISE_LEVEL", "Draft upgrades technical familiarity to unsupported expertise.", "high", refs(item)));
  }
  const statedYears = [...text.matchAll(/\b(?:19|20)\d{2}\b/g)].map((match) => match[0]);
  if (statedYears.some((year) => !evidenceText.includes(year))) {
    issues.push(issue("INVENTED_DATE", "Draft introduces a date absent from cited reviewed evidence.", "critical", refs(item)));
  }
  if (
    item.itemType === "certification" &&
    /\b(?:active|current|valid)\b/i.test(text) &&
    !/\b(?:active|current|valid)\b/i.test(evidenceText)
  ) {
    issues.push(issue("UNSUPPORTED_CERTIFICATION_STATUS", "Draft infers a certification status absent from cited reviewed evidence.", "critical", refs(item)));
  }
  if (
    item.itemType === "education" &&
    /\b(?:completed|graduated|earned)\b/i.test(text) &&
    !/\b(?:completed|graduated|earned)\b/i.test(evidenceText)
  ) {
    issues.push(issue("UNSUPPORTED_EDUCATION_COMPLETION", "Draft infers completion status absent from cited reviewed evidence.", "critical", refs(item)));
  }
}

function duplicateIssues(sections: RoleResumeDraftSection[]): ResumeDraftValidationIssue[] {
  const items = sections.flatMap((section) => section.items);
  const issues: ResumeDraftValidationIssue[] = [];
  const byText = new Map<string, RoleResumeDraftItem[]>();
  for (const item of items) {
    const key = normalizeText(item.text);
    byText.set(key, [...(byText.get(key) ?? []), item]);
  }
  for (const duplicates of byText.values()) {
    if (duplicates.length > 1) {
      issues.push(issue("DUPLICATE_CLAIM", "The same substantive statement appears more than once.", "high", {
        draftItemIds: duplicates.map((entry) => entry.id),
        evidenceIds: uniqueSorted(duplicates.flatMap((entry) => entry.evidenceIds)),
      }));
    }
  }
  const verbs = items.map((item) => item.text.trim().split(/\s+/)[0]?.toLowerCase()).filter(Boolean);
  for (const verb of new Set(verbs)) {
    if (verbs.filter((entry) => entry === verb).length >= 4) {
      issues.push(issue("REPEATED_OPENING_VERB", `Opening verb '${verb}' is repeated excessively.`, "medium"));
    }
  }
  return issues;
}

function itemTypesForSection(type: RoleResumeDraftScaffold["sections"][number]["sectionType"]): RoleResumeDraftItem["itemType"][] {
  return ({
    headline: ["identity", "contact", "headline"],
    "professional-summary": ["summary"],
    "core-capabilities": ["capability"],
    "selected-impact": ["impact"],
    "professional-experience": ["experience-role", "experience-bullet"],
    "selected-projects": ["project", "project-bullet"],
    "technical-capabilities": ["technology"],
    "leadership-capabilities": ["leadership-capability"],
    education: ["education"],
    certifications: ["certification"],
    "additional-information": ["additional-information"],
  })[type] as RoleResumeDraftItem["itemType"][];
}
function validateReferenceSubset(
  label: string,
  actual: string[],
  allowed: string[],
  issues: ResumeDraftValidationIssue[],
  item: RoleResumeDraftItem,
) {
  const unknown = actual.filter((entry) => !allowed.includes(entry));
  if (unknown.length) issues.push(issue(`UNKNOWN_${label.toUpperCase().replace(/\s+/g, "_")}`, `Draft item references unapproved ${label} IDs: ${unknown.join(", ")}.`, "critical", refs(item)));
}
function refs(item: Pick<RoleResumeDraftItem, "sectionId" | "id" | "sourceExpectationIds" | "approvedMatchIds" | "evidenceIds" | "claimBoundaryIds">) {
  return {
    sectionIds: [item.sectionId],
    draftItemIds: [item.id],
    expectationIds: item.sourceExpectationIds,
    matchIds: item.approvedMatchIds,
    evidenceIds: item.evidenceIds,
    claimBoundaryIds: item.claimBoundaryIds,
  };
}
function issue(
  code: string,
  message: string,
  severity: ResumeDraftValidationIssue["severity"],
  references: Partial<ReturnType<typeof emptyReferences>> = {},
): ResumeDraftValidationIssue {
  return {
    code,
    message,
    severity,
    ...emptyReferences(),
    ...references,
  };
}
function emptyReferences() {
  return {
    sectionIds: [] as string[],
    draftItemIds: [] as string[],
    expectationIds: [] as string[],
    matchIds: [] as string[],
    evidenceIds: [] as string[],
    claimBoundaryIds: [] as string[],
  };
}
function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#./%-]+/g, " ").trim().replace(/\s+/g, " ");
}
function sentenceCount(value: string) {
  return value.split(/[.!?]+(?:\s|$)/).map((entry) => entry.trim()).filter(Boolean).length;
}
function sameSet(a: string[], b: string[]) {
  return a.length === b.length && [...a].sort().every((entry, index) => entry === [...b].sort()[index]);
}
function typedUnique<T extends string>(values: T[]): T[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}
function uniqueIssues(values: ResumeDraftValidationIssue[]) {
  const seen = new Set<string>();
  return values.filter((entry) => {
    const key = stableJson(entry);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function uniqueWarnings(values: RoleResumeDraftProposal["warnings"]) {
  const seen = new Set<string>();
  return values.filter((entry) => {
    const key = `${entry.code}\0${entry.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function proposalResult(
  proposal: RoleResumeDraftProposal,
  result: GenerateRoleResumeDraftProposalResult["result"],
): GenerateRoleResumeDraftProposalResult {
  const paths = roleResumeDraftProposalPaths("", proposal.targetId, proposal.id, true);
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
  return (await listRoleResumeDraftProposals(workspace, targetId))
    .find((entry) => entry.requestFingerprint === fingerprint && entry.status === "ready-for-review");
}
async function nextRoleResumeDraftProposalId(
  workspace: string,
  targetId: string,
  requestFingerprint: string,
  rawResponseSha256: string,
) {
  for (let ordinal = 1; ; ordinal += 1) {
    const proposalId = `role-resume-draft-proposal_${hashText([
      requestFingerprint,
      rawResponseSha256,
      String(ordinal),
    ].join("\0")).slice(0, 16)}`;
    const paths = roleResumeDraftProposalPaths(workspace, targetId, proposalId);
    const occupied = await Promise.all([
      pathExists(paths.proposalPath),
      pathExists(paths.manifestPath),
      pathExists(paths.rawPath),
    ]);
    if (!occupied.some(Boolean)) return proposalId;
  }
}
export function roleResumeDraftProposalPaths(
  workspace: string,
  targetId: string,
  proposalId: string,
  relativeOnly = false,
) {
  const root = `targets/roles/${targetId}/resume-drafting/proposals/${proposalId}`;
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
  const rolesRoot = path.join(workspace, "targets/roles");
  if (!(await pathExists(rolesRoot))) return null;
  for (const target of await readdir(rolesRoot, { withFileTypes: true })) {
    if (!target.isDirectory()) continue;
    const paths = roleResumeDraftProposalPaths(workspace, target.name, proposalId);
    if (await pathExists(paths.proposalPath) || await pathExists(paths.manifestPath)) {
      return { targetId: target.name, ...paths };
    }
  }
  return null;
}
function emptyProposalStatus(
  proposalId: string,
  targetId: string,
  status: RoleResumeDraftProposalStatus["status"],
  reasons: string[],
  existence: { proposalExists?: boolean; manifestExists?: boolean } = {},
): RoleResumeDraftProposalStatus {
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
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) throw new Error("Resolved path leaves workspace.");
  return absolute;
}
function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
