# Project journal — Boring_AI (web3.py v6 → v7)

Chronological log of decisions, commands, and artifacts. Update this file whenever scope or repo structure changes.

---

## 2026-04-17 — Session: cold start

### Goal

Stand up a **hackathon-grade** project: Speckit feature track + **Codemod.com-compatible package** for **web3.py v6 → v7**, optimized for **zero false positives** on deterministic steps first.

### Decisions (why)

| Decision | Rationale |
|----------|-----------|
| Feature directory `specs/001-web3py-v6-v7-codemod` | Speckit `init-options.json` uses **sequential** numbering; first feature is `001`. |
| Codemod package at `packages/web3py-v6-v7/` | Keeps migration tooling separate from Speckit templates; matches common monorepo layout. |
| Hybrid Codemod template (`ast-grep` YAML + optional JSSG) | CLI deprecated bare `ast-grep-yaml` type; hybrid gives **YAML rules** for mechanical edits and **JSSG** for future complex Python AST when needed. |
| Phase 1 rule: `middlewares=` → `middleware=` | Documented in [migration guide](https://web3py.readthedocs.io/en/stable/migration.html#middlewares-middleware); kwargs are **not** JSON-RPC dict keys (camelCase trap applies to dict payloads, not this rename). |
| JSSG `scripts/codemod.ts` starts as **no-op** | Avoids shipping unrelated Python 2→3 transforms; first win is **YAML-only** clarity and tests. |

### Commands run

```powershell
Set-Location "d:\Hackathons\Boring_AI"
npx --yes codemod@latest init packages/web3py-v6-v7 --no-interactive --project-type hybrid --package-manager npm --language python --name web3py-v6-v7 --description "Deterministic web3.py v6 to v7 migration helpers" --author "Boring_AI" --license MIT --force
```

**Note:** `npm` was not on PATH in this environment; run `npm install` inside `packages/web3py-v6-v7` when Node/npm is available before `npx codemod workflow validate`.

### Artifacts created

| Path | Purpose |
|------|---------|
| `docs/PROJECT_JOURNAL.md` | This log |
| `.specify/feature.json` | Points Speckit follow-on commands at the active feature dir |
| `specs/001-web3py-v6-v7-codemod/spec.md` | Feature specification (user stories, FRs, success criteria) |
| `specs/001-web3py-v6-v7-codemod/plan.md` | Technical plan + repo layout |
| `specs/001-web3py-v6-v7-codemod/research.md` | Migration guide → Phase 1/2/3 bucket notes |
| `specs/001-web3py-v6-v7-codemod/quickstart.md` | How to validate, test, and run the codemod package |
| `specs/001-web3py-v6-v7-codemod/tasks.md` | Dependency-ordered implementation tasks |
| `packages/web3py-v6-v7/` | Codemod package (`codemod.yaml`, `workflow.yaml`, `rules/`, `scripts/`) |
| `packages/web3py-v6-v7/tests/fixtures/...` | First fixture pair for the kwarg rename rule |

### Next actions (for you / next session)

1. Install Node + npm (or use devcontainer) and run `npm install` in `packages/web3py-v6-v7`.
2. Run `npx codemod workflow validate -w packages/web3py-v6-v7/workflow.yaml`.
3. Registry due diligence: search [Codemod Registry](https://app.codemod.com/registry) for existing web3.py migrations; adjust positioning if duplicate.
4. Pick **evaluation repo(s)** (real OSS using web3.py v6) and record in `research.md`.
5. Expand `rules/config.yml` **only** with new rules that have **input/expected** fixtures and negative cases (especially **dict literals** with camelCase keys for filter params).

---

## 2026-04-17 — Session: pick up tooling + first green test

### What we did

| Step | Result |
|------|--------|
| `npm install` | Fixed invalid dependency `"codemod:ast-grep"` in `package.json` (runtime builtin, not an npm package). Added `@codemod.com/jssg-types` for authoring. |
| Workflow validate | Passes on current `workflow.yaml`. |
| YAML ast-grep (`rules/config.yml`) | Codemod accepted rule YAML only with **top-level `rule` + `fix`** (not a `rules:` list). **Edits were not persisted** on disk during `workflow run` in this setup; root cause not fully isolated—**Phase 1 rewrites ship as JSSG** instead. |
| JSSG (`scripts/codemod.ts`) | Implemented `middlewares` **identifier** inside **`keyword_argument`** → rename to `middleware` (pattern `middlewares=$VALUE` did not match in JSSG). |
| Tests | Added canonical JSSG layout `tests/middlewares-kwarg/{input,expected}.py`. `npm test` / `npx codemod jssg test -l python ./scripts/codemod.ts ./tests` → **1 passed**. |
| Applying transforms to disk | `workflow run` required **`--allow-fs`** (and **`--no-interactive`**, **`--allow-dirty`** for smooth CLI). Same for `jssg run` with `-t`. |
| Repo hygiene | `tests/workdir/*` gitignored (keep `.gitkeep`); package README aligned with web3 scope. |
| `package.json` scripts | Use **`npx codemod`** so `npm test` / `npm run validate` work without a global Codemod install. |

### Commands that worked (reference)

```powershell
cd packages\web3py-v6-v7
npm install
npm test
npx codemod@latest workflow validate -w workflow.yaml
npx codemod@latest workflow run -w workflow.yaml -t .\tests\workdir --allow-dirty --no-interactive --allow-fs
```

### Next actions

1. T004: Pin evaluation repo(s) in `research.md`.
2. T009: Run `workflow run` (with flags above) on that repo and review diff.
3. Optionally debug Codemod YAML `ast-grep` rewrite-on-disk vs JSSG-only workflow (remove YAML node if redundant).
4. Add next migration rule(s) with new JSSG logic + fixtures (e.g. scoped kwarg renames with dict negatives).

---

## 2026-04-17 — Session: Phase 1 expansion (WebSocket provider rename)

### Changes

| Item | Detail |
|------|--------|
| JSSG | Added global identifier rename `WebsocketProviderV2` → `WebSocketProvider` per [migration guide](https://web3py.readthedocs.io/en/stable/migration.html#websocketprovider). |
| Refactor | `middlewares` kwarg logic extracted to helpers; typings use `SgNode<Python>`. |
| Tests | New `tests/websocket-provider-v2/`, `tests/combined-phase1/`; **`npm test` → 3 passed**. |
| Version | `codemod.yaml` **0.1.0 → 0.2.0**. |
| Research | `research.md` evaluation table: **web3.py upstream** as pattern corpus + pin instructions (no unverified SHA). |

### Next

- Run `workflow run` with `--allow-fs --allow-dirty --no-interactive` on a **pinned 6.x** checkout subtree; log results in journal.
- Next safe rules: narrow `fromBlock`/`toBlock`/`blockHash` **kwargs only** + dict negatives; or middleware **import** symbol pairs with call-site `()` fixes (higher risk).

---

## 2026-04-17 — Session: RPC kwarg snake_case (with dict() guard)

### Changes

| Item | Detail |
|------|--------|
| JSSG | Renames keyword names `fromBlock`→`from_block`, `toBlock`→`to_block`, `blockHash`→`block_hash` on **non-`dict()`** calls. |
| Guard | Skips bare `dict(...)` so `dict(fromBlock=...)` still produces camelCase keys per migration guide. |
| Tests | `rpc-kwargs-snakecase`, `rpc-kwargs-dictctor-only` (negative); **`npm test` → 5 passed**. |
| Version | **0.3.0** (`codemod.yaml` + `package.json`). |

### Follow-ups

- Consider skipping other mapping ctors if FPs show up in evaluation repos (`OrderedDict`, project-specific helpers).
- Middleware function → class + `()` at call sites remains **Phase 2**.

---

## 2026-04-17 — Session: middleware onion class migration (narrow)

### Changes

| Item | Detail |
|------|--------|
| JSSG | For callees containing `middleware_onion.add` or `middleware_onion.inject`, first positional bare identifier in `{pythonic_middleware, name_to_address_middleware, geth_poa_middleware}` → `ClassName()`; then global rename of those three symbols to class names (imports + leftovers). |
| API | Used `argList.children()` (not `namedChildren`) for QuickJS runtime compatibility. |
| Tests | `tests/middleware-onion-class/`; **`npm test` → 6 passed**. |
| Version | **0.4.0**. |

### Limits (documented)

- Variable indirection `m = pythonic_middleware; onion.add(m)` only gets import/global rename on `pythonic_middleware`, not `add(m)` → manual.
- `construct_sign_and_send_raw_middleware` / builders: not handled.

---

## 2026-04-17 — Session: hackathon submission pack (v0.5.0)

### Deliverables

| Artifact | Purpose |
|----------|---------|
| Repo root `README.md` | Judge-facing entry: scope, quick start, AI flag |
| `docs/HACKATHON_SUBMISSION.md` | Full submission checklist, verification, publish, honest scope |
| `docs/evaluation-report.md` | Template to fill after real-repo run |
| `.github/workflows/codemod-ci.yml` | `npm test` + `workflow validate` on Ubuntu |
| `workflow.yaml` | `params.run_ai_step` + optional `ai` node for edge cases |

### Code

- **JSSG:** `construct_sign_and_send_raw_middleware(...)` → `SignAndSendRawMiddlewareBuilder.build(...)`; `middleware_onion.add` → `inject` when outer call is `add`; strip redundant parens from captured inner arg text. **8** fixture tests passing.
- **`codemod.yaml`:** version **0.5.0**, richer **keywords** for registry discovery.

### Remaining before you click “submit”

1. Fill **`docs/evaluation-report.md`** from a real pinned repo run.
2. **`npx codemod publish`** from `packages/web3py-v6-v7/` (after `login`).
3. Registry duplicate check + adjust README positioning if needed.

---

## 2026-04-17 — Session: dual-corpus run + comparison

| Corpus | Result |
|--------|--------|
| **web3.py v6.20.4** | 52 files, 150± lines (after `git reset --hard` + re-run) |
| **Brownie v1.20.0** (web3 6.15) | 3 files, 4± lines |

**Artifact:** `docs/COMPARISON_REPORT.md` — explains consumer vs library interpretation and flags **Brownie `geth_poa_middleware` → `ExtraDataToPOAMiddleware`** as rename-only (v7 class API still needs manual/design follow-up).

**Clones:** `Test/real-web3py-v6.20.4/`, `Test/real-brownie-v1.20.0/`.

---

## 2026-04-17 — Session: rubric alignment + POA accuracy (v0.5.1)

- **Removed** `geth_poa_middleware` from automated onion/rename map — avoids **false positive** on Brownie-style `geth_poa_middleware(make_request, w3)`.
- **New fixture:** `tests/geth-poa-factory-unchanged/` (input === expected).
- **Brownie re-run:** only **`contract.py`** + **`event.py`** (kwargs); **`geth_poa.py` untouched**.
- **Docs:** `docs/HACKATHON_RUBRIC_CHECKLIST.md` maps hackathon themes → repo evidence; **`scripts/verify-submission.ps1`** for local gate.
- **Tests:** **9** passed; package **0.5.1**.

