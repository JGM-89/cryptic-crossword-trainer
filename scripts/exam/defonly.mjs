// Exam add-on: the DEFINITION-ONLY probe (docs/clue-bible/04-exam.md, case law CL-054).
// Can a solver get the answer from the definition + letter count alone? If so the
// wordplay never matters (owner, Daily #111 TELEVISION: "the box" + 10 letters).
// Published anchors get the same probe, so "giveaway" is measured against
// professional practice, not in a vacuum.
//
//   node scripts/exam/defonly.mjs --run <id>     → tmp/exam/<id>/defonly-N.json
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { publishedClue } from '../corpus/lib.mjs';

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i === -1 ? d : process.argv[i + 1];
};
const run = arg('run');
const BATCH = Number(arg('batch', 150));
const DIR = join('tmp', 'exam', run);
const key = JSON.parse(readFileSync(join(DIR, 'key.json'), 'utf8'));

// Our definitions come from the bank (or the run's input entries via key.def).
const bankDef = {};
for (const f of readdirSync('src/data/bank').filter((x) => /^part-[a-z]\.json$/.test(x))) {
  for (const e of JSON.parse(readFileSync(`src/data/bank/${f}`, 'utf8'))) bankDef[e.answer.toUpperCase().replace(/[^A-Z]/g, '')] = e;
}
const WHOLE = new Set(['cryptic-definition', 'lit']);

const rows = [];
for (const [item, it] of Object.entries(key.items)) {
  let definition = it.def;
  if (!definition && it.kind === 'ours') {
    const e = bankDef[it.answer];
    if (!e || WHOLE.has(e.clueType)) continue; // the whole clue IS the definition
    definition = e.def?.text;
  }
  if (!definition && it.kind === 'anchor') definition = publishedClue(Number(String(it.src).replace('pub:', '')))?.definition;
  if (!definition || /defn|^'|definition/i.test(definition)) continue; // dataset artefacts like "‘double’ defn!"
  rows.push({ item, definition: definition.replace(/[\/]/g, ' / ').trim(), letters: it.answer.length });
}
// shuffle deterministically so ours and anchors interleave
rows.sort((a, b) => (a.item * 0 || a.item.localeCompare(b.item)) && ((a.item.charCodeAt(4) * 7919) % 97) - ((b.item.charCodeAt(4) * 7919) % 97));
const files = [];
for (let k = 0; k * BATCH < rows.length; k++) {
  const f = `defonly-${k + 1}.json`;
  writeFileSync(join(DIR, f), JSON.stringify(rows.slice(k * BATCH, (k + 1) * BATCH), null, 1));
  files.push(f);
}
console.log(`defonly: ${rows.length} items (${rows.filter((r) => key.items[r.item].kind === 'ours').length} ours) → ${files.join(', ')}`);
