import { describe, expect, it } from 'vitest';
import { CLUES } from './corpus';
import { BANK_RAW } from './bank/index';
import { fromBankEntry, fromClue, surfaceGateFlags } from './surface-rules';

// The surface CI gate — every deterministic, high-precision surface rule from
// src/data/surface-rules.ts (the single shared source, also used by
// scripts/validate-clue.ts and scripts/lint-surfaces.ts):
//   • bare word-list / raw caps fodder
//   • containment language gluing a charade (implies the wrong device)
//   • indicator absent from the surface (it is quoted verbatim in the hints)
//   • flagrant orphan words (multi-word spans of decoration the cryptic
//     reading never pays for)
// Softer signals (single decorative words, padding ratios, terseness) are
// advisory-only and live in the lint's ranking, not here.

describe('clue surfaces pass the deterministic gate', () => {
  const all = [...CLUES.map(fromClue), ...BANK_RAW.map(fromBankEntry)];

  it('no clue trips a surface gate rule', () => {
    const flagged: Record<string, string[]> = {};
    for (const e of all) {
      const issues = surfaceGateFlags(e);
      if (issues.length) flagged[`${e.id} :: ${e.clue}`] = issues;
    }
    expect(flagged).toEqual({});
  });
});
