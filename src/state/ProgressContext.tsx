// React binding for the competence engine. Loads persisted progress once,
// holds it in state, and writes through to IndexedDB on every change.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Clue, ClueType } from '../types';
import type { CompetenceRecord, SolveOutcome } from '../engine/fading';
import {
  applySolve,
  initialProgress,
  markPuzzleComplete,
  type ProgressState,
} from '../engine/progress';
import { clearProgress, loadProgress, saveProgress } from '../engine/persistence';

interface ProgressContextValue {
  state: ProgressState;
  loaded: boolean;
  competenceFor: (type: ClueType) => CompetenceRecord;
  solveClue: (clue: Clue, outcome: SolveOutcome) => void;
  completePuzzle: (puzzleId: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(initialProgress);
  const [loaded, setLoaded] = useState(false);
  // Skip persisting the very first hydrate-from-disk render.
  const hydrated = useRef(false);

  useEffect(() => {
    let active = true;
    loadProgress().then((s) => {
      if (!active) return;
      setState(s);
      setLoaded(true);
      hydrated.current = true;
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    void saveProgress(state);
  }, [state]);

  const solveClue = useCallback((clue: Clue, outcome: SolveOutcome) => {
    setState((s) => applySolve(s, clue, outcome));
  }, []);

  const completePuzzle = useCallback((puzzleId: string) => {
    setState((s) => markPuzzleComplete(s, puzzleId));
  }, []);

  const competenceFor = useCallback(
    (type: ClueType) => state.competence[type],
    [state.competence],
  );

  const reset = useCallback(() => {
    void clearProgress();
    setState(initialProgress());
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({ state, loaded, competenceFor, solveClue, completePuzzle, reset }),
    [state, loaded, competenceFor, solveClue, completePuzzle, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
