import { mkdir, mkdtemp, readFile, stat, writeFile, } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildJobCoverage } from "../job-coverage.js";
import { buildJobEvidenceMap, jobEvidenceMapPaths } from "../job-evidence-mapping.js";
import { buildJobFitProofAssessment, jobFitProofAssessmentPaths } from "../job-fit-proof-assessment.js";
import { JOB_RESUME_PLANNING_POLICY_NAME, JOB_RESUME_PLANNING_POLICY_VERSION, buildJobResumePlan, deriveJobPositioningState, deriveJobRequirementEmphasisDecision, getJobResumePlanStatus, jobResumePlanPaths, showJobResumePlan, } from "../job-resume-planning.js";
import { buildJobRequirements } from "../job-requirements.js";
import { hashFile, hashText, writeJsonAtomic } from "../fs-utils.js";
import { analyzeTarget } from "../target-analysis.js";
import { stableJson } from "../target-proposal.js";
import { createJobTarget, createRoleTarget } from "../targets.js";
import { pinCurrentEvidenceSnapshot } from "./evidence-snapshot-fixture.js";
const FIRST_TIME = "2026-07-28T08:00:00.000Z";
const SECOND_TIME = "2026-07-29T08:00:00.000Z";
const JOB_DESCRIPTION = [
    "---",
    "title: Technical Product Manager",
    "company: Example Systems",
    "---",
    "",
    "## Responsibilities",
    "- Lead API platform delivery.",
    "- Coordinate stakeholder roadmap decisions.",
    "",
    "## Required Qualifications",
    "- TypeScript and Node.js experience is required.",
    "- Arabic and English are required.",
    "",
    "## Preferred Qualifications",
    "- React Native experience is preferred.",
    "- Experience delivering 3 platform releases is preferred.",
    "",
].join("\n");
describe("Slice 2.7E deterministic Job-specific Resume Content Planning", () => {
    it("maps assessment states to controlled positioning and emphasis decisions", () => {
        expect(deriveJobPositioningState("strong")).toBe("direct");
        expect(deriveJobPositioningState("credible")).toBe("direct");
        expect(deriveJobPositioningState("mixed")).toBe("adjacent");
        expect(deriveJobPositioningState("limited")).toBe("stretch");
        expect(deriveJobPositioningState("insufficient")).toBe("insufficient-proof");
        expect(deriveJobPositioningState("indeterminate")).toBe("indeterminate");
        expect(emphasis("mandatory", "strength")).toBe("primary");
        expect(emphasis("preferred", "supported")).toBe("secondary");
        expect(emphasis("contextual", "supported")).toBe("supporting");
        expect(emphasis("mandatory", "partial")).toBe("secondary");
        expect(emphasis("preferred", "partial")).toBe("supporting");
        expect(emphasis("mandatory", "gap")).toBe("defer");
        expect(emphasis("preferred", "gap")).toBe("exclude");
        expect(emphasis("mandatory", "contradiction")).toBe("exclude");
        expect(emphasis("mandatory", "indeterminate")).toBe("defer");
    });
    it("builds one evidence-grounded planning artifact and manifest", async () => {
        const fixture = await planningWorkspace();
        const result = await buildJobResumePlan(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const plan = await showJobResumePlan(fixture.workspace, fixture.targetId);
        const paths = jobResumePlanPaths(fixture.workspace, fixture.targetId);
        expect(result).toMatchObject({
            result: "created",
            planPath: `targets/jobs/${fixture.targetId}/resume-planning/deterministic/job-resume-content-plan.json`,
        });
        expect(plan).toMatchObject({
            schemaVersion: 1,
            targetId: fixture.targetId,
            targetType: "job",
            mode: "job-specific-resume",
            policy: {
                name: JOB_RESUME_PLANNING_POLICY_NAME,
                version: JOB_RESUME_PLANNING_POLICY_VERSION,
                mode: "deterministic",
            },
            positioning: {
                targetTitle: "Technical Product Manager",
                targetTitleUse: "positioning-only",
            },
            completeness: {
                status: "complete",
                usableForDrafting: true,
            },
        });
        expect(plan.requirementEmphasis.length).toBeGreaterThan(0);
        expect(plan.requirementEmphasis).toHaveLength(plan.completeness.requirementIds.length);
        expect(await hashFile(paths.planPath)).toMatch(/^[a-f0-9]{64}$/);
        const manifest = JSON.parse(await readFile(paths.manifestPath, "utf8"));
        expect(manifest.manifestId).toMatch(/^job-resume-content-plan-manifest_[a-f0-9]{16}$/);
        expect(manifest.planSha256).toBe(await hashFile(paths.planPath));
        expect(manifest.assessmentSha256).toBe(await hashFile(jobFitProofAssessmentPaths(fixture.workspace, fixture.targetId).assessmentPath));
        expect(manifest.selectedEvidenceSetSha256).toMatch(/^[a-f0-9]{64}$/);
        expect(manifest.selectedClaimSetSha256).toMatch(/^[a-f0-9]{64}$/);
    });
    it("plans requirements, evidence reuse, sections, and exact provenance without rematching", async () => {
        const fixture = await planningWorkspace();
        await buildJobResumePlan(fixture.workspace, fixture.targetId);
        const plan = await showJobResumePlan(fixture.workspace, fixture.targetId);
        const mapPath = jobEvidenceMapPaths(fixture.workspace, fixture.targetId).mapPath;
        const map = JSON.parse(await readFile(mapPath, "utf8"));
        expect(plan.requirementEmphasis.some((entry) => entry.decision === "primary"))
            .toBe(true);
        expect(plan.requirementEmphasis.some((entry) => entry.necessity === "mandatory" && entry.decision === "defer")).toBe(true);
        expect(new Set(plan.evidenceSelections.map((entry) => entry.evidenceId)).size)
            .toBe(plan.evidenceSelections.length);
        expect(plan.evidenceSelections.some((entry) => entry.reuseWarning)).toBe(true);
        expect(plan.evidenceSelections.every((entry) => entry.requirementUses.filter((use) => use.decision === "primary").length <= 1)).toBe(true);
        const linkById = new Map(map.links.map((entry) => [entry.id, entry]));
        for (const entry of plan.requirementEmphasis) {
            expect(entry.provenance.requirementIds).toContain(entry.requirementId);
            expect(entry.provenance.coverageReferences).toHaveLength(1);
            expect(entry.provenance.assessmentReferences).toHaveLength(1);
            for (const reference of entry.provenance.evidenceLinkReferences) {
                expect(linkById.get(reference.linkId)?.requirementId).toBe(entry.requirementId);
                expect(reference.linkSha256).toBe(hashText(stableJson(linkById.get(reference.linkId))));
            }
        }
        const included = plan.sections
            .filter((entry) => entry.inclusion !== "exclude")
            .sort((left, right) => left.order - right.order);
        expect(included[0]?.type).toBe("headline");
        expect(included.some((entry) => entry.type === "professional-experience"))
            .toBe(true);
        expect(included.some((entry) => entry.type === "selected-projects"))
            .toBe(true);
        expect(included.every((entry, index) => entry.order === index)).toBe(true);
    });
    it("enforces target-title and project-versus-employment boundaries", async () => {
        const fixture = await planningWorkspace();
        await buildJobResumePlan(fixture.workspace, fixture.targetId);
        const plan = await showJobResumePlan(fixture.workspace, fixture.targetId);
        const titleBoundary = plan.claimBoundaries.find((entry) => entry.kind === "target-title");
        const projectBoundary = plan.claimBoundaries.find((entry) => entry.kind === "project-employment");
        const experience = plan.sections.find((entry) => entry.type === "professional-experience");
        const projects = plan.sections.find((entry) => entry.type === "selected-projects");
        expect(titleBoundary).toMatchObject({
            state: "allowed-with-qualifier",
            requiredQualifierCodes: ["target-title-positioning-only"],
            prohibitedInferenceCodes: expect.arrayContaining([
                "target-title-as-employment",
                "unsupported-seniority",
            ]),
        });
        expect(plan.positioning.prohibitedUses).toEqual(expect.arrayContaining([
            "employment-history",
            "seniority-proof",
            "authority-proof",
            "scope-proof",
        ]));
        expect(projectBoundary).toMatchObject({
            evidenceIds: ["evi_mobile_project"],
            requiredQualifierCodes: ["project-scoped-wording"],
        });
        expect(experience.evidenceIds).not.toContain("evi_mobile_project");
        expect(projects.evidenceIds).toContain("evi_mobile_project");
        expect(plan.exclusions.some((entry) => entry.type === "target-title-history" && entry.severity === "blocking")).toBe(true);
        expect(plan.exclusions.some((entry) => entry.type === "project-as-employment" &&
            entry.sourceIds.includes("evi_mobile_project"))).toBe(true);
    });
    it("permits only exact approved verified metrics and prohibits other quantification", async () => {
        const fixture = await planningWorkspace();
        await buildJobResumePlan(fixture.workspace, fixture.targetId);
        const plan = await showJobResumePlan(fixture.workspace, fixture.targetId);
        const allowed = plan.metricPermissions.find((entry) => entry.claimId === "claim_verified_releases");
        const prohibited = plan.metricPermissions.filter((entry) => entry.claimId !== "claim_verified_releases");
        const selectedImpact = plan.sections.find((entry) => entry.type === "selected-impact");
        expect(allowed).toMatchObject({
            state: "allowed",
            exactApprovedMetricText: "Delivered 3 platform releases.",
            qualifierCodes: expect.arrayContaining([
                "use-exact-approved-text",
                "do-not-round",
                "do-not-combine",
                "do-not-infer-scale",
            ]),
        });
        expect(prohibited.length).toBeGreaterThan(0);
        expect(prohibited.every((entry) => entry.state === "prohibited" && !entry.exactApprovedMetricText)).toBe(true);
        expect(selectedImpact.evidenceIds).toContain("evi_verified_releases");
    });
    it("creates explicit no-metric behavior when no verified metric is selected", async () => {
        const fixture = await planningWorkspace({ verifiedMetric: false });
        await buildJobResumePlan(fixture.workspace, fixture.targetId);
        const plan = await showJobResumePlan(fixture.workspace, fixture.targetId);
        expect(plan.metricPermissions.every((entry) => entry.state === "prohibited"))
            .toBe(true);
        expect(plan.warnings.some((entry) => entry.code === "NO_VERIFIED_METRIC_AVAILABLE")).toBe(true);
        expect(plan.risks.some((entry) => entry.code === "UNSUPPORTED_METRIC_RISK")).toBe(true);
    });
    it("represents gaps as constraints while allowing an honest mixed plan", async () => {
        const fixture = await planningWorkspace();
        await buildJobResumePlan(fixture.workspace, fixture.targetId);
        const plan = await showJobResumePlan(fixture.workspace, fixture.targetId);
        const mandatoryGap = plan.requirementEmphasis.find((entry) => entry.necessity === "mandatory" && entry.assessmentState === "gap");
        const handling = plan.gapHandling.find((entry) => entry.requirementId === mandatoryGap.requirementId);
        expect(mandatoryGap.decision).toBe("defer");
        expect(mandatoryGap.selectedEvidenceIds).toEqual([]);
        expect(handling).toMatchObject({
            decision: "exclude-positive-positioning",
            adjacentEvidenceIds: [],
            constraintCodes: expect.arrayContaining([
                "not-positive-positioning",
                "no-compensating-narrative",
                "no-application-advice",
            ]),
        });
        expect(plan.completeness).toMatchObject({
            status: "complete",
            criticalConstraintsRepresented: true,
            usableForDrafting: true,
        });
    });
    it("keeps an insufficient assessment complete but unavailable for drafting", async () => {
        const fixture = await planningWorkspace({ noEvidence: true });
        await buildJobResumePlan(fixture.workspace, fixture.targetId);
        const plan = await showJobResumePlan(fixture.workspace, fixture.targetId);
        expect(plan.positioning.state).toBe("insufficient-proof");
        expect(plan.completeness).toMatchObject({
            status: "complete",
            selectedRequirementIds: [],
            usableForDrafting: false,
            blockingReasons: expect.arrayContaining([
                "No requirement has defensible selected evidence for drafting.",
                "Overall proof is insufficient for job-specific resume drafting.",
            ]),
        });
    });
    it("does not write resume prose, application recommendations, or numeric scores", async () => {
        const fixture = await planningWorkspace();
        await buildJobResumePlan(fixture.workspace, fixture.targetId);
        const serialized = await readFile(jobResumePlanPaths(fixture.workspace, fixture.targetId).planPath, "utf8");
        expect(serialized).not.toMatch(/"headlineText"|"summaryText"|"resumeBullet"|"experienceProse"|"applicationRecommendation"|"atsScore"|"fitScore"|"hiringProbability"/);
        expect(serialized).toContain('"NOT_A_RESUME"');
        expect(serialized).toContain('"NO_APPLICATION_RECOMMENDATION"');
        expect(serialized).toContain('"NO_ATS_SCORE"');
    });
    it("preserves bytes, hashes, stable IDs, timestamps, and mtimes on unchanged rerun", async () => {
        const fixture = await planningWorkspace();
        await buildJobResumePlan(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const paths = jobResumePlanPaths(fixture.workspace, fixture.targetId);
        const before = {
            plan: await readFile(paths.planPath, "utf8"),
            manifest: await readFile(paths.manifestPath, "utf8"),
            planStat: await stat(paths.planPath),
            manifestStat: await stat(paths.manifestPath),
            value: await showJobResumePlan(fixture.workspace, fixture.targetId),
        };
        const result = await buildJobResumePlan(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        const after = await showJobResumePlan(fixture.workspace, fixture.targetId);
        expect(result.result).toBe("already-current");
        expect(await readFile(paths.planPath, "utf8")).toBe(before.plan);
        expect(await readFile(paths.manifestPath, "utf8")).toBe(before.manifest);
        expect((await stat(paths.planPath)).mtimeMs).toBe(before.planStat.mtimeMs);
        expect((await stat(paths.manifestPath)).mtimeMs).toBe(before.manifestStat.mtimeMs);
        expect(after.id).toBe(before.value.id);
        expect(after.requirementEmphasis.map((entry) => entry.id)).toEqual(before.value.requirementEmphasis.map((entry) => entry.id));
        expect(after.sections.map((entry) => entry.id)).toEqual(before.value.sections.map((entry) => entry.id));
        expect(after.createdAt).toBe(FIRST_TIME);
        expect(after.updatedAt).toBe(FIRST_TIME);
    });
    it("reports missing, current, stale, and invalid lifecycle states", async () => {
        const fixture = await planningWorkspace();
        expect((await getJobResumePlanStatus(fixture.workspace, fixture.targetId)).status).toBe("missing");
        await buildJobResumePlan(fixture.workspace, fixture.targetId);
        expect(await getJobResumePlanStatus(fixture.workspace, fixture.targetId)).toMatchObject({
            status: "current",
            planHashMatches: true,
            assessmentStatus: "current",
            normalizedInputHashMatches: true,
        });
        const assessmentPath = jobFitProofAssessmentPaths(fixture.workspace, fixture.targetId).assessmentPath;
        await writeFile(assessmentPath, `${await readFile(assessmentPath, "utf8")} `, "utf8");
        expect((await getJobResumePlanStatus(fixture.workspace, fixture.targetId)).status).toBe("stale");
        const fresh = await planningWorkspace();
        await buildJobResumePlan(fresh.workspace, fresh.targetId);
        const paths = jobResumePlanPaths(fresh.workspace, fresh.targetId);
        await writeFile(paths.planPath, `${await readFile(paths.planPath, "utf8")} `);
        expect((await getJobResumePlanStatus(fresh.workspace, fresh.targetId)).status).toBe("invalid");
        await expect(buildJobResumePlan(fresh.workspace, fresh.targetId)).rejects.toThrow("use --rebuild");
        expect((await buildJobResumePlan(fresh.workspace, fresh.targetId, {
            rebuild: true,
        })).result).toBe("rebuilt");
    });
    it("rejects Role Targets, stale dependencies, and cross-target artifacts", async () => {
        const workspace = await temporaryWorkspace();
        const role = await createRoleTarget(workspace, {
            title: "Technical Product Manager",
        });
        await expect(buildJobResumePlan(workspace, role.target.id)).rejects.toThrow("rejects Role Target");
        const stale = await planningWorkspace();
        const assessmentPath = jobFitProofAssessmentPaths(stale.workspace, stale.targetId).assessmentPath;
        await writeFile(assessmentPath, `${await readFile(assessmentPath, "utf8")} `, "utf8");
        await expect(buildJobResumePlan(stale.workspace, stale.targetId)).rejects.toThrow("requires a current Job Fit and Proof Assessment");
        const crossTarget = await planningWorkspace();
        const second = await createPlanningJob(crossTarget.workspace, "other-job.md", JOB_DESCRIPTION.replace("Example Systems", "Other Systems"));
        const paths = jobFitProofAssessmentPaths(crossTarget.workspace, crossTarget.targetId);
        const manifest = JSON.parse(await readFile(paths.manifestPath, "utf8"));
        manifest.targetId = second;
        await writeJsonAtomic(paths.manifestPath, manifest);
        await expect(buildJobResumePlan(crossTarget.workspace, crossTarget.targetId)).rejects.toThrow("requires a current Job Fit and Proof Assessment");
    });
    it("does not modify upstream target, Job Description, assessment, or candidate evidence", async () => {
        const fixture = await planningWorkspace();
        const assessmentPaths = jobFitProofAssessmentPaths(fixture.workspace, fixture.targetId);
        const protectedPaths = [
            path.join(fixture.workspace, "targets", "jobs", fixture.targetId, "target.json"),
            path.join(fixture.workspace, "targets", "jobs", fixture.targetId, "job-description.md"),
            jobEvidenceMapPaths(fixture.workspace, fixture.targetId).mapPath,
            assessmentPaths.assessmentPath,
            path.join(fixture.workspace, "kb", "sources.json"),
            path.join(fixture.workspace, "kb", "evidence-items.json"),
            path.join(fixture.workspace, "kb", "claims.json"),
        ];
        const before = await Promise.all(protectedPaths.map(hashFile));
        await buildJobResumePlan(fixture.workspace, fixture.targetId);
        expect(await Promise.all(protectedPaths.map(hashFile))).toEqual(before);
    });
});
function emphasis(necessity, assessmentState) {
    return deriveJobRequirementEmphasisDecision({
        necessity,
        assessmentState,
        proofStrength: assessmentState === "strength" ? "strong" : "adequate",
        materiality: necessity === "mandatory" ? "material" : "secondary",
    });
}
async function temporaryWorkspace() {
    return mkdtemp(path.join(tmpdir(), "prooflayer-job-resume-plan-"));
}
async function planningWorkspace(options = {}) {
    const workspace = await temporaryWorkspace();
    const targetId = await createPlanningJob(workspace, "job.md");
    if (options.noEvidence) {
        await writeEmptyCandidateKnowledgeBase(workspace);
    }
    else {
        await writeCandidateKnowledgeBase(workspace, options.verifiedMetric ?? true);
    }
    await pinCurrentEvidenceSnapshot(workspace, targetId, () => new Date(FIRST_TIME));
    await buildJobEvidenceMap(workspace, targetId, {
        now: () => new Date(FIRST_TIME),
    });
    await buildJobCoverage(workspace, targetId, {
        now: () => new Date(FIRST_TIME),
    });
    await buildJobFitProofAssessment(workspace, targetId, {
        now: () => new Date(FIRST_TIME),
    });
    return { workspace, targetId };
}
async function writeEmptyCandidateKnowledgeBase(workspace) {
    const kb = path.join(workspace, "kb");
    await mkdir(kb, { recursive: true });
    await writeJsonAtomic(path.join(kb, "sources.json"), []);
    await writeJsonAtomic(path.join(kb, "evidence-items.json"), []);
    await writeJsonAtomic(path.join(kb, "claims.json"), []);
}
async function createPlanningJob(workspace, filename, description = JOB_DESCRIPTION) {
    const sourcePath = path.join(workspace, "imports", filename);
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, description, "utf8");
    const created = await createJobTarget(workspace, { file: sourcePath });
    await analyzeTarget(workspace, created.target.id, {
        now: () => new Date(FIRST_TIME),
    });
    await buildJobRequirements(workspace, created.target.id, {
        now: () => new Date(FIRST_TIME),
    });
    return created.target.id;
}
async function writeCandidateKnowledgeBase(workspace, verifiedMetric) {
    const sources = [{
            id: "src_reviewed",
            type: "markdown",
            path: "sources/markdown/reviewed-evidence.md",
            title: "Reviewed evidence",
            importedAt: FIRST_TIME,
            hash: hashText("reviewed source bytes"),
            visibility: "public",
            status: "active",
        }];
    const evidence = [
        {
            id: "evi_platform_role",
            sourceIds: ["src_reviewed"],
            category: "responsibility",
            text: "Led API platform delivery with TypeScript and Node.js and coordinated stakeholder roadmap decisions.",
            normalizedSummary: "Led API platform delivery with TypeScript and Node.js and coordinated stakeholder roadmap decisions.",
            parentRoleId: "role_platform_lead",
            sourceSection: "Professional Experience",
            technologies: ["API", "TypeScript", "Node.js"],
            domains: ["platform"],
            visibility: "public",
            sensitivityFlags: [],
            confidence: "high",
        },
        {
            id: "evi_mobile_project",
            sourceIds: ["src_reviewed"],
            category: "project",
            text: "Built a React Native product prototype.",
            normalizedSummary: "Built a React Native product prototype.",
            parentProjectId: "project_mobile_prototype",
            sourceSection: "Selected Projects",
            technologies: ["React Native"],
            domains: ["mobile"],
            visibility: "public",
            sensitivityFlags: [],
            confidence: "high",
        },
        {
            id: "evi_verified_releases",
            sourceIds: ["src_reviewed"],
            category: "achievement",
            text: "Delivered 3 platform releases.",
            normalizedSummary: "Delivered 3 platform releases.",
            parentRoleId: "role_platform_lead",
            sourceSection: "Professional Experience",
            domains: ["platform"],
            visibility: "public",
            sensitivityFlags: [],
            confidence: "high",
        },
    ];
    const claims = [
        approvedClaim({
            id: "claim_platform_role",
            wording: "Led API platform delivery with TypeScript and Node.js and coordinated stakeholder roadmap decisions.",
            evidenceId: "evi_platform_role",
            type: "responsibility_claim",
            parentRoleId: "role_platform_lead",
            metricStatus: "no_metric",
        }),
        approvedClaim({
            id: "claim_mobile_project",
            wording: "Built a React Native product prototype.",
            evidenceId: "evi_mobile_project",
            type: "project_claim",
            parentProjectId: "project_mobile_prototype",
            metricStatus: "no_metric",
        }),
        approvedClaim({
            id: "claim_verified_releases",
            wording: "Delivered 3 platform releases.",
            evidenceId: "evi_verified_releases",
            type: "impact_claim",
            parentRoleId: "role_platform_lead",
            metricStatus: verifiedMetric ? "verified_metric" : "needs_metric",
        }),
    ];
    const kb = path.join(workspace, "kb");
    await mkdir(kb, { recursive: true });
    await writeJsonAtomic(path.join(kb, "sources.json"), sources);
    await writeJsonAtomic(path.join(kb, "evidence-items.json"), evidence);
    await writeJsonAtomic(path.join(kb, "claims.json"), claims);
}
function approvedClaim(input) {
    return {
        id: input.id,
        claim: input.wording,
        approvedWording: input.wording,
        type: input.type,
        supportingEvidenceIds: [input.evidenceId],
        ...(input.parentRoleId ? { parentRoleId: input.parentRoleId } : {}),
        ...(input.parentProjectId ? { parentProjectId: input.parentProjectId } : {}),
        sourceSection: input.parentProjectId
            ? "Selected Projects"
            : "Professional Experience",
        extractionConfidence: "high",
        factualConfidence: "high",
        corroborationLevel: "manual_approved",
        approvalStatus: "approved",
        outputReadiness: "resume_ready",
        confidence: "high",
        publicSafe: true,
        needsConfirmation: false,
        metricStatus: input.metricStatus,
        unsafeWording: [],
    };
}
