import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import net from "node:net";
import path from "node:path";
import { pathExists } from "./fs-utils.js";
import { EVIDENCE_REVIEW_UI_NAME, validateEvidenceReviewUiBatch, } from "./evidence-review-ui.js";
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4321;
const MAX_PORT_SEARCH = 50;
const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);
export async function prepareEvidenceReviewUiLaunch(options, dependencies = {}) {
    const host = options.host ?? DEFAULT_HOST;
    assertLoopbackHost(host);
    const requestedPort = options.port ?? DEFAULT_PORT;
    assertPort(requestedPort);
    const batch = await validateEvidenceReviewUiBatch(options.workspace, options.batchId);
    const port = await (dependencies.findPort ?? findAvailableLoopbackPort)(host, requestedPort);
    const serverEntryPath = reviewerUiServerEntryPath();
    if (!(await pathExists(serverEntryPath))) {
        throw new Error("Local Evidence Review UI server is not built. Run `npm run build` before starting it.");
    }
    if (!(await pathExists(reviewerUiAstroServerEntryPath()))) {
        throw new Error("Local Evidence Review UI is not built. Run `npm run build:ui` before starting it.");
    }
    const origin = buildEvidenceReviewUiOrigin(host, port);
    return {
        workspace: path.resolve(options.workspace),
        batch,
        host,
        port,
        origin,
        url: `${origin}/review/${batch.batchId}`,
        readOnly: Boolean(options.readOnly),
        serverEntryPath,
    };
}
export async function launchEvidenceReviewUi(options, dependencies = {}) {
    const prepared = await prepareEvidenceReviewUiLaunch(options, dependencies);
    const csrfToken = randomBytes(32).toString("hex");
    const environment = {
        ...process.env,
        HOST: prepared.host,
        PORT: String(prepared.port),
        PROOFLAYER_UI_WORKSPACE: prepared.workspace,
        PROOFLAYER_UI_BATCH_ID: prepared.batch.batchId,
        PROOFLAYER_UI_READ_ONLY: prepared.readOnly ? "1" : "0",
        PROOFLAYER_UI_CSRF_TOKEN: csrfToken,
        PROOFLAYER_UI_ORIGIN: prepared.origin,
        ASTRO_NODE_AUTOSTART: "disabled",
    };
    const child = (dependencies.spawnServer ?? spawnEvidenceReviewUiServer)(prepared.serverEntryPath, environment);
    await (dependencies.waitUntilReady ?? waitUntilEvidenceReviewUiReady)(prepared.url, child);
    if (options.open) {
        await (dependencies.openBrowser ?? openLocalBrowser)(prepared.url);
    }
    return { prepared, child };
}
export function formatEvidenceReviewUiLaunch(prepared) {
    const target = prepared.batch.target;
    return [
        EVIDENCE_REVIEW_UI_NAME,
        "",
        "Target:",
        target.title,
        ...(target.company ? [target.company] : []),
        ...(target.location ? [target.location] : []),
        ...(target.workingModel ? [target.workingModel] : []),
        "",
        "Batch:",
        prepared.batch.batchId,
        "",
        "Claims:",
        `${prepared.batch.progress.selected} selected`,
        `${prepared.batch.progress.reviewed} reviewed`,
        `${prepared.batch.progress.pending} pending`,
        "",
        "Mode:",
        prepared.readOnly ? "read-only" : "review submissions enabled",
        "",
        "Local URL:",
        prepared.url,
        "",
        "The server is local-only.",
        "Canonical JSON remains the source of truth.",
        "No snapshot upgrade or Job pipeline continuation occurs automatically.",
    ].join("\n");
}
export async function waitForEvidenceReviewUiExit(child) {
    if (child.exitCode !== null) {
        if (child.exitCode === 0)
            return;
        throw new Error(`Local Evidence Review UI exited unexpectedly (${child.exitCode}).`);
    }
    await new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("exit", (code, signal) => {
            if (code === 0 || signal === "SIGINT" || signal === "SIGTERM")
                resolve();
            else
                reject(new Error(`Local Evidence Review UI exited unexpectedly (${code ?? signal}).`));
        });
    });
}
export function assertLoopbackHost(host) {
    if (!LOOPBACK_HOSTS.has(host)) {
        throw new Error(`Unsafe UI host "${host}". Local Evidence Review UI accepts only 127.0.0.1, localhost, or ::1.`);
    }
}
export function buildEvidenceReviewUiOrigin(host, port) {
    assertLoopbackHost(host);
    assertPort(port);
    return new URL(`http://${urlHost(host)}:${port}`).origin;
}
export async function findAvailableLoopbackPort(host, startPort) {
    assertLoopbackHost(host);
    assertPort(startPort);
    for (let port = startPort; port < startPort + MAX_PORT_SEARCH && port <= 65_535; port += 1) {
        if (await canListen(host, port))
            return port;
    }
    throw new Error(`No available loopback port found from ${startPort}.`);
}
function reviewerUiServerEntryPath() {
    const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(moduleDirectory, "../dist/evidence-review-ui-http-server.js");
}
function reviewerUiAstroServerEntryPath() {
    const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(moduleDirectory, "../apps/reviewer-ui/dist/server/entry.mjs");
}
function spawnEvidenceReviewUiServer(entryPath, environment) {
    return spawn(process.execPath, [entryPath], {
        env: environment,
        stdio: "inherit",
    });
}
async function waitUntilEvidenceReviewUiReady(url, child) {
    const deadline = Date.now() + 10_000;
    while (Date.now() < deadline) {
        if (child.exitCode !== null) {
            throw new Error(`Local Evidence Review UI exited before it became ready (${child.exitCode}).`);
        }
        try {
            const response = await fetch(url, { redirect: "manual" });
            if (response.status >= 200 && response.status < 500)
                return;
        }
        catch {
            // The standalone server may need a brief moment to begin listening.
        }
        await delay(100);
    }
    child.kill("SIGTERM");
    throw new Error("Local Evidence Review UI did not become ready within 10 seconds.");
}
async function openLocalBrowser(url) {
    const command = process.platform === "darwin"
        ? { executable: "open", args: [url] }
        : process.platform === "win32"
            ? { executable: "cmd", args: ["/c", "start", "", url] }
            : { executable: "xdg-open", args: [url] };
    const child = spawn(command.executable, command.args, {
        stdio: "ignore",
        detached: true,
    });
    child.unref();
}
async function canListen(host, port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.unref();
        server.once("error", () => resolve(false));
        server.listen({ host, port, exclusive: true }, () => {
            server.close(() => resolve(true));
        });
    });
}
function assertPort(port) {
    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
        throw new Error("UI port must be an integer between 1 and 65535.");
    }
}
function urlHost(host) {
    return host.includes(":") ? `[${host}]` : host;
}
function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
