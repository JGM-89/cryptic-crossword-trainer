# Exam calibration results

> **AI-calibrated, not human-validated.** These numbers show the exam's judges can tell a
> published clue from a minimally corrupted copy of it. External human solvers haven't yet
> confirmed the exam agrees with them (deferred to beta).

## Run 1 — 2026-10-03 (judge templates v1)

**Panel:** Claude (2 independent subagents per step) and Astra (ChatGPT `gpt-6-astra`, medium
effort, read-only).

**Set:** 60 published UK broadsheet clues (Times; Guardian/Independent/FT via Fifteensquared),
each with a minimally corrupted copy written by an agent: 30 *unfair* (wordplay broken, surface
unchanged) and 30 *unnatural* (wordplay intact, surface made awkward). The set was split 50/50
into dev and held-out, with both corruption types in each half. Templates weren't changed after
dev, so held-out is a true first look.

### Held-out (the reported numbers)

| Measure | Result | Target |
|---|---|---|
| Unnatural copy: surface tournament prefers the original | **15/15** | ≥ 80% |
| Unfair copy: judged unfair by a majority of wit judges | **13/15**, and both misses are corruptor errors (see below), so **13/13** genuinely unfair copies were caught | ≥ 80% |
| Unfair copy: wit tournament prefers the original | 14/15 | — |
| Originals given any exam fault (false alarms) | **0/30** | ≤ 10% |
| Position bias (first-shown clue chosen) | 50% | 50% |
| Cold-solve rate, originals vs corrupted | 83% vs 83% | — |

**Per judge, held-out, all 60 comparisons:** how often each judge preferred the original.

| Judge | Surface | Wit |
|---|---|---|
| Claude-1 | 50/60 | 58/60 |
| Claude-2 | 50/60 | 56/60 |
| Astra | 46/60 | 50/60 |

No single judge is as good as the panel. The surface judges' 46–50/60 includes the unfair pairs,
whose surfaces are equally natural by design, so roughly 45/60 is the ceiling there.

### Dev

- 30 unfair pairs: 28/30 judged unfair, 0/30 originals called unfair; cold-solve 89% vs 89%.
- 15 unnatural pairs: 15/15 originals preferred on surface.

### Findings

1. **The exam separates fair from unfair, and natural from unnatural, with no false alarms on
   professional clues.** The bar is met; the v1 templates stand.
2. **Cold solving doesn't detect unfairness** (83% vs 83%; 89% vs 89%). Solvers reach the answer
   from the definition even when the wordplay is broken, as Astra's audit predicted. Fairness is
   caught by the **wit judges, who must parse both clues**. The cold solve's role is therefore
   answer uniqueness (alternatives) and difficulty, not fairness.
3. **The corruptor itself made 2 errors** that the judges correctly refused to call unfair:
   - APLOMB, "follows" for "admits": still a valid charade, A + PLO + MB.
   - PLUTOCRAT, "Fool" for "Idiot": FOOL = PRAT is as good a synonym.

   Matched-pair sets need their corruptions checked mechanically where possible.
4. **The surface judges flag weak published surfaces too.** On dev, 3 published clues were
   called incoherent by most judges (e.g. ERMINE, "Let me see explosive fur"). Published clues
   aren't uniformly good, which is why the bar is "beat or tie the anchors", not "beat a
   perfect clue".
5. **A process slip, caught.** The first split put every unfair copy in dev and every unnatural
   one in held-out, because both the corruptor and the split alternated by pair number. The set
   was re-split (pair number mod 4) before any template decisions, and the held-out run used
   fresh judging. Recorded in case law.
