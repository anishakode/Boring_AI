# Research: web3.py v6 → v7 migration (buckets)

**Source**: [Migrating from v6 to v7](https://web3py.readthedocs.io/en/stable/migration.html)  
**Last reviewed**: 2026-04-17

## Phase 1 — Mechanical (good codemod candidates)

| Topic | Summary | Notes / risk |
|-------|---------|----------------|
| `middlewares` → `middleware` | Provider / Web3 kwargs renamed | **Low risk** for keyword arguments; not the same as dict RPC keys. |
| Selected kwargs camelCase → snake_case | e.g. `fromBlock` → `from_block`, `toBlock` → `to_block`, `blockHash` → `block_hash` | **Shipped in codemod v0.3+** for normal call kwargs; **excludes** bare `dict(...)` ctor (see fixtures). String dict keys `{"fromBlock": ...}` are unaffected. **Residual risk:** other dict-like ctors (`OrderedDict`, wrappers) could still be mis-renamed—extend skips as you find real FPs. |
| Middleware symbol renames | e.g. `name_to_address_middleware` → `ENSNameToAddressMiddleware`; `geth_poa_middleware` → `ExtraDataToPOAMiddleware` | **Automated:** bare `pythonic_middleware` / `name_to_address_middleware` on onion + renames. **`geth_poa_middleware` not automated** (factory pattern — see `geth-poa-factory-unchanged` test). **Also:** `construct_sign_and_send_raw_middleware` → builder + `add`→`inject` when applicable. |
| Removed middleware imports | e.g. `abi_middleware`, cache middleware | Often **requires deletion + behavior change** (provider config); not a dumb delete without analysis. |

## Phase 2 — Structural (tests + design required)

| Topic | Summary |
|-------|---------|
| WebSocket | `WebsocketProviderV2` → `WebSocketProvider`; `persistent_websocket` usage; `.ws` → `.socket` |
| Class-based middleware | Function middleware → classes; `construct_*` → `*Builder.build()`; `inject` vs `add` |
| Exception mapping | stdlib exceptions → `Web3*` exceptions | Risk of changing `except ValueError` that catches non-web3 errors in same block |

## Phase 3 — Semantic / manual / AI

| Topic | Summary |
|-------|---------|
| Provider caching / retry | Moved from middleware to provider configuration |
| EthPM removal, Geth namespace removals | May require deleting features or large modules |
| ABI / typing moves to `eth_typing` | Touches types across codebase |

## Evaluation repositories

| Repo | URL | Pin | Notes |
|------|-----|-----|-------|
| **web3.py (upstream corpus)** | https://github.com/ethereum/web3.py | Checkout **last PyPI 6.x** you care about (e.g. install `web3==6.*` and match `git` to that release tag or maintenance branch) | Use as **pattern corpus** (docs, examples, tests that mention `WebsocketProviderV2` / `middlewares=`). Do **not** expect a full-tree run to be migration-complete—review diffs. |
| **This package fixtures** | *(this repo)* | `packages/web3py-v6-v7/tests/*` | Regression suite: `npm test` |

**How to pin upstream locally:** `git clone https://github.com/ethereum/web3.py && cd web3.py && git fetch --tags && git tag -l 'v6*' | sort -V | tail -5` then `git checkout <tag>` before `npx codemod workflow run …` on a **subtree** you choose.

## References

- Internal: `docs/codemod-submission-guide.md`
- Official migration: https://web3py.readthedocs.io/en/stable/migration.html
