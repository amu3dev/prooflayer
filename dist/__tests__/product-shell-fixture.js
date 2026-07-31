import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { hashText, writeJsonAtomic } from "../fs-utils.js";
import { createJobTarget } from "../targets.js";
import { runProductJobJourney } from "../product-workflows.js";
import { NATTERBOX_JOB_DESCRIPTION } from "./fixtures/natterbox-job-description.js";
export const PRODUCT_FIXTURE_TIME = "2026-07-30T10:00:00.000Z";
export async function createProductShellFixture(options = {}) {
    const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-product-shell-"));
    const sourcePath = path.join(workspace, "sources", "cvs", "career.md");
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, "Synthetic career source", "utf8");
    const source = {
        id: "src_product_shell",
        type: "cv",
        path: "sources/cvs/career.md",
        title: "Existing CV",
        importedAt: PRODUCT_FIXTURE_TIME,
        hash: hashText("Synthetic career source"),
        visibility: "generic_only",
        status: "active",
    };
    const evidence = [
        {
            id: "evi_product_role",
            sourceIds: [source.id],
            category: "role",
            text: "Product-focused Software Developer at ExampleCo, Jan 2022 - Dec 2023",
            normalizedSummary: "Product-focused Software Developer at ExampleCo, Jan 2022 - Dec 2023",
            dateRange: "Jan 2022 - Dec 2023",
            company: "ExampleCo",
            sourceSection: "Experience",
            technologies: [],
            domains: ["platform"],
            visibility: "generic_only",
            sensitivityFlags: [],
            confidence: "high",
        },
        {
            id: "evi_product_project",
            sourceIds: [source.id],
            category: "project",
            text: "Built a product validation prototype.",
            normalizedSummary: "Built a product validation prototype.",
            project: "Validation Lab",
            sourceSection: "Projects",
            technologies: ["TypeScript"],
            domains: ["AI"],
            visibility: "generic_only",
            sensitivityFlags: [],
            confidence: "high",
        },
    ];
    const claims = [{
            id: "claim_product_project",
            claim: "Built a product validation prototype.",
            type: "project_claim",
            supportingEvidenceIds: ["evi_product_project"],
            sourceSection: "Projects",
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
        }];
    const profile = {
        id: "career_profile",
        updatedAt: PRODUCT_FIXTURE_TIME,
        positioningCandidates: ["Technical Product Manager"],
        summaryThemes: ["Product strategy and platform delivery"],
        roles: [{
                title: "Product-focused Software Developer",
                company: "ExampleCo",
                dateRange: "Jan 2022 - Dec 2023",
                evidenceIds: ["evi_product_role"],
            }],
        projects: [{
                name: "Validation Lab",
                technologies: ["TypeScript"],
                domains: ["AI"],
                evidenceIds: ["evi_product_project"],
            }],
        skills: [{ name: "TypeScript", evidenceIds: ["evi_product_project"] }],
        domains: ["AI", "platform"],
        approvedClaims: [],
        claimsNeedingConfirmation: ["claim_product_project"],
        blockedClaims: [],
        resumeReadyClaims: [],
        genericOnlyClaims: ["claim_product_project"],
        internalOnlyClaims: [],
        publicSafetyRules: [],
    };
    await writeJsonAtomic(path.join(workspace, "kb/sources.json"), [source]);
    await writeJsonAtomic(path.join(workspace, "kb/evidence-items.json"), evidence);
    await writeJsonAtomic(path.join(workspace, "kb/claims.json"), claims);
    await writeJsonAtomic(path.join(workspace, "kb/career-profile.json"), profile);
    await writeJsonAtomic(path.join(workspace, "config/public-profile.json"), {
        schemaVersion: 1,
        publicName: "Alex Example",
        headlineOverride: "Technical Product Manager | Platform Delivery",
    });
    await writeJsonAtomic(path.join(workspace, "outputs/output-manifest.json"), {
        schemaVersion: 1,
        updatedAt: PRODUCT_FIXTURE_TIME,
        outputs: [{
                id: "role_variant_tpm_final",
                variantRoleKey: "tpm",
                generatedFiles: ["outputs/variants/tpm/final-resume.md"],
                generatedAt: PRODUCT_FIXTURE_TIME,
                profileFingerprint: "fixture-profile-fingerprint",
                claimIdsUsed: [],
                evidenceIdsUsed: [],
                publicationStatus: "final",
                freshness: "current",
            }],
    });
    const jobInputPath = path.join(workspace, "inputs", "natterbox.md");
    await mkdir(path.dirname(jobInputPath), { recursive: true });
    await writeFile(jobInputPath, NATTERBOX_JOB_DESCRIPTION, "utf8");
    const job = await createJobTarget(workspace, {
        file: jobInputPath,
        title: "Product Owner - Conversational AI and Agents",
        company: "Natterbox",
        location: "London, England, United Kingdom",
        workingModel: "hybrid",
    }, { now: () => new Date(PRODUCT_FIXTURE_TIME) });
    if (options.runJob ?? true)
        await runProductJobJourney(workspace, job.target.id);
    return { workspace, source, evidence, claims, profile, jobTargetId: job.target.id };
}
