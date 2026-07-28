import {
  mkdir,
  mkdtemp,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  JOB_FIT_PROOF_ASSESSMENT_ANALYZER_NAME,
  JOB_FIT_PROOF_ASSESSMENT_POLICY_NAME,
  buildJobFitProofAssessment,
  classifyJobRequirementAssessment,
  classifyOverallJobAssessment,
  getJobFitProofAssessmentStatus,
  jobFitProofAssessmentPaths,
  showJobFitProofAssessment,
} from "../job-fit-proof-assessment.js";
import { buildJobCoverage, jobCoveragePaths } from "../job-coverage.js";
import { buildJobEvidenceMap } from "../job-evidence-mapping.js";
import { buildJobRequirements } from "../job-requirements.js";
import {
  hashFile,
  hashText,
  writeJsonAtomic,
} from "../fs-utils.js";
import type {
  Claim,
  EvidenceItem,
  Source,
} from "../schemas.js";
import { analyzeTarget } from "../target-analysis.js";
import { createJobTarget, createRoleTarget } from "../targets.js";

const FIRST_TIME = "2026-07-27T12:00:00.000Z";
const JOB_DESCRIPTION = [
  "---",
  "title: Technical Product Manager",
  "company: Example Systems",
  "---",
  "",
  "## Required Qualifications",
  "- Required experience with TypeScript and Node.js.",
  "- Arabic and English are required.",
  "",
  "## Preferred Qualifications",
  "- React Native experience is preferred.",
  "",
].join("\n");

describe("Slice 2.7D deterministic Job Fit and Proof Assessment", () => {
  it("maps coverage to controlled assessment, proof, materiality, and gap states", () => {
    expect(classifyJobRequirementAssessment(coverageInput({
      state: "supported",
      evidenceQuality: "strong",
    }))).toMatchObject({
      assessmentState: "strength",
      proofStrength: "strong",
      materiality: "material",
    });
    expect(classifyJobRequirementAssessment(coverageInput({
      state: "supported",
      evidenceQuality: "adequate",
    }))).toMatchObject({
      assessmentState: "supported",
      proofStrength: "adequate",
    });
    expect(classifyJobRequirementAssessment(coverageInput({
      state: "partially-supported",
      evidenceQuality: "limited",
      category: "technical-expectation",
    }))).toMatchObject({
      assessmentState: "partial",
      proofStrength: "limited",
      gapType: "technology-gap",
    });
    expect(classifyJobRequirementAssessment(coverageInput({
      state: "unsupported",
      evidenceQuality: "unavailable",
      necessity: "preferred",
    }))).toMatchObject({
      assessmentState: "gap",
      proofStrength: "unavailable",
      materiality: "secondary",
      gapType: "missing-proof",
    });
    expect(classifyJobRequirementAssessment(coverageInput({
      state: "contradicted",
      evidenceQuality: "mixed",
    }))).toMatchObject({
      assessmentState: "contradiction",
      proofStrength: "conflicting",
      materiality: "critical",
      gapType: "contradiction",
    });
    expect(classifyJobRequirementAssessment(coverageInput({
      state: "indeterminate",
      evidenceQuality: "mixed",
      necessity: "ambiguous",
    }))).toMatchObject({
      assessmentState: "indeterminate",
      materiality: "unknown",
      gapType: "ambiguous",
    });
  });

  it("produces every qualitative overall state without numeric scoring", () => {
    expect(classifyOverallJobAssessment([
      assessed("strength", "strong"),
    ])).toBe("strong");
    expect(classifyOverallJobAssessment([
      assessed("supported", "adequate"),
    ])).toBe("credible");
    expect(classifyOverallJobAssessment([
      assessed("supported", "adequate", "a"),
      assessed("gap", "unavailable", "b"),
    ])).toBe("mixed");
    expect(classifyOverallJobAssessment([
      assessed("partial", "limited"),
    ])).toBe("limited");
    expect(classifyOverallJobAssessment([
      assessed("gap", "unavailable"),
    ])).toBe("insufficient");
    expect(classifyOverallJobAssessment([
      assessed("indeterminate", "limited"),
    ])).toBe("indeterminate");
  });

  it("builds one provenance-bearing assessment for every coverage entry", async () => {
    const fixture = await assessmentWorkspace();
    const result = await buildJobFitProofAssessment(
      fixture.workspace,
      fixture.targetId,
      { now: () => new Date(FIRST_TIME) },
    );
    const assessment = await showJobFitProofAssessment(
      fixture.workspace,
      fixture.targetId,
    );
    const paths = jobFitProofAssessmentPaths(
      fixture.workspace,
      fixture.targetId,
    );
    const coveragePaths = jobCoveragePaths(fixture.workspace, fixture.targetId);

    expect(result).toMatchObject({
      result: "created",
      assessmentPath:
        `targets/jobs/${fixture.targetId}/assessment/deterministic/job-fit-proof-assessment.json`,
    });
    expect(assessment).toMatchObject({
      schemaVersion: 1,
      targetType: "job",
      analyzer: {
        name: JOB_FIT_PROOF_ASSESSMENT_ANALYZER_NAME,
        version: "1",
        mode: "deterministic",
      },
      policy: {
        name: JOB_FIT_PROOF_ASSESSMENT_POLICY_NAME,
        version: "1",
      },
      completeness: {
        status: "complete",
      },
    });
    const coverage = JSON.parse(
      await readFile(coveragePaths.coveragePath, "utf8"),
    ) as { requirements: Array<{ id: string; requirementId: string }> };
    expect(assessment.requirementAssessments).toHaveLength(
      coverage.requirements.length,
    );
    expect(new Set(
      assessment.requirementAssessments.map((entry) => entry.requirementId),
    )).toEqual(new Set(
      coverage.requirements.map((entry) => entry.requirementId),
    ));
    for (const entry of assessment.requirementAssessments) {
      const source = coverage.requirements.find(
        (candidate) => candidate.requirementId === entry.requirementId,
      )!;
      expect(entry.provenance.coverage).toMatchObject({
        coveragePath: coveragePaths.coverageRelativePath,
        coverageEntryId: source.id,
      });
      expect(entry.provenance.requirement.sourceReferences.length).toBeGreaterThan(0);
    }
    const manifest = JSON.parse(
      await readFile(paths.manifestPath, "utf8"),
    ) as { assessmentSha256: string; coverageSha256: string };
    expect(manifest.assessmentSha256).toBe(await hashFile(paths.assessmentPath));
    expect(manifest.coverageSha256).toBe(await hashFile(coveragePaths.coveragePath));

    const serialized = await readFile(paths.assessmentPath, "utf8");
    expect(serialized).not.toMatch(
      /"fitScore"|"coveragePercentage"|"hiringProbability"|"applicationRecommendation"/,
    );
    expect(serialized).toContain("NO_HIRING_PREDICTION");
  });

  it("surfaces mandatory gaps, limited proof, and preserved ambiguity safely", async () => {
    const fixture = await assessmentWorkspace();
    await buildJobFitProofAssessment(fixture.workspace, fixture.targetId);
    const assessment = await showJobFitProofAssessment(
      fixture.workspace,
      fixture.targetId,
    );

    expect(assessment.risks.some((risk) =>
      risk.code === "CRITICAL_MANDATORY_REQUIREMENT_UNSUPPORTED" ||
      risk.code === "MANDATORY_REQUIREMENT_PARTIAL"
    )).toBe(true);
    expect(assessment.requirementAssessments.every((entry) =>
      entry.assessmentStatement.length > 20
    )).toBe(true);
    expect(assessment.ambiguities
      .filter((entry) => entry.code === "GAP_DOES_NOT_PROVE_CAPABILITY_ABSENT")
      .every((entry) => entry.message.includes("does not establish absence")))
      .toBe(true);
  });

  it("does not rewrite unchanged current artifacts and preserves stable IDs", async () => {
    const fixture = await assessmentWorkspace();
    await buildJobFitProofAssessment(fixture.workspace, fixture.targetId, {
      now: () => new Date(FIRST_TIME),
    });
    const paths = jobFitProofAssessmentPaths(
      fixture.workspace,
      fixture.targetId,
    );
    const before = {
      bytes: await readFile(paths.assessmentPath, "utf8"),
      manifestBytes: await readFile(paths.manifestPath, "utf8"),
      assessmentStat: await stat(paths.assessmentPath),
      manifestStat: await stat(paths.manifestPath),
      value: await showJobFitProofAssessment(fixture.workspace, fixture.targetId),
    };
    const result = await buildJobFitProofAssessment(
      fixture.workspace,
      fixture.targetId,
    );
    const after = await showJobFitProofAssessment(
      fixture.workspace,
      fixture.targetId,
    );

    expect(result.result).toBe("already-current");
    expect(await readFile(paths.assessmentPath, "utf8")).toBe(before.bytes);
    expect(await readFile(paths.manifestPath, "utf8")).toBe(
      before.manifestBytes,
    );
    expect((await stat(paths.assessmentPath)).mtimeMs).toBe(
      before.assessmentStat.mtimeMs,
    );
    expect((await stat(paths.manifestPath)).mtimeMs).toBe(
      before.manifestStat.mtimeMs,
    );
    expect(after.createdAt).toBe(FIRST_TIME);
    expect(after.updatedAt).toBe(FIRST_TIME);
    expect(after.requirementAssessments.map((entry) => entry.id)).toEqual(
      before.value.requirementAssessments.map((entry) => entry.id),
    );
  });

  it("reports missing, current, stale, and invalid lifecycle states", async () => {
    const fixture = await assessmentWorkspace();
    expect((await getJobFitProofAssessmentStatus(
      fixture.workspace,
      fixture.targetId,
    )).status).toBe("missing");
    await buildJobFitProofAssessment(fixture.workspace, fixture.targetId);
    expect(await getJobFitProofAssessmentStatus(
      fixture.workspace,
      fixture.targetId,
    )).toMatchObject({
      status: "current",
      assessmentHashMatches: true,
      coverageStatus: "current",
    });

    const coveragePaths = jobCoveragePaths(fixture.workspace, fixture.targetId);
    await writeFile(
      coveragePaths.coveragePath,
      `${await readFile(coveragePaths.coveragePath, "utf8")} `,
      "utf8",
    );
    expect((await getJobFitProofAssessmentStatus(
      fixture.workspace,
      fixture.targetId,
    )).status).toBe("stale");

    const fresh = await assessmentWorkspace();
    await buildJobFitProofAssessment(fresh.workspace, fresh.targetId);
    const paths = jobFitProofAssessmentPaths(fresh.workspace, fresh.targetId);
    await writeFile(
      paths.assessmentPath,
      `${await readFile(paths.assessmentPath, "utf8")} `,
      "utf8",
    );
    expect((await getJobFitProofAssessmentStatus(
      fresh.workspace,
      fresh.targetId,
    )).status).toBe("invalid");
  });

  it("rejects Role Targets and missing or stale coverage", async () => {
    const workspace = await temporaryWorkspace();
    const role = await createRoleTarget(workspace, {
      title: "Technical Product Manager",
    });
    await expect(
      buildJobFitProofAssessment(workspace, role.target.id),
    ).rejects.toThrow("rejects Role Target");

    const sourcePath = path.join(workspace, "imports", "job.md");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, JOB_DESCRIPTION, "utf8");
    const job = await createJobTarget(workspace, { file: sourcePath });
    await expect(
      buildJobFitProofAssessment(workspace, job.target.id),
    ).rejects.toThrow("requires current Job Requirement Coverage");

    const fixture = await assessmentWorkspace();
    const coveragePaths = jobCoveragePaths(fixture.workspace, fixture.targetId);
    await writeFile(
      coveragePaths.coveragePath,
      `${await readFile(coveragePaths.coveragePath, "utf8")} `,
      "utf8",
    );
    await expect(
      buildJobFitProofAssessment(fixture.workspace, fixture.targetId),
    ).rejects.toThrow("requires current Job Requirement Coverage");
  });
});

function coverageInput(
  overrides: Partial<{
    state: "supported" | "partially-supported" | "unsupported" | "contradicted" | "indeterminate";
    evidenceQuality: "strong" | "adequate" | "limited" | "mixed" | "unavailable";
    necessity: "mandatory" | "preferred" | "contextual" | "ambiguous";
    category: "responsibility" | "technical-expectation";
    warnings: string[];
  }>,
) {
  return {
    state: "supported" as const,
    evidenceQuality: "adequate" as const,
    necessity: "mandatory" as const,
    category: "responsibility" as const,
    warnings: [],
    ...overrides,
  };
}

function assessed(
  assessmentState: "strength" | "supported" | "partial" | "gap" | "contradiction" | "indeterminate",
  proofStrength: "strong" | "adequate" | "limited" | "unavailable" | "conflicting",
  requirementId = "requirement",
) {
  return {
    requirementId,
    necessity: "mandatory" as const,
    assessmentState,
    proofStrength,
  };
}

async function temporaryWorkspace(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "prooflayer-job-assessment-"));
}

async function assessmentWorkspace() {
  const workspace = await temporaryWorkspace();
  const sourcePath = path.join(workspace, "imports", "job.md");
  await mkdir(path.dirname(sourcePath), { recursive: true });
  await writeFile(sourcePath, JOB_DESCRIPTION, "utf8");
  const created = await createJobTarget(workspace, { file: sourcePath });
  await analyzeTarget(workspace, created.target.id, {
    now: () => new Date(FIRST_TIME),
  });
  await buildJobRequirements(workspace, created.target.id, {
    now: () => new Date(FIRST_TIME),
  });
  await writeCandidateKnowledgeBase(workspace);
  await buildJobEvidenceMap(workspace, created.target.id, {
    now: () => new Date(FIRST_TIME),
  });
  await buildJobCoverage(workspace, created.target.id, {
    now: () => new Date(FIRST_TIME),
  });
  return { workspace, targetId: created.target.id };
}

async function writeCandidateKnowledgeBase(workspace: string): Promise<void> {
  const sources: Source[] = [{
    id: "src_public",
    type: "markdown",
    path: "sources/markdown/platform-evidence.md",
    title: "Reviewed evidence",
    importedAt: FIRST_TIME,
    hash: hashText("reviewed source bytes"),
    visibility: "public",
    status: "active",
  }];
  const evidence: EvidenceItem[] = [{
    id: "evi_platform_delivery",
    sourceIds: ["src_public"],
    category: "responsibility",
    text: "Delivered API workflows using TypeScript and Node.js.",
    normalizedSummary: "Delivered API workflows using TypeScript and Node.js.",
    sourceSection: "Professional Experience",
    technologies: ["API", "TypeScript", "Node.js"],
    domains: ["platform"],
    visibility: "public",
    sensitivityFlags: [],
    confidence: "high",
  }];
  const claims: Claim[] = [{
    id: "claim_platform_delivery",
    claim: "Delivered API workflows using TypeScript and Node.js.",
    approvedWording: "Delivered API workflows using TypeScript and Node.js.",
    type: "responsibility_claim",
    supportingEvidenceIds: ["evi_platform_delivery"],
    sourceSection: "Professional Experience",
    extractionConfidence: "high",
    factualConfidence: "high",
    corroborationLevel: "manual_approved",
    approvalStatus: "approved",
    outputReadiness: "resume_ready",
    confidence: "high",
    publicSafe: true,
    needsConfirmation: false,
    metricStatus: "no_metric",
    unsafeWording: [],
  }];
  const kb = path.join(workspace, "kb");
  await mkdir(kb, { recursive: true });
  await writeJsonAtomic(path.join(kb, "sources.json"), sources);
  await writeJsonAtomic(path.join(kb, "evidence-items.json"), evidence);
  await writeJsonAtomic(path.join(kb, "claims.json"), claims);
}
