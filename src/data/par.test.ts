import { describe, expect, it } from 'vitest';
import { clampPar, letterAllowance, parFor, scoreLabel } from './par';
import type { Clue } from '../types';

describe('par rubric helpers', () => {
  it('allows about half the checked letters, by answer length', () => {
    expect(letterAllowance(3)).toBe(1);
    expect(letterAllowance(6)).toBe(1);
    expect(letterAllowance(7)).toBe(2);
    expect(letterAllowance(10)).toBe(2);
    expect(letterAllowance(11)).toBe(3);
  });

  it('clamps par to 2–6', () => {
    expect(clampPar(1)).toBe(2);
    expect(clampPar(4)).toBe(4);
    expect(clampPar(7)).toBe(6);
  });

  it('labels a score against par like golf', () => {
    expect(scoreLabel(3, 3)).toBe('Par');
    expect(scoreLabel(2, 3)).toBe('1 under par');
    expect(scoreLabel(1, 3)).toBe('2 under par');
    expect(scoreLabel(5, 3)).toBe('2 over par');
  });

  it('uses the stored par, else the length baseline', () => {
    const clue = { solution: 'CONTEST', par: 5 } as Clue;
    expect(parFor(clue)).toBe(5);
    expect(parFor({ solution: 'CONTEST' } as Clue)).toBe(3);
    expect(parFor({ solution: 'ELM' } as Clue)).toBe(2);
  });
});
