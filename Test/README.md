# Test — real 6.x corpora (library + consumer)

## What’s here

| Path | Description |
|------|-------------|
| **`real-web3py-v6.20.4/`** | **[ethereum/web3.py](https://github.com/ethereum/web3.py)** @ **`v6.20.4`** — **library + tests** (stress corpus). |
| **`real-brownie-v1.20.0/`** | **[eth-brownie/brownie](https://github.com/eth-brownie/brownie)** @ **`v1.20.0`** — pins **`web3==6.15.0`** (consumer-style corpus). |

**Comparison write-up:** [`docs/COMPARISON_REPORT.md`](../docs/COMPARISON_REPORT.md)

## Codemod run (already executed once in this workspace)

From `packages/web3py-v6-v7`:

```powershell
npx codemod workflow run `
  -w workflow.yaml `
  -t "d:\Hackathons\Boring_AI\Test\real-web3py-v6.20.4" `
  --allow-dirty `
  --no-interactive `
  --allow-fs
```

**Result:** dozens of `.py` files under `web3/`, `tests/`, `ens/` were modified (see `git diff` inside `real-web3py-v6.20.4`).

**Important:** the tree is **no longer a clean v6.20.4 snapshot** after the run. To discard changes and re-run from scratch:

```powershell
Set-Location "d:\Hackathons\Boring_AI\Test\real-web3py-v6.20.4"
git reset --hard HEAD
git clean -fd   # only if you added untracked files
```

## Honest expectations

Running a **v6→v7-oriented** codemod on **the v6 library’s own source** will **not** produce a buildable v7 library in one shot. Treat this folder as **evaluation / diff review**, not as something to publish as “upgraded web3.py.”

For a **consumer app**, clone that app’s repo into `Test/` instead and point `-t` at it.
