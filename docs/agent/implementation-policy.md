# Implementation Policy

This policy applies to all ProofLayer implementation work unless a task explicitly narrows the scope further.

## Before Editing

- Inspect the repository, relevant documentation, current schemas, CLI wiring, tests, and generated artifacts before deciding how to implement a change.
- Verify the requested Git baseline and working-tree state.
- Identify the existing architectural boundary that owns the behavior. Extend it rather than creating a parallel abstraction without a clear need.
- Record or verify protected runtime and finalized artifacts when the task requires proving they remain unchanged.

## Engineering Rules

- Follow existing architecture, naming, module boundaries, error conventions, and persistence layout.
- Prefer deterministic, reproducible behavior. Identical valid inputs should produce identical identities and semantically equivalent artifacts.
- Version schemas, policies, prompts, analyzers, renderers, and other behavior-defining contracts.
- Preserve stable IDs, hashes, manifests, provenance, and lifecycle status unless an explicit migration is part of the task.
- Use atomic persistence for durable state and manifests where partial writes could corrupt a workflow.
- Keep ProofLayer local-first and capable of fully offline deterministic operation.
- Avoid dependencies unless they provide a clear, narrowly scoped benefit that cannot be met safely with existing code.
- Validate paths and keep persisted paths normalized and workspace-relative where established by the architecture.
- Treat `missing`, `current`, `stale`, and `invalid` as distinct lifecycle states.
- Do not silently repair, replace, or accept stale, invalid, corrupted, or dependency-mismatched artifacts. Require an explicit rebuild, refresh, review, or replacement operation.

## Workflow Boundaries

- Keep proposals, reviews, approvals, rendering, and exports as separate persisted stages.
- A proposal is untrusted until reviewed.
- Review records human decisions without mutating the proposal.
- Approval validates review decisions and makes no model call.
- Rendering and export consume approved artifacts and may change presentation, not meaning.
- Preserve immutable inputs and write derived artifacts to their designated versioned locations.

## Complete Changes

When applicable, update all parts of the established implementation surface:

- source modules;
- versioned schemas and policies;
- focused tests and regression coverage;
- CLI commands and help text;
- compiled `dist/` counterparts when intentionally tracked;
- manifests, status reporting, and lifecycle checks;
- concise README usage documentation.

Do not regenerate unrelated runtime artifacts. Keep changes focused on the task.
