---
name: clue-writer
description: Author or rewrite Cruci cryptic clues to the house bar — device analysis, surface-first drafting, mechanical gate, blind realism judging, broadsheet ceiling panel, semantic audit, owner sign-off. Use for ANY clue writing - bank rewrites, teaching-corpus edits, or corpus expansion. Clues are ALWAYS authored by Claude through this skill (owner's standing decision, 2026-08-15).
---

# The Cruci Clue Writer

You are the setter. This skill is the gauntlet every clue runs before it ships. The style
contract is `docs/clue-style.md` (§1b surface realism, §1c teaching register, §2 fairness,
§5 device templates, §6 output contract) — **read it in full first**, plus
`src/data/abbreviations.ts` (the only permitted abbreviation cues). This file adds the
*process*; the style guide governs *content*.

## Modes

- **rewrite** (bank): the answer is grid-locked — identical letters, device free. Output a
  patch object for `scripts/clue-patch.mjs`.
- **teach** (`src/data/clues.ts`): §1c register; the answer is swappable (keep the lesson's
  device, swap the word if it can't reach a natural surface). Edit the TS file directly.
- **expand** (new bank answers): dedupe against every bank part AND the teaching corpus.
  After merging: bump counts in README/HomePage, run `npm run daily:gen` (the daily schedule
  references the answer set), then the usual regen.

## The gauntlet (per answer)

**1. Raw-material analysis — before any drafting.** Enumerate what the letters offer:
hidden carriers (real word pairs spanning the answer), anagram fodder (letter-verified,
natural words), charade splits, container splits (STRICTLY internal insertions), reversals,
double-definition senses, homophones (true BrE), &lit potential. List at least THREE viable
devices. If the answer is letter-forced into chestnut territory, note it — originality (step 6)
will bite.

**2. Surface-first drafting.** Write ≥4 candidates across ≥3 devices. Write the SENTENCE
first — something a person would say — then check the parse maps onto it word-for-word:
every surface word must be definition, indicator, fodder, an operation's cue, or a genuine
link word. Then the §1b self-test aloud. Known traps (all have shipped before; the validator
now catches most):
- containment words gluing a charade (in/into/about/around/holding…);
- "a <word>" swallowed as a literal piece (the A must count or be absent);
- non-word intermediate anagram pieces: the indicator must govern the WHOLE compound fodder;
- bogus micro-synonyms ("in a way" → LY is not a thing; every piece must be a real synonym,
  a listed abbreviation, or an explicit first-letter device);
- long -LY adverbs and forced-fodder long anagrams resist wit — prefer a cryptic definition
  or &lit, and if nothing sings, flag the answer to the owner instead of shipping filler.

**3. Mechanical gate.** Emit BankEntry JSON (contract in style guide §6) to a tmp file and run
`npx tsx scripts/validate-clue.ts tmp/<file>.json` until every candidate is `ok:true`.

**4. Blind realism (majority of three).** Strip candidates to bare surfaces (`{id, text}`,
no answers, no enum) mixed together across the batch. Dispatch THREE parallel judge agents —
lenses: newspaper subeditor ("would I print this sentence?"), read-aloud ("could this leave a
real mouth?"), scene coherence ("one picturable scene?"). A surface failed by ≥2 judges is
dead. Never self-certify realism — history shows the author always passes their own surfaces.

**5. Ceiling panel (the greatness gate).** Three parallel panelist agents score each surviving
surface: SURFACE 1–5 ("could this appear verbatim in a broadsheet cryptic?") and WIT 1–5
(penny-drop strength). Keep only candidates with **median surface ≥ 4, median wit ≥ 3, and no
single surface score ≤ 2**. If nothing survives, return to step 2 with different devices
(maximum three rounds, then present the best-of to the owner with the scores and let them pick
or park the answer).

**6. Originality (chestnut answers).** Constructions are shared knowledge (DOG+MA is
letter-forced); SURFACES must be ours. Web-search any surface on a short/common answer; reword
near-verbatim matches of published clues. "Exists nowhere" is impossible for chestnuts — the
bar is *our wording*.

**7. Winner + artifacts.** Pick by penny-drop among survivors. Write the full `parse` (it is
hint rung 4), honest `difficulty`, and check the `indicator` appears VERBATIM in the surface
(it is quoted in rung 3). Bank clues also need a **`par`** (the Daily's target score) set
through the par rubric in `docs/clue-style.md` §7b: A/B/C from the rubric, D/E by three
blind judges (majority). For a whole batch, re-run `scripts/par-baseline.mjs` → judges →
`scripts/par-apply.mjs`; `bank.par.test.ts` fails on any clue without one.

**8. Semantic audit.** One auditor agent over the finished batch: every synonym real, both
dd senses genuine, homophones true in BrE, definition a real synonym in the right part of
speech, def-by-example flagged (`?`/perhaps), no word without a cryptic role.

**9. Apply + verify.** Bank: `node scripts/clue-patch.mjs <part> tmp/<fixes>.json` →
`npm test` → `npm run clues:regen` (any bank clue-text change) → build. Teach: edit
`clues.ts`, run `integrity`/`curriculum`/`surfaces` tests. Expand: see Modes.

**10. OWNER GATE — mandatory, never skip.** Present every changed clue (old → new, with the
parse and the panel scores) and WAIT for the owner's read before pushing. The owner reads
every clue that ships; agent/self-reports are never sufficient.

## Judge / panelist prompt cores

**Blind judge (adapt the lens):** "Read {file}: JSON array of {id, text}. Judge each text as
PLAIN ENGLISH PROSE on its own — do not guess at hidden purposes. FAIL if: not a sentence or
natural phrase a person would say; grammatical but an incoherent scene; broken by filler
interjections (', oddly,' ', we hear,' where no writer would put them); comma-spliced
fragments. PASS generously: imperatives, questions, compact noun phrases, whimsical-but-
coherent scenes. Write FAILS-only JSON to {out} as [{id, reason}]."

**Panelist:** "You are a broadsheet crossword editor. Read {file}: JSON array of
{id, surface}. For each, score SURFACE 1–5 (5 = could appear verbatim in a Times/Guardian
cryptic; 3 = competent but flat; 1 = crosswordese) and WIT 1–5 (5 = real penny-drop; 3 =
mildly pleasing; 1 = mechanical). Judge the sentence as prose plus its plausibility as a
clue — you may NOT see answers. Write JSON to {out} as [{id, surface, wit, note}]."

**Auditor:** as `docs/clue-pipeline.md` SEMANTIC AUDITOR template.

## Batching

Judge/panel once per batch, not per clue. For whole-part rebuilds use the loop in
`docs/clue-pipeline.md`; this skill is the per-answer/per-batch authoring core it delegates to.
