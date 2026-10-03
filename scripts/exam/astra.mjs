// Run an exam judge template through Astra (ChatGPT via the Codex CLI) — a
// different model family on the panel, so judge errors don't all correlate.
//
//   node scripts/exam/astra.mjs --template surface --in tmp/exam/<run>/surface-1.json
//     → tmp/exam/<run>/surface-1.astra.out.json
//
// Astra runs read-only (it cannot touch the repo); its final message must be the
// JSON array, which this script extracts and saves.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i === -1 ? d : process.argv[i + 1];
};
const template = arg('template');
const input = arg('in');
const effort = arg('effort', 'medium');
if (!template || !input) throw new Error('usage: --template <cold-solver|surface|wit|evidence> --in <batch.json>');

// Normalise line endings first: a Windows-saved template (CRLF) once silently
// produced an empty prompt and every Astra batch failed (case law CL-058).
const body = readFileSync(`docs/clue-bible/judges/${template}.md`, 'utf8')
  .replace(/\r\n/g, '\n')
  .split('\n---\n')
  .slice(1)
  .join('\n---\n');
if (!body.trim()) throw new Error(`judge template ${template}.md has no instructions after its '---' line`);
const prompt = body
  .replaceAll('{IN}', resolve(input))
  .replace(/Write ONLY a JSON array to \{OUT\}/, 'Reply with ONLY the JSON array (no prose, no code fences)')
  .replaceAll('{OUT}', 'your reply');

const out = input.replace(/\.json$/, '.astra.out.json');
const ATTEMPTS = 3;
let rows;
for (let attempt = 1; attempt <= ATTEMPTS && !rows; attempt++) {
  const lastMsg = join(mkdtempSync(join(tmpdir(), 'astra-')), 'last.txt');
  execFileSync(
    'codex',
    ['exec', '-m', 'gpt-6-astra', '-c', `model_reasoning_effort="${effort}"`, '-s', 'read-only', '-C', '.', '-o', lastMsg, '--color', 'never', '-'],
    { input: prompt, stdio: ['pipe', 'ignore', 'pipe'], maxBuffer: 64 * 1024 * 1024, shell: process.platform === 'win32' },
  );
  const text = readFileSync(lastMsg, 'utf8');
  try {
    rows = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1));
  } catch (err) {
    // Astra occasionally emits slightly malformed JSON on long batches: keep the
    // raw reply for inspection and try again.
    writeFileSync(out.replace(/\.out\.json$/, `.raw-${attempt}.txt`), text);
    console.error(`astra ${template}: attempt ${attempt} gave invalid JSON (${err.message}); ${attempt < ATTEMPTS ? 'retrying' : 'giving up'}`);
  }
}
if (!rows) process.exit(1);
writeFileSync(out, JSON.stringify(rows, null, 1));
console.log(`astra ${template}: ${rows.length} rows → ${out}`);
