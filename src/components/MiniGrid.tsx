import { useEffect, useMemo, useRef, useState } from 'react';
import type { Direction, Puzzle, PuzzleEntry } from '../types';
import { CLUE_TYPE_LABELS } from '../types';
import { ClueText, type Highlight } from './ClueText';

const key = (r: number, c: number) => `${r},${c}`;

interface CellInfo {
  row: number;
  col: number;
  solution: string;
  number?: number;
}

interface BuiltGrid {
  cells: Map<string, CellInfo>;
  entryCells: Map<string, string[]>; // entryId → ordered cell keys
  acrossAt: Map<string, string>; // cellKey → across entryId
  downAt: Map<string, string>; // cellKey → down entryId
}

function buildGrid(puzzle: Puzzle): BuiltGrid {
  const cells = new Map<string, CellInfo>();
  const entryCells = new Map<string, string[]>();
  const acrossAt = new Map<string, string>();
  const downAt = new Map<string, string>();

  for (const entry of puzzle.entries) {
    const letters = entry.solution.toUpperCase().replace(/[^A-Z]/g, '');
    const keys: string[] = [];
    for (let i = 0; i < letters.length; i++) {
      const r = entry.row + (entry.direction === 'down' ? i : 0);
      const c = entry.col + (entry.direction === 'across' ? i : 0);
      const k = key(r, c);
      keys.push(k);
      const existing = cells.get(k);
      cells.set(k, {
        row: r,
        col: c,
        solution: letters[i],
        number: i === 0 ? entry.number : existing?.number,
      });
      (entry.direction === 'across' ? acrossAt : downAt).set(k, entry.id);
    }
    entryCells.set(entry.id, keys);
  }
  return { cells, entryCells, acrossAt, downAt };
}

interface Props {
  puzzle: Puzzle;
  onEntrySolved: (entry: PuzzleEntry) => void;
  onComplete: () => void;
  /** Reveal the full parse for an entry (Stage D: only after solving). */
  revealedEntries: Set<string>;
  onReveal: (entryId: string) => void;
  solvedEntries: Set<string>;
  /** When set, the grid fill is autosaved to localStorage under this key. */
  storageKey?: string;
}

export function MiniGrid({
  puzzle,
  onEntrySolved,
  onComplete,
  revealedEntries,
  onReveal,
  solvedEntries,
  storageKey,
}: Props) {
  const grid = useMemo(() => buildGrid(puzzle), [puzzle]);
  const entriesById = useMemo(
    () => new Map(puzzle.entries.map((e) => [e.id, e])),
    [puzzle.entries],
  );

  const [fill, setFill] = useState<Record<string, string>>({});
  const [cellStatus, setCellStatus] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [activeEntryId, setActiveEntryId] = useState<string>(puzzle.entries[0].id);
  const [cursor, setCursor] = useState(0);
  // Per-entry hint level: 0 none, 1 definition, 2 + clue type.
  const [hintLevel, setHintLevel] = useState<Record<string, number>>({});
  // A hidden, focusable proxy input. Focusing a real <input> inside the
  // cell-tap gesture is what summons the on-screen keyboard on mobile — a
  // tabIndex <div> never does. Letters arrive via its onChange (cross-platform);
  // arrows/backspace via onKeyDown.
  const inputRef = useRef<HTMLInputElement>(null);
  const hydratedRef = useRef(false);

  function revealHint(entryId: string, level: number) {
    setHintLevel((h) => ({ ...h, [entryId]: Math.max(h[entryId] ?? 0, level) }));
  }

  // Restore any autosaved fill for this puzzle.
  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as { fill?: Record<string, string> };
        if (saved.fill) setFill(saved.fill);
      }
    } catch {
      /* ignore */
    }
    hydratedRef.current = true;
  }, [storageKey]);

  // Persist the fill as the solver types.
  useEffect(() => {
    if (!storageKey || !hydratedRef.current) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ fill }));
    } catch {
      /* ignore */
    }
  }, [fill, storageKey]);

  const activeCells = grid.entryCells.get(activeEntryId) ?? [];
  const activeKey = activeCells[cursor];

  function selectEntry(id: string, cellKey?: string) {
    setActiveEntryId(id);
    const keys = grid.entryCells.get(id) ?? [];
    setCursor(cellKey ? Math.max(0, keys.indexOf(cellKey)) : 0);
    // Focus the proxy input within the tap gesture so mobile shows the keyboard.
    inputRef.current?.focus();
  }

  function clickCell(k: string) {
    const across = grid.acrossAt.get(k);
    const down = grid.downAt.get(k);
    const current = activeEntryId;
    // Toggle direction if the cell belongs to both and one is already active.
    if (across && down) {
      if (current === across) return selectEntry(down, k);
      if (current === down) return selectEntry(across, k);
    }
    selectEntry(across ?? down ?? current, k);
  }

  function placeLetter(ch: string) {
    if (!activeKey) return;
    if (cellStatus[activeKey] === 'correct') {
      // Skip locked-correct cells.
      advance(1);
      return;
    }
    setFill((f) => ({ ...f, [activeKey]: ch }));
    setCellStatus((s) => {
      const { [activeKey]: _drop, ...rest } = s;
      void _drop;
      return rest;
    });
    advance(1);
  }

  function advance(dir: 1 | -1) {
    setCursor((c) => Math.min(Math.max(c + dir, 0), activeCells.length - 1));
  }

  // Typed letters (hardware or on-screen keyboard) come through here. The input
  // is controlled to '' so it clears after each keystroke; we take the last
  // letter typed and place it.
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const ch = e.target.value.replace(/[^a-zA-Z]/g, '').slice(-1);
    if (ch) placeLetter(ch.toUpperCase());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (activeKey && fill[activeKey]) {
        setFill((f) => ({ ...f, [activeKey]: '' }));
      } else {
        advance(-1);
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      advance(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      advance(-1);
    }
  }

  function check() {
    const nextStatus: Record<string, 'correct' | 'wrong'> = {};
    grid.cells.forEach((info, k) => {
      const v = (fill[k] ?? '').toUpperCase();
      if (!v) return;
      nextStatus[k] = v === info.solution ? 'correct' : 'wrong';
    });
    setCellStatus(nextStatus);

    // Newly solved entries.
    for (const entry of puzzle.entries) {
      if (solvedEntries.has(entry.id)) continue;
      const keys = grid.entryCells.get(entry.id) ?? [];
      const allCorrect = keys.every((k) => nextStatus[k] === 'correct');
      if (allCorrect) onEntrySolved(entry);
    }

    const everyCellCorrect = [...grid.cells.keys()].every(
      (k) => nextStatus[k] === 'correct',
    );
    if (everyCellCorrect) onComplete();
  }

  function revealActive() {
    const keys = grid.entryCells.get(activeEntryId) ?? [];
    setFill((f) => {
      const next = { ...f };
      for (const k of keys) next[k] = grid.cells.get(k)!.solution;
      return next;
    });
    setCellStatus((s) => {
      const next = { ...s };
      for (const k of keys) next[k] = 'correct';
      return next;
    });
    onReveal(activeEntryId);
    const entry = entriesById.get(activeEntryId);
    if (entry && !solvedEntries.has(entry.id)) onEntrySolved(entry);
  }

  const across = puzzle.entries.filter((e) => e.direction === 'across');
  const down = puzzle.entries.filter((e) => e.direction === 'down');

  return (
    <div className="puzzle-layout">
      <div
        className="mini-grid"
        role="grid"
        aria-label={puzzle.title}
        style={{
          gridTemplateColumns: `repeat(${puzzle.cols}, var(--cell))`,
          // shrink cells for big grids so a 13x13 fits comfortably
          ['--cell' as string]: puzzle.cols >= 11 ? '2rem' : '2.7rem',
        }}
      >
        <input
          ref={inputRef}
          className="grid-input"
          value=""
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label={`${puzzle.title} — type letters; arrow keys move, backspace deletes`}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        {Array.from({ length: puzzle.rows * puzzle.cols }).map((_, idx) => {
          const r = Math.floor(idx / puzzle.cols);
          const c = idx % puzzle.cols;
          const k = key(r, c);
          const info = grid.cells.get(k);
          if (!info) return <div key={k} className="grid-cell black" />;
          const isActiveEntry = activeCells.includes(k);
          const isCursor = k === activeKey;
          const st = cellStatus[k];
          return (
            <div
              key={k}
              className={`grid-cell ${isActiveEntry ? 'in-entry' : ''} ${
                isCursor ? 'cursor' : ''
              } ${st ?? ''}`}
              onClick={() => clickCell(k)}
            >
              {info.number && <span className="grid-number">{info.number}</span>}
              <span className="grid-letter">{(fill[k] ?? '').toUpperCase()}</span>
            </div>
          );
        })}
      </div>

      <div className="puzzle-side">
        <div className="puzzle-controls">
          <button type="button" className="btn btn-primary" onClick={check}>
            Check grid
          </button>
          <button type="button" className="btn btn-ghost" onClick={revealActive}>
            Reveal selected
          </button>
        </div>

        {(['across', 'down'] as Direction[]).map((dir) => (
          <div key={dir} className="clue-group">
            <h3>{dir === 'across' ? 'Across' : 'Down'}</h3>
            <ol className="puzzle-clue-list">
              {(dir === 'across' ? across : down).map((entry) => {
                const isSolved = solvedEntries.has(entry.id);
                const isRevealed = revealedEntries.has(entry.id);
                return (
                  <li
                    key={entry.id}
                    className={`puzzle-clue ${entry.id === activeEntryId ? 'active' : ''} ${
                      isSolved ? 'solved' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="puzzle-clue-btn"
                      onClick={() => selectEntry(entry.id)}
                    >
                      <span className="pc-num">{entry.number}</span>
                      <span className="pc-text">
                        {(() => {
                          const lvl = hintLevel[entry.id] ?? 0;
                          const hl: Highlight[] =
                            lvl >= 1 || isSolved || isRevealed
                              ? [
                                  {
                                    start: entry.definitionSpan.start,
                                    end: entry.definitionSpan.end,
                                    className: 'definition',
                                    title: 'Definition',
                                  },
                                ]
                              : [];
                          return <ClueText clue={entry.clue} highlights={hl} />;
                        })()}{' '}
                        {isSolved && '✓'}
                      </span>
                    </button>

                    {!isSolved && entry.id === activeEntryId && (
                      <div className="pc-hints">
                        <button
                          type="button"
                          className="pc-hint-btn"
                          onClick={() => revealHint(entry.id, 1)}
                        >
                          Definition
                        </button>
                        <button
                          type="button"
                          className="pc-hint-btn"
                          onClick={() => revealHint(entry.id, 2)}
                        >
                          Clue type
                        </button>
                      </div>
                    )}
                    {(hintLevel[entry.id] ?? 0) >= 2 && !isSolved && (
                      <p className="pc-hint-note">
                        Device: <strong>{CLUE_TYPE_LABELS[entry.clueType]}</strong>
                      </p>
                    )}
                    {(isSolved || isRevealed) && (
                      <p className="pc-parse">{entry.hints[3].text}</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
