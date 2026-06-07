// Build-time crossword compiler.
//
// Builds each grid by PLACING words from the verified clue bank so that they
// cross one another (a real interlocking crossword that is fillable by
// construction — every entry is a hand-clued bank word). Generates a mix of
// sizes: 7×7 and 9×9 minis plus 13×13 large. Deterministic (seeded).
//
//   node scripts/generate-puzzles.mjs
//
// Output: public/archive.json

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BANK_DIR = join(ROOT, 'src', 'data', 'bank');
const OUT = join(ROOT, 'public', 'archive.json');

// Tiers: size, how many, and fill parameters tuned to the size.
// Rebalanced 2026-06-07 toward more small puzzles + fewer dense 13×13 to cut
// short-word demand (the bank has only ~14 three-letter words), so the usage cap
// can flatten repetition without starving generation.
const TIERS = [
  { size: 7, count: 80, seedMin: 5, seedMax: 7, wordMax: 7, minWords: 8, placeTarget: 16 },
  { size: 9, count: 80, seedMin: 6, seedMax: 8, wordMax: 8, minWords: 13, placeTarget: 24 },
  { size: 13, count: 90, seedMin: 7, seedMax: 9, wordMax: 9, minWords: 26, placeTarget: 40 },
];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadBank() {
  const files = readdirSync(BANK_DIR).filter((f) => /^part-[a-z]\.json$/.test(f));
  const byAnswer = new Map();
  const answers = [];
  for (const f of files) {
    for (const e of JSON.parse(readFileSync(join(BANK_DIR, f), 'utf8'))) {
      const a = e.answer.toUpperCase().replace(/[^A-Z]/g, '');
      e._a = a;
      byAnswer.set(a, e);
      answers.push(a);
    }
  }
  return { byAnswer, answers };
}

// Candidate order with repetition control. `usage` maps answer → number of
// puzzles it's already in. We keep the original fast random shuffle (so grids
// still fill quickly), but DROP words that have hit the cap from the pool — they
// reappear only as a fallback when nothing under the cap fits, so generation
// never starves on the bank's scarce short words. This hard-flattens the
// distribution (no word much past the cap) without the speed hit of trying
// hard-to-place "freshest" words first.
function freshFirst(list, rng, usage, cap) {
  const fresh = list.filter((w) => (usage.get(w) || 0) < cap);
  return shuffle(fresh.length ? fresh : list, rng);
}

// ── Grid construction by word placement ───────────────────────────────
function generate(rng, answers, cfg, usage, cap) {
  const S = cfg.size;
  const inb = (r, c) => r >= 0 && c >= 0 && r < S && c < S;
  const G = Array.from({ length: S }, () => Array(S).fill(null));
  const used = new Set();
  const placed = [];

  function fits(w, r, c, dir) {
    const L = w.length;
    const er = dir === 'a' ? r : r + L - 1;
    const ec = dir === 'a' ? c + L - 1 : c;
    if (!inb(r, c) || !inb(er, ec)) return -1;
    const br = dir === 'a' ? r : r - 1, bc = dir === 'a' ? c - 1 : c;
    const ar = dir === 'a' ? r : r + L, ac = dir === 'a' ? c + L : c;
    if (inb(br, bc) && G[br][bc] !== null) return -1;
    if (inb(ar, ac) && G[ar][ac] !== null) return -1;
    let cross = 0;
    for (let i = 0; i < L; i++) {
      const rr = dir === 'a' ? r : r + i, cc = dir === 'a' ? c + i : c;
      const cur = G[rr][cc];
      if (cur !== null) {
        if (cur !== w[i]) return -1;
        cross++;
      } else {
        const n1 = dir === 'a' ? [rr - 1, cc] : [rr, cc - 1];
        const n2 = dir === 'a' ? [rr + 1, cc] : [rr, cc + 1];
        if (inb(...n1) && G[n1[0]][n1[1]] !== null) return -1;
        if (inb(...n2) && G[n2[0]][n2[1]] !== null) return -1;
      }
    }
    return cross;
  }
  function put(w, r, c, dir) {
    for (let i = 0; i < w.length; i++) {
      const rr = dir === 'a' ? r : r + i, cc = dir === 'a' ? c + i : c;
      G[rr][cc] = w[i];
    }
    used.add(w);
    placed.push({ w, r, c, dir });
  }

  const seedPool = answers.filter((w) => w.length >= cfg.seedMin && w.length <= cfg.seedMax);
  const seed = freshFirst(seedPool, rng, usage, cap)[0];
  if (!seed) return null;
  put(seed, Math.floor(S / 2), Math.floor((S - seed.length) / 2), 'a');

  let tries = 0;
  while (placed.length < cfg.placeTarget && tries < 6000) {
    tries++;
    const base = placed[Math.floor(rng() * placed.length)];
    const bd = base.dir === 'a' ? 'd' : 'a';
    const pos = Math.floor(rng() * base.w.length);
    const cr = base.dir === 'a' ? base.r : base.r + pos;
    const cc = base.dir === 'a' ? base.c + pos : base.c;
    const letter = base.w[pos];
    const cand = freshFirst(
      answers.filter(
        (w) => !used.has(w) && w.length >= 3 && w.length <= cfg.wordMax && w.includes(letter),
      ),
      rng,
      usage,
      cap,
    );
    for (const w of cand) {
      let done = false;
      for (let off = 0; off < w.length; off++) {
        if (w[off] !== letter) continue;
        const r = bd === 'a' ? cr : cr - off;
        const c = bd === 'a' ? cc - off : cc;
        if (fits(w, r, c, bd) >= 1) { put(w, r, c, bd); done = true; break; }
      }
      if (done) break;
    }
  }

  for (let r = 0; r < S; r++) for (let c = 0; c < S; c++) if (G[r][c] === null) G[r][c] = '#';
  return { G, placed };
}

// ── Derive entries + numbering from the filled grid ───────────────────
function buildPuzzle(G, byAnswer, id, seed, size) {
  const S = size;
  const isBlock = (r, c) => G[r][c] === '#';
  const numberAt = new Map();
  let n = 0;
  const rawEntries = [];

  for (let r = 0; r < S; r++) {
    for (let c = 0; c < S; c++) {
      if (isBlock(r, c)) continue;
      const startsAcross = (c === 0 || isBlock(r, c - 1)) && c + 1 < S && !isBlock(r, c + 1);
      const startsDown = (r === 0 || isBlock(r - 1, c)) && r + 1 < S && !isBlock(r + 1, c);
      if (startsAcross || startsDown) {
        if (!numberAt.has(r * S + c)) numberAt.set(r * S + c, ++n);
      }
      if (startsAcross) {
        let cc = c, word = '';
        while (cc < S && !isBlock(r, cc)) { word += G[r][cc]; cc++; }
        if (word.length >= 3) rawEntries.push({ dir: 'across', r, c, word });
      }
      if (startsDown) {
        let rr = r, word = '';
        while (rr < S && !isBlock(rr, c)) { word += G[rr][c]; rr++; }
        if (word.length >= 3) rawEntries.push({ dir: 'down', r, c, word });
      }
    }
  }

  const entries = [];
  for (const e of rawEntries) {
    const bank = byAnswer.get(e.word);
    if (!bank) return null;
    entries.push({
      number: numberAt.get(e.r * S + e.c),
      direction: e.dir,
      row: e.r,
      col: e.c,
      answer: bank.answer,
      clue: bank.clue,
      clueType: bank.clueType,
      difficulty: bank.difficulty,
      def: bank.def,
      wordplay: bank.wordplay,
      parse: bank.parse,
    });
  }

  const avg = entries.reduce((s, e) => s + (e.difficulty || 3), 0) / entries.length;
  return {
    id,
    seed,
    title: `Cryptic №${id}`,
    size: S,
    blackPattern: G.map((row) => row.map((x) => (x === '#' ? '#' : '.')).join('')).join(''),
    difficulty: Math.round(avg * 10) / 10,
    entries: entries.sort((a, b) => a.number - b.number || (a.direction < b.direction ? -1 : 1)),
  };
}

function main() {
  const { byAnswer, answers } = loadBank();
  console.log(`Loaded ${answers.length} bank clues.`);
  const puzzles = [];
  const sigs = new Set();
  let id = 0;

  // Repetition control. Track how many puzzles each answer appears in and steer
  // selection toward least-used words (freshFirst). The cap is the point
  // beyond which a word is only used as a last resort — set near the ≈15% target,
  // but soft, because the bank has very few short words (only ~14 of 3 letters)
  // and 13×13 grids need them, so a hard cap would starve generation.
  // Cap = max puzzles any one answer may appear in. ~15% is the ideal, but the
  // bank has only ~14 three-letter words and 200 dense 13×13 grids need them, so
  // too tight a cap starves generation. 30% keeps grids fillable while still
  // roughly halving the worst repeaters (ART was 58%). Tighten once the bank has
  // more short words (Phase 2 corpus growth).
  const totalTarget = TIERS.reduce((s, t) => s + t.count, 0);
  const cap = Math.ceil(totalTarget * 0.30);
  const usage = new Map();

  for (const cfg of TIERS) {
    let made = 0, seed = cfg.size * 100000 + 1, attempts = 0;
    while (made < cfg.count && attempts < cfg.count * 120) {
      attempts++;
      const rng = mulberry32(seed++);
      const g = generate(rng, answers, cfg, usage, cap);
      if (!g || g.placed.length < cfg.minWords) continue;
      const puz = buildPuzzle(g.G, byAnswer, id + 1, seed - 1, cfg.size);
      if (!puz || puz.entries.length < cfg.minWords) continue;
      const sig = `${cfg.size}:` + puz.entries.map((e) => e.answer).sort().join(',');
      if (sigs.has(sig)) continue;
      sigs.add(sig);
      const set = new Set(puz.entries.map((e) => e.answer.toUpperCase().replace(/[^A-Z]/g, '')));
      for (const w of set) usage.set(w, (usage.get(w) || 0) + 1);
      id++;
      puzzles.push(puz);
      made++;
    }
    console.log(`  ${cfg.size}×${cfg.size}: ${made} puzzles (${attempts} attempts).`);
  }

  // Report the repetition outcome so regressions are visible in the build log.
  const inPuzzles = {};
  for (const p of puzzles) {
    const seen = new Set(p.entries.map((e) => e.answer));
    for (const w of seen) inPuzzles[w] = (inPuzzles[w] || 0) + 1;
  }
  const top = Object.entries(inPuzzles).sort((a, b) => b[1] - a[1]).slice(0, 6);
  console.log(
    'Most-repeated answers:',
    top.map(([w, n]) => `${w} ${Math.round((n / puzzles.length) * 100)}%`).join(', '),
    `(${Object.keys(inPuzzles).length} distinct words used)`,
  );

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(puzzles));
  const kb = Math.round(JSON.stringify(puzzles).length / 1024);
  const dev = {};
  for (const p of puzzles) for (const e of p.entries) dev[e.clueType] = (dev[e.clueType] || 0) + 1;
  console.log(`Wrote ${puzzles.length} puzzles to ${OUT} (${kb} KB).`);
  console.log('Device usage across archive:', dev);
}

main();
