import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { TextDecoder } from "node:util";
import matter from "gray-matter";
import { hashText, pathExists, readJson, toPosixRelative, walkFiles, writeBufferAtomic, writeJsonAtomic } from "./fs-utils.js";
import { JobTargetSchema, RoleTargetSchema, TargetSchema } from "./schemas.js";
export const ROLE_TARGETS_DIRECTORY = "targets/roles";
export const JOB_TARGETS_DIRECTORY = "targets/jobs";
export const TARGET_FILE_NAME = "target.json";
export const JOB_DESCRIPTION_FILE_NAME = "job-description.md";
export async function createRoleTarget(workspace, input, options = {}) {
    const title = normalizeRequiredDisplayText(input.title, "Role target title");
    const normalized = {
        title,
        seniority: normalizeOptionalLowerText(input.seniority),
        domain: normalizeOptionalLowerText(input.domain),
        location: normalizeOptionalDisplayText(input.location),
        workingModel: normalizeOptionalLowerText(input.workingModel)
    };
    const id = `role-${slugify(title)}`;
    const targetPath = targetJsonPath("role", id);
    const existing = await prepareTargetWrite(workspace, "role", id, targetPath, options.replace ?? false);
    const timestamp = (options.now ?? (() => new Date()))().toISOString();
    const target = RoleTargetSchema.parse({
        schemaVersion: 1,
        id,
        type: "role",
        ...normalized,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp
    });
    await writeJsonAtomic(path.join(workspace, targetPath), target);
    return { target, targetPath };
}
export async function createJobTarget(workspace, input, options = {}) {
    const imported = await readJobMarkdown(workspace, input.file);
    const frontMatter = parseJobFrontMatter(imported.rawDescription);
    const title = normalizeRequiredDisplayText(input.title !== undefined ? input.title : frontMatter.title, "Job target title");
    const company = normalizeOptionalDisplayText(input.company !== undefined ? input.company : frontMatter.company);
    const location = normalizeOptionalDisplayText(input.location !== undefined ? input.location : frontMatter.location);
    const workingModel = normalizeOptionalLowerText(input.workingModel !== undefined ? input.workingModel : frontMatter.workingModel);
    const id = `job-${company ? `${slugify(company)}-` : ""}${slugify(title)}`;
    const targetPath = targetJsonPath("job", id);
    const persistedSourcePath = `${JOB_TARGETS_DIRECTORY}/${id}/${JOB_DESCRIPTION_FILE_NAME}`;
    const existing = await prepareTargetWrite(workspace, "job", id, targetPath, options.replace ?? false);
    const timestamp = (options.now ?? (() => new Date()))().toISOString();
    const target = JobTargetSchema.parse({
        schemaVersion: 1,
        id,
        type: "job",
        title,
        company,
        location,
        workingModel,
        source: {
            type: "markdown",
            path: imported.sourcePath,
            sha256: imported.sha256
        },
        rawDescription: imported.rawDescription,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp
    });
    const persistedAbsolutePath = path.join(workspace, persistedSourcePath);
    await writeBufferAtomic(persistedAbsolutePath, imported.bytes);
    const persistedBytes = await readFile(persistedAbsolutePath);
    if (!persistedBytes.equals(imported.bytes)) {
        throw new Error("Persisted job description does not match the imported source bytes.");
    }
    await writeJsonAtomic(path.join(workspace, targetPath), target);
    return { target, targetPath, persistedSourcePath };
}
export async function listTargets(workspace) {
    const targetRoot = path.join(workspace, "targets");
    const files = (await walkFiles(targetRoot)).filter((file) => path.basename(file) === TARGET_FILE_NAME);
    const targets = await Promise.all(files.map(async (file) => {
        try {
            return TargetSchema.parse(await readJson(file, {}));
        }
        catch (error) {
            throw new Error(`Invalid stored target at ${toPosixRelative(workspace, file)}: ${errorMessage(error)}`);
        }
    }));
    return targets.sort((a, b) => a.type.localeCompare(b.type) || a.id.localeCompare(b.id));
}
export async function showTarget(workspace, targetId) {
    assertTargetId(targetId);
    const candidates = [
        path.join(workspace, targetJsonPath("role", targetId)),
        path.join(workspace, targetJsonPath("job", targetId))
    ];
    const existing = [];
    for (const candidate of candidates) {
        if (await pathExists(candidate))
            existing.push(candidate);
    }
    if (existing.length === 0)
        throw new Error(`Target not found: ${targetId}`);
    if (existing.length > 1)
        throw new Error(`Target ID is ambiguous: ${targetId}`);
    return TargetSchema.parse(await readJson(existing[0], {}));
}
export function formatTargetCreation(result) {
    const lines = [
        `Target ID: ${result.target.id}`,
        `Target type: ${result.target.type}`,
        `Title: ${result.target.title}`,
        `Persisted path: ${result.targetPath}`
    ];
    if (result.target.type === "job") {
        lines.push(`Source path: ${result.target.source.path}`);
        lines.push(`Source SHA-256: ${result.target.source.sha256}`);
        lines.push(`Persisted source: ${result.persistedSourcePath}`);
    }
    return lines.join("\n");
}
export function formatTargetList(targets) {
    if (targets.length === 0)
        return "Targets: none";
    return [
        "Targets:",
        ...targets.map((target) => [
            target.id,
            target.type,
            target.title,
            target.type === "job" ? target.company ?? "-" : "-",
            target.updatedAt
        ].join(" | "))
    ].join("\n");
}
export function formatTargetJson(target) {
    return `${JSON.stringify(target, null, 2)}\n`;
}
async function prepareTargetWrite(workspace, type, id, relativeTargetPath, replace) {
    const targetDirectory = path.dirname(path.join(workspace, relativeTargetPath));
    if (!(await pathExists(targetDirectory)))
        return null;
    if (!replace)
        throw new Error(`Target already exists: ${id}. Use --replace to replace it explicitly.`);
    const existingPath = path.join(workspace, relativeTargetPath);
    if (!(await pathExists(existingPath)))
        return null;
    const existing = TargetSchema.parse(await readJson(existingPath, {}));
    if (existing.type !== type)
        throw new Error(`Cannot replace ${id}: stored target type differs.`);
    return existing;
}
async function readJobMarkdown(workspace, inputPath) {
    const absolutePath = path.resolve(inputPath);
    if (![".md", ".markdown"].includes(path.extname(absolutePath).toLowerCase())) {
        throw new Error("Job target source must be a Markdown file with a .md or .markdown extension.");
    }
    if (!(await pathExists(absolutePath)))
        throw new Error(`Job description file not found: ${inputPath}`);
    let bytes;
    try {
        bytes = await readFile(absolutePath);
    }
    catch (error) {
        throw new Error(`Job description file is not readable: ${inputPath}: ${errorMessage(error)}`);
    }
    let rawDescription;
    try {
        rawDescription = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
    }
    catch {
        throw new Error(`Job description file is not valid UTF-8 text: ${inputPath}`);
    }
    if (rawDescription.trim().length === 0)
        throw new Error("Job description Markdown must not be empty.");
    if (!Buffer.from(rawDescription, "utf8").equals(bytes)) {
        throw new Error("Job description could not be preserved as exact UTF-8 bytes.");
    }
    const relative = path.relative(workspace, absolutePath);
    const sourcePath = relative && !relative.startsWith("..") && !path.isAbsolute(relative)
        ? relative.split(path.sep).join("/")
        : absolutePath;
    return {
        bytes,
        rawDescription,
        sourcePath,
        sha256: createHash("sha256").update(bytes).digest("hex")
    };
}
function parseJobFrontMatter(rawDescription) {
    let data;
    try {
        data = matter(rawDescription).data;
    }
    catch (error) {
        throw new Error(`Invalid Markdown front matter: ${errorMessage(error)}`);
    }
    const result = {};
    for (const field of ["title", "company", "location", "workingModel"]) {
        const value = data[field];
        if (value === undefined || value === null)
            continue;
        if (typeof value !== "string")
            throw new Error(`Front matter field "${field}" must be a string.`);
        result[field] = value;
    }
    return result;
}
function normalizeRequiredDisplayText(value, label) {
    const normalized = normalizeOptionalDisplayText(value);
    if (!normalized)
        throw new Error(`${label} is required and must not be blank.`);
    return normalized;
}
function normalizeOptionalDisplayText(value) {
    if (value === undefined)
        return undefined;
    const normalized = value.normalize("NFKC").replace(/\s+/g, " ").trim();
    return normalized || undefined;
}
function normalizeOptionalLowerText(value) {
    return normalizeOptionalDisplayText(value)?.toLowerCase();
}
function slugify(value) {
    const slug = value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
    return slug || `target-${hashText(value).slice(0, 12)}`;
}
function targetJsonPath(type, id) {
    const root = type === "role" ? ROLE_TARGETS_DIRECTORY : JOB_TARGETS_DIRECTORY;
    return `${root}/${id}/${TARGET_FILE_NAME}`;
}
function assertTargetId(value) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
        throw new Error(`Invalid target ID: ${value}`);
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
