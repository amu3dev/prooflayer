# ProofLayer Next Direction

Date: 2026-07-15

## Executive Decision

ProofLayer should remain the reusable local-first career intelligence engine. It should not absorb the original career-evidence workspace or the personal portfolio project.

The immediate next build should be **Slice 1.3: Living Knowledge Updates and Update Impact Report**.

This slice establishes the product's core loop:

```text
Add or update sources
  -> Refresh the career profile
  -> See exactly what changed
  -> Know which future outputs are affected
```

Claim review remains useful, but it should not become the main user experience. Internal exploration may use plausible, non-blocked evidence with clear warnings. Manual approval should be required at the public/final output boundary, not before a user can explore a role direction or draft.

## 1. The Three-Project Ecosystem

### career-evidence: dogfooding and source workspace

`/Users/ayosry/work/career-evidence` is the original experiment and Ahmed-specific working corpus. It contains:

- GitHub and LinkedIn evidence analysis;
- CV and resume variants;
- clarification and confidentiality decisions;
- market-gap and ATS reviews;
- final recruiter and ATS outputs;
- the evidence-backed workflow write-up;
- manually curated knowledge that helped prove the concept.

This workspace should remain a reference implementation and source corpus. It is not the reusable application and should not become ProofLayer's internal runtime structure. ProofLayer may later import selected safe files from it through normal folder-based imports, but the projects should not be merged or tightly coupled.

### ayosry-portfolio: public publishing layer

`/Users/ayosry/work/ayosry-portfolio` is Ahmed's public Astro website. It owns presentation, layout, visual design, deployment, and public download links.

It should eventually consume publication-ready artifacts produced by ProofLayer, such as:

- `website-content.json`;
- approved resume PDFs;
- role-specific resume variants;
- selected public projects and positioning copy.

The portfolio should never read raw evidence, private notes, LinkedIn exports, or internal claims directly. It should consume a deliberate public export contract.

### prooflayer: reusable career intelligence engine

`/Users/ayosry/work/prooflayer` is the product. It owns the repeatable pipeline from source material to a living career profile and generated opportunity-specific outputs.

ProofLayer should remain:

- local-first;
- deterministic where practical;
- folder-import based in the MVP;
- evidence-aware and privacy-aware;
- independent of Ahmed's particular resume or portfolio structure;
- usable without OAuth, cloud infrastructure, or a database.

The projects should cooperate through explicit files, not shared internal state:

```text
career-evidence or other source folders
  -> ProofLayer import boundary
  -> ProofLayer career profile and generated outputs
  -> ayosry-portfolio public import boundary
```

## 2. Simplified Product Vision

ProofLayer learns a professional's career story from real evidence, maintains that story as sources change, and produces the most relevant version for a role or opportunity.

The user-facing product should feel like this:

1. Add or update career sources.
2. Refresh the career profile.
3. Review what changed and any important warnings.
4. Choose a target role or paste a job description.
5. Generate a relevant resume, application package, or website-content update.
6. Approve public/final outputs before publishing or sending.

Supported knowledge sources should grow incrementally:

- GitHub metadata, summaries, and safe project evidence;
- LinkedIn professional export files;
- old and current CVs;
- Markdown and text notes;
- PDFs and DOCX files;
- project notes;
- recommendations;
- certificates;
- manual corrections and confirmations.

The living career profile should represent:

- roles and dates;
- projects and initiatives;
- responsibilities and supported achievements;
- skills, tools, and domains;
- leadership and product themes;
- source provenance;
- privacy and publication constraints;
- confidence and confirmation state.

The profile is the reusable layer. Resume variants, job packages, and website content are projections of that profile, not separate truths.

## 3. What to Keep From the Current Engine

The current engine has valuable foundations and should not be restarted.

### Source ingestion

Keep recursive folder scanning, source typing, hashing, extracted-text separation, and support for Markdown, text, JSON, CSV, PDF, and DOCX.

### Evidence extraction

Keep structured evidence items with source IDs, categories, normalized summaries, dates, companies, projects, technologies, domains, and parent role/project context.

### Parser hardening

Keep section-aware resume parsing, strict role structures, project grouping, heading/date filtering, certification handling, narrow skill linkage, and deterministic tests.

### Career profile generation

Keep roles, projects, skills, domains, positioning candidates, summary themes, and evidence links as the main normalized knowledge layer.

### Privacy reporting

Keep privacy and visibility checks as safety rails. They should warn and constrain publication without making normal exploration unusable.

### Trust model

Keep extraction confidence, factual confidence, corroboration, approval status, output readiness, parent context, and metric semantics. These are useful internal controls and future scoring inputs.

The trust model should inform decisions quietly. It should not force the user to understand every field before ProofLayer becomes useful.

## 4. What to Simplify

### Hide claim mechanics from the default experience

The default workflow should show a career profile, important changes, and a short warning summary. Detailed claim IDs and trust fields belong in advanced reports and JSON, not the main interaction.

### Separate exploration from publication

ProofLayer needs two practical modes:

- **Draft/exploration mode:** may use plausible, non-blocked evidence and generic-only claims. Every output must carry a warning that it is a draft and identify unresolved claims.
- **Final/public mode:** uses approved, privacy-safe wording or requires explicit confirmation for the claims included in the final artifact.

This prevents the current `0 resume-ready` state from blocking role exploration while preserving a stricter final-output boundary.

### Do not require reviewing every claim upfront

A claim-review command may be added later, but users should review only claims relevant to the output they are about to publish. Reviewing 64 claims before seeing any value is the wrong sequence.

### Prefer a small number of meaningful reports

The primary reports should become:

- career profile;
- update impact / what changed;
- privacy and publication warnings;
- output-specific confirmation checklist when generating a final artifact.

The normalization and trust reports can remain available as diagnostics.

## 5. Living Knowledge Updates

ProofLayer should treat source refreshes as normal product behavior, not one-time imports.

Every refresh should compare the previous successful knowledge state with the new state and explain:

- which sources were added, updated, removed, or could not be read;
- which roles, projects, skills, domains, evidence items, and claims changed;
- which trust or visibility statuses changed;
- which profile themes changed;
- whether previously generated outputs may now be stale;
- which changes need attention before public output.

### LinkedIn updates

Users should replace or add a newer LinkedIn export under the LinkedIn source folder and run refresh. ProofLayer should:

- process only professional files allowed by privacy rules;
- match records by stable professional identity, not import timestamp;
- detect role/date/description additions and corrections;
- avoid treating multiple exports of the same LinkedIn data as independent corroboration;
- report ignored privacy-sensitive files by filename only.

### New GitHub repositories

GitHub evidence should initially arrive as repository metadata or safe summaries rather than requiring OAuth. ProofLayer should:

- detect newly added repository summaries;
- detect meaningful metadata or evidence changes;
- add new project/skill/domain signals without duplicating existing projects;
- retain confidentiality and owner/publication rules;
- distinguish a new source from a renamed or updated repository when possible.

### New project notes

Project notes should enrich an existing project when identifiers or names match, or create a new project candidate when they do not. The impact report should show which project changed and which new claims or open questions resulted.

### New CV versions

CV versions are useful historical sources but are not automatically independent corroboration. Multiple variants derived from the same career history should be grouped as one source family for trust purposes.

The refresh should detect:

- newly stated roles or projects;
- date/title conflicts;
- wording changes that do not alter the underlying fact;
- claims present only in an older CV;
- facts repeated across CV variants without falsely upgrading them to multi-source confidence.

### New certificates

Certificates should upgrade matching education/certification claims when identity and title match. The update report should state which claim gained direct support and whether its output readiness changed.

### New recommendations

Recommendations should add supporting leadership, collaboration, and delivery evidence while remaining generic-only by default. Private names and contact details must not flow into public wording.

### Stable comparison semantics

Current source IDs include file hashes, so an edited file can appear entirely new. Slice 1.3 should compare sources primarily by normalized relative path and type, while using hashes as versions. Evidence and claims should be compared with stable fingerprints based on normalized content plus role/project context, not build timestamps or source-version IDs.

## 6. Proposed Next Implementation Slice

### Options considered

**A. Claim Review & Manual Approval**

Necessary before final publication, but too much friction as the immediate product experience. A full review queue would optimize the trust subsystem before proving the living-profile loop.

**B. Living Knowledge Updates / Update Impact Report**

Recommended now. This turns the current pipeline into a maintainable product loop, makes source changes understandable, and creates the foundation for keeping future CV and website outputs consistent.

**C. Role Variant Generation**

Valuable next, but generation should follow a dependable refresh/change model. Otherwise users cannot tell whether a variant became stale after new evidence arrived.

**D. Job Matching**

Postpone. Match scoring would currently be difficult to trust and would encourage more scoring architecture before the profile update loop is mature.

### Immediate recommendation

Build **Slice 1.3: Living Knowledge Updates and Update Impact Report**.

Why this is the right next slice:

- it directly supports the living-career-profile dream;
- it makes repeated dogfooding practical;
- it prevents silent drift and stale outputs;
- it builds on existing hashes, evidence IDs, snapshots, and changelogs;
- it does not require a dashboard, database, OAuth, or LLM;
- it avoids forcing manual approval of the entire claim set;
- it creates a clean handoff to role-variant generation afterward.

## 7. Minimal Slice 1.3 Requirements

### Commands

```bash
prooflayer refresh
prooflayer changes
prooflayer status
```

- `prooflayer refresh` runs the existing rebuild pipeline, compares the previous successful state to the new state, writes the impact report, and updates the baseline only after success.
- `prooflayer changes` prints a concise summary and the path to the latest update-impact report without rebuilding.
- `prooflayer status` shows source count, last successful refresh, profile hash, unresolved warnings, and whether registered outputs are current or stale.
- Keep `prooflayer rebuild` as a backward-compatible alias for `refresh` during the MVP.

### Files to create

```text
src/change-detector.ts
src/update-impact.ts
src/__tests__/change-detector.test.ts
workspace/kb/update-baseline.json
workspace/outputs/reports/update-impact-report.md
workspace/outputs/changelogs/latest-refresh.json
```

`update-baseline.json` should contain fingerprints and summary metadata only. It must not duplicate raw extracted text or sensitive source content.

`latest-refresh.json` should be machine-readable and include:

- refresh ID and timestamp;
- source changes;
- evidence changes;
- claim changes and trust-status transitions;
- profile changes;
- warnings;
- stale-output indicators.

`update-impact-report.md` should be human-readable and answer:

- What changed?
- Why did the profile change?
- Which role/project/skill areas were affected?
- Did any privacy or trust status change?
- Do any generated outputs need regeneration?
- Is user attention required?

### Comparison rules

- Match sources by normalized path and type; treat hash changes as source updates.
- Match evidence by normalized content, category, and parent role/project context.
- Match claims by normalized claim text and context.
- Distinguish added, removed, changed, and unchanged.
- Report trust transitions separately, such as `needs_confirmation -> approved`.
- Do not count repeated CV variants or repeated exports as independent corroboration merely because files differ.
- Update the baseline only after the complete refresh succeeds.

### Draft versus final policy

Slice 1.3 should document and expose readiness counts but should not generate content yet.

Future generators will use:

- non-blocked claims for drafts, with warnings;
- approved/resume-ready claims for final output by default;
- output-specific confirmation for relevant unresolved claims.

### Do not build yet

- no job-description parsing or match score;
- no resume generator;
- no website-content generator;
- no PDF/DOCX export;
- no dashboard;
- no OAuth or live connectors;
- no cloud sync or database;
- no full-screen claim-review workflow;
- no automatic writes into `career-evidence` or `ayosry-portfolio`.

### Why this stays simple

The user does only three things: update files, run refresh, and read what changed. The internal diff may be detailed, but the default output is one concise impact report and one status summary.

## 8. Future Data Flow

After the update loop is stable, the product can add generation in layers:

```text
Sources
  -> Evidence Items
  -> Claims and Career Profile
  -> Update Impact Report
  -> Role or Job Target
  -> Draft Output Package
  -> Output-Specific Confirmation
  -> Final Public Artifacts
```

Expected future outputs:

```text
workspace/outputs/resumes/<variant>.md
workspace/outputs/resumes/<variant>-ats.md
workspace/outputs/applications/<job-id>/match-report.md
workspace/outputs/applications/<job-id>/resume.md
workspace/outputs/applications/<job-id>/application-package.json
workspace/outputs/website/website-content.json
workspace/outputs/final/<variant>.docx
workspace/outputs/final/<variant>.pdf
```

PDF and DOCX should be export layers over approved Markdown, not independent content-generation paths.

The portfolio integration should eventually be explicit and one-way:

1. ProofLayer generates `website-content.json` and approved resume files.
2. Ahmed reviews the publication package.
3. A separate publish/copy command places approved artifacts into the portfolio's expected import locations.
4. The Astro site renders the public package.

ProofLayer should track the profile/build fingerprint used for each generated artifact so `status` can mark CV or website content stale after a refresh.

## 9. Risks and Guardrails

### Overengineering

Risk: building a generalized graph database, connector platform, workflow engine, or dashboard before proving the CLI loop.

Guardrail: JSON files, stable fingerprints, three commands, one primary impact report.

### Over-conservative trust gate

Risk: zero resume-ready claims makes the product appear unusable.

Guardrail: allow warned draft exploration from non-blocked evidence; enforce approval at final publication, not at the start of discovery.

### Noisy source ingestion

Risk: every file edit looks like a completely new career history.

Guardrail: path/type source identity, content-version hashes, context-aware evidence fingerprints, source-family handling, and concise impact summaries.

### Stale outputs

Risk: resumes and website content silently fall behind the profile.

Guardrail: record the profile fingerprint used to generate each output and surface stale status after every refresh.

### Website and CV drift

Risk: public positioning differs across the portfolio and resume.

Guardrail: both must eventually derive from the same career profile and approved publication package.

### Too many projects without clear boundaries

Risk: the source workspace, product engine, and public site start duplicating each other's responsibilities.

Guardrail:

- career-evidence stores Ahmed-specific dogfood and historical artifacts;
- ProofLayer transforms evidence and generates packages;
- ayosry-portfolio presents approved public content.

No project should reach into another project's private internals.

## 10. Final Recommendation

Build **ProofLayer Slice 1.3: Living Knowledge Updates and Update Impact Report** next.

After Slice 1.3, the likely sequence is:

1. Role Variant Generation in warned draft mode.
2. Output-specific confirmation and lightweight manual approval.
3. Job-description analysis and matching.
4. Final resume/application packages.
5. Website-content generation and explicit portfolio publishing.

### Exact next implementation prompt

```text
You are implementing ProofLayer Slice 1.3: Living Knowledge Updates and Update Impact Report.

Project path:
/Users/ayosry/work/prooflayer

Read first:
- docs/PROOFLAYER_NEXT_DIRECTION.md
- README.md
- workspace/outputs/reports/trust-model-report.md
- workspace/outputs/reports/normalization-quality-report.md
- workspace/outputs/changelogs/rebuild-changelog.md

Goal:
Turn the existing one-time rebuild pipeline into a simple living-career-profile refresh loop.

Keep deterministic and local-first. Do not add job matching, resume generation, website generation, PDF/DOCX export, dashboard UI, OAuth, cloud sync, database storage, or LLM calls.

Implement these commands:
1. prooflayer refresh
   - Run ingest, normalize, claims, profile, and privacy audit.
   - Compare the previous successful knowledge state with the new state.
   - Write a human-readable update impact report and machine-readable latest refresh changelog.
   - Update the baseline only after the complete refresh succeeds.
2. prooflayer changes
   - Print a concise summary of the latest detected changes and the update-impact report path.
3. prooflayer status
   - Show source count, last successful refresh, profile fingerprint, warning counts, trust/readiness counts, and stale-output status.
4. Keep prooflayer rebuild as a backward-compatible alias for refresh.

Create:
- src/change-detector.ts
- src/update-impact.ts
- src/__tests__/change-detector.test.ts
- workspace/kb/update-baseline.json
- workspace/outputs/reports/update-impact-report.md
- workspace/outputs/changelogs/latest-refresh.json

Comparison requirements:
- Match sources by normalized relative path and source type; hashes represent versions.
- Match evidence by stable fingerprints based on normalized text, category, and parent role/project context.
- Match claims by normalized claim text and context.
- Report added, removed, changed, and unchanged sources/evidence/claims.
- Report approval, output-readiness, privacy, role, project, skill, and domain changes.
- Do not treat duplicate CV variants or repeated exports as independent corroboration automatically.
- Do not copy raw extracted text into baselines or reports.
- Do not expose private paths or sensitive source content.
- Mark future registered outputs stale when their stored profile fingerprint differs from the current profile fingerprint; report none registered when no output manifest exists.

The human update-impact report must answer:
- What changed?
- Which career-profile areas changed?
- Which trust/privacy statuses changed?
- Which outputs are stale?
- Is user attention required?

Keep the default experience simple: update source files, run refresh, read what changed.

Add tests for:
- first refresh with no baseline;
- unchanged refresh;
- added source;
- changed source at the same path;
- removed source;
- added/removed/changed evidence and claims;
- trust-status transitions;
- repeated CV versions not counted as independent corroboration;
- baseline updated only after success;
- no raw sensitive text in baseline/report;
- status and changes command summaries.

Update README with Slice 1.3 usage.

After implementation run:
- npm run build
- npm test
- npm run refresh
- npm run changes
- npm run status

Final response only:
- Files changed
- Build status
- Test status
- Refresh status
- Update impact report path
- Latest refresh changelog path
- Source/evidence/claim change counts
- Trust/readiness counts
- Whether any outputs are stale
- Known limitations
- Exact next step
```
