import { createHmac, timingSafeEqual } from "node:crypto";
import {
  EVIDENCE_REVIEW_SUBMIT_ACTION,
  productWorkflowActionAllowed,
  productWorkflowActionRequiresTarget,
  type ProductWorkflowActionName,
  type ProductWorkflowRoutePath,
} from "./prooflayer-ui-request-scope.js";

const CSRF_CONTEXT = "prooflayer-evidence-review-csrf-v2";
const PRODUCT_CSRF_CONTEXT = "prooflayer-product-action-csrf-v2";
const BATCH_ID_PATTERN = /^evidence-review-batch_[a-f0-9]{20}$/;
const CLAIM_ID_PATTERN = /^claim_[A-Za-z0-9_-]+$/;
const TARGET_ID_PATTERN = /^(?:role|job)-[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ProductWorkflowCsrfClaims {
  actionName: ProductWorkflowActionName;
  routePath: ProductWorkflowRoutePath;
  targetId?: string;
}

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
    .update(`${CSRF_CONTEXT}\0evidence-review\0${EVIDENCE_REVIEW_SUBMIT_ACTION}\0${batchId}\0${claimId}`, "utf8")
    .digest("hex");
}

export function proofLayerUiActionCsrfToken(
  sessionSecret: string,
  claims: ProductWorkflowCsrfClaims,
): string {
  assertSessionSecret(sessionSecret);
  if (!productWorkflowActionAllowed(claims.routePath, claims.actionName)) {
    throw new Error("ProofLayer UI CSRF product action is not registered for this route.");
  }
  const requiresTarget = productWorkflowActionRequiresTarget(claims.actionName);
  if (requiresTarget && (!claims.targetId || !TARGET_ID_PATTERN.test(claims.targetId))) {
    throw new Error("ProofLayer UI CSRF product action requires a valid target identity.");
  }
  if (!requiresTarget && claims.targetId !== undefined) {
    throw new Error("ProofLayer UI CSRF product action does not accept a target identity.");
  }
  return createHmac("sha256", sessionSecret)
    .update([
      PRODUCT_CSRF_CONTEXT,
      "product-workflow",
      claims.actionName,
      claims.routePath,
      claims.targetId ?? "",
    ].join("\0"), "utf8")
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
