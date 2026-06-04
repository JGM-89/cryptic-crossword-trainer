import { Link } from 'react-router-dom';
import { useProgress } from '../state/ProgressContext';
import { topStage } from '../engine/progress';
import { STAGE_LABELS } from '../types';
import { getCompleted } from '../state/playProgress';
import { CLUES } from '../data';

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
    go: '300 puzzles →',
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
            {started ? 'Keep learning' : 'Start learning'} →
          </Link>
          <Link className="btn btn-ghost btn-lg" to="/play">
            Play a cryptic
          </Link>
        </div>
      </section>

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

      <div className="section-head">
        <h2>Four ways in</h2>
        <span className="muted">Pick up wherever you left off</span>
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
          Free, open-source, and fully in your browser — no account, nothing sent to a server.{' '}
          <Link to="/about">How it works →</Link>
        </p>
      </section>
    </div>
  );
}
