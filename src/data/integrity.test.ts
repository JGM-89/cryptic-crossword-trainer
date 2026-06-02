import { describe, expect, it } from 'vitest';
import { CLUES } from './corpus';
import { PUZZLES } from './puzzles';
import { validateAll, validateClue } from './integrity';
import { CLUE_TYPE_ORDER } from '../types';

describe('clue corpus integrity', () => {
  it('every teaching clue passes the fairness checks', () => {
    const errors = validateAll(CLUES);
    expect(errors).toEqual({});
  });

  it('every puzzle entry passes the fairness checks', () => {
    for (const puzzle of PUZZLES) {
      const errors = validateAll(puzzle.entries);
      expect(errors).toEqual({});
    }
  });

  it('covers every clue type', () => {
    for (const type of CLUE_TYPE_ORDER) {
      expect(CLUES.some((c) => c.clueType === type)).toBe(true);
    }
  });

  it('has at least 30 teaching clues', () => {
    expect(CLUES.length).toBeGreaterThanOrEqual(30);
  });
});

describe('validateClue catches broken clues', () => {
  const good = CLUES[0];

  it('flags an enumeration that does not match the solution', () => {
    const errors = validateClue({ ...good, enumeration: '99' });
    expect(errors.join(' ')).toMatch(/enumeration/);
  });

  it('flags an indirect anagram (fodder absent from the surface)', () => {
    const anagram = CLUES.find((c) => c.clueType === 'anagram')!;
    const broken = {
      ...anagram,
      clue: 'Totally unrelated surface (7)',
      definitionSpan: { text: 'surface', start: 18, end: 25, position: 'end' as const },
    };
    const errors = validateClue(broken);
    expect(errors.join(' ')).toMatch(/indirect anagram|literally present/);
  });
});
