import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { hashFile, hashText, pathExists } from "../fs-utils.js";
import {
  TARGET_INTERPRETATION_POLICY_VERSION,
  TARGET_INTERPRETER_NAME,
  TARGET_INTERPRETER_VERSION,
  formatInterpretTargetResult,
  formatTargetInterpretationStatus,
  getTargetInterpretationStatus,
  interpretTarget,
  loadRoleProfile,
  showTargetInterpretation,
} from "../target-interpretation.js";
import { analyzeTarget, getTargetAnalysisStatus } from "../target-analysis.js";
import { createJobTarget, createRoleTarget } from "../targets.js";

const FIRST_TIME = "2026-07-21T08:00:00.000Z";
const SECOND_TIME = "2026-07-22T08:00:00.000Z";

const JOB_MARKDOWN = [
  "---",
  "title: Engineering Manager",
  "company: ExampleCo",
  "---",
  "",
  "# Engineering Manager",
  "This paragraph describes the role but is not a structured requirement.",
  "",
  "## Responsibilities",
  "- Manage, mentor, and support a distributed team of engineers.",
  "A responsibility paragraph remains uninterpreted.",
  "",
  "## Required Qualifications",
  "- Experience delivering software platforms.",
  "",
  "## Preferred Qualifications",
  "- Experience with distributed systems.",
  "",
  "## Qualifications",
  "- Strong written communication.",
  "",
  "## About the Company",
  "- ExampleCo builds software products.",
  "",
  "## Benefits",
  "- Flexible working arrangements.",
  "",
  "## Team Culture",
  "- Work openly across disciplines.",
  "",
].join("\n");

describe("Slice 2.3A semantic target interpretation contract", () => {
  it("loads a valid role profile and interprets explicit expectations with profile provenance", async () => {
    const fixture = await roleWorkspace();
    const profilePath = await writeRoleProfile(fixture.workspace);
    const loaded = await loadRoleProfile(fixture.workspace, profilePath, fixture.target);
    const result = await interpretTarget(fixture.workspace, fixture.target.id, {
      roleProfile: profilePath,
      now: () => new Date(FIRST_TIME),
    });
    const interpretation = await showTargetInterpretation(fixture.workspace, fixture.target.id);
    const expectationIds = interpretation.expectations.map((entry) => entry.id);
    const groupIds = interpretation.groups.map((entry) => entry.id);

    expect(loaded.profile.title).toBe("Engineering Manager");
    expect(loaded.sha256).toBe(await hashFile(profilePath));
    expect(result).toMatchObject({
      result: "created",
      expectationCount: 3,
      groupCount: 3,
      roleProfilePath: "role-profiles/engineering-manager.json",
    });
    expect(interpretation.expectations.map((entry) => entry.statement)).toEqual([
      "Guide engineering execution across product priorities.",
      "Support and develop engineering team members.",
      "Make explicit architecture and delivery tradeoffs.",
    ]);
    expect(interpretation.expectations.every((entry) => entry.explicitness === "explicit")).toBe(true);
    expect(interpretation.expectations.every((entry) => entry.interpretationConfidence === "high")).toBe(true);
    expect(interpretation.expectations.every((entry) => entry.sourceAnalysisItemIds.length === 0)).toBe(true);
    const source = interpretation.expectations[0]?.sourceReferences[0];
    expect(source).toMatchObject({
      sourceType: "role-profile-json",
      path: "role-profiles/engineering-manager.json",
      sha256: loaded.sha256,
      jsonPointer: "/expectations/0",
    });
    const firstProfileExpectation = loaded.profile.expectations[0];
    expect(source?.excerptSha256).toBe(hashText(JSON.stringify(firstProfileExpectation)));
    expect(JSON.stringify(interpretation)).not.toMatch(/candidateEvidence|fitScore|proofReadiness/);
    expect(formatInterpretTargetResult(result)).toContain("Interpreter: target-semantics v1");

    await interpretTarget(fixture.workspace, fixture.target.id, {
      roleProfile: profilePath,
      rebuild: true,
      now: () => new Date(SECOND_TIME),
    });
    const rebuilt = await showTargetInterpretation(fixture.workspace, fixture.target.id);
    expect(rebuilt.expectations.map((entry) => entry.id)).toEqual(expectationIds);
    expect(rebuilt.groups.map((entry) => entry.id)).toEqual(groupIds);
  });

  it("keeps role targets first-class without inferring expectations when no profile exists", async () => {
    const fixture = await roleWorkspace();
    await interpretTarget(fixture.workspace, fixture.target.id, { now: () => new Date(FIRST_TIME) });
    const interpretation = await showTargetInterpretation(fixture.workspace, fixture.target.id);

    expect(interpretation.expectations).toEqual([]);
    expect(interpretation.groups).toEqual([]);
    expect(interpretation.ambiguities.map((entry) => entry.code)).toContain("ROLE_PROFILE_MISSING");
    expect(interpretation.warnings.map((entry) => entry.code)).toEqual(
      expect.arrayContaining(["ROLE_PROFILE_NOT_CONFIGURED", "NO_EXPECTATIONS_PRODUCED"]),
    );
  });

  it("supports exact normalized alias lookup without fuzzy title matching", async () => {
    const fixture = await roleWorkspace();
    await writeRoleProfile(fixture.workspace, {
      title: "Software Engineering Manager",
      aliases: ["Engineering Manager"],
    });

    const result = await interpretTarget(fixture.workspace, fixture.target.id, {
      now: () => new Date(FIRST_TIME),
    });
    expect(result.roleProfilePath).toBe("role-profiles/engineering-manager.json");
    expect(result.expectationCount).toBe(3);
  });

  it("rejects profile title mismatches, blank statements, duplicate IDs, and invalid tags", async () => {
    const mismatch = await roleWorkspace();
    const mismatchPath = await writeRoleProfile(mismatch.workspace, { title: "Product Manager", aliases: [] });
    await expect(
      interpretTarget(mismatch.workspace, mismatch.target.id, { roleProfile: mismatchPath }),
    ).rejects.toThrow("do not exactly match target title");

    const blank = await roleWorkspace();
    const blankPath = await writeRoleProfile(blank.workspace, {
      expectations: [{ ...baseExpectations()[0]!, statement: " " }],
    });
    await expect(loadRoleProfile(blank.workspace, blankPath)).rejects.toThrow();

    const duplicate = await roleWorkspace();
    const duplicatePath = await writeRoleProfile(duplicate.workspace, {
      expectations: [baseExpectations()[0]!, { ...baseExpectations()[1]!, id: "delivery-leadership" }],
    });
    await expect(loadRoleProfile(duplicate.workspace, duplicatePath)).rejects.toThrow(
      "Role profile expectation IDs must be unique",
    );

    const invalidTag = await roleWorkspace();
    const invalidTagPath = await writeRoleProfile(invalidTag.workspace, {
      expectations: [{ ...baseExpectations()[0]!, capabilityTags: ["Not Normalized"] }],
    });
    await expect(loadRoleProfile(invalidTag.workspace, invalidTagPath)).rejects.toThrow();
  });

  it("maps only explicitly supported job sections to conservative expectations", async () => {
    const fixture = await jobWorkspace();
    const result = await interpretTarget(fixture.workspace, fixture.targetId, {
      now: () => new Date(FIRST_TIME),
    });
    const interpretation = await showTargetInterpretation(fixture.workspace, fixture.targetId);

    expect(result.expectationCount).toBe(4);
    expect(interpretation.expectations.map((entry) => [entry.kind, entry.necessity])).toEqual([
      ["responsibility", "contextual"],
      ["qualification", "required"],
      ["qualification", "preferred"],
      ["qualification", "unknown"],
    ]);
    expect(interpretation.expectations.every((entry) => entry.importance === "unknown")).toBe(true);
    expect(interpretation.expectations.every((entry) => entry.capabilityTags.length === 0)).toBe(true);
    expect(interpretation.expectations.map((entry) => entry.statement)).not.toEqual(
      expect.arrayContaining([
        "ExampleCo builds software products.",
        "Flexible working arrangements.",
        "Work openly across disciplines.",
      ]),
    );
    expect(interpretation.warnings.map((entry) => entry.code)).toEqual(
      expect.arrayContaining([
        "PARAGRAPH_NOT_INTERPRETED",
        "UNCLASSIFIED_ITEM_SKIPPED",
        "STRUCTURAL_ANALYSIS_CONTAINS_UNKNOWN_SECTIONS",
      ]),
    );
    expect(interpretation.ambiguities.map((entry) => entry.code)).toContain(
      "INSUFFICIENT_EXPLICIT_STRUCTURE",
    );
  });

  it("keeps each job list item intact and preserves exact structural provenance", async () => {
    const fixture = await jobWorkspace();
    const analysis = await fixture.analysis();
    await interpretTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    const interpretation = await showTargetInterpretation(fixture.workspace, fixture.targetId);
    const sourceItem = analysis.items.find((entry) => entry.statement.startsWith("Manage, mentor"));
    const expectation = interpretation.expectations.find((entry) => entry.statement.startsWith("Manage, mentor"));

    expect(expectation?.statement).toBe(
      "Manage, mentor, and support a distributed team of engineers.",
    );
    expect(expectation?.sourceAnalysisItemIds).toEqual([sourceItem?.id]);
    expect(expectation?.sourceReferences).toEqual(sourceItem?.sourceReferences);
    expect(interpretation.expectations.filter((entry) => entry.sourceAnalysisItemIds[0] === sourceItem?.id))
      .toHaveLength(1);
  });

  it("persists interpretation and manifest separately without modifying target or analysis", async () => {
    const fixture = await jobWorkspace();
    const targetPath = jobTargetPath(fixture.workspace, fixture.targetId);
    const analysisPath = structuralPath(fixture.workspace, fixture.targetId);
    const targetBefore = await readFile(targetPath);
    const analysisBefore = await readFile(analysisPath);

    const result = await interpretTarget(fixture.workspace, fixture.targetId, {
      now: () => new Date(FIRST_TIME),
    });
    const interpretationPath = interpretationArtifact(fixture.workspace, fixture.targetId);
    const manifestPath = interpretationManifest(fixture.workspace, fixture.targetId);
    const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Record<string, unknown>;

    expect(result.interpretationPath).toBe(
      `targets/jobs/${fixture.targetId}/interpretation/target-interpretation.json`,
    );
    expect(await pathExists(interpretationPath)).toBe(true);
    expect(await pathExists(manifestPath)).toBe(true);
    expect(await readFile(targetPath)).toEqual(targetBefore);
    expect(await readFile(analysisPath)).toEqual(analysisBefore);
    expect(manifest).toMatchObject({
      schemaVersion: 1,
      targetId: fixture.targetId,
      interpretationSha256: await hashFile(interpretationPath),
      targetSha256: await hashFile(targetPath),
      structuralAnalysisSha256: await hashFile(analysisPath),
      interpreterName: TARGET_INTERPRETER_NAME,
      interpreterVersion: TARGET_INTERPRETER_VERSION,
      policyVersion: TARGET_INTERPRETATION_POLICY_VERSION,
    });
    expect(JSON.stringify(JSON.parse(await readFile(interpretationPath, "utf8")))).not.toContain(tmpdir());
  });

  it("reports missing and current status without regenerating interpretation", async () => {
    const fixture = await jobWorkspace();
    const missing = await getTargetInterpretationStatus(fixture.workspace, fixture.targetId);
    expect(missing.status).toBe("missing");
    expect(formatTargetInterpretationStatus(missing)).toContain("Overall status: missing");

    await interpretTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    const current = await getTargetInterpretationStatus(fixture.workspace, fixture.targetId);
    expect(current).toMatchObject({
      status: "current",
      targetHashMatches: true,
      structuralAnalysisHashMatches: true,
      interpreterNameMatches: true,
      interpreterVersionMatches: true,
      policyVersionMatches: true,
      interpretationHashMatches: true,
    });
  });

  it("does not rewrite unchanged input and preserves timestamps, hashes, and stable IDs", async () => {
    const fixture = await jobWorkspace();
    await interpretTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    const interpretationPath = interpretationArtifact(fixture.workspace, fixture.targetId);
    const manifestPath = interpretationManifest(fixture.workspace, fixture.targetId);
    const first = await showTargetInterpretation(fixture.workspace, fixture.targetId);
    const [firstBytes, firstManifest, firstStat, firstManifestStat] = await Promise.all([
      readFile(interpretationPath),
      readFile(manifestPath),
      stat(interpretationPath),
      stat(manifestPath),
    ]);

    const result = await interpretTarget(fixture.workspace, fixture.targetId, {
      now: () => new Date(SECOND_TIME),
    });
    const second = await showTargetInterpretation(fixture.workspace, fixture.targetId);
    expect(result.result).toBe("already-current");
    expect(await readFile(interpretationPath)).toEqual(firstBytes);
    expect(await readFile(manifestPath)).toEqual(firstManifest);
    expect((await stat(interpretationPath)).mtimeMs).toBe(firstStat.mtimeMs);
    expect((await stat(manifestPath)).mtimeMs).toBe(firstManifestStat.mtimeMs);
    expect(second.createdAt).toBe(FIRST_TIME);
    expect(second.updatedAt).toBe(FIRST_TIME);
    expect(second.expectations.map((entry) => entry.id)).toEqual(first.expectations.map((entry) => entry.id));
    expect(second.groups.map((entry) => entry.id)).toEqual(first.groups.map((entry) => entry.id));
    expect(second.warnings.map((entry) => entry.id)).toEqual(first.warnings.map((entry) => entry.id));
    expect(second.ambiguities.map((entry) => entry.id)).toEqual(first.ambiguities.map((entry) => entry.id));
  });

  it("marks interpreter and policy changes stale and requires explicit rebuild", async () => {
    const fixture = await jobWorkspace();
    await interpretTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });

    expect((await getTargetInterpretationStatus(fixture.workspace, fixture.targetId, {
      interpreterName: "target-semantics-next",
    })).status).toBe("stale");
    expect((await getTargetInterpretationStatus(fixture.workspace, fixture.targetId, {
      interpreterVersion: "2",
    })).status).toBe("stale");
    expect((await getTargetInterpretationStatus(fixture.workspace, fixture.targetId, {
      policyVersion: "2",
    })).status).toBe("stale");
    await expect(interpretTarget(fixture.workspace, fixture.targetId, {
      interpreterVersion: "2",
    })).rejects.toThrow("Re-run with --rebuild");

    await interpretTarget(fixture.workspace, fixture.targetId, {
      interpreterVersion: "2",
      rebuild: true,
      now: () => new Date(SECOND_TIME),
    });
    const rebuilt = await showTargetInterpretation(fixture.workspace, fixture.targetId);
    expect(rebuilt.createdAt).toBe(FIRST_TIME);
    expect(rebuilt.updatedAt).toBe(SECOND_TIME);
    expect(rebuilt.interpreter.version).toBe("2");
  });

  it("marks changed role profiles stale and keeps profile identity explicit", async () => {
    const fixture = await roleWorkspace();
    const profilePath = await writeRoleProfile(fixture.workspace);
    await interpretTarget(fixture.workspace, fixture.target.id, {
      roleProfile: profilePath,
      now: () => new Date(FIRST_TIME),
    });
    await writeRoleProfile(fixture.workspace, { updatedAt: SECOND_TIME });

    const status = await getTargetInterpretationStatus(fixture.workspace, fixture.target.id);
    expect(status.status).toBe("stale");
    expect(status.roleProfileHashMatches).toBe(false);
    await expect(interpretTarget(fixture.workspace, fixture.target.id)).rejects.toThrow(
      "Re-run with --rebuild",
    );
  });

  it("marks target and structural-analysis dependency changes stale", async () => {
    const targetFixture = await jobWorkspace();
    await interpretTarget(targetFixture.workspace, targetFixture.targetId, {
      now: () => new Date(FIRST_TIME),
    });
    const targetPath = jobTargetPath(targetFixture.workspace, targetFixture.targetId);
    const targetJson = JSON.parse(await readFile(targetPath, "utf8")) as Record<string, unknown>;
    targetJson.location = "Remote Europe";
    await writeFile(targetPath, `${JSON.stringify(targetJson, null, 2)}\n`, "utf8");
    const targetStatus = await getTargetInterpretationStatus(targetFixture.workspace, targetFixture.targetId);
    expect(targetStatus.status).toBe("stale");
    expect(targetStatus.targetHashMatches).toBe(false);

    const analysisFixture = await roleWorkspace();
    const profilePath = await writeRoleProfile(analysisFixture.workspace);
    await interpretTarget(analysisFixture.workspace, analysisFixture.target.id, {
      roleProfile: profilePath,
      now: () => new Date(FIRST_TIME),
    });
    const analysisPath = roleStructuralPath(analysisFixture.workspace, analysisFixture.target.id);
    const analysis = JSON.parse(await readFile(analysisPath, "utf8")) as Record<string, unknown>;
    analysis.updatedAt = SECOND_TIME;
    await writeFile(analysisPath, `${JSON.stringify(analysis, null, 2)}\n`, "utf8");
    const analysisManifestPath = roleStructuralManifest(analysisFixture.workspace, analysisFixture.target.id);
    const analysisManifest = JSON.parse(await readFile(analysisManifestPath, "utf8")) as Record<string, unknown>;
    analysisManifest.analysisSha256 = await hashFile(analysisPath);
    analysisManifest.updatedAt = SECOND_TIME;
    await writeFile(analysisManifestPath, `${JSON.stringify(analysisManifest, null, 2)}\n`, "utf8");
    expect((await getTargetAnalysisStatus(analysisFixture.workspace, analysisFixture.target.id)).status)
      .toBe("current");
    const interpretationStatus = await getTargetInterpretationStatus(
      analysisFixture.workspace,
      analysisFixture.target.id,
    );
    expect(interpretationStatus.status).toBe("stale");
    expect(interpretationStatus.structuralAnalysisHashMatches).toBe(false);
  });

  it("detects interpretation hash mismatch and malformed manifests without silent overwrite", async () => {
    const fixture = await jobWorkspace();
    await interpretTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    const interpretationPath = interpretationArtifact(fixture.workspace, fixture.targetId);
    await writeFile(interpretationPath, `${await readFile(interpretationPath, "utf8")} `, "utf8");
    const hashMismatch = await getTargetInterpretationStatus(fixture.workspace, fixture.targetId);
    expect(hashMismatch.status).toBe("invalid");
    expect(hashMismatch.interpretationHashMatches).toBe(false);
    await expect(interpretTarget(fixture.workspace, fixture.targetId)).rejects.toThrow(
      "was not overwritten",
    );

    await interpretTarget(fixture.workspace, fixture.targetId, {
      rebuild: true,
      now: () => new Date(SECOND_TIME),
    });
    await writeFile(interpretationManifest(fixture.workspace, fixture.targetId), "{ invalid", "utf8");
    expect((await getTargetInterpretationStatus(fixture.workspace, fixture.targetId)).status).toBe("invalid");
  });

  it("creates no evidence-match, fit, strengths, resume, or application artifacts", async () => {
    const fixture = await jobWorkspace();
    await interpretTarget(fixture.workspace, fixture.targetId, { now: () => new Date(FIRST_TIME) });
    expect(await pathExists(path.join(fixture.workspace, "outputs"))).toBe(false);
    expect(await pathExists(path.join(fixture.workspace, "kb"))).toBe(false);
    const interpretation = await showTargetInterpretation(fixture.workspace, fixture.targetId);
    const serialized = JSON.stringify(interpretation);
    expect(serialized).not.toMatch(/fitScore|proofReadiness|strengths|weaknesses|candidateEvidence/);
  });
});

async function temporaryWorkspace(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "prooflayer-interpretation-"));
}

async function roleWorkspace() {
  const workspace = await temporaryWorkspace();
  const created = await createRoleTarget(
    workspace,
    { title: "Engineering Manager" },
    { now: () => new Date(FIRST_TIME) },
  );
  await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  return { workspace, target: created.target };
}

async function jobWorkspace() {
  const workspace = await temporaryWorkspace();
  const sourcePath = path.join(workspace, "fixtures", "engineering-manager.md");
  await mkdir(path.dirname(sourcePath), { recursive: true });
  await writeFile(sourcePath, JOB_MARKDOWN, "utf8");
  const created = await createJobTarget(workspace, { file: sourcePath }, {
    now: () => new Date(FIRST_TIME),
  });
  await analyzeTarget(workspace, created.target.id, { now: () => new Date(FIRST_TIME) });
  return {
    workspace,
    targetId: created.target.id,
    analysis: () => import("../target-analysis.js").then((module) =>
      module.showTargetAnalysis(workspace, created.target.id)),
  };
}

function baseExpectations() {
  return [
    {
      id: "delivery-leadership",
      kind: "leadership",
      statement: "Guide engineering execution across product priorities.",
      necessity: "required",
      importance: "critical",
      capabilityTags: ["delivery-leadership"],
      group: "leadership-expectations",
      notes: ["Curated role expectation."],
    },
    {
      id: "technical-tradeoffs",
      kind: "technical-skill",
      statement: "Make explicit architecture and delivery tradeoffs.",
      necessity: "required",
      importance: "high",
      capabilityTags: ["technical-tradeoffs"],
      group: "technical-expectations",
      notes: [],
    },
    {
      id: "team-development",
      kind: "leadership",
      statement: "Support and develop engineering team members.",
      necessity: "required",
      importance: "high",
      capabilityTags: ["team-development"],
      group: "core-responsibilities",
      notes: [],
    },
  ];
}

async function writeRoleProfile(
  workspace: string,
  overrides: Record<string, unknown> = {},
): Promise<string> {
  const filePath = path.join(workspace, "role-profiles", "engineering-manager.json");
  await mkdir(path.dirname(filePath), { recursive: true });
  const profile = {
    schemaVersion: 1,
    id: "engineering-manager",
    title: "Engineering Manager",
    aliases: ["Engineering Lead"],
    expectations: baseExpectations(),
    createdAt: FIRST_TIME,
    updatedAt: FIRST_TIME,
    ...overrides,
  };
  await writeFile(filePath, `${JSON.stringify(profile, null, 2)}\n`, "utf8");
  return filePath;
}

function jobTargetPath(workspace: string, targetId: string): string {
  return path.join(workspace, "targets", "jobs", targetId, "target.json");
}

function structuralPath(workspace: string, targetId: string): string {
  return path.join(workspace, "targets", "jobs", targetId, "analysis", "target-analysis.json");
}

function roleStructuralPath(workspace: string, targetId: string): string {
  return path.join(workspace, "targets", "roles", targetId, "analysis", "target-analysis.json");
}

function roleStructuralManifest(workspace: string, targetId: string): string {
  return path.join(workspace, "targets", "roles", targetId, "analysis", "analysis-manifest.json");
}

function interpretationArtifact(workspace: string, targetId: string): string {
  return path.join(workspace, "targets", "jobs", targetId, "interpretation", "target-interpretation.json");
}

function interpretationManifest(workspace: string, targetId: string): string {
  return path.join(workspace, "targets", "jobs", targetId, "interpretation", "interpretation-manifest.json");
}
