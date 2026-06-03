export interface Highlight {
  start: number;
  end: number;
  className: string;
  title?: string;
}

interface Props {
  clue: string;
  /** Non-overlapping spans to highlight (e.g. definition, indicator). */
  highlights: Highlight[];
}

/** A trailing enumeration like "(5)", "(3,4)" or "(2-3)" at the very end. */
const ENUM_RE = /^([\s\S]*?)(\s*)(\([\d][\d,\-–.\s]*\))\s*$/;

/**
 * Render a plain tail of clue text, wrapping a trailing enumeration in a muted
 * mono `.enum` span (purely cosmetic — the highlight offsets never reach here).
 */
function renderTail(text: string, key: React.Key): React.ReactNode {
  const m = ENUM_RE.exec(text);
  if (!m) return text;
  const [, main, ws, enumPart] = m;
  return (
    <span key={key}>
      {main}
      {ws}
      <span className="enum">{enumPart}</span>
    </span>
  );
}

/**
 * Renders the clue, wrapping any highlighted spans in <mark>. Highlights are
 * revealed progressively as the learner opens the matching hint rung, so the
 * clue is never pre-annotated.
 */
export function ClueText({ clue, highlights }: Props) {
  const spans = highlights
    .filter((h) => h.start >= 0 && h.end > h.start && h.end <= clue.length)
    .sort((a, b) => a.start - b.start);

  if (spans.length === 0) return <span className="clue-text">{renderTail(clue, 'tail')}</span>;

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  spans.forEach((h, i) => {
    if (h.start < cursor) return; // skip any overlap defensively
    if (h.start > cursor) parts.push(clue.slice(cursor, h.start));
    parts.push(
      <mark key={i} className={h.className} title={h.title}>
        {clue.slice(h.start, h.end)}
      </mark>,
    );
    cursor = h.end;
  });
  if (cursor < clue.length) parts.push(renderTail(clue.slice(cursor), 'tail'));

  return <span className="clue-text">{parts}</span>;
}
