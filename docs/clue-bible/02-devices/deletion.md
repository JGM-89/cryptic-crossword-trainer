# Deletion (subtraction)

*Clue Bible, chapter 02. Rule IDs are defined in `03-rules-and-flags.md`; the JSON contract is
`_json-contract.md`. Rule-ID note (2026-10-02): rule names follow `src/data/clue-rules.ts`
and `scripts/clue-flags.mjs`. Idle words are **F-IDLE** (the design spec's R-IDLE, demoted to a
flag by the owner's fairness decision); F-UNATTESTED was tried and rejected as an automatic
check, so invented phrases are judged in the exam (DECOY, TOURNAMENT-SURFACE). Status: v1.*

## 1. What it is and the fair form

The answer is a longer word with one or more letters removed: COVEN minus its first letter =
OVEN. The indicator says **which** letters go: the first (*beheadment*), the last
(*curtailment*), the middle, both ends, or a named letter.

**Fair form:** `definition` + `longer word` + `deletion indicator` (adjacent), with optional link
words, nothing else.

- The indicator must say exactly which letters go. "Endless" removes the last letter, not any
  letter; "heartless" removes the middle letter (or the middle two of an even-length word),
  not any interior letter.
- If a named letter goes ("loveless" = without O), the letter's cue must be a listed
  abbreviation (`_abbreviations.md`).
- **House rule (validator): a `deletion` clue's longer word must be printed in the clue.** The
  validator rejects "indirect deletion" (finding a synonym, then shortening it), by the same
  logic as the indirect-anagram rule. This is **stricter than broadsheet practice**, where
  deleting from a synonym is routine (see the published example in §4). See §7 for how to
  write a shortened synonym inside a charade or container instead.
- The longer word must be a **different word** from the answer, not a plain inflection of
  it: WONDERS → WONDER prints the answer (R-ANSWER-IN-CLUE checks the answer plus -s, -es,
  -d, -ed, -ing). A derived word is fine: LEARNER minus ER = LEARN is published usage, which is
  why the code deliberately leaves -er and -ly out of the check.
- One definition at one end; every word has a job (F-IDLE).

## 2. JSON the validator expects

```json
{
  "answer": "OVEN",
  "clueType": "deletion",
  "clue": "The coven lost its head over the cooker (4)",
  "def": { "text": "the cooker", "position": "end",
           "evidence": { "source": "wordnet", "sense": "oven.n.01: kitchen appliance used for baking or roasting" } },
  "wordplay": {
    "indicator": "lost its head",
    "fodder": "coven",
    "operations": [ { "op": "delete", "input": "COVEN − C", "output": "OVEN" } ]
  }
}
```

- `fodder` = the longer word as printed.
- `operations[0].input` = `"FODDER − X"`: the full word, a minus sign (U+2212; en dash or hyphen
  also parse), the removed letter(s). `src/data/bank/index.ts` takes the part before the minus
  as the fodder if `fodder` is empty.
- **[validator]** the answer is a strictly shorter subsequence of the fodder, **and** the fodder's
  letters occur in the clue.
- **[clue-rules]** R-ANSWER-IN-CLUE catches the answer plus -s/-es/-d/-ed/-ing as a
  surface word.
- Named-letter deletion: add an `abbreviate` op for the cue first
  (`{"op":"abbreviate","input":"love","output":"O"}`), then the `delete` op.

## 3. Indicators

**Reference vocabulary:** `src/data/indicators/deletion.json` (234 entries, published usage ≥ 2). Not checked by code yet; prefer listed indicators. Idioms such as "lost its head" are not on it as phrases but are built from listed words and are fair when they say which letter goes.

Wikipedia: *beheaded, topless, endlessly, nearly, unfinished, heartlessly*. Sutherland:
*absent, excluding, losing, not, dropped, cut, without, short*, with position words *first,
head, opener, tail, end, conclusion, half, middle, centre*.

| Removes | Indicators |
|---|---|
| First letter | beheaded, headless, leaderless, topless, decapitated, losing its/his/her head, lost its head, loses its head, without a leader, first off, unopened |
| Last letter | endless, endlessly, unending, curtailed, docked, tailless, cut short, short, unfinished, incomplete, nearly, almost, not quite, nearly all, most of, mostly, briefly |
| Both ends | trimmed, peeled, shelled, skinned, topped and tailed, limitless, edges removed |
| Middle letter(s) | heartless, heartlessly, gutless, disheartened, without heart |
| All interior letters | empty, emptied, hollow, vacant, gutted |
| A named letter | without X, minus X, losing X, dropping X, leaving X, missing X, lacking X, X-less (cue for X from `_abbreviations.md`) |

**House guidance (Cruci).** Judgement calls unless marked *direction* or *validator*; the owner's fairness rule is that Cruci never rejects what professional setters do, so these exist only where Cruci's standalone, direction-free clues make a published usage ambiguous.
- **"Topless", "headless", "endless" are direction-free**: the first letter is the "head" or
  "top" of a word in either direction, by universal convention. Allowed.
- **Avoid "out", "off", "not"** as bare deletion indicators: they also read as anagram or
  container indicators.
- **Do not put a deletion indicator next to a definition** where it can be read as part of it:
  WARFARE "Fighting's price is **endless** conflict" reads as an instruction to curtail
  "conflict" (audit 02 #57).
- **"At first", "initially", "head of"** select a first letter (`initialism.md`, or a
  first-letter abbreviation); they do not delete it. Do not mix the two.

## 4. Surface craft

1. **Make the indicator an idiom the surface needs.** OVEN works because "lost its head over"
   is what a coven might do (got carried away over a cooker); the deletion instruction is
   invisible (audit 02 §5, teaching #12). ANGER's "loses his head" doubles as losing one's
   temper.
2. **Choose a longer word whose own sense belongs to the scene.** STARE → STAR: *Endless stare
   at a celebrity* is a plausible sentence about fame.
3. **Avoid the "beheaded X" treadmill.** A run of "beheaded", "headless", "endless" clues is
   formulaic (`docs/clue-style.md` §5, kept as a house rule). Vary which end, and vary the
   family. B-REPEAT fails a batch that uses the same indicator more than twice.
4. **Never print the answer.** If the only longer word is an inflection of the answer
   (WONDERS), change device.

Published example (one, attributed): *"First of autumn leaves turning putrid (7)"*, ROTTING,
Henry Hook, cited by David Astle ([Fond clues](https://davidastle.com/da-blog/fond-clues)):
ROTATING ("turning") with A ("first of autumn") leaving. It is a model broadsheet deletion, and
it is exactly the indirect form the Cruci validator rejects for `clueType: "deletion"`.

## 5. Typical failures

| Failure | Example | Rule |
|---|---|---|
| The longer word is an inflection of the answer | WONDER "She **wonders** endlessly, lost in awe" (the bank's only deletion) | **R-ANSWER-IN-CLUE** |
| Words with no job | WONDER "**She** … **lost** in awe" | **F-IDLE** |
| Indirect deletion (synonym first) as `clueType: "deletion"` | "Beheaded celebrity is sailor" (STAR − S = TAR; the old style-guide example: it fails the current validator because "star" is not printed) | validator (house rule) |
| Indicator does not say which letter goes ("loses a letter", "shortened" for a middle letter) | — | soundness (`01-qualities.md` §1) |
| Deletion indicator read into the definition | WARFARE "endless conflict" | house (§3) |
| Formulaic run | several "beheaded X" in one batch | **B-REPEAT**; **F-TEMPLATE** |
| Article left unaccounted next to fodder | "A ranger loses his head…" (could a solver count the A?) | **F-IDLE** (judge by hand; the HARM case in `charade.md`) |

## 6. Exemplars

The bank has **one** deletion clue (WONDER), and it is weak. The best exemplars come from the
teaching corpus (`src/data/clues.ts`), which we also own.

**Best**
- **OVEN** (teaching) — *The coven lost its head over the cooker (4)*. COVEN − C. The indicator
  is an idiom the surface needs. Audit 4/4.
- **STAR** (teaching) — *Endless stare at a celebrity (4)*. STARE − E. A plain, real sentence.

**Weak**
- **WONDER** (bank) — *She wonders endlessly, lost in awe (6)*. The answer is printed
  ("wonders"), and "She" and "lost" do nothing. R-ANSWER-IN-CLUE, F-IDLE. The audit proposed a
  charade instead (WON + DER) and a new deletion elsewhere (DELIVER: DELI + VER(y), a charade
  with a shortened piece).

## 7. Cruci-specific notes

- **The most missing device.** One deletion in 415 clues, against 5–10% in a broadsheet (audit
  02 §3.1). The audit's target is about 8 per 100 new clues.
- **Shortened synonyms inside other devices.** Within a `charade` or `container`, a piece may
  be a synonym that is then shortened: a `synonym` op (with `evidence`), then a `delete` op
  whose output is the piece, then the `concat`/`insert`. The validator's literal-fodder check
  applies only to `clueType: "deletion"`, so this is the supported way to write the standard
  broadsheet construction (e.g. DELI + VER(y) for DELIVER, with "very, nearly"). The deletion
  indicator must sit next to the word it shortens.
- **Open issue for case law:** whether whole-clue indirect deletion (ROTTING-style) should be
  allowed. Until the owner decides, it is not.
- **Teaching register (Stage A).** One letter from one end, a common longer word that is a
  different word from the answer, and an indicator that is an idiom ("lost its head",
  "endless"). Never narrate ("Hedge, beheaded, is a border" is the old fault, §1c).
- **Par.** One operation (C = 0) for a plain deletion; a named-letter deletion adds an
  abbreviation (C = 1).

## Sources

- Wikipedia, *Cryptic crossword*, "Deletions": https://en.wikipedia.org/wiki/Cryptic_crossword
- D. Sutherland, *Spotting indicator words* (Dummies): https://www.dummies.com/article/home-auto-hobbies/games/puzzles/crosswords/spotting-indicator-words-when-solving-cryptic-crosswords-175680/
- D. Astle, *Fond clues*: https://davidastle.com/da-blog/fond-clues
- Audit 02 §2, §2b #25, #30, §3.1, §5: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/integrity.ts` (case `deletion`: subsequence + literal fodder), `src/data/clue-rules.ts` (R-ANSWER-IN-CLUE), `src/data/bank/index.ts` (`deriveFodder`)
