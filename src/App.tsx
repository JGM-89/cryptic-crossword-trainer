import { useEffect, useRef, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { StreakChip } from './components/StreakChip';
import { ThemeToggle } from './components/ThemeToggle';
import { HomePage } from './pages/HomePage';
import { DailyPage } from './pages/DailyPage';
import { DailyArchivePage } from './pages/DailyArchivePage';
import { LearnPage } from './pages/LearnPage';
import { LessonPage } from './pages/LessonPage';
import { PuzzlePage } from './pages/PuzzlePage';
import { PlayPage } from './pages/PlayPage';
import { SolvePage } from './pages/SolvePage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ReferencePage } from './pages/ReferencePage';
import { AboutPage } from './pages/AboutPage';

// Primary destinations stay visible at every width; the rest collapse into a
// "More" disclosure on narrow screens (six inline links overflow a phone).
const NAV_PRIMARY = [
  { to: '/daily', label: 'Daily', end: false },
  { to: '/learn', label: 'Learn', end: false },
  { to: '/play', label: 'Play', end: false },
];
const NAV_MORE = [
  { to: '/analyzer', label: 'Analyzer', end: false },
  { to: '/reference', label: 'Reference', end: false },
  { to: '/about', label: 'About', end: false },
];

export function App() {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close the disclosure on navigation, Escape, or a click/tap outside it.
  useEffect(() => setMoreOpen(false), [location.pathname]);
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoreOpen(false);
    const onDown = (e: PointerEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [moreOpen]);

  const moreIsActive = NAV_MORE.some((item) => location.pathname.startsWith(item.to));

  return (
    <div className="app">
      <ScrollToTop />
      <header className="topbar">
        <NavLink to="/" className="brand" end aria-label="Cruci home">
          <span className="wordmark" aria-label="Cruci">
            <span className="wm-cell" aria-hidden>
              C
            </span>
            <span className="wm-word">ruci</span>
          </span>
        </NavLink>
        <div className="topbar-end">
          <nav className="nav" aria-label="Primary">
            {NAV_PRIMARY.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
                {item.label}
              </NavLink>
            ))}
            <div className="nav-rest">
              {NAV_MORE.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="nav-more" ref={moreRef}>
              <button
                type="button"
                className={`nav-link nav-more-btn ${moreIsActive ? 'active' : ''}`}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                onClick={() => setMoreOpen((o) => !o)}
              >
                More ▾
              </button>
              {moreOpen && (
                <div className="nav-menu" role="menu" aria-label="More pages">
                  {NAV_MORE.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className="nav-link"
                      role="menuitem"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <StreakChip />
          <ThemeToggle />
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/daily/archive" element={<DailyArchivePage />} />
          <Route path="/daily/:number" element={<DailyPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/puzzle/:puzzleId" element={<PuzzlePage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/play/:puzzleId" element={<SolvePage />} />
          <Route path="/analyzer" element={<AnalyzerPage />} />
          <Route path="/reference" element={<ReferencePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>
          <span className="wordmark" aria-label="Cruci">
            <span className="wm-cell" aria-hidden>
              C
            </span>
            <span className="wm-word">ruci</span>
          </span>{' '}
          — find the seam. All clues originally authored and verified.{' '}
          <NavLink to="/about">How it works →</NavLink>
        </p>
      </footer>
    </div>
  );
}
