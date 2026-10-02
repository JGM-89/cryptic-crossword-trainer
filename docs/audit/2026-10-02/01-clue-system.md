# Audit 01: the clue-writing system

*Scope: `.claude/skills/clue-writer/SKILL.md`, `docs/clue-style.md`, `docs/clue-pipeline.md`, `PRODUCTIONPLAN.md`, `src/data/surface-rules.ts`, `src/data/integrity.ts`, `scripts/validate-clue.ts`, `scripts/lint-surfaces.ts`, the bank (`src/data/bank/part-*.json`), and git history. Written 2026-10-02.*

## Verdict

The mechanical half of this system is excellent. It is better than what most amateur setters have, and the history shows each gate was added after a real failure. The judgement half is mostly theatre. The skill asks one model to write about four candidates, then has copies of the same model score them on absolute 1–5 scales, with no anchors and without seeing the answer. That setup cannot reliably tell a great surface from a merely grammatical one, and it cannot judge wit at all.

The strongest evidence is what the gauntlet has actually produced. The incentives point the wrong way, and the output has collapsed towards the easiest device to pass rather than the best clue.

**The part-j finding.** The one batch written end-to-end through the Clue Writer (part-j, 49 clues) is 33 cryptic definitions, 11 double definitions, and only 5 wordplay clues. That is 90% whole-clue devices. A broadsheet puzzle runs about 1–3 CDs in ~28 clues. Part-j alone supplies 33 of the bank's 52 CDs. Many of them are general-knowledge questions with a question mark on the end, not cryptic definitions. Examples: ELM "Tree lost to a Dutch disease?", OAK "Royal tree on a thousand pub signs?", MAPLE "Tree whose leaf Canada flies?", SAND "What runs out in an hourglass?", ARC "The path of everything you throw?". Alberich names this exact failure: a CD whose real meaning leaps out is not cryptic. All of these passed three blind realism rounds with "zero majority fails" and a "median surface ≥ 4" ceiling panel.

## 1. Where quality leaks: each gate, real signal or theatre

| Stage | Verdict | Why |
|---|---|---|
| Raw-material analysis (step 1) | **Weak signal** | The right idea, but the model enumerates from memory. It has no word lists, thesaurus, or phrase corpus, so it finds the obvious splits and misses the natural-phrase carriers a human finds by browsing. |
| Drafting: ≥4 candidates, ≥3 devices | **Main leak** | Four drafts written in one context by one author are highly correlated: the same register, the same idea with small variations. Best-of-4 from a collapsed distribution is still the mode. Setters discard far more than they keep. |
| Mechanical gate (`integrity.ts`, `surface-rules.ts`) | **Real signal for wordplay devices; zero for whole-clue devices** | Letter accounting, true-insertion, concat composition, swallowed-article, ABBR whitelist and orphan coverage are genuinely good. But `orphanSpans` returns `[]` for double-def/CD/&lit, and `validateClue` does nothing device-specific for them. The 31% of the bank that is CD or DD bypasses the hard gate entirely. A setter under pressure takes the path the gate doesn't police, and part-j shows it did. |
| Orphan gate link-word list | **Leaky** | `a`/`an` are free link words, so SOUP "**An** opus reworked as a starter" passes with a padding article. The article rule in §6 only catches `"a cake"→CAKE` inside an op. |
| Blind realism (3 judges, majority) | **Real but shallow** | Hiding answers from the realism judges is correct. But the prompt says "PASS generously" and asks for fails only, which biases towards passing. The three "lenses" are the same model, so their errors are correlated and a 2-of-3 majority behaves like one judge. Realism also isn't the bar: a CD written as a natural question passes trivially. This gate stops gibberish. It does not find greatness. |
| Ceiling panel (median surface ≥ 4, wit ≥ 3) | **Mostly theatre** | (a) Absolute LLM ratings bunch up at 4, so "≥4" means "the model liked it". (b) Wit is scored **without the answer**, and the penny-drop *is* the relation between surface and answer, so blind wit scores measure "sounds like a clue". (c) Wit ≥ 3 is defined in the prompt as "mildly pleasing", which sets the floor at flat. (d) The fallback is to ship anyway: 7/50 shipped "at competent tier". A gate with an escape hatch for its own failures is advisory. (e) There are no anchors, so nobody knows whether a 4 here equals a 4 at the Times. |
| Originality (web search) | **Real but expensive and patchy** | Searched by hand, only on "short/common" answers, and only for verbatim matches. A local corpus would make this deterministic (§4, P1). |
| Semantic audit (1 agent per batch) | **Leaky** | One same-model pass over 50 clues. It caught 8 errors in part-j but let these through: JAM "stuck in traffic" (that defines *in a jam*, not JAM); BAY "Window" (a bay window is not a bay); HILL defined as "the climb"; CLIFF "Richard's" (a possessive standing for a first name); MAP "shows you where to get off" (a map doesn't). |
| Par judges | **Fine** | Not a quality gate. Majority-of-3 is adequate for a 0/1 factor. |
| Owner gate | **Real but mis-designed** | The only non-LLM signal. But the owner sees one winner per answer, next to the panel scores (anchoring), in a 50-clue sitting (fatigue). The owner's choices are not recorded, so the system never learns house taste. |

**The thresholds disagree across documents.** The style guide says surface ≥ 4 and (surface + wit) ≥ 7 on a four-axis composite. The skill says median surface ≥ 4, median wit ≥ 3, no surface score ≤ 2. The runbook's SURFACE GRADER is not blind (it reads the full part file), and SURFACE POLISH requires keeping the same `clueType`, which contradicts "device is free". The runbook still describes parts a…h. Whichever document an agent reads first sets the bar, and that is drift.

**Nothing is auditable.** Candidates, judge outputs and panel scores live in gitignored `tmp/`. Bank entries carry no provenance: no scores, no round, no model, no owner verdict. When Daily analytics arrive, you will not be able to ask whether the panel predicted anything.

## 2. LLM failure modes, and whether the process counters them

1. **Mode collapse into whole-clue devices and question-mark riddles.** *Not countered; the gates encourage it.* Natural questions pass realism, the orphan gate exempts them, the validator can't check them, and the blind panel can't see that they aren't cryptic.
2. **Crossword-ese and flat surfaces.** *Partly countered.* Blind realism kills word salad. Nothing pulls surfaces *up* towards headline- or novel-grade prose, because the model has no reference text to imitate or measure against.
3. **Self-preference and correlated judges.** *Acknowledged ("never self-certify") but not solved.* Judges are separate agents, but they share the author's model, priors and taste. LLM-as-judge research documents self-preference and position bias, and three copies of one model don't fix either.
4. **Judges that can't see wit.** *Built into the design.* Wit is judged blind.
5. **Rubber-stamping.** *Partly countered* by blind judging and the fails-only format. But "PASS generously", no anchors and no measured fail rate mean nobody would notice if the judges went soft. Zero majority fails across three part-j rounds is a warning sign, not reassurance.
6. **Semantic overreach** (near-synonyms, wrong part of speech, half-senses in DDs). *Partly countered* by one auditor. There is no lexical evidence requirement and no dictionary lookup.
7. **No real-world reference text.** *Not countered.* The style guide has about 15 exemplar clues in total. The setter never sees a corpus of excellent published clues, and never checks its surfaces against real English usage.
8. **Fairness blind spots** (multiple answers, CDs that admit three answers at (3)). *Not countered.* No one ever attempts to *solve* the clue cold.

## 3. How human setters actually get great surfaces

- **Raw material first, then hunt for a context in which the pieces already cohere.** Setters list every fodder option and every synonym for each piece, then look for a real-world scene (a cricket report, a kitchen, a courtroom) where those words naturally sit together. Alberich's example: "Hits leg breaks…" works because it is a cricket sentence. The craft is choosing among *synonyms* until the pieces share a domain, not polishing one draft.
- **Run the "would it get search hits" test.** Alberich suggests checking whether a constructed phrase occurs in real writing; zero hits means it is crosswordy. This is mechanisable.
- **Fit the indicator to the surface's domain** (crosswordunclued's "tool" as a metalworking anagrind). Accept an easy-ish clue if the surface is flawless.
- **Use CDs only when there is a genuine double reading.** A neat CD has a misleading reading and a true one. If the true reading leaps out, it isn't a CD (Alberich).
- **Read aloud and use editor rounds.** Manley's read-aloud test is already in the guide.
- **Cold test-solving is standard.** The Listener's two vetters solve every submission cold, with the solution concealed, exactly as a solver would. National dailies have editors and test-solvers. Cruci has no cold solve anywhere in its gauntlet.
- **Volume and discard.** Setters keep a small fraction of what they draft. Quality comes from selecting out of a wide, diverse pool, which is the opposite of a four-draft pool.

## 4. Redesign, prioritised by surface quality per unit effort

### P0: do these first (days of work, highest impact)

**P0.1 Add a cold-solver gate.** *(Effort S, impact very high.)* A fresh agent gets only `clue (enum)`. It must give its top three answers with confidence, the parse it believes, and whether the definition alone gave it away. Record four things: solved, unique answer, *solved from the literal reading alone*, and alternatives. For CDs, a confident solve from the literal reading means the clue is a quiz question, so reject it. If a near-equal alternative answer exists, the clue is unfair. This one gate would have killed roughly a third of part-j.

**P0.2 Split judging into three information states, and stop scoring wit blind.**
- *Naturalness (blind, no answer, no crossword framing):* use a "spot the clue" decoy test. Mix candidate surfaces with real sentences and headlines, and ask the judge which ones came from a crossword. A surface that cannot be told apart from prose is top-tier. This replaces 1–5 naturalness scores.
- *Fairness and difficulty:* the cold solver (P0.1).
- *Wit (revealed):* after the solve attempt, show the answer and parse, then ask "how good was the aha?". Run this pairwise (below).

**P0.3 Replace absolute scores with pairwise tournaments.** *(Effort S, impact high.)* Per answer, put the finalists into a Swiss or round-robin tournament. Present each pair in both orders to cancel position bias, and fit Bradley–Terry rankings. LLMs are much more reliable at "which is better, A or B" than at "is this a 4".

**P0.4 Set device quotas and a CD contract.** *(Effort XS.)* Per batch, cap CD+DD at about 25% (3-letter answers excepted, with the cap applied to the batch). A CD must state its two readings, misleading and true, in a field like `pun`. If it can't name the misleading reading, it isn't a CD. Add a gate that rejects a CD whose literal reading the cold solver solves.

**P0.5 Make one threshold canonical.** *(Effort XS.)* The skill is the authority. Make the style guide §1 and the runbook point at it, make the SURFACE GRADER blind, and remove "same clueType" from POLISH.

### P1: next (about a week, high impact)

**P1.1 Generate wide: 20–40 candidates per answer.** *(Effort M.)* Fan out 4–6 independent setter subagents, each locked to one device and one **surface domain**: sport report, kitchen, Westminster headline, office email, gardening, theatre, pub chat. Independence breaks mode collapse; domains force variety. Cheap filter: validator, then cold solver, then the decoy naturalness test. Only the top ~6 go to the tournament. Generation is cheap; judging should be spent only on survivors.

**P1.2 Mine raw material with tools, not memory.** *(Effort M.)* Write a `scripts/raw-material.mjs` that, given an answer, emits:
- anagram fodder from word lists (single words and natural two-word phrases);
- hidden carriers found in a phrase/idiom/headline corpus (e.g. Wiktionary idioms, an n-gram list);
- charade and container splits with thesaurus synonyms for each piece (WordNet or Moby);
- reversal words;
- every sense for DDs.

The LLM then does what it is good at: finding the scene in which mined pieces cohere. This is exactly how setters work.

**P1.3 Add a local clue corpus for originality and calibration.** *(Effort S–M.)* George Ho's cryptics dataset (~500k clues from Fifteensquared and others; free SQLite/CSV) gives three uses:
- (a) a deterministic near-duplicate check (token and fuzzy match), replacing ad-hoc web searches;
- (b) chestnut frequency per answer;
- (c) calibration anchors.

Keep it local, use it for checking only, and never ship or quote it in the product.

**P1.4 Add calibration anchors to every judging batch.** *(Effort S.)* Mix in 10–20% known items: published clues (from the corpus, e.g. ones bloggers singled out) plus known-bad clues (rejected Cruci drafts, old pre-rebuild bank clues). Measure each judge's discrimination (AUC) and fail rate per batch. If anchors don't separate, the judges are blind that day, so don't trust the batch. This is the only way to know whether "median 4" means anything.

**P1.5 Require lexical evidence in the semantic audit.** *(Effort S.)* Every `synonym` op, every DD half and every definition carries `evidence` (a dictionary or thesaurus sense line, with part of speech). Where possible, check it automatically against WordNet or Wiktionary, and send only the misses to the auditor. Homophones: check against a British-English pronunciation dictionary.

### P2: when you have the time (medium impact)

**P2.1 Write a provenance ledger.** *(Effort S.)* Commit `src/data/bank/ledger.jsonl` with, per shipped clue: candidates considered, tournament rank, solver result, anchor-calibrated judge scores, model, date, owner verdict. This makes the system auditable and lets you join it to analytics later.

**P2.2 Redesign the owner gate.** *(Effort S.)* Show 2–3 finalists per answer, with no scores. The owner solves first and then sees the parse. Cap a session at 20 clues. Log every pick. Picks become a **house-taste exemplar file** (best in-house clues per device, each with a one-line "why it works"), injected as few-shot examples into setter prompts. This is the cheapest strong counter to crossword-ese.

**P2.3 Add a crossword-ese detector.** *(Effort S.)* Score each surface's adjacent word pairs and triples against an n-gram frequency list. Surfaces with rare joins (e.g. "takes ill on the climb") get flagged before any judge sees them. This is Alberich's search test, mechanised.

**P2.4 Use different models as judges where available** (e.g. one non-Opus judge) to decorrelate errors.

### P3: needs real users

**P3.1 Retire and upgrade clues from Daily analytics.** Use `daily_solved` score against par, give-up rate, tier of first hint, and a one-tap "good clue? 👍/👎" after the solve. Flag clues for rewrite when give-ups are high (unfair or obscure), when nearly everyone solves at 0 hints (it screams the answer), or when ratings are poor. Join to the ledger to learn which pre-ship signals actually predict player delight, then drop the gates that don't.

### Immediate content action

Re-run part-j's 33 CDs and the five dubious DDs (JAM, BAY, CLIFF, HARP, plus HILL's definition) through P0.1. Expect to rebuild 10–20 of them, many with hidden, reversal or charade devices now that short-word supply exists.

## 5. Scorecard (1–10)

| Dimension | Score | One-line reason |
|---|---|---|
| **Reliability** (the same process gives the same quality) | **5** | Mechanics are deterministic. Judgement is uncalibrated and the panel has an escape hatch, so quality depends on how good the drafts in that context happened to be. |
| **Surface ceiling** | **5** | Reliably natural, rarely brilliant. Four correlated drafts, no corpus, no exemplars and blind wit cap it at "competent". The part-j collapse to CDs shows the ceiling is bought by avoiding wordplay. |
| **Fairness** | **7** | The best part: a strong validator for wordplay devices and a strict ABBR whitelist. It loses points for zero mechanical coverage of 31% of the bank, no cold solve, and the semantic misses that shipped. |
| **Cost-efficiency** | **5** | Too little spent on generation (cheap, the main lever) and too much on six absolute-score judge calls per batch that carry little signal. |
| **Auditability** | **3** | Evidence lives in gitignored `tmp/`, entries have no provenance, thresholds differ across three documents, and nothing measures whether the judges discriminate. |

## Sources

- [Alberich: Surface reading](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/surface.html): the coherent-picture standard, grammar first, the search-engine test for crosswordy phrases.
- [Alberich: Cryptic definitions](https://xteddy.org/mirror/alberichcrosswords/www.alberichcrosswords.com/pages/crypdef.html): CDs fail through obscurity, ambiguity, or a lack of deception.
- [Crossword Unclued: Camouflaging anagrams](https://www.crosswordunclued.com/2009/11/camouflaging-anagrams.html): indicators fitted to the surface; a flawless surface beats trickiness.
- [Listener Crossword: Guidance for Setters](https://listenercrossword.com/HTML/Reference06.html): two vetters solve every submission cold.
- [Wikipedia: Cryptic crossword](https://en.wikipedia.org/wiki/Cryptic_crossword): surfaces should evoke a picture; the conversation standard.
- [cryptics.georgeho.org](https://cryptics.georgeho.org/): ~500k-clue open dataset (Fifteensquared and others) for originality checks and calibration.
- [Sadallah et al., "What Makes Cryptic Crosswords Challenging for LLMs?"](https://arxiv.org/abs/2412.09012) and ["Are LLMs Good Cryptic Crossword Solvers?"](https://arxiv.org/abs/2403.12094v2): LLMs still lag humans at the cryptic reading, which is why an LLM judge can't be trusted to see wit unaided.
