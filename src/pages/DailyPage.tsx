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

const SITE = 'https://jgm-89.github.io/cryptic-crossword-trainer/#/daily';

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
        ? 'needed every hint'
        : r.hintsUsed === 0
          ? 'solved unaided'
          : `solved with ${r.hintsUsed} hint${r.hintsUsed === 1 ? '' : 's'}`;
    return `Cruci Daily #${daily!.number} — ${how}\n${SITE}`;
  }

  async function share() {
    const text = shareText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
        track('daily_shared', { number: daily!.number });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        /* unexpected error — fall through to clipboard */
        try {
          await navigator.clipboard.writeText(text);
          track('daily_shared', { number: daily!.number });
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard unavailable — nothing sensible to do */
        }
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      track('daily_shared', { number: daily!.number });
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
