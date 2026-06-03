// Clue pipeline — STEP 1: chunk a bank part's incumbents for setter agents.
// See docs/clue-pipeline.md for the full workflow.
//
//   node scripts/clue-chunk.mjs <part> [chunks=5]
//   e.g. node scripts/clue-chunk.mjs b 5
//
// Writes slim incumbent records (answer/clueType/difficulty/clue/def) to
// tmp/in/<part>-1.json … tmp/in/<part>-N.json. Hand each chunk file to one
// setter agent (see the SETTER prompt template in docs/clue-pipeline.md).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const part = process.argv[2];
const chunks = Number(process.argv[3] || 5);
if (!part) {
  console.error('usage: node scripts/clue-chunk.mjs <part> [chunks=5]');
  process.exit(1);
}

mkdirSync('tmp/in', { recursive: true });
const arr = JSON.parse(readFileSync(`src/data/bank/part-${part}.json`, 'utf8'));
const slim = arr.map((e) => ({
  answer: e.answer,
  clueType: e.clueType,
  difficulty: e.difficulty,
  clue: e.clue,
  def: e.def.text,
}));

const n = Math.ceil(slim.length / chunks);
let written = 0;
for (let i = 0; i < chunks; i++) {
  const c = slim.slice(i * n, (i + 1) * n);
  if (c.length) {
    writeFileSync(`tmp/in/${part}-${i + 1}.json`, JSON.stringify(c, null, 2));
    written++;
  }
}
console.log(`part-${part}: ${slim.length} entries -> ${written} chunk files (tmp/in/${part}-*.json)`);
