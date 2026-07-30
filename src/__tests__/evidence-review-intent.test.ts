import { describe, expect, it } from "vitest";
import { EvidenceClaimReviewInputSchema } from "../evidence-claim-review-schemas.js";
import {
  projectEvidenceReviewIntent,
  type EvidenceReviewIntentProjection,
} from "../evidence-review-intent.js";
import {
  EvidenceReviewUiSubmissionError,
  loadEvidenceReviewUiClaim,
  submitEvidenceReviewUiClaim,
  type EvidenceReviewUiClaim,
} from "../evidence-review-ui.js";
import { hashText } from "../fs-utils.js";
import { createEvidenceReviewUiFixture } from "./evidence-review-ui-fixture.js";

describe("simple Evidence Review intent projection", () => {
  it("projects a clear approval into a complete canonical review input", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    const { claim } = await loadEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_3",
    );

    const projection = projectEvidenceReviewIntent(claim, { intent: "approve" });

    expect(projection.status).toBe("ready");
    expect(EvidenceClaimReviewInputSchema.safeParse(projection.input).success).toBe(true);
    expect(projection.input).toMatchObject({
      decision: "approved",
      factualSupport: "supported",
      scope: "exact",
      publicSafety: "public-safe",
      resumeReadiness: "resume-ready",
      eligibleForRoleMatching: true,
      eligibleForJobMapping: true,
      metricReview: { state: "not-a-metric" },
      classification: { workContext: "project", claimNature: "capability" },
    });

    const created = await submitEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      claim.id,
      { reviewMode: "simple", intent: "approve" },
    );
    expect(created.result).toMatchObject({ result: "created", decision: "approved" });
  });

  it("refuses simple approval for private evidence without inventing public safety", async () => {
    const fixture = await createEvidenceReviewUiFixture({ visibility: "private" });
    const { claim } = await loadEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_3",
    );

    const projection = projectEvidenceReviewIntent(claim, { intent: "approve" });

    expect(projection.status).toBe("blocked");
    expect(projection.preview).toMatchObject({
      publicSafety: "private",
      resumeReadiness: "not-resume-ready",
      eligibleForRoleMatching: false,
      eligibleForJobMapping: false,
    });
    expect(projection.fieldErrors.intent?.join(" ")).toMatch(/private|sensitive/i);
    await expect(submitEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      claim.id,
      { reviewMode: "simple", intent: "approve" },
    )).rejects.toBeInstanceOf(EvidenceReviewUiSubmissionError);
  });

  it("asks only for ambiguous classifications and accepts explicit safe answers", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    const loaded = await loadEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_3",
    );
    const ambiguous = ambiguousClaim(loaded.claim);

    const incomplete = projectEvidenceReviewIntent(ambiguous, { intent: "approve" });
    expect(incomplete.status).toBe("needs-input");
    expect(incomplete.questions).toEqual(["claimNature", "workContext"]);

    const answered = projectEvidenceReviewIntent(ambiguous, {
      intent: "approve",
      workContext: "other",
      claimNature: "other",
    });
    expect(answered.status).toBe("ready");
    expect(answered.input?.classification).toEqual({
      workContext: "other",
      claimNature: "other",
    });
  });

  it("blocks approval as written when source wording is flagged but allows validated narrowing", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    const { claim } = await loadEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_1",
    );
    const flagged = { ...claim, sourceUnsafeWording: ["ownership"] };

    const approve = projectEvidenceReviewIntent(flagged, { intent: "approve" });
    expect(approve.status).toBe("blocked");
    expect(approve.fieldErrors.intent?.join(" ")).toMatch(/wording.*review/i);

    const edited = projectEvidenceReviewIntent(flagged, {
      intent: "approve-with-edit",
      correctedClaim: "Supported AI product workflows.",
      requiredQualifiers: "Engineering collaboration is excluded.",
    });
    expect(edited.status).toBe("ready");
    expect(edited.input?.decision).toBe("approved-with-qualifier");
  });

  it("requires narrowed wording and a qualifier for Edit and Approve", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    const { claim } = await loadEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_1",
    );

    const incomplete = projectEvidenceReviewIntent(claim, { intent: "approve-with-edit" });
    expect(incomplete.status).toBe("needs-input");
    expect(incomplete.fieldErrors).toMatchObject({
      correctedClaim: [expect.stringMatching(/narrower wording/i)],
      requiredQualifiers: [expect.stringMatching(/qualifier/i)],
    });

    const result = await submitEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      claim.id,
      {
        reviewMode: "simple",
        intent: "approve-with-edit",
        correctedClaim: "Supported AI product workflows.",
        requiredQualifiers: "Engineering collaboration is excluded.",
      },
    );
    expect(result.result.decision).toBe("approved-with-qualifier");
  });

  it("keeps canonical corrected-claim validation authoritative", async () => {
    const fixture = await createEvidenceReviewUiFixture();

    await expect(submitEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_1",
      {
        reviewMode: "simple",
        intent: "approve-with-edit",
        correctedClaim: "Owned global AI revenue and managed 200 people.",
        requiredQualifiers: "Synthetic qualifier.",
      },
    )).rejects.toThrow(/unsupported/i);
  });

  it("derives conservative rejection, insufficient-proof, and deferred states", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    const { claim } = await loadEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_3",
    );

    const rejected = ready(projectEvidenceReviewIntent(claim, {
      intent: "reject",
      rejectionReason: "overstated",
    }));
    expect(rejected.input).toMatchObject({
      decision: "rejected",
      factualSupport: "partially-supported",
      scope: "overstated",
      resumeReadiness: "not-resume-ready",
      eligibleForRoleMatching: false,
      eligibleForJobMapping: false,
    });

    const insufficient = ready(projectEvidenceReviewIntent(claim, {
      intent: "insufficient-proof",
    }));
    expect(insufficient.input).toMatchObject({
      decision: "insufficient-proof",
      factualSupport: "indeterminate",
      publicSafety: "indeterminate",
      resumeReadiness: "not-resume-ready",
      eligibleForRoleMatching: false,
      eligibleForJobMapping: false,
    });

    const deferred = ready(projectEvidenceReviewIntent(claim, { intent: "defer" }));
    expect(deferred.input).toMatchObject({
      decision: "deferred",
      publicSafety: "indeterminate",
      resumeReadiness: "indeterminate",
      metricReview: { state: "not-a-metric" },
      eligibleForRoleMatching: false,
      eligibleForJobMapping: false,
    });
  });

  it("requires exact source confirmation for a metric and never calculates it", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    const loaded = await loadEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_3",
    );
    const metricClaim: EvidenceReviewUiClaim = {
      ...loaded.claim,
      text: "Improved adoption by 25% in the reviewed pilot.",
      potentialMetric: true,
      sourceMetricStatus: "needs_metric",
      template: {
        ...loaded.claim.template,
        reviewedClaimSha256: hashText("Improved adoption by 25% in the reviewed pilot."),
      },
      evidence: loaded.claim.evidence.map((evidence) => ({
        ...evidence,
        summary: "Improved adoption by 25% in the reviewed pilot.",
        sourceExcerpt: "Improved adoption by 25% in the reviewed pilot.",
      })),
    };

    const incomplete = projectEvidenceReviewIntent(metricClaim, { intent: "approve" });
    expect(incomplete.status).toBe("needs-input");
    expect(incomplete.questions).toEqual([
      "metricExactText",
      "metricScope",
      "metricSourceConfirmed",
      "metricUnit",
    ]);
    expect(incomplete.preview.metricState).toBe("verified");

    const confirmed = ready(projectEvidenceReviewIntent(metricClaim, {
      intent: "approve",
      metricExactText: metricClaim.text,
      metricUnit: "%",
      metricScope: "reviewed pilot adoption",
      metricSourceConfirmed: "true",
    }));
    expect(confirmed.input.metricReview).toEqual({
      state: "verified",
      exactText: metricClaim.text,
      unit: "%",
      scope: "reviewed pilot adoption",
      qualifiers: [],
    });
  });
});

function ready(projection: EvidenceReviewIntentProjection): Required<Pick<
  EvidenceReviewIntentProjection,
  "input"
>> & EvidenceReviewIntentProjection {
  expect(projection.status).toBe("ready");
  expect(projection.input).toBeDefined();
  return projection as Required<Pick<EvidenceReviewIntentProjection, "input">> &
    EvidenceReviewIntentProjection;
}

function ambiguousClaim(claim: EvidenceReviewUiClaim): EvidenceReviewUiClaim {
  return {
    ...claim,
    sourceClassification: { type: "unknown_claim" },
    evidence: claim.evidence.map((evidence) => ({
      ...evidence,
      category: "recommendation",
      parentRoleId: undefined,
      parentProjectId: undefined,
    })),
  };
}
