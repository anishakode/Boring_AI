# Evaluation report

## Corpora (2026-04-17)

### A — Upstream web3.py

- **Repo:** https://github.com/ethereum/web3.py  
- **Pin:** tag **`v6.20.4`**  
- **Local path:** `Test/real-web3py-v6.20.4/`  
- **Scope:** entire checkout  

### B — Brownie (consumer, web3 6.15)

- **Repo:** https://github.com/eth-brownie/brownie  
- **Pin:** tag **`v1.20.0`** (`requirements.txt` → `web3==6.15.0`)  
- **Local path:** `Test/real-brownie-v1.20.0/`  
- **Scope:** entire checkout  

**Side-by-side metrics and caveats:** [`docs/COMPARISON_REPORT.md`](COMPARISON_REPORT.md)

## Commands

```powershell
cd packages\web3py-v6-v7
npx codemod workflow run -w workflow.yaml -t "d:\Hackathons\Boring_AI\Test\real-web3py-v6.20.4" --allow-dirty --no-interactive --allow-fs
```

- **Workflow:** completed (~15s reported for YAML + JSSG steps)

## Outcomes (high level)

- **web3.py v6.20.4:** ~**52** files touched, **150** insertions / **150** deletions (`git diff --shortstat` after a clean workflow run — see [`docs/COMPARISON_REPORT.md`](COMPARISON_REPORT.md)).
- **Brownie v1.20.0 (codemod ≥0.5.1):** **2** files (`brownie/network/contract.py`, `brownie/network/event.py`), **filter kwargs only** — **no** incorrect `geth_poa_middleware` rewrites; `geth_poa.py` unchanged by design.
- **pytest / build:** **not executed** on either corpus after the codemod. Treat diffs as **pattern evidence**, not proof that upstream test suites pass on v7 semantics.

## Automated checks (this workspace, 2026-04-17)

- `packages/web3py-v6-v7`: **`npm test`** — **9** JSSG fixtures, all **passed**.
- **`npx codemod workflow validate -w workflow.yaml`** — **passed** (workflow-only package).

## Follow-ups

- **Review `git diff`** inside each clone for unintended hunks before claiming correctness beyond the fixture-tested rules.
- **Reset clone** when re-testing: `git reset --hard` in the corpus directory (see `Test/README.md`).
- **Optional strong signal:** run the target project’s **pytest** (or Brownie’s test entrypoint) post-codemod and record pass/fail here.

## Patterns seen (high level, from documented runs)

- Library corpus: RPC-style kwargs and middleware/onion call sites are dense in `tests/` and under `web3/` / `ens/`.
- Consumer corpus: only `create_filter(..., fromBlock=…, toBlock=…)`-style kwargs needed changes; POA factory path deliberately excluded from automation.

## Incorrect edits / missed patterns

- **Deliberately not automated:** `geth_poa_middleware` factory-style usage (Brownie and similar) — manual v7 class-middleware migration still required; see [`docs/HACKATHON_SUBMISSION.md`](HACKATHON_SUBMISSION.md) and fixture `geth-poa-factory-unchanged`.
- **Library corpus (web3.py):** a single mechanical pass does **not** imply a buildable v7 library; expect **additional** manual edits for anything outside the codemod’s stated pattern families (exceptions, removed namespaces, provider internals, etc.).
- **No line-by-line audit** of the full web3.py diff is recorded in this report — judges should treat [`docs/COMPARISON_REPORT.md`](COMPARISON_REPORT.md) plus spot-checks as the evidence boundary.
