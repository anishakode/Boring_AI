# Tasks: web3.py v6 → v7 codemod

**Input**: Design documents from `/specs/001-web3py-v6-v7-codemod/`  
**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Required for every new deterministic rule (fixture pair minimum).

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Install Node.js/npm locally and run `npm install` in `packages/web3py-v6-v7`
- [x] T002 Run `npx codemod workflow validate -w packages/web3py-v6-v7/workflow.yaml` and record result in `docs/PROJECT_JOURNAL.md`
- [ ] T003 [P] Confirm Windows strategy for bash `setup.sh` / `transform.sh` / `cleanup.sh` (WSL vs Git Bash vs replace) and document in `research.md` or journal

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Pin **evaluation repo(s)** in `research.md` (URL + commit hash)
- [ ] T005 Run workflow on evaluation repo **dry-run** (copy branch) and capture diff review notes
- [ ] T006 Add CI stub (optional) to run `workflow validate` on push

## Phase 3: User Story 1 — Run codemod (P1) 🎯 MVP

**Goal**: Phase 1 rule `middlewares=` → `middleware=` is correct and fixture-backed.

**Independent Test**: Manual workflow run on `tests/fixtures/middlewares-kwarg/input.py` produces `expected.py` content.

- [ ] T007 [US1] Verify `packages/web3py-v6-v7/rules/config.yml` rule matches only intended kwargs (adjust with `inside` / `kind` if too broad) — **YAML ast-grep apply on disk is unverified**; **production rewrites use JSSG** in `scripts/codemod.ts` (see journal).
- [x] T008 [P] [US1] Add negative fixture: `eth_getLogs`-style dict with camelCase keys remains unchanged in a file that also contains `middlewares=` kwarg (covered in `tests/middlewares-kwarg/`)
- [ ] T009 [US1] Run full workflow on evaluation repo; confirm no false positives; update journal — *instructions added in `research.md`; run still manual*

## Phase 4: User Story 2 — Scope docs (P2)

- [ ] T010 [US2] Keep `spec.md` / `research.md` in sync with each new rule (what’s in / out)
- [ ] T011 [P] [US2] Update `packages/web3py-v6-v7/README.md` with scope, limitations, and link to migration guide

## Phase 5: User Story 3 — Registry (P3)

- [ ] T012 [US3] Search Codemod registry for duplicates; write positioning in README
- [ ] T013 [US3] Bump version in `codemod.yaml` per semver; publish when MVP is stable

## Phase 6: Follow-up coverage (post-MVP)

- [ ] T014 [P] Add kwargs `fromBlock`/`toBlock`/`blockHash` rules **only** at safe call sites + dict negatives
- [ ] T015 [P] Middleware import renames with paired fixture sets
- [ ] T016 WebSocket / class-middleware migrations behind feature flags or separate workflow nodes

---

**Checkpoint**: After T009, MVP (US1) is demonstrable with evidence on an evaluation repo.
