// The Daily's play surface (spec: docs/superpowers/specs/2026-10-02-daily-par-and-archive-design.md).
// Same rules for everyone: the bare clue, a menu of hints (definition, device,
// wordplay — each once) and letter reveals, every one costing 1. Wrong guesses
// are free. Score = hints + letters, read against the clue's par.
// Learn/Play keep ClueCard and its competence-based fading.
import { useMemo, useRef, useState } from 'react';
import type { Clue } from '../types';
import type { DailyResult } from '../state/dailyProgress';
import { scoreLabel } from '../data/par';
import { track } from '../analytics';
import { AnswerStrip } from './AnswerStrip';
import { ClueText, locate, type Highlight } from './ClueText';
import { HintMenu, type HintKind, type HintMenuItem } from './HintMenu';
import { ParMeter } from './ParMeter';

export interface DailyFinish {
  score: number;
  par: number;
  hintsUsed: number;
  lettersShown: number;
  revealed: boolean;
  timeMs: number;
}

interface Props {
  clue: Clue;
  par: number;
  /** An earlier result for this Daily — renders the finished state. */
  result?: DailyResult;
  onFinished: (r: DailyFinish) => void;
}

type ExplainKind = Exclude<HintKind, 'letter'>;
const TIER: Record<ExplainKind, 0 | 1 | 2> = { definition: 0, device: 1, wordplay: 2 };
const LABEL: Record<ExplainKind, string> = {
  definition: 'Show the definition',
  device: 'Name the device',
  wordplay: 'Explain the wordplay',
};

const lettersOnly = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '');

export function DailyClueCard({ clue, par, result, onFinished }: Props) {
  const target = useMemo(() => lettersOnly(clue.solution), [clue.solution]);
  const done = Boolean(result);
  const [value, setValue] = useState<string[]>(() =>
    done ? target.split('') : Array(target.length).fill(''),
  );
  const [locked, setLocked] = useState<boolean[]>(() => Array(target.length).fill(false));
  const [taken, setTaken] = useState<ExplainKind[]>([]);
  const [letters, setLetters] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState<'correct' | 'wrong' | undefined>(done ? 'correct' : undefined);
  const [solved, setSolved] = useState(done);
  const [revealed, setRevealed] = useState(Boolean(result?.revealed));
  const [finalScore, setFinalScore] = useState<number | undefined>(result?.score);
  const startRef = useRef(Date.now());

  const score = solved && finalScore !== undefined ? finalScore : taken.length + letters;
  const shownPar = result?.par ?? par;

  const highlights: Highlight[] = [];
  if (solved || taken.includes('definition')) {
    highlights.push({
      start: clue.definitionSpan.start,
      end: clue.definitionSpan.end,
      className: 'definition',
      title: 'Definition',
    });
  }
  if ((solved || taken.includes('wordplay')) && clue.wordplay.indicator) {
    const ind = locate(clue.clue, clue.wordplay.indicator);
    if (ind) highlights.push({ ...ind, className: 'indicator-mark', title: 'Indicator' });
  }

  function finish(next: { revealed: boolean; letters: number }) {
    if (solved) return;
    const s = taken.length + next.letters;
    setSolved(true);
    setStatus('correct');
    setMenuOpen(false);
    setFinalScore(s);
    onFinished({
      score: s,
      par,
      hintsUsed: taken.length,
      lettersShown: next.letters,
      revealed: next.revealed,
      timeMs: Date.now() - startRef.current,
    });
    track('clue_solved', { type: clue.clueType, hints: s, revealed: next.revealed, source: 'daily' });
  }

  function check() {
    if (solved) return;
    if (value.join('') !== target) {
      setStatus('wrong'); // free — guessing is how you solve
      return;
    }
    finish({ revealed: false, letters });
  }

  function revealAnswer() {
    setValue(target.split(''));
    setRevealed(true);
    track('give_up', { type: clue.clueType, source: 'daily' });
    finish({ revealed: true, letters });
  }

  function pick(kind: HintKind) {
    setMenuOpen(false);
    track('hint_revealed', { type: clue.clueType, tier: kind, source: 'daily' });
    if (kind !== 'letter') {
      setTaken((t) => (t.includes(kind) ? t : [...t, kind]));
      return;
    }
    const i = value.findIndex((ch, idx) => ch !== target[idx] && !locked[idx]);
    if (i === -1) return;
    const nextValue = value.slice();
    nextValue[i] = target[i];
    const nextLocked = locked.slice();
    nextLocked[i] = true;
    const nextLetters = letters + 1;
    setValue(nextValue);
    setLocked(nextLocked);
    setLetters(nextLetters);
    setStatus(undefined);
    if (nextValue.join('') === target) finish({ revealed: false, letters: nextLetters });
  }

  const allLettersPlaced = value.every((ch, i) => ch === target[i]);
  const items: HintMenuItem[] = [
    ...(['definition', 'device', 'wordplay'] as ExplainKind[]).map((kind) => ({
      kind,
      label: LABEL[kind],
      disabled: taken.includes(kind),
    })),
    { kind: 'letter', label: 'Show a letter', disabled: allLettersPlaced },
  ];

  const outcome = revealed
    ? ' — revealed'
    : finalScore !== undefined
      ? ` — ${scoreLabel(finalScore, shownPar)}`
      : ' — solved';

  return (
    <article className={`clue-card daily-clue-card ${solved ? 'solved' : ''}`}>
      <div className="clue-card-head">
        <p className="clue-line">
          <ClueText clue={clue.clue} highlights={highlights} />
        </p>
      </div>

      <AnswerStrip
        value={value}
        onChange={(v) => {
          setValue(v);
          setStatus(undefined);
        }}
        enumeration={clue.enumeration}
        status={status}
        disabled={solved}
        locked={locked}
        onEnter={check}
      />

      {!(done && finalScore === undefined) && <ParMeter score={score} par={shownPar} />}

      <div className="clue-actions">
        {!solved ? (
          <>
            <button type="button" className="btn btn-primary" onClick={check}>
              Check
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              Hints
            </button>
            <button type="button" className="btn btn-ghost daily-reveal" onClick={revealAnswer}>
              Reveal answer
            </button>
          </>
        ) : (
          <span className="solved-flag" role="status">
            ✓ {clue.solution}
            {outcome}
          </span>
        )}
      </div>

      {menuOpen && !solved && (
        <HintMenu items={items} onPick={pick} onClose={() => setMenuOpen(false)} />
      )}

      {status === 'wrong' && !solved && (
        <p className="feedback wrong" role="alert">
          Not quite — wrong guesses are free. Try again, or take a hint.
        </p>
      )}

      {!solved && taken.length > 0 && (
        <ul className="daily-hints">
          {taken.map((kind) => (
            <li key={kind} className="hint shown">
              <span className="hint-label">{clue.hints[TIER[kind]].label}</span>
              <span className="hint-text">{clue.hints[TIER[kind]].text}</span>
            </li>
          ))}
        </ul>
      )}

      {solved && (
        <div className="daily-explain">
          <p className="ladder-title">How it works</p>
          <ul className="daily-hints">
            {clue.hints.map((h) => (
              <li key={h.tier} className="hint shown">
                <span className="hint-label">{h.label}</span>
                <span className="hint-text">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
