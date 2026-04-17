# Implementation Plan: web3.py v6 → v7 codemod

**Branch**: `001-web3py-v6-v7-codemod` | **Date**: 2026-04-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-web3py-v6-v7-codemod/spec.md`

## Summary

Deliver a **Codemod.com package** that automates **Phase 1 mechanical** parts of the web3.py v6 → v7 migration with **fixture-tested ast-grep rules**, optional JSSG for future complex Python AST, and documented scope aligned with the official migration guide. **Accuracy over coverage**: no deterministic rule ships without tests and negative cases where ambiguity exists.

## Technical Context

**Language/Version**: Target **Python** consumer code (3.8+ per v7); toolchain **Node.js** for Codemod CLI  
**Primary Dependencies**: `codemod` CLI; **JSSG** (`scripts/codemod.ts`) for proven on-disk Python rewrites; optional YAML `ast-grep` step (experimental in this package until we confirm disk apply behavior)  
**Storage**: N/A (stateless transforms)  
**Testing**: Codemod fixture tests + manual/CI run on evaluation repo  
**Target Platform**: Cross-platform (Windows/macOS/Linux); shell steps in package are bash (may require WSL/Git Bash on Windows for full workflow)  
**Project Type**: Codemod package (migration workflow)  
**Performance Goals**: Fast enough for multi-thousand-file repos (ast-grep scales well)  
**Constraints**: **Zero false positives** on Phase 1 deterministic rules; dict RPC camelCase must be preserved  
**Scale/Scope**: Phase 1 starts with **one proven rule** (`middlewares` → `middleware` kwarg); expand only with fixtures

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No project constitution violations identified for this feature: scope is explicit, tests are mandatory per spec, and complexity is bounded by phased rules.

## Project Structure

### Documentation (this feature)

```text
specs/001-web3py-v6-v7-codemod/
├── plan.md          # This file
├── research.md      # Migration guide buckets + evaluation repos
├── quickstart.md    # Validate / run / test commands
├── spec.md          # Feature specification
└── tasks.md         # Implementation task list
```

### Source Code (repository root)

```text
docs/
├── codemod-submission-guide.md   # Hackathon reference (pre-existing)
└── PROJECT_JOURNAL.md            # Chronological decision log

packages/web3py-v6-v7/
├── codemod.yaml
├── workflow.yaml
├── package.json
├── rules/
│   └── config.yml                # ast-grep rule bundle (expand with care)
├── scripts/
│   ├── codemod.ts                # JSSG entry (no-op until needed)
│   ├── setup.sh
│   ├── transform.sh
│   └── cleanup.sh
└── tests/
    ├── middlewares-kwarg/
    ├── websocket-provider-v2/
    ├── combined-phase1/
    ├── rpc-kwargs-snakecase/
    ├── rpc-kwargs-dictctor-only/
    ├── middleware-onion-class/
    ├── geth-poa-factory-unchanged/
    ├── sign-and-send-builder/
    ├── sign-and-send-builder-inject/
    ├── fixtures/              # legacy mirror + README pointer
    └── workdir/               # local scratch (gitignored except .gitkeep)
```

**Structure Decision**: Single codemod package under `packages/web3py-v6-v7`; Speckit artifacts under `specs/001-web3py-v6-v7-codemod/`. Journal under `docs/PROJECT_JOURNAL.md`.

## Complexity Tracking

> No violations requiring justification.

## Phase alignment

| Phase | Work |
|-------|------|
| 0 | `research.md` + pick evaluation repos |
| 1 | Rules + fixtures + validate workflow |
| 2 | Additional rules (kwargs snake_case with dict negatives) |
| 3 | JSSG or AI workflow params for semantic migrations |
