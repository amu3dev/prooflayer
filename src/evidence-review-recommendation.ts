import type { EvidenceReviewSimpleIntent } from "./evidence-review-intent.js";
import {
  projectEvidenceReviewIntent,
  type EvidenceReviewIntentPreview,
  type EvidenceReviewIntentProjection,
  type EvidenceReviewIntentQuestion,
} from "./evidence-review-intent.js";
import {
  classifyEvidenceReviewNumericClaim,
  type EvidenceReviewNumericClassification,
} from "./evidence-review-numeric.js";
import type { EvidenceReviewUiClaim } from "./evidence-review-ui.js";

export const EVIDENCE_REVIEW_INTERACTION_LEVELS = [
  "one-click",
  "one-question",
  "manual",
] as const;

export type EvidenceReviewInteractionLevel =
  typeof EVIDENCE_REVIEW_INTERACTION_LEVELS[number];

export interface EvidenceReviewQuestionOption {
  value: string;
  label: string;
}

export interface EvidenceReviewQuestion {
  id: EvidenceReviewIntentQuestion;
  field: "workContext" | "claimNature";
  prompt: string;
  context: string;
  options: EvidenceReviewQuestionOption[];
}

export interface EvidenceReviewRecommendation {
  recommendedIntent?: EvidenceReviewSimpleIntent;
  interactionLevel: EvidenceReviewInteractionLevel;
  recommendationConfidence: "high" | "medium" | "low";
  recommendationReasons: string[];
  requiredHumanQuestions: EvidenceReviewQuestion[];
  blockingAmbiguities: string[];
  projectedCanonicalOutcome: EvidenceReviewIntentPreview;
  canSubmitWithOneClick: boolean;
  canAutoSubmitAfterAnswer: boolean;
  numericClassification: EvidenceReviewNumericClassification;
}

export interface EvidenceReviewRecommendationSubmission {
  status: "ready" | "invalid";
  recommendation: EvidenceReviewRecommendation;
  projection?: EvidenceReviewIntentProjection;
  fieldErrors: Record<string, string[]>;
}

const MANUAL_NUMERIC_CATEGORIES = new Set([
  "count",
  "scale",
  "business-outcome",
  "performance-metric",
  "other-number",
]);

export function deriveEvidenceReviewRecommendation(
  claim: EvidenceReviewUiClaim,
): EvidenceReviewRecommendation {
  const numericClassification = classifyEvidenceReviewNumericClaim(claim.text);
  const approvalProjection = projectEvidenceReviewIntent(claim, { intent: "approve" });
  const exactEvidenceSupport = claim.evidence.some((evidence) =>
    textMatches(claim.text, evidence.summary) ||
    (evidence.sourceExcerpt !== undefined && textMatches(claim.text, evidence.sourceExcerpt)));
  const commonReasons = [
    ...(exactEvidenceSupport ? ["Supported by the displayed evidence"] : []),
    ...(approvalProjection.preview.publicSafety === "public-safe"
      ? ["Public-safe according to reviewed metadata"]
      : []),
    numericReason(numericClassification),
  ];

  if (claim.review.lifecycle === "current") {
    return manualRecommendation(
      approvalProjection,
      numericClassification,
      ["A current immutable review already exists"],
      ["Changing this decision requires explicit supersession"],
    );
  }
  if (claim.review.lifecycle !== "missing") {
    return manualRecommendation(
      approvalProjection,
      numericClassification,
      [`The existing review lifecycle is ${claim.review.lifecycle}`],
      ["The prior review state must be resolved before a new review can be approved"],
    );
  }
  if (claim.sourceUnsafeWording.length > 0) {
    return manualRecommendation(
      approvalProjection,
      numericClassification,
      [...commonReasons, "The wording requires a human correction before approval"],
      claim.sourceUnsafeWording.map((wording) => `Unsafe or overbroad wording: ${wording}`),
      "approve-with-edit",
    );
  }
  if (approvalProjection.status === "blocked") {
    return manualRecommendation(
      approvalProjection,
      numericClassification,
      [...commonReasons, ...plainFieldErrors(approvalProjection)],
      plainFieldErrors(approvalProjection),
    );
  }
  if (!exactEvidenceSupport) {
    return manualRecommendation(
      approvalProjection,
      numericClassification,
      [...commonReasons, "The displayed evidence does not repeat the claim closely enough for one-click approval"],
      ["Claim scope requires a human comparison with the displayed evidence"],
    );
  }
  if (MANUAL_NUMERIC_CATEGORIES.has(numericClassification.category)) {
    return manualRecommendation(
      approvalProjection,
      numericClassification,
      [...commonReasons, numericClassification.reason],
      [numericManualReason(numericClassification)],
    );
  }

  if (approvalProjection.status === "ready") {
    return {
      recommendedIntent: "approve",
      interactionLevel: "one-click",
      recommendationConfidence: "high",
      recommendationReasons: orderedUnique([
        ...commonReasons,
        "Project or employment boundary is clear",
        "Claim classification is clear",
        "No unresolved qualifier",
        "No critical warning",
      ]),
      requiredHumanQuestions: [],
      blockingAmbiguities: [],
      projectedCanonicalOutcome: approvalProjection.preview,
      canSubmitWithOneClick: true,
      canAutoSubmitAfterAnswer: false,
      numericClassification,
    };
  }

  const questions = approvalProjection.questions
    .map(recommendationQuestion)
    .filter((question): question is EvidenceReviewQuestion => question !== undefined);
  if (approvalProjection.questions.length === 1 && questions.length === 1) {
    return {
      recommendedIntent: "approve",
      interactionLevel: "one-question",
      recommendationConfidence: "medium",
      recommendationReasons: orderedUnique([
        ...commonReasons,
        "One classification boundary needs human confirmation",
      ]),
      requiredHumanQuestions: questions,
      blockingAmbiguities: [],
      projectedCanonicalOutcome: approvalProjection.preview,
      canSubmitWithOneClick: false,
      canAutoSubmitAfterAnswer: true,
      numericClassification,
    };
  }

  return manualRecommendation(
    approvalProjection,
    numericClassification,
    [...commonReasons, "More than one boundary needs human review"],
    approvalProjection.questions.map(questionAmbiguity),
  );
}

export function projectEvidenceReviewRecommendationSubmission(
  claim: EvidenceReviewUiClaim,
  fields: Record<string, string | undefined>,
): EvidenceReviewRecommendationSubmission {
  const recommendation = deriveEvidenceReviewRecommendation(claim);
  if (recommendation.interactionLevel === "one-click") {
    if (fields.recommendationAction !== "confirm") {
      return invalidSubmission(
        recommendation,
        "recommendationAction",
        "Use Approve and Next to confirm this recommendation.",
      );
    }
    const projection = projectEvidenceReviewIntent(claim, {
      intent: recommendation.recommendedIntent,
    });
    return projection.status === "ready" && projection.input
      ? { status: "ready", recommendation, projection, fieldErrors: {} }
      : invalidProjection(recommendation, projection);
  }

  if (recommendation.interactionLevel === "one-question") {
    const question = recommendation.requiredHumanQuestions[0];
    if (!question || fields.recommendationQuestionId !== question.id) {
      return invalidSubmission(
        recommendation,
        "recommendationQuestionId",
        "Reload the page and answer the displayed review question.",
      );
    }
    const answer = fields.recommendationAnswer;
    if (!answer || !question.options.some((option) => option.value === answer)) {
      return invalidSubmission(
        recommendation,
        "recommendationAnswer",
        "Choose one of the displayed answers.",
      );
    }
    const projection = projectEvidenceReviewIntent(claim, {
      intent: recommendation.recommendedIntent,
      [question.field]: answer,
    });
    return projection.status === "ready" && projection.input
      ? { status: "ready", recommendation, projection, fieldErrors: {} }
      : invalidProjection(recommendation, projection);
  }

  return invalidSubmission(
    recommendation,
    "recommendationAction",
    "This claim requires manual review before a canonical decision can be recorded.",
  );
}

function manualRecommendation(
  projection: EvidenceReviewIntentProjection,
  numericClassification: EvidenceReviewNumericClassification,
  reasons: string[],
  ambiguities: string[],
  recommendedIntent?: EvidenceReviewSimpleIntent,
): EvidenceReviewRecommendation {
  return {
    ...(recommendedIntent ? { recommendedIntent } : {}),
    interactionLevel: "manual",
    recommendationConfidence: "low",
    recommendationReasons: orderedUnique(reasons.filter(Boolean)),
    requiredHumanQuestions: [],
    blockingAmbiguities: orderedUnique(ambiguities.filter(Boolean)),
    projectedCanonicalOutcome: projection.preview,
    canSubmitWithOneClick: false,
    canAutoSubmitAfterAnswer: false,
    numericClassification,
  };
}

function recommendationQuestion(
  question: EvidenceReviewIntentQuestion,
): EvidenceReviewQuestion | undefined {
  if (question === "workContext") {
    return {
      id: question,
      field: "workContext",
      prompt: "Which context does this claim describe?",
      context: "Confirm the boundary shown by the evidence.",
      options: [
        { value: "project", label: "Project" },
        { value: "employment", label: "Employment" },
        { value: "skill", label: "Skill" },
        { value: "education", label: "Education" },
        { value: "certification", label: "Certification" },
        { value: "other", label: "Other" },
      ],
    };
  }
  if (question === "claimNature") {
    return {
      id: question,
      field: "claimNature",
      prompt: "What kind of claim does the evidence support?",
      context: "Confirm the factual nature without strengthening the wording.",
      options: [
        { value: "capability", label: "Capability" },
        { value: "responsibility", label: "Responsibility" },
        { value: "achievement", label: "Achievement" },
        { value: "credential", label: "Credential" },
        { value: "other", label: "Other" },
      ],
    };
  }
  return undefined;
}

function numericReason(classification: EvidenceReviewNumericClassification): string {
  if (classification.category === "none") return "Non-metric claim";
  if (classification.category === "career-duration") {
    return "Career duration is supported wording, not a performance metric";
  }
  if (classification.category === "date-range") {
    return "Date wording is not a performance metric";
  }
  return classification.reason;
}

function numericManualReason(classification: EvidenceReviewNumericClassification): string {
  if (classification.requiresMetricVerification) {
    return "Exact business or performance metric verification is required";
  }
  return `Numeric ${classification.category} scope requires manual confirmation`;
}

function questionAmbiguity(question: EvidenceReviewIntentQuestion): string {
  const labels: Record<EvidenceReviewIntentQuestion, string> = {
    correctedClaim: "Corrected claim wording is required",
    requiredQualifiers: "A required qualifier is missing",
    rejectionReason: "A rejection reason is required",
    workContext: "Work context is ambiguous",
    claimNature: "Claim nature is ambiguous",
    metricExactText: "Exact metric wording needs verification",
    metricUnit: "Metric unit needs verification",
    metricScope: "Metric scope needs verification",
    metricSourceConfirmed: "Metric source support needs verification",
  };
  return labels[question];
}

function plainFieldErrors(projection: EvidenceReviewIntentProjection): string[] {
  return Object.values(projection.fieldErrors).flat();
}

function invalidProjection(
  recommendation: EvidenceReviewRecommendation,
  projection: EvidenceReviewIntentProjection,
): EvidenceReviewRecommendationSubmission {
  return {
    status: "invalid",
    recommendation,
    projection,
    fieldErrors: Object.keys(projection.fieldErrors).length > 0
      ? projection.fieldErrors
      : { recommendationAction: ["The recommendation no longer resolves to a valid canonical review."] },
  };
}

function invalidSubmission(
  recommendation: EvidenceReviewRecommendation,
  field: string,
  message: string,
): EvidenceReviewRecommendationSubmission {
  return {
    status: "invalid",
    recommendation,
    fieldErrors: { [field]: [message] },
  };
}

function textMatches(left: string, right: string): boolean {
  return normalizeText(left) === normalizeText(right);
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}

function orderedUnique(values: string[]): string[] {
  return [...new Set(values)];
}
