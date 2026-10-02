# UX language — one name per concept

UI copy uses these words verbatim. `src/ux-language.test.ts` enforces the banned column across
`src/pages` and `src/components` sources.

| Concept | The word | Banned in UI copy |
|---|---|---|
| The one-clue-a-day ritual | **the Daily** (page title `Daily #N`; share text `Cruci Daily #N`) | "Today's clue", "Daily Clue", "daily cryptic" |
| A teaching unit | **Lesson** | "course step" |
| A full crossword | **Puzzle** (the hand-built one: **Graduation Cryptic №1**) | "grid" as a standalone noun in page copy |
| A wordplay type | **Device** | "clue type" in page copy (the hint ladder's rung-2 label may keep it — it is taught there) |
| Consecutive days solved | **Streak** | "run", "chain" |
| Every past Daily, playable | **the Daily archive** (a past one is still `Daily #N`) | "back catalogue", "old clues" |
| The Daily's target score | **par** — results read `Par`, `1 under par`, `2 over par` | "target", "goal score" |
| The letter-reveal hint | **Show a letter** | "reveal a letter", "letter hint" |

When adding copy, check this table. When a concept is missing, add it here first.
