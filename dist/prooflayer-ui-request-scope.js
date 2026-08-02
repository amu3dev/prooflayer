export const EVIDENCE_REVIEW_SUBMIT_ACTION = "submit-claim-review";
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
};
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
};
export function resolveProofLayerUiRequestScope(method, requestUrl, expectedOrigin) {
    const routePath = parseRoutePath(requestUrl, expectedOrigin);
    if (!routePath)
        return { scope: "unregistered", routePath: "invalid" };
    if (isSafeMethod(method))
        return { scope: "read-only", routePath };
    if (method !== "POST")
        return { scope: "unregistered", routePath };
    const review = CLAIM_ROUTE_PATTERN.exec(routePath);
    if (review) {
        return {
            scope: "evidence-review",
            routePath,
            actionName: EVIDENCE_REVIEW_SUBMIT_ACTION,
            batchId: review[1],
            claimId: review[2],
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
export function productWorkflowActionAllowed(routePath, actionName) {
    return isProductWorkflowRoute(routePath)
        && typeof actionName === "string"
        && PRODUCT_WORKFLOW_ROUTE_ACTIONS[routePath].some((entry) => entry === actionName);
}
export function productWorkflowActionRequiresTarget(actionName) {
    return actionName === PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow
        || actionName === PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow
        || actionName === PRODUCT_WORKFLOW_ACTIONS.exportRoleResume
        || actionName === PRODUCT_WORKFLOW_ACTIONS.reviewRoleDraftDecision
        || actionName === PRODUCT_WORKFLOW_ACTIONS.completeRoleDraftReview
        || actionName === PRODUCT_WORKFLOW_ACTIONS.approveRoleDraft;
}
export function isSafeMethod(method) {
    return method === "GET" || method === "HEAD" || method === "OPTIONS";
}
function isProductWorkflowRoute(value) {
    return Object.prototype.hasOwnProperty.call(PRODUCT_WORKFLOW_ROUTE_ACTIONS, value);
}
function parseRoutePath(requestUrl, expectedOrigin) {
    if (!requestUrl)
        return undefined;
    try {
        return new URL(requestUrl, expectedOrigin).pathname;
    }
    catch {
        return undefined;
    }
}
