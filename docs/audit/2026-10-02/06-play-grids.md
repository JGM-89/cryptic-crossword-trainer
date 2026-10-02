# Audit 06: Play archive grids, generation and solve UX

**Scope:** `scripts/generate-puzzles.mjs`, `scripts/check-grid.mjs`, `src/data/archive.ts` (+ test), `src/components/MiniGrid.tsx`, `src/pages/SolvePage.tsx`, `src/pages/PlayPage.tsx`, and `public/archive.json`, which holds 250 puzzles (80 at 7×7, 80 at 9×9, 90 at 13×13) built from a 415-answer bank. The archive was last regenerated on 2026-08-16 and has no clue drift against the current bank.

**Method:** I measured everything with scratch scripts under `tmp/audit/scratch/`:

- `grid-stats.mjs` measures structure, checking, repetition and banding.
- `extra.mjs` measures solid black blocks.
- `template-fill.mjs` and `tf13-*.mjs` test whether the bank can fill proper UK-style templates.
- `gen-cap.mjs` is a copy of the generator with a hard per-answer reuse cap. It writes only to scratch.

No project file was modified.

---

## TL;DR verdict

These are not UK cryptic grids. They are **freeform criss-cross puzzles**: words are dropped onto a board wherever they cross, and the leftover squares are filled black. No grid has symmetry (0 of 250). 44% of lights are less than half checked, and 39–44% start on an unchecked letter. The 13×13s are 46% black against roughly 30% in a real blocked 13×13. They are dominated by 3–4-letter answers (62% of lights), which are the weakest cryptic clues. The 415-clue bank is used 4,176 times, so the average clue appears in about 11 puzzles. The 36 three-letter answers each appear in about 39 puzzles.

Two things make it worse:

- **Difficulty bands.** The bands are effectively one band: 243 of 250 puzzles are "Moderate", 7 are "Gentle" and 0 are "Tougher".
- **Clash with the Daily.** Play and the Daily share the same bank. After 10 random Large puzzles, a solver has already seen the answer and clue for **41% of all future Daily clues**.

The bank is a hard ceiling, not a soft one. With no reuse allowed, the current generator yields about **4** 13×13 puzzles. Proper UK-style templates fill from the bank about **1% of the time** (1 of 105 13×13 templates).

**Recommendation:** shrink Play now and rebuild it later. Ship a small set of curated, properly built puzzles with their own clues, kept separate from the Daily. Do not keep 250 generated puzzles.

---

## 1. Are these real crosswords? (structure)

### 1.1 Measured grid statistics

| Metric | 7×7 (n=80) | 9×9 (n=80) | 13×13 (n=90) | Real UK blocked 13×13 (reference) |
|---|---|---|---|---|
| Rotationally symmetric grids | **0** | **0** | **0** | 100% (house convention) |
| Mean cell agreement with 180° rotation | 58.5% | 53.7% | 53.1% | 100% (a random 46%-black pattern scores about 50%) |
| Black squares, mean (min–max) | 45.3% (35–55) | 45.5% (38–56) | **46.0% (41–52)** | about 28–35% |
| White cells, mean | 26.8 | 44.2 | 91.3 | about 110–120 (my valid templates averaged 118–123) |
| Lights per puzzle, mean (min–max) | 8.4 (8–11) | 13.8 (13–17) | **26.7 (26–30)** | about 24–32 (a typical target is 28) |
| Mean light length | 4.2 | 4.2 | **4.5** | about 6–7 |
| 3-letter lights | 36.5% | 43.3% | **28.9%** | usually ≤4 per grid (about 10–15%) |
| 3–4-letter lights | 67.4% | 65.4% | **61.6%** | about 25–30% |
| 7+-letter lights | 6.7% | 9.7% | **12.6%** | about 35–45% |
| Two-letter runs | 0 | 0 | 0 | 0 ✓ |
| Unclued lights or orphan cells | 0 / 0 | 0 / 0 | 0 / 0 | 0 ✓ |
| Disconnected grids | 0 | 0 | 0 | 0 ✓ |
| White cells that are checked (in 2 lights) | 31.2% | 31.7% | 31.0% | about 38–45% (my UK templates: 36–38%) |
| White cells in only one light | **68.8%** | **68.3%** | **69.0%** | about 55–62% |
| Mean per-light checking ratio | 46.6% | 48.6% | 47.8% | ≥50% for every light |
| Lights **under half checked** | 46.0% | 44.5% | 43.7% | ~0% (Times/Ximenean norm) |
| Lights with **3+ consecutive unches** | 6.6% | 9.9% | **12.1%** | 0% (never more than 2 in a row) |
| Lights whose **first letter is unchecked** | 44.1% | 39.5% | 39.1% | common, but rarely both ends on short words |
| Lights with **both ends unchecked** | 19.4% | 20.7% | 15.1% | rare, essentially never on 3–5-letter lights |
| Lights checked **at most once** | 33.3% | 30.5% | 26.2% | 0% for lights of 4+ letters |
| Grids with a wholly black row or column | 11 | 10 | 5 | 0 |
| 2×2 solid black blocks per grid, mean | 1.2 | 1.7 | **6.9** | 0–2 |
| Grids with a 3×3 solid black block | 1 | 0 | 11 | 0 |

### 1.2 What the grids look like

Example #200 (13×13, 26 lights). Note the almost-empty north-east quadrant.

```
J A M · · G O D · · · · ·
A · · · · E · · · · · · ·
R E D · · M A P · · · · ·
· · R · I · · A · S · T ·
S Q U A S H · S · T · I ·
· · M · L · · S · R O P E
· · · W A R F A R E · · ·
S · · · N · · G · S O U P
T · C · D A T E · S · · ·
E A R · · S · · B E R T H
E · O R C H I D · D · · A
L A W · · E · · · · · · R
· · N · I N K · S T E A M
```

In example #81 (9×9) the whole bottom row is black, so it is really a 9×8 grid.

### 1.3 Verdict on structure

Some things are done correctly:

- There are no 2-letter runs.
- No cell is orphaned.
- Every grid is connected.
- Every light is a real bank answer.
- No two words touch side-by-side outside a crossing.

On those points, the grids are valid freeform criss-crosses.

Against UK cryptic conventions, they fail on the points solvers notice first:

- **No symmetry.** Experienced solvers notice this immediately. A lopsided grid with empty quadrants reads as "computer-generated word search", not "cryptic".
- **Too little checking.** In a cryptic, crossers are the solver's only confirmation of a parse. Here 44% of lights are under half checked and 26–33% are checked once at most. The result is many standalone clues sitting next to one another, not an interlocking puzzle.
- **The wrong light-length profile.** A 13×13 has the right number of lights (26.7), but they are short: 62% are 3–4 letters and only 12.6% are 7+. Three- and four-letter answers are where cryptic clues are weakest, mostly cryptic definitions, double definitions and hiddens (see §2.4). Long anagrams and charades give a cryptic its satisfaction, and they are almost absent.
- **Too much black.** 46% black and about 91 white cells make each 13×13 feel like a 9×9 with padding.

**Copy problem.** PlayPage describes the featured mini as "every cell crosses two answers". That is false. It is a 5×5 lattice with 9 of 21 cells checked (43%). `PlayPage.tsx` also says every grid is "checked for fairness", which can only refer to the clues, not the grids.

**`scripts/check-grid.mjs` is dead code.** It is the abandoned template approach, and its own `base` pattern fails its own checks: `runsOk=false cover=false`, with two 13-letter lights. Delete it or replace it (see §3).

---

## 2. Clue repetition, banding, and the Daily

### 2.1 Reuse across the archive

| Metric | Value |
|---|---|
| Clue slots in the archive | 4,176 |
| Distinct answers used | 385 of 415 (the 30 unused are all 8–13 letters long) |
| Mean appearances per used answer | **10.8 puzzles** |
| Median / p75 / p90 appearances | 7 / 13 / 24 |
| Answers at the soft cap (45 puzzles, 18%) | 15, all 3-letter: TIP, TEA, NET, DEW, EAR, ARC, ICE, SKY, ART, EGO, GOD, ELM, PEN, OWL, AGE |
| Mean appearances by length | 3-letter 39.3 · 4-letter 15.8 · 5-letter 8.8 · 6-letter 5.0 · 7-letter 4.9 · 8-letter 3.2 · 9-letter 1.5 |
| 13×13 pairs sharing ≥1 answer | **97.7%** (mean 3.3 shared, max 10) |
| Any two puzzles sharing ≥1 answer | 70.6% |

The answer and its clue are always reused together, because each bank answer has exactly one clue. Seeing EAR again means seeing "It catches a whisper and grows on a cob (3)" again, word for word.

### 2.2 What a solver experiences

**Following the "Next puzzle →" button**, which moves through the same tier in id order:

| Puzzles solved | Mini: share of the next puzzle's clues already seen | Large: share already seen |
|---|---|---|
| 2nd puzzle | 12.5% | 26.9% |
| 5th | 25% | 37% |
| 10th | 50% | 50% |
| 20th | 50% | **74%** |
| 40th | 89% | **96%** |
| Mean over puzzles 2–10 | 23% | 44% |

**Using "Surprise me"** (random picks):

- **Large:** after 1 prior puzzle, 3.4 repeated clues (12.6%). After 4 prior puzzles, 10.1 repeated (38%). After 9 prior puzzles, 16.1 of the next puzzle's ~27 clues are repeats (60%).
- **Mini:** after 4 prior puzzles, 25% of clues are repeats. After 9, 41%.

Content-wise, the whole archive contains 385 unique clues, about **14 Large puzzles' worth**. The other 236 puzzles are rearrangements.

### 2.3 Interaction with the Daily

`daily-schedule.json` cycles through **all 415 bank answers**, one per day from 2026-06-15. By 2026-10-02, 110 Dailies have run.

- All 385 answers in the archive are also Daily clues.
- 26.2% of archive clue slots are clues that have already appeared as a Daily.
- Spoilers run the other way too. After N random puzzles, a solver has seen this share of all Daily clues, including future ones:

| Puzzles solved | Large | Mini | Any |
|---|---|---|---|
| 5 | 25% | 11% | 17% |
| 10 | **41%** | 20% | 29% |
| 20 | 59% | 33% | 45% |
| 50 | 81% | 55% | 69% |

The Daily now has par scoring (commit `e9ca5b8`), and par assumes a first sight of the clue. A Play regular will "solve" a large share of Dailies from memory, which makes the score meaningless for exactly the users who are most engaged.

Learn's Stage B/C lessons also draw **19 bank clues**, so there is a three-way overlap: Learn, Daily and Play.

### 2.4 The device mix gets skewed

The generator overuses short words, and short bank words are mostly "light" devices. As a result, the archive distorts the bank's device mix:

| Device | Share of bank | Share of archive slots |
|---|---|---|
| Cryptic definition | 12.5% | **24.3%** |
| Double definition | 18.1% | 19.8% |
| Hidden | 15.9% | **20.0%** |
| Anagram | 26.3% | 16.4% |
| Charade | 18.1% | **9.4%** |
| Container | 3.1% | **1.2%** |
| Deletion | 0.2% | 0.0% |

A broadsheet usually runs 1–3 cryptic definitions and 1–2 hiddens per puzzle, with charades, containers and anagrams doing most of the work. Here 64% of Play clues are cryptic definitions, double definitions or hiddens. Example #161 (13×13) has **8 cryptic definitions out of 26 clues**, several of them question-mark riddles: "What you hit on the head? (4)", "The path of everything you throw? (3)". That is not a balanced cryptic.

### 2.5 Difficulty banding does not work

Bank clue difficulty is 2 for 127 clues, 3 for 272 and 4 for 16. Puzzle difficulty is the mean of its clues' difficulties, so with 8–30 clues it regresses to about 2.6.

| Tier | Min | p10 | Median | p90 | Max | Gentle / Moderate / Tougher |
|---|---|---|---|---|---|---|
| 7×7 | 2.2 | 2.4 | 2.6 | 2.9 | 3.0 | 4 / 76 / 0 |
| 9×9 | 2.2 | 2.4 | 2.6 | 2.8 | 2.8 | 3 / 77 / 0 |
| 13×13 | 2.4 | 2.5 | 2.6 | 2.7 | 2.8 | **0 / 90 / 0** |

The "Tougher" filter chip always shows an empty list. "Gentle" shows 7 minis and no larges. The within-puzzle standard deviation of clue difficulty is 0.5, so the puzzles differ very little from each other. Every bank clue now has a **par**, which is a richer signal, but the archive does not use it. The archive was last generated before par was added.

---

## 3. Generation approach

### 3.1 What the generator does

`generate-puzzles.mjs` is a **placement (criss-cross) generator**:

1. It seeds one word in the middle row.
2. Up to 6,000 times, it picks a random letter of a placed word, and tries bank words containing that letter perpendicular to it.
3. It accepts the **first** placement with ≥1 crossing that does not touch other words side-on.
4. Every unfilled cell becomes black.

The generator has these properties:

- **Fillable by construction**, which is its one real virtue.
- **It never targets symmetry, checking density or a light-length profile.** It does not score placements, so a one-crossing placement is as good as a five-crossing one. Low checking follows directly from the algorithm.
- **The repetition control is a soft cap at 18% (45 puzzles).** It falls back to over-cap words when starved, and usage carries over from the 7×7 tier into the 9×9 and 13×13 tiers. The cap holds exactly at the boundary for 15 three-letter words.
- **Puzzle difficulty is a mean of clue difficulties.** This guarantees the banding collapse in §2.5.
- **Output is deterministic and not re-run on bank edits.** The archive does not include `par`.

### 3.2 Is the 415-word bank a ceiling? Yes, measured two ways

**A. Ceiling with the current generator** (`gen-cap.mjs`, a hard cap, 400–500 attempts):

| Max puzzles per answer | 13×13 only | 9×9 only |
|---|---|---|
| 1 (no reuse at all) | **4 puzzles** | 9 |
| 2 | 8 | n/a |
| 3 | 12 | 25 |

Run in tier order with cap 1, the minis use up the short words: 13 7×7, 1 9×9 and 0 13×13. So a reuse-free archive from this bank is roughly **4 Large or about 15–20 minis**, not 250.

**B. Can the bank fill proper UK templates?** (`template-fill*.mjs`)

I generated random **rotationally symmetric lattice templates**. Every template met these conditions: alternate-letter checking, no run of 3+ unches, every light at least about half checked, no 2-letter runs, and connected. I then ran an exhaustive CSP fill (MRV plus no-repeat) against the 415 bank answers.

| Template | Valid templates tested | Filled from the bank |
|---|---|---|
| 7×7 | 80 | **1** |
| 9×9 | 80 | **1** |
| 13×13, lights ≤13 letters | 60 | **0** |
| 13×13, lights ≤9 letters (24–34 lights, mean 28.8–30) | 45 | **1** |

The searches did not time out. Every failure was proved infeasible. A constraint-based filler needs **thousands** of candidates per length, and pattern coverage for every `?A?E?` slot. The bank has 36 three-letter words, 78 four-letter words, 84 five-letter words, and 6 or fewer of each length from 10 to 13.

The bank is a clue corpus, not a fill lexicon, and no amount of clever generation fixes that.

### 3.3 What would produce genuinely good grids

The standard construction pipeline, which is what Times and Guardian setters and software like Crossword Compiler and Qxw do, separates **grid → fill → clues**:

1. **Templates.**
   - Use a curated library of 13×13 and 15×15 UK blocked templates with rotational symmetry and ≥50% checking per light.
   - Encode the conventions as checks: no more than 2 consecutive unches, both ends of short lights not unchecked, about 28 lights, 28–35% black.
   - Repurpose `check-grid.mjs` as the validator.
   - Ten to twenty hand-picked templates is enough, since setters reuse a small stable of grids.
2. **Fill from a large lexicon with a CSP filler** (MRV, forward checking, letter-position bitsets, backjumping).
   - Use a word list of 50–150k entries, filtered and scored by familiarity (Wikipedia or corpus frequency), with a blocklist.
   - Candidates include UKACD (the UK Advanced Cryptics Dictionary, made for this purpose; check its licence), SCOWL size 50–60 (permissive licence), or ENABLE.
   - Score fills by mean word familiarity, penalise obscure entries, and require new answers not already in the Daily bank.
3. **Clue each entry through the Clue Writer skill**, which the owner's standing decision already requires for all clue writing.
   - Clue the whole grid as a unit so the device mix can be balanced, for example ≤2 cryptic definitions, ≤2 hiddens, a spread of anagram, charade, container, deletion and reversal.
   - Clue difficulty and par come out per entry, and puzzle par is their sum.
4. **Human or editor pass and publish.**
   - Store each puzzle as a curated JSON file, not a 1.8 MB generated blob.
   - Keep Play answers out of the Daily schedule, or give them separate clues.

**Cost reality.** A 13×13 has about 28 clues. At the Clue Writer's full gauntlet (draft, gate, blind judges, panel, sign-off), that is a meaningful per-puzzle cost. Even so, 12 good Large puzzles (about 340 clues) is less work than the bank's existing 415, and is worth far more than 250 rearrangements. Minis (5×5 or 7×7 lattices, 6–10 clues) are cheap and make a good weekly cadence.

---

## 4. Solve UX observations (from the code)

**Navigation and input (`MiniGrid.tsx`):**

- **Arrow keys do not move spatially.** Right and Down both mean "next cell in the active entry", and Left and Up mean "previous". You cannot arrow into a neighbouring entry or change direction with arrows.
- **No Tab or Shift-Tab to the next clue, and no auto-advance at the end of an entry.** `advance()` stops at the last cell, so typing past the end silently **overwrites the last letter** again and again.
- Backspace on an empty cell moves back without clearing the previous letter. That is acceptable but non-standard; most apps clear and move.
- A tap on a crossing cell toggles direction, which is good. A tap on a new cell defaults to Across.
- The hidden proxy `<input>` for the mobile keyboard is correct. The scroll-into-view of the active cell is good.

**Checking and reveals:**

- Only **whole-grid** "Check grid" exists. In a full cryptic, checking one entry or one letter is the norm. Checking the whole grid is a heavy spoiler: it marks every wrong letter everywhere.
- The only reveal is "Reveal selected" (whole entry). There is no reveal-letter, even though the Daily now has letter reveals. There is also no clear-entry, clear-wrong or reveal-all.
- **Reveals count as solving.** A revealed entry fires `onEntrySolved`, and if every entry is revealed, "Check grid" still triggers `markCompleted` and the "Solved!" celebration. Play has no notion of an assisted solve, no timer and no par, so it is out of step with the Daily's par scoring.
- The Definition and Clue-type hints are a good Cruci-specific touch. The parse shown after solving is excellent for learning.

**Persistence:**

- Only `fill` is autosaved. `cellStatus` (correct-cell locks), solved ticks, revealed entries and hint levels are lost on reload. A half-finished Large comes back without its ✓s.

**Mobile:**

- Below 760px the layout stacks: grid first, then the whole clue list. There is **no sticky "current clue" bar** next to the grid. On a phone, the solver scrolls between grid and clues, and the on-screen keyboard covers the clue list. This is the biggest mobile UX gap.
- A 13×13 cell at 375px is (375−48)/13, about **25px**. That is well under the 44px tap-target guideline, and the 0.62rem number overlaps the letter.

**Accessibility:**

- The grid uses `role="grid"` and `role="gridcell"` but has no `role="row"`. Black cells are `aria-hidden`, which breaks the row and column structure for screen readers.
- Cells are clickable divs and cannot be reached by keyboard on their own. All input goes through the proxy input, so a screen-reader user cannot explore the grid.
- The aria-live announcements after Check and Reveal are good.

**PlayPage:**

- The band filter is effectively broken (§2.5).
- "Solved X of 250" encourages volume, which is exactly where repetition is worst.
- The featured-puzzle copy is inaccurate (§1.3).
- "Next puzzle" walks id order within a tier, which is the worst order for repetition (§2.2).

---

## 5. Prioritised recommendations

| # | Recommendation | Effort | Impact |
|---|---|---|---|
| 1 | **Shrink Play now.** Regenerate with a **hard** cap (≤2 appearances per answer) and keep only what that yields: about 25–40 minis plus a handful of Large puzzles. Or temporarily hide the Large tier. Label the puzzles honestly ("practice criss-crosses", not "full cryptics"). | S (a config change, then regenerate) | High: removes most repetition at once |
| 2 | **Decouple Play from the Daily.** At minimum, exclude Daily answers scheduled in the next N days from Play, or stop using the bank for Play entirely (see #6). Otherwise the Daily's par scoring is undermined for engaged users. | S–M | High |
| 3 | **Fix banding.** Compute puzzle par as the sum of bank `par` (now available). Band by within-tier tercile, or drop the bands. Remove the always-empty "Tougher" chip. Regenerate so `par` reaches the archive. | S | Medium |
| 4 | **Fix the inaccurate copy** ("every cell crosses two answers"; "full cryptics" for these grids). Delete or replace `check-grid.mjs`. | XS | Low–Medium (trust) |
| 5 | **Solve-UX essentials:** a sticky current-clue bar on mobile; Tab/Shift-Tab and auto-advance to the next clue; spatial arrow keys; check-entry, check-letter and reveal-letter; persist ticks, locks and reveals; mark assisted solves differently from clean ones; optional par or timer. These also benefit the featured puzzle and any future curated puzzles. | M | High (any grid is only as good as solving it) |
| 6 | **Rebuild properly:** a symmetric UK template library, a CSP filler over a 50–150k familiarity-scored lexicon, every entry clued through the Clue Writer with a balanced device mix, and a curated release cadence (for example one 13×13 a fortnight plus weekly minis). Play answers stay out of the Daily pool. | L (filler about 1–2 days; lexicon curation plus the clueing pipeline is the long pole; about 28 Clue Writer clues per Large) | Very high: the only route to "real" cryptics |
| 7 | **Rebalance the device mix in any regenerated or curated grid:** ≤2 cryptic definitions and ≤2 hiddens per Large, and make sure containers, deletions and charades appear. | S (as a filler constraint) / part of #6 | Medium |
| 8 | **Do not expand the bank to rescue the placement generator.** Adding 3–4-letter words to lower the cap only makes the grids more short-word-heavy and more cryptic-definition-heavy. The bank should grow for the Daily and Learn, not to feed the grids. | n/a | Avoids wasted effort |

### Cut, shrink or rebuild?

- **Not a full cut.** Grid solving is the payoff the curriculum builds towards, and the solve shell (MiniGrid) is worth keeping and improving.
- **Shrink immediately** (#1–#4, about a day). A small, honest, low-repetition set beats 250 near-duplicates. The current archive actively harms the Daily and undersells the clue quality.
- **Rebuild as curated** (#6), in this order: (a) the UX improvements in #5, (b) the template, filler and lexicon tooling, (c) a first batch of 4–6 properly built puzzles with clues written through the Clue Writer. After that, grow by cadence, not by count. The goal is "a dozen genuinely good cryptics", not "an archive of 250".

---

### Appendix: reproducing the numbers

```
node tmp/audit/scratch/grid-stats.mjs        # §1, §2 tables, sequential/random repetition, device mix, banding
node tmp/audit/scratch/extra.mjs             # solid black blocks
node tmp/audit/scratch/template-fill.mjs     # UK lattice templates (7/9/13) vs the bank
node tmp/audit/scratch/tf13-0.22.mjs         # 13x13, lights <=9, denser blocks
ONLY=13 HARD=1 CAP=1 ATT=500 node tmp/audit/scratch/gen-cap.mjs   # reuse-free ceiling (writes to scratch only)
```

The reference figures for real UK grids (black %, checking, light-length profile) are convention-level ranges from Times/Guardian-style 13×13 and 15×15 blocked grids. My own valid symmetric templates corroborate them (118–123 white cells, 36–38% of white cells checked, 25–30 lights).
