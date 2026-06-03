import { describe, expect, it } from 'vitest';
import { BANK } from './index';
import { validateClue } from '../integrity';

describe('clue bank integrity', () => {
  it('reports any failing clues (so they can be culled)', () => {
    const failures: Record<string, string[]> = {};
    for (const clue of BANK) {
      const errors = validateClue(clue);
      if (errors.length) failures[`${clue.id} :: ${clue.clue}`] = errors;
    }
    if (Object.keys(failures).length) {
      // Print a readable report; the assertion below fails the test.
      console.log(JSON.stringify(failures, null, 2));
    }
    expect(failures).toEqual({});
  });

  it('has no duplicate answers', () => {
    const seen = new Set<string>();
    const dups: string[] = [];
    for (const clue of BANK) {
      const key = clue.solution.toUpperCase();
      if (seen.has(key)) dups.push(key);
      seen.add(key);
    }
    expect(dups).toEqual([]);
  });
});
