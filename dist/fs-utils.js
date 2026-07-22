import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
export async function ensureDir(dir) {
    await mkdir(dir, { recursive: true });
}
export async function pathExists(target) {
    try {
        await stat(target);
        return true;
    }
    catch {
        return false;
    }
}
export async function readJson(filePath, fallback) {
    if (!(await pathExists(filePath)))
        return fallback;
    return JSON.parse(await readFile(filePath, "utf8"));
}
export async function writeJson(filePath, value) {
    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
export async function writeJsonAtomic(filePath, value) {
    await ensureDir(path.dirname(filePath));
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    try {
        await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
        await rename(temporaryPath, filePath);
    }
    finally {
        await rm(temporaryPath, { force: true });
    }
}
export async function writeBufferAtomic(filePath, value) {
    await ensureDir(path.dirname(filePath));
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    try {
        await writeFile(temporaryPath, value);
        await rename(temporaryPath, filePath);
    }
    finally {
        await rm(temporaryPath, { force: true });
    }
}
export async function writeText(filePath, value) {
    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, value, "utf8");
}
export async function hashFile(filePath) {
    const buffer = await readFile(filePath);
    return createHash("sha256").update(buffer).digest("hex");
}
export function hashBuffer(value) {
    return createHash("sha256").update(value).digest("hex");
}
export function hashText(value) {
    return createHash("sha256").update(value).digest("hex");
}
export async function walkFiles(dir) {
    if (!(await pathExists(dir)))
        return [];
    const entries = await readdir(dir, { withFileTypes: true });
    const results = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory())
            return walkFiles(fullPath);
        if (entry.isFile())
            return [fullPath];
        return [];
    }));
    return results.flat().sort((a, b) => a.localeCompare(b));
}
export function toPosixRelative(base, target) {
    return path.relative(base, target).split(path.sep).join("/");
}
export function stableId(prefix, parts) {
    return `${prefix}_${hashText(parts.join("|")).slice(0, 12)}`;
}
export function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
