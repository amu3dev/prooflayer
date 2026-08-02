import path from "node:path";
import { hashFile, hashText, pathExists, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { ApprovedTargetInterpretationManifestSchema, MatchingManifestSchema, } from "./schemas.js";
import { FitAssessmentManifestSchema, TargetFitAssessmentSchema, } from "./fit-assessment-schemas.js";
import { getApprovedInterpretationStatus, showApprovedTargetInterpretation, } from "./approved-interpretation.js";
import { getApprovedEvidenceMatchingStatus, showApprovedEvidenceMatching, } from "./evidence-matching.js";
import { showTarget } from "./targets.js";
import { stableJson } from "./target-proposal.js";
export const FIT_ASSESSMENT_POLICY_NAME = "fit-proof-assessment-policy";
export const FIT_ASSESSMENT_POLICY_VERSION = "1";
const ASSESSMENT_FILE = "target-fit-assessment.json";
const MANIFEST_FILE = "assessment-manifest.json";
export async function loadAssessmentContext(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const interpretationStatus = await getApprovedInterpretationStatus(workspace, targetId);
    if (interpretationStatus.status !== "current") {
        throw new Error(`Approved interpretation must be current before assessment. Current status: ${interpretationStatus.status}`);
    }
    const matchingStatus = await getApprovedEvidenceMatchingStatus(workspace, targetId);
    if (matchingStatus.status !== "current") {
        throw new Error(`Approved evidence matching must be current before assessment. Current status: ${matchingStatus.status}`);
    }
    const approvedInterpretation = await showApprovedTargetInterpretation(workspace, targetId);
    const approvedMatching = await showApprovedEvidenceMatching(workspace, targetId);
    if (approvedInterpretation.targetId !== target.id || approvedMatching.targetId !== target.id) {
        throw new Error("Assessment dependencies do not belong to the requested target.");
    }
    if (approvedInterpretation.targetType !== target.type || approvedMatching.targetType !== target.type) {
        throw new Error("Assessment dependency target type is inconsistent.");
    }
    const approvedInterpretationPath = interpretationStatus.interpretationPath;
    const approvedInterpretationManifestPath = interpretationStatus.manifestPath;
    const approvedMatchingPath = matchingStatus.matchingPath;
    const approvedMatchingManifestPath = matchingStatus.manifestPath;
    const interpretationManifest = ApprovedTargetInterpretationManifestSchema.parse(await readJson(resolveWithin(workspace, approvedInterpretationManifestPath), null));
    const matchingManifest = MatchingManifestSchema.parse(await readJson(resolveWithin(workspace, approvedMatchingManifestPath), null));
    if (approvedMatching.approvedInterpretation.sha256 !== interpretationManifest.approvedInterpretationSha256 ||
        matchingManifest.approvedInterpretationSha256 !== interpretationManifest.approvedInterpretationSha256) {
        throw new Error("Approved matching was not built from the current approved interpretation.");
    }
    const expectationIds = approvedInterpretation.expectations.map((entry) => entry.id);
    const coverageIds = approvedMatching.expectationCoverage.map((entry) => entry.expectationId);
    if (!sameSet(expectationIds, coverageIds)) {
        throw new Error("Approved matching coverage does not exactly match approved expectations.");
    }
    return {
        target,
        targetSha256: await hashFile(resolveWithin(workspace, approvedInterpretation.input.targetPath)),
        mode: target.type === "role" ? "role-positioning" : "job-specific",
        approvedInterpretation,
        approvedInterpretationPath,
        approvedInterpretationSha256: interpretationManifest.approvedInterpretationSha256,
        approvedInterpretationManifestPath,
        approvedInterpretationManifestSha256: await hashFile(resolveWithin(workspace, approvedInterpretationManifestPath)),
        approvedMatching,
        approvedMatchingPath,
        approvedMatchingSha256: matchingManifest.matchingSha256,
        approvedMatchingManifestPath,
        approvedMatchingManifestSha256: await hashFile(resolveWithin(workspace, approvedMatchingManifestPath)),
        evidenceSnapshotSha256: approvedMatching.evidenceSnapshot.eligibleEvidenceSetSha256,
        expectationSetSha256: hashText(stableJson(approvedInterpretation.expectations)),
        approvedMatchSetSha256: hashText(stableJson({
            matches: approvedMatching.matches,
            coverage: approvedMatching.expectationCoverage,
        })),
    };
}
export async function buildFitAssessment(workspace, targetId, options = {}) {
    const context = await loadAssessmentContext(workspace, targetId);
    const paths = assessmentPaths(workspace, context.target, "deterministic");
    const status = await getFitAssessmentStatus(workspace, targetId, "deterministic");
    if (status.status === "current") {
        return buildResult(await showFitAssessment(workspace, targetId, "deterministic"), paths, "already-current");
    }
    if (["stale", "invalid"].includes(status.status) && !options.rebuild) {
        throw new Error(`Deterministic assessment is ${status.status}; use explicit --rebuild after reviewing dependency changes.`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.assessmentPath)) {
        try {
            createdAt = TargetFitAssessmentSchema.parse(await readJson(paths.assessmentPath, null)).createdAt;
        }
        catch {
            // Explicit rebuild may recover a malformed artifact while preserving time when readable.
        }
    }
    const assessment = deriveTargetFitAssessment(context, createdAt, now);
    assertAssessmentConsistency(assessment, context);
    await writeJsonAtomic(paths.assessmentPath, assessment);
    const manifest = createAssessmentManifest(assessment, context, paths.assessmentRelativePath, await hashFile(paths.assessmentPath), "deterministic", createdAt, now);
    await writeJsonAtomic(paths.manifestPath, manifest);
    return buildResult(assessment, paths, status.status === "missing" ? "created" : "rebuilt");
}
export async function promoteDeterministicRoleFitAssessment(workspace, targetId, options = {}) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "role")
        throw new Error("Deterministic Role assessment promotion accepts Role Targets only.");
    const deterministicStatus = await getFitAssessmentStatus(workspace, targetId, "deterministic");
    if (deterministicStatus.status !== "current") {
        throw new Error(`Deterministic Role assessment must be current before promotion. Current status: ${deterministicStatus.status}`);
    }
    const paths = assessmentPaths(workspace, target, "approved");
    const approvedStatus = await getFitAssessmentStatus(workspace, targetId, "approved");
    if (approvedStatus.status === "current") {
        return buildResult(await showFitAssessment(workspace, targetId, "approved"), paths, "already-current");
    }
    if (["stale", "invalid"].includes(approvedStatus.status) && !options.rebuild) {
        throw new Error(`Approved Role assessment is ${approvedStatus.status}; use explicit rebuild after reviewing dependency changes.`);
    }
    const assessment = await showFitAssessment(workspace, targetId, "deterministic");
    if (assessment.targetType !== "role" || assessment.mode !== "role-positioning") {
        throw new Error("Only a deterministic Role positioning assessment may be promoted.");
    }
    const context = await loadAssessmentContext(workspace, targetId);
    assertAssessmentConsistency(assessment, context);
    await writeJsonAtomic(paths.assessmentPath, assessment);
    const manifest = createAssessmentManifest(assessment, context, paths.assessmentRelativePath, await hashFile(paths.assessmentPath), "approved", assessment.createdAt, assessment.updatedAt);
    await writeJsonAtomic(paths.manifestPath, manifest);
    return buildResult(assessment, paths, approvedStatus.status === "missing" ? "created" : "rebuilt");
}
export async function showFitAssessment(workspace, targetId, artifactType = "deterministic") {
    const target = await showTarget(workspace, targetId);
    const paths = assessmentPaths(workspace, target, artifactType);
    if (!(await pathExists(paths.assessmentPath)))
        throw new Error(`${artifactType} fit assessment not found: ${targetId}`);
    return TargetFitAssessmentSchema.parse(await readJson(paths.assessmentPath, null));
}
export async function getFitAssessmentStatus(workspace, targetId, artifactType = "deterministic") {
    const target = await showTarget(workspace, targetId);
    const mode = target.type === "role" ? "role-positioning" : "job-specific";
    const paths = assessmentPaths(workspace, target, artifactType);
    const assessmentExists = await pathExists(paths.assessmentPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = { targetId, targetType: target.type, mode, artifactType, assessmentExists, manifestExists, assessmentPath: paths.assessmentRelativePath, manifestPath: paths.manifestRelativePath };
    if (!assessmentExists && !manifestExists)
        return emptyStatus(base, "missing", [`No ${artifactType} fit assessment exists.`]);
    if (!assessmentExists || !manifestExists)
        return emptyStatus(base, "invalid", [`${artifactType} assessment artifact set is incomplete.`]);
    let assessment;
    let manifest;
    try {
        assessment = TargetFitAssessmentSchema.parse(await readJson(paths.assessmentPath, null));
        manifest = FitAssessmentManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyStatus(base, "invalid", [`Stored ${artifactType} assessment is malformed: ${errorMessage(error)}`]);
    }
    const assessmentHashMatches = (await hashFile(paths.assessmentPath)) === manifest.assessmentSha256;
    const invalidReasons = [];
    if (!assessmentHashMatches)
        invalidReasons.push("Assessment SHA-256 does not match its manifest.");
    if (manifest.artifactType !== artifactType ||
        assessment.id !== manifest.assessmentId ||
        assessment.targetId !== target.id ||
        manifest.targetId !== target.id ||
        assessment.targetType !== target.type ||
        manifest.targetType !== target.type ||
        assessment.mode !== mode ||
        manifest.mode !== mode ||
        manifest.assessmentPath !== paths.assessmentRelativePath)
        invalidReasons.push("Assessment identity, mode, or path is invalid.");
    if (assessment.assessmentPolicy.name !== manifest.policyName || assessment.assessmentPolicy.version !== manifest.policyVersion) {
        invalidReasons.push("Assessment policy disagrees with the manifest.");
    }
    if (invalidReasons.length)
        return { ...emptyStatus(base, "invalid", invalidReasons), assessmentHashMatches };
    let context;
    try {
        context = await loadAssessmentContext(workspace, targetId);
    }
    catch (error) {
        return { ...emptyStatus(base, "stale", [`Current assessment dependencies are unavailable: ${errorMessage(error)}`]), assessmentHashMatches };
    }
    try {
        assertAssessmentConsistency(assessment, context);
    }
    catch (error) {
        return { ...emptyStatus(base, "invalid", [`Stored ${artifactType} assessment is inconsistent: ${errorMessage(error)}`]), assessmentHashMatches };
    }
    const targetHashMatches = context.targetSha256 === manifest.targetSha256;
    const approvedInterpretationHashMatches = context.approvedInterpretationSha256 === manifest.approvedInterpretationSha256;
    const approvedInterpretationManifestHashMatches = context.approvedInterpretationManifestSha256 === manifest.approvedInterpretationManifestSha256;
    const approvedMatchingHashMatches = context.approvedMatchingSha256 === manifest.approvedMatchingSha256;
    const approvedMatchingManifestHashMatches = context.approvedMatchingManifestSha256 === manifest.approvedMatchingManifestSha256;
    const evidenceSnapshotHashMatches = context.evidenceSnapshotSha256 === manifest.evidenceSnapshotSha256;
    const expectationSetHashMatches = context.expectationSetSha256 === manifest.expectationSetSha256;
    const approvedMatchSetHashMatches = context.approvedMatchSetSha256 === manifest.approvedMatchSetSha256;
    const policyVersionMatches = manifest.policyName === FIT_ASSESSMENT_POLICY_NAME && manifest.policyVersion === FIT_ASSESSMENT_POLICY_VERSION;
    const proposalHashMatches = manifest.proposalId && manifest.proposalSha256
        ? await dependencyHashMatches(workspace, target, "proposals", manifest.proposalId, "proposal.json", manifest.proposalSha256)
        : null;
    const reviewHashMatches = manifest.proposalId && manifest.reviewSha256
        ? await dependencyHashMatches(workspace, target, "reviews", manifest.proposalId, "review.json", manifest.reviewSha256)
        : null;
    const staleReasons = [
        ...(!targetHashMatches ? ["Target hash changed."] : []),
        ...(!approvedInterpretationHashMatches ? ["Approved interpretation hash changed."] : []),
        ...(!approvedInterpretationManifestHashMatches ? ["Approved interpretation manifest changed."] : []),
        ...(!approvedMatchingHashMatches ? ["Approved matching hash changed."] : []),
        ...(!approvedMatchingManifestHashMatches ? ["Approved matching manifest changed."] : []),
        ...(!evidenceSnapshotHashMatches ? ["Reviewed evidence snapshot changed."] : []),
        ...(!expectationSetHashMatches ? ["Approved expectation set changed."] : []),
        ...(!approvedMatchSetHashMatches ? ["Approved match set changed."] : []),
        ...(!policyVersionMatches ? ["Assessment policy changed."] : []),
        ...(proposalHashMatches === false ? ["Reviewed assessment proposal changed or is missing."] : []),
        ...(reviewHashMatches === false ? ["Assessment review changed or is missing."] : []),
    ];
    return {
        ...base,
        assessmentHashMatches,
        targetHashMatches,
        approvedInterpretationHashMatches,
        approvedInterpretationManifestHashMatches,
        approvedMatchingHashMatches,
        approvedMatchingManifestHashMatches,
        evidenceSnapshotHashMatches,
        expectationSetHashMatches,
        approvedMatchSetHashMatches,
        policyVersionMatches,
        proposalHashMatches,
        reviewHashMatches,
        status: staleReasons.length ? "stale" : "current",
        reasons: staleReasons,
    };
}
export function deriveTargetFitAssessment(context, createdAt, updatedAt) {
    const coverageByExpectation = new Map(context.approvedMatching.expectationCoverage.map((entry) => [entry.expectationId, entry]));
    const assessments = context.approvedInterpretation.expectations.map((expectation) => {
        const coverage = coverageByExpectation.get(expectation.id);
        if (!coverage)
            throw new Error(`Approved matching lacks coverage for expectation: ${expectation.id}`);
        const matches = context.approvedMatching.matches.filter((match) => match.expectationId === expectation.id);
        return deriveExpectationFitAssessment(context, expectation, coverage, matches);
    }).sort((a, b) => a.expectationId.localeCompare(b.expectationId));
    const completeness = deriveCompleteness(context.target.type, assessments, context.approvedMatching.completeness.status);
    const summary = deriveSummary(context.mode, assessments, completeness);
    const risks = deriveRisks(context.target.id, assessments, completeness);
    const warnings = deriveWarnings(context.target.id, assessments, completeness);
    const ambiguities = deriveAmbiguities(context.target.id, assessments);
    const base = {
        schemaVersion: 1,
        id: deterministicAssessmentId(context),
        targetId: context.target.id,
        approvedInterpretation: {
            path: context.approvedInterpretationPath,
            sha256: context.approvedInterpretationSha256,
            manifestPath: context.approvedInterpretationManifestPath,
            manifestSha256: context.approvedInterpretationManifestSha256,
        },
        approvedMatching: {
            path: context.approvedMatchingPath,
            sha256: context.approvedMatchingSha256,
            manifestPath: context.approvedMatchingManifestPath,
            manifestSha256: context.approvedMatchingManifestSha256,
        },
        evidenceSnapshotSha256: context.evidenceSnapshotSha256,
        assessmentPolicy: { name: FIT_ASSESSMENT_POLICY_NAME, version: FIT_ASSESSMENT_POLICY_VERSION },
        expectationAssessments: assessments,
        summary,
        risks,
        warnings,
        ambiguities,
        completeness,
        createdAt,
        updatedAt,
    };
    return TargetFitAssessmentSchema.parse(context.target.type === "role"
        ? { ...base, targetType: "role", mode: "role-positioning" }
        : { ...base, targetType: "job", mode: "job-specific" });
}
export function deriveExpectationFitAssessment(context, expectation, coverage, matches) {
    const sortedMatches = [...matches].sort((a, b) => a.id.localeCompare(b.id));
    const supportStatus = deriveSupportStatus(coverage.status, sortedMatches);
    const proofQuality = deriveProofQuality(supportStatus, sortedMatches);
    const evidenceSufficiency = deriveEvidenceSufficiency(supportStatus);
    const freshnessRisk = deriveFreshnessRisk(sortedMatches);
    const contradictionRisk = supportStatus === "conflicting" ? "high" : "none";
    const gapType = deriveGapType(supportStatus, sortedMatches, freshnessRisk);
    const defensibility = deriveDefensibility(supportStatus, proofQuality);
    const assessmentConfidence = deriveAssessmentConfidence(supportStatus, sortedMatches);
    const materiality = deriveMateriality(expectation.necessity, expectation.importance);
    const evidenceIds = uniqueSorted(sortedMatches.flatMap((match) => match.evidenceIds));
    const limitations = uniqueSorted(sortedMatches.flatMap((match) => match.limitations));
    const recommendedEvidenceActions = deriveEvidenceActions(gapType, supportStatus, evidenceIds);
    return {
        id: expectationAssessmentId(context.target.id, expectation.id, context.approvedMatchingSha256),
        expectationId: expectation.id,
        expectation: {
            text: expectation.statement,
            type: expectation.kind,
            necessity: expectation.necessity,
            importance: expectation.importance,
            trustState: expectation.trustState,
        },
        supportStatus,
        proofQuality,
        evidenceSufficiency,
        defensibility,
        freshnessRisk,
        contradictionRisk,
        gapType,
        assessmentConfidence,
        materiality,
        approvedMatchIds: sortedMatches.map((match) => match.id),
        evidenceIds,
        rationale: deterministicRationale(supportStatus, coverage, sortedMatches),
        limitations,
        recommendedEvidenceActions,
        provenance: {
            targetId: context.target.id,
            expectationId: expectation.id,
            approvedInterpretationSha256: context.approvedInterpretationSha256,
            approvedInterpretationManifestSha256: context.approvedInterpretationManifestSha256,
            approvedMatchingSha256: context.approvedMatchingSha256,
            approvedMatchingManifestSha256: context.approvedMatchingManifestSha256,
            evidenceSnapshotSha256: context.evidenceSnapshotSha256,
            approvedMatchIds: sortedMatches.map((match) => match.id),
            evidenceIds,
            assessmentPolicy: { name: FIT_ASSESSMENT_POLICY_NAME, version: FIT_ASSESSMENT_POLICY_VERSION },
            deterministicInputs: {
                coverageStatus: coverage.status,
                matchTypes: sortedMatches.map((match) => match.matchType),
                evidenceStrengths: sortedMatches.map((match) => match.evidenceStrength),
                temporalRelevance: sortedMatches.map((match) => match.temporalRelevance),
                matchConfidences: sortedMatches.map((match) => match.matchConfidence),
            },
            sourceReferences: expectation.sourceReferences,
        },
        trustState: "deterministic-approved",
    };
}
export function deriveSupportStatus(coverage, matches) {
    if (coverage === "not-assessed")
        return "not-assessed";
    if (coverage === "unsupported")
        return "unsupported";
    if (coverage === "conflicting")
        return "conflicting";
    if (coverage === "partially-matched")
        return "partially-supported";
    const direct = matches.filter((match) => match.matchType === "direct" && match.coverage === "full");
    if (direct.some((match) => match.evidenceStrength === "strong" && match.matchConfidence === "high" && ["current", "recent"].includes(match.temporalRelevance) && match.limitations.length === 0)) {
        return "strongly-supported";
    }
    return direct.length > 0 ? "supported" : "partially-supported";
}
export function deriveMateriality(necessity, importance) {
    if (necessity === "unknown" || importance === "unknown")
        return "unknown";
    if (necessity === "required")
        return importance;
    if (necessity === "preferred")
        return ["critical", "high"].includes(importance) ? "medium" : "low";
    if (necessity === "contextual")
        return ["critical", "high"].includes(importance) ? "medium" : "low";
    return "unknown";
}
export function deriveSummary(mode, assessments, completeness) {
    return mode === "role-positioning"
        ? deriveRoleSummary(assessments, completeness)
        : deriveJobSummary(assessments, completeness);
}
export function deriveRoleSummary(assessments, completeness) {
    const counts = supportCounts(assessments);
    const criticalConflict = assessments.some((entry) => entry.supportStatus === "conflicting" && ["critical", "high"].includes(entry.materiality));
    const allMaterialSupported = assessments.filter((entry) => ["critical", "high"].includes(entry.materiality)).every((entry) => ["strongly-supported", "supported"].includes(entry.supportStatus));
    const positive = counts.stronglySupported + counts.supported;
    let overallPositioning;
    if (completeness.status !== "complete")
        overallPositioning = "incomplete";
    else if (criticalConflict)
        overallPositioning = "conflicting";
    else if (assessments.length > 0 && allMaterialSupported && counts.partiallySupported === 0 && counts.unsupported === 0 && counts.conflicting === 0)
        overallPositioning = "well-supported";
    else if (positive > 0)
        overallPositioning = "supported-with-gaps";
    else if (counts.partiallySupported > 0)
        overallPositioning = "partially-supported";
    else
        overallPositioning = "insufficient-evidence";
    return {
        mode: "role-positioning",
        overallPositioning,
        stronglySupportedCount: counts.stronglySupported,
        supportedCount: counts.supported,
        partiallySupportedCount: counts.partiallySupported,
        unsupportedCount: counts.unsupported,
        conflictingCount: counts.conflicting,
        notAssessedCount: counts.notAssessed,
        criticalGapExpectationIds: assessments.filter((entry) => ["critical", "high"].includes(entry.materiality) && ["unsupported", "conflicting", "not-assessed"].includes(entry.supportStatus)).map((entry) => entry.expectationId),
        evidenceImprovementExpectationIds: assessments.filter((entry) => entry.gapType !== "none").map((entry) => entry.expectationId),
        narrative: roleNarrative(overallPositioning),
    };
}
export function deriveJobSummary(assessments, completeness) {
    const required = assessments.filter((entry) => entry.expectation.necessity === "required");
    const preferred = assessments.filter((entry) => entry.expectation.necessity === "preferred");
    const contextual = assessments.filter((entry) => !["required", "preferred"].includes(entry.expectation.necessity));
    const requiredCounts = requirementCounts(required);
    const materialConflict = assessments.some((entry) => entry.supportStatus === "conflicting" && ["critical", "high"].includes(entry.materiality));
    const requiredPositive = requiredCounts.stronglySupported + requiredCounts.supported;
    let opportunityAlignment;
    if (completeness.status !== "complete")
        opportunityAlignment = "incomplete";
    else if (materialConflict)
        opportunityAlignment = "material-conflict";
    else if (required.length > 0 && requiredCounts.unsupported === 0 && requiredCounts.conflicting === 0 && requiredCounts.partiallySupported === 0 && requiredCounts.notAssessed === 0)
        opportunityAlignment = "strong-alignment";
    else if (required.length > 0 && requiredCounts.unsupported === 0 && requiredCounts.conflicting === 0 && requiredPositive > 0)
        opportunityAlignment = "credible-alignment";
    else if (requiredPositive > 0)
        opportunityAlignment = "mixed-alignment";
    else
        opportunityAlignment = "weak-evidence-alignment";
    return {
        mode: "job-specific",
        opportunityAlignment,
        requiredExpectationSummary: requiredCounts,
        preferredExpectationSummary: requirementCounts(preferred),
        contextualExpectationSummary: requirementCounts(contextual),
        materialRiskExpectationIds: assessments.filter((entry) => ["critical", "high"].includes(entry.materiality) && ["unsupported", "conflicting", "not-assessed"].includes(entry.supportStatus)).map((entry) => entry.expectationId),
        unsupportedRequiredExpectationIds: required.filter((entry) => entry.supportStatus === "unsupported").map((entry) => entry.expectationId),
        conflictingExpectationIds: assessments.filter((entry) => entry.supportStatus === "conflicting").map((entry) => entry.expectationId),
        narrative: jobNarrative(opportunityAlignment),
    };
}
export function assertAssessmentConsistency(assessment, context) {
    if (assessment.targetId !== context.target.id || assessment.targetType !== context.target.type || assessment.mode !== context.mode) {
        throw new Error("Assessment target identity or mode is inconsistent.");
    }
    const expectations = new Map(context.approvedInterpretation.expectations.map((entry) => [entry.id, entry]));
    const matches = new Map(context.approvedMatching.matches.map((entry) => [entry.id, entry]));
    const evidenceIds = new Set(context.approvedMatching.matches.flatMap((entry) => entry.evidenceIds));
    if (assessment.expectationAssessments.length !== expectations.size)
        throw new Error("Assessment does not cover every approved expectation.");
    for (const entry of assessment.expectationAssessments) {
        if (!expectations.has(entry.expectationId))
            throw new Error(`Assessment references an unknown expectation: ${entry.expectationId}`);
        if (entry.approvedMatchIds.some((id) => !matches.has(id)))
            throw new Error(`Assessment references an unknown approved match: ${entry.expectationId}`);
        if (entry.evidenceIds.some((id) => !evidenceIds.has(id)))
            throw new Error(`Assessment references unknown reviewed evidence: ${entry.expectationId}`);
        if (entry.supportStatus === "strongly-supported") {
            const direct = entry.approvedMatchIds.map((id) => matches.get(id)).filter(Boolean);
            if (!direct.some((match) => match.matchType === "direct" && match.coverage === "full" && match.evidenceStrength === "strong" && match.matchConfidence === "high")) {
                throw new Error("Strong support requires strong approved direct evidence.");
            }
        }
        if (entry.supportStatus === "unsupported" && entry.approvedMatchIds.length > 0)
            throw new Error("Unsupported assessment cannot contain approved support matches.");
        if (entry.supportStatus === "conflicting" && !entry.approvedMatchIds.map((id) => matches.get(id)).some((match) => match.matchType === "contradictory" || match.coverage === "conflicting")) {
            throw new Error("Conflicting assessment requires approved contradiction provenance.");
        }
        if (entry.supportStatus === "not-assessed" && assessment.completeness.status === "complete")
            throw new Error("A complete assessment cannot contain not-assessed expectations.");
        if (entry.provenance.approvedMatchingSha256 !== context.approvedMatchingSha256 || entry.provenance.approvedInterpretationSha256 !== context.approvedInterpretationSha256) {
            throw new Error("Assessment provenance is stale or incomplete.");
        }
    }
    assertSummaryCounts(assessment.summary, assessment.expectationAssessments);
    if (/\b\d+(?:\.\d+)?%\b/.test(assessment.summary.narrative))
        throw new Error("Fit percentages are forbidden in assessment summaries.");
    if (/\b(should|recommend)\s+(apply|hire|interview)\b/i.test(assessment.summary.narrative))
        throw new Error("Hiring and application recommendations are forbidden.");
}
export function createAssessmentManifest(assessment, context, assessmentPath, assessmentSha256, artifactType, createdAt, updatedAt, reviewDependencies = {}) {
    return FitAssessmentManifestSchema.parse({
        schemaVersion: 1,
        artifactType,
        assessmentId: assessment.id,
        targetId: context.target.id,
        targetType: context.target.type,
        mode: context.mode,
        assessmentPath,
        assessmentSha256,
        policyName: FIT_ASSESSMENT_POLICY_NAME,
        policyVersion: FIT_ASSESSMENT_POLICY_VERSION,
        targetSha256: context.targetSha256,
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        approvedInterpretationManifestSha256: context.approvedInterpretationManifestSha256,
        approvedMatchingSha256: context.approvedMatchingSha256,
        approvedMatchingManifestSha256: context.approvedMatchingManifestSha256,
        evidenceSnapshotSha256: context.evidenceSnapshotSha256,
        expectationSetSha256: context.expectationSetSha256,
        approvedMatchSetSha256: context.approvedMatchSetSha256,
        ...reviewDependencies,
        createdAt,
        updatedAt,
    });
}
export function deterministicAssessmentId(context) {
    return `assessment_${hashText([context.target.id, context.approvedInterpretationSha256, context.approvedMatchingSha256, FIT_ASSESSMENT_POLICY_VERSION].join("\u0000")).slice(0, 16)}`;
}
export function expectationAssessmentId(targetId, expectationId, approvedMatchingSha256) {
    return `expectation-assessment_${hashText([targetId, expectationId, approvedMatchingSha256, FIT_ASSESSMENT_POLICY_VERSION].join("\u0000")).slice(0, 16)}`;
}
export function formatBuildFitAssessmentResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Target type: ${result.targetType}`,
        `Assessment mode: ${result.mode}`,
        `Result: ${result.result}`,
        `Assessment ID: ${result.assessmentId}`,
        `Assessment path: ${result.assessmentPath}`,
        `Manifest path: ${result.manifestPath}`,
        `Expectation assessments: ${result.expectationCount}`,
        `Completeness: ${result.completeness}`,
        `Usable for future resume construction: ${result.usableForResumeConstruction ? "yes" : "no"}`,
        `Usable for future application construction: ${result.usableForApplicationConstruction ? "yes" : "no"}`,
        `Warnings: ${result.warningCount}`,
        `Risks: ${result.riskCount}`,
    ].join("\n");
}
export function formatFitAssessmentStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Target ID: ${status.targetId}`,
        `Target type: ${status.targetType}`,
        `Assessment mode: ${status.mode}`,
        `Artifact type: ${status.artifactType}`,
        `Overall status: ${status.status}`,
        `Assessment hash matches: ${check(status.assessmentHashMatches)}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Approved interpretation matches: ${check(status.approvedInterpretationHashMatches)}`,
        `Approved matching matches: ${check(status.approvedMatchingHashMatches)}`,
        `Evidence snapshot matches: ${check(status.evidenceSnapshotHashMatches)}`,
        `Policy version matches: ${check(status.policyVersionMatches)}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
export function assessmentPaths(workspace, target, artifactType) {
    const root = `${targetRoot(target)}/assessment/${artifactType}`;
    const assessmentRelativePath = `${root}/${ASSESSMENT_FILE}`;
    const manifestRelativePath = `${root}/${MANIFEST_FILE}`;
    return {
        root,
        assessmentRelativePath,
        assessmentPath: resolveWithin(workspace, assessmentRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
function deriveProofQuality(status, matches) {
    if (status === "strongly-supported")
        return "strong";
    if (status === "supported")
        return "adequate";
    if (status === "unsupported")
        return "none";
    if (status === "conflicting")
        return "conflicting";
    if (status === "not-assessed")
        return "unknown";
    if (matches.some((match) => ["strong", "medium"].includes(match.evidenceStrength)))
        return "limited";
    return matches.length ? "weak" : "none";
}
function deriveEvidenceSufficiency(status) {
    if (["strongly-supported", "supported"].includes(status))
        return "sufficient";
    if (status === "partially-supported")
        return "partially-sufficient";
    if (["unsupported", "conflicting"].includes(status))
        return "insufficient";
    return "not-evaluated";
}
function deriveDefensibility(status, quality) {
    if (status === "strongly-supported" && quality === "strong")
        return "high";
    if (status === "supported")
        return "medium";
    if (status === "partially-supported")
        return "low";
    if (["unsupported", "conflicting"].includes(status))
        return "none";
    return "uncertain";
}
function deriveFreshnessRisk(matches) {
    if (!matches.length)
        return "unknown";
    if (matches.every((match) => match.temporalRelevance === "historical"))
        return "high";
    if (matches.some((match) => match.temporalRelevance === "historical"))
        return "medium";
    if (matches.every((match) => match.temporalRelevance === "unknown"))
        return "unknown";
    if (matches.some((match) => match.temporalRelevance === "recent"))
        return "low";
    return "none";
}
function deriveGapType(status, matches, freshness) {
    if (status === "not-assessed")
        return "not-assessed";
    if (status === "conflicting")
        return "contradiction";
    if (status === "unsupported")
        return "evidence-gap";
    if (freshness === "high")
        return "freshness-gap";
    if (status === "partially-supported") {
        if (matches.some((match) => match.matchType === "partial" || match.coverage === "partial"))
            return "coverage-gap";
        if (matches.length > 0 && matches.every((match) => match.evidenceProvenance.every((entry) => entry.evidenceType === "role")))
            return "specificity-gap";
        return "specificity-gap";
    }
    return "none";
}
function deriveAssessmentConfidence(status, matches) {
    if (status === "not-assessed")
        return "low";
    if (status === "unsupported")
        return "medium";
    if (!matches.length)
        return "low";
    if (matches.every((match) => match.matchConfidence === "high"))
        return "high";
    if (matches.some((match) => match.matchConfidence === "medium"))
        return "medium";
    return "low";
}
function deriveEvidenceActions(gapType, status, evidenceIds) {
    const action = (type, priority, rationale) => ({ type, priority, rationale, relatedEvidenceIds: evidenceIds });
    if (status === "strongly-supported")
        return [action("no-action", "low", "Current reviewed evidence is sufficiently specific and defensible for this expectation.")];
    if (gapType === "coverage-gap")
        return [action("separate-compound-claim", "high", "Separate the expectation or add evidence for the uncovered portion.")];
    if (gapType === "specificity-gap")
        return [action("add-specific-example", "high", "Add a reviewed example that demonstrates the expectation directly.")];
    if (gapType === "freshness-gap")
        return [action("add-recent-example", "high", "Add a recent reviewed example where current practice matters.")];
    if (gapType === "contradiction")
        return [action("resolve-contradiction", "high", "Resolve the approved contradictory evidence before relying on this expectation.")];
    if (gapType === "evidence-gap")
        return [action("review-unreviewed-source", "medium", "Review existing source material or add a specific example; missing evidence does not prove missing capability.")];
    if (gapType === "not-assessed")
        return [action("verify-claim", "high", "Complete reviewed evidence matching before using this expectation downstream.")];
    return [action("no-action", "low", "No immediate evidence action is required beyond preserving current limitations.")];
}
function deterministicRationale(status, coverage, matches) {
    const count = matches.length;
    if (status === "strongly-supported")
        return "Approved direct, strong, current or recent evidence fully supports this expectation with complete provenance.";
    if (status === "supported")
        return "Approved evidence materially and defensibly supports this expectation, with limitations below where applicable.";
    if (status === "partially-supported")
        return `Approved evidence supports only part of this expectation or is indirect; ${count} approved match(es) are retained with explicit limitations.`;
    if (status === "unsupported")
        return "The reviewed evidence base was assessed and does not currently prove this expectation; this does not prove the capability is absent.";
    if (status === "conflicting")
        return "Approved contradictory evidence materially conflicts with this expectation and must be resolved before reliance.";
    return coverage.blockingReasons[0] ?? "No completed approved matching decision exists for this expectation.";
}
export function deriveCompleteness(targetType, assessments, matchingStatus) {
    const assessed = assessments.filter((entry) => entry.supportStatus !== "not-assessed").length;
    const total = assessments.length;
    const status = total === 0 || assessed === 0 ? "empty" : matchingStatus === "complete" && assessed === total ? "complete" : "partial";
    return {
        status,
        assessedExpectationCount: assessed,
        totalEligibleExpectationCount: total,
        summaryAvailable: total > 0,
        usableForResumeConstruction: status === "complete" && targetType === "role",
        usableForApplicationConstruction: status === "complete" && targetType === "job",
        blockingReasons: status === "complete" ? [] : total === 0 ? ["No eligible approved expectations exist."] : [`${total - assessed} expectation(s) remain not assessed or matching is incomplete.`],
    };
}
export function deriveRisks(targetId, assessments, completeness) {
    const risks = [];
    const add = (code, severity, message, entry) => risks.push({
        id: `assessment-risk_${hashText([targetId, code, entry?.expectationId ?? "target"].join("\u0000")).slice(0, 12)}`,
        code,
        severity,
        message,
        expectationIds: entry ? [entry.expectationId] : [],
        evidenceIds: entry?.evidenceIds ?? [],
    });
    if (completeness.status !== "complete")
        add("ASSESSMENT_INCOMPLETE", "high", "Approved matching is incomplete, so downstream construction is blocked.");
    for (const entry of assessments) {
        if (entry.supportStatus === "unsupported" && entry.materiality === "critical")
            add("CRITICAL_REQUIREMENT_UNSUPPORTED", "critical", "A critical expectation is unsupported by the reviewed evidence base.", entry);
        if (entry.supportStatus === "partially-supported" && entry.expectation.necessity === "required")
            add("REQUIRED_EXPECTATION_PARTIALLY_SUPPORTED", "high", "A required expectation has only partial reviewed support.", entry);
        if (entry.supportStatus === "conflicting")
            add("MATERIAL_CONTRADICTION", ["critical", "high"].includes(entry.materiality) ? "critical" : "high", "Approved evidence materially contradicts this expectation.", entry);
        if (entry.gapType === "specificity-gap")
            add("EVIDENCE_TOO_GENERAL", "medium", "Reviewed evidence is too general for the expectation.", entry);
        if (entry.gapType === "freshness-gap")
            add("EVIDENCE_TOO_OLD", "medium", "Reviewed evidence is historical where recency may matter.", entry);
        if (entry.proofQuality === "weak")
            add("EVIDENCE_TOO_WEAK", "medium", "Available reviewed evidence is weak.", entry);
        if (entry.gapType === "coverage-gap")
            add("COMPOUND_EXPECTATION_PARTIALLY_COVERED", "medium", "Only part of a compound expectation is covered.", entry);
    }
    return risks.sort((a, b) => a.id.localeCompare(b.id));
}
export function deriveWarnings(targetId, assessments, completeness) {
    const warnings = [];
    const add = (code, message, entries = []) => warnings.push({
        id: `assessment-warning_${hashText([targetId, code, entries.map((entry) => entry.expectationId).join(",")].join("\u0000")).slice(0, 12)}`,
        code,
        message,
        expectationIds: entries.map((entry) => entry.expectationId),
        evidenceIds: uniqueSorted(entries.flatMap((entry) => entry.evidenceIds)),
    });
    if (completeness.status !== "complete")
        add("MATCHING_NOT_COMPLETE", "Approved matching is incomplete; this assessment is a draft and is unusable for downstream construction.");
    const supported = assessments.filter((entry) => ["strongly-supported", "supported", "partially-supported"].includes(entry.supportStatus));
    if (!supported.length)
        add("NO_SUPPORTED_EXPECTATIONS", "No expectation currently has approved reviewed support.");
    if (!assessments.some((entry) => entry.expectation.necessity === "required"))
        add("NO_REQUIRED_EXPECTATIONS_IDENTIFIED", "No required expectations were identified in the approved interpretation.");
    const unsupported = assessments.filter((entry) => entry.supportStatus === "unsupported");
    if (unsupported.length)
        add("UNSUPPORTED_EXPECTATION_DOES_NOT_PROVE_NO_EXPERIENCE", "Unsupported means the reviewed evidence base does not currently prove the expectation; it does not prove the capability is absent.", unsupported);
    const matchingEntries = supported.filter((entry) => entry.approvedMatchIds.length > 0);
    if (matchingEntries.length && matchingEntries.every((entry) => entry.provenance.deterministicInputs.matchTypes.every((type) => type !== "direct")))
        add("ONLY_SUPPORTING_EVIDENCE_AVAILABLE", "Only supporting or partial evidence is available for supported expectations.", matchingEntries);
    if (matchingEntries.length && matchingEntries.every((entry) => entry.provenance.deterministicInputs.temporalRelevance.every((value) => value === "historical")))
        add("ONLY_HISTORICAL_EVIDENCE_AVAILABLE", "Only historical evidence is available for supported expectations.", matchingEntries);
    return warnings.sort((a, b) => a.id.localeCompare(b.id));
}
export function deriveAmbiguities(targetId, assessments) {
    const ambiguities = [];
    const add = (code, message, entry) => ambiguities.push({
        id: `assessment-ambiguity_${hashText([targetId, code, entry.expectationId].join("\u0000")).slice(0, 12)}`,
        code,
        message,
        expectationId: entry.expectationId,
        evidenceIds: entry.evidenceIds,
    });
    for (const entry of assessments) {
        if (entry.gapType === "evidence-gap")
            add("EVIDENCE_GAP_VS_EXPERIENCE_GAP_UNCLEAR", "The current evidence gap cannot establish whether the capability itself is absent.", entry);
        if (entry.supportStatus === "supported" && entry.assessmentConfidence !== "high")
            add("SUPPORTED_VS_STRONGLY_SUPPORTED_UNCLEAR", "Evidence is supportable, but available quality or confidence does not justify strong support.", entry);
        if (entry.materiality === "unknown")
            add("MATERIALITY_UNCLEAR", "Approved necessity or importance is unknown.", entry);
        if (entry.freshnessRisk === "unknown" && entry.evidenceIds.length)
            add("FRESHNESS_RELEVANCE_UNCLEAR", "Evidence temporal relevance is unknown.", entry);
        if (entry.gapType === "coverage-gap")
            add("COMPOUND_EXPECTATION_BOUNDARY_UNCLEAR", "The boundary between covered and uncovered parts requires review.", entry);
        if (entry.supportStatus === "conflicting" && !["critical", "high"].includes(entry.materiality))
            add("CONTRADICTION_MATERIALITY_UNCLEAR", "Contradictory evidence exists but its materiality is not high or critical.", entry);
    }
    return ambiguities.sort((a, b) => a.id.localeCompare(b.id));
}
function requirementCounts(entries) {
    const counts = supportCounts(entries);
    return {
        total: entries.length,
        stronglySupported: counts.stronglySupported,
        supported: counts.supported,
        partiallySupported: counts.partiallySupported,
        unsupported: counts.unsupported,
        conflicting: counts.conflicting,
        notAssessed: counts.notAssessed,
    };
}
function supportCounts(entries) {
    return entries.reduce((counts, entry) => {
        if (entry.supportStatus === "strongly-supported")
            counts.stronglySupported += 1;
        else if (entry.supportStatus === "supported")
            counts.supported += 1;
        else if (entry.supportStatus === "partially-supported")
            counts.partiallySupported += 1;
        else if (entry.supportStatus === "unsupported")
            counts.unsupported += 1;
        else if (entry.supportStatus === "conflicting")
            counts.conflicting += 1;
        else
            counts.notAssessed += 1;
        return counts;
    }, { stronglySupported: 0, supported: 0, partiallySupported: 0, unsupported: 0, conflicting: 0, notAssessed: 0 });
}
function assertSummaryCounts(summary, assessments) {
    if (summary.mode === "role-positioning") {
        const counts = supportCounts(assessments);
        if (summary.stronglySupportedCount !== counts.stronglySupported ||
            summary.supportedCount !== counts.supported ||
            summary.partiallySupportedCount !== counts.partiallySupported ||
            summary.unsupportedCount !== counts.unsupported ||
            summary.conflictingCount !== counts.conflicting ||
            summary.notAssessedCount !== counts.notAssessed)
            throw new Error("Role assessment summary counts are inconsistent.");
        return;
    }
    const groups = [
        [summary.requiredExpectationSummary, assessments.filter((entry) => entry.expectation.necessity === "required")],
        [summary.preferredExpectationSummary, assessments.filter((entry) => entry.expectation.necessity === "preferred")],
        [summary.contextualExpectationSummary, assessments.filter((entry) => !["required", "preferred"].includes(entry.expectation.necessity))],
    ];
    for (const [actual, entries] of groups) {
        if (stableJson(actual) !== stableJson(requirementCounts(entries)))
            throw new Error("Job assessment summary counts are inconsistent.");
    }
}
function roleNarrative(category) {
    const narratives = {
        "well-supported": "Reviewed evidence supports the material role expectations without a critical evidence gap or contradiction.",
        "supported-with-gaps": "Reviewed evidence supports meaningful role positioning, with explicit gaps that should be addressed before construction.",
        "partially-supported": "Reviewed evidence supports parts of the role, but stronger and more specific proof is needed.",
        "insufficient-evidence": "The reviewed evidence base does not currently provide enough support for defensible role positioning.",
        "conflicting": "Material approved contradictions must be resolved before relying on this role positioning.",
        "incomplete": "The assessment is incomplete because approved matching has unresolved expectations.",
    };
    return narratives[category];
}
function jobNarrative(category) {
    const narratives = {
        "strong-alignment": "Reviewed evidence supports the identified required expectations without a material unresolved gap or contradiction.",
        "credible-alignment": "Reviewed evidence provides credible support for required expectations, with manageable partial proof limitations.",
        "mixed-alignment": "Reviewed evidence shows both meaningful support and material gaps across the opportunity requirements.",
        "weak-evidence-alignment": "The reviewed evidence base does not currently support enough required expectations for strong application construction.",
        "material-conflict": "A material approved contradiction affects this opportunity assessment.",
        "incomplete": "The opportunity assessment is incomplete because approved matching has unresolved expectations.",
    };
    return narratives[category];
}
function buildResult(assessment, paths, result) {
    return {
        targetId: assessment.targetId,
        targetType: assessment.targetType,
        mode: assessment.mode,
        result,
        assessmentId: assessment.id,
        assessmentPath: paths.assessmentRelativePath,
        manifestPath: paths.manifestRelativePath,
        expectationCount: assessment.expectationAssessments.length,
        completeness: assessment.completeness.status,
        usableForResumeConstruction: assessment.completeness.usableForResumeConstruction,
        usableForApplicationConstruction: assessment.completeness.usableForApplicationConstruction,
        warningCount: assessment.warnings.length,
        riskCount: assessment.risks.length,
    };
}
function emptyStatus(base, status, reasons) {
    return {
        ...base,
        assessmentHashMatches: null,
        targetHashMatches: null,
        approvedInterpretationHashMatches: null,
        approvedInterpretationManifestHashMatches: null,
        approvedMatchingHashMatches: null,
        approvedMatchingManifestHashMatches: null,
        evidenceSnapshotHashMatches: null,
        expectationSetHashMatches: null,
        approvedMatchSetHashMatches: null,
        policyVersionMatches: null,
        proposalHashMatches: null,
        reviewHashMatches: null,
        status,
        reasons,
    };
}
async function dependencyHashMatches(workspace, target, directory, proposalId, fileName, expectedSha256) {
    const relativePath = `${targetRoot(target)}/assessment/${directory}/${proposalId}/${fileName}`;
    const filePath = resolveWithin(workspace, relativePath);
    return (await pathExists(filePath)) && (await hashFile(filePath)) === expectedSha256;
}
function targetRoot(target) {
    return `targets/${target.type === "role" ? "roles" : "jobs"}/${target.id}`;
}
function resolveWithin(workspace, relativePath) {
    const resolved = path.resolve(workspace, relativePath);
    const relation = path.relative(path.resolve(workspace), resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Assessment path escapes workspace: ${relativePath}`);
    }
    return resolved;
}
function sameSet(left, right) {
    return new Set(left).size === left.length && new Set(right).size === right.length && left.length === right.length && left.every((entry) => right.includes(entry));
}
function uniqueSorted(values) {
    return [...new Set(values)].sort();
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
