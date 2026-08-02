import { z } from "zod";
export declare const EVIDENCE_CLAIM_REVIEW_SCHEMA_VERSION: 1;
export declare const EVIDENCE_CLAIM_REVIEW_POLICY_NAME = "evidence-claim-review-policy";
export declare const EVIDENCE_CLAIM_REVIEW_POLICY_VERSION = "1";
export declare const EvidenceClaimReviewDecisionSchema: z.ZodEnum<["approved", "approved-with-qualifier", "needs-edit", "rejected", "insufficient-proof", "deferred"]>;
export declare const EvidenceClaimFactualSupportSchema: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
export declare const EvidenceClaimScopeStateSchema: z.ZodEnum<["exact", "qualified", "overstated", "underspecified", "ambiguous", "invalid"]>;
export declare const EvidenceClaimPublicSafetySchema: z.ZodEnum<["public-safe", "private", "restricted", "indeterminate"]>;
export declare const EvidenceClaimResumeReadinessSchema: z.ZodEnum<["resume-ready", "not-resume-ready", "needs-edit", "indeterminate"]>;
export declare const EvidenceClaimMetricReviewStateSchema: z.ZodEnum<["verified", "unverified", "contradicted", "not-a-metric", "indeterminate"]>;
export declare const EvidenceClaimWorkContextSchema: z.ZodEnum<["employment", "project", "education", "certification", "skill", "other", "ambiguous"]>;
export declare const EvidenceClaimNatureSchema: z.ZodEnum<["responsibility", "achievement", "capability", "credential", "other", "ambiguous"]>;
export declare const EvidenceClaimReviewRiskInputSchema: z.ZodObject<{
    code: z.ZodString;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    severity: "high" | "medium" | "low" | "critical";
}, {
    code: string;
    message: string;
    severity: "high" | "medium" | "low" | "critical";
}>;
export declare const EvidenceClaimReviewInputSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    claimId: z.ZodString;
    reviewedClaimSha256: z.ZodString;
    decision: z.ZodEnum<["approved", "approved-with-qualifier", "needs-edit", "rejected", "insufficient-proof", "deferred"]>;
    correctedClaim: z.ZodOptional<z.ZodString>;
    requiredQualifiers: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    factualSupport: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
    scope: z.ZodEnum<["exact", "qualified", "overstated", "underspecified", "ambiguous", "invalid"]>;
    publicSafety: z.ZodEnum<["public-safe", "private", "restricted", "indeterminate"]>;
    resumeReadiness: z.ZodEnum<["resume-ready", "not-resume-ready", "needs-edit", "indeterminate"]>;
    eligibleForRoleMatching: z.ZodBoolean;
    eligibleForJobMapping: z.ZodBoolean;
    metricReview: z.ZodObject<{
        state: z.ZodEnum<["verified", "unverified", "contradicted", "not-a-metric", "indeterminate"]>;
        exactText: z.ZodOptional<z.ZodString>;
        unit: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        qualifiers: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strict", z.ZodTypeAny, {
        state: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        qualifiers: string[];
        scope?: string | undefined;
        exactText?: string | undefined;
        unit?: string | undefined;
    }, {
        state: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        scope?: string | undefined;
        exactText?: string | undefined;
        unit?: string | undefined;
        qualifiers?: string[] | undefined;
    }>;
    classification: z.ZodObject<{
        workContext: z.ZodEnum<["employment", "project", "education", "certification", "skill", "other", "ambiguous"]>;
        claimNature: z.ZodEnum<["responsibility", "achievement", "capability", "credential", "other", "ambiguous"]>;
    }, "strict", z.ZodTypeAny, {
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
    }, {
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
    }>;
    risks: z.ZodDefault<z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
    }, {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
    }>, "many">>;
    warnings: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    ambiguities: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    reviewerRationale: z.ZodString;
    supersedesReviewId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
    schemaVersion: 1;
    classification: {
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
    };
    warnings: string[];
    ambiguities: string[];
    reviewedClaimSha256: string;
    requiredQualifiers: string[];
    factualSupport: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    scope: "exact" | "invalid" | "qualified" | "overstated" | "underspecified" | "ambiguous";
    publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
    resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
    eligibleForRoleMatching: boolean;
    eligibleForJobMapping: boolean;
    metricReview: {
        state: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        qualifiers: string[];
        scope?: string | undefined;
        exactText?: string | undefined;
        unit?: string | undefined;
    };
    risks: {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
    }[];
    reviewerRationale: string;
    correctedClaim?: string | undefined;
    supersedesReviewId?: string | undefined;
}, {
    claimId: string;
    decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
    schemaVersion: 1;
    classification: {
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
    };
    reviewedClaimSha256: string;
    factualSupport: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    scope: "exact" | "invalid" | "qualified" | "overstated" | "underspecified" | "ambiguous";
    publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
    resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
    eligibleForRoleMatching: boolean;
    eligibleForJobMapping: boolean;
    metricReview: {
        state: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        scope?: string | undefined;
        exactText?: string | undefined;
        unit?: string | undefined;
        qualifiers?: string[] | undefined;
    };
    reviewerRationale: string;
    warnings?: string[] | undefined;
    ambiguities?: string[] | undefined;
    correctedClaim?: string | undefined;
    requiredQualifiers?: string[] | undefined;
    risks?: {
        code: string;
        message: string;
        severity: "high" | "medium" | "low" | "critical";
    }[] | undefined;
    supersedesReviewId?: string | undefined;
}>;
export declare const EvidenceClaimReviewSourceReferenceSchema: z.ZodObject<{
    sourceId: z.ZodString;
    sourceType: z.ZodString;
    logicalPath: z.ZodEffects<z.ZodString, string, string>;
    sha256: z.ZodString;
    visibility: z.ZodString;
    status: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sha256: string;
    status: string;
    sourceType: string;
    sourceId: string;
    visibility: string;
    logicalPath: string;
}, {
    sha256: string;
    status: string;
    sourceType: string;
    sourceId: string;
    visibility: string;
    logicalPath: string;
}>;
export declare const EvidenceClaimReviewEvidenceReferenceSchema: z.ZodObject<{
    evidenceItemId: z.ZodString;
    evidenceItemSha256: z.ZodString;
    category: z.ZodString;
    parentRoleId: z.ZodOptional<z.ZodString>;
    parentProjectId: z.ZodOptional<z.ZodString>;
    sourceReferences: z.ZodArray<z.ZodObject<{
        sourceId: z.ZodString;
        sourceType: z.ZodString;
        logicalPath: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
        visibility: z.ZodString;
        status: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        status: string;
        sourceType: string;
        sourceId: string;
        visibility: string;
        logicalPath: string;
    }, {
        sha256: string;
        status: string;
        sourceType: string;
        sourceId: string;
        visibility: string;
        logicalPath: string;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    category: string;
    sourceReferences: {
        sha256: string;
        status: string;
        sourceType: string;
        sourceId: string;
        visibility: string;
        logicalPath: string;
    }[];
    evidenceItemId: string;
    evidenceItemSha256: string;
    parentRoleId?: string | undefined;
    parentProjectId?: string | undefined;
}, {
    category: string;
    sourceReferences: {
        sha256: string;
        status: string;
        sourceType: string;
        sourceId: string;
        visibility: string;
        logicalPath: string;
    }[];
    evidenceItemId: string;
    evidenceItemSha256: string;
    parentRoleId?: string | undefined;
    parentProjectId?: string | undefined;
}>;
export declare const EvidenceClaimReviewRiskSchema: z.ZodObject<{
    code: z.ZodString;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    message: z.ZodString;
} & {
    id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    id: string;
    severity: "high" | "medium" | "low" | "critical";
}, {
    code: string;
    message: string;
    id: string;
    severity: "high" | "medium" | "low" | "critical";
}>;
export declare const EvidenceClaimReviewProjectionSchema: z.ZodObject<{
    id: z.ZodString;
    claimId: z.ZodString;
    text: z.ZodString;
    textSha256: z.ZodString;
    requiredQualifiers: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    id: string;
    text: string;
    requiredQualifiers: string[];
    textSha256: string;
}, {
    claimId: string;
    id: string;
    text: string;
    requiredQualifiers: string[];
    textSha256: string;
}>;
export declare const EvidenceClaimReviewSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    policy: z.ZodObject<{
        name: z.ZodLiteral<"evidence-claim-review-policy">;
        version: z.ZodLiteral<"1">;
        mode: z.ZodLiteral<"human-controlled">;
    }, "strict", z.ZodTypeAny, {
        name: "evidence-claim-review-policy";
        version: "1";
        mode: "human-controlled";
    }, {
        name: "evidence-claim-review-policy";
        version: "1";
        mode: "human-controlled";
    }>;
    claimId: z.ZodString;
    primaryEvidenceItemId: z.ZodString;
    evidenceItemIds: z.ZodArray<z.ZodString, "many">;
    reviewedClaimText: z.ZodString;
    reviewedClaimSha256: z.ZodString;
    claimRecordSha256: z.ZodString;
    evidenceInventorySha256: z.ZodString;
    provenanceInventorySha256: z.ZodString;
    evidenceReferences: z.ZodArray<z.ZodObject<{
        evidenceItemId: z.ZodString;
        evidenceItemSha256: z.ZodString;
        category: z.ZodString;
        parentRoleId: z.ZodOptional<z.ZodString>;
        parentProjectId: z.ZodOptional<z.ZodString>;
        sourceReferences: z.ZodArray<z.ZodObject<{
            sourceId: z.ZodString;
            sourceType: z.ZodString;
            logicalPath: z.ZodEffects<z.ZodString, string, string>;
            sha256: z.ZodString;
            visibility: z.ZodString;
            status: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            sha256: string;
            status: string;
            sourceType: string;
            sourceId: string;
            visibility: string;
            logicalPath: string;
        }, {
            sha256: string;
            status: string;
            sourceType: string;
            sourceId: string;
            visibility: string;
            logicalPath: string;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        category: string;
        sourceReferences: {
            sha256: string;
            status: string;
            sourceType: string;
            sourceId: string;
            visibility: string;
            logicalPath: string;
        }[];
        evidenceItemId: string;
        evidenceItemSha256: string;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    }, {
        category: string;
        sourceReferences: {
            sha256: string;
            status: string;
            sourceType: string;
            sourceId: string;
            visibility: string;
            logicalPath: string;
        }[];
        evidenceItemId: string;
        evidenceItemSha256: string;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    }>, "many">;
    decision: z.ZodEnum<["approved", "approved-with-qualifier", "needs-edit", "rejected", "insufficient-proof", "deferred"]>;
    approvedProjection: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        claimId: z.ZodString;
        text: z.ZodString;
        textSha256: z.ZodString;
        requiredQualifiers: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        claimId: string;
        id: string;
        text: string;
        requiredQualifiers: string[];
        textSha256: string;
    }, {
        claimId: string;
        id: string;
        text: string;
        requiredQualifiers: string[];
        textSha256: string;
    }>>;
    requiredQualifiers: z.ZodArray<z.ZodString, "many">;
    factualSupport: z.ZodEnum<["supported", "partially-supported", "unsupported", "contradicted", "indeterminate"]>;
    scope: z.ZodEnum<["exact", "qualified", "overstated", "underspecified", "ambiguous", "invalid"]>;
    publicSafety: z.ZodEnum<["public-safe", "private", "restricted", "indeterminate"]>;
    resumeReadiness: z.ZodEnum<["resume-ready", "not-resume-ready", "needs-edit", "indeterminate"]>;
    eligibleForRoleMatching: z.ZodBoolean;
    eligibleForJobMapping: z.ZodBoolean;
    metricReview: z.ZodObject<{
        state: z.ZodEnum<["verified", "unverified", "contradicted", "not-a-metric", "indeterminate"]>;
        exactText: z.ZodOptional<z.ZodString>;
        exactTextSha256: z.ZodOptional<z.ZodString>;
        unit: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        qualifiers: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        state: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        qualifiers: string[];
        scope?: string | undefined;
        exactText?: string | undefined;
        unit?: string | undefined;
        exactTextSha256?: string | undefined;
    }, {
        state: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        qualifiers: string[];
        scope?: string | undefined;
        exactText?: string | undefined;
        unit?: string | undefined;
        exactTextSha256?: string | undefined;
    }>;
    classification: z.ZodObject<{
        workContext: z.ZodEnum<["employment", "project", "education", "certification", "skill", "other", "ambiguous"]>;
        claimNature: z.ZodEnum<["responsibility", "achievement", "capability", "credential", "other", "ambiguous"]>;
    }, "strict", z.ZodTypeAny, {
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
    }, {
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
    }>;
    risks: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
        message: z.ZodString;
    } & {
        id: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
    }, {
        code: string;
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
    }>, "many">;
    warnings: z.ZodArray<z.ZodString, "many">;
    ambiguities: z.ZodArray<z.ZodString, "many">;
    reviewerRationale: z.ZodString;
    supersedesReviewId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    classification: {
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
    };
    warnings: string[];
    ambiguities: string[];
    reviewedClaimSha256: string;
    requiredQualifiers: string[];
    factualSupport: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    scope: "exact" | "invalid" | "qualified" | "overstated" | "underspecified" | "ambiguous";
    publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
    resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
    eligibleForRoleMatching: boolean;
    eligibleForJobMapping: boolean;
    metricReview: {
        state: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        qualifiers: string[];
        scope?: string | undefined;
        exactText?: string | undefined;
        unit?: string | undefined;
        exactTextSha256?: string | undefined;
    };
    risks: {
        code: string;
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
    }[];
    reviewerRationale: string;
    policy: {
        name: "evidence-claim-review-policy";
        version: "1";
        mode: "human-controlled";
    };
    primaryEvidenceItemId: string;
    evidenceItemIds: string[];
    reviewedClaimText: string;
    claimRecordSha256: string;
    evidenceInventorySha256: string;
    provenanceInventorySha256: string;
    evidenceReferences: {
        category: string;
        sourceReferences: {
            sha256: string;
            status: string;
            sourceType: string;
            sourceId: string;
            visibility: string;
            logicalPath: string;
        }[];
        evidenceItemId: string;
        evidenceItemSha256: string;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    }[];
    supersedesReviewId?: string | undefined;
    approvedProjection?: {
        claimId: string;
        id: string;
        text: string;
        requiredQualifiers: string[];
        textSha256: string;
    } | undefined;
}, {
    claimId: string;
    decision: "approved" | "rejected" | "approved-with-qualifier" | "needs-edit" | "insufficient-proof" | "deferred";
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    classification: {
        workContext: "other" | "project" | "skill" | "certification" | "education" | "ambiguous" | "employment";
        claimNature: "other" | "responsibility" | "capability" | "achievement" | "ambiguous" | "credential";
    };
    warnings: string[];
    ambiguities: string[];
    reviewedClaimSha256: string;
    requiredQualifiers: string[];
    factualSupport: "unsupported" | "supported" | "partially-supported" | "contradicted" | "indeterminate";
    scope: "exact" | "invalid" | "qualified" | "overstated" | "underspecified" | "ambiguous";
    publicSafety: "private" | "indeterminate" | "public-safe" | "restricted";
    resumeReadiness: "needs-edit" | "indeterminate" | "resume-ready" | "not-resume-ready";
    eligibleForRoleMatching: boolean;
    eligibleForJobMapping: boolean;
    metricReview: {
        state: "contradicted" | "indeterminate" | "verified" | "unverified" | "not-a-metric";
        qualifiers: string[];
        scope?: string | undefined;
        exactText?: string | undefined;
        unit?: string | undefined;
        exactTextSha256?: string | undefined;
    };
    risks: {
        code: string;
        message: string;
        id: string;
        severity: "high" | "medium" | "low" | "critical";
    }[];
    reviewerRationale: string;
    policy: {
        name: "evidence-claim-review-policy";
        version: "1";
        mode: "human-controlled";
    };
    primaryEvidenceItemId: string;
    evidenceItemIds: string[];
    reviewedClaimText: string;
    claimRecordSha256: string;
    evidenceInventorySha256: string;
    provenanceInventorySha256: string;
    evidenceReferences: {
        category: string;
        sourceReferences: {
            sha256: string;
            status: string;
            sourceType: string;
            sourceId: string;
            visibility: string;
            logicalPath: string;
        }[];
        evidenceItemId: string;
        evidenceItemSha256: string;
        parentRoleId?: string | undefined;
        parentProjectId?: string | undefined;
    }[];
    supersedesReviewId?: string | undefined;
    approvedProjection?: {
        claimId: string;
        id: string;
        text: string;
        requiredQualifiers: string[];
        textSha256: string;
    } | undefined;
}>;
export declare const EvidenceClaimReviewManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    reviewId: z.ZodString;
    claimId: z.ZodString;
    reviewPath: z.ZodEffects<z.ZodString, string, string>;
    reviewSha256: z.ZodString;
    policyName: z.ZodLiteral<"evidence-claim-review-policy">;
    policyVersion: z.ZodLiteral<"1">;
    claimRecordSha256: z.ZodString;
    evidenceInventorySha256: z.ZodString;
    provenanceInventorySha256: z.ZodString;
    supersedesReviewId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    policyVersion: "1";
    reviewPath: string;
    reviewSha256: string;
    claimRecordSha256: string;
    evidenceInventorySha256: string;
    provenanceInventorySha256: string;
    reviewId: string;
    policyName: "evidence-claim-review-policy";
    supersedesReviewId?: string | undefined;
}, {
    claimId: string;
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    policyVersion: "1";
    reviewPath: string;
    reviewSha256: string;
    claimRecordSha256: string;
    evidenceInventorySha256: string;
    provenanceInventorySha256: string;
    reviewId: string;
    policyName: "evidence-claim-review-policy";
    supersedesReviewId?: string | undefined;
}>;
export declare const EvidenceClaimReviewSnapshotProjectionSchema: z.ZodObject<{
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
}>;
export type EvidenceClaimReviewInput = z.infer<typeof EvidenceClaimReviewInputSchema>;
export type EvidenceClaimReview = z.infer<typeof EvidenceClaimReviewSchema>;
export type EvidenceClaimReviewManifest = z.infer<typeof EvidenceClaimReviewManifestSchema>;
export type EvidenceClaimReviewSnapshotProjection = z.infer<typeof EvidenceClaimReviewSnapshotProjectionSchema>;
