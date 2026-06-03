// Lightweight localStorage tracking for the Play archive: which puzzles are
// completed, and the per-puzzle autosave key for the grid fill. Kept separate
// from the curriculum competence model (IndexedDB) — Play is just-for-fun solving.

const COMPLETED_KEY = 'cct:play:completed';

export function fillKey(puzzleId: string): string {
  return `cct:play:fill:${puzzleId}`;
}

export function getCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function markCompleted(puzzleId: string): void {
  try {
    const set = getCompleted();
    set.add(puzzleId);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function isCompleted(puzzleId: string): boolean {
  return getCompleted().has(puzzleId);
}
