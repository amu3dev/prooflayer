import { describe, expect, it } from "vitest";
import { detectSensitivity, sourceVisibilityFromPath } from "../privacy.js";
describe("privacy helpers", () => {
    it("defaults LinkedIn private unless clearly professional", () => {
        expect(sourceVisibilityFromPath("sources/linkedin/messages.csv")).toBe("private");
        expect(sourceVisibilityFromPath("sources/linkedin/Profile.csv")).toBe("generic_only");
    });
    it("treats deliberately imported CVs as professional generic-only evidence", () => {
        expect(sourceVisibilityFromPath("sources/cvs/resume.md")).toBe("generic_only");
    });
    it("detects sensitive text patterns", () => {
        expect(detectSensitivity("Contact me at person@example.com")).toContain("email");
        expect(detectSensitivity("api_key=abc123")).toContain("secret_like_string");
        expect(detectSensitivity("/Users/example/private/file.md")).toContain("absolute_local_path");
    });
    it("distinguishes ordinary internal work from private hosts", () => {
        expect(detectSensitivity("Coordinated internal and external contributors")).not.toContain("private_url_or_internal_host");
        expect(detectSensitivity("Preview at https://service.internal/dashboard")).toContain("private_url_or_internal_host");
    });
});
