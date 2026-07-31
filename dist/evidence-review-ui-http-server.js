import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { evidenceReviewUiClaimCsrfToken, evidenceReviewUiCsrfTokenMatches, proofLayerUiActionCsrfToken, } from "./evidence-review-ui-csrf.js";
import { assertLoopbackHost, buildEvidenceReviewUiOrigin, } from "./evidence-review-ui-server.js";
import { isSafeMethod, productWorkflowActionAllowed, productWorkflowActionRequiresTarget, resolveProofLayerUiRequestScope, } from "./prooflayer-ui-request-scope.js";
const MAX_FORM_BODY_BYTES = 2_250_000;
export function evidenceReviewUiHttpRuntime(environment = process.env) {
    const host = environment.HOST;
    const port = Number(environment.PORT);
    const configuredOrigin = environment.PROOFLAYER_UI_ORIGIN;
    const batchId = environment.PROOFLAYER_UI_BATCH_ID;
    const mode = environment.PROOFLAYER_UI_MODE === "product" ? "product" : "review";
    const csrfSecret = environment.PROOFLAYER_UI_CSRF_TOKEN;
    const claimIds = mode === "review"
        ? parseClaimIds(environment.PROOFLAYER_UI_CLAIM_IDS)
        : new Set();
    const readOnly = environment.PROOFLAYER_UI_READ_ONLY === "1";
    if (!host
        || !configuredOrigin
        || (mode === "review" && (!batchId || !/^evidence-review-batch_[a-f0-9]{20}$/.test(batchId)))
        || !csrfSecret
        || !/^[a-f0-9]{64}$/.test(csrfSecret)
        || !Number.isInteger(port)
        || port < 1
        || port > 65_535) {
        throw new Error("Local Evidence Review UI HTTP runtime is not configured safely.");
    }
    assertLoopbackHost(host);
    const origin = buildEvidenceReviewUiOrigin(host, port);
    if (configuredOrigin !== origin) {
        throw new Error("Local Evidence Review UI origin does not match its selected host and port.");
    }
    return {
        mode,
        host,
        port,
        origin,
        authority: new URL(origin).host,
        ...(batchId ? { batchId } : {}),
        claimIds,
        readOnly,
        csrfSecret,
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
        void handleGuardedRequest(runtime, astroHandler, request, response).catch(() => {
            if (!response.headersSent) {
                rejectRequest(response, 400, "The local UI submission could not be validated safely.");
            }
            else if (!response.writableEnded) {
                response.end();
            }
        });
    };
}
async function handleGuardedRequest(runtime, astroHandler, request, response) {
    const hostRejection = validateRequestHost(request, runtime.authority);
    if (hostRejection) {
        rejectRequest(response, hostRejection.status, hostRejection.message);
        return;
    }
    if (isSafeMethod(request.method)) {
        astroHandler(request, response);
        return;
    }
    const scope = resolveProofLayerUiRequestScope(request.method, request.url, runtime.origin);
    if (scope.scope === "unregistered" || scope.scope === "read-only") {
        rejectRequest(response, 404, "This writable local UI route is not registered.");
        return;
    }
    if (runtime.readOnly) {
        rejectReadOnlyRequest(response);
        return;
    }
    if (!isEvidenceReviewUiLoopbackAddress(request.socket.remoteAddress)) {
        rejectRequest(response, 403, "Local UI submissions must come from the loopback interface.");
        return;
    }
    const origin = request.headers.origin;
    if (origin === runtime.origin) {
        astroHandler(request, response);
        return;
    }
    if (origin === undefined) {
        rejectRequest(response, 403, "A request Origin is required for local UI submissions.");
        return;
    }
    if (origin !== "null") {
        rejectRequest(response, 403, "Cross-site request origin is forbidden.");
        return;
    }
    const nullOriginRejection = await prepareNullOriginSubmission(request, runtime, scope);
    if (nullOriginRejection) {
        rejectRequest(response, nullOriginRejection.status, nullOriginRejection.message);
        return;
    }
    astroHandler(request, response);
}
async function prepareNullOriginSubmission(request, runtime, scope) {
    if (request.method !== "POST") {
        return { status: 403, message: "Null-origin local UI requests must use POST form navigation." };
    }
    const fetchSite = request.headers["sec-fetch-site"];
    if (fetchSite !== "same-origin" && fetchSite !== "none") {
        return { status: 403, message: "Null-origin local UI requests require same-origin fetch metadata." };
    }
    if (request.headers["sec-fetch-mode"] !== "navigate" || request.headers["sec-fetch-dest"] !== "document") {
        return { status: 403, message: "Null-origin local UI requests must be document form navigation." };
    }
    const contentType = request.headers["content-type"];
    if (!isSupportedFormContentType(contentType)) {
        return { status: 415, message: "Null-origin local UI requests require supported form content." };
    }
    const body = await readRequestBody(request, MAX_FORM_BODY_BYTES);
    const fields = await parseFormData(body, contentType, runtime.origin);
    const submittedToken = singleTextField(fields, "csrfToken");
    if (scope.scope === "evidence-review") {
        if (runtime.mode === "review"
            && (scope.batchId !== runtime.batchId || !runtime.claimIds.has(scope.claimId))) {
            return { status: 403, message: "Null-origin review request target is outside the locked batch context." };
        }
        const expectedToken = evidenceReviewUiClaimCsrfToken(runtime.csrfSecret, scope.batchId, scope.claimId);
        if (!evidenceReviewUiCsrfTokenMatches(submittedToken, expectedToken)) {
            return { status: 403, message: "Null-origin review request CSRF verification failed." };
        }
    }
    else {
        const actionName = singleTextField(fields, "action");
        if (!productWorkflowActionAllowed(scope.routePath, actionName)) {
            return { status: 403, message: "Null-origin product workflow action is not registered for this route." };
        }
        const targetId = productWorkflowActionRequiresTarget(actionName)
            ? singleTextField(fields, "targetId")
            : undefined;
        let expectedToken;
        try {
            expectedToken = proofLayerUiActionCsrfToken(runtime.csrfSecret, {
                actionName: actionName,
                routePath: scope.routePath,
                ...(targetId ? { targetId } : {}),
            });
        }
        catch {
            return { status: 403, message: "Null-origin product workflow context is invalid." };
        }
        if (!evidenceReviewUiCsrfTokenMatches(submittedToken, expectedToken)) {
            return { status: 403, message: "Null-origin product workflow CSRF verification failed." };
        }
    }
    request.body = body;
    request.headers.origin = runtime.origin;
    return undefined;
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
function parseClaimIds(value) {
    if (!value)
        throw new Error("Local Evidence Review UI claim context is missing.");
    let parsed;
    try {
        parsed = JSON.parse(value);
    }
    catch {
        throw new Error("Local Evidence Review UI claim context is invalid.");
    }
    if (!Array.isArray(parsed)
        || parsed.length === 0
        || parsed.some((claimId) => typeof claimId !== "string" || !/^claim_[A-Za-z0-9_-]+$/.test(claimId))
        || new Set(parsed).size !== parsed.length) {
        throw new Error("Local Evidence Review UI claim context is invalid.");
    }
    return new Set(parsed);
}
export function isEvidenceReviewUiLoopbackAddress(address) {
    return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}
function isSupportedFormContentType(contentType) {
    const mediaType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
    return mediaType === "application/x-www-form-urlencoded" || mediaType === "multipart/form-data";
}
async function parseFormData(body, contentType, expectedOrigin) {
    const formRequest = new Request(`${expectedOrigin}/_prooflayer-form-validation`, {
        method: "POST",
        headers: { "content-type": contentType },
        body: new Uint8Array(body),
    });
    return formRequest.formData();
}
function singleTextField(fields, name) {
    const values = fields.getAll(name);
    return values.length === 1 && typeof values[0] === "string" && values[0].length > 0
        ? values[0]
        : undefined;
}
async function readRequestBody(request, limit) {
    const contentLength = Number(request.headers["content-length"]);
    if (Number.isFinite(contentLength) && contentLength > limit) {
        throw new Error("Local UI submission exceeds the form body limit.");
    }
    const chunks = [];
    let received = 0;
    for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        received += buffer.byteLength;
        if (received > limit) {
            throw new Error("Local UI submission exceeds the form body limit.");
        }
        chunks.push(buffer);
    }
    return Buffer.concat(chunks);
}
function rejectReadOnlyRequest(response) {
    const body = Buffer.from("Local UI submissions are disabled in read-only mode.", "utf8");
    response.writeHead(405, {
        Allow: "GET",
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Length": String(body.byteLength),
        "Cache-Control": "no-store",
    });
    response.end(body);
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
