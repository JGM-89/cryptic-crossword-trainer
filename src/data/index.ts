// Public data API: hydrated clues, lookups, the curriculum, and puzzles.

export { CLUES, getClue, cluesOfType, clueIdsByType } from './corpus';
export { CURRICULUM, allLessons, getLesson, findLesson } from './curriculum';
export { PUZZLES, getPuzzle } from './puzzles';
export { validateAll, validateClue } from './integrity';
