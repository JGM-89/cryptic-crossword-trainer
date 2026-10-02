// Calibration source set for the Exam (docs/clue-bible/04-exam.md, "Calibration").
// Samples published UK broadsheet clues deterministically; an agent then makes a
// MINIMALLY corrupted copy of each (unfair or unnatural), giving matched pairs the
// exam must separate. Half the pairs are HELD OUT: never used to tune judge prompts.
//
//   node scripts/exam/calibration-set.mjs [--n 60]
//   → tmp/exam/calib-source.json  [{pair, split, answer, clue, definition, source}]
// Published clue texts stay in tmp/ (gitignored) — used for checking only.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite');
const n = Number(process.argv[process.argv.indexOf('--n') + 1]) || 60;
const db = new DatabaseSync('.corpus/clues.db', { readOnly: true });

// Deterministic: hash-ordered by rowid, from Times + Guardian/Indy/FT blogs.
const rows = db
  .prepare(
    `select rowid, clue, answer, definition, source from clues
     where source in ('times_xwd_times','fifteensquared') and clue like '%(_)' or clue like '%(__)'
     and definition is not null and length(definition) > 1`,
  )
  .all()
  .filter((r) => /^[A-Z]{4,10}$/.test(String(r.answer).replace(/[^A-Za-z]/g, '').toUpperCase()) && !/^See /.test(r.clue))
  .map((r) => ({ ...r, h: (Number(r.rowid) * 2654435761) % 4294967296 }))
  .sort((a, b) => a.h - b.h);

const seen = new Set();
const out = [];
for (const r of rows) {
  const answer = String(r.answer).replace(/[^A-Za-z]/g, '').toUpperCase();
  if (seen.has(answer)) continue;
  seen.add(answer);
  out.push({
    pair: `c${out.length + 1}`,
    split: out.length % 2 === 0 ? 'dev' : 'heldout',
    answer,
    clue: r.clue.trim(),
    definition: r.definition,
    source: r.source,
  });
  if (out.length === n) break;
}
mkdirSync('tmp/exam', { recursive: true });
writeFileSync('tmp/exam/calib-source.json', JSON.stringify(out, null, 1));
console.log(`calibration source: ${out.length} published clues (${out.filter((x) => x.split === 'dev').length} dev / ${out.filter((x) => x.split === 'heldout').length} held-out) → tmp/exam/calib-source.json`);
