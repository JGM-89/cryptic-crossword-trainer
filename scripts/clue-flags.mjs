// Corpus-backed checks from the Clue Bible (docs/clue-bible/03-rules-and-flags.md).
// Needs the local corpora (npm run corpus:fetch). Published clues are used to
// CHECK ours, never as material: nothing here is written into a clue.
//
//   npx tsx scripts/clue-flags.mjs [file.json]   # candidates (BankEntry or array)
//   npx tsx scripts/clue-flags.mjs --bank        # every shipped bank clue
//
//   R-COPY         RULE  surface is a near-verbatim copy of a published clue for the
//                        same answer. Similar is fine (owner, 2026-10-02) — only copying blocks.
//   F-CHESTNUT     FLAG  a key wordplay word is shared with ≥3 published clues for the
//                        answer (a familiar construction — informational only).
//   (F-UNATTESTED was tried and REJECTED 2026-10-02: published broadsheet clues trip a
//    Tatoeba word-pair test more often than ours — 62% vs 34% — so it measures nothing.)
//   F-DEF-EVIDENCE FLAG  definition not backed by WordNet or Moby Thesaurus — the
//                        exam's evidence auditor must confirm the sense.
import { readFileSync, readdirSync } from 'node:fs';
import { publishedClues, wordnetLink, words } from './corpus/lib.mjs';

const STOP = new Set(
  ('a an the and or but of to in on at by for with from as is are was were be been it its this that ' +
    'these those he she they we you i his her their our your my one some any all no not so up out off ' +
    'over into about after before when while who whom which what where there here than then too very ' +
    'can could may might must will would shall should do does did has have had get gets got s').split(' '),
);
const content = (s) => words(s.replace(/\s*\([^)]*\)\s*$/, '')).filter((w) => w.length > 2 && !STOP.has(w));
const jaccard = (a, b) => {
  const A = new Set(a);
  const B = new Set(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  return { j: inter / (new Set([...A, ...B]).size || 1), inter };
};

const WHOLE = new Set(['cryptic-definition', 'lit']);

export function corpusChecks(e) {
  const hits = [];
  const ours = content(e.clue);
  const published = publishedClues(e.answer);

  // R-COPY: near-verbatim (most of our content words, in a published clue for this answer).
  for (const p of published) {
    const { j, inter } = jaccard(ours, content(p.clue));
    if (inter >= 3 && j >= 0.7) {
      hits.push({ rule: 'R-COPY', detail: `${Math.round(j * 100)}% the same as a published ${p.source} clue (rowid ${p.rowid})` });
      break;
    }
  }

  // F-CHESTNUT: familiar construction — a WORDPLAY word (fodder/indicator, never the
  // definition) shared with ≥3 published clues for this answer. Informational only.
  if (!WHOLE.has(e.clueType) && e.clueType !== 'double-definition') {
    const defWords = new Set(content(e.def?.text ?? ''));
    const keys = content(`${e.wordplay?.fodder ?? ''} ${e.wordplay?.indicator ?? ''}`).filter(
      (w) => ours.includes(w) && !defWords.has(w),
    );
    for (const k of keys) {
      const n = published.filter((p) => content(p.clue).includes(k)).length;
      if (n >= 3) {
        hits.push({ rule: 'F-CHESTNUT', detail: `"${k}" appears in ${n} published clues for ${e.answer} (familiar construction)` });
        break;
      }
    }
  }

  // F-DEF-EVIDENCE
  if (!WHOLE.has(e.clueType) && e.def?.text && !wordnetLink(e.def.text, e.answer)) {
    hits.push({ rule: 'F-DEF-EVIDENCE', detail: `"${e.def.text}" → ${e.answer} not in WordNet/Moby — auditor to confirm` });
  }
  return hits;
}

// ── CLI ────────────────────────────────────────────────────────────────────
if (process.argv[1]?.endsWith('clue-flags.mjs')) {
  let entries;
  if (process.argv.includes('--bank')) {
    entries = readdirSync('src/data/bank')
      .filter((f) => /^part-[a-z]\.json$/.test(f))
      .flatMap((f) => JSON.parse(readFileSync(`src/data/bank/${f}`, 'utf8')));
  } else {
    const raw = JSON.parse(readFileSync(process.argv[2] ?? 0, 'utf8'));
    entries = Array.isArray(raw) ? raw : [raw];
  }
  const report = entries.map((e) => ({ answer: e.answer, hits: corpusChecks(e) }));
  if (process.argv.includes('--summary')) {
    const tally = {};
    for (const r of report) for (const h of r.hits) tally[h.rule] = (tally[h.rule] || 0) + 1;
    console.log(`clues: ${report.length}`, tally);
    for (const rule of Object.keys(tally)) {
      console.log(`\n== ${rule}`);
      for (const r of report.filter((x) => x.hits.some((h) => h.rule === rule)).slice(0, 8)) {
        console.log(`  ${r.answer}: ${r.hits.find((h) => h.rule === rule).detail}`);
      }
    }
  } else {
    process.stdout.write(JSON.stringify(report.filter((r) => r.hits.length), null, 2) + '\n');
  }
  process.exit(report.some((r) => r.hits.some((h) => h.rule === 'R-COPY')) ? 1 : 0);
}
