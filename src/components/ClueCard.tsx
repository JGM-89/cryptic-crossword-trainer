import { useMemo, useRef, useState } from 'react';
import type { Clue } from '../types';
import { CLUE_TYPE_LABELS } from '../types';
import type { Scaffolding, SolveOutcome } from '../engine/fading';
import { AnswerStrip } from './AnswerStrip';
import { ClueText, type Highlight } from './ClueText';
import { HintLadder } from './HintLadder';

interface Props {
  clue: Clue;
  scaffolding: Scaffolding;
  alreadySolved?: boolean;
  onSolved: (clue: Clue, outcome: SolveOutcome) => void;
}

const lettersOnly = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '');

/** Locate a phrase in the clue (case-insensitive); null if absent. */
function locate(clue: string, phrase: string): { start: number; end: number } | null {
  if (!phrase) return null;
  const idx = clue.toLowerCase().indexOf(phrase.toLowerCase());
  return idx === -1 ? null : { start: idx, end: idx + phrase.length };
}

export function ClueCard({ clue, scaffolding, alreadySolved, onSolved }: Props) {
  const target = useMemo(() => lettersOnly(clue.solution), [clue.solution]);
  const [value, setValue] = useState<string[]>(() => Array(target.length).fill(''));
  const [status, setStatus] = useState<'correct' | 'wrong' | undefined>(
    alreadySolved ? 'correct' : undefined,
  );
  const [solved, setSolved] = useState(Boolean(alreadySolved));
  const [hintUsed, setHintUsed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const startRef = useRef<number>(Date.now());

  // Which actual hint tiers are on offer (Stage C/D start at the clue-type rung).
  const offeredTiers = useMemo(
    () => clue.hints.map((h) => h.tier).filter((t) => t >= scaffolding.startingTier),
    [clue.hints, scaffolding.startingTier],
  );
  const showAllHints = solved || revealed;
  const revealedTiers = new Set(
    showAllHints ? offeredTiers : offeredTiers.slice(0, revealedCount),
  );

  // Highlights light up as the matching hint rung opens (Hint 1 → definition,
  // Hint 3 → indicator). Once solved we show both as a recap.
  const highlights: Highlight[] = [];
  if (revealedTiers.has(1) || solved) {
    highlights.push({
      start: clue.definitionSpan.start,
      end: clue.definitionSpan.end,
      className: 'definition',
      title: 'Definition',
    });
  }
  if ((revealedTiers.has(3) || solved) && clue.wordplay.indicator) {
    const ind = locate(clue.clue, clue.wordplay.indicator);
    if (ind) {
      highlights.push({ ...ind, className: 'indicator-mark', title: 'Indicator' });
    }
  }

  function finish(outcome: SolveOutcome) {
    if (solved) return;
    setSolved(true);
    setStatus('correct');
    onSolved(clue, outcome);
  }

  function check() {
    if (solved) return;
    const guess = value.join('');
    if (guess.length < target.length || guess !== target) {
      setStatus('wrong');
      return;
    }
    finish({ usedHint: hintUsed, hintsUsed: revealedCount, timeMs: Date.now() - startRef.current });
  }

  function revealAnswer() {
    setValue(target.split(''));
    setRevealed(true);
    setHintUsed(true);
    finish({ usedHint: true, hintsUsed: 4, timeMs: Date.now() - startRef.current });
  }

  function revealNextHint() {
    if (!hintUsed) setHintUsed(true);
    setRevealedCount((n) => Math.min(n + 1, offeredTiers.length));
  }

  return (
    <article className={`clue-card ${solved ? 'solved' : ''}`}>
      <div className="clue-card-head">
        <p className="clue-line">
          <ClueText clue={clue.clue} highlights={highlights} />
        </p>
        {scaffolding.showClueTypeBadge && (
          <span className={`badge badge-${clue.clueType}`}>
            {CLUE_TYPE_LABELS[clue.clueType]}
          </span>
        )}
      </div>

      <AnswerStrip
        value={value}
        onChange={setValue}
        enumeration={clue.enumeration}
        status={status}
        disabled={solved}
        onEnter={check}
      />

      <div className="clue-actions">
        {!solved ? (
          <>
            <button type="button" className="btn btn-primary" onClick={check}>
              Check
            </button>
            <button type="button" className="btn btn-ghost" onClick={revealAnswer}>
              Reveal answer
            </button>
          </>
        ) : (
          <span className="solved-flag" role="status">
            ✓ {clue.solution}
            {revealed ? ' (revealed)' : hintUsed ? ' (with help)' : ' — unaided!'}
          </span>
        )}
      </div>

      {status === 'wrong' && !solved && (
        <p className="feedback wrong" role="alert">
          Not quite — try a hint, then have another go.
        </p>
      )}

      {/* In Learn, hints are always one tap away — every card keeps a "Need a
          hint?" affordance so none looks empty. The per-device fade is carried
          by the starting rung (advanced devices skip the definition rung) and
          the device badge, not by hiding the ladder. (Play / the daily grid use
          MiniGrid and stay fully unaided.) */}
      <HintLadder
        hints={clue.hints}
        startingTier={scaffolding.startingTier}
        revealedCount={revealedCount}
        onReveal={revealNextHint}
        revealAll={showAllHints}
      />
    </article>
  );
}
