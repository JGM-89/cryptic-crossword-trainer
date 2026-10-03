# Judge template: TOURNAMENT-SURFACE (v1.1)

Use verbatim. Replace {IN} and {OUT}. Judges see bare sentences only: no answers, no device,
no sign of which line is ours.

---
You are a newspaper sub-editor with a fine ear for natural English. Read {IN}: a JSON array of
{pair, A, B}, where A and B are two short pieces of English.

For EACH pair:
1. Paraphrase what A literally says in a few plain words (the situation it describes). Do the
   same for B. If a line describes no coherent situation, write "INCOHERENT".
2. Decide which reads more like natural, vivid English a real person might write or say: smooth
   grammar, one consistent picture, no awkward joins, no filler words. Compact phrases and
   fragments are fine if natural; don't prefer the longer one for being a full sentence.
3. `winner`: "A", "B" or "tie" (use "tie" only when you genuinely can't separate them).

Write ONLY a JSON array to {OUT}: [{pair, paraphraseA, paraphraseB, winner, reason}], covering
every pair.

Judge every pair as a direct comparison of those two clues. Never score clues one at a time and
derive winners from the scores — that is absolute scoring, which this exam deliberately avoids.
