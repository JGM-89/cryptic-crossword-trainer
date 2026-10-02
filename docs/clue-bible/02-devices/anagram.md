# Anagram

*Clue Bible, chapter 02. Rule IDs are defined in `03-rules-and-flags.md`; the JSON contract is
`_json-contract.md`. Rule-ID note (2026-10-02): rule names follow `src/data/clue-rules.ts`
and `scripts/clue-flags.mjs`. Idle words are **F-IDLE** (the design spec's R-IDLE, demoted to a
flag by the owner's fairness decision); F-UNATTESTED was tried and rejected as an automatic
check, so invented phrases are judged in the exam (DECOY, TOURNAMENT-SURFACE). Status: v1.*

## 1. What it is and the fair form

The answer is a rearrangement of letters printed in the clue (the *fodder*). An indicator
tells the solver the letters are disordered.

**Fair form:** `definition` + `fodder` + `anagram indicator` (indicator directly before or after
the fodder), at most one link word, nothing else.

- **Fodder is literal.** The fodder words are printed in the clue, whole and unchanged, and
  their letters are exactly the answer's letters: no letter missing, none spare
  (R-FODDER-LETTERS). "Enlarged" is not fodder for GENERAL: it has a spare D.
- **No indirect anagram.** The solver must never have to find a synonym and then rearrange it
  ("Crooked merchant" for REALISED via DEALER). Ximenes calls this withholding information
  ([ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/)).
- **The indicator must be able to act on the fodder** in the cryptic reading: an adjective or
  participle ("Senator **plotted**", "**wild** hornet"), an imperative before it ("**Shake** a
  canister"), a verb with the fodder as subject ("Armed **rebels**"), or a noun phrase ("**a mess
  of** catering").
- One definition at one end; every other word is fodder, indicator or a link (F-IDLE).

**Not supported by the validator (do not write as `anagram`):** compound anagrams that mix
fodder with an abbreviation or a synonym ("Dean upset Queen" → (DEAN+ER)* = EARNED), and
subtractive anagrams. For `clueType: "anagram"` the validator requires the fodder's letters to
be one contiguous run of the clue's letters and an exact permutation of the answer. The audit's
EARNED and STARTLED rewrites (audit 02 §2b #20, #26) use this form and therefore cannot ship as
written. Open issue for case law.

## 2. JSON the validator expects

```json
{
  "answer": "ASCERTAIN",
  "clueType": "anagram",
  "clue": "Shake a canister to find out (9)",
  "def": { "text": "find out", "position": "end",
           "evidence": { "source": "wordnet", "sense": "ascertain.v.01: establish after a calculation, investigation, experiment, survey, or study" } },
  "wordplay": {
    "indicator": "Shake",
    "fodder": "a canister",
    "operations": [ { "op": "anagram", "input": "A CANISTER", "output": "ASCERTAIN" } ]
  }
}
```

- `fodder` = the fodder words exactly as printed, in order, and nothing else.
- **[validator]** sorted letters of `fodder` = sorted letters of `answer`; the fodder's letters
  appear contiguously in the clue.
- **[clue-rules]** R-FODDER-LETTERS: every fodder word is a whole surface word (catches
  "enlarge" inside "enlarged"), and the letters match exactly.

## 3. Indicators

Anagram indicators are the largest class. The references group them by idea: damage,
disorder, movement, alteration, cooking, drink, wrongness, novelty (Wikipedia: "shredded",
"dancing"; Sutherland: *broken, damaged, cooked, confused, upset, edited, out of sorts,
designed, mishandled, drunk, built, rearranged, smashed, askew*).

**Reference vocabulary:** `src/data/indicators/anagram.json` lists every anagram indicator
published broadsheet setters used at least twice (3,007 entries, George Ho's dataset). The
code does not yet check anagram indicators against it, but an indicator on that list is one
real setters use; prefer it. An indicator off the list needs to be obviously an instruction to
rearrange.

| Family | Examples | Notes |
|---|---|---|
| Damage | broken, smashed, wrecked, shattered, ruined, damaged, battered, in pieces, in ruins | |
| Disorder | confused, mixed, muddled, jumbled, scrambled, in a mess, a mess of, untidy, all over the place, in a twist, in knots | |
| Movement | dancing, moving, stirred, stirring, shaken, tossed, swirling, spun, wandering, flying, scattered, spilt | |
| Alteration | changed, altered, reformed, revised, edited, converted, transformed, remodelled, redesigned, rebuilt, recast, rearranged, reorganised | |
| Making | made, built, designed, fashioned, composed, worked, constructed, organised, arranged, sorted, set out, cooked, baked, brewed | |
| Wrongness / novelty | wrong, wrongly, false, bad, badly, poor, off, odd, strange, strangely, unusual, curious, novel, new, fresh, in error, out of order | |
| Unrest | upset, rebel, rebels, revolting, riotous, unruly, wild, wildly, free, loose, at large | |
| Drink | drunk, drunken, drunkenly, tipsy, sloshed, merry | |

**House guidance (Cruci).** These are judgement calls, not machine rules: published setters
use every word below, and the owner's fairness rule is that Cruci never rejects what
professionals do. Avoid them because Cruci clues are standalone (no crossing letters to settle
an ambiguity); if you use one, the cold solvers must still find a single answer.

| Indicator | Ruling | Why |
|---|---|---|
| oddly, evenly, regularly, alternately, every other | **Avoid** as anagram indicators | They are also alternation indicators; with no crossing letters the solver may not know which device is meant. Audit 02 #72 (GOAT "oddly draped") was marked ambiguous. |
| up (bare) | Avoid; allowed only inside a phrasal verb with an anagram sense ("stirred up", "mixed up", "broken up", "shaken up", "torn up") | Bare "up" is a Down-only reversal indicator elsewhere (`reversal.md`), and it reads as idle. |
| about, around, round, over, back, turned | Avoid as anagram indicators | They read as reversal or container indicators. |
| out, off | Allowed with care | They also signal deletion or insertion; check the parse is unique. |
| doctor, doctored | Allowed with care | "Doctor" is also DR/MO/MB (`_abbreviations.md`). |
| mad, crazy, insane, nuts, deranged, mental | Allowed by most editors (Alberich defends the *mad* family on its secondary senses), but never in a surface about a real person's mental health | Taste test (`01-qualities.md`). |

## 4. Surface craft

1. **The fodder should read as a natural phrase.** ASCERTAIN's "a canister", CAPTAIN's "in a
   pact", DANGEROUS's "Nose guard": each is an ordinary word group. Invented fodder ("An artsy
   moon", "cartel ore") is the commonest anagram fault in the bank (audit 02 #21, #60); the
   exam's DECOY and surface tournament catch it. `scripts/raw-material.mjs` lists fodder
   phrases found in real sentences.
2. **Pick the indicator that fits the fodder's scene.** Alberich: anagram clues are noteworthy
   "if the anagram indicator has some surface connection with the anagram fodder"
   ([tips](https://www.alberich-crosswords.com/articles/tips-for-setters)); Methven's example is
   "trained" next to "pet" ([tips](https://charliemethven.com/tips)). A canister is *shaken*;
   rebels are *armed*; a pact is something one is *entangled* in.
3. **Let the indicator pose as something else.** In DREAM *Armed rebels nurse an ambition*,
   "rebels" reads as a noun; in GRANITE *Tearing up hard rock*, "Tearing up" reads as a verb
   phrase. The solver has to lift the indicator out of the phrase it seems to belong to.
4. **Never pad the story.** "…, he was drunk but still sharp", "…won't stop us…", "When X
   resettle, they…" turn a plain anagram into a narrated recipe (audit 02 §3.2). Every padding
   word is F-IDLE. A short clue with no idle word beats a long one with a story.
5. **No dragged-in nouns.** "Members groan", "Pupils dilate", "Damned horse stabled": the extra
   noun makes the sentence read and looks like wordplay material, so it is both padding and a
   fairness fault (audit 02 §3.2).
6. **Aim for the anagram &lit** when the fodder and indicator can themselves define the answer
   (see `lit.md`).

Published example (one, attributed): *"Yemen, unlikely adversary (5)"*, ENEMY, Guardian Quick
Cryptic 103 ([Fifteensquared](https://fifteensquared.net/2026/03/21/guardian-quick-cryptic-103-by-ludwig/)).
Three words, a place name as fodder, an indicator that reads as political comment.

## 5. Typical failures

| Failure | Bank example | Rule |
|---|---|---|
| Fodder letters do not match (spare or missing letter) | GENERAL "A wildly **enlarged** map guided the commander" (ENLARGE + D) | **R-FODDER-LETTERS** |
| A dragged-in noun or a word with no job | DETAIL "**Pupils** dilate oddly…", ORGAN "**Members** groan, upset…", BLASTED "Damned **horse** stabled awkwardly", GRENADE "Enraged **soldier** hurls…", CEDAR "Raced wildly **round** the tree" | **F-IDLE** |
| Narrative padding | ALERT "Later, **he was** drunk **but still** sharp"; CATER "A smashed crate **won't stop us**…"; SPEAR "…**can still serve as**…" | **F-IDLE** |
| Invented fodder | ASTRONOMY "An artsy moon"; CORRELATE "Refined cartel ore" | exam: DECOY / TOURNAMENT-SURFACE (and F-IDLE for "An") |
| Indirect anagram (synonym first) | — (none shipped; the validator blocks it) | R-FODDER-LETTERS |
| "When X [indicator], they…" template | NEUTRAL, RESIDENT, STREAMING, ELEPHANT | **F-TEMPLATE**; **B-REPEAT** |
| Indicator doubles as an alternation indicator | GOAT "A toga, **oddly** draped…"; DETAIL "dilate **oddly**" | house guidance (§3) |
| Definition wrong part of speech | OCEAN "Canoe wrecked **at sea**" | **F-DEF-EVIDENCE** |
| Chestnut fodder | TREASON/senator, LISTEN/silent, ASTRONOMERS/no more stars, CONVERSATION/conservation, ORCHESTRA/cart horse | **F-CHESTNUT** |
| US spelling in fodder or surface | BARGAINING "an **aging** brain" | **F-AMERICANISM** |
| Same indicator more than twice in a batch | "surprisingly", "wildly" | **B-REPEAT** |

## 6. Exemplars from our bank

**Best**
- **ASCERTAIN** — *Shake a canister to find out (9)*. (A CANISTER)*. The fodder is a natural
  phrase and the indicator belongs to it. Audit 5/4.
- **CAPTAIN** — *Skipper entangled in a pact (7)*. (IN A PACT)*. The fodder is cleverly found
  inside an idiom. Audit 4/4.
- **DREAM** — *Armed rebels nurse an ambition (5)*. (ARMED)*. "Rebels" serves as the indicator.
  Audit 5/4. **Data fix needed:** the bank's `def.text` is "an ambition", which leaves "nurse"
  idle (F-IDLE). The definition is the verb phrase "nurse an ambition" = DREAM; set
  `def.text` to that.

**Weak**
- **GENERAL** — *A wildly enlarged map guided the commander (7)*. The fodder has a spare D, and
  "map guided" does nothing. It passed the old validator only because "enlarge" is a substring
  of "enlarged". R-FODDER-LETTERS, F-IDLE.

## 7. Cruci-specific notes

- **Share of the mix.** Anagrams are 26% of the bank, at the top of a broadsheet's 15–25%.
  Alberich suggests no more than four full anagrams in a 28–30 clue puzzle. Keep anagrams to
  **at most 1 in 4** of any new batch.
- **Models over-produce anagrams.** Solving studies found LLMs over-predict anagram and hidden
  clue types (Sadallah et al., COLING 2025); expect the same bias when writing. The Writer
  method's device-locked setters exist to counter it.
- **Long anagrams.** For long -LY adverbs and long words, forced fodder rarely reads well
  (THOUGHTLESSLY, audit 02 #69). Prefer a charade, a container or a cryptic definition, or flag
  the answer to the owner.
- **Teaching register (Stage A).** One common word as fodder, a plain indicator from the first
  three families, a definition people use: *Cruel name changed* (MEAN). Bank clues must not
  reuse teaching-corpus fodder (LISTEN/SILENT and TREASON/SENATOR appear in both; audit 02
  §3.7), so the learner never meets the same trick twice.
- **Par.** One operation, no abbreviation: C = 0. Long answers raise A.

## Sources

- Wikipedia, *Cryptic crossword*, "Anagrams": https://en.wikipedia.org/wiki/Cryptic_crossword
- D. Sutherland, *Spotting indicator words* (Dummies): https://www.dummies.com/article/home-auto-hobbies/games/puzzles/crosswords/spotting-indicator-words-when-solving-cryptic-crosswords-175680/
- Ximenes, ch. 5 "Cluemanship" (indirect anagrams; anagram frequency): https://xotaotc.nfshost.com/chapter-5-cluemanship/
- Alberich, *Tips for setters* (indicator–fodder connection; "How many anagrams?"): https://www.alberich-crosswords.com/articles/tips-for-setters
- C. Methven, *Tips*: https://charliemethven.com/tips
- Sadallah et al., COLING 2025: https://arxiv.org/abs/2412.09012
- Audit 02 §2, §2b, §3.2, §3.7: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/integrity.ts` (case `anagram`), `src/data/clue-rules.ts` (R-FODDER-LETTERS)
