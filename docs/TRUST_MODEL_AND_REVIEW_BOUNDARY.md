# Trust Model and Output Review Boundary

ProofLayer separates evidence extraction, global claim trust, draft exploration, and final-output review. These layers answer different questions and intentionally do not share one approval flag.

## Global Claim Trust

`workspace/kb/claims.json` records what the deterministic pipeline can establish from source evidence without user intervention.

Global approval is deliberately strict. A claim is approved only when it is fact-like, strongly supported, public, privacy-safe, and sufficiently corroborated. Evidence imported from CVs commonly remains `generic_only`; project notes may remain `unknown` or `internal_only`. As a result, a real profile can legitimately contain zero globally approved or `resume_ready` claims.

Zero global approvals does not mean that extraction failed or that the evidence is unusable. It means ProofLayer will not promote source wording to trusted public wording automatically.

## Draft Exploration

Role drafts may use non-blocked evidence with clear warnings. This supports positioning work and internal exploration before every statement has final public wording.

Draft generation does not change global claim approval. Draft-only, generic-only, and needs-confirmation claims remain visible in unresolved-claims reports.

## Output-Specific Review

Output-specific review answers a narrower question: can this claim, with this wording, be used in this role variant?

For the TPM and AI Product variants, each role's `review-decisions.json` can approve, revise, keep draft-only, or exclude each claim in that output's scope. Revised claims require explicit public wording. Finalization still excludes pending, draft-only, excluded, blocked, do-not-use, sensitive, private, and unsupported-metric claims.

A role-specific final candidate can therefore be publication-ready while `claims.json` still reports zero globally approved claims. Publication readiness means all claims used by that specific output passed its explicit review boundary; it does not promote those decisions back into global trust or into another role variant.

The TPM and AI Product review scopes are intentionally separate. A claim approved for the TPM candidate is not automatically approved for the AI Product candidate. New AI Product review files begin with relevant claims as `pending`, allowing a minimal not-ready final candidate without weakening the trust gate.

## Claim Identity and Context

Claim grouping includes normalized text plus normalized parent role/project context. Equivalent parent entities from repeated exports can still group together, while identical wording under genuinely different roles or projects is not treated as one claim. Raw parent evidence IDs are used only when a normalized parent entity is unavailable.

Compatibility approach A is used for legacy IDs:

- A claim with one effective context keeps its existing text-based ID.
- If identical text appears in multiple contexts, one deterministic context retains the legacy ID.
- Additional contexts receive context-based IDs and require their own output review if selected.
- Existing review decisions remain attached to the retained legacy claim rather than being copied automatically across newly separated contexts.

This avoids silently granting an old decision to a different role or project while preserving existing role review workflows whenever no real context collision exists.

## Future Options

ProofLayer may later add manually approved global claims or explicit source-visibility promotion. Those capabilities are not part of the current local output-review workflow.

Until then:

- Use global trust for conservative machine decisions.
- Use draft mode for exploration.
- Use output-specific review for public wording and publication readiness.
- Do not interpret zero global approvals as permission to bypass review.
