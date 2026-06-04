# Clue Pipeline — runbook

How to author, check, fix, and expand the Cruci clue bank using AI agents. This is the
**operational** companion to [`clue-style.md`](./clue-style.md) (which is the per-clue *contract*
agents write to). If you're a fresh session continuing this work: read this file first, then
`clue-style.md`.

> **TL;DR.** The bank (`src/data/bank/part-*.json`) is upgraded one part at a time. For each part:
> chunk it → hand each chunk to a "setter" agent that writes best-of-N clues and **hard-gates**
> them through the real validator → assemble the winners back → run the tests → have a "semantic
> auditor" agent check the things the validator can't → patch its flags → regenerate the archive →
> commit & deploy. Answers never change (so grids stay stable).

---

## The pieces (what's where)

| Piece | Path | Role |
|---|---|---|
| **Style guide** | `docs/clue-style.md` | The contract: fairness rules, surface craft, 5-axis grading rubric, device conventions, the exact `BankEntry` JSON + `operations` templates. Every agent reads it. |
| **Validator harness** | `scripts/validate-clue.ts` | CLI that runs candidates through the *real* `hydrateBankEntry` + `validateClue` + surface lint. The hard mechanical gate. `npm run clues:validate -- <file.json>` (one object or an array). Exit 0 = all `ok:true`. |
| **Abbreviation dictionary** | `src/data/abbreviations.ts` | The ONLY abbreviation cues allowed (`old→B` etc. are rejected). The validator enforces it. |
| **Mechanical validator** | `src/data/integrity.ts` | The fairness logic (also run in CI via the tests). |
| **The bank** | `src/data/bank/part-a.json … part-h.json` | The clues that fill puzzles. Merged in `src/data/bank/index.ts`. Entries use `answer` (not `solution`) and have no `id`. |
| **Teaching corpus** | `src/data/clues.ts` | Stage-A lesson clues. **Deliberately left as-is** — tuned for clarity over wit. Don't run the engine on it. |
| **Archive compiler** | `scripts/generate-puzzles.mjs` | Places bank words into grids → `public/archive.json`. `TIERS` controls puzzle counts. Rerun after ANY bank edit. |
| **Pipeline helpers** | `scripts/clue-chunk.mjs`, `scripts/clue-assemble.mjs`, `scripts/clue-patch.mjs` | Chunk / merge-back / patch. |
| **Tests (the gate)** | `src/data/bank/bank.test.ts`, `integrity.test.ts`, `surfaces.test.ts`, `archive.test.ts` | bank: every clue valid + no dup answers. surfaces: no bare word-lists. archive: no bank↔archive drift. |
| **Working dir** | `tmp/` | Ephemeral (gitignored). Chunks land in `tmp/in/`, agent outputs in `tmp/clue-winners/`. Safe to delete. |

npm aliases: `clues:validate`, `clues:chunk`, `clues:assemble`, `clues:patch`, `clues:regen`.

---

## The loop — upgrading one bank part

Do this per part (`a`…`h`). Example uses part `b`.

**1. Chunk the incumbents** (5 chunks ≈ one per setter agent):
```
node scripts/clue-chunk.mjs b 5      # -> tmp/in/b-1.json … b-5.json
```

**2. Dispatch ~5 setter agents in parallel** — one per chunk. Use the **SETTER prompt template**
below, substituting the chunk number. Each agent reads `tmp/in/b-<n>.json` + the style guide,
writes best-of-N winners to `tmp/clue-winners/b-<n>.json`, and self-gates with the harness.

**3. Assemble the winners back** (asserts the answer set is unchanged, keeps original order):
```
node scripts/clue-assemble.mjs b     # overwrites src/data/bank/part-b.json
```

**4. Mechanical gate:**
```
npx vitest run src/data/bank/bank.test.ts src/data/integrity.test.ts src/data/surfaces.test.ts
```
(If red, the assemble step already refused on answer-set mismatch; otherwise a clue failed
`validateClue` — fix it and re-run.)

**5. Semantic audit** — dispatch ONE auditor agent with the **AUDITOR prompt template** (it reads
the freshly-written `part-b.json`). It flags BROKEN/DUBIOUS clues the validator can't catch (bogus
synonyms, double-defs where one sense is wrong, indicator-not-in-surface, etc.).

**6. Patch the flags** — write the auditor's fixes as `{ "ANSWER": <full BankEntry> }` to a file,
then:
```
node scripts/clue-patch.mjs b tmp/fixes-b.json
npm run clues:validate -- src/data/bank/part-b.json    # confirm still all ok
```

**7. Once all parts are done: regenerate the archive, test, build:**
```
npm run clues:regen        # node scripts/generate-puzzles.mjs -> public/archive.json
npm test                   # all suites incl. archive drift
npm run build
```

**8. Commit & push** (deploys via GitHub Pages Actions). Bank edits + the regenerated
`public/archive.json` must go together (the drift test fails otherwise).

---

## Expanding the bank (adding new clues / more puzzles)

1. Snapshot existing answers so new ones don't collide:
   ```
   node -e 'const fs=require("fs");let a=[];for(const f of fs.readdirSync("src/data/bank").filter(f=>f.endsWith(".json")))for(const e of JSON.parse(fs.readFileSync("src/data/bank/"+f)))a.push(e.answer.toUpperCase());fs.mkdirSync("tmp",{recursive:true});fs.writeFileSync("tmp/existing-answers.json",JSON.stringify(a.sort()))'
   ```
2. Dispatch setter agents with the **EXPANSION prompt template** (one per length band, e.g. 4/5/6/7/8–9
   letters) → each writes new winners to `tmp/clue-winners/exp-<band>.json`.
3. Merge + dedupe into a NEW part file (next free letter, e.g. `part-i.json`), dropping any answer
   already in the bank or duplicated across bands. (Adapt the dedupe one-liner used for `part-h`.)
4. Wire it into `src/data/bank/index.ts` (add `import partI from './part-i.json'` and `...partI`).
5. Optionally bump `TIERS` counts in `scripts/generate-puzzles.mjs` for more/denser puzzles.
6. Then the usual: `npm test`, `npm run clues:regen`, `npm run build`, commit, deploy. Also update
   the puzzle/word counts in `README.md` and `src/pages/HomePage.tsx` (the "300 puzzles" string).

---

## Hard rules & gotchas

- **Answers never change.** Rewrites keep identical letters so the generated grids stay valid.
  `clue-assemble.mjs` refuses if the answer set differs.
- **The `indicator` field is shown to solvers** — it's quoted verbatim in hint-ladder rung 3. It
  MUST be a phrase that appears in the clue surface, or the hint is misleading.
- **Only `ABBR` cues.** Any `abbreviate` op whose cue isn't in `src/data/abbreviations.ts` (or an
  explicit first-letter device) is rejected. If a genuinely standard abbreviation is missing, add
  it to `abbreviations.ts` (don't invent ad-hoc ones in a clue).
- **The validator can't check semantics.** It verifies letters + abbreviations, NOT whether a
  `synonym` is real or a container/double-def/homophone actually resolves. That's why step 5 (the
  human/LLM auditor) is mandatory, not optional.
- **Bank edit ⇒ regenerate the archive** (`clues:regen`) or `archive.test.ts` fails on drift.
- **Leave `src/data/clues.ts` (the teaching corpus) alone** — it's intentionally simple for Stage-A
  lessons and already audited clean.
- `tmp/` is gitignored scratch space; never commit it. The committed durable assets are the style
  guide, the harness, and the three pipeline scripts.

---

## Agent prompt templates

Spawn these as general-purpose subagents. Replace `<part>` / `<n>` / counts as needed.

### SETTER (best-of-N rewrite) — one per chunk
```
Expert cryptic setter improving a clue bank. Repo: <ABSOLUTE REPO PATH>.
FIRST read `docs/clue-style.md` in full (the contract: fairness, surface craft, the 5-axis
grading rubric, device conventions, and the exact BankEntry JSON output + per-device `operations`
templates). Skim `src/data/abbreviations.ts` for the only allowed abbreviation cues.

Your incumbents are in `tmp/in/<part>-<n>.json` (read it). For EACH answer, do best-of-N:
1. Write 3–4 GENUINELY DIFFERENT candidate clues (vary the device where the letters allow — not
   trivial rewordings). Follow the output contract exactly (BankEntry shape, per-device operations,
   ONE definition at start/end, the `indicator` must appear in the surface, `parse` = full worked
   solution). Keep the SAME answer (identical letters); the (enum) must match the letter count.
2. HARD-GATE every candidate: write them to `tmp/cand-<part><n>.json` and run
   `npx tsx scripts/validate-clue.ts tmp/cand-<part><n>.json`. Discard/fix any `ok:false`.
3. Grade survivors on the 5-axis rubric; treat the incumbent as a candidate and KEEP it only if it
   genuinely beats your new ones (don't replace an already-excellent clue). Pick ONE winner per
   answer — clever, fair, natural-reading English, no filler. Avoid the known faults: formulaic
   "beheaded X" deletions, forced fodder, bogus synonyms, telegraphic word-lists, answer-screaming
   definitions, and monotonous runs of one device.

OUTPUT: write a JSON ARRAY of winners (one complete BankEntry per answer, SAME ORDER as input) to
`tmp/clue-winners/<part>-<n>.json`, then run `npx tsx scripts/validate-clue.ts
tmp/clue-winners/<part>-<n>.json` and confirm EVERY entry is ok:true (fix until so). Return a
concise table: ANSWER | KEPT/REWROTE | new clue | one-line why. Edit NO repo file except your tmp/
outputs; answers must stay identical.
```

### SEMANTIC AUDITOR — one per part (or per ~40 entries)
```
Strict cryptic-crossword editor doing a SEMANTIC fairness audit of freshly-written clues. The
mechanical validator already confirmed letter-mechanics + abbreviations; your job is what it CANNOT
check: whether every synonym is real and the wordplay genuinely resolves.

Read `src/data/bank/part-<part>.json` in <ABSOLUTE REPO PATH>. For EACH clue verify: (1) every
`synonym` op input is a REAL synonym of its output (reject bogus ones like "little while"→SAR);
(2) double-definitions: BOTH halves genuinely mean the answer (distinct senses); (3) charade/
container/reversal/homophone/hidden/&lit/deletion actually produce the answer and the definition is
a true synonym in the right part of speech; (4) homophones genuinely sound alike; (5) def-by-example
is flagged with ?/perhaps where needed; (6) the surface reads as natural English (flag genuine
nonsense only). Standard cryptic GK is allowed (cob=male swan, P=quiet, TAR=sailor, etc.). Only
flag GENUINE errors.

Return a markdown table of FLAGGED clues only: ANSWER | SEVERITY (BROKEN = wordplay/def doesn't
actually work; DUBIOUS = questionable) | PROBLEM (quote the bad part) | SUGGESTED FIX (a concrete
fair replacement keeping the SAME answer). End with "X broken, Y dubious of N". Read-only.
```

### EXPANSION (invent new clues) — one per length band
```
Expert cryptic setter EXPANDING a clue bank with brand-new entries. Repo: <ABSOLUTE REPO PATH>.
FIRST read `docs/clue-style.md` in full. Skim `src/data/abbreviations.ts`. Read
`tmp/existing-answers.json` — answers ALREADY in the bank that you must NOT reuse.

TASK: invent <N> NEW answers, each a common single English word of EXACTLY <L> letters (A–Z only),
great for crossword fill (common letters, well-known words), NONE appearing in
tmp/existing-answers.json. For each, write a high-quality clue (best-of-N: draft a few, pick the
best) per the style guide — varied devices across the set, clever fair surfaces, no filler.

HARD-GATE everything: write candidates to `tmp/cand-exp<L>.json` and run
`npx tsx scripts/validate-clue.ts tmp/cand-exp<L>.json`; only keep ok:true.

OUTPUT: write a JSON ARRAY of <N> BankEntry objects to `tmp/clue-winners/exp-<L>.json` (each:
{answer, clueType, difficulty, clue, def:{text,position}, wordplay:{indicator,fodder,operations},
parse}). Run `npx tsx scripts/validate-clue.ts tmp/clue-winners/exp-<L>.json` and confirm EVERY
entry ok:true AND no duplicate answers among them. Return a list: ANSWER | clue. Edit NO repo file
except tmp/ outputs.
```

> Tip: dispatch the ~5 setters for a part in a single message (parallel). Keep the human in the
> loop between parts — read each setter/auditor summary before assembling.
