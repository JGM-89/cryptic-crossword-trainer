// RULE violations across every shipped clue (bank + teaching corpus), keyed by
// clue id → sorted rule ids. Shared by the ratchet test and the baseline script.
import { BANK_RAW } from './bank/index';
import { CLUES } from './corpus';
import { checkRules, isBlocking, ruleEntryFromBank, ruleEntryFromClue } from './clue-rules';

export function shippedRuleViolations(): Record<string, string[]> {
  const all = [...BANK_RAW.map(ruleEntryFromBank), ...CLUES.map(ruleEntryFromClue)];
  const out: Record<string, string[]> = {};
  for (const e of all) {
    const ids = [...new Set(checkRules(e).filter(isBlocking).map((h) => h.rule))].sort();
    if (ids.length) out[e.id] = ids;
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}
