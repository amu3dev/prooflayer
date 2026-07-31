import { type ProductWorkflowActionName, type ProductWorkflowRoutePath } from "./prooflayer-ui-request-scope.js";
export interface ProductWorkflowCsrfClaims {
    actionName: ProductWorkflowActionName;
    routePath: ProductWorkflowRoutePath;
    targetId?: string;
}
export declare function evidenceReviewUiClaimCsrfToken(sessionSecret: string, batchId: string, claimId: string): string;
export declare function proofLayerUiActionCsrfToken(sessionSecret: string, claims: ProductWorkflowCsrfClaims): string;
export declare function evidenceReviewUiCsrfTokenMatches(actual: string | undefined, expected: string): boolean;
