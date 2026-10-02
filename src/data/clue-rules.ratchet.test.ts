// The Clue Bible ratchet: shipped clues may not gain RULE violations, and the
// known-violation baseline may only shrink (fixed clues must leave it).
// Regenerate after fixes: npx tsx scripts/clue-rules-baseline.ts
import { describe, expect, it } from 'vitest';
import baseline from './clue-rules.baseline.json';
import { shippedRuleViolations } from './clue-rules.shipped';

const known = baseline as Record<string, string[]>;

describe('clue rules ratchet', () => {
  const now = shippedRuleViolations();

  it('no NEW rule violations in shipped clues', () => {
    const fresh: string[] = [];
    for (const [id, rules] of Object.entries(now)) {
      for (const r of rules) if (!known[id]?.includes(r)) fresh.push(`${id}: ${r}`);
    }
    expect(fresh).toEqual([]);
  });

  it('the baseline only lists violations that still exist (shrink it when you fix one)', () => {
    const stale: string[] = [];
    for (const [id, rules] of Object.entries(known)) {
      for (const r of rules) if (!now[id]?.includes(r)) stale.push(`${id}: ${r}`);
    }
    expect(stale).toEqual([]);
  });
});
