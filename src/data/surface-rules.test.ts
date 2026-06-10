import { describe, expect, it } from 'vitest';
import {
  advisoryFlags,
  coverageFlags,
  gateFlags,
  indicatorAbsent,
  linkMismatchFlags,
  type SurfaceEntry,
} from './surface-rules';

const entry = (over: Partial<SurfaceEntry>): SurfaceEntry => ({
  id: 'test',
  clue: '',
  clueType: 'charade',
  defText: '',
  indicator: '',
  fodder: '',
  opInputs: [],
  ...over,
});

describe('gateFlags (egregious surfaces)', () => {
  it('flags a bare word-list with no connector', () => {
    expect(gateFlags('Vehicle animal sort (5)')).toContain('bare word-list — no verb/connector');
  });
  it('flags raw capitalised fodder', () => {
    expect(gateFlags('Shuffle SENATOR for a crime (7)').join(' ')).toMatch(/capitalised fodder/);
  });
  it('passes a real sentence', () => {
    expect(gateFlags("Mother's boy delivers a plum (6)")).toEqual([]);
  });
});

describe('linkMismatchFlags (containment language in a charade)', () => {
  it('flags "caught in" gluing a charade', () => {
    const e = entry({
      clue: "Daughter caught in a downpour will sap one's strength (5)",
      clueType: 'charade',
      defText: "sap one's strength",
      fodder: 'D + RAIN',
      opInputs: ['Daughter', 'downpour'],
    });
    expect(linkMismatchFlags(e).join(' ')).toMatch(/containment word "in"/);
  });

  it('does not flag a containment word inside the definition text', () => {
    const e = entry({
      clue: 'Outlaw leader stuck in the mud (7)',
      clueType: 'charade',
      defText: 'stuck in the mud',
      fodder: 'BAN + KING',
      opInputs: ['Outlaw', 'leader'],
    });
    expect(linkMismatchFlags(e)).toEqual([]);
  });

  it('does not police non-charade devices', () => {
    const e = entry({
      clue: 'Line in euro performance figures (4)',
      clueType: 'hidden',
      defText: 'Line',
      indicator: 'in',
      fodder: 'euro performance',
    });
    expect(linkMismatchFlags(e)).toEqual([]);
  });
});

describe('indicatorAbsent', () => {
  it('true when the indicator is not in the surface', () => {
    const e = entry({ clue: 'Some clue text (4)', indicator: 'scrambled' });
    expect(indicatorAbsent(e)).toBe(true);
  });
  it('handles split indicators ("taking ... in")', () => {
    const e = entry({ clue: 'Cathedral head taking me in to degrade (6)', indicator: 'taking ... in' });
    expect(indicatorAbsent(e)).toBe(false);
  });
});

describe('coverageFlags (orphan words)', () => {
  it('flags decorative words covered by nothing', () => {
    const e = entry({
      clue: 'A broken crate makes the warehouse staff respond (5)',
      clueType: 'anagram',
      defText: 'respond',
      indicator: 'broken',
      fodder: 'crate',
      opInputs: ['CRATE'],
    });
    expect(coverageFlags(e).join(' ')).toMatch(/warehouse staff/);
  });

  it('grants one uncovered span per synonym-mediated op (reversal via "beer")', () => {
    const e = entry({
      clue: 'Returned beer fit for a king (5)',
      clueType: 'reversal',
      defText: 'fit for a king',
      indicator: 'Returned',
      fodder: 'lager',
      opInputs: ['LAGER'],
    });
    expect(coverageFlags(e)).toEqual([]);
  });

  it('passes a fully-working hidden clue', () => {
    const e = entry({
      clue: 'Some drunk needs a joint (4)',
      clueType: 'hidden',
      defText: 'a joint',
      indicator: 'Some',
      fodder: 'drunk needs',
      opInputs: ['dru<NK NEE>ds'],
    });
    expect(coverageFlags(e)).toEqual([]);
  });

  it('treats standard link grammar ("in" joining wordplay to definition) as glue', () => {
    const e = entry({
      clue: 'Forts stormed in the cold (5)',
      clueType: 'anagram',
      defText: 'the cold',
      indicator: 'stormed',
      fodder: 'Forts',
      opInputs: ['FORTS'],
    });
    expect(coverageFlags(e)).toEqual([]);
  });

  it('demotes a single decorative word to advisory, not gate', () => {
    const e = entry({
      clue: 'Wife in searing pain, cursing (8)',
      clueType: 'container',
      defText: 'cursing',
      indicator: 'in',
      fodder: 'W in SEARING',
      opInputs: ['Wife', 'searing', 'W in SEARING'],
    });
    expect(coverageFlags(e)).toEqual([]); // not a gate hit…
    expect(advisoryFlags(e).issues.join(' ')).toMatch(/pain/); // …but ranked for review
  });

  it('skips whole-clue-definition devices', () => {
    const e = entry({
      clue: 'Not seeing window covering (5)',
      clueType: 'double-definition',
      defText: 'Not seeing',
      fodder: 'Not seeing / window covering',
    });
    expect(coverageFlags(e)).toEqual([]);
  });
});

describe('advisoryFlags', () => {
  it('does not call a short double-definition terse', () => {
    const e = entry({ clue: 'Greet the breaker (4)', clueType: 'double-definition' });
    expect(advisoryFlags(e).issues.join(' ')).not.toMatch(/terse/);
  });
  it('still calls a short wordplay clue terse', () => {
    const e = entry({ clue: 'Sketch a tie (4)', clueType: 'double-definition' });
    // double-def exempt…
    expect(advisoryFlags(e).issues.join(' ')).not.toMatch(/terse/);
    // …but the same surface on a wordplay device is not.
    const e2 = entry({ clue: 'Dull team playing (4)', clueType: 'anagram' });
    expect(advisoryFlags(e2).issues.join(' ')).toMatch(/terse/);
  });
});
