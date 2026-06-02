// Stage D "daily cryptic" mini-puzzle.
//
// A 5×5 lattice (across on rows 0/2/4, down on cols 0/2/4) whose grid was
// machine-verified to interlock with six distinct dictionary words:
//
//   A B O U T          1A ABOUT   1D AWARD
//   W · F · H          4A ACTOR   2D OFTEN
//   A C T O R          6A DANCE   3D THREE
//   R · E · E
//   D A N C E
//
// Every crossing letter is shared between an across and a down answer, so the
// grid is fully checked. Clues are authored and verified like the lesson corpus.

import { hydrateClue, type RawClue } from './hydrate';
import type { Direction, Puzzle, PuzzleEntry } from '../types';

interface RawEntry {
  raw: RawClue;
  number: number;
  direction: Direction;
  row: number;
  col: number;
}

const rawEntries: RawEntry[] = [
  {
    number: 1,
    direction: 'across',
    row: 0,
    col: 0,
    raw: {
      id: 'daily-001-1a',
      clueType: 'charade',
      difficulty: 2,
      clue: 'A fight, approximately (5)',
      solution: 'ABOUT',
      enumeration: '5',
      def: { text: 'approximately', position: 'end' },
      wordplay: {
        indicator: '',
        fodder: 'A + BOUT (fight)',
        operations: [
          { op: 'literal', input: 'A', output: 'A' },
          { op: 'synonym', input: 'fight', output: 'BOUT' },
          { op: 'concat', input: 'A+BOUT', output: 'ABOUT' },
        ],
      },
      parse: 'A + BOUT (a fight) = ABOUT, meaning approximately.',
    },
  },
  {
    number: 4,
    direction: 'across',
    row: 2,
    col: 0,
    raw: {
      id: 'daily-001-4a',
      clueType: 'charade',
      difficulty: 3,
      clue: 'Perform with gold as the star (5)',
      solution: 'ACTOR',
      enumeration: '5',
      def: { text: 'the star', position: 'end' },
      wordplay: {
        indicator: '',
        fodder: 'ACT (perform) + OR (gold)',
        operations: [
          { op: 'synonym', input: 'Perform', output: 'ACT' },
          { op: 'abbreviate', input: 'gold', output: 'OR' },
          { op: 'concat', input: 'ACT+OR', output: 'ACTOR' },
        ],
      },
      parse: 'ACT (perform) + OR (gold, in heraldry) = ACTOR, a star.',
    },
  },
  {
    number: 6,
    direction: 'across',
    row: 4,
    col: 0,
    raw: {
      id: 'daily-001-6a',
      clueType: 'anagram',
      difficulty: 2,
      clue: 'Caned, sadly, at the ball (5)',
      solution: 'DANCE',
      enumeration: '5',
      def: { text: 'the ball', position: 'end' },
      wordplay: {
        indicator: 'sadly',
        fodder: 'caned',
        operations: [{ op: 'anagram', input: 'CANED', output: 'DANCE' }],
      },
      parse: '(CANED)* = DANCE, a ball.',
    },
  },
  {
    number: 1,
    direction: 'down',
    row: 0,
    col: 0,
    raw: {
      id: 'daily-001-1d',
      clueType: 'charade',
      difficulty: 2,
      clue: 'A hospital section’s prize (5)',
      solution: 'AWARD',
      enumeration: '5',
      def: { text: 'prize', position: 'end' },
      wordplay: {
        indicator: '',
        fodder: 'A + WARD (hospital section)',
        operations: [
          { op: 'literal', input: 'A', output: 'A' },
          { op: 'synonym', input: 'hospital section', output: 'WARD' },
          { op: 'concat', input: 'A+WARD', output: 'AWARD' },
        ],
      },
      parse: 'A + WARD (hospital section) = AWARD, a prize.',
    },
  },
  {
    number: 2,
    direction: 'down',
    row: 0,
    col: 2,
    raw: {
      id: 'daily-001-2d',
      clueType: 'hidden',
      difficulty: 3,
      clue: 'Frequently shown in proof tender (5)',
      solution: 'OFTEN',
      enumeration: '5',
      def: { text: 'Frequently', position: 'start' },
      wordplay: {
        indicator: 'shown in',
        fodder: 'proof tender',
        operations: [{ op: 'hidden', input: 'proOF TENder', output: 'OFTEN' }],
      },
      parse: 'Hidden in “proOF TENder” → OFTEN, meaning frequently.',
    },
  },
  {
    number: 3,
    direction: 'down',
    row: 0,
    col: 4,
    raw: {
      id: 'daily-001-3d',
      clueType: 'anagram',
      difficulty: 3,
      clue: 'Ether mixed to make a number (5)',
      solution: 'THREE',
      enumeration: '5',
      def: { text: 'a number', position: 'end' },
      wordplay: {
        indicator: 'mixed',
        fodder: 'ether',
        operations: [{ op: 'anagram', input: 'ETHER', output: 'THREE' }],
      },
      parse: '(ETHER)* = THREE, a number.',
    },
  },
];

const entries: PuzzleEntry[] = rawEntries.map((e) => ({
  ...hydrateClue(e.raw),
  number: e.number,
  direction: e.direction,
  row: e.row,
  col: e.col,
}));

export const PUZZLES: Puzzle[] = [
  {
    id: 'daily-001',
    title: 'Daily Cryptic №1',
    stage: 'D',
    rows: 5,
    cols: 5,
    blurb:
      'A real little cryptic — every device you have learned, no hints surfaced. Solve it, then reveal any parse to check your reasoning.',
    entries,
  },
];

export function getPuzzle(id: string): Puzzle | undefined {
  return PUZZLES.find((p) => p.id === id);
}
