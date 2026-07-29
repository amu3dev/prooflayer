import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { assertLoopbackHost, buildEvidenceReviewUiOrigin, } from "./evidence-review-ui-server.js";
export function evidenceReviewUiHttpRuntime(environment = process.env) {
    const host = environment.HOST;
    const port = Number(environment.PORT);
    const configuredOrigin = environment.PROOFLAYER_UI_ORIGIN;
    if (!host || !configuredOrigin || !Number.isInteger(port) || port < 1 || port > 65_535) {
        throw new Error("Local Evidence Review UI HTTP runtime is not configured safely.");
    }
    assertLoopbackHost(host);
    const origin = buildEvidenceReviewUiOrigin(host, port);
    if (configuredOrigin !== origin) {
        throw new Error("Local Evidence Review UI origin does not match its selected host and port.");
    }
    return {
        host,
        port,
        origin,
        authority: new URL(origin).host,
        astroServerEntryPath: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../apps/reviewer-ui/dist/server/entry.mjs"),
    };
}
export async function startEvidenceReviewUiHttpServer(environment = process.env) {
    const runtime = evidenceReviewUiHttpRuntime(environment);
    process.env.ASTRO_NODE_AUTOSTART = "disabled";
    const astro = await import(pathToFileURL(runtime.astroServerEntryPath).href);
    if (typeof astro.handler !== "function") {
        throw new Error("Built Local Evidence Review UI server handler is unavailable.");
    }
    const server = http.createServer(createGuardedRequestListener(runtime, astro.handler));
    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(runtime.port, runtime.host, () => {
            server.off("error", reject);
            resolve();
        });
    });
    return server;
}
function createGuardedRequestListener(runtime, astroHandler) {
    return (request, response) => {
        const hostRejection = validateRequestHost(request, runtime.authority);
        if (hostRejection) {
            rejectRequest(response, hostRejection.status, hostRejection.message);
            return;
        }
        if (!isSafeMethod(request.method) && request.headers.origin !== runtime.origin) {
            rejectRequest(response, 403, "Cross-site request origin is forbidden.");
            return;
        }
        astroHandler(request, response);
    };
}
function validateRequestHost(request, expectedAuthority) {
    if (request.headers["x-forwarded-host"] !== undefined
        || request.headers["x-forwarded-proto"] !== undefined
        || request.headers["x-forwarded-port"] !== undefined) {
        return { status: 400, message: "Forwarded host headers are not accepted by the local UI." };
    }
    const host = request.headers.host;
    if (!host) {
        return { status: 400, message: "A valid Host header is required." };
    }
    let authority;
    try {
        const parsed = new URL(`http://${host}`);
        if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
            return { status: 400, message: "The Host header is invalid." };
        }
        authority = parsed.host;
    }
    catch {
        return { status: 400, message: "The Host header is invalid." };
    }
    if (authority !== expectedAuthority) {
        return { status: 421, message: "The request Host does not match the selected local UI origin." };
    }
    return undefined;
}
function isSafeMethod(method) {
    return method === "GET" || method === "HEAD" || method === "OPTIONS";
}
function rejectRequest(response, status, message) {
    const body = Buffer.from(message, "utf8");
    response.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Length": String(body.byteLength),
        "Cache-Control": "no-store",
    });
    response.end(body);
}
async function main() {
    const runtime = evidenceReviewUiHttpRuntime();
    const server = await startEvidenceReviewUiHttpServer();
    if (process.env.ASTRO_NODE_LOGGING !== "disabled") {
        process.stdout.write(`Server listening on ${runtime.origin}\n`);
    }
    let closing = false;
    const close = () => {
        if (closing)
            return;
        closing = true;
        server.close(() => process.exit(0));
        server.closeIdleConnections();
        const forceClose = setTimeout(() => server.closeAllConnections(), 1_000);
        forceClose.unref();
    };
    process.once("SIGINT", close);
    process.once("SIGTERM", close);
}
const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (invokedPath === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        const message = error instanceof Error ? error.message : "Unknown local UI server error.";
        process.stderr.write(`${message}\n`);
        process.exitCode = 1;
    });
}
