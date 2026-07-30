import { describe, expect, it } from "vitest";
import { classifyEvidenceReviewNumericClaim, isEvidenceReviewMetricCandidate, } from "../evidence-review-numeric.js";
describe("Evidence Review numeric classification", () => {
    it.each([
        ["20+ years of product and technology experience.", "career-duration", false],
        ["Launched the prototype in 2024.", "date-range", false],
        ["Led a team of 8 engineers.", "count", false],
        ["Supported 12 countries.", "scale", false],
        ["Improved conversion by 27%.", "performance-metric", true],
        ["Generated $250,000 in revenue.", "business-outcome", true],
    ])("classifies %s as %s", (text, category, requiresMetricVerification) => {
        const result = classifyEvidenceReviewNumericClaim(text);
        expect(result.category).toBe(category);
        expect(result.requiresMetricVerification).toBe(requiresMetricVerification);
    });
    it("does not turn career duration, dates, counts, or scale into metric verification", () => {
        expect(isEvidenceReviewMetricCandidate("20+ years of experience.", "structural_metric"))
            .toBe(false);
        expect(isEvidenceReviewMetricCandidate("Launched in 2024.", "needs_metric")).toBe(false);
        expect(isEvidenceReviewMetricCandidate("Led a team of 8.", "needs_metric")).toBe(false);
        expect(isEvidenceReviewMetricCandidate("Supported 12 countries.", "needs_metric")).toBe(false);
    });
    it("preserves source number text without calculating or normalizing values", () => {
        expect(classifyEvidenceReviewNumericClaim("Improved conversion by 27%.").sourceNumbers)
            .toEqual(["27%"]);
        expect(classifyEvidenceReviewNumericClaim("20+ years of experience.").sourceNumbers)
            .toEqual(["20+"]);
    });
});
