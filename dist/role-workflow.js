import path from "node:path";
import { z } from "zod";
import { hashFile, hashText, pathExists, readJson, writeBufferAtomic, writeJsonAtomic, } from "./fs-utils.js";
import { createModelProvider, loadModelProviderConfiguration, } from "./model-provider.js";
import { calculateEvidenceFoundationSnapshot } from "./evidence-snapshots.js";
import { analyzeTarget, getTargetAnalysisStatus } from "./target-analysis.js";
import { createRoleTarget, showTarget, } from "./targets.js";
import { getApprovedInterpretationStatus } from "./approved-interpretation.js";
import { getApprovedEvidenceMatchingStatus } from "./evidence-matching.js";
import { getFitAssessmentStatus } from "./fit-assessment.js";
import { getRoleResumePlanStatus } from "./role-resume-planning.js";
import { getRoleResumeDraftScaffoldStatus } from "./role-resume-drafting.js";
import { getApprovedRoleResumeDraftStatus } from "./approved-role-resume-draft.js";
import { composeRoleResumeRenderDocument, getRoleResumeRenderDocumentStatus, normalizeRoleResumeRenderOptions, } from "./role-resume-rendering.js";
import { exportRoleResume, } from "./role-resume-render-export.js";
import { stableJson } from "./target-proposal.js";
export const GUIDED_ROLE_POLICY_NAME = "guided-role-resume-policy";
export const GUIDED_ROLE_POLICY_VERSION = "1";
export const ROLE_UNDERSTANDING_TAXONOMY_NAME = "prooflayer-built-in-role-taxonomy";
export const ROLE_UNDERSTANDING_TAXONOMY_VERSION = "1";
export const ROLE_UNDERSTANDING_PROMPT_ID = "target-role-understanding-proposal";
export const ROLE_UNDERSTANDING_PROMPT_VERSION = "1";
const UNDERSTANDING_FILE = "role-understanding.json";
const MANIFEST_FILE = "role-understanding-manifest.json";
const RAW_RESPONSE_FILE = "raw-model-response.txt";
const RoleExpectationSchema = z.object({
    id: z.string().min(1),
    kind: z.enum(["responsibility", "capability", "leadership", "technical", "business", "operating-context"]),
    statement: z.string().trim().min(1),
    necessity: z.enum(["required", "preferred", "contextual"]),
    importance: z.enum(["critical", "high", "medium", "low"]),
    capabilityTags: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1),
    group: z.enum(["responsibilities", "capabilities", "leadership", "technical", "business", "operating-context"]),
    trustState: z.literal("generated"),
}).strict();
const RoleAmbiguitySchema = z.object({
    id: z.string().min(1),
    question: z.string().min(1),
    options: z.array(z.object({ id: z.string().min(1), label: z.string().min(1) }).strict()).min(2),
    selectedOptionId: z.string().min(1),
    selectionSource: z.enum(["conservative-default", "target-metadata", "user-choice"]),
    material: z.boolean(),
}).strict();
const ModelRoleUnderstandingPayloadSchema = z.object({
    summary: z.string().trim().min(1),
    seniority: z.string().trim().min(1).optional(),
    positioning: z.string().trim().min(1),
    expectations: z.array(RoleExpectationSchema.omit({ id: true, trustState: true })).min(3).max(12),
    ambiguity: z.object({
        question: z.string().trim().min(1),
        options: z.array(z.object({ id: z.string().min(1), label: z.string().min(1) }).strict()).min(2).max(5),
        conservativeDefaultId: z.string().min(1),
    }).strict().optional(),
}).strict();
const RoleUnderstandingSourceSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("built-in-taxonomy"),
        taxonomyName: z.literal(ROLE_UNDERSTANDING_TAXONOMY_NAME),
        taxonomyVersion: z.literal(ROLE_UNDERSTANDING_TAXONOMY_VERSION),
        templateId: z.string().min(1),
        templateSha256: z.string().regex(/^[a-f0-9]{64}$/),
    }).strict(),
    z.object({
        type: z.literal("model-proposal"),
        provider: z.string().min(1),
        model: z.string().min(1),
        settings: z.record(z.unknown()),
        promptId: z.literal(ROLE_UNDERSTANDING_PROMPT_ID),
        promptVersion: z.literal(ROLE_UNDERSTANDING_PROMPT_VERSION),
        renderedPromptSha256: z.string().regex(/^[a-f0-9]{64}$/),
        requestFingerprint: z.string().regex(/^[a-f0-9]{64}$/),
        rawResponsePath: z.string().min(1),
        rawResponseSha256: z.string().regex(/^[a-f0-9]{64}$/),
    }).strict(),
]);
export const GeneratedRoleUnderstandingSchema = z.object({
    schemaVersion: z.literal(1),
    id: z.string().regex(/^role-understanding_[a-f0-9]{16}$/),
    targetId: z.string().regex(/^role-[a-z0-9]+(?:-[a-z0-9]+)*$/),
    targetType: z.literal("role"),
    state: z.enum(["generated", "generated-with-ambiguity"]),
    title: z.string().min(1),
    summary: z.string().min(1),
    seniority: z.string().min(1).optional(),
    positioning: z.string().min(1),
    specialization: z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        source: z.enum(["conservative-default", "target-metadata", "user-choice"]),
    }).strict(),
    expectations: z.array(RoleExpectationSchema).min(1),
    ambiguities: z.array(RoleAmbiguitySchema).max(1),
    source: RoleUnderstandingSourceSchema,
    trust: z.object({
        state: z.literal("generated-unapproved"),
        historicalCandidateFact: z.literal(false),
        usableForConservativeProjection: z.boolean(),
        requiresHumanReviewBeforeCanonicalApproval: z.literal(true),
    }).strict(),
    policy: z.object({
        name: z.literal(GUIDED_ROLE_POLICY_NAME),
        version: z.literal(GUIDED_ROLE_POLICY_VERSION),
    }).strict(),
    targetSha256: z.string().regex(/^[a-f0-9]{64}$/),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
export const GeneratedRoleUnderstandingManifestSchema = z.object({
    schemaVersion: z.literal(1),
    targetId: z.string().min(1),
    understandingId: z.string().min(1),
    understandingPath: z.string().min(1),
    understandingSha256: z.string().regex(/^[a-f0-9]{64}$/),
    targetSha256: z.string().regex(/^[a-f0-9]{64}$/),
    policyName: z.literal(GUIDED_ROLE_POLICY_NAME),
    policyVersion: z.literal(GUIDED_ROLE_POLICY_VERSION),
    sourceType: z.enum(["built-in-taxonomy", "model-proposal"]),
    sourceSha256: z.string().regex(/^[a-f0-9]{64}$/),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
}).strict();
const COMMON_EXPECTATIONS = {
    stakeholder: expectation("leadership", "Align stakeholders around priorities, tradeoffs, and delivery decisions.", "required", "high", ["stakeholder", "alignment", "delivery"], "leadership"),
    roadmap: expectation("responsibility", "Shape roadmap priorities through discovery, sequencing, and delivery learning.", "required", "high", ["roadmap", "discovery", "delivery"], "responsibilities"),
    tradeoffs: expectation("technical", "Translate product goals into defensible technical and delivery tradeoffs.", "required", "high", ["product", "technical", "tradeoffs"], "technical"),
};
const ROLE_TEMPLATES = [
    {
        id: "cto",
        aliases: ["cto", "chief technology officer"],
        seniority: "executive technology leadership",
        summary: "A CTO opportunity commonly combines technology direction, product and business alignment, architecture judgement, and accountable delivery leadership.",
        positioning: "Product and technology leadership for CTO opportunities",
        specializations: [
            { id: "startup-product-cto", label: "Startup / Product CTO" },
            { id: "enterprise-transformation-cto", label: "Enterprise / Transformation CTO" },
            { id: "hands-on-technology-leader", label: "Hands-on Technology Leader" },
            { id: "general-cto", label: "General CTO" },
        ],
        defaultSpecializationId: "general-cto",
        ambiguityQuestion: "Which CTO direction best matches what you want?",
        expectations: [
            expectation("business", "Align technology strategy with product and business priorities.", "required", "critical", ["technology", "product", "strategy"], "business"),
            expectation("technical", "Guide architecture, platform, reliability, and technology-investment tradeoffs.", "required", "critical", ["architecture", "platform", "technology"], "technical"),
            expectation("leadership", "Lead technology delivery through clear operating priorities and accountable decisions.", "required", "critical", ["leadership", "delivery", "technology"], "leadership"),
            COMMON_EXPECTATIONS.stakeholder,
            expectation("capability", "Connect product discovery and customer needs to technical execution.", "required", "high", ["product", "discovery", "technical"], "capabilities"),
            expectation("operating-context", "Operate credibly across strategy and hands-on technical depth when the context requires it.", "contextual", "medium", ["strategy", "technical", "hands-on"], "operating-context"),
            expectation("capability", "Evaluate responsible uses of AI and automation where they support product or operational goals.", "preferred", "medium", ["ai", "automation", "product"], "capabilities"),
        ],
    },
    {
        id: "engineering-manager",
        aliases: ["engineering manager", "software engineering manager"],
        seniority: "engineering management",
        summary: "An Engineering Manager opportunity commonly combines people leadership, delivery ownership, technical judgement, and cross-functional product partnership.",
        positioning: "Engineering leadership grounded in product delivery and technical judgement",
        specializations: [
            { id: "people-delivery", label: "People and delivery" },
            { id: "platform-engineering", label: "Platform engineering" },
            { id: "product-engineering", label: "Product engineering" },
            { id: "general-engineering-manager", label: "General Engineering Manager" },
        ],
        defaultSpecializationId: "general-engineering-manager",
        ambiguityQuestion: "Which Engineering Manager direction best matches what you want?",
        expectations: [
            expectation("leadership", "Create clarity, accountability, and growth for an engineering team.", "required", "critical", ["leadership", "engineering", "team"], "leadership"),
            expectation("responsibility", "Guide predictable delivery while protecting quality and sustainable engineering practices.", "required", "critical", ["engineering", "delivery", "quality"], "responsibilities"),
            COMMON_EXPECTATIONS.tradeoffs,
            COMMON_EXPECTATIONS.stakeholder,
            expectation("capability", "Partner with product peers on discovery, scope, and roadmap decisions.", "required", "high", ["product", "discovery", "roadmap"], "capabilities"),
            expectation("technical", "Maintain enough technical depth to challenge architecture and execution decisions.", "contextual", "medium", ["technical", "architecture", "engineering"], "technical"),
        ],
    },
    {
        id: "technical-product-manager",
        aliases: ["technical product manager", "tpm"],
        seniority: "product leadership",
        summary: "A Technical Product Manager opportunity commonly combines discovery and prioritization with platform, integration, data, and engineering tradeoff fluency.",
        positioning: "Technical product leadership across discovery, platforms, and delivery",
        specializations: [{ id: "general-technical-product", label: "General Technical Product Manager" }],
        defaultSpecializationId: "general-technical-product",
        expectations: [
            COMMON_EXPECTATIONS.roadmap,
            COMMON_EXPECTATIONS.tradeoffs,
            expectation("capability", "Define clear product outcomes, requirements, and validation approaches.", "required", "critical", ["product", "requirements", "validation"], "capabilities"),
            expectation("technical", "Work credibly with platforms, integrations, APIs, data, and engineering constraints.", "required", "high", ["platform", "integration", "data"], "technical"),
            COMMON_EXPECTATIONS.stakeholder,
            expectation("business", "Connect technical product decisions to customer and business value.", "required", "high", ["product", "customer", "business"], "business"),
        ],
    },
    {
        id: "ai-product-manager",
        aliases: ["ai product manager", "ai pm"],
        seniority: "AI product leadership",
        summary: "An AI Product Manager opportunity commonly combines product discovery, AI-system constraints, evaluation, evidence-backed validation, and responsible decision support.",
        positioning: "AI product leadership grounded in evaluation and evidence-backed validation",
        specializations: [{ id: "general-ai-product", label: "General AI Product Manager" }],
        defaultSpecializationId: "general-ai-product",
        expectations: [
            COMMON_EXPECTATIONS.roadmap,
            expectation("capability", "Design AI-assisted workflows around a clear user problem and decision context.", "required", "critical", ["ai", "workflow", "product"], "capabilities"),
            expectation("technical", "Define evaluation scenarios, traceability, and evidence support for AI-generated outputs.", "required", "critical", ["ai", "evaluation", "traceability"], "technical"),
            expectation("capability", "Validate AI product behavior through iterative testing and qualitative feedback.", "required", "high", ["ai", "validation", "testing"], "capabilities"),
            COMMON_EXPECTATIONS.tradeoffs,
            COMMON_EXPECTATIONS.stakeholder,
        ],
    },
    {
        id: "head-of-engineering",
        aliases: ["head of engineering", "engineering director"],
        seniority: "senior engineering leadership",
        summary: "A Head of Engineering opportunity commonly combines engineering direction, organizational leadership, delivery systems, and product partnership.",
        positioning: "Senior engineering leadership with product and platform alignment",
        specializations: [{ id: "general-head-of-engineering", label: "General Head of Engineering" }],
        defaultSpecializationId: "general-head-of-engineering",
        expectations: [
            expectation("leadership", "Set engineering direction, operating expectations, and delivery accountability.", "required", "critical", ["engineering", "leadership", "delivery"], "leadership"),
            expectation("leadership", "Develop managers and engineers while shaping a sustainable organization.", "required", "high", ["leadership", "engineering", "team"], "leadership"),
            COMMON_EXPECTATIONS.tradeoffs,
            COMMON_EXPECTATIONS.stakeholder,
            expectation("business", "Align engineering investment with product and business priorities.", "required", "high", ["engineering", "product", "business"], "business"),
            expectation("technical", "Guide platform, architecture, reliability, and technical-risk decisions.", "required", "high", ["platform", "architecture", "reliability"], "technical"),
        ],
    },
    {
        id: "product-engineer",
        aliases: ["product engineer"],
        seniority: "product engineering",
        summary: "A Product Engineer opportunity commonly combines hands-on software delivery, product judgement, experimentation, and close customer or user feedback loops.",
        positioning: "Hands-on product engineering across discovery, experimentation, and delivery",
        specializations: [{ id: "general-product-engineer", label: "General Product Engineer" }],
        defaultSpecializationId: "general-product-engineer",
        expectations: [
            expectation("technical", "Build and iterate production-quality product experiences with sound engineering judgement.", "required", "critical", ["product", "engineering", "delivery"], "technical"),
            expectation("capability", "Translate user needs into scoped experiments and product decisions.", "required", "high", ["user", "experimentation", "product"], "capabilities"),
            expectation("capability", "Use qualitative and quantitative feedback to refine the product.", "required", "high", ["feedback", "validation", "product"], "capabilities"),
            COMMON_EXPECTATIONS.tradeoffs,
            COMMON_EXPECTATIONS.stakeholder,
        ],
    },
];
export async function createGuidedRole(workspace, input, options = {}) {
    return createRoleTarget(workspace, input, options);
}
export async function runRoleWorkflow(workspace, targetId, options = {}) {
    return orchestrateRoleWorkflow(workspace, targetId, "run", options);
}
export async function continueRoleWorkflow(workspace, targetId, options = {}) {
    return orchestrateRoleWorkflow(workspace, targetId, "continue", options);
}
async function orchestrateRoleWorkflow(workspace, targetId, mode, options) {
    const target = await requireRoleTarget(workspace, targetId);
    if (options.dryRun) {
        return {
            mode,
            dryRun: true,
            result: "dry-run",
            providerCallMade: false,
            status: await inspectRoleWorkflow(workspace, target.id),
        };
    }
    const analysis = await getTargetAnalysisStatus(workspace, target.id);
    if (analysis.status === "missing")
        await analyzeTarget(workspace, target.id, { now: options.now });
    else if (["stale", "invalid"].includes(analysis.status)) {
        if (!options.rebuildStale) {
            return pausedResult(mode, await inspectRoleWorkflow(workspace, target.id), "Role structure is stale or invalid; use --rebuild-stale after reviewing the target change.");
        }
        await analyzeTarget(workspace, target.id, { rebuild: true, now: options.now });
    }
    const before = await getGeneratedRoleUnderstandingStatus(workspace, target.id);
    let result = "already-current";
    let providerCallMade = false;
    if (before.status === "missing" || options.refresh || (options.specialization && before.status === "current")) {
        if (before.status === "current" && (options.refresh || options.specialization) && !options.rebuildStale) {
            return pausedResult(mode, await inspectRoleWorkflow(workspace, target.id), "A current generated role understanding exists; use --rebuild-stale to replace it explicitly.");
        }
        const generated = await generateRoleUnderstanding(workspace, target, options);
        result = before.status === "missing" ? "created" : "rebuilt";
        providerCallMade = generated.providerCallMade;
    }
    else if (["stale", "invalid"].includes(before.status)) {
        if (!options.rebuildStale) {
            return pausedResult(mode, await inspectRoleWorkflow(workspace, target.id), `Generated role understanding is ${before.status}; use --rebuild-stale explicitly.`);
        }
        const generated = await generateRoleUnderstanding(workspace, target, options);
        result = "rebuilt";
        providerCallMade = generated.providerCallMade;
    }
    return {
        mode,
        dryRun: false,
        result,
        providerCallMade,
        status: await inspectRoleWorkflow(workspace, target.id),
    };
}
export async function inspectRoleWorkflow(workspace, targetId) {
    const target = await requireRoleTarget(workspace, targetId);
    const understandingLifecycle = await getGeneratedRoleUnderstandingStatus(workspace, targetId);
    const understanding = understandingLifecycle.status === "current"
        ? await showGeneratedRoleUnderstanding(workspace, targetId)
        : undefined;
    const canonicalEntries = await Promise.all([
        safeStatus(() => getApprovedInterpretationStatus(workspace, targetId)),
        safeStatus(() => getApprovedEvidenceMatchingStatus(workspace, targetId)),
        safeStatus(() => getFitAssessmentStatus(workspace, targetId, "approved")),
        safeStatus(() => getRoleResumePlanStatus(workspace, targetId, "approved")),
        safeStatus(() => getRoleResumeDraftScaffoldStatus(workspace, targetId)),
        safeStatus(() => getApprovedRoleResumeDraftStatus(workspace, targetId)),
        safeStatus(() => getRoleResumeRenderDocumentStatus(workspace, targetId)),
    ]);
    const [approvedInterpretation, approvedMatching, assessment, plan, scaffold, approvedDraft, rendering] = canonicalEntries;
    const projection = understanding
        ? await deriveConservativeProjection(workspace, understanding)
        : emptyProjection(target.title);
    const selected = projection.links.length > 0 || approvedMatching.status === "current";
    const planReady = plan.status === "current";
    const scaffoldReady = scaffold.status === "current";
    const approvedReady = approvedDraft.status === "current";
    const rendered = rendering.status === "current";
    const stages = [
        stage("target", "current", "Role Target is available; its title is positioning input only."),
        stage("role-understanding", understandingLifecycle.status, understanding ? `${understanding.expectations.length} generated expectations are available from ${sourceLabel(understanding)}.` : "No generated role understanding is available."),
        stage("evidence-selection", selected ? "current" : understanding ? "waiting" : "missing", selected ? `${projection.selectedEvidenceIds.length} eligible evidence item(s) support the conservative projection.` : "No eligible evidence can yet be selected conservatively."),
        stage("positioning", understanding ? "current" : "waiting", understanding ? projection.positioning : "Positioning waits for role understanding."),
        stage("planning", planReady ? "current" : selected ? "current" : "waiting", planReady ? "A canonical approved Role Resume Content Plan is current." : selected ? "A derived conservative section outline is available; it is not a canonical approved plan." : "Planning waits for safe evidence."),
        stage("scaffold", scaffoldReady ? "current" : selected ? "current" : "waiting", scaffoldReady ? "A canonical prose-free scaffold is current." : selected ? "A product-level prose-free outline is available; canonical drafting gates remain unchanged." : "Draft structure waits for safe evidence."),
        stage("draft-proposal", "waiting", approvedInterpretation.status === "current" && planReady && scaffoldReady
            ? "Use the existing explicit Role draft proposal command; model output remains untrusted." : "Draft wording requires current canonical approvals and an explicit provider call."),
        stage("draft-review", approvedReady ? "current" : "human-action-required", approvedReady ? "Human-reviewed wording is approved." : "Human review is required before model-authored wording can be approved."),
        stage("approved-draft", approvedReady ? "current" : "missing", approvedReady ? "Approved structured draft is current." : "No approved structured draft is current."),
        stage("rendering", rendered ? "current" : "missing", rendered ? "Canonical rendering is current." : "Rendering waits for an approved draft."),
        stage("export", rendered ? "current" : "missing", rendered ? "Inspect current exports in Advanced Details." : "Export waits for approved rendering."),
    ];
    const overallState = rendered ? "complete"
        : approvedReady ? "ready-to-finalize"
            : understanding ? "ready-for-review"
                : understandingLifecycle.status === "invalid" ? "invalid"
                    : "not-started";
    const currentStage = rendered ? "export"
        : approvedReady ? "rendering"
            : selected ? "draft-review"
                : understanding ? "evidence-selection"
                    : "role-understanding";
    const noEvidence = projection.eligibleEvidenceCount === 0;
    const nextAction = rendered
        ? "No action is required; current Role resume rendering is available."
        : approvedReady
            ? "Export the approved resume."
            : !understanding
                ? "Generate a conservative role understanding from the title."
                : understanding.ambiguities[0]
                    ? "Choose one role direction, or keep the conservative default and continue."
                    : noEvidence
                        ? "Confirm only the material career evidence needed for this role; no source re-upload is required."
                        : selected
                            ? "Review the generated role understanding before approving any draft wording."
                            : "Generate a conservative role understanding from the title.";
    return {
        schemaVersion: 1,
        target,
        ...(understanding ? { understanding } : {}),
        understandingStatus: understandingLifecycle.status,
        fit: projection.fit,
        positioning: projection.positioning,
        strongestThemes: projection.strengths,
        weakerThemes: projection.weaker,
        materialGaps: projection.gaps,
        limitations: projection.limitations,
        evidenceLinks: projection.links,
        selectedEvidenceIds: projection.selectedEvidenceIds,
        selectedClaimIds: projection.selectedClaimIds,
        sectionPlan: projection.sectionPlan,
        draftPreview: {
            status: projection.links.length ? "evidence-backed-preview" : "empty",
            items: uniqueByClaim(projection.links).map((entry) => ({
                text: entry.claim,
                claimId: entry.claimId,
                evidenceId: entry.evidenceId,
            })),
            requiresHumanReview: true,
            canonicalApprovedDraft: false,
        },
        ...(understanding?.ambiguities[0] ? { ambiguity: understanding.ambiguities[0] } : {}),
        currentStage,
        overallState,
        ...(!understanding ? { blocker: { code: "ROLE_UNDERSTANDING_MISSING", message: "Generate the role understanding from the saved title." } } : {}),
        nextAction,
        stages,
        canonical: {
            approvedInterpretation: approvedInterpretation.status,
            approvedMatching: approvedMatching.status,
            assessment: assessment.status,
            plan: plan.status,
            scaffold: scaffold.status,
            approvedDraft: approvedDraft.status,
            rendering: rendering.status,
        },
    };
}
export async function finalizeRoleWorkflow(workspace, targetId, options = {}) {
    const status = await inspectRoleWorkflow(workspace, targetId);
    if (status.canonical.approvedDraft !== "current") {
        return { dryRun: options.dryRun ?? false, result: "paused", status, succeeded: [], failed: [] };
    }
    if (options.dryRun)
        return { dryRun: true, result: "paused", status, succeeded: [], failed: [] };
    const normalized = normalizeRoleResumeRenderOptions(options);
    const composition = await composeRoleResumeRenderDocument(workspace, targetId, options);
    const succeeded = [];
    const failed = [];
    for (const format of options.formats ?? ["markdown", "html", "docx"]) {
        try {
            succeeded.push(await exportRoleResume(workspace, targetId, {
                ...normalized,
                format,
                outputDir: options.outputDir,
                rebuild: options.rebuild,
                toolchain: options.toolchain,
            }));
        }
        catch (error) {
            failed.push({ format, error: errorMessage(error) });
        }
    }
    return {
        dryRun: false,
        result: failed.length ? "partial-failure" : composition.result === "already-current" && succeeded.every((entry) => entry.result === "already-current") ? "already-current" : "completed",
        status: await inspectRoleWorkflow(workspace, targetId),
        succeeded,
        failed,
    };
}
export async function showGeneratedRoleUnderstanding(workspace, targetId) {
    const paths = understandingPaths(workspace, targetId);
    if (!(await pathExists(paths.understandingPath)))
        throw new Error(`Generated role understanding not found: ${targetId}`);
    return GeneratedRoleUnderstandingSchema.parse(await readJson(paths.understandingPath, null));
}
export async function replayGeneratedRoleUnderstanding(workspace, targetId) {
    const lifecycle = await getGeneratedRoleUnderstandingStatus(workspace, targetId);
    if (lifecycle.status !== "current") {
        throw new Error(`Role-understanding replay requires a current artifact. Current status: ${lifecycle.status}`);
    }
    const understanding = await showGeneratedRoleUnderstanding(workspace, targetId);
    if (understanding.source.type !== "model-proposal") {
        throw new Error("Only model-proposed role understanding has raw response bytes to replay.");
    }
    const source = understanding.source;
    const target = await requireRoleTarget(workspace, targetId);
    const rawText = await import("node:fs/promises").then(({ readFile }) => readFile(resolveWithin(workspace, source.rawResponsePath), "utf8"));
    const payload = ModelRoleUnderstandingPayloadSchema.parse(JSON.parse(rawText));
    const selected = payload.ambiguity?.conservativeDefaultId ?? "general";
    const replayed = buildUnderstanding({
        target,
        targetSha256: understanding.targetSha256,
        summary: payload.summary,
        seniority: payload.seniority,
        positioning: payload.positioning,
        specialization: payload.ambiguity?.options.find((entry) => entry.id === selected)
            ?? { id: "general", label: "Conservative general positioning" },
        specializationSource: "conservative-default",
        expectations: payload.expectations,
        ambiguity: payload.ambiguity ? {
            question: payload.ambiguity.question,
            options: payload.ambiguity.options,
            selectedOptionId: selected,
            selectionSource: "conservative-default",
        } : undefined,
        source,
        createdAt: understanding.createdAt,
        updatedAt: understanding.updatedAt,
    });
    const originalSha256 = await hashFile(resolveWithin(workspace, lifecycle.understandingPath));
    const replaySha256 = hashText(`${JSON.stringify(replayed, null, 2)}\n`);
    return { targetId, originalSha256, replaySha256, matches: originalSha256 === replaySha256 };
}
export async function getGeneratedRoleUnderstandingStatus(workspace, targetId) {
    const paths = understandingPaths(workspace, targetId);
    const exists = await pathExists(paths.understandingPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = { understandingPath: paths.understandingRelativePath, manifestPath: paths.manifestRelativePath };
    if (!exists && !manifestExists)
        return { ...base, status: "missing", reasons: ["No generated role understanding exists."] };
    if (!exists || !manifestExists)
        return { ...base, status: "invalid", reasons: ["Generated role understanding artifact set is incomplete."] };
    let understanding;
    let manifest;
    try {
        understanding = GeneratedRoleUnderstandingSchema.parse(await readJson(paths.understandingPath, null));
        manifest = GeneratedRoleUnderstandingManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return { ...base, status: "invalid", reasons: [`Generated role understanding is malformed: ${errorMessage(error)}`] };
    }
    if (understanding.targetId !== targetId || manifest.targetId !== targetId || manifest.understandingId !== understanding.id) {
        return { ...base, status: "invalid", reasons: ["Generated role understanding identity does not match the requested Role Target."] };
    }
    const contentMatches = await hashFile(paths.understandingPath) === manifest.understandingSha256;
    if (!contentMatches)
        return { ...base, status: "invalid", reasons: ["Generated role understanding hash does not match its manifest."] };
    let target;
    try {
        target = await requireRoleTarget(workspace, targetId);
    }
    catch (error) {
        return { ...base, status: "invalid", reasons: [errorMessage(error)] };
    }
    const targetHash = await hashFile(targetPath(workspace, target));
    const recordedSourceHash = understanding.source.type === "model-proposal"
        ? understanding.source.rawResponseSha256
        : understanding.source.templateSha256;
    if (manifest.sourceSha256 !== recordedSourceHash || manifest.sourceType !== understanding.source.type) {
        return { ...base, status: "invalid", reasons: ["Generated role source identity does not match its manifest."] };
    }
    const reasons = [
        ...(targetHash !== manifest.targetSha256 || targetHash !== understanding.targetSha256 ? ["Role Target hash changed."] : []),
        ...(manifest.policyName !== GUIDED_ROLE_POLICY_NAME || manifest.policyVersion !== GUIDED_ROLE_POLICY_VERSION ? ["Guided Role policy changed."] : []),
        ...(understanding.source.type === "built-in-taxonomy" && understanding.source.templateSha256 !== hashText(stableJson(templateFor(target.title)))
            ? ["Built-in Role taxonomy entry changed."]
            : []),
    ];
    if (understanding.source.type === "model-proposal") {
        const rawPath = resolveWithin(workspace, understanding.source.rawResponsePath);
        if (!(await pathExists(rawPath)) || await hashFile(rawPath) !== understanding.source.rawResponseSha256) {
            return { ...base, status: "invalid", reasons: ["Stored model response is missing or does not match its recorded hash."] };
        }
    }
    return { ...base, status: reasons.length ? "stale" : "current", reasons };
}
async function generateRoleUnderstanding(workspace, target, options) {
    const targetSha256 = await hashFile(targetPath(workspace, target));
    const paths = understandingPaths(workspace, target.id);
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (await pathExists(paths.understandingPath)) {
        try {
            createdAt = (await showGeneratedRoleUnderstanding(workspace, target.id)).createdAt;
        }
        catch { /* explicit rebuild */ }
    }
    let understanding;
    if (options.provider) {
        understanding = await providerUnderstanding(workspace, target, targetSha256, options.provider, paths, createdAt, now);
    }
    else if (options.providerName) {
        const config = loadModelProviderConfiguration(options.environment);
        if (config.providerId !== options.providerName) {
            throw new Error(`Configured provider is ${config.providerId}, not ${options.providerName}.`);
        }
        if (config.providerId === "fake" && !options.offline) {
            throw new Error("The fake provider requires explicit --offline.");
        }
        understanding = await providerUnderstanding(workspace, target, targetSha256, createModelProvider(config), paths, createdAt, now);
    }
    else {
        understanding = builtInUnderstanding(target, targetSha256, options.specialization, createdAt, now);
    }
    if (understanding.source.type === "model-proposal" && !understanding.trust.requiresHumanReviewBeforeCanonicalApproval) {
        throw new Error("Model-generated role understanding cannot be auto-approved.");
    }
    await writeJsonAtomic(paths.understandingPath, understanding);
    const sourceSha256 = understanding.source.type === "model-proposal"
        ? understanding.source.rawResponseSha256
        : understanding.source.templateSha256;
    const manifest = GeneratedRoleUnderstandingManifestSchema.parse({
        schemaVersion: 1,
        targetId: target.id,
        understandingId: understanding.id,
        understandingPath: paths.understandingRelativePath,
        understandingSha256: await hashFile(paths.understandingPath),
        targetSha256,
        policyName: GUIDED_ROLE_POLICY_NAME,
        policyVersion: GUIDED_ROLE_POLICY_VERSION,
        sourceType: understanding.source.type,
        sourceSha256,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return { providerCallMade: understanding.source.type === "model-proposal" };
}
async function providerUnderstanding(workspace, target, targetSha256, provider, paths, createdAt, updatedAt) {
    const prompt = renderRoleUnderstandingPrompt(target);
    const renderedPromptSha256 = hashText(prompt);
    const requestFingerprint = hashText(stableJson({
        targetId: target.id,
        title: target.title,
        seniority: target.seniority ?? null,
        domain: target.domain ?? null,
        location: target.location ?? null,
        workingModel: target.workingModel ?? null,
        targetSha256,
        provider: provider.providerId,
        model: provider.identity.model,
        settings: provider.settings,
        promptId: ROLE_UNDERSTANDING_PROMPT_ID,
        promptVersion: ROLE_UNDERSTANDING_PROMPT_VERSION,
    }));
    const response = await provider.generate({ renderedPrompt: prompt, settings: provider.settings });
    if (!response.rawText.length)
        throw new Error("Model provider returned an empty role-understanding response.");
    let payload;
    try {
        payload = ModelRoleUnderstandingPayloadSchema.parse(JSON.parse(response.rawText));
    }
    catch (error) {
        throw new Error(`Role-understanding proposal failed schema validation: ${errorMessage(error)}`);
    }
    const selected = payload.ambiguity?.conservativeDefaultId ?? "general";
    if (payload.ambiguity && !payload.ambiguity.options.some((entry) => entry.id === selected)) {
        throw new Error("Role-understanding proposal ambiguity default is not one of its options.");
    }
    await writeBufferAtomic(paths.rawResponsePath, Buffer.from(response.rawText, "utf8"));
    const rawResponseSha256 = await hashFile(paths.rawResponsePath);
    const source = {
        type: "model-proposal",
        provider: provider.providerId,
        model: provider.identity.model,
        settings: provider.settings,
        promptId: ROLE_UNDERSTANDING_PROMPT_ID,
        promptVersion: ROLE_UNDERSTANDING_PROMPT_VERSION,
        renderedPromptSha256,
        requestFingerprint,
        rawResponsePath: paths.rawResponseRelativePath,
        rawResponseSha256,
    };
    return buildUnderstanding({
        target,
        targetSha256,
        summary: payload.summary,
        seniority: payload.seniority,
        positioning: payload.positioning,
        specialization: payload.ambiguity?.options.find((entry) => entry.id === selected) ?? { id: "general", label: "Conservative general positioning" },
        specializationSource: "conservative-default",
        expectations: payload.expectations,
        ambiguity: payload.ambiguity ? {
            question: payload.ambiguity.question,
            options: payload.ambiguity.options,
            selectedOptionId: selected,
            selectionSource: "conservative-default",
        } : undefined,
        source,
        createdAt,
        updatedAt,
    });
}
function builtInUnderstanding(target, targetSha256, requestedSpecialization, createdAt, updatedAt) {
    const template = templateFor(target.title);
    const targetDomain = target.domain ? slug(target.domain) : undefined;
    const selected = requestedSpecialization
        ? template.specializations.find((entry) => entry.id === slug(requestedSpecialization) || normalize(entry.label) === normalize(requestedSpecialization))
        : targetDomain
            ? template.specializations.find((entry) => entry.id === targetDomain || normalize(entry.label).includes(normalize(target.domain)))
            : undefined;
    if (requestedSpecialization && !selected) {
        throw new Error(`Unknown specialization for ${target.title}: ${requestedSpecialization}`);
    }
    const defaultSelection = template.specializations.find((entry) => entry.id === template.defaultSpecializationId);
    const specialization = selected ?? defaultSelection;
    const selectionSource = requestedSpecialization ? "user-choice"
        : selected ? "target-metadata"
            : "conservative-default";
    const templateSha256 = hashText(stableJson(template));
    return buildUnderstanding({
        target,
        targetSha256,
        summary: template.summary,
        seniority: target.seniority ?? template.seniority,
        positioning: template.positioning,
        specialization,
        specializationSource: selectionSource,
        expectations: template.expectations,
        ambiguity: template.ambiguityQuestion && selectionSource === "conservative-default"
            ? {
                question: template.ambiguityQuestion,
                options: template.specializations,
                selectedOptionId: specialization.id,
                selectionSource,
            }
            : undefined,
        source: {
            type: "built-in-taxonomy",
            taxonomyName: ROLE_UNDERSTANDING_TAXONOMY_NAME,
            taxonomyVersion: ROLE_UNDERSTANDING_TAXONOMY_VERSION,
            templateId: template.id,
            templateSha256,
        },
        createdAt,
        updatedAt,
    });
}
function buildUnderstanding(input) {
    const expectations = input.expectations.map((entry) => ({
        ...entry,
        id: `role-expectation_${hashText(stableJson({ targetId: input.target.id, statement: entry.statement, tags: entry.capabilityTags })).slice(0, 16)}`,
        trustState: "generated",
        capabilityTags: [...new Set(entry.capabilityTags)].sort(),
    })).sort((left, right) => left.id.localeCompare(right.id));
    const identity = stableJson({
        targetSha256: input.targetSha256,
        policy: GUIDED_ROLE_POLICY_VERSION,
        source: input.source,
        specialization: input.specialization,
        expectations,
    });
    const ambiguity = input.ambiguity ? [{
            id: `role-ambiguity_${hashText(stableJson({ targetId: input.target.id, ...input.ambiguity })).slice(0, 16)}`,
            ...input.ambiguity,
            material: true,
        }] : [];
    return GeneratedRoleUnderstandingSchema.parse({
        schemaVersion: 1,
        id: `role-understanding_${hashText(identity).slice(0, 16)}`,
        targetId: input.target.id,
        targetType: "role",
        state: ambiguity.length ? "generated-with-ambiguity" : "generated",
        title: input.target.title,
        summary: input.summary,
        ...(input.seniority ? { seniority: input.seniority } : {}),
        positioning: input.positioning,
        specialization: { ...input.specialization, source: input.specializationSource },
        expectations,
        ambiguities: ambiguity,
        source: input.source,
        trust: {
            state: "generated-unapproved",
            historicalCandidateFact: false,
            usableForConservativeProjection: true,
            requiresHumanReviewBeforeCanonicalApproval: true,
        },
        policy: { name: GUIDED_ROLE_POLICY_NAME, version: GUIDED_ROLE_POLICY_VERSION },
        targetSha256: input.targetSha256,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
    });
}
async function deriveConservativeProjection(workspace, understanding) {
    let snapshot;
    try {
        snapshot = await calculateEvidenceFoundationSnapshot(workspace);
    }
    catch {
        return emptyProjection(understanding.title, understanding.positioning, ["The current Evidence Foundation is unavailable."]);
    }
    const eligibleClaims = snapshot.claims.filter((entry) => entry.eligibility.roleMatching && entry.content);
    const evidenceById = new Map(snapshot.evidenceItems.filter((entry) => entry.content).map((entry) => [entry.id, entry]));
    const links = [];
    const allocatedClaimIds = new Set();
    const allocatedEvidenceIds = new Set();
    for (const expectation of understanding.expectations) {
        const candidates = eligibleClaims.flatMap((claimRecord) => {
            const claim = claimRecord.content;
            return claimRecord.supportingEvidenceIds.flatMap((evidenceId) => {
                const evidenceRecord = evidenceById.get(evidenceId);
                if (!evidenceRecord?.eligibility.roleMatching || !evidenceRecord.content)
                    return [];
                const evidence = evidenceRecord.content;
                const structured = new Set([...(evidence.domains ?? []), ...(evidence.technologies ?? [])].map(slug));
                const text = normalize(`${claim.approvedWording ?? claim.claim} ${evidence.normalizedSummary ?? evidence.text}`);
                const exactStructured = expectation.capabilityTags.filter((tag) => structured.has(tag)).length;
                const exactText = expectation.capabilityTags.filter((tag) => text.includes(normalize(tag.replaceAll("-", " ")))).length;
                const score = exactStructured * 3 + exactText;
                if (score < 2)
                    return [];
                return [{ claimRecord, claim, evidenceRecord, evidence, score, exactStructured }];
            });
        }).sort((left, right) => right.score - left.score || left.claimRecord.id.localeCompare(right.claimRecord.id));
        const unallocated = candidates.find(({ claimRecord, evidenceRecord }) => !allocatedClaimIds.has(claimRecord.id) && !allocatedEvidenceIds.has(evidenceRecord.id));
        const best = unallocated ?? candidates[0];
        if (!best)
            continue;
        const reused = !unallocated;
        if (!reused) {
            allocatedClaimIds.add(best.claimRecord.id);
            allocatedEvidenceIds.add(best.evidenceRecord.id);
        }
        links.push({
            expectationId: expectation.id,
            expectation: expectation.statement,
            claimId: best.claimRecord.id,
            claim: best.claim.approvedWording ?? best.claim.claim,
            evidenceId: best.evidenceRecord.id,
            evidence: best.evidence.normalizedSummary ?? best.evidence.text,
            relationship: !reused && best.exactStructured > 0 && best.score >= 4 ? "supporting" : "partial",
            rationale: reused
                ? "This approved claim or evidence item already supports a stronger theme, so this additional relationship remains partial."
                : best.exactStructured > 0
                    ? "An approved claim and eligible evidence share explicit reviewed domain or technology terms with this generated expectation."
                    : "An approved claim and eligible evidence share at least two explicit terms; the relationship remains partial until reviewed.",
        });
    }
    const linkByExpectation = new Map(links.map((entry) => [entry.expectationId, entry]));
    const required = understanding.expectations.filter((entry) => entry.necessity === "required");
    const supportedRequired = required.filter((entry) => linkByExpectation.get(entry.id)?.relationship === "supporting");
    const fit = snapshot.completeness.eligibleRoleEvidenceCount === 0 ? "insufficient evidence"
        : supportedRequired.length >= 3 && supportedRequired.length === required.length ? "strong"
            : supportedRequired.length >= 2 ? "credible"
                : supportedRequired.length === 1 ? "mixed"
                    : "stretch";
    const strengths = links.filter((entry) => entry.relationship === "supporting").slice(0, 5).map((entry) => ({
        theme: entry.expectation,
        evidence: entry.claim,
        claimId: entry.claimId,
        evidenceId: entry.evidenceId,
    }));
    const gaps = required.filter((entry) => linkByExpectation.get(entry.id)?.relationship !== "supporting")
        .slice(0, 5)
        .map((entry) => entry.statement);
    const weaker = links.filter((entry) => entry.relationship === "partial").slice(0, 4).map((entry) => entry.expectation);
    const selectedEvidenceIds = unique(links.map((entry) => entry.evidenceId));
    const selectedClaimIds = unique(links.map((entry) => entry.claimId));
    const categories = new Set(selectedEvidenceIds.map((id) => evidenceById.get(id)?.category).filter(Boolean));
    return {
        fit,
        positioning: understanding.positioning,
        strengths,
        weaker,
        gaps,
        limitations: [
            "Role expectations are generated market-positioning guidance, not facts about the candidate.",
            "Conservative links use only current public-safe, resume-ready reviewed evidence and remain unapproved until canonical review.",
            ...(understanding.source.type === "built-in-taxonomy" ? ["The built-in role model is a conservative offline taxonomy, not current market research."] : ["The model proposal is untrusted and requires human review before canonical approval."]),
        ],
        links,
        selectedEvidenceIds,
        selectedClaimIds,
        eligibleEvidenceCount: snapshot.completeness.eligibleRoleEvidenceCount,
        sectionPlan: [
            "headline",
            "professional-summary",
            "core-capabilities",
            ...(categories.has("role") || categories.has("responsibility") ? ["professional-experience"] : []),
            ...(categories.has("project") ? ["selected-projects"] : []),
            "technical-capabilities",
            "education",
            "certifications",
        ],
    };
}
function emptyProjection(title, positioning = `Conservative positioning for ${title}`, limitations = []) {
    return {
        fit: "insufficient evidence",
        positioning,
        strengths: [],
        weaker: [],
        gaps: [],
        limitations,
        links: [],
        selectedEvidenceIds: [],
        selectedClaimIds: [],
        eligibleEvidenceCount: 0,
        sectionPlan: [],
    };
}
function renderRoleUnderstandingPrompt(target) {
    return [
        `Prompt: ${ROLE_UNDERSTANDING_PROMPT_ID} v${ROLE_UNDERSTANDING_PROMPT_VERSION}`,
        "Create a conservative market role-understanding proposal from target metadata only.",
        `Target title: ${target.title}`,
        `Seniority: ${target.seniority ?? "not supplied"}`,
        `Domain: ${target.domain ?? "not supplied"}`,
        `Location: ${target.location ?? "not supplied"}`,
        `Working model: ${target.workingModel ?? "not supplied"}`,
        "Return strict JSON with summary, optional seniority, positioning, 3-12 expectations, and at most one material ambiguity.",
        "Each expectation requires kind, statement, necessity, importance, capabilityTags, and group.",
        "Do not assess the candidate, access career evidence, claim market recency, generate resume prose, or treat the target title as employment history.",
        "The output is an untrusted proposal and cannot approve itself.",
    ].join("\n");
}
function templateFor(title) {
    const normalized = normalize(title);
    return ROLE_TEMPLATES.find((entry) => entry.aliases.some((alias) => normalize(alias) === normalized)) ?? {
        id: `general-${slug(title)}`,
        aliases: [title],
        seniority: "not inferred",
        summary: `${title} is treated conservatively as a cross-functional role requiring clear outcomes, sound delivery judgement, and evidence-backed collaboration.`,
        positioning: `Evidence-backed positioning for ${title} opportunities`,
        specializations: [{ id: "general", label: `General ${title}` }],
        defaultSpecializationId: "general",
        expectations: [
            COMMON_EXPECTATIONS.roadmap,
            COMMON_EXPECTATIONS.stakeholder,
            COMMON_EXPECTATIONS.tradeoffs,
            expectation("capability", "Use evidence and feedback to validate priorities and outcomes.", "required", "high", ["evidence", "validation", "outcomes"], "capabilities"),
        ],
    };
}
function expectation(kind, statement, necessity, importance, capabilityTags, group) {
    return { kind, statement, necessity, importance, capabilityTags, group };
}
function understandingPaths(workspace, targetId) {
    const root = `targets/roles/${targetId}/guided-role`;
    return {
        understandingRelativePath: `${root}/${UNDERSTANDING_FILE}`,
        understandingPath: resolveWithin(workspace, `${root}/${UNDERSTANDING_FILE}`),
        manifestRelativePath: `${root}/${MANIFEST_FILE}`,
        manifestPath: resolveWithin(workspace, `${root}/${MANIFEST_FILE}`),
        rawResponseRelativePath: `${root}/${RAW_RESPONSE_FILE}`,
        rawResponsePath: resolveWithin(workspace, `${root}/${RAW_RESPONSE_FILE}`),
    };
}
function targetPath(workspace, target) {
    return resolveWithin(workspace, `targets/roles/${target.id}/target.json`);
}
async function requireRoleTarget(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "role")
        throw new Error("Guided Role workflow accepts Role Targets only.");
    return target;
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const resolved = path.resolve(root, relativePath);
    const relation = path.relative(root, resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Role workflow path escapes the workspace: ${relativePath}`);
    }
    return resolved;
}
function sourceLabel(understanding) {
    return understanding.source.type === "built-in-taxonomy"
        ? "the conservative built-in role model"
        : `an untrusted ${understanding.source.provider} proposal`;
}
function stage(stageName, status, detail) {
    return { stage: stageName, status, detail };
}
async function safeStatus(load) {
    try {
        return await load();
    }
    catch {
        return { status: "missing" };
    }
}
function pausedResult(mode, status, message) {
    return {
        mode,
        dryRun: false,
        result: "paused",
        providerCallMade: false,
        status: { ...status, overallState: "paused", blocker: { code: "EXPLICIT_REBUILD_REQUIRED", message }, nextAction: message },
    };
}
function normalize(value) {
    return value.normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function slug(value) {
    const result = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-+/g, "-");
    if (!result)
        throw new Error("A safe role value could not be derived.");
    return result;
}
function unique(values) {
    return [...new Set(values)].sort();
}
function uniqueByClaim(links) {
    const seen = new Set();
    return links.filter((entry) => {
        if (seen.has(entry.claimId))
            return false;
        seen.add(entry.claimId);
        return true;
    });
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
export function formatRoleWorkflowStatus(status, options = {}) {
    return [
        "ProofLayer Role Resume",
        "",
        status.target.title,
        "",
        "Current state:",
        humanCurrentState(status),
        "",
        "Recommended positioning:",
        status.positioning,
        "",
        "Qualitative fit:",
        status.fit,
        "",
        "Strongest evidence-backed themes:",
        ...(status.strongestThemes.length ? status.strongestThemes.map((entry) => `- ${entry.theme}\n  Evidence: ${entry.evidence}`) : ["- No eligible reviewed evidence is currently selected."]),
        "",
        "Material gaps and cautions:",
        ...(status.materialGaps.length ? status.materialGaps.map((entry) => `- ${entry}`) : ["- No additional material gap is identified by the conservative projection."]),
        ...status.limitations.map((entry) => `- ${entry}`),
        "",
        ...(status.ambiguity ? ["One optional clarification:", status.ambiguity.question, `Current conservative choice: ${status.understanding?.specialization.label}`, ""] : []),
        "Next:",
        status.nextAction,
        ...(options.verbose ? ["", "Advanced lifecycle:", ...status.stages.map((entry) => `- ${entry.stage}: ${entry.status} — ${entry.detail}`)] : []),
    ].join("\n");
}
export function formatRoleWorkflowJson(status) {
    return `${JSON.stringify(status, null, 2)}\n`;
}
export function formatRoleWorkflowRunResult(result) {
    return [
        formatRoleWorkflowStatus(result.status),
        "",
        `Run result: ${result.result}`,
        `Provider call made: ${result.providerCallMade ? "yes" : "no"}`,
        `Dry run: ${result.dryRun ? "yes" : "no"}`,
    ].join("\n");
}
export function formatFinalizeRoleWorkflowResult(result) {
    return [
        formatRoleWorkflowStatus(result.status),
        "",
        `Finalization result: ${result.result}`,
        `Succeeded: ${result.succeeded.map((entry) => entry.format).join(", ") || "none"}`,
        `Failed: ${result.failed.map((entry) => `${entry.format} (${entry.error})`).join(", ") || "none"}`,
        `Dry run: ${result.dryRun ? "yes" : "no"}`,
    ].join("\n");
}
function humanStage(stageName) {
    const labels = {
        target: "Target saved",
        "role-understanding": "Role understood",
        "evidence-selection": "Relevant experience selected",
        positioning: "Role positioning available",
        planning: "Resume preparation in progress",
        scaffold: "Resume prepared",
        "draft-proposal": "Draft proposal needed",
        "draft-review": "Ready for review",
        "approved-draft": "Draft approved",
        rendering: "Ready to export",
        export: "Exported",
    };
    return labels[stageName];
}
function humanCurrentState(status) {
    if (status.understandingStatus === "missing")
        return "Role understanding needed";
    if (status.understandingStatus === "stale")
        return "Role understanding needs an explicit rebuild";
    if (status.understandingStatus === "invalid")
        return "Role understanding is invalid";
    return humanStage(status.currentStage);
}
