// Run many Astra judge batches with limited concurrency, skipping any batch whose
// output already exists — safe to restart after an interruption.
//
//   node scripts/exam/astra-queue.mjs --run <id> [--concurrency 3] [--only surface,wit,cold-solver,def-only]
//
// Long runs outlive tool time limits, so start it detached, e.g. on Windows:
//   Start-Process node -ArgumentList 'scripts/exam/astra-queue.mjs','--run','baseline' -WindowStyle Hidden
// Progress: tmp/exam/<id>/astra-queue.log
import { spawn } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i === -1 ? d : process.argv[i + 1];
};
const run = arg('run');
const N = Number(arg('concurrency', 3));
const only = arg('only', 'surface,wit,cold-solver,def-only').split(',');
const DIR = join('tmp', 'exam', run);
const LOG = join(DIR, 'astra-queue.log');
const TEMPLATE = { surface: 'surface', wit: 'wit', coldsolve: 'cold-solver', defonly: 'def-only' };

const jobs = readdirSync(DIR)
  .map((f) => f.match(/^(surface|wit|coldsolve|defonly)-(\d+)\.json$/))
  .filter(Boolean)
  .map((m) => ({ template: TEMPLATE[m[1]], file: join(DIR, m[0]), out: join(DIR, `${m[1]}-${m[2]}.astra.out.json`) }))
  .filter((j) => only.includes(j.template) && !existsSync(j.out));

const log = (msg) => appendFileSync(LOG, `${new Date().toISOString()} ${msg}\n`);
log(`queue: ${jobs.length} batches, concurrency ${N}`);

let next = 0;
const worker = () =>
  new Promise((resolve) => {
    const go = () => {
      if (next >= jobs.length) return resolve();
      const j = jobs[next++];
      if (existsSync(j.out)) return go();
      log(`start ${j.file}`);
      const p = spawn(process.execPath, ['scripts/exam/astra.mjs', '--template', j.template, '--in', j.file], { stdio: 'ignore' });
      p.on('exit', (code) => {
        log(`${code === 0 ? 'done ' : `FAIL(${code})`} ${j.file}`);
        go();
      });
    };
    go();
  });

await Promise.all(Array.from({ length: N }, worker));
log('queue finished');
