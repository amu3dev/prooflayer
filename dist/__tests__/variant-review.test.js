import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createRefreshBaseline } from "../change-detector.js";
import { listVariantStatuses } from "../variant-generator.js";
import { formatStatusSummary, getWorkspaceStatus } from "../update-impact.js";
import { finalizeVariant, getVariantReviewStatus, initializeVariantReview } from "../variant-review.js";
describe("Slice 1.5 output-specific variant review", () => {
    it("creates pending decisions without overwriting existing decisions", async () => {
        const workspace = await createReviewWorkspace();
        const reviewPath = path.join(workspace, "outputs/variants/tpm/review-decisions.json");
        const existing = {
            schemaVersion: 1,
            roleKey: "tpm",
            createdAt: "2026-07-15T16:00:00.000Z",
            updatedAt: "2026-07-15T16:00:00.000Z",
            profileFingerprint: "profile-fingerprint",
            sourceGenerationManifest: "outputs/variants/tpm/generation-manifest.json",
            decisions: [{ claimId: "claim_approve", decision: "approve", notes: "Keep this decision." }]
        };
        await writeFile(reviewPath, JSON.stringify(existing), "utf8");
        const status = await initializeVariantReview(workspace, "tpm", new Date("2026-07-15T17:00:00.000Z"));
        const persisted = JSON.parse(await readFile(reviewPath, "utf8"));
        expect(persisted.decisions.find((item) => item.claimId === "claim_approve")).toEqual(existing.decisions[0]);
        expect(persisted.decisions.find((item) => item.claimId === "claim_pending")?.decision).toBe("pending");
        expect(persisted.decisions.find((item) => item.claimId === "claim_manifest_only")?.decision).toBe("pending");
        expect(persisted.decisions.find((item) => item.claimId === "claim_unresolved_only")?.decision).toBe("pending");
        expect(persisted.decisions.find((item) => item.claimId === "claim_a0d06ff53160")?.decision).toBe("pending");
        expect(persisted.decisions.find((item) => item.claimId === "claim_8c7c3c3e8002")?.decision).toBe("pending");
        expect(persisted.decisions.find((item) => item.claimId === "claim_ffda3bd4dbfc")?.decision).toBe("pending");
        expect(persisted.decisions.find((item) => item.claimId === "claim_21082bbbbc33")?.decision).toBe("pending");
        expect(persisted.decisions.find((item) => item.claimId === "claim_871911b85bcf")?.decision).toBe("pending");
        expect(persisted.decisions.find((item) => item.claimId === "claim_9379f09c8b8c")?.decision).toBe("pending");
        expect(persisted.decisions.find((item) => item.claimId === "claim_summary")?.decision).toBe("pending");
        expect(status.counts.approve).toBe(1);
        expect(status.counts.pending).toBe(16);
        expect(status.finalizationAllowed).toBe(true);
    });
    it("uses canonical JSON review scope and ignores derived Markdown edits", async () => {
        const workspace = await createReviewWorkspace();
        const root = path.join(workspace, "outputs/variants/tpm");
        const unresolvedPath = path.join(root, "unresolved-claims.md");
        await writeFile(unresolvedPath, "## claim_not_in_manifest\n\nThis derived view was edited.\n", "utf8");
        await initializeVariantReview(workspace, "tpm", new Date("2026-07-15T17:00:00.000Z"));
        const review = JSON.parse(await readFile(path.join(root, "review-decisions.json"), "utf8"));
        expect(review.decisions.some((item) => item.claimId === "claim_unresolved_only")).toBe(true);
        expect(review.decisions.some((item) => item.claimId === "claim_not_in_manifest")).toBe(false);
        await writeFile(unresolvedPath, "", "utf8");
        const status = await initializeVariantReview(workspace, "tpm", new Date("2026-07-15T18:00:00.000Z"));
        expect(status.total).toBe(review.decisions.length);
    });
    it("finalizes only reviewed public wording and tracks final output separately", async () => {
        const workspace = await createReviewWorkspace();
        await initializeVariantReview(workspace, "tpm");
        const reviewPath = path.join(workspace, "outputs/variants/tpm/review-decisions.json");
        const review = JSON.parse(await readFile(reviewPath, "utf8"));
        review.decisions = review.decisions.map((item) => {
            if (item.claimId === "claim_approve")
                return { ...item, decision: "approve" };
            if (item.claimId === "claim_revise") {
                return { ...item, decision: "revise", approvedPublicWording: "Built a reviewed public project workflow." };
            }
            if (item.claimId === "claim_draft")
                return { ...item, decision: "draft_only" };
            if (item.claimId === "claim_exclude")
                return { ...item, decision: "exclude" };
            if (["claim_unknown", "claim_blocked", "claim_metric"].includes(item.claimId))
                return { ...item, decision: "approve" };
            return item;
        });
        await writeFile(reviewPath, JSON.stringify(review), "utf8");
        const manifest = await finalizeVariant(workspace, "tpm", new Date("2026-07-15T18:00:00.000Z"));
        const root = path.join(workspace, "outputs/variants/tpm");
        const resume = await readFile(path.join(root, "final-resume.md"), "utf8");
        const website = await readFile(path.join(root, "final-website-copy.md"), "utf8");
        const checklist = await readFile(path.join(root, "final-public-checklist.md"), "utf8");
        expect(resume).toContain("Built a reviewed public project workflow.");
        expect(website).toContain("Built a reviewed public project workflow.");
        expect(resume).not.toContain("Pending private draft wording");
        expect(resume).not.toContain("Draft-only wording");
        expect(resume).not.toContain("Excluded wording");
        expect(resume).not.toContain("Blocked secret wording");
        expect(resume).not.toContain("500 users");
        expect(resume).not.toMatch(/^\s*\|/m);
        expect(website).not.toMatch(/^\s*\|/m);
        expect(checklist).toContain("claim_pending");
        expect(checklist).toContain("unknown visibility requires explicit approved public wording");
        expect(checklist).toContain("> GENERATED, READ-ONLY VIEW");
        expect(checklist).toContain("## Current State");
        expect(checklist).toContain("## Next Action");
        expect(checklist.indexOf("Pending private draft wording"))
            .toBeLessThan(checklist.indexOf("claim_pending"));
        expect(checklist.indexOf("Built a reviewed public project workflow."))
            .toBeLessThan(checklist.indexOf("claim_revise"));
        expect(checklist).toContain("Final-output eligibility: excluded from final output");
        expect(checklist).not.toContain("Unknown source wording");
        expect(checklist).not.toContain("Blocked secret wording");
        expect(checklist).toContain("Source claim wording is withheld");
        expect(manifest.profileFingerprint).toBe("profile-fingerprint");
        expect(manifest.claimIdsUsed).toEqual(expect.arrayContaining(["claim_approve", "claim_revise"]));
        expect(manifest.claimIdsUsed).not.toEqual(expect.arrayContaining(["claim_pending", "claim_draft", "claim_exclude", "claim_blocked", "claim_metric", "claim_unknown"]));
        expect(manifest.decisionCounts.pending).toBe(10);
        expect(manifest.finalizationReadiness).toBe("not_ready");
        const persisted = JSON.parse(await readFile(path.join(root, "final-manifest.json"), "utf8"));
        expect(persisted.finalizedAt).toBe("2026-07-15T18:00:00.000Z");
        const registry = JSON.parse(await readFile(path.join(workspace, "outputs/output-manifest.json"), "utf8"));
        expect(registry.outputs.map((output) => output.publicationStatus).sort()).toEqual(["draft", "final"]);
        const statuses = await listVariantStatuses(workspace);
        const tpm = statuses.find((status) => status.roleKey === "tpm");
        expect(tpm?.draft.generated).toBe(true);
        expect(tpm?.final.generated).toBe(true);
        expect(tpm?.final.readiness).toBe("not_ready");
        const workspaceStatus = formatStatusSummary(await getWorkspaceStatus(workspace));
        expect(workspaceStatus).toContain("draft 1, final 1");
    });
    it("requires explicit public wording for unknown visibility", async () => {
        const workspace = await createReviewWorkspace();
        await initializeVariantReview(workspace, "tpm");
        const reviewPath = path.join(workspace, "outputs/variants/tpm/review-decisions.json");
        const review = JSON.parse(await readFile(reviewPath, "utf8"));
        review.decisions = review.decisions.map((item) => item.claimId === "claim_unknown"
            ? { ...item, decision: "approve", approvedPublicWording: "Validated a public-safe product workflow." }
            : item);
        await writeFile(reviewPath, JSON.stringify(review), "utf8");
        const manifest = await finalizeVariant(workspace, "tpm");
        const resume = await readFile(path.join(workspace, "outputs/variants/tpm/final-resume.md"), "utf8");
        expect(manifest.claimIdsUsed).toContain("claim_unknown");
        expect(resume).toContain("Validated a public-safe product workflow.");
    });
    it("renders reviewed completeness claims and removes duplicate website bullets", async () => {
        const workspace = await createReviewWorkspace();
        await initializeVariantReview(workspace, "tpm");
        const reviewPath = path.join(workspace, "outputs/variants/tpm/review-decisions.json");
        const review = JSON.parse(await readFile(reviewPath, "utf8"));
        review.decisions = review.decisions.map((item) => {
            if (item.claimId === "claim_summary") {
                return { ...item, decision: "revise", approvedPublicWording: "Technical Product Manager connecting product strategy with platform delivery." };
            }
            if (item.claimId === "claim_a0d06ff53160") {
                return { ...item, decision: "revise", approvedPublicWording: "Product and delivery tools: Jira, Linear, Notion, Figma, and GitHub Projects." };
            }
            if (item.claimId === "claim_8c7c3c3e8002") {
                return { ...item, decision: "revise", approvedPublicWording: "Technical Product Manager Certification, Knowledge Officer." };
            }
            if (item.claimId === "claim_ffda3bd4dbfc") {
                return { ...item, decision: "revise", approvedPublicWording: "Meta Product Management Scholarship, Product Manager track." };
            }
            if (item.claimId === "claim_871911b85bcf") {
                return { ...item, decision: "revise", approvedPublicWording: "Bachelor’s Degree in Computer Science, Modern Academy Maadi." };
            }
            if (item.claimId === "claim_9379f09c8b8c") {
                return { ...item, decision: "revise", approvedPublicWording: "Diploma in Project Management, Regional IT Institute." };
            }
            if (item.claimId === "claim_21082bbbbc33")
                return { ...item, decision: "approve" };
            if (["claim_approve", "claim_manifest_only"].includes(item.claimId))
                return { ...item, decision: "approve" };
            if (item.claimId === "claim_draft")
                return { ...item, decision: "draft_only" };
            return item;
        });
        await writeFile(reviewPath, JSON.stringify(review), "utf8");
        await finalizeVariant(workspace, "tpm");
        const resume = await readFile(path.join(workspace, "outputs/variants/tpm/final-resume.md"), "utf8");
        const website = await readFile(path.join(workspace, "outputs/variants/tpm/final-website-copy.md"), "utf8");
        expect(resume).toContain("## Relevant Skills and Tools");
        expect(resume).toContain("Product and delivery tools: Jira, Linear, Notion, Figma, and GitHub Projects.");
        expect(resume).toContain("## Education and Certifications");
        expect(resume).toContain("Technical Product Manager Certification, Knowledge Officer.");
        expect(resume).toContain("Meta Product Management Scholarship, Product Manager track.");
        expect(resume).toContain("Bachelor’s Degree in Computer Science, Modern Academy Maadi.");
        expect(resume).toContain("Diploma in Project Management, Regional IT Institute.");
        expect(resume).not.toContain("Pending private draft wording");
        expect(resume).not.toContain("Draft-only wording");
        const websiteBullets = website.split("\n").filter((line) => line.startsWith("- "));
        expect(new Set(websiteBullets).size).toBe(websiteBullets.length);
    });
    it("reports review status separately from publication readiness", async () => {
        const workspace = await createReviewWorkspace();
        await initializeVariantReview(workspace, "tpm");
        const status = await getVariantReviewStatus(workspace, "tpm");
        expect(status.reviewExists).toBe(true);
        expect(status.finalizationAllowed).toBe(true);
        expect(status.publicationReadiness).toBe("not_ready");
        expect(status.counts.pending).toBe(17);
    });
    it("applies public metadata and final wording overrides without changing drafts or evidence", async () => {
        const workspace = await createReviewWorkspace();
        const root = path.join(workspace, "outputs/variants/tpm");
        const draftPath = path.join(root, "resume-draft.md");
        const draftBefore = "# DRAFT\n\nThis file must remain unchanged.\n";
        await writeFile(draftPath, draftBefore, "utf8");
        const evidencePath = path.join(workspace, "kb/evidence-items.json");
        const claimsPath = path.join(workspace, "kb/claims.json");
        const evidenceBefore = await readFile(evidencePath, "utf8");
        const claimsBefore = await readFile(claimsPath, "utf8");
        const publicProfile = {
            schemaVersion: 1,
            publicName: "Ahmed Yosry",
            headlineOverride: "Technical Product Manager | Reviewed Public Headline",
            github: "https://github.com/amu3dev",
            educationWordingOverrides: {
                claim_871911b85bcf: "Bachelor’s Degree in Computer Science — Modern Academy Maadi",
                claim_9379f09c8b8c: "Diploma in Project Management — Regional IT Institute"
            },
            certificationWordingOverrides: {
                claim_21082bbbbc33: "Sun Certified Java Programmer",
                claim_8c7c3c3e8002: "Technical Product Manager Certification — Knowledge Officer",
                claim_ffda3bd4dbfc: "Meta Product Management Scholarship — Product Manager Track"
            }
        };
        await mkdir(path.join(workspace, "config"), { recursive: true });
        await writeFile(path.join(workspace, "config/public-profile.json"), JSON.stringify(publicProfile), "utf8");
        await initializeVariantReview(workspace, "tpm");
        const reviewPath = path.join(root, "review-decisions.json");
        const review = JSON.parse(await readFile(reviewPath, "utf8"));
        review.decisions = review.decisions.map((item) => {
            if (item.claimId === "claim_revise") {
                return { ...item, decision: "revise", approvedPublicWording: "Built a reviewed public project workflow." };
            }
            if (item.claimId === "claim_summary") {
                return { ...item, decision: "revise", approvedPublicWording: "Technical product leadership summary." };
            }
            if ([
                "claim_approve",
                "claim_manifest_only",
                "claim_21082bbbbc33",
                "claim_871911b85bcf",
                "claim_8c7c3c3e8002",
                "claim_9379f09c8b8c",
                "claim_ffda3bd4dbfc"
            ].includes(item.claimId))
                return { ...item, decision: "approve" };
            return { ...item, decision: "exclude" };
        });
        await writeFile(reviewPath, JSON.stringify(review), "utf8");
        const now = new Date("2026-07-15T19:00:00.000Z");
        const manifest = await finalizeVariant(workspace, "tpm", now);
        const firstResume = await readFile(path.join(root, "final-resume.md"), "utf8");
        const firstWebsite = await readFile(path.join(root, "final-website-copy.md"), "utf8");
        const checklist = await readFile(path.join(root, "final-public-checklist.md"), "utf8");
        await finalizeVariant(workspace, "tpm", now);
        const secondResume = await readFile(path.join(root, "final-resume.md"), "utf8");
        const secondWebsite = await readFile(path.join(root, "final-website-copy.md"), "utf8");
        expect(firstResume).toContain("# Ahmed Yosry");
        expect(firstResume).toContain("Technical Product Manager | Reviewed Public Headline");
        expect(firstWebsite).toContain("## Ahmed Yosry");
        expect(firstWebsite).toContain("GitHub: https://github.com/amu3dev");
        expect(firstResume).not.toContain("[Name]");
        expect(firstWebsite).not.toContain("[Name]");
        expect(firstResume).toContain("Bachelor’s Degree in Computer Science — Modern Academy Maadi");
        expect(firstResume).toContain("Diploma in Project Management — Regional IT Institute");
        expect(firstResume).toContain("Sun Certified Java Programmer");
        expect(firstResume).toContain("Technical Product Manager Certification — Knowledge Officer");
        expect(firstResume).toContain("Meta Product Management Scholarship — Product Manager Track");
        expect(firstResume).not.toContain("requires final wording review");
        expect(checklist).toContain("- Used in final output: yes");
        expect(checklist).toContain("- Public name: applied");
        expect(checklist).toContain("## Public Profile Warnings\n\n- None.");
        expect(manifest.publicProfile.publicNameUsed).toBe(true);
        expect(manifest.publicProfile.educationOverrideClaimIds).toHaveLength(2);
        expect(manifest.publicProfile.certificationOverrideClaimIds).toHaveLength(3);
        expect(secondResume).toBe(firstResume);
        expect(secondWebsite).toBe(firstWebsite);
        expect(await readFile(draftPath, "utf8")).toBe(draftBefore);
        expect(await readFile(evidencePath, "utf8")).toBe(evidenceBefore);
        expect(await readFile(claimsPath, "utf8")).toBe(claimsBefore);
    });
    it("warns when publicName is missing", async () => {
        const workspace = await createReviewWorkspace();
        await mkdir(path.join(workspace, "config"), { recursive: true });
        await writeFile(path.join(workspace, "config/public-profile.json"), JSON.stringify({ schemaVersion: 1 }), "utf8");
        await initializeVariantReview(workspace, "tpm");
        await finalizeVariant(workspace, "tpm");
        const checklist = await readFile(path.join(workspace, "outputs/variants/tpm/final-public-checklist.md"), "utf8");
        expect(checklist).toContain("Public name is missing; [Name] remains unresolved.");
    });
    it("creates an all-pending AI Product review scope and reports status", async () => {
        const workspace = await createReviewWorkspace();
        await addVariantFixture(workspace, "ai-product");
        const status = await initializeVariantReview(workspace, "ai-product", new Date("2026-07-16T09:00:00.000Z"));
        const reviewPath = path.join(workspace, "outputs/variants/ai-product/review-decisions.json");
        const review = JSON.parse(await readFile(reviewPath, "utf8"));
        const statusAgain = await getVariantReviewStatus(workspace, "ai-product");
        expect(review.roleKey).toBe("ai-product");
        expect(review.decisions.length).toBeGreaterThan(0);
        expect(review.decisions.every((item) => item.decision === "pending")).toBe(true);
        expect(review.decisions.map((item) => item.claimId)).toEqual(expect.arrayContaining([
            "claim_manifest_only",
            "claim_unresolved_only",
            "claim_ai_validation",
            "claim_a0d06ff53160"
        ]));
        expect(status.counts.pending).toBe(review.decisions.length);
        expect(statusAgain.publicationReadiness).toBe("not_ready");
        expect(statusAgain.finalizationAllowed).toBe(true);
    });
    it("finalizes AI Product with reviewed wording, public metadata, and pending exclusions", async () => {
        const workspace = await createReviewWorkspace();
        await addVariantFixture(workspace, "ai-product");
        await mkdir(path.join(workspace, "config"), { recursive: true });
        const publicProfile = {
            schemaVersion: 1,
            publicName: "Ahmed Yosry",
            headlineOverrides: {
                tpm: "Technical Product Manager | Reviewed TPM Headline",
                "ai-product": "AI Product Manager | Reviewed AI Product Headline"
            },
            github: "https://github.com/amu3dev"
        };
        await writeFile(path.join(workspace, "config/public-profile.json"), JSON.stringify(publicProfile), "utf8");
        await initializeVariantReview(workspace, "ai-product");
        const initialManifest = await finalizeVariant(workspace, "ai-product", new Date("2026-07-16T10:00:00.000Z"));
        const root = path.join(workspace, "outputs/variants/ai-product");
        const initialResume = await readFile(path.join(root, "final-resume.md"), "utf8");
        expect(initialManifest.claimIdsUsed).toEqual([]);
        expect(initialResume).toContain("# Ahmed Yosry");
        expect(initialResume).toContain("AI Product Manager | Reviewed AI Product Headline");
        expect(initialResume).not.toContain("Pending private draft wording");
        const reviewPath = path.join(root, "review-decisions.json");
        const review = JSON.parse(await readFile(reviewPath, "utf8"));
        review.decisions = review.decisions.map((item) => {
            if (item.claimId === "claim_ai_validation") {
                return {
                    ...item,
                    decision: "revise",
                    approvedPublicWording: "Designed AI-assisted product workflows spanning app experience, backend configuration, technical evaluation, and product validation."
                };
            }
            if (item.claimId === "claim_draft")
                return { ...item, decision: "draft_only" };
            if (item.claimId === "claim_exclude")
                return { ...item, decision: "exclude" };
            return item;
        });
        await writeFile(reviewPath, JSON.stringify(review), "utf8");
        const manifest = await finalizeVariant(workspace, "ai-product", new Date("2026-07-16T11:00:00.000Z"));
        const resume = await readFile(path.join(root, "final-resume.md"), "utf8");
        const website = await readFile(path.join(root, "final-website-copy.md"), "utf8");
        const checklist = await readFile(path.join(root, "final-public-checklist.md"), "utf8");
        expect(manifest.claimIdsUsed).toEqual(["claim_ai_validation"]);
        expect(resume).toContain("Designed AI-assisted product workflows spanning app experience, backend configuration, technical evaluation, and product validation.");
        expect(website).toContain("Designed AI-assisted product workflows spanning app experience, backend configuration, technical evaluation, and product validation.");
        expect(resume).not.toContain("Pending private draft wording");
        expect(resume).not.toContain("Draft-only wording");
        expect(resume).not.toContain("Excluded wording");
        expect(checklist).toContain("## Claims Still Pending");
        expect(checklist).toContain("- Public name: applied");
        expect(manifest.publicProfile.headlineOverrideUsed).toBe(true);
        expect(manifest.finalizationReadiness).toBe("not_ready");
    });
    it("tracks TPM and AI Product final outputs independently and preserves TPM review", async () => {
        const workspace = await createReviewWorkspace();
        await initializeVariantReview(workspace, "tpm");
        const tpmReviewPath = path.join(workspace, "outputs/variants/tpm/review-decisions.json");
        const tpmReview = JSON.parse(await readFile(tpmReviewPath, "utf8"));
        tpmReview.decisions = tpmReview.decisions.map((item) => item.claimId === "claim_approve"
            ? { ...item, decision: "approve" }
            : item);
        await writeFile(tpmReviewPath, JSON.stringify(tpmReview), "utf8");
        const tpmBefore = await readFile(tpmReviewPath, "utf8");
        await addVariantFixture(workspace, "ai-product");
        await initializeVariantReview(workspace, "ai-product");
        expect(await readFile(tpmReviewPath, "utf8")).toBe(tpmBefore);
        const tpmFinal = await finalizeVariant(workspace, "tpm", new Date("2026-07-16T12:00:00.000Z"));
        const aiFinal = await finalizeVariant(workspace, "ai-product", new Date("2026-07-16T12:01:00.000Z"));
        const registry = JSON.parse(await readFile(path.join(workspace, "outputs/output-manifest.json"), "utf8"));
        const finalEntries = registry.outputs.filter((output) => output.publicationStatus === "final");
        expect(tpmFinal.roleKey).toBe("tpm");
        expect(aiFinal.roleKey).toBe("ai-product");
        expect(finalEntries.map((output) => output.variantRoleKey).sort()).toEqual(["ai-product", "tpm"]);
        const currentStatuses = await listVariantStatuses(workspace, false);
        expect(currentStatuses.find((status) => status.roleKey === "tpm")?.final.freshness).toBe("current");
        expect(currentStatuses.find((status) => status.roleKey === "ai-product")?.final.freshness).toBe("current");
        const baselinePath = path.join(workspace, "kb/update-baseline.json");
        const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
        baseline.profileFingerprint = "changed-profile-fingerprint";
        await writeFile(baselinePath, JSON.stringify(baseline), "utf8");
        const staleStatuses = await listVariantStatuses(workspace, false);
        expect(staleStatuses.find((status) => status.roleKey === "tpm")?.final.freshness).toBe("stale");
        expect(staleStatuses.find((status) => status.roleKey === "ai-product")?.final.freshness).toBe("stale");
    });
    it("prioritizes AI Product evaluation, traceability, and validation without changing TPM final output", async () => {
        const workspace = await createReviewWorkspace();
        await initializeVariantReview(workspace, "tpm");
        const tpmRoot = path.join(workspace, "outputs/variants/tpm");
        const tpmReviewPath = path.join(tpmRoot, "review-decisions.json");
        const tpmReview = JSON.parse(await readFile(tpmReviewPath, "utf8"));
        tpmReview.decisions = tpmReview.decisions.map((item) => {
            if (item.claimId === "claim_approve")
                return { ...item, decision: "approve" };
            if (item.claimId === "claim_revise") {
                return { ...item, decision: "revise", approvedPublicWording: "Built a reviewed public project workflow." };
            }
            return { ...item, decision: "exclude" };
        });
        await writeFile(tpmReviewPath, JSON.stringify(tpmReview), "utf8");
        await finalizeVariant(workspace, "tpm", new Date("2026-07-16T13:00:00.000Z"));
        const tpmFiles = ["final-resume.md", "final-website-copy.md", "final-public-checklist.md", "final-manifest.json"];
        const tpmBefore = new Map(await Promise.all(tpmFiles.map(async (file) => [file, await readFile(path.join(tpmRoot, file), "utf8")])));
        await addAiProductQualityEvidence(workspace);
        await addVariantFixture(workspace, "ai-product");
        await mkdir(path.join(workspace, "config"), { recursive: true });
        await writeFile(path.join(workspace, "config/public-profile.json"), JSON.stringify({
            schemaVersion: 1,
            publicName: "Ahmed Yosry",
            headlineOverrides: { "ai-product": "AI Product Manager | Reviewed AI Product Headline" }
        }), "utf8");
        await initializeVariantReview(workspace, "ai-product");
        const reviewedWording = new Map([
            ["claim_ai_summary_quality", "AI Product Manager and product-minded technology leader connecting product discovery, technical tradeoffs, and hands-on AI product validation."],
            ["claim_ai_workflow_quality", "Built AI-assisted product workflows, prototypes, and technical evaluation loops."],
            ["claim_ai_signal_role_quality", "SB (SignalBoard) — Product and Technical Lead, Sep 2025–Present."],
            ["claim_ai_signal_status_quality", "Built SignalBoard as an AI-assisted market and competitive intelligence product experiment."],
            ["claim_ai_market_quality", "Led an AI-assisted market-signal intelligence initiative spanning signal extraction and repeatable decision-support workflows."],
            ["claim_ai_provenance_quality", "Built stricter action-provenance checks for AI-generated recommendations to improve traceability and evidence support."],
            ["claim_ai_evaluation_quality", "Added evaluation scenarios to test whether generated briefings were supported by real source signals."],
            ["claim_ai_traceability_quality", "Improved product thinking around evidence-backed insights, traceability, and decision-support workflows."],
            ["claim_ai_backend_quality", "Designed AI-assisted workflows connecting app experience, backend/data configuration, technical evaluation, and product validation."],
            ["claim_ai_insight_role_quality", "InSightARLeans — Product and Technical Lead, Mar 2025–Present."],
            ["claim_ai_prototype_quality", "Built and iterated a React Native and Expo computer-vision prototype exploring object detection and contextual overlays using TensorFlow.js."],
            ["claim_ai_mobile_validation_quality", "Validated the AI/mobile experience through iterative testing and qualitative feedback."],
            ["claim_ai_tradeoff_quality", "Worked through product and technical tradeoffs across camera flows, overlay UX, responsiveness, and mobile interaction design."]
        ]);
        const aiRoot = path.join(workspace, "outputs/variants/ai-product");
        const aiReviewPath = path.join(aiRoot, "review-decisions.json");
        const aiReview = JSON.parse(await readFile(aiReviewPath, "utf8"));
        aiReview.decisions = aiReview.decisions.map((item) => {
            const wording = reviewedWording.get(item.claimId);
            if (wording)
                return { ...item, decision: "revise", approvedPublicWording: wording };
            if (item.claimId === "claim_approve")
                return { ...item, decision: "approve" };
            if (item.claimId === "claim_draft")
                return { ...item, decision: "draft_only" };
            return { ...item, decision: "exclude" };
        });
        await writeFile(aiReviewPath, JSON.stringify(aiReview), "utf8");
        const manifest = await finalizeVariant(workspace, "ai-product", new Date("2026-07-16T13:01:00.000Z"));
        const resume = await readFile(path.join(aiRoot, "final-resume.md"), "utf8");
        const website = await readFile(path.join(aiRoot, "final-website-copy.md"), "utf8");
        const signalResume = resume.split("### SB (SignalBoard)")[1]?.split("### InSightARLeans")[0] ?? "";
        const insightResume = resume.split("### InSightARLeans")[1]?.split("## Career Foundation: Product and Platform Delivery")[0] ?? "";
        const signalWebsite = website.split("### SB (SignalBoard)")[1]?.split("### InSightARLeans")[0] ?? "";
        const insightWebsite = website.split("### InSightARLeans")[1]?.split("## SEO Draft")[0] ?? "";
        expect(manifest.finalizationReadiness).toBe("ready");
        expect(resume).toContain("## AI Product Capabilities");
        expect(resume).toContain("## Career Foundation: Product and Platform Delivery");
        expect(resume).toContain("### Example Company");
        expect(signalResume).toContain("**Role and timeline:** Product and Technical Lead | Sep 2025–Present");
        expect(signalResume).toContain("**Status:** AI-assisted market and competitive intelligence product experiment");
        expect(signalResume).toContain("market-signal intelligence");
        expect(signalResume).toContain("action-provenance checks");
        expect(signalResume).toContain("evaluation scenarios");
        expect(resume).toContain("evidence-backed insights, traceability, and decision-support workflows");
        expect(resume).toContain("app experience, backend/data configuration, technical evaluation, and product validation");
        expect(insightResume).toContain("computer-vision prototype");
        expect(insightResume).toContain("**Role and timeline:** Product and Technical Lead | Mar 2025–Present");
        expect(insightResume).toContain("**Status:** AI/mobile computer-vision prototype");
        expect(insightResume).toContain("iterative testing and qualitative feedback");
        expect(insightResume).toContain("product and technical tradeoffs");
        expect(signalWebsite).toContain("market-signal intelligence");
        expect(signalWebsite).toContain("**Role and timeline:** Product and Technical Lead | Sep 2025–Present");
        expect(signalWebsite).toContain("**Status:** AI-assisted market and competitive intelligence product experiment");
        expect(signalWebsite).toContain("action-provenance checks");
        expect(signalWebsite).toContain("evaluation scenarios");
        expect(insightWebsite).toContain("computer-vision prototype");
        expect(insightWebsite).toContain("**Role and timeline:** Product and Technical Lead | Mar 2025–Present");
        expect(insightWebsite).toContain("**Status:** AI/mobile computer-vision prototype");
        expect(insightWebsite).toContain("iterative testing and qualitative feedback");
        expect(insightWebsite).toContain("product and technical tradeoffs");
        expect(resume).not.toContain("Draft-only wording");
        expect(resume).not.toContain("Excluded wording");
        expect(resume).not.toContain("500 users");
        expect(website).not.toContain("500 users");
        expect(resume).not.toMatch(/\b(?:production platform|deployed product|adopted by users|customer-facing traction)\b/i);
        expect(website).not.toMatch(/\b(?:production platform|deployed product|adopted by users|customer-facing traction)\b/i);
        expect(resume).not.toContain("Built AI-assisted product workflows, prototypes, and technical evaluation loops.");
        expect(website).not.toContain("Built AI-assisted product workflows, prototypes, and technical evaluation loops.");
        expect(new Set(resume.split("\n").filter((line) => line.startsWith("- "))).size)
            .toBe(resume.split("\n").filter((line) => line.startsWith("- ")).length);
        expect(new Set(website.split("\n").filter((line) => line.startsWith("- "))).size)
            .toBe(website.split("\n").filter((line) => line.startsWith("- ")).length);
        for (const file of tpmFiles)
            expect(await readFile(path.join(tpmRoot, file), "utf8")).toBe(tpmBefore.get(file));
        const registry = JSON.parse(await readFile(path.join(workspace, "outputs/output-manifest.json"), "utf8"));
        expect(registry.outputs.filter((output) => output.publicationStatus === "final").map((output) => output.variantRoleKey).sort())
            .toEqual(["ai-product", "tpm"]);
        expect(registry.outputs.every((output) => output.freshness === "current")).toBe(true);
    });
    it("rejects unsupported output-review role keys clearly", async () => {
        const workspace = await createReviewWorkspace();
        await expect(initializeVariantReview(workspace, "fullstack")).rejects.toThrow("Output-specific review supports --role tpm or --role ai-product.");
    });
});
async function createReviewWorkspace() {
    const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-review-"));
    const source = sourceFixture();
    const evidence = [
        evidenceFixture({ id: "evi_role", category: "responsibility", company: "Example Company", visibility: "public" }),
        evidenceFixture({ id: "evi_project", category: "project", project: "SignalBoard", visibility: "public" }),
        evidenceFixture({ id: "evi_unknown", category: "project", project: "SignalBoard", visibility: "unknown" }),
        evidenceFixture({ id: "evi_skill", category: "skill", sourceSection: "Technical Fluency", visibility: "generic_only" }),
        evidenceFixture({ id: "evi_education", category: "education", sourceSection: "Education & Certifications", visibility: "generic_only" }),
        evidenceFixture({ id: "evi_certification", category: "certification", sourceSection: "Education & Certifications", visibility: "generic_only" }),
        evidenceFixture({ id: "evi_summary", category: "responsibility", sourceSection: "Summary", visibility: "generic_only" })
    ];
    const claims = [
        claimFixture({ id: "claim_approve", claim: "Supported product discovery and platform delivery.", supportingEvidenceIds: ["evi_role"] }),
        claimFixture({ id: "claim_revise", claim: "Original project wording requiring revision.", type: "project_claim", supportingEvidenceIds: ["evi_project"] }),
        claimFixture({ id: "claim_pending", claim: "Pending private draft wording", supportingEvidenceIds: ["evi_role"] }),
        claimFixture({ id: "claim_draft", claim: "Draft-only wording", supportingEvidenceIds: ["evi_role"] }),
        claimFixture({ id: "claim_exclude", claim: "Excluded wording", supportingEvidenceIds: ["evi_role"] }),
        claimFixture({ id: "claim_unknown", claim: "Unknown source wording", type: "project_claim", supportingEvidenceIds: ["evi_unknown"] }),
        claimFixture({ id: "claim_blocked", claim: "Blocked secret wording", approvalStatus: "blocked", outputReadiness: "do_not_use", supportingEvidenceIds: ["evi_role"] }),
        claimFixture({ id: "claim_metric", claim: "Delivered growth to 500 users", metricStatus: "needs_metric", supportingEvidenceIds: ["evi_role"] }),
        claimFixture({ id: "claim_manifest_only", claim: "Supported product discovery and platform delivery.", supportingEvidenceIds: ["evi_role"] }),
        claimFixture({ id: "claim_unresolved_only", claim: "Unresolved-file-only product claim.", supportingEvidenceIds: ["evi_role"] }),
        claimFixture({ id: "claim_a0d06ff53160", claim: "Product & Delivery Tools: Jira, Linear, Notion, Figma, GitHub Projects.", type: "skill_claim", supportingEvidenceIds: ["evi_skill"], sourceSection: "Technical Fluency" }),
        claimFixture({ id: "claim_8c7c3c3e8002", claim: "Technical Product Manager Certification, Knowledge Officer.", type: "certification_claim", supportingEvidenceIds: ["evi_certification"], sourceSection: "Education & Certifications" }),
        claimFixture({ id: "claim_ffda3bd4dbfc", claim: "Meta Product Management Scholarship, Product Manager track.", type: "certification_claim", supportingEvidenceIds: ["evi_certification"], sourceSection: "Education & Certifications" }),
        claimFixture({ id: "claim_21082bbbbc33", claim: "Sun Certified Java Programmer.", type: "certification_claim", supportingEvidenceIds: ["evi_certification"], sourceSection: "Education & Certifications" }),
        claimFixture({ id: "claim_871911b85bcf", claim: "Bachelor’s Degree in Computer Science, Modern Academy Maadi.", type: "education_claim", supportingEvidenceIds: ["evi_education"], sourceSection: "Education & Certifications" }),
        claimFixture({ id: "claim_9379f09c8b8c", claim: "Diploma in Project Management, Regional IT Institute.", type: "education_claim", supportingEvidenceIds: ["evi_education"], sourceSection: "Education & Certifications" }),
        claimFixture({ id: "claim_summary", claim: "Technical Product Manager connecting product strategy with platform delivery.", supportingEvidenceIds: ["evi_summary"], sourceSection: "Summary" }),
        claimFixture({
            id: "claim_ai_validation",
            claim: "Designed AI-assisted workflows connecting app-layer experience, backend/data configuration, technical evaluation, and product validation.",
            supportingEvidenceIds: ["evi_project"],
            sourceSection: "Current Product & AI Initiatives"
        })
    ];
    const profile = {
        id: "career_profile",
        updatedAt: "2026-07-15T15:00:00.000Z",
        positioningCandidates: ["Technical Product Manager"],
        summaryThemes: ["Product discovery"],
        roles: [{ title: "Technical Product Lead", company: "Example Company", dateRange: "2022 - Present", evidenceIds: ["evi_role"] }],
        projects: [{ name: "SB (SignalBoard)", technologies: ["TypeScript"], domains: ["AI"], evidenceIds: ["evi_project", "evi_unknown"] }],
        skills: [{ name: "Jira", evidenceIds: ["evi_skill"] }],
        domains: ["AI"],
        approvedClaims: [],
        claimsNeedingConfirmation: claims.map((claim) => claim.claim),
        blockedClaims: ["Blocked secret wording"],
        resumeReadyClaims: [],
        genericOnlyClaims: claims.filter((claim) => claim.outputReadiness === "generic_only").map((claim) => claim.claim),
        internalOnlyClaims: [],
        publicSafetyRules: []
    };
    const state = { sources: [source], evidenceItems: evidence, claims, profile, privacyFindings: [] };
    const baseline = createRefreshBaseline(state, "2026-07-15T15:00:00.000Z");
    baseline.profileFingerprint = "profile-fingerprint";
    await mkdir(path.join(workspace, "kb"), { recursive: true });
    await writeFile(path.join(workspace, "kb/career-profile.json"), JSON.stringify(profile), "utf8");
    await writeFile(path.join(workspace, "kb/claims.json"), JSON.stringify(claims), "utf8");
    await writeFile(path.join(workspace, "kb/evidence-items.json"), JSON.stringify(evidence), "utf8");
    await writeFile(path.join(workspace, "kb/update-baseline.json"), JSON.stringify(baseline), "utf8");
    await addVariantFixture(workspace, "tpm", evidence);
    return workspace;
}
async function addVariantFixture(workspace, roleKey, evidence) {
    const currentEvidence = evidence
        ?? JSON.parse(await readFile(path.join(workspace, "kb/evidence-items.json"), "utf8"));
    const root = path.join(workspace, `outputs/variants/${roleKey}`);
    await mkdir(root, { recursive: true });
    const baseClaimIds = ["claim_approve", "claim_revise", "claim_pending", "claim_draft", "claim_exclude", "claim_unknown", "claim_blocked", "claim_metric"];
    const manifestClaimIds = [...baseClaimIds, "claim_manifest_only", "claim_unresolved_only"];
    const displayName = roleKey === "tpm" ? "Technical Product Manager" : "AI Product Manager";
    const generationManifest = {
        schemaVersion: 1,
        outputId: `role_variant_${roleKey}`,
        roleKey,
        displayName,
        generatedAt: "2026-07-15T16:00:00.000Z",
        profileFingerprint: "profile-fingerprint",
        generatedFiles: [`outputs/variants/${roleKey}/resume-draft.md`],
        claimIdsUsed: manifestClaimIds,
        evidenceIdsUsed: currentEvidence.map((item) => item.id),
        countsByApprovalStatus: { approved: 0, needs_confirmation: 8, blocked: 1 },
        countsByOutputReadiness: { resume_ready: 0, generic_only: 8, internal_only: 0, do_not_use: 1 },
        warnings: [],
        draft: true,
        publicationStatus: "draft",
        freshness: "current"
    };
    await writeFile(path.join(root, "resume-draft.md"), `# ${displayName} Draft\n`, "utf8");
    await writeFile(path.join(root, "generation-manifest.json"), JSON.stringify(generationManifest), "utf8");
    const unresolvedClaimIds = [...baseClaimIds, "claim_unresolved_only"];
    await writeFile(path.join(root, "unresolved-claims.md"), unresolvedClaimIds.map((id) => `## ${id}`).join("\n\n"), "utf8");
    const outputManifestPath = path.join(workspace, "outputs/output-manifest.json");
    let outputManifest = { schemaVersion: 1, updatedAt: generationManifest.generatedAt, outputs: [] };
    try {
        outputManifest = JSON.parse(await readFile(outputManifestPath, "utf8"));
    }
    catch {
        await mkdir(path.dirname(outputManifestPath), { recursive: true });
    }
    outputManifest.outputs = outputManifest.outputs.filter((output) => output.id !== generationManifest.outputId);
    outputManifest.outputs.push({
        id: generationManifest.outputId,
        variantRoleKey: roleKey,
        generatedFiles: generationManifest.generatedFiles,
        generatedAt: generationManifest.generatedAt,
        profileFingerprint: generationManifest.profileFingerprint,
        claimIdsUsed: manifestClaimIds,
        evidenceIdsUsed: currentEvidence.map((item) => item.id),
        publicationStatus: "draft",
        freshness: "current"
    });
    await writeFile(outputManifestPath, JSON.stringify(outputManifest), "utf8");
}
async function addAiProductQualityEvidence(workspace) {
    const evidencePath = path.join(workspace, "kb/evidence-items.json");
    const claimsPath = path.join(workspace, "kb/claims.json");
    const profilePath = path.join(workspace, "kb/career-profile.json");
    const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
    const claims = JSON.parse(await readFile(claimsPath, "utf8"));
    const profile = JSON.parse(await readFile(profilePath, "utf8"));
    const signalEvidenceIds = ["evi_ai_market", "evi_ai_provenance", "evi_ai_evaluation", "evi_ai_traceability", "evi_ai_backend"];
    const insightEvidenceIds = ["evi_ai_insight_project", "evi_ai_prototype", "evi_ai_mobile_validation", "evi_ai_tradeoff"];
    evidence.push(evidenceFixture({ id: "evi_ai_summary", category: "responsibility", sourceSection: "Summary", visibility: "public" }), ...signalEvidenceIds.map((id) => evidenceFixture({ id, category: "responsibility", project: "SignalBoard", parentProjectId: "evi_project", visibility: "public" })), evidenceFixture({ id: "evi_ai_insight_project", category: "project", project: "InSightARLeans", visibility: "public" }), ...insightEvidenceIds.slice(1).map((id) => evidenceFixture({ id, category: "responsibility", project: "InSightARLeans", parentProjectId: "evi_ai_insight_project", visibility: "public" })));
    claims.push(claimFixture({ id: "claim_ai_summary_quality", claim: "AI Product Manager and product-minded technology leader connecting product discovery, technical tradeoffs, and hands-on AI product validation.", supportingEvidenceIds: ["evi_ai_summary"], sourceSection: "Summary" }), claimFixture({ id: "claim_ai_workflow_quality", claim: "Built AI-assisted product workflows, prototypes, and technical evaluation loops.", type: "competency_claim", supportingEvidenceIds: ["evi_ai_summary"] }), claimFixture({ id: "claim_ai_signal_role_quality", claim: "SB (SignalBoard) - Product and Technical Lead (Sep 2025 - Present).", type: "project_claim", supportingEvidenceIds: ["evi_project"] }), claimFixture({ id: "claim_ai_signal_status_quality", claim: "SignalBoard is an AI-assisted market and competitive intelligence product experiment.", type: "project_claim", supportingEvidenceIds: ["evi_project"] }), claimFixture({ id: "claim_ai_market_quality", claim: "Led an AI-assisted market-signal intelligence initiative spanning signal extraction and repeatable decision-support workflows.", supportingEvidenceIds: ["evi_ai_market"], parentProjectId: "evi_project" }), claimFixture({ id: "claim_ai_provenance_quality", claim: "Built stricter action-provenance checks for AI-generated recommendations to improve traceability and evidence support.", supportingEvidenceIds: ["evi_ai_provenance"], parentProjectId: "evi_project" }), claimFixture({ id: "claim_ai_evaluation_quality", claim: "Added evaluation scenarios to test whether generated briefings were supported by real source signals.", supportingEvidenceIds: ["evi_ai_evaluation"], parentProjectId: "evi_project" }), claimFixture({ id: "claim_ai_traceability_quality", claim: "Improved product thinking around evidence-backed insights, traceability, and decision-support workflows.", type: "impact_claim", supportingEvidenceIds: ["evi_ai_traceability"], parentProjectId: "evi_project" }), claimFixture({ id: "claim_ai_backend_quality", claim: "Designed AI-assisted workflows connecting app experience, backend/data configuration, technical evaluation, and product validation.", supportingEvidenceIds: ["evi_ai_backend"], parentProjectId: "evi_project" }), claimFixture({ id: "claim_ai_insight_role_quality", claim: "InSightARLeans - Product and Technical Lead (Mar 2025 - Present).", type: "project_claim", supportingEvidenceIds: ["evi_ai_insight_project"] }), claimFixture({ id: "claim_ai_prototype_quality", claim: "Built and iterated a React Native and Expo computer-vision prototype exploring object detection and contextual overlays using TensorFlow.js.", supportingEvidenceIds: ["evi_ai_prototype"], parentProjectId: "evi_ai_insight_project" }), claimFixture({ id: "claim_ai_mobile_validation_quality", claim: "Validated the AI/mobile experience through iterative testing and qualitative feedback.", supportingEvidenceIds: ["evi_ai_mobile_validation"], parentProjectId: "evi_ai_insight_project" }), claimFixture({ id: "claim_ai_tradeoff_quality", claim: "Worked through product and technical tradeoffs across camera flows, overlay UX, responsiveness, and mobile interaction design.", supportingEvidenceIds: ["evi_ai_tradeoff"], parentProjectId: "evi_ai_insight_project" }));
    const signalProject = profile.projects.find((project) => project.name.includes("SignalBoard"));
    if (signalProject)
        signalProject.evidenceIds.push(...signalEvidenceIds);
    profile.projects.push({
        name: "InSightARLeans",
        technologies: ["React Native", "Expo", "TensorFlow.js"],
        domains: ["AI", "mobile"],
        evidenceIds: insightEvidenceIds
    });
    profile.claimsNeedingConfirmation = claims.map((claim) => claim.claim);
    profile.genericOnlyClaims = claims.filter((claim) => claim.outputReadiness === "generic_only").map((claim) => claim.claim);
    await writeFile(evidencePath, JSON.stringify(evidence), "utf8");
    await writeFile(claimsPath, JSON.stringify(claims), "utf8");
    await writeFile(profilePath, JSON.stringify(profile), "utf8");
}
function sourceFixture() {
    return {
        id: "src_1",
        type: "cv",
        path: "sources/cvs/resume.md",
        importedAt: "2026-07-15T15:00:00.000Z",
        hash: "hash",
        visibility: "public",
        status: "active"
    };
}
function evidenceFixture(overrides) {
    return {
        id: "evi_1",
        sourceIds: ["src_1"],
        category: "responsibility",
        text: "Public product evidence.",
        normalizedSummary: "Public product evidence.",
        technologies: ["TypeScript"],
        domains: ["platform"],
        visibility: "public",
        sensitivityFlags: [],
        confidence: "high",
        ...overrides
    };
}
function claimFixture(overrides) {
    return {
        id: "claim_1",
        claim: "Supported product discovery and platform delivery.",
        type: "responsibility_claim",
        supportingEvidenceIds: ["evi_role"],
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
