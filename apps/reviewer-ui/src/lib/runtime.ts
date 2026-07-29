export interface EvidenceReviewUiRuntimeConfig {
  workspace: string;
  batchId: string;
  readOnly: boolean;
  csrfToken: string;
}

export function evidenceReviewUiRuntimeConfig(): EvidenceReviewUiRuntimeConfig {
  const workspace = process.env.PROOFLAYER_UI_WORKSPACE;
  const batchId = process.env.PROOFLAYER_UI_BATCH_ID;
  const csrfToken = process.env.PROOFLAYER_UI_CSRF_TOKEN;
  if (!workspace || !batchId || !csrfToken) {
    throw new Error("Local Evidence Review UI runtime is not configured.");
  }
  if (!/^evidence-review-batch_[a-f0-9]{20}$/.test(batchId)) {
    throw new Error("Local Evidence Review UI batch identity is invalid.");
  }
  return {
    workspace,
    batchId,
    readOnly: process.env.PROOFLAYER_UI_READ_ONLY === "1",
    csrfToken,
  };
}

export function isSameOriginSubmission(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function formRecord(formData: FormData): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") result[key] = value;
  }
  return result;
}
