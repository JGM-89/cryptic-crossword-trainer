import { useMemo, useRef, useState } from 'react';
import type { Clue } from '../types';
import { CLUE_TYPE_LABELS } from '../types';
import type { Scaffolding, SolveOutcome } from '../engine/fading';
import { AnswerStrip } from './AnswerStrip';
import { ClueText } from './ClueText';
import { HintLadder } from './HintLadder';

interface Props {
  clue: Clue;
  scaffolding: Scaffolding;
  alreadySolved?: boolean;
  onSolved: (clue: Clue, outcome: SolveOutcome) => void;
}

const lettersOnly = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '');

export function ClueCard({ clue, scaffolding, alreadySolved, onSolved }: Props) {
  const target = useMemo(() => lettersOnly(clue.solution), [clue.solution]);
  const [value, setValue] = useState<string[]>(() => Array(target.length).fill(''));
  const [status, setStatus] = useState<'correct' | 'wrong' | undefined>(
    alreadySolved ? 'correct' : undefined,
  );
  const [solved, setSolved] = useState(Boolean(alreadySolved));
  const [hintUsed, setHintUsed] = useState(false);
  const [wrongOnce, setWrongOnce] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const startRef = useRef<number>(Date.now());

  const isDouble = clue.clueType === 'double-definition';

  function finish(outcome: SolveOutcome) {
    if (solved) return;
    setSolved(true);
    setStatus('correct');
    onSolved(clue, outcome);
  }

  function check() {
    if (solved) return;
    const guess = value.join('');
    if (guess.length < target.length) {
      setStatus('wrong');
      setWrongOnce(true);
      return;
    }
    if (guess === target) {
      finish({ usedHint: hintUsed, timeMs: Date.now() - startRef.current });
    } else {
      setStatus('wrong');
      setWrongOnce(true);
    }
  }

  function revealAnswer() {
    setValue(target.split(''));
    setRevealed(true);
    setHintUsed(true);
    finish({ usedHint: true, hintsUsed: 4, timeMs: Date.now() - startRef.current });
  }

  // When should the hint ladder be visible, given the scaffolding stage?
  const showLadder =
    scaffolding.hintAvailability === 'all' ||
    scaffolding.hintAvailability === 'onRequest' ||
    (scaffolding.hintAvailability === 'afterAttempt' && (wrongOnce || solved)) ||
    (scaffolding.hintAvailability === 'afterSolve' && solved);

  const revealAllHints = solved || revealed;

  return (
    <article className={`clue-card ${solved ? 'solved' : ''}`}>
      <div className="clue-card-head">
        <p className="clue-line">
          <ClueText
            clue={clue.clue}
            definitionSpan={clue.definitionSpan}
            highlight={scaffolding.preHighlightDefinition && !solved}
          />
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
          Not quite — check the crossing idea, then try again.
        </p>
      )}

      {isDouble && (scaffolding.showClueTypeBadge || solved) && (
        <p className="device-note">
          Double definition: both halves of the clue define the same answer.
        </p>
      )}

      {showLadder && (
        <HintLadder
          hints={clue.hints}
          startingTier={scaffolding.startingTier}
          onHintUsed={() => setHintUsed(true)}
          revealAll={revealAllHints}
        />
      )}
    </article>
  );
}
