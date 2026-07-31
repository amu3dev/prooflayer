import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { projectCareerTwin } from "../career-twin.js";
import { buildEvidenceReviewBatch } from "../evidence-review-batch.js";
import { submitEvidenceReviewUiClaim } from "../evidence-review-ui.js";
import { writeJsonAtomic } from "../fs-utils.js";
import { addCareerSource, createProductJobJourney, inspectProductJobJourney, startRoleResumeJourney, } from "../product-workflows.js";
import { showTarget } from "../targets.js";
import { createEvidenceReviewUiFixture, validApprovedFields, } from "./evidence-review-ui-fixture.js";
import { createProductShellFixture } from "./product-shell-fixture.js";
describe("Career Twin product projection", () => {
    it("starts from one source without requiring LinkedIn or GitHub", async () => {
        const fixture = await createProductShellFixture();
        const twin = await projectCareerTwin(fixture.workspace);
        expect(twin.identity.name).toBe("Alex Example");
        expect(twin.roles).toHaveLength(1);
        expect(twin.projects).toHaveLength(1);
        expect(twin.skills.map(({ name }) => name)).toEqual(["TypeScript"]);
        expect(twin.sources).toHaveLength(1);
        expect(twin.status.sourceMessage).toBe("This is enough to start. You can add more later.");
        expect(twin.sourceTypeCounts).toEqual([{ type: "cv", label: "CV or resume", count: 1 }]);
        expect(twin.sources.some(({ type }) => type === "github_summary" || type === "linkedin_export")).toBe(false);
    });
    it("creates a title-only Role journey without re-uploading sources or treating the target as history", async () => {
        const fixture = await createProductShellFixture();
        const sourceBefore = await stat(path.join(fixture.workspace, fixture.source.path));
        const result = await startRoleResumeJourney(fixture.workspace, { title: "Engineering Manager" });
        const rerun = await startRoleResumeJourney(fixture.workspace, { title: "Engineering Manager" });
        const stored = await showTarget(fixture.workspace, "role-engineering-manager");
        const twin = await projectCareerTwin(fixture.workspace);
        expect(result.target?.id).toBe("role-engineering-manager");
        expect(rerun.target?.id).toBe(result.target?.id);
        expect(stored).toMatchObject({ type: "role", title: "Engineering Manager" });
        expect(result.currentValue).toContain("no source re-upload is required");
        expect(result.blocker).toContain("will not infer role expectations from a title alone");
        expect(twin.roles.map(({ title }) => title)).not.toContain("Engineering Manager");
        expect((await stat(path.join(fixture.workspace, fixture.source.path))).mtimeMs).toBe(sourceBefore.mtimeMs);
    });
    it("projects the Natterbox fit honestly without hiring probability or internal stage names in primary fields", async () => {
        const fixture = await createProductShellFixture();
        const journey = await inspectProductJobJourney(fixture.workspace, fixture.jobTargetId);
        expect(journey.target).toMatchObject({ company: "Natterbox", workingModel: "hybrid" });
        expect(journey.fit.label).toBe("insufficient evidence");
        expect(journey.fit.mandatory.total).toBeGreaterThan(0);
        expect(journey.nextAction).toContain("Add or update a source");
        expect(JSON.stringify({ fit: journey.fit, nextAction: journey.nextAction })).not.toMatch(/hiring probability|chance of getting hired|ATS score/i);
        expect(journey.progress.map(({ label }) => label)).toEqual([
            "Job understood",
            "Fit analyzed",
            "Resume tailored",
            "Ready for review",
            "Exported",
        ]);
    });
    it("accepts a Job Description title from deterministic front matter", async () => {
        const fixture = await createProductShellFixture({ runJob: false });
        const journey = await createProductJobJourney(fixture.workspace, {
            description: [
                "---",
                "title: Engineering Manager",
                "company: ExampleCo",
                "workingModel: Hybrid",
                "---",
                "",
                "## Requirements",
                "",
                "- Lead engineering delivery.",
                "",
            ].join("\n"),
        });
        expect(journey.target).toMatchObject({
            id: "job-exampleco-engineering-manager",
            title: "Engineering Manager",
            company: "ExampleCo",
            workingModel: "hybrid",
        });
    });
    it("adds an exact local source once and never mutates the source on an unchanged rerun", async () => {
        const fixture = await createProductShellFixture();
        const bytes = Buffer.from("A new project note.\nSecond line.\n", "utf8");
        const first = await addCareerSource(fixture.workspace, { title: "New project note", content: bytes });
        const before = await stat(path.join(fixture.workspace, first.path));
        const second = await addCareerSource(fixture.workspace, { title: "New project note", content: bytes });
        expect(first.result).toBe("created");
        expect(second).toEqual({ path: first.path, result: "already-present" });
        expect(await readFile(path.join(fixture.workspace, first.path))).toEqual(bytes);
        expect((await stat(path.join(fixture.workspace, first.path))).mtimeMs).toBe(before.mtimeMs);
    });
    it("does not ask a resolved question twice and asks again only after its evidence changes", async () => {
        const fixture = await createEvidenceReviewUiFixture();
        const before = await projectCareerTwin(fixture.workspace);
        expect(before.questions.map(({ claimId }) => claimId)).toContain("claim_review_ui_3");
        await submitEvidenceReviewUiClaim(fixture.workspace, fixture.batchId, "claim_review_ui_3", validApprovedFields());
        const resolved = await projectCareerTwin(fixture.workspace);
        expect(resolved.questions.map(({ claimId }) => claimId)).not.toContain("claim_review_ui_3");
        await expect(stat(path.join(fixture.workspace, ".prooflayer-ui"))).rejects.toThrow();
        const changedEvidence = fixture.evidence.map((entry) => entry.id === "evi_review_ui_3"
            ? { ...entry, text: `${entry.text} Materially changed source wording.` }
            : entry);
        await writeJsonAtomic(path.join(fixture.workspace, "kb/evidence-items.json"), changedEvidence);
        await buildEvidenceReviewBatch(fixture.workspace, fixture.targetId, {
            subsetSize: 4,
            now: () => new Date("2026-07-31T10:00:00.000Z"),
        });
        const changed = await projectCareerTwin(fixture.workspace);
        expect(changed.questions.map(({ claimId }) => claimId)).toContain("claim_review_ui_3");
    });
});
