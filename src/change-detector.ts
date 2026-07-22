import path from "node:path";
import { normalizeProjectIdentity } from "./entity-normalization.js";
import { hashText, uniqueSorted } from "./fs-utils.js";
import type { PrivacyFinding } from "./privacy.js";
import type { CareerProfile, Claim, EvidenceItem, Source, Visibility } from "./schemas.js";

export const UPDATE_BASELINE_VERSION = 1;

export type TrustCounts = {
  approved: number;
  needsConfirmation: number;
  blocked: number;
  resumeReady: number;
  genericOnly: number;
  internalOnly: number;
  doNotUse: number;
};

export type PrivacyCounts = {
  high: number;
  medium: number;
  low: number;
};

export type SourceSnapshot = {
  key: string;
  type: Source["type"];
  normalizedPath: string;
  versionHash: string;
  visibility: Visibility;
  status: Source["status"];
  sourceFamily: string;
};

export type EvidenceSnapshot = {
  key: string;
  versionHash: string;
  category: EvidenceItem["category"];
  parentContext: string;
  visibility: Visibility;
  confidence: EvidenceItem["confidence"];
  sensitivityCount: number;
};

export type ClaimSnapshot = {
  key: string;
  versionHash: string;
  type: Claim["type"];
  parentContext: string;
  approvalStatus: Claim["approvalStatus"];
  outputReadiness: Claim["outputReadiness"];
  factualConfidence: Claim["factualConfidence"];
  corroborationLevel: Claim["corroborationLevel"];
  publicSafe: boolean;
  metricStatus: Claim["metricStatus"];
};

export type AreaSnapshot = {
  key: string;
  versionHash: string;
};

export type ProfileAreaSnapshots = {
  roles: AreaSnapshot[];
  projects: AreaSnapshot[];
  skills: AreaSnapshot[];
  domains: AreaSnapshot[];
};

export type RefreshBaseline = {
  schemaVersion: typeof UPDATE_BASELINE_VERSION;
  successfulRefreshAt: string;
  profileFingerprint: string;
  sources: SourceSnapshot[];
  evidence: EvidenceSnapshot[];
  claims: ClaimSnapshot[];
  profileAreas: ProfileAreaSnapshots;
  trustCounts: TrustCounts;
  privacyCounts: PrivacyCounts;
  independentSourceFamilies: number;
};

export type CollectionDelta<T> = {
  added: T[];
  removed: T[];
  changed: Array<{ before: T; after: T }>;
  unchanged: T[];
};

export type StatusTransition = {
  target: "source" | "evidence" | "claim";
  key: string;
  field: string;
  from: string | number | boolean;
  to: string | number | boolean;
};

export type UpdateImpact = {
  firstRefresh: boolean;
  sources: CollectionDelta<SourceSnapshot>;
  evidence: CollectionDelta<EvidenceSnapshot>;
  claims: CollectionDelta<ClaimSnapshot>;
  profileAreas: {
    roles: CollectionDelta<AreaSnapshot>;
    projects: CollectionDelta<AreaSnapshot>;
    skills: CollectionDelta<AreaSnapshot>;
    domains: CollectionDelta<AreaSnapshot>;
  };
  trustTransitions: StatusTransition[];
  privacyTransitions: StatusTransition[];
  trustCountsBefore: TrustCounts;
  trustCountsAfter: TrustCounts;
  privacyCountsBefore: PrivacyCounts;
  privacyCountsAfter: PrivacyCounts;
  profileFingerprintChanged: boolean;
};

export type KnowledgeState = {
  sources: Source[];
  evidenceItems: EvidenceItem[];
  claims: Claim[];
  profile: CareerProfile;
  privacyFindings: PrivacyFinding[];
};

const EMPTY_TRUST_COUNTS: TrustCounts = {
  approved: 0,
  needsConfirmation: 0,
  blocked: 0,
  resumeReady: 0,
  genericOnly: 0,
  internalOnly: 0,
  doNotUse: 0
};

const EMPTY_PRIVACY_COUNTS: PrivacyCounts = { high: 0, medium: 0, low: 0 };

export function createRefreshBaseline(state: KnowledgeState, successfulRefreshAt = new Date().toISOString()): RefreshBaseline {
  const sourceById = new Map(state.sources.map((source) => [source.id, source]));
  const evidenceById = new Map(state.evidenceItems.map((item) => [item.id, item]));
  const parentContextById = buildParentContextMap(state.evidenceItems);
  const sources = state.sources.map(snapshotSource).sort(compareKeys);
  const evidence = state.evidenceItems
    .map((item) => snapshotEvidence(item, parentContextById))
    .sort(compareKeys);
  const claims = state.claims
    .map((claim) => snapshotClaim(claim, evidenceById, parentContextById, sourceById))
    .sort(compareKeys);
  const profileAreas = snapshotProfileAreas(state.profile);
  const trustCounts = countTrust(state.claims);
  const privacyCounts = countPrivacy(state.privacyFindings);
  const fingerprintPayload = {
    evidence: evidence.map(({ key, versionHash }) => ({ key, versionHash })),
    claims: claims.map(({ key, versionHash }) => ({ key, versionHash })),
    profileAreas,
    trustCounts,
    privacyCounts
  };

  return {
    schemaVersion: UPDATE_BASELINE_VERSION,
    successfulRefreshAt,
    profileFingerprint: hashText(stableStringify(fingerprintPayload)),
    sources,
    evidence,
    claims,
    profileAreas,
    trustCounts,
    privacyCounts,
    independentSourceFamilies: uniqueSorted(sources.map((source) => source.sourceFamily)).length
  };
}

export function detectUpdateImpact(previous: RefreshBaseline | null, current: RefreshBaseline): UpdateImpact {
  const previousAreas = previous?.profileAreas ?? emptyProfileAreas();
  const sources = compareCollections(previous?.sources ?? [], current.sources);
  const evidence = compareCollections(previous?.evidence ?? [], current.evidence);
  const claims = compareCollections(previous?.claims ?? [], current.claims);

  return {
    firstRefresh: previous === null,
    sources,
    evidence,
    claims,
    profileAreas: {
      roles: compareCollections(previousAreas.roles, current.profileAreas.roles),
      projects: compareCollections(previousAreas.projects, current.profileAreas.projects),
      skills: compareCollections(previousAreas.skills, current.profileAreas.skills),
      domains: compareCollections(previousAreas.domains, current.profileAreas.domains)
    },
    trustTransitions: collectClaimTransitions(claims.changed),
    privacyTransitions: collectPrivacyTransitions(sources.changed, evidence.changed, claims.changed),
    trustCountsBefore: previous?.trustCounts ?? { ...EMPTY_TRUST_COUNTS },
    trustCountsAfter: current.trustCounts,
    privacyCountsBefore: previous?.privacyCounts ?? { ...EMPTY_PRIVACY_COUNTS },
    privacyCountsAfter: current.privacyCounts,
    profileFingerprintChanged: previous?.profileFingerprint !== current.profileFingerprint
  };
}

export function countChanges<T>(delta: CollectionDelta<T>): { added: number; removed: number; changed: number; unchanged: number } {
  return {
    added: delta.added.length,
    removed: delta.removed.length,
    changed: delta.changed.length,
    unchanged: delta.unchanged.length
  };
}

export function sourceFamilyFor(source: Source): string {
  if (source.type === "cv") return "cv";
  if (source.type === "linkedin_export") return "linkedin_export";
  if (source.type === "recommendation") return "recommendation";

  const normalizedPath = normalizeRelativePath(source.path);
  const stem = path.posix.basename(normalizedPath).replace(/\.[^.]+$/, "")
    .replace(/(?:[-_](?:copy|export|backup|final|latest|v?\d+))+$/i, "");
  return `${source.type}:${normalizeText(stem)}`;
}

function snapshotSource(source: Source): SourceSnapshot {
  const normalizedPath = normalizeRelativePath(source.path);
  return {
    key: hashText(`${source.type}|${normalizedPath}`),
    type: source.type,
    normalizedPath,
    versionHash: source.hash,
    visibility: source.visibility,
    status: source.status,
    sourceFamily: sourceFamilyFor(source)
  };
}

function snapshotEvidence(item: EvidenceItem, parentContextById: Map<string, string>): EvidenceSnapshot {
  const parentContextValue = evidenceParentContext(item, parentContextById);
  const parentContext = hashText(parentContextValue);
  const normalizedText = normalizeText(item.normalizedSummary || item.text);
  const key = hashText(`${item.category}|${parentContextValue}|${normalizedText}`);
  const versionHash = hashText(stableStringify({
    confidence: item.confidence,
    dateRange: normalizeText(item.dateRange ?? ""),
    domains: uniqueSorted((item.domains ?? []).map(normalizeText)),
    sensitivityFlags: uniqueSorted(item.sensitivityFlags),
    sourceSection: normalizeText(item.sourceSection ?? ""),
    technologies: uniqueSorted((item.technologies ?? []).map(normalizeText)),
    visibility: item.visibility
  }));

  return {
    key,
    versionHash,
    category: item.category,
    parentContext,
    visibility: item.visibility,
    confidence: item.confidence,
    sensitivityCount: item.sensitivityFlags.length
  };
}

function snapshotClaim(
  claim: Claim,
  evidenceById: Map<string, EvidenceItem>,
  parentContextById: Map<string, string>,
  sourceById: Map<string, Source>
): ClaimSnapshot {
  const supportingItems = claim.supportingEvidenceIds
    .map((id) => evidenceById.get(id))
    .filter((item): item is EvidenceItem => Boolean(item));
  const parentContextValue = claim.parentRoleId
    ? parentContextById.get(claim.parentRoleId) ?? "role:unknown"
    : claim.parentProjectId
      ? parentContextById.get(claim.parentProjectId) ?? "project:unknown"
      : normalizeText(claim.sourceSection ?? "unscoped");
  const parentContext = hashText(parentContextValue);
  const key = hashText(`${claim.type}|${parentContextValue}|${normalizeText(claim.claim)}`);
  const sourceFamilies = uniqueSorted(supportingItems.flatMap((item) => item.sourceIds)
    .map((id) => sourceById.get(id))
    .filter((source): source is Source => Boolean(source))
    .map(sourceFamilyFor));
  const versionHash = hashText(stableStringify({
    approvalStatus: claim.approvalStatus,
    corroborationLevel: claim.corroborationLevel,
    extractionConfidence: claim.extractionConfidence,
    factualConfidence: claim.factualConfidence,
    metricStatus: claim.metricStatus,
    outputReadiness: claim.outputReadiness,
    publicSafe: claim.publicSafe,
    sourceFamilies
  }));

  return {
    key,
    versionHash,
    type: claim.type,
    parentContext,
    approvalStatus: claim.approvalStatus,
    outputReadiness: claim.outputReadiness,
    factualConfidence: claim.factualConfidence,
    corroborationLevel: claim.corroborationLevel,
    publicSafe: claim.publicSafe,
    metricStatus: claim.metricStatus
  };
}

function snapshotProfileAreas(profile: CareerProfile): ProfileAreaSnapshots {
  return {
    roles: profile.roles.map((role) => areaSnapshot("role", {
      company: normalizeText(role.company ?? ""),
      dateRange: normalizeText(role.dateRange ?? ""),
      title: normalizeText(role.title ?? "")
    })).sort(compareKeys),
    projects: profile.projects.map((project) => areaSnapshot("project", {
      domains: uniqueSorted((project.domains ?? []).map(normalizeText)),
      name: normalizeProjectIdentity(project.name),
      technologies: uniqueSorted((project.technologies ?? []).map(normalizeText))
    })).sort(compareKeys),
    skills: profile.skills.map((skill) => areaSnapshot("skill", { name: normalizeText(skill.name) })).sort(compareKeys),
    domains: profile.domains.map((domain) => areaSnapshot("domain", { name: normalizeText(domain) })).sort(compareKeys)
  };
}

function areaSnapshot(kind: string, value: Record<string, unknown>): AreaSnapshot {
  const serialized = stableStringify(value);
  return { key: hashText(`${kind}|${serialized}`), versionHash: hashText(serialized) };
}

function buildParentContextMap(items: EvidenceItem[]): Map<string, string> {
  const contexts = new Map<string, string>();
  for (const item of items) {
    if (item.category === "role") {
      contexts.set(item.id, `role:${normalizeText(item.company ?? "")}|${normalizeText(item.dateRange ?? "")}|${normalizeText(item.normalizedSummary)}`);
    } else if (item.category === "project") {
      contexts.set(item.id, `project:${normalizeProjectIdentity(item.project ?? item.normalizedSummary)}|${normalizeText(item.dateRange ?? "")}`);
    }
  }
  return contexts;
}

function evidenceParentContext(item: EvidenceItem, contexts: Map<string, string>): string {
  if (item.parentRoleId) return contexts.get(item.parentRoleId) ?? "role:unknown";
  if (item.parentProjectId) return contexts.get(item.parentProjectId) ?? "project:unknown";
  if (item.category === "role" || item.category === "project") return contexts.get(item.id) ?? `${item.category}:unknown`;
  return normalizeText(item.sourceSection ?? "unscoped");
}

function compareCollections<T extends { key: string; versionHash: string }>(before: T[], after: T[]): CollectionDelta<T> {
  const beforeByKey = new Map(before.map((item) => [item.key, item]));
  const afterByKey = new Map(after.map((item) => [item.key, item]));
  const added = after.filter((item) => !beforeByKey.has(item.key));
  const removed = before.filter((item) => !afterByKey.has(item.key));
  const changed = after.flatMap((item) => {
    const previous = beforeByKey.get(item.key);
    return previous && previous.versionHash !== item.versionHash ? [{ before: previous, after: item }] : [];
  });
  const unchanged = after.filter((item) => beforeByKey.get(item.key)?.versionHash === item.versionHash);

  return { added, removed, changed, unchanged };
}

function collectClaimTransitions(changes: Array<{ before: ClaimSnapshot; after: ClaimSnapshot }>): StatusTransition[] {
  return changes.flatMap(({ before, after }) => [
    transition("claim", before.key, "approvalStatus", before.approvalStatus, after.approvalStatus),
    transition("claim", before.key, "outputReadiness", before.outputReadiness, after.outputReadiness),
    transition("claim", before.key, "factualConfidence", before.factualConfidence, after.factualConfidence),
    transition("claim", before.key, "corroborationLevel", before.corroborationLevel, after.corroborationLevel),
    transition("claim", before.key, "metricStatus", before.metricStatus, after.metricStatus)
  ].filter((item): item is StatusTransition => Boolean(item)));
}

function collectPrivacyTransitions(
  sourceChanges: Array<{ before: SourceSnapshot; after: SourceSnapshot }>,
  evidenceChanges: Array<{ before: EvidenceSnapshot; after: EvidenceSnapshot }>,
  claimChanges: Array<{ before: ClaimSnapshot; after: ClaimSnapshot }>
): StatusTransition[] {
  return [
    ...sourceChanges.flatMap(({ before, after }) => [transition("source", before.key, "visibility", before.visibility, after.visibility)]),
    ...evidenceChanges.flatMap(({ before, after }) => [
      transition("evidence", before.key, "visibility", before.visibility, after.visibility),
      transition("evidence", before.key, "sensitivityCount", before.sensitivityCount, after.sensitivityCount)
    ]),
    ...claimChanges.flatMap(({ before, after }) => [transition("claim", before.key, "publicSafe", before.publicSafe, after.publicSafe)])
  ].filter((item): item is StatusTransition => Boolean(item));
}

function transition(
  target: StatusTransition["target"],
  key: string,
  field: string,
  from: string | number | boolean,
  to: string | number | boolean
): StatusTransition | null {
  return from === to ? null : { target, key, field, from, to };
}

function countTrust(claims: Claim[]): TrustCounts {
  return {
    approved: claims.filter((claim) => claim.approvalStatus === "approved").length,
    needsConfirmation: claims.filter((claim) => claim.approvalStatus === "needs_confirmation").length,
    blocked: claims.filter((claim) => claim.approvalStatus === "blocked").length,
    resumeReady: claims.filter((claim) => claim.outputReadiness === "resume_ready").length,
    genericOnly: claims.filter((claim) => claim.outputReadiness === "generic_only").length,
    internalOnly: claims.filter((claim) => claim.outputReadiness === "internal_only").length,
    doNotUse: claims.filter((claim) => claim.outputReadiness === "do_not_use").length
  };
}

function countPrivacy(findings: PrivacyFinding[]): PrivacyCounts {
  return {
    high: findings.filter((finding) => finding.severity === "high").length,
    medium: findings.filter((finding) => finding.severity === "medium").length,
    low: findings.filter((finding) => finding.severity === "low").length
  };
}

function normalizeRelativePath(value: string): string {
  const normalized = value.replace(/\\/g, "/").replace(/^\.\//, "");
  if (path.posix.isAbsolute(normalized) || /^[A-Za-z]:\//.test(normalized)) {
    return `external/${path.posix.basename(normalized)}`;
  }
  return normalized.split("/").filter((part) => part && part !== "." && part !== "..").join("/").toLowerCase();
}

function normalizeText(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function emptyProfileAreas(): ProfileAreaSnapshots {
  return { roles: [], projects: [], skills: [], domains: [] };
}

function compareKeys<T extends { key: string }>(a: T, b: T): number {
  return a.key.localeCompare(b.key);
}
