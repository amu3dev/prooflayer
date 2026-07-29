import { z } from "zod";
import {
  EVIDENCE_SNAPSHOT_CONTRACT_NAME,
  EVIDENCE_SNAPSHOT_POLICY_NAME,
  EVIDENCE_SNAPSHOT_SUPPORTED_POLICY_VERSIONS,
  EVIDENCE_SNAPSHOT_SCHEMA_VERSION,
  EvidenceSnapshotIdSchema,
  EvidenceSnapshotRelativePathSchema,
  EvidenceSnapshotSha256Schema,
} from "./evidence-snapshot-schemas.js";

const TargetIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const TargetEvidencePinSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^evidence-pin_[a-f0-9]{16}$/),
  targetId: TargetIdSchema,
  targetType: z.enum(["role", "job"]),
  target: z.object({
    path: EvidenceSnapshotRelativePathSchema,
    sha256: EvidenceSnapshotSha256Schema,
  }).strict(),
  snapshot: z.object({
    id: EvidenceSnapshotIdSchema,
    path: EvidenceSnapshotRelativePathSchema,
    contentSha256: EvidenceSnapshotSha256Schema,
    manifestPath: EvidenceSnapshotRelativePathSchema,
    manifestSha256: EvidenceSnapshotSha256Schema,
    schemaVersion: z.literal(EVIDENCE_SNAPSHOT_SCHEMA_VERSION),
    contractName: z.literal(EVIDENCE_SNAPSHOT_CONTRACT_NAME),
    policyName: z.literal(EVIDENCE_SNAPSHOT_POLICY_NAME),
    policyVersion: z.enum(EVIDENCE_SNAPSHOT_SUPPORTED_POLICY_VERSIONS),
  }).strict(),
  pinnedAt: z.string().datetime(),
  provenance: z.object({
    method: z.literal("explicit-cli"),
    operation: z.enum(["pin", "upgrade"]),
  }).strict(),
}).strict();

export const TargetEvidencePinManifestSchema = z.object({
  schemaVersion: z.literal(1),
  pinId: z.string().regex(/^evidence-pin_[a-f0-9]{16}$/),
  targetId: TargetIdSchema,
  targetType: z.enum(["role", "job"]),
  pinPath: EvidenceSnapshotRelativePathSchema,
  pinSha256: EvidenceSnapshotSha256Schema,
  targetSha256: EvidenceSnapshotSha256Schema,
  snapshotId: EvidenceSnapshotIdSchema,
  snapshotContentSha256: EvidenceSnapshotSha256Schema,
  snapshotManifestSha256: EvidenceSnapshotSha256Schema,
  snapshotSchemaVersion: z.literal(EVIDENCE_SNAPSHOT_SCHEMA_VERSION),
  snapshotPolicyVersion: z.enum(EVIDENCE_SNAPSHOT_SUPPORTED_POLICY_VERSIONS),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();

export type TargetEvidencePin = z.infer<typeof TargetEvidencePinSchema>;
export type TargetEvidencePinManifest = z.infer<
  typeof TargetEvidencePinManifestSchema
>;
