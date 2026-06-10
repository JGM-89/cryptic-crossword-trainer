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

  it('flags an unrecognised abbreviation (old → B)', () => {
    const charade = CLUES.find((c) => c.clueType === 'charade') ?? good;
    const broken = {
      ...charade,
      wordplay: {
        ...charade.wordplay,
        operations: [
          ...charade.wordplay.operations,
          { op: 'abbreviate' as const, input: 'old', output: 'B' },
        ],
      },
    };
    const errors = validateClue(broken);
    expect(errors.join(' ')).toMatch(/unrecognised abbreviation/);
  });

  it('flags a charade whose concat pieces do not compose to the solution', () => {
    const broken = {
      ...good,
      clueType: 'charade' as const,
      solution: 'PANCAKE',
      enumeration: '7',
      wordplay: {
        indicator: '',
        fodder: 'PAN + CAKE',
        operations: [
          { op: 'synonym' as const, input: 'pan', output: 'PAN' },
          { op: 'synonym' as const, input: 'a cake', output: 'COKE' },
          { op: 'concat' as const, input: 'PAN+CAKE', output: 'PANCAKE' },
        ],
      },
    };
    expect(validateClue(broken).join(' ')).toMatch(/concat piece/);
  });

  it('accepts a charade whose concat pieces compose, including via a chained op', () => {
    const chained = {
      ...good,
      clueType: 'charade' as const,
      solution: 'REGALE',
      enumeration: '6',
      clue: 'Returned beer with energy to entertain (6)',
      definitionSpan: { text: 'entertain', start: 30, end: 39, position: 'end' as const },
      wordplay: {
        indicator: 'Returned',
        fodder: 'LAGER + E',
        operations: [
          { op: 'synonym' as const, input: 'beer', output: 'LAGER' },
          { op: 'reverse' as const, input: 'LAGER', output: 'REGAL' },
          { op: 'abbreviate' as const, input: 'energy', output: 'E' },
          { op: 'concat' as const, input: 'REGAL+E', output: 'REGALE' },
        ],
      },
    };
    expect(validateClue(chained).join(' ')).not.toMatch(/concat piece/);
  });

  it('flags an insert that is not a true internal insertion', () => {
    const broken = {
      ...good,
      clueType: 'container' as const,
      solution: 'OVICE',
      enumeration: '5',
      wordplay: {
        indicator: 'about',
        fodder: 'O in VICE',
        operations: [
          { op: 'abbreviate' as const, input: 'nothing', output: 'O' },
          { op: 'synonym' as const, input: 'wickedness', output: 'VICE' },
          { op: 'insert' as const, input: 'O in VICE', output: 'OVICE' },
        ],
      },
    };
    expect(validateClue(broken).join(' ')).toMatch(/not a true insertion|insert/);
  });

  it('accepts a genuine internal insertion (O in VICE = VOICE)', () => {
    const ok = {
      ...good,
      clueType: 'container' as const,
      solution: 'VOICE',
      enumeration: '5',
      clue: "Utter nothing when there's wickedness about (5)",
      definitionSpan: { text: 'Utter', start: 0, end: 5, position: 'start' as const },
      wordplay: {
        indicator: 'about',
        fodder: 'O in VICE',
        operations: [
          { op: 'abbreviate' as const, input: 'nothing', output: 'O' },
          { op: 'synonym' as const, input: 'wickedness', output: 'VICE' },
          { op: 'insert' as const, input: 'O in VICE', output: 'VOICE' },
        ],
      },
    };
    expect(validateClue(ok).join(' ')).not.toMatch(/insertion|insert piece/);
  });

  it('accepts an insert piece that appears literally in the surface ("taking me in")', () => {
    const ok = {
      ...good,
      clueType: 'container' as const,
      solution: 'DEMEAN',
      enumeration: '6',
      clue: 'Cathedral head taking me in to degrade (6)',
      definitionSpan: { text: 'degrade', start: 31, end: 38, position: 'end' as const },
      wordplay: {
        indicator: 'taking ... in',
        fodder: 'ME in DEAN',
        operations: [
          { op: 'synonym' as const, input: 'Cathedral head', output: 'DEAN' },
          { op: 'insert' as const, input: 'ME in DEAN', output: 'DEMEAN' },
        ],
      },
    };
    expect(validateClue(ok).join(' ')).not.toMatch(/insert piece/);
  });

  it('flags an unindicated article swallowed by a literal piece ("a cake" → CAKE)', () => {
    const broken = {
      ...good,
      clueType: 'charade' as const,
      solution: 'PANCAKE',
      enumeration: '7',
      wordplay: {
        indicator: '',
        fodder: 'PAN + CAKE',
        operations: [
          { op: 'synonym' as const, input: 'pan', output: 'PAN' },
          { op: 'synonym' as const, input: 'a cake', output: 'CAKE' },
          { op: 'concat' as const, input: 'PAN+CAKE', output: 'PANCAKE' },
        ],
      },
    };
    expect(validateClue(broken).join(' ')).toMatch(/unindicated article/);
  });

  it('tolerates a definite article before a literal piece ("the bed" → BED)', () => {
    const ok = {
      ...good,
      wordplay: {
        ...good.wordplay,
        operations: [
          ...good.wordplay.operations,
          { op: 'synonym' as const, input: 'the bed', output: 'BED' },
        ],
      },
    };
    expect(validateClue(ok).join(' ')).not.toMatch(/unindicated article/);
  });

  it('flags an alternation whose alternate letters do not spell the solution', () => {
    const broken = {
      ...good,
      clueType: 'alternation' as const,
      solution: 'BRAIN',
      enumeration: '5',
      wordplay: {
        indicator: 'Regularly',
        fodder: 'barbarous',
        operations: [{ op: 'alternate' as const, input: 'barbarous', output: 'BRAIN' }],
      },
    };
    expect(validateClue(broken).join(' ')).toMatch(/alternation/);
  });

  it('accepts an alternation whose alternate letters spell the solution', () => {
    const ok = {
      ...good,
      clueType: 'alternation' as const,
      solution: 'BRAIN',
      enumeration: '5',
      clue: 'Regularly barbarian in mind (5)',
      definitionSpan: { text: 'mind', start: 23, end: 27, position: 'end' as const },
      wordplay: {
        indicator: 'Regularly',
        fodder: 'barbarian',
        operations: [{ op: 'alternate' as const, input: 'barbarian', output: 'BRAIN' }],
      },
    };
    expect(validateClue(ok).join(' ')).not.toMatch(/alternation/);
  });

  it('accepts a first-letter device (boy primarily → B)', () => {
    const charade = CLUES.find((c) => c.clueType === 'charade') ?? good;
    const clue = {
      ...charade,
      clue: 'Her boy, primarily, in something (4)',
      wordplay: {
        ...charade.wordplay,
        operations: [{ op: 'abbreviate' as const, input: 'boy primarily', output: 'B' }],
      },
    };
    // The abbreviation check itself must not flag the acrostic.
    expect(validateClue(clue).join(' ')).not.toMatch(/unrecognised abbreviation/);
  });
});
