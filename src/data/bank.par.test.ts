// Every bank clue carries a rubric-set par (docs/clue-style.md §7b). New or
// rewritten clues must get one through the rubric before they ship.
import { describe, expect, it } from 'vitest';
import { BANK, BANK_RAW } from './bank/index';
import { PAR_MAX, PAR_MIN } from './par';

describe('bank par', () => {
  it('every bank entry has an integer par within 2–6', () => {
    const bad = BANK_RAW.filter(
      (e) => !Number.isInteger(e.par) || e.par < PAR_MIN || e.par > PAR_MAX,
    ).map((e) => `${e.answer}: ${e.par}`);
    expect(bad).toEqual([]);
  });

  it('par survives hydration onto the Clue', () => {
    expect(BANK.every((c) => c.par === BANK_RAW.find((e) => `bank-${e.answer.toLowerCase()}` === c.id)?.par)).toBe(true);
  });
});
