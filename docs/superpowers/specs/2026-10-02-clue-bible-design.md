# The Clue Bible, the Exam and the Writer method — Design

**Date:** 2026-10-02 · **Status:** awaiting owner review.
**Source evidence:** `docs/audit/2026-10-02/` (00-synthesis, 01 clue system, 02 bank grading,
03 surface research).

## Why

Cruci's goal is a system that **reliably** writes great cryptic clues with the best surfaces,
in a way that's **repeatable by any agent**. Today, knowledge is spread across three documents
(`docs/clue-style.md`, `docs/clue-pipeline.md`, `.claude/skills/clue-writer/SKILL.md`) with
conflicting thresholds.

The audit measured the result: the bank is about 40% broadsheet-grade, 37% competent but flat,
23% weak, with about 17 unsound clues. Quality depended on which agent ran and what it happened
to draft. Judging was absolute 1–5 scoring by one model family, with no reference point, and
wit was scored blind.

## Principles (locked with the owner)

1. **System, not agent.** The standard, the measurements and the method are written down and
   executable. Any agent following them produces comparable output. No ad-hoc rewrites.
2. **Research-backed.** Every rule cites its source: setter/editor literature, Listener vetting
   practice, the cited research. Rules without a source are marked *house rule* with the reason.
3. **Automate the expert.** The owner is not a cryptic expert (the project exists to teach him
   and others). Every check that needs expertise is a rule, a flag or an exam step run by the
   system.
4. **The owner judges surfaces only, blind.** He sees bare sentences (no answers, no parses)
   and answers "does this read like real English?" and "which reads more naturally?". This is
   the one independent, human signal in the loop — it corrects the model judges' shared blind
   spot for crossword-ese.
5. **Measure the measuring stick.** The exam is trusted only after it has been shown to separate
   known-good from known-bad clues.
6. **The system learns.** Every failure and every decision becomes *case law* in the Bible, so
   the next agent inherits it.

## 1. The Clue Bible (`docs/clue-bible/`)

It replaces `clue-style.md` + `clue-pipeline.md` as the single authority. The Clue Writer skill
becomes a thin procedure that loads the Bible. Chapters:

| File | Contents |
|---|---|
| `README.md` | What the Bible is, how agents use it, the order to read it in. |
| `01-qualities.md` | The measurable qualities of a great clue, each with: definition · why (citations) · how it is measured (rule / cold solve / decoy / tournament / evidence) · pass bar · exemplars at great / good / weak with "why". Qualities: **Soundness** (gate), **Definition precision**, **Surface naturalness**, **Scene** (one picturable situation), **Misdirection**, **Economy** (no idle words), **Penny-drop**, **Originality**, **Difficulty honesty** (par). |
| `02-devices/<device>.md` | One per device (12): fair forms, indicator families (with direction rules, e.g. Down-only reversal indicators), typical failures, exemplars. |
| `03-rules-and-flags.md` | The machine-checkable catalogue (§2), each rule with its ID, rationale, source and the code that enforces it. |
| `04-exam.md` | The measuring protocol (§3) and the scorecard schema. |
| `05-writer-method.md` | The generation procedure (§4). |
| `06-case-law.md` | Dated entries: what failed, why, and the rule/flag/exemplar it produced. Seeded from the audit and the git history of past rebuilds. |
| `07-sources.md` | Bibliography with URLs; what each source supports. |

Exemplars are our own clues (we own them) plus short attributed quotations of published clues
used for commentary, kept to a minimum. Benchmark clues for the exam are **never** committed
(§3.4).

## 2. Rules and flags (automated checking of the basics)

Two severities: **RULE** = fails the clue, blocks shipping; **FLAG** = needs a specific exam step
or a rewrite reason recorded. Implemented in `src/data/surface-rules.ts` / `integrity.ts`
(extended) and a new `src/data/clue-rules.ts`, run by `npm run clues:validate` and in CI over
the whole bank.

Initial catalogue, each derived from an audit finding:

| ID | Kind | Check |
|---|---|---|
| R-IDLE | RULE | Any single word with no role in the parse (extends today's multi-word span check). |
| R-PRINTED | RULE | A charade/container piece appears verbatim in the clue (e.g. OUT+LOOK with "out" in the surface). |
| R-ANSWER-IN-CLUE | RULE | The answer, or a word sharing its stem, appears in the surface. |
| R-FODDER-LETTERS | RULE | Anagram fodder letters = answer letters exactly (catches GENERAL/"enlarged"+D). |
| R-INDICATOR-DIR | RULE | Direction-bound indicators (Down-only reversal: "up", "rising"…) used in a non-Down context. |
| R-HIDDEN-IND | RULE | Hidden indicator is in the allowed family list. |
| R-CD-CONTRACT | RULE | Cryptic definitions must declare `pun: {misleading, true}`; empty = fail. |
| F-CHESTNUT | FLAG | Near-match to a published clue for the same answer (local corpus, fuzzy), or a known chestnut pair (STRESSED/DESSERTS). |
| F-DEF-EVIDENCE | FLAG | Definition / DD halves / synonym ops lack a dictionary-sense `evidence` field. |
| F-QUIZ | FLAG | CD/DD solved from the literal reading by the cold solver (a quiz question, not a cryptic). |
| F-TEMPLATE | FLAG | Surface matches an over-used bank template (mined n-grams, e.g. "he was…", "When X…"). |
| F-UNATTESTED | FLAG | Central word join never attested in n-gram data (Alberich's search test). |
| F-AMERICANISM | FLAG | US spelling/usage in a British puzzle. |
| B-DEVICE-MIX | BATCH RULE | CD + DD ≤ 25% of a batch; every batch spans ≥ 4 devices. |
| B-REPEAT | BATCH FLAG | Same indicator or scene template used > 2× in a batch. |

## 3. The Exam (how a clue is measured)

Every candidate and every existing bank clue sits the same exam; results go into the scorecard.

1. **Rules & flags** (§2): any RULE failure ends the exam.
2. **Cold solve.** A fresh agent with no context gets only `clue (enum)`. It returns its top 3
   answers with confidence, its parse, and whether the literal reading alone gave the answer.
   Records: `solved`, `unique` (no near-equal alternative), `literalGiveaway`, `alternatives`.
   Unsolved by 2 of 3 solvers, or not unique → unfair. Literal giveaway on a CD/DD → F-QUIZ.
3. **Naturalness (blind decoy test).** Surfaces are mixed with real English sentences (headlines,
   prose, overheard speech from a public-domain/permissive corpus). Judges are asked which lines
   came from a crossword. Score = the rate at which the surface is mistaken for real prose. The
   **owner** sits this test in short sessions; model judges sit it at scale.
4. **Tournament (relative quality).** Finalists for an answer plus **anchors** play pairwise
   comparisons, each pair in both orders, aggregated with Bradley–Terry:
   - **Surface** — no answer shown; the owner can take part.
   - **Wit / penny-drop** — answer and parse revealed.
   Bar: the winner must beat or tie the median anchor of its device.
5. **Semantic evidence.** Every definition, DD half and synonym op carries a dictionary sense
   (WordNet / Wiktionary checked automatically; misses go to an auditor agent).
6. **Scorecard** appended to `src/data/bank/ledger.jsonl`: rule results, solver results,
   naturalness rate, tournament ratings vs anchors, evidence, model, date, decisions.

### 3.4 Anchors and calibration (measuring the measuring stick)
- **Good anchors:** published clues from George Ho's cryptics dataset (ODbL; clue texts remain
  the publishers' copyright). Fetched locally by `scripts/anchors-fetch.mjs`; only IDs and
  grades are committed, never the text. The selection favours clues bloggers singled out as
  favourites, per device.
- **Bad anchors:** our own failed and pre-rebuild clues from git history (we own them), plus the
  audit's unsound list.
- **Calibration run** (`npm run exam:calibrate`): the exam must separate good from bad anchors —
  target AUC ≥ 0.80 for the naturalness and tournament steps. Below that, the judge prompts are
  revised and re-run before any clue is scored. Calibration is re-run whenever a judge prompt
  or model changes.

## 4. The Writer method (how a clue is made)

Fixed steps in `05-writer-method.md`, run by the Clue Writer skill:

1. **Raw material** (`scripts/raw-material.mjs <ANSWER>`): anagram fodder (words and attested
   phrases), hidden-word carriers from phrase corpora, charade/container splits with synonyms
   (WordNet), reversals, every sense of the answer.
2. **Scene briefs** (Ximenes' DAINTILY method): 3–5 scenes per answer, each built from the
   pieces' *non-crossword* senses, plus an **alternative-sense table**. Pick pieces whose
   everyday sense fits the scene.
3. **Wide drafting:** 4–6 independent setter agents, each locked to one device × one surface
   domain, together producing 20–40 candidates. Across the candidates, each misdirection move
   must be attempted (lift-and-separate, part-of-speech shift, deceptive sense,
   capitalisation, CD/&lit).
4. **Exam** (§3); the cheap steps filter first, and the tournament runs only on survivors.
5. **Owner surface session** for finalists, blind (bare sentences only).
6. **Ship + ledger + case law:** the winner's scorecard goes in the ledger; any new failure
   pattern goes into case law and, where possible, becomes a new rule or flag.

## 5. Rollout

1. **Bible v1:** consolidate the three docs. Research agents fill in citations and exemplars
   per chapter; seed case law from the audit and from git history.
2. **Rules:** implement the §2 catalogue and run it on the bank (expect failures; that's the
   point).
3. **Exam tooling + anchors + calibration**, until the AUC target is met.
4. **Baseline:** every one of the 415 bank and 63 teaching clues sits the exam. This replaces the
   audit's estimate with a measured distribution, recorded in the ledger.
5. **First workout:** the RULE failures and bottom decile are rebuilt through the Writer method
   and re-examined. Report the before/after scorecards.
6. **Retire** `docs/clue-style.md` and `docs/clue-pipeline.md` into the Bible (old paths become
   stubs pointing to it). Update the skill, `PRODUCTIONPLAN.md` and the par rubric's location.

## Success measures

- Calibration AUC ≥ 0.80 (the exam measures something real).
- 0 RULE failures in the shipped bank.
- Share of clues beating the median device anchor: baseline → target +30 points after the
  workout.
- CD + DD ≤ 25% per batch; device spread ≥ 4 per batch.
- The owner's blind naturalness picks agree with the tournament winner ≥ 70% of the time.
- Case law grows with every batch, and new rules come from it.

## Non-goals (for now)

Beta testers, feedback forms and an agentic support back office (later, after accounts);
rebuilding Play's grids (separate project, audit 06); Learn changes (audit 05).

## Revision 2 (2026-10-02, after the owner's fairness instruction and Astra's audit)

Astra's audit is `docs/audit/2026-10-02/08-astra-chatgpt.md`; its findings were verified before adoption.

**Fairness principles (owner).** Rules must never make clues arbitrarily harder:
- A RULE is only for an unambiguous fault. Anything needing judgement is a FLAG.
- Every rule is precision-tested on published broadsheet clues (`scripts/rules-precision.mjs`).
- Every rule is waivable per clue with a written reason.
- New failures become **regression examples first**. A rule follows only once its precision is
  shown.
- Originality blocks only near-verbatim copies (`R-COPY`); a shared construction is
  informational.

**Changes adopted:**
1. **Examples are executable.** Every worked example in the Bible lives in
   `docs/clue-bible/examples/*.json` and is validated in CI. The old style guide taught broken
   examples: CHAIR given as CHAR+A, and UNDERMINED with incomplete fodder.
2. **Validator loopholes closed**, each with a test. Hidden fodder must occur in the clue; a
   deletion must remove exactly what its indicator specifies; composition pieces must come from
   an operation or the clue. Synonym-then-precise-deletion (STAR→TAR) is **allowed** — it's a
   standard construction.
3. **Demoted to flags:** printed answer pieces (`F-PRINTED`), idle words (`F-IDLE`), the batch
   device mix and indicator repeats.
4. **Rejected after testing:** `F-UNATTESTED` (published clues trip it more than ours: 62% vs
   34%).
5. **Exam changes:**
   - The cold solver must give the **correct parse**, not just the answer. Uniqueness is checked
     by testing named competing answers against both definition and wordplay. Solving a
     DD/CD from one half is *not* a defect.
   - Naturalness uses paired comparisons plus a "paraphrase the literal scene" check, not a
     spot-the-crossword decoy (which measures genre cues).
   - Calibration uses **matched pairs** (sound clue vs minimally corrupted copy; fluent-unfair vs
     awkward-fair; easy-good vs obscure-hard) and a **held-out set** never used for prompt
     tuning. Report false-pass and false-reject counts at the chosen threshold, not just AUC.
6. **The owner also solves the finalists** and reads the explanation, as well as the blind
   surface sessions.
7. **Second opinions** go to Astra (ChatGPT, via Codex CLI), not the owner.
8. **External human solvers:** deferred to the beta phase (owner decision). Until then, the
   exam's scores are labelled *AI-calibrated, not human-validated*.

**Deferred** (recorded in case law, not built now):
- span-linked executable parses (Astra's "checkable construction");
- immutable published clue revisions for past Dailies;
- multi-word bank answers;
- explanation checks in Learn.
