import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArchivePuzzle, loadArchiveMeta } from '../data/archive';
import type { Puzzle } from '../types';
import { MiniGrid } from '../components/MiniGrid';
import { PuzzleComplete, type CompleteAction } from '../components/PuzzleComplete';
import { fillKey, isCompleted, markCompleted } from '../state/playProgress';
import { track } from '../analytics';

export function SolvePage() {
  const { puzzleId } = useParams();
  const id = Number(puzzleId);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [missing, setMissing] = useState(false);
  const [solvedEntries, setSolvedEntries] = useState<Set<string>>(new Set());
  const [revealedEntries, setRevealedEntries] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);
  const [justSolved, setJustSolved] = useState(false);
  const [band, setBand] = useState<string | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    // Reset per-puzzle state when navigating between puzzles.
    setSolvedEntries(new Set());
    setRevealedEntries(new Set());
    setJustSolved(false);
    setMissing(false);
    getArchivePuzzle(id).then((p) => {
      if (!active) return;
      if (!p) setMissing(true);
      else {
        setPuzzle(p);
        setDone(isCompleted(p.id));
        track('puzzle_start', { puzzle: String(id) });
      }
    });
    // Pull the band + next puzzle in the same tier for the completion card.
    loadArchiveMeta()
      .then((meta) => {
        if (!active) return;
        const cur = meta.find((m) => m.id === id);
        setBand(cur?.band ?? null);
        if (cur) {
          const sameTier = meta.filter((m) => m.tier === cur.tier);
          const i = sameTier.findIndex((m) => m.id === id);
          setNextId(i >= 0 && i + 1 < sameTier.length ? sameTier[i + 1].id : null);
        } else {
          setNextId(null);
        }
      })
      .catch(() => {});
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
        key={puzzle.id}
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
          track('puzzle_complete', { puzzle: puzzle.id });
          if (!done) setJustSolved(true); // celebrate only on a fresh solve
          setDone(true);
        }}
        revealedEntries={revealedEntries}
        onReveal={(eid) => setRevealedEntries((prev) => new Set(prev).add(eid))}
        solvedEntries={solvedEntries}
      />

      <PuzzleComplete
        open={justSolved}
        title="Solved!"
        subtitle={`${puzzle.title}${band ? ` · ${band}` : ''} — every answer checks out.`}
        actions={
          [
            nextId != null
              ? { label: 'Next puzzle →', to: `/play/${nextId}`, primary: true }
              : null,
            { label: 'Back to the archive', to: '/play' },
          ].filter(Boolean) as CompleteAction[]
        }
        onClose={() => setJustSolved(false)}
      />
    </div>
  );
}
