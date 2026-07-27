import path from "node:path";
import { approvedJobRequirementPaths, getApprovedJobRequirementsStatus, showApprovedJobRequirements, } from "./approved-job-requirements.js";
import { hashFile, hashText, pathExists, readJson, uniqueSorted, writeJsonAtomic, } from "./fs-utils.js";
import { JobRequirementCoverageManifestSchema, JobRequirementCoverageModelSchema, } from "./job-coverage-schemas.js";
import { JOB_EVIDENCE_MAPPER_NAME, JOB_EVIDENCE_MAPPER_VERSION, JOB_EVIDENCE_MAPPING_POLICY_NAME, JOB_EVIDENCE_MAPPING_POLICY_VERSION, jobEvidenceMapPaths, showJobEvidenceMap, } from "./job-evidence-mapping.js";
import { JobEvidenceMapManifestSchema, } from "./job-evidence-map-schemas.js";
import { getJobRequirementModelStatus, jobRequirementPaths, showJobRequirementModel, } from "./job-requirements.js";
import { ClaimSchema, EvidenceItemSchema, SourceSchema, } from "./schemas.js";
import { showTarget } from "./targets.js";
import { stableJson } from "./target-proposal.js";
export const JOB_COVERAGE_ANALYZER_NAME = "job-requirement-coverage";
export const JOB_COVERAGE_ANALYZER_VERSION = "1";
export const JOB_COVERAGE_POLICY_NAME = "job-requirement-coverage-policy";
export const JOB_COVERAGE_POLICY_VERSION = "1";
const COVERAGE_FILE = "job-requirement-coverage.json";
const MANIFEST_FILE = "job-requirement-coverage-manifest.json";
const LANGUAGE_NAMES = [
    "Arabic",
    "English",
    "French",
    "German",
    "Spanish",
    "Mandarin",
];
export function jobCoveragePaths(workspace, targetId) {
    const rootRelativePath = `targets/jobs/${targetId}/coverage/deterministic`;
    const coverageRelativePath = `${rootRelativePath}/${COVERAGE_FILE}`;
    const manifestRelativePath = `${rootRelativePath}/${MANIFEST_FILE}`;
    return {
        rootRelativePath,
        rootPath: resolveWithin(workspace, rootRelativePath),
        coverageRelativePath,
        coveragePath: resolveWithin(workspace, coverageRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
export async function buildJobCoverage(workspace, targetId, options = {}) {
    const dependencies = await loadCurrentDependencies(workspace, targetId);
    const status = await getJobCoverageStatus(workspace, targetId);
    const paths = jobCoveragePaths(workspace, targetId);
    if (status.status === "current") {
        const current = await showJobCoverage(workspace, targetId);
        return resultFromCoverage(current, paths, "already-current");
    }
    if ((status.status === "stale" || status.status === "invalid") && !options.rebuild) {
        throw new Error(`Stored Job Requirement Coverage is ${status.status} and was not overwritten. Review dependencies, then use --rebuild. ${status.reasons.join(" ")}`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (status.coverageExists) {
        try {
            const previous = await showJobCoverage(workspace, targetId);
            if (previous.targetId === targetId)
                createdAt = previous.createdAt;
        }
        catch {
            // Explicit rebuild may replace an invalid artifact without trusting its contents.
        }
    }
    const analyzed = analyzeCoverage(dependencies);
    const coverage = JobRequirementCoverageModelSchema.parse({
        schemaVersion: 1,
        id: `job-requirement-coverage_${hashText(`${targetId}\u0000${dependencies.normalizedInputSha256}\u0000${JOB_COVERAGE_POLICY_VERSION}`).slice(0, 14)}`,
        targetId,
        targetType: "job",
        analyzer: {
            name: JOB_COVERAGE_ANALYZER_NAME,
            version: JOB_COVERAGE_ANALYZER_VERSION,
            mode: "deterministic",
        },
        policy: {
            name: JOB_COVERAGE_POLICY_NAME,
            version: JOB_COVERAGE_POLICY_VERSION,
        },
        input: {
            target: {
                path: `targets/jobs/${targetId}/target.json`,
                sha256: dependencies.targetSha256,
            },
            jobDescription: {
                path: `targets/jobs/${targetId}/job-description.md`,
                sha256: dependencies.sourceSha256,
            },
            requirementModelType: dependencies.requirementInput.type,
            requirementModel: {
                path: dependencies.requirementInput.modelPath,
                sha256: dependencies.requirementInput.modelSha256,
            },
            requirementManifest: {
                path: dependencies.requirementInput.manifestPath,
                sha256: dependencies.requirementInput.manifestSha256,
            },
            evidenceMap: {
                path: dependencies.evidenceMapPath,
                sha256: dependencies.evidenceMapSha256,
            },
            evidenceMapManifest: {
                path: dependencies.evidenceMapManifestPath,
                sha256: dependencies.evidenceMapManifestSha256,
            },
            normalizedInputSha256: dependencies.normalizedInputSha256,
        },
        ...analyzed,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.coveragePath, coverage);
    const manifest = JobRequirementCoverageManifestSchema.parse({
        schemaVersion: 1,
        coverageId: coverage.id,
        targetId,
        targetType: "job",
        coveragePath: paths.coverageRelativePath,
        coverageSha256: await hashFile(paths.coveragePath),
        analyzerName: JOB_COVERAGE_ANALYZER_NAME,
        analyzerVersion: JOB_COVERAGE_ANALYZER_VERSION,
        policyName: JOB_COVERAGE_POLICY_NAME,
        policyVersion: JOB_COVERAGE_POLICY_VERSION,
        targetSha256: dependencies.targetSha256,
        sourceSha256: dependencies.sourceSha256,
        requirementModelType: dependencies.requirementInput.type,
        requirementModelSha256: dependencies.requirementInput.modelSha256,
        requirementManifestSha256: dependencies.requirementInput.manifestSha256,
        evidenceMapSha256: dependencies.evidenceMapSha256,
        evidenceMapManifestSha256: dependencies.evidenceMapManifestSha256,
        normalizedInputSha256: dependencies.normalizedInputSha256,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return resultFromCoverage(coverage, paths, status.status === "missing" ? "created" : "rebuilt");
}
export async function showJobCoverage(workspace, targetId) {
    await requireJobTarget(workspace, targetId);
    const paths = jobCoveragePaths(workspace, targetId);
    if (!(await pathExists(paths.coveragePath))) {
        throw new Error(`Job Requirement Coverage not found for target: ${targetId}`);
    }
    return JobRequirementCoverageModelSchema.parse(await readJson(paths.coveragePath, null));
}
export async function getJobCoverageStatus(workspace, targetId) {
    await requireJobTarget(workspace, targetId);
    const paths = jobCoveragePaths(workspace, targetId);
    const coverageExists = await pathExists(paths.coveragePath);
    const manifestExists = await pathExists(paths.manifestPath);
    const upstream = await inspectDependencies(workspace, targetId);
    const base = {
        targetId,
        coverageExists,
        manifestExists,
        evidenceMapStatus: upstream.status,
        coveragePath: paths.coverageRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!coverageExists && !manifestExists) {
        return emptyStatus(base, "missing", ["No deterministic Job Requirement Coverage exists."]);
    }
    if (!coverageExists || !manifestExists) {
        return emptyStatus(base, "invalid", [
            "Job Requirement Coverage artifact set is incomplete.",
        ]);
    }
    let coverage;
    let manifest;
    try {
        coverage = JobRequirementCoverageModelSchema.parse(await readJson(paths.coveragePath, null));
        manifest = JobRequirementCoverageManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyStatus(base, "invalid", [
            `Stored Job Requirement Coverage is invalid: ${errorMessage(error)}`,
        ]);
    }
    const coverageHashMatches = (await hashFile(paths.coveragePath)) === manifest.coverageSha256;
    const invalidReasons = validateStoredIdentity(coverage, manifest, paths);
    if (!coverageHashMatches) {
        invalidReasons.push("Job Requirement Coverage SHA-256 does not match its manifest.");
    }
    if (invalidReasons.length > 0) {
        return {
            ...emptyStatus(base, "invalid", uniqueSorted(invalidReasons)),
            coverageHashMatches,
        };
    }
    if (upstream.status !== "current" || !upstream.dependencies) {
        return {
            ...emptyStatus(base, "stale", upstream.reasons),
            coverageHashMatches,
        };
    }
    const dependencies = upstream.dependencies;
    const targetHashMatches = manifest.targetSha256 === dependencies.targetSha256;
    const sourceHashMatches = manifest.sourceSha256 === dependencies.sourceSha256;
    const requirementModelHashMatches = manifest.requirementModelSha256 ===
        dependencies.requirementInput.modelSha256;
    const requirementManifestHashMatches = manifest.requirementManifestSha256 ===
        dependencies.requirementInput.manifestSha256;
    const evidenceMapHashMatches = manifest.evidenceMapSha256 === dependencies.evidenceMapSha256;
    const evidenceMapManifestHashMatches = manifest.evidenceMapManifestSha256 ===
        dependencies.evidenceMapManifestSha256;
    const analyzerMatches = manifest.analyzerName === JOB_COVERAGE_ANALYZER_NAME &&
        manifest.analyzerVersion === JOB_COVERAGE_ANALYZER_VERSION &&
        coverage.analyzer.name === manifest.analyzerName &&
        coverage.analyzer.version === manifest.analyzerVersion;
    const policyMatches = manifest.policyName === JOB_COVERAGE_POLICY_NAME &&
        manifest.policyVersion === JOB_COVERAGE_POLICY_VERSION &&
        coverage.policy.name === manifest.policyName &&
        coverage.policy.version === manifest.policyVersion;
    const normalizedInputHashMatches = manifest.normalizedInputSha256 === dependencies.normalizedInputSha256;
    const staleReasons = [
        ...(!targetHashMatches ? ["Job Target changed."] : []),
        ...(!sourceHashMatches ? ["Persisted Job Description changed."] : []),
        ...(!requirementModelHashMatches ? ["Job Requirement Model changed."] : []),
        ...(!requirementManifestHashMatches
            ? ["Job Requirement Model manifest changed."]
            : []),
        ...(!evidenceMapHashMatches ? ["Job Evidence Map changed."] : []),
        ...(!evidenceMapManifestHashMatches
            ? ["Job Evidence Map manifest changed."]
            : []),
        ...(!analyzerMatches ? ["Job coverage analyzer changed."] : []),
        ...(!policyMatches ? ["Job coverage policy changed."] : []),
        ...(!normalizedInputHashMatches
            ? ["Normalized Job Requirement Coverage input changed."]
            : []),
    ];
    if (staleReasons.length > 0) {
        return {
            ...base,
            coverageHashMatches,
            targetHashMatches,
            sourceHashMatches,
            requirementModelHashMatches,
            requirementManifestHashMatches,
            evidenceMapHashMatches,
            evidenceMapManifestHashMatches,
            analyzerMatches,
            policyMatches,
            normalizedInputHashMatches,
            status: "stale",
            reasons: uniqueSorted(staleReasons),
        };
    }
    const expected = analyzeCoverage(dependencies);
    const semanticMatches = stableJson({
        requirements: coverage.requirements,
        warnings: coverage.warnings,
        completeness: coverage.completeness,
    }) === stableJson(expected);
    if (!semanticMatches) {
        return {
            ...base,
            coverageHashMatches,
            targetHashMatches,
            sourceHashMatches,
            requirementModelHashMatches,
            requirementManifestHashMatches,
            evidenceMapHashMatches,
            evidenceMapManifestHashMatches,
            analyzerMatches,
            policyMatches,
            normalizedInputHashMatches,
            status: "invalid",
            reasons: [
                "Stored coverage content does not match deterministic analysis of the current Job Evidence Map.",
            ],
        };
    }
    return {
        ...base,
        coverageHashMatches,
        targetHashMatches,
        sourceHashMatches,
        requirementModelHashMatches,
        requirementManifestHashMatches,
        evidenceMapHashMatches,
        evidenceMapManifestHashMatches,
        analyzerMatches,
        policyMatches,
        normalizedInputHashMatches,
        status: "current",
        reasons: [],
    };
}
export function classifyJobRequirementCoverage(input) {
    const evidenceQuality = summarizeEvidenceQuality(input.links);
    if (input.links.some((link) => link.relationship === "contradiction" &&
        link.contradictionApproved === true)) {
        return { state: "contradicted", evidenceQuality };
    }
    if (input.links.some((link) => link.relationship === "contradiction")) {
        return { state: "indeterminate", evidenceQuality };
    }
    if (input.hasUnresolvedAmbiguity || input.necessity === "ambiguous") {
        return { state: "indeterminate", evidenceQuality };
    }
    if (input.links.length === 0) {
        return { state: "unsupported", evidenceQuality: "unavailable" };
    }
    const components = input.components ?? [];
    if (components.length > 1) {
        const supportedComponents = components.filter((component) => component.status === "supported").length;
        if (supportedComponents > 0 && supportedComponents < components.length) {
            return { state: "partially-supported", evidenceQuality };
        }
        if (supportedComponents === 0) {
            return { state: "indeterminate", evidenceQuality };
        }
    }
    const sufficientDirect = input.links.some((link) => link.relationship === "direct" &&
        link.evidenceStrength !== "weak" &&
        link.linkConfidence !== "low");
    if (sufficientDirect)
        return { state: "supported", evidenceQuality };
    if (input.links.every((link) => link.relationship === "partial" || link.relationship === "supporting")) {
        return { state: "partially-supported", evidenceQuality };
    }
    return { state: "indeterminate", evidenceQuality };
}
export function formatBuildJobCoverageResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Build result: ${result.result}`,
        `Coverage: ${result.coveragePath}`,
        `Manifest: ${result.manifestPath}`,
        `Requirements processed: ${result.requirementCount}`,
        `Ready for downstream assessment: ${result.readyForDownstreamAssessment ? "yes" : "no"}`,
    ].join("\n");
}
export function formatJobCoverageStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Job Evidence Map status: ${status.evidenceMapStatus}`,
        `Coverage hash matches: ${check(status.coverageHashMatches)}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Job Description hash matches: ${check(status.sourceHashMatches)}`,
        `Requirement model hash matches: ${check(status.requirementModelHashMatches)}`,
        `Requirement manifest hash matches: ${check(status.requirementManifestHashMatches)}`,
        `Evidence map hash matches: ${check(status.evidenceMapHashMatches)}`,
        `Evidence map manifest hash matches: ${check(status.evidenceMapManifestHashMatches)}`,
        `Analyzer matches: ${check(status.analyzerMatches)}`,
        `Policy matches: ${check(status.policyMatches)}`,
        `Normalized input matches: ${check(status.normalizedInputHashMatches)}`,
        `Coverage: ${status.coveragePath}`,
        `Manifest: ${status.manifestPath}`,
        ...(status.reasons.length
            ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)]
            : []),
    ].join("\n");
}
function analyzeCoverage(dependencies) {
    const model = dependencies.requirementInput.model;
    const map = dependencies.evidenceMap;
    const linksById = new Map(map.links.map((link) => [link.id, link]));
    const mappingByRequirement = new Map(map.requirementMappings.map((mapping) => [mapping.requirementId, mapping]));
    const requirements = model.requirements.map((requirement) => {
        const mapping = mappingByRequirement.get(requirement.id);
        if (!mapping) {
            throw new Error(`Current Job Evidence Map is missing requirement mapping: ${requirement.id}`);
        }
        const links = mapping.linkIds.map((linkId) => {
            const link = linksById.get(linkId);
            if (!link) {
                throw new Error(`Current Job Evidence Map is missing link: ${linkId}`);
            }
            return link;
        });
        return coverageForRequirement(dependencies, requirement, mapping, links);
    }).sort((left, right) => left.requirementId.localeCompare(right.requirementId));
    return {
        requirements,
        warnings: [],
        completeness: {
            status: requirements.length === 0 ? "empty" : "complete",
            requirementCount: model.requirements.length,
            processedRequirementCount: requirements.length,
            readyForDownstreamAssessment: requirements.length > 0,
            blockingReasons: requirements.length === 0
                ? ["The current Job Evidence Map contains no requirements to assess."]
                : [],
        },
    };
}
function coverageForRequirement(dependencies, requirement, mapping, links) {
    const ambiguities = dependencies.requirementInput.model.ambiguities
        .filter((ambiguity) => ambiguity.requirementIds.includes(requirement.id))
        .map((ambiguity) => ambiguity.message)
        .sort((left, right) => left.localeCompare(right));
    const components = identifyComponents(requirement, links);
    const decision = classifyJobRequirementCoverage({
        necessity: requirement.necessity,
        hasUnresolvedAmbiguity: ambiguities.length > 0,
        links,
        components,
    });
    const counts = {
        direct: links.filter((link) => link.relationship === "direct").length,
        supporting: links.filter((link) => link.relationship === "supporting").length,
        partial: links.filter((link) => link.relationship === "partial").length,
        contradiction: 0,
    };
    const warnings = requirementWarnings(decision.state, decision.evidenceQuality, components);
    const linkReferences = links.map((link) => ({
        linkId: link.id,
        linkSha256: hashText(stableJson(link)),
        evidenceId: link.evidenceId,
        claimId: link.claimId,
        relationship: link.relationship,
        evidenceStrength: link.evidenceStrength,
        linkConfidence: link.linkConfidence,
    })).sort((left, right) => left.linkId.localeCompare(right.linkId));
    return JobRequirementCoverageModelSchema.shape.requirements.element.parse({
        id: `job-requirement-coverage-entry_${hashText(`${dependencies.target.id}\u0000${requirement.id}\u0000${JOB_COVERAGE_POLICY_VERSION}`).slice(0, 14)}`,
        requirementId: requirement.id,
        category: requirement.category,
        necessity: requirement.necessity,
        normalizedLabel: requirement.normalizedLabel,
        state: decision.state,
        mappedLinkIds: links.map((link) => link.id).sort((a, b) => a.localeCompare(b)),
        linkCounts: counts,
        evidenceQuality: decision.evidenceQuality,
        components,
        requirementProvenance: mapping.requirementProvenance,
        evidenceMapProvenance: {
            evidenceMapPath: dependencies.evidenceMapPath,
            evidenceMapSha256: dependencies.evidenceMapSha256,
            requirementMappingId: mapping.id,
            requirementMappingSha256: hashText(stableJson(mapping)),
            links: linkReferences,
        },
        openQuestions: [],
        ambiguities,
        warnings,
    });
}
function identifyComponents(requirement, links) {
    const labels = requirement.namedTechnologies.length > 1
        ? requirement.namedTechnologies
        : requirement.category === "language"
            ? LANGUAGE_NAMES.filter((language) => new RegExp(`\\b${language}\\b`, "i").test(requirement.sourceText))
            : [];
    if (labels.length < 2)
        return [];
    return uniqueSorted(labels).map((label) => {
        const normalizedLabel = normalizeSignal(label);
        const mappedLinkIds = links
            .filter((link) => link.matchedSignals.some((signal) => normalizeSignal(signal.value) === normalizedLabel))
            .map((link) => link.id)
            .sort((left, right) => left.localeCompare(right));
        return {
            id: `job-coverage-component_${hashText(`${requirement.id}\u0000${normalizedLabel}`).slice(0, 12)}`,
            label,
            normalizedLabel,
            status: mappedLinkIds.length > 0 ? "supported" : "unsupported",
            mappedLinkIds,
        };
    });
}
function requirementWarnings(state, quality, components) {
    const missingComponents = components
        .filter((component) => component.status !== "supported")
        .map((component) => component.label);
    return uniqueSorted([
        ...(state === "unsupported"
            ? ["No explicit evidence link is present in the current Job Evidence Map."]
            : []),
        ...(state === "partially-supported"
            ? ["Mapped evidence supports only part of the requirement or is not direct."]
            : []),
        ...(state === "contradicted"
            ? ["An explicit approved contradiction is present in the Job Evidence Map."]
            : []),
        ...(state === "indeterminate"
            ? ["Coverage cannot be resolved from the current requirement and evidence-map detail."]
            : []),
        ...(missingComponents.length > 0
            ? [`No mapped support is present for explicit component(s): ${missingComponents.join(", ")}.`]
            : []),
        ...(quality === "limited"
            ? ["Mapped evidence quality is limited; multiple weak links are not upgraded to direct support."]
            : []),
    ]);
}
function summarizeEvidenceQuality(links) {
    if (links.length === 0)
        return "unavailable";
    if (links.some((link) => link.relationship === "contradiction" &&
        link.contradictionApproved === true)) {
        return "mixed";
    }
    const hasLimited = links.some((link) => link.evidenceStrength === "weak" || link.linkConfidence === "low");
    const hasReviewed = links.some((link) => link.evidenceStrength !== "weak" && link.linkConfidence !== "low");
    if (hasLimited && hasReviewed)
        return "mixed";
    if (hasLimited)
        return "limited";
    const relationshipKinds = new Set(links.map((link) => link.relationship));
    if (relationshipKinds.size > 1)
        return "mixed";
    if (links.every((link) => link.relationship === "direct" &&
        link.evidenceStrength === "strong" &&
        link.linkConfidence === "high")) {
        return "strong";
    }
    return "adequate";
}
async function inspectDependencies(workspace, targetId) {
    const target = await requireJobTarget(workspace, targetId);
    const mapPaths = jobEvidenceMapPaths(workspace, targetId);
    const mapExists = await pathExists(mapPaths.mapPath);
    const manifestExists = await pathExists(mapPaths.manifestPath);
    if (!mapExists && !manifestExists) {
        return {
            status: "missing",
            reasons: ["A current Job Evidence Map is required."],
        };
    }
    if (!mapExists || !manifestExists) {
        return {
            status: "invalid",
            reasons: ["Job Evidence Map artifact set is incomplete."],
        };
    }
    let evidenceMap;
    let evidenceMapManifest;
    try {
        evidenceMap = await showJobEvidenceMap(workspace, targetId);
        evidenceMapManifest = JobEvidenceMapManifestSchema.parse(await readJson(mapPaths.manifestPath, null));
    }
    catch (error) {
        return {
            status: "invalid",
            reasons: [`Job Evidence Map is invalid: ${errorMessage(error)}`],
        };
    }
    const evidenceMapSha256 = await hashFile(mapPaths.mapPath);
    const evidenceMapManifestSha256 = await hashFile(mapPaths.manifestPath);
    const invalidReasons = validateMapIdentity(evidenceMap, evidenceMapManifest, mapPaths.mapRelativePath, evidenceMapSha256);
    if (invalidReasons.length > 0) {
        return { status: "invalid", reasons: uniqueSorted(invalidReasons) };
    }
    let requirementInput;
    try {
        requirementInput = await loadRequirementInput(workspace, targetId, evidenceMap.input.requirementModelType);
    }
    catch (error) {
        return {
            status: "stale",
            reasons: [`Job Requirement Model is not current: ${errorMessage(error)}`],
        };
    }
    const targetSha256 = await hashFile(resolveWithin(workspace, `targets/jobs/${targetId}/target.json`));
    const sourceSha256 = await hashFile(resolveWithin(workspace, `targets/jobs/${targetId}/job-description.md`));
    const dependencyChecks = await mapDependencyChecks(workspace, evidenceMap, evidenceMapManifest, requirementInput, targetSha256, sourceSha256);
    if (dependencyChecks.reasons.length > 0) {
        return { status: "stale", reasons: dependencyChecks.reasons };
    }
    const semanticIssues = validateMapContentsWithoutRematching(evidenceMap, requirementInput);
    const provenanceIssues = await validateReferencedEvidenceProvenance(workspace, evidenceMap);
    const invalidContentReasons = uniqueSorted([
        ...semanticIssues,
        ...provenanceIssues,
    ]);
    if (invalidContentReasons.length > 0) {
        return { status: "invalid", reasons: invalidContentReasons };
    }
    const normalizedInputSha256 = coverageInputHash({
        targetId,
        targetSha256,
        sourceSha256,
        requirementModelType: requirementInput.type,
        requirementModelSha256: requirementInput.modelSha256,
        requirementManifestSha256: requirementInput.manifestSha256,
        evidenceMapSha256,
        evidenceMapManifestSha256,
    });
    return {
        status: "current",
        reasons: [],
        dependencies: {
            target,
            targetSha256,
            sourceSha256,
            requirementInput,
            evidenceMap,
            evidenceMapPath: mapPaths.mapRelativePath,
            evidenceMapSha256,
            evidenceMapManifestPath: mapPaths.manifestRelativePath,
            evidenceMapManifestSha256,
            normalizedInputSha256,
        },
    };
}
async function loadCurrentDependencies(workspace, targetId) {
    const inspected = await inspectDependencies(workspace, targetId);
    if (inspected.status !== "current" || !inspected.dependencies) {
        throw new Error(`Job Requirement Coverage requires a current Job Evidence Map and Job Requirement Model. Current status: ${inspected.status}. ${inspected.reasons.join(" ")}`);
    }
    return inspected.dependencies;
}
async function loadRequirementInput(workspace, targetId, type) {
    if (type === "deterministic") {
        const status = await getJobRequirementModelStatus(workspace, targetId);
        if (status.status !== "current") {
            throw new Error(`Deterministic Job Requirement Model status is ${status.status}.`);
        }
        const paths = jobRequirementPaths(workspace, targetId);
        const model = await showJobRequirementModel(workspace, targetId);
        return {
            type,
            model,
            modelPath: paths.modelRelativePath,
            modelSha256: await hashFile(paths.modelPath),
            manifestPath: paths.manifestRelativePath,
            manifestSha256: await hashFile(paths.manifestPath),
        };
    }
    const status = await getApprovedJobRequirementsStatus(workspace, targetId);
    if (status.status !== "current") {
        throw new Error(`Approved Job Requirement Model status is ${status.status}.`);
    }
    const paths = approvedJobRequirementPaths(workspace, targetId);
    return {
        type,
        model: await showApprovedJobRequirements(workspace, targetId),
        modelPath: paths.approvedModelRelativePath,
        modelSha256: await hashFile(paths.approvedModelPath),
        manifestPath: paths.manifestRelativePath,
        manifestSha256: await hashFile(paths.manifestPath),
    };
}
function validateMapIdentity(map, manifest, expectedPath, actualMapSha256) {
    const reasons = [];
    if (map.id !== manifest.mapId ||
        map.targetId !== manifest.targetId ||
        map.targetType !== "job" ||
        manifest.targetType !== "job" ||
        manifest.mapPath !== expectedPath) {
        reasons.push("Job Evidence Map identity or persistence path is invalid.");
    }
    if (actualMapSha256 !== manifest.mapSha256) {
        reasons.push("Job Evidence Map SHA-256 does not match its manifest.");
    }
    if (map.input.target.sha256 !== manifest.targetSha256 ||
        map.input.jobDescription.sha256 !== manifest.sourceSha256 ||
        map.input.requirementModelType !== manifest.requirementModelType ||
        map.input.requirementModel.sha256 !== manifest.requirementModelSha256 ||
        map.input.requirementManifest.sha256 !==
            manifest.requirementManifestSha256 ||
        map.input.sources.sha256 !== manifest.sourcesSha256 ||
        map.input.evidenceItems.sha256 !== manifest.evidenceItemsSha256 ||
        map.input.claims.sha256 !== manifest.claimsSha256 ||
        map.input.eligibleEvidenceSetSha256 !==
            manifest.eligibleEvidenceSetSha256 ||
        map.input.normalizedInputSha256 !== manifest.normalizedInputSha256) {
        reasons.push("Job Evidence Map and manifest disagree on dependency hashes.");
    }
    return reasons;
}
async function mapDependencyChecks(workspace, map, manifest, requirementInput, targetSha256, sourceSha256) {
    const hashes = await Promise.all([
        safeHash(resolveWithin(workspace, "kb/sources.json")),
        safeHash(resolveWithin(workspace, "kb/evidence-items.json")),
        safeHash(resolveWithin(workspace, "kb/claims.json")),
    ]);
    const policyMatches = map.policy.name === JOB_EVIDENCE_MAPPING_POLICY_NAME &&
        map.policy.version === JOB_EVIDENCE_MAPPING_POLICY_VERSION &&
        manifest.mapperName === JOB_EVIDENCE_MAPPER_NAME &&
        manifest.mapperVersion === JOB_EVIDENCE_MAPPER_VERSION &&
        manifest.policyName === JOB_EVIDENCE_MAPPING_POLICY_NAME &&
        manifest.policyVersion === JOB_EVIDENCE_MAPPING_POLICY_VERSION;
    return {
        reasons: uniqueSorted([
            ...(targetSha256 !== manifest.targetSha256 ? ["Job Target changed."] : []),
            ...(sourceSha256 !== manifest.sourceSha256
                ? ["Persisted Job Description changed."]
                : []),
            ...(requirementInput.type !== manifest.requirementModelType
                ? ["Selected Job Requirement Model type changed."]
                : []),
            ...(requirementInput.modelSha256 !== manifest.requirementModelSha256
                ? ["Job Requirement Model changed."]
                : []),
            ...(requirementInput.manifestSha256 !==
                manifest.requirementManifestSha256
                ? ["Job Requirement Model manifest changed."]
                : []),
            ...(hashes[0] !== manifest.sourcesSha256
                ? ["Source registry changed or is missing."]
                : []),
            ...(hashes[1] !== manifest.evidenceItemsSha256
                ? ["Reviewed evidence items changed or are missing."]
                : []),
            ...(hashes[2] !== manifest.claimsSha256
                ? ["Reviewed claims changed or are missing."]
                : []),
            ...(!policyMatches
                ? ["Job Evidence Mapping policy or mapper changed."]
                : []),
        ]),
    };
}
function validateMapContentsWithoutRematching(map, input) {
    const reasons = [];
    const requirementsById = new Map(input.model.requirements.map((requirement) => [requirement.id, requirement]));
    const mappingsByRequirement = new Map(map.requirementMappings.map((mapping) => [mapping.requirementId, mapping]));
    const linksById = new Map(map.links.map((link) => [link.id, link]));
    if (mappingsByRequirement.size !== requirementsById.size ||
        [...requirementsById.keys()].some((id) => !mappingsByRequirement.has(id))) {
        reasons.push("Job Evidence Map does not cover every current requirement exactly once.");
    }
    if (linksById.size !== map.links.length ||
        mappingsByRequirement.size !== map.requirementMappings.length) {
        reasons.push("Job Evidence Map contains duplicate link or requirement identities.");
    }
    for (const [requirementId, mapping] of mappingsByRequirement) {
        const requirement = requirementsById.get(requirementId);
        if (!requirement)
            continue;
        const expectedProvenance = {
            requirementModelType: input.type,
            requirementModelPath: input.modelPath,
            requirementModelSha256: input.modelSha256,
            requirementId,
            sourceTextSha256: hashText(requirement.sourceText),
            sourceReferences: requirement.provenance.sourceReferences,
        };
        if (stableJson(mapping.requirementProvenance) !== stableJson(expectedProvenance)) {
            reasons.push(`Requirement provenance is invalid: ${mapping.id}`);
        }
        const actualLinkIds = map.links
            .filter((link) => link.requirementId === requirementId)
            .map((link) => link.id);
        if (stableJson(actualLinkIds) !== stableJson(mapping.linkIds)) {
            reasons.push(`Requirement mapping has incomplete link references: ${mapping.id}`);
        }
    }
    for (const link of map.links) {
        const requirement = requirementsById.get(link.requirementId);
        const mapping = mappingsByRequirement.get(link.requirementId);
        if (!requirement || !mapping || !mapping.linkIds.includes(link.id)) {
            reasons.push(`Evidence link has broken requirement provenance: ${link.id}`);
            continue;
        }
        if (stableJson(link.requirementProvenance) !==
            stableJson(mapping.requirementProvenance) ||
            link.evidenceProvenance.evidenceId !== link.evidenceId ||
            link.evidenceProvenance.claimId !== link.claimId) {
            reasons.push(`Evidence link provenance is invalid: ${link.id}`);
        }
    }
    if (map.completeness.requirementCount !== input.model.requirements.length ||
        map.completeness.processedRequirementCount !== map.requirementMappings.length ||
        !map.completeness.readyForDownstreamAssessment) {
        reasons.push("Job Evidence Map is not complete for downstream coverage analysis.");
    }
    return uniqueSorted(reasons);
}
async function validateReferencedEvidenceProvenance(workspace, map) {
    let sources;
    let evidenceItems;
    let claims;
    try {
        sources = (await readJson(resolveWithin(workspace, "kb/sources.json"), [])).map((entry) => SourceSchema.parse(entry));
        evidenceItems = (await readJson(resolveWithin(workspace, "kb/evidence-items.json"), [])).map((entry) => EvidenceItemSchema.parse(entry));
        claims = (await readJson(resolveWithin(workspace, "kb/claims.json"), [])).map((entry) => ClaimSchema.parse(entry));
    }
    catch (error) {
        return [`Referenced evidence provenance cannot be validated: ${errorMessage(error)}`];
    }
    const sourceById = new Map(sources.map((source) => [source.id, source]));
    const evidenceById = new Map(evidenceItems.map((evidence) => [evidence.id, evidence]));
    const claimById = new Map(claims.map((claim) => [claim.id, claim]));
    const reasons = [];
    for (const link of map.links) {
        const evidence = evidenceById.get(link.evidenceId);
        const claim = claimById.get(link.claimId);
        if (!evidence) {
            reasons.push(`Evidence link references missing evidence: ${link.id}`);
            continue;
        }
        if (!claim) {
            reasons.push(`Evidence link references missing claim: ${link.id}`);
            continue;
        }
        if (hashText(stableJson(evidence)) !==
            link.evidenceProvenance.evidenceItemSha256 ||
            hashText(stableJson(claim)) !== link.evidenceProvenance.claimSha256 ||
            !claim.supportingEvidenceIds.includes(evidence.id)) {
            reasons.push(`Evidence link artifact provenance is invalid: ${link.id}`);
        }
        const expectedSources = evidence.sourceIds.flatMap((sourceId) => {
            const source = sourceById.get(sourceId);
            if (!source)
                return [];
            return [{
                    sourceId: source.id,
                    sourceType: source.type,
                    path: source.path,
                    sha256: source.hash,
                    status: source.status,
                    visibility: source.visibility,
                }];
        }).sort((left, right) => left.sourceId.localeCompare(right.sourceId));
        if (expectedSources.length !== evidence.sourceIds.length ||
            stableJson(expectedSources) !==
                stableJson(link.evidenceProvenance.sources)) {
            reasons.push(`Evidence link source provenance is invalid: ${link.id}`);
        }
        if (evidence.visibility !== "public" ||
            evidence.sensitivityFlags.length > 0 ||
            expectedSources.some((source) => source.status !== "active" ||
                source.visibility !== "public" ||
                source.sourceType === "job_description") ||
            claim.approvalStatus !== "approved" ||
            claim.outputReadiness !== "resume_ready" ||
            !claim.publicSafe ||
            claim.needsConfirmation) {
            reasons.push(`Evidence link no longer references eligible reviewed evidence: ${link.id}`);
        }
    }
    return uniqueSorted(reasons);
}
function coverageInputHash(input) {
    return hashText(stableJson({
        ...input,
        analyzerName: JOB_COVERAGE_ANALYZER_NAME,
        analyzerVersion: JOB_COVERAGE_ANALYZER_VERSION,
        policyName: JOB_COVERAGE_POLICY_NAME,
        policyVersion: JOB_COVERAGE_POLICY_VERSION,
    }));
}
function validateStoredIdentity(coverage, manifest, paths) {
    const reasons = [];
    if (coverage.id !== manifest.coverageId ||
        coverage.targetId !== manifest.targetId ||
        coverage.targetType !== "job" ||
        manifest.targetType !== "job" ||
        manifest.coveragePath !== paths.coverageRelativePath) {
        reasons.push("Job Requirement Coverage identity or persistence path is invalid.");
    }
    if (coverage.input.target.sha256 !== manifest.targetSha256 ||
        coverage.input.jobDescription.sha256 !== manifest.sourceSha256 ||
        coverage.input.requirementModelType !== manifest.requirementModelType ||
        coverage.input.requirementModel.sha256 !== manifest.requirementModelSha256 ||
        coverage.input.requirementManifest.sha256 !==
            manifest.requirementManifestSha256 ||
        coverage.input.evidenceMap.sha256 !== manifest.evidenceMapSha256 ||
        coverage.input.evidenceMapManifest.sha256 !==
            manifest.evidenceMapManifestSha256 ||
        coverage.input.normalizedInputSha256 !== manifest.normalizedInputSha256) {
        reasons.push("Job Requirement Coverage and manifest disagree on dependency hashes.");
    }
    if (new Set(coverage.requirements.map((entry) => entry.requirementId)).size !==
        coverage.requirements.length) {
        reasons.push("Job Requirement Coverage contains duplicate requirement identities.");
    }
    return reasons;
}
function resultFromCoverage(coverage, paths, result) {
    return {
        targetId: coverage.targetId,
        result,
        coveragePath: paths.coverageRelativePath,
        manifestPath: paths.manifestRelativePath,
        requirementCount: coverage.completeness.requirementCount,
        readyForDownstreamAssessment: coverage.completeness.readyForDownstreamAssessment,
    };
}
function emptyStatus(base, status, reasons) {
    return {
        ...base,
        coverageHashMatches: null,
        targetHashMatches: null,
        sourceHashMatches: null,
        requirementModelHashMatches: null,
        requirementManifestHashMatches: null,
        evidenceMapHashMatches: null,
        evidenceMapManifestHashMatches: null,
        analyzerMatches: null,
        policyMatches: null,
        normalizedInputHashMatches: null,
        status,
        reasons: uniqueSorted(reasons),
    };
}
async function requireJobTarget(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job") {
        throw new Error(`Job Requirement Coverage rejects Role Target: ${targetId}`);
    }
    return target;
}
function normalizeSignal(value) {
    return value
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/[^a-z0-9+#/.-]+/g, " ")
        .replace(/[./-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const resolved = path.resolve(root, relativePath);
    const relation = path.relative(root, resolved);
    if (relation === ".." ||
        relation.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relation)) {
        throw new Error(`Job Requirement Coverage path escapes the workspace: ${relativePath}`);
    }
    return resolved;
}
async function safeHash(filePath) {
    return (await pathExists(filePath)) ? hashFile(filePath) : undefined;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
