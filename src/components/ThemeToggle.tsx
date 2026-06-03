import { useEffect, useState } from 'react';

const KEY = 'cruci-color-mode';
type Mode = 'light' | 'dark';

/** Light is the default; dark is opt-in and persisted. (A pre-hydration script
 *  in index.html applies a saved dark choice before paint to avoid a flash.) */
function getInitialMode(): Mode {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(getInitialMode);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', mode === 'dark');
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', mode === 'dark' ? '#16171b' : '#f4ece0');
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const isDark = mode === 'dark';
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
      onClick={() => setMode(isDark ? 'light' : 'dark')}
    >
      {isDark ? (
        // Sun — tap to go light
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.0 5.0l1.85 1.85M17.15 17.15 19 19M19 5.0l-1.85 1.85M6.85 17.15 5 19" />
          </g>
        </svg>
      ) : (
        // Moon — tap to go dark
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
          <path
            d="M20 13.4A8 8 0 1 1 10.6 4a6.4 6.4 0 0 0 9.4 9.4Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
