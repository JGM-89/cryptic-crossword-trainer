# The Daily: par scoring + the Daily archive — Design

**Date:** 2026-10-02 · **Status:** awaiting owner review.
**Goal:** bring the Daily up to the standard of the best single-clue daily (Minute Cryptic): one
clue, no free help, a golf-style **par** score, and an **archive** of every past Daily.

## Product decisions (locked in brainstorming)

- Keep the name **the Daily** (no "Minute" — that is an existing product's name; our language
  system already locks "the Daily").
- **No free help.** Every player starts every Daily on the bare clue: no device badge, no
  highlights. The same rules for everyone, so scores compare. Competence-based fading continues
  in Learn and Play; the Daily no longer fades.
- **Hints are a menu, not a ladder** (as Minute Cryptic does it): pick any hint in any order;
  each costs 1. **Show a letter** is one of the options and is repeatable.
- **Par** per clue is set by a **rubric** (below) applied through a blind multi-judge process,
  the same discipline as the Clue Writer. Stored on each bank clue.
- **Archive**: every past Daily is playable; catch-up solves never touch the streak.

## 1. How the Daily plays

- Start: the clue text, the answer boxes, a **Hints** button, **Check**, and the par meter.
- **Hints menu** (each item can be taken once, costs 1):
  - **Show the definition** — highlights the definition span; shows hint-tier-1 text.
  - **Name the device** — shows hint-tier-2 text.
  - **Explain the wordplay** — highlights the indicator (if any); shows hint-tier-3 text.
  - **Show a letter** — repeatable, costs 1 each: fills the leftmost box not already holding
    the correct letter, and locks it.
- **Wrong guesses are free.**
- **Reveal answer** stays as the give-up action: result is "revealed", no score.
- After solve or reveal, the full parse (tier 4) shows, exactly as today.
- **Score** = hints taken + letters shown. Result line: `Par`, `1 under par`, `2 over par`.
- **Par meter**: a row of dots with par marked; dots fill as you spend. Cruci's own visual
  language (cells/ink from the design system), not a copy of Minute Cryptic's.
- Daily solves still feed the competence engine (`usedHint` = score > 0) so Learn/Play fading
  keeps learning from them.

## 2. The par rubric

**What par means:** the hints-plus-letters a capable improver would spend — someone who could
finish a broadsheet cryptic with a little help. Averaging par means you are ready for full
puzzles (Minute Cryptic's own framing: par is a "crossword benchmark").

**Par = A + B + C + D + E**, clamped to 2–6:

| | Factor | Score | Source |
|---|---|---|---|
| A | **Crossing-letter allowance** — in a real grid about half the letters are checked; par allows half of those | 3–6 letters: 1 · 7–10: 2 · 11+: 3 | mechanical (length) |
| B | **One hint** — everyone is allowed one nudge | always 1 | fixed |
| C | **Layered wordplay** — two or more operations, any abbreviation, or a cryptic definition (no wordplay to lean on) | 0 / 1 | mechanical (from the stored parse) |
| D | **Oblique definition** — not the obvious synonym; disguised part of speech; definition by example | 0 / 1 | judged |
| E | **Misdirection / hard to see** — the surface actively steers wrong: indicator hiding in plain sight, a word whose surface job differs from its cryptic job, capitalisation trick, unfamiliar vocabulary or crossword-ese | 0 / 1 | judged |

Calibration anchors: Minute Cryptic 2 Oct 2026, CONTEST (7) = par 3 (A2 + B1). Cruci examples
the panel uses as anchors are picked during the first run and written into the rubric doc.

Pre-judgement distribution on the current 416-clue bank (A+B+C only): par 2 ×195, 3 ×189,
4 ×28, 5 ×3. D and E then lift the genuinely hard ones — expected final shape mostly 2–4 with
a tail to 6, which matches the bank's difficulty ratings (2 ×127, 3 ×272, 4 ×16).

**Process (mirrors the Clue Writer):**
1. `scripts/par-baseline.mjs` computes A, B, C for every bank clue.
2. **Three blind judge agents** each score D and E for every clue (they see clue, answer and
   parse, never the other judges or the baseline). Median of three wins per factor.
3. **Flags** for the owner's short list: judges split 0/1/… with no majority, or final par
   disagrees with the clue's `difficulty` by more than the expected band (difficulty 2 → par
   ≥ 5, or difficulty 4 → par 2).
4. `par` is written to each bank clue (integer 2–6). Rationale per clue is kept in `tmp/` for
   audit; only the number ships.
5. **Clue Writer** gains a step: every new or rewritten bank clue gets a par through the same
   rubric before the owner gate.
6. **Later calibration** (not in this build): once Daily analytics (`daily_solved` with score)
   has enough plays, any clue whose median player score sits ≥ 2 away from par is re-judged.

The rubric lives in `docs/clue-style.md` as a new §7b next to the difficulty rubric.

## 3. The Daily archive

- **`/daily/archive`** — every Daily from #1 to today, newest first: number, date, and your
  result (not played · score vs par · revealed · "Solved" for pre-par history). Today's entry
  links to `/daily`.
- **`/daily/:number`** — play a past Daily under identical rules. Today's number redirects to
  `/daily`; future numbers and < 1 redirect to `/daily` (no spoilers).
- **Catch-up solves don't count toward the streak.** A streak means solving on the day.
- Entry points: a link on the Daily page header ("Archive"); after solving, "Missed a day?
  Catch up in the archive →"; a link at the bottom of the archive back to today's Daily.
- Share text for an archive solve: `Cruci Daily #42 — par` (same format; the number says which).

## 4. Data and state

- **Bank:** new required `par` field (2–6) on every bank JSON entry; hydrated onto `Clue` as
  `par?: number` (teaching clues don't have one; the Daily only uses bank clues).
- **`src/data/par.ts`** — pure: `scoreLabel(score, par)`, letter-allowance helper, used by
  the baseline script tests and UI.
- **`src/data/daily.ts`** — add `dailyByNumber(n)`, `dateForNumber(n)`, and `archiveNumbers(today)`
  (1…today's number).
- **`src/state/dailyProgress.ts`** — `DailyResult` becomes
  `{ hintsUsed, lettersShown?, score?, par?, revealed }` (old entries lack `score`/`par` → shown
  as "Solved"). On-the-day solves stay in `history` (streak evidence; untouched logic). Catch-up
  solves go in a new `archive: Record<dateKey, DailyResult>` map via `recordArchiveSolve`, which
  never touches `lastDate`/`streak`/`best`. This keeps the future accounts merge rule ("streak
  recomputed from history dates") honest.

## 5. Components

- **`DailyClueCard`** (new) — Daily-only card: clue text with highlights, answer strip with
  locked letters, hints menu, par meter, check/reveal. Reuses `ClueText`, `AnswerStrip`. The
  existing `ClueCard` (Learn/Play) is untouched.
- **`ParMeter`** (new) — the dot row.
- **`HintMenu`** (new) — the menu sheet; keyboard and screen-reader accessible, 40px targets.
- **`DailyPage`** — uses `DailyClueCard`; lede changes from "hints fade as you improve" to
  "One clue a day. Beat par."; share text uses the score label.
- **`DailyArchivePage`** (new). Past Dailies reuse **`DailyPage`**, parameterised by an
  optional `:number` route param (no param = today; a past number = catch-up mode, which
  records via `recordArchiveSolve` and hides the streak line).
- Home's returning-user Daily card shows the score label instead of "with N hints".

## 6. Language, analytics

- `docs/ux-language.md` adds: **the Daily archive** (banned: "back catalogue", "past clues"),
  **par** / **under par** / **over par**, **Show a letter**.
- Analytics: `daily_solved` gains `score`, `par`, `letters`; new `daily_archive_view` and
  `daily_archive_solved { number, score, par }`; `hint_revealed` source `daily` keeps firing
  with the hint kind.

## 7. Testing

- `par.test.ts` — allowance by length, score labels, clamp 2–6.
- Bank test — every bank clue has an integer `par` in 2–6.
- `daily.test.ts` — `dailyByNumber`/`dateForNumber` round-trip; archive list bounds.
- `dailyProgress.test.ts` — archive solve never changes streak/best/lastDate; old history
  entries load.
- Component tests — hint menu costs, letter reveal fills leftmost wrong box and locks it,
  wrong guesses free, reveal → "revealed", par meter.
- Routing — future/zero numbers redirect; today's number redirects to `/daily`.

## Out of scope

Timer, stats panel, emoji share grid (owner declined); crowd-adjusted par (no backend);
members-only archive gating; the later analytics re-calibration of par.

## Build order

1. Par rubric doc + baseline script + judging run + `par` on all 416 clues (owner sees the
   distribution and the flagged short list).
2. Pure data/state (`par.ts`, `daily.ts`, `dailyProgress.ts`) with tests.
3. `DailyClueCard` + `HintMenu` + `ParMeter`; Daily page switched over.
4. Archive pages + routes + entry points.
5. Language doc, analytics, Home card, Clue Writer step; full test + build; browser check at
   375px and 1280px, light and dark.
