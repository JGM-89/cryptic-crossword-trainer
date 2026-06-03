// The clue bank: ~200 originally-authored, verified single-word clues that the
// puzzle compiler draws on to assemble 13×13 grids. Authored in batches by
// answer length (part-a … part-f), merged and hydrated here, and validated by
// bank.test.ts using the same fairness checker as the teaching corpus.

import { hydrateClue, type RawClue } from '../hydrate';
import type { Clue, ClueType, DefinitionSpan, Wordplay } from '../../types';
import partA from './part-a.json';
import partB from './part-b.json';
import partC from './part-c.json';
import partD from './part-d.json';
import partE from './part-e.json';
import partF from './part-f.json';
import partG from './part-g.json';
import partH from './part-h.json';

export interface BankEntry {
  answer: string;
  clueType: string;
  difficulty: number;
  clue: string;
  def: { text: string; position: 'start' | 'end' };
  wordplay: Wordplay;
  parse: string;
}

const lettersOnly = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '');

const RAW: BankEntry[] = [
  ...partA,
  ...partB,
  ...partC,
  ...partD,
  ...partE,
  ...partF,
  ...partG,
  ...partH,
] as BankEntry[];

// Some authored entries carry the working in the operation's `input` rather
// than the free-text `fodder` field; backfill `fodder` from the first operation
// so the validator and hint generator have the real source letters.
function deriveFodder(e: BankEntry): string {
  if (e.wordplay.fodder) return e.wordplay.fodder;
  const op = e.wordplay.operations[0];
  if (!op) return '';
  if (e.clueType === 'deletion') return op.input.split(/[−–-]/)[0].trim();
  return op.input;
}

function toRawClue(e: BankEntry): RawClue {
  return {
    id: `bank-${e.answer.toLowerCase()}`,
    clueType: e.clueType as ClueType,
    difficulty: e.difficulty as RawClue['difficulty'],
    clue: e.clue,
    solution: e.answer,
    enumeration: String(lettersOnly(e.answer).length),
    def: e.def as { text: string; position: DefinitionSpan['position'] },
    wordplay: { ...e.wordplay, fodder: deriveFodder(e) },
    parse: e.parse,
  };
}

/** Hydrate a single bank entry into a full Clue (used by the archive loader). */
export function hydrateBankEntry(e: BankEntry): Clue {
  return hydrateClue(toRawClue(e));
}

export const BANK_RAW = RAW;
export const BANK: Clue[] = RAW.map(hydrateBankEntry);
