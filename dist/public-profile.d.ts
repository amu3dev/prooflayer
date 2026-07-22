import { type PublicProfile } from "./schemas.js";
export declare const PUBLIC_PROFILE_FILE = "config/public-profile.json";
export type PublicProfileInitResult = {
    created: boolean;
    path: string;
    profile: PublicProfile;
};
export declare function initializePublicProfile(workspace: string, initial?: Partial<PublicProfile>): Promise<PublicProfileInitResult>;
export declare function loadPublicProfile(workspace: string): Promise<PublicProfile | null>;
export declare function formatPublicProfileSummary(profile: PublicProfile | null): string;
