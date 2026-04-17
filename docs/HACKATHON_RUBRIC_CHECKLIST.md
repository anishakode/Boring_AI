# Hackathon rubric — checklist vs this repo

Use this when **self-reviewing** before submit. Official scoring is theirs; this maps **their stated themes** to **evidence in-repo**.

| Requirement (theme) | What “good” looks like | Your evidence | You still do |
|---------------------|------------------------|---------------|--------------|
| **Accuracy** — few / no **false positives** | Deterministic edits must not break code silently | **9** JSSG fixtures pass; **`geth-poa-factory-unchanged`** guards Brownie-style **POA factory** (no rename); Brownie re-run = **only** `contract.py` + `event.py` kwargs (**2 files**) | Manually skim **web3.py** corpus diff for odd hunks |
| **Coverage** — automate real migration work | High % of *observed* patterns in **your** eval repos | Rules: `middlewares`, `WebsocketProviderV2`, RPC kwargs (+ `dict()` guard), **2** onion bare middlewares, sign-and-send **builder**, etc. Document **out-of-scope** in README | Fill **`docs/evaluation-report.md`** with counts from a chosen repo |
| **Reliability** — not one golden file | Same workflow on **real** trees | **`Test/real-web3py-v6.20.4`** (library) + **`Test/real-brownie-v1.20.0`** (consumer, web3 6.15). See **`docs/COMPARISON_REPORT.md`** | Re-run after each codemod release; pin commits in the report |
| **Tests** | Automated tests, all green | `npm test` in `packages/web3py-v6-v7`; **`.github/workflows/codemod-ci.yml`** runs tests + `workflow validate` | Ensure CI passes on **default branch** before submit |
| **Real repo run** | Codemod applies; you review diff | Commands in **`docs/HACKATHON_SUBMISSION.md`**; clones under **`Test/`** | Optional: run target project **pytest** post-codemod and note pass/fail |
| **AI / edge cases** (if rubric rewards it) | Optional AI step for leftovers | `workflow.yaml`: `run_ai_step` param + **AI** node | Run with `LLM_API_KEY` only if allowed; otherwise note “instructions-only” mode |
| **Publish** | Registry package | `codemod.yaml` **0.5.x**, keywords set | `npx codemod login` → **`publish`** from package dir |
| **Documentation** | Judges find how to run + limits | Root **`README.md`**, **`docs/HACKATHON_SUBMISSION.md`**, package **`README.md`**, this file | Add **demo video / slides** if the form asks |

## One-command local verification (before submit)

```powershell
cd d:\Hackathons\Boring_AI\packages\web3py-v6-v7
npm install
npm test
npx codemod workflow validate -w workflow.yaml
```

## Honest coverage statement (template)

> “We automate **[list pattern families]** with **N** fixture tests and **zero** intentional changes to **[excluded patterns, e.g. geth_poa factory]** On **[repo + pin]**, **M** files changed; we did / did not run upstream tests afterward.”

Replace brackets with your numbers after you run evaluation.

---

## Can you submit to the hackathon?

**Yes — as a serious technical submission** (codemod package + tests + real-repo evidence + docs), **if** you complete the **platform-specific** steps below. Nobody outside the org can guarantee your **score**; this is about **not being disqualified** and **matching what they asked for**.

### Ready today (in this repo)

| Item | Status |
|------|--------|
| Codemod package (`codemod.yaml`, `workflow.yaml`, JSSG) | **Yes** — `workflow validate` passes |
| Deterministic tests | **Yes** — **9** JSSG fixtures, all passing |
| CI definition | **Yes** — `.github/workflows/codemod-ci.yml` |
| Real corpus runs documented | **Yes** — `docs/COMPARISON_REPORT.md`, clones under `Test/` |
| Accuracy guard (POA factory) | **Yes** — `geth-poa-factory-unchanged` + Brownie re-run = 2 files only |
| Optional AI step | **Yes** — `run_ai_step` in `workflow.yaml` |
| Honest scope / rubric mapping | **Yes** — this file + `HACKATHON_SUBMISSION.md` |

### Before you click “Submit” (you must do)

1. **Push to GitHub (or host)** so judges can clone — ensure **CI green** on default branch.  
2. **`npx codemod publish`** from `packages/web3py-v6-v7` **if** the hackathon requires a **registry** entry — have your Codemod account ready.  
3. **Fill `docs/evaluation-report.md`** with your final corpus pin + 2–3 sentences of what you observed (even if pytest not run — say so honestly).  
4. **Form extras:** demo link, video, Discord handle — whatever **their** form lists.

### What might cap your score (not blockers)

- **Coverage %** vs the **entire** migration guide is **not** 100% — your write-up should claim **pattern families + evidence**, not “everything.”  
- **Post-codemod pytest** on Brownie/web3.py was **not** run in automation — optional **strong** bonus if you add one paragraph of results.

**Bottom line:** You **can submit**; treat **registry publish + pushed repo + filled evaluation-report + form fields** as your **launch checklist**.
