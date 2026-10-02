**Cruci’s biggest problem is that it can manufacture confidence more reliably than it manufactures good clues.** The rules, panels and passing tests look reassuring, but they do not yet establish that the published clues are fair, delightful or good teaching material.

The previous audit spotted much of the weak output. It substantially overpraised the mechanical validator, inconsistently applied its fairness standard, and proposed some measures that could reward the wrong things. **I would revise the Bible design before implementing it.**

I inspected the local code and documents, sampled 30 clues reproducibly, and ran checks entirely in memory. No project files were modified. The live site was inaccessible through both available fetch routes, and this session had no browser available; UX findings below are from code, not visual testing.

**What the earlier audit missed or got wrong**

The most consequential omission is that **your source of truth contains incorrect examples**.

In [clue-style.md](E:/SynologyDrive/Projects/Personal/CrypticCrossword/docs/clue-style.md:135):

- The CHAIR “improvement ladder” declares `CHAR + A`. That cannot produce CHAIR.
- Its supposedly good clue, “Cleaning-lady holds a position of authority”, supplies A, where the intended insertion needs I.
- The UNDERMINED example gives `fodder: "ermine deer"`, which does not contain UNDERMINED. The necessary carrier starts in **found**.
- “Beheaded celebrity is sailor” correctly suggests STAR minus S → TAR, but your validator rejects it because STAR is not printed literally.

I reproduced the last two failures. These are examples agents are supposed to imitate. Consolidating them into a larger document would preserve the defects with greater authority.

The ban on synonym-based deletions is particularly damaging. **A synonym followed by a precisely specified deletion is a normal cryptic construction.** It is not equivalent to an indirect anagram: removing the first letter is a tightly constrained operation. Your rule unnecessarily impoverishes an already underrepresented device. [Crossword Unclued’s deletion guide](https://www.crosswordunclued.com/2009/03/deletions.html) explicitly describes deriving the source word from wordplay.

**The validator is useful, but “excellent fairness machinery” is an overstatement.** I tested these synthetic candidates against both integrity and surface gates:

| Deliberately broken candidate | Supplied explanation | Result |
|---|---|---|
| “Pet in fog (3)” → CAT | CAT hidden in **cattle**, which is absent from the clue | Pass |
| “Carts endlessly provide a pet (3)” → CAT | Delete R and S from CARTS; “endlessly” does not authorise that | Pass |
| “A dog (3)” → CAT | Concatenate C+A+T, without supplying C or T | Pass |

These expose three different holes in [integrity.ts](E:/SynologyDrive/Projects/Personal/CrypticCrossword/src/data/integrity.ts:99): hidden fodder need not occur in the clue; deletion checks only a subsequence; single-letter composition pieces are accepted automatically.

All 415 existing bank entries pass the combined gates. That establishes conformity to the implementation, not fairness.

The previous audit also **identified padding but frequently passed it as fair**. Its WIND assessment calls “tightened in the” padding, then awards P. Several other entries receive similar treatment. If ignoring unexplained words is necessary to reach the answer, that is more than a surface blemish under your stated standard. Consequently, its “about 17 unsound clues” should not become a trusted baseline.

Conversely, the planned rules sometimes confuse **low ambition with invalidity**:

- Printing a component in a charade or container is not inherently unfair.
- A short, familiar construction can be excellent beginner material.
- Solving a double definition immediately from one definition is not evidence that the clue is defective.
- A natural sentence fragment is not inferior merely because it would not pass as standalone prose.

Alberich explicitly accepts meaningful fragments and warns against adding words merely to complete the surface’s grammar. Your current emphasis on sentence realism encourages precisely that padding. [Alberich: Surface readings](https://www.alberich-crosswords.com/more-articles/surface-readings)

One smaller factual correction: audit 05 says `PuzzleComplete` traps focus; audit 07 says it does not. **Audit 07 is correct:** the component focuses the dialog, handles Escape and restores focus, but contains no Tab trap.

**My independent sample**

I selected without replacement from all 415 entries: files sorted `part-a` through `part-j`, preserving entry order, then descending Fisher–Yates shuffle using `.NET System.Random(20261002)`, taking the first 30. Locations below are **one-based entry numbers**, not line numbers.

Surface measures the English reading independently of correctness: 1 incoherent, 3 serviceable, 5 effortless and convincing. Wit measures the eventual payoff: 1 none, 3 pleasing, 5 exceptional.

**F means I would reject the clue as written for this trainer’s stated strict standard.** Some are editorial grammar judgments, not universally agreed impossibilities. I accept ordinary articles and legitimate linking language; I do not accept content words that must simply disappear.

| Location / answer | Published clue | Surface | Wit | Fair | Assessment |
|---|---|---:|---:|:---:|---|
| e36 OVERHEAD | Too much head on the beer adds to the running cost (8) | 4 | 2 | F | Convincing pub economics, but “on the beer” supplies the scene without a cryptic role. OVER = “too much” is also loose. |
| b30 RANGE | The stove stirred up anger (5) | 4 | 2 | P | Natural and accessible. Familiar anagram; suitable practice rather than a showcase. |
| f10 PRECAUTIONS | Ahead of the warnings, take safety measures (11) | 3 | 1 | F | PRE+CAUTIONS is transparent; “take” does not properly connect that construction to the definition. |
| b26 STRAW | What you sip through, the last of it breaking the camel’s back (5) | 2 | 2 | P | Recognisable two-way allusion, expressed in a cumbersome fragment. |
| e8 MINISTER | The vicar sees one inside the minster (8) | 4 | 2 | P | Clear church scene and valid insertion. Literal MINSTER is a weakness of disguise, not a fairness defect. |
| c17 PLANET | Plant takes in energy to make a world (6) | 3 | 2 | P | Sound letters; “make a world” stretches the photosynthesis scene. |
| f3 TELEVISION | Novelise it for broadcast on the box (10) | 3 | 3 | P | Good letter discovery. Novelisation and television adaptation pull in opposite directions. |
| h43 PARROT | Standard nonsense from a copycat (6) | 4 | 3 | P | Compact, readable and mildly funny. “From” is a less tidy link direction, not a reason to discard it. |
| h14 IDOL | Pop star sounds lazy (4) | 5 | 3 | P | Effortlessly natural headline; familiar but satisfying sound switch. |
| b6 ANGEL | Heavenly being backing the show (5) | 4 | 3 | F | The second definition describes backing, not a backer. Borrowing “being” for both halves creates overlap. |
| c15 INKPOT | I think potters keep one on the writing desk (6) | 3 | 2 | F | The opening “I” is outside the supplied carrier; the definition is very vague. The explanation excuses rather than resolves the sentence. |
| i4 FOAL | Baked loaf for the young horse (4) | 3 | 2 | P | Fair and gentle. Slightly contrived feeding scene; nothing memorable. |
| i63 ELEPHANT | When the panel reorganised, in came the jumbo (8) | 3 | 2 | F | “When … in came” supplies a story around THE PANEL*, without justifying those words cryptically. |
| d28 EARNING | Nearing collapse, yet bringing in a wage (7) | 3 | 2 | P | Understandable work/exhaustion scene; ungainly anagram signalling. |
| h44 MEADOW | In came a dowager, crossing the pasture (6) | 3 | 2 | F | “In” supplies the hidden instruction; “crossing” then has no justified function. |
| a12 COB | Swan gliding past disco bar (3) | 3 | 2 | F | “Gliding past” does not tell the solver to extract hidden letters. |
| i52 OUTLINE | Profile that’s out of line? (7) | 4 | 2 | F | “Out of line” does not instruct OUT+LINE. A question mark does not repair the missing construction. |
| f18 CONSIDERATION | Icons rationed out of regard for others (13) | 4 | 3 | P | Surprisingly plausible religious-resource scene; rewarding long anagram. |
| a34 WIND | Coil tightened in the gale (4) | 3 | 2 | F | The two intended meanings are present, but “tightened” is unexplained. |
| h64 STATION | Devastation conceals one’s position (7) | 4 | 2 | P | Coherent concealment scene. Easy, exposed single-word hidden. |
| e32 SHEARING | The hearings, rescheduled, amounted to a fleecing (8) | 4 | 3 | P | Legal costs and fleecing cohere nicely. One of the better surfaces here. |
| e11 CONTAINER | Whether ancient or refurbished, still a vessel (9) | 4 | 2 | F | Smooth English purchased with “Whether” and “still”, which have no satisfactory cryptic role. |
| d24 EARLOBE | Wear lobelias and you cover a bit of the ear (7) | 2 | 1 | F | “And you” displaces the containment instruction onto the wearer; strained scene and giveaway definition. |
| h41 HERMIT | Some of her mittens fit a recluse (6) | 4 | 2 | P | Plausible, gentle hidden. Low surprise, but useful beginner practice. |
| c30 PLEASE | Suit appeals, by the sound of it (6) | 3 | 3 | P | Fair and potentially clever legal/clothing ambiguity; the surface remains slightly awkward. |
| h73 CONTRACT | It’s binding, though it may shrink (8) | 4 | 3 | F | “It may shrink” is not a definition of the verb CONTRACT. The noun/verb transition needs cleaner wording. |
| a24 VEIN | Blood channel found in cave interior (4) | 3 | 2 | P | Sound hidden. The literal scene needs more context than the clue gives it. |
| i29 BREAD | Bachelor devoured the dough (5) | 4 | 4 | P | Best payoff in this sample: devoured→READ, dough→money, coherent eating surface. |
| h8 VOTE | Veto upset the ballot (4) | 4 | 2 | P | Clean political headline, very familiar anagram. Keep as easy practice. |
| f2 NIGHTMARES | After dark, the mares of our worst dreams (10) | 2 | 1 | F | “After dark” is not a clean noun substitution for NIGHT; the remaining join is padded and fragmentary. |

Results:

- **Mean surface: 3.43/5**
- **Mean wit: 2.23/5**
- **17 pass; 13 fail my publication gate**
- **5/30 meet your numerical shipping bar** of fairness pass, surface ≥4 and surface+wit ≥7.

This is a small random sample, not a precise whole-bank failure estimate. It also happened to contain no part-j clues, so its problems cannot be attributed solely to that batch.

The important pattern is **decent English with limited payoff**, plus too many sentences whose smoothness depends on invalid glue. “Could appear in a newspaper crossword” is an inadequate definition of surface 5: published crosswords contain ordinary clues too.

Here are replacement drafts for every failed clue and the weakest passing surface. These are proposed improvements, **not originality-cleared or independently approved publication copy**. Some repair fairness more than they increase wit.

| Answer | Better draft | Construction / improvement |
|---|---|---|
| OVERHEAD | **Six deliveries to boss produce a running cost (8)** | OVER+HEAD; delivery language supports an ordinary business surface. |
| PRECAUTIONS | **Before warnings come safety measures (11)** | PRE+CAUTIONS; removes the misleading “take”. Still deliberately straightforward. |
| STRAW | **Drinking aid that broke the camel’s back? (5)** | Same two associations, expressed naturally. |
| ANGEL | **Heavenly messenger and theatre backer (5)** | Two actual noun definitions. A sound repair, not a brilliant clue. |
| INKPOT | **Writer’s vessel held by pink pottery (6)** | Hidden in pINK POTtery; all carrier words contribute. |
| ELEPHANT | **Jumbo disrupting the panel (8)** | THE PANEL*; a compact, imaginable disruption instead of padded narration. |
| MEADOW | **Some welcome a downpour for pasture (6)** | Hidden in welcoME A DOWnpour; coherent agricultural surface. |
| COB | **Swan in disco bar (3)** | disCO Bar; supplies a valid instruction. Gentle rather than witty. |
| OUTLINE | **Sketch of unfashionable range (7)** | OUT+LINE, with LINE as a product range. |
| WIND | **Coil moving air (4)** | WIND as a verb; WIND as moving air. Surface suggests a fan mechanism. |
| CONTAINER | **Ancient or rebuilt vessel (9)** | ANCIENT OR*; removing padding improves both readings. |
| EARLOBE | **Where studs hang out? (7)** | Cryptic definition exploiting people/jewellery. |
| CONTRACT | **Get smaller binding agreement (8)** | Two grammatical definitions; surface suggests negotiating a shorter agreement. |
| NIGHTMARES | **This German, disturbed, produces bad dreams (10)** | THIS GERMAN*; mechanically clean, though I would continue searching for a stronger surface. |

Two additional directions worth trying: **“Factory absorbs energy to make a world (6)”** for PLANET, preserving PLANT around E; and **“Live on site broadcast for the box (10)”** for TELEVISION, using LIVE ON SITE*. Neither needs the conceptual mismatch of novelising something for television.

**The Bible: worthwhile consolidation, flawed acceptance system**

The [design](E:/SynologyDrive/Projects/Personal/CrypticCrossword/docs/superpowers/specs/2026-10-02-clue-bible-design.md) contains useful ideas: explicit standards, recorded decisions, wider construction search, lexical evidence and judging wit with the answer visible. I would retain those.

I would change these parts before implementation:

| Proposed approach | Problem | What I would do |
|---|---|---|
| Two of three cold solvers fail → unfair | Failure can reflect difficulty or model weakness. Success can come from guessing despite broken wordplay. | Record solve success separately. Require a correct independent parse; adjudicate fairness from that parse and the actual text. |
| Cold solver lists no competing answer → unique | Three guesses cannot establish uniqueness. | Request specific competing answers, then check whether each satisfies **both** definition and wordplay. |
| Identify which lines are crossword clues | Measures genre recognition, length and stylistic cues as well as naturalness. | Ask blind readers to paraphrase the literal situation, identify awkward joins and compare naturalness directly. |
| Literal answer giveaway flags CD/DD | Easy DDs often yield from one definition. That is expected. | Check distinct senses and the intended reinterpretation. Keep ease separate from cryptic validity. |
| Ban every printed component | Rejects legitimate literal material, especially in beginner clues. | Make conspicuous components an editorial flag; judge the complete disguise. |
| Require four devices and cap CD/DD in every batch | A deletion lesson or short-answer batch has different needs. | Apply diversity targets to the learner’s actual sequence or published puzzle. |
| Every failure becomes another rule | Encourages brittle special cases and an ever-growing prompt. | Add regression examples first; introduce a rule only when its precision is demonstrated. |
| Owner judges bare surfaces only | Removes the owner from experiencing the actual product. | Keep blind surface sessions, followed separately by solving and reading the explanation. |

**The calibration plan needs a held-out test set.** “Published favourites” versus “our rejected drafts” confounds quality with provenance, style, difficulty and familiarity. A judge might separate those groups without recognising subtle unfairness.

Use matched examples: a sound clue and a minimally corrupted version; a fluent but unfair clue and a fair awkward one; a good easy clue and an obscure difficult one. Keep an untouched evaluation set, separated by answer or construction family from development examples. Repeatedly revising prompts until they pass the same anchors is tuning to the exam.

AUC ≥0.80 is also not a release guarantee. What matters operationally is **how many bad clues pass your chosen threshold**, and how many good clues it wrongly rejects.

**The missing engineering abstraction is a checkable construction, tied to exact text.** Today, `operations` are mostly assertions. They should identify exact source spans, explicit transformations and dependencies:

- Which occurrence of each word supplies material?
- Which indicator applies to which operation?
- Which letters are removed, inserted or reordered?
- Which words are definitions or legitimate links?
- Does every intermediate result actually follow?

Execute those operations rather than trusting their declared outputs. Keep synonym and grammatical judgments visibly separate from letter checks. A dictionary sense is evidence, not proof that the substitution works in this sentence.

For generation, I would also relax **fixed answers** wherever the product permits it. Daily clues need not start from an arbitrary answer. Search promising constructions and coherent phrases, retain the best, then schedule them. For grids, changing a stubborn fill entry may be cheaper than producing forty mediocre clues for it.

Finally, the design’s decision to defer testers and feedback until after accounts is backwards. **You need external judgments to validate the exam. Accounts are unnecessary for that.** “Automate the expert” can be your research objective; it is not an established capability on which the release gate can depend.

My smaller first experiment would be:

1. Correct and test a compact set of trusted examples.
2. Pick 20 answers spanning devices and lengths.
3. Generate several genuinely different constructions for each.
4. Run improved mechanical checks and independent parse reviews.
5. Compare finalists blind with a small group of experienced solvers and beginners.
6. Measure whether automated preferences predict their judgments.
7. Expand the machinery only where it adds demonstrated value.

**Additional product, learning and code findings**

**Cruci currently measures answer acquisition, not understanding.** A correct answer may come from the definition alone, remembered exposure, crossings or guessing. Your primary educational outcome should include “can explain why every important part works”. Add occasional lightweight tasks such as choosing the correct parse, identifying the fodder or explaining the sense switch. Do not require a written essay after every solve.

This also exposes a problem with the previous audit’s proposed automatic demotion after helped solves: **asking for useful help is not evidence of lost competence**. A harder clue can require help from a stronger solver. Difficulty, novelty and demonstrated parsing matter.

The “mixed” curriculum is partly predictable. [curriculum.ts](E:/SynologyDrive/Projects/Personal/CrypticCrossword/src/data/curriculum.ts:79) concatenates two hiddens, then two anagrams, then two charades. It introduces mixed content while preserving device blocks. Meanwhile, `bankPick` chooses the first eligible records, so a bank reorder or device rewrite can silently change an existing lesson. Use explicit, versioned lesson selections and deliberate interleaving.

The bank architecture also excludes an important part of eventual transfer: **multiword answers**. Bank hydration derives enumeration solely from total letter count. A phrase would lose its word divisions. Supporting phrases would widen the setter’s creative options as well as prepare learners for real grids.

These are the most actionable additional code issues:

| Finding | Evidence and consequence |
|---|---|
| **Daily hints and score reset when leaving an unfinished clue** | `taken`, letter reveals and input live only in component state in [DailyClueCard](E:/SynologyDrive/Projects/Personal/CrypticCrossword/src/components/DailyClueCard.tsx:50). Only finished results persist. Returning can lose work and turn remembered hints into a zero-help result. |
| **Returning lesson cards can falsely say “unaided!”** | [ClueCard](E:/SynologyDrive/Projects/Personal/CrypticCrossword/src/components/ClueCard.tsx:22) receives only `alreadySolved`; `hintUsed` and `revealed` restart false. It also initialises answer boxes empty. Historical solve provenance is not restored. |
| **Custom bank hints are discarded** | `RawClue` supports `hintOverrides`, but [bank conversion](E:/SynologyDrive/Projects/Personal/CrypticCrossword/src/data/bank/index.ts:57) does not forward them. I verified this in memory. The earlier hint recommendation cannot work just by adding JSON fields. |
| **Today’s shared result links to a moving target** | [DailyPage](E:/SynologyDrive/Projects/Personal/CrypticCrossword/src/pages/DailyPage.tsx:117) uses `/daily` for today’s share, rather than `/daily/N`. A recipient opening it tomorrow sees another clue despite the shared number. |
| **Midnight does not itself refresh the Daily** | The day is calculated on render; there is no midnight or visibility-change update. A long-open page can keep yesterday’s clue until another render or navigation. |
| **The standalone typecheck command checks no source files** | The root TypeScript configuration has `files: []` and project references. `tsc --noEmit --listFilesOnly` returned no files. The build’s `tsc -b` is separate and does check the projects. |

There is a further content-history issue beyond schedule reshuffling, which the earlier audit did identify: **even an unchanged schedule points to mutable clue text through the bank**. Rewriting a clue under the same answer ID changes past Daily content while retaining old scores and par records. Preserve a published clue revision, not just an answer.

For the product itself, I would define the promise as **“learn to see and justify the trick”**. That gives you something concrete to improve beyond a daily guessing ritual. Your structured data could support unusually clear explanations—but only after the underlying parses are trustworthy.

I would also soften the previous audit’s obsession with whether Play constitutes a “real UK cryptic”. Symmetry is a publishing convention; weak checking, repetition and poor clues directly affect solving. Small asymmetric practice grids can be useful if labelled honestly. A solo hobby project does not need a full newspaper-grade grid compiler before it can teach well.

**My top ten recommendations, ranked**

| Rank | Recommendation | Why it comes here |
|---:|---|---|
| **1** | **Correct the rulebook’s examples and turn them into executable regression fixtures.** | Agents are currently learning from contradictory and sometimes impossible instructions. |
| **2** | **Replace claimed mechanical fairness with explicit, span-linked operation checks.** | Close demonstrated holes before adding more judging panels. Report exactly what was checked. |
| **3** | **Get a small independent expert benchmark now.** | You need an external check on fairness and taste; neither your inexperience nor another model’s confidence supplies one. |
| **4** | **Rewrite the Bible’s evaluation design.** | Separate validity, naturalness, difficulty and delight; remove invalid inference rules and preserve a held-out benchmark. |
| **5** | **Quarantine doubtful clues and publish a smaller trusted set.** | A trainer must not teach learners to distrust correct reasoning because the clue is defective. |
| **6** | **Search constructions more widely and allow answer substitution.** | Strong surfaces often begin with better raw material, not repeated polishing of a forced answer. |
| **7** | **Measure parsing and transfer, not just correct answers.** | Add worked reasoning, genuinely interleaved practice and occasional explanation checks. |
| **8** | **Persist attempts and publish immutable clue revisions.** | Preserve hints, outcomes and historical meaning; fix share links and restored “unaided” labels. |
| **9** | **Make each hint useful for its actual clue, and support that through bank hydration.** | Boilerplate cannot consistently teach the trick or justify equal hint pricing. |
| **10** | **Keep the hobby manageable: stabilise Learn and Daily; curate a few Play grids.** | More accounts, app packaging, grid volume and evaluation infrastructure will not compensate for an unreliable editorial standard. |

**I would pursue the project, but reject “more agents plus more rules equals reliable greatness” as the working assumption.** The next milestone should be a small collection whose fairness, surfaces and explanations survive independent scrutiny—and evidence that your process can produce another collection of comparable quality.