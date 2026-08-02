# ProofLayer

ProofLayer is a local-first career evidence system.

This repository contains MVP Slice 1: **Career Vault Builder v1**.

Implementation agents and contributors should begin with [`AGENTS.md`](AGENTS.md), which links the reusable engineering, proof, testing, and Git policies under `docs/agent/`.

Slice 1.1 hardens deterministic parsing for structured Markdown resumes so headings, dates, and fragments do not pollute the career profile.

Slice 1.2 separates successful extraction from factual trust and public-output approval.

Slice 1.3 adds a living knowledge refresh loop and privacy-safe update impact reporting.

Slice 1.4 generates deterministic role-specific draft resume and website-copy packages from non-blocked evidence.

Slice 1.5 adds output-specific review and final/public candidate generation for the TPM variant.

Slice 1.6 adds manually approved public profile metadata and final wording overrides without changing source evidence or draft outputs.

Slice 1.6.1 hardens atomic KB persistence, context-aware claim identity, and documentation of the global-trust/output-review boundary.

Slice 1.7 extends the proven output-specific review and final/public boundary to the AI Product variant while preserving TPM behavior.

Slice 1.7.1 improves AI Product final content selection so reviewed evaluation, traceability, validation, and evidence-support claims are surfaced before generic platform wording.

Slice 1.7.2 polishes the reviewed AI Product final package with project role/timeline and maturity labels, a compact product/platform career foundation, and less repetitive recruiter-facing copy.

Slice 1.8 exports immutable reviewed AI Product and TPM final Markdown to hash-tracked DOCX and PDF artifacts.

Slice 1.8.1 packages an exact Markdown copy alongside each reviewed DOCX/PDF export.

Phase 2 Slice 2.1 introduces deterministic role and job targets without extracting requirements, calculating fit, or generating resumes.

Phase 2 Slice 2.2 adds separately versioned, deterministic target-structure analysis with exact Markdown provenance and no semantic inference.

Phase 2 Slice 2.3A adds a separately versioned semantic interpretation contract for explicit role profiles and structurally supported job expectations.

Phase 2 Slice 2.4 links current approved target expectations to reviewed active candidate evidence without calculating overall fit or generating application content.

Phase 2 Slice 2.5 interprets approved evidence matching into expectation-level fit and proof assessments, with optional model proposals and an explicit human approval boundary.

Phase 2 Slice 2.7A builds deterministic, reviewable Job Requirement Models from current Job Targets and their preserved Job Descriptions without consuming candidate evidence or producing fit or application content.

Phase 2 Slice 2.7B maps usable Job Requirements to approved, resume-ready, public-safe candidate evidence using explicit deterministic signals without calculating fit or generating application content.

Phase 2 Slice 2.7F converts a current usable Job Resume Content Plan into a constrained structured draft through a prose-free scaffold, explicit model proposal, strict validation, human review, and deterministic approval.

Phase 2 Slice 2.7G renders a current approved Job Resume Draft through one canonical document into faithful Markdown, HTML, DOCX, and adapter-based PDF exports.

Human-controlled Evidence Foundation claim reviews now provide the reusable eligibility boundary projected into immutable Evidence Snapshot Contract v1 exports.

## Product Experience

ProofLayer's Astro application is the primary local human interface. It projects the existing Evidence Foundation and Career Profile as a persistent **Career Twin**, then organizes normal use around creating a resume for a Role or tailoring one to a Job. It does not create a second source of career truth.

```bash
npm run ui:start
npm run ui:start -- --open
prooflayer ui start --host 127.0.0.1 --port 4321 --open
```

The product shell provides Home, My Career, Create Resume, Tailor to a Job, Updates, Clarifications, and Advanced Review views. One local source is enough to begin; LinkedIn and GitHub are optional. Granular CLI commands remain available for automation, audit, and debugging.

The Role Resume journey starts from one title. ProofLayer creates or reuses the Role Target, generates a visibly unapproved role understanding, checks current reviewed Career Twin evidence conservatively, and shows positioning, strengths, gaps, progress, and the smallest next action. The user confirms that direction before deterministic evidence selection and preparation continue; a writing provider is used only for explicit draft proposal generation. Actual wording is reviewed at `/resume/role/review`, deterministically approved without a model call, and made available at `/resume/role/download`. Common titles use the offline built-in taxonomy when no provider is selected. One optional specialization may refine the direction; users are never asked to author a Role Expectations schema or upload their career sources again. If wording cannot be prepared safely, the product shows the exact missing approval or writing-provider action instead of presenting a fake draft.

```bash
prooflayer role create --title "CTO"
prooflayer role run role-cto --offline
prooflayer role status role-cto
prooflayer role continue role-cto --offline --specialization startup-product-cto --rebuild-stale
prooflayer role finalize role-cto --formats markdown,html,docx
```

Use `--provider <configured-provider>` for an explicit untrusted role-understanding proposal. Fake providers require `--offline`; normal product mode never silently selects one. `--dry-run` inspects without writes or model calls. Existing granular `target` Role commands remain available for expert review, approval, lifecycle repair, drafting, and rendering.

The normal Product Shell is not locked to an Evidence Review Batch. All writes share the same loopback-only server, exact Host and origin checks, constrained browser null-origin handling, read-only mode, and per-session HMAC foundation. Product workflow forms receive route-and-action-scoped tokens, with a target binding when required; Evidence Review forms receive separate batch-and-claim-scoped tokens. Tokens cannot authorize actions across those scopes.

See the [ProofLayer Product Vision and Principles](docs/product/PRODUCT_VISION_AND_PRINCIPLES.md).

## What Slice 1 Does

ProofLayer turns a messy local folder of career files into a structured career knowledge base:

```text
Sources -> Evidence Items -> Claims -> Career Profile -> Reports
```

It creates:

- `workspace/kb/sources.json`
- `workspace/kb/evidence-items.json`
- `workspace/kb/claims.json`
- `workspace/kb/career-profile.json`
- `workspace/outputs/reports/career-profile.md`
- `workspace/outputs/reports/privacy-report.md`
- `workspace/outputs/reports/normalization-quality-report.md`
- `workspace/outputs/reports/trust-model-report.md`
- `workspace/kb/update-baseline.json`
- `workspace/outputs/reports/update-impact-report.md`
- `workspace/outputs/changelogs/latest-refresh.json`
- `workspace/outputs/changelogs/rebuild-changelog.md`
- `workspace/outputs/output-manifest.json`
- `workspace/outputs/variants/{role-key}/`
- `workspace/targets/roles/{target-id}/target.json`
- `workspace/targets/jobs/{target-id}/target.json`
- `workspace/targets/jobs/{target-id}/job-description.md`
- `workspace/targets/{roles|jobs}/{target-id}/matching/`
- `workspace/targets/{roles|jobs}/{target-id}/assessment/`
- `workspace/targets/jobs/{target-id}/requirements/`
- `workspace/evidence-snapshots/{snapshot-id}/`
- `workspace/targets/{roles|jobs}/{target-id}/evidence/`

## What It Does Not Do Yet

ProofLayer does not yet include:

- Numeric fit, hiring-probability, or candidate-ranking scores
- Final website publishing
- OAuth connectors
- SaaS/cloud sync
- Database storage
- Automatic application packages

## Setup

```bash
npm install
npm run build
```

## Commands

```bash
npm run init
npm run ingest
npm run normalize
npm run claims
npm run profile
npm run audit
npm run refresh
npm run changes
npm run status
npm run generate:role -- --role tpm
npm run generate:roles
npm run variants
npm run review:variant -- --role tpm
npm run review:status -- --role tpm
npm run finalize:variant -- --role tpm
npm run review:variant -- --role ai-product
npm run review:status -- --role ai-product
npm run finalize:variant -- --role ai-product
npm run public-profile:init
npm run public-profile:show
npm run rebuild
npm test
```

You can also run the CLI directly during development:

```bash
npm run dev -- init
npm run dev -- refresh
npm run dev -- target create-role --title "Engineering Manager" --seniority senior --domain platform
npm run dev -- target create-job --file workspace/jobs/exampleco-engineering-manager.md
npm run dev -- target list
npm run dev -- target show role-engineering-manager
npm run dev -- target analyze role-engineering-manager
npm run dev -- target analysis-show role-engineering-manager
npm run dev -- target analysis-status role-engineering-manager
npm run dev -- target interpret role-engineering-manager --role-profile workspace/role-profiles/engineering-manager.json
npm run dev -- target interpretation-show role-engineering-manager
npm run dev -- target interpretation-status role-engineering-manager
npm run dev -- target job-requirements build job-exampleco-engineering-manager
npm run dev -- target job-requirements show job-exampleco-engineering-manager
npm run dev -- target job-requirements status job-exampleco-engineering-manager
```

## Folder Structure

```text
workspace/
  sources/
    cvs/
    linkedin/
    github/
    project-notes/
    recommendations/
    certificates/
    markdown/
    pdf/
    docx/
    jobs/
  kb/
    extracted-text/
    sources.json
    evidence-items.json
    claims.json
    career-profile.json
    update-baseline.json
  outputs/
    reports/
    changelogs/
    variants/
      tpm/
      ai-product/
      fullstack/
      fractional-cto/
    output-manifest.json
  targets/
    roles/
      role-engineering-manager/
        target.json
        analysis/
          target-analysis.json
          analysis-manifest.json
        interpretation/
          target-interpretation.json
          interpretation-manifest.json
        requirements/
          deterministic/
          proposals/
          reviews/
          approved/
    jobs/
      job-exampleco-engineering-manager/
        target.json
        job-description.md
        analysis/
          target-analysis.json
          analysis-manifest.json
        interpretation/
          target-interpretation.json
          interpretation-manifest.json
  role-profiles/
    engineering-manager.json
  config/
    prooflayer.config.json
    public-profile.json
  logs/
examples/
  sample-career-note.md
```

Sample content stays under `examples/` and is not ingested automatically. Copy it into a source folder only when you intentionally want to test with it.

## Example Workflow

```bash
npm run init
mkdir -p workspace/sources/markdown
cp ./my-career-note.md workspace/sources/markdown/
npm run refresh
npm run changes
npm run status
```

Then inspect:

- `workspace/outputs/reports/career-profile.md`
- `workspace/outputs/reports/privacy-report.md`
- `workspace/outputs/reports/trust-model-report.md`
- `workspace/outputs/reports/update-impact-report.md`
- `workspace/outputs/changelogs/latest-refresh.json`
- `workspace/outputs/changelogs/rebuild-changelog.md`

## Normal Job Workflow

The guided Job workflow runs the completed opportunity pipeline from its current lifecycle state while preserving every trust boundary:

```bash
npm run dev -- job create --file workspace/jobs/exampleco-engineering-manager.md
npm run dev -- job run job-exampleco-engineering-manager
npm run dev -- job status job-exampleco-engineering-manager
npm run dev -- job continue job-exampleco-engineering-manager
npm run dev -- job finalize job-exampleco-engineering-manager
```

`job run` builds missing deterministic stages and stops at the first human, snapshot, provider, stale-artifact, or trust gate. It never chooses or replaces an Evidence Snapshot automatically; use `--snapshot <snapshot-id>` for an unpinned target or `job continue --upgrade-snapshot <snapshot-id>` for an explicit replacement. It may prepare a review batch and human-readable workspace, but it never submits evidence decisions, completes a draft review, or approves model output.

Use `--dry-run` with `job run`, `job continue`, or `job finalize` to inspect intended actions with no writes or model calls. Stale or invalid deterministic artifacts remain blocked unless `--rebuild-stale` is explicit. A draft proposal uses the configured provider only after planning is usable; a configured fake provider additionally requires `--offline`. Finalization requires a current human-reviewed approved draft and exports Markdown, HTML, and DOCX by default; PDF is opt-in.

Common pauses include Evidence Snapshot selection, Evidence Review, an unusable content plan, missing model-provider configuration, incomplete Draft Review, and stale or invalid dependencies. `job status <target-id>` explains the current stage, blocker, human action, and exact next command; add `--verbose` for lifecycle details or `--json` for stable machine output.

The existing granular `target`, `evidence`, proposal, review, approval, rendering, and export commands remain the expert and debugging interface. Guided orchestration calls those same domain services and does not persist a parallel workflow state or change canonical artifact meaning.

## Privacy Defaults

- Unknown source visibility defaults to `unknown`.
- LinkedIn export files default to `private` unless they look like clearly professional profile files.
- GitHub summaries default to `public` only when stored under `sources/github` and no private marker is present.
- Recommendations default to `generic_only`.
- Certificates default to `public`.
- Raw PDFs and DOCX files default to `unknown`.

ProofLayer flags risky evidence but does not delete or mutate source files.

## Phase 2 Slice 2.1 Target Modeling

Targets describe an opportunity independently from career evidence and existing resume variants:

- A **role target** captures a reusable direction such as Engineering Manager, optionally qualified by seniority, domain, location, and working model.
- A **job target** captures one specific Markdown vacancy with exact source bytes, SHA-256 provenance, normalized metadata, and the complete raw description.

Create and inspect targets with the local CLI:

```bash
npm run dev -- target create-role \
  --title "Engineering Manager" \
  --seniority senior \
  --domain platform \
  --location "Remote Europe" \
  --working-model remote

npm run dev -- target create-job \
  --file workspace/jobs/exampleco-engineering-manager.md \
  --title "Engineering Manager" \
  --company ExampleCo \
  --location "Berlin, Germany" \
  --working-model hybrid

npm run dev -- target list
npm run dev -- target show role-engineering-manager
```

Role IDs use `role-<normalized-title>`. Job IDs use `job-<normalized-company>-<normalized-title>` when a company is available. Creation never overwrites an existing target unless `--replace` is supplied explicitly; replacement preserves `createdAt` and updates `updatedAt`.

Job Markdown may provide deterministic metadata through existing `gray-matter` front matter:

```markdown
---
title: Engineering Manager
company: ExampleCo
location: Berlin, Germany
workingModel: Hybrid
---
```

Explicit CLI metadata takes precedence over conflicting front matter. No title is inferred from prose. The imported source path and exact-byte SHA-256 are stored in `target.json`, while `job-description.md` is written atomically as a byte-for-byte copy. Job descriptions are targeting inputs, not trusted career evidence, and target operations do not mutate `sources/`, `kb/`, reviewed variants, or exports.

Target creation does **not** extract requirements, calculate job fit or confidence, select a resume variant, generate a resume, or create an application package. Those capabilities remain future slices.

## Phase 2 Slice 2.2 Target Analysis

Target input and derived analysis are intentionally separate. `target.json` and the exact persisted job description remain user-controlled inputs; `analysis/target-analysis.json` and `analysis/analysis-manifest.json` are reproducible derived artifacts. Analysis never mutates target input, reviewed career evidence, resume variants, or exports.

Analyze and inspect either first-class target type:

```bash
npm run dev -- target analyze role-engineering-manager
npm run dev -- target analyze job-exampleco-engineering-manager
npm run dev -- target analysis-show job-exampleco-engineering-manager
npm run dev -- target analysis-status job-exampleco-engineering-manager
```

Role targets remain valid first-class targets, but a title alone is not treated as a deterministic requirement source. Their Slice 2.2 analysis therefore contains no sections or items and records `ROLE_SEMANTIC_INTERPRETATION_NOT_AVAILABLE`; semantic role expectations belong to a later slice.

For job targets, the `target-structure` analyzer version `2` recognizes:

- Optional scalar front matter fields already supported by target intake
- ATX headings at levels 1-3
- A small explicit set of unmarked plain-text section labels, including `About the job`, `What You'll Own`, `How We Work`, `Requirements`, `What you must have`, `Nice to have`, and `Benefits`
- Unordered list items beginning with `-`, `*`, or `+`, including wrapped continuation lines
- Ordered list items such as `1.` and `2.`, including wrapped continuation lines
- Contiguous wrapped plain-text paragraphs

The analyzer uses a small case-insensitive heading map. Responsibilities, Key Responsibilities, Role Responsibilities, What You Will Do, and What You'll Own map to `responsibilities`. Requirements, Required Qualifications, Minimum Qualifications, Must Have, and What You Must Have map to `required`. Preferred Qualifications, Nice to Have, Bonus, and Preferred map to `preferred`. A small set of explicit headings also maps to qualifications, role context, company context, benefits, or other. Subsections retain their parent-section identity so explicit mandatory and preferred scope can propagate without prose inference. Unmapped headings remain `unknown`; prose keywords never change classification or necessity.

Every extracted section and semantic item points to the immutable persisted `job-description.md`. Wrapped bullets and paragraphs remain one normalized item while retaining the exact multiline source text and range. Line numbers are **1-based and inclusive**. Byte offsets use a half-open range, `[startOffset, endOffset)`, and include the source line ending when present. `excerptSha256` hashes those exact referenced bytes; the full source SHA-256 is also retained. Front matter fields are metadata items with unknown necessity, never job requirements.

Analysis status is one of:

- `missing`: neither analysis nor manifest exists.
- `current`: target hash, source hash, analyzer version, analysis hash, and manifest all agree.
- `stale`: a valid input or analyzer version changed.
- `invalid`: stored analysis and manifest are incomplete, malformed, corrupted, or disagree.

An unchanged analysis is not rewritten and keeps both timestamps. A valid stale analysis is rebuilt on `target analyze`, preserving its original `createdAt` while updating `updatedAt`. Corrupt or mismatched stored analysis is never overwritten silently; inspect it and use `--rebuild` explicitly when replacement is intended. `target analysis-status` is read-only and never regenerates artifacts.

This minimal parser does not implement full CommonMark. Setext headings, arbitrary unmarked headings, nested-list semantics, tables, fenced-code semantics, and broad inline requirement interpretation are not modeled. Job descriptions remain external opportunity inputs, not trusted candidate evidence.

Target analysis in Slice 2.2 does not yet perform semantic requirement interpretation, evidence matching, fit scoring, confidence scoring, or resume generation.

## Phase 2 Slice 2.3A Semantic Target Interpretation

The targeting pipeline now has explicit boundaries:

```text
Target Input
  -> Structural Target Analysis
  -> Semantic Target Interpretation
  -> Future Evidence Matching
  -> Future Fit Assessment
  -> Future Resume Construction
```

Semantic target interpretation describes what a target expects. It does not evaluate whether a candidate meets those expectations.

Role Positioning and Opportunity Application remain first-class workflows. A Role Target uses local curated target knowledge to define reusable market expectations. A Job Target uses the preserved vacancy and current structural analysis to describe one opportunity. Neither workflow loads candidate evidence in Slice 2.3A.

The deterministic interpreter is `target-semantics` version `1`, policy version `1`. Create and inspect interpretation artifacts with:

```bash
npm run dev -- target interpret role-engineering-manager \
  --role-profile workspace/role-profiles/engineering-manager.json
npm run dev -- target interpret job-exampleco-engineering-manager
npm run dev -- target interpretation-show job-exampleco-engineering-manager
npm run dev -- target interpretation-status job-exampleco-engineering-manager
```

### Role Profiles

Role Profiles live under `workspace/role-profiles/` as versioned JSON. They are local, explicit, reviewable target knowledge, not candidate evidence. A profile contains a slug-safe ID, title and aliases, optional targeting context, and explicit expectations with kind, necessity, importance, normalized capability tags, group, and notes.

```json
{
  "schemaVersion": 1,
  "id": "engineering-manager",
  "title": "Engineering Manager",
  "aliases": ["Software Engineering Manager"],
  "expectations": [
    {
      "id": "delivery-leadership",
      "kind": "leadership",
      "statement": "Guide engineering execution across product priorities.",
      "necessity": "required",
      "importance": "critical",
      "capabilityTags": ["delivery-leadership"],
      "group": "leadership-expectations",
      "notes": []
    }
  ],
  "createdAt": "2026-07-21T08:00:00.000Z",
  "updatedAt": "2026-07-21T08:00:00.000Z"
}
```

Profiles must be valid UTF-8 JSON, remain under `workspace/role-profiles/`, use unique slug-safe expectation IDs and capability tags, and contain nonblank statements. A profile is selected only through an explicit path or an exact normalized title/alias match; fuzzy matching is never used. A conflicting title is rejected. If no profile is supplied or found, ProofLayer creates a valid zero-expectation interpretation with `ROLE_PROFILE_MISSING`, `ROLE_PROFILE_NOT_CONFIGURED`, and `NO_EXPECTATIONS_PRODUCED` signals rather than inferring expectations from the role title.

Role-profile provenance retains the exact profile-file SHA-256, normalized workspace-relative path, expectation JSON pointer, and deterministic expectation-content hash. The profile itself is never copied into or modified by interpretation.

### Job Interpretation

Job interpretation consumes only a current structural analysis. One structural list item produces at most one semantic expectation, preserving its complete statement, analysis item ID, source path, source hash, line range, byte offsets, and excerpt hash.

- Explicit responsibilities become contextual `responsibility` expectations.
- Explicit required and preferred sections become `qualification` expectations with matching necessity.
- Generic qualifications become `qualification` expectations with unknown necessity.
- Job importance always remains `unknown`, and capability tags remain empty.
- Paragraphs are not interpreted automatically.
- Company, benefits, role-context, and other sections do not become candidate expectations.
- Unknown sections are skipped with stable warnings and ambiguities.
- Statements are not split, paraphrased, strengthened, deduplicated, or scanned for inline necessity keywords.

`interpretationConfidence` measures confidence in the semantic interpretation only. It never represents candidate fit, evidence confidence, proof readiness, hiring probability, or recommendation strength.

### Lifecycle And IDs

Interpretation is stored separately under each target's `interpretation/` directory. Its manifest records the exact target hash, structural-analysis hash, optional role-profile path/identity/hash, interpreter name/version/mode, policy version, interpretation hash, and timestamps.

Status is `missing`, `current`, `stale`, or `invalid`. Target, structural-analysis, role-profile, interpreter, or policy changes make interpretation stale. Missing pairs, malformed artifacts, manifest disagreement, or interpretation hash mismatch make it invalid. Status is read-only.

An unchanged rerun returns `already-current` without rewriting files or timestamps. Stale or invalid interpretation requires explicit `--rebuild`; rebuilding preserves `createdAt` and updates `updatedAt`. Expectation IDs derive from the target, source analysis item or explicit profile expectation ID, semantic kind, and policy version. Group, ambiguity, and warning IDs use the same stable dependency-based strategy and never depend on timestamps, random values, array indexes alone, or absolute machine paths.

Slice 2.3A does not use an LLM, perform market research, load candidate evidence, calculate fit or proof readiness, or generate a resume. It also does not produce strengths, weaknesses, application recommendations, cover letters, screening answers, or ATS scores.

## Slice 2.3B Model-Assisted Interpretation Proposals

Model-assisted interpretation is optional and sits behind the deterministic target pipeline:

```text
Target -> Structural analysis -> Deterministic interpretation
       -> Model proposal -> Validation -> Human review -> Approved interpretation
```

**Model-assisted output is a proposal, not approved target knowledge.** Existing deterministic target commands continue to work offline with no provider configuration. Model prompts contain target knowledge only; ProofLayer never loads candidate evidence, career claims, resumes, or application artifacts into this workflow.

### Provider Configuration

Slice 2.3B includes a provider-neutral interface and an OpenAI-compatible chat-completions adapter. Configure it only when generating a proposal:

```bash
export PROOFLAYER_MODEL_PROVIDER=openai-compatible
export PROOFLAYER_MODEL_NAME=your-model-name
export PROOFLAYER_MODEL_BASE_URL=http://127.0.0.1:1234/v1
export PROOFLAYER_MODEL_API_KEY=optional-local-or-remote-key
export PROOFLAYER_MODEL_TIMEOUT_MS=30000
```

`PROOFLAYER_MODEL_API_KEY` is used only in the request header. It is never written to proposals, manifests, raw responses, logs, or prompts. Artifacts record the normalized provider label, model name, generation settings, prompt identity, policy identity, and hashes, not secrets or the configured endpoint URL.

A `fake` file-backed provider is available for deterministic local testing and smoke verification:

```bash
export PROOFLAYER_MODEL_PROVIDER=fake
export PROOFLAYER_MODEL_NAME=fake-model
export PROOFLAYER_MODEL_RESPONSE_FILE=/path/to/strict-response.json
```

Production target knowledge should use a reviewed provider and response; the fake provider never bypasses schema, source, provenance, or forbidden-content validation.

### Proposal Lifecycle

Generate, inspect, cache, refresh, and replay proposals:

```bash
prooflayer target proposal generate <target-id>
prooflayer target proposal generate <target-id> --refresh
prooflayer target proposal list <target-id>
prooflayer target proposal show <proposal-id>
prooflayer target proposal status <proposal-id>
prooflayer target proposal replay <proposal-id>
```

The versioned prompt is `target-interpretation-proposal` version `1`, policy version `1`. It requires strict JSON, source IDs, exact source references, explicit uncertainty, and slug-safe capability tags. Candidate evaluation, fit, proof-readiness, strengths/weaknesses, resume language, hiring recommendations, unsupported IDs, invalid enums, and missing provenance fail validation.

Proposal artifacts are separate from deterministic interpretation:

```text
workspace/targets/{roles|jobs}/<target-id>/interpretation/
  proposals/<proposal-id>/
    proposal.json
    proposal-manifest.json
    raw-model-response.txt
```

The exact raw response is preserved and hashed separately. A request fingerprint includes the target, structural-analysis, deterministic-interpretation, optional Role Profile, normalized input, provider, model, generation settings, prompt template, prompt version, and policy version. An unchanged valid request returns a cache hit without a provider call or file rewrite. `--refresh` calls the provider and creates a new proposal identity. Replay performs no network call and re-runs parsing, normalization, schema validation, provenance validation, target-boundary validation, and forbidden-content validation against the exact stored raw response.

Provider timeout, authentication, rate-limit, unavailable-model, empty, truncated, malformed, schema-invalid, and transport failures return explicit errors or validation-failed artifacts as appropriate. Existing valid proposals and approved interpretations are not modified on provider failure.

### Human Review And Approval

Review is non-interactive and scriptable:

```bash
prooflayer target proposal review-init <proposal-id> --reviewer "Reviewer Name"
prooflayer target proposal review-show <proposal-id>
prooflayer target proposal review-status <proposal-id>
prooflayer target proposal review-set <proposal-id> <expectation-id> --accept
prooflayer target proposal review-set <proposal-id> <expectation-id> --reject
prooflayer target proposal review-set <proposal-id> <expectation-id> --edit-file reviewed-expectation.json
prooflayer target proposal review-complete <proposal-id>
```

Each proposal expectation starts pending and must receive exactly one `accept`, `edit`, or `reject` decision. Edits require a complete schema-valid edited expectation. Reviews and review manifests are stored under `interpretation/reviews/<proposal-id>/`; they never mutate the proposal or raw response.

After review completion, create and inspect a distinct approved artifact:

```bash
prooflayer target interpretation approve <proposal-id>
prooflayer target interpretation approved-show <target-id>
prooflayer target interpretation approved-status <target-id>
```

Approved output merges deterministic expectations with accepted and edited model proposals. Trust state remains explicit:

- `deterministic-approved`: came from deterministic interpretation.
- `proposed`: model output awaiting review.
- `human-approved`: accepted by a human without semantic edits.
- `human-edited`: approved using reviewed edited fields.
- `rejected`: retained in proposal/review history and excluded from approved interpretation.

Approved model items retain proposal, review decision, reviewer, provider, model, prompt/policy, source expectation IDs, source analysis item IDs, and exact source-reference provenance. Approval is deterministic and makes no provider call. Stale or invalid proposals, incomplete reviews, dependency changes, hash mismatches, malformed reviews, and forbidden content block approval. Approved artifacts are written separately under `interpretation/approved/`; deterministic interpretation remains unchanged.

### Completeness Boundary

Deterministic and approved interpretations expose `empty`, `partial`, or `complete` completeness plus `usableForEvidenceMatching` and explicit blocking reasons. This describes only whether target expectations are structurally eligible for a future matching stage. It is not candidate fit, evidence confidence, proof readiness, hiring probability, or an application recommendation.

Only `deterministic-approved`, `human-approved`, or `human-edited` expectations may become eligible for future evidence matching. Slice 2.3B does not load candidate evidence, perform evidence matching, assess fit, calculate proof readiness, create strengths or weaknesses reports, or generate resumes or application outputs.

## Evidence Foundation Claim Review and Eligibility

ProofLayer keeps immutable source claims separate from reusable human decisions. An `evidence-claim-review` schema-version-1 artifact records factual support, scope, public safety, resume readiness, Role Matching eligibility, Job Mapping eligibility, metric verification, project/employment boundaries, responsibility/achievement boundaries, qualifiers, risks, warnings, ambiguities, and private reviewer rationale under `evidence-claim-review-policy` version `1`.

No claim is approved merely because it exists, appears in a prior resume, or helps a target. An unreviewed claim remains ineligible. `approved` requires supported facts and exact scope. `approved-with-qualifier` requires narrower reviewer-authored wording and explicit qualifiers. A factually approved claim may remain deliberately not resume-ready, and Role Matching versus Job Mapping eligibility is projected separately. Private, restricted, sensitive, unsupported, contradicted, rejected, deferred, needs-edit, and insufficient-proof claims cannot become resume-ready or matching-eligible. Reviewer rationale stays in the review artifact and is never copied into snapshots or visible outputs.

Submit a complete non-interactive JSON decision:

```bash
npm run dev -- evidence claim-review create <claim-id> \
  --decision approved-with-qualifier \
  --input review-input.json
npm run dev -- evidence claim-review show <claim-id>
npm run dev -- evidence claim-review status <claim-id>
npm run dev -- evidence claim-review list
```

The documented synthetic shape is [`docs/examples/evidence-claim-review-input.example.json`](docs/examples/evidence-claim-review-input.example.json). The submitted `reviewedClaimSha256` must match the exact immutable claim text. A verified metric additionally requires exact approved wording, a numeric value, unit, scope, preserved qualifiers, and direct source-evidence support; ProofLayer never calculates, combines, rounds, or infers metrics.

Reviews are content-addressed versions:

```text
workspace/evidence-reviews/claims/<claim-id>/reviews/<review-id>/
  evidence-claim-review.json
  evidence-claim-review-manifest.json
```

An unchanged submission returns `already-current` without rewriting artifacts. A changed decision must explicitly name the effective review in `supersedesReviewId`; prior versions remain auditable. Lifecycle is `missing`, `current`, `stale`, `invalid`, or `superseded`. Claim, evidence, provenance, or policy changes make a review stale. Target changes do not, because review truth is reusable across targets.

Review batches organize work only:

```bash
npm run dev -- evidence review-batch build --target <job-target-id>
npm run dev -- evidence review-batch list
npm run dev -- evidence review-batch show <batch-id>
npm run dev -- evidence review-batch status <batch-id>
```

`evidence-review-batch-policy` version `1` uses only exact requirement terminology, named technology/domain metadata, requirement necessity, evidence categories, and potential-metric markers to assign `high`, `medium`, or `low` workflow priority. It does not establish support, approval, eligibility, fit, or target-specific truth. The controlled subset files are deliberately blank templates, not review decisions. Batches become stale when the requirement model, policy, claims, or evidence changes.

### Evidence Review Workspace Rendering

ProofLayer can render each immutable review-input template as a self-contained, read-only Markdown workspace and create a batch index:

```bash
npm run dev -- evidence review-workspace render <batch-id>
npm run dev -- evidence review-workspace show <batch-id>
npm run dev -- evidence review-workspace status <batch-id>
```

Derived files are stored under `workspace/evidence-reviews/batches/<batch-id>/review-workspace/`. The directory contains `index.review.md`, one `<claim-id>.review.md` file per controlled template, and deterministic manifests for the index and claim files.

The JSON batch and review-input templates remain canonical. Markdown is presentation-only: ProofLayer never parses or consumes it, and editing it has no effect on review decisions, snapshots, eligibility, or source evidence. Changed canonical inputs make the workspace stale; missing, modified, or inconsistent rendered files make it invalid. An unchanged render returns `already-current` without rewriting bytes, hashes, timestamps, or modification times. Use `--rebuild` only to replace stale or invalid derived rendering files.

### Local Evidence Review UI

The focused Astro UI deep-links the same local application into one existing Evidence Review Batch:

```bash
prooflayer ui review <batch-id>
prooflayer ui review <batch-id> --open
prooflayer ui review <batch-id> --read-only
```

The server binds to `127.0.0.1` by default, works offline, and accepts only the validated batch and its selected claims for review mutations. Product Shell mode can open an existing batch from Advanced Review without becoming globally batch-locked; each review form still receives a batch-and-claim-scoped token and calls the same canonical Evidence Claim Review service. Canonical Zod validation, immutable review versions, explicit supersession, eligibility rules, and atomic persistence remain unchanged.

Evidence Review now derives one conservative, transient recommendation from immutable claim, evidence, provenance, policy, and review metadata. Clear claims use **Approve and Next** as a single human-confirmation click; claims with exactly one safe classification ambiguity ask one compact question whose answer submits immediately; wording changes, true metric verification, privacy restrictions, unsupported scope, multiple ambiguities, and supersession remain manual review. **Change decision** exposes Edit and Approve, Reject, Not Enough Evidence, Decide Later, and the full canonical **Advanced Review** form.

The recommendation is never approval and is not persisted as Evidence Foundation state. Every confirmation and override still passes through the existing canonical schema and immutable review service. Numeric wording is classified deterministically: career duration and dates are not performance metrics, while business and performance outcomes retain exact metric verification. Public-safety restrictions cannot be overridden by the recommendation layer.

Both modes pass the same unchanged review-input schema into the same immutable Evidence Claim Review service. The UI never auto-approves a claim, and projected fields remain subject to authoritative scope, privacy, metric, classification, eligibility, and supersession validation. Existing reviews open read-only until **Create revised review** is selected.

The UI has no database, authentication, telemetry, remote assets, or persisted session state. JSON remains canonical and Markdown remains derived and read-only. Completing a batch does not build or upgrade a snapshot, change a target pin, or continue the Job pipeline; return explicitly with `prooflayer job continue <target-id>`. The granular `evidence claim-review` commands remain available for automation and expert use.

## Evidence Snapshot Contract v1

ProofLayer exposes the current reviewed Evidence Foundation through an immutable, content-addressed `evidence-snapshot` schema version `1`. New exports use `evidence-snapshot-exporter` version `2` under `evidence-snapshot-policy` version `2`; the reader remains compatible with immutable policy-version-1 snapshots and existing pins.

Snapshot export projects only current effective human reviews. It never approves, repairs, promotes, or reinterprets evidence. Approved corrected wording receives a stable projection ID while the original claim remains immutable and its source state/hash stays auditable. Eligible reviewed content is included for current consumers. Ineligible records retain stable IDs, source content hashes, review decision IDs/hashes, trust state, eligibility reasons, and safe logical provenance, while private content, reviewer rationale, and local source paths are omitted. Zero eligible evidence is a valid complete snapshot with explicit warnings.

```bash
npm run dev -- evidence snapshot-build
npm run dev -- evidence snapshot-list
npm run dev -- evidence snapshot-show <snapshot-id>
npm run dev -- evidence snapshot-status <snapshot-id>
npm run dev -- evidence snapshot-validate <snapshot-id>
```

Snapshots are stored separately from mutable internal evidence:

```text
workspace/evidence-snapshots/<snapshot-id>/
  evidence-snapshot.json
  evidence-snapshot-manifest.json
```

Snapshot identity binds schema and policy versions, the immutable source inventory hash, effective review inventory hash, ordered evidence and claim IDs and content hashes, normalized eligibility state, review projections, and verified metric IDs and hashes. Snapshot export timestamps do not affect identity. An unchanged export returns `already-current` without rewriting bytes, timestamps, or modification times. Existing snapshot content is never overwritten; corruption or identity collision must be inspected rather than repaired in place.

Role and Job targets pin one snapshot explicitly:

```bash
npm run dev -- target evidence-pin <target-id> --snapshot <snapshot-id>
npm run dev -- target evidence-show <target-id>
npm run dev -- target evidence-status <target-id>
npm run dev -- target evidence-upgrade <target-id> --snapshot <snapshot-id>
```

Pins live under `workspace/targets/<roles|jobs>/<target-id>/evidence/` and bind the target hash, snapshot ID, snapshot content and manifest hashes, schema and policy versions, timestamp, and explicit pin provenance. Creating a newer snapshot never changes a target or stales a consumer pinned to an older valid snapshot. Changing the pin requires `evidence-upgrade`; the operation changes only the dependency pointer and leaves downstream artifacts stale until explicitly rebuilt.

Job Evidence Mapping now requires a current Job pin and consumes eligible evidence and claims only from that read-only snapshot. A valid snapshot with zero eligible Job evidence still produces the existing safe zero-link map and explicit warning. New maps record the pin, snapshot, schema, policy, content, manifest, and eligible-set hashes. Mapping relationship rules remain unchanged and no model or review operation occurs.

The shared reader and target pin contract support Role targets. The existing Role Evidence Matching implementation still uses its legacy target-local snapshot adapter; full Role migration to the global pinned snapshot is intentionally deferred to avoid a broad matching refactor. The Evidence Foundation remains implemented inside this repository in this version. The contract is designed to permit a future repository boundary, but no repository split, remote fetching, or network API is implemented.

Snapshot lifecycle is `missing`, `current`, `invalid`, or `incompatible`. Pin lifecycle additionally supports `stale`. A schema-v1 reader accepts supported v1 snapshots and rejects unknown future major schema versions as incompatible. Eligibility-changing policy revisions require a new explicit policy version and target upgrade.

## Phase 2 Slice 2.4 Evidence Matching Foundation

Evidence Matching links approved target expectations to reviewed candidate evidence. It does not calculate overall candidate fit.

The boundary is explicit:

```text
Approved target interpretation
  + reviewed active candidate evidence
  -> manual links or optional model proposals
  -> human review
  -> approved evidence matching
  -> future fit assessment
```

Absence of reviewed evidence means unsupported or not assessed. It does not prove the candidate lacks the capability. Model-assisted matches are proposals and require human review before approval.

### Eligibility

Only current approved interpretations with `usableForEvidenceMatching: true` may enter matching. Eligible expectation trust states are `deterministic-approved`, `human-approved`, and `human-edited`; proposed and rejected expectations remain excluded.

Candidate evidence is eligible only when it is sensitivity-free, every referenced source is active and not private/do-not-use/sensitive, no source is a job description, and at least one current effective human claim review explicitly permits the consumer. Generic-only or unknown source state is not treated as public approval by itself; a human must explicitly mark the claim public-safe. The approved projection must be resume-ready and separately eligible for Role Matching or Job Mapping. Evidence is never promoted merely because it appears in a draft, output-specific resume review, or target-guided batch.

The legacy Role matching path stores a target-local evidence snapshot containing stable evidence IDs, artifact hashes, reviewed-claim hashes, and source provenance. Private raw source text is not copied into matching artifacts. The global Evidence Snapshot Contract described above is the current boundary for Job Mapping and the compatibility hook for future Role migration.

### Manual Matching

Manual matching is first-class and makes no provider call:

```bash
prooflayer target match add <target-id> \
  --expectation <expectation-id> \
  --evidence <evidence-id> \
  --type direct \
  --coverage full \
  --strength strong \
  --temporal current \
  --confidence high \
  --rationale-file reviewed-rationale.txt
prooflayer target match list <target-id>
prooflayer target match show <match-id>
prooflayer target match remove <match-id> --reason "Superseded reviewed link"
```

Manual links receive `manual-approved` trust. Removal preserves a tombstone. Exact duplicates use a deterministic identity based on target ID, expectation ID, sorted evidence IDs, match type, and matching policy version. A manual-approved link is not silently replaced by an equivalent model-originated link.

### Optional Model Proposals

The optional model path reuses ProofLayer's provider abstraction and supplies only approved expectations, eligible reviewed evidence summaries, approved claim wording, exact IDs, provenance, and matching policy:

```bash
prooflayer target match-proposal generate <target-id>
prooflayer target match-proposal generate <target-id> --refresh
prooflayer target match-proposal list <target-id>
prooflayer target match-proposal show <proposal-id>
prooflayer target match-proposal status <proposal-id>
prooflayer target match-proposal replay <proposal-id>
```

The prompt is `target-evidence-match-proposal` version `1`, policy version `1`. It forbids candidate-fact invention, unsupported metrics, unknown IDs, unreviewed evidence, fit scores, hiring/application recommendations, strengths or weaknesses reports, and resume language. Role titles alone cannot provide direct proof of a full leadership expectation, tool mentions alone cannot prove production expertise, and project existence alone cannot prove business impact.

The exact raw response and its SHA-256 are preserved. Request fingerprints include approved interpretation, eligible evidence set, matcher and policy, provider/model/settings, prompt identity/version, and normalized input hash. A valid identical request returns a cache hit without a provider call or rewrite. `--refresh` creates a new proposal. Replay performs no provider call and repeats parsing, schema, eligibility, provenance, forbidden-content, and stable-normalization checks.

### Human Review And Approval

Reviews keep match and expectation-coverage decisions separate:

```bash
prooflayer target match-proposal review-init <proposal-id> --reviewer "Reviewer Name"
prooflayer target match-proposal review-show <proposal-id>
prooflayer target match-proposal review-status <proposal-id>
prooflayer target match-proposal review-set <proposal-id> <proposed-match-id> --accept
prooflayer target match-proposal review-set <proposal-id> <proposed-match-id> --reject
prooflayer target match-proposal review-set <proposal-id> <proposed-match-id> --edit-file reviewed-match.json
prooflayer target match-proposal review-set-coverage <proposal-id> <coverage-id> --accept
prooflayer target match-proposal review-set-coverage <proposal-id> <coverage-id> --status unsupported
prooflayer target match-proposal review-complete <proposal-id>
```

Every proposed match and coverage record must receive exactly one decision. Edited match files must use currently eligible evidence IDs. Reviews never mutate proposals or raw responses.

Approval is deterministic and makes no model call:

```bash
prooflayer target matching approve <proposal-id>
prooflayer target matching approved-show <target-id>
prooflayer target matching approved-status <target-id>
prooflayer target matching status <target-id>
prooflayer target matching show <target-id>
```

Approved output merges current `manual-approved` links with accepted `human-approved` and edited `human-edited` links. Rejected and proposed items stay auditable but never enter approved match lists. Stale or invalid dependencies require inspection and explicit `--rebuild`; unchanged approval returns `already-current` without rewriting timestamps.

### Match And Coverage Semantics

Match types are `direct`, `supporting`, `partial`, and `contradictory`. Evidence strength (`strong`, `medium`, `weak`, `unknown`), temporal relevance (`current`, `recent`, `historical`, `unknown`), and match confidence (`high`, `medium`, `low`) describe one evidence link only; none is an aggregate fit score.

Coverage states are `matched`, `partially-matched`, `unsupported`, `not-assessed`, and `conflicting`:

- `matched` requires an approved direct full-coverage link or explicit human equivalent.
- `partially-matched` means only supporting or partial approved links exist.
- `unsupported` requires an explicit completed human assessment of no support.
- `not-assessed` means no completed matching decision exists.
- `conflicting` requires approved explicit contradictory evidence; absence is never contradiction.

Matching completeness is `empty`, `partial`, or `complete`. `usableForFitAssessment` becomes true only when every eligible expectation has a completed coverage state. It means structurally eligible for a future assessment stage, not that the candidate is a good fit or that proof readiness is high.

Artifacts are independently versioned:

```text
workspace/targets/{roles|jobs}/<target-id>/matching/
  evidence-snapshot.json
  evidence-snapshot-manifest.json
  manual/
    target-evidence-matching.json
    matching-manifest.json
  proposals/<proposal-id>/
    proposal.json
    proposal-manifest.json
    raw-model-response.txt
  reviews/<proposal-id>/
    review.json
    review-manifest.json
  approved/
    target-evidence-matching.json
    matching-manifest.json
```

Lifecycle status is `missing`, `current`, `stale`, or `invalid`. Matching is local-first; deterministic/manual paths remain offline and tests use fake providers. API keys are never persisted.

This slice does not generate resumes, application materials, fit percentages, proof-readiness scores, strengths or weaknesses reports, or hiring recommendations. Job descriptions remain target inputs and never become candidate evidence.

## Phase 2 Slice 2.5 Fit And Proof Assessment

Fit and Proof Assessment interprets approved evidence matching. It does not generate new candidate claims. Its primary result is an expectation-by-expectation assessment, not a fit percentage or hiring prediction.

Both target workflows use the same assessment contract:

- Role targets receive a `role-positioning` assessment for future role-specific construction.
- Job targets receive a `job-specific` assessment for future opportunity-specific application construction.

Each expectation records support status, proof quality, evidence sufficiency, defensibility, freshness risk, contradiction risk, gap type, assessment confidence, materiality, exact approved match/evidence IDs, provenance, and recommended evidence actions. Assessment confidence applies to the assessment record, not to hiring probability.

Support status is bounded to `strongly-supported`, `supported`, `partially-supported`, `unsupported`, `conflicting`, or `not-assessed`. Unsupported means the reviewed evidence base does not currently prove an expectation. It does not prove the candidate lacks the capability.

Role summaries use qualitative categories such as `well-supported`, `supported-with-gaps`, `partially-supported`, `insufficient-evidence`, `conflicting`, and `incomplete`. Job summaries use `strong-alignment`, `credible-alignment`, `mixed-alignment`, `weak-evidence-alignment`, `material-conflict`, and `incomplete`. These labels are deterministic summaries of reviewed proof coverage; they are not percentages, employment probabilities, or recommendations to apply, screen, interview, or hire.

### Deterministic Assessment

Build, inspect, and check a deterministic assessment:

```bash
prooflayer target assess build <target-id>
prooflayer target assess show <target-id>
prooflayer target assess status <target-id>
```

The versioned `fit-proof-assessment-policy` derives all fields from the current approved interpretation and current approved matching. It never reads job descriptions as candidate evidence and never calls a model. A complete role assessment may become structurally usable for future resume construction; a complete job assessment may become structurally usable for future application construction. Partial matching can produce an inspectable draft assessment, but its downstream construction flags remain false.

Assessment artifacts are separate from interpretation and matching:

```text
workspace/targets/{roles|jobs}/<target-id>/assessment/
  deterministic/
    target-fit-assessment.json
    assessment-manifest.json
  proposals/<proposal-id>/
    proposal.json
    proposal-manifest.json
    raw-model-response.txt
  reviews/<proposal-id>/
    review.json
    review-manifest.json
  approved/
    target-fit-assessment.json
    assessment-manifest.json
```

Manifests pin the target, approved interpretation, approved matching, reviewed evidence snapshot, expectation and match sets, policy, proposal, and review hashes. Stable inputs preserve IDs and timestamps and avoid rewrites. Dependency changes make artifacts stale; malformed content, broken provenance, or hash disagreement makes them invalid. Explicit `--rebuild` or `--refresh` is required where replacement is allowed.

### Optional Model Proposals

A model may propose a stricter qualitative interpretation of the deterministic assessment, but it cannot add expectations, matches, evidence, candidate facts, metrics, resume language, application recommendations, or hiring predictions:

```bash
prooflayer target assess-proposal generate <target-id>
prooflayer target assess-proposal generate <target-id> --refresh
prooflayer target assess-proposal list <target-id>
prooflayer target assess-proposal show <proposal-id>
prooflayer target assess-proposal status <proposal-id>
prooflayer target assess-proposal replay <proposal-id>
```

The normalized request includes only current approved expectations, approved matching, deterministic assessment fields, exact IDs/provenance, and the assessment policy. Request fingerprints include all dependencies, provider/model/settings, prompt identity/version, and normalized input hash. An unchanged valid request is a cache hit with no provider call or rewrite. `--refresh` creates a new proposal. Replay performs no provider call and revalidates the exact stored raw response. Raw responses are preserved byte-for-byte and hashed; credentials are never persisted.

### Review And Approved Assessment

Model proposals remain untrusted until every expectation assessment and the overall summary receive a human decision:

```bash
prooflayer target assess-proposal review-init <proposal-id> --reviewer "Reviewer Name"
prooflayer target assess-proposal review-show <proposal-id>
prooflayer target assess-proposal review-status <proposal-id>
prooflayer target assess-proposal review-set <proposal-id> <expectation-assessment-id> --accept
prooflayer target assess-proposal review-set <proposal-id> <expectation-assessment-id> --reject
prooflayer target assess-proposal review-set <proposal-id> <expectation-assessment-id> --edit-file reviewed-assessment.json
prooflayer target assess-proposal review-set-summary <proposal-id> --accept
prooflayer target assess-proposal review-set-summary <proposal-id> --reject
prooflayer target assess-proposal review-set-summary <proposal-id> --edit-file reviewed-summary.json
prooflayer target assess-proposal review-complete <proposal-id>
prooflayer target assessment approve <proposal-id>
prooflayer target assessment approved-show <target-id>
prooflayer target assessment approved-status <target-id>
```

Accepted records become `human-approved`; edited records become `human-edited`; rejected records fall back to the current deterministic assessment as `deterministic-approved`. Review cannot change expectation, match, evidence, or source-provenance identities. Approval makes no provider call and refuses incomplete review, stale dependencies, unsafe edits, or mismatched hashes.

Evidence actions are proof-maintenance suggestions such as clarifying, corroborating, refreshing, or resolving reviewed evidence. They are not instructions to invent claims or metrics. Slice 2.5 produces no resumes, cover letters, screening answers, application recommendations, ATS optimization, fit percentages, or hiring predictions.

## Slice 1.1 Resume Parser Hardening

Markdown resumes are parsed by section before evidence is generated. The parser recognizes summary, strengths, technical fluency, current initiatives, professional experience, enterprise experience, education/certifications, and additional information sections.

- Roles require a company/title/date structure; standalone dates and headings are ignored.
- Projects come from structured entries under the product and AI initiatives section.
- Skills link only to evidence items where the skill or tool is explicitly mentioned.
- Claims pass a quality filter that removes headings, names, dates, fragments, and generated aggregate phrases.
- Structured CV content receives high extraction confidence, but still requires factual corroboration and public visibility before approval.
- `normalization-quality-report.md` records extraction counts, ignored content, and warnings after rebuilds.

## Slice 1.2 Trust Model

ProofLayer tracks different kinds of certainty separately:

- `extractionConfidence` describes how reliably text was parsed into a structured item.
- `factualConfidence` describes how strongly the available evidence supports the claim itself.
- `corroborationLevel` records whether support is uncorroborated, single-source, multi-source, or manually approved.
- `approvalStatus` controls whether a claim is approved, needs confirmation, or is blocked.
- `outputReadiness` controls whether wording is resume-ready, generic-only, internal-only, or do-not-use.

Approval status meanings:

- `approved`: fact-like, strongly supported, public, privacy-safe, and sufficiently corroborated.
- `needs_confirmation`: plausible but not ready for trusted public use.
- `blocked`: private, sensitive, do-not-use, or otherwise unsafe.

Output readiness meanings:

- `resume_ready`: approved for trusted matching and public resume output.
- `generic_only`: may support generalized wording, but exact source wording must not be reused verbatim.
- `internal_only`: useful inside the knowledge base but not approved for public output.
- `do_not_use`: excluded from downstream output.

Generic competency statements from summaries or strengths sections remain claim candidates, not proven facts. Repeated role periods and project bullets carry explicit parent evidence IDs so later processing does not merge unrelated work.

Job matching must use only claims where `approvalStatus` is `approved` and `outputReadiness` is `resume_ready` by default. A match score must not treat extraction confidence as factual approval.

## Slice 1.3 Living Knowledge Updates

The default loop is intentionally small:

```text
Update source files -> prooflayer refresh -> prooflayer changes -> review the impact report
```

- `refresh` runs the existing deterministic pipeline, compares it with the previous successful baseline, and updates the baseline only after every stage and report succeeds.
- `changes` prints a concise summary of the latest source, evidence, claim, trust, and privacy changes.
- `status` reports source count, last successful refresh, profile fingerprint, warnings, trust/readiness counts, and whether registered outputs are stale.
- `rebuild` remains a backward-compatible alias for `refresh`.

The update baseline stores normalized relative source paths, hashes, privacy-safe fingerprints, categories, context hashes, and status summaries. It does not store raw extracted text or claim wording. The Markdown impact report similarly uses counts and hashed references rather than reproducing private content.

Sources are matched by normalized relative path and type, with file hashes representing versions. Evidence and claims use stable fingerprints based on normalized meaning and role/project context. CV variants and repeated LinkedIn exports are grouped into source families for impact reporting and are not counted as independent corroboration by the update layer.

Project notes enrich one explicit project entity rather than turning every note line into a role or project. Project aliases such as `SB`, `SignalBoard`, and `SB (SignalBoard)` share one stable project identity in profile and update-impact counts.

Generated outputs register their profile fingerprint in `workspace/outputs/output-manifest.json`. `status` and the impact report mark an output stale when its stored fingerprint differs from the current profile fingerprint. Before any variant is generated, ProofLayer reports `none registered`.

## Slice 1.4 Role Variant Drafts

Generate one role-specific draft package:

```bash
npm run generate:role -- --role tpm
```

Supported role keys are `tpm`, `ai-product`, `fullstack`, and `fractional-cto`.

Generate every supported variant and inspect freshness:

```bash
npm run generate:roles
npm run variants
npm run status
```

Each variant directory contains:

- `resume-draft.md`
- `website-copy-draft.md`
- `variant-summary.md`
- `unresolved-claims.md`
- `generation-manifest.json`

Draft mode is intentionally different from final/public output. It may use non-blocked claims that still need confirmation, plus generalized wording supported by generic-only or non-sensitive internal evidence. Every draft carries a warning, and its unresolved-claims file identifies the exact claims that require review. Blocked, do-not-use, private, sensitive, and unsupported-metric claims are excluded.

The generation manifest records the profile fingerprint and every claim/evidence dependency used. `variants` compares that fingerprint with the current living profile and marks each generated package `current` or `stale`. `status` summarizes registered, current, and stale output counts.

Slice 1.4 does not provide final/public approval, job matching, cover letters, PDF/DOCX export, dashboard UI, cloud sync, or automatic website publishing.

## Slice 1.5 and 1.7 Output Review and Final/Public Boundary

Output-specific review supports the generated `tpm` and `ai-product` variants. Each variant has an independent review file and final/public boundary. Review does not change global claim trust or create a workspace-wide approval queue.

Create or update a role review file:

```bash
npm run review:variant -- --role tpm
npm run review:variant -- --role ai-product
```

Edit `workspace/outputs/variants/{role-key}/review-decisions.json` and set each relevant claim to one of:

- `approve`: use the original claim or ProofLayer's generalized safe wording.
- `revise`: use `approvedPublicWording`; this field is required.
- `draft_only`: retain the claim in draft workflows but exclude it from public candidates.
- `exclude`: omit the claim from the final candidate.
- `pending`: leave the claim unresolved and exclude it from the final candidate.

Existing decisions are preserved when the review command is rerun. Review scope is the stable union of unresolved claims used by the generation manifest, claims listed in `unresolved-claims.md`, and a bounded role-completeness set. Newly discovered claims are appended as `pending`.

For the TPM variant, completeness checks include available product/delivery tools, education, certifications, summary positioning, and the TPM-relevant product/platform claims already selected by the draft. This lets finalization include explicitly reviewed skills and education even when they were not among the original top draft bullets; it does not approve them automatically or change global claim trust.

For the AI Product variant, completeness checks prioritize AI-assisted workflows, SignalBoard and market-signal work, evidence-backed decision support, product validation and evaluation, InSightARLeans, AI/mobile prototypes, experimentation, and app/backend/data tradeoffs. Relevant tools can enter review scope, while unrelated legacy or broad leadership claims are de-emphasized. Newly selected claims are still appended as `pending`; ProofLayer does not auto-approve them.

AI Product final rendering applies a deterministic, role-specific surface order after review. SignalBoard project sections prioritize market-signal intelligence, action provenance, and briefing evaluation. InSightARLeans sections prioritize the computer-vision prototype, iterative validation and qualitative feedback, and product/technical tradeoffs. App/backend validation and evidence-backed traceability are preferred in general strengths, with semantic duplication removed. This affects only reviewed AI Product final files; TPM ordering, review decisions, draft files, and global trust remain unchanged.

When reviewed evidence provides it, AI Product final rendering also separates project role/timeline and maturity from evidence bullets. SignalBoard is labeled as a product experiment rather than a launched or adopted platform, InSightARLeans is labeled as an AI/mobile prototype, and previously reviewed product/platform experience is presented as a compact career foundation. These labels and foundation bullets use only approved or revised claims; they do not infer dates, traction, or production status.

Check review progress and generate a final/public candidate:

```bash
npm run review:status -- --role tpm
npm run finalize:variant -- --role tpm
npm run review:status -- --role ai-product
npm run finalize:variant -- --role ai-product
npm run variants
npm run status
```

Finalization creates:

- `workspace/outputs/variants/{role-key}/final-resume.md`
- `workspace/outputs/variants/{role-key}/final-website-copy.md`
- `workspace/outputs/variants/{role-key}/final-public-checklist.md`
- `workspace/outputs/variants/{role-key}/final-manifest.json`

Pending, draft-only, excluded, blocked, do-not-use, private, sensitive, and unsupported-metric claims are never copied into final candidate content. A revised claim requires explicit approved public wording. Unknown-visibility evidence also requires explicit approved public wording before use. Generic-only claims use generalized wording unless an explicit public version is supplied.

Finalization is allowed when the selected role draft matches the current profile fingerprint, even if review is incomplete. In that case ProofLayer creates a minimal candidate, marks it `not ready`, and records missing sections and remaining decisions in the final public checklist. Draft files remain unchanged.

`variants` reports draft and final state separately for every role. `status` reports registered draft and final counts, while the output manifest stores draft and final candidates as separate entries with independent fingerprints and freshness.

Final website rendering deduplicates identical generalized wording so multiple reviewed claims cannot produce repeated public bullets.

Output-specific review currently supports `tpm` and `ai-product`. It does not yet support `fullstack` or `fractional-cto`, publish website content, export PDF/DOCX files, generate job-specific packages, or approve claims globally.

## Slice 1.6 Public Profile Metadata

Public profile metadata is a small, manually approved layer for identity and final wording that ProofLayer must not infer from evidence. Initialize it without overwriting existing values, then inspect a safe summary:

```bash
npm run public-profile:init
npm run public-profile:show
```

The config lives at `workspace/config/public-profile.json` and can contain:

- Public name and optional global or role-specific headline overrides, plus an optional summary override
- Optional public location, email, website, LinkedIn, and GitHub values
- Education wording overrides keyed by claim ID
- Certification wording overrides keyed by claim ID

Only add identity and contact values that the user has explicitly approved for public use. ProofLayer does not guess missing names, URLs, locations, or contact details.

TPM and AI Product finalization read this config when available. Finalization replaces the name placeholder, applies a role-specific headline override before the global fallback, applies the summary override, includes configured public links, and uses education/certification wording overrides for included claims. Draft files, source evidence, claim trust, and review decisions remain unchanged.

`final-public-checklist.md` records whether public metadata was configured and used, which wording overrides were applied, and whether a missing name or affected generic education/certification claim still needs attention. Finalization remains deterministic for the same profile, decisions, public metadata, and profile fingerprint.

## Slice 1.6.1 Foundation Hardening

Core JSON state under `workspace/kb/` is written atomically, including sources, evidence, claims, the career profile, and normalization statistics. The latest refresh changelog is also replaced atomically, reducing the chance that an interrupted write leaves a partial JSON file.

Claim identity now combines normalized claim text with normalized parent role/project context when a collision exists. Equivalent parent entities from repeated exports can still group together. Claims with one effective context retain their legacy text-based IDs. When identical wording appears under multiple contexts, one deterministic context keeps the legacy ID and additional contexts receive context-specific IDs, preventing unsafe merging without invalidating unaffected review decisions.

Global approval in `claims.json` remains stricter than output-specific review. A profile may have zero globally approved claims while an explicitly reviewed role candidate is publication-ready. Draft exploration, global trust, and final/public output approval remain separate boundaries. See `docs/TRUST_MODEL_AND_REVIEW_BOUNDARY.md` for the full model and compatibility behavior.

## Slice 1.8 Resume Export

ProofLayer can export reviewed AI Product and TPM final resumes as complete Markdown, DOCX, and PDF packages without regenerating or changing their content:

```bash
npm run export:resume -- --role ai-product
npm run export:status -- --role ai-product
npm run export:resume -- --role tpm
npm run export:status -- --role tpm
```

The export command requires `pandoc` for DOCX creation and `soffice` from LibreOffice for PDF conversion. It fails clearly when either tool is unavailable or when the final resume, final manifest, readiness review, or current profile fingerprint is missing or stale.

AI Product exports are written to `workspace/outputs/exports/ai-product/`:

- `Ahmed_Yosry_AI_Product_Manager_Final.md`
- `Ahmed_Yosry_AI_Product_Manager_Final.docx`
- `Ahmed_Yosry_AI_Product_Manager_Final.pdf`
- `export-manifest.json`

TPM exports are written to `workspace/outputs/exports/tpm/`:

- `Ahmed_Yosry_TPM_Final.md`
- `Ahmed_Yosry_TPM_Final.docx`
- `Ahmed_Yosry_TPM_Final.pdf`
- `export-manifest.json`

The exported Markdown is an atomic, byte-for-byte copy of the reviewed final source. DOCX and PDF are generated from that same reviewed source. The export manifest records both Markdown paths and SHA-256 hashes, explicit source/export hash verification, the profile fingerprint, conversion tools, readiness-review path, and all three generated files. ProofLayer writes artifacts through a temporary directory and only registers the package after Markdown, DOCX, and PDF exist and are non-empty.

Exports are registered separately from draft and final Markdown outputs in `workspace/outputs/output-manifest.json`. `export status` reports Markdown, DOCX, and PDF presence/currentness plus the source/export Markdown hash match. `export status`, `variants`, and `status` mark the package stale when the source changes, the exported Markdown is missing or differs, DOCX/PDF is missing, or the profile fingerprint changes. Re-run export to repair package artifacts; re-run finalization first when the reviewed final source or profile is stale.

Slice 1.8 currently exports `ai-product` and `tpm`. It does not alter review decisions, source evidence, final Markdown, or another role's export artifacts.

## Slice 2.6A Role Resume Content Planning

Role Resume Content Planning selects and structures approved content. It does not write the resume.

The role-only planning pipeline consumes one current Role Target plus the current approved interpretation, evidence matching, and role fit/proof assessment for that same target. Job Targets are rejected. By default, the assessment must be complete and marked usable for resume construction. `--allow-partial` creates an explicitly partial plan that remains unusable for drafting.

Build and inspect the deterministic plan:

```bash
npm run dev -- target resume-plan build role-engineering-manager
npm run dev -- target resume-plan show role-engineering-manager
npm run dev -- target resume-plan status role-engineering-manager
```

The explicit deterministic policy is `role-resume-content-planning-policy` version `1`. It applies ordered rules without hidden scores:

- Critical or high-materiality expectations with supported, defensible proof become primary.
- Credible medium-materiality expectations become secondary.
- Lower-materiality supported expectations provide supporting context.
- Partial or unclear proof is deferred.
- Unsupported and conflicting expectations are excluded; they are not converted into resume claims.
- Strong direct current evidence is preferred, adequate evidence is allowed, and historical or narrowly useful evidence is limited-use.
- Contradictory, unrelated, weak, or unapproved evidence is excluded.
- Claim boundaries are `allowed`, `allowed-with-caution`, `requires-review`, or `prohibited` and can never exceed approved evidence.
- A quantified resume outcome may be planned only when a reviewed metric exists.

The plan contains a conservative positioning scope:

- `direct-role-positioning`: core material expectations have credible support.
- `adjacent-role-positioning`: transferable evidence exists with important gaps.
- `stretch-positioning`: positioning is plausible but material gaps require careful framing.
- `insufficient-evidence`: the reviewed evidence base cannot support a defensible plan.

Positioning scope describes the current evidence base, not employability or hiring probability. A target role title is a positioning target. It is not proof that the candidate currently holds or previously held that title.

The section plan may structurally include headline, professional summary, core capabilities, selected impact, professional experience, selected projects, technical capabilities, leadership capabilities, education, certifications, and additional information. Each section records its objective, order, approved expectation/match/evidence references, allowed and prohibited content types, limits, cautions, and provenance. No headline wording, summary prose, role rewrite, transition, or resume bullet is generated.

The default narrative architecture is:

```text
Target role identity
-> Primary positioning themes
-> Selected evidence-backed impact
-> Relevant professional experience
-> Supporting projects and technical depth
-> Education and certifications
```

Themes are derived only from approved expectation capability tags and evidence. Duplicate themes are consolidated by stable expectation identity. Evidence reuse remains explicit through plan-element provenance, and a weak item is not promoted by repetition. The planner prefers useful leadership, delivery, technical, product, business, recent, and historical breadth when the evidence offers it, but never weakens proof to force diversity.

Recency remains visible. Recent evidence may support present positioning; historical evidence may establish depth but cannot imply current hands-on depth without corroboration. Project evidence remains project-scoped and cannot silently become employment ownership. The plan also prohibits inferred seniority, current employment, direct-report counts, hiring authority, budgets, executive reporting lines, organization scale, enterprise-wide ownership, or unreviewed metrics.

The artifact includes machine-readable exclusions, risks, warnings, and ambiguities. These identify unsupported/conflicting expectations, missing metrics, limited or historical evidence, incomplete provenance, caution-required positioning, unclear leadership/seniority boundaries, and section decisions that need review. Completeness is structural only. `usableForResumeDrafting` means Slice 2.6B may consume the plan; it does not claim competitiveness or permission to invent missing content.

Optional model-assisted planning reuses the existing `InterpretationModelProvider`:

```bash
npm run dev -- target resume-plan-proposal generate role-engineering-manager
npm run dev -- target resume-plan-proposal list role-engineering-manager
npm run dev -- target resume-plan-proposal show <proposal-id>
npm run dev -- target resume-plan-proposal status <proposal-id>
npm run dev -- target resume-plan-proposal replay <proposal-id>
```

The prompt identity is `target-role-resume-plan-proposal` version `1`. Model input is bounded to approved role artifacts, reviewed evidence metadata, deterministic planning, and policy constraints. Strict JSON output may propose prioritization and planning changes, but it cannot add IDs, strengthen proof, generate resume prose, invent facts or metrics, infer organizational scope, tailor to a job, score ATS fit, predict hiring, or recommend an application. Model output remains a proposal and is never auto-approved.

The model validator is intentionally conservative. New free-form vocabulary outside approved input and a small planning vocabulary can be rejected even when it might be harmless; revise the structured proposal rather than weakening the evidence boundary.

Review supports one decision for positioning and every section, expectation selection, evidence selection, claim boundary, and exclusion:

```bash
npm run dev -- target resume-plan-proposal review-init <proposal-id> --reviewer "Reviewer"
npm run dev -- target resume-plan-proposal review-show <proposal-id>
npm run dev -- target resume-plan-proposal review-status <proposal-id>
npm run dev -- target resume-plan-proposal review-set-positioning <proposal-id> <item-id> --accept
npm run dev -- target resume-plan-proposal review-set-section <proposal-id> <item-id> --edit-file section.json
npm run dev -- target resume-plan-proposal review-set-expectation <proposal-id> <item-id> --reject
npm run dev -- target resume-plan-proposal review-set-evidence <proposal-id> <item-id> --accept
npm run dev -- target resume-plan-proposal review-set-claim-boundary <proposal-id> <item-id> --accept
npm run dev -- target resume-plan-proposal review-set-exclusion <proposal-id> <item-id> --reject
npm run dev -- target resume-plan-proposal review-complete <proposal-id>
```

Accepted items become `human-approved`; valid edits become `human-edited`; rejected items use the `deterministic-approved` fallback. Review never mutates the proposal. Approval makes no model call:

```bash
npm run dev -- target resume-plan approve <proposal-id>
npm run dev -- target resume-plan approved-show role-engineering-manager
npm run dev -- target resume-plan approved-status role-engineering-manager
```

Deterministic and approved plans have separate manifests and lifecycle states: `missing`, `current`, `stale`, and `invalid`. Input hashes cover the target, approved interpretation and manifest, approved matching and manifest, evidence snapshot, approved assessment and manifest, resolved ID sets, and policy version. Approved plans additionally bind the proposal and review hashes. Unchanged input returns `already-current` without rewriting IDs or timestamps. Stale or invalid replacement requires `--rebuild`.

Proposal fingerprints also include provider, model, generation settings, prompt template/policy versions, deterministic-plan hash, and normalized-input hash. Proposal IDs combine that request fingerprint, the exact raw-response hash, and a deterministic preserved-proposal ordinal; they never depend on timestamps, randomness, absolute paths, or filesystem ordering. A valid cache hit makes no provider call or rewrite. `--refresh` creates a new preserved proposal. Replay uses exact stored raw response bytes, makes no provider call, and verifies normalized proposal reproduction. API keys are never persisted.

Artifacts live under:

```text
workspace/targets/roles/<target-id>/resume-planning/
  deterministic/
    role-resume-plan.json
    plan-manifest.json
  proposals/<proposal-id>/
    proposal.json
    proposal-manifest.json
    raw-model-response.txt
  reviews/<proposal-id>/
    review.json
    review-manifest.json
  approved/
    role-resume-plan.json
    plan-manifest.json
```

The approved plan is a constraint system for future drafting, not finished resume content. This slice does not generate headlines, summaries, bullets, resumes, cover letters, screening answers, applications, ATS optimization, fit percentages, hiring probabilities, or application recommendations. It creates no new candidate claims and does not mutate targets, reviewed evidence, interpretation, matching, assessment, existing resumes, or exports.

## Slice 2.6B Role Resume Draft Proposal

Role Resume Draft Proposal converts one current approved Role Resume Content Plan into reviewed, structured resume wording. It supports role-based market positioning only. Job Targets and Job Descriptions are rejected, and no opportunity-specific tailoring occurs.

The approved Role Resume Content Plan is a constraint system. Drafting may not exceed it. The pipeline is:

```text
Current approved Role artifacts
-> deterministic prose-free scaffold
-> optional model-assisted structured proposal
-> strict validation
-> human review
-> approved structured Role Resume Draft
```

The explicit drafting policy is `role-resume-drafting-policy` version `1`. The prompt identity is `target-role-resume-draft-proposal` version `1`. Model-assisted drafting reuses the existing `InterpretationModelProvider`; API keys and credentials are never persisted.

Build and inspect the deterministic scaffold:

```bash
npm run dev -- target resume-draft scaffold-build role-engineering-manager
npm run dev -- target resume-draft scaffold-show role-engineering-manager
npm run dev -- target resume-draft scaffold-status role-engineering-manager
```

The scaffold preserves the plan's exact included, optional, and excluded sections; order; objectives; content limits; selected expectations and evidence; claim boundaries; metric permissions; required qualifiers; cautions; exclusions; and prohibited inferences. It creates item slots and deterministic constraints, not resume prose. A stale or invalid scaffold requires explicit `--rebuild`; unchanged input returns `already-current` without changing IDs or timestamps.

Generate, inspect, and replay a structured proposal:

```bash
npm run dev -- target resume-draft-proposal generate role-engineering-manager
npm run dev -- target resume-draft-proposal generate role-engineering-manager --refresh
npm run dev -- target resume-draft-proposal list role-engineering-manager
npm run dev -- target resume-draft-proposal show <proposal-id>
npm run dev -- target resume-draft-proposal status <proposal-id>
npm run dev -- target resume-draft-proposal replay <proposal-id>
```

Model input is limited to the Role Target, current approved interpretation, matching, assessment, plan, deterministic scaffold, selected reviewed evidence, claim boundaries, qualifiers, metric references, section limits, and policy. It excludes Job Descriptions, stale or rejected artifacts, arbitrary prior resumes, unrelated biography, unreviewed sources, market keyword lists, and application instructions.

The model must return strict JSON with one structured item per proposed statement. Every substantive resume statement must retain claim-to-evidence provenance: target, plan and section, expectation, assessment, approved match, evidence, claim boundary, policy, proposal, model/prompt identity, artifact hashes, and review decision. Evidence is linked narrowly to the statement it supports, not attached indiscriminately.

Validation enforces:

- Only plan-approved sections, order, item types, item counts, content types, expectations, matches, evidence, and claim boundaries may appear.
- The target role title is positioning context. It is not historical employment evidence.
- Project evidence remains project-scoped unless reviewed evidence explicitly supports a broader claim.
- Responsibilities are not achievements unless reviewed outcome evidence exists.
- Leadership wording cannot infer people management, direct reports, hiring authority, budgets, executive reporting, or organization-wide authority.
- Technical wording cannot upgrade historical use, experimentation, repository presence, or familiarity into current production expertise.
- Quantified wording is allowed only when the exact reviewed `verified_metric` is referenced with its unit and attribution. Metrics are never estimated, rounded, combined, extrapolated, or converted.
- Dates and durations must come from reviewed evidence. Aggregate years of experience are not calculated in this slice.
- Headline and summary wording must use approved themes, avoid current-employment assertions and unsupported seniority, and remain within policy length limits.
- Experience bullets carry one primary defensible claim and cannot silently strengthen cautious action verbs.
- Education and certification wording preserves reviewed facts and cannot infer completion or active status.
- Unsupported employers, projects, technologies, dates, metrics, team sizes, revenue, customers, users, adoption, production scope, seniority, or authority are rejected.
- Inflated language, duplicated claims, repeated opening verbs, ATS scores, hiring probabilities, application advice, cover letters, and screening answers are rejected or flagged.

The proposal contains a machine-readable claim ledger and evidence-usage ledger. Claim entries bind exact statement hashes to expectation, assessment, match, evidence, boundary, metric, scope, and validation states. Evidence usage identifies relevant usage, overuse, prohibited use, and selected evidence that was not used. Risks, warnings, and ambiguities remain explicit; the validator never strengthens text silently to resolve uncertainty.

Proposal fingerprints include all approved dependency hashes, evidence snapshot, scaffold, policy, provider/model settings, prompt identity, generation settings, and normalized model input. A cache hit makes no provider call and does not rewrite artifacts. `--refresh` calls the provider and preserves a distinct proposal. Replay uses the exact stored raw bytes, makes no provider call, and verifies the normalized proposal hash and validation outcome.

Human review is mandatory:

```bash
npm run dev -- target resume-draft-proposal review-init <proposal-id> --reviewer "Reviewer"
npm run dev -- target resume-draft-proposal review-show <proposal-id>
npm run dev -- target resume-draft-proposal review-status <proposal-id>
npm run dev -- target resume-draft-proposal review-set-section <proposal-id> <item-id> --accept
npm run dev -- target resume-draft-proposal review-set-draft-item <proposal-id> <item-id> --edit-file edit.json
npm run dev -- target resume-draft-proposal review-set-claim-ledger <proposal-id> <item-id> --accept
npm run dev -- target resume-draft-proposal review-set-section-order <proposal-id> <item-id> --accept
npm run dev -- target resume-draft-proposal review-set-ambiguity <proposal-id> <item-id> --reject
npm run dev -- target resume-draft-proposal review-complete <proposal-id>
```

Each review item supports exactly one of `--accept`, `--reject`, or `--edit-file`. Human editing does not bypass evidence, provenance, or claim-boundary validation. Edited text and references undergo the same strict checks as model output. Review does not mutate the proposal.

Approval is deterministic and makes no model call:

```bash
npm run dev -- target resume-draft approve <proposal-id>
npm run dev -- target resume-draft approved-show role-engineering-manager
npm run dev -- target resume-draft approved-status role-engineering-manager
```

Accepted statements become `human-approved`; validated edits become `human-edited`; rejected model wording is omitted. `model-proposed` and rejected wording cannot enter the approved artifact. Approval requires a complete current review, current dependencies, complete claim ledger, complete provenance, valid required sections, and no unresolved critical issue. Completeness is structural: `usableForRendering` means a future renderer may consume the structured artifact, not that the candidate is qualified or the output is job-specific.

Artifacts live under:

```text
workspace/targets/roles/<target-id>/resume-drafting/
  scaffold/
    role-resume-draft-scaffold.json
    scaffold-manifest.json
  proposals/<proposal-id>/
    proposal.json
    proposal-manifest.json
    raw-model-response.txt
  reviews/<proposal-id>/
    review.json
    review-manifest.json
  approved/
    role-resume-draft.json
    draft-manifest.json
```

Scaffolds, proposals, reviews, and approved drafts use stable content-derived IDs, stable JSON, atomic persistence, integrity manifests, and `missing`, `current`, `stale`, or `invalid` lifecycle states. Approved artifacts are never silently regenerated after an upstream dependency changes.

This slice creates structured draft content. It does not render or export DOCX, PDF, HTML, or Markdown resumes. It also does not create job-specific content, ATS optimization, fit scores, hiring probabilities, application recommendations, cover letters, or screening answers. Known limitations include deliberately conservative token-based hallucination checks and exact-text duplicate detection; ambiguous semantic similarity remains a human-review concern.

## Slice 2.6C Deterministic Role Resume Rendering And Export

Role Resume Rendering converts one current approved structured Role Resume Draft into faithful Markdown, self-contained HTML, DOCX, and PDF artifacts. The renderer is a compiler-style boundary: it controls hierarchy, layout, pagination rules, and format packaging, but it never rewrites approved wording or calls a model.

The explicit rendering policy is `role-resume-rendering-policy` version `1`. Composition first creates one canonical JSON render document, then every format is generated from that same document:

```text
Current approved Role Resume Draft
-> canonical render document and source map
-> Markdown / HTML / DOCX / PDF
-> format validation and export manifest
```

Compose and inspect the canonical document:

```bash
npm run dev -- target resume-render compose role-engineering-manager
npm run dev -- target resume-render compose role-engineering-manager \
  --profile compact-professional \
  --page-size LETTER \
  --date-format exact-source
npm run dev -- target resume-render compose-show role-engineering-manager
npm run dev -- target resume-render compose-status role-engineering-manager
```

Supported render profiles are `ats-standard` and `compact-professional`. Both use a one-column layout, a minimum 10-point base font, semantic headings and lists, no core-content tables, no decorative icons, and deterministic spacing. Supported page sizes are `A4` and `LETTER`. The `MMM-YYYY`, `YYYY`, and `exact-source` date options are versioned render inputs, but approved dates currently remain embedded in reviewed item text. The renderer records that ambiguity and never infers or reformats a date.

Export one format or all formats:

```bash
npm run dev -- target resume-render export role-engineering-manager --format markdown
npm run dev -- target resume-render export role-engineering-manager --format html
npm run dev -- target resume-render export role-engineering-manager --format docx
npm run dev -- target resume-render export role-engineering-manager --format pdf
npm run dev -- target resume-render export-all role-engineering-manager
npm run dev -- target resume-render export-list role-engineering-manager
npm run dev -- target resume-render export-show <export-id>
npm run dev -- target resume-render export-status <export-id>
npm run dev -- target resume-render validate <export-id>
```

An optional `--output-dir <path>` creates a normalized relative subdirectory under the target's export root. Absolute paths, traversal, empty path segments, and uncontrolled replacement of unrelated files are rejected. `--rebuild` is required to replace stale or invalid canonical or export artifacts.

Default local binary renderers are:

- Markdown: ProofLayer's deterministic plain-text renderer.
- HTML: a self-contained semantic document with inline CSS and no scripts or remote styles.
- DOCX: Pandoc, followed by deterministic page settings, metadata cleanup, relationship checks, macro rejection, and normalized ZIP timestamps where local tooling permits.
- PDF: LibreOffice from a normalized DOCX intermediate produced from the same canonical Markdown, with extracted-text, page-count, and selected page-size verification.

Pandoc is required for DOCX and the PDF intermediate; LibreOffice is required for PDF conversion. PDF page geometry is verified directly from the persisted PDF page dictionary. Missing tools fail clearly; `export-all` reports unsupported failures without claiming complete success. DOCX and PDF binary bytes may vary across tool versions and platforms even when canonical IDs, visible content, provenance, and extracted-text hashes are stable. ProofLayer therefore records binary determinism as a format limitation rather than making an unsupported reproducibility claim.

Artifacts live under:

```text
workspace/targets/roles/<target-id>/resume-rendering/
  canonical/
    role-resume-render-document.json
    render-document-manifest.json
  exports/
    <export-id>/
      role-resume-<role>-<profile>-<format>.<ext>
      source-map.json
      export-manifest.json
```

The canonical document preserves approved section and item order, exact visible item text, trust state, and narrow statement-level provenance. Deterministic heading labels are the only added visible structure. Source maps bind every visible block to its approved draft item, expectations, assessment, approved matches, evidence, claim boundaries, exact statement hash, and approved-draft hash. Internal IDs, hashes, local paths, and provenance never appear in visible resume content.

Canonical IDs derive from approved-draft and manifest hashes, policy and composition-rule versions, profile name/version, page size, date format, and normalized options. Export IDs additionally bind the canonical document hash, output format, renderer version, and normalized output directory. Unchanged composition or export returns `already-current` without changing IDs, timestamps, hashes, or files. Changed dependencies or options become `stale`; malformed or hash-mismatched artifacts become `invalid`; stale or invalid replacement requires explicit `--rebuild`.

Validation checks non-empty output, format structure, canonical visible-text equivalence, section order, first/last markers, source-map integrity, selected PDF page size, extractable DOCX/PDF text, and privacy boundaries. Long unbroken tokens and multi-page PDF output produce warnings rather than silent content changes. The renderer does not shrink fonts below profile limits, remove content to meet a page count, claim formal accessibility certification, guess candidate identity or contact data, add links, generate ATS scores, calculate hiring probability, or make application recommendations.

Role Targets remain the only supported input. Job Targets and Job Descriptions are rejected. Slice 2.6C consumes only a current, complete, provenance-bearing approved Role Resume Draft and does not mutate the target, evidence, interpretation, matching, assessment, plan, draft, prior resumes, or exports.

## Slice 2.7A Deterministic Job Requirement Modeling

Job Requirement Modeling describes what one preserved vacancy asks for. It consumes only a current Job Target, the exact persisted `job-description.md`, and its current structural target analysis. Role Targets are rejected. The workflow never loads candidate evidence, claims, career profiles, matching, assessments, resumes, or exports.

Build and inspect the deterministic model:

```bash
npm run dev -- target job-requirements build job-exampleco-engineering-manager
npm run dev -- target job-requirements show job-exampleco-engineering-manager
npm run dev -- target job-requirements status job-exampleco-engineering-manager
npm run dev -- target job-requirements build job-exampleco-engineering-manager --rebuild
```

The deterministic policy is `job-requirement-modeling-policy` version `2`. It consumes section-aware semantic items and applies only explicit, documented cues:

- Required sections and phrases such as `must have`, `required`, `minimum of`, and `at least` produce `mandatory`.
- Preferred sections and phrases such as `preferred`, `nice to have`, and `bonus` produce `preferred`.
- Responsibilities and explicit role-context sections produce `contextual`.
- A preference modifier explicitly attached to a required statement remains related to that statement but is modeled as preferred. For example, a mandatory CRM requirement may retain an attached `Salesforce is strongly preferred` technology preference.
- Benefits do not become candidate capability requirements. Explicit work-mode, location, travel, or attendance constraints within a Benefits section may remain contextual constraints.
- Statements without a reliable cue remain `ambiguous`; vague wording is never silently hardened.
- Explicit patterns identify experience/seniority, languages, location/travel/visa/work mode, screening, technical expectations, named technologies, domains, leadership, operating context, and stated metrics or scale.
- Unknown statements remain `unknown` and receive auditable ambiguities, risks, and warnings.

Every requirement has a stable content-derived ID, category, normalized label, exact semantic-block source text, necessity, confidence, explicitness, relationships, named technologies, keywords, and source provenance. Identity binds normalized meaning to its semantic source block and target rather than treating each physical line as a requirement. Provenance retains the structural analysis item, parent-scoped section, exact 1-based inclusive line range, byte offsets, full-source SHA-256, and excerpt SHA-256 from the immutable persisted Job Description.

Artifacts are separate from the Job Target and Job Description:

```text
workspace/targets/jobs/<target-id>/requirements/
  deterministic/
    job-requirement-model.json
    job-requirement-model-manifest.json
  proposals/<proposal-id>/
    proposal.json
    proposal-manifest.json
    raw-model-response.txt
  reviews/<proposal-id>/
    review.json
    review-manifest.json
  approved/
    approved-job-requirement-model.json
    approved-job-requirement-manifest.json
```

The deterministic manifest pins the exact target, Job Description, structural analysis, structural-analysis manifest, normalized input, and policy hashes. Status is `missing`, `current`, `stale`, or `invalid`. An unchanged current build is not rewritten and preserves IDs, hashes, timestamps, and bytes. Changed dependencies or policy make the model stale; malformed artifacts, incomplete pairs, identity disagreement, or hash mismatch make it invalid. Stale or invalid deterministic or approved artifacts are never silently replaced; use `--rebuild` only after review.

### Optional Requirement Proposals

The optional model path reuses ProofLayer's provider abstraction:

```bash
npm run dev -- target job-requirements-proposal generate job-exampleco-engineering-manager
npm run dev -- target job-requirements-proposal list job-exampleco-engineering-manager
npm run dev -- target job-requirements-proposal show <proposal-id>
npm run dev -- target job-requirements-proposal status <proposal-id>
npm run dev -- target job-requirements-proposal replay <proposal-id>
```

The prompt is `target-job-requirement-model-proposal` version `1`. It receives only the deterministic Job Requirement Model and its Job Description provenance. It cannot access candidate evidence, assess a candidate, calculate fit, write resume/application content, or approve itself. A proposal must cite known deterministic requirements and structural analysis items, preserve exact source text and source references, and pass schema and provenance validation. Raw model responses are stored and hashed separately. Identical current requests use a no-call cache; replay revalidates the exact stored response without a model call.

### Human Review And Approval

Review covers both deterministic and proposed requirements:

```bash
npm run dev -- target job-requirements-proposal review <proposal-id> --reviewer "Reviewer Name"
npm run dev -- target job-requirements-proposal review-show <proposal-id>
npm run dev -- target job-requirements-proposal review-status <proposal-id>
npm run dev -- target job-requirements-proposal review-set <proposal-id> <requirement-id> --accept
npm run dev -- target job-requirements-proposal review-set <proposal-id> <requirement-id> --reject
npm run dev -- target job-requirements-proposal review-set <proposal-id> <requirement-id> --edit-file reviewed-requirement.json
npm run dev -- target job-requirements-proposal review-complete <proposal-id>
npm run dev -- target job-requirements approve job-exampleco-engineering-manager --proposal <proposal-id>
npm run dev -- target job-requirements approved-show job-exampleco-engineering-manager
npm run dev -- target job-requirements approved-status job-exampleco-engineering-manager
```

Every deterministic and proposed requirement must receive one `accept`, `edit`, or `reject` decision. Human edits may correct normalized wording, category, necessity, confidence, explicitness, relationships, keywords, and notes, but cannot change source text or provenance and cannot add unsupported named technologies or candidate/application language. Approval is deterministic and makes no provider call. Accepted and edited requirements become `human-approved` or `human-edited`; rejected and pending items are excluded.

Slice 2.7A models the job only. It does not perform requirement-to-evidence matching, candidate fit assessment, strengths/weaknesses/gaps analysis, confidence or hiring-probability scoring, resume planning or drafting, cover letters, screening answers, ATS optimization, or application recommendations.

## Slice 2.7B Deterministic Job Evidence Mapping

Job Evidence Mapping answers one narrow question: which approved evidence explicitly supports each requirement in a usable Job Requirement Model? It does not decide whether the candidate is a good fit, whether they should apply, or how a resume should change.

Build and inspect the deterministic map:

```bash
npm run dev -- target job-matching build job-exampleco-engineering-manager
npm run dev -- target job-matching show job-exampleco-engineering-manager
npm run dev -- target job-matching status job-exampleco-engineering-manager
npm run dev -- target job-matching build job-exampleco-engineering-manager --rebuild
```

A complete, current deterministic Job Requirement Model is the default input. A complete, current human-reviewed model is an equivalent optional input:

```bash
npm run dev -- target job-matching build job-exampleco-engineering-manager --requirements-source approved
```

Role Targets, stale or invalid requirement models, incomplete models, and models with unresolved high-severity ambiguity or contradiction are rejected. The candidate side accepts only evidence connected to claims that are all of:

- globally approved;
- `resume_ready`;
- public-safe;
- not awaiting confirmation;
- backed by active public non-Job-Description sources;
- free of evidence privacy flags.

Draft, proposed, rejected, blocked, private, unknown, inactive, and non-resume-ready material is excluded.

The mapper is `job-evidence-mapper` version `1` under `job-evidence-mapping-policy` version `1`. It creates links only from explicit reviewed signals:

- exact requirement wording present in approved claim wording or its linked reviewed evidence summary;
- exact named-technology overlap;
- exact reviewed domain overlap;
- exact deterministic requirement-keyword overlap.

It does not infer skills, experience, achievements, seniority, or semantic similarity. A link relationship is only `direct`, `supporting`, or `partial`. Evidence strength projects the existing evidence confidence (`high`, `medium`, or `low`) into `strong`, `medium`, or `weak`; link confidence is capped by relationship type and the existing evidence and factual-claim confidence. Ordering uses those reviewed metadata values followed by stable IDs, not a numeric ranking score. Requirements with no explicit link are marked `unsupported`.

The persisted artifact exists because the later job fit/proof assessment needs a reproducible, provenance-bearing requirement-to-evidence boundary. Keeping it only in memory would prevent downstream lifecycle checks, stable replay, and auditable dependency validation. No proposal, review, approval, or model-provider artifact is introduced in this slice.

```text
workspace/targets/jobs/<target-id>/matching/
  deterministic/
    job-evidence-map.json
    job-evidence-map-manifest.json
```

Every link has stable requirement, evidence, and claim IDs; relationship, evidence strength, and link confidence; the exact matched signals; Job Description source references; hashes for the requirement, evidence item, claim, and public source lineage. The manifest pins the Job Target, immutable Job Description, selected requirement model and manifest, source registry, evidence items, claims, eligible evidence set, normalized input, mapper, and policy.

Status is `missing`, `current`, `stale`, or `invalid`. An unchanged build returns `already-current` without rewriting bytes or timestamps. Changed requirement, evidence, claim, source, policy, or mapper dependencies make the map stale. Malformed artifacts, hash mismatches, duplicate identities, broken coverage, or ineligible stored links make it invalid. Stale or invalid maps require explicit `--rebuild`.

Slice 2.7B makes no model call and creates no aggregate confidence, fit, coverage percentage, hiring, ATS, competitiveness, recommendation, resume, or application output. Job Descriptions remain target inputs, never candidate evidence.

## Slice 2.7C Deterministic Job Requirement Coverage

Job Requirement Coverage answers one question for every modeled requirement: how completely is it supported by the links already present in the current Job Evidence Map? It never searches the evidence store, creates new links, calculates fit, recommends an application, or changes resume content.

Build and inspect deterministic coverage:

```bash
npm run dev -- target job-coverage build job-exampleco-engineering-manager
npm run dev -- target job-coverage show job-exampleco-engineering-manager
npm run dev -- target job-coverage status job-exampleco-engineering-manager
npm run dev -- target job-coverage build job-exampleco-engineering-manager --rebuild
```

The analyzer is `job-requirement-coverage` version `1` under `job-requirement-coverage-policy` version `1`. It consumes only a current usable Job Requirement Model and a current Job Evidence Map. Role Targets, missing maps, stale or invalid dependencies, broken hashes, incomplete requirement coverage, and broken requirement or link provenance are rejected.

Each requirement receives exactly one controlled state:

- `supported`: at least one direct link has sufficient existing reviewed evidence strength and link confidence.
- `partially-supported`: stored links are only partial/supporting, or explicit compound components are not all supported.
- `unsupported`: the current map contains no evidence links for an unambiguous requirement.
- `contradicted`: reserved for an explicit approved contradiction relationship in the evidence map; absence is never treated as contradiction.
- `indeterminate`: unresolved requirement ambiguity, weak direct support, or insufficient map detail prevents a defensible classification.

Evidence quality uses only the existing relationship, reviewed evidence strength, and link-confidence metadata. The labels `strong`, `adequate`, `limited`, `mixed`, and `unavailable` describe support quality, not candidate quality or hiring likelihood. Multiple weak links are never upgraded into strong direct support. Explicit compound requirements retain only the minimal component detail needed to explain partial support; no separate component artifact is created.

```text
workspace/targets/jobs/<target-id>/coverage/
  deterministic/
    job-requirement-coverage.json
    job-requirement-coverage-manifest.json
```

Coverage records preserve the requirement ID, category, necessity, mapped link IDs, link counts, evidence quality, exact Job Description provenance, hashes for the source requirement and evidence-map entries, concrete ambiguities, and controlled warnings. The manifest pins the target, Job Description, selected requirement model and manifest, evidence map and manifest, normalized input, analyzer, and policy.

Status is `missing`, `current`, `stale`, or `invalid`. An unchanged build returns `already-current` without rewriting IDs, hashes, bytes, timestamps, or modification times. Requirement-model, evidence-map, dependency-manifest, analyzer, policy, or normalized-input changes make coverage stale. Malformed artifacts, hash disagreement, duplicate identities, or broken map provenance make it invalid. Stale or invalid coverage requires explicit `--rebuild`, and stale or invalid upstream artifacts must be repaired first.

The persistent coverage artifact exists for the later Job Fit Assessment consumer and independent provenance/lifecycle validation. Slice 2.7C creates no aggregate coverage, percentages, fit or ATS scores, strengths/weaknesses, gap priorities, application recommendations, resume plans, drafts, or application content. It makes no model call and performs no evidence rematching.

## Slice 2.7D Deterministic Job Fit and Proof Assessment

Job Fit and Proof Assessment converts current requirement coverage into a bounded qualitative assessment. It consumes only the current Job Requirement Model, Job Evidence Map, Job Requirement Coverage, and their stored provenance. It never searches or rematches evidence, reinterprets the Job Description, calculates a numeric score, predicts hiring outcomes, recommends whether to apply, or creates application content.

Build and inspect the deterministic assessment:

```bash
npm run dev -- target job-assessment build job-exampleco-engineering-manager
npm run dev -- target job-assessment show job-exampleco-engineering-manager
npm run dev -- target job-assessment status job-exampleco-engineering-manager
npm run dev -- target job-assessment build job-exampleco-engineering-manager --rebuild
```

The analyzer is `job-fit-proof-assessment` version `1` under `job-fit-proof-assessment-policy` version `1`. Each requirement receives exactly one assessment state:

- `strength`: strong direct reviewed proof is present.
- `supported`: defensible reviewed proof is present.
- `partial`: current proof is partial or indirect.
- `gap`: current reviewed evidence does not provide proof; this does not establish absence of capability.
- `contradiction`: an explicit approved contradiction is present.
- `indeterminate`: current coverage or requirement ambiguity prevents a defensible conclusion.

Proof strength is separately labeled `strong`, `adequate`, `limited`, `unavailable`, or `conflicting`. Materiality is derived only from explicit requirement necessity and controlled assessment state: `critical`, `material`, `secondary`, `contextual`, or `unknown`. Gap types remain controlled and category-aware, including missing or partial proof, technology, domain, leadership, experience, language, location/work constraints, education/certification, contradiction, and ambiguity. Scope, depth, and recency gaps are emitted only when the upstream coverage explicitly identifies those limits.

The overall result is one of `strong`, `credible`, `mixed`, `limited`, `insufficient`, or `indeterminate`. These are qualitative policy states, not percentages, weighted scores, ATS scores, application recommendations, or hiring probabilities. Machine-readable risks, warnings, ambiguities, and exact requirement/coverage/evidence-map provenance explain the boundary of each result.

```text
workspace/targets/jobs/<target-id>/assessment/
  deterministic/
    job-fit-proof-assessment.json
    job-fit-proof-assessment-manifest.json
```

The manifest pins the Job Target, immutable Job Description, selected requirement model and manifest, evidence map and manifest, coverage and manifest, normalized input, analyzer, and policy. Status is `missing`, `current`, `stale`, or `invalid`. An unchanged build returns `already-current` without rewriting bytes, IDs, hashes, timestamps, or modification times. Dependency changes make the assessment stale; malformed artifacts, hash disagreement, identity mismatch, or deterministic semantic drift make it invalid. Stale or invalid assessments require explicit `--rebuild`, and non-current upstream coverage must be repaired first.

Slice 2.7D creates one primary assessment artifact and its manifest. It introduces no model provider, proposal, review, approval, resume plan, draft, export, screening answer, or application recommendation.

## Slice 2.7E Deterministic Job-Specific Resume Content Planning

Job-specific Resume Content Planning converts one current Job Fit and Proof Assessment into a constrained plan for later Job-specific Draft Construction. It consumes only the current requirement model, evidence map, coverage, assessment, and the approved public-safe resume-ready evidence and claims already referenced by those artifacts. It does not reinterpret the Job Description, search or rematch evidence, recalculate fit, or write resume prose.

Build and inspect the deterministic plan:

```bash
npm run dev -- target job-resume-plan build job-exampleco-engineering-manager
npm run dev -- target job-resume-plan show job-exampleco-engineering-manager
npm run dev -- target job-resume-plan status job-exampleco-engineering-manager
npm run dev -- target job-resume-plan build job-exampleco-engineering-manager --rebuild
```

The policy is `job-resume-content-planning-policy` version `1`. The plan records controlled job-specific positioning (`direct`, `adjacent`, `stretch`, `insufficient-proof`, or `indeterminate`), one emphasis decision per requirement, deduplicated evidence allocation, section ordering, enforceable claim boundaries, exact verified-metric permissions, gap handling, exclusions, risks, warnings, ambiguities, completeness, and drafting usability. These are planning controls, not headline, summary, bullet, experience, project, cover-letter, screening-answer, or recruiter-message text.

Mandatory supported requirements are normally primary. Preferred supported requirements are secondary, contextual support remains supporting, partial proof is qualified, unsupported or indeterminate requirements are deferred or excluded, and contradictions are excluded. Evidence is selected only from existing Job Evidence Map links. One evidence item receives one selection record and at most one primary requirement use; reuse is retained only with distinct purposes and a warning. Exact Job Description terminology is permitted only where an existing mapped signal and approved evidence support the same concept.

The Job Target title is positioning metadata only. It cannot become employment history, seniority proof, authority proof, or scope proof. Project evidence remains in project-scoped sections unless reviewed evidence explicitly establishes an employment relationship. Responsibilities cannot become achievements, contributions cannot become ownership, collaboration cannot become management, and adjacent technologies or domains cannot become exact experience.

Quantification is allowed only for an approved public-safe resume-ready claim whose metric status is `verified_metric`; the exact approved wording and scope are pinned. Every other selected claim has an explicit quantification prohibition. Material gaps remain constraints rather than positive positioning or candidate criticism. A mixed or limited assessment may still produce a complete usable plan when selected proof and all critical boundaries are defensible. Insufficient or indeterminate positioning is not usable for drafting.

```text
workspace/targets/jobs/<target-id>/resume-planning/
  deterministic/
    job-resume-content-plan.json
    job-resume-content-plan-manifest.json
```

The manifest pins every upstream artifact and manifest, the selected reviewed evidence and claim sets, normalized input, and policy. Status is `missing`, `current`, `stale`, or `invalid`. Unchanged builds return `already-current` without rewriting bytes, hashes, IDs, timestamps, or modification times. Dependency or policy changes make the plan stale; malformed artifacts, hash disagreement, identity mismatch, or deterministic semantic drift make it invalid. Stale or invalid plans require explicit `--rebuild`, and non-current upstream dependencies must be repaired first.

Slice 2.7E creates one primary planning artifact and its manifest. It makes no model call, performs no evidence rematching or assessment recalculation, writes no resume prose, and produces no application recommendation, ATS score, competitiveness score, or hiring prediction.

## Slice 2.7F Job-Specific Resume Draft Construction

Job-specific Resume Draft Construction treats the current usable Job Resume Content Plan as the sole planning authority. It does not reinterpret the Job Description, rematch evidence, recalculate coverage or assessment, or change requirement emphasis and evidence allocation.

The drafting policy is `job-resume-drafting-policy` version `1`. The model prompt is `target-job-resume-draft-proposal` version `1`. The workflow is:

```text
Current Job Resume Content Plan
  -> deterministic prose-free scaffold
  -> explicit model proposal
  -> strict validation
  -> human review
  -> approved structured Job Resume Draft
```

Build and inspect the deterministic scaffold:

```bash
npm run dev -- target job-resume-draft scaffold-build job-exampleco-engineering-manager
npm run dev -- target job-resume-draft scaffold-show job-exampleco-engineering-manager
npm run dev -- target job-resume-draft scaffold-status job-exampleco-engineering-manager
npm run dev -- target job-resume-draft scaffold-build job-exampleco-engineering-manager --rebuild
```

The scaffold contains no resume prose. It pins section structure, requirement emphasis, selected evidence and claims, claim boundaries, exact verified-metric permissions, qualifiers, exclusions, risks, warnings, ambiguities, provenance, and dependency hashes.

Model drafting is always explicit:

```bash
npm run dev -- target job-resume-draft-proposal generate job-exampleco-engineering-manager
npm run dev -- target job-resume-draft-proposal list job-exampleco-engineering-manager
npm run dev -- target job-resume-draft-proposal show <proposal-id>
npm run dev -- target job-resume-draft-proposal status <proposal-id>
npm run dev -- target job-resume-draft-proposal replay <proposal-id>
```

An unchanged request uses the current cache without a provider call or artifact rewrite. `--refresh` makes an explicit provider call and creates a distinct proposal. Replay uses the exact stored raw response bytes and makes no provider call.

Proposals remain untrusted until every section, statement, claim-ledger entry, ordering decision, and ambiguity is reviewed:

```bash
npm run dev -- target job-resume-draft-proposal review-create <proposal-id> --reviewer "Reviewer Name"
npm run dev -- target job-resume-draft-proposal review-show <review-id>
npm run dev -- target job-resume-draft-proposal review-status <review-id>
npm run dev -- target job-resume-draft-proposal review-set-draft-item <proposal-id> <item-id> --accept
npm run dev -- target job-resume-draft-proposal review-set-draft-item <proposal-id> <item-id> --reject
npm run dev -- target job-resume-draft-proposal review-set-draft-item <proposal-id> <item-id> --edit-file reviewed-item.json
npm run dev -- target job-resume-draft-proposal review-complete <proposal-id>
```

Equivalent `review-set-section`, `review-set-claim-ledger`, `review-set-section-order`, and `review-set-ambiguity` commands use the same `--accept`, `--reject`, or `--edit-file` pattern. Human edits pass the same plan, provenance, claim, metric, scope, title-history, and project/employment checks as model output. A model proposal is never auto-approved.

Approval is deterministic and makes no provider call:

```bash
npm run dev -- target job-resume-draft approve job-exampleco-engineering-manager
npm run dev -- target job-resume-draft approved-show job-exampleco-engineering-manager
npm run dev -- target job-resume-draft approved-status job-exampleco-engineering-manager
```

The approved draft contains structured sections, statement-level provenance, a claim ledger, an evidence-usage ledger, validation results, risks, warnings, ambiguities, completeness, and `usableForRendering`. Each substantive statement traces to the target, plan section, requirements, coverage, assessment, evidence-map links, evidence, claims, boundaries, metrics, proposal, review decision, policy, and dependency hashes.

Only exact plan-authorized `verified_metric` wording may be used. Historical titles, dates, technologies, scope, and project/employment relationships remain bounded by approved evidence. Unsupported Job Description terminology, target-title history, project-as-employment wording, responsibility-as-achievement wording, unverified metrics, unsupported scope, ATS scores, hiring predictions, and application recommendations are rejected or flagged.

```text
workspace/targets/jobs/<target-id>/resume-drafting/
  scaffold/
    job-resume-draft-scaffold.json
    scaffold-manifest.json
  proposals/<proposal-id>/
    proposal.json
    proposal-manifest.json
    raw-model-response.txt
  reviews/<proposal-id>/
    review.json
    review-manifest.json
  approved/
    job-resume-draft.json
    draft-manifest.json
```

Scaffold, proposal, review, and approved draft artifacts expose explicit missing/current/stale/invalid lifecycle behavior as applicable. Dependency changes never silently regenerate approved prose; stale or invalid deterministic artifacts require explicit rebuild or refresh according to their command boundary.

Slice 2.7F ends at the approved structured Job Resume Draft. It does not render Markdown, HTML, DOCX, or PDF, create cover letters or screening answers, calculate ATS or hiring scores, or recommend whether to apply.

## Slice 2.7G Deterministic Job Resume Rendering And Export

Job Resume Rendering consumes only a current, complete approved structured Job Resume Draft with valid ledgers, provenance, dependencies, and `usableForRendering: true`. The `job-resume-rendering-policy` version `1` composes one format-neutral canonical document; Markdown, self-contained HTML, DOCX, and PDF all derive from that same document without rewriting approved text.

Compose and inspect a canonical Job resume:

```bash
npm run dev -- target job-resume-render compose job-exampleco-engineering-manager
npm run dev -- target job-resume-render compose job-exampleco-engineering-manager \
  --profile compact-professional --page-size LETTER --date-format exact-source
npm run dev -- target job-resume-render compose-show job-exampleco-engineering-manager
npm run dev -- target job-resume-render compose-status job-exampleco-engineering-manager
```

Export and validate formats:

```bash
npm run dev -- target job-resume-render export job-exampleco-engineering-manager --format markdown
npm run dev -- target job-resume-render export job-exampleco-engineering-manager --format html
npm run dev -- target job-resume-render export job-exampleco-engineering-manager --format docx
npm run dev -- target job-resume-render export job-exampleco-engineering-manager --format pdf
npm run dev -- target job-resume-render export-all job-exampleco-engineering-manager
npm run dev -- target job-resume-render export-list job-exampleco-engineering-manager
npm run dev -- target job-resume-render export-show <export-id>
npm run dev -- target job-resume-render export-status <export-id>
npm run dev -- target job-resume-render validate <export-id>
```

Profiles are `ats-standard` and `compact-professional`; page sizes are `A4` and `LETTER`. Both are single-column, use at least 10-point text, and avoid tables for core content. `--output-dir` accepts only a safe relative directory below the Job target export root. Stale or invalid canonical documents and exports require explicit `--rebuild`.

```text
workspace/targets/jobs/<target-id>/resume-rendering/
  canonical/
    job-resume-render-document.json
    job-resume-render-document-manifest.json
  exports/<export-id>/
    job-resume-<role>-<profile>-<format>.<ext>
    source-map.json
    export-manifest.json
```

Every visible block maps back to the approved draft statement, Job requirement, coverage record, assessment record, evidence-map link, evidence, claim, claim boundary, and metric permission. Internal IDs and provenance remain in the sidecar source map and never appear in the visible resume. Unchanged composition and export reruns preserve IDs, hashes, bytes, timestamps, and modification times.

Markdown and HTML are byte-deterministic. DOCX package metadata is normalized where the local Pandoc/ZIP toolchain permits, and extracted-text fidelity is enforced. PDF uses the existing local LibreOffice adapter; if conversion is unavailable or fails, no PDF is registered and `export-all` reports a partial failure while successful formats remain valid.

Rendering makes no model call, does not reinterpret the Job Description, rematch evidence, recalculate coverage or assessment, replan content, or alter approved prose. It introduces no ATS score, hiring prediction, application recommendation, cover letter, or screening answer.

## Next Milestone

The next milestone should validate the completed Job pipeline end to end against a controlled real opportunity fixture before any post-2.7 refactoring or additional application artifact is introduced.

## Architecture

See the [canonical ProofLayer Capability Pipeline architecture](docs/architecture/PIPELINE_ARCHITECTURE.md).

Generated review and report Markdown follows the [Human-Readable Markdown Contract](docs/architecture/HUMAN_READABLE_MARKDOWN_CONTRACT.md): JSON remains canonical, while Markdown is deterministic, derived, read-only, and self-contained for human inspection.

The [Product Vision and Principles](docs/product/PRODUCT_VISION_AND_PRINCIPLES.md) defines the Career Twin projection and the Role and Job user journeys built over the trust engine.

## License

ProofLayer is available under the [MIT License](LICENSE).
