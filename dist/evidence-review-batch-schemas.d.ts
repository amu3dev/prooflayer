import { z } from "zod";
export declare const EVIDENCE_REVIEW_BATCH_SCHEMA_VERSION: 1;
export declare const EVIDENCE_REVIEW_BATCH_POLICY_NAME = "evidence-review-batch-policy";
export declare const EVIDENCE_REVIEW_BATCH_POLICY_VERSION = "1";
export declare const EvidenceReviewBatchPrioritySchema: z.ZodEnum<["high", "medium", "low"]>;
export declare const EvidenceReviewBatchClaimSchema: z.ZodObject<{
    claimId: z.ZodString;
    claimSha256: z.ZodString;
    evidenceItemIds: z.ZodArray<z.ZodString, "many">;
    priority: z.ZodEnum<["high", "medium", "low"]>;
    priorityBasis: z.ZodArray<z.ZodEnum<["mandatory-requirement-terminology", "preferred-requirement-terminology", "contextual-requirement-terminology", "named-technology-or-domain", "reviewed-category", "potential-metric", "no-explicit-overlap"]>, "many">;
    matchingRequirementIds: z.ZodArray<z.ZodString, "many">;
    matchingTerms: z.ZodArray<z.ZodString, "many">;
    potentialMetric: z.ZodBoolean;
    selectedForControlledReview: z.ZodBoolean;
    reviewInputTemplatePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
}, "strict", z.ZodTypeAny, {
    claimId: string;
    evidenceItemIds: string[];
    priority: "high" | "medium" | "low";
    claimSha256: string;
    priorityBasis: ("mandatory-requirement-terminology" | "preferred-requirement-terminology" | "contextual-requirement-terminology" | "named-technology-or-domain" | "reviewed-category" | "potential-metric" | "no-explicit-overlap")[];
    matchingRequirementIds: string[];
    matchingTerms: string[];
    potentialMetric: boolean;
    selectedForControlledReview: boolean;
    reviewInputTemplatePath?: string | undefined;
}, {
    claimId: string;
    evidenceItemIds: string[];
    priority: "high" | "medium" | "low";
    claimSha256: string;
    priorityBasis: ("mandatory-requirement-terminology" | "preferred-requirement-terminology" | "contextual-requirement-terminology" | "named-technology-or-domain" | "reviewed-category" | "potential-metric" | "no-explicit-overlap")[];
    matchingRequirementIds: string[];
    matchingTerms: string[];
    potentialMetric: boolean;
    selectedForControlledReview: boolean;
    reviewInputTemplatePath?: string | undefined;
}>;
export declare const EvidenceReviewBatchSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"job">;
    purpose: z.ZodLiteral<"human-review-work-organization">;
    policy: z.ZodObject<{
        name: z.ZodLiteral<"evidence-review-batch-policy">;
        version: z.ZodLiteral<"1">;
        mode: z.ZodLiteral<"deterministic">;
    }, "strict", z.ZodTypeAny, {
        name: "evidence-review-batch-policy";
        version: "1";
        mode: "deterministic";
    }, {
        name: "evidence-review-batch-policy";
        version: "1";
        mode: "deterministic";
    }>;
    input: z.ZodObject<{
        targetPath: z.ZodEffects<z.ZodString, string, string>;
        targetSha256: z.ZodString;
        requirementModelPath: z.ZodEffects<z.ZodString, string, string>;
        requirementModelSha256: z.ZodString;
        requirementManifestPath: z.ZodEffects<z.ZodString, string, string>;
        requirementManifestSha256: z.ZodString;
        claimsPath: z.ZodEffects<z.ZodString, string, string>;
        claimsSha256: z.ZodString;
        evidencePath: z.ZodEffects<z.ZodString, string, string>;
        evidenceSha256: z.ZodString;
        normalizedInputSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        targetPath: string;
        targetSha256: string;
        claimsPath: string;
        claimsSha256: string;
        normalizedInputSha256: string;
        requirementModelPath: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        requirementManifestPath: string;
        evidencePath: string;
        evidenceSha256: string;
    }, {
        targetPath: string;
        targetSha256: string;
        claimsPath: string;
        claimsSha256: string;
        normalizedInputSha256: string;
        requirementModelPath: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        requirementManifestPath: string;
        evidencePath: string;
        evidenceSha256: string;
    }>;
    claims: z.ZodArray<z.ZodObject<{
        claimId: z.ZodString;
        claimSha256: z.ZodString;
        evidenceItemIds: z.ZodArray<z.ZodString, "many">;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        priorityBasis: z.ZodArray<z.ZodEnum<["mandatory-requirement-terminology", "preferred-requirement-terminology", "contextual-requirement-terminology", "named-technology-or-domain", "reviewed-category", "potential-metric", "no-explicit-overlap"]>, "many">;
        matchingRequirementIds: z.ZodArray<z.ZodString, "many">;
        matchingTerms: z.ZodArray<z.ZodString, "many">;
        potentialMetric: z.ZodBoolean;
        selectedForControlledReview: z.ZodBoolean;
        reviewInputTemplatePath: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    }, "strict", z.ZodTypeAny, {
        claimId: string;
        evidenceItemIds: string[];
        priority: "high" | "medium" | "low";
        claimSha256: string;
        priorityBasis: ("mandatory-requirement-terminology" | "preferred-requirement-terminology" | "contextual-requirement-terminology" | "named-technology-or-domain" | "reviewed-category" | "potential-metric" | "no-explicit-overlap")[];
        matchingRequirementIds: string[];
        matchingTerms: string[];
        potentialMetric: boolean;
        selectedForControlledReview: boolean;
        reviewInputTemplatePath?: string | undefined;
    }, {
        claimId: string;
        evidenceItemIds: string[];
        priority: "high" | "medium" | "low";
        claimSha256: string;
        priorityBasis: ("mandatory-requirement-terminology" | "preferred-requirement-terminology" | "contextual-requirement-terminology" | "named-technology-or-domain" | "reviewed-category" | "potential-metric" | "no-explicit-overlap")[];
        matchingRequirementIds: string[];
        matchingTerms: string[];
        potentialMetric: boolean;
        selectedForControlledReview: boolean;
        reviewInputTemplatePath?: string | undefined;
    }>, "many">;
    controlledReviewSubsetClaimIds: z.ZodArray<z.ZodString, "many">;
    priorityCounts: z.ZodObject<{
        high: z.ZodNumber;
        medium: z.ZodNumber;
        low: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        high: number;
        medium: number;
        low: number;
    }, {
        high: number;
        medium: number;
        low: number;
    }>;
    candidateClaimCount: z.ZodNumber;
    warning: z.ZodLiteral<"Batch priority organizes human review only; it does not establish factual support, approval, eligibility, or fit.">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        targetPath: string;
        targetSha256: string;
        claimsPath: string;
        claimsSha256: string;
        normalizedInputSha256: string;
        requirementModelPath: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        requirementManifestPath: string;
        evidencePath: string;
        evidenceSha256: string;
    };
    targetType: "job";
    targetId: string;
    warning: "Batch priority organizes human review only; it does not establish factual support, approval, eligibility, or fit.";
    policy: {
        name: "evidence-review-batch-policy";
        version: "1";
        mode: "deterministic";
    };
    claims: {
        claimId: string;
        evidenceItemIds: string[];
        priority: "high" | "medium" | "low";
        claimSha256: string;
        priorityBasis: ("mandatory-requirement-terminology" | "preferred-requirement-terminology" | "contextual-requirement-terminology" | "named-technology-or-domain" | "reviewed-category" | "potential-metric" | "no-explicit-overlap")[];
        matchingRequirementIds: string[];
        matchingTerms: string[];
        potentialMetric: boolean;
        selectedForControlledReview: boolean;
        reviewInputTemplatePath?: string | undefined;
    }[];
    purpose: "human-review-work-organization";
    controlledReviewSubsetClaimIds: string[];
    priorityCounts: {
        high: number;
        medium: number;
        low: number;
    };
    candidateClaimCount: number;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    input: {
        targetPath: string;
        targetSha256: string;
        claimsPath: string;
        claimsSha256: string;
        normalizedInputSha256: string;
        requirementModelPath: string;
        requirementModelSha256: string;
        requirementManifestSha256: string;
        requirementManifestPath: string;
        evidencePath: string;
        evidenceSha256: string;
    };
    targetType: "job";
    targetId: string;
    warning: "Batch priority organizes human review only; it does not establish factual support, approval, eligibility, or fit.";
    policy: {
        name: "evidence-review-batch-policy";
        version: "1";
        mode: "deterministic";
    };
    claims: {
        claimId: string;
        evidenceItemIds: string[];
        priority: "high" | "medium" | "low";
        claimSha256: string;
        priorityBasis: ("mandatory-requirement-terminology" | "preferred-requirement-terminology" | "contextual-requirement-terminology" | "named-technology-or-domain" | "reviewed-category" | "potential-metric" | "no-explicit-overlap")[];
        matchingRequirementIds: string[];
        matchingTerms: string[];
        potentialMetric: boolean;
        selectedForControlledReview: boolean;
        reviewInputTemplatePath?: string | undefined;
    }[];
    purpose: "human-review-work-organization";
    controlledReviewSubsetClaimIds: string[];
    priorityCounts: {
        high: number;
        medium: number;
        low: number;
    };
    candidateClaimCount: number;
}>;
export declare const EvidenceReviewInputTemplateSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    templateForClaimId: z.ZodString;
    reviewedClaimSha256: z.ZodString;
    instructions: z.ZodArray<z.ZodString, "many">;
    reviewInput: z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        claimId: z.ZodString;
        reviewedClaimSha256: z.ZodString;
        decision: z.ZodNull;
        correctedClaim: z.ZodNull;
        requiredQualifiers: z.ZodArray<z.ZodNever, "many">;
        factualSupport: z.ZodNull;
        scope: z.ZodNull;
        publicSafety: z.ZodNull;
        resumeReadiness: z.ZodNull;
        eligibleForRoleMatching: z.ZodNull;
        eligibleForJobMapping: z.ZodNull;
        metricReview: z.ZodObject<{
            state: z.ZodNull;
            exactText: z.ZodNull;
            unit: z.ZodNull;
            scope: z.ZodNull;
            qualifiers: z.ZodArray<z.ZodNever, "many">;
        }, "strict", z.ZodTypeAny, {
            scope: null;
            state: null;
            exactText: null;
            unit: null;
            qualifiers: never[];
        }, {
            scope: null;
            state: null;
            exactText: null;
            unit: null;
            qualifiers: never[];
        }>;
        classification: z.ZodObject<{
            workContext: z.ZodNull;
            claimNature: z.ZodNull;
        }, "strict", z.ZodTypeAny, {
            workContext: null;
            claimNature: null;
        }, {
            workContext: null;
            claimNature: null;
        }>;
        risks: z.ZodArray<z.ZodNever, "many">;
        warnings: z.ZodArray<z.ZodNever, "many">;
        ambiguities: z.ZodArray<z.ZodNever, "many">;
        reviewerRationale: z.ZodNull;
    }, "strict", z.ZodTypeAny, {
        claimId: string;
        decision: null;
        schemaVersion: 1;
        classification: {
            workContext: null;
            claimNature: null;
        };
        warnings: never[];
        ambiguities: never[];
        reviewedClaimSha256: string;
        correctedClaim: null;
        requiredQualifiers: never[];
        factualSupport: null;
        scope: null;
        publicSafety: null;
        resumeReadiness: null;
        eligibleForRoleMatching: null;
        eligibleForJobMapping: null;
        metricReview: {
            scope: null;
            state: null;
            exactText: null;
            unit: null;
            qualifiers: never[];
        };
        risks: never[];
        reviewerRationale: null;
    }, {
        claimId: string;
        decision: null;
        schemaVersion: 1;
        classification: {
            workContext: null;
            claimNature: null;
        };
        warnings: never[];
        ambiguities: never[];
        reviewedClaimSha256: string;
        correctedClaim: null;
        requiredQualifiers: never[];
        factualSupport: null;
        scope: null;
        publicSafety: null;
        resumeReadiness: null;
        eligibleForRoleMatching: null;
        eligibleForJobMapping: null;
        metricReview: {
            scope: null;
            state: null;
            exactText: null;
            unit: null;
            qualifiers: never[];
        };
        risks: never[];
        reviewerRationale: null;
    }>;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    reviewedClaimSha256: string;
    templateForClaimId: string;
    instructions: string[];
    reviewInput: {
        claimId: string;
        decision: null;
        schemaVersion: 1;
        classification: {
            workContext: null;
            claimNature: null;
        };
        warnings: never[];
        ambiguities: never[];
        reviewedClaimSha256: string;
        correctedClaim: null;
        requiredQualifiers: never[];
        factualSupport: null;
        scope: null;
        publicSafety: null;
        resumeReadiness: null;
        eligibleForRoleMatching: null;
        eligibleForJobMapping: null;
        metricReview: {
            scope: null;
            state: null;
            exactText: null;
            unit: null;
            qualifiers: never[];
        };
        risks: never[];
        reviewerRationale: null;
    };
}, {
    schemaVersion: 1;
    reviewedClaimSha256: string;
    templateForClaimId: string;
    instructions: string[];
    reviewInput: {
        claimId: string;
        decision: null;
        schemaVersion: 1;
        classification: {
            workContext: null;
            claimNature: null;
        };
        warnings: never[];
        ambiguities: never[];
        reviewedClaimSha256: string;
        correctedClaim: null;
        requiredQualifiers: never[];
        factualSupport: null;
        scope: null;
        publicSafety: null;
        resumeReadiness: null;
        eligibleForRoleMatching: null;
        eligibleForJobMapping: null;
        metricReview: {
            scope: null;
            state: null;
            exactText: null;
            unit: null;
            qualifiers: never[];
        };
        risks: never[];
        reviewerRationale: null;
    };
}>;
export declare const EvidenceReviewBatchManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    batchId: z.ZodString;
    targetId: z.ZodString;
    batchPath: z.ZodEffects<z.ZodString, string, string>;
    batchSha256: z.ZodString;
    policyName: z.ZodLiteral<"evidence-review-batch-policy">;
    policyVersion: z.ZodLiteral<"1">;
    normalizedInputSha256: z.ZodString;
    targetSha256: z.ZodString;
    requirementModelSha256: z.ZodString;
    requirementManifestSha256: z.ZodString;
    claimsSha256: z.ZodString;
    evidenceSha256: z.ZodString;
    templateFiles: z.ZodArray<z.ZodObject<{
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
    }, {
        sha256: string;
        path: string;
    }>, "many">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetId: string;
    policyVersion: "1";
    claimsSha256: string;
    policyName: "evidence-review-batch-policy";
    normalizedInputSha256: string;
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceSha256: string;
    batchId: string;
    batchPath: string;
    batchSha256: string;
    templateFiles: {
        sha256: string;
        path: string;
    }[];
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetId: string;
    policyVersion: "1";
    claimsSha256: string;
    policyName: "evidence-review-batch-policy";
    normalizedInputSha256: string;
    requirementModelSha256: string;
    requirementManifestSha256: string;
    evidenceSha256: string;
    batchId: string;
    batchPath: string;
    batchSha256: string;
    templateFiles: {
        sha256: string;
        path: string;
    }[];
}>;
export type EvidenceReviewBatch = z.infer<typeof EvidenceReviewBatchSchema>;
export type EvidenceReviewBatchManifest = z.infer<typeof EvidenceReviewBatchManifestSchema>;
export type EvidenceReviewBatchPriority = z.infer<typeof EvidenceReviewBatchPrioritySchema>;
