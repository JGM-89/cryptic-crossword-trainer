// The Clue Bible's machine rules and flags (docs/clue-bible/03-rules-and-flags.md).
// Pure and corpus-free so they run in CI and the browser test suite. Each rule
// encodes a failure found in real Cruci clues (docs/clue-bible/06-case-law.md).
//
//   R-*  RULE  — fails the clue. Candidates: zero tolerance (scripts/validate-clue.ts).
//               Shipped bank: ratcheted by clue-rules.baseline.json (may only shrink).
//   F-*  FLAG  — needs an exam step or a recorded reason; never blocks on its own.
//   B-*  BATCH — checked across a batch of new clues.
// Corpus-backed flags (F-CHESTNUT, F-UNATTESTED, F-DEF-EVIDENCE) live in
// scripts/clue-flags.mjs; exam-derived ones (F-QUIZ) in scripts/exam/.
import { orphanSpans, tokens, type SurfaceEntry } from './surface-rules';

export type RuleId =
  | 'R-IDLE'
  | 'R-PRINTED'
  | 'R-ANSWER-IN-CLUE'
  | 'R-FODDER-LETTERS'
  | 'R-INDICATOR-DIR'
  | 'R-HIDDEN-IND'
  | 'R-CD-CONTRACT'
  | 'F-PRINTED'
  | 'F-AMERICANISM'
  | 'B-DEVICE-MIX'
  | 'B-REPEAT';

export interface RuleHit {
  rule: RuleId;
  detail: string;
}

export interface RuleEntry {
  id: string;
  answer: string;
  clueType: string;
  clue: string;
  defText: string;
  indicator: string;
  fodder: string;
  ops: { op: string; input: string; output: string }[];
  /** Required for cryptic definitions: the two readings the pun plays on. */
  pun?: { misleading: string; true: string };
}

/** Adapter: a bank entry (part-*.json shape) → RuleEntry. */
export function ruleEntryFromBank(e: {
  answer: string;
  clueType: string;
  clue: string;
  def: { text: string };
  wordplay: { indicator?: string; fodder?: string; operations: { op: string; input: string; output: string }[] };
  pun?: { misleading: string; true: string };
}): RuleEntry {
  return {
    id: `bank-${e.answer.toLowerCase()}`,
    answer: e.answer,
    clueType: e.clueType,
    clue: e.clue,
    defText: e.def.text,
    indicator: e.wordplay.indicator ?? '',
    fodder: e.wordplay.fodder ?? '',
    ops: e.wordplay.operations,
    ...(e.pun ? { pun: e.pun } : {}),
  };
}

/** Adapter: a hydrated teaching Clue → RuleEntry. */
export function ruleEntryFromClue(c: {
  id: string;
  clueType: string;
  clue: string;
  solution: string;
  definitionSpan: { text: string };
  wordplay: { indicator?: string; fodder?: string; operations: { op: string; input: string; output: string }[] };
  pun?: { misleading: string; true: string };
}): RuleEntry {
  return {
    id: c.id,
    answer: c.solution,
    clueType: c.clueType,
    clue: c.clue,
    defText: c.definitionSpan.text,
    indicator: c.wordplay.indicator ?? '',
    fodder: c.wordplay.fodder ?? '',
    ops: c.wordplay.operations,
    ...(c.pun ? { pun: c.pun } : {}),
  };
}

const letters = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '');
const sorted = (s: string) => letters(s).split('').sort().join('');

// ── R-HIDDEN-IND: hidden-word indicator families (02-devices/hidden.md) ─────
// Phrases are matched whole (case-insensitive); single words by stem.
const HIDDEN_PHRASES = [
  'in', 'into', 'inside', 'within', 'some', 'some of', 'part of', 'partly', 'in part',
  'found in', 'found', 'held by', 'hidden by', 'hidden in', 'hid in', 'lurking', 'lurking in',
  'at the heart of', 'from', 'among', 'amid', 'a bit of', 'piece of', 'sample of',
];
const HIDDEN_STEMS = [
  'conceal', 'hide', 'hides', 'hiding', 'hidden', 'shelter', 'keep', 'cover', 'hold', 'house',
  'harbour', 'reveal', 'show', 'display', 'contain', 'bury', 'buried', 'carri', 'carry',
  'store', 'stock', 'feature', 'include', 'lurk', 'embrace', 'grip', 'clutch', 'capture', 'secrete',
];

function validHiddenIndicator(ind: string): boolean {
  const i = ind.toLowerCase().trim();
  if (!i) return false;
  if (HIDDEN_PHRASES.includes(i)) return true;
  return i.split(/\s+/).some((w) => HIDDEN_STEMS.some((s) => w.startsWith(s)));
}

// ── R-INDICATOR-DIR: Down-only reversal indicators (02-devices/reversal.md) ──
// Cruci clues are standalone (no grid direction), so "up"-type reversals are unfair.
const DOWN_ONLY = /\b(up|upward|upwards|rising|rises|risen|rose|raised|lifted|climbing|climbs|mounting|ascending|skyward|northward)\b/i;

// ── F-AMERICANISM ──────────────────────────────────────────────────────────
const US_SPELLINGS = new Set(
  ('color colors colored favor favors favorite honor honors labor labors neighbor neighbors ' +
    'center centers theater theaters aging gray mom moms defense offense traveled traveling ' +
    'traveler canceled canceling jewelry plow catalog analyze paralyze cozy pajamas mustache ' +
    'diaper faucet sidewalk gasoline').split(/\s+/),
);

const INFLECTIONS = ['', 's', 'es', 'd', 'ed', 'ing', 'er', 'ers', 'ly'];

export function checkRules(e: RuleEntry): RuleHit[] {
  const hits: RuleHit[] = [];
  const answer = letters(e.answer);
  const clueToks = tokens(e.clue);

  // R-IDLE: any word the cryptic reading never pays for.
  const surface: SurfaceEntry = {
    id: e.id,
    clue: e.clue,
    clueType: e.clueType,
    defText: e.defText,
    indicator: e.indicator,
    fodder: e.fodder,
    opInputs: e.ops.map((o) => o.input),
  };
  const idle = orphanSpans(surface);
  if (idle.length) {
    hits.push({ rule: 'R-IDLE', detail: `idle: ${idle.map((s) => `"${s.join(' ')}"`).join(', ')}` });
  }

  // R-PRINTED / F-PRINTED: answer pieces printed as themselves in the surface.
  // Only pieces that sit unchanged in the answer count (fodder that is then
  // reversed, anagrammed or split by an insertion is fair). If printed pieces
  // spell out ≥75% of the answer the clue is on display (REP+AID) → RULE;
  // a single printed piece (CH+ARM) is a FLAG for the tournament to weigh.
  const printed = e.ops
    .filter((o) => o.op === 'synonym' || o.op === 'literal')
    .map((o) => letters(o.output))
    .filter(
      (p, i, all) =>
        p.length >= 3 &&
        all.indexOf(p) === i &&
        answer.includes(p) &&
        clueToks.includes(p.toLowerCase()) &&
        e.ops.some((o) => (o.op === 'synonym' || o.op === 'literal') && letters(o.input) === p && letters(o.output) === p),
    );
  if (printed.length) {
    const covered = printed.reduce((n, p) => n + p.length, 0) / answer.length;
    hits.push({
      rule: covered >= 0.75 ? 'R-PRINTED' : 'F-PRINTED',
      detail: `printed piece(s) ${printed.join('+')} show ${Math.round(covered * 100)}% of the answer`,
    });
  }

  // R-ANSWER-IN-CLUE: the answer (or a plain inflection of it) in the surface.
  if (e.clueType !== 'hidden' && answer.length >= 3) {
    const a = answer.toLowerCase();
    const forms = new Set(INFLECTIONS.map((s) => a + s));
    const hit = clueToks.find((t) => forms.has(t));
    if (hit) hits.push({ rule: 'R-ANSWER-IN-CLUE', detail: `"${hit}" prints the answer` });
  }

  // R-FODDER-LETTERS: anagram fodder printed as whole words, letters exact.
  if (e.clueType === 'anagram' && e.fodder) {
    const fodderToks = tokens(e.fodder);
    const missing = fodderToks.filter((t) => !clueToks.includes(t));
    if (missing.length) {
      hits.push({ rule: 'R-FODDER-LETTERS', detail: `fodder word(s) not in the surface: ${missing.join(', ')}` });
    }
    const anagramOp = e.ops.find((o) => o.op === 'anagram');
    const pure = e.ops.every((o) => o.op === 'anagram');
    if (pure && anagramOp && sorted(e.fodder) !== sorted(e.answer)) {
      hits.push({ rule: 'R-FODDER-LETTERS', detail: `fodder letters ≠ answer letters` });
    }
  }

  // R-INDICATOR-DIR
  if (e.clueType === 'reversal' && DOWN_ONLY.test(e.indicator)) {
    hits.push({ rule: 'R-INDICATOR-DIR', detail: `"${e.indicator}" only works in a Down clue` });
  }

  // R-HIDDEN-IND
  if (e.clueType === 'hidden' && !validHiddenIndicator(e.indicator)) {
    hits.push({ rule: 'R-HIDDEN-IND', detail: `"${e.indicator}" is not a hidden-word indicator` });
  }

  // R-CD-CONTRACT
  if (e.clueType === 'cryptic-definition' && !(e.pun?.misleading?.trim() && e.pun?.true?.trim())) {
    hits.push({ rule: 'R-CD-CONTRACT', detail: 'missing pun.misleading / pun.true' });
  }

  // F-AMERICANISM
  const us = clueToks.filter((t) => US_SPELLINGS.has(t));
  if (us.length) hits.push({ rule: 'F-AMERICANISM', detail: `US usage: ${us.join(', ')}` });

  return hits;
}

/** Batch-level rules for a set of NEW clues (not the shipped bank). */
export function batchHits(batch: RuleEntry[]): RuleHit[] {
  const hits: RuleHit[] = [];
  const whole = batch.filter((e) => e.clueType === 'cryptic-definition' || e.clueType === 'double-definition');
  if (batch.length >= 4 && whole.length / batch.length > 0.25) {
    hits.push({ rule: 'B-DEVICE-MIX', detail: `${whole.length}/${batch.length} cryptic/double definitions (max 25%)` });
  }
  const devices = new Set(batch.map((e) => e.clueType));
  if (batch.length >= 8 && devices.size < 4) {
    hits.push({ rule: 'B-DEVICE-MIX', detail: `only ${devices.size} devices in a batch of ${batch.length} (min 4)` });
  }
  const counts = new Map<string, number>();
  for (const e of batch) {
    const ind = e.indicator.toLowerCase().trim();
    if (ind) counts.set(ind, (counts.get(ind) ?? 0) + 1);
  }
  for (const [ind, n] of counts) {
    if (n > 2) hits.push({ rule: 'B-REPEAT', detail: `indicator "${ind}" used ${n}× in one batch` });
  }
  return hits;
}

export const ruleIds = (hits: RuleHit[]) => hits.map((h) => h.rule);
export const isBlocking = (h: RuleHit) => h.rule.startsWith('R-');
