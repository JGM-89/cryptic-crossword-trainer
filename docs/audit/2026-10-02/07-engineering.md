# 07 — Engineering audit (Cruci)

Audited 2026-10-02 at `6b1e2b4`. Stack: Vite 5.4, React 18.3, TS 5.9, react-router-dom 6.30 with HashRouter, vitest 2.1, idb 8. About 9.2k lines of source and scripts, 126 tracked files.

**Verified:** `npm test` passes: 18 files and 106 tests in 4.7s, with 20 `act(...)` warnings from `ProgressProvider`. `npm run build` passes, including `tsc -b`. It produces one JS chunk of **415 KB, 120 KB gzipped**, plus 36 KB of CSS (7.8 KB gzipped). No tracked files were changed.

---

## 1. Architecture and boundaries

**Data layer.** Ten `bank/part-*.json` files (415 clues) are imported statically. They pass through `toRawClue` and then `hydrateClue` to build `BANK`, and `registry.ts` merges that with the teaching corpus into `ALL_CLUES`. All of this runs at module evaluation, on the main thread, before first paint. `locateDefinition` *throws* on bad data, and with no error boundary that would be a white screen. Tests guard the data today, but nothing guards it at runtime.

The split is sound in principle: authored JSON, a pure hydrator, and validators that run in tests. The weak spot is `public/archive.json`. Its 250 puzzles and 4,176 entries each **embed the full bank entry verbatim** (clue, def, wordplay, parse). `archive.test.ts` asserts zero drift, and I confirmed zero drift. So the file is 1.84 MB of duplicated data that could be `[answer, number, dir, row, col]` tuples hydrated from `BANK`.

**State: three stores with three naming schemes and no shared abstraction.**

| Store | Key | Shape | Written from |
|---|---|---|---|
| IndexedDB `cryptic-trainer/progress` (localStorage fallback) | `state` | `ProgressState`: competence, solvedClues, completedPuzzles | `ProgressContext` |
| localStorage | `cct:daily:v1` | streak, best, lastDate, history, archive | `dailyProgress.ts` |
| localStorage | `cct:play:completed`, `cct:play:fill:<id>` | id array, grid fill | `playProgress.ts`, **and directly from `MiniGrid`** |
| localStorage | `cruci-color-mode` | theme | `ThemeToggle`, inline script |

**Readiness for accounts and sync (Supabase).** This is the main architectural risk.
- **Competence is not mergeable.** `CompetenceRecord` is an order-dependent state machine (`streak`, `stage`, counters). Two devices cannot be merged into a correct stage without the event history, and none is kept. Fix: keep an append-only solve log of `{clueId, ts, hintsUsed, revealed, source}` and derive competence from it.
- **Streak, best and lastDate are stored, not derived.** The plan says "streak recomputed honestly from merged history". That is possible from `history`, but the stored values will disagree after a merge. Derive them everywhere.
- **Daily results don't record which clue was played.** They are keyed only by date. `generate-daily.mjs` notes that regenerating the schedule reshuffles which clue falls on which date. Results, archive rows and shared `/daily/N` links would then silently point at a different clue. Store `clueId` (or the answer) in `DailyResult`.
- **One Daily solve is written to two stores** (IndexedDB competence and localStorage daily). There is no transaction, so a partial failure leaves them inconsistent.
- **Startup race.** A solve made before `loadProgress()` resolves is overwritten by the hydrate `setState(s)`.
- **Missing sync plumbing.** No `updatedAt`, device id or per-record versions. Whole-blob writes on every change. Only `ProgressState` has a `version` and a migration.

**Recommendation:** put one `storage/` repository (a `get/put/subscribe` interface) in front of all four stores before writing any sync code. Supabase then becomes another adapter.

## 2. Code quality

Overall the code is clean, strict TypeScript with no `any`, about 15 `as` casts, and good comments. Components are reasonably sized; the largest is `MiniGrid` at 403 lines.

**Bugs found:**
1. **Stale closure in `PuzzlePage.handleEntrySolved`.** It reads `revealedEntries` from the render closure, but `MiniGrid.revealActive` calls `onReveal()` and then `onEntrySolved()` in the same tick. Revealed entries are therefore recorded as `usedHint: false`, as clean solves, and **advance competence stages**. Fix: pass a `revealed` flag through `onEntrySolved(entry, {revealed})`.
2. **Archive fetch failures are sticky.** In `archive.ts`, `inflight` caches a *rejected* promise. After one network blip, Play, Solve and Surprise stay broken until a full reload. On top of that, `SolvePage`'s `getArchivePuzzle().then` has no `.catch`, so it shows "Loading puzzle…" forever, and `DailyBridges.onePuzzle` rejects unhandled.
3. **Stale streak display.** `StreakChip`, `HomePage` and `DailyPage` show the stored `streak` even when `lastDate` is older than yesterday. A lapsed user keeps seeing "🔥 5" until their next solve.
4. **`MiniGrid` autosave effects.** The restore effect sets `hydratedRef = true` before the restored fill has rendered, so the persist effect immediately writes `{fill:{}}`. In production this is only a transient overwrite. In dev under StrictMode's double-invoked effects, the second restore reads that empty write and the saved fill is lost. Fix: use a lazy `useState(() => read(storageKey))` initializer and drop the two-effect dance.
5. **Hard-coded values that will drift.** `isLessonComplete` hard-codes `'daily-001'`. `HomePage` hard-codes "250 puzzles", and `PRODUCTIONPLAN` already says 300. `SITE` in `DailyPage` and the OG URLs in `index.html` hard-code the github.io origin, which will matter at the domain cutover.

**Other issues:**
- **Duplication.**
  - The `lettersOnly` regex is reimplemented in 8 files.
  - `SolvePage` and `PuzzlePage` duplicate the solved/revealed/complete wiring.
  - `ClueCard` and `DailyClueCard` duplicate the highlight logic.
  - `ClueCard`'s `source: 'daily'` is now dead, since the Daily uses `DailyClueCard`.
- **Linting.** Three `eslint-disable-line react-hooks/exhaustive-deps` comments exist, but **ESLint isn't installed**, so nothing enforces hooks rules.
- **Effect re-runs.** `PuzzleComplete`'s effect depends on an inline `onClose`. It re-runs, refocusing and restoring focus, on every parent render while open.

**Accessibility.** The basics are good: an aria-live grid status, focus moved to `h1` on navigation, reduced-motion handling, and the hidden-input trick for mobile keyboards. Gaps:
- `role="grid"` cells sit outside `role="row"` (invalid ARIA structure), and cells aren't focusable.
- The More nav uses `role="menu"` and `menuitem` without arrow-key support. Use a plain disclosure.
- The modal has `aria-modal` but no focus trap.
- `HintMenu` doesn't move focus into itself, so Escape only works if the user tabs in.

## 3. Performance

- **Main chunk: 120 KB gzipped, no code splitting.** All 12 routes are imported eagerly. The bank JSON is about **166 KB minified / 35 KB gzipped (~30%)** of that chunk. `clues.ts`, the reference data and the Analyzer ship to every Daily visitor. Acceptable on 4G; about 1–1.5 s of parse plus hydrate on a low-end Android.
  - Quick wins: `React.lazy` for Play/Solve/Analyzer/Reference/Learn.
  - Later: keep only the Daily path (schedule plus one clue) in the entry chunk.
- **`archive.json` is not bundled. It is fetched lazily, but in full.** It is **1.84 MB raw, 276 KB gzipped**, and it is downloaded just to *list* tiles on `/play`, to pick a Surprise, or to open one puzzle. A slim tuple format measured **101 KB raw / 23 KB gzipped (12× smaller)**. Splitting further into `archive-meta.json` plus per-puzzle files would make a puzzle open in about 1 KB.
- **Caching.** GitHub Pages sends `max-age=600` on everything, and `archive.json` has no content hash, so it is re-validated every 10 minutes and can never be cached as immutable. Import it through Vite (`?url`) to get a hashed name.
- **PWA.** There is a manifest but **no service worker**: no offline support, and no fast repeat loads on flaky mobile. The manifest also has issues:
  - `theme_color` `#275140` disagrees with the meta tag's `#f4ece0`.
  - `"any maskable"` combined on one icon is discouraged.
  - Fix: `vite-plugin-pwa` (precache the shell, stale-while-revalidate for the archive). HashRouter makes navigation fallback trivial.

## 4. Testing and CI

**Covered well:** data integrity and fairness, par, Daily date math (fixed dates and a 500-day round-trip), the daily streak and archive store, the fading engine, hydration, the analytics no-op, onboarding, `DailyClueCard`, and Daily archive routing (with a faked `Date`).

**Not covered:**
- `MiniGrid`: building, typing, check, reveal, autosave. This is the biggest UI surface.
- `SolvePage`, `PlayPage` and `PuzzlePage`. Bug #1 above would have been caught here.
- `persistence.ts`: the IndexedDB → localStorage fallback (`fake-indexeddb` would cover it).
- `ProgressContext`: the load race.
- The `archive.ts` fetch and error paths, `StreakChip`, `ThemeToggle`, and the PWA.
- There are no end-to-end tests (no Playwright).

**Flakiness.** `onboarding.test.tsx` uses the real clock (`dateKey()` in both the test and the component), so it can flake only across midnight. The rest is deterministic. The 20 `act` warnings come from the async `loadProgress`; a `findBy`/`waitFor` on `loaded` would silence them.

**CI gates.** CI runs only on push to `main` (test, then build, then deploy), so there is no PR gate. It has no lint, no `npm audit`, and no coverage. `scripts/*.ts` aren't type-checked, because `tsconfig.node.json` only includes `vite.config.ts`.

## 5. Ops

**Dependencies.**
- Current versions: React 18.3 (latest 19.3), Vite 5.4 (8.3), vitest 2.1 (5.0), react-router 6.30 (7.18), TypeScript 5.9 (7.0), jsdom 25 (29), `@vitejs/plugin-react` 4 (6).
- `npm audit` reports 12 issues, one of them critical. All are dev-only (vitest, vite, esbuild, postcss) **except react-router 6.30.4's open-redirect advisories**. That one is low exposure here, but `npm update react-router-dom` to 6.30.6 fixes it for free.
- React 19 migration note: `AnswerStrip`'s `ref={(el) => (refs.current[i] = el)}` returns a value, which React 19 types reject. Wrap it in braces.

**CI runtime and actions.**
- Node 24 in CI is right.
- `actions/checkout@v4` and `setup-node@v4` run on the Node 20 action runtime. Bump them to v5. Also bump `upload-pages-artifact` to v4.
- **Ubuntu runner migration (19 Oct 2026):** the build is pure Node with no native toolchain, so the risk is low. Pin `runs-on: ubuntu-24.04` for now and move deliberately. One caveat: the lockfile is generated on Windows. When upgrading to Vite 7/8 (Rolldown native bindings), check that `npm ci` on Linux resolves the optional platform packages.

**Security headers.** GitHub Pages can't set headers, so there is no CSP, no frame-ancestors and no Permissions-Policy. A `<meta http-equiv="Content-Security-Policy">` is still possible: `script-src 'self' https://cloud.umami.is 'sha256-<theme script>'` plus the Umami `connect-src`. `.env` is **tracked**. Today it holds only the public Umami id, but a Supabase key going into the same file is a habit risk. Commit `.env.production` with public values only and ignore `.env`.

**SEO and sharing.** HashRouter means crawlers see one URL. Every shared `/#/daily/N` unfurls with the same generic OG card. There is no `robots.txt` and no `sitemap.xml`. The planned domain plus BrowserRouter cutover should move to Cloudflare Pages or Netlify, which bring SPA fallback, `_headers` (real CSP and HSTS) and pre-rendered `/daily/N` pages with per-Daily OG titles and images. Doing that through GitHub Pages' `404.html` workaround would be a hack.

## 6. Prioritised recommendations

| # | Item | Impact | Effort |
|---|---|---|---|
| 1 | Fix the stale-closure revealed→clean-solve bug (#1) and the sticky archive rejection, adding `.catch` and retry UI (#2) | High (correctness) | S |
| 2 | Derive streak from history everywhere; show 0 when lapsed (#3) | High (trust) | S |
| 3 | Add `clueId` to `DailyResult` now, before any more data accrues | High (sync and data integrity) | S |
| 4 | Slim `archive.json` to answer refs, split meta from puzzles, hash the filename | High (mobile Play load, −250 KB gzipped) | M |
| 5 | **Storage repository plus a solve event log; derive competence and streaks.** Prerequisite for Supabase; turns merging into a union of events | High (accounts blocker) | M–L |
| 6 | PWA: `vite-plugin-pwa`, fix the manifest. Prerequisite for app-store wrapping and offline Daily | High (app blocker) | S–M |
| 7 | Centralise `SITE_ORIGIN` and `BASE`; remove `'daily-001'` and "250" literals | Medium (domain and Capacitor cutover) | S |
| 8 | CI: PR workflow, ESLint with the hooks plugin, `npm audit --omit=dev`, actions v5, pin the runner | Medium | S |
| 9 | Tests: `MiniGrid`/`SolvePage` with RTL, persistence with `fake-indexeddb`, one Playwright smoke test (Daily solve, Play solve) | Medium | M |
| 10 | Route-level `React.lazy`; error boundary around `<Routes>` | Medium | S |
| 11 | Upgrades: react-router 6.30.6 now; then React 19 + RR 7 + Vite 7/8 + vitest 3+ as one branch | Medium (security, longevity) | M |
| 12 | A11y: grid rows, disclosure nav, modal focus trap, focus into HintMenu | Medium | S–M |
| 13 | Hosting move with the domain: BrowserRouter, CSP headers, pre-rendered OG per Daily, sitemap | Medium–High (growth) | M |

**Blocking an app (PWA or Capacitor):** #6, #7 (`base` must become `./` and share URLs must not assume github.io), and #2 (offline fetch failures must recover). On iOS, WKWebView storage can be evicted, so persist critical progress through Capacitor Preferences behind the #5 repository.

**Blocking accounts:** #3 and #5. Merging today's stored counters and streaks cannot be made correct after the fact. Start logging events now so history exists when sync ships.
