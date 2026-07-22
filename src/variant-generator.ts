import path from "node:path";
import { hashFile, pathExists, readJson, stableId, uniqueSorted, writeJsonAtomic, writeText } from "./fs-utils.js";
import { ROLE_KEYS, getRoleVariant, type RoleKey, type RoleVariantDefinition } from "./role-variants.js";
import { normalizeProjectIdentity } from "./entity-normalization.js";
import { inspectResumeExportStatus } from "./resume-export.js";
import type { RefreshBaseline } from "./change-detector.js";
import type { LatestRefresh } from "./update-impact.js";
import type { CareerProfile, Claim, EvidenceItem, Visibility } from "./schemas.js";

export const VARIANTS_ROOT = "outputs/variants";
export const OUTPUT_MANIFEST_FILE = "outputs/output-manifest.json";
const DRAFT_WARNINGS = [
  "Draft generated from non-blocked evidence.",
  "Some claims may need confirmation before public use.",
  "No unsupported metrics should be invented or added.",
  "Final/public output requires human review."
];

export type RankedClaim = { claim: Claim; score: number };

export type VariantGenerationManifest = {
  schemaVersion: 1;
  outputId: string;
  roleKey: RoleKey;
  displayName: string;
  generatedAt: string;
  profileFingerprint: string;
  latestRefreshId?: string;
  generatedFiles: string[];
  claimIdsUsed: string[];
  evidenceIdsUsed: string[];
  countsByApprovalStatus: Record<Claim["approvalStatus"], number>;
  countsByOutputReadiness: Record<Claim["outputReadiness"], number>;
  warnings: string[];
  draft: true;
  publicationStatus: "draft";
  freshness: "current" | "stale";
};

export type OutputManifestEntry = {
  id: string;
  variantRoleKey: RoleKey;
  generatedFiles: string[];
  generatedAt: string;
  profileFingerprint: string;
  claimIdsUsed: string[];
  evidenceIdsUsed: string[];
  publicationStatus: "draft" | "final" | "export";
  freshness: "current" | "stale";
  sourceMarkdownPath?: string;
  sourceMarkdownHash?: string;
  sourceArtifactId?: string;
};

export type OutputManifest = {
  schemaVersion: 1;
  updatedAt: string;
  outputs: OutputManifestEntry[];
};

export type VariantStatus = {
  roleKey: RoleKey;
  displayName: string;
  draft: VariantOutputState;
  final: VariantOutputState & { readiness?: "ready" | "not_ready" };
  export: VariantOutputState;
};

export type VariantOutputState = {
  generated: boolean;
  freshness: "current" | "stale" | "not_generated";
  generatedAt?: string;
  path: string;
};

type GenerationContext = {
  profile: CareerProfile;
  claims: Claim[];
  evidence: EvidenceItem[];
  evidenceById: Map<string, EvidenceItem>;
  baseline: RefreshBaseline;
  latest: LatestRefresh | null;
};

type DraftSelections = {
  rankedClaims: RankedClaim[];
  roles: CareerProfile["roles"];
  projects: CareerProfile["projects"];
  skills: CareerProfile["skills"];
  educationClaims: Claim[];
};

export async function generateRoleVariant(
  workspace: string,
  roleKey: RoleKey,
  now = new Date()
): Promise<VariantGenerationManifest> {
  const context = await loadGenerationContext(workspace);
  const variant = getRoleVariant(roleKey);
  const selected = buildSelections(variant, context);
  const usedClaimIds = new Set<string>();
  const usedEvidenceIds = new Set<string>();
  const outputDirectory = `${VARIANTS_ROOT}/${roleKey}`;
  const files = {
    resume: `${outputDirectory}/resume-draft.md`,
    website: `${outputDirectory}/website-copy-draft.md`,
    summary: `${outputDirectory}/variant-summary.md`,
    unresolved: `${outputDirectory}/unresolved-claims.md`,
    manifest: `${outputDirectory}/generation-manifest.json`
  };

  const resume = renderResumeDraft(variant, selected, context, usedClaimIds, usedEvidenceIds);
  const website = renderWebsiteDraft(variant, selected, context, usedClaimIds, usedEvidenceIds);
  const unresolvedClaims = selected.rankedClaims
    .map(({ claim }) => claim)
    .filter((claim) => usedClaimIds.has(claim.id) && (claim.approvalStatus !== "approved" || claim.outputReadiness !== "resume_ready"));
  const unresolved = renderUnresolvedClaims(unresolvedClaims, context.evidenceById);
  const summary = renderVariantSummary(variant, selected, unresolvedClaims);

  await writeText(path.join(workspace, files.resume), resume);
  await writeText(path.join(workspace, files.website), website);
  await writeText(path.join(workspace, files.summary), summary);
  await writeText(path.join(workspace, files.unresolved), unresolved);

  for (const role of selected.roles) role.evidenceIds.forEach((id) => usedEvidenceIds.add(id));
  for (const project of selected.projects) project.evidenceIds.forEach((id) => usedEvidenceIds.add(id));
  for (const skill of selected.skills) skill.evidenceIds.forEach((id) => usedEvidenceIds.add(id));
  for (const claimId of usedClaimIds) {
    context.claims.find((claim) => claim.id === claimId)?.supportingEvidenceIds.forEach((id) => usedEvidenceIds.add(id));
  }

  const usedClaims = context.claims.filter((claim) => usedClaimIds.has(claim.id));
  const generatedAt = now.toISOString();
  const generatedFiles = Object.values(files);
  const manifest: VariantGenerationManifest = {
    schemaVersion: 1,
    outputId: `role_variant_${roleKey}`,
    roleKey,
    displayName: variant.displayName,
    generatedAt,
    profileFingerprint: context.baseline.profileFingerprint,
    latestRefreshId: context.latest?.refreshId,
    generatedFiles,
    claimIdsUsed: uniqueSorted([...usedClaimIds]),
    evidenceIdsUsed: uniqueSorted([...usedEvidenceIds]),
    countsByApprovalStatus: countByApprovalStatus(usedClaims),
    countsByOutputReadiness: countByOutputReadiness(usedClaims),
    warnings: [...DRAFT_WARNINGS],
    draft: true,
    publicationStatus: "draft",
    freshness: "current"
  };
  await writeJsonAtomic(path.join(workspace, files.manifest), manifest);
  await registerOutput(workspace, manifest);
  return manifest;
}

export async function generateAllRoleVariants(workspace: string): Promise<VariantGenerationManifest[]> {
  const manifests: VariantGenerationManifest[] = [];
  for (const roleKey of ROLE_KEYS) manifests.push(await generateRoleVariant(workspace, roleKey));
  return manifests;
}

export function selectClaimsForVariant(
  variant: RoleVariantDefinition,
  claims: Claim[],
  evidence: EvidenceItem[],
  limit = 28
): RankedClaim[] {
  const evidenceById = new Map(evidence.map((item) => [item.id, item]));
  return rankClaimsForVariant(variant, claims)
    .filter(({ claim }) => isClaimUsableInDraft(claim, evidenceById))
    .filter(({ score }) => score > 0)
    .slice(0, limit);
}

export function rankClaimsForVariant(variant: RoleVariantDefinition, claims: Claim[]): RankedClaim[] {
  return claims.map((claim) => ({ claim, score: scoreClaim(variant, claim) }))
    .sort((a, b) => b.score - a.score || a.claim.id.localeCompare(b.claim.id));
}

export function generalizeClaimForDraft(
  claim: Claim,
  supportingEvidence: EvidenceItem[],
  variant: RoleVariantDefinition
): string {
  if (claim.approvalStatus === "approved" && claim.outputReadiness === "resume_ready" && claim.approvedWording) {
    return claim.approvedWording;
  }

  const text = claim.claim.toLowerCase();
  const technologies = uniqueSorted(supportingEvidence.flatMap((item) => item.technologies ?? []));
  if (claim.type === "education_claim") return "Computer science and project-management education evidence is recorded and requires final wording review.";
  if (claim.type === "certification_claim") return "Relevant product-management or engineering certification evidence is recorded and requires final wording review.";
  if (claim.type === "skill_claim" && /\b(tools?|jira|linear|trello|notion|figma|analytics|sheets|slack|confluence)\b/.test(text)) {
    return "Used evidence-linked product and delivery tools across planning, collaboration, analytics, and technical workflows.";
  }
  if (/\bmarket-signal intelligence|signal extraction|repeatable insight workflows\b/.test(text)) {
    return "Led an AI-assisted market-intelligence initiative focused on signal extraction and repeatable decision-support workflows.";
  }
  if (/\baction provenance\b/.test(text)) {
    return "Built action-provenance checks to improve traceability of AI-generated recommendations.";
  }
  if (/\bevaluation scenarios\b/.test(text) && /\bbriefings|source signals\b/.test(text)) {
    return "Added evaluation scenarios to validate whether generated briefings were supported by source signals.";
  }
  if (/\bapp-layer experience\b/.test(text) && /\bbackend|data configuration\b/.test(text)) {
    return "Designed AI-assisted workflows connecting app experience, backend and data configuration, technical evaluation, and product validation.";
  }
  if (/\bproblem framing\b/.test(text) && /\bexperiment design\b/.test(text)) {
    return "Shaped product direction from problem framing and roadmap priorities through experiment design and hands-on implementation.";
  }
  if (/\bmarket and competitive intelligence product experiment\b/.test(text)) {
    return "Built and iterated an AI-assisted market and competitive-intelligence product experiment.";
  }
  if (/\bcamera flows\b/.test(text) && /\boverlay ux\b/.test(text)) {
    return "Worked through product and technical tradeoffs across camera flows, overlay UX, responsiveness, and mobile interaction design.";
  }
  if (/\bcomputer-vision mobile prototype\b/.test(text)) {
    return "Built and iterated a React Native and Expo computer-vision prototype using TensorFlow.js for object detection and contextual overlays.";
  }
  if (/\bqualitative feedback\b/.test(text) && /\bai\/mobile experience\b/.test(text)) {
    return "Validated the AI and mobile experience through iterative testing and qualitative feedback.";
  }
  if (/\bcore user flows\b/.test(text) && /\bnavigation\b/.test(text)) {
    return "Shaped core user flows and simplified navigation through early usability iteration.";
  }
  if (/\bmeal suggestions\b/.test(text) && /\brecipe exploration\b/.test(text)) {
    return "Built a React Native and Expo mobile MVP covering meal suggestions, macro-aware browsing, and recipe exploration.";
  }
  if (/\bstructured workflow\b/.test(text) && /\bold cvs|github repositories|linkedin evidence\b/.test(text)) {
    return "Built a structured career-evidence workflow spanning CVs, GitHub, LinkedIn, recommendations, and market-fit review.";
  }
  if (/\brecruiter-facing\b/.test(text) && /\bats-focused\b/.test(text)) {
    return "Produced recruiter-facing and ATS-focused resume variants from one evidence base.";
  }
  if (/\bpublic evidence-backed resume workflow write-up\b/.test(text)) {
    return "Created a public write-up and portfolio materials explaining the evidence-backed resume workflow.";
  }
  if (/\bcareer intelligence and resume evidence experiment\b/.test(text)) {
    return "Built a personal career-intelligence experiment that separates evidence collection from resume generation.";
  }
  if (/\bseparate evidence collection\b/.test(text) && /\bclaim safety\b/.test(text)) {
    return "Structured the workflow around evidence collection, claim safety, role positioning, and final output review.";
  }
  if (/\b(ai|signal|evaluation|computer-vision|tensorflow|evidence-backed)\b/.test(text)) {
    return "Built and validated AI-assisted product workflows with attention to technical evaluation, traceability, and product usefulness.";
  }
  if (/\b(discovery|problem framing|requirements workshop|solution framing)\b/.test(text)) {
    return "Supported product discovery, problem framing, and scope definition before delivery decisions were made.";
  }
  if (/\b(roadmap|prioriti|backlog|release plan|delivery planning|sequencing)\b/.test(text)) {
    return "Connected roadmap shaping, prioritization, and delivery planning with technical execution constraints.";
  }
  if (/\b(stakeholder|cross-functional|product, design|business goals)\b/.test(text)) {
    return "Aligned product, engineering, design, and business perspectives around scoped delivery decisions.";
  }
  if (/\b(cto|technology leadership|technical direction|architecture|scope tradeoff|delivery risk)\b/.test(text)) {
    return "Led product and technology decisions across scope, architecture, delivery risk, and execution planning.";
  }
  if (/\b(platform|api|saas|auth|reporting|payments|deployment|infrastructure)\b/.test(text)) {
    return "Supported multi-surface platform delivery across API-aware, web, operational, and deployment workflows.";
  }
  if (/\b(typescript|react|node|vue|java|spring|docker|ci\/cd|supabase|implementation|developer)\b/.test(text)) {
    const relevant = technologies.filter((technology) => variant.preferredSkillsTools.includes(technology)).slice(0, 6);
    return relevant.length > 0
      ? `Implemented product-facing web, mobile, or platform workflows using ${formatInlineList(relevant)}.`
      : "Delivered product-facing software across web, mobile, API, and platform environments.";
  }
  if (/\b(enterprise|production-quality|large client)\b/.test(text)) {
    return "Built an enterprise engineering foundation in structured, production-oriented delivery environments.";
  }
  if (claim.type === "project_claim") return "Advanced the project through product framing, technical validation, and iterative delivery.";
  if (claim.type === "role_claim") return `Role history supports the ${variant.displayName} positioning and requires final wording review.`;
  if (claim.type === "skill_claim") return "Demonstrated technical and delivery-tool fluency across the selected work.";
  return "Contributed to product and technology delivery; final public wording still needs review.";
}

export async function listVariantStatuses(workspace: string, persist = true): Promise<VariantStatus[]> {
  const baseline = await readJson<RefreshBaseline | null>(path.join(workspace, "kb/update-baseline.json"), null);
  const statuses: VariantStatus[] = [];

  for (const roleKey of ROLE_KEYS) {
    const relativePath = `${VARIANTS_ROOT}/${roleKey}`;
    const draftManifest = await readJson<VariantGenerationManifest | null>(path.join(workspace, relativePath, "generation-manifest.json"), null);
    const finalManifest = await readJson<{
      displayName?: string;
      finalizedAt?: string;
      profileFingerprint?: string;
      finalizationReadiness?: "ready" | "not_ready";
    } | null>(path.join(workspace, relativePath, "final-manifest.json"), null);
    const exportStatus = await inspectResumeExportStatus(workspace, roleKey);
    statuses.push({
      roleKey,
      displayName: draftManifest?.displayName ?? finalManifest?.displayName ?? getRoleVariant(roleKey).displayName,
      draft: draftManifest
        ? {
          generated: true,
          freshness: baseline && draftManifest.profileFingerprint === baseline.profileFingerprint ? "current" : "stale",
          generatedAt: draftManifest.generatedAt,
          path: relativePath
        }
        : { generated: false, freshness: "not_generated", path: relativePath },
      final: finalManifest
        ? {
          generated: true,
          freshness: baseline && finalManifest.profileFingerprint === baseline.profileFingerprint ? "current" : "stale",
          generatedAt: finalManifest.finalizedAt,
          path: `${relativePath}/final-resume.md`,
          readiness: finalManifest.finalizationReadiness
        }
        : { generated: false, freshness: "not_generated", path: `${relativePath}/final-resume.md` },
      export: {
        generated: exportStatus.generated,
        freshness: exportStatus.freshness,
        generatedAt: exportStatus.exportedAt,
        path: exportStatus.path
      }
    });
  }

  if (persist) await updateManifestFreshness(workspace, baseline?.profileFingerprint);
  return statuses;
}

export function formatVariantsSummary(statuses: VariantStatus[]): string {
  return [
    "Role variants:",
    ...statuses.map((status) => {
      const draft = `draft ${status.draft.generated ? "generated" : "not generated"}/${status.draft.freshness}${status.draft.generatedAt ? `/${status.draft.generatedAt}` : ""}`;
      const final = `final ${status.final.generated ? "generated" : "not generated"}/${status.final.freshness}${status.final.readiness ? `/${status.final.readiness === "ready" ? "ready" : "not ready"}` : ""}${status.final.generatedAt ? `/${status.final.generatedAt}` : ""}`;
      const exported = `export ${status.export.generated ? "generated" : "not generated"}/${status.export.freshness}${status.export.generatedAt ? `/${status.export.generatedAt}` : ""}`;
      return `- ${status.roleKey}: ${draft}; ${final}; ${exported}`;
    })
  ].join("\n");
}

function buildSelections(variant: RoleVariantDefinition, context: GenerationContext): DraftSelections {
  const rankedClaims = selectClaimsForVariant(variant, context.claims, context.evidence);
  return {
    rankedClaims,
    roles: selectRoles(context.profile, rankedClaims, variant),
    projects: selectProjects(context.profile, variant),
    skills: selectSkills(context.profile, variant),
    educationClaims: context.claims
      .filter((claim) => claim.type === "education_claim" || claim.type === "certification_claim")
      .filter((claim) => isClaimUsableInDraft(claim, context.evidenceById))
      .slice(0, 4)
  };
}

async function loadGenerationContext(workspace: string): Promise<GenerationContext> {
  const profile = await readJson<CareerProfile | null>(path.join(workspace, "kb/career-profile.json"), null);
  const claims = await readJson<Claim[]>(path.join(workspace, "kb/claims.json"), []);
  const evidence = await readJson<EvidenceItem[]>(path.join(workspace, "kb/evidence-items.json"), []);
  const baseline = await readJson<RefreshBaseline | null>(path.join(workspace, "kb/update-baseline.json"), null);
  const latest = await readJson<LatestRefresh | null>(path.join(workspace, "outputs/changelogs/latest-refresh.json"), null);
  if (!profile || !baseline) throw new Error("No refreshed career profile baseline found. Run prooflayer refresh before generating variants.");
  return { profile, claims, evidence, evidenceById: new Map(evidence.map((item) => [item.id, item])), baseline, latest };
}

function scoreClaim(variant: RoleVariantDefinition, claim: Claim): number {
  const text = normalize(claim.claim);
  const typeIndex = variant.preferredClaimTypes.indexOf(claim.type);
  let score = typeIndex >= 0 ? 18 - typeIndex * 2 : 0;
  score += matchScore(text, variant.positioningPriorities, 4);
  score += matchScore(text, variant.preferredDomains, 3);
  score += matchScore(text, variant.preferredSkillsTools, variant.roleKey === "fullstack" ? 6 : 3);
  score += matchScore(text, variant.preferredProjects, 5);
  score -= matchScore(text, variant.deEmphasizedAreas, 3);
  if (claim.factualConfidence === "high") score += 2;
  if (claim.approvalStatus === "approved") score += 3;
  if (claim.metricStatus === "needs_metric") score -= 8;
  return score;
}

function matchScore(text: string, values: string[], weight: number): number {
  return values.reduce((score, value) => {
    const tokens = normalize(value).split(/[^a-z0-9+/.]+/).filter((token) => token.length >= 3);
    const matches = tokens.filter((token) => text.includes(token)).length;
    return score + matches * weight;
  }, 0);
}

function isClaimUsableInDraft(claim: Claim, evidenceById: Map<string, EvidenceItem>): boolean {
  if (claim.approvalStatus === "blocked" || claim.outputReadiness === "do_not_use") return false;
  if (claim.metricStatus === "needs_metric") return false;
  const supporting = claim.supportingEvidenceIds.map((id) => evidenceById.get(id)).filter((item): item is EvidenceItem => Boolean(item));
  if (supporting.length === 0) return false;
  return supporting.every((item) =>
    !["private", "sensitive", "do_not_use"].includes(item.visibility) && item.sensitivityFlags.length === 0
  );
}

function selectRoles(profile: CareerProfile, rankedClaims: RankedClaim[], variant: RoleVariantDefinition): CareerProfile["roles"] {
  const indexed = profile.roles.map((role, index) => {
    const roleEvidence = new Set(role.evidenceIds);
    const relatedScore = rankedClaims
      .filter(({ claim }) => claim.supportingEvidenceIds.some((id) => roleEvidence.has(id)))
      .reduce((total, item) => total + item.score, 0);
    const entityScore = matchScore(normalize(`${role.title ?? ""} ${role.company ?? ""}`), variant.positioningPriorities, 5);
    return { role, index, score: relatedScore + entityScore };
  });
  const selectedIndexes = new Set(indexed.sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 7).map((item) => item.index));
  return profile.roles.filter((_, index) => selectedIndexes.has(index));
}

function selectProjects(profile: CareerProfile, variant: RoleVariantDefinition): CareerProfile["projects"] {
  return profile.projects.map((project, index) => ({
    project,
    index,
    score: projectPreferenceScore(project.name, variant.preferredProjects)
      + matchScore(normalize(`${(project.technologies ?? []).join(" ")} ${(project.domains ?? []).join(" ")}`), [...variant.preferredSkillsTools, ...variant.preferredDomains], 3)
  })).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 4).map((item) => item.project);
}

function projectPreferenceScore(projectName: string, preferredProjects: string[]): number {
  const identity = normalizeProjectIdentity(projectName);
  const index = preferredProjects.findIndex((preferred) => normalizeProjectIdentity(preferred) === identity);
  return index >= 0 ? (preferredProjects.length - index) * 50 : 0;
}

function selectSkills(profile: CareerProfile, variant: RoleVariantDefinition): CareerProfile["skills"] {
  const preferred = new Map(variant.preferredSkillsTools.map((name, index) => [normalize(name), index]));
  return profile.skills.filter((skill) => preferred.has(normalize(skill.name)))
    .sort((a, b) => (preferred.get(normalize(a.name)) ?? 999) - (preferred.get(normalize(b.name)) ?? 999))
    .slice(0, 15);
}

function renderResumeDraft(
  variant: RoleVariantDefinition,
  selected: DraftSelections,
  context: GenerationContext,
  usedClaimIds: Set<string>,
  usedEvidenceIds: Set<string>
): string {
  const strengths = uniqueContributions(selected.rankedClaims, context, variant, 6);
  strengths.forEach((item) => usedClaimIds.add(item.claim.id));
  const projects = selected.projects.map((project) => {
    const contributions = projectContributions(project, context, variant, 3);
    contributions.forEach((item) => usedClaimIds.add(item.claim.id));
    project.evidenceIds.forEach((id) => usedEvidenceIds.add(id));
    const bullets = contributions.length > 0
      ? contributions.map((item) => item.text)
      : ["Project evidence is present, but role-specific public wording needs review."];
    return `### ${project.name}\n\n${renderBullets(bullets)}\n- Relevant technologies: ${formatInlineList(project.technologies ?? []) || "needs review"}.`;
  });
  const roles = selected.roles.map((role) => {
    const related = relatedRankedClaims(role.evidenceIds, selected.rankedClaims).slice(0, 2);
    related.forEach((item) => usedClaimIds.add(item.claim.id));
    role.evidenceIds.forEach((id) => usedEvidenceIds.add(id));
    const bullets = uniqueContributions(related, context, variant, 2).map((item) => `- ${item.text}`).join("\n");
    return `### ${role.company ?? "[Company needs review]"}\n\n**${role.title ?? "[Role needs review]"}**${role.dateRange ? ` | ${role.dateRange}` : ""}${bullets ? `\n\n${bullets}` : ""}`;
  });
  selected.educationClaims.forEach((claim) => usedClaimIds.add(claim.id));
  const education = uniqueContributions(selected.educationClaims.map((claim) => ({ claim, score: 1 })), context, variant, 4);

  return `${renderDraftWarning("Role-Specific Resume Draft")}

# [Name]

${variant.headline}

## Summary

${draftResumeSummary(variant)}

## Role-Focused Strengths

${renderBullets(strengths.map((item) => item.text))}

## Selected Projects and Initiatives

${projects.join("\n\n") || "- No sufficiently relevant project evidence selected."}

## Professional Experience Highlights

${roles.join("\n\n") || "- No role evidence selected."}

## Relevant Skills and Tools

${formatInlineList(selected.skills.map((skill) => skill.name)) || "Needs review"}

## Education and Certifications

${renderBullets(education.map((item) => item.text))}

## Unresolved Claims Warning

Claims used in this draft that are not approved and resume-ready are listed in unresolved-claims.md. Confirm wording, visibility, and factual context before public use.

## Evidence Note

Generated deterministically in ProofLayer draft mode from non-blocked evidence linked to profile fingerprint ${context.baseline.profileFingerprint}. This is not a final or publication-approved resume.
`;
}

function renderWebsiteDraft(
  variant: RoleVariantDefinition,
  selected: DraftSelections,
  context: GenerationContext,
  usedClaimIds: Set<string>,
  usedEvidenceIds: Set<string>
): string {
  const whatIDo = uniqueContributions(selected.rankedClaims, context, variant, 5);
  whatIDo.forEach((item) => usedClaimIds.add(item.claim.id));
  const cards = selected.projects.map((project) => {
    const contributions = projectContributions(project, context, variant, 2);
    contributions.forEach((item) => usedClaimIds.add(item.claim.id));
    project.evidenceIds.forEach((id) => usedEvidenceIds.add(id));
    const copy = contributions.length > 0
      ? renderBullets(contributions.map((item) => item.text))
      : "Project evidence is present, but role-specific public wording needs review.";
    return `### ${project.name}\n\n${copy}\n\n**Keywords:** ${formatInlineList([...(project.technologies ?? []), ...(project.domains ?? [])]) || "needs review"}`;
  });

  return `${renderDraftWarning("Website Copy Draft")}

# Hero

## [Name]

**${variant.headline}**

${draftWebsiteSubheadline(variant)}

## What I Do

${renderBullets(whatIDo.map((item) => item.text))}

## Selected Project Cards

${cards.join("\n\n") || "- No project cards selected."}

## Resume Downloads

- Recruiter Resume: [draft download link]
- ATS Resume: [draft download link]

## SEO Draft

- Title: [Name] | ${variant.displayName}
- Description: ${draftSeoDescription(variant)}

## Publication Warning

This is draft website copy generated from non-blocked evidence. It is not final public content and requires claim, privacy, and wording review.
`;
}

function renderUnresolvedClaims(claims: Claim[], evidenceById: Map<string, EvidenceItem>): string {
  const sections = claims.map((claim) => {
    const evidence = claimEvidence(claim, evidenceById);
    const visibility = [...new Set(evidence.map((item) => item.visibility))].sort() as Visibility[];
    return `## ${claim.id}\n\n- Claim text: ${claim.claim}\n- Approval status: ${claim.approvalStatus}\n- Output readiness: ${claim.outputReadiness}\n- Visibility: ${visibility.join(", ") || "unknown"}\n- Supporting evidence IDs: ${claim.supportingEvidenceIds.join(", ")}\n- Reason for review: ${reviewReason(claim, visibility)}\n- Safe for draft only: yes, generalized wording only`;
  });
  return `${renderDraftWarning("Unresolved Claims")}

# Unresolved Claims

These claims contributed to the draft but are not approved and resume-ready. Original wording is retained here for internal review only.

${sections.join("\n\n") || "- No unresolved claims were used."}
`;
}

function renderVariantSummary(variant: RoleVariantDefinition, selected: DraftSelections, unresolvedClaims: Claim[]): string {
  return `${renderDraftWarning("Variant Summary")}

# ${variant.displayName} Variant Summary

- Role key: ${variant.roleKey}
- Headline: ${variant.headline}
- Output tone: ${variant.outputTone}

## Why This Variant Fits

The current profile contains role, project, skill, and domain evidence aligned with ${formatInlineList(variant.positioningPriorities.slice(0, 5))}. The generator selected ${selected.roles.length} roles, ${selected.projects.length} projects, and ${selected.skills.length} skills for this draft projection.

## Strongest Supporting Evidence Themes

${renderBullets(variant.positioningPriorities.slice(0, 8))}

## Weak or Missing Proof

- No claims are currently approved and resume-ready.
- Public wording and source visibility still require review.
- Business impact metrics remain unavailable unless explicitly supported by evidence.

## Top Projects Selected

${renderBullets(selected.projects.map((project) => project.name))}

## Top Skills Selected

${renderBullets(selected.skills.map((skill) => skill.name))}

## Warnings

${renderBullets(DRAFT_WARNINGS)}
- Unresolved claims used: ${unresolvedClaims.length}

## Suggested Next Review Actions

- Review unresolved-claims.md for this variant only.
- Confirm role/project wording and any generalized internal-only evidence.
- Add verified metrics only when directly supported.
- Regenerate after the career profile fingerprint changes.
`;
}

function uniqueContributions(
  ranked: RankedClaim[],
  context: GenerationContext,
  variant: RoleVariantDefinition,
  limit: number
): Array<{ claim: Claim; text: string }> {
  const seen = new Set<string>();
  const output: Array<{ claim: Claim; text: string }> = [];
  for (const item of ranked) {
    const text = generalizeClaimForDraft(item.claim, claimEvidence(item.claim, context.evidenceById), variant);
    if (seen.has(text)) continue;
    seen.add(text);
    output.push({ claim: item.claim, text });
  }
  return output
    .sort((a, b) => contributionPriority(variant.roleKey, a.text) - contributionPriority(variant.roleKey, b.text))
    .slice(0, limit);
}

function projectContributions(
  project: CareerProfile["projects"][number],
  context: GenerationContext,
  variant: RoleVariantDefinition,
  limit: number
): Array<{ claim: Claim; text: string }> {
  const evidenceIds = new Set(project.evidenceIds);
  const relatedClaims = context.claims.filter((claim) =>
    claim.supportingEvidenceIds.some((id) => evidenceIds.has(id)) && isClaimUsableInDraft(claim, context.evidenceById)
  );
  const concreteClaims = relatedClaims.filter((claim) =>
    ["responsibility_claim", "impact_claim"].includes(claim.type)
  );
  const projectClaims = relatedClaims.filter((claim) => claim.type === "project_claim");
  const candidates = concreteClaims.length > 0
    ? concreteClaims
    : projectClaims.length > 0
      ? projectClaims
      : relatedClaims;
  const ranked = rankClaimsForVariant(variant, candidates)
    .map((item) => ({
      ...item,
      score: item.score + concreteProjectClaimScore(item.claim)
    }))
    .sort((a, b) => b.score - a.score || a.claim.id.localeCompare(b.claim.id));
  return uniqueContributions(ranked, context, variant, limit);
}

function concreteProjectClaimScore(claim: Claim): number {
  let score = 0;
  if (["responsibility_claim", "impact_claim"].includes(claim.type)) score += 6;
  if (/^(?:built|shaped|led|supported|validated|coordinated|translated|improved|designed|added|created|produced|structured)\b/i.test(claim.claim)) score += 5;
  if (claim.type === "project_claim") score += 2;
  return score;
}

function draftResumeSummary(variant: RoleVariantDefinition): string {
  const summaries: Record<RoleKey, string> = {
    tpm: "Technical Product Manager with a deep engineering foundation across product discovery, roadmap shaping, platform delivery, and cross-functional execution. Connects user and business problems with technical tradeoffs, scoped priorities, and practical delivery across telecom SaaS, EdTech, and AI-assisted product initiatives.",
    "ai-product": "AI Product Manager with hands-on evidence across AI-assisted workflows, product validation, mobile prototypes, and technical evaluation. Brings product discovery and engineering judgment together to shape useful experiments, test assumptions, and turn emerging capabilities into clearer product decisions.",
    fullstack: "Senior full-stack and product-minded engineer with experience across web, mobile, API, and platform delivery. Combines TypeScript, React, Node.js, React Native, Java, and delivery tooling with practical product judgment and close cross-functional execution.",
    "fractional-cto": "Product and technology leader with CTO, founder, consulting, platform, and enterprise delivery experience. Connects roadmap and scope decisions with architecture, delivery risk, stakeholder alignment, and hands-on technical judgment across startup and established environments."
  };
  return summaries[variant.roleKey];
}

function draftWebsiteSubheadline(variant: RoleVariantDefinition): string {
  const values: Record<RoleKey, string> = {
    tpm: "Turns ambiguous product and technical problems into clearer priorities, scoped platform decisions, and delivery-ready execution.",
    "ai-product": "Builds and validates AI-assisted product workflows with practical technical evaluation and evidence-aware product judgment.",
    fullstack: "Builds product-facing web, mobile, API, and platform workflows with strong implementation depth and practical product context.",
    "fractional-cto": "Connects product direction, platform strategy, architecture, and delivery risk to help teams make executable technology decisions."
  };
  return values[variant.roleKey];
}

function draftSeoDescription(variant: RoleVariantDefinition): string {
  const descriptions: Record<RoleKey, string> = {
    tpm: "Technical Product Manager focused on product discovery, roadmap decisions, platform delivery, and cross-functional execution.",
    "ai-product": "AI Product Manager focused on AI-assisted workflows, product validation, technical evaluation, and evidence-backed decision support.",
    fullstack: "Senior full-stack and product-minded engineer focused on TypeScript, React, Node.js, mobile products, APIs, and platform delivery.",
    "fractional-cto": "Product and technology leader focused on platform strategy, architecture decisions, delivery risk, and technical leadership."
  };
  return descriptions[variant.roleKey];
}

function contributionPriority(roleKey: RoleKey, text: string): number {
  const patterns: Record<RoleKey, RegExp[]> = {
    tpm: [/product discovery/i, /roadmap shaping/i, /aligned product/i, /platform delivery/i, /AI-assisted/i, /product and delivery tools/i],
    "ai-product": [/AI-assisted/i, /product framing|technical validation/i, /product discovery/i, /implemented/i, /platform delivery/i],
    fullstack: [/^Implemented/i, /^Delivered/i, /platform delivery/i, /AI-assisted/i, /product discovery/i, /aligned product/i],
    "fractional-cto": [/^Led product and technology/i, /roadmap shaping/i, /aligned product/i, /platform delivery/i, /enterprise engineering/i, /AI-assisted/i]
  };
  const index = patterns[roleKey].findIndex((pattern) => pattern.test(text));
  return index >= 0 ? index : patterns[roleKey].length;
}

function relatedRankedClaims(evidenceIds: string[], ranked: RankedClaim[]): RankedClaim[] {
  const ids = new Set(evidenceIds);
  return ranked.filter(({ claim }) => claim.supportingEvidenceIds.some((id) => ids.has(id)));
}

function claimEvidence(claim: Claim, evidenceById: Map<string, EvidenceItem>): EvidenceItem[] {
  return claim.supportingEvidenceIds.map((id) => evidenceById.get(id)).filter((item): item is EvidenceItem => Boolean(item));
}

function reviewReason(claim: Claim, visibility: Visibility[]): string {
  if (claim.approvalStatus !== "approved") return "Claim has not been manually or evidentially approved for final use.";
  if (claim.outputReadiness === "generic_only") return "Only generalized wording is allowed from the supporting source.";
  if (claim.outputReadiness === "internal_only") return "Supporting evidence is restricted to internal draft use.";
  if (visibility.includes("unknown")) return "Source visibility is unknown.";
  return "Final publication review is still required.";
}

async function registerOutput(workspace: string, manifest: VariantGenerationManifest): Promise<void> {
  const manifestPath = path.join(workspace, OUTPUT_MANIFEST_FILE);
  const registry = await readJson<OutputManifest>(manifestPath, { schemaVersion: 1, updatedAt: manifest.generatedAt, outputs: [] });
  const entry: OutputManifestEntry = {
    id: manifest.outputId,
    variantRoleKey: manifest.roleKey,
    generatedFiles: manifest.generatedFiles,
    generatedAt: manifest.generatedAt,
    profileFingerprint: manifest.profileFingerprint,
    claimIdsUsed: manifest.claimIdsUsed,
    evidenceIdsUsed: manifest.evidenceIdsUsed,
    publicationStatus: "draft",
    freshness: "current"
  };
  const outputs = registry.outputs.filter((output) => output.id !== entry.id);
  outputs.push(entry);
  outputs.sort((a, b) => a.variantRoleKey.localeCompare(b.variantRoleKey));
  await writeJsonAtomic(manifestPath, { schemaVersion: 1, updatedAt: manifest.generatedAt, outputs } satisfies OutputManifest);
}

async function updateManifestFreshness(workspace: string, currentFingerprint?: string): Promise<void> {
  const manifestPath = path.join(workspace, OUTPUT_MANIFEST_FILE);
  if (!(await pathExists(manifestPath))) return;
  const registry = await readJson<OutputManifest>(manifestPath, { schemaVersion: 1, updatedAt: new Date(0).toISOString(), outputs: [] });
  const outputs = await Promise.all(registry.outputs.map(async (output) => {
    let current = Boolean(currentFingerprint && output.profileFingerprint === currentFingerprint);
    if (current && output.publicationStatus === "export") {
      const sourcePath = output.sourceMarkdownPath ? path.join(workspace, output.sourceMarkdownPath) : undefined;
      current = Boolean(sourcePath && output.sourceMarkdownHash && await pathExists(sourcePath)
        && await hashFile(sourcePath) === output.sourceMarkdownHash);
    }
    return { ...output, freshness: current ? "current" as const : "stale" as const };
  }));
  await writeJsonAtomic(manifestPath, { ...registry, updatedAt: new Date().toISOString(), outputs });
}

function countByApprovalStatus(claims: Claim[]): Record<Claim["approvalStatus"], number> {
  return {
    approved: claims.filter((claim) => claim.approvalStatus === "approved").length,
    needs_confirmation: claims.filter((claim) => claim.approvalStatus === "needs_confirmation").length,
    blocked: claims.filter((claim) => claim.approvalStatus === "blocked").length
  };
}

function countByOutputReadiness(claims: Claim[]): Record<Claim["outputReadiness"], number> {
  return {
    resume_ready: claims.filter((claim) => claim.outputReadiness === "resume_ready").length,
    generic_only: claims.filter((claim) => claim.outputReadiness === "generic_only").length,
    internal_only: claims.filter((claim) => claim.outputReadiness === "internal_only").length,
    do_not_use: claims.filter((claim) => claim.outputReadiness === "do_not_use").length
  };
}

function renderDraftWarning(label: string): string {
  return `> **DRAFT - ${label}**\n>\n${DRAFT_WARNINGS.map((warning) => `> ${warning}`).join("\n")}`;
}

function renderBullets(values: string[]): string {
  return values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "- Needs review.";
}

function formatInlineList(values: string[]): string {
  return uniqueSorted(values).join(", ");
}

function normalize(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}
