# 04 — Product strategy audit: Cruci

**Date:** 2026-10-02 · **Scope:** market, focus, sequencing, web vs app, risks, and a 4–8 week plan.
**Inputs:** PRODUCTIONPLAN.md, README.md, both specs in `docs/superpowers/specs/`, `src/pages/*`,
`docs/clue-pipeline.md`, the clue-writer skill, and web research (sources at the end).

## Bottom line

Cruci is a well-made product that no one has seen. Its two main features, a par-scored Daily and a
course whose help fades as you improve, are now standard in a crowded 2026 field, and the Daily is
openly "modelled on Minute Cryptic". Every quality signal so far comes from Claude judging Claude's
clues. Not one stranger has ever solved a Cruci clue. The plan's next step, accounts, solves a sync
problem for users who don't exist. **Change the order. Fix the AI disclosure, cut the product back to
the Daily plus Learn, run a blind test of the clues with real solvers, and get 100 real Daily
solvers before building anything else.** Quality-first is still the right instinct, but quality has
to be measured by solvers, not by more internal gates.

---

## 1. Market: who else does this, and what is actually different

| Product | What it offers | Note for Cruci |
|---|---|---|
| **Minute Cryptic** | Free handcrafted daily clue with a video explainer; hints or letter reveals; beginner courses; members pay $9/mo or $90/yr for the archive, weekly mini crosswords, a clue builder and the community. Around 100k solvers and about 263k Instagram followers. New app shipped July 2026. | The category leader. Its moat is a founder's personality and social video. Cruci copies its mechanics and has none of its distribution. |
| **CrypticCrab** (Mar 2026) | Teach → Guided → Assisted → Solo phases, a daily clue, an archive, 4 difficulty tiers, duels. $3.99/mo or $69.99 lifetime. | Its four phases are almost the same as Cruci's A–D fading stages. "Fading scaffolding" is no longer unique. |
| **Wordplay** (early 2026) | A daily clue with progressive hints. Free, with no ads and no account. | Matches Cruci's "free, private, no account" pitch exactly. |
| **Daily Cryptic – Solve & Learn**, **Learn Cryptic Crosswords** (since 2017), **cripptic.com** | Daily clue with explanations, or a lesson curriculum. | Learn-to-solve content is a commodity. |
| **Foolscap** (Jul 2026) | Daily ladder of 5–7 clues, "composed on-device" (machine-made), checked before display. $59.99/yr. | Closest to Cruci's machine-authoring premise. It doesn't say clues are machine-made either. |
| **Guardian Puzzles / Times Puzzles** | £3.49/mo or £4/mo. Quiptic, weekly beginner cryptic, Quick Cryptic. The Guardian's web crosswords are free. | The "graduate to" destination. Cruci's auto-built 13×13s can't compete with free, human-set broadsheet puzzles. |

**What is actually different about Cruci?** Not the Daily, not par, not the archive (Minute Cryptic
has all three), and not fading (CrypticCrab has it). Two things are real:

1. **Every clue has a structured, machine-checked parse.** That parse powers hints, the Analyzer
   and "show the wordplay" from data. Competitors use a video or hand-written prose. This helps the
   product, but nobody chooses an app because of it.
2. **Supply that can grow.** Human-written dailies are limited to one clue a day. A writer that
   reliably produces fair clues can offer **unlimited practice aimed at the device you're weakest
   at**, such as "20 container clues at your level". This is the one thing Minute Cryptic
   structurally can't match. It is also the only place where "AI-written" helps.

**Is AI an asset or a liability?** With solvers, it's a liability. The cryptic world is a craft
culture with famous named setters, and its leader sells "handcrafted". As an engineering story, for
example on Hacker News, it's an asset. Disclosure has an urgent problem today: **the site says the
opposite of the truth.** Home shows "Hand-clued teaching clues", Play says "hand-clued answers" and
"hand-crafted", About says "originally authored", and the README says "hand-clued bank". Clues are in
fact written by Claude through the clue-writer skill. If anyone notices on Reddit, the project's
credibility is gone for good. Proposed wording for About and the Daily footer:

> *"Cruci's clues are written with AI under a published rulebook, checked letter-by-letter by a fairness validator, judged blind, and read by a human editor before they ship. Spot a bad one? Tell us."*

Then add a one-tap **"Flag this clue"** button. Being open about AI only helps if you visibly act on
what readers report.

## 2. Focus: too many surfaces for zero users

The Home page offers five things: the Daily, Learn, Play, Analyzer and Reference. The Aug-2026 spec
already picked the daily-ritual player as the primary user. The site should follow through:

- **Double down: the Daily.** It's the habit loop, it's shareable, and it's the cheapest thing to
  test. Clue supply is already fine: 416 bank clues at one a day lasts until about August 2027.
- **Keep: Learn, reframed as "get to par".** It's what feeds the Daily, and it's the natural home
  for the device-drill wedge later.
- **Merge: Analyzer and Reference into Learn** as an appendix. Drop them from Home's "Four ways in".
  Being reachable from a "More" menu is enough.
- **Freeze: Play.** Large grids compiled from a 416-word bank (top answer still appears in 18% of
  puzzles) are the weakest thing on the site, and they compete with free Guardian puzzles. Keep the
  minis and the showcase. Stop spending on corpus growth and repetition fixes. After Stage D, point
  learners outward, for example: "You're ready for the Guardian Quiptic." That's honest and
  generous, and it costs nothing.
- **Pause: accounts / Supabase sync** (see §3).

## 3. Sequencing

The committed order is Clue Writer ✔ → accounts → quality gate → distribution. Three problems:

- **Accounts before users is backwards.** Sync is for users who come back on two devices. Today
  there are zero users, so it's pure carrying cost: auth, a merge policy, privacy copy, and a
  Supabase project to keep alive.
- **The quality gate checks the wrong thing.** Spec §6 is Claude reviewing the UI, and the spec
  itself admits it "cannot fully substitute for a stranger using the site". Clue quality is gated
  only by LLM judges: realism, panel and par judges are all models. Over 80 commits and hundreds of
  `tmp/` judging files show huge internal effort, with no outside check at all.
- **"Quality before distribution" mixes up two kinds of distribution.** The *big, one-time* launches
  (Show HN, a top r/crosswords post) deserve a polished product. *Small, reversible* distribution,
  like 10–30 solvers from your own network, a Discord, or a "feedback wanted" post, is how quality
  gets measured in the first place. Putting all distribution off until quality passes means quality
  is never measured.

**Cheapest credible path to 100 real users (£0):**
1. A **blind clue test** with 5–10 people who actually solve cryptics. Mix 30 Cruci clues with 30
   published easy clues (Quick Cryptic or Quiptic level), shown privately with sources hidden, and
   have them rate fairness and surface quality 1–5. This is the real quality gate.
2. **Private soft launch:** friends who solve cryptics, a work Slack, a crossword Discord. 20–40
   people.
3. **One honest community post**, with AI disclosed and feedback asked for. Check r/crypticcrosswords
   and r/crosswords rules on self-promotion and AI content first.
4. Hold back Show HN for the "AI that writes fair cryptics, with a validator" story once the numbers
   back it up. That audience will engage with the engineering.

## 4. Website vs app

- **Now: a real PWA.** `manifest.webmanifest` exists, but there's no service worker, so no offline
  play and a weaker install prompt. Add `vite-plugin-pwa`: about an hour of work, £0. It's the
  "app" for the next two months.
- **The domain** (~£15/yr) is cheap and reversible. It isn't worth blocking on, and it isn't urgent
  either; the github.io URL is fine for the first 100 users. Buy it when you're ready for the big
  launch, at the same time as the BrowserRouter/sitemap change.
- **Native (Capacitor wrapper of the same code), only when retention data says so.** A daily-ritual
  product lives on reminders, and on iOS, web push only works after the user adds the site to their
  Home Screen. That's the real reason to go native, and it only matters once people come back by
  themselves. Costs: Apple $99/yr, Google $25 one-off. Google also requires new personal developer
  accounts to run a closed test before publishing (currently around 12 testers for 14 days; check
  the current rule). The soft-launch group can double as those testers.

## 5. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **AI disclosure mismatch** ("hand-clued" copy) | **High.** Reputational, and permanent once seen | Fix the copy before anyone else sees the site (§1). |
| **Originality / near-copies of published clues.** Models can reproduce famous clues. The current check is a manual web search on "stock-looking" surfaces | Medium. Single clues carry little copyright risk, but a plagiarism accusation would hurt badly | Run all ~460 surfaces through a fuzzy-match against George Ho's dataset (already used as a build-time reference) as an automatic CI-style gate. |
| **Name.** "Cruci" is everyday Italian shorthand for *cruciverba* (crossword); iCruciPuzzle and Cruciverb.com exist; "crucible" swamps search results; pronunciation is unclear (*kroo-see* or *kroo-chee*) | Low–medium | Before buying `cruci.app`, do a free UKIPO/EUIPO/USPTO knockout search in classes 9/41. Don't rename now. |
| **Authoring cost / scalability.** Each clue goes through several agent rounds, and the owner reads every one | Low for the Daily (7/week), **high** for the unlimited-drills wedge | For bulk drills, have the owner read a random sample instead of every clue, and rely on the "Flag this clue" signal. |
| **Clone positioning.** The par Daily is openly copied from Minute Cryptic | Medium | Never market as "like Minute Cryptic". Pitch "unlimited practice at your weakest device" and "free, no ads, no account". |
| **Motivation.** Four months of intense craft work, no audience, and a launch that might land quietly | **High** for a solo hobby | Set kill/continue criteria now, while it's calm (§6). Effort spent on users beats effort spent polishing. |
| **Goal mismatch.** The goal says "writes great cryptic *crosswords*", but the system writes *clues* for a fixed bank and assembles grids from them | Medium | Choose one: clue supply (Daily and drills, achievable) or fresh human-quality grids (a much harder, separate research problem). The Daily-first strategy implies clues. |

## 6. Recommended strategy: next 4–8 weeks

**Theme:** stop building new things, check the clues with real solvers, and find out whether anyone
comes back.

| Week | Milestone | Done when |
|---|---|---|
| **1** | **Honesty + instruments.** Fix all "hand-clued" / "originally authored" copy and add the AI disclosure. Add "Flag this clue" and a 1–5 "How was this clue?" on the Daily result (Umami events) plus a 3-question feedback link. Cut Home down to the Daily + Learn. Freeze Play and accounts. Add a service worker. | Shipped; no banned claims left (grep). |
| **2** | **Blind clue test** with 5–10 cryptic solvers (§3). Run the automatic originality fuzzy-match. | Mean Cruci rating within 0.5 of the published-clue control, and ≤10% of Cruci clues called "unfair". |
| **3–4** | **Private soft launch** to 20–40 solvers, then one honest community post. Read every piece of feedback, fix every flagged clue within 48h, and post a weekly changelog. | ≥50 people have solved at least one Daily. |
| **5–6** | **Run the Daily, change nothing big.** Each week check: Daily solvers, return rate, share rate, flags, average score vs par (this also starts calibrating par). | ≥100 Daily solvers in total. |
| **7–8** | **Decision.** | Use the criteria below. |

**Continue and invest** (domain, Show HN, then a native wrapper, then accounts) if **all** of these
hold:
- ≥100 people solved at least one Daily.
- ≥20% of them solved on 3+ separate days within 14 days.
- Clue flag rate below 5% of solves.
- At least 3 unprompted positive comments or shares.

**Pivot** if solvers rate the clues well but don't come back. That means the clues are the asset
and the Daily habit isn't. Test the **device-drill gym** ("practise containers until you're at
par"), or offer the clues elsewhere: a newsletter, clue packs, or a feed for other apps.

**Kill or go to hobby mode** in either case:
- The blind test clearly fails: Cruci clues rated more than 1 point below the control, or more than
  20% called unfair.
- Fewer than 30 solvers after three channels.

In hobby mode, stop product work, keep the site up as a portfolio and personal craft project, and
spend no money.

**Explicitly not doing in this window:** accounts or sync, corpus growth, 13×13 repetition work, a
native app, paid features, or a rename.

---

### Sources
- [Minute Cryptic (App Store)](https://apps.apple.com/app/id6735268899) · [Minute Cryptic new app listing](https://mwm.ai/apps/minute-cryptic-new/6751253828) · [Minute Cryptic membership explained (TechWiser)](https://techwiser.com/minute-cryptic-membership-explained/) · [PA Training: Cracking the Code](https://pa-training.shorthandstories.com/cracking-the-code) · [The Senior: Minute Cryptic guide](https://www.thesenior.com.au/story/9062507/unlock-cryptic-crosswords-with-minute-cryptic-guide/)
- [CrypticCrab (App Store)](https://apps.apple.com/app/id6759689690) · [Wordplay (SaaSHub)](https://www.saashub.com/wordplay) · [Daily Cryptic – Solve & Learn](https://mwm.ai/apps/daily-cryptic-solve-learn/6760104076) · [Learn Cryptic Crosswords (App Store)](https://apps.apple.com/gb/app/learn-cryptic-crosswords/id1281120570) · [cripptic.com](https://www.cripptic.com/) · [Foolscap: Daily Cryptic (App Store)](https://apps.apple.com/mk/app/id6785649689)
- [Guardian Puzzles app launch (InPublishing)](https://inpublishing.co.uk/articles/the-guardian-launches-puzzles-app-15159) · [TapSmart: great crossword apps](https://www.tapsmart.com/games/great-crossword-apps/?amp=1)
- [iCruciPuzzle Lite](https://apps.apple.com/app/id424425706) · [Cruciverb.com](https://www.cruciverb.com/) · [Italian crosswords: Cruciverba](https://apps.apple.com/app/id6673901792) · [Are LLMs Good Cryptic Crossword Solvers? (arXiv)](https://arxiv.org/html/2403.12094v2)
