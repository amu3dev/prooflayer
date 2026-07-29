import path from "node:path";
import {
  hashFile,
  hashText,
  pathExists,
  readJson,
  writeJsonAtomic,
} from "./fs-utils.js";
import {
  TargetEvidencePinManifestSchema,
  TargetEvidencePinSchema,
  type TargetEvidencePin,
  type TargetEvidencePinManifest,
} from "./evidence-pin-schemas.js";
import {
  loadEvidenceSnapshot,
  type LoadedEvidenceSnapshot,
} from "./evidence-snapshots.js";
import { stableJson } from "./target-proposal.js";
import { showTarget } from "./targets.js";
import type { Target } from "./schemas.js";

const PIN_FILE = "pinned-snapshot.json";
const MANIFEST_FILE = "pinned-snapshot-manifest.json";

export interface TargetEvidencePinPaths {
  rootRelativePath: string;
  rootPath: string;
  pinRelativePath: string;
  pinPath: string;
  manifestRelativePath: string;
  manifestPath: string;
  targetRelativePath: string;
  targetPath: string;
}

export interface TargetEvidencePinResult {
  targetId: string;
  targetType: Target["type"];
  snapshotId: string;
  result: "pinned" | "upgraded" | "already-current";
  pinPath: string;
  manifestPath: string;
  snapshotPath: string;
  snapshotContentSha256: string;
  eligibleRoleEvidenceCount: number;
  eligibleJobEvidenceCount: number;
}

export interface TargetEvidencePinStatus {
  targetId: string;
  targetType: Target["type"] | null;
  pinExists: boolean;
  manifestExists: boolean;
  targetHashMatches: boolean | null;
  pinHashMatches: boolean | null;
  snapshotStatus:
    | "missing"
    | "current"
    | "invalid"
    | "incompatible"
    | null;
  snapshotContentHashMatches: boolean | null;
  snapshotManifestHashMatches: boolean | null;
  identityMatches: boolean | null;
  status: "missing" | "current" | "stale" | "invalid" | "incompatible";
  reasons: string[];
  pinPath: string | null;
  manifestPath: string | null;
  snapshotId: string | null;
}

export interface LoadedTargetEvidencePin {
  pin: Readonly<TargetEvidencePin>;
  manifest: Readonly<TargetEvidencePinManifest>;
  snapshot: LoadedEvidenceSnapshot;
  paths: TargetEvidencePinPaths;
}

export async function pinTargetEvidenceSnapshot(
  workspace: string,
  targetId: string,
  snapshotId: string,
  options: { now?: () => Date } = {},
): Promise<TargetEvidencePinResult> {
  const target = await showTarget(workspace, targetId);
  const paths = targetEvidencePinPaths(workspace, target);
  if (await pathExists(paths.pinPath) || await pathExists(paths.manifestPath)) {
    const status = await getTargetEvidencePinStatus(workspace, targetId);
    if (
      status.status === "current" &&
      status.snapshotId === snapshotId
    ) {
      return resultFromLoaded(
        await loadTargetEvidencePin(workspace, targetId),
        "already-current",
      );
    }
    if (status.status === "current") {
      throw new Error(
        `Target ${targetId} is already pinned to ${status.snapshotId}. Use evidence-upgrade to change the pin explicitly.`,
      );
    }
    throw new Error(
      `Stored evidence pin for ${targetId} is ${status.status} and was not overwritten. ${status.reasons.join(" ")}`,
    );
  }
  return writePin(workspace, target, snapshotId, "pin", options.now);
}

export async function upgradeTargetEvidenceSnapshot(
  workspace: string,
  targetId: string,
  snapshotId: string,
  options: { now?: () => Date } = {},
): Promise<TargetEvidencePinResult> {
  const target = await showTarget(workspace, targetId);
  const paths = targetEvidencePinPaths(workspace, target);
  if (!(await pathExists(paths.pinPath)) && !(await pathExists(paths.manifestPath))) {
    throw new Error(
      `Target ${targetId} has no evidence pin to upgrade. Use evidence-pin first.`,
    );
  }
  const status = await getTargetEvidencePinStatus(workspace, targetId);
  if (status.status !== "current") {
    throw new Error(
      `Stored evidence pin for ${targetId} is ${status.status}; invalid or stale pins are never replaced silently. ${status.reasons.join(" ")}`,
    );
  }
  if (status.snapshotId === snapshotId) {
    return resultFromLoaded(
      await loadTargetEvidencePin(workspace, targetId),
      "already-current",
    );
  }
  return writePin(workspace, target, snapshotId, "upgrade", options.now);
}

export async function getTargetEvidencePinStatus(
  workspace: string,
  targetId: string,
): Promise<TargetEvidencePinStatus> {
  let target: Target;
  try {
    target = await showTarget(workspace, targetId);
  } catch (error) {
    return emptyStatus(targetId, null, "invalid", [errorMessage(error)]);
  }
  const paths = targetEvidencePinPaths(workspace, target);
  const pinExists = await pathExists(paths.pinPath);
  const manifestExists = await pathExists(paths.manifestPath);
  const base = {
    targetId,
    targetType: target.type,
    pinExists,
    manifestExists,
    pinPath: paths.pinRelativePath,
    manifestPath: paths.manifestRelativePath,
  };
  if (!pinExists && !manifestExists) {
    return {
      ...emptyStatus(
        targetId,
        target.type,
        "missing",
        ["Target has no explicitly pinned Evidence Snapshot."],
      ),
      ...base,
    };
  }
  if (!pinExists || !manifestExists) {
    return {
      ...emptyStatus(
        targetId,
        target.type,
        "invalid",
        ["Evidence pin artifact set is incomplete."],
      ),
      ...base,
    };
  }

  let pin: TargetEvidencePin;
  let manifest: TargetEvidencePinManifest;
  try {
    pin = TargetEvidencePinSchema.parse(
      await readJson<unknown>(paths.pinPath, null),
    );
    manifest = TargetEvidencePinManifestSchema.parse(
      await readJson<unknown>(paths.manifestPath, null),
    );
  } catch (error) {
    return {
      ...emptyStatus(
        targetId,
        target.type,
        "invalid",
        [`Evidence pin contract is invalid: ${errorMessage(error)}`],
      ),
      ...base,
    };
  }

  const targetSha256 = await hashFile(paths.targetPath);
  const pinSha256 = await hashFile(paths.pinPath);
  const targetHashMatches =
    pin.target.sha256 === targetSha256 &&
    manifest.targetSha256 === targetSha256;
  const pinHashMatches = manifest.pinSha256 === pinSha256;
  const identityMatches =
    pin.id === pinIdFor(targetId, target.type, targetSha256, pin.snapshot) &&
    manifest.pinId === pin.id &&
    manifest.targetId === pin.targetId &&
    manifest.targetType === pin.targetType &&
    manifest.pinPath === paths.pinRelativePath &&
    pin.targetId === targetId &&
    pin.targetType === target.type &&
    pin.target.path === paths.targetRelativePath &&
    manifest.snapshotId === pin.snapshot.id &&
    manifest.snapshotContentSha256 === pin.snapshot.contentSha256 &&
    manifest.snapshotManifestSha256 === pin.snapshot.manifestSha256 &&
    manifest.snapshotSchemaVersion === pin.snapshot.schemaVersion &&
    manifest.snapshotPolicyVersion === pin.snapshot.policyVersion;

  let snapshotStatus: TargetEvidencePinStatus["snapshotStatus"] = null;
  let snapshotContentHashMatches: boolean | null = null;
  let snapshotManifestHashMatches: boolean | null = null;
  const snapshotReasons: string[] = [];
  try {
    const loaded = await loadEvidenceSnapshot(workspace, pin.snapshot.id);
    snapshotStatus = "current";
    snapshotContentHashMatches =
      loaded.manifest.contentSha256 === pin.snapshot.contentSha256 &&
      loaded.paths.snapshotRelativePath === pin.snapshot.path;
    snapshotManifestHashMatches =
      loaded.manifestSha256 === pin.snapshot.manifestSha256 &&
      loaded.paths.manifestRelativePath === pin.snapshot.manifestPath;
  } catch (error) {
    const message = errorMessage(error);
    snapshotStatus = message.includes("incompatible")
      ? "incompatible"
      : message.includes("missing")
      ? "missing"
      : "invalid";
    snapshotReasons.push(message);
  }

  const invalidReasons = [
    ...(!pinHashMatches ? ["Evidence pin SHA-256 does not match its manifest."] : []),
    ...(!identityMatches ? ["Evidence pin identity or manifest binding is invalid."] : []),
  ];
  const incompatibleReasons = snapshotStatus === "incompatible"
    ? ["Pinned Evidence Snapshot uses an incompatible contract version."]
    : [];
  const staleReasons = [
    ...(!targetHashMatches ? ["Target changed after the Evidence Snapshot was pinned."] : []),
    ...(snapshotStatus !== "current" && snapshotStatus !== "incompatible"
      ? ["Pinned Evidence Snapshot is unavailable or invalid.", ...snapshotReasons]
      : []),
    ...(!snapshotContentHashMatches
      ? ["Pinned Evidence Snapshot content hash or path changed."]
      : []),
    ...(!snapshotManifestHashMatches
      ? ["Pinned Evidence Snapshot manifest hash or path changed."]
      : []),
  ];
  const status = invalidReasons.length > 0
    ? "invalid"
    : incompatibleReasons.length > 0
    ? "incompatible"
    : staleReasons.length > 0
    ? "stale"
    : "current";
  return {
    ...base,
    targetHashMatches,
    pinHashMatches,
    snapshotStatus,
    snapshotContentHashMatches,
    snapshotManifestHashMatches,
    identityMatches,
    status,
    reasons: [...new Set([
      ...invalidReasons,
      ...incompatibleReasons,
      ...staleReasons,
    ])].sort(),
    snapshotId: pin.snapshot.id,
  };
}

export async function loadTargetEvidencePin(
  workspace: string,
  targetId: string,
): Promise<LoadedTargetEvidencePin> {
  const status = await getTargetEvidencePinStatus(workspace, targetId);
  if (status.status !== "current") {
    throw new Error(
      `Target Evidence Snapshot pin for ${targetId} is ${status.status}: ${status.reasons.join(" ")}`,
    );
  }
  const target = await showTarget(workspace, targetId);
  const paths = targetEvidencePinPaths(workspace, target);
  const pin = TargetEvidencePinSchema.parse(
    await readJson<unknown>(paths.pinPath, null),
  );
  const manifest = TargetEvidencePinManifestSchema.parse(
    await readJson<unknown>(paths.manifestPath, null),
  );
  return {
    pin: deepFreeze(structuredClone(pin)),
    manifest: deepFreeze(structuredClone(manifest)),
    snapshot: await loadEvidenceSnapshot(workspace, pin.snapshot.id),
    paths,
  };
}

export function targetEvidencePinPaths(
  workspace: string,
  target: Target,
): TargetEvidencePinPaths {
  const targetDirectory = target.type === "job" ? "jobs" : "roles";
  const rootRelativePath = `targets/${targetDirectory}/${target.id}/evidence`;
  const pinRelativePath = `${rootRelativePath}/${PIN_FILE}`;
  const manifestRelativePath = `${rootRelativePath}/${MANIFEST_FILE}`;
  const targetRelativePath =
    `targets/${targetDirectory}/${target.id}/target.json`;
  return {
    rootRelativePath,
    rootPath: resolveWithin(workspace, rootRelativePath),
    pinRelativePath,
    pinPath: resolveWithin(workspace, pinRelativePath),
    manifestRelativePath,
    manifestPath: resolveWithin(workspace, manifestRelativePath),
    targetRelativePath,
    targetPath: resolveWithin(workspace, targetRelativePath),
  };
}

export function formatTargetEvidencePinResult(
  result: TargetEvidencePinResult,
): string {
  return [
    `Target ID: ${result.targetId}`,
    `Target type: ${result.targetType}`,
    `Pin result: ${result.result}`,
    `Snapshot ID: ${result.snapshotId}`,
    `Pin: ${result.pinPath}`,
    `Manifest: ${result.manifestPath}`,
    `Snapshot: ${result.snapshotPath}`,
    `Snapshot SHA-256: ${result.snapshotContentSha256}`,
    `Eligible Role evidence: ${result.eligibleRoleEvidenceCount}`,
    `Eligible Job evidence: ${result.eligibleJobEvidenceCount}`,
  ].join("\n");
}

export function formatTargetEvidencePinStatus(
  status: TargetEvidencePinStatus,
): string {
  const check = (value: boolean | null): string =>
    value === null ? "not applicable" : value ? "yes" : "no";
  return [
    `Target ID: ${status.targetId}`,
    `Target type: ${status.targetType ?? "unknown"}`,
    `Overall status: ${status.status}`,
    `Snapshot ID: ${status.snapshotId ?? "none"}`,
    `Pin exists: ${status.pinExists ? "yes" : "no"}`,
    `Manifest exists: ${status.manifestExists ? "yes" : "no"}`,
    `Target hash matches: ${check(status.targetHashMatches)}`,
    `Pin hash matches: ${check(status.pinHashMatches)}`,
    `Snapshot status: ${status.snapshotStatus ?? "not applicable"}`,
    `Snapshot content matches: ${check(status.snapshotContentHashMatches)}`,
    `Snapshot manifest matches: ${check(status.snapshotManifestHashMatches)}`,
    `Identity matches: ${check(status.identityMatches)}`,
    `Pin: ${status.pinPath ?? "not applicable"}`,
    `Manifest: ${status.manifestPath ?? "not applicable"}`,
    ...(status.reasons.length
      ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)]
      : []),
  ].join("\n");
}

async function writePin(
  workspace: string,
  target: Target,
  snapshotId: string,
  operation: "pin" | "upgrade",
  nowProvider?: () => Date,
): Promise<TargetEvidencePinResult> {
  const loadedSnapshot = await loadEvidenceSnapshot(workspace, snapshotId);
  const paths = targetEvidencePinPaths(workspace, target);
  const targetSha256 = await hashFile(paths.targetPath);
  const timestamp = (nowProvider ?? (() => new Date()))().toISOString();
  const snapshotBinding = {
    id: loadedSnapshot.snapshot.id,
    path: loadedSnapshot.paths.snapshotRelativePath,
    contentSha256: loadedSnapshot.manifest.contentSha256,
    manifestPath: loadedSnapshot.paths.manifestRelativePath,
    manifestSha256: loadedSnapshot.manifestSha256,
    schemaVersion: loadedSnapshot.snapshot.schemaVersion,
    contractName: loadedSnapshot.snapshot.contract.name,
    policyName: loadedSnapshot.snapshot.policy.name,
    policyVersion: loadedSnapshot.snapshot.policy.version,
  };
  const pin = TargetEvidencePinSchema.parse({
    schemaVersion: 1,
    id: pinIdFor(target.id, target.type, targetSha256, snapshotBinding),
    targetId: target.id,
    targetType: target.type,
    target: {
      path: paths.targetRelativePath,
      sha256: targetSha256,
    },
    snapshot: snapshotBinding,
    pinnedAt: timestamp,
    provenance: {
      method: "explicit-cli",
      operation,
    },
  });
  await writeJsonAtomic(paths.pinPath, pin);
  const pinSha256 = await hashFile(paths.pinPath);
  const manifest = TargetEvidencePinManifestSchema.parse({
    schemaVersion: 1,
    pinId: pin.id,
    targetId: target.id,
    targetType: target.type,
    pinPath: paths.pinRelativePath,
    pinSha256,
    targetSha256,
    snapshotId: snapshotBinding.id,
    snapshotContentSha256: snapshotBinding.contentSha256,
    snapshotManifestSha256: snapshotBinding.manifestSha256,
    snapshotSchemaVersion: snapshotBinding.schemaVersion,
    snapshotPolicyVersion: snapshotBinding.policyVersion,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  await writeJsonAtomic(paths.manifestPath, manifest);
  const status = await getTargetEvidencePinStatus(workspace, target.id);
  if (status.status !== "current") {
    throw new Error(
      `Evidence pin failed validation: ${status.status}. ${status.reasons.join(" ")}`,
    );
  }
  return resultFromLoaded(
    await loadTargetEvidencePin(workspace, target.id),
    operation === "pin" ? "pinned" : "upgraded",
  );
}

function resultFromLoaded(
  loaded: LoadedTargetEvidencePin,
  result: TargetEvidencePinResult["result"],
): TargetEvidencePinResult {
  return {
    targetId: loaded.pin.targetId,
    targetType: loaded.pin.targetType,
    snapshotId: loaded.pin.snapshot.id,
    result,
    pinPath: loaded.paths.pinRelativePath,
    manifestPath: loaded.paths.manifestRelativePath,
    snapshotPath: loaded.snapshot.paths.snapshotRelativePath,
    snapshotContentSha256: loaded.pin.snapshot.contentSha256,
    eligibleRoleEvidenceCount:
      loaded.snapshot.snapshot.completeness.eligibleRoleEvidenceCount,
    eligibleJobEvidenceCount:
      loaded.snapshot.snapshot.completeness.eligibleJobEvidenceCount,
  };
}

function pinIdFor(
  targetId: string,
  targetType: Target["type"],
  targetSha256: string,
  snapshot: {
    id: string;
    contentSha256: string;
    manifestSha256: string;
    schemaVersion: number;
    policyVersion: string;
  },
): string {
  return `evidence-pin_${hashText(stableJson({
    targetId,
    targetType,
    targetSha256,
    snapshotId: snapshot.id,
    snapshotContentSha256: snapshot.contentSha256,
    snapshotManifestSha256: snapshot.manifestSha256,
    snapshotSchemaVersion: snapshot.schemaVersion,
    snapshotPolicyVersion: snapshot.policyVersion,
  })).slice(0, 16)}`;
}

function emptyStatus(
  targetId: string,
  targetType: Target["type"] | null,
  status: TargetEvidencePinStatus["status"],
  reasons: string[],
): TargetEvidencePinStatus {
  return {
    targetId,
    targetType,
    pinExists: false,
    manifestExists: false,
    targetHashMatches: null,
    pinHashMatches: null,
    snapshotStatus: null,
    snapshotContentHashMatches: null,
    snapshotManifestHashMatches: null,
    identityMatches: null,
    status,
    reasons,
    pinPath: null,
    manifestPath: null,
    snapshotId: null,
  };
}

function resolveWithin(workspace: string, relativePath: string): string {
  const root = path.resolve(workspace);
  const resolved = path.resolve(root, relativePath);
  const prefix = `${root}${path.sep}`;
  if (resolved !== root && !resolved.startsWith(prefix)) {
    throw new Error(`Path escapes workspace boundary: ${relativePath}`);
  }
  return resolved;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const item of Object.values(value as Record<string, unknown>)) {
      deepFreeze(item);
    }
  }
  return value;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
