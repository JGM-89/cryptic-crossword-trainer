# Baseline — the shipped bank, measured (2026-10-03)

> **AI-calibrated, not human-validated.** Judges: Claude and Astra (ChatGPT), templates v1/v1.1,
> calibrated in `calibration-results.md` (runs 1–2). Every clue's scorecard is in
> `src/data/bank/ledger.jsonl` (run `baseline`).

**What was measured:** all 415 bank clues, each compared head to head with up to two published
UK broadsheet clues for the **same answer** (810 anchors), in both orders, plus a cold solve,
definition-only probe and evidence audit. Position bias: 51% (none).

## Headline

| Measure | Result |
|---|---|
| Surface (natural English) win rate vs published clues | **74%** |
| Wit (fair "aha") win rate vs published clues | **48%**: just under parity |
| Beat or tie the published clues on **both** | **186 / 408** (46%) |
| Definition alone gives the answer away | **38%** of ours vs **28%** of published |
| Cold-solve rate | 98%: our clues are easy for experienced solvers |
| Clues with an exam fault | 15 |

**Reading it:**
- Cruci's surfaces are smoother than typical published clues; years of surface-realism work
  shows.
- The "aha" is merely average, and too many definitions are transparent. The owner felt this
  directly on Daily #111 TELEVISION (CL-054).

**Self-preference is real.** With Claude judges alone, wit was 55% and 253 clues beat the anchors.
Adding Astra brought that to 48% and 186. Claude rates Claude-written clues more kindly, so the
exam must keep a second model family on the panel.

## By device

| Device | Clues | Surface | Wit | Definition gives it away | Beat both |
|---|---|---|---|---|---|
| Anagram | 109 | 77% | 47% | 40% | 47 |
| Double definition | 75 | 68% | 52% | 32% | 34 |
| Charade | 75 | 69% | **39%** | 37% | 23 |
| Hidden | 66 | 74% | 46% | 39% | 32 |
| Cryptic definition | 52 | 88% | 56% | n/a | 30 |
| Reversal | 13 | 76% | 75% | 46% | 9 |
| Container | 13 | 61% | 42% | 38% | 5 |
| Homophone | 9 | 79% | 67% | 44% | 6 |
| &lit | 2 | 63% | 69% | n/a | 0 |
| Deletion | 1 | 100% | 19% | 100% | 0 |

**Charades are the weakest on wit** (printed pieces, flat construction; consistent with audit 02).
The cryptic-definition advantage was tested in calibration run 2: head to head, the exam isn't
fooled by quiz clues. The remaining gap may be uneven anchors (CL-055).

## Faults (15)

OVEN, SAND: alternative answers. STEAM, REEF, DROWN, OVERNIGHT: definition wrong. GENERAL,
WARFARE, CHASM, GRENADE, NEST, THREAD, DIAMOND, MONARCH, MUSHROOM: judged unfair by most wit judges.

GRENADE, MUSHROOM and MONARCH were also on audit 02's independent top-20 rewrite list: two
methods agree.

## Bottom tenth (weakest combined surface + wit vs anchors)

SECRET, DESSERT, FORWARD, HABITAT, EAR, PLANET, MARGIN, TENOR, CORRELATE, PRECAUTIONS, SPINE,
DETAIL, MOAT, CASTLE, FORTUNATE, HEAT, HARM, SACRED, WALLET, CRAVING, STARLING, MILD, GRAVE,
REEF, RIFE, GHOST, ELEPHANT, NEWSPAPER, STAR, ALERT, DEMEAN, AGE, CHAT, TRUNK, EARLOBE, RESIDENT,
GRADIENTS, WATERFALL, PARTNERSHIP, SAGE, WAGER, CANTER.

## What this baseline is for

1. **Writer run 1** (26 answers: faults, rule failures, copies, the owner's TELEVISION, and the
   weak upcoming Dailies) is the first test of whether the method beats the old clues. Success
   = finalists beating both the incumbent and the published anchors.
2. **The Daily** should only show clues that clearly beat published ones, with definitions that
   don't give the answer away. The bar is to be set from this data with the owner.
3. **Targets for the next measurement:** wit vs published ≥ 55% with both judge families;
   definition giveaway ≤ published rate (28%); zero faults.
