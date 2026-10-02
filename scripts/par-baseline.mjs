// Par rubric — STEP 1: the mechanical factors (docs/clue-style.md §7b).
//
//   node scripts/par-baseline.mjs
//
// Computes A (crossing-letter allowance), B (one hint) and C (layered wordplay)
// for every bank clue, and writes the blind-judge batches for D (oblique
// definition) and E (misdirection). Judges never see A/B/C.
//
// Output: tmp/par/baseline.json, tmp/par/batch-1.json, tmp/par/batch-2.json

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BANK_DIR = 'src/data/bank';
const OUT = 'tmp/par';
mkdirSync(OUT, { recursive: true });

const letters = (s) => s.toUpperCase().replace(/[^A-Z]/g, '');

/** A: a full grid checks about half the letters; par allows half of those. */
export function letterAllowance(n) {
  return n <= 6 ? 1 : n <= 10 ? 2 : 3;
}

/** C: two or more real operations, any abbreviation, or a cryptic definition. */
function layered(e) {
  const ops = e.wordplay.operations.filter((o) => !['literal', 'synonym'].includes(o.op));
  return ops.length >= 2 ||
    e.wordplay.operations.some((o) => o.op === 'abbreviate') ||
    e.clueType === 'cryptic-definition'
    ? 1
    : 0;
}

const baseline = {};
const items = [];
for (const f of readdirSync(BANK_DIR).filter((f) => /^part-[a-z]\.json$/.test(f)).sort()) {
  for (const e of JSON.parse(readFileSync(join(BANK_DIR, f), 'utf8'))) {
    const answer = letters(e.answer);
    baseline[answer] = {
      part: f.slice(5, 6),
      difficulty: e.difficulty,
      A: letterAllowance(answer.length),
      B: 1,
      C: layered(e),
    };
    items.push({
      id: answer,
      clue: e.clue,
      type: e.clueType,
      definition: e.def.text,
      parse: e.parse,
    });
  }
}

const half = Math.ceil(items.length / 2);
writeFileSync(join(OUT, 'baseline.json'), JSON.stringify(baseline, null, 2));
writeFileSync(join(OUT, 'batch-1.json'), JSON.stringify(items.slice(0, half), null, 1));
writeFileSync(join(OUT, 'batch-2.json'), JSON.stringify(items.slice(half), null, 1));
console.log(`baseline for ${items.length} clues → ${OUT}/ (batches of ${half} / ${items.length - half})`);
