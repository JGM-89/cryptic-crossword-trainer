import { NavLink, Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { ThemeToggle } from './components/ThemeToggle';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { LessonPage } from './pages/LessonPage';
import { PuzzlePage } from './pages/PuzzlePage';
import { PlayPage } from './pages/PlayPage';
import { SolvePage } from './pages/SolvePage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ReferencePage } from './pages/ReferencePage';
import { AboutPage } from './pages/AboutPage';

const NAV = [
  { to: '/learn', label: 'Learn', end: false },
  { to: '/play', label: 'Play', end: false },
  { to: '/analyzer', label: 'Analyzer', end: false },
  { to: '/reference', label: 'Reference', end: false },
  { to: '/about', label: 'About', end: false },
];

export function App() {
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
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
