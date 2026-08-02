import { z } from "zod";
import { type InterpretationModelProvider } from "./model-provider.js";
import { type RoleTargetInput, type TargetCreationOptions, type TargetCreationResult } from "./targets.js";
import { type RoleTarget } from "./schemas.js";
import { type RoleResumeRenderOptions } from "./role-resume-rendering.js";
import { type ExportRoleResumeResult, type RoleResumeBinaryToolchain } from "./role-resume-render-export.js";
import type { RoleResumeExportFormat } from "./role-resume-render-schemas.js";
export declare const GUIDED_ROLE_POLICY_NAME = "guided-role-resume-policy";
export declare const GUIDED_ROLE_POLICY_VERSION = "1";
export declare const ROLE_UNDERSTANDING_TAXONOMY_NAME = "prooflayer-built-in-role-taxonomy";
export declare const ROLE_UNDERSTANDING_TAXONOMY_VERSION = "1";
export declare const ROLE_UNDERSTANDING_PROMPT_ID = "target-role-understanding-proposal";
export declare const ROLE_UNDERSTANDING_PROMPT_VERSION = "1";
export declare const GeneratedRoleUnderstandingSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodLiteral<"role">;
    state: z.ZodEnum<["generated", "generated-with-ambiguity"]>;
    title: z.ZodString;
    summary: z.ZodString;
    seniority: z.ZodOptional<z.ZodString>;
    positioning: z.ZodString;
    specialization: z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        source: z.ZodEnum<["conservative-default", "target-metadata", "user-choice"]>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        source: "conservative-default" | "target-metadata" | "user-choice";
        label: string;
    }, {
        id: string;
        source: "conservative-default" | "target-metadata" | "user-choice";
        label: string;
    }>;
    expectations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["responsibility", "capability", "leadership", "technical", "business", "operating-context"]>;
        statement: z.ZodString;
        necessity: z.ZodEnum<["required", "preferred", "contextual"]>;
        importance: z.ZodEnum<["critical", "high", "medium", "low"]>;
        capabilityTags: z.ZodArray<z.ZodString, "many">;
        group: z.ZodEnum<["responsibilities", "capabilities", "leadership", "technical", "business", "operating-context"]>;
        trustState: z.ZodLiteral<"generated">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        kind: "responsibility" | "capability" | "leadership" | "operating-context" | "technical" | "business";
        statement: string;
        necessity: "required" | "preferred" | "contextual";
        importance: "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "responsibilities" | "leadership" | "operating-context" | "technical" | "capabilities" | "business";
        trustState: "generated";
    }, {
        id: string;
        kind: "responsibility" | "capability" | "leadership" | "operating-context" | "technical" | "business";
        statement: string;
        necessity: "required" | "preferred" | "contextual";
        importance: "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "responsibilities" | "leadership" | "operating-context" | "technical" | "capabilities" | "business";
        trustState: "generated";
    }>, "many">;
    ambiguities: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        question: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            id: string;
            label: string;
        }, {
            id: string;
            label: string;
        }>, "many">;
        selectedOptionId: z.ZodString;
        selectionSource: z.ZodEnum<["conservative-default", "target-metadata", "user-choice"]>;
        material: z.ZodBoolean;
    }, "strict", z.ZodTypeAny, {
        options: {
            id: string;
            label: string;
        }[];
        id: string;
        material: boolean;
        question: string;
        selectedOptionId: string;
        selectionSource: "conservative-default" | "target-metadata" | "user-choice";
    }, {
        options: {
            id: string;
            label: string;
        }[];
        id: string;
        material: boolean;
        question: string;
        selectedOptionId: string;
        selectionSource: "conservative-default" | "target-metadata" | "user-choice";
    }>, "many">;
    source: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"built-in-taxonomy">;
        taxonomyName: z.ZodLiteral<"prooflayer-built-in-role-taxonomy">;
        taxonomyVersion: z.ZodLiteral<"1">;
        templateId: z.ZodString;
        templateSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "built-in-taxonomy";
        templateId: string;
        taxonomyName: "prooflayer-built-in-role-taxonomy";
        taxonomyVersion: "1";
        templateSha256: string;
    }, {
        type: "built-in-taxonomy";
        templateId: string;
        taxonomyName: "prooflayer-built-in-role-taxonomy";
        taxonomyVersion: "1";
        templateSha256: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"model-proposal">;
        provider: z.ZodString;
        model: z.ZodString;
        settings: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        promptId: z.ZodLiteral<"target-role-understanding-proposal">;
        promptVersion: z.ZodLiteral<"1">;
        renderedPromptSha256: z.ZodString;
        requestFingerprint: z.ZodString;
        rawResponsePath: z.ZodString;
        rawResponseSha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: "model-proposal";
        provider: string;
        model: string;
        requestFingerprint: string;
        settings: Record<string, unknown>;
        renderedPromptSha256: string;
        rawResponsePath: string;
        rawResponseSha256: string;
        promptId: "target-role-understanding-proposal";
        promptVersion: "1";
    }, {
        type: "model-proposal";
        provider: string;
        model: string;
        requestFingerprint: string;
        settings: Record<string, unknown>;
        renderedPromptSha256: string;
        rawResponsePath: string;
        rawResponseSha256: string;
        promptId: "target-role-understanding-proposal";
        promptVersion: "1";
    }>]>;
    trust: z.ZodObject<{
        state: z.ZodLiteral<"generated-unapproved">;
        historicalCandidateFact: z.ZodLiteral<false>;
        usableForConservativeProjection: z.ZodBoolean;
        requiresHumanReviewBeforeCanonicalApproval: z.ZodLiteral<true>;
    }, "strict", z.ZodTypeAny, {
        state: "generated-unapproved";
        historicalCandidateFact: false;
        usableForConservativeProjection: boolean;
        requiresHumanReviewBeforeCanonicalApproval: true;
    }, {
        state: "generated-unapproved";
        historicalCandidateFact: false;
        usableForConservativeProjection: boolean;
        requiresHumanReviewBeforeCanonicalApproval: true;
    }>;
    policy: z.ZodObject<{
        name: z.ZodLiteral<"guided-role-resume-policy">;
        version: z.ZodLiteral<"1">;
    }, "strict", z.ZodTypeAny, {
        name: "guided-role-resume-policy";
        version: "1";
    }, {
        name: "guided-role-resume-policy";
        version: "1";
    }>;
    targetSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    source: {
        type: "built-in-taxonomy";
        templateId: string;
        taxonomyName: "prooflayer-built-in-role-taxonomy";
        taxonomyVersion: "1";
        templateSha256: string;
    } | {
        type: "model-proposal";
        provider: string;
        model: string;
        requestFingerprint: string;
        settings: Record<string, unknown>;
        renderedPromptSha256: string;
        rawResponsePath: string;
        rawResponseSha256: string;
        promptId: "target-role-understanding-proposal";
        promptVersion: "1";
    };
    targetSha256: string;
    targetType: "role";
    targetId: string;
    expectations: {
        id: string;
        kind: "responsibility" | "capability" | "leadership" | "operating-context" | "technical" | "business";
        statement: string;
        necessity: "required" | "preferred" | "contextual";
        importance: "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "responsibilities" | "leadership" | "operating-context" | "technical" | "capabilities" | "business";
        trustState: "generated";
    }[];
    ambiguities: {
        options: {
            id: string;
            label: string;
        }[];
        id: string;
        material: boolean;
        question: string;
        selectedOptionId: string;
        selectionSource: "conservative-default" | "target-metadata" | "user-choice";
    }[];
    state: "generated" | "generated-with-ambiguity";
    policy: {
        name: "guided-role-resume-policy";
        version: "1";
    };
    summary: string;
    positioning: string;
    specialization: {
        id: string;
        source: "conservative-default" | "target-metadata" | "user-choice";
        label: string;
    };
    trust: {
        state: "generated-unapproved";
        historicalCandidateFact: false;
        usableForConservativeProjection: boolean;
        requiresHumanReviewBeforeCanonicalApproval: true;
    };
    seniority?: string | undefined;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    source: {
        type: "built-in-taxonomy";
        templateId: string;
        taxonomyName: "prooflayer-built-in-role-taxonomy";
        taxonomyVersion: "1";
        templateSha256: string;
    } | {
        type: "model-proposal";
        provider: string;
        model: string;
        requestFingerprint: string;
        settings: Record<string, unknown>;
        renderedPromptSha256: string;
        rawResponsePath: string;
        rawResponseSha256: string;
        promptId: "target-role-understanding-proposal";
        promptVersion: "1";
    };
    targetSha256: string;
    targetType: "role";
    targetId: string;
    expectations: {
        id: string;
        kind: "responsibility" | "capability" | "leadership" | "operating-context" | "technical" | "business";
        statement: string;
        necessity: "required" | "preferred" | "contextual";
        importance: "high" | "medium" | "low" | "critical";
        capabilityTags: string[];
        group: "responsibilities" | "leadership" | "operating-context" | "technical" | "capabilities" | "business";
        trustState: "generated";
    }[];
    ambiguities: {
        options: {
            id: string;
            label: string;
        }[];
        id: string;
        material: boolean;
        question: string;
        selectedOptionId: string;
        selectionSource: "conservative-default" | "target-metadata" | "user-choice";
    }[];
    state: "generated" | "generated-with-ambiguity";
    policy: {
        name: "guided-role-resume-policy";
        version: "1";
    };
    summary: string;
    positioning: string;
    specialization: {
        id: string;
        source: "conservative-default" | "target-metadata" | "user-choice";
        label: string;
    };
    trust: {
        state: "generated-unapproved";
        historicalCandidateFact: false;
        usableForConservativeProjection: boolean;
        requiresHumanReviewBeforeCanonicalApproval: true;
    };
    seniority?: string | undefined;
}>;
export declare const GeneratedRoleUnderstandingManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    targetId: z.ZodString;
    understandingId: z.ZodString;
    understandingPath: z.ZodString;
    understandingSha256: z.ZodString;
    targetSha256: z.ZodString;
    policyName: z.ZodLiteral<"guided-role-resume-policy">;
    policyVersion: z.ZodLiteral<"1">;
    sourceType: z.ZodEnum<["built-in-taxonomy", "model-proposal"]>;
    sourceSha256: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    sourceType: "built-in-taxonomy" | "model-proposal";
    targetSha256: string;
    sourceSha256: string;
    targetId: string;
    policyVersion: "1";
    policyName: "guided-role-resume-policy";
    understandingId: string;
    understandingPath: string;
    understandingSha256: string;
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    sourceType: "built-in-taxonomy" | "model-proposal";
    targetSha256: string;
    sourceSha256: string;
    targetId: string;
    policyVersion: "1";
    policyName: "guided-role-resume-policy";
    understandingId: string;
    understandingPath: string;
    understandingSha256: string;
}>;
export type GeneratedRoleUnderstanding = z.infer<typeof GeneratedRoleUnderstandingSchema>;
export type GeneratedRoleUnderstandingManifest = z.infer<typeof GeneratedRoleUnderstandingManifestSchema>;
export type RoleWorkflowStage = "target" | "role-understanding" | "evidence-selection" | "positioning" | "planning" | "scaffold" | "draft-proposal" | "draft-review" | "approved-draft" | "rendering" | "export";
export interface RoleWorkflowStageState {
    stage: RoleWorkflowStage;
    status: "missing" | "current" | "stale" | "invalid" | "waiting" | "human-action-required";
    detail: string;
}
export interface GuidedRoleEvidenceLink {
    expectationId: string;
    expectation: string;
    claimId: string;
    claim: string;
    evidenceId: string;
    evidence: string;
    relationship: "supporting" | "partial";
    rationale: string;
}
export interface RoleWorkflowStatus {
    schemaVersion: 1;
    target: RoleTarget;
    understanding?: GeneratedRoleUnderstanding;
    understandingStatus: "missing" | "current" | "stale" | "invalid";
    fit: "strong" | "credible" | "mixed" | "stretch" | "insufficient evidence";
    positioning: string;
    strongestThemes: Array<{
        theme: string;
        evidence: string;
        claimId: string;
        evidenceId: string;
    }>;
    weakerThemes: string[];
    materialGaps: string[];
    limitations: string[];
    evidenceLinks: GuidedRoleEvidenceLink[];
    selectedEvidenceIds: string[];
    selectedClaimIds: string[];
    sectionPlan: string[];
    draftPreview: {
        status: "empty" | "evidence-backed-preview";
        items: Array<{
            text: string;
            claimId: string;
            evidenceId: string;
        }>;
        requiresHumanReview: true;
        canonicalApprovedDraft: false;
    };
    draftProposal?: {
        id: string;
        status: "missing" | "current" | "stale" | "invalid";
        readyForReview: boolean;
    };
    draftReview?: {
        status: "missing" | "in-progress" | "completed" | "invalid";
        pendingCount: number;
    };
    exports: Array<{
        format: RoleResumeExportFormat;
        exportId: string;
        status: "missing" | "current" | "stale" | "invalid";
    }>;
    ambiguity?: GeneratedRoleUnderstanding["ambiguities"][number];
    currentStage: RoleWorkflowStage;
    overallState: "not-started" | "running" | "paused" | "ready-for-review" | "ready-to-finalize" | "complete" | "invalid";
    blocker?: {
        code: string;
        message: string;
    };
    nextAction: string;
    stages: RoleWorkflowStageState[];
    canonical: {
        approvedInterpretation: string;
        approvedMatching: string;
        assessment: string;
        plan: string;
        scaffold: string;
        approvedDraft: string;
        rendering: string;
    };
}
export interface RunRoleWorkflowOptions {
    providerName?: string;
    provider?: InterpretationModelProvider;
    environment?: NodeJS.ProcessEnv;
    offline?: boolean;
    specialization?: string;
    rebuildStale?: boolean;
    dryRun?: boolean;
    refresh?: boolean;
    now?: () => Date;
}
export interface RunRoleWorkflowResult {
    mode: "run" | "continue";
    dryRun: boolean;
    result: "created" | "rebuilt" | "already-current" | "dry-run" | "paused";
    providerCallMade: boolean;
    status: RoleWorkflowStatus;
}
export interface FinalizeRoleWorkflowOptions extends RoleResumeRenderOptions {
    formats?: RoleResumeExportFormat[];
    outputDir?: string;
    dryRun?: boolean;
    toolchain?: RoleResumeBinaryToolchain;
}
export interface FinalizeRoleWorkflowResult {
    dryRun: boolean;
    result: "completed" | "already-current" | "paused" | "partial-failure";
    status: RoleWorkflowStatus;
    succeeded: ExportRoleResumeResult[];
    failed: Array<{
        format: RoleResumeExportFormat;
        error: string;
    }>;
}
export interface ConfirmGeneratedRoleDirectionResult {
    targetId: string;
    understandingId: string;
    specialization: string;
    proposalId: string;
    result: "created" | "already-current" | "updated";
    providerCallMade: false;
}
export declare function createGuidedRole(workspace: string, input: RoleTargetInput, options?: TargetCreationOptions): Promise<TargetCreationResult>;
export declare function runRoleWorkflow(workspace: string, targetId: string, options?: RunRoleWorkflowOptions): Promise<RunRoleWorkflowResult>;
export declare function continueRoleWorkflow(workspace: string, targetId: string, options?: RunRoleWorkflowOptions): Promise<RunRoleWorkflowResult>;
export declare function inspectRoleWorkflow(workspace: string, targetId: string): Promise<RoleWorkflowStatus>;
export declare function confirmGeneratedRoleDirection(workspace: string, targetId: string, options?: {
    reviewerName?: string;
    now?: () => Date;
}): Promise<ConfirmGeneratedRoleDirectionResult>;
export declare function finalizeRoleWorkflow(workspace: string, targetId: string, options?: FinalizeRoleWorkflowOptions): Promise<FinalizeRoleWorkflowResult>;
export declare function showGeneratedRoleUnderstanding(workspace: string, targetId: string): Promise<GeneratedRoleUnderstanding>;
export declare function replayGeneratedRoleUnderstanding(workspace: string, targetId: string): Promise<{
    targetId: string;
    originalSha256: string;
    replaySha256: string;
    matches: boolean;
}>;
export declare function getGeneratedRoleUnderstandingStatus(workspace: string, targetId: string): Promise<{
    status: "missing" | "current" | "stale" | "invalid";
    reasons: string[];
    understandingPath: string;
    manifestPath: string;
}>;
export declare function formatRoleWorkflowStatus(status: RoleWorkflowStatus, options?: {
    verbose?: boolean;
}): string;
export declare function formatRoleWorkflowJson(status: RoleWorkflowStatus): string;
export declare function formatRoleWorkflowRunResult(result: RunRoleWorkflowResult): string;
export declare function formatFinalizeRoleWorkflowResult(result: FinalizeRoleWorkflowResult): string;
