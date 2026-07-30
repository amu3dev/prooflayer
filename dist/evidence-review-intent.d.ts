import type { EvidenceClaimReviewInput } from "./evidence-claim-review-schemas.js";
import type { EvidenceReviewUiClaim } from "./evidence-review-ui.js";
export declare const EVIDENCE_REVIEW_SIMPLE_INTENTS: readonly ["approve", "approve-with-edit", "reject", "insufficient-proof", "defer"];
export type EvidenceReviewSimpleIntent = typeof EVIDENCE_REVIEW_SIMPLE_INTENTS[number];
export declare const evidenceReviewSimpleIntentOptions: ReadonlyArray<{
    value: EvidenceReviewSimpleIntent;
    label: string;
    description: string;
}>;
export declare const evidenceReviewRejectionReasons: readonly [readonly ["unsupported", "Unsupported by the evidence"], readonly ["overstated", "Overstated"], readonly ["incorrect", "Incorrect"], readonly ["private-restricted", "Private or restricted"], readonly ["wrong-scope", "Wrong scope"], readonly ["duplicate", "Duplicate"], readonly ["other", "Other"]];
export type EvidenceReviewRejectionReason = typeof evidenceReviewRejectionReasons[number][0];
export type EvidenceReviewIntentQuestion = "correctedClaim" | "requiredQualifiers" | "rejectionReason" | "workContext" | "claimNature" | "metricExactText" | "metricUnit" | "metricScope" | "metricSourceConfirmed";
export interface EvidenceReviewIntentPreview {
    decision: string;
    finalClaimWording: string;
    publicSafety: string;
    resumeReadiness: string;
    eligibleForRoleMatching: boolean;
    eligibleForJobMapping: boolean;
    metricState: string;
    qualifiers: string[];
    warnings: string[];
}
export interface EvidenceReviewIntentProjection {
    status: "ready" | "needs-input" | "blocked";
    input?: EvidenceClaimReviewInput;
    fieldErrors: Record<string, string[]>;
    questions: EvidenceReviewIntentQuestion[];
    preview: EvidenceReviewIntentPreview;
}
export declare function projectEvidenceReviewIntent(claim: EvidenceReviewUiClaim, fields: Record<string, string | undefined>): EvidenceReviewIntentProjection;
