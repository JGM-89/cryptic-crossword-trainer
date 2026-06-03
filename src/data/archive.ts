// Loads the generated puzzle archive (public/archive.json) and hydrates puzzles
// on demand. The file is fetched lazily so it never weighs down the main bundle.

import type { Puzzle, PuzzleEntry } from '../types';
import { hydrateBankEntry, type BankEntry } from './bank/index';

interface RawEntry extends BankEntry {
  number: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
}
export interface RawPuzzle {
  id: number;
  seed: number;
  title: string;
  size: number;
  blackPattern: string;
  difficulty: number;
  entries: RawEntry[];
}

export interface ArchiveMeta {
  id: number;
  title: string;
  size: number;
  difficulty: number;
  clueCount: number;
  band: DifficultyBand;
}

export type DifficultyBand = 'Gentle' | 'Moderate' | 'Tougher';

export function bandOf(difficulty: number): DifficultyBand {
  if (difficulty < 2.4) return 'Gentle';
  if (difficulty < 3.1) return 'Moderate';
  return 'Tougher';
}

let cache: RawPuzzle[] | null = null;
let inflight: Promise<RawPuzzle[]> | null = null;

async function fetchArchive(): Promise<RawPuzzle[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch(`${import.meta.env.BASE_URL}archive.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`archive.json ${r.status}`);
        return r.json();
      })
      .then((data: RawPuzzle[]) => {
        cache = data;
        return data;
      });
  }
  return inflight;
}

export async function loadArchiveMeta(): Promise<ArchiveMeta[]> {
  const all = await fetchArchive();
  return all.map((p) => ({
    id: p.id,
    title: p.title,
    size: p.size,
    difficulty: p.difficulty,
    clueCount: p.entries.length,
    band: bandOf(p.difficulty),
  }));
}

export async function getArchivePuzzle(id: number): Promise<Puzzle | undefined> {
  const all = await fetchArchive();
  const raw = all.find((p) => p.id === id);
  if (!raw) return undefined;
  const entries: PuzzleEntry[] = raw.entries.map((e) => ({
    ...hydrateBankEntry(e),
    number: e.number,
    direction: e.direction,
    row: e.row,
    col: e.col,
  }));
  return {
    id: `archive-${raw.id}`,
    title: raw.title,
    stage: 'D',
    rows: raw.size,
    cols: raw.size,
    blurb: `${entries.length} clues · ${bandOf(raw.difficulty)} · a full cryptic from the archive.`,
    entries,
  };
}
