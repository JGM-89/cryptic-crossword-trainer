# Alternation (alternate letters)

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

The answer is made of **every other letter** of a printed word or phrase (the fodder), and an
indicator says so: the odd letters of "**b**a**r**b**a**r**i**a**n**" are B, R, A, I, N =
BRAIN.

**Fair form:** `definition` + `alternation indicator` + `fodder` (adjacent), with optional link
words, nothing else.

- The fodder is **literal**: printed in the clue, consecutive, and nothing but the letters the
  rule walks over. Spaces between fodder words are ignored; the alternation runs straight
  across them.
- The pattern starts at the fodder's first letter (odd letters: 1st, 3rd, 5th…) or its second
  letter (even letters: 2nd, 4th, 6th…), and it covers the **whole** fodder. For an answer of
  n letters, the fodder has 2n−1 or 2n letters (odd letters) or 2n or 2n+1 letters (even
  letters). No spare word may sit in the run.
- The indicator must mean *alternate letters* (§3). "Oddly" and "evenly" also fix which set.
- One definition at one end; every word has a job (F-IDLE).

## 2. JSON the validator expects

There is no Cruci alternation clue, so there is no executable example yet (the first one written
through the Writer method goes in `../examples/alternation.json`). The shape, mechanism only:
`indicator` "oddly", `fodder` "barbarian", one op `alternate` "BaRbArIaN" → BRAIN, plus a
`def` with `evidence`.

- `fodder` = the printed word(s), exactly.
- `operations[0].input` = the fodder with the picked letters upper-cased and the skipped ones
  lower-case.
- **[validator]** joins the fodder's letters, takes the letters at positions 1, 3, 5… and at
  positions 2, 4, 6…; one of the two must equal the answer exactly. The fodder's letters must
  also appear, contiguously, in the clue.
- The hint ladder says: *Take alternate letters of "barbarian".*

## 3. Indicators

**Reference vocabulary:** `src/data/indicators/alternation.json` (52 entries, published usage ≥ 2). Not checked by code yet.

Wikipedia gives *odd* and *even*. In use:

| Family | Examples | Which letters |
|---|---|---|
| Odd | oddly, odd letters of, odd bits of, odd parts of, odds | 1st, 3rd, 5th… |
| Even | evenly, even letters of, even bits of, evens | 2nd, 4th, 6th… |
| Either | regularly, alternately, every other, every second, at intervals, now and then, from time to time | either set (the solver tries both) |

**House guidance (Cruci).** Judgement calls unless marked *direction* or *validator*; the owner's fairness rule is that Cruci never rejects what professional setters do, so these exist only where Cruci's standalone, direction-free clues make a published usage ambiguous.
- **"Oddly", "evenly", "regularly", "alternately" are reserved for this device.** They are
  avoided as anagram indicators (`anagram.md` §3), so a solver who sees one can trust it.
- **Prefer "oddly"/"evenly"** for learners: they say which set to take.
- **Avoid "occasionally", "sometimes", "periodically", "irregularly"**: they do not promise a
  strict every-other pattern.
- **"Odd" as an adjective** ("odd parts of the barbarian") is fine; "odd" alone next to a word
  can read as an anagram indicator ("odd barbarian"); avoid it.

## 4. Surface craft

1. **The fodder must be a natural word or phrase.** Long fodder is easy to find with a script
   and hard to make read well. `scripts/raw-material.mjs` can list fodder from real sentences.
2. **Make the indicator an ordinary adverb in the sentence.** "Regularly", "now and then" and
   "every other" are common words; the surface should need them ("visits regularly").
3. **Keep the definition away from the fodder.** If the definition sits next to the run, the
   solver tries to read it as part of the fodder.
4. **Short answers only, as a rule.** The fodder is about twice the answer's length; a 7-letter
   answer needs 13–15 letters of natural fodder.

## 5. Typical failures

| Failure | Example | Rule |
|---|---|---|
| Fodder letters do not alternate into the answer, or a spare word sits in the run | the old style guide's own template: clue *"Regularly value cheese? (4)"* paired with the op *barbarian → BRAIN*. The clue and the op do not match, and "value" alternates to V, L, E / A, U: no 4-letter answer (`docs/clue-style.md` §5, marked "verify!") | validator |
| Indirect fodder (a synonym, then alternate letters) | — | validator (literal fodder) |
| Indicator that does not promise every other letter ("sometimes") | — | house (§3) |
| Indicator used as an anagram indicator elsewhere in the batch | "oddly" for an anagram | house (`anagram.md`) |
| A word with no job | — | **F-IDLE** |
| Definition by example unflagged | — | **F-DEF-EVIDENCE** |

## 6. Exemplars

There are **no** alternation clues in the bank or the teaching corpus (audit 02 §3.1), and the
old style guide's example is broken (§5). The first alternation clues written through the
Writer method should be added here as exemplars, best and weak, with their exam scores.

## 7. Cruci-specific notes

- **Low priority.** Broadsheets use 0–3% alternation; the audit did not set a target. Write
  them when the letters of an answer happen to sit, alternately, in a natural phrase.
- **Not in the curriculum** (`CLUE_TYPE_ORDER` in `src/types.ts`); it is an archive-only
  device, so keep the indicator explicit ("oddly", "evenly").
- **Par.** One operation, no abbreviation: C = 0.

## Sources

- Wikipedia, *Cryptic crossword*, "Odd or even letters": https://en.wikipedia.org/wiki/Cryptic_crossword
- Audit 02 §3.1: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/integrity.ts` (case `alternation`), `src/data/hydrate.ts` (hint text)
