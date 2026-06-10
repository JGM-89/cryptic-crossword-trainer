// Surface-quality rules — the SINGLE shared source for every surface check.
//
// Consumed by:
//   • src/data/surfaces.test.ts      (CI gate over bank + teaching corpus)
//   • scripts/validate-clue.ts       (the pipeline hard-gate for candidates)
//   • scripts/lint-surfaces.ts       (ranked triage for graders/humans)
//
// Two tiers:
//   • GATE rules — deterministic, high-precision; a hit fails CI.
//       gateFlags        — bare word-list / raw caps fodder (the old gate)
//       linkMismatchFlags— containment language gluing a charade (implies the
//                          wrong device and can spell a false answer)
//       indicatorAbsent  — the indicator is quoted verbatim in the hint
//                          ladder, so it MUST appear in the surface
//       coverageFlags    — orphan words: every surface word must be earned by
//                          the definition, the indicator, the fodder, an
//                          operation's cue, or a recognised link word.
//                          Synonym-mediated cues (e.g. "beer" → LAGER) are
//                          budgeted one surface span per such operation.
//   • ADVISORY heuristics (advisoryFlags) — soft signals used only to RANK
//     suspects for review (function-word ratio, proper-noun density, vague
//     nouns, terseness). Whole-clue-definition devices (double-definition,
//     cryptic-definition, &lit) are legitimately terse and exempt from the
//     terseness smell.

export interface SurfaceEntry {
  id: string;
  clue: string;
  clueType: string;
  defText: string;
  indicator: string;
  fodder: string;
  /** Inputs of every wordplay operation (the cues the solver works from). */
  opInputs: string[];
}

const WHOLE_CLUE_DEVICES = new Set(['double-definition', 'cryptic-definition', 'lit']);

/** Adapter: a bank entry (part-*.json shape) → SurfaceEntry. */
export function fromBankEntry(e: {
  answer: string;
  clue: string;
  clueType: string;
  def: { text: string };
  wordplay: { indicator?: string; fodder?: string; operations: { input: string }[] };
}): SurfaceEntry {
  return {
    id: `bank-${e.answer.toLowerCase()}`,
    clue: e.clue,
    clueType: e.clueType,
    defText: e.def.text,
    indicator: e.wordplay.indicator ?? '',
    fodder: e.wordplay.fodder ?? '',
    opInputs: e.wordplay.operations.map((o) => o.input),
  };
}

/** Adapter: a hydrated Clue (teaching corpus / archive) → SurfaceEntry. */
export function fromClue(c: {
  id: string;
  clue: string;
  clueType: string;
  definitionSpan: { text: string };
  wordplay: { indicator?: string; fodder?: string; operations: { input: string }[] };
}): SurfaceEntry {
  return {
    id: c.id,
    clue: c.clue,
    clueType: c.clueType,
    defText: c.definitionSpan.text,
    indicator: c.wordplay.indicator ?? '',
    fodder: c.wordplay.fodder ?? '',
    opInputs: c.wordplay.operations.map((o) => o.input),
  };
}

// Words that make a string read like a sentence/phrase rather than a list.
const CONNECTORS = new Set(
  ('a an the in on at of to for with by from and or but is are was makes make made gives give given ' +
    'has have had as into out up over about after before during not no yes that this his her ' +
    'its their our your my one some any each every it he she they we you i am be being been around ' +
    'becomes become without within behind beside between through across back returns turning held ' +
    'holding taking inside outside near seen shown sound heard say said we’re we\'re')
    .split(/\s+/),
);

// Pure function words — used for the padding-ratio heuristic only.
const FUNCTION_WORDS = new Set(
  ('a an the in on at of to for with by from and or but is are was were be been being am ' +
    'as into out up over about after before during not no that this it he she they we you i ' +
    'his her its their our your my one some any each every without within behind beside between ' +
    'through across back near than then so').split(/\s+/),
);

// Link/glue words a surface may use without them "earning" cryptic work:
// articles, copulas, auxiliaries, conjunctions, prepositions, pronouns,
// demonstratives, and the standard cryptic link verbs (§2.7 — equation `is`,
// wordplay→def `gives/makes/produces/yields/leaves/shows/reveals/becomes`,
// def→wordplay `from`). Deliberately EXCLUDES other content verbs and all
// nouns — those must be definition, indicator, fodder, or an operation cue.
const LINK_WORDS = new Set(
  ('a an the is are was were be been being am s ' +
    'will would shall should can could may might must do does did has have had wont cant ' +
    'and but or when while that this these those there where which who whose whom what ' +
    'to for from of with by on at as into onto in out up down off like ' +
    'around about over under behind beside between through across along above beneath near ' +
    'it its he his him she her they their them we us our you your i me my one not no ' +
    'im hes shes ive youre theyre weve some any each every ' +
    'makes make made making gives give given giving produces produce produced ' +
    'yields yield provides provide brings bring becomes become became ' +
    'leaves leave shows show means reveals reveal spells spell seen found ' +
    'takes take adds add so such still quite all just').split(/\s+/),
);

// Containment language — correct for container/hidden devices, WRONG as the
// glue of a charade (it tells the solver to insert, which can spell a
// different word: "Working in church" reads CONE, not ONCE).
const CONTAINMENT_WORDS = new Set(
  'in inside within into amid amidst among amongst holding holds swallowing swallows embracing embraces around about outside'.split(
    /\s+/,
  ),
);

const ABSTRACT = new Set('thing things stuff something anything everything'.split(/\s+/));

const stripEnum = (clue: string) => clue.replace(/\s*\([^)]*\)\s*$/, '').trim();
const norm = (w: string) =>
  w
    .toLowerCase()
    .replace(/[’']s$/, '')
    .replace(/[^a-z]/g, '');
const tokens = (s: string) => stripEnum(s).split(/\s+/).map(norm).filter(Boolean);

const connectorish = (w: string) => {
  const lw = w.toLowerCase().replace(/[^a-z’']/g, '');
  return CONNECTORS.has(lw) || (lw.length > 3 && /(ed|es|ing|ly|en|s)$/.test(lw));
};

// ── GATE: egregious surfaces ────────────────────────────────────────────────
export function gateFlags(clue: string): string[] {
  const body = stripEnum(clue);
  const words = body.split(/\s+/).filter((t) => /[a-z]/i.test(t));
  const out: string[] = [];
  if (words.length && !words.some(connectorish)) out.push('bare word-list — no verb/connector');
  if (/\b[A-Z]{3,}\b/.test(body)) out.push('raw capitalised fodder in the surface');
  return out;
}

// ── GATE: containment language gluing a charade ────────────────────────────
export function linkMismatchFlags(e: SurfaceEntry): string[] {
  if (e.clueType !== 'charade') return [];
  const allowed = new Set([...tokens(e.defText), ...tokens(e.indicator), ...tokens(e.fodder)]);
  for (const inp of e.opInputs) for (const t of tokens(inp)) allowed.add(t);
  const out: string[] = [];
  for (const t of tokens(e.clue)) {
    if (CONTAINMENT_WORDS.has(t) && !allowed.has(t)) {
      out.push(
        `charade uses containment word "${t}" as its glue — implies an insertion (wrong device)`,
      );
    }
  }
  return out;
}

// ── GATE: indicator must appear in the surface (it is quoted in the hints) ──
export function indicatorAbsent(e: SurfaceEntry): boolean {
  if (!e.indicator) return false;
  const body = stripEnum(e.clue).toLowerCase();
  return e.indicator
    .split(/\s*\.\.\.\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
    .some((frag) => !body.includes(frag.toLowerCase()));
}

// ── GATE: orphan words (economy, mechanically) ──────────────────────────────
// Every surface word must be earned: definition, indicator, fodder, an
// operation's cue, or a recognised link word. An operation whose cue does NOT
// appear in the surface (a synonym-mediated cue like "beer" → LAGER) buys ONE
// contiguous span of otherwise-uncovered words — the surface words standing in
// for it. Anything left over is decoration the cryptic reading never pays for.
function orphanSpans(e: SurfaceEntry): string[][] {
  if (WHOLE_CLUE_DEVICES.has(e.clueType)) return [];
  const clueToks = tokens(e.clue);
  const covered = new Set([...tokens(e.defText), ...tokens(e.indicator), ...tokens(e.fodder)]);

  // Op inputs: carrier markup (<...>), op symbols (+, −) and case are noise.
  let budget = 0;
  for (const inp of e.opInputs) {
    const inpToks = tokens(inp.replace(/[<>+−–-]/g, ' '));
    if (!inpToks.length) continue;
    const present = inpToks.filter((t) => clueToks.includes(t));
    if (present.length === 0) budget += 1; // synonym-mediated cue: earns one span
    for (const t of inpToks) covered.add(t);
  }

  // Uncovered spans: contiguous runs of tokens that are neither covered nor links.
  const spans: string[][] = [];
  let run: string[] = [];
  for (const t of clueToks) {
    if (covered.has(t) || LINK_WORDS.has(t)) {
      if (run.length) spans.push(run);
      run = [];
    } else {
      run.push(t);
    }
  }
  if (run.length) spans.push(run);

  // Synonym-mediated cues are stood-in-for by surface words; allocate the
  // budget to the LONGEST spans (a synonym cue is usually a multi-word phrase).
  const ranked = spans.slice().sort((a, b) => b.length - a.length);
  return ranked.slice(budget);
}

// GATE only the flagrant cases: a multi-word orphan phrase, or two or more
// orphans beyond budget — mechanical padding. A SINGLE leftover word is a
// judgment call (often a load-bearing decorative noun, §1b-c) and is scored
// in advisoryFlags for the realism judge / human instead.
export function coverageFlags(e: SurfaceEntry): string[] {
  const leftover = orphanSpans(e);
  const flagrant = leftover.length >= 2 || leftover.some((s) => s.length >= 2);
  if (!flagrant) return [];
  return [
    `orphan word(s) doing no cryptic work: ${leftover.map((s) => `"${s.join(' ')}"`).join(', ')}`,
  ];
}

/** All gate checks for one entry (the CI/pipeline hard gate). */
export function surfaceGateFlags(e: SurfaceEntry): string[] {
  const out = [...gateFlags(e.clue), ...linkMismatchFlags(e), ...coverageFlags(e)];
  if (indicatorAbsent(e)) out.push(`indicator "${e.indicator}" absent from the surface`);
  return out;
}

// ── ADVISORY heuristics (ranking only, never gating) ────────────────────────
export function advisoryFlags(e: SurfaceEntry): { issues: string[]; score: number } {
  const body = stripEnum(e.clue);
  const words = body.split(/\s+/).filter((t) => /[a-z]/i.test(t));
  const n = words.length || 1;
  const issues: string[] = [];
  let score = 0;

  const fnCount = words.filter((w) => FUNCTION_WORDS.has(norm(w))).length;
  const fnRatio = fnCount / n;
  if (fnRatio > 0.62) {
    issues.push(`high function-word ratio ${Math.round(fnRatio * 100)}% (padding?)`);
    score += 1.5;
  }

  const propers = words.slice(1).filter((w) => /^[A-Z][a-z’']/.test(w));
  if (propers.length > 2) {
    issues.push(`proper-noun heavy (${propers.length} mid-clue capitals)`);
    score += 1.5;
  }

  const abstracts = words.filter((w) => ABSTRACT.has(norm(w)));
  if (abstracts.length) {
    issues.push(`vague noun(s): ${abstracts.map(norm).join(', ')}`);
    score += 1;
  }

  // Terse: ≤3 words with at most one binding word reads as a bare pair —
  // EXCEPT for whole-clue-definition devices, which are legitimately short
  // ("Terribly evil" is a gold-standard &lit, not a fault).
  const binders = words.filter(connectorish).length;
  if (n <= 3 && binders <= 1 && !WHOLE_CLUE_DEVICES.has(e.clueType)) {
    issues.push('terse — barely a sentence');
    score += 1.25;
  }

  // A single leftover decorative word (below the coverage gate): possibly a
  // load-bearing orphan (§1b-c) — rank it for the realism judge / human.
  const leftover = orphanSpans(e);
  if (leftover.length === 1 && leftover[0].length === 1) {
    issues.push(`possible decorative orphan: "${leftover[0][0]}"`);
    score += 1.5;
  }

  return { issues, score };
}
