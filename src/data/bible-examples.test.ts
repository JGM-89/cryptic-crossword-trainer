// Every worked example in the Clue Bible (docs/clue-bible/examples/*.json) is
// checked against the real validator, surface gate and blocking rules, so the
// Bible cannot teach an example the machinery contradicts.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { hydrateBankEntry, type BankEntry } from './bank/index';
import { validateClue } from './integrity';
import { fromBankEntry, surfaceGateFlags } from './surface-rules';
import { checkRules, isBlocking, ruleEntryFromBank } from './clue-rules';

interface Example {
  id: string;
  verdict: 'pass' | 'fail';
  failsWith?: string;
  why: string;
  entry: BankEntry;
}

const DIR = join(process.cwd(), 'docs', 'clue-bible', 'examples');
const files = readdirSync(DIR).filter((f) => f.endsWith('.json'));
const examples: Example[] = files.flatMap((f) => JSON.parse(readFileSync(join(DIR, f), 'utf8')) as Example[]);

function problems(e: BankEntry): string[] {
  const out: string[] = [];
  try {
    out.push(...validateClue(hydrateBankEntry(e)));
  } catch (err) {
    out.push(`hydrate: ${(err as Error).message}`);
  }
  out.push(...surfaceGateFlags(fromBankEntry(e)));
  out.push(...checkRules(ruleEntryFromBank(e)).filter(isBlocking).map((h) => `${h.rule}: ${h.detail}`));
  return out;
}

describe('Clue Bible examples are executable', () => {
  it('example ids are unique and every example says why it is there', () => {
    const ids = examples.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(examples.filter((x) => !x.why?.trim()).map((x) => x.id)).toEqual([]);
  });

  for (const x of examples) {
    it(`${x.id} (${x.verdict})`, () => {
      const p = problems(x.entry);
      if (x.verdict === 'pass') expect(p).toEqual([]);
      else expect(p.join(' | ')).toMatch(new RegExp(x.failsWith ?? '.'));
    });
  }
});
