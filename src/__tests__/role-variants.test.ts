import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createRefreshBaseline, type KnowledgeState } from "../change-detector.js";
import { ROLE_KEYS, ROLE_VARIANTS, getRoleVariant } from "../role-variants.js";
import {
  generateRoleVariant,
  listVariantStatuses,
  rankClaimsForVariant,
  selectClaimsForVariant,
  type OutputManifest,
  type VariantGenerationManifest
} from "../variant-generator.js";
import type { CareerProfile, Claim, EvidenceItem, Source } from "../schemas.js";

describe("Slice 1.4 role variants", () => {
  it("defines all supported role variants", () => {
    expect(ROLE_KEYS).toEqual(["tpm", "ai-product", "fullstack", "fractional-cto"]);
    for (const roleKey of ROLE_KEYS) {
      const variant = ROLE_VARIANTS[roleKey];
      expect(variant.roleKey).toBe(roleKey);
      expect(variant.headline.length).toBeGreaterThan(20);
      expect(variant.positioningPriorities.length).toBeGreaterThan(3);
    }
  });

  it.each([
    ["tpm", "Owned product discovery, roadmap prioritization, stakeholder alignment, and platform delivery.", "Implemented internal Java utility code."],
    ["ai-product", "Built AI-assisted workflows with evaluation scenarios, product validation, and evidence-backed decision support.", "Maintained legacy enterprise Java code."],
    ["fullstack", "Implemented TypeScript, React, Node.js, API, Docker, and CI/CD product workflows.", "Advised broadly on product strategy."],
    ["fractional-cto", "Led CTO advisory work across architecture, roadmap scope tradeoffs, delivery risk, and platform decisions.", "Implemented a small isolated UI component."]
  ] as const)("prioritizes %s-specific evidence", (roleKey, preferredText, secondaryText) => {
    const preferred = claimFixture({ id: "preferred", claim: preferredText });
    const secondary = claimFixture({ id: "secondary", claim: secondaryText });
    const ranked = rankClaimsForVariant(getRoleVariant(roleKey), [secondary, preferred]);
    expect(ranked[0].claim.id).toBe("preferred");
  });

  it("excludes blocked and do-not-use claims", () => {
    const evidence = [evidenceFixture()];
    const blocked = claimFixture({ id: "blocked", approvalStatus: "blocked", outputReadiness: "do_not_use", publicSafe: false });
    const usable = claimFixture({ id: "usable", claim: "Supported platform product discovery and roadmap planning." });
    const selected = selectClaimsForVariant(getRoleVariant("tpm"), [blocked, usable], evidence);
    expect(selected.map((item) => item.claim.id)).toContain("usable");
    expect(selected.map((item) => item.claim.id)).not.toContain("blocked");
  });

  it("generates warned one-column drafts and complete manifests without invented metrics", async () => {
    const workspace = await createGenerationWorkspace();
    const manifest = await generateRoleVariant(workspace, "tpm", new Date("2026-07-15T16:00:00.000Z"));
    const variantRoot = path.join(workspace, "outputs/variants/tpm");
    const markdownFiles = ["resume-draft.md", "website-copy-draft.md", "variant-summary.md", "unresolved-claims.md"];

    for (const file of markdownFiles) {
      const content = await readFile(path.join(variantRoot, file), "utf8");
      expect(content).toContain("Draft generated from non-blocked evidence.");
      expect(content).toContain("Final/public output requires human review.");
      expect(content).not.toMatch(/^\s*\|/m);
      expect(content).not.toMatch(/\|\s*:?-{3,}/);
      expect(content).not.toContain("500 users");
    }

    const resume = await readFile(path.join(variantRoot, "resume-draft.md"), "utf8");
    const website = await readFile(path.join(variantRoot, "website-copy-draft.md"), "utf8");
    const unresolved = await readFile(path.join(variantRoot, "unresolved-claims.md"), "utf8");
    for (const content of [resume, website]) {
      const normalizedContent = content.toLowerCase();
      expect(normalizedContent).not.toContain("evidence supports");
      expect(normalizedContent).not.toContain("role-relevant");
      expect(normalizedContent).not.toContain("aligned with the target position");
      expect(normalizedContent).not.toContain("project candidate");
    }
    expect(resume).toContain("Built and validated AI-assisted product workflows");
    expect(website).toContain("Built and validated AI-assisted product workflows");
    expect(resume).toContain("Project evidence is present, but role-specific public wording needs review.");
    expect(unresolved).toContain("# Unresolved Claims");
    expect(unresolved).toContain("claim_ai");
    expect(unresolved).toContain("## Purpose");
    expect(unresolved).toContain("## Next Action");
    expect(unresolved).toContain("SignalBoard project evidence.");
    expect(unresolved.indexOf("Built AI-assisted workflows with evaluation scenarios and product validation."))
      .toBeLessThan(unresolved.indexOf("claim_ai"));
    expect(unresolved.indexOf("SignalBoard project evidence."))
      .toBeLessThan(unresolved.indexOf("evi_ai"));

    expect(manifest.profileFingerprint).toBeTruthy();
    expect(manifest.claimIdsUsed.length).toBeGreaterThan(0);
    expect(manifest.claimIdsUsed).not.toContain("claim_blocked_metric");
    expect(manifest.draft).toBe(true);
    const persisted = JSON.parse(await readFile(path.join(variantRoot, "generation-manifest.json"), "utf8")) as VariantGenerationManifest;
    expect(persisted.profileFingerprint).toBe(manifest.profileFingerprint);
    expect(persisted.generatedFiles).toContain("outputs/variants/tpm/resume-draft.md");

    const registry = JSON.parse(await readFile(path.join(workspace, "outputs/output-manifest.json"), "utf8")) as OutputManifest;
    expect(registry.outputs).toHaveLength(1);
    expect(registry.outputs[0].variantRoleKey).toBe("tpm");
    expect(registry.outputs[0].claimIdsUsed).toEqual(manifest.claimIdsUsed);
  });

  it("marks generated variants stale when the profile fingerprint changes", async () => {
    const workspace = await createGenerationWorkspace();
    await generateRoleVariant(workspace, "tpm", new Date("2026-07-15T16:00:00.000Z"));
    const baselinePath = path.join(workspace, "kb/update-baseline.json");
    const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
    baseline.profileFingerprint = "new-profile-fingerprint";
    await writeFile(baselinePath, JSON.stringify(baseline), "utf8");

    const statuses = await listVariantStatuses(workspace);
    expect(statuses.find((status) => status.roleKey === "tpm")?.draft.freshness).toBe("stale");
    const registry = JSON.parse(await readFile(path.join(workspace, "outputs/output-manifest.json"), "utf8")) as OutputManifest;
    expect(registry.outputs[0].freshness).toBe("stale");
  });
});

async function createGenerationWorkspace(): Promise<string> {
  const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-variants-"));
  const sources = [sourceFixture()];
  const evidence = [
    evidenceFixture(),
    evidenceFixture({ id: "evi_ai", category: "project", text: "SignalBoard", normalizedSummary: "SignalBoard project evidence.", project: "SB (SignalBoard)", technologies: ["AI", "TypeScript", "Supabase"], domains: ["AI"] }),
    evidenceFixture({ id: "evi_tech", category: "skill", text: "TypeScript React Node.js API Docker", normalizedSummary: "Technical implementation evidence.", technologies: ["TypeScript", "React", "Node.js", "API", "Docker"] }),
    evidenceFixture({ id: "evi_cto", text: "CTO leadership and architecture delivery", normalizedSummary: "CTO leadership evidence.", company: "Example Studio" }),
    evidenceFixture({ id: "evi_sparse", category: "project", text: "Sparse Project", normalizedSummary: "Sparse Project evidence.", project: "Sparse Project", technologies: ["TypeScript"], domains: ["platform"] })
  ];
  const claims = [
    claimFixture({ id: "claim_tpm", claim: "Led product discovery, roadmap prioritization, stakeholder alignment, and platform delivery." }),
    claimFixture({ id: "claim_ai", claim: "Built AI-assisted workflows with evaluation scenarios and product validation.", type: "project_claim", supportingEvidenceIds: ["evi_ai"] }),
    claimFixture({ id: "claim_tech", claim: "Implemented TypeScript, React, Node.js, API, and Docker product workflows.", type: "skill_claim", supportingEvidenceIds: ["evi_tech"] }),
    claimFixture({ id: "claim_cto", claim: "Led CTO architecture, roadmap, scope tradeoff, and delivery-risk decisions.", supportingEvidenceIds: ["evi_cto"] }),
    claimFixture({ id: "claim_education", claim: "Bachelor’s Degree in Computer Science.", type: "education_claim" }),
    claimFixture({ id: "claim_blocked_metric", claim: "Delivered growth to 500 users.", approvalStatus: "blocked", outputReadiness: "do_not_use", publicSafe: false, metricStatus: "needs_metric" })
  ];
  const profile = profileFixture(evidence, claims);
  const state: KnowledgeState = { sources, evidenceItems: evidence, claims, profile, privacyFindings: [] };
  const baseline = createRefreshBaseline(state, "2026-07-15T15:00:00.000Z");
  await mkdir(path.join(workspace, "kb"), { recursive: true });
  await mkdir(path.join(workspace, "outputs/changelogs"), { recursive: true });
  await writeFile(path.join(workspace, "kb/career-profile.json"), JSON.stringify(profile), "utf8");
  await writeFile(path.join(workspace, "kb/claims.json"), JSON.stringify(claims), "utf8");
  await writeFile(path.join(workspace, "kb/evidence-items.json"), JSON.stringify(evidence), "utf8");
  await writeFile(path.join(workspace, "kb/update-baseline.json"), JSON.stringify(baseline), "utf8");
  return workspace;
}

function sourceFixture(): Source {
  return {
    id: "src_1",
    type: "cv",
    path: "sources/cvs/resume.md",
    title: "resume.md",
    importedAt: "2026-07-15T15:00:00.000Z",
    hash: "hash",
    visibility: "generic_only",
    status: "active",
    extractedTextPath: "kb/extracted-text/src_1.txt"
  };
}

function evidenceFixture(overrides: Partial<EvidenceItem> = {}): EvidenceItem {
  return {
    id: "evi_1",
    sourceIds: ["src_1"],
    category: "responsibility",
    text: "Product discovery and platform delivery evidence.",
    normalizedSummary: "Product discovery and platform delivery evidence.",
    company: "Example Company",
    sourceSection: "Professional Experience",
    technologies: ["API"],
    domains: ["platform"],
    visibility: "generic_only",
    sensitivityFlags: [],
    confidence: "high",
    ...overrides
  };
}

function claimFixture(overrides: Partial<Claim> = {}): Claim {
  return {
    id: "claim_1",
    claim: "Supported product discovery and platform delivery.",
    type: "responsibility_claim",
    supportingEvidenceIds: ["evi_1"],
    sourceSection: "Professional Experience",
    extractionConfidence: "high",
    factualConfidence: "medium",
    corroborationLevel: "single_source",
    approvalStatus: "needs_confirmation",
    outputReadiness: "generic_only",
    confidence: "medium",
    publicSafe: false,
    needsConfirmation: true,
    metricStatus: "no_metric",
    unsafeWording: [],
    ...overrides
  };
}

function profileFixture(evidence: EvidenceItem[], claims: Claim[]): CareerProfile {
  return {
    id: "career_profile",
    updatedAt: "2026-07-15T15:00:00.000Z",
    positioningCandidates: ["Technical Product Manager", "AI Product Manager"],
    summaryThemes: ["Platform delivery", "AI product validation"],
    roles: [{ title: "Technical Product Lead", company: "Example Company", dateRange: "2022 - Present", evidenceIds: ["evi_1", "evi_cto"] }],
    projects: [
      { name: "SB (SignalBoard)", technologies: ["AI", "TypeScript", "Supabase"], domains: ["AI"], evidenceIds: ["evi_ai"] },
      { name: "Sparse Project", technologies: ["TypeScript"], domains: ["platform"], evidenceIds: ["evi_sparse"] }
    ],
    skills: [
      { name: "TypeScript", evidenceIds: ["evi_tech"] },
      { name: "React", evidenceIds: ["evi_tech"] },
      { name: "Node.js", evidenceIds: ["evi_tech"] },
      { name: "API", evidenceIds: ["evi_1", "evi_tech"] }
    ],
    domains: ["AI", "platform"],
    approvedClaims: [],
    claimsNeedingConfirmation: claims.filter((claim) => claim.approvalStatus === "needs_confirmation").map((claim) => claim.claim),
    blockedClaims: claims.filter((claim) => claim.approvalStatus === "blocked").map((claim) => claim.claim),
    resumeReadyClaims: [],
    genericOnlyClaims: claims.filter((claim) => claim.outputReadiness === "generic_only").map((claim) => claim.claim),
    internalOnlyClaims: [],
    publicSafetyRules: []
  };
}
