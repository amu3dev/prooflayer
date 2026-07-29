import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  walkFiles,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  EVIDENCE_REVIEW_BATCH_POLICY_NAME,
  EVIDENCE_REVIEW_BATCH_POLICY_VERSION,
  EVIDENCE_REVIEW_BATCH_SCHEMA_VERSION,
  EvidenceReviewBatchManifestSchema,
  EvidenceReviewBatchSchema,
  EvidenceReviewInputTemplateSchema,
  type EvidenceReviewBatch,
  type EvidenceReviewBatchManifest,
  type EvidenceReviewBatchPriority,
} from "./evidence-review-batch-schemas.js";
import {
  JobRequirementModelManifestSchema,
  type JobRequirement,
} from "./job-requirement-schemas.js";
import {
  getJobRequirementModelStatus,
  jobRequirementPaths,
  showJobRequirementModel,
} from "./job-requirements.js";
import { ClaimSchema, EvidenceItemSchema, type Claim, type EvidenceItem } from "./schemas.js";
import { stableJson } from "./target-proposal.js";
import { showTarget } from "./targets.js";

const BATCH_ROOT = "evidence-reviews/batches";
const BATCH_FILE = "evidence-review-batch.json";
const MANIFEST_FILE = "evidence-review-batch-manifest.json";
const TEMPLATE_DIR = "review-input-templates";
const DEFAULT_SUBSET_SIZE = 12;

export interface EvidenceReviewBatchPaths {
  rootRelativePath: string;
  rootPath: string;
  batchRelativePath: string;
  batchPath: string;
  manifestRelativePath: string;
  manifestPath: string;
  templateRootRelativePath: string;
  templateRootPath: string;
}

export interface BuildEvidenceReviewBatchResult {
  batchId: string;
  targetId: string;
  result: "created" | "already-current" | "rebuilt";
  batchPath: string;
  manifestPath: string;
  candidateClaimCount: number;
  priorityCounts: { high: number; medium: number; low: number };
  controlledReviewSubsetClaimIds: string[];
  templatePaths: string[];
}

export interface EvidenceReviewBatchStatus {
  batchId: string;
  targetId?: string;
  batchExists: boolean;
  manifestExists: boolean;
  batchHashMatches: boolean | null;
  inputsMatch: boolean | null;
  policyMatches: boolean | null;
  templatesMatch: boolean | null;
  status: "missing" | "current" | "stale" | "invalid";
  reasons: string[];
  batchPath?: string;
  manifestPath?: string;
}

export async function buildEvidenceReviewBatch(
  workspace: string,
  targetId: string,
  options: { rebuild?: boolean; subsetSize?: number; now?: () => Date } = {},
): Promise<BuildEvidenceReviewBatchResult> {
  const requestedSubsetSize = options.subsetSize ?? DEFAULT_SUBSET_SIZE;
  if (!Number.isInteger(requestedSubsetSize) || requestedSubsetSize < 1 || requestedSubsetSize > 50) {
    throw new Error("Controlled review subset size must be between 1 and 50.");
  }
  const input = await loadBatchInput(workspace, targetId);
  if (input.claims.length === 0) {
    throw new Error("No Evidence Foundation claims are available for controlled review.");
  }
  const subsetSize = Math.min(requestedSubsetSize, input.claims.length);
  const ranked = rankClaims(input.claims, input.evidence, input.requirements);
  const selectedIds = selectControlledSubset(ranked, subsetSize);
  const selected = new Set(selectedIds);
  const normalizedInputSha256 = normalizedBatchInputSha256(input, ranked, subsetSize);
  const batchId = `evidence-review-batch_${hashText(stableJson({
    targetId,
    normalizedInputSha256,
  })).slice(0, 20)}`;
  const paths = evidenceReviewBatchPaths(workspace, batchId);
  if (await pathExists(paths.rootPath)) {
    const status = await getEvidenceReviewBatchStatus(workspace, batchId);
    if (status.status === "current" && !options.rebuild) {
      return resultFor(
        await showEvidenceReviewBatch(workspace, batchId),
        EvidenceReviewBatchManifestSchema.parse(await readJson<unknown>(paths.manifestPath, null)),
        paths,
        "already-current",
      );
    }
    if (!options.rebuild) {
      throw new Error(`Stored review batch is ${status.status}; use --rebuild to replace task-owned batch artifacts.`);
    }
  }
  const timestamp = (options.now ?? (() => new Date()))().toISOString();
  const templatePaths = new Map(selectedIds.map((claimId) => [
    claimId,
    `${paths.templateRootRelativePath}/${safeSegment(claimId)}.json`,
  ]));
  const priorityCounts = {
    high: ranked.filter(({ priority }) => priority === "high").length,
    medium: ranked.filter(({ priority }) => priority === "medium").length,
    low: ranked.filter(({ priority }) => priority === "low").length,
  };
  const batch = EvidenceReviewBatchSchema.parse({
    schemaVersion: EVIDENCE_REVIEW_BATCH_SCHEMA_VERSION,
    id: batchId,
    targetId,
    targetType: "job",
    purpose: "human-review-work-organization",
    policy: {
      name: EVIDENCE_REVIEW_BATCH_POLICY_NAME,
      version: EVIDENCE_REVIEW_BATCH_POLICY_VERSION,
      mode: "deterministic",
    },
    input: {
      targetPath: input.targetPath,
      targetSha256: input.targetSha256,
      requirementModelPath: input.requirementModelPath,
      requirementModelSha256: input.requirementModelSha256,
      requirementManifestPath: input.requirementManifestPath,
      requirementManifestSha256: input.requirementManifestSha256,
      claimsPath: "kb/claims.json",
      claimsSha256: input.claimsSha256,
      evidencePath: "kb/evidence-items.json",
      evidenceSha256: input.evidenceSha256,
      normalizedInputSha256,
    },
    claims: ranked.map((entry) => ({
      claimId: entry.claim.id,
      claimSha256: hashText(stableJson(entry.claim)),
      evidenceItemIds: [...entry.claim.supportingEvidenceIds].sort(),
      priority: entry.priority,
      priorityBasis: entry.priorityBasis,
      matchingRequirementIds: entry.matchingRequirementIds,
      matchingTerms: entry.matchingTerms,
      potentialMetric: entry.potentialMetric,
      selectedForControlledReview: selected.has(entry.claim.id),
      ...(templatePaths.has(entry.claim.id)
        ? { reviewInputTemplatePath: templatePaths.get(entry.claim.id)! }
        : {}),
    })),
    controlledReviewSubsetClaimIds: selectedIds,
    priorityCounts,
    candidateClaimCount: ranked.length,
    warning: "Batch priority organizes human review only; it does not establish factual support, approval, eligibility, or fit.",
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  await writeJsonAtomic(paths.batchPath, batch);
  const templateFiles = [];
  for (const claimId of selectedIds) {
    const claim = input.claims.find(({ id }) => id === claimId)!;
    const templatePath = resolveWithin(workspace, templatePaths.get(claimId)!);
    const template = EvidenceReviewInputTemplateSchema.parse({
      schemaVersion: 1,
      templateForClaimId: claimId,
      reviewedClaimSha256: hashText(claim.claim),
      instructions: [
        "Read the immutable claim and all referenced evidence before deciding.",
        "Replace every null with a controlled value documented in README.md.",
        "This template is not a review decision and has no eligibility effect until submitted.",
      ],
      reviewInput: {
        schemaVersion: 1,
        claimId,
        reviewedClaimSha256: hashText(claim.claim),
        decision: null,
        correctedClaim: null,
        requiredQualifiers: [],
        factualSupport: null,
        scope: null,
        publicSafety: null,
        resumeReadiness: null,
        eligibleForRoleMatching: null,
        eligibleForJobMapping: null,
        metricReview: {
          state: null,
          exactText: null,
          unit: null,
          scope: null,
          qualifiers: [],
        },
        classification: { workContext: null, claimNature: null },
        risks: [],
        warnings: [],
        ambiguities: [],
        reviewerRationale: null,
      },
    });
    await writeJsonAtomic(templatePath, template);
    templateFiles.push({ path: templatePaths.get(claimId)!, sha256: await hashFile(templatePath) });
  }
  const batchSha256 = await hashFile(paths.batchPath);
  const manifest = EvidenceReviewBatchManifestSchema.parse({
    schemaVersion: EVIDENCE_REVIEW_BATCH_SCHEMA_VERSION,
    batchId,
    targetId,
    batchPath: paths.batchRelativePath,
    batchSha256,
    policyName: EVIDENCE_REVIEW_BATCH_POLICY_NAME,
    policyVersion: EVIDENCE_REVIEW_BATCH_POLICY_VERSION,
    normalizedInputSha256,
    targetSha256: input.targetSha256,
    requirementModelSha256: input.requirementModelSha256,
    requirementManifestSha256: input.requirementManifestSha256,
    claimsSha256: input.claimsSha256,
    evidenceSha256: input.evidenceSha256,
    templateFiles,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
  const status = await getEvidenceReviewBatchStatus(workspace, batchId);
  if (status.status !== "current") {
    throw new Error(`Created review batch failed validation: ${status.reasons.join(" ")}`);
  }
  return resultFor(batch, manifest, paths, options.rebuild ? "rebuilt" : "created");
}

export async function showEvidenceReviewBatch(
  workspace: string,
  batchId: string,
): Promise<EvidenceReviewBatch> {
  const paths = evidenceReviewBatchPaths(workspace, batchId);
  if (!(await pathExists(paths.batchPath))) throw new Error(`Evidence review batch not found: ${batchId}`);
  return EvidenceReviewBatchSchema.parse(await readJson<unknown>(paths.batchPath, null));
}

export async function listEvidenceReviewBatches(workspace: string): Promise<EvidenceReviewBatchStatus[]> {
  const files = (await walkFiles(resolveWithin(workspace, BATCH_ROOT)))
    .filter((file) => path.basename(file) === BATCH_FILE);
  return Promise.all(files.map((file) =>
    getEvidenceReviewBatchStatus(workspace, path.basename(path.dirname(file)))))
    .then((entries) => entries.sort((left, right) => left.batchId.localeCompare(right.batchId)));
}

export async function getEvidenceReviewBatchStatus(
  workspace: string,
  batchId: string,
): Promise<EvidenceReviewBatchStatus> {
  const paths = evidenceReviewBatchPaths(workspace, batchId);
  const batchExists = await pathExists(paths.batchPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const base = {
    batchId,
    batchExists,
    manifestExists,
    batchPath: paths.batchRelativePath,
    manifestPath: paths.manifestRelativePath,
  };
  if (!batchExists && !manifestExists) return emptyStatus(base, "missing", ["Evidence review batch does not exist."]);
  if (!batchExists || !manifestExists) return emptyStatus(base, "invalid", ["Evidence review batch artifact set is incomplete."]);
  let batch: EvidenceReviewBatch;
  let manifest: EvidenceReviewBatchManifest;
  try {
    batch = EvidenceReviewBatchSchema.parse(await readJson<unknown>(paths.batchPath, null));
    manifest = EvidenceReviewBatchManifestSchema.parse(await readJson<unknown>(paths.manifestPath, null));
  } catch (error) {
    return emptyStatus(base, "invalid", [`Evidence review batch is invalid: ${errorMessage(error)}`]);
  }
  const batchHashMatches = await hashFile(paths.batchPath) === manifest.batchSha256;
  const policyMatches =
    batch.policy.name === EVIDENCE_REVIEW_BATCH_POLICY_NAME &&
    batch.policy.version === EVIDENCE_REVIEW_BATCH_POLICY_VERSION &&
    manifest.policyName === EVIDENCE_REVIEW_BATCH_POLICY_NAME &&
    manifest.policyVersion === EVIDENCE_REVIEW_BATCH_POLICY_VERSION;
  const templateChecks = await Promise.all(manifest.templateFiles.map(async (file) =>
    await pathExists(resolveWithin(workspace, file.path)) &&
    await hashFile(resolveWithin(workspace, file.path)) === file.sha256));
  const templatesMatch = templateChecks.every(Boolean) &&
    manifest.templateFiles.length === batch.controlledReviewSubsetClaimIds.length;
  let inputsMatch = false;
  const reasons: string[] = [];
  try {
    const input = await loadBatchInput(workspace, batch.targetId);
    const reranked = rankClaims(input.claims, input.evidence, input.requirements);
    const normalizedInputSha256 = normalizedBatchInputSha256(
      input,
      reranked,
      batch.controlledReviewSubsetClaimIds.length,
    );
    inputsMatch =
      input.targetSha256 === manifest.targetSha256 &&
      input.requirementModelSha256 === manifest.requirementModelSha256 &&
      input.requirementManifestSha256 === manifest.requirementManifestSha256 &&
      input.claimsSha256 === manifest.claimsSha256 &&
      input.evidenceSha256 === manifest.evidenceSha256 &&
      normalizedInputSha256 === manifest.normalizedInputSha256 &&
      normalizedInputSha256 === batch.input.normalizedInputSha256;
  } catch (error) {
    reasons.push(`Batch dependency validation failed: ${errorMessage(error)}`);
  }
  if (!batchHashMatches) reasons.push("Batch SHA-256 does not match its manifest.");
  if (!policyMatches) reasons.push("Batch prioritization policy changed.");
  if (!templatesMatch) reasons.push("Controlled review input templates are missing or modified.");
  if (!inputsMatch) reasons.push("Target requirements or referenced Evidence Foundation inputs changed.");
  if (batch.id !== batchId || manifest.batchId !== batchId || manifest.batchPath !== paths.batchRelativePath) {
    reasons.push("Batch identity or persistence path is invalid.");
  }
  const invalid = !batchHashMatches || !templatesMatch ||
    batch.id !== batchId || manifest.batchId !== batchId || manifest.batchPath !== paths.batchRelativePath;
  return {
    ...base,
    targetId: batch.targetId,
    batchHashMatches,
    inputsMatch,
    policyMatches,
    templatesMatch,
    status: invalid ? "invalid" : reasons.length === 0 ? "current" : "stale",
    reasons,
  };
}

export function evidenceReviewBatchPaths(workspace: string, batchId: string): EvidenceReviewBatchPaths {
  if (!/^evidence-review-batch_[a-f0-9]{20}$/.test(batchId)) {
    throw new Error(`Invalid evidence review batch ID: ${batchId}`);
  }
  const rootRelativePath = `${BATCH_ROOT}/${batchId}`;
  const batchRelativePath = `${rootRelativePath}/${BATCH_FILE}`;
  const manifestRelativePath = `${rootRelativePath}/${MANIFEST_FILE}`;
  const templateRootRelativePath = `${rootRelativePath}/${TEMPLATE_DIR}`;
  return {
    rootRelativePath,
    rootPath: resolveWithin(workspace, rootRelativePath),
    batchRelativePath,
    batchPath: resolveWithin(workspace, batchRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
    templateRootRelativePath,
    templateRootPath: resolveWithin(workspace, templateRootRelativePath),
  };
}

export function formatEvidenceReviewBatchResult(result: BuildEvidenceReviewBatchResult): string {
  return [
    `Batch ID: ${result.batchId}`,
    `Target ID: ${result.targetId}`,
    `Build result: ${result.result}`,
    `Candidates: ${result.candidateClaimCount}`,
    `Priority: high=${result.priorityCounts.high}, medium=${result.priorityCounts.medium}, low=${result.priorityCounts.low}`,
    `Controlled subset: ${result.controlledReviewSubsetClaimIds.length}`,
    `Batch: ${result.batchPath}`,
    `Manifest: ${result.manifestPath}`,
    "Templates:",
    ...result.templatePaths.map((entry) => `- ${entry}`),
  ].join("\n");
}

export function formatEvidenceReviewBatchStatus(status: EvidenceReviewBatchStatus): string {
  return [
    `Batch ID: ${status.batchId}`,
    `Target ID: ${status.targetId ?? "unknown"}`,
    `Status: ${status.status}`,
    `Batch hash matches: ${formatCheck(status.batchHashMatches)}`,
    `Inputs match: ${formatCheck(status.inputsMatch)}`,
    `Policy matches: ${formatCheck(status.policyMatches)}`,
    `Templates match: ${formatCheck(status.templatesMatch)}`,
    ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
  ].join("\n");
}

export function formatEvidenceReviewBatchList(statuses: EvidenceReviewBatchStatus[]): string {
  if (statuses.length === 0) return "Evidence review batches: none";
  return [
    "Evidence review batches:",
    ...statuses.map((status) => `${status.batchId} | ${status.targetId ?? "unknown"} | ${status.status}`),
  ].join("\n");
}

function rankClaims(claims: Claim[], evidence: EvidenceItem[], requirements: JobRequirement[]) {
  const evidenceById = new Map(evidence.map((entry) => [entry.id, entry]));
  return claims.map((claim) => {
    const linkedEvidence = claim.supportingEvidenceIds.map((id) => evidenceById.get(id)).filter(
      (entry): entry is EvidenceItem => Boolean(entry),
    );
    const corpus = normalized([
      claim.claim,
      ...linkedEvidence.flatMap((entry) => [
        entry.text,
        entry.normalizedSummary,
        ...(entry.technologies ?? []),
        ...(entry.domains ?? []),
        entry.category,
      ]),
    ].join(" "));
    const overlaps = requirements.flatMap((requirement) => {
      const terms = requirementTerms(requirement);
      const matchingTerms = terms.filter((term) => containsTerm(corpus, term));
      return matchingTerms.length > 0 ? [{ requirement, matchingTerms }] : [];
    });
    const mandatory = overlaps.filter(({ requirement }) => requirement.necessity === "mandatory");
    const preferred = overlaps.filter(({ requirement }) => requirement.necessity === "preferred");
    const contextual = overlaps.filter(({ requirement }) => requirement.necessity === "contextual");
    const namedTechnology = overlaps.some(({ requirement, matchingTerms }) =>
      matchingTerms.some((term) => requirement.namedTechnologies.map(normalized).includes(term)));
    const categorySignal = linkedEvidence.some((entry) =>
      ["achievement", "project", "responsibility", "role", "skill", "domain"].includes(entry.category));
    const potentialMetric = claim.metricStatus !== "no_metric" || /\b\d+(?:[.,]\d+)?(?:%|\+)?\b/.test(claim.claim);
    let priority: EvidenceReviewBatchPriority = "low";
    const explicitMandatorySignal = mandatory.some(({ requirement, matchingTerms }) => {
      const controlled = new Set([
        ...requirement.namedTechnologies,
        ...requirement.keywords,
      ].map(normalized));
      return matchingTerms.some((term) => controlled.has(term));
    });
    if (mandatory.length > 0 &&
        (namedTechnology || explicitMandatorySignal || mandatory.some(({ matchingTerms }) => matchingTerms.length >= 2))) {
      priority = "high";
    } else if (overlaps.length > 0) {
      priority = "medium";
    }
    const priorityBasis = sortedUnique([
      ...(mandatory.length ? ["mandatory-requirement-terminology" as const] : []),
      ...(preferred.length ? ["preferred-requirement-terminology" as const] : []),
      ...(contextual.length ? ["contextual-requirement-terminology" as const] : []),
      ...(namedTechnology ? ["named-technology-or-domain" as const] : []),
      ...(categorySignal ? ["reviewed-category" as const] : []),
      ...(potentialMetric ? ["potential-metric" as const] : []),
      ...(overlaps.length === 0 ? ["no-explicit-overlap" as const] : []),
    ]);
    return {
      claim,
      priority,
      priorityBasis,
      matchingRequirementIds: sortedUnique(overlaps.map(({ requirement }) => requirement.id)),
      matchingTerms: sortedUnique(overlaps.flatMap(({ matchingTerms }) => matchingTerms)),
      potentialMetric,
    };
  }).sort((left, right) =>
    priorityOrder(left.priority) - priorityOrder(right.priority) ||
    right.matchingRequirementIds.length - left.matchingRequirementIds.length ||
    left.claim.id.localeCompare(right.claim.id));
}

function selectControlledSubset<T extends {
  claim: Claim;
  priority: EvidenceReviewBatchPriority;
  potentialMetric: boolean;
}>(ranked: T[], size: number): string[] {
  const selected: T[] = [];
  const take = (priority: EvidenceReviewBatchPriority, count: number) => {
    for (const entry of ranked.filter((candidate) => candidate.priority === priority)) {
      if (selected.length >= size || selected.filter((item) => item.priority === priority).length >= count) break;
      if (!selected.includes(entry)) selected.push(entry);
    }
  };
  const availableLow = ranked.filter(({ priority }) => priority === "low").length;
  const lowTarget = Math.min(availableLow, Math.max(2, Math.floor(size / 4)));
  take("high", Math.ceil(size / 2));
  take("medium", Math.max(1, size - selected.length - lowTarget));
  take("low", lowTarget);
  for (const entry of ranked) {
    if (selected.length >= size) break;
    if (!selected.includes(entry)) selected.push(entry);
  }
  const metric = ranked.find(({ potentialMetric }) => potentialMetric);
  if (metric && !selected.includes(metric) && selected.length > 0) selected[selected.length - 1] = metric;
  return sortedUnique(selected.map(({ claim }) => claim.id));
}

async function loadBatchInput(workspace: string, targetId: string) {
  const target = await showTarget(workspace, targetId);
  if (target.type !== "job") throw new Error(`Evidence review batches require a Job Target: ${targetId}`);
  const requirementStatus = await getJobRequirementModelStatus(workspace, targetId);
  if (requirementStatus.status !== "current") {
    throw new Error(`Job Requirement Model must be current before prioritization: ${requirementStatus.status}`);
  }
  const requirementPaths = jobRequirementPaths(workspace, targetId);
  const requirementModel = await showJobRequirementModel(workspace, targetId);
  const requirementManifest = JobRequirementModelManifestSchema.parse(
    await readJson<unknown>(requirementPaths.manifestPath, null),
  );
  const claimsPath = resolveWithin(workspace, "kb/claims.json");
  const evidencePath = resolveWithin(workspace, "kb/evidence-items.json");
  const claims = (await readJson<unknown[]>(claimsPath, [])).map((entry) => ClaimSchema.parse(entry)).sort(byId);
  const evidence = (await readJson<unknown[]>(evidencePath, [])).map((entry) => EvidenceItemSchema.parse(entry)).sort(byId);
  return {
    targetPath: `targets/jobs/${targetId}/target.json`,
    targetSha256: await hashFile(resolveWithin(workspace, `targets/jobs/${targetId}/target.json`)),
    requirementModelPath: requirementPaths.modelRelativePath,
    requirementModelSha256: requirementManifest.modelSha256,
    requirementManifestPath: requirementPaths.manifestRelativePath,
    requirementManifestSha256: await hashFile(requirementPaths.manifestPath),
    claimsSha256: await hashFile(claimsPath),
    evidenceSha256: await hashFile(evidencePath),
    requirements: requirementModel.requirements,
    claims,
    evidence,
  };
}

function requirementTerms(requirement: JobRequirement): string[] {
  return sortedUnique([
    ...requirement.namedTechnologies,
    ...requirement.keywords,
    ...normalized(requirement.normalizedLabel).split(" ").filter((token) =>
      token.length >= 5 && !TERM_STOP_WORDS.has(token)),
  ].map(normalized).filter(Boolean));
}

const TERM_STOP_WORDS = new Set([
  "about", "after", "again", "against", "being", "building", "built", "central", "directly",
  "experience", "first", "genuine", "rather", "their", "there", "these", "those", "through",
  "within", "without", "would", "person", "products", "product", "preferred", "requirement",
]);

function containsTerm(corpus: string, term: string): boolean {
  return term.includes(" ") ? corpus.includes(term) : corpus.split(" ").includes(term);
}

function priorityOrder(priority: EvidenceReviewBatchPriority): number {
  return priority === "high" ? 0 : priority === "medium" ? 1 : 2;
}

function resultFor(
  batch: EvidenceReviewBatch,
  manifest: EvidenceReviewBatchManifest,
  paths: EvidenceReviewBatchPaths,
  result: BuildEvidenceReviewBatchResult["result"],
): BuildEvidenceReviewBatchResult {
  return {
    batchId: batch.id,
    targetId: batch.targetId,
    result,
    batchPath: paths.batchRelativePath,
    manifestPath: paths.manifestRelativePath,
    candidateClaimCount: batch.candidateClaimCount,
    priorityCounts: batch.priorityCounts,
    controlledReviewSubsetClaimIds: batch.controlledReviewSubsetClaimIds,
    templatePaths: manifest.templateFiles.map(({ path }) => path),
  };
}

function emptyStatus(
  base: Pick<EvidenceReviewBatchStatus, "batchId" | "batchExists" | "manifestExists" | "batchPath" | "manifestPath">,
  status: "missing" | "invalid",
  reasons: string[],
): EvidenceReviewBatchStatus {
  return {
    ...base,
    batchHashMatches: null,
    inputsMatch: null,
    policyMatches: null,
    templatesMatch: null,
    status,
    reasons,
  };
}

function formatCheck(value: boolean | null): string {
  return value === null ? "not applicable" : value ? "yes" : "no";
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

function safeSegment(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]/g, "-");
}

function normalized(value: string): string {
  return value.normalize("NFKC").toLowerCase()
    .replace(/\bai\b/g, "artificial intelligence")
    .replace(/[^a-z0-9+#]+/g, " ")
    .trim();
}

function normalizedBatchInputSha256(
  input: Awaited<ReturnType<typeof loadBatchInput>>,
  ranked: ReturnType<typeof rankClaims>,
  subsetSize: number,
): string {
  return hashText(stableJson({
    policy: {
      name: EVIDENCE_REVIEW_BATCH_POLICY_NAME,
      version: EVIDENCE_REVIEW_BATCH_POLICY_VERSION,
    },
    rules: {
      terminologyNormalization: "exact-terms-v1",
      priorityClassification: "mandatory-explicit-signal-v1",
      controlledSubset: "priority-mix-v1",
    },
    targetSha256: input.targetSha256,
    requirementModelSha256: input.requirementModelSha256,
    requirementManifestSha256: input.requirementManifestSha256,
    claimsSha256: input.claimsSha256,
    evidenceSha256: input.evidenceSha256,
    subsetSize,
    controlledReviewSubsetClaimIds: selectControlledSubset(ranked, subsetSize),
    ranked: ranked.map(({ claim, priority, priorityBasis, matchingRequirementIds, matchingTerms, potentialMetric }) => ({
      claimId: claim.id,
      claimSha256: hashText(stableJson(claim)),
      priority,
      priorityBasis,
      matchingRequirementIds,
      matchingTerms,
      potentialMetric,
    })),
  }));
}

function sortedUnique<T extends string>(values: T[]): T[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function byId<T extends { id: string }>(left: T, right: T): number {
  return left.id.localeCompare(right.id);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
