import { type Target } from "./schemas.js";
export declare const ROLE_TARGETS_DIRECTORY = "targets/roles";
export declare const JOB_TARGETS_DIRECTORY = "targets/jobs";
export declare const TARGET_FILE_NAME = "target.json";
export declare const JOB_DESCRIPTION_FILE_NAME = "job-description.md";
export type RoleTargetInput = {
    title: string;
    seniority?: string;
    domain?: string;
    location?: string;
    workingModel?: string;
};
export type JobTargetInput = {
    file: string;
    title?: string;
    company?: string;
    location?: string;
    workingModel?: string;
};
export type TargetCreationOptions = {
    replace?: boolean;
    now?: () => Date;
};
export type TargetCreationResult = {
    target: Target;
    targetPath: string;
    persistedSourcePath?: string;
};
export declare function createRoleTarget(workspace: string, input: RoleTargetInput, options?: TargetCreationOptions): Promise<TargetCreationResult>;
export declare function createJobTarget(workspace: string, input: JobTargetInput, options?: TargetCreationOptions): Promise<TargetCreationResult>;
export declare function listTargets(workspace: string): Promise<Target[]>;
export declare function showTarget(workspace: string, targetId: string): Promise<Target>;
export declare function formatTargetCreation(result: TargetCreationResult): string;
export declare function formatTargetList(targets: Target[]): string;
export declare function formatTargetJson(target: Target): string;
