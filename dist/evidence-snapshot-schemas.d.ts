import { z } from "zod";
export declare const EVIDENCE_SNAPSHOT_SCHEMA_VERSION: 1;
export declare const EVIDENCE_SNAPSHOT_CONTRACT_NAME = "evidence-snapshot";
export declare const EVIDENCE_SNAPSHOT_POLICY_NAME = "evidence-snapshot-policy";
export declare const EVIDENCE_SNAPSHOT_POLICY_VERSION = "1";
export declare const EVIDENCE_SNAPSHOT_EXPORTER_NAME = "evidence-snapshot-exporter";
export declare const EVIDENCE_SNAPSHOT_EXPORTER_VERSION = "1";
export declare const EvidenceSnapshotSha256Schema: z.ZodString;
export declare const EvidenceSnapshotIdSchema: z.ZodString;
export declare const EvidenceSnapshotRelativePathSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const EvidenceSnapshotEligibilityReasonSchema: z.ZodEnum<["claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>;
export declare const EvidenceSnapshotEligibilitySchema: z.ZodObject<{
    roleMatching: z.ZodBoolean;
    jobMapping: z.ZodBoolean;
    reasons: z.ZodArray<z.ZodEnum<["claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
}, "strict", z.ZodTypeAny, {
    reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
    roleMatching: boolean;
    jobMapping: boolean;
}, {
    reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
        reasons: z.ZodArray<z.ZodEnum<["claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
    }, "strict", z.ZodTypeAny, {
        reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    }, {
        reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
        reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
        reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
        reasons: z.ZodArray<z.ZodEnum<["claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
    }, "strict", z.ZodTypeAny, {
        reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    }, {
        reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
        roleMatching: boolean;
        jobMapping: boolean;
    }>;
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
        reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
        reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
    exactText: string;
    textSha256: string;
    scope: {
        dateRange?: string | undefined;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    };
}, {
    claimId: string;
    id: string;
    evidenceIds: string[];
    exactText: string;
    textSha256: string;
    scope: {
        dateRange?: string | undefined;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    };
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
    id: "sources" | "evidence-items" | "claims";
}, {
    sha256: string;
    path: string;
    id: "sources" | "evidence-items" | "claims";
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
        version: z.ZodLiteral<"1">;
    }, "strict", z.ZodTypeAny, {
        name: "evidence-snapshot-policy";
        version: "1";
    }, {
        name: "evidence-snapshot-policy";
        version: "1";
    }>;
    producer: z.ZodObject<{
        name: z.ZodLiteral<"evidence-snapshot-exporter">;
        version: z.ZodLiteral<"1">;
        mode: z.ZodLiteral<"deterministic">;
    }, "strict", z.ZodTypeAny, {
        name: "evidence-snapshot-exporter";
        version: "1";
        mode: "deterministic";
    }, {
        name: "evidence-snapshot-exporter";
        version: "1";
        mode: "deterministic";
    }>;
    sourceFoundation: z.ZodObject<{
        id: z.ZodLiteral<"prooflayer-reviewed-evidence-foundation">;
        inventorySha256: z.ZodString;
        artifacts: z.ZodArray<z.ZodObject<{
            id: z.ZodEnum<["sources", "evidence-items", "claims"]>;
            path: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            path: string;
            id: "sources" | "evidence-items" | "claims";
        }, {
            sha256: string;
            path: string;
            id: "sources" | "evidence-items" | "claims";
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: "prooflayer-reviewed-evidence-foundation";
        inventorySha256: string;
        artifacts: {
            sha256: string;
            path: string;
            id: "sources" | "evidence-items" | "claims";
        }[];
    }, {
        id: "prooflayer-reviewed-evidence-foundation";
        inventorySha256: string;
        artifacts: {
            sha256: string;
            path: string;
            id: "sources" | "evidence-items" | "claims";
        }[];
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
            reasons: z.ZodArray<z.ZodEnum<["claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
        }, "strict", z.ZodTypeAny, {
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        }, {
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
            reasons: z.ZodArray<z.ZodEnum<["claim-not-approved", "claim-not-resume-ready", "claim-not-public-safe", "claim-needs-confirmation", "evidence-not-public", "evidence-sensitive", "source-missing", "source-inactive", "source-not-public", "job-description-source", "no-eligible-claim", "no-eligible-evidence"]>, "many">;
        }, "strict", z.ZodTypeAny, {
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        }, {
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
            roleMatching: boolean;
            jobMapping: boolean;
        }>;
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
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
        exactText: string;
        textSha256: string;
        scope: {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        };
    }, {
        claimId: string;
        id: string;
        evidenceIds: string[];
        exactText: string;
        textSha256: string;
        scope: {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        };
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
    };
    policy: {
        name: "evidence-snapshot-policy";
        version: "1";
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
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
    }[];
    contract: {
        name: "evidence-snapshot";
        version: "1";
    };
    producer: {
        name: "evidence-snapshot-exporter";
        version: "1";
        mode: "deterministic";
    };
    sourceFoundation: {
        id: "prooflayer-reviewed-evidence-foundation";
        inventorySha256: string;
        artifacts: {
            sha256: string;
            path: string;
            id: "sources" | "evidence-items" | "claims";
        }[];
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
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
        exactText: string;
        textSha256: string;
        scope: {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        };
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
    };
    policy: {
        name: "evidence-snapshot-policy";
        version: "1";
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
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
    }[];
    contract: {
        name: "evidence-snapshot";
        version: "1";
    };
    producer: {
        name: "evidence-snapshot-exporter";
        version: "1";
        mode: "deterministic";
    };
    sourceFoundation: {
        id: "prooflayer-reviewed-evidence-foundation";
        inventorySha256: string;
        artifacts: {
            sha256: string;
            path: string;
            id: "sources" | "evidence-items" | "claims";
        }[];
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
            reasons: ("claim-not-approved" | "claim-not-resume-ready" | "claim-not-public-safe" | "claim-needs-confirmation" | "evidence-not-public" | "evidence-sensitive" | "source-missing" | "source-inactive" | "source-not-public" | "job-description-source" | "no-eligible-claim" | "no-eligible-evidence")[];
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
        exactText: string;
        textSha256: string;
        scope: {
            dateRange?: string | undefined;
            parentRoleId?: string | undefined;
            parentProjectId?: string | undefined;
        };
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
    policyVersion: z.ZodLiteral<"1">;
    producerName: z.ZodLiteral<"evidence-snapshot-exporter">;
    producerVersion: z.ZodLiteral<"1">;
    sourceInventorySha256: z.ZodString;
    sourceArtifactCount: z.ZodNumber;
    evidenceItemCount: z.ZodNumber;
    claimCount: z.ZodNumber;
    approvedClaimCount: z.ZodNumber;
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
    policyVersion: "1";
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
    producerVersion: "1";
    sourceInventorySha256: string;
    files: {
        sha256: string;
        path: string;
    }[];
    validationResult: "valid";
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    policyVersion: "1";
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
    producerVersion: "1";
    sourceInventorySha256: string;
    files: {
        sha256: string;
        path: string;
    }[];
    validationResult: "valid";
}>;
export type EvidenceFoundationSnapshot = z.infer<typeof EvidenceFoundationSnapshotSchema>;
export type EvidenceSnapshotManifestV1 = z.infer<typeof EvidenceSnapshotManifestSchemaV1>;
export type EvidenceSnapshotEvidenceRecord = z.infer<typeof EvidenceSnapshotEvidenceRecordSchema>;
export type EvidenceSnapshotClaimRecord = z.infer<typeof EvidenceSnapshotClaimRecordSchema>;
export type EvidenceSnapshotSourceReference = z.infer<typeof EvidenceSnapshotSourceReferenceSchema>;
