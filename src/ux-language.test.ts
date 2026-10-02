// Enforce docs/ux-language.md: one name per concept in user-facing copy.
// Scans page/component SOURCES (not built output) for banned phrasings.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIRS = ['src/pages', 'src/components'];

// Banned phrase → the approved word (see docs/ux-language.md).
const BANNED: { re: RegExp; useInstead: string }[] = [
  { re: /today[’']s clue/i, useInstead: 'the Daily / Solve today’s Daily' },
  { re: /daily clue/i, useInstead: 'the Daily (page title: Daily #N)' },
  { re: /daily cryptic/i, useInstead: 'the Daily (or Graduation Cryptic №1 for the hand-built grid)' },
  { re: /back catalogue|old clues/i, useInstead: 'the Daily archive' },
  // Owner decision 2026-10-02: copy never says who writes the clues (human or AI).
  { re: /hand-?(clued|crafted|built|written)|originally authored|written by (a )?(human|ai|machine)|ai[- ](written|generated)/i, useInstead: 'neutral copy — say clues are checked/verified, not who wrote them' },
];

function sources(): { file: string; text: string }[] {
  const out: { file: string; text: string }[] = [];
  for (const dir of DIRS) {
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.tsx'))) {
      out.push({ file: join(dir, f), text: readFileSync(join(dir, f), 'utf8') });
    }
  }
  return out;
}

describe('UX language glossary', () => {
  it('no banned phrasing in page/component copy', () => {
    const hits: string[] = [];
    for (const { file, text } of sources()) {
      for (const { re, useInstead } of BANNED) {
        const m = text.match(re);
        if (m) hits.push(`${file}: "${m[0]}" — use ${useInstead}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
