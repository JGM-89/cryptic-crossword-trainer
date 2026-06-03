// CLI hard-gate for candidate clues — reuses the REAL validator + surface lint,
// so the clue-quality pipeline never ships anything integrity.ts would reject.
//
// Usage:
//   npx tsx scripts/validate-clue.ts <path-to-json>
//   echo '<json>' | npx tsx scripts/validate-clue.ts -
// where the JSON is a single BankEntry or an array of BankEntry objects:
//   { answer, clueType, difficulty, clue, def:{text,position}, wordplay:{indicator,fodder,operations[]}, parse }
//
// Prints a JSON report: [{ answer, ok, errors:[...] }].  ok === true means the
// candidate passes the mechanical gate (validateClue) AND the surface lint.

import { readFileSync } from 'node:fs';
import { hydrateBankEntry, type BankEntry } from '../src/data/bank/index.ts';
import { validateClue } from '../src/data/integrity.ts';

// Mirror of scripts/lint-surfaces.mjs / surfaces.test.ts — keep in sync.
const CONNECTORS = new Set(
  ('a an the in on at of to for with by from and or but is are was makes make made gives give given ' +
    'has have had as into out up over about after before during not no it he she they we you one some ' +
    'any each every becomes become without within behind beside between through across back near')
    .split(/\s+/),
);
const connectorish = (w: string) => {
  const lw = w.toLowerCase().replace(/[^a-z’']/g, '');
  return CONNECTORS.has(lw) || (lw.length > 3 && /(ed|es|ing|ly|en|s)$/.test(lw));
};
function badSurface(clue: string): string[] {
  const body = clue.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const words = body.split(/\s+/).filter((t) => /[a-z]/i.test(t));
  const out: string[] = [];
  if (!words.some(connectorish) && words.length <= 5) out.push('bare word-list');
  if (/\b[A-Z]{3,}\b/.test(body)) out.push('raw caps fodder');
  return out;
}

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
    errors.push(...badSurface(e.clue).map((s) => `surface: ${s}`));
    return { answer: e.answer, ok: errors.length === 0, errors };
  });
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  const anyBad = report.some((r) => !r.ok);
  process.exit(anyBad ? 1 : 0);
}

main();
