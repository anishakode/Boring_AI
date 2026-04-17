# Codemod comparison — two real 6.x corpora

**Tool:** `packages/web3py-v6-v7` (`workflow.yaml` + JSSG `scripts/codemod.ts`)  
**Flags:** `workflow run … --allow-dirty --no-interactive --allow-fs`  
**Date:** 2026-04-17

---

## Summary table

| Corpus | Repo | Pin / deps | Files changed | Lines (+/−) | Runtime (~) | Role |
|--------|------|------------|---------------|-------------|-------------|------|
| **A — Library** | [ethereum/web3.py](https://github.com/ethereum/web3.py) | tag **v6.20.4** | **52** | **150 / 150** | ~17s | Official **6.x source + tests** — many internal uses of filters, middleware, providers |
| **B — Consumer** | [eth-brownie/brownie](https://github.com/eth-brownie/brownie) | tag **v1.20.0** (`web3==6.15.0` in `requirements.txt`) | **2** | **2 / 2** | ~9s | **Application-style** filters only — **POA factory** left untouched (accuracy fix in codemod **v0.5.1+**) |

---

## How to read “better” results

- **Consumer (Brownie)** shows **small, reviewable diffs** — ideal for a **migration PR** story: few files, easy human verification.
- **Library (web3.py)** shows **broad pattern coverage** — good for proving the codemod **fires on real, high-volume code**, but **not** that the library would pass tests as-is after a single pass (it is still **v6-era** design).

**Neither run implies** “project is fully v7-ready without further edits.”

---

## Corpus B — Brownie (what changed)

| File | Change | Likely v7 intent |
|------|--------|------------------|
| `brownie/network/contract.py` | `create_filter(fromBlock=…, toBlock=…)` → `from_block`, `to_block` | Matches [kwargs snake_case](https://web3py.readthedocs.io/en/stable/migration.html#remaining-camelcase-snake-case-updates) for **method kwargs** (not RPC dict keys). |
| `brownie/network/event.py` | `create_filter(fromBlock=…)` → `from_block` | Same. |
| `brownie/network/middlewares/geth_poa.py` | *(unchanged)* | **v0.5.1+** deliberately **does not** rewrite `geth_poa_middleware` (factory pattern). Migrate POA separately when you adopt v7 class middleware. |

### Verdict on Brownie

- **Strong:** RPC-style **filter kwargs** on `create_filter` — aligned with the guide; **no** incorrect POA symbol renames.  
- **Manual later:** **Geth POA** integration still **v6-style** in Brownie until you implement v7 class-based middleware there.

---

## Corpus A — web3.py (scale)

- **52 files** touched across `web3/`, `tests/`, `ens/`, etc.  
- **150 insertions, 150 deletions** — consistent with **rename-heavy**, line-neutral edits on average.  
- Use **`git diff`** under `Test/real-web3py-v6.20.4` for full detail.

---

## Suggested “best” hackathon narrative

1. **Lead with the consumer** (Brownie): *“3 files, reviewable diff, kwargs migration validated.”*  
2. **Support with the library** (web3.py): *“52 files on upstream 6.20.4 — shows rules fire at scale.”*  
3. **Be explicit** about the **POA middleware** follow-up and any other **rename-without-semantics** edges in `docs/PROJECT_JOURNAL.md` / README **limits**.

---

## Local paths

| Clone | Path |
|-------|------|
| web3.py v6.20.4 | `Test/real-web3py-v6.20.4/` |
| Brownie v1.20.0 | `Test/real-brownie-v1.20.0/` |

**Reset either clone:**

```powershell
git -C "d:\Hackathons\Boring_AI\Test\real-web3py-v6.20.4" reset --hard HEAD
git -C "d:\Hackathons\Boring_AI\Test\real-brownie-v1.20.0" reset --hard HEAD
```
