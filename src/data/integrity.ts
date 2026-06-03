// Runtime fairness/integrity checks for the clue corpus.
//
// This is the symbolic gate the brief calls for, scaled to a hand-authored set:
// it proves each clue is internally consistent before it ever reaches a learner.
// Run as a unit test (integrity.test.ts) and importable for a build-time guard.

import type { Clue } from '../types';

const lettersOnly = (s: string): string => (s ?? '').toUpperCase().replace(/[^A-Z]/g, '');

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
    default:
      break; // charade / container / homophone / double-def / cryptic-def / alternation / lit: checked via the parse.
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
