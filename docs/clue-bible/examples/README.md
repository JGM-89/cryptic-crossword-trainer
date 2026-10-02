# Executable examples

Every worked example in the Clue Bible lives here as data and is checked in CI by
`src/data/bible-examples.test.ts`, so the Bible can never again teach a clue that the
validator contradicts (case law: the old style guide's CHAIR = CHAR+A and UNDERMINED examples).

One file per device (`<device>.json`), each an array of:

```json
{
  "id": "anagram-good-1",
  "verdict": "pass",                 // "pass" | "fail"
  "failsWith": "R-FODDER-LETTERS",   // fail only: regex matched against the error/rule text
  "why": "one line: what this example teaches",
  "entry": { "answer": "...", "clueType": "...", "difficulty": 2, "par": 2, "clue": "...",
             "def": {"text": "...", "position": "start"},
             "wordplay": {"indicator": "...", "fodder": "...", "operations": [...]},
             "parse": "..." }
}
```

Chapters cite examples by `id` (e.g. "see `anagram-ascertain`") instead of pasting JSON.
"Pass" means the example passes the mechanical gate: integrity + surface gate + every
blocking rule. It does not mean the clue is great; quality claims live in the chapter text.
A pass example may still raise flags (F-IDLE, F-PRINTED); its `why` says so.

Conventions:
- **ids** are `<device>-<answer>` (`dd-` and `cd-` for double and cryptic definitions), with a
  suffix for variants (`container-chair-1`, `hidden-undermined-old`). Ids never change once cited.
- **fail** examples only for clues the machinery really rejects; `failsWith` is a regex for the
  exact error or rule ID. A bad clue that the machinery accepts (its fault is a flag or a
  judgement) is **not** an example: the chapter keeps it in prose as a *judgement example*.
- **Source**: shipped bank clues are copied as shipped (plus `evidence`/`pun` where the chapter
  template needs them); teaching-corpus clues are converted to the BankEntry shape with a `par`
  estimated by the rubric (`01-qualities.md` §9.2); synthetic regressions say so in `parse`.
- Never weaken the validator or the test to make an example pass: fix the example, or drop it
  with a note in the chapter.
