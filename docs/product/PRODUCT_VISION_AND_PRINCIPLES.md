# ProofLayer Product Vision and Principles

## Product Promise

ProofLayer is an evidence-driven career intelligence product that builds and maintains a persistent, evolving representation of a person's professional history.

That representation is the **Career Twin**. It helps a person create a resume for a target role or understand and tailor a resume to a specific Job Description without rebuilding their career history for every output.

The Career Twin is a product-facing projection, not a second source of truth. The existing Evidence Foundation, Career Profile, source registry, reviewed claims, immutable snapshots, targets, and derived outputs remain canonical. Resumes are derived products of that knowledge.

## Core Principles

1. **Build once, evolve continuously.** New sources update an existing career history; they do not replace it.
2. **Never ask twice when ProofLayer already knows a defensible answer.** Current effective reviews and approved corrections are reused until their source changes materially.
3. **Start with whatever the user has.** A CV, one document, copied profile text, project notes, a portfolio, a GitHub source, or existing Evidence Foundation data can all be a valid beginning.
4. **No specific source is mandatory.** LinkedIn and GitHub are optional.
5. **Value before verification.** ProofLayer produces the safest useful result available and escalates only uncertainty that is material to the current output.
6. **Escalate only material uncertainty.** Questions must be unresolved, relevant, not safely derivable, and capable of changing the result.
7. **The Career Twin persists; resumes are derived.** A target never becomes career history, and an output never becomes factual authority.
8. **Trust machinery remains under the product surface.** Provenance, snapshots, policies, manifests, hashes, and lifecycle state continue to enforce the result without becoming the default user vocabulary.
9. **Astro is the primary human interface.** The local product shell organizes normal user journeys.
10. **The CLI remains the expert interface.** Granular commands remain available for automation, inspection, recovery, and debugging.

## Minimum Viable Input

One safe local source is enough to start. The product communicates:

> This is enough to start. You can add more later.

The initial source may be incomplete. ProofLayer shows the value currently available, keeps limitations visible, and supports incremental additions without requiring a complete re-upload.

Unsupported remote connectors are not represented as connected. Users can provide an export, paste text, upload a local file, or follow local-source instructions.

## Career Twin Projection

The product projection summarizes current canonical knowledge:

- professional identity and positioning;
- timeline, roles, organizations, and projects;
- capabilities, skills, technologies, achievements, and reviewed metrics;
- available source types and source coverage;
- human-readable trust and readiness;
- unresolved material questions;
- recent update state;
- current Role and Job Targets;
- current generated outputs.

Advanced provenance remains available through progressive disclosure. The projection is derived in memory, is not persisted as a parallel identity record, and has no authority to change evidence or review state.

## Incremental Updates

The product supports adding a source, detecting changes, explaining what changed, and applying safe updates through existing ingestion and refresh capabilities.

Reviewed or approved information is never silently overwritten. A changed source may make a prior answer stale and raise a new material question. Unchanged information remains effective and is not re-confirmed.

## Create a Resume for a Role

The primary input is the target role title. Seniority, domain, location, and working model are optional.

The product translates the Role pipeline into:

1. Role understood
2. Relevant experience selected
3. Resume prepared
4. Ready for review
5. Exported

A title alone is enough to begin. ProofLayer creates a generated role understanding using an explicitly selected provider or a conservative built-in taxonomy for common role families, then derives cautious evidence, fit, section-planning, and exact-approved-wording preview projections from current reviewed evidence. Generated expectations remain visibly unapproved and never become candidate facts. At most one material specialization question is shown; a conservative general direction remains usable when the user skips it.

Canonical Role interpretation, matching, assessment, planning, drafting, and rendering approvals remain unchanged. Model-authored wording still requires human review before approval or export, and the expert CLI remains available for detailed audit and control.

## Tailor a Resume to a Job

The user may paste or upload a Job Description or select an existing Job Target. Explicit fields may supplement deterministic front matter but are not all required.

The product translates the Job pipeline into:

1. Job understood
2. Fit analyzed
3. Resume tailored
4. Ready for review
5. Exported

Fit is qualitative and evidence-based. The UI may show direct or partial support counts only with an explicit denominator. It never displays hiring probability, an application recommendation, or false numerical precision.

## Value Before Full Verification

Internal trust states continue to control safe use:

- verified evidence may be used as approved;
- supported evidence may be used conservatively;
- inferred wording is qualified or omitted unless materially important;
- uncertain material facts become clarifications;
- blocked or private evidence is never used publicly.

This product behavior does not weaken canonical validation. Model-authored prose still requires review, and no model output approves itself.

## Clarifications and Advanced Review

The Clarification Center is a filtered view of unresolved material questions. It does not create a UI-specific answer store. Answers are canonical review decisions and remain reusable across targets while their evidence remains current.

Advanced Review preserves the existing Evidence Review UI for evidence audits, corrected wording, privacy decisions, and metric verification. It is an escalation path, not the default route to value.

## Interface Boundary

Astro is a thin, local interaction layer over domain projections and orchestration services. It does not shell out to the CLI, duplicate canonical artifacts, parse derived Markdown, or store pipeline truth.

Normal product workflows and Advanced Review share a loopback-only HTTP security foundation but have separate authorization scopes. Product forms are bound to their registered route, action, and target when applicable. Review forms are independently bound to their batch and claim. Neither token class can authorize the other, and launching the Product Shell does not lock ordinary workflows to one review batch.

The UI does not submit applications, publish outputs, invent connectors, auto-approve model output, or expose internal pipeline artifacts in primary navigation.

The capability order and proof boundaries remain defined by the [ProofLayer Capability Pipeline Architecture](../architecture/PIPELINE_ARCHITECTURE.md).
