# Human-Readable Markdown Contract

## Purpose

ProofLayer JSON artifacts are canonical, machine-first records. Generated Markdown is a derived, read-only view for human inspection. Markdown must explain the meaning and current state of its canonical inputs without becoming a second source of truth.

A human-facing Markdown artifact is incomplete when a reader must open JSON merely to understand what a claim, evidence item, requirement, decision, lifecycle state, or next action means.

## Responsibility Boundary

JSON owns:

- schemas, IDs, hashes, manifests, lifecycle, provenance, review decisions, approval, and eligibility;
- canonical claim, evidence, requirement, plan, draft, and rendering content;
- all machine-consumed workflow state.

Markdown owns:

- human-readable presentation of canonical content;
- context, explanation, scannability, and next-action guidance;
- audit references that supplement, but never replace, visible meaning.

Generated Markdown is never parsed back into ProofLayer. Editing it cannot alter evidence, review, approval, eligibility, lifecycle, or downstream behavior. A changed derived file may become invalid under its renderer manifest, but it never becomes canonical input.

## Human-First Order

Use the sections relevant to the artifact, normally in this order:

1. title and purpose;
2. target or stage context;
3. human-readable inputs;
4. human-readable output or current state;
5. decisions and classifications;
6. claim, evidence, requirement, or source text;
7. rationale, limitations, risks, warnings, and ambiguities;
8. lifecycle, completeness, and downstream usability;
9. next human or system action;
10. internal references, IDs, hashes, paths, and provenance.

The governing sequence is:

```text
Meaning
  -> Context
  -> Decision
  -> Explanation
  -> References
  -> IDs and hashes
```

Opaque identifiers must not lead when meaningful text is available.

## Self-Contained References

Whenever Markdown names a referenced claim, evidence item, requirement, source, or decision, it must show the human-readable text or safe label before its ID.

Use this fallback order for a deterministic title:

1. an existing approved or source label;
2. the normalized first meaningful sentence;
3. a deterministic, word-boundary truncation of source text;
4. the opaque ID only when no safe text exists.

Do not infer a semantic title with a model. Do not expose private text merely to avoid an opaque fallback.

## Stage Snapshots

A generated Markdown stage snapshot must explain, without requiring JSON:

- the Role or Job Target;
- the stage purpose and canonical inputs;
- the current result and important classifications;
- selected, supported, partial, unsupported, excluded, or deferred items;
- the basis for consequential decisions;
- lifecycle, completeness, and downstream usability;
- the next expected action;
- audit references after the explanation.

Do not reproduce every machine field. Include the information a human needs to understand and act.

## Review And Approval Views

Review and approval Markdown must show:

- the exact text being reviewed when visibility permits;
- a safe evidence summary and exact source excerpt when permitted;
- matching requirement text;
- current decision or explicit absence of a decision;
- reason, constraints, qualifiers, risks, and warnings;
- resulting eligibility or downstream usability;
- canonical submission path and next action;
- IDs and hashes as supporting references.

Private reviewer rationale, raw model responses, and prohibited private evidence remain excluded. Proposal, review, and approval JSON stay immutable and canonical.

## User Documents

Final resumes, website copy, and resume Markdown exports are human documents rather than audit views. They must remain readable and faithful to approved wording, but must not expose internal IDs, hashes, evidence references, review metadata, fit state, or private provenance.

This contract does not authorize changes to approved substantive wording. Rendering remains a presentation-only compiler step.

## Tables And Detail

Use tables for compact counts, progress, lifecycle, and high-level status when they improve scanning. Keep detailed claims, evidence, source excerpts, requirements, decisions, and rationale in readable sections.

## Next Action

Every generated review, status, validation, planning, or stage Markdown should state one deterministic next action when action is possible. Examples include reviewing canonical JSON, rebuilding after an upstream change, generating a proposal, completing review, approving a reviewed draft, rendering an approved draft, or taking no action because the artifact is current.

Next actions must not become hiring advice, application recommendations, ATS scores, or fit predictions.

## Determinism And Lifecycle

Human-readable formatting must be deterministic:

- stable canonical inputs produce stable Markdown bytes;
- ordering is explicit and stable;
- title derivation and truncation are deterministic;
- wall-clock time is not inserted unless it is already canonical input;
- Markdown escaping and whitespace are stable;
- renderer-version changes participate in lifecycle invalidation where a renderer manifest exists;
- unchanged current artifacts are not rewritten where their workflow supports `already-current`.

Derived Markdown may be rebuilt only through its owning workflow. Stale or invalid canonical artifacts must not be repaired through Markdown rendering.

## Privacy

Generated Markdown must not expose:

- secrets, credentials, or environment values;
- private absolute paths or machine identity;
- raw model responses;
- private reviewer rationale;
- hidden assessment calculations;
- evidence text that the artifact is not permitted to show;
- rejected wording when its policy prohibits disclosure.

Use a logical source label and safe hash instead of a private path. When source text cannot be displayed safely, explain that it is withheld and retain the permitted audit reference.

## Producer Inventory

| Producer | Generated Markdown | Classification | Canonical source and treatment |
| --- | --- | --- | --- |
| `evidence-review-workspace.ts` | Review index and per-claim workspaces | Human-complete review views | Immutable batch, template, requirement, claim, evidence, and source JSON; renderer-manifest lifecycle |
| `operations.ts` | Career profile, privacy, normalization quality, trust model, rebuild changelog | Human-complete stage and health reports | Knowledge Base JSON and deterministic audit results |
| `update-impact.ts` | Update impact report | Human-complete stage report | Latest-refresh JSON, baseline, and output manifest |
| `variant-generator.ts` | Variant summary and unresolved-claims review | Human-complete draft review views | Career profile, claims, evidence, and generation manifest |
| `variant-generator.ts` | Resume and website drafts | Human-complete user drafts | Generated from canonical profile inputs; visible content remains free of audit metadata |
| `variant-review.ts` | Final public checklist | Human-complete approval summary | Variant decisions, claims, public profile, and finalization selection |
| `variant-review.ts` | Final resume and website copy | Human-complete user documents | Approved/revised claims only; substantive wording is fidelity-protected |
| `role-resume-format-renderers.ts` with Role/Job export adapters | Role and Job resume Markdown exports | Human-complete user documents | Canonical render document; exact substantive fidelity is required |
| Imported Job Descriptions and career source Markdown | Input Markdown | Not generated | Immutable user-controlled input; outside this rendering contract |
| Proposal raw responses | Machine-oriented, normally JSON | Intentionally non-human | Untrusted provider output; never converted into an approval view automatically |
| Pipeline artifacts without a Markdown producer | Canonical JSON only | Intentionally machine-oriented | Existing `show` commands return stable JSON; no duplicate Markdown source of truth is created |
| Controlled validation and recruiter reports | Authored run records | Human-complete when created | Not produced by a reusable runtime renderer; unchanged by system-wide renderer updates |

## Future UI Consumption

A future UI may consume canonical JSON and reproduce this information hierarchy. It must not parse generated Markdown or treat Markdown as workflow state. Shared presentation helpers may inform labels and ordering, but UI behavior must preserve the same trust, privacy, provenance, and source-of-truth boundaries.

## Implementation Checklist

When adding or changing generated Markdown:

1. identify the canonical JSON source;
2. identify the human consumer and next action;
3. show meaning before IDs;
4. include safe context and consequential rationale;
5. keep private material excluded;
6. keep visible user documents free of audit metadata;
7. use stable ordering, escaping, and deterministic titles;
8. version the renderer when a manifest tracks it;
9. test that Markdown edits have no system effect;
10. verify that canonical JSON meaning and approved visible wording remain unchanged.
