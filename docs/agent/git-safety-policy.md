# Git Safety Policy

## Before Work

- Verify the repository path, branch, expected baseline SHA, tags at the baseline, remotes, and working-tree state.
- Stop before editing when the baseline differs from the task or when unexpected changes overlap the requested work.
- Respect parallel branches, worktrees, and user changes. Never discard work that you did not create.

## Prohibited Operations

Unless the user explicitly requests and approves them:

- do not reset or clean;
- do not amend, rebase, squash, or rewrite history;
- do not move, delete, or recreate existing tags;
- do not force-push;
- do not create or change remotes;
- do not push.

## Staging And Commits

- Review tracked and untracked changes before staging.
- Inspect the staged diff and stage only files within the verified task scope.
- Never stage runtime `workspace/` content, secrets, environment files, logs, caches, temporary files, or unrelated user files.
- Scan candidate changes for credentials, private keys, tokens, private paths, and accidentally embedded source or evidence data.
- Keep commits focused and use the exact commit message requested by the task.
- Do not amend an existing commit unless explicitly requested.

## Completion Report

Report:

- verified baseline SHA and branch;
- files and diff stat for the completed scope;
- build and full-test results;
- commit SHA and parent when a commit was requested;
- final working-tree status;
- tag and remote status when relevant;
- whether anything was pushed.
