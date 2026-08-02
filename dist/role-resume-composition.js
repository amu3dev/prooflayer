import path from "node:path";
import { hashFile, hashText, pathExists, readJson, uniqueSorted, writeJsonAtomic, } from "./fs-utils.js";
import { PUBLIC_PROFILE_FILE, loadPublicProfile } from "./public-profile.js";
import { CareerProfileSchema, } from "./schemas.js";
import { RoleResumeCompositionManifestSchema, RoleResumeCompositionSchema, } from "./role-resume-composition-schemas.js";
import { RoleResumePlanManifestSchema, } from "./role-resume-plan-schemas.js";
import { getRoleResumePlanStatus, loadRoleResumePlanningContext, showRoleResumePlan, } from "./role-resume-planning.js";
import { stableJson } from "./target-proposal.js";
export const ROLE_RESUME_COMPOSITION_POLICY_NAME = "role-resume-composition-policy";
export const ROLE_RESUME_COMPOSITION_POLICY_VERSION = "1";
export const CAREER_PROFILE_PATH = "kb/career-profile.json";
export async function loadRoleResumeCompositionContext(workspace, targetId) {
    const base = await loadRoleResumePlanningContext(workspace, targetId);
    const planStatus = await getRoleResumePlanStatus(workspace, targetId, "approved");
    if (planStatus.status !== "current") {
        throw new Error(`Approved Role Resume Content Plan must be current before composition. Current status: ${planStatus.status}`);
    }
    const approvedPlan = await showRoleResumePlan(workspace, targetId, "approved");
    if (approvedPlan.completeness.status !== "complete" || !approvedPlan.completeness.usableForResumeDrafting) {
        throw new Error("Approved Role Resume Content Plan must be complete and usable before composition.");
    }
    const planManifest = RoleResumePlanManifestSchema.parse(await readJson(resolveWithin(workspace, planStatus.manifestPath), null));
    const careerProfilePath = resolveWithin(workspace, CAREER_PROFILE_PATH);
    const careerProfile = await pathExists(careerProfilePath)
        ? CareerProfileSchema.parse(await readJson(careerProfilePath, null))
        : emptyCareerProfile();
    const publicProfile = await loadPublicProfile(workspace);
    const publicProfilePath = resolveWithin(workspace, PUBLIC_PROFILE_FILE);
    return {
        ...base,
        approvedPlan,
        approvedPlanPath: planStatus.planPath,
        approvedPlanSha256: planManifest.planSha256,
        approvedPlanManifestPath: planStatus.manifestPath,
        approvedPlanManifestSha256: await hashFile(resolveWithin(workspace, planStatus.manifestPath)),
        careerProfile,
        careerProfileSha256: await pathExists(careerProfilePath)
            ? await hashFile(careerProfilePath)
            : hashText(`${stableJson(careerProfile)}\n`),
        publicProfile,
        publicProfileSha256: await pathExists(publicProfilePath)
            ? await hashFile(publicProfilePath)
            : hashText(`${stableJson(null)}\n`),
    };
}
export async function buildRoleResumeComposition(workspace, targetId, options = {}) {
    const context = await loadRoleResumeCompositionContext(workspace, targetId);
    const paths = roleResumeCompositionPaths(workspace, targetId);
    const status = await getRoleResumeCompositionStatus(workspace, targetId);
    if (status.status === "current")
        return compositionResult(await showRoleResumeComposition(workspace, targetId), paths, "already-current");
    if (["stale", "invalid"].includes(status.status) && !options.rebuild) {
        throw new Error(`Role resume composition is ${status.status}; use explicit --rebuild after reviewing dependency changes.`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.compositionPath)) {
        try {
            createdAt = RoleResumeCompositionSchema.parse(await readJson(paths.compositionPath, null)).createdAt;
        }
        catch {
            // Explicit rebuild may replace an invalid derived composition.
        }
    }
    const composition = deriveRoleResumeComposition(context, createdAt, now);
    await writeJsonAtomic(paths.compositionPath, composition);
    const manifest = RoleResumeCompositionManifestSchema.parse({
        schemaVersion: 1,
        compositionId: composition.id,
        targetId,
        compositionPath: paths.compositionRelativePath,
        compositionSha256: await hashFile(paths.compositionPath),
        policyName: ROLE_RESUME_COMPOSITION_POLICY_NAME,
        policyVersion: ROLE_RESUME_COMPOSITION_POLICY_VERSION,
        targetSha256: context.targetSha256,
        approvedPlanSha256: context.approvedPlanSha256,
        approvedPlanManifestSha256: context.approvedPlanManifestSha256,
        evidenceSnapshotSha256: context.evidenceSnapshotSha256,
        careerProfileSha256: context.careerProfileSha256,
        publicProfileSha256: context.publicProfileSha256,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return compositionResult(composition, paths, status.status === "missing" ? "created" : "rebuilt");
}
export function deriveRoleResumeComposition(context, createdAt, updatedAt) {
    const eligible = new Set(context.approvedMatching.evidenceSnapshot.eligibleEvidenceIds);
    const evidenceById = new Map(context.evidenceItems.map((entry) => [entry.id, entry]));
    const safeEvidenceIds = new Set(context.evidenceItems
        .filter((entry) => eligible.has(entry.id) && entry.visibility === "public" && entry.sensitivityFlags.length === 0)
        .map((entry) => entry.id));
    const selectedEvidenceIds = uniqueSorted(context.approvedPlan.evidenceSelections
        .filter((entry) => entry.decision !== "exclude" && safeEvidenceIds.has(entry.evidenceId))
        .map((entry) => entry.evidenceId));
    const compositionId = `role-resume-composition_${hashText([
        context.target.id,
        context.approvedPlanSha256,
        context.careerProfileSha256,
        context.publicProfileSha256,
        context.evidenceSnapshotSha256,
        ROLE_RESUME_COMPOSITION_POLICY_VERSION,
    ].join("\0")).slice(0, 16)}`;
    const experienceEntries = context.careerProfile.roles.map((entry, index) => {
        const evidenceIds = uniqueSorted(entry.evidenceIds.filter((id) => safeEvidenceIds.has(id)));
        const selected = evidenceIds.filter((id) => selectedEvidenceIds.includes(id));
        const label = roleHeader(entry);
        const hasChronologyLabel = Boolean(entry.title || entry.company || entry.dateRange);
        const included = evidenceIds.length > 0 && hasChronologyLabel;
        return {
            id: `role-composition-entry_${hashText([compositionId, "role", String(index), label, evidenceIds.join(",")].join("\0")).slice(0, 16)}`,
            sourceType: "role",
            sourceIndex: index,
            label,
            ...(entry.title ? { title: entry.title } : {}),
            ...(entry.company ? { organization: entry.company } : {}),
            ...(entry.dateRange ? { dateRange: entry.dateRange } : {}),
            technologies: uniqueSorted(evidenceIds.flatMap((id) => evidenceById.get(id)?.technologies ?? [])),
            domains: uniqueSorted(evidenceIds.flatMap((id) => evidenceById.get(id)?.domains ?? [])),
            evidenceIds,
            selectedEvidenceIds: selected,
            decision: included ? "include" : "exclude",
            rationale: included
                ? "Include this reviewed Career Twin employment entry and preserve its exact title, organization, and dates."
                : evidenceIds.length
                    ? "Exclude because the Career Twin entry has no usable title, organization, or date label."
                    : "Exclude because no evidence for this Career Twin entry is eligible in the pinned Role evidence set.",
            order: index,
        };
    });
    const projectEntries = context.careerProfile.projects.map((entry, index) => {
        const evidenceIds = uniqueSorted(entry.evidenceIds.filter((id) => safeEvidenceIds.has(id)));
        const selected = evidenceIds.filter((id) => selectedEvidenceIds.includes(id));
        return {
            id: `role-composition-entry_${hashText([compositionId, "project", String(index), entry.name, evidenceIds.join(",")].join("\0")).slice(0, 16)}`,
            sourceType: "project",
            sourceIndex: index,
            label: entry.name,
            title: entry.name,
            technologies: uniqueSorted(entry.technologies ?? []),
            domains: uniqueSorted(entry.domains ?? []),
            evidenceIds,
            selectedEvidenceIds: selected,
            decision: evidenceIds.length ? "include" : "exclude",
            rationale: evidenceIds.length
                ? "Include as a project-scoped Career Twin entry; it must remain distinct from employment history."
                : "Exclude because no project evidence is eligible in the pinned Role evidence set.",
            order: index,
        };
    });
    const skills = context.careerProfile.skills.map((entry, index) => {
        const evidenceIds = uniqueSorted(entry.evidenceIds.filter((id) => safeEvidenceIds.has(id)));
        return {
            id: `role-composition-skill_${hashText([compositionId, String(index), entry.name, evidenceIds.join(",")].join("\0")).slice(0, 16)}`,
            label: entry.name,
            evidenceIds,
            decision: evidenceIds.length ? "include" : "exclude",
            rationale: evidenceIds.length
                ? "Include the exact Career Twin skill label backed by eligible evidence."
                : "Exclude because the skill has no evidence eligible for Role resume use.",
            order: index,
        };
    });
    const identity = {
        ...(context.publicProfile?.publicName ? { name: context.publicProfile.publicName } : {}),
        contactItems: publicContactItems(context.publicProfile),
        source: context.publicProfile?.publicName ? "public-profile" : "unavailable",
    };
    const slots = [];
    const addSlot = (input) => {
        const id = `role-composition-slot_${hashText([
            compositionId,
            input.sectionType,
            input.itemType,
            input.careerEntryId ?? "",
            input.mode,
            input.exactText ?? "",
            input.sourceLabel,
            input.evidenceIds.join(","),
            String(slots.length),
        ].join("\0")).slice(0, 16)}`;
        slots.push({ ...input, id, order: slots.length });
        return id;
    };
    if (identity.name)
        addSlot(fixedSlot("headline", "identity", identity.name, "Approved public identity", [], ["role-title"]));
    if (identity.contactItems.length)
        addSlot(fixedSlot("headline", "contact", identity.contactItems.join(" | "), "Approved public contact details", [], []));
    const primaryTheme = context.approvedPlan.positioning.primaryThemes[0]
        ?? context.approvedPlan.positioning.secondaryThemes[0]
        ?? context.approvedPlan.positioning.differentiationThemes[0];
    if (primaryTheme) {
        const slot = providerSlot(context, "headline", "headline", marketFacingLabel(primaryTheme.label), primaryTheme.evidenceIds, primaryTheme.sourceExpectationIds, ["role-title", "capability-theme"]);
        if (slot.evidenceIds.length && slot.claimTypes.length)
            addSlot(slot);
    }
    const summaryEvidence = uniqueSorted([
        ...context.approvedPlan.positioning.primaryThemes,
        ...context.approvedPlan.positioning.secondaryThemes,
    ].flatMap((entry) => entry.evidenceIds).filter((id) => selectedEvidenceIds.includes(id)));
    if (summaryEvidence.length) {
        const slot = providerSlot(context, "professional-summary", "summary", "Professional summary", summaryEvidence, [], ["capability-theme", "scope", "domain"]);
        if (slot.evidenceIds.length && slot.claimTypes.length)
            addSlot(slot);
    }
    const capabilityThemes = uniqueThemes(context);
    for (const theme of capabilityThemes.slice(0, 8)) {
        const slot = providerSlot(context, "core-capabilities", "capability", marketFacingLabel(theme.label), theme.evidenceIds, theme.sourceExpectationIds, ["capability-theme"]);
        if (slot.claimTypes.includes("capability-theme"))
            addSlot(slot);
    }
    const impactEvidenceIds = selectedEvidenceIds.filter((id) => {
        const evidence = evidenceById.get(id);
        return evidence?.category === "achievement" || context.reviewedMetricEvidenceIds.has(id);
    });
    for (const evidenceId of impactEvidenceIds.slice(0, 4)) {
        const evidence = evidenceById.get(evidenceId);
        const slot = providerSlot(context, "selected-impact", "impact", evidence?.normalizedSummary ?? evidenceId, [evidenceId], [], context.reviewedMetricEvidenceIds.has(evidenceId)
            ? ["quantified-outcome", "delivery-outcome"]
            : claimTypesForEvidence(evidence));
        if (slot.evidenceIds.length && slot.claimTypes.length)
            addSlot(slot);
    }
    for (const entry of experienceEntries.filter((candidate) => candidate.decision === "include")) {
        addSlot({
            ...fixedSlot("professional-experience", "experience-role", entry.label, `Career Twin role: ${entry.label}`, entry.evidenceIds, ["role-title"]),
            careerEntryId: entry.id,
        });
        for (const evidenceId of entry.selectedEvidenceIds.slice(0, 5)) {
            const evidence = evidenceById.get(evidenceId);
            const slot = providerSlot(context, "professional-experience", "experience-bullet", evidence?.normalizedSummary ?? entry.label, [evidenceId], [], claimTypesForEvidence(evidence));
            if (slot.evidenceIds.length && slot.claimTypes.length)
                addSlot({ ...slot, careerEntryId: entry.id });
        }
    }
    for (const entry of projectEntries.filter((candidate) => candidate.decision === "include")) {
        addSlot({
            ...fixedSlot("selected-projects", "project", entry.label, `Career Twin project: ${entry.label}`, entry.evidenceIds, ["project"]),
            careerEntryId: entry.id,
        });
        for (const evidenceId of entry.selectedEvidenceIds.slice(0, 3)) {
            const evidence = evidenceById.get(evidenceId);
            const slot = providerSlot(context, "selected-projects", "project-bullet", evidence?.normalizedSummary ?? entry.label, [evidenceId], [], claimTypesForEvidence(evidence));
            if (slot.evidenceIds.length && slot.claimTypes.length)
                addSlot({ ...slot, careerEntryId: entry.id });
        }
    }
    for (const skill of skills.filter((candidate) => candidate.decision === "include").slice(0, 16)) {
        addSlot(fixedSlot("technical-capabilities", "technology", skill.label, `Career Twin skill: ${skill.label}`, skill.evidenceIds, ["technology"]));
    }
    const educationEvidence = context.evidenceItems.filter((entry) => safeEvidenceIds.has(entry.id) && entry.category === "education");
    const certificationEvidence = context.evidenceItems.filter((entry) => safeEvidenceIds.has(entry.id) && entry.category === "certification");
    for (const evidence of educationEvidence)
        addSlot(fixedSlot("education", "education", evidence.normalizedSummary, "Reviewed education", [evidence.id], ["education"]));
    for (const evidence of certificationEvidence)
        addSlot(fixedSlot("certifications", "certification", evidence.normalizedSummary, "Reviewed certification", [evidence.id], ["certification"]));
    const sections = context.approvedPlan.sections
        .slice()
        .sort((a, b) => a.order - b.order || a.type.localeCompare(b.type))
        .map((planSection) => {
        const sectionSlots = slots.filter((slot) => slot.sectionType === planSection.type);
        const status = sectionSlots.length
            ? ["headline", "professional-summary", "core-capabilities", "professional-experience"].includes(planSection.type)
                ? "include"
                : "optional"
            : "exclude";
        return {
            id: `role-composition-section_${hashText([compositionId, planSection.id, planSection.type].join("\0")).slice(0, 16)}`,
            planSectionId: planSection.id,
            type: planSection.type,
            status,
            order: planSection.order,
            objective: planSection.objective,
            slotIds: sectionSlots.map((slot) => slot.id),
            requiredSlotIds: sectionSlots.filter((slot) => slot.required).map((slot) => slot.id),
        };
    });
    const exclusions = [
        ...experienceEntries.filter((entry) => entry.decision === "exclude").map((entry) => exclusion(compositionId, "role", entry.id, entry.label, entry.rationale)),
        ...projectEntries.filter((entry) => entry.decision === "exclude").map((entry) => exclusion(compositionId, "project", entry.id, entry.label, entry.rationale)),
        ...skills.filter((entry) => entry.decision === "exclude").map((entry) => exclusion(compositionId, "skill", entry.id, entry.label, entry.rationale)),
        ...selectedEvidenceIds.filter((id) => !slots.some((slot) => slot.evidenceIds.includes(id))).map((id) => exclusion(compositionId, "evidence", id, evidenceById.get(id)?.normalizedSummary ?? id, "Selected evidence could not be allocated to a safe resume section and remains explicitly excluded.")),
    ];
    const accountedEvidenceIds = uniqueSorted([
        ...slots.flatMap((slot) => slot.evidenceIds),
        ...exclusions.filter((entry) => entry.subjectType === "evidence").map((entry) => entry.subjectId),
    ].filter((id) => selectedEvidenceIds.includes(id)));
    const completeness = deriveCompositionCompleteness({
        identityPresent: Boolean(identity.name),
        slots,
        experienceEntries,
        projectEntries,
        skills,
        selectedEvidenceIds,
        accountedEvidenceIds,
        profile: context.careerProfile,
    });
    return RoleResumeCompositionSchema.parse({
        schemaVersion: 1,
        id: compositionId,
        targetId: context.target.id,
        targetType: "role",
        mode: "market-positioning",
        roleTitle: context.target.title,
        policy: { name: ROLE_RESUME_COMPOSITION_POLICY_NAME, version: ROLE_RESUME_COMPOSITION_POLICY_VERSION },
        approvedPlan: {
            path: context.approvedPlanPath,
            sha256: context.approvedPlanSha256,
            manifestPath: context.approvedPlanManifestPath,
            manifestSha256: context.approvedPlanManifestSha256,
        },
        identity,
        experienceEntries,
        projectEntries,
        skills,
        sections,
        slots,
        exclusions,
        completeness,
        provenance: {
            targetSha256: context.targetSha256,
            approvedPlanSha256: context.approvedPlanSha256,
            approvedPlanManifestSha256: context.approvedPlanManifestSha256,
            approvedInterpretationSha256: context.approvedInterpretationSha256,
            approvedMatchingSha256: context.approvedMatchingSha256,
            approvedAssessmentSha256: context.approvedAssessmentSha256,
            evidenceSnapshotSha256: context.evidenceSnapshotSha256,
            careerProfilePath: CAREER_PROFILE_PATH,
            careerProfileSha256: context.careerProfileSha256,
            publicProfilePath: PUBLIC_PROFILE_FILE,
            publicProfileSha256: context.publicProfileSha256,
            eligibleEvidenceSetSha256: hashText(stableJson(uniqueSorted([...safeEvidenceIds]))),
            selectedEvidenceSetSha256: hashText(stableJson(selectedEvidenceIds)),
        },
        createdAt,
        updatedAt,
    });
}
export function evaluateRoleResumeDraftAgainstComposition(composition, sections) {
    const items = sections.flatMap((section) => section.items);
    const itemBySlot = new Map(items.map((item) => [item.compositionSlotId, item]));
    const missingRequired = composition.slots.filter((slot) => slot.required && !itemBySlot.has(slot.id));
    const changedFixed = composition.slots.filter((slot) => slot.mode === "fixed" && itemBySlot.get(slot.id)?.text !== slot.exactText);
    const roleHeaders = composition.slots.filter((slot) => slot.itemType === "experience-role");
    const projectHeaders = composition.slots.filter((slot) => slot.itemType === "project");
    const representedEvidence = uniqueSorted(items.flatMap((item) => item.evidenceIds));
    const selectedEvidence = uniqueSorted(composition.slots.flatMap((slot) => slot.evidenceIds));
    const unrepresentedEvidence = selectedEvidence.filter((id) => !representedEvidence.includes(id));
    const placeholderItems = items.filter((item) => isAuditPlaceholder(item.text));
    const includedExperienceCount = roleHeaders.filter((slot) => itemBySlot.has(slot.id)).length;
    const includedProjectCount = projectHeaders.filter((slot) => itemBySlot.has(slot.id)).length;
    const capabilityThemeCount = composition.slots.filter((slot) => slot.itemType === "capability" && itemBySlot.has(slot.id)).length;
    const evidenceBackedBulletSlotCount = composition.slots.filter((slot) => ["experience-bullet", "project-bullet", "impact"].includes(slot.itemType) && itemBySlot.has(slot.id)).length;
    const blockingReasons = [
        ...missingRequired.map((slot) => `Required composition slot is missing: ${slot.sourceLabel}.`),
        ...changedFixed.map((slot) => `Fixed Career Twin fact changed: ${slot.sourceLabel}.`),
        ...(unrepresentedEvidence.length ? [`${unrepresentedEvidence.length} selected evidence item(s) are not represented.`] : []),
        ...(placeholderItems.length ? ["Audit placeholder language remains in the resume draft."] : []),
        ...(composition.completeness.matureCareerTwin && includedExperienceCount < 2 ? ["A mature Career Twin is missing chronological experience entries."] : []),
        ...(includedExperienceCount === 0 && includedProjectCount === 0 ? ["No professional experience or project entry is represented."] : []),
        ...(capabilityThemeCount < 2 && composition.completeness.includedSkillCount < 2
            ? ["Fewer than two evidence-backed capability or skill themes are represented."]
            : []),
        ...(evidenceBackedBulletSlotCount < 2 ? ["Fewer than two evidence-backed experience or project bullets are represented."] : []),
    ];
    const usable = blockingReasons.length === 0 && composition.completeness.usableForDrafting;
    const status = !composition.completeness.usableForDrafting
        ? composition.completeness.status === "blocked" ? "blocked" : "incomplete"
        : !usable
            ? "incomplete"
            : composition.completeness.status;
    return {
        ...composition.completeness,
        status,
        usableForDrafting: usable,
        capabilityThemeCount,
        includedExperienceCount,
        includedProjectCount,
        evidenceBackedBulletSlotCount,
        accountedSelectedEvidenceCount: selectedEvidence.length - unrepresentedEvidence.length,
        selectedEvidenceAccounted: unrepresentedEvidence.length === 0,
        blockingReasons,
        warnings: uniqueSorted([
            ...composition.completeness.warnings,
            ...(composition.completeness.status === "constrained-but-usable" ? ["This resume is constrained by the available reviewed Career Twin evidence."] : []),
        ]),
    };
}
export async function showRoleResumeComposition(workspace, targetId) {
    const paths = roleResumeCompositionPaths(workspace, targetId);
    if (!(await pathExists(paths.compositionPath)))
        throw new Error(`Role resume composition not found: ${targetId}`);
    return RoleResumeCompositionSchema.parse(await readJson(paths.compositionPath, null));
}
export async function getRoleResumeCompositionStatus(workspace, targetId) {
    const paths = roleResumeCompositionPaths(workspace, targetId);
    const compositionExists = await pathExists(paths.compositionPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = { targetId, compositionExists, manifestExists, compositionPath: paths.compositionRelativePath, manifestPath: paths.manifestRelativePath };
    if (!compositionExists && !manifestExists)
        return emptyStatus(base, "missing", ["No role resume composition exists."]);
    if (!compositionExists || !manifestExists)
        return emptyStatus(base, "invalid", ["Composition artifact set is incomplete."]);
    let composition;
    let manifest;
    try {
        composition = RoleResumeCompositionSchema.parse(await readJson(paths.compositionPath, null));
        manifest = RoleResumeCompositionManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyStatus(base, "invalid", [`Stored composition is malformed: ${errorMessage(error)}`]);
    }
    const compositionHashMatches = await hashFile(paths.compositionPath) === manifest.compositionSha256;
    if (!compositionHashMatches || manifest.compositionId !== composition.id || manifest.targetId !== targetId || composition.targetId !== targetId) {
        return { ...emptyStatus(base, "invalid", ["Composition hash or identity is invalid."]), compositionHashMatches };
    }
    let context;
    try {
        context = await loadRoleResumeCompositionContext(workspace, targetId);
    }
    catch (error) {
        return { ...emptyStatus(base, "stale", [`Current composition dependencies are unavailable: ${errorMessage(error)}`]), compositionHashMatches };
    }
    const dependenciesMatch = manifest.targetSha256 === context.targetSha256
        && manifest.approvedPlanSha256 === context.approvedPlanSha256
        && manifest.approvedPlanManifestSha256 === context.approvedPlanManifestSha256
        && manifest.evidenceSnapshotSha256 === context.evidenceSnapshotSha256
        && manifest.careerProfileSha256 === context.careerProfileSha256
        && manifest.publicProfileSha256 === context.publicProfileSha256;
    const policyVersionMatches = manifest.policyName === ROLE_RESUME_COMPOSITION_POLICY_NAME
        && manifest.policyVersion === ROLE_RESUME_COMPOSITION_POLICY_VERSION;
    const reasons = [
        ...(!dependenciesMatch ? ["Career Twin or approved planning dependencies changed."] : []),
        ...(!policyVersionMatches ? ["Composition policy changed."] : []),
    ];
    return {
        ...base,
        compositionHashMatches,
        dependenciesMatch,
        policyVersionMatches,
        status: reasons.length ? "stale" : "current",
        usableForDrafting: reasons.length === 0 && composition.completeness.usableForDrafting,
        reasons,
    };
}
export function roleResumeCompositionPaths(workspace, targetId) {
    const root = `targets/roles/${targetId}/resume-composition/deterministic`;
    const compositionRelativePath = `${root}/role-resume-composition.json`;
    const manifestRelativePath = `${root}/role-resume-composition-manifest.json`;
    return {
        compositionRelativePath,
        compositionPath: resolveWithin(workspace, compositionRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
export function formatBuildRoleResumeCompositionResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Result: ${result.result}`,
        `Composition ID: ${result.compositionId}`,
        `Completeness: ${result.completeness}`,
        `Usable for drafting: ${result.usableForDrafting ? "yes" : "no"}`,
        `Experience entries: ${result.experienceEntryCount}`,
        `Project entries: ${result.projectEntryCount}`,
        `Skills: ${result.skillCount}`,
        `Composition path: ${result.compositionPath}`,
        `Manifest path: ${result.manifestPath}`,
    ].join("\n");
}
export function formatRoleResumeCompositionStatus(status) {
    return [
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Usable for drafting: ${status.usableForDrafting ? "yes" : "no"}`,
        `Composition hash matches: ${status.compositionHashMatches ?? "n/a"}`,
        `Dependencies match: ${status.dependenciesMatch ?? "n/a"}`,
        `Policy version matches: ${status.policyVersionMatches ?? "n/a"}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
function deriveCompositionCompleteness(input) {
    const includedExperienceCount = input.experienceEntries.filter((entry) => entry.decision === "include").length;
    const includedProjectCount = input.projectEntries.filter((entry) => entry.decision === "include").length;
    const includedSkillCount = input.skills.filter((entry) => entry.decision === "include").length;
    const capabilityThemeCount = input.slots.filter((slot) => slot.itemType === "capability").length;
    const evidenceBackedBulletSlotCount = input.slots.filter((slot) => ["experience-bullet", "project-bullet", "impact"].includes(slot.itemType)).length;
    const headlinePlanned = input.slots.some((slot) => slot.itemType === "headline");
    const summaryPlanned = input.slots.some((slot) => slot.itemType === "summary");
    const matureCareerTwin = input.profile.roles.length >= 2 || input.profile.projects.length >= 2;
    const careerEntriesAccounted = input.experienceEntries.length === input.profile.roles.length
        && input.projectEntries.length === input.profile.projects.length;
    const selectedEvidenceAccounted = input.selectedEvidenceIds.every((id) => input.accountedEvidenceIds.includes(id));
    const blockingReasons = [
        ...(!input.identityPresent ? ["Approved public identity is unavailable."] : []),
        ...(!headlinePlanned ? ["Targeted headline cannot be composed from approved positioning evidence."] : []),
        ...(!summaryPlanned ? ["Professional summary cannot be composed from approved evidence."] : []),
        ...(includedExperienceCount === 0 && includedProjectCount === 0 ? ["No reviewed Career Twin chronology is eligible for resume use."] : []),
        ...(capabilityThemeCount < 2 && includedSkillCount < 2
            ? ["Fewer than two evidence-backed capability or skill themes are available."]
            : []),
        ...(evidenceBackedBulletSlotCount < 2 ? ["Fewer than two evidence-backed experience or project bullets are available."] : []),
        ...(!careerEntriesAccounted ? ["Career Twin entries are not fully accounted for."] : []),
        ...(!selectedEvidenceAccounted ? ["Selected plan evidence is not fully accounted for."] : []),
    ];
    const hardBlocked = input.selectedEvidenceIds.length === 0 || (includedExperienceCount === 0 && includedProjectCount === 0);
    const usable = blockingReasons.length === 0;
    const complete = usable
        && (!matureCareerTwin || includedExperienceCount >= 2)
        && capabilityThemeCount >= 2
        && evidenceBackedBulletSlotCount >= Math.max(3, includedExperienceCount)
        && (input.profile.projects.length === 0 || includedProjectCount > 0)
        && (input.profile.skills.length === 0 || includedSkillCount > 0);
    const status = hardBlocked
        ? "blocked"
        : !usable
            ? "incomplete"
            : complete
                ? "complete"
                : "constrained-but-usable";
    return {
        status,
        usableForDrafting: status === "complete" || status === "constrained-but-usable",
        matureCareerTwin,
        identityPresent: input.identityPresent,
        headlinePlanned,
        summaryPlanned,
        capabilityThemeCount,
        includedExperienceCount,
        includedProjectCount,
        includedSkillCount,
        evidenceBackedBulletSlotCount,
        selectedEvidenceCount: input.selectedEvidenceIds.length,
        accountedSelectedEvidenceCount: input.accountedEvidenceIds.length,
        careerEntriesAccounted,
        selectedEvidenceAccounted,
        blockingReasons,
        warnings: [
            ...(status === "constrained-but-usable" ? ["The resume is usable but constrained by the available reviewed Career Twin material."] : []),
            ...(!includedProjectCount && input.profile.projects.length ? ["Career Twin projects are unavailable because their evidence is not eligible for Role resume use."] : []),
        ],
    };
}
function fixedSlot(sectionType, itemType, exactText, sourceLabel, evidenceIds, claimTypes) {
    return {
        sectionType,
        itemType,
        mode: "fixed",
        required: true,
        exactText,
        sourceLabel,
        sourceExpectationIds: [],
        sourceAssessmentIds: [],
        approvedMatchIds: [],
        evidenceIds: uniqueSorted(evidenceIds),
        claimBoundaryIds: [],
        claimTypes,
        qualifiers: [],
        rationale: "Preserve this approved Career Twin fact exactly; the writing provider may not alter it.",
    };
}
function providerSlot(context, sectionType, itemType, sourceLabel, evidenceIds, expectationIds, fallbackClaimTypes) {
    const candidateBoundaries = context.approvedPlan.claimBoundaries.filter((boundary) => boundary.boundaryType !== "prohibited"
        && boundary.evidenceIds.some((id) => evidenceIds.includes(id))
        && (!expectationIds.length || boundary.expectationId && expectationIds.includes(boundary.expectationId)));
    const boundary = candidateBoundaries.find((entry) => itemType === "headline" || fallbackClaimTypes.some((type) => entry.allowedClaimTypes.includes(type)))
        ?? candidateBoundaries[0];
    const boundaries = boundary ? [boundary] : [];
    const selectedExpectations = context.approvedPlan.expectationSelections.filter((selection) => boundaries.some((boundary) => boundary.expectationId === selection.expectationId));
    const allowedClaimTypes = itemType === "headline"
        ? fallbackClaimTypes
        : fallbackClaimTypes.filter((type) => boundary?.allowedClaimTypes.includes(type));
    return {
        sectionType,
        itemType,
        mode: "provider-worded",
        required: true,
        sourceLabel,
        sourceExpectationIds: uniqueSorted(selectedExpectations.map((entry) => entry.expectationId)),
        sourceAssessmentIds: uniqueSorted(selectedExpectations.map((entry) => entry.assessmentId)),
        approvedMatchIds: uniqueSorted(selectedExpectations.flatMap((entry) => entry.approvedMatchIds)),
        evidenceIds: uniqueSorted(evidenceIds.filter((id) => boundary?.evidenceIds.includes(id))),
        claimBoundaryIds: uniqueSorted(boundaries.map((entry) => entry.id)),
        claimTypes: uniqueSorted(allowedClaimTypes),
        qualifiers: uniqueSorted(boundaries.flatMap((entry) => entry.requiredQualifiers)),
        rationale: "The provider may compress and phrase only this approved evidence within the listed claim boundaries.",
    };
}
function uniqueThemes(context) {
    const seen = new Set();
    return [
        ...context.approvedPlan.positioning.primaryThemes,
        ...context.approvedPlan.positioning.secondaryThemes,
        ...context.approvedPlan.positioning.differentiationThemes,
    ].filter((theme) => {
        const key = theme.label.toLowerCase();
        if (seen.has(key) || !theme.evidenceIds.length)
            return false;
        seen.add(key);
        return true;
    });
}
function claimTypesForEvidence(evidence) {
    if (!evidence)
        return ["responsibility"];
    return {
        role: ["scope", "responsibility"],
        project: ["project", "responsibility", "capability-theme", "scope", "technology", "domain"],
        skill: ["technology", "capability-theme"],
        tool: ["technology"],
        responsibility: ["responsibility", "capability-theme", "scope", "leadership-behavior", "technology", "domain"],
        achievement: ["achievement", "delivery-outcome", "business-outcome", "quantified-outcome", "leadership-behavior", "scope"],
        domain: ["domain"],
        education: ["education"],
        certification: ["certification"],
        recommendation: ["capability-theme"],
    }[evidence.category];
}
function roleHeader(entry) {
    return [entry.title, entry.company, entry.dateRange].filter(Boolean).join(" | ");
}
function marketFacingLabel(value) {
    return value.replace(/\bAi\b/g, "AI").replace(/\bApi\b/g, "API").replace(/\bCto\b/g, "CTO");
}
function publicContactItems(profile) {
    if (!profile)
        return [];
    return [profile.location, profile.email, profile.website, profile.linkedin, profile.github]
        .filter((value) => Boolean(value));
}
function exclusion(compositionId, subjectType, subjectId, label, reason) {
    return {
        id: `role-composition-exclusion_${hashText([compositionId, subjectType, subjectId, reason].join("\0")).slice(0, 16)}`,
        subjectType,
        subjectId,
        label,
        reason,
    };
}
function isAuditPlaceholder(text) {
    return /\b(?:reviewed (?:role|project|professional|education|evidence)|within reviewed scope|evaluated .+ in a reviewed project)\b/i.test(text);
}
function emptyCareerProfile() {
    return CareerProfileSchema.parse({
        id: "career_profile",
        updatedAt: new Date(0).toISOString(),
        positioningCandidates: [],
        summaryThemes: [],
        roles: [],
        projects: [],
        skills: [],
        domains: [],
        approvedClaims: [],
        claimsNeedingConfirmation: [],
        blockedClaims: [],
        resumeReadyClaims: [],
        genericOnlyClaims: [],
        internalOnlyClaims: [],
        publicSafetyRules: [],
    });
}
function compositionResult(composition, paths, result) {
    return {
        targetId: composition.targetId,
        result,
        compositionId: composition.id,
        completeness: composition.completeness.status,
        usableForDrafting: composition.completeness.usableForDrafting,
        experienceEntryCount: composition.experienceEntries.filter((entry) => entry.decision === "include").length,
        projectEntryCount: composition.projectEntries.filter((entry) => entry.decision === "include").length,
        skillCount: composition.skills.filter((entry) => entry.decision === "include").length,
        compositionPath: paths.compositionRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
}
function emptyStatus(base, status, reasons) {
    return {
        ...base,
        compositionHashMatches: null,
        dependenciesMatch: null,
        policyVersionMatches: null,
        status,
        usableForDrafting: false,
        reasons,
    };
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const absolute = path.resolve(root, relativePath);
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`))
        throw new Error("Resolved path leaves workspace.");
    return absolute;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
