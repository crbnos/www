---
name: check-and-commit
description: Pre-commit verification gate — runs validation gates in order (biome if available, typecheck, and /translate to fill missing i18n .po strings when UI/locale files changed), fixes straightforward failures, then commits the specific files with a conventional message. Use after making changes when the work should be committed. Commits only when every gate is green; pushes only if the branch already tracks a remote or the user asked.
---

# check-and-commit — verification gate, then commit

Run the gates in order, fix what's mechanically fixable, and commit only when
everything is green. This skill is the only place in the workflow that commits.

**Announce at start:** "Using the check-and-commit skill — running the gates,
then committing."

## Step 1: Identify what changed

```bash
git status --porcelain
git diff --name-only HEAD   # staged + unstaged vs HEAD — the full change set
```

Derive every flag below from `git diff --name-only HEAD` (all changes vs the last
commit). Plain `git diff --name-only` omits already-staged files. From the changed
paths, derive:

- `I18N_RELEVANT` — the diff adds/edits UI source that can introduce new
  translatable strings (`app/**/*.tsx`, `app/**/*.ts`) **or** touches any
  `locales/**/*.po`. When true, Gate 3 (i18n) fills missing translations so they
  ship in this same commit.
- whether any file is **outside** the intended change (leftover debug file,
  unrelated edit). If yes → exclude it from staging and mention it in the report.

## Step 2: Run the gates in order

Stop on failure, apply the fix policy (Step 3), re-run the failed gate.

```bash
# Gate 1 — typecheck
npx tsc --noEmit

# Gate 2 — build (verify the site builds clean)
npm run build
```

### Gate 3 — i18n translations (only if `I18N_RELEVANT`)

Run **last**, after the code gates are green — so no Haiku translation effort is
spent on a commit that would fail typecheck/build. Fill missing `.po`
translations by invoking the **translate skill** (`/translate`), not by hand:

- Invoke `/translate`. It refreshes catalogs (`lingui:extract`), fans missing
  `msgstr` out to Haiku subagents, merges deterministically — see
  `.claude/skills/translate/SKILL.md` for the full loop.
- If it reports `NOTHING_TO_TRANSLATE` → mark gate SKIP and continue.
- Otherwise it fills `locales/**/*.po`. Treat the gate as PASS only when
  `/translate` finishes with `Remaining ... : 0`. If it stops with a residual
  after its 3-round cap → **STOP, report BLOCKED**.
- The filled `.po` files are part of this change — add them explicitly in Step 4.
  `/translate` removes its own `.claude/scratch/translate/` scratch; never stage that.

## Step 3: Fix policy

| Failure | Action |
|---------|--------|
| Type error caused by this change | Fix the code, re-run |
| Build error caused by this change | Fix the code, re-run |
| Pre-existing failure, unrelated to this change | Note in report; don't block, don't fix |
| Anything unclear or still failing after **2** fix attempts | STOP — report BLOCKED |

"Pre-existing" must be proven, not assumed: the failing file is untouched by this
diff, or the same failure reproduces on the merge-base.

Red flags — thinking any of these means the gate is being weakened; STOP:

- "I'll run the gates once at the end instead of in order"
- "`git add -A` is faster"
- "that failure is probably pre-existing" (prove it)
- "the gate is flaky, I'll just retry until it passes"

## Step 4: Commit

Only when all applicable gates pass:

```bash
git add <each changed file, listed explicitly>   # NEVER `git add -A` or `git add .`
git commit -m "<type>(<scope>): <description>"
```

- Types: `fix`, `feat`, `chore`, `refactor`, `test`, `docs`.
- Staging is explicit because worktrees can accumulate runtime files that must
  never be committed.
- **Push only if** the branch already tracks a remote (`git rev-parse
  --abbrev-ref @{upstream}` succeeds) **or** the user asked. Otherwise leave
  the commit local and say so.

## Step 5: Report

```markdown
## Check & Commit Report
**Result:** COMMITTED | BLOCKED

| Gate | Result | Notes |
|------|--------|-------|
| typecheck | PASS / SKIP | |
| build | PASS / SKIP | |
| i18n (/translate) | PASS / SKIP | <N filled across locales, or "no missing"> |

**Commit:** `<sha>` — `<message>`  ·  **Pushed:** yes/no
**Excluded from staging:** <files left uncommitted and why, or "none">
```

If BLOCKED: name the gate, the concise error, and what was attempted.
