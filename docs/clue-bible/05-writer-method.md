# 05 — The Writer method (how a clue is made)

A fixed procedure. Any agent following it should produce comparable work, because the quality
comes from the method — wide material, wide drafting, honest measurement — not from the agent
having a good day. Expert setters work this way: they start from material and a picture, draft
many versions, and throw most away (audit 03; Ximenes' account of clueing DAINTILY).

Read first: `01-qualities.md` (what we are aiming at), the device chapter(s) you will use in
`02-devices/`, and the latest entries in `06-case-law.md`.

## 1. Raw material — from the corpora, not memory

```bash
npx tsx scripts/raw-material.mjs ANSWER
```

Gives: the answer's senses (definition candidates), anagram fodder (single words and real
two-word phrases, attested ones first), hidden-word carriers found in real English sentences,
charade and container splits with cue words for each piece (dictionary synonyms first, then
approved abbreviations from `src/data/abbreviations.ts` only), and any reversal. Indicator
vocabulary per device: `src/data/indicators/<device>.json` (what published setters use).

**Published clues are never material.** Do not look up how others have clued the answer;
originality is checked afterwards (R-COPY blocks near-verbatim copies; similar is fine).

## 2. Scene briefs

For each answer, write 3–5 **scenes** before any clue: a setting, a subject and an action that
the pieces' *everyday* senses could belong to. Build an **alternative-sense table** for every
piece you might use (ring = O, but also phone, boxing, jewellery…) and prefer pieces whose
everyday sense fits the scene — that is where misdirection comes from. One picturable situation
per clue (01: Scene).

## 3. Wide drafting

Dispatch 4–6 **independent** setter agents, each locked to one device × one scene domain
(sport, kitchen, Westminster, office, garden, theatre, pub, travel…), each producing 5–8
candidates as full BankEntry JSON (`02-devices/_json-contract.md`). Across the whole pool, every
misdirection move must be attempted at least once: lift-and-separate, part-of-speech shift,
deceptive sense, capitalisation, and a cryptic-definition or &lit try where the answer allows.
Target 20–40 candidates per answer. Independence matters: drafts written together converge.

Prompt template: `judges/setter.md` (to be written with the first workout; until then use the
brief above plus the device chapter).

## 4. Filter — cheap checks first

```bash
npm run clues:validate -- candidates.json     # integrity + surface gate + RULES (R-*)
npx tsx scripts/clue-flags.mjs candidates.json # R-COPY, F-CHESTNUT, F-DEF-EVIDENCE
```

Discard any candidate with an unwaived RULE failure. FLAGS travel with the candidate into the
exam. A rule may be waived only with a written reason in the entry (`waivers`); the exam's
auditor reads it.

## 5. The Exam

Run the survivors through `04-exam.md` with the incumbent clue (if rewriting) and published
anchors in the same groups. Keep only candidates with zero faults that beat or tie the anchors on
surface and wit. Take the top 2–3 by combined win rate as **finalists**.

## 6. Owner session — surfaces and solving

The owner is not the cryptic expert (the machinery is). Two short, separate steps:

1. **Blind surfaces:** finalists' bare surfaces (no answers, no device, no hint which is the
   incumbent) shown in pairs — "which reads more naturally?" and "does this sound like something
   a person would say?". A clear "no" on the second question removes a finalist.
2. **Solve:** the owner solves the surviving finalists as a player would (with hints if needed)
   and reads the explanation. "This explanation made no sense" or "the aha was flat" is
   recorded.

Every pick is logged (ledger) and becomes a house-taste example over time.

## 7. Ship, record, learn

- Patch the bank (`node scripts/clue-patch.mjs <part> fixes.json`), set `par` via the par
  rubric (01, §par), run `npm test` and `npm run clues:regen`, regenerate the ratchet baseline
  if violations were fixed (`npx tsx scripts/clue-rules-baseline.ts`).
- `node scripts/exam/score.mjs --run <id> --ledger` so the shipped clue's scorecard is
  committed.
- **Case law:** any new failure pattern or decision → a dated entry in `06-case-law.md`, a
  regression example in `examples/`, and — only if its precision is proven — a rule.

## Batch hygiene

- Batch flags (03): cryptic + double definitions ≤ 25% of a general batch; ≥ 4 devices; no
  indicator more than twice. A deliberate single-device batch (a lesson) waives these with a
  reason.
- Bank answers are grid-locked (the Play archive uses them): rewrite the clue, never the answer.
- Daily history: a rewritten clue changes what past Dailies show (known gap, deferred:
  immutable published revisions — see spec revision 2).
