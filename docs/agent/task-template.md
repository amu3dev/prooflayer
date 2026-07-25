# ProofLayer Task Template

Future task prompts should reference `AGENTS.md` and this policy pack, then describe only slice-specific behavior. A normal slice prompt should usually stay within 50-150 lines.

## Reusable Template

```markdown
# <Slice or task name>

Read `AGENTS.md` and every file under `docs/agent/` before starting.

## Baseline

- Repository: `<absolute repository path>`
- Branch: `<expected branch>`
- HEAD: `<expected SHA>`
- Working tree: `<expected state>`

Stop before editing if the baseline does not match.

## Goal

<One concise paragraph describing the outcome.>

## Required Behavior

- <New or changed behavior>
- <Persistence and lifecycle behavior>
- <CLI or API behavior>
- <Compatibility expectations>

## Boundaries

- <Task-specific non-goals>
- <Protected artifacts or workflows>
- Follow `docs/agent/proof-boundaries.md`.

## Deliverables

- `<source or documentation files>`
- `<schemas or policies>`
- `<tests>`
- `<compiled dist files, CLI wiring, and README when applicable>`

## Verification

- Run `npm run build`.
- Run the full offline test suite with `npm test`.
- Run focused CLI smoke checks.
- Run `git diff --check`.
- Verify protected runtime and finalized artifacts are unchanged.

## Git

- <Commit or no-commit instruction>
- Commit message: `<exact message when requested>`
- Do not push unless explicitly requested.

## Final Report

- Files changed
- Behavior and boundaries verified
- Build and exact test results
- Smoke-check results
- Diff and commit details
- Final working-tree and push status
```

## Compact Example

```markdown
# Slice 2.X: Example Deterministic Lifecycle

Read `AGENTS.md` and all policies under `docs/agent/`.

## Baseline
- Repository: `/path/to/prooflayer`
- Branch: `main`
- HEAD: `<sha>`
- Working tree: clean

## Goal
Add deterministic lifecycle status for the existing example artifact.

## Required Behavior
- Add versioned schema and manifest fields.
- Report `missing`, `current`, `stale`, and `invalid`.
- Preserve stable IDs and unchanged-rerun timestamps.

## Boundaries
- No new model calls or resume content.
- Do not mutate reviewed evidence or existing final exports.

## Deliverables
- Source, focused tests, tracked `dist/`, CLI wiring, and brief README usage.

## Verification
- Build, full offline tests, CLI smoke check, artifact hash inventory, and `git diff --check`.

## Git
- Create one focused commit: `feat: add example lifecycle`
- Do not push.

## Final Report
- Files, tests, hashes, commit, diff stat, final status, and push status.
```
