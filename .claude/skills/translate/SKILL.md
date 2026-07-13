---
name: translate
description: Fill missing i18n translations in the Lingui .po catalogs cheaply — extract every empty msgstr, fan out chunked jobs to Haiku subagents (model override, not the main model), merge results back deterministically, and verify zero remain. Produces filled locales/*/*.po. Use when asked to translate/fill missing translations, or after adding new UI strings. Do not use to add or mark new strings (that is lingui:extract in code) or to change the locale list.
---

# translate — fill missing .po translations with a cheap model

Replaces `npm run translate` (which would run every string through the main model).
Instead: a deterministic script finds every empty `msgstr`, chunks them into
jobs, **Haiku subagents** translate the chunks (invoked with `model: "haiku"` so
the expensive main model only orchestrates), and a deterministic merge script
writes them back — no model in the write path. Input → output: empty `msgstr` in
`locales/{locale}/www.po` → filled `msgstr`.

**Announce at start:** "Using the translate skill — filling missing .po translations via Haiku subagents."

Scope: all target locales at once (locales from `lingui.config.js` minus source `en`).
Never overwrites an existing translation — only empty `msgstr` are touched.

## Step 1 — Extract missing translations into chunked jobs

```bash
npm run lingui:extract                                              # refresh catalogs from source strings
node .claude/skills/translate/scripts/extract-missing.mjs          # scan → chunk jobs
```

Read the printed summary. It prints total missing, chunk count, and per-locale
counts, then writes `.claude/scratch/translate/manifest.json` plus one input file per
chunk under `.claude/scratch/translate/in/`.

- If the output contains `NOTHING_TO_TRANSLATE` → **STOP**, report "no missing
  translations", skip to nothing. Do not run later steps.

## Step 2 — Start the live progress watcher, then fan out subagents

First launch the background watcher **once** — it ticks every 10s independently of
the main loop. Use the `Bash` tool with `run_in_background: true`:

```bash
node .claude/skills/translate/scripts/progress.mjs --watch
```

It reports `chunks done/total · strings done/total (%)` with a per-locale
breakdown, updating as each subagent writes its `out/` file.

Then read `.claude/scratch/translate/manifest.json` — an array of
`{ chunk, in, out, locale, catalog, langLabel, count }`.

For **every** entry, dispatch an `Agent` with **`model: "haiku"`**. Dispatch in
batches of **up to 10 Agent calls per message** so they run concurrently.
**After each batch returns, run a one-shot snapshot:**

```bash
node .claude/skills/translate/scripts/progress.mjs
```

Then send the next batch. Use this exact prompt, substituting the entry's `in`
and `out` absolute paths:

````text
You are a professional software-localization translator for a manufacturing ERP website.

Read the input file (JSON) at this absolute path:
<manifest entry `in`>

It is: { "locale", "langLabel", "catalog", "items": [ { "msgid", "note?" } ] }.
Translate every item's `msgid` from English into the language named by `langLabel`.

RULES — follow exactly:
1. Preserve every placeholder EXACTLY: `{0}`, `{name}`, `{count}`, etc. Never
   translate, rename, reorder-away, or drop a placeholder token.
2. For ICU syntax like `{0, plural, one {…} other {…}}`, keep the structure,
   keywords (`plural`, `select`, `one`, `other`, `=0`, `#`) and braces intact;
   translate ONLY the human words inside each `{…}` branch.
3. Preserve leading/trailing spaces, capitalization intent, and punctuation.
4. Do NOT translate brand names, code identifiers, or placeholder variable names.
5. Use `note` only as context for a placeholder; never include it in the output.

OUTPUT — write ONLY a JSON object (create/overwrite) to this absolute path:
<manifest entry `out`>

It maps each input `msgid` (exact original English key, unchanged) to its
translation, e.g. { "Add parts": "Ajouter des pièces", "{0} days": "{0} jours" }.
Every input item must be a key. No commentary. Then reply only: DONE.
````

Do **NOT** trust the subagent's reply count — a subagent may misreport how many
it wrote. The merge script in Step 3 is the source of truth.

## Step 3 — Merge deterministically and verify

```bash
node .claude/skills/translate/scripts/merge-translations.mjs
```

Read its output:
- `Merged: N filled, M unmatched` — `unmatched` means the model returned a key
  that no longer matches an empty `msgid`; those are skipped safely.
- `Remaining empty msgstr in targeted catalogs: R`.
- `Missing/invalid chunk outputs` — chunks whose `out` file is absent or bad JSON.

## Step 4 — Retry until dry (max 3 rounds total)

| Situation | Action |
|-----------|--------|
| `Remaining` is `0` | Go to Step 5. |
| `Remaining > 0` and rounds so far `< 3` | Re-run Step 1's `extract-missing.mjs` only (NOT `lingui:extract` again) — it regenerates jobs for just the still-empty entries — then redo subagent dispatch + snapshot + merge. Do **not** relaunch the watcher. |
| `Remaining > 0` after 3 rounds | **STOP.** Report the residual count and locales still short. |

If a whole locale keeps failing, lower the chunk size:
`TRANSLATE_CHUNK_SIZE=15 node .claude/skills/translate/scripts/extract-missing.mjs`.

## Step 5 — Finalize and report

```bash
touch .claude/scratch/translate/.done     # stops the background progress watcher
npm run lingui:extract                    # re-extract to normalize catalog metadata
```

Do **not** run `lingui:compile` — `.mjs` compiled files are produced at build time.

## Step 6 — Verify nothing is left

Check for remaining empty `msgstr` entries:

```bash
node -e "
const { readFileSync, readdirSync, existsSync } = require('fs');
const { parsePo } = await import('./.claude/skills/translate/scripts/lib-po.mjs');
// ... or simply grep
" 2>/dev/null || grep -r 'msgstr ""' locales/*/www.po | grep -v 'msgid ""' | wc -l
```

A count of `0` means verified clean → Step 7.
If non-zero after 3 rounds, report residual and STOP.

## Step 7 — Clean up scratch (always, even on partial/failed runs)

```bash
rm -rf .claude/scratch/translate
```

Leaving `in/`, `out/`, and `manifest.json` behind risks stale chunks merging on
the next run.

## Output

Filled `msgstr` values in `locales/{locale}/www.po`. Commit only if the user asks,
via `/check-and-commit`. Scratch under `.claude/scratch/translate/` is disposable.

## Done when
- [ ] `merge-translations.mjs` reports `Remaining empty msgstr ... : 0` (or residual reported after 3 rounds).
- [ ] `npm run lingui:extract` has run to normalize.
- [ ] Only `msgstr` lines changed in the `.po` diff.
- [ ] `.claude/scratch/translate` has been removed.

## Failure → action
| Symptom | Action |
|---------|--------|
| `extract-missing.mjs` errors reading config | Confirm `lingui.config.js` still defines a `locales` array. |
| Merge shows many `unmatched` | The model rewrote keys. Re-run with smaller `TRANSLATE_CHUNK_SIZE`. |
| A subagent dies / returns no file | That chunk's `out` is listed as missing; next retry round re-dispatches only still-empty entries. |
