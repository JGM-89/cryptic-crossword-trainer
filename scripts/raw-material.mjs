// The Writer method, step 1: mine raw material for an answer (docs/clue-bible/05-writer-method.md).
// Setters start from material, not memory: this gathers what a human setter
// would hunt for, from local corpora (npm run corpus:fetch).
//
//   npx tsx scripts/raw-material.mjs ANSWER [--json]
//
// Sections: senses (definition candidates), anagrams (words + attested two-word
// phrases), hidden carriers (real sentences containing the answer across a word
// break), charade & container splits (pieces with synonym cues), reversal,
// and the published indicator vocabulary per device (src/data/indicators/).
import { readFileSync } from 'node:fs';
import { ABBR } from '../src/data/abbreviations.ts';
import { bigramCount, lemmas, senses, sentences, thesaurus, words } from './corpus/lib.mjs';

const ANSWER = (process.argv[2] ?? '').toUpperCase().replace(/[^A-Z]/g, '');
if (!ANSWER) throw new Error('usage: npx tsx scripts/raw-material.mjs ANSWER [--json]');
const lower = ANSWER.toLowerCase();
const sortL = (s) => s.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');

// ── Vocabulary with everyday frequency (Tatoeba) ────────────────────────────
const freq = new Map();
for (const s of sentences()) for (const w of words(s)) if (/^[a-z]+$/.test(w)) freq.set(w, (freq.get(w) || 0) + 1);
const vocab = [...new Set([...lemmas()].filter((w) => /^[a-z]+$/.test(w)))].filter((w) => (freq.get(w) || 0) >= 3);
const isWord = (w) => (freq.get(w) || 0) >= 3 && vocab.includes(w);
const common = (xs, n) => [...new Set(xs)].filter((w) => /^[a-z]+$/.test(w)).sort((a, b) => (freq.get(b) || 0) - (freq.get(a) || 0)).slice(0, n);

// Abbreviation cues: letters → cue words (the allowed list only).
const abbrCues = new Map();
for (const [cue, outs] of Object.entries(ABBR)) for (const o of outs) (abbrCues.get(o) ?? abbrCues.set(o, []).get(o)).push(cue);

// ── Senses (definition candidates) ──────────────────────────────────────────
const sense = senses(lower).map((s) => `${s.pos}: ${s.gloss.split(';')[0]} [${s.lemmas.filter((l) => l !== lower).slice(0, 4).join(', ')}]`);
const synonyms = common(thesaurus(lower).filter((w) => !w.includes(' ')), 25);

// ── Anagrams ────────────────────────────────────────────────────────────────
const key = sortL(ANSWER);
const byKey = new Map();
for (const w of vocab) {
  if (w.length > ANSWER.length) continue;
  const k = sortL(w);
  (byKey.get(k) ?? byKey.set(k, []).get(k)).push(w);
}
const single = (byKey.get(key) ?? []).filter((w) => w !== lower && (freq.get(w) || 0) >= 10);
const minus = (big, small) => {
  const b = big.split('');
  for (const ch of small) {
    const i = b.indexOf(ch);
    if (i === -1) return null;
    b.splice(i, 1);
  }
  return b.join('');
};
const pairs = [];
const everyday = (w) => (freq.get(w) || 0) >= 50 && (w.length >= 3 || ['a', 'an', 'i', 'on', 'in', 'at', 'to', 'up', 'no', 'so', 'go', 'me', 'we', 'he', 'it', 'is', 'as', 'or', 'my'].includes(w));
for (const w of vocab) {
  if (!everyday(w) || w.length >= ANSWER.length) continue;
  const rest = minus(key, sortL(w));
  if (rest === null) continue;
  for (const v of (byKey.get(rest) ?? []).filter(everyday)) {
    if (w < v || !(byKey.get(rest) ?? []).includes(w)) {
      const attested = bigramCount(w, v) + bigramCount(v, w);
      pairs.push({ phrase: bigramCount(w, v) >= bigramCount(v, w) ? `${w} ${v}` : `${v} ${w}`, attested });
    }
  }
}
const anagramPhrases = pairs
  .filter((p, i, all) => all.findIndex((q) => q.phrase === p.phrase) === i)
  .sort((a, b) => b.attested - a.attested || (freq.get(b.phrase.split(' ')[0]) || 0) - (freq.get(a.phrase.split(' ')[0]) || 0))
  .slice(0, 25);

// ── Hidden carriers (real sentences, answer across a word break) ────────────
const hidden = [];
for (const s of sentences()) {
  if (hidden.length >= 15) break;
  const ws = words(s).filter((w) => /^[a-z]+$/.test(w));
  for (let i = 0; i < ws.length && hidden.length < 15; i++) {
    let joined = '';
    for (let j = i; j < ws.length && j < i + 4; j++) {
      joined += ws[j];
      const at = joined.indexOf(lower);
      if (j > i && at !== -1 && at < ws[i].length && at + lower.length > joined.length - ws[j].length) {
        const carrier = ws.slice(i, j + 1).join(' ');
        if (!hidden.some((h) => h.carrier === carrier)) hidden.push({ carrier, sentence: s });
        break;
      }
    }
  }
}

// ── Charade splits (2–3 pieces: words or allowed abbreviations) ─────────────
// Cue words for a piece: dictionary synonyms and "kind of" words first (WordNet),
// then common thesaurus associations (Moby), then allowed abbreviation cues.
const pieceCues = (p) => {
  const cues = [];
  const w = p.toLowerCase();
  if (isWord(w) && w.length >= 3) {
    const wn = senses(w).flatMap((s) => s.lemmas).filter((l) => l !== w && !l.includes(' '));
    cues.push(...common(wn, 5), ...common(thesaurus(w).filter((x) => !x.includes(' ') && x !== w && !wn.includes(x)), 4));
  }
  for (const c of abbrCues.get(p) ?? []) cues.push(`${c} (abbr)`);
  return cues;
};
const usable = (p) => p.length >= 1 && (isWord(p.toLowerCase()) && p.length >= 2 || abbrCues.has(p));
const charades = [];
for (let i = 1; i < ANSWER.length; i++) {
  const [a, b] = [ANSWER.slice(0, i), ANSWER.slice(i)];
  if (usable(a) && usable(b)) charades.push({ pieces: [a, b], cues: [pieceCues(a), pieceCues(b)] });
  for (let j = i + 1; j < ANSWER.length; j++) {
    const [x, y, z] = [ANSWER.slice(0, i), ANSWER.slice(i, j), ANSWER.slice(j)];
    if (usable(x) && usable(y) && usable(z)) charades.push({ pieces: [x, y, z], cues: [pieceCues(x), pieceCues(y), pieceCues(z)] });
  }
}

// ── Containers: OUTER split around INNER ────────────────────────────────────
const containers = [];
for (let s = 1; s < ANSWER.length - 1; s++) {
  for (let e = s + 1; e < ANSWER.length; e++) {
    const inner = ANSWER.slice(s, e);
    const outer = ANSWER.slice(0, s) + ANSWER.slice(e);
    if (usable(inner) && usable(outer) && outer.length >= 2) containers.push({ outer, inner, cues: [pieceCues(outer), pieceCues(inner)] });
  }
}

// ── Reversal ────────────────────────────────────────────────────────────────
const rev = ANSWER.split('').reverse().join('');
const reversal = isWord(rev.toLowerCase()) && rev !== ANSWER ? { reversed: rev, cues: pieceCues(rev) } : null;

const result = {
  answer: ANSWER,
  senses: sense,
  synonyms,
  anagrams: { words: single, phrases: anagramPhrases },
  hiddenCarriers: hidden,
  charades: charades.slice(0, 20),
  containers: containers.slice(0, 15),
  reversal,
  indicatorFiles: 'src/data/indicators/<device>.json (published usage)',
  note: 'Raw material only. Published clues are never material: originality is checked separately (R-COPY).',
};

if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 1));
else {
  console.log(`# Raw material: ${ANSWER}\n`);
  console.log(`Senses:\n  ${result.senses.join('\n  ') || '—'}\nSynonyms: ${synonyms.join(', ')}\n`);
  console.log(`Anagram words: ${single.join(', ') || '—'}`);
  console.log(`Anagram phrases (attested first): ${anagramPhrases.map((p) => `${p.phrase}${p.attested ? '*' : ''}`).join(', ') || '—'}\n`);
  console.log(`Hidden carriers:\n  ${hidden.map((h) => h.carrier).join('\n  ') || '—'}\n`);
  console.log(`Charades:\n  ${charades.slice(0, 12).map((c) => `${c.pieces.join('+')}  ←  ${c.cues.map((x) => x.slice(0, 4).join('/') || '?').join(' + ')}`).join('\n  ') || '—'}\n`);
  console.log(`Containers:\n  ${containers.slice(0, 8).map((c) => `${c.inner} in ${c.outer}  ←  ${c.cues.map((x) => x.slice(0, 4).join('/') || '?').join(' in ')}`).join('\n  ') || '—'}\n`);
  console.log(`Reversal: ${reversal ? `${reversal.reversed} ← ${reversal.cues.slice(0, 6).join('/')}` : '—'}`);
}
