// Validator loopholes found by the Astra audit (docs/audit/2026-10-02/08-astra-chatgpt.md),
// plus the fair construction the old rules wrongly banned. Each broken candidate
// must now be rejected; the fair one must pass.
import { describe, expect, it } from 'vitest';
import { hydrateBankEntry, type BankEntry } from './bank/index';
import { validateClue } from './integrity';

const check = (e: Omit<BankEntry, 'difficulty' | 'par'>) =>
  validateClue(hydrateBankEntry({ difficulty: 2, par: 2, ...e } as BankEntry));

describe('validator loopholes (now closed)', () => {
  it('hidden: the carrier must actually be in the clue ("Pet in fog" from CATtle)', () => {
    const errors = check({
      answer: 'CAT', clueType: 'hidden', clue: 'Pet in fog (3)',
      def: { text: 'Pet', position: 'start' },
      wordplay: { indicator: 'in', fodder: 'cattle', operations: [{ op: 'hidden', input: '<CAT>tle', output: 'CAT' }] },
      parse: 'x',
    });
    expect(errors.join(' ')).toMatch(/hidden carrier .* not in the clue/);
  });

  it('deletion: only a specified chunk may go — not scattered letters (CARTS → CAT)', () => {
    const errors = check({
      answer: 'CAT', clueType: 'deletion', clue: 'Carts endlessly provide a pet (3)',
      def: { text: 'a pet', position: 'end' },
      wordplay: { indicator: 'endlessly', fodder: 'Carts', operations: [{ op: 'delete', input: 'CARTS − RS', output: 'CAT' }] },
      parse: 'x',
    });
    expect(errors.join(' ')).toMatch(/not a deletion of one contiguous part/);
  });

  it('composition: single letters must come from somewhere ("A dog" → C+A+T)', () => {
    const errors = check({
      answer: 'CAT', clueType: 'charade', clue: 'A dog (3)',
      def: { text: 'dog', position: 'end' },
      wordplay: { indicator: '', fodder: 'C + A + T', operations: [{ op: 'concat', input: 'C+A+T', output: 'CAT' }] },
      parse: 'x',
    });
    expect(errors.join(' ')).toMatch(/piece "C" is not produced/);
    expect(errors.join(' ')).toMatch(/piece "T" is not produced/);
  });
});

describe('fair constructions the old rules wrongly banned', () => {
  it('a curtailed synonym that really yields the answer passes cleanly', () => {
    const errors = check({
      answer: 'TAR', clueType: 'deletion', clue: 'Beheaded celebrity is a sailor (3)',
      def: { text: 'a sailor', position: 'end' },
      wordplay: {
        indicator: 'Beheaded', fodder: 'STAR',
        operations: [
          { op: 'synonym', input: 'celebrity', output: 'STAR' },
          { op: 'delete', input: 'STAR − S', output: 'TAR' },
        ],
      },
      parse: 'x',
    });
    expect(errors).toEqual([]);
  });
});
