# Hackathon submission — Boring_AI / web3.py v6 → v7

**Codemod package:** `packages/web3py-v6-v7/`  
**Registry name (manifest):** `web3py-v6-v7` (current package version **0.5.1**)

**Rubric self-check:** [`docs/HACKATHON_RUBRIC_CHECKLIST.md`](HACKATHON_RUBRIC_CHECKLIST.md)  
**Pre-approved migration:** [Migrating from v6 to v7](https://web3py.readthedocs.io/en/stable/migration.html)

---

## 1. What this submission is

A **production-style Codemod workflow** that combines:

- **Deterministic JSSG (TypeScript)** transforms with **fixture tests** (`npm test`).
- An optional **AI step** in `workflow.yaml` for edge cases (gated by `run_ai_step=true`).
- **Speckit** artifacts (`spec.md`, `plan.md`, `tasks.md`) for scope and traceability.

**Design principle:** **zero false positives** on included deterministic rules beats maximizing raw coverage.

---

## 2. Automated patterns (current)

Implemented in `packages/web3py-v6-v7/scripts/codemod.ts` — each group has tests under `packages/web3py-v6-v7/tests/`:

| Pattern | Notes |
|---------|--------|
| `middlewares=` → `middleware=` | Provider / `Web3` kwargs |
| `WebsocketProviderV2` → `WebSocketProvider` | Identifiers |
| `fromBlock` / `toBlock` / `blockHash` kwargs → snake_case | **Excludes** bare `dict(...)` (RPC dict keys stay camelCase) |
| `middleware_onion.add` / `inject` + bare `pythonic_middleware`, `name_to_address_middleware` | → `ClassName()` + import/global renames (**`geth_poa_middleware` excluded** — factory pattern; see tests) |
| `add(construct_sign_and_send_raw_middleware(...))` | → `inject(SignAndSendRawMiddlewareBuilder.build(...), layer=0)` |
| `inject(construct_sign_and_send_raw_middleware(...), ...)` | Inner call → `SignAndSendRawMiddlewareBuilder.build(...)` |

**Explicitly out of scope (examples):** broad exception remaps, `.ws` → `.socket`, `persistent_websocket` reshaping, removed EthPM/Geth namespaces, provider retry/caching moves — unless added later with **new fixtures** and evaluation evidence.

---

## 3. How to verify (judges / reproducibility)

```bash
cd packages/web3py-v6-v7
npm install
npm test
npx codemod workflow validate -w workflow.yaml
```

Or from `packages/web3py-v6-v7`: `powershell -File ./scripts/verify-submission.ps1` (or `pwsh` if installed).

CI runs the same checks on push/PR (see `.github/workflows/codemod-ci.yml`).

---

## 4. Run on a real repository

1. Clone a **web3.py 6.x** consumer (or `ethereum/web3.py` at a **6.x tag**) — see `specs/001-web3py-v6-v7-codemod/research.md`.
2. Work on a **branch or copy**.
3. Run:

```bash
npx codemod workflow run -w workflow.yaml -t /path/to/repo --allow-dirty --no-interactive --allow-fs
```

4. Review `git diff`. Record results in **`docs/evaluation-report.md`** (template below).

**Flags:**

- `--allow-fs` — required for writes in typical CLI runs.
- `--allow-dirty` — avoids interactive prompts on dirty trees.

---

## 5. Publishing (registry)

From `packages/web3py-v6-v7/`:

```bash
npx codemod login
npx codemod publish
```

Search the [Codemod Registry](https://app.codemod.com/registry) first for overlapping `web3` migrations and differentiate in README if needed.

---

## 6. Coverage claim (fill in after evaluation)

Do **not** claim “% of entire migration guide.” Use **evidence**:

- **Corpus:** repo URL + **pinned commit** (or tag).
- **Method:** list files or modules transformed; count call sites or patterns matched (manual or scripted).
- **Result:** % of *observed* target patterns automated; list **manual** / **AI** follow-ups.

### Evaluation report template (`docs/evaluation-report.md`)

Copy and fill:

```markdown
# Evaluation report

## Corpus
- Repo:
- Pin (commit / tag):
- Scope (path glob):

## Commands
- `npm test` (pass/fail):
- `workflow validate` (pass/fail):
- `workflow run` flags:

## Outcomes
- Files changed:
- Patterns seen (rough):
- Incorrect edits (FP):
- Missed patterns (FN):

## Notes
- ...
```

---

## 7. Optional AI pass

When patterns are ambiguous, enable:

```bash
LLM_API_KEY=... npx codemod workflow run ... --param run_ai_step=true
```

Without a key, Codemod may emit AI instructions for an external agent (see Codemod workflow docs).

---

## 8. References

- [Codemod OSS quickstart](https://docs.codemod.com/oss-quickstart)
- [Package structure](https://docs.codemod.com/package-structure)
- Internal: `docs/codemod-submission-guide.md`, `docs/PROJECT_JOURNAL.md`
