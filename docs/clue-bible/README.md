# The Clue Bible

The single standard for how Cruci's cryptic clues are written, checked and measured. It
replaces `docs/clue-style.md` and `docs/clue-pipeline.md`. Any agent writing or editing a clue
follows this Bible through the Clue Writer skill (`.claude/skills/clue-writer/SKILL.md`); the
skill is a thin procedure that points here.

**Why it exists.** The goal is a system that *reliably* writes great clues with the best
surfaces. Quality has to come from the system, not from whichever agent happens to be working.
So the standard is written down with its sources, the basics are checked by machine, quality is
measured against real published clues, and every failure is recorded so the next agent inherits
the lesson.

## Read in this order

| Chapter | What it is |
|---|---|
| [01 — Qualities](01-qualities.md) | What a great clue is, quality by quality: definition, why (with sources), how it's measured, pass bar, exemplars. Includes the par rubric and the teaching register. |
| [02 — Devices](02-devices/) | One chapter per device: fair forms, indicators, surface craft, typical failures. Plus abbreviations and the JSON contract. |
| [03 — Rules and flags](03-rules-and-flags.md) | What the machine checks, the fairness principles behind every rule, and their measured precision. |
| [04 — The Exam](04-exam.md) | How a clue is measured: cold solve, surface and wit tournaments against published anchors, and evidence. How the exam itself is calibrated. |
| [05 — The Writer method](05-writer-method.md) | The fixed procedure for making a clue: raw material → scenes → wide drafting → filter → exam → owner session → ship. |
| [06 — Case law](06-case-law.md) | Every failure and decision, dated, with what it changed. Read the latest entries before every batch. |
| [07 — Sources](07-sources.md) | Bibliography. |
| [examples/](examples/) | Every worked example, as data checked in CI. The Bible can't teach an example the validator contradicts. |
| [judges/](judges/) | The exact, versioned judge prompts the exam uses. |

## Standing decisions (owner)

- **Clues are written only through this system.** Never ad hoc.
- **The owner isn't the cryptic expert.** The machinery is. The owner reads surfaces blind and
  solves finalists as a player would.
- **Rules must never make clues arbitrarily harder.** RULES only for unambiguous faults,
  precision-tested on published clues, and waivable with a written reason; everything else is a
  FLAG.
- **Published clues are for checking, never copying.** Similar is fine; near-verbatim copying
  is blocked. Their text is never committed or shown on the site.
- **Second opinions come from Astra** (ChatGPT via Codex CLI), not the owner.
- **The exam's scores are AI-calibrated, not human-validated,** until external solvers check it
  in the beta phase.
- **Site copy never says who writes the clues.**

## Tools at a glance

```bash
npm run corpus:fetch                               # local reference corpora (.corpus/, gitignored)
npx tsx scripts/raw-material.mjs ANSWER            # Writer step 1
npm run clues:validate -- file.json                # integrity + surface gate + RULES
npx tsx scripts/clue-flags.mjs file.json           # R-COPY + corpus flags
node scripts/exam/prepare.mjs --run ID --input file.json   # Exam batches
node scripts/exam/astra.mjs --template T --in batch.json   # Astra as a judge
node scripts/exam/score.mjs --run ID [--ledger]    # scorecards
npx tsx scripts/rules-precision.mjs                # rule precision on published clues
npx tsx scripts/clue-rules-baseline.ts             # regenerate the shrink-only ratchet
```
