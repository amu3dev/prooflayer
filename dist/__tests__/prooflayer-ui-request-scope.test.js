import { describe, expect, it } from "vitest";
import { evidenceReviewUiClaimCsrfToken, evidenceReviewUiCsrfTokenMatches, proofLayerUiActionCsrfToken, } from "../evidence-review-ui-csrf.js";
import { EVIDENCE_REVIEW_SUBMIT_ACTION, PRODUCT_WORKFLOW_ACTIONS, resolveProofLayerUiRequestScope, } from "../prooflayer-ui-request-scope.js";
const ORIGIN = "http://127.0.0.1:4321";
const SECRET = "c".repeat(64);
const BATCH_ID = "evidence-review-batch_00000000000000000000";
const CLAIM_ID = "claim_scope_test";
describe("ProofLayer local UI request scopes", () => {
    it("resolves exact writable routes without a review fallback", () => {
        expect(resolveProofLayerUiRequestScope("POST", `/review/${BATCH_ID}/claim/${CLAIM_ID}`, ORIGIN)).toMatchObject({
            scope: "evidence-review",
            actionName: EVIDENCE_REVIEW_SUBMIT_ACTION,
            batchId: BATCH_ID,
            claimId: CLAIM_ID,
        });
        expect(resolveProofLayerUiRequestScope("POST", "/resume/role", ORIGIN))
            .toMatchObject({ scope: "product-workflow", routePath: "/resume/role" });
        expect(resolveProofLayerUiRequestScope("POST", "/resume/job", ORIGIN))
            .toMatchObject({ scope: "product-workflow", routePath: "/resume/job" });
        expect(resolveProofLayerUiRequestScope("POST", "/career/update", ORIGIN))
            .toMatchObject({ scope: "product-workflow", routePath: "/career/update" });
        expect(resolveProofLayerUiRequestScope("POST", "/clarifications", ORIGIN))
            .toEqual({ scope: "unregistered", routePath: "/clarifications" });
        expect(resolveProofLayerUiRequestScope("POST", "/review/not-a-batch/claim/not-a-claim", ORIGIN))
            .toEqual({ scope: "unregistered", routePath: "/review/not-a-batch/claim/not-a-claim" });
        expect(resolveProofLayerUiRequestScope("GET", "/resume/role", ORIGIN))
            .toEqual({ scope: "read-only", routePath: "/resume/role" });
    });
    it("isolates review and product tokens by scope, action, route, target, and bytes", () => {
        const reviewToken = evidenceReviewUiClaimCsrfToken(SECRET, BATCH_ID, CLAIM_ID);
        const roleToken = proofLayerUiActionCsrfToken(SECRET, {
            actionName: PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow,
            routePath: "/resume/role",
        });
        const jobToken = proofLayerUiActionCsrfToken(SECRET, {
            actionName: PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow,
            routePath: "/resume/job",
            targetId: "job-example-one",
        });
        const otherJobToken = proofLayerUiActionCsrfToken(SECRET, {
            actionName: PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow,
            routePath: "/resume/job",
            targetId: "job-example-two",
        });
        const createJobToken = proofLayerUiActionCsrfToken(SECRET, {
            actionName: PRODUCT_WORKFLOW_ACTIONS.createJobTarget,
            routePath: "/resume/job",
        });
        expect(new Set([reviewToken, roleToken, jobToken, otherJobToken, createJobToken]).size).toBe(5);
        expect(evidenceReviewUiCsrfTokenMatches(reviewToken, roleToken)).toBe(false);
        expect(evidenceReviewUiCsrfTokenMatches(jobToken, otherJobToken)).toBe(false);
        expect(evidenceReviewUiCsrfTokenMatches(jobToken, createJobToken)).toBe(false);
        const tamperedRoleToken = `${roleToken.startsWith("0") ? "1" : "0"}${roleToken.slice(1)}`;
        expect(evidenceReviewUiCsrfTokenMatches(tamperedRoleToken, roleToken)).toBe(false);
        expect(() => proofLayerUiActionCsrfToken(SECRET, {
            actionName: PRODUCT_WORKFLOW_ACTIONS.createJobTarget,
            routePath: "/resume/role",
        })).toThrow(/not registered/);
        expect(() => proofLayerUiActionCsrfToken(SECRET, {
            actionName: PRODUCT_WORKFLOW_ACTIONS.continueJobWorkflow,
            routePath: "/resume/job",
        })).toThrow(/requires a valid target/);
    });
});
