import { NavLink, Route, Routes } from 'react-router-dom';
import { LearnPage } from './pages/LearnPage';
import { LessonPage } from './pages/LessonPage';
import { PuzzlePage } from './pages/PuzzlePage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { ReferencePage } from './pages/ReferencePage';
import { AboutPage } from './pages/AboutPage';

const NAV = [
  { to: '/', label: 'Learn', end: true },
  { to: '/analyzer', label: 'Analyzer', end: false },
  { to: '/reference', label: 'Reference', end: false },
  { to: '/about', label: 'About', end: false },
];

export function App() {
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand" end>
          <span className="brand-mark" aria-hidden>
            ▦
          </span>
          <span>
            Cryptic <strong>Trainer</strong>
          </span>
        </NavLink>
        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<LearnPage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/puzzle/:puzzleId" element={<PuzzlePage />} />
          <Route path="/analyzer" element={<AnalyzerPage />} />
          <Route path="/reference" element={<ReferencePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>
          A scaffolding-that-fades cryptic crossword trainer. All clues originally
          authored and verified. <NavLink to="/about">How it works →</NavLink>
        </p>
      </footer>
    </div>
  );
}
