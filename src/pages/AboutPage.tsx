import { CLUES } from '../data';
import { useProgress } from '../state/ProgressContext';

export function AboutPage() {
  const { reset, state } = useProgress();
  const solvedCount = Object.keys(state.solvedClues).length;

  return (
    <div className="page about">
      <header className="lesson-page-head">
        <h1>How it works</h1>
      </header>

      <section className="prose">
        <h2>The one idea to hold onto</h2>
        <p>
          Every fair cryptic clue is a <strong>definition</strong> at one end and some{' '}
          <strong>wordplay</strong> at the other, each leading independently to the same
          answer. The single biggest beginner unlock is to stop reading the clue as a
          sentence and find the boundary between the two halves.
        </p>

        <h2>Scaffolding that fades</h2>
        <p>
          We teach one device at a time in a deliberate order — hidden words, anagrams,
          charades, containers, reversals, deletions, homophones, double definitions and
          finally cryptic definitions. Each clue carries a four-rung hint ladder:
        </p>
        <ol>
          <li>
            <strong>Definition</strong> — which end of the clue defines the answer.
          </li>
          <li>
            <strong>Clue type</strong> — which device is in play.
          </li>
          <li>
            <strong>Indicator &amp; fodder</strong> — the signal word and what it acts on.
          </li>
          <li>
            <strong>Full parse</strong> — the complete worked breakdown.
          </li>
        </ol>
        <p>
          The support <em>fades per device</em>, driven by how you actually perform.
          Solve a device cleanly a couple of times and its scaffolding steps back — the
          definition stops being highlighted, then the hints retreat behind a tap, until
          you reach a plain daily cryptic with no help at all. Because it is tracked per
          device, you can be <strong>Independent</strong> at anagrams while still being{' '}
          <strong>Taught</strong> at homophones. This mirrors the learning-science finding
          (McNeill, Lizotte, Krajcik &amp; Marx, 2006) that <em>faded</em> support builds
          stronger independent skill than support that never lets go.
        </p>

        <h2>The clues</h2>
        <p>
          All {CLUES.length} teaching clues here are <strong>originally authored</strong>{' '}
          and machine-checked for fairness: exactly one definition, wordplay that accounts
          for every letter, no indirect anagrams, recognised indicators only, and an
          enumeration that matches the answer. The indicator and abbreviation lists are
          compiled from openly published conventions; George Ho’s openly-licensed clue
          dataset (ODbL) is used only as a build-time reference, never republished.
        </p>

        <h2>Your progress</h2>
        <p>
          Everything is stored locally in your browser (IndexedDB) — there is no account
          and no server. You have solved <strong>{solvedCount}</strong> clue
          {solvedCount === 1 ? '' : 's'} so far.{' '}
          We collect anonymous, cookie-less usage counts (which lessons and puzzles get played) to decide what to build next — never anything personal.
        </p>
        <button
          type="button"
          className="btn btn-ghost danger"
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) reset();
          }}
        >
          Reset my progress
        </button>
      </section>
    </div>
  );
}
