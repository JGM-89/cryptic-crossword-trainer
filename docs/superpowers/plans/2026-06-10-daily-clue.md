# Daily Clue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A "Daily Clue" page — one bank clue per day for everyone, with the existing hint ladder and fading scaffolding, a local streak, and a share button — Cruci's retention loop and its bridge from Stage-A lessons to real solving.

**Architecture:** Fully static. A build script emits a fixed, seeded ordering of bank answers (`src/data/daily-schedule.json`), excluding the 80 most Play-frequent answers. Day number = local days since a fixed epoch (2026-06-15 = Daily #1); index = `(n-1) % schedule.length`. The page resolves the answer to a hydrated `Clue` from `BANK`, renders the existing `ClueCard` with competence-driven scaffolding (so the daily *teaches*), persists a streak in localStorage (same pattern as `playProgress.ts`), and feeds solves into the IndexedDB competence engine via `ProgressContext`. Depends on the analytics plan (uses `track()` and ClueCard's `source` prop).

**Tech Stack:** React + react-router (existing), localStorage, seeded shuffle (mulberry32), vitest.

**Design decisions (locked):**
- Content: bank clues, minus the top-80 Play-frequent answers (owner's choice) → ~286 dailies before the cycle repeats.
- "Day" = the user's local calendar date (Wordle convention).
- Epoch `2026-06-15` and shuffle seed are FROZEN once shipped — changing either rewrites everyone's daily history.
- Streak lives in localStorage (`cct:daily:v1`), separate from the IndexedDB competence model, mirroring `playProgress.ts`.

---

### Task 1: Schedule generator

**Files:**
- Create: `scripts/generate-daily.mjs`
- Create: `src/data/daily-schedule.json` (generated, committed)
- Modify: `package.json` (add `"daily:gen": "node scripts/generate-daily.mjs"` to scripts)

- [ ] **Step 1: Write the generator**

```js
// scripts/generate-daily.mjs
// Builds src/data/daily-schedule.json: a FIXED, seeded ordering of bank
// answers for the Daily Clue, excluding the most Play-frequent answers so the
// daily never feels like grid fill. Deterministic: same bank + archive + seed
// → same file. EPOCH and SEED are frozen forever once shipped — changing
// either rewrites every user's daily history.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const EXCLUDE_TOP = 80;
const EPOCH = '2026-06-15'; // Daily #1 (local date)
const SEED = 0x5eed_c1;

const answers = [];
for (const f of readdirSync('src/data/bank').filter((f) => /^part-[a-z]\.json$/.test(f)))
  for (const e of JSON.parse(readFileSync(`src/data/bank/${f}`, 'utf8')))
    answers.push(e.answer.toUpperCase());

const puzzles = JSON.parse(readFileSync('public/archive.json', 'utf8'));
const freq = new Map();
for (const p of puzzles)
  for (const a of new Set(p.entries.map((e) => e.answer)))
    freq.set(a, (freq.get(a) ?? 0) + 1);
const excluded = new Set(
  [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, EXCLUDE_TOP).map(([a]) => a),
);

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pool = answers.filter((a) => !excluded.has(a)).sort();
const rand = mulberry32(SEED);
for (let i = pool.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [pool[i], pool[j]] = [pool[j], pool[i]];
}

writeFileSync(
  'src/data/daily-schedule.json',
  JSON.stringify({ epoch: EPOCH, answers: pool }, null, 1),
);
console.log(`daily schedule: ${pool.length} answers (excluded top ${EXCLUDE_TOP} Play-frequent)`);
```

- [ ] **Step 2: Run it and sanity-check**

Run: `node scripts/generate-daily.mjs`
Expected: `daily schedule: ~286 answers (excluded top 80 Play-frequent)`; `src/data/daily-schedule.json` exists, no ART/AGE/EAR near the top of Play frequency inside it.

- [ ] **Step 3: Add the npm alias and commit**

```bash
git add scripts/generate-daily.mjs src/data/daily-schedule.json package.json
git commit -m "feat: deterministic daily-clue schedule from the bank (top-80 Play answers excluded)"
```

---

### Task 2: Pure daily logic

**Files:**
- Create: `src/data/daily.ts`
- Test: `src/data/daily.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/data/daily.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/data/daily.test.ts`
Expected: FAIL — "Cannot find module './daily'"

- [ ] **Step 3: Implement**

```ts
// src/data/daily.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/data/daily.test.ts`
Expected: all pass. (If the `#17` assertion fails, the schedule changed — fix the expected id by reading the schedule, not by changing the logic.)

- [ ] **Step 5: Commit**

```bash
git add src/data/daily.ts src/data/daily.test.ts
git commit -m "feat: pure daily-clue date logic"
```

---

### Task 3: Streak state

**Files:**
- Create: `src/state/dailyProgress.ts`
- Test: `src/state/dailyProgress.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/state/dailyProgress.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/state/dailyProgress.test.ts`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement**

```ts
// src/state/dailyProgress.ts
// localStorage state for the Daily Clue: streaks + per-day results. Same
// pattern as playProgress.ts — separate from the IndexedDB competence model
// (which still receives every daily solve via ProgressContext.solveClue).

const KEY = 'cct:daily:v1';

export interface DailyResult {
  hintsUsed: number;
  revealed: boolean;
}

export interface DailyState {
  lastDate: string | null;
  streak: number;
  best: number;
  history: Record<string, DailyResult>;
}

const empty = (): DailyState => ({ lastDate: null, streak: 0, best: 0, history: {} });

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
    lastDate: key,
    streak,
    best: Math.max(s.best, streak),
    history: { ...s.history, [key]: result },
  };
  save(next);
  return next;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/state/dailyProgress.test.ts`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/state/dailyProgress.ts src/state/dailyProgress.test.ts
git commit -m "feat: daily streak state (localStorage)"
```

---

### Task 4: The Daily page

**Files:**
- Create: `src/pages/DailyPage.tsx`
- Modify: `src/App.tsx` (route + nav)

- [ ] **Step 1: Write the page**

```tsx
// src/pages/DailyPage.tsx
// One clue a day, same for everyone. Reuses ClueCard (hint ladder + fading via
// the solver's per-device competence), feeds the competence engine, keeps a
// local streak, and offers a share line after solving.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { dailyClue, dateKey } from '../data/daily';
import { loadDaily, recordDailySolve, type DailyState } from '../state/dailyProgress';
import { useProgress } from '../state/ProgressContext';
import { scaffoldingFor, type SolveOutcome } from '../engine/fading';
import { ClueCard } from '../components/ClueCard';
import { track } from '../analytics';
import type { Clue } from '../types';

const SITE = 'https://jgm-89.github.io/cryptic-crossword-trainer/daily';

export function DailyPage() {
  const today = dateKey();
  const daily = useMemo(() => dailyClue(today), [today]);
  const { competenceFor, solveClue } = useProgress();
  const [state, setState] = useState<DailyState>(loadDaily);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (daily) track('daily_start', { number: daily.number });
  }, [daily?.number]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!daily) {
    return (
      <div className="page daily-page">
        <h1>Daily Clue</h1>
        <p className="lede">
          The first Daily arrives on 15 June 2026. Warm up in <Link to="/learn">Learn</Link>{' '}
          meanwhile.
        </p>
      </div>
    );
  }

  const result = state.history[today];
  const scaffolding = scaffoldingFor(competenceFor(daily.clue.clueType).stage);

  function onSolved(clue: Clue, outcome: SolveOutcome) {
    solveClue(clue, outcome); // feed the competence engine like any lesson solve
    const next = recordDailySolve(today, {
      hintsUsed: outcome.hintsUsed ?? 0,
      revealed: (outcome.hintsUsed ?? 0) >= 4,
    });
    setState(next);
    track('daily_solved', {
      number: daily!.number,
      hints: outcome.hintsUsed ?? 0,
      streak: next.streak,
    });
  }

  function shareText(): string {
    const r = state.history[today];
    const how = !r
      ? ''
      : r.revealed
        ? 'it beat me today'
        : r.hintsUsed === 0
          ? 'solved unaided'
          : `solved with ${r.hintsUsed} hint${r.hintsUsed === 1 ? '' : 's'}`;
    return `Cruci Daily #${daily!.number} — ${how}\n${SITE}`;
  }

  async function share() {
    const text = shareText();
    track('daily_shared', { number: daily!.number });
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing sensible to do */
    }
  }

  return (
    <div className="page daily-page">
      <header className="lesson-page-head">
        <h1>Daily Clue #{daily.number}</h1>
        <p className="lede">
          One clue a day — hints fade as you improve.
          {state.streak > 0 && (
            <>
              {' '}
              Streak: <strong>{state.streak}</strong>
              {state.best > state.streak ? ` (best ${state.best})` : ''}
            </>
          )}
        </p>
      </header>

      <ClueCard
        key={today}
        clue={daily.clue}
        scaffolding={scaffolding}
        alreadySolved={Boolean(result)}
        onSolved={onSolved}
        source="daily"
      />

      {result && (
        <div className="lesson-complete">
          <p>
            <strong>That’s today’s.</strong> Come back tomorrow — or keep going in{' '}
            <Link to="/learn">Learn</Link>.
          </p>
          <button type="button" className="btn btn-primary" onClick={share}>
            {copied ? 'Copied!' : 'Share result'}
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire route + nav in App.tsx**

Add import: `import { DailyPage } from './pages/DailyPage';`

NAV — add as the FIRST item:

```ts
const NAV = [
  { to: '/daily', label: 'Daily', end: false },
  { to: '/learn', label: 'Learn', end: false },
  ...
```

Routes — add alongside the others:

```tsx
<Route path="/daily" element={<DailyPage />} />
```

- [ ] **Step 3: Typecheck + run the app**

Run: `npm run typecheck && npx vitest run`
Expected: green. Then `npm run dev`, open `/daily`: before the epoch you should see the "first Daily arrives" notice — temporarily set the epoch date in `daily-schedule.json` to today to see a live clue, solve it, confirm streak shows 1 and Share copies text. **Revert the epoch before committing** (`git checkout src/data/daily-schedule.json`).

- [ ] **Step 4: Commit**

```bash
git add src/pages/DailyPage.tsx src/App.tsx
git commit -m "feat: Daily Clue page with streaks and sharing"
```

---

### Task 5: Home page CTA

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Add a Daily CTA to the hero**

Find the hero's primary action area (the existing CTA buttons near the top of the page) and add a primary link FIRST:

```tsx
<Link className="btn btn-primary" to="/daily">
  Today’s clue →
</Link>
```

Keep the existing Learn CTA as the secondary action.

- [ ] **Step 2: Build, eyeball, commit**

```bash
npm run build
git add src/pages/HomePage.tsx
git commit -m "feat: Daily Clue is the homepage's primary call to action"
```

---

### Task 6: Pipeline guard + docs + ship

**Files:**
- Modify: `docs/clue-pipeline.md` (one rule)
- Modify: `PRODUCTIONPLAN.md` (status)

- [ ] **Step 1: Document the regeneration rule**

Add to the "Hard rules & gotchas" list in `docs/clue-pipeline.md`:

```
- **Bank answers changed (added/removed)? Re-run `npm run daily:gen`** — the daily schedule
  references bank answers and `daily.test.ts` fails on drift. Clue-TEXT edits don't need a
  regen (the schedule stores answers, not clues). NEVER change the schedule's epoch or seed:
  they rewrite every user's daily history.
```

- [ ] **Step 2: Update PRODUCTIONPLAN.md** — add Daily Clue to the changelog; move "Teaching depth / review mode" up as the next committed item, noting it should reuse the Daily surface ("weak-device day").

- [ ] **Step 3: Full gate and ship**

```bash
npm test && npm run build
git add -A
git commit -m "feat: Daily Clue (schedule, streaks, share, CTA)"
git push origin main
```

- [ ] **Step 4: Post-launch check** — after the epoch date, verify the live site serves the same clue in two browsers/time zones on the same calendar day, and that Umami shows `daily_start`/`daily_solved` events.
