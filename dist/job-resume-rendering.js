import path from "node:path";
import { approvedJobResumeDraftPaths, getApprovedJobResumeDraftStatus, showApprovedJobResumeDraft, } from "./approved-job-resume-draft.js";
import { hashFile, hashText, pathExists, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { ApprovedJobResumeDraftManifestSchema, } from "./job-resume-draft-schemas.js";
import { JobResumeRenderDocumentManifestSchema, JobResumeRenderDocumentSchema, } from "./job-resume-render-schemas.js";
import { normalizeRoleResumeRenderOptions, resolveRoleResumeRenderProfile, ROLE_RESUME_RENDER_PROFILE_VERSION, } from "./role-resume-rendering.js";
import { showTarget } from "./targets.js";
export const JOB_RESUME_RENDERING_POLICY_NAME = "job-resume-rendering-policy";
export const JOB_RESUME_RENDERING_POLICY_VERSION = "1";
export const JOB_RESUME_COMPOSITION_RULES_VERSION = "1";
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
    headline: "headline",
    summary: "paragraph",
    capability: "capability",
    impact: "bullet",
    "experience-role": "role-header",
    "experience-bullet": "bullet",
    project: "project-header",
    technology: "technology",
    "leadership-capability": "leadership-capability",
    education: "education",
    certification: "certification",
    "additional-information": "additional-information",
};
export async function composeJobResumeRenderDocument(workspace, targetId, options = {}) {
    const normalizedOptions = normalizeRoleResumeRenderOptions(options);
    const context = await loadJobResumeRenderContext(workspace, targetId);
    const paths = jobResumeRenderDocumentPaths(workspace, targetId);
    const status = await getJobResumeRenderDocumentStatus(workspace, targetId, normalizedOptions);
    if (status.status === "current") {
        return composeResult(await showJobResumeRenderDocument(workspace, targetId), paths, "already-current");
    }
    if (["stale", "invalid"].includes(status.status) && !options.rebuild) {
        throw new Error(`Canonical Job resume render document is ${status.status}; use explicit --rebuild.`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.documentPath)) {
        try {
            createdAt = JobResumeRenderDocumentSchema.parse(await readJson(paths.documentPath, null)).createdAt;
        }
        catch {
            // Explicit rebuild may replace an invalid canonical artifact.
        }
    }
    const profile = resolveRoleResumeRenderProfile(normalizedOptions.profile, normalizedOptions.pageSize);
    const normalizedOptionsSha256 = hashText(JSON.stringify(normalizedOptions));
    const documentId = `job-resume-render-document_${hashText([
        context.approvedDraftSha256,
        context.approvedDraftManifestSha256,
        JOB_RESUME_RENDERING_POLICY_NAME,
        JOB_RESUME_RENDERING_POLICY_VERSION,
        JOB_RESUME_COMPOSITION_RULES_VERSION,
        profile.name,
        profile.version,
        normalizedOptions.pageSize,
        normalizedOptions.dateFormat,
        normalizedOptionsSha256,
    ].join("\0")).slice(0, 16)}`;
    const sections = buildRenderSections(context.approvedDraft, documentId);
    const sourceMap = buildRenderSourceMap(context.approvedDraft, context.approvedDraftSha256, documentId, sections);
    const warnings = [
        renderNotice(documentId, "NO_CANDIDATE_NAME_AVAILABLE", "Candidate name is not present in the approved structured Job draft."),
        renderNotice(documentId, "NO_CONTACT_INFORMATION_AVAILABLE", "Contact information is not present in the approved structured Job draft."),
        renderNotice(documentId, "ACCESSIBILITY_NOT_FORMALLY_CERTIFIED", "The profile applies deterministic accessibility rules but does not claim formal certification."),
        renderNotice(documentId, "JOB_SPECIFIC_RENDER_ONLY", "This document renders an approved Job-specific draft and does not calculate fit or recommend an application."),
    ];
    const ambiguities = normalizedOptions.dateFormat === "exact-source"
        ? []
        : [{
                id: `job-render-ambiguity_${hashText([documentId, "DATE_DISPLAY_FORMAT_AMBIGUOUS"].join("\0")).slice(0, 16)}`,
                code: "DATE_DISPLAY_FORMAT_AMBIGUOUS",
                message: "Approved draft dates are embedded in reviewed item text rather than separate structured date fields.",
                resolution: "Preserve approved text exactly; do not infer or reformat date components.",
                sectionIds: [],
                draftItemIds: [],
                formats: [],
            }];
    const validation = validateCanonicalComposition(context.approvedDraft, sections, sourceMap, warnings, ambiguities);
    const document = JobResumeRenderDocumentSchema.parse({
        schemaVersion: 1,
        id: documentId,
        targetId,
        targetType: "job",
        mode: "job-specific-resume",
        approvedDraft: {
            id: context.approvedDraft.id,
            path: context.draftPath,
            sha256: context.approvedDraftSha256,
            manifestPath: context.draftManifestPath,
            manifestSha256: context.approvedDraftManifestSha256,
        },
        renderingPolicy: {
            name: JOB_RESUME_RENDERING_POLICY_NAME,
            version: JOB_RESUME_RENDERING_POLICY_VERSION,
        },
        profile,
        dateFormat: normalizedOptions.dateFormat,
        metadata: {
            documentTitle: `${context.approvedDraft.targetTitle} Resume`,
            targetRoleTitle: context.approvedDraft.targetTitle,
            language: "en",
            direction: "ltr",
            documentType: "job-resume",
            generatedBy: {
                system: "ProofLayer",
                policyName: JOB_RESUME_RENDERING_POLICY_NAME,
                policyVersion: JOB_RESUME_RENDERING_POLICY_VERSION,
            },
        },
        sections,
        sourceMap,
        validation,
        provenance: {
            approvedDraftSha256: context.approvedDraftSha256,
            approvedDraftManifestSha256: context.approvedDraftManifestSha256,
            contentPlanSha256: context.approvedDraft.provenance.contentPlanSha256,
            requirementModelSha256: context.approvedDraft.provenance.requirementModelSha256,
            evidenceMapSha256: context.approvedDraft.provenance.evidenceMapSha256,
            coverageSha256: context.approvedDraft.provenance.coverageSha256,
            assessmentSha256: context.approvedDraft.provenance.assessmentSha256,
            compositionRulesVersion: JOB_RESUME_COMPOSITION_RULES_VERSION,
            normalizedOptionsSha256,
        },
        createdAt,
        updatedAt: now,
    });
    if (document.validation.status !== "valid") {
        throw new Error(`Canonical Job resume validation failed with ${document.validation.risks.length} risk(s).`);
    }
    await writeJsonAtomic(paths.documentPath, document);
    const manifest = JobResumeRenderDocumentManifestSchema.parse({
        schemaVersion: 1,
        canonicalDocumentId: document.id,
        targetId,
        documentPath: paths.documentRelativePath,
        documentSha256: await hashFile(paths.documentPath),
        approvedDraftSha256: context.approvedDraftSha256,
        approvedDraftManifestSha256: context.approvedDraftManifestSha256,
        contentPlanSha256: context.approvedDraft.provenance.contentPlanSha256,
        requirementModelSha256: context.approvedDraft.provenance.requirementModelSha256,
        evidenceMapSha256: context.approvedDraft.provenance.evidenceMapSha256,
        coverageSha256: context.approvedDraft.provenance.coverageSha256,
        assessmentSha256: context.approvedDraft.provenance.assessmentSha256,
        profileName: profile.name,
        profileVersion: profile.version,
        policyName: JOB_RESUME_RENDERING_POLICY_NAME,
        policyVersion: JOB_RESUME_RENDERING_POLICY_VERSION,
        pageSize: normalizedOptions.pageSize,
        dateFormat: normalizedOptions.dateFormat,
        compositionRulesVersion: JOB_RESUME_COMPOSITION_RULES_VERSION,
        normalizedOptionsSha256,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return composeResult(document, paths, status.status === "missing" ? "created" : "rebuilt");
}
export async function showJobResumeRenderDocument(workspace, targetId) {
    const paths = jobResumeRenderDocumentPaths(workspace, targetId);
    if (!(await pathExists(paths.documentPath))) {
        throw new Error(`Canonical Job resume render document not found: ${targetId}`);
    }
    return JobResumeRenderDocumentSchema.parse(await readJson(paths.documentPath, null));
}
export async function getJobResumeRenderDocumentStatus(workspace, targetId, requestedOptions) {
    const paths = jobResumeRenderDocumentPaths(workspace, targetId);
    const documentExists = await pathExists(paths.documentPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = {
        targetId,
        documentExists,
        manifestExists,
        documentPath: paths.documentRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!documentExists && !manifestExists) {
        return emptyRenderStatus(base, "missing", ["Canonical Job render document is missing."]);
    }
    if (!documentExists || !manifestExists) {
        return emptyRenderStatus(base, "invalid", ["Canonical Job render artifact set is incomplete."]);
    }
    let document;
    let manifest;
    try {
        document = JobResumeRenderDocumentSchema.parse(await readJson(paths.documentPath, null));
        manifest = JobResumeRenderDocumentManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyRenderStatus(base, "invalid", [
            `Canonical Job render artifact is malformed: ${errorMessage(error)}`,
        ]);
    }
    const documentHashMatches = await hashFile(paths.documentPath) === manifest.documentSha256;
    if (!documentHashMatches
        || document.id !== manifest.canonicalDocumentId
        || document.targetId !== targetId
        || manifest.targetId !== targetId
        || manifest.documentPath !== paths.documentRelativePath
        || document.validation.status !== "valid") {
        return {
            ...emptyRenderStatus(base, "invalid", ["Canonical Job render identity, hash, path, or validation is invalid."]),
            documentHashMatches,
        };
    }
    const draftStatus = await getApprovedJobResumeDraftStatus(workspace, targetId);
    const approvedDraftCurrent = draftStatus.status === "current"
        && draftStatus.usableForRendering;
    const draftPaths = approvedJobResumeDraftPaths(workspace, targetId);
    const approvedDraftHashMatches = approvedDraftCurrent
        && await hashFile(draftPaths.draftPath) === manifest.approvedDraftSha256;
    const approvedDraftManifestHashMatches = approvedDraftCurrent
        && await hashFile(draftPaths.manifestPath) === manifest.approvedDraftManifestSha256;
    const policyVersionMatches = manifest.policyName === JOB_RESUME_RENDERING_POLICY_NAME
        && manifest.policyVersion === JOB_RESUME_RENDERING_POLICY_VERSION
        && document.renderingPolicy.name === JOB_RESUME_RENDERING_POLICY_NAME
        && document.renderingPolicy.version === JOB_RESUME_RENDERING_POLICY_VERSION
        && manifest.compositionRulesVersion === JOB_RESUME_COMPOSITION_RULES_VERSION;
    const profileVersionMatches = manifest.profileVersion === ROLE_RESUME_RENDER_PROFILE_VERSION
        && document.profile.version === ROLE_RESUME_RENDER_PROFILE_VERSION;
    const optionsMatch = requestedOptions
        ? manifest.profileName === requestedOptions.profile
            && manifest.pageSize === requestedOptions.pageSize
            && manifest.dateFormat === requestedOptions.dateFormat
            && manifest.normalizedOptionsSha256 === hashText(JSON.stringify(requestedOptions))
        : true;
    const reasons = [
        ...(!approvedDraftCurrent ? ["Approved Job Resume Draft is not current and usable for rendering."] : []),
        ...(!approvedDraftHashMatches ? ["Approved Job draft hash changed."] : []),
        ...(!approvedDraftManifestHashMatches ? ["Approved Job draft manifest hash changed."] : []),
        ...(!policyVersionMatches ? ["Job rendering policy or composition rules changed."] : []),
        ...(!profileVersionMatches ? ["Render profile version changed."] : []),
        ...(!optionsMatch ? ["Requested render profile or options differ from the canonical Job document."] : []),
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
export function jobResumeRenderDocumentPaths(workspace, targetId) {
    const root = `targets/jobs/${targetId}/resume-rendering/canonical`;
    const documentRelativePath = `${root}/job-resume-render-document.json`;
    const manifestRelativePath = `${root}/job-resume-render-document-manifest.json`;
    return {
        documentRelativePath,
        documentPath: resolveWithin(workspace, documentRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
export function formatComposeJobResumeResult(result) {
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
export function formatJobResumeRenderDocumentStatus(status) {
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
        .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id))
        .map((section) => ({
        id: `job-render-section_${hashText([documentId, section.id, section.type].join("\0")).slice(0, 16)}`,
        draftSectionId: section.id,
        type: section.type,
        order: section.order,
        heading: SECTION_HEADINGS[section.type],
        blocks: section.items.map((item, itemOrder) => {
            assertApprovedTrustState(item.trustState, item.id);
            const type = ITEM_BLOCK_TYPES[item.itemType];
            const rule = pageBreakRule(type);
            return {
                id: `job-render-block_${hashText([documentId, section.id, item.id, String(itemOrder)].join("\0")).slice(0, 16)}`,
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
function buildRenderSourceMap(draft, approvedDraftSha256, documentId, sections) {
    const itemById = new Map(draft.sections.flatMap((section) => section.items).map((item) => [item.id, item]));
    const ledgerByItemId = new Map(draft.claimLedger.map((entry) => [entry.draftItemId, entry]));
    return sections.flatMap((section) => section.blocks.map((block) => {
        const item = itemById.get(block.draftItemId);
        const ledger = ledgerByItemId.get(block.draftItemId);
        if (!item || !ledger) {
            throw new Error(`Render block lacks approved draft or claim-ledger provenance: ${block.draftItemId}`);
        }
        return {
            id: `job-render-source_${hashText([documentId, block.id, item.id, ledger.id].join("\0")).slice(0, 16)}`,
            documentBlockId: block.id,
            draftSectionId: item.sectionId,
            draftItemId: item.id,
            statementId: ledger.id,
            visibleTextSha256: hashText(item.text),
            requirementIds: item.requirementIds,
            coverageIds: item.coverageIds,
            assessmentIds: item.assessmentIds,
            evidenceMapLinkIds: item.evidenceMapLinkIds,
            evidenceIds: item.evidenceIds,
            claimIds: item.claimIds,
            claimBoundaryIds: item.claimBoundaryIds,
            metricPermissionIds: item.metricPermissionIds,
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
        .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
    const expectedItems = expectedSections.flatMap((section) => section.items);
    const renderedItems = sections.flatMap((section) => section.blocks);
    const risks = [];
    const addRisk = (code, message, sectionIds = [], draftItemIds = []) => risks.push({
        id: `job-render-risk_${hashText([code, message, ...sectionIds, ...draftItemIds].join("\0")).slice(0, 16)}`,
        code,
        severity: "critical",
        message,
        sectionIds,
        draftItemIds,
        formats: [],
        validationStage: "canonical",
    });
    const exactTextPreserved = expectedItems.length === renderedItems.length
        && expectedItems.every((item, index) => renderedItems[index]?.text === item.text);
    if (!exactTextPreserved) {
        addRisk("VISIBLE_TEXT_MISMATCH", "Canonical blocks do not preserve exact approved Job draft text.");
    }
    const sectionOrderPreserved = expectedSections.every((section, index) => sections[index]?.draftSectionId === section.id && sections[index]?.order === section.order);
    if (!sectionOrderPreserved) {
        addRisk("SECTION_ORDER_MISMATCH", "Canonical section order differs from the approved Job draft.");
    }
    const itemOrderPreserved = expectedItems.every((item, index) => renderedItems[index]?.draftItemId === item.id);
    if (!itemOrderPreserved) {
        addRisk("ITEM_ORDER_MISMATCH", "Canonical item order differs from the approved Job draft.");
    }
    const sourceMapComplete = sourceMap.length === renderedItems.length
        && renderedItems.every((block) => sourceMap.some((entry) => entry.documentBlockId === block.id
            && entry.draftItemId === block.draftItemId
            && entry.visibleTextSha256 === hashText(block.text)
            && entry.requirementIds.length > 0
            && entry.coverageIds.length > 0
            && entry.assessmentIds.length > 0
            && entry.evidenceMapLinkIds.length > 0
            && entry.evidenceIds.length > 0
            && entry.claimIds.length > 0
            && entry.claimBoundaryIds.length > 0));
    if (!sourceMapComplete) {
        addRisk("SOURCE_MAP_INCOMPLETE", "One or more visible Job blocks lack exact statement-level provenance.");
    }
    const visible = renderedItems.map((entry) => entry.text).join("\n");
    const privateMetadataAbsent = !/(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\|evidence_[a-z0-9]|claim_[a-z0-9]|sha256)/i.test(visible);
    if (!privateMetadataAbsent) {
        addRisk("PRIVATE_METADATA_EXPOSED", "Visible canonical text exposes internal paths, IDs, or hashes.");
    }
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
async function loadJobResumeRenderContext(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job") {
        throw new Error("Job resume rendering supports Job Targets only.");
    }
    const status = await getApprovedJobResumeDraftStatus(workspace, targetId);
    if (status.status !== "current") {
        throw new Error(`Approved Job Resume Draft must be current before rendering. Current status: ${status.status}`);
    }
    if (!status.usableForRendering) {
        throw new Error("Approved Job Resume Draft is not complete or usable for rendering.");
    }
    const paths = approvedJobResumeDraftPaths(workspace, targetId);
    const approvedDraft = await showApprovedJobResumeDraft(workspace, targetId);
    const manifest = ApprovedJobResumeDraftManifestSchema.parse(await readJson(paths.manifestPath, null));
    const items = approvedDraft.sections.flatMap((section) => section.items);
    const ledgerItemIds = new Set(approvedDraft.claimLedger.map((entry) => entry.draftItemId));
    if (approvedDraft.targetType !== "job"
        || approvedDraft.mode !== "job-specific-resume"
        || approvedDraft.completeness.status !== "complete"
        || !approvedDraft.completeness.usableForRendering
        || !approvedDraft.completeness.claimLedgerComplete
        || !approvedDraft.completeness.evidenceUsageComplete
        || !approvedDraft.completeness.provenanceComplete
        || approvedDraft.completeness.unresolvedCriticalIssueCount > 0
        || approvedDraft.risks.some((risk) => ["critical", "high"].includes(risk.severity))
        || items.some((item) => !ledgerItemIds.has(item.id))) {
        throw new Error("Approved Job Resume Draft is incomplete, unsafe, or lacks required ledgers and provenance.");
    }
    return {
        approvedDraft,
        approvedDraftSha256: await hashFile(paths.draftPath),
        approvedDraftManifestSha256: await hashFile(paths.manifestPath),
        draftPath: paths.draftRelativePath,
        draftManifestPath: paths.manifestRelativePath,
        manifest,
    };
}
function assertApprovedTrustState(trustState, itemId) {
    if (!["human-approved", "human-edited"].includes(trustState)) {
        throw new Error(`Approved Job Resume Draft item is not human-reviewed: ${itemId}`);
    }
}
function pageBreakRule(type) {
    if (["role-header", "project-header", "headline"].includes(type)) {
        return { keepWithNext: true, avoidBreakInside: true };
    }
    return { keepWithNext: false, avoidBreakInside: true };
}
function renderNotice(documentId, code, message) {
    return {
        id: `job-render-warning_${hashText([documentId, code].join("\0")).slice(0, 16)}`,
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
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
        throw new Error("Path escapes the ProofLayer workspace.");
    }
    return absolute;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
