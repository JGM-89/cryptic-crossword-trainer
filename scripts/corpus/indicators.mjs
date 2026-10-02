// Build Cruci's indicator lists from real usage: every indicator that published
// broadsheet setters have used at least MIN times for a device (George Ho's
// dataset, `indicators` table). Indicator words are short factual vocabulary,
// not clue text, so the lists are committed (src/data/indicators/*.json) and
// rules check against them — a rule never rejects an indicator real setters use.
//
//   node scripts/corpus/indicators.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { publishedIndicators } from './lib.mjs';

const MIN = 1;
const DEVICES = ['hidden', 'anagram', 'container', 'insertion', 'reversal', 'deletion', 'homophone', 'alternation'];

mkdirSync('src/data/indicators', { recursive: true });
for (const d of DEVICES) {
  const list = publishedIndicators(d)
    .filter((x) => x.n >= MIN)
    .map((x) => x.indicator.toLowerCase().trim())
    .filter((x, i, all) => x && all.indexOf(x) === i)
    .sort();
  writeFileSync(`src/data/indicators/${d}.json`, JSON.stringify(list, null, 0).replace(/","/g, '",\n"') + '\n');
  console.log(`${d}: ${list.length} indicators used ≥${MIN}× by published setters`);
}
