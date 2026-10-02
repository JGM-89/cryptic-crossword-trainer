# Double definition

*Clue Bible, chapter 02. Rule IDs are defined in `03-rules-and-flags.md`; the JSON contract is
`_json-contract.md`. Rule-ID note (2026-10-02): rule names follow `src/data/clue-rules.ts`
and `scripts/clue-flags.mjs`. Idle words are **F-IDLE** (the design spec's R-IDLE, demoted to a
flag by the owner's fairness decision); F-UNATTESTED was tried and rejected as an automatic
check, so invented phrases are judged in the exam (DECOY, TOURNAMENT-SURFACE). Status: v1.*

## 1. What it is and the fair form

The clue is two definitions of the same answer, side by side, with no other wordplay: *Not
seeing / window covering* = BLIND.

**Fair form:** `definition 1` + `definition 2`, abutting, no indicator.

- **Two genuine, distinct senses.** Each half is a dictionary sense of the answer
  (F-DEF-EVIDENCE, one `evidence` per half), and the two senses are different: different
  dictionary entries or sense numbers, ideally different parts of speech or different roots.
  Two halves that describe the same thing (the lime fruit and the lime tree) are one definition
  said twice.
- **Each half is a definition, not a description.** "the last of it breaking the camel's back"
  is a paraphrase of a proverb, not a sense of STRAW.
- **The halves abut.** No indicator and, by default, no link. A single joining word is allowed
  only if it reads as an equation in the cryptic reading: *is*, *and*, *or*, *'s* (is/has). Any
  other joining word ("kept in a", "beside the", "that's … and old") is padding (F-IDLE).
- **A "?" only when earned**: when one half is a definition by example (PEN "Swan's quill?") or
  the surface leans on a pun (PIANO "Quietly grand?"). Not as decoration.
- **The surface must not be a plain definition of the answer.** If the whole clue, read
  literally, already describes the answer ("Gentle type of ale" = MILD), the misdirection is
  gone (F-QUIZ).

Wikipedia notes that American cryptics require the two parts to come from different roots,
while British puzzles allow similar ones. Cruci takes the stricter line for senses (they must
differ) but does not require different etymologies.

## 2. JSON the validator expects (v2 form)

```json
{
  "answer": "PIANO",
  "clueType": "double-definition",
  "clue": "Quietly grand? (5)",
  "def": { "text": "Quietly", "position": "start",
           "evidence": { "source": "wiktionary", "sense": "piano (adverb, music): softly, quietly" } },
  "wordplay": {
    "indicator": "",
    "fodder": "Quietly / grand",
    "operations": [
      { "op": "synonym", "input": "Quietly", "output": "PIANO",
        "evidence": { "source": "wiktionary", "sense": "piano (adverb, music): softly, quietly" } },
      { "op": "synonym", "input": "grand", "output": "PIANO",
        "evidence": { "source": "wordnet", "sense": "grand piano: a piano with the strings on a horizontal harp-shaped frame (hyponym, flagged by '?')" } }
    ]
  }
}
```

- `def.text` = one half, at its end of the clue.
- `fodder` = `"half one / half two"`.
- One `synonym` op per half, each with `evidence`. Existing bank entries use the legacy single
  `literal` op (`"input":"two definitions"`); rewrite them to this form when they are next
  touched (`_json-contract.md` §8).
- **[validator]** checks only that the final op outputs the answer. Whether both halves really
  mean the answer is checked by EVIDENCE and the auditor.
- **F-IDLE by hand.** `surface-rules.ts` exempts whole-clue devices (DD, CD, &lit) from the
  orphan check, so padding between DD halves is **not** machine-caught. Read every joining word.

## 3. Indicators

None. A double definition has no indicator and `indicator` is `""`.

Direction words are irrelevant here, but the halves must not contain words that look like
indicators for another device unless the surface needs them ("Back the flawed article":
"Back" is a definition, not a reversal indicator; this misdirection is fair because the parse
is unique).

## 4. Surface craft

1. **Pick senses from different worlds.** The best DDs pair senses whose contexts clash, so the
   surface reads as one scene and the solver must split it: SECOND *Back the flawed article*
   (betting, then a shop's seconds); EARNEST *Serious money down?* (a mood, then a deposit).
2. **Fuse the halves into one phrase.** FLAT *A level apartment* reads as one noun phrase; the
   solver has to lift "A level" (as in exam) away from "apartment". This is lift-and-separate
   applied to a DD ([Crossword Unclued](https://www.crosswordunclued.com/2010/12/lift-and-separate.html)).
3. **Make the second sense the surprise.** PIANO's "grand" first reads as an adjective
   (*impressive*), then as the instrument.
4. **Keep it short.** Two definitions and nothing else are usually 2–5 words. Every extra word
   must be part of one of the definitions.

Published example (one, attributed): *"Confiscate jam (5)"*, SEIZE, Guardian Quick Cryptic 119
([Fifteensquared](https://fifteensquared.net/2026/07/11/guardian-quick-cryptic-119-by-garson/)):
two words, two senses (take; jam as a machine does).

## 5. Typical failures

| Failure | Bank example | Rule |
|---|---|---|
| The two halves are the same sense | LIME "Citrus tree?" (the citrus fruit and its tree) | **F-DEF-EVIDENCE** (the two sense lines must differ) |
| A half is a description, not a definition | STRAW "What you sip through, **the last of it breaking the camel's back**"; SHOULDER "…where a soldier rests his rifle" | **F-DEF-EVIDENCE** |
| A half is wrong | EAR "…grows on a cob" (the cob is the core of the ear); PADDLE "…for an oar" (a paddle is not an oar) | **F-DEF-EVIDENCE** |
| Padding between the halves | PEN "Writer **kept in a** sheep enclosure"; STAR "Asterisk **beside the** leading actor"; WIND "Coil **tightened in the** gale"; SAGE "Herb **that's** wise **and old**"; SWAN "…**like a** bird **on the lake**" | **F-IDLE** (by hand) |
| The surface, read literally, already describes the answer | MILD "Gentle type of ale" (a mild is a gentle ale, so there is nothing to split) | **F-QUIZ** |
| Definition by example without a flag | CLIFF "Richard's sheer face?" depends on the "?" for Cliff Richard; acceptable only with it | F-DEF-EVIDENCE |
| Same pairing used twice | HAMPER "Picnic basket can be a hindrance" and BASKET "Hamper a slam dunk?" | **B-REPEAT**; **F-TEMPLATE** |
| Surface identical to a published clue for the same answer | TRACK "Follow the railway line" (matches a published Guardian clue) | **R-COPY** (`scripts/clue-flags.mjs`) |
| American usage | BASKET "slam dunk" | **F-AMERICANISM** |
| Too many DDs in a batch | — | **B-DEVICE-MIX** |

## 6. Exemplars from our bank

**Best**
- **PIANO** — *Quietly grand? (5)*. *Piano* = quietly (music); a grand is a piano. Both
  meanings fit "grand"; the "?" is earned. Audit 4/5, top tier.
- **EARNEST** — *Serious money down? (7)*. Serious; earnest money is a deposit. Audit 4/4.
- **SECOND** — *Back the flawed article (6)*. To second = to back; a second is a flawed
  article. Audit 4/4.

**Weak**
- **LIME** — *Citrus tree? (4)*. The citrus fruit is the fruit of the lime tree, so the halves
  overlap; the "?" does no work. F-DEF-EVIDENCE, F-QUIZ. The audit's direction: change device
  (*Fruit in a bowl I mended*, a hidden).

## 7. Cruci-specific notes

- **Capped.** Cryptic definitions plus double definitions may be **at most 25% of any batch**
  (B-DEVICE-MIX, enforced in `src/data/clue-rules.ts` for batches of 4+), and every batch of 8+
  spans at least 4 devices.
- **Over-supplied.** DDs are 18% of the bank against 5–10% in a broadsheet. Until the share
  falls to about 10% (audit 02 §7), add new DDs only as rewrites of existing DDs, or where an
  answer has no workable alternative.
- **Learners learn little from a weak DD.** A DD teaches parsing only when the senses clash;
  a pair of near-synonyms teaches nothing.
- **Teaching register (Stage A).** Two everyday senses, abutting, no link: *Just a carnival*
  (FAIR), *Severe part of a ship* (STERN: "part of" is acceptable here because "part of a ship"
  is the second definition).
- **Par.** No layered wordplay (C = 0). The definition is often oblique (D = 1).

## Sources

- Wikipedia, *Cryptic crossword*, "Double definition": https://en.wikipedia.org/wiki/Cryptic_crossword
- Crossword Unclued, *Lift and separate*: https://www.crosswordunclued.com/2010/12/lift-and-separate.html
- Guardian Quick Cryptic 119 by Garson (Fifteensquared): https://fifteensquared.net/2026/07/11/guardian-quick-cryptic-119-by-garson/
- Audit 02 §2, §3.5, §7: `docs/audit/2026-10-02/02-clue-sample.md`
- Code: `src/data/surface-rules.ts` (`WHOLE_CLUE_DEVICES` exemption), `src/data/clue-rules.ts` (`batchHits`)
