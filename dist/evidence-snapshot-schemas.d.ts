import { z } from "zod";
export declare const EVIDENCE_SNAPSHOT_SCHEMA_VERSION: 1;
export declare const EVIDENCE_SNAPSHOT_CONTRACT_NAME = "evidence-snapshot";
export declare const EVIDENCE_SNAPSHOT_POLICY_NAME = "evidence-snapshot-policy";
export declare const EVIDENCE_SNAPSHOT_POLICY_VERSION = "2";
export declare const EVIDENCE_SNAPSHOT_SUPPORTED_POLICY_VERSIONS: readonly ["1", "2"];
export declare const EVIDENCE_SNAPSHOT_EXPORTER_NAME = "evidence-snapshot-exporter";
export declare const EVIDENCE_SNAPSHOT_EXPORTER_VERSION = "2";
export declare const EVIDENCE_SNAPSHOT_SUPPORTED_EXPORTER_VERSIONS: readonly ["1", "2"];
export declare const EvidenceSnapshotSha256Schema: z.ZodString;
export declare const EvidenceSnapshotIdSchema: z.ZodString;
export declare const EvidenceSnapshotRelativePathSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const EvidenceSnapshotEligibilityReasonSchema: z.ZodEnum<["claim-unreviewed", "review-not-approved", "review-insufficient-support", "review-scope-not-defensible", "review-not-public-safe", "review-not-resume-ready", "review-role-ineligible", "review-job-ineligible", "review-critical-risk", "claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>;
export declare const EvidenceSnapshotEligibilitySchema: z.ZodObject<{
    roleMatching: z.ZodBoolean;
    jobMapping: z.ZodBoolean;
    reasons: z.ZodArray<z.ZodEnum<["claim-unreviewed", "review-not-approved", "review-insufficient-support", "review-scope-not-defensible", "review-not-public-safe", "review-not-resume-ready", "review-role-ineligible", "review-job-ineligible", "review-critical-risk", "claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
}, "strict", z.ZodTypeAny, {
    reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
    roleMatching: boolean;
    jobMapping: boolean;
}, {
    reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
    roleMatching: boolean;
    jobMapping: boolean;
}>;
export declare const EvidenceSnapshotSourceReferenceSchema: z.ZodObject<{
    sourceId: z.ZodString;
    sourceType: z.ZodString;
    logicalPath: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
    status: z.ZodEnum<["active", "ignored", "needs_review"]>;
    visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    status: "active" | "ignored" | "needs_review";
    sourceType: string;
    sourceId: string;
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    logicalPath: string;
}, {
    sha256: string;
    status: "active" | "ignored" | "needs_review";
    sourceType: string;
    sourceId: string;
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    logicalPath: string;
}>;
export declare const EvidenceSnapshotEvidenceRecordSchema: z.ZodObject<{
    id: z.ZodString;
    contentSha256: z.ZodString;
    category: z.ZodEnum<["role", "project", "skill", "certification", "recommendation", "education", "domain", "responsibility", "achievement", "tool"]>;
    sourceIds: z.ZodArray<z.ZodString, "many">;
    visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
    sensitivityFlags: z.ZodArray<z.ZodString, "many">;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    supportingClaimIds: z.ZodArray<z.ZodString, "many">;
    eligibility: z.ZodObject<{
        roleMatching: z.ZodBoolean;
        jobMapping: z.ZodBoolean;
        reasons: z.ZodArray<z.ZodEnum<["claim-unreviewed", "review-not-approved", "review-insufficient-support", "review-scope-not-defensible", "review-not-public-safe", "review-not-resume-ready", "review-role-ineligible", "review-job-ineligible", "review-critical-risk", "claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
    }, "strict", z.ZodTypeAny, {
        reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    }, {
        reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    }>;
    sources: z.ZodArray<z.ZodObject<{
        sourceId: z.ZodString;
        sourceType: z.ZodString;
        logicalPath: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        status: z.ZodEnum<["active", "ignored", "needs_review"]>;
        visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        status: "active" | "ignored" | "needs_review";
        sourceType: string;
        sourceId: string;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        logicalPath: string;
    }, {
        sha256: string;
        status: "active" | "ignored" | "needs_review";
        sourceType: string;
        sourceId: string;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        logicalPath: string;
    }>, "many">;
    content: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        sourceIds: z.ZodArray<z.ZodString, "many">;
        category: z.ZodEnum<["role", "project", "skill", "certification", "recommendation", "education", "domain", "responsibility", "achievement", "tool"]>;
        text: z.ZodString;
        normalizedSummary: z.ZodString;
        dateRange: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        project: z.ZodOptional<z.ZodString>;
        parentRoleId: z.ZodOptional<z.ZodString>;
        parentProjectId: z.ZodOptional<z.ZodString>;
        sourceSection: z.ZodOptional<z.ZodString>;
        technologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        domains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
        sensitivityFlags: z.ZodArray<z.ZodString, "many">;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>>;
}, "strict", z.ZodTypeAny, {
    id: string;
    category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    supportingClaimIds: string[];
    sources: {
        sha256: string;
        status: "active" | "ignored" | "needs_review";
        sourceType: string;
        sourceId: string;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        logicalPath: string;
    }[];
    sourceIds: string[];
    sensitivityFlags: string[];
    confidence: "high" | "medium" | "low";
    contentSha256: string;
    eligibility: {
        reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    };
    content?: {
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
    } | undefined;
}, {
    id: string;
    category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
    visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
    supportingClaimIds: string[];
    sources: {
        sha256: string;
        status: "active" | "ignored" | "needs_review";
        sourceType: string;
        sourceId: string;
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        logicalPath: string;
    }[];
    sourceIds: string[];
    sensitivityFlags: string[];
    confidence: "high" | "medium" | "low";
    contentSha256: string;
    eligibility: {
        reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    };
    content?: {
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
    } | undefined;
}>;
export declare const EvidenceSnapshotClaimRecordSchema: z.ZodObject<{
    id: z.ZodString;
    contentSha256: z.ZodString;
    sourceContentSha256: z.ZodOptional<z.ZodString>;
    supportingEvidenceIds: z.ZodArray<z.ZodString, "many">;
    approvalStatus: z.ZodEnum<["approved", "needs_confirmation", "blocked"]>;
    outputReadiness: z.ZodEnum<["resume_ready", "generic_only", "internal_only", "do_not_use"]>;
    publicSafe: z.ZodBoolean;
    needsConfirmation: z.ZodBoolean;
    metricStatus: z.ZodEnum<["verified_metric", "structural_metric", "no_metric", "needs_metric"]>;
    factualConfidence: z.ZodEnum<["high", "medium", "low"]>;
    eligibility: z.ZodObject<{
        roleMatching: z.ZodBoolean;
        jobMapping: z.ZodBoolean;
        reasons: z.ZodArray<z.ZodEnum<["claim-unreviewed", "review-not-approved", "review-insufficient-support", "review-scope-not-defensible", "review-not-public-safe", "review-not-resume-ready", "review-role-ineligible", "review-job-ineligible", "review-critical-risk", "claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
    }, "strict", z.ZodTypeAny, {
        reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    }, {
        reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    }>;
    sourceState: z.ZodOptional<z.ZodObject<{
        approvalStatus: z.ZodEnum<["approved", "needs_confirmation", "blocked"]>;
        outputReadiness: z.ZodEnum<["resume_ready", "generic_only", "internal_only", "do_not_use"]>;
        publicSafe: z.ZodBoolean;
        needsConfirmation: z.ZodBoolean;
        metricStatus: z.ZodEnum<["verified_metric", "structural_metric", "no_metric", "needs_metric"]>;
    }, "strict", z.ZodTypeAny, {
        approvalStatus: "approved" | "needs_confirmation" | "blocked";
        outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
        publicSafe: boolean;
        needsConfirmation: boolean;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
    }, {
        approvalStatus: "approved" | "needs_confirmation" | "blocked";
        outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
        publicSafe: boolean;
        needsConfirmation: boolean;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
    }>>;
    review: z.ZodOptional<z.ZodObject<{
        reviewId: z.ZodString;
        reviewSha256: z.ZodString;
        decision: z.ZodEnum<["approved", "approved-with-qualifier", "needs-edit", "rejected", "insufficient-proof", "deferred"]>;
        approvedProjectionId: z.ZodOptional<z.ZodString>;
        approvedTextSha256: z.ZodOptional<z.ZodString>;
        publicSafety: z.ZodEnum<["public-safe", "private", "restricted", "indeterminate"]>;
        resumeReadiness: z.ZodEnum<["resume-ready", "not-resume-ready", "needs-edit", "indeterminate"]>;
        eligibleForRoleMatching: z.ZodBoolean;
        eligibleForJobMapping: z.ZodBoolean;
        metricState: z.ZodEnum<["verified", "unverified", "contradicted", "not-a-metric", "indeterminate"]>;
        requiredQualifiers: z.ZodArray<z.ZodString, "many">;
        workContext: z.ZodEnum<["employment", "project", "education", "certification", "skill", "other", "ambiguous"]>;
        claimNature: z.ZodEnum<["responsibility", "achievement", "capability", "credential", "other", "ambiguous"]>;
    }, "strict", z.ZodTypeAny, {
        decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
        reviewSha256: string;
        requiredQualifiers: string[];
        publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
        resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
        eligibleForRoleMatching: boolean;
        eligibleForJobMapping: boolean;
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
        reviewId: string;
        metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        approvedProjectionId?: string | undefined;
        approvedTextSha256?: string | undefined;
    }, {
        decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
        reviewSha256: string;
        requiredQualifiers: string[];
        publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
        resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
        eligibleForRoleMatching: boolean;
        eligibleForJobMapping: boolean;
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
        reviewId: string;
        metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        approvedProjectionId?: string | undefined;
        approvedTextSha256?: string | undefined;
    }>>;
    content: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        claim: z.ZodString;
        type: z.ZodEnum<["role_claim", "skill_claim", "leadership_claim", "impact_claim", "domain_claim", "project_claim", "competency_claim", "certification_claim", "education_claim", "responsibility_claim"]>;
        supportingEvidenceIds: z.ZodArray<z.ZodString, "many">;
        parentRoleId: z.ZodOptional<z.ZodString>;
        parentProjectId: z.ZodOptional<z.ZodString>;
        sourceSection: z.ZodOptional<z.ZodString>;
        dateRange: z.ZodOptional<z.ZodString>;
        extractionConfidence: z.ZodEnum<["high", "medium", "low"]>;
        factualConfidence: z.ZodEnum<["high", "medium", "low"]>;
        corroborationLevel: z.ZodEnum<["multi_source", "single_source", "manual_approved", "uncorroborated"]>;
        approvalStatus: z.ZodEnum<["approved", "needs_confirmation", "blocked"]>;
        outputReadiness: z.ZodEnum<["resume_ready", "generic_only", "internal_only", "do_not_use"]>;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        publicSafe: z.ZodBoolean;
        needsConfirmation: z.ZodBoolean;
        metricStatus: z.ZodEnum<["verified_metric", "structural_metric", "no_metric", "needs_metric"]>;
        approvedWording: z.ZodOptional<z.ZodString>;
        unsafeWording: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>>;
}, "strict", z.ZodTypeAny, {
    id: string;
    supportingEvidenceIds: string[];
    factualConfidence: "high" | "medium" | "low";
    approvalStatus: "approved" | "needs_confirmation" | "blocked";
    outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
    publicSafe: boolean;
    needsConfirmation: boolean;
    metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
    contentSha256: string;
    eligibility: {
        reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    };
    content?: {
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
    } | undefined;
    review?: {
        decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
        reviewSha256: string;
        requiredQualifiers: string[];
        publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
        resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
        eligibleForRoleMatching: boolean;
        eligibleForJobMapping: boolean;
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
        reviewId: string;
        metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        approvedProjectionId?: string | undefined;
        approvedTextSha256?: string | undefined;
    } | undefined;
    sourceContentSha256?: string | undefined;
    sourceState?: {
        approvalStatus: "approved" | "needs_confirmation" | "blocked";
        outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
        publicSafe: boolean;
        needsConfirmation: boolean;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
    } | undefined;
}, {
    id: string;
    supportingEvidenceIds: string[];
    factualConfidence: "high" | "medium" | "low";
    approvalStatus: "approved" | "needs_confirmation" | "blocked";
    outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
    publicSafe: boolean;
    needsConfirmation: boolean;
    metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
    contentSha256: string;
    eligibility: {
        reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    };
    content?: {
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
    } | undefined;
    review?: {
        decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
        reviewSha256: string;
        requiredQualifiers: string[];
        publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
        resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
        eligibleForRoleMatching: boolean;
        eligibleForJobMapping: boolean;
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
        reviewId: string;
        metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        approvedProjectionId?: string | undefined;
        approvedTextSha256?: string | undefined;
    } | undefined;
    sourceContentSha256?: string | undefined;
    sourceState?: {
        approvalStatus: "approved" | "needs_confirmation" | "blocked";
        outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
        publicSafe: boolean;
        needsConfirmation: boolean;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
    } | undefined;
}>;
export declare const EvidenceSnapshotVerifiedMetricSchema: z.ZodObject<{
    id: z.ZodString;
    claimId: z.ZodString;
    evidenceIds: z.ZodArray<z.ZodString, "many">;
    exactText: z.ZodString;
    textSha256: z.ZodString;
    scope: z.ZodObject<{
        parentRoleId: z.ZodOptional<z.ZodString>;
        parentProjectId: z.ZodOptional<z.ZodString>;
        dateRange: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        dateRange?: string | undefined;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    }, {
        dateRange?: string | undefined;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    }>;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    id: string;
    evidenceIds: string[];
    scope: {
        dateRange?: string | undefined;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    };
    exactText: string;
    textSha256: string;
}, {
    claimId: string;
    id: string;
    evidenceIds: string[];
    scope: {
        dateRange?: string | undefined;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    };
    exactText: string;
    textSha256: string;
}>;
export declare const EvidenceSnapshotWarningSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodEnum<["ZERO_ELIGIBLE_JOB_EVIDENCE", "ZERO_ELIGIBLE_ROLE_EVIDENCE", "INELIGIBLE_CONTENT_REDACTED", "VERIFIED_METRIC_CONTENT_REDACTED"]>;
    message: z.ZodString;
    recordIds: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    code: "ZERO_ELIGIBLE_JOB_EVIDENCE" | "ZERO_ELIGIBLE_ROLE_EVIDENCE" | "INELIGIBLE_CONTENT_REDACTED" | "VERIFIED_METRIC_CONTENT_REDACTED";
    message: string;
    id: string;
    recordIds: string[];
}, {
    code: "ZERO_ELIGIBLE_JOB_EVIDENCE" | "ZERO_ELIGIBLE_ROLE_EVIDENCE" | "INELIGIBLE_CONTENT_REDACTED" | "VERIFIED_METRIC_CONTENT_REDACTED";
    message: string;
    id: string;
    recordIds: string[];
}>;
export declare const EvidenceSnapshotSourceArtifactSchema: z.ZodObject<{
    id: z.ZodEnum<["sources", "evidence-items", "claims"]>;
    path: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    path: string;
    id: "sources" | "claims" | "evidence-items";
}, {
    sha256: string;
    path: string;
    id: "sources" | "claims" | "evidence-items";
}>;
export declare const EvidenceFoundationSnapshotSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    contract: z.ZodObject<{
        name: z.ZodLiteral<"evidence-snapshot">;
        version: z.ZodLiteral<"1">;
    }, "strict", z.ZodTypeAny, {
        name: "evidence-snapshot";
        version: "1";
    }, {
        name: "evidence-snapshot";
        version: "1";
    }>;
    policy: z.ZodObject<{
        name: z.ZodLiteral<"evidence-snapshot-policy">;
        version: z.ZodEnum<["1", "2"]>;
    }, "strict", z.ZodTypeAny, {
        name: "evidence-snapshot-policy";
        version: "1" | "2";
    }, {
        name: "evidence-snapshot-policy";
        version: "1" | "2";
    }>;
    producer: z.ZodObject<{
        name: z.ZodLiteral<"evidence-snapshot-exporter">;
        version: z.ZodEnum<["1", "2"]>;
        mode: z.ZodLiteral<"deterministic">;
    }, "strict", z.ZodTypeAny, {
        name: "evidence-snapshot-exporter";
        version: "1" | "2";
        mode: "deterministic";
    }, {
        name: "evidence-snapshot-exporter";
        version: "1" | "2";
        mode: "deterministic";
    }>;
    sourceFoundation: z.ZodObject<{
        id: z.ZodLiteral<"prooflayer-reviewed-evidence-foundation">;
        inventorySha256: z.ZodString;
        reviewInventorySha256: z.ZodOptional<z.ZodString>;
        artifacts: z.ZodArray<z.ZodObject<{
            id: z.ZodEnum<["sources", "evidence-items", "claims"]>;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            id: "sources" | "claims" | "evidence-items";
        }, {
            sha256: string;
            path: string;
            id: "sources" | "claims" | "evidence-items";
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: "prooflayer-reviewed-evidence-foundation";
        inventorySha256: string;
        artifacts: {
            sha256: string;
            path: string;
            id: "sources" | "claims" | "evidence-items";
        }[];
        reviewInventorySha256?: string | undefined;
    }, {
        id: "prooflayer-reviewed-evidence-foundation";
        inventorySha256: string;
        artifacts: {
            sha256: string;
            path: string;
            id: "sources" | "claims" | "evidence-items";
        }[];
        reviewInventorySha256?: string | undefined;
    }>;
    evidenceItems: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        contentSha256: z.ZodString;
        category: z.ZodEnum<["role", "project", "skill", "certification", "recommendation", "education", "domain", "responsibility", "achievement", "tool"]>;
        sourceIds: z.ZodArray<z.ZodString, "many">;
        visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
        sensitivityFlags: z.ZodArray<z.ZodString, "many">;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        supportingClaimIds: z.ZodArray<z.ZodString, "many">;
        eligibility: z.ZodObject<{
            roleMatching: z.ZodBoolean;
            jobMapping: z.ZodBoolean;
            reasons: z.ZodArray<z.ZodEnum<["claim-unreviewed", "review-not-approved", "review-insufficient-support", "review-scope-not-defensible", "review-not-public-safe", "review-not-resume-ready", "review-role-ineligible", "review-job-ineligible", "review-critical-risk", "claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
        }, "strict", z.ZodTypeAny, {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        }, {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        }>;
        sources: z.ZodArray<z.ZodObject<{
            sourceId: z.ZodString;
            sourceType: z.ZodString;
            logicalPath: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            status: z.ZodEnum<["active", "ignored", "needs_review"]>;
            visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            status: "active" | "ignored" | "needs_review";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            logicalPath: string;
        }, {
            sha256: string;
            status: "active" | "ignored" | "needs_review";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            logicalPath: string;
        }>, "many">;
        content: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            sourceIds: z.ZodArray<z.ZodString, "many">;
            category: z.ZodEnum<["role", "project", "skill", "certification", "recommendation", "education", "domain", "responsibility", "achievement", "tool"]>;
            text: z.ZodString;
            normalizedSummary: z.ZodString;
            dateRange: z.ZodOptional<z.ZodString>;
            company: z.ZodOptional<z.ZodString>;
            project: z.ZodOptional<z.ZodString>;
            parentRoleId: z.ZodOptional<z.ZodString>;
            parentProjectId: z.ZodOptional<z.ZodString>;
            sourceSection: z.ZodOptional<z.ZodString>;
            technologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            domains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            visibility: z.ZodEnum<["public", "private", "generic_only", "do_not_use", "unknown", "sensitive"]>;
            sensitivityFlags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
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
        }>>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            status: "active" | "ignored" | "needs_review";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            logicalPath: string;
        }[];
        sourceIds: string[];
        sensitivityFlags: string[];
        confidence: "high" | "medium" | "low";
        contentSha256: string;
        eligibility: {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        };
        content?: {
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
        } | undefined;
    }, {
        id: string;
        category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            status: "active" | "ignored" | "needs_review";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            logicalPath: string;
        }[];
        sourceIds: string[];
        sensitivityFlags: string[];
        confidence: "high" | "medium" | "low";
        contentSha256: string;
        eligibility: {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        };
        content?: {
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
        } | undefined;
    }>, "many">;
    claims: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        contentSha256: z.ZodString;
        sourceContentSha256: z.ZodOptional<z.ZodString>;
        supportingEvidenceIds: z.ZodArray<z.ZodString, "many">;
        approvalStatus: z.ZodEnum<["approved", "needs_confirmation", "blocked"]>;
        outputReadiness: z.ZodEnum<["resume_ready", "generic_only", "internal_only", "do_not_use"]>;
        publicSafe: z.ZodBoolean;
        needsConfirmation: z.ZodBoolean;
        metricStatus: z.ZodEnum<["verified_metric", "structural_metric", "no_metric", "needs_metric"]>;
        factualConfidence: z.ZodEnum<["high", "medium", "low"]>;
        eligibility: z.ZodObject<{
            roleMatching: z.ZodBoolean;
            jobMapping: z.ZodBoolean;
            reasons: z.ZodArray<z.ZodEnum<["claim-unreviewed", "review-not-approved", "review-insufficient-support", "review-scope-not-defensible", "review-not-public-safe", "review-not-resume-ready", "review-role-ineligible", "review-job-ineligible", "review-critical-risk", "claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
        }, "strict", z.ZodTypeAny, {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        }, {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        }>;
        sourceState: z.ZodOptional<z.ZodObject<{
            approvalStatus: z.ZodEnum<["approved", "needs_confirmation", "blocked"]>;
            outputReadiness: z.ZodEnum<["resume_ready", "generic_only", "internal_only", "do_not_use"]>;
            publicSafe: z.ZodBoolean;
            needsConfirmation: z.ZodBoolean;
            metricStatus: z.ZodEnum<["verified_metric", "structural_metric", "no_metric", "needs_metric"]>;
        }, "strict", z.ZodTypeAny, {
            approvalStatus: "approved" | "needs_confirmation" | "blocked";
            outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
            publicSafe: boolean;
            needsConfirmation: boolean;
            metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        }, {
            approvalStatus: "approved" | "needs_confirmation" | "blocked";
            outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
            publicSafe: boolean;
            needsConfirmation: boolean;
            metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        }>>;
        review: z.ZodOptional<z.ZodObject<{
            reviewId: z.ZodString;
            reviewSha256: z.ZodString;
            decision: z.ZodEnum<["approved", "approved-with-qualifier", "needs-edit", "rejected", "insufficient-proof", "deferred"]>;
            approvedProjectionId: z.ZodOptional<z.ZodString>;
            approvedTextSha256: z.ZodOptional<z.ZodString>;
            publicSafety: z.ZodEnum<["public-safe", "private", "restricted", "indeterminate"]>;
            resumeReadiness: z.ZodEnum<["resume-ready", "not-resume-ready", "needs-edit", "indeterminate"]>;
            eligibleForRoleMatching: z.ZodBoolean;
            eligibleForJobMapping: z.ZodBoolean;
            metricState: z.ZodEnum<["verified", "unverified", "contradicted", "not-a-metric", "indeterminate"]>;
            requiredQualifiers: z.ZodArray<z.ZodString, "many">;
            workContext: z.ZodEnum<["employment", "project", "education", "certification", "skill", "other", "ambiguous"]>;
            claimNature: z.ZodEnum<["responsibility", "achievement", "capability", "credential", "other", "ambiguous"]>;
        }, "strict", z.ZodTypeAny, {
            decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
            reviewSha256: string;
            requiredQualifiers: string[];
            publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
            resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
            eligibleForRoleMatching: boolean;
            eligibleForJobMapping: boolean;
            workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
            claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
            reviewId: string;
            metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
            approvedProjectionId?: string | undefined;
            approvedTextSha256?: string | undefined;
        }, {
            decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
            reviewSha256: string;
            requiredQualifiers: string[];
            publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
            resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
            eligibleForRoleMatching: boolean;
            eligibleForJobMapping: boolean;
            workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
            claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
            reviewId: string;
            metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
            approvedProjectionId?: string | undefined;
            approvedTextSha256?: string | undefined;
        }>>;
        content: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            claim: z.ZodString;
            type: z.ZodEnum<["role_claim", "skill_claim", "leadership_claim", "impact_claim", "domain_claim", "project_claim", "competency_claim", "certification_claim", "education_claim", "responsibility_claim"]>;
            supportingEvidenceIds: z.ZodArray<z.ZodString, "many">;
            parentRoleId: z.ZodOptional<z.ZodString>;
            parentProjectId: z.ZodOptional<z.ZodString>;
            sourceSection: z.ZodOptional<z.ZodString>;
            dateRange: z.ZodOptional<z.ZodString>;
            extractionConfidence: z.ZodEnum<["high", "medium", "low"]>;
            factualConfidence: z.ZodEnum<["high", "medium", "low"]>;
            corroborationLevel: z.ZodEnum<["multi_source", "single_source", "manual_approved", "uncorroborated"]>;
            approvalStatus: z.ZodEnum<["approved", "needs_confirmation", "blocked"]>;
            outputReadiness: z.ZodEnum<["resume_ready", "generic_only", "internal_only", "do_not_use"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            publicSafe: z.ZodBoolean;
            needsConfirmation: z.ZodBoolean;
            metricStatus: z.ZodEnum<["verified_metric", "structural_metric", "no_metric", "needs_metric"]>;
            approvedWording: z.ZodOptional<z.ZodString>;
            unsafeWording: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
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
        }>>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        supportingEvidenceIds: string[];
        factualConfidence: "high" | "medium" | "low";
        approvalStatus: "approved" | "needs_confirmation" | "blocked";
        outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
        publicSafe: boolean;
        needsConfirmation: boolean;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        contentSha256: string;
        eligibility: {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        };
        content?: {
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
        } | undefined;
        review?: {
            decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
            reviewSha256: string;
            requiredQualifiers: string[];
            publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
            resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
            eligibleForRoleMatching: boolean;
            eligibleForJobMapping: boolean;
            workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
            claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
            reviewId: string;
            metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
            approvedProjectionId?: string | undefined;
            approvedTextSha256?: string | undefined;
        } | undefined;
        sourceContentSha256?: string | undefined;
        sourceState?: {
            approvalStatus: "approved" | "needs_confirmation" | "blocked";
            outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
            publicSafe: boolean;
            needsConfirmation: boolean;
            metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        } | undefined;
    }, {
        id: string;
        supportingEvidenceIds: string[];
        factualConfidence: "high" | "medium" | "low";
        approvalStatus: "approved" | "needs_confirmation" | "blocked";
        outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
        publicSafe: boolean;
        needsConfirmation: boolean;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        contentSha256: string;
        eligibility: {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        };
        content?: {
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
        } | undefined;
        review?: {
            decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
            reviewSha256: string;
            requiredQualifiers: string[];
            publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
            resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
            eligibleForRoleMatching: boolean;
            eligibleForJobMapping: boolean;
            workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
            claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
            reviewId: string;
            metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
            approvedProjectionId?: string | undefined;
            approvedTextSha256?: string | undefined;
        } | undefined;
        sourceContentSha256?: string | undefined;
        sourceState?: {
            approvalStatus: "approved" | "needs_confirmation" | "blocked";
            outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
            publicSafe: boolean;
            needsConfirmation: boolean;
            metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        } | undefined;
    }>, "many">;
    verifiedMetrics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        claimId: z.ZodString;
        evidenceIds: z.ZodArray<z.ZodString, "many">;
        exactText: z.ZodString;
        textSha256: z.ZodString;
        scope: z.ZodObject<{
            parentRoleId: z.ZodOptional<z.ZodString>;
            parentProjectId: z.ZodOptional<z.ZodString>;
            dateRange: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        }, {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        claimId: string;
        id: string;
        evidenceIds: string[];
        scope: {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        };
        exactText: string;
        textSha256: string;
    }, {
        claimId: string;
        id: string;
        evidenceIds: string[];
        scope: {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        };
        exactText: string;
        textSha256: string;
    }>, "many">;
    eligibleRoleEvidenceIds: z.ZodArray<z.ZodString, "many">;
    eligibleJobEvidenceIds: z.ZodArray<z.ZodString, "many">;
    eligibleRoleClaimIds: z.ZodArray<z.ZodString, "many">;
    eligibleJobClaimIds: z.ZodArray<z.ZodString, "many">;
    eligibleRoleEvidenceSetSha256: z.ZodString;
    eligibleJobEvidenceSetSha256: z.ZodString;
    completeness: z.ZodObject<{
        status: z.ZodLiteral<"complete">;
        sourceArtifactCount: z.ZodNumber;
        evidenceItemCount: z.ZodNumber;
        claimCount: z.ZodNumber;
        approvedClaimCount: z.ZodNumber;
        reviewedClaimCount: z.ZodOptional<z.ZodNumber>;
        eligibleRoleEvidenceCount: z.ZodNumber;
        eligibleJobEvidenceCount: z.ZodNumber;
        verifiedMetricCount: z.ZodNumber;
        provenanceComplete: z.ZodBoolean;
        eligibilityPreserved: z.ZodBoolean;
    }, "strict", z.ZodTypeAny, {
        status: "complete";
        sourceArtifactCount: number;
        evidenceItemCount: number;
        claimCount: number;
        approvedClaimCount: number;
        eligibleRoleEvidenceCount: number;
        eligibleJobEvidenceCount: number;
        verifiedMetricCount: number;
        provenanceComplete: boolean;
        eligibilityPreserved: boolean;
        reviewedClaimCount?: number | undefined;
    }, {
        status: "complete";
        sourceArtifactCount: number;
        evidenceItemCount: number;
        claimCount: number;
        approvedClaimCount: number;
        eligibleRoleEvidenceCount: number;
        eligibleJobEvidenceCount: number;
        verifiedMetricCount: number;
        provenanceComplete: boolean;
        eligibilityPreserved: boolean;
        reviewedClaimCount?: number | undefined;
    }>;
    warnings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodEnum<["ZERO_ELIGIBLE_JOB_EVIDENCE", "ZERO_ELIGIBLE_ROLE_EVIDENCE", "INELIGIBLE_CONTENT_REDACTED", "VERIFIED_METRIC_CONTENT_REDACTED"]>;
        message: z.ZodString;
        recordIds: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        code: "ZERO_ELIGIBLE_JOB_EVIDENCE" | "ZERO_ELIGIBLE_ROLE_EVIDENCE" | "INELIGIBLE_CONTENT_REDACTED" | "VERIFIED_METRIC_CONTENT_REDACTED";
        message: string;
        id: string;
        recordIds: string[];
    }, {
        code: "ZERO_ELIGIBLE_JOB_EVIDENCE" | "ZERO_ELIGIBLE_ROLE_EVIDENCE" | "INELIGIBLE_CONTENT_REDACTED" | "VERIFIED_METRIC_CONTENT_REDACTED";
        message: string;
        id: string;
        recordIds: string[];
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    id: string;
    warnings: {
        code: "ZERO_ELIGIBLE_JOB_EVIDENCE" | "ZERO_ELIGIBLE_ROLE_EVIDENCE" | "INELIGIBLE_CONTENT_REDACTED" | "VERIFIED_METRIC_CONTENT_REDACTED";
        message: string;
        id: string;
        recordIds: string[];
    }[];
    completeness: {
        status: "complete";
        sourceArtifactCount: number;
        evidenceItemCount: number;
        claimCount: number;
        approvedClaimCount: number;
        eligibleRoleEvidenceCount: number;
        eligibleJobEvidenceCount: number;
        verifiedMetricCount: number;
        provenanceComplete: boolean;
        eligibilityPreserved: boolean;
        reviewedClaimCount?: number | undefined;
    };
    policy: {
        name: "evidence-snapshot-policy";
        version: "1" | "2";
    };
    claims: {
        id: string;
        supportingEvidenceIds: string[];
        factualConfidence: "high" | "medium" | "low";
        approvalStatus: "approved" | "needs_confirmation" | "blocked";
        outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
        publicSafe: boolean;
        needsConfirmation: boolean;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        contentSha256: string;
        eligibility: {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        };
        content?: {
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
        } | undefined;
        review?: {
            decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
            reviewSha256: string;
            requiredQualifiers: string[];
            publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
            resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
            eligibleForRoleMatching: boolean;
            eligibleForJobMapping: boolean;
            workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
            claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
            reviewId: string;
            metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
            approvedProjectionId?: string | undefined;
            approvedTextSha256?: string | undefined;
        } | undefined;
        sourceContentSha256?: string | undefined;
        sourceState?: {
            approvalStatus: "approved" | "needs_confirmation" | "blocked";
            outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
            publicSafe: boolean;
            needsConfirmation: boolean;
            metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        } | undefined;
    }[];
    contract: {
        name: "evidence-snapshot";
        version: "1";
    };
    producer: {
        name: "evidence-snapshot-exporter";
        version: "1" | "2";
        mode: "deterministic";
    };
    sourceFoundation: {
        id: "prooflayer-reviewed-evidence-foundation";
        inventorySha256: string;
        artifacts: {
            sha256: string;
            path: string;
            id: "sources" | "claims" | "evidence-items";
        }[];
        reviewInventorySha256?: string | undefined;
    };
    evidenceItems: {
        id: string;
        category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            status: "active" | "ignored" | "needs_review";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            logicalPath: string;
        }[];
        sourceIds: string[];
        sensitivityFlags: string[];
        confidence: "high" | "medium" | "low";
        contentSha256: string;
        eligibility: {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        };
        content?: {
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
        } | undefined;
    }[];
    verifiedMetrics: {
        claimId: string;
        id: string;
        evidenceIds: string[];
        scope: {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        };
        exactText: string;
        textSha256: string;
    }[];
    eligibleRoleEvidenceIds: string[];
    eligibleJobEvidenceIds: string[];
    eligibleRoleClaimIds: string[];
    eligibleJobClaimIds: string[];
    eligibleRoleEvidenceSetSha256: string;
    eligibleJobEvidenceSetSha256: string;
}, {
    schemaVersion: 1;
    id: string;
    warnings: {
        code: "ZERO_ELIGIBLE_JOB_EVIDENCE" | "ZERO_ELIGIBLE_ROLE_EVIDENCE" | "INELIGIBLE_CONTENT_REDACTED" | "VERIFIED_METRIC_CONTENT_REDACTED";
        message: string;
        id: string;
        recordIds: string[];
    }[];
    completeness: {
        status: "complete";
        sourceArtifactCount: number;
        evidenceItemCount: number;
        claimCount: number;
        approvedClaimCount: number;
        eligibleRoleEvidenceCount: number;
        eligibleJobEvidenceCount: number;
        verifiedMetricCount: number;
        provenanceComplete: boolean;
        eligibilityPreserved: boolean;
        reviewedClaimCount?: number | undefined;
    };
    policy: {
        name: "evidence-snapshot-policy";
        version: "1" | "2";
    };
    claims: {
        id: string;
        supportingEvidenceIds: string[];
        factualConfidence: "high" | "medium" | "low";
        approvalStatus: "approved" | "needs_confirmation" | "blocked";
        outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
        publicSafe: boolean;
        needsConfirmation: boolean;
        metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        contentSha256: string;
        eligibility: {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        };
        content?: {
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
        } | undefined;
        review?: {
            decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
            reviewSha256: string;
            requiredQualifiers: string[];
            publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
            resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
            eligibleForRoleMatching: boolean;
            eligibleForJobMapping: boolean;
            workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
            claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
            reviewId: string;
            metricState: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
            approvedProjectionId?: string | undefined;
            approvedTextSha256?: string | undefined;
        } | undefined;
        sourceContentSha256?: string | undefined;
        sourceState?: {
            approvalStatus: "approved" | "needs_confirmation" | "blocked";
            outputReadiness: "generic_only" | "do_not_use" | "resume_ready" | "internal_only";
            publicSafe: boolean;
            needsConfirmation: boolean;
            metricStatus: "verified_metric" | "structural_metric" | "no_metric" | "needs_metric";
        } | undefined;
    }[];
    contract: {
        name: "evidence-snapshot";
        version: "1";
    };
    producer: {
        name: "evidence-snapshot-exporter";
        version: "1" | "2";
        mode: "deterministic";
    };
    sourceFoundation: {
        id: "prooflayer-reviewed-evidence-foundation";
        inventorySha256: string;
        artifacts: {
            sha256: string;
            path: string;
            id: "sources" | "claims" | "evidence-items";
        }[];
        reviewInventorySha256?: string | undefined;
    };
    evidenceItems: {
        id: string;
        category: "role" | "domain" | "responsibility" | "recommendation" | "project" | "skill" | "certification" | "education" | "achievement" | "tool";
        visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
        supportingClaimIds: string[];
        sources: {
            sha256: string;
            status: "active" | "ignored" | "needs_review";
            sourceType: string;
            sourceId: string;
            visibility: "public" | "private" | "generic_only" | "do_not_use" | "unknown" | "sensitive";
            logicalPath: string;
        }[];
        sourceIds: string[];
        sensitivityFlags: string[];
        confidence: "high" | "medium" | "low";
        contentSha256: string;
        eligibility: {
            reasons: ("claim-unreviewed" | "review-not-approved" | "review-insufficient-support" | "review-scope-not-defensible" | "review-not-public-safe" | "review-not-resume-ready" | "review-role-ineligible" | "review-job-ineligible" | "review-critical-risk" | "claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        };
        content?: {
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
        } | undefined;
    }[];
    verifiedMetrics: {
        claimId: string;
        id: string;
        evidenceIds: string[];
        scope: {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        };
        exactText: string;
        textSha256: string;
    }[];
    eligibleRoleEvidenceIds: string[];
    eligibleJobEvidenceIds: string[];
    eligibleRoleClaimIds: string[];
    eligibleJobClaimIds: string[];
    eligibleRoleEvidenceSetSha256: string;
    eligibleJobEvidenceSetSha256: string;
}>;
export declare const EvidenceSnapshotManifestSchemaV1: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    snapshotId: z.ZodString;
    snapshotPath: z.ZodEffects<z.ZodString, string, string>;
    contentSha256: z.ZodString;
    contractName: z.ZodLiteral<"evidence-snapshot">;
    contractVersion: z.ZodLiteral<"1">;
    policyName: z.ZodLiteral<"evidence-snapshot-policy">;
    policyVersion: z.ZodEnum<["1", "2"]>;
    producerName: z.ZodLiteral<"evidence-snapshot-exporter">;
    producerVersion: z.ZodEnum<["1", "2"]>;
    sourceInventorySha256: z.ZodString;
    reviewInventorySha256: z.ZodOptional<z.ZodString>;
    sourceArtifactCount: z.ZodNumber;
    evidenceItemCount: z.ZodNumber;
    claimCount: z.ZodNumber;
    approvedClaimCount: z.ZodNumber;
    reviewedClaimCount: z.ZodOptional<z.ZodNumber>;
    eligibleRoleEvidenceCount: z.ZodNumber;
    eligibleJobEvidenceCount: z.ZodNumber;
    verifiedMetricCount: z.ZodNumber;
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
    }, {
        sha256: string;
        path: string;
    }>, "many">;
    completeness: z.ZodLiteral<"complete">;
    validationResult: z.ZodLiteral<"valid">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    policyVersion: "1" | "2";
    completeness: "complete";
    snapshotPath: string;
    policyName: "evidence-snapshot-policy";
    contentSha256: string;
    sourceArtifactCount: number;
    evidenceItemCount: number;
    claimCount: number;
    approvedClaimCount: number;
    eligibleRoleEvidenceCount: number;
    eligibleJobEvidenceCount: number;
    verifiedMetricCount: number;
    snapshotId: string;
    contractName: "evidence-snapshot";
    contractVersion: "1";
    producerName: "evidence-snapshot-exporter";
    producerVersion: "1" | "2";
    sourceInventorySha256: string;
    files: {
        sha256: string;
        path: string;
    }[];
    validationResult: "valid";
    reviewInventorySha256?: string | undefined;
    reviewedClaimCount?: number | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    policyVersion: "1" | "2";
    completeness: "complete";
    snapshotPath: string;
    policyName: "evidence-snapshot-policy";
    contentSha256: string;
    sourceArtifactCount: number;
    evidenceItemCount: number;
    claimCount: number;
    approvedClaimCount: number;
    eligibleRoleEvidenceCount: number;
    eligibleJobEvidenceCount: number;
    verifiedMetricCount: number;
    snapshotId: string;
    contractName: "evidence-snapshot";
    contractVersion: "1";
    producerName: "evidence-snapshot-exporter";
    producerVersion: "1" | "2";
    sourceInventorySha256: string;
    files: {
        sha256: string;
        path: string;
    }[];
    validationResult: "valid";
    reviewInventorySha256?: string | undefined;
    reviewedClaimCount?: number | undefined;
}>;
export type EvidenceFoundationSnapshot = z.infer<typeof EvidenceFoundationSnapshotSchema>;
export type EvidenceSnapshotManifestV1 = z.infer<typeof EvidenceSnapshotManifestSchemaV1>;
export type EvidenceSnapshotEvidenceRecord = z.infer<typeof EvidenceSnapshotEvidenceRecordSchema>;
export type EvidenceSnapshotClaimRecord = z.infer<typeof EvidenceSnapshotClaimRecordSchema>;
export type EvidenceSnapshotSourceReference = z.infer<typeof EvidenceSnapshotSourceReferenceSchema>;
