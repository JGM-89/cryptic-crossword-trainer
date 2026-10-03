# 06 · Case law

> **Status:** v1, seeded 2026-10-02 from the git history of the bank (`src/data/bank/`), the
> teaching corpus (`src/data/clues.ts`), the old style guide and runbook, and the macro audit
> (`docs/audit/2026-10-02/`). Every entry cites a commit or an audit section. Nothing here is
> reconstructed from memory.

## What case law is

The rules chapter (`03-rules-and-flags.md`) says *what* is checked. Case law says *why*. Each
entry records something that went wrong, or a decision that was hard to reach, and what it
changed: a rule, a flag, an exam step, an exemplar, or a step in the process. A new agent reads
this chapter so that it inherits the lessons instead of repeating them.

Most of the rules in this Bible exist because a clue like the ones below shipped. When a rule
seems pedantic, find its entry here and read the clue that caused it.

## The standing rule: every batch adds case law

1. **Every batch report must end with a case-law section.** Either it adds one or more entries,
   or it says in one line "No new failure pattern", along with the ledger run ID that supports
   that.
2. **What counts as new:** any failure the exam caught that no existing entry explains; any
   failure that got *past* the exam and was found later (by the owner, a solver, analytics or an
   audit); any change to a judge prompt or threshold, including each calibration iteration (plan
   D5); and any owner decision.
3. **Owner decisions are recorded the same day**, as entries with status *Standing decision*.
4. **If the pattern can be detected mechanically, the entry must give a regression example
   first**: at least one failing clue in `examples/<device>.json` (verdict `fail`, with the exact
   error), and the existing rule or flag ID that catches it. A **new** rule is added to
   `03-rules-and-flags.md` only once its precision on published clues is shown (CL-044).
5. **Entries are append-only.** IDs never change and entries are never deleted. To correct or
   retire an entry, add a new one and set the old one's status to *Superseded by CL-NNN*.
6. **Superseded clue texts named here are bad anchors.** `scripts/exam/bad-anchors.mjs`
   (plan D2) mines them from git. Calibration needs them, so never rewrite history to hide one.

## Entry template

```markdown
### CL-NNN · Short title
- **Date:** YYYY-MM-DD (the event; "found YYYY-MM-DD" if it was found later)
- **What happened:** the failure or decision, in plain words.
- **Evidence:** commit hash(es), clue text(s) as shipped, the audit section.
- **Lesson:** the general principle, written so that it applies beyond this clue.
- **Change:** the rule / flag / exam step / exemplar / process change it produced (IDs).
- **Status:** see the status values below.
```

**Status values**
- **Closed:** enforced in code (the file is named) and no known violations are shipped.
- **Rule specified:** in the spec §2 catalogue (`8befc18`), with the code still to come (plan
  Phases B–D).
- **Open (content):** offending clues are still in the shipped bank or corpus. This is checked
  against the bank as of 2026-10-02.
- **Standing decision:** an owner decision, in force until a later entry supersedes it.
- **Superseded by CL-NNN.**

Where an entry has several parts, it gets a composite status (e.g. "Closed (gate); Open
(content)").

**Rule names in older entries.** Entries are append-only, so entries up to CL-043 keep the rule
IDs that were specified at the time. Current names (spec revision 2, CL-051): R-IDLE is now the
flag **F-IDLE**; R-PRINTED is now the flag **F-PRINTED**; batch checks (B-*) are flags;
F-UNATTESTED was rejected (CL-050); the DECOY test is replaced by **NATURALNESS**; F-QUIZ means
"no distinct second reading". Every rule can be waived for one clue with a written reason
(CL-044). The statuses below point to the entry that supersedes each part.

## Index

| ID | Date | Title | Rules / exam steps | Status |
|---|---|---|---|---|
| CL-001 | 06-03 | Unlisted abbreviations passed as "machine-checked" | ABBR gate | Closed |
| CL-002 | 06-03 | Nonsense anagram fodder | F-UNATTESTED (rejected), R-FODDER-LETTERS | Rule specified; Open; F-UNATTESTED superseded by CL-050 |
| CL-003 | 06-03 | Invented synonyms: the validator can't see meaning | F-DEF-EVIDENCE, EVIDENCE | Rule specified |
| CL-004 | 06-03 | The stored indicator wasn't in the surface, so the hints lied | indicator-in-surface gate | Closed |
| CL-005 | 06-03 | Best-of-N from one context is the mode, not the best | Writer method step 3 | Process specified |
| CL-006 | 06-03 | A clean report from one auditor | EVIDENCE, calibration | Superseded by CL-032 |
| CL-007 | 06-03 | COB's hidden indicator "past" | R-HIDDEN-IND | Rule specified; Open (COB); superseded in part by CL-049 |
| CL-008 | 06-03 | Down-only reversal indicators in a bank with no grid direction | R-INDICATOR-DIR | Rule specified; Open |
| CL-009 | 06-03 | Ending the "beheaded X" treadmill killed off a device | B-DEVICE-MIX, B-REPEAT (now flags) | Rule specified; superseded in part by CL-051 |
| CL-010 | 06-03 | OVERNIGHT: five versions, still among the worst | F-PRINTED (was R-PRINTED), R-ANSWER-IN-CLUE | Open |
| CL-011 | 06-04 | Indicators of the wrong type for their device | R-HIDDEN-IND, device chapters | Partly closed |
| CL-012 | 06-04 | Containment glue in a charade (ONCE → CONE) | containment-glue gate | Closed (gate); Open (MUSHROOM) |
| CL-013 | 06-04 | Unflagged definition by example | F-DEF-EVIDENCE | Rule specified; Open |
| CL-014 | 06-04 | A polish with the device locked produced padding | F-IDLE (was R-IDLE) | Rule specified; Open; superseded in part by CL-051 |
| CL-015 | 06-04 | Three copies of the gate; three copies of the standard | the Bible; `surface-rules.ts` | Closed (code); Bible in progress |
| CL-016 | 06-05 | Indirect deletions | deletion fodder-in-surface gate | Closed; superseded in part by CL-047 |
| CL-017 | 06-05 | Teaching clues: "beginner" read as "transparent" | §1c register | Closed |
| CL-018 | 06-05 | Surfaces that copy published clues | F-CHESTNUT | Rule specified |
| CL-019 | 06-05 | Decision: realism above wit; the device is free | quality: Surface naturalness | Superseded in part by CL-042, CL-051 |
| CL-020 | 06-05 | Realism bought by printing the answer's pieces | F-PRINTED, F-IDLE (were R-), R-ANSWER-IN-CLUE | Rule specified; Open; superseded in part by CL-051 |
| CL-021 | 06-07 | A single judge reading full entries rubber-stamped REIN | DECOY (now NATURALNESS), blind judging | Superseded by CL-032 |
| CL-022 | 06-10 | Assembled devices weren't letter-checked | composition gates | Closed |
| CL-023 | 06-10 | Swallowed and free-floating articles | F-IDLE (was R-IDLE) | Partly closed; superseded in part by CL-051 |
| CL-024 | 06-10 | Single orphan words: 17% of the bank is padded | F-IDLE (was R-IDLE), F-TEMPLATE | Rule specified; Open; superseded in part by CL-051 |
| CL-025 | 06-10 | Teaching swaps that print their own answer | R-ANSWER-IN-CLUE, F-PRINTED (was R-PRINTED) | Rule specified; Open |
| CL-026 | 06-10 | Chestnuts: STRESSED/DESSERTS three times | F-CHESTNUT | Rule specified; Open |
| CL-027 | 08-15 | The whole-clue hint bug (Daily #62) | device coverage | Closed |
| CL-028 | 08-15 | Owner decision: clues are always written through the system | — | Standing decision |
| CL-029 | 08-15 | Wit was judged without the answer | TOURNAMENT-WIT | Exam specified |
| CL-030 | 08-15 | The first workout shipped two quiz-question CDs | F-QUIZ, R-CD-CONTRACT, COLD-SOLVE | Rule specified; Open; F-QUIZ redefined by CL-051 |
| CL-031 | 08-15 | Part-j collapsed into cryptic and double definitions | B-DEVICE-MIX (flag), F-QUIZ, COLD-SOLVE | Rule specified; Open; superseded in part by CL-051 |
| CL-032 | 08-15 | Same-model judges are correlated; zero fails is a warning | calibration, anchors | Exam specified; amended by CL-051 |
| CL-033 | 08-15 | Definitions that fail a dictionary check | F-DEF-EVIDENCE, EVIDENCE | Rule specified; Open |
| CL-034 | 08-15 | The ceiling panel's escape hatch | tournament bar vs anchors | Exam specified |
| CL-035 | 08-15 | The owner gate was designed wrongly | Owner surface session | Superseded by CL-042 |
| CL-036 | 10-02 | Decision: every bank clue carries a par from a rubric | par rubric | Standing decision; Closed (test) |
| CL-037 | 10-02 | The audit's unsound list | many | Open |
| CL-038 | 10-02 | Template surfaces and stock definitions | F-TEMPLATE, B-REPEAT | Rule specified; Open |
| CL-039 | 10-02 | Americanisms and dated register | F-AMERICANISM | Rule specified; Open |
| CL-040 | 10-02 | The &lit crash: the app didn't cover every device | device coverage | Closed |
| CL-041 | 10-02 | Owner decision: site copy never says who wrote the clues | `ux-language.test.ts` | Standing decision; Closed (test) |
| CL-042 | 10-02 | Owner decision: the owner reads surfaces, blind, and nothing else | Owner surface session, DECOY (now NATURALNESS), TOURNAMENT-SURFACE | Standing decision; amended by CL-051 |
| CL-043 | 10-02 | Nothing was auditable | ledger | Exam specified |
| CL-044 | 10-02 | Owner decision: rules must never make clues arbitrarily harder | every rule; waivers; precision test | Standing decision |
| CL-045 | 10-02 | The old style guide taught broken examples (CHAIR, UNDERMINED, TAR) | executable examples | Closed (test) |
| CL-046 | 10-02 | Three validator loopholes | validator (`integrity.ts`) | Closed |
| CL-047 | 10-02 | Synonym-then-precise-deletion was wrongly banned | validator (deletion) | Closed |
| CL-048 | 10-02 | Daily hints reset when leaving an unfinished clue | Daily state | Closed |
| CL-049 | 10-02 | The hidden-indicator rule wrongly failed 12 clues | R-HIDDEN-IND | Closed |
| CL-050 | 10-02 | F-UNATTESTED tested and rejected | — | Closed (rejected) |
| CL-051 | 10-02 | Spec revision 2: demotions to flags, and exam changes | F-IDLE, F-PRINTED, B-*, F-QUIZ, COLD-SOLVE, NATURALNESS, calibration | Standing decision; Exam specified |

---

## 2026-06-03: foundations, and the first best-of-N wave

### CL-001 · Unlisted abbreviations passed as "machine-checked"
- **Date:** 2026-06-03
- **What happened:** The validator was described as machine-checked for fairness, but for
  charades and containers it only confirmed that the pieces joined up. Abbreviations were never
  checked. A learner caught COB clued with "old → B" (B is *born*, not old). The full audit that
  followed found WARM "worker → W", PANIC "copper → C" (copper is Cu) and STAIR "church → ST",
  and STAIR's container didn't even spell the answer (AIR in ST = SAIRT).
- **Evidence:** `1393467`, `98d62cd`. More of the same turned up in `248ea21` and `30f4bb0`:
  note → RE, current-unit → AMP, parking → P, shilling → S, gravity → G, number → TEN.
- **Lesson:** A check that is described as covering something must actually cover it. Every
  letter must come from a source the code can see. A recognised abbreviation is a closed list,
  not something the writer remembers.
- **Change:** `src/data/abbreviations.ts` (a whitelist). Every `abbreviate` op must match it, and
  the cue word must appear in the surface. Missing cues are added to the list by a human, never
  invented in a clue.
- **Status:** Closed (`integrity.ts`).

### CL-002 · Nonsense anagram fodder
- **Date:** 2026-06-03 (it came back later; found again 2026-10-02)
- **What happened:** The letters were right but the fodder wasn't English: CONVERSATION from "a
  convent Rois", NEUTRAL from "unalter", TELEVISION from "evil nose it". It came back in later
  waves as wrong-length fodder (GRADIENTS, CORRELATE in `30f4bb0`) and as invented phrases that
  no one writes: CORRELATE "Refined cartel ore", ASTRONOMY "An artsy moon", STARLING "superstar
  lingo". GENERAL's fodder "enlarged" has one more letter than the answer needs, yet it passed,
  because the anagram check only asks whether the fodder's letters appear in the clue as a
  substring.
- **Evidence:** `98d62cd`, `30f4bb0`; audit 02 §2 #1, #21, #60, #64.
- **Lesson:** Fodder that is letter-correct is still worthless if it isn't a phrase someone
  would write. Fodder should come from attested phrases, not be invented to fit the letters.
- **Change:** R-FODDER-LETTERS (the fodder *words in the surface* must equal the answer's
  letters exactly). F-UNATTESTED (fodder and central joins checked against n-gram data).
  `scripts/raw-material.mjs` mines attested fodder phrases before drafting.
- **Status:** Rule specified; Open (content): GENERAL, CORRELATE, ASTRONOMY and STARLING are
  still shipped. The F-UNATTESTED part is superseded by CL-050 (rejected after testing).
  R-FODDER-LETTERS fail example: `anagram-general`.

### CL-003 · Invented synonyms: the validator can't see meaning
- **Date:** 2026-06-03
- **What happened:** A learner hit SPAR "Box for a quiet little while inside", built on "little
  while → SAR". SAR means nothing. CATER used "immediately → ER". The validator passed both,
  because it checks letters, not meanings.
- **Evidence:** `6e42a59` (three LLM agents then reviewed the semantics of every clue).
  GRANDMOTHERLY's "in a way → LY" was found to be bogus in `6555558`, two months later.
- **Lesson:** Letter mechanics and meaning are different checks. A semantic pass by a model is
  something different again, and no substitute for a cited dictionary sense.
- **Change:** The semantic auditor became a mandatory pipeline stage (old runbook step 5). This
  is now F-DEF-EVIDENCE plus the exam's EVIDENCE step: every synonym op, definition and
  double-definition half carries a dictionary sense, checked against WordNet / Wiktionary.
- **Status:** Rule specified (plan C3, D1).

### CL-004 · The stored indicator wasn't in the surface, so the hints lied
- **Date:** 2026-06-03 (it recurred 2026-06-04)
- **What happened:** The `indicator` field is quoted word for word in hint rung 3. SPAR's hint
  cited "held inside", a phrase that wasn't in the clue. ONCE stored "cut out", RESCUE
  "confused", ORGANISES "arranged" and LABORATORY "shifts around", none of which matched their
  surfaces. A day later the surface-polish pass dropped indicators out of EARLOBE, FERN, GLEN and
  HERMIT.
- **Evidence:** `6e42a59`, `6018906`.
- **Lesson:** Any field shown to the solver must be checked against the clue text, every time
  the text changes. A rewrite that edits the surface but not the metadata breaks the hints
  without anyone noticing.
- **Change:** First an advisory lint (`6018906`), then an "indicator absent from the surface"
  gate (`f883696`, `surface-rules.ts`).
- **Status:** Closed.

### CL-005 · Best-of-N from one context is the mode, not the best
- **Date:** 2026-06-03 to 06-04 (lesson recorded 2026-10-02)
- **What happened:** Every upgrade wave used one setter agent per chunk, writing 3–4 candidates
  per answer in a single context, and kept the best. Drafts written together by one author share
  a register and an idea, so best-of-4 from that pool tends to return the most typical clue, not
  the best one. Human setters throw away far more than they keep.
- **Evidence:** `fd9c3b0`, `248ea21`, `30f4bb0`, `963f133`, `4da88de`; the SKILL's "≥4
  candidates across ≥3 devices"; audit 01 §1 ("main leak") and §3.
- **Lesson:** Quality comes from choosing out of a wide, varied pool. Independence between
  drafts matters more than the number of drafts.
- **Change:** Writer method step 3: 4–6 *independent* setter agents, each locked to one device
  and one surface domain, producing 20–40 candidates per answer, and covering the required
  misdirection moves between them. Cheap filters run first; the tournament runs on survivors
  only.
- **Status:** Process specified (`05-writer-method.md`).

### CL-006 · A clean report from one auditor
- **Date:** 2026-06-03 (found 2026-10-02)
- **What happened:** The part-a wave reported that "an independent semantic auditor then checked
  the winners: 0 broken, 0 dubious of 40". That same batch shipped COB "Swan gliding past disco
  bar" (an invalid hidden indicator), TIP "Pointer rising from the pit" (Down-only), HARM "A hard
  limb can do damage" (an unaccounted A) and CAR "Old banger lurking in Madagascar" (an
  unflagged definition by example). The 2026-10-02 audit flagged all four.
- **Evidence:** `fd9c3b0` commit message; audit 02 §2 #4, #8, #36, #37.
- **Lesson:** "Zero problems found" from one same-model pass tells you nothing unless that pass
  has been shown to catch known-bad clues.
- **Change:** See CL-032 (calibration against bad anchors) and CL-033 (the evidence
  requirement).
- **Status:** Superseded by CL-032.

### CL-007 · COB's hidden indicator "past"
- **Date:** 2026-06-03 (found 2026-10-02)
- **What happened:** COB was rebuilt from its abbreviation fix (CL-001) as a hidden: "Swan
  gliding past disco bar". "Past" does not tell a solver to look inside the words. Two other
  hiddens use indicators in the wrong sense: MOAT "skirts" (going round the outside is the
  opposite of hiding inside) and MEADOW "crossing".
- **Evidence:** COB `fd9c3b0`; MOAT `c86a741`; MEADOW `6afaf6e`. Audit 02 §2 #8, #81, §3.1.
- **Lesson:** A hidden indicator must mean "inside" or "part of" in its *cryptic* reading, not
  merely sound like movement near the words.
- **Change:** R-HIDDEN-IND: hidden indicators must come from the allowed family list in
  `02-devices/hidden.md`.
- **Status:** Rule specified; Open (content): COB, MOAT and MEADOW are still shipped. Superseded in
  part by CL-049: the indicator test is now published usage or a standard family, so MOAT
  ("skirts") and MEADOW ("crossing") pass it and are judged in the exam; COB still fails
  (`hidden-cob`).

### CL-008 · Down-only reversal indicators in a bank with no grid direction
- **Date:** 2026-06-03 (TIP), 2026-06-04 (REWARD); found 2026-10-02
- **What happened:** TIP "Pointer rising from the pit" and REWARD "Carpenter's drawer turned up
  a prize" use reversal indicators that only work in a Down clue. Bank clues carry no direction.
  Play places them Across or Down, and the Daily (live from 2026-06-15) serves them with no grid
  at all. The old style guide §5 even says "in downs *rising/up*" without saying that the bank
  has no downs.
- **Evidence:** TIP `fd9c3b0`; REWARD `248ea21`; audit 02 §2 #36, §3.8.
- **Lesson:** Write for the context the clue is actually served in. A bank clue is
  direction-free, so indicators that depend on direction are unfair.
- **Change:** R-INDICATOR-DIR: a list of direction-bound indicators ("up", "rising", "turned up",
  "lifted"…) that fail in any bank or teaching clue.
- **Status:** Rule specified; Open (content): TIP and REWARD are still shipped.

### CL-009 · Ending the "beheaded X" treadmill killed off a device
- **Date:** 2026-06-03 to 06-04 (found 2026-10-02)
- **What happened:** The first waves rightly broke up repeated formulas: "beheaded X" deletions
  (CAR/AGE/HEAT/HARM/EDIT/OVEN), eight anagrams in a row, a trio of "primarily" initialisms. The
  fix was to *swap the device away* each time. Nothing put a floor under any device, so by
  2026-10-02 the bank had **one** deletion (WONDER, which prints its own answer), **zero**
  acrostics and 13 containers (3%), even though containers are the backbone of a broadsheet
  puzzle.
- **Evidence:** `fd9c3b0`, `30f4bb0`; audit 02 §3.1 (device table), §3.9.
- **Lesson:** Fix repetition by varying the *treatment*, not by deleting the device. A quota
  needs floors as well as ceilings.
- **Change:** B-DEVICE-MIX (every batch spans ≥ 4 devices; CD + DD ≤ 25%). B-REPEAT (the same
  indicator or scene template no more than twice per batch). The device chapters give fresh
  deletion and acrostic treatments.
- **Status:** Rule specified. Superseded in part by CL-051: B-DEVICE-MIX and B-REPEAT are flags.

### CL-010 · OVERNIGHT: five versions, still among the worst
- **Date:** 2026-06-03 to 06-05 (found 2026-10-02)
- **What happened:** OVERNIGHT was rewritten in five successive passes. It went from a hidden
  with no indicator, to an answer-screaming hidden carrier, to two realism rebuilds, ending as
  the charade "Play over, night fell, so we stayed till dawn". That last version prints both
  halves and pads the rest; the audit ranks it among the 30 weakest clues in the bank (surface 2,
  wit 1).
- **Evidence:** versions in `07139fa` → `6e42a59` → `30f4bb0` → `6afaf6e` → `ebf8c5a`; audit 02
  §2 #9, §6 #15.
- **Lesson:** Compound answers (OVER-, OUT-, OFF-, STAR-, NIGHT-, -HEAD, -PAPER) tempt the
  setter to split at the natural seam and print both halves. Rewriting the same answer again
  and again without changing the *approach* converges on that temptation. Disguise both halves
  (OFF = "rotten", SHORE = "prop"), split somewhere other than the morpheme boundary, or change
  device.
- **Change:** R-PRINTED and R-ANSWER-IN-CLUE (see CL-020). The scene brief and alternative-sense
  table in Writer method step 2.
- **Status:** Open (content). R-PRINTED is now the flag F-PRINTED (CL-051).

---

## 2026-06-04: auditing link words, polishing surfaces

### CL-011 · Indicators of the wrong type for their device
- **Date:** 2026-06-04
- **What happened:** In the 82-clue expansion, "oddly" was used as an anagram indicator (it reads
  as alternation). In the whole-bank audit, EARNING and PANTRY used "oddly" and "empty", which
  imply odd letters and deletion, and ORCHID's "seen as" was not a hidden indicator. GOAT "A
  toga, oddly draped…" still uses an ambiguous "oddly".
- **Evidence:** `963f133`, `c134f90`; GOAT: audit 02 §2 #72.
- **Lesson:** An indicator belongs to a family, and some words belong to several (oddly:
  alternation *and* anagram). Use an indicator whose family is unambiguous, or accept the
  ambiguity knowingly when the other reading cannot produce a word.
- **Change:** The semantic-auditor checklist gained "wrong-type indicator" (`a9df3a6`). Each
  `02-devices/*.md` chapter lists its families and the indicators shared between devices.
  R-HIDDEN-IND covers hiddens mechanically.
- **Status:** Partly closed (the named clues were fixed); GOAT is still open.

### CL-012 · Containment glue in a charade (ONCE → CONE)
- **Date:** 2026-06-04
- **What happened:** ONCE "Working in church, formerly" was a charade (ON + CE), but "in" tells
  the solver to insert, which spells CONE, a real word and therefore a real wrong answer. It was
  found during play. A sweep found the same fault in INKPOT, CROWN, HABITAT and MUSHROOM. The
  gate added in June uses a fixed word list (in, inside, into, about, around, holding…). Then
  MUSHROOM was rebuilt as "Sentimental mush fills the room, like a fungus", and "fills" is
  containment language that isn't on the list.
- **Evidence:** `14ea5dd`, `a9df3a6`, `c134f90`, `f883696` (`CONTAINMENT_WORDS` in
  `surface-rules.ts`); MUSHROOM `c86a741`; audit 02 §2 #7.
- **Lesson:** Link words must do honest cryptic work for the *actual* device. A list of banned
  words leaks; the check should use the full container-indicator family.
- **Change:** The containment-glue gate (`f883696`). The device chapters' container-indicator
  family becomes the source list for the gate.
- **Status:** Closed (gate for the listed words); Open (content): MUSHROOM.

### CL-013 · Unflagged definition by example
- **Date:** 2026-06-04 (found again 2026-10-02)
- **What happened:** In HERB "Sage, perhaps, is her bishop", the hint ladder never explained what
  "perhaps" was doing. The fix taught the convention in the hints. But clues that *need* the
  flag and don't have it kept shipping: CAR "Old banger" (a banger is a kind of car), MINISTER
  "The vicar" (a vicar is one kind of minister).
- **Evidence:** `14ea5dd` (`hydrate.ts` def-by-example note); audit 02 §3.6.
- **Lesson:** A definition by example (a hyponym) must carry a flag (?, perhaps, say, maybe).
  Whether a definition is a synonym or an example is a dictionary question, so it can be
  checked.
- **Change:** F-DEF-EVIDENCE records whether the definition is a synonym or a hyponym; a hyponym
  without a flag fails.
- **Status:** Rule specified; Open (content): CAR, MINISTER.

### CL-014 · A polish with the device locked produced padding
- **Date:** 2026-06-04 (found 2026-10-02)
- **What happened:** The surface-craft pass graded all 366 clues and rewrote about 101 weak
  surfaces, but its POLISH template required "the SAME `clueType`". A setter who can't change
  device makes a sentence read better by *adding words*. This pass introduced DETAIL "Pupils
  dilate oddly at one fine point" ("Pupils" does nothing), ORGAN "Members groan, upset at the
  party paper" ("Members" does nothing), WONDER "She wonders endlessly, lost in awe" (prints the
  answer) and WARFARE "Fighting's price is endless conflict" (wrong definition, and a false
  deletion signal).
- **Evidence:** `6018906`; the clue origins were traced with `git log -S`; audit 02 §2 #2, #3,
  #30, #57. Audit 01 §1 notes the runbook POLISH template still says "same clueType", which
  contradicts "device is free".
- **Lesson:** Asking for a better surface while forbidding a change of construction is asking
  for padding. The idle noun that makes an anagram "plausible" is the most dangerous padding,
  because it looks like wordplay material.
- **Change:** "The device is free" (CL-019). R-IDLE (CL-024). The Bible's Writer method has no
  device-locked polish step.
- **Status:** Rule specified; Open (content): DETAIL, ORGAN, WONDER and WARFARE are still
  shipped. R-IDLE is now the flag F-IDLE (CL-051); WONDER fails R-ANSWER-IN-CLUE
  (`deletion-wonder`).

### CL-015 · Three copies of the gate; three copies of the standard
- **Date:** 2026-06-04 (code); 2026-10-02 (docs)
- **What happened:** The new CI surface gate was "mirrored verbatim across lint-surfaces.mjs,
  surfaces.test.ts and validate-clue.ts", so three copies had to be kept in sync by hand. Later
  the *standard* was copied the same way: the style guide (surface ≥ 4 and surface + wit ≥ 7),
  the skill (median surface ≥ 4, median wit ≥ 3, no surface score ≤ 2) and the runbook (a
  non-blind grader, a device-locked polish) each set a different bar.
- **Evidence:** `6018906`, `f883696`; audit 01 §1 ("the thresholds disagree across documents").
- **Lesson:** Whichever document an agent reads first sets its bar. Keep one source of truth,
  and make every other copy a pointer to it.
- **Change:** `src/data/surface-rules.ts` became the single source of surface checks
  (`f883696`). The Clue Bible becomes the single source of the standard. `clue-style.md` and
  `clue-pipeline.md` become stubs (plan G1).
- **Status:** Closed (code); Bible in progress.

---

## 2026-06-05 to 06-07: the realism floor-raise ("D/F/E/B/C")

### CL-016 · Indirect deletions
- **Date:** 2026-06-05
- **What happened:** The validator checked a deletion's *letters* but never required the source
  word to appear in the surface. So MILD came from MILDEW, TROOPER from TROOPERS, and the
  teaching OVEN from COVEN, which was given only as "Witches' group". Each is a deletion from a
  synonym, which is as unfair as an indirect anagram.
- **Evidence:** `199f972`.
- **Lesson:** Any device that acts on letters (anagram, deletion, alternation, hidden, reversal)
  must have its fodder printed in the surface. If a rule exists for one device, check whether it
  applies to the others.
- **Change:** The fodder-in-surface guard for deletion (`integrity.ts`, `199f972`), and for
  alternation in `f883696`.
- **Status:** Closed. Superseded in part by CL-047: a deletion's source may also be a synonym
  of a clue word, provided one specified part is removed.

### CL-017 · Teaching clues: "beginner" read as "transparent"
- **Date:** 2026-06-05
- **What happened:** The owner played the Stage-A lessons and found clues that weren't cryptic.
  Some spelled the answer out ("A pig's tail … hairstyle" for PIGTAIL), some narrated the
  mechanic ("Warts, sent back, spell …"), and some ended with a definition nobody says ("a
  drinking tube"). The teaching corpus had been left out of every earlier quality pass.
- **Evidence:** `083fe45` (PIGTAIL → DOGMA, MANKIND → HOGWASH, EACH → ANGER, EDGE → STAR…).
- **Lesson:** A teaching clue is a fully real cryptic clue that is gentle only in vocabulary and
  choice of device, never in its disguise. Teaching answers aren't locked to a grid, so when a
  word can't reach the bar, swap the answer and keep the device.
- **Change:** The §1c "gentle teaching register" (now in `01-qualities.md`), with its five rules
  and exemplars. Teaching clues sit the same exam.
- **Status:** Closed. (See CL-025 for the teaching clues that later regressed.)

### CL-018 · Surfaces that copy published clues
- **Date:** 2026-06-05 (recurred 2026-08-15)
- **What happened:** The owner flagged that rebuilt teaching surfaces matched published clues.
  DOGMA's surface was a near-twin of one, and every natural wording of BIGWIG was already in
  print, so the answer was swapped to JACKPOT. In part-j, SALT ("seasoned sailor") and KITE
  ("bird on a string") also turned out to be published and were reworded. BERTH's surface moved
  from cabin to hut for the same reason.
- **Evidence:** `8f34317`, `062708e`, `6555558`.
- **Lesson:** Constructions are shared knowledge (DOG + MA is forced by the letters); surfaces
  must be our own wording. Searching the web by hand is patchy and only gets done for the
  answers someone thinks to search.
- **Change:** F-CHESTNUT: a fuzzy match against every published clue for the same answer in the
  local corpus (token-Jaccard ≥ 0.6, plan C3), plus a list of known chestnut pairs. If the
  surface is forced by the letters, swap the answer (teaching) or change device (bank).
- **Status:** Rule specified.

### CL-019 · Decision: realism above wit; the device is free
- **Date:** 2026-06-05
- **What happened:** The earlier passes had optimised for wit and forbidden device changes. So
  awkward constructions got cosmetic fixes instead of rebuilds: STREAM "Run threading through
  the kettle's steam, a brook" was a narrated recipe with a definition tacked on the end. A
  strict judging pass flagged about 111 clues, and each was rebuilt with the device free and the
  answer fixed. The new axis 1b, *surface realism*, became a PASS/FAIL gate **ranked above wit**,
  and the runbook made a realism judge mandatory.
- **Evidence:** `6afaf6e`, `3c5ef3d`; then the "C" passes `2b20510`, `b7f2502`, `ebf8c5a`,
  `c6d029e`, `c86a741` (about 105 more rebuilds).
- **Lesson:** "The answer is fixed; the construction is free" is still right. But a single
  ranking with realism at the top let the cheapest route to a natural sentence win (CL-020).
- **Change:** Realism stays a *floor*, now measured by the blind DECOY test. Selection above the
  floor is by TOURNAMENT-SURFACE *and* TOURNAMENT-WIT against anchors, with economy and disguise
  enforced as rules (R-IDLE, R-PRINTED), so that neither quality can be bought at the other's
  expense.
- **Status:** Superseded in part: the priority order was replaced by the exam (`04-exam.md`). The
  rule that the device is free stands. DECOY is replaced by NATURALNESS, and R-IDLE/R-PRINTED
  are flags (CL-051).

### CL-020 · Realism bought by printing the answer's pieces
- **Date:** 2026-06-05 to 06-07 (found 2026-10-02)
- **What happened:** The realism-first rebuilds met the bar by printing the answer's pieces as
  plain words and padding around them. The part-d batch alone produced GENERAL "A wildly
  enlarged map guided the commander", OUTLOOK "Once out, look at what lies ahead" (the whole
  answer is printed), STARLET "The star let her flat to a budding actress" (the whole answer is
  printed) and EARLOBE "Wear lobelias and you cover a bit of the ear". Later batches added
  OVERNIGHT, OFFSHORE "Gone off near the shore, now out at sea", CHARITY "The cleaner had it all
  year, doing good works" and MUSHROOM. The mechanical gate allowed this: the `concat` check
  counts a piece as accounted for if it "sits verbatim in the surface as a word".
- **Evidence:** `b7f2502`, `ebf8c5a`, `c6d029e`, `c86a741`; `f883696` (`pieceAccounted` in
  `integrity.ts`). Audit 02 §3.3: **31 of 75 charades print a piece of three or more letters
  verbatim**, and five print the whole answer (OUTLOOK, STARLET, OVERNIGHT, WONDER, CHARM).
  §3.10: "what that pipeline rewards: a sentence that reads naturally, which the writer could
  buy cheaply".
- **Lesson:** A gate tells the writer what to optimise. Rank naturalness alone and you get
  natural sentences that hide nothing. A piece printed as itself is not wordplay.
- **Change:** R-PRINTED: a charade or container piece of three or more letters appearing
  verbatim in the clue fails (the audit's proposed exception: answers of 9+ letters where the
  piece is ≤ ⅓ of the answer). R-ANSWER-IN-CLUE: the answer, or a word sharing its stem, fails.
  R-IDLE: see CL-024. Plan B1 fixtures include OUTLOOK.
- **Status:** Rule specified; Open (content): every clue named above is still shipped. Superseded
  in part by CL-051: R-PRINTED and R-IDLE are the flags F-PRINTED and F-IDLE, so these clues pass
  the machinery and are judgement examples.

### CL-021 · A single judge reading full entries rubber-stamped REIN
- **Date:** 2026-06-07 (lesson recorded 2026-06-10)
- **What happened:** The part-h realism pass deliberately left REIN "Control reign, reportedly"
  alone as "fair, natural cryptic grammar". It is a word list, not a sentence. It survived a
  pass the runbook called a "mandatory adversarial" judge. That judge was one agent, and it read
  full entries with the answer and parse in view.
- **Evidence:** `c6d029e` (REIN listed as "left as-is"); `f883696` and the runbook's
  three non-negotiables ("'Control reign, reportedly' survived one"). REIN is now "Curb the
  king's rule, reportedly" (`f883696`).
- **Lesson:** A judge who can see the clever wordplay forgives the sentence. Realism must be
  judged blind, on bare surfaces, by several judges.
- **Change:** A blind protocol with at least three judges and a majority vote (`f883696`; the
  first full run failed **109 of 410** surfaces by majority). It is now replaced by the DECOY
  test, where surfaces are mixed with real sentences, plus TOURNAMENT-SURFACE.
- **Status:** Superseded by CL-032 (the blind majority itself turned out to be correlated).

---

## 2026-06-10: the enforcement overhaul (`f883696`)

### CL-022 · Assembled devices weren't letter-checked
- **Date:** 2026-06-10
- **What happened:** For charades, containers and alternations, the validator only confirmed
  that the *final* operation output the answer. A container whose "insertion" was really
  placement at the edge, or a charade whose pieces didn't join to the answer, passed. When the
  composition checks were added, they "caught 9 unfair shipped clues immediately".
- **Evidence:** `f883696`; `PRODUCTIONPLAN.md` changelog 2026-06-10.
- **Lesson:** "The final op equals the answer" checks the result the writer *claimed*, not the
  route to it. Every device needs its own letter check, and any device without one is a gap a
  writer under pressure will drift into (see CL-031).
- **Change:** In `integrity.ts`: `concat` pieces must join to the answer in order; `insert` must
  be a true internal insertion; alternation letters are checked. Cryptic definitions, double
  definitions and &lit still had no check. That gap is what R-CD-CONTRACT and COLD-SOLVE close.
- **Status:** Closed (for the devices listed); see CL-030 and CL-031 for the remaining gap.

### CL-023 · Swallowed and free-floating articles
- **Date:** 2026-06-04 (decision), 2026-06-10 (gate), 2026-08-15 (recurrence)
- **What happened:** The whole-bank audit looked at HARM "A hard limb can do damage" (H + ARM,
  with the A unaccounted for) and left it as "standard practice". The June gate then rejected an
  article *swallowed inside an op* ("a cake" → CAKE). But articles standing *outside* any op
  count as free link words, so HARM still passes, and so does part-j's SOUP "An opus reworked
  as a starter".
- **Evidence:** `c134f90` ("left HARM's leading article"); `f883696`; `LINK_WORDS` in
  `surface-rules.ts` (it includes `a an`); audit 01 §1 (SOUP); audit 02 §2 #4.
- **Lesson:** A is a standard letter-contributor. When an A stands outside the definition and
  isn't part of the wordplay, the solver can't tell whether it counts. That makes it unfair, not
  merely padding.
- **Change:** R-IDLE: an article counts as idle unless it contributes a letter or belongs to the
  definition. Fixture: HARM.
- **Status:** Partly closed (swallowed inside an op); Open (content): HARM, SOUP. R-IDLE is now the
  flag F-IDLE (CL-051); a free-floating article is judged by the auditor.

### CL-024 · Single orphan words: 17% of the bank is padded
- **Date:** 2026-06-10 (design choice); found 2026-10-02
- **What happened:** The orphan gate fails only *flagrant* cases: an idle span of two or more
  words, or two idle words. "A SINGLE leftover word is a judgment call" and is only flagged as
  advisory. The link-word list also excuses pronouns, auxiliaries and "still" (he, she, they,
  was, can, had, all, still). That let through a whole family of padding templates: ALERT
  "Later, *he was* drunk but *still* sharp", SPEAR "A broken spare *can still serve as* a
  weapon", CATER "A smashed crate *won't stop us* providing the food". Worse, it let through idle
  *nouns* that look like fodder: BLASTED "Damned *horse* stabled awkwardly", GRENADE "Enraged
  *soldier* hurls explosive", DETAIL "*Pupils* dilate oddly", CEDAR "Raced wildly *round* the
  tree". The realism judges scored these *higher*, because the padding is what makes them read
  naturally. BLASTED was written during this very overhaul.
- **Evidence:** `coverageFlags` and `LINK_WORDS` in `surface-rules.ts` (`f883696`). BLASTED
  `f883696`; GRENADE `963f133`; CEDAR `062708e`. Audit 02 §3.2: **71 clues (17%)** have at least
  one idle word, and at least 8 of them are fairness failures.
- **Lesson:** Economy is binary at the level of the word: every word has a cryptic job, or the
  clue fails. Judges who reward natural sentences will reward padding unless they are told that
  an idle word lowers the score.
- **Change:** R-IDLE: any single word with no role in the parse fails, except for an explicit
  allow-list of true link words (no pronouns or auxiliaries as padding). F-TEMPLATE catches the
  "…, he was / still / won't stop us" and "When X…, they…" templates. Judge briefs now say a
  sentence bought with an idle word scores lower. Fixtures: "Members groan", BLASTED.
- **Status:** Rule specified; Open (content). Superseded in part by CL-051: R-IDLE is now the flag
  F-IDLE.

### CL-025 · Teaching swaps that print their own answer
- **Date:** 2026-06-10 (found 2026-10-02)
- **What happened:** The overhaul swapped eight teaching answers to reach §1c, and three of the
  replacements break §1c rule 1 ("answer and its parts are disguised"). EVENT "Seven tents
  partly cover the event": the definition *is* the answer. CARTON "The con hides art in a box"
  and PIRATE "Rat tucked into the pie for a buccaneer" print both container pieces. PADLOCK
  "Apartment's key feature is a security device" (left alone in `083fe45`) uses a pun ("key
  feature") as if it were a synonym for LOCK.
- **Evidence:** `f883696` (ONSET → EVENT, THRONE → CARTON, SCREAM → PIRATE); audit 02 §5.
- **Lesson:** The printed-piece fault isn't limited to charades, and teaching clues are not
  exempt. A rebuild meant to meet one rule can break another unless the full rule set runs on
  every candidate.
- **Change:** R-ANSWER-IN-CLUE (EVENT). R-PRINTED applies to container pieces as well as charade
  pieces (CARTON, PIRATE). F-DEF-EVIDENCE (PADLOCK). Teaching clues sit the full exam.
- **Status:** Rule specified; Open (content). R-PRINTED is now the flag F-PRINTED (CL-051).

### CL-026 · Chestnuts: STRESSED/DESSERTS three times
- **Date:** 2026-06-10 (the current texts); found 2026-10-02
- **What happened:** The STRESSED ↔ DESSERTS reversal, probably the best-known chestnut in
  cryptics, appears three times. In the bank: STRESSED "Tense when puddings are sent back" and
  DESSERTS "Stressed, we turned to sweets". In the teaching corpus: DESSERTS "Stressed about
  pudding". DESSERT is in the bank too. Other repeats include REGAL/lager, VILE "Terribly evil",
  LISTEN/SILENT (×3), TREASON/senator (×2) and REWARD/drawer (×2). Fifteen answers appear in
  both the bank and the teaching corpus, and about 8 of them use the same fodder, so a learner
  meets the same trick twice.
- **Evidence:** the bank texts as of `f883696`; `src/data/clues.ts` (DESSERTS); audit 02 §3.7.
- **Lesson:** Chestnuts belong in teaching, once. In the bank they are free points for
  experienced solvers and a repeat for learners.
- **Change:** F-CHESTNUT: a list of known chestnut pairs (STRESSED/DESSERTS and the others named
  above), plus the corpus fuzzy match. The bank may not reuse fodder from the teaching corpus.
- **Status:** Rule specified; Open (content).

---

## 2026-08-15: the Clue Writer skill and part-j

### CL-027 · The whole-clue hint bug (Daily #62)
- **Date:** 2026-08-15
- **What happened:** Cryptic definitions and &lit clues set `def.text` to the entire clue. So
  rung 1 of the automatic hint said "The definition is at the START" and quoted the whole clue
  back. That is technically true but reads as a bug. The owner reported it live on Daily #62.
- **Evidence:** `28937d3` (`hydrate.ts`, new `hydrate.test.ts`).
- **Lesson:** Clues whose data has a different shape (definition = whole clue, no indicator, no
  fodder) need their own path through every consumer: hints, competence, par and rules. Test
  each device end to end, not only the common ones.
- **Change:** Wording for whole-clue devices in `hydrate.ts`, with tests. Device coverage became
  a standing concern (see CL-040).
- **Status:** Closed.

### CL-028 · Owner decision: clues are always written through the system
- **Date:** 2026-08-15
- **What happened:** The owner decided that clues are **always** authored by Claude through the
  clue-writer skill, with no offline generation pipeline and no ad-hoc rewrites. The skill was
  committed to the repo the same day.
- **Evidence:** `af28154`; `PRODUCTIONPLAN.md` ("The owner's standing decision: clues are ALWAYS
  authored by Claude through this skill — no offline pipeline"); the SKILL frontmatter.
- **Lesson:** Since every clue comes from the system, the *system* is what carries quality. Any
  improvement has to be written into the Bible, the rules or the exam, never left in one agent's
  head. Suggested rewrites from audits (e.g. audit 02 §2b) are drafts that go *through* the
  writer, never patches.
- **Change:** The spec principle "System, not agent". The skill becomes a thin procedure that
  loads the Bible.
- **Status:** Standing decision.

### CL-029 · Wit was judged without the answer
- **Date:** 2026-08-15 (lesson recorded 2026-10-02)
- **What happened:** The ceiling-panel prompt told panelists to score WIT 1–5 while they "may NOT
  see answers". The penny-drop *is* the relationship between the surface and the answer, so a
  blind wit score measures "sounds like a clue". The scale's floor (wit 3 = "mildly pleasing")
  set the bar at flat.
- **Evidence:** `af28154` (SKILL step 5 and the panelist prompt); audit 01 §1 and §2.4.
- **Lesson:** Judge each quality with exactly the information it depends on. Naturalness:
  blind. Fairness: a cold solve. Wit: answer and parse revealed.
- **Change:** TOURNAMENT-WIT (pairwise, answer and parse shown, both orders, Bradley–Terry,
  against anchors). TOURNAMENT-SURFACE stays blind.
- **Status:** Exam specified (`04-exam.md`, plan D1).

### CL-030 · The first workout shipped two quiz-question CDs
- **Date:** 2026-08-15 (found 2026-10-02)
- **What happened:** The skill's first workout rebuilt ENTERTAINMENT and GRANDMOTHERLY through
  the full gauntlet. Both came out as cryptic definitions: "What keeps an audience coming back
  for more?" and "Inclined to spoil you rotten between rounds of knitting?". Both passed three
  blind realism judges and the ceiling panel. The audit graded both wit 1, "a straight
  definition … nothing misleads". In the same run the panel *rejected* the author's anagram
  (INTERNET MEANT) as "stilted prose". The blind panel can't see an anagram's wit, but it can see
  that a question reads naturally.
- **Evidence:** `6555558`; audit 02 §2 #28–29.
- **Lesson:** A plain description with a "?" on the end is a quiz question, not a cryptic
  definition. A cryptic definition needs a false trail: a misleading reading *and* a true one.
  Blind panels systematically prefer CDs, because a CD's surface *is* its whole content, while
  a hidden or anagram's wit only appears once the parse is known.
- **Change:** R-CD-CONTRACT: a CD must declare `pun: {misleading, true}`; empty fails.
  F-QUIZ: a cold solver who gets the answer from the literal reading flags the clue.
  COLD-SOLVE runs before any wit judging.
- **Status:** Rule specified; Open (content): both clues are still shipped. F-QUIZ redefined by
  CL-051: it means "no distinct second reading", not "solved from the literal reading".

### CL-031 · Part-j collapsed into cryptic and double definitions
- **Date:** 2026-08-15 (found 2026-10-02)
- **What happened:** The one batch written end to end through the Clue Writer (part-j, 50
  written, 49 shipped) is **33 cryptic definitions, 11 double definitions and 5 wordplay
  clues**. That is 90% whole-clue devices, against 1–3 CDs in a typical 28-clue broadsheet. Many
  are general-knowledge questions: ELM "Tree lost to a Dutch disease?", OAK "Royal tree on a
  thousand pub signs?", MAPLE "Tree whose leaf Canada flies?", SAND "What runs out in an
  hourglass?", ARC "The path of everything you throw?", MAP "It shows you where to get off?".
  All passed three blind realism rounds with zero majority fails, and the median-4 ceiling
  panel.
- **Evidence:** `062708e`; the `part-j.json` device counts; audit 01 verdict ("the part-j
  finding"); audit 02 §3.4.
- **Lesson:** Writers drift to whatever the gates check least. `orphanSpans` returns `[]` for
  cryptic definitions, double definitions and &lit; `validateClue` does nothing specific for
  them; realism judges pass a natural question easily; and blind panels can't see that it isn't
  cryptic (CL-030). Any device with no checks will be over-produced.
- **Change:** B-DEVICE-MIX (CD + DD ≤ 25% per batch, ≥ 4 devices). R-CD-CONTRACT, F-QUIZ,
  COLD-SOLVE (unsolved by 2 of 3 solvers, or not unique, means unfair). Re-examine part-j's 33
  CDs and its dubious DDs (expect 10–20 rebuilds, audit 01 §4).
- **Status:** Rule specified; Open (content). Superseded in part by CL-051: B-DEVICE-MIX is a flag,
  and COLD-SOLVE counts a solve only with the correct parse.

### CL-032 · Same-model judges are correlated; zero fails is a warning
- **Date:** 2026-08-15 (lesson recorded 2026-10-02)
- **What happened:** The three realism "lenses" (subeditor, read-aloud, scene) were three copies
  of the same model as the author, told to "PASS generously" and to report fails only. Their
  errors are correlated, so a 2-of-3 majority behaves like one judge. Three part-j rounds
  returned **zero** majority fails, and that was read as reassurance. Absolute 1–5 scores
  bunched at 4, with no anchors to show what a 4 means.
- **Evidence:** `062708e` ("3 blind-judge realism passes (zero majority fails)"); audit 01 §1
  and §2.3/2.5; audit 03 §2 (self-preference: Panickssery et al.; near-zero LLM–expert agreement
  on absolute creative scores: TTCW; position bias: MT-Bench).
- **Lesson:** A judge that never fails anything is not shown to be lenient or strict; it is
  unmeasured. Trust a judging step only after it has separated known-good clues from known-bad
  ones.
- **Change:** Calibration ("measure the measuring stick"): good anchors (published clues from
  the local corpus, never committed) and bad anchors (our superseded clues and the audit's
  unsound list), with **AUC ≥ 0.80** required for DECOY and both tournaments before any clue is
  scored. Re-run whenever a prompt or model changes, and record each prompt iteration here.
  Pairwise comparisons in both orders replace absolute scores. Use a judge from another model
  family where one is available. Track the fail rate for each batch.
- **Status:** Exam specified (plan D2–D5). Amended by CL-051: matched pairs and a held-out set,
  with false-pass and false-reject counts reported.

### CL-033 · Definitions that fail a dictionary check
- **Date:** 2026-06-04 to 2026-08-15 (found 2026-10-02)
- **What happened:** Definitions and double-definition halves shipped that a dictionary would
  not support. The part-j semantic audit fixed 8 errors (including MAPLE's inverted definition
  and BAY "harbour ≠ bay") but let these through:
  - **JAM** "Preserve stuck in traffic?": "stuck in traffic" defines *in a jam*, not JAM.
  - **BAY** "Window on an inlet?": a bay window is not a bay.
  - **HILL** "Husband takes ill on the climb": a hill is not "the climb".
  - **CLIFF** "Richard's sheer face?": a possessive standing for a first name (Cliff Richard).
  - **HARP** "Go on and on about the strings?": flagged as a dubious double definition (audit
    01 §4). The likely fault is that the "go on and on" sense is idiomatically *harp on*.
  - **MAP** "It shows you where to get off?": a map doesn't.

  Earlier batches had the same fault:
  - **STEAM** "Small side built up a head of pressure": steam ≠ a head of pressure, and "built
    up" does nothing (`248ea21`).
  - **WARFARE** "Fighting's price is endless conflict": warfare ≠ endless conflict, and
    "endless" reads as a deletion (`6018906`).
  - **WORKSHEET** "Operate the mainsail for the class exercise": a sheet is the rope that
    controls a sail, not the sail, and the clue's own parse admits it (`6afaf6e`).
  - **OCEAN** "Canoe wrecked at sea": "at sea" is the wrong part of speech (`4da88de`).
- **Evidence:** `062708e` and the commits named; audit 01 §1 (semantic audit row); audit 02
  §3.6.
- **Lesson:** "Sounds right" is not a sense. One same-model auditor reading 50 clues will miss
  near-synonyms, half-senses and wrong parts of speech. Every definition needs a cited sense with
  its part of speech.
- **Change:** F-DEF-EVIDENCE: definitions, DD halves and synonym ops carry an `evidence` field.
  A WordNet synonym/hypernym check within 2 hops runs first (plan C3), and misses go to an
  auditor agent (the EVIDENCE exam step).
- **Status:** Rule specified; Open (content): all ten are still shipped.

### CL-034 · The ceiling panel's escape hatch
- **Date:** 2026-08-15 to 08-16
- **What happened:** The skill's ceiling gate said "if nothing survives… present the best-of to
  the owner". In part-j, 43 of 50 passed the median-4 panel and **7 shipped "at competent tier"**
  anyway. The next day LAKE was dropped as the weakest of the batch ("'kale tossed in fresh
  water' scene never cohered (worst panel scores both rounds)"), as the editor's call with the
  owner's delegation.
- **Evidence:** `062708e`, `e0af005`; `PRODUCTIONPLAN.md` 2026-08-15 entry; audit 01 §1 ("a gate
  with an escape hatch for its own failures is advisory").
- **Lesson:** A gate with an escape hatch is advice, not a gate. Dropping LAKE was the right
  instinct: an answer that can't reach the bar is parked, not shipped. That is possible for new
  answers and for teaching answers; for answers locked to the grid, the fix is a different
  device.
- **Change:** The exam's bar is relative and has no exception: the winner must beat or tie the
  median anchor for its device. Answers with no passing candidate after the Writer method's
  rounds are parked and logged in the ledger, not shipped.
- **Status:** Exam specified.

### CL-035 · The owner gate was designed wrongly
- **Date:** 2026-08-15 (lesson recorded 2026-10-02)
- **What happened:** SKILL step 10 made the owner read every clue that ships, showing the old
  clue, the new clue, the parse and the panel scores, in sittings of up to 50 clues. Audit 01
  found three faults: the scores anchor the owner's view; 50 clues cause fatigue; and the
  owner's choices weren't recorded, so the system never learned house taste. A further fault
  only surfaced with CL-042: the owner is not a cryptic expert, so asking him to approve parses
  and wit gave expert-level approval to a non-expert's reading.
- **Evidence:** `af28154` (SKILL step 10); audit 01 §1 (owner gate row) and P2.2.
- **Lesson:** A human signal is only useful when it is independent of the machine signals and
  matched to what the human can actually judge.
- **Change:** See CL-042.
- **Status:** Superseded by CL-042.

---

## 2026-10-02: the Daily's par, the macro audit, the Bible

### CL-036 · Decision: every bank clue carries a par from a rubric
- **Date:** 2026-10-02
- **What happened:** The Daily now scores you against a par (hints and letters used), modelled on
  Minute Cryptic. Par is set per clue by a researched rubric: A (an allowance by length), B (one
  hint) and C (layered wordplay) are mechanical; D (oblique definition) and E (misdirection) are
  decided by three blind judges by majority. The editor resolved 4 flagged pars by hand.
- **Evidence:** `2170080`, `e9ca5b8`, `6b1e2b4`; the rubric in `docs/clue-style.md` §7b, which
  moves to `01-qualities.md` (Difficulty honesty); `bank.par.test.ts`.
- **Lesson:** A clue isn't finished until its par is set. Par is also a check on the writer's
  claimed `difficulty`: the par script flags clues where the two are out of line.
- **Change:** The Writer method's ship step sets par for every new or changed bank clue.
  `bank.par.test.ts` fails on any clue without one. Later, Daily analytics re-judge any clue
  whose median score is ≥ 2 away from its par.
- **Status:** Standing decision; Closed (test).

### CL-037 · The audit's unsound list
- **Date:** 2026-10-02
- **What happened:** The editor's audit read all 415 bank clues and estimated about **17 (4%)**
  outright unsound ones. Its priority fix list (§7.1) names the 20 bank clues below. "F" marks
  the clues graded *fail* in its 94-clue sample; GRENADE was graded in §6. Every one was still
  shipped on 2026-10-02.

| Answer | Shipped clue | Fault | Rule | Since |
|---|---|---|---|---|
| GENERAL (F) | A wildly enlarged map guided the commander | Fodder "enlarged" has a stray D; "map guided" is padding | R-FODDER-LETTERS, R-IDLE | `b7f2502` |
| DETAIL (F) | Pupils dilate oddly at one fine point | "Pupils" is idle | R-IDLE | `6018906` |
| ORGAN (F) | Members groan, upset at the party paper | "Members" is idle; laboured definition | R-IDLE | `6018906` |
| HARM (F) | A hard limb can do damage | The leading A is unaccounted for | R-IDLE | `fd9c3b0` |
| BLASTED (F) | Damned horse stabled awkwardly | "horse" is idle | R-IDLE | `f883696` |
| GRENADE | Enraged soldier hurls explosive | "soldier" is idle | R-IDLE | `963f133` |
| CHARITY (F) | The cleaner had it all year, doing good works | Three idle words; a narrated recipe | R-IDLE | `c86a741` |
| MUSHROOM (F) | Sentimental mush fills the room, like a fungus | "fills" signals a container in a charade; both pieces printed | R-PRINTED, containment glue | `c86a741` |
| COB (F) | Swan gliding past disco bar | "past" is not a hidden indicator | R-HIDDEN-IND | `fd9c3b0` |
| WONDER | She wonders endlessly, lost in awe | The answer is printed | R-ANSWER-IN-CLUE | `6018906` |
| STEAM (F) | Small side built up a head of pressure | Wrong definition; idle words | F-DEF-EVIDENCE, R-IDLE | `248ea21` |
| WARFARE (F) | Fighting's price is endless conflict | Wrong definition; "endless" reads as a deletion | F-DEF-EVIDENCE | `6018906` |
| WORKSHEET (F) | Operate the mainsail for the class exercise | sheet ≠ sail | F-DEF-EVIDENCE | `6afaf6e` |
| EARLOBE | Wear lobelias and you cover a bit of the ear | The definition contains part of the answer; surreal surface | R-ANSWER-IN-CLUE | `b7f2502` |
| TIP (F) | Pointer rising from the pit | Down-only reversal indicator | R-INDICATOR-DIR | `fd9c3b0` |
| REWARD | Carpenter's drawer turned up a prize | Down-only reversal indicator | R-INDICATOR-DIR | `248ea21` |
| OCEAN | Canoe wrecked at sea | "at sea" is the wrong part of speech | F-DEF-EVIDENCE | `4da88de` |
| CAR (F) | Old banger lurking in Madagascar | Unflagged definition by example | F-DEF-EVIDENCE | `fd9c3b0` |
| MOAT | A limo at the gates skirts the castle's defence | "skirts" is a wrong-sense hidden indicator | R-HIDDEN-IND | `c86a741` |
| CEDAR (F) | Raced wildly round the tree | "round" is idle | R-IDLE | `062708e` |

  In the teaching corpus: EVENT (definition = answer), PADLOCK ("key feature" ≠ LOCK); see
  CL-025. Also graded F in the sample but outside §7.1: MONARCH "Butterfly seen by man on arch?"
  (weak man → M, printed pieces, a "?" doing no work; `f883696`).

  *Note (CL-045, CL-051):* the Rule column gives the IDs as specified on 2026-10-02. Today the
  machinery rejects five of these clues (GENERAL, COB, WONDER, TIP, REWARD), each kept as a fail
  example; the other fifteen pass it (R-IDLE and R-PRINTED are now flags) and are judgement
  examples.
- **Evidence:** audit 02 §0, §2, §6, §7; "Since" from `git log -S` on each clue text.
- **Lesson:** Every one of these passed the gates of its day, and most passed a semantic audit
  and a realism judge as well. Almost every fault is mechanical (an idle word, a printed piece,
  an indicator family, a definition sense), and so is the fix.
- **Change:** Each fault maps to a rule or flag above. These clues are the first fixtures for
  `clue-rules.test.ts` and the ratchet baseline (plan B1–B3), and they are bad anchors for
  calibration (plan D2). They go first in the workout (plan F1). The audit's suggested rewrites
  (§2b) are drafts for the Writer method, not patches (CL-028).
- **Status:** Open (content).

### CL-038 · Template surfaces and stock definitions
- **Date:** 2026-10-02
- **What happened:** The audit counted surface templates repeated across the bank: **15 hiddens
  begin with "Some"**; "in" is a hidden indicator 17 times and "some/some of" 16 times; "What…?"
  and "It…?" each open 10 cryptic definitions; 35 clues end with "the X" as the definition; about
  22 use generic definitions (bird, tree, fruit, gem, herb). Answer families crowd the archive:
  14 EAR- words, plus STAR- ×5 and OVER- ×5, each family producing the same split. In part-c,
  BASKET "Hamper a slam dunk?" sits right next to HAMPER "Picnic basket can be a hindrance",
  reusing the same pairing.
- **Evidence:** audit 02 §3.1, §3.4, §3.5, §3.6, §3.7.
- **Lesson:** LLM output drifts towards sameness (audit 03 §2, LAMP; homogenisation studies).
  Variety has to be measured across the bank, not judged clue by clue.
- **Change:** F-TEMPLATE (surface n-grams mined from the bank and flagged when over-used).
  B-REPEAT (the same indicator or scene template no more than twice per batch). The
  scene-domain lock in the Writer method's wide drafting.
- **Status:** Rule specified; Open (content).

### CL-039 · Americanisms and dated register
- **Date:** 2026-10-02
- **What happened:** The bank's British register is a strength (pinta, Old Nick, banger, a
  crocodile of schoolchildren). A few clues break it: BARGAINING "Haggling shattered an aging
  brain" (US spelling; the clue dates from `f883696`), BASKET "slam dunk", IVY's US college
  sense. Present-tense "the Queen" = ER (TENDER "Mind the Queen, being gentle", TROOPER) has
  been dated since 2022.
- **Evidence:** audit 02 §2 #67, §3.8.
- **Lesson:** Cruci is a British puzzle; a US spelling reads as an error, not as flavour.
  Abbreviations tied to a particular time need a time cue ("old queen") or replacing.
- **Change:** F-AMERICANISM (a US spelling/usage list). The ER-as-current-monarch case goes into
  `abbreviations.ts` guidance.
- **Status:** Rule specified; Open (content).

### CL-040 · The &lit crash: the app didn't cover every device
- **Date:** 2026-10-02
- **What happened:** Solving an &lit, initialism or alternation clue blanked the page.
  Competence only tracks the nine taught devices, and `applySolve` read a record that didn't
  exist. Daily #13 (MEND, &lit) became reachable when the Daily archive launched, and #359
  (VILE) was scheduled. The learning/UX audit found it, not a user.
- **Evidence:** `ae5bffe` (`progress.ts`, new `progress.test.ts`); audit synthesis "Already
  fixed during the audit".
- **Lesson:** The writer is free to choose any device, so the app must handle every device the
  bank can contain. This is the second time a rarely used device failed in the app (CL-027).
  Diversifying the device mix (B-DEVICE-MIX) will put more weight on this path.
- **Change:** A guard plus a test (`progress.test.ts`). Standing check: before a batch ships with
  a device the bank hasn't used before, confirm that `hydrate`, `progress`, par and the rules all
  have a test for that `clueType`.
- **Status:** Closed.

### CL-041 · Owner decision: site copy never says who wrote the clues
- **Date:** 2026-10-02
- **What happened:** The product audit found site copy calling the clues "hand-clued",
  "hand-crafted" and "originally authored", and recommended an AI disclosure. The owner decided
  instead that **the copy never says who writes the clues**, whether human or AI. A banned-phrase
  guard enforces it.
- **Evidence:** `d6310aa` (`src/ux-language.test.ts` BANNED pattern: "Owner decision
  2026-10-02: copy never says who writes the clues"); audit 04 §1 for the original finding.
- **Lesson:** Writers and agents editing product copy, clue metadata, parses or hints must not
  claim authorship either way. The neutral statement is that clues are *checked and verified*.
- **Change:** The guard in `ux-language.test.ts`. The Bible's README tells agents not to put
  authorship claims in any shipped text.
- **Status:** Standing decision; Closed (test).

### CL-042 · Owner decision: the owner reads surfaces, blind, and nothing else
- **Date:** 2026-10-02
- **What happened:** The owner and the design spec settled two linked principles. (1) **The owner
  is not a cryptic expert**; the project exists partly to teach him. So every check that needs
  expertise must be a rule, a flag or an exam step that the system runs. (2) **The owner judges
  surfaces only, blind.** He sees bare sentences, with no answers, parses or scores, and answers
  "does this read like real English?" and "which reads more naturally?". His is the one
  independent human signal in the loop. It corrects the model judges' shared blind spot for
  crossword-ese (CL-032).
- **Evidence:** `8befc18` (spec, "Principles (locked with the owner)" 3 and 4; Writer method
  step 5). It replaces SKILL step 10 (CL-035).
- **Lesson:** Ask humans only for what they can judge better than the machine, and keep their
  signal free of anything the machine has already said (scores, parses, labels such as
  "winner").
- **Change:** Owner surface sessions: short, made of bare finalist surfaces in pairs, with picks
  logged as preferences in the ledger. The owner takes part in DECOY and TOURNAMENT-SURFACE,
  never in TOURNAMENT-WIT, COLD-SOLVE or EVIDENCE. Success measure: the owner's blind picks agree
  with the tournament winner ≥ 70% of the time. Owner picks feed a house-taste exemplar file
  (audit 01 P2.2).
- **Status:** Standing decision. Amended by CL-051: the owner also solves the finalists and reads
  the explanation, after the blind surface sessions.

### CL-043 · Nothing was auditable
- **Date:** 2026-10-02 (it applies to every batch since 2026-06-03)
- **What happened:** Candidates, judge outputs and panel scores lived in the gitignored `tmp/`.
  Bank entries carry no provenance: no candidates, scores, round, model or owner verdict. The
  commit trailers show the bank was written across at least three model versions (Claude Opus
  4.8 in June, Claude Fable 5 in June–August, Claude Opus 5.5 in October), and nothing records
  which model wrote which clue. Because of this, the 2026-10-02 audit had to re-derive
  everything, and nobody can yet tell whether any gate predicted solver enjoyment.
- **Evidence:** the runbook ("`tmp/` is gitignored scratch space"); commit `Co-Authored-By`
  trailers; audit 01 §1 ("Nothing is auditable") and the scorecard (auditability 3/10).
- **Lesson:** A system that can't show its evidence can't learn from it. Case law itself depends
  on a durable record.
- **Change:** `src/data/bank/ledger.jsonl` (committed): a scorecard per clue covering rule
  results, solver results, the naturalness rate, tournament ratings against anchors, evidence,
  model, date and decisions. Every case-law entry from now on cites a ledger run ID as well as
  a commit.
- **Status:** Exam specified (plan D4).
---

## 2026-10-02 (later): the owner's fairness instruction and Astra's audit

### CL-044 · Owner decision: rules must never make clues arbitrarily harder
- **Date:** 2026-10-02
- **What happened:** The first run of the Bible's rules failed shipped clues that used indicators
  and constructions professional setters use. The owner instructed that the rules must never
  make clues arbitrarily harder than published practice.
- **Evidence:** spec revision 2, "Fairness principles (owner)" (`1e12301`); `198c29f`
  (published-usage indicator lists, waivers, precision check); the header of
  `src/data/clue-rules.ts`; `scripts/rules-precision.mjs`.
- **Lesson:** A rule encodes an unambiguous fault, not a taste. A rule that fires on professional
  clues is wrong, not strict.
- **Change:** (1) A RULE is only for an unambiguous fault; anything needing judgement is a FLAG.
  (2) Every rule is precision-tested on published broadsheet clues
  (`scripts/rules-precision.mjs`); one that fires on professional clues is demoted. (3) Every rule
  can be waived for one clue with a written reason (`waivers`; `isBlocking` ignores a waived
  hit), which the exam's auditor checks and case law records. (4) A new failure becomes a
  **regression example first** (`examples/<device>.json`); a rule follows only once its precision
  is shown (the standing rule's point 4 above is amended to match). (5) Originality blocks only
  near-verbatim copies (R-COPY); a shared construction is informational (F-CHESTNUT).
- **Status:** Standing decision.

### CL-045 · The old style guide taught broken examples
- **Date:** 2026-10-02 (found by Astra's audit)
- **What happened:** Astra (ChatGPT, via Codex CLI) found that `docs/clue-style.md`, the
  agents' source of truth, taught examples its own validator contradicted. The CHAIR
  "improvement ladder" declared CHAR + A, which cannot make CHAIR (it is CHA(I)R: CHAR around
  I), and its best rung, "Cleaning-lady holds a position of authority", supplies A where the
  insertion needs I. The UNDERMINED hidden gave the fodder as "ermine deer", which does not
  contain the answer; the carrier starts in "Found". "Beheaded celebrity is sailor" (STAR − S =
  TAR) was correct, but the validator rejected it (CL-047). Astra reproduced the last two.
- **Evidence:** audit 08 (`docs/audit/2026-10-02/08-astra-chatgpt.md`, "What the earlier audit
  missed"); `docs/clue-style.md` §3 and §5. Verified before adoption (spec revision 2).
- **Lesson:** An example is an instruction, and agents imitate examples more readily than rules.
  A wrong example teaches with the Bible's full authority; consolidating the documents would
  have preserved the defects.
- **Change:** Every worked example is data in `docs/clue-bible/examples/<device>.json`, run in
  CI by `src/data/bible-examples.test.ts` through the validator, the surface gate and the
  blocking rules (`2ff7200`). Chapters cite example ids instead of pasting JSON. A bad clue is a
  "fail" example only if the machinery really rejects it, with the exact error; a bad clue the
  machinery accepts is a *judgement example*, kept in prose. Corrected examples:
  `container-chair-1` to `-3` (the ladder rebuilt on CHA(I)R), `container-chair-old` (fail),
  `hidden-undermined`, `hidden-undermined-old` (fail), `deletion-tar`. The first set has 62
  examples: 48 pass, 14 fail. Of the 20 clues in CL-037, the machinery rejects five (GENERAL,
  COB, WONDER, TIP, REWARD: `anagram-general`, `hidden-cob`, `deletion-wonder`,
  `reversal-tip`, `reversal-reward`); the other fifteen are judgement examples (most raise
  F-IDLE, a flag).
- **Status:** Closed (test). `docs/clue-style.md` still contains the wrong versions until it is
  retired to a stub (plan G1).

### CL-046 · Three validator loopholes
- **Date:** 2026-10-02 (found by Astra's audit)
- **What happened:** Astra ran deliberately broken candidates through the integrity and surface
  gates, and all three passed. "Pet in fog (3)" = CAT hidden in "cattle", a word absent from the
  clue. "Carts endlessly provide a pet (3)" = CARTS minus R and S, which "endlessly" does not
  authorise (the check only asked for a subsequence). "A dog (3)" = C + A + T, with nothing
  supplying C or T (single-letter pieces were accepted automatically). All 415 bank clues passed
  the gates, which showed conformity to the implementation, not fairness.
- **Evidence:** audit 08 (the validator table); `6d41317`.
- **Lesson:** A check that accepts the writer's declared output is an assertion, not a check.
  Test the checker with deliberately broken inputs, and keep them as regressions.
- **Change:** `integrity.ts` (`6d41317`): the hidden carrier must be in the clue; a deletion
  removes one contiguous part or both ends; every `concat`/`insert` piece, single letters
  included, comes from a prior op or a whole surface word. All 415 bank clues still pass, and the
  bank is validated in CI. Regression examples: `hidden-cat-absent-carrier`,
  `deletion-cat-scattered`, `charade-cat-free-letters`. The deletion check confirms that one
  contiguous part goes, not that it is the part the indicator names; that is checked by hand and
  in the cold solve. Deferred (spec revision 2): span-linked executable parses, Astra's
  "checkable construction" (which occurrence of which word supplies which letters).
- **Status:** Closed (`integrity.ts`); span-linked parses deferred.

### CL-047 · Synonym-then-precise-deletion was wrongly banned
- **Date:** 2026-06-05 (the ban, CL-016); lifted 2026-10-02
- **What happened:** CL-016 made a deletion's longer word mandatory in the surface, treating
  "find a synonym, then shorten it" like an indirect anagram. That rejected the old style
  guide's own correct example (*Beheaded celebrity is sailor*: STAR − S = TAR) and published
  model clues (ROTTING = ROTATING − A), and helped leave the bank with one deletion (CL-009).
  Astra: a synonym followed by a precisely specified deletion is a normal construction, and it
  is not like an indirect anagram, because removing the first letter is tightly constrained
  ([Crossword Unclued, deletions](https://www.crosswordunclued.com/2009/03/deletions.html)).
- **Evidence:** audit 08; `6d41317` (`viaSynonym` in `integrity.ts`); `02-devices/deletion.md`.
- **Lesson:** An analogy to a real fault is not evidence of a fault. Test a ban against published
  practice before adopting it (CL-044).
- **Change:** A deletion's source word may be printed or produced by a `synonym`/`abbreviate`
  op from a clue word; the deletion must still remove one specified part. Example
  `deletion-tar`. CL-016 is superseded in part: literal fodder is still required for anagrams,
  hiddens and alternations.
- **Status:** Closed (`integrity.ts`).

### CL-048 · Daily hints reset when leaving an unfinished clue
- **Date:** 2026-10-02 (found by Astra's audit, from code)
- **What happened:** Hints taken, letters revealed and letters typed on the Daily lived only in
  component state; only finished results persisted. Leaving an unfinished clue and returning
  lost the work and could turn a helped solve into a zero-help score. The same audit found that
  today's share link pointed at `/daily` (a moving target), that a page left open past midnight
  kept yesterday's clue, that restored Learn cards claimed "unaided!", and that bank
  `hintOverrides` were dropped by the loader.
- **Evidence:** audit 08 (code findings table); `b1a83b2`.
- **Lesson:** A score is honest only if the help behind it is remembered. Anything that affects
  a score must persist with it, and restored state must restore its provenance.
- **Change:** `b1a83b2`: attempts are saved per day and cleared on finish; share links use
  `/daily/N`; the date is re-checked on focus and visibility; restored Learn cards no longer
  claim "unaided!"; bank `hintOverrides` reach hydration. Recorded here because hints and par
  depend on it. Deferred (spec revision 2): immutable published clue revisions for past Dailies.
- **Status:** Closed.

### CL-049 · The hidden-indicator rule wrongly failed 12 clues
- **Date:** 2026-10-02
- **What happened:** R-HIDDEN-IND first accepted only indicators in
  `src/data/indicators/hidden.json`, mined from blog-annotated published clues. That table
  misses textbook indicators, so the rule failed "hides", "conceal", "keep", "cover",
  "shelters", "lurking", "hidden by", "at the heart of" and "revealed": 12 shipped clues
  (WALLET, PANTRY, DESK, INKPOT, CHESS, OFTEN, OTTER, OWL, SMOG, FIR, EARLOBE, TERRAIN) that a
  setter would accept. The device chapter at first told writers to work round the "gaps" or
  waive them.
- **Evidence:** `37c2455` (ratchet baseline 82 → 70); the earlier `02-devices/hidden.md` §3.2.
- **Lesson:** A mined list is a sample of usage, not the whole of it. A rule built on a sample
  must also accept the standard references, or it rejects what professionals do (CL-044).
- **Change:** `validHiddenIndicator` accepts published usage (word forms equivalent: hides =
  hide = hidden = hiding) **or** a standard family from the references (`HIDDEN_FAMILIES`).
  Only an indicator in neither fails; in the bank, COB "past" and NEST (no indicator). Fail
  examples `hidden-cob`, `hidden-nest`.
- **Status:** Closed (`clue-rules.ts`).

### CL-050 · F-UNATTESTED tested and rejected
- **Date:** 2026-10-02
- **What happened:** The spec proposed F-UNATTESTED: flag a surface whose central word joins
  never occur in real text (Alberich's search-engine test, mechanised with a word-pair corpus).
  Before adoption it was run on published broadsheet clues and on ours. Published clues tripped
  it **more** often than Cruci's: 62% against 34%.
- **Evidence:** `scripts/clue-flags.mjs` header ("tried and REJECTED 2026-10-02"); spec revision 2,
  "Rejected after testing"; `cb91616`.
- **Lesson:** A check that fires more on the professionals than on us measures nothing we want.
  Precision-test before adopting (CL-044). Alberich's test stays a writer's habit, not a flag.
- **Change:** No flag. Invented fodder and carriers (ASTRONOMY "An artsy moon", STARLING
  "superstar lingo") are judged in the exam (NATURALNESS, TOURNAMENT-SURFACE). The F-UNATTESTED
  part of CL-002 is superseded.
- **Status:** Closed (rejected).

### CL-051 · Spec revision 2: demotions to flags, and exam changes
- **Date:** 2026-10-02
- **What happened:** After CL-044 and Astra's audit (each finding verified before adoption), the
  design spec was revised. Astra's points: printing a component, a short familiar construction
  and solving a double definition from one half are low ambition, not invalidity; "unsolved by 2
  of 3 cold solvers" can punish difficulty and reward a lucky guess; a spot-the-crossword decoy
  measures genre cues; calibrating published favourites against our rejects confounds quality
  with provenance; revising prompts until they pass the same anchors is tuning to the exam.
- **Evidence:** `1e12301` (spec, "Revision 2"); audit 08 ("The Bible: worthwhile consolidation,
  flawed acceptance system"); `2ff7200` (R-PRINTED removed from `clue-rules.ts`).
- **Lesson:** Keep validity, naturalness, difficulty and delight separate, and never let a
  measure of one stand in for another.
- **Change:**
  - **Flags, not rules.** R-PRINTED → **F-PRINTED** at any coverage; R-IDLE → **F-IDLE**; the
    batch checks B-DEVICE-MIX and B-REPEAT are flags (diversity targets apply to what the learner
    actually meets). `scripts/validate-clue.ts` still exits non-zero on B-DEVICE-MIX (open).
  - **COLD-SOLVE.** A solve counts only with the correct parse. Uniqueness: named competing
    answers, each tested against definition and wordplay. Solve success is recorded separately.
    Solving a DD or CD from one half is not a defect; **F-QUIZ** now means "no distinct second
    reading", not "solved from the literal reading".
  - **NATURALNESS** replaces DECOY: paired comparisons plus "paraphrase the literal scene".
  - **Calibration.** Matched pairs (a sound clue vs a minimally corrupted copy; fluent-unfair vs
    awkward-fair; easy-good vs obscure-hard) and a held-out set never used for prompt tuning;
    report false-pass and false-reject counts at the chosen threshold, not just AUC.
  - **Owner.** He also solves the finalists and reads the explanation, after the blind surface
    sessions (amends CL-042). Second opinions go to Astra, not the owner.
  - **Labels.** External human solvers are deferred to the beta phase (owner decision); until
    then exam scores are labelled **"AI-calibrated, not human-validated"**.
  - **Deferred:** span-linked executable parses; immutable published clue revisions; multi-word
    bank answers; explanation checks in Learn.
- **Status:** Standing decision; Exam specified.


### CL-052 · Calibration split collided with the corruptor's alternation

- **Date:** 2026-10-03
- **What happened:** The calibration set (`scripts/exam/calibration-set.mjs`) split dev and
  held-out by alternating pair numbers. The corruptor agent was told to alternate corruption
  type by pair number too, so dev got only *unfair* copies and held-out only *unnatural* ones.
  Caught when the first dev report showed "0 unnatural".
- **Evidence:** `docs/clue-bible/calibration-results.md` (run 1, finding 5).
- **Lesson:** Splits must be independent of every other alternation in the pipeline. Check the
  composition of each split (types, devices, lengths) before running judges.
- **Change:** Re-split by pair number mod 4, before any template decision; held-out judged fresh.
  Calibration now reports its composition at the top of the section.
- **Status:** Resolved.

### CL-053 · Cold solving does not detect unfairness; corruptors make mistakes too

- **Date:** 2026-10-03
- **What happened:** In calibration, cold solvers solved originals and unfair copies at the same
  rate (83% vs 83% held-out, 89% vs 89% dev). Solvers reach the answer from the definition
  whatever the wordplay does. Separately, 2 of 30 "unfair" corruptions were still fair clues
  (APLOMB "follows"; PLUTOCRAT "Fool" = PRAT), and the judges were right to pass them.
- **Evidence:** `docs/clue-bible/calibration-results.md`.
- **Lesson:** Fairness is measured by judges who must PARSE (TOURNAMENT-WIT), not by solve
  rates. The cold solver's job is uniqueness and difficulty. Matched-pair corruptions need a
  mechanical check where possible.
- **Change:** `04-exam.md` updated; scoring never treats a solve rate as a fairness signal.
- **Status:** Standing.

### CL-054 · The definition gave it away: Daily #111 TELEVISION (owner, playing live)

- **Date:** 2026-10-03
- **What happened:** The owner solved Daily #111, "Novelise it for broadcast on the box (10)",
  without ever noticing the anagram: "the box" plus 10 letters is TELEVISION. In his words: "the
  answer is in the sentence… I didn't even realise it was an anagram indicator, it just sounded
  like 'the box' was television". The wordplay was irrelevant. The exam had scored it a tie
  with published clues (surface 50%, wit 50%), and "beat or tie" let it through.
- **Lesson:**
  1. A clue whose definition alone, plus the letter count, gives the answer isn't working as a
     cryptic. The solver never needs the trick, which is the whole point, and, for a trainer,
     the thing being taught.
  2. A tie with published clues isn't good enough for the Daily, the one clue everyone sees.
- **Change:**
  - New exam step **DEFINITION-ONLY** (`judges/def-only.md`, `scripts/exam/defonly.mjs`): solvers
    see only the definition and letter count. If most get the answer confidently, the clue gets
    the FLAG *definition gives it away*.
  - Published anchors get the same probe, so the rate is compared with professional practice.
    Easy beginner clues are allowed, so it's a flag, not a rule.
  - The Daily bar is raised (05: Daily selection).
- **Evidence:** the owner's report and screenshot, 2026-10-03; baseline scorecard TELEVISION
  surface 0.5 / wit 0.5.
- **Status:** Probe built and running on the baseline. Daily bar to be finalised with the
  baseline report.

### CL-055 · Cryptic definition vs quiz clue: the exam isn't fooled head to head

- **Date:** 2026-10-03
- **What happened:** The baseline scored our cryptic definitions highest of any device, while
  the audits said many were quiz clues. Calibration run 2 matched 13 real published CDs with
  quiz versions (plain descriptions with a "?").
- **Evidence:** `calibration-results.md`, run 2. Wit preferred the real CD 13/13. The
  definition-only probe flagged quiz versions 11/13, but also real CDs 6/13.
- **Lesson:** Head to head, the wit tournament separates real puns from quiz clues. The
  definition-only probe is weak for CDs (their definition is the whole clue). The CD baseline
  advantage may come from uneven anchors (anchors for the same answer are usually other
  devices).
- **Change:** For CDs, rely on TOURNAMENT-WIT plus R-CD-CONTRACT. In writer runs, give CD
  candidates a published-CD anchor where one exists.
- **Status:** Open (anchor-mix effect to check).

### CL-056 · The bare-word-list gate blocked compact double definitions (fairness)

- **Date:** 2026-10-03
- **What happened:** In Writer run 1, two independent setters hit the surface gate's "bare
  word-list — no verb/connector" check on two-word double definitions ("Polish grit", "Dock
  job", "Public officer"). The work setter reworded 14 of them.
- **Evidence:** precision check on 20,000 published UK clues. The check fires on 2.5%, nearly
  all compact double definitions ("Fancy wax", "Deny female opinion"): standard broadsheet
  practice.
- **Lesson:** A check that blocks a form professionals use routinely makes clues harder to
  write for no gain (owner's fairness principle). The word-list check is right for wordplay
  surfaces and wrong for whole-clue devices.
- **Change:** `surfaceGateFlags` exempts double definitions, cryptic definitions and &lit from
  the bare-word-list check (test in `clue-rules.test.ts`). Also noted: the raw-capitals check
  fires on 0.6% of published clues (acronyms like ITV, NATO). It's kept for now; revisit if it
  blocks fair clues.
- **Status:** Resolved.
