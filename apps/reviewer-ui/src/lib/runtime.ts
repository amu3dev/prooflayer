export interface ProofLayerUiRuntimeConfig {
  workspace: string;
  mode: "product" | "review";
  batchId?: string;
  readOnly: boolean;
  csrfSecret: string;
  origin: string;
}

export interface EvidenceReviewUiRuntimeConfig extends ProofLayerUiRuntimeConfig {
  mode: "review";
  batchId: string;
}

export function proofLayerUiRuntimeConfig(): ProofLayerUiRuntimeConfig {
  const workspace = process.env.PROOFLAYER_UI_WORKSPACE;
  const batchId = process.env.PROOFLAYER_UI_BATCH_ID;
  const csrfSecret = process.env.PROOFLAYER_UI_CSRF_TOKEN;
  const origin = process.env.PROOFLAYER_UI_ORIGIN;
  const mode = process.env.PROOFLAYER_UI_MODE === "product" ? "product" : "review";
  if (!workspace || !csrfSecret || !origin) {
    throw new Error("Local ProofLayer UI runtime is not configured.");
  }
  if (mode === "review" && (!batchId || !/^evidence-review-batch_[a-f0-9]{20}$/.test(batchId))) {
    throw new Error("Local Evidence Review UI batch identity is invalid.");
  }
  return {
    workspace,
    mode,
    ...(batchId ? { batchId } : {}),
    readOnly: process.env.PROOFLAYER_UI_READ_ONLY === "1",
    csrfSecret,
    origin: validateRuntimeOrigin(origin),
  };
}

export function evidenceReviewUiRuntimeConfig(): EvidenceReviewUiRuntimeConfig {
  const config = proofLayerUiRuntimeConfig();
  if (config.mode !== "review" || !config.batchId) {
    throw new Error("Local Evidence Review UI runtime is not locked to a review batch.");
  }
  return { ...config, mode: "review", batchId: config.batchId };
}

export function isSameOriginSubmission(request: Request, expectedOrigin: string): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const expected = new URL(expectedOrigin);
    return origin === expected.origin
      && new URL(request.url).origin === expected.origin
      && new URL(`http://${host}`).host === expected.host;
  } catch {
    return false;
  }
}

function validateRuntimeOrigin(origin: string): string {
  const parsed = new URL(origin);
  if (
    parsed.protocol !== "http:"
    || !["127.0.0.1", "localhost", "[::1]"].includes(parsed.hostname)
    || parsed.origin !== origin
  ) {
    throw new Error("Local Evidence Review UI origin is invalid.");
  }
  return parsed.origin;
}

export function formRecord(formData: FormData): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") result[key] = value;
  }
  return result;
}
