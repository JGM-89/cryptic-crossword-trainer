# 01 — What a great clue is

This chapter defines the qualities every Cruci clue is measured on. It replaces §1 (the rubric),
§1b (surface realism), §1c (teaching register), §3 (surface craft), §7 (difficulty) and §7b (par)
of the retired `docs/clue-style.md`. Fairness mechanics live in `03-rules-and-flags.md`; the
measuring protocol lives in `04-exam.md`; the writing procedure lives in `05-writer-method.md`.

## Summary

| # | Quality | One-line test | Measured by | Pass bar |
|---|---|---|---|---|
| 1 | **Soundness** (gate) | Read exactly as the wordplay demands, does it give this answer and only this answer, with every word and letter accounted for? | RULES, COLD-SOLVE, EVIDENCE | 0 unwaived RULE failures; ≥ 2 of 3 cold solvers give the correct parse; every named competing answer fails the definition or the wordplay |
| 2 | **Definition precision** | Is the definition a true, dictionary-backed equivalent of the answer, in the same part of speech, at one end? | EVIDENCE, COLD-SOLVE, RULES | Sense line on file; no near-equal alternative answer |
| 3 | **Surface naturalness** | Could this sentence appear, unchanged, outside a crossword? | NATURALNESS, TOURNAMENT-SURFACE, RULES (flags) | At or above the median good anchor in NATURALNESS; beats or ties the median anchor in TOURNAMENT-SURFACE |
| 4 | **Scene** | Can a reader picture one situation in which every word belongs? | TOURNAMENT-SURFACE, NATURALNESS | Judges' paraphrases name the same scene; beats or ties the median anchor |
| 5 | **Misdirection** | Does the surface steer the solver to a wrong reading of at least one key word? | COLD-SOLVE, TOURNAMENT-WIT, RULES | A real second reading (no F-QUIZ); CD contract present; beats or ties the median anchor in TOURNAMENT-WIT |
| 6 | **Economy** | Delete any word: does the cryptic reading break? | RULES (flags) | Every F-IDLE and F-PRINTED fixed or answered with a recorded reason |
| 7 | **Penny-drop** | Once the answer and parse are shown, is there a moment of delight? | TOURNAMENT-WIT | Beats or ties the median anchor of its device |
| 8 | **Originality** | Is the wording ours, and not a chestnut or a bank template? | RULES (R-COPY, F-CHESTNUT, F-TEMPLATE, B-REPEAT) | No R-COPY; no unresolved flag |
| 9 | **Difficulty honesty** | Do `difficulty` and `par` say truthfully how hard it is, and is the hardness fair? | Par rubric, COLD-SOLVE | Par present and consistent; no hardness from unfairness |
| 10 | **Teaching register** (Stage-A only) | Is it a fully real cryptic clue that is gentle only in vocabulary and device? | All of the above, plus the five register rules | All five rules pass |

## How to use this chapter

- **Order of judgement.** Soundness is a gate: a clue that fails it scores nothing, however good
  the sentence. After the gate, the priority is **surface naturalness and scene first, then
  misdirection and penny-drop**. A plain, real sentence beats a clever sentence that no one
  would write. Originality is a check on everything. Difficulty honesty is a label, not a
  selection criterion: it must be true, not high.
- **Exam step names** (defined fully in `04-exam.md`):
  - **RULES**: the machine rules (RULE = fails the clue) and flags (FLAG = needs an exam step or a
    recorded rewrite reason) catalogued in `03-rules-and-flags.md`. Fairness principles (owner,
    2026-10-02, case law CL-044): a RULE is only for an **unambiguous** fault, anything needing
    judgement is a FLAG; every rule is precision-tested on published broadsheet clues; every
    rule can be **waived for one clue with a written reason**, which the exam's auditor checks.
    The blocking rules today are R-ANSWER-IN-CLUE, R-FODDER-LETTERS, R-INDICATOR-DIR,
    R-HIDDEN-IND, R-CD-CONTRACT (`src/data/clue-rules.ts`) and R-COPY (near-verbatim copies of a
    published clue only, `scripts/clue-flags.mjs`), plus the validator's letter checks and the
    surface gate.
  - **COLD-SOLVE**: three fresh solver agents see only `clue (enum)` and return their answer,
    confidence and **parse**. A solve counts only with the **correct parse**; a right answer from a
    guess does not show the wordplay works. Uniqueness is tested by asking for **named competing
    answers** and checking each against both the definition and the wordplay. Solve success is
    recorded separately from fairness: failing to solve can mean difficulty or a weak solver.
    Solving a DD or CD from one half is **not** a defect (spec revision 2).
  - **NATURALNESS**: paired comparisons of bare surfaces ("which reads more naturally?", both
    orders) plus a **"paraphrase the literal scene"** check: a judge restates what the sentence
    literally says and names any awkward join. It replaces the old DECOY test (spot the crossword
    line among real sentences), which measured genre cues as much as naturalness. Model judges
    sit it at scale; the owner sits it in short sessions.
  - **TOURNAMENT-SURFACE**: pairwise comparison of finalists and published anchors, both orders,
    **no answer shown**, aggregated with Bradley–Terry. The owner may take part.
  - **TOURNAMENT-WIT**: the same, but with the **answer and parse revealed**.
  - **EVIDENCE**: every definition, double-definition half and synonym operation carries a
    dictionary sense line (WordNet / Wiktionary checked automatically; misses go to an auditor).
- **Status of the numbers.** Every pass bar that depends on a judge is trusted only after the
  calibration run shows the exam separates good from bad clues. Calibration uses **matched
  pairs** (a sound clue vs a minimally corrupted copy; fluent-but-unfair vs awkward-but-fair;
  easy-good vs obscure-hard) and a **held-out set** never used to tune prompts, and reports the
  false-pass and false-reject counts at the chosen threshold, not just AUC (target AUC ≥ 0.80,
  see `04-exam.md`). Until external human solvers check them (deferred to the beta phase), exam
  scores are labelled **"AI-calibrated, not human-validated"**. Until the exam tooling is built, run the steps by hand as described in
  `04-exam.md`. The old absolute 1–5 thresholds ("surface ≥ 4", "surface + wit ≥ 7", "median
  panel ≥ 4") are **retired**: the audit showed absolute model scores bunch at 4 and cannot
  see wit ([audit 01](../audit/2026-10-02/01-clue-system.md)).
- **Exemplars** are our own clues, graded in the 2026-10-02 editor's audit
  ([audit 02](../audit/2026-10-02/02-clue-sample.md)). GREAT ≈ could run in a main broadsheet
  cryptic; GOOD ≈ clean, Quick-Cryptic grade; WEAK = fails this quality. A WEAK clue quoted here
  is a teaching case, not a clue to copy. Where a WEAK clue has since been rebuilt, the
  quotation is the version the audit graded.
- **Executable examples.** An exemplar tagged with an `id` (e.g. `hidden-knee`) is a full
  entry in `examples/<device>.json`, run through the validator, surface gate and blocking rules
  in CI (`src/data/bible-examples.test.ts`). "fails: `id`" marks a WEAK clue the machinery
  rejects, with the precise error. A WEAK clue tagged *judgement example* passes the machinery:
  its fault is a flag or a judge's call, so it lives in prose only and must never be cited as a
  rule failure.

---

## 1. Soundness (the gate)

**Definition.** A clue is sound when, read exactly as the cryptic grammar demands, it yields the
answer and only the answer: one definition at the start or end (or the whole clue, for a cryptic
definition or &lit); wordplay that independently produces every letter in order; each
transformation signalled by a correctly typed indicator in the right direction; anagram fodder
present literally; abbreviations only from `src/data/abbreviations.ts`; no word without a role;
no word doing two cryptic jobs (except in &lit, where the whole clue defines). The cryptic
reading forms a grammatical English statement when the fodder is replaced by `[fodder]` and the
definition by `[answer]` (the placeholder test).

**Why.**
- Afrit's injunction, the founding rule of fair clueing: the setter need not mean what he says,
  but must say what he means. The surface may lie; the parse may not. It comes from Afrit
  (A. F. Ritchie), *Armchair Crosswords* (1949), and Ximenes adopts it as the core principle of
  his chapter on clue-writing ([Ximenes on the Art of the Crossword, ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/);
  [Crossword Unclued on *Armchair Crosswords*](https://www.crosswordunclued.com/2010/05/afrits-armchair-crosswords.html);
  [Wikipedia, Cryptic crossword](https://en.wikipedia.org/wiki/Cryptic_crossword)).
- Alberich: the grammar of the cryptic reading must always take precedence over the grammar of
  the surface ([Alberich, surface reading](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/surface.html)).
  Azed (Jonathan Crowther) and Don Manley both work in this strict Ximenean school
  ([Wikipedia, Azed](https://en.wikipedia.org/wiki/Azed); [Wikipedia, Don Manley](https://en.wikipedia.org/wiki/Don_Manley)).
- The placeholder test is Viresh Ratnakar's method for exposing broken cryptic grammar
  ([Ratnakar, cryptic grammar](https://viresh-ratnakar.codeberg.page/writings/2023/cryptic-grammar-04-2023.html)).
- Test-solving is the professional standard: the Listener's vetters state that they attempt to
  solve every submission cold, as solvers would ([Listener notes for setters](https://www.listenercrossword.com/HTML/Notes_S1.html)).
  Our old pipeline had no cold solve at all ([audit 01 §3](../audit/2026-10-02/01-clue-system.md)).
- Letter mechanics must stay outside the model. LLMs are weak below the token level: in Saha et
  al., 46–60% of GPT-4-Turbo's errors had the right meaning but the wrong length
  ([Saha et al., NAACL 2025](https://arxiv.org/html/2406.09043v3)). The state of the art checks
  each explanation by executing it as code, the same pattern as our validator
  ([Andrews & Witteveen, ICML 2025](https://arxiv.org/abs/2506.04824)).

**How it is measured.**
- **RULES**: the validator (`scripts/validate-clue.ts`) plus every RULE in
  `03-rules-and-flags.md`: R-ANSWER-IN-CLUE, R-FODDER-LETTERS, R-INDICATOR-DIR, R-HIDDEN-IND,
  R-CD-CONTRACT and R-COPY. The flags F-IDLE (a word with no role) and F-PRINTED (an answer
  piece printed as itself) need a fix or a recorded reason.
- **COLD-SOLVE**: three independent solvers. Records `solved` (with the correct parse),
  `competitors` (named alternative answers, each tested against definition and wordplay).
- **EVIDENCE**: every definition and synonym operation is backed by a dictionary sense.

**Pass bar.** Zero unwaived RULE failures (any RULE failure ends the exam). At least 2 of 3 cold
solvers give the correct parse. Unique: every named competing answer fails the definition or
the wordplay. EVIDENCE complete (see §2).

**Exemplars.**

| Grade | Clue | Why |
|---|---|---|
| GREAT | KNEE — *Some drunk needs a joint (4)* · `hidden-knee` | Hidden in "drunK NEEds"; "Some" is a valid hidden indicator; every word has one job. |
| GREAT | PASSAGE — *Corridor where the page keeps his donkey (7)* · `container-passage` | PAGE around ASS; container indicator "keeps" reads naturally; definition clean at the start. |
| GOOD | FORECAST — *Front company makes a prediction (8)* · `charade-forecast` | FORE + CAST; standard link "makes"; nothing left over. |
| GOOD | VOICE (teaching) — *Utter nothing when there's wickedness about (5)* · `container-voice` | O inside VICE, a true internal insertion with a correctly typed indicator. |
| WEAK | GENERAL — *A wildly enlarged map guided the commander (7)* · fails: `anagram-general` | The fodder printed is "enlarged", which supplies a stray D. Letters do not account. |
| WEAK | HARM — *A hard limb can do damage (4)* · *judgement example* | The leading "A" is unaccounted for (H + ARM uses only "hard" and "limb"). |
| WEAK | COB — *Swan gliding past disco bar (3)* · fails: `hidden-cob` | "past" is not a hidden indicator. |

**Common failure modes.**
- **A single idle word that looks like wordplay material**: "*Pupils* dilate oddly" (DETAIL),
  "*Members* groan" (ORGAN), "Damned *horse* stabled" (BLASTED), "Enraged *soldier* hurls"
  (GRENADE). These are fairness failures, not just padding: the solver tries to use the word.
  About 71 bank clues (17%) had at least one idle word ([audit 02 §3.2](../audit/2026-10-02/02-clue-sample.md)). Now the
  flag F-IDLE, not a rule: deciding that a word is idle needs judgement (a decorative word can
  carry the scene), so the exam's auditor resolves each one.
- **Fodder that is a substring, not an exact match** (GENERAL from "enlarged"). Now R-FODDER-LETTERS
  (`anagram-general`).
- **Wrong-sense or invalid indicators**: "past" (COB) fails R-HIDDEN-IND (`hidden-cob`). "skirts"
  (MOAT) and "crossing" (MEADOW) are published hidden indicators, so the machinery accepts them;
  whether they read as *inside* in those clues is for the exam.
- **Direction-bound indicators in a bank with no grid**: "rising" (TIP), "turned up" (REWARD).
  The Daily serves single clues with no Across/Down. Now R-INDICATOR-DIR (`reversal-tip`).
- **Whole-clue devices escaping the gate.** Cryptic and double definitions bypassed the old
  mechanical checks entirely, and part-j collapsed to 90% whole-clue devices
  ([audit 01](../audit/2026-10-02/01-clue-system.md)). COLD-SOLVE and R-CD-CONTRACT now cover them.
- **Validator loopholes** (Astra's audit, closed in `6d41317`, case law CL-046): a hidden whose
  carrier is not in the clue (`hidden-cat-absent-carrier`), a deletion of scattered letters
  (`deletion-cat-scattered`), and single-letter charade pieces from nowhere
  (`charade-cat-free-letters`).

---

## 2. Definition precision

**Definition.** The definition is a word or phrase that a dictionary would accept as meaning the
answer, in the **same part of speech and inflection**, placed at the start or end of the clue. It
is not the answer itself or a word sharing its stem. A definition by example (a hyponym: "Rover"
for CARPET) is flagged with `?`, `perhaps`, `maybe`, `say` or `for example`. Each half of a double
definition independently means the answer, and the two senses are genuinely distinct. Within
those limits, the best definition is **oblique**: true, but not the first synonym a thesaurus
lists ("Flier" for BAT, "fair" for MARKET).

**Why.**
- Ximenes: the definition must be accurate, and failing to signal the correct part of speech
  breaks the rule of saying what you mean ([Ximenes ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/)).
- Alberich decides the definition before the wordplay, because definitions are few and wordplay
  options many ([Alberich, tips for setters](https://www.alberich-crosswords.com/articles/tips-for-setters)).
- Definition by example must be qualified in the Ximenean tradition, though some papers (notably
  The Times) have relaxed this. Cruci keeps the strict rule because it teaches beginners
  ([Crossword Unclued, definition by example](https://www.crosswordunclued.com/2010/06/definition-by-example.html)).
- A loose definition makes a clue ambiguous; Alberich names ambiguity as one of the three ways a
  cryptic definition fails ([Alberich, cryptic definitions](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/crypdef.html)).
- Semantic overreach (near-synonyms, wrong part of speech, half-senses) is a documented LLM
  failure in our own bank, and a single same-model auditor missed several
  ([audit 01 §2](../audit/2026-10-02/01-clue-system.md)).

**How it is measured.**
- **EVIDENCE**: the `evidence` field quotes a dictionary sense with its part of speech for the
  definition, each DD half and each synonym op. Automatic WordNet/Wiktionary check; misses go to
  the auditor agent. Missing evidence raises F-DEF-EVIDENCE.
- **COLD-SOLVE**: solvers report which words they took as the definition. If they find the
  definition but list a near-equal alternative answer, the definition is too loose.
- **RULES**: R-ANSWER-IN-CLUE (the answer or a word sharing its stem appears in the clue).
- Obliqueness is scored as par factor D (§9).

**Pass bar.** EVIDENCE present and confirmed for every definition, DD half and synonym op, with
matching part of speech. No unflagged hyponym. No R-ANSWER-IN-CLUE failure. No near-equal
alternative answer in COLD-SOLVE.

**Exemplars.**

| Grade | Clue | Why |
|---|---|---|
| GREAT | MARKET — *A fair part of Denmark, etc. (6)* · `hidden-market` | "fair" is exact and oblique: it reads as an adjective, means a market. |
| GREAT | PIANO — *Quietly grand? (5)* · `dd-piano` | Both halves are exact senses (*piano* = quietly; a grand is a piano), from different roots. |
| GOOD | SECOND — *Back the flawed article (6)* · `dd-second` | Both senses real (to second = to back; a second = a flawed article). |
| GOOD | CAPTAIN — *Skipper entangled in a pact (7)* · `anagram-captain` | Precise, ordinary definition at the start. |
| WEAK | STEAM — *Small side built up a head of pressure (5)* · *judgement example* | A "head of steam" is not STEAM. |
| WEAK | OCEAN — *Canoe wrecked at sea (5)* · *judgement example* | "at sea" is an adverbial phrase; OCEAN is a noun. |
| WEAK | JAM — *Preserve stuck in traffic? (3)* · *judgement example* | "stuck in traffic" defines *in a jam*, not JAM. |

**Common failure modes** ([audit 02 §3.6](../audit/2026-10-02/02-clue-sample.md)).
- **Near-miss senses**: STEAM "a head of pressure"; WARFARE "endless conflict"; PADDLE "for an
  oar"; WORKSHEET "Operate the mainsail" (a sheet is a rope, not a sail); BAY "Window" (a bay
  window is not a bay).
- **Wrong part of speech**: OCEAN "at sea"; HILL "the climb".
- **Unflagged definition by example**: CAR "Old banger"; MINISTER "The vicar".
- **No disguise at all**: ISLAND "Isle"; EVENT (teaching) "…the event", where the definition is
  the answer word.
- **Definition containing the answer**: EARLOBE "a bit of the ear".
- **Botanically or factually backwards**: EAR "grows on a cob" (the cob is the core of the ear).
- **Generic hypernyms** ("bird", "tree", "fruit"), in about 22 clues, and "the X" at the end of 35.
  Not unsound, but transparent and samey; prefer the oblique definition.
- **A possessive standing for a first name**: CLIFF "Richard's".

---

## 3. Surface naturalness

**Definition.** Read with no knowledge of the answer, the clue is **one real, natural English
sentence or phrase** in a single register and tense, that a person could plausibly say or write
outside a crossword (in a headline, a novel, a conversation). It fails if it is a narrated cryptic
recipe ("…spell X backwards"), if the definition is comma- or dash-tacked onto the end, if it only
reads as a sentence because of a decorative idle word, if it is grammatical but surreal, or if it
contains crossword-ese (strings like "Net returned gold"). Compact phrases are acceptable for
double definitions, cryptic definitions and &lit, judged as phrases a person could say.

**Why.**
- Alberich: a run of clues that each tell a mini-story is far more pleasing than incoherent strings
  of words, and an exclamation mark does not rescue nonsense ([Alberich, surface reading](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/surface.html)).
- A good surface is meaningful and plausible, and exists to distract from the cryptic reading
  ([Crossword Unclued, surface vs cryptic reading](https://www.crosswordunclued.com/2009/06/surface-reading-cryptic-reading.html)).
- Alberich's search-engine test: if a phrase appears nowhere in real writing, the surface is
  probably crosswordy (same Alberich page). We tried to mechanise it as F-UNATTESTED and
  **rejected** it: published broadsheet clues tripped the word-pair test more often than ours
  (62% vs 34%), so it measures nothing useful (case law CL-050). Apply the test by hand.
- LLM prose has documented habits (cliché, lack of specificity) that professional writers flag
  ([Chakrabarty et al., CHI 2025, LAMP](https://arxiv.org/abs/2409.14509)), and model judges share
  the writer's blind spots and favour their own output ([Panickssery et al., NeurIPS 2024](https://arxiv.org/abs/2404.13076)).
  That is why naturalness is measured against **real sentences**, and why the owner, the one
  human signal, judges surfaces blind (design principle 4).
- Absolute creative scores from LLM judges agree poorly with experts ([Chakrabarty et al., CHI 2024, TTCW](https://arxiv.org/abs/2309.14556));
  pairwise comparison in both orders is more reliable ([Zheng et al., MT-Bench](https://arxiv.org/abs/2306.05685)).
- *Read-aloud test* (house rule): read the surface aloud; if you stumble, it is wrong. Our old
  guide attributed this to Don Manley; we could not verify the attribution, so it stands as a
  house rule.

**How it is measured.**
- **NATURALNESS**: the bare surface (no enumeration) in paired comparisons against rival
  candidates and anchors, plus a paraphrase of its literal scene with awkward joins named.
- **TOURNAMENT-SURFACE**: pairwise against rival candidates and published anchors of the same
  device; no answer shown.
- **RULES** (flags): F-TEMPLATE (over-used bank template), F-AMERICANISM.

**Pass bar.** NATURALNESS: at or above the median good anchor of its device (model judges), and
a paraphrase that needs no apology. If the owner, in a blind session, marks a finalist as not
real English, it is blocked unless no candidate for that answer passes, in which case the
decision is recorded in case law (house rule). A natural sentence *fragment* is fine; do not pad
a surface to complete its grammar (Alberich). TOURNAMENT-SURFACE: beats or ties the median anchor of its device. Every flag resolved
or answered with a recorded reason.

**Exemplars.**

| Grade | Clue | Why |
|---|---|---|
| GREAT | ASCERTAIN — *Shake a canister to find out (9)* · `anagram-ascertain` | The fodder is a natural phrase; the whole line is an ordinary instruction. |
| GREAT | TEA — *What's a drink in London is dinner in Leeds? (3)* · `cd-tea` | A real remark about British class and regional usage. |
| GOOD | PAINT — *A spilt pinta ruins the fresh coat (5)* · `anagram-paint` | Natural British register ("pinta"); clear image. |
| GOOD | MEDDLE — *Interfere with an Olympic prize, by the sound of it (6)* · `homophone-meddle` | Reads as a sentence; the indicator phrase is idiomatic. |
| WEAK | TENOR — *Net returned gold for the singer (5)* · *judgement example* | Crossword-ese: an abbreviation pile that exists only inside puzzles. |
| WEAK | CORRELATE — *Refined cartel ore should tally (9)* · *judgement example* | Invented fodder no one would write. |
| WEAK | ASTRONOMY — *An artsy moon, badly sketched, hints at the study of stars (9)* · *judgement example* | Narrates the anagram; invented fodder; weak link "hints at". |

**Common failure modes.**
- **Naturalness bought with padding.** The old judges rewarded idle words because they make a
  sentence flow ("Later, *he was* drunk but *still* sharp", ALERT). A natural sentence bought
  with an idle word scores **lower**, not higher ([audit 02 §3.2, §7](../audit/2026-10-02/02-clue-sample.md)).
- **Narrated recipe**: CHARITY "The cleaner had it all year, doing good works".
- **Invented fodder phrases**: "superstar lingo" (STARLING), "artsy moon" (ASTRONOMY).
- **Comma-tacked definitions**: REGAL "Beer sent back, befitting a queen".
- **Over-used templates**: "When [fodder] [indicator], [they/each/I]…" (NEUTRAL, RESIDENT,
  STREAMING, ELEPHANT); 15 clues opening with "Some". Now F-TEMPLATE.
- **Dated or foreign register**: "aging" (US spelling), "the Queen" = ER in the present tense
  (TENDER, TROOPER) since 2022.

---

## 4. Scene (one picturable situation)

**Definition.** The surface describes **one situation** a reader can picture, with a subject and an
action, in which every content word belongs: the definition, the fodder, the indicator and the
links all come from the same world (a kitchen, a cricket match, a courtroom, a newsroom). Each
piece of wordplay is chosen from its synonyms *because* its everyday sense fits that world.
Concrete nouns and real verbs beat abstractions ("thing", "matter", "business").

**Why.**
- Alberich: a clue that conjures no picture is unsatisfactory even when the cryptic grammar is
  perfect; he asks for a mini-story ([Alberich, surface reading](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/surface.html)).
- Ximenes's own account of clueing DAINTILY (in *Ximenes on the Art of the Crossword*, 1966,
  analysed in Hardcastle's thesis) starts from CHAR as a cleaning lady, then asks what a char
  would do with a tin. Every word is picked because it belongs to the char's world: *Char holds
  messy tin delicately* ([Hardcastle, PhD thesis, ch. 1](https://dwhardcastle.wordpress.com/wp-content/uploads/2016/02/hardcastle-phd.pdf)).
- Hardcastle's ENIGMA, the only substantial computer clue generator, scored thematic association
  between words. In its Turing-style test, people spotted the human clues because their parts were
  semantically connected and painted a picture with its own logic. Expert reviewers (Mike
  Hutchinson, Jonathan Crowther, Sandy Balfour) judged only 8–10 of 42 machine clues publishable,
  noting that nothing organised the surface beyond the clause
  ([Crossword Unclued on ENIGMA](https://www.crosswordunclued.com/2012/02/can-computer-program-write-cryptic.html);
  [Hardcastle, ACL W07-2323](https://aclanthology.org/W07-2323.xml)). *Note: audit 03 named Don
  Manley among the reviewers; the source page names Mike Hutchinson.*
- Alberich and Crossword Unclued both recommend indicators that share the fodder's subject
  ([Alberich, tips](https://www.alberich-crosswords.com/articles/tips-for-setters);
  [Crossword Unclued, camouflaging anagrams](https://www.crosswordunclued.com/2009/11/camouflaging-anagrams.html)).
- Taste: avoid grim or unhappy scenes; solvers may be living through them (Alberich, surface page).

**How it is measured.**
- **TOURNAMENT-SURFACE** and **NATURALNESS**: each judge also paraphrases the scene in one line
  ("a waiter clearing a table"). A surface for which judges cannot name a scene, or name different scenes, loses Scene
  regardless of its pairwise result (house rule; the judge prompt is in `04-exam.md`).
- **NATURALNESS**: surreal-but-grammatical surfaces show up as paraphrases that make no sense
  ("someone wears lobelias over their ear").
- The scene brief from the writer method (`05-writer-method.md`, step 2) is recorded in the ledger
  so the judges' scene can be compared with the intended one.

**Pass bar.** At least 2 of 3 judges' paraphrases describe the same scene, and the clue beats or ties the median
anchor of its device in TOURNAMENT-SURFACE.

**Exemplars.**

| Grade | Clue | Why |
|---|---|---|
| GREAT | NET — *What's left when ten's knocked over (3)* · `reversal-net` | One scene (ten-pin bowling); "What's left" and "knocked over" both belong to it. |
| GREAT | DREAM — *Armed rebels nurse an ambition (5)* · `anagram-dream` | A whole political scene; the anagram indicator "rebels" is part of it. |
| GOOD | STEALING — *Thieving in West Ealing? (8)* · `hidden-stealing` | A real place and a real crime; the "?" is earned. |
| GOOD | CHASM — *They had to ditch a small dinghy in the gulf (5)* · `hidden-chasm` | Vivid scene, but "They had to" and "dinghy" are decorative (fails Economy). |
| WEAK | EARLOBE — *Wear lobelias and you cover a bit of the ear (7)* · *judgement example* | Grammatical but surreal: no one wears lobelias over their ear. |
| WEAK | STARLET — *The star let her flat to a budding actress (7)* · *judgement example* | An odd non-scene invented to print the answer. |
| WEAK | MUSHROOM — *Sentimental mush fills the room, like a fungus (8)* · *judgement example* | Three ideas joined by "like"; no single picture. |

**Common failure modes.**
- **Pieces picked for letters, not for their world**: TENOR's "net… gold… singer".
- **Grammatical but surreal**: EARLOBE, "part of the rectangle rises above the fisherman" (old
  style guide example).
- **Two half-clues glued together**: WHERE "You wear it, we hear — but in what place?"; STRAW
  "What you sip through, the last of it breaking the camel's back".
- **Abstract nouns with no picture**: "a hidden matter" (SECRET), "the running cost" (OVERHEAD).

---

## 5. Misdirection

**Definition.** The surface leads the solver toward a wrong reading of at least one word that
matters to the parse, while the cryptic reading stays fair. Approved moves:
- **Deceptive sense**: a word with two real meanings, where the surface uses one and the parse the
  other (flower = river, number = anaesthetic, dough = money).
- **Part-of-speech shift**: a noun read as a verb, an adjective as a noun ("fair" in MARKET).
- **Lift and separate**: a compound phrase the solver must split ("treasure chest").
- **Indicator disguised as a natural word** ("rebels", "Tearing up").
- **Capitalisation and 's tricks**: a false capital is fair; removing a capital is not. A `'s` can
  be read as possessive, *is* or *has*.
- **Cryptic definition / &lit**: the whole clue has a false reading and a true one.

**Why.**
- Ximenes calls words with several meanings invaluable, requires the part of speech to be
  honest in the cryptic reading, and allows punctuation to be omitted but not added misleadingly
  ([Ximenes ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/)).
- Lift and separate is the term credited to Mark Goodliffe
  ([Crossword Unclued, lift and separate](https://www.crosswordunclued.com/2010/12/lift-and-separate.html)).
- Alberich: false capitals are acceptable, removed capitals unfair ([Alberich, tips](https://www.alberich-crosswords.com/articles/tips-for-setters)).
  A cryptic definition fails when its real meaning leaps out ([Alberich, cryptic definitions](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/crypdef.html)).
- Roger Squires (Rufus) compares clue misdirection to stage magic
  ([Crossword Unclued interview](http://www.crosswordunclued.com/2011/11/interview-roger-squires.html)).
- AmbiPun generated puns by placing context words for **both** senses in the sentence, the
  computational form of the deceptive-sense move ([Mittal et al., NAACL 2022](https://arxiv.org/abs/2205.01825)).
- Published reference (one short example): the cryptic definition *Bust down reason?* (9,
  BRAINWASH), cited by David Astle, works because it first reads as a police or pub scene
  ([Astle, "Fond clues"](https://davidastle.com/da-blog/fond-clues)).

**How it is measured.**
- **COLD-SOLVE**: solvers report their first, wrong reading; none means no misdirection. A CD or
  DD with no distinct second sense (the literal paraphrase already *is* the answer's definition)
  raises F-QUIZ. Solving it quickly, or from one half of a DD, is **not** a defect (spec revision
  2): F-QUIZ asks whether a reinterpretation exists, not how fast it was found.
- **RULES**: R-CD-CONTRACT (a cryptic definition must declare `pun: {misleading, true}`;
  `cd-map` fails it); F-PRINTED (a printed piece does not misdirect; a flag the tournament
  weighs).
- **TOURNAMENT-WIT**: misdirection is half of what makes the reveal satisfying.
- Par factor E (§9) records it for difficulty.

**Pass bar.** A real second reading on every device. For a CD: the `pun` contract filled and
no F-QUIZ. In TOURNAMENT-WIT: beats or ties the median anchor of its device.

**Exemplars.**

| Grade | Clue | Why |
|---|---|---|
| GREAT | GRANITE — *Tearing up hard rock (7)* · `anagram-granite` | "Tearing up" reads as crying; it is the anagram indicator. |
| GREAT | BREAD — *Bachelor devoured the dough (5)* · `charade-bread` | "devoured" = READ (a book), "dough" = money; two deceptive senses. |
| GOOD | UNDERRATED — *Ad returned in error is not appreciated (10)* · `anagram-underrated` | "Ad returned" looks like a reversal; it is anagram fodder. |
| GOOD | DENIER — *One who won't take yes for an answer? (6)* · `cd-denier` | A twisted idiom that hides the true sense. |
| WEAK | MAP — *It shows you where to get off? (3)* · fails: `cd-map` | No false reading; the "?" decorates a plain definition (a quiz question). |
| WEAK | OUTLOOK — *Once out, look at what lies ahead (7)* · *judgement example* | The answer is printed whole; nothing to see through. |
| WEAK | REGAL — *Beer sent back, befitting a queen (5)* · *judgement example* | The mechanism is spelt out and the definition tacked on. |

**Common failure modes.**
- **Quiz-question cryptic definitions**: about 16 bank CDs are plain definitions with a "?":
  MAP, ARC, SAND, MAPLE, DEW, FOG, SKY, GEM, OAK, MOON, NAIL, TIGER, HERON, ENTERTAINMENT,
  GRANDMOTHERLY, STOCKBROKER. Test: if you can delete the "?" with no loss, it is a quiz
  question ([audit 02 §3.4](../audit/2026-10-02/02-clue-sample.md)).
- **Printed charade pieces**: 31 of 75 charades print a ≥3-letter piece; OVERNIGHT, OUTLOOK,
  STARLET, WONDER and CHARM print the whole answer. Compound answers split at their seam are the
  worst case. Now the flag F-PRINTED: printing a component is weak disguise, not unfairness, so
  it never blocks on its own (spec revision 2).
- **Answer-screaming definitions** that the solver reads straight off.
- **Device pile-ups** that mislead by confusion rather than by a fair second reading.

---

## 6. Economy (no idle words)

**Definition.** Every word in the clue has a role in the cryptic reading: definition, indicator,
fodder, an operation's cue, or a link word on the allow-list (`03-rules-and-flags.md`). Deleting any
word breaks the cryptic reading. A long clue is fine if it has no idle words; a short clue with
one idle word fails. An indefinite article that the wordplay does not account for is an idle word.

**Why.**
- Ximenes: avoid redundant words, and brevity beats length ([Ximenes ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/)).
- Alberich: every word must serve the definition or the wordplay; trim padding
  ([Alberich, tips](https://www.alberich-crosswords.com/articles/tips-for-setters)). MyCrossword
  gives padding as a beginner's fault ([MyCrossword, becoming a setter](https://www.mycrossword.co.uk/blog/becoming-a-cryptic-setter)).
- Published Quick Cryptic clues are terse (4–6 words, nothing idle); the average Cruci clue runs
  5.9 words, and the extra word is usually padding ([audit 02 §4](../audit/2026-10-02/02-clue-sample.md)).

**How it is measured.** **RULES**: the flags F-IDLE (any single word with no role) and F-PRINTED,
the surface gate's orphan check (a multi-word idle span, or two idle words, fails the gate), and
the validator's article rule (an article swallowed inside an op fails). F-IDLE was specified as
the rule R-IDLE and demoted to a flag (spec revision 2): whether a word is idle can need
judgement, so the exam's auditor rules on each flag.

**Pass bar.** No surface-gate or article failure; every F-IDLE and F-PRINTED fixed, or answered
with a recorded reason the auditor accepts.

**Exemplars.**

| Grade | Clue | Why |
|---|---|---|
| GREAT | PIANO — *Quietly grand? (5)* · `dd-piano` | Two words, both definitions. |
| GREAT | CAPTAIN — *Skipper entangled in a pact (7)* · `anagram-captain` | Definition, indicator, fodder; nothing else. |
| GOOD | DESIGN — *Badly signed drawing (6)* · `anagram-design` | Three words, three jobs; a little flat. |
| GOOD | SOLE — *Only the underside of a shoe (4)* · `dd-sole` | Two abutting definitions, no glue. |
| WEAK | ALERT — *Later, he was drunk but still sharp (5)* · *judgement example* | "he was", "but still" do nothing. |
| WEAK | SPEAR — *A broken spare can still serve as a weapon (5)* · *judgement example* | "can still serve as" is padding. |
| WEAK | CHARITY — *The cleaner had it all year, doing good works (7)* · *judgement example* | "had", "all", "doing" do nothing in CHAR + IT + Y. |

**Common failure modes** ([audit 02 §3.2, §3.5](../audit/2026-10-02/02-clue-sample.md)).
- **"…he was / she still / they still managed to / won't stop us…"** story padding around an anagram.
- **Nouns added to make an anagram plausible** ("Pupils", "Members", "horse", "soldier"): these are
  also Soundness failures.
- **Glued double definitions**: PEN "Writer *kept in a* sheep enclosure", WIND "Coil *tightened in
  the* gale", SAGE "Herb *that's* wise *and old*". Double-definition halves should abut.
- **Free articles**: SOUP "*An* opus reworked as a starter", HARM "*A* hard limb".

---

## 7. Penny-drop (wit)

**Definition.** When the answer and parse are revealed, the solver feels a click of delight: the
surface and the cryptic reading are both true in a way that surprises. The best penny-drops come
from a single clean twist (a deceptive sense, a fused phrase, a joke that is also the definition),
not from complexity. Penny-drop is judged **with the answer shown**: it is the relation between the
surface and the answer, so it cannot be judged blind.

**Why.**
- The Listener guidance gives more licence to a puzzle with many penny-dropping moments than to
  one with few ([Listener, guidance for setters](https://listenercrossword.com/HTML/Reference06.html)).
- Machine clues lack wit: ENIGMA's expert reviewers found most clues lacking human wit and
  originality ([Crossword Unclued on ENIGMA](https://www.crosswordunclued.com/2012/02/can-computer-program-write-cryptic.html)).
- Humour is where LLM judges are weakest; on New Yorker captions, models fell short of top human
  entrants, and the authors recommend ranking against human references
  ([Zhang et al., NeurIPS 2024](https://arxiv.org/abs/2406.10522)). Hence a tournament with
  published anchors, not an absolute score.
- Our old panel scored wit without seeing the answer, which only measured "sounds like a clue"
  ([audit 01 §1](../audit/2026-10-02/01-clue-system.md)).

**How it is measured.** **TOURNAMENT-WIT**: pairwise, both orders, answer and parse revealed,
Bradley–Terry over finalists plus anchors of the same device.

**Pass bar.** Beats or ties the median anchor of its device.

**Exemplars.**

| Grade | Clue | Why |
|---|---|---|
| GREAT | MARKET — *A fair part of Denmark, etc. (6)* · `hidden-market` | "etc." does real work; "fair" flips from adjective to noun. |
| GREAT | PIANO — *Quietly grand? (5)* · `dd-piano` | Both meanings fit "grand" at once. |
| GOOD | COD — *Often battered, sometimes mocked? (3)* · `cd-cod` | Battered fish; *cod* = mock. |
| GOOD | EARNEST — *Serious money down? (7)* · `dd-earnest` | Earnest money is money down. |
| WEAK | GRANDMOTHERLY — *Inclined to spoil you rotten between rounds of knitting? (13)* · *judgement example* | A stereotype with a "?"; nothing clicks. |
| WEAK | SAND — *What runs out in an hourglass? (4)* · *judgement example* | A straight definition; the reveal is a shrug. |

**Common failure modes.**
- **The "?" habit**: 75 clues (18%) end in "?"; part-j is 33 of 49 CDs, reading like a riddle book.
- **Mechanical word-sums** with nothing to see through: CHAMPION "Support the champ taking one on".
- **Over-clever pile-ups**: more than about two devices to track; one clean penny-drop beats three
  muddy ones.
- **Wit traded for soundness**: never. A sound plain clue beats a witty unsound one.

---

## 8. Originality

**Definition.** The surface wording is ours. It is not a near-copy of a published clue for the same
answer, not a known chestnut pairing (STRESSED/DESSERTS, LAGER/REGAL), and not a re-use of an
over-worked bank template or of the teaching corpus's fodder for the same answer. Constructions
forced by the letters (DOG + MA) are shared knowledge and may be reused; the **sentence** must be
new.

**Why.**
- Alberich rejects tired combinations even when sound, citing *carthorse* → ORCHESTRA as having no
  real connection between its parts ([Alberich, tips](https://www.alberich-crosswords.com/articles/tips-for-setters)).
- Ximenes calls well-worn devices such as plain quotations with blanks lazy ([Ximenes ch. 5](https://xotaotc.nfshost.com/chapter-5-cluemanship/)).
- Rufus (Roger Squires) kept an index of some 200,000 past clues to avoid repeating himself
  ([Crossword Unclued interview](http://www.crosswordunclued.com/2011/11/interview-roger-squires.html)).
- LLM writing converges: co-writing with models makes output more alike
  ([Padmakumar & He](https://arxiv.org/abs/2309.05196); [Anderson et al.](https://arxiv.org/abs/2402.01536)).
  ENIGMA's reviewers noted it could not tell an over-used clue from a fresh one
  ([Crossword Unclued on ENIGMA](https://www.crosswordunclued.com/2012/02/can-computer-program-write-cryptic.html)).
- A local corpus makes the check deterministic: George Ho's cryptics dataset (ODbL; clue texts
  remain the publishers' copyright, used for checking only, never shipped)
  ([cryptics.georgeho.org](https://cryptics.georgeho.org/)).

**How it is measured.** **RULES**: R-COPY blocks only a **near-verbatim copy** of a published
clue for the same answer (`scripts/clue-flags.mjs`); a shared construction or similar wording is
not copying (owner, 2026-10-02). F-CHESTNUT (informational: a key wordplay word shared with ≥ 3
published clues for the answer, or a known chestnut pair), F-TEMPLATE (over-used bank n-gram
template), B-REPEAT (a batch flag: the same indicator or scene template more than twice).

**Pass bar.** No R-COPY. No unresolved F-CHESTNUT, F-TEMPLATE or B-REPEAT. A flag is resolved by rewording,
by changing device, or (teaching corpus only, where the canon is the lesson) by a recorded decision
in case law.

**Exemplars.** *Originality grades are provisional until F-CHESTNUT has been run against the corpus.*

| Grade | Clue | Why |
|---|---|---|
| GREAT | TEA — *What's a drink in London is dinner in Leeds? (3)* · `cd-tea` | A fresh angle on a three-letter answer that is usually clued the same few ways. |
| GREAT | NET — *What's left when ten's knocked over (3)* · `reversal-net` | The TEN/NET reversal is common; the bowling scene is not. |
| GOOD | CROCODILE — *Snapper, or schoolchildren two by two? (9)* · `dd-crocodile` | Familiar senses, own wording, British flavour. |
| WEAK | STRESSED — *Tense when puddings are sent back (8)* · *judgement example* | STRESSED/DESSERTS appears three times across bank and teaching corpus. |
| WEAK | ORCHESTRA — *Cart horse trained for the pit (9)* · *judgement example* | The very chestnut Alberich names. |
| WEAK | VILE — *Terribly evil (4)* · *judgement example* | The textbook example, known to every solver. |

**Common failure modes** ([audit 02 §3.7](../audit/2026-10-02/02-clue-sample.md)).
- **About 15 chestnuts**: REGAL/lager, STRESSED/DESSERTS, VILE, ASTRONOMERS/moon starers,
  CONVERSATION/conservation, TREASON/senator (twice), LISTEN/SILENT (three times), EARTH/heart,
  ORCHESTRA/cart horse, REWARD/drawer (twice), CARPET "Pile on the floor?".
- **Bank/teaching overlap**: 15 answers in both, about 8 with the same mechanism, so the learner
  meets the identical trick twice.
- **Answer families** (EAR- ×14, STAR- ×5, OVER- ×5) breeding the same split.
- **Repeated openers**: "Some…" ×15, "What…?" ×10, "It…?" ×10.

---

## 9. Difficulty honesty

**Definition.** The clue's `difficulty` (1–5) and `par` (2–6) state truthfully how hard it is, and
the hardness comes only from fair sources: oblique definitions, real misdirection, layered
wordplay, length. Never from unsoundness, loose definitions, weak abbreviations, obscure words or
a missing indicator.

**Why.**
- Times Quick Cryptic editorial guidance names oblique definitions, unfamiliar wordplay elements
  and complex constructions as what makes clues hard (as researched for clue-style §7b; full
  reference in `07-sources.md`).
- Minute Cryptic sets par from checking letters (about half of an answer's letters are checked;
  par allows half of those) plus a hint; averaging par means you are ready for a full crossword
  ([Minute Cryptic](https://minutecryptic.com/stats)).
- Alberich lists obscurity as a failure in cryptic definitions ([Alberich, cryptic definitions](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/crypdef.html)).
- The bank's difficulty is compressed: 272 of 415 clues at 3, 16 at 4, none at 5, because hard
  clues cannot be built from hiddens and double definitions ([audit 02 §3.9](../audit/2026-10-02/02-clue-sample.md)).

### 9.1 Difficulty rubric (1–5)

- **1–2 (Gentle):** one simple device; common words; transparent definition; minimal misdirection.
  Stage-A teaching clues live here.
- **3 (Moderate):** a single device with real misdirection, or a clean two-part charade or
  container; an oblique definition.
- **4 (Tougher):** layered wordplay (container + abbreviation, reversal + charade), a well-disguised
  definition, strong surface misdirection.
- **5 (Hard):** multi-step constructions, &lit, subtle definitions. Use sparingly.

`difficulty` feeds the puzzle difficulty bands; set it honestly.

### 9.2 Par rubric (the Daily's target score, 2–6)

Every bank clue carries `par`: the hints + letters a capable improver (someone who could finish a
broadsheet cryptic with a little help) would spend on the Daily. Averaging par means you're ready
for full puzzles. Researched against Minute Cryptic (par as a crossword benchmark built on
checking letters; CONTEST (7) = par 3) and Times Quick Cryptic editorial guidance (oblique
definitions, unfamiliar wordplay elements and complex constructions are what make clues hard).

**par = A + B + C + D + E, clamped to 2–6**

| | Factor | Score | Set by |
|---|---|---|---|
| A | Crossing-letter allowance: a grid checks ~half the letters; par allows half of those | 3–6 letters: 1 · 7–10: 2 · 11+: 3 | `scripts/par-baseline.mjs` |
| B | One hint | 1 | fixed |
| C | Layered wordplay: ≥ 2 real operations, any abbreviation, or a cryptic definition | 0/1 | `scripts/par-baseline.mjs` |
| D | Oblique definition: not the obvious synonym; disguised part of speech; definition by example; hard-to-see whole-clue pun | 0/1 | 3 blind judges, majority |
| E | Misdirection / hard to see: surface steers wrong, indicator hiding as a natural word, unfamiliar vocabulary or crossword-ese | 0/1 | 3 blind judges, majority |

**Process.** `node scripts/par-baseline.mjs` → three independent judge agents (editor, coach,
newer-solver lenses) score D/E per clue into `tmp/par/judge-{1,2,3}-batch-{1,2}.json` →
`node scripts/par-apply.mjs` writes `par` into the bank and flags pars out of line with
`difficulty` (difficulty ≤ 2 with par ≥ 5, or ≥ 4 with par 2). The editor resolves flags by hand in
the script's `OVERRIDES`, with a reason. `bank.par.test.ts` fails if any clue lacks a par. First
run (2026-10-02): judges unanimous on 88% of D and 80% of E; spread par 2 ×108, 3 ×167, 4 ×97,
5 ×33, 6 ×10. **Later:** once Daily analytics (`daily_solved` score) has enough plays, re-judge any
clue whose median player score sits ≥ 2 from its par.

*Note:* factor E counts "unfamiliar vocabulary or crossword-ese" as hardness for par, because it
does cost the solver hints. That is a measurement, not a licence: crossword-ese still fails
Surface naturalness (§3).

**How it is measured.** The par rubric above (A–C by script; D/E by three blind judges).
**COLD-SOLVE** is the cross-check: solver confidence and the number of solvers who get it should
fall as par rises. A clue that is hard *because* COLD-SOLVE finds it ambiguous is a Soundness or
Definition failure, not a difficulty 5.

**Pass bar.** `par` present; no unresolved `par-apply` flag; `difficulty` matches §9.1; when
COLD-SOLVE disagrees sharply with par (all three solvers instant on a par 5–6, or none solving a
par 2–3), the clue is reviewed and the outcome recorded.

**Exemplars.**

| Grade | Clue | Why |
|---|---|---|
| GREAT | EARNEST — *Serious money down? (7)* — d4, p4 · `dd-earnest` | Hard for fair reasons: a disguised second definition. |
| GREAT | BREAD — *Bachelor devoured the dough (5)* — d3, p5 · `charade-bread` | Abbreviation + deceptive senses; par reflects real misdirection. |
| GOOD | CAPTAIN — *Skipper entangled in a pact (7)* — d3, p3 · `anagram-captain` | One anagram with real misdirection: a textbook 3. |
| WEAK | MONARCH — *Butterfly seen by man on arch? (7)* — d3, p6 · *judgement example* | High par driven by a weak abbreviation (man → M) and a decorative "?": hardness from unfairness. |
| WEAK | TIP — *Pointer rising from the pit (3)* — d2, p4 · fails: `reversal-tip` | A 3-letter difficulty 2 made harder by a direction indicator with no grid. |

**Common failure modes.**
- **Compression at 3**: labelling by habit rather than by the rubric.
- **Hardness from faults**: weak abbreviations, ambiguous CDs, loose definitions, which raise par
  without being fair. Fix the clue, do not raise the number.
- **Missing tail**: no container + abbreviation, reversal inside a charade, or subtractive anagram
  constructions; the bank cannot deliver "ready for full puzzles" without them.

---

## 10. The teaching register (Stage-A corpus, `src/data/clues.ts`)

**Definition.** A teaching clue is a **fully real cryptic clue**. It is gentle only in vocabulary
and device choice, never in its disguise. All five rules must pass:

1. **Real cryptic clue.** The answer and its parts are disguised, never written in plain sight;
   there is a genuine penny-drop.
2. **One natural statement.** The whole clue reads as a phrase or sentence you would actually
   meet, evoking a coherent image. No crossword strings, no gibberish; grammatical.
3. **Definition woven, not tacked.** It sits at the start or end and is part of the sentence, never
   bolted on after a comma or colon, and always a word people use (never "a drinking tube").
4. **Never narrate the mechanic.** No "spell X backwards", "beheaded, is", "sent back". The device
   hides inside an ordinary word or idiom doing double duty.
5. **Gentle, not transparent.** Common words, the most learnable device per slot, well-known
   abbreviations, one device, one clear definition. Difficulty comes from fair disguise, not from
   obscurity and not from giving the answer away.

**Why.** The Stage-A lessons are the first clues a learner meets. The trap we fell into once was
"beginner = transparent": give-aways like a pig's tail spelled out as PIGTAIL. The rules were
derived from published beginner cryptics such as the Guardian Quick Cryptic, whose clues are
terse, fully cryptic and lean on acrostics, hiddens and homophones
([Fifteensquared, Guardian Quick Cryptic 119](https://fifteensquared.net/2026/07/11/guardian-quick-cryptic-119-by-garson/);
[Quick Cryptic 103](https://fifteensquared.net/2026/03/21/guardian-quick-cryptic-103-by-ludwig/)).

**How it is measured.** The same exam as the bank, with these differences: `difficulty` 1–2;
F-PRINTED is checked by hand for **every** piece of any length (rule 1; the code only sees pieces of
3+ letters); TOURNAMENT anchors are published
Quick Cryptic clues of the same device; a newer-solver lens is one of the three COLD-SOLVE agents
and must solve it. Teaching answers are not grid-locked: if an answer cannot reach the bar in its
device, **swap the answer and keep the device** (PIGTAIL → DOGMA, MANKIND → HOGWASH,
EACH → ANGER), keeping at least one clue per device. Validate with `integrity.test.ts` and
`curriculum.test.ts`.

**Pass bar.** All five rules pass, plus every bar in §1–§9 at teaching difficulty.

**Exemplars.**

| Grade | Clue | Why |
|---|---|---|
| GREAT | DOGMA — *Follow Mother's teaching (5)* · `charade-dogma` | DOG + MA, both hidden in ordinary words; "teaching" is woven in. |
| GREAT | OVEN — *The coven lost its head over the cooker (4)* · `deletion-oven` | The deletion idiom does double duty as a real phrase. |
| GOOD | BARGAIN — *Pub profit is a steal (7)* · `charade-bargain` | BAR + GAIN; terse and natural. |
| GOOD | HOGWASH — *A pig's laundry? Nonsense! (7)* · `charade-hogwash` | Playful, disguised, one device. |
| WEAK | EVENT — *Seven tents partly cover the event (5)* · *judgement example* | The definition is the answer word itself. |
| WEAK | CARTON — *The con hides art in a box (6)* · *judgement example* | CON and ART printed: the answer is spelt out (breaks rule 1). |
| WEAK | PADLOCK — *Apartment's key feature is a security device (7)* · *judgement example* | "key feature" → LOCK is a pun, not a definition. |

**Common failure modes.** Transparent give-aways; narrated mechanics ("sent back, spell…");
printed parts (CARTON, PIRATE); duplicating bank answers and fodder (15 overlaps, about 8 with the
same mechanism) so the learner meets the same trick twice.
