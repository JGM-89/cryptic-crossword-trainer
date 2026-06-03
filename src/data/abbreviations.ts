// Machine-readable cryptic-abbreviation dictionary — the source of truth for the
// fairness validator (integrity.ts). A charade/insertion piece that turns a cue
// word into letters is only fair if the mapping is a *recognised* convention;
// this table is what "recognised" means. (The Reference page's ABBREVIATIONS in
// reference.ts is a curated teaching subset for display; THIS is the complete
// validation set — keep entries strictly standard so it never blesses a bad clue.)
//
// Keys are lowercased cue words/phrases; values are the uppercase letter-strings
// that cue may fairly produce. First-letter devices ("boy primarily" → B) are
// handled separately in the validator, not here.

export const ABBR: Record<string, string[]> = {
  // ── Compass / direction ────────────────────────────────────────────────
  north: ['N'], south: ['S'], east: ['E'], west: ['W'],
  northern: ['N'], southern: ['S'], eastern: ['E'], western: ['W'],
  point: ['N', 'S', 'E', 'W'],

  // ── People, titles, roles ──────────────────────────────────────────────
  bachelor: ['B', 'BA'], wife: ['W'], woman: ['W'], women: ['W'],
  man: ['M'], husband: ['H'], daughter: ['D'], son: ['S'], child: ['C'],
  king: ['K', 'R'], queen: ['Q', 'ER', 'HM', 'R'], prince: ['P'],
  saint: ['ST', 'S'], pope: ['P'], bishop: ['B'], knight: ['N'],
  doctor: ['DR', 'MO', 'MB'], learner: ['L'], student: ['L'], pupil: ['L'],
  sailor: ['AB', 'TAR', 'RN'], soldier: ['GI', 'OR'], engineer: ['RE'],
  nurse: ['RN', 'SEN'], graduate: ['BA', 'MA'], fellow: ['F'],

  // ── Cricket ────────────────────────────────────────────────────────────
  run: ['R'], runs: ['R'], caught: ['C'], bowled: ['B'], over: ['O'],
  maiden: ['M'], wicket: ['W'], duck: ['O'], 'leg before': ['LBW'],

  // ── Music / sound ──────────────────────────────────────────────────────
  quiet: ['P'], soft: ['P'], loud: ['F'], 'very loud': ['FF'],
  note: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], key: ['B'],

  // ── Science / units ────────────────────────────────────────────────────
  energy: ['E'], oxygen: ['O'], hydrogen: ['H'], carbon: ['C'],
  gold: ['OR', 'AU'], silver: ['AG'], copper: ['CU'], iron: ['FE'],
  current: ['I', 'AC', 'DC'], resistance: ['R'], force: ['F'],
  power: ['P', 'W'], unknown: ['X', 'Y', 'Z'],

  // ── Numbers (Roman & cued) ─────────────────────────────────────────────
  one: ['I', 'A'], five: ['V'], ten: ['X'], fifty: ['L'],
  hundred: ['C'], 'five hundred': ['D'], thousand: ['M', 'K'], million: ['M'],
  nothing: ['O'], love: ['O'], nil: ['O'], zero: ['O'], ring: ['O'],

  // ── Cards / colours ────────────────────────────────────────────────────
  hearts: ['H'], heart: ['H'], spades: ['S'], clubs: ['C'], diamonds: ['D'],
  black: ['B'], white: ['W'], red: ['R'],

  // ── Politics ───────────────────────────────────────────────────────────
  conservative: ['C'], labour: ['LAB'], liberal: ['L'],
  republican: ['R'], democrat: ['D'], left: ['L'], right: ['R'],

  // ── Places / institutions ──────────────────────────────────────────────
  company: ['CO'], firm: ['CO'], church: ['CH', 'CE', 'RC'],
  street: ['ST'], road: ['RD'], avenue: ['AVE'],
  america: ['US', 'USA'], american: ['US'], britain: ['GB', 'UK'],
  british: ['B', 'BR'], island: ['I'], river: ['R'], lake: ['L'],

  // ── Time ───────────────────────────────────────────────────────────────
  time: ['T'], second: ['S'], hour: ['H'], day: ['D'], year: ['Y'],

  // ── Size / quality / misc ──────────────────────────────────────────────
  small: ['S'], large: ['L'], hot: ['H'], cold: ['C'], hard: ['H'],
  new: ['N'], old: ['O'], good: ['G'], number: ['N', 'NO'], line: ['L'],
  page: ['P'], area: ['A'], degree: ['D'], about: ['C', 'CA', 'RE'],
  circa: ['C'], book: ['B', 'NT', 'OT'], vitamin: ['A', 'B', 'C', 'D', 'E', 'K'],

  // ── Foreign articles ───────────────────────────────────────────────────
  'the french': ['LE', 'LA', 'LES'], 'the spanish': ['EL', 'LA'],
  'the german': ['DER', 'DIE', 'DAS'], 'the italian': ['IL', 'LA'],
};
