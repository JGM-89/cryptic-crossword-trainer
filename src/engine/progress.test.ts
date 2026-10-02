import { describe, expect, it } from 'vitest';
import { applySolve, initialProgress } from './progress';
import { BANK } from '../data/bank/index';

describe('applySolve', () => {
  it('advanced devices (&lit, initialism, alternation) solve without crashing', () => {
    // Daily #13 (MEND) is an &lit — competence only tracks the nine taught devices.
    const lit = BANK.find((c) => c.clueType === 'lit');
    expect(lit).toBeDefined();
    const next = applySolve(initialProgress(), lit!, { usedHint: false });
    expect(next.solvedClues[lit!.id]).toBeDefined();
    expect(next.competence).not.toHaveProperty('lit');
  });

  it('taught devices still advance competence', () => {
    const anagram = BANK.find((c) => c.clueType === 'anagram')!;
    const next = applySolve(initialProgress(), anagram, { usedHint: false });
    expect(next.competence.anagram.attempts).toBe(1);
  });
});
