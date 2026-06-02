import type { DefinitionSpan } from '../types';

interface Props {
  clue: string;
  definitionSpan: DefinitionSpan;
  /** When true, the definition portion is visually highlighted (Stage A). */
  highlight: boolean;
}

/** Renders the clue, optionally underlining the definition span in place. */
export function ClueText({ clue, definitionSpan, highlight }: Props) {
  if (!highlight) return <span className="clue-text">{clue}</span>;

  const { start, end } = definitionSpan;
  const before = clue.slice(0, start);
  const def = clue.slice(start, end);
  const after = clue.slice(end);

  return (
    <span className="clue-text">
      {before}
      <mark className="definition" title="This is the definition">
        {def}
      </mark>
      {after}
    </span>
  );
}
