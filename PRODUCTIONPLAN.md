# Cruci — Production Plan & Roadmap

> Living strategy doc. Persists the current direction across work sessions.
> **Last updated:** 2026-06-04 · **Goal:** _a product people use_ (not a craft/portfolio piece).
> New session? Read this first, then `docs/clue-pipeline.md` only if doing clue work.

---

## ▶ NEXT SESSION — start here (updated 2026-06-05 — D/F/E/B/C ALL DONE; do Phase-1 product work next)

**The entire clue-quality roadmap (D, F, E, B, C) is finished and deployed.** The highest-leverage
work now is **Phase 1 below** (analytics 1a, compiler repetition fix 1b, Review mode 1c) — the
strategy pivot's actual priorities, still untouched. Start there.



The device-free **sentence-realism floor-raise of 111 bank clues is DONE + live** (every clue must
read as a real sentence a person would say; see `docs/clue-style.md` Axis 1b). Remaining work, in
priority order — full detail in `~/.claude/plans/how-do-we-better-serene-marshmallow.md` (top section):

1. **D — DONE + deployed (2026-06-05, commit `199f972`).** Added the indirect-deletion guard to
   `integrity.ts` (deletion fodder must appear literally in the surface, mirroring the anagram rule;
   `validate-clue.ts` inherits it). Re-clued **MILD** → double-def *"Gentle type of ale"* and
   **TROOPER** → charade *"Mounted policeman escorts soldiers and the Queen"* (TROOP+ER). The new gate
   also caught a **3rd** indirect deletion the bank-only scan missed — **OVEN** (`deletion-004` in the
   teaching corpus `clues.ts`, "Witches' group, beheaded…") — fixed to a fair direct deletion
   *"Coven, losing its head, becomes a cooker"* (its full §1b polish folded into F). Archive regen'd;
   27 tests + build green.
2. **F — DONE + deployed (2026-06-05, commit `083fe45`).** Rebuilt the Stage-A teaching corpus to a
   NEW bar. **Key learning: "beginner ≠ transparent"** — making teaching clues transparent produced
   non-cryptic give-aways (owner rejected 2 attempts). Researched real published gentle cryptics
   (Guardian Quick Cryptic, Alberich) and derived **`docs/clue-style.md` §1c "gentle teaching
   register"**: a teaching clue is a FULLY real cryptic clue (parts disguised, one natural sentence,
   def woven, mechanic hidden in an idiom), only *gentle* in vocabulary/device — never in disguise.
   **Teaching answers are NOT grid-locked → swap the answer, keep the device.** Rebuilt PIGTAIL→DOGMA,
   MANKIND→HOGWASH, HOTDOG→BIGWIG, STRAW→PETS, EACH→ANGER, EDGE→STAR; reworded OVEN. Good sections left
   intact. No `clues:regen` (teaching corpus not in archive). 27 tests + build green. (THRONE's
   "Ron"-arbitrary container surface is a known minor weak-spot left for a future light polish.)
3. **E — DONE + deployed (2026-06-05, commit `2c9184a`).** `hydrateClue` appends `abbreviationNote()`
   to hint rung 3: every `abbreviate` op is glossed ("Crossword shorthand worth learning — 'energy' =
   E (the symbol from physics)"), with a curated `ABBR_WHY` map for unambiguous reasons and a plain
   cue=letters fallback; first-letter devices skipped. The bank hydrates through the same path, so it
   helps Stage-A lessons AND Stage-B/C bank clues. Fixes "fair but opaque to beginners".
4. **B — DONE + deployed (2026-06-05, commit `3c5ef3d`).** `docs/clue-pipeline.md` rewritten: SETTER +
   EXPANSION lead with the §1b bar (real sentence > woven def > no narrated mechanic > no orphan >
   fair) + device-free; new SENTENCE-REALISM JUDGE template + MANDATORY loop step 4b (judge →
   device-free rebuild → human read every change), above the wit polish; new step 4d originality
   web-check (reword verbatim copies; swap answer if surface is letter-forced); stale "teaching corpus
   left as-is" lines corrected to §1c.
5. **C — DONE + deployed (2026-06-05, commits `2b20510`/`b7f2502`/`ebf8c5a`/`c6d029e`/`c86a741`).**
   Diagnostic (3 read-only §1b judges) flagged ~132 raw; re-triage removed ~25 standard-indicator
   false positives → ~105 genuine fails, concentrated in pre-§1b parts d/e/f/h/i. Rebuilt **100 bank
   clues** to §1b (f 7 + d 14 + e 18 + h 36 + i 25), keeping grid-locked answers, hand-built (the
   setter-agent route content-filtered). Left standard-indicator clues as-is (REIN/IDOL/STEEL/MORNING/
   WEATHER/HYMN homophones, STRESSED/DESSERTS reversals, CLOUD). 27 tests + build + deploy green.

Then: regen → `npm test` → build → commit → deploy. Process that works (after earlier failures):
**device-free re-clue → adversarial sentence-realism judge → human reviews EVERY change** (don't
trust agent self-reports). Helpers: `clue-chunk/assemble/patch.mjs`, `validate-clue.ts`,
`lint-surfaces.mjs`, `clues:regen`.

**HOW TO WRITE TO THE BAR:** the authoritative spec is `docs/clue-style.md` **Axis 1b "Surface
realism (PASS/FAIL)"** (real sentence / conversation test / integrated def / no recipe / no orphan
words / "change the device" fix; ranked above wit). ⚠️ The `docs/clue-pipeline.md` EXPANSION/SETTER
templates are STILL PRE-BAR until task **B** rewrites them — so when doing **F** and **C**, follow
`clue-style.md §1b` + the device-free→judge→human-review process directly; do NOT blindly reuse the
old templates (they'd reproduce the recipe/orphan mistakes).

---

## Where things stand (2026-06-04)

- **Live:** https://jgm-89.github.io/cryptic-crossword-trainer/ (GitHub Pages, CI-gated).
- **Bank:** 366 hand-clued single-word answers (`src/data/bank/part-a…i.json`); fairness-validated.
  **Surface floor-raise DONE (2026-06-04):** ~111 clues that read like cryptic *recipes* or fragments
  were rebuilt **device-free** to a hard **sentence-realism** bar (every clue must be a real sentence
  a person would say, def integrated, no orphan words). See `docs/clue-style.md` §1 axis 1b. The
  device-locked surface polish before this was the mistake; freeing the device was the fix. **Now
  do not keep polishing** — only fix a clue if a real user reports a specific one.
- **Archive:** 300 generated puzzles (`public/archive.json`) — 50× 7×7, 50× 9×9, 200× 13×13.
- **Learn:** fading engine + per-device competence (good architecture), but only ~44 teaching clues
  and a single Stage-D puzzle.
- **Infra worth keeping:** fairness validator (`scripts/validate-clue.ts`), style guide
  (`docs/clue-style.md`), clue pipeline (`docs/clue-pipeline.md`), fading engine (`src/engine/`).

## The decision (why this plan exists)

We over-invested in **clue surface polish**, which has near-zero leverage. Evidence:

- **Repetition is Play's real flaw.** 300 puzzles are built from 342 words (avg 18.7 uses each).
  **ART is in 58% of all puzzles, AGE 57%, EAR 53%, TIP 46%, RED 45%.** Players see the same short
  words with the same clue over and over — far more noticeable than any surface nicety.
- **The mission (teaching) is the thin half** — no review/spaced-repetition, no weak-device
  diagnostics, a cliff from Stage A to real puzzles. The fading engine already tracks the data to
  fix this; we just don't surface it.
- **We're blind** — zero analytics/user signal.

**So:** pause the clue-quality treadmill. Invest in **(1) user signal, (2) content variety,
(3) teaching depth**.

---

## Phase 1 — high-ROI wins (start here; mostly reuses existing code)

### [ ] 1a. User signal — privacy-first analytics
- Add cookieless, no-PII analytics (recommended: Plausible cloud **or** self-hosted Umami) via a thin
  `src/analytics.ts` wrapper. Keep all *progress* local; only anonymous aggregate events leave the
  browser.
- Track a few key events: lesson started/completed, hint-rung revealed (by device), puzzle
  opened/completed, clue solved/given-up.
- Update the HomePage claim (`src/pages/HomePage.tsx`, ~line 116 "nothing sent to a server") to be
  accurate: "your progress stays in your browser; anonymous usage stats only."

### [ ] 1b. Content variety — fix repetition in the compiler (`scripts/generate-puzzles.mjs`)
_No new content needed for the bulk of the win._
- Track global usage counts while building the archive; in candidate selection (`generate()` → the
  `answers.filter(...)`/`shuffle` step) **weight toward least-used and longer words**, and **cap**
  any answer at ~12–15% of puzzles.
- Strengthen dedup: reject a puzzle sharing > ~40% of answers (Jaccard) with an already-accepted
  puzzle of the same size (today only exact-signature `sigs` matches are rejected).
- **Target:** top-answer appearance drops from 58% → ≲15%.

### [ ] 1c. Teaching quick wins (reuse data already in `src/engine/progress.ts`)
`progress` already stores per-device `solvedNoHint/solvedWithHint/attempts/bestTimeMs` and
`solvedClues{hintsUsed}`.
- **Weak-device diagnostics:** a "your devices" readout on `LearnPage`/`HomePage`
  ("strongest: anagram · needs work: homophone") from existing competence records — no new tracking.
- **Review mode (spaced-repetition-lite):** new `src/pages/ReviewPage.tsx` that re-serves
  previously-solved clues, prioritising hint-aided + least-recently-seen. A small **pure scheduler**
  `src/engine/review.ts` (+ `review.test.ts`, like `fading.ts`) decides what's "due"; reuse
  `ClueCard`/`HintLadder` and wire a route.

## Phase 2 — deeper investment (after Phase 1 ships + analytics report)
- **Deepen Learn:** more clues per device; a real **Stage C → D ladder** (graded mini-puzzles, not a
  single daily); first-run **onboarding**.
- **Corpus growth — only if 1b proves insufficient:** build the long-deferred **generate-then-verify
  pipeline** (`README.md:74`) emitting answers+clues through `scripts/validate-clue.ts`, rather than
  resuming hand-authoring.

---

## Verification (per item)
- **1b:** `npm run clues:regen`, then recompute top-answer puzzle-appearance % (snippet below) →
  each ≲15%; `npm test` green (incl. archive-drift); spot-play to confirm grids feel distinct.
- **1c:** unit-test `review.ts`; manually solve lessons, confirm Review queue surfaces hint-aided
  clues and the diagnostics match `progress` state.
- **1a:** events fire in the network tab; no cookies/PII; HomePage copy accurate; site builds/deploys.
- Everything ships behind the existing CI gate: `npm test` → `npm run build` → Pages deploy.

```js
// recompute the repetition stat after regen:
node -e 'const a=require("./public/archive.json");const inP={};for(const p of a){const s=new Set(p.entries.map(e=>e.answer));for(const w of s)inP[w]=(inP[w]||0)+1;}for(const [w,n] of Object.entries(inP).sort((x,y)=>y[1]-x[1]).slice(0,8))console.log(w,Math.round(n/a.length*100)+"%")'
```

## Explicitly NOT doing now
- ❌ No more surface-polish passes or full adversarial clue audits (paused — diminishing returns; the
  bank is good enough). Fix individual clues only if a real user reports one.
- ❌ No accounts/backend/monetisation yet — revisit once usage data shows real retention.

## Hard rules (unchanged, from `docs/clue-pipeline.md`)
- Bank edits keep answers identical (grids stay valid) and **require** `npm run clues:regen` (or the
  archive-drift test fails).
- Only abbreviation cues in `src/data/abbreviations.ts`.
- Don't touch the Stage-A teaching corpus (`src/data/clues.ts`) for clue-quality work.
