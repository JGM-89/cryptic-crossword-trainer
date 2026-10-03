// Calibration for cryptic definitions (CL-055): can the exam tell a real cryptic
// definition (a pun with two readings) from a "quiz" clue — a plain description
// of the answer with a "?" bolted on? The audits found our batches drifting to
// quiz clues while the exam scored cryptic definitions highest of any device.
//
//   node scripts/exam/calibration-cd.mjs [--n 30]
//   → tmp/exam/calib-cd-source.json [{pair, split, answer, clue, definition, source}]
// An agent then writes the matched "quiz" version of each (tmp/exam/calib-cd-bad.json).
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite');
const n = Number(process.argv[process.argv.indexOf('--n') + 1]) || 30;
const db = new DatabaseSync('.corpus/clues.db', { readOnly: true });
const norm = (s) => String(s ?? '').toLowerCase().replace(/\s*\([^)]*\)\s*$/, '').replace(/[^a-z ]/g, '').trim();

// Published cryptic definitions: clue ends "? (n)" and the blog marked the WHOLE
// clue as the definition.
const rows = db
  .prepare(
    `select rowid, clue, answer, definition, source from clues
     where source in ('times_xwd_times','fifteensquared') and clue like '%? (%' and definition is not null`,
  )
  .all()
  .filter((r) => norm(r.definition) === norm(r.clue) && norm(r.clue).split(' ').length >= 3)
  .filter((r) => /^[A-Z]{4,10}$/.test(String(r.answer).replace(/[^A-Za-z]/g, '').toUpperCase()))
  .map((r) => ({ ...r, h: (Number(r.rowid) * 2654435761) % 4294967296 }))
  .sort((a, b) => a.h - b.h);

const seen = new Set();
const out = [];
for (const r of rows) {
  const answer = String(r.answer).replace(/[^A-Za-z]/g, '').toUpperCase();
  if (seen.has(answer)) continue;
  seen.add(answer);
  out.push({ pair: `d${out.length + 1}`, split: out.length % 4 < 2 ? 'dev' : 'heldout', answer, clue: r.clue.trim(), definition: r.definition, source: r.source });
  if (out.length === n) break;
}
mkdirSync('tmp/exam', { recursive: true });
writeFileSync('tmp/exam/calib-cd-source.json', JSON.stringify(out, null, 1));
console.log(`cryptic-definition calibration source: ${out.length} published CDs → tmp/exam/calib-cd-source.json`);
