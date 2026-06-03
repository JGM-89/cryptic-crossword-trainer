import type { Hint } from '../types';

interface Props {
  hints: readonly Hint[];
  /** Lowest rung to offer first (Stage A → 1; later stages → 2). */
  startingTier: 1 | 2;
  /** How many of the offered rungs are currently revealed (controlled). */
  revealedCount: number;
  /** Reveal one more rung. */
  onReveal: () => void;
  /** When true, every offered rung is shown at once (post-solve recap). */
  revealAll?: boolean;
}

/**
 * The four-rung hint ladder with progressive disclosure (Fifteensquared-style):
 * definition → clue type → indicator+fodder → full parse. State lives in the
 * parent so revealing a rung can also light up the matching span in the clue.
 */
export function HintLadder({ hints, startingTier, revealedCount, onReveal, revealAll }: Props) {
  const offered = hints.filter((h) => h.tier >= startingTier);
  const shown = revealAll ? offered.length : revealedCount;

  return (
    <div className="hint-ladder">
      <p className="ladder-title">Hint ladder — four rungs, disclosed one at a time</p>
      <ol className="hint-list">
        {offered.map((hint, i) => {
          const isShown = i < shown;
          return (
            <li key={hint.tier} className={`hint ${isShown ? 'shown' : 'hidden'}`}>
              <span className="rung-num" aria-hidden>
                {hint.tier}
              </span>
              <span className="hint-label">{hint.label}</span>
              {isShown ? (
                <span className="hint-text">{hint.text}</span>
              ) : (
                <span className="hint-text" aria-hidden>
                  — hidden —
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!revealAll && shown < offered.length && (
        <button type="button" className="btn btn-ghost hint-reveal-btn" onClick={onReveal}>
          {shown === 0 ? 'Need a hint?' : 'Reveal next rung →'}
        </button>
      )}
    </div>
  );
}
