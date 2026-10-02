// src/pages/DailyPage.tsx
// One clue a day, same for everyone, played under the same rules for everyone:
// the bare clue, a hints menu and letter reveals that each cost 1, scored
// against the clue's par. Serves today (/daily) and catch-up days from the
// archive (/daily/:number). Catch-up solves never touch the streak.
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { dailyByNumber, dateKey, dayNumber, formatDateKey } from '../data/daily';
import { parFor, scoreLabel } from '../data/par';
import {
  loadDaily,
  recordArchiveSolve,
  recordDailySolve,
  resultFor,
  type DailyResult,
  type DailyState,
} from '../state/dailyProgress';
import { useProgress } from '../state/ProgressContext';
import { DailyClueCard, type DailyFinish } from '../components/DailyClueCard';
import { DailyBridges } from '../components/DailyBridges';
import { track } from '../analytics';
import type { Clue } from '../types';

const SITE = 'https://jgm-89.github.io/cryptic-crossword-trainer/#/daily';

export function DailyPage() {
  const { number } = useParams();
  const todayNumber = dayNumber(dateKey());

  if (number !== undefined) {
    const n = Number(number);
    // Today's number lives at /daily; future days and nonsense have no page.
    if (!Number.isInteger(n) || n < 1 || n >= todayNumber) return <Navigate to="/daily" replace />;
    const past = dailyByNumber(n);
    if (!past) return <Navigate to="/daily" replace />;
    return <DailyView key={n} daily={past} catchUp />;
  }

  const today = dailyByNumber(todayNumber);
  if (!today) {
    return (
      <div className="page daily-page">
        <h1>The Daily</h1>
        <p className="lede">
          The first Daily arrives on 15 June 2026. Warm up in <Link to="/learn">Learn</Link>{' '}
          meanwhile.
        </p>
      </div>
    );
  }
  return <DailyView key={today.number} daily={today} catchUp={false} />;
}

interface ViewProps {
  daily: { clue: Clue; number: number; date: string };
  catchUp: boolean;
}

function DailyView({ daily, catchUp }: ViewProps) {
  const { state: progress, solveClue } = useProgress();
  const [state, setState] = useState<DailyState>(loadDaily);
  const [copied, setCopied] = useState(false);
  const par = parFor(daily.clue);

  useEffect(() => {
    track(catchUp ? 'daily_archive_start' : 'daily_start', { number: daily.number, par });
  }, [daily.number]); // eslint-disable-line react-hooks/exhaustive-deps

  const result = catchUp ? resultFor(state, daily.date) : state.history[daily.date];
  // No lessons solved and no Daily ever completed = a genuine first-timer.
  const brandNew =
    Object.keys(progress.solvedClues).length === 0 &&
    Object.keys(state.history).length === 0 &&
    Object.keys(state.archive).length === 0;

  function onFinished(r: DailyFinish) {
    // Feed the competence engine like any solve (any help spent = a helped solve).
    solveClue(daily.clue, {
      usedHint: r.revealed || r.score > 0,
      hintsUsed: r.revealed ? 4 : r.score,
      timeMs: r.timeMs,
    });
    const res: DailyResult = {
      hintsUsed: r.hintsUsed,
      lettersShown: r.lettersShown,
      score: r.score,
      par: r.par,
      revealed: r.revealed,
    };
    const props = {
      number: daily.number,
      score: r.score,
      par: r.par,
      hints: r.hintsUsed,
      letters: r.lettersShown,
      revealed: r.revealed,
    };
    if (catchUp) {
      setState(recordArchiveSolve(daily.date, res));
      track('daily_archive_solved', props);
    } else {
      const next = recordDailySolve(daily.date, res);
      setState(next);
      track('daily_solved', { ...props, streak: next.streak });
    }
  }

  function shareText(): string {
    const r = result;
    const how = !r
      ? ''
      : r.revealed
        ? 'revealed'
        : r.score !== undefined
          ? scoreLabel(r.score, r.par ?? par)
          : 'solved';
    const url = catchUp ? `${SITE}/${daily.number}` : SITE;
    return `Cruci Daily #${daily.number} — ${how}\n${url}`;
  }

  async function share() {
    const text = shareText();
    const done = () => {
      track('daily_shared', { number: daily.number, archive: catchUp });
    };
    if (navigator.share) {
      try {
        await navigator.share({ text });
        done();
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        /* unexpected error — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      done();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing sensible to do */
    }
  }

  return (
    <div className="page daily-page">
      <header className="lesson-page-head">
        <h1>Daily #{daily.number}</h1>
        {catchUp ? (
          <>
            <p className="daily-date">{formatDateKey(daily.date)} · from the archive</p>
            <p className="lede">
              One clue, par {par}. Catch-up solves are scored but don’t count toward your streak.
            </p>
          </>
        ) : (
          <p className="lede">
            One clue a day. Par is {par} — every hint or letter costs 1.
            {state.streak > 0 && (
              <>
                {' '}
                Streak: <strong>{state.streak}</strong>
                {state.best > state.streak ? ` (best ${state.best})` : ''}
              </>
            )}
          </p>
        )}
        <p className="daily-links">
          {catchUp ? (
            <>
              <Link to="/daily">← Today’s Daily</Link>
              <Link to="/daily/archive">The Daily archive</Link>
            </>
          ) : (
            <Link to="/daily/archive">The Daily archive →</Link>
          )}
        </p>
        {/* The Daily is a real cryptic, not a tutorial. Someone who has never
            solved one lands here with nine empty boxes and no idea what a
            charade is — give them the shallow end instead of a wall. */}
        {brandNew && (
          <p className="daily-newcomer">
            <Link to="/learn">New to cryptics? Start with lesson one →</Link>
          </p>
        )}
      </header>

      <DailyClueCard clue={daily.clue} par={par} result={result} onFinished={onFinished} />

      {result && (
        <div className="lesson-complete">
          {catchUp ? (
            <p>
              <strong>Caught up on Daily #{daily.number}.</strong>
            </p>
          ) : (
            <p>
              <strong>That’s today’s.</strong> Daily #{daily.number + 1} lands at midnight.
            </p>
          )}
          <button type="button" className="btn btn-primary" onClick={share}>
            {copied ? 'Copied!' : 'Share result'}
          </button>
          <p className="daily-links">
            {catchUp ? (
              <>
                <Link to="/daily">Today’s Daily →</Link>
                <Link to="/daily/archive">More from the archive →</Link>
              </>
            ) : (
              <Link to="/daily/archive">Missed a day? Catch up in the archive →</Link>
            )}
          </p>
          {!catchUp && <DailyBridges />}
        </div>
      )}
    </div>
  );
}
