import type { Claim } from "./schemas.js";

export const ROLE_KEYS = ["tpm", "ai-product", "fullstack", "fractional-cto"] as const;
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

export const ROLE_VARIANTS: Record<RoleKey, RoleVariantDefinition> = {
  tpm: {
    roleKey: "tpm",
    displayName: "Technical Product Manager",
    headline: "Technical Product Manager | Product Strategy, Platform Delivery, Cross-Functional Execution",
    positioningPriorities: [
      "product discovery", "roadmap", "prioritization", "platform delivery", "stakeholder alignment",
      "technical tradeoffs", "AI-assisted product workflows", "telecom SaaS", "EdTech", "Tqweem Masr",
      "higher//faster", "FastForward.ai", "Simplative"
    ],
    preferredClaimTypes: ["responsibility_claim", "competency_claim", "project_claim", "role_claim", "skill_claim", "domain_claim"],
    preferredDomains: ["platform", "SaaS", "telecom", "EdTech", "AI", "assessment", "payments"],
    preferredSkillsTools: ["API", "Jira", "Linear", "Notion", "Figma", "GitHub Projects", "Google Analytics", "Supabase", "TypeScript"],
    preferredProjects: ["SB (SignalBoard)", "Career Evidence Workflow", "InSightARLeans"],
    deEmphasizedAreas: ["pure coding", "legacy Java implementation", "coding-only"],
    outputTone: "Product-first, technically credible, practical, and cross-functional."
  },
  "ai-product": {
    roleKey: "ai-product",
    displayName: "AI Product Manager",
    headline: "AI Product Manager | AI-Assisted Workflows, Product Validation, Technical Product Strategy",
    positioningPriorities: [
      "AI-assisted workflows", "SignalBoard", "InSightARLeans", "AI mobile", "product validation",
      "evidence-backed decision support", "experimentation", "evaluation scenarios", "technical evaluation",
      "signal extraction", "human-in-the-loop"
    ],
    preferredClaimTypes: ["project_claim", "responsibility_claim", "competency_claim", "skill_claim", "impact_claim", "domain_claim"],
    preferredDomains: ["AI", "AR", "mobile", "platform"],
    preferredSkillsTools: ["AI", "TensorFlow.js", "TypeScript", "React Native", "Expo", "Supabase", "API"],
    preferredProjects: ["SB (SignalBoard)", "InSightARLeans", "Career Evidence Workflow", "HealthyMeal Advisor"],
    deEmphasizedAreas: ["legacy Java", "generic consulting", "enterprise implementation detail"],
    outputTone: "Evidence-aware, experimental, technically grounded, and careful about AI validation."
  },
  fullstack: {
    roleKey: "fullstack",
    displayName: "Senior Full Stack / Product-Minded Engineer",
    headline: "Senior Full Stack / Product-Minded Engineer | TypeScript, React, Node.js, Mobile & Platform Delivery",
    positioningPriorities: [
      "TypeScript", "React", "React Native", "Expo", "Node.js", "Vue.js", "Java", "Spring",
      "API", "Docker", "CI/CD", "Supabase", "FastForward.ai", "higher//faster", "mobile", "web delivery"
    ],
    preferredClaimTypes: ["skill_claim", "responsibility_claim", "project_claim", "role_claim", "impact_claim", "domain_claim"],
    preferredDomains: ["mobile", "platform", "SaaS", "enterprise", "telecom"],
    preferredSkillsTools: ["TypeScript", "JavaScript", "React", "React Native", "Expo", "Node.js", "Vue.js", "Java", "Spring", "API", "Docker", "CI/CD", "Supabase"],
    preferredProjects: ["SB (SignalBoard)", "InSightARLeans", "HealthyMeal Advisor"],
    deEmphasizedAreas: ["broad product leadership", "GTM", "advisory-only"],
    outputTone: "Implementation-forward, product-minded, concise, and platform-aware."
  },
  "fractional-cto": {
    roleKey: "fractional-cto",
    displayName: "Product & Technology Lead / Fractional CTO",
    headline: "Product & Technology Lead | Fractional CTO | Platform Strategy, Delivery, Technical Leadership",
    positioningPriorities: [
      "CTO", "product and technology leadership", "architecture", "delivery risk", "roadmap", "scope tradeoffs",
      "startup", "SME", "consulting", "platform decisions", "cross-functional alignment", "enterprise foundation",
      "Simplative", "Tqweem Masr", "Upgrade77", "TMX", "Telecomax", "advisory"
    ],
    preferredClaimTypes: ["role_claim", "leadership_claim", "responsibility_claim", "competency_claim", "project_claim", "domain_claim"],
    preferredDomains: ["startup", "enterprise", "platform", "SaaS", "telecom", "EdTech", "ERP", "CRM"],
    preferredSkillsTools: ["API", "CI/CD", "Docker", "Supabase", "TypeScript", "Java", "Spring"],
    preferredProjects: ["SB (SignalBoard)", "Career Evidence Workflow", "InSightARLeans"],
    deEmphasizedAreas: ["detailed coding stack", "coding-only", "individual contributor implementation detail"],
    outputTone: "Senior, commercially aware, delivery-focused, and technically defensible."
  }
};

export function isRoleKey(value: string): value is RoleKey {
  return ROLE_KEYS.includes(value as RoleKey);
}

export function getRoleVariant(roleKey: RoleKey): RoleVariantDefinition {
  return ROLE_VARIANTS[roleKey];
}
