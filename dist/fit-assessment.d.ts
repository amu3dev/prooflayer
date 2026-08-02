import { type ApprovedTargetExpectation, type ApprovedTargetInterpretation, type EvidenceMatch, type ExpectationCoverageRecord, type Target, type TargetEvidenceMatching } from "./schemas.js";
import { type AssessmentMode, type AssessmentRisk, type ExpectationFitAssessment, type FitAssessmentAmbiguity, type FitAssessmentCompleteness, type FitAssessmentManifest, type FitAssessmentSummary, type FitAssessmentWarning, type JobFitAssessmentSummary, type Materiality, type RoleFitAssessmentSummary, type SupportStatus, type TargetFitAssessment } from "./fit-assessment-schemas.js";
export declare const FIT_ASSESSMENT_POLICY_NAME = "fit-proof-assessment-policy";
export declare const FIT_ASSESSMENT_POLICY_VERSION = "1";
export interface AssessmentContext {
    target: Target;
    targetSha256: string;
    mode: AssessmentMode;
    approvedInterpretation: ApprovedTargetInterpretation;
    approvedInterpretationPath: string;
    approvedInterpretationSha256: string;
    approvedInterpretationManifestPath: string;
    approvedInterpretationManifestSha256: string;
    approvedMatching: TargetEvidenceMatching;
    approvedMatchingPath: string;
    approvedMatchingSha256: string;
    approvedMatchingManifestPath: string;
    approvedMatchingManifestSha256: string;
    evidenceSnapshotSha256: string;
    expectationSetSha256: string;
    approvedMatchSetSha256: string;
}
export interface BuildFitAssessmentOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface BuildFitAssessmentResult {
    targetId: string;
    targetType: "role" | "job";
    mode: AssessmentMode;
    result: "created" | "rebuilt" | "already-current";
    assessmentId: string;
    assessmentPath: string;
    manifestPath: string;
    expectationCount: number;
    completeness: "empty" | "partial" | "complete";
    usableForResumeConstruction: boolean;
    usableForApplicationConstruction: boolean;
    warningCount: number;
    riskCount: number;
}
export interface FitAssessmentStatus {
    targetId: string;
    targetType: "role" | "job";
    mode: AssessmentMode;
    artifactType: "deterministic" | "approved";
    assessmentExists: boolean;
    manifestExists: boolean;
    assessmentHashMatches: boolean | null;
    targetHashMatches: boolean | null;
    approvedInterpretationHashMatches: boolean | null;
    approvedInterpretationManifestHashMatches: boolean | null;
    approvedMatchingHashMatches: boolean | null;
    approvedMatchingManifestHashMatches: boolean | null;
    evidenceSnapshotHashMatches: boolean | null;
    expectationSetHashMatches: boolean | null;
    approvedMatchSetHashMatches: boolean | null;
    policyVersionMatches: boolean | null;
    proposalHashMatches: boolean | null;
    reviewHashMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    assessmentPath: string;
    manifestPath: string;
}
export declare function loadAssessmentContext(workspace: string, targetId: string): Promise<AssessmentContext>;
export declare function buildFitAssessment(workspace: string, targetId: string, options?: BuildFitAssessmentOptions): Promise<BuildFitAssessmentResult>;
export declare function promoteDeterministicRoleFitAssessment(workspace: string, targetId: string, options?: BuildFitAssessmentOptions): Promise<BuildFitAssessmentResult>;
export declare function showFitAssessment(workspace: string, targetId: string, artifactType?: "deterministic" | "approved"): Promise<TargetFitAssessment>;
export declare function getFitAssessmentStatus(workspace: string, targetId: string, artifactType?: "deterministic" | "approved"): Promise<FitAssessmentStatus>;
export declare function deriveTargetFitAssessment(context: AssessmentContext, createdAt: string, updatedAt: string): TargetFitAssessment;
export declare function deriveExpectationFitAssessment(context: AssessmentContext, expectation: ApprovedTargetExpectation, coverage: ExpectationCoverageRecord, matches: EvidenceMatch[]): ExpectationFitAssessment;
export declare function deriveSupportStatus(coverage: ExpectationCoverageRecord["status"], matches: EvidenceMatch[]): SupportStatus;
export declare function deriveMateriality(necessity: ApprovedTargetExpectation["necessity"], importance: ApprovedTargetExpectation["importance"]): Materiality;
export declare function deriveSummary(mode: AssessmentMode, assessments: ExpectationFitAssessment[], completeness: FitAssessmentCompleteness): FitAssessmentSummary;
export declare function deriveRoleSummary(assessments: ExpectationFitAssessment[], completeness: FitAssessmentCompleteness): RoleFitAssessmentSummary;
export declare function deriveJobSummary(assessments: ExpectationFitAssessment[], completeness: FitAssessmentCompleteness): JobFitAssessmentSummary;
export declare function assertAssessmentConsistency(assessment: TargetFitAssessment, context: AssessmentContext): void;
export declare function createAssessmentManifest(assessment: TargetFitAssessment, context: AssessmentContext, assessmentPath: string, assessmentSha256: string, artifactType: "deterministic" | "approved", createdAt: string, updatedAt: string, reviewDependencies?: {
    proposalId?: string;
    proposalSha256?: string;
    reviewSha256?: string;
}): FitAssessmentManifest;
export declare function deterministicAssessmentId(context: AssessmentContext): string;
export declare function expectationAssessmentId(targetId: string, expectationId: string, approvedMatchingSha256: string): string;
export declare function formatBuildFitAssessmentResult(result: BuildFitAssessmentResult): string;
export declare function formatFitAssessmentStatus(status: FitAssessmentStatus): string;
export declare function assessmentPaths(workspace: string, target: Target, artifactType: "deterministic" | "approved"): {
    root: string;
    assessmentRelativePath: string;
    assessmentPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export declare function deriveCompleteness(targetType: "role" | "job", assessments: ExpectationFitAssessment[], matchingStatus: "empty" | "partial" | "complete"): FitAssessmentCompleteness;
export declare function deriveRisks(targetId: string, assessments: ExpectationFitAssessment[], completeness: FitAssessmentCompleteness): AssessmentRisk[];
export declare function deriveWarnings(targetId: string, assessments: ExpectationFitAssessment[], completeness: FitAssessmentCompleteness): FitAssessmentWarning[];
export declare function deriveAmbiguities(targetId: string, assessments: ExpectationFitAssessment[]): FitAssessmentAmbiguity[];
