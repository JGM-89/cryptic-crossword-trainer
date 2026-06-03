import { describe, expect, it } from 'vitest';
import { CURRICULUM, allLessons } from './curriculum';
import { getAnyClue } from './registry';

describe('curriculum stage independence', () => {
  const stageA = CURRICULUM.stages.find((s) => s.stage === 'A')!;
  const stageAIds = new Set(stageA.lessons.flatMap((l) => l.clueIds));
  const laterIds = CURRICULUM.stages
    .filter((s) => s.stage !== 'A')
    .flatMap((s) => s.lessons.flatMap((l) => l.clueIds));

  it('Stage B/C lessons share no clue IDs with Stage A (no auto-complete)', () => {
    const shared = laterIds.filter((id) => stageAIds.has(id));
    expect(shared).toEqual([]);
  });

  it('every lesson clue ID resolves to a real clue', () => {
    const missing = allLessons()
      .flatMap((l) => l.clueIds)
      .filter((id) => !getAnyClue(id));
    expect(missing).toEqual([]);
  });

  it('Stage B/C use distinct clues across their lessons', () => {
    const ids = laterIds.filter(Boolean);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
