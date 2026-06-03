// Unified clue lookup across the teaching corpus and the bank, so lessons can
// reference either (Stage A uses curated corpus clues; Stage B/C pull distinct
// clues from the bank). IDs are disjoint (corpus: `<type>-NNN`, bank: `bank-…`).

import type { Clue } from '../types';
import { CLUES } from './corpus';
import { BANK } from './bank/index';

export const ALL_CLUES: Clue[] = [...CLUES, ...BANK];

const byId = new Map(ALL_CLUES.map((c) => [c.id, c]));

export function getAnyClue(id: string): Clue | undefined {
  return byId.get(id);
}
