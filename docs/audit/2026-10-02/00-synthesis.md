# Cruci macro audit — synthesis (2026-10-02)

Seven independent critics (Claude Opus 5.5 subagents) reviewed the project; their full reports
are alongside this file (01–07). This page combines them, with the owner's stated priority
first: **getting the best clues with the best surfaces, reliably.**

## The verdict in five lines

1. **The fairness machinery is genuinely good.** The validator, abbreviation whitelist and
   letter-accounting are the strongest part of the project.
2. **The clue system filters but doesn't create.** It drafts few candidates in one context, so
   they're correlated. It judges with uncalibrated scores from the same model, and scores wit
   without the answer. Under that pressure it drifted to the least-checked, easiest-to-pass
   device: part-j is 44 of 49 cryptic/double definitions.
3. **Measured quality of the shipped bank:** about 40% broadsheet-grade, 37% competent but flat,
   23% weak, including about 17 unsound clues (02). Padding is in 17% of clues; 31 of 75
   charades print a piece of the answer in the clue.
4. **Play's grids aren't real UK cryptics** (06). There's no symmetry, about 46% of cells are
   black, and checking is poor. The 415-word bank is a hard ceiling. Play also leaks future
   Daily clues: 10 Large puzzles show 41% of them.
5. **Nothing has been tested by a human solver**, and there are still zero users. The site copy
   says "hand-clued", but Claude writes the clues — an honesty problem to fix first (04).

## Already fixed during the audit

- **Crash:** solving an &lit / initialism / alternation clue blanked the page. That covers
  Daily #13 MEND (reachable via the new archive) and #359 VILE. Fixed and deployed in `ae5bffe`.

## Clue and surface quality: the combined roadmap

Ordered so that every step either removes known-bad output or adds *measurement* before more
writing. Effort: XS < S < M.

### Phase 0: stop shipping known failure modes (XS–S)
- **Rewrite the unsound and weakest clues.** The ~17 unsound clues plus the 02 top-20:
  GENERAL, DETAIL, ORGAN, HARM, BLASTED, GRENADE, CHARITY, MUSHROOM, COB, WONDER, STEAM,
  WARFARE, WORKSHEET, EARLOBE, OVERNIGHT, OUTLOOK, STARLET, OFFSHORE, MONARCH, GRANDMOTHERLY.
  In the teaching corpus: EVENT, CARTON, PIRATE. Also re-check part-j's cryptic definitions and
  the weak definitions (JAM, BAY, HILL, CLIFF, HARP). Each goes through the Clue Writer; 02's
  rewrites are drafts only.
- **New mechanical gates:**
  - fail any single idle word (today only multi-word spans fail);
  - detect a charade piece printed verbatim in the clue;
  - mechanical coverage for cryptic and double definitions, which are 31% of the bank and
    currently skipped.
- **Device quota:** cryptic + double definitions ≤ 25% per batch.
- **CD contract:** every cryptic definition must state its misleading reading and its true
  reading.
- **One canonical threshold set.** The skill is the authority; the style guide and the pipeline
  doc point at it.

### Phase 1: measure before writing more (S–M)
- **Cold-solver gate (the top single fix, 01).** A fresh agent sees only `clue (enum)` and must
  solve it. It records: solved?, unique?, solved from the literal reading alone? (that means a
  quiz clue, not a cryptic definition), and near-equal alternatives (unfair).
- **Split judging by what the judge knows:**
  - *Naturalness:* blind "spot the clue" decoy test — candidate surfaces mixed with real
    sentences and headlines.
  - *Fairness:* the cold solver.
  - *Wit:* judged only after the answer and parse are revealed.
- **Pairwise tournaments** (both orders, Bradley–Terry) instead of absolute 1–5 scores.
- **Calibration anchors.** Use George Ho's ~500k-clue dataset *locally*, for checking only —
  never shipped or quoted; the clue texts are the publishers' copyright. Uses:
  - mix published clues into every judging batch, and ship only if ours ≥ the median anchor;
  - track judge discrimination (AUC) per batch;
  - automated fuzzy originality check, replacing ad-hoc web searches.
- **Provenance ledger** committed (`src/data/bank/ledger.jsonl`). Per clue: candidates,
  tournament rank, solver result, anchors, model, date, owner verdict.

### Phase 2: generate better (M)
- **Scene brief before drafting** (Ximenes' DAINTILY method). Pick a subject area and a scene,
  then choose synonyms, indicators and abbreviations from that scene's world.
- **Alternative-sense table** for every piece (e.g. ring = O, but also phone, boxing,
  jewellery). Prefer senses that belong in the scene; this is where misdirection comes from.
- **Wide generation.** 20–40 candidates per answer from 4–6 independent setter agents, each
  locked to one device and one surface domain (sport, kitchen, Westminster, office, garden,
  theatre, pub). Cheap filter chain: validator → cold solver → decoy test. Spend the tournament
  only on the survivors.
- **`scripts/raw-material.mjs`.** Mines anagram fodder and hidden-word carriers from real
  phrase corpora (Wiktionary idioms, n-grams, MAGPIE), plus synonyms (WordNet) and reversal
  words. The LLM then finds the scene; it doesn't recall the parts from memory.
- **Required misdirection moves** across each answer's candidates: lift-and-separate, a
  part-of-speech shift, a deceptive sense, a capitalisation trick, a cryptic-definition or
  &lit attempt.
- **Anti-cliché pass.** Mine over-used templates from the bank's own surfaces and penalise
  them. Use verbalized sampling to reach the less obvious candidates.
- **"Search test" lint** (Alberich): flag word joins that are never attested in n-gram data.

### Phase 3: humans in the loop (S, needs people)
- **Blind solver test:** 30 Cruci clues against 30 published easy clues, rated by 5–10 real
  cryptic solvers. It's the only external measure of "great", and it's free.
- **Owner gate redesign:**
  - show 2–3 finalists per answer, with no scores;
  - the owner solves first, then picks; cap a session at 20 clues;
  - log every pick → a house-taste exemplar file used as few-shot examples in setter prompts.
- **Daily feedback loop:** a 👍/👎 after each solve, plus give-up rate and score vs par from
  analytics. Retire or rewrite outliers. Later, check which pre-ship gates actually predict
  delight, and drop the ones that don't.

**Targets:**
- broadsheet-grade share 40% → 70%+;
- our clues ≥ the median published anchor pairwise;
- CD + DD ≤ 25%;
- owner first-pass acceptance rising.

## Other areas: top findings

**Product (04)**
- Fix the "hand-clued / originally authored" copy now, and add a plain AI disclosure plus a
  "flag this clue" button.
- Pause accounts: they're pure carrying cost with zero users.
- Small private distribution *is* how quality gets measured. Run a soft launch to 20–40 people
  after Phase 0; save the big launches (Show HN, Reddit) for later.
- Real differentiators: a machine-verified parse for every clue, and unlimited practice at your
  weakest device. The Daily, par and fading are now table stakes; Minute Cryptic, CrypticCrab
  and others have them.
- Run a trademark search on "Cruci" before buying the domain.

**Learning and UX (05)**
- The definition hint gets removed first as help fades, but it's the most valuable one — keep it.
- Lessons can't be replayed, so the "Sharpen your X" link dead-ends.
- No worked examples before testing; no abbreviations unit.
- Advancement is gameable and measures the easiest clues.
- Daily and Learn share clue IDs, so solving a Daily silently pre-solves (and spoils) lesson
  cards.
- Accessibility: hint-menu focus, live announcements for revealed hints, and touch targets.

**Play (06)**
- Now: cap each answer at 2 appearances, keep Play's answers separate from the Daily's, band by
  par, and fix the false "every cell crosses two answers" copy.
- Later: real symmetric UK templates, filled from a big word list with a proper constraint
  solver, every clue through the Clue Writer, released as a few curated puzzles. Growing the
  bank won't rescue the current generator — 105 proper templates were tested and only 1 could
  be filled.

**Engineering (07)**
- Bugs:
  - revealed entries count as clean solves in the graduation grid;
  - one failed archive download sticks until a full reload;
  - a lapsed streak still displays;
  - an autosave effect race on the grid.
- `archive.json` is 1.84 MB; pointing at the bank instead of repeating clues makes it 12×
  smaller.
- No service worker yet, so the PWA doesn't work offline.
- Dependencies are well behind; react-router has a known vulnerability (fixed in 6.30.6).
- Add a pull-request CI check.
- For future sync: one storage layer plus a log of solve events, starting now.

## Recommended overall order

1. Honesty copy + AI disclosure + flag-a-clue (XS).
2. Clue Phase 0 (rewrites + gates + quotas).
3. Clue Phase 1 (cold solver, tournament, anchors, ledger).
4. Blind solver test + soft launch (the first real evidence).
5. Play quick fixes (repetition cap, Daily separation); Learn quick wins (keep the definition
   hint, replayable lessons, separate Daily IDs); engineering bug fixes.
6. Clue Phase 2 (scene-first wide generation).
7. Decide on accounts, the domain and the app once the kill/continue criteria in 04 have data.
