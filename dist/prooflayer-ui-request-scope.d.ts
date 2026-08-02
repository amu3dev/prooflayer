export declare const EVIDENCE_REVIEW_SUBMIT_ACTION: "submit-claim-review";
export declare const PRODUCT_WORKFLOW_ACTIONS: {
    readonly startRoleWorkflow: "start-role-workflow";
    readonly confirmRoleDirection: "confirm-role-direction";
    readonly editRoleDirection: "edit-role-direction";
    readonly flagRoleDirection: "flag-role-direction";
    readonly continueRoleWorkflow: "continue-role-workflow";
    readonly reviewRoleDraftDecision: "review-role-draft-decision";
    readonly completeRoleDraftReview: "complete-role-draft-review";
    readonly approveRoleDraft: "approve-role-draft";
    readonly exportRoleResume: "export-role-resume";
    readonly createJobTarget: "create-job-target";
    readonly continueJobWorkflow: "continue-job-workflow";
    readonly updateCareerSource: "update-career-source";
    readonly processCareerUpdates: "process-career-updates";
};
export type ProductWorkflowActionName = typeof PRODUCT_WORKFLOW_ACTIONS[keyof typeof PRODUCT_WORKFLOW_ACTIONS];
export type ProofLayerUiRequestScope = {
    scope: "read-only";
    routePath: string;
} | {
    scope: "evidence-review";
    routePath: string;
    actionName: typeof EVIDENCE_REVIEW_SUBMIT_ACTION;
    batchId: string;
    claimId: string;
} | {
    scope: "product-workflow";
    routePath: ProductWorkflowRoutePath;
    allowedActions: readonly ProductWorkflowActionName[];
} | {
    scope: "unregistered";
    routePath: string;
};
export type ProductWorkflowRoutePath = keyof typeof PRODUCT_WORKFLOW_ROUTE_ACTIONS;
declare const PRODUCT_WORKFLOW_ROUTE_ACTIONS: {
    readonly "/resume/role": readonly ["start-role-workflow", "confirm-role-direction", "edit-role-direction", "flag-role-direction", "continue-role-workflow", "export-role-resume"];
    readonly "/resume/role/review": readonly ["review-role-draft-decision", "complete-role-draft-review", "approve-role-draft"];
    readonly "/resume/job": readonly ["create-job-target", "continue-job-workflow"];
    readonly "/career/update": readonly ["update-career-source", "process-career-updates"];
};
export declare function resolveProofLayerUiRequestScope(method: string | undefined, requestUrl: string | undefined, expectedOrigin: string): ProofLayerUiRequestScope;
export declare function productWorkflowActionAllowed(routePath: string, actionName: string | undefined): actionName is ProductWorkflowActionName;
export declare function productWorkflowActionRequiresTarget(actionName: ProductWorkflowActionName): boolean;
export declare function isSafeMethod(method: string | undefined): boolean;
export {};
