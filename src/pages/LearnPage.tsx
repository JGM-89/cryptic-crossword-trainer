import { Link } from 'react-router-dom';
import { CURRICULUM } from '../data';
import {
  CLUE_TYPE_LABELS,
  CLUE_TYPE_ORDER,
  STAGE_LABELS,
  type Lesson,
} from '../types';
import { useProgress } from '../state/ProgressContext';
import { isLessonComplete, lessonProgress, unlockedLessons } from '../engine/progress';

export function LearnPage() {
  const { state, loaded } = useProgress();

  return (
    <div className="page learn">
      <header className="lesson-page-head">
        <p className="eyebrow">The course</p>
        <h1>Learn to solve, one device at a time</h1>
        <p className="lede">
          Every clue is a <strong>definition</strong> plus some <strong>wordplay</strong>.
          We teach one kind of wordplay per lesson, with a four-step hint ladder — and the
          help quietly fades as you get the hang of each device.
        </p>
      </header>

      <CompetenceBoard />

      {CURRICULUM.stages.map((stage) => {
        const unlocked = unlockedLessons(state, stage.lessons);
        return (
          <section key={stage.stage} className="stage-block">
            <header className="stage-header">
              <span className={`stage-pill stage-${stage.stage}`}>
                <span className="pill-letter">{stage.stage}</span>{' '}
                {STAGE_LABELS[stage.stage]}
              </span>
              <h2>{stage.title}</h2>
            </header>
            <div className="lesson-grid">
              {stage.lessons.map((lesson) => (
                <LessonTile
                  key={lesson.id}
                  lesson={lesson}
                  locked={loaded && !unlocked.has(lesson.id)}
                  complete={isLessonComplete(state, lesson)}
                  progress={lessonProgress(state, lesson)}
                  isPuzzle={lesson.clueIds.length === 0}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function CompetenceBoard() {
  const { state } = useProgress();
  return (
    <section className="competence-board" aria-label="Your mastery by device">
      <h2 className="sr-only">Your mastery by device</h2>
      <div className="competence-row">
        {CLUE_TYPE_ORDER.map((type) => {
          const rec = state.competence[type];
          return (
            <div key={type} className="competence-chip" title={`${STAGE_LABELS[rec.stage]}`}>
              <span className="cc-type">{CLUE_TYPE_LABELS[type]}</span>
              <span className={`cc-stage stage-${rec.stage}`}>{rec.stage}</span>
            </div>
          );
        })}
      </div>
      <p className="competence-note">
        Support fades per device: you might be <strong>Independent</strong> at anagrams while
        still being <strong>Taught</strong> at homophones.
      </p>
    </section>
  );
}

function LessonTile({
  lesson,
  locked,
  complete,
  progress,
  isPuzzle,
}: {
  lesson: Lesson;
  locked: boolean;
  complete: boolean;
  progress: { solved: number; total: number };
  isPuzzle: boolean;
}) {
  const to = isPuzzle ? '/puzzle/daily-001' : `/lesson/${lesson.id}`;
  const inner = (
    <>
      <div className="lesson-tile-head">
        <h3>{lesson.title}</h3>
        {complete && <span className="tick">✓</span>}
        {locked && <span className="lock-ico" aria-label="Locked">Locked</span>}
      </div>
      <p className="lesson-blurb">{lesson.blurb}</p>
      {!isPuzzle && (
        <div className="lesson-progress">
          <div className="bar">
            <div
              className="bar-fill"
              style={{ width: `${progress.total ? (progress.solved / progress.total) * 100 : 0}%` }}
            />
          </div>
          <span className="bar-label">
            {progress.solved}/{progress.total}
          </span>
        </div>
      )}
    </>
  );

  if (locked) {
    return <div className="lesson-tile locked">{inner}</div>;
  }
  return (
    <Link to={to} className="lesson-tile">
      {inner}
    </Link>
  );
}
