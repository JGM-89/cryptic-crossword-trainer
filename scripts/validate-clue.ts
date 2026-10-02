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
// Prints a JSON report: { clues: [{ answer, ok, errors:[...], warnings:[...] }], batch: [...] }.  ok === true means the
// candidate passes the mechanical gate (validateClue: letter mechanics,
// abbreviations, composition/letter-accounting) AND the deterministic surface
// gate (word-list/caps, charade containment-glue, indicator-in-surface,
// flagrant orphan words).

import { readFileSync } from 'node:fs';
import { hydrateBankEntry, type BankEntry } from '../src/data/bank/index.ts';
import { validateClue } from '../src/data/integrity.ts';
import { fromBankEntry, surfaceGateFlags } from '../src/data/surface-rules.ts';
import { batchHits, checkRules, isBlocking, ruleEntryFromBank } from '../src/data/clue-rules.ts';

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
    // Clue Bible rules (docs/clue-bible/03-rules-and-flags.md): R-* block, F-* warn.
    const warnings: string[] = [];
    try {
      for (const h of checkRules(ruleEntryFromBank(e))) {
        (isBlocking(h) ? errors : warnings).push(`${h.rule}: ${h.detail}`);
      }
    } catch (err) {
      errors.push(`clue rules threw: ${(err as Error).message}`);
    }
    return { answer: e.answer, ok: errors.length === 0, errors, warnings };
  });
  // Batch rules apply when validating a set of new clues together.
  const batch = entries.length > 1 ? batchHits(entries.map(ruleEntryFromBank)) : [];
  process.stdout.write(JSON.stringify({ clues: report, batch }, null, 2) + '\n');
  const anyBad = report.some((r) => !r.ok); // batch rules are flags (spec revision 2)
  process.exit(anyBad ? 1 : 0);
}

main();
