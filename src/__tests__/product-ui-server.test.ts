import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { proofLayerUiActionCsrfToken } from "../evidence-review-ui-csrf.js";
import { buildEvidenceReviewUiOrigin, findAvailableLoopbackPort } from "../evidence-review-ui-server.js";
import { showTarget } from "../targets.js";
import { createProductShellFixture } from "./product-shell-fixture.js";

const children: ChildProcess[] = [];
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
    const token = proofLayerUiActionCsrfToken(TEST_SECRET, "/resume/job");
    const headers = { origin: server.origin };

    const selected = await fetch(`${server.origin}/resume/job`, {
      method: "POST",
      redirect: "manual",
      headers: { ...headers, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken: token,
        action: "select",
        targetId: fixture.jobTargetId,
      }),
    });
    expect(selected.status).toBe(303);
    expect(selected.headers.get("location")).toContain(`target=${fixture.jobTargetId}`);

    const pasted = new FormData();
    pasted.set("csrfToken", token);
    pasted.set("action", "create");
    pasted.set("title", "Pasted Product Manager");
    pasted.set("company", "PasteCo");
    pasted.set("description", "## Requirements\n\n- Lead product discovery.\n");
    const pastedResponse = await fetch(`${server.origin}/resume/job`, {
      method: "POST",
      redirect: "manual",
      headers,
      body: pasted,
    });
    expect(pastedResponse.status).toBe(303);
    expect(await showTarget(fixture.workspace, "job-pasteco-pasted-product-manager"))
      .toMatchObject({ type: "job", title: "Pasted Product Manager" });

    const uploaded = new FormData();
    uploaded.set("csrfToken", token);
    uploaded.set("action", "create");
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

  it("accepts only a valid same-origin Role action and writes no target for rejected requests", async () => {
    const fixture = await createProductShellFixture();
    const server = await startProductServer(fixture.workspace, false);
    const token = proofLayerUiActionCsrfToken(TEST_SECRET, "/resume/role");
    const body = new URLSearchParams({ csrfToken: token, title: "Engineering Manager" });
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
      body: new URLSearchParams({ csrfToken: "0".repeat(64), title: "Engineering Manager" }),
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
  }, 20_000);

  it("preserves read-only 405 behavior for product actions", async () => {
    const fixture = await createProductShellFixture();
    const server = await startProductServer(fixture.workspace, true);
    const response = await fetch(`${server.origin}/resume/role`, {
      method: "POST",
      redirect: "manual",
      headers: { origin: server.origin, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken: proofLayerUiActionCsrfToken(TEST_SECRET, "/resume/role"),
        title: "Engineering Manager",
      }),
    });
    expect(response.status).toBe(405);
    await expect(showTarget(fixture.workspace, "role-engineering-manager")).rejects.toThrow("Target not found");
  }, 20_000);
});

async function startProductServer(workspace: string, readOnly: boolean) {
  const port = await findAvailableLoopbackPort("127.0.0.1", nextPort++);
  const origin = buildEvidenceReviewUiOrigin("127.0.0.1", port);
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const entry = path.join(root, "dist/evidence-review-ui-http-server.js");
  if (!existsSync(entry)) throw new Error("Build dist before running product server tests.");
  const child = spawn(process.execPath, [entry], {
    env: {
      ...process.env,
      HOST: "127.0.0.1",
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
    if (child.exitCode !== null) throw new Error(`Product UI server exited: ${child.exitCode}`);
    try {
      const response = await fetch(origin);
      if (response.status === 200) return { origin, child };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  throw new Error("Product UI server did not become ready.");
}

async function stopServer(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null) return;
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => child.kill("SIGKILL"), 2_000);
    timer.unref();
    child.once("exit", () => { clearTimeout(timer); resolve(); });
    child.kill("SIGTERM");
  });
}
