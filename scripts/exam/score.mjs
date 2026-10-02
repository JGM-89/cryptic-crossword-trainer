// The Exam, final step: aggregate judge outputs into scorecards (docs/clue-bible/04-exam.md).
//
//   node scripts/exam/score.mjs --run <id> [--ledger]
//
// Judge outputs live next to their batch, named <batch>.<judge>.out.json
// (e.g. surface-3.claude-2.out.json, coldsolve-1.astra.out.json, evidence.claude.out.json).
// Writes tmp/exam/<run>/scorecards.json and report.md; with --ledger, appends one
// line per clue to src/data/bank/ledger.jsonl (committed provenance).
// All scores are AI-CALIBRATED, NOT HUMAN-VALIDATED until external solvers check the exam.
import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i === -1 ? d : process.argv[i + 1];
};
const run = arg('run');
const DIR = join('tmp', 'exam', run);
const { items, pairs } = JSON.parse(readFileSync(join(DIR, 'key.json'), 'utf8'));
const letters = (s) => String(s ?? '').toUpperCase().replace(/[^A-Z]/g, '');
const outputs = (prefix) =>
  readdirSync(DIR)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.out.json'))
    .map((f) => ({ judge: f.split('.')[1], rows: JSON.parse(readFileSync(join(DIR, f), 'utf8')) }));

const card = {};
for (const [iid, it] of Object.entries(items)) {
  card[iid] = {
    ...it,
    solve: { solvers: 0, solved: 0, alternatives: [] },
    surface: { vsAnchor: [0, 0], vsAll: [0, 0], incoherent: 0, judged: 0 },
    wit: { vsAnchor: [0, 0], vsAll: [0, 0], unfair: 0, judged: 0 },
  };
}

// ── Cold solve ─────────────────────────────────────────────────────────────
for (const { judge, rows } of outputs('coldsolve-')) {
  for (const r of rows) {
    const c = card[r.item];
    if (!c) continue;
    c.solve.solvers++;
    if (letters(r.answer) === c.answer) c.solve.solved++;
    for (const a of r.alternatives ?? []) {
      if (letters(a.answer) && letters(a.answer) !== c.answer) c.solve.alternatives.push({ judge, ...a });
    }
  }
}

// ── Tournaments ────────────────────────────────────────────────────────────
let aWins = 0;
let decided = 0;
for (const dim of ['surface', 'wit']) {
  for (const { rows } of outputs(`${dim}-`)) {
    for (const r of rows) {
      const p = pairs[r.pair];
      if (!p) continue;
      const [A, B] = [card[p.a], card[p.b]];
      const sA = r.winner === 'A' ? 1 : r.winner === 'B' ? 0 : 0.5;
      if (r.winner === 'A' || r.winner === 'B') {
        decided++;
        if (r.winner === 'A') aWins++;
      }
      for (const [me, other, s] of [[A, B, sA], [B, A, 1 - sA]]) {
        me[dim].judged++;
        me[dim].vsAll[0] += s;
        me[dim].vsAll[1] += 1;
        if (other.kind === 'anchor') {
          me[dim].vsAnchor[0] += s;
          me[dim].vsAnchor[1] += 1;
        }
      }
      if (dim === 'surface') {
        if (/INCOHERENT/i.test(r.paraphraseA ?? '')) A.surface.incoherent++;
        if (/INCOHERENT/i.test(r.paraphraseB ?? '')) B.surface.incoherent++;
      } else {
        if (r.fairA === false) A.wit.unfair++;
        if (r.fairB === false) B.wit.unfair++;
      }
    }
  }
}

// ── Evidence ───────────────────────────────────────────────────────────────
const evidence = {};
for (const { judge, rows } of outputs('evidence')) {
  for (const r of rows) (evidence[letters(r.answer)] ??= []).push({ judge, verdict: r.verdict, sense: r.sense, note: r.note });
}

// ── Verdicts ───────────────────────────────────────────────────────────────
const rate = ([w, n]) => (n ? w / n : null);
const cards = Object.entries(card).map(([iid, c]) => {
  const ev = evidence[c.answer] ?? [];
  const solveRate = c.solve.solvers ? c.solve.solved / c.solve.solvers : null;
  const surfaceVsAnchor = rate(c.surface.vsAnchor);
  const witVsAnchor = rate(c.wit.vsAnchor);
  const faults = [];
  if (c.wit.judged && c.wit.unfair / c.wit.judged > 0.5) faults.push('judged unfair by most wit judges');
  if (c.surface.judged && c.surface.incoherent / c.surface.judged > 0.5) faults.push('surface incoherent to most judges');
  if (ev.filter((x) => x.verdict === 'wrong').length > ev.length / 2) faults.push('definition judged wrong');
  if (c.solve.alternatives.length >= 2) faults.push(`alternative answers proposed: ${[...new Set(c.solve.alternatives.map((a) => letters(a.answer)))].join(', ')}`);
  return {
    item: iid,
    kind: c.kind,
    answer: c.answer,
    clue: c.clue,
    src: c.src,
    label: c.label,
    pair: c.pair,
    solveRate,
    surfaceVsAnchor,
    witVsAnchor,
    surfaceVsAll: rate(c.surface.vsAll),
    witVsAll: rate(c.wit.vsAll),
    evidence: ev.map((x) => x.verdict),
    faults,
    beatsAnchors: surfaceVsAnchor !== null && witVsAnchor !== null ? surfaceVsAnchor >= 0.5 && witVsAnchor >= 0.5 : null,
  };
});
writeFileSync(join(DIR, 'scorecards.json'), JSON.stringify(cards, null, 1));

// ── Report ─────────────────────────────────────────────────────────────────
const ours = cards.filter((c) => c.kind === 'ours');
const pct = (x) => (x === null || Number.isNaN(x) ? '—' : `${Math.round(x * 100)}%`);
const mean = (xs) => {
  const v = xs.filter((x) => x !== null);
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null;
};
const lines = [
  `# Exam report — run \`${run}\``,
  '',
  '> **AI-calibrated, not human-validated.** Scores come from model judges (Claude + Astra) checked',
  '> against published broadsheet clues; external human solvers have not yet validated the exam.',
  '',
  `- Clues examined: ${ours.length}; anchors: ${cards.length - ours.length}`,
  `- Position bias: judges picked the first-shown clue in ${pct(decided ? aWins / decided : null)} of decided comparisons (50% = none)`,
  `- Mean cold-solve rate: ${pct(mean(ours.map((c) => c.solveRate)))}`,
  `- Mean surface win rate vs published anchors: ${pct(mean(ours.map((c) => c.surfaceVsAnchor)))}`,
  `- Mean wit win rate vs published anchors: ${pct(mean(ours.map((c) => c.witVsAnchor)))}`,
  `- Beat or tie the anchors on both surface and wit: ${ours.filter((c) => c.beatsAnchors).length}/${ours.filter((c) => c.beatsAnchors !== null).length}`,
  `- Clues with an exam fault: ${ours.filter((c) => c.faults.length).length}`,
  '',
  '## Faults',
  '',
  ...ours.filter((c) => c.faults.length).map((c) => `- **${c.answer}** — ${c.clue} — ${c.faults.join('; ')}`),
  '',
  '## Weakest 20 (surface + wit vs anchors)',
  '',
  ...ours
    .filter((c) => c.beatsAnchors !== null)
    .sort((a, b) => a.surfaceVsAnchor + a.witVsAnchor - (b.surfaceVsAnchor + b.witVsAnchor))
    .slice(0, 20)
    .map((c) => `- **${c.answer}** — ${c.clue} — surface ${pct(c.surfaceVsAnchor)}, wit ${pct(c.witVsAnchor)}, solved ${pct(c.solveRate)}`),
];
if (cards.some((c) => c.label)) {
  // Calibration: matched pairs (good vs bad) must be separated by the exam.
  const byPair = {};
  for (const c of cards.filter((x) => x.pair)) (byPair[c.pair] ??= {})[c.label] = c;
  const pairsWith = Object.values(byPair).filter((p) => p.good && p.bad);
  const sep = (f) => pairsWith.filter((p) => f(p.good) !== null && f(p.bad) !== null && f(p.good) > f(p.bad)).length;
  lines.push(
    '',
    '## Calibration (matched pairs: good vs minimally corrupted)',
    '',
    `- Pairs: ${pairsWith.length}`,
    `- Surface prefers the good version: ${sep((c) => c.surfaceVsAll)}/${pairsWith.length}`,
    `- Wit prefers the good version: ${sep((c) => c.witVsAll)}/${pairsWith.length}`,
    `- Bad versions with an exam fault (caught): ${pairsWith.filter((p) => p.bad.faults.length).length}/${pairsWith.length}`,
    `- Good versions with an exam fault (false alarms): ${pairsWith.filter((p) => p.good.faults.length).length}/${pairsWith.length}`,
  );
}
writeFileSync(join(DIR, 'report.md'), lines.join('\n') + '\n');
console.log(lines.slice(4, 12).join('\n'));

if (process.argv.includes('--ledger')) {
  const date = new Date().toISOString().slice(0, 10);
  const L = 'src/data/bank/ledger.jsonl';
  for (const c of ours) {
    appendFileSync(L, JSON.stringify({ run, date, answer: c.answer, clue: c.clue, solveRate: c.solveRate, surfaceVsAnchor: c.surfaceVsAnchor, witVsAnchor: c.witVsAnchor, evidence: c.evidence, faults: c.faults, judges: 'claude+astra', templates: 'v1', note: 'AI-calibrated, not human-validated' }) + '\n');
  }
  console.log(`ledger: +${ours.length} lines → ${L}${existsSync(L) ? '' : ''}`);
}
