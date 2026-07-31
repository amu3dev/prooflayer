# ProofLayer Capability Pipeline Architecture

## 1. Purpose

ProofLayer is an Evidence-Driven Career Intelligence Platform.

Its purpose is to turn reviewed career evidence into traceable, target-aware career outputs without allowing targeting, evaluation, or presentation concerns to rewrite the factual foundation. A resume is one document type built on this reusable capability pipeline. The same pipeline can support other career artifacts when their inputs, proof boundaries, review requirements, and downstream consumers are defined.

This document is the canonical architectural reference for ProofLayer pipelines. It defines capability order, responsibilities, boundaries, and artifact philosophy independently of implementation modules or storage details.

Generated human inspection views follow the [Human-Readable Markdown Contract](HUMAN_READABLE_MARKDOWN_CONTRACT.md). Canonical JSON owns workflow state; derived Markdown explains that state without becoming machine input.

The [Product Vision and Principles](../product/PRODUCT_VISION_AND_PRINCIPLES.md) defines the Career Twin product projection and the human Role and Job journeys layered over this capability architecture.

## 2. Core Principles

### Deterministic By Default

Equivalent approved inputs should produce stable identities and semantically equivalent outputs. Model assistance is an optional escalation path, not a prerequisite for normal deterministic operation.

### Local-First

Core workflows operate on local files and remain usable offline. Private career evidence stays under user control unless the user explicitly chooses another boundary.

### Evidence-Driven

Reviewed evidence and approved claims are the factual foundation. Targets describe desired positioning or external opportunities; they are not candidate evidence.

### Immutable Evidence Consumption

The reviewed Evidence Foundation remains the source of truth, but target pipelines consume it through immutable, content-addressed snapshots. Each Role or Job target selects one snapshot explicitly. Creating a newer snapshot never upgrades a target or changes an existing consumer.

### Provenance Everywhere

Every meaningful derived statement or relationship must retain enough lineage to identify its source evidence, upstream artifact, policy, and lifecycle state.

### Review Where Necessary

Human review is required when interpretation, public wording, ambiguity, or model assistance crosses a trust boundary. Review should be scoped to the output or decision that needs it.

### Model Assistance Is Optional

A model may propose interpretations, organization, or wording within supplied evidence boundaries. Model output remains untrusted until reviewed and never approves itself.

### Minimal Persistent Artifacts

Persist only artifacts that have a concrete downstream consumer or must preserve provenance, lifecycle, or review state across runs. Intermediate calculations should remain internal when deterministic regeneration is sufficient.

### Every Artifact Has A Consumer

A proposed persistent artifact must identify who consumes it, which later capability depends on it, and why an in-memory result is insufficient.

### Rendering Never Changes Meaning

Rendering may change layout, typography, structure, and supported presentation. It must not change approved claims, metrics, scope, or factual meaning.

### Ordered Capability Boundaries

The pipeline order is a proof boundary:

```text
Evidence precedes evaluation.
Evaluation precedes planning.
Planning precedes drafting.
Drafting precedes rendering.
Rendering precedes export.
```

Later stages may select or present approved upstream meaning. They may not repair missing evidence by inventing content.

## 3. Canonical Capability Pipeline

```text
Target Modeling
      |
      v
Expectation Modeling
      |
      v
Evidence Mapping
      |
      v
Coverage Analysis
      |
      v
Assessment
      |
      v
Planning
      |
      v
Draft Construction
      |
      v
Rendering
      |
      v
Export
```

### Target Modeling

**Purpose:** Capture the user's intended role positioning or a specific external opportunity as a versioned target.

**Inputs:**

- explicit user-supplied role metadata; or
- an imported Job Description and its source metadata.

**Outputs:**

- a normalized Role Target or Job Target;
- immutable source provenance for imported opportunity material;
- target lifecycle and integrity metadata.

**Must not:**

- treat a target title as employment history or proof of seniority;
- treat a Job Description as candidate evidence;
- evaluate the candidate;
- generate requirements through unsupported inference;
- generate career content.

### Expectation Modeling

**Purpose:** Describe what the target expects without considering the candidate.

**Inputs:**

- a current target;
- explicit role-profile material for reusable role positioning, when supplied;
- deterministic structure and source text from a Job Description.

**Outputs:**

- role expectations or job requirements;
- normalized categories and necessity where supported;
- ambiguities, warnings, and exact source provenance;
- optional reviewed interpretation when deterministic structure is insufficient.

**Must not:**

- load or evaluate candidate evidence;
- claim the candidate meets an expectation;
- calculate fit, coverage, or competitiveness;
- convert vague source language into a hard requirement without support;
- generate resume or application content.

### Evidence Mapping

**Purpose:** Link each modeled expectation to eligible reviewed candidate evidence.

**Inputs:**

- a usable expectation or requirement model;
- one explicitly pinned immutable Evidence Snapshot;
- snapshot evidence already eligible under approved review, public-safety, and resume-readiness rules;
- reviewed evidence-quality metadata.

**Outputs:**

- stable expectation-to-evidence relationships;
- relationship type and evidence quality;
- exact requirement, claim, evidence, and source provenance;
- an explicit `unsupported` state when no eligible evidence exists.

**Must not:**

- infer unreviewed experience, skills, outcomes, or seniority;
- use drafts, proposals, rejected claims, resumes, or exports as evidence;
- calculate aggregate fit, coverage percentages, hiring likelihood, or ATS scores;
- recommend whether to apply;
- rewrite evidence or claims.

### Coverage Analysis

**Purpose:** Determine the support state of every modeled expectation from the evidence map.

**Inputs:**

- a current complete evidence map;
- requirement necessity and relationship metadata;
- approved contradiction or limitation metadata when present.

**Outputs:**

- per-expectation support states;
- supported, partial, unsupported, conflicting, or not-assessed boundaries as allowed by policy;
- completeness and blocking information for downstream assessment.

**Must not:**

- invent missing links;
- interpret unsupported evidence as support;
- recommend an application;
- calculate hiring probability or resume strategy;
- modify the evidence map.

### Assessment

**Purpose:** Interpret coverage and proof quality into a bounded evaluation of strengths, weaknesses, risks, gaps, and evidence defensibility.

**Inputs:**

- current coverage results;
- approved evidence-map provenance;
- target expectation importance or necessity where explicitly modeled;
- assessment policy.

**Outputs:**

- expectation-level assessment records;
- proof sufficiency, defensibility, risk, and gap findings;
- a bounded summary suitable for planning when complete.

**Must not:**

- rewrite or strengthen evidence;
- invent outcomes, metrics, authority, scale, or experience;
- generate resume sections, bullets, or application materials;
- present hiring likelihood as fact;
- silently convert incomplete assessment into readiness.

### Planning

**Purpose:** Decide what approved material should be selected, emphasized, ordered, compressed, or omitted for a target output.

**Inputs:**

- a current approved assessment;
- approved claims and evidence permissions;
- target-specific output policy;
- document constraints.

**Outputs:**

- a content plan;
- section and evidence selection;
- ordering, emphasis, omission, and metric permissions;
- explicit unresolved or blocked content.

**Must not:**

- invent claims, metrics, dates, employers, projects, skills, or outcomes;
- write final headlines, summaries, or bullets;
- use target language as candidate history;
- bypass assessment or evidence restrictions;
- render or export a document.

### Draft Construction

**Purpose:** Convert an approved content plan into structured candidate wording while preserving its evidence and permission boundaries.

**Inputs:**

- a current approved plan;
- approved public wording and claims;
- statement-level provenance;
- permitted identity metadata.

**Outputs:**

- a structured draft;
- candidate statements linked to approved plan items and evidence;
- review decisions and an approved draft when required.

**Must not:**

- introduce facts outside approved inputs;
- invent or upgrade metrics;
- broaden responsibility into achievement;
- change target or assessment decisions;
- make layout-specific compromises that change meaning.

### Rendering

**Purpose:** Compose an approved structured draft into a canonical human-readable document.

**Inputs:**

- a current approved draft;
- a versioned render profile;
- supported formatting and composition rules.

**Outputs:**

- canonical visible content;
- document structure and source mapping;
- format-independent validation results.

**Must not:**

- add, remove, paraphrase, or strengthen approved meaning;
- insert unsupported links, contact details, claims, or metrics;
- hide required content to satisfy a page count;
- calculate fit, ATS, or hiring scores;
- make a model call.

### Export

**Purpose:** Package rendered content into supported delivery formats with verifiable integrity.

**Inputs:**

- a current validated rendered artifact;
- an export format and versioned adapter;
- output-path and packaging options.

**Outputs:**

- Markdown, HTML, DOCX, PDF, or other supported format artifacts;
- export manifests, hashes, validation results, and lifecycle state.

**Must not:**

- alter approved wording or document meaning;
- regenerate upstream content;
- repair stale or invalid dependencies silently;
- expose private provenance or internal identifiers;
- imply successful conversion when the required local adapter failed.

## 4. Role Pipeline

The Role pipeline creates reusable market-positioning outputs for a role rather than one vacancy.

```text
Role Target
    |
    v
Role Expectations
    |
    v
Pinned Evidence Snapshot
    |
    v
Reviewed Evidence Mapping
    |
    v
Coverage
    |
    v
Role Assessment
    |
    v
Resume Content Plan
    |
    v
Structured Resume Draft
    |
    v
Canonical Rendering
    |
    v
Format Export
```

The implemented Role workflow covers the canonical pipeline through export:

- Target Modeling and deterministic structural analysis;
- explicit and reviewed expectation modeling;
- reviewed evidence mapping with expectation coverage;
- fit and proof assessment;
- resume content planning;
- constrained structured drafting and approval;
- deterministic rendering;
- Markdown, HTML, DOCX, and adapter-based PDF export.

The title-only guided Role journey is a product adapter over this pipeline. It persists one versioned generated role-understanding artifact because reuse, provider replay provenance, lifecycle, and the never-ask-twice behavior consume it. Conservative evidence links, qualitative positioning, and a prose-free section outline remain derived projections until the corresponding canonical approved artifacts exist. Generated role knowledge is never represented as candidate history or human-approved interpretation, and it cannot bypass final draft review.

The shared Evidence Snapshot reader and target pin contract accept Role targets. The existing Role Evidence Matching implementation still uses its legacy target-local evidence snapshot adapter; full migration to the global pinned snapshot remains a bounded compatibility follow-up rather than a broad Role refactor.

Some current capabilities combine adjacent canonical concerns in one implementation boundary. For example, expectation coverage may be emitted with evidence matching. The canonical stages remain distinct responsibilities even when a current implementation stores them together.

## 5. Job Pipeline

The Job pipeline creates opportunity-specific understanding and, later, application outputs from one preserved Job Description.

```text
Job Target + Job Description
            |
            v
    Requirement Model
            |
            v
 Pinned Evidence Snapshot
            |
            v
       Evidence Map
            |
            v
         Coverage
            |
            v
      Fit Assessment
            |
            v
         Planning
            |
            v
           Draft
            |
            v
        Rendering
            |
            v
          Export
```

The implemented Job workflow includes:

- deterministic Job Target intake and exact Job Description preservation;
- deterministic structural analysis that preserves exact source provenance while normalizing explicit plain-text section scope and wrapped source blocks;
- deterministic requirement modeling with optional proposal, review, and approval escalation;
- deterministic mapping from usable requirements to eligible reviewed evidence in the target's explicit immutable snapshot pin;
- deterministic per-requirement coverage analysis from the current evidence map;
- deterministic qualitative fit and proof assessment from current coverage and stored provenance;
- deterministic job-specific resume content planning from the current assessment and reviewed mapped evidence.
- constrained job-specific structured draft construction through a prose-free scaffold, explicit model proposal, strict validation, human review, and deterministic approval.
- deterministic canonical rendering and faithful Markdown, HTML, DOCX, and adapter-based PDF export from the approved structured Job draft.

Role and Job pipelines share format-neutral presentation, profiles, format renderers, binary adapters, fidelity validation, and path-safety controls while retaining separate target types, rendering policies, provenance contracts, persistence roots, identities, and lifecycle state. Existing Role artifacts are never treated as job-specific outputs, and Job Description language never alters reusable Role artifacts.

## 6. Shared Components

Role and Job pipelines should share capabilities when their proof contracts are equivalent.

### Evidence Store

The source registry, normalized evidence items, and immutable claims provide the common factual foundation. Reusable human decisions are separate `evidence-claim-review` version-1 artifacts under `evidence-claim-review-policy` version `1`; they determine factual support, safe scope, public safety, resume readiness, and Role/Job eligibility without mutating source evidence. The `evidence-snapshot` schema version `1` is the read-only consumption boundary. Current policy/exporter version `2` projects only effective reviews while preserving stable source IDs and hashes, approved projection identities, review hashes, exact eligibility state, safe provenance, verified metrics, completeness, and warnings without exporting private reviewer rationale or unnecessary source content. Target documents are kept outside candidate evidence.

Snapshots are currently produced from the in-repository Evidence Foundation. This contract permits a future repository boundary, but no repository split, remote snapshot service, or network fetching is implemented. Consumers pin snapshots explicitly and never select the newest snapshot automatically.

### Reviewed Claims

Approval, qualifiers, public safety, output readiness, Role/Job eligibility, metric status, wording permissions, and project/employment and responsibility/achievement boundaries are shared eligibility controls. Review batches are human-work organizers only and never become approval authority.

Evidence Review Workspace Rendering provides deterministic, human-readable Markdown for a batch's immutable JSON templates. Each claim workspace is self-contained and an index preserves stable batch ordering. The Markdown and its manifests are derived presentation artifacts: they are never parsed, never become review input, and never change source evidence, review decisions, snapshots, or eligibility. Editing rendered Markdown only invalidates that rendering.

The Local Evidence Review UI is a thin, loopback-only Astro adapter over these same domain services. Its review deep-link mode locks one validated batch into the server process, while normal Product Shell mode may open an existing batch without applying that lock to unrelated workflows. Review forms use action-, batch-, and claim-scoped HMAC tokens and submit decisions only through the canonical Evidence Claim Review service. A transient deterministic recommendation layer classifies claims into one-click confirmation, one-question confirmation, or manual review. It derives no authority of its own: a human click is still required, recommendation form data is recomputed server-side, and the result must pass the existing intent projection, canonical schema, and immutable review service. Career-duration and date wording are distinguished from true business/performance metrics; privacy, scope, wording correction, metric verification, multiple ambiguities, and supersession remain manual boundaries. Change Decision and Advanced Review preserve conservative override and full-schema paths. Read-only mode exposes no submission form and performs no writes. Completion reports the explicit guided-workflow command but never upgrades a snapshot, changes a target pin, or continues the pipeline automatically.

### Provenance

Stable IDs, source references, hashes, manifests, and statement-level lineage connect every downstream result to reviewed upstream facts.

### Lifecycle

Persistent artifacts use explicit `missing`, `current`, `stale`, and `invalid` states. Evidence Snapshot compatibility adds `incompatible` for unsupported future schemas or policies. Dependency changes must be visible and stale, invalid, or incompatible artifacts must not be silently replaced.

### Guided Orchestration

The normal Job workflow is a thin, non-persistent orchestration layer over the canonical capability services. It reconstructs the earliest actionable stage from existing lifecycle states, runs only missing deterministic or already-authorized work, and stops at snapshot choices, evidence review, model proposal review, stale or invalid dependencies, and other trust gates. It never stores a second pipeline state, shells out to the CLI, duplicates policy logic, auto-upgrades snapshots, auto-completes reviews, or auto-approves model output. The granular commands remain the expert and debugging interface.

### Validation

Schema, identity, hash, dependency, privacy, completeness, and semantic-boundary validation are common safeguards.

### Policy

Versioned policies define eligibility, deterministic behavior, review boundaries, metric permissions, and prohibited output.

### Rendering

Role and Job pipelines share rendering capabilities where both consume equivalent approved structured-draft contracts, while preserving target-specific policies and provenance.

### Export

Format adapters, hash verification, source-map validation, and export lifecycle should remain target-agnostic when approved input contracts match.

### Product Surface

The local Astro product shell projects canonical Evidence Foundation, Career Profile, target, review, lifecycle, and output state into the Career Twin experience. It orchestrates existing capabilities directly through domain adapters, translates pipeline state into human progress, and exposes only the smallest safe next action.

The projection is not a canonical artifact and has no independent trust authority. It does not duplicate career facts, parse Markdown, shell out to the CLI, auto-approve model output, or turn targets and outputs into evidence. Advanced Review remains available as an explicit trust-boundary escalation.

The local server resolves every writable route through one explicit action-scope registry. Shared guards validate loopback binding, exact Host authority, forwarded-header absence, origin or tightly constrained null-origin browser navigation, and read-only state. Evidence Review actions then require review-scoped batch/claim HMAC authorization; Product Shell actions require distinct route/action HMAC authorization and target binding when applicable. Unknown writable routes are rejected and no scope falls back to Evidence Review implicitly.

## 7. Architectural Boundaries

These boundaries are permanent capability contracts:

- Target Modeling never presents a target as candidate proof.
- Snapshot export never changes evidence review, approval, eligibility, public safety, resume readiness, or metric verification.
- Target pinning never auto-selects or auto-upgrades evidence.
- Requirement Modeling never evaluates candidates.
- Role Expectation Modeling never invents market expectations from a title alone.
- Evidence Mapping never calculates fit.
- Evidence Mapping never treats absence as contradiction.
- Coverage Analysis never recommends applications.
- Assessment never rewrites evidence or claims.
- Assessment never creates application content.
- Planning never invents claims or metrics.
- Planning never writes finished resume prose.
- Draft Construction never exceeds approved plan and evidence permissions.
- Rendering never changes approved content or meaning.
- Export never regenerates or edits upstream content.
- Model proposals never approve themselves.
- Approval makes no model call.
- Job inputs never silently mutate reusable Role artifacts.

## 8. Artifact Philosophy

Persistence is a design decision, not the default.

A persistent artifact is justified only when there is a concrete downstream consumer and at least one of the following is true:

- provenance must survive beyond one process;
- review or approval state must be preserved;
- lifecycle and dependency integrity must be independently inspectable;
- deterministic regeneration alone is insufficient for auditability or reproducibility.

Before adding an artifact, the architecture must answer:

1. Who consumes it?
2. Which later capability depends on it?
3. Why can the information not remain internal?

If those questions do not have a concrete answer, keep the information internal.

Proposal, review, and approval workflows are escalation paths around ambiguity, public wording, or model assistance. They are not mandatory stages in the canonical pipeline. Deterministic artifacts should remain directly usable when their trust and completeness contracts permit it.

## 9. Future Extension Points

The capability pipeline may support additional reviewed career outputs without changing the evidence foundation:

- Promotion Package
- Executive Bio
- Portfolio
- Consulting Profile
- Freelance Proposal
- Board Biography

Each extension must define its target, assessment, planning, drafting, review, rendering, and export boundaries before implementation.

## 10. Status

Status through Slice 2.7G:

| Capability | Role Pipeline | Job Pipeline |
| --- | --- | --- |
| Evidence Review and Eligibility | Completed through human-controlled claim review, read-only workspace rendering, the local review UI, and Snapshot policy v2 | Completed through human-controlled claim review, read-only workspace rendering, the local review UI, and Snapshot policy v2 |
| Target Modeling | Completed | Completed |
| Expectation Modeling | Completed | Completed as Job Requirement Modeling |
| Evidence Mapping | Completed | Completed through Slice 2.7B |
| Coverage Analysis | Completed within reviewed Role matching | Completed through Slice 2.7C |
| Assessment | Completed through Slice 2.5 | Completed through Slice 2.7D |
| Planning | Completed through Slice 2.6A | Completed through Slice 2.7E |
| Draft Construction | Completed through Slice 2.6B | Completed through Slice 2.7F |
| Rendering | Completed through Slice 2.6C | Completed through Slice 2.7G |
| Export | Completed through Slice 2.6C | Completed through Slice 2.7G |
| Guided Orchestration | Granular expert workflow remains available | Completed as a derived, trust-preserving normal workflow |
| Product Surface | Career Twin Role journey projects current value and safe gates | Career Twin Job journey projects guided fit, tailoring, review, and export state |

The canonical Job resume pipeline is complete through deterministic rendering and export. Normal Job usage is available through a guided lifecycle-aware orchestrator, while all granular capability commands remain available for expert use.

The first Career Twin product shell is implemented in the existing Astro application. Home, My Career, Updates, Role Resume, Job Tailoring, Clarifications, and Advanced Review remain thin projections over the same canonical trust engine.

The Evidence Snapshot Contract v1 is implemented as a shared Evidence Foundation boundary. Job Evidence Mapping consumes the explicit target pin. Role targets can pin and read the same contract, while the existing Role matcher remains on its documented legacy adapter pending a focused migration.
