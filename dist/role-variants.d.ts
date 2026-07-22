import type { Claim } from "./schemas.js";
export declare const ROLE_KEYS: readonly ["tpm", "ai-product", "fullstack", "fractional-cto"];
export type RoleKey = typeof ROLE_KEYS[number];
export type RoleVariantDefinition = {
    roleKey: RoleKey;
    displayName: string;
    headline: string;
    positioningPriorities: string[];
    preferredClaimTypes: Claim["type"][];
    preferredDomains: string[];
    preferredSkillsTools: string[];
    preferredProjects: string[];
    deEmphasizedAreas: string[];
    outputTone: string;
};
export declare const ROLE_VARIANTS: Record<RoleKey, RoleVariantDefinition>;
export declare function isRoleKey(value: string): value is RoleKey;
export declare function getRoleVariant(roleKey: RoleKey): RoleVariantDefinition;
