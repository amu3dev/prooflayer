import { readFile } from "node:fs/promises";
import path from "node:path";
import { getApprovedEvidenceMatchingStatus } from "./evidence-matching.js";
import { getFitAssessmentStatus } from "./fit-assessment.js";
import { hashText, pathExists, writeBufferAtomic } from "./fs-utils.js";
import { getApprovedJobResumeDraftStatus } from "./approved-job-resume-draft.js";
import { getApprovedRoleResumeDraftStatus } from "./approved-role-resume-draft.js";
import { showJobFitProofAssessment, getJobFitProofAssessmentStatus } from "./job-fit-proof-assessment.js";
import { showJobRequirementModel, getJobRequirementModelStatus } from "./job-requirements.js";
import { getJobResumeDraftScaffoldStatus } from "./job-resume-drafting.js";
import { getJobResumePlanStatus, showJobResumePlan } from "./job-resume-planning.js";
import { inspectJobWorkflow, runJobWorkflow } from "./job-workflow.js";
import { getRoleResumeDraftScaffoldStatus } from "./role-resume-drafting.js";
import { getRoleResumePlanStatus } from "./role-resume-planning.js";
import { getRoleResumeRenderDocumentStatus } from "./role-resume-rendering.js";
import { analyzeTarget, getTargetAnalysisStatus } from "./target-analysis.js";
import { getTargetInterpretationStatus, interpretTarget, showTargetInterpretation } from "./target-interpretation.js";
import { createJobTarget, createRoleTarget, listTargets, showTarget, } from "./targets.js";
export async function startRoleResumeJourney(workspace, input) {
    const targetId = `role-${slugify(input.title)}`;
    let target;
    try {
        const existing = await showTarget(workspace, targetId);
        if (existing.type !== "role")
            throw new Error(`Target identity belongs to a ${existing.type} target.`);
        assertRoleInputCompatible(existing, input);
        target = existing;
    }
    catch (error) {
        if (!isMissingTarget(error))
            throw error;
        const created = await createRoleTarget(workspace, input);
        target = created.target;
    }
    const analysis = await getTargetAnalysisStatus(workspace, target.id);
    if (analysis.status === "missing")
        await analyzeTarget(workspace, target.id);
    const interpretation = await getTargetInterpretationStatus(workspace, target.id);
    if (interpretation.status === "missing")
        await interpretTarget(workspace, target.id);
    return inspectRoleResumeJourney(workspace, target.id);
}
export async function inspectRoleResumeJourney(workspace, targetId) {
    if (!targetId) {
        return {
            progress: defaultRoleProgress(),
            careerReady: false,
            currentValue: "Enter a target role to begin. Your existing Career Twin remains the source of career facts.",
            nextAction: "Enter the role you want this resume to target.",
            advanced: [],
        };
    }
    const target = await showTarget(workspace, targetId);
    if (target.type !== "role")
        throw new Error("Role Resume journey accepts only Role Targets.");
    const [analysis, interpretation, matching, assessment, planning, scaffold, approvedDraft, rendering] = await Promise.all([
        safeStatus(() => getTargetAnalysisStatus(workspace, targetId)),
        safeStatus(() => getTargetInterpretationStatus(workspace, targetId)),
        safeStatus(() => getApprovedEvidenceMatchingStatus(workspace, targetId)),
        safeStatus(() => getFitAssessmentStatus(workspace, targetId)),
        safeStatus(() => getRoleResumePlanStatus(workspace, targetId)),
        safeStatus(() => getRoleResumeDraftScaffoldStatus(workspace, targetId)),
        safeStatus(() => getApprovedRoleResumeDraftStatus(workspace, targetId)),
        safeStatus(() => getRoleResumeRenderDocumentStatus(workspace, targetId)),
    ]);
    let expectationCount = 0;
    if (interpretation.status === "current") {
        const value = await showTargetInterpretation(workspace, targetId);
        expectationCount = value.expectations.length;
    }
    const roleUnderstood = analysis.status === "current" && interpretation.status === "current" && expectationCount > 0;
    const selected = matching.status === "current" && assessment.status === "current";
    const prepared = planning.status === "current" && scaffold.status === "current";
    const ready = approvedDraft.status === "current";
    const progress = [
        step("Target role understood", roleUnderstood, interpretation.status === "current" && expectationCount === 0, roleUnderstood ? `${expectationCount} reviewed role expectations are available.` : "The title is saved; role expectations still need a reviewed source."),
        step("Relevant experience selected", selected, roleUnderstood && !selected, selected ? "Approved evidence has been selected for this role." : "Selection waits for reviewed role expectations."),
        step("Draft prepared", prepared, selected && !prepared, prepared ? "A constrained draft structure is available." : "No resume prose has been prepared yet."),
        step("Ready for review", ready, prepared && !ready, ready ? "An approved structured draft is ready." : "Human review has not produced an approved draft."),
        step("Exported", rendering.status === "current", ready && rendering.status !== "current", rendering.status === "current" ? "A canonical render document is current." : "No current export exists for this target."),
    ];
    const blocker = interpretation.status === "current" && expectationCount === 0
        ? "ProofLayer will not infer role expectations from a title alone."
        : undefined;
    return {
        target,
        progress,
        careerReady: true,
        currentValue: roleUnderstood
            ? "The role is understood and can be matched against your existing Career Twin."
            : "Your target and existing Career Twin are saved; no source re-upload is required.",
        ...(blocker ? { blocker } : {}),
        nextAction: blocker
            ? "Add or review a role-expectations profile for this target."
            : ready
                ? "Review the approved draft and export when ready."
                : "Continue the next current Role workflow gate in Advanced Details.",
        advanced: [
            { label: "Target structure", status: analysis.status },
            { label: "Role expectations", status: interpretation.status },
            { label: "Evidence selection", status: matching.status },
            { label: "Assessment", status: assessment.status },
            { label: "Content plan", status: planning.status },
            { label: "Draft structure", status: scaffold.status },
            { label: "Approved draft", status: approvedDraft.status },
            { label: "Rendering", status: rendering.status },
        ],
    };
}
export async function runProductJobJourney(workspace, targetId) {
    let result = await runJobWorkflow(workspace, targetId);
    if (result.status.currentStage === "evidence-pin" && result.status.evidenceSnapshot.status === "missing") {
        const current = result.status.availableSnapshots.filter((entry) => entry.status === "current");
        if (current.length === 1) {
            result = await runJobWorkflow(workspace, targetId, { snapshotId: current[0].snapshotId });
        }
    }
    return inspectProductJobJourney(workspace, targetId);
}
export async function createProductJobJourney(workspace, input) {
    const description = exactUtf8Text(input.description, "Job Description");
    const hash = hashText(description);
    const existingTarget = (await listTargets(workspace)).find((target) => target.type === "job" && target.source.sha256 === hash);
    if (existingTarget?.type === "job") {
        assertJobInputCompatible(existingTarget, input);
        return runProductJobJourney(workspace, existingTarget.id);
    }
    const inputPath = path.join(workspace, "inputs/jobs", `job-description-${hash.slice(0, 12)}.md`);
    if (await pathExists(inputPath)) {
        const existing = await readFile(inputPath);
        if (!existing.equals(Buffer.from(description, "utf8"))) {
            throw new Error("Existing imported Job Description has different bytes and was not overwritten.");
        }
    }
    else {
        await writeBufferAtomic(inputPath, Buffer.from(description, "utf8"));
    }
    const created = await createJobTarget(workspace, {
        file: inputPath,
        title: input.title,
        company: input.company,
        location: input.location,
        workingModel: input.workingModel,
    });
    return runProductJobJourney(workspace, created.target.id);
}
export async function inspectProductJobJourney(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job")
        throw new Error("Job Tailoring accepts only Job Targets.");
    const workflow = await inspectJobWorkflow(workspace, targetId);
    const requirementStatus = await getJobRequirementModelStatus(workspace, targetId);
    const assessmentStatus = await getJobFitProofAssessmentStatus(workspace, targetId);
    const planStatus = await getJobResumePlanStatus(workspace, targetId);
    const scaffoldStatus = await getJobResumeDraftScaffoldStatus(workspace, targetId);
    const approvedStatus = await getApprovedJobResumeDraftStatus(workspace, targetId);
    const requirements = requirementStatus.status === "current"
        ? (await showJobRequirementModel(workspace, targetId)).requirements
        : [];
    const assessment = assessmentStatus.status === "current"
        ? await showJobFitProofAssessment(workspace, targetId)
        : undefined;
    const requirementById = new Map(requirements.map((requirement) => [requirement.id, requirement]));
    const assessments = assessment?.requirementAssessments ?? [];
    const mandatory = assessments.filter((entry) => entry.necessity === "mandatory");
    const preferred = assessments.filter((entry) => entry.necessity === "preferred");
    const mandatoryRequirementCount = requirements.filter((entry) => entry.necessity === "mandatory").length;
    const preferredRequirementCount = requirements.filter((entry) => entry.necessity === "preferred").length;
    const strengths = assessments
        .filter((entry) => entry.assessmentState === "strength" || entry.assessmentState === "supported")
        .map((entry) => requirementById.get(entry.requirementId)?.normalizedLabel)
        .filter((value) => Boolean(value));
    const gaps = assessments
        .filter((entry) => entry.assessmentState === "gap" && ["critical", "material"].includes(entry.materiality))
        .map((entry) => requirementById.get(entry.requirementId)?.normalizedLabel)
        .filter((value) => Boolean(value));
    const overall = assessment?.overall.state;
    const fitLabel = workflow.evidenceSnapshot.eligibleJobEvidenceCount === 0
        ? "insufficient evidence"
        : overall === "strong" || overall === "credible" || overall === "mixed"
            ? overall
            : overall === "limited"
                ? "stretch"
                : "insufficient evidence";
    const plan = planStatus.status === "current" ? await showJobResumePlan(workspace, targetId) : undefined;
    const planningUsable = plan?.completeness.usableForDrafting ?? false;
    const progress = [
        step("Job understood", requirementStatus.status === "current", false, requirementStatus.status === "current" ? `${requirements.length} requirements were structured from the Job Description.` : "Job understanding has not completed."),
        step("Fit analyzed", assessmentStatus.status === "current", requirementStatus.status === "current" && assessmentStatus.status !== "current", assessmentStatus.status === "current" ? `Current evidence supports a ${fitLabel} assessment.` : "Fit waits for current evidence coverage."),
        step("Resume tailored", planningUsable, planStatus.status === "current" && !planningUsable, planningUsable ? "A defensible job-specific content plan is ready." : "Material proof gaps prevent safe tailoring."),
        step("Ready for review", approvedStatus.status === "current", scaffoldStatus.status === "current" && approvedStatus.status !== "current", approvedStatus.status === "current" ? "An approved structured draft is ready." : "No approved draft is ready for review."),
        step("Exported", workflow.overallState === "complete", approvedStatus.status === "current" && workflow.overallState !== "complete", workflow.overallState === "complete" ? "Current resume exports are available." : "No current job-specific export is available."),
    ];
    return {
        target,
        workflow,
        fit: {
            label: fitLabel,
            statement: assessment?.overall.statement
                ?? "Fit is not assessed until current requirement coverage is available.",
            mandatory: countAssessment(mandatory, mandatoryRequirementCount),
            preferred: countAssessment(preferred, preferredRequirementCount),
            strengths,
            gaps,
            limitations: [
                ...(workflow.evidenceSnapshot.eligibleJobEvidenceCount === 0
                    ? ["The current pinned evidence snapshot has no public-safe, resume-ready evidence eligible for Job Mapping."]
                    : []),
                ...(assessment?.ambiguities.slice(0, 3).map((entry) => entry.message) ?? []),
            ],
        },
        progress,
        nextAction: productJobNextAction(workflow, planningUsable),
        ...(workflow.reviewGate?.batchId ? { advancedReviewBatchId: workflow.reviewGate.batchId } : {}),
    };
}
export async function addCareerSource(workspace, input) {
    const title = requiredText(input.title, "Source title");
    if (input.content.byteLength === 0)
        throw new Error("Source content must not be empty.");
    const text = new TextDecoder("utf-8", { fatal: true }).decode(input.content);
    if (!Buffer.from(text, "utf8").equals(Buffer.from(input.content))) {
        throw new Error("Source content must be exact UTF-8 text.");
    }
    const hash = hashText(text);
    const relativePath = `sources/markdown/${slugify(title)}-${hash.slice(0, 12)}.md`;
    const absolutePath = path.join(workspace, relativePath);
    if (await pathExists(absolutePath)) {
        const existing = await readFile(absolutePath);
        if (!existing.equals(Buffer.from(input.content))) {
            throw new Error("A source with this identity already exists with different bytes.");
        }
        return { path: relativePath, result: "already-present" };
    }
    await writeBufferAtomic(absolutePath, input.content);
    return { path: relativePath, result: "created" };
}
export async function existingProductTargets(workspace) {
    const targets = await listTargets(workspace);
    return {
        roles: targets.filter((target) => target.type === "role"),
        jobs: targets.filter((target) => target.type === "job"),
    };
}
function countAssessment(entries, knownRequirementCount) {
    return {
        total: knownRequirementCount,
        supported: entries.filter((entry) => ["strength", "supported"].includes(entry.assessmentState)).length,
        partial: entries.filter((entry) => entry.assessmentState === "partial").length,
    };
}
function productJobNextAction(workflow, planningUsable) {
    if (workflow.evidenceSnapshot.eligibleJobEvidenceCount === 0) {
        if ((workflow.reviewGate?.pendingClaimCount ?? 0) > 0) {
            return "Confirm only the material evidence questions needed for this job.";
        }
        return "Add or update a source that can provide public-safe, resume-ready proof for material requirements.";
    }
    if (!planningUsable)
        return "Resolve the smallest material evidence gap shown above before drafting.";
    if (workflow.overallState === "ready-to-finalize")
        return "Review the approved draft, then export it.";
    if (workflow.overallState === "complete")
        return "No action is required; the tailored resume is current.";
    return workflow.humanActionRequired ?? "Continue the next guided step.";
}
function defaultRoleProgress() {
    return [
        { label: "Target role understood", state: "current", detail: "Enter a role title to begin." },
        { label: "Relevant experience selected", state: "waiting", detail: "Uses your existing Career Twin." },
        { label: "Draft prepared", state: "waiting", detail: "No resume prose exists yet." },
        { label: "Ready for review", state: "waiting", detail: "Human review remains required for model-authored prose." },
        { label: "Exported", state: "waiting", detail: "Exports follow an approved draft." },
    ];
}
function step(label, complete, current, detail) {
    return { label, state: complete ? "complete" : current ? "current" : "waiting", detail };
}
async function safeStatus(load) {
    try {
        return await load();
    }
    catch {
        return { status: "missing" };
    }
}
function assertRoleInputCompatible(existing, input) {
    const fields = ["seniority", "domain", "location", "workingModel"];
    if (existing.title !== requiredText(input.title, "Role title")) {
        throw new Error("Existing Role Target title differs from the requested title.");
    }
    for (const field of fields) {
        const requested = input[field]?.trim().toLowerCase();
        const stored = existing[field]?.trim().toLowerCase();
        if (requested && requested !== stored) {
            throw new Error(`Existing Role Target ${field} differs; it was not overwritten.`);
        }
    }
}
function assertJobInputCompatible(existing, input) {
    const requestedTitle = input.title?.replace(/\s+/g, " ").trim();
    if (requestedTitle && requestedTitle !== existing.title) {
        throw new Error("Existing Job Target title differs from the supplied title.");
    }
    for (const field of ["company", "location", "workingModel"]) {
        const requested = input[field]?.replace(/\s+/g, " ").trim().toLowerCase();
        const stored = existing[field]?.replace(/\s+/g, " ").trim().toLowerCase();
        if (requested && requested !== stored) {
            throw new Error(`Existing Job Target ${field} differs; it was not overwritten.`);
        }
    }
}
function exactUtf8Text(value, label) {
    if (!value.trim())
        throw new Error(`${label} must not be empty.`);
    const bytes = Buffer.from(value, "utf8");
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    if (decoded !== value)
        throw new Error(`${label} must be valid UTF-8 text.`);
    return value;
}
function requiredText(value, label) {
    const normalized = value?.replace(/\s+/g, " ").trim();
    if (!normalized)
        throw new Error(`${label} must not be blank.`);
    return normalized;
}
function slugify(value) {
    const slug = value.normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
    if (!slug)
        throw new Error("A safe target identifier could not be derived.");
    return slug;
}
function isMissingTarget(error) {
    return error instanceof Error && error.message.startsWith("Target not found:");
}
