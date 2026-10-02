# Hidden word (telescopic)

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

The answer is printed in the clue as an **unbroken run of letters** inside one or more
consecutive words (the *carrier*). An indicator tells the solver to look inside.

**Fair form:** `definition` + `hidden indicator` + `carrier` (in either order), nothing else.

- The answer's letters are contiguous in the carrier, ignoring spaces and punctuation, read
  left to right.
- The indicator must mean *contained in / part of / concealed by*, and the cryptic sentence
  must parse: "Some [drunk needs] = joint", "[Wall etchings] hide purse".
- The definition is at one end and is a true synonym (F-DEF-EVIDENCE).
- Every word is the definition, the indicator, a carrier word or a link (F-IDLE). The carrier
  runs from the first word holding an answer letter to the last; no spare carrier words.
- The answer itself, or a plain inflection of it, must not appear as a whole word
  (R-ANSWER-IN-CLUE). Inside a longer word is the device; as a word of its own it is a
  giveaway. **The code skips this rule for hidden clues** (the answer is always in the
  carrier), so check it by hand.

**Not supported (do not write):** reversed hiddens ("…hidden in X, going back"). The validator
checks the answer forwards only. Open issue for case law.

## 2. JSON the validator expects

Template: **`hidden-knee`** (`../examples/hidden.json`), *Some drunk needs a joint (4)*:
`indicator` "Some", `fodder` "drunk needs", one op `hidden` "drun<K NEE>ds" → KNEE, with
`def.evidence` on "joint". (The shipped bank entry writes the op input as "dru<KNEE>ds", which
drops the N; the op input is not machine-checked, so write it carefully.)

- `fodder` = the carrier words exactly as printed (punctuation allowed: `"Denmark, etc."`). The
  hint ladder quotes it: *"Some" tells you the answer is hidden inside "drunk needs".*
- `operations[0].input` = the carrier with the answer upper-cased between `<` and `>`.
- **[validator]** the answer is a contiguous run of the fodder's letters, **and** the fodder is
  in the clue. The second check was missing until `6d41317`: Astra's audit showed *Pet in fog
  (3)* passing as CAT hidden in "cattle", a word the clue does not contain
  (`hidden-cat-absent-carrier`).
- The carrier is **every** word the answer's letters touch. The retired style guide gave
  *Found ermine deer hides damaged (10)* with the fodder "ermine deer", which does not contain
  UNDERMINED (`hidden-undermined-old`); the carrier is "Found ermine deer" (`hidden-undermined`).
- **[clue-rules]** R-HIDDEN-IND on `indicator` (§3.1).

## 3. Indicators

### 3.1 What the machine accepts (R-HIDDEN-IND)

An indicator passes if **any** of these holds (`validHiddenIndicator` in `src/data/clue-rules.ts`):

1. the whole phrase is in **`src/data/indicators/hidden.json`**, every hidden-word indicator that
   published broadsheet setters used (George Ho's dataset, built by
   `scripts/corpus/indicators.mjs`);
2. any word of it (other than *a, an, the, of, to, and, by, at, it*) is a single-word entry on
   that list, **with word forms treated as equivalent** ("hides" = "hide" = "hidden" = "hiding");
3. any word of it belongs to a **standard family** from the crossword references (conceal, hide,
   shelter, keep, cover, hold, house, harbour, reveal, show, contain, bury, carry, store, feature,
   include, lurk, embrace, grip, clutch, capture, secret, heart, part, some, piece, bit, sample,
   section, inside, within, among, amid, found, from, in, into).

Only an indicator in **neither** source fails. This is the owner's fairness rule: a check must
never reject what professionals do.

**History (case law CL-049).** The first version accepted only the mined list. That list covers
only blog-annotated clues, so it missed textbook indicators ("hides", "shelters", "hidden by",
"at the heart of", plural verbs such as "conceal" and "keep") and wrongly failed **12 shipped
clues** (WALLET, PANTRY, DESK, INKPOT, CHESS, OFTEN, OTTER, OWL, SMOG, FIR, EARLOBE, TERRAIN among
them). Word-form equivalence and the standard families were added in `37c2455` (ratchet
baseline 82 → 70).

### 3.2 Fails R-HIDDEN-IND

| Indicator | Why it fails | Example |
|---|---|---|
| **past**, gliding past, beyond, near, beside, next to | Not published as hidden indicators and in no standard family; they mean *going by*, not *inside*. | COB "Swan gliding **past** disco bar" (`hidden-cob`; audit 02 #8) |
| none at all | Nothing tells the solver to look inside. | NEST "The keenest birds build a home" (`hidden-nest`) |

These are the only two R-HIDDEN-IND failures in the shipped bank (2026-10-02). If a fresh,
clearly fair indicator still fails, do not argue with the code: use a listed one, or record a
`waivers` entry with a written reason (`_json-contract.md` §6a).

### 3.3 House guidance within the list (judgement, not a rule)

The list was mined automatically, so it also contains noise ("l", "th", "of", "with", "has",
"gives", "trousers") and words whose hidden sense is narrow. Passing the list is necessary,
not sufficient: the indicator must read as *contained in* in **your** clue's grammar.

| Prefer (clear for learners) | Check the grammar carefully |
|---|---|
| in, inside, within, some, some of, part of, partly, in part, held by, held in, hidden in, concealed by, conceals, hiding, holds, keeps, contains, harbours, houses, buried in, a bit of, piece of, sample of, lurking in | **into**, **from**, **out of** (read as movement or subtraction); **shows**, **gives**, **has**, **offers**, **with** (also ordinary link words: a solver may not see an indicator at all); **skirts**, **crossing**, **through**, **running through** (published, but the audit queried "skirts" and "crossing" in MOAT and MEADOW; make the "inside" sense unmistakable; the machine accepts them, so this is judgement); **essentially**, **at heart**, **central** (can also mean *the middle letters only*: the answer should include the carrier's middle); **about**, **around** (also container and reversal indicators) |

Tense: prefer present-tense verb indicators. "[answer] **hid in** [carrier]" fails the
placeholder test for a definition (CARAVAN "The vicar, a vandal, hid in the holiday home").

## 4. Surface craft

1. **Find a carrier people actually say.** The best hiddens sit in a phrase that is natural on
   its own ("Denmark, etc.", "West Ealing", "drunk needs"). `scripts/raw-material.mjs` lists
   carriers from real sentences. "superstar lingo" is not a phrase anyone says (STARLING, audit
   02 #64).
2. **Make the indicator do surface work.** "Conceals", "keeps", "holds", "harbours" are verbs;
   choose the one that belongs to the scene (a harbour *harbours*, a castle *houses*). Alberich asks for
   indicators with "some surface connection" to the fodder
   ([tips](https://www.alberich-crosswords.com/articles/tips-for-setters)).
3. **Disguise the device.** A hidden is the easiest device to spot, so the surface must stop
   the solver from looking for one. MARKET hides behind "A fair part of Denmark, etc.", where
   "fair" reads as *sizeable* and "part of" as geography (audit 02 #51). Ximenes praised hiddens
   where the context makes the hiding invisible
   ([ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/)).
4. **Span a word boundary when you can.** "drun|K NEE|ds" is harder to see than "acroBATics".
   Single-word carriers are legal and appear in published Quick Cryptics, but they are the
   weaker form.
5. **A question mark only if earned.** STEALING "Thieving in West Ealing?" earns it: the
   question invites a joke about the district (audit 02 #63).

Published example (one, attributed): *"Somewhat dread erstwhile bookworms (7)"*, READERS, Ludwig,
Guardian Quick Cryptic 103 ([Fifteensquared](https://fifteensquared.net/2026/03/21/guardian-quick-cryptic-103-by-ludwig/)).
Commenters picked it for its surface.

## 5. Typical failures

| Failure | Bank example | Rule |
|---|---|---|
| Indicator in neither the published list nor a standard family | COB "past" (`hidden-cob`) | **R-HIDDEN-IND** |
| No indicator at all | NEST "The keenest birds build a home" (indicator `""`; `hidden-nest`) | **R-HIDDEN-IND** |
| Carrier not in the clue, or not all of the carrier declared | "Pet in fog" = CAT in "cattle" (`hidden-cat-absent-carrier`); UNDERMINED with fodder "ermine deer" (`hidden-undermined-old`) | validator |
| A word does nothing | CHASM "**They had to** ditch a small **dinghy** in the gulf"; EAGLE "The beagle's **master** keeps a bird of prey"; CHAT "Gossip **ran** through such a tale" | **F-IDLE** |
| The definition is the answer word | EVENT (teaching) "Seven tents partly cover **the event**" | **R-ANSWER-IN-CLUE** (by hand: the code skips hidden clues) |
| The definition contains part of a compound answer | EARLOBE "…a bit of **the ear**" | R-ANSWER-IN-CLUE family (by hand: the code matches only the whole answer and its inflections) |
| Definition by example, unflagged | CAR "**Old banger** lurking in Madagascar" | **F-DEF-EVIDENCE**; add "?" or "perhaps" |
| Near-identical definition | ISLAND "**Isle** seen in this landscape" | F-DEF-EVIDENCE (definition precision) |
| Carrier is not a real phrase | STARLING "superstar lingo" | exam: NATURALNESS / TOURNAMENT-SURFACE (F-UNATTESTED was rejected as an automatic check, CL-050) |
| "Some …" opening template (15 bank clues) | GLEN, ORCHID, HERB, ASHEN… | **F-TEMPLATE**; **B-REPEAT** (batch flag) if the same indicator appears > 2 times in a batch |
| Past-tense indicator | CARAVAN "hid in" | house guidance (§3.3) |

## 6. Exemplars from our bank

**Best**
- **MARKET** — *A fair part of Denmark, etc. (6)*. Hidden in "denMARK ETc". "Etc." does real
  work and "fair" misleads. Audit surface 4, wit 5. `hidden-market`.
- **KNEE** — *Some drunk needs a joint (4)*. Hidden in "drunK NEEds". A real sentence with a
  pub scene and a pun on "joint". Audit 5/4. `hidden-knee`.
- **STEALING** — *Thieving in West Ealing? (8)*. Hidden in "weST EALING". The place is real and
  the "?" is earned. Audit 4/4. `hidden-stealing`.

**Weak**
- **COB** — *Swan gliding past disco bar (3)*. The definition is good (a cob is a male swan) but
  "past" does not tell anyone to look inside: R-HIDDEN-IND (fail example `hidden-cob`). The
  audit's proposed direction uses a listed indicator (*Swan spotted in Monaco Bay*), still to go
  through the Writer method.
- **EARLOBE** — *Wear lobelias and you cover a bit of the ear (7)*. Surreal scene and a definition
  that contains part of the answer. **Judgement example:** "cover" is a standard indicator, so
  the machinery passes it (it was one of the 12 wrongly failed, CL-049); its faults are for the
  exam.

## 7. Cruci-specific notes

- **Share of the mix.** Hiddens are 16% of the bank; a broadsheet runs one, maybe two, per
  puzzle (Ximenes: "one per puzzle, or very occasionally two"). Until the hidden share falls to
  about 8% (audit 02 §7), a batch should add **no new hiddens** except as rewrites of existing
  hidden clues; when converting a weak hidden, consider a container or deletion first.
- **Single-word carriers:** at most 1 in 4 of the hidden clues in a batch (audit 02 §3.1: 19 of
  66 hide inside one word). House guidance.
- **Indicator variety:** "in" ×17 and "some" ×16 in the bank. B-REPEAT flags a batch that uses
  the same indicator more than twice; vary the family as well as the word.
- **Teaching register (Stage A).** The hidden word is lesson 1. Use the plainest indicators
  (*in, hides, conceals, some, part of*), a common definition, and a carrier that is a natural
  phrase. The answer must still be disguised: no definition that repeats the answer (EVENT).
- **Par.** One operation, no abbreviation: C = 0. Par is usually 2–3 unless the definition is
  oblique (D) or the carrier misleads strongly (E).

## Sources

- Wikipedia, *Cryptic crossword*, "Hidden words": https://en.wikipedia.org/wiki/Cryptic_crossword
- D. Sutherland, *Spotting indicator words when solving cryptic crosswords* (Dummies):
  https://www.dummies.com/article/home-auto-hobbies/games/puzzles/crosswords/spotting-indicator-words-when-solving-cryptic-crosswords-175680/
- George Ho, cryptic crossword clue dataset (indicator table; source of `hidden.json`): https://cryptics.georgeho.org/
- Ximenes, *On the Art of the Crossword*, ch. 5 "Cluemanship": https://xotaotc.nfshost.com/chapter-5-cluemanship/
- Alberich, *Tips for setters*: https://www.alberich-crosswords.com/articles/tips-for-setters
- V. Ratnakar, placeholder test for cryptic grammar: https://viresh-ratnakar.codeberg.page/writings/2023/cryptic-grammar-04-2023.html
- Audit 02 §2, §3.1, §7: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/integrity.ts` (case `hidden`), `src/data/clue-rules.ts` (`validHiddenIndicator`, `HIDDEN_FAMILIES`), `src/data/indicators/hidden.json`
