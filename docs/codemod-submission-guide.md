# Codemod hackathon: submission guide (reference)

This document captures a recommended path for the Boring_AI / hackathon project: **AI + codemods** for real migrations, using **Spec Kit (Speckit)** in this repo and **Codemod.com** for the published package.

**Last aligned with:** Codemod docs (package structure, OSS quickstart, workflow reference, publishing) and web3.py v6→v7 migration guide as linked below.

---

## 1. Mental model: what you are building

### Codemod

A **codemod** transforms source code in a repeatable way. Solid codemods work on the **syntax tree (AST)** when possible, not only raw text, so they avoid breaking strings, comments, or odd formatting.

### Codemod.com package

Per [Package structure](https://docs.codemod.com/package-structure), a package typically includes:

| Piece | Role |
|--------|------|
| `codemod.yaml` | Metadata: name, version, tags, access |
| `workflow.yaml` | Ordered steps: transforms, optional AI step, shell, etc. |
| `scripts/` | JS/TS transforms (**JSSG**) for complex logic |
| `rules/` | **YAML ast-grep** rules for simple, fast, mechanical edits |
| `tests/` | Fixtures (`input` / `expected`) proving behavior |

### Deterministic vs AI

- **Deterministic:** Same input → same output; must not introduce **false positives** (wrong edits). Hackathon scoring penalizes these heavily.
- **AI / manual:** Use for ambiguous refactors, or leave `TODO(...)` markers where the migration guide says “it depends.”

Codemod’s OSS quickstart illustrates this split: [OSS quickstart](https://docs.codemod.com/oss-quickstart).

---

## 2. This repository (Speckit)

This repo contains **Spec Kit / Speckit** scaffolding (`.specify/`, `.cursor/skills/speckit-*`).

The bundled workflow is: **specify → review → plan → review → tasks → implement** (see `.specify/workflows/speckit/workflow.yml`).

**Use it for the migration project:** treat “web3.py v7 mechanical codemod” (or similar) as **one feature**—write `spec.md` → `plan.md` → `tasks.md` → implement—so scope, tests, and “deterministic vs AI” stay explicit.

---

## 3. Recommended submission (default)

### Primary choice: **web3.py v6 → v7**, scoped to **mechanical, safe** changes

**Why:**

- On the hackathon **pre-approved** list.
- Official guide is structured: [Migrating from v6 to v7](https://web3py.readthedocs.io/en/stable/migration.html).
- **Zod 3→4** already has a first-class Codemod story (`npx codemod jssg run zod-3-4` per [Zod 3 to 4 Migration](https://docs.codemod.com/guides/migrations/zod-3-4.md)) and a registry package (`zod-3-4` on [Codemod Registry](https://app.codemod.com/registry))—harder to differentiate as a beginner.

**Why scope matters:**

The web3.py guide mixes:

- **Mechanical** edits (good candidates for **ast-grep YAML** in `rules/`).
- **Semantic** refactors (middleware **functions → classes**, WebSocket construction changes, caching moved to providers, etc.)—risky without tests and careful design.

**Strategy that fits judging:** **Phase 1** = narrow, provable rules + strong fixtures + **zero false positives**. **Phase 2** = AI or manual for the rest. Claim automation % against **patterns that appear in your evaluation repo** and against an explicit checklist derived from the guide—not “every paragraph of the guide on day one.”

### Critical gotcha (example)

The guide notes **kwargs** moving to snake_case in places, but **dict payloads** for JSON-RPC may still need **camelCase** keys. A naive textual or overly broad AST rule can **break** callers. Encode this in the spec as: only transform patterns you can match safely; add fixtures that include **dict literals that must stay camelCase**.

### Tech mapping on Codemod

- For Python-heavy work, prefer **`ast-grep:`** workflow steps with a `config_file` under `rules/` ([Workflow reference — YAML ast-grep](https://docs.codemod.com/workflows/reference)).
- JSSG is the primary path for **TypeScript/JavaScript** deep logic ([JSSG intro](https://docs.codemod.com/jssg/intro)).

---

## 4. Execution checklist

1. **Learn the package loop:** [OSS quickstart](https://docs.codemod.com/oss-quickstart) — `npx codemod init`, validate workflow, run tests, run on a sample tree, then publish.
2. **Registry due diligence:** Search [Codemod Registry](https://app.codemod.com/registry) for duplicates before locking the topic.
3. **Speckit:** Run specify → plan → tasks → implement for one feature directory under `specs/` (per your Speckit skills).
4. **Real repo:** Clone an open-source project that uses web3.py v6 (or a pinned tag); run your codemod; run **their** tests / CI where possible.
5. **Tests:** Every rule deserves `input` / `expected` fixtures under `tests/`.
6. **Publish:** [Publishing Codemods](https://docs.codemod.com/publishing) — `npx codemod login`, `npx codemod publish`.

---

## 5. Plan B (if you prefer TypeScript)

Pick a migration from Codemod’s guides (see [docs index / llms.txt](https://docs.codemod.com/llms.txt)) such as MSW, Nuxt, React, Valibot, etc.

**Requirement:** Confirm **no near-duplicate** in the registry and a clear **novel** angle or ecosystem gap.

---

## 6. Glossary

| Term | Meaning |
|------|---------|
| **AST** | Tree representation of source code |
| **ast-grep** | Pattern matching / rewrite engine; YAML rules = simpler transforms |
| **JSSG** | Codemod’s JS/TS transform layer for harder logic |
| **Fixture** | Paired before/after files that tests run against |
| **False positive** | Incorrect automated edit—avoid at all costs in Phase 1 |

---

## 7. Useful links

- [Codemod — Introduction](https://docs.codemod.com/introduction)
- [Codemod — Package structure](https://docs.codemod.com/package-structure)
- [Codemod — OSS quickstart](https://docs.codemod.com/oss-quickstart)
- [Codemod — Workflow reference](https://docs.codemod.com/workflows/reference)
- [Codemod — Publishing](https://docs.codemod.com/publishing)
- [Codemod Registry](https://app.codemod.com/registry)
- [web3.py — Migration guide (v6 → v7)](https://web3py.readthedocs.io/en/stable/migration.html)

---

## 8. Next decisions (fill in when you start)

- **Comfort:** Python + ast-grep vs TypeScript + JSSG  
- **Timeline:** days available  
- **Evaluation repo:** URL + branch/tag  
- **Phase 1 rule list:** paste the bullet list from your `spec.md` once drafted