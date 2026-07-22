import { constants as fsConstants } from "node:fs";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { hashBuffer, hashFile, hashText, readJson, walkFiles, writeJsonAtomic, } from "./fs-utils.js";
import { RoleProfileSchema, TargetInterpretationManifestSchema, TargetInterpretationSchema, } from "./schemas.js";
import { getTargetAnalysisStatus, showTargetAnalysis, } from "./target-analysis.js";
import { showTarget } from "./targets.js";
export const TARGET_INTERPRETER_NAME = "target-semantics";
export const TARGET_INTERPRETER_VERSION = "1";
export const TARGET_INTERPRETATION_POLICY_VERSION = "1";
export const ROLE_PROFILES_DIRECTORY = "role-profiles";
const INTERPRETATION_FILE = "target-interpretation.json";
const MANIFEST_FILE = "interpretation-manifest.json";
function normalizeRelative(relativePath) {
    return relativePath.split(path.sep).join("/");
}
function isWithin(base, candidate) {
    const relation = path.relative(path.resolve(base), path.resolve(candidate));
    return relation !== ".." && !relation.startsWith(`..${path.sep}`) && !path.isAbsolute(relation);
}
function resolveWithinWorkspace(workspace, relativePath) {
    const resolved = path.resolve(workspace, relativePath);
    if (!isWithin(workspace, resolved)) {
        throw new Error(`Interpretation path escapes the workspace: ${relativePath}`);
    }
    return resolved;
}
function interpretationPaths(workspace, target) {
    const collection = target.type === "role" ? "roles" : "jobs";
    const root = normalizeRelative(path.join("targets", collection, target.id));
    const targetRelativePath = `${root}/target.json`;
    const structuralAnalysisRelativePath = `${root}/analysis/target-analysis.json`;
    const structuralManifestRelativePath = `${root}/analysis/analysis-manifest.json`;
    const interpretationRelativePath = `${root}/interpretation/${INTERPRETATION_FILE}`;
    const manifestRelativePath = `${root}/interpretation/${MANIFEST_FILE}`;
    return {
        targetRelativePath,
        targetPath: resolveWithinWorkspace(workspace, targetRelativePath),
        structuralAnalysisRelativePath,
        structuralAnalysisPath: resolveWithinWorkspace(workspace, structuralAnalysisRelativePath),
        structuralManifestRelativePath,
        structuralManifestPath: resolveWithinWorkspace(workspace, structuralManifestRelativePath),
        interpretationRelativePath,
        interpretationPath: resolveWithinWorkspace(workspace, interpretationRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithinWorkspace(workspace, manifestRelativePath),
    };
}
async function exists(filePath) {
    try {
        await access(filePath, fsConstants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
function decodeUtf8(bytes, label) {
    let text;
    try {
        text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
    }
    catch {
        throw new Error(`${label} is not valid UTF-8 JSON`);
    }
    if (!Buffer.from(text, "utf8").equals(bytes)) {
        throw new Error(`${label} cannot be preserved as exact UTF-8 bytes`);
    }
    return text;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
function stableId(prefix, parts) {
    return `${prefix}_${hashText(parts.map((part) => part ?? "").join("\u0000")).slice(0, 12)}`;
}
function normalizedTitle(value) {
    return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}
function roleProfileMatches(target, profile) {
    if (target.type !== "role")
        return false;
    const expected = normalizedTitle(target.title);
    return [profile.title, ...profile.aliases].some((candidate) => normalizedTitle(candidate) === expected);
}
function resolveProfileInputPath(workspace, inputPath) {
    const direct = path.resolve(inputPath);
    const candidate = isWithin(workspace, direct) ? direct : path.resolve(workspace, inputPath);
    const profileRoot = path.resolve(workspace, ROLE_PROFILES_DIRECTORY);
    if (!isWithin(profileRoot, candidate)) {
        throw new Error(`Role profile must be stored under ${ROLE_PROFILES_DIRECTORY}/`);
    }
    return candidate;
}
export async function loadRoleProfile(workspace, inputPath, target) {
    const absolutePath = resolveProfileInputPath(workspace, inputPath);
    if (path.extname(absolutePath).toLowerCase() !== ".json") {
        throw new Error("Role profile must be a JSON file.");
    }
    if (!(await exists(absolutePath)))
        throw new Error(`Role profile not found: ${inputPath}`);
    const bytes = await readFile(absolutePath);
    const text = decodeUtf8(bytes, "Role profile");
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch (error) {
        throw new Error(`Invalid role profile JSON: ${errorMessage(error)}`);
    }
    const profile = RoleProfileSchema.parse(parsed);
    if (target && !roleProfileMatches(target, profile)) {
        throw new Error(`Role profile title and aliases do not exactly match target title: ${target.title}`);
    }
    return {
        profile,
        relativePath: normalizeRelative(path.relative(workspace, absolutePath)),
        absolutePath,
        sha256: hashBuffer(bytes),
        bytes,
    };
}
async function findExactRoleProfile(workspace, target) {
    if (target.type !== "role")
        return undefined;
    const root = path.join(workspace, ROLE_PROFILES_DIRECTORY);
    const candidates = (await walkFiles(root)).filter((file) => path.extname(file).toLowerCase() === ".json");
    const matches = [];
    for (const candidate of candidates) {
        const loaded = await loadRoleProfile(workspace, candidate);
        if (roleProfileMatches(target, loaded.profile))
            matches.push(loaded);
    }
    if (matches.length > 1) {
        throw new Error(`Multiple role profiles exactly match target title: ${target.title}`);
    }
    return matches[0];
}
async function readManifestHint(paths) {
    if (!(await exists(paths.manifestPath)))
        return undefined;
    try {
        return TargetInterpretationManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch {
        return undefined;
    }
}
async function resolveRoleProfile(workspace, target, explicitPath, storedPath) {
    if (target.type !== "role")
        return {};
    const selectedPath = explicitPath ?? storedPath;
    if (selectedPath) {
        try {
            return {
                profile: await loadRoleProfile(workspace, selectedPath, target),
                expectedPath: normalizeRelative(path.relative(workspace, resolveProfileInputPath(workspace, selectedPath))),
            };
        }
        catch (error) {
            let expectedPath;
            try {
                expectedPath = normalizeRelative(path.relative(workspace, resolveProfileInputPath(workspace, selectedPath)));
            }
            catch {
                expectedPath = selectedPath;
            }
            return { expectedPath, error: errorMessage(error) };
        }
    }
    try {
        const profile = await findExactRoleProfile(workspace, target);
        return profile ? { profile, expectedPath: profile.relativePath } : {};
    }
    catch (error) {
        return { error: errorMessage(error) };
    }
}
async function currentDependencies(workspace, targetId, roleProfilePath) {
    const target = await showTarget(workspace, targetId);
    const paths = interpretationPaths(workspace, target);
    const targetSha256 = await hashFile(paths.targetPath);
    const structuralAnalysisStatus = await getTargetAnalysisStatus(workspace, targetId);
    const manifestHint = await readManifestHint(paths);
    const resolvedProfile = await resolveRoleProfile(workspace, target, roleProfilePath, roleProfilePath ? undefined : manifestHint?.roleProfilePath);
    let structuralAnalysisSha256;
    let structuralAnalysis;
    if (await exists(paths.structuralAnalysisPath)) {
        structuralAnalysisSha256 = await hashFile(paths.structuralAnalysisPath);
        if (structuralAnalysisStatus.status === "current") {
            structuralAnalysis = await showTargetAnalysis(workspace, targetId);
        }
    }
    return {
        target,
        paths,
        targetSha256,
        structuralAnalysisStatus,
        structuralAnalysisSha256,
        structuralAnalysis,
        roleProfile: resolvedProfile.profile,
        roleProfileExpectedPath: resolvedProfile.expectedPath,
        roleProfileError: resolvedProfile.error,
    };
}
function interpretationMetadata(options) {
    return {
        name: options.interpreterName ?? TARGET_INTERPRETER_NAME,
        version: options.interpreterVersion ?? TARGET_INTERPRETER_VERSION,
        mode: "deterministic",
        policyVersion: options.policyVersion ?? TARGET_INTERPRETATION_POLICY_VERSION,
    };
}
function roleProfileReference(profile, expectation, index) {
    return {
        sourceType: "role-profile-json",
        path: profile.relativePath,
        sha256: profile.sha256,
        jsonPointer: `/expectations/${index}`,
        excerptSha256: hashText(JSON.stringify(expectation)),
    };
}
function uniqueReferences(references) {
    const seen = new Set();
    return references.filter((reference) => {
        const key = JSON.stringify(reference);
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
function warning(targetId, policyVersion, code, context, message, itemIds = [], references = []) {
    return {
        id: stableId("warning", [targetId, policyVersion, code, context]),
        code,
        message,
        sourceAnalysisItemIds: itemIds,
        sourceReferences: uniqueReferences(references),
    };
}
function ambiguity(targetId, policyVersion, code, context, message, itemIds = [], references = [], candidates) {
    return {
        id: stableId("ambiguity", [targetId, policyVersion, code, context]),
        code,
        message,
        sourceAnalysisItemIds: itemIds,
        sourceReferences: uniqueReferences(references),
        ...(candidates ? { candidateInterpretations: candidates } : {}),
    };
}
function roleInterpretation(input, metadata) {
    const expectations = [];
    const ambiguities = [];
    const warnings = [];
    if (input.roleProfile) {
        const indexed = input.roleProfile.profile.expectations.map((expectation, index) => ({ expectation, index }));
        for (const { expectation, index } of indexed.sort((a, b) => a.expectation.id.localeCompare(b.expectation.id))) {
            const reference = roleProfileReference(input.roleProfile, expectation, index);
            expectations.push({
                id: stableId("expectation", [
                    input.target.id,
                    input.roleProfile.profile.id,
                    expectation.id,
                    metadata.policyVersion,
                ]),
                kind: expectation.kind,
                statement: expectation.statement,
                necessity: expectation.necessity,
                importance: expectation.importance,
                explicitness: "explicit",
                capabilityTags: expectation.capabilityTags,
                sourceAnalysisItemIds: [],
                sourceReferences: [reference],
                interpretation: {
                    method: "explicit-role-profile",
                    interpreterName: metadata.name,
                    interpreterVersion: metadata.version,
                    policyVersion: metadata.policyVersion,
                },
                interpretationConfidence: "high",
                notes: expectation.notes,
            });
        }
    }
    else {
        ambiguities.push(ambiguity(input.target.id, metadata.policyVersion, "ROLE_PROFILE_MISSING", "role-profile", "No curated role profile is configured, so no role expectations were inferred from the title."));
        warnings.push(warning(input.target.id, metadata.policyVersion, "ROLE_PROFILE_NOT_CONFIGURED", "role-profile", "Role interpretation contains no expectations because no exact-match role profile was supplied or found."));
    }
    const groups = [];
    if (input.roleProfile) {
        const byGroup = new Map();
        for (const expectation of expectations) {
            const source = input.roleProfile.profile.expectations.find((entry) => expectation.id === stableId("expectation", [
                input.target.id,
                input.roleProfile?.profile.id,
                entry.id,
                metadata.policyVersion,
            ]));
            if (!source)
                continue;
            const entries = byGroup.get(source.group) ?? [];
            entries.push(expectation);
            byGroup.set(source.group, entries);
        }
        for (const [kind, entries] of [...byGroup.entries()].sort(([a], [b]) => a.localeCompare(b))) {
            groups.push({
                id: stableId("group", [
                    input.target.id,
                    input.roleProfile.profile.id,
                    kind,
                    metadata.policyVersion,
                ]),
                kind,
                title: kind.split("-").map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`).join(" "),
                expectationIds: entries.map((entry) => entry.id),
                sourceReferences: uniqueReferences(entries.flatMap((entry) => entry.sourceReferences)),
            });
        }
    }
    if (expectations.length === 0) {
        warnings.push(warning(input.target.id, metadata.policyVersion, "NO_EXPECTATIONS_PRODUCED", "expectations", "No semantic expectations were produced for this target."));
    }
    return TargetInterpretationSchema.parse({
        schemaVersion: 1,
        targetId: input.target.id,
        targetType: "role",
        interpreter: metadata,
        input: {
            targetPath: input.targetPath,
            targetSha256: input.targetSha256,
            structuralAnalysisPath: input.structuralAnalysisPath,
            structuralAnalysisSha256: input.structuralAnalysisSha256,
            ...(input.roleProfile
                ? {
                    roleProfilePath: input.roleProfile.relativePath,
                    roleProfileSha256: input.roleProfile.sha256,
                    roleProfileId: input.roleProfile.profile.id,
                }
                : {}),
        },
        expectations,
        groups,
        ambiguities: ambiguities.sort((a, b) => a.id.localeCompare(b.id)),
        warnings: warnings.sort((a, b) => a.id.localeCompare(b.id)),
        completeness: deterministicCompleteness("role", expectations, input.structuralAnalysis),
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
    });
}
function jobGroupKind(classification) {
    if (classification === "responsibilities")
        return "core-responsibilities";
    if (classification === "required")
        return "required-qualifications";
    if (classification === "preferred")
        return "preferred-qualifications";
    if (classification === "qualifications")
        return "context-dependent";
    return undefined;
}
function jobExpectationKind(classification) {
    if (classification === "responsibilities")
        return "responsibility";
    if (["required", "preferred", "qualifications"].includes(classification))
        return "qualification";
    return undefined;
}
function jobInterpretation(input, metadata) {
    const analysis = input.structuralAnalysis;
    if (analysis.targetType !== "job")
        throw new Error("Job interpretation requires job structural analysis.");
    const sections = new Map(analysis.sections.map((section) => [section.id, section]));
    const expectations = [];
    const ambiguities = [];
    const warnings = [];
    const expectationBySection = new Map();
    const unknownWarnings = new Set();
    for (const item of analysis.items) {
        if (item.kind === "front-matter-field")
            continue;
        const section = item.sectionId ? sections.get(item.sectionId) : undefined;
        if (!section) {
            warnings.push(warning(input.target.id, metadata.policyVersion, "UNCLASSIFIED_ITEM_SKIPPED", item.id, "An item without an explicit section was not interpreted as a candidate expectation.", [item.id], item.sourceReferences));
            continue;
        }
        if (item.kind === "paragraph") {
            warnings.push(warning(input.target.id, metadata.policyVersion, "PARAGRAPH_NOT_INTERPRETED", item.id, "A paragraph was preserved structurally but not interpreted as a candidate expectation.", [item.id], item.sourceReferences));
            continue;
        }
        const kind = jobExpectationKind(section.classification);
        const groupKind = jobGroupKind(section.classification);
        if (!kind || !groupKind) {
            if (section.classification === "unknown") {
                if (!unknownWarnings.has(section.id)) {
                    unknownWarnings.add(section.id);
                    const sectionItems = analysis.items.filter((entry) => entry.sectionId === section.id);
                    warnings.push(warning(input.target.id, metadata.policyVersion, "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS", section.id, `Unknown section "${section.heading ?? "untitled"}" was not semantically interpreted.`, sectionItems.map((entry) => entry.id), [section.sourceReference]));
                }
                ambiguities.push(ambiguity(input.target.id, metadata.policyVersion, "INSUFFICIENT_EXPLICIT_STRUCTURE", item.id, "The source section does not explicitly identify how this item should be interpreted.", [item.id], item.sourceReferences));
            }
            else {
                warnings.push(warning(input.target.id, metadata.policyVersion, "UNCLASSIFIED_ITEM_SKIPPED", item.id, `Items in ${section.classification} sections are not candidate expectations in this policy.`, [item.id], item.sourceReferences));
            }
            continue;
        }
        const expectation = {
            id: stableId("expectation", [
                input.target.id,
                item.id,
                kind,
                metadata.policyVersion,
            ]),
            kind,
            statement: item.statement,
            necessity: section.classification === "required"
                ? "required"
                : section.classification === "preferred"
                    ? "preferred"
                    : section.classification === "responsibilities"
                        ? "contextual"
                        : "unknown",
            importance: "unknown",
            explicitness: "explicit",
            capabilityTags: [],
            sourceAnalysisItemIds: [item.id],
            sourceReferences: item.sourceReferences,
            interpretation: {
                method: "explicit-heading",
                interpreterName: metadata.name,
                interpreterVersion: metadata.version,
                policyVersion: metadata.policyVersion,
            },
            interpretationConfidence: "high",
            notes: [],
        };
        expectations.push(expectation);
        const entries = expectationBySection.get(section.id) ?? [];
        entries.push(expectation);
        expectationBySection.set(section.id, entries);
    }
    const groups = [];
    for (const section of analysis.sections) {
        const entries = expectationBySection.get(section.id);
        const kind = jobGroupKind(section.classification);
        if (!entries?.length || !kind)
            continue;
        groups.push({
            id: stableId("group", [input.target.id, section.id, kind, metadata.policyVersion]),
            kind,
            title: section.heading ?? kind,
            expectationIds: entries.map((entry) => entry.id),
            sourceReferences: uniqueReferences(entries.flatMap((entry) => entry.sourceReferences)),
        });
    }
    if (expectations.length === 0) {
        warnings.push(warning(input.target.id, metadata.policyVersion, "NO_EXPECTATIONS_PRODUCED", "expectations", "No semantic expectations were produced from explicit supported job-description structure."));
    }
    return TargetInterpretationSchema.parse({
        schemaVersion: 1,
        targetId: input.target.id,
        targetType: "job",
        interpreter: metadata,
        input: {
            targetPath: input.targetPath,
            targetSha256: input.targetSha256,
            structuralAnalysisPath: input.structuralAnalysisPath,
            structuralAnalysisSha256: input.structuralAnalysisSha256,
        },
        expectations,
        groups,
        ambiguities: ambiguities.sort((a, b) => a.id.localeCompare(b.id)),
        warnings: warnings.sort((a, b) => a.id.localeCompare(b.id)),
        completeness: deterministicCompleteness("job", expectations, analysis),
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
    });
}
function deterministicCompleteness(targetType, expectations, analysis) {
    if (expectations.length === 0) {
        return {
            status: "empty",
            usableForEvidenceMatching: false,
            blockingReasons: [
                targetType === "role"
                    ? "No reviewed Role Profile supplied deterministic expectations."
                    : "No explicit supported job-description items produced expectations.",
            ],
        };
    }
    if (targetType === "role") {
        return { status: "complete", usableForEvidenceMatching: true, blockingReasons: [] };
    }
    const covered = new Set(expectations.flatMap((expectation) => expectation.sourceAnalysisItemIds));
    const relevant = analysis.items.filter((item) => item.kind !== "front-matter-field");
    const uncovered = relevant.filter((item) => !covered.has(item.id));
    return uncovered.length === 0
        ? { status: "complete", usableForEvidenceMatching: true, blockingReasons: [] }
        : {
            status: "partial",
            usableForEvidenceMatching: true,
            blockingReasons: [
                `${uncovered.length} structurally preserved item(s) remain uninterpreted by deterministic policy.`,
            ],
        };
}
export class DeterministicSemanticTargetInterpreter {
    name;
    version;
    mode = "deterministic";
    policyVersion;
    constructor(options = {}) {
        const metadata = interpretationMetadata(options);
        this.name = metadata.name;
        this.version = metadata.version;
        this.policyVersion = metadata.policyVersion;
    }
    async interpret(input) {
        const metadata = {
            name: this.name,
            version: this.version,
            mode: this.mode,
            policyVersion: this.policyVersion,
        };
        return input.target.type === "role"
            ? roleInterpretation(input, metadata)
            : jobInterpretation(input, metadata);
    }
}
async function validateJobSourceReferences(workspace, target, analysis) {
    if (target.type !== "job" || analysis.targetType !== "job")
        return;
    const sourcePath = resolveWithinWorkspace(workspace, analysis.input.sourcePath);
    const sourceBytes = await readFile(sourcePath);
    const sourceHash = hashBuffer(sourceBytes);
    if (sourceHash !== analysis.input.sourceSha256 || sourceHash !== target.source.sha256) {
        throw new Error("Job source hash no longer matches structural analysis provenance.");
    }
    const references = [
        ...analysis.sections.map((section) => section.sourceReference),
        ...analysis.items.flatMap((item) => item.sourceReferences),
    ];
    for (const reference of references) {
        if (reference.sourceType !== "job-description-markdown") {
            throw new Error("Job structural analysis contains an unsupported source-reference type.");
        }
        if (reference.path !== analysis.input.sourcePath ||
            reference.sha256 !== sourceHash ||
            reference.startOffset === undefined ||
            reference.endOffset === undefined ||
            reference.endOffset > sourceBytes.length ||
            reference.startOffset > reference.endOffset) {
            throw new Error("Job structural analysis contains invalid source-reference provenance.");
        }
        const excerpt = sourceBytes.subarray(reference.startOffset, reference.endOffset);
        if (hashBuffer(excerpt) !== reference.excerptSha256) {
            throw new Error("Job structural analysis excerpt hash no longer matches source bytes.");
        }
    }
}
async function storedInterpretationStatus(dependencies, metadata) {
    const { target, paths } = dependencies;
    const interpretationExists = await exists(paths.interpretationPath);
    const manifestExists = await exists(paths.manifestPath);
    const base = {
        targetId: target.id,
        targetType: target.type,
        interpretationExists,
        manifestExists,
        interpretationPath: paths.interpretationRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!interpretationExists && !manifestExists) {
        return {
            ...base,
            targetHashMatches: null,
            structuralAnalysisHashMatches: null,
            roleProfileHashMatches: null,
            interpreterNameMatches: null,
            interpreterVersionMatches: null,
            policyVersionMatches: null,
            interpretationHashMatches: null,
            status: "missing",
            reasons: ["No stored target interpretation or interpretation manifest exists."],
        };
    }
    if (!interpretationExists || !manifestExists) {
        return {
            ...base,
            targetHashMatches: null,
            structuralAnalysisHashMatches: null,
            roleProfileHashMatches: null,
            interpreterNameMatches: null,
            interpreterVersionMatches: null,
            policyVersionMatches: null,
            interpretationHashMatches: null,
            status: "invalid",
            reasons: ["The stored target interpretation and manifest are incomplete."],
        };
    }
    let interpretation;
    let manifest;
    try {
        interpretation = TargetInterpretationSchema.parse(await readJson(paths.interpretationPath, null));
        manifest = TargetInterpretationManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return {
            ...base,
            targetHashMatches: null,
            structuralAnalysisHashMatches: null,
            roleProfileHashMatches: null,
            interpreterNameMatches: null,
            interpreterVersionMatches: null,
            policyVersionMatches: null,
            interpretationHashMatches: null,
            status: "invalid",
            reasons: [`Stored interpretation data is invalid: ${errorMessage(error)}`],
        };
    }
    const interpretationHashMatches = (await hashFile(paths.interpretationPath)) === manifest.interpretationSha256;
    const targetHashMatches = dependencies.targetSha256 === manifest.targetSha256;
    const structuralAnalysisHashMatches = dependencies.structuralAnalysisStatus.status === "current" &&
        dependencies.structuralAnalysisSha256 === manifest.structuralAnalysisSha256;
    const interpreterNameMatches = metadata.name === manifest.interpreterName && metadata.name === interpretation.interpreter.name;
    const interpreterVersionMatches = metadata.version === manifest.interpreterVersion &&
        metadata.version === interpretation.interpreter.version;
    const policyVersionMatches = metadata.policyVersion === manifest.policyVersion &&
        metadata.policyVersion === interpretation.interpreter.policyVersion;
    let roleProfileHashMatches = null;
    if (target.type === "role") {
        const storedHasProfile = Boolean(manifest.roleProfilePath);
        if (storedHasProfile || dependencies.roleProfile || dependencies.roleProfileExpectedPath) {
            roleProfileHashMatches = Boolean(dependencies.roleProfile &&
                dependencies.roleProfile.relativePath === manifest.roleProfilePath &&
                dependencies.roleProfile.sha256 === manifest.roleProfileSha256 &&
                dependencies.roleProfile.profile.id === manifest.roleProfileId);
        }
    }
    const invalidReasons = [];
    if (interpretation.targetId !== target.id || manifest.targetId !== target.id) {
        invalidReasons.push("Stored interpretation target ID does not match the requested target.");
    }
    if (interpretation.targetType !== target.type || manifest.targetType !== target.type) {
        invalidReasons.push("Stored interpretation target type does not match the target.");
    }
    if (manifest.interpretationPath !== paths.interpretationRelativePath) {
        invalidReasons.push("Manifest interpretation path does not match the expected workspace path.");
    }
    if (interpretation.input.targetPath !== paths.targetRelativePath ||
        interpretation.input.structuralAnalysisPath !== paths.structuralAnalysisRelativePath) {
        invalidReasons.push("Stored interpretation dependency paths do not match expected workspace paths.");
    }
    if (interpretation.input.targetSha256 !== manifest.targetSha256 ||
        interpretation.input.structuralAnalysisSha256 !== manifest.structuralAnalysisSha256) {
        invalidReasons.push("Stored interpretation and manifest disagree on dependency hashes.");
    }
    if (interpretation.interpreter.name !== manifest.interpreterName ||
        interpretation.interpreter.version !== manifest.interpreterVersion ||
        interpretation.interpreter.mode !== manifest.interpreterMode ||
        interpretation.interpreter.policyVersion !== manifest.policyVersion) {
        invalidReasons.push("Stored interpretation and manifest disagree on interpreter metadata.");
    }
    if (target.type === "role" && interpretation.targetType === "role") {
        if (interpretation.input.roleProfilePath !== manifest.roleProfilePath ||
            interpretation.input.roleProfileSha256 !== manifest.roleProfileSha256 ||
            interpretation.input.roleProfileId !== manifest.roleProfileId) {
            invalidReasons.push("Stored interpretation and manifest disagree on role-profile metadata.");
        }
    }
    if (!interpretationHashMatches) {
        invalidReasons.push("Stored interpretation SHA-256 does not match the manifest.");
    }
    if (invalidReasons.length > 0) {
        return {
            ...base,
            targetHashMatches,
            structuralAnalysisHashMatches,
            roleProfileHashMatches,
            interpreterNameMatches,
            interpreterVersionMatches,
            policyVersionMatches,
            interpretationHashMatches,
            status: "invalid",
            reasons: invalidReasons,
        };
    }
    const staleReasons = [];
    if (!targetHashMatches)
        staleReasons.push("Target input hash changed after interpretation.");
    if (!structuralAnalysisHashMatches) {
        staleReasons.push("Structural target analysis is missing, stale, invalid, or changed.");
    }
    if (roleProfileHashMatches === false) {
        staleReasons.push(dependencies.roleProfileError ?? "Role-profile path, identity, or hash changed.");
    }
    if (!interpreterNameMatches)
        staleReasons.push("Interpreter name changed.");
    if (!interpreterVersionMatches)
        staleReasons.push("Interpreter version changed.");
    if (!policyVersionMatches)
        staleReasons.push("Interpretation policy version changed.");
    return {
        ...base,
        targetHashMatches,
        structuralAnalysisHashMatches,
        roleProfileHashMatches,
        interpreterNameMatches,
        interpreterVersionMatches,
        policyVersionMatches,
        interpretationHashMatches,
        status: staleReasons.length > 0 ? "stale" : "current",
        reasons: staleReasons,
    };
}
export async function getTargetInterpretationStatus(workspace, targetId, options = {}) {
    const dependencies = await currentDependencies(workspace, targetId, options.roleProfile);
    return storedInterpretationStatus(dependencies, interpretationMetadata(options));
}
export async function interpretTarget(workspace, targetId, options = {}) {
    const dependencies = await currentDependencies(workspace, targetId, options.roleProfile);
    const metadata = interpretationMetadata(options);
    if (dependencies.structuralAnalysisStatus.status !== "current" || !dependencies.structuralAnalysis) {
        throw new Error(`Structural target analysis must be current before interpretation. Current status: ${dependencies.structuralAnalysisStatus.status}`);
    }
    if (!dependencies.structuralAnalysisSha256) {
        throw new Error("Structural target analysis hash is unavailable.");
    }
    if (dependencies.roleProfileError) {
        throw new Error(dependencies.roleProfileError);
    }
    await validateJobSourceReferences(workspace, dependencies.target, dependencies.structuralAnalysis);
    const status = await storedInterpretationStatus(dependencies, metadata);
    if (status.status === "current" && !options.rebuild) {
        const current = TargetInterpretationSchema.parse(await readJson(dependencies.paths.interpretationPath, null));
        return resultFromInterpretation(current, dependencies.paths, "already-current", dependencies.roleProfile);
    }
    if (["stale", "invalid"].includes(status.status) && !options.rebuild) {
        throw new Error(`Stored interpretation is ${status.status} and was not overwritten. Re-run with --rebuild after review. ${status.reasons.join(" ")}`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (status.interpretationExists) {
        try {
            const stored = TargetInterpretationSchema.parse(await readJson(dependencies.paths.interpretationPath, null));
            if (stored.targetId === dependencies.target.id && stored.targetType === dependencies.target.type) {
                createdAt = stored.createdAt;
            }
        }
        catch {
            // Explicit rebuild starts a new history only when no valid identity can be recovered.
        }
    }
    const interpreter = new DeterministicSemanticTargetInterpreter(options);
    const interpretation = await interpreter.interpret({
        target: dependencies.target,
        targetPath: dependencies.paths.targetRelativePath,
        targetSha256: dependencies.targetSha256,
        structuralAnalysis: dependencies.structuralAnalysis,
        structuralAnalysisPath: dependencies.paths.structuralAnalysisRelativePath,
        structuralAnalysisSha256: dependencies.structuralAnalysisSha256,
        roleProfile: dependencies.roleProfile,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(dependencies.paths.interpretationPath, interpretation);
    const interpretationSha256 = await hashFile(dependencies.paths.interpretationPath);
    const manifest = TargetInterpretationManifestSchema.parse({
        schemaVersion: 1,
        targetId: dependencies.target.id,
        targetType: dependencies.target.type,
        interpretationPath: dependencies.paths.interpretationRelativePath,
        interpretationSha256,
        interpreterName: interpreter.name,
        interpreterVersion: interpreter.version,
        interpreterMode: interpreter.mode,
        policyVersion: interpreter.policyVersion,
        targetSha256: dependencies.targetSha256,
        structuralAnalysisSha256: dependencies.structuralAnalysisSha256,
        ...(dependencies.roleProfile
            ? {
                roleProfilePath: dependencies.roleProfile.relativePath,
                roleProfileSha256: dependencies.roleProfile.sha256,
                roleProfileId: dependencies.roleProfile.profile.id,
            }
            : {}),
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(dependencies.paths.manifestPath, manifest);
    return resultFromInterpretation(interpretation, dependencies.paths, status.status === "missing" ? "created" : "rebuilt", dependencies.roleProfile);
}
function resultFromInterpretation(interpretation, paths, result, roleProfile) {
    return {
        targetId: interpretation.targetId,
        targetType: interpretation.targetType,
        result,
        interpreterName: interpretation.interpreter.name,
        interpreterVersion: interpretation.interpreter.version,
        policyVersion: interpretation.interpreter.policyVersion,
        interpretationPath: paths.interpretationRelativePath,
        manifestPath: paths.manifestRelativePath,
        expectationCount: interpretation.expectations.length,
        groupCount: interpretation.groups.length,
        ambiguityCount: interpretation.ambiguities.length,
        warningCount: interpretation.warnings.length,
        ...(roleProfile
            ? { roleProfilePath: roleProfile.relativePath, roleProfileSha256: roleProfile.sha256 }
            : {}),
    };
}
export async function showTargetInterpretation(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const paths = interpretationPaths(workspace, target);
    if (!(await exists(paths.interpretationPath))) {
        throw new Error(`Interpretation not found for target: ${targetId}`);
    }
    return TargetInterpretationSchema.parse(await readJson(paths.interpretationPath, null));
}
export function formatInterpretTargetResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Target type: ${result.targetType}`,
        `Interpretation status: ${result.result}`,
        `Interpreter: ${result.interpreterName} v${result.interpreterVersion} (deterministic)`,
        `Policy version: ${result.policyVersion}`,
        `Interpretation path: ${result.interpretationPath}`,
        `Manifest path: ${result.manifestPath}`,
        `Expectations: ${result.expectationCount}`,
        `Groups: ${result.groupCount}`,
        `Ambiguities: ${result.ambiguityCount}`,
        `Warnings: ${result.warningCount}`,
        ...(result.roleProfilePath ? [`Role profile: ${result.roleProfilePath}`] : []),
        ...(result.roleProfileSha256 ? [`Role profile SHA-256: ${result.roleProfileSha256}`] : []),
    ].join("\n");
}
export function formatTargetInterpretationStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Target ID: ${status.targetId}`,
        `Target type: ${status.targetType}`,
        `Overall status: ${status.status}`,
        `Interpretation exists: ${status.interpretationExists ? "yes" : "no"}`,
        `Manifest exists: ${status.manifestExists ? "yes" : "no"}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Structural analysis hash matches: ${check(status.structuralAnalysisHashMatches)}`,
        `Role profile hash matches: ${check(status.roleProfileHashMatches)}`,
        `Interpreter name matches: ${check(status.interpreterNameMatches)}`,
        `Interpreter version matches: ${check(status.interpreterVersionMatches)}`,
        `Policy version matches: ${check(status.policyVersionMatches)}`,
        `Interpretation hash matches: ${check(status.interpretationHashMatches)}`,
        `Interpretation path: ${status.interpretationPath}`,
        `Manifest path: ${status.manifestPath}`,
        ...(status.reasons.length ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)] : []),
    ].join("\n");
}
export async function interpretationFileTimestamps(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    const paths = interpretationPaths(workspace, target);
    const [interpretationStat, manifestStat] = await Promise.all([
        stat(paths.interpretationPath),
        stat(paths.manifestPath),
    ]);
    return {
        interpretationMtimeMs: interpretationStat.mtimeMs,
        manifestMtimeMs: manifestStat.mtimeMs,
    };
}
