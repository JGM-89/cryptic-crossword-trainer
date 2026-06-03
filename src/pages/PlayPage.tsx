import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadArchiveMeta, type ArchiveMeta, type DifficultyBand } from '../data/archive';
import { PUZZLES } from '../data';
import { getCompleted } from '../state/playProgress';

const BANDS: (DifficultyBand | 'All')[] = ['All', 'Gentle', 'Moderate', 'Tougher'];

export function PlayPage() {
  const [meta, setMeta] = useState<ArchiveMeta[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [band, setBand] = useState<DifficultyBand | 'All'>('All');
  const [completed, setCompleted] = useState<Set<string>>(() => getCompleted());

  useEffect(() => {
    loadArchiveMeta().then(setMeta).catch((e) => setError(String(e)));
    setCompleted(getCompleted());
  }, []);

  const filtered = useMemo(
    () => (meta ?? []).filter((p) => band === 'All' || p.band === band),
    [meta, band],
  );
  const doneCount = useMemo(
    () => (meta ?? []).filter((p) => completed.has(`archive-${p.id}`)).length,
    [meta, completed],
  );

  const featured = PUZZLES[0]; // the hand-crafted showcase mini

  return (
    <div className="page play">
      <header className="lesson-page-head">
        <h1>Play</h1>
        <p className="lede">
          A growing archive of full cryptic crosswords. Every grid interlocks real,
          hand-clued answers; every clue is checked for fairness. Pick one and solve.
        </p>
      </header>

      <section className="featured">
        <h2>Featured — hand-crafted</h2>
        <Link to="/puzzle/daily-001" className="featured-card">
          <div>
            <h3>{featured.title}</h3>
            <p className="muted">
              A hand-built, fully-checked mini cryptic — every cell crosses two answers.
            </p>
          </div>
          <span className="featured-go">Solve →</span>
        </Link>
      </section>

      <section>
        <div className="play-toolbar">
          <h2>The archive {meta && <span className="muted">· {meta.length} puzzles</span>}</h2>
          <div className="band-filter" role="group" aria-label="Filter by difficulty">
            {BANDS.map((b) => (
              <button
                key={b}
                type="button"
                className={`chip-btn ${band === b ? 'active' : ''}`}
                onClick={() => setBand(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {meta && (
          <p className="muted play-progress-note">
            Solved {doneCount} of {meta.length}.
          </p>
        )}

        {error && <p className="feedback wrong">Couldn’t load the archive ({error}).</p>}
        {!meta && !error && <p className="muted">Loading the archive…</p>}

        <div className="puzzle-grid">
          {filtered.map((p) => {
            const done = completed.has(`archive-${p.id}`);
            return (
              <Link key={p.id} to={`/play/${p.id}`} className={`puzzle-tile ${done ? 'done' : ''}`}>
                <div className="pt-top">
                  <span className="pt-title">№{p.id}</span>
                  {done && <span className="tick">✓</span>}
                </div>
                <span className={`pt-band band-${p.band.toLowerCase()}`}>{p.band}</span>
                <span className="muted pt-meta">
                  {p.size}×{p.size} · {p.clueCount} clues
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
