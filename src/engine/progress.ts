// Aggregate progress state and the pure operations over it.
// Persistence is handled separately (persistence.ts); React wiring in state/.

import type { Clue, ClueType, Lesson, Stage } from '../types';
import {
  initialCompetence,
  recordSolve,
  stageRank,
  type CompetenceRecord,
  type SolveOutcome,
} from './fading';

export const PROGRESS_VERSION = 1;

export interface ProgressState {
  version: number;
  competence: Record<ClueType, CompetenceRecord>;
  /** clueId → how it was solved. Presence means solved. */
  solvedClues: Record<string, { hintsUsed: number }>;
  /** puzzleId → true once every entry is solved. */
  completedPuzzles: Record<string, true>;
}

export function initialProgress(): ProgressState {
  return {
    version: PROGRESS_VERSION,
    competence: initialCompetence(),
    solvedClues: {},
    completedPuzzles: {},
  };
}

/** Record a solved clue: advance the device's competence and remember it. */
export function applySolve(
  state: ProgressState,
  clue: Clue,
  outcome: SolveOutcome,
): ProgressState {
  const competence = {
    ...state.competence,
    [clue.clueType]: recordSolve(state.competence[clue.clueType], outcome),
  };
  return {
    ...state,
    competence,
    solvedClues: {
      ...state.solvedClues,
      [clue.id]: { hintsUsed: outcome.hintsUsed ?? (outcome.usedHint ? 1 : 0) },
    },
  };
}

export function markPuzzleComplete(state: ProgressState, puzzleId: string): ProgressState {
  return { ...state, completedPuzzles: { ...state.completedPuzzles, [puzzleId]: true } };
}

export function isClueSolved(state: ProgressState, clueId: string): boolean {
  return clueId in state.solvedClues;
}

/** A lesson is complete when all of its clues are solved (grid lessons: see puzzle). */
export function isLessonComplete(state: ProgressState, lesson: Lesson): boolean {
  if (lesson.clueIds.length === 0) {
    // Grid lesson (Stage D daily): complete when its puzzle is done.
    return state.completedPuzzles['daily-001'] === true;
  }
  return lesson.clueIds.every((id) => isClueSolved(state, id));
}

/**
 * Lessons unlock sequentially: the first is always open; each later lesson
 * unlocks once the previous one is complete.
 */
export function unlockedLessons(state: ProgressState, lessons: Lesson[]): Set<string> {
  const unlocked = new Set<string>();
  for (let i = 0; i < lessons.length; i++) {
    if (i === 0 || isLessonComplete(state, lessons[i - 1])) {
      unlocked.add(lessons[i].id);
    } else {
      break; // stop at the first locked lesson
    }
  }
  return unlocked;
}

export function lessonProgress(
  state: ProgressState,
  lesson: Lesson,
): { solved: number; total: number } {
  const total = lesson.clueIds.length;
  const solved = lesson.clueIds.filter((id) => isClueSolved(state, id)).length;
  return { solved, total };
}

/** Highest competence stage reached across all devices — a headline metric. */
export function topStage(state: ProgressState): Stage {
  let best: Stage = 'A';
  for (const rec of Object.values(state.competence)) {
    if (stageRank(rec.stage) > stageRank(best)) best = rec.stage;
  }
  return best;
}

/** Migrate any older persisted shape to the current one. */
export function migrate(raw: unknown): ProgressState {
  const base = initialProgress();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<ProgressState>;
  return {
    version: PROGRESS_VERSION,
    competence: { ...base.competence, ...(r.competence ?? {}) },
    solvedClues: r.solvedClues ?? {},
    completedPuzzles: r.completedPuzzles ?? {},
  };
}
