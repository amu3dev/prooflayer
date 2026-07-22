import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { JOB_DESCRIPTION_FILE_NAME, createJobTarget, createRoleTarget, formatTargetJson, formatTargetList, listTargets, showTarget } from "../targets.js";
const FIXED_TIME = "2026-07-19T12:00:00.000Z";
const fixedNow = () => new Date(FIXED_TIME);
describe("Slice 2.1 target modeling foundation", () => {
    it("creates a normalized role target with a deterministic slug-safe ID", async () => {
        const firstWorkspace = await temporaryWorkspace();
        const secondWorkspace = await temporaryWorkspace();
        const input = {
            title: "  Engineering   Manager  ",
            seniority: " Senior ",
            domain: " Platform ",
            location: " Remote   Europe ",
            workingModel: " Remote "
        };
        const first = await createRoleTarget(firstWorkspace, input, { now: fixedNow });
        const second = await createRoleTarget(secondWorkspace, input, { now: fixedNow });
        expect(first.target).toEqual({
            schemaVersion: 1,
            id: "role-engineering-manager",
            type: "role",
            title: "Engineering Manager",
            seniority: "senior",
            domain: "platform",
            location: "Remote Europe",
            workingModel: "remote",
            createdAt: FIXED_TIME,
            updatedAt: FIXED_TIME
        });
        expect(second.target.id).toBe(first.target.id);
        expect(first.targetPath).toBe("targets/roles/role-engineering-manager/target.json");
        expect(JSON.parse(await readFile(path.join(firstWorkspace, first.targetPath), "utf8"))).toEqual(first.target);
    });
    it("rejects an empty role title", async () => {
        const workspace = await temporaryWorkspace();
        await expect(createRoleTarget(workspace, { title: "   " })).rejects.toThrow("Role target title is required and must not be blank.");
    });
    it("creates a job target from front matter with exact bytes and SHA-256", async () => {
        const workspace = await temporaryWorkspace();
        const sourcePath = path.join(workspace, "jobs/exampleco-engineering-manager.md");
        const sourceBytes = Buffer.from([
            0x2d, 0x2d, 0x2d, 0x0a,
            ...Buffer.from("title: Engineering Manager\ncompany: ExampleCo\nlocation: Berlin, Germany\nworkingModel: Hybrid\n---\n\n# Role\n\nLead platform delivery — without changing this text.\n", "utf8")
        ]);
        await mkdir(path.dirname(sourcePath), { recursive: true });
        await writeFile(sourcePath, sourceBytes);
        const result = await createJobTarget(workspace, { file: sourcePath }, { now: fixedNow });
        const target = result.target;
        expect(target.type).toBe("job");
        if (target.type !== "job")
            throw new Error("Expected job target fixture.");
        expect(target.id).toBe("job-exampleco-engineering-manager");
        expect(target.title).toBe("Engineering Manager");
        expect(target.company).toBe("ExampleCo");
        expect(target.location).toBe("Berlin, Germany");
        expect(target.workingModel).toBe("hybrid");
        expect(target.rawDescription).toBe(sourceBytes.toString("utf8"));
        expect(target.source.path).toBe("jobs/exampleco-engineering-manager.md");
        expect(target.source.sha256).toBe(createHash("sha256").update(sourceBytes).digest("hex"));
        expect(result.persistedSourcePath).toBe(`targets/jobs/${target.id}/${JOB_DESCRIPTION_FILE_NAME}`);
        expect(await readFile(path.join(workspace, result.persistedSourcePath))).toEqual(sourceBytes);
    });
    it("uses explicit CLI metadata ahead of conflicting front matter", async () => {
        const workspace = await temporaryWorkspace();
        const sourcePath = await writeMarkdown(workspace, "conflict.md", [
            "---",
            "title: Front Matter Title",
            "company: Front Matter Co",
            "location: Paris",
            "workingModel: Remote",
            "---",
            "",
            "Description"
        ].join("\n"));
        const result = await createJobTarget(workspace, {
            file: sourcePath,
            title: "CLI Title",
            company: "CLI Company",
            location: "Berlin",
            workingModel: "Hybrid"
        }, { now: fixedNow });
        expect(result.target).toMatchObject({
            id: "job-cli-company-cli-title",
            title: "CLI Title",
            company: "CLI Company",
            location: "Berlin",
            workingModel: "hybrid"
        });
    });
    it("rejects missing, empty, invalid UTF-8, and title-less job files", async () => {
        const workspace = await temporaryWorkspace();
        await expect(createJobTarget(workspace, {
            file: path.join(workspace, "jobs/missing.md"),
            title: "Engineering Manager"
        })).rejects.toThrow("Job description file not found");
        const emptyPath = await writeMarkdown(workspace, "empty.md", "  \n\t");
        await expect(createJobTarget(workspace, { file: emptyPath, title: "Engineering Manager" }))
            .rejects.toThrow("Job description Markdown must not be empty.");
        const invalidPath = path.join(workspace, "jobs/invalid.md");
        await writeFile(invalidPath, Buffer.from([0xc3, 0x28]));
        await expect(createJobTarget(workspace, { file: invalidPath, title: "Engineering Manager" }))
            .rejects.toThrow("Job description file is not valid UTF-8 text");
        const noTitlePath = await writeMarkdown(workspace, "no-title.md", "We need an Engineering Manager.\n");
        await expect(createJobTarget(workspace, { file: noTitlePath }))
            .rejects.toThrow("Job target title is required and must not be blank.");
    });
    it("protects duplicate targets and replaces only when explicitly requested", async () => {
        const workspace = await temporaryWorkspace();
        const sourcePath = await writeMarkdown(workspace, "replace.md", [
            "---",
            "title: Engineering Manager",
            "company: ExampleCo",
            "---",
            "First description."
        ].join("\n"));
        const first = await createJobTarget(workspace, { file: sourcePath }, { now: fixedNow });
        await expect(createJobTarget(workspace, { file: sourcePath })).rejects.toThrow("Target already exists: job-exampleco-engineering-manager. Use --replace");
        await writeFile(sourcePath, [
            "---",
            "title: Engineering Manager",
            "company: ExampleCo",
            "---",
            "Replacement description."
        ].join("\n"), "utf8");
        const replaced = await createJobTarget(workspace, { file: sourcePath }, {
            replace: true,
            now: () => new Date("2026-07-20T12:00:00.000Z")
        });
        expect(replaced.target.createdAt).toBe(first.target.createdAt);
        expect(replaced.target.updatedAt).toBe("2026-07-20T12:00:00.000Z");
        expect(replaced.target.type === "job" && replaced.target.rawDescription).toContain("Replacement description.");
    });
    it("lists role and job targets and shows complete stable JSON", async () => {
        const workspace = await temporaryWorkspace();
        const role = await createRoleTarget(workspace, { title: "Engineering Manager" }, { now: fixedNow });
        const sourcePath = await writeMarkdown(workspace, "listing.md", [
            "---",
            "title: Platform Product Manager",
            "company: ExampleCo",
            "---",
            "Platform role."
        ].join("\n"));
        const job = await createJobTarget(workspace, { file: sourcePath }, { now: fixedNow });
        const targets = await listTargets(workspace);
        expect(targets.map((target) => target.id)).toEqual([
            "job-exampleco-platform-product-manager",
            "role-engineering-manager"
        ]);
        expect(formatTargetList(targets)).toContain("job-exampleco-platform-product-manager | job | Platform Product Manager | ExampleCo");
        expect(await showTarget(workspace, role.target.id)).toEqual(role.target);
        expect(await showTarget(workspace, job.target.id)).toEqual(job.target);
        expect(JSON.parse(formatTargetJson(job.target))).toEqual(job.target);
        await expect(showTarget(workspace, "missing-target")).rejects.toThrow("Target not found");
    });
});
async function temporaryWorkspace() {
    return mkdtemp(path.join(tmpdir(), "prooflayer-targets-"));
}
async function writeMarkdown(workspace, fileName, contents) {
    const filePath = path.join(workspace, "jobs", fileName);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents, "utf8");
    return filePath;
}
