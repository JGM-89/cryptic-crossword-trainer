# Cryptic definition

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

The whole clue is **one definition** of the answer, written so that its natural first reading
points somewhere else. There is no wordplay: the trick is a pun or a deceptive sense. "A wicked
thing?" is not an evil object but a thing with a wick: CANDLE.

**Fair form:** a single phrase or sentence that has **two readings**:

1. a **misleading** reading: the scene a reader sees first, which does **not** lead to the
   answer;
2. a **true** reading: the same words, with at least one word taken in another real sense, that
   defines the answer accurately and uniquely.

Alberich's tests: the true reading must be an accurate definition; the surface must mislead;
only one answer may fit; and it should be fresh, not a reworked classic
([Cryptic definitions](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/crypdef.html)).

- **No false trail, no CD.** If the first reading is already the true reading (nothing is read
  in another sense), the clue is a quiz question with a "?" (F-QUIZ). Test: delete the "?".
  If what is left is a straight definition or a trivia question, it is not a cryptic
  definition.
- **One answer.** A CD has no wordplay to confirm it, so it must not fit another word of the
  same length (Alberich's "Rising alarm?" fits ACROPHOBIA and AEROPHOBIA). The exam names the
  competing answers and tests each against the true reading; each must fail it (COLD-SOLVE,
  spec revision 2). Solving a CD quickly is **not** a defect; having no false trail is.
- **The "?"** is usual, not compulsory (Wikipedia: "often (though by no means always)"). It
  signals that the definition is playful. It does not make a plain definition cryptic.
- **Not for obscure answers.** A solver with no wordplay cannot reach a rare word (Alberich's
  CLEPSYDRA case).

## 2. JSON the validator expects

Template: **`cd-tea`** (`../examples/cryptic-definition.json`), *What's a drink in London is
dinner in Leeds? (3)*: `def.text` = the whole clue without `(n)`, `position: "start"`; one
`literal` op summarising the pun; and the mandatory `pun`:
`misleading` "A riddle about a London–Leeds rivalry…", `true` "TEA means the hot drink
everywhere, and in the north of England it also means the evening meal."

- `def.text` = the **whole clue** without the `(n)`, `"?"` included; `position: "start"`.
- `indicator` = `""`. `fodder` = `""` or a one-line pun summary.
- One `literal` op whose `input` summarises the pun and whose `output` is the answer.
- **`pun` is mandatory** (R-CD-CONTRACT): both `misleading` and `true` non-empty, and they must
  describe different readings (`_json-contract.md` §6). `clue-rules.ts` fails a CD without
  them (fail example `cd-map`).
- No `def.evidence`: the `pun.true` line does that job. If the true reading relies on a
  particular dictionary sense (WICKED = having a wick), name the sense in `pun.true`.
- `parse` (hint rung 4) must state both readings: "Surface suggests X; really Y" (audit 02
  §3.10, recommendation 4).

## 3. Indicators

None. A "?" (or "!") at the end is the conventional signal that a definition is cryptic.

Because there is no indicator, the device is **direction-free** and no indicator rule applies.
Watch only for words that look like indicators of other devices and could give a second,
wordplay parse; if a second parse exists, it must lead to the same answer or the clue is
ambiguous.

## 4. Surface craft

1. **Start from the deceptive word, not the answer's definition.** The classic CD hinges on one
   word with two real senses: flower (something that flows) for a river, number (something that
   numbs) for an anaesthetic, wicked (having a wick) for a candle (audit 03 §1.4). Find that
   word first, then build the scene around its everyday sense.
2. **Paint a full misleading scene.** BRAINWASH's "Bust down reason?" first reads as a pub or
   police scene (audit 02 §4). TEA's London/Leeds clue reads as a class joke. The false scene
   must be complete enough that the solver believes it.
3. **Use the idiom flip.** DENIER *One who won't take yes for an answer?* inverts a set phrase;
   the solver hears the idiom, not the definition.
4. **Avoid the canon.** THAMES "Flower of London?", CARPET "Pile on the floor?", ANAESTHETIC
   "Number…?" are classics every regular solver knows (F-CHESTNUT). Keep them in the teaching
   corpus, where the canon belongs.
5. **No "What…?" / "It…?" factory.** Ten bank CDs open "What…?" and ten open "It…?" (audit 02
   §3.4). Vary the form (F-TEMPLATE).

Published example (one, attributed): *"One step up from the gutter (9)"*, KERBSTONE, given by
Alberich as a model CD: the surface suggests climbing out of poverty, the true reading is a
literal kerb
([Alberich](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/crypdef.html)).

## 5. Typical failures

| Failure | Bank example | Rule |
|---|---|---|
| Plain definition plus "?" (no false trail) | MAP "It shows you where to get off?"; ARC "The path of everything you throw?"; SAND "What runs out in an hourglass?"; ENTERTAINMENT "What keeps an audience coming back for more?" | **F-QUIZ** |
| Trivia, not a pun | MAPLE "Tree whose leaf Canada flies?"; OAK "Royal tree on a thousand pub signs?" | **F-QUIZ** |
| A stereotype description | GRANDMOTHERLY "Inclined to spoil you rotten between rounds of knitting?" | **F-QUIZ** |
| No `pun` (or `misleading` = `true`) | every CD in the bank today (the field is new); MAP as shipped (`cd-map`) | **R-CD-CONTRACT** |
| The pun fits a different answer better | CALENDAR (teaching) "Where you're bound to find a date?" ("bound" fits DIARY, a bound book) | exam COLD-SOLVE (named competing answer); pun.true check |
| More than one answer fits | "Rising alarm?" (ACROPHOBIA / AEROPHOBIA) | exam COLD-SOLVE (named competing answer) |
| Chestnut | THAMES, CARPET, ANAESTHETIC, VILE-style classics | **F-CHESTNUT** |
| Opening template | "What…?" ×10, "It…?" ×10 | **F-TEMPLATE**; **B-REPEAT** (batch flag) |
| American context | IVY "Green climber clinging to college walls?" (Ivy League) | **F-AMERICANISM** |
| Too many CDs in a batch | part j: 33 of 49 clues are 3–5-letter CDs | **B-DEVICE-MIX** (batch flag) |

## 6. Exemplars from our bank

**Best**
- **TEA** — *What's a drink in London is dinner in Leeds? (3)*. British class and regional joke;
  the true reading is exact. Audit 5/4, top tier. `cd-tea`.
- **DENIER** — *One who won't take yes for an answer? (6)*. The idiom flip misleads; the true
  reading defines a denier. Audit 4/4, top tier. `cd-denier`.
- **CANDLE** (teaching) — *A wicked thing? (6)*. One deceptive word ("wicked" = having a wick)
  carries the whole clue. `cd-candle`.

**Weak**
- **MAP** — *It shows you where to get off? (3)*. Delete the "?" and it is a plain (and loose)
  description of a map; there is no second reading. F-QUIZ; and, as shipped, R-CD-CONTRACT (no
  `pun`), which is what the fail example `cd-map` checks. The contract is the mechanical part;
  the real fault is judgement: no honest `misleading` reading exists. The audit's direction:
  change device (a double definition, *Plan an atlas page*).

Also executable: `cd-cod` (*Often battered, sometimes mocked?*, the penny-drop exemplar in
`01-qualities.md` §7).

## 7. Cruci-specific notes

- **Capped (a target, flagged).** CD + DD at most **25% of a batch** (B-DEVICE-MIX, a batch flag
  under spec revision 2; see `double-definition.md` §7). CDs are 12.5% of the
  bank against 0–7% in a broadsheet; the audit's target is about 6%. Add new CDs only as
  rewrites of existing CDs or where the answer suits nothing else (long -LY adverbs, abstract
  nouns: `.claude/skills/clue-writer/SKILL.md` step 2).
- **Short answers.** A 3–5-letter CD is almost always a riddle. For short answers prefer a
  hidden, a charade or a reversal.
- **Write `pun.misleading` before the clue.** If you cannot describe a false scene in one
  sentence, you do not have a CD.
- **The exam targets CDs.** F-QUIZ is raised when the clue has no false trail: the judges'
  paraphrase of the literal scene already *is* the true reading, or no `pun.misleading` distinct
  from `pun.true` can be written. A solver getting the answer quickly is not evidence either
  way (spec revision 2; `04-exam.md`).
- **Teaching register (Stage A).** One deceptive word, a well-known answer, a "?": CANDLE,
  THAMES, ANAESTHETIC are the canon and belong in teaching, not the bank. The hint ladder says
  "Re-read it looking for the pun" (`src/data/hydrate.ts`), so the pun must be findable.
- **Par.** A cryptic definition sets C = 1 (layered), and D is usually 1.

## Sources

- Alberich, *Cryptic definitions*: https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/crypdef.html
- Wikipedia, *Cryptic crossword*, "Cryptic definition": https://en.wikipedia.org/wiki/Cryptic_crossword
- D. Astle, *Fond clues* (BRAINWASH): https://davidastle.com/da-blog/fond-clues
- Audit 02 §2, §3.4, §3.7, §4, §5: `docs/audit/2026-10-02/02-clue-sample.md`; audit 03 §1.4
- Code: `src/data/clue-rules.ts` (R-CD-CONTRACT, `batchHits`), `src/data/hydrate.ts` (CD hint text)
