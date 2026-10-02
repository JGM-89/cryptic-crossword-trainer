# The BankEntry JSON contract

*Clue Bible, chapter 02 (devices), shared file. It replaces `docs/clue-style.md` §6. Rule IDs
(R-…, F-…, B-…) are defined in `03-rules-and-flags.md`. Status: v1, 2026-10-02.*

Every clue an agent writes is emitted as one **BankEntry** JSON object. Worked examples of the
shape, one per device, live in `../examples/*.json` and are checked in CI
(`src/data/bible-examples.test.ts`); the full shape below is `container-broaden`. The shape below is the
current one (`src/data/bank/index.ts` → `BankEntry`) plus three additions from the Clue Bible
design (`docs/superpowers/specs/2026-10-02-clue-bible-design.md` §2–3): `evidence`, `pun` and a
mandatory `par`.

> **Code status (2026-10-02).** `scripts/validate-clue.ts` runs three layers:
> `src/data/integrity.ts` (letter mechanics, abbreviations, composition: marked
> **[validator]** below), `src/data/surface-rules.ts` (surface gate) and
> `src/data/clue-rules.ts` (the Bible's R-/F-/B- rules: unwaived R-* are errors, F-* are
> warnings). Under spec revision 2 the batch checks (B-*) are flags; note that
> `scripts/validate-clue.ts` still exits non-zero on a B-DEVICE-MIX hit, so record the reason
> and treat that exit as a flag until the script is changed. `pun` is already read by `clue-rules.ts`
> (R-CD-CONTRACT). `evidence` is not read by code yet (it will be by `scripts/clue-flags.mjs`,
> F-DEF-EVIDENCE; `scripts/clue-flags.mjs` currently checks the definition against WordNet and
> Moby). Emit every **[new]** field now anyway: a candidate without them fails the
> Bible even when the script passes it.

---

## 1. Full shape

```jsonc
{
  "answer": "BROADEN",                 // [validator] A–Z only, no spaces or hyphens
  "clueType": "container",             // [validator] one of the 12 device names (§3)
  "difficulty": 3,                     // 1–5, see 01-qualities (difficulty honesty)
  "par": 4,                            // [new: required] 2–6, the Daily's par (§5)
  "clue": "Widen the way through the mountain (7)",   // surface + "(n)"; n = answer length
  "def": {
    "text": "Widen",                   // [validator] exact substring of clue, at one end
    "position": "start",               // [validator] "start" | "end"
    "evidence": {                      // [new] required except for cryptic-definition (§4)
      "source": "wordnet",
      "sense": "broaden.v.01: make broader",
      "ref": "broaden.v.01"
    }
  },
  "wordplay": {
    "indicator": "through",            // [validator] verbatim from the surface, or "" (§2)
    "fodder": "ROAD in BEN",           // [validator] what the device acts on (per device)
    "operations": [                    // [validator] ordered; the LAST op outputs the answer
      { "op": "synonym", "input": "way", "output": "ROAD",
        "evidence": { "source": "wordnet", "sense": "road.n.01: an open way for travel" } },
      { "op": "synonym", "input": "mountain", "output": "BEN",
        "evidence": { "source": "collins", "sense": "ben (Scot.): a mountain peak" } },
      { "op": "insert", "input": "ROAD in BEN", "output": "BROADEN" }
    ]
  },
  "parse": "ROAD (way) through BEN (mountain) = B(ROAD)EN = BROADEN, to widen."
  // "pun": { "misleading": "...", "true": "..." }   // [new] cryptic-definition only (§6)
  // "waivers": [ { "rule": "R-HIDDEN-IND", "reason": "..." } ]   // optional (§6a)
}
```

Field order in the file does not matter. Do not add fields other than these.

## 2. Field rules

| Field | Rule | Enforced by |
|---|---|---|
| `answer` | Upper-case A–Z, one word. The enumeration in the clue is derived from it, so `(n)` must equal the letter count. | validator (`integrity.ts` check 2) |
| `clueType` | Exactly one of: `hidden`, `anagram`, `charade`, `container`, `reversal`, `deletion`, `homophone`, `double-definition`, `cryptic-definition`, `initialism`, `alternation`, `lit`. Pick the device that the **final** operation performs. A charade with one reversed piece is a `charade`; an anagram that is also the definition is `lit`. | validator |
| `difficulty` | Integer 1–5. Honest. A plain one-step device with a transparent definition is 1–2; a container plus an abbreviation with a disguised definition is 4. | par rubric cross-check (`scripts/par-apply.mjs` flags difficulty ≤ 2 with par ≥ 5, and ≥ 4 with par 2) |
| `par` | Integer 2–6 (§5). | `bank.par.test.ts` fails on any bank clue without it |
| `clue` | The surface, a space, then `(n)`. No other brackets. | validator |
| `def.text` | Exact substring of `clue`, case and punctuation included. It must touch the start or the end of the clue (ignoring the `(n)` and trailing punctuation). The validator allows at most 2 leading characters before a `start` definition (so "A fair…" with `def.text` = "fair" passes). For `cryptic-definition` and `lit`, `def.text` is the whole clue without `(n)`, `position: "start"`. | validator (check 3) |
| `def.position` | `"start"` or `"end"`. | validator |
| `def.evidence` | §4. Required for every device except `cryptic-definition` (which uses `pun`). | [new] F-DEF-EVIDENCE |
| `wordplay.indicator` | Copied **verbatim** from the surface, because hint rung 3 quotes it. `""` for devices with no indicator (charade, double-definition, cryptic-definition). If the indicator is split, join the fragments with ` ... `. | `surface-rules.ts` `indicatorAbsent` (gate) |
| `wordplay.fodder` | Per device (see each device file). The hint ladder quotes it, so write what the solver works on. If left empty, `index.ts` back-fills it from the first operation's input. | validator, per device |
| `wordplay.operations` | Ordered list. Each op is `{op, input, output}` plus optional `note` and, for `synonym` ops, the required `evidence`. The **last op's `output` must equal `answer`**. | validator (check 6) |
| `parse` | Hint rung 4, shown to learners. One or two sentences: every piece, its source word in brackets, the indicator in quotes, the assembly, then the definition. For CDs, state both readings. | judges, owner |
| `pun` | Only on `cryptic-definition`. §6. | [new] R-CD-CONTRACT |
| `waivers` | Optional. §6a. | `clue-rules.ts` (a waived R-* hit no longer blocks) |

## 3. Operation vocabulary

The `op` field is one of the twelve values in `src/types.ts` → `WordplayOp`:

| `op` | `input` → `output` | Notes |
|---|---|---|
| `synonym` | surface word(s) → LETTERS | Needs `evidence`. Must not swallow an indefinite article (`"a cake"` → `CAKE` is rejected by the validator; `"the bed"` → `BED` is tolerated). |
| `abbreviate` | surface cue → LETTERS | Cue→letters must be in `src/data/abbreviations.ts`, or be a first-letter device. The cue must be a surface word. See `_abbreviations.md`. No `evidence` needed: the table is the evidence. |
| `literal` | surface word → same LETTERS | A piece read straight off the surface (e.g. `"me"` → `ME`). Also the legacy op for CD and DD (below). F-PRINTED flags a literal piece printed as part of the answer. |
| `anagram` | FODDER LETTERS → ANSWER | Letters must match exactly (R-FODDER-LETTERS). |
| `hidden` | carrier with the answer upper-cased, e.g. `"den<MARK ET>c"` → ANSWER | The carrier (`fodder`) must be in the clue and contain the answer. The op input itself is not checked, so keep every carrier letter in it. |
| `concat` | `"A+B+C"` → joined | Pieces must join, in order, to the output; **every** piece, single letters included, must be the output of an earlier op or a whole surface word. |
| `insert` | `"X in Y"` (also `into`/`inside`/`within`) or `"Y around X"` (also `about`/`outside`) → result | X must sit strictly inside Y. Use these keywords here even if the surface indicator is "holding" or "enters". |
| `reverse` | LETTERS → reversed | |
| `delete` | `"FODDER − X"` (minus sign U+2212, en dash or hyphen) → result | Removes one contiguous part (head, tail, a run) or both ends. FODDER is printed, or is the output of a `synonym` op on a clue word (synonym then precise deletion is allowed). |
| `homophone` | the sound-alike word → ANSWER | |
| `initials` | `"Make Every Nick Disappear"` → `MEND` | |
| `alternate` | `"bArBaRiAn"` (picked letters upper-cased) → `BRAIN` | |

## 4. `evidence` (new)

Every definition, every double-definition half, and every `synonym` op carries a dictionary
sense showing that the word really means the letters. This is exam step 5 (spec §3.5) and flag
F-DEF-EVIDENCE.

```json
"evidence": { "source": "wordnet", "sense": "earnest.n.01: something of value given by one person to another to bind a contract", "ref": "earnest.n.01" }
```

| Key | Required | Value |
|---|---|---|
| `source` | yes | One of `wordnet`, `wiktionary`, `collins`, `chambers`, `oed`, `auditor`. Prefer `wordnet` (checked automatically), then `wiktionary`. Use `collins`/`chambers` for British senses WordNet lacks (BEN = mountain). `auditor` means a human or auditor agent accepted it and recorded why in `sense`. |
| `sense` | yes | The gloss, quoted or closely paraphrased, prefixed with the sense id if there is one. It must be the sense the clue uses, not just any sense of the word. |
| `ref` | no | WordNet synset id, Wiktionary URL with anchor, or dictionary page. |

Rules:
- **Copy the real gloss from the source.** The sense lines in this chapter's examples show the
  shape; their synset ids and wording are illustrative. Never write an id you have not looked up.
- The sense must match the **part of speech** the clue uses. OCEAN defined as "at sea"
  (adverbial phrase for a noun) has no valid evidence (audit 02, §3.6).
- If the definition is an **example** of the answer (a hyponym: "Old banger" for CAR, "Rover"
  for CARPET), the clue needs `?`, `perhaps`, `maybe`, `say` or `for example`, and `sense` must
  say "hyponym, flagged by '…'". A definition that is a **hypernym** of the answer ("bird" for
  OWL) needs no flag, but it is generic and costs points on definition precision.
- `abbreviate`, `literal`, `anagram`, `hidden`, `reverse`, `delete`, `insert`, `concat`,
  `initials`, `alternate` and `homophone` ops take no `evidence`. A homophone's sound match is
  checked by the auditor (true in Southern British English).

## 5. `par` (now mandatory in the contract)

`par` is the Daily's target score: hints plus letters a capable improver would spend. The
rubric is `01-qualities.md` §9.2 (formerly `docs/clue-style.md` §7b); in brief:

`par = A + B + C + D + E`, clamped to 2–6.

| | Factor | Score |
|---|---|---|
| A | Answer length | 3–6 letters: 1 · 7–10: 2 · 11+: 3 |
| B | One hint | 1 |
| C | Layered wordplay: ≥ 2 real operations, any abbreviation, or a cryptic definition | 0/1 |
| D | Oblique definition | 0/1 |
| E | Misdirection or hard to see | 0/1 |

When writing, compute A, B and C yourself and give your honest estimate of D and E. The batch's
par pass (`node scripts/par-baseline.mjs` → three blind judges → `node scripts/par-apply.mjs`)
overwrites the value before shipping.

## 6. `pun` (new; cryptic-definition only)

```json
"pun": {
  "misleading": "A Londoner and a Leeds native disagree about what a drink is.",
  "true": "TEA is both a hot drink and, in the north of England, the evening meal."
}
```

Executable examples: `cd-tea`, `cd-denier`, `cd-cod`, `cd-candle` (pass) and `cd-map` (fails
R-CD-CONTRACT: no `pun`).

- Both keys are required non-empty strings, and they must describe **different** readings.
  An empty or missing `pun` fails R-CD-CONTRACT in code; two readings that say the same thing
  fail it at the evidence auditor.
- `misleading` is the scene the surface paints on first reading: who, what, where. It must not
  mention the answer.
- `true` says which word or words are read in which other sense, and how the whole clue then
  defines the answer.
- If you cannot write a `misleading` that differs from `true`, the clue is a plain definition
  with a `?` (F-QUIZ). Change device.
- `pun` is not used on `double-definition`, `lit` or any other device.

## 6a. `waivers` (optional)

Any rule may be waived for one clue with a written reason (owner's fairness instruction, case
law CL-044). A waived R-* hit stays visible in the report but no longer blocks (`isBlocking` in `src/data/clue-rules.ts`); an empty reason
does not waive. The exam's auditor reads every waiver and case law records it.

```json
"waivers": [
  { "rule": "R-HIDDEN-IND", "reason": "'<indicator>' is used as a hidden indicator by published setters (<citation>) but is in neither hidden.json nor the standard families" }
]
```

- One entry per rule. `rule` is the exact ID; `reason` cites a source or a case-law entry.
- Waive only a rule the code got wrong for this clue (a gap in a mined list, a published
  usage the rule does not know). Never waive to ship a clue you know is unfair.

## 7. Per-device operation templates

Each device file gives its template in full. Summary:

| Device | `indicator` | `fodder` | `operations` |
|---|---|---|---|
| hidden | the hidden indicator | carrier words exactly as printed | `[hidden]` |
| anagram | the anagram indicator | fodder words exactly as printed | `[anagram]` (plus `abbreviate`/`literal` ops first if the fodder includes an abbreviation) |
| charade | `""` | `"A + B"` | pieces (`synonym`/`abbreviate`/`literal`/…), then `concat` |
| container | the container indicator | `"X in Y"` | pieces, then `insert` |
| reversal | the reversal indicator | the word that is reversed | (`synonym` if not literal), then `reverse` |
| deletion | the deletion indicator | the longer word (printed, or the synonym's letters) | (`synonym` if not printed), then `delete` |
| homophone | the homophone indicator | the sound-alike word | (`synonym` if not literal), then `homophone` |
| double-definition | `""` | `"half one / half two"` | two `synonym` ops, one per half (§8) |
| cryptic-definition | `""` | `""` or the pun summary | `[literal]`, plus `pun` |
| initialism | the initials indicator | the consecutive words | `[initials]` |
| alternation | the alternation indicator | the literal fodder | `[alternate]` |
| lit | the device's indicator | the device's fodder | the device's ops |

## 8. Double definitions: the v2 form

Old clues use one op, `{"op":"literal","input":"two definitions","output":"BLIND"}`. That form
cannot carry evidence for each half. **New and rewritten** DDs use two `synonym` ops, the first
for the half in `def.text`:

```json
"def": { "text": "Not seeing", "position": "start",
         "evidence": { "source": "wordnet", "sense": "blind.a.01: unable to see" } },
"wordplay": {
  "indicator": "",
  "fodder": "Not seeing / window covering",
  "operations": [
    { "op": "synonym", "input": "Not seeing", "output": "BLIND",
      "evidence": { "source": "wordnet", "sense": "blind.a.01: unable to see" } },
    { "op": "synonym", "input": "window covering", "output": "BLIND",
      "evidence": { "source": "wordnet", "sense": "blind.n.03: a protective covering that keeps things out or hinders sight" } }
  ]
}
```

Existing entries in the legacy form stay valid until they are rewritten.

## 9. Teaching corpus (`src/data/clues.ts`)

Same content, authored as a `RawClue` in TypeScript: `id` (e.g. `"deletion-004"`), `solution`
instead of `answer`, an explicit `enumeration` string, no `par`. `evidence` and `pun` apply
there too. Hint rungs 1–3 are generated by `src/data/hydrate.ts` from `def`, `clueType`,
`indicator` and `fodder`; rung 4 is your `parse`.

## 10. Self-check before submitting

1. `npx tsx scripts/validate-clue.ts <file.json>` returns `ok: true` (it accepts one object or
   an array). Read its `warnings` (F-* flags) too: each needs a fix or a reason.
2. `npx tsx scripts/clue-flags.mjs <file.json>` (needs `npm run corpus:fetch`) shows no
   R-COPY (a near-verbatim copy of a published clue for the same answer; a shared
   construction or a similar wording is fine); read its F-CHESTNUT (informational) and
   F-DEF-EVIDENCE flags.
3. You have read the clue word by word and named the job of every word (F-IDLE is a flag:
   fix the word or record why it earns its place).
4. `evidence` is present on `def` and on every `synonym` op; `pun` on every CD.
5. The device file's "typical failures" list has been checked item by item.
