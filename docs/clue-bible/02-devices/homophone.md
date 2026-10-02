# Homophone

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

The answer **sounds like** another word (the *sound-alike*), which the clue defines: MEDAL
("an Olympic prize") sounds like MEDDLE ("interfere").

**Fair form:** `definition of the answer` + `clue for the sound-alike` + `homophone indicator`
(indicator adjacent to the sound-alike's clue), with optional link words, nothing else.

- **The two words must sound the same** in standard Southern British English (RP). Crossword
  Unclued's warning: *cuff* and *cough* do not. Pairs that rely on non-rhotic British speech
  (SAUCE/SOURCE, CAUGHT/COURT) are standard in British puzzles and allowed. Pairs that need a
  regional or American accent are not. This is checked by the semantic auditor (harness cannot).
- **The indicator sits next to the sound-alike side.** A homophone clue has two definitions and
  one indicator, and the indicator tells the solver which one is heard. Crossword Unclued's
  example, "Expressed regret orally for having been impolite", gives RUED or RUDE and is
  settled only by crossing letters
  ([Tune in to homophones](https://www.crosswordunclued.com/2008/10/homophones.html)).
  **Cruci clues have no crossing letters** in the Daily, so the clue alone must settle it:
  put the indicator directly beside the sound-alike's clue, at the opposite end from the
  definition. The exam's uniqueness check names the competing answer (RUDE for RUED) and tests
  it against both the definition and the wordplay; it must fail one of them (COLD-SOLVE,
  spec revision 2).
- The sound-alike may be printed (HYMN "from **him**, reportedly") or clued by a synonym
  ("Olympic prize" → MEDAL).
- One definition at one end; every word has a job (F-IDLE).

## 2. JSON the validator expects

Template: **`homophone-meddle`** (`../examples/homophone.json`), *Interfere with an Olympic prize,
by the sound of it (6)*: `synonym` Olympic prize → MEDAL, then `homophone` MEDAL → MEDDLE;
`indicator` "by the sound of it", `fodder` "medal", `def.evidence` on "Interfere". (The shipped
bank entry has no `synonym` op; new entries add it, with `evidence`.)

- `fodder` = the sound-alike word (the hint says *the answer sounds like "medal"*).
- Add a `synonym` op (with `evidence`) when the sound-alike is not printed. The final op is
  `homophone`.
- **[validator]** checks only that the final op outputs the answer. The sound match, the
  synonym and the indicator side are **your** responsibility and the auditor's.

## 3. Indicators

**Reference vocabulary:** `src/data/indicators/homophone.json` (270 entries, published usage ≥ 2). Not checked by code yet; prefer listed indicators.

| Family | Examples |
|---|---|
| Hearing | we hear, I hear, heard, overheard, to the ear, for the audience, audibly, in the auditorium, auditioned |
| Speaking | reportedly, it's said, it is said, they say, so they say, we're told, I'm told, said, spoken, voiced, vocal, vocally, orally, aloud, out loud, in speech, in conversation, declared, outspoken |
| Sound | by the sound of it, sounds like, sounds, sound, sounding |
| Broadcast | on the radio, on the air, on air, broadcast |

Sources: Wikipedia (*we hear, reportedly, they say, by the sound of it, auditioned,
broadcast*); Crossword Unclued (*we hear, by the sound of it, orally, reportedly, it is said, on
the radio*); Sutherland (*on the air, broadcast, I hear, said, declared, audibly, outspoken,
reportedly, sounds like, vocal*).

**House guidance (Cruci).** Judgement calls unless marked *direction* or *validator*; the owner's fairness rule is that Cruci never rejects what professional setters do, so these exist only where Cruci's standalone, direction-free clues make a published usage ambiguous.

| Indicator | Ruling | Why |
|---|---|---|
| say (bare) | **Avoid** (published setters use it, so the machine accepts it) | "Say" also flags a definition by example (`_json-contract.md` §4); the solver cannot tell which job it does. Use "they say", "so to speak", "we hear". |
| broadcast | Allowed with care | Also an anagram indicator (LISTEN "Heed the silent broadcast"). |
| sound, sounds | Allowed with care | Also mean *healthy* or *a strait*; the grammar must make the hearing sense the only one. |
| any indicator in the middle of the clue, equally close to both definitions | **Not allowed** when both readings give a word of the right length | The RUED/RUDE ambiguity, with no crossers to resolve it; the cold solve must return one answer. |
| ", we hear," / ", reportedly," as a parenthesis the sentence does not need | Avoid | The blind realism judges fail "filler interjections where no writer would put them" (`.claude/skills/clue-writer/SKILL.md`). Make the indicator part of the sentence ("Curb the king's rule, reportedly" is fine; "We hear a dark period awaits…" is not). |

## 4. Surface craft

1. **Weave the indicator into the sentence.** "By the sound of it" and "reportedly" read
   naturally at the end of a statement; mid-sentence asides read as crossword-ese.
2. **Clue the sound-alike obliquely.** "Olympic prize" for MEDAL, "the king's rule" for REIGN,
   "Rob" for STEAL. The sound-alike's clue carries the surface; the answer's definition hides
   at the other end.
3. **Use the larger sound-alike.** The Guardian's BEGUILES clue (below) hears "big isles" in a
   long word, which is far more satisfying than a one-syllable pair.
4. **Avoid the stock pairs** (NIGHT/KNIGHT, PIECE/PEACE, SCENT/SENT, FLOUR/FLOWER): they are
   the teaching corpus's job. In the bank, look for less-used pairs.

Published example (one, attributed): *"We're told more than one large landmass causes
fascination (8)"*, BEGUILES ("big isles"), Guardian Quick Cryptic 103
([Fifteensquared](https://fifteensquared.net/2026/03/21/guardian-quick-cryptic-103-by-ludwig/)),
a commenters' favourite.

## 5. Typical failures

| Failure | Example | Rule |
|---|---|---|
| Clue splits into two half-clues; a word does nothing | WHERE "**You** wear it, we hear — but in what place?" | **F-IDLE**; surface (`01-qualities.md`) |
| Padding verb | KNIGHT (teaching) "We hear a dark period **awaits** the chess piece" | **F-IDLE** |
| Indicator equally near both ends (which side is heard?) | "Expressed regret orally for having been impolite" (RUED/RUDE) | exam COLD-SOLVE (named competing answer); house (§3) |
| The pair does not sound alike in RP | *cuff/cough* | semantic auditor (soundness) |
| Sound-alike clued by a synonym with no `synonym` op / evidence | PLEASE "Suit appeals…" (fodder "pleas", no op) | **F-DEF-EVIDENCE** |
| "Say" used as the indicator | — | house (§3) |
| Stock pair reused from the teaching corpus | KNIGHT, SCENT, PEACE, FLOWER, BERRY in the bank | **F-CHESTNUT** |

## 6. Exemplars from our bank

**Best**
- **MEDDLE** — *Interfere with an Olympic prize, by the sound of it (6)*. MEDAL sounds like
  MEDDLE. A natural sentence; the indicator closes it. Audit 4/3. `homophone-meddle`.
- **STEEL** — *Rob, they say, shows nerve (5)*. STEAL sounds like STEEL; "Rob" reads as a name
  (the capitalisation trick), and "nerve" is an oblique definition. `homophone-steel`.
- **REIN** — *Curb the king's rule, reportedly (4)*. REIGN sounds like REIN; the political
  surface holds together. `homophone-rein`.

**Weak**
- **WHERE** — *You wear it, we hear — but in what place? (5)*. Two half-clues glued by a dash,
  "You" does nothing (F-IDLE), and the surface is not a sentence anyone would say. The audit's
  direction: change device (*Wife present? In what place?*, W + HERE). **Judgement example:**
  every fault is a flag or a judge's call, so the machinery passes it.

## 7. Cruci-specific notes

- **Under-supplied.** Homophones are 2% of the bank (9 clues) against 11% in the Guardian
  Quick Cryptics the audit fetched (audit 02 §3.1). They suit learners. Add them.
- **No crossers.** The Daily shows one clue alone, so a homophone must be unambiguous without
  checking letters. This is the device most exposed to that; any named competing answer must
  fail the definition or the wordplay.
- **British English.** Cruci is a British puzzle. Use RP; never rely on an American merger
  (MARY/MARRY/MERRY) or a regional one.
- **Teaching register (Stage A).** A common pair, the plainest indicators (*we hear*,
  *reportedly*), the indicator at the end or the start, never mid-sentence padding: *Perfume
  sent over, we hear* (SCENT, `homophone-scent`).
- **Par.** A printed sound-alike is one operation (C = 0); a synonym then a homophone is two
  (C = 1).

## Sources

- Crossword Unclued, *Tune in to homophones*: https://www.crosswordunclued.com/2008/10/homophones.html
- Wikipedia, *Cryptic crossword*, "Homophones and homographs": https://en.wikipedia.org/wiki/Cryptic_crossword
- D. Sutherland, *Spotting indicator words* (Dummies): https://www.dummies.com/article/home-auto-hobbies/games/puzzles/crosswords/spotting-indicator-words-when-solving-cryptic-crosswords-175680/
- Guardian Quick Cryptic 103 (Fifteensquared): https://fifteensquared.net/2026/03/21/guardian-quick-cryptic-103-by-ludwig/
- Audit 02 §2, §3.1, §5: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/integrity.ts` (no homophone letter check), `.claude/skills/clue-writer/SKILL.md` (judge brief on filler interjections)
