import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathExists, readJson, uniqueSorted, writeJsonAtomic, writeText } from "./fs-utils.js";
import { detectSensitivity } from "./privacy.js";
import { loadPublicProfile, PUBLIC_PROFILE_FILE } from "./public-profile.js";
import { getRoleVariant, isRoleKey } from "./role-variants.js";
import { VariantReviewDecisionsSchema } from "./schemas.js";
import { OUTPUT_MANIFEST_FILE, VARIANTS_ROOT, generalizeClaimForDraft, rankClaimsForVariant } from "./variant-generator.js";
export const REVIEW_DECISIONS_FILE = "review-decisions.json";
export const FINAL_RESUME_FILE = "final-resume.md";
export const FINAL_WEBSITE_FILE = "final-website-copy.md";
export const FINAL_CHECKLIST_FILE = "final-public-checklist.md";
export const FINAL_MANIFEST_FILE = "final-manifest.json";
const TPM_COMPLETENESS_CLAIM_IDS = [
    "claim_a0d06ff53160",
    "claim_8c7c3c3e8002",
    "claim_ffda3bd4dbfc",
    "claim_21082bbbbc33",
    "claim_871911b85bcf",
    "claim_9379f09c8b8c"
];
const REVIEW_ROLE_KEYS = ["tpm", "ai-product"];
const AI_PRODUCT_COMPLETENESS_PATTERNS = [
    /\bAI-assisted\b/i,
    /\bSignalBoard\b|\bmarket-signal\b|\bsignal extraction\b/i,
    /\bevidence-backed decision support\b|\bdecision-support workflows?\b|\btraceability\b/i,
    /\bproduct validation\b|\bevaluation scenarios?\b|\bqualitative feedback\b/i,
    /\bInSightARLeans\b|\bcomputer-vision\b|\bcamera flows?\b|\boverlay UX\b/i,
    /\bapp-layer experience\b|\bbackend\/data configuration\b/i,
    /\bexperiment(?:ation| design)\b|\btechnical evaluation\b/i,
    /\baction provenance\b/i
];
export async function initializeVariantReview(workspace, roleKeyInput, now = new Date()) {
    const roleKey = reviewRoleKey(roleKeyInput);
    const root = variantRoot(roleKey);
    const manifestPath = path.join(workspace, root, "generation-manifest.json");
    const unresolvedPath = path.join(workspace, root, "unresolved-claims.md");
    if (!(await pathExists(manifestPath)) || !(await pathExists(unresolvedPath))) {
        throw new Error(`Generate the ${roleKey} draft before starting review.`);
    }
    const manifest = await readJson(manifestPath, null);
    if (!manifest)
        throw new Error(`Invalid generation manifest for ${roleKey}.`);
    const unresolvedText = await readFile(unresolvedPath, "utf8");
    const unresolvedIds = extractUnresolvedClaimIds(unresolvedText);
    const claims = await readJson(path.join(workspace, "kb/claims.json"), []);
    const reviewIds = buildReviewScopeIds(roleKey, manifest, unresolvedIds, claims);
    const reviewPath = path.join(workspace, root, REVIEW_DECISIONS_FILE);
    const existingRaw = await readJson(reviewPath, null);
    const existing = existingRaw ? VariantReviewDecisionsSchema.parse(existingRaw) : null;
    if (existing && existing.roleKey !== roleKey)
        throw new Error(`Review file role mismatch: expected ${roleKey}.`);
    const existingById = new Map(existing?.decisions.map((decision) => [decision.claimId, decision]) ?? []);
    const additions = reviewIds.filter((claimId) => !existingById.has(claimId));
    for (const claimId of additions)
        existingById.set(claimId, { claimId, decision: "pending" });
    const currentOrder = new Map(reviewIds.map((claimId, index) => [claimId, index]));
    const decisions = [...existingById.values()].sort((a, b) => {
        const aIndex = currentOrder.get(a.claimId) ?? Number.MAX_SAFE_INTEGER;
        const bIndex = currentOrder.get(b.claimId) ?? Number.MAX_SAFE_INTEGER;
        return aIndex - bIndex || a.claimId.localeCompare(b.claimId);
    });
    const timestamp = now.toISOString();
    const review = {
        schemaVersion: 1,
        roleKey,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: additions.length > 0 || !existing || existing.profileFingerprint !== manifest.profileFingerprint
            ? timestamp
            : existing.updatedAt,
        profileFingerprint: manifest.profileFingerprint,
        sourceGenerationManifest: `${root}/generation-manifest.json`,
        decisions
    };
    await writeJsonAtomic(reviewPath, review);
    return getVariantReviewStatus(workspace, roleKey);
}
export async function getVariantReviewStatus(workspace, roleKeyInput) {
    const roleKey = reviewRoleKey(roleKeyInput);
    const root = variantRoot(roleKey);
    const reviewPath = path.join(workspace, root, REVIEW_DECISIONS_FILE);
    const manifest = await readJson(path.join(workspace, root, "generation-manifest.json"), null);
    const baseline = await readJson(path.join(workspace, "kb/update-baseline.json"), null);
    if (!(await pathExists(reviewPath)) || !manifest) {
        return {
            roleKey,
            reviewExists: false,
            draftCurrent: Boolean(manifest && baseline && manifest.profileFingerprint === baseline.profileFingerprint),
            counts: emptyDecisionCounts(),
            total: 0,
            finalizationAllowed: false,
            publicationReadiness: "not_ready",
            warnings: ["Run review variant before finalization."],
            path: `${root}/${REVIEW_DECISIONS_FILE}`
        };
    }
    const review = VariantReviewDecisionsSchema.parse(await readJson(reviewPath, {}));
    const context = await loadReviewContext(workspace, roleKey, manifest, review, baseline);
    const currentDecisions = currentReviewDecisions(context);
    const counts = countDecisions(currentDecisions);
    const selection = buildPublicSelection(context, currentDecisions);
    const draftCurrent = Boolean(baseline && manifest.profileFingerprint === baseline.profileFingerprint);
    return {
        roleKey,
        reviewExists: true,
        draftCurrent,
        counts,
        total: currentDecisions.length,
        finalizationAllowed: draftCurrent,
        publicationReadiness: draftCurrent ? selection.readiness : "not_ready",
        warnings: draftCurrent ? selection.warnings : ["The draft variant is stale; regenerate it before finalization."],
        path: `${root}/${REVIEW_DECISIONS_FILE}`
    };
}
export function formatVariantReviewStatus(status) {
    return [
        `Variant review (${status.roleKey}): pending ${status.counts.pending}, approved ${status.counts.approve}, revised ${status.counts.revise}, draft-only ${status.counts.draft_only}, excluded ${status.counts.exclude}`,
        `Finalization allowed: ${status.finalizationAllowed ? "yes" : "no"}`,
        `Publication readiness: ${status.publicationReadiness === "ready" ? "ready" : "not ready"}`,
        `Review decisions: ${status.path}`
    ].join("\n");
}
export async function finalizeVariant(workspace, roleKeyInput, now = new Date()) {
    const roleKey = reviewRoleKey(roleKeyInput);
    const root = variantRoot(roleKey);
    const reviewPath = path.join(workspace, root, REVIEW_DECISIONS_FILE);
    if (!(await pathExists(reviewPath)))
        throw new Error(`Run review variant --role ${roleKey} before finalization.`);
    const manifest = await readJson(path.join(workspace, root, "generation-manifest.json"), null);
    if (!manifest)
        throw new Error(`Generate the ${roleKey} draft before finalization.`);
    const review = VariantReviewDecisionsSchema.parse(await readJson(reviewPath, {}));
    const baseline = await readJson(path.join(workspace, "kb/update-baseline.json"), null);
    if (!baseline || manifest.profileFingerprint !== baseline.profileFingerprint) {
        throw new Error(`The ${roleKey} draft is stale. Regenerate it before finalization.`);
    }
    const context = await loadReviewContext(workspace, roleKey, manifest, review, baseline);
    const currentDecisions = currentReviewDecisions(context);
    const selection = buildPublicSelection(context, currentDecisions);
    const decisionCounts = countDecisions(currentDecisions);
    const files = {
        resume: `${root}/${FINAL_RESUME_FILE}`,
        website: `${root}/${FINAL_WEBSITE_FILE}`,
        checklist: `${root}/${FINAL_CHECKLIST_FILE}`,
        manifest: `${root}/${FINAL_MANIFEST_FILE}`
    };
    const finalizedAt = now.toISOString();
    await writeText(path.join(workspace, files.resume), renderFinalResume(context, selection, decisionCounts));
    await writeText(path.join(workspace, files.website), renderFinalWebsite(context, selection, decisionCounts));
    await writeText(path.join(workspace, files.checklist), renderFinalChecklist(currentDecisions, selection));
    const claimIdsUsed = uniqueSorted(selection.accepted.map((item) => item.claim.id));
    const evidenceIdsUsed = uniqueSorted(selection.accepted.flatMap((item) => item.claim.supportingEvidenceIds));
    const finalManifest = {
        schemaVersion: 1,
        outputId: `role_variant_${roleKey}_final`,
        roleKey,
        displayName: getRoleVariant(roleKey).displayName,
        finalizedAt,
        profileFingerprint: manifest.profileFingerprint,
        sourceGenerationManifest: `${root}/generation-manifest.json`,
        sourceGeneratedAt: manifest.generatedAt,
        generatedFiles: Object.values(files),
        claimIdsUsed,
        evidenceIdsUsed,
        decisionCounts,
        privacyWarnings: selection.warnings,
        publicProfile: selection.publicProfile,
        missingSections: selection.missingSections,
        finalizationReadiness: selection.readiness,
        publicationStatus: "final_candidate",
        freshness: "current"
    };
    await writeJsonAtomic(path.join(workspace, files.manifest), finalManifest);
    await registerFinalOutput(workspace, finalManifest);
    return finalManifest;
}
function reviewRoleKey(value) {
    if (!isRoleKey(value) || !REVIEW_ROLE_KEYS.includes(value)) {
        throw new Error("Output-specific review supports --role tpm or --role ai-product.");
    }
    return value;
}
function variantRoot(roleKey) {
    return `${VARIANTS_ROOT}/${roleKey}`;
}
function extractUnresolvedClaimIds(markdown) {
    return [...markdown.matchAll(/^##\s+(claim_[A-Za-z0-9_-]+)\s*$/gm)].map((match) => match[1]);
}
export function buildReviewScopeIds(roleKey, manifest, unresolvedIds, claims) {
    const claimById = new Map(claims.map((claim) => [claim.id, claim]));
    const includeUnresolved = (claimId) => {
        const claim = claimById.get(claimId);
        return Boolean(claim && (claim.approvalStatus !== "approved" || claim.outputReadiness !== "resume_ready"));
    };
    const completenessIds = roleKey === "tpm"
        ? selectTpmCompletenessClaimIds(claims)
        : roleKey === "ai-product"
            ? selectAiProductCompletenessClaimIds(claims)
            : [];
    return uniqueInOrder([
        ...manifest.claimIdsUsed.filter(includeUnresolved),
        ...unresolvedIds.filter(includeUnresolved),
        ...completenessIds.filter(includeUnresolved)
    ]);
}
function selectTpmCompletenessClaimIds(claims) {
    const explicitIds = new Set(TPM_COMPLETENESS_CLAIM_IDS);
    return claims.filter((claim) => explicitIds.has(claim.id)
        || claim.type === "education_claim"
        || claim.type === "certification_claim"
        || (claim.type === "skill_claim" && /\bproduct\s*(?:&|and)\s*delivery tools\b/i.test(claim.claim))
        || (claim.sourceSection === "Summary" && ["responsibility_claim", "competency_claim", "leadership_claim"].includes(claim.type))).map((claim) => claim.id);
}
function selectAiProductCompletenessClaimIds(claims) {
    const aiSkillPattern = /\b(?:AI|TensorFlow\.js|React Native|Expo|Supabase|TypeScript|APIs?)\b/i;
    return claims.filter((claim) => {
        if (claim.approvalStatus === "blocked" || claim.outputReadiness === "do_not_use")
            return false;
        if (claim.type === "skill_claim") {
            return AI_PRODUCT_COMPLETENESS_PATTERNS.some((pattern) => pattern.test(claim.claim))
                || aiSkillPattern.test(claim.claim)
                || /\bproduct\s*(?:&|and)\s*delivery tools\b/i.test(claim.claim);
        }
        return AI_PRODUCT_COMPLETENESS_PATTERNS.some((pattern) => pattern.test(claim.claim));
    }).map((claim) => claim.id);
}
function uniqueInOrder(values) {
    const seen = new Set();
    return values.filter((value) => {
        if (seen.has(value))
            return false;
        seen.add(value);
        return true;
    });
}
async function loadReviewContext(workspace, roleKey, manifest, review, baseline) {
    const profile = await readJson(path.join(workspace, "kb/career-profile.json"), null);
    const claims = await readJson(path.join(workspace, "kb/claims.json"), []);
    const evidence = await readJson(path.join(workspace, "kb/evidence-items.json"), []);
    const publicProfile = await loadPublicProfile(workspace);
    if (!profile)
        throw new Error("Career profile is unavailable. Run refresh first.");
    const unresolvedPath = path.join(workspace, variantRoot(roleKey), "unresolved-claims.md");
    const unresolvedText = await pathExists(unresolvedPath) ? await readFile(unresolvedPath, "utf8") : "";
    const reviewScopeIds = buildReviewScopeIds(roleKey, manifest, extractUnresolvedClaimIds(unresolvedText), claims);
    return {
        roleKey,
        manifest,
        review,
        profile,
        claims,
        evidence,
        evidenceById: new Map(evidence.map((item) => [item.id, item])),
        publicProfile,
        baseline,
        reviewScopeIds
    };
}
function currentReviewDecisions(context) {
    const decisionById = new Map(context.review.decisions.map((decision) => [decision.claimId, decision]));
    return context.reviewScopeIds
        .map((claimId) => decisionById.get(claimId) ?? { claimId, decision: "pending" });
}
function buildPublicSelection(context, decisions) {
    const claimById = new Map(context.claims.map((claim) => [claim.id, claim]));
    const variant = getRoleVariant(context.roleKey);
    const accepted = [];
    const warnings = [];
    for (const decision of decisions) {
        if (decision.decision !== "approve" && decision.decision !== "revise")
            continue;
        const claim = claimById.get(decision.claimId);
        if (!claim) {
            warnings.push(`${decision.claimId}: claim no longer exists in the current knowledge base.`);
            continue;
        }
        if (claim.approvalStatus === "blocked" || claim.outputReadiness === "do_not_use") {
            warnings.push(`${claim.id}: blocked or do-not-use claim was excluded.`);
            continue;
        }
        if (claim.metricStatus === "needs_metric") {
            warnings.push(`${claim.id}: unsupported metric claim was excluded.`);
            continue;
        }
        const supportingEvidence = claim.supportingEvidenceIds
            .map((id) => context.evidenceById.get(id))
            .filter((item) => Boolean(item));
        if (supportingEvidence.length === 0) {
            warnings.push(`${claim.id}: no current supporting evidence was found.`);
            continue;
        }
        const visibilities = new Set(supportingEvidence.map((item) => item.visibility));
        if ([...visibilities].some((visibility) => ["private", "sensitive", "do_not_use"].includes(visibility))) {
            warnings.push(`${claim.id}: private, sensitive, or do-not-use evidence prevents public inclusion.`);
            continue;
        }
        if (supportingEvidence.some((item) => item.sensitivityFlags.length > 0)) {
            warnings.push(`${claim.id}: supporting evidence contains privacy flags.`);
            continue;
        }
        const explicitWording = decision.approvedPublicWording?.trim();
        const profileWordingOverride = publicProfileWordingOverride(claim, context.publicProfile);
        if (decision.decision === "revise" && !explicitWording) {
            warnings.push(`${claim.id}: revise requires approvedPublicWording.`);
            continue;
        }
        if (visibilities.has("unknown") && !explicitWording && !profileWordingOverride) {
            warnings.push(`${claim.id}: unknown visibility requires explicit approved public wording.`);
            continue;
        }
        const wording = profileWordingOverride
            ?? explicitWording
            ?? publicWordingForApprovedClaim(claim, supportingEvidence, variant, visibilities);
        const wordingFlags = detectSensitivity(wording);
        if (wordingFlags.length > 0) {
            warnings.push(`${claim.id}: approved wording contains ${wordingFlags.join(", ")}.`);
            continue;
        }
        accepted.push({ claim, decision, wording });
    }
    const scoreById = new Map(rankClaimsForVariant(variant, accepted.map((item) => item.claim)).map((item) => [item.claim.id, item.score]));
    accepted.sort((a, b) => (scoreById.get(b.claim.id) ?? 0) - (scoreById.get(a.claim.id) ?? 0) || a.claim.id.localeCompare(b.claim.id));
    const coverage = publicCoverage(context.profile, accepted);
    const publicProfile = buildPublicProfileUsage(context.publicProfile, context.roleKey, accepted);
    const pending = decisions.filter((decision) => decision.decision === "pending").length;
    const missingSections = [
        ...(accepted.length === 0 ? ["Summary and role-focused strengths"] : []),
        ...(context.profile.projects.length > 0 && coverage.projects === 0 ? ["Selected projects"] : []),
        ...(context.profile.roles.length > 0 && coverage.roles === 0 ? ["Professional experience"] : []),
        ...(context.profile.skills.length > 0 && coverage.skills === 0 ? ["Skills"] : []),
        ...(coverage.education === 0 ? ["Education and certifications"] : [])
    ];
    const readiness = pending === 0
        && warnings.length === 0
        && publicProfile.warnings.length === 0
        && accepted.length >= 3
        && coverage.projects > 0
        && coverage.roles > 0
        ? "ready"
        : "not_ready";
    return { accepted, warnings, publicProfile, missingSections, readiness };
}
function publicProfileWordingOverride(claim, profile) {
    if (!profile)
        return undefined;
    if (claim.type === "education_claim")
        return profile.educationWordingOverrides?.[claim.id]?.trim();
    if (claim.type === "certification_claim")
        return profile.certificationWordingOverrides?.[claim.id]?.trim();
    return undefined;
}
function buildPublicProfileUsage(profile, roleKey, accepted) {
    const educationOverrideClaimIds = accepted
        .filter((item) => item.claim.type === "education_claim" && Boolean(profile?.educationWordingOverrides?.[item.claim.id]))
        .map((item) => item.claim.id);
    const certificationOverrideClaimIds = accepted
        .filter((item) => item.claim.type === "certification_claim" && Boolean(profile?.certificationWordingOverrides?.[item.claim.id]))
        .map((item) => item.claim.id);
    const missingWordingOverrideClaimIds = accepted.filter((item) => {
        if (item.claim.type !== "education_claim" && item.claim.type !== "certification_claim")
            return false;
        if (publicProfileWordingOverride(item.claim, profile))
            return false;
        if (item.decision.approvedPublicWording?.trim() || item.claim.approvedWording?.trim())
            return false;
        return item.claim.outputReadiness === "generic_only" || item.claim.outputReadiness === "internal_only";
    }).map((item) => item.claim.id);
    const contactFieldsUsed = ["location", "email", "website", "linkedin", "github"]
        .filter((field) => Boolean(profile?.[field]))
        .sort();
    const warnings = [
        ...(!profile?.publicName ? ["Public name is missing; [Name] remains unresolved."] : []),
        ...missingWordingOverrideClaimIds.map((claimId) => `${claimId}: included education/certification claim needs an explicit public wording override.`)
    ];
    const used = Boolean(profile && (profile.publicName
        || publicHeadlineOverride(profile, roleKey)
        || profile.publicSummaryOverride
        || contactFieldsUsed.length > 0
        || educationOverrideClaimIds.length > 0
        || certificationOverrideClaimIds.length > 0));
    return {
        configured: Boolean(profile),
        used,
        publicNameUsed: Boolean(profile?.publicName),
        headlineOverrideUsed: Boolean(publicHeadlineOverride(profile, roleKey)),
        publicSummaryOverrideUsed: Boolean(profile?.publicSummaryOverride),
        contactFieldsUsed,
        educationOverrideClaimIds: uniqueSorted(educationOverrideClaimIds),
        certificationOverrideClaimIds: uniqueSorted(certificationOverrideClaimIds),
        missingWordingOverrideClaimIds: uniqueSorted(missingWordingOverrideClaimIds),
        warnings
    };
}
function publicWordingForApprovedClaim(claim, evidence, variant, visibilities) {
    if (claim.approvedWording)
        return claim.approvedWording;
    if (claim.outputReadiness === "generic_only" || claim.outputReadiness === "internal_only" || visibilities.has("generic_only")) {
        if (variant.roleKey === "ai-product") {
            const aiProductWording = aiProductFoundationWording(claim);
            if (aiProductWording)
                return aiProductWording;
        }
        return generalizeClaimForDraft(claim, evidence, variant);
    }
    return claim.claim;
}
function aiProductFoundationWording(claim) {
    const text = claim.claim.toLowerCase();
    if (/segmentation/.test(text) && /campaign creation/.test(text) && /preview workflows?/.test(text)) {
        return "Translated segmentation, campaign-creation, and preview-flow needs into scoped delivery decisions across platform constraints and release risks.";
    }
    if (/swashly/.test(text) && /multi-surface telecom campaign platform/.test(text)) {
        return "Supported discovery-to-release delivery for a multi-surface campaign product spanning web, API, backoffice, and deployment workflows.";
    }
    if (/multi-module edtech assessment platform/.test(text)) {
        return "Led product and technology direction across a multi-module EdTech assessment product spanning assessment, reporting, payments, and infrastructure workflows.";
    }
    return undefined;
}
function publicCoverage(profile, accepted) {
    return {
        roles: profile.roles.filter((role) => accepted.some((item) => claimMatchesEvidence(item.claim, role.evidenceIds))).length,
        projects: profile.projects.filter((project) => accepted.some((item) => claimMatchesEvidence(item.claim, project.evidenceIds))).length,
        skills: accepted.filter((item) => item.claim.type === "skill_claim").length,
        education: accepted.filter((item) => item.claim.type === "education_claim" || item.claim.type === "certification_claim").length
    };
}
function renderFinalResume(context, selection, counts) {
    const variant = getRoleVariant(context.roleKey);
    const publicName = context.publicProfile?.publicName ?? "[Name]";
    const headline = publicHeadlineOverride(context.publicProfile, context.roleKey) ?? variant.headline;
    const contactLine = renderPublicContactItems(context.publicProfile).join(" | ");
    const projects = groupProjectClaims(context.profile, selection.accepted, context.roleKey);
    const roles = groupRoleClaims(context.profile, selection.accepted, context.roleKey);
    const education = selection.accepted.filter((item) => item.claim.type === "education_claim" || item.claim.type === "certification_claim");
    const skills = selection.accepted.filter((item) => item.claim.type === "skill_claim");
    const roleLinkedClaimIds = selection.accepted
        .filter((item) => context.profile.roles.some((role) => claimMatchesEvidence(item.claim, role.evidenceIds)))
        .map((item) => item.claim.id);
    const assigned = new Set([
        ...projects.flatMap((group) => group.claims).map((item) => item.claim.id),
        ...roleLinkedClaimIds,
        ...education.map((item) => item.claim.id),
        ...skills.map((item) => item.claim.id)
    ]);
    const general = selectFinalGeneralClaims(context.roleKey, selection.accepted.filter((item) => !assigned.has(item.claim.id)));
    const summaryClaimLimit = context.roleKey === "ai-product" ? 1 : 2;
    const generatedSummary = (general.length > 0 ? general : selection.accepted).slice(0, summaryClaimLimit).map((item) => item.wording).join(" ");
    const summary = context.publicProfile?.publicSummaryOverride ?? generatedSummary;
    const strengthsHeading = context.roleKey === "ai-product" ? "AI Product Capabilities" : "Product and Technology Strengths";
    const experienceHeading = context.roleKey === "ai-product"
        ? "Career Foundation: Product and Platform Delivery"
        : "Professional Experience Highlights";
    const sections = [
        `# ${publicName}`,
        headline,
        contactLine,
        "## Summary",
        summary || "Public summary content is pending output-specific review.",
        general.length > summaryClaimLimit
            ? `## ${strengthsHeading}\n\n${renderBullets(general.slice(summaryClaimLimit, summaryClaimLimit + 4).map((item) => item.wording))}`
            : "",
        projects.length > 0 ? `## Selected Projects and Initiatives\n\n${projects.map(renderProjectGroup).join("\n\n")}` : "",
        roles.length > 0 ? `## ${experienceHeading}\n\n${roles.map(renderRoleGroup).join("\n\n")}` : "",
        skills.length > 0 ? `## Relevant Skills and Tools\n\n${renderBullets(skills.map((item) => item.wording))}` : "",
        education.length > 0 ? `## Education and Certifications\n\n${renderBullets(education.map((item) => item.wording))}` : ""
    ].filter(Boolean);
    if (selection.readiness === "not_ready") {
        sections.push("## Publication Checklist\n\nThis candidate is incomplete. Pending, draft-only, excluded, or privacy-restricted claims remain; review `final-public-checklist.md` before publication.");
    }
    return `${sections.join("\n\n")}\n`;
}
function renderFinalWebsite(context, selection, counts) {
    const variant = getRoleVariant(context.roleKey);
    const publicName = context.publicProfile?.publicName ?? "[Name]";
    const headline = publicHeadlineOverride(context.publicProfile, context.roleKey) ?? variant.headline;
    const publicLinks = renderPublicContactItems(context.publicProfile);
    const publicClaims = uniquePublicClaimsByWording(selection.accepted);
    const projects = groupProjectClaims(context.profile, publicClaims, context.roleKey);
    const roles = groupRoleClaims(context.profile, publicClaims, context.roleKey);
    const projectClaimIds = new Set(projects.flatMap((group) => group.claims.map((item) => item.claim.id)));
    const roleClaimIds = new Set(roles.flatMap((group) => group.claims.map((item) => item.claim.id)));
    const general = selectFinalGeneralClaims(context.roleKey, publicClaims.filter((item) => !projectClaimIds.has(item.claim.id) && !roleClaimIds.has(item.claim.id)));
    const heroCopy = context.publicProfile?.publicSummaryOverride
        ?? general[0]?.wording
        ?? "Public hero copy is pending output-specific review.";
    const websiteProjectClaimLimit = context.roleKey === "ai-product" ? 3 : 2;
    const seoClaims = context.roleKey === "ai-product" ? general : publicClaims;
    const sections = [
        "# Hero",
        `## ${publicName}`,
        `**${headline}**`,
        heroCopy,
        publicLinks.length > 0 ? `## Public Links\n\n${renderBullets(publicLinks)}` : "",
        general.length > 1 ? `## What I Do\n\n${renderBullets(general.slice(1, 5).map((item) => item.wording))}` : "",
        projects.length > 0 ? `## Selected Project Cards\n\n${projects.map((group) => renderWebsiteProjectGroup(group, websiteProjectClaimLimit)).join("\n\n")}` : "",
        context.roleKey === "ai-product" && roles.length > 0
            ? `## Product and Platform Foundation\n\n${roles.map(renderWebsiteRoleGroup).join("\n\n")}`
            : "",
        publicClaims.length >= 3
            ? `## SEO Draft\n\n- Title: ${publicName} | ${variant.displayName}\n- Description: ${context.publicProfile?.publicSummaryOverride ?? seoClaims.slice(0, context.roleKey === "ai-product" ? 1 : 2).map((item) => item.wording).join(" ")}`
            : ""
    ].filter(Boolean);
    if (selection.readiness === "not_ready") {
        sections.push("## Publication Checklist\n\nPublic website copy is incomplete; review `final-public-checklist.md` before publishing.");
    }
    return `${sections.join("\n\n")}\n`;
}
function renderFinalChecklist(decisions, selection) {
    const byDecision = (decision) => decisions.filter((item) => item.decision === decision);
    return `# Final Public Checklist

## Claims Approved

${renderDecisionList(byDecision("approve"), true)}

## Claims Revised

${renderDecisionList(byDecision("revise"), true)}

## Claims Excluded

${renderDecisionList(byDecision("exclude"))}

## Claims Still Pending

${renderDecisionList(byDecision("pending"))}

## Draft-Only Claims

${renderDecisionList(byDecision("draft_only"))}

## Public Profile Metadata

- Configured: ${selection.publicProfile.configured ? "yes" : "no"}
- Used in final output: ${selection.publicProfile.used ? "yes" : "no"}
- Public name: ${selection.publicProfile.publicNameUsed ? "applied" : "missing"}
- Headline override: ${selection.publicProfile.headlineOverrideUsed ? "applied" : "not set"}
- Public summary override: ${selection.publicProfile.publicSummaryOverrideUsed ? "applied" : "not set"}
- Contact fields used: ${selection.publicProfile.contactFieldsUsed.join(", ") || "none"}
- Education wording overrides applied: ${selection.publicProfile.educationOverrideClaimIds.join(", ") || "none"}
- Certification wording overrides applied: ${selection.publicProfile.certificationOverrideClaimIds.join(", ") || "none"}
- Config path: ${PUBLIC_PROFILE_FILE}

## Public Profile Warnings

${renderBullets(selection.publicProfile.warnings)}

## Privacy Warnings

${renderBullets(selection.warnings)}

## Missing Sections Due to Lack of Approval

${renderBullets(selection.missingSections)}

## Finalization Readiness

- ${selection.readiness === "ready" ? "ready" : "not ready"}
`;
}
function renderPublicContactItems(profile) {
    if (!profile)
        return [];
    return [
        profile.location,
        profile.email ? `Email: ${profile.email}` : undefined,
        profile.website ? `Website: ${profile.website}` : undefined,
        profile.linkedin ? `LinkedIn: ${profile.linkedin}` : undefined,
        profile.github ? `GitHub: ${profile.github}` : undefined
    ].filter((item) => Boolean(item));
}
function publicHeadlineOverride(profile, roleKey) {
    return profile?.headlineOverrides?.[roleKey]?.trim() ?? profile?.headlineOverride?.trim();
}
function groupProjectClaims(profile, accepted, roleKey) {
    return profile.projects.map((project) => {
        const matching = uniquePublicClaimsByWording(accepted.filter((item) => claimMatchesEvidence(item.claim, project.evidenceIds)));
        const roleAndTimeline = roleKey === "ai-product" ? aiProductProjectRoleAndTimeline(matching) : undefined;
        const status = roleKey === "ai-product" ? aiProductProjectStatus(project.name, matching) : undefined;
        const metadataIds = new Set(matching
            .filter((item) => item.claim.type === "project_claim" && (isProjectRoleClaim(item) || isProjectStatusClaim(item)))
            .map((item) => item.claim.id));
        return {
            name: project.name,
            claims: rankProjectClaimsForFinal(roleKey, project.name, matching.filter((item) => !metadataIds.has(item.claim.id))).slice(0, 3),
            roleAndTimeline,
            status
        };
    }).filter((group) => group.claims.length > 0 || Boolean(group.roleAndTimeline || group.status));
}
function aiProductProjectRoleAndTimeline(claims) {
    const roleClaim = claims.find(isProjectRoleClaim);
    if (!roleClaim)
        return undefined;
    const context = roleClaim.wording.match(/(?:—|\s-\s)\s*(.+)$/)?.[1]?.trim();
    if (!context)
        return undefined;
    return context.replace(/,\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[–-]\s*(?:Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}))\.?$/i, " | $1");
}
function aiProductProjectStatus(projectName, claims) {
    const combined = claims.map((item) => `${item.claim.claim} ${item.wording}`).join(" ").toLowerCase();
    if (/signalboard|\bsb\b/i.test(projectName) && /market and competitive intelligence product experiment/.test(combined)) {
        return "AI-assisted market and competitive intelligence product experiment";
    }
    if (/insightarleans/i.test(projectName) && /computer-vision prototype/.test(combined)) {
        return "AI/mobile computer-vision prototype";
    }
    return undefined;
}
function isProjectRoleClaim(item) {
    return /\bproduct and technical lead\b/i.test(`${item.claim.claim} ${item.wording}`);
}
function isProjectStatusClaim(item) {
    return /\bproduct experiment\b/i.test(`${item.claim.claim} ${item.wording}`);
}
function rankProjectClaimsForFinal(roleKey, projectName, claims) {
    if (roleKey !== "ai-product")
        return claims;
    return [...claims].sort((a, b) => aiProductProjectPriority(projectName, b) - aiProductProjectPriority(projectName, a)
        || a.claim.id.localeCompare(b.claim.id));
}
function aiProductProjectPriority(projectName, item) {
    const project = projectName.toLowerCase();
    const text = `${item.claim.claim} ${item.wording}`.toLowerCase();
    if (project.includes("signalboard")) {
        if (/market-signal intelligence|signal extraction/.test(text))
            return 1000;
        if (/action-?provenance/.test(text))
            return 950;
        if (/evaluation scenarios?/.test(text) && /briefings?|source signals?/.test(text))
            return 900;
        if (/evidence-backed insights?|traceability|decision-support/.test(text))
            return 850;
        if (/app(?:-layer)? experience/.test(text) && /backend\/data configuration/.test(text))
            return 800;
        if (/market and competitive intelligence product experiment/.test(text))
            return 750;
        if (/problem framing/.test(text) && /experiment design/.test(text))
            return 700;
    }
    if (project.includes("insightarleans")) {
        if (/computer-vision prototype/.test(text) && /object detection/.test(text))
            return 1000;
        if (/iterative testing/.test(text) && /qualitative feedback/.test(text))
            return 950;
        if (/camera flows?/.test(text) && /overlay ux/.test(text))
            return 900;
    }
    return 0;
}
function selectFinalGeneralClaims(roleKey, claims) {
    if (roleKey !== "ai-product")
        return claims;
    const ranked = [...claims]
        .filter((item) => !["project_claim", "role_claim", "skill_claim", "education_claim", "certification_claim"].includes(item.claim.type))
        .filter((item) => !isRepetitiveAiProductGeneralClaim(item))
        .sort((a, b) => aiProductGeneralPriority(b) - aiProductGeneralPriority(a) || a.claim.id.localeCompare(b.claim.id));
    const themes = new Set();
    return ranked.filter((item) => {
        const theme = aiProductGeneralTheme(item);
        if (!theme)
            return true;
        if (themes.has(theme))
            return false;
        themes.add(theme);
        return true;
    });
}
function isRepetitiveAiProductGeneralClaim(item) {
    const text = `${item.claim.claim} ${item.wording}`.toLowerCase();
    return /built ai-assisted product workflows, prototypes, and technical evaluation loops/.test(text)
        || /currently building and validating ai-assisted product workflows/.test(text);
}
function aiProductGeneralPriority(item) {
    const text = `${item.claim.claim} ${item.wording}`.toLowerCase();
    if (/ai product manager and product-minded technology leader/.test(text))
        return 1000;
    if (/built ai-assisted product workflows, prototypes, and technical evaluation loops/.test(text))
        return 950;
    if (/app(?:-layer)? experience/.test(text) && /backend\/data configuration/.test(text))
        return 900;
    if (/evidence-backed insights?/.test(text) && /traceability/.test(text))
        return 850;
    if (/evidence-backed decision support/.test(text))
        return 825;
    if (/currently building and validating ai-assisted product workflows/.test(text))
        return 800;
    if (/problem framing/.test(text) && /roadmap definition/.test(text))
        return 750;
    return 0;
}
function aiProductGeneralTheme(item) {
    const text = `${item.claim.claim} ${item.wording}`.toLowerCase();
    if (/evidence-backed/.test(text) && /(?:decision support|decision-support|traceability)/.test(text))
        return "evidence-backed-decision-support";
    return undefined;
}
function groupRoleClaims(profile, accepted, roleKey) {
    const groups = profile.roles.map((role) => ({
        title: role.title,
        company: role.company,
        dateRange: role.dateRange,
        claims: uniquePublicClaimsByWording(accepted.filter((item) => claimMatchesEvidence(item.claim, role.evidenceIds))).slice(0, 3)
    })).filter((group) => group.claims.length > 0);
    if (roleKey !== "ai-product")
        return groups;
    const seen = new Set();
    return groups.map((group) => ({
        ...group,
        claims: group.claims.filter((item) => {
            const key = normalizedPublicWording(item.wording);
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        })
    })).filter((group) => group.claims.length > 0);
}
function claimMatchesEvidence(claim, evidenceIds) {
    const ids = new Set(evidenceIds);
    return claim.supportingEvidenceIds.some((id) => ids.has(id))
        || Boolean(claim.parentRoleId && ids.has(claim.parentRoleId))
        || Boolean(claim.parentProjectId && ids.has(claim.parentProjectId));
}
function renderProjectGroup(group) {
    const metadata = [
        group.roleAndTimeline ? `**Role and timeline:** ${group.roleAndTimeline}` : undefined,
        group.status ? `**Status:** ${group.status}` : undefined
    ].filter((item) => Boolean(item));
    return `### ${group.name}\n\n${[...metadata, renderBullets(group.claims.map((item) => item.wording))].join("\n\n")}`;
}
function renderWebsiteProjectGroup(group, limit = 2) {
    const metadata = [
        group.roleAndTimeline ? `**Role and timeline:** ${group.roleAndTimeline}` : undefined,
        group.status ? `**Status:** ${group.status}` : undefined
    ].filter((item) => Boolean(item));
    return `### ${group.name}\n\n${[...metadata, renderBullets(group.claims.slice(0, limit).map((item) => item.wording))].join("\n\n")}`;
}
function renderRoleGroup(group) {
    return `### ${group.company ?? "[Company]"}\n\n**${group.title ?? "[Role]"}**${group.dateRange ? ` | ${group.dateRange}` : ""}\n\n${renderBullets(group.claims.map((item) => item.wording))}`;
}
function renderWebsiteRoleGroup(group) {
    return `### ${group.company ?? "[Company]"}\n\n**${group.title ?? "[Role]"}**${group.dateRange ? ` | ${group.dateRange}` : ""}\n\n${renderBullets(group.claims.slice(0, 2).map((item) => item.wording))}`;
}
function renderDecisionList(decisions, includeWording = false) {
    if (decisions.length === 0)
        return "- None.";
    return decisions.map((decision) => {
        const wording = includeWording && decision.approvedPublicWording ? `: ${decision.approvedPublicWording}` : "";
        return `- ${decision.claimId}${wording}`;
    }).join("\n");
}
function renderBullets(values) {
    const uniqueValues = uniqueInOrder(values.map((value) => value.trim()).filter(Boolean));
    return uniqueValues.length > 0 ? uniqueValues.map((value) => `- ${value}`).join("\n") : "- None.";
}
function uniquePublicClaimsByWording(claims) {
    const seen = new Set();
    return claims.filter((item) => {
        const key = normalizedPublicWording(item.wording);
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
function normalizedPublicWording(wording) {
    return wording.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}
function emptyDecisionCounts() {
    return { pending: 0, approve: 0, revise: 0, draft_only: 0, exclude: 0 };
}
function countDecisions(decisions) {
    const counts = emptyDecisionCounts();
    for (const decision of decisions)
        counts[decision.decision] += 1;
    return counts;
}
async function registerFinalOutput(workspace, manifest) {
    const outputManifestPath = path.join(workspace, OUTPUT_MANIFEST_FILE);
    const registry = await readJson(outputManifestPath, {
        schemaVersion: 1,
        updatedAt: manifest.finalizedAt,
        outputs: []
    });
    const entry = {
        id: manifest.outputId,
        variantRoleKey: manifest.roleKey,
        generatedFiles: manifest.generatedFiles,
        generatedAt: manifest.finalizedAt,
        profileFingerprint: manifest.profileFingerprint,
        claimIdsUsed: manifest.claimIdsUsed,
        evidenceIdsUsed: manifest.evidenceIdsUsed,
        publicationStatus: "final",
        freshness: "current"
    };
    const outputs = registry.outputs.filter((output) => output.id !== entry.id);
    outputs.push(entry);
    outputs.sort((a, b) => a.variantRoleKey.localeCompare(b.variantRoleKey) || a.publicationStatus.localeCompare(b.publicationStatus));
    await writeJsonAtomic(outputManifestPath, { schemaVersion: 1, updatedAt: manifest.finalizedAt, outputs });
}
