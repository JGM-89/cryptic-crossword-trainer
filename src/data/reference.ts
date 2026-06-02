// Reference tables: indicator vocabulary by device, and the standard
// abbreviation "code words". Compiled from openly-listed conventions
// (Cryptipedia / Crossword Unclued / Wikipedia "Crossword abbreviations").
// These are short factual lists, shipped for the Reference browser and to back
// the clue analyzer's indicator detection.

import type { ClueType } from '../types';

export interface IndicatorGroup {
  clueType: Exclude<ClueType, 'double-definition'>;
  label: string;
  note: string;
  indicators: string[];
}

export const INDICATORS: IndicatorGroup[] = [
  {
    clueType: 'hidden',
    label: 'Hidden-word indicators',
    note: 'Signal that the answer is concealed in consecutive letters.',
    indicators: ['in', 'within', 'some', 'part of', 'bit of', 'held by', 'sample of', 'buried in', 'essentially', 'contains'],
  },
  {
    clueType: 'anagram',
    label: 'Anagram indicators',
    note: 'Signal that nearby letters (the fodder) must be rearranged. Thousands exist.',
    indicators: ['confused', 'mixed', 'broken', 'cooked', 'drunk', 'wild', 'out', 'strange', 'rearranged', 'upset', 'all over the place', 'sadly', 'developed', 'broadcast'],
  },
  {
    clueType: 'charade',
    label: 'Charade joiners',
    note: 'Often there is no indicator; these link words just glue the pieces.',
    indicators: ['and', 'with', 'after', 'by', 'then', 'beside', 'next to'],
  },
  {
    clueType: 'container',
    label: 'Container / insertion indicators',
    note: 'Signal that one string goes inside another.',
    indicators: ['around', 'holding', 'outside', 'swallowing', 'in', 'embraces', 'devouring', 'set in', 'taking', 'installing', 'penned by'],
  },
  {
    clueType: 'reversal',
    label: 'Reversal indicators',
    note: 'Signal that letters are read backwards. Some only work in down clues.',
    indicators: ['back', 'returned', 'about', 'over', 'up (down clues)', 'rising', 'lifted', 'recalled', 'turning'],
  },
  {
    clueType: 'deletion',
    label: 'Deletion indicators',
    note: 'Signal which letter(s) to remove.',
    indicators: ['headless', 'endless', 'heartless', 'beheaded', 'short', 'losing', 'without', 'curtailed', 'topless'],
  },
  {
    clueType: 'homophone',
    label: 'Homophone indicators',
    note: 'Signal that the answer sounds like another word.',
    indicators: ['sounds like', 'we hear', 'said', 'on the air', 'reportedly', "we're told", 'by the sound of it', 'audibly'],
  },
  {
    clueType: 'cryptic-definition',
    label: 'Cryptic-definition flags',
    note: 'A question mark often signals a punning or whimsical definition.',
    indicators: ['?', 'perhaps', 'of sorts', 'we might say'],
  },
];

export interface Abbreviation {
  cue: string;
  letters: string;
  note?: string;
}

export const ABBREVIATIONS: Abbreviation[] = [
  { cue: 'north / south / east / west', letters: 'N / S / E / W', note: 'compass points' },
  { cue: 'Roman numerals', letters: 'I, V, X, L, C, D, M', note: '1, 5, 10, 50, 100, 500, 1000' },
  { cue: 'sailor', letters: 'AB or TAR', note: 'one cue, several answers — crossing letters disambiguate' },
  { cue: 'queen', letters: 'Q, ER or HM' },
  { cue: 'gold', letters: 'OR or AU', note: 'OR is heraldic gold' },
  { cue: 'love / nothing / ring', letters: 'O' },
  { cue: 'learner', letters: 'L', note: 'as in an L-plate' },
  { cue: 'doctor', letters: 'DR, MO or MB' },
  { cue: 'saint', letters: 'ST' },
  { cue: 'quiet', letters: 'P', note: 'piano, in music' },
  { cue: 'loud', letters: 'F', note: 'forte, in music' },
  { cue: 'about', letters: 'C or RE', note: 'C = circa' },
  { cue: 'church', letters: 'CE or CH' },
  { cue: 'current', letters: 'AC, DC or I' },
  { cue: 'note', letters: 'A–G or DO/RE/MI' },
  { cue: 'knight', letters: 'N', note: 'in chess notation' },
  { cue: 'king', letters: 'K or R', note: 'R = Rex' },
  { cue: 'book', letters: 'B, NT or OT' },
  { cue: 'one', letters: 'I or A', note: 'Roman numeral I' },
  { cue: 'energy', letters: 'E' },
  { cue: 'the French', letters: 'LE or LA', note: '“the” in French' },
  { cue: 'the Spanish', letters: 'EL or LA' },
  { cue: 'the German', letters: 'DER, DIE or DAS' },
];
