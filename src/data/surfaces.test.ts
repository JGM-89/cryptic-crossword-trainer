import { describe, expect, it } from 'vitest';
import { CLUES } from './corpus';
import { BANK_RAW } from './bank/index';

// A conservative guard: catch only egregiously bad surfaces (a short bare
// word-list with no verb/connector, or raw all-caps fodder leaking in). This
// mirrors scripts/lint-surfaces.mjs; tuned to avoid false positives.

const CONNECTORS = new Set(
  ('a an the in on at of to for with by from and or but is are was makes make made gives give given ' +
    'has have had as into out up over about after before during not no it he she they we you one some ' +
    'any each every becomes become without within behind beside between through across back near')
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
  if (!words.some(connectorish) && words.length <= 5) out.push('bare word-list');
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
