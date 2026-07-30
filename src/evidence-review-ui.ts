import {
  createEvidenceClaimReview,
  getEvidenceClaimReviewStatus,
  listEvidenceClaimReviews,
  loadEffectiveEvidenceClaimReviews,
  type CreateEvidenceClaimReviewResult,
} from "./evidence-claim-review.js";
import {
  EvidenceClaimFactualSupportSchema,
  EvidenceClaimMetricReviewStateSchema,
  EvidenceClaimNatureSchema,
  EvidenceClaimPublicSafetySchema,
  EvidenceClaimResumeReadinessSchema,
  EvidenceClaimReviewDecisionSchema,
  EvidenceClaimReviewInputSchema,
  EvidenceClaimScopeStateSchema,
  EvidenceClaimWorkContextSchema,
  type EvidenceClaimReviewInput,
} from "./evidence-claim-review-schemas.js";
import { getEvidenceReviewBatchStatus } from "./evidence-review-batch.js";
import {
  evidenceReviewSelectionReason,
  loadEvidenceReviewWorkspaceData,
  type EvidenceReviewWorkspaceClaimData,
} from "./evidence-review-workspace.js";
import { deriveHumanTitle } from "./human-readable-markdown.js";
import { projectEvidenceReviewIntent } from "./evidence-review-intent.js";

export const EVIDENCE_REVIEW_UI_NAME = "ProofLayer Local Evidence Review UI";

export const evidenceReviewUiFormOptions = {
  decisions: EvidenceClaimReviewDecisionSchema.options,
  factualSupport: EvidenceClaimFactualSupportSchema.options,
  scopes: EvidenceClaimScopeStateSchema.options,
  publicSafety: EvidenceClaimPublicSafetySchema.options,
  resumeReadiness: EvidenceClaimResumeReadinessSchema.options,
  metricStates: EvidenceClaimMetricReviewStateSchema.options,
  workContexts: EvidenceClaimWorkContextSchema.options,
  claimNatures: EvidenceClaimNatureSchema.options,
} as const;

export interface EvidenceReviewUiSource {
  id: string;
  label: string;
  type: string;
  visibility: string;
  status: string;
  sha256: string;
}

export interface EvidenceReviewUiEvidence {
  id: string;
  title: string;
  summary: string;
  sourceExcerpt?: string;
  excerptWithheld: boolean;
  category: string;
  confidence: string;
  visibility: string;
  sensitivityFlags: string[];
  parentRoleId?: string;
  parentProjectId?: string;
  dateRange?: string;
  company?: string;
  project?: string;
  technologies: string[];
  domains: string[];
  sources: EvidenceReviewUiSource[];
}

export interface EvidenceReviewUiRequirement {
  id: string;
  title: string;
  sourceText: string;
  category: string;
  necessity: string;
  confidence: string;
  explicitness: string;
  namedTechnologies: string[];
  keywords: string[];
  sourceReferences: Array<{
    label: string;
    startLine: number;
    endLine: number;
    sha256: string;
    excerptSha256: string;
  }>;
}

export interface EvidenceReviewUiClaim {
  id: string;
  title: string;
  text: string;
  priority: "high" | "medium" | "low";
  selectionReason: string;
  potentialMetric: boolean;
  sourceApprovalStatus: string;
  sourceOutputReadiness: string;
  sourcePublicSafe: boolean;
  sourceNeedsConfirmation: boolean;
  sourceMetricStatus: string;
  sourceUnsafeWording: string[];
  sourceClassification: {
    type: string;
    section?: string;
    dateRange?: string;
    parentRoleId?: string;
    parentProjectId?: string;
  };
  review: {
    lifecycle: "missing" | "current" | "stale" | "invalid" | "superseded";
    id?: string;
    decision?: string;
    factualSupport?: string;
    scope?: string;
    publicSafety?: string;
    resumeReadiness?: string;
    eligibleForRoleMatching?: boolean;
    eligibleForJobMapping?: boolean;
    requiredQualifiers: string[];
    workContext?: string;
    claimNature?: string;
  };
  evidence: EvidenceReviewUiEvidence[];
  requirements: EvidenceReviewUiRequirement[];
  template: {
    path: string;
    sha256: string;
    reviewedClaimSha256: string;
  };
  audit: {
    batchId: string;
    targetId: string;
    claimRecordSha256: string;
    evidenceSetSha256: string;
    provenanceSetSha256: string;
    requirementSetSha256: string;
  };
}

export interface EvidenceReviewUiBatch {
  batchId: string;
  target: {
    id: string;
    title: string;
    company?: string;
    location?: string;
    workingModel?: string;
  };
  stage: "Evidence Review";
  purpose: string;
  warning: string;
  claims: EvidenceReviewUiClaim[];
  progress: {
    selected: number;
    reviewed: number;
    pending: number;
    selectedPriority: { high: number; medium: number; low: number };
    decisions: Record<string, number>;
  };
  complete: boolean;
  nextPendingClaimId?: string;
  nextCommand: string;
}

export interface EvidenceReviewUiSubmission {
  result: CreateEvidenceClaimReviewResult;
  nextPendingClaimId?: string;
  batchComplete: boolean;
}

export class EvidenceReviewUiSubmissionError extends Error {
  readonly fieldErrors: Record<string, string[]>;

  constructor(message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = "EvidenceReviewUiSubmissionError";
    this.fieldErrors = fieldErrors;
  }
}

export async function loadEvidenceReviewUiBatch(
  workspace: string,
  batchId: string,
): Promise<EvidenceReviewUiBatch> {
  const status = await getEvidenceReviewBatchStatus(workspace, batchId);
  if (status.status !== "current") {
    throw new Error(`Evidence review batch must be current before opening the UI: ${status.status}.`);
  }
  const data = await loadEvidenceReviewWorkspaceData(workspace, batchId);
  const [effectiveReviews, reviewEntries] = await Promise.all([
    loadEffectiveEvidenceClaimReviews(workspace),
    listEvidenceClaimReviews(workspace),
  ]);
  const reviewEntryByClaim = new Map(reviewEntries.map((entry) => [entry.claimId, entry]));
  const claims = data.claims.map((claim) => toUiClaim(
    data.batch.id,
    data.target.id,
    claim,
    reviewEntryByClaim.get(claim.claim.id)?.status ?? "missing",
    effectiveReviews.get(claim.claim.id)?.review,
  ));
  const reviewed = claims.filter(({ review }) => review.lifecycle === "current").length;
  const selectedPriority = {
    high: claims.filter(({ priority }) => priority === "high").length,
    medium: claims.filter(({ priority }) => priority === "medium").length,
    low: claims.filter(({ priority }) => priority === "low").length,
  };
  const decisions: Record<string, number> = {};
  for (const claim of claims) {
    if (claim.review.lifecycle !== "current" || !claim.review.decision) continue;
    decisions[claim.review.decision] = (decisions[claim.review.decision] ?? 0) + 1;
  }
  const nextPendingClaimId = claims.find(({ review }) => review.lifecycle !== "current")?.id;
  return {
    batchId: data.batch.id,
    target: {
      id: data.target.id,
      title: data.target.title,
      ...(data.target.company ? { company: data.target.company } : {}),
      ...(data.target.location ? { location: data.target.location } : {}),
      ...(data.target.workingModel ? { workingModel: data.target.workingModel } : {}),
    },
    stage: "Evidence Review",
    purpose: "Review selected candidate claims against their evidence and matching Job requirements before they can become eligible downstream.",
    warning: data.batch.warning,
    claims,
    progress: {
      selected: claims.length,
      reviewed,
      pending: claims.length - reviewed,
      selectedPriority,
      decisions,
    },
    complete: claims.length > 0 && reviewed === claims.length,
    ...(nextPendingClaimId ? { nextPendingClaimId } : {}),
    nextCommand: `prooflayer job continue ${data.target.id}`,
  };
}

export async function loadEvidenceReviewUiClaim(
  workspace: string,
  batchId: string,
  claimId: string,
): Promise<{ batch: EvidenceReviewUiBatch; claim: EvidenceReviewUiClaim }> {
  const batch = await loadEvidenceReviewUiBatch(workspace, batchId);
  const claim = batch.claims.find((entry) => entry.id === claimId);
  if (!claim) throw new Error("Unknown claim or claim does not belong to the active review batch.");
  return { batch, claim };
}

export async function submitEvidenceReviewUiClaim(
  workspace: string,
  batchId: string,
  claimId: string,
  fields: Record<string, string | undefined>,
  options: { readOnly?: boolean } = {},
): Promise<EvidenceReviewUiSubmission> {
  if (options.readOnly) {
    throw new EvidenceReviewUiSubmissionError("This review session is read-only.");
  }
  const { claim } = await loadEvidenceReviewUiClaim(workspace, batchId, claimId);
  let rawInput: unknown;
  if (fields.reviewMode === "simple") {
    const projection = projectEvidenceReviewIntent(claim, fields);
    if (projection.status !== "ready" || !projection.input) {
      throw new EvidenceReviewUiSubmissionError(
        projection.status === "blocked"
          ? "This decision cannot be recorded safely in Simple Review. Choose another decision or use Advanced Review."
          : "A little more information is needed before this review can be recorded.",
        projection.fieldErrors,
      );
    }
    rawInput = projection.input;
  } else {
    rawInput = reviewInputFromFields(claim, fields);
  }
  const parsed = EvidenceClaimReviewInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new EvidenceReviewUiSubmissionError(
      "Review validation failed. Correct the highlighted fields and submit again.",
      zodFieldErrors(parsed.error.issues),
    );
  }
  let input: EvidenceClaimReviewInput = parsed.data;
  if (fields.confirmSupersession === "true") {
    if (!claim.review.id || claim.review.lifecycle !== "current") {
      throw new EvidenceReviewUiSubmissionError(
        "There is no current review to supersede.",
        { confirmSupersession: ["A current review is required before supersession."] },
      );
    }
    input = { ...input, supersedesReviewId: claim.review.id };
  }
  let result: CreateEvidenceClaimReviewResult;
  try {
    result = await createEvidenceClaimReview(workspace, claimId, input);
  } catch (error) {
    const message = safeErrorMessage(error);
    throw new EvidenceReviewUiSubmissionError(message, inferServiceFieldErrors(message));
  }
  const refreshed = await loadEvidenceReviewUiBatch(workspace, batchId);
  return {
    result,
    ...(refreshed.nextPendingClaimId ? { nextPendingClaimId: refreshed.nextPendingClaimId } : {}),
    batchComplete: refreshed.complete,
  };
}

export async function validateEvidenceReviewUiBatch(
  workspace: string,
  batchId: string,
): Promise<EvidenceReviewUiBatch> {
  return loadEvidenceReviewUiBatch(workspace, batchId);
}

function toUiClaim(
  batchId: string,
  targetId: string,
  item: EvidenceReviewWorkspaceClaimData,
  lifecycle: EvidenceReviewUiClaim["review"]["lifecycle"],
  review?: Awaited<ReturnType<typeof loadEffectiveEvidenceClaimReviews>> extends Map<string, infer Value>
    ? Value extends { review: infer Review } ? Review : never
    : never,
): EvidenceReviewUiClaim {
  const sourceById = new Map(item.sources.map((source) => [source.id, source]));
  const evidence = item.evidence.map((entry): EvidenceReviewUiEvidence => {
    const sources = entry.sourceIds.map((sourceId) => sourceById.get(sourceId)).filter(
      (source): source is NonNullable<typeof source> => Boolean(source),
    );
    const excerptWithheld =
      !["public", "generic_only"].includes(entry.visibility) ||
      entry.sensitivityFlags.length > 0 ||
      sources.some((source) => !["public", "generic_only"].includes(source.visibility));
    return {
      id: entry.id,
      title: deriveHumanTitle(entry.normalizedSummary || entry.text, "Untitled evidence"),
      summary: entry.normalizedSummary,
      ...(!excerptWithheld ? { sourceExcerpt: entry.text } : {}),
      excerptWithheld,
      category: entry.category,
      confidence: entry.confidence,
      visibility: entry.visibility,
      sensitivityFlags: [...entry.sensitivityFlags],
      ...(entry.parentRoleId ? { parentRoleId: entry.parentRoleId } : {}),
      ...(entry.parentProjectId ? { parentProjectId: entry.parentProjectId } : {}),
      ...(entry.dateRange ? { dateRange: entry.dateRange } : {}),
      ...(entry.company ? { company: entry.company } : {}),
      ...(entry.project ? { project: entry.project } : {}),
      technologies: entry.technologies ?? [],
      domains: entry.domains ?? [],
      sources: sources.map((source) => ({
        id: source.id,
        label: source.title || source.type,
        type: source.type,
        visibility: source.visibility,
        status: source.status,
        sha256: source.hash,
      })),
    };
  });
  const requirements = item.requirements.map((requirement): EvidenceReviewUiRequirement => ({
    id: requirement.id,
    title: deriveHumanTitle(requirement.normalizedLabel || requirement.sourceText, "Untitled requirement"),
    sourceText: requirement.sourceText,
    category: requirement.category,
    necessity: requirement.necessity,
    confidence: requirement.confidence,
    explicitness: requirement.explicitness,
    namedTechnologies: requirement.namedTechnologies,
    keywords: requirement.keywords,
    sourceReferences: requirement.provenance.sourceReferences.map((reference) => ({
      label: "Persisted Job Description",
      startLine: reference.startLine,
      endLine: reference.endLine,
      sha256: reference.sha256,
      excerptSha256: reference.excerptSha256,
    })),
  }));
  return {
    id: item.claim.id,
    title: deriveHumanTitle(item.claim.claim, "Untitled claim"),
    text: item.claim.claim,
    priority: item.entry.priority,
    selectionReason: evidenceReviewSelectionReason(item.entry),
    potentialMetric: item.entry.potentialMetric,
    sourceApprovalStatus: item.claim.approvalStatus,
    sourceOutputReadiness: item.claim.outputReadiness,
    sourcePublicSafe: item.claim.publicSafe,
    sourceNeedsConfirmation: item.claim.needsConfirmation,
    sourceMetricStatus: item.claim.metricStatus,
    sourceUnsafeWording: [...(item.claim.unsafeWording ?? [])],
    sourceClassification: {
      type: item.claim.type,
      ...(item.claim.sourceSection ? { section: item.claim.sourceSection } : {}),
      ...(item.claim.dateRange ? { dateRange: item.claim.dateRange } : {}),
      ...(item.claim.parentRoleId ? { parentRoleId: item.claim.parentRoleId } : {}),
      ...(item.claim.parentProjectId ? { parentProjectId: item.claim.parentProjectId } : {}),
    },
    review: {
      lifecycle,
      ...(review
        ? {
            id: review.id,
            decision: review.decision,
            factualSupport: review.factualSupport,
            scope: review.scope,
            publicSafety: review.publicSafety,
            resumeReadiness: review.resumeReadiness,
            eligibleForRoleMatching: review.eligibleForRoleMatching,
            eligibleForJobMapping: review.eligibleForJobMapping,
            requiredQualifiers: review.requiredQualifiers,
            workContext: review.classification.workContext,
            claimNature: review.classification.claimNature,
          }
        : { requiredQualifiers: [] }),
    },
    evidence,
    requirements,
    template: {
      path: item.templatePath,
      sha256: item.templateSha256,
      reviewedClaimSha256: item.template.reviewedClaimSha256,
    },
    audit: {
      batchId,
      targetId,
      claimRecordSha256: item.claimRecordSha256,
      evidenceSetSha256: item.evidenceSetSha256,
      provenanceSetSha256: item.provenanceSetSha256,
      requirementSetSha256: item.requirementSetSha256,
    },
  };
}

function reviewInputFromFields(
  claim: EvidenceReviewUiClaim,
  fields: Record<string, string | undefined>,
): unknown {
  const correctedClaim = optional(fields.correctedClaim);
  const metricExactText = optional(fields.metricExactText);
  const metricUnit = optional(fields.metricUnit);
  const metricScope = optional(fields.metricScope);
  return {
    schemaVersion: 1,
    claimId: claim.id,
    reviewedClaimSha256: claim.template.reviewedClaimSha256,
    decision: fields.decision,
    ...(correctedClaim ? { correctedClaim } : {}),
    requiredQualifiers: lines(fields.requiredQualifiers),
    factualSupport: fields.factualSupport,
    scope: fields.scope,
    publicSafety: fields.publicSafety,
    resumeReadiness: fields.resumeReadiness,
    eligibleForRoleMatching: booleanField(fields.eligibleForRoleMatching),
    eligibleForJobMapping: booleanField(fields.eligibleForJobMapping),
    metricReview: {
      state: fields.metricState,
      ...(metricExactText ? { exactText: metricExactText } : {}),
      ...(metricUnit ? { unit: metricUnit } : {}),
      ...(metricScope ? { scope: metricScope } : {}),
      qualifiers: lines(fields.metricQualifiers),
    },
    classification: {
      workContext: fields.workContext,
      claimNature: fields.claimNature,
    },
    risks: riskLines(fields.risks),
    warnings: lines(fields.warnings),
    ambiguities: lines(fields.ambiguities),
    reviewerRationale: fields.reviewerRationale,
  };
}

function riskLines(value: string | undefined): Array<{
  severity: string;
  code: string;
  message: string;
}> {
  return lines(value).map((line) => {
    const [severity = "", code = "", ...message] = line.split("|").map((part) => part.trim());
    return { severity, code, message: message.join(" | ") };
  });
}

function lines(value: string | undefined): string[] {
  return (value ?? "").split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean);
}

function optional(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function booleanField(value: string | undefined): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function zodFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = formFieldForPath(issue.path.map(String).join("."));
    result[key] = [...(result[key] ?? []), friendlyValidationMessage(key, issue.message)];
  }
  return result;
}

function friendlyValidationMessage(field: string, original: string): string {
  const messages: Record<string, string> = {
    decision: "Choose a canonical review decision.",
    factualSupport: "Choose whether the claim is supported by the evidence.",
    scope: "Choose the claim's supported scope.",
    publicSafety: "Choose the permitted public-safety state.",
    resumeReadiness: "Choose whether the claim is ready for resume use.",
    eligibleForRoleMatching: "Choose whether the claim is eligible for Role Matching.",
    eligibleForJobMapping: "Choose whether the claim is eligible for Job Mapping.",
    metricState: "Choose the metric verification state.",
    workContext: "Choose the claim's work context.",
    claimNature: "Choose the claim's factual nature.",
    reviewerRationale: "Add a concise evidence-based rationale.",
    correctedClaim: "Enter corrected wording for a qualified approval.",
  };
  if (messages[field]) return messages[field];
  if (/invalid enum|expected/i.test(original)) return "Choose one of the available values.";
  return original;
}

function formFieldForPath(path: string): string {
  const aliases: Record<string, string> = {
    "metricReview.state": "metricState",
    "metricReview.exactText": "metricExactText",
    "metricReview.unit": "metricUnit",
    "metricReview.scope": "metricScope",
    "metricReview.qualifiers": "metricQualifiers",
    "classification.workContext": "workContext",
    "classification.claimNature": "claimNature",
  };
  return aliases[path] ?? path.split(".")[0] ?? "form";
}

function inferServiceFieldErrors(message: string): Record<string, string[]> {
  const field =
    /qualifier|corrected claim/i.test(message) ? "correctedClaim"
      : /metric/i.test(message) ? "metricState"
        : /resume-ready|resume readiness/i.test(message) ? "resumeReadiness"
          : /public|private|restricted/i.test(message) ? "publicSafety"
            : /eligib/i.test(message) ? "eligibleForJobMapping"
              : /project|employment|work context/i.test(message) ? "workContext"
                : /achievement|responsibility/i.test(message) ? "claimNature"
                  : /supersed/i.test(message) ? "confirmSupersession"
                    : "form";
  return { [field]: [message] };
}

function safeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/\/Users\/[^/\s]+(?:\/[^\s:]+)*/g, "<local-path>")
    .replace(/[A-Za-z]:\\[^\s:]+/g, "<local-path>");
}
