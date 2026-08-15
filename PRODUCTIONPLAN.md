# Cruci — Status & Roadmap (single source of truth)

> **This file is the one place to understand where the project is.** Read it first.
> **Last updated:** 2026-06-07 · **Goal:** _a product people use_ (not a craft/portfolio piece).
> **Live:** https://jgm-89.github.io/cryptic-crossword-trainer/ (GitHub Pages, CI-gated from `main`).

---

## What Cruci is

A static Vite + React + TypeScript cryptic-crossword **trainer** (rebranded "Cruci"). Two halves:

- **Learn** — teaches cryptic devices one at a time. 44 Stage-A lesson clues across 9 devices, a
  4-rung hint ladder, and a "fading" engine that removes scaffolding as you improve. Clue quality here
  is now high (rebuilt 2026-06-05 to a researched bar).
- **Play** — a generated puzzle archive. ~300 interlocking crosswords (50× 7×7, 50× 9×9, 200× 13×13)
  compiled from a **366-word hand-clued bank** so every grid is fillable by real bank words.
- **Tech** — fully static. Progress saved in the browser (IndexedDB/localStorage). No backend, no
  accounts, privacy-first analytics (dark until owner pastes Umami id).

## Current problems (priority order)

1. **Zero users.** Analytics (active since 2026-06-10) recorded **one visitor in two months — the
   owner**. The site has never been shared or indexed anywhere; every retention feature is idle.
   Owner's decision: no money (domain, app-store fees) until the website passes the quality gate
   (see committed order #3), then distribution.
2. **Play repetition.** The bank has only **14 three-letter words**, but 13×13 grids need many short
   crossers (top answer ~30% of puzzles after the 2026-06-07 cap). True ≤15% needs more short
   words — now unblocked by the Clue Writer (#1 below), but still evidence-gated.
3. **Learn is thin.** Good engine, but only 44 lessons and no review/spaced-repetition. The Daily
   (live since 2026-06-15) bridges the Stage-A cliff; review mode should build on it
   ("weak-device day").

## ▶ Committed priority order (do these in order)

1. **The Clue Writer.** A durable, Claude-authored clue-writing system (`.claude/skills/clue-writer/`)
   that reliably produces great clues: device analysis → surface-first drafting → mechanical gate
   (`clues:validate`) → blind 3-judge realism majority → **broadsheet-panel ceiling gate** (median
   surface score ≥ 4) → originality check → semantic audit → owner reads every clue. The owner's
   standing decision: clues are ALWAYS authored by Claude through this skill — no offline pipeline.
   Proven on the bank's documented workmanlike tail as its first workout. _← IN PROGRESS 2026-08-15_
2. **Accounts (Phase 2 of the daily-first spec,** `docs/superpowers/specs/2026-08-15-daily-first-ux-design.md`
   **§4).** Optional sign-in to sync streaks/progress, local-first, Supabase free tier, dark until
   the owner creates the project and adds the public URL + anon key to `.env`. Merge policy: union
   of solved items; streak recomputed honestly from merged history.
3. **Quality gate (Phase 3).** Structured heuristic review of every journey (spec §6) at 375px +
   1280px, light + dark, fresh + returning + synced profiles. **Passing this gate is the
   precondition for spending money** (domain `cruci.app`, app-store fees) and for the launch posts.
4. **Distribution.** After the gate: domain + BrowserRouter/sitemap cutover, then launch posts
   (r/crosswords, r/crypticcrosswords, Show HN). The daily + share loop is already built for this.
5. **Teaching depth.** Review mode (spaced-repetition-lite — a pure `src/engine/review.ts` scheduler
   reusing `progress.ts` + `fading.ts`) as a "weak-device day" on the Daily surface + a "your
   devices" readout. Design after the first week of real-user analytics.
5. **Corpus growth (more 3-4 letter words) — ONLY if analytics shows Play is where users are.** The
   only real fix for ≤15% repetition, but it's many hard-to-keep-original short clues; don't pay for it
   without evidence.

## Where everything lives (doc map)

| Doc | Path | Purpose |
|---|---|---|
| **This file** | `PRODUCTIONPLAN.md` | Status + roadmap. The source of truth. |
| Clue style guide | `docs/clue-style.md` | The clue bar: fairness, §1b surface realism, §1c gentle teaching register. |
| Clue pipeline runbook | `docs/clue-pipeline.md` | How to author/edit clues (with agents). |
| Bank | `src/data/bank/part-a…i.json` | 366 hand-clued Play words. |
| Teaching corpus | `src/data/clues.ts` | 44 Stage-A lesson clues. |
| Compiler | `scripts/generate-puzzles.mjs` | Builds `public/archive.json`. Repetition controls live here. |
| Engine | `src/engine/` | `fading.ts`, `progress.ts` — competence tracking (reuse for Review mode). |
| Fairness validator | `src/data/integrity.ts` + `scripts/validate-clue.ts` | Mechanical clue gate. |

## Done (changelog)

- **2026-06-03/04** — Rebrand to **Cruci** (literary design system); mobile-keyboard + responsive +
  a11y + PWA/SEO fixes; clue fairness/abbreviation validator; surface-craft passes; archive grew to 300.
- **2026-06-05 — full clue-quality roadmap (D/F/E/B/C), all deployed:**
  - **D** — closed the indirect-deletion validator gap; fixed MILD, TROOPER, OVEN.
  - **F** — rebuilt the Stage-A teaching corpus to the §1c "gentle teaching register" (real cryptic
    clues, not give-aways) + originality pass (PIGTAIL→DOGMA, MANKIND→HOGWASH, HOTDOG→JACKPOT, …).
  - **E** — inline abbreviation glosses in the hint ladder (`hydrate.ts`).
  - **B** — future-proofed `docs/clue-pipeline.md` (§1b/§1c, mandatory realism judge, originality check).
  - **C** — bank-wide §1b realism pass: **100 clues rebuilt** across parts f/d/e/h/i.
- **2026-06-07** — Reset: this doc made the single source of truth; began the bounded Play-repetition
  pass (#1 above).
- **2026-06-10 — clue-quality enforcement overhaul (mechanics + blind judging) + full rebuild of the
  failing tail:**
  - **Mechanical gate extended** (`integrity.ts`): charade `concat` composition (pieces must be
    produced by prior ops or sit verbatim in the surface and join to the answer), TRUE-internal
    `insert` verification, alternation letter-check, and rejection of swallowed indefinite articles
    ("a cake"→CAKE). Caught 9 unfair shipped clues immediately.
  - **New `src/data/surface-rules.ts`** — the single shared source for all surface checks (replaces
    the old 3-way copy-sync across lint/test/CLI): orphan-word coverage (with a budget for
    synonym-mediated cues), charade containment-glue detection, indicator-in-surface, plus the old
    word-list/caps gate. Flagrant hits now FAIL CI (`surfaces.test.ts`) and the pipeline gate
    (`validate-clue.ts`); single decorative words rank in the lint (`npm run clues:lint`).
  - **Lint triage fixed**: double-defs/cryptic-defs/&lit are legitimately short and no longer rank
    as "weakest"; gate hits top the list instead.
  - **Blind multi-judge realism protocol** (now in `docs/clue-pipeline.md` §4b): ≥3 independent
    judges over bare surfaces (no answers), majority vote — replaces the single rubber-stamping
    judge. First full run failed 109/410 surfaces by majority.
  - **Rebuilt 130 bank clues + 21 teaching clues** (union of mechanical fails, judge-majority
    fails, and a manual §1b review) via parallel setter agents hard-gated through the extended
    validator; teaching swaps per §1c (CATKIN→BARGAIN, THRONE→CARTON, SCREAM→PIRATE, ONSET→EVENT,
    BARK→RULER, PUPIL→SAFE, SHED→CHAR, PAINT→VOICE). Verified by a second blind judge round +
    semantic audit + human read-through.
- **2026-06-10 — privacy-first analytics (dark launch):** provider-agnostic `src/analytics.ts`
  (Umami Cloud; no cookies; activates when `VITE_UMAMI_WEBSITE_ID` is set in `.env`), events
  wired through ClueCard (`clue_solved`/`hint_revealed`/`give_up` with a `source` prop),
  LessonPage (`lesson_view`) and SolvePage (`puzzle_start`/`puzzle_complete`), honest
  Home/About copy. Owner action: create the site at cloud.umami.is, paste the Website ID,
  rebuild.
- **2026-06-10 — Daily Clue (live 2026-06-15):** `/daily` — one bank clue per day for everyone
  (`scripts/generate-daily.mjs` → frozen seeded schedule of 286 answers, top-80 Play-frequent
  excluded; epoch/seed are FROZEN), local-date day numbering, localStorage streaks
  (`src/state/dailyProgress.ts`), share button (hash-router-safe URL), competence-fed scaffolding
  via the existing ClueCard/fading engine, homepage primary CTA, `daily_start/solved/shared`
  events. Bank answer-set changes require `npm run daily:gen` (drift gated by `daily.test.ts`).

- **2026-08-15 — return after 2 months; audit + daily-first phase 1:** whole-clue hint fix (live
  Daily #62 bug, owner-reported); mobile nav "More" disclosure; "Daily Cryptic №1"→"Graduation
  Cryptic №1" (name collision); Play "Surprise me"; CI Node 20→24 (Sept deadline); analytics read
  for the first time — **1 visitor in 2 months (the owner)** → distribution is the bottleneck, but
  owner gates all spend on website quality first. **Daily-first UX phase 1 shipped** (spec + plan in
  docs/superpowers/): one language system ("the Daily", enforced by `src/ux-language.test.ts`),
  state-aware Home, post-solve bridges (weakest-device lesson via `src/data/weakest.ts` + shared
  surprise picker), site-wide streak chip, dead-end fixes. 74/74 tests.

## Hard rules (clue/bank editing)

- Bank edits keep answers identical (grids stay valid) and **require** `npm run clues:regen` (the
  archive-drift test fails otherwise).
- Only abbreviation cues listed in `src/data/abbreviations.ts`.
- The validator checks letter-mechanics + abbreviations only — **not** semantics, surface realism, or
  originality. Those need a human/LLM pass (see `docs/clue-pipeline.md`).
- Ship behind CI: `npm test` → `npm run build` → push to `main` → Pages deploy.

```js
// Repetition stat after a regen (top answers as % of puzzles):
node -e 'const a=require("./public/archive.json");const m={};for(const p of a){const s=new Set(p.entries.map(e=>e.answer));for(const w of s)m[w]=(m[w]||0)+1;}for(const [w,n] of Object.entries(m).sort((x,y)=>y[1]-x[1]).slice(0,8))console.log(w,Math.round(n/a.length*100)+"%")'
```
