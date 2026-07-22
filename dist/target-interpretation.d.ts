import { type RoleProfile, type Target, type TargetAnalysis, type TargetInterpretation } from "./schemas.js";
export declare const TARGET_INTERPRETER_NAME = "target-semantics";
export declare const TARGET_INTERPRETER_VERSION = "1";
export declare const TARGET_INTERPRETATION_POLICY_VERSION = "1";
export declare const ROLE_PROFILES_DIRECTORY = "role-profiles";
export interface LoadedRoleProfile {
    profile: RoleProfile;
    relativePath: string;
    absolutePath: string;
    sha256: string;
    bytes: Buffer;
}
export interface SemanticTargetInterpretationInput {
    target: Target;
    targetPath: string;
    targetSha256: string;
    structuralAnalysis: TargetAnalysis;
    structuralAnalysisPath: string;
    structuralAnalysisSha256: string;
    roleProfile?: LoadedRoleProfile;
    createdAt: string;
    updatedAt: string;
}
export interface SemanticTargetInterpreter {
    readonly name: string;
    readonly version: string;
    readonly mode: "deterministic" | "manual";
    readonly policyVersion: string;
    interpret(input: SemanticTargetInterpretationInput): Promise<TargetInterpretation>;
}
interface InterpretOptions {
    roleProfile?: string;
    rebuild?: boolean;
    now?: () => Date;
    interpreterName?: string;
    interpreterVersion?: string;
    policyVersion?: string;
}
export interface InterpretTargetResult {
    targetId: string;
    targetType: "role" | "job";
    result: "created" | "rebuilt" | "already-current";
    interpreterName: string;
    interpreterVersion: string;
    policyVersion: string;
    interpretationPath: string;
    manifestPath: string;
    expectationCount: number;
    groupCount: number;
    ambiguityCount: number;
    warningCount: number;
    roleProfilePath?: string;
    roleProfileSha256?: string;
}
export interface TargetInterpretationStatus {
    targetId: string;
    targetType: "role" | "job";
    interpretationExists: boolean;
    manifestExists: boolean;
    targetHashMatches: boolean | null;
    structuralAnalysisHashMatches: boolean | null;
    roleProfileHashMatches: boolean | null;
    interpreterNameMatches: boolean | null;
    interpreterVersionMatches: boolean | null;
    policyVersionMatches: boolean | null;
    interpretationHashMatches: boolean | null;
    status: "current" | "missing" | "stale" | "invalid";
    reasons: string[];
    interpretationPath: string;
    manifestPath: string;
}
export declare function loadRoleProfile(workspace: string, inputPath: string, target?: Target): Promise<LoadedRoleProfile>;
export declare class DeterministicSemanticTargetInterpreter implements SemanticTargetInterpreter {
    readonly name: string;
    readonly version: string;
    readonly mode: "deterministic";
    readonly policyVersion: string;
    constructor(options?: Pick<InterpretOptions, "interpreterName" | "interpreterVersion" | "policyVersion">);
    interpret(input: SemanticTargetInterpretationInput): Promise<TargetInterpretation>;
}
export declare function getTargetInterpretationStatus(workspace: string, targetId: string, options?: Pick<InterpretOptions, "roleProfile" | "interpreterName" | "interpreterVersion" | "policyVersion">): Promise<TargetInterpretationStatus>;
export declare function interpretTarget(workspace: string, targetId: string, options?: InterpretOptions): Promise<InterpretTargetResult>;
export declare function showTargetInterpretation(workspace: string, targetId: string): Promise<TargetInterpretation>;
export declare function formatInterpretTargetResult(result: InterpretTargetResult): string;
export declare function formatTargetInterpretationStatus(status: TargetInterpretationStatus): string;
export declare function interpretationFileTimestamps(workspace: string, targetId: string): Promise<{
    interpretationMtimeMs: number;
    manifestMtimeMs: number;
}>;
export {};
