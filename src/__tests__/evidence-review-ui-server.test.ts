import { spawn, type ChildProcess } from "node:child_process";
import { request as httpRequest } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildEvidenceReviewUiOrigin,
  findAvailableLoopbackPort,
} from "../evidence-review-ui-server.js";
import { evidenceReviewUiClaimCsrfToken } from "../evidence-review-ui-csrf.js";
import { isEvidenceReviewUiLoopbackAddress } from "../evidence-review-ui-http-server.js";
import { listEvidenceClaimReviews } from "../evidence-claim-review.js";
import { submitEvidenceReviewUiClaim } from "../evidence-review-ui.js";
import {
  createEvidenceReviewUiFixture,
  validApprovedFields,
} from "./evidence-review-ui-fixture.js";

const children: ChildProcess[] = [];
let nextIpv4Port = 4700;
let nextLocalhostPort = 4800;
const TEST_CSRF_SECRET = "a".repeat(64);
const TEST_CLAIM_IDS = [
  "claim_review_ui_1",
  "claim_review_ui_2",
  "claim_review_ui_3",
  "claim_review_ui_4",
] as const;

afterEach(async () => {
  await Promise.all(children.splice(0).map(stopUiServer));
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

    const claimResponse = await fetch(
      `${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_3`,
    );
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

    const readOnlyPost = await fetch(
      `${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_3`,
      {
        method: "POST",
        redirect: "manual",
        headers: {
          origin: "null",
          "content-type": "application/x-www-form-urlencoded",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "navigate",
          "sec-fetch-dest": "document",
        },
        body: new URLSearchParams({ csrfToken: server.csrfToken }),
      },
    );
    expect(readOnlyPost.status).toBe(405);
    expect((await listEvidenceClaimReviews(fixture.workspace)).every(
      ({ status }) => status === "missing",
    )).toBe(true);

    const foreignBatch = await fetch(
      `${server.origin}/review/evidence-review-batch_00000000000000000000`,
    );
    const unknownClaim = await fetch(
      `${server.origin}/review/${fixture.batchId}/claim/claim_outside_batch`,
    );
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
    expect(invalidHtml).not.toMatch(/Invalid enum|Expected .* received/i);
    expect((await listEvidenceClaimReviews(fixture.workspace)).every(
      ({ status }) => status === "missing",
    )).toBe(true);

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

    await submitEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_1",
      validApprovedFields({ workContext: "employment" }),
    );
    await submitEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_2",
      nonEligibleFields("rejected", "employment", "responsibility"),
    );
    await submitEvidenceReviewUiClaim(
      fixture.workspace,
      fixture.batchId,
      "claim_review_ui_4",
      nonEligibleFields("deferred", "education", "credential"),
    );
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
    expect(wrongOrigin.status).toBe(403);
  }, 20_000);

  it("uses Simple Review by default and submits a clear claim in one decision", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    const server = await startUiServer(fixture.workspace, fixture.batchId, false);
    const claimUrl = `${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_3`;
    const claimResponse = await fetch(claimUrl);
    const claimHtml = await claimResponse.text();

    expect(claimResponse.status).toBe(200);
    expect((claimHtml.match(/name="intent"/g) ?? [])).toHaveLength(5);
    expect(claimHtml).toContain("What should happen to this claim?");
    expect(claimHtml).toContain("Approve");
    expect(claimHtml).toContain("Edit and Approve");
    expect(claimHtml).toContain("Not Enough Evidence");
    expect(claimHtml).toContain("Decide Later");
    expect(claimHtml).toContain("What ProofLayer will record");
    expect(claimHtml).toContain('<details class="advanced-review">');
    expect(claimHtml).toContain("Exceptional or ambiguous cases only");
    expect(claimHtml).toContain('name="factualSupport"');
    expect(claimHtml).toContain('name="submitAction" value="next"');
    expect(claimHtml).not.toContain('<details class="advanced-review" open>');

    const invalid = await fetch(claimUrl, {
      method: "POST",
      redirect: "manual",
      headers: {
        origin: server.origin,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        csrfToken: server.csrfToken,
        reviewMode: "simple",
        intent: "approve-with-edit",
        reviewerNote: "Keep this note after validation.",
      }),
    });
    const invalidHtml = await invalid.text();
    expect(invalid.status).toBe(200);
    expect(invalidHtml).toContain("A little more information is needed");
    expect(invalidHtml).toContain("Enter the narrower wording to approve.");
    expect(invalidHtml).toContain("Keep this note after validation.");
    expect(invalidHtml).toMatch(/value="approve-with-edit"[^>]*checked/);
    expect(invalidHtml).not.toMatch(/Invalid enum|Expected .* received/i);
    expect((await listEvidenceClaimReviews(fixture.workspace)).every(
      ({ status }) => status === "missing",
    )).toBe(true);

    const valid = await fetch(claimUrl, {
      method: "POST",
      redirect: "manual",
      headers: {
        origin: server.origin,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        csrfToken: server.csrfToken,
        reviewMode: "simple",
        intent: "approve",
        submitAction: "next",
      }),
    });
    expect(valid.status).toBe(303);
    expect(valid.headers.get("location")).toMatch(
      new RegExp(`/review/${fixture.batchId}/claim/claim_review_ui_(?!3)`),
    );
    const reviews = await listEvidenceClaimReviews(fixture.workspace);
    expect(reviews.filter(({ status }) => status === "current")).toEqual([
      expect.objectContaining({ claimId: "claim_review_ui_3", decision: "approved" }),
    ]);

    const currentResponse = await fetch(claimUrl);
    const currentHtml = await currentResponse.text();
    expect(currentHtml).toContain("Current immutable review");
    expect(currentHtml).toContain("Create revised review");
    expect(currentHtml).not.toContain("<form");

    const reviseResponse = await fetch(`${claimUrl}?revise=true`);
    const reviseHtml = await reviseResponse.text();
    expect(reviseHtml).toContain('name="confirmSupersession" value="true"');
    expect(reviseHtml).toContain("The prior review remains immutable.");
  }, 20_000);

  it("disables simple approval when immutable evidence visibility is private", async () => {
    const fixture = await createEvidenceReviewUiFixture({ visibility: "private" });
    const server = await startUiServer(fixture.workspace, fixture.batchId, false);
    const claimUrl = `${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_3`;
    const response = await fetch(claimUrl);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("Simple approval is unavailable.");
    expect(html).toMatch(/value="approve"[^>]*disabled/);
    expect(html).toMatch(/value="approve-with-edit"[^>]*disabled/);
    expect(html).toMatch(/value="reject"(?![^>]*disabled)/);
    expect(html).not.toContain("/Users/synthetic-private/");
  }, 20_000);

  it.each(["127.0.0.1", "localhost"] as const)(
    "accepts a browser-like same-origin POST on %s without mixing loopback authorities",
    async (host) => {
      const fixture = await createEvidenceReviewUiFixture();
      const server = await startUiServer(fixture.workspace, fixture.batchId, false, host);
      const claimUrl = `${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_3`;
      const claimResponse = await fetch(claimUrl);
      const claimHtml = await claimResponse.text();
      expect(claimResponse.status).toBe(200);
      expect(claimHtml).toContain(
        `<form class="review-form simple-review-form" method="post" action="/review/${fixture.batchId}/claim/claim_review_ui_3" novalidate>`,
      );
      expect(claimHtml).not.toContain(host === "localhost" ? "127.0.0.1" : "localhost");

      const body = new URLSearchParams({
        csrfToken: server.csrfToken,
        ...stringFields(validApprovedFields()),
      });
      const foreignOrigin = await fetch(claimUrl, {
        method: "POST",
        redirect: "manual",
        headers: {
          origin: "http://malicious.invalid",
          "content-type": "application/x-www-form-urlencoded",
        },
        body,
      });
      expect(foreignOrigin.status).toBe(403);

      const alternateHost = host === "localhost" ? "127.0.0.1" : "localhost";
      const alternateOrigin = await fetch(claimUrl, {
        method: "POST",
        redirect: "manual",
        headers: {
          origin: `http://${alternateHost}:${new URL(server.origin).port}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        body,
      });
      expect(alternateOrigin.status).toBe(403);

      const mismatchedHost = await postWithHost(
        claimUrl,
        `${alternateHost}:${new URL(server.origin).port}`,
        server.origin,
        body.toString(),
      );
      expect(mismatchedHost).toBe(421);

      const unsafeHost = await postWithHost(
        claimUrl,
        "malicious.invalid",
        server.origin,
        body.toString(),
      );
      expect(unsafeHost).toBe(421);

      const missingHost = await postWithHost(
        claimUrl,
        undefined,
        server.origin,
        body.toString(),
      );
      expect(missingHost).toBe(400);
      expect((await listEvidenceClaimReviews(fixture.workspace)).every(
        ({ status }) => status === "missing",
      )).toBe(true);

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
      const reviews = await listEvidenceClaimReviews(fixture.workspace);
      expect(reviews.filter(({ status }) => status === "current")).toEqual([
        expect.objectContaining({ claimId: "claim_review_ui_3", decision: "approved" }),
      ]);
    },
    20_000,
  );

  it("accepts an opaque browser origin only with loopback navigation metadata and a claim-bound token", async () => {
    const fixture = await createEvidenceReviewUiFixture();
    const server = await startUiServer(fixture.workspace, fixture.batchId, false);
    const claimUrl = `${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_3`;
    const validBody = new URLSearchParams({
      csrfToken: server.csrfToken,
      ...stringFields(validApprovedFields()),
    });
    const nullOriginHeaders = {
      origin: "null",
      "content-type": "application/x-www-form-urlencoded",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "navigate",
      "sec-fetch-dest": "document",
    };

    const missingToken = await postBrowserForm(
      claimUrl,
      nullOriginHeaders,
      new URLSearchParams(stringFields(validApprovedFields())).toString(),
    );
    expect(missingToken.status).toBe(403);

    const invalidToken = await postBrowserForm(
      claimUrl,
      nullOriginHeaders,
      new URLSearchParams({ ...Object.fromEntries(validBody), csrfToken: "b".repeat(64) }).toString(),
    );
    expect(invalidToken.status).toBe(403);

    const crossSite = await postBrowserForm(
      claimUrl,
      { ...nullOriginHeaders, "sec-fetch-site": "cross-site" },
      validBody.toString(),
    );
    expect(crossSite.status).toBe(403);

    const unsafeMode = await postBrowserForm(
      claimUrl,
      { ...nullOriginHeaders, "sec-fetch-mode": "cors" },
      validBody.toString(),
    );
    expect(unsafeMode.status).toBe(403);

    const unsafeDestination = await postBrowserForm(
      claimUrl,
      { ...nullOriginHeaders, "sec-fetch-dest": "empty" },
      validBody.toString(),
    );
    expect(unsafeDestination.status).toBe(403);

    const missingOrigin = await fetch(claimUrl, {
      method: "POST",
      redirect: "manual",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: validBody,
    });
    expect(missingOrigin.status).toBe(403);

    const externalOrigin = await fetch(claimUrl, {
      method: "POST",
      redirect: "manual",
      headers: { ...nullOriginHeaders, origin: "http://external.invalid" },
      body: validBody,
    });
    expect(externalOrigin.status).toBe(403);

    for (const forwardedHeader of ["x-forwarded-host", "x-forwarded-proto", "x-forwarded-port"]) {
      const forwarded = await postBrowserForm(
        claimUrl,
        { ...nullOriginHeaders, [forwardedHeader]: "forged.invalid" },
        validBody.toString(),
      );
      expect(forwarded.status).toBe(400);
    }

    const crossBatch = await postBrowserForm(
      `${server.origin}/review/evidence-review-batch_00000000000000000000/claim/claim_review_ui_3`,
      nullOriginHeaders,
      validBody.toString(),
    );
    expect(crossBatch.status).toBe(403);

    const crossClaim = await postBrowserForm(
      `${server.origin}/review/${fixture.batchId}/claim/claim_review_ui_1`,
      nullOriginHeaders,
      validBody.toString(),
    );
    expect(crossClaim.status).toBe(403);
    expect((await listEvidenceClaimReviews(fixture.workspace)).every(
      ({ status }) => status === "missing",
    )).toBe(true);

    expect(isEvidenceReviewUiLoopbackAddress("127.0.0.1")).toBe(true);
    expect(isEvidenceReviewUiLoopbackAddress("::1")).toBe(true);
    expect(isEvidenceReviewUiLoopbackAddress("::ffff:127.0.0.1")).toBe(true);
    expect(isEvidenceReviewUiLoopbackAddress("192.0.2.10")).toBe(false);
    expect(isEvidenceReviewUiLoopbackAddress(undefined)).toBe(false);

    const valid = await postBrowserForm(claimUrl, nullOriginHeaders, validBody.toString());
    expect(valid).toEqual({ status: 303, body: "" });
    expect((await listEvidenceClaimReviews(fixture.workspace)).filter(
      ({ status }) => status === "current",
    )).toEqual([
      expect.objectContaining({ claimId: "claim_review_ui_3", decision: "approved" }),
    ]);
  }, 20_000);
});

async function startUiServer(
  workspace: string,
  batchId: string,
  readOnly: boolean,
  host: "127.0.0.1" | "localhost" = "127.0.0.1",
): Promise<{ child: ChildProcess; origin: string; csrfToken: string }> {
  const requestedPort = host === "localhost" ? nextLocalhostPort++ : nextIpv4Port++;
  const port = await findAvailableLoopbackPort(host, requestedPort);
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const entry = path.join(root, "dist/evidence-review-ui-http-server.js");
  const csrfToken = evidenceReviewUiClaimCsrfToken(
    TEST_CSRF_SECRET,
    batchId,
    "claim_review_ui_3",
  );
  const origin = buildEvidenceReviewUiOrigin(host, port);
  const child = spawn(process.execPath, [entry], {
    env: {
      ...process.env,
      HOST: host,
      PORT: String(port),
      PROOFLAYER_UI_WORKSPACE: workspace,
      PROOFLAYER_UI_BATCH_ID: batchId,
      PROOFLAYER_UI_CLAIM_IDS: JSON.stringify(TEST_CLAIM_IDS),
      PROOFLAYER_UI_READ_ONLY: readOnly ? "1" : "0",
      PROOFLAYER_UI_CSRF_TOKEN: TEST_CSRF_SECRET,
      PROOFLAYER_UI_ORIGIN: origin,
      ASTRO_NODE_AUTOSTART: "disabled",
    },
    stdio: "ignore",
  });
  children.push(child);
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Astro test server exited: ${child.exitCode}`);
    try {
      const response = await fetch(`${origin}/`, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) {
        return { child, origin, csrfToken };
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  child.kill("SIGTERM");
  throw new Error("Astro test server did not become ready.");
}

async function stopUiServer(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null) return;
  await new Promise<void>((resolve) => {
    const forceStop = setTimeout(() => child.kill("SIGKILL"), 2_000);
    forceStop.unref();
    child.once("exit", () => {
      clearTimeout(forceStop);
      resolve();
    });
    child.kill("SIGTERM");
  });
}

async function postWithHost(
  destination: string,
  hostHeader: string | undefined,
  origin: string,
  body: string,
): Promise<number> {
  const url = new URL(destination);
  return new Promise((resolve, reject) => {
    const request = httpRequest({
      hostname: url.hostname,
      port: url.port,
      path: `${url.pathname}${url.search}`,
      method: "POST",
      setHost: false,
      headers: {
        ...(hostHeader ? { Host: hostHeader } : {}),
        Origin: origin,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    }, (response) => {
      response.resume();
      response.once("end", () => resolve(response.statusCode ?? 0));
    });
    request.once("error", reject);
    request.end(body);
  });
}

async function postBrowserForm(
  destination: string,
  headers: Record<string, string>,
  body: string,
): Promise<{ status: number; body: string }> {
  const url = new URL(destination);
  return new Promise((resolve, reject) => {
    const request = httpRequest({
      hostname: url.hostname,
      port: url.port,
      path: `${url.pathname}${url.search}`,
      method: "POST",
      headers: {
        ...headers,
        "Content-Length": Buffer.byteLength(body),
      },
    }, (response) => {
      const chunks: Buffer[] = [];
      response.on("data", (chunk: Buffer) => chunks.push(chunk));
      response.once("end", () => resolve({
        status: response.statusCode ?? 0,
        body: Buffer.concat(chunks).toString("utf8"),
      }));
    });
    request.once("error", reject);
    request.end(body);
  });
}

function stringFields(
  value: Record<string, string | undefined>,
): Record<string, string> {
  return Object.fromEntries(Object.entries(value).filter(
    (entry): entry is [string, string] => entry[1] !== undefined,
  ));
}

function nonEligibleFields(
  decision: "rejected" | "deferred",
  workContext: string,
  claimNature: string,
): Record<string, string | undefined> {
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
