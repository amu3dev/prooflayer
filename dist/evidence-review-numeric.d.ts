export declare const EVIDENCE_REVIEW_NUMERIC_CATEGORIES: readonly ["none", "career-duration", "date-range", "count", "scale", "business-outcome", "performance-metric", "other-number"];
export type EvidenceReviewNumericCategory = typeof EVIDENCE_REVIEW_NUMERIC_CATEGORIES[number];
export interface EvidenceReviewNumericClassification {
    category: EvidenceReviewNumericCategory;
    sourceNumbers: string[];
    reason: string;
    requiresMetricVerification: boolean;
}
export declare function classifyEvidenceReviewNumericClaim(text: string): EvidenceReviewNumericClassification;
export declare function isEvidenceReviewMetricCandidate(text: string, sourceMetricStatus: string): boolean;
