# &lit (all-in-one)

*Clue Bible, chapter 02. Rule IDs are defined in `03-rules-and-flags.md`; the JSON contract is
`_json-contract.md`. Rule-ID note (2026-10-02): rule names follow `src/data/clue-rules.ts`
and `scripts/clue-flags.mjs`. Idle words are **F-IDLE** (the design spec's R-IDLE, demoted to a
flag by the owner's fairness decision); F-UNATTESTED was tried and rejected as an automatic
check, so invented phrases are judged in the exam (DECOY, TOURNAMENT-SURFACE). Status: v1.*

## 1. What it is and the fair form

The **whole clue** is the wordplay, and the **same whole clue**, read straight, is the
definition. Every word does both jobs. "Terribly evil" = (EVIL)* = VILE, and "terribly evil"
also means vile.

**Fair form:** one sentence that passes two independent readings:

1. **Wordplay reading:** a complete, fair clue for the answer by one of the other devices
   (anagram, hidden, initials, container…), using **every** word, with that device's indicator
   rules (direction-free reversal indicators, allowed hidden indicators, literal anagram
   fodder…).
2. **Definition reading:** the whole sentence, read literally, describes the answer
   accurately. This is checked like any definition: `def.evidence` names the sense the
   sentence describes.

- If any word is wordplay-only and plays no part in the definition, or definition-only and
  plays no part in the wordplay, it is **not** an &lit. A **semi-&lit** (the whole clue defines,
  but the wordplay uses only part of it; Wikipedia) is filed under its wordplay device in
  Cruci, with the definition as a normal end-of-clue span.
- An "!" (or "?") at the end conventionally marks an &lit. Use it when the definition reading
  is playful; it is not required.
- Ximenes and Alberich both prize the form; Alberich's example is ECONOMIST, and he notes that
  &lits "most often require an anagram"
  ([tips](https://www.alberich-crosswords.com/articles/tips-for-setters)).

## 2. JSON the validator expects

```json
{
  "answer": "MEND",
  "clueType": "lit",
  "clue": "Initially make every nick disappear? (4)",
  "def": { "text": "Initially make every nick disappear?", "position": "start",
           "evidence": { "source": "wordnet", "sense": "repair.v.01 (mend): restore by replacing a part or putting together what is torn or broken" } },
  "wordplay": {
    "indicator": "Initially",
    "fodder": "make every nick disappear",
    "operations": [ { "op": "initials", "input": "Make Every Nick Disappear", "output": "MEND" } ]
  }
}
```

- `clueType` = `"lit"`; `def.text` = the whole clue without `(n)`, `position: "start"`.
- `indicator`, `fodder`, `operations` = exactly what the underlying device's file specifies.
- `def.evidence` = the sense the whole sentence describes. No `pun`.

**Important: the code checks almost nothing for `lit`.**
- `integrity.ts` runs its letter checks by `clueType`, so for `lit` it checks only that the
  final op outputs the answer. Anagram letters, hidden contiguity, initials and reversals are
  **not** verified.
- `clue-rules.ts` runs R-FODDER-LETTERS only for `anagram`, R-HIDDEN-IND only for `hidden`,
  R-INDICATOR-DIR only for `reversal`.
- `surface-rules.ts` exempts `lit` from the orphan check (F-IDLE).

So **run the underlying device's checks yourself**: validate a copy of the entry with
`clueType` set to the underlying device (e.g. `"anagram"`) through
`npx tsx scripts/validate-clue.ts`, then switch it back to `lit`. The copy's letter checks and
indicator rules are the ones that matter; its F-IDLE result is meaningless here, because the
whole-clue definition covers every word, so do the word-by-word job check by hand.

## 3. Indicators

Whatever the underlying device needs, under that device's rules: see `anagram.md`,
`hidden.md`, `initialism.md`, `reversal.md` (direction-free only), `container.md`,
`deletion.md`. The indicator does double duty: it must also be a natural part of the
definition reading ("Terribly" intensifies "evil"; "Initially" begins an instruction).

## 4. Surface craft

1. **Look for answers whose letters describe themselves.** Anagram &lits arise when fodder
   plus indicator can describe the answer (ENRAGED from "angered", in the old style guide);
   initials &lits arise when a phrase about the answer happens to start with its letters
   (MEND).
2. **The definition reading must be a real description, not a stretch.** "Make every nick
   disappear" is what mending does. If you need to explain how the sentence defines the
   answer, it does not.
3. **Clarity over cunning for learners.** The old style guide's advice stands: for a learner
   audience, prize clarity-with-elegance over maximum cunning; ship only a clean &lit.
4. **Avoid the textbook ones.** "Terribly evil" (VILE) is the example in every guide; it is a
   chestnut (F-CHESTNUT).

Published example (one, attributed): *"I'm one involved with cost (9)"*, ECONOMIST, cited by
Alberich ([tips](https://www.alberich-crosswords.com/articles/tips-for-setters)): an anagram of
I'M ONE + COST whose whole sentence also describes an economist.

## 5. Typical failures

| Failure | Example | Rule |
|---|---|---|
| Underlying wordplay unsound (letters wrong, indicator invalid) | — (not machine-checked for `lit`) | the underlying device's rule: **R-FODDER-LETTERS**, **R-HIDDEN-IND**, **R-INDICATOR-DIR**, by hand |
| A word that is wordplay-only or definition-only | — | **F-IDLE** (by hand; the code exempts `lit`) |
| The whole clue does not really define the answer (it is a semi-&lit filed as `lit`) | — | **F-DEF-EVIDENCE**; refile under the device |
| Chestnut | VILE "Terribly evil" | **F-CHESTNUT** |
| Grim or forced scene to make the letters work | — | `01-qualities.md` (taste test) |

## 6. Exemplars from our bank

**Best**
- **MEND** — *Initially make every nick disappear? (4)*. Initials of "Make Every Nick
  Disappear"; the sentence also describes mending. Audit 4/4.

**Weak**
- **VILE** — *Terribly evil (4)*. Sound and neat, but it is the textbook example clue that
  every solver knows (audit 02 #70). F-CHESTNUT. Fine in the teaching corpus as canon; it does
  not belong in the bank.

## 7. Cruci-specific notes

- **Rare by nature.** Broadsheets run 0–3%; the bank has 2 (0.5%). Never force one: a clean
  device clue beats a strained &lit.
- **Difficulty.** &lits are usually difficulty 4–5 (`01-qualities.md` §9.1); a very gentle one
  like MEND can be 3. Be honest.
- **Hints.** The hint ladder tells the learner "the WHOLE clue is the definition — and the very
  same words are also the wordplay" (`src/data/hydrate.ts`), so the parse (rung 4) must show
  both readings.
- **Not in the curriculum** (`CLUE_TYPE_ORDER`); archive-only.
- **Par.** As for the underlying device, and D is usually 1 (the definition is hard to see).

## Sources

- Wikipedia, *Cryptic crossword*, "&lit." and "Semi-&lit.": https://en.wikipedia.org/wiki/Cryptic_crossword
- Alberich, *Tips for setters*: https://www.alberich-crosswords.com/articles/tips-for-setters
- Ximenes, ch. 5 "Cluemanship": https://xotaotc.nfshost.com/chapter-5-cluemanship/
- Audit 02 §2, §3.7: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/integrity.ts` (no `lit` case), `src/data/clue-rules.ts`, `src/data/surface-rules.ts` (`WHOLE_CLUE_DEVICES`), `src/data/hydrate.ts`
