// Shared "surprise me" picker: a random unsolved puzzle (falls back to any
// puzzle once everything is solved). Used by PlayPage and the Daily bridges.

import { loadArchiveMeta, type ArchiveMeta } from '../data/archive';
import { getCompleted } from './playProgress';

export function pickSurprise(pool: ArchiveMeta[], completed: Set<string>): string | null {
  const unsolved = pool.filter((p) => !completed.has(`archive-${p.id}`));
  const source = unsolved.length ? unsolved : pool;
  if (!source.length) return null;
  return String(source[Math.floor(Math.random() * source.length)].id);
}

export async function surpriseTarget(pool?: ArchiveMeta[]): Promise<string | null> {
  const meta = pool ?? (await loadArchiveMeta());
  return pickSurprise(meta, getCompleted());
}
