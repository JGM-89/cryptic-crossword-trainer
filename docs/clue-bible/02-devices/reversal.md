# Reversal

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

The answer is a word read backwards: TEN reversed = NET. An indicator says "reverse".

**Fair form:** `definition` + `word clue` + `reversal indicator` (indicator adjacent to the
word it reverses), with optional link words, nothing else.

- The reversed word is either printed (literal: "ten") or clued by a true synonym ("Beer" →
  LAGER). A synonym is fair here, unlike anagram fodder, because reversing a word is a single,
  checkable step.
- The indicator must be **direction-free** (§3). Cruci clues have no fixed direction: the Daily
  serves a clue alone, and Play grids place bank clues Across or Down (`src/data/archive.ts`).
  An indicator that only makes sense in one direction is unfair (R-INDICATOR-DIR).
- One definition at one end; every word has a job (F-IDLE).
- A reversal can also be one piece inside a charade or container; then that clue's `clueType` is
  `charade` or `container`, and the same indicator rules apply to the piece.

## 2. JSON the validator expects

Template (literal word): **`reversal-net`** (`../examples/reversal.json`), *What's left when
ten's knocked over (3)*: `indicator` "knocked over", `fodder` "ten", one op `reverse` TEN → NET.

Template (via a synonym): **`reversal-lever`**, *Party comes back for a bar (5)*: `synonym` Party
→ REVEL (with `evidence`), then `reverse` REVEL → LEVER; `fodder` "REVEL". (The old template
here used REGAL from "beer"; that pair is a chestnut, so the template now uses LEVER.)

- `fodder` = the word that is reversed, in letters (**not** the surface synonym).
- **[validator]** the fodder's letters reversed equal the answer.
- **[clue-rules]** R-INDICATOR-DIR on the `indicator` (machine-checked subset, §3.2).

## 3. Indicators

**Reference vocabulary:** `src/data/indicators/reversal.json` (594 entries) lists every reversal indicator published setters used at least twice. It is mined from both Across and Down clues, so it **includes** the direction-bound words of §3.2 ("up", "rising", "going west"…). Being on the list does not make a direction-bound indicator fair in a Cruci clue.

### 3.1 Allowed: direction-free

From Crossword Unclued's "generic" list and Sutherland's general list:

| Family | Examples |
|---|---|
| Back | back, backed, backing, backward(s), back-to-front, sent back, coming back, comes back, going back, looking back, brought back, taken back, set back |
| Return | return, returns, returned, returning, retiring, retreat, retreating, retrograde, retrospective, in retrospect |
| Turn | turn, turns, turned, turning, turned over, turnaround, flipped, flipping, flipped over, knocked over, rolled over, rolls over, revolutionary, brought about, going round |
| Reverse | reversed, reversing, in reverse, reflected, in the mirror, going the wrong way, counter, the other way round |

**Allowed with care:** about, around, round, over. They are also container indicators, and
"about" is C/CA/RE, "over" is O (`_abbreviations.md`). Use only when the enumeration and the
definition leave one parse.

### 3.2 Forbidden: direction-bound (R-INDICATOR-DIR)

**Down-only** (vertical imagery). Machine-checked by `clue-rules.ts` (`DOWN_ONLY`): any
indicator containing the word *up, upward, upwards, rising, rises, risen, rose, raised, lifted,
climbing, climbs, mounting, ascending, skyward, northward*. That regex also catches phrases
built on "up": *brought up, cast up, coming up, comes up, going up, hauled up, held up, looking
up, sent up, shown up, turns up, turned up, written up*.

Also forbidden, **check by hand** (not yet in the regex): *upset, uprising, upturned, upended,
upside down, upwardly mobile, mounted, raising, elevated, elevating, overturned, from the
bottom, from the south, going north, northbound, skywards, heavenward*.

**Across-only** (horizontal imagery). Forbidden for the same reason; **check by hand**: *going
west, westbound, westward, to the left, leftward(s), from the east, from the right, receding,
left* ("left" is also L).

Sources: Crossword Unclued lists the Across-only, Down-only and generic sets
([Reversal indicators](https://www.crosswordunclued.com/2009/07/reversal-indicators.html));
Wikipedia gives "returned, receding, in the mirror, going the wrong way, left" for Across and
"rising, overturned, mounted, comes up" for Down
([Cryptic crossword](https://en.wikipedia.org/wiki/Cryptic_crossword)); Sutherland gives "held
up, lifted, skyward" as Down-only. Ximenes himself required Down reversals to show real
movement ("rise", not "return") ([ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/)).

**How conflicts are resolved.** The references disagree on a few words. Cruci forbids any
indicator that **names or implies a direction** (up, down, north, south, east, west, left,
right, rising, sinking, mounting, receding). "Overturned" is forbidden because Wikipedia
classes it as Down-only (an upended object), although Crossword Unclued lists it as generic.
"Knocked over", "turned over" and "flipped over" are allowed: they describe rotation, and
Sutherland and Crossword Unclued list them as general. "Going the wrong way" and "in the
mirror" are allowed: Wikipedia's Across examples include them, but they name no direction.

## 4. Surface craft

1. **Hide the indicator in an idiom.** NET's "knocked over" is a skittles phrase; DIAL's "Laid
   back" is an adjective meaning *relaxed*; EDIT's "as the tide turns" is a set phrase. The
   solver reads the idiom, not the instruction.
2. **Let the reversed word and the definition share a scene.** "What's left when ten's knocked
   over" pulls *net amount* and *ten-pin bowling* into one picture (audit 02 #34).
3. **Avoid the famous reversals.** REGAL/LAGER and STRESSED/DESSERTS are among the most
   recycled clues in cryptics (audit 02 #49, #65). The bank already uses STRESSED/DESSERTS
   three times. They fail F-CHESTNUT.
4. **No narration.** "Reviled at first, he turned it around to save the day" (DELIVER) narrates
   a plain reversal with padding.

## 5. Typical failures

| Failure | Bank example | Rule |
|---|---|---|
| Down-only indicator in a direction-free clue | TIP "Pointer **rising** from the pit" (`reversal-tip`); REWARD "Carpenter's drawer **turned up** a prize" (`reversal-reward`) | **R-INDICATOR-DIR** |
| Across-only indicator | — | **R-INDICATOR-DIR** (by hand) |
| Chestnut pair | REGAL "Beer sent back…"; STRESSED "Tense when puddings are sent back"; DESSERTS "Stressed, we turned to sweets" | **F-CHESTNUT**; **B-REPEAT** (batch flag); judgement (the machinery passes them) |
| Padding | DELIVER "Reviled **at first, he** turned **it** around **to save the day**" ("at first" also looks like a first-letter indicator) | **F-IDLE** |
| Definition comma-tacked on the end | REGAL "…, befitting a queen" | `01-qualities.md` (surface) |
| Reversed word clued by a synonym without a `synonym` op | SPAR (fodder "raps", surface "criticism", no op) | **F-DEF-EVIDENCE** (no evidence possible); contract §2 |
| Dated answer word | GATEMAN | `01-qualities.md` (definition precision) |

## 6. Exemplars from our bank and corpus

**Best**
- **NET** — *What's left when ten's knocked over (3)*. TEN reversed. "What's left" and
  "knocked over" belong to one picture. Audit 4/4, top tier. `reversal-net`.
- **EDIT** — *Revise as the tide turns (4)*. TIDE reversed; "the tide turns" is an idiom. `reversal-edit`.
- **DIAL** (teaching corpus) — *Laid back to make a call (4)*. LAID reversed; "laid back" reads
  as *relaxed*. A model beginner clue (`docs/clue-style.md` §1c). `reversal-dial`.

**Weak**
- **TIP** — *Pointer rising from the pit (3)*. "Rising" only works in a Down clue, and Cruci
  clues have no direction. R-INDICATOR-DIR (fail example `reversal-tip`). The audit's direction: a generic indicator (*Point
  back at the pit*).

## 7. Cruci-specific notes

- **Direction is never known.** Treat every bank clue as direction-free. The same holds for
  charade order words ("on", "over"), see `charade.md` §3.
- **Share of the mix.** Reversals are 3% of the bank against 5–8% in a broadsheet. Add them,
  but not the chestnut pairs.
- **Reversals inside other devices** (a reversed piece in a charade or container) are how the
  bank gets its difficulty-4 tail; the indicator rules here apply to those pieces too.
- **Teaching register (Stage A).** A literal word whose reversal is a common word, an indicator
  hidden in an idiom (*Party comes back for a bar*, LEVER, `reversal-lever`; *Laid back to make a call*, DIAL).
  Never narrate ("Warts, sent back, spell a drinking tube" is the old fault, §1c). The teaching
  corpus already teaches STRESSED/DESSERTS; the bank must not repeat it.
- **Par.** A literal reversal is one operation (C = 0); a synonym then a reversal is two (C = 1).

## Sources

- Crossword Unclued, *Reversal indicators*: https://www.crosswordunclued.com/2009/07/reversal-indicators.html
- Crossword Unclued, *Reversals*: https://www.crosswordunclued.com/2008/11/reversals.html
- Wikipedia, *Cryptic crossword*, "Reversals": https://en.wikipedia.org/wiki/Cryptic_crossword
- D. Sutherland, *Spotting indicator words* (Dummies): https://www.dummies.com/article/home-auto-hobbies/games/puzzles/crosswords/spotting-indicator-words-when-solving-cryptic-crosswords-175680/
- Ximenes, ch. 5 "Cluemanship": https://xotaotc.nfshost.com/chapter-5-cluemanship/
- Audit 02 §2, §3.7, §3.8: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/integrity.ts` (case `reversal`), `src/data/clue-rules.ts` (`DOWN_ONLY`), `src/data/archive.ts` (entries carry `direction`)
