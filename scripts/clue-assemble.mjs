// Clue pipeline — STEP 3: merge setter-agent winners back into a bank part.
// See docs/clue-pipeline.md for the full workflow.
//
//   node scripts/clue-assemble.mjs <part>
//   e.g. node scripts/clue-assemble.mjs b
//
// Reads tmp/clue-winners/<part>-*.json (each a JSON array of BankEntry winners
// written by a setter agent), merges them, and overwrites
// src/data/bank/part-<part>.json — in the ORIGINAL answer order, after asserting
// the answer SET is unchanged (rewrites must keep every answer; never add/drop).
// Exits non-zero on any mismatch so a bad batch can't silently corrupt the bank.
// After this, gate with `npm test` and run the semantic-audit agent.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const part = process.argv[2];
if (!part) {
  console.error('usage: node scripts/clue-assemble.mjs <part>');
  process.exit(1);
}

const file = `src/data/bank/part-${part}.json`;
const orig = JSON.parse(readFileSync(file, 'utf8'));
const norm = (s) => s.toUpperCase().replace(/[^A-Z]/g, '');

const winFiles = readdirSync('tmp/clue-winners')
  .filter((f) => f.startsWith(`${part}-`) && f.endsWith('.json'))
  .sort();

let merged = [];
for (const f of winFiles) merged.push(...JSON.parse(readFileSync(`tmp/clue-winners/${f}`, 'utf8')));

const origAns = orig.map((e) => norm(e.answer)).sort();
const newAns = merged.map((e) => norm(e.answer)).sort();
if (JSON.stringify(origAns) !== JSON.stringify(newAns)) {
  const o = new Set(origAns);
  const n = new Set(newAns);
  console.error(
    'ANSWER-SET MISMATCH — refusing to write.\n  files:',
    winFiles,
    '\n  missing from winners:',
    origAns.filter((a) => !n.has(a)),
    '\n  unexpected extras:',
    newAns.filter((a) => !o.has(a)),
  );
  process.exit(1);
}

const byAns = new Map(merged.map((e) => [norm(e.answer), e]));
const out = orig.map((e) => byAns.get(norm(e.answer)));
writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
console.log(`part-${part}: wrote ${out.length} entries from ${winFiles.length} chunk(s), original order`);
