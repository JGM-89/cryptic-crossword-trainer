import { describe, expect, it } from 'vitest';
import { CLUES } from './corpus';
import { BANK_RAW } from './bank/index';

// A conservative guard: catch egregiously bad surfaces — a bare word-list with
// NO verb/connector at all (a real English sentence always has at least one), or
// raw all-caps fodder leaking in. This is the GATE subset shared verbatim with
// scripts/lint-surfaces.mjs (gateFlags) and scripts/validate-clue.ts; richer
// advisory heuristics live in lint-surfaces.mjs only. KEEP THE THREE IN SYNC.

const CONNECTORS = new Set(
  ('a an the in on at of to for with by from and or but is are was makes make made gives give ' +
    'given has have had as into out up over about after before during not no yes that this his her ' +
    'its their our your my one some any each every it he she they we you i am be being been around ' +
    'becomes become without within behind beside between through across back returns turning held ' +
    'holding taking inside outside near seen shown sound heard say said we’re we\'re')
    .split(/\s+/),
);

const connectorish = (w: string) => {
  const lw = w.toLowerCase().replace(/[^a-z’']/g, '');
  return CONNECTORS.has(lw) || (lw.length > 3 && /(ed|es|ing|ly|en|s)$/.test(lw));
};

function badSurface(clue: string): string[] {
  const body = clue.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const words = body.split(/\s+/).filter((t) => /[a-z]/i.test(t));
  const out: string[] = [];
  if (words.length && !words.some(connectorish)) out.push('bare word-list');
  if (/\b[A-Z]{3,}\b/.test(body)) out.push('raw caps fodder');
  return out;
}

describe('clue surfaces read as sentences', () => {
  const all = [
    ...CLUES.map((c) => ({ id: c.id, clue: c.clue })),
    ...BANK_RAW.map((e) => ({ id: `bank-${e.answer.toLowerCase()}`, clue: e.clue })),
  ];

  it('no clue is an egregious bare word-list or leaks raw fodder', () => {
    const flagged: Record<string, string[]> = {};
    for (const c of all) {
      const issues = badSurface(c.clue);
      if (issues.length) flagged[`${c.id} :: ${c.clue}`] = issues;
    }
    expect(flagged).toEqual({});
  });
});
