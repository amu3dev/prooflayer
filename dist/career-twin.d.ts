import { type CareerProfile, type Target } from "./schemas.js";
import { type LatestRefresh } from "./update-impact.js";
export type CareerTwinTrustLabel = "Ready to use" | "Some details may need confirmation" | "Blocked from public use";
export interface CareerTwinSourceProjection {
    id: string;
    label: string;
    type: string;
    status: string;
    visibility: string;
    importedAt: string;
}
export interface CareerTwinQuestion {
    id: string;
    title: string;
    question: string;
    reason: string;
    priority: "high" | "medium" | "low";
    batchId: string;
    targetId: string;
    claimId: string;
}
export interface CareerTwinOutputProjection {
    id: string;
    label: string;
    kind: "draft" | "final" | "export";
    freshness: "current" | "stale";
    generatedAt: string;
    files: string[];
}
export interface CareerTwinProjection {
    identity: {
        name: string;
        headline: string;
        location?: string;
        summary: string;
    };
    profile: CareerProfile;
    roles: CareerProfile["roles"];
    projects: CareerProfile["projects"];
    skills: CareerProfile["skills"];
    capabilities: string[];
    domains: string[];
    outcomes: string[];
    verifiedMetrics: string[];
    sources: CareerTwinSourceProjection[];
    sourceTypeCounts: Array<{
        type: string;
        label: string;
        count: number;
    }>;
    questions: CareerTwinQuestion[];
    targets: Target[];
    outputs: CareerTwinOutputProjection[];
    status: {
        trustLabel: CareerTwinTrustLabel;
        readyForOutputs: boolean;
        sourceCount: number;
        evidenceCount: number;
        claimCount: number;
        reviewedClaimCount: number;
        resumeReadyClaimCount: number;
        unresolvedClaimCount: number;
        unresolvedMaterialQuestionCount: number;
        lastUpdate?: string;
        attentionRequired: boolean;
        sourceMessage: string;
    };
    latestRefresh: LatestRefresh | null;
    advancedReviewBatchId?: string;
}
export declare function projectCareerTwin(workspace: string): Promise<CareerTwinProjection>;
