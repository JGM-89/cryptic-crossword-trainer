import { beforeEach, describe, expect, it } from 'vitest';
import { loadDaily, prevDateKey, recordDailySolve } from './dailyProgress';

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
