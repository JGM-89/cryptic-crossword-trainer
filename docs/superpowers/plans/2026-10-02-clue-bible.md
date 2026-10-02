# Clue Bible + Exam + Writer Method Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make clue quality a property of the system: a research-cited Clue Bible, machine rules
and flags, a calibrated exam that scores every clue against published anchors, and a fixed
Writer method. Prove it by baselining the bank and rebuilding the worst clues through it.

**Architecture:**
- **Docs:** `docs/clue-bible/` is the single authority (replacing `clue-style.md` +
  `clue-pipeline.md`). The skill becomes a thin procedure.
- **Code:** deterministic checks live in `src/data/clue-rules.ts` (pure, tested, run in CI as a
  ratchet).
- **Local corpora** (gitignored, under `.corpus/`, fetched by `scripts/corpus/*`): published
  clues (George Ho, SQLite via `node:sqlite`), everyday English sentences (Tatoeba, CC-BY), and
  WordNet (`wordnet-db` dev dependency).
- **Exam:** steps that need judgement run as agents over batch files prepared by
  `scripts/exam/*.mjs`; scripts aggregate (Bradley–Terry, AUC) into a committed
  `src/data/bank/ledger.jsonl`.

**Tech Stack:** Node 24 (`node:sqlite`), TypeScript/tsx, vitest, Python 3 (bz2 only), Claude
subagents for judging.

**Spec:** `docs/superpowers/specs/2026-10-02-clue-bible-design.md`

---

## File map

| Path | Responsibility |
|---|---|
| `docs/clue-bible/README.md`, `01-qualities.md`, `02-devices/*.md`, `03-rules-and-flags.md`, `04-exam.md`, `05-writer-method.md`, `06-case-law.md`, `07-sources.md` | The Bible |
| `docs/clue-bible/judges/*.md` | Verbatim judge/solver/setter prompt templates (versioned) |
| `src/data/clue-rules.ts` (+ `clue-rules.test.ts`) | R-* rules and F-* flags (pure, no corpora) |
| `src/data/clue-rules.baseline.json` | Ratchet allowlist of known violations (may only shrink) |
| `scripts/corpus/fetch.mjs` | Download Ho SQLite + Tatoeba eng sentences into `.corpus/` |
| `scripts/corpus/lib.mjs` | Shared readers: published clues by answer, sentences, bigram counts, WordNet senses |
| `scripts/raw-material.mjs` | Writer step 1: fodder, hidden carriers, splits, senses for an answer |
| `scripts/clue-flags.mjs` | Corpus-backed flags: F-CHESTNUT, F-UNATTESTED, F-DEF-EVIDENCE pre-check |
| `scripts/exam/prepare.mjs` | Build batch files: cold-solve, decoy, tournament pairs, evidence |
| `scripts/exam/score.mjs` | Aggregate agent outputs → scorecards → ledger; Bradley–Terry |
| `scripts/exam/calibrate.mjs` | AUC on good vs bad anchors per exam step |
| `scripts/exam/bad-anchors.mjs` | Mine superseded clue versions from git history |
| `src/data/bank/ledger.jsonl` | Committed scorecards |
| `.claude/skills/clue-writer/SKILL.md` | Thin procedure that loads the Bible |

---

### Phase A — Bible v1
- [ ] **A1.** Dispatch research/writing agents in parallel, each owning chapters, each told to
  consolidate (not invent) from `docs/clue-style.md`, `docs/clue-pipeline.md`, the skill,
  `docs/audit/2026-10-02/*`, and cited outside sources:
  (a) `01-qualities.md`;
  (b) `02-devices/` (12 files);
  (c) `06-case-law.md`, seeded from the audit plus `git log -p` of past rebuild commits;
  (d) `07-sources.md`.
- [ ] **A2.** I write `README.md`, `03-rules-and-flags.md`, `04-exam.md` and
  `05-writer-method.md` (they describe code built in B–D), plus `judges/*.md` prompt templates.
- [ ] **A3.** Review every chapter for contradictions with the spec, then commit
  `docs: Clue Bible v1`.

### Phase B — Rules and flags in code (TDD)
- [ ] **B1.** `clue-rules.test.ts` first: fixtures per rule (pass + fail), e.g.
  - R-PRINTED: OUTLOOK clue containing "out" → fail;
  - R-FODDER-LETTERS: GENERAL with fodder "enlarged" → fail;
  - R-IDLE: "Members groan" style single idle word → fail.
- [ ] **B2.** Implement in `src/data/clue-rules.ts`, reusing `surface-rules.ts` tokenisation:
  - R-IDLE, R-PRINTED, R-ANSWER-IN-CLUE, R-FODDER-LETTERS, R-INDICATOR-DIR, R-HIDDEN-IND,
    R-CD-CONTRACT;
  - F-TEMPLATE, F-AMERICANISM;
  - batch rules B-DEVICE-MIX and B-REPEAT.
- [ ] **B3.** `src/data/clue-rules.ratchet.test.ts`: every bank/teaching violation must appear
  in `clue-rules.baseline.json`, and the baseline may not contain entries that now pass (it
  shrinks only).
- [ ] **B4.** Wire into `scripts/validate-clue.ts` (candidates: zero tolerance) and the lint.
  Commit.

### Phase C — Local corpora and corpus-backed tools
- [ ] **C1.** `scripts/corpus/fetch.mjs`: download the Ho `data.db` and Tatoeba
  `eng_sentences.tsv.bz2` (decompress with Python's bz2) to `.corpus/`; add `.corpus/` to
  `.gitignore`; add the `wordnet-db` devDependency. `npm run corpus:fetch`.
- [ ] **C2.** `scripts/corpus/lib.mjs`:
  - `publishedClues(answer)`;
  - `sentences(filter)`;
  - `bigramCount(a, b)` (built once into `.corpus/bigrams.json` from Tatoeba);
  - `senses(word)` (WordNet: synonyms + glosses + POS).
- [ ] **C3.** `scripts/clue-flags.mjs`:
  - F-CHESTNUT: token-Jaccard ≥ 0.6 against published clues for the same answer;
  - F-UNATTESTED: adjacent content-word pairs with a zero bigram count, advisory;
  - F-DEF-EVIDENCE: is the definition/answer pair a WordNet synonym or hypernym within 2 hops?
    Misses are listed for the auditor.
- [ ] **C4.** `scripts/raw-material.mjs <ANSWER>`:
  - single-word anagrams and two-word phrase anagrams from the WordNet + Tatoeba vocabulary;
  - hidden carriers (Tatoeba substrings spanning a word boundary);
  - charade/container splits whose pieces are words, with WordNet synonyms;
  - reversals;
  - answer senses.
  Output JSON. Commit.

### Phase D — The Exam
- [ ] **D1.** Judge templates in `docs/clue-bible/judges/`: `cold-solver.md`, `decoy.md`,
  `tournament-surface.md`, `tournament-wit.md`, `evidence-auditor.md`, `setter.md`.
- [ ] **D2.** `scripts/exam/bad-anchors.mjs`: walk `git log -p` over `src/data/bank/*.json` and
  `src/data/clues.ts`; collect clue texts replaced in rebuild commits, plus the audit's unsound
  list → `.corpus/anchors-bad.json` (ours; may be committed as `docs/clue-bible/anchors-bad.json`).
- [ ] **D3.** `scripts/exam/prepare.mjs --set <bank|teaching|calibration|candidates> --run <id>`
  → `tmp/exam/<run>/`:
  - `coldsolve-N.json` `[{id, clue, enum}]`;
  - `decoy-N.json` (each surface shuffled among 4 Tatoeba sentences of similar length; key kept
    aside);
  - `pairs-surface-N.json`, `pairs-wit-N.json` (each candidate vs 2 published anchors for the same
    answer where available, else same-length same-definition-POS anchors; both orders);
  - `evidence-N.json`.
- [ ] **D4.** `scripts/exam/score.mjs --run <id>`: read agent outputs →
  - solver metrics;
  - decoy "passed as prose" rate;
  - Bradley–Terry ratings (MM algorithm, 100 iterations), reported as the percentile vs anchors;
  - scorecards appended to `src/data/bank/ledger.jsonl`.
- [ ] **D5.** `scripts/exam/calibrate.mjs --run <id>`: AUC (good published anchors vs bad
  anchors) for decoy, surface tournament and wit tournament. Run the calibration set through the
  agents; iterate the judge prompts until AUC ≥ 0.80, recording each iteration in case law.
  Commit.

### Phase E — Baseline
- [ ] **E1.** Run the full exam over all bank + teaching clues (agents in batches); score; write
  `docs/clue-bible/baseline-2026-10.md` (distribution, per-device, worst 10%, RULE failures).
  Commit.

### Phase F — First workout through the Writer method
- [ ] **F1.** Select the RULE failures + the bottom decile. For each answer:
  raw-material → scene briefs → 4–6 setter agents (device × domain) → rules → cold solve →
  decoy → tournament vs anchors + the incumbent.
- [ ] **F2.** Owner blind surface session: bare finalist surfaces in pairs, owner picks;
  logged as preferences.
- [ ] **F3.** Patch the bank (`clue-patch.mjs`); `npm run clues:regen`; `npm run daily:gen` is
  NOT needed (the answer set is unchanged); re-run par for changed clues; shrink the ratchet
  baseline; re-score; before/after report. Commit + push.

### Phase G — Retire and wire up
- [ ] **G1.** `clue-style.md` and `clue-pipeline.md` become stubs pointing to the Bible (the par
  rubric moves to the Bible's qualities chapter); the skill is rewritten as a thin procedure;
  `PRODUCTIONPLAN.md` updated. Tests, build, commit, push.
