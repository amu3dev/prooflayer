import path from "node:path";
import { countChanges, createRefreshBaseline, detectUpdateImpact } from "./change-detector.js";
import { hashFile, pathExists, readJson, stableId, writeJsonAtomic, writeText } from "./fs-utils.js";
import { inlineCode, renderDerivedMarkdownBanner, renderNextAction, } from "./human-readable-markdown.js";
import { rebuild } from "./operations.js";
import { auditSourcesAndEvidence } from "./privacy.js";
export const UPDATE_BASELINE_PATH = "kb/update-baseline.json";
export const UPDATE_IMPACT_REPORT_PATH = "outputs/reports/update-impact-report.md";
export const LATEST_REFRESH_PATH = "outputs/changelogs/latest-refresh.json";
export const OUTPUT_MANIFEST_PATH = "outputs/output-manifest.json";
const EMPTY_TRUST_COUNTS = {
    approved: 0,
    needsConfirmation: 0,
    blocked: 0,
    resumeReady: 0,
    genericOnly: 0,
    internalOnly: 0,
    doNotUse: 0
};
const EMPTY_PRIVACY_COUNTS = { high: 0, medium: 0, low: 0 };
export async function refreshWorkspace(workspace, options = {}) {
    const baselinePath = path.join(workspace, UPDATE_BASELINE_PATH);
    const previous = await readJson(baselinePath, null);
    const runPipeline = options.runPipeline ?? rebuild;
    const now = options.now ?? (() => new Date());
    // The previous baseline remains untouched if any pipeline or report step fails.
    await runPipeline(workspace);
    const state = await loadKnowledgeState(workspace);
    const refreshedAt = now().toISOString();
    const current = createRefreshBaseline(state, refreshedAt);
    const impact = detectUpdateImpact(previous, current);
    const outputs = await inspectOutputStaleness(workspace, current.profileFingerprint);
    const warnings = buildWarnings(current, outputs);
    const latest = buildLatestRefresh(previous, current, impact, outputs, warnings, refreshedAt);
    const report = renderUpdateImpactReport(latest);
    await writeText(path.join(workspace, UPDATE_IMPACT_REPORT_PATH), report);
    await writeJsonAtomic(path.join(workspace, LATEST_REFRESH_PATH), latest);
    await writeJsonAtomic(baselinePath, current);
    return latest;
}
export async function getLatestChanges(workspace) {
    return readJson(path.join(workspace, LATEST_REFRESH_PATH), null);
}
export async function getWorkspaceStatus(workspace) {
    const baseline = await readJson(path.join(workspace, UPDATE_BASELINE_PATH), null);
    const latest = await getLatestChanges(workspace);
    const sources = await readJson(path.join(workspace, "kb/sources.json"), []);
    const fingerprint = baseline?.profileFingerprint;
    const outputs = fingerprint
        ? await inspectOutputStaleness(workspace, fingerprint)
        : { status: "none_registered", registered: 0, current: 0, stale: 0, drafts: 0, finals: 0, exports: 0 };
    return {
        initialized: Boolean(baseline),
        sourceCount: baseline?.sources.length ?? sources.length,
        lastSuccessfulRefresh: baseline?.successfulRefreshAt,
        profileFingerprint: fingerprint,
        warningCount: latest?.warnings.length ?? 0,
        trustCounts: baseline?.trustCounts ?? { ...EMPTY_TRUST_COUNTS },
        privacyCounts: baseline?.privacyCounts ?? { ...EMPTY_PRIVACY_COUNTS },
        outputs
    };
}
export function formatChangesSummary(latest) {
    if (!latest) {
        return `No successful refresh has been recorded.\nUpdate impact report: ${UPDATE_IMPACT_REPORT_PATH}`;
    }
    return [
        latest.firstRefresh ? "Latest refresh established the first baseline." : "Latest refresh compared successfully with the previous baseline.",
        `Sources: +${latest.changes.sources.added} / -${latest.changes.sources.removed} / ~${latest.changes.sources.changed}`,
        `Evidence: +${latest.changes.evidence.added} / -${latest.changes.evidence.removed} / ~${latest.changes.evidence.changed}`,
        `Claims: +${latest.changes.claims.added} / -${latest.changes.claims.removed} / ~${latest.changes.claims.changed}`,
        `Trust transitions: ${latest.trustTransitions.length}; privacy transitions: ${latest.privacyTransitions.length}`,
        `User attention required: ${latest.attentionRequired ? "yes" : "no"}`,
        `Update impact report: ${latest.reportPath}`
    ].join("\n");
}
export function formatStatusSummary(status) {
    return [
        `Status: ${status.initialized ? "ready" : "no successful refresh baseline"}`,
        `Sources: ${status.sourceCount}`,
        `Last successful refresh: ${status.lastSuccessfulRefresh ?? "none"}`,
        `Profile fingerprint: ${status.profileFingerprint ?? "none"}`,
        `Warnings: ${status.warningCount}`,
        `Trust: approved ${status.trustCounts.approved}, needs confirmation ${status.trustCounts.needsConfirmation}, blocked ${status.trustCounts.blocked}`,
        `Readiness: resume-ready ${status.trustCounts.resumeReady}, generic-only ${status.trustCounts.genericOnly}, internal-only ${status.trustCounts.internalOnly}, do-not-use ${status.trustCounts.doNotUse}`,
        `Privacy: high ${status.privacyCounts.high}, medium ${status.privacyCounts.medium}, low ${status.privacyCounts.low}`,
        `Outputs: ${formatOutputStatus(status.outputs)}`
    ].join("\n");
}
export async function inspectOutputStaleness(workspace, profileFingerprint) {
    const manifestPath = path.join(workspace, OUTPUT_MANIFEST_PATH);
    if (!(await pathExists(manifestPath))) {
        return { status: "none_registered", registered: 0, current: 0, stale: 0, drafts: 0, finals: 0, exports: 0 };
    }
    const manifest = await readJson(manifestPath, { outputs: [] });
    const outputs = Array.isArray(manifest.outputs) ? manifest.outputs : [];
    if (outputs.length === 0)
        return { status: "none_registered", registered: 0, current: 0, stale: 0, drafts: 0, finals: 0, exports: 0 };
    const currentStates = await Promise.all(outputs.map(async (output) => {
        if (output.profileFingerprint !== profileFingerprint)
            return false;
        if (output.publicationStatus !== "export")
            return true;
        if (!output.sourceMarkdownPath || !output.sourceMarkdownHash)
            return false;
        const sourcePath = path.join(workspace, output.sourceMarkdownPath);
        return await pathExists(sourcePath) && await hashFile(sourcePath) === output.sourceMarkdownHash;
    }));
    const current = currentStates.filter(Boolean).length;
    const stale = outputs.length - current;
    return {
        status: stale > 0 ? "stale" : "current",
        registered: outputs.length,
        current,
        stale,
        drafts: outputs.filter((output) => (output.publicationStatus ?? "draft") === "draft").length,
        finals: outputs.filter((output) => output.publicationStatus === "final").length,
        exports: outputs.filter((output) => output.publicationStatus === "export").length
    };
}
function buildLatestRefresh(previous, current, impact, outputs, warnings, refreshedAt) {
    const changes = {
        sources: countChanges(impact.sources),
        evidence: countChanges(impact.evidence),
        claims: countChanges(impact.claims),
        roles: countChanges(impact.profileAreas.roles),
        projects: countChanges(impact.profileAreas.projects),
        skills: countChanges(impact.profileAreas.skills),
        domains: countChanges(impact.profileAreas.domains)
    };
    const meaningfulChanges = Object.values(changes).some((count) => count.added + count.removed + count.changed > 0);
    const attentionRequired = meaningfulChanges || impact.trustTransitions.length > 0 || impact.privacyTransitions.length > 0 || warnings.length > 0;
    return {
        schemaVersion: 1,
        refreshId: stableId("refresh", [refreshedAt, current.profileFingerprint]),
        refreshedAt,
        firstRefresh: impact.firstRefresh,
        reportPath: UPDATE_IMPACT_REPORT_PATH,
        profileFingerprint: current.profileFingerprint,
        previousProfileFingerprint: previous?.profileFingerprint,
        profileFingerprintChanged: impact.profileFingerprintChanged,
        changes,
        trustTransitions: impact.trustTransitions,
        privacyTransitions: impact.privacyTransitions,
        trustCounts: current.trustCounts,
        privacyCounts: current.privacyCounts,
        independentSourceFamilies: current.independentSourceFamilies,
        outputs,
        attentionRequired,
        warnings
    };
}
async function loadKnowledgeState(workspace) {
    const sources = await readJson(path.join(workspace, "kb/sources.json"), []);
    const evidenceItems = await readJson(path.join(workspace, "kb/evidence-items.json"), []);
    const claims = await readJson(path.join(workspace, "kb/claims.json"), []);
    const profile = await readJson(path.join(workspace, "kb/career-profile.json"), null);
    if (!profile)
        throw new Error("Refresh pipeline did not produce kb/career-profile.json.");
    const privacyFindings = auditSourcesAndEvidence(sources, evidenceItems, claims);
    return { sources, evidenceItems, claims, profile, privacyFindings };
}
function buildWarnings(baseline, outputs) {
    const warnings = [];
    if (baseline.trustCounts.resumeReady === 0)
        warnings.push("No claims are currently resume-ready.");
    if (baseline.privacyCounts.high > 0)
        warnings.push("High-risk privacy findings require review.");
    if (baseline.privacyCounts.medium > 0)
        warnings.push("Medium-risk privacy findings require review before public output.");
    if (outputs.status === "stale")
        warnings.push(`${outputs.stale} registered output(s) are stale.`);
    if (baseline.sources.length > baseline.independentSourceFamilies) {
        warnings.push("Repeated CV or export files were grouped into source families and were not counted as independent corroboration in this report.");
    }
    return warnings;
}
function renderUpdateImpactReport(latest) {
    const areaLine = (label, counts) => `- ${label}: +${counts.added} added, -${counts.removed} removed, ~${counts.changed} changed, ${counts.unchanged} unchanged`;
    const privacyTransitionText = latest.privacyTransitions.length > 0
        ? `${latest.privacyTransitions.length} privacy status transition(s) detected; inspect the machine-readable changelog for hashed item references.`
        : "No privacy status transitions detected.";
    const trustTransitionText = latest.trustTransitions.length > 0
        ? `${latest.trustTransitions.length} trust/readiness transition(s) detected; inspect the machine-readable changelog for hashed item references.`
        : "No trust/readiness transitions detected.";
    return `${renderDerivedMarkdownBanner("the latest-refresh JSON and current output manifest")}

# Update Impact Report

## Purpose

Explain what changed during the latest successful refresh and whether downstream outputs need human attention.

## Current State

- Refresh completed: ${latest.refreshedAt}
- User attention required: ${latest.attentionRequired ? "yes" : "no"}
- Registered output state: ${formatOutputStatus(latest.outputs)}

## What Changed?

${latest.firstRefresh ? "This refresh established the first successful privacy-safe baseline. Current knowledge items are reported as additions." : "This refresh was compared with the previous successful baseline."}

${areaLine("Sources", latest.changes.sources)}
${areaLine("Evidence items", latest.changes.evidence)}
${areaLine("Claims", latest.changes.claims)}
- Profile fingerprint changed: ${latest.profileFingerprintChanged ? "yes" : "no"}
- Independent source families: ${latest.independentSourceFamilies}

## Which Career-Profile Areas Changed?

${areaLine("Roles", latest.changes.roles)}
${areaLine("Projects", latest.changes.projects)}
${areaLine("Skills", latest.changes.skills)}
${areaLine("Domains", latest.changes.domains)}

## Which Trust and Privacy Statuses Changed?

- ${trustTransitionText}
- ${privacyTransitionText}
- Approved claims: ${latest.trustCounts.approved}
- Claims needing confirmation: ${latest.trustCounts.needsConfirmation}
- Blocked claims: ${latest.trustCounts.blocked}
- Resume-ready claims: ${latest.trustCounts.resumeReady}
- Generic-only claims: ${latest.trustCounts.genericOnly}
- Internal-only claims: ${latest.trustCounts.internalOnly}
- Privacy findings: ${latest.privacyCounts.high} high, ${latest.privacyCounts.medium} medium, ${latest.privacyCounts.low} low

## Which Outputs Are Stale?

- ${formatOutputStatus(latest.outputs)}

## Is User Attention Required?

- ${latest.attentionRequired ? "Yes. Review the changes and warnings before relying on downstream public outputs." : "No. The knowledge state and registered outputs remain current."}

## Warnings

${renderList(latest.warnings)}

## Safety Notes

- This report contains counts and hashed references only; it does not copy raw extracted text or claims.
- Source matching uses normalized relative path and source type; file hashes identify versions.
- Repeated CV variants and repeated exports are grouped for impact reporting rather than treated as independent corroboration.

${renderNextAction(latest.attentionRequired
        ? "Review the listed changes and warnings, then explicitly rebuild any stale downstream artifact through its owning workflow."
        : "No action is required; the latest refresh and registered outputs are current.")}

## Internal References

- Refresh ID: ${inlineCode(latest.refreshId)}
- Profile fingerprint: ${inlineCode(latest.profileFingerprint)}
`;
}
function formatOutputStatus(outputs) {
    if (outputs.status === "none_registered")
        return "none registered";
    const types = `draft ${outputs.drafts}, final ${outputs.finals}${outputs.exports > 0 ? `, export ${outputs.exports}` : ""}`;
    if (outputs.status === "stale")
        return `${outputs.stale} stale of ${outputs.registered} registered (${types})`;
    return `all ${outputs.registered} registered outputs are current (${types})`;
}
function renderList(values) {
    return values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "- None.";
}
