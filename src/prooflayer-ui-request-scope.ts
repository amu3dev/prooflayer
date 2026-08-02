export const EVIDENCE_REVIEW_SUBMIT_ACTION = "submit-claim-review" as const;

export const PRODUCT_WORKFLOW_ACTIONS = {
  startRoleWorkflow: "start-role-workflow",
  continueRoleWorkflow: "continue-role-workflow",
  reviewRoleDraftDecision: "review-role-draft-decision",
  completeRoleDraftReview: "complete-role-draft-review",
  approveRoleDraft: "approve-role-draft",
  exportRoleResume: "export-role-resume",
  createJobTarget: "create-job-target",
  continueJobWorkflow: "continue-job-workflow",
  updateCareerSource: "update-career-source",
  processCareerUpdates: "process-career-updates",
} as const;

export type ProductWorkflowActionName =
  typeof PRODUCT_WORKFLOW_ACTIONS[keyof typeof PRODUCT_WORKFLOW_ACTIONS];

export type ProofLayerUiRequestScope =
  | { scope: "read-only"; routePath: string }
  | {
      scope: "evidence-review";
      routePath: string;
      actionName: typeof EVIDENCE_REVIEW_SUBMIT_ACTION;
      batchId: string;
      claimId: string;
    }
  | {
      scope: "product-workflow";
      routePath: ProductWorkflowRoutePath;
      allowedActions: readonly ProductWorkflowActionName[];
    }
  | { scope: "unregistered"; routePath: string };

export type ProductWorkflowRoutePath = keyof typeof PRODUCT_WORKFLOW_ROUTE_ACTIONS;

const CLAIM_ROUTE_PATTERN = /^\/review\/(evidence-review-batch_[a-f0-9]{20})\/claim\/(claim_[A-Za-z0-9_-]+)\/?$/;
const PRODUCT_WORKFLOW_ROUTE_ACTIONS = {
  "/resume/role": [
    PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
    PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow,
    PRODUCT_WORKFLOW_ACTIONS.exportRoleResume,
  ],
  "/resume/role/review": [
    PRODUCT_WORKFLOW_ACTIONS.reviewRoleDraftDecision,
    PRODUCT_WORKFLOW_ACTIONS.completeRoleDraftReview,
    PRODUCT_WORKFLOW_ACTIONS.approveRoleDraft,
  ],
  "/resume/job": [
    PRODUCT_WORKFLOW_ACTIONS.createJobTarget,
    PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow,
  ],
  "/career/update": [
    PRODUCT_WORKFLOW_ACTIONS.updateCareerSource,
    PRODUCT_WORKFLOW_ACTIONS.processCareerUpdates,
  ],
} as const satisfies Record<string, readonly ProductWorkflowActionName[]>;

export function resolveProofLayerUiRequestScope(
  method: string | undefined,
  requestUrl: string | undefined,
  expectedOrigin: string,
): ProofLayerUiRequestScope {
  const routePath = parseRoutePath(requestUrl, expectedOrigin);
  if (!routePath) return { scope: "unregistered", routePath: "invalid" };
  if (isSafeMethod(method)) return { scope: "read-only", routePath };
  if (method !== "POST") return { scope: "unregistered", routePath };

  const review = CLAIM_ROUTE_PATTERN.exec(routePath);
  if (review) {
    return {
      scope: "evidence-review",
      routePath,
      actionName: EVIDENCE_REVIEW_SUBMIT_ACTION,
      batchId: review[1]!,
      claimId: review[2]!,
    };
  }

  const canonicalPath = routePath.endsWith("/") && routePath !== "/"
    ? routePath.slice(0, -1)
    : routePath;
  if (isProductWorkflowRoute(canonicalPath)) {
    return {
      scope: "product-workflow",
      routePath: canonicalPath,
      allowedActions: PRODUCT_WORKFLOW_ROUTE_ACTIONS[canonicalPath],
    };
  }
  return { scope: "unregistered", routePath };
}

export function productWorkflowActionAllowed(
  routePath: string,
  actionName: string | undefined,
): actionName is ProductWorkflowActionName {
  return isProductWorkflowRoute(routePath)
    && typeof actionName === "string"
    && PRODUCT_WORKFLOW_ROUTE_ACTIONS[routePath].some((entry) => entry === actionName);
}

export function productWorkflowActionRequiresTarget(
  actionName: ProductWorkflowActionName,
): boolean {
  return actionName === PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow
    || actionName === PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow
    || actionName === PRODUCT_WORKFLOW_ACTIONS.exportRoleResume
    || actionName === PRODUCT_WORKFLOW_ACTIONS.reviewRoleDraftDecision
    || actionName === PRODUCT_WORKFLOW_ACTIONS.completeRoleDraftReview
    || actionName === PRODUCT_WORKFLOW_ACTIONS.approveRoleDraft;
}

export function isSafeMethod(method: string | undefined): boolean {
  return method === "GET" || method === "HEAD" || method === "OPTIONS";
}

function isProductWorkflowRoute(value: string): value is ProductWorkflowRoutePath {
  return Object.prototype.hasOwnProperty.call(PRODUCT_WORKFLOW_ROUTE_ACTIONS, value);
}

function parseRoutePath(requestUrl: string | undefined, expectedOrigin: string): string | undefined {
  if (!requestUrl) return undefined;
  try {
    return new URL(requestUrl, expectedOrigin).pathname;
  } catch {
    return undefined;
  }
}
