import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { findAvailableLoopbackPort } from "../evidence-review-ui-server.js";
import { listEvidenceClaimReviews } from "../evidence-claim-review.js";
import { submitEvidenceReviewUiClaim } from "../evidence-review-ui.js";
import { createEvidenceReviewUiFixture, validApprovedFields, } from "./evidence-review-ui-fixture.js";
const children = [];
afterEach(async () => {
    for (const child of children.splice(0)) {
        if (child.exitCode === null)
            child.kill("SIGTERM");
    }
});
describe("Astro Local Evidence Review UI routes", () => {
    it("renders a locked human-first dashboard and self-contained claim pages safely", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        const server = await startUiServer(fixture.workspace, fixture.batchId, true);
        const dashboard = await fetch(`${server.origin}/review/${fixture.batchId}`);
        const dashboardHtml = await dashboard.text();
        expect(dashboard.status).toBe(200);
        expect(dashboard.headers.get("set-cookie")).toBeNull();
        expect(dashboardHtml).toContain("Product Owner - Conversational AI and Agents");
        expect(dashboardHtml).toContain("Natterbox");
        expect(dashboardHtml).toContain("<strong>4</strong> pending");
        expect(dashboardHtml).toContain("High priority");
        expect(dashboardHtml).toContain("Medium priority");
        expect(dashboardHtml).toContain("Low priority");
        expect(dashboardHtml).toContain("Supported platform extensibility");
        expect(dashboardHtml).toContain("&lt;script&gt;");
        expect(dashboardHtml).not.toContain("<script>alert");
        expect(dashboardHtml).not.toContain("/Users/synthetic-private/");
        expect(dashboardHtml).not.toContain(process.env.HOME ?? "__missing_home__");
        expect(dashboardHtml).not.toMatch(/https?:\/\/(?!127\.0\.0\.1)/);
        const claimResponse = await fetch(`${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_3`);
        const claimHtml = await claimResponse.text();
        expect(claimResponse.status).toBe(200);
        expect(claimHtml).toContain("Claim being reviewed");
        expect(claimHtml).toContain("Supporting evidence");
        expect(claimHtml).toContain("Exact source excerpt");
        expect(claimHtml).toContain("Matching Job requirements");
        expect(claimHtml).toContain("Current classification and eligibility");
        expect(claimHtml).toContain("Internal references and provenance");
        expect(claimHtml).toContain("Submission is disabled in read-only mode");
        expect(claimHtml).not.toContain("<form");
        expect(claimHtml).not.toContain("/Users/synthetic-private/");
        const readOnlyPost = await fetch(`${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_3`, {
            method: "POST",
            redirect: "manual",
            headers: {
                origin: server.origin,
                "content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ csrfToken: server.csrfToken }),
        });
        expect(readOnlyPost.status).toBe(405);
        expect((await listEvidenceClaimReviews(fixture.workspace)).every(({ status }) => status === "missing")).toBe(true);
        const foreignBatch = await fetch(`${server.origin}/review/evidence-review-batch_00000000000000000000`);
        const unknownClaim = await fetch(`${server.origin}/review/${fixture.batchId}/claim/claim_outside_batch`);
        expect(foreignBatch.status).toBe(404);
        expect(unknownClaim.status).toBe(404);
    }, 20_000);
    it("submits only through the canonical service and renders authoritative validation errors", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        const server = await startUiServer(fixture.workspace, fixture.batchId, false);
        const claimUrl = `${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_3`;
        const invalid = await fetch(claimUrl, {
            method: "POST",
            redirect: "manual",
            headers: {
                origin: server.origin,
                "content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                csrfToken: server.csrfToken,
                decision: "approved-with-qualifier",
            }),
        });
        const invalidHtml = await invalid.text();
        expect(invalid.status).toBe(200);
        expect(invalidHtml).toContain("Review not submitted");
        expect(invalidHtml).toContain("Review validation failed");
        expect(invalidHtml).toContain("field-error");
        expect((await listEvidenceClaimReviews(fixture.workspace)).every(({ status }) => status === "missing")).toBe(true);
        const body = new URLSearchParams({
            csrfToken: server.csrfToken,
            ...stringFields(validApprovedFields()),
        });
        const valid = await fetch(claimUrl, {
            method: "POST",
            redirect: "manual",
            headers: {
                origin: server.origin,
                "content-type": "application/x-www-form-urlencoded",
            },
            body,
        });
        expect(valid.status).toBe(303);
        expect(valid.headers.get("location")).toContain(`/review/${fixture.batchId}/claim/`);
        const reviews = await listEvidenceClaimReviews(fixture.workspace);
        expect(reviews.find(({ claimId }) => claimId === "claim_review_ui_3"))
            .toMatchObject({ status: "current", decision: "approved" });
        await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_1", validApprovedFields({ workContext: "employment" }));
        await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_2", nonEligibleFields("rejected", "employment", "responsibility"));
        await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_4", nonEligibleFields("deferred", "education", "credential"));
        const complete = await fetch(`${server.origin}/review/${fixture.batchId}/complete`);
        const completeHtml = await complete.text();
        expect(complete.status).toBe(200);
        expect(completeHtml).toContain("Evidence Review Complete");
        expect(completeHtml).toContain("4 of 4 selected claims reviewed");
        expect(completeHtml).toContain(`prooflayer job continue ${fixture.targetId}`);
        expect(completeHtml).toContain("Nothing continues automatically");
        const wrongOrigin = await fetch(claimUrl, {
            method: "POST",
            redirect: "manual",
            headers: {
                origin: "http://malicious.invalid",
                "content-type": "application/x-www-form-urlencoded",
            },
            body,
        });
        expect([403, 200]).toContain(wrongOrigin.status);
        if (wrongOrigin.status === 200) {
            expect(await wrongOrigin.text()).toContain("origin is not allowed");
        }
    }, 20_000);
});
async function startUiServer(workspace, batchId, readOnly) {
    const port = await findAvailableLoopbackPort("127.0.0.1", 4700);
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
    const entry = path.join(root, "apps/reviewer-ui/dist/server/entry.mjs");
    const csrfToken = "test-csrf-token-local-only";
    const child = spawn(process.execPath, [entry], {
        env: {
            ...process.env,
            HOST: "127.0.0.1",
            PORT: String(port),
            PROOFLAYER_UI_WORKSPACE: workspace,
            PROOFLAYER_UI_BATCH_ID: batchId,
            PROOFLAYER_UI_READ_ONLY: readOnly ? "1" : "0",
            PROOFLAYER_UI_CSRF_TOKEN: csrfToken,
        },
        stdio: "ignore",
    });
    children.push(child);
    const origin = `http://127.0.0.1:${port}`;
    const deadline = Date.now() + 10_000;
    while (Date.now() < deadline) {
        if (child.exitCode !== null)
            throw new Error(`Astro test server exited: ${child.exitCode}`);
        try {
            const response = await fetch(`${origin}/`, { redirect: "manual" });
            if (response.status >= 200 && response.status < 500) {
                return { child, origin, csrfToken };
            }
        }
        catch {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
    child.kill("SIGTERM");
    throw new Error("Astro test server did not become ready.");
}
function stringFields(value) {
    return Object.fromEntries(Object.entries(value).filter((entry) => entry[1] !== undefined));
}
function nonEligibleFields(decision, workContext, claimNature) {
    return {
        decision,
        reviewerRationale: "The claim is not approved for downstream use.",
        factualSupport: decision === "rejected" ? "unsupported" : "indeterminate",
        scope: "ambiguous",
        publicSafety: "indeterminate",
        resumeReadiness: "not-resume-ready",
        eligibleForRoleMatching: "false",
        eligibleForJobMapping: "false",
        metricState: "not-a-metric",
        workContext,
        claimNature,
    };
}
