import path from "node:path";
import { hashFile, hashText, pathExists, readJson, uniqueSorted, writeJsonAtomic, } from "./fs-utils.js";
import { RoleResumeDraftScaffoldManifestSchema, RoleResumeDraftScaffoldSchema, } from "./role-resume-draft-schemas.js";
import { RoleResumePlanManifestSchema, } from "./role-resume-plan-schemas.js";
import { assertRoleResumePlanConsistency, getRoleResumePlanStatus, loadRoleResumePlanningContext, showRoleResumePlan, } from "./role-resume-planning.js";
import { stableJson } from "./target-proposal.js";
export const ROLE_RESUME_DRAFTING_POLICY_NAME = "role-resume-drafting-policy";
export const ROLE_RESUME_DRAFTING_POLICY_VERSION = "1";
export async function loadRoleResumeDraftingContext(workspace, targetId) {
    const base = await loadRoleResumePlanningContext(workspace, targetId);
    const approvedPlanStatus = await getRoleResumePlanStatus(workspace, targetId, "approved");
    if (approvedPlanStatus.status !== "current") {
        throw new Error(`Approved Role Resume Content Plan must be current before drafting. Current status: ${approvedPlanStatus.status}`);
    }
    const approvedPlan = await showRoleResumePlan(workspace, targetId, "approved");
    if (approvedPlan.targetType !== "role" || approvedPlan.mode !== "market-positioning") {
        throw new Error("Role resume drafting accepts approved Role plans in market-positioning mode only.");
    }
    if (approvedPlan.completeness.status !== "complete" || !approvedPlan.completeness.usableForResumeDrafting) {
        throw new Error("Approved Role Resume Content Plan must be complete and usable for drafting.");
    }
    assertRoleResumePlanConsistency(approvedPlan, base);
    if (approvedPlan.approvedInterpretation.sha256 !== base.approvedInterpretationSha256 ||
        approvedPlan.approvedMatching.sha256 !== base.approvedMatchingSha256 ||
        approvedPlan.approvedAssessment.sha256 !== base.approvedAssessmentSha256) {
        throw new Error("Approved plan dependencies do not match current interpretation, matching, or assessment.");
    }
    const approvedPlanPath = approvedPlanStatus.planPath;
    const approvedPlanManifestPath = approvedPlanStatus.manifestPath;
    const manifest = RoleResumePlanManifestSchema.parse(await readJson(resolveWithin(workspace, approvedPlanManifestPath), null));
    if (manifest.planId !== approvedPlan.id || manifest.planSha256 !== await hashFile(resolveWithin(workspace, approvedPlanPath))) {
        throw new Error("Approved plan manifest does not match the approved plan.");
    }
    return {
        ...base,
        approvedPlan,
        approvedPlanPath,
        approvedPlanSha256: manifest.planSha256,
        approvedPlanManifestPath,
        approvedPlanManifestSha256: await hashFile(resolveWithin(workspace, approvedPlanManifestPath)),
    };
}
export async function buildRoleResumeDraftScaffold(workspace, targetId, options = {}) {
    const context = await loadRoleResumeDraftingContext(workspace, targetId);
    const paths = roleResumeDraftScaffoldPaths(workspace, targetId);
    const status = await getRoleResumeDraftScaffoldStatus(workspace, targetId);
    if (status.status === "current") {
        return scaffoldResult(await showRoleResumeDraftScaffold(workspace, targetId), paths, "already-current");
    }
    if (["stale", "invalid"].includes(status.status) && !options.rebuild) {
        throw new Error(`Role resume draft scaffold is ${status.status}; use explicit --rebuild after reviewing dependency changes.`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.scaffoldPath)) {
        try {
            createdAt = RoleResumeDraftScaffoldSchema.parse(await readJson(paths.scaffoldPath, null)).createdAt;
        }
        catch {
            // Explicit rebuild may replace an invalid scaffold while retaining no unsafe content.
        }
    }
    const scaffold = deriveRoleResumeDraftScaffold(context, createdAt, now);
    assertRoleResumeDraftScaffoldConsistency(scaffold, context);
    await writeJsonAtomic(paths.scaffoldPath, scaffold);
    const manifest = createRoleResumeDraftScaffoldManifest(scaffold, context, paths.scaffoldRelativePath, await hashFile(paths.scaffoldPath), createdAt, now);
    await writeJsonAtomic(paths.manifestPath, manifest);
    return scaffoldResult(scaffold, paths, status.status === "missing" ? "created" : "rebuilt");
}
export function deriveRoleResumeDraftScaffold(context, createdAt, updatedAt) {
    const scaffoldId = deterministicRoleResumeDraftScaffoldId(context);
    const assessmentById = new Map(context.approvedAssessment.expectationAssessments.map((entry) => [entry.id, entry]));
    const boundaryByExpectation = new Map(context.approvedPlan.claimBoundaries
        .filter((entry) => entry.expectationId)
        .map((entry) => [entry.expectationId, entry]));
    const sections = context.approvedPlan.sections
        .slice()
        .sort((a, b) => a.order - b.order || a.type.localeCompare(b.type))
        .map((section) => {
        const positioningThemes = section.type === "headline"
            ? context.approvedPlan.positioning.primaryThemes
            : [];
        const sourceExpectationIds = section.type === "headline"
            ? uniqueSorted(positioningThemes.flatMap((entry) => entry.sourceExpectationIds))
            : section.sourceExpectationIds;
        const sourceAssessmentIds = section.type === "headline"
            ? uniqueSorted(positioningThemes.flatMap((entry) => entry.sourceAssessmentIds))
            : section.sourceAssessmentIds;
        const approvedMatchIds = section.type === "headline"
            ? uniqueSorted(positioningThemes.flatMap((entry) => entry.approvedMatchIds))
            : section.approvedMatchIds;
        const evidenceIds = section.type === "headline"
            ? uniqueSorted(positioningThemes.flatMap((entry) => entry.evidenceIds))
            : section.evidenceIds;
        const boundaries = sourceExpectationIds
            .map((id) => boundaryByExpectation.get(id))
            .filter((entry) => Boolean(entry));
        const maximumItemCount = section.maximumItemCount ?? defaultMaximumItems(section.type);
        return {
            id: `draft-scaffold-section_${hashText([
                scaffoldId,
                section.id,
                section.type,
                ROLE_RESUME_DRAFTING_POLICY_VERSION,
            ].join("\0")).slice(0, 16)}`,
            planSectionId: section.id,
            sectionType: section.type,
            status: section.status,
            order: section.order,
            objective: section.objective,
            allowedExpectationIds: uniqueSorted(sourceExpectationIds),
            allowedAssessmentIds: uniqueSorted(sourceAssessmentIds.filter((id) => assessmentById.has(id))),
            allowedMatchIds: uniqueSorted(approvedMatchIds),
            allowedEvidenceIds: uniqueSorted(evidenceIds),
            allowedClaimBoundaryIds: uniqueSorted(boundaries.map((entry) => entry.id)),
            allowedClaimTypes: typedUnique(section.allowedContentTypes),
            prohibitedClaimTypes: typedUnique(section.prohibitedContentTypes),
            maximumItemCount,
            ...(maximumSentences(section.type) ? { maximumSentenceCount: maximumSentences(section.type) } : {}),
            metricPermission: boundaries.some((entry) => entry.allowedClaimTypes.includes("quantified-outcome"))
                ? "reviewed-only"
                : "prohibited",
            scopePermissions: uniqueSorted(boundaries.flatMap((entry) => [
                ...(entry.allowedScope?.roleScope ?? []),
                ...(entry.allowedScope?.teamScope ?? []),
                ...(entry.allowedScope?.productScope ?? []),
                ...(entry.allowedScope?.technicalScope ?? []),
                ...(entry.allowedScope?.temporalScope ?? []),
            ])),
            cautionNotes: uniqueSorted([
                ...section.cautionNotes,
                ...boundaries.flatMap((entry) => entry.boundaryType === "allowed-with-caution" || entry.boundaryType === "requires-review"
                    ? [entry.rationale]
                    : []),
            ]),
            prohibitedInferences: uniqueSorted(boundaries.flatMap((entry) => entry.prohibitedInferences)),
            requiredQualifiers: uniqueSorted(boundaries.flatMap((entry) => entry.requiredQualifiers)),
            placeholderIds: section.status === "exclude"
                ? []
                : Array.from({ length: maximumItemCount }, (_, index) => `draft-slot_${hashText([
                    scaffoldId,
                    section.id,
                    String(index),
                ].join("\0")).slice(0, 16)}`),
        };
    });
    return RoleResumeDraftScaffoldSchema.parse({
        schemaVersion: 1,
        id: scaffoldId,
        targetId: context.target.id,
        targetType: "role",
        mode: "market-positioning",
        roleTitle: context.target.title,
        approvedInterpretation: context.approvedPlan.approvedInterpretation,
        approvedMatching: context.approvedPlan.approvedMatching,
        approvedAssessment: context.approvedPlan.approvedAssessment,
        approvedPlan: {
            path: context.approvedPlanPath,
            sha256: context.approvedPlanSha256,
            manifestPath: context.approvedPlanManifestPath,
            manifestSha256: context.approvedPlanManifestSha256,
        },
        draftingPolicy: {
            name: ROLE_RESUME_DRAFTING_POLICY_NAME,
            version: ROLE_RESUME_DRAFTING_POLICY_VERSION,
        },
        sections,
        draftingConstraints: [
            constraint(scaffoldId, "APPROVED_PLAN_IS_CONSTRAINT_SYSTEM", "Drafting may not exceed the approved Role Resume Content Plan.", sections, true),
            constraint(scaffoldId, "STATEMENT_PROVENANCE_REQUIRED", "Every substantive statement requires exact claim-to-evidence provenance.", sections, true),
            constraint(scaffoldId, "TARGET_TITLE_IS_POSITIONING_ONLY", "The target role title is positioning context, not employment history.", sections, true),
            constraint(scaffoldId, "PROJECT_SCOPE_MUST_REMAIN_PROJECT_SCOPE", "Project evidence cannot be represented as employment without reviewed evidence.", sections, true),
            constraint(scaffoldId, "RESPONSIBILITY_IS_NOT_ACHIEVEMENT", "Responsibilities require reviewed outcome evidence before being drafted as achievements.", sections, true),
            constraint(scaffoldId, "REVIEWED_METRICS_ONLY", "Quantified wording requires an exact reviewed metric reference.", sections, true),
            constraint(scaffoldId, "NO_JOB_SPECIFIC_CONTENT", "Job descriptions, ATS scores, hiring predictions, and application advice are prohibited.", sections, true),
        ],
        provenance: scaffoldProvenance(context),
        createdAt,
        updatedAt,
    });
}
export async function showRoleResumeDraftScaffold(workspace, targetId) {
    const paths = roleResumeDraftScaffoldPaths(workspace, targetId);
    if (!(await pathExists(paths.scaffoldPath)))
        throw new Error(`Role resume draft scaffold not found: ${targetId}`);
    return RoleResumeDraftScaffoldSchema.parse(await readJson(paths.scaffoldPath, null));
}
export async function getRoleResumeDraftScaffoldStatus(workspace, targetId) {
    const paths = roleResumeDraftScaffoldPaths(workspace, targetId);
    const scaffoldExists = await pathExists(paths.scaffoldPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = {
        targetId,
        scaffoldExists,
        manifestExists,
        scaffoldPath: paths.scaffoldRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!scaffoldExists && !manifestExists)
        return emptyScaffoldStatus(base, "missing", ["No role resume draft scaffold exists."]);
    if (!scaffoldExists || !manifestExists)
        return emptyScaffoldStatus(base, "invalid", ["Scaffold artifact set is incomplete."]);
    let scaffold;
    let manifest;
    try {
        scaffold = RoleResumeDraftScaffoldSchema.parse(await readJson(paths.scaffoldPath, null));
        manifest = RoleResumeDraftScaffoldManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyScaffoldStatus(base, "invalid", [`Stored scaffold is malformed: ${errorMessage(error)}`]);
    }
    const scaffoldHashMatches = await hashFile(paths.scaffoldPath) === manifest.scaffoldSha256;
    if (!scaffoldHashMatches ||
        manifest.scaffoldId !== scaffold.id ||
        manifest.targetId !== targetId ||
        scaffold.targetId !== targetId ||
        manifest.scaffoldPath !== paths.scaffoldRelativePath) {
        return { ...emptyScaffoldStatus(base, "invalid", ["Scaffold hash, identity, or path is invalid."]), scaffoldHashMatches };
    }
    let context;
    try {
        context = await loadRoleResumeDraftingContext(workspace, targetId);
        assertRoleResumeDraftScaffoldConsistency(scaffold, context);
    }
    catch (error) {
        return { ...emptyScaffoldStatus(base, "stale", [`Current drafting dependencies are unavailable: ${errorMessage(error)}`]), scaffoldHashMatches };
    }
    const dependenciesMatch = manifest.targetSha256 === context.targetSha256
        && manifest.approvedInterpretationSha256 === context.approvedInterpretationSha256
        && manifest.approvedInterpretationManifestSha256 === context.approvedInterpretationManifestSha256
        && manifest.approvedMatchingSha256 === context.approvedMatchingSha256
        && manifest.approvedMatchingManifestSha256 === context.approvedMatchingManifestSha256
        && manifest.evidenceSnapshotSha256 === context.evidenceSnapshotSha256
        && manifest.approvedAssessmentSha256 === context.approvedAssessmentSha256
        && manifest.approvedAssessmentManifestSha256 === context.approvedAssessmentManifestSha256
        && manifest.approvedPlanSha256 === context.approvedPlanSha256
        && manifest.approvedPlanManifestSha256 === context.approvedPlanManifestSha256;
    const policyVersionMatches = manifest.policyName === ROLE_RESUME_DRAFTING_POLICY_NAME
        && manifest.policyVersion === ROLE_RESUME_DRAFTING_POLICY_VERSION;
    const reasons = [
        ...(!dependenciesMatch ? ["Approved drafting dependencies changed."] : []),
        ...(!policyVersionMatches ? ["Drafting policy changed."] : []),
    ];
    return {
        ...base,
        scaffoldHashMatches,
        dependenciesMatch,
        policyVersionMatches,
        status: reasons.length ? "stale" : "current",
        reasons,
    };
}
export function assertRoleResumeDraftScaffoldConsistency(scaffold, context) {
    if (scaffold.targetId !== context.target.id || scaffold.targetType !== "role" || scaffold.mode !== "market-positioning") {
        throw new Error("Scaffold target identity or drafting mode is invalid.");
    }
    if (scaffold.roleTitle !== context.target.title)
        throw new Error("Scaffold role title differs from the Role Target.");
    if (scaffold.draftingPolicy.name !== ROLE_RESUME_DRAFTING_POLICY_NAME ||
        scaffold.draftingPolicy.version !== ROLE_RESUME_DRAFTING_POLICY_VERSION)
        throw new Error("Scaffold drafting policy is unsupported.");
    if (scaffold.approvedPlan.sha256 !== context.approvedPlanSha256 ||
        scaffold.approvedInterpretation.sha256 !== context.approvedInterpretationSha256 ||
        scaffold.approvedMatching.sha256 !== context.approvedMatchingSha256 ||
        scaffold.approvedAssessment.sha256 !== context.approvedAssessmentSha256)
        throw new Error("Scaffold does not reference the current approved dependency chain.");
    const planned = context.approvedPlan.sections
        .slice()
        .sort((a, b) => a.order - b.order || a.type.localeCompare(b.type));
    if (scaffold.sections.length !== planned.length)
        throw new Error("Scaffold must preserve every approved-plan section.");
    for (let index = 0; index < planned.length; index += 1) {
        const planSection = planned[index];
        const section = scaffold.sections[index];
        if (section.planSectionId !== planSection.id ||
            section.sectionType !== planSection.type ||
            section.status !== planSection.status ||
            section.order !== planSection.order)
            throw new Error(`Scaffold section does not preserve approved plan structure: ${planSection.id}`);
        const expectedExpectationIds = planSection.type === "headline"
            ? uniqueSorted(context.approvedPlan.positioning.primaryThemes.flatMap((entry) => entry.sourceExpectationIds))
            : planSection.sourceExpectationIds;
        const expectedEvidenceIds = planSection.type === "headline"
            ? uniqueSorted(context.approvedPlan.positioning.primaryThemes.flatMap((entry) => entry.evidenceIds))
            : planSection.evidenceIds;
        if (!sameSet(section.allowedExpectationIds, expectedExpectationIds)) {
            throw new Error(`Scaffold changed selected expectations for ${planSection.id}.`);
        }
        if (!sameSet(section.allowedEvidenceIds, expectedEvidenceIds)) {
            throw new Error(`Scaffold changed selected evidence for ${planSection.id}.`);
        }
        if (section.allowedClaimTypes.some((entry) => !planSection.allowedContentTypes.includes(entry))) {
            throw new Error(`Scaffold expanded allowed claim types for ${planSection.id}.`);
        }
        if (section.prohibitedClaimTypes.some((entry) => !planSection.prohibitedContentTypes.includes(entry))) {
            throw new Error(`Scaffold dropped approved prohibited claim types for ${planSection.id}.`);
        }
        if (section.status === "exclude" && section.placeholderIds.length) {
            throw new Error(`Excluded scaffold section contains draft slots: ${planSection.id}`);
        }
    }
    if (stableJson(scaffold).match(/\b(?:Led|Built|Delivered|Managed|Results-driven)\b[^"]{12,}/)) {
        throw new Error("Deterministic scaffold contains generated resume prose.");
    }
}
export function deterministicRoleResumeDraftScaffoldId(context) {
    return `role-resume-draft-scaffold_${hashText([
        context.target.id,
        context.approvedPlanSha256,
        ROLE_RESUME_DRAFTING_POLICY_VERSION,
    ].join("\0")).slice(0, 16)}`;
}
export function roleResumeDraftScaffoldPaths(workspace, targetId) {
    const root = `targets/roles/${targetId}/resume-drafting/scaffold`;
    const scaffoldRelativePath = `${root}/role-resume-draft-scaffold.json`;
    const manifestRelativePath = `${root}/scaffold-manifest.json`;
    return {
        scaffoldRelativePath,
        scaffoldPath: resolveWithin(workspace, scaffoldRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
export function createRoleResumeDraftScaffoldManifest(scaffold, context, scaffoldPath, scaffoldSha256, createdAt, updatedAt) {
    return RoleResumeDraftScaffoldManifestSchema.parse({
        schemaVersion: 1,
        scaffoldId: scaffold.id,
        targetId: scaffold.targetId,
        scaffoldPath,
        scaffoldSha256,
        policyName: ROLE_RESUME_DRAFTING_POLICY_NAME,
        policyVersion: ROLE_RESUME_DRAFTING_POLICY_VERSION,
        targetSha256: context.targetSha256,
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        approvedInterpretationManifestSha256: context.approvedInterpretationManifestSha256,
        approvedMatchingSha256: context.approvedMatchingSha256,
        approvedMatchingManifestSha256: context.approvedMatchingManifestSha256,
        evidenceSnapshotSha256: context.evidenceSnapshotSha256,
        approvedAssessmentSha256: context.approvedAssessmentSha256,
        approvedAssessmentManifestSha256: context.approvedAssessmentManifestSha256,
        approvedPlanSha256: context.approvedPlanSha256,
        approvedPlanManifestSha256: context.approvedPlanManifestSha256,
        createdAt,
        updatedAt,
    });
}
export function formatBuildRoleResumeDraftScaffoldResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Scaffold ID: ${result.scaffoldId}`,
        `Result: ${result.result}`,
        `Scaffold path: ${result.scaffoldPath}`,
        `Manifest path: ${result.manifestPath}`,
        `Included sections: ${result.includedSectionCount}`,
        `Excluded sections: ${result.excludedSectionCount}`,
        `Draft slots: ${result.placeholderCount}`,
    ].join("\n");
}
export function formatRoleResumeDraftScaffoldStatus(status) {
    return [
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Scaffold hash matches: ${status.scaffoldHashMatches ?? "n/a"}`,
        `Dependencies match: ${status.dependenciesMatch ?? "n/a"}`,
        `Drafting policy matches: ${status.policyVersionMatches ?? "n/a"}`,
        `Scaffold path: ${status.scaffoldPath}`,
        `Manifest path: ${status.manifestPath}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((entry) => `- ${entry}`)] : []),
    ].join("\n");
}
function scaffoldProvenance(context) {
    return {
        targetSha256: context.targetSha256,
        approvedInterpretationSha256: context.approvedInterpretationSha256,
        approvedInterpretationManifestSha256: context.approvedInterpretationManifestSha256,
        approvedMatchingSha256: context.approvedMatchingSha256,
        approvedMatchingManifestSha256: context.approvedMatchingManifestSha256,
        evidenceSnapshotSha256: context.evidenceSnapshotSha256,
        approvedAssessmentSha256: context.approvedAssessmentSha256,
        approvedAssessmentManifestSha256: context.approvedAssessmentManifestSha256,
        approvedPlanSha256: context.approvedPlanSha256,
        approvedPlanManifestSha256: context.approvedPlanManifestSha256,
        expectationSetSha256: context.expectationSetSha256,
        assessmentSetSha256: context.assessmentSetSha256,
        approvedMatchSetSha256: context.approvedMatchSetSha256,
        evidenceSetSha256: context.evidenceSetSha256,
    };
}
function constraint(scaffoldId, code, description, sections, blocking) {
    return {
        id: `draft-constraint_${hashText([scaffoldId, code].join("\0")).slice(0, 16)}`,
        code,
        description,
        sectionIds: sections.map((entry) => entry.id),
        blocking,
    };
}
function defaultMaximumItems(type) {
    return ({
        headline: 1,
        "professional-summary": 1,
        "core-capabilities": 8,
        "selected-impact": 4,
        "professional-experience": 12,
        "selected-projects": 6,
        "technical-capabilities": 10,
        "leadership-capabilities": 6,
        education: 4,
        certifications: 6,
        "additional-information": 4,
    })[type];
}
function maximumSentences(type) {
    return type === "professional-summary" ? 4 : type === "headline" ? 1 : undefined;
}
function sameSet(a, b) {
    return a.length === b.length && [...a].sort().every((entry, index) => entry === [...b].sort()[index]);
}
function typedUnique(values) {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}
function scaffoldResult(scaffold, paths, result) {
    return {
        targetId: scaffold.targetId,
        result,
        scaffoldId: scaffold.id,
        scaffoldPath: paths.scaffoldRelativePath,
        manifestPath: paths.manifestRelativePath,
        includedSectionCount: scaffold.sections.filter((entry) => entry.status !== "exclude").length,
        excludedSectionCount: scaffold.sections.filter((entry) => entry.status === "exclude").length,
        placeholderCount: scaffold.sections.reduce((count, entry) => count + entry.placeholderIds.length, 0),
    };
}
function emptyScaffoldStatus(base, status, reasons) {
    return {
        ...base,
        scaffoldHashMatches: null,
        dependenciesMatch: null,
        policyVersionMatches: null,
        status,
        reasons,
    };
}
function resolveWithin(workspace, relativePath) {
    const absolute = path.resolve(workspace, relativePath);
    const root = path.resolve(workspace);
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`))
        throw new Error("Resolved path leaves workspace.");
    return absolute;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
