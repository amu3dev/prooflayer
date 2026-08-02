import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, unlink, writeFile } from "node:fs/promises";
import { request as httpRequest, type IncomingHttpHeaders } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { getApprovedRoleResumeDraftStatus } from "../approved-role-resume-draft.js";
import { getApprovedInterpretationStatus } from "../approved-interpretation.js";
import { createEvidenceClaimReview } from "../evidence-claim-review.js";
import { buildEvidenceReviewUiOrigin, findAvailableLoopbackPort } from "../evidence-review-ui-server.js";
import { hashFile, hashText, writeJsonAtomic } from "../fs-utils.js";
import {
  completeRoleResumeDraftReviewForProduct,
  confirmRoleDirectionForProduct,
  continueRoleResumeJourney,
  inspectRoleResumeDraftForProduct,
  setRoleResumeDraftReviewDecisionForProduct,
  startRoleResumeJourney,
} from "../product-workflows.js";
import { proofLayerUiActionCsrfToken } from "../evidence-review-ui-csrf.js";
import { PRODUCT_WORKFLOW_ACTIONS, type ProductWorkflowActionName, type ProductWorkflowRoutePath } from "../prooflayer-ui-request-scope.js";
import { getRoleResumeDraftProposalStatus, listRoleResumeDraftProposals } from "../role-resume-draft-proposal.js";
import type { ModelRoleResumeDraftPayload, RoleResumeDraftItem } from "../role-resume-draft-schemas.js";
import {
  ROLE_RESUME_DRAFTING_POLICY_NAME,
  ROLE_RESUME_DRAFTING_POLICY_VERSION,
  getRoleResumeDraftScaffoldStatus,
  loadRoleResumeDraftingContext,
  showRoleResumeDraftScaffold,
} from "../role-resume-drafting.js";
import { getRoleResumeExportStatus, listRoleResumeExports, showRoleResumeExport } from "../role-resume-render-export.js";
import { inspectRoleWorkflow } from "../role-workflow.js";
import type { Claim, EvidenceItem, Source } from "../schemas.js";
import { createProductShellFixture, PRODUCT_FIXTURE_TIME } from "./product-shell-fixture.js";

const children: ChildProcess[] = [];
const TEST_SECRET = "d".repeat(64);
let nextPort = 5250;

afterEach(async () => {
  await Promise.all(children.splice(0).map(stopServer));
});

describe("guided Role Resume product journey", () => {
  it("uses nested routes, confirms Role direction without a model, and exposes an honest provider gate", async () => {
    const fixture = await createRoleReadyFixture();
    const server = await startProductServer(fixture.workspace);

    expect((await fetch(`${server.origin}/resume/role`)).status).toBe(200);
    expect((await fetch(`${server.origin}/resume/role-review`)).status).toBe(404);
    expect((await fetch(`${server.origin}/resume/role-download`)).status).toBe(404);

    const created = await postAction(server.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow, {
      title: "CTO",
    });
    expect(created.status).toBe(303);
    const targetId = "role-cto";
    const generatedPage = await fetch(`${server.origin}${created.headers.location}`);
    const generatedHtml = await generatedPage.text();
    expect(generatedPage.status).toBe(200);
    expect(generatedHtml).toContain("Confirm Role Direction");
    expect(generatedHtml).toContain("Looks Right");
    expect(generatedHtml).toContain("Edit Direction");
    expect(generatedHtml).toContain("Needs Attention");
    expect(generatedHtml).not.toContain("Ready for review");

    const attention = await postAction(server.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.flagRoleDirection, {}, targetId);
    expect(attention.status).toBe(303);
    expect(attention.headers.location).toBe(`/resume/role?target=${targetId}&attention=1`);
    expect(await getApprovedInterpretationStatus(fixture.workspace, targetId)).toMatchObject({ status: "missing" });

    const confirmed = await postAction(server.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.confirmRoleDirection, {}, targetId);
    expect(confirmed.status).toBe(303);
    expect(await getApprovedInterpretationStatus(fixture.workspace, targetId)).toMatchObject({ status: "current" });
    expect((await inspectRoleWorkflow(fixture.workspace, targetId)).understanding?.source.type).toBe("built-in-taxonomy");

    const continued = await postAction(server.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow, {}, targetId);
    expect(continued.status).toBe(303);
    const blockedPage = await fetch(`${server.origin}${continued.headers.location}`);
    const blockedHtml = await blockedPage.text();
    expect(blockedPage.status).toBe(200);
    expect(blockedHtml).toContain("Configure Writing Provider");
    expect(blockedHtml).toContain("PROOFLAYER_MODEL_PROVIDER");
    expect(blockedHtml).not.toContain("Ready for review");
    expect(await getRoleResumeDraftScaffoldStatus(fixture.workspace, targetId)).toMatchObject({ status: "current" });
    expect((await fetch(`${server.origin}/resume/role/review?target=${targetId}`)).status).toBe(200);
    expect((await fetch(`${server.origin}/resume/role/download?target=${targetId}`)).status).toBe(200);

    const readOnly = await startProductServer(fixture.workspace, { readOnly: true });
    const rejected = await postAction(readOnly.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow, {}, targetId);
    expect(rejected.status).toBe(405);
  }, 45_000);

  it("runs proposal, review, approval, and Markdown/HTML/DOCX downloads through real HTTP", async () => {
    const fixture = await createRoleReadyFixture();
    const noProvider = await startProductServer(fixture.workspace);
    const created = await postAction(noProvider.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.startRoleWorkflow, { title: "CTO" });
    const targetId = "role-cto";
    expect(created.status).toBe(303);
    expect((await postAction(noProvider.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.confirmRoleDirection, {}, targetId)).status).toBe(303);
    expect((await postAction(noProvider.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow, {}, targetId)).status).toBe(303);

    const responsePath = path.join(fixture.workspace, "test-provider-role-draft.json");
    await writeFile(responsePath, JSON.stringify(await validDraftPayload(fixture.workspace, targetId)), "utf8");
    const providerServer = await startProductServer(fixture.workspace, {
      environment: {
        PROOFLAYER_MODEL_PROVIDER: "fake",
        PROOFLAYER_MODEL_NAME: "guided-role-test",
        PROOFLAYER_MODEL_RESPONSE_FILE: responsePath,
      },
    });
    const proposed = await postAction(providerServer.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow, {}, targetId);
    expect(proposed.status).toBe(303);
    const proposals = await listRoleResumeDraftProposals(fixture.workspace, targetId);
    const proposal = proposals.at(-1)!;
    expect(await getRoleResumeDraftProposalStatus(fixture.workspace, proposal.id)).toMatchObject({ status: "current", readyForReview: true });

    const rolePage = await fetch(`${providerServer.origin}${proposed.headers.location}`);
    const roleHtml = await rolePage.text();
    expect(rolePage.status).toBe(200);
    expect(roleHtml).toContain("Review Resume");
    expect(roleHtml.indexOf("Resume preview")).toBeLessThan(roleHtml.indexOf("Review Resume"));

    const reviewUrl = `/resume/role/review?target=${targetId}&proposal=${proposal.id}`;
    const reviewPage = await fetch(`${providerServer.origin}${reviewUrl}`);
    const reviewHtml = await reviewPage.text();
    expect(reviewPage.status).toBe(200);
    expect(reviewHtml).toContain("Supporting evidence");
    expect(reviewHtml).toContain("Claim boundaries");
    expect(reviewHtml).toContain("Needs Attention");
    expect(reviewHtml).toContain("decisions completed");
    expect(reviewHtml).not.toContain("Complete Review</button>");
    expect((await fetch(`${providerServer.origin}/resume/role-review?target=${targetId}`)).status).toBe(404);

    const wrongScope = await postAction(
      providerServer.origin,
      "/resume/role/review",
      PRODUCT_WORKFLOW_ACTIONS.reviewRoleDraftDecision,
      { proposalId: proposal.id, itemType: "section-order", itemId: `section-order_${proposal.id}`, decision: "accept" },
      targetId,
      actionToken("/resume/role", PRODUCT_WORKFLOW_ACTIONS.continueRoleWorkflow, targetId),
    );
    expect(wrongScope.status).toBe(403);

    const initialReview = await inspectRoleResumeDraftForProduct(fixture.workspace, targetId, proposal.id);
    const readOnlyReviewServer = await startProductServer(fixture.workspace, { readOnly: true });
    const readOnlyReview = await postAction(
      readOnlyReviewServer.origin,
      "/resume/role/review",
      PRODUCT_WORKFLOW_ACTIONS.reviewRoleDraftDecision,
      {
        proposalId: proposal.id,
        itemType: initialReview.review.decisions[0]!.itemType,
        itemId: initialReview.review.decisions[0]!.itemId,
        decision: "accept",
      },
      targetId,
    );
    expect(readOnlyReview.status).toBe(405);
    expect((await inspectRoleResumeDraftForProduct(fixture.workspace, targetId, proposal.id)).reviewStatus.counts)
      .toEqual(initialReview.reviewStatus.counts);
    for (const decision of initialReview.review.decisions) {
      if (decision.itemType === "claim-ledger") continue;
      const fields: Record<string, string> = {
        proposalId: proposal.id,
        itemType: decision.itemType,
        itemId: decision.itemId,
        decision: "accept",
      };
      if (decision.itemType === "ambiguity") {
        fields.decision = "edit";
        fields.ambiguityCode = "ROLE_RESUME_REVIEWED_AMBIGUITY";
        fields.ambiguityMessage = "Reviewed ambiguity.";
        fields.resolutionRationale = "Resolved during controlled human review.";
      }
      const decided = await postAction(providerServer.origin, "/resume/role/review", PRODUCT_WORKFLOW_ACTIONS.reviewRoleDraftDecision, fields, targetId);
      expect(decided.status).toBe(303);
    }
    const resolved = await inspectRoleResumeDraftForProduct(fixture.workspace, targetId, proposal.id);
    expect(resolved.reviewStatus.counts.pending).toBe(0);
    const completionPage = await fetch(`${providerServer.origin}${reviewUrl}`);
    expect(await completionPage.text()).toContain("Complete Review</button>");

    const completed = await postAction(providerServer.origin, "/resume/role/review", PRODUCT_WORKFLOW_ACTIONS.completeRoleDraftReview, { proposalId: proposal.id }, targetId);
    expect(completed.status).toBe(303);
    const approvalPage = await fetch(`${providerServer.origin}${reviewUrl}`);
    expect(await approvalPage.text()).toContain("Approve Resume");

    await unlink(responsePath);
    const approved = await postAction(providerServer.origin, "/resume/role/review", PRODUCT_WORKFLOW_ACTIONS.approveRoleDraft, { proposalId: proposal.id }, targetId);
    expect(approved.status).toBe(303);
    expect(await getApprovedRoleResumeDraftStatus(fixture.workspace, targetId)).toMatchObject({ status: "current", usableForRendering: true });
    const approvedPage = await fetch(`${providerServer.origin}${approved.headers.location}`);
    const approvedHtml = await approvedPage.text();
    expect(approvedHtml).toContain("Approved role resume");
    expect(approvedHtml).toContain("Prepare Downloads");

    const preExportDownload = await fetch(`${providerServer.origin}/resume/role/download?target=${targetId}`);
    expect(preExportDownload.status).toBe(200);
    expect(await preExportDownload.text()).toContain("No current downloads");
    const exported = await postAction(providerServer.origin, "/resume/role", PRODUCT_WORKFLOW_ACTIONS.exportRoleResume, {}, targetId);
    expect(exported.status).toBe(303);

    const downloadPage = await fetch(`${providerServer.origin}/resume/role/download?target=${targetId}`);
    const downloadHtml = await downloadPage.text();
    expect(downloadPage.status).toBe(200);
    expect(downloadHtml).toContain("Download MARKDOWN");
    expect(downloadHtml).toContain("Download HTML");
    expect(downloadHtml).toContain("Download DOCX");
    expect((await fetch(`${providerServer.origin}/resume/role-download?target=${targetId}`)).status).toBe(404);

    const manifests = await listRoleResumeExports(fixture.workspace, targetId);
    expect(manifests.map(({ format }) => format)).toEqual(["docx", "html", "markdown"]);
    for (const manifest of manifests) {
      expect(await getRoleResumeExportStatus(fixture.workspace, manifest.exportId)).toMatchObject({ status: "current" });
      expect((await showRoleResumeExport(fixture.workspace, manifest.exportId)).validation).toMatchObject({ status: "valid", visibleTextEquivalent: true });
      const response = await fetch(`${providerServer.origin}/resume/role/download?target=${targetId}&exportId=${manifest.exportId}`);
      expect(response.status).toBe(200);
      expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(0);
    }
    const otherTarget = await startRoleResumeJourney(fixture.workspace, { title: "Engineering Manager" });
    const crossTargetDownload = await fetch(`${providerServer.origin}/resume/role/download?target=${otherTarget.target!.id}&exportId=${manifests[0]!.exportId}`);
    expect(crossTargetDownload.status).toBe(403);
  }, 90_000);

  it("keeps Role status and continuation dry-run scriptable without writes", async () => {
    const fixture = await createRoleReadyFixture();
    await startRoleResumeJourney(fixture.workspace, { title: "CTO" });
    await confirmRoleDirectionForProduct(fixture.workspace, "role-cto");
    await continueRoleResumeJourney(fixture.workspace, "role-cto");
    const before = await fileInventory(fixture.workspace);
    const status = await runCli(fixture.workspace, ["role", "status", "role-cto"]);
    const dryRun = await runCli(fixture.workspace, ["role", "continue", "role-cto", "--offline", "--dry-run"]);
    expect(status.code).toBe(0);
    expect(status.stdout).toContain("ProofLayer Role Resume");
    expect(dryRun.code).toBe(0);
    expect(dryRun.stdout).toContain("Dry run: yes");
    expect(await fileInventory(fixture.workspace)).toEqual(before);
  }, 30_000);

  it("runs the guided provider-backed CLI path through finalization", async () => {
    const fixture = await createRoleReadyFixture();
    expect((await runCli(fixture.workspace, ["role", "create", "--title", "CTO"])).code).toBe(0);
    expect((await runCli(fixture.workspace, ["role", "run", "role-cto", "--offline"])).code).toBe(0);
    await confirmRoleDirectionForProduct(fixture.workspace, "role-cto");

    const deterministicContinuation = await runCli(fixture.workspace, ["role", "continue", "role-cto", "--offline"]);
    expect(deterministicContinuation.code).toBe(0);
    expect(deterministicContinuation.stdout).toContain("A writing provider is needed to prepare the resume wording.");

    const responsePath = path.join(fixture.workspace, "test-provider-role-draft.json");
    await writeFile(responsePath, JSON.stringify(await validDraftPayload(fixture.workspace, "role-cto")), "utf8");
    const providerEnvironment = {
      PROOFLAYER_MODEL_PROVIDER: "fake",
      PROOFLAYER_MODEL_NAME: "guided-role-cli-test",
      PROOFLAYER_MODEL_RESPONSE_FILE: responsePath,
    };
    const continued = await runCli(
      fixture.workspace,
      ["role", "continue", "role-cto", "--provider", "fake", "--offline"],
      providerEnvironment,
    );
    expect(continued.code).toBe(0);
    expect(continued.stdout).toContain("Provider call made: yes");

    const proposal = (await listRoleResumeDraftProposals(fixture.workspace, "role-cto")).at(-1)!;
    const reviewData = await inspectRoleResumeDraftForProduct(fixture.workspace, "role-cto", proposal.id);
    for (const decision of reviewData.review.decisions) {
      if (decision.itemType === "claim-ledger") continue;
      await setRoleResumeDraftReviewDecisionForProduct(
        fixture.workspace,
        "role-cto",
        proposal.id,
        decision.itemType,
        decision.itemId,
        decision.itemType === "ambiguity"
          ? {
              decision: "edit",
              editedValue: {
                id: decision.itemId,
                code: "ROLE_RESUME_REVIEWED_AMBIGUITY",
                message: "Reviewed ambiguity.",
                resolved: true,
                resolutionRationale: "Resolved during the isolated CLI trial.",
                sectionIds: [],
                draftItemIds: [],
                expectationIds: [],
                matchIds: [],
                evidenceIds: [],
                claimBoundaryIds: [],
              },
            }
          : { decision: "accept" },
      );
    }
    await completeRoleResumeDraftReviewForProduct(fixture.workspace, "role-cto", proposal.id);
    expect((await runCli(fixture.workspace, ["target", "resume-draft", "approve", proposal.id])).code).toBe(0);
    const finalized = await runCli(fixture.workspace, ["role", "finalize", "role-cto"]);
    expect(finalized.code).toBe(0);
    expect(finalized.stdout).toContain("Succeeded: markdown, html, docx");
    expect((await listRoleResumeExports(fixture.workspace, "role-cto")).map(({ format }) => format))
      .toEqual(["docx", "html", "markdown"]);
  }, 90_000);
});

async function createRoleReadyFixture() {
  const fixture = await createProductShellFixture({ runJob: false });
  const source: Source = {
    id: "src_guided_role",
    type: "markdown",
    path: "sources/markdown/guided-role.md",
    title: "Synthetic guided Role evidence",
    importedAt: PRODUCT_FIXTURE_TIME,
    hash: hashText("Synthetic guided Role evidence"),
    visibility: "public",
    status: "active",
  };
  const definitions = [
    ["strategy", "Aligned technology strategy with product and business priorities in a reviewed role.", ["technology", "product", "strategy"]],
    ["architecture", "Guided architecture and platform technology tradeoffs in a reviewed role.", ["architecture", "platform", "technology"]],
    ["delivery", "Led technology delivery through clear leadership and delivery decisions in a reviewed role.", ["leadership", "delivery", "technology"]],
    ["stakeholders", "Aligned stakeholders around delivery priorities in a reviewed role.", ["stakeholder", "alignment", "delivery"]],
    ["discovery", "Connected product discovery to technical execution in a reviewed role.", ["product", "discovery", "technical"]],
    ["hands-on", "Worked across strategy and hands-on technical delivery in a reviewed role.", ["strategy", "technical", "hands-on"]],
    ["ai", "Evaluated AI automation for product goals in a reviewed project.", ["ai", "automation", "product"]],
  ] as const;
  const evidence: EvidenceItem[] = definitions.map(([id, text, tags], index) => ({
    id: `evi_guided_role_${id}`,
    sourceIds: [source.id],
    category: index === definitions.length - 1 ? "project" : "responsibility",
    text,
    normalizedSummary: text,
    sourceSection: index === definitions.length - 1 ? "Projects" : "Experience",
    ...(index === definitions.length - 1
      ? { project: "AI Product Evaluation", parentProjectId: "project_guided_ai" }
      : { parentRoleId: "role_guided_leadership" }),
    technologies: [],
    domains: [...tags],
    visibility: "public",
    sensitivityFlags: [],
    confidence: "high",
  }));
  const claims: Claim[] = evidence.map((entry, index) => ({
    id: `claim_guided_role_${definitions[index]![0]}`,
    claim: entry.text,
    type: index === evidence.length - 1 ? "project_claim" : "responsibility_claim",
    supportingEvidenceIds: [entry.id],
    sourceSection: entry.sourceSection,
    ...(entry.parentProjectId ? { parentProjectId: entry.parentProjectId } : {}),
    ...(entry.parentRoleId ? { parentRoleId: entry.parentRoleId } : {}),
    extractionConfidence: "high",
    factualConfidence: "high",
    corroborationLevel: "single_source",
    approvalStatus: "needs_confirmation",
    outputReadiness: "generic_only",
    confidence: "high",
    publicSafe: false,
    needsConfirmation: true,
    metricStatus: "no_metric",
    unsafeWording: [],
  }));
  await writeJsonAtomic(path.join(fixture.workspace, "kb/sources.json"), [source]);
  await writeJsonAtomic(path.join(fixture.workspace, "kb/evidence-items.json"), evidence);
  await writeJsonAtomic(path.join(fixture.workspace, "kb/claims.json"), claims);
  for (const claim of claims) {
    const evidenceItem = evidence.find((entry) => entry.id === claim.supportingEvidenceIds[0])!;
    await createEvidenceClaimReview(fixture.workspace, claim.id, {
      schemaVersion: 1,
      claimId: claim.id,
      reviewedClaimSha256: hashText(claim.claim),
      decision: "approved",
      requiredQualifiers: [],
      factualSupport: "supported",
      scope: "exact",
      publicSafety: "public-safe",
      resumeReadiness: "resume-ready",
      eligibleForRoleMatching: true,
      eligibleForJobMapping: false,
      metricReview: { state: "not-a-metric", qualifiers: [] },
      classification: {
        workContext: evidenceItem.parentProjectId ? "project" : "employment",
        claimNature: "capability",
      },
      risks: [],
      warnings: [],
      ambiguities: [],
      reviewerRationale: "Synthetic evidence is explicitly reviewed for the isolated guided Role test.",
    });
  }
  return fixture;
}

async function validDraftPayload(workspace: string, targetId: string): Promise<ModelRoleResumeDraftPayload> {
  const scaffold = await showRoleResumeDraftScaffold(workspace, targetId);
  const context = await loadRoleResumeDraftingContext(workspace, targetId);
  const zero = "0".repeat(64);
  const usedEvidenceIds = new Set<string>();
  return {
    sections: scaffold.sections.map((guard) => {
      const plan = context.approvedPlan.sections.find((entry) => entry.id === guard.planSectionId)!;
      if (guard.status !== "include" || !guard.allowedEvidenceIds.length || !guard.allowedClaimBoundaryIds.length) {
        return {
          id: guard.id,
          planSectionId: guard.planSectionId,
          type: guard.sectionType,
          order: guard.order,
          status: guard.status === "exclude" ? "excluded" as const : "empty" as const,
          objective: guard.objective,
          items: [],
          provenance: {
            targetId,
            approvedPlanId: context.approvedPlan.id,
            planSectionId: guard.planSectionId,
            approvedPlanSha256: context.approvedPlanSha256,
            draftingPolicy: { name: ROLE_RESUME_DRAFTING_POLICY_NAME, version: ROLE_RESUME_DRAFTING_POLICY_VERSION },
          },
        };
      }
      const boundary = context.approvedPlan.claimBoundaries.find((entry) =>
        guard.allowedClaimBoundaryIds.includes(entry.id)
        && entry.evidenceIds.some((id) => guard.allowedEvidenceIds.includes(id) && !usedEvidenceIds.has(id))
        && entry.allowedClaimTypes.some((claimType) => guard.allowedClaimTypes.includes(claimType)))!;
      const expectationId = boundary.expectationId!;
      const selection = context.approvedPlan.expectationSelections.find((entry) => entry.expectationId === expectationId)!;
      const evidenceId = boundary.evidenceIds.find((id) => guard.allowedEvidenceIds.includes(id))!;
      usedEvidenceIds.add(evidenceId);
      const evidenceText = context.evidenceItems.find((entry) => entry.id === evidenceId)!.normalizedSummary!;
      const claimType = guard.allowedClaimTypes.find((entry) => boundary.allowedClaimTypes.includes(entry))!;
      const itemType = ({
        headline: "headline",
        "professional-summary": "summary",
        "core-capabilities": "capability",
        "selected-impact": "impact",
        "professional-experience": "experience-bullet",
        "selected-projects": "project",
        "technical-capabilities": "technology",
        "leadership-capabilities": "leadership-capability",
        education: "education",
        certifications: "certification",
        "additional-information": "additional-information",
      })[guard.sectionType] as RoleResumeDraftItem["itemType"];
      const text = guard.sectionType === "headline"
        ? `${context.target.title} | ${context.approvedPlan.positioning.primaryThemes[0]!.label}`
        : evidenceText;
      return {
        id: guard.id,
        planSectionId: guard.planSectionId,
        type: guard.sectionType,
        order: guard.order,
        status: "drafted" as const,
        objective: plan.objective,
        items: [{
          id: guard.placeholderIds[0]!,
          sectionId: guard.id,
          itemType,
          text,
          sourceExpectationIds: [expectationId],
          sourceAssessmentIds: [selection.assessmentId],
          approvedMatchIds: selection.approvedMatchIds.filter((id) => guard.allowedMatchIds.includes(id)),
          evidenceIds: [evidenceId],
          claimBoundaryIds: [boundary.id],
          claimTypes: [claimType],
          metricReferences: [],
          scopeReferences: [],
          qualifiers: guard.requiredQualifiers,
          trustState: "model-proposed" as const,
          validation: { status: "valid" as const, issues: [] },
          provenance: {
            targetId,
            approvedPlanId: context.approvedPlan.id,
            planSectionId: guard.planSectionId,
            draftingPolicy: { name: ROLE_RESUME_DRAFTING_POLICY_NAME, version: ROLE_RESUME_DRAFTING_POLICY_VERSION },
            artifactHashes: {
              approvedInterpretationSha256: zero,
              approvedMatchingSha256: zero,
              approvedAssessmentSha256: zero,
              approvedPlanSha256: zero,
              scaffoldSha256: zero,
            },
          },
        }],
        provenance: {
          targetId,
          approvedPlanId: context.approvedPlan.id,
          planSectionId: guard.planSectionId,
          approvedPlanSha256: context.approvedPlanSha256,
          draftingPolicy: { name: ROLE_RESUME_DRAFTING_POLICY_NAME, version: ROLE_RESUME_DRAFTING_POLICY_VERSION },
        },
      };
    }),
    warnings: [],
    ambiguities: [],
  };
}

async function startProductServer(
  workspace: string,
  options: { readOnly?: boolean; host?: "127.0.0.1" | "localhost"; environment?: Record<string, string> } = {},
) {
  const host = options.host ?? "127.0.0.1";
  const port = await findAvailableLoopbackPort(host, nextPort++);
  const origin = buildEvidenceReviewUiOrigin(host, port);
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const entry = path.join(root, "dist/evidence-review-ui-http-server.js");
  if (!existsSync(entry)) throw new Error("Build dist before running guided Role HTTP tests.");
  const environment: NodeJS.ProcessEnv = { ...process.env };
  for (const key of ["PROOFLAYER_MODEL_PROVIDER", "PROOFLAYER_MODEL_NAME", "PROOFLAYER_MODEL_RESPONSE_FILE", "PROOFLAYER_MODEL_BASE_URL", "PROOFLAYER_MODEL_API_KEY"]) delete environment[key];
  Object.assign(environment, options.environment ?? {}, {
    HOST: host,
    PORT: String(port),
    PROOFLAYER_UI_MODE: "product",
    PROOFLAYER_UI_WORKSPACE: workspace,
    PROOFLAYER_UI_READ_ONLY: options.readOnly ? "1" : "0",
    PROOFLAYER_UI_CSRF_TOKEN: TEST_SECRET,
    PROOFLAYER_UI_ORIGIN: origin,
    ASTRO_NODE_AUTOSTART: "disabled",
    ASTRO_NODE_LOGGING: "disabled",
  });
  const child = spawn(process.execPath, [entry], { env: environment, stdio: "ignore" });
  children.push(child);
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Product UI server exited: ${child.exitCode}`);
    try {
      const response = await fetch(origin);
      if (response.status === 200) return { origin, child };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  throw new Error("Product UI server did not become ready.");
}

async function postAction(
  origin: string,
  routePath: ProductWorkflowRoutePath,
  action: ProductWorkflowActionName,
  fields: Record<string, string>,
  targetId?: string,
  csrfToken = actionToken(routePath, action, targetId),
) {
  return postBrowserForm(`${origin}${routePath}`, {
    origin,
    "content-type": "application/x-www-form-urlencoded",
  }, new URLSearchParams({ csrfToken, action, ...(targetId ? { targetId } : {}), ...fields }).toString());
}

function actionToken(routePath: ProductWorkflowRoutePath, actionName: ProductWorkflowActionName, targetId?: string): string {
  return proofLayerUiActionCsrfToken(TEST_SECRET, { routePath, actionName, ...(targetId ? { targetId } : {}) });
}

async function postBrowserForm(destination: string, headers: Record<string, string>, body: string): Promise<{ status: number; body: string; headers: IncomingHttpHeaders }> {
  const url = new URL(destination);
  const bytes = Buffer.from(body, "utf8");
  return new Promise((resolve, reject) => {
    const request = httpRequest({
      hostname: url.hostname,
      port: url.port,
      path: `${url.pathname}${url.search}`,
      method: "POST",
      headers: { ...headers, "content-length": bytes.byteLength },
    }, (response) => {
      const chunks: Buffer[] = [];
      response.on("data", (chunk: Buffer) => chunks.push(chunk));
      response.once("end", () => resolve({ status: response.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf8"), headers: response.headers }));
    });
    request.once("error", reject);
    request.end(bytes);
  });
}

async function runCli(
  workspace: string,
  args: string[],
  environment: Record<string, string> = {},
): Promise<{ code: number; stdout: string; stderr: string }> {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--import", "tsx", path.join(root, "src/index.ts"), "--workspace", workspace, ...args], {
      cwd: root,
      env: { ...process.env, ...environment },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    child.once("error", reject);
    child.once("exit", (code) => resolve({ code: code ?? 1, stdout: Buffer.concat(stdout).toString("utf8"), stderr: Buffer.concat(stderr).toString("utf8") }));
  });
}

async function fileInventory(root: string): Promise<Record<string, string>> {
  const inventory: Record<string, string> = {};
  async function walk(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile()) inventory[path.relative(root, absolute)] = await hashFile(absolute);
    }
  }
  await walk(root);
  return inventory;
}

async function stopServer(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null) return;
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => child.kill("SIGKILL"), 2_000);
    timer.unref();
    child.once("exit", () => { clearTimeout(timer); resolve(); });
    child.kill("SIGTERM");
  });
}
