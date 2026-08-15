// Site-wide streak indicator — the ritual's scoreboard. Hidden until a streak
// exists; links back to the Daily. Re-reads localStorage on every navigation.
import { Link, useLocation } from 'react-router-dom';
import { loadDaily } from '../state/dailyProgress';

export function StreakChip() {
  // Reading location makes the chip re-render (and re-read) on route changes.
  useLocation();
  const { streak } = loadDaily();
  if (streak < 1) return null;
  return (
    <Link
      to="/daily"
      className="streak-chip"
      aria-label={`Daily streak: ${streak} day${streak === 1 ? '' : 's'}`}
    >
      <span aria-hidden>🔥</span> {streak}
    </Link>
  );
}
