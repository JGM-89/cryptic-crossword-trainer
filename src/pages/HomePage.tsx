import { Link } from 'react-router-dom';
import { useProgress } from '../state/ProgressContext';
import { topStage } from '../engine/progress';
import { STAGE_LABELS } from '../types';
import { getCompleted } from '../state/playProgress';
import { CLUES } from '../data';

const CARDS = [
  {
    to: '/learn',
    emoji: '📚',
    title: 'Learn',
    body: 'A guided course — one device at a time, with hints that fade as you improve.',
  },
  {
    to: '/play',
    emoji: '▦',
    title: 'Play',
    body: 'An archive of cryptic crosswords, from quick minis to full 13×13 grids.',
  },
  {
    to: '/analyzer',
    emoji: '🔍',
    title: 'Analyzer',
    body: 'Pull any clue apart: its definition, its device, and the indicator words.',
  },
  {
    to: '/reference',
    emoji: '📖',
    title: 'Reference',
    body: 'The indicator vocabulary and the standard abbreviation “code words”.',
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
        <p className="home-eyebrow">Cryptic Crossword Trainer</p>
        <h1>
          Learn to solve cryptic crosswords —<br />
          and actually enjoy it.
        </h1>
        <p className="lede">
          Every cryptic clue is a <strong>definition</strong> at one end and some{' '}
          <strong>wordplay</strong> at the other, each leading to the same answer. We teach you
          to find the seam — one device at a time, with help that quietly fades — until you’re
          solving a full grid unaided.
        </p>
        <div className="home-cta">
          <Link className="btn btn-primary" to="/learn">
            {started ? 'Keep learning' : 'Start learning'} →
          </Link>
          <Link className="btn btn-ghost" to="/play">
            Play a cryptic
          </Link>
        </div>
      </section>

      <section className="home-stats" aria-label="Your progress">
        <div className="stat">
          <span className="stat-num">{STAGE_LABELS[stage]}</span>
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

      <section className="home-cards">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="home-card">
            <span className="home-card-emoji" aria-hidden>
              {c.emoji}
            </span>
            <h2>{c.title}</h2>
            <p>{c.body}</p>
          </Link>
        ))}
      </section>

      <section className="home-foot">
        <p className="muted">
          Free, open-source, and fully in your browser — no account, nothing sent to a server.{' '}
          <Link to="/about">How it works →</Link>
        </p>
      </section>
    </div>
  );
}
