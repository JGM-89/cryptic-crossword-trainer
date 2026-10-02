// localStorage state for the Daily Clue: streaks + per-day results. Same
// pattern as playProgress.ts — separate from the IndexedDB competence model
// (which still receives every daily solve via ProgressContext.solveClue).

const KEY = 'cct:daily:v1';

export interface DailyResult {
  /** Explanatory hints taken (definition / device / wordplay). */
  hintsUsed: number;
  /** Letters revealed with "Show a letter". */
  lettersShown?: number;
  /** hints + letters. Absent on results from before par scoring. */
  score?: number;
  /** The clue's par when it was played. */
  par?: number;
  revealed: boolean;
}

export interface DailyState {
  lastDate: string | null;
  streak: number;
  best: number;
  /** On-the-day solves — the streak's evidence. */
  history: Record<string, DailyResult>;
  /** Catch-up solves from the Daily archive. Never count toward the streak. */
  archive: Record<string, DailyResult>;
}

const empty = (): DailyState => ({ lastDate: null, streak: 0, best: 0, history: {}, archive: {} });

export function loadDaily(): DailyState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...(JSON.parse(raw) as DailyState) } : empty();
  } catch {
    return empty();
  }
}

function save(state: DailyState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota/privacy-mode errors */
  }
}

/** The calendar day before a YYYY-MM-DD key (UTC arithmetic is safe on keys). */
export function prevDateKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  t.setUTCDate(t.getUTCDate() - 1);
  return t.toISOString().slice(0, 10);
}

/** Record today's solve (idempotent per date) and return the new state. */
export function recordDailySolve(key: string, result: DailyResult): DailyState {
  const s = loadDaily();
  if (s.history[key]) return s;
  const streak = s.lastDate === prevDateKey(key) ? s.streak + 1 : 1;
  const next: DailyState = {
    ...s,
    lastDate: key,
    streak,
    best: Math.max(s.best, streak),
    history: { ...s.history, [key]: result },
  };
  save(next);
  return next;
}

/** Record a catch-up solve of a past Daily. Idempotent; never touches the streak. */
export function recordArchiveSolve(key: string, result: DailyResult): DailyState {
  const s = loadDaily();
  if (s.history[key] || s.archive[key]) return s;
  const next: DailyState = { ...s, archive: { ...s.archive, [key]: result } };
  save(next);
  return next;
}

/** A day's result: the on-the-day solve if there is one, else the catch-up. */
export function resultFor(state: DailyState, key: string): DailyResult | undefined {
  return state.history[key] ?? state.archive[key];
}

// ── Unfinished attempts ─────────────────────────────────────────────────────
// Hints and letters taken on an unfinished Daily survive leaving the page, so
// navigating away can never reset the score. Cleared when the Daily is finished.
const ATTEMPT_KEY = 'cct:daily-attempt:v1';
const KEEP_ATTEMPTS = 10;

export interface DailyAttempt {
  taken: string[];
  letters: number;
  value: string[];
  locked: boolean[];
}

function loadAttempts(): Record<string, DailyAttempt> {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPT_KEY) ?? '{}') as Record<string, DailyAttempt>;
  } catch {
    return {};
  }
}

export function loadAttempt(key: string): DailyAttempt | null {
  return loadAttempts()[key] ?? null;
}

export function saveAttempt(key: string, attempt: DailyAttempt): void {
  const all = { ...loadAttempts(), [key]: attempt };
  const keep = Object.keys(all).sort().slice(-KEEP_ATTEMPTS);
  try {
    localStorage.setItem(ATTEMPT_KEY, JSON.stringify(Object.fromEntries(keep.map((k) => [k, all[k]]))));
  } catch {
    /* ignore quota/privacy-mode errors */
  }
}

export function clearAttempt(key: string): void {
  const all = loadAttempts();
  if (!(key in all)) return;
  delete all[key];
  try {
    localStorage.setItem(ATTEMPT_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
