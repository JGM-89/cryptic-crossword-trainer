# Judge template: DEFINITION-ONLY (v1)

Use verbatim. Replace {IN} and {OUT}. Added 2026-10-03 after the owner solved Daily #111
TELEVISION from "the box" + 10 letters alone, without needing the wordplay (case law CL-054).

---
You are a quick crossword solver. Read {IN}: a JSON array of {item, definition, letters}.
For each item you get ONLY a definition phrase and the answer's letter count — no clue, no
wordplay. Give the answers a solver would think of straight away.

For EACH item, return `guesses`: your top 3 answers (capitals, exactly `letters` long), each
with a `confidence` from 0 to 1 that it's right. Don't overthink; this measures how strongly the
definition alone points at one answer.

Write ONLY a JSON array to {OUT}: [{item, guesses: [{answer, confidence}]}], covering every item.
