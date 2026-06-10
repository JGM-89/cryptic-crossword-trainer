import { describe, expect, it } from 'vitest';
import { dailyClue, dateKey, dayNumber } from './daily';
import schedule from './daily-schedule.json';
import { BANK } from './bank/index';

describe('daily schedule integrity', () => {
  it('every scheduled answer resolves to a real bank clue', () => {
    const ids = new Set(BANK.map((c) => c.id));
    const missing = (schedule as { answers: string[] }).answers.filter(
      (a) => !ids.has(`bank-${a.toLowerCase()}`),
    );
    expect(missing).toEqual([]);
  });

  it('has no duplicate answers and a sane length', () => {
    const { answers } = schedule as { answers: string[] };
    expect(new Set(answers).size).toBe(answers.length);
    expect(answers.length).toBeGreaterThanOrEqual(250);
  });
});

describe('day numbering (local dates)', () => {
  it('epoch day is Daily #1', () => {
    expect(dayNumber('2026-06-15')).toBe(1);
  });
  it('the next day is #2; a year later wraps the schedule but keeps counting', () => {
    expect(dayNumber('2026-06-16')).toBe(2);
    expect(dayNumber('2027-06-15')).toBe(366);
  });
  it('before the epoch there is no daily', () => {
    expect(dayNumber('2026-06-14')).toBe(0);
    expect(dailyClue('2026-06-14')).toBeNull();
  });
  it('the same date always yields the same clue', () => {
    const a = dailyClue('2026-07-01');
    const b = dailyClue('2026-07-01');
    expect(a && b && a.clue.id === b.clue.id).toBe(true);
    expect(a?.number).toBe(17);
  });
  it('dateKey formats a local date as YYYY-MM-DD', () => {
    expect(dateKey(new Date(2026, 5, 15, 23, 59))).toBe('2026-06-15');
  });
});
