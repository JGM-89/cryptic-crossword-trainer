import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BANK_RAW } from './bank/index';

// Read the generated archive directly (archive.ts uses fetch, which is browser-only).
const archive = JSON.parse(
  readFileSync(join(process.cwd(), 'public', 'archive.json'), 'utf8'),
) as Array<{
  id: number;
  size: number;
  blackPattern: string;
  entries: Array<{
    answer: string;
    clue: string;
    row: number;
    col: number;
    direction: 'across' | 'down';
  }>;
}>;

const bankByAnswer = new Map(
  BANK_RAW.map((e) => [e.answer.toUpperCase().replace(/[^A-Z]/g, ''), e]),
);

describe('generated archive', () => {
  it('has a substantial number of puzzles', () => {
    expect(archive.length).toBeGreaterThanOrEqual(100);
  });

  it('every entry uses a real bank clue (no drift) and fits the grid', () => {
    const problems: string[] = [];
    for (const p of archive) {
      if (p.blackPattern.length !== p.size * p.size) {
        problems.push(`#${p.id} blackPattern length ${p.blackPattern.length} ≠ ${p.size ** 2}`);
      }
      for (const e of p.entries) {
        const ans = e.answer.toUpperCase().replace(/[^A-Z]/g, '');
        const bank = bankByAnswer.get(ans);
        if (!bank) problems.push(`#${p.id} ${ans} not in bank`);
        else if (bank.clue !== e.clue) problems.push(`#${p.id} ${ans} clue drift`);
        const len = ans.length;
        const endR = e.direction === 'down' ? e.row + len - 1 : e.row;
        const endC = e.direction === 'across' ? e.col + len - 1 : e.col;
        if (endR >= p.size || endC >= p.size) problems.push(`#${p.id} ${ans} out of bounds`);
      }
    }
    expect(problems.slice(0, 10)).toEqual([]);
  });

  it('every puzzle has no duplicate answers', () => {
    for (const p of archive) {
      const answers = p.entries.map((e) => e.answer);
      expect(new Set(answers).size).toBe(answers.length);
    }
  });
});
