# Feature Specification: web3.py v6 → v7 codemod (Phase 1 — mechanical)

**Feature Branch**: `001-web3py-v6-v7-codemod`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "Hackathon submission: Codemod.com package to automate safe parts of web3.py v6 → v7 migration per https://web3py.readthedocs.io/en/stable/migration.html — zero false positives on deterministic rules; AI/manual for semantic refactors."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run codemod on a Python project (Priority: P1)

A maintainer clones a repository that uses web3.py v6 patterns and runs the published workflow against their codebase. Deterministic rules update **only** patterns that are proven safe by fixtures. The run completes without corrupting unrelated code (strings, comments, JSON-RPC dict payloads).

**Why this priority**: This is the core hackathon deliverable and maps directly to **accuracy** and **reliability** scoring.

**Independent Test**: Run `npx codemod workflow validate` on the package; run the workflow on `tests/fixtures` and on at least one external OSS repo; compare git diff for unintended edits.

**Acceptance Scenarios**:

1. **Given** a file using `middlewares=` as a **keyword argument** to a provider/Web3 call, **When** the workflow runs, **Then** it becomes `middleware=` and dict literals with camelCase RPC keys are unchanged.
2. **Given** the codemod package with fixture tests, **When** CI or `npx codemod` test commands run, **Then** all fixture pairs pass with exact expected output.

---

### User Story 2 - Understand scope and limits (Priority: P2)

A user reads documentation that clearly states which migration guide sections are **in scope** (Phase 1 deterministic), **out of scope** (semantic / requires AI or manual), and where **false positive risk** exists (e.g. `fromBlock` in kwargs vs in JSON-RPC dicts).

**Why this priority**: Judges and real teams need honesty and clarity; prevents scope creep that causes wrong edits.

**Independent Test**: Review `spec.md` + `research.md` + package README; confirm every deterministic rule links to a test or is marked experimental.

**Acceptance Scenarios**:

1. **Given** the migration guide section on camelCase → snake_case kwargs, **When** a reader checks our docs, **Then** they see explicit warning that **dict payloads** for RPC may remain camelCase.

---

### User Story 3 - Publish to registry (Priority: P3)

The package is published to the Codemod registry with correct metadata, version, and keywords so others can run it via `npx codemod`.

**Why this priority**: Required for submission completeness but only after accuracy and tests.

**Independent Test**: `npx codemod publish` succeeds; a fresh environment can run the workflow from the registry.

**Acceptance Scenarios**:

1. **Given** a logged-in publisher account, **When** publish runs from `packages/web3py-v6-v7`, **Then** the registry entry matches `codemod.yaml` name/version/description.

---

### Edge Cases

- **JSON-RPC dict literals**: Keys like `fromBlock` / `toBlock` / `blockHash` may need to stay **camelCase** when the dict is sent as RPC params; kwargs on Python methods use **snake_case** in v7. Rules must not conflate the two.
- **Middleware class migration**: Function-based middleware → class-based (`PythonicMiddleware`, builders, `inject` vs `add`) is **semantic**; Phase 1 must not partially rewrite unless a rule is fully specified and tested.
- **WebSocket provider API**: `WesocketProviderV2` → `WebSocketProvider` and `.ws` → `.socket` involve structural changes; defer to Phase 2+ with dedicated fixtures.
- **Third-party wrappers**: Code that aliases or wraps web3 types may look like v6 API but is not; broaden rules only with negative fixtures.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST contain a Codemod package under `packages/web3py-v6-v7` with `codemod.yaml` and `workflow.yaml` that validate with the Codemod CLI.
- **FR-002**: Every **deterministic** transform shipped in Phase 1 MUST have at least one `input` / `expected` fixture pair documenting behavior.
- **FR-003**: Deterministic rules MUST NOT introduce **false positives** on the included fixtures and on at least one chosen **evaluation** open-source repository (record repo URL and commit in `research.md`).
- **FR-004**: The workflow MUST separate **YAML ast-grep** (mechanical) from optional **JSSG** steps; JSSG changes MUST be justified by tests when enabled.
- **FR-005**: Documentation MUST list **Phase 1** scope vs deferred items, with links to the official migration guide sections.

### Key Entities

- **Rule**: An ast-grep YAML rule (or JSSG transform) with a single, testable purpose.
- **Fixture**: Paired files proving before/after behavior and guarding regressions.
- **Evaluation repo**: External real-world codebase used to prove reliability beyond fixtures.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npx codemod workflow validate` succeeds for `packages/web3py-v6-v7/workflow.yaml`.
- **SC-002**: 100% of Phase 1 fixture pairs pass in automated test runs.
- **SC-003**: On the chosen evaluation repo, **zero incorrect automated edits** (no wrong renames in dict RPC payloads, strings, or comments) for Phase 1 rules.
- **SC-004**: Documented **automation percentage** is computed honestly against patterns observed in the evaluation repo (not against the entire migration guide).

## Assumptions

- Evaluators have Node.js + `npx` available for Codemod CLI; Python is the **target** language of transformed code.
- Phase 1 intentionally under-automates **semantic** migration sections to protect accuracy.
- Registry uniqueness: a competing published codemod may exist; we will differentiate via scope, tests, and evaluation evidence.
