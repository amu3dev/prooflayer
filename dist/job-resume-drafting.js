import path from "node:path";
import { hashFile, hashText, pathExists, readJson, uniqueSorted, writeJsonAtomic, } from "./fs-utils.js";
import { JobResumeDraftScaffoldManifestSchema, JobResumeDraftScaffoldSchema, } from "./job-resume-draft-schemas.js";
import { JobResumeContentPlanManifestSchema, } from "./job-resume-plan-schemas.js";
import { getJobResumePlanStatus, loadJobResumePlanningContext, showJobResumePlan, } from "./job-resume-planning.js";
import { stableJson } from "./target-proposal.js";
export const JOB_RESUME_DRAFTING_POLICY_NAME = "job-resume-drafting-policy";
export const JOB_RESUME_DRAFTING_POLICY_VERSION = "1";
export async function loadJobResumeDraftingContext(workspace, targetId) {
    const base = await loadJobResumePlanningContext(workspace, targetId);
    const planStatus = await getJobResumePlanStatus(workspace, targetId);
    if (planStatus.status !== "current") {
        throw new Error(`Job Resume Content Plan must be current before drafting. Current status: ${planStatus.status}`);
    }
    const contentPlan = await showJobResumePlan(workspace, targetId);
    if (contentPlan.targetType !== "job" || contentPlan.mode !== "job-specific-resume") {
        throw new Error("Job resume drafting accepts Job Targets and job-specific plans only.");
    }
    if (contentPlan.completeness.status !== "complete" || !contentPlan.completeness.usableForDrafting) {
        throw new Error("Job Resume Content Plan must be complete and usable for drafting.");
    }
    const contentPlanPath = planStatus.planPath;
    const contentPlanManifestPath = planStatus.manifestPath;
    const manifest = JobResumeContentPlanManifestSchema.parse(await readJson(resolveWithin(workspace, contentPlanManifestPath), null));
    const contentPlanSha256 = await hashFile(resolveWithin(workspace, contentPlanPath));
    if (manifest.planId !== contentPlan.id || manifest.planSha256 !== contentPlanSha256) {
        throw new Error("Job Resume Content Plan manifest does not match the plan.");
    }
    if (contentPlan.input.requirementModel.sha256 !== base.requirementInput.modelSha256 ||
        contentPlan.input.evidenceMap.sha256 !== base.evidenceMapSha256 ||
        contentPlan.input.coverage.sha256 !== base.coverageSha256 ||
        contentPlan.input.assessment.sha256 !== base.assessmentSha256 ||
        contentPlan.input.selectedEvidenceSetSha256 !== base.selectedEvidenceSetSha256 ||
        contentPlan.input.selectedClaimSetSha256 !== base.selectedClaimSetSha256) {
        throw new Error("Job Resume Content Plan dependencies do not match the current target pipeline.");
    }
    return {
        ...base,
        contentPlan,
        contentPlanPath,
        contentPlanSha256,
        contentPlanManifestPath,
        contentPlanManifestSha256: await hashFile(resolveWithin(workspace, contentPlanManifestPath)),
    };
}
export async function buildJobResumeDraftScaffold(workspace, targetId, options = {}) {
    const context = await loadJobResumeDraftingContext(workspace, targetId);
    const paths = jobResumeDraftScaffoldPaths(workspace, targetId);
    const status = await getJobResumeDraftScaffoldStatus(workspace, targetId);
    if (status.status === "current") {
        return scaffoldResult(await showJobResumeDraftScaffold(workspace, targetId), paths, "already-current");
    }
    if (["stale", "invalid"].includes(status.status) && !options.rebuild) {
        throw new Error(`Job resume draft scaffold is ${status.status}; use explicit --rebuild after reviewing dependency changes.`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.scaffoldPath)) {
        try {
            createdAt = JobResumeDraftScaffoldSchema.parse(await readJson(paths.scaffoldPath, null)).createdAt;
        }
        catch {
            // Explicit rebuild may replace a malformed scaffold.
        }
    }
    const scaffold = deriveJobResumeDraftScaffold(context, createdAt, now);
    assertJobResumeDraftScaffoldConsistency(scaffold, context);
    await writeJsonAtomic(paths.scaffoldPath, scaffold);
    const manifest = createJobResumeDraftScaffoldManifest(scaffold, context, paths.scaffoldRelativePath, await hashFile(paths.scaffoldPath), createdAt, now);
    await writeJsonAtomic(paths.manifestPath, manifest);
    return scaffoldResult(scaffold, paths, status.status === "missing" ? "created" : "rebuilt");
}
export function deriveJobResumeDraftScaffold(context, createdAt, updatedAt) {
    const scaffoldId = deterministicJobResumeDraftScaffoldId(context);
    const plan = context.contentPlan;
    const sections = plan.sections
        .slice()
        .sort((left, right) => left.order - right.order || left.type.localeCompare(right.type))
        .map((section) => {
        const selectedLinks = uniqueSorted([
            ...section.provenance.evidenceLinkReferences.map((entry) => entry.linkId),
            ...plan.evidenceSelections
                .filter((entry) => entry.intendedSections.includes(section.type))
                .flatMap((entry) => entry.requirementUses.flatMap((use) => use.linkIds)),
        ]);
        const selectedBoundaries = plan.claimBoundaries.filter((entry) => section.boundaryIds.includes(entry.id));
        const metricPermissions = plan.metricPermissions.filter((entry) => entry.allowedSections.includes(section.type) &&
            section.evidenceIds.includes(entry.evidenceId));
        const relatedRequirementIds = new Set(section.requirementIds);
        const maximumItemCount = section.maximumItemCount ?? defaultMaximumItems(section.type);
        return {
            id: `job-resume-draft-scaffold-section_${hashText([
                scaffoldId,
                section.id,
                section.type,
                JOB_RESUME_DRAFTING_POLICY_VERSION,
            ].join("\0")).slice(0, 16)}`,
            planSectionId: section.id,
            sectionType: section.type,
            inclusion: section.inclusion,
            order: section.order,
            objectiveCode: section.objectiveCode,
            allowedRequirementIds: uniqueSorted(section.requirementIds),
            allowedCoverageIds: uniqueSorted(section.provenance.coverageReferences.map((entry) => entry.coverageEntryId)),
            allowedAssessmentIds: uniqueSorted(section.provenance.assessmentReferences.map((entry) => entry.assessmentEntryId)),
            allowedEvidenceMapLinkIds: selectedLinks,
            allowedEvidenceIds: uniqueSorted(section.evidenceIds),
            allowedClaimIds: uniqueSorted(section.claimIds),
            allowedClaimBoundaryIds: uniqueSorted(section.boundaryIds),
            allowedMetricPermissionIds: uniqueSorted(metricPermissions.map((entry) => entry.id)),
            allowedClaimTypes: typedUnique(section.allowedContentTypes),
            maximumItemCount,
            ...(maximumSentences(section.type) ? { maximumSentenceCount: maximumSentences(section.type) } : {}),
            requiredQualifierCodes: uniqueSorted(selectedBoundaries.flatMap((entry) => entry.requiredQualifierCodes)),
            prohibitedInferenceCodes: uniqueSorted(selectedBoundaries.flatMap((entry) => entry.prohibitedInferenceCodes)),
            exclusionIds: uniqueSorted(section.exclusionIds),
            riskCodes: uniqueSorted(section.riskCodes),
            warningCodes: uniqueSorted(section.warningCodes),
            ambiguityIds: uniqueSorted(plan.ambiguities
                .filter((entry) => entry.requirementIds.some((id) => relatedRequirementIds.has(id)))
                .map((entry) => entry.id)),
            placeholderIds: section.inclusion === "exclude"
                ? []
                : Array.from({ length: maximumItemCount }, (_, index) => `job-resume-draft-slot_${hashText([scaffoldId, section.id, String(index)].join("\0")).slice(0, 16)}`),
        };
    });
    return JobResumeDraftScaffoldSchema.parse({
        schemaVersion: 1,
        id: scaffoldId,
        targetId: context.target.id,
        targetType: "job",
        mode: "job-specific-resume",
        targetTitle: context.target.title,
        positioningState: plan.positioning.state,
        contentPlan: {
            path: context.contentPlanPath,
            sha256: context.contentPlanSha256,
            manifestPath: context.contentPlanManifestPath,
            manifestSha256: context.contentPlanManifestSha256,
        },
        draftingPolicy: {
            name: JOB_RESUME_DRAFTING_POLICY_NAME,
            version: JOB_RESUME_DRAFTING_POLICY_VERSION,
        },
        sections,
        draftingConstraints: [
            constraint(scaffoldId, "CONTENT_PLAN_IS_SOLE_PLANNING_AUTHORITY", "Drafting may not change requirement emphasis, evidence selection, section strategy, or positioning.", sections),
            constraint(scaffoldId, "STATEMENT_LEVEL_PROVENANCE_REQUIRED", "Every substantive statement must retain requirement, map, evidence, claim, boundary, and dependency provenance.", sections),
            constraint(scaffoldId, "TARGET_TITLE_IS_POSITIONING_ONLY", "The Job Target title cannot become current or historical employment.", sections),
            constraint(scaffoldId, "PROJECT_SCOPE_REMAINS_PROJECT_SCOPE", "Project evidence cannot be represented as employment history.", sections),
            constraint(scaffoldId, "EXACT_VERIFIED_METRICS_ONLY", "Only exact metrics explicitly permitted by the plan may be drafted.", sections),
            constraint(scaffoldId, "NO_APPLICATION_JUDGMENT", "ATS scores, hiring predictions, and application recommendations are prohibited.", sections),
            constraint(scaffoldId, "NO_RENDERING_OR_EXPORT", "This slice creates structured draft artifacts only.", sections),
        ],
        provenance: scaffoldProvenance(context),
        createdAt,
        updatedAt,
    });
}
export async function showJobResumeDraftScaffold(workspace, targetId) {
    const paths = jobResumeDraftScaffoldPaths(workspace, targetId);
    if (!(await pathExists(paths.scaffoldPath))) {
        throw new Error(`Job resume draft scaffold not found: ${targetId}`);
    }
    return JobResumeDraftScaffoldSchema.parse(await readJson(paths.scaffoldPath, null));
}
export async function getJobResumeDraftScaffoldStatus(workspace, targetId) {
    const paths = jobResumeDraftScaffoldPaths(workspace, targetId);
    const scaffoldExists = await pathExists(paths.scaffoldPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = {
        targetId,
        scaffoldExists,
        manifestExists,
        scaffoldPath: paths.scaffoldRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!scaffoldExists && !manifestExists) {
        return emptyStatus(base, "missing", ["No Job resume draft scaffold exists."]);
    }
    if (!scaffoldExists || !manifestExists) {
        return emptyStatus(base, "invalid", ["Job resume draft scaffold artifact set is incomplete."]);
    }
    let scaffold;
    let manifest;
    try {
        scaffold = JobResumeDraftScaffoldSchema.parse(await readJson(paths.scaffoldPath, null));
        manifest = JobResumeDraftScaffoldManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyStatus(base, "invalid", [`Stored scaffold is malformed: ${errorMessage(error)}`]);
    }
    const scaffoldHashMatches = await hashFile(paths.scaffoldPath) === manifest.scaffoldSha256;
    if (!scaffoldHashMatches ||
        scaffold.id !== manifest.scaffoldId ||
        scaffold.targetId !== targetId ||
        manifest.targetId !== targetId ||
        manifest.scaffoldPath !== paths.scaffoldRelativePath) {
        return { ...emptyStatus(base, "invalid", ["Scaffold hash, identity, or path is invalid."]), scaffoldHashMatches };
    }
    let context;
    try {
        context = await loadJobResumeDraftingContext(workspace, targetId);
        assertJobResumeDraftScaffoldConsistency(scaffold, context);
    }
    catch (error) {
        return { ...emptyStatus(base, "stale", [`Current drafting dependencies are unavailable: ${errorMessage(error)}`]), scaffoldHashMatches };
    }
    const expected = scaffoldProvenance(context);
    const dependenciesMatch = stableJson(manifest.provenance) === stableJson(expected);
    const policyVersionMatches = manifest.policyName === JOB_RESUME_DRAFTING_POLICY_NAME
        && manifest.policyVersion === JOB_RESUME_DRAFTING_POLICY_VERSION;
    const reasons = [
        ...(!dependenciesMatch ? ["Job drafting dependencies changed."] : []),
        ...(!policyVersionMatches ? ["Job drafting policy changed."] : []),
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
export function assertJobResumeDraftScaffoldConsistency(scaffold, context) {
    if (scaffold.targetId !== context.target.id || scaffold.targetType !== "job" || scaffold.mode !== "job-specific-resume") {
        throw new Error("Job scaffold target identity or drafting mode is invalid.");
    }
    if (scaffold.targetTitle !== context.target.title) {
        throw new Error("Job scaffold title differs from the Job Target.");
    }
    if (scaffold.draftingPolicy.name !== JOB_RESUME_DRAFTING_POLICY_NAME ||
        scaffold.draftingPolicy.version !== JOB_RESUME_DRAFTING_POLICY_VERSION) {
        throw new Error("Job scaffold drafting policy is unsupported.");
    }
    if (scaffold.contentPlan.sha256 !== context.contentPlanSha256) {
        throw new Error("Job scaffold does not reference the current content plan.");
    }
    const planned = context.contentPlan.sections
        .slice()
        .sort((left, right) => left.order - right.order || left.type.localeCompare(right.type));
    if (scaffold.sections.length !== planned.length) {
        throw new Error("Job scaffold must preserve every content-plan section.");
    }
    for (let index = 0; index < planned.length; index += 1) {
        const source = planned[index];
        const section = scaffold.sections[index];
        if (section.planSectionId !== source.id ||
            section.sectionType !== source.type ||
            section.inclusion !== source.inclusion ||
            section.order !== source.order ||
            section.objectiveCode !== source.objectiveCode) {
            throw new Error(`Job scaffold changed planned section structure: ${source.id}`);
        }
        if (!sameSet(section.allowedRequirementIds, source.requirementIds)) {
            throw new Error(`Job scaffold changed selected requirements: ${source.id}`);
        }
        if (!sameSet(section.allowedEvidenceIds, source.evidenceIds)) {
            throw new Error(`Job scaffold changed selected evidence: ${source.id}`);
        }
        if (!sameSet(section.allowedClaimIds, source.claimIds)) {
            throw new Error(`Job scaffold changed selected claims: ${source.id}`);
        }
        if (section.inclusion === "exclude" && section.placeholderIds.length) {
            throw new Error(`Excluded Job scaffold section contains draft slots: ${source.id}`);
        }
    }
    const serialized = stableJson(scaffold);
    if (/\b(?:Led|Built|Delivered|Managed|Results-driven)\b[^"]{12,}/.test(serialized)) {
        throw new Error("Deterministic Job scaffold contains generated resume prose.");
    }
}
export function deterministicJobResumeDraftScaffoldId(context) {
    return `job-resume-draft-scaffold_${hashText([
        context.target.id,
        context.contentPlanSha256,
        JOB_RESUME_DRAFTING_POLICY_VERSION,
    ].join("\0")).slice(0, 16)}`;
}
export function jobResumeDraftScaffoldPaths(workspace, targetId) {
    const root = `targets/jobs/${targetId}/resume-drafting/scaffold`;
    const scaffoldRelativePath = `${root}/job-resume-draft-scaffold.json`;
    const manifestRelativePath = `${root}/scaffold-manifest.json`;
    return {
        scaffoldRelativePath,
        scaffoldPath: resolveWithin(workspace, scaffoldRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
export function createJobResumeDraftScaffoldManifest(scaffold, context, scaffoldPath, scaffoldSha256, createdAt, updatedAt) {
    return JobResumeDraftScaffoldManifestSchema.parse({
        schemaVersion: 1,
        scaffoldId: scaffold.id,
        targetId: scaffold.targetId,
        scaffoldPath,
        scaffoldSha256,
        policyName: JOB_RESUME_DRAFTING_POLICY_NAME,
        policyVersion: JOB_RESUME_DRAFTING_POLICY_VERSION,
        provenance: scaffoldProvenance(context),
        createdAt,
        updatedAt,
    });
}
export function formatBuildJobResumeDraftScaffoldResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        "Target type: job",
        `Scaffold ID: ${result.scaffoldId}`,
        `Result: ${result.result}`,
        `Scaffold path: ${result.scaffoldPath}`,
        `Manifest path: ${result.manifestPath}`,
        `Included sections: ${result.includedSectionCount}`,
        `Excluded sections: ${result.excludedSectionCount}`,
        `Draft slots: ${result.placeholderCount}`,
    ].join("\n");
}
export function formatJobResumeDraftScaffoldStatus(status) {
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
        jobDescriptionSha256: context.sourceSha256,
        requirementModelSha256: context.requirementInput.modelSha256,
        requirementManifestSha256: context.requirementInput.manifestSha256,
        evidenceMapSha256: context.evidenceMapSha256,
        evidenceMapManifestSha256: context.evidenceMapManifestSha256,
        coverageSha256: context.coverageSha256,
        coverageManifestSha256: context.coverageManifestSha256,
        assessmentSha256: context.assessmentSha256,
        assessmentManifestSha256: context.assessmentManifestSha256,
        contentPlanSha256: context.contentPlanSha256,
        contentPlanManifestSha256: context.contentPlanManifestSha256,
        selectedEvidenceSetSha256: context.selectedEvidenceSetSha256,
        selectedClaimSetSha256: context.selectedClaimSetSha256,
    };
}
function constraint(scaffoldId, code, description, sections) {
    return {
        id: `job-resume-draft-constraint_${hashText([scaffoldId, code].join("\0")).slice(0, 16)}`,
        code,
        description,
        sectionIds: sections.map((entry) => entry.id),
        blocking: true,
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
function sameSet(left, right) {
    return left.length === right.length
        && [...left].sort().every((entry, index) => entry === [...right].sort()[index]);
}
function typedUnique(values) {
    return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
function scaffoldResult(scaffold, paths, result) {
    return {
        targetId: scaffold.targetId,
        result,
        scaffoldId: scaffold.id,
        scaffoldPath: paths.scaffoldRelativePath,
        manifestPath: paths.manifestRelativePath,
        includedSectionCount: scaffold.sections.filter((entry) => entry.inclusion !== "exclude").length,
        excludedSectionCount: scaffold.sections.filter((entry) => entry.inclusion === "exclude").length,
        placeholderCount: scaffold.sections.reduce((count, entry) => count + entry.placeholderIds.length, 0),
    };
}
function emptyStatus(base, status, reasons) {
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
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
        throw new Error("Resolved path leaves workspace.");
    }
    return absolute;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
