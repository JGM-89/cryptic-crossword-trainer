---
name: clue-writer
description: Author, rewrite or measure Cruci cryptic clues through the Clue Bible — raw material from corpora, scene briefs, wide independent drafting, machine rules, the calibrated Exam (cold solve + surface/wit tournaments vs published anchors + evidence), owner surface/solve session, ledger and case law. Use for ANY clue writing or clue-quality work (bank rewrites, teaching-corpus edits, corpus expansion, baselines). Clues are ALWAYS written through this system (owner's standing decision).
---

# The Cruci Clue Writer

This skill is a thin procedure. **The standard lives in the Clue Bible: `docs/clue-bible/`.**
Read `docs/clue-bible/README.md` first, then the chapters it lists, and always the latest
entries in `06-case-law.md`. If this skill and the Bible ever disagree, the Bible wins. Fix the
skill.

## Standing decisions (owner)

- Clues are only ever written through this system. No ad hoc rewrites "with no context".
- **The owner isn't the cryptic expert. The machinery is.** The owner reads surfaces blind and
  solves finalists like a player. Never make him the expert gate.
- **Rules must never make clues arbitrarily harder.** RULES only for unambiguous faults,
  precision-tested on published clues, waivable with a written reason. Everything else is a
  FLAG (`03-rules-and-flags.md`).
- **Published clues are for checking, never material.** Never look up how others clued an
  answer. R-COPY blocks only near-verbatim copies; similar is fine.
- **Second opinions come from Astra** (`node scripts/exam/astra.mjs` or `codex exec -m
  gpt-6-astra …`), not the owner. Verify its claims before acting.
- **Exam scores are "AI-calibrated, not human-validated"** until external solvers check them.
  Say so whenever you report them.
- **Site copy never says who writes the clues.**

## Modes

- **rewrite** (bank): the answer is grid-locked (Play uses it). Identical letters; any device.
  Output a patch for `scripts/clue-patch.mjs`.
- **teach** (`src/data/clues.ts`): teaching register (`01-qualities.md`). Keep the lesson's
  device; the answer may change if it can't reach a natural surface.
- **expand** (new bank answers): dedupe against the bank and the teaching corpus. After
  merging, run `npm run daily:gen` and `npm run clues:regen`, and update counts in
  README/Home.
- **measure** (baseline or audit): the Exam only, no writing. `04-exam.md`.

## Procedure (per batch) — details in `05-writer-method.md`

1. `npm run corpus:fetch` once per machine.
2. **Raw material:** `npx tsx scripts/raw-material.mjs ANSWER` for every answer.
3. **Scene briefs** and the alternative-sense table, per answer.
4. **Wide drafting:** 4–6 independent setter agents, each locked to one device × one scene
   domain, producing 20–40 candidates per answer as full BankEntry JSON
   (`02-devices/_json-contract.md`). A cryptic definition must carry
   `pun: {misleading, true}`.
5. **Filter:** `npm run clues:validate -- cands.json` (no unwaived R-* hits), then
   `npx tsx scripts/clue-flags.mjs cands.json` (no R-COPY). Flags travel on.
6. **Exam:** `node scripts/exam/prepare.mjs --run ID --input survivors.json`, then judges
   (Astra via `scripts/exam/astra.mjs`, plus independent Claude subagents that read ONLY their
   template and batch, never `key.json`), then `node scripts/exam/score.mjs --run ID`.
   Finalists have zero faults and beat or tie the anchors on surface and wit.
7. **Owner session:** blind surface pairs, then a solve with the explanation. Log the picks.
8. **Ship:** patch the bank, set `par` (`01-qualities.md` par rubric), `npm test`,
   `npm run clues:regen`, shrink the ratchet (`npx tsx scripts/clue-rules-baseline.ts`),
   `node scripts/exam/score.mjs --run ID --ledger`.
9. **Learn:** a case-law entry for every new failure pattern or decision; a regression example
   in `docs/clue-bible/examples/`; a rule only once its precision is proven.

## Never

- Weaken a test, the validator or a rule to make a clue pass. Fix the clue, or waive with a
  reason.
- Report your own drafts as good without the Exam.
- Let a judge see answers on surface steps, or see `key.json`.
