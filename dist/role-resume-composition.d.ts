import { type CareerProfile, type PublicProfile } from "./schemas.js";
import { type RoleResumeComposition, type RoleResumeCompositionCompleteness } from "./role-resume-composition-schemas.js";
import { showRoleResumePlan, type RoleResumePlanningContext } from "./role-resume-planning.js";
export declare const ROLE_RESUME_COMPOSITION_POLICY_NAME = "role-resume-composition-policy";
export declare const ROLE_RESUME_COMPOSITION_POLICY_VERSION = "1";
export declare const CAREER_PROFILE_PATH = "kb/career-profile.json";
export interface RoleResumeCompositionContext extends RoleResumePlanningContext {
    approvedPlan: Awaited<ReturnType<typeof showRoleResumePlan>>;
    approvedPlanPath: string;
    approvedPlanSha256: string;
    approvedPlanManifestPath: string;
    approvedPlanManifestSha256: string;
    careerProfile: CareerProfile;
    careerProfileSha256: string;
    publicProfile: PublicProfile | null;
    publicProfileSha256: string;
}
export interface BuildRoleResumeCompositionOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface RoleResumeCompositionStatus {
    targetId: string;
    compositionExists: boolean;
    manifestExists: boolean;
    compositionHashMatches: boolean | null;
    dependenciesMatch: boolean | null;
    policyVersionMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    usableForDrafting: boolean;
    reasons: string[];
    compositionPath: string;
    manifestPath: string;
}
export declare function loadRoleResumeCompositionContext(workspace: string, targetId: string): Promise<RoleResumeCompositionContext>;
export declare function buildRoleResumeComposition(workspace: string, targetId: string, options?: BuildRoleResumeCompositionOptions): Promise<{
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    compositionId: string;
    completeness: "blocked" | "complete" | "incomplete" | "constrained-but-usable";
    usableForDrafting: boolean;
    experienceEntryCount: number;
    projectEntryCount: number;
    skillCount: number;
    compositionPath: string;
    manifestPath: string;
}>;
export declare function deriveRoleResumeComposition(context: RoleResumeCompositionContext, createdAt: string, updatedAt: string): RoleResumeComposition;
export declare function evaluateRoleResumeDraftAgainstComposition(composition: RoleResumeComposition, sections: Array<{
    items: Array<{
        compositionSlotId: string;
        text: string;
        evidenceIds: string[];
    }>;
}>): RoleResumeCompositionCompleteness;
export declare function showRoleResumeComposition(workspace: string, targetId: string): Promise<{
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    mode: "market-positioning";
    sections: {
        type: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        status: "exclude" | "include" | "optional";
        id: string;
        order: number;
        planSectionId: string;
        objective: string;
        slotIds: string[];
        requiredSlotIds: string[];
    }[];
    targetType: "role";
    targetId: string;
    completeness: {
        status: "blocked" | "complete" | "incomplete" | "constrained-but-usable";
        warnings: string[];
        blockingReasons: string[];
        usableForDrafting: boolean;
        identityPresent: boolean;
        selectedEvidenceAccounted: boolean;
        matureCareerTwin: boolean;
        headlinePlanned: boolean;
        summaryPlanned: boolean;
        capabilityThemeCount: number;
        includedExperienceCount: number;
        includedProjectCount: number;
        includedSkillCount: number;
        evidenceBackedBulletSlotCount: number;
        selectedEvidenceCount: number;
        accountedSelectedEvidenceCount: number;
        careerEntriesAccounted: boolean;
    };
    provenance: {
        targetSha256: string;
        approvedInterpretationSha256: string;
        eligibleEvidenceSetSha256: string;
        approvedMatchingSha256: string;
        evidenceSnapshotSha256: string;
        selectedEvidenceSetSha256: string;
        approvedAssessmentSha256: string;
        approvedPlanSha256: string;
        approvedPlanManifestSha256: string;
        careerProfileSha256: string;
        publicProfileSha256: string;
        careerProfilePath: string;
        publicProfilePath: string;
    };
    skills: {
        decision: "exclude" | "include";
        id: string;
        rationale: string;
        evidenceIds: string[];
        label: string;
        order: number;
    }[];
    policy: {
        name: "role-resume-composition-policy";
        version: "1";
    };
    exclusions: {
        reason: string;
        id: string;
        label: string;
        subjectType: "role" | "project" | "skill" | "section" | "evidence";
        subjectId: string;
    }[];
    roleTitle: string;
    identity: {
        source: "unavailable" | "public-profile";
        contactItems: string[];
        name?: string | undefined;
    };
    approvedPlan: {
        sha256: string;
        path: string;
        manifestPath: string;
        manifestSha256: string;
    };
    experienceEntries: {
        decision: "exclude" | "include";
        id: string;
        sourceType: "role" | "project";
        rationale: string;
        evidenceIds: string[];
        technologies: string[];
        domains: string[];
        label: string;
        selectedEvidenceIds: string[];
        order: number;
        sourceIndex: number;
        title?: string | undefined;
        dateRange?: string | undefined;
        organization?: string | undefined;
    }[];
    projectEntries: {
        decision: "exclude" | "include";
        id: string;
        sourceType: "role" | "project";
        rationale: string;
        evidenceIds: string[];
        technologies: string[];
        domains: string[];
        label: string;
        selectedEvidenceIds: string[];
        order: number;
        sourceIndex: number;
        title?: string | undefined;
        dateRange?: string | undefined;
        organization?: string | undefined;
    }[];
    slots: {
        id: string;
        required: boolean;
        mode: "fixed" | "provider-worded";
        sourceExpectationIds: string[];
        rationale: string;
        evidenceIds: string[];
        approvedMatchIds: string[];
        qualifiers: string[];
        order: number;
        claimBoundaryIds: string[];
        itemType: "capability" | "project" | "certification" | "education" | "summary" | "technology" | "headline" | "additional-information" | "impact" | "experience-role" | "experience-bullet" | "leadership-capability" | "identity" | "contact" | "project-bullet";
        claimTypes: ("domain" | "responsibility" | "project" | "certification" | "education" | "achievement" | "scope" | "technology" | "role-title" | "capability-theme" | "quantified-outcome" | "leadership-behavior" | "delivery-outcome" | "product-outcome" | "business-outcome")[];
        sectionType: "education" | "headline" | "professional-summary" | "core-capabilities" | "selected-impact" | "professional-experience" | "selected-projects" | "technical-capabilities" | "leadership-capabilities" | "certifications" | "additional-information";
        sourceAssessmentIds: string[];
        sourceLabel: string;
        exactText?: string | undefined;
        careerEntryId?: string | undefined;
    }[];
}>;
export declare function getRoleResumeCompositionStatus(workspace: string, targetId: string): Promise<RoleResumeCompositionStatus>;
export declare function roleResumeCompositionPaths(workspace: string, targetId: string): {
    compositionRelativePath: string;
    compositionPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export declare function formatBuildRoleResumeCompositionResult(result: Awaited<ReturnType<typeof buildRoleResumeComposition>>): string;
export declare function formatRoleResumeCompositionStatus(status: RoleResumeCompositionStatus): string;
