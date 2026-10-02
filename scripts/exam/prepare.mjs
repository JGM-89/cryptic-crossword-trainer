// The Exam, step 0: prepare blind judging batches (docs/clue-bible/04-exam.md).
//
//   node scripts/exam/prepare.mjs --run <id> --input <entries.json> [--anchors 2] [--batch 60]
//   node scripts/exam/prepare.mjs --run <id> --bank           # every shipped bank clue
//
// <entries.json>: an array of BankEntry (our clues/candidates). Optional extra
// fields: `label` ("good" | "bad", calibration only) and `pair` (matched-pair id).
//
// Writes tmp/exam/<run>/:
//   key.json            item id → {kind, answer, src, label, pair} (NEVER shown to judges)
//   coldsolve-N.json    [{item, clue}]                  ours only (calibration: all)
//   surface-N.json      [{pair, A, B}]                  bare surfaces, no answers
//   wit-N.json          [{pair, answer, A, B}]          answer revealed, judges parse both
//   evidence.json       definitions/synonyms that need an auditor (F-DEF-EVIDENCE etc.)
// Every comparison appears in BOTH orders (A/B swapped) in different batches, to
// cancel position bias. Anchors are published UK clues for the same answer; they
// are used for judging only and never leave tmp/.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { publishedClues, wordnetLink } from '../corpus/lib.mjs';

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i === -1 ? d : process.argv[i + 1];
};
const run = arg('run');
if (!run) throw new Error('--run <id> required');
const ANCHORS = Number(arg('anchors', 2));
const BATCH = Number(arg('batch', 60));
const OUT = join('tmp', 'exam', run);
mkdirSync(OUT, { recursive: true });

// Deterministic shuffle (seeded by run id) so a run can be rebuilt identically.
let seed = [...run].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const shuffle = (a) => a.map((x) => [rnd(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
const letters = (s) => s.toUpperCase().replace(/[^A-Z]/g, '');
const withEnum = (clue, answer) => (/\(\d[\d,\- ]*\)\s*$/.test(clue) ? clue.trim() : `${clue.trim()} (${letters(answer).length})`);

const entries = process.argv.includes('--bank')
  ? readdirSync('src/data/bank')
      .filter((f) => /^part-[a-z]\.json$/.test(f))
      .flatMap((f) => JSON.parse(readFileSync(`src/data/bank/${f}`, 'utf8')))
  : JSON.parse(readFileSync(arg('input'), 'utf8'));

const key = {};
let n = 0;
const id = () => `i${(++n).toString(36).padStart(4, '0')}`;
const groups = new Map(); // answer → [item ids]
const ours = [];

for (const e of entries) {
  const iid = id();
  key[iid] = { kind: 'ours', answer: letters(e.answer), src: e.answer, clueType: e.clueType, label: e.label, pair: e.pair, corruption: e.corruption, clue: withEnum(e.clue, e.answer) };
  ours.push(iid);
  const g = groups.get(key[iid].answer) ?? [];
  g.push(iid);
  groups.set(key[iid].answer, g);
}

// Anchors: published UK clues for the same answer (skip near-copies of ours).
for (const [answer, ids] of groups) {
  if (!ANCHORS) break;
  const oursText = ids.map((i) => key[i].clue.toLowerCase());
  const pool = shuffle(publishedClues(answer)).filter(
    (p) => p.clue.length > 8 && !p.clue.startsWith('See ') && !oursText.some((t) => t.startsWith(p.clue.toLowerCase().slice(0, 20))),
  );
  for (const p of pool.slice(0, ANCHORS)) {
    const aid = id();
    key[aid] = { kind: 'anchor', answer, src: `pub:${p.rowid}`, source: p.source, clue: withEnum(p.clue, answer) };
    ids.push(aid);
  }
}

// Comparisons: within each answer group, every ours-vs-anything pair, both orders.
const comparisons = [];
for (const [answer, ids] of groups) {
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (key[ids[i]].kind !== 'ours' && key[ids[j]].kind !== 'ours') continue;
      comparisons.push({ answer, a: ids[i], b: ids[j] }, { answer, a: ids[j], b: ids[i] });
    }
  }
}
const ordered = shuffle(comparisons).map((c, k) => ({ ...c, pair: `p${k.toString(36)}` }));
// Put the two orders of the same comparison in different batches where possible.
const first = ordered.filter((_, k) => k % 2 === 0);
const second = ordered.filter((_, k) => k % 2 === 1);
const allPairs = [...first, ...second];
const pairKey = Object.fromEntries(allPairs.map((c) => [c.pair, { a: c.a, b: c.b, answer: c.answer }]));

const write = (name, arr) => {
  const files = [];
  for (let k = 0; k * BATCH < arr.length; k++) {
    const f = `${name}-${k + 1}.json`;
    writeFileSync(join(OUT, f), JSON.stringify(arr.slice(k * BATCH, (k + 1) * BATCH), null, 1));
    files.push(f);
  }
  return files;
};

const solveItems = shuffle(Object.keys(key).filter((k) => key[k].kind === 'ours' || key[k].label)).map((k) => ({ item: k, clue: key[k].clue }));
const files = {
  coldsolve: write('coldsolve', solveItems),
  surface: write('surface', allPairs.map((c) => ({ pair: c.pair, A: key[c.a].clue.replace(/\s*\([^)]*\)\s*$/, ''), B: key[c.b].clue.replace(/\s*\([^)]*\)\s*$/, '') }))),
  wit: write('wit', allPairs.map((c) => ({ pair: c.pair, answer: c.answer, A: key[c.a].clue, B: key[c.b].clue }))),
};

// Evidence: definitions the dictionaries don't back, for the auditor.
const evidence = process.argv.includes('--no-evidence') ? [] : entries
  .filter((e) => !['cryptic-definition', 'lit'].includes(e.clueType) && e.def?.text && !wordnetLink(e.def.text, e.answer))
  .map((e) => ({ answer: letters(e.answer), clue: e.clue, definition: e.def.text, parse: e.parse }));
writeFileSync(join(OUT, 'evidence.json'), JSON.stringify(evidence, null, 1));
writeFileSync(join(OUT, 'key.json'), JSON.stringify({ items: key, pairs: pairKey, files }, null, 1));

console.log(
  `run ${run}: ${ours.length} clues, ${Object.keys(key).length - ours.length} anchors, ` +
    `${allPairs.length} comparisons (both orders) → ${files.surface.length} surface + ${files.wit.length} wit batches, ` +
    `${solveItems.length} cold-solve items (${files.coldsolve.length} batches), ${evidence.length} evidence items → ${OUT}`,
);
