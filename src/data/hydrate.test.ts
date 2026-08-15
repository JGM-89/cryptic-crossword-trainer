import { describe, expect, it } from 'vitest';
import { hydrateClue, type RawClue } from './hydrate';

const base = {
  id: 'test-cd',
  difficulty: 3 as const,
  enumeration: '5',
  parse: 'Cryptic definition: an old flame.',
};

describe('tier-1 definition hint', () => {
  it('whole-clue devices say the WHOLE clue is the definition (no "at the START")', () => {
    const cd: RawClue = {
      ...base,
      clueType: 'cryptic-definition',
      clue: 'An old sweetheart one might rekindle? (5)',
      solution: 'FLAME',
      def: { text: 'An old sweetheart one might rekindle?', position: 'start' },
      wordplay: { indicator: '', fodder: '', operations: [{ op: 'literal', input: 'pun', output: 'FLAME' }] },
    };
    const hint1 = hydrateClue(cd).hints[0].text;
    expect(hint1).not.toMatch(/at the START/);
    expect(hint1).toMatch(/whole clue/i);
  });

  it('&lit clues also get whole-clue wording', () => {
    const lit: RawClue = {
      ...base,
      id: 'test-lit',
      clueType: 'lit',
      clue: 'Terribly evil (4)',
      solution: 'VILE',
      enumeration: '4',
      def: { text: 'Terribly evil', position: 'start' },
      wordplay: { indicator: 'Terribly', fodder: 'evil', operations: [{ op: 'anagram', input: 'EVIL', output: 'VILE' }] },
      parse: '(EVIL)* = VILE; the whole clue is also the definition.',
    };
    const hint1 = hydrateClue(lit).hints[0].text;
    expect(hint1).not.toMatch(/at the START/);
    expect(hint1).toMatch(/whole clue/i);
  });

  it('ordinary clues keep the positional wording', () => {
    const anagram: RawClue = {
      ...base,
      id: 'test-anagram',
      clueType: 'anagram',
      clue: 'Garden developed into a hazard (6)',
      solution: 'DANGER',
      enumeration: '6',
      def: { text: 'a hazard', position: 'end' },
      wordplay: { indicator: 'developed', fodder: 'Garden', operations: [{ op: 'anagram', input: 'GARDEN', output: 'DANGER' }] },
      parse: '(GARDEN)* = DANGER.',
    };
    expect(hydrateClue(anagram).hints[0].text).toMatch(/at the END/);
  });
});
