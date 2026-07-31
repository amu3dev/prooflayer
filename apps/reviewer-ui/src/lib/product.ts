import {
  evidenceReviewUiCsrfTokenMatches,
  proofLayerUiActionCsrfToken,
} from "../../../../src/evidence-review-ui-csrf.ts";
import type {
  ProductWorkflowActionName,
  ProductWorkflowRoutePath,
} from "../../../../src/prooflayer-ui-request-scope.ts";
import {
  isSameOriginSubmission,
  type ProofLayerUiRuntimeConfig,
} from "./runtime.js";

export function productActionToken(
  config: ProofLayerUiRuntimeConfig,
  routePath: ProductWorkflowRoutePath,
  actionName: ProductWorkflowActionName,
  targetId?: string,
): string {
  return proofLayerUiActionCsrfToken(config.csrfSecret, {
    routePath,
    actionName,
    ...(targetId ? { targetId } : {}),
  });
}

export function productPostRejection(
  request: Request,
  config: ProofLayerUiRuntimeConfig,
): Response | undefined {
  if (config.readOnly) {
    return new Response("Product actions are disabled in read-only mode.", {
      status: 405,
      headers: { Allow: "GET" },
    });
  }
  if (!isSameOriginSubmission(request, config.origin)) {
    return new Response("The product action origin is not allowed.", { status: 403 });
  }
  return undefined;
}

export function productTokenMatches(
  formData: FormData,
  expected: string,
): boolean {
  const tokens = formData.getAll("csrfToken");
  return tokens.length === 1
    && typeof tokens[0] === "string"
    && evidenceReviewUiCsrfTokenMatches(tokens[0], expected);
}

export function field(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function formatProductDate(value: string | undefined): string {
  if (!value) return "Not available";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
