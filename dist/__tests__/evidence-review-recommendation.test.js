import { describe, expect, it } from "vitest";
import { EvidenceClaimReviewInputSchema } from "../evidence-claim-review-schemas.js";
import { deriveEvidenceReviewRecommendation, projectEvidenceReviewRecommendationSubmission, } from "../evidence-review-recommendation.js";
import { loadEvidenceReviewUiClaim, } from "../evidence-review-ui.js";
import { createEvidenceReviewUiFixture } from "./evidence-review-ui-fixture.js";
describe("Evidence Review recommendation engine", () => {
    it("returns a deterministic Level 1 approval without changing canonical truth", async () => {
        const claim = await fixtureClaim();
        const before = structuredClone(claim);
        const first = deriveEvidenceReviewRecommendation(claim);
        const second = deriveEvidenceReviewRecommendation(claim);
        const submission = projectEvidenceReviewRecommendationSubmission(claim, {
            recommendationAction: "confirm",
        });
        expect(first).toEqual(second);
        expect(first).toMatchObject({
            recommendedIntent: "approve",
            interactionLevel: "one-click",
            recommendationConfidence: "high",
            canSubmitWithOneClick: true,
            canAutoSubmitAfterAnswer: false,
            projectedCanonicalOutcome: {
                decision: "approved",
                publicSafety: "public-safe",
                resumeReadiness: "resume-ready",
            },
        });
        expect(first.recommendationReasons).toEqual([
            "Supported by the displayed evidence",
            "Public-safe according to reviewed metadata",
            "Non-metric claim",
            "Project or employment boundary is clear",
            "Claim classification is clear",
            "No unresolved qualifier",
            "No critical warning",
        ]);
        expect(submission.status).toBe("ready");
        expect(EvidenceClaimReviewInputSchema.safeParse(submission.projection?.input).success)
            .toBe(true);
        expect(claim).toEqual(before);
    });
    it("never recommends one-click approval for private evidence", async () => {
        const fixture = await createEvidenceReviewUiFixture({ visibility: "private" });
        const { claim } = await loadEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_3");
        const recommendation = deriveEvidenceReviewRecommendation(claim);
        expect(recommendation.interactionLevel).toBe("manual");
        expect(recommendation.canSubmitWithOneClick).toBe(false);
        expect(recommendation.blockingAmbiguities.join(" ")).toMatch(/private|sensitive/i);
    });
    it("uses Level 2 only when exactly one safe classification question remains", async () => {
        const claim = await fixtureClaim();
        const ambiguous = withAmbiguousWorkContext(claim);
        const recommendation = deriveEvidenceReviewRecommendation(ambiguous);
        expect(recommendation).toMatchObject({
            recommendedIntent: "approve",
            interactionLevel: "one-question",
            canSubmitWithOneClick: false,
            canAutoSubmitAfterAnswer: true,
            requiredHumanQuestions: [{ id: "workContext", field: "workContext" }],
        });
        const answered = projectEvidenceReviewRecommendationSubmission(ambiguous, {
            recommendationQuestionId: "workContext",
            recommendationAnswer: "project",
        });
        expect(answered.status).toBe("ready");
        expect(answered.projection?.input?.classification.workContext).toBe("project");
    });
    it("keeps multiple ambiguities in Level 3", async () => {
        const claim = await fixtureClaim();
        const ambiguous = {
            ...withAmbiguousWorkContext(claim),
            sourceClassification: { type: "unknown_claim", section: "Other evidence" },
        };
        const recommendation = deriveEvidenceReviewRecommendation(ambiguous);
        expect(recommendation.interactionLevel).toBe("manual");
        expect(recommendation.blockingAmbiguities).toEqual([
            "Claim nature is ambiguous",
            "Work context is ambiguous",
        ]);
    });
    it("keeps corrected wording, true metrics, and existing reviews in Level 3", async () => {
        const claim = await fixtureClaim();
        const unsafe = deriveEvidenceReviewRecommendation({
            ...claim,
            sourceUnsafeWording: ["ownership"],
        });
        const metric = deriveEvidenceReviewRecommendation({
            ...claim,
            text: "Improved conversion by 27%.",
            evidence: claim.evidence.map((entry) => ({
                ...entry,
                summary: "Improved conversion by 27%.",
                sourceExcerpt: "Improved conversion by 27%.",
            })),
        });
        const reviewed = deriveEvidenceReviewRecommendation({
            ...claim,
            review: {
                ...claim.review,
                lifecycle: "current",
                id: "evidence-claim-review_existing",
            },
        });
        expect(unsafe).toMatchObject({
            interactionLevel: "manual",
            recommendedIntent: "approve-with-edit",
        });
        expect(metric.interactionLevel).toBe("manual");
        expect(metric.numericClassification.category).toBe("performance-metric");
        expect(reviewed.interactionLevel).toBe("manual");
        expect(reviewed.blockingAmbiguities.join(" ")).toMatch(/supersession/i);
    });
    it("keeps a clear conservative reject case in manual review", async () => {
        const fixture = await createEvidenceReviewUiFixture({ visibility: "private" });
        const { claim } = await loadEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_3");
        const recommendation = deriveEvidenceReviewRecommendation({
            ...claim,
            sourceUnsafeWording: ["private customer name"],
        });
        expect(recommendation.interactionLevel).toBe("manual");
        expect(recommendation.canSubmitWithOneClick).toBe(false);
    });
});
async function fixtureClaim() {
    const fixture = await createEvidenceReviewUiFixture();
    return (await loadEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_3")).claim;
}
function withAmbiguousWorkContext(claim) {
    return {
        ...claim,
        sourceClassification: { type: "project_claim", section: "Other evidence" },
        evidence: claim.evidence.map((entry) => ({
            ...entry,
            category: "recommendation",
            parentProjectId: undefined,
            parentRoleId: undefined,
        })),
    };
}
