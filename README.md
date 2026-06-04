# Cruci

**Cruci** (*“kroo-see”* — from *cruciverbalist*, a lover of crosswords) is a static web app that teaches you to solve cryptic crosswords **one device at a time**, with a four-rung hint ladder and **scaffolding that fades** as your competence grows — until you are solving a plain daily cryptic with no help at all.

🔗 **Live:** https://jgm-89.github.io/cryptic-crossword-trainer/

It is fully client-side: no account, no backend. Your progress lives in your browser (IndexedDB).

## The idea

Every fair cryptic clue is a **definition** at one end and some **wordplay** at the other, each leading independently to the same answer. The biggest beginner unlock is to stop reading the clue as a sentence and find the boundary between those two halves. The whole app is built around teaching that.

### Scaffolding that fades

Support is withdrawn **per device**, driven by how you actually perform — so you can be *Independent* at anagrams while still being *Taught* at homophones. This mirrors the learning-science finding (McNeill, Lizotte, Krajcik & Marx, 2006) that *faded* support builds stronger independent skill than support that never lets go.

| Stage | Name | What the learner sees |
|-------|------|------------------------|
| **A** | Taught | One device at a time; definition pre-highlighted; device named; all hints one tap away. |
| **B** | Guided | Devices mixed; definition no longer highlighted; first hint available. |
| **C** | Coached | Full mix; hints only on request or after a wrong answer. |
| **D** | Independent | A real interlocking grid; no hints by default — parse available only after solving. |

A device advances a stage after a short streak of **unaided** solves; using a hint resets the meter.

### The four-rung hint ladder

1. **Definition** — which end of the clue defines the answer.
2. **Clue type** — which device is in play.
3. **Indicator & fodder** — the signal word and what it acts on.
4. **Full parse** — the complete worked breakdown.

## Features

- **Learn** — a curriculum of nine devices (hidden → anagram → charade → container → reversal → deletion → homophone → double-definition → cryptic-definition), lessons that unlock in order, and a per-device mastery board.
- **Play** — an archive of **300 cryptic crosswords** in two tiers: quick **Mini** grids (7×7 & 9×9) and full **Large** 13×13s. Each is a real interlocking grid assembled from a bank of ~366 hand-clued, verified answers spanning every device including **&lit**, **initialism** and **alternation**. Every clue is written to a documented style guide ([docs/clue-style.md](./docs/clue-style.md)) and machine-checked for fairness. Per-clue hints (definition highlight, then clue type), grid autosave, completion tracking, difficulty filters, and a hand-crafted showcase mini.
- **Clue analyzer** — pick any clue and peel it apart: definition span, device, and the indicator words that give it away.
- **Reference** — searchable indicator vocabulary and the standard abbreviation "code words".

### How the archive is built

`scripts/generate-puzzles.mjs` is a build-time crossword compiler. It places answers from the verified bank (`src/data/bank/*.json`) so they cross one another — a real interlocking crossword that is *fillable by construction* because every entry is a hand-clued word. The result is written to `public/archive.json` (fetched lazily at runtime) and guarded by tests that re-validate every clue and check for drift. Regenerate with `node scripts/generate-puzzles.mjs 120`.

## The clues

All teaching clues are **originally authored** and machine-checked for fairness by a runtime validator (`src/data/integrity.ts`, exercised in CI):

- exactly one contiguous definition at the start or end;
- wordplay that accounts for **every** letter of the answer;
- **no indirect anagrams** — fodder must be literally present in the surface;
- recognised indicators only; enumeration matches the answer length.

No third-party puzzles, grids, or blog annotations are reproduced. George Ho's openly-licensed clue dataset (ODbL) is used only as a build-time reference, never republished.

### Authoring & checking clues

Clues are written to a documented style guide and produced/checked with an AI-agent pipeline:

- **[docs/clue-style.md](./docs/clue-style.md)** — the per-clue contract: Ximenean fairness rules, surface craft, a 5-axis grading rubric, device conventions, and the exact `BankEntry` JSON shape.
- **[docs/clue-pipeline.md](./docs/clue-pipeline.md)** — the end-to-end runbook: how to chunk a bank part, dispatch setter agents, assemble winners, gate, audit, and regenerate — including the copy-paste agent prompt templates.
- Check any candidate against the real validator: `npm run clues:validate -- <file.json>` (`scripts/validate-clue.ts`). Helpers: `clues:chunk`, `clues:assemble`, `clues:patch`, `clues:regen`.

## Tech

Vite + React + TypeScript, deployed to GitHub Pages via Actions. State persists in IndexedDB (with a localStorage fallback). No runtime backend.

```bash
npm install
npm run dev        # local dev server
npm run test       # Vitest: fading engine + clue integrity
npm run build      # production build to dist/
```

The per-clue JSON schema (`src/types.ts` / `src/data/hydrate.ts`) is the contract between the content and the UI: a future offline generate-then-verify pipeline can emit the same shape to bulk-extend the corpus.

## License

Code: [MIT](./LICENSE). Clues and curriculum © the author.

---

🤖 Built with [Claude Code](https://claude.com/claude-code).
