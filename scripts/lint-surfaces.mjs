// Surface-quality lint for every clue (bank + teaching corpus).
//
// Cryptic clues should read as natural English ("lovely sentences"), not a
// jammed-together pair of synonyms. These are heuristics — they flag *suspects*
// for human/agent review, not absolute verdicts.
//
//   node scripts/lint-surfaces.mjs            # list GATE-flagged + advisory clues
//   node scripts/lint-surfaces.mjs --ids      # just the GATE-flagged ids (agent batch)
//   node scripts/lint-surfaces.mjs --rank     # every clue, weakest surface first (triage)
//   node scripts/lint-surfaces.mjs --rank --src=part-b.json   # restrict to one source
//
// TWO tiers:
//   • GATE rules (gateFlags) — high-precision smells that are ALSO enforced in
//     src/data/surfaces.test.ts and scripts/validate-clue.ts. KEEP THE THREE
//     COPIES IN SYNC. A clue tripping a gate rule fails CI.
//   • ADVISORY heuristics (advisoryFlags) — softer signals (padding ratio,
//     proper-noun density, abstract nouns, terseness) used only to RANK suspects
//     for the surface grader/polish pass. Never gating (too false-positive-prone).

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BANK_DIR = join(ROOT, 'src', 'data', 'bank');

// Words that make a string read like a sentence/phrase rather than a list.
const CONNECTORS = new Set(
  ('a an the in on at of to for with by from and or but is are was makes make made gives give ' +
    'given has have had as into out up over about after before during not no yes that this his her ' +
    'its their our your my one some any each every it he she they we you i am be being been around ' +
    'becomes become without within behind beside between through across back returns turning held ' +
    'holding taking inside outside near seen shown sound heard say said we’re we\'re')
    .split(/\s+/),
);

// Pure function words (a subset of CONNECTORS) — used for the padding-ratio
// heuristic. Inflected content words (running, broken) are NOT function words.
const FUNCTION_WORDS = new Set(
  ('a an the in on at of to for with by from and or but is are was were be been being am ' +
    'as into out up over about after before during not no that this it he she they we you i ' +
    'his her its their our your my one some any each every without within behind beside between ' +
    'through across back near than then so').split(/\s+/),
);

// A tiny set of vague/abstract nouns that rarely earn their keep in a surface.
const ABSTRACT = new Set('thing things stuff something anything everything somethings'.split(/\s+/));

const stripEnum = (clue) => clue.replace(/\s*\([^)]*\)\s*$/, '').trim();
const norm = (w) => w.toLowerCase().replace(/[^a-z’']/g, '');

// A token "reads like" a verb/adverb/function word — i.e. it glues the surface
// into a sentence. Either a known function word or an inflected form.
function connectorish(w) {
  const lw = norm(w);
  if (CONNECTORS.has(lw)) return true;
  return lw.length > 3 && /(ed|es|ing|ly|en|s)$/.test(lw);
}

// ── GATE rules (mirrored in surfaces.test.ts + validate-clue.ts) ───────────
function gateFlags(clue) {
  const body = stripEnum(clue);
  const words = body.split(/\s+/).filter((t) => /[a-z]/i.test(t));
  const out = [];

  // A clue with NO verb/connector at all is a bare word-list, not a sentence
  // ("Vehicle animal", "Fellow sort"). A genuine English surface always has at
  // least one binding word — so this fires at ANY length (was: only ≤5 words).
  if (words.length && !words.some(connectorish)) out.push('bare word-list — no verb/connector');

  // ALL-CAPS fodder leaking into the surface, e.g. literal "SENATOR".
  if (/\b[A-Z]{3,}\b/.test(body)) out.push('raw capitalised fodder in the surface');

  return out;
}

// ── ADVISORY heuristics (ranking only, never gating) ───────────────────────
function advisoryFlags(clue) {
  const body = stripEnum(clue);
  const words = body.split(/\s+/).filter((t) => /[a-z]/i.test(t));
  const n = words.length || 1;
  const out = [];
  let score = 0; // higher = weaker surface

  // Padding: a high pure-function-word ratio CAN signal padding, but natural
  // English routinely runs 55–60% function words, so only the extreme tail is a
  // real smell. Threshold set high to stay quiet on good surfaces.
  const fnCount = words.filter((w) => FUNCTION_WORDS.has(norm(w))).length;
  const fnRatio = fnCount / n;
  if (fnRatio > 0.62) {
    out.push(`high function-word ratio ${Math.round(fnRatio * 100)}% (padding?)`);
    score += 1.5;
  }

  // Proper-noun padding: capitals mid-clue (not the first word, not all-caps).
  const propers = words.slice(1).filter((w) => /^[A-Z][a-z’']/.test(w));
  if (propers.length > 2) {
    out.push(`proper-noun heavy (${propers.length} mid-clue capitals)`);
    score += 1.5;
  }

  // Vague/abstract nouns rarely earn their keep.
  const abstracts = words.filter((w) => ABSTRACT.has(norm(w)));
  if (abstracts.length) {
    out.push(`vague noun(s): ${abstracts.map(norm).join(', ')}`);
    score += 1;
  }

  // Genuinely terse: ≤3 words with at most one binding word reads as a bare
  // pair (many sound double-definitions are 3–4 words, so keep this tight).
  const binders = words.filter(connectorish).length;
  if (n <= 3 && binders <= 1) {
    out.push('terse — barely a sentence');
    score += 1.25;
  }

  return { issues: out, score };
}

function loadCorpus() {
  // Parse clue/answer pairs out of clues.ts without importing TS.
  const src = readFileSync(join(ROOT, 'src', 'data', 'clues.ts'), 'utf8');
  const items = [];
  const re = /id:\s*'([^']+)'[\s\S]*?clue:\s*'((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = re.exec(src))) items.push({ id: m[1], clue: m[2].replace(/\\'/g, "'"), src: 'corpus' });
  return items;
}
function loadBank() {
  const files = readdirSync(BANK_DIR).filter((f) => /^part-[a-z]\.json$/.test(f));
  const items = [];
  for (const f of files)
    for (const e of JSON.parse(readFileSync(join(BANK_DIR, f), 'utf8')))
      items.push({
        id: `bank-${e.answer.toLowerCase()}`,
        clue: e.clue,
        answer: e.answer,
        indicator: e.wordplay && e.wordplay.indicator,
        src: f,
      });
  return items;
}

const srcArg = (process.argv.find((a) => a.startsWith('--src=')) || '').slice(6);
let all = [...loadCorpus(), ...loadBank()];
if (srcArg) all = all.filter((c) => c.src === srcArg);

// The `indicator` field is quoted verbatim in the solver's hint ladder, so it
// must actually appear in the surface. A "..." in the indicator marks a split
// (e.g. "taking ... in" wrapping its object) — check each fragment separately.
// Advisory, not gating: the semantic auditor is the real backstop, and this
// only applies to bank entries (the corpus has no wordplay here).
function indicatorAbsent(clue, indicator) {
  if (!indicator) return false;
  const body = stripEnum(clue).toLowerCase();
  return indicator
    .split(/\s*\.\.\.\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
    .some((frag) => !body.includes(frag.toLowerCase()));
}

const scored = all.map((c) => {
  const gate = gateFlags(c.clue);
  const adv = advisoryFlags(c.clue);
  const issues = adv.issues.slice();
  let score = adv.score;
  if (indicatorAbsent(c.clue, c.indicator)) {
    issues.push(`indicator "${c.indicator}" absent from surface`);
    score += 2.5;
  }
  return { ...c, gate, advisory: issues, score: score + gate.length * 3 };
});

if (process.argv.includes('--ids')) {
  // Only GATE-flagged ids (for a remediation agent batch).
  console.log(scored.filter((c) => c.gate.length).map((c) => c.id).join('\n'));
} else if (process.argv.includes('--rank')) {
  // Every clue, weakest surface first.
  const ranked = scored.slice().sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  for (const c of ranked) {
    const tags = [...c.gate.map((g) => `GATE:${g}`), ...c.advisory];
    console.log(`${c.score.toFixed(2).padStart(5)} [${c.src}] ${c.id}\n   "${c.clue}"${tags.length ? `\n   → ${tags.join('; ')}` : ''}`);
  }
  const weak = ranked.filter((c) => c.score > 0).length;
  console.log(`\n${all.length} clues; ${weak} with a surface smell; ${scored.filter((c) => c.gate.length).length} trip a GATE rule.`);
} else {
  // Default: gate-flagged + any advisory issues.
  const flagged = scored.filter((c) => c.gate.length || c.advisory.length);
  for (const c of flagged) {
    const tags = [...c.gate.map((g) => `GATE:${g}`), ...c.advisory];
    console.log(`[${c.src}] ${c.id}\n   "${c.clue}"\n   → ${tags.join('; ')}`);
  }
  console.log(`\n${flagged.length} of ${all.length} clues flagged (${scored.filter((c) => c.gate.length).length} trip a GATE rule).`);
}
