import path from "node:path";
import { hashFile, hashText, pathExists, readJson, walkFiles, writeJsonAtomic, } from "./fs-utils.js";
import { ApprovedTargetInterpretationManifestSchema, ClaimSchema, EvidenceItemSchema, EvidenceSnapshotManifestSchema, EvidenceSnapshotSchema, ManualEvidenceMatchingSchema, ManualMatchingManifestSchema, MatchingManifestSchema, SourceSchema, TargetEvidenceMatchingSchema, } from "./schemas.js";
import { getApprovedInterpretationStatus, showApprovedTargetInterpretation, } from "./approved-interpretation.js";
import { showTarget } from "./targets.js";
import { stableJson } from "./target-proposal.js";
export const EVIDENCE_ELIGIBILITY_POLICY_VERSION = "1";
export const EVIDENCE_MATCHER_NAME = "target-evidence-matcher";
export const EVIDENCE_MATCHER_VERSION = "1";
export const EVIDENCE_MATCHING_POLICY_VERSION = "1";
const SNAPSHOT_FILE = "evidence-snapshot.json";
const SNAPSHOT_MANIFEST_FILE = "evidence-snapshot-manifest.json";
const MANUAL_FILE = "target-evidence-matching.json";
const MANUAL_MANIFEST_FILE = "matching-manifest.json";
const APPROVED_FILE = "target-evidence-matching.json";
const APPROVED_MANIFEST_FILE = "matching-manifest.json";
export async function loadMatchingContext(workspace, targetId, options = {}) {
    const target = await showTarget(workspace, targetId);
    const approvedStatus = await getApprovedInterpretationStatus(workspace, targetId);
    if (approvedStatus.status !== "current") {
        throw new Error(`Approved interpretation must be current before evidence matching. Current status: ${approvedStatus.status}`);
    }
    const approvedInterpretation = await showApprovedTargetInterpretation(workspace, targetId);
    if (!approvedInterpretation.completeness.usableForEvidenceMatching) {
        throw new Error("Approved interpretation is not usable for evidence matching.");
    }
    const eligibleExpectations = approvedInterpretation.expectations.filter((expectation) => ["deterministic-approved", "human-approved", "human-edited"].includes(expectation.trustState));
    if (new Set(eligibleExpectations.map((expectation) => expectation.id)).size !== eligibleExpectations.length) {
        throw new Error("Approved interpretation contains duplicate expectation IDs.");
    }
    const paths = matchingPaths(workspace, target);
    const currentSnapshot = await calculateEvidenceSnapshot(workspace, options.now);
    let snapshot = currentSnapshot;
    let snapshotManifest;
    if (options.persistSnapshot !== false) {
        ({ snapshot, manifest: snapshotManifest } = await persistEvidenceSnapshot(workspace, target, currentSnapshot, options.now, options.rebuildSnapshot));
    }
    else {
        snapshotManifest = EvidenceSnapshotManifestSchema.parse({
            schemaVersion: 1,
            snapshotPath: paths.snapshotRelativePath,
            snapshotSha256: hashSerialized(currentSnapshot),
            policyVersion: currentSnapshot.policyVersion,
            sourcesSha256: currentSnapshot.sourcesSha256,
            evidenceItemsSha256: currentSnapshot.evidenceItemsSha256,
            claimsSha256: currentSnapshot.claimsSha256,
            eligibleEvidenceSetSha256: currentSnapshot.eligibleEvidenceSetSha256,
            createdAt: currentSnapshot.createdAt,
            updatedAt: currentSnapshot.updatedAt,
        });
    }
    const approvedManifest = ApprovedTargetInterpretationManifestSchema.parse(await readJson(resolveWithin(workspace, approvedStatus.manifestPath), null));
    return {
        target,
        targetSha256: await hashFile(resolveWithin(workspace, approvedInterpretation.input.targetPath)),
        approvedInterpretation,
        approvedInterpretationPath: approvedStatus.interpretationPath,
        approvedInterpretationSha256: approvedManifest.approvedInterpretationSha256,
        approvedInterpretationManifestPath: approvedStatus.manifestPath,
        approvedInterpretationManifestSha256: await hashFile(resolveWithin(workspace, approvedStatus.manifestPath)),
        eligibleExpectations,
        snapshot,
        snapshotPath: paths.snapshotRelativePath,
        snapshotManifest,
        snapshotManifestPath: paths.snapshotManifestRelativePath,
        snapshotManifestSha256: options.persistSnapshot === false
            ? hashSerialized(snapshotManifest)
            : await hashFile(paths.snapshotManifestPath),
    };
}
export async function calculateEvidenceSnapshot(workspace, now = undefined) {
    const sourcesPath = path.join(workspace, "kb", "sources.json");
    const evidencePath = path.join(workspace, "kb", "evidence-items.json");
    const claimsPath = path.join(workspace, "kb", "claims.json");
    for (const required of [sourcesPath, evidencePath, claimsPath]) {
        if (!(await pathExists(required)))
            throw new Error(`Required reviewed evidence artifact is missing: ${path.basename(required)}`);
    }
    const sources = (await readJson(sourcesPath, [])).map((entry) => SourceSchema.parse(entry));
    const evidenceItems = (await readJson(evidencePath, [])).map((entry) => EvidenceItemSchema.parse(entry));
    const claims = (await readJson(claimsPath, [])).map((entry) => ClaimSchema.parse(entry));
    assertUnique(sources.map((entry) => entry.id), "source");
    assertUnique(evidenceItems.map((entry) => entry.id), "evidence");
    assertUnique(claims.map((entry) => entry.id), "claim");
    const sourceById = new Map(sources.map((source) => [source.id, source]));
    const eligibleClaimsByEvidence = new Map();
    for (const claim of claims) {
        if (!isReviewedClaim(claim))
            continue;
        for (const evidenceId of claim.supportingEvidenceIds) {
            const list = eligibleClaimsByEvidence.get(evidenceId) ?? [];
            list.push(claim);
            eligibleClaimsByEvidence.set(evidenceId, list);
        }
    }
    const entries = [];
    for (const evidence of evidenceItems) {
        const supportingClaims = (eligibleClaimsByEvidence.get(evidence.id) ?? [])
            .sort((a, b) => a.id.localeCompare(b.id));
        const evidenceSources = evidence.sourceIds.map((id) => sourceById.get(id));
        if (supportingClaims.length === 0)
            continue;
        if (evidence.visibility !== "public" || evidence.sensitivityFlags.length > 0)
            continue;
        if (evidenceSources.length === 0 || evidenceSources.some((source) => !source))
            continue;
        const concreteSources = evidenceSources;
        if (concreteSources.some((source) => source.status !== "active" || source.visibility !== "public" || source.type === "job_description"))
            continue;
        const provenance = {
            evidenceId: evidence.id,
            evidenceType: evidence.category,
            reviewedStatus: "approved",
            active: true,
            evidenceArtifactSha256: hashText(stableJson(evidence)),
            reviewArtifactSha256: hashText(stableJson(supportingClaims)),
            supportingClaimIds: supportingClaims.map((claim) => claim.id),
            sources: concreteSources
                .map((source) => ({
                sourceId: source.id,
                sourceType: source.type,
                path: source.path,
                sha256: source.hash,
                status: "active",
                visibility: source.visibility,
            }))
                .sort((a, b) => a.sourceId.localeCompare(b.sourceId)),
        };
        entries.push({
            evidenceId: evidence.id,
            evidenceType: evidence.category,
            evidenceArtifactSha256: provenance.evidenceArtifactSha256,
            reviewArtifactSha256: provenance.reviewArtifactSha256,
            supportingClaimIds: provenance.supportingClaimIds,
            active: true,
            reviewed: true,
            provenance,
        });
    }
    entries.sort((a, b) => a.evidenceId.localeCompare(b.evidenceId));
    const eligibleEvidenceSetSha256 = hashText(stableJson(entries.map((entry) => ({
        evidenceId: entry.evidenceId,
        evidenceArtifactSha256: entry.evidenceArtifactSha256,
        reviewArtifactSha256: entry.reviewArtifactSha256,
        active: entry.active,
        reviewed: entry.reviewed,
    }))));
    const timestamp = (now ?? (() => new Date()))().toISOString();
    return EvidenceSnapshotSchema.parse({
        schemaVersion: 1,
        policyVersion: EVIDENCE_ELIGIBILITY_POLICY_VERSION,
        sourcesPath: "kb/sources.json",
        sourcesSha256: await hashFile(sourcesPath),
        evidenceItemsPath: "kb/evidence-items.json",
        evidenceItemsSha256: await hashFile(evidencePath),
        claimsPath: "kb/claims.json",
        claimsSha256: await hashFile(claimsPath),
        entries,
        eligibleEvidenceIds: entries.map((entry) => entry.evidenceId),
        eligibleEvidenceSetSha256,
        createdAt: timestamp,
        updatedAt: timestamp,
    });
}
export async function addManualEvidenceMatch(workspace, targetId, input, options = {}) {
    const context = await loadMatchingContext(workspace, targetId, { persistSnapshot: true, now: options.now });
    const expectation = context.eligibleExpectations.find((entry) => entry.id === input.expectationId);
    if (!expectation)
        throw new Error(`Unknown or ineligible expectation ID: ${input.expectationId}`);
    const evidenceIds = uniqueSorted(input.evidenceIds);
    if (evidenceIds.length === 0)
        throw new Error("Manual match requires at least one evidence ID.");
    const entries = evidenceIds.map((id) => context.snapshot.entries.find((entry) => entry.evidenceId === id));
    if (entries.some((entry) => !entry))
        throw new Error("Manual match references unknown or ineligible evidence.");
    const rationale = input.rationale.trim();
    if (!rationale)
        throw new Error("Manual match rationale is required.");
    validateMatchSemantics(input.matchType, input.coverage, input.limitations ?? []);
    const id = manualMatchId(targetId, expectation.id, evidenceIds, input.matchType);
    const match = {
        id,
        expectationId: expectation.id,
        evidenceIds,
        matchType: input.matchType,
        coverage: input.coverage,
        evidenceStrength: input.evidenceStrength,
        temporalRelevance: input.temporalRelevance,
        rationale,
        expectationProvenance: expectationProvenance(context, expectation),
        evidenceProvenance: entries.map((entry) => entry.provenance),
        trustState: "manual-approved",
        interpretation: {
            method: "manual",
            matcherName: EVIDENCE_MATCHER_NAME,
            matcherVersion: EVIDENCE_MATCHER_VERSION,
            policyVersion: EVIDENCE_MATCHING_POLICY_VERSION,
        },
        matchConfidence: input.matchConfidence,
        limitations: uniqueSorted(input.limitations ?? []),
        notes: uniqueSorted(input.notes ?? []),
    };
    const paths = matchingPaths(workspace, context.target);
    const stored = await loadManualStore(paths.manualPath, context);
    if (stored.matches.some((entry) => entry.id === id))
        throw new Error(`Duplicate manual match: ${id}`);
    const now = (options.now ?? (() => new Date()))().toISOString();
    const updated = ManualEvidenceMatchingSchema.parse({
        ...stored,
        matches: [...stored.matches, match].sort((a, b) => a.id.localeCompare(b.id)),
        tombstones: stored.tombstones.filter((entry) => entry.matchId !== id),
        updatedAt: now,
    });
    await writeManualStore(paths, updated, context);
    await consolidateManualChange(workspace, context, updated, options.now);
    return {
        match,
        result: "created",
        manualPath: paths.manualRelativePath,
        manualManifestPath: paths.manualManifestRelativePath,
        approvedPath: paths.approvedRelativePath,
    };
}
export async function removeManualEvidenceMatch(workspace, matchId, options = {}) {
    const located = await locateManualMatch(workspace, matchId);
    const context = await loadMatchingContext(workspace, located.store.targetId, { persistSnapshot: true, now: options.now });
    const now = (options.now ?? (() => new Date()))().toISOString();
    const updated = ManualEvidenceMatchingSchema.parse({
        ...located.store,
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        eligibleEvidenceSetSha256: context.snapshot.eligibleEvidenceSetSha256,
        matches: located.store.matches.filter((entry) => entry.id !== matchId),
        tombstones: [
            ...located.store.tombstones.filter((entry) => entry.matchId !== matchId),
            { matchId, removedAt: now, ...(options.reason?.trim() ? { reason: options.reason.trim() } : {}) },
        ].sort((a, b) => a.matchId.localeCompare(b.matchId)),
        updatedAt: now,
    });
    const paths = matchingPaths(workspace, context.target);
    await writeManualStore(paths, updated, context);
    await consolidateManualChange(workspace, context, updated, options.now);
}
export async function listManualEvidenceMatches(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const paths = matchingPaths(workspace, target);
    if (!(await pathExists(paths.manualPath)))
        return [];
    return ManualEvidenceMatchingSchema.parse(await readJson(paths.manualPath, null)).matches;
}
export async function showManualEvidenceMatch(workspace, matchId) {
    return (await locateManualMatch(workspace, matchId)).match;
}
export async function showApprovedEvidenceMatching(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const paths = matchingPaths(workspace, target);
    if (!(await pathExists(paths.approvedPath)))
        throw new Error(`Approved evidence matching not found: ${targetId}`);
    return TargetEvidenceMatchingSchema.parse(await readJson(paths.approvedPath, null));
}
export async function getApprovedEvidenceMatchingStatus(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const paths = matchingPaths(workspace, target);
    const matchingExists = await pathExists(paths.approvedPath);
    const manifestExists = await pathExists(paths.approvedManifestPath);
    const base = {
        targetId,
        targetType: target.type,
        matchingExists,
        manifestExists,
        matchingPath: paths.approvedRelativePath,
        manifestPath: paths.approvedManifestRelativePath,
    };
    if (!matchingExists && !manifestExists)
        return emptyMatchingStatus(base, "missing", ["No approved evidence matching exists."]);
    if (!matchingExists || !manifestExists)
        return emptyMatchingStatus(base, "invalid", ["Approved matching artifact set is incomplete."]);
    let matching;
    let manifest;
    try {
        matching = TargetEvidenceMatchingSchema.parse(await readJson(paths.approvedPath, null));
        manifest = MatchingManifestSchema.parse(await readJson(paths.approvedManifestPath, null));
    }
    catch (error) {
        return emptyMatchingStatus(base, "invalid", [`Approved matching is malformed: ${errorMessage(error)}`]);
    }
    const matchingHashMatches = (await hashFile(paths.approvedPath)) === manifest.matchingSha256;
    const invalidReasons = [];
    if (!matchingHashMatches)
        invalidReasons.push("Approved matching SHA-256 does not match its manifest.");
    if (matching.targetId !== target.id || manifest.targetId !== target.id || matching.targetType !== target.type || manifest.targetType !== target.type) {
        invalidReasons.push("Approved matching target identity is invalid.");
    }
    if (manifest.matchingPath !== paths.approvedRelativePath)
        invalidReasons.push("Approved matching path disagrees with the manifest.");
    if (matching.approvedInterpretation.sha256 !== manifest.approvedInterpretationSha256 ||
        matching.approvedInterpretation.manifestSha256 !== manifest.approvedInterpretationManifestSha256)
        invalidReasons.push("Embedded approved-interpretation provenance disagrees with the matching manifest.");
    if (matching.evidenceSnapshot.manifestSha256 !== manifest.evidenceSnapshotManifestSha256 ||
        matching.evidenceSnapshot.eligibleEvidenceSetSha256 !== manifest.eligibleEvidenceSetSha256)
        invalidReasons.push("Embedded evidence-snapshot provenance disagrees with the matching manifest.");
    if (new Set(matching.matches.map((entry) => entry.id)).size !== matching.matches.length)
        invalidReasons.push("Approved matching contains duplicate match IDs.");
    const expectationIds = new Set(matching.expectationCoverage.map((entry) => entry.expectationId));
    if (expectationIds.size !== matching.expectationCoverage.length)
        invalidReasons.push("Approved matching contains duplicate coverage expectations.");
    if (matching.matches.some((entry) => !expectationIds.has(entry.expectationId)))
        invalidReasons.push("A match references an unknown approved coverage expectation.");
    if (invalidReasons.length > 0) {
        return {
            ...emptyMatchingStatus(base, "invalid", invalidReasons),
            matchingHashMatches,
        };
    }
    let context;
    try {
        context = await loadMatchingContext(workspace, targetId, { persistSnapshot: false });
    }
    catch (error) {
        return {
            ...emptyMatchingStatus(base, "stale", [`Current matching dependencies are unavailable: ${errorMessage(error)}`]),
            matchingHashMatches,
        };
    }
    const targetHashMatches = context.targetSha256 === manifest.targetSha256;
    const approvedInterpretationHashMatches = context.approvedInterpretationSha256 === manifest.approvedInterpretationSha256;
    const approvedInterpretationManifestHashMatches = context.approvedInterpretationManifestSha256 === manifest.approvedInterpretationManifestSha256;
    const eligibleEvidenceSetHashMatches = context.snapshot.eligibleEvidenceSetSha256 === manifest.eligibleEvidenceSetSha256;
    const snapshotManifest = await storedSnapshotManifest(paths);
    const evidenceSnapshotManifestHashMatches = Boolean(snapshotManifest &&
        (await hashFile(paths.snapshotManifestPath)) === manifest.evidenceSnapshotManifestSha256 &&
        snapshotManifest.eligibleEvidenceSetSha256 === context.snapshot.eligibleEvidenceSetSha256);
    const manualStoreHashMatches = manifest.manualStoreSha256
        ? (await pathExists(paths.manualPath)) && (await hashFile(paths.manualPath)) === manifest.manualStoreSha256
        : null;
    const policyVersionMatches = manifest.policyVersion === EVIDENCE_MATCHING_POLICY_VERSION;
    const provenanceReasons = [];
    const currentExpectationById = new Map(context.eligibleExpectations.map((expectation) => [expectation.id, expectation]));
    const currentEvidenceById = new Map(context.snapshot.entries.map((entry) => [entry.evidenceId, entry]));
    if (matching.expectationCoverage.length !== currentExpectationById.size ||
        matching.expectationCoverage.some((coverage) => !currentExpectationById.has(coverage.expectationId)))
        provenanceReasons.push("Coverage records do not exactly match current eligible expectations.");
    for (const match of matching.matches) {
        const expectation = currentExpectationById.get(match.expectationId);
        if (!expectation) {
            provenanceReasons.push(`Match references an ineligible expectation: ${match.expectationId}`);
            continue;
        }
        if (stableJson(match.expectationProvenance) !== stableJson(expectationProvenance(context, expectation))) {
            provenanceReasons.push(`Match has broken expectation provenance: ${match.id}`);
        }
        if (new Set(match.evidenceIds).size !== match.evidenceIds.length ||
            new Set(match.evidenceProvenance.map((entry) => entry.evidenceId)).size !== match.evidenceProvenance.length ||
            match.evidenceIds.length !== match.evidenceProvenance.length)
            provenanceReasons.push(`Match has duplicate or incomplete evidence provenance: ${match.id}`);
        for (const evidenceId of match.evidenceIds) {
            const current = currentEvidenceById.get(evidenceId);
            const stored = match.evidenceProvenance.find((entry) => entry.evidenceId === evidenceId);
            if (!current || !stored || stableJson(stored) !== stableJson(current.provenance)) {
                provenanceReasons.push(`Match has broken evidence provenance: ${match.id}/${evidenceId}`);
            }
        }
    }
    const dependenciesStillMatch = approvedInterpretationHashMatches &&
        approvedInterpretationManifestHashMatches &&
        evidenceSnapshotManifestHashMatches &&
        eligibleEvidenceSetHashMatches;
    if (dependenciesStillMatch && provenanceReasons.length > 0) {
        return {
            ...base,
            matchingHashMatches,
            targetHashMatches,
            approvedInterpretationHashMatches,
            approvedInterpretationManifestHashMatches,
            evidenceSnapshotManifestHashMatches,
            eligibleEvidenceSetHashMatches,
            manualStoreHashMatches,
            policyVersionMatches,
            status: "invalid",
            reasons: uniqueSorted(provenanceReasons),
        };
    }
    const proposalDependencyMatches = manifest.proposalId && manifest.proposalSha256
        ? await dependencyHashMatches(paths.root, "proposals", manifest.proposalId, "proposal.json", manifest.proposalSha256, workspace)
        : null;
    const reviewDependencyMatches = manifest.proposalId && manifest.reviewSha256
        ? await dependencyHashMatches(paths.root, "reviews", manifest.proposalId, "review.json", manifest.reviewSha256, workspace)
        : null;
    const staleReasons = [
        ...(!targetHashMatches ? ["Target hash changed."] : []),
        ...(!approvedInterpretationHashMatches ? ["Approved interpretation hash changed."] : []),
        ...(!approvedInterpretationManifestHashMatches ? ["Approved interpretation manifest changed."] : []),
        ...(!evidenceSnapshotManifestHashMatches ? ["Evidence snapshot manifest is missing or stale."] : []),
        ...(!eligibleEvidenceSetHashMatches ? ["Eligible evidence set changed."] : []),
        ...(manualStoreHashMatches === false ? ["Manual match store changed."] : []),
        ...(proposalDependencyMatches === false ? ["Reviewed match proposal changed or is missing."] : []),
        ...(reviewDependencyMatches === false ? ["Match proposal review changed or is missing."] : []),
        ...(!policyVersionMatches ? ["Matching policy version changed."] : []),
    ];
    return {
        ...base,
        matchingHashMatches,
        targetHashMatches,
        approvedInterpretationHashMatches,
        approvedInterpretationManifestHashMatches,
        evidenceSnapshotManifestHashMatches,
        eligibleEvidenceSetHashMatches,
        manualStoreHashMatches,
        policyVersionMatches,
        status: staleReasons.length > 0 ? "stale" : "current",
        reasons: staleReasons,
    };
}
async function dependencyHashMatches(matchingRoot, directory, proposalId, fileName, expectedSha256, workspace) {
    const filePath = resolveWithin(workspace, `${matchingRoot}/${directory}/${proposalId}/${fileName}`);
    return (await pathExists(filePath)) && (await hashFile(filePath)) === expectedSha256;
}
export function expectationProvenance(context, expectation) {
    return {
        targetId: context.target.id,
        approvedInterpretationPath: context.approvedInterpretationPath,
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        expectationId: expectation.id,
        expectationTrustState: expectation.trustState,
        sourceAnalysisItemIds: expectation.sourceAnalysisItemIds,
        sourceReferences: expectation.sourceReferences,
        ...(expectation.approvalProvenance ? { approvalProvenance: expectation.approvalProvenance } : {}),
    };
}
export function deriveCoverage(targetId, expectations, approvedMatches, explicitStatuses = new Map(), proposedMatchIds = new Map()) {
    return expectations.map((expectation) => {
        const matches = approvedMatches.filter((match) => match.expectationId === expectation.id);
        const explicit = explicitStatuses.get(expectation.id);
        let status;
        if (explicit === "unsupported" || explicit === "not-assessed")
            status = explicit;
        else if (matches.some((match) => match.matchType === "contradictory" || match.coverage === "conflicting"))
            status = "conflicting";
        else if (matches.some((match) => match.matchType === "direct" && match.coverage === "full"))
            status = "matched";
        else if (matches.length > 0)
            status = "partially-matched";
        else
            status = explicit ?? "not-assessed";
        const blockingReasons = status === "unsupported"
            ? ["Eligible reviewed evidence was assessed and no defensible support was approved."]
            : status === "not-assessed"
                ? ["No completed matching decision exists for this expectation."]
                : [];
        return {
            id: coverageId(targetId, expectation.id),
            expectationId: expectation.id,
            status,
            approvedMatchIds: matches.map((match) => match.id).sort(),
            proposedMatchIds: uniqueSorted(proposedMatchIds.get(expectation.id) ?? []),
            blockingReasons,
            notes: [],
        };
    }).sort((a, b) => a.id.localeCompare(b.id));
}
export function matchingCompleteness(coverage) {
    const assessed = coverage.filter((entry) => entry.status !== "not-assessed").length;
    const total = coverage.length;
    const status = assessed === 0 ? "empty" : assessed === total ? "complete" : "partial";
    return {
        status,
        assessedExpectationCount: assessed,
        totalEligibleExpectationCount: total,
        usableForFitAssessment: total > 0 && assessed === total,
        blockingReasons: total === 0
            ? ["No eligible approved target expectations exist."]
            : assessed < total
                ? [`${total - assessed} eligible expectation(s) remain not assessed.`]
                : [],
    };
}
export function matchingWarnings(targetId, coverage, eligibleEvidenceCount) {
    const warnings = [];
    if (eligibleEvidenceCount === 0)
        warnings.push(warning(targetId, "NO_ELIGIBLE_EVIDENCE", "No globally reviewed, active, public evidence is eligible for matching."));
    if (coverage.length === 0)
        warnings.push(warning(targetId, "NO_ELIGIBLE_EXPECTATIONS", "No approved expectations are eligible for matching."));
    for (const record of coverage) {
        if (record.status === "not-assessed")
            warnings.push(warning(targetId, "EXPECTATION_NOT_ASSESSED", "No completed matching decision exists.", record.expectationId));
        if (record.status === "unsupported")
            warnings.push(warning(targetId, "EXPECTATION_UNSUPPORTED", "Reviewed evidence did not provide approved support.", record.expectationId));
        if (record.status === "conflicting")
            warnings.push(warning(targetId, "CONFLICTING_EVIDENCE_FOUND", "Approved contradictory evidence is present.", record.expectationId));
    }
    return warnings.sort((a, b) => a.id.localeCompare(b.id));
}
export function manualMatchId(targetId, expectationId, evidenceIds, matchType) {
    return `match_${hashText([targetId, expectationId, [...evidenceIds].sort().join(","), matchType, EVIDENCE_MATCHING_POLICY_VERSION].join("\u0000")).slice(0, 14)}`;
}
export function coverageId(targetId, expectationId) {
    return `coverage_${hashText([targetId, expectationId, EVIDENCE_MATCHING_POLICY_VERSION].join("\u0000")).slice(0, 14)}`;
}
export function formatManualMatchResult(result) {
    return [
        `Match ID: ${result.match.id}`,
        `Expectation ID: ${result.match.expectationId}`,
        `Evidence IDs: ${result.match.evidenceIds.join(", ")}`,
        `Trust state: ${result.match.trustState}`,
        `Manual store: ${result.manualPath}`,
        `Manual manifest: ${result.manualManifestPath}`,
        `Approved matching: ${result.approvedPath}`,
    ].join("\n");
}
export function formatManualMatchList(matches) {
    if (matches.length === 0)
        return "Manual matches: none";
    return ["Manual matches:", ...matches.map((match) => `${match.id} | ${match.expectationId} | ${match.matchType} | ${match.evidenceIds.join(",")}`)].join("\n");
}
export function formatApprovedMatchingStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Matching hash matches: ${check(status.matchingHashMatches)}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Approved interpretation hash matches: ${check(status.approvedInterpretationHashMatches)}`,
        `Approved interpretation manifest matches: ${check(status.approvedInterpretationManifestHashMatches)}`,
        `Evidence snapshot manifest matches: ${check(status.evidenceSnapshotManifestHashMatches)}`,
        `Eligible evidence set matches: ${check(status.eligibleEvidenceSetHashMatches)}`,
        `Manual store matches: ${check(status.manualStoreHashMatches)}`,
        `Policy version matches: ${check(status.policyVersionMatches)}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
export async function writeApprovedMatching(workspace, context, matches, explicitCoverage, dependencies, options = {}) {
    const paths = matchingPaths(workspace, context.target);
    const currentStatus = await getApprovedEvidenceMatchingStatus(workspace, context.target.id);
    if (currentStatus.status === "current" && await pathExists(paths.approvedManifestPath)) {
        const currentManifest = MatchingManifestSchema.parse(await readJson(paths.approvedManifestPath, null));
        if (currentManifest.proposalId === dependencies.proposalId &&
            currentManifest.proposalSha256 === dependencies.proposalSha256 &&
            currentManifest.reviewSha256 === dependencies.reviewSha256 &&
            currentManifest.manualStoreSha256 === dependencies.manualStoreSha256) {
            return {
                matching: await showApprovedEvidenceMatching(workspace, context.target.id),
                manifest: currentManifest,
                result: "already-current",
            };
        }
    }
    if (["stale", "invalid"].includes(currentStatus.status) && !options.rebuild) {
        throw new Error(`Approved matching is ${currentStatus.status}; use explicit --rebuild after reviewing dependency changes.`);
    }
    const deduplicated = deduplicateMatches(matches);
    const coverage = deriveCoverage(context.target.id, context.eligibleExpectations, deduplicated, explicitCoverage, options.proposedMatchIds);
    const completeness = matchingCompleteness(coverage);
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.approvedPath)) {
        try {
            createdAt = (await showApprovedEvidenceMatching(workspace, context.target.id)).createdAt;
        }
        catch { /* explicit rebuild recovers when possible */ }
    }
    const matching = TargetEvidenceMatchingSchema.parse({
        schemaVersion: 1,
        targetId: context.target.id,
        targetType: context.target.type,
        approvedInterpretation: {
            path: context.approvedInterpretationPath,
            sha256: context.approvedInterpretationSha256,
            manifestPath: context.approvedInterpretationManifestPath,
            manifestSha256: context.approvedInterpretationManifestSha256,
        },
        evidenceSnapshot: {
            manifestPath: context.snapshotManifestPath,
            manifestSha256: context.snapshotManifestSha256,
            eligibleEvidenceIds: context.snapshot.eligibleEvidenceIds,
            eligibleEvidenceSetSha256: context.snapshot.eligibleEvidenceSetSha256,
        },
        matches: deduplicated,
        expectationCoverage: coverage,
        warnings: matchingWarnings(context.target.id, coverage, context.snapshot.entries.length),
        ambiguities: [],
        completeness,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.approvedPath, matching);
    const manifest = MatchingManifestSchema.parse({
        schemaVersion: 1,
        targetId: context.target.id,
        targetType: context.target.type,
        matchingPath: paths.approvedRelativePath,
        matchingSha256: await hashFile(paths.approvedPath),
        matcherName: EVIDENCE_MATCHER_NAME,
        matcherVersion: EVIDENCE_MATCHER_VERSION,
        policyVersion: EVIDENCE_MATCHING_POLICY_VERSION,
        targetSha256: context.targetSha256,
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        approvedInterpretationManifestSha256: context.approvedInterpretationManifestSha256,
        evidenceSnapshotManifestSha256: context.snapshotManifestSha256,
        eligibleEvidenceSetSha256: context.snapshot.eligibleEvidenceSetSha256,
        ...dependencies,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.approvedManifestPath, manifest);
    return { matching, manifest, result: currentStatus.status === "missing" ? "created" : "rebuilt" };
}
function isReviewedClaim(claim) {
    return claim.approvalStatus === "approved" &&
        claim.outputReadiness === "resume_ready" &&
        claim.publicSafe &&
        !claim.needsConfirmation;
}
async function persistEvidenceSnapshot(workspace, target, calculated, nowProvider, rebuild = false) {
    const paths = matchingPaths(workspace, target);
    if (await pathExists(paths.snapshotPath) && await pathExists(paths.snapshotManifestPath)) {
        try {
            const stored = EvidenceSnapshotSchema.parse(await readJson(paths.snapshotPath, null));
            const manifest = EvidenceSnapshotManifestSchema.parse(await readJson(paths.snapshotManifestPath, null));
            if (stored.sourcesSha256 === calculated.sourcesSha256 &&
                stored.evidenceItemsSha256 === calculated.evidenceItemsSha256 &&
                stored.claimsSha256 === calculated.claimsSha256 &&
                stored.eligibleEvidenceSetSha256 === calculated.eligibleEvidenceSetSha256 &&
                (await hashFile(paths.snapshotPath)) === manifest.snapshotSha256)
                return { snapshot: stored, manifest };
        }
        catch {
            if (!rebuild)
                throw new Error("Stored evidence snapshot is invalid and was not overwritten; use an explicit rebuild path.");
        }
    }
    const now = (nowProvider ?? (() => new Date()))().toISOString();
    const snapshot = EvidenceSnapshotSchema.parse({ ...calculated, createdAt: now, updatedAt: now });
    await writeJsonAtomic(paths.snapshotPath, snapshot);
    const manifest = EvidenceSnapshotManifestSchema.parse({
        schemaVersion: 1,
        snapshotPath: paths.snapshotRelativePath,
        snapshotSha256: await hashFile(paths.snapshotPath),
        policyVersion: snapshot.policyVersion,
        sourcesSha256: snapshot.sourcesSha256,
        evidenceItemsSha256: snapshot.evidenceItemsSha256,
        claimsSha256: snapshot.claimsSha256,
        eligibleEvidenceSetSha256: snapshot.eligibleEvidenceSetSha256,
        createdAt: now,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.snapshotManifestPath, manifest);
    return { snapshot, manifest };
}
async function loadManualStore(filePath, context) {
    if (!(await pathExists(filePath))) {
        const now = new Date().toISOString();
        return ManualEvidenceMatchingSchema.parse({
            schemaVersion: 1,
            targetId: context.target.id,
            targetType: context.target.type,
            approvedInterpretationSha256: context.approvedInterpretationSha256,
            eligibleEvidenceSetSha256: context.snapshot.eligibleEvidenceSetSha256,
            matches: [],
            tombstones: [],
            createdAt: now,
            updatedAt: now,
        });
    }
    const stored = ManualEvidenceMatchingSchema.parse(await readJson(filePath, null));
    if (stored.targetId !== context.target.id || stored.targetType !== context.target.type)
        throw new Error("Manual matching target identity is invalid.");
    if (stored.approvedInterpretationSha256 !== context.approvedInterpretationSha256 ||
        stored.eligibleEvidenceSetSha256 !== context.snapshot.eligibleEvidenceSetSha256)
        throw new Error("Manual matching dependencies changed; review and rebuild before adding matches.");
    return stored;
}
async function writeManualStore(paths, store, context) {
    await writeJsonAtomic(paths.manualPath, store);
    const manifest = ManualMatchingManifestSchema.parse({
        schemaVersion: 1,
        targetId: store.targetId,
        targetType: store.targetType,
        matchingPath: paths.manualRelativePath,
        matchingSha256: await hashFile(paths.manualPath),
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        eligibleEvidenceSetSha256: context.snapshot.eligibleEvidenceSetSha256,
        policyVersion: EVIDENCE_MATCHING_POLICY_VERSION,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
    });
    await writeJsonAtomic(paths.manualManifestPath, manifest);
    return manifest;
}
async function consolidateManualChange(workspace, context, manual, now) {
    const paths = matchingPaths(workspace, context.target);
    let existingHuman = [];
    let explicit = new Map();
    let reviewedDependencies = {};
    let proposedMatchIds = new Map();
    const status = await getApprovedEvidenceMatchingStatus(workspace, context.target.id);
    const expectedManualStoreChange = status.status === "stale" &&
        status.reasons.length === 1 &&
        status.reasons[0] === "Manual match store changed.";
    if (status.status === "current" || expectedManualStoreChange) {
        const existing = await showApprovedEvidenceMatching(workspace, context.target.id);
        existingHuman = existing.matches.filter((match) => match.trustState !== "manual-approved");
        const existingManifest = MatchingManifestSchema.parse(await readJson(paths.approvedManifestPath, null));
        reviewedDependencies = {
            ...(existingManifest.proposalId ? { proposalId: existingManifest.proposalId } : {}),
            ...(existingManifest.proposalSha256 ? { proposalSha256: existingManifest.proposalSha256 } : {}),
            ...(existingManifest.reviewSha256 ? { reviewSha256: existingManifest.reviewSha256 } : {}),
        };
        explicit = new Map(existing.expectationCoverage
            .filter((entry) => ["unsupported", "not-assessed"].includes(entry.status))
            .map((entry) => [entry.expectationId, entry.status]));
        proposedMatchIds = new Map(existing.expectationCoverage.map((entry) => [entry.expectationId, entry.proposedMatchIds]));
    }
    else if (status.status !== "missing") {
        throw new Error(`Existing approved matching is ${status.status}; manual changes cannot silently replace it.`);
    }
    await writeApprovedMatching(workspace, context, [...manual.matches, ...existingHuman], explicit, { ...reviewedDependencies, manualStoreSha256: await hashFile(paths.manualPath) }, { rebuild: status.status !== "missing", now, proposedMatchIds });
}
async function locateManualMatch(workspace, matchId) {
    const files = (await walkFiles(path.join(workspace, "targets"))).filter((file) => path.basename(file) === MANUAL_FILE && path.basename(path.dirname(file)) === "manual");
    const found = [];
    for (const file of files) {
        const store = ManualEvidenceMatchingSchema.parse(await readJson(file, null));
        const match = store.matches.find((entry) => entry.id === matchId);
        if (match)
            found.push({ match, store });
    }
    if (found.length === 0)
        throw new Error(`Manual match not found: ${matchId}`);
    if (found.length > 1)
        throw new Error(`Manual match ID is ambiguous: ${matchId}`);
    return found[0];
}
function validateMatchSemantics(matchType, coverage, limitations) {
    if (matchType === "contradictory" && coverage !== "conflicting")
        throw new Error("Contradictory matches require conflicting coverage.");
    if (matchType !== "contradictory" && coverage === "conflicting")
        throw new Error("Conflicting coverage requires a contradictory match.");
    if (["supporting", "partial", "contradictory"].includes(matchType) && limitations.length === 0) {
        throw new Error(`${matchType} matches require at least one explicit limitation.`);
    }
}
function deduplicateMatches(matches) {
    const byIdentity = new Map();
    for (const match of matches) {
        const identity = [match.expectationId, [...match.evidenceIds].sort().join(","), match.matchType, EVIDENCE_MATCHING_POLICY_VERSION].join("|");
        const existing = byIdentity.get(identity);
        if (!existing || trustRank(match.trustState) > trustRank(existing.trustState))
            byIdentity.set(identity, match);
    }
    return [...byIdentity.values()].sort((a, b) => a.id.localeCompare(b.id));
}
function trustRank(value) {
    // Manual links are explicitly human-authored and cannot be silently
    // replaced by an equivalent model-originated match during consolidation.
    return value === "manual-approved" ? 4 : value === "human-edited" ? 3 : 2;
}
function warning(targetId, code, message, expectationId) {
    return {
        id: `matching-warning_${hashText([targetId, code, expectationId ?? ""].join("\u0000")).slice(0, 12)}`,
        code,
        message,
        ...(expectationId ? { expectationId } : {}),
        evidenceIds: [],
    };
}
function matchingPaths(workspace, target) {
    const root = `targets/${target.type === "role" ? "roles" : "jobs"}/${target.id}/matching`;
    const snapshotRelativePath = `${root}/${SNAPSHOT_FILE}`;
    const snapshotManifestRelativePath = `${root}/${SNAPSHOT_MANIFEST_FILE}`;
    const manualRelativePath = `${root}/manual/${MANUAL_FILE}`;
    const manualManifestRelativePath = `${root}/manual/${MANUAL_MANIFEST_FILE}`;
    const approvedRelativePath = `${root}/approved/${APPROVED_FILE}`;
    const approvedManifestRelativePath = `${root}/approved/${APPROVED_MANIFEST_FILE}`;
    return {
        root,
        snapshotRelativePath,
        snapshotPath: resolveWithin(workspace, snapshotRelativePath),
        snapshotManifestRelativePath,
        snapshotManifestPath: resolveWithin(workspace, snapshotManifestRelativePath),
        manualRelativePath,
        manualPath: resolveWithin(workspace, manualRelativePath),
        manualManifestRelativePath,
        manualManifestPath: resolveWithin(workspace, manualManifestRelativePath),
        approvedRelativePath,
        approvedPath: resolveWithin(workspace, approvedRelativePath),
        approvedManifestRelativePath,
        approvedManifestPath: resolveWithin(workspace, approvedManifestRelativePath),
    };
}
function resolveWithin(workspace, relativePath) {
    const resolved = path.resolve(workspace, relativePath);
    const relation = path.relative(path.resolve(workspace), resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation))
        throw new Error(`Matching path escapes workspace: ${relativePath}`);
    return resolved;
}
async function storedSnapshotManifest(paths) {
    if (!(await pathExists(paths.snapshotManifestPath)))
        return undefined;
    try {
        return EvidenceSnapshotManifestSchema.parse(await readJson(paths.snapshotManifestPath, null));
    }
    catch {
        return undefined;
    }
}
function emptyMatchingStatus(base, status, reasons) {
    return {
        ...base,
        matchingHashMatches: null,
        targetHashMatches: null,
        approvedInterpretationHashMatches: null,
        approvedInterpretationManifestHashMatches: null,
        evidenceSnapshotManifestHashMatches: null,
        eligibleEvidenceSetHashMatches: null,
        manualStoreHashMatches: null,
        policyVersionMatches: null,
        status,
        reasons,
    };
}
function hashSerialized(value) {
    return hashText(`${JSON.stringify(value, null, 2)}\n`);
}
function assertUnique(values, label) {
    if (new Set(values).size !== values.length)
        throw new Error(`Reviewed evidence contains duplicate ${label} IDs.`);
}
function uniqueSorted(values) {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
