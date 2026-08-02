import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { request as httpRequest } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { projectCareerTwin } from "../career-twin.js";
import { listEvidenceClaimReviews } from "../evidence-claim-review.js";
import { submitEvidenceReviewUiClaim } from "../evidence-review-ui.js";
import { evidenceReviewUiClaimCsrfToken, proofLayerUiActionCsrfToken, } from "../evidence-review-ui-csrf.js";
import { buildEvidenceReviewUiOrigin, findAvailableLoopbackPort } from "../evidence-review-ui-server.js";
import { PRODUCT_WORKFLOW_ACTIONS } from "../prooflayer-ui-request-scope.js";
import { showTarget } from "../targets.js";
import { createEvidenceReviewUiFixture, validApprovedFields } from "./evidence-review-ui-fixture.js";
import { createProductShellFixture } from "./product-shell-fixture.js";
const children = [];
const TEST_SECRET = "b".repeat(64);
let nextPort = 4950;
afterEach(async () => {
    await Promise.all(children.splice(0).map(stopServer));
});
describe("ProofLayer product shell over real HTTP", () => {
    it("renders product journeys and keeps raw pipeline machinery out of the Home page", async () => {
        const fixture = await createProductShellFixture();
        const server = await startProductServer(fixture.workspace, false);
        const home = await fetch(server.origin);
        const homeHtml = await home.text();
        const careerHtml = await (await fetch(`${server.origin}/career`)).text();
        const jobHtml = await (await fetch(`${server.origin}/resume/job?target=${fixture.jobTargetId}`)).text();
        const reviewHtml = await (await fetch(`${server.origin}/advanced-review`)).text();
        expect(home.status).toBe(200);
        expect(homeHtml).toContain("Welcome back, Alex.");
        expect(homeHtml).toContain("Create a Resume for a Role");
        expect(homeHtml).toContain("Tailor My Resume to a Job");
        expect(homeHtml).toContain("Technical Product Manager final");
        expect(homeHtml).not.toMatch(/snapshot-pin|coverage-manifest|scaffold|policy hash/i);
        expect(careerHtml).toContain("Your Career Twin");
        expect(careerHtml).toContain("Product-focused Software Developer");
        expect(jobHtml).toContain("Natterbox");
        expect(jobHtml).toContain("insufficient evidence");
        expect(jobHtml).toContain("Advanced Details");
        expect(jobHtml).not.toMatch(/chance of getting hired|87%/i);
        expect(reviewHtml).toContain("Advanced Review");
    }, 20_000);
    it("selects, pastes, and uploads Job Descriptions through the same protected journey", async () => {
        const fixture = await createProductShellFixture();
        const server = await startProductServer(fixture.workspace, false);
        const headers = { origin: server.origin };
        const selected = await fetch(`${server.origin}/resume/job`, {
            method: "POST",
            redirect: "manual",
            headers: { ...headers, "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                csrfToken: productToken("/resume/job", PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow, fixture.jobTargetId),
                action: PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow,
                targetId: fixture.jobTargetId,
            }),
        });
        expect(selected.status).toBe(303);
        expect(selected.headers.get("location")).toContain(`target=${fixture.jobTargetId}`);
        const pasted = new FormData();
        pasted.set("csrfToken", productToken("/resume/job", PRODUCT_WORKFLOW_ACTIONS.createJobTarget));
        pasted.set("action", PRODUCT_WORKFLOW_ACTIONS.createJobTarget);
        pasted.set("title", "Pasted Product Manager");
        pasted.set("company", "PasteCo");
        pasted.set("description", "## Requirements\n\n- Lead product discovery.\n");
        const pastedResponse = await postBrowserFormData(`${server.origin}/resume/job`, nullOriginNavigationHeaders(false), pasted);
        expect(pastedResponse.status).toBe(303);
        expect(await showTarget(fixture.workspace, "job-pasteco-pasted-product-manager"))
            .toMatchObject({ type: "job", title: "Pasted Product Manager" });
        const uploaded = new FormData();
        uploaded.set("csrfToken", productToken("/resume/job", PRODUCT_WORKFLOW_ACTIONS.createJobTarget));
        uploaded.set("action", PRODUCT_WORKFLOW_ACTIONS.createJobTarget);
        uploaded.set("file", new File([[
                "---",
                "title: Uploaded Engineering Manager",
                "company: UploadCo",
                "---",
                "",
                "## Requirements",
                "",
                "- Lead engineering delivery.",
                "",
            ].join("\n")], "job.md", { type: "text/markdown" }));
        const uploadedResponse = await fetch(`${server.origin}/resume/job`, {
            method: "POST",
            redirect: "manual",
            headers,
            body: uploaded,
        });
        expect(uploadedResponse.status).toBe(303);
        expect(await showTarget(fixture.workspace, "job-uploadco-uploaded-engineering-manager"))
            .toMatchObject({ type: "job", title: "Uploaded Engineering Manager" });
    }, 30_000);
    it.each(["127.0.0.1", "localhost"])("accepts exact-origin and constrained null-origin Role actions on %s without review context", async (host) => {
        const fixture = await createProductShellFixture();
        const server = await startProductServer(fixture.workspace, false, host);
        const token = productToken("/resume/role", PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow);
        const body = new URLSearchParams({
            csrfToken: token,
            action: PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
            title: "Engineering Manager",
        });
        const crossOrigin = await fetch(`${server.origin}/resume/role`, {
            method: "POST",
            redirect: "manual",
            headers: { origin: "http://malicious.invalid", "content-type": "application/x-www-form-urlencoded" },
            body,
        });
        expect(crossOrigin.status).toBe(403);
        await expect(showTarget(fixture.workspace, "role-engineering-manager")).rejects.toThrow("Target not found");
        const invalidToken = await fetch(`${server.origin}/resume/role`, {
            method: "POST",
            redirect: "manual",
            headers: { origin: server.origin, "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                csrfToken: "0".repeat(64),
                action: PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
                title: "Engineering Manager",
            }),
        });
        expect(invalidToken.status).toBe(403);
        await expect(showTarget(fixture.workspace, "role-engineering-manager")).rejects.toThrow("Target not found");
        const valid = await fetch(`${server.origin}/resume/role`, {
            method: "POST",
            redirect: "manual",
            headers: { origin: server.origin, "content-type": "application/x-www-form-urlencoded" },
            body,
        });
        expect(valid.status).toBe(303);
        expect(valid.headers.get("location")).toContain("target=role-engineering-manager");
        expect(await showTarget(fixture.workspace, "role-engineering-manager"))
            .toMatchObject({ type: "role", title: "Engineering Manager" });
        const sourceBefore = await readFile(path.join(fixture.workspace, fixture.source.path));
        const reviewsBefore = await listEvidenceClaimReviews(fixture.workspace);
        const nullOrigin = await postBrowserForm(`${server.origin}/resume/role`, nullOriginNavigationHeaders(), new URLSearchParams({
            csrfToken: token,
            action: PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
            title: "CTO",
        }).toString());
        expect(nullOrigin.status).toBe(303);
        expect(nullOrigin.headers.location).toContain("target=role-cto");
        expect(await showTarget(fixture.workspace, "role-cto"))
            .toMatchObject({ type: "role", title: "CTO" });
        const statusPage = await fetch(`${server.origin}${nullOrigin.headers.location}`);
        const statusHtml = await statusPage.text();
        expect(statusPage.status).toBe(200);
        expect(statusHtml).toContain("CTO");
        expect(statusHtml.toLowerCase()).toContain("no source re-upload is required");
        expect(statusHtml).toContain("ProofLayer's current understanding");
        expect(statusHtml).toContain("Recommended positioning");
        expect(statusHtml).toContain("Your strongest match");
        expect(statusHtml).toContain("Gaps and cautions");
        expect(statusHtml).not.toMatch(/add or review a role-expectations profile/i);
        expect(statusHtml).toContain("Smallest next action");
        expect(statusHtml).not.toContain("locked batch context");
        const refine = await fetch(`${server.origin}/resume/role`, {
            method: "POST",
            redirect: "manual",
            headers: { origin: server.origin, "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                csrfToken: productToken("/resume/role", PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow, "role-cto"),
                action: PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow,
                targetId: "role-cto",
                specialization: "startup-product-cto",
            }),
        });
        expect(refine.status).toBe(303);
        const refinedPage = await fetch(`${server.origin}${refine.headers.get("location")}`);
        const refinedHtml = await refinedPage.text();
        expect(refinedHtml).toContain("Startup / Product CTO");
        expect(refinedHtml).not.toContain("One optional clarification");
        expect(await readFile(path.join(fixture.workspace, fixture.source.path))).toEqual(sourceBefore);
        expect(await listEvidenceClaimReviews(fixture.workspace)).toEqual(reviewsBefore);
    }, 20_000);
    it("shows an evidence-backed Role draft preview only from reviewed eligible claims", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        for (const claimId of ["claim_review_ui_1", "claim_review_ui_2", "claim_review_ui_3"]) {
            await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, claimId, validApprovedFields());
        }
        const server = await startProductServer(fixture.workspace, false);
        const response = await fetch(`${server.origin}/resume/role`, {
            method: "POST",
            redirect: "manual",
            headers: { origin: server.origin, "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                csrfToken: productToken("/resume/role", PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow),
                action: PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
                title: "AI Product Manager",
            }),
        });
        expect(response.status).toBe(303);
        const html = await (await fetch(`${server.origin}${response.headers.get("location")}`)).text();
        expect(html).toContain("Resume preview");
        expect(html).toContain("Supported AI product workflows and engineering collaboration.");
        expect(html).toContain("Human review required");
        expect(html).not.toMatch(/role-expectations profile|auto-approved/i);
    }, 20_000);
    it("turns an existing Role Target into a contextual continuation instead of restarting it", async () => {
        const fixture = await createProductShellFixture();
        const server = await startProductServer(fixture.workspace, false);
        const created = await fetch(`${server.origin}/resume/role`, {
            method: "POST",
            redirect: "manual",
            headers: { origin: server.origin, "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                csrfToken: productToken("/resume/role", PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow),
                action: PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
                title: "AI Product Manager",
            }),
        });
        expect(created.status).toBe(303);
        const initial = await fetch(`${server.origin}/resume/role?target=role-ai-product-manager`);
        const initialHtml = await initial.text();
        expect(initial.status).toBe(200);
        expect(initialHtml).toContain("Continue Preparing Resume");
        expect(initialHtml).not.toContain("Create My Resume");
        expect(initialHtml).not.toContain("Review Resume");
        const continued = await fetch(`${server.origin}/resume/role`, {
            method: "POST",
            redirect: "manual",
            headers: { origin: server.origin, "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                csrfToken: productToken("/resume/role", PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow, "role-ai-product-manager"),
                action: PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow,
                targetId: "role-ai-product-manager",
            }),
        });
        expect(continued.status).toBe(303);
        const after = await (await fetch(`${server.origin}${continued.headers.get("location")}`)).text();
        expect(after).toContain("Review and approve the role interpretation before preparing the resume.");
        expect(after).toContain("Continue Preparing Resume");
        expect(after).not.toContain("Review Resume");
    }, 20_000);
    it("keeps review and workflow tokens isolated in normal Product Shell mode", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        const server = await startProductServer(fixture.workspace, false);
        const claimId = "claim_review_ui_3";
        const reviewUrl = `${server.origin}/review/${fixture.batchId}/claim/${claimId}`;
        const reviewToken = evidenceReviewUiClaimCsrfToken(TEST_SECRET, fixture.batchId, claimId);
        const roleToken = productToken("/resume/role", PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow);
        const reviewTokenOnRole = await postBrowserForm(`${server.origin}/resume/role`, nullOriginNavigationHeaders(), new URLSearchParams({
            csrfToken: reviewToken,
            action: PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
            title: "CTO",
        }).toString());
        expect(reviewTokenOnRole.status).toBe(403);
        await expect(showTarget(fixture.workspace, "role-cto")).rejects.toThrow("Target not found");
        const productTokenOnReview = await postBrowserForm(reviewUrl, nullOriginNavigationHeaders(), new URLSearchParams({ csrfToken: roleToken, reviewMode: "simple", intent: "approve" }).toString());
        expect(productTokenOnReview.status).toBe(403);
        expect((await listEvidenceClaimReviews(fixture.workspace)).every(({ status }) => status === "missing")).toBe(true);
        const validReview = await postBrowserForm(reviewUrl, nullOriginNavigationHeaders(), new URLSearchParams({ csrfToken: reviewToken, reviewMode: "simple", intent: "approve" }).toString());
        expect(validReview.status).toBe(303);
        expect((await listEvidenceClaimReviews(fixture.workspace)).filter(({ status }) => status === "current")).toEqual([
            expect.objectContaining({ claimId, decision: "approved" }),
        ]);
    }, 20_000);
    it("rejects wrong-target, wrong-action, and unknown writable product requests", async () => {
        const fixture = await createProductShellFixture();
        const server = await startProductServer(fixture.workspace, false);
        const before = await projectCareerTwin(fixture.workspace);
        const wrongTarget = await postBrowserForm(`${server.origin}/resume/job`, nullOriginNavigationHeaders(), new URLSearchParams({
            csrfToken: productToken("/resume/job", PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow, "job-wrong-target"),
            action: PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow,
            targetId: fixture.jobTargetId,
        }).toString());
        expect(wrongTarget.status).toBe(403);
        const wrongAction = await postBrowserForm(`${server.origin}/resume/role`, nullOriginNavigationHeaders(), new URLSearchParams({
            csrfToken: productToken("/resume/job", PRODUCT_WORKFLOW_ACTIONS.createJobTarget),
            action: PRODUCT_WORKFLOW_ACTIONS.createJobTarget,
            title: "CTO",
        }).toString());
        expect(wrongAction.status).toBe(403);
        const unknown = await fetch(`${server.origin}/clarifications`, {
            method: "POST",
            redirect: "manual",
            headers: { origin: server.origin, "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ csrfToken: "0".repeat(64) }),
        });
        expect(unknown.status).toBe(404);
        await expect(showTarget(fixture.workspace, "role-cto")).rejects.toThrow("Target not found");
        expect((await projectCareerTwin(fixture.workspace)).targets).toEqual(before.targets);
    }, 20_000);
    it("preserves read-only 405 behavior for product actions", async () => {
        const fixture = await createProductShellFixture();
        const server = await startProductServer(fixture.workspace, true);
        const response = await fetch(`${server.origin}/resume/role`, {
            method: "POST",
            redirect: "manual",
            headers: { origin: server.origin, "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                csrfToken: productToken("/resume/role", PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow),
                action: PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
                title: "Engineering Manager",
            }),
        });
        expect(response.status).toBe(405);
        await expect(showTarget(fixture.workspace, "role-engineering-manager")).rejects.toThrow("Target not found");
    }, 20_000);
});
async function startProductServer(workspace, readOnly, host = "127.0.0.1") {
    const port = await findAvailableLoopbackPort(host, nextPort++);
    const origin = buildEvidenceReviewUiOrigin(host, port);
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
    const entry = path.join(root, "dist/evidence-review-ui-http-server.js");
    if (!existsSync(entry))
        throw new Error("Build dist before running product server tests.");
    const child = spawn(process.execPath, [entry], {
        env: {
            ...process.env,
            HOST: host,
            PORT: String(port),
            PROOFLAYER_UI_MODE: "product",
            PROOFLAYER_UI_WORKSPACE: workspace,
            PROOFLAYER_UI_READ_ONLY: readOnly ? "1" : "0",
            PROOFLAYER_UI_CSRF_TOKEN: TEST_SECRET,
            PROOFLAYER_UI_ORIGIN: origin,
            ASTRO_NODE_AUTOSTART: "disabled",
            ASTRO_NODE_LOGGING: "disabled",
        },
        stdio: "ignore",
    });
    children.push(child);
    const deadline = Date.now() + 10_000;
    while (Date.now() < deadline) {
        if (child.exitCode !== null)
            throw new Error(`Product UI server exited: ${child.exitCode}`);
        try {
            const response = await fetch(origin);
            if (response.status === 200)
                return { origin, child };
        }
        catch {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
    throw new Error("Product UI server did not become ready.");
}
function productToken(routePath, actionName, targetId) {
    return proofLayerUiActionCsrfToken(TEST_SECRET, {
        routePath,
        actionName,
        ...(targetId ? { targetId } : {}),
    });
}
function nullOriginNavigationHeaders(includeUrlEncodedContentType = true) {
    return {
        origin: "null",
        ...(includeUrlEncodedContentType
            ? { "content-type": "application/x-www-form-urlencoded" }
            : {}),
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "navigate",
        "sec-fetch-dest": "document",
    };
}
async function postBrowserFormData(destination, headers, formData) {
    const serialized = new Request(destination, { method: "POST", body: formData });
    const contentType = serialized.headers.get("content-type");
    if (!contentType)
        throw new Error("Expected multipart form content type.");
    const body = Buffer.from(await serialized.arrayBuffer());
    return postBrowserForm(destination, { ...headers, "content-type": contentType }, body);
}
async function postBrowserForm(destination, headers, body) {
    const url = new URL(destination);
    const bodyBuffer = Buffer.isBuffer(body) ? body : Buffer.from(body, "utf8");
    return new Promise((resolve, reject) => {
        const request = httpRequest({
            hostname: url.hostname,
            port: url.port,
            path: `${url.pathname}${url.search}`,
            method: "POST",
            headers: {
                ...headers,
                "Content-Length": bodyBuffer.byteLength,
            },
        }, (response) => {
            const chunks = [];
            response.on("data", (chunk) => chunks.push(chunk));
            response.once("end", () => resolve({
                status: response.statusCode ?? 0,
                body: Buffer.concat(chunks).toString("utf8"),
                headers: response.headers,
            }));
        });
        request.once("error", reject);
        request.end(bodyBuffer);
    });
}
async function stopServer(child) {
    if (child.exitCode !== null)
        return;
    await new Promise((resolve) => {
        const timer = setTimeout(() => child.kill("SIGKILL"), 2_000);
        timer.unref();
        child.once("exit", () => { clearTimeout(timer); resolve(); });
        child.kill("SIGTERM");
    });
}
