import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArchivePuzzle } from '../data/archive';
import type { Puzzle } from '../types';
import { MiniGrid } from '../components/MiniGrid';
import { fillKey, isCompleted, markCompleted } from '../state/playProgress';

export function SolvePage() {
  const { puzzleId } = useParams();
  const id = Number(puzzleId);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [missing, setMissing] = useState(false);
  const [solvedEntries, setSolvedEntries] = useState<Set<string>>(new Set());
  const [revealedEntries, setRevealedEntries] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    getArchivePuzzle(id).then((p) => {
      if (!active) return;
      if (!p) setMissing(true);
      else {
        setPuzzle(p);
        setDone(isCompleted(p.id));
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (missing) {
    return (
      <div className="page">
        <p>Puzzle not found.</p>
        <Link to="/play">← Back to the archive</Link>
      </div>
    );
  }
  if (!puzzle) {
    return (
      <div className="page">
        <p className="muted">Loading puzzle…</p>
      </div>
    );
  }

  return (
    <div className="page puzzle-page">
      <nav className="crumb">
        <Link to="/play">← The archive</Link>
      </nav>
      <header className="lesson-page-head">
        <h1>{puzzle.title}</h1>
        <p className="lede">{puzzle.blurb}</p>
      </header>

      {done && (
        <p className="puzzle-done" role="status">
          🎉 Completed — every answer checks out. Reveal any clue to see its parse.
        </p>
      )}

      <MiniGrid
        puzzle={puzzle}
        storageKey={fillKey(puzzle.id)}
        onEntrySolved={(entry) =>
          setSolvedEntries((prev) => {
            if (prev.has(entry.id)) return prev;
            const next = new Set(prev);
            next.add(entry.id);
            return next;
          })
        }
        onComplete={() => {
          markCompleted(puzzle.id);
          setDone(true);
        }}
        revealedEntries={revealedEntries}
        onReveal={(eid) => setRevealedEntries((prev) => new Set(prev).add(eid))}
        solvedEntries={solvedEntries}
      />
    </div>
  );
}
