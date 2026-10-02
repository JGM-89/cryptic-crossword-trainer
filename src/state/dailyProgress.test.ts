import { beforeEach, describe, expect, it } from 'vitest';
import { loadDaily, prevDateKey, recordArchiveSolve, recordDailySolve, resultFor } from './dailyProgress';

describe('daily streaks', () => {
  beforeEach(() => localStorage.clear());

  it('first solve starts a streak of 1', () => {
    const s = recordDailySolve('2026-06-15', { hintsUsed: 0, revealed: false });
    expect(s.streak).toBe(1);
    expect(s.best).toBe(1);
  });

  it('consecutive days extend the streak; a gap resets it', () => {
    recordDailySolve('2026-06-15', { hintsUsed: 0, revealed: false });
    const two = recordDailySolve('2026-06-16', { hintsUsed: 1, revealed: false });
    expect(two.streak).toBe(2);
    const reset = recordDailySolve('2026-06-20', { hintsUsed: 0, revealed: false });
    expect(reset.streak).toBe(1);
    expect(reset.best).toBe(2);
  });

  it('solving the same day twice is idempotent', () => {
    recordDailySolve('2026-06-15', { hintsUsed: 2, revealed: false });
    const again = recordDailySolve('2026-06-15', { hintsUsed: 0, revealed: false });
    expect(again.streak).toBe(1);
    expect(again.history['2026-06-15'].hintsUsed).toBe(2);
  });

  it('persists across loads and handles month boundaries', () => {
    expect(prevDateKey('2026-07-01')).toBe('2026-06-30');
    recordDailySolve('2026-06-30', { hintsUsed: 0, revealed: false });
    recordDailySolve('2026-07-01', { hintsUsed: 0, revealed: false });
    expect(loadDaily().streak).toBe(2);
  });
});

describe('catch-up solves from the archive', () => {
  beforeEach(() => localStorage.clear());

  it('never touch the streak, best or last date', () => {
    recordDailySolve('2026-06-15', { hintsUsed: 0, revealed: false });
    const after = recordArchiveSolve('2026-06-10', { hintsUsed: 1, lettersShown: 1, score: 2, par: 3, revealed: false });
    expect(after.streak).toBe(1);
    expect(after.best).toBe(1);
    expect(after.lastDate).toBe('2026-06-15');
    expect(after.history['2026-06-10']).toBeUndefined();
    expect(after.archive['2026-06-10'].score).toBe(2);
  });

  it('are idempotent per date', () => {
    recordArchiveSolve('2026-06-10', { hintsUsed: 0, score: 0, par: 2, revealed: false });
    const again = recordArchiveSolve('2026-06-10', { hintsUsed: 3, score: 3, par: 2, revealed: false });
    expect(again.archive['2026-06-10'].score).toBe(0);
  });

  it('resultFor prefers the on-the-day result, then the catch-up', () => {
    recordDailySolve('2026-06-15', { hintsUsed: 2, revealed: false });
    const s = recordArchiveSolve('2026-06-12', { hintsUsed: 0, score: 0, par: 2, revealed: false });
    expect(resultFor(s, '2026-06-15')?.hintsUsed).toBe(2);
    expect(resultFor(s, '2026-06-12')?.score).toBe(0);
    expect(resultFor(s, '2026-06-01')).toBeUndefined();
  });

  it('old saves without an archive map still load', () => {
    localStorage.setItem(
      'cct:daily:v1',
      JSON.stringify({ lastDate: '2026-06-15', streak: 1, best: 1, history: { '2026-06-15': { hintsUsed: 0, revealed: false } } }),
    );
    expect(loadDaily().archive).toEqual({});
  });
});

describe('mixing on-the-day and catch-up solves', () => {
  beforeEach(() => localStorage.clear());
  it('an on-the-day solve keeps earlier catch-up results', () => {
    recordArchiveSolve('2026-06-10', { hintsUsed: 0, score: 0, par: 2, revealed: false });
    const s = recordDailySolve('2026-06-15', { hintsUsed: 0, score: 0, par: 3, revealed: false });
    expect(s.archive['2026-06-10']).toBeDefined();
  });
});
