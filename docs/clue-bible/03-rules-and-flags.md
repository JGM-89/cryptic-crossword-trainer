# 03 — Rules and flags (what the machine checks)

The machine checks the basics so that no human has to be a cryptic expert. It never decides
whether a clue is *good*. That's the exam's job (04). It only catches faults that are
unambiguous.

## The fairness principles (owner instruction, 2026-10-02)

Rules must never make clues arbitrarily harder to write. Therefore:

1. **A RULE is only for an unambiguous fault** (the answer printed in the clue, anagram letters
   that don't match). Anything that needs judgement is a **FLAG**: the exam weighs it, and it
   never blocks on its own.
2. **Every rule is precision-tested on published broadsheet clues.** `npx tsx
   scripts/rules-precision.mjs` runs rules over ~30,000 Times/Guardian/Telegraph-family clues.
   A rule that fires on professional work is treating normal practice as a fault, so it gets
   demoted or fixed.
3. **Every rule is waivable** for a specific clue with a written reason. The waiver goes in the
   entry as `"waivers": [{"rule": "R-…", "reason": "…"}]`. The exam's auditor checks the
   reason, and case law records it. A waived hit is still shown; it just doesn't block.
4. **Regression examples come before rules.** A new failure pattern first becomes a `fail`
   example in `examples/`. It becomes a rule only once its precision is shown (principle 2).
5. **Every rule traces to a real failure** in case law (06). No speculative rules.

## Where the checks run

| Check | Code | Runs in |
|---|---|---|
| Integrity (letter mechanics, abbreviations, composition) | `src/data/integrity.ts` | CI (bank, teaching, puzzles), `validate-clue` |
| Surface gate (word lists, containment glue, indicator present, flagrant orphans) | `src/data/surface-rules.ts` | CI, `validate-clue` |
| Clue rules R-* / F-* / B-* | `src/data/clue-rules.ts` | CI ratchet, `validate-clue` |
| Corpus checks R-COPY / F-CHESTNUT / F-DEF-EVIDENCE | `scripts/clue-flags.mjs` | Writer method and exam (needs `npm run corpus:fetch`) |

**Candidates** (new clues): `npm run clues:validate -- <file.json>` must report `ok: true`
(zero unwaived RULE hits), and `npx tsx scripts/clue-flags.mjs <file.json>` must report no
`R-COPY`.

**Shipped clues:** `src/data/clue-rules.ratchet.test.ts` fails on any *new* violation, and on
any baseline entry that has since been fixed. `src/data/clue-rules.baseline.json` may only
shrink; regenerate it with `npx tsx scripts/clue-rules-baseline.ts` after fixing clues.

## Integrity checks (the validator)

These were extended on 2026-10-02 after Astra found three loopholes (case law):

- **Hidden:** the answer is a contiguous run of the carrier, **and the carrier is in the clue**.
- **Deletion:** the answer is the source word with **one specified part** removed (head, tail,
  both ends, or one contiguous run such as the heart or a named letter), never scattered
  letters. The source word is either in the clue or produced from a clue word by a synonym or
  abbreviation op. Synonym-then-precise-deletion (celebrity → STAR, beheaded → TAR) is a
  standard, fair construction.
- **Composition:** every charade and container piece must come from a prior operation or sit
  verbatim in the surface. Single letters get no free pass.
- **Unchanged:** anagram fodder is a permutation of the answer and literally in the clue;
  reversals; initialisms and alternations; true internal insertion; abbreviations only from
  `src/data/abbreviations.ts`, with the cue present in the surface; no swallowed indefinite
  article; the final operation outputs the answer.

## The catalogue

| ID | Kind | What it checks | Why (case law) | Precision on published clues |
|---|---|---|---|---|
| **R-ANSWER-IN-CLUE** | RULE | The answer, or a plain inflection of it (-s, -es, -d, -ed, -ing), is printed in the surface. Hidden clues are exempt. | WONDER ("wonders endlessly") | 0.02%, and all of those are data errors where the clue *is* the answer. "learner − ER" = LEARN is fair, so -er/-ly are excluded. |
| **R-FODDER-LETTERS** | RULE | Anagram fodder words are printed as whole words, and the fodder letters equal the answer letters. | GENERAL ("enlarged" ≠ ENLARGE) | Mechanical; can't misfire on a correct parse. |
| **R-INDICATOR-DIR** | RULE | A reversal indicator that only works in a Down clue ("up", "rising", "raised"…). Cruci clues are standalone, so there is no grid direction to rely on. | TIP, REWARD | Context-specific: published Down clues legitimately use them, so the precision test doesn't apply. |
| **R-HIDDEN-IND** | RULE | The hidden-word indicator is used by published setters (`src/data/indicators/hidden.json`, word forms equivalent) or belongs to the standard families. Only an indicator in neither fails. | COB ("past"); NEST (no indicator) | Built from published usage. A hand-written list wrongly failed 12 clues first; see case law. |
| **R-CD-CONTRACT** | RULE | A cryptic definition states `pun: {misleading, true}`, the two readings the clue plays on. If the writer can't name the misleading reading, it isn't a cryptic definition. | Part-j quiz-question CDs | A documentation requirement, not a quality judgement. |
| **R-COPY** | RULE | The surface is a near-verbatim copy of a published clue for the same answer: at least 3 shared content words and Jaccard ≥ 0.7. Similar is fine; only copying blocks (owner). | OPAL, TRACK (identical to Guardian clues) | Only fires on true copies. |
| **F-IDLE** | FLAG | A word the cryptic reading never pays for. Deciding "idle" needs judgement, since a decorative word can carry the scene. | 17% padding (audit 02) | Heuristic; flag only. |
| **F-PRINTED** | FLAG | An answer piece is printed as itself (OUT+LOOK, REP+AID). It's weak disguise, not unfairness. | OUTLOOK, STARLET | Flag only. |
| **F-AMERICANISM** | FLAG | US spelling or usage in a British puzzle. | BARGAINING ("aging") | 0.01%. |
| **F-CHESTNUT** | FLAG | A wordplay word (never the definition) is shared with ≥3 published clues for this answer: a familiar construction. Informational. | STRESSED/DESSERTS ×3 | Flag only. |
| **F-DEF-EVIDENCE** | FLAG | The definition isn't backed by WordNet (synonym / is-a, ≤2 steps, either direction) or Moby Thesaurus. The exam's evidence auditor must confirm the sense. | JAM ("stuck in traffic"), BAY | ~20% of the bank, mostly fair figurative definitions; it routes them to the auditor. |
| **F-QUIZ** | FLAG | (Exam) The cold solver got a CD/DD from the literal reading. Solving a DD from one half is **not** a defect; this only prompts a check that the second reading exists. | Part-j | Exam-derived. |
| **B-DEVICE-MIX** | FLAG | In a general expansion batch: cryptic + double definitions over 25%, or fewer than 4 devices. Doesn't apply to single-device lesson batches. | Part-j: 44 of 49 CD/DD | Batch flag. |
| **B-REPEAT** | FLAG | The same indicator used more than twice in a batch. | Template drift | Batch flag. |

### Tried and rejected

- **F-UNATTESTED** ("would anyone say these words together?", via an everyday-English word-pair
  corpus). Rejected on 2026-10-02: published broadsheet clues trip it *more* often than ours
  (62% vs 34%). Good setters use richer language than everyday sentences, so it measures
  nothing useful.

## Adding or changing a rule

1. Record the failure in case law (06), with the real clue.
2. Add `fail` (and matching `pass`) examples in `examples/`.
3. Implement it in `clue-rules.ts` (pure) or `clue-flags.mjs` (corpus), with unit tests.
4. Measure precision with `scripts/rules-precision.mjs`, adding the rule there if it can run
   on bare published clues. If it fires on professional clues, it's a FLAG or it's wrong.
5. Regenerate the ratchet baseline; update this table.
