import type { Claim, EvidenceItem, Source, Visibility } from "./schemas.js";
export type PrivacyFinding = {
    severity: "high" | "medium" | "low";
    targetType: "source" | "evidence" | "claim";
    targetId: string;
    finding: string;
};
export declare function detectSensitivity(text: string): string[];
export declare function sourceVisibilityFromPath(relativePath: string): Visibility;
export declare function auditSourcesAndEvidence(sources: Source[], evidenceItems: EvidenceItem[], claims?: Claim[]): PrivacyFinding[];
