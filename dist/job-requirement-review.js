import { readFile } from "node:fs/promises";
import path from "node:path";
import { hashFile, pathExists, readJson, writeJsonAtomic, } from "./fs-utils.js";
import { EditedJobRequirementSchema, JobRequirementModelManifestSchema, JobRequirementProposalManifestSchema, JobRequirementProposalReviewSchema, JobRequirementReviewManifestSchema, } from "./job-requirement-schemas.js";
import { getJobRequirementProposalStatus, locateJobRequirementProposal, showJobRequirementProposal, } from "./job-requirement-proposal.js";
import { jobRequirementPaths, showJobRequirementModel, } from "./job-requirements.js";
const REVIEW_FILE = "review.json";
const MANIFEST_FILE = "review-manifest.json";
export async function initializeJobRequirementReview(workspace, proposalId, options = {}) {
    const proposalStatus = await getJobRequirementProposalStatus(workspace, proposalId);
    if (!proposalStatus.readyForReview) {
        throw new Error(`Job requirement proposal is not ready for review. Current status: ${proposalStatus.status}`);
    }
    const proposal = await showJobRequirementProposal(workspace, proposalId);
    const paths = reviewPaths(workspace, proposal.targetId, proposalId);
    if (await pathExists(paths.reviewPath)) {
        return getJobRequirementReviewStatus(workspace, proposalId);
    }
    const deterministic = await showJobRequirementModel(workspace, proposal.targetId);
    const now = (options.now ?? (() => new Date()))().toISOString();
    const review = JobRequirementProposalReviewSchema.parse({
        schemaVersion: 1,
        proposalId,
        targetId: proposal.targetId,
        status: "in-progress",
        decisions: [
            ...deterministic.requirements.map((requirement) => ({
                requirementId: requirement.id,
                source: "deterministic",
                decision: "pending",
            })),
            ...proposal.proposedRequirements.map((requirement) => ({
                requirementId: requirement.id,
                source: "proposal",
                decision: "pending",
            })),
        ].sort((a, b) => a.source.localeCompare(b.source) || a.requirementId.localeCompare(b.requirementId)),
        reviewer: {
            type: "human",
            ...(options.reviewerName?.trim() ? { name: options.reviewerName.trim() } : {}),
        },
        createdAt: now,
        updatedAt: now,
    });
    await persistReview(workspace, review);
    return getJobRequirementReviewStatus(workspace, proposalId);
}
export async function setJobRequirementReviewDecision(workspace, proposalId, requirementId, input, options = {}) {
    const proposalStatus = await getJobRequirementProposalStatus(workspace, proposalId);
    if (!proposalStatus.readyForReview) {
        throw new Error("Only a current ready-for-review proposal may be reviewed.");
    }
    const proposal = await showJobRequirementProposal(workspace, proposalId);
    const deterministic = await showJobRequirementModel(workspace, proposal.targetId);
    const review = await showJobRequirementReview(workspace, proposalId);
    if (review.status === "completed")
        throw new Error("Completed reviews cannot be modified.");
    const existing = review.decisions.find((entry) => entry.requirementId === requirementId);
    if (!existing)
        throw new Error(`Unknown reviewed requirement ID: ${requirementId}`);
    if (existing.decision !== "pending") {
        throw new Error(`A decision already exists for requirement: ${requirementId}`);
    }
    const source = existing.source === "deterministic"
        ? deterministic.requirements.find((entry) => entry.id === requirementId)
        : proposal.proposedRequirements.find((entry) => entry.id === requirementId);
    if (!source)
        throw new Error(`Reviewed requirement source is missing: ${requirementId}`);
    if (input.decision === "edit") {
        if (!input.editedRequirement)
            throw new Error("Edit requires edited requirement content.");
        validateEditedRequirement(input.editedRequirement, source, new Set([
            ...deterministic.requirements.map((entry) => entry.id),
            ...proposal.proposedRequirements.map((entry) => entry.id),
        ]), requirementId);
    }
    else if (input.editedRequirement) {
        throw new Error("Only an edit decision may include edited requirement content.");
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    const updated = JobRequirementProposalReviewSchema.parse({
        ...review,
        decisions: review.decisions.map((entry) => entry.requirementId === requirementId
            ? {
                requirementId,
                source: entry.source,
                decision: input.decision,
                ...(input.editedRequirement
                    ? { editedRequirement: input.editedRequirement }
                    : {}),
                ...(input.reviewNote?.trim()
                    ? { reviewNote: input.reviewNote.trim() }
                    : {}),
                decidedAt: now,
            }
            : entry),
        updatedAt: now,
    });
    await persistReview(workspace, updated);
    return getJobRequirementReviewStatus(workspace, proposalId);
}
export async function completeJobRequirementReview(workspace, proposalId, options = {}) {
    const proposalStatus = await getJobRequirementProposalStatus(workspace, proposalId);
    if (!proposalStatus.readyForReview) {
        throw new Error("Only a current ready-for-review proposal may be completed.");
    }
    const proposal = await showJobRequirementProposal(workspace, proposalId);
    const deterministic = await showJobRequirementModel(workspace, proposal.targetId);
    const review = await showJobRequirementReview(workspace, proposalId);
    if (review.status === "completed")
        return getJobRequirementReviewStatus(workspace, proposalId);
    const pending = review.decisions.filter((entry) => entry.decision === "pending");
    if (pending.length > 0) {
        throw new Error(`Review cannot be completed: ${pending.length} requirement decision(s) remain pending.`);
    }
    assertExactCoverage(review, deterministic.requirements.map((entry) => entry.id), proposal.proposedRequirements.map((entry) => entry.id));
    const now = (options.now ?? (() => new Date()))().toISOString();
    const completed = JobRequirementProposalReviewSchema.parse({
        ...review,
        status: "completed",
        updatedAt: now,
    });
    await persistReview(workspace, completed);
    return getJobRequirementReviewStatus(workspace, proposalId);
}
export async function showJobRequirementReview(workspace, proposalId) {
    const proposal = await showJobRequirementProposal(workspace, proposalId);
    const paths = reviewPaths(workspace, proposal.targetId, proposalId);
    if (!(await pathExists(paths.reviewPath))) {
        throw new Error(`Job requirement review not found for proposal: ${proposalId}`);
    }
    return JobRequirementProposalReviewSchema.parse(await readJson(paths.reviewPath, null));
}
export async function getJobRequirementReviewStatus(workspace, proposalId) {
    const proposal = await showJobRequirementProposal(workspace, proposalId);
    const paths = reviewPaths(workspace, proposal.targetId, proposalId);
    const reviewExists = await pathExists(paths.reviewPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const emptyCounts = { pending: 0, accept: 0, edit: 0, reject: 0 };
    const base = {
        proposalId,
        targetId: proposal.targetId,
        reviewExists,
        manifestExists,
        reviewPath: paths.reviewRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!reviewExists && !manifestExists) {
        return {
            ...base,
            reviewHashMatches: null,
            proposalHashMatches: null,
            deterministicModelHashMatches: null,
            status: "missing",
            counts: emptyCounts,
            reasons: ["No job requirement review exists."],
        };
    }
    if (!reviewExists || !manifestExists) {
        return {
            ...base,
            reviewHashMatches: null,
            proposalHashMatches: null,
            deterministicModelHashMatches: null,
            status: "invalid",
            counts: emptyCounts,
            reasons: ["Job requirement review artifact set is incomplete."],
        };
    }
    try {
        const review = JobRequirementProposalReviewSchema.parse(await readJson(paths.reviewPath, null));
        const manifest = JobRequirementReviewManifestSchema.parse(await readJson(paths.manifestPath, null));
        const proposalLocation = await locateJobRequirementProposal(workspace, proposalId);
        const proposalManifest = JobRequirementProposalManifestSchema.parse(await readJson(proposalLocation.manifestPath, null));
        const deterministicPaths = jobRequirementPaths(workspace, proposal.targetId);
        const deterministicManifest = JobRequirementModelManifestSchema.parse(await readJson(deterministicPaths.manifestPath, null));
        const reviewHashMatches = (await hashFile(paths.reviewPath)) === manifest.reviewSha256;
        const proposalHashMatches = proposalManifest.proposalSha256 === manifest.proposalSha256;
        const deterministicModelHashMatches = deterministicManifest.modelSha256 === manifest.deterministicModelSha256;
        const reasons = [];
        if (!reviewHashMatches)
            reasons.push("Review SHA-256 does not match its manifest.");
        if (!proposalHashMatches)
            reasons.push("Review references a different proposal hash.");
        if (!deterministicModelHashMatches) {
            reasons.push("Review references a different deterministic requirement model.");
        }
        if (review.proposalId !== proposalId ||
            manifest.proposalId !== proposalId ||
            review.targetId !== proposal.targetId ||
            manifest.targetId !== proposal.targetId ||
            manifest.reviewPath !== paths.reviewRelativePath) {
            reasons.push("Review identity or persistence path is invalid.");
        }
        const deterministic = await showJobRequirementModel(workspace, proposal.targetId);
        try {
            assertExactCoverage(review, deterministic.requirements.map((entry) => entry.id), proposal.proposedRequirements.map((entry) => entry.id));
        }
        catch (error) {
            reasons.push(errorMessage(error));
        }
        return {
            ...base,
            reviewHashMatches,
            proposalHashMatches,
            deterministicModelHashMatches,
            status: reasons.length > 0 ? "invalid" : review.status,
            counts: countDecisions(review.decisions),
            reasons,
        };
    }
    catch (error) {
        return {
            ...base,
            reviewHashMatches: null,
            proposalHashMatches: null,
            deterministicModelHashMatches: null,
            status: "invalid",
            counts: emptyCounts,
            reasons: [`Stored job requirement review is invalid: ${errorMessage(error)}`],
        };
    }
}
export async function readEditedJobRequirementFile(filePath) {
    try {
        return EditedJobRequirementSchema.parse(JSON.parse(await readFile(path.resolve(filePath), "utf8")));
    }
    catch (error) {
        throw new Error(`Invalid edited job requirement JSON: ${errorMessage(error)}`);
    }
}
export function formatJobRequirementReviewStatus(status) {
    return [
        `Proposal ID: ${status.proposalId}`,
        `Target ID: ${status.targetId}`,
        `Review status: ${status.status}`,
        `Decisions: pending=${status.counts.pending}, accepted=${status.counts.accept}, edited=${status.counts.edit}, rejected=${status.counts.reject}`,
        `Review path: ${status.reviewPath}`,
        `Manifest path: ${status.manifestPath}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
export function jobRequirementReviewPaths(workspace, targetId, proposalId) {
    return reviewPaths(workspace, targetId, proposalId);
}
function validateEditedRequirement(edited, source, knownRequirementIds, currentRequirementId) {
    const sourceText = source.sourceText.toLowerCase();
    for (const technology of edited.namedTechnologies) {
        if (!source.namedTechnologies.includes(technology) &&
            !sourceText.includes(technology.toLowerCase())) {
            throw new Error(`Edited requirement cannot add unsupported technology: ${technology}`);
        }
    }
    for (const keyword of edited.keywords) {
        if (!source.keywords.includes(keyword) &&
            !sourceText.includes(keyword.toLowerCase())) {
            throw new Error(`Edited requirement cannot add unsupported keyword: ${keyword}`);
        }
    }
    for (const relationship of edited.relationships) {
        if (!knownRequirementIds.has(relationship.requirementId)) {
            throw new Error(`Edited requirement cannot reference an unknown requirement: ${relationship.requirementId}`);
        }
        if (relationship.requirementId === currentRequirementId) {
            throw new Error("Edited requirement cannot relate to itself.");
        }
    }
    const sourceTokens = significantTokens(source.sourceText);
    const inventedLabelTokens = [...significantTokens(edited.normalizedLabel)]
        .filter((token) => !sourceTokens.has(token));
    if (inventedLabelTokens.length > 0) {
        throw new Error("Edited normalized wording must use terms present in the exact source statement.");
    }
    const reviewedText = [edited.normalizedLabel, ...edited.notes].join(" ");
    if (/\b(candidate fit|candidate evidence|resume|cover letter|apply|hire|hiring probability|ATS score)\b/i.test(reviewedText)) {
        throw new Error("Edited requirement contains forbidden candidate or application language.");
    }
}
function significantTokens(value) {
    return new Set(value
        .normalize("NFKC")
        .toLowerCase()
        .match(/[a-z0-9]+(?:[.+#][a-z0-9]+)*/g)
        ?.filter((token) => token.length >= 3 || /\d/.test(token)) ?? []);
}
function assertExactCoverage(review, deterministicIds, proposalIds) {
    const expected = [
        ...deterministicIds.map((requirementId) => ({ requirementId, source: "deterministic" })),
        ...proposalIds.map((requirementId) => ({ requirementId, source: "proposal" })),
    ]
        .map((entry) => `${entry.source}:${entry.requirementId}`)
        .sort();
    const actual = review.decisions
        .map((entry) => `${entry.source}:${entry.requirementId}`)
        .sort();
    if (new Set(actual).size !== actual.length || JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error("Review decisions do not exactly cover deterministic and proposed requirements.");
    }
}
function countDecisions(decisions) {
    return decisions.reduce((counts, entry) => {
        counts[entry.decision] += 1;
        return counts;
    }, { pending: 0, accept: 0, edit: 0, reject: 0 });
}
async function persistReview(workspace, review) {
    const proposalLocation = await locateJobRequirementProposal(workspace, review.proposalId);
    const proposalManifest = JobRequirementProposalManifestSchema.parse(await readJson(proposalLocation.manifestPath, null));
    const deterministicPaths = jobRequirementPaths(workspace, review.targetId);
    const deterministicManifest = JobRequirementModelManifestSchema.parse(await readJson(deterministicPaths.manifestPath, null));
    const paths = reviewPaths(workspace, review.targetId, review.proposalId);
    await writeJsonAtomic(paths.reviewPath, review);
    await writeJsonAtomic(paths.manifestPath, JobRequirementReviewManifestSchema.parse({
        schemaVersion: 1,
        proposalId: review.proposalId,
        targetId: review.targetId,
        reviewPath: paths.reviewRelativePath,
        reviewSha256: await hashFile(paths.reviewPath),
        proposalSha256: proposalManifest.proposalSha256,
        deterministicModelSha256: deterministicManifest.modelSha256,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
    }));
}
function reviewPaths(workspace, targetId, proposalId) {
    const root = `targets/jobs/${targetId}/requirements/reviews/${proposalId}`;
    const reviewRelativePath = `${root}/${REVIEW_FILE}`;
    const manifestRelativePath = `${root}/${MANIFEST_FILE}`;
    return {
        reviewRelativePath,
        reviewPath: resolveWithin(workspace, reviewRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
    };
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const resolved = path.resolve(root, relativePath);
    const relation = path.relative(root, resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Job requirement review path escapes the workspace: ${relativePath}`);
    }
    return resolved;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
