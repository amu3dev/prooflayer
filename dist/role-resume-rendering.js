import path from "node:path";
import { getApprovedRoleResumeDraftStatus, approvedRoleResumeDraftPaths, showApprovedRoleResumeDraft, } from "./approved-role-resume-draft.js";
import { hashFile, hashText, pathExists, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { ApprovedRoleResumeDraftManifestSchema, } from "./role-resume-draft-schemas.js";
import { RoleResumeDateFormatSchema, RoleResumePageSizeSchema, RoleResumeRenderDocumentManifestSchema, RoleResumeRenderDocumentSchema, RoleResumeRenderProfileNameSchema, RoleResumeRenderProfileSchema, } from "./role-resume-render-schemas.js";
import { showTarget } from "./targets.js";
export const ROLE_RESUME_RENDERING_POLICY_NAME = "role-resume-rendering-policy";
export const ROLE_RESUME_RENDERING_POLICY_VERSION = "1";
export const ROLE_RESUME_COMPOSITION_RULES_VERSION = "2";
export const ROLE_RESUME_RENDER_PROFILE_VERSION = "1";
const SECTION_HEADINGS = {
    headline: null,
    "professional-summary": "Professional Summary",
    "core-capabilities": "Core Capabilities",
    "selected-impact": "Selected Impact",
    "professional-experience": "Professional Experience",
    "selected-projects": "Selected Projects",
    "technical-capabilities": "Technical Capabilities",
    "leadership-capabilities": "Leadership Capabilities",
    education: "Education",
    certifications: "Certifications",
    "additional-information": "Additional Information",
};
const ITEM_BLOCK_TYPES = {
    identity: "headline",
    contact: "paragraph",
    headline: "paragraph",
    summary: "paragraph",
    capability: "capability",
    impact: "bullet",
    "experience-role": "role-header",
    "experience-bullet": "bullet",
    project: "project-header",
    "project-bullet": "bullet",
    technology: "technology",
    "leadership-capability": "leadership-capability",
    education: "education",
    certification: "certification",
    "additional-information": "additional-information",
};
export function normalizeRoleResumeRenderOptions(options = {}) {
    return {
        profile: RoleResumeRenderProfileNameSchema.parse(options.profile ?? "ats-standard"),
        pageSize: RoleResumePageSizeSchema.parse(options.pageSize ?? "A4"),
        dateFormat: RoleResumeDateFormatSchema.parse(options.dateFormat ?? "MMM-YYYY"),
    };
}
export function resolveRoleResumeRenderProfile(profileName, pageSize) {
    const compact = profileName === "compact-professional";
    return RoleResumeRenderProfileSchema.parse({
        schemaVersion: 1,
        name: profileName,
        version: ROLE_RESUME_RENDER_PROFILE_VERSION,
        page: {
            size: pageSize,
            marginTopMm: compact ? 15 : 18,
            marginRightMm: compact ? 16 : 19,
            marginBottomMm: compact ? 15 : 18,
            marginLeftMm: compact ? 16 : 19,
        },
        typography: {
            baseFontFamily: "Arial",
            baseFontSizePt: compact ? 10 : 10.5,
            minimumFontSizePt: 10,
            headingScale: compact ? 1.12 : 1.18,
            lineHeight: compact ? 1.25 : 1.35,
        },
        spacing: {
            sectionBeforePt: compact ? 7 : 10,
            sectionAfterPt: compact ? 3 : 5,
            itemSpacingPt: compact ? 2 : 3,
        },
        layout: {
            columns: 1,
            useTablesForCoreContent: false,
            showSectionDividers: false,
        },
        pageBreakRules: [
            { blockType: "role-header", keepWithNext: true, avoidBreakInside: true },
            { blockType: "project-header", keepWithNext: true, avoidBreakInside: true },
            { blockType: "headline", keepWithNext: true, avoidBreakInside: true },
        ],
        accessibility: {
            language: "en",
            direction: "ltr",
            logicalHeadingHierarchy: true,
            semanticLists: true,
            visibleLinkText: true,
            colorOnlyMeaning: false,
            iconsRequiredForMeaning: false,
            singleColumnReadingOrder: true,
            formalCertificationClaimed: false,
        },
    });
}
export async function composeRoleResumeRenderDocument(workspace, targetId, options = {}) {
    const normalizedOptions = normalizeRoleResumeRenderOptions(options);
    const context = await loadRoleResumeRenderContext(workspace, targetId);
    const paths = roleResumeRenderDocumentPaths(workspace, targetId);
    const status = await getRoleResumeRenderDocumentStatus(workspace, targetId, normalizedOptions);
    if (status.status === "current") {
        const current = await showRoleResumeRenderDocument(workspace, targetId);
        return composeResult(current, paths, "already-current");
    }
    if (["stale", "invalid"].includes(status.status) && !options.rebuild) {
        throw new Error(`Canonical role resume render document is ${status.status}; use explicit --rebuild.`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.documentPath)) {
        try {
            createdAt = RoleResumeRenderDocumentSchema.parse(await readJson(paths.documentPath, null)).createdAt;
        }
        catch {
            // An explicit rebuild may replace an invalid canonical artifact.
        }
    }
    const profile = resolveRoleResumeRenderProfile(normalizedOptions.profile, normalizedOptions.pageSize);
    const normalizedOptionsSha256 = hashText(JSON.stringify(normalizedOptions));
    const documentId = `role-resume-render-document_${hashText([
        context.approvedDraftSha256,
        context.approvedDraftManifestSha256,
        ROLE_RESUME_RENDERING_POLICY_NAME,
        ROLE_RESUME_RENDERING_POLICY_VERSION,
        ROLE_RESUME_COMPOSITION_RULES_VERSION,
        profile.name,
        profile.version,
        normalizedOptions.pageSize,
        normalizedOptions.dateFormat,
        normalizedOptionsSha256,
    ].join("\0")).slice(0, 16)}`;
    const sections = buildRenderSections(context.approvedDraft, documentId);
    const sourceMap = buildRenderSourceMap(context.approvedDraft, context.approvedDraftSha256, documentId, sections);
    const identityItem = context.approvedDraft.sections.flatMap((section) => section.items).find((item) => item.itemType === "identity");
    const contactItem = context.approvedDraft.sections.flatMap((section) => section.items).find((item) => item.itemType === "contact");
    const warnings = [
        ...(!identityItem ? [renderNotice(documentId, "NO_CANDIDATE_NAME_AVAILABLE", "Candidate name is not present in the approved structured draft.")] : []),
        ...(!contactItem ? [renderNotice(documentId, "NO_CONTACT_INFORMATION_AVAILABLE", "Contact information is not present in the approved structured draft.")] : []),
        renderNotice(documentId, "ACCESSIBILITY_NOT_FORMALLY_CERTIFIED", "The profile applies deterministic accessibility rules but does not claim formal certification."),
        renderNotice(documentId, "EXPORT_NOT_JOB_SPECIFIC", "This document is a role-positioning resume and is not tailored to a Job Target."),
    ];
    const ambiguities = normalizedOptions.dateFormat === "exact-source"
        ? []
        : [{
                id: `render-ambiguity_${hashText([documentId, "DATE_DISPLAY_FORMAT_AMBIGUOUS"].join("\0")).slice(0, 16)}`,
                code: "DATE_DISPLAY_FORMAT_AMBIGUOUS",
                message: "Approved draft dates are embedded in reviewed item text rather than separate structured date fields.",
                resolution: "Preserve the approved text exactly; do not infer or reformat missing date components.",
                sectionIds: [],
                draftItemIds: [],
                formats: [],
            }];
    const validation = validateCanonicalComposition(context.approvedDraft, sections, sourceMap, warnings, ambiguities);
    const document = RoleResumeRenderDocumentSchema.parse({
        schemaVersion: 1,
        id: documentId,
        targetId,
        targetType: "role",
        mode: "market-positioning",
        approvedDraft: {
            id: context.approvedDraft.id,
            path: context.draftPath,
            sha256: context.approvedDraftSha256,
            manifestPath: context.draftManifestPath,
            manifestSha256: context.approvedDraftManifestSha256,
        },
        renderingPolicy: {
            name: ROLE_RESUME_RENDERING_POLICY_NAME,
            version: ROLE_RESUME_RENDERING_POLICY_VERSION,
        },
        profile,
        dateFormat: normalizedOptions.dateFormat,
        metadata: {
            documentTitle: `${context.approvedDraft.roleTitle} Resume`,
            targetRoleTitle: context.approvedDraft.roleTitle,
            ...(identityItem ? { candidateName: identityItem.text } : {}),
            language: "en",
            direction: "ltr",
            documentType: "role-resume",
            generatedBy: {
                system: "ProofLayer",
                policyName: ROLE_RESUME_RENDERING_POLICY_NAME,
                policyVersion: ROLE_RESUME_RENDERING_POLICY_VERSION,
            },
        },
        sections,
        sourceMap,
        validation,
        provenance: {
            approvedDraftSha256: context.approvedDraftSha256,
            approvedDraftManifestSha256: context.approvedDraftManifestSha256,
            approvedPlanSha256: context.approvedDraft.provenance.approvedPlanSha256,
            compositionRulesVersion: ROLE_RESUME_COMPOSITION_RULES_VERSION,
            normalizedOptionsSha256,
        },
        createdAt,
        updatedAt: now,
    });
    if (document.validation.status !== "valid") {
        throw new Error(`Canonical role resume validation failed with ${document.validation.risks.length} risk(s).`);
    }
    await writeJsonAtomic(paths.documentPath, document);
    const manifest = RoleResumeRenderDocumentManifestSchema.parse({
        schemaVersion: 1,
        canonicalDocumentId: document.id,
        targetId,
        documentPath: paths.documentRelativePath,
        documentSha256: await hashFile(paths.documentPath),
        approvedDraftSha256: context.approvedDraftSha256,
        approvedDraftManifestSha256: context.approvedDraftManifestSha256,
        approvedPlanSha256: context.approvedDraft.provenance.approvedPlanSha256,
        profileName: profile.name,
        profileVersion: profile.version,
        policyName: ROLE_RESUME_RENDERING_POLICY_NAME,
        policyVersion: ROLE_RESUME_RENDERING_POLICY_VERSION,
        pageSize: normalizedOptions.pageSize,
        dateFormat: normalizedOptions.dateFormat,
        compositionRulesVersion: ROLE_RESUME_COMPOSITION_RULES_VERSION,
        normalizedOptionsSha256,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return composeResult(document, paths, status.status === "missing" ? "created" : "rebuilt");
}
export async function showRoleResumeRenderDocument(workspace, targetId) {
    const paths = roleResumeRenderDocumentPaths(workspace, targetId);
    if (!(await pathExists(paths.documentPath)))
        throw new Error(`Canonical role resume render document not found: ${targetId}`);
    return RoleResumeRenderDocumentSchema.parse(await readJson(paths.documentPath, null));
}
export async function getRoleResumeRenderDocumentStatus(workspace, targetId, requestedOptions) {
    const paths = roleResumeRenderDocumentPaths(workspace, targetId);
    const documentExists = await pathExists(paths.documentPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = {
        targetId,
        documentExists,
        manifestExists,
        documentPath: paths.documentRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!documentExists && !manifestExists)
        return emptyRenderStatus(base, "missing", ["Canonical render document is missing."]);
    if (!documentExists || !manifestExists)
        return emptyRenderStatus(base, "invalid", ["Canonical render artifact set is incomplete."]);
    let document;
    let manifest;
    try {
        document = RoleResumeRenderDocumentSchema.parse(await readJson(paths.documentPath, null));
        manifest = RoleResumeRenderDocumentManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyRenderStatus(base, "invalid", [`Canonical render artifact is malformed: ${errorMessage(error)}`]);
    }
    const documentHashMatches = await hashFile(paths.documentPath) === manifest.documentSha256;
    if (!documentHashMatches ||
        document.id !== manifest.canonicalDocumentId ||
        document.targetId !== targetId ||
        manifest.targetId !== targetId ||
        manifest.documentPath !== paths.documentRelativePath ||
        document.validation.status !== "valid") {
        return {
            ...emptyRenderStatus(base, "invalid", ["Canonical render identity, hash, path, or validation is invalid."]),
            documentHashMatches,
        };
    }
    const draftStatus = await getApprovedRoleResumeDraftStatus(workspace, targetId);
    const approvedDraftCurrent = draftStatus.status === "current" && draftStatus.usableForRendering;
    const draftPaths = approvedRoleResumeDraftPaths(workspace, targetId);
    const approvedDraftHashMatches = approvedDraftCurrent
        && await hashFile(draftPaths.draftPath) === manifest.approvedDraftSha256;
    const approvedDraftManifestHashMatches = approvedDraftCurrent
        && await hashFile(draftPaths.manifestPath) === manifest.approvedDraftManifestSha256;
    const policyVersionMatches = manifest.policyName === ROLE_RESUME_RENDERING_POLICY_NAME
        && manifest.policyVersion === ROLE_RESUME_RENDERING_POLICY_VERSION
        && document.renderingPolicy.name === ROLE_RESUME_RENDERING_POLICY_NAME
        && document.renderingPolicy.version === ROLE_RESUME_RENDERING_POLICY_VERSION
        && manifest.compositionRulesVersion === ROLE_RESUME_COMPOSITION_RULES_VERSION;
    const profileVersionMatches = manifest.profileVersion === ROLE_RESUME_RENDER_PROFILE_VERSION
        && document.profile.version === ROLE_RESUME_RENDER_PROFILE_VERSION;
    const optionsMatch = requestedOptions
        ? manifest.profileName === requestedOptions.profile
            && manifest.pageSize === requestedOptions.pageSize
            && manifest.dateFormat === requestedOptions.dateFormat
            && manifest.normalizedOptionsSha256 === hashText(JSON.stringify(requestedOptions))
        : true;
    const reasons = [
        ...(!approvedDraftCurrent ? ["Approved Role Resume Draft is not current and usable for rendering."] : []),
        ...(!approvedDraftHashMatches ? ["Approved draft hash changed."] : []),
        ...(!approvedDraftManifestHashMatches ? ["Approved draft manifest hash changed."] : []),
        ...(!policyVersionMatches ? ["Rendering policy or composition rules changed."] : []),
        ...(!profileVersionMatches ? ["Render profile version changed."] : []),
        ...(!optionsMatch ? ["Requested render profile or options differ from the canonical document."] : []),
    ];
    return {
        ...base,
        documentHashMatches,
        approvedDraftCurrent,
        approvedDraftHashMatches,
        approvedDraftManifestHashMatches,
        policyVersionMatches,
        profileVersionMatches,
        optionsMatch,
        status: reasons.length ? "stale" : "current",
        reasons,
    };
}
export function roleResumeRenderDocumentPaths(workspace, targetId) {
    const root = `targets/roles/${targetId}/resume-rendering/canonical`;
    const documentRelativePath = `${root}/role-resume-render-document.json`;
    const manifestRelativePath = `${root}/render-document-manifest.json`;
    return {
        documentRelativePath,
        documentPath: resolveWithin(workspace, documentRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
export function formatComposeRoleResumeResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Canonical document ID: ${result.canonicalDocumentId}`,
        `Result: ${result.result}`,
        `Profile: ${result.profile}`,
        `Page size: ${result.pageSize}`,
        `Date format: ${result.dateFormat}`,
        `Sections: ${result.sectionCount}`,
        `Blocks: ${result.blockCount}`,
        `Warnings: ${result.warningCount}`,
        `Document path: ${result.documentPath}`,
        `Manifest path: ${result.manifestPath}`,
    ].join("\n");
}
export function formatRoleResumeRenderDocumentStatus(status) {
    return [
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Document hash matches: ${status.documentHashMatches ?? "n/a"}`,
        `Approved draft current: ${status.approvedDraftCurrent ?? "n/a"}`,
        `Approved draft hash matches: ${status.approvedDraftHashMatches ?? "n/a"}`,
        `Approved draft manifest hash matches: ${status.approvedDraftManifestHashMatches ?? "n/a"}`,
        `Policy version matches: ${status.policyVersionMatches ?? "n/a"}`,
        `Profile version matches: ${status.profileVersionMatches ?? "n/a"}`,
        `Options match: ${status.optionsMatch ?? "n/a"}`,
        `Document path: ${status.documentPath}`,
        `Manifest path: ${status.manifestPath}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((entry) => `- ${entry}`)] : []),
    ].join("\n");
}
function buildRenderSections(draft, documentId) {
    return draft.sections
        .filter((section) => section.status !== "excluded" && section.items.length > 0)
        .slice()
        .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
        .map((section) => ({
        id: `render-section_${hashText([documentId, section.id, section.type].join("\0")).slice(0, 16)}`,
        draftSectionId: section.id,
        type: section.type,
        order: section.order,
        heading: SECTION_HEADINGS[section.type],
        blocks: section.items.map((item, itemOrder) => {
            assertApprovedTrustState(item.trustState, item.id);
            const type = ITEM_BLOCK_TYPES[item.itemType];
            const rule = pageBreakRule(type);
            return {
                id: `render-block_${hashText([documentId, section.id, item.id, String(itemOrder)].join("\0")).slice(0, 16)}`,
                sectionId: section.id,
                draftItemId: item.id,
                draftItemType: item.itemType,
                type,
                order: itemOrder,
                text: item.text,
                trustState: item.trustState,
                keepWithNext: rule.keepWithNext,
                avoidBreakInside: rule.avoidBreakInside,
            };
        }),
    }));
}
function assertApprovedTrustState(trustState, itemId) {
    if (!["deterministic-approved", "human-approved", "human-edited"].includes(trustState)) {
        throw new Error(`Approved Role Resume Draft item is not approved for rendering: ${itemId}`);
    }
}
function buildRenderSourceMap(draft, approvedDraftSha256, documentId, sections) {
    const itemById = new Map(draft.sections.flatMap((section) => section.items).map((item) => [item.id, item]));
    return sections.flatMap((section) => section.blocks.map((block) => {
        const item = itemById.get(block.draftItemId);
        if (!item)
            throw new Error(`Render block references unknown approved draft item: ${block.draftItemId}`);
        return {
            id: `render-source_${hashText([documentId, block.id, item.id].join("\0")).slice(0, 16)}`,
            documentBlockId: block.id,
            sectionId: item.sectionId,
            draftItemId: item.id,
            statementTextSha256: hashText(item.text),
            expectationIds: item.sourceExpectationIds,
            assessmentIds: item.sourceAssessmentIds,
            approvedMatchIds: item.approvedMatchIds,
            evidenceIds: item.evidenceIds,
            claimBoundaryIds: item.claimBoundaryIds,
            approvedDraftSha256,
            visibleTextLocation: {
                sectionOrder: section.order,
                itemOrder: block.order,
            },
        };
    }));
}
function validateCanonicalComposition(draft, sections, sourceMap, warnings, ambiguities) {
    const expectedSections = draft.sections
        .filter((section) => section.status !== "excluded" && section.items.length > 0)
        .slice()
        .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
    const expectedItems = expectedSections.flatMap((section) => section.items);
    const renderedItems = sections.flatMap((section) => section.blocks);
    const risks = [];
    const addRisk = (code, message, sectionIds = [], draftItemIds = []) => {
        risks.push({
            id: `render-risk_${hashText([code, message, ...sectionIds, ...draftItemIds].join("\0")).slice(0, 16)}`,
            code,
            severity: "critical",
            message,
            sectionIds,
            draftItemIds,
            formats: [],
            validationStage: "canonical",
        });
    };
    const exactTextPreserved = expectedItems.length === renderedItems.length
        && expectedItems.every((item, index) => renderedItems[index]?.text === item.text);
    if (!exactTextPreserved)
        addRisk("VISIBLE_TEXT_MISMATCH", "Canonical blocks do not preserve exact approved item text.");
    const sectionOrderPreserved = expectedSections.every((section, index) => sections[index]?.draftSectionId === section.id && sections[index]?.order === section.order);
    if (!sectionOrderPreserved)
        addRisk("SECTION_ORDER_MISMATCH", "Canonical section order differs from the approved draft.");
    const itemOrderPreserved = expectedItems.every((item, index) => renderedItems[index]?.draftItemId === item.id);
    if (!itemOrderPreserved)
        addRisk("ITEM_ORDER_MISMATCH", "Canonical item order differs from the approved draft.");
    const sourceMapComplete = sourceMap.length === renderedItems.length
        && renderedItems.every((block) => sourceMap.some((entry) => entry.documentBlockId === block.id
            && entry.draftItemId === block.draftItemId
            && entry.statementTextSha256 === hashText(block.text)));
    if (!sourceMapComplete)
        addRisk("SOURCE_MAP_INCOMPLETE", "One or more visible blocks lack exact source-map provenance.");
    const visible = renderedItems.map((entry) => entry.text).join("\n");
    const privateMetadataAbsent = !/(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\|evidence_[a-z0-9]|claim_[a-z0-9]|sha256)/i.test(visible);
    if (!privateMetadataAbsent)
        addRisk("PRIVATE_METADATA_EXPOSED", "Visible canonical text exposes internal paths, IDs, or hashes.");
    return {
        status: risks.length ? "invalid" : "valid",
        exactTextPreserved,
        sectionOrderPreserved,
        itemOrderPreserved,
        sourceMapComplete,
        privateMetadataAbsent,
        risks,
        warnings,
        ambiguities,
    };
}
async function loadRoleResumeRenderContext(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "role")
        throw new Error("Role resume rendering supports Role Targets only.");
    const status = await getApprovedRoleResumeDraftStatus(workspace, targetId);
    if (status.status !== "current") {
        throw new Error(`Approved Role Resume Draft must be current before rendering. Current status: ${status.status}`);
    }
    if (!status.usableForRendering)
        throw new Error("Approved Role Resume Draft is not complete or usable for rendering.");
    const paths = approvedRoleResumeDraftPaths(workspace, targetId);
    const approvedDraft = await showApprovedRoleResumeDraft(workspace, targetId);
    const manifest = ApprovedRoleResumeDraftManifestSchema.parse(await readJson(paths.manifestPath, null));
    if (approvedDraft.completeness.status !== "complete"
        || !approvedDraft.completeness.usableForRendering
        || !approvedDraft.completeness.claimLedgerComplete
        || !approvedDraft.completeness.provenanceComplete
        || approvedDraft.completeness.unresolvedCriticalIssueCount > 0
        || approvedDraft.risks.some((risk) => risk.severity === "critical"))
        throw new Error("Approved Role Resume Draft is incomplete, has unresolved critical risk, or lacks provenance.");
    return {
        approvedDraft,
        approvedDraftSha256: await hashFile(paths.draftPath),
        approvedDraftManifestSha256: await hashFile(paths.manifestPath),
        draftPath: paths.draftRelativePath,
        draftManifestPath: paths.manifestRelativePath,
        manifest,
    };
}
function pageBreakRule(type) {
    if (["role-header", "project-header", "headline"].includes(type)) {
        return { keepWithNext: true, avoidBreakInside: true };
    }
    return { keepWithNext: false, avoidBreakInside: true };
}
function renderNotice(documentId, code, message) {
    return {
        id: `render-warning_${hashText([documentId, code].join("\0")).slice(0, 16)}`,
        code,
        message,
        sectionIds: [],
        draftItemIds: [],
        formats: [],
    };
}
function composeResult(document, paths, result) {
    return {
        targetId: document.targetId,
        canonicalDocumentId: document.id,
        result,
        profile: document.profile.name,
        pageSize: document.profile.page.size,
        dateFormat: document.dateFormat,
        sectionCount: document.sections.length,
        blockCount: document.sections.reduce((count, section) => count + section.blocks.length, 0),
        warningCount: document.validation.warnings.length,
        documentPath: paths.documentRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
}
function emptyRenderStatus(base, status, reasons) {
    return {
        ...base,
        documentHashMatches: null,
        approvedDraftCurrent: null,
        approvedDraftHashMatches: null,
        approvedDraftManifestHashMatches: null,
        policyVersionMatches: null,
        profileVersionMatches: null,
        optionsMatch: null,
        status,
        reasons,
    };
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const absolute = path.resolve(root, relativePath);
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`))
        throw new Error("Path escapes the ProofLayer workspace.");
    return absolute;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
