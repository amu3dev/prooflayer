import type { EvidenceReviewSimpleIntent } from "./evidence-review-intent.js";
import { type EvidenceReviewIntentPreview, type EvidenceReviewIntentProjection, type EvidenceReviewIntentQuestion } from "./evidence-review-intent.js";
import { type EvidenceReviewNumericClassification } from "./evidence-review-numeric.js";
import type { EvidenceReviewUiClaim } from "./evidence-review-ui.js";
export declare const EVIDENCE_REVIEW_INTERACTION_LEVELS: readonly ["one-click", "one-question", "manual"];
export type EvidenceReviewInteractionLevel = typeof EVIDENCE_REVIEW_INTERACTION_LEVELS[number];
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
export declare function deriveEvidenceReviewRecommendation(claim: EvidenceReviewUiClaim): EvidenceReviewRecommendation;
export declare function projectEvidenceReviewRecommendationSubmission(claim: EvidenceReviewUiClaim, fields: Record<string, string | undefined>): EvidenceReviewRecommendationSubmission;
