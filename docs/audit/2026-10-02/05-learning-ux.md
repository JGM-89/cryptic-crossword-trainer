# 05 — Learning design & UX audit

Scope: Learn curriculum, fading engine, first-run journey, the new par Daily, accessibility and mobile basics. Based on reading the code at `6b1e2b4`, plus a throwaway vitest dump of lesson composition and the Daily schedule (since removed).

**Verdict.** The teaching *clues* are strong: §1c's "gentle, never transparent" rule is right, and it is the thing most beginner products get wrong. The *course around them* is thin and partly hollow. Lessons have no instruction, the fading engine mostly removes the wrong hint, the advancement rule measures the easiest items, and the documented scaffolding policy isn't what the code does. One crash bug sits on a live Daily.

---

## 1. Pedagogy

**What's sound**
- Definition + wordplay is the core idea, it's stated on Home, Learn and About, and the hints reinforce it. This is the right single concept to teach.
- One device per lesson, then mixed practice, then a grid. That's the classic progression that beginner books and the Times Quick Cryptic ecosystem use.
- Inline abbreviation glosses in hint 3 (`hydrate.ts` `abbreviationNote`), e.g. "love" = O (zero, as in tennis), teach the shorthand at the moment it's needed.

**Gaps compared with how others teach**

| Gap | What Cruci does | What good teaching does (books, Times Quick Cryptic blogs, Minute Cryptic-style courses) |
|---|---|---|
| **Worked examples** | `LessonPage` shows one sentence of blurb, then five live clues. | Each device opens with 2–3 fully parsed examples, then a faded example (half-parsed), then practice. Cruci has the parse data already (`wordplay.operations`), it just never shows it before the learner tries. |
| **Crossword-ese / abbreviations** | No lesson. Abbreviations first appear in charades (lesson 3: BARGAIN, JACKPOT) and containers (lesson 4, difficulty 3–4) with no introduction. The Reference page is never linked from lessons or hints. | A dedicated early unit ("the code words": compass points, O = love/nothing, Roman numerals, R/L/P/F…), then drills. Most books treat this as a prerequisite for charades and containers. |
| **Indicator recognition** | Indicators are only met inside full clues. | Short drills: "Is *broadcast* an anagram, homophone or reversal indicator?" Seeing many indicators quickly is the cheapest way to build pattern recognition. |
| **Lift and separate / finding the definition** | Said in prose. Never practised as its own skill. | "Tap the definition" exercises with no answer entry. This is the single most transferable skill, and the hint data (`definitionSpan`) already supports it. |
| **Device discrimination** | Stage A lessons are single-device with the device badge showing, so the learner never has to *identify* the device until Stage B. | Interleaved practice early: mix 2 devices as soon as 2 are known. |
| **Spaced repetition / review** | None. Competence never decays and solved cards can't be replayed (`alreadySolved` locks them). | Review of weak devices at growing intervals. PRODUCTIONPLAN #5 already plans it. |
| **Coverage** | 63 Learn clues in total (44 A + 6 B + 5 B + 8 C) and a 5×5 grid. Stage B never mixes homophones, double definitions or cryptic definitions. Stage C has no deletion because the bank holds only **1** deletion clue, and `B-mix-2` has 5 cards, not 6, for the same reason. | Typically 15–30 practice clues per device. |
| **Untaught devices in the wild** | The Daily and Play use `lit`, `initialism` and `alternation`, which no lesson teaches (Daily #13 MEND is an &lit initialism). | Teach every device you serve, or flag the untaught ones ("new device!") the first time they appear. |

**Difficulty ordering inside Stage A.** Containers (lesson 4) are difficulty 3–4 and homophones are 3–4, while reversals and deletions after them are 2–3. Containers need synonyms *and* abbreviations *and* insertion, which is the hardest construction in the beginner set. Put reversals and deletions before containers, and put the abbreviations unit before charades.

**Hint explanation quality.** Hints 1 and 4 are good. Hint 3 is boilerplate for whole-clue devices: double definitions get "look for a second meaning", cryptic definitions get "look for the pun", and &lit gets text that is nearly identical to hint 2. Hint 2 restates the device description. For anagrams, hint 3 hands over the fodder, which almost gives the answer, while for double and cryptic definitions it gives nothing. Hint power varies a lot by device, which matters now that the Daily charges 1 for each hint.

## 2. The fading engine

The rule: 2 consecutive hint-free solves of a device moves it up one stage (`ADVANCE_THRESHOLD = 2`). Any hint resets the streak. There is no demotion and no decay.

**Does it measure learning or luck? Mostly neither. It measures exposure to the easiest items.**
- Stage A lessons run easiest-first (the first two hidden and anagram clues are difficulty 1). Two clean solves of the two easiest clues, with the device badge showing and the lesson title naming the device, promote that device to B.
- Finishing a Stage A lesson cleanly (5 clues) moves the device **A→B→C** before the learner has seen a single mixed clue. So in Stage B lessons, which defer to competence (`effectiveStage`), the learner sees **C** scaffolding. The lesson's own pill and blurb promise "Guided … the first hint is always one tap away" with the definition rung, and the scaffolding contradicts them.
- Wrong guesses are free and unlimited, so a 4-letter anagram can be brute-forced and still count as a clean solve. Time is recorded but never used.
- Revealing the answer still completes the lesson and unlocks the next one. "Lesson complete. Nice work — your mastery has moved on" shows even when every card was revealed.
- Hints taken in the Graduation grid (`PuzzlePage`) don't count as hint use, because only reveals set `usedHint`. Every Daily solve, including unlimited archive catch-ups, also feeds competence, so the archive can farm stages.

**The policy is partly dead code.** `scaffoldingFor` defines `hintAvailability` values `onRequest`, `afterAttempt` and `afterSolve`, but `ClueCard` ignores the field and always shows "Need a hint?". In practice, fading changes only two things: the device badge disappears, and **the definition rung is removed** (`startingTier: 2`). That's backwards. Finding the definition is the core skill and the most valuable first nudge. Advanced solvers still want it, and Minute Cryptic-style menus keep it. About page copy ("the definition stops being highlighted, then the hints retreat behind a tap") describes behaviour the code no longer has.

**Better model (small change):** promote on *k of the last n* clean solves (e.g. 3 of 4), counting only clues at difficulty ≥ the stage's floor, in *mixed* contexts. Demote on 2 consecutive helped solves. Never remove the definition rung; fade by *price* and *order* instead. Add a last-seen timestamp per device to drive review.

## 3. The journey

**First visit → Learn.** Home pitches well ("Every clue has a seam"). The Learn page then opens with nine "A" chips, four stage headers (Taught/Guided/Coached/Independent), 13 tiles mostly marked "Locked" with no explanation of how to unlock them, and the jargon "hint ladder — 4 rungs, disclosed one at a time". A newcomer needs exactly one button: **Start lesson 1**.

**First lesson.** No teaching precedes the first clue. Hidden words are a kind first device, so lesson 1 survives. **The likely drop-off is lessons 3–4**: the first synonym and abbreviation work arrives untaught, and containers are at difficulty 4.

**Dead ends and confusions**
- **Post-Daily "Sharpen your Xs →"** (`DailyBridges`) links to the Stage A lesson for the weakest device. If that lesson is already done, every card is shown solved and nothing can be replayed. A dead end at the exact moment of motivation.
- **Shared IDs.** Stage B/C lessons use bank IDs, and so does the Daily. Solving Daily #55 GOD, #66 NET, #87 TIP and others silently pre-solves (and spoils) Learn cards. The Home stat "Clues solved in lessons" also counts Daily solves.
- The Play "Featured" card opens the Graduation grid, which shows a "D Independent" pill and a "← All lessons" breadcrumb to a Play user.
- Its blurb says "No hints by default", but the grid shows Definition and Clue type buttons.
- Vocabulary drifts: "Clue type" (Learn ladder, grid buttons), "Name the device" (Daily), "device" (UX doc); "rung", "ladder", "fodder", "indicator", "Stage C".

**Navigation.** The header has Daily, Learn, Play plus More (Analyzer, Reference, About), a streak chip and the theme toggle, and Home's "Four ways in" puts Analyzer on equal footing with Learn. For a beginner that's too many doors. Analyzer is a power tool, and Reference would earn its keep linked from inside hints ("see all anagram indicators →") rather than as a destination.

**Single clues → grids.** Graduation is a 5×5 with 6 entries using only charade, anagram and hidden. Next comes Play: 7×7 and 9×9 minis, then 13×13. Three problems with that step:
- Grid entries include untaught devices.
- Grid hints stop at the device: no wordplay rung until you reveal.
- "Check grid" is free and unlimited.

The jump in *grid skills* (using crossers, choosing a way in, handling a dozen clues at once) is never taught. A "your first mini" lesson would bridge it: a 7×7 with commentary on using checked letters and a "start with the anagrams and hiddens" tip.

## 4. The par Daily vs Learn's fading

Same rules for everyone, wrong guesses free, and par ≥ 2 so taking one or two hints still reads as "Par". That's a well-judged, beginner-tolerant ritual, and it de-stigmatises hints better than Learn does, where any hint resets your streak.

**Tensions**
- **Two hint models.** Learn uses an ordered, free ladder that resets your streak. The Daily uses an unordered, priced menu. Labels differ, and the full parse is reachable in Learn but not in the Daily. A learner moving between them has to relearn the controls. Pick one model; the menu is the better one.
- **Uneven hint value.** Each Daily hint costs 1, but "Explain the wordplay" nearly solves an anagram and says almost nothing for a double or cryptic definition. Cryptic and double definitions make up about 30% of Dailies 1–120 and carry the highest pars (LABORATORY par 6). For a beginner, those days are the ones most likely to end in a reveal.
- **Wrong door for newcomers.** Home's first-visit secondary CTA, "Or try today's Daily", sends complete novices to the hardest surface. The "New to cryptics?" link on /daily is good. Consider making lesson 1 the *only* first-visit CTA, or offer a guided first Daily (definition pre-shown, score not counted) for brand-new users.
- **Daily as assessment.** Daily solves change Learn competence, which is good in principle. But catch-up solves are unlimited, and untaught types crash the engine (next point).

**Bug (P0):** `initialCompetence()` only covers the 9 taught devices. Solving a `lit` Daily calls `recordSolve(undefined, …)` and throws ("Cannot read properties of undefined (reading 'attempts')") inside a `setState` updater. There is no error boundary, so the page goes blank. **Daily #13 (MEND) is in the archive now**, and #359 VILE is upcoming. Reproduced in a scratch test.

## 5. Accessibility and mobile (from code)

**Good**
- Global `:focus-visible` ring.
- `prefers-reduced-motion` respected.
- `role="alert"` on wrong answers and `role="status"` on solves.
- The grid uses a hidden real input (the right mobile-keyboard approach) with a polite live region.
- `PuzzleComplete` traps focus, closes on Escape and restores focus.
- The More menu closes on Escape and outside clicks.

**Issues**
- `HintMenu` doesn't move focus into the menu when it opens, and Escape only works if focus is already inside. Revealed hint text (Learn ladder and Daily list) isn't announced; add `aria-live="polite"` to the hints container.
- `AnswerStrip` lacks `autoComplete/autoCorrect="off"` and `spellCheck={false}`, which `MiniGrid` has. iOS autocorrect can interfere. Pasting a whole word is dropped (`slice(-1)`), and every cell is a separate tab stop.
- Touch targets: `.pc-hint-btn` is about 26px tall and `.chip-btn` about 30px, below the 44px guideline. A 13×13 grid at 375px gives roughly 25px cells, and the clue list sits below the grid, so solvers scroll back and forth. A sticky current-clue bar above the grid would fix both.
- Competence chips and highlight meanings rely on `title` tooltips (invisible on touch and unreliable for screen readers). Locked lesson tiles are non-focusable divs with no unlock hint.
- The definition and indicator highlights are `<mark>` distinguished only by colour. Add a non-colour cue (underline style or label) for colour-blind users.

## 6. Prioritised recommendations

| # | Recommendation | Impact | Effort |
|---|---|---|---|
| 1 | **Fix the &lit/untaught-device crash** (guard `applySolve` for types outside `CLUE_TYPE_ORDER`) and add an app error boundary | High | XS |
| 2 | **Fix the "Sharpen" dead end**: let solved lessons be replayed ("Practise again" resets the cards, or serves fresh bank clues of that device) | High | S |
| 3 | **Add a worked-example intro to every Stage A lesson** (2 parsed examples, built from the existing `operations`/`parse` data) | High | S–M |
| 4 | **Stop fading out the definition rung**; make the scaffolding match the docs or update the docs; align lesson pill and blurb with effective scaffolding | High | S |
| 5 | **Add an abbreviations/crossword-ese unit** before charades, with quick drills; link Reference from hint 3 | High | M |
| 6 | **Reorder Stage A** (reversal and deletion before container) and grow Stage B/C so every device gets mixed reps; author more deletion, container, reversal and homophone clues via the clue-writer skill | High | M |
| 7 | **Rework advancement**: k-of-n in mixed contexts, difficulty-weighted, demotion on repeated helped solves; don't count reveals toward lesson completion (or label them honestly); count grid hints as hints | Med–High | S–M |
| 8 | **Unify hint vocabulary and model** across Learn, Daily and grid (one menu, the same labels, the definition always available) | Med | S–M |
| 9 | **Rewrite hint 3 for double definitions, cryptic definitions and &lit** with clue-specific text (`hintOverrides[3]`) so each Daily hint is worth its cost | Med | M (content) |
| 10 | **Separate ID spaces** for the Daily and Learn, or exclude Learn B/C answers from the schedule | Med | S |
| 11 | **Simplify first-run**: one CTA (lesson 1), hide the competence board and stage jargon until the first lesson is done, explain locks | Med | S |
| 12 | **Bridge to grids**: a commented "first mini" lesson; mark untaught devices in Play; sticky clue bar on mobile | Med | M |
| 13 | **Lightweight review (spaced repetition)**: per-device last-seen + "weak-device day" (PRODUCTIONPLAN #5) | Med–High | M |
| 14 | A11y polish: HintMenu focus, live hint announcements, AnswerStrip input attributes, 44px targets, non-colour highlight cue | Med | S |

Quick wins this week: 1, 2, 4, 10, 14. The biggest learning gain for the effort is 3 + 5, which turns a practice set into a course.
