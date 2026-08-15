# Daily-First Phase 1 Implementation Plan (frontend only)

> **For agentic workers:** Executed inline by the authoring session. Steps use checkbox syntax.
> Spec: `docs/superpowers/specs/2026-08-15-daily-first-ux-design.md` (§1–3, §5).

**Goal:** One language system, state-aware Home, post-solve loop with two bridges, site-wide
streak chip, dead-end fixes. Pure frontend; accounts are Phase 2.

**Architecture:** Two small new logic modules (`src/engine/weakest.ts` for weakest-device →
lesson resolution; `src/state/surprise.ts` for the shared random-puzzle picker), one new
component (`StreakChip`), edits to HomePage/DailyPage/PuzzlePage/App, and a source-level
banned-terms test enforcing the glossary.

---

### Task 1: Glossary + banned-terms test
- Create `docs/ux-language.md` (the §1 table).
- Test `src/ux-language.test.ts`: scan `src/pages/**/*.tsx` + `src/components/**/*.tsx` sources
  for banned strings: `Today’s clue`, `Today's clue`, `Daily Clue`, `daily cryptic` (case-insens.,
  excluding `Graduation Cryptic`). Watch it FAIL (HomePage + DailyPage currently violate), fix
  in Tasks 2–3, then it gates forever.

### Task 2: Language sweep
- `DailyPage`: h1 `Daily #{n}`; share text keeps `Cruci Daily #N` (allowed: "Daily" is the noun).
- `HomePage`: CTA → `Solve today’s Daily →`.
- Grep for any other banned-term hits and fix.

### Task 3: Weakest-device helper
- `src/engine/weakest.ts`: `weakestDevice(state): ClueType` — lowest `stageRank` (ties: fewest
  `solvedNoHint`); `lessonForDevice(type): string | undefined` — find the Stage-A lesson id whose
  `clueType` matches (curriculum lookup). Unit tests: fresh state → first device; a progressed
  state → the lagging one; every teachable device resolves to a real lesson id.

### Task 4: Shared surprise picker
- `src/state/surprise.ts`: `async surpriseTarget(): Promise<string | null>` — loads archive meta
  (cached loader), filters unsolved (any tier, mini first if none solved yet), random pick,
  returns puzzle id. Refactor PlayPage's inline `surpriseMe` to use it (same behavior incl.
  tier/band filter when on PlayPage — pass an optional pre-filtered pool).

### Task 5: Post-solve loop on DailyPage
- Replace the solved-state block: streak line + Share (existing) + two bridges:
  `Sharpen your weakest device →` → `/lesson/<lessonForDevice(weakestDevice(state))>` (with the
  device name in the label, e.g. "Sharpen your anagrams →");
  `One more puzzle →` → `surpriseTarget()` then navigate.

### Task 6: Streak chip
- `src/components/StreakChip.tsx`: reads `loadDaily()`; renders `🔥 n` pill linking to `/daily`
  when streak ≥ 1; re-reads on route change (App passes `location.pathname` as key or effect dep).
- Mount in App topbar between nav and ThemeToggle. CSS in `cruci-app.css` (pill, `--accent` text,
  40px min touch target).

### Task 7: State-aware Home
- `HomePage`: `const returning = daily history non-empty || any solved clue/puzzle`.
- Returning: compact hero (brand line only), then a **Daily card**: if unsolved today —
  "Daily #N is up" + `Solve today’s Daily →`; if solved — result line (hints used), streak,
  "Come back tomorrow", and the same two bridges as Task 5 (shared little component
  `DailyBridges` to avoid duplication).
- First visit: unchanged hero + `Solve today’s Daily →` CTA.

### Task 8: Dead-end fixes
- `PuzzlePage` (graduation grid): breadcrumb `← Learn`, footer "what next" (→ Daily, → Play).
- `AnalyzerPage`, `ReferencePage`: small footer affordance back to the ritual (→ today's Daily).
- Audit every route for a terminal affordance.

### Task 9: Gate
- `npm run typecheck && npm test && npm run build`; browser pass at 375px + 1280px (Home first
  visit vs returning, Daily solved flow, chip, bridges); commit; push; watch deploy.
