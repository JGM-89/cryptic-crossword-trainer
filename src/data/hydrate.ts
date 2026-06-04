// Authoring format + hydration.
//
// Clues are authored as `RawClue` objects that omit the error-prone computed
// fields (definition-span character offsets) and the formulaic hint tiers 1–3.
// `hydrateClue` derives those, producing a fully-formed `Clue`. This keeps the
// corpus terse and correct: offsets are computed by locating the definition
// text in the clue, and the first three hint rungs are generated consistently
// from the structured parse. Only the tier-4 full parse is authored by hand.
//
// The shape of the emitted `Clue` is the JSON schema from the brief; this file
// is simply a convenience layer over it.

import {
  CLUE_TYPE_LABELS,
  type Clue,
  type ClueType,
  type DefinitionSpan,
  type Hint,
  type Wordplay,
} from '../types';

export interface RawClue {
  id: string;
  clueType: ClueType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  clue: string;
  solution: string;
  enumeration: string;
  /** Authoring shorthand for the definition: just the text and which end. */
  def: { text: string; position: 'start' | 'end' };
  wordplay: Wordplay;
  /** The tier-4 full parse, e.g. "(SENATOR)* = TREASON, a crime." */
  parse: string;
  /** Optional overrides for the auto-generated tier 1–3 hint text. */
  hintOverrides?: Partial<Record<1 | 2 | 3, string>>;
}

const DEVICE_DESCRIPTIONS: Record<ClueType, string> = {
  hidden: 'The answer is concealed in consecutive letters of the clue.',
  anagram: 'The answer is the letters of the fodder rearranged.',
  charade: 'The answer is built by joining shorter pieces end to end.',
  container: 'One piece is placed inside another.',
  reversal: 'The letters of a word are read backwards.',
  deletion: 'A letter or letters are removed from a word.',
  homophone: 'The answer sounds like another word.',
  'double-definition': 'The clue gives two definitions of the same answer and no other wordplay.',
  'cryptic-definition': 'The whole clue is one punning definition — there is no separate wordplay.',
  initialism: 'The answer is spelled out by the initial letters of consecutive words.',
  alternation: 'The answer is made of the alternate (every other) letters of the fodder.',
  lit: 'The entire clue is both the definition and the wordplay at once (&lit).',
};

function locateDefinition(clue: string, def: { text: string; position: 'start' | 'end' }): DefinitionSpan {
  const idx = def.position === 'start' ? clue.indexOf(def.text) : clue.lastIndexOf(def.text);
  if (idx === -1) {
    throw new Error(`Definition "${def.text}" not found in clue "${clue}"`);
  }
  return { text: def.text, start: idx, end: idx + def.text.length, position: def.position };
}

// Unambiguous definition-by-example flags. These words, sitting beside the
// definition, signal that the definition is an EXAMPLE of the answer (e.g.
// "Sage, perhaps" → HERB) rather than a synonym — a fairness requirement the
// solver should be told about, since otherwise the marker looks like a stray
// word. ("say"/"?" are deliberately excluded: they double as homophone /
// cryptic-definition markers and would mis-fire.)
const DEF_EXAMPLE_MARKER = /\b(perhaps|maybe|possibly|for example|e\.g\.)\b/i;

/** A note for the Definition rung when the definition is by example. */
function defExampleNote(clue: string, span: DefinitionSpan): string {
  const body = clue.replace(/\s*\([^)]*\)\s*$/, '');
  // Look only in a window beside the definition, so a marker belonging to the
  // wordplay elsewhere in the clue doesn't trigger a misleading note.
  const near = body.slice(Math.max(0, span.start - 16), Math.min(body.length, span.end + 16));
  const m = near.match(DEF_EXAMPLE_MARKER);
  if (!m) return '';
  return ` The word “${m[1].toLowerCase()}” flags this as definition by example — the definition names just one example of the answer’s category, not an exact synonym.`;
}

function tier3Text(clueType: ClueType, wp: Wordplay): string {
  const ind = wp.indicator ? `"${wp.indicator}"` : 'no explicit indicator, but';
  switch (clueType) {
    case 'hidden':
      return `${ind} tells you the answer is hidden inside "${wp.fodder}".`;
    case 'anagram':
      return `${ind} tells you to rearrange the letters of "${wp.fodder}".`;
    case 'charade':
      return `Charades have no indicator word — just join the pieces: ${wp.fodder}.`;
    case 'container':
      return `${ind} tells you to put one piece inside another: ${wp.fodder}.`;
    case 'reversal':
      return `${ind} tells you to reverse "${wp.fodder}".`;
    case 'deletion':
      return `${ind} tells you to drop letters from "${wp.fodder}".`;
    case 'homophone':
      return `${ind} tells you the answer sounds like "${wp.fodder}".`;
    case 'double-definition':
      return 'Both halves of the clue point at the same answer — look for a second meaning.';
    case 'cryptic-definition':
      return 'Read the clue as a whole and look for the pun or double meaning.';
    case 'initialism':
      return `Take the first letter of each word in “${wp.fodder}”.`;
    case 'alternation':
      return `Take alternate letters of “${wp.fodder}”.`;
    case 'lit':
      return 'The whole clue works twice over — as a definition and as wordplay.';
  }
}

export function hydrateClue(raw: RawClue): Clue {
  const definitionSpan = locateDefinition(raw.clue, raw.def);

  const hint1: Hint = {
    tier: 1,
    label: 'Definition',
    text:
      raw.hintOverrides?.[1] ??
      `The definition is at the ${raw.def.position === 'start' ? 'START' : 'END'}: “${raw.def.text}”.${defExampleNote(raw.clue, definitionSpan)}`,
  };
  const hint2: Hint = {
    tier: 2,
    label: 'Clue type',
    text:
      raw.hintOverrides?.[2] ??
      `This is a ${CLUE_TYPE_LABELS[raw.clueType].toUpperCase()}. ${DEVICE_DESCRIPTIONS[raw.clueType]}`,
  };
  const hint3: Hint = {
    tier: 3,
    label: 'Indicator & fodder',
    text: raw.hintOverrides?.[3] ?? tier3Text(raw.clueType, raw.wordplay),
  };
  const hint4: Hint = { tier: 4, label: 'Full parse', text: raw.parse };

  return {
    id: raw.id,
    clueType: raw.clueType,
    difficulty: raw.difficulty,
    clue: raw.clue,
    solution: raw.solution,
    enumeration: raw.enumeration,
    definitionSpan,
    wordplay: raw.wordplay,
    hints: [hint1, hint2, hint3, hint4],
  };
}
