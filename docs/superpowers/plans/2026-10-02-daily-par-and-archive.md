# Daily Par + Daily Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Daily a no-free-help hints menu with letter reveals, a rubric-set par per clue,
golf-style scoring, and a playable archive of every past Daily that never touches the streak.

**Architecture:** Par is data (an integer on every bank clue, set offline by
`scripts/par-baseline.mjs` + blind judges + `scripts/par-apply.mjs`). Scoring/labels are pure
(`src/data/par.ts`). Past-day lookup is pure (`src/data/daily.ts`). Catch-up results live in a
separate `archive` map in `dailyProgress.ts` so streak logic stays untouched. A new Daily-only
`DailyClueCard` (with `HintMenu` + `ParMeter`) replaces `ClueCard` on the Daily; `ClueCard`
(Learn/Play) is not modified. `DailyPage` serves both `/daily` and `/daily/:number`;
`DailyArchivePage` lists them.

**Tech Stack:** Vite + React 18 + TypeScript, react-router 6 (HashRouter), vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-02-daily-par-and-archive-design.md`

---

## File map

| File | Status | Responsibility |
|---|---|---|
| `scripts/par-baseline.mjs` | new | Rubric factors A/B/C per bank clue → `tmp/par/input.json` + judge batches |
| `scripts/par-apply.mjs` | new | Median of judge D/E scores + baseline → `par` on every bank entry; flags list |
| `src/data/bank/part-*.json` | modify | + `par` (2–6) on every entry |
| `src/data/bank/index.ts` | modify | `BankEntry.par`; hydrate onto `Clue.par` |
| `src/types.ts` | modify | `Clue.par?: number` |
| `src/data/par.ts` (+ test) | new | `letterAllowance`, `baselinePar`, `scoreLabel`, `clampPar` |
| `src/data/daily.ts` (+ test) | modify | `dateForNumber`, `dailyByNumber`, `todayNumber` |
| `src/state/dailyProgress.ts` (+ test) | modify | richer `DailyResult`; `archive` map; `recordArchiveSolve`; `resultFor` |
| `src/components/ParMeter.tsx` | new | dot row with par marker |
| `src/components/HintMenu.tsx` | new | the hint menu sheet |
| `src/components/DailyClueCard.tsx` (+ test) | new | Daily play surface: menu, letters, score |
| `src/pages/DailyPage.tsx` | modify | today + past-number mode; par share text; archive links |
| `src/pages/DailyArchivePage.tsx` (+ test) | new | archive list |
| `src/App.tsx` | modify | routes `/daily/archive`, `/daily/:number` |
| `src/pages/HomePage.tsx` | modify | score label on the returning card; lede copy |
| `src/styles/cruci-app.css` | modify | styles for menu, meter, archive list, locked cells |
| `src/data/bank.par.test.ts` | new | every bank clue has integer par 2–6 |
| `docs/clue-style.md` | modify | §7b par rubric |
| `docs/ux-language.md`, `src/ux-language.test.ts` | modify | archive/par terms |
| `.claude/skills/clue-writer/SKILL.md` | modify | par step |
| `PRODUCTIONPLAN.md` | modify | changelog |

---

### Task 1: Par rubric tooling + data

- [ ] `scripts/par-baseline.mjs`: for each bank entry compute `letters` (A–Z count), `A`
  (≤6 → 1, 7–10 → 2, ≥11 → 3), `B` = 1, `C` = 1 if (non-literal/non-synonym operations ≥ 2) or
  any `abbreviate` op or `clueType === 'cryptic-definition'`, else 0. Write
  `tmp/par/baseline.json` `{ [answer]: {A,B,C,part} }` and judge batches
  `tmp/par/batch-{1,2}.json` = `[{id: answer, clue, answer, type, definition, parse}]`.
- [ ] Dispatch 3 blind judges × 2 batches (6 agents). Each scores D (oblique definition) and E
  (misdirection / hard to see) 0/1 per the rubric text, writes
  `tmp/par/judge-{j}-batch-{b}.json` `[{id, D, E}]`.
- [ ] `scripts/par-apply.mjs`: per answer D = median of the three judges, E likewise;
  `par = clamp(A+B+C+D+E, 2, 6)`; write `par` into each bank entry preserving each file's
  layout (pretty files stay `JSON.stringify(_, null, 2)`, `part-j` stays one entry per line);
  write `tmp/par/flags.json` (no-majority impossible with 3 binary votes, so flag: difficulty
  ≤ 2 with par ≥ 5, difficulty ≥ 4 with par 2) and print the distribution.
- [ ] `src/data/bank.par.test.ts`: every `BANK_RAW` entry has `Number.isInteger(par)` and
  `2 ≤ par ≤ 6`.
- [ ] `BankEntry.par: number`; `toRawClue` passes it; `RawClue.par?`; `hydrateClue` copies;
  `Clue.par?: number`.
- [ ] `npm test` green → commit `feat: par for every bank clue (rubric + blind judges)`.

### Task 2: `src/data/par.ts`

Tests first (`par.test.ts`):
- `letterAllowance(3)=1, (6)=1, (7)=2, (10)=2, (11)=3`.
- `clampPar(1)=2, (7)=6, (4)=4`.
- `scoreLabel(3,3)='Par'`, `(2,3)='1 under par'`, `(5,3)='2 over par'`, `(1,3)='2 under par'`.
- `parFor(clue)` returns `clue.par` when present, else `clampPar(letterAllowance(n)+1)`.

Then implement, run, commit `feat: par scoring helpers`.

### Task 3: past-day lookup in `daily.ts`

Tests: `dateForNumber(1)='2026-06-15'`, `dateForNumber(17)='2026-07-01'`;
`dailyByNumber(17)?.clue.id === dailyClue('2026-07-01')?.clue.id`; `dailyByNumber(0)` null;
round-trip `dayNumber(dateForNumber(n)) === n` for n in 1..500.
Implement with UTC arithmetic from the epoch. Commit `feat: look up any Daily by number`.

### Task 4: catch-up results in `dailyProgress.ts`

`DailyResult = { hintsUsed: number; lettersShown?: number; score?: number; par?: number; revealed: boolean }`.
`DailyState.archive: Record<string, DailyResult>` (default `{}`; old saves load with `{}`).
`recordArchiveSolve(key, result)` — idempotent, writes only `archive[key]`, never touches
`lastDate/streak/best/history`. `resultFor(state, key)` → `history[key] ?? archive[key]`.
Tests: archive solve leaves streak/best/lastDate unchanged; idempotent; old-shape state loads
with `archive` `{}`. Commit `feat: catch-up Daily results never touch the streak`.

### Task 5: `ParMeter`, `HintMenu`, `DailyClueCard`

- `ParMeter({ score, par })`: `max(par+3, score+1)` dots; first `score` filled; the dot at index
  `par-1` labelled "par"; `aria-label="Score N, par P"`.
- `HintMenu({ open, items, onPick, onClose })`: items
  `{key:'definition'|'device'|'wordplay'|'letter', label, taken, disabled}`; Escape/close button
  close it; buttons ≥ 40px.
- `DailyClueCard({ clue, par, alreadyResult, onFinished })`:
  state `value[]`, `locked[]`, `taken:Set<'definition'|'device'|'wordplay'>`, `letters`,
  `status`, `solved`, `revealed`.
  - definition → highlight def span + tier-1 text; device → tier-2 text; wordplay →
    indicator highlight + tier-3 text (taken hints listed under the card).
  - letter → leftmost index where `value[i] !== target[i]`; set + lock; letters++.
    If that completes the word, it counts as solved.
  - Check: wrong → status wrong (free); right → finish.
  - Reveal answer → revealed, finish.
  - `score = taken.size + letters`; finish calls
    `onFinished({ score, par, hintsUsed: taken.size, lettersShown: letters, revealed, timeMs })`.
  - Solved view: answer, score label (or "revealed"), full parse (tier 4) + all three hints.
  - `alreadyResult` renders the solved view directly (score from result; legacy result without
    score shows "Solved").
- Tests (`DailyClueCard.test.tsx`): wrong guess costs nothing; device hint costs 1 and shows
  tier-2 text; letter reveal fills first wrong cell and locks it; solving with 1 hint at par 3
  shows "2 under par"; reveal shows "revealed".
- Commit `feat: DailyClueCard — hints menu, letter reveals, par meter`.

### Task 6: DailyPage (today + past) and archive page

- `DailyPage`: `useParams().number`. Absent → today. Present and `1 ≤ n < today` → catch-up
  mode. Otherwise `<Navigate to="/daily" replace />`.
  - Today: `recordDailySolve`, streak lede, share `Cruci Daily #N — <label>` (+ site URL).
  - Catch-up: `recordArchiveSolve`, title `Daily #N` + date line, no streak line, share URL
    `#/daily/N`.
  - Competence: `solveClue(clue, { usedHint: score > 0, hintsUsed, timeMs })`.
  - Links: header "Archive →" (`/daily/archive`); after solving today: "Missed a day? Catch up
    in the archive →"; catch-up post-solve: "Back to today's Daily →" + "More from the archive →".
  - Analytics: `daily_start`/`daily_solved {number, score, par, letters, streak}` today;
    `daily_archive_solved {number, score, par}` catch-up.
- `DailyArchivePage`: `daily_archive_view`; list n = today..1 with date (`2 Oct 2026`), and
  status from `resultFor`: Today / Not played / `Par`·`1 under par` / Revealed / Solved.
  Links `/daily` for today, `/daily/n` otherwise.
- `App.tsx`: `/daily/archive` before `/daily/:number`.
- Tests: archive lists today first and links; future number redirects to `/daily`.
- Commit `feat: the Daily archive`.

### Task 7: Copy, docs, styles, verification, ship

- Home returning card: score label (`— 1 under par`) when the result has a score; lede "One
  clue a day. Beat par." in Daily/Home.
- `docs/ux-language.md` rows: **the Daily archive** (banned "back catalogue"), **par** /
  **under par** / **over par**, **Show a letter**; add the "back catalogue" ban to the test.
- `docs/clue-style.md` §7b par rubric; Clue Writer SKILL step 7 sets par via the rubric;
  `PRODUCTIONPLAN.md` changelog.
- CSS for `.hint-menu`, `.par-meter`, `.daily-archive`, `.cell.locked`.
- `npm test`, `npm run build`, browser check (375px + 1280px, light/dark): solve today with a
  hint + letter, open archive, play a past day, confirm streak unchanged.
- Commit, push `main` (Pages deploys), confirm the live site.
