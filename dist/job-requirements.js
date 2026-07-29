import { readFile } from "node:fs/promises";
import path from "node:path";
import { hashBuffer, hashFile, hashText, pathExists, readJson, uniqueSorted, writeJsonAtomic, } from "./fs-utils.js";
import { JobRequirementModelManifestSchema, JobRequirementModelSchema, } from "./job-requirement-schemas.js";
import { getTargetAnalysisStatus, showTargetAnalysis, } from "./target-analysis.js";
import { showTarget } from "./targets.js";
export const JOB_REQUIREMENT_POLICY_NAME = "job-requirement-modeling-policy";
export const JOB_REQUIREMENT_POLICY_VERSION = "2";
const MODEL_FILE = "job-requirement-model.json";
const MANIFEST_FILE = "job-requirement-model-manifest.json";
const TECHNOLOGIES = [
    "AWS",
    "Azure",
    "C#",
    "C++",
    "CI/CD",
    "Docker",
    "Expo",
    "Figma",
    "GCP",
    "Git",
    "GraphQL",
    "Java",
    "JavaScript",
    "Jira",
    "Kubernetes",
    "Linear",
    "Node.js",
    "Notion",
    "Python",
    "React",
    "React Native",
    "REST",
    "Ruby",
    "Salesforce",
    "SQL",
    "Supabase",
    "TensorFlow.js",
    "TypeScript",
    "Vue.js",
];
const TECHNOLOGY_PATTERNS = new Map([
    ...TECHNOLOGIES.map((technology) => [
        technology,
        new RegExp(`\\b${escapeRegex(technology).replace(/\\ /g, "\\s+")}\\b`, "i"),
    ]),
    ["API", /\bAPIs?\b/i],
    ["SaaS", /\bSaaS\b/i],
]);
const DOMAIN_PATTERNS = [
    /\btelecom(?:munications)?\b/i,
    /\bedtech\b/i,
    /\bfintech\b/i,
    /\bhealth(?:care|tech)?\b/i,
    /\be-?commerce\b/i,
    /\benterprise software\b/i,
    /\bmarket(?:ing)? technology\b/i,
    /\bcontact cent(?:er|re)s?\b/i,
    /\bcustomer experience\b/i,
];
const KEYWORD_PATTERNS = new Map([
    ["product strategy", /\bproduct strategy\b/i],
    ["roadmap", /\broadmap\b/i],
    ["stakeholder management", /\bstakeholder(?: alignment| management| coordination)?\b/i],
    ["cross-functional", /\bcross-functional\b/i],
    ["platform", /\bplatform\b/i],
    ["product discovery", /\bproduct discovery\b/i],
    ["experimentation", /\bexperiment(?:ation|s|ing)?\b/i],
    ["artificial intelligence", /\b(?:AI|artificial intelligence)\b/i],
    ["machine learning", /\bmachine learning\b/i],
    ["data", /\bdata(?:-informed|-driven)?\b/i],
    ["delivery", /\bdelivery\b/i],
    ["CRM", /\bCRM\b/i],
    ["conversational AI", /\bconversational-?AI\b/i],
    ["LLM", /\bLLM(?:-based|s)?\b/i],
    ["agents", /\bagents?\b/i],
    ["user experience", /\b(?:UX|user experience|usability)\b/i],
    ["extensibility", /\bextensib(?:ility|le)\b/i],
    ["architecture", /\barchitecture\b/i],
    ["security", /\bsecurity\b/i],
    ["analytics", /\banalytics?\b/i],
    ["agile", /\bagile\b/i],
]);
export function jobRequirementPaths(workspace, targetId) {
    const rootRelativePath = `targets/jobs/${targetId}/requirements/deterministic`;
    const targetRelativePath = `targets/jobs/${targetId}/target.json`;
    const sourceRelativePath = `targets/jobs/${targetId}/job-description.md`;
    const analysisRelativePath = `targets/jobs/${targetId}/analysis/target-analysis.json`;
    const analysisManifestRelativePath = `targets/jobs/${targetId}/analysis/analysis-manifest.json`;
    const modelRelativePath = `${rootRelativePath}/${MODEL_FILE}`;
    const manifestRelativePath = `${rootRelativePath}/${MANIFEST_FILE}`;
    return {
        rootRelativePath,
        rootPath: resolveWithin(workspace, rootRelativePath),
        modelRelativePath,
        modelPath: resolveWithin(workspace, modelRelativePath),
        manifestRelativePath,
        manifestPath: resolveWithin(workspace, manifestRelativePath),
        targetRelativePath,
        targetPath: resolveWithin(workspace, targetRelativePath),
        sourceRelativePath,
        sourcePath: resolveWithin(workspace, sourceRelativePath),
        analysisRelativePath,
        analysisPath: resolveWithin(workspace, analysisRelativePath),
        analysisManifestRelativePath,
        analysisManifestPath: resolveWithin(workspace, analysisManifestRelativePath),
    };
}
export async function buildJobRequirements(workspace, targetId, options = {}) {
    const policyName = options.policyName ?? JOB_REQUIREMENT_POLICY_NAME;
    const policyVersion = options.policyVersion ?? JOB_REQUIREMENT_POLICY_VERSION;
    const input = await loadCurrentInput(workspace, targetId, policyName, policyVersion);
    const status = await getJobRequirementModelStatus(workspace, targetId, {
        policyName,
        policyVersion,
    });
    if (status.status === "current" && !options.rebuild) {
        const current = await showJobRequirementModel(workspace, targetId);
        return resultFromModel(current, input.paths, "already-current");
    }
    if ((status.status === "stale" || status.status === "invalid") && !options.rebuild) {
        throw new Error(`Stored job requirement model is ${status.status} and was not overwritten. Review it, then use --rebuild. ${status.reasons.join(" ")}`);
    }
    const now = (options.now ?? (() => new Date()))().toISOString();
    let createdAt = now;
    if (status.modelExists) {
        try {
            const previous = JobRequirementModelSchema.parse(await readJson(input.paths.modelPath, null));
            if (previous.targetId === targetId)
                createdAt = previous.createdAt;
        }
        catch {
            // Explicit rebuild may replace an invalid artifact with a fresh identity history.
        }
    }
    const modeled = modelRequirements(input.analysis, targetId);
    const model = JobRequirementModelSchema.parse({
        schemaVersion: 1,
        id: `job-requirements_${hashText(`${targetId}\u0000${input.normalizedInputSha256}\u0000${policyVersion}`).slice(0, 14)}`,
        targetId,
        targetType: "job",
        policy: { name: policyName, version: policyVersion, mode: "deterministic" },
        input: {
            target: { path: input.paths.targetRelativePath, sha256: input.targetSha256 },
            jobDescription: { path: input.paths.sourceRelativePath, sha256: input.sourceSha256 },
            structuralAnalysis: {
                path: input.paths.analysisRelativePath,
                sha256: input.analysisSha256,
            },
            structuralAnalysisManifest: {
                path: input.paths.analysisManifestRelativePath,
                sha256: input.analysisManifestSha256,
            },
            normalizedInputSha256: input.normalizedInputSha256,
        },
        ...modeled,
        trustState: "deterministic-unreviewed",
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(input.paths.modelPath, model);
    const manifest = JobRequirementModelManifestSchema.parse({
        schemaVersion: 1,
        modelId: model.id,
        targetId,
        targetType: "job",
        modelPath: input.paths.modelRelativePath,
        modelSha256: await hashFile(input.paths.modelPath),
        policyName,
        policyVersion,
        targetSha256: input.targetSha256,
        sourceSha256: input.sourceSha256,
        structuralAnalysisSha256: input.analysisSha256,
        structuralAnalysisManifestSha256: input.analysisManifestSha256,
        normalizedInputSha256: input.normalizedInputSha256,
        createdAt,
        updatedAt: now,
    });
    await writeJsonAtomic(input.paths.manifestPath, manifest);
    return resultFromModel(model, input.paths, status.status === "missing" ? "created" : "rebuilt");
}
export async function showJobRequirementModel(workspace, targetId) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job")
        throw new Error(`Job requirement modeling rejects Role Target: ${targetId}`);
    const paths = jobRequirementPaths(workspace, targetId);
    if (!(await pathExists(paths.modelPath))) {
        throw new Error(`Job requirement model not found for target: ${targetId}`);
    }
    return JobRequirementModelSchema.parse(await readJson(paths.modelPath, null));
}
export async function getJobRequirementModelStatus(workspace, targetId, options = {}) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job")
        throw new Error(`Job requirement modeling rejects Role Target: ${targetId}`);
    const paths = jobRequirementPaths(workspace, targetId);
    const modelExists = await pathExists(paths.modelPath);
    const manifestExists = await pathExists(paths.manifestPath);
    const analysisStatus = await getTargetAnalysisStatus(workspace, targetId);
    const base = {
        targetId,
        modelExists,
        manifestExists,
        structuralAnalysisStatus: analysisStatus.status,
        modelPath: paths.modelRelativePath,
        manifestPath: paths.manifestRelativePath,
    };
    if (!modelExists && !manifestExists) {
        return emptyStatus(base, "missing", ["No job requirement model exists."]);
    }
    if (!modelExists || !manifestExists) {
        return emptyStatus(base, "invalid", ["Job requirement model artifact set is incomplete."]);
    }
    let model;
    let manifest;
    try {
        model = JobRequirementModelSchema.parse(await readJson(paths.modelPath, null));
        manifest = JobRequirementModelManifestSchema.parse(await readJson(paths.manifestPath, null));
    }
    catch (error) {
        return emptyStatus(base, "invalid", [
            `Stored job requirement model is invalid: ${errorMessage(error)}`,
        ]);
    }
    const modelHashMatches = (await hashFile(paths.modelPath)) === manifest.modelSha256;
    const targetHashMatches = await hashMatches(paths.targetPath, manifest.targetSha256);
    const sourceHashMatches = await hashMatches(paths.sourcePath, manifest.sourceSha256);
    const structuralAnalysisHashMatches = await hashMatches(paths.analysisPath, manifest.structuralAnalysisSha256);
    const structuralManifestHashMatches = await hashMatches(paths.analysisManifestPath, manifest.structuralAnalysisManifestSha256);
    const policyMatches = manifest.policyName === (options.policyName ?? JOB_REQUIREMENT_POLICY_NAME) &&
        manifest.policyVersion === (options.policyVersion ?? JOB_REQUIREMENT_POLICY_VERSION) &&
        model.policy.name === manifest.policyName &&
        model.policy.version === manifest.policyVersion;
    let normalizedInputHashMatches = false;
    if (analysisStatus.status === "current") {
        try {
            const analysis = await showTargetAnalysis(workspace, targetId);
            normalizedInputHashMatches =
                normalizedInputHash(target, analysis, manifest.policyName, manifest.policyVersion) ===
                    manifest.normalizedInputSha256;
        }
        catch {
            normalizedInputHashMatches = false;
        }
    }
    const invalidReasons = [];
    if (!modelHashMatches)
        invalidReasons.push("Requirement model SHA-256 does not match its manifest.");
    if (model.targetId !== targetId ||
        manifest.targetId !== targetId ||
        model.targetType !== "job" ||
        manifest.targetType !== "job" ||
        manifest.modelPath !== paths.modelRelativePath ||
        model.id !== manifest.modelId) {
        invalidReasons.push("Requirement model identity or persistence path is invalid.");
    }
    if (model.input.target.sha256 !== manifest.targetSha256 ||
        model.input.jobDescription.sha256 !== manifest.sourceSha256 ||
        model.input.structuralAnalysis.sha256 !== manifest.structuralAnalysisSha256 ||
        model.input.structuralAnalysisManifest.sha256 !==
            manifest.structuralAnalysisManifestSha256 ||
        model.input.normalizedInputSha256 !== manifest.normalizedInputSha256) {
        invalidReasons.push("Requirement model and manifest disagree on dependency hashes.");
    }
    if (invalidReasons.length > 0) {
        return {
            ...base,
            modelHashMatches,
            targetHashMatches,
            sourceHashMatches,
            structuralAnalysisHashMatches,
            structuralManifestHashMatches,
            policyMatches,
            normalizedInputHashMatches,
            status: "invalid",
            reasons: invalidReasons,
        };
    }
    const staleReasons = [
        ...(analysisStatus.status !== "current"
            ? [`Structural target analysis is ${analysisStatus.status}.`]
            : []),
        ...(!targetHashMatches ? ["Job Target changed."] : []),
        ...(!sourceHashMatches ? ["Persisted Job Description changed."] : []),
        ...(!structuralAnalysisHashMatches ? ["Structural analysis changed."] : []),
        ...(!structuralManifestHashMatches ? ["Structural analysis manifest changed."] : []),
        ...(!policyMatches ? ["Requirement modeling policy changed."] : []),
        ...(!normalizedInputHashMatches ? ["Normalized requirement input changed."] : []),
    ];
    return {
        ...base,
        modelHashMatches,
        targetHashMatches,
        sourceHashMatches,
        structuralAnalysisHashMatches,
        structuralManifestHashMatches,
        policyMatches,
        normalizedInputHashMatches,
        status: staleReasons.length > 0 ? "stale" : "current",
        reasons: staleReasons,
    };
}
export function formatBuildJobRequirementsResult(result) {
    return [
        `Target ID: ${result.targetId}`,
        `Build result: ${result.result}`,
        `Requirement model: ${result.modelPath}`,
        `Manifest: ${result.manifestPath}`,
        `Requirements: ${result.requirementCount}`,
        `Ambiguities: ${result.ambiguityCount}`,
        `Contradictions: ${result.contradictionCount}`,
        `Warnings: ${result.warningCount}`,
        `Completeness: ${result.completeness.status}`,
        `Usable for human review: ${result.completeness.usableForHumanReview ? "yes" : "no"}`,
    ].join("\n");
}
export function formatJobRequirementModelStatus(status) {
    const check = (value) => value === null ? "not applicable" : value ? "yes" : "no";
    return [
        `Target ID: ${status.targetId}`,
        `Overall status: ${status.status}`,
        `Structural analysis status: ${status.structuralAnalysisStatus}`,
        `Model hash matches: ${check(status.modelHashMatches)}`,
        `Target hash matches: ${check(status.targetHashMatches)}`,
        `Job Description hash matches: ${check(status.sourceHashMatches)}`,
        `Structural analysis hash matches: ${check(status.structuralAnalysisHashMatches)}`,
        `Structural manifest hash matches: ${check(status.structuralManifestHashMatches)}`,
        `Policy matches: ${check(status.policyMatches)}`,
        `Normalized input matches: ${check(status.normalizedInputHashMatches)}`,
        `Model path: ${status.modelPath}`,
        `Manifest path: ${status.manifestPath}`,
        ...(status.reasons.length > 0
            ? ["Reasons:", ...status.reasons.map((reason) => `- ${reason}`)]
            : []),
    ].join("\n");
}
async function loadCurrentInput(workspace, targetId, policyName, policyVersion) {
    const target = await showTarget(workspace, targetId);
    if (target.type !== "job")
        throw new Error(`Job requirement modeling rejects Role Target: ${targetId}`);
    const paths = jobRequirementPaths(workspace, targetId);
    const analysisStatus = await getTargetAnalysisStatus(workspace, targetId);
    if (analysisStatus.status !== "current") {
        throw new Error(`Job Target structural analysis must be current before requirement modeling. Current status: ${analysisStatus.status}.`);
    }
    const sourceBytes = await readFile(paths.sourcePath);
    const sourceSha256 = hashBuffer(sourceBytes);
    if (sourceSha256 !== target.source.sha256) {
        throw new Error("Persisted Job Description SHA-256 does not match the Job Target.");
    }
    if (sourceBytes.toString("utf8") !== target.rawDescription) {
        throw new Error("Persisted Job Description no longer matches the immutable Job Target text.");
    }
    const analysis = await showTargetAnalysis(workspace, targetId);
    if (analysis.targetType !== "job")
        throw new Error("Job Target structural analysis has the wrong type.");
    const targetSha256 = await hashFile(paths.targetPath);
    const analysisSha256 = await hashFile(paths.analysisPath);
    const analysisManifestSha256 = await hashFile(paths.analysisManifestPath);
    return {
        target,
        paths,
        analysis,
        targetSha256,
        sourceSha256,
        analysisSha256,
        analysisManifestSha256,
        normalizedInputSha256: normalizedInputHash(target, analysis, policyName, policyVersion),
    };
}
function modelRequirements(analysis, targetId) {
    const sectionById = new Map(analysis.sections.map((section) => [section.id, section]));
    const eligibleItems = analysis.items.filter((item) => isRequirementSourceItem(item, sectionById.get(item.sectionId ?? "")));
    const requirements = eligibleItems.flatMap((item) => requirementsFromItem(targetId, item, sectionById.get(item.sectionId ?? "")));
    const ambiguities = requirements.flatMap((requirement) => {
        const codes = [];
        if (requirement.necessity === "ambiguous")
            codes.push("AMBIGUOUS_NECESSITY");
        if (requirement.category === "unknown")
            codes.push("AMBIGUOUS_CATEGORY");
        return codes.map((code) => ({
            id: `job-ambiguity_${hashText(`${requirement.id}\u0000${code}`).slice(0, 12)}`,
            code,
            message: code === "AMBIGUOUS_NECESSITY"
                ? "The source structure does not make this statement mandatory, preferred, or contextual."
                : "The statement is preserved without forcing it into a specific requirement category.",
            requirementIds: [requirement.id],
            sourceAnalysisItemIds: [requirement.provenance.sourceAnalysisItemId],
            sourceReferences: requirement.provenance.sourceReferences,
        }));
    });
    const contradictions = detectContradictions(requirements);
    const risks = [
        ...requirements
            .filter((requirement) => requirement.necessity === "ambiguous")
            .map((requirement) => ({
            id: `job-risk_${hashText(`${requirement.id}\u0000ambiguous-status`).slice(0, 12)}`,
            code: "AMBIGUOUS_MANDATORY_STATUS",
            severity: "medium",
            message: "Do not treat this statement as mandatory until a human resolves its source wording.",
            requirementIds: [requirement.id],
        })),
        ...requirements
            .filter((requirement) => requirement.category === "unknown")
            .map((requirement) => ({
            id: `job-risk_${hashText(`${requirement.id}\u0000unknown-category`).slice(0, 12)}`,
            code: "UNCLASSIFIED_REQUIREMENT",
            severity: "low",
            message: "The statement remains unclassified to avoid semantic overreach.",
            requirementIds: [requirement.id],
        })),
        ...contradictions.map((contradiction) => ({
            id: `job-risk_${hashText(`${contradiction.id}\u0000contradiction`).slice(0, 12)}`,
            code: "CONTRADICTORY_REQUIREMENT",
            severity: "high",
            message: contradiction.message,
            requirementIds: contradiction.requirementIds,
        })),
    ];
    const warnings = [
        ...(analysis.items.some((item) => item.kind === "front-matter-field")
            ? [{
                    id: `job-warning_${hashText(`${targetId}\u0000front-matter`).slice(0, 12)}`,
                    code: "FRONT_MATTER_EXCLUDED",
                    message: "Front matter metadata was preserved in structural analysis and excluded from requirements.",
                    sourceAnalysisItemIds: analysis.items
                        .filter((item) => item.kind === "front-matter-field")
                        .map((item) => item.id),
                }]
            : []),
        ...analysis.sections
            .filter((section) => section.classification === "unknown")
            .map((section) => ({
            id: `job-warning_${hashText(`${targetId}\u0000unknown-section\u0000${section.id}`).slice(0, 12)}`,
            code: "UNKNOWN_SECTION",
            message: `Section "${section.heading ?? "untitled"}" was not assigned a semantic requirement class.`,
            sourceAnalysisItemIds: analysis.items
                .filter((item) => item.sectionId === section.id)
                .map((item) => item.id),
        })),
        ...requirements
            .filter((requirement) => requirement.necessity === "ambiguous")
            .map((requirement) => ({
            id: `job-warning_${hashText(`${requirement.id}\u0000preserved`).slice(0, 12)}`,
            code: "AMBIGUOUS_ITEM_PRESERVED",
            message: "An ambiguous Job Description statement was preserved without hardening it.",
            sourceAnalysisItemIds: [requirement.provenance.sourceAnalysisItemId],
        })),
        ...(requirements.length === 0
            ? [{
                    id: `job-warning_${hashText(`${targetId}\u0000empty`).slice(0, 12)}`,
                    code: "NO_REQUIREMENTS_FOUND",
                    message: "No explicit requirement statements were available in the structural analysis.",
                    sourceAnalysisItemIds: [],
                }]
            : []),
    ];
    const modeledItemIds = new Set(requirements.map((requirement) => requirement.provenance.sourceAnalysisItemId));
    const unmodeledItemIds = eligibleItems
        .map((item) => item.id)
        .filter((id) => !modeledItemIds.has(id));
    return {
        requirements,
        namedTechnologies: uniqueSorted(requirements.flatMap((entry) => entry.namedTechnologies)),
        keywords: uniqueSorted(requirements.flatMap((entry) => entry.keywords)),
        ambiguities,
        contradictions,
        risks,
        warnings,
        completeness: {
            status: requirements.length === 0 ? "empty" : unmodeledItemIds.length > 0 ? "partial" : "complete",
            sourceItemCount: eligibleItems.length,
            modeledItemCount: modeledItemIds.size,
            unmodeledItemIds,
            usableForHumanReview: requirements.length > 0,
            blockingReasons: requirements.length === 0
                ? ["No explicit Job Description requirements were modeled."]
                : unmodeledItemIds.length > 0
                    ? [`${unmodeledItemIds.length} source item(s) remain unmodeled.`]
                    : [],
        },
    };
}
function requirementsFromItem(targetId, item, section) {
    const statement = normalizeStatement(item.statement);
    const preferenceModifier = splitPreferenceModifier(statement);
    if (preferenceModifier && (section?.classification === "required" ||
        item.necessity === "required")) {
        const base = requirementFromStatement(targetId, item, section, preferenceModifier.base, "mandatory");
        const preferred = requirementFromStatement(targetId, item, section, preferenceModifier.preference, "preferred");
        return [
            {
                ...base,
                relationships: [{ type: "related-to", requirementId: preferred.id }],
            },
            {
                ...preferred,
                relationships: [{ type: "related-to", requirementId: base.id }],
            },
        ];
    }
    return [requirementFromStatement(targetId, item, section, statement)];
}
function requirementFromStatement(targetId, item, section, statement, necessityOverride) {
    const necessity = necessityOverride ??
        classifyNecessity(statement, item, section);
    const category = classifyCategory(statement, item, necessity, section);
    const namedTechnologies = [...TECHNOLOGY_PATTERNS.entries()]
        .filter(([name, pattern]) => pattern.test(statement) &&
        !(name === "React" && /\bReact Native\b/i.test(statement)))
        .map(([name]) => name)
        .sort((a, b) => a.localeCompare(b));
    const keywords = [...KEYWORD_PATTERNS.entries()]
        .filter(([, pattern]) => pattern.test(statement))
        .map(([name]) => name)
        .sort((a, b) => a.localeCompare(b));
    const categoryWasExplicit = category !== "unknown" && category !== "required-capability" &&
        category !== "preferred-capability";
    const explicitness = categoryWasExplicit ||
        necessity !== "ambiguous" ||
        item.category === "responsibility" ||
        item.category === "qualification"
        ? "explicit"
        : "inferred";
    const confidence = explicitness === "explicit" && necessity !== "ambiguous"
        ? "high"
        : category !== "unknown" || necessity !== "ambiguous"
            ? "medium"
            : "low";
    const id = `job-requirement_${hashText([
        targetId,
        item.id,
        category,
        necessity,
        statement.toLowerCase(),
    ].join("\u0000")).slice(0, 14)}`;
    return {
        id,
        category,
        normalizedLabel: statement,
        sourceText: item.rawText,
        necessity,
        confidence,
        explicitness,
        provenance: {
            sourceAnalysisItemId: item.id,
            sourceSectionId: item.sectionId,
            sourceReferences: item.sourceReferences,
        },
        relationships: [],
        namedTechnologies,
        keywords,
        notes: necessity === "ambiguous"
            ? ["Necessity remains ambiguous because no explicit structural or phrase-level cue applies."]
            : [],
        trustState: "deterministic-unreviewed",
    };
}
function classifyNecessity(statement, item, section) {
    const mandatoryCue = /\b(?:must have|required(?: to| experience| qualification| skill)?|minimum of|at least)\b/i.test(statement);
    const preferredCue = /\b(?:preferred|nice to have|bonus)\b/i.test(statement);
    if (mandatoryCue && preferredCue)
        return "ambiguous";
    if (mandatoryCue)
        return "mandatory";
    if (preferredCue)
        return "preferred";
    if (section?.classification === "required" || item.necessity === "required")
        return "mandatory";
    if (section?.classification === "preferred" || item.necessity === "preferred")
        return "preferred";
    if (section?.classification === "responsibilities" ||
        section?.classification === "about-role" ||
        section?.normalizedHeading === "how we work" ||
        item.necessity === "contextual") {
        return "contextual";
    }
    return "ambiguous";
}
function classifyCategory(statement, item, necessity, section) {
    if (section?.normalizedHeading === "how we work") {
        return "operating-context";
    }
    if (/\b\d+\s*\+?\s*(?:years?|yrs?)\b|\byears? of experience\b|\bsenior(?:ity)?\b/i.test(statement)) {
        return "experience-seniority";
    }
    if (/\b(?:Arabic|English|French|German|Spanish|Mandarin|language|bilingual|fluent)\b/i.test(statement)) {
        return "language";
    }
    if (/\b(?:degree|bachelor'?s?|master'?s?|phd|doctorate|certification|certified|diploma)\b/i.test(statement)) {
        return "education-certification";
    }
    if (/\b(?:location|located|based in|remote|hybrid|on-?site|onsite|in-person|meet-?ups?|travel|visa|relocat|work permit|Riyadh|Berlin|Cairo|Dubai|London|UK|United Kingdom)\b/i.test(statement)) {
        return "location-travel-visa-work-mode";
    }
    if (/\b(?:background check|security clearance|screening|assessment test|drug test)\b/i.test(statement)) {
        return "screening";
    }
    if (/\b(?:multi-site|distributed team|global team|cross-functional|matrixed|multi-country|multi-region)\b/i.test(statement)) {
        return "operating-context";
    }
    if (item.category === "responsibility" &&
        section?.normalizedHeading === "what youll own") {
        return "responsibility";
    }
    if (section?.classification === "about-role" &&
        /\bthis role (?:owns|leads|is responsible for)\b/i.test(statement)) {
        return "responsibility";
    }
    if (/\b(?:hands-on work|owning a track|lead|leadership|manage|mentor|coach|people management|stakeholder|executive|team leadership)\b/i.test(statement)) {
        return "leadership-expectation";
    }
    if (DOMAIN_PATTERNS.some((pattern) => pattern.test(statement)))
        return "domain-expectation";
    if ([...TECHNOLOGY_PATTERNS.values()].some((pattern) => pattern.test(statement)) ||
        /\b(?:software|engineering|architecture|cloud|database|backend|frontend|mobile|security|technical|conversational-?AI|LLM(?:-based|s)?|agent products?|CRM|Salesforce|platform|extensib(?:ility|le))\b/i.test(statement)) {
        return "technical-expectation";
    }
    if (/\b(?:users?|customers?|transactions?|requests?|revenue|budget|million|billion|percentage|%)\b/i.test(statement)) {
        return "metric-scale";
    }
    if (item.category === "responsibility")
        return "responsibility";
    if (necessity === "mandatory")
        return "required-capability";
    if (necessity === "preferred")
        return "preferred-capability";
    if (item.category === "qualification")
        return "required-capability";
    return "unknown";
}
function isRequirementSourceItem(item, section) {
    if (item.kind === "front-matter-field")
        return false;
    if (!section)
        return false;
    if (section.classification === "company")
        return false;
    if (section.classification === "benefits") {
        return isWorkConstraint(item.statement);
    }
    if (section.heading === null)
        return false;
    if (section.classification === "about-role") {
        return /\b(?:this role|you(?: will|'ll)|your responsibilities?|the successful candidate)\b/i.test(item.statement);
    }
    if (section.normalizedHeading === "how we work") {
        return /\b(?:you|your|team|engineering|product judgement|product judgment)\b/i.test(item.statement);
    }
    return true;
}
function isWorkConstraint(statement) {
    return /\b(?:based in|remote|hybrid|on-?site|onsite|in-person|meet-?ups?|travel|visa|relocat|work permit|London|UK|United Kingdom)\b/i.test(statement);
}
function splitPreferenceModifier(statement) {
    const match = statement.match(/^(.+?\.)\s+([^.!?]+\bis strongly preferred\.)$/i);
    if (!match?.[1] || !match[2])
        return null;
    return {
        base: match[1].trim(),
        preference: match[2].trim(),
    };
}
function detectContradictions(requirements) {
    const byLabel = new Map();
    for (const requirement of requirements) {
        const key = requirement.normalizedLabel.toLowerCase();
        byLabel.set(key, [...(byLabel.get(key) ?? []), requirement]);
    }
    return [...byLabel.entries()].flatMap(([label, entries]) => {
        const necessities = new Set(entries.map((entry) => entry.necessity));
        if (entries.length < 2 ||
            !necessities.has("mandatory") ||
            !necessities.has("preferred")) {
            return [];
        }
        return [{
                id: `job-contradiction_${hashText(`${label}\u0000${entries.map((entry) => entry.id).sort().join("\u0000")}`).slice(0, 12)}`,
                message: "The same source statement appears as both mandatory and preferred.",
                requirementIds: entries.map((entry) => entry.id).sort(),
                sourceReferences: entries.flatMap((entry) => entry.provenance.sourceReferences),
            }];
    });
}
function normalizedInputHash(target, analysis, policyName, policyVersion) {
    return hashText(JSON.stringify({
        policyName,
        policyVersion,
        target: {
            id: target.id,
            type: target.type,
            title: target.title,
            company: target.company,
            location: target.location,
            workingModel: target.workingModel,
            sourceSha256: target.source.sha256,
        },
        sections: analysis.sections.map((section) => ({
            id: section.id,
            classification: section.classification,
            heading: section.heading,
        })),
        items: analysis.items.map((item) => ({
            id: item.id,
            sectionId: item.sectionId,
            kind: item.kind,
            statement: item.statement,
            rawText: item.rawText,
            necessity: item.necessity,
            category: item.category,
            sourceReferences: item.sourceReferences,
        })),
    }));
}
function resultFromModel(model, paths, result) {
    return {
        targetId: model.targetId,
        result,
        modelPath: paths.modelRelativePath,
        manifestPath: paths.manifestRelativePath,
        requirementCount: model.requirements.length,
        ambiguityCount: model.ambiguities.length,
        contradictionCount: model.contradictions.length,
        warningCount: model.warnings.length,
        completeness: model.completeness,
    };
}
function emptyStatus(base, status, reasons) {
    return {
        ...base,
        modelHashMatches: null,
        targetHashMatches: null,
        sourceHashMatches: null,
        structuralAnalysisHashMatches: null,
        structuralManifestHashMatches: null,
        policyMatches: null,
        normalizedInputHashMatches: null,
        status,
        reasons,
    };
}
function resolveWithin(workspace, relativePath) {
    const root = path.resolve(workspace);
    const resolved = path.resolve(root, relativePath);
    const relation = path.relative(root, resolved);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new Error(`Job requirement path escapes the workspace: ${relativePath}`);
    }
    return resolved;
}
async function hashMatches(filePath, expected) {
    return (await pathExists(filePath)) && (await hashFile(filePath)) === expected;
}
function normalizeStatement(value) {
    return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
