import { describe, expect, it } from 'vitest';
import { lessonForDevice, weakestDevice } from './weakest';
import { initialProgress, applySolve } from '../engine/progress';
import { CLUES } from './corpus';
import { CLUE_TYPE_ORDER } from '../types';

describe('weakest device → lesson bridge', () => {
  it('a fresh solver is weakest at the first teachable device', () => {
    expect(weakestDevice(initialProgress())).toBe(CLUE_TYPE_ORDER[0]); // 'hidden'
  });

  it('progressing one device makes another the weakest', () => {
    let state = initialProgress();
    const hidden = CLUES.filter((c) => c.clueType === 'hidden');
    for (const clue of hidden) {
      state = applySolve(state, clue, { usedHint: false, hintsUsed: 0 });
    }
    expect(weakestDevice(state)).not.toBe('hidden');
    expect(CLUE_TYPE_ORDER).toContain(weakestDevice(state));
  });

  it('every teachable device resolves to a real Stage-A lesson id', () => {
    for (const type of CLUE_TYPE_ORDER) {
      expect(lessonForDevice(type)).toBe(`A-${type}`);
    }
  });
});
