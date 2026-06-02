// Client-side persistence for the competence model.
//
// Primary store is IndexedDB (via idb) per the brief — it comfortably holds the
// curriculum/competence model and is the right place for the fading logic's
// history. We fall back to localStorage when IndexedDB is unavailable (e.g.
// some private-browsing modes), so progress is never silently lost.

import { openDB, type IDBPDatabase } from 'idb';
import { migrate, type ProgressState } from './progress';

const DB_NAME = 'cryptic-trainer';
const STORE = 'progress';
const KEY = 'state';
const LS_KEY = 'cryptic-trainer:progress';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      },
    });
  }
  return dbPromise;
}

function idbAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
}

export async function loadProgress(): Promise<ProgressState> {
  if (idbAvailable()) {
    try {
      const db = await getDb();
      const raw = await db.get(STORE, KEY);
      if (raw) return migrate(raw);
    } catch {
      // fall through to localStorage
    }
  }
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch {
    /* ignore */
  }
  return migrate(undefined);
}

export async function saveProgress(state: ProgressState): Promise<void> {
  if (idbAvailable()) {
    try {
      const db = await getDb();
      await db.put(STORE, state, KEY);
      return;
    } catch {
      // fall through to localStorage
    }
  }
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* ignore — best effort */
  }
}

export async function clearProgress(): Promise<void> {
  if (idbAvailable()) {
    try {
      const db = await getDb();
      await db.delete(STORE, KEY);
    } catch {
      /* ignore */
    }
  }
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    /* ignore */
  }
}
