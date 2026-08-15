// Bridge from the competence model to the curriculum: which device is the
// solver weakest at, and which Stage-A lesson teaches it. Powers the
// post-solve "sharpen your weakest device" path on the Daily and Home.

import { CLUE_TYPE_ORDER, type ClueType } from '../types';
import { stageRank } from '../engine/fading';
import type { ProgressState } from '../engine/progress';
import { findLesson } from './curriculum';

/**
 * The teachable device with the lowest competence stage (ties broken by fewest
 * clean solves, then teaching order). Only considers devices that have a
 * Stage-A lesson, so the result is always actionable.
 */
export function weakestDevice(state: ProgressState): ClueType {
  let weakest: ClueType = CLUE_TYPE_ORDER[0];
  let bestKey = Number.POSITIVE_INFINITY;
  CLUE_TYPE_ORDER.forEach((type, i) => {
    if (!findLesson(`A-${type}`)) return;
    const rec = state.competence[type];
    // Sort key: stage first, then clean solves, then teaching order.
    const key = stageRank(rec.stage) * 1_000_000 + rec.solvedNoHint * 1_000 + i;
    if (key < bestKey) {
      bestKey = key;
      weakest = type;
    }
  });
  return weakest;
}

/** The Stage-A lesson id that teaches a device (undefined if none exists). */
export function lessonForDevice(type: ClueType): string | undefined {
  return findLesson(`A-${type}`) ? `A-${type}` : undefined;
}
