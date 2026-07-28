import { z } from "zod";
import { JobAssessmentMaterialitySchema, JobAssessmentProofStrengthSchema, JobOverallAssessmentStateSchema, JobRequirementAssessmentStateSchema, } from "./job-fit-proof-assessment-schemas.js";
import { JobCandidateEvidenceProvenanceSchema, JobEvidenceRelationshipSchema, JobRequirementInputTypeSchema, JobRequirementLinkProvenanceSchema, } from "./job-evidence-map-schemas.js";
import { JobRequirementCoverageStateSchema } from "./job-coverage-schemas.js";
import { JobRequirementCategorySchema, JobRequirementNecessitySchema, } from "./job-requirement-schemas.js";
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const TargetIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const RelativeWorkspacePathSchema = z.string().min(1).refine((value) => !value.startsWith("/") && !/^[A-Za-z]:[\\/]/.test(value), "Path must be relative to the workspace");
export const JobResumePlanningModeSchema = z.literal("job-specific-resume");
export const JobResumePositioningStateSchema = z.enum([
    "direct",
    "adjacent",
    "stretch",
    "insufficient-proof",
    "indeterminate",
]);
export const JobRequirementEmphasisDecisionSchema = z.enum([
    "primary",
    "secondary",
    "supporting",
    "defer",
    "exclude",
]);
export const JobEvidenceSelectionDecisionSchema = JobRequirementEmphasisDecisionSchema;
export const JobResumeSectionTypeSchema = z.enum([
    "headline",
    "professional-summary",
    "core-capabilities",
    "selected-impact",
    "professional-experience",
    "selected-projects",
    "technical-capabilities",
    "leadership-capabilities",
    "education",
    "certifications",
    "additional-information",
]);
export const JobResumeSectionInclusionSchema = z.enum([
    "include",
    "optional",
    "exclude",
]);
export const JobResumeContentTypeSchema = z.enum([
    "target-title",
    "role-title",
    "capability-theme",
    "scope",
    "responsibility",
    "achievement",
    "quantified-outcome",
    "technology",
    "domain",
    "leadership-behavior",
    "delivery-outcome",
    "product-outcome",
    "business-outcome",
    "education",
    "certification",
    "project",
]);
export const JobClaimBoundaryStateSchema = z.enum([
    "allowed",
    "allowed-with-qualifier",
    "requires-caution",
    "prohibited",
]);
export const JobClaimBoundaryKindSchema = z.enum([
    "requirement-claim",
    "target-title",
    "project-employment",
    "metric",
    "scope",
]);
export const JobMetricPermissionStateSchema = z.enum([
    "allowed",
    "prohibited",
]);
export const JobGapHandlingDecisionSchema = z.enum([
    "exclude-positive-positioning",
    "defer",
    "supported-adjacent-claim",
    "drafting-caution",
]);
export const JobPlanDependencySchema = z.object({
    path: RelativeWorkspacePathSchema,
    sha256: Sha256Schema,
    manifestPath: RelativeWorkspacePathSchema,
    manifestSha256: Sha256Schema,
}).strict();
export const JobPlanFileDependencySchema = z.object({
    path: RelativeWorkspacePathSchema,
    sha256: Sha256Schema,
}).strict();
export const JobPlanCoverageReferenceSchema = z.object({
    coverageEntryId: z.string().min(1),
    coverageEntrySha256: Sha256Schema,
}).strict();
export const JobPlanAssessmentReferenceSchema = z.object({
    assessmentEntryId: z.string().min(1),
    assessmentEntrySha256: Sha256Schema,
}).strict();
export const JobPlanEvidenceLinkReferenceSchema = z.object({
    linkId: z.string().min(1),
    linkSha256: Sha256Schema,
    requirementId: z.string().min(1),
    evidenceId: z.string().min(1),
    claimId: z.string().min(1),
    relationship: JobEvidenceRelationshipSchema,
    requirementProvenance: JobRequirementLinkProvenanceSchema,
    evidenceProvenance: JobCandidateEvidenceProvenanceSchema,
}).strict();
export const JobPlanElementProvenanceSchema = z.object({
    targetId: TargetIdSchema,
    requirementIds: z.array(z.string().min(1)),
    coverageReferences: z.array(JobPlanCoverageReferenceSchema),
    assessmentReferences: z.array(JobPlanAssessmentReferenceSchema),
    evidenceLinkReferences: z.array(JobPlanEvidenceLinkReferenceSchema),
    evidenceIds: z.array(z.string().min(1)),
    claimIds: z.array(z.string().min(1)),
    planningPolicy: z.object({
        name: z.string().min(1),
        version: z.string().min(1),
    }).strict(),
}).strict();
export const JobResumePositioningSchema = z.object({
    state: JobResumePositioningStateSchema,
    sourceOverallAssessment: JobOverallAssessmentStateSchema,
    targetTitle: z.string().trim().min(1),
    targetTitleUse: z.literal("positioning-only"),
    primaryRequirementIds: z.array(z.string().min(1)),
    supportingRequirementIds: z.array(z.string().min(1)),
    cautionRequirementIds: z.array(z.string().min(1)),
    rationaleCode: z.enum([
        "strong-reviewed-proof",
        "credible-reviewed-proof",
        "mixed-reviewed-proof",
        "limited-reviewed-proof",
        "insufficient-reviewed-proof",
        "indeterminate-reviewed-proof",
    ]),
    prohibitedUses: z.array(z.enum([
        "employment-history",
        "seniority-proof",
        "authority-proof",
        "scope-proof",
    ])).min(1),
    provenance: JobPlanElementProvenanceSchema,
}).strict();
export const JobRequirementEmphasisSchema = z.object({
    id: z.string().min(1),
    requirementId: z.string().min(1),
    category: JobRequirementCategorySchema,
    necessity: JobRequirementNecessitySchema,
    assessmentState: JobRequirementAssessmentStateSchema,
    coverageState: JobRequirementCoverageStateSchema,
    proofStrength: JobAssessmentProofStrengthSchema,
    materiality: JobAssessmentMaterialitySchema,
    decision: JobRequirementEmphasisDecisionSchema,
    selectedLinkIds: z.array(z.string().min(1)),
    selectedEvidenceIds: z.array(z.string().min(1)),
    selectedClaimIds: z.array(z.string().min(1)),
    allowedTerminology: z.array(z.string().trim().min(1)),
    allowedSections: z.array(JobResumeSectionTypeSchema),
    rationaleCode: z.enum([
        "mandatory-strong-support",
        "mandatory-defensible-support",
        "preferred-defensible-support",
        "contextual-defensible-support",
        "mandatory-partial-support",
        "nonmandatory-partial-support",
        "unsupported-requirement",
        "contradicted-requirement",
        "indeterminate-requirement",
    ]),
    cautionCodes: z.array(z.enum([
        "do-not-overstate-partial-proof",
        "do-not-present-gap-as-strength",
        "do-not-use-adjacent-proof-as-direct",
        "do-not-hide-contradiction",
        "preserve-ambiguity",
    ])),
    provenance: JobPlanElementProvenanceSchema,
}).strict().superRefine((value, context) => {
    const selected = ["primary", "secondary", "supporting"].includes(value.decision);
    if (selected && value.selectedEvidenceIds.length === 0) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selected requirement emphasis requires selected evidence",
            path: ["selectedEvidenceIds"],
        });
    }
    if (!selected && value.selectedEvidenceIds.length > 0) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Deferred or excluded requirements cannot select evidence",
            path: ["selectedEvidenceIds"],
        });
    }
});
export const JobEvidenceRequirementUseSchema = z.object({
    requirementId: z.string().min(1),
    linkIds: z.array(z.string().min(1)).min(1),
    decision: JobEvidenceSelectionDecisionSchema,
    intendedSections: z.array(JobResumeSectionTypeSchema),
    purposeCode: z.enum([
        "primary-requirement-proof",
        "secondary-requirement-proof",
        "supporting-context",
        "deferred-proof",
        "excluded-proof",
    ]),
}).strict();
export const JobResumeEvidenceSelectionSchema = z.object({
    id: z.string().min(1),
    evidenceId: z.string().min(1),
    claimIds: z.array(z.string().min(1)).min(1),
    decision: JobEvidenceSelectionDecisionSchema,
    relationships: z.array(JobEvidenceRelationshipSchema).min(1),
    requirementUses: z.array(JobEvidenceRequirementUseSchema).min(1),
    intendedSections: z.array(JobResumeSectionTypeSchema),
    primaryRequirementId: z.string().min(1).optional(),
    reuseWarning: z.boolean(),
    boundaryIds: z.array(z.string().min(1)),
    limitationCodes: z.array(z.enum([
        "partial-relationship",
        "supporting-relationship-only",
        "limited-proof",
        "project-scoped",
        "historical-scope-only",
        "no-verified-metric",
        "multiple-section-reuse",
    ])),
    provenance: JobPlanElementProvenanceSchema,
}).strict();
export const JobResumeClaimBoundarySchema = z.object({
    id: z.string().min(1),
    kind: JobClaimBoundaryKindSchema,
    requirementId: z.string().min(1).optional(),
    evidenceIds: z.array(z.string().min(1)),
    claimIds: z.array(z.string().min(1)),
    state: JobClaimBoundaryStateSchema,
    allowedClaimTypes: z.array(JobResumeContentTypeSchema),
    prohibitedClaimTypes: z.array(JobResumeContentTypeSchema),
    requiredQualifierCodes: z.array(z.enum([
        "evidence-scoped-wording",
        "project-scoped-wording",
        "adjacent-not-direct",
        "partial-support-only",
        "exact-reviewed-metric-only",
        "target-title-positioning-only",
    ])),
    prohibitedInferenceCodes: z.array(z.enum([
        "target-title-as-employment",
        "project-as-employment",
        "responsibility-as-achievement",
        "contribution-as-ownership",
        "collaboration-as-management",
        "technical-exposure-as-expertise",
        "adjacent-technology-as-exact-experience",
        "domain-adjacency-as-direct-experience",
        "unsupported-seniority",
        "unsupported-authority",
        "unsupported-team-size",
        "unsupported-geography",
        "unsupported-scale",
        "unsupported-adoption",
        "unsupported-dates",
        "unsupported-outcomes",
        "unverified-metric",
    ])).min(1),
    rationaleCode: z.enum([
        "direct-reviewed-proof",
        "qualified-partial-proof",
        "deferred-or-ambiguous-proof",
        "unsupported-or-conflicting-proof",
        "target-title-not-history",
        "project-scope-not-employment",
        "metric-requires-verification",
        "scope-limited-to-reviewed-evidence",
    ]),
    provenance: JobPlanElementProvenanceSchema,
}).strict();
export const JobMetricPermissionSchema = z.object({
    id: z.string().min(1),
    evidenceId: z.string().min(1),
    claimId: z.string().min(1),
    state: JobMetricPermissionStateSchema,
    exactApprovedMetricText: z.string().trim().min(1).optional(),
    scope: z.object({
        parentRoleId: z.string().min(1).optional(),
        parentProjectId: z.string().min(1).optional(),
        sourceSection: z.string().min(1).optional(),
    }).strict(),
    qualifierCodes: z.array(z.enum([
        "use-exact-approved-text",
        "preserve-reviewed-scope",
        "do-not-round",
        "do-not-combine",
        "do-not-infer-scale",
    ])).min(1),
    allowedSections: z.array(JobResumeSectionTypeSchema),
    provenance: JobPlanElementProvenanceSchema,
}).strict().superRefine((value, context) => {
    if (value.state === "allowed" && !value.exactApprovedMetricText) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Allowed metric permission requires exact approved metric text",
            path: ["exactApprovedMetricText"],
        });
    }
    if (value.state === "prohibited" && value.exactApprovedMetricText) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Prohibited metric permission cannot expose metric text",
            path: ["exactApprovedMetricText"],
        });
    }
});
export const JobGapHandlingRuleSchema = z.object({
    id: z.string().min(1),
    requirementId: z.string().min(1),
    assessmentState: JobRequirementAssessmentStateSchema,
    decision: JobGapHandlingDecisionSchema,
    adjacentEvidenceIds: z.array(z.string().min(1)),
    adjacentClaimIds: z.array(z.string().min(1)),
    constraintCodes: z.array(z.enum([
        "not-positive-positioning",
        "not-direct-satisfaction",
        "no-compensating-narrative",
        "no-gap-closing-advice",
        "no-application-advice",
    ])).min(1),
    provenance: JobPlanElementProvenanceSchema,
}).strict();
export const JobResumeSectionPlanSchema = z.object({
    id: z.string().min(1),
    type: JobResumeSectionTypeSchema,
    inclusion: JobResumeSectionInclusionSchema,
    order: z.number().int().nonnegative(),
    objectiveCode: z.enum([
        "position-target-without-history-claim",
        "summarize-selected-proof-themes",
        "group-job-relevant-capabilities",
        "surface-reviewed-outcomes",
        "organize-reviewed-employment-evidence",
        "organize-project-scoped-evidence",
        "group-reviewed-technical-capabilities",
        "group-reviewed-leadership-capabilities",
        "retain-relevant-education",
        "retain-relevant-certifications",
        "retain-approved-additional-information",
    ]),
    requirementIds: z.array(z.string().min(1)),
    evidenceIds: z.array(z.string().min(1)),
    claimIds: z.array(z.string().min(1)),
    boundaryIds: z.array(z.string().min(1)),
    exclusionIds: z.array(z.string().min(1)),
    allowedContentTypes: z.array(JobResumeContentTypeSchema),
    maximumItemCount: z.number().int().positive().optional(),
    riskCodes: z.array(z.string().min(1)),
    warningCodes: z.array(z.string().min(1)),
    provenance: JobPlanElementProvenanceSchema,
}).strict();
export const JobResumeContentExclusionSchema = z.object({
    id: z.string().min(1),
    type: z.enum([
        "unsupported-requirement",
        "contradicted-requirement",
        "indeterminate-requirement",
        "unverified-metric",
        "target-title-history",
        "project-as-employment",
        "non-resume-ready-evidence",
        "private-evidence",
        "unapproved-claim",
        "unsupported-terminology",
        "unsupported-seniority-or-scope",
        "irrelevant-evidence",
        "duplicate-evidence-use",
    ]),
    sourceType: z.enum(["requirement", "evidence", "claim", "target", "policy"]),
    sourceIds: z.array(z.string().min(1)).min(1),
    reasonCode: z.enum([
        "no-reviewed-proof",
        "explicit-contradiction",
        "unresolved-ambiguity",
        "metric-not-verified",
        "target-title-is-not-history",
        "project-scope-is-not-employment",
        "evidence-not-eligible",
        "claim-not-eligible",
        "terminology-not-supported",
        "scope-not-supported",
        "not-selected-for-job-plan",
        "deduplicated-use",
    ]),
    severity: z.enum(["blocking", "high", "medium", "low"]),
    provenance: JobPlanElementProvenanceSchema,
}).strict();
const FindingReferences = {
    requirementIds: z.array(z.string().min(1)),
    evidenceIds: z.array(z.string().min(1)),
    claimIds: z.array(z.string().min(1)),
};
export const JobResumePlanningRiskSchema = z.object({
    id: z.string().min(1),
    code: z.enum([
        "MANDATORY_REQUIREMENT_NOT_POSITIONABLE",
        "PARTIAL_REQUIREMENT_OVERSTATEMENT_RISK",
        "TARGET_TITLE_HISTORY_RISK",
        "PROJECT_AS_EMPLOYMENT_RISK",
        "RESPONSIBILITY_AS_ACHIEVEMENT_RISK",
        "UNSUPPORTED_METRIC_RISK",
        "UNSUPPORTED_SCOPE_RISK",
        "UNSUPPORTED_SENIORITY_RISK",
        "EVIDENCE_OVERUSE_RISK",
        "REQUIREMENT_TERMINOLOGY_MISMATCH",
        "DEPENDENCY_STALE",
        "PROVENANCE_INCOMPLETE",
    ]),
    severity: z.enum(["critical", "high", "medium", "low"]),
    message: z.string().trim().min(1),
    ...FindingReferences,
}).strict();
export const JobResumePlanningWarningSchema = z.object({
    id: z.string().min(1),
    code: z.enum([
        "JOB_SPECIFIC_PLAN_ONLY",
        "NOT_A_RESUME",
        "NO_APPLICATION_RECOMMENDATION",
        "NO_ATS_SCORE",
        "REVIEWED_EVIDENCE_ONLY",
        "MATERIAL_GAP_EXCLUDED",
        "NO_VERIFIED_METRIC_AVAILABLE",
        "OPTIONAL_ESCALATION_NOT_PERFORMED",
    ]),
    message: z.string().trim().min(1),
    ...FindingReferences,
}).strict();
export const JobResumePlanningAmbiguitySchema = z.object({
    id: z.string().min(1),
    code: z.enum([
        "REQUIREMENT_POSITIONING_DEFERRED",
        "ADJACENT_EVIDENCE_NOT_DIRECT",
        "PROJECT_EMPLOYMENT_BOUNDARY",
        "RESPONSIBILITY_ACHIEVEMENT_BOUNDARY",
        "TERMINOLOGY_USE_UNCLEAR",
        "EVIDENCE_REUSE_BOUNDARY",
        "UPSTREAM_AMBIGUITY_PRESERVED",
    ]),
    message: z.string().trim().min(1),
    ...FindingReferences,
}).strict();
export const JobResumePlanCompletenessSchema = z.object({
    status: z.enum(["empty", "partial", "complete"]),
    requirementIds: z.array(z.string().min(1)),
    plannedRequirementIds: z.array(z.string().min(1)),
    selectedRequirementIds: z.array(z.string().min(1)),
    deferredRequirementIds: z.array(z.string().min(1)),
    excludedRequirementIds: z.array(z.string().min(1)),
    includedSectionTypes: z.array(JobResumeSectionTypeSchema),
    claimBoundariesComplete: z.boolean(),
    provenanceComplete: z.boolean(),
    criticalConstraintsRepresented: z.boolean(),
    usableForDrafting: z.boolean(),
    blockingReasons: z.array(z.string().trim().min(1)),
}).strict().superRefine((value, context) => {
    const required = new Set(value.requirementIds);
    const planned = new Set(value.plannedRequirementIds);
    if (required.size !== value.requirementIds.length ||
        planned.size !== value.plannedRequirementIds.length ||
        required.size !== planned.size ||
        [...required].some((id) => !planned.has(id))) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Every requirement must have exactly one planning decision",
            path: ["plannedRequirementIds"],
        });
    }
    if (value.usableForDrafting &&
        (value.status !== "complete" ||
            !value.claimBoundariesComplete ||
            !value.provenanceComplete ||
            !value.criticalConstraintsRepresented)) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Drafting usability requires a complete constrained plan",
            path: ["usableForDrafting"],
        });
    }
});
export const JobResumeContentPlanSchema = z.object({
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    targetId: TargetIdSchema,
    targetType: z.literal("job"),
    mode: JobResumePlanningModeSchema,
    policy: z.object({
        name: z.string().min(1),
        version: z.string().min(1),
        mode: z.literal("deterministic"),
    }).strict(),
    input: z.object({
        target: JobPlanFileDependencySchema,
        jobDescription: JobPlanFileDependencySchema,
        requirementModelType: JobRequirementInputTypeSchema,
        requirementModel: JobPlanDependencySchema,
        evidenceMap: JobPlanDependencySchema,
        coverage: JobPlanDependencySchema,
        assessment: JobPlanDependencySchema,
        sources: JobPlanFileDependencySchema,
        evidenceItems: JobPlanFileDependencySchema,
        claims: JobPlanFileDependencySchema,
        selectedEvidenceSetSha256: Sha256Schema,
        selectedClaimSetSha256: Sha256Schema,
        normalizedInputSha256: Sha256Schema,
    }).strict(),
    positioning: JobResumePositioningSchema,
    requirementEmphasis: z.array(JobRequirementEmphasisSchema),
    evidenceSelections: z.array(JobResumeEvidenceSelectionSchema),
    sections: z.array(JobResumeSectionPlanSchema),
    claimBoundaries: z.array(JobResumeClaimBoundarySchema),
    metricPermissions: z.array(JobMetricPermissionSchema),
    gapHandling: z.array(JobGapHandlingRuleSchema),
    exclusions: z.array(JobResumeContentExclusionSchema),
    risks: z.array(JobResumePlanningRiskSchema),
    warnings: z.array(JobResumePlanningWarningSchema),
    ambiguities: z.array(JobResumePlanningAmbiguitySchema),
    completeness: JobResumePlanCompletenessSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict().superRefine((value, context) => {
    const requirementIds = value.requirementEmphasis.map((entry) => entry.requirementId);
    if (new Set(requirementIds).size !== requirementIds.length) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Requirement planning decisions must be unique",
            path: ["requirementEmphasis"],
        });
    }
    const evidenceIds = value.evidenceSelections.map((entry) => entry.evidenceId);
    if (new Set(evidenceIds).size !== evidenceIds.length) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Evidence selections must be deduplicated by evidence ID",
            path: ["evidenceSelections"],
        });
    }
    const includedOrders = value.sections
        .filter((entry) => entry.inclusion !== "exclude")
        .map((entry) => entry.order);
    if (new Set(includedOrders).size !== includedOrders.length) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Included section order must be unique",
            path: ["sections"],
        });
    }
    if (value.positioning.state === "insufficient-proof" ||
        value.positioning.state === "indeterminate") {
        if (value.completeness.usableForDrafting) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Insufficient or indeterminate positioning is not usable for drafting",
                path: ["completeness", "usableForDrafting"],
            });
        }
    }
});
export const JobResumeContentPlanManifestSchema = z.object({
    schemaVersion: z.literal(1),
    manifestId: z.string().min(1),
    planId: z.string().min(1),
    targetId: TargetIdSchema,
    targetType: z.literal("job"),
    mode: JobResumePlanningModeSchema,
    planPath: RelativeWorkspacePathSchema,
    planSha256: Sha256Schema,
    policyName: z.string().min(1),
    policyVersion: z.string().min(1),
    targetSha256: Sha256Schema,
    sourceSha256: Sha256Schema,
    requirementModelType: JobRequirementInputTypeSchema,
    requirementModelSha256: Sha256Schema,
    requirementManifestSha256: Sha256Schema,
    evidenceMapSha256: Sha256Schema,
    evidenceMapManifestSha256: Sha256Schema,
    coverageSha256: Sha256Schema,
    coverageManifestSha256: Sha256Schema,
    assessmentSha256: Sha256Schema,
    assessmentManifestSha256: Sha256Schema,
    sourcesSha256: Sha256Schema,
    evidenceItemsSha256: Sha256Schema,
    claimsSha256: Sha256Schema,
    selectedEvidenceSetSha256: Sha256Schema,
    selectedClaimSetSha256: Sha256Schema,
    normalizedInputSha256: Sha256Schema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
