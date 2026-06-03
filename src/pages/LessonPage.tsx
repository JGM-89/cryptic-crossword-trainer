import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { allLessons, findLesson, getAnyClue } from '../data';
import { STAGE_LABELS, type Clue } from '../types';
import { useProgress } from '../state/ProgressContext';
import { effectiveStage, scaffoldingFor } from '../engine/fading';
import { isClueSolved, isLessonComplete } from '../engine/progress';
import { ClueCard } from '../components/ClueCard';

export function LessonPage() {
  const { lessonId } = useParams();
  const found = lessonId ? findLesson(lessonId) : undefined;
  const { state, solveClue, competenceFor } = useProgress();

  const nextLessonId = useMemo(() => {
    const lessons = allLessons();
    const idx = lessons.findIndex((l) => l.id === lessonId);
    return idx >= 0 && idx + 1 < lessons.length ? lessons[idx + 1].id : undefined;
  }, [lessonId]);

  if (!found) {
    return (
      <div className="page">
        <p>Lesson not found.</p>
        <Link to="/learn">← Back to lessons</Link>
      </div>
    );
  }

  const { lesson, stage } = found;
  const clues = lesson.clueIds.map(getAnyClue).filter(Boolean) as Clue[];
  const complete = isLessonComplete(state, lesson);
  const nextIsPuzzle = nextLessonId
    ? findLesson(nextLessonId)?.lesson.clueIds.length === 0
    : false;

  return (
    <div className="page lesson">
      <nav className="crumb">
        <Link to="/learn">← All lessons</Link>
      </nav>
      <header className="lesson-page-head">
        <span className={`stage-pill stage-${stage}`}>
          <span className="pill-letter">{stage}</span> {STAGE_LABELS[stage]}
        </span>
        <h1>{lesson.title}</h1>
        <p className="lede">{lesson.blurb}</p>
      </header>

      <div className="clue-stack">
        {clues.map((clue) => {
          const compStage = competenceFor(clue.clueType).stage;
          const effStage = effectiveStage(stage, compStage);
          const scaffolding = scaffoldingFor(effStage);
          return (
            <ClueCard
              key={clue.id}
              clue={clue}
              scaffolding={scaffolding}
              alreadySolved={isClueSolved(state, clue.id)}
              onSolved={solveClue}
            />
          );
        })}
      </div>

      {complete && (
        <div className="lesson-complete">
          <p>
            <strong>Lesson complete.</strong> Nice work — your mastery has moved on.
          </p>
          {nextLessonId ? (
            <Link
              className="btn btn-primary"
              to={nextIsPuzzle ? '/puzzle/daily-001' : `/lesson/${nextLessonId}`}
            >
              Next lesson →
            </Link>
          ) : (
            <Link className="btn btn-primary" to="/learn">
              Back to the map
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
