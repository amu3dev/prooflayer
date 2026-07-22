const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_RE = /(?:\+?\d[\d\s().-]{7,}\d)/;
const ABSOLUTE_PATH_RE = /(?:\/Users\/|\/home\/|\/private\/|[A-Z]:\\)/i;
const SECRET_RE = /\b(?:api[_-]?key|token|secret|credential|password|private[_-]?key|bearer)\b/i;
const PRIVATE_URL_RE = /(?:\blocalhost\b|\b127\.0\.0\.1\b|\b[a-z0-9.-]+\.(?:local|internal)\b|https?:\/\/[^\s]*(?:intranet|staging|internal))/i;
export function detectSensitivity(text) {
    const flags = [];
    if (EMAIL_RE.test(text))
        flags.push("email");
    if (PHONE_RE.test(text))
        flags.push("phone_number");
    if (ABSOLUTE_PATH_RE.test(text))
        flags.push("absolute_local_path");
    if (SECRET_RE.test(text))
        flags.push("secret_like_string");
    if (PRIVATE_URL_RE.test(text))
        flags.push("private_url_or_internal_host");
    return [...new Set(flags)];
}
export function sourceVisibilityFromPath(relativePath) {
    const normalized = relativePath.toLowerCase();
    const fileName = normalized.split("/").at(-1) ?? normalized;
    if (normalized.includes("/linkedin/")) {
        const clearlyProfessional = [
            "profile",
            "positions",
            "skills",
            "education",
            "certifications",
            "recommendations"
        ].some((safeName) => fileName.includes(safeName));
        return clearlyProfessional ? "generic_only" : "private";
    }
    if (normalized.includes("/github/") && !normalized.includes("private"))
        return "public";
    if (normalized.includes("/cvs/"))
        return "generic_only";
    if (normalized.includes("/recommendations/"))
        return "generic_only";
    if (normalized.includes("/certificates/"))
        return "public";
    if (normalized.includes("/jobs/"))
        return "private";
    if (normalized.includes("/pdf/") || normalized.includes("/docx/"))
        return "unknown";
    return "unknown";
}
export function auditSourcesAndEvidence(sources, evidenceItems, claims = []) {
    const findings = [];
    for (const source of sources) {
        if (source.visibility === "do_not_use" || source.visibility === "sensitive") {
            findings.push({
                severity: "high",
                targetType: "source",
                targetId: source.id,
                finding: `Source visibility is ${source.visibility}.`
            });
        }
        if (source.visibility === "unknown") {
            findings.push({
                severity: "medium",
                targetType: "source",
                targetId: source.id,
                finding: "Source visibility is unknown and should be reviewed before public use."
            });
        }
        if (source.visibility === "generic_only") {
            findings.push({
                severity: "low",
                targetType: "source",
                targetId: source.id,
                finding: "Source is generic-only; exact wording is not approved for verbatim public output."
            });
        }
        if (ABSOLUTE_PATH_RE.test(source.path)) {
            findings.push({
                severity: "medium",
                targetType: "source",
                targetId: source.id,
                finding: "Source path contains an absolute local path."
            });
        }
        if (source.path.includes("__") && source.visibility !== "public") {
            findings.push({
                severity: "low",
                targetType: "source",
                targetId: source.id,
                finding: "Source path may contain a GitHub owner/repository reference; review wording before public use."
            });
        }
    }
    for (const item of evidenceItems) {
        for (const flag of item.sensitivityFlags) {
            findings.push({
                severity: flag === "secret_like_string" ? "high" : "medium",
                targetType: "evidence",
                targetId: item.id,
                finding: `Evidence contains ${flag}.`
            });
        }
        if (item.visibility === "do_not_use" || item.visibility === "sensitive") {
            findings.push({
                severity: "high",
                targetType: "evidence",
                targetId: item.id,
                finding: `Evidence visibility is ${item.visibility}.`
            });
        }
        if (item.visibility === "unknown") {
            findings.push({
                severity: "medium",
                targetType: "evidence",
                targetId: item.id,
                finding: "Evidence visibility is unknown."
            });
        }
    }
    for (const claim of claims) {
        if (claim.outputReadiness === "generic_only" && claim.publicSafe) {
            findings.push({
                severity: "high",
                targetType: "claim",
                targetId: claim.id,
                finding: "Generic-only claim is incorrectly marked verbatim public-safe."
            });
        }
        if (claim.approvalStatus === "blocked") {
            findings.push({
                severity: "high",
                targetType: "claim",
                targetId: claim.id,
                finding: `Claim is blocked with output readiness ${claim.outputReadiness}.`
            });
        }
    }
    return findings;
}
