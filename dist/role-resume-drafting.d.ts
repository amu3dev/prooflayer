import { type RoleResumeDraftScaffold, type RoleResumeDraftScaffoldManifest } from "./role-resume-draft-schemas.js";
import { type RoleResumeContentPlan } from "./role-resume-plan-schemas.js";
import { type RoleResumePlanningContext } from "./role-resume-planning.js";
export declare const ROLE_RESUME_DRAFTING_POLICY_NAME = "role-resume-drafting-policy";
export declare const ROLE_RESUME_DRAFTING_POLICY_VERSION = "1";
export interface RoleResumeDraftingContext extends RoleResumePlanningContext {
    approvedPlan: RoleResumeContentPlan;
    approvedPlanPath: string;
    approvedPlanSha256: string;
    approvedPlanManifestPath: string;
    approvedPlanManifestSha256: string;
}
export interface BuildRoleResumeDraftScaffoldOptions {
    rebuild?: boolean;
    now?: () => Date;
}
export interface BuildRoleResumeDraftScaffoldResult {
    targetId: string;
    result: "created" | "rebuilt" | "already-current";
    scaffoldId: string;
    scaffoldPath: string;
    manifestPath: string;
    includedSectionCount: number;
    excludedSectionCount: number;
    placeholderCount: number;
}
export interface RoleResumeDraftScaffoldStatus {
    targetId: string;
    scaffoldExists: boolean;
    manifestExists: boolean;
    scaffoldHashMatches: boolean | null;
    dependenciesMatch: boolean | null;
    policyVersionMatches: boolean | null;
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    scaffoldPath: string;
    manifestPath: string;
}
export declare function loadRoleResumeDraftingContext(workspace: string, targetId: string): Promise<RoleResumeDraftingContext>;
export declare function buildRoleResumeDraftScaffold(workspace: string, targetId: string, options?: BuildRoleResumeDraftScaffoldOptions): Promise<BuildRoleResumeDraftScaffoldResult>;
export declare function deriveRoleResumeDraftScaffold(context: RoleResumeDraftingContext, createdAt: string, updatedAt: string): RoleResumeDraftScaffold;
export declare function showRoleResumeDraftScaffold(workspace: string, targetId: string): Promise<RoleResumeDraftScaffold>;
export declare function getRoleResumeDraftScaffoldStatus(workspace: string, targetId: string): Promise<RoleResumeDraftScaffoldStatus>;
export declare function assertRoleResumeDraftScaffoldConsistency(scaffold: RoleResumeDraftScaffold, context: RoleResumeDraftingContext): void;
export declare function deterministicRoleResumeDraftScaffoldId(context: RoleResumeDraftingContext): string;
export declare function roleResumeDraftScaffoldPaths(workspace: string, targetId: string): {
    scaffoldRelativePath: string;
    scaffoldPath: string;
    manifestRelativePath: string;
    manifestPath: string;
};
export declare function createRoleResumeDraftScaffoldManifest(scaffold: RoleResumeDraftScaffold, context: RoleResumeDraftingContext, scaffoldPath: string, scaffoldSha256: string, createdAt: string, updatedAt: string): RoleResumeDraftScaffoldManifest;
export declare function formatBuildRoleResumeDraftScaffoldResult(result: BuildRoleResumeDraftScaffoldResult): string;
export declare function formatRoleResumeDraftScaffoldStatus(status: RoleResumeDraftScaffoldStatus): string;
