import { type EvidenceItem, type RoleTarget } from "./schemas.js";
import { type ExpectationFitAssessment, type TargetFitAssessment } from "./fit-assessment-schemas.js";
import { type AssessmentContext } from "./fit-assessment.js";
import { type ResumeClaimBoundary, type ResumeEvidenceSelection, type ResumeExpectationSelection, type ResumePlanningAmbiguity, type ResumePlanningRisk, type ResumePlanningWarning, type RolePositioningPlan, type RoleResumeContentPlan, type RoleResumePlanCompleteness, type RoleResumePlanManifest, type RoleResumeSectionPlan } from "./role-resume-plan-schemas.js";
export declare const ROLE_RESUME_PLANNING_POLICY_NAME = "role-resume-content-planning-policy";
export declare const ROLE_RESUME_PLANNING_POLICY_VERSION = "1";
export interface RoleResumePlanningContext extends AssessmentContext {
    target: RoleTarget;
    approvedAssessment: TargetFitAssessment & {
        targetType: "role";
        mode: "role-positioning";
    };
    approvedAssessmentPath: string;
    approvedAssessmentSha256: string;
    approvedAssessmentManifestPath: string;
    approvedAssessmentManifestSha256: string;
    assessmentSetSha256: string;
    evidenceSetSha256: string;
    evidenceItems: EvidenceItem[];
    reviewedMetricEvidenceIds: Set<string>;
    reviewedMetrics: Array<{
        claimId: string;
        evidenceIds: string[];
        exactText: string;
        unit?: string;
        attributionScope?: string;
        qualifiers: string[];
    }>;
}
export interface BuildRoleResumePlanOptions {
    rebuild?: boolean;
    allowPartial?: boolean;
    now?: () => Date;
}
export interface BuildRoleResumePlanResult {
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    planId: string;
    planPath: string;
    manifestPath: string;
    positioningScope: RolePositioningPlan["positioningScope"];
    sectionCount: number;
    selectedExpectationCount: number;
    completeness: RoleResumePlanCompleteness["status"];
    usableForResumeDrafting: boolean;
    warningCount: number;
    riskCount: number;
}
export interface RoleResumePlanStatus {
    targetId: string;
    artifactType: "deterministic" | "approved";
    planExists: boolean;
    manifestExists: boolean;
    planHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    interpretationHashMatches: boolean | null;
    matchingHashMatches: boolean | null;
    assessmentHashMatches: boolean | null;
    evidenceSnapshotHashMatches: boolean | null;
    policyVersionMatches: boolean | null;
    proposalHashMatches: boolean | null;
    reviewHashMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    planPath: string;
    manifestPath: string;
}
export declare function loadRoleResumePlanningContext(workspace: string, targetId: string, options?: {
    allowPartial?: boolean;
}): Promise<RoleResumePlanningContext>;
export declare function buildRoleResumePlan(workspace: string, targetId: string, options?: BuildRoleResumePlanOptions): Promise<BuildRoleResumePlanResult>;
export declare function promoteDeterministicRoleResumePlan(workspace: string, targetId: string, options?: BuildRoleResumePlanOptions): Promise<BuildRoleResumePlanResult>;
export declare function showRoleResumePlan(workspace: string, targetId: string, artifactType?: "deterministic" | "approved"): Promise<RoleResumeContentPlan>;
export declare function getRoleResumePlanStatus(workspace: string, targetId: string, artifactType?: "deterministic" | "approved"): Promise<RoleResumePlanStatus>;
export declare function deriveRoleResumeContentPlan(context: RoleResumePlanningContext, createdAt: string, updatedAt: string, allowPartial?: boolean): RoleResumeContentPlan;
export declare function deriveExpectationSelection(context: RoleResumePlanningContext, planId: string, entry: ExpectationFitAssessment): ResumeExpectationSelection;
export declare function derivePositioningScope(summary: TargetFitAssessment["summary"]): RolePositioningPlan["positioningScope"];
export declare function assertRoleResumePlanConsistency(plan: RoleResumeContentPlan, context: RoleResumePlanningContext): void;
export declare function createRoleResumePlanManifest(plan: RoleResumeContentPlan, context: RoleResumePlanningContext, planPath: string, planSha256: string, artifactType: "deterministic" | "approved", createdAt: string, updatedAt: string, review?: {
    proposalId?: string;
    proposalSha256?: string;
    reviewSha256?: string;
}): RoleResumePlanManifest;
export declare function deterministicRoleResumePlanId(context: RoleResumePlanningContext): string;
export declare function roleResumePlanPaths(workspace: string, targetId: string, artifactType: "deterministic" | "approved"): {
    root: string;
    planRelativePath: string;
    planPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export declare function formatBuildRoleResumePlanResult(result: BuildRoleResumePlanResult): string;
export declare function formatRoleResumePlanStatus(status: RoleResumePlanStatus): string;
export declare function derivePlanCompleteness(selections: ResumeExpectationSelection[], sections: RoleResumeSectionPlan[], positioning: RolePositioningPlan, boundaries: ResumeClaimBoundary[], assessmentStatus: "empty" | "partial" | "complete", allowPartial: boolean): RoleResumePlanCompleteness;
export declare function derivePlanRisks(targetId: string, selections: ResumeExpectationSelection[], evidence: ResumeEvidenceSelection[], completeness: RoleResumePlanCompleteness): ResumePlanningRisk[];
export declare function derivePlanWarnings(targetId: string, selections: ResumeExpectationSelection[], evidence: ResumeEvidenceSelection[], positioning: RolePositioningPlan): ResumePlanningWarning[];
export declare function derivePlanAmbiguities(targetId: string, selections: ResumeExpectationSelection[], evidence: ResumeEvidenceSelection[]): ResumePlanningAmbiguity[];
