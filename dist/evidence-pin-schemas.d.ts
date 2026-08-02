import { z } from "zod";
export declare const TargetEvidencePinSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    target: z.ZodObject<{
        path: z.ZodEffects<z.ZodString, string, string>;
        sha256: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        sha256: string;
        path: string;
    }, {
        sha256: string;
        path: string;
    }>;
    snapshot: z.ZodObject<{
        id: z.ZodString;
        path: z.ZodEffects<z.ZodString, string, string>;
        contentSha256: z.ZodString;
        manifestPath: z.ZodEffects<z.ZodString, string, string>;
        manifestSha256: z.ZodString;
        schemaVersion: z.ZodLiteral<1>;
        contractName: z.ZodLiteral<"evidence-snapshot">;
        policyName: z.ZodLiteral<"evidence-snapshot-policy">;
        policyVersion: z.ZodEnum<["1", "2"]>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        schemaVersion: 1;
        id: string;
        policyVersion: "1" | "2";
        manifestPath: string;
        manifestSha256: string;
        policyName: "evidence-snapshot-policy";
        contentSha256: string;
        contractName: "evidence-snapshot";
    }, {
        path: string;
        schemaVersion: 1;
        id: string;
        policyVersion: "1" | "2";
        manifestPath: string;
        manifestSha256: string;
        policyName: "evidence-snapshot-policy";
        contentSha256: string;
        contractName: "evidence-snapshot";
    }>;
    pinnedAt: z.ZodString;
    provenance: z.ZodObject<{
        method: z.ZodLiteral<"explicit-cli">;
        operation: z.ZodEnum<["pin", "upgrade"]>;
    }, "strict", z.ZodTypeAny, {
        method: "explicit-cli";
        operation: "pin" | "upgrade";
    }, {
        method: "explicit-cli";
        operation: "pin" | "upgrade";
    }>;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    id: string;
    targetType: "role" | "job";
    targetId: string;
    provenance: {
        method: "explicit-cli";
        operation: "pin" | "upgrade";
    };
    target: {
        sha256: string;
        path: string;
    };
    snapshot: {
        path: string;
        schemaVersion: 1;
        id: string;
        policyVersion: "1" | "2";
        manifestPath: string;
        manifestSha256: string;
        policyName: "evidence-snapshot-policy";
        contentSha256: string;
        contractName: "evidence-snapshot";
    };
    pinnedAt: string;
}, {
    schemaVersion: 1;
    id: string;
    targetType: "role" | "job";
    targetId: string;
    provenance: {
        method: "explicit-cli";
        operation: "pin" | "upgrade";
    };
    target: {
        sha256: string;
        path: string;
    };
    snapshot: {
        path: string;
        schemaVersion: 1;
        id: string;
        policyVersion: "1" | "2";
        manifestPath: string;
        manifestSha256: string;
        policyName: "evidence-snapshot-policy";
        contentSha256: string;
        contractName: "evidence-snapshot";
    };
    pinnedAt: string;
}>;
export declare const TargetEvidencePinManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    pinId: z.ZodString;
    targetId: z.ZodString;
    targetType: z.ZodEnum<["role", "job"]>;
    pinPath: z.ZodEffects<z.ZodString, string, string>;
    pinSha256: z.ZodString;
    targetSha256: z.ZodString;
    snapshotId: z.ZodString;
    snapshotContentSha256: z.ZodString;
    snapshotManifestSha256: z.ZodString;
    snapshotSchemaVersion: z.ZodLiteral<1>;
    snapshotPolicyVersion: z.ZodEnum<["1", "2"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strict", z.ZodTypeAny, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    snapshotId: string;
    snapshotManifestSha256: string;
    pinId: string;
    pinPath: string;
    pinSha256: string;
    snapshotContentSha256: string;
    snapshotSchemaVersion: 1;
    snapshotPolicyVersion: "1" | "2";
}, {
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
    targetSha256: string;
    targetType: "role" | "job";
    targetId: string;
    snapshotId: string;
    snapshotManifestSha256: string;
    pinId: string;
    pinPath: string;
    pinSha256: string;
    snapshotContentSha256: string;
    snapshotSchemaVersion: 1;
    snapshotPolicyVersion: "1" | "2";
}>;
export type TargetEvidencePin = z.infer<typeof TargetEvidencePinSchema>;
export type TargetEvidencePinManifest = z.infer<typeof TargetEvidencePinManifestSchema>;
