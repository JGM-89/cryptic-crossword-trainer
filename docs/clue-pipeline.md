# Clue Pipeline — runbook

How to author, check, fix, and expand the Cruci clue bank using AI agents. This is the
**operational** companion to [`clue-style.md`](./clue-style.md) (which is the per-clue *contract*
agents write to). If you're a fresh session continuing this work: read this file first, then
`clue-style.md`.

> **TL;DR.** The bank (`src/data/bank/part-*.json`) is upgraded one part at a time. For each part:
> chunk it → hand each chunk to a "setter" agent that writes best-of-N clues to the **sentence-realism
> bar** (`clue-style.md` §1b — a real sentence a person would say, def woven, no narrated mechanic, no
> orphan words; **ranked above wit**) and **hard-gates** them through the real validator → assemble the
> winners back → run the tests → **≥3 blind realism judges in parallel, majority vote** (§1b, on
> bare surfaces with no answers) → a **semantic auditor** for what the validator can't check → **a
> human reads every changed clue** → patch the flags → regenerate the archive → commit & deploy.
> Answers never change (so grids stay stable).
>
> **Three non-negotiables baked in since the floor-raises (2026-06-05 / 2026-06-10):** (1) **device
> is free** — re-pick the construction to whatever yields the best *real-sentence* clue (the answer
> is fixed, the device is not); (2) **realism judging is BLIND and MULTI-JUDGE** — bare surfaces
> only, ≥3 independent judges, majority vote; single judges reading full entries rubber-stamp
> ("Control reign, reportedly" survived one); (3) the **mechanical gate now covers surface economy**
> (orphan spans, charade containment-glue, composition/letter-accounting, indicator-in-surface) via
> `src/data/surface-rules.ts` + `integrity.ts` — don't hand-wave these, the validator rejects them.

---

## The pieces (what's where)

| Piece | Path | Role |
|---|---|---|
| **Style guide** | `docs/clue-style.md` | The contract: fairness rules, surface craft, 5-axis rubric **with §1b "surface realism" as the #1 PASS/FAIL gate** (real sentence / no recipe / def woven / no orphan, above wit) and **§1c the gentle teaching register** for Stage-A, device conventions, the exact `BankEntry` JSON + `operations` templates. Every agent reads it. |
| **Validator harness** | `scripts/validate-clue.ts` | CLI that runs candidates through the *real* `hydrateBankEntry` + `validateClue` + surface lint. The hard mechanical gate. `npm run clues:validate -- <file.json>` (one object or an array). Exit 0 = all `ok:true`. |
| **Abbreviation dictionary** | `src/data/abbreviations.ts` | The ONLY abbreviation cues allowed (`old→B` etc. are rejected). The validator enforces it. |
| **Mechanical validator** | `src/data/integrity.ts` | The fairness logic (also run in CI via the tests). |
| **The bank** | `src/data/bank/part-a.json … part-h.json` | The clues that fill puzzles. Merged in `src/data/bank/index.ts`. Entries use `answer` (not `solution`) and have no `id`. |
| **Teaching corpus** | `src/data/clues.ts` | Stage-A lesson clues. **Rebuilt to the bar 2026-06-05** (was wrongly "left as-is"). If you edit it, follow `clue-style.md` **§1c gentle teaching register** (a real cryptic clue with genuine disguise, but gentle vocab/devices — *never* transparent give-aways) + the realism + originality process below. Uses `solution`/`id` (not `answer`); validate via `integrity.test.ts`. |
| **Archive compiler** | `scripts/generate-puzzles.mjs` | Places bank words into grids → `public/archive.json`. `TIERS` controls puzzle counts. Rerun after ANY bank edit. |
| **Pipeline helpers** | `scripts/clue-chunk.mjs`, `scripts/clue-assemble.mjs`, `scripts/clue-patch.mjs` | Chunk / merge-back / patch. |
| **Surface rules** | `src/data/surface-rules.ts` | THE single shared source for every surface check (no more three-way copy-sync). GATE rules (deterministic, fail CI + the pipeline): bare word-list / raw caps; **containment language gluing a charade** (wrong device); **indicator absent from the surface**; **flagrant orphan words** (multi-word spans no part of the cryptic reading pays for). ADVISORY (ranking only): single decorative orphans, function-word ratio, proper-noun density, vague nouns, terseness (whole-clue devices — double-def/cryptic-def/&lit — are legitimately short and exempt). |
| **Surface lint** | `scripts/lint-surfaces.ts` | Reporter over `surface-rules.ts`. `npm run clues:lint -- --rank` lists every clue weakest-first (triage); `--ids` lists CI-gate hits; `--src=part-x.json` restricts scope. |
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

**4b. BLIND sentence-realism judging (PASS/FAIL, §1b) — MANDATORY, MULTI-JUDGE.** A single judge
reading full clue entries rubber-stamps borderline surfaces (proven repeatedly: "Control reign,
reportedly" survived a "mandatory adversarial" pass). The protocol that works:
1. **Strip to bare surfaces** — emit `{id, text}` only (no answer, no device, no parse, enum removed)
   so judges can't be seduced by clever wordplay. (See `tmp/make-blind.mjs` pattern.)
2. **Dispatch ≥3 independent judges in parallel**, each with a DIFFERENT lens — e.g. (a) newspaper
   subeditor "would I print this sentence?", (b) read-aloud "could this leave a real mouth?",
   (c) scene coherence "is there ONE picturable scene a writer could have intended?". Each judge
   writes a JSON fail-list with one-line reasons.
3. **Majority vote**: any surface failed by ≥2 of 3 judges is rebuilt **device-free** (setter pass
   restricted to the fails, hard-gated through the validator). Re-judge the rebuilt surfaces the
   same blind way; iterate until clean.
4. **Then a human reads every changed clue** and rejects any they wouldn't say aloud.
Realism is ranked ABOVE wit, so this runs before any wit polish.

**4c. Surface grade & polish** (raise axis 3, *above* the realism floor) — dispatch ONE **SURFACE GRADER** agent over the
freshly-assembled `part-<part>.json`; it scores every surface and returns the weak ones (surface ≤ 3),
weakest first. Feed that list to ONE **SURFACE POLISH** agent (templates below), which rewrites
ONLY the flagged surfaces — same `answer` + same `clueType`, hard-gated through the validator —
and emits `tmp/fixes-pol-<part>.json`. Apply with `node scripts/clue-patch.mjs <part>
tmp/fixes-pol-<part>.json`, then re-run the **mechanical gate** (step 4). `npm run clues:lint --
--rank --src=part-<part>.json` is a fast pre-triage / health-check.
(Surface rewrites keep the answer, so grids stay valid — but they DO change clue text, so the
archive regen at step 7 is still required.)

**4d. Originality check (surfaces only).** Cryptic *constructions* are letter-forced chestnuts
(DOG+MA, RANGER−R) — shared knowledge, fine to reuse and good to teach. But a *surface* must be our
own wording, not a verbatim/near-verbatim lift of a published clue. For any surface that reads like a
stock clue (short, common answers especially), web-search it; if it closely matches a published clue,
reword the surface (keep the construction). If the surface is so letter-forced that *every* natural
phrasing is already published (e.g. BIGWIG = big + wig + important-person — every wording exists),
**swap the answer** for one with more surface freedom. (Teaching answers swap freely; **bank answers
are grid-locked**, so a swap there means dropping/replacing the entry and regenerating — `clue-assemble`
refuses an answer-set change otherwise.) "Exists nowhere" is impossible for chestnuts; the standard is
*our wording, not a copy*.

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
- **The validator now mechanically enforces** (since 2026-06-10, beyond letters + abbreviations):
  charade `concat` pieces must compose to the answer and be produced by a prior op or sit verbatim
  in the surface; `insert` must be a TRUE internal insertion in "X in Y"/"Y around X" form;
  alternation letters are checked; a literal piece may not swallow an indefinite article
  ("a cake"→CAKE is rejected — the A is unaccounted); charades may not use containment words
  (in/inside/into/about/around…) as glue; the indicator must appear in the surface; and flagrant
  orphan words (multi-word decorative spans) are rejected. Plan constructions accordingly: every
  surface word must be definition, indicator, fodder, an operation's cue, or a genuine link word.
- **The validator still can't check semantics, realism, or originality.** Whether a `synonym` is
  real, a double-def/homophone resolves (the semantic auditor, step 5), whether the surface is a
  real sentence (the **blind multi-judge**, step 4b — ranked above everything), and originality
  (step 4d) all remain agent/human work. All three, plus a human read of every change, are
  mandatory — not optional.
- **Letter-forced short answers (3–4 letters) that can't reach a natural sentence go to a human
  pick** — don't loop agents on them; the style guide concedes some answers need a human call.
- **Bank edit ⇒ regenerate the archive** (`clues:regen`) or `archive.test.ts` fails on drift.
- **Teaching corpus (`src/data/clues.ts`) follows §1c.** It was rebuilt to the *gentle teaching
  register* (2026-06-05) — real cryptic clues with genuine disguise, but gentle vocabulary/devices,
  **never transparent give-aways**. If you edit it, apply §1c + the realism (4b) and originality (4d)
  steps. It uses `solution`/`id` (not `answer`/none) and validates through `integrity.test.ts`, not
  the bank harness. Teaching answers are NOT grid-locked, so swap an answer freely when a word can't
  reach the bar in its device.
- `tmp/` is gitignored scratch space; never commit it. The committed durable assets are the style
  guide, the harness, and the three pipeline scripts.

---

## Agent prompt templates

Spawn these as general-purpose subagents. Replace `<part>` / `<n>` / counts as needed.

### SETTER (best-of-N rewrite) — one per chunk
```
Expert cryptic setter improving a clue bank. Repo: <ABSOLUTE REPO PATH>.
FIRST read `docs/clue-style.md` in full — **especially §1b "Surface realism", the #1 PASS/FAIL gate,
ranked ABOVE wit** (the contract also covers fairness, surface craft, the 5-axis rubric, device
conventions, and the exact BankEntry JSON output + per-device `operations` templates). Skim
`src/data/abbreviations.ts` for the only allowed abbreviation cues.

THE BAR (in priority order): a clue must (1) read as **one real, natural sentence a person would
actually say or write** — pass the conversation test; (2) have its **definition woven in** at the
start/end (never comma/dash-tacked, always a word people use); (3) **never narrate the mechanic**
("spell X backwards", "beheaded, is", "minus its head leaves…") — the device hides inside an ordinary
word or idiom; (4) have **no orphan word** (every word does cryptic work); (5) be **fair** (passes the
validator). Maximise wit only AFTER all five hold. The **device is free** — re-pick the construction
to whatever yields the best real sentence (the answer is fixed; the device is not).

Your incumbents are in `tmp/in/<part>-<n>.json` (read it). For EACH answer, do best-of-N:
1. Write 3–4 GENUINELY DIFFERENT candidate clues — **real sentences first**, varying the DEVICE
   (not trivial rewordings). Follow the output contract exactly (BankEntry shape, per-device
   operations, ONE definition at start/end, the `indicator` must appear in the surface, `parse` =
   full worked solution). Keep the SAME answer (identical letters); the (enum) must match.
2. HARD-GATE every candidate: write them to `tmp/cand-<part><n>.json` and run
   `npx tsx scripts/validate-clue.ts tmp/cand-<part><n>.json`. Discard/fix any `ok:false`.
3. Grade survivors: FIRST apply §1b as a hard PASS/FAIL (real sentence? def woven? no narrated
   mechanic? no orphan word? — reject any candidate you would not say aloud), THEN rank the
   survivors on the rest of the 5-axis rubric. Treat the incumbent as a candidate and KEEP it only
   if it genuinely beats your new ones (don't replace an already-excellent clue). Pick ONE winner per
   answer — a clever, fair, real sentence with no filler. Avoid the known faults: **recipe / narrated
   mechanic, comma- or dash-tacked definitions, orphan decorative words, grammatical-but-surreal
   surfaces**, plus formulaic "beheaded X" deletions, forced fodder, bogus synonyms, telegraphic
   word-lists, answer-screaming definitions, and monotonous runs of one device.

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
is flagged with ?/perhaps where needed; (6) LINK WORDS / INDICATORS read correctly for the ACTUAL
device — flag a charade/concatenation that uses a containment word ("in/inside/within/around/about")
as its joiner, since it implies the wrong device and can spell a false answer (e.g. "Working in
church" = ON "in" CE wrongly reads as a container → CONE, not the charade ONCE), an indicator of the
wrong type for its device, or any word with NO role in the cryptic reading (extraneous padding that
breaks "every word works"); (7) the surface reads as natural English (flag genuine nonsense only).
Standard cryptic GK is allowed (cob=male swan, P=quiet, TAR=sailor, etc.). Only flag GENUINE errors.

Return a markdown table of FLAGGED clues only: ANSWER | SEVERITY (BROKEN = wordplay/def doesn't
actually work; DUBIOUS = questionable) | PROBLEM (quote the bad part) | SUGGESTED FIX (a concrete
fair replacement keeping the SAME answer). End with "X broken, Y dubious of N". Read-only.
```

### EXPANSION (invent new clues) — one per length band
```
Expert cryptic setter EXPANDING a clue bank with brand-new entries. Repo: <ABSOLUTE REPO PATH>.
FIRST read `docs/clue-style.md` in full — **especially §1b "Surface realism", the #1 PASS/FAIL gate
ranked ABOVE wit**. Skim `src/data/abbreviations.ts`. Read `tmp/existing-answers.json` — answers
ALREADY in the bank that you must NOT reuse.

THE BAR (priority order): every clue must (1) read as one **real, natural sentence** (conversation
test); (2) have the **definition woven in**, not tacked; (3) **never narrate the mechanic**; (4) have
**no orphan word**; (5) be **fair** (passes the validator). Wit only after all five hold. The device
is free.

TASK: invent <N> NEW answers, each a common single English word of EXACTLY <L> letters (A–Z only),
great for crossword fill (common letters, well-known words), NONE appearing in
tmp/existing-answers.json. For each, write a clue best-of-N — **draft a few real sentences, pick the
best per the bar above** — varied devices across the set, no filler. Prefer answers with enough
surface freedom to write a clue that ISN'T just the stock published treatment of that word (very short
words like ART/AGE/EAR are nearly impossible to clue originally — favour richer answers).

HARD-GATE everything: write candidates to `tmp/cand-exp<L>.json` and run
`npx tsx scripts/validate-clue.ts tmp/cand-exp<L>.json`; only keep ok:true.

OUTPUT: write a JSON ARRAY of <N> BankEntry objects to `tmp/clue-winners/exp-<L>.json` (each:
{answer, clueType, difficulty, clue, def:{text,position}, wordplay:{indicator,fodder,operations},
parse}). Run `npx tsx scripts/validate-clue.ts tmp/clue-winners/exp-<L>.json` and confirm EVERY
entry ok:true AND no duplicate answers among them. Return a list: ANSWER | clue. Edit NO repo file
except tmp/ outputs.
```

### BLIND REALISM JUDGE — ≥3 in parallel, different lenses (read-only) — MANDATORY (step 4b)
First strip the part to bare surfaces: a JSON array of `{id, text}` with NO answer, device, parse,
or enumeration (judges must see only plain English). Then dispatch ≥3 of these in parallel, varying
the lens (newspaper subeditor / read-aloud / scene coherence):
```
You are a strict <newspaper subeditor judging sentences for print | judge applying the read-aloud
test | judge of scene coherence>. Read tmp/<surfaces-file>.json — a JSON array of items {id, text}.
Each text is a short piece of English. Judge each item as PLAIN ENGLISH PROSE on its own; do not
guess at any hidden meaning or purpose.

FAIL an item if: it is not really a sentence or natural phrase (words jammed together); it is
grammatical but describes an incoherent scene no writer would intend; it is broken by interjections
no one would write (", oddly," ", we hear," as filler); or it reads as comma-spliced fragments
rather than one coherent statement. PASS generously anything a person could genuinely say: short
imperatives, questions, compact noun phrases, jokes, whimsical-but-coherent scenes.

OUTPUT: write a JSON array of FAILS ONLY to tmp/judge-<n>.json, each {"id","reason"}. Reply with
just the fail count. Modify no other file.
```
**Majority vote (≥2 of 3) decides.** Each majority FAIL is rebuilt **device-free** by a SETTER pass
restricted to those answers, re-gated through the validator, re-judged blind, and **read by a human**
before assembling. Judge → fix → re-judge → human-review is mandatory, not optional — single
non-blind judges have repeatedly rubber-stamped fragments.

### SURFACE GRADER — one per part (read-only)
```
Strict cryptic-crossword editor grading the SURFACE quality of finished clues (axis 3 of the style
guide: natural, picturable English that misdirects). The clues already pass the mechanical gate and
a semantic audit — judge ONLY the surface reading, not the mechanics.

Read `docs/clue-style.md` §1 (the 5-axis rubric) and §3 (surface craft + the faults table) in
<ABSOLUTE REPO PATH>, then read `src/data/bank/part-<part>.json`. For EACH clue, score the SURFACE
(1–5) and WIT (1–5) per the rubric, applying the faults table (padding/filler, crossword-ese, no
image/abstract, non-sequitur, register/tense clash, proper-noun padding, screams the answer, device
pile-up) and the image / conversation / economy / register tests. Standard cryptic GK and fair
misdirection are GOOD, not faults — do not flag a clue merely for being a particular device.

Return a markdown table, WEAKEST FIRST, of every clue scoring surface ≤ 3 (or wit ≤ 2):
ANSWER | SURFACE | WIT | FAULT (quote the weak word(s)) | rewrite direction (one line; keep the SAME
answer and device). End with "N of M clues flagged (surface ≤ 3)". Read-only — suggest, don't edit.
```

### SURFACE POLISH — rewrites the flagged clues (one per part)
```
Expert cryptic setter POLISHING the surface of clues a grader flagged as weak. Repo: <ABSOLUTE REPO
PATH>. FIRST read `docs/clue-style.md` in full (esp. §3 surface craft + faults table, §6 output
contract, §8 writing loop). Skim `src/data/abbreviations.ts` for the only allowed abbreviation cues.

You are given the grader's flagged list for `src/data/bank/part-<part>.json` (pasted below) plus the
current entries. For EACH flagged answer, rewrite ONLY the surface into natural, picturable English
that still misdirects — best-of-N: draft 2–3 surfaces, keep the best per the rubric (surface ≥ 4,
surface + wit ≥ 7). HARD CONSTRAINTS: keep the SAME `answer` (identical letters) and the SAME
`clueType` (device); you MAY reword the surface, the `indicator`, the `fodder`, the `def` synonym,
and the `parse`, provided the wordplay still resolves, the `indicator` appears VERBATIM in the new
surface, and the (enum) still matches. Leave already-strong clues alone.

HARD-GATE every rewrite: write them to `tmp/cand-pol-<part>.json` and run
`npx tsx scripts/validate-clue.ts tmp/cand-pol-<part>.json`; fix until EVERY entry is ok:true.

OUTPUT: write the fixes as a JSON OBJECT keyed by ANSWER (uppercase) → full BankEntry to
`tmp/fixes-pol-<part>.json` (the shape `scripts/clue-patch.mjs` consumes — answers not in the object
are left untouched). Confirm `npx tsx scripts/validate-clue.ts` over the object's values is all
ok:true. Return a table: ANSWER | old surface | new surface | why it reads better. Edit NO repo file
except your tmp/ outputs; answers and devices must stay identical.
```

> Tip: dispatch the ~5 setters for a part in a single message (parallel). Keep the human in the
> loop between parts — read each setter / **sentence-realism judge** / auditor / grader summary before
> assembling or patching, and read every changed clue yourself (the realism judge → fix → human-review
> step is mandatory; agents rubber-stamp their own fragments).
