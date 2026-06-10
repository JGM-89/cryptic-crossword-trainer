// scripts/generate-daily.mjs
// Builds src/data/daily-schedule.json: a FIXED, seeded ordering of bank
// answers for the Daily Clue, excluding the most Play-frequent answers so the
// daily never feels like grid fill. Deterministic: same bank + archive + seed
// → same file. EPOCH and SEED are frozen forever once shipped — changing
// either rewrites every user's daily history.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const EXCLUDE_TOP = 80;
const EPOCH = '2026-06-15'; // Daily #1 (local date)
const SEED = 0x5eed_c1;

const answers = [];
for (const f of readdirSync('src/data/bank').filter((f) => /^part-[a-z]\.json$/.test(f)))
  for (const e of JSON.parse(readFileSync(`src/data/bank/${f}`, 'utf8')))
    answers.push(e.answer.toUpperCase());

const puzzles = JSON.parse(readFileSync('public/archive.json', 'utf8'));
const freq = new Map();
for (const p of puzzles)
  for (const a of new Set(p.entries.map((e) => e.answer)))
    freq.set(a, (freq.get(a) ?? 0) + 1);
const excluded = new Set(
  [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, EXCLUDE_TOP).map(([a]) => a),
);

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pool = answers.filter((a) => !excluded.has(a)).sort();
const rand = mulberry32(SEED);
for (let i = pool.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [pool[i], pool[j]] = [pool[j], pool[i]];
}

writeFileSync(
  'src/data/daily-schedule.json',
  JSON.stringify({ epoch: EPOCH, answers: pool }, null, 1),
);
console.log(`daily schedule: ${pool.length} answers (excluded top ${EXCLUDE_TOP} Play-frequent)`);
