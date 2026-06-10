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

Grade every candidate on these five axes. **Axes 1 AND 1b are hard pass/fail gates; a clue that
fails either scores zero regardless of the rest.** Axes 2–5 are 1–5.

1b. **Surface realism (PASS/FAIL) — the single thing solvers notice first.** The surface must be
   ONE real, natural sentence (or wholly natural phrase) with a single coherent meaning you could
   read as plain English *without* knowing the answer (the conversation test — a person could
   actually say or write it). It FAILS if: (a) it's a **narrated cryptic operation / recipe**
   ("Run threading through the kettle's steam, a brook"; "Fine dining minus its opening leaves the
   study of stars"); (b) the **definition is comma/dash-tacked** on the end rather than integrated
   ("…, a brook"; "Working with church, formerly"); (c) it only reads as a sentence because of a
   **decorative orphan word** that does no cryptic work ("Her vast *estate*, reshaped, became the
   crop"); or (d) it's **grammatical but surreal/incoherent** ("part of the rectangle rises above
   the fisherman"). The fix is usually to **change the device** (the answer is fixed, the
   construction is free) — see §3. Ranked ABOVE wit: a plain real sentence beats a clever non-one.
   *Note:* a compact natural **phrase** is fine where the device is the whole clue — double
   definitions, cryptic definitions, and &lit are legitimately short ("Greet the breaker",
   "Terribly evil"); judge them as phrases a person could say, not as failed sentences.

1. **Soundness / fairness (PASS/FAIL).** Read the clue exactly as the wordplay demands. The
   cryptic grammar congeals; the definition is a true synonym at one end; every letter is
   accounted for; indicators are present and the right type; no indirect anagram; abbreviations
   are standard and direct; def-by-example is flagged with `?`/`perhaps`. Must also pass the
   mechanical harness (`scripts/validate-clue.ts`).
2. **Definition (1–5).** Precise but not the dictionary's first, obvious synonym. Oblique,
   disguised definitions score higher.
3. **Surface (1–5).** Reads as natural, picturable English — a real phrase or sentence that
   could occur in conversation or writing — in one consistent register/tense, and actively
   *misdirects* away from the parse. Prefer concrete, visualisable nouns over vague abstractions
   ("thing/stuff/business"). A **5** could appear verbatim in a novel or a headline; a **2** only
   makes sense inside a crossword.
4. **Economy (1–5).** Every word earns its keep in the cryptic reading. **No filler** added only
   to prop up the surface. (Length is fine if it "tells a story" with no idle words.)
5. **Wit / originality (1–5).** A fair penny-drop ("aha"); fresh route; avoids the most obvious
   arrangement and never "screams the answer."

**Composite & threshold.** Keep the candidate with the highest (surface + economy + wit + def)
among those that PASS axes 1 AND 1b. A shippable clue needs **fairness = PASS, surface realism =
PASS, surface ≥ 4, and (surface + wit) ≥ 7**. If no candidate clears the bar, write more — and try
a different device. If an answer genuinely can't reach a witty real sentence, ship a *plain* real
sentence (clarity beats forced cleverness) or flag it for a human pick.

> Maxims to hang above the desk — Azed: *"Clues should be written to be solved, not to
> demonstrate what a fiendishly tortuous mind the writer has."* Alberich: *cryptic grammar comes
> first, but a smooth, image-bearing surface is what separates a good setter from an average one.*

---

## 1c. The gentle teaching register (Stage-A corpus, `src/data/clues.ts`)

The Stage-A lessons are the FIRST clues a learner ever meets. The trap (which we fell into once) is to
think "beginner = transparent" and write give-aways that aren't really cryptic — *"A pig's tail is
also a hairstyle"* (PIGTAIL spelled out), *"Warts, sent back, spell a drinking tube"* (narrates the
mechanic), *"Hedge, beheaded, is a border"* (narrates again). **That is the single worst thing you can
do here.** A teaching clue is a **fully real cryptic clue**; it is only *gentle* in its vocabulary and
device choice, never in its disguise.

**The five rules (all must pass — derived from real published beginner cryptics, e.g. the Guardian
Quick Cryptic):**
1. **Real cryptic clue.** Answer and its parts are **disguised**, never written in plain sight; there
   is a genuine penny-drop.
2. **One natural statement.** The whole clue reads as a phrase/sentence you'd actually meet, evoking a
   coherent image. No "crosswordy" strings, no gibberish; grammatically correct.
3. **Definition woven, not tacked.** Def sits at start or end and is *part of* the sentence — never
   bolted on after a comma/colon ("…: fast food"), and always a word people use (never "a drinking
   tube").
4. **Never narrate the mechanic.** No "spell X backwards", "beheaded, is", "sent back". The device
   hides inside an ordinary word or idiom doing double duty.
5. **Gentle, not transparent.** Common words, the most learnable device per slot, well-known
   abbreviations, one device, one clear definition. Difficulty comes from *fair disguise*, not from
   obscurity and not from giving the answer away.

**Real gold-standard exemplars (study these):** GOALIE *"Leave with a porky footballer"* (GO+A+LIE);
LARCH *"Large supporting structure for tree"* (L+ARCH); STALLION *"Eccentric still on a horse"*
(anag); SILENT *"Refraining from speech, listen out"* (anag); ASTRAY *"Off the rails when on
carrier?"* (AS+TRAY). The disguise lives in everyday words; the definition is part of the reading.

**In-house exemplars that hit the bar:** DOGMA *"Follow Mother's teaching"* (DOG+MA); HOGWASH *"A
pig's laundry? Nonsense!"* (HOG+WASH); ANGER *"A ranger loses his head in a rage"* (RANGER−R, where
"loses his head" doubles as losing one's temper); STAR *"Endless stare at a celebrity"* (STARE−E);
DIAL *"Laid back to make a call"* (reversal hidden in an idiom); SCAR *"Scare endlessly leaves a
mark"*. The mechanic always hides inside a natural word/idiom.

**Process when an answer can't reach the bar in its slot:** the Stage-A answers are **not grid-locked**
(the bank/archive is separate), so **swap the answer, keep the device** — pick a word whose parts hide
in everyday language (PIGTAIL→DOGMA, MANKIND→HOGWASH, EACH→ANGER). Keep ≥1 clue per device. Validate
via `integrity.test.ts` + `curriculum.test.ts`; **a human reads every clue against the five rules.**

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
- **Image test** — does it conjure a picture or a plausible statement (a mini-narrative)? Concrete
  nouns and a real action beat abstract nouns and vague verbs.
- **Conversation test** — could this sentence appear *outside* a crossword? If it only exists in
  crossword-land ("Doctor and the Queen hold four for motorist!"), it's crosswordy — rewrite.
- **Economy test** — can you delete a word without breaking the *cryptic* reading? If a word is
  there only for the surface, it's a fault. (No padding adverbs like "…wildly…", no random
  proper nouns dragged in to fix anagram fodder.)
- **Register/tense test** — one voice and one tense throughout; no jarring formal↔slang jump, no
  archaic word beside a modern one. Prefer the present tense (it reads most naturally and keeps the
  cryptic grammar clean).
- **Link-word test** — every joining word (`is`/`for`/`from`/`with`/`gives`…) must read naturally
  in the surface *and* do honest cryptic work. A link present only to smooth the surface is padding.
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

**Surface faults — quick diagnostic table.** Run each candidate past these; any hit is a rewrite.

| Smell | One-line test | Fix |
|---|---|---|
| **Padding / filler** | Delete the word — does the *cryptic* reading still hold? | If yes, the word served only the surface — cut it or find a link that does cryptic work. |
| **Crossword-ese** | Would anyone say this outside a puzzle? | Rewrite into a sentence that could occur in prose or speech. |
| **No image / abstract** | Can you *picture* it? | Swap vague nouns ("thing/stuff/matter") for concrete ones; give it a real subject and verb. |
| **Non-sequitur** | Taken literally, does the scene make sense? | Re-choose synonyms so the words cohere into one scenario. |
| **Register/tense clash** | One voice, one tense? | Unify; default to present tense. |
| **Proper-noun padding** | Is that capitalised name there for the story or just for fodder? | Drop it or rebuild the wordplay; capitals must earn the surface (the capitalisation trick is fair, dragged-in names are not). |
| **Scream** | Does the surface give the answer away before the parse? | Strengthen misdirection — disguise the definition, bend the part of speech. |
| **Device pile-up** | More than ~two devices to track? | Simplify; one clean penny-drop beats three muddy ones. |

> **Authorities, in one breath:** Afrit — *"say what you mean"* (the parse is sacred, the surface
> may lie). Ximenes — precise definition, immaculate grammar, nothing extraneous. Azed — a clue
> should *tell a story*. Alberich — a clue that conjures no picture is unsatisfactory even when the
> cryptic grammar is perfect. Don Manley — read it aloud; if you stumble, the surface is wrong.

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

**The mechanical gate now also enforces (2026-06-10):**
- `concat` pieces must compose, in order, to the answer, and every multi-letter piece must be the
  output of a prior operation or a verbatim surface word.
- `insert` must be a TRUE internal insertion (`"X in Y"` / `"Y around X"`); an edge-placement is a
  concatenation wearing the wrong indicator and is rejected.
- Alternation letters are checked (every-other from either start), and the fodder must be literal.
- A `synonym`/`literal` piece may not swallow an indefinite article: `"a cake" → CAKE` is rejected
  (the A is a standard letter-contributor, so leaving it unaccounted is unfair). A definite article
  is tolerated (`"the bed" → BED`).
- A **charade may not use containment words** (in/inside/into/about/around/holding…) as its glue —
  that implies an insertion and can spell a false answer. Use order/addition language instead
  (with, and, after, on, beside, takes, gets…).
- The `indicator` must appear verbatim in the surface (it is quoted in the hint ladder).
- **Orphan words are gated mechanically**: every surface word must be the definition, the
  indicator, fodder, an operation's cue, or a genuine link word. A multi-word decorative span
  ("…the warehouse staff…") fails the gate; even a single decorative word is lint-ranked for the
  realism judges. Write surfaces where every word earns its keep.

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
   Apply the **placeholder test**: mentally replace the fodder with `[fodder]` and the definition
   with `[answer]`; the link words that remain must still parse as a sentence (this catches
   tense/number mismatches and links that only the surface needed).
5. **Surface pass** — rewrite word choice into a real, picturable sentence that misdirects; one
   register and tense; concrete nouns; nothing that only exists in crossword-land.
6. **Economy pass** — delete/justify every word; kill filler.
7. **Wit pass** — is there a penny-drop? Does it avoid the obvious arrangement?
8. **Validate** with the harness; **vary the device** across candidates so the best-of-N explores
   real alternatives, not trivial rewordings.

Produce several genuinely different candidates per answer; the grader keeps the best per §1.
