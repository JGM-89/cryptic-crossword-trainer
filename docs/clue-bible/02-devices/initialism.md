# Initialism (acrostic, initial letters)

*Clue Bible, chapter 02. Rule IDs are defined in `03-rules-and-flags.md` and implemented in
`src/data/clue-rules.ts` / `scripts/clue-flags.mjs`; the JSON contract is `_json-contract.md`.
Rule-ID note (spec revision 2, 2026-10-02): idle words (**F-IDLE**, formerly R-IDLE) and printed
answer pieces (**F-PRINTED**, formerly R-PRINTED) are flags, not rules; batch checks (B-*) are
flags; any rule can be waived for one clue with a written reason (`_json-contract.md` §6a).
F-UNATTESTED was tested and rejected (case law CL-050), so invented phrases are judged in the
exam (NATURALNESS, TOURNAMENT-SURFACE). Worked examples are executable: each `id` cited below is
an entry in `../examples/<device>.json`, checked in CI by `src/data/bible-examples.test.ts`.
Status: v1.*

## 1. What it is and the fair form

The answer is spelt by the **first letters of consecutive words** in the clue, and an indicator
says so: "Initially **a**miable **p**erson **e**ats" = APE.

**Fair form:** `definition` + `initials indicator` + `the fodder words` (indicator directly
before or after the run), with optional link words, nothing else.

- The fodder is a run of **consecutive** words. Every word in the run contributes its first
  letter; no word inside the run is skipped, and no extra word sits between the indicator and
  the run.
- The indicator must say *first letters* (§3). It must govern the whole run: "Initially X Y Z"
  or "X Y Z, initially".
- One definition at one end; every word has a job (F-IDLE).

**Not supported by the validator:** final-letter acrostics ("ends", "tails", "finally"). The
validator checks initials only, so a last-letters clue cannot be written as `initialism`. Open
issue for case law. For a single first letter inside another device, use a first-letter
`abbreviate` op instead ("boy primarily" → B, `_abbreviations.md` rule 5).

## 2. JSON the validator expects

There is no executable `initialism` example yet (the bank has no acrostic). The op shape is the
one in **`lit-mend`** (`../examples/lit.json`), *Initially make every nick disappear? (4)*:
`indicator` "Initially", `fodder` "make every nick disappear", one op `initials` "Make Every
Nick Disappear" → MEND. Filed as `initialism`, the same entry would carry a normal end-of-clue
definition instead of the whole clue, and the validator would also check the initials.

The old style guide's own template, APE *Initially amiable person eats primate (3)*, is
mechanically sound but a weak clue (§6), so it is kept in prose only.

- `fodder` = exactly the run of words, as printed, and nothing else (no indicator, no link).
- `operations[0].input` = the same words with the initials capitalised.
- **[validator]** splits `fodder` on spaces and takes the first letter of each word (after
  stripping non-letters); the result must equal the answer. A hyphenated word ("get-up") counts
  as **one** word. An apostrophe word ("men's") is one word.
- The hint ladder says: *Take the first letter of each word in "amiable person eats".*

## 3. Indicators

Wikipedia: *initially, firstly, primarily* (first letters); Wikipedia and Crossword Unclued
also give *ends, tails, last* for final letters (not supported here).

| Allowed (first letters) | Notes |
|---|---|
| initially, at first, first of all, firstly, primarily, originally, to start with, to begin with, at the outset, in the beginning | adverbs: "X Y Z initially" or "Initially X Y Z" |
| leaders, heads, starts, openers, beginnings, faces, fronts, capitals | nouns: "leaders of X Y Z", "X Y Z's heads" |
| leading, heading, opening (as adjectives on the run) | "leading lights in…": the run follows |
| tops, at the top | by convention a word's "top" is its first letter in either direction; allowed, but prefer the words above |

| Not for this device | Why |
|---|---|
| ends, tails, finally, lastly, at last, ultimately, closing | final letters: not supported by the validator |
| oddly, evenly, regularly, alternately | alternation indicators (`alternation.md`) |
| heart, centre, middle, essentially | middle letters: a different device |
| "first", "head" applied to one word only | that is a single-letter first-letter device; write it as an `abbreviate` op inside a charade |

## 4. Surface craft

1. **The run must read as part of the sentence, not as a list.** "Flick finger in lewd men's
   faces" (below) is a real, if rude, sentence; "faces" is both the indicator and a word the
   sentence needs.
2. **Hide the indicator in the scene.** Nouns like "faces", "heads", "leaders", "openers" can
   belong to the surface (a crowd's faces, a newspaper's leaders) while doing the job.
3. **Let the definition sit apart from the run.** The solver's first move is to look for the
   definition; if the run looks like the definition, they will not think of initials.
4. **Mind the taste test.** APE's surface ("person eats primate") reads as cannibalism or
   cruelty; a cleaner scene is better (`01-qualities.md`).
5. **Make it an &lit if you can.** MEND (§6) is an initials clue whose whole sentence also
   defines the answer.

Published example (one, attributed): *"Flick finger in lewd men's faces (4)"*, FILM, Garson,
Guardian Quick Cryptic 119
([Fifteensquared](https://fifteensquared.net/2026/07/11/guardian-quick-cryptic-119-by-garson/)).

## 5. Typical failures

| Failure | Example | Rule |
|---|---|---|
| A word inside the run is skipped, or an extra word sits in it | "Initially amiable young person eats" for APE | validator (initials ≠ answer) |
| A word with no job outside the run | — | **F-IDLE** |
| Final-letter indicator | "…, finally" | validator (not supported) |
| Indicator ambiguous with alternation ("oddly") | — | house (§3) |
| Definition by example unflagged | — | **F-DEF-EVIDENCE** |
| Surface is a word list | "Initially apple pear egg…" | surface gate (`gateFlags`); `01-qualities.md` |
| Same indicator more than twice in a batch | "Initially" ×3 | **B-REPEAT** (batch flag) |

## 6. Exemplars

The bank has **no** clue filed as `initialism` (audit 02 §3.1: 0 acrostics in 415 clues).

**Best**
- **MEND** (bank, filed as `lit`) — *Initially make every nick disappear? (4)*. First letters
  of "Make Every Nick Disappear"; the whole clue also describes mending. Audit 4/4. See
  `lit.md`; executable example `lit-mend`.

**Weak**
- **APE** (the old style guide's own exemplar, `docs/clue-style.md` §5) — *Initially amiable
  person eats primate (3)*. Mechanically sound, but the scene is grim and odd (taste test), and
  "primate" is a generic definition. Do not copy it. **Judgement example:** the machinery
  passes it, so it has no executable example.

## 7. Cruci-specific notes

- **Missing from the bank.** The two Guardian Quick Cryptics the audit fetched used 11
  acrostics between them (25%); setters treat the acrostic as the gentlest on-ramp device for
  learners (audit 02 §3.1). The audit's target is about 5 per 100 new clues.
- **The curriculum does not teach it yet** (`CLUE_TYPE_ORDER` in `src/types.ts` stops at
  cryptic-definition); initialism is an "advanced" device used in the Play archive. That makes
  each bank acrostic a learner's first sight of the device, so keep the indicator plain.
- **Teaching register.** Common short words in the run, a plain indicator ("initially", "at
  first"), the definition at the other end.
- **Par.** One operation, no abbreviation: C = 0.

## Sources

- Wikipedia, *Cryptic crossword*, "Initial/final letters": https://en.wikipedia.org/wiki/Cryptic_crossword
- Guardian Quick Cryptic 119 by Garson (Fifteensquared): https://fifteensquared.net/2026/07/11/guardian-quick-cryptic-119-by-garson/
- Audit 02 §3.1: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/integrity.ts` (case `initialism`), `src/data/hydrate.ts` (hint text), `src/types.ts`
