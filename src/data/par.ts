// Par for the Daily — the golf-style target of hints + letters a capable
// improver would spend. Each bank clue carries a rubric-set `par`
// (docs/clue-style.md §7b; set by scripts/par-baseline.mjs + blind judges +
// scripts/par-apply.mjs). These helpers are the runtime side of that rubric.
import type { Clue } from '../types';

export const PAR_MIN = 2;
export const PAR_MAX = 6;

/** Rubric factor A: a full grid checks ~half the letters; par allows half of those. */
export function letterAllowance(letters: number): number {
  return letters <= 6 ? 1 : letters <= 10 ? 2 : 3;
}

export function clampPar(n: number): number {
  return Math.max(PAR_MIN, Math.min(PAR_MAX, n));
}

/** The clue's rubric par, or the length-only baseline (A + one hint) if unset. */
export function parFor(clue: Clue): number {
  if (clue.par !== undefined) return clue.par;
  const n = clue.solution.toUpperCase().replace(/[^A-Z]/g, '').length;
  return clampPar(letterAllowance(n) + 1);
}

/** "Par", "1 under par", "2 over par". */
export function scoreLabel(score: number, par: number): string {
  const d = score - par;
  if (d === 0) return 'Par';
  return `${Math.abs(d)} ${d < 0 ? 'under' : 'over'} par`;
}
