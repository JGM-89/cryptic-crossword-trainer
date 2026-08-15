# Daily-First UX Overhaul — Design

**Approved:** 2026-08-15 (owner). **Goal:** make the website good enough to justify spending money
on a domain and app — reorganized around the **daily-ritual player** (the chosen primary user),
with one language system, no dead-end flows, and optional accounts that sync the streak.

## Product decisions (locked)

- **Primary user:** the daily-ritual player. When flows conflict, the ritual wins. Learn and Play
  are satellites that feed the ritual (Learn = get better at the Daily; Play = more of what the
  Daily gives you).
- **Accounts:** optional sign-in to sync, local-first. Anonymous play keeps working forever;
  signing in backs up progress/streaks and syncs across devices. Supabase free tier (no server,
  £0). Ships dark until the owner creates the Supabase project and adds public keys to `.env`
  (same pattern as the Umami launch).
- **Quality gate:** a structured heuristic review (by Claude, in-browser, mobile + desktop,
  against the checklist in this spec) before any money is spent. Known limitation: it cannot
  fully substitute for a stranger using the site.

## 1. Language system

One name per concept, used verbatim in nav, CTAs, headings, share text, and copy:

| Concept | The word | Never |
|---|---|---|
| The one-clue-a-day ritual | **the Daily** (page title: `Daily #N`) | "Today's clue", "Daily Clue", "daily cryptic" |
| A teaching unit | **Lesson** | "course step" |
| A full crossword | **Puzzle** (the hand-built one: **Graduation Cryptic №1**) | "grid" as a noun in UI copy |
| A wordplay type | **Device** | "clue type" in learner-facing copy (hint ladder rung 2 may keep "clue type" — it is taught there) |
| Consecutive days solved | **Streak** | "run", "chain" |

Enforcement: this table lives in `docs/clue-style.md`'s sibling `docs/ux-language.md`; new UI copy
is checked against it.

## 2. State-aware Home

- **First visit** (no local progress, no daily history): current marketing hero unchanged —
  it's good. Primary CTA: "Solve today's Daily →".
- **Returning** (any local progress or daily history): the hero collapses to a compact brand
  statement; the top of the page becomes a **Daily card**: unsolved → clue teaser ("Daily #N is
  up") + big CTA; solved → result (hints used), streak, "come back tomorrow", and the two bridges
  (§3). Below: the existing stats row and section cards.
- Detection: pure local reads (`loadDaily()`, progress store) — no accounts needed.

## 3. The post-solve loop (kill the dead end)

After solving the Daily (on `/daily`, and mirrored on the returning-user Home):
1. Streak celebration line + share button (existing).
2. **Exactly two onward paths:**
   - "Sharpen your weakest device →" — links to the Learn lesson for the device with the lowest
     competence stage (from the existing `progress`/`fading` engine).
   - "One more puzzle →" — Play's surprise-me (random unsolved, tier-appropriate).
3. **Streak chip** in the topbar (🔥 n), visible site-wide once streak ≥ 1, linking to `/daily`.

## 4. Accounts = streak insurance (optional, local-first)

- **Provider:** Supabase (auth: magic link + Google OAuth; Postgres for state). Public URL +
  anon key in committed `.env` (they are public-by-design, like the Umami id); ships dark —
  all account UI hidden until keys are configured.
- **What syncs:** the three local stores as one document per user: competence/progress state
  (IndexedDB), daily history + streak (localStorage), play completion (localStorage).
- **Model:** local-first. The device state is authoritative during play; sync is a background
  push-on-change plus a pull-on-login. **Merge policy** (first login on a second device):
  union of solved clues/puzzles/daily history; per-device competence records merged by taking
  the further-progressed stage; streak recomputed from the merged daily-history dates (not
  max'd blindly — it must stay honest).
- **UI:** one "Sync" entry point (topbar, subtle) → sheet with magic-link email field + Google
  button + honest copy: "Don't lose your streak — sync it across devices. Optional; everything
  works without it."
- **Privacy copy** on About updated (account email stored by Supabase EU; still no analytics PII).
- **Non-goals for v1:** no profiles, no leaderboards, no paid tier, no cross-user features.

## 5. Flow fixes

- First visit → solving the Daily in ≤ 2 interactions (Home CTA → Daily).
- `/puzzle/daily-001` (Graduation Cryptic) gets breadcrumb back to Learn and a "what next"
  footer (→ Daily, → Play).
- Every page ends with a "what next" affordance; no silent dead ends (audit list in the plan).
- Analyzer/Reference remain in "More" (mobile) / right side of nav (desktop) — reachable, out of
  the ritual's way.

## 6. Exit gate — heuristic review checklist

Run in a real browser, 375px and 1280px, light + dark, fresh profile and returning profile:
1. First visit: is the promise clear in 5 seconds? Can I reach today's Daily in ≤ 2 interactions?
2. Day-2 return: does Home reflect my state? Is the streak visible? Is tomorrow's pull obvious?
3. Post-solve: do the two bridges work and make sense for my competence state?
4. New device + sign-in: does sync restore streak/progress? Does the merge behave per §4?
5. Language: grep-level check that banned terms (§1) appear nowhere in UI copy.
6. No dead ends: every route ends in an affordance.
7. A11y spot-checks: focus order on Home card and sync sheet; touch targets ≥ 40px; contrast on
   the streak chip.

Failures get fixed before the gate closes. Then the domain/app spending decision reopens.

## Build order

Phase 1 (pure frontend, ships first): language system + state-aware Home + post-solve loop +
streak chip + flow fixes. Phase 2: Supabase accounts/sync (dark launch). Phase 3: the review gate.
