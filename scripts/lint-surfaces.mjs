// Surface-quality lint for every clue (bank + teaching corpus).
//
// Cryptic clues should read as natural English ("lovely sentences"), not a
// jammed-together pair of synonyms. These are heuristics — they flag *suspects*
// for human/agent review, not absolute verdicts.
//
//   node scripts/lint-surfaces.mjs            # list flagged clues
//   node scripts/lint-surfaces.mjs --ids      # just the ids (for an agent batch)

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

const stripEnum = (clue) => clue.replace(/\s*\([^)]*\)\s*$/, '').trim();

// A token "reads like" a verb/adverb/function word — i.e. it glues the surface
// into a sentence. Either a known function word or an inflected form.
function connectorish(w) {
  const lw = w.toLowerCase().replace(/[^a-z’']/g, '');
  if (CONNECTORS.has(lw)) return true;
  return lw.length > 3 && /(ed|es|ing|ly|en|s)$/.test(lw);
}

function flags(clue) {
  const body = stripEnum(clue);
  const words = body.split(/\s+/).filter((t) => /[a-z]/i.test(t));
  const out = [];
  const hasConnector = words.some(connectorish);

  // The real smell: a short clue that's just bare words with nothing to bind
  // them into a sentence ("Vehicle animal", "Fellow sort").
  if (!hasConnector && words.length <= 5) out.push('bare word-list — no verb/connector');

  // ALL-CAPS fodder leaking into the surface, e.g. literal "SENATOR".
  if (/\b[A-Z]{3,}\b/.test(body)) out.push('raw capitalised fodder in the surface');

  return out;
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
      items.push({ id: `bank-${e.answer.toLowerCase()}`, clue: e.clue, answer: e.answer, src: f });
  return items;
}

const all = [...loadCorpus(), ...loadBank()];
const flagged = all.map((c) => ({ ...c, issues: flags(c.clue) })).filter((c) => c.issues.length);

if (process.argv.includes('--ids')) {
  console.log(flagged.map((c) => c.id).join('\n'));
} else {
  for (const c of flagged) {
    console.log(`[${c.src}] ${c.id}\n   "${c.clue}"\n   → ${c.issues.join('; ')}`);
  }
  console.log(`\n${flagged.length} of ${all.length} clues flagged.`);
}
