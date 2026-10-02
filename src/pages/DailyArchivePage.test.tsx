// The Daily archive: every past Daily is playable, future days never are, and
// catch-up results show against par without touching the streak.
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DailyArchivePage } from './DailyArchivePage';
import { DailyPage } from './DailyPage';
import { ProgressProvider } from '../state/ProgressContext';
import { loadDaily, recordArchiveSolve } from '../state/dailyProgress';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider>
        <Routes>
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/daily/archive" element={<DailyArchivePage />} />
          <Route path="/daily/:number" element={<DailyPage />} />
        </Routes>
      </ProgressProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 6, 1, 12)); // 1 Jul 2026 = Daily #17
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('the Daily archive page', () => {
  it('lists every Daily newest first; today links to /daily, past days to /daily/N', () => {
    renderAt('/daily/archive');
    const links = screen.getAllByRole('link').filter((a) => /^#\d+/.test(a.textContent ?? ''));
    expect(links).toHaveLength(17);
    expect(links[0].getAttribute('href')).toBe('/daily');
    expect(links[1].getAttribute('href')).toBe('/daily/16');
    expect(links[16].getAttribute('href')).toBe('/daily/1');
  });

  it('shows a catch-up result against par', () => {
    recordArchiveSolve('2026-06-20', { hintsUsed: 1, lettersShown: 0, score: 1, par: 3, revealed: false });
    renderAt('/daily/archive');
    const row = screen.getByRole('link', { name: /#6\b/ });
    expect(row.textContent).toMatch(/2 under par/);
    expect(loadDaily().streak).toBe(0);
  });
});

describe('Daily routes', () => {
  it('a past number opens that Daily in catch-up mode', () => {
    renderAt('/daily/5');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Daily #5');
    expect(screen.getByText(/from the archive/)).toBeTruthy();
  });

  it('a future number never spoils — it redirects to today', () => {
    renderAt('/daily/40');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Daily #17');
  });

  it("today's number redirects to /daily", () => {
    renderAt('/daily/17');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Daily #17');
    expect(screen.queryByText(/from the archive/)).toBeNull();
  });
});
