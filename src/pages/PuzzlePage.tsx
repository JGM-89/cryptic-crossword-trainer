import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPuzzle } from '../data';
import type { PuzzleEntry } from '../types';
import { useProgress } from '../state/ProgressContext';
import { MiniGrid } from '../components/MiniGrid';
import { PuzzleComplete } from '../components/PuzzleComplete';

export function PuzzlePage() {
  const { puzzleId } = useParams();
  const puzzle = puzzleId ? getPuzzle(puzzleId) : undefined;
  const { state, solveClue, completePuzzle } = useProgress();

  const [solvedEntries, setSolvedEntries] = useState<Set<string>>(new Set());
  const [revealedEntries, setRevealedEntries] = useState<Set<string>>(new Set());
  const [justSolved, setJustSolved] = useState(false);
  const done = puzzle ? state.completedPuzzles[puzzle.id] === true : false;

  if (!puzzle) {
    return (
      <div className="page">
        <p>Puzzle not found.</p>
        <Link to="/learn">← Back to lessons</Link>
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
        <Link to="/learn">← All lessons</Link>
      </nav>
      <header className="lesson-page-head">
        <span className="stage-pill stage-D">
          <span className="pill-letter">D</span> Independent
        </span>
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
        onComplete={() => {
          if (!done) setJustSolved(true); // celebrate only on a fresh solve
          completePuzzle(puzzle.id);
        }}
        revealedEntries={revealedEntries}
        onReveal={(id) =>
          setRevealedEntries((prev) => new Set(prev).add(id))
        }
        solvedEntries={solvedEntries}
      />

      <PuzzleComplete
        open={justSolved}
        title="Grid complete!"
        subtitle={`${puzzle.title} — you solved a full cryptic, unaided where it counts.`}
        actions={[
          { label: 'Back to Learn →', to: '/learn', primary: true },
          { label: 'Play the archive', to: '/play' },
        ]}
        onClose={() => setJustSolved(false)}
      />
    </div>
  );
}
