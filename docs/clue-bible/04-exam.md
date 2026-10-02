# 04 — The Exam (how a clue is measured)

Every candidate and every shipped clue sits the same exam. The exam doesn't ask "is this clue
good?" in the abstract. It asks four narrower questions, each answered by judges who can see
only what that question needs. It then compares the answers against **published broadsheet
clues for the same answer**, so "good" means "at least as good as what professionals print".

> **Status: AI-calibrated, not human-validated.** The judges are AI models from two families,
> Claude and Astra (ChatGPT). The exam is calibrated against matched good and bad clues, but no
> external human solvers have validated it yet; that's deferred to the beta phase (owner
> decision, 2026-10-02). Never present its scores as proof of quality.

## The steps

| Step | Question | What the judge sees | Template |
|---|---|---|---|
| **RULES** | Any mechanical fault? | — (code) | `03-rules-and-flags.md` |
| **COLD-SOLVE** | Can a fresh solver get the answer *and the working*? Is there a competing answer? | The clue and letter count only | `judges/cold-solver.md` |
| **TOURNAMENT-SURFACE** | Which reads as more natural English? Does it describe a coherent situation? | Two bare surfaces, no answers, no labels | `judges/surface.md` |
| **TOURNAMENT-WIT** | Which gives the better, fairer "aha"? | The answer plus both clues; the judge parses both | `judges/wit.md` |
| **EVIDENCE** | Is the definition a real sense of the answer? | Definition, answer, clue, parse | `judges/evidence.md` |

### Design choices, and why

- **Comparisons, not scores.** Judges pick the better of two clues, in both orders, rather than
  scoring 1–5. Research on creative-writing evaluation finds absolute scores are the weakest
  signal and pairwise preference the strongest (audit 03). Showing both orders cancels
  position bias, and the report measures any residual bias.
- **Anchored to real clues.** Every one of our clues is compared with up to two published UK
  clues for the *same answer* (Times, and Guardian/Independent/FT via Fifteensquared). The bar
  is "beat or tie the anchors". Anchors are used only for judging; their text never leaves
  `tmp/`.
- **Each judge sees only what its question needs.** Surface judges never see answers, so they
  can't reward a clue for its cleverness. Wit judges see the answer and must parse both clues
  themselves; the anchors carry no parse, so ours doesn't either. They also judge fairness, so
  an unfair clue can't win.
- **Two model families.** Claude and Astra judge every step. Same-model judges share blind
  spots, and a 2-of-3 vote among clones behaves like one judge (audit 01).
- **The cold solver must show its working.** A right answer reached by guessing from the
  definition isn't evidence the wordplay works. Solving a double definition from one half is
  normal, not a defect.
- **No "spot the crossword" decoy test.** It was planned, then dropped (revision 2): it
  measures genre cues, not naturalness. Paired naturalness plus a forced paraphrase ("what
  situation does this describe?") replaces it.

## Running it

```bash
npm run corpus:fetch                                    # once: local corpora
node scripts/exam/prepare.mjs --run <id> --input <entries.json>   # or --bank
```

Then, for each batch file in `tmp/exam/<id>/`:

- **Astra:** `node scripts/exam/astra.mjs --template <cold-solver|surface|wit|evidence> --in
  <batch.json>`.
- **Claude:** two independent subagents per batch. Each is told to read ONLY its template and
  its batch file, never `key.json`, and to write `<batch>.claude-<n>.out.json`.

Then score:

```bash
node scripts/exam/score.mjs --run <id> [--ledger]
```

The output is `tmp/exam/<id>/report.md` plus `scorecards.json`. `--ledger` appends one line per
clue to `src/data/bank/ledger.jsonl` (committed provenance: run, date, scores, judges, template
version, the AI-calibrated label).

## Reading a scorecard

| Field | Meaning | Bar |
|---|---|---|
| `solveRate` | Share of cold solvers who got the answer | Not a pass/fail on its own: hard clues are allowed |
| `surfaceVsAnchor` | Win rate against published clues on naturalness | ≥ 50% |
| `witVsAnchor` | Win rate against published clues on the "aha" (fairness included) | ≥ 50% |
| `faults` | Majority-unfair (wit judges), majority-incoherent (surface judges), definition judged wrong, or ≥2 alternative answers from solvers | None |
| `evidence` | Lexicographer verdicts on unbacked definitions | No majority "wrong" |

**A clue passes the exam** when it has zero RULE failures, zero faults, and beats or ties the
anchors on both surface and wit. A clue with no published anchors for its answer is compared
with the other candidates only, and is marked as such.

## Calibration (measuring the measuring stick)

The exam is only trusted for a decision once it has passed calibration:

1. `node scripts/exam/calibration-set.mjs --n 60` samples 60 published clues, split into
   **dev** and **held-out** halves.
2. An agent writes a **minimally corrupted copy** of each: half *unfair* (same smooth surface,
   broken wordplay), half *unnatural* (same mechanics, awkward surface).
3. The exam runs on the dev pairs. The report's calibration section shows whether:
   - the surface tournament prefers the original over each unnatural copy;
   - the wit judges call each unfair copy unfair, without calling originals unfair;
   - there are false alarms on originals.
4. Judge templates may be revised **only using dev results**. Each revision bumps the template
   version and is recorded in case law.
5. The **held-out** pairs are run once, at the end, with the final templates. Those are the
   numbers reported. Tuning on held-out data would just teach the exam to pass its own test.

**Target:** on held-out pairs, ≥ 80% separation for each corruption type, and ≤ 10% false
alarms on originals. Results are recorded in `calibration-results.md` with the date, template
versions and judge models.
