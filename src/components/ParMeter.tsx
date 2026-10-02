// The Daily's score against par: a row of small cells (Cruci's grid motif),
// filled one per hint or letter spent, with par marked beneath its cell.

interface Props {
  score: number;
  par: number;
}

export function ParMeter({ score, par }: Props) {
  const total = Math.max(par + 3, score + 1);
  return (
    <div className="par-meter" role="img" aria-label={`Score ${score}, par ${par}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className="par-slot">
          <span
            className={`par-dot ${i < score ? (i < par ? 'spent' : 'over') : ''}`.trim()}
            aria-hidden
          />
          {i === par - 1 && (
            <span className="par-mark" aria-hidden>
              par
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
