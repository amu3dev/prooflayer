import http, {
  type IncomingMessage,
  type RequestListener,
  type Server,
  type ServerResponse,
} from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  evidenceReviewUiClaimCsrfToken,
  evidenceReviewUiCsrfTokenMatches,
} from "./evidence-review-ui-csrf.js";
import {
  assertLoopbackHost,
  buildEvidenceReviewUiOrigin,
} from "./evidence-review-ui-server.js";

interface EvidenceReviewUiHttpRuntime {
  mode: "product" | "review";
  host: string;
  port: number;
  origin: string;
  authority: string;
  batchId?: string;
  claimIds: ReadonlySet<string>;
  readOnly: boolean;
  csrfSecret: string;
  astroServerEntryPath: string;
}

interface AstroServerModule {
  handler: RequestListener;
}

interface BufferedIncomingMessage extends IncomingMessage {
  body?: Buffer;
}

const MAX_FORM_BODY_BYTES = 1_048_576;
const CLAIM_ROUTE_PATTERN = /^\/review\/(evidence-review-batch_[a-f0-9]{20})\/claim\/(claim_[A-Za-z0-9_-]+)\/?$/;

export function evidenceReviewUiHttpRuntime(
  environment: NodeJS.ProcessEnv = process.env,
): EvidenceReviewUiHttpRuntime {
  const host = environment.HOST;
  const port = Number(environment.PORT);
  const configuredOrigin = environment.PROOFLAYER_UI_ORIGIN;
  const batchId = environment.PROOFLAYER_UI_BATCH_ID;
  const mode = environment.PROOFLAYER_UI_MODE === "product" ? "product" : "review";
  const csrfSecret = environment.PROOFLAYER_UI_CSRF_TOKEN;
  const claimIds = mode === "review"
    ? parseClaimIds(environment.PROOFLAYER_UI_CLAIM_IDS)
    : new Set<string>();
  const readOnly = environment.PROOFLAYER_UI_READ_ONLY === "1";
  if (
    !host
    || !configuredOrigin
    || (mode === "review" && (!batchId || !/^evidence-review-batch_[a-f0-9]{20}$/.test(batchId)))
    || !csrfSecret
    || !/^[a-f0-9]{64}$/.test(csrfSecret)
    || !Number.isInteger(port)
    || port < 1
    || port > 65_535
  ) {
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
    astroServerEntryPath: path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../apps/reviewer-ui/dist/server/entry.mjs",
    ),
  };
}

export async function startEvidenceReviewUiHttpServer(
  environment: NodeJS.ProcessEnv = process.env,
): Promise<Server> {
  const runtime = evidenceReviewUiHttpRuntime(environment);
  process.env.ASTRO_NODE_AUTOSTART = "disabled";
  const astro = await import(pathToFileURL(runtime.astroServerEntryPath).href) as AstroServerModule;
  if (typeof astro.handler !== "function") {
    throw new Error("Built Local Evidence Review UI server handler is unavailable.");
  }
  const server = http.createServer(createGuardedRequestListener(runtime, astro.handler));
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(runtime.port, runtime.host, () => {
      server.off("error", reject);
      resolve();
    });
  });
  return server;
}

function createGuardedRequestListener(
  runtime: EvidenceReviewUiHttpRuntime,
  astroHandler: RequestListener,
): RequestListener {
  return (request, response) => {
    void handleGuardedRequest(runtime, astroHandler, request, response).catch(() => {
      if (!response.headersSent) {
        rejectRequest(response, 400, "The review submission could not be validated safely.");
      } else if (!response.writableEnded) {
        response.end();
      }
    });
  };
}

async function handleGuardedRequest(
  runtime: EvidenceReviewUiHttpRuntime,
  astroHandler: RequestListener,
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const hostRejection = validateRequestHost(request, runtime.authority);
  if (hostRejection) {
    rejectRequest(response, hostRejection.status, hostRejection.message);
    return;
  }
  if (isSafeMethod(request.method)) {
    astroHandler(request, response);
    return;
  }
  if (runtime.readOnly) {
    rejectReadOnlyRequest(response);
    return;
  }
  const origin = request.headers.origin;
  if (origin === runtime.origin) {
    astroHandler(request, response);
    return;
  }
  if (origin === undefined) {
    rejectRequest(response, 403, "A request Origin is required for review submissions.");
    return;
  }
  if (origin !== "null") {
    rejectRequest(response, 403, "Cross-site request origin is forbidden.");
    return;
  }
  if (runtime.mode !== "review") {
    rejectRequest(response, 403, "Null-origin product actions are forbidden.");
    return;
  }
  const nullOriginRejection = await prepareNullOriginSubmission(request, runtime);
  if (nullOriginRejection) {
    rejectRequest(response, nullOriginRejection.status, nullOriginRejection.message);
    return;
  }
  astroHandler(request, response);
}

async function prepareNullOriginSubmission(
  request: IncomingMessage,
  runtime: EvidenceReviewUiHttpRuntime,
): Promise<{ status: number; message: string } | undefined> {
  if (request.method !== "POST") {
    return { status: 403, message: "Null-origin review requests must use POST form navigation." };
  }
  if (!isEvidenceReviewUiLoopbackAddress(request.socket.remoteAddress)) {
    return { status: 403, message: "Null-origin review requests must come from the loopback interface." };
  }
  const fetchSite = request.headers["sec-fetch-site"];
  if (fetchSite !== "same-origin" && fetchSite !== "none") {
    return { status: 403, message: "Null-origin review requests require same-origin fetch metadata." };
  }
  if (request.headers["sec-fetch-mode"] !== "navigate" || request.headers["sec-fetch-dest"] !== "document") {
    return { status: 403, message: "Null-origin review requests must be document form navigation." };
  }
  if (!isFormUrlEncoded(request.headers["content-type"])) {
    return { status: 415, message: "Null-origin review requests require URL-encoded form content." };
  }
  const route = parseLockedClaimRoute(request.url, runtime.origin);
  if (
    !route
    || route.batchId !== runtime.batchId
    || !runtime.claimIds.has(route.claimId)
  ) {
    return { status: 403, message: "Null-origin review request target is outside the locked batch context." };
  }
  const body = await readRequestBody(request, MAX_FORM_BODY_BYTES);
  const fields = new URLSearchParams(new TextDecoder("utf-8", { fatal: true }).decode(body));
  const submittedTokens = fields.getAll("csrfToken");
  const expectedToken = evidenceReviewUiClaimCsrfToken(
    runtime.csrfSecret,
    route.batchId,
    route.claimId,
  );
  if (
    submittedTokens.length !== 1
    || !evidenceReviewUiCsrfTokenMatches(submittedTokens[0], expectedToken)
  ) {
    return { status: 403, message: "Null-origin review request CSRF verification failed." };
  }

  (request as BufferedIncomingMessage).body = body;
  request.headers.origin = runtime.origin;
  return undefined;
}

function validateRequestHost(
  request: IncomingMessage,
  expectedAuthority: string,
): { status: number; message: string } | undefined {
  if (
    request.headers["x-forwarded-host"] !== undefined
    || request.headers["x-forwarded-proto"] !== undefined
    || request.headers["x-forwarded-port"] !== undefined
  ) {
    return { status: 400, message: "Forwarded host headers are not accepted by the local UI." };
  }
  const host = request.headers.host;
  if (!host) {
    return { status: 400, message: "A valid Host header is required." };
  }
  let authority: string;
  try {
    const parsed = new URL(`http://${host}`);
    if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
      return { status: 400, message: "The Host header is invalid." };
    }
    authority = parsed.host;
  } catch {
    return { status: 400, message: "The Host header is invalid." };
  }
  if (authority !== expectedAuthority) {
    return { status: 421, message: "The request Host does not match the selected local UI origin." };
  }
  return undefined;
}

function isSafeMethod(method: string | undefined): boolean {
  return method === "GET" || method === "HEAD" || method === "OPTIONS";
}

function parseClaimIds(value: string | undefined): ReadonlySet<string> {
  if (!value) throw new Error("Local Evidence Review UI claim context is missing.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("Local Evidence Review UI claim context is invalid.");
  }
  if (
    !Array.isArray(parsed)
    || parsed.length === 0
    || parsed.some((claimId) => typeof claimId !== "string" || !/^claim_[A-Za-z0-9_-]+$/.test(claimId))
    || new Set(parsed).size !== parsed.length
  ) {
    throw new Error("Local Evidence Review UI claim context is invalid.");
  }
  return new Set(parsed);
}

export function isEvidenceReviewUiLoopbackAddress(address: string | undefined): boolean {
  return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}

function isFormUrlEncoded(contentType: string | undefined): boolean {
  return contentType?.split(";", 1)[0]?.trim().toLowerCase()
    === "application/x-www-form-urlencoded";
}

function parseLockedClaimRoute(
  requestUrl: string | undefined,
  expectedOrigin: string,
): { batchId: string; claimId: string } | undefined {
  if (!requestUrl) return undefined;
  let pathname: string;
  try {
    pathname = new URL(requestUrl, expectedOrigin).pathname;
  } catch {
    return undefined;
  }
  const match = CLAIM_ROUTE_PATTERN.exec(pathname);
  return match ? { batchId: match[1]!, claimId: match[2]! } : undefined;
}

async function readRequestBody(request: IncomingMessage, limit: number): Promise<Buffer> {
  const contentLength = Number(request.headers["content-length"]);
  if (Number.isFinite(contentLength) && contentLength > limit) {
    throw new Error("Review submission exceeds the local form body limit.");
  }
  const chunks: Buffer[] = [];
  let received = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    received += buffer.byteLength;
    if (received > limit) {
      throw new Error("Review submission exceeds the local form body limit.");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

function rejectReadOnlyRequest(response: ServerResponse): void {
  const body = Buffer.from("Review submissions are disabled in read-only mode.", "utf8");
  response.writeHead(405, {
    Allow: "GET",
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": String(body.byteLength),
    "Cache-Control": "no-store",
  });
  response.end(body);
}

function rejectRequest(response: ServerResponse, status: number, message: string): void {
  const body = Buffer.from(message, "utf8");
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": String(body.byteLength),
    "Cache-Control": "no-store",
  });
  response.end(body);
}

async function main(): Promise<void> {
  const runtime = evidenceReviewUiHttpRuntime();
  const server = await startEvidenceReviewUiHttpServer();
  if (process.env.ASTRO_NODE_LOGGING !== "disabled") {
    process.stdout.write(`Server listening on ${runtime.origin}\n`);
  }
  let closing = false;
  const close = () => {
    if (closing) return;
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
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown local UI server error.";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
