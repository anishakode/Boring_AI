# Boring_AI — Hackathon: web3.py v6 → v7 codemod

This repository is a **Spec Kit (Speckit)** workspace plus a **Codemod.com-style package** that automates **mechanical** parts of [web3.py v6 → v7](https://web3py.readthedocs.io/en/stable/migration.html).

## Deliverable (what judges run)

| Path | Purpose |
|------|---------|
| [`packages/web3py-v6-v7/`](packages/web3py-v6-v7/) | **Codemod package** — `codemod.yaml`, `workflow.yaml`, JSSG transform, tests |
| [`docs/HACKATHON_SUBMISSION.md`](docs/HACKATHON_SUBMISSION.md) | **Submission checklist**, claims, and evaluation template |
| [`specs/001-web3py-v6-v7-codemod/`](specs/001-web3py-v6-v7-codemod/) | Feature **spec / plan / tasks** |
| [`docs/PROJECT_JOURNAL.md`](docs/PROJECT_JOURNAL.md) | Decision log |

## Quick start

```bash
cd packages/web3py-v6-v7
npm install
npm test
npx codemod workflow validate -w workflow.yaml
```

Apply to a Python tree (use a branch or copy first):

```bash
npx codemod workflow run -w workflow.yaml -t /path/to/project --allow-dirty --no-interactive --allow-fs
```

Optional AI follow-up (requires `LLM_API_KEY` when enabled):

```bash
npx codemod workflow run -w workflow.yaml -t /path/to/project --allow-dirty --no-interactive --allow-fs --param run_ai_step=true
```

## Honest scope

The migration guide is **large**. This package implements **test-backed deterministic rules** first (accuracy over claiming 100% coverage). See the package README and submission doc for the exact pattern list.

## Showcase site

Static landing page for judges and the BUIDL “project website” field: [`website/`](website/). After you enable **GitHub Pages** with source **GitHub Actions** (see [Pages docs](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)), push changes under `website/` to deploy; the live URL will look like `https://anishakode.github.io/Boring_AI/`.

## License

See [`packages/web3py-v6-v7/codemod.yaml`](packages/web3py-v6-v7/codemod.yaml) (MIT).
