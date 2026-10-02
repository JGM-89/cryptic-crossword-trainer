// The Daily archive: every Daily from #1 to today, newest first, with your
// result on each. Catch-up solves are scored against par but never touch the
// streak (see recordArchiveSolve).
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dailyByNumber, dateKey, dayNumber, formatDateKey } from '../data/daily';
import { parFor, scoreLabel } from '../data/par';
import { loadDaily, resultFor, type DailyResult } from '../state/dailyProgress';
import { track } from '../analytics';

function resultText(r: DailyResult | undefined, par: number): string | null {
  if (!r) return null;
  if (r.revealed) return 'Revealed';
  if (r.score !== undefined) return scoreLabel(r.score, r.par ?? par);
  return 'Solved';
}

export function DailyArchivePage() {
  const todayNumber = dayNumber(dateKey());
  const state = useMemo(loadDaily, []);
  const rows = useMemo(() => {
    const out = [];
    for (let n = todayNumber; n >= 1; n--) {
      const d = dailyByNumber(n);
      if (d) out.push({ ...d, par: parFor(d.clue), result: resultFor(state, d.date) });
    }
    return out;
  }, [todayNumber, state]);
  const solved = rows.filter((r) => r.result).length;

  useEffect(() => {
    track('daily_archive_view', { total: rows.length, solved });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page daily-archive-page">
      <header className="lesson-page-head">
        <h1>The Daily archive</h1>
        {rows.length === 0 ? (
          <p className="lede">
            The first Daily arrives on 15 June 2026. <Link to="/learn">Warm up in Learn →</Link>
          </p>
        ) : (
          <p className="lede">
            Every Daily so far — you’ve solved {solved} of {rows.length}. Catch-up solves are scored
            against par but don’t count toward your streak.
          </p>
        )}
      </header>

      <ul className="daily-archive">
        {rows.map((row) => {
          const isToday = row.number === todayNumber;
          const text = resultText(row.result, row.par);
          return (
            <li key={row.number}>
              <Link to={isToday ? '/daily' : `/daily/${row.number}`}>
                <span className="num">#{row.number}</span>
                <span className="date">
                  {isToday ? 'Today' : formatDateKey(row.date)} · par {row.par}
                </span>
                <span className={`result ${text ? 'done' : isToday ? 'today' : ''}`.trim()}>
                  {text ?? (isToday ? 'Play now' : 'Not played')}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {rows.length > 0 && (
        <p className="page-foot">
          <Link to="/daily">Back to today’s Daily →</Link>
        </p>
      )}
    </div>
  );
}
