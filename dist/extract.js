import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
export const SUPPORTED_EXTENSIONS = new Set([".md", ".txt", ".pdf", ".docx", ".json", ".csv"]);
export async function extractText(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    try {
        if (ext === ".md") {
            const raw = await readFile(filePath, "utf8");
            const parsed = matter(raw);
            const frontmatter = Object.keys(parsed.data).length > 0
                ? `Frontmatter:\n${JSON.stringify(parsed.data, null, 2)}\n\n`
                : "";
            return { text: `${frontmatter}${parsed.content}`.trim(), supported: true };
        }
        if (ext === ".txt" || ext === ".csv") {
            return { text: await readFile(filePath, "utf8"), supported: true };
        }
        if (ext === ".json") {
            const raw = await readFile(filePath, "utf8");
            try {
                return { text: JSON.stringify(JSON.parse(raw), null, 2), supported: true };
            }
            catch {
                return { text: raw, supported: true };
            }
        }
        if (ext === ".docx") {
            const result = await mammoth.extractRawText({ path: filePath });
            return { text: result.value.trim(), supported: true };
        }
        if (ext === ".pdf") {
            const buffer = await readFile(filePath);
            const result = await pdfParse(buffer);
            return { text: result.text.trim(), supported: true };
        }
        return {
            text: `Unsupported file type: ${ext || "unknown"}. No text extracted.`,
            supported: false
        };
    }
    catch (error) {
        return {
            text: `Text extraction failed for ${path.basename(filePath)}.`,
            supported: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
