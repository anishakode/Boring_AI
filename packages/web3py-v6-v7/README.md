# web3py-v6-v7

Codemod workflow for **mechanical** [web3.py v6 → v7](https://web3py.readthedocs.io/en/stable/migration.html) updates. Deterministic edits are in **`scripts/codemod.ts` (JSSG)** with fixture tests. Optional **AI** step is in `workflow.yaml` (`run_ai_step=true`).

**Hackathon / submission:** see repo root [`docs/HACKATHON_SUBMISSION.md`](../../docs/HACKATHON_SUBMISSION.md).

## Automated patterns (fixture-tested)

1. Keyword argument `middlewares=` → `middleware=`.
2. Identifier `WebsocketProviderV2` → `WebSocketProvider`.
3. RPC kwargs `fromBlock` / `toBlock` / `blockHash` → snake_case — **except** bare `dict(...)`.
4. **Middleware onion:** first positional bare id `pythonic_middleware` / `name_to_address_middleware` → `ClassName()`; imports/refs renamed. **`geth_poa_middleware` excluded** (often a **factory** `geth_poa_middleware(make_request, w3)` — see fixture `geth-poa-factory-unchanged`).
5. **`construct_sign_and_send_raw_middleware`** → `SignAndSendRawMiddlewareBuilder.build(...)`; `middleware_onion.add(...)` → `inject(..., layer=0)` when applicable.

**Limits:** variable indirection (`m = pythonic_middleware; onion.add(m)`), other `construct_*` builders, `.ws`→`.socket`, broad exception remaps — not covered unless you extend with new tests.

## Prerequisites

- Node.js + npm

## Development

```bash
npm install
npm test
npx codemod workflow validate -w workflow.yaml
```

## Run on a codebase

```bash
npx codemod workflow run -w workflow.yaml -t /path/to/repo --allow-dirty --no-interactive --allow-fs
```

Optional AI (requires provider key when enabled):

```bash
npx codemod workflow run -w workflow.yaml -t /path/to/repo --allow-dirty --no-interactive --allow-fs --param run_ai_step=true
```

## Tests

Nine cases under `tests/*` (`input.py` / `expected.py` per case). Run `npm test`.

## License

MIT
