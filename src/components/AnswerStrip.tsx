import { useEffect, useMemo, useRef } from 'react';

interface Props {
  /** Per-cell letters; '' for empty. Length === answer length. */
  value: string[];
  onChange: (next: string[]) => void;
  /** Enumeration like "7" or "3,4" — drives the gaps between word groups. */
  enumeration: string;
  /** Highlight state after a check: 'correct' | 'wrong' | undefined. */
  status?: 'correct' | 'wrong';
  disabled?: boolean;
  /** Cells the learner cannot edit (already-correct crossing letters). */
  locked?: boolean[];
  onEnter?: () => void;
}

/** Indices after which a word-break gap should appear (e.g. "3,4" → gap after 3). */
function gapsFromEnumeration(enumeration: string): Set<number> {
  const gaps = new Set<number>();
  let cursor = 0;
  const parts = enumeration.split(/([,\-])/);
  for (const token of parts) {
    if (/^\d+$/.test(token)) {
      cursor += parseInt(token, 10);
      gaps.add(cursor - 1); // gap after this cell (boundary marker)
    }
  }
  gaps.delete(cursorTotal(enumeration) - 1); // no gap after the final cell
  return gaps;
}

function cursorTotal(enumeration: string): number {
  return enumeration
    .split(/[,\-\s]+/)
    .filter((p) => /^\d+$/.test(p))
    .reduce((s, p) => s + parseInt(p, 10), 0);
}

/** A row of single-character inputs — the heart of the solving UX. */
export function AnswerStrip({
  value,
  onChange,
  enumeration,
  status,
  disabled,
  locked,
  onEnter,
}: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const gaps = useMemo(() => gapsFromEnumeration(enumeration), [enumeration]);

  useEffect(() => {
    refs.current = refs.current.slice(0, value.length);
  }, [value.length]);

  function focusCell(i: number) {
    const el = refs.current[i];
    if (el) el.focus();
  }

  function nextEditable(from: number, dir: 1 | -1): number {
    let i = from;
    while (i >= 0 && i < value.length) {
      if (!locked?.[i]) return i;
      i += dir;
    }
    return -1;
  }

  function setCell(i: number, ch: string) {
    const next = value.slice();
    next[i] = ch.toUpperCase();
    onChange(next);
  }

  function handleChange(i: number, raw: string) {
    const ch = raw.replace(/[^a-zA-Z]/g, '').slice(-1);
    if (!ch) return;
    setCell(i, ch);
    const target = nextEditable(i + 1, 1);
    if (target !== -1) focusCell(target);
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[i]) {
        setCell(i, '');
      } else {
        const prev = nextEditable(i - 1, -1);
        if (prev !== -1) {
          setCell(prev, '');
          focusCell(prev);
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = nextEditable(i - 1, -1);
      if (prev !== -1) focusCell(prev);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const target = nextEditable(i + 1, 1);
      if (target !== -1) focusCell(target);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onEnter?.();
    }
  }

  return (
    <div className={`answer-strip ${status ?? ''}`.trim()} role="group" aria-label="Answer">
      {value.map((ch, i) => (
        <span key={i} className="cell-wrap">
          <input
            ref={(el) => (refs.current[i] = el)}
            className={`cell ${locked?.[i] ? 'locked' : ''}`}
            value={ch}
            inputMode="text"
            maxLength={1}
            autoCapitalize="characters"
            aria-label={`Letter ${i + 1}`}
            disabled={disabled || locked?.[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
          />
          {gaps.has(i) && <span className="word-gap" aria-hidden />}
        </span>
      ))}
    </div>
  );
}
