# Privacy-First Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provider-agnostic, privacy-first event analytics (Umami Cloud) so every content/product decision stops being a guess.

**Architecture:** A single `src/analytics.ts` module exposing `initAnalytics()` (injects the Umami script only when `VITE_UMAMI_WEBSITE_ID` is set at build time) and `track(event, props)` (no-ops unless the provider is present; never throws). Events fire from `ClueCard` (solve/hint/give-up — covers Learn and the future Daily) and `SolvePage` (puzzle start/complete). Honest copy replaces the "nothing sent to a server" claims.

**Tech Stack:** Umami Cloud (free tier, no cookies, custom events), Vite env vars, vitest.

**Owner action (Josh, ~5 min, can happen any time):** create a free account at https://cloud.umami.is, add website `jgm-89.github.io`, copy the Website ID into `.env` (`VITE_UMAMI_WEBSITE_ID=...`), rebuild + deploy. Until then everything no-ops — the code ships dark.

**Event taxonomy (the contract — don't invent others ad hoc):**

| Event | Props | Fires from |
|---|---|---|
| `clue_solved` | `type` (clueType), `hints` (0–4), `revealed` (bool), `source` (`learn`/`daily`) | ClueCard `finish()` |
| `hint_revealed` | `type`, `tier` (1–4), `source` | ClueCard `revealNextHint()` |
| `give_up` | `type`, `source` | ClueCard `revealAnswer()` |
| `lesson_view` | `lesson` (id), `stage` | LessonPage mount |
| `puzzle_start` | `puzzle` (id) | SolvePage mount |
| `puzzle_complete` | `puzzle` (id) | SolvePage completion callback |

(Pageviews are automatic — the Umami script tracks SPA route changes itself.)

---

### Task 1: The analytics module

**Files:**
- Create: `src/analytics.ts`
- Test: `src/analytics.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/analytics.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('analytics', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    delete (window as { umami?: unknown }).umami;
    document.querySelectorAll('script[data-website-id]').forEach((s) => s.remove());
  });

  it('track() does not throw when no provider is present', async () => {
    const { track } = await import('./analytics');
    expect(() => track('clue_solved', { type: 'anagram' })).not.toThrow();
  });

  it('track() forwards to window.umami.track when present', async () => {
    const spy = vi.fn();
    (window as { umami?: unknown }).umami = { track: spy };
    const { track } = await import('./analytics');
    track('clue_solved', { type: 'anagram', hints: 1 });
    expect(spy).toHaveBeenCalledWith('clue_solved', { type: 'anagram', hints: 1 });
  });

  it('initAnalytics() injects the script only when a website id is configured', async () => {
    vi.stubEnv('VITE_UMAMI_WEBSITE_ID', 'test-id-123');
    const { initAnalytics } = await import('./analytics');
    initAnalytics();
    const el = document.querySelector('script[data-website-id]');
    expect(el?.getAttribute('data-website-id')).toBe('test-id-123');
  });

  it('initAnalytics() is a no-op without a website id', async () => {
    const { initAnalytics } = await import('./analytics');
    initAnalytics();
    expect(document.querySelector('script[data-website-id]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/analytics.test.ts`
Expected: FAIL — "Cannot find module './analytics'"

- [ ] **Step 3: Write the module**

```ts
// src/analytics.ts
// Privacy-first, provider-agnostic analytics.
//
// The whole module no-ops unless VITE_UMAMI_WEBSITE_ID is set at build time
// (set it in .env after creating the site on cloud.umami.is). No cookies, no
// PII — only the named events below plus Umami's automatic pageviews.
// Analytics must NEVER break the app: track() swallows everything.

type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    umami?: { track: (event: string, props?: EventProps) => void };
  }
}

const SCRIPT_SRC = 'https://cloud.umami.is/script.js';

function websiteId(): string | undefined {
  return import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined;
}

export function analyticsEnabled(): boolean {
  return Boolean(websiteId());
}

/** Inject the provider script once, only when configured. Call from main.tsx. */
export function initAnalytics(): void {
  const id = websiteId();
  if (!id || typeof document === 'undefined') return;
  if (document.querySelector('script[data-website-id]')) return;
  const s = document.createElement('script');
  s.defer = true;
  s.src = SCRIPT_SRC;
  s.setAttribute('data-website-id', id);
  document.head.appendChild(s);
}

/** Fire a named event. Safe to call anywhere, any time. */
export function track(event: string, props?: EventProps): void {
  try {
    window.umami?.track(event, props);
  } catch {
    /* analytics must never break the app */
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/analytics.test.ts`
Expected: 4 passed.
Note: `vi.stubEnv` on `import.meta.env` works because `websiteId()` reads the env at call time, not module load — keep it that way.

- [ ] **Step 5: Commit**

```bash
git add src/analytics.ts src/analytics.test.ts
git commit -m "feat: provider-agnostic analytics module (dark until VITE_UMAMI_WEBSITE_ID is set)"
```

---

### Task 2: Wire init + env

**Files:**
- Modify: `src/main.tsx` (add two lines)
- Create: `.env` (committed — the id is public by nature, it ships in the page source anyway)

- [ ] **Step 1: Call initAnalytics() in main.tsx**

Add to the imports in `src/main.tsx`:

```ts
import { initAnalytics } from './analytics';
```

and immediately before the `createRoot(...)` / render call:

```ts
initAnalytics();
```

- [ ] **Step 2: Create `.env` with the placeholder**

```bash
# .env  — public build-time config (the Umami website id is public by design)
# Fill in after creating the site at https://cloud.umami.is → rebuild → deploy.
VITE_UMAMI_WEBSITE_ID=
```

- [ ] **Step 3: Verify the app still builds and runs dark**

Run: `npm run build`
Expected: builds clean. `grep -c umami dist/assets/*.js` shows the module present but `document.head` gets no script at runtime (id empty).

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx .env
git commit -m "feat: initialise analytics at boot (no-op until website id configured)"
```

---

### Task 3: Instrument ClueCard (solve / hint / give-up)

**Files:**
- Modify: `src/components/ClueCard.tsx`

ClueCard is the single funnel for clue interactions in Learn (and the Daily Clue will reuse it), so instrument once here. Current shape (for reference): props `{ clue, scaffolding, alreadySolved, onSolved }`; internal handlers `finish()` (line ~65), `check()`, `revealAnswer()` (line ~82), `revealNextHint()` (line ~89).

- [ ] **Step 1: Add the `source` prop and track calls**

Add to imports:

```ts
import { track } from '../analytics';
```

Extend the props interface:

```ts
interface Props {
  clue: Clue;
  scaffolding: Scaffolding;
  alreadySolved?: boolean;
  onSolved: (clue: Clue, outcome: SolveOutcome) => void;
  /** Where this card lives, for analytics ('learn' lessons by default). */
  source?: 'learn' | 'daily';
}
```

Destructure with default: `{ clue, scaffolding, alreadySolved, onSolved, source = 'learn' }`.

In `finish(outcome: SolveOutcome)`, after `onSolved(clue, outcome);` add:

```ts
    track('clue_solved', {
      type: clue.clueType,
      hints: outcome.hintsUsed ?? 0,
      revealed: (outcome.hintsUsed ?? 0) >= 4,
      source,
    });
```

(Do NOT read the `revealed` React state here — `revealAnswer()` calls `setRevealed(true)` and `finish()` in the same tick, so the state hasn't flushed yet and would always read `false`. `revealAnswer` passes `hintsUsed: 4`, so deriving from the outcome is exact.)

In `revealAnswer()`, before `finish(...)`:

```ts
    track('give_up', { type: clue.clueType, source });
```

In `revealNextHint()`:

```ts
  function revealNextHint() {
    if (!hintUsed) setHintUsed(true);
    setRevealedCount((n) => {
      const next = Math.min(n + 1, offeredTiers.length);
      if (next !== n) track('hint_revealed', { type: clue.clueType, tier: offeredTiers[n], source });
      return next;
    });
  }
```

- [ ] **Step 2: Run the full test suite (no regressions)**

Run: `npx vitest run`
Expected: all pass (existing suites don't render ClueCard with a live provider; `track` no-ops).

- [ ] **Step 3: Commit**

```bash
git add src/components/ClueCard.tsx
git commit -m "feat: instrument clue solves, hint reveals and give-ups"
```

---

### Task 4: Instrument LessonPage and SolvePage

**Files:**
- Modify: `src/pages/LessonPage.tsx`
- Modify: `src/pages/SolvePage.tsx`

- [ ] **Step 1: lesson_view on LessonPage**

Add imports:

```ts
import { useEffect, useMemo } from 'react';
import { track } from '../analytics';
```

Inside the component, after `const { lesson, stage } = found;` won't work for hooks order — place the effect ABOVE the `if (!found)` early return, keyed on the id:

```ts
  useEffect(() => {
    if (found) track('lesson_view', { lesson: found.lesson.id, stage: found.stage });
  }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps
```

- [ ] **Step 2: puzzle_start / puzzle_complete on SolvePage**

Add import: `import { track } from '../analytics';`

In the existing `useEffect` that loads the puzzle (around line 21), after the puzzle is set, add:

```ts
    track('puzzle_start', { puzzle: String(id) });
```

At the existing completion site (around line 101, where `markCompleted(puzzle.id)` is called) add alongside it:

```ts
    track('puzzle_complete', { puzzle: puzzle.id });
```

- [ ] **Step 3: Run tests + typecheck**

Run: `npx vitest run && npm run typecheck`
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add src/pages/LessonPage.tsx src/pages/SolvePage.tsx
git commit -m "feat: lesson and puzzle lifecycle events"
```

---

### Task 5: Honest copy

**Files:**
- Modify: `src/pages/HomePage.tsx:116`
- Modify: `src/pages/AboutPage.tsx:66`

- [ ] **Step 1: Update the claims**

HomePage line 116 currently reads: `Free, open-source, and fully in your browser — no account, nothing sent to a server.`
Replace the claim with:

```
Free and open-source — no account, your progress stays in your browser. We count anonymous usage (privacy-friendly, no cookies, nothing personal).
```

AboutPage line 66 region currently says progress is stored locally with no account. Append one sentence:

```
We collect anonymous, cookie-less usage counts (which lessons and puzzles get played) to decide what to build next — never anything personal.
```

- [ ] **Step 2: Build, eyeball, commit**

```bash
npm run build
git add src/pages/HomePage.tsx src/pages/AboutPage.tsx
git commit -m "docs: honest analytics copy on Home and About"
```

---

### Task 6: Ship

- [ ] **Step 1: Full gate**

Run: `npm test && npm run build`
Expected: all green.

- [ ] **Step 2: Update PRODUCTIONPLAN.md** — mark priority #2 (Analytics) done in the changelog, note the owner action (paste Umami id into `.env`, rebuild).

- [ ] **Step 3: Commit and push to main (deploys via Pages CI)**

```bash
git add PRODUCTIONPLAN.md
git commit -m "feat: privacy-first analytics (dark until Umami id added)"
git push origin main
```

- [ ] **Step 4: Owner action** — sign up at cloud.umami.is, paste the Website ID into `.env`, push the one-line change. Events start flowing on the next deploy.
