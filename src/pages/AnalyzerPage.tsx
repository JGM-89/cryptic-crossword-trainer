import { useMemo, useState } from 'react';
import { CLUES } from '../data';
import { INDICATORS } from '../data/reference';
import { CLUE_TYPE_LABELS, type Clue } from '../types';
import { ClueText, type Highlight } from '../components/ClueText';

/** Indicators from the reference lists that literally appear in the clue. */
function detectIndicators(clue: string): { clueType: string; phrase: string }[] {
  const hay = clue.toLowerCase();
  const hits: { clueType: string; phrase: string }[] = [];
  for (const group of INDICATORS) {
    for (const raw of group.indicators) {
      const phrase = raw.replace(/\s*\(.*\)$/, '').toLowerCase().trim();
      if (!phrase) continue;
      if (phrase === '?') {
        if (clue.includes('?')) hits.push({ clueType: group.label, phrase: '?' });
        continue;
      }
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, 'i');
      if (re.test(hay)) hits.push({ clueType: group.label, phrase: raw });
    }
  }
  return hits;
}

export function AnalyzerPage() {
  const [selectedId, setSelectedId] = useState(CLUES[0].id);
  const [step, setStep] = useState(0);
  const clue = useMemo(
    () => CLUES.find((c) => c.id === selectedId) as Clue,
    [selectedId],
  );
  const detected = useMemo(() => detectIndicators(clue.clue), [clue]);

  function pick(id: string) {
    setSelectedId(id);
    setStep(0);
  }

  const steps = ['Definition', 'Clue type', 'Indicators', 'Full parse'];

  const highlights: Highlight[] = [];
  if (step >= 1) {
    highlights.push({
      start: clue.definitionSpan.start,
      end: clue.definitionSpan.end,
      className: 'definition',
      title: 'Definition',
    });
  }
  if (step >= 3 && clue.wordplay.indicator) {
    const idx = clue.clue.toLowerCase().indexOf(clue.wordplay.indicator.toLowerCase());
    if (idx !== -1) {
      highlights.push({
        start: idx,
        end: idx + clue.wordplay.indicator.length,
        className: 'indicator-mark',
        title: 'Indicator',
      });
    }
  }

  return (
    <div className="page analyzer">
      <header className="lesson-page-head">
        <h1>Clue analyzer</h1>
        <p className="lede">
          Pick any clue and peel it apart one layer at a time — where the definition is,
          which device is in play, and the indicator words that give it away.
        </p>
      </header>

      <label className="analyzer-select">
        <span>Choose a clue</span>
        <select value={selectedId} onChange={(e) => pick(e.target.value)}>
          {CLUES.map((c) => (
            <option key={c.id} value={c.id}>
              {CLUE_TYPE_LABELS[c.clueType]} — {c.clue}
            </option>
          ))}
        </select>
      </label>

      <div className="analyzer-stage">
        <p className="analyzer-clue">
          <ClueText clue={clue.clue} highlights={highlights} />
        </p>

        <div className="analyzer-steps">
          {steps.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`btn ${step >= i + 1 ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStep(i + 1)}
            >
              {i + 1}. {label}
            </button>
          ))}
          <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
            Reset
          </button>
        </div>

        <div className="analyzer-readout">
          {step >= 1 && (
            <p>
              <strong>Definition:</strong> “{clue.definitionSpan.text}” (at the{' '}
              {clue.definitionSpan.position}).
            </p>
          )}
          {step >= 2 && (
            <p>
              <strong>Device:</strong> {CLUE_TYPE_LABELS[clue.clueType]}.
            </p>
          )}
          {step >= 3 && (
            <div>
              <strong>Indicators spotted:</strong>{' '}
              {detected.length ? (
                <ul className="indicator-hits">
                  {detected.map((d, i) => (
                    <li key={i}>
                      <code>{d.phrase}</code> <span className="muted">→ {d.clueType}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="muted">
                  none from the standard lists (charades and double definitions often have none).
                </span>
              )}
            </div>
          )}
          {step >= 4 && (
            <p className="analyzer-parse">
              <strong>Parse:</strong> {clue.hints[3].text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
