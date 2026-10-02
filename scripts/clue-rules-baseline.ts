// Regenerate the ratchet baseline of known RULE violations in shipped clues.
// The baseline may only SHRINK: clue-rules.ratchet.test.ts fails on any new
// violation and on any listed violation that has since been fixed (so fixes
// must remove their entry here). Run after fixing clues:
//   npx tsx scripts/clue-rules-baseline.ts
import { writeFileSync } from 'node:fs';
import { shippedRuleViolations } from '../src/data/clue-rules.shipped.ts';

const v = shippedRuleViolations();
writeFileSync('src/data/clue-rules.baseline.json', JSON.stringify(v, null, 2) + '\n');
const n = Object.values(v).reduce((s, xs) => s + xs.length, 0);
console.log(`baseline: ${n} violations across ${Object.keys(v).length} clues`);
