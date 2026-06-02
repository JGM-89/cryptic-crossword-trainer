// The curriculum: an ordered list of stages → lessons.
//
// Stage A teaches one device per lesson in the brief's order. Stage B mixes
// devices in small sets. Stage C is full mixed practice. Stage D is the plain
// daily cryptic (a real grid). Lessons unlock in order; the *scaffolding* a
// learner sees, however, is driven per-device by the competence engine — so a
// learner can be Independent at anagrams while still being Taught at homophones.

import {
  CLUE_TYPE_LABELS,
  CLUE_TYPE_ORDER,
  type Curriculum,
  type Lesson,
} from '../types';
import { cluesOfType } from './corpus';

const stageALessons: Lesson[] = CLUE_TYPE_ORDER.map((type, i) => ({
  id: `A-${type}`,
  title: `${i + 1}. ${CLUE_TYPE_LABELS[type]}s`,
  clueType: type,
  blurb: deviceBlurb(type),
  clueIds: cluesOfType(type).map((c) => c.id),
}));

function deviceBlurb(type: string): string {
  switch (type) {
    case 'hidden':
      return 'The answer is sitting in plain sight, spelled out across the words of the clue.';
    case 'anagram':
      return 'An indicator tells you to jumble nearby letters. The letters are always right there.';
    case 'charade':
      return 'Build the answer from shorter pieces — synonyms and abbreviations — joined end to end.';
    case 'container':
      return 'One piece is tucked inside another. Watch for words like “holding” or “around”.';
    case 'reversal':
      return 'A word is written backwards. “Returned”, “about” and (in downs) “up” signal it.';
    case 'deletion':
      return 'Lose a letter: “headless”, “endless” and “heartless” tell you which one to drop.';
    case 'homophone':
      return 'The answer sounds like another word. “We hear” and “reportedly” are the giveaways.';
    case 'double-definition':
      return 'Two definitions side by side, no wordplay at all. Look for an unexpected second meaning.';
    case 'cryptic-definition':
      return 'The whole clue is one playful definition. A “?” usually flags the pun.';
    default:
      return '';
  }
}

// Stage B — guided: mix the devices learned so far into small sets.
const stageBLessons: Lesson[] = [
  {
    id: 'B-mix-1',
    title: 'Mixed: hidden, anagram & charade',
    clueType: 'mixed',
    blurb: 'The definition is no longer highlighted — but the first hint is always one tap away.',
    clueIds: [
      ...pick('hidden', 2),
      ...pick('anagram', 2),
      ...pick('charade', 2),
    ],
  },
  {
    id: 'B-mix-2',
    title: 'Mixed: containers, reversals & deletions',
    clueType: 'mixed',
    blurb: 'Spot the device yourself this time. Reach for a hint only when you need one.',
    clueIds: [
      ...pick('container', 2),
      ...pick('reversal', 2),
      ...pick('deletion', 2),
    ],
  },
];

// Stage C — coached: everything mixed, hints only on request / after a slip.
const stageCLessons: Lesson[] = [
  {
    id: 'C-mix-1',
    title: 'Coached practice',
    clueType: 'mixed',
    blurb: 'A full mix of every device. No hints unless you ask, or you answer wrongly.',
    clueIds: [
      ...pick('hidden', 1),
      ...pick('anagram', 1),
      ...pick('charade', 1),
      ...pick('container', 1),
      ...pick('reversal', 1),
      ...pick('deletion', 1),
      ...pick('homophone', 1),
      ...pick('double-definition', 1),
      ...pick('cryptic-definition', 1),
    ],
  },
];

function pick(type: Parameters<typeof cluesOfType>[0], n: number): string[] {
  return cluesOfType(type)
    .slice(0, n)
    .map((c) => c.id);
}

export const CURRICULUM: Curriculum = {
  stages: [
    { stage: 'A', title: 'Taught — one device at a time', lessons: stageALessons },
    { stage: 'B', title: 'Guided — devices mixed', lessons: stageBLessons },
    { stage: 'C', title: 'Coached — full mix', lessons: stageCLessons },
    {
      stage: 'D',
      title: 'Independent — the daily cryptic',
      lessons: [
        {
          id: 'D-daily-001',
          title: 'Daily Cryptic №1',
          clueType: 'mixed',
          blurb: 'A real interlocking grid. No hints by default — you are solving for yourself now.',
          clueIds: [], // grid puzzle, handled by the puzzle view
        },
      ],
    },
  ],
};

/** All lessons flattened in progression order (used for sequential unlocking). */
export function allLessons(): Lesson[] {
  return CURRICULUM.stages.flatMap((s) => s.lessons);
}

export function getLesson(id: string): Lesson | undefined {
  return allLessons().find((l) => l.id === id);
}

/** A lesson together with the stage it lives under. */
export function findLesson(
  id: string,
): { lesson: Lesson; stage: import('../types').Stage } | undefined {
  for (const stage of CURRICULUM.stages) {
    const lesson = stage.lessons.find((l) => l.id === id);
    if (lesson) return { lesson, stage: stage.stage };
  }
  return undefined;
}
