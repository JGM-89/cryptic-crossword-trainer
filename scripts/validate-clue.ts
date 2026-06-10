// CLI hard-gate for candidate clues — reuses the REAL validator + surface gate,
// so the clue-quality pipeline never ships anything integrity.ts or
// surface-rules.ts would reject.
//
// Usage:
//   npx tsx scripts/validate-clue.ts <path-to-json>
//   echo '<json>' | npx tsx scripts/validate-clue.ts -
// where the JSON is a single BankEntry or an array of BankEntry objects:
//   { answer, clueType, difficulty, clue, def:{text,position}, wordplay:{indicator,fodder,operations[]}, parse }
//
// Prints a JSON report: [{ answer, ok, errors:[...] }].  ok === true means the
// candidate passes the mechanical gate (validateClue: letter mechanics,
// abbreviations, composition/letter-accounting) AND the deterministic surface
// gate (word-list/caps, charade containment-glue, indicator-in-surface,
// flagrant orphan words).

import { readFileSync } from 'node:fs';
import { hydrateBankEntry, type BankEntry } from '../src/data/bank/index.ts';
import { validateClue } from '../src/data/integrity.ts';
import { fromBankEntry, surfaceGateFlags } from '../src/data/surface-rules.ts';

function readInput(): string {
  const arg = process.argv[2];
  if (!arg || arg === '-') return readFileSync(0, 'utf8');
  return readFileSync(arg, 'utf8');
}

function main() {
  const raw = JSON.parse(readInput());
  const entries: BankEntry[] = Array.isArray(raw) ? raw : [raw];
  const report = entries.map((e) => {
    const errors: string[] = [];
    try {
      const clue = hydrateBankEntry(e);
      errors.push(...validateClue(clue));
    } catch (err) {
      errors.push(`hydrate/validate threw: ${(err as Error).message}`);
    }
    try {
      errors.push(...surfaceGateFlags(fromBankEntry(e)).map((s) => `surface: ${s}`));
    } catch (err) {
      errors.push(`surface gate threw: ${(err as Error).message}`);
    }
    return { answer: e.answer, ok: errors.length === 0, errors };
  });
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  const anyBad = report.some((r) => !r.ok);
  process.exit(anyBad ? 1 : 0);
}

main();
