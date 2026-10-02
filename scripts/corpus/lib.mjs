// Shared readers over the local reference corpora (.corpus/, see fetch.mjs).
// CHECKING ONLY: nothing read here is ever committed, shipped or shown on the
// site. Published clue texts remain their publishers' copyright.
import { existsSync, openSync, readFileSync, readSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const CORPUS = '.corpus';
const require = createRequire(import.meta.url);

function need(path, hint = 'run: npm run corpus:fetch') {
  if (!existsSync(path)) throw new Error(`missing ${path} — ${hint}`);
  return path;
}

// ── Published clues (George Ho dataset, SQLite) ─────────────────────────────
/** UK broadsheet blog sources — the anchor pool for Cruci's (British) clues. */
export const UK_SOURCES = ['times_xwd_times', 'fifteensquared', 'bigdave44'];

let db;
function clueDb() {
  if (!db) {
    const { DatabaseSync } = require('node:sqlite');
    db = new DatabaseSync(need(join(CORPUS, 'clues.db')), { readOnly: true });
  }
  return db;
}

/** Published clues for an answer: [{rowid, clue, answer, definition, source}]. */
export function publishedClues(answer, { ukOnly = true } = {}) {
  const a = answer.toUpperCase().replace(/[^A-Z]/g, '');
  const rows = clueDb()
    .prepare(
      `select rowid, clue, answer, definition, source from clues
       where replace(replace(upper(answer),' ',''),'-','') = ? and clue is not null`,
    )
    .all(a);
  return rows
    .filter((r) => !ukOnly || UK_SOURCES.includes(r.source))
    .map((r) => ({ ...r }))
    .filter((r, i, all) => all.findIndex((x) => x.clue === r.clue) === i);
}

/** Published clue by rowid (anchors are committed as ids only). */
export function publishedClue(rowid) {
  const r = clueDb().prepare('select rowid, clue, answer, definition, source from clues where rowid = ?').get(rowid);
  return r ? { ...r } : null;
}

/** Indicator words real setters use for a device: [{indicator, n}]. */
export function publishedIndicators(wordplay) {
  return clueDb()
    .prepare('select indicator, clue_rowids from indicators where wordplay = ?')
    .all(wordplay)
    .map((r) => ({ indicator: r.indicator, n: (String(r.clue_rowids).match(/\[\d+\]/g) || []).length }))
    .sort((a, b) => b.n - a.n);
}

// ── Everyday English sentences (Tatoeba) ────────────────────────────────────
let sents;
/** All English sentences (strings). ~2M; loaded once. */
export function sentences() {
  if (!sents) {
    sents = readFileSync(need(join(CORPUS, 'eng_sentences.tsv')), 'utf8')
      .split('\n')
      .map((l) => l.split('\t')[2])
      .filter(Boolean);
  }
  return sents;
}

export const words = (s) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "'")
    .split(/[^a-z']+/)
    .filter(Boolean);

let bigrams;
/** How many Tatoeba sentences contain the adjacent word pair "a b". */
export function bigramCount(a, b) {
  if (!bigrams) {
    bigrams = new Map();
    for (const s of sentences()) {
      const w = words(s);
      for (let i = 0; i + 1 < w.length; i++) {
        const k = `${w[i]} ${w[i + 1]}`;
        bigrams.set(k, (bigrams.get(k) || 0) + 1);
      }
    }
  }
  return bigrams.get(`${a.toLowerCase()} ${b.toLowerCase()}`) || 0;
}

// ── Moby Thesaurus II ───────────────────────────────────────────────────────
let moby;
/** Thesaurus entries for a word/phrase (lowercase strings); empty if none. */
export function thesaurus(word) {
  if (!moby) {
    moby = new Map();
    const text = readFileSync(need(join(CORPUS, 'moby-thesaurus.txt')), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const [root, ...syns] = line.split(',');
      if (root) moby.set(root.toLowerCase(), syns.map((x) => x.toLowerCase()));
    }
  }
  return moby.get(word.toLowerCase().trim()) ?? [];
}

// ── WordNet (wordnet-db) ────────────────────────────────────────────────────
const WN = dirname(require.resolve('wordnet-db/package.json'));
const POS = { n: 'noun', v: 'verb', a: 'adj', r: 'adv' };
const indexCache = {};

function wnIndex(pos) {
  if (!indexCache[pos]) {
    const m = new Map();
    for (const line of readFileSync(join(WN, 'dict', `index.${POS[pos]}`), 'utf8').split('\n')) {
      if (!line || line.startsWith(' ')) continue;
      const parts = line.trim().split(' ');
      const pCnt = Number(parts[3]);
      const offsets = parts.slice(4 + pCnt + 2);
      m.set(parts[0], offsets);
    }
    indexCache[pos] = m;
  }
  return indexCache[pos];
}

const fds = {};
function wnSynset(pos, offset) {
  fds[pos] ??= openSync(join(WN, 'dict', `data.${POS[pos]}`), 'r');
  const buf = Buffer.alloc(4096);
  const n = readSync(fds[pos], buf, 0, buf.length, Number(offset));
  const line = buf.toString('utf8', 0, n).split('\n')[0];
  const [head, gloss = ''] = line.split(' | ');
  const p = head.split(' ');
  const wCnt = parseInt(p[3], 16);
  const lemmas = [];
  for (let i = 0; i < wCnt; i++) lemmas.push(p[4 + i * 2].replace(/\(.*\)$/, '').replace(/_/g, ' '));
  const ptrStart = 4 + wCnt * 2;
  const ptrCnt = Number(p[ptrStart]);
  const hypernyms = [];
  for (let i = 0; i < ptrCnt; i++) {
    const [sym, off, ppos] = p.slice(ptrStart + 1 + i * 4, ptrStart + 5 + i * 4);
    // Walk "is a kind of" (@ hypernym) and, for adjectives, "similar to" (&) links.
    if (sym === '@' || sym === '@i' || sym === '&') hypernyms.push({ pos: ppos === 's' ? 'a' : ppos, offset: off });
  }
  return { pos, offset, lemmas, gloss: gloss.trim(), hypernyms };
}

/** Every WordNet sense of a word or phrase: [{pos, lemmas, gloss, hypernyms}]. */
export function senses(word) {
  const key = word.toLowerCase().trim().replace(/\s+/g, '_');
  const out = [];
  for (const pos of Object.keys(POS)) {
    for (const off of wnIndex(pos).get(key) || []) out.push(wnSynset(pos, off));
  }
  return out;
}

/** All lemmas in WordNet (single words and phrases, spaces not underscores). */
export function lemmas() {
  const all = new Set();
  for (const pos of Object.keys(POS)) for (const k of wnIndex(pos).keys()) all.add(k.replace(/_/g, ' '));
  return all;
}

/**
 * Does WordNet back "definition → answer"? True if the answer appears among the
 * definition's synonyms, or within `hops` hypernym steps (hops = 2: "tree" → ELM).
 * Returns the evidence string or null.
 */
export function wordnetLink(definition, answer, hops = 2) {
  const target = answer.toLowerCase().replace(/[^a-z ]/g, '');
  const bare = definition.toLowerCase().replace(/[^a-z' -]/g, '').trim();
  const head = bare.split(/\s+/).filter((w) => w.length > 2).pop() ?? bare;
  const candidates = [...new Set([bare, bare.replace(/^(a|an|the|our|your|my|his|her|its)\s+/, ''), head])];
  const walk = (fromWord, toWord) => {
    for (const s of senses(fromWord)) {
      let frontier = [s];
      for (let h = 0; h <= hops; h++) {
        for (const syn of frontier) {
          if (syn.lemmas.some((l) => l.toLowerCase() === toWord)) {
            return `WordNet ${POS[s.pos]}: ${fromWord} — ${s.gloss.split(';')[0]}${h ? ` (via ${h} step${h > 1 ? 's' : ''}: ${syn.lemmas[0]})` : ''}`;
          }
        }
        frontier = frontier.flatMap((x) => x.hypernyms.map((hp) => wnSynset(hp.pos, hp.offset)));
      }
    }
    return null;
  };
  for (const d of candidates) {
    // answer up to definition ("tree" for ELM), or definition up to answer ("banger" for CAR)
    const hit = walk(target, d.trim()) ?? walk(d.trim(), target);
    if (hit) return hit;
  }
  // Thesaurus evidence (Moby): either side lists the other.
  for (const d of candidates) {
    const dd = d.trim();
    if (thesaurus(dd).includes(target) || thesaurus(target).includes(dd)) {
      return `Moby Thesaurus: "${dd}" ↔ ${target}`;
    }
  }
  // Weaker evidence: the definition's head word appears in one of the answer's glosses.
  const re = new RegExp(`\\b${head.replace(/[^a-z]/g, '')}`, 'i');
  const g = senses(target).find((s) => head.length > 2 && re.test(s.gloss));
  if (g) return `WordNet gloss (weak): ${target} — ${g.gloss.split(';')[0]}`;
  return null;
}
