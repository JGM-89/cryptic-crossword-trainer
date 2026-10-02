// The Clue Bible's machine rules (docs/clue-bible/03-rules-and-flags.md).
// Each fixture is a real failure the 2026-10-02 audit found (or its fixed form).
import { describe, expect, it } from 'vitest';
import { batchHits, checkRules, isBlocking, ruleIds, type RuleEntry } from './clue-rules';

const entry = (o: Partial<RuleEntry> & Pick<RuleEntry, 'answer' | 'clueType' | 'clue'>): RuleEntry => ({
  id: `t-${o.answer.toLowerCase()}`,
  defText: '',
  indicator: '',
  fodder: '',
  ops: [],
  ...o,
});

describe('R-FODDER-LETTERS', () => {
  it('fails when the anagram fodder is not printed as whole words (GENERAL: "enlarged" ≠ "enlarge")', () => {
    const e = entry({
      answer: 'GENERAL', clueType: 'anagram', defText: 'commander',
      clue: 'A wildly enlarged map guided the commander (7)', indicator: 'wildly', fodder: 'enlarge',
      ops: [{ op: 'anagram', input: 'ENLARGE', output: 'GENERAL' }],
    });
    expect(ruleIds(checkRules(e))).toContain('R-FODDER-LETTERS');
  });
  it('passes when the fodder is printed exactly and its letters match', () => {
    const e = entry({
      answer: 'EARTH', clueType: 'anagram', defText: 'our planet',
      clue: 'Heart pounding for our planet (5)', indicator: 'pounding', fodder: 'Heart',
      ops: [{ op: 'anagram', input: 'HEART', output: 'EARTH' }],
    });
    expect(ruleIds(checkRules(e))).not.toContain('R-FODDER-LETTERS');
  });
});

describe('R-PRINTED', () => {
  it('fails when a charade piece is printed as itself (OUTLOOK: out + look)', () => {
    const e = entry({
      answer: 'OUTLOOK', clueType: 'charade', defText: 'what lies ahead',
      clue: 'Once out, look at what lies ahead (7)', fodder: 'OUT + LOOK',
      ops: [
        { op: 'synonym', input: 'out', output: 'OUT' },
        { op: 'synonym', input: 'look', output: 'LOOK' },
        { op: 'concat', input: 'OUT+LOOK', output: 'OUTLOOK' },
      ],
    });
    expect(ruleIds(checkRules(e))).toContain('R-PRINTED');
  });
  it('allows short literal pieces like "a" or "on"', () => {
    const e = entry({
      answer: 'CHAIR', clueType: 'charade', defText: 'position of authority',
      clue: 'Cleaning-lady holds a position of authority (5)', fodder: 'CHAR + A',
      ops: [
        { op: 'synonym', input: 'Cleaning-lady', output: 'CHAR' },
        { op: 'literal', input: 'a', output: 'A' },
        { op: 'concat', input: 'CHAR+A', output: 'CHARA' },
      ],
    });
    expect(ruleIds(checkRules(e))).not.toContain('R-PRINTED');
  });
});

describe('R-ANSWER-IN-CLUE', () => {
  it('fails when the answer is printed with an inflection (WONDER: "wonders")', () => {
    const e = entry({
      answer: 'WONDER', clueType: 'deletion', defText: 'awe',
      clue: 'She wonders endlessly, lost in awe (6)', indicator: 'endlessly', fodder: 'wonders',
    });
    expect(ruleIds(checkRules(e))).toContain('R-ANSWER-IN-CLUE');
  });
  it('does not fire on a hidden word spanning a carrier', () => {
    const e = entry({ answer: 'BAT', clueType: 'hidden', clue: 'Flier in acrobatics (3)', indicator: 'in', fodder: 'acrobatics' });
    expect(ruleIds(checkRules(e))).not.toContain('R-ANSWER-IN-CLUE');
  });
});

describe('R-HIDDEN-IND', () => {
  it('fails an indicator outside the hidden-word families (COB: "past")', () => {
    const e = entry({ answer: 'COB', clueType: 'hidden', clue: 'Swan gliding past disco bar (3)', indicator: 'past', fodder: 'disco bar' });
    expect(ruleIds(checkRules(e))).toContain('R-HIDDEN-IND');
  });
  it('passes standard hidden indicators', () => {
    // Including ones a hand-written list once wrongly failed: real setters use them.
    for (const ind of ['in', 'Some of', 'conceals', 'held by', 'through', 'skirts', 'lurking in']) {
      const e = entry({ answer: 'BAT', clueType: 'hidden', clue: `x ${ind} y (3)`, indicator: ind });
      expect(ruleIds(checkRules(e))).not.toContain('R-HIDDEN-IND');
    }
  });
});

describe('R-INDICATOR-DIR', () => {
  it('fails Down-only reversal indicators (Cruci clues are standalone)', () => {
    for (const ind of ['rising', 'turned up']) {
      const e = entry({ answer: 'STAR', clueType: 'reversal', clue: `Rats ${ind} (4)`, indicator: ind });
      expect(ruleIds(checkRules(e))).toContain('R-INDICATOR-DIR');
    }
  });
  it('passes direction-free reversal indicators', () => {
    const e = entry({ answer: 'STAR', clueType: 'reversal', clue: 'Rats sent back (4)', indicator: 'sent back' });
    expect(ruleIds(checkRules(e))).not.toContain('R-INDICATOR-DIR');
  });
});

describe('R-CD-CONTRACT', () => {
  it('a cryptic definition must state its misleading and true readings', () => {
    const bare = entry({ answer: 'PANCAKE', clueType: 'cryptic-definition', clue: 'Flipping good breakfast? (7)' });
    expect(ruleIds(checkRules(bare))).toContain('R-CD-CONTRACT');
    const ok = { ...bare, pun: { misleading: '"flipping" as a mild British intensifier', true: 'a breakfast you flip in the pan' } };
    expect(ruleIds(checkRules(ok))).not.toContain('R-CD-CONTRACT');
  });
});

describe('F-IDLE (a flag: judgement call, never blocks)', () => {
  it('flags a single word that does no work in the parse', () => {
    const e = entry({
      answer: 'EARTH', clueType: 'anagram', defText: 'our planet',
      clue: 'Heart pounding wildly for our planet (5)', indicator: 'pounding', fodder: 'Heart',
      ops: [{ op: 'anagram', input: 'HEART', output: 'EARTH' }],
    });
    const hits = checkRules(e);
    expect(ruleIds(hits)).toContain('F-IDLE');
    expect(hits.some(isBlocking)).toBe(false);
  });
});

describe('F-AMERICANISM', () => {
  it('flags US spellings', () => {
    const e = entry({ answer: 'OLD', clueType: 'charade', clue: 'Aging color (3)' });
    expect(ruleIds(checkRules(e))).toContain('F-AMERICANISM');
  });
});

describe('batch rules', () => {
  const mk = (answer: string, clueType: string, indicator = '') =>
    entry({ answer, clueType, clue: `${answer} (3)`, indicator });

  it('B-DEVICE-MIX: cryptic + double definitions over 25% of a batch', () => {
    const batch = [
      mk('A1', 'cryptic-definition'), mk('A2', 'cryptic-definition'), mk('A3', 'double-definition'),
      mk('A4', 'anagram'), mk('A5', 'hidden'), mk('A6', 'charade'), mk('A7', 'reversal'), mk('A8', 'anagram'),
    ];
    expect(batchHits(batch).map((h) => h.rule)).toContain('B-DEVICE-MIX');
  });

  it('B-REPEAT: the same indicator more than twice', () => {
    const batch = [mk('B1', 'hidden', 'in'), mk('B2', 'hidden', 'in'), mk('B3', 'hidden', 'In')];
    expect(batchHits(batch).map((h) => h.rule)).toContain('B-REPEAT');
  });
});

describe('waivers', () => {
  it('a rule waived with a written reason no longer blocks, but stays visible', () => {
    const e = entry({
      answer: 'COB', clueType: 'hidden', clue: 'Swan gliding past disco bar (3)', indicator: 'past',
      waivers: [{ rule: 'R-HIDDEN-IND', reason: 'test: reason recorded for the auditor' }],
    });
    const hit = checkRules(e).find((h) => h.rule === 'R-HIDDEN-IND');
    expect(hit?.waived).toMatch(/reason/);
    expect(isBlocking(hit!)).toBe(false);
  });
  it('an empty reason does not waive', () => {
    const e = entry({ answer: 'COB', clueType: 'hidden', clue: 'x (3)', indicator: 'past', waivers: [{ rule: 'R-HIDDEN-IND', reason: ' ' }] });
    expect(checkRules(e).some(isBlocking)).toBe(true);
  });
});
