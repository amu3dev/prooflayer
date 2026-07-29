import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  writeBufferAtomic,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  EvidenceReviewBatchManifestSchema,
  EvidenceReviewBatchSchema,
  EvidenceReviewInputTemplateSchema,
  type EvidenceReviewBatch,
  type EvidenceReviewBatchManifest,
} from "./evidence-review-batch-schemas.js";
import {
  evidenceReviewBatchPaths,
  getEvidenceReviewBatchStatus,
} from "./evidence-review-batch.js";
import {
  JobRequirementModelSchema,
  type JobRequirement,
} from "./job-requirement-schemas.js";
import {
  ClaimSchema,
  EvidenceItemSchema,
  SourceSchema,
  type Claim,
  type EvidenceItem,
  type JobTarget,
  type Source,
} from "./schemas.js";
import { stableJson } from "./target-proposal.js";
import { showTarget } from "./targets.js";

export const EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME =
  "evidence-review-workspace-renderer";
export const EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION = "1";

const WORKSPACE_DIR = "review-workspace";
const INDEX_FILE = "index.review.md";
const INDEX_MANIFEST_FILE = "index.manifest.json";
const READ_ONLY_BANNER = [
  "> GENERATED FILE",
  ">",
  "> This document exists only as a human-readable rendering of immutable",
  "> ProofLayer review artifacts.",
  ">",
  "> Editing this file has no effect on ProofLayer.",
  ">",
  "> Review decisions must be submitted using the JSON review artifact.",
].join("\n");

interface ReviewWorkspaceDependency {
  path: string;
  sha256: string;
}

type EvidenceReviewBatchClaim = EvidenceReviewBatch["claims"][number];

interface ClaimWorkspaceInput {
  entry: EvidenceReviewBatchClaim;
  claim: Claim;
  evidence: EvidenceItem[];
  sources: Source[];
  requirements: JobRequirement[];
  template: ReturnType<typeof EvidenceReviewInputTemplateSchema.parse>;
  templateId: string;
  templatePath: string;
  templateSha256: string;
  claimRecordSha256: string;
  evidenceSetSha256: string;
  provenanceSetSha256: string;
  requirementSetSha256: string;
  normalizedInputSha256: string;
  renderId: string;
}

interface ReviewWorkspaceInput {
  batch: EvidenceReviewBatch;
  batchManifest: EvidenceReviewBatchManifest;
  batchSha256: string;
  batchManifestSha256: string;
  target: JobTarget;
  targetSha256: string;
  requirementModel: ReturnType<typeof JobRequirementModelSchema.parse>;
  requirementModelSha256: string;
  requirementManifestSha256: string;
  claimsSha256: string;
  evidenceSha256: string;
  sourcesSha256: string;
  claims: ClaimWorkspaceInput[];
}

interface ClaimWorkspaceManifest {
  schemaVersion: 1;
  manifestId: string;
  artifactType: "evidence-review-workspace-claim";
  renderId: string;
  batchId: string;
  claimId: string;
  templateId: string;
  renderer: {
    name: string;
    version: string;
    mode: "deterministic";
  };
  output: ReviewWorkspaceDependency;
  input: {
    batch: ReviewWorkspaceDependency;
    batchManifest: ReviewWorkspaceDependency;
    template: ReviewWorkspaceDependency;
    claimRecordSha256: string;
    evidenceSetSha256: string;
    provenanceSetSha256: string;
    requirementSetSha256: string;
    normalizedInputSha256: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface IndexWorkspaceManifest {
  schemaVersion: 1;
  manifestId: string;
  artifactType: "evidence-review-workspace-index";
  renderId: string;
  batchId: string;
  targetId: string;
  renderer: {
    name: string;
    version: string;
    mode: "deterministic";
  };
  output: ReviewWorkspaceDependency;
  input: {
    batch: ReviewWorkspaceDependency;
    batchManifest: ReviewWorkspaceDependency;
    targetSha256: string;
    requirementModelSha256: string;
    requirementManifestSha256: string;
    claimsSha256: string;
    evidenceSha256: string;
    sourcesSha256: string;
    normalizedInputSha256: string;
  };
  claimWorkspaces: Array<{
    claimId: string;
    renderId: string;
    output: ReviewWorkspaceDependency;
    manifest: ReviewWorkspaceDependency;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceReviewWorkspacePaths {
  rootRelativePath: string;
  rootPath: string;
  indexRelativePath: string;
  indexPath: string;
  indexManifestRelativePath: string;
  indexManifestPath: string;
}

export interface RenderEvidenceReviewWorkspaceResult {
  batchId: string;
  targetId: string;
  result: "created" | "rebuilt" | "already-current";
  renderId: string;
  indexPath: string;
  indexManifestPath: string;
  claimWorkspaceCount: number;
  claimWorkspacePaths: string[];
}

export interface EvidenceReviewWorkspaceStatus {
  batchId: string;
  targetId?: string;
  workspaceExists: boolean;
  indexExists: boolean;
  indexManifestExists: boolean;
  outputHashesMatch: boolean | null;
  manifestSetMatches: boolean | null;
  inputsMatch: boolean | null;
  rendererMatches: boolean | null;
  claimWorkspaceCount: number;
  status: "missing" | "current" | "stale" | "invalid";
  reasons: string[];
  indexPath: string;
  indexManifestPath: string;
}

export async function renderEvidenceReviewWorkspace(
  workspace: string,
  batchId: string,
  options: { rebuild?: boolean; now?: () => Date } = {},
): Promise<RenderEvidenceReviewWorkspaceResult> {
  const batchStatus = await getEvidenceReviewBatchStatus(workspace, batchId);
  if (batchStatus.status !== "current") {
    throw new Error(
      `Evidence review batch must be current before rendering: ${batchStatus.status}.`,
    );
  }
  const paths = evidenceReviewWorkspacePaths(workspace, batchId);
  const status = await getEvidenceReviewWorkspaceStatus(workspace, batchId);
  if (status.status === "current") {
    const manifest = parseIndexManifest(await readJson<unknown>(paths.indexManifestPath, null));
    return renderResult(manifest, "already-current");
  }
  if ((status.status === "stale" || status.status === "invalid") && !options.rebuild) {
    throw new Error(
      `Evidence review workspace is ${status.status}; use explicit --rebuild to replace derived rendering files.`,
    );
  }

  const input = await loadReviewWorkspaceInput(workspace, batchId);
  const timestamp = (options.now ?? (() => new Date()))().toISOString();
  const claimManifests: ClaimWorkspaceManifest[] = [];
  for (const claimInput of input.claims) {
    const claimPaths = claimWorkspacePaths(workspace, batchId, claimInput.claim.id);
    const markdown = renderClaimMarkdown(input, claimInput);
    const outputSha256 = hashText(markdown);
    const existing = await readClaimManifestIfValid(claimPaths.manifestPath);
    const createdAt = existing?.createdAt ?? timestamp;
    await writeBufferAtomic(claimPaths.outputPath, Buffer.from(markdown, "utf8"));
    const manifest = createClaimManifest(
      input,
      claimInput,
      claimPaths.outputRelativePath,
      outputSha256,
      createdAt,
      timestamp,
    );
    await writeJsonAtomic(claimPaths.manifestPath, manifest);
    claimManifests.push(manifest);
  }

  const claimManifestRecords = await Promise.all(claimManifests.map(async (manifest) => {
    const claimPaths = claimWorkspacePaths(workspace, batchId, manifest.claimId);
    return {
      claimId: manifest.claimId,
      renderId: manifest.renderId,
      output: manifest.output,
      manifest: {
        path: claimPaths.manifestRelativePath,
        sha256: await hashFile(claimPaths.manifestPath),
      },
    };
  }));
  const normalizedInputSha256 = indexInputSha256(input, claimManifests);
  const renderId = indexRenderId(input.batch.id, normalizedInputSha256);
  const indexMarkdown = renderIndexMarkdown(input, renderId);
  const indexOutputSha256 = hashText(indexMarkdown);
  const existingIndex = await readIndexManifestIfValid(paths.indexManifestPath);
  const createdAt = existingIndex?.createdAt ?? timestamp;
  await writeBufferAtomic(paths.indexPath, Buffer.from(indexMarkdown, "utf8"));
  const indexManifest = createIndexManifest(
    input,
    renderId,
    normalizedInputSha256,
    paths.indexRelativePath,
    indexOutputSha256,
    claimManifestRecords,
    createdAt,
    timestamp,
  );
  await writeJsonAtomic(paths.indexManifestPath, indexManifest);

  const renderedStatus = await getEvidenceReviewWorkspaceStatus(workspace, batchId);
  if (renderedStatus.status !== "current") {
    throw new Error(
      `Rendered evidence review workspace failed validation: ${renderedStatus.reasons.join(" ")}`,
    );
  }
  return renderResult(indexManifest, status.status === "missing" ? "created" : "rebuilt");
}

export async function showEvidenceReviewWorkspace(
  workspace: string,
  batchId: string,
): Promise<string> {
  const status = await getEvidenceReviewWorkspaceStatus(workspace, batchId);
  if (status.status !== "current") {
    throw new Error(`Evidence review workspace is ${status.status}: ${batchId}`);
  }
  return readFile(evidenceReviewWorkspacePaths(workspace, batchId).indexPath, "utf8");
}

export async function getEvidenceReviewWorkspaceStatus(
  workspace: string,
  batchId: string,
): Promise<EvidenceReviewWorkspaceStatus> {
  const paths = evidenceReviewWorkspacePaths(workspace, batchId);
  const workspaceExists = await pathExists(paths.rootPath);
  const indexExists = await pathExists(paths.indexPath);
  const indexManifestExists = await pathExists(paths.indexManifestPath);
  const base = {
    batchId,
    workspaceExists,
    indexExists,
    indexManifestExists,
    indexPath: paths.indexRelativePath,
    indexManifestPath: paths.indexManifestRelativePath,
  };
  if (!workspaceExists) {
    return emptyStatus(base, "missing", ["Evidence review workspace does not exist."]);
  }
  if (!indexExists || !indexManifestExists) {
    return emptyStatus(base, "invalid", ["Evidence review workspace index artifact set is incomplete."]);
  }

  let manifest: IndexWorkspaceManifest;
  try {
    manifest = parseIndexManifest(await readJson<unknown>(paths.indexManifestPath, null));
  } catch (error) {
    return emptyStatus(base, "invalid", [`Workspace index manifest is invalid: ${errorMessage(error)}`]);
  }
  const reasons: string[] = [];
  const indexHashMatches = await hashFile(paths.indexPath) === manifest.output.sha256;
  let manifestSetMatches = true;
  let claimOutputHashesMatch = true;
  const claimManifests: ClaimWorkspaceManifest[] = [];
  for (const record of manifest.claimWorkspaces) {
    try {
      const manifestPath = resolveWithin(workspace, record.manifest.path);
      const outputPath = resolveWithin(workspace, record.output.path);
      if (!(await pathExists(manifestPath)) || !(await pathExists(outputPath))) {
        manifestSetMatches = false;
        continue;
      }
      if (await hashFile(manifestPath) !== record.manifest.sha256) manifestSetMatches = false;
      if (await hashFile(outputPath) !== record.output.sha256) claimOutputHashesMatch = false;
      const claimManifest = parseClaimManifest(await readJson<unknown>(manifestPath, null));
      claimManifests.push(claimManifest);
      if (
        claimManifest.claimId !== record.claimId ||
        claimManifest.renderId !== record.renderId ||
        claimManifest.output.path !== record.output.path ||
        claimManifest.output.sha256 !== record.output.sha256 ||
        claimManifest.manifestId !== workspaceManifestId(
          claimManifest.renderId,
          claimManifest.output.path,
          claimManifest.output.sha256,
        )
      ) {
        manifestSetMatches = false;
      }
    } catch {
      manifestSetMatches = false;
    }
  }
  if (claimManifests.length !== manifest.claimWorkspaces.length) manifestSetMatches = false;
  const outputHashesMatch = indexHashMatches && claimOutputHashesMatch;
  if (!outputHashesMatch) reasons.push("Rendered Markdown hash does not match its manifest.");
  if (!manifestSetMatches) reasons.push("Claim workspace output or manifest set is incomplete or inconsistent.");
  if (
    manifest.batchId !== batchId ||
    manifest.output.path !== paths.indexRelativePath ||
    manifest.manifestId !== workspaceManifestId(
      manifest.renderId,
      manifest.output.path,
      manifest.output.sha256,
    )
  ) {
    reasons.push("Workspace index identity or path is invalid.");
    manifestSetMatches = false;
  }

  let inputsMatch = false;
  let rendererMatches = false;
  try {
    const input = await loadReviewWorkspaceInput(workspace, batchId);
    const expectedClaims = input.claims.map((claim) =>
      createExpectedClaimManifestInput(input, claim));
    const storedClaims = new Map(claimManifests.map((claim) => [claim.claimId, claim]));
    const claimInputsMatch = expectedClaims.every((expected) => {
      const stored = storedClaims.get(expected.claimId);
      return stored &&
        stored.renderId === expected.renderId &&
        stableJson(stored.input) === stableJson(expected.input) &&
        stored.templateId === expected.templateId;
    });
    const expectedIndexInput = indexInputSha256(input, expectedClaims);
    inputsMatch =
      claimInputsMatch &&
      manifest.input.batch.sha256 === input.batchSha256 &&
      manifest.input.batchManifest.sha256 === input.batchManifestSha256 &&
      manifest.input.targetSha256 === input.targetSha256 &&
      manifest.input.requirementModelSha256 === input.requirementModelSha256 &&
      manifest.input.requirementManifestSha256 === input.requirementManifestSha256 &&
      manifest.input.claimsSha256 === input.claimsSha256 &&
      manifest.input.evidenceSha256 === input.evidenceSha256 &&
      manifest.input.sourcesSha256 === input.sourcesSha256 &&
      manifest.input.normalizedInputSha256 === expectedIndexInput &&
      manifest.renderId === indexRenderId(batchId, expectedIndexInput);
    const batchStatus = await getEvidenceReviewBatchStatus(workspace, batchId);
    if (batchStatus.status !== "current") {
      inputsMatch = false;
      reasons.push(`Canonical review batch is ${batchStatus.status}.`);
    }
    rendererMatches =
      manifest.renderer.name === EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME &&
      manifest.renderer.version === EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION &&
      claimManifests.every((claim) =>
        claim.renderer.name === EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME &&
        claim.renderer.version === EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION);
  } catch (error) {
    reasons.push(`Canonical rendering input is invalid: ${errorMessage(error)}`);
  }
  if (!inputsMatch) reasons.push("Canonical batch, template, evidence, provenance, or requirement input changed.");
  if (!rendererMatches) reasons.push("Review workspace renderer version changed.");

  const invalid = !outputHashesMatch || !manifestSetMatches;
  return {
    ...base,
    targetId: manifest.targetId,
    outputHashesMatch,
    manifestSetMatches,
    inputsMatch,
    rendererMatches,
    claimWorkspaceCount: manifest.claimWorkspaces.length,
    status: invalid ? "invalid" : inputsMatch && rendererMatches ? "current" : "stale",
    reasons: unique(reasons),
  };
}

export function evidenceReviewWorkspacePaths(
  workspace: string,
  batchId: string,
): EvidenceReviewWorkspacePaths {
  const batchPaths = evidenceReviewBatchPaths(workspace, batchId);
  const rootRelativePath = `${batchPaths.rootRelativePath}/${WORKSPACE_DIR}`;
  const indexRelativePath = `${rootRelativePath}/${INDEX_FILE}`;
  const indexManifestRelativePath = `${rootRelativePath}/${INDEX_MANIFEST_FILE}`;
  return {
    rootRelativePath,
    rootPath: resolveWithin(workspace, rootRelativePath),
    indexRelativePath,
    indexPath: resolveWithin(workspace, indexRelativePath),
    indexManifestRelativePath,
    indexManifestPath: resolveWithin(workspace, indexManifestRelativePath),
  };
}

export function formatEvidenceReviewWorkspaceResult(
  result: RenderEvidenceReviewWorkspaceResult,
): string {
  return [
    `Batch ID: ${result.batchId}`,
    `Target ID: ${result.targetId}`,
    `Render result: ${result.result}`,
    `Rendering ID: ${result.renderId}`,
    `Index: ${result.indexPath}`,
    `Index manifest: ${result.indexManifestPath}`,
    `Claim workspaces: ${result.claimWorkspaceCount}`,
    ...result.claimWorkspacePaths.map((entry) => `- ${entry}`),
  ].join("\n");
}

export function formatEvidenceReviewWorkspaceStatus(
  status: EvidenceReviewWorkspaceStatus,
): string {
  return [
    `Batch ID: ${status.batchId}`,
    `Target ID: ${status.targetId ?? "unknown"}`,
    `Status: ${status.status}`,
    `Index exists: ${status.indexExists ? "yes" : "no"}`,
    `Index manifest exists: ${status.indexManifestExists ? "yes" : "no"}`,
    `Output hashes match: ${formatCheck(status.outputHashesMatch)}`,
    `Manifest set matches: ${formatCheck(status.manifestSetMatches)}`,
    `Inputs match: ${formatCheck(status.inputsMatch)}`,
    `Renderer matches: ${formatCheck(status.rendererMatches)}`,
    `Claim workspaces: ${status.claimWorkspaceCount}`,
    ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
  ].join("\n");
}

async function loadReviewWorkspaceInput(
  workspace: string,
  batchId: string,
): Promise<ReviewWorkspaceInput> {
  const batchPaths = evidenceReviewBatchPaths(workspace, batchId);
  const batch = EvidenceReviewBatchSchema.parse(await readJson<unknown>(batchPaths.batchPath, null));
  const batchManifest = EvidenceReviewBatchManifestSchema.parse(
    await readJson<unknown>(batchPaths.manifestPath, null),
  );
  if (batch.id !== batchId || batchManifest.batchId !== batchId) {
    throw new Error("Batch identity does not match the requested workspace.");
  }
  const target = await showTarget(workspace, batch.targetId);
  if (target.type !== "job") throw new Error(`Review workspace requires a Job Target: ${batch.targetId}`);

  const requirementModelPath = resolveWithin(workspace, batch.input.requirementModelPath);
  const requirementManifestPath = resolveWithin(workspace, batch.input.requirementManifestPath);
  const requirementModel = JobRequirementModelSchema.parse(
    await readJson<unknown>(requirementModelPath, null),
  );
  if (requirementModel.targetId !== batch.targetId) {
    throw new Error("Requirement Model belongs to another target.");
  }
  const claimsPath = resolveWithin(workspace, batch.input.claimsPath);
  const evidencePath = resolveWithin(workspace, batch.input.evidencePath);
  const sourcesPath = resolveWithin(workspace, "kb/sources.json");
  const claims = (await readJson<unknown[]>(claimsPath, [])).map((entry) => ClaimSchema.parse(entry));
  const evidence = (await readJson<unknown[]>(evidencePath, [])).map((entry) => EvidenceItemSchema.parse(entry));
  const sources = (await readJson<unknown[]>(sourcesPath, [])).map((entry) => SourceSchema.parse(entry));
  const claimById = new Map(claims.map((entry) => [entry.id, entry]));
  const evidenceById = new Map(evidence.map((entry) => [entry.id, entry]));
  const sourceById = new Map(sources.map((entry) => [entry.id, entry]));
  const requirementById = new Map(requirementModel.requirements.map((entry) => [entry.id, entry]));
  const templateByPath = new Map(batchManifest.templateFiles.map((entry) => [entry.path, entry]));
  const selectedEntries = batch.claims.filter(({ selectedForControlledReview }) =>
    selectedForControlledReview);
  if (selectedEntries.length !== batch.controlledReviewSubsetClaimIds.length) {
    throw new Error("Controlled review subset does not match selected batch entries.");
  }

  const claimInputs: ClaimWorkspaceInput[] = [];
  for (const entry of selectedEntries) {
    const claim = claimById.get(entry.claimId);
    if (!claim) throw new Error(`Batch references missing claim: ${entry.claimId}`);
    if (!entry.reviewInputTemplatePath) {
      throw new Error(`Selected claim is missing its review template: ${entry.claimId}`);
    }
    const templateRecord = templateByPath.get(entry.reviewInputTemplatePath);
    if (!templateRecord) throw new Error(`Batch manifest does not register template: ${entry.claimId}`);
    const templatePath = resolveWithin(workspace, entry.reviewInputTemplatePath);
    const template = EvidenceReviewInputTemplateSchema.parse(
      await readJson<unknown>(templatePath, null),
    );
    if (template.templateForClaimId !== claim.id || template.reviewInput.claimId !== claim.id) {
      throw new Error(`Review template claim identity is invalid: ${claim.id}`);
    }
    const linkedEvidence = entry.evidenceItemIds.map((id) => {
      const item = evidenceById.get(id);
      if (!item) throw new Error(`Batch references missing evidence: ${id}`);
      return item;
    }).sort(byId);
    const linkedSources = unique(linkedEvidence.flatMap(({ sourceIds }) => sourceIds)).map((id) => {
      const source = sourceById.get(id);
      if (!source) throw new Error(`Evidence references missing source provenance: ${id}`);
      return source;
    }).sort(byId);
    const linkedRequirements = entry.matchingRequirementIds.map((id) => {
      const requirement = requirementById.get(id);
      if (!requirement) throw new Error(`Batch references missing requirement: ${id}`);
      return requirement;
    }).sort(byId);
    const templateSha256 = await hashFile(templatePath);
    const claimRecordSha256 = hashText(stableJson(claim));
    const evidenceSetSha256 = hashText(stableJson(linkedEvidence));
    const provenanceSetSha256 = hashText(stableJson(linkedSources));
    const requirementSetSha256 = hashText(stableJson(linkedRequirements));
    const templateId = `evidence-review-input-template_${hashText(stableJson({
      claimId: claim.id,
      path: entry.reviewInputTemplatePath,
      sha256: templateSha256,
    })).slice(0, 20)}`;
    const normalizedInputSha256 = hashText(stableJson({
      renderer: {
        name: EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME,
        version: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
      },
      batchId,
      batchEntry: entry,
      templateId,
      templateSha256,
      claimRecordSha256,
      evidenceSetSha256,
      provenanceSetSha256,
      requirementSetSha256,
    }));
    claimInputs.push({
      entry,
      claim,
      evidence: linkedEvidence,
      sources: linkedSources,
      requirements: linkedRequirements,
      template,
      templateId,
      templatePath: entry.reviewInputTemplatePath,
      templateSha256,
      claimRecordSha256,
      evidenceSetSha256,
      provenanceSetSha256,
      requirementSetSha256,
      normalizedInputSha256,
      renderId: claimRenderId(batchId, claim.id, normalizedInputSha256),
    });
  }

  return {
    batch,
    batchManifest,
    batchSha256: await hashFile(batchPaths.batchPath),
    batchManifestSha256: await hashFile(batchPaths.manifestPath),
    target,
    targetSha256: await hashFile(resolveWithin(workspace, batch.input.targetPath)),
    requirementModel,
    requirementModelSha256: await hashFile(requirementModelPath),
    requirementManifestSha256: await hashFile(requirementManifestPath),
    claimsSha256: await hashFile(claimsPath),
    evidenceSha256: await hashFile(evidencePath),
    sourcesSha256: await hashFile(sourcesPath),
    claims: claimInputs,
  };
}

function renderClaimMarkdown(input: ReviewWorkspaceInput, item: ClaimWorkspaceInput): string {
  const evidenceCategories = unique(item.evidence.map(({ category }) => category));
  const sourcesByEvidence = new Map(item.evidence.map((evidence) => [
    evidence.id,
    evidence.sourceIds.map((sourceId) => item.sources.find(({ id }) => id === sourceId)!),
  ]));
  const lines = [
    READ_ONLY_BANNER,
    "",
    "# Claim Review",
    "",
    `- Claim ID: ${inlineCode(item.claim.id)}`,
    `- Priority: ${item.entry.priority}`,
    `- Reason selected: ${selectionReason(item.entry)}`,
    `- Batch ID: ${inlineCode(input.batch.id)}`,
    `- Review Template ID: ${inlineCode(item.templateId)}`,
    `- Workspace Rendering ID: ${inlineCode(item.renderId)}`,
    "",
    "---",
    "",
    "## Original Claim",
    "",
    quote(item.claim.claim),
    "",
    "---",
    "",
    "## Evidence",
    "",
    ...item.evidence.flatMap((evidence) => [
      `### ${inlineCode(evidence.id)}`,
      "",
      `- Category: ${evidence.category}`,
      `- Confidence: ${evidence.confidence}`,
      `- Visibility: ${evidence.visibility}`,
      `- Date range: ${display(evidence.dateRange)}`,
      `- Company: ${display(evidence.company)}`,
      `- Project: ${display(evidence.project)}`,
      `- Parent role ID: ${displayCode(evidence.parentRoleId)}`,
      `- Parent project ID: ${displayCode(evidence.parentProjectId)}`,
      `- Source section: ${display(evidence.sourceSection)}`,
      `- Technologies: ${displayList(evidence.technologies)}`,
      `- Domains: ${displayList(evidence.domains)}`,
      "",
    ]),
    "---",
    "",
    "## Evidence Summary",
    "",
    ...item.evidence.flatMap((evidence) => [
      `### ${inlineCode(evidence.id)}`,
      "",
      quote(evidence.normalizedSummary),
      "",
    ]),
    "---",
    "",
    "## Relevant Source Excerpt",
    "",
    ...item.evidence.flatMap((evidence) => [
      `### ${inlineCode(evidence.id)}`,
      "",
      quote(evidence.text),
      "",
    ]),
    "---",
    "",
    "## Matching Job Requirements",
    "",
    ...(item.requirements.length === 0
      ? ["No matching Job Requirement references were recorded by this batch.", ""]
      : item.requirements.flatMap((requirement) => [
          `### ${inlineCode(requirement.id)}`,
          "",
          `- Category: ${requirement.category}`,
          `- Necessity: ${requirement.necessity}`,
          `- Confidence: ${requirement.confidence}`,
          `- Explicitness: ${requirement.explicitness}`,
          `- Normalized label: ${requirement.normalizedLabel}`,
          `- Named technologies: ${displayList(requirement.namedTechnologies)}`,
          `- Keywords: ${displayList(requirement.keywords)}`,
          "",
          "Source wording:",
          "",
          quote(requirement.sourceText),
          "",
        ])),
    "---",
    "",
    "## Current Classification",
    "",
    `- Claim type: ${item.claim.type}`,
    `- Claim parent role ID: ${displayCode(item.claim.parentRoleId)}`,
    `- Claim parent project ID: ${displayCode(item.claim.parentProjectId)}`,
    `- Claim source section: ${display(item.claim.sourceSection)}`,
    `- Claim date range: ${display(item.claim.dateRange)}`,
    `- Evidence categories: ${displayList(evidenceCategories)}`,
    "- Review work context: unset in canonical JSON template",
    "- Review claim nature: unset in canonical JSON template",
    "",
    "---",
    "",
    "## Current Eligibility",
    "",
    `- Source approval status: ${item.claim.approvalStatus}`,
    `- Source output readiness: ${item.claim.outputReadiness}`,
    `- Source public-safe flag: ${item.claim.publicSafe ? "yes" : "no"}`,
    `- Source needs confirmation: ${item.claim.needsConfirmation ? "yes" : "no"}`,
    `- Source metric status: ${item.claim.metricStatus}`,
    "- Role Matching eligibility: unset in canonical JSON template",
    "- Job Mapping eligibility: unset in canonical JSON template",
    "",
    "The batch and its blank review template grant no approval or eligibility.",
    "",
    "---",
    "",
    "## Current Provenance",
    "",
    `- Claim record SHA-256: ${inlineCode(item.claimRecordSha256)}`,
    `- Reviewed claim text SHA-256: ${inlineCode(item.template.reviewedClaimSha256)}`,
    `- Review template path: ${inlineCode(item.templatePath)}`,
    `- Review template SHA-256: ${inlineCode(item.templateSha256)}`,
    `- Evidence set SHA-256: ${inlineCode(item.evidenceSetSha256)}`,
    `- Provenance set SHA-256: ${inlineCode(item.provenanceSetSha256)}`,
    `- Requirement set SHA-256: ${inlineCode(item.requirementSetSha256)}`,
    "",
    ...item.evidence.flatMap((evidence) => [
      `### Evidence ${inlineCode(evidence.id)}`,
      "",
      `- Evidence record SHA-256: ${inlineCode(hashText(stableJson(evidence)))}`,
      ...sourcesByEvidence.get(evidence.id)!.flatMap((source) => [
        `- Source ID: ${inlineCode(source.id)}`,
        `- Source type: ${source.type}`,
        `- Source content SHA-256: ${inlineCode(source.hash)}`,
        `- Source visibility: ${source.visibility}`,
        `- Source status: ${source.status}`,
      ]),
      "",
    ]),
    ...item.requirements.flatMap((requirement) => [
      `### Requirement ${inlineCode(requirement.id)}`,
      "",
      `- Source analysis item ID: ${inlineCode(requirement.provenance.sourceAnalysisItemId)}`,
      `- Source section ID: ${displayCode(requirement.provenance.sourceSectionId ?? undefined)}`,
      ...requirement.provenance.sourceReferences.flatMap((reference) => [
        `- Source reference: ${inlineCode(reference.path)} lines ${reference.startLine}-${reference.endLine}`,
        `- Source SHA-256: ${inlineCode(reference.sha256)}`,
        `- Excerpt SHA-256: ${inlineCode(reference.excerptSha256)}`,
        `- Byte offsets: ${displayOffsets(reference.startOffset, reference.endOffset)}`,
      ]),
      "",
    ]),
    "---",
    "",
    "## Reviewer Decision Workspace",
    "",
    "- Decision: unset in canonical JSON template",
    "- Corrected wording: unset in canonical JSON template",
    "- Qualifier: unset in canonical JSON template",
    "- Metric notes: unset in canonical JSON template",
    "- Reviewer notes: unset in canonical JSON template",
    "",
    "Submit decisions through the canonical JSON template; do not edit this Markdown.",
    "",
    "---",
    "",
    "## Validation Checklist",
    "",
    "- [ ] Supported by evidence",
    "- [ ] Scope accurate",
    "- [ ] Not overstated",
    "- [ ] Public-safe",
    "- [ ] Resume-ready",
    "- [ ] Role eligible",
    "- [ ] Job eligible",
    "- [ ] Metric verified if applicable",
    "",
  ];
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

function renderIndexMarkdown(input: ReviewWorkspaceInput, renderId: string): string {
  const selectedPriority = {
    high: input.claims.filter(({ entry }) => entry.priority === "high").length,
    medium: input.claims.filter(({ entry }) => entry.priority === "medium").length,
    low: input.claims.filter(({ entry }) => entry.priority === "low").length,
  };
  const targetLabel = [
    input.target.title,
    input.target.company,
    input.target.location,
    input.target.workingModel,
  ].filter(Boolean).join(" | ");
  const lines = [
    READ_ONLY_BANNER,
    "",
    "# Evidence Review Workspace",
    "",
    `- Batch ID: ${inlineCode(input.batch.id)}`,
    `- Target: ${targetLabel}`,
    `- Target ID: ${inlineCode(input.target.id)}`,
    `- Generation time: ${input.batch.createdAt}`,
    `- Workspace Rendering ID: ${inlineCode(renderId)}`,
    "",
    "## Priority Summary",
    "",
    `- High: ${input.batch.priorityCounts.high} candidates; ${selectedPriority.high} selected`,
    `- Medium: ${input.batch.priorityCounts.medium} candidates; ${selectedPriority.medium} selected`,
    `- Low: ${input.batch.priorityCounts.low} candidates; ${selectedPriority.low} selected`,
    "",
    "## Claim Review Workspaces",
    "",
    ...input.claims.map((claim) =>
      `- [${claim.claim.id}](./${claimFileName(claim.claim.id)}) — ${claim.entry.priority}; ${selectionReason(claim.entry)}`),
    "",
    "## Overall Progress Summary",
    "",
    `- Review templates: ${input.claims.length}`,
    "- Completed decisions represented by this rendering: 0",
    `- Pending JSON submissions: ${input.claims.length}`,
    "",
    "## Review Status Summary",
    "",
    "All listed JSON review templates are intentionally blank. This derived workspace does not inspect, submit, or replace claim-review decisions.",
    "",
    "## Warnings",
    "",
    `- ${input.batch.warning}`,
    "- Markdown is presentation-only and is never parsed or consumed by ProofLayer.",
    "- Editing Markdown does not change canonical JSON, review state, snapshots, or eligibility.",
    "",
  ];
  return `${lines.join("\n")}\n`;
}

function createClaimManifest(
  input: ReviewWorkspaceInput,
  claim: ClaimWorkspaceInput,
  outputPath: string,
  outputSha256: string,
  createdAt: string,
  updatedAt: string,
): ClaimWorkspaceManifest {
  const expected = createExpectedClaimManifestInput(input, claim);
  return {
    schemaVersion: 1,
    manifestId: workspaceManifestId(expected.renderId, outputPath, outputSha256),
    artifactType: "evidence-review-workspace-claim",
    renderId: expected.renderId,
    batchId: input.batch.id,
    claimId: claim.claim.id,
    templateId: claim.templateId,
    renderer: {
      name: EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME,
      version: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
      mode: "deterministic",
    },
    output: { path: outputPath, sha256: outputSha256 },
    input: expected.input,
    createdAt,
    updatedAt,
  };
}

function createExpectedClaimManifestInput(
  input: ReviewWorkspaceInput,
  claim: ClaimWorkspaceInput,
): Pick<ClaimWorkspaceManifest, "claimId" | "renderId" | "templateId" | "input"> {
  return {
    claimId: claim.claim.id,
    renderId: claim.renderId,
    templateId: claim.templateId,
    input: {
      batch: {
        path: evidenceReviewBatchPaths("", input.batch.id).batchRelativePath,
        sha256: input.batchSha256,
      },
      batchManifest: {
        path: evidenceReviewBatchPaths("", input.batch.id).manifestRelativePath,
        sha256: input.batchManifestSha256,
      },
      template: {
        path: claim.templatePath,
        sha256: claim.templateSha256,
      },
      claimRecordSha256: claim.claimRecordSha256,
      evidenceSetSha256: claim.evidenceSetSha256,
      provenanceSetSha256: claim.provenanceSetSha256,
      requirementSetSha256: claim.requirementSetSha256,
      normalizedInputSha256: claim.normalizedInputSha256,
    },
  };
}

function createIndexManifest(
  input: ReviewWorkspaceInput,
  renderId: string,
  normalizedInputSha256: string,
  outputPath: string,
  outputSha256: string,
  claimWorkspaces: IndexWorkspaceManifest["claimWorkspaces"],
  createdAt: string,
  updatedAt: string,
): IndexWorkspaceManifest {
  const batchPaths = evidenceReviewBatchPaths("", input.batch.id);
  return {
    schemaVersion: 1,
    manifestId: workspaceManifestId(renderId, outputPath, outputSha256),
    artifactType: "evidence-review-workspace-index",
    renderId,
    batchId: input.batch.id,
    targetId: input.target.id,
    renderer: {
      name: EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME,
      version: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
      mode: "deterministic",
    },
    output: { path: outputPath, sha256: outputSha256 },
    input: {
      batch: { path: batchPaths.batchRelativePath, sha256: input.batchSha256 },
      batchManifest: {
        path: batchPaths.manifestRelativePath,
        sha256: input.batchManifestSha256,
      },
      targetSha256: input.targetSha256,
      requirementModelSha256: input.requirementModelSha256,
      requirementManifestSha256: input.requirementManifestSha256,
      claimsSha256: input.claimsSha256,
      evidenceSha256: input.evidenceSha256,
      sourcesSha256: input.sourcesSha256,
      normalizedInputSha256,
    },
    claimWorkspaces,
    createdAt,
    updatedAt,
  };
}

function indexInputSha256(
  input: ReviewWorkspaceInput,
  claims: Array<Pick<ClaimWorkspaceManifest, "claimId" | "renderId" | "templateId" | "input">>,
): string {
  return hashText(stableJson({
    renderer: {
      name: EVIDENCE_REVIEW_WORKSPACE_RENDERER_NAME,
      version: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
    },
    batchId: input.batch.id,
    batchSha256: input.batchSha256,
    batchManifestSha256: input.batchManifestSha256,
    targetSha256: input.targetSha256,
    requirementModelSha256: input.requirementModelSha256,
    requirementManifestSha256: input.requirementManifestSha256,
    claimsSha256: input.claimsSha256,
    evidenceSha256: input.evidenceSha256,
    sourcesSha256: input.sourcesSha256,
    claims: claims.map(({ claimId, renderId, templateId, input: claimInput }) => ({
      claimId,
      renderId,
      templateId,
      normalizedInputSha256: claimInput.normalizedInputSha256,
    })),
  }));
}

function claimWorkspacePaths(workspace: string, batchId: string, claimId: string) {
  if (!/^[A-Za-z0-9._-]+$/.test(claimId)) throw new Error(`Unsafe claim ID: ${claimId}`);
  const root = evidenceReviewWorkspacePaths(workspace, batchId);
  const outputRelativePath = `${root.rootRelativePath}/${claimFileName(claimId)}`;
  const manifestRelativePath = `${root.rootRelativePath}/${claimId}.manifest.json`;
  return {
    outputRelativePath,
    outputPath: resolveWithin(workspace, outputRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}

function claimFileName(claimId: string): string {
  return `${claimId}.review.md`;
}

function claimRenderId(batchId: string, claimId: string, normalizedInputSha256: string): string {
  return `evidence-review-workspace-claim_${hashText(stableJson({
    batchId,
    claimId,
    normalizedInputSha256,
    rendererVersion: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
  })).slice(0, 20)}`;
}

function indexRenderId(batchId: string, normalizedInputSha256: string): string {
  return `evidence-review-workspace-index_${hashText(stableJson({
    batchId,
    normalizedInputSha256,
    rendererVersion: EVIDENCE_REVIEW_WORKSPACE_RENDERER_VERSION,
  })).slice(0, 20)}`;
}

function workspaceManifestId(
  renderId: string,
  outputPath: string,
  outputSha256: string,
): string {
  return `evidence-review-workspace-manifest_${hashText(stableJson({
    renderId,
    outputPath,
    outputSha256,
  })).slice(0, 20)}`;
}

function renderResult(
  manifest: IndexWorkspaceManifest,
  result: RenderEvidenceReviewWorkspaceResult["result"],
): RenderEvidenceReviewWorkspaceResult {
  return {
    batchId: manifest.batchId,
    targetId: manifest.targetId,
    result,
    renderId: manifest.renderId,
    indexPath: manifest.output.path,
    indexManifestPath: evidenceReviewWorkspacePaths("", manifest.batchId).indexManifestRelativePath,
    claimWorkspaceCount: manifest.claimWorkspaces.length,
    claimWorkspacePaths: manifest.claimWorkspaces.map(({ output }) => output.path),
  };
}

function selectionReason(entry: EvidenceReviewBatchClaim): string {
  const basis = entry.priorityBasis.map((value) => value.replaceAll("-", " ")).join(", ");
  const terms = entry.matchingTerms.length
    ? `; matching terms: ${entry.matchingTerms.join(", ")}`
    : "; no explicit requirement-term overlap";
  return `${basis}${terms}`;
}

function quote(value: string): string {
  return value.split(/\r?\n/).map((line) => `> ${line}`).join("\n");
}

function inlineCode(value: string): string {
  return `\`${value.replaceAll("`", "\\`")}\``;
}

function display(value: string | undefined): string {
  return value?.trim() ? value : "not recorded";
}

function displayCode(value: string | undefined): string {
  return value ? inlineCode(value) : "not recorded";
}

function displayList(value: readonly string[] | undefined): string {
  return value?.length ? value.join(", ") : "none recorded";
}

function displayOffsets(start: number | undefined, end: number | undefined): string {
  return start === undefined || end === undefined ? "not recorded" : `${start}-${end}`;
}

function parseClaimManifest(value: unknown): ClaimWorkspaceManifest {
  if (!isRecord(value) || value.schemaVersion !== 1 ||
      value.artifactType !== "evidence-review-workspace-claim" ||
      typeof value.manifestId !== "string" || typeof value.renderId !== "string" ||
      typeof value.batchId !== "string" || typeof value.claimId !== "string" ||
      typeof value.templateId !== "string" || !isRenderer(value.renderer) ||
      !isDependency(value.output) || !isRecord(value.input) ||
      !isDependency(value.input.batch) || !isDependency(value.input.batchManifest) ||
      !isDependency(value.input.template) ||
      !stringsAt(value.input, [
        "claimRecordSha256",
        "evidenceSetSha256",
        "provenanceSetSha256",
        "requirementSetSha256",
        "normalizedInputSha256",
      ]) ||
      typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") {
    throw new Error("Malformed claim workspace manifest.");
  }
  return value as unknown as ClaimWorkspaceManifest;
}

function parseIndexManifest(value: unknown): IndexWorkspaceManifest {
  if (!isRecord(value) || value.schemaVersion !== 1 ||
      value.artifactType !== "evidence-review-workspace-index" ||
      typeof value.manifestId !== "string" || typeof value.renderId !== "string" ||
      typeof value.batchId !== "string" || typeof value.targetId !== "string" ||
      !isRenderer(value.renderer) || !isDependency(value.output) ||
      !isRecord(value.input) || !isDependency(value.input.batch) ||
      !isDependency(value.input.batchManifest) ||
      !stringsAt(value.input, [
        "targetSha256",
        "requirementModelSha256",
        "requirementManifestSha256",
        "claimsSha256",
        "evidenceSha256",
        "sourcesSha256",
        "normalizedInputSha256",
      ]) ||
      !Array.isArray(value.claimWorkspaces) ||
      !value.claimWorkspaces.every((entry) =>
        isRecord(entry) && typeof entry.claimId === "string" &&
        typeof entry.renderId === "string" && isDependency(entry.output) &&
        isDependency(entry.manifest)) ||
      typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") {
    throw new Error("Malformed index workspace manifest.");
  }
  return value as unknown as IndexWorkspaceManifest;
}

async function readClaimManifestIfValid(filePath: string): Promise<ClaimWorkspaceManifest | null> {
  if (!(await pathExists(filePath))) return null;
  try {
    return parseClaimManifest(await readJson<unknown>(filePath, null));
  } catch {
    return null;
  }
}

async function readIndexManifestIfValid(filePath: string): Promise<IndexWorkspaceManifest | null> {
  if (!(await pathExists(filePath))) return null;
  try {
    return parseIndexManifest(await readJson<unknown>(filePath, null));
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isDependency(value: unknown): value is ReviewWorkspaceDependency {
  return isRecord(value) && typeof value.path === "string" &&
    typeof value.sha256 === "string" && /^[a-f0-9]{64}$/.test(value.sha256);
}

function isRenderer(value: unknown): boolean {
  return isRecord(value) && typeof value.name === "string" &&
    typeof value.version === "string" && value.mode === "deterministic";
}

function stringsAt(value: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((key) =>
    typeof value[key] === "string" && /^[a-f0-9]{64}$/.test(value[key] as string));
}

function emptyStatus(
  base: Pick<
    EvidenceReviewWorkspaceStatus,
    "batchId" | "workspaceExists" | "indexExists" | "indexManifestExists" |
    "indexPath" | "indexManifestPath"
  >,
  status: "missing" | "invalid",
  reasons: string[],
): EvidenceReviewWorkspaceStatus {
  return {
    ...base,
    outputHashesMatch: null,
    manifestSetMatches: null,
    inputsMatch: null,
    rendererMatches: null,
    claimWorkspaceCount: 0,
    status,
    reasons,
  };
}

function resolveWithin(workspace: string, relativePath: string): string {
  const root = path.resolve(workspace);
  const resolved = path.resolve(root, relativePath);
  const relation = path.relative(root, resolved);
  if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
    throw new Error(`Path escapes workspace: ${relativePath}`);
  }
  return resolved;
}

function unique<T extends string>(values: T[]): T[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function byId<T extends { id: string }>(left: T, right: T): number {
  return left.id.localeCompare(right.id);
}

function formatCheck(value: boolean | null): string {
  return value === null ? "not applicable" : value ? "yes" : "no";
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
