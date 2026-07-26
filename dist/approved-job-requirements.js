import path from "node:path";
import { hashFile, hashText, pathExists, readJson, uniqueSorted, walkFiles, writeJsonAtomic, } from "./fs-utils.js";
import { ApprovedJobRequirementManifestSchema, ApprovedJobRequirementModelSchema, JobRequirementModelManifestSchema, JobRequirementProposalManifestSchema, JobRequirementReviewManifestSchema, } from "./job-requirement-schemas.js";
import { JOB_REQUIREMENT_PROPOSAL_POLICY_VERSION, JOB_REQUIREMENT_PROPOSAL_PROMPT_ID, JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION, getJobRequirementProposalStatus, locateJobRequirementProposal, showJobRequirementProposal, } from "./job-requirement-proposal.js";
import { getJobRequirementReviewStatus, jobRequirementReviewPaths, showJobRequirementReview, } from "./job-requirement-review.js";
import { JOB_REQUIREMENT_POLICY_NAME, JOB_REQUIREMENT_POLICY_VERSION, getJobRequirementModelStatus, jobRequirementPaths, showJobRequirementModel, } from "./job-requirements.js";
import { showTargetAnalysis } from "./target-analysis.js";
import { showTarget } from "./targets.js";
export const APPROVED_JOB_REQUIREMENT_POLICY_NAME = "approved-job-requirement-modeling-policy";
export const APPROVED_JOB_REQUIREMENT_POLICY_VERSION = "1";
const APPROVED_FILE = "approved-job-requirement-model.json";
const MANIFEST_FILE = "approved-job-requirement-manifest.json";
export async function approveJobRequirements(workspace, targetId, options = {}) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job")
        throw new Error(`Job requirement approval rejects Role Target: ${targetId}`);
    const deterministicStatus = await getJobRequirementModelStatus(workspace, targetId);
    if (deterministicStatus.status !== "current") {
        throw new Error(`A current deterministic job requirement model is required. Current status: ${deterministicStatus.status}.`);
    }
    const proposalId = options.proposalId ?? await selectCompletedProposal(workspace, targetId);
    const proposalStatus = await getJobRequirementProposalStatus(workspace, proposalId);
    if (proposalStatus.status !== "current" || !proposalStatus.readyForReview) {
        throw new Error(`Cannot approve a ${proposalStatus.status} or invalid proposal.`);
    }
    const proposal = await showJobRequirementProposal(workspace, proposalId);
    if (proposal.targetId !== targetId) {
        throw new Error(`Proposal ${proposalId} belongs to a different Job Target.`);
    }
    const reviewStatus = await getJobRequirementReviewStatus(workspace, proposalId);
    if (reviewStatus.status !== "completed") {
        throw new Error(`Job requirement review must be completed before approval. Current status: ${reviewStatus.status}`);
    }
    const policyName = options.policyName ?? APPROVED_JOB_REQUIREMENT_POLICY_NAME;
    const policyVersion = options.policyVersion ?? APPROVED_JOB_REQUIREMENT_POLICY_VERSION;
    const existingStatus = await getApprovedJobRequirementsStatus(workspace, targetId, {
        policyName,
        policyVersion,
    });
    const paths = approvedJobRequirementPaths(workspace, targetId);
    if (existingStatus.status === "current") {
        const manifest = ApprovedJobRequirementManifestSchema.parse(await readJson(paths.manifestPath, null));
        if (manifest.proposalId === proposalId) {
            const approved = await showApprovedJobRequirements(workspace, targetId);
            return resultFromApproved(approved, manifest, "already-current", await rejectedCount(workspace, proposalId));
        }
    }
    if ((existingStatus.status === "stale" || existingStatus.status === "invalid") &&
        !options.rebuild) {
        throw new Error(`Approved job requirement model is ${existingStatus.status} and was not overwritten. Review dependencies, then use --rebuild.`);
    }
    const deterministic = await showJobRequirementModel(workspace, targetId);
    const analysis = await showTargetAnalysis(workspace, targetId);
    const review = await showJobRequirementReview(workspace, proposalId);
    const deterministicPaths = jobRequirementPaths(workspace, targetId);
    const deterministicManifest = JobRequirementModelManifestSchema.parse(await readJson(deterministicPaths.manifestPath, null));
    const proposalLocation = await locateJobRequirementProposal(workspace, proposalId);
    const proposalManifest = JobRequirementProposalManifestSchema.parse(await readJson(proposalLocation.manifestPath, null));
    const reviewPaths = jobRequirementReviewPaths(workspace, targetId, proposalId);
    const reviewManifest = JobRequirementReviewManifestSchema.parse(await readJson(reviewPaths.manifestPath, null));
    const normalizedInputSha256 = approvedInputHash(deterministicManifest.modelSha256, proposalManifest.proposalSha256, reviewManifest.reviewSha256, policyName, policyVersion);
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (existingStatus.approvedModelExists) {
        try {
            const previous = await showApprovedJobRequirements(workspace, targetId);
            createdAt = previous.createdAt;
        }
        catch {
            // Explicit rebuild may replace an invalid artifact with a fresh history.
        }
    }
    const requirements = approvedRequirements(deterministic, proposal, review, analysis);
    const acceptedIds = new Set(requirements.map((entry) => entry.id));
    const sourceItemIds = new Set(requirements.map((entry) => entry.provenance.sourceAnalysisItemId));
    const eligibleSourceItems = deterministic.completeness.sourceItemCount;
    const approved = ApprovedJobRequirementModelSchema.parse({
        schemaVersion: 1,
        id: `approved-job-requirements_${hashText(`${targetId}\u0000${normalizedInputSha256}`).slice(0, 14)}`,
        targetId,
        targetType: "job",
        policy: { name: policyName, version: policyVersion, mode: "manual" },
        input: {
            target: deterministic.input.target,
            jobDescription: deterministic.input.jobDescription,
            structuralAnalysis: deterministic.input.structuralAnalysis,
            deterministicModel: {
                path: deterministicPaths.modelRelativePath,
                sha256: deterministicManifest.modelSha256,
            },
            proposal: {
                path: proposalLocation.proposalRelativePath,
                sha256: proposalManifest.proposalSha256,
            },
            review: {
                path: reviewPaths.reviewRelativePath,
                sha256: reviewManifest.reviewSha256,
            },
            normalizedInputSha256,
        },
        requirements,
        namedTechnologies: uniqueSorted(requirements.flatMap((entry) => entry.namedTechnologies)),
        keywords: uniqueSorted(requirements.flatMap((entry) => entry.keywords)),
        ambiguities: deterministic.ambiguities.filter((entry) => entry.requirementIds.some((id) => requirements.some((requirement) => requirement.approvalProvenance.reviewedRequirementId === id))),
        contradictions: deterministic.contradictions.filter((entry) => entry.requirementIds.every((id) => requirements.some((requirement) => requirement.approvalProvenance.reviewedRequirementId === id))),
        risks: deterministic.risks.filter((entry) => entry.requirementIds.length === 0 ||
            entry.requirementIds.some((id) => requirements.some((requirement) => requirement.approvalProvenance.reviewedRequirementId === id))),
        warnings: deterministic.warnings,
        completeness: {
            status: requirements.length === 0
                ? "empty"
                : sourceItemIds.size >= eligibleSourceItems
                    ? "complete"
                    : "partial",
            sourceItemCount: eligibleSourceItems,
            modeledItemCount: sourceItemIds.size,
            unmodeledItemIds: deterministic.requirements
                .filter((entry) => !reviewedSourceAccepted(entry.id, review, acceptedIds))
                .map((entry) => entry.provenance.sourceAnalysisItemId),
            usableForHumanReview: requirements.length > 0,
            blockingReasons: requirements.length === 0
                ? ["Human review approved no Job Description requirements."]
                : sourceItemIds.size < eligibleSourceItems
                    ? ["Some deterministic source items were excluded during review."]
                    : [],
        },
        trustState: "human-reviewed",
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.approvedModelPath, approved);
    const manifest = ApprovedJobRequirementManifestSchema.parse({
        schemaVersion: 1,
        modelId: approved.id,
        targetId,
        targetType: "job",
        approvedModelPath: paths.approvedModelRelativePath,
        approvedModelSha256: await hashFile(paths.approvedModelPath),
        policyName,
        policyVersion,
        targetSha256: deterministicManifest.targetSha256,
        sourceSha256: deterministicManifest.sourceSha256,
        structuralAnalysisSha256: deterministicManifest.structuralAnalysisSha256,
        deterministicModelSha256: deterministicManifest.modelSha256,
        proposalId,
        proposalSha256: proposalManifest.proposalSha256,
        reviewSha256: reviewManifest.reviewSha256,
        promptTemplateId: proposal.prompt.templateId,
        promptTemplateVersion: proposal.prompt.templateVersion,
        normalizedInputSha256,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(paths.manifestPath, manifest);
    return resultFromApproved(approved, manifest, existingStatus.status === "missing" ? "created" : "updated", review.decisions.filter((entry) => entry.decision === "reject").length);
}
export async function showApprovedJobRequirements(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job")
        throw new Error(`Job requirement approval rejects Role Target: ${targetId}`);
    const paths = approvedJobRequirementPaths(workspace, targetId);
    if (!(await pathExists(paths.approvedModelPath))) {
        throw new Error(`Approved job requirement model not found for target: ${targetId}`);
    }
    return ApprovedJobRequirementModelSchema.parse(await readJson(paths.approvedModelPath, null));
}
export async function getApprovedJobRequirementsStatus(workspace, targetId, options = {}) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job")
        throw new Error(`Job requirement approval rejects Role Target: ${targetId}`);
    const paths = approvedJobRequirementPaths(workspace, targetId);
    const approvedModelExists = await pathExists(paths.approvedModelPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const base = {
        targetId,
        approvedModelExists,
        manifestExists,
        approvedModelPath: paths.approvedModelRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!approvedModelExists && !manifestExists) {
        return emptyStatus(base, "missing", ["No approved job requirement model exists."]);
    }
    if (!approvedModelExists || !manifestExists) {
        return emptyStatus(base, "invalid", ["Approved job requirement artifact set is incomplete."]);
    }
    let approved;
    let manifest;
    try {
        approved = ApprovedJobRequirementModelSchema.parse(await readJson(paths.approvedModelPath, null));
        manifest = ApprovedJobRequirementManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyStatus(base, "invalid", [
            `Stored approved job requirement model is invalid: ${errorMessage(error)}`,
        ]);
    }
    const deterministicPaths = jobRequirementPaths(workspace, targetId);
    const approvedModelHashMatches = (await hashFile(paths.approvedModelPath)) === manifest.approvedModelSha256;
    const targetHashMatches = await hashMatches(deterministicPaths.targetPath, manifest.targetSha256);
    const sourceHashMatches = await hashMatches(deterministicPaths.sourcePath, manifest.sourceSha256);
    const structuralAnalysisHashMatches = await hashMatches(deterministicPaths.analysisPath, manifest.structuralAnalysisSha256);
    const deterministicModelHashMatches = await hashMatches(deterministicPaths.modelPath, manifest.deterministicModelSha256);
    let proposalHashMatches = false;
    let reviewHashMatches = false;
    let proposalIsCurrent = false;
    let reviewIsCompleted = false;
    let dependencyLookupReason;
    try {
        const proposalLocation = await locateJobRequirementProposal(workspace, manifest.proposalId);
        const reviewPaths = jobRequirementReviewPaths(workspace, targetId, manifest.proposalId);
        proposalHashMatches = await hashMatches(proposalLocation.proposalPath, manifest.proposalSha256);
        reviewHashMatches = await hashMatches(reviewPaths.reviewPath, manifest.reviewSha256);
        proposalIsCurrent =
            (await getJobRequirementProposalStatus(workspace, manifest.proposalId)).status ===
                "current";
        reviewIsCompleted =
            (await getJobRequirementReviewStatus(workspace, manifest.proposalId)).status ===
                "completed";
    }
    catch (error) {
        dependencyLookupReason = `Approved review dependency is unavailable: ${errorMessage(error)}`;
    }
    const promptMatches = manifest.promptTemplateId === JOB_REQUIREMENT_PROPOSAL_PROMPT_ID &&
        manifest.promptTemplateVersion === JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION &&
        proposalIsCurrent;
    const policyMatches = manifest.policyName === (options.policyName ?? APPROVED_JOB_REQUIREMENT_POLICY_NAME) &&
        manifest.policyVersion ===
            (options.policyVersion ?? APPROVED_JOB_REQUIREMENT_POLICY_VERSION);
    const normalizedInputHashMatches = manifest.normalizedInputSha256 ===
        approvedInputHash(manifest.deterministicModelSha256, manifest.proposalSha256, manifest.reviewSha256, manifest.policyName, manifest.policyVersion);
    const invalidReasons = [];
    if (!approvedModelHashMatches) {
        invalidReasons.push("Approved requirement model SHA-256 does not match its manifest.");
    }
    if (approved.id !== manifest.modelId ||
        approved.targetId !== targetId ||
        manifest.targetId !== targetId ||
        approved.targetType !== "job" ||
        manifest.targetType !== "job" ||
        manifest.approvedModelPath !== paths.approvedModelRelativePath) {
        invalidReasons.push("Approved requirement model identity or path is invalid.");
    }
    if (approved.input.normalizedInputSha256 !== manifest.normalizedInputSha256 ||
        approved.input.deterministicModel.sha256 !== manifest.deterministicModelSha256 ||
        approved.input.proposal.sha256 !== manifest.proposalSha256 ||
        approved.input.review.sha256 !== manifest.reviewSha256) {
        invalidReasons.push("Approved requirement model and manifest disagree on dependencies.");
    }
    if (invalidReasons.length > 0) {
        return {
            ...base,
            approvedModelHashMatches,
            targetHashMatches,
            sourceHashMatches,
            structuralAnalysisHashMatches,
            deterministicModelHashMatches,
            proposalHashMatches,
            reviewHashMatches,
            promptMatches,
            policyMatches,
            normalizedInputHashMatches,
            status: "invalid",
            reasons: invalidReasons,
        };
    }
    const staleReasons = [
        ...(!targetHashMatches ? ["Job Target changed."] : []),
        ...(!sourceHashMatches ? ["Job Description changed."] : []),
        ...(!structuralAnalysisHashMatches ? ["Structural analysis changed."] : []),
        ...(!deterministicModelHashMatches ? ["Deterministic requirement model changed."] : []),
        ...(!proposalHashMatches || !proposalIsCurrent
            ? ["Requirement proposal changed or is stale."]
            : []),
        ...(!reviewHashMatches || !reviewIsCompleted
            ? ["Requirement review changed or is incomplete."]
            : []),
        ...(dependencyLookupReason ? [dependencyLookupReason] : []),
        ...(!promptMatches ? ["Prompt identity changed."] : []),
        ...(!policyMatches ? ["Approved requirement policy changed."] : []),
        ...(!normalizedInputHashMatches ? ["Approved normalized input changed."] : []),
    ];
    return {
        ...base,
        approvedModelHashMatches,
        targetHashMatches,
        sourceHashMatches,
        structuralAnalysisHashMatches,
        deterministicModelHashMatches,
        proposalHashMatches,
        reviewHashMatches,
        promptMatches,
        policyMatches,
        normalizedInputHashMatches,
        status: staleReasons.length > 0 ? "stale" : "current",
        reasons: staleReasons,
    };
}
export function formatApproveJobRequirementsResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Proposal ID: ${result.proposalId}`,
        `Approval result: ${result.result}`,
        `Approved model: ${result.approvedModelPath}`,
        `Manifest: ${result.manifestPath}`,
        `Accepted: ${result.approvedCount}`,
        `Human-edited: ${result.editedCount}`,
        `Rejected: ${result.rejectedCount}`,
        `Completeness: ${result.completeness.status}`,
    ].join("\n");
}
export function formatApprovedJobRequirementsStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Approved model hash matches: ${check(status.approvedModelHashMatches)}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Job Description hash matches: ${check(status.sourceHashMatches)}`,
        `Structural analysis hash matches: ${check(status.structuralAnalysisHashMatches)}`,
        `Deterministic model hash matches: ${check(status.deterministicModelHashMatches)}`,
        `Proposal hash matches: ${check(status.proposalHashMatches)}`,
        `Review hash matches: ${check(status.reviewHashMatches)}`,
        `Prompt matches: ${check(status.promptMatches)}`,
        `Policy matches: ${check(status.policyMatches)}`,
        `Normalized input matches: ${check(status.normalizedInputHashMatches)}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
function approvedRequirements(deterministic, proposal, review, analysis) {
    const deterministicById = new Map(deterministic.requirements.map((entry) => [entry.id, entry]));
    const proposalById = new Map(proposal.proposedRequirements.map((entry) => [entry.id, entry]));
    const analysisById = new Map(analysis.items.map((entry) => [entry.id, entry]));
    return review.decisions.flatMap((decision) => {
        if (decision.decision === "pending" || decision.decision === "reject")
            return [];
        const deterministicSource = decision.source === "deterministic"
            ? deterministicById.get(decision.requirementId)
            : undefined;
        const proposalSource = decision.source === "proposal"
            ? proposalById.get(decision.requirementId)
            : undefined;
        if (!deterministicSource && !proposalSource) {
            throw new Error(`Reviewed requirement source is missing: ${decision.requirementId}`);
        }
        const sourceItemId = deterministicSource
            ? deterministicSource.provenance.sourceAnalysisItemId
            : proposalSource?.sourceAnalysisItemIds[0];
        if (!sourceItemId)
            throw new Error(`Reviewed requirement has no source item: ${decision.requirementId}`);
        const sourceItem = analysisById.get(sourceItemId);
        if (!sourceItem)
            throw new Error(`Approved requirement source item is missing: ${sourceItemId}`);
        const edited = decision.decision === "edit" ? decision.editedRequirement : undefined;
        if (decision.decision === "edit" && !edited) {
            throw new Error(`Edited review content is missing: ${decision.requirementId}`);
        }
        const sourceRequirement = deterministicSource
            ? deterministicSource
            : {
                category: proposalSource.category,
                normalizedLabel: proposalSource.normalizedLabel,
                sourceText: proposalSource.sourceText,
                necessity: proposalSource.necessity,
                confidence: proposalSource.confidence,
                explicitness: proposalSource.explicitness,
                relationships: proposalSource.relationships,
                namedTechnologies: proposalSource.namedTechnologies,
                keywords: proposalSource.keywords,
                notes: proposalSource.ambiguityNotes,
            };
        return [{
                id: `approved-job-requirement_${hashText(`${proposal.id}\u0000${decision.source}\u0000${decision.requirementId}\u0000${decision.decision}`).slice(0, 14)}`,
                category: edited?.category ?? sourceRequirement.category,
                normalizedLabel: edited?.normalizedLabel ?? sourceRequirement.normalizedLabel,
                sourceText: sourceRequirement.sourceText,
                necessity: edited?.necessity ?? sourceRequirement.necessity,
                confidence: edited?.confidence ?? sourceRequirement.confidence,
                explicitness: edited?.explicitness ?? sourceRequirement.explicitness,
                provenance: {
                    sourceAnalysisItemId: sourceItemId,
                    sourceSectionId: sourceItem.sectionId,
                    sourceReferences: deterministicSource
                        ? deterministicSource.provenance.sourceReferences
                        : proposalSource.sourceReferences,
                },
                relationships: edited?.relationships ?? sourceRequirement.relationships,
                namedTechnologies: edited?.namedTechnologies ?? sourceRequirement.namedTechnologies,
                keywords: edited?.keywords ?? sourceRequirement.keywords,
                notes: [
                    ...(edited?.notes ?? sourceRequirement.notes),
                    ...(decision.reviewNote ? [decision.reviewNote] : []),
                ],
                trustState: decision.decision === "edit" ? "human-edited" : "human-approved",
                approvalProvenance: {
                    proposalId: proposal.id,
                    reviewedRequirementId: decision.requirementId,
                    source: decision.source,
                    reviewDecision: decision.decision,
                    reviewer: review.reviewer,
                    promptTemplateId: proposal.prompt.templateId,
                    promptTemplateVersion: proposal.prompt.templateVersion,
                    policyVersion: proposal.prompt.policyVersion,
                },
            }];
    }).sort((a, b) => a.id.localeCompare(b.id));
}
async function selectCompletedProposal(workspace, targetId) {
    const root = resolveWithin(workspace, `targets/jobs/${targetId}/requirements/reviews`);
    const reviewFiles = (await walkFiles(root)).filter((file) => path.basename(file) === "review.json");
    const completed = [];
    for (const file of reviewFiles) {
        const review = await readJson(file, null);
        if (review?.targetId !== targetId || review.status !== "completed")
            continue;
        try {
            const status = await getJobRequirementReviewStatus(workspace, review.proposalId);
            if (status.status === "completed") {
                completed.push({ proposalId: review.proposalId, updatedAt: review.updatedAt });
            }
        }
        catch {
            // Invalid review artifacts are not approval candidates.
        }
    }
    completed.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (completed.length === 0) {
        throw new Error("No current completed job requirement review exists. Supply --proposal after review.");
    }
    if (completed.length > 1) {
        throw new Error("Multiple completed reviews exist. Select one with --proposal.");
    }
    return completed[0].proposalId;
}
export function approvedJobRequirementPaths(workspace, targetId) {
    const root = `targets/jobs/${targetId}/requirements/approved`;
    const approvedModelRelativePath = `${root}/${APPROVED_FILE}`;
    const manifestRelativePath = `${root}/${MANIFEST_FILE}`;
    return {
        approvedModelRelativePath,
        approvedModelPath: resolveWithin(workspace, approvedModelRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
function approvedInputHash(deterministicModelSha256, proposalSha256, reviewSha256, policyName, policyVersion) {
    return hashText(JSON.stringify({
        deterministicModelSha256,
        proposalSha256,
        reviewSha256,
        policyName,
        policyVersion,
        promptTemplateId: JOB_REQUIREMENT_PROPOSAL_PROMPT_ID,
        promptTemplateVersion: JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION,
        proposalPolicyVersion: JOB_REQUIREMENT_PROPOSAL_POLICY_VERSION,
        deterministicPolicyName: JOB_REQUIREMENT_POLICY_NAME,
        deterministicPolicyVersion: JOB_REQUIREMENT_POLICY_VERSION,
    }));
}
function reviewedSourceAccepted(deterministicId, review, _acceptedIds) {
    return review.decisions.some((entry) => entry.source === "deterministic" &&
        entry.requirementId === deterministicId &&
        (entry.decision === "accept" || entry.decision === "edit"));
}
async function rejectedCount(workspace, proposalId) {
    const review = await showJobRequirementReview(workspace, proposalId);
    return review.decisions.filter((entry) => entry.decision === "reject").length;
}
function resultFromApproved(approved, manifest, result, rejected) {
    return {
        targetId: approved.targetId,
        proposalId: manifest.proposalId,
        result,
        approvedModelPath: manifest.approvedModelPath,
        manifestPath: manifest.approvedModelPath.replace(APPROVED_FILE, MANIFEST_FILE),
        approvedCount: approved.requirements.filter((entry) => entry.trustState === "human-approved").length,
        editedCount: approved.requirements.filter((entry) => entry.trustState === "human-edited").length,
        rejectedCount: rejected,
        completeness: approved.completeness,
    };
}
function emptyStatus(base, status, reasons) {
    return {
        ...base,
        approvedModelHashMatches: null,
        targetHashMatches: null,
        sourceHashMatches: null,
        structuralAnalysisHashMatches: null,
        deterministicModelHashMatches: null,
        proposalHashMatches: null,
        reviewHashMatches: null,
        promptMatches: null,
        policyMatches: null,
        normalizedInputHashMatches: null,
        status,
        reasons,
    };
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const resolved = path.resolve(root, relativePath);
    const relation = path.relative(root, resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Approved job requirement path escapes the workspace: ${relativePath}`);
    }
    return resolved;
}
async function hashMatches(filePath, expected) {
    return (await pathExists(filePath)) && (await hashFile(filePath)) === expected;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
