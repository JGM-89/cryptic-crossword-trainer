// Fetch the local reference corpora used by the Clue Bible's tools and exam.
// Everything lands in .corpus/ (gitignored) — reference data is used for
// CHECKING only and is never committed, shipped or quoted on the site.
//
//   npm run corpus:fetch
//
// - Published clues: George Ho's cryptic clue dataset (SQLite, ~200 MB).
//   Database: ODbL; clue texts remain their publishers' copyright.
//   https://cryptics.georgeho.org/
// - Everyday English sentences: Tatoeba English export (CC-BY 2.0 FR).
//   https://tatoeba.org/  — used as real-prose decoys and for word-pair
//   attestation.
// - WordNet comes from the `wordnet-db` npm devDependency (no fetch needed).

import { createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const DIR = '.corpus';
const SOURCES = [
  { url: 'https://cryptics.georgeho.org/data.db', file: `${DIR}/clues.db` },
  {
    url: 'https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2',
    file: `${DIR}/eng_sentences.tsv.bz2`,
    unpack: `${DIR}/eng_sentences.tsv`,
  },
];

mkdirSync(DIR, { recursive: true });

for (const s of SOURCES) {
  const target = s.unpack ?? s.file;
  if (existsSync(target) && statSync(target).size > 0 && !process.argv.includes('--force')) {
    console.log(`have ${target}`);
    continue;
  }
  console.log(`fetching ${s.url} …`);
  const res = await fetch(s.url);
  if (!res.ok) throw new Error(`${s.url}: HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(s.file));
  console.log(`  → ${s.file} (${Math.round(statSync(s.file).size / 1e6)} MB)`);
  if (s.unpack) {
    // Node has no bz2; Python's stdlib does.
    execFileSync('python', [
      '-c',
      `import bz2,shutil;shutil.copyfileobj(bz2.open(r"${s.file}","rb"),open(r"${s.unpack}","wb"))`,
    ]);
    console.log(`  → ${s.unpack} (${Math.round(statSync(s.unpack).size / 1e6)} MB)`);
  }
}
console.log('corpora ready in .corpus/');
