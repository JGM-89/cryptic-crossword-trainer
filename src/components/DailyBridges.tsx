// The two onward paths after solving the Daily — the ritual's exits.
// Used on /daily (post-solve) and the returning-user Home card.
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../state/ProgressContext';
import { lessonForDevice, weakestDevice } from '../data/weakest';
import { CLUE_TYPE_LABELS } from '../types';
import { surpriseTarget } from '../state/surprise';

export function DailyBridges() {
  const { state } = useProgress();
  const navigate = useNavigate();
  const device = weakestDevice(state);
  const lessonId = lessonForDevice(device);

  async function onePuzzle() {
    const id = await surpriseTarget();
    if (id) navigate(`/play/${id}`);
  }

  return (
    <div className="daily-bridges">
      {lessonId && (
        <Link className="btn btn-ghost" to={`/lesson/${lessonId}`}>
          Sharpen your {CLUE_TYPE_LABELS[device].toLowerCase()}s →
        </Link>
      )}
      <button type="button" className="btn btn-ghost" onClick={onePuzzle}>
        One more puzzle →
      </button>
    </div>
  );
}
