// Runtime fairness/integrity checks for the clue corpus.
//
// This is the symbolic gate the brief calls for, scaled to a hand-authored set:
// it proves each clue is internally consistent before it ever reaches a learner.
// Run as a unit test (integrity.test.ts) and importable for a build-time guard.

import type { Clue } from '../types';
import { ABBR } from './abbreviations';

const lettersOnly = (s: string): string => (s ?? '').toUpperCase().replace(/[^A-Z]/g, '');

// Initial-letter ("acrostic") indicators — a piece like "boy primarily" → B is a
// fair first-letter device, not a dictionary abbreviation, so accept it.
const INITIAL_RE =
  /\b(primarily|initially|firstly|first|head|heads|heading|leading|leader|starts?|starting|top|opening|foremost|front|begins?|beginning)\b/;

/**
 * Is turning the cue `input` into the letters `output` a *recognised* mapping?
 * Either a standard abbreviation (ABBR) or an explicit first-letter device.
 */
function abbreviationRecognised(input: string, output: string): boolean {
  const out = lettersOnly(output);
  const cue = input.trim().toLowerCase();
  const keys = [cue, cue.replace(/['’]s$/, ''), cue.replace(/s$/, '')];
  if (keys.some((k) => (ABBR[k] ?? []).includes(out))) return true;
  // First-letter device: "<word> primarily / initially / leading …" → its initial.
  if (out.length === 1 && INITIAL_RE.test(cue)) {
    const words = cue.replace(INITIAL_RE, ' ').split(/[^a-z]+/).filter(Boolean);
    if (words.some((w) => w[0].toUpperCase() === out)) return true;
  }
  return false;
}

/** Sort letters so two strings can be compared as multisets. */
const sortLetters = (s: string): string => lettersOnly(s).split('').sort().join('');

/** Total letter count implied by an enumeration like "3,4" or "5-2". */
function enumerationLength(enumeration: string): number {
  const parts = enumeration.split(/[,\-\s]+/).filter(Boolean);
  return parts.reduce((sum, p) => sum + (parseInt(p, 10) || 0), 0);
}

export function validateClue(clue: Clue): string[] {
  const errors: string[] = [];
  const sol = lettersOnly(clue.solution);

  // 1. Solution sanity.
  if (!sol) errors.push('solution has no letters');

  // 2. Enumeration matches the solution length.
  if (enumerationLength(clue.enumeration) !== sol.length) {
    errors.push(
      `enumeration "${clue.enumeration}" (${enumerationLength(
        clue.enumeration,
      )}) ≠ solution length ${sol.length}`,
    );
  }

  // 3. Definition span: in bounds, text matches, contiguous at an end.
  const { start, end, text, position } = clue.definitionSpan;
  if (start < 0 || end > clue.clue.length || start >= end) {
    errors.push(`definitionSpan offsets out of bounds (${start}..${end})`);
  } else if (clue.clue.slice(start, end) !== text) {
    errors.push(
      `definitionSpan text "${text}" ≠ clue slice "${clue.clue.slice(start, end)}"`,
    );
  }
  // The definition must sit at the declared end of the clue (ignoring the
  // trailing enumeration in parentheses and surrounding punctuation/spaces).
  const clueNoEnum = clue.clue.replace(/\s*\([^)]*\)\s*$/, '');
  if (position === 'start' && start > 2) {
    errors.push(`definition declared at start but begins at offset ${start}`);
  }
  if (position === 'end' && end < clueNoEnum.replace(/[.?!,;:'"’ ]+$/, '').length - 1) {
    errors.push(`definition declared at end but ends before the clue does`);
  }

  // 4. Hint ladder: exactly four tiers, 1..4, all non-empty.
  if (clue.hints.length !== 4) errors.push(`expected 4 hints, got ${clue.hints.length}`);
  clue.hints.forEach((h, i) => {
    if (h.tier !== i + 1) errors.push(`hint ${i} has tier ${h.tier}, expected ${i + 1}`);
    if (!h.text.trim()) errors.push(`hint tier ${h.tier} is empty`);
  });

  // 5. Device-specific wordplay verification — the answer must be derivable.
  const fodderLetters = lettersOnly(clue.wordplay.fodder);
  const clueLetters = lettersOnly(clue.clue);
  switch (clue.clueType) {
    case 'anagram': {
      if (sortLetters(clue.wordplay.fodder) !== sortLetters(clue.solution)) {
        errors.push('anagram fodder is not a permutation of the solution');
      }
      // No indirect anagram: the fodder must appear literally in the surface.
      if (!clueLetters.includes(fodderLetters)) {
        errors.push('anagram fodder is not literally present in the clue (indirect anagram)');
      }
      break;
    }
    case 'hidden': {
      if (!fodderLetters.includes(sol)) {
        errors.push('hidden answer is not a contiguous substring of the fodder');
      }
      break;
    }
    case 'reversal': {
      if (fodderLetters.split('').reverse().join('') !== sol) {
        errors.push('reversed fodder does not equal the solution');
      }
      break;
    }
    case 'deletion': {
      // Solution must be a subsequence of the fodder, and strictly shorter.
      if (sol.length >= fodderLetters.length || !isSubsequence(sol, fodderLetters)) {
        errors.push('solution is not a deletion (subsequence) of the fodder');
      }
      // No indirect deletion: the fodder (the longer source word the solver
      // shortens) must appear literally in the surface, not be reached via a
      // synonym/definition first. Same fairness rule as indirect anagram.
      if (!clueLetters.includes(fodderLetters)) {
        errors.push('deletion fodder is not literally present in the clue (indirect deletion)');
      }
      break;
    }
    case 'initialism': {
      // Solution must equal the initial letters of the fodder words.
      const initials = clue.wordplay.fodder
        .split(/\s+/)
        .map((w) => w.replace(/[^A-Za-z]/g, '')[0] ?? '')
        .join('')
        .toUpperCase();
      if (initials !== sol) errors.push('solution is not the initials of the fodder');
      break;
    }
    case 'alternation': {
      // Alternate letters of the fodder (from either start position) must spell
      // the solution, and — like anagram fodder — the fodder must be literal.
      const odd = fodderLetters.split('').filter((_, i) => i % 2 === 0).join('');
      const even = fodderLetters.split('').filter((_, i) => i % 2 === 1).join('');
      if (odd !== sol && even !== sol) {
        errors.push('alternation: alternate letters of the fodder do not spell the solution');
      }
      if (!clueLetters.includes(fodderLetters)) {
        errors.push('alternation fodder is not literally present in the clue');
      }
      break;
    }
    default:
      break; // charade / container / homophone / double-def / cryptic-def / lit: see 5c/5d.
  }

  // 5c. Composition checks for assembled devices. A final `concat` must join
  // pieces that prior operations actually produced, in order, into the solution;
  // a final `insert` must place the contents STRICTLY INSIDE the container
  // (an edge "insertion" is a concatenation wearing the wrong indicator).
  const ops = clue.wordplay.operations;
  const finalOp = ops[ops.length - 1];
  const priorOutputs = new Set(ops.slice(0, -1).map((o) => lettersOnly(o.output)));
  const surfaceWords = new Set(
    clue.clue.replace(/\s*\([^)]*\)\s*$/, '').toUpperCase().split(/[^A-Z]+/).filter(Boolean),
  );
  // A piece is accounted for if a prior op produced it, OR it sits verbatim in
  // the surface as a word (literal fodder, e.g. "taking me in" → ME), OR it is
  // a single letter read straight off the surface (e.g. "a" → A).
  const pieceAccounted = (p: string) => p.length <= 1 || priorOutputs.has(p) || surfaceWords.has(p);
  if (finalOp?.op === 'concat') {
    const pieces = finalOp.input.split('+').map(lettersOnly).filter(Boolean);
    if (pieces.join('') !== sol) {
      errors.push(`concat pieces "${finalOp.input}" do not compose to the solution`);
    }
    for (const p of pieces) {
      if (!pieceAccounted(p)) {
        errors.push(`concat piece "${p}" is not produced by any prior operation`);
      }
    }
  }
  if (finalOp?.op === 'insert') {
    const inM = finalOp.input.match(/^(.+?)\s+(?:in|into|inside|within)\s+(.+)$/i);
    const aroundM = finalOp.input.match(/^(.+?)\s+(?:around|about|outside)\s+(.+)$/i);
    const inner = inM ? lettersOnly(inM[1]) : aroundM ? lettersOnly(aroundM[2]) : '';
    const outer = inM ? lettersOnly(inM[2]) : aroundM ? lettersOnly(aroundM[1]) : '';
    if (!inner || !outer) {
      errors.push(`insert input "${finalOp.input}" is not in the "X in Y" / "Y around X" form`);
    } else {
      let internal = false;
      for (let k = 1; k < outer.length; k++) {
        if (outer.slice(0, k) + inner + outer.slice(k) === sol) internal = true;
      }
      if (!internal) {
        errors.push(
          `"${finalOp.input}" is not a true insertion yielding the solution (contents must sit strictly inside the container)`,
        );
      }
      for (const p of [inner, outer]) {
        if (!pieceAccounted(p)) {
          errors.push(`insert piece "${p}" is not produced by any prior operation`);
        }
      }
    }
  }

  // 5d. A "synonym"/"literal" piece that is really its own output word with a
  // leading indefinite article is unindicated fodder: "a cake" → CAKE leaves
  // the A unaccounted for (A is a standard letter-contributor, so the solver
  // cannot tell whether it counts). A leading definite article is tolerated as
  // conventional surface glue ("the bed" → BED).
  for (const op of ops) {
    if (op.op !== 'synonym' && op.op !== 'literal') continue;
    const words = op.input.trim().toLowerCase().split(/\s+/);
    if (
      words.length >= 2 &&
      (words[0] === 'a' || words[0] === 'an') &&
      lettersOnly(words.slice(1).join('')) === lettersOnly(op.output)
    ) {
      errors.push(
        `unindicated article "${words[0]}" swallowed by literal piece "${op.input}" → "${op.output}"`,
      );
    }
  }

  // 5b. Abbreviations must be fair: every `abbreviate` piece has to be a
  // recognised cue→letters mapping, and the cue must appear in the surface
  // (no indirect abbreviation — the analogue of the indirect-anagram rule).
  for (const op of clue.wordplay.operations) {
    if (op.op !== 'abbreviate') continue;
    if (!abbreviationRecognised(op.input, op.output)) {
      errors.push(`unrecognised abbreviation "${op.input}" → "${op.output}"`);
    } else if (!clueLetters.includes(lettersOnly(op.input))) {
      errors.push(`abbreviation cue "${op.input}" is absent from the surface (indirect)`);
    }
  }

  // 6. The final wordplay operation should output the solution.
  const lastOp = clue.wordplay.operations[clue.wordplay.operations.length - 1];
  if (lastOp && lettersOnly(lastOp.output) !== sol) {
    errors.push(`final wordplay op output "${lastOp.output}" ≠ solution`);
  }

  return errors;
}

function isSubsequence(sub: string, full: string): boolean {
  let i = 0;
  for (const ch of full) {
    if (ch === sub[i]) i++;
    if (i === sub.length) return true;
  }
  return i === sub.length;
}

export function validateAll(clues: Clue[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const ids = new Set<string>();
  for (const clue of clues) {
    const errors = validateClue(clue);
    if (ids.has(clue.id)) errors.push(`duplicate id "${clue.id}"`);
    ids.add(clue.id);
    if (errors.length) result[clue.id] = errors;
  }
  return result;
}
