import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { hashFile } from "../fs-utils.js";
import { JOB_REQUIREMENT_POLICY_VERSION, buildJobRequirements, getJobRequirementModelStatus, showJobRequirementModel, } from "../job-requirements.js";
import { TARGET_ANALYZER_VERSION, analyzeTarget, getTargetAnalysisStatus, showTargetAnalysis, } from "../target-analysis.js";
import { createJobTarget } from "../targets.js";
import { NATTERBOX_JOB_DESCRIPTION, NATTERBOX_JOB_DESCRIPTION_SHA256, } from "./fixtures/natterbox-job-description.js";
const FIRST_TIME = "2026-07-29T09:00:00.000Z";
const SECOND_TIME = "2026-07-30T09:00:00.000Z";
describe("plain-text Job Description structure normalization", () => {
    it("preserves the exact Natterbox bytes while recognizing plain-text section scope", async () => {
        const fixture = await preparedNatterboxWorkspace();
        const sourceBefore = await readFile(fixture.sourcePath);
        await analyzeTarget(fixture.workspace, fixture.targetId, {
            now: () => new Date(FIRST_TIME),
        });
        const analysis = await showTargetAnalysis(fixture.workspace, fixture.targetId);
        expect(createHash("sha256").update(sourceBefore).digest("hex"))
            .toBe(NATTERBOX_JOB_DESCRIPTION_SHA256);
        expect(await readFile(fixture.persistedSourcePath)).toEqual(sourceBefore);
        expect(analysis.analyzer.version).toBe(TARGET_ANALYZER_VERSION);
        expect(analysis.sections.filter((section) => section.heading).map((section) => [
            section.heading,
            section.classification,
        ])).toEqual([
            ["About the job", "about-role"],
            ["What You'll Own", "responsibilities"],
            ["How We Work", "other"],
            ["Requirements", "required"],
            ["What you must have", "required"],
            ["Nice to have", "preferred"],
            ["Benefits", "benefits"],
        ]);
        const requirements = sectionFor(analysis, "Requirements");
        expect(sectionFor(analysis, "What you must have").parentSectionId).toBe(requirements.id);
        expect(sectionFor(analysis, "Nice to have").parentSectionId).toBe(requirements.id);
        expect(await readFile(fixture.persistedSourcePath)).toEqual(sourceBefore);
    });
    it("joins wrapped bullets and wrapped paragraphs into exact semantic source blocks", async () => {
        const fixture = await analyzedNatterboxWorkspace();
        const analysis = await showTargetAnalysis(fixture.workspace, fixture.targetId);
        const shipped = itemFor(analysis, "Shipped conversational-AI");
        const company = itemFor(analysis, "Natterbox builds AI communications");
        const crm = itemFor(analysis, "Built products on, or integrated with, a CRM");
        expect(shipped).toMatchObject({
            kind: "list-item",
            statement: "Shipped conversational-AI, LLM-based or agent products to market, as the person building them rather than a user of them.",
            necessity: "required",
        });
        expect(shipped.rawText).toContain("\n  person building them rather than a user of them.");
        expect(shipped.sourceReferences[0]).toMatchObject({ startLine: 37, endLine: 38 });
        expect(company).toMatchObject({
            kind: "paragraph",
            statement: "Natterbox builds AI communications that elevate human-led customer conversations, integrated with Salesforce and the wider CRM stack.",
        });
        expect(company.sourceReferences[0]).toMatchObject({ startLine: 7, endLine: 8 });
        expect(crm.sourceReferences[0]).toMatchObject({ startLine: 39, endLine: 40 });
        expect(analysis.sections.some((section) => section.heading === "preferred.")).toBe(false);
    });
    it("models coherent mandatory, preferred, and contextual Natterbox requirements", async () => {
        const fixture = await builtNatterboxWorkspace();
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const counts = Object.fromEntries(["mandatory", "preferred", "contextual", "ambiguous"].map((necessity) => [
            necessity,
            model.requirements.filter((requirement) => requirement.necessity === necessity).length,
        ]));
        expect(model.policy.version).toBe(JOB_REQUIREMENT_POLICY_VERSION);
        expect(model.requirements).toHaveLength(16);
        expect(model.requirements.length).toBeLessThan(35);
        expect(model.ambiguities).toHaveLength(0);
        expect(model.ambiguities.length).toBeLessThan(31);
        expect(counts).toEqual({
            mandatory: 4,
            preferred: 3,
            contextual: 9,
            ambiguous: 0,
        });
        expect(requirementFor(model, "Shipped conversational-AI")).toMatchObject({
            necessity: "mandatory",
            category: "technical-expectation",
        });
        expect(requirementFor(model, "design-led product development")).toMatchObject({
            necessity: "mandatory",
            category: "required-capability",
        });
        expect(requirementFor(model, "hands-on work")).toMatchObject({
            necessity: "mandatory",
            category: "leadership-expectation",
        });
    });
    it("keeps CRM mandatory and Salesforce strongly preferred with a stable relationship", async () => {
        const fixture = await builtNatterboxWorkspace();
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const crm = requirementFor(model, "integrated with, a CRM.");
        const salesforce = requirementFor(model, "Salesforce is strongly preferred.");
        expect(crm).toMatchObject({
            normalizedLabel: "Built products on, or integrated with, a CRM.",
            necessity: "mandatory",
            category: "technical-expectation",
        });
        expect(salesforce).toMatchObject({
            necessity: "preferred",
            category: "technical-expectation",
            namedTechnologies: ["Salesforce"],
        });
        expect(crm.relationships).toContainEqual({
            type: "related-to",
            requirementId: salesforce.id,
        });
        expect(salesforce.relationships).toContainEqual({
            type: "related-to",
            requirementId: crm.id,
        });
        expect(crm.provenance.sourceAnalysisItemId).toBe(salesforce.provenance.sourceAnalysisItemId);
        expect(crm.provenance.sourceReferences).toEqual(salesforce.provenance.sourceReferences);
    });
    it("keeps nice-to-have domain/platform items preferred and excludes benefits capabilities", async () => {
        const fixture = await builtNatterboxWorkspace();
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        expect(requirementFor(model, "platform or extensible products")).toMatchObject({
            necessity: "preferred",
            category: "technical-expectation",
        });
        expect(requirementFor(model, "contact centres or customer experience")).toMatchObject({
            necessity: "preferred",
            category: "domain-expectation",
        });
        expect(model.requirements.some((requirement) => /salary|bonus/i.test(requirement.normalizedLabel)))
            .toBe(false);
        expect(model.requirements.some((requirement) => requirement.normalizedLabel.includes("shape a product line"))).toBe(false);
        expect(requirementFor(model, "Hybrid working, based in the UK")).toMatchObject({
            necessity: "contextual",
            category: "location-travel-visa-work-mode",
        });
        expect(requirementFor(model, "meet-ups in London")).toMatchObject({
            necessity: "contextual",
            category: "location-travel-visa-work-mode",
        });
    });
    it("retains exact full-source, line, byte-offset, and excerpt provenance", async () => {
        const fixture = await builtNatterboxWorkspace();
        const model = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const source = await readFile(fixture.persistedSourcePath);
        for (const requirement of model.requirements) {
            expect(requirement.provenance.sourceSectionId).toBeTruthy();
            for (const reference of requirement.provenance.sourceReferences) {
                expect(reference.sha256).toBe(NATTERBOX_JOB_DESCRIPTION_SHA256);
                expect(reference.startLine).toBeGreaterThan(0);
                expect(reference.endLine).toBeGreaterThanOrEqual(reference.startLine);
                const excerpt = source.subarray(reference.startOffset, reference.endOffset);
                expect(createHash("sha256").update(excerpt).digest("hex"))
                    .toBe(reference.excerptSha256);
                expect(excerpt.toString("utf8")).toContain(requirement.sourceText.split("\n")[0] ?? requirement.sourceText);
            }
        }
        const crm = requirementFor(model, "integrated with, a CRM.");
        expect(crm.provenance.sourceReferences[0]).toMatchObject({
            startLine: 39,
            endLine: 40,
        });
    });
    it("preserves stable IDs, bytes, hashes, timestamps, and mtimes on unchanged reruns", async () => {
        const fixture = await builtNatterboxWorkspace();
        const paths = requirementArtifacts(fixture.workspace, fixture.targetId);
        const firstModel = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const before = await Promise.all([
            readFile(paths.model),
            readFile(paths.manifest),
            stat(paths.model),
            stat(paths.manifest),
        ]);
        const modelHashBefore = await hashFile(paths.model);
        const analysisResult = await analyzeTarget(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        const requirementResult = await buildJobRequirements(fixture.workspace, fixture.targetId, {
            now: () => new Date(SECOND_TIME),
        });
        const secondModel = await showJobRequirementModel(fixture.workspace, fixture.targetId);
        const after = await Promise.all([
            readFile(paths.model),
            readFile(paths.manifest),
            stat(paths.model),
            stat(paths.manifest),
        ]);
        expect(analysisResult.result).toBe("already-current");
        expect(requirementResult.result).toBe("already-current");
        expect(after[0]).toEqual(before[0]);
        expect(after[1]).toEqual(before[1]);
        expect(after[2].mtimeMs).toBe(before[2].mtimeMs);
        expect(after[3].mtimeMs).toBe(before[3].mtimeMs);
        expect(secondModel.createdAt).toBe(FIRST_TIME);
        expect(secondModel.updatedAt).toBe(FIRST_TIME);
        expect(secondModel.requirements.map((requirement) => requirement.id))
            .toEqual(firstModel.requirements.map((requirement) => requirement.id));
        expect(await hashFile(paths.model)).toBe(modelHashBefore);
    });
    it("invalidates version-1 analysis and requirement-policy dependencies without rewriting", async () => {
        const fixture = await builtNatterboxWorkspace();
        const paths = requirementArtifacts(fixture.workspace, fixture.targetId);
        const before = {
            model: await readFile(paths.model),
            manifest: await readFile(paths.manifest),
        };
        expect((await getTargetAnalysisStatus(fixture.workspace, fixture.targetId, {
            analyzerVersion: "1",
        })).status).toBe("stale");
        expect((await getJobRequirementModelStatus(fixture.workspace, fixture.targetId, {
            policyVersion: "1",
        })).status).toBe("stale");
        expect(await readFile(paths.model)).toEqual(before.model);
        expect(await readFile(paths.manifest)).toEqual(before.manifest);
    });
});
async function preparedNatterboxWorkspace() {
    const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-natterbox-normalization-"));
    const sourcePath = path.join(workspace, "imports", "natterbox.md");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, NATTERBOX_JOB_DESCRIPTION, "utf8");
    const created = await createJobTarget(workspace, {
        file: sourcePath,
        title: "Product Owner - Conversational AI and Agents",
        company: "Natterbox",
        location: "London, England, United Kingdom",
        workingModel: "Hybrid",
    }, {
        now: () => new Date(FIRST_TIME),
    });
    return {
        workspace,
        sourcePath,
        targetId: created.target.id,
        persistedSourcePath: path.join(workspace, "targets", "jobs", created.target.id, "job-description.md"),
    };
}
async function analyzedNatterboxWorkspace() {
    const fixture = await preparedNatterboxWorkspace();
    await analyzeTarget(fixture.workspace, fixture.targetId, {
        now: () => new Date(FIRST_TIME),
    });
    return fixture;
}
async function builtNatterboxWorkspace() {
    const fixture = await analyzedNatterboxWorkspace();
    await buildJobRequirements(fixture.workspace, fixture.targetId, {
        now: () => new Date(FIRST_TIME),
    });
    return fixture;
}
function sectionFor(analysis, heading) {
    const section = analysis.sections.find((candidate) => candidate.heading === heading);
    if (!section)
        throw new Error(`Fixture section not found: ${heading}`);
    return section;
}
function itemFor(analysis, text) {
    const item = analysis.items.find((candidate) => candidate.statement.includes(text));
    if (!item)
        throw new Error(`Fixture analysis item not found: ${text}`);
    return item;
}
function requirementFor(model, text) {
    const requirement = model.requirements.find((candidate) => candidate.normalizedLabel.includes(text));
    if (!requirement)
        throw new Error(`Fixture requirement not found: ${text}`);
    return requirement;
}
function requirementArtifacts(workspace, targetId) {
    const root = path.join(workspace, "targets", "jobs", targetId, "requirements", "deterministic");
    return {
        model: path.join(root, "job-requirement-model.json"),
        manifest: path.join(root, "job-requirement-model-manifest.json"),
    };
}
