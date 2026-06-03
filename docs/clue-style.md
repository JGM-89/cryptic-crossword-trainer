# Cruci Clue Style Guide

The single source of truth for writing and grading cryptic clues in this project.
Every clue-writing or grading agent is handed this document. A clue is only good if it is
**both** mechanically fair **and** a pleasure to read and solve. Mechanics are the price of
entry; surface craft is what makes a clue worth shipping.

> **The two laws**
> 1. **Afrit's injunction (fairness):** *"You need not mean what you say, but you must say what
>    you mean."* The **surface** may deceive freely; the **cryptic reading** must lead to the
>    answer precisely and unambiguously, with no word doing illegitimate double duty.
> 2. **Ximenean soundness:** a clue = **one precise definition** + **fair wordplay that
>    independently yields the answer** + **nothing else**. Default to the strict (Ximenean) end
>    of the spectrum.

---

## 1. The quality bar — the 5-axis grading rubric

Grade every candidate on these five axes. **Axis 1 is a hard pass/fail gate; a clue that fails
it scores zero regardless of the rest.** Axes 2–5 are 1–5.

1. **Soundness / fairness (PASS/FAIL).** Read the clue exactly as the wordplay demands. The
   cryptic grammar congeals; the definition is a true synonym at one end; every letter is
   accounted for; indicators are present and the right type; no indirect anagram; abbreviations
   are standard and direct; def-by-example is flagged with `?`/`perhaps`. Must also pass the
   mechanical harness (`scripts/validate-clue.ts`).
2. **Definition (1–5).** Precise but not the dictionary's first, obvious synonym. Oblique,
   disguised definitions score higher.
3. **Surface (1–5).** Reads as natural, picturable English — a real phrase or sentence that
   could occur in conversation or writing — and actively *misdirects* away from the parse.
4. **Economy (1–5).** Every word earns its keep in the cryptic reading. **No filler** added only
   to prop up the surface. (Length is fine if it "tells a story" with no idle words.)
5. **Wit / originality (1–5).** A fair penny-drop ("aha"); fresh route; avoids the most obvious
   arrangement and never "screams the answer."

**Composite & threshold.** Keep the candidate with the highest (surface + economy + wit + def)
among those that PASS axis 1. A shippable clue needs **fairness = PASS, surface ≥ 4, and
(surface + wit) ≥ 7**. If no candidate clears the bar, write more.

> Maxims to hang above the desk — Azed: *"Clues should be written to be solved, not to
> demonstrate what a fiendishly tortuous mind the writer has."* Alberich: *cryptic grammar comes
> first, but a smooth, image-bearing surface is what separates a good setter from an average one.*

---

## 2. Hard fairness rules (the gate)

1. **One definition, at the start OR end** of the clue (never buried mid-clue) — except
   cryptic-definition and &lit, where the whole clue defines. It must be a **genuine synonym**
   matching the answer's part of speech.
2. **Definition by example must be flagged** with `?`, `perhaps`, `maybe`, `say`, or
   `for example`. ("Rover … ?" for CARPET, since Rover is a *type* of carpet.)
3. **Wordplay accounts for every letter** — no leftovers, nothing unindicated.
4. **No indirect anagram.** Anagram fodder must be present **literally** (plain words or *direct*
   abbreviations). Never make the solver find a synonym *then* anagram it.
   *Bad:* "Crooked merchant…"→REALISED (merchant=dealer first). *Good:* "Crooked dealer…".
5. **No indirect / unindicated abbreviations.** Every letter from an abbreviation must use a
   **recognised, direct** cue (see §4) — no synonym-of-a-synonym chains.
6. **Every transformational device needs a correctly-typed indicator** adjacent to its fodder
   (anagram→anagram indicator, reversal→reversal indicator, etc.). Charades, double-definitions,
   and standard abbreviations need no indicator.
7. **Cryptic grammar / link words read correctly** in the cryptic sense. Equation `is`;
   wordplay→def `gives/makes/produces/for`; def→wordplay `from`. Avoid `to` (reads as infinitive)
   and redundant joiners present only for surface. No word may serve two cryptic roles at once.
8. **The surface may lie; the parse may not.** Misdirection lives entirely in the surface
   reading.

---

## 3. Surface craft — how to make it elegant

The mechanics of two clues can be identical; the difference is entirely surface. The CHAIR
ladder (same parse `CHAR + A`, defined "position of authority"):

- ✗ `Piece of furniture one in daily (5)` — nonsensical crossword-ese.
- ~ `Burn around one piece of furniture (5)` — grammatical but no image.
- ✓ `Cleaning-lady holds a position of authority (5)` — a real, picturable statement.

**Tests to apply to every surface:**
- **Image test** — does it conjure a picture or a plausible statement (a mini-narrative)?
- **Conversation test** — could this sentence appear *outside* a crossword? If it only exists in
  crossword-land ("Doctor and the Queen hold four for motorist!"), it's crosswordy — rewrite.
- **Economy test** — can you delete a word without breaking the *cryptic* reading? If a word is
  there only for the surface, it's a fault. (No padding adverbs like "…wildly…", no random
  proper nouns dragged in to fix anagram fodder.)
- **Taste test** — avoid grim or off imagery even when technically clean.

**Fair misdirection toolkit:** disguise the definition (use an oblique synonym); mislead the
part of speech (a noun looking like a verb); the capitalisation trick (a sentence-initial capital
hides a proper noun, or a mid-clue capital fakes one); make a word's *surface* job differ from
its *cryptic* job (an apparent anagram indicator that's really the definition). The best surfaces
*fight* the solver's attempt to parse.

**Avoid (the dull/forced tail we are fixing):** filler words for the surface; gibberish
surfaces; mechanical abbreviation charades ("Graduate engineer's bald"→BARE); formulaic
repetition (a whole run of "beheaded X" deletions); obscure/archaic synonyms; clues that scream
the answer; over-clever multi-device pile-ups.

---

## 4. Abbreviations — the only ones allowed

A letter/fragment from an abbreviation is fair **only** if the cue→letters mapping appears in
**`src/data/abbreviations.ts`** (the `ABBR` table), or it is an explicit **first-letter device**
("boy primarily"→B, "leading economist"→E). The mechanical harness enforces this and also
requires the **cue word to appear in the surface**. Common, safe cues (see the file for the full
list): N/S/E/W (compass), R (run/right/river/king), L (learner/left/50/lake/line), O
(nothing/love/ring), I (one), C (cold/caught/circa/100/conservative), P (quiet/piano),
F (loud/forte), B (bachelor/black/bishop/born/British), D (daughter/500), CO (company),
ST (saint/street), CH/CE (church), OR/AU (gold), E (energy), K (king), one→I/A, the French→LE/LA,
etc. **If a cue you want isn't in `ABBR`, don't use it — pick a different construction.** (If a
genuinely standard abbreviation is missing from `ABBR`, flag it for a human to add; do not invent.)

---

## 5. Devices — fairness, indicators, craft, and the JSON contract

For each device: when it's fair, legitimate indicators, a craft tip, an exemplar, and the **exact
`operations` template** to emit. `clueType` is one of:
`anagram · charade · container · hidden · reversal · deletion · homophone · double-definition ·
cryptic-definition · initialism · alternation · lit`.

> **Mechanical-check coverage:** the harness letter-checks **anagram, hidden, reversal, deletion,
> initialism** (and all `abbreviate` ops, any device). For **charade, container, homophone,
> double-definition, cryptic-definition, alternation, lit** it only checks that the final op
> outputs the answer — so YOU must verify those letter/sound/sense mechanics yourself, and the
> grader's adversarial re-derivation is the backstop.

### anagram
Fodder given literally, anagram indicator adjacent, letters == answer. Indicators: *broken,
shredded, cooked, drunk, confused, upset, rearranged, out of sorts, wild, oddly-made, designed.*
Craft: fodder that itself reads naturally; aim for the anagram-&lit (`Terribly angered?`→ENRAGED).
Exemplar: `Chaperone shredded corset (6)` → ESCORT.
`"operations":[{"op":"anagram","input":"CORSET","output":"ESCORT"}]`, `fodder:"corset"`,
`indicator:"shredded"`.

### charade (word-sum, no indicator needed)
Pieces clued separately and joined in reading order; position words (*after, on, with, over* in
downs) where needed. Craft: choose pieces whose surface words cohere into a real phrase — never a
bare abbreviation pile-up. Exemplar: `Outlaw leader managing money (7)` → BAN+KING = BANKING.
`"operations":[{"op":"synonym","input":"Outlaw","output":"BAN"},{"op":"synonym","input":"leader","output":"KING"},{"op":"concat","input":"BAN+KING","output":"BANKING"}]`.
(Pieces are `synonym` or `abbreviate` ops; the final `concat` outputs the answer.)

### container / insertion
Clear container/contents indicator. Indicators: *in, inside, within, holding, swallowing,
about, around, outside, embracing, penned by.* Exemplar: `Utter nothing when there's wickedness
about (5)` → O in VICE = VOICE.
`"operations":[{"op":"abbreviate","input":"nothing","output":"O"},{"op":"synonym","input":"wickedness","output":"VICE"},{"op":"insert","input":"O in VICE","output":"VOICE"}]`,
`fodder:"O in VICE"`, `indicator:"about"`. **Verify the insertion really spells the answer**
(O inside V·ICE = VOICE ✓ — not VO·O·ICE). The final op is `insert`.

### hidden (telescopic)
Answer is an unbroken run spanning word boundaries, with a containment indicator. Indicators:
*in, within, some, part of, hides, conceals, held by, buried in.* Craft: conceal it inside a
thematic phrase (a hidden-&lit). Exemplar: `Found ermine deer hides damaged (10)` → UNDERMINED.
`"operations":[{"op":"hidden","input":"fo<UND ERMINE D>eer","output":"UNDERMINED"}]` — write the
`input` as the carrier with the answer's letters upper-cased; `fodder:"ermine deer"` (the carrier
words as they appear); `indicator:"hides"`. Harness checks the answer is contiguous in the fodder.

### reversal
Reversal indicator present; in downs *rising/up*, across *back/returned/west*. Exemplar:
`Returned beer fit for a king (5)` → LAGER reversed = REGAL.
`"operations":[{"op":"reverse","input":"LAGER","output":"REGAL"}]`, `fodder:"lager"` (the word as
in surface, via a synonym in the surface — here "beer"), `indicator:"Returned"`. Harness checks
reverse(input)==answer.

### deletion
The indicator says *which* letter(s) go: first (*beheaded, headless*), last (*endless, curtailed,
nearly*), middle (*heartless, gutless*). Exemplar: `Beheaded celebrity is sailor (3)` → STAR−S =
TAR. `"operations":[{"op":"delete","input":"STAR − S","output":"TAR"}]` — input form
`"FODDER − X"` (the full word, a minus/hyphen, the dropped letter[s]); `fodder:"star"`. Harness
checks the answer is a strict subsequence of FODDER. **Avoid the formulaic "beheaded X" treadmill
across many clues.**

### homophone
Homophone indicator adjacent to the non-definition word; same-length words rely on adjacency.
Indicators: *we hear, reportedly, they say, by the sound of it, audibly, on the radio.* Exemplar:
`Bucket is white, we hear (4)` → sounds like PALE = PAIL.
`"operations":[{"op":"homophone","input":"pale","output":"PAIL"}]`, `fodder:"pale"`,
`indicator:"we hear"`. **The two words must genuinely sound alike** (harness can't check this).

### double-definition (no indicator, no link)
Two **genuine, distinct senses** of one spelling abut directly — ideally from different roots,
the second sense witty/unexpected; don't make both halves two words (too transparent). Exemplar:
`Not seeing window covering (5)` → BLIND.
`"operations":[{"op":"literal","input":"two definitions","output":"BLIND"}]`,
`fodder:"Not seeing / window covering"`, `def.text` = the first definition, `indicator:""`.
**Both halves must truly mean the answer** (harness can't check this).

### cryptic-definition
The whole clue is one misleading-but-true definition with a pun; usually flagged `?`. Exemplar:
`Flower of London? (6)` → THAMES (a "flow-er").
`"operations":[{"op":"literal","input":"pun on a flowing river","output":"THAMES"}]`,
`def.text` = the whole clue (position `start`), `indicator:""`.

### initialism / acrostic
Explicit initials/finals indicator over consecutive words. Indicators: *initially, primarily, at
first, leaders, to start* (firsts); *finally, ends, tails* (lasts). Exemplar:
`Initially amiable person eats primate (3)` → APE.
`"operations":[{"op":"initials","input":"Amiable Person Eats","output":"APE"}]`,
`fodder:"amiable person eats"`, `indicator:"Initially"`. Harness checks initials==answer.

### alternation
Indicator selects every other letter. Indicators: *oddly, evenly, regularly, alternately, every
other.* Exemplar: `Regularly value cheese? (4)` → odd letters of "vAlUe"… (verify!).
`"operations":[{"op":"alternate","input":"bArBaRiAn — odd letters B,R,A,I,N","output":"BRAIN"}]`,
`fodder:"barbarian"`, `indicator:"Regularly"`. **Verify the picked letters spell the answer.**

### lit (&lit / all-in-one) — the gold standard
The **entire clue** is simultaneously the wordplay AND the definition; every word does double
duty; often flagged `!`. The wordplay may be any device (set `clueType:"lit"` and use that
device's op, e.g. an `anagram` op). Exemplar: `Terribly evil (4)` → (EVIL)* = VILE, & the whole
clue defines vile. `"operations":[{"op":"anagram","input":"EVIL","output":"VILE"}]`,
`def.text` = the whole clue (position `start`). Rare and hard — only ship a clean one. For a
learner audience, prize clarity-with-elegance over maximum cunning.

---

## 6. The output contract (emit exactly this)

A clue is a **BankEntry** JSON object (the bank uses `answer`; the teaching corpus `src/data/clues.ts`
uses the same shape with `solution` + an `id`):

```json
{
  "answer": "VOICE",                       // single word, A–Z only (no spaces/hyphens)
  "clueType": "container",                  // one of the 12 device names
  "difficulty": 2,                          // 1–5 (see §7)
  "clue": "Utter nothing when there's wickedness about (5)",  // include the (enum) in parens
  "def": { "text": "Utter", "position": "start" },            // exact substring of clue, at an end
  "wordplay": {
    "indicator": "about",                   // the device indicator AS IT APPEARS in the surface ("" if none)
    "fodder": "O in VICE",                  // the source the wordplay acts on
    "operations": [ /* per-device template from §5; final op output === answer */ ]
  },
  "parse": "O (nothing) inside VICE (wickedness) = VOICE; to utter."   // tier-4 worked solution
}
```

Rules the harness/validator enforce (so get these right or the candidate is rejected):
- `answer` is a single A–Z word; `enumeration` is derived as its letter count, so the `(n)` in the
  clue must match.
- `def.text` is an **exact substring** of `clue`, sitting at the declared **start or end** (ignoring
  the trailing `(enum)` and surrounding punctuation).
- The **final operation's `output` equals the answer** (upper-case).
- Every `abbreviate` op uses an `ABBR`-recognised cue whose word **appears in the surface**.
- Device letter-mechanics hold for anagram/hidden/reversal/deletion/initialism (see §5).
- `indicator` must be a phrase **present in the surface** (it is quoted verbatim in the solver's
  hint ladder — a mismatch produces a misleading hint).
- Hint-ladder tiers 1–3 are auto-generated from this structure; **tier 4 is your `parse`** — make
  it a clear, complete worked breakdown.

**Self-check before submitting:** run `npx tsx scripts/validate-clue.ts <file.json>` (accepts one
object or an array). `ok:true` means it passed the mechanical gate; fix any `errors` first.

---

## 7. Difficulty rubric (1–5)
- **1–2 (Gentle):** one simple device; common words; transparent definition; minimal misdirection.
  (Stage-A teaching clues live here.)
- **3 (Moderate):** a single device with real misdirection, or a clean two-part charade/container;
  an oblique definition.
- **4 (Tougher):** layered wordplay (container+abbrev, reversal+charade), well-disguised
  definition, strong surface misdirection.
- **5 (Hard):** multi-step constructions, &lit, subtle definitions — sparingly.
Match `difficulty` honestly; it feeds the puzzle difficulty bands.

---

## 8. The writing loop (per answer, best-of-N)
1. Pick a **device** suited to the answer's letters (look for hidden runs, good anagram fodder,
   charade splits, a second meaning for a double-def, a reversal, &lit potential).
2. Fix a **precise, oblique definition**.
3. Assemble fair **wordplay**; emit the JSON per §6.
4. **Soundness pass** — read it as the wordplay demands; check indicators, grammar, every letter.
5. **Surface pass** — rewrite word choice into a real, picturable sentence that misdirects.
6. **Economy pass** — delete/justify every word; kill filler.
7. **Wit pass** — is there a penny-drop? Does it avoid the obvious arrangement?
8. **Validate** with the harness; **vary the device** across candidates so the best-of-N explores
   real alternatives, not trivial rewordings.

Produce several genuinely different candidates per answer; the grader keeps the best per §1.
