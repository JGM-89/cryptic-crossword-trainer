import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPuzzle } from '../data';
import type { PuzzleEntry } from '../types';
import { useProgress } from '../state/ProgressContext';
import { MiniGrid } from '../components/MiniGrid';

export function PuzzlePage() {
  const { puzzleId } = useParams();
  const puzzle = puzzleId ? getPuzzle(puzzleId) : undefined;
  const { state, solveClue, completePuzzle } = useProgress();

  const [solvedEntries, setSolvedEntries] = useState<Set<string>>(new Set());
  const [revealedEntries, setRevealedEntries] = useState<Set<string>>(new Set());
  const done = puzzle ? state.completedPuzzles[puzzle.id] === true : false;

  if (!puzzle) {
    return (
      <div className="page">
        <p>Puzzle not found.</p>
        <Link to="/">← Back to lessons</Link>
      </div>
    );
  }

  function handleEntrySolved(entry: PuzzleEntry) {
    setSolvedEntries((prev) => {
      if (prev.has(entry.id)) return prev;
      const next = new Set(prev);
      next.add(entry.id);
      return next;
    });
    // Each grid entry still feeds the competence engine.
    solveClue(entry, { usedHint: revealedEntries.has(entry.id) });
  }

  return (
    <div className="page puzzle-page">
      <nav className="crumb">
        <Link to="/">← All lessons</Link>
      </nav>
      <header className="lesson-page-head">
        <span className="stage-pill stage-D">Stage D · Independent</span>
        <h1>{puzzle.title}</h1>
        <p className="lede">{puzzle.blurb}</p>
      </header>

      {done && (
        <p className="puzzle-done" role="status">
          🎉 Grid complete — you solved a full cryptic. The parses are shown below each clue.
        </p>
      )}

      <MiniGrid
        puzzle={puzzle}
        onEntrySolved={handleEntrySolved}
        onComplete={() => completePuzzle(puzzle.id)}
        revealedEntries={revealedEntries}
        onReveal={(id) =>
          setRevealedEntries((prev) => new Set(prev).add(id))
        }
        solvedEntries={solvedEntries}
      />
    </div>
  );
}
