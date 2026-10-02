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

/** The calendar date key of Daily #n (inverse of dayNumber). */
export function dateForNumber(n: number): string {
  const [ey, em, ed] = SCHEDULE.epoch.split('-').map(Number);
  return new Date(Date.UTC(ey, em - 1, ed + n - 1)).toISOString().slice(0, 10);
}

function clueForNumber(n: number): Clue | null {
  const answer = SCHEDULE.answers[(n - 1) % SCHEDULE.answers.length];
  return BANK.find((c) => c.id === `bank-${answer.toLowerCase()}`) ?? null;
}

/** The clue for a date, or null before the epoch. Same for everyone. */
export function dailyClue(key: string = dateKey()): { clue: Clue; number: number } | null {
  const n = dayNumber(key);
  if (n < 1) return null;
  const clue = clueForNumber(n);
  return clue ? { clue, number: n } : null;
}

/** Daily #n with its date (for the archive), or null before #1. */
export function dailyByNumber(n: number): { clue: Clue; number: number; date: string } | null {
  if (!Number.isInteger(n) || n < 1) return null;
  const clue = clueForNumber(n);
  return clue ? { clue, number: n, date: dateForNumber(n) } : null;
}

/** "Thu 2 Jul 2026" for a YYYY-MM-DD key (calendar date, no timezone drift). */
export function formatDateKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
