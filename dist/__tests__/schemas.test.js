import { describe, expect, it } from "vitest";
import { ClaimSchema, EvidenceItemSchema, SourceSchema } from "../schemas.js";
describe("schemas", () => {
    it("validates a source", () => {
        const source = SourceSchema.parse({
            id: "src_123",
            type: "markdown",
            path: "sources/markdown/sample.md",
            title: "sample.md",
            importedAt: "2026-07-13T00:00:00.000Z",
            hash: "abc",
            visibility: "unknown",
            status: "active",
            extractedTextPath: "kb/extracted-text/src_123.txt"
        });
        expect(source.id).toBe("src_123");
    });
    it("validates evidence and claims with linked IDs", () => {
        const evidence = EvidenceItemSchema.parse({
            id: "evi_123",
            sourceIds: ["src_123"],
            category: "responsibility",
            text: "Led product discovery for a platform initiative.",
            normalizedSummary: "Led product discovery for a platform initiative.",
            technologies: [],
            domains: ["platform"],
            visibility: "public",
            sensitivityFlags: [],
            confidence: "medium"
        });
        const claim = ClaimSchema.parse({
            id: "claim_123",
            claim: evidence.normalizedSummary,
            type: "responsibility_claim",
            supportingEvidenceIds: [evidence.id],
            extractionConfidence: "high",
            factualConfidence: "high",
            corroborationLevel: "single_source",
            approvalStatus: "approved",
            outputReadiness: "resume_ready",
            confidence: "high",
            publicSafe: true,
            needsConfirmation: false,
            metricStatus: "no_metric",
            approvedWording: evidence.normalizedSummary,
            unsafeWording: []
        });
        expect(claim.supportingEvidenceIds).toContain("evi_123");
    });
});
