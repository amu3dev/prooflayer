import { createHmac, timingSafeEqual } from "node:crypto";

const CSRF_CONTEXT = "prooflayer-evidence-review-csrf-v1";
const PRODUCT_CSRF_CONTEXT = "prooflayer-product-action-csrf-v1";
const BATCH_ID_PATTERN = /^evidence-review-batch_[a-f0-9]{20}$/;
const CLAIM_ID_PATTERN = /^claim_[A-Za-z0-9_-]+$/;

export function evidenceReviewUiClaimCsrfToken(
  sessionSecret: string,
  batchId: string,
  claimId: string,
): string {
  assertSessionSecret(sessionSecret);
  if (!BATCH_ID_PATTERN.test(batchId)) {
    throw new Error("Evidence Review UI CSRF batch identity is invalid.");
  }
  if (!CLAIM_ID_PATTERN.test(claimId)) {
    throw new Error("Evidence Review UI CSRF claim identity is invalid.");
  }
  return createHmac("sha256", sessionSecret)
    .update(`${CSRF_CONTEXT}\0${batchId}\0${claimId}`, "utf8")
    .digest("hex");
}

export function proofLayerUiActionCsrfToken(
  sessionSecret: string,
  actionPath: string,
): string {
  assertSessionSecret(sessionSecret);
  if (!actionPath.startsWith("/") || actionPath.includes("\\") || actionPath.includes("..")) {
    throw new Error("ProofLayer UI CSRF action path is invalid.");
  }
  return createHmac("sha256", sessionSecret)
    .update(`${PRODUCT_CSRF_CONTEXT}\0${actionPath}`, "utf8")
    .digest("hex");
}

export function evidenceReviewUiCsrfTokenMatches(
  actual: string | undefined,
  expected: string,
): boolean {
  if (!actual || !/^[a-f0-9]{64}$/.test(actual) || !/^[a-f0-9]{64}$/.test(expected)) {
    return false;
  }
  return timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

function assertSessionSecret(sessionSecret: string): void {
  if (!/^[a-f0-9]{64}$/.test(sessionSecret)) {
    throw new Error("Evidence Review UI CSRF session secret is invalid.");
  }
}
