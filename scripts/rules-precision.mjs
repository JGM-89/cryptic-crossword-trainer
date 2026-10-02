// Fairness check for the Clue Bible's rules: how often does each rule fire on
// PUBLISHED broadsheet clues? A rule that fires on professional work is
// treating normal practice as a fault — demote it to a flag or fix it
// (docs/clue-bible/03-rules-and-flags.md, "rule precision").
//
//   npx tsx scripts/rules-precision.mjs [--n 20000]
//
// Published clues carry no parse, so only rules that work from the surface +
// answer can be measured here (R-ANSWER-IN-CLUE, F-AMERICANISM); indicator
// rules are derived from published usage by construction.
import { createRequire } from 'node:module';
import { checkRules } from '../src/data/clue-rules.ts';
import { UK_SOURCES } from './corpus/lib.mjs';

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite');
const n = Number(process.argv[process.argv.indexOf('--n') + 1]) || 20000;
const db = new DatabaseSync('.corpus/clues.db', { readOnly: true });
const rows = db
  .prepare(
    `select clue, answer from clues where source in (${UK_SOURCES.map(() => '?').join(',')})
     and clue is not null and answer is not null order by random() limit ?`,
  )
  .all(...UK_SOURCES, n);

const fired = {};
const examples = {};
for (const r of rows) {
  // Device unknown: treat as a non-hidden charade with no parse (only surface rules apply).
  const hits = checkRules({
    id: 'pub', answer: r.answer, clueType: 'charade', clue: r.clue,
    defText: '', indicator: '', fodder: '', ops: [],
  }).filter((h) => h.rule === 'R-ANSWER-IN-CLUE' || h.rule === 'F-AMERICANISM');
  for (const h of hits) {
    fired[h.rule] = (fired[h.rule] || 0) + 1;
    (examples[h.rule] ??= []).push(`${r.clue} → ${r.answer}`);
  }
}
console.log(`published UK clues sampled: ${rows.length}`);
for (const [rule, k] of Object.entries(fired)) {
  console.log(`${rule}: fires on ${k} (${((k / rows.length) * 100).toFixed(2)}%)`);
  for (const ex of examples[rule].slice(0, 6)) console.log(`   e.g. ${ex}`);
}
