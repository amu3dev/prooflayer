import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, stat, writeFile, } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { approveJobRequirements, getApprovedJobRequirementsStatus, showApprovedJobRequirements, } from "../approved-job-requirements.js";
import { hashFile } from "../fs-utils.js";
import { JOB_REQUIREMENT_PROPOSAL_PROMPT_ID, JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION, generateJobRequirementProposal, getJobRequirementProposalStatus, replayJobRequirementProposal, showJobRequirementProposal, } from "../job-requirement-proposal.js";
import { completeJobRequirementReview, initializeJobRequirementReview, setJobRequirementReviewDecision, showJobRequirementReview, } from "../job-requirement-review.js";
import { JOB_REQUIREMENT_POLICY_NAME, JOB_REQUIREMENT_POLICY_VERSION, buildJobRequirements, getJobRequirementModelStatus, showJobRequirementModel, } from "../job-requirements.js";
import { FakeInterpretationModelProvider } from "../model-provider.js";
import { analyzeTarget } from "../target-analysis.js";
import { createJobTarget, createRoleTarget } from "../targets.js";
const FIRST_TIME = "2026-07-26T09:00:00.000Z";
const SECOND_TIME = "2026-07-27T09:00:00.000Z";
const JOB_DESCRIPTION = [
    "---",
    "title: Engineering Director",
    "company: Example Systems",
    "location: Riyadh",
    "workingModel: Hybrid",
    "---",
    "",
    "# Engineering Director",
    "Shape product and technical direction across the business.",
    "",
    "## Responsibilities",
    "- Lead multi-site operations across product and engineering teams.",
    "- Coordinate delivery across TypeScript APIs and platform services.",
    "- Own delivery priorities and coordinate execution.",
    "",
    "## Required Qualifications",
    "- Must have 15+ years of relevant experience.",
    "- Arabic and English are required.",
    "- Must be based in Riyadh and work in a hybrid model.",
    "- Required experience with TypeScript, Node.js, APIs, Docker, and CI/CD.",
    "- Experience in telecom SaaS environments.",
    "- People leadership and mentoring experience.",
    "- Must pass a background check.",
    "- Experience supporting products serving 1 million users.",
    "- A Bachelor's degree in Computer Science is required.",
    "",
    "## Preferred Qualifications",
    "- Nice to have React Native experience.",
    "",
    "## Additional Context",
    "Collaboration across changing priorities.",
    "",
].join("\n");
describe("Slice 2.7A deterministic Job Requirement Modeling", () => {
    it("builds a versioned job-only model with explicit categories and necessity", async () => {
        const fixture = await preparedJobWorkspace();
        const result = await buildJobRequirements(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        expect(result.result).toBe("created");
        expect(model).toMatchObject({
            schemaVersion: 1,
            targetId: fixture.targetId,
            targetType: "job",
            policy: {
                name: JOB_REQUIREMENT_POLICY_NAME,
                version: JOB_REQUIREMENT_POLICY_VERSION,
                mode: "deterministic",
            },
            trustState: "deterministic-unreviewed",
            completeness: { status: "complete", usableForHumanReview: true },
        });
        expect(requirementFor(model, "15+ years")).toMatchObject({
            category: "experience-seniority",
            necessity: "mandatory",
            confidence: "high",
            explicitness: "explicit",
        });
        expect(requirementFor(model, "Arabic and English")).toMatchObject({
            category: "language",
            necessity: "mandatory",
        });
        expect(requirementFor(model, "based in Riyadh")).toMatchObject({
            category: "location-travel-visa-work-mode",
            necessity: "mandatory",
        });
        expect(requirementFor(model, "background check")).toMatchObject({
            category: "screening",
            necessity: "mandatory",
        });
        expect(requirementFor(model, "1 million users")).toMatchObject({
            category: "metric-scale",
            necessity: "mandatory",
        });
        expect(requirementFor(model, "Bachelor's degree")).toMatchObject({
            category: "education-certification",
            necessity: "mandatory",
        });
    });
    it("preserves preferred, technical, domain, leadership, and operating context signals", async () => {
        const fixture = await builtJobWorkspace();
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        expect(requirementFor(model, "Nice to have React Native")).toMatchObject({
            category: "technical-expectation",
            necessity: "preferred",
        });
        expect(requirementFor(model, "TypeScript, Node.js")).toMatchObject({
            category: "technical-expectation",
            necessity: "mandatory",
        });
        expect(requirementFor(model, "telecom SaaS")).toMatchObject({
            category: "domain-expectation",
            necessity: "mandatory",
        });
        expect(requirementFor(model, "People leadership")).toMatchObject({
            category: "leadership-expectation",
            necessity: "mandatory",
        });
        expect(requirementFor(model, "multi-site operations")).toMatchObject({
            category: "operating-context",
            necessity: "contextual",
        });
        expect(requirementFor(model, "Own delivery priorities")).toMatchObject({
            category: "responsibility",
            necessity: "contextual",
        });
        expect(model.namedTechnologies).toEqual(expect.arrayContaining(["API", "CI/CD", "Docker", "Node.js", "React Native", "SaaS", "TypeScript"]));
        expect(requirementFor(model, "React Native").namedTechnologies).toEqual(["React Native"]);
    });
    it("preserves ambiguity instead of silently hardening vague prose", async () => {
        const fixture = await builtJobWorkspace();
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const vague = requirementFor(model, "Collaboration across changing priorities");
        expect(vague).toMatchObject({
            category: "unknown",
            necessity: "ambiguous",
            confidence: "low",
            explicitness: "inferred",
        });
        expect(model.ambiguities.some((entry) => entry.requirementIds.includes(vague.id))).toBe(true);
        expect(model.risks.some((entry) => entry.requirementIds.includes(vague.id))).toBe(true);
        expect(model.warnings.some((entry) => entry.code === "AMBIGUOUS_ITEM_PRESERVED")).toBe(true);
    });
    it("preserves exact Job Description text and byte-range provenance", async () => {
        const fixture = await builtJobWorkspace();
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const requirement = requirementFor(model, "Arabic and English");
        const reference = requirement.provenance.sourceReferences[0];
        const sourcePath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md");
        const source = await readFile(sourcePath);
        expect(requirement.sourceText).toBe("- Arabic and English are required.");
        expect(reference.startLine).toBe(reference.endLine);
        expect(reference.sha256).toBe(createHash("sha256").update(source).digest("hex"));
        const excerpt = source.subarray(reference.startOffset, reference.endOffset);
        expect(excerpt.toString("utf8")).toBe("- Arabic and English are required.\n");
        expect(createHash("sha256").update(excerpt).digest("hex")).toBe(reference.excerptSha256);
    });
    it("keeps stable IDs, hashes, bytes, and timestamps on unchanged reruns", async () => {
        const fixture = await builtJobWorkspace();
        const modelPath = deterministicArtifact(fixture.workspace, fixture.targetId, "job-requirement-model.json");
        const manifestPath = deterministicArtifact(fixture.workspace, fixture.targetId, "job-requirement-model-manifest.json");
        const [firstModel, firstManifest, firstModelStat, firstManifestStat] = await Promise.all([
            readFile(modelPath),
            readFile(manifestPath),
            stat(modelPath),
            stat(manifestPath),
        ]);
        const firstParsed = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const rerun = await buildJobRequirements(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        const [secondModel, secondManifest, secondModelStat, secondManifestStat] = await Promise.all([
            readFile(modelPath),
            readFile(manifestPath),
            stat(modelPath),
            stat(manifestPath),
        ]);
        const secondParsed = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        expect(rerun.result).toBe("already-current");
        expect(secondModel).toEqual(firstModel);
        expect(secondManifest).toEqual(firstManifest);
        expect(secondModelStat.mtimeMs).toBe(firstModelStat.mtimeMs);
        expect(secondManifestStat.mtimeMs).toBe(firstManifestStat.mtimeMs);
        expect(secondParsed.createdAt).toBe(FIRST_TIME);
        expect(secondParsed.updatedAt).toBe(FIRST_TIME);
        expect(secondParsed.requirements.map((entry) => entry.id)).toEqual(firstParsed.requirements.map((entry) => entry.id));
    });
    it("reports missing/current/invalid lifecycle and requires explicit rebuild", async () => {
        const fixture = await preparedJobWorkspace();
        expect((await getJobRequirementModelStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("missing");
        await buildJobRequirements(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        expect(await getJobRequirementModelStatus(fixture.workspace, fixture.targetId)).toMatchObject({
            status: "current",
            modelHashMatches: true,
            targetHashMatches: true,
            sourceHashMatches: true,
            structuralAnalysisHashMatches: true,
            policyMatches: true,
            normalizedInputHashMatches: true,
        });
        const modelPath = deterministicArtifact(fixture.workspace, fixture.targetId, "job-requirement-model.json");
        await writeFile(modelPath, `${await readFile(modelPath, "utf8")} `, "utf8");
        expect((await getJobRequirementModelStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("invalid");
        await expect(buildJobRequirements(fixture.workspace, fixture.targetId)).rejects.toThrow("was not overwritten");
        await expect(buildJobRequirements(fixture.workspace, fixture.targetId, { rebuild: true }))
            .resolves.toMatchObject({ result: "rebuilt" });
    });
    it("rejects Role Targets and stale or missing Job Description artifacts", async () => {
        const workspace = await temporaryWorkspace();
        const role = await createRoleTarget(workspace, { title: "Engineering Director" });
        await analyzeTarget(workspace, role.target.id);
        await expect(buildJobRequirements(workspace, role.target.id)).rejects.toThrow("rejects Role Target");
        const fixture = await builtJobWorkspace();
        const sourcePath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md");
        await writeFile(sourcePath, `${JOB_DESCRIPTION}\nChanged source.`, "utf8");
        expect((await getJobRequirementModelStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("stale");
        await expect(buildJobRequirements(fixture.workspace, fixture.targetId, { rebuild: true }))
            .rejects.toThrow("structural analysis must be current");
        await rm(sourcePath);
        await expect(buildJobRequirements(fixture.workspace, fixture.targetId, { rebuild: true }))
            .rejects.toThrow("structural analysis must be current");
    });
    it("persists deterministic model and manifest separately from immutable target input", async () => {
        const fixture = await preparedJobWorkspace();
        const targetPath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "target.json");
        const sourcePath = path.join(fixture.workspace, "targets/jobs", fixture.targetId, "job-description.md");
        const before = {
            target: await readFile(targetPath),
            source: await readFile(sourcePath),
        };
        const result = await buildJobRequirements(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const manifest = JSON.parse(await readFile(deterministicArtifact(fixture.workspace, fixture.targetId, "job-requirement-model-manifest.json"), "utf8"));
        expect(result.modelPath).toContain(`/requirements/deterministic/`);
        expect(result.manifestPath).toContain(`/requirements/deterministic/`);
        expect(await readFile(targetPath)).toEqual(before.target);
        expect(await readFile(sourcePath)).toEqual(before.source);
        expect(manifest).toMatchObject({
            targetId: fixture.targetId,
            targetType: "job",
            modelSha256: await hashFile(deterministicArtifact(fixture.workspace, fixture.targetId, "job-requirement-model.json")),
            policyName: JOB_REQUIREMENT_POLICY_NAME,
            policyVersion: JOB_REQUIREMENT_POLICY_VERSION,
        });
    });
    it("generates a traceable untrusted proposal with the required prompt identity", async () => {
        const fixture = await builtJobWorkspace();
        const payload = await validProposalPayload(fixture.workspace, fixture.targetId);
        const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
        const result = await generateJobRequirementProposal(fixture.workspace, fixture.targetId, {
            provider,
            now: () => new Date(FIRST_TIME),
        });
        const proposal = await showJobRequirementProposal(fixture.workspace, result.proposalId);
        expect(provider.callCount).toBe(1);
        expect(result).toMatchObject({
            result: "generated",
            proposalStatus: "ready-for-review",
            providerCallMade: true,
            proposedRequirementCount: 1,
            validationIssueCount: 0,
        });
        expect(proposal.prompt).toMatchObject({
            templateId: JOB_REQUIREMENT_PROPOSAL_PROMPT_ID,
            templateVersion: JOB_REQUIREMENT_PROPOSAL_PROMPT_VERSION,
        });
        expect(proposal.proposedRequirements[0]).toMatchObject({
            trustState: "proposed",
            sourceText: payload.proposedRequirements[0].sourceText,
        });
        expect(proposal.warnings.some((entry) => entry.code === "MODEL_PROPOSAL_REQUIRES_REVIEW"))
            .toBe(true);
    });
    it("uses no-call proposal cache and deterministic raw-response replay", async () => {
        const fixture = await builtJobWorkspace();
        const payload = await validProposalPayload(fixture.workspace, fixture.targetId);
        const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
        const first = await generateJobRequirementProposal(fixture.workspace, fixture.targetId, {
            provider,
            now: () => new Date(FIRST_TIME),
        });
        const second = await generateJobRequirementProposal(fixture.workspace, fixture.targetId, {
            provider,
            now: () => new Date(SECOND_TIME),
        });
        const replay = await replayJobRequirementProposal(fixture.workspace, first.proposalId);
        expect(first.proposalId).toBe(second.proposalId);
        expect(second.result).toBe("cached");
        expect(second.providerCallMade).toBe(false);
        expect(provider.callCount).toBe(1);
        expect(replay.matches).toBe(true);
        expect(replay.originalSha256).toBe(replay.replaySha256);
    });
    it("rejects unsupported model proposals rather than inventing source provenance", async () => {
        const fixture = await builtJobWorkspace();
        const payload = await validProposalPayload(fixture.workspace, fixture.targetId);
        payload.proposedRequirements[0].sourceText = "An invented requirement.";
        const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
        const result = await generateJobRequirementProposal(fixture.workspace, fixture.targetId, {
            provider,
            now: () => new Date(FIRST_TIME),
        });
        const proposal = await showJobRequirementProposal(fixture.workspace, result.proposalId);
        expect(result.proposalStatus).toBe("validation-failed");
        expect(proposal.proposedRequirements).toEqual([]);
        expect(proposal.validationIssues).toEqual(expect.arrayContaining([
            expect.objectContaining({ code: "UNSUPPORTED_PROPOSAL" }),
        ]));
        expect((await getJobRequirementProposalStatus(fixture.workspace, result.proposalId)).readyForReview)
            .toBe(false);
    });
    it("reviews deterministic and proposed requirements without a model call", async () => {
        const fixture = await proposalWorkspace();
        const proposal = await showJobRequirementProposal(fixture.workspace, fixture.proposalId);
        const providerCalls = fixture.provider.callCount;
        let status = await initializeJobRequirementReview(fixture.workspace, fixture.proposalId, { reviewerName: "Reviewer", now: () => new Date(FIRST_TIME) });
        expect(status.counts.pending).toBeGreaterThan(1);
        const review = await showJobRequirementReview(fixture.workspace, fixture.proposalId);
        for (const decision of review.decisions) {
            status = await setJobRequirementReviewDecision(fixture.workspace, fixture.proposalId, decision.requirementId, {
                decision: decision.source === "deterministic" &&
                    requirementTextForDecision(decision.requirementId, fixture.model, proposal).includes("Collaboration across")
                    ? "reject"
                    : "accept",
            }, { now: () => new Date(SECOND_TIME) });
        }
        status = await completeJobRequirementReview(fixture.workspace, fixture.proposalId, { now: () => new Date(SECOND_TIME) });
        expect(status.status).toBe("completed");
        expect(status.counts.pending).toBe(0);
        expect(status.counts.accept).toBeGreaterThan(0);
        expect(status.counts.reject).toBe(1);
        expect(fixture.provider.callCount).toBe(providerCalls);
    });
    it("approves reviewed requirements without a model call and keeps exact provenance", async () => {
        const fixture = await completedReviewWorkspace();
        const providerCalls = fixture.provider.callCount;
        const result = await approveJobRequirements(fixture.workspace, fixture.targetId, {
            proposalId: fixture.proposalId,
            now: () => new Date(SECOND_TIME),
        });
        const approved = await showApprovedJobRequirements(fixture.workspace, fixture.targetId);
        const status = await getApprovedJobRequirementsStatus(fixture.workspace, fixture.targetId);
        expect(result.result).toBe("created");
        expect(result.rejectedCount).toBe(1);
        expect(approved.trustState).toBe("human-reviewed");
        expect(approved.requirements.every((entry) => ["human-approved", "human-edited"].includes(entry.trustState))).toBe(true);
        expect(approved.requirements.every((entry) => entry.provenance.sourceReferences.length > 0))
            .toBe(true);
        expect(approved.requirements.some((entry) => entry.sourceText === "An invented requirement."))
            .toBe(false);
        expect(status.status).toBe("current");
        expect(fixture.provider.callCount).toBe(providerCalls);
    });
    it("allows human classification edits while keeping source text and provenance immutable", async () => {
        const fixture = await proposalWorkspace();
        const providerCalls = fixture.provider.callCount;
        await initializeJobRequirementReview(fixture.workspace, fixture.proposalId, {
            reviewerName: "Reviewer",
            now: () => new Date(FIRST_TIME),
        });
        const review = await showJobRequirementReview(fixture.workspace, fixture.proposalId);
        const proposal = await showJobRequirementProposal(fixture.workspace, fixture.proposalId);
        const deterministicVague = review.decisions.find((decision) => decision.source === "deterministic" &&
            requirementTextForDecision(decision.requirementId, fixture.model, proposal).includes("Collaboration across"));
        expect(deterministicVague).toBeDefined();
        for (const decision of review.decisions) {
            if (decision.requirementId === deterministicVague?.requirementId) {
                await setJobRequirementReviewDecision(fixture.workspace, fixture.proposalId, decision.requirementId, {
                    decision: "edit",
                    editedRequirement: {
                        category: "operating-context",
                        normalizedLabel: "Collaboration across changing priorities",
                        necessity: "contextual",
                        confidence: "medium",
                        explicitness: "inferred",
                        relationships: [],
                        namedTechnologies: [],
                        keywords: [],
                        notes: ["Reviewed as operating context rather than a mandatory capability."],
                    },
                }, { now: () => new Date(SECOND_TIME) });
            }
            else {
                await setJobRequirementReviewDecision(fixture.workspace, fixture.proposalId, decision.requirementId, { decision: "accept" }, { now: () => new Date(SECOND_TIME) });
            }
        }
        await completeJobRequirementReview(fixture.workspace, fixture.proposalId, {
            now: () => new Date(SECOND_TIME),
        });
        await approveJobRequirements(fixture.workspace, fixture.targetId, {
            proposalId: fixture.proposalId,
            now: () => new Date(SECOND_TIME),
        });
        const approved = await showApprovedJobRequirements(fixture.workspace, fixture.targetId);
        const edited = approved.requirements.find((entry) => entry.approvalProvenance.reviewedRequirementId === deterministicVague?.requirementId);
        expect(edited).toMatchObject({
            category: "operating-context",
            necessity: "contextual",
            trustState: "human-edited",
            sourceText: "Collaboration across changing priorities.",
        });
        expect(edited?.provenance.sourceReferences).toEqual(requirementFor(fixture.model, "Collaboration across").provenance.sourceReferences);
        expect(fixture.provider.callCount).toBe(providerCalls);
    });
    it("marks policy changes stale and never silently replaces approved artifacts", async () => {
        const fixture = await approvedWorkspace();
        const stale = await getApprovedJobRequirementsStatus(fixture.workspace, fixture.targetId, { policyVersion: "2" });
        expect(stale.status).toBe("stale");
        expect(stale.policyMatches).toBe(false);
        const deterministicPath = deterministicArtifact(fixture.workspace, fixture.targetId, "job-requirement-model.json");
        await writeFile(deterministicPath, `${await readFile(deterministicPath, "utf8")} `, "utf8");
        expect((await getApprovedJobRequirementsStatus(fixture.workspace, fixture.targetId)).status)
            .toBe("stale");
        await expect(approveJobRequirements(fixture.workspace, fixture.targetId, {
            proposalId: fixture.proposalId,
        })).rejects.toThrow();
    });
    it("reports missing approved proposal dependencies as stale instead of crashing", async () => {
        const fixture = await approvedWorkspace();
        await rm(path.join(fixture.workspace, "targets", "jobs", fixture.targetId, "requirements", "proposals", fixture.proposalId), { recursive: true });
        const status = await getApprovedJobRequirementsStatus(fixture.workspace, fixture.targetId);
        expect(status.status).toBe("stale");
        expect(status.proposalHashMatches).toBe(false);
        expect(status.reasons).toEqual(expect.arrayContaining([
            expect.stringContaining("Approved review dependency is unavailable"),
        ]));
    });
    it("does not read or mutate candidate evidence during the complete job-only flow", async () => {
        const fixture = await builtJobWorkspace();
        const privateKb = path.join(fixture.workspace, "kb");
        await mkdir(privateKb, { recursive: true });
        const evidencePath = path.join(privateKb, "evidence-items.json");
        const claimsPath = path.join(privateKb, "claims.json");
        await writeFile(evidencePath, '{"private":"candidate evidence sentinel"}\n', "utf8");
        await writeFile(claimsPath, '{"private":"candidate claims sentinel"}\n', "utf8");
        const before = {
            evidence: await hashFile(evidencePath),
            claims: await hashFile(claimsPath),
        };
        const payload = await validProposalPayload(fixture.workspace, fixture.targetId);
        const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
        const generated = await generateJobRequirementProposal(fixture.workspace, fixture.targetId, {
            provider,
            now: () => new Date(FIRST_TIME),
        });
        await initializeJobRequirementReview(fixture.workspace, generated.proposalId);
        expect(await hashFile(evidencePath)).toBe(before.evidence);
        expect(await hashFile(claimsPath)).toBe(before.claims);
        expect(JSON.stringify(await showJobRequirementProposal(fixture.workspace, generated.proposalId)))
            .not.toContain("candidate evidence sentinel");
    });
});
async function temporaryWorkspace() {
    return mkdtemp(path.join(tmpdir(), "prooflayer-job-requirements-"));
}
async function preparedJobWorkspace() {
    const workspace = await temporaryWorkspace();
    const sourcePath = path.join(workspace, "imports", "engineering-director.md");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, JOB_DESCRIPTION, "utf8");
    const created = await createJobTarget(workspace, { file: sourcePath });
    await analyzeTarget(workspace, created.target.id, {
        now: () => new Date(FIRST_TIME),
    });
    return { workspace, targetId: created.target.id };
}
async function builtJobWorkspace() {
    const fixture = await preparedJobWorkspace();
    await buildJobRequirements(fixture.workspace, fixture.targetId, {
        now: () => new Date(FIRST_TIME),
    });
    return fixture;
}
async function proposalWorkspace() {
    const fixture = await builtJobWorkspace();
    const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
    const payload = await validProposalPayload(fixture.workspace, fixture.targetId);
    const provider = new FakeInterpretationModelProvider(JSON.stringify(payload));
    const generated = await generateJobRequirementProposal(fixture.workspace, fixture.targetId, {
        provider,
        now: () => new Date(FIRST_TIME),
    });
    return { ...fixture, model, provider, proposalId: generated.proposalId };
}
async function completedReviewWorkspace() {
    const fixture = await proposalWorkspace();
    const proposal = await showJobRequirementProposal(fixture.workspace, fixture.proposalId);
    await initializeJobRequirementReview(fixture.workspace, fixture.proposalId, {
        reviewerName: "Reviewer",
        now: () => new Date(FIRST_TIME),
    });
    const review = await showJobRequirementReview(fixture.workspace, fixture.proposalId);
    for (const decision of review.decisions) {
        const text = requirementTextForDecision(decision.requirementId, fixture.model, proposal);
        await setJobRequirementReviewDecision(fixture.workspace, fixture.proposalId, decision.requirementId, {
            decision: decision.source === "deterministic" && text.includes("Collaboration across")
                ? "reject"
                : "accept",
        }, { now: () => new Date(SECOND_TIME) });
    }
    await completeJobRequirementReview(fixture.workspace, fixture.proposalId, {
        now: () => new Date(SECOND_TIME),
    });
    return fixture;
}
async function approvedWorkspace() {
    const fixture = await completedReviewWorkspace();
    await approveJobRequirements(fixture.workspace, fixture.targetId, {
        proposalId: fixture.proposalId,
        now: () => new Date(SECOND_TIME),
    });
    return fixture;
}
async function validProposalPayload(workspace, targetId) {
    const model = await showJobRequirementModel(workspace, targetId);
    const source = requirementFor(model, "Collaboration across changing priorities");
    return {
        proposedRequirements: [{
                sourceRequirementIds: [source.id],
                sourceAnalysisItemIds: [source.provenance.sourceAnalysisItemId],
                sourceReferences: source.provenance.sourceReferences,
                category: "operating-context",
                normalizedLabel: "Collaboration across changing priorities",
                sourceText: source.sourceText,
                necessity: "contextual",
                confidence: "medium",
                explicitness: "inferred",
                relationships: [],
                namedTechnologies: [],
                keywords: [],
                rationale: "The source describes operating context but does not make it mandatory.",
                ambiguityNotes: ["Human review should confirm the contextual classification."],
            }],
        warnings: [],
    };
}
function requirementFor(model, text) {
    const found = model.requirements.find((entry) => entry.normalizedLabel.includes(text));
    if (!found)
        throw new Error(`Fixture requirement not found: ${text}`);
    return found;
}
function requirementTextForDecision(requirementId, model, proposal) {
    return model.requirements.find((entry) => entry.id === requirementId)?.normalizedLabel ??
        proposal.proposedRequirements.find((entry) => entry.id === requirementId)?.normalizedLabel ??
        "";
}
function deterministicArtifact(workspace, targetId, name) {
    return path.join(workspace, "targets", "jobs", targetId, "requirements", "deterministic", name);
}
