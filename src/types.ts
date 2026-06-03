// Domain types for the cryptic crossword trainer.
// The clue schema is a single-entry-oriented superset of the Guardian/ipuz shape
// plus the teaching metadata that drives the scaffolding overlay.

/** The nine clue devices taught, in curriculum order. */
export type ClueType =
  | 'hidden'
  | 'anagram'
  | 'charade'
  | 'container'
  | 'reversal'
  | 'deletion'
  | 'homophone'
  | 'double-definition'
  | 'cryptic-definition'
  // Advanced devices — used in the Play archive, not the (beginner) curriculum.
  | 'initialism'
  | 'alternation'
  | 'lit';

export const CLUE_TYPE_ORDER: ClueType[] = [
  'hidden',
  'anagram',
  'charade',
  'container',
  'reversal',
  'deletion',
  'homophone',
  'double-definition',
  'cryptic-definition',
];

export const CLUE_TYPE_LABELS: Record<ClueType, string> = {
  hidden: 'Hidden word',
  anagram: 'Anagram',
  charade: 'Charade',
  container: 'Container',
  reversal: 'Reversal',
  deletion: 'Deletion',
  homophone: 'Homophone',
  'double-definition': 'Double definition',
  'cryptic-definition': 'Cryptic definition',
  initialism: 'Initial letters',
  alternation: 'Alternate letters',
  lit: '&lit (all-in-one)',
};

/** A single wordplay operation in the parse (anagram of SENATOR -> TREASON, etc.). */
export interface WordplayOp {
  op:
    | 'anagram'
    | 'hidden'
    | 'concat'
    | 'insert'
    | 'reverse'
    | 'delete'
    | 'homophone'
    | 'synonym'
    | 'abbreviate'
    | 'literal'
    | 'initials'
    | 'alternate';
  input: string;
  output: string;
  note?: string;
}

export interface Wordplay {
  /** The indicator word(s), if the device uses one. Empty for charades/double-defs. */
  indicator: string;
  /** The raw letters/words the device operates on (the "fodder"). */
  fodder: string;
  operations: WordplayOp[];
}

/** Which contiguous span of the clue is the definition. */
export interface DefinitionSpan {
  text: string;
  /** Character offset (inclusive) into the clue string. */
  start: number;
  /** Character offset (exclusive) into the clue string. */
  end: number;
  position: 'start' | 'end';
}

export interface Hint {
  tier: 1 | 2 | 3 | 4;
  label: string;
  text: string;
}

export interface Clue {
  id: string;
  clueType: ClueType;
  /** 1 (easiest) – 5 (hardest), computed from the §3 rubric. */
  difficulty: 1 | 2 | 3 | 4 | 5;
  clue: string;
  solution: string;
  /** e.g. "7" or "3,4" — must match the solution's letters/word-breaks. */
  enumeration: string;
  definitionSpan: DefinitionSpan;
  wordplay: Wordplay;
  /** The four-rung hint ladder. Always exactly four tiers. */
  hints: [Hint, Hint, Hint, Hint];
}

/** A lesson teaches one clue type (Stage A/B) or mixes them (Stage C/D). */
export interface Lesson {
  id: string;
  title: string;
  /** The primary device taught. 'mixed' for Stage C/D lessons. */
  clueType: ClueType | 'mixed';
  blurb: string;
  clueIds: string[];
}

export type Stage = 'A' | 'B' | 'C' | 'D';

export const STAGE_LABELS: Record<Stage, string> = {
  A: 'Taught',
  B: 'Guided',
  C: 'Coached',
  D: 'Independent',
};

export const STAGE_BLURBS: Record<Stage, string> = {
  A: 'One device at a time. The definition is highlighted and the device is named for you.',
  B: 'Devices mixed in a small set. The definition is hidden, but the first hint is one tap away.',
  C: 'Full mixed practice. Hints appear only when you ask, or after a wrong answer.',
  D: 'A plain cryptic. No hints by default — the parse is revealed only after you solve.',
};

export interface CurriculumStage {
  stage: Stage;
  title: string;
  lessons: Lesson[];
}

export interface Curriculum {
  stages: CurriculumStage[];
}

// ─────────────────────────── Grid puzzles (Stage C/D) ───────────────────────────

export type Direction = 'across' | 'down';

/** A clue placed in a grid: all the teaching fields plus a position. */
export interface PuzzleEntry extends Clue {
  number: number;
  direction: Direction;
  /** Zero-based start cell of the entry. */
  row: number;
  col: number;
}

export interface Puzzle {
  id: string;
  title: string;
  stage: Stage;
  rows: number;
  cols: number;
  blurb: string;
  entries: PuzzleEntry[];
}

/** A solved grid cell, derived from the puzzle entries. */
export interface GridCell {
  row: number;
  col: number;
  solution: string;
  /** The clue number shown in the corner, if an entry starts here. */
  number?: number;
}
