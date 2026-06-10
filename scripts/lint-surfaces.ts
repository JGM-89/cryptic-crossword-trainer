// Surface-quality lint for every clue (bank + teaching corpus).
//
// All rules live in src/data/surface-rules.ts — the SINGLE shared source, also
// enforced by surfaces.test.ts (CI) and validate-clue.ts (pipeline hard-gate).
// This script just reports: GATE hits fail CI; ADVISORY heuristics only rank
// suspects for the realism judge / surface grader / human review.
//
//   npx tsx scripts/lint-surfaces.ts             # GATE-flagged + advisory clues
//   npx tsx scripts/lint-surfaces.ts --ids       # just the GATE-flagged ids
//   npx tsx scripts/lint-surfaces.ts --rank      # every clue, weakest first
//   npx tsx scripts/lint-surfaces.ts --rank --src=part-b.json   # one source
//   (alias: npm run clues:lint -- --rank)

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CLUES } from '../src/data/corpus.ts';
import {
  advisoryFlags,
  fromBankEntry,
  fromClue,
  surfaceGateFlags,
  type SurfaceEntry,
} from '../src/data/surface-rules.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BANK_DIR = join(__dirname, '..', 'src', 'data', 'bank');

type Item = SurfaceEntry & { src: string };

function loadAll(): Item[] {
  const items: Item[] = CLUES.map((c) => ({ ...fromClue(c), src: 'corpus' }));
  for (const f of readdirSync(BANK_DIR).filter((f) => /^part-[a-z]\.json$/.test(f))) {
    for (const e of JSON.parse(readFileSync(join(BANK_DIR, f), 'utf8'))) {
      items.push({ ...fromBankEntry(e), src: f });
    }
  }
  return items;
}

const srcArg = (process.argv.find((a) => a.startsWith('--src=')) || '').slice(6);
let all = loadAll();
if (srcArg) all = all.filter((c) => c.src === srcArg);

const scored = all.map((c) => {
  const gate = surfaceGateFlags(c);
  const adv = advisoryFlags(c);
  return { ...c, gate, advisory: adv.issues, score: adv.score + gate.length * 3 };
});

if (process.argv.includes('--ids')) {
  console.log(scored.filter((c) => c.gate.length).map((c) => c.id).join('\n'));
} else if (process.argv.includes('--rank')) {
  const ranked = scored.slice().sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  for (const c of ranked) {
    const tags = [...c.gate.map((g) => `GATE:${g}`), ...c.advisory];
    console.log(
      `${c.score.toFixed(2).padStart(5)} [${c.src}] ${c.id}\n   "${c.clue}"${tags.length ? `\n   → ${tags.join('; ')}` : ''}`,
    );
  }
  const weak = ranked.filter((c) => c.score > 0).length;
  console.log(
    `\n${all.length} clues; ${weak} with a surface smell; ${scored.filter((c) => c.gate.length).length} trip a GATE rule.`,
  );
} else {
  const flagged = scored.filter((c) => c.gate.length || c.advisory.length);
  for (const c of flagged) {
    const tags = [...c.gate.map((g) => `GATE:${g}`), ...c.advisory];
    console.log(`[${c.src}] ${c.id}\n   "${c.clue}"\n   → ${tags.join('; ')}`);
  }
  console.log(
    `\n${flagged.length} of ${all.length} clues flagged (${scored.filter((c) => c.gate.length).length} trip a GATE rule).`,
  );
}
