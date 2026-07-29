import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createRefreshBaseline, detectUpdateImpact, sourceFamilyFor } from "../change-detector.js";
import { UPDATE_BASELINE_PATH, UPDATE_IMPACT_REPORT_PATH, formatChangesSummary, formatStatusSummary, refreshWorkspace } from "../update-impact.js";
import { normalizeProjectIdentity } from "../entity-normalization.js";
import { buildProfile, extractEvidenceFromSource, generateClaimsFromEvidence } from "../operations.js";
describe("Slice 1.3 change detection", () => {
    it("treats the first refresh as additions and an unchanged refresh as unchanged", () => {
        const state = fixtureState();
        const first = createRefreshBaseline(state, "2026-07-15T08:00:00.000Z");
        const firstImpact = detectUpdateImpact(null, first);
        expect(firstImpact.firstRefresh).toBe(true);
        expect(firstImpact.sources.added).toHaveLength(1);
        expect(firstImpact.evidence.added).toHaveLength(1);
        expect(firstImpact.claims.added).toHaveLength(1);
        const second = createRefreshBaseline(state, "2026-07-15T09:00:00.000Z");
        const unchanged = detectUpdateImpact(first, second);
        expect(unchanged.firstRefresh).toBe(false);
        expect(unchanged.sources.unchanged).toHaveLength(1);
        expect(unchanged.evidence.unchanged).toHaveLength(1);
        expect(unchanged.claims.unchanged).toHaveLength(1);
        expect(unchanged.profileFingerprintChanged).toBe(false);
    });
    it("detects added, changed-at-path, and removed sources", () => {
        const beforeState = fixtureState();
        const changedState = fixtureState({ sourceHash: "hash-v2" });
        const addedSource = sourceFixture({
            id: "src_2",
            path: "sources/github/project.json",
            type: "github_summary",
            hash: "project-hash"
        });
        changedState.sources.push(addedSource);
        const before = createRefreshBaseline(beforeState);
        const withChanges = createRefreshBaseline(changedState);
        const impact = detectUpdateImpact(before, withChanges);
        expect(impact.sources.added).toHaveLength(1);
        expect(impact.sources.changed).toHaveLength(1);
        expect(impact.sources.removed).toHaveLength(0);
        const removed = createRefreshBaseline({ ...changedState, sources: [addedSource] });
        const removedImpact = detectUpdateImpact(withChanges, removed);
        expect(removedImpact.sources.removed).toHaveLength(1);
    });
    it("detects added, removed, and metadata-changed evidence and claims", () => {
        const beforeState = fixtureState();
        const afterState = fixtureState({
            evidenceVisibility: "generic_only",
            claimApproval: "needs_confirmation",
            claimReadiness: "generic_only"
        });
        afterState.evidenceItems.push(evidenceFixture({
            id: "evi_2",
            category: "project",
            text: "SignalBoard product initiative",
            normalizedSummary: "SignalBoard product initiative",
            project: "SignalBoard"
        }));
        afterState.claims.push(claimFixture({
            id: "claim_2",
            claim: "SignalBoard product initiative",
            type: "project_claim",
            supportingEvidenceIds: ["evi_2"]
        }));
        const before = createRefreshBaseline(beforeState);
        const after = createRefreshBaseline(afterState);
        const impact = detectUpdateImpact(before, after);
        expect(impact.evidence.added).toHaveLength(1);
        expect(impact.evidence.changed).toHaveLength(1);
        expect(impact.claims.added).toHaveLength(1);
        expect(impact.claims.changed).toHaveLength(1);
        expect(impact.trustTransitions.some((item) => item.field === "approvalStatus")).toBe(true);
        expect(impact.trustTransitions.some((item) => item.field === "outputReadiness")).toBe(true);
        expect(impact.privacyTransitions.some((item) => item.field === "visibility")).toBe(true);
        const finalState = fixtureState({ evidenceItems: [], claims: [] });
        const removed = detectUpdateImpact(after, createRefreshBaseline(finalState));
        expect(removed.evidence.removed).toHaveLength(2);
        expect(removed.claims.removed).toHaveLength(2);
    });
    it("groups repeated CV versions rather than counting them as independent source families", () => {
        const first = sourceFixture({ path: "sources/cvs/resume-v1.md" });
        const second = sourceFixture({ id: "src_2", path: "sources/cvs/resume-final.md", hash: "hash-2" });
        expect(sourceFamilyFor(first)).toBe("cv");
        expect(sourceFamilyFor(second)).toBe("cv");
        const state = fixtureState();
        state.sources.push(second);
        expect(createRefreshBaseline(state).independentSourceFamilies).toBe(1);
    });
    it("does not copy raw sensitive text into the baseline or update report", async () => {
        const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-refresh-"));
        const state = fixtureState({
            evidenceText: "Private contact secret.person@example.com must remain internal.",
            claimText: "Private contact secret.person@example.com must remain internal.",
            evidenceVisibility: "private",
            claimApproval: "blocked",
            claimReadiness: "internal_only"
        });
        state.evidenceItems[0].sensitivityFlags = ["email"];
        await writeState(workspace, state);
        const latest = await refreshWorkspace(workspace, {
            now: () => new Date("2026-07-15T10:00:00.000Z"),
            runPipeline: async () => undefined
        });
        const baseline = await readFile(path.join(workspace, UPDATE_BASELINE_PATH), "utf8");
        const report = await readFile(path.join(workspace, UPDATE_IMPACT_REPORT_PATH), "utf8");
        expect(baseline).not.toContain("secret.person@example.com");
        expect(report).not.toContain("secret.person@example.com");
        expect(report).not.toContain("Private contact");
        expect(baseline).not.toContain("/Users/");
        expect(report).not.toContain("/Users/");
        expect(report).toContain("> GENERATED, READ-ONLY VIEW");
        expect(report).toContain("## Current State");
        expect(report).toContain("## Next Action");
        expect(report.indexOf("User attention required"))
            .toBeLessThan(report.indexOf(latest.refreshId));
    });
    it("updates the baseline only after a successful refresh", async () => {
        const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-failure-"));
        const baselinePath = path.join(workspace, UPDATE_BASELINE_PATH);
        await mkdir(path.dirname(baselinePath), { recursive: true });
        const original = createRefreshBaseline(fixtureState(), "2026-07-14T10:00:00.000Z");
        await writeFile(baselinePath, `${JSON.stringify(original, null, 2)}\n`, "utf8");
        await expect(refreshWorkspace(workspace, {
            runPipeline: async () => { throw new Error("pipeline failed"); }
        })).rejects.toThrow("pipeline failed");
        const persisted = JSON.parse(await readFile(baselinePath, "utf8"));
        expect(persisted.successfulRefreshAt).toBe(original.successfulRefreshAt);
        expect(persisted.profileFingerprint).toBe(original.profileFingerprint);
    });
    it("formats concise changes and status summaries", () => {
        const latest = latestFixture();
        expect(formatChangesSummary(latest)).toContain("Sources: +1 / -0 / ~0");
        expect(formatChangesSummary(latest)).toContain("update-impact-report.md");
        const status = {
            initialized: true,
            sourceCount: 2,
            lastSuccessfulRefresh: latest.refreshedAt,
            profileFingerprint: latest.profileFingerprint,
            warningCount: 1,
            trustCounts: latest.trustCounts,
            privacyCounts: latest.privacyCounts,
            outputs: latest.outputs
        };
        const summary = formatStatusSummary(status);
        expect(summary).toContain("Sources: 2");
        expect(summary).toContain("resume-ready 1");
        expect(summary).toContain("Outputs: none registered");
    });
    it("parses a SignalBoard project note as one project with no roles", () => {
        const source = signalBoardSource();
        const evidence = extractEvidenceFromSource(source, SIGNALBOARD_NOTE);
        const claims = generateClaimsFromEvidence(evidence);
        expect(evidence).toHaveLength(7);
        expect(claims).toHaveLength(7);
        expect(evidence.filter((item) => item.category === "role")).toHaveLength(0);
        expect(evidence.filter((item) => item.category === "project")).toHaveLength(1);
        expect(evidence.find((item) => item.category === "project")?.project).toBe("SignalBoard");
        expect(evidence.filter((item) => item.category !== "project").every((item) => Boolean(item.parentProjectId))).toBe(true);
    });
    it("merges SB, SignalBoard, and SB (SignalBoard) into one profile project", async () => {
        expect(normalizeProjectIdentity("SB")).toBe("sb (signalboard)");
        expect(normalizeProjectIdentity("SignalBoard")).toBe("sb (signalboard)");
        expect(normalizeProjectIdentity("SB (SignalBoard)")).toBe("sb (signalboard)");
        const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-project-merge-"));
        const existing = evidenceFixture({
            id: "evi_sb_existing",
            category: "project",
            text: "SB (SignalBoard)",
            normalizedSummary: "SB (SignalBoard) - Product and Technical Lead.",
            project: "SB (SignalBoard)",
            company: undefined,
            dateRange: "Sep 2025 - Present",
            technologies: ["AI", "Expo", "React Native", "Supabase", "TypeScript"],
            domains: ["AI"]
        });
        const noteEvidence = extractEvidenceFromSource(signalBoardSource(), SIGNALBOARD_NOTE);
        await writeState(workspace, {
            sources: [sourceFixture(), signalBoardSource()],
            evidenceItems: [existing, ...noteEvidence],
            claims: [],
            profile: profileFixture([existing], []),
            privacyFindings: []
        });
        const profile = await buildProfile(workspace);
        expect(profile.roles).toHaveLength(0);
        expect(profile.projects).toHaveLength(1);
        expect(profile.projects[0].name).toBe("SB (SignalBoard)");
        expect(profile.projects[0].evidenceIds).toHaveLength(8);
    });
    it("reports project-note enrichment without role or duplicate-project additions", () => {
        const existingProject = evidenceFixture({
            id: "evi_sb_existing",
            category: "project",
            text: "SB (SignalBoard)",
            normalizedSummary: "SB (SignalBoard) - Product and Technical Lead.",
            project: "SB (SignalBoard)",
            company: undefined,
            dateRange: "Sep 2025 - Present",
            technologies: ["AI", "Expo", "React Native", "Supabase", "TypeScript"],
            domains: ["AI"]
        });
        const existingClaim = claimFixture({
            id: "claim_sb_existing",
            claim: existingProject.normalizedSummary,
            type: "project_claim",
            supportingEvidenceIds: [existingProject.id],
            parentRoleId: undefined,
            parentProjectId: undefined
        });
        const stableProfile = {
            ...profileFixture([existingProject], [existingClaim]),
            roles: [],
            projects: [{
                    name: "SB (SignalBoard)",
                    technologies: ["AI", "Expo", "React Native", "Supabase", "TypeScript"],
                    domains: ["AI"],
                    evidenceIds: [existingProject.id]
                }],
            skills: [],
            domains: ["AI"]
        };
        const before = {
            sources: [sourceFixture()],
            evidenceItems: [existingProject],
            claims: [existingClaim],
            profile: stableProfile,
            privacyFindings: []
        };
        const noteEvidence = extractEvidenceFromSource(signalBoardSource(), SIGNALBOARD_NOTE);
        const noteClaims = generateClaimsFromEvidence(noteEvidence);
        const after = {
            sources: [...before.sources, signalBoardSource()],
            evidenceItems: [...before.evidenceItems, ...noteEvidence],
            claims: [...before.claims, ...noteClaims],
            profile: {
                ...stableProfile,
                projects: [{ ...stableProfile.projects[0], evidenceIds: [existingProject.id, ...noteEvidence.map((item) => item.id)] }],
                claimsNeedingConfirmation: noteClaims.map((claim) => claim.claim)
            },
            privacyFindings: []
        };
        const impact = detectUpdateImpact(createRefreshBaseline(before), createRefreshBaseline(after));
        expect(impact.sources.added).toHaveLength(1);
        expect(impact.evidence.added).toHaveLength(7);
        expect(impact.claims.added).toHaveLength(7);
        expect(impact.profileAreas.roles.added).toHaveLength(0);
        expect(impact.profileAreas.roles.removed).toHaveLength(0);
        expect(impact.profileAreas.projects.added).toHaveLength(0);
        expect(impact.profileAreas.projects.removed).toHaveLength(0);
        expect(impact.profileAreas.projects.unchanged).toHaveLength(1);
    });
});
const SIGNALBOARD_NOTE = `# SignalBoard Update Note

SignalBoard is an AI-assisted market and competitive intelligence product experiment.

Recent product evidence:
- Built stricter action provenance checks for AI-generated recommendations.
- Added evaluation scenarios to test whether generated briefings are supported by real source signals.
- Improved product thinking around evidence-backed insights, traceability, and decision-support workflows.

Potential career signals:
- AI-assisted product workflows
- Product validation
- Evidence-backed decision support
- Technical Product Management
- Supabase and TypeScript implementation`;
function fixtureState(options = {}) {
    const source = sourceFixture({ hash: options.sourceHash ?? "hash-v1" });
    const evidence = evidenceFixture({
        text: options.evidenceText ?? "Technical Product Manager at Example Company",
        normalizedSummary: options.evidenceText ?? "Technical Product Manager at Example Company",
        visibility: options.evidenceVisibility ?? "public"
    });
    const claim = claimFixture({
        claim: options.claimText ?? evidence.normalizedSummary,
        approvalStatus: options.claimApproval ?? "approved",
        outputReadiness: options.claimReadiness ?? "resume_ready",
        publicSafe: (options.claimApproval ?? "approved") === "approved" && (options.claimReadiness ?? "resume_ready") === "resume_ready",
        needsConfirmation: (options.claimApproval ?? "approved") === "needs_confirmation"
    });
    const evidenceItems = options.evidenceItems ?? [evidence];
    const claims = options.claims ?? [claim];
    return {
        sources: [source],
        evidenceItems,
        claims,
        profile: profileFixture(evidenceItems, claims),
        privacyFindings: []
    };
}
function sourceFixture(overrides = {}) {
    return {
        id: "src_1",
        type: "cv",
        path: "sources/cvs/resume.md",
        title: "resume.md",
        importedAt: "2026-07-15T08:00:00.000Z",
        hash: "hash-v1",
        visibility: "public",
        status: "active",
        extractedTextPath: "kb/extracted-text/src_1.txt",
        ...overrides
    };
}
function signalBoardSource() {
    return sourceFixture({
        id: "src_signalboard",
        type: "project_note",
        path: "sources/project-notes/signalboard-update-note.md",
        title: "signalboard-update-note.md",
        hash: "signalboard-hash",
        visibility: "unknown",
        extractedTextPath: "kb/extracted-text/src_signalboard.txt"
    });
}
function evidenceFixture(overrides = {}) {
    return {
        id: "evi_1",
        sourceIds: ["src_1"],
        category: "role",
        text: "Technical Product Manager at Example Company",
        normalizedSummary: "Technical Product Manager at Example Company",
        dateRange: "2024 - Present",
        company: "Example Company",
        sourceSection: "Professional Experience",
        technologies: ["API"],
        domains: ["SaaS"],
        visibility: "public",
        sensitivityFlags: [],
        confidence: "high",
        ...overrides
    };
}
function claimFixture(overrides = {}) {
    return {
        id: "claim_1",
        claim: "Technical Product Manager at Example Company",
        type: "role_claim",
        supportingEvidenceIds: ["evi_1"],
        sourceSection: "Professional Experience",
        dateRange: "2024 - Present",
        extractionConfidence: "high",
        factualConfidence: "high",
        corroborationLevel: "single_source",
        approvalStatus: "approved",
        outputReadiness: "resume_ready",
        confidence: "high",
        publicSafe: true,
        needsConfirmation: false,
        metricStatus: "no_metric",
        approvedWording: "Technical Product Manager at Example Company",
        unsafeWording: [],
        ...overrides
    };
}
function profileFixture(evidenceItems, claims) {
    const role = evidenceItems.find((item) => item.category === "role");
    const projects = evidenceItems.filter((item) => item.category === "project");
    return {
        id: "career_profile",
        updatedAt: "2026-07-15T08:00:00.000Z",
        positioningCandidates: ["Technical Product Manager"],
        summaryThemes: ["Platform delivery"],
        roles: role ? [{ title: role.text, company: role.company, dateRange: role.dateRange, evidenceIds: [role.id] }] : [],
        projects: projects.map((item) => ({ name: item.project ?? item.text, technologies: [], domains: [], evidenceIds: [item.id] })),
        skills: [{ name: "API", evidenceIds: evidenceItems.map((item) => item.id) }],
        domains: ["SaaS"],
        approvedClaims: claims.filter((item) => item.approvalStatus === "approved").map((item) => item.claim),
        claimsNeedingConfirmation: claims.filter((item) => item.approvalStatus === "needs_confirmation").map((item) => item.claim),
        blockedClaims: claims.filter((item) => item.approvalStatus === "blocked").map((item) => item.claim),
        resumeReadyClaims: claims.filter((item) => item.outputReadiness === "resume_ready").map((item) => item.claim),
        genericOnlyClaims: claims.filter((item) => item.outputReadiness === "generic_only").map((item) => item.claim),
        internalOnlyClaims: claims.filter((item) => item.outputReadiness === "internal_only").map((item) => item.claim),
        publicSafetyRules: []
    };
}
async function writeState(workspace, state) {
    const kb = path.join(workspace, "kb");
    await mkdir(kb, { recursive: true });
    await writeFile(path.join(kb, "sources.json"), JSON.stringify(state.sources), "utf8");
    await writeFile(path.join(kb, "evidence-items.json"), JSON.stringify(state.evidenceItems), "utf8");
    await writeFile(path.join(kb, "claims.json"), JSON.stringify(state.claims), "utf8");
    await writeFile(path.join(kb, "career-profile.json"), JSON.stringify(state.profile), "utf8");
}
function latestFixture() {
    const changes = { added: 0, removed: 0, changed: 0, unchanged: 1 };
    return {
        schemaVersion: 1,
        refreshId: "refresh_1",
        refreshedAt: "2026-07-15T10:00:00.000Z",
        firstRefresh: true,
        reportPath: "outputs/reports/update-impact-report.md",
        profileFingerprint: "fingerprint",
        profileFingerprintChanged: true,
        changes: {
            sources: { ...changes, added: 1, unchanged: 0 },
            evidence: { ...changes, added: 1, unchanged: 0 },
            claims: { ...changes, added: 1, unchanged: 0 },
            roles: changes,
            projects: changes,
            skills: changes,
            domains: changes
        },
        trustTransitions: [],
        privacyTransitions: [],
        trustCounts: { approved: 1, needsConfirmation: 0, blocked: 0, resumeReady: 1, genericOnly: 0, internalOnly: 0, doNotUse: 0 },
        privacyCounts: { high: 0, medium: 0, low: 0 },
        independentSourceFamilies: 1,
        outputs: { status: "none_registered", registered: 0, current: 0, stale: 0, drafts: 0, finals: 0, exports: 0 },
        attentionRequired: true,
        warnings: []
    };
}
