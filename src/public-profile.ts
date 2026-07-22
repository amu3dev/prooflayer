import path from "node:path";
import { pathExists, readJson, writeJsonAtomic } from "./fs-utils.js";
import { PublicProfileSchema, type PublicProfile } from "./schemas.js";

export const PUBLIC_PROFILE_FILE = "config/public-profile.json";

export type PublicProfileInitResult = {
  created: boolean;
  path: string;
  profile: PublicProfile;
};

export async function initializePublicProfile(
  workspace: string,
  initial: Partial<PublicProfile> = {}
): Promise<PublicProfileInitResult> {
  const profilePath = path.join(workspace, PUBLIC_PROFILE_FILE);
  if (await pathExists(profilePath)) {
    return {
      created: false,
      path: PUBLIC_PROFILE_FILE,
      profile: PublicProfileSchema.parse(await readJson<unknown>(profilePath, {}))
    };
  }

  const profile = PublicProfileSchema.parse({ schemaVersion: 1, ...initial });
  await writeJsonAtomic(profilePath, profile);
  return { created: true, path: PUBLIC_PROFILE_FILE, profile };
}

export async function loadPublicProfile(workspace: string): Promise<PublicProfile | null> {
  const profilePath = path.join(workspace, PUBLIC_PROFILE_FILE);
  if (!(await pathExists(profilePath))) return null;
  return PublicProfileSchema.parse(await readJson<unknown>(profilePath, {}));
}

export function formatPublicProfileSummary(profile: PublicProfile | null): string {
  if (!profile) {
    return [
      "Public profile: not initialized",
      `Path: ${PUBLIC_PROFILE_FILE}`,
      "Run public-profile init, then add only manually approved public metadata."
    ].join("\n");
  }

  return [
    "Public profile:",
    `- Name: ${profile.publicName ?? "not set"}`,
    `- Headline override: ${profile.headlineOverride ?? "not set"}`,
    `- Role headline overrides: ${Object.keys(profile.headlineOverrides ?? {}).length}`,
    `- Location: ${profile.location ?? "not set"}`,
    `- Email: ${profile.email ? "set" : "not set"}`,
    `- Website: ${profile.website ?? "not set"}`,
    `- LinkedIn: ${profile.linkedin ?? "not set"}`,
    `- GitHub: ${profile.github ?? "not set"}`,
    `- Public summary override: ${profile.publicSummaryOverride ? "set" : "not set"}`,
    `- Education wording overrides: ${Object.keys(profile.educationWordingOverrides ?? {}).length}`,
    `- Certification wording overrides: ${Object.keys(profile.certificationWordingOverrides ?? {}).length}`,
    `Path: ${PUBLIC_PROFILE_FILE}`
  ].join("\n");
}
