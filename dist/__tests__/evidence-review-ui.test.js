import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { EvidenceReviewUiSubmissionError, evidenceReviewUiFormOptions, loadEvidenceReviewUiBatch, loadEvidenceReviewUiClaim, submitEvidenceReviewUiClaim, } from "../evidence-review-ui.js";
import { listEvidenceClaimReviews } from "../evidence-claim-review.js";
import { pathExists, walkFiles } from "../fs-utils.js";
import { assertLoopbackHost, formatEvidenceReviewUiLaunch, prepareEvidenceReviewUiLaunch, } from "../evidence-review-ui-server.js";
import { createEvidenceReviewUiFixture, validApprovedFields, } from "./evidence-review-ui-fixture.js";
describe("Local Evidence Review UI domain adapter", () => {
    it("builds a self-contained human view from one current locked batch", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        const batch = await loadEvidenceReviewUiBatch(fixture.workspace, fixture.batchId);
        expect(batch.target).toMatchObject({
            title: "Product Owner - Conversational AI and Agents",
            company: "Natterbox",
            workingModel: "hybrid",
        });
        expect(batch.stage).toBe("Evidence Review");
        expect(batch.progress).toMatchObject({ selected: 4, reviewed: 0, pending: 4 });
        expect(batch.claims).toHaveLength(4);
        expect(batch.claims.every(({ title, text, selectionReason }) => title.length > 0 && text.length > 0 && selectionReason.length > 0)).toBe(true);
        expect(batch.claims.some(({ requirements }) => requirements.length > 0)).toBe(true);
        expect(JSON.stringify(batch)).not.toContain("/Users/synthetic-private/");
        expect(JSON.stringify(batch)).not.toContain("reviewerRationale");
        expect(batch.claims[0].text).toBeTruthy();
        expect(batch.claims[0].id).toMatch(/^claim_/);
    });
    it("uses the canonical schema enums without UI-only controlled values", () => {
        expect(evidenceReviewUiFormOptions.decisions).toEqual([
            "approved",
            "approved-with-qualifier",
            "needs-edit",
            "rejected",
            "insufficient-proof",
            "deferred",
        ]);
        expect(evidenceReviewUiFormOptions.publicSafety).toContain("public-safe");
        expect(evidenceReviewUiFormOptions.workContexts).toContain("project");
    });
    it("creates, deduplicates, and explicitly supersedes canonical reviews", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        const claimId = "claim_review_ui_3";
        const beforeClaim = await readFile(path.join(fixture.workspace, "kb/claims.json"));
        const beforeEvidence = await readFile(path.join(fixture.workspace, "kb/evidence-items.json"));
        const fields = validApprovedFields();
        const first = await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, claimId, fields);
        expect(first.result).toMatchObject({ result: "created", decision: "approved" });
        const duplicate = await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, claimId, fields);
        expect(duplicate.result).toMatchObject({
            result: "already-current",
            reviewId: first.result.reviewId,
        });
        await expect(submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, claimId, { ...fields, reviewerRationale: "A changed rationale creates a new immutable review." })).rejects.toThrow(/explicitly set supersedesReviewId/);
        const superseding = await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, claimId, {
            ...fields,
            reviewerRationale: "A changed rationale creates a new immutable review.",
            confirmSupersession: "true",
        });
        expect(superseding.result.reviewId).not.toBe(first.result.reviewId);
        expect(await readFile(path.join(fixture.workspace, "kb/claims.json"))).toEqual(beforeClaim);
        expect(await readFile(path.join(fixture.workspace, "kb/evidence-items.json"))).toEqual(beforeEvidence);
    });
    it("supports qualified and rejected decisions while refusing invalid eligibility and metrics", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        const qualified = await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_1", validApprovedFields({
            decision: "approved-with-qualifier",
            correctedClaim: "Supported AI product workflows.",
            requiredQualifiers: "Engineering collaboration is excluded.",
            factualSupport: "partially-supported",
            scope: "qualified",
            workContext: "employment",
        }));
        expect(qualified.result.decision).toBe("approved-with-qualifier");
        const rejected = await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_2", rejectedFields("employment", "responsibility"));
        expect(rejected.result.decision).toBe("rejected");
        await expect(submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_4", rejectedFields("education", "credential", {
            eligibleForJobMapping: "true",
        }))).rejects.toBeInstanceOf(EvidenceReviewUiSubmissionError);
        await expect(submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_4", validApprovedFields({
            workContext: "education",
            claimNature: "credential",
            metricState: "verified",
        }))).rejects.toThrow(/metric/i);
    });
    it("keeps private evidence ineligible and withholds its exact excerpt", async () => {
        const fixture = await createEvidenceReviewUiFixture({ visibility: "private" });
        const { claim } = await loadEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_3");
        expect(claim.evidence[0]).toMatchObject({ excerptWithheld: true });
        expect(claim.evidence[0]).not.toHaveProperty("sourceExcerpt");
        await expect(submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, claim.id, validApprovedFields())).rejects.toThrow(/Private|public-safe/);
    });
    it("makes zero writes in read-only mode and rejects unknown or cross-batch identifiers", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        const before = await walkFiles(fixture.workspace);
        await expect(submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_3", validApprovedFields(), { readOnly: true })).rejects.toThrow(/read-only/);
        expect(await walkFiles(fixture.workspace)).toEqual(before);
        expect((await listEvidenceClaimReviews(fixture.workspace)).every(({ status }) => status === "missing")).toBe(true);
        await expect(loadEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_outside_batch")).rejects.toThrow(/does not belong/);
        await expect(loadEvidenceReviewUiBatch(fixture.workspace, "../evidence-review-batch_escape")).rejects.toThrow(/Invalid evidence review batch ID/);
    });
    it("updates progress and exposes only the explicit guided-workflow next command", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_1", validApprovedFields({ workContext: "employment" }));
        await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_2", rejectedFields("employment", "responsibility"));
        await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_3", validApprovedFields());
        const final = await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_4", rejectedFields("education", "credential", { decision: "deferred" }));
        const batch = await loadEvidenceReviewUiBatch(fixture.workspace, fixture.batchId);
        expect(final.batchComplete).toBe(true);
        expect(batch).toMatchObject({
            complete: true,
            progress: {
                selected: 4,
                reviewed: 4,
                pending: 0,
            },
            nextCommand: `prooflayer job continue ${fixture.targetId}`,
        });
        expect(batch.progress.decisions).toMatchObject({
            approved: 2,
            rejected: 1,
            deferred: 1,
        });
        expect(await pathExists(path.join(fixture.workspace, "evidence-snapshots"))).toBe(false);
        expect(await pathExists(path.join(fixture.workspace, "targets/jobs", fixture.targetId, "evidence"))).toBe(false);
    });
});
describe("Local Evidence Review UI launcher", () => {
    it("prepares a local-only human-readable launch without altering canonical inputs", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        const before = await readFile(path.join(fixture.workspace, "kb/claims.json"));
        const prepared = await prepareEvidenceReviewUiLaunch({
            workspace: fixture.workspace,
            batchId: fixture.batchId,
            readOnly: true,
        }, {
            findPort: async () => 4567,
        });
        const output = formatEvidenceReviewUiLaunch(prepared);
        expect(prepared).toMatchObject({
            host: "127.0.0.1",
            port: 4567,
            readOnly: true,
        });
        expect(prepared.url).toBe(`http://127.0.0.1:4567/review/${fixture.batchId}`);
        expect(output).toContain("Product Owner - Conversational AI and Agents");
        expect(output).toContain("Natterbox");
        expect(output).toContain("4 selected");
        expect(output).toContain("The server is local-only.");
        expect(await readFile(path.join(fixture.workspace, "kb/claims.json"))).toEqual(before);
    });
    it("rejects missing batches, unsafe hosts, and invalid ports", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        expect(() => assertLoopbackHost("0.0.0.0")).toThrow(/Unsafe UI host/);
        await expect(prepareEvidenceReviewUiLaunch({
            workspace: fixture.workspace,
            batchId: "evidence-review-batch_00000000000000000000",
        })).rejects.toThrow(/must be current/);
        await expect(prepareEvidenceReviewUiLaunch({
            workspace: fixture.workspace,
            batchId: fixture.batchId,
            port: 70_000,
        })).rejects.toThrow(/between 1 and 65535/);
    });
});
function rejectedFields(workContext, claimNature, overrides = {}) {
    return {
        decision: "rejected",
        reviewerRationale: "The source does not provide sufficient public and resume-ready support.",
        factualSupport: "unsupported",
        scope: "ambiguous",
        publicSafety: "indeterminate",
        resumeReadiness: "not-resume-ready",
        eligibleForRoleMatching: "false",
        eligibleForJobMapping: "false",
        metricState: "not-a-metric",
        workContext,
        claimNature,
        ...overrides,
    };
}
