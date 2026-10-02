# Abbreviations: the only ones allowed

*Clue Bible, chapter 02 (devices), shared file. It replaces `docs/clue-style.md` §4. Status:
v1, 2026-10-02.*

The source of truth is **`src/data/abbreviations.ts`** (the `ABBR` table). This page mirrors it
so that agents can read it next to the device files. If this page and the code ever disagree,
**the code wins**, and this page is out of date. Do not add entries here or in the code. If a
genuinely standard abbreviation is missing, flag it for the owner with a source (Chambers,
Collins, or a published-clue citation); do not use it in the meantime.

## 1. The rules

1. **Table or first-letter device, nothing else.** A piece that turns a cue word into letters
   is fair only if (a) the cue→letters pair is in `ABBR`, or (b) it is an explicit first-letter
   device ("boy primarily" → B). Write it as an `abbreviate` op:
   `{"op":"abbreviate","input":"daughter","output":"D"}`.
2. **The cue must be a word in the surface.** No indirect abbreviation. "Girl" → DAUGHTER → D
   is a synonym of a synonym and is rejected. The validator checks that the cue's letters
   occur in the clue; write the cue as the whole surface word.
3. **Lookup normalisation.** The validator lower-cases the cue and tries three keys: the cue
   itself, the cue minus a trailing `'s`/`’s`, and the cue minus a trailing `s`. So
   "daughter's" → `daughter` → D is accepted, and "points" → `point` → N/S/E/W is accepted.
   Nothing else is normalised: "Daughters'" or "learner-driver" will not match.
4. **The output must be one of the listed strings exactly.** `queen` gives Q, ER, HM or R; it
   never gives QU.
5. **First-letter devices** produce exactly **one** letter. The cue must contain one of these
   words (the validator's `INITIAL_RE`): *primarily, initially, firstly, first, head, heads,
   heading, leading, leader, start, starts, starting, top, opening, foremost, front, begin,
   begins, beginning*, plus another word starting with the output letter. Example:
   `{"op":"abbreviate","input":"boy primarily","output":"B"}`. "Leaders" (plural) is **not** in
   the pattern. For more than one first letter, use the `initialism` device instead
   (`initialism.md`).
6. **An abbreviation is not an indicator.** Several cues double as indicators ("about" is
   C/CA/RE and also a container and a reversal indicator; "over" is O and also a reversal
   indicator; "doctor" is DR/MO/MB and also an anagram indicator). Only use one where the parse
   is unique. Run the placeholder test (`01-qualities.md` §1) with each reading.
7. **Anagram fodder may include a listed abbreviation** only if the abbreviation's letters are
   then part of the fodder in the op chain (a subtractive or compound anagram). Pure anagram
   clues must have literal fodder (R-FODDER-LETTERS); see `anagram.md`.
8. **Abbreviations count towards par.** Any `abbreviate` op sets par factor C = 1
   (`01-qualities.md` §9.2), and the hint ladder explains it ("Crossword shorthand worth
   learning…", `src/data/hydrate.ts`).

## 2. The table (mirror of `ABBR`, 2026-10-02)

Keys are the cue as it appears (lower-cased). Values are the letter strings the cue may give.

### Compass and direction
| Cue | Letters |
|---|---|
| north / northern | N |
| south / southern | S |
| east / eastern | E |
| west / western | W |
| point | N, S, E, W |

### People, titles, roles
| Cue | Letters |
|---|---|
| bachelor | B, BA |
| wife | W |
| woman / women | W |
| man | M |
| husband | H |
| daughter | D |
| son | S |
| child | C |
| king | K, R |
| queen | Q, ER, HM, R |
| prince | P |
| saint | ST, S |
| pope | P |
| bishop | B |
| knight | N |
| doctor | DR, MO, MB |
| learner / student / pupil | L |
| sailor | AB, TAR, RN |
| soldier | GI, OR |
| engineer | RE |
| nurse | RN, SEN |
| graduate | BA, MA |
| fellow | F |

### Cricket
| Cue | Letters |
|---|---|
| run / runs | R |
| caught | C |
| bowled | B |
| over | O |
| maiden | M |
| wicket | W |
| duck | O |
| leg before | LBW |

### Music and sound
| Cue | Letters |
|---|---|
| quiet / soft | P |
| loud | F |
| very loud | FF |
| note | A, B, C, D, E, F, G |
| key | B |

### Science and units
| Cue | Letters |
|---|---|
| energy | E |
| oxygen | O |
| hydrogen | H |
| carbon | C |
| gold | OR, AU |
| silver | AG |
| copper | CU |
| iron | FE |
| current | I, AC, DC |
| resistance | R |
| force | F |
| power | P, W |
| unknown | X, Y, Z |

### Numbers
| Cue | Letters |
|---|---|
| one | I, A |
| five | V |
| ten | X |
| fifty | L |
| hundred | C |
| five hundred | D |
| thousand | M, K |
| million | M |
| nothing / love / nil / zero / ring | O |

### Cards and colours
| Cue | Letters |
|---|---|
| hearts / heart | H |
| spades | S |
| clubs | C |
| diamonds | D |
| black | B |
| white | W |
| red | R |

### Politics
| Cue | Letters |
|---|---|
| conservative | C |
| labour | LAB |
| liberal | L |
| republican | R |
| democrat | D |
| left | L |
| right | R |

### Places and institutions
| Cue | Letters |
|---|---|
| company / firm | CO |
| church | CH, CE, RC |
| street | ST |
| road | RD |
| avenue | AVE |
| america | US, USA |
| american | US |
| britain | GB, UK |
| british | B, BR |
| island | I |
| river | R |
| lake | L |

### Time
| Cue | Letters |
|---|---|
| time | T |
| second | S |
| hour | H |
| day | D |
| year | Y |

### Size, quality, miscellaneous
| Cue | Letters |
|---|---|
| small | S |
| large | L |
| hot | H |
| cold | C |
| hard | H |
| new | N |
| old | O |
| good | G |
| number | N, NO |
| line | L |
| page | P |
| area | A |
| degree | D |
| about | C, CA, RE |
| circa | C |
| book | B, NT, OT |
| vitamin | A, B, C, D, E, K |

### Foreign articles
| Cue | Letters |
|---|---|
| the french | LE, LA, LES |
| the spanish | EL, LA |
| the german | DER, DIE, DAS |
| the italian | IL, LA |

## 3. House guidance on listed entries

These entries are in the table, so the validator accepts them, but the audit or current
practice says to use them with care. This guidance changes nothing in the code.

| Entry | Guidance | Source |
|---|---|---|
| man → M | Weak and rarely seen in broadsheets. The audit marked MONARCH ("man on arch") unsound partly because of it. Prefer another construction. | audit 02 §2 #27 |
| queen → ER | Dated as a present-tense cue since 2022 ("Mind the Queen" for TEND+ER). Do not write a surface in which "the Queen" is the reigning monarch. If no other surface works, rebuild without ER; king → K/R is current. | audit 02 §3.8 |
| queen → R, king → R | Both fine; R for *rex/regina*. | standard |
| key → B | Unusual (one key among seven). Prefer note → A–G, which solvers know. | house |
| about → C/CA/RE, over → O, ring → O, round (not listed) | Ambiguous with indicators; see rule 6. | house |
| the french / the spanish / … | The cue must be the whole phrase in the surface ("the French"). | `abbreviations.ts` keys |
| america → US/USA, american → US | Fine as abbreviations. They do not license American spelling or usage in the surface (F-AMERICANISM). | house |
| sailor → TAR | TAR is a word, not an abbreviation; treat it as a synonym piece if you prefer, but the table accepts it either way. | `abbreviations.ts` |

## 4. Teaching register

Stage-A teaching clues (`src/data/clues.ts`) use only the most familiar cues: compass points,
one → I, nothing/love → O, learner → L, quiet → P, loud → F, king → K/R, saint → ST,
church → CH/CE, company → CO, energy → E, about → RE, the Roman numerals. One abbreviation per
teaching clue at most. The hint ladder explains each one inline; `src/data/hydrate.ts`
(`ABBR_WHY`) holds the short reasons it uses.
