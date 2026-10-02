# Container (insertion)

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

One piece (the *contents*) is placed **inside** another (the *container*): O in VICE = VOICE.
An indicator says which goes in which.

**Fair form:** `definition` + `piece` + `container indicator` + `piece` (either piece first, as
the indicator's grammar requires), with optional link words, nothing else.

- The contents sit **strictly inside** the container: at least one container letter on each
  side. Putting a piece at the start or end is a charade wearing a container indicator, and the
  validator rejects it.
- The indicator's grammar must say which piece is inside. "X in Y", "X enters Y", "Y holds X",
  "Y around X". Read the cryptic sentence with placeholders: "[contents] in [container] =
  [definition]" must parse (Ratnakar's placeholder test).
- Each piece is a true synonym (with `evidence`), a listed abbreviation, a first-letter device,
  a literal word, or a small sub-device with its own indicator (a reversed piece, an anagram
  piece).
- One definition at one end; every word has a job (F-IDLE).

## 2. JSON the validator expects

Template: **`container-broaden`** (`../examples/container.json`), *Widen the way through the
mountain (7)*: `synonym` way → ROAD and mountain → BEN (each with `evidence`), then `insert`
"ROAD in BEN" → BROADEN; `indicator` "through", `fodder` "ROAD in BEN".

- `indicator` = the container indicator, verbatim.
- `fodder` = the `insert` input (`"ROAD in BEN"`); hint rung 3 shows it.
- The **final op is `insert`**, with input exactly `"X in Y"` (or `into`/`inside`/`within`) or
  `"Y around X"` (or `about`/`outside`), whatever word the surface uses.
- **[validator]** there is a split point k ≥ 1 with `Y[0..k] + X + Y[k..] = answer`; both X and
  Y are outputs of earlier ops or whole surface words. Single letters get no free pass: an I
  for "one" needs its `abbreviate` op (closed in `6d41317`).
- Emit every printed piece as an explicit `literal` op, so F-PRINTED can see it.
- Multi-step containers are supported: a `reverse`, `anagram` or `abbreviate` op may produce a
  piece before the `insert` (the Times-style container, e.g. a reversed word inside another).

## 3. Indicators

**Reference vocabulary:** `src/data/indicators/container.json` (807 entries) and `insertion.json` (795) list the indicators published broadsheet setters used at least twice for the two forms of the device (container: Y around X; insertion: X in Y). The code does not check container indicators yet; prefer listed ones.

Wikipedia lists *outside, inside, over, around, about, clutching, enters*; Sutherland lists
*acquiring, keeping, possessing, devouring, hugging, amidst, occupying, getting into, set in*.

| Family | Grammar | Examples |
|---|---|---|
| **Contents first** ("X in Y") | X [ind] Y | in, inside, within, into, entering, enters, gets into, set in, held by, kept by, caught by, gripped by, swallowed by, eaten by, boxed by, framed by, amid, among, amidst, occupying, splitting, interrupting, piercing, penetrating, cutting, through, filling, fills |
| **Container first** ("Y around X") | Y [ind] X | around, about, round, outside, holding, holds, keeping, keeps, containing, contains, embracing, hugging, gripping, clutching, swallowing, devouring, eating, housing, harbouring, nursing, admitting, taking in, takes in, protecting, guarding, hides, hiding, possessing, acquiring |

**House guidance (Cruci).** Judgement calls unless marked *direction* or *validator*; the owner's fairness rule is that Cruci never rejects what professional setters do, so these exist only where Cruci's standalone, direction-free clues make a published usage ambiguous.

| Indicator | Ruling | Why |
|---|---|---|
| over, under, beneath, below, above, supporting, topping, capping | **Not allowed** (direction) | Published setters use some of these ("over" is in `container.json`), but in their Down-clue positional sense; in a direction-free Cruci clue the order they imply is undefined (`charade.md` §3). |
| breaks up, broken by, upset | Avoid | They read as anagram indicators (SECRET "The cult **breaks up** about…", audit 02 §3.1). |
| about, around, round | Allowed with care | Also reversal indicators, and "about" is C/CA/RE. Check the parse is unique with the enumeration alone. |
| in, within, inside | Allowed with care | Also hidden indicators; make sure the carrier does not accidentally hide a different answer. |
| sees, meets, with, and, takes (without "in") | **Not** container indicators | They are charade glue. MINISTER "The vicar **sees** one inside the minster": "sees" does nothing. |

## 4. Surface craft

1. **Make the containment literal in the scene.** The best containers describe something
   really holding something else: a page *keeping* a donkey (PASSAGE), a don *holding* a tabloid
   (DRAGON), a road *through* a mountain (BROADEN). The indicator is then invisible because it is
   doing surface work.
2. **Build the scene first, then fit the pieces** (Ximenes' DAINTILY method). Ximenes started
   from CHAR as a cleaning lady, asked what a char does with a tin, and arrived at a clue in
   which every word belongs to the char's world (audit 03 §1.1;
   [Hardcastle thesis, ch. 1](https://dwhardcastle.wordpress.com/wp-content/uploads/2016/02/hardcastle-phd.pdf)).
3. **Disguise the contents.** A printed inner piece (RAT in "Rat tucked into the pie", PEN in
   "keeps a pen") shows part of the answer (F-PRINTED). A printed outer piece is split by the
   insertion, so the code accepts it, but a disguised one is better: in DRAGON, "Don" reads as a
   person and only later as the letters DON.
4. **Prefer the deceptive sense for every piece.** BEN for mountain, RAND for South African cash,
   GI for soldier: each piece's surface sense belongs to the scene while its letters do the work.
5. **Verify the letters by hand before submitting** (O inside V·ICE = VOICE, not VO·O·ICE). The
   validator will catch an edge placement or a wrong piece, but a wrong split wastes a drafting
   round. The old style guide itself got this wrong (next section).

### 4a. The CHAIR ladder (same parse, three surfaces)

The mechanics of two clues can be identical; the difference is entirely surface. Every rung is
CHAR around I (one) = CHA(I)R:

| Rung | Clue | Example id |
|---|---|---|
| Weak | *Piece of furniture one in daily (5)*: crossword-ese no one would say | `container-chair-1` |
| Middling | *Burn around one piece of furniture (5)*: grammatical, but no picture | `container-chair-2` |
| Good | *Cleaning lady holds one position of authority (5)*: a real, picturable statement | `container-chair-3` |

The retired style guide taught this ladder with the parse "CHAR + A" and the top rung *Cleaning-lady
holds a position of authority*. A inside CHAR cannot make CHAIR; the insertion needs I. That
version is kept as the fail example `container-chair-old` (case law CL-045).

Published example (one, attributed): *"Char holds messy tin delicately (8)"*, DAINTILY, Ximenes,
as recounted in Macnutt (1966) and quoted in Hardcastle's thesis: DAILY (a char) holds (TIN)*.

## 5. Typical failures

| Failure | Example | Rule |
|---|---|---|
| Edge placement ("insertion" at the start or end) | — (blocked by the validator) | validator |
| The contents do not make the answer | the old style guide's CHAIR = CHAR + A (`container-chair-old`) | validator |
| Indicator that does not mean *inside* | MINISTER "sees"; any "over/under" | house (§3) |
| Indicator that reads as an anagram | SECRET "breaks up" | house (§3) |
| Inner piece printed | CARPENTER "The carter keeps a **pen**…"; PIRATE (teaching) "**Rat** tucked into the pie"; CARTON (teaching) "The con hides **art**" | **F-PRINTED** (a flag at any coverage; judgement) |
| Words with no job | MINISTER "The vicar **sees** one inside the minster"; SWEARING "Wife in searing **pain**, cursing" | **F-IDLE** |
| Definition by example, unflagged | MINISTER "**The vicar**" (a vicar is one kind of minister) | **F-DEF-EVIDENCE** |
| Charade glue implying a container in a charade | MUSHROOM "mush **fills** the room" (filed as charade) | surface gate (`charade.md`) |
| Same indicator more than twice in a batch | "keeps", "in" | **B-REPEAT** (batch flag) |

## 6. Exemplars from our bank

**Best**
- **DRAGON** — *Don holding a tabloid is a monster (6)*. RAG (tabloid) in DON (a university
  don). The scene is real; "Don" misleads. Audit 4/4. `container-dragon`.
- **PASSAGE** — *Corridor where the page keeps his donkey (7)*. ASS in PAGE. A coherent,
  slightly comic image. Audit 4/4. Note: PAGE is printed as the outer piece (allowed; see §4.3).
  `container-passage`.
- **BROADEN** — *Widen the way through the mountain (7)*. ROAD in BEN. Both pieces disguised;
  the surface is a road-building sentence. `container-broaden`.

**Weak**
- **MINISTER** — *The vicar sees one inside the minster (8)*. "Sees" has no job (F-IDLE), "The
  vicar" is an unflagged example of a minister (F-DEF-EVIDENCE), and I in MINSTER is a
  near-printed answer. Audit 02 next-tier list. **Judgement example:** every fault here is a flag,
  so the machinery passes it and it has no executable example.
- **CHAIR** — the old style guide's *Cleaning-lady holds a position of authority*, declared
  CHAR + A. Fail example `container-chair-old` (§4a).

## 7. Cruci-specific notes

- **The most under-supplied device.** Containers are 3% of the bank (13 clues) against 15–20%
  in a broadsheet, and a learner moving to the Times meets one in roughly every fifth clue
  (audit 02 §3.1). **Every new batch should include containers**; the audit's target is about
  15 per 100 new clues, and converting weak hiddens and CDs into containers in place.
- **The difficulty tail.** Container plus abbreviation, or a reversed piece inside a container,
  is the main route to difficulty 4–5 (audit 02 §3.9, §4: Times CONTINUE and CAPTURE).
- **Teaching register (Stage A).** One-letter or familiar abbreviation contents (L for learner,
  E for energy, O for nothing) inside an everyday word, with the indicator doing surface work
  (*Utter nothing when there's wickedness about*, VOICE, `container-voice`). Teaching register rule 1 says the
  parts are disguised: do not print the container and the contents both (CARTON, PIRATE).
- **Par.** Container clues have ≥ 2 real operations, so C = 1; par is usually 3–5.

## Sources

- Wikipedia, *Cryptic crossword*, "Additions": https://en.wikipedia.org/wiki/Cryptic_crossword
- D. Sutherland, *Spotting indicator words* (Dummies): https://www.dummies.com/article/home-auto-hobbies/games/puzzles/crosswords/spotting-indicator-words-when-solving-cryptic-crosswords-175680/
- D. Hardcastle, PhD thesis, ch. 1 (DAINTILY): https://dwhardcastle.wordpress.com/wp-content/uploads/2016/02/hardcastle-phd.pdf
- V. Ratnakar, placeholder test: https://viresh-ratnakar.codeberg.page/writings/2023/cryptic-grammar-04-2023.html
- D. Astle, *Fond clues* (CAPTURE, Loroso): https://davidastle.com/da-blog/fond-clues
- Audit 02 §2, §3.1, §3.9, §4, §5: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/integrity.ts` (§5c `insert`), `src/data/clue-rules.ts` (F-PRINTED)
