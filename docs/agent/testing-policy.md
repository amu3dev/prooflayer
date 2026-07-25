# Testing Policy

Every behavior change requires focused tests for its new rules and a successful full offline regression run before completion.

## Required Test Categories

Apply the categories relevant to the task:

- **Eligibility and input validation:** supported target types, trust states, schemas, paths, required dependencies, and explicit rejection cases.
- **Deterministic behavior:** stable output for equivalent inputs, deterministic ordering, and no timestamp or randomness leakage into content identity.
- **Stable IDs and hashes:** identity inputs, manifest integrity, source hashes, artifact hashes, and migration compatibility.
- **Cache, replay, and unchanged reruns:** cache hits make no unnecessary calls or rewrites; replay uses preserved bytes; unchanged runs preserve IDs and timestamps where promised.
- **Review and approval boundaries:** proposals remain untrusted, decisions are preserved, incomplete or unsafe reviews fail, and approval makes no model call.
- **Provenance completeness:** every approved or visible statement retains the required links to reviewed evidence and upstream artifacts.
- **Lifecycle behavior:** explicit `missing`, `current`, `stale`, and `invalid` handling, including dependency changes and corrupted artifacts.
- **Privacy and path safety:** no secrets, absolute private paths, internal provenance, or unapproved private content reaches visible output.
- **CLI behavior:** success summaries, clear failures, option validation, exit behavior, and backward-compatible commands where required.
- **Regression coverage:** existing targets, evidence, variants, final outputs, exports, and unrelated workflows remain unchanged unless the task explicitly changes them.
- **Full offline execution:** tests use temporary isolated workspaces, fake or file-backed providers, and no network dependency.

## Test Discipline

- Add focused tests for each new rule, rejection path, and lifecycle transition.
- Use real file-writing pipelines in at least one integration test when persistence behavior changes.
- Verify tracked `dist/` output corresponds to source when build artifacts are committed.
- Run the complete test suite after focused tests pass.
- Do not weaken, skip, delete, or rewrite a valid test merely to make a slice pass.
- Do not update snapshots or fixtures without confirming the behavioral change is intended and evidence-safe.
- Report the exact test-file and test counts when available.
