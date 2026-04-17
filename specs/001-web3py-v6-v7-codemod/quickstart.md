# Quickstart: `packages/web3py-v6-v7`

## Prerequisites

- **Node.js** + **npm** (install dependencies inside the package directory)
- **Codemod CLI** via `npx` (no global install required)
- On Windows: bash steps in `workflow.yaml` may require **Git Bash** or **WSL**; if shell steps block you, replace them with no-op or PowerShell in a follow-up task (document in `PROJECT_JOURNAL.md`).

## Install

```bash
cd packages/web3py-v6-v7
npm install
npm test   # runs JSSG fixture tests
```

## Validate workflow

```bash
npx codemod@latest workflow validate -w workflow.yaml
```

## Run on a target repo

From `packages/web3py-v6-v7`:

```bash
npx codemod@latest workflow run -w workflow.yaml -t /path/to/python/project --allow-dirty --no-interactive --allow-fs
```

- **`--allow-fs`** — JSSG steps need this to write transformed files in typical CLI runs.
- **`--allow-dirty`** — avoids prompts when the target tree has uncommitted changes.

Use a **git worktree** or copy of an evaluation repo first; review diffs before committing.

## Tests (JSSG)

When JSSG transforms are active, use the Codemod testing flow for `scripts/codemod.ts` (see [JSSG testing](https://docs.codemod.com/jssg/testing)). While JSSG is a no-op, **ast-grep** behavior is validated by running the workflow on `tests/fixtures` manually or via CI you add later.

## Publishing (later)

```bash
npx codemod@latest login
npx codemod@latest publish
```

See [Publishing](https://docs.codemod.com/publishing).
