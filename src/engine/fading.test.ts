import { describe, expect, it } from 'vitest';
import {
  ADVANCE_THRESHOLD,
  effectiveStage,
  initialCompetence,
  recordSolve,
  scaffoldingFor,
  type CompetenceRecord,
} from './fading';

const fresh = (): CompetenceRecord => ({
  stage: 'A',
  streak: 0,
  solvedNoHint: 0,
  solvedWithHint: 0,
  attempts: 0,
});

describe('recordSolve', () => {
  it('advances one stage after the clean-solve threshold', () => {
    let rec = fresh();
    for (let i = 0; i < ADVANCE_THRESHOLD; i++) {
      rec = recordSolve(rec, { usedHint: false });
    }
    expect(rec.stage).toBe('B');
    expect(rec.streak).toBe(0); // meter resets at the new stage
    expect(rec.solvedNoHint).toBe(ADVANCE_THRESHOLD);
  });

  it('climbs A → B → C → D with sustained clean solves and caps at D', () => {
    let rec = fresh();
    for (let i = 0; i < ADVANCE_THRESHOLD * 5; i++) {
      rec = recordSolve(rec, { usedHint: false });
    }
    expect(rec.stage).toBe('D');
  });

  it('resets the streak when a hint is used', () => {
    let rec = recordSolve(fresh(), { usedHint: false });
    expect(rec.streak).toBe(1);
    rec = recordSolve(rec, { usedHint: true });
    expect(rec.streak).toBe(0);
    expect(rec.solvedWithHint).toBe(1);
    expect(rec.stage).toBe('A');
  });

  it('tracks best solve time', () => {
    let rec = recordSolve(fresh(), { usedHint: false, timeMs: 9000 });
    rec = recordSolve(rec, { usedHint: false, timeMs: 4000 });
    expect(rec.bestTimeMs).toBe(4000);
  });
});

describe('per-device independence', () => {
  it('lets one device reach D while another stays at A', () => {
    const comp = initialCompetence();
    let anagram = comp.anagram;
    for (let i = 0; i < ADVANCE_THRESHOLD * 5; i++) {
      anagram = recordSolve(anagram, { usedHint: false });
    }
    expect(anagram.stage).toBe('D');
    expect(comp.homophone.stage).toBe('A');
  });
});

describe('effectiveStage', () => {
  it('forces full scaffolding in Stage A lessons regardless of competence', () => {
    expect(effectiveStage('A', 'D')).toBe('A');
  });
  it('forces independence in the Stage D daily cryptic', () => {
    expect(effectiveStage('D', 'A')).toBe('D');
  });
  it('defers to per-device competence in mixed (B/C) lessons', () => {
    expect(effectiveStage('C', 'A')).toBe('A'); // weak device → more help
    expect(effectiveStage('B', 'D')).toBe('D'); // strong device → faded
  });
});

describe('scaffoldingFor', () => {
  it('pre-highlights the definition and offers all hints at Stage A', () => {
    const s = scaffoldingFor('A');
    expect(s.preHighlightDefinition).toBe(true);
    expect(s.hintAvailability).toBe('all');
  });
  it('surfaces hints only after solving at Stage D', () => {
    const s = scaffoldingFor('D');
    expect(s.preHighlightDefinition).toBe(false);
    expect(s.showClueTypeBadge).toBe(false);
    expect(s.hintAvailability).toBe('afterSolve');
  });
});
