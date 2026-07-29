import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  walkFiles,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  ClaimSchema,
  EvidenceItemSchema,
  SourceSchema,
  type Claim,
  type EvidenceItem,
  type Source,
} from "./schemas.js";
import { stableJson } from "./target-proposal.js";
import {
  EVIDENCE_SNAPSHOT_CONTRACT_NAME,
  EVIDENCE_SNAPSHOT_EXPORTER_NAME,
  EVIDENCE_SNAPSHOT_EXPORTER_VERSION,
  EVIDENCE_SNAPSHOT_POLICY_NAME,
  EVIDENCE_SNAPSHOT_POLICY_VERSION,
  EVIDENCE_SNAPSHOT_SCHEMA_VERSION,
  EvidenceFoundationSnapshotSchema,
  EvidenceSnapshotIdSchema,
  EvidenceSnapshotManifestSchemaV1,
  type EvidenceFoundationSnapshot,
  type EvidenceSnapshotClaimRecord,
  type EvidenceSnapshotEvidenceRecord,
  type EvidenceSnapshotManifestV1,
  type EvidenceSnapshotSourceReference,
} from "./evidence-snapshot-schemas.js";

const SNAPSHOT_ROOT = "evidence-snapshots";
const SNAPSHOT_FILE = "evidence-snapshot.json";
const MANIFEST_FILE = "evidence-snapshot-manifest.json";
const FOUNDATION_ID = "prooflayer-reviewed-evidence-foundation";

export interface EvidenceSnapshotPaths {
  rootRelativePath: string;
  rootPath: string;
  snapshotRelativePath: string;
  snapshotPath: string;
  manifestRelativePath: string;
  manifestPath: string;
}

export interface BuildEvidenceSnapshotResult {
  snapshotId: string;
  result: "created" | "already-current";
  snapshotPath: string;
  manifestPath: string;
  contentSha256: string;
  evidenceItemCount: number;
  claimCount: number;
  approvedClaimCount: number;
  eligibleRoleEvidenceCount: number;
  eligibleJobEvidenceCount: number;
  verifiedMetricCount: number;
  warningCount: number;
}

export interface EvidenceSnapshotStatus {
  snapshotId: string;
  snapshotExists: boolean;
  manifestExists: boolean;
  contentHashMatches: boolean | null;
  identityMatches: boolean | null;
  sourceInventoryHashMatches: boolean | null;
  recordHashesMatch: boolean | null;
  eligibilityConsistent: boolean | null;
  provenanceComplete: boolean | null;
  manifestMatches: boolean | null;
  status: "missing" | "current" | "invalid" | "incompatible";
  reasons: string[];
  snapshotPath: string;
  manifestPath: string;
}

export interface LoadedEvidenceSnapshot {
  snapshot: Readonly<EvidenceFoundationSnapshot>;
  manifest: Readonly<EvidenceSnapshotManifestV1>;
  paths: EvidenceSnapshotPaths;
  manifestSha256: string;
}

export interface EvidenceSnapshotListEntry {
  snapshotId: string;
  status: EvidenceSnapshotStatus["status"];
  contentSha256?: string;
  evidenceItemCount?: number;
  approvedClaimCount?: number;
  eligibleRoleEvidenceCount?: number;
  eligibleJobEvidenceCount?: number;
  createdAt?: string;
}

export async function buildEvidenceSnapshot(
  workspace: string,
  options: { now?: () => Date } = {},
): Promise<BuildEvidenceSnapshotResult> {
  const calculated = await calculateEvidenceFoundationSnapshot(workspace);
  const paths = evidenceSnapshotPaths(workspace, calculated.id);
  if (await pathExists(paths.rootPath)) {
    const status = await getEvidenceSnapshotStatus(workspace, calculated.id);
    if (status.status !== "current") {
      throw new Error(
        `Evidence snapshot path already exists but is ${status.status}; immutable snapshots are never overwritten. ${status.reasons.join(" ")}`,
      );
    }
    const loaded = await loadEvidenceSnapshot(workspace, calculated.id);
    if (stableJson(loaded.snapshot) !== stableJson(calculated)) {
      throw new Error(
        `Evidence snapshot identity collision at ${calculated.id}; stored content differs and was not overwritten.`,
      );
    }
    return resultFor(
      loaded.snapshot as EvidenceFoundationSnapshot,
      loaded.manifest as EvidenceSnapshotManifestV1,
      paths,
      "already-current",
    );
  }

  await writeJsonAtomic(paths.snapshotPath, calculated);
  const contentSha256 = await hashFile(paths.snapshotPath);
  const timestamp = (options.now ?? (() => new Date()))().toISOString();
  const manifest = EvidenceSnapshotManifestSchemaV1.parse({
    schemaVersion: EVIDENCE_SNAPSHOT_SCHEMA_VERSION,
    snapshotId: calculated.id,
    snapshotPath: paths.snapshotRelativePath,
    contentSha256,
    contractName: EVIDENCE_SNAPSHOT_CONTRACT_NAME,
    contractVersion: "1",
    policyName: EVIDENCE_SNAPSHOT_POLICY_NAME,
    policyVersion: EVIDENCE_SNAPSHOT_POLICY_VERSION,
    producerName: EVIDENCE_SNAPSHOT_EXPORTER_NAME,
    producerVersion: EVIDENCE_SNAPSHOT_EXPORTER_VERSION,
    sourceInventorySha256: calculated.sourceFoundation.inventorySha256,
    sourceArtifactCount: calculated.completeness.sourceArtifactCount,
    evidenceItemCount: calculated.completeness.evidenceItemCount,
    claimCount: calculated.completeness.claimCount,
    approvedClaimCount: calculated.completeness.approvedClaimCount,
    eligibleRoleEvidenceCount:
      calculated.completeness.eligibleRoleEvidenceCount,
    eligibleJobEvidenceCount:
      calculated.completeness.eligibleJobEvidenceCount,
    verifiedMetricCount: calculated.completeness.verifiedMetricCount,
    files: [{
      path: paths.snapshotRelativePath,
      sha256: contentSha256,
    }],
    completeness: "complete",
    validationResult: "valid",
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
  const status = await getEvidenceSnapshotStatus(workspace, calculated.id);
  if (status.status !== "current") {
    throw new Error(
      `Created evidence snapshot failed validation: ${status.reasons.join(" ")}`,
    );
  }
  return resultFor(calculated, manifest, paths, "created");
}

export async function calculateEvidenceFoundationSnapshot(
  workspace: string,
): Promise<EvidenceFoundationSnapshot> {
  const sourceArtifacts = [
    { id: "sources" as const, path: "kb/sources.json" },
    { id: "evidence-items" as const, path: "kb/evidence-items.json" },
    { id: "claims" as const, path: "kb/claims.json" },
  ];
  for (const artifact of sourceArtifacts) {
    if (!(await pathExists(resolveWithin(workspace, artifact.path)))) {
      throw new Error(
        `Required Evidence Foundation artifact is missing: ${artifact.path}`,
      );
    }
  }
  const artifacts = await Promise.all(sourceArtifacts.map(async (artifact) => ({
    ...artifact,
    sha256: await hashFile(resolveWithin(workspace, artifact.path)),
  })));
  const sourceInventorySha256 = hashText(stableJson(
    artifacts.map(({ id, sha256 }) => ({ id, sha256 })),
  ));
  const sources = (
    await readJson<unknown[]>(
      resolveWithin(workspace, "kb/sources.json"),
      [],
    )
  ).map((entry) => SourceSchema.parse(entry)).sort(byId);
  const evidenceItems = (
    await readJson<unknown[]>(
      resolveWithin(workspace, "kb/evidence-items.json"),
      [],
    )
  ).map((entry) => EvidenceItemSchema.parse(entry)).sort(byId);
  const claims = (
    await readJson<unknown[]>(
      resolveWithin(workspace, "kb/claims.json"),
      [],
    )
  ).map((entry) => ClaimSchema.parse(entry)).sort(byId);
  assertUnique(sources.map(({ id }) => id), "source");
  assertUnique(evidenceItems.map(({ id }) => id), "evidence item");
  assertUnique(claims.map(({ id }) => id), "claim");

  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const claimByEvidence = new Map<string, Claim[]>();
  for (const claim of claims) {
    for (const evidenceId of claim.supportingEvidenceIds) {
      const supporting = claimByEvidence.get(evidenceId) ?? [];
      supporting.push(claim);
      claimByEvidence.set(evidenceId, supporting);
    }
  }
  const claimBaseEligibility = new Map(claims.map((claim) => [
    claim.id,
    claimEligibilityReasons(claim),
  ]));
  const evidenceBase = new Map(evidenceItems.map((evidence) => [
    evidence.id,
    evidenceEligibility(
      evidence,
      evidence.sourceIds.map((sourceId) => sourceById.get(sourceId)),
    ),
  ]));
  const eligibleEvidenceIds = new Set(evidenceItems
    .filter((evidence) => {
      const base = evidenceBase.get(evidence.id)!;
      if (base.reasons.length > 0) return false;
      return (claimByEvidence.get(evidence.id) ?? []).some(
        (claim) => claimBaseEligibility.get(claim.id)!.length === 0,
      );
    })
    .map(({ id }) => id));
  const eligibleClaimIds = new Set(claims
    .filter((claim) =>
      claimBaseEligibility.get(claim.id)!.length === 0 &&
      claim.supportingEvidenceIds.some((id) => eligibleEvidenceIds.has(id)))
    .map(({ id }) => id));

  const evidenceRecords: EvidenceSnapshotEvidenceRecord[] = evidenceItems.map(
    (evidence) => {
      const base = evidenceBase.get(evidence.id)!;
      const eligible = eligibleEvidenceIds.has(evidence.id);
      const reasons = [
        ...base.reasons,
        ...(!eligible && base.reasons.length === 0
          ? ["no-eligible-claim" as const]
          : []),
      ];
      return {
        id: evidence.id,
        contentSha256: hashText(stableJson(evidence)),
        category: evidence.category,
        sourceIds: [...evidence.sourceIds].sort(),
        visibility: evidence.visibility,
        sensitivityFlags: [...evidence.sensitivityFlags].sort(),
        confidence: evidence.confidence,
        supportingClaimIds: (claimByEvidence.get(evidence.id) ?? [])
          .map(({ id }) => id)
          .sort(),
        eligibility: {
          roleMatching: eligible,
          jobMapping: eligible,
          reasons,
        },
        sources: base.sources,
        ...(eligible ? { content: evidence } : {}),
      };
    },
  );
  const claimRecords: EvidenceSnapshotClaimRecord[] = claims.map((claim) => {
    const eligible = eligibleClaimIds.has(claim.id);
    const ownReasons = claimBaseEligibility.get(claim.id)!;
    const reasons = [
      ...ownReasons,
      ...(!eligible && ownReasons.length === 0
        ? ["no-eligible-evidence" as const]
        : []),
    ];
    return {
      id: claim.id,
      contentSha256: hashText(stableJson(claim)),
      supportingEvidenceIds: [...claim.supportingEvidenceIds].sort(),
      approvalStatus: claim.approvalStatus,
      outputReadiness: claim.outputReadiness,
      publicSafe: claim.publicSafe,
      needsConfirmation: claim.needsConfirmation,
      metricStatus: claim.metricStatus,
      factualConfidence: claim.factualConfidence,
      eligibility: {
        roleMatching: eligible,
        jobMapping: eligible,
        reasons,
      },
      ...(eligible ? { content: claim } : {}),
    };
  });
  const verifiedMetrics = claims
    .filter((claim) =>
      eligibleClaimIds.has(claim.id) &&
      claim.metricStatus === "verified_metric")
    .map((claim) => {
      const exactText = claim.approvedWording ?? claim.claim;
      return {
        id: `verified-metric_${hashText(stableJson({
          claimId: claim.id,
          exactText,
          evidenceIds: [...claim.supportingEvidenceIds].sort(),
        })).slice(0, 16)}`,
        claimId: claim.id,
        evidenceIds: [...claim.supportingEvidenceIds].sort(),
        exactText,
        textSha256: hashText(exactText),
        scope: {
          ...(claim.parentRoleId ? { parentRoleId: claim.parentRoleId } : {}),
          ...(claim.parentProjectId
            ? { parentProjectId: claim.parentProjectId }
            : {}),
          ...(claim.dateRange ? { dateRange: claim.dateRange } : {}),
        },
      };
    })
    .sort(byId);
  const eligibleRoleEvidenceIds = [...eligibleEvidenceIds].sort();
  const eligibleJobEvidenceIds = [...eligibleEvidenceIds].sort();
  const eligibleRoleClaimIds = [...eligibleClaimIds].sort();
  const eligibleJobClaimIds = [...eligibleClaimIds].sort();
  const eligibleRoleEvidenceSetSha256 = eligibilitySetHash(
    evidenceRecords,
    claimRecords,
    eligibleRoleEvidenceIds,
    eligibleRoleClaimIds,
  );
  const eligibleJobEvidenceSetSha256 = eligibilitySetHash(
    evidenceRecords,
    claimRecords,
    eligibleJobEvidenceIds,
    eligibleJobClaimIds,
  );
  const warnings = [
    ...(eligibleJobEvidenceIds.length === 0
      ? [snapshotWarning(
          "ZERO_ELIGIBLE_JOB_EVIDENCE",
          "The source Evidence Foundation contains no evidence currently eligible for Job Mapping.",
          [],
        )]
      : []),
    ...(eligibleRoleEvidenceIds.length === 0
      ? [snapshotWarning(
          "ZERO_ELIGIBLE_ROLE_EVIDENCE",
          "The source Evidence Foundation contains no evidence currently eligible for Role Matching.",
          [],
        )]
      : []),
    ...(evidenceRecords.some((record) => !record.content) ||
      claimRecords.some((record) => !record.content)
      ? [snapshotWarning(
          "INELIGIBLE_CONTENT_REDACTED",
          "Ineligible record content is omitted; identity, trust state, eligibility, and source hashes remain available for audit.",
          [
            ...evidenceRecords.filter((record) => !record.content).map(({ id }) => id),
            ...claimRecords.filter((record) => !record.content).map(({ id }) => id),
          ].sort(),
        )]
      : []),
    ...claims.some((claim) =>
      claim.metricStatus === "verified_metric" && !eligibleClaimIds.has(claim.id))
      ? [snapshotWarning(
          "VERIFIED_METRIC_CONTENT_REDACTED",
          "A verified metric belongs to an ineligible claim; its state is retained on the claim record but its wording is not exported.",
          claims
            .filter((claim) =>
              claim.metricStatus === "verified_metric" &&
              !eligibleClaimIds.has(claim.id))
            .map(({ id }) => id)
            .sort(),
        )]
      : [],
  ].sort(byId);
  const identityInput = snapshotIdentityInput(
    sourceInventorySha256,
    evidenceRecords,
    claimRecords,
    verifiedMetrics,
  );
  const id = snapshotIdFor(identityInput);
  return EvidenceFoundationSnapshotSchema.parse({
    schemaVersion: EVIDENCE_SNAPSHOT_SCHEMA_VERSION,
    id,
    contract: {
      name: EVIDENCE_SNAPSHOT_CONTRACT_NAME,
      version: "1",
    },
    policy: {
      name: EVIDENCE_SNAPSHOT_POLICY_NAME,
      version: EVIDENCE_SNAPSHOT_POLICY_VERSION,
    },
    producer: {
      name: EVIDENCE_SNAPSHOT_EXPORTER_NAME,
      version: EVIDENCE_SNAPSHOT_EXPORTER_VERSION,
      mode: "deterministic",
    },
    sourceFoundation: {
      id: FOUNDATION_ID,
      inventorySha256: sourceInventorySha256,
      artifacts,
    },
    evidenceItems: evidenceRecords,
    claims: claimRecords,
    verifiedMetrics,
    eligibleRoleEvidenceIds,
    eligibleJobEvidenceIds,
    eligibleRoleClaimIds,
    eligibleJobClaimIds,
    eligibleRoleEvidenceSetSha256,
    eligibleJobEvidenceSetSha256,
    completeness: {
      status: "complete",
      sourceArtifactCount: artifacts.length,
      evidenceItemCount: evidenceRecords.length,
      claimCount: claimRecords.length,
      approvedClaimCount: claims.filter(
        ({ approvalStatus }) => approvalStatus === "approved",
      ).length,
      eligibleRoleEvidenceCount: eligibleRoleEvidenceIds.length,
      eligibleJobEvidenceCount: eligibleJobEvidenceIds.length,
      verifiedMetricCount: verifiedMetrics.length,
      provenanceComplete: true,
      eligibilityPreserved: true,
    },
    warnings,
  });
}

export async function getEvidenceSnapshotStatus(
  workspace: string,
  snapshotId: string,
): Promise<EvidenceSnapshotStatus> {
  assertSnapshotId(snapshotId);
  const paths = evidenceSnapshotPaths(workspace, snapshotId);
  const snapshotExists = await pathExists(paths.snapshotPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const base = {
    snapshotId,
    snapshotExists,
    manifestExists,
    snapshotPath: paths.snapshotRelativePath,
    manifestPath: paths.manifestRelativePath,
  };
  if (!snapshotExists && !manifestExists) {
    return emptyStatus(base, "missing", ["Evidence snapshot does not exist."]);
  }
  if (!snapshotExists || !manifestExists) {
    return emptyStatus(base, "invalid", [
      "Evidence snapshot artifact set is incomplete.",
    ]);
  }
  let rawSnapshot: unknown;
  let rawManifest: unknown;
  try {
    rawSnapshot = await readJson<unknown>(paths.snapshotPath, null);
    rawManifest = await readJson<unknown>(paths.manifestPath, null);
  } catch (error) {
    return emptyStatus(base, "invalid", [
      `Evidence snapshot JSON is unreadable: ${errorMessage(error)}`,
    ]);
  }
  if (
    schemaVersionOf(rawSnapshot) !== EVIDENCE_SNAPSHOT_SCHEMA_VERSION ||
    schemaVersionOf(rawManifest) !== EVIDENCE_SNAPSHOT_SCHEMA_VERSION
  ) {
    return emptyStatus(base, "incompatible", [
      "Evidence snapshot uses an unsupported schema version.",
    ]);
  }
  let snapshot: EvidenceFoundationSnapshot;
  let manifest: EvidenceSnapshotManifestV1;
  try {
    snapshot = EvidenceFoundationSnapshotSchema.parse(rawSnapshot);
    manifest = EvidenceSnapshotManifestSchemaV1.parse(rawManifest);
  } catch (error) {
    return emptyStatus(base, "invalid", [
      `Evidence snapshot contract is invalid: ${errorMessage(error)}`,
    ]);
  }
  const contentHash = await hashFile(paths.snapshotPath);
  const contentHashMatches = contentHash === manifest.contentSha256;
  const validation = validateSnapshotContents(snapshot);
  const identityMatches = snapshot.id === snapshotIdFor(
    snapshotIdentityInput(
      snapshot.sourceFoundation.inventorySha256,
      snapshot.evidenceItems,
      snapshot.claims,
      snapshot.verifiedMetrics,
    ),
  ) && snapshot.id === snapshotId;
  const sourceInventoryHashMatches =
    snapshot.sourceFoundation.inventorySha256 === hashText(stableJson(
      snapshot.sourceFoundation.artifacts.map(({ id, sha256 }) => ({
        id,
        sha256,
      })),
    ));
  const manifestMatches =
    manifest.snapshotId === snapshot.id &&
    manifest.snapshotPath === paths.snapshotRelativePath &&
    manifest.contentSha256 === contentHash &&
    manifest.sourceInventorySha256 ===
      snapshot.sourceFoundation.inventorySha256 &&
    manifest.sourceArtifactCount ===
      snapshot.completeness.sourceArtifactCount &&
    manifest.evidenceItemCount === snapshot.completeness.evidenceItemCount &&
    manifest.claimCount === snapshot.completeness.claimCount &&
    manifest.approvedClaimCount === snapshot.completeness.approvedClaimCount &&
    manifest.eligibleRoleEvidenceCount ===
      snapshot.completeness.eligibleRoleEvidenceCount &&
    manifest.eligibleJobEvidenceCount ===
      snapshot.completeness.eligibleJobEvidenceCount &&
    manifest.verifiedMetricCount ===
      snapshot.completeness.verifiedMetricCount &&
    manifest.files.some((file) =>
      file.path === paths.snapshotRelativePath && file.sha256 === contentHash);
  const reasons = [
    ...(!contentHashMatches
      ? ["Snapshot content SHA-256 does not match its manifest."]
      : []),
    ...(!identityMatches
      ? ["Snapshot ID does not match its identity-bearing content."]
      : []),
    ...(!sourceInventoryHashMatches
      ? ["Source inventory hash is invalid."]
      : []),
    ...(!validation.recordHashesMatch ? validation.hashReasons : []),
    ...(!validation.eligibilityConsistent
      ? validation.eligibilityReasons
      : []),
    ...(!validation.provenanceComplete
      ? validation.provenanceReasons
      : []),
    ...(!manifestMatches
      ? ["Snapshot manifest does not agree with snapshot content."]
      : []),
  ];
  return {
    ...base,
    contentHashMatches,
    identityMatches,
    sourceInventoryHashMatches,
    recordHashesMatch: validation.recordHashesMatch,
    eligibilityConsistent: validation.eligibilityConsistent,
    provenanceComplete: validation.provenanceComplete,
    manifestMatches,
    status: reasons.length === 0 ? "current" : "invalid",
    reasons: [...new Set(reasons)].sort(),
  };
}

export async function loadEvidenceSnapshot(
  workspace: string,
  snapshotId: string,
): Promise<LoadedEvidenceSnapshot> {
  const status = await getEvidenceSnapshotStatus(workspace, snapshotId);
  if (status.status !== "current") {
    throw new Error(
      `Evidence snapshot ${snapshotId} is ${status.status}: ${status.reasons.join(" ")}`,
    );
  }
  const paths = evidenceSnapshotPaths(workspace, snapshotId);
  const snapshot = EvidenceFoundationSnapshotSchema.parse(
    await readJson<unknown>(paths.snapshotPath, null),
  );
  const manifest = EvidenceSnapshotManifestSchemaV1.parse(
    await readJson<unknown>(paths.manifestPath, null),
  );
  return {
    snapshot: deepFreeze(structuredClone(snapshot)),
    manifest: deepFreeze(structuredClone(manifest)),
    paths,
    manifestSha256: await hashFile(paths.manifestPath),
  };
}

export async function validateEvidenceSnapshot(
  workspace: string,
  snapshotId: string,
): Promise<EvidenceSnapshotStatus> {
  const status = await getEvidenceSnapshotStatus(workspace, snapshotId);
  if (status.status !== "current") {
    throw new Error(
      `Evidence snapshot validation failed: ${status.status}. ${status.reasons.join(" ")}`,
    );
  }
  return status;
}

export async function listEvidenceSnapshots(
  workspace: string,
): Promise<EvidenceSnapshotListEntry[]> {
  const root = resolveWithin(workspace, SNAPSHOT_ROOT);
  const files = (await walkFiles(root)).filter(
    (file) => path.basename(file) === MANIFEST_FILE,
  );
  const ids = [...new Set(files.map((file) => path.basename(path.dirname(file))))]
    .filter((id) => EvidenceSnapshotIdSchema.safeParse(id).success)
    .sort();
  return Promise.all(ids.map(async (snapshotId) => {
    const status = await getEvidenceSnapshotStatus(workspace, snapshotId);
    if (status.status !== "current") return { snapshotId, status: status.status };
    const loaded = await loadEvidenceSnapshot(workspace, snapshotId);
    return {
      snapshotId,
      status: status.status,
      contentSha256: loaded.manifest.contentSha256,
      evidenceItemCount: loaded.manifest.evidenceItemCount,
      approvedClaimCount: loaded.manifest.approvedClaimCount,
      eligibleRoleEvidenceCount: loaded.manifest.eligibleRoleEvidenceCount,
      eligibleJobEvidenceCount: loaded.manifest.eligibleJobEvidenceCount,
      createdAt: loaded.manifest.createdAt,
    };
  }));
}

export function evidenceSnapshotPaths(
  workspace: string,
  snapshotId: string,
): EvidenceSnapshotPaths {
  assertSnapshotId(snapshotId);
  const rootRelativePath = `${SNAPSHOT_ROOT}/${snapshotId}`;
  const snapshotRelativePath = `${rootRelativePath}/${SNAPSHOT_FILE}`;
  const manifestRelativePath = `${rootRelativePath}/${MANIFEST_FILE}`;
  return {
    rootRelativePath,
    rootPath: resolveWithin(workspace, rootRelativePath),
    snapshotRelativePath,
    snapshotPath: resolveWithin(workspace, snapshotRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
  };
}

export function formatEvidenceSnapshotBuild(
  result: BuildEvidenceSnapshotResult,
): string {
  return [
    `Snapshot ID: ${result.snapshotId}`,
    `Build result: ${result.result}`,
    `Snapshot: ${result.snapshotPath}`,
    `Manifest: ${result.manifestPath}`,
    `Content SHA-256: ${result.contentSha256}`,
    `Evidence items: ${result.evidenceItemCount}`,
    `Claims: ${result.claimCount}`,
    `Approved claims: ${result.approvedClaimCount}`,
    `Eligible Role evidence: ${result.eligibleRoleEvidenceCount}`,
    `Eligible Job evidence: ${result.eligibleJobEvidenceCount}`,
    `Verified metrics: ${result.verifiedMetricCount}`,
    `Warnings: ${result.warningCount}`,
  ].join("\n");
}

export function formatEvidenceSnapshotList(
  entries: EvidenceSnapshotListEntry[],
): string {
  if (entries.length === 0) return "Evidence snapshots: none";
  return [
    "Evidence snapshots:",
    ...entries.map((entry) => [
      entry.snapshotId,
      entry.status,
      entry.contentSha256 ?? "-",
      `job=${entry.eligibleJobEvidenceCount ?? "-"}`,
      `role=${entry.eligibleRoleEvidenceCount ?? "-"}`,
      entry.createdAt ?? "-",
    ].join(" | ")),
  ].join("\n");
}

export function formatEvidenceSnapshotStatus(
  status: EvidenceSnapshotStatus,
): string {
  const check = (value: boolean | null): string =>
    value === null ? "not applicable" : value ? "yes" : "no";
  return [
    `Snapshot ID: ${status.snapshotId}`,
    `Overall status: ${status.status}`,
    `Snapshot exists: ${status.snapshotExists ? "yes" : "no"}`,
    `Manifest exists: ${status.manifestExists ? "yes" : "no"}`,
    `Content hash matches: ${check(status.contentHashMatches)}`,
    `Identity matches: ${check(status.identityMatches)}`,
    `Source inventory hash matches: ${check(status.sourceInventoryHashMatches)}`,
    `Record hashes match: ${check(status.recordHashesMatch)}`,
    `Eligibility consistent: ${check(status.eligibilityConsistent)}`,
    `Provenance complete: ${check(status.provenanceComplete)}`,
    `Manifest matches: ${check(status.manifestMatches)}`,
    `Snapshot: ${status.snapshotPath}`,
    `Manifest: ${status.manifestPath}`,
    ...(status.reasons.length
      ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)]
      : []),
  ].join("\n");
}

function resultFor(
  snapshot: EvidenceFoundationSnapshot,
  manifest: EvidenceSnapshotManifestV1,
  paths: EvidenceSnapshotPaths,
  result: BuildEvidenceSnapshotResult["result"],
): BuildEvidenceSnapshotResult {
  return {
    snapshotId: snapshot.id,
    result,
    snapshotPath: paths.snapshotRelativePath,
    manifestPath: paths.manifestRelativePath,
    contentSha256: manifest.contentSha256,
    evidenceItemCount: snapshot.completeness.evidenceItemCount,
    claimCount: snapshot.completeness.claimCount,
    approvedClaimCount: snapshot.completeness.approvedClaimCount,
    eligibleRoleEvidenceCount:
      snapshot.completeness.eligibleRoleEvidenceCount,
    eligibleJobEvidenceCount:
      snapshot.completeness.eligibleJobEvidenceCount,
    verifiedMetricCount: snapshot.completeness.verifiedMetricCount,
    warningCount: snapshot.warnings.length,
  };
}

function snapshotIdFor(identityInput: unknown): string {
  return `evidence-snapshot-${hashText(stableJson(identityInput)).slice(0, 20)}`;
}

function snapshotIdentityInput(
  sourceInventorySha256: string,
  evidenceRecords: EvidenceSnapshotEvidenceRecord[],
  claimRecords: EvidenceSnapshotClaimRecord[],
  verifiedMetrics: EvidenceFoundationSnapshot["verifiedMetrics"],
) {
  return {
    schemaVersion: EVIDENCE_SNAPSHOT_SCHEMA_VERSION,
    policy: {
      name: EVIDENCE_SNAPSHOT_POLICY_NAME,
      version: EVIDENCE_SNAPSHOT_POLICY_VERSION,
    },
    sourceInventorySha256,
    evidenceItems: evidenceRecords.map((record) => ({
      id: record.id,
      contentSha256: record.contentSha256,
      category: record.category,
      sourceIds: record.sourceIds,
      visibility: record.visibility,
      sensitivityFlags: record.sensitivityFlags,
      confidence: record.confidence,
      supportingClaimIds: record.supportingClaimIds,
      eligibility: record.eligibility,
      sources: record.sources,
    })),
    claims: claimRecords.map((record) => ({
      id: record.id,
      contentSha256: record.contentSha256,
      supportingEvidenceIds: record.supportingEvidenceIds,
      approvalStatus: record.approvalStatus,
      outputReadiness: record.outputReadiness,
      publicSafe: record.publicSafe,
      needsConfirmation: record.needsConfirmation,
      metricStatus: record.metricStatus,
      factualConfidence: record.factualConfidence,
      eligibility: record.eligibility,
    })),
    verifiedMetrics: verifiedMetrics.map((metric) => ({
      id: metric.id,
      claimId: metric.claimId,
      evidenceIds: metric.evidenceIds,
      textSha256: metric.textSha256,
      scope: metric.scope,
    })),
  };
}

function eligibilitySetHash(
  evidenceRecords: EvidenceSnapshotEvidenceRecord[],
  claimRecords: EvidenceSnapshotClaimRecord[],
  evidenceIds: string[],
  claimIds: string[],
): string {
  const evidenceById = new Map(evidenceRecords.map((record) => [record.id, record]));
  const claimById = new Map(claimRecords.map((record) => [record.id, record]));
  return hashText(stableJson({
    evidence: evidenceIds.map((id) => ({
      id,
      contentSha256: evidenceById.get(id)!.contentSha256,
    })),
    claims: claimIds.map((id) => ({
      id,
      contentSha256: claimById.get(id)!.contentSha256,
    })),
  }));
}

function evidenceEligibility(
  evidence: EvidenceItem,
  sources: Array<Source | undefined>,
): {
  reasons: Array<
    "evidence-not-public" |
    "evidence-sensitive" |
    "source-missing" |
    "source-inactive" |
    "source-not-public" |
    "job-description-source"
  >;
  sources: EvidenceSnapshotSourceReference[];
} {
  const reasons = [
    ...(evidence.visibility !== "public"
      ? ["evidence-not-public" as const]
      : []),
    ...(evidence.sensitivityFlags.length > 0
      ? ["evidence-sensitive" as const]
      : []),
    ...(sources.some((source) => !source) ? ["source-missing" as const] : []),
    ...(sources.some((source) => source && source.status !== "active")
      ? ["source-inactive" as const]
      : []),
    ...(sources.some((source) => source && source.visibility !== "public")
      ? ["source-not-public" as const]
      : []),
    ...(sources.some((source) => source?.type === "job_description")
      ? ["job-description-source" as const]
      : []),
  ];
  return {
    reasons: [...new Set(reasons)].sort(),
    sources: sources
      .filter((source): source is Source => Boolean(source))
      .map((source) => ({
        sourceId: source.id,
        sourceType: source.type,
        logicalPath: `evidence-foundation/sources/${safeSegment(source.id)}`,
        sha256: source.hash,
        status: source.status,
        visibility: source.visibility,
      }))
      .sort((left, right) => left.sourceId.localeCompare(right.sourceId)),
  };
}

function claimEligibilityReasons(claim: Claim): Array<
  "claim-not-approved" |
  "claim-not-resume-ready" |
  "claim-not-public-safe" |
  "claim-needs-confirmation"
> {
  return [
    ...(claim.approvalStatus !== "approved"
      ? ["claim-not-approved" as const]
      : []),
    ...(claim.outputReadiness !== "resume_ready"
      ? ["claim-not-resume-ready" as const]
      : []),
    ...(!claim.publicSafe ? ["claim-not-public-safe" as const] : []),
    ...(claim.needsConfirmation ? ["claim-needs-confirmation" as const] : []),
  ];
}

function snapshotWarning(
  code:
    | "ZERO_ELIGIBLE_JOB_EVIDENCE"
    | "ZERO_ELIGIBLE_ROLE_EVIDENCE"
    | "INELIGIBLE_CONTENT_REDACTED"
    | "VERIFIED_METRIC_CONTENT_REDACTED",
  message: string,
  recordIds: string[],
) {
  return {
    id: `evidence-snapshot-warning_${hashText(
      stableJson({ code, recordIds }),
    ).slice(0, 12)}`,
    code,
    message,
    recordIds,
  };
}

function validateSnapshotContents(snapshot: EvidenceFoundationSnapshot): {
  recordHashesMatch: boolean;
  eligibilityConsistent: boolean;
  provenanceComplete: boolean;
  hashReasons: string[];
  eligibilityReasons: string[];
  provenanceReasons: string[];
} {
  const hashReasons: string[] = [];
  const eligibilityReasons: string[] = [];
  const provenanceReasons: string[] = [];
  const evidenceIds = new Set<string>();
  const claimIds = new Set<string>();
  const sourceIds = new Set(snapshot.evidenceItems.flatMap((record) =>
    record.sources.map(({ sourceId }) => sourceId)));
  for (const record of snapshot.evidenceItems) {
    if (evidenceIds.has(record.id)) {
      provenanceReasons.push(`Duplicate evidence ID: ${record.id}`);
    }
    evidenceIds.add(record.id);
    if (record.content && hashText(stableJson(record.content)) !== record.contentSha256) {
      hashReasons.push(`Evidence content hash mismatch: ${record.id}`);
    }
    if ((record.eligibility.jobMapping || record.eligibility.roleMatching) && !record.content) {
      eligibilityReasons.push(`Eligible evidence content is missing: ${record.id}`);
    }
    if (record.sourceIds.some((sourceId) =>
      !record.sources.some((source) => source.sourceId === sourceId))) {
      provenanceReasons.push(`Evidence source provenance is incomplete: ${record.id}`);
    }
  }
  for (const record of snapshot.claims) {
    if (claimIds.has(record.id)) {
      provenanceReasons.push(`Duplicate claim ID: ${record.id}`);
    }
    claimIds.add(record.id);
    if (record.content && hashText(stableJson(record.content)) !== record.contentSha256) {
      hashReasons.push(`Claim content hash mismatch: ${record.id}`);
    }
    if ((record.eligibility.jobMapping || record.eligibility.roleMatching) && !record.content) {
      eligibilityReasons.push(`Eligible claim content is missing: ${record.id}`);
    }
    if (record.supportingEvidenceIds.some((id) => !evidenceIds.has(id))) {
      provenanceReasons.push(`Claim references unknown evidence: ${record.id}`);
    }
  }
  const eligibleRoleEvidence = snapshot.evidenceItems
    .filter(({ eligibility }) => eligibility.roleMatching)
    .map(({ id }) => id)
    .sort();
  const eligibleJobEvidence = snapshot.evidenceItems
    .filter(({ eligibility }) => eligibility.jobMapping)
    .map(({ id }) => id)
    .sort();
  const eligibleRoleClaims = snapshot.claims
    .filter(({ eligibility }) => eligibility.roleMatching)
    .map(({ id }) => id)
    .sort();
  const eligibleJobClaims = snapshot.claims
    .filter(({ eligibility }) => eligibility.jobMapping)
    .map(({ id }) => id)
    .sort();
  if (stableJson(eligibleRoleEvidence) !== stableJson(snapshot.eligibleRoleEvidenceIds)) {
    eligibilityReasons.push("Eligible Role evidence IDs are inconsistent.");
  }
  if (stableJson(eligibleJobEvidence) !== stableJson(snapshot.eligibleJobEvidenceIds)) {
    eligibilityReasons.push("Eligible Job evidence IDs are inconsistent.");
  }
  if (stableJson(eligibleRoleClaims) !== stableJson(snapshot.eligibleRoleClaimIds)) {
    eligibilityReasons.push("Eligible Role claim IDs are inconsistent.");
  }
  if (stableJson(eligibleJobClaims) !== stableJson(snapshot.eligibleJobClaimIds)) {
    eligibilityReasons.push("Eligible Job claim IDs are inconsistent.");
  }
  if (
    snapshot.eligibleRoleEvidenceSetSha256 !== eligibilitySetHash(
      snapshot.evidenceItems,
      snapshot.claims,
      eligibleRoleEvidence,
      eligibleRoleClaims,
    )
  ) eligibilityReasons.push("Eligible Role evidence set hash is invalid.");
  if (
    snapshot.eligibleJobEvidenceSetSha256 !== eligibilitySetHash(
      snapshot.evidenceItems,
      snapshot.claims,
      eligibleJobEvidence,
      eligibleJobClaims,
    )
  ) eligibilityReasons.push("Eligible Job evidence set hash is invalid.");
  for (const metric of snapshot.verifiedMetrics) {
    if (!claimIds.has(metric.claimId) || metric.evidenceIds.some((id) => !evidenceIds.has(id))) {
      provenanceReasons.push(`Verified metric provenance is incomplete: ${metric.id}`);
    }
    if (hashText(metric.exactText) !== metric.textSha256) {
      hashReasons.push(`Verified metric text hash mismatch: ${metric.id}`);
    }
    const claim = snapshot.claims.find(({ id }) => id === metric.claimId);
    if (!claim?.eligibility.jobMapping || claim.metricStatus !== "verified_metric") {
      eligibilityReasons.push(`Verified metric is not tied to an eligible verified claim: ${metric.id}`);
    }
  }
  if (sourceIds.size === 0 && snapshot.evidenceItems.length > 0) {
    provenanceReasons.push("Snapshot has evidence but no source provenance.");
  }
  return {
    recordHashesMatch: hashReasons.length === 0,
    eligibilityConsistent: eligibilityReasons.length === 0,
    provenanceComplete: provenanceReasons.length === 0,
    hashReasons,
    eligibilityReasons,
    provenanceReasons,
  };
}

function emptyStatus(
  base: Pick<
    EvidenceSnapshotStatus,
    "snapshotId" | "snapshotExists" | "manifestExists" |
    "snapshotPath" | "manifestPath"
  >,
  status: "missing" | "invalid" | "incompatible",
  reasons: string[],
): EvidenceSnapshotStatus {
  return {
    ...base,
    contentHashMatches: null,
    identityMatches: null,
    sourceInventoryHashMatches: null,
    recordHashesMatch: null,
    eligibilityConsistent: null,
    provenanceComplete: null,
    manifestMatches: null,
    status,
    reasons,
  };
}

function resolveWithin(workspace: string, relativePath: string): string {
  const root = path.resolve(workspace);
  const resolved = path.resolve(root, relativePath);
  const relation = path.relative(root, resolved);
  if (
    relation === ".." ||
    relation.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relation)
  ) {
    throw new Error(`Evidence snapshot path escapes workspace: ${relativePath}`);
  }
  return resolved;
}

function safeSegment(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, "_");
}

function assertSnapshotId(value: string): void {
  EvidenceSnapshotIdSchema.parse(value);
}

function assertUnique(values: string[], label: string): void {
  if (new Set(values).size !== values.length) {
    throw new Error(`Duplicate ${label} IDs are not allowed.`);
  }
}

function schemaVersionOf(value: unknown): number | undefined {
  if (!value || typeof value !== "object") return undefined;
  const version = (value as { schemaVersion?: unknown }).schemaVersion;
  return typeof version === "number" ? version : undefined;
}

function byId<T extends { id: string }>(left: T, right: T): number {
  return left.id.localeCompare(right.id);
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
  }
  return value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
