import { useState } from 'react';
import type { Hint } from '../types';

interface Props {
  hints: readonly Hint[];
  /** Lowest rung to offer first (Stage A → 1; later stages → 2). */
  startingTier: 1 | 2;
  /** Called the first time any hint is revealed (counts against a clean solve). */
  onHintUsed?: () => void;
  /** When true, all rungs (including the full parse) are shown at once. */
  revealAll?: boolean;
}

/**
 * The four-rung hint ladder with progressive disclosure (Fifteensquared-style):
 * definition → clue type → indicator+fodder → full parse. Each rung is opened
 * deliberately so the learner only takes as much help as they need.
 */
export function HintLadder({ hints, startingTier, onHintUsed, revealAll }: Props) {
  const offered = hints.filter((h) => h.tier >= startingTier);
  const [revealed, setRevealed] = useState(0);
  const usedRef = useState({ fired: false })[0];

  const shown = revealAll ? offered.length : revealed;

  function reveal() {
    if (!usedRef.fired) {
      usedRef.fired = true;
      onHintUsed?.();
    }
    setRevealed((n) => Math.min(n + 1, offered.length));
  }

  return (
    <div className="hint-ladder">
      <ol className="hint-list">
        {offered.map((hint, i) => {
          const isShown = i < shown;
          return (
            <li key={hint.tier} className={`hint ${isShown ? 'shown' : 'hidden'}`}>
              <span className="hint-label">
                Hint {hint.tier} · {hint.label}
              </span>
              {isShown ? (
                <span className="hint-text">{hint.text}</span>
              ) : (
                <span className="hint-text muted">— hidden —</span>
              )}
            </li>
          );
        })}
      </ol>
      {!revealAll && shown < offered.length && (
        <button type="button" className="btn btn-ghost" onClick={reveal}>
          {shown === 0 ? 'Need a hint?' : 'Reveal next hint'}
        </button>
      )}
    </div>
  );
}
