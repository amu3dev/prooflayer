import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatPublicProfileSummary, initializePublicProfile, loadPublicProfile, PUBLIC_PROFILE_FILE } from "../public-profile.js";
describe("Slice 1.6 public profile metadata", () => {
    it("creates a public profile config without overwriting existing values", async () => {
        const workspace = await mkdtemp(path.join(tmpdir(), "prooflayer-public-profile-"));
        const first = await initializePublicProfile(workspace, {
            publicName: "Approved Name",
            github: "https://github.com/example"
        });
        const firstText = await readFile(path.join(workspace, PUBLIC_PROFILE_FILE), "utf8");
        const second = await initializePublicProfile(workspace, {
            publicName: "Replacement Name",
            website: "https://example.com"
        });
        const secondText = await readFile(path.join(workspace, PUBLIC_PROFILE_FILE), "utf8");
        expect(first.created).toBe(true);
        expect(second.created).toBe(false);
        expect(secondText).toBe(firstText);
        expect(await loadPublicProfile(workspace)).toMatchObject({
            publicName: "Approved Name",
            github: "https://github.com/example"
        });
        expect(formatPublicProfileSummary(second.profile)).toContain("Education wording overrides: 0");
    });
});
