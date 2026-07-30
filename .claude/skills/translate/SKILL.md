---
name: translate
description: Fill missing i18n translations in the Lingui .po catalogs cheaply — extract every empty msgstr, fan out chunked jobs to Haiku subagents (model override, not the main model), merge results back deterministically, and verify zero remain. Produces filled locales/*/www.po. Use when the user asks to translate/fill missing translations or after adding new UI strings. Do not use to add or mark new strings (that is `npm run lingui:extract` in code) or to change the locale list (edit lingui.config.js / app/lib/locale.ts).
---

# translate — fill missing .po translations with a cheap model

The www site is a single-catalog Lingui project: `locales/{locale}/www.po`.
Instead of running every string through the expensive main model, a
deterministic script finds every empty `msgstr`, chunks them into jobs,
**Haiku subagents** translate the chunks (invoked with `model: "haiku"` so the
main model only orchestrates), and a deterministic merge script writes them
back — no model in the write path. Input → output: empty `msgstr` in
`locales/{locale}/www.po` → filled `msgstr`.

**Announce at start:** "Using the translate skill — filling missing .po translations via Haiku subagents."

Scope: every `locales/<code>/www.po` on disk except the source `en` (so no
shipped catalog is left half-filled). Never overwrites an existing translation —
only empty `msgstr` are touched.

## Step 1 — Extract missing translations into chunked jobs

```bash
node node_modules/@lingui/cli/dist/lingui.js extract          # refresh catalogs from source strings
node .claude/skills/translate/scripts/extract-missing.mjs     # scan → chunk jobs
```

(Use the `node …/lingui.js extract` form rather than `npm run lingui:extract`
if the sandbox denies the `.bin/lingui` shim; both do the same thing —
`lingui extract --clean`.)

Read the printed summary. It prints total missing, chunk count, and per-locale
counts, then writes `.ai/scratch/translate/manifest.json` plus one input file
per chunk under `.ai/scratch/translate/in/`.

- If the output contains `NOTHING_TO_TRANSLATE` → **STOP**, report "no missing
  translations". Do not run later steps.

Chunk size defaults to 40. For this small site one chunk per locale is fine and
keeps the subagent count low — set `TRANSLATE_CHUNK_SIZE=300` to get a single
chunk per locale.

## Step 2 — Start the live progress watcher, then fan out subagents

First launch the background watcher **once** (Bash tool, `run_in_background: true`):

```bash
node .claude/skills/translate/scripts/progress.mjs --watch
```

It reports `chunks done/total · strings done/total (%)` with a per-locale
breakdown, updating as each subagent writes its `out/` file. It stops itself
when Step 5 writes the `.done` marker.

Then read `.ai/scratch/translate/manifest.json` — an array of
`{ chunk, in, out, locale, catalog, langLabel, count }`.

For **every** entry, dispatch an `Agent` with **`model: "haiku"`** (subagent
type `general-purpose`). Dispatch in batches of **up to 10 per message**
(multiple tool_use blocks in one message) so they run concurrently; use
`run_in_background: false` so the batch completes before you move on. **After
each batch, run a one-shot snapshot:**

```bash
node .claude/skills/translate/scripts/progress.mjs
```

Use this exact prompt, substituting the entry's `in` and `out` absolute paths:

````text
You are a professional software-localization translator for a manufacturing operating system marketing site.

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
   Keep an ALL-CAPS source label ALL-CAPS in the target where the script allows.
4. Do NOT translate brand names (Carbon, Onshape, Xero, Slack…), acronym codes
   (ERP, MRP, MES, QMS, BOM, CAPA, RFQ…), code identifiers, or URLs.
5. Preserve embedded newlines (\n) in multi-line values.
6. Use `note` only as context for a placeholder; never include it in the output.

OUTPUT — write ONLY a JSON object (create/overwrite) to this absolute path:
<manifest entry `out`>

It maps each input `msgid` (exact original English key, unchanged) to its
translation, e.g. { "Sales orders": "Pedidos de venta" }. Every input item must
be a key. No commentary. Then reply only: DONE.
````

Do **NOT** trust the subagent's reply count — the merge script in Step 3 is the
source of truth for completeness.

## Step 3 — Merge deterministically and verify

```bash
node .claude/skills/translate/scripts/merge-translations.mjs
```

Read its output:
- `Merged: N filled, M unmatched` — `unmatched` means the model returned a key
  that no longer matches an empty `msgid` (usually it altered the key); skipped.
- `Remaining empty msgstr in targeted catalogs: R`.
- `Missing/invalid chunk outputs` — chunks whose `out` file is absent or bad JSON.

## Step 4 — Retry until dry (max 3 rounds total)

| Situation | Action |
|-----------|--------|
| `Remaining` is `0` | Go to Step 5. |
| `Remaining > 0` and rounds so far `< 3` | Re-run `extract-missing.mjs` only (NOT `lingui extract` again) — it regenerates jobs for just the still-empty entries — then redo the subagent dispatch + snapshot + merge. Do **not** relaunch the watcher. Each round shrinks. |
| `Remaining > 0` after 3 rounds | **STOP.** Report the residual count and the locales still short. |

If a whole locale keeps failing, lower the chunk size for that round:
`TRANSLATE_CHUNK_SIZE=15 node .claude/skills/translate/scripts/extract-missing.mjs`.

## Step 5 — Normalize and recompile

```bash
touch .ai/scratch/translate/.done     # stops the background progress watcher
node node_modules/@lingui/cli/dist/lingui.js compile   # regenerate locales/*/www.mjs from the filled .po
```

Unlike carbon, this repo commits the compiled `locales/*/www.mjs` runtime
catalogs, so recompiling is required for the new translations to actually render.

## Step 6 — Verify nothing is left

The merge script's `Remaining … : 0` is authoritative. Optionally double-check:

```bash
for d in locales/*/; do loc=$(basename "$d"); [ "$loc" = en ] && continue; \
  echo "$loc: $(grep -c '^msgstr ""$' "$d/www.po") empty"; done
```

Every non-`en` locale should report `1` (only the catalog header's empty
`msgstr ""`). Anything higher means real strings are still missing → back to
Step 4 if under the 3-round cap, else report residual and STOP.

## Step 7 — Clean up scratch (always, even on partial/failed runs)

```bash
rm -rf .ai/scratch/translate
```

Leaving `in/`, `out/`, and `manifest.json` behind risks a stale chunk merging on
the next run. (`extract-missing.mjs` also wipes this dir at the start of every
run, but clean up here too so the tree is tidy.)

## Output

Filled `msgstr` values in `locales/{locale}/www.po` plus recompiled
`locales/{locale}/www.mjs`. Commit only if the user asks. Scratch under
`.ai/scratch/translate/` is disposable.

## Done when
- [ ] `merge-translations.mjs` reports `Remaining empty msgstr … : 0` (or the
      residual is reported after 3 rounds).
- [ ] `lingui compile` has regenerated the `.mjs` catalogs.
- [ ] Only `msgstr` lines changed in the `.po` diff (no `msgid` touched):
      `git diff --no-color locales | grep -E '^\+' | grep -vE '^\+msgstr|^\+\+\+'` is empty.
- [ ] `.ai/scratch/translate` has been removed.

## Failure → action
| Symptom | Action |
|---------|--------|
| Merge shows many `unmatched` | The model rewrote keys. Re-run the round with smaller `TRANSLATE_CHUNK_SIZE`; unmatched entries stay empty and are retried next round. |
| A subagent dies / returns no file | That chunk's `out` is listed as missing; the next retry round re-dispatches only the still-empty entries. |
| `.bin/lingui` permission denied | Use the `node node_modules/@lingui/cli/dist/lingui.js …` form instead of `npm run …`. |
