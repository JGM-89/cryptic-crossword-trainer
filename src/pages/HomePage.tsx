import { Link } from 'react-router-dom';
import { useProgress } from '../state/ProgressContext';
import { topStage } from '../engine/progress';
import { STAGE_LABELS } from '../types';
import { getCompleted } from '../state/playProgress';
import { CLUES } from '../data';
import { dailyClue, dateKey } from '../data/daily';
import { loadDaily } from '../state/dailyProgress';
import { parFor, scoreLabel } from '../data/par';
import { DailyBridges } from '../components/DailyBridges';

const CARDS = [
  {
    to: '/learn',
    mark: 'L',
    title: 'Learn',
    body: 'A guided course — one device at a time, with hints that fade as you improve.',
    go: 'Start the course →',
  },
  {
    to: '/play',
    mark: 'P',
    title: 'Play',
    body: 'An archive of cryptic crosswords, from quick minis to full 13×13 grids.',
    go: '250 puzzles →',
  },
  {
    to: '/analyzer',
    mark: 'A',
    title: 'Analyzer',
    body: 'Pull any clue apart: its definition, its device, and the indicator words.',
    go: 'Open the analyzer →',
  },
  {
    to: '/reference',
    mark: 'R',
    title: 'Reference',
    body: 'The indicator vocabulary and the standard abbreviation “code words”.',
    go: 'Browse the lists →',
  },
];

export function HomePage() {
  const { state } = useProgress();
  const solvedClues = Object.keys(state.solvedClues).length;
  const solvedPuzzles = getCompleted().size;
  const stage = topStage(state);
  const started = solvedClues > 0 || solvedPuzzles > 0;

  // The ritual's state drives the page: first-timers get the pitch; returning
  // solvers get today's Daily front and centre (spec §2, daily-first).
  const dailyState = loadDaily();
  const today = dateKey();
  const daily = dailyClue(today);
  const todayResult = dailyState.history[today];
  const returning = started || dailyState.lastDate !== null;

  if (returning && daily) {
    return (
      <div className="page home">
        <section className="home-hero home-hero-compact">
          <p className="home-eyebrow">British cryptic crosswords, taught properly</p>
          <div className="daily-card">
            {todayResult ? (
              <>
                <h1>
                  Daily #{daily.number} — solved
                  {todayResult.revealed
                    ? ' (revealed)'
                    : todayResult.score !== undefined
                      ? `, ${scoreLabel(todayResult.score, todayResult.par ?? parFor(daily.clue)).toLowerCase()}`
                      : todayResult.hintsUsed > 0
                        ? ` with ${todayResult.hintsUsed} hint${todayResult.hintsUsed === 1 ? '' : 's'}`
                        : ' unaided'}
                </h1>
                <p className="lede">
                  {dailyState.streak > 1 && (
                    <>
                      Streak: <strong>{dailyState.streak}</strong>.{' '}
                    </>
                  )}
                  Daily #{daily.number + 1} lands at midnight. Meanwhile —
                </p>
                <DailyBridges />
              </>
            ) : (
              <>
                <h1>Daily #{daily.number} is up.</h1>
                <p className="lede">
                  One clue a day. Par is {parFor(daily.clue)} — beat it.
                  {dailyState.streak > 0 && (
                    <>
                      {' '}
                      Your streak: <strong>{dailyState.streak}</strong>.
                    </>
                  )}
                </p>
                <div className="home-cta">
                  <Link className="btn btn-primary btn-lg" to="/daily">
                    Solve today’s Daily →
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
        <HomeBody stage={stage} solvedClues={solvedClues} solvedPuzzles={solvedPuzzles} started={started} showStats={returning} />
      </div>
    );
  }

  return (
    <div className="page home">
      <section className="home-hero">
        <p className="home-eyebrow">British cryptic crosswords, taught properly</p>
        <h1>Every clue has a seam. We teach you to find it.</h1>
        <p className="home-equation">
          One clue = <span className="definition">a{' '}definition</span> +{' '}
          <span className="indicator-mark">some{' '}wordplay</span> — each leading,
          independently, to the same answer.
        </p>
        <p className="lede">
          Cruci teaches you to stop reading the clue as a sentence and spot the boundary between
          its two halves — one device at a time, with help that quietly fades, until you’re
          solving a full grid unaided.
        </p>
        <div className="home-cta">
          <Link className="btn btn-primary btn-lg" to="/learn">
            Start learning →
          </Link>
          <Link className="btn btn-ghost btn-lg" to="/daily">
            Or try today’s Daily
          </Link>
        </div>
      </section>
      <HomeBody stage={stage} solvedClues={solvedClues} solvedPuzzles={solvedPuzzles} started={started} showStats={returning} />
    </div>
  );
}

// Everything below the hero — shared by the first-visit and returning layouts.
function HomeBody({
  stage,
  solvedClues,
  solvedPuzzles,
  started,
  showStats,
}: {
  stage: ReturnType<typeof topStage>;
  solvedClues: number;
  solvedPuzzles: number;
  started: boolean;
  /** A first-time visitor has nothing to report — a row of zeros and an
   *  unearned mastery badge only makes the promise look emptier. */
  showStats: boolean;
}) {
  return (
    <>
      {showStats && (
      <section className="home-stats" aria-label="Your progress">
        <div className="stat">
          <span className={`cc-stage stage-${stage}`} aria-hidden>
            {stage}
          </span>
          <span className="stat-num" style={{ fontSize: 'var(--fs-700)' }}>
            {STAGE_LABELS[stage]}
          </span>
          <span className="stat-label">Top mastery (Stage {stage})</span>
        </div>
        <div className="stat">
          <span className="stat-num">{solvedClues}</span>
          <span className="stat-label">Clues solved in lessons</span>
        </div>
        <div className="stat">
          <span className="stat-num">{solvedPuzzles}</span>
          <span className="stat-label">Crosswords completed</span>
        </div>
        <div className="stat">
          <span className="stat-num">{CLUES.length}+</span>
          <span className="stat-label">Hand-clued teaching clues</span>
        </div>
      </section>
      )}

      <div className="section-head">
        <h2>Four ways in</h2>
        <span className="muted">{started ? 'Pick up wherever you left off' : 'Choose your door'}</span>
      </div>

      <section className="home-cards">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="home-card">
            <span className="card-mark" aria-hidden>
              {c.mark}
            </span>
            <h2>{c.title}</h2>
            <p>{c.body}</p>
            <span className="card-go">{c.go}</span>
          </Link>
        ))}
      </section>

      <hr className="rule" />
      <section className="home-foot">
        <p className="muted">
          Free and open-source — no account, your progress stays in your browser. We count anonymous usage (privacy-friendly, no cookies, nothing personal).{' '}
          <Link to="/about">How it works →</Link>
        </p>
      </section>
    </>
  );
}
