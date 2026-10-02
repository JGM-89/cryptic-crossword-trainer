// Par rubric — STEP 3: combine the baseline with the blind judges' votes and
// write `par` onto every bank entry (docs/clue-style.md §7b).
//
//   node scripts/par-apply.mjs
//
// Reads tmp/par/baseline.json and tmp/par/judge-{1,2,3}-batch-{1,2}.json.
// D and E are each the majority (median) of three 0/1 votes.
// par = clamp(A + B + C + D + E, 2, 6). Writes tmp/par/flags.json (pars that
// look out of line with the clue's difficulty rating) and prints the spread.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'tmp/par';
const BANK_DIR = 'src/data/bank';
const letters = (s) => s.toUpperCase().replace(/[^A-Z]/g, '');
const clamp = (n) => Math.max(2, Math.min(6, n));

const baseline = JSON.parse(readFileSync(join(DIR, 'baseline.json'), 'utf8'));

// votes[answer] = { D: number[], E: number[] }
const votes = {};
for (const j of [1, 2, 3]) {
  for (const b of [1, 2]) {
    const file = join(DIR, `judge-${j}-batch-${b}.json`);
    if (!existsSync(file)) throw new Error(`missing ${file}`);
    for (const v of JSON.parse(readFileSync(file, 'utf8'))) {
      const a = letters(v.id);
      votes[a] ??= { D: [], E: [] };
      votes[a].D.push(v.D ? 1 : 0);
      votes[a].E.push(v.E ? 1 : 0);
    }
  }
}

// Editor's calls on flagged pars (reviewed by hand; keep the reason).
const OVERRIDES = {
  PANCAKE: { par: 4, why: 'chestnut cryptic definition — most improvers see the flip quickly' },
  PARTNERSHIP: { par: 4, why: 'transparent charade pieces; length alone was inflating it' },
  PHEASANT: { par: 3, why: 'surface all but spells out the container' },
  THREAD: { par: 3, why: 'hidden across a word break is harder than its device suggests' },
};

const majority = (xs) => (xs.reduce((s, x) => s + x, 0) >= 2 ? 1 : 0);
const pars = {};
const flags = [];
for (const [answer, f] of Object.entries(baseline)) {
  const v = votes[answer];
  if (!v || v.D.length !== 3 || v.E.length !== 3) {
    throw new Error(`${answer}: expected 3 judge votes, got ${v ? v.D.length : 0}`);
  }
  const D = majority(v.D);
  const E = majority(v.E);
  const par = clamp(f.A + f.B + f.C + D + E);
  pars[answer] = OVERRIDES[answer]?.par ?? par;
  if (OVERRIDES[answer]) continue;
  if ((f.difficulty <= 2 && par >= 5) || (f.difficulty >= 4 && par <= 2)) {
    flags.push({ answer, difficulty: f.difficulty, par, ...f, D, E, votes: v });
  }
}

// Write par into each part, preserving that file's layout.
const parts = [...new Set(Object.values(baseline).map((f) => f.part))].sort();
for (const p of parts) {
  const file = join(BANK_DIR, `part-${p}.json`);
  const text = readFileSync(file, 'utf8');
  const arr = JSON.parse(text).map((e) => ({ ...e, par: pars[letters(e.answer)] }));
  const onePerLine = !text.startsWith('[\n');
  const out = onePerLine
    ? '[' + arr.map((e) => JSON.stringify(e)).join(',\n') + ']'
    : JSON.stringify(arr, null, 2) + '\n';
  writeFileSync(file, out);
}

writeFileSync(join(DIR, 'flags.json'), JSON.stringify(flags, null, 2));
const spread = {};
for (const p of Object.values(pars)) spread[p] = (spread[p] || 0) + 1;
console.log('par spread:', spread);
console.log(`flags: ${flags.length} → ${DIR}/flags.json`);
