// The competence + fading engine (pure, deterministic, testable).
//
// Learning science (McNeill et al. 2006; Wood/Bruner/Vygotsky): support should
// fade as competence grows, and fade *per skill* rather than globally. So we
// track competence per clue-type and advance its stage on a clean-solve streak.
// A learner can therefore be Stage D (independent) at anagrams while still being
// Stage A (taught) at homophones — exactly the brief's design goal.

import { CLUE_TYPE_ORDER, type ClueType, type Stage } from '../types';

/** Clean (hint-free) solves needed to advance one stage. */
export const ADVANCE_THRESHOLD = 2;

const STAGE_SEQUENCE: Stage[] = ['A', 'B', 'C', 'D'];

export function nextStage(stage: Stage): Stage {
  const i = STAGE_SEQUENCE.indexOf(stage);
  return STAGE_SEQUENCE[Math.min(i + 1, STAGE_SEQUENCE.length - 1)];
}

export function stageRank(stage: Stage): number {
  return STAGE_SEQUENCE.indexOf(stage);
}

export interface CompetenceRecord {
  stage: Stage;
  /** Consecutive clean (hint-free) solves toward the next advance. */
  streak: number;
  solvedNoHint: number;
  solvedWithHint: number;
  attempts: number;
  bestTimeMs?: number;
}

export function initialCompetence(): Record<ClueType, CompetenceRecord> {
  const out = {} as Record<ClueType, CompetenceRecord>;
  for (const type of CLUE_TYPE_ORDER) {
    out[type] = { stage: 'A', streak: 0, solvedNoHint: 0, solvedWithHint: 0, attempts: 0 };
  }
  return out;
}

export interface SolveOutcome {
  usedHint: boolean;
  /** Number of hint rungs revealed before solving (optional detail). */
  hintsUsed?: number;
  timeMs?: number;
}

/** Apply one solve to a competence record, returning a new record (immutable). */
export function recordSolve(rec: CompetenceRecord, outcome: SolveOutcome): CompetenceRecord {
  const attempts = rec.attempts + 1;
  const bestTimeMs =
    outcome.timeMs !== undefined
      ? Math.min(rec.bestTimeMs ?? Infinity, outcome.timeMs)
      : rec.bestTimeMs;

  if (outcome.usedHint) {
    // Hints reset the streak — fading is earned by unaided solving.
    return {
      ...rec,
      attempts,
      bestTimeMs,
      streak: 0,
      solvedWithHint: rec.solvedWithHint + 1,
    };
  }

  let streak = rec.streak + 1;
  let stage = rec.stage;
  if (streak >= ADVANCE_THRESHOLD && stage !== 'D') {
    stage = nextStage(stage);
    streak = 0; // reset the meter at each new stage
  }

  return {
    ...rec,
    attempts,
    bestTimeMs,
    streak,
    stage,
    solvedNoHint: rec.solvedNoHint + 1,
  };
}

// ─────────────────────────── Scaffolding policy ───────────────────────────

export type HintAvailability =
  | 'all' // every rung is one tap away
  | 'onRequest' // ladder hidden until the learner opens it
  | 'afterAttempt' // surfaces only after a wrong answer
  | 'afterSolve'; // only available once solved or revealed

export interface Scaffolding {
  stage: Stage;
  preHighlightDefinition: boolean;
  showClueTypeBadge: boolean;
  hintAvailability: HintAvailability;
  /** Lowest hint rung offered first (Stage A offers rung 1; B starts one lower idea). */
  startingTier: 1 | 2;
}

export function scaffoldingFor(stage: Stage): Scaffolding {
  switch (stage) {
    case 'A':
      return {
        stage,
        preHighlightDefinition: true,
        showClueTypeBadge: true,
        hintAvailability: 'all',
        startingTier: 1,
      };
    case 'B':
      return {
        stage,
        preHighlightDefinition: false,
        showClueTypeBadge: true,
        hintAvailability: 'onRequest',
        startingTier: 1,
      };
    case 'C':
      return {
        stage,
        preHighlightDefinition: false,
        showClueTypeBadge: false,
        hintAvailability: 'afterAttempt',
        startingTier: 2,
      };
    case 'D':
      return {
        stage,
        preHighlightDefinition: false,
        showClueTypeBadge: false,
        hintAvailability: 'afterSolve',
        startingTier: 2,
      };
  }
}

/**
 * The stage a learner experiences for a given clue.
 * Stage A lessons always teach with full scaffolding; the daily cryptic is always
 * Stage D; mixed lessons defer to the learner's per-type competence, which is what
 * makes the support fade independently per device.
 */
export function effectiveStage(
  lessonStage: Stage,
  competenceStage: Stage,
): Stage {
  if (lessonStage === 'A') return 'A';
  if (lessonStage === 'D') return 'D';
  return competenceStage;
}
