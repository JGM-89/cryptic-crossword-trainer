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
  accounts, **no analytics yet**.

## Current problems (priority order)

1. **We're blind.** Zero analytics — no idea if anyone uses it or where they drop off. Every content
   decision is a guess.
2. **Play repetition.** The bank has only **14 three-letter words**, but 13×13 grids need many short
   crossers, so a few short words dominate (ART ~58% of puzzles, AGE 57%, EAR 53%). True ≤15% needs
   more short words; until then we reduce demand + flatten.
3. **Learn is thin.** Good engine, but only 44 lessons, a cliff from Stage A to real puzzles, and no
   review/spaced-repetition.

## ▶ Committed priority order (do these in order)

1. **Play repetition — bounded pragmatic pass.** Rebalance `scripts/generate-puzzles.mjs` toward more
   small puzzles + fewer dense 13×13, with usage-weighting + a moderate ~30% cap. Regenerate ONCE,
   accept the outcome (~ART 58% → ~25-30%), ship. ≤15% is deferred to corpus growth (#4). _← IN PROGRESS_
2. **Analytics (privacy-first).** `src/analytics.ts` + a few key events (lesson/puzzle start+complete,
   hint-rung revealed by device, give-up) + honest HomePage copy. Provider-agnostic; activates when a
   Plausible/Umami snippet is added (the one decision the owner makes). Unblocks evidence.
3. **Teaching depth.** Review mode (spaced-repetition-lite — a pure `src/engine/review.ts` scheduler
   reusing `progress.ts` + `fading.ts`) + a weak-device "your devices" readout.
4. **Corpus growth (more 3-4 letter words) — ONLY if analytics shows Play is where users are.** The
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
