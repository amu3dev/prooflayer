export declare const PRODUCT_FIXTURE_TIME = "2026-07-30T10:00:00.000Z";
export declare function createProductShellFixture(options?: {
    runJob?: boolean;
}): Promise<{
    workspace: string;
    source: {
        path: string;
        type: "unknown" | "markdown" | "cv" | "linkedin_export" | "github_summary" | "project_note" | "recommendation" | "certificate" | "pdf" | "docx" | "json" | "csv" | "job_description";
        status: "active" | "ignored" | "needs_review";
        id: string;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        importedAt: string;
        hash: string;
        title?: string | undefined;
        extractedTextPath?: string | undefined;
    };
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
    profile: {
        updatedAt: string;
        id: string;
        domains: string[];
        positioningCandidates: string[];
        summaryThemes: string[];
        roles: {
            evidenceIds: string[];
            title?: string | undefined;
            company?: string | undefined;
            dateRange?: string | undefined;
        }[];
        projects: {
            name: string;
            evidenceIds: string[];
            technologies?: string[] | undefined;
            domains?: string[] | undefined;
        }[];
        skills: {
            name: string;
            evidenceIds: string[];
        }[];
        approvedClaims: string[];
        claimsNeedingConfirmation: string[];
        blockedClaims: string[];
        resumeReadyClaims: string[];
        genericOnlyClaims: string[];
        internalOnlyClaims: string[];
        publicSafetyRules: string[];
    };
    jobTargetId: string;
}>;
