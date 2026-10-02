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

Chapters cite examples by `id` (e.g. "see `anagram-good-1`") instead of pasting JSON.
"Pass" means the example passes the mechanical gate: integrity + surface gate + every
blocking rule. It does not mean the clue is great; quality claims live in the chapter text.
