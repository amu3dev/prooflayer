export const EVIDENCE_REVIEW_NUMERIC_CATEGORIES = [
    "none",
    "career-duration",
    "date-range",
    "count",
    "scale",
    "business-outcome",
    "performance-metric",
    "other-number",
];
const NUMBER_PATTERN = /(?<![A-Za-z])(?:[$£€]\s*)?\d[\d,.]*(?:\+)?(?:\s*%)?/g;
const CAREER_DURATION_PATTERN = /\b\d[\d,.]*\+?\s*(?:years?|yrs?)\b/i;
const DATE_PATTERN = /\b(?:19|20)\d{2}\b/g;
const PERFORMANCE_PATTERN = /\b(?:improv(?:e|ed|ement)|increase[ds]?|grow(?:th|n)?|reduce[ds]?|decrease[ds]?|convert(?:ed|s|ing)?|conversion|retention|adoption|performance|efficien(?:cy|t)|savings?|saved|revenue|profit|margin|costs?|sales)\b/i;
const BUSINESS_OUTCOME_PATTERN = /(?:[$£€]\s*\d)|(?:\b\d[\d,.]*\s*(?:usd|gbp|eur|dollars?|pounds?|euros?)\b)|\b(?:revenue|profit|margin|sales|cost savings?)\b/i;
const COUNT_PATTERN = /\bteam of\s+\d[\d,.]*\+?\b|\b\d[\d,.]*\+?\s+(?:people|employees?|engineers?|reports?|members?|contributors?)\b/i;
const SCALE_PATTERN = /\b\d[\d,.]*\+?\s+(?:users?|customers?|clients?|countries|markets?|regions?|sites?|locations?|products?|projects?|platforms?|applications?|services?|messages?|requests?|transactions?)\b/i;
export function classifyEvidenceReviewNumericClaim(text) {
    const sourceNumbers = text.match(NUMBER_PATTERN) ?? [];
    if (sourceNumbers.length === 0) {
        return {
            category: "none",
            sourceNumbers: [],
            reason: "No numeric wording is present.",
            requiresMetricVerification: false,
        };
    }
    if (/%|\bpercent(?:age)?\b/i.test(text)) {
        return {
            category: "performance-metric",
            sourceNumbers,
            reason: "Percentage wording requires exact performance-metric verification.",
            requiresMetricVerification: true,
        };
    }
    if (CAREER_DURATION_PATTERN.test(text)) {
        return {
            category: "career-duration",
            sourceNumbers,
            reason: "The numeric wording describes career duration, not a business or performance outcome.",
            requiresMetricVerification: false,
        };
    }
    if (BUSINESS_OUTCOME_PATTERN.test(text)) {
        return {
            category: "business-outcome",
            sourceNumbers,
            reason: "The number is tied to a business outcome and requires exact metric verification.",
            requiresMetricVerification: true,
        };
    }
    if (PERFORMANCE_PATTERN.test(text)) {
        return {
            category: "performance-metric",
            sourceNumbers,
            reason: "The number is tied to a performance outcome and requires exact metric verification.",
            requiresMetricVerification: true,
        };
    }
    if (COUNT_PATTERN.test(text)) {
        return {
            category: "count",
            sourceNumbers,
            reason: "The wording contains an exact people or team count that needs manual scope review.",
            requiresMetricVerification: false,
        };
    }
    if (SCALE_PATTERN.test(text)) {
        return {
            category: "scale",
            sourceNumbers,
            reason: "The wording contains an exact scale claim that needs manual scope review.",
            requiresMetricVerification: false,
        };
    }
    const yearTokens = text.match(DATE_PATTERN) ?? [];
    if (yearTokens.length > 0 && yearTokens.length === sourceNumbers.length) {
        return {
            category: "date-range",
            sourceNumbers,
            reason: "The numeric wording is a calendar year or date range, not a performance metric.",
            requiresMetricVerification: false,
        };
    }
    return {
        category: "other-number",
        sourceNumbers,
        reason: "The numeric wording is not safely classifiable and requires manual review.",
        requiresMetricVerification: false,
    };
}
export function isEvidenceReviewMetricCandidate(text, sourceMetricStatus) {
    const classification = classifyEvidenceReviewNumericClaim(text);
    if (classification.requiresMetricVerification)
        return true;
    if (classification.category === "career-duration" ||
        classification.category === "date-range" ||
        classification.category === "count" ||
        classification.category === "scale" ||
        classification.category === "other-number") {
        return false;
    }
    return sourceMetricStatus === "verified_metric" || sourceMetricStatus === "needs_metric";
}
