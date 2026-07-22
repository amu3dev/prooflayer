import { describe, expect, it } from "vitest";
import {
  extractEvidenceFromSource,
  generateClaimsFromEvidence,
  isClaimCandidate
} from "../operations.js";
import { parseMarkdownResume } from "../resume-parser.js";
import type { EvidenceItem, Source } from "../schemas.js";

const resume = `# Ahmed Example

Technical Product Manager | Platform Delivery

## Summary

Technical product leader connecting product discovery, technical tradeoffs, and cross-functional delivery.

## Product & Technical Strengths

- Product discovery, problem framing, and roadmap ownership
- Cross-functional alignment across product, engineering, and business stakeholders

## Technical Fluency

- Product & Delivery Tools: Jira, Linear, Figma, GitHub Projects
- Technical depth: TypeScript, React Native, Expo, Supabase

## Current Product & AI Initiatives

### SB (SignalBoard)
**Product and Technical Lead** | Sep 2025 - Present

- Built and validated AI-assisted product workflows using TypeScript and Supabase.

### InSightARLeans
**Product and Technical Lead**
Mar 2025 - Present

- Iterated on a computer-vision mobile prototype using React Native, Expo, and TensorFlow.js.

### HealthyMeal Advisor
**Product-minded Mobile Builder** | Feb 2025 - May 2025

- Built a consumer mobile MVP around 3 core product flows using React Native and Expo.

## Professional Experience

### Example Platform Company
**Technical Product Manager**
Jun 2023 - Dec 2023 | Remote

- Shaped roadmap priorities and translated platform constraints into delivery decisions.

## Enterprise Engineering Foundation

### Project Leader / Senior Enterprise Java Developer
**HP Enterprise Services and related roles**
Aug 2002 - Dec 2011 | Egypt

- Developed structured enterprise delivery practices in large client environments.

## Education & Certifications

- Bachelor's Degree in Computer Science, Example University
- Diploma in Project Management, Example Institute
- Technical Product Manager Certification, Example Institute
- Meta Product Management Scholarship, Product Manager track
- Sun Certified Java Programmer

## Additional Information

- Languages: Arabic and English
`;

const source: Source = {
  id: "src_resume",
  type: "cv",
  path: "sources/cvs/resume.md",
  title: "resume.md",
  importedAt: "2026-07-13T00:00:00.000Z",
  hash: "resume-hash",
  visibility: "generic_only",
  status: "active",
  extractedTextPath: "kb/extracted-text/src_resume.txt"
};

describe("Markdown resume parsing", () => {
  it("builds a structured resume before evidence extraction", () => {
    const parsed = parseMarkdownResume(resume);

    expect(parsed.summaryParagraphs).toHaveLength(1);
    expect(parsed.skillLines).toHaveLength(2);
    expect(parsed.projects.map((project) => project.name)).toEqual(["SB (SignalBoard)", "InSightARLeans", "HealthyMeal Advisor"]);
    expect(parsed.experiences).toHaveLength(2);
    expect(parsed.experiences[0]).toMatchObject({
      company: "Example Platform Company",
      role: "Technical Product Manager",
      dateRange: "Jun 2023 - Dec 2023"
    });
  });

  it("does not create role evidence from headings, names, or date-only lines", () => {
    const evidence = extractEvidenceFromSource(source, resume);
    const roles = evidence.filter((item) => item.category === "role");

    expect(roles).toHaveLength(2);
    expect(roles.every((item) => item.company && item.dateRange)).toBe(true);
    expect(roles.some((item) => item.text === "Jun 2023 - Dec 2023 | Remote")).toBe(false);
    expect(evidence.some((item) => item.text === "Ahmed Example")).toBe(false);
    expect(evidence.some((item) => item.text === "Professional Experience")).toBe(false);
  });

  it("keeps repeated consulting periods when title and company are the same", () => {
    const repeatedRoleResume = resume.replace(
      "## Enterprise Engineering Foundation",
      `### Example Platform Company
**Technical Product Manager**
Jan 2020 - Dec 2020 | Remote

- Prioritized an earlier platform roadmap and coordinated delivery decisions.

## Enterprise Engineering Foundation`
    );
    const roles = extractEvidenceFromSource(source, repeatedRoleResume)
      .filter((item) => item.category === "role" && item.company === "Example Platform Company");
    const evidence = extractEvidenceFromSource(source, repeatedRoleResume);
    const currentBullet = evidence.find((item) => item.text.startsWith("Shaped roadmap priorities"));
    const earlierBullet = evidence.find((item) => item.text.startsWith("Prioritized an earlier platform roadmap"));

    expect(roles).toHaveLength(2);
    expect(new Set(roles.map((item) => item.id)).size).toBe(2);
    expect(currentBullet?.parentRoleId).toBe(roles.find((role) => role.dateRange === "Jun 2023 - Dec 2023")?.id);
    expect(earlierBullet?.parentRoleId).toBe(roles.find((role) => role.dateRange === "Jan 2020 - Dec 2020")?.id);
    expect(currentBullet?.parentRoleId).not.toBe(earlierBullet?.parentRoleId);
  });

  it("extracts projects only from structured initiative entries", () => {
    const evidence = extractEvidenceFromSource(source, resume);
    const projects = evidence.filter((item) => item.category === "project");

    expect(projects.map((item) => item.project)).toEqual(["SB (SignalBoard)", "InSightARLeans", "HealthyMeal Advisor"]);
    expect(projects.every((item) => !item.text.endsWith("..."))).toBe(true);
    expect(projects.every((item) => item.sourceSection === "Current Product & AI Initiatives")).toBe(true);
  });

  it("links skills only to evidence where each skill is mentioned", () => {
    const evidence = extractEvidenceFromSource(source, resume);
    const jiraEvidence = evidence.filter((item) => item.technologies?.includes("Jira"));
    const typeScriptEvidence = evidence.filter((item) => item.technologies?.includes("TypeScript"));
    const inSightEvidence = evidence.find((item) => item.text.startsWith("Iterated on a computer-vision"));
    const toolsEvidence = evidence.find((item) => item.text.startsWith("Product & Delivery Tools"));

    expect(jiraEvidence).toHaveLength(1);
    expect(jiraEvidence[0].text).toContain("Jira");
    expect(typeScriptEvidence.length).toBeGreaterThan(1);
    expect(typeScriptEvidence.every((item) => item.text.includes("TypeScript"))).toBe(true);
    expect(inSightEvidence?.technologies).toContain("React Native");
    expect(inSightEvidence?.technologies).not.toContain("React");
    expect(toolsEvidence?.technologies).toContain("GitHub Projects");
    expect(toolsEvidence?.technologies).not.toContain("GitHub");
  });

  it("excludes headings and sends generic-only resume claims to confirmation", () => {
    const evidence = extractEvidenceFromSource(source, resume);
    const claims = generateClaimsFromEvidence(evidence);
    const approved = claims.filter((claim) => claim.approvalStatus === "approved");

    expect(claims.some((claim) => claim.claim === "Professional Experience.")).toBe(false);
    expect(approved).toHaveLength(0);
    expect(claims.every((claim) => claim.approvalStatus === "needs_confirmation")).toBe(true);
    expect(claims.every((claim) => claim.outputReadiness === "generic_only")).toBe(true);
    expect(claims.every((claim) => !claim.publicSafe)).toBe(true);
    expect(claims.filter((claim) => claim.type === "project_claim").map((claim) => claim.claim)).toEqual(expect.arrayContaining([
      expect.stringContaining("SB (SignalBoard)"),
      expect.stringContaining("InSightARLeans"),
      expect.stringContaining("HealthyMeal Advisor")
    ]));
  });

  it("extracts education and certification variants", () => {
    const evidence = extractEvidenceFromSource(source, resume);
    const claims = generateClaimsFromEvidence(evidence);
    const certifications = evidence.filter((item) => item.category === "certification").map((item) => item.text);
    const education = evidence.filter((item) => item.category === "education").map((item) => item.text);

    expect(certifications).toEqual(expect.arrayContaining([
      "Technical Product Manager Certification, Example Institute",
      "Meta Product Management Scholarship, Product Manager track",
      "Sun Certified Java Programmer"
    ]));
    expect(education).toEqual(expect.arrayContaining([
      "Bachelor's Degree in Computer Science, Example University",
      "Diploma in Project Management, Example Institute"
    ]));
    expect(claims.filter((claim) => claim.type === "certification_claim").map((claim) => claim.claim)).toEqual(expect.arrayContaining([
      "Technical Product Manager Certification, Example Institute.",
      "Meta Product Management Scholarship, Product Manager track.",
      "Sun Certified Java Programmer."
    ]));
  });

  it("requires confirmation for generic competencies", () => {
    const claims = generateClaimsFromEvidence(extractEvidenceFromSource(source, resume));
    const competency = claims.find((claim) => claim.claim.startsWith("Product discovery, problem framing"));

    expect(competency).toMatchObject({
      type: "competency_claim",
      factualConfidence: "medium",
      approvalStatus: "needs_confirmation",
      outputReadiness: "generic_only",
      publicSafe: false
    });
  });

  it("requires multi-source or manual approval for broad summaries", () => {
    const publicSource = { ...source, id: "src_public_1", visibility: "public" as const };
    const secondPublicSource = { ...source, id: "src_public_2", visibility: "public" as const };
    const firstEvidence = extractEvidenceFromSource(publicSource, resume);
    const summaryText = "Technical product leader connecting product discovery, technical tradeoffs, and cross-functional delivery.";
    const singleSourceClaim = generateClaimsFromEvidence(firstEvidence).find((claim) => claim.claim.startsWith(summaryText));
    const summaryEvidenceFromTwoSources = [
      ...firstEvidence.filter((item) => item.sourceSection === "Summary"),
      ...extractEvidenceFromSource(secondPublicSource, resume).filter((item) => item.sourceSection === "Summary")
    ];
    const corroboratedClaim = generateClaimsFromEvidence(summaryEvidenceFromTwoSources)[0];

    expect(singleSourceClaim?.approvalStatus).toBe("needs_confirmation");
    expect(corroboratedClaim).toMatchObject({
      corroborationLevel: "multi_source",
      approvalStatus: "approved",
      outputReadiness: "resume_ready",
      publicSafe: true
    });
  });

  it("uses structural metrics only when explicitly stated", () => {
    const claims = generateClaimsFromEvidence(extractEvidenceFromSource(source, resume));
    const structural = claims.find((claim) => claim.claim.includes("3 core product flows"));
    const publicEvidence: EvidenceItem = {
      id: "evi_unverified_impact",
      sourceIds: ["src_public"],
      category: "achievement",
      text: "Improved user adoption across the product.",
      normalizedSummary: "Improved user adoption across the product.",
      visibility: "public",
      sensitivityFlags: [],
      confidence: "high"
    };
    const impact = generateClaimsFromEvidence([publicEvidence])[0];

    expect(structural?.metricStatus).toBe("structural_metric");
    expect(impact).toMatchObject({
      metricStatus: "needs_metric",
      approvalStatus: "needs_confirmation"
    });
  });

  it("keeps identical claim text separate across different parent projects", () => {
    const projectA = contextualEvidence({
      id: "evi_project_a",
      sourceIds: ["src_project_a"],
      parentProjectId: "evi_parent_project_a",
      project: "Project A"
    });
    const projectB = contextualEvidence({
      id: "evi_project_b",
      sourceIds: ["src_project_b"],
      parentProjectId: "evi_parent_project_b",
      project: "Project B"
    });
    const legacyClaim = generateClaimsFromEvidence([projectA])[0];
    const claims = generateClaimsFromEvidence([projectB, projectA], [legacyClaim]);

    expect(claims).toHaveLength(2);
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(2);
    expect(claims.map((claim) => claim.parentProjectId).sort()).toEqual([
      "evi_parent_project_a",
      "evi_parent_project_b"
    ]);
    expect(claims.find((claim) => claim.parentProjectId === "evi_parent_project_a")?.id).toBe(legacyClaim.id);
  });

  it("groups identical claim text within the same parent context", () => {
    const first = contextualEvidence({
      id: "evi_same_context_1",
      sourceIds: ["src_one"],
      parentProjectId: "evi_shared_project"
    });
    const second = contextualEvidence({
      id: "evi_same_context_2",
      sourceIds: ["src_two"],
      parentProjectId: "evi_shared_project"
    });
    const claims = generateClaimsFromEvidence([first, second]);

    expect(claims).toHaveLength(1);
    expect(claims[0].parentProjectId).toBe("evi_shared_project");
    expect(claims[0].supportingEvidenceIds).toEqual(["evi_same_context_1", "evi_same_context_2"]);
  });

  it("groups identical text under equivalent project entities from repeated sources", () => {
    const parentA = contextualEvidence({
      id: "evi_parent_alias_a",
      sourceIds: ["src_alias_a"],
      category: "project",
      text: "SB (SignalBoard) product initiative",
      normalizedSummary: "SB (SignalBoard) product initiative.",
      project: "SB (SignalBoard)",
      parentProjectId: undefined,
      dateRange: "2025 - Present"
    });
    const parentB = contextualEvidence({
      id: "evi_parent_alias_b",
      sourceIds: ["src_alias_b"],
      category: "project",
      text: "SignalBoard product initiative",
      normalizedSummary: "SignalBoard product initiative.",
      project: "SignalBoard",
      parentProjectId: undefined,
      dateRange: "2025 - Present"
    });
    const first = contextualEvidence({
      id: "evi_alias_child_a",
      sourceIds: ["src_alias_a"],
      parentProjectId: parentA.id
    });
    const second = contextualEvidence({
      id: "evi_alias_child_b",
      sourceIds: ["src_alias_b"],
      parentProjectId: parentB.id
    });
    const matchingClaims = generateClaimsFromEvidence([parentA, parentB, first, second])
      .filter((claim) => claim.claim === first.normalizedSummary);

    expect(matchingClaims).toHaveLength(1);
    expect(matchingClaims[0].supportingEvidenceIds).toEqual(["evi_alias_child_a", "evi_alias_child_b"]);
  });
});

describe("claim filtering", () => {
  it("rejects date-only and generic heading evidence", () => {
    const base: EvidenceItem = {
      id: "evi_test",
      sourceIds: [source.id],
      category: "responsibility",
      text: "Professional Experience",
      normalizedSummary: "Professional Experience.",
      technologies: [],
      domains: [],
      visibility: "generic_only",
      sensitivityFlags: [],
      confidence: "high"
    };

    expect(isClaimCandidate(base)).toBe(false);
    expect(isClaimCandidate({ ...base, text: "Jun 2023 - Dec 2023 | Remote", normalizedSummary: "Jun 2023 - Dec 2023 | Remote." })).toBe(false);
  });
});

function contextualEvidence(overrides: Partial<EvidenceItem>): EvidenceItem {
  return {
    id: "evi_context",
    sourceIds: ["src_context"],
    category: "responsibility",
    text: "Shaped roadmap priorities and coordinated platform delivery decisions.",
    normalizedSummary: "Shaped roadmap priorities and coordinated platform delivery decisions.",
    project: "Example Project",
    parentProjectId: "evi_parent_project",
    sourceSection: "Current Product & AI Initiatives",
    technologies: [],
    domains: ["platform"],
    visibility: "public",
    sensitivityFlags: [],
    confidence: "high",
    ...overrides
  };
}
