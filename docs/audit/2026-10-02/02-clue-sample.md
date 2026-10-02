# Cruci clue audit 02: an editor's sample of the shipped bank

*Auditor's stance: broadsheet cryptic editor (Times/Guardian standard), grading the clues that actually shipped (`src/data/bank/part-a…j.json`, 415 clues) and the Stage-A teaching corpus (`src/data/clues.ts`, 44 clues), against `docs/clue-style.md`. The bank was written and judged by the same model family, so I assumed nothing. I read every one of the 415 clue lines, re-derived parses wherever something smelled off, and counted the patterns with scripts. 2026-10-02.*

---

## 0. Verdict up front

| Band | Share of bank (whole-bank skim, all 415 read) | What it means |
|---|---|---|
| **Broadsheet-grade** | **≈ 40% (~170)** | Could run verbatim in a broadsheet. About **10% (~40)** are good enough for a *main* cryptic (ASCERTAIN, KNEE, MARKET, NET, DREAM, TEA, PIANO, CAPTAIN, PASSAGE, EARNEST, DENIER…). The other ~30% are **Quick Cryptic grade**: clean and fair, but gentle or familiar. |
| **Competent but flat** | **≈ 37% (~150)** | Sound, but no picture and no penny-drop. Typically a generic definition ("bird", "tree", "fruit"), a transparent single-word hidden, or a double definition held together by a link word. Readers won't object, but they won't remember any of these either. |
| **Weak** | **≈ 23% (~95)** | Padding (words that do nothing in the cryptic reading), pieces of the answer printed in the clue, non-cryptic "?" definitions, invented fodder phrases, or a narrated recipe. **About 4% (~17) are outright unsound.** |

The graded sample (94 bank clues) agrees with this. Across the 64 stratified clues: mean surface **3.3**, mean wit **2.9**, and **29/64 (45%)** clear the house shipping bar (fair, surface ≥ 4, surface + wit ≥ 7). The 30 weakest average surface **2.4** / wit **1.7**, and none clears the bar.

**The single most important finding.** The bank's best clues are genuinely good: as good as the published beginner puzzles I benchmarked (§4). The weak tail, though, comes from a handful of **repeatable production faults**, not bad luck. Fix those faults and the bank's average lifts by about a grade:

1. **Single decorative words pass the gate.** About 71 clues (17%) have at least one word that does nothing in the cryptic reading. At least 8 of these are fairness failures: a stray word looks like it should feed the wordplay and doesn't ("**Members** groan, upset…", "**Pupils** dilate oddly…", "Damned **horse** stabled…", "Enraged **soldier** hurls…", "**A** hard limb…"). The house harness blocks only multi-word spans; single orphans are merely lint-flagged, and the realism judges *reward* them because they make the sentence read nicely.
2. **Lift-and-separate charades.** In 31 of 75 charades (41%), a ≥3-letter piece of the answer is printed verbatim in the clue. Five clues print the whole answer (OUTLOOK "Once out, look", STARLET "The star let", OVERNIGHT "Play over, night fell", WONDER "She wonders", CHARM "Church arm").
3. **The device mix is not a broadsheet mix.** Hiddens, double definitions and "?" cryptic definitions make up 46% of the bank. Containers make up 3%, deletions 0.2% (one clue), and acrostics 0%.

---

## 1. Method

- **Full skim.** I dumped `part|answer|type|difficulty|par|clue|def` for all 415 clues and read every line. I tagged each one broadsheet / competent / weak and pulled out anything suspect.
- **Parse re-derivation.** For about 35 suspect clues I printed `wordplay.indicator / fodder / operations / parse` and checked every letter and every word against the clue. That is how the unsound ones were found: several *pass the validator* because it checks letters, not words.
- **Sample of 94 bank clues.** It contains the **30 weakest** (marked ★ below) plus **64 stratified** clues. The stratified set covers every part a–j; every device present (anagram, charade, container, hidden, reversal, deletion, homophone, double definition, cryptic definition, &lit); and every length from 3 to 13. I deliberately included strong clues so the sample shows the ceiling as well as the floor.
- **Teaching corpus.** 15 of the 44 `clues.ts` clues, graded against §1c (the gentle-teaching register).
- **Scripts** (scratch only, nothing in the repo modified) counted devices, indicators, templates, lifts, orphans, "?" endings, repeated answer roots and Americanisms.
- **Benchmark.** I fetched two recent Guardian Quick Cryptic blogs and a Times Saturday blog from Fifteensquared / Times for the Times, plus a page of setters' favourite clues (sources in §4).

**Scales.** SURFACE 1–5: 5 = could appear verbatim in a broadsheet; 3 = competent but flat; 1 = crosswordese. WIT 1–5: penny-drop. FAIR: P = pass; F = fail (definition accuracy, indicator validity, letter/word accounting, Ximenean soundness); P? = defensible but would be queried by a broadsheet editor.

---

## 2. Graded sample: 94 bank clues

★ = one of the 30 weakest clues in the bank (my judgement after reading all 415).

| # | Part | Answer | Device | Clue (as shipped) | Surf | Wit | Fair | Note |
|---|---|---|---|---|---|---|---|---|
| 1★ | d5 | GENERAL | anagram | A wildly enlarged map guided the commander (7) | 3 | 2 | F | Fodder is ENLARGE but the clue prints "enlarged" — a stray D; "map guided" is padding. The validator let a substring pass. |
| 2★ | h41 | DETAIL | anagram | Pupils dilate oddly at one fine point (6) | 4 | 2 | F | "Pupils" does nothing in the parse (fodder is only DILATE). The surface reads well because of a word that has no job. |
| 3★ | b21 | ORGAN | anagram | Members groan, upset at the party paper (5) | 3 | 2 | F | "Members" does nothing in the parse. "At the party paper" is an awkward way to define ORGAN. |
| 4★ | a38 | HARM | charade | A hard limb can do damage (4) | 3 | 2 | F | The leading "A" is not accounted for (H + ARM uses only "hard" and "limb"). "Can do" is a filler link. |
| 5★ | d19 | BLASTED | anagram | Damned horse stabled awkwardly (7) | 4 | 2 | F | "horse" does nothing in the parse. It is only there so that "stabled" makes sense. |
| 6★ | i46 | CHARITY | charade | The cleaner had it all year, doing good works (7) | 2 | 2 | F | "had", "all" and "doing" do nothing in the parse (CHAR + IT + Y). The surface is a narrated recipe. |
| 7★ | i60 | MUSHROOM | charade | Sentimental mush fills the room, like a fungus (8) | 2 | 2 | F | "fills" signals a container but the device is a charade; MUSH and ROOM are both printed in the clue; "like" is padding. |
| 8★ | a11 | COB | hidden | Swan gliding past disco bar (3) | 4 | 3 | F | "Past" does not indicate a hidden word, so the indicator is invalid. The cob-as-male-swan definition is good. |
| 9★ | e34 | OVERNIGHT | charade | Play over, night fell, so we stayed till dawn (9) | 2 | 1 | P | OVER and NIGHT are both printed. "fell, so we stayed" is padding. This is the lift-and-separate template at its worst. |
| 10★ | d13 | OUTLOOK | charade | Once out, look at what lies ahead (7) | 2 | 1 | P | The answer is printed whole ("out, look"). "Once" is padding. |
| 11★ | h74 | OFFSHORE | charade | Gone off near the shore, now out at sea (8) | 2 | 1 | P | OFF and SHORE are both printed. "near" and "now" are padding. There is no penny-drop. |
| 12★ | d29 | STARLET | charade | The star let her flat to a budding actress (7) | 2 | 1 | P | "The star let" prints the answer. "her flat" is padding and the scenario is odd. |
| 13★ | e21 | OVERBOARD | charade | Finished with the board, he leapt into the sea (9) | 2 | 2 | P | BOARD is printed and "he leapt" is padding. |
| 14★ | h80 | CARTRIDGE | charade | Push the cart up the ridge for a refill (9) | 2 | 1 | P | CART and RIDGE are printed. "Push… up" is padding. |
| 15★ | f16 | UNDERSTANDING | charade | Beneath your standing lies sympathy (13) | 3 | 1 | P | UNDER ("beneath") is a mild disguise, but STANDING is printed. "your" and "lies" are padding. |
| 16★ | f1 | NIGHTMARES | charade | After dark, the mares of our worst dreams (10) | 2 | 2 | P | MARES is printed, the definition is tacked on after "of", and "our" is padding. |
| 17★ | i67 | NEWSPAPER | charade | The latest on paper makes the daily (9) | 3 | 2 | P | PAPER is printed, and "The latest" for NEWS barely disguises it. |
| 18★ | i65 | CHAMPION | charade | Support the champ taking one on (8) | 2 | 1 | P | CHAMP and ON are printed. The device is a word sum with nothing to see through. |
| 19★ | h71 | SNAPSHOT | charade | Break for a quick shot, and there's your photo (8) | 2 | 1 | P | SHOT is printed and "there's your" is padding. It reads like an advert. |
| 20★ | c28 | EARNED | anagram | Pulled in when the end erratically neared (6) | 2 | 2 | P | "the end" does nothing in the parse (fodder is NEARED). The surface is gibberish. |
| 21★ | e36 | ASTRONOMY | anagram | An artsy moon, badly sketched, hints at the study of stars (9) | 2 | 2 | P | "An artsy moon" is invented fodder, "An" is padding, "hints at" is a weak link, and the surface narrates the anagram. |
| 22★ | b25 | STRAW | double-definition | What you sip through, the last of it breaking the camel's back (5) | 2 | 2 | P | A rambling double definition. "the last of it breaking…" is a paraphrase, not a definition. |
| 23★ | b31 | WHERE | homophone | You wear it, we hear — but in what place? (5) | 2 | 2 | P | "You wear it, we hear — but in what place?" splits into two half-clues, and "You" is padding. |
| 24★ | d23 | EARLOBE | hidden | Wear lobelias and you cover a bit of the ear (7) | 2 | 2 | P | The definition "a bit of the ear" contains part of the answer. "you" is padding and the surface is surreal. |
| 25★ | d25 | DELIVER | reversal | Reviled at first, he turned it around to save the day (7) | 2 | 2 | P | "at first, he… it… to save the day" is mostly padding around a plain reversal. |
| 26★ | e27 | STARTLED | charade | Beginning to be led, the colt took fright (8) | 2 | 2 | P | LED is printed. "to be" and "the colt" are padding. |
| 27★ | i50 | MONARCH | charade | Butterfly seen by man on arch? (7) | 2 | 2 | F | man→M is a weak abbreviation. ON and ARCH are printed and "seen by" is padding. The "?" is doing no work. |
| 28★ | f20 | GRANDMOTHERLY | cryptic-definition | Inclined to spoil you rotten between rounds of knitting? (13) | 3 | 1 | P | A plain, stereotyped description with a "?" added. There is no cryptic reading. |
| 29★ | f18 | ENTERTAINMENT | cryptic-definition | What keeps an audience coming back for more? (13) | 3 | 1 | P | A straight definition. Nothing misleads and there is no pun. |
| 30★ | i39 | WONDER | deletion | She wonders endlessly, lost in awe (6) | 2 | 1 | P | The answer is printed in plain sight ("wonders"), and "She" and "lost" are padding. This is also the bank's ONLY deletion clue. |
| 31 | a0 | EAR | double-definition | It catches a whisper and grows on a cob (3) | 3 | 3 | P? | Loose definition: an ear doesn't "grow on" a cob; the cob is the core of the ear. |
| 32 | a1 | BAT | hidden | Flier in acrobatics (3) | 3 | 2 | P | Hidden inside a single word. The surface is only a fragment. |
| 33 | a2 | PEN | double-definition | Writer kept in a sheep enclosure (3) | 2 | 2 | P | "kept in a" is surface-only link padding, and "Writer" for PEN is a stretch. |
| 34 | a3 | NET | reversal | What's left when ten's knocked over (3) | 4 | 4 | P | Excellent. "What's left" (NET) and "knocked over" (ten-pin bowling) pull together. Top tier. |
| 35 | a6 | GOD | reversal | Deity a dog rolls over for (3) | 3 | 3 | P | Awkward word order ("Deity a dog rolls over for"). |
| 36 | a7 | TIP | reversal | Pointer rising from the pit (3) | 3 | 3 | F | "rising" only works in a Down clue, but the bank has no grid direction. |
| 37 | a9 | CAR | hidden | Old banger lurking in Madagascar (3) | 3 | 2 | F | "Old banger" is an example of a CAR (definition by example, unflagged). Hidden in a single word. |
| 38 | a10 | AGE | hidden | A generation can be read in any vintage (3) | 3 | 2 | P | "A generation" for AGE is loose, and the surface is flat. |
| 39 | a16 | LIME | double-definition | Citrus tree? (4) | 3 | 2 | P | Weak double definition: the citrus lime is also a tree, so the two halves overlap. |
| 40 | a21 | SOLE | double-definition | Only the underside of a shoe (4) | 4 | 3 | P | Natural and clean, if gentle. |
| 41 | a29 | FLAT | double-definition | A level apartment (4) | 4 | 4 | P | The "A level" pun is a good penny-drop. |
| 42 | a33 | WIND | double-definition | Coil tightened in the gale (4) | 2 | 2 | P | "tightened in the" is padding, and "Coil tightened" is not idiomatic. |
| 43 | b0 | STEAM | charade | Small side built up a head of pressure (5) | 3 | 2 | F | STEAM ≠ "a head of pressure" (that would be a head of steam), and "built up" does nothing in the parse. |
| 44 | b4 | ALERT | anagram | Later, he was drunk but still sharp (5) | 3 | 2 | P | "he was" is padding (a recurring tic). |
| 45 | b11 | CATER | anagram | A smashed crate won't stop us providing the food (5) | 2 | 2 | P | "won't stop us" is padding, and the definition "providing the food" is laboured. |
| 46 | b13 | TENOR | charade | Net returned gold for the singer (5) | 2 | 2 | P | "Net returned gold" is crosswordese, made of abbreviations. |
| 47 | b19 | PAINT | anagram | A spilt pinta ruins the fresh coat (5) | 4 | 3 | P | Good British flavour ("pinta"), and the image is clear. |
| 48 | b26 | DEVIL | charade | Old Nick's daughter is wicked (5) | 4 | 3 | P | Clean, with a real image. |
| 49 | b27 | REGAL | reversal | Beer sent back, befitting a queen (5) | 3 | 1 | P | LAGER reversed as REGAL is perhaps the most recycled clue in cryptics (the house style guide itself uses it as an example). It also has a comma-tacked definition. |
| 50 | c11 | HATRED | anagram | Loathing runs through it like a frayed thread (6) | 2 | 2 | P | "runs through it like a" is padding. |
| 51 | c17 | MARKET | hidden | A fair part of Denmark, etc. (6) | 4 | 5 | P | Excellent: "etc." does real work and "fair" misleads. Top tier. |
| 52 | c25 | DENIER | cryptic-definition | One who won't take yes for an answer? (6) | 4 | 4 | P | Witty cryptic definition. Top tier. |
| 53 | c32 | SECOND | double-definition | Back the flawed article (6) | 4 | 4 | P | Good: a "second" is a flawed article. |
| 54 | c33 | MEDDLE | homophone | Interfere with an Olympic prize, by the sound of it (6) | 4 | 3 | P | Sound homophone with a natural surface. |
| 55 | d2 | EARNEST | double-definition | Serious money down? (7) | 4 | 4 | P | Good: "money down" is earnest money. |
| 56 | d11 | HEADWAY | charade | Lead the way to make real progress (7) | 2 | 1 | P | WAY is printed, and "real" is padding. |
| 57 | d12 | WARFARE | charade | Fighting's price is endless conflict (7) | 3 | 2 | F | WARFARE ≠ "endless conflict", and "endless" reads like a deletion indicator. |
| 58 | d14 | PASSAGE | container | Corridor where the page keeps his donkey (7) | 4 | 4 | P | Good container with a coherent image. |
| 59 | d26 | GATEMAN | reversal | Luggage label sent back to the porter (7) | 3 | 3 | P | GATEMAN is a dated word and the surface is a bit flat. |
| 60 | e14 | CORRELATE | anagram | Refined cartel ore should tally (9) | 2 | 2 | P | "Refined cartel ore" is invented fodder that no one would write. |
| 61 | e15 | ASCERTAIN | anagram | Shake a canister to find out (9) | 5 | 4 | P | Excellent: the anagram fodder is a natural phrase. Top tier. |
| 62 | e17 | FORECAST | charade | Front company makes a prediction (8) | 4 | 4 | P | Good ("company" = CAST). |
| 63 | e28 | STEALING | hidden | Thieving in West Ealing? (8) | 4 | 4 | P | Good: Ealing is a real place, and the "?" is earned. |
| 64 | e30 | STARLING | hidden | Bird in superstar lingo (8) | 2 | 2 | P | "superstar lingo" is not a real phrase. |
| 65 | e37 | STRESSED | reversal | Tense when puddings are sent back (8) | 3 | 2 | P | Chestnut. STRESSED/DESSERTS appears three times across the bank and teaching corpus. |
| 66 | f5 | UNDERRATED | anagram | Ad returned in error is not appreciated (10) | 4 | 4 | P | Good ("Ad returned" as fodder, "in error" as indicator). |
| 67 | f7 | BARGAINING | anagram | Haggling shattered an aging brain (10) | 3 | 3 | P | Uses the American spelling "aging", and "an" is padding. |
| 68 | f17 | CONSIDERATION | anagram | Icons rationed out of regard for others (13) | 4 | 4 | P | Good: "out of" serves as the indicator and the surface is natural. |
| 69 | f19 | THOUGHTLESSLY | anagram | They danced a ghostly hustle, without care (13) | 3 | 3 | P | "They… a" is padding. |
| 70 | g4 | VILE | lit | Terribly evil (4) | 4 | 2 | P | This is the textbook example clue ("Terribly evil" → VILE). Fine for teaching, but known to every solver. |
| 71 | g5 | ASTRONOMERS | anagram | No more stars, sadly, for stargazers (11) | 4 | 3 | P | Close to the classic "moon starers" chestnut. |
| 72 | h8 | GOAT | anagram | A toga, oddly draped on the kid's parent (4) | 3 | 3 | P? | "oddly" also reads as an alternation indicator (ambiguous), and "draped" is decorative. |
| 73 | h33 | CHASM | hidden | They had to ditch a small dinghy in the gulf (5) | 4 | 4 | P | Good image. Economy flag: "They had to" and "dinghy" are decorative. |
| 74 | h50 | DRAGON | container | Don holding a tabloid is a monster (6) | 4 | 4 | P | Good: "Don" = university don. |
| 75 | h56 | CAPTAIN | anagram | Skipper entangled in a pact (7) | 4 | 4 | P | Good: the fodder "in a pact" is cleverly found. |
| 76 | h57 | GRANITE | anagram | Tearing up hard rock (7) | 4 | 4 | P | Good: "Tearing up" pulls the solver the wrong way. |
| 77 | h62 | PADDOCK | charade | Quarters by the dock, next to a field (7) | 2 | 2 | P | DOCK is printed and "next" is padding. |
| 78 | h79 | MILESTONE | charade | Distance marker shows a significant point (9) | 3 | 2 | P | Both "pieces" just restate the definition: a distance marker IS a milestone. |
| 79 | h81 | CROCODILE | double-definition | Snapper, or schoolchildren two by two? (9) | 4 | 4 | P | Good British flavour (a "crocodile" of schoolchildren). |
| 80 | i2 | KNEE | hidden | Some drunk needs a joint (4) | 5 | 4 | P | Excellent. Top tier. |
| 81 | i7 | MOAT | hidden | A limo at the gates skirts the castle's defence (4) | 3 | 3 | P? | "skirts" means going round the outside, which is the wrong sense for a hidden word. |
| 82 | i12 | MEND | lit | Initially make every nick disappear? (4) | 4 | 4 | P | Good &lit-style initials clue. |
| 83 | i15 | OCEAN | anagram | Canoe wrecked at sea (5) | 4 | 3 | P? | The definition "at sea" ≠ OCEAN (wrong part of speech). |
| 84 | i21 | DREAM | anagram | Armed rebels nurse an ambition (5) | 5 | 4 | P | Excellent: "rebels" serves as the anagram indicator. Top tier. |
| 85 | i28 | BREAD | charade | Bachelor devoured the dough (5) | 4 | 4 | P | Good: dough = money, and devoured = READ. |
| 86 | i69 | WORKSHEET | charade | Operate the mainsail for the class exercise (9) | 3 | 2 | F | A sheet is the rope that controls a sail, not the mainsail, and the clue's own parse admits it. |
| 87 | j4 | TEA | cryptic-definition | What's a drink in London is dinner in Leeds? (3) | 5 | 4 | P | Excellent British class and regional joke. Top tier. |
| 88 | j5 | MAP | cryptic-definition | It shows you where to get off? (3) | 2 | 1 | P | Not cryptic: the "?" is decoration. |
| 89 | j14 | ARC | cryptic-definition | The path of everything you throw? (3) | 2 | 1 | P | A straight definition with a "?". |
| 90 | j16 | COD | cryptic-definition | Often battered, sometimes mocked? (3) | 4 | 4 | P | Good: battered fish, and "cod" meaning mock. |
| 91 | j29 | SAND | cryptic-definition | What runs out in an hourglass? (4) | 2 | 1 | P | A straight definition. |
| 92 | j42 | MAPLE | cryptic-definition | Tree whose leaf Canada flies? (5) | 2 | 1 | P | Trivia, not a cryptic clue. |
| 93 | j43 | CEDAR | anagram | Raced wildly round the tree (5) | 3 | 2 | F | "round" does nothing in the parse. |
| 94 | j47 | PIANO | double-definition | Quietly grand? (5) | 4 | 5 | P | Excellent: both meanings fit "grand". Top tier. |


### 2a. Sample statistics

| Subset | n | Mean surface | Mean wit | FAIL | P? | Surface ≥ 4 | Surface ≤ 2 | Meets house bar |
|---|---|---|---|---|---|---|---|---|
| All 94 bank | 94 | 3.05 | 2.51 | 15 | 4 | 34 | 33 | 29 |
| 30 weakest (★) | 30 | 2.43 | 1.67 | 9 | 0 | 3 | 20 | 0 |
| 64 stratified | 64 | 3.34 | 2.91 | 6 | 4 | 31 | 13 | 29 |
| 15 teaching | 15 | 3.13 | 2.67 | 2 | 1 | 5 | 3 | 5 |

### 2b. Rewrites for every sampled clue with surface ≤ 3

These are **editor's proposals**. They are letter-checked by hand, and every word has a cryptic job. None has been run through `scripts/validate-clue.ts` or the clue-writer skill's blind panel, and the owner's standing rule is that shipped clues go through that skill. Treat these as strong first drafts for that pass, not as patches. Estimated surface/wit is my own grade.

| # | Answer | Shipped surface | Proposed rewrite | Parse | Est. surf/wit |
|---|---|---|---|---|---|
| 1 | GENERAL | A wildly enlarged map guided the commander (7) | **Commander in the field? Gleaner, possibly (7)** | (GLEANER)* "possibly" = GENERAL; "in the field" means farmland on the surface, battlefield in the definition. | 4/4 |
| 2 | DETAIL | Pupils dilate oddly at one fine point (6) | **Fine point tailed off (6)** | (TAILED)* "off" = DETAIL, a fine point. A pencil point tailing off is the surface picture. | 4/3 |
| 3 | ORGAN | Members groan, upset at the party paper (5) | **Upset groan from a Wurlitzer? (5)** | (GROAN)* "upset" = ORGAN; a Wurlitzer is an example of one, hence the "?". | 4/3 |
| 4 | HARM | A hard limb can do damage (4) | **Hurt husband's limb (4)** | H (husband) + ARM (limb) = HARM, hurt. | 4/3 |
| 5 | BLASTED | Damned horse stabled awkwardly (7) | **Damned bachelor endured (7)** | B (bachelor) + LASTED (endured) = BLASTED, damned. | 3/3 |
| 6 | CHARITY | The cleaner had it all year, doing good works (7) | **It begins at home (7)** | Cryptic definition from the proverb "charity begins at home". A charade with a sound surface was not found. | 5/4 |
| 7 | MUSHROOM | Sentimental mush fills the room, like a fungus (8) | **Sentimental drivel gets space to grow fast (8)** | MUSH (sentimental drivel) + ROOM (space) = MUSHROOM, to grow fast. | 4/3 |
| 8 | COB | Swan gliding past disco bar (3) | **Swan spotted in Monaco Bay (3)** | Hidden in "monaCO Bay"; a cob is a male swan. | 5/3 |
| 9 | OVERNIGHT | Play over, night fell, so we stayed till dawn (9) | **Finished close to time, all of a sudden (9)** | OVER (finished) + NIGH (close) + T (time) = OVERNIGHT, all of a sudden. | 4/3 |
| 10 | OUTLOOK | Once out, look at what lies ahead (7) | **Dismissed, watch the view (7)** | OUT (dismissed, as in cricket) + LOOK (watch) = OUTLOOK, the view. | 3/3 |
| 11 | OFFSHORE | Gone off near the shore, now out at sea (8) | **Rotten prop out at sea (8)** | OFF (rotten) + SHORE (a prop) = OFFSHORE, out at sea. | 3/3 |
| 12 | STARLET | The star let her flat to a budding actress (7) | **Lead allowed for budding actress (7)** | STAR (lead) + LET (allowed) = STARLET. | 4/3 |
| 13 | OVERBOARD | Finished with the board, he leapt into the sea (9) | **Finished food goes into the drink (9)** | OVER (finished) + BOARD (food, as in bed and board) = OVERBOARD, into the drink. "Food" and "drink" pull the solver the wrong way. | 4/4 |
| 14 | CARTRIDGE | Push the cart up the ridge for a refill (9) | **Haul to the crest for one round (9)** | CART (haul) + RIDGE (crest) = CARTRIDGE, one round of ammunition. | 3/3 |
| 15 | UNDERSTANDING | Beneath your standing lies sympathy (13) | **Informal deal is beneath reputation (13)** | UNDER (beneath) + STANDING (reputation) = UNDERSTANDING, an informal deal. | 4/3 |
| 16 | NIGHTMARES | After dark, the mares of our worst dreams (10) | **Bad dreams of dark horses? (10)** | NIGHT (dark) + MARES (horses; the "?" flags that only female horses qualify) = NIGHTMARES, bad dreams. | 4/4 |
| 17 | NEWSPAPER | The latest on paper makes the daily (9) | **Latest wall-covering? The Times, perhaps (9)** | NEWS (latest) + PAPER (wall-covering) = NEWSPAPER; The Times is an example. | 4/4 |
| 18 | CHAMPION | Support the champ taking one on (8) | **Back winner (8)** | Double definition: to champion is to back, and a champion is a winner. The surface has a betting flavour. | 4/4 |
| 19 | SNAPSHOT | Break for a quick shot, and there's your photo (8) | **Crack attempt gives a quick picture (8)** | SNAP (crack) + SHOT (attempt) = SNAPSHOT. | 3/3 |
| 20 | EARNED | Pulled in when the end erratically neared (6) | **Won as Dean upset Queen (6)** | (DEAN + ER)* "upset" = EARNED, won. "Upset" doubles as a sports result. Note that the indicator sits between the two pieces of fodder. | 4/4 |
| 21 | ASTRONOMY | An artsy moon, badly sketched, hints at the study of stars (9) | **Stray moon disturbed stargazers' science (9)** | (STRAY MOON)* "disturbed" = ASTRONOMY. "Stray" itself looks like an anagram indicator, which misleads. | 4/4 |
| 22 | STRAW | What you sip through, the last of it breaking the camel's back (5) | **It finally broke the camel's back (5)** | Cryptic definition: the last STRAW. "Finally" points to "last". | 5/4 |
| 23 | WHERE | You wear it, we hear — but in what place? (5) | **Wife present? In what place? (5)** | W (wife) + HERE (present) = WHERE, in what place. | 4/3 |
| 24 | EARLOBE | Wear lobelias and you cover a bit of the ear (7) | **Peer gets honour where a stud might go (7)** | EARL (peer) + OBE (honour) = EARLOBE. "Stud" suggests a horse before an earring. | 4/4 |
| 25 | DELIVER | Reviled at first, he turned it around to save the day (7) | **Hand over the sandwich shop, very nearly (7)** | DELI (sandwich shop) + VER(y) (very, nearly) = DELIVER, hand over. This adds a deletion, a device the bank badly lacks. | 3/4 |
| 26 | STARTLED | Beginning to be led, the colt took fright (8) | **Son rattled, upset and alarmed (8)** | (S + RATTLED)* "upset" = STARTLED, alarmed. "Rattled" looks like the definition. | 4/4 |
| 27 | MONARCH | Butterfly seen by man on arch? (7) | **Sovereign with wings? (7)** | Double definition: a sovereign is a MONARCH, and so is a butterfly. "Sovereign" can also mean a coin. | 4/4 |
| 28 | GRANDMOTHERLY | Inclined to spoil you rotten between rounds of knitting? (13) | **Indulgent, like a thousand mums? (13)** | GRAND (thousand) + MOTHERLY (like mums) = GRANDMOTHERLY, indulgent. | 4/4 |
| 29 | ENTERTAINMENT | What keeps an audience coming back for more? (13) | **Diversion not for motorists? (13)** | Cryptic definition: entertainment is a diversion, though not the roadworks kind. | 4/4 |
| 30 | WONDER | She wonders endlessly, lost in awe (6) | **Succeeded with the German marvel (6)** | WON (succeeded) + DER (the, in German) = WONDER, marvel. To keep a deletion in the bank, see the DELIVER rewrite. | 4/3 |
| 31 | EAR | It catches a whisper and grows on a cob (3) | **Organ found in the heart (3)** | Hidden in "hEARt". "Organ" and "heart" make the solver think of anatomy. | 5/4 |
| 32 | BAT | Flier in acrobatics (3) | **Club concealed in combat (3)** | Hidden in "comBAT"; a bat is a club. | 4/3 |
| 33 | PEN | Writer kept in a sheep enclosure (3) | **Swan's quill? (3)** | Double definition: a pen is a female swan (the "?" covers the example), and a quill is a pen. | 4/4 |
| 34 | GOD | Deity a dog rolls over for (3) | **Dog rolls over for the Lord (3)** | DOG reversed ("rolls over") = GOD. On the surface, the lord is the dog's master. | 4/4 |
| 35 | TIP | Pointer rising from the pit (3) | **Point back at the pit (3)** | PIT reversed ("back") = TIP, a point. | 4/3 |
| 36 | CAR | Old banger lurking in Madagascar (3) | **Motor parked in Oscar's (3)** | Hidden in "osCAR's"; "parked in" is the indicator. | 4/4 |
| 37 | AGE | A generation can be read in any vintage (3) | **Grow old in a cage (3)** | Hidden in "cAGE"; to age is to grow old. | 4/3 |
| 38 | LIME | Citrus tree? (4) | **Fruit in a bowl I mended (4)** | Hidden in "bowL I MEnded". | 4/4 |
| 39 | WIND | Coil tightened in the gale (4) | **Meander with the breeze (4)** | Double definition: to wind is to meander; the wind is the breeze. | 4/3 |
| 40 | STEAM | Small side built up a head of pressure (5) | **Small side gains momentum (5)** | S (small) + TEAM (side) = STEAM, momentum. Reads like a real sports report. | 5/3 |
| 41 | ALERT | Later, he was drunk but still sharp (5) | **On the ball, later drunk (5)** | (LATER)* "drunk" = ALERT, on the ball. | 4/4 |
| 42 | CATER | A smashed crate won't stop us providing the food (5) | **Feed the pet queen (5)** | CAT (pet) + ER (queen) = CATER. A queen is also a female cat. | 4/4 |
| 43 | TENOR | Net returned gold for the singer (5) | **Voice in a rotten orchestra (5)** | Hidden in "rotTEN ORchestra"; a tenor is a voice. | 5/4 |
| 44 | REGAL | Beer sent back, befitting a queen (5) | **Stately part of a rare gallery (5)** | Hidden in "raRE GALlery"; regal = stately. | 4/3 |
| 45 | HATRED | Loathing runs through it like a frayed thread (6) | **Abhorrence of top communist (6)** | HAT (top) + RED (communist) = HATRED. | 4/3 |
| 46 | HEADWAY | Lead the way to make real progress (7) | **Chief route to progress (7)** | HEAD (chief) + WAY (route) = HEADWAY, progress. | 4/3 |
| 47 | WARFARE | Fighting's price is endless conflict (7) | **Conflict and food lead to hostilities (7)** | WAR (conflict) + FARE (food) = WARFARE, hostilities. | 4/3 |
| 48 | GATEMAN | Luggage label sent back to the porter (7) | **Porter's name tag turned over (7)** | NAMETAG reversed ("turned over") = GATEMAN, a porter. | 4/3 |
| 49 | CORRELATE | Refined cartel ore should tally (9) | **Blimey! Recount? That should tally (9)** | COR (blimey) + RELATE (recount) = CORRELATE, tally. Economy flag: "That should" is a link phrase. | 4/3 |
| 50 | STARLING | Bird in superstar lingo (8) | **Garden bird broke last ring (8)** | (LAST RING)* "broke" = STARLING. | 3/3 |
| 51 | STRESSED | Tense when puddings are sent back (8) | **Accented and tense (8)** | Double definition: stressed means accented and also tense. Grammar terms mislead. | 4/4 |
| 52 | BARGAINING | Haggling shattered an aging brain (10) | **Haggling, banging air furiously (10)** | (BANGING AIR)* "furiously" = BARGAINING. | 4/3 |
| 53 | THOUGHTLESSLY | They danced a ghostly hustle, without care (13) | **Ghostly hustle danced carelessly (13)** | (GHOSTLY HUSTLE)* "danced" = THOUGHTLESSLY, carelessly. | 3/3 |
| 54 | GOAT | A toga, oddly draped on the kid's parent (4) | **Billy's toga in tatters? (4)** | (TOGA)* "in tatters" = GOAT; a billy is an example, hence the "?". | 4/4 |
| 55 | PADDOCK | Quarters by the dock, next to a field (7) | **Digs by the quay with small field (7)** | PAD (digs) + DOCK (quay) = PADDOCK, a small field. Reads like an estate agent's listing. | 4/3 |
| 56 | MILESTONE | Distance marker shows a significant point (9) | **Limestone carved as a landmark (9)** | (LIMESTONE)* "carved" = MILESTONE. Milestones are carved stone, so the surface is literally true. | 5/4 |
| 57 | MOAT | A limo at the gates skirts the castle's defence (4) | **A limo at the gates hides the castle's defence (4)** | Hidden in "liMO AT". | 4/3 |
| 58 | OCEAN | Canoe wrecked at sea (5) | **Canoe capsized in the deep (5)** | (CANOE)* "capsized" = OCEAN, the deep ("in" is a permissive link). | 5/3 |
| 59 | WORKSHEET | Operate the mainsail for the class exercise (9) | **Job paper handed out in class (9)** | WORK (job) + SHEET (paper) = WORKSHEET. This is still only a 3 and needs a clue-writer pass. | 3/2 |
| 60 | MAP | It shows you where to get off? (3) | **Plan an atlas page (3)** | Double definition: to map is to plan, and a map is an atlas page. | 4/3 |
| 61 | ARC | The path of everything you throw? (3) | **Bow of Noah's vessel, we hear (3)** | ARK sounds like ARC (a bow). "Bow" on the surface means the front of a ship. | 5/4 |
| 62 | SAND | What runs out in an hourglass? (4) | **Smooth beach (4)** | Double definition: to sand is to smooth; sand is a beach. | 4/3 |
| 63 | MAPLE | Tree whose leaf Canada flies? (5) | **Tree's ample spread (5)** | (AMPLE)* "spread" = MAPLE. On the surface it describes a tree's canopy. | 5/4 |
| 64 | CEDAR | Raced wildly round the tree (5) | **Tree in Venice darkened (5)** | Hidden in "veniCE DARkened". | 4/3 |


---

## 3. Systemic patterns (whole bank, quantified)

### 3.1 The device mix is skewed away from the broadsheet core

| Device | Cruci count | Cruci % | Typical broadsheet daily (editor's rule of thumb, ~30 clues) | Guardian Quick Cryptics fetched (#103 + #119, 44 clues) |
|---|---|---|---|---|
| Anagram (whole) | 109 | 26% | 15–25% | 11 (25%) |
| Charade | 75 | 18% | 25–35% | 0 |
| **Hidden** | **66** | **16%** | 3–7% (one, maybe two, per puzzle) | 11 (25%) |
| **Double definition** | **75** | **18%** | 5–10% | 6 (14%) |
| **Cryptic definition** | **52** | **12.5%** | 0–7% | 0 |
| **Container/insertion** | **13** | **3%** | 15–20% | 0 |
| Reversal | 13 | 3% | 5–8% | 0 |
| Homophone | 9 | 2% | 3–7% | 5 (11%) |
| **Deletion/subtraction** | **1** | **0.2%** | 5–10% | 0 |
| **Initialism/acrostic** | **0** | **0%** | 2–5% | 11 (25%) |
| Alternation | 0 | 0% | 0–3% | 0 |
| &lit | 2 | 0.5% | 0–3% | 0 |

- **Containers are the backbone of the broadsheet cryptic, and Cruci has 13.** A solver who graduates from Cruci to the Times will meet insertion in roughly every fifth clue, yet Cruci has barely trained them for it. Two of the 13 are themselves weak (SECRET's "breaks up"; MINISTER's "sees"). Adding containers is the highest-value correction to the mix.
- **One deletion in 415 clues**, and that one (WONDER) prints the answer. This despite the style guide's §5 template, and a teaching corpus that teaches the device five times.
- **Zero acrostics.** The two Guardian Quick Cryptics I fetched used 11 acrostics between them, and setters treat acrostics as the gentlest on-ramp device for learners. MEND is the only initials clue, and it is filed as &lit.
- **The 46% that is hidden + double definition + cryptic definition** is the cheapest material to generate. Per clue it also teaches a learner the least about parsing.
- **Hiddens:** the bank's 16% is actually *lower* than the 25% in the two Quick Cryptics I fetched, so for a trainer this share is in line with QC practice. The real gap is against the main puzzles a graduate moves on to, and against QC's other staples: acrostics (25% in those QCs, 0% here) and homophones (11% vs 2%). Within the class, 19 of 66 hide the answer inside a single word ("Flier in acrobatics", "Old banger lurking in Madagascar", "Devastation conceals one's position"). Published Quick Cryptics also do this (HOW in "shows", SIR in "desired"), so it isn't a fault in itself, but 29% of a 16%-sized device class is too many. Indicators are monotonous: "in" ×17, "some"/"some of" ×16, and **15 clues begin with the word "Some"**. Three indicators are invalid or wrong-sense: "past" (COB), "skirts" (MOAT), "crossing" (MEADOW).

### 3.2 Padding: the single-orphan loophole

A heuristic scan (any surface word not inside the definition, indicator, fodder, an operation's input, or a short list of link words) hit 141 clues. Checking each by hand leaves **71 clues (17%) with at least one decorative word**. The recurring templates:

- **"…, he was / she still / they still managed to / won't stop us…"** pads a plain anagram into a story. Examples: ALERT "Later, *he was* drunk but *still* sharp"; DESPAIR "Praised, strangely, *he was full of* gloom"; BRIGHTEN "Berthing clumsily, *they still managed to* cheer up"; SMILE "Miles off, *she still gave* a beam"; CATER "A smashed crate *won't stop us* providing the food"; SPEAR "A broken spare *can still serve as* a weapon"; CANTER "Broken from *his* trance, *he found* a gentle run". There are 6 instances of "still" and 2 of "can still".
- **"When [fodder] [indicator], [they/each/I]…":** NEUTRAL, RESIDENT, STREAMING, ELEPHANT. Four clues, the same template.
- **A noun added to make an anagram plausible:** "Damned *horse* stabled", "Enraged *soldier* hurls", "*Members* groan", "*Pupils* dilate", "The beagle's *master*", "Wife in searing *pain*", "Raced wildly *round*". These are the dangerous ones, because the stray noun *looks* like wordplay material.
- **Missing letter accounting:** HARM ("A hard"), GENERAL ("enlarged" supplies ENLARGE + D).

**Root cause.** §6 of the style guide lets "even a single decorative word" through as a lint warning only. The realism judges then score the padded sentence *higher*, because padding is what makes it read naturally. Recommendation: **make single orphans a hard failure**, unless the word is on an explicit allow-list of link words, plus articles in front of a definition.

### 3.3 Lift-and-separate charades

31 of the 75 charades print one or more ≥3-letter pieces verbatim:

> TENOR[net+gold-as-OR] · CHARM[arm] · SACRED[red] · REPAID[rep+aid] · CRAVING[raving] · FORWARD[ward] · HEADWAY[way] · OUTLOOK[out+look] · STARLET[star+let] · OVERBOARD[board] · STARTLED[led] · OVERNIGHT[over+night] · OVERHEAD[head] · NIGHTMARES[mares] · DEPARTMENT[men] · UNDERSTANDING[standing] · SPINE[pine] · GARNET[anger] · MARGIN[gin] · PADDOCK[dock] · SNAPSHOT[shot] · OFFSHORE[off+shore] · CARTRIDGE[cart+ridge] · GHOST[host] · MONARCH[on+arch] · OUTLINE[out+line] · MUSHROOM[mush+room] · CHAMPION[champ+on] · NEWSPAPER[paper] · DISCOVERY[disco] · HILL[ill]

A short lifted piece in a long answer is acceptable (SPINE, GHOST, HILL are fine). The **compound-word answers** are the problem: OVER-, OUT-, OFF-, STAR-, NIGHT-, -HEAD, -PAPER. The setter split the word at its natural seam and printed both halves. A broadsheet editor would send all of these back. The fix is mechanical: never split a compound at its morpheme boundary; disguise both halves (OFF→"rotten", SHORE→"prop") or change device (MILESTONE→an anagram of LIMESTONE).

### 3.4 Cryptic-definition drift and the "?" habit

- **75 clues (18%) end in "?"**: 52 cryptic definitions, 17 double definitions, plus a few others. Part **j is 33/49 cryptic definitions**, every one 3–5 letters, every one ending in "?". It reads like a riddle book, not a cryptic.
- About **16 cryptic definitions are plain definitions with a question mark** and no second meaning: MAP "It shows you where to get off?", ARC "The path of everything you throw?", SAND "What runs out in an hourglass?", MAPLE "Tree whose leaf Canada flies?", DEW, FOG, SKY, GEM, OAK, MOON, NAIL, TIGER, HERON, ENTERTAINMENT, GRANDMOTHERLY, STOCKBROKER. A cryptic definition must have a false trail (as in the Times favourite "Bust down reason?" for BRAINWASH). If the "?" can be deleted with no loss, the clue is a quiz question.
- **Opening templates:** "What…?" ×10 and "It…?" ×10 among the cryptic definitions.

### 3.5 Double definitions that are glued, not abutted

31 of the 75 double definitions put a link word between the halves. Some are standard and fine ("Gift for those in attendance"). About **12 are surface-only padding**: PEN "Writer *kept in a* sheep enclosure", STAR "Asterisk *beside the* leading actor", WIND "Coil *tightened in the* gale", SWAN "Drift gracefully *like a* bird *on the lake*", SAGE "Herb *that's* wise *and old*", SHOULDER "…*where a soldier rests his rifle*", CRICKET "…*that plays a long innings*", PADDLE "…*for an* oar", RETREAT "…*to a quiet*…", HAMPER "…*can be*…". The house rule (§5) says the two halves abut. Several double definitions are also weak because their two senses overlap: LIME "Citrus tree?" (the citrus lime *is* a tree); HAMPER followed straight after by BASKET "Hamper a slam dunk?" reuses the same hamper/basket pairing.

### 3.6 Definitions that are loose or wrong

| Clue | Problem |
|---|---|
| STEAM "…a head of pressure" | Steam ≠ head of pressure. |
| WARFARE "…endless conflict" | Warfare ≠ endless conflict, and "endless" reads as a deletion indicator. |
| WORKSHEET "Operate the mainsail" | A sheet is a rope, not a sail; the clue's own parse says so. |
| OCEAN "…at sea" | Wrong part of speech. |
| CAR "Old banger" | Definition by example, unflagged. |
| EAR "…grows on a cob" | Botanically backwards. |
| PADDLE "…for an oar" | A paddle is not an oar. |
| MINISTER "The vicar" | A vicar is an example of a minister (hyponym), unflagged. |
| ISLAND "Isle" | Near-identical word: no disguise. |
| EARLOBE "a bit of the ear" | The definition contains part of the answer. |

**Generic hypernym definitions** ("bird", "tree", "fruit", "gem", "flower", "herb", "plant") appear in about 22 clues, and **35 clues end with "the X" as the definition**. Neither breaks a rule, but together they make the bank feel samey and transparent. Broadsheet setters reach for the oblique definition ("Flier", "Runner", "Banker" = river).

### 3.7 Chestnuts and internal repetition

- **Chestnuts** that any regular solver has seen many times: REGAL/lager returned; STRESSED/DESSERTS (**three times** across bank and teaching corpus, plus DESSERT); VILE "Terribly evil"; ASTRONOMERS "no more stars"; CONVERSATION/conservation; TREASON/senator (twice); LISTEN/SILENT (bank ×2 plus teaching); EARTH/heart; ORCHESTRA/cart horse; REWARD/drawer (twice); CARPET "Pile on the floor?"; THAMES "Flower of London?"; ANAESTHETIC "Number…". That is about 15. A handful are fine in a teaching context (they are the canon), but the bank should not re-use teaching fodder.
- **Bank/teaching overlap:** 15 answers appear in both (ASHEN, TREASON, LISTEN, MEAN, DANGER, FLAME, PLANET, REWARD, DESSERTS, STAR, SCAR, OVEN, LIGHT, STERN, CANDLE). About 8 of these use **the same fodder or mechanism**, so the learner meets the identical trick twice.
- **Answer families crowd the archive:** EAR-words ×14 (EAR, HEAR, SPEAR, EARTH, DEARTH, EARNED, EARNEST, EARRING, EARLOBE, EARNING, SPEARMINT, SWEARING, SHEARING, NEAR); STAR- ×5; OVER- ×5; CARP- ×4; plus pairs DESSERT/S, STRANGE/R, PAINT/ERS, CRAVE/ING, REACT/ION, RELATION/SHIP, BATTER/Y, DANGER/OUS. Each family breeds the same split ("star + …", "over + …").

### 3.8 Register

- **British register is a real strength:** pinta, chippy, Old Nick, banger, mild, a crocodile of schoolchildren, tea-as-dinner in Leeds, A level. Keep it.
- **Americanisms are few:** "aging" (BARGAINING), "slam dunk" (BASKET), college-wall ivy (IVY, Ivy League). Swap the first one.
- **"The Queen" = ER in the present tense** (TENDER "Mind the Queen", TROOPER, plus REGAL "befitting a queen") is dated since 2022. Editors increasingly prefer an explicit past-tense cue ("old queen", "Elizabeth") or the King.
- **Direction-dependent indicators in a bank with no grid:** TIP "rising", REWARD "turned up". The Daily serves single clues with no Across/Down, so these indicators have no anchor.

### 3.9 Difficulty is compressed

272 of 415 clues are difficulty 3, 16 are difficulty 4, and none are difficulty 5. Multi-step constructions (container plus abbreviation, a charade with an internal reversal) are nearly absent. The bank has no main-cryptic tail for the improver who is "ready for full puzzles" (the par rubric's stated goal). This follows directly from §3.1: you cannot build hard clues out of hiddens and double definitions.

### 3.10 Pipeline lesson

All of the above shipped after a writer → mechanical gate → blind realism judges → broadsheet-ceiling-panel pipeline. The pattern of failures shows what that pipeline rewards: **a sentence that reads naturally**, which the writer could buy cheaply with orphan words, printed compounds, or a "?" on a plain definition. Recommended hard gates, all scriptable:

1. A single orphan word fails, with an allow-list for links.
2. A charade piece of ≥3 letters printed verbatim in the clue fails, unless the answer has ≥9 letters and the piece is ≤⅓ of it.
3. Device quotas per 100 clues: containers ≥12, deletions ≥5, acrostics ≥3, hiddens ≤8, cryptic definitions ≤6, double definitions ≤10.
4. A cryptic definition must state its false trail in the parse ("surface suggests X, really Y"); otherwise it fails.
5. Block chestnut fodder: the bank must not re-use teaching-corpus answers or fodder.
6. No reversal indicators that depend on grid direction.

---

## 4. Benchmark: published clues vs Cruci

**Published comparators** (all fetched this session; parses as blogged):

| Device | Published clue | Answer | Source |
|---|---|---|---|
| Hidden | *Fictional detective hiding in hellebore bush* (5) | REBUS | Guardian Quick Cryptic 119 (Garson) |
| Hidden | *Somewhat dread erstwhile bookworms* (7) | READERS | Guardian Quick Cryptic 103 (Ludwig); commenters' favourite for its surface |
| Anagram | *Yemen, unlikely adversary* (5) | ENEMY | Guardian Quick Cryptic 103; praised for its indicator and surface |
| Anagram | *Tipsy nun duet is discordant* (7) | UNTUNED | Guardian Quick Cryptic 119 |
| Acrostic | *Flick finger in lewd men's faces* (4) | FILM | Guardian Quick Cryptic 119 |
| Homophone | *We're told more than one large landmass causes fascination* (8) | BEGUILES | Guardian Quick Cryptic 103; commenters' favourite |
| Double def. | *Confiscate jam* (5) / *Sock receptacle* (3) | SEIZE / BOX | Guardian Quick Cryptic 119 |
| Container | *Confined by traffic bollard, one reversed to carry on* (8) | CONTINUE | Times 29046 |
| Container | *Put criminal in custody* (7) | CAPTURE | Loroso (Anax), cited by David Astle |
| Deletion | *First of autumn leaves turning putrid* (7) | ROTTING | Henry Hook, cited by David Astle |
| Cryptic def. | *Bust down reason?* (9) | BRAINWASH | contest winner, cited by David Astle |
| Anagram (&lit-ish) | *Maybe brief jibe spin doctor spun* (3,11) | JOB DESCRIPTION | Times 29046 |

**How Cruci compares**

- **Cruci's best ≈ Quick Cryptic favourites.** KNEE *Some drunk needs a joint*, ASCERTAIN *Shake a canister to find out*, MARKET *A fair part of Denmark, etc.*, DREAM *Armed rebels nurse an ambition*, NET *What's left when ten's knocked over*, CAPTAIN *Skipper entangled in a pact*, PIANO *Quietly grand?* and TEA *What's a drink in London is dinner in Leeds?* would all sit comfortably next to READERS, ENEMY and BEGUILES. MARKET and PIANO would draw "COD" nominations on a Quick Cryptic blog. **About 40 clues are at this level.**
- **Cruci's median is below the Quick Cryptic median.** The published QC clues are **terse**: 4–6 words, no word idle ("Confiscate jam", "Sock receptacle", "Tipsy nun duet is discordant"). A typical Cruci clue runs 5.9 words, and the extra word is usually padding ("A broken spare *can still serve as* a weapon", "Some optimist's morning haze"). Equivalent QC clues would be "Spare broken weapon" or "Optimist's partly hazy" style: shorter, and better for it. Cruci's competent band would pass a QC editor with cuts. Its weak band would not pass.
- **Cruci has no answer to the Times container.** CONTINUE (reversal inside a container) and CAPTURE (anagram inside a container, &lit-flavoured) are routine Times machinery. The bank contains no construction of that type, and that is the gap a learner hits when moving from Cruci to a daily broadsheet.
- **Cruci's cryptic definitions lack the false trail.** BRAINWASH works because "bust down reason" first reads as a pub or police scene. A third of Cruci's cryptic definitions (MAP, ARC, SAND, MAPLE…) have no second scene at all.
- **Acrostics and homophones**, the devices the Guardian leans on for learners, are almost missing from Cruci (0 and 9 respectively).

Sources: [Guardian Quick Cryptic #119 by Garson (Fifteensquared)](https://fifteensquared.net/2026/07/11/guardian-quick-cryptic-119-by-garson/) · [Guardian Quick Cryptic 103 by Ludwig (Fifteensquared)](https://fifteensquared.net/2026/03/21/guardian-quick-cryptic-103-by-ludwig/) · [Times Cryptic 29046 (Times for the Times)](https://timesforthetimes.co.uk/times-cryptic-29046-saturday-12-october-2024-egged-on-or-egg-on-face) · [David Astle, "Fond clues"](https://davidastle.com/da-blog/fond-clues)

---

## 5. Teaching corpus (15 of 44 sampled)

| # | Answer | Device | Clue | Surf | Wit | Fair | Note | Rewrite (parse) |
|---|---|---|---|---|---|---|---|---|
| 1 | SCARE | hidden | This career conceals real fright (5) | 3 | 3 | P | "real" is padding. | **Fright his career concealed (5)** — Hidden in "hiS CAREer". |
| 2 | EVENT | hidden | Seven tents partly cover the event (5) | 2 | 1 | F | The definition "the event" IS the answer word, printed in the clue. | **Occasion that seven tents partly cover (5)** — Hidden in "sEVEN Tents"; event = occasion. |
| 3 | HEART | hidden | Core buried in the article (5) | 3 | 3 | P | Fine for teaching but flat. | **Love hidden in the artwork (5)** — Hidden in "tHE ARTwork". |
| 4 | MEAN | anagram | Cruel name changed (4) | 3 | 3 | P | Terse and fair, though there is little image. | — |
| 5 | SECTION | anagram | Notices arranged across the division (7) | 3 | 2 | P | "across" is padding, and in a puzzle it looks like a grid direction. | **Department notices are reshuffled (7)** — (NOTICES)* "reshuffled" = SECTION, a department. |
| 6 | BARGAIN | charade | Pub profit is a steal (7) | 4 | 4 | P | Excellent beginner clue. | — |
| 7 | JACKPOT | charade | Lift the kitty for a windfall (7) | 4 | 3 | P | Good. | — |
| 8 | PADLOCK | charade | Apartment's key feature is a security device (7) | 3 | 2 | F | "key feature" is not a synonym for LOCK, and the parse admits it is a pun. | **Secure flat with fastener (7)** — PAD (flat) + LOCK (fastener) = PADLOCK, to secure. |
| 9 | CARTON | container | The con hides art in a box (6) | 2 | 2 | P | CON and ART are both printed, so the answer is spelt out in plain sight. This breaks the house §1c rule 1. | **Prisoner hides skill in a box (6)** — CON (prisoner) around ART (skill) = CARTON. |
| 10 | PIRATE | container | Rat tucked into the pie for a buccaneer (6) | 3 | 2 | P | RAT and PIE are both printed. | **Informer baked in pastry is a buccaneer (6)** — RAT (informer) inside PIE (pastry) = PIRATE. |
| 11 | LEVER | reversal | Party comes back for a bar (5) | 4 | 3 | P | Good. | — |
| 12 | OVEN | deletion | The coven lost its head over the cooker (4) | 4 | 4 | P | Good: the deletion idiom does double duty. | — |
| 13 | KNIGHT | homophone | We hear a dark period awaits the chess piece (6) | 2 | 2 | P | "awaits" is padding and the surface is stilted. | **Chess piece heard after dark? (6)** — Sounds like NIGHT (after dark, loosely). |
| 14 | SCENT | homophone | Perfume sent over, we hear (5) | 4 | 3 | P | Good surface. | — |
| 15 | CALENDAR | cryptic-def | Where you're bound to find a date? (8) | 3 | 3 | P? | The "bound" pun fits DIARY, not CALENDAR. Teaching answers can be swapped, so swap to DIARY (5). | **Where you're bound to find a date? (5) → DIARY** — Diaries are bound books full of dates. |


The teaching corpus is in better shape than the weak tail of the bank. BARGAIN, DOGMA, HOGWASH, OVEN and ANGER are model beginner clues. Three things need fixing:

1. **EVENT is unsound:** the definition is the answer word itself.
2. **CARTON and PIRATE print their own parts** (CON + ART; RAT + PIE). That breaks the corpus's own §1c rule 1 ("answer and its parts are disguised").
3. **PADLOCK's "key feature" → LOCK is a pun, not a definition.**

---

## 6. The 20 clues that most urgently need rewriting

Ordered by severity: unsound first, then the worst surfaces. Rewrites for all 20 are in §2b, except GRENADE, which is given here.

| # | Answer | Shipped clue | Why it's urgent |
|---|---|---|---|
| 1 | GENERAL | A wildly enlarged map guided the commander (7) | Letters don't account: fodder "enlarged" has a stray D. |
| 2 | DETAIL | Pupils dilate oddly at one fine point (6) | "Pupils" does nothing in the parse. |
| 3 | ORGAN | Members groan, upset at the party paper (5) | "Members" does nothing in the parse. |
| 4 | HARM | A hard limb can do damage (4) | "A" is unaccounted for. |
| 5 | BLASTED | Damned horse stabled awkwardly (7) | "horse" does nothing in the parse. |
| 6 | GRENADE | Enraged soldier hurls explosive (7) | "soldier" does nothing in the parse. Rewrite: **Explosive, enraged, going off (7)**, i.e. (ENRAGED)* "going off"; the surface reads as a temper. |
| 7 | CHARITY | The cleaner had it all year, doing good works (7) | Three words do nothing; the surface is a narrated recipe. |
| 8 | MUSHROOM | Sentimental mush fills the room, like a fungus (8) | "fills" is a false container signal, and both pieces are printed. |
| 9 | COB | Swan gliding past disco bar (3) | "past" is not a hidden indicator. |
| 10 | WONDER | She wonders endlessly, lost in awe (6) | The answer is printed in the clue. |
| 11 | STEAM | Small side built up a head of pressure (5) | Wrong definition, and words that do nothing. |
| 12 | WARFARE | Fighting's price is endless conflict (7) | Wrong definition; "endless" misleads mechanically. |
| 13 | WORKSHEET | Operate the mainsail for the class exercise (9) | Factually wrong synonym (sheet ≠ sail). |
| 14 | EARLOBE | Wear lobelias and you cover a bit of the ear (7) | The definition contains part of the answer; the surface is surreal. |
| 15 | OVERNIGHT | Play over, night fell, so we stayed till dawn (9) | Both halves printed, plus padding. |
| 16 | OUTLOOK | Once out, look at what lies ahead (7) | Whole answer printed. |
| 17 | STARLET | The star let her flat to a budding actress (7) | Whole answer printed. |
| 18 | OFFSHORE | Gone off near the shore, now out at sea (8) | Both halves printed, plus padding. |
| 19 | MONARCH | Butterfly seen by man on arch? (7) | Weak abbreviation (man→M), printed pieces, a decorative "?". |
| 20 | GRANDMOTHERLY | Inclined to spoil you rotten between rounds of knitting? (13) | No cryptic content; stereotype. |

**Next tier** (rewrite in the same pass): TIP and REWARD (direction-dependent indicators); OCEAN (part of speech); CAR (unflagged definition by example); MOAT and MEADOW (wrong-sense indicators); CEDAR, EAGLE and SWEARING (single orphan words); all the remaining printed-compound charades in §3.3; the ~16 "plain definition plus ?" cryptic definitions in §3.4; and the teaching clues EVENT, CARTON, PIRATE and PADLOCK.

---

## 7. Recommendations, in priority order

1. **Fix the ~17 unsound clues now.** §6 items 1–14, plus TIP, REWARD, OCEAN, CAR, MOAT and CEDAR. These are correctness bugs, not taste.
2. **Close the single-orphan loophole in the gate** (§3.2), and **add a lift detector for charade pieces** (§3.3). Both are a few lines in `scripts/validate-clue.ts`. Running them over the bank reproduces the lists above.
3. **Rebalance the devices as the bank grows.** Each new batch of 100 should add about 15 containers, 8 deletions, 5 acrostics and 5 reversals, and no new hiddens, double definitions or cryptic definitions until those classes fall to about 8%, 10% and 6%. Convert roughly 20 of the weakest hiddens and cryptic definitions to containers or deletions in place (the answer is fixed; the device is free).
4. **Retire chestnuts and bank/teaching duplicates.** STRESSED/DESSERTS, REGAL/lager, LISTEN/SILENT, TREASON/senator, REWARD/drawer and PLANET should each appear once at most, and ideally only in the teaching corpus.
5. **Change the realism judges' brief.** Have them read the clue twice: once for the sentence, once *word by word for jobs*. Tell them a natural sentence bought with an idle word scores **lower**, not higher.
6. **Add a difficulty-4/5 tail** (container plus abbreviation, a reversal inside a charade, subtractive anagrams) so the bank can actually deliver "ready for full puzzles".
