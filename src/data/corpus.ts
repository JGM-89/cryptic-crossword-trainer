// The hydrated clue corpus and lookups. Kept separate from index.ts so that
// curriculum.ts can depend on it without a circular import.

import { CLUE_TYPE_ORDER, type Clue, type ClueType } from '../types';
import { RAW_CLUES } from './clues';
import { hydrateClue } from './hydrate';

export const CLUES: Clue[] = RAW_CLUES.map(hydrateClue);

const byId = new Map(CLUES.map((c) => [c.id, c]));

export function getClue(id: string): Clue | undefined {
  return byId.get(id);
}

export function cluesOfType(type: ClueType): Clue[] {
  return CLUES.filter((c) => c.clueType === type);
}

export function clueIdsByType(): Record<ClueType, string[]> {
  const out = {} as Record<ClueType, string[]>;
  for (const type of CLUE_TYPE_ORDER) {
    out[type] = cluesOfType(type).map((c) => c.id);
  }
  return out;
}
