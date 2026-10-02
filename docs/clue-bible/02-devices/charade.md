# Charade (word sum)

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

The answer is built from two or more **pieces** clued one after another and joined end to end,
in reading order: BAN + KING = BANKING.

**Fair form:** `definition` + `piece clue` + `piece clue` (+ …), with optional order words and
link words, nothing else.

- Each piece is clued by a **true synonym** (with `evidence`), a **listed abbreviation**
  (`_abbreviations.md`), a **first-letter device** ("boy primarily" → B) or a **literal word**
  printed in the clue. A piece may itself be a small device (a reversed or shortened word) if it
  has its own correctly-typed indicator.
- Pieces join in the order they are read. If the clue reorders them, an **order word** says so
  ("A after B" = BA). Only direction-free order words are allowed (§3).
- **No containment words as glue.** "in, inside, within, into, amid, among, holding,
  swallowing, embracing, around, about, outside" tell the solver to insert, which can spell a
  different word ("Working in church" reads ON in CE = CONE, not ONCE). The surface gate rejects
  them in a charade.
- **Pieces should be disguised.** A piece printed as itself ("out" for OUT) shows the answer
  instead of hiding it (F-PRINTED, §5). That is weak disguise, not unfairness, so it is a flag
  for the tournament to weigh, never a block (spec revision 2). Never split a compound answer at
  its natural seam and print both halves.
- One definition at one end; every word has a job (F-IDLE).

## 2. JSON the validator expects

Template: **`charade-forecast`** (`../examples/charade.json`), *Front company makes a prediction
(8)*: two `synonym` ops (Front → FORE, company → CAST, each with `evidence`), then `concat`
FORE+CAST → FORECAST; `indicator` "", `fodder` "FORE + CAST".

- `indicator` = `""`, unless a piece is transformed (a reversed or shortened piece): then the
  sub-indicator, verbatim (TENOR "Net **returned** gold").
- `fodder` = the pieces joined with ` + `.
- Pieces: `synonym` (with `evidence`), `abbreviate`, `literal`, or a sub-device op (`reverse`,
  `delete`, `anagram`). The **final op is `concat`**.
- **[validator]** the `concat` pieces, in order, spell the answer; **every** piece, single
  letters included, is the output of an earlier op or a whole surface word. (Single letters used
  to get a free pass: Astra's audit showed *A dog (3)* passing as C+A+T. Closed in `6d41317`;
  fail example `charade-cat-free-letters`.)
- **Emit every printed piece as an explicit `literal` op** (`{"op":"literal","input":"ill",
  "output":"ILL"}`). Do not rely on the validator's shortcut that accepts a bare surface word as
  a `concat` piece: F-PRINTED reads the `literal`/`synonym` ops, so a piece without an op hides a
  printed piece from the flag. Hiding it is a fault in itself.
- **[surface gate]** no containment word as glue (`linkMismatchFlags`; fail example
  `charade-once-cone`).

## 3. Order words and link words

Charades need no indicator. When pieces are reordered, or when a word joins them, use only
these.

| Allowed (same meaning in any grid direction) | Forbidden in Cruci (meaning depends on Across vs Down) |
|---|---|
| **Order:** after, following, behind, before, ahead of, preceding, then, next to, beside, by, alongside (not "leading", "first", "head": those are first-letter devices, `_abbreviations.md` rule 5) | **on, upon, over, above, under, below, beneath, underneath, supporting, carrying, atop, on top of, topped by, under/over in any form** |
| **Joining:** and, with, plus, taking, takes, gets, getting, has, having, 's (has/is), joins, meets, adding, to (with care) | |
| **Wordplay → definition:** gives, makes, makes for, produces, provides, for, is, shows, brings, becomes, leads to | **in, inside, into, within, amid, among, holding, around, about, outside** (containment: surface gate) |
| **Definition → wordplay:** from, is, 's | |

**Why "on" and "over" are forbidden.** In a Down clue "A on B" means A placed on top of B (AB);
in an Across clue it means A placed after B (BA). The Times enforces exactly that split
([Crossword Unclued, "the notorious A on B"](https://www.crosswordunclued.com/2012/02/notorious-on-b-device.html)).
Wikipedia lists "above (in down clues)" among charade order words
([Cryptic crossword](https://en.wikipedia.org/wiki/Cryptic_crossword)). Cruci bank clues are
served alone in the Daily (no direction) and in either direction in Play grids
(`src/data/archive.ts`), so any order word whose meaning depends on direction is unfair to the
solver. This is a **house rule**, extending R-INDICATOR-DIR (the code checks reversal
indicators only; check charade order words by hand).

These words may still appear when they are plainly part of another phrase, such as an idiom
inside the definition ("hand **over**", "carry **on**"). If a word could be read as an order
instruction between two pieces, it is one: rewrite.

## 4. Surface craft

1. **Disguise every piece.** The audit's main charade fault: in 31 of 75 charades a piece of 3+
   letters is printed in the clue, and five print the whole answer (audit 02 §3.3). The fix is
   mechanical: clue each half by a synonym whose everyday sense fits the scene (OFF → "rotten",
   SHORE → "prop"), or change device (MILESTONE as an anagram of LIMESTONE).
2. **Choose synonyms from one subject area** (Ximenes' DAINTILY method, audit 03 §1.1–1.2). In
   BREAD *Bachelor devoured the dough*, "devoured" (READ, as in devouring a book) and "dough"
   (money) both sit in a bachelor's life; the solver reads a hungry man, not B + READ.
3. **Use the deceptive sense.** CAST is "company" (of actors), FORE is "front": FORECAST *Front
   company makes a prediction* reads as a shell company issuing a forecast. Words with two real
   meanings are where charades get their misdirection (audit 03 §1.4).
4. **Lift and separate.** The best charades fuse the definition and a piece into one phrase the
   solver has to break apart: "treasure chest" split as *treasure* (X marks the spot) + *chest*
   (the definition). Mark Goodliffe coined the term
   ([Crossword Unclued](https://www.crosswordunclued.com/2010/12/lift-and-separate.html)).
5. **No abbreviation pile-ups.** "Net returned gold" (TENOR) is three cryptic operations with
   no picture: crosswordese (audit 02 #46). At most one abbreviation per short charade.
6. **No narrated recipe.** "The cleaner had it all year, doing good works" (CHARITY) narrates
   CHAR + IT + Y with padding words (audit 02 #6).

Published example (one, attributed): *"Odin's son has a mark on map to denote treasure chest
(6)"*, THORAX (THOR + A + X), cited by Crossword Unclued as a lift-and-separate model
([link](https://www.crosswordunclued.com/2010/12/lift-and-separate.html)).

## 5. Typical failures

**F-PRINTED, as implemented in `src/data/clue-rules.ts`:** a piece of ≥ 3 letters that appears
unchanged in the answer and is printed as a whole surface word (a `synonym`/`literal` op whose
input equals its output). It is a **flag at any coverage** (spec revision 2; until then a piece
covering ≥ 75% of the answer was the rule R-PRINTED). Printing a component is weak disguise, not
unfairness: published setters do it, especially in easy clues. Writers should still treat
F-PRINTED as a rewrite reason, and the tournament weighs it. None of the clues in the first two
rows below is rejected by the machinery; they are judgement examples.

| Failure | Bank example | Rule |
|---|---|---|
| Whole or most of the answer printed | OUTLOOK "Once **out, look**…", CARTRIDGE "Push the **cart** up the **ridge**…", REPAID "**Rep** takes **aid**…", CRAVING "Caught **raving**…", OUTLINE "…**out** of **line**?", SPINE "Son will **pine**…", GHOST "Good **host**…", HILL "Husband takes **ill**…" (all F-PRINTED in code) | **F-PRINTED** (judgement) |
| Whole answer printed, but the bank ops hide it from the code | STARLET "The **star let**…", OVERNIGHT "Play **over, night** fell…", CHAMPION "Support the **champ** taking one **on**" (only F-PRINTED today), OFFSHORE "Gone **off** near the **shore**" (not caught: no `literal` ops) | **F-PRINTED** by hand; this is why every printed piece must be a `literal` op (§2) |
| One piece printed | NEWSPAPER "…on **paper**…", PADDOCK "…by the **dock**…", HEADWAY "Lead the **way**", CHARM "Church **arm**", STARTLED "…to be **led**…", MARGIN "Spoil **gin**…" | **F-PRINTED** (rewrite) |
| Surface identical to a published clue for the same answer | OPAL "Old friend is a gem" (matches a published Guardian clue) | **R-COPY** (`scripts/clue-flags.mjs`) |
| Containment word as glue | ONCE "Working **in** church, formerly" (reads ON in CE = CONE; fail example `charade-once-cone`); MUSHROOM "Sentimental mush **fills** the room" ("fills" signals insertion but is not on the gate's word list, so only F-IDLE flags it) | surface gate; house |
| Words with no job | CHARITY "**had** … **all** … **doing**"; OVERNIGHT "**fell, so we stayed**"; HARM "**A** hard limb **can do** damage" (the A is unaccounted) | **F-IDLE** |
| Wrong definition | STEAM "a head of pressure"; WARFARE "endless conflict"; WORKSHEET "the mainsail" (a sheet is a rope) | **F-DEF-EVIDENCE** |
| Both pieces just restate the definition | MILESTONE "Distance marker shows a significant point" | F-DEF-EVIDENCE (no wordplay) |
| Weak or non-standard abbreviation | MONARCH "man" → M | `_abbreviations.md` §3 (house) |
| Direction-dependent order word | "A on B", "A over B" | house rule (§3), R-INDICATOR-DIR family |
| Present-tense "the Queen" = ER | TENDER "Mind the Queen", TROOPER | house (`_abbreviations.md` §3) |
| Same split repeated across the bank (STAR-, OVER-, NIGHT-) | STARLET, STARGAZER, STARTLED; OVERBOARD, OVERHEAD, OVERNIGHT | **F-TEMPLATE**; **B-REPEAT** (batch flag) |

## 6. Exemplars from our bank

**Best**
- **FORECAST** — *Front company makes a prediction (8)*. FORE + CAST. Both pieces use their
  less obvious sense; the surface is a business headline. Audit 4/4. `charade-forecast`.
- **BREAD** — *Bachelor devoured the dough (5)*. B + READ. "Devoured" for READ and "dough" for
  money both mislead. Audit 4/4. `charade-bread`.
- **DEVIL** — *Old Nick's daughter is wicked (5)*. D + EVIL, defined by "Old Nick". A clean
  picture. Audit 4/3. `charade-devil`.

**Weak**
- **OUTLOOK** — *Once out, look at what lies ahead (7)*. OUT and LOOK are printed side by side,
  so the answer is on display; "Once" is padding. **Judgement example:** it passes the machinery
  (F-PRINTED and F-IDLE are flags), so it has no executable example; the tournament is what sinks
  it. The audit's direction: disguise both halves (*Dismissed, watch the view*: OUT as in
  cricket, LOOK = watch).
- **CAT** — *A dog (3)*, declared as C + A + T. A synthetic regression from Astra's audit: C and T
  come from nowhere. Fail example `charade-cat-free-letters`.

## 7. Cruci-specific notes

- **Share of the mix.** Charades are 18% of the bank against 25–35% in a broadsheet. Charades
  are the backbone of graduate-level puzzles, and models under-produce them (Sadallah et al.,
  COLING 2025). New batches should raise the share.
- **Compound answers** (OVER-, OUT-, OFF-, STAR-, NIGHT-, -HEAD, -PAPER): never split at the
  morpheme seam with both halves printed. Disguise both halves, or use another device.
- **Charade plus abbreviation** is the route to difficulty 4 (audit 02 §3.9): one disguised
  synonym piece plus one listed abbreviation, both from the scene.
- **Teaching register (Stage A).** Two pieces, both everyday synonyms, no abbreviation or one
  of the most familiar ones, and neither piece printed: *Follow Mother's teaching* (DOG + MA,
  `charade-dogma`), *Pub profit is a steal* (BAR + GAIN, `charade-bargain`). The audit found CARTON and PIRATE (containers) breaking
  the "parts disguised" rule; the same rule applies to charades.
- **Par.** Two or more real operations, or any abbreviation, sets C = 1.

## Sources

- Wikipedia, *Cryptic crossword*, "Charade": https://en.wikipedia.org/wiki/Cryptic_crossword
- Crossword Unclued, *Charades*: https://www.crosswordunclued.com/2008/11/charades.html
- Crossword Unclued, *The notorious "A on B" device*: https://www.crosswordunclued.com/2012/02/notorious-on-b-device.html
- Crossword Unclued, *Lift and separate*: https://www.crosswordunclued.com/2010/12/lift-and-separate.html
- D. Hardcastle, PhD thesis (Ximenes' DAINTILY method; thematic association): https://dwhardcastle.wordpress.com/wp-content/uploads/2016/02/hardcastle-phd.pdf
- Sadallah et al., COLING 2025: https://arxiv.org/abs/2412.09012
- Audit 02 §2, §2b, §3.3, §3.9; audit 03 §1: `docs/audit/2026-10-02/`
- Code: `src/data/integrity.ts` (§5c `concat`), `src/data/surface-rules.ts` (`linkMismatchFlags`), `src/data/clue-rules.ts` (F-PRINTED)
