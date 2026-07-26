import path from "node:path";
import { approvedJobRequirementPaths, getApprovedJobRequirementsStatus, showApprovedJobRequirements, } from "./approved-job-requirements.js";
import { calculateEvidenceSnapshot } from "./evidence-matching.js";
import { hashFile, hashText, pathExists, readJson, uniqueSorted, writeJsonAtomic, } from "./fs-utils.js";
import { JobEvidenceMapManifestSchema, JobEvidenceMapSchema, } from "./job-evidence-map-schemas.js";
import { ApprovedJobRequirementManifestSchema, } from "./job-requirement-schemas.js";
import { getJobRequirementModelStatus, jobRequirementPaths, showJobRequirementModel, } from "./job-requirements.js";
import { ClaimSchema, EvidenceItemSchema, } from "./schemas.js";
import { showTarget } from "./targets.js";
import { stableJson } from "./target-proposal.js";
export const JOB_EVIDENCE_MAPPER_NAME = "job-evidence-mapper";
export const JOB_EVIDENCE_MAPPER_VERSION = "1";
export const JOB_EVIDENCE_MAPPING_POLICY_NAME = "job-evidence-mapping-policy";
export const JOB_EVIDENCE_MAPPING_POLICY_VERSION = "1";
const MAP_FILE = "job-evidence-map.json";
const MANIFEST_FILE = "job-evidence-map-manifest.json";
export function jobEvidenceMapPaths(workspace, targetId) {
    const rootRelativePath = `targets/jobs/${targetId}/matching/deterministic`;
    const mapRelativePath = `${rootRelativePath}/${MAP_FILE}`;
    const manifestRelativePath = `${rootRelativePath}/${MANIFEST_FILE}`;
    return {
        rootRelativePath,
        rootPath: resolveWithin(workspace, rootRelativePath),
        mapRelativePath,
        mapPath: resolveWithin(workspace, mapRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
export async function buildJobEvidenceMap(workspace, targetId, options = {}) {
    const target = await requireJobTarget(workspace, targetId);
    const requirementInput = await loadRequirementInput(workspace, targetId, options.requirementSource ?? "deterministic");
    assertUsableRequirementModel(requirementInput.model);
    const candidates = await loadEligibleCandidates(workspace);
    const input = await mappingInput(workspace, target, requirementInput, candidates);
    const status = await getJobEvidenceMapStatus(workspace, targetId);
    const paths = jobEvidenceMapPaths(workspace, targetId);
    if (status.status === "current" &&
        (await pathExists(paths.manifestPath))) {
        const currentManifest = JobEvidenceMapManifestSchema.parse(await readJson(paths.manifestPath, null));
        if (currentManifest.requirementModelType === requirementInput.type &&
            currentManifest.normalizedInputSha256 === input.normalizedInputSha256) {
            return resultFromMap(await showJobEvidenceMap(workspace, targetId), requirementInput.type, paths, "already-current");
        }
        if (!options.rebuild) {
            throw new Error("A current job evidence map exists for a different requirement input. Use --rebuild to replace it explicitly.");
        }
    }
    if ((status.status === "stale" || status.status === "invalid") && !options.rebuild) {
        throw new Error(`Stored job evidence map is ${status.status} and was not overwritten. Review dependencies, then use --rebuild. ${status.reasons.join(" ")}`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (status.mapExists) {
        try {
            const previous = await showJobEvidenceMap(workspace, targetId);
            if (previous.targetId === targetId)
                createdAt = previous.createdAt;
        }
        catch {
            // Explicit rebuild may replace an invalid artifact while preserving safety.
        }
    }
    const mapped = mapRequirements(targetId, requirementInput, requirementInput.model.requirements, candidates);
    const map = JobEvidenceMapSchema.parse({
        schemaVersion: 1,
        id: `job-evidence-map_${hashText(`${targetId}\u0000${input.normalizedInputSha256}\u0000${JOB_EVIDENCE_MAPPING_POLICY_VERSION}`).slice(0, 14)}`,
        targetId,
        targetType: "job",
        policy: {
            name: JOB_EVIDENCE_MAPPING_POLICY_NAME,
            version: JOB_EVIDENCE_MAPPING_POLICY_VERSION,
            mode: "deterministic",
        },
        input: {
            target: {
                path: `targets/jobs/${targetId}/target.json`,
                sha256: input.targetSha256,
            },
            jobDescription: {
                path: `targets/jobs/${targetId}/job-description.md`,
                sha256: input.sourceSha256,
            },
            requirementModelType: requirementInput.type,
            requirementModel: {
                path: requirementInput.modelPath,
                sha256: requirementInput.modelSha256,
            },
            requirementManifest: {
                path: requirementInput.manifestPath,
                sha256: requirementInput.manifestSha256,
            },
            sources: {
                path: "kb/sources.json",
                sha256: input.sourcesSha256,
            },
            evidenceItems: {
                path: "kb/evidence-items.json",
                sha256: input.evidenceItemsSha256,
            },
            claims: {
                path: "kb/claims.json",
                sha256: input.claimsSha256,
            },
            eligibleEvidenceSetSha256: input.eligibleEvidenceSetSha256,
            normalizedInputSha256: input.normalizedInputSha256,
        },
        ...mapped,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.mapPath, map);
    const manifest = JobEvidenceMapManifestSchema.parse({
        schemaVersion: 1,
        mapId: map.id,
        targetId,
        targetType: "job",
        mapPath: paths.mapRelativePath,
        mapSha256: await hashFile(paths.mapPath),
        mapperName: JOB_EVIDENCE_MAPPER_NAME,
        mapperVersion: JOB_EVIDENCE_MAPPER_VERSION,
        policyName: JOB_EVIDENCE_MAPPING_POLICY_NAME,
        policyVersion: JOB_EVIDENCE_MAPPING_POLICY_VERSION,
        targetSha256: input.targetSha256,
        sourceSha256: input.sourceSha256,
        requirementModelType: requirementInput.type,
        requirementModelSha256: requirementInput.modelSha256,
        requirementManifestSha256: requirementInput.manifestSha256,
        sourcesSha256: input.sourcesSha256,
        evidenceItemsSha256: input.evidenceItemsSha256,
        claimsSha256: input.claimsSha256,
        eligibleEvidenceSetSha256: input.eligibleEvidenceSetSha256,
        normalizedInputSha256: input.normalizedInputSha256,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return resultFromMap(map, requirementInput.type, paths, status.status === "missing" ? "created" : "rebuilt");
}
export async function showJobEvidenceMap(workspace, targetId) {
    await requireJobTarget(workspace, targetId);
    const paths = jobEvidenceMapPaths(workspace, targetId);
    if (!(await pathExists(paths.mapPath))) {
        throw new Error(`Job evidence map not found for target: ${targetId}`);
    }
    return JobEvidenceMapSchema.parse(await readJson(paths.mapPath, null));
}
export async function getJobEvidenceMapStatus(workspace, targetId) {
    const target = await requireJobTarget(workspace, targetId);
    const paths = jobEvidenceMapPaths(workspace, targetId);
    const mapExists = await pathExists(paths.mapPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = {
        targetId,
        mapExists,
        manifestExists,
        mapPath: paths.mapRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!mapExists && !manifestExists) {
        return emptyStatus(base, "missing", ["No deterministic job evidence map exists."]);
    }
    if (!mapExists || !manifestExists) {
        return emptyStatus(base, "invalid", ["Job evidence map artifact set is incomplete."]);
    }
    let map;
    let manifest;
    try {
        map = JobEvidenceMapSchema.parse(await readJson(paths.mapPath, null));
        manifest = JobEvidenceMapManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyStatus(base, "invalid", [
            `Stored job evidence map is invalid: ${errorMessage(error)}`,
        ]);
    }
    const mapHashMatches = (await hashFile(paths.mapPath)) === manifest.mapSha256;
    const invalidReasons = validateStoredMapIdentity(map, manifest, paths);
    if (!mapHashMatches) {
        invalidReasons.push("Job evidence map SHA-256 does not match its manifest.");
    }
    if (invalidReasons.length > 0) {
        return {
            ...emptyStatus(base, "invalid", invalidReasons),
            mapHashMatches,
        };
    }
    let requirementInput;
    let requirementModelStatus = null;
    const dependencyReasons = [];
    try {
        requirementInput = await loadRequirementInput(workspace, targetId, manifest.requirementModelType);
        requirementModelStatus = "current";
    }
    catch (error) {
        requirementModelStatus = await requirementStatus(workspace, targetId, manifest.requirementModelType);
        dependencyReasons.push(`Requirement model is unavailable: ${errorMessage(error)}`);
    }
    const targetPath = resolveWithin(workspace, `targets/jobs/${targetId}/target.json`);
    const sourcePath = resolveWithin(workspace, `targets/jobs/${targetId}/job-description.md`);
    const targetHashMatches = await hashMatches(targetPath, manifest.targetSha256);
    const sourceHashMatches = await hashMatches(sourcePath, manifest.sourceSha256);
    const requirementModelHashMatches = requirementInput
        ? requirementInput.modelSha256 === manifest.requirementModelSha256
        : false;
    const requirementManifestHashMatches = requirementInput
        ? requirementInput.manifestSha256 === manifest.requirementManifestSha256
        : false;
    const sourcesHashMatches = await hashMatches(resolveWithin(workspace, "kb/sources.json"), manifest.sourcesSha256);
    const evidenceItemsHashMatches = await hashMatches(resolveWithin(workspace, "kb/evidence-items.json"), manifest.evidenceItemsSha256);
    const claimsHashMatches = await hashMatches(resolveWithin(workspace, "kb/claims.json"), manifest.claimsSha256);
    const policyMatches = manifest.mapperName === JOB_EVIDENCE_MAPPER_NAME &&
        manifest.mapperVersion === JOB_EVIDENCE_MAPPER_VERSION &&
        manifest.policyName === JOB_EVIDENCE_MAPPING_POLICY_NAME &&
        manifest.policyVersion === JOB_EVIDENCE_MAPPING_POLICY_VERSION &&
        map.policy.name === manifest.policyName &&
        map.policy.version === manifest.policyVersion;
    let eligibleEvidenceSetHashMatches = false;
    let normalizedInputHashMatches = false;
    if (requirementInput &&
        sourcesHashMatches &&
        evidenceItemsHashMatches &&
        claimsHashMatches) {
        try {
            const candidates = await loadEligibleCandidates(workspace);
            const currentInput = await mappingInput(workspace, target, requirementInput, candidates);
            eligibleEvidenceSetHashMatches =
                currentInput.eligibleEvidenceSetSha256 === manifest.eligibleEvidenceSetSha256;
            normalizedInputHashMatches =
                currentInput.normalizedInputSha256 === manifest.normalizedInputSha256;
            if (targetHashMatches &&
                sourceHashMatches &&
                requirementModelHashMatches &&
                requirementManifestHashMatches &&
                eligibleEvidenceSetHashMatches &&
                policyMatches &&
                normalizedInputHashMatches) {
                const semanticIssues = validateMapContents(map, requirementInput, candidates);
                if (semanticIssues.length > 0) {
                    return {
                        ...base,
                        mapHashMatches,
                        targetHashMatches,
                        sourceHashMatches,
                        requirementModelStatus,
                        requirementModelHashMatches,
                        requirementManifestHashMatches,
                        sourcesHashMatches,
                        evidenceItemsHashMatches,
                        claimsHashMatches,
                        eligibleEvidenceSetHashMatches,
                        policyMatches,
                        normalizedInputHashMatches,
                        status: "invalid",
                        reasons: semanticIssues,
                    };
                }
            }
        }
        catch (error) {
            dependencyReasons.push(`Eligible evidence dependencies are unavailable: ${errorMessage(error)}`);
        }
    }
    const staleReasons = [
        ...dependencyReasons,
        ...(!targetHashMatches ? ["Job Target changed."] : []),
        ...(!sourceHashMatches ? ["Persisted Job Description changed."] : []),
        ...(requirementModelStatus !== "current"
            ? [`Requirement model is ${requirementModelStatus ?? "unavailable"}.`]
            : []),
        ...(!requirementModelHashMatches ? ["Requirement model changed."] : []),
        ...(!requirementManifestHashMatches ? ["Requirement model manifest changed."] : []),
        ...(!sourcesHashMatches ? ["Source registry changed."] : []),
        ...(!evidenceItemsHashMatches ? ["Reviewed evidence items changed."] : []),
        ...(!claimsHashMatches ? ["Reviewed claims changed."] : []),
        ...(!eligibleEvidenceSetHashMatches ? ["Eligible evidence set changed."] : []),
        ...(!policyMatches ? ["Job evidence mapping policy or mapper changed."] : []),
        ...(!normalizedInputHashMatches ? ["Normalized job evidence mapping input changed."] : []),
    ];
    return {
        ...base,
        mapHashMatches,
        targetHashMatches,
        sourceHashMatches,
        requirementModelStatus,
        requirementModelHashMatches,
        requirementManifestHashMatches,
        sourcesHashMatches,
        evidenceItemsHashMatches,
        claimsHashMatches,
        eligibleEvidenceSetHashMatches,
        policyMatches,
        normalizedInputHashMatches,
        status: staleReasons.length > 0 ? "stale" : "current",
        reasons: uniqueSorted(staleReasons),
    };
}
export function formatBuildJobEvidenceMapResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Build result: ${result.result}`,
        `Requirement source: ${result.requirementSource}`,
        `Evidence map: ${result.mapPath}`,
        `Manifest: ${result.manifestPath}`,
        `Requirements processed: ${result.requirementCount}`,
        `Supported requirements: ${result.supportedRequirementCount}`,
        `Unsupported requirements: ${result.unsupportedRequirementCount}`,
        `Evidence links: ${result.linkCount}`,
    ].join("\n");
}
export function formatJobEvidenceMapStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Requirement model status: ${status.requirementModelStatus ?? "not applicable"}`,
        `Map hash matches: ${check(status.mapHashMatches)}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Job Description hash matches: ${check(status.sourceHashMatches)}`,
        `Requirement model hash matches: ${check(status.requirementModelHashMatches)}`,
        `Requirement manifest hash matches: ${check(status.requirementManifestHashMatches)}`,
        `Sources hash matches: ${check(status.sourcesHashMatches)}`,
        `Evidence items hash matches: ${check(status.evidenceItemsHashMatches)}`,
        `Claims hash matches: ${check(status.claimsHashMatches)}`,
        `Eligible evidence set matches: ${check(status.eligibleEvidenceSetHashMatches)}`,
        `Policy matches: ${check(status.policyMatches)}`,
        `Normalized input matches: ${check(status.normalizedInputHashMatches)}`,
        `Evidence map: ${status.mapPath}`,
        `Manifest: ${status.manifestPath}`,
        ...(status.reasons.length
            ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)]
            : []),
    ].join("\n");
}
function mapRequirements(targetId, requirementInput, requirements, candidates) {
    const links = requirements.flatMap((requirement) => candidates.flatMap((candidate) => {
        const matched = matchRequirement(requirement, candidate);
        if (!matched)
            return [];
        const requirementProvenance = requirementProvenanceFor(requirementInput, requirement);
        const matchedSignals = matched.signals.sort((a, b) => a.type.localeCompare(b.type) || a.value.localeCompare(b.value));
        const id = `job-evidence-link_${hashText(stableJson({
            targetId,
            requirementId: requirement.id,
            evidenceId: candidate.evidence.id,
            claimId: candidate.claim.id,
            relationship: matched.relationship,
            matchedSignals,
            policyVersion: JOB_EVIDENCE_MAPPING_POLICY_VERSION,
        })).slice(0, 14)}`;
        return [{
                id,
                requirementId: requirement.id,
                evidenceId: candidate.evidence.id,
                claimId: candidate.claim.id,
                relationship: matched.relationship,
                evidenceStrength: evidenceStrength(candidate.evidence.confidence),
                linkConfidence: linkConfidence(matched.relationship, candidate.evidence.confidence, candidate.claim.factualConfidence),
                matchedSignals,
                requirementProvenance,
                evidenceProvenance: {
                    evidenceId: candidate.evidence.id,
                    evidenceItemPath: "kb/evidence-items.json",
                    evidenceItemSha256: hashText(stableJson(candidate.evidence)),
                    claimId: candidate.claim.id,
                    claimPath: "kb/claims.json",
                    claimSha256: hashText(stableJson(candidate.claim)),
                    sources: candidate.snapshotEntry.provenance.sources,
                },
            }];
    }));
    links.sort(compareLinks);
    const requirementMappings = requirements.map((requirement) => {
        const requirementLinks = links.filter((link) => link.requirementId === requirement.id);
        return {
            id: `job-requirement-evidence_${hashText(`${targetId}\u0000${requirement.id}\u0000${JOB_EVIDENCE_MAPPING_POLICY_VERSION}`).slice(0, 14)}`,
            requirementId: requirement.id,
            status: requirementLinks.length > 0 ? "supported" : "unsupported",
            linkIds: requirementLinks.map((link) => link.id),
            requirementProvenance: requirementProvenanceFor(requirementInput, requirement),
        };
    }).sort((a, b) => a.requirementId.localeCompare(b.requirementId));
    const unsupported = requirementMappings.filter((entry) => entry.status === "unsupported");
    const warnings = [
        ...(candidates.length === 0
            ? [{
                    id: `job-evidence-warning_${hashText(`${targetId}\u0000no-evidence`).slice(0, 12)}`,
                    code: "NO_ELIGIBLE_EVIDENCE",
                    message: "No approved, resume-ready, public-safe candidate evidence is eligible for deterministic matching.",
                }]
            : []),
        ...unsupported.map((entry) => ({
            id: `job-evidence-warning_${hashText(`${entry.requirementId}\u0000unsupported`).slice(0, 12)}`,
            code: "REQUIREMENT_UNSUPPORTED",
            message: "No explicit deterministic link to eligible reviewed evidence was found.",
            requirementId: entry.requirementId,
        })),
    ].sort((a, b) => a.id.localeCompare(b.id));
    return {
        links,
        requirementMappings,
        warnings,
        completeness: {
            status: requirements.length === 0 ? "empty" : "complete",
            requirementCount: requirements.length,
            processedRequirementCount: requirementMappings.length,
            supportedRequirementCount: requirementMappings.length - unsupported.length,
            unsupportedRequirementCount: unsupported.length,
            linkCount: links.length,
            readyForDownstreamAssessment: requirements.length > 0,
            blockingReasons: requirements.length === 0
                ? ["The usable Job Requirement Model contains no requirements."]
                : [],
        },
    };
}
function matchRequirement(requirement, candidate) {
    const requirementText = normalizeText(`${requirement.normalizedLabel} ${requirement.sourceText}`);
    const claimText = normalizeText(`${candidate.claim.approvedWording ?? candidate.claim.claim} ${candidate.evidence.normalizedSummary}`);
    const requirementTechnologies = uniqueNormalized(requirement.namedTechnologies);
    const candidateTechnologies = uniqueNormalized([
        ...(candidate.evidence.technologies ?? []),
        ...requirement.namedTechnologies.filter((technology) => containsTerm(claimText, technology)),
    ]);
    const matchedTechnologies = requirementTechnologies.filter((technology) => candidateTechnologies.includes(technology));
    const requirementDomains = uniqueNormalized((candidate.evidence.domains ?? []).filter((domain) => containsTerm(requirementText, domain)));
    const candidateDomains = uniqueNormalized(candidate.evidence.domains ?? []);
    const matchedDomains = requirementDomains.filter((domain) => candidateDomains.includes(domain));
    const requirementKeywords = uniqueNormalized(requirement.keywords);
    const matchedKeywords = requirementKeywords.filter((keyword) => containsTerm(claimText, keyword));
    const exactPhrase = normalizeText(requirement.normalizedLabel);
    const hasExactPhrase = exactPhrase.length >= 12 && containsPhrase(claimText, exactPhrase);
    const signals = [
        ...(hasExactPhrase
            ? [{ type: "exact-phrase", value: requirement.normalizedLabel }]
            : []),
        ...matchedTechnologies.map((value) => ({ type: "technology", value })),
        ...matchedDomains.map((value) => ({ type: "domain", value })),
        ...matchedKeywords.map((value) => ({ type: "keyword", value })),
    ];
    const deduplicatedSignals = [...new Map(signals.map((signal) => [`${signal.type}\u0000${signal.value}`, signal])).values()];
    if (deduplicatedSignals.length === 0)
        return undefined;
    if (hasExactPhrase) {
        return { relationship: "direct", signals: deduplicatedSignals };
    }
    if (requirementTechnologies.length > 0) {
        if (matchedTechnologies.length === requirementTechnologies.length) {
            return { relationship: "direct", signals: deduplicatedSignals };
        }
        if (matchedTechnologies.length > 0) {
            return { relationship: "partial", signals: deduplicatedSignals };
        }
        return { relationship: "supporting", signals: deduplicatedSignals };
    }
    if (requirement.category === "domain-expectation" &&
        requirementDomains.length > 0) {
        return {
            relationship: matchedDomains.length === requirementDomains.length ? "direct" : "partial",
            signals: deduplicatedSignals,
        };
    }
    if (requirementKeywords.length > 1 &&
        matchedKeywords.length < requirementKeywords.length) {
        return { relationship: "partial", signals: deduplicatedSignals };
    }
    return { relationship: "supporting", signals: deduplicatedSignals };
}
function compareLinks(a, b) {
    return (strengthRank(b.evidenceStrength) - strengthRank(a.evidenceStrength) ||
        confidenceRank(b.linkConfidence) - confidenceRank(a.linkConfidence) ||
        a.requirementId.localeCompare(b.requirementId) ||
        a.evidenceId.localeCompare(b.evidenceId) ||
        a.claimId.localeCompare(b.claimId) ||
        a.id.localeCompare(b.id));
}
function evidenceStrength(confidence) {
    return confidence === "high" ? "strong" : confidence === "medium" ? "medium" : "weak";
}
function linkConfidence(relationship, evidenceConfidence, claimConfidence) {
    const base = Math.min(confidenceRank(evidenceConfidence), confidenceRank(claimConfidence));
    const relationshipCap = relationship === "direct" ? 3 : relationship === "supporting" ? 2 : 2;
    const value = Math.min(base, relationshipCap);
    return value >= 3 ? "high" : value === 2 ? "medium" : "low";
}
async function loadEligibleCandidates(workspace) {
    const snapshot = await calculateEvidenceSnapshot(workspace);
    const evidenceItems = (await readJson(resolveWithin(workspace, "kb/evidence-items.json"), [])).map((entry) => EvidenceItemSchema.parse(entry));
    const claims = (await readJson(resolveWithin(workspace, "kb/claims.json"), [])).map((entry) => ClaimSchema.parse(entry));
    const evidenceById = new Map(evidenceItems.map((entry) => [entry.id, entry]));
    const claimById = new Map(claims.map((entry) => [entry.id, entry]));
    const candidates = [];
    for (const snapshotEntry of snapshot.entries) {
        const evidence = evidenceById.get(snapshotEntry.evidenceId);
        if (!evidence) {
            throw new Error(`Eligible evidence item is missing: ${snapshotEntry.evidenceId}`);
        }
        for (const claimId of snapshotEntry.supportingClaimIds) {
            const claim = claimById.get(claimId);
            if (!claim || !claim.supportingEvidenceIds.includes(evidence.id)) {
                throw new Error(`Eligible claim provenance is invalid: ${claimId}/${evidence.id}`);
            }
            candidates.push({ evidence, claim, snapshotEntry });
        }
    }
    return candidates.sort((a, b) => a.evidence.id.localeCompare(b.evidence.id) ||
        a.claim.id.localeCompare(b.claim.id));
}
async function mappingInput(workspace, target, requirementInput, _candidates) {
    const snapshot = await calculateEvidenceSnapshot(workspace);
    const targetSha256 = await hashFile(resolveWithin(workspace, `targets/jobs/${target.id}/target.json`));
    const sourceSha256 = await hashFile(resolveWithin(workspace, `targets/jobs/${target.id}/job-description.md`));
    const normalizedInputSha256 = hashText(stableJson({
        targetId: target.id,
        targetSha256,
        sourceSha256,
        requirementModelType: requirementInput.type,
        requirementModelSha256: requirementInput.modelSha256,
        requirementManifestSha256: requirementInput.manifestSha256,
        sourcesSha256: snapshot.sourcesSha256,
        evidenceItemsSha256: snapshot.evidenceItemsSha256,
        claimsSha256: snapshot.claimsSha256,
        eligibleEvidenceSetSha256: snapshot.eligibleEvidenceSetSha256,
        mapperName: JOB_EVIDENCE_MAPPER_NAME,
        mapperVersion: JOB_EVIDENCE_MAPPER_VERSION,
        policyName: JOB_EVIDENCE_MAPPING_POLICY_NAME,
        policyVersion: JOB_EVIDENCE_MAPPING_POLICY_VERSION,
    }));
    return {
        targetSha256,
        sourceSha256,
        sourcesSha256: snapshot.sourcesSha256,
        evidenceItemsSha256: snapshot.evidenceItemsSha256,
        claimsSha256: snapshot.claimsSha256,
        eligibleEvidenceSetSha256: snapshot.eligibleEvidenceSetSha256,
        normalizedInputSha256,
    };
}
async function loadRequirementInput(workspace, targetId, type) {
    if (type === "deterministic") {
        const status = await getJobRequirementModelStatus(workspace, targetId);
        if (status.status !== "current") {
            throw new Error(`Deterministic Job Requirement Model must be current. Current status: ${status.status}.`);
        }
        const paths = jobRequirementPaths(workspace, targetId);
        const model = await showJobRequirementModel(workspace, targetId);
        assertUsableRequirementModel(model);
        return {
            type,
            model,
            modelPath: paths.modelRelativePath,
            modelSha256: await hashFile(paths.modelPath),
            manifestPath: paths.manifestRelativePath,
            manifestSha256: await hashFile(paths.manifestPath),
            targetSha256: await hashFile(paths.targetPath),
            sourceSha256: await hashFile(paths.sourcePath),
        };
    }
    const status = await getApprovedJobRequirementsStatus(workspace, targetId);
    if (status.status !== "current") {
        throw new Error(`Approved Job Requirement Model must be current. Current status: ${status.status}.`);
    }
    const paths = approvedJobRequirementPaths(workspace, targetId);
    const model = await showApprovedJobRequirements(workspace, targetId);
    assertUsableRequirementModel(model);
    const manifest = ApprovedJobRequirementManifestSchema.parse(await readJson(paths.manifestPath, null));
    return {
        type,
        model,
        modelPath: paths.approvedModelRelativePath,
        modelSha256: manifest.approvedModelSha256,
        manifestPath: paths.manifestRelativePath,
        manifestSha256: await hashFile(paths.manifestPath),
        targetSha256: manifest.targetSha256,
        sourceSha256: manifest.sourceSha256,
    };
}
function assertUsableRequirementModel(model) {
    const criticalRisks = model.risks.filter((risk) => risk.severity === "high");
    if (model.completeness.status !== "complete" ||
        model.requirements.length === 0 ||
        criticalRisks.length > 0 ||
        model.contradictions.length > 0) {
        throw new Error("Job Requirement Model is not usable for deterministic evidence mapping: it must be complete, non-empty, and free of unresolved critical ambiguity or contradiction.");
    }
}
function requirementProvenanceFor(input, requirement) {
    return {
        requirementModelType: input.type,
        requirementModelPath: input.modelPath,
        requirementModelSha256: input.modelSha256,
        requirementId: requirement.id,
        sourceTextSha256: hashText(requirement.sourceText),
        sourceReferences: requirement.provenance.sourceReferences,
    };
}
function validateStoredMapIdentity(map, manifest, paths) {
    const reasons = [];
    if (map.id !== manifest.mapId ||
        map.targetId !== manifest.targetId ||
        map.targetType !== "job" ||
        manifest.targetType !== "job" ||
        manifest.mapPath !== paths.mapRelativePath) {
        reasons.push("Job evidence map identity or persistence path is invalid.");
    }
    if (map.input.target.sha256 !== manifest.targetSha256 ||
        map.input.jobDescription.sha256 !== manifest.sourceSha256 ||
        map.input.requirementModelType !== manifest.requirementModelType ||
        map.input.requirementModel.sha256 !== manifest.requirementModelSha256 ||
        map.input.requirementManifest.sha256 !== manifest.requirementManifestSha256 ||
        map.input.sources.sha256 !== manifest.sourcesSha256 ||
        map.input.evidenceItems.sha256 !== manifest.evidenceItemsSha256 ||
        map.input.claims.sha256 !== manifest.claimsSha256 ||
        map.input.eligibleEvidenceSetSha256 !== manifest.eligibleEvidenceSetSha256 ||
        map.input.normalizedInputSha256 !== manifest.normalizedInputSha256) {
        reasons.push("Job evidence map and manifest disagree on dependency hashes.");
    }
    if (new Set(map.links.map((link) => link.id)).size !== map.links.length ||
        new Set(map.requirementMappings.map((entry) => entry.requirementId)).size !==
            map.requirementMappings.length) {
        reasons.push("Job evidence map contains duplicate link or requirement identities.");
    }
    return reasons;
}
function validateMapContents(map, requirementInput, candidates) {
    const reasons = [];
    const requirements = requirementInput.model.requirements;
    const requirementIds = new Set(requirements.map((entry) => entry.id));
    const eligiblePairs = new Set(candidates.map((entry) => `${entry.evidence.id}\u0000${entry.claim.id}`));
    const mappingIds = new Set(map.requirementMappings.map((entry) => entry.requirementId));
    if (mappingIds.size !== requirementIds.size ||
        [...requirementIds].some((id) => !mappingIds.has(id))) {
        reasons.push("Requirement mappings do not exactly cover the current usable model.");
    }
    for (const link of map.links) {
        if (!requirementIds.has(link.requirementId)) {
            reasons.push(`Evidence link references an unknown requirement: ${link.id}`);
        }
        if (!eligiblePairs.has(`${link.evidenceId}\u0000${link.claimId}`)) {
            reasons.push(`Evidence link references ineligible evidence or claim: ${link.id}`);
        }
    }
    for (const mapping of map.requirementMappings) {
        const actual = map.links
            .filter((link) => link.requirementId === mapping.requirementId)
            .map((link) => link.id);
        if (stableJson(actual) !== stableJson(mapping.linkIds)) {
            reasons.push(`Requirement mapping has incomplete link references: ${mapping.id}`);
        }
    }
    const expected = mapRequirements(map.targetId, requirementInput, requirements, candidates);
    if (stableJson({
        links: map.links,
        requirementMappings: map.requirementMappings,
        warnings: map.warnings,
        completeness: map.completeness,
    }) !== stableJson(expected)) {
        reasons.push("Stored map content does not match the deterministic mapping result.");
    }
    return uniqueSorted(reasons);
}
async function requireJobTarget(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job") {
        throw new Error(`Job evidence mapping rejects Role Target: ${targetId}`);
    }
    return target;
}
async function requirementStatus(workspace, targetId, type) {
    try {
        return type === "deterministic"
            ? (await getJobRequirementModelStatus(workspace, targetId)).status
            : (await getApprovedJobRequirementsStatus(workspace, targetId)).status;
    }
    catch {
        return "invalid";
    }
}
function resultFromMap(map, requirementSource, paths, result) {
    return {
        targetId: map.targetId,
        result,
        requirementSource,
        mapPath: paths.mapRelativePath,
        manifestPath: paths.manifestRelativePath,
        requirementCount: map.completeness.requirementCount,
        supportedRequirementCount: map.completeness.supportedRequirementCount,
        unsupportedRequirementCount: map.completeness.unsupportedRequirementCount,
        linkCount: map.completeness.linkCount,
    };
}
function emptyStatus(base, status, reasons) {
    return {
        ...base,
        mapHashMatches: null,
        targetHashMatches: null,
        sourceHashMatches: null,
        requirementModelStatus: null,
        requirementModelHashMatches: null,
        requirementManifestHashMatches: null,
        sourcesHashMatches: null,
        evidenceItemsHashMatches: null,
        claimsHashMatches: null,
        eligibleEvidenceSetHashMatches: null,
        policyMatches: null,
        normalizedInputHashMatches: null,
        status,
        reasons,
    };
}
function normalizeText(value) {
    return value
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/[^a-z0-9+#/.-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function normalizeSignal(value) {
    const normalized = normalizeText(value).replace(/[./-]+/g, " ").replace(/\s+/g, " ").trim();
    const aliases = new Map([
        ["apis", "api"],
        ["application programming interfaces", "api"],
        ["telecommunications", "telecom"],
        ["education technology", "edtech"],
    ]);
    return aliases.get(normalized) ?? normalized;
}
function uniqueNormalized(values) {
    return uniqueSorted(values.map(normalizeSignal).filter(Boolean));
}
function containsTerm(normalizedText, value) {
    const normalizedTerm = normalizeSignal(value);
    const comparableText = ` ${normalizeSignal(normalizedText)} `;
    return normalizedTerm.length > 0 && comparableText.includes(` ${normalizedTerm} `);
}
function containsPhrase(normalizedText, phrase) {
    return normalizeSignal(normalizedText).includes(normalizeSignal(phrase));
}
function confidenceRank(value) {
    return value === "high" ? 3 : value === "medium" ? 2 : 1;
}
function strengthRank(value) {
    return value === "strong" ? 3 : value === "medium" ? 2 : 1;
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const resolved = path.resolve(root, relativePath);
    const relation = path.relative(root, resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Job evidence mapping path escapes the workspace: ${relativePath}`);
    }
    return resolved;
}
async function hashMatches(filePath, expected) {
    return (await pathExists(filePath)) && (await hashFile(filePath)) === expected;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
