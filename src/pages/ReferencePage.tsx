import { useMemo, useState } from 'react';
import { ABBREVIATIONS, INDICATORS } from '../data/reference';

export function ReferencePage() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const indicatorGroups = useMemo(() => {
    if (!q) return INDICATORS;
    return INDICATORS.map((g) => ({
      ...g,
      indicators: g.indicators.filter(
        (ind) => ind.toLowerCase().includes(q) || g.label.toLowerCase().includes(q),
      ),
    })).filter((g) => g.indicators.length > 0);
  }, [q]);

  const abbreviations = useMemo(() => {
    if (!q) return ABBREVIATIONS;
    return ABBREVIATIONS.filter(
      (a) =>
        a.cue.toLowerCase().includes(q) ||
        a.letters.toLowerCase().includes(q) ||
        (a.note ?? '').toLowerCase().includes(q),
    );
  }, [q]);

  return (
    <div className="page reference">
      <header className="lesson-page-head">
        <h1>Reference</h1>
        <p className="lede">
          The indicator vocabulary and the standard abbreviation “code words”. One cue can
          map to several letters — the crossing letters disambiguate.
        </p>
      </header>

      <input
        className="search"
        type="search"
        placeholder="Search indicators and abbreviations…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search reference"
      />

      <section className="ref-section">
        <h2>Indicators by device</h2>
        <div className="indicator-groups">
          {indicatorGroups.map((g) => (
            <div key={g.label} className="indicator-card">
              <h3>{g.label}</h3>
              <p className="muted">{g.note}</p>
              <div className="chips">
                {g.indicators.map((ind) => (
                  <span key={ind} className="chip">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {indicatorGroups.length === 0 && <p className="muted">No indicators match.</p>}
        </div>
      </section>

      <section className="ref-section">
        <h2>Abbreviations &amp; code words</h2>
        <table className="abbr-table">
          <thead>
            <tr>
              <th>Cue</th>
              <th>Letters</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {abbreviations.map((a) => (
              <tr key={a.cue}>
                <td>{a.cue}</td>
                <td>
                  <code>{a.letters}</code>
                </td>
                <td className="muted">{a.note ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {abbreviations.length === 0 && <p className="muted">No abbreviations match.</p>}
      </section>
    </div>
  );
}
