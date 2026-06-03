// Clue pipeline — STEP 5 helper: apply targeted fixes to a bank part.
// See docs/clue-pipeline.md for the full workflow.
//
//   node scripts/clue-patch.mjs <part> <fixes.json>
//   e.g. node scripts/clue-patch.mjs b tmp/fixes-b.json
//
// <fixes.json> is an object keyed by ANSWER (uppercase) → a full BankEntry that
// REPLACES the existing entry for that answer (same answer/letters). Use it to
// apply the dubious-flag fixes a semantic-audit agent returns. Answers not in the
// fixes object are left untouched; the answer set is unchanged.
// After patching, re-validate: `npm run clues:validate -- src/data/bank/part-<part>.json`.

import { readFileSync, writeFileSync } from 'node:fs';

const part = process.argv[2];
const fixesPath = process.argv[3];
if (!part || !fixesPath) {
  console.error('usage: node scripts/clue-patch.mjs <part> <fixes.json>');
  process.exit(1);
}

const file = `src/data/bank/part-${part}.json`;
const arr = JSON.parse(readFileSync(file, 'utf8'));
const fixes = JSON.parse(readFileSync(fixesPath, 'utf8'));
const norm = (s) => s.toUpperCase().replace(/[^A-Z]/g, '');
const byKey = new Map(Object.entries(fixes).map(([k, v]) => [norm(k), v]));

const applied = [];
const out = arr.map((e) => {
  const f = byKey.get(norm(e.answer));
  if (!f) return e;
  if (norm(f.answer) !== norm(e.answer)) {
    console.error(`fix for "${e.answer}" has a different answer "${f.answer}" — refusing.`);
    process.exit(1);
  }
  applied.push(e.answer);
  return f;
});

const missing = [...byKey.keys()].filter((k) => !applied.some((a) => norm(a) === k));
if (missing.length) {
  console.error('fixes for answers not in this part:', missing);
  process.exit(1);
}

writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
console.log(`part-${part}: patched ${applied.length} entr${applied.length === 1 ? 'y' : 'ies'}: ${applied.join(', ')}`);
