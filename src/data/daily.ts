// Pure Daily Clue logic: which bank clue belongs to which LOCAL calendar date.
// The schedule (src/data/daily-schedule.json) is a frozen, seeded ordering of
// bank answers; day numbers count from the epoch (= Daily #1) and wrap.
import schedule from './daily-schedule.json';
import { BANK } from './bank/index';
import type { Clue } from '../types';

interface DailySchedule {
  epoch: string;
  answers: string[];
}
const SCHEDULE = schedule as DailySchedule;

/** Local-calendar date key, e.g. "2026-06-15". */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Day number for a date key: the epoch date is #1; earlier dates are ≤ 0. */
export function dayNumber(key: string = dateKey()): number {
  const [ey, em, ed] = SCHEDULE.epoch.split('-').map(Number);
  const [y, m, d] = key.split('-').map(Number);
  const ms = Date.UTC(y, m - 1, d) - Date.UTC(ey, em - 1, ed);
  return Math.round(ms / 86_400_000) + 1;
}

/** The clue for a date, or null before the epoch. Same for everyone. */
export function dailyClue(key: string = dateKey()): { clue: Clue; number: number } | null {
  const n = dayNumber(key);
  if (n < 1) return null;
  const answer = SCHEDULE.answers[(n - 1) % SCHEDULE.answers.length];
  const clue = BANK.find((c) => c.id === `bank-${answer.toLowerCase()}`) ?? null;
  return clue ? { clue, number: n } : null;
}
