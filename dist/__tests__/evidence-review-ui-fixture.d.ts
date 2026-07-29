import type { Source } from "../schemas.js";
export declare const UI_FIXTURE_TIME = "2026-07-29T10:00:00.000Z";
export declare function createEvidenceReviewUiFixture(options?: {
    visibility?: Source["visibility"];
}): Promise<{
    workspace: string;
    batchId: string;
    targetId: string;
    claims: {
        type: "role_claim" | "skill_claim" | "leadership_claim" | "impact_claim" | "domain_claim" | "project_claim" | "competency_claim" | "certification_claim" | "education_claim" | "responsibility_claim";
        id: string;
        confidence: "high" | "medium" | "low";
        claim: string;
        supportingEvidenceIds: string[];
        extractionConfidence: "high" | "medium" | "low";
        factualConfidence: "high" | "medium" | "low";
        corroborationLevel: "multi_source" | "single_source" | "manual_approved" | "uncorroborated";
        approvalStatus: "approved" | "needs_confirmation" | "blocked";
        outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
        publicSafe: boolean;
        needsConfirmation: boolean;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        dateRange?: string | undefined;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
        sourceSection?: string | undefined;
        approvedWording?: string | undefined;
        unsafeWording?: string[] | undefined;
    }[];
    evidence: {
        id: string;
        category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        sourceIds: string[];
        text: string;
        normalizedSummary: string;
        sensitivityFlags: string[];
        confidence: "high" | "medium" | "low";
        company?: string | undefined;
        project?: string | undefined;
        dateRange?: string | undefined;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
        sourceSection?: string | undefined;
        technologies?: string[] | undefined;
        domains?: string[] | undefined;
    }[];
}>;
export declare function validApprovedFields(overrides?: Record<string, string | undefined>): Record<string, string | undefined>;
