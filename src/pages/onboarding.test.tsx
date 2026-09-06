// The first-ninety-seconds contract: what a brand-new visitor is shown, and
// how they escape the deep end. (Findings from the 2026-09-07 UX review.)
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';
import { DailyPage } from './DailyPage';
import { ProgressProvider } from '../state/ProgressContext';
import { dateKey } from '../data/daily';

const renderAt = (ui: React.ReactNode) =>
  render(
    <MemoryRouter>
      <ProgressProvider>{ui}</ProgressProvider>
    </MemoryRouter>,
  );

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('first visit (no progress at all)', () => {
  it('leads with Learn, not the Daily — beginners need the shallow end first', () => {
    renderAt(<HomePage />);
    const primary = document.querySelector('.btn-primary');
    expect(primary?.textContent).toMatch(/Start learning/i);
  });

  it('does not show a wall of zeros or an unearned mastery badge', () => {
    renderAt(<HomePage />);
    expect(screen.queryByText(/Clues solved in lessons/i)).toBeNull();
    expect(screen.queryByText(/Top mastery/i)).toBeNull();
  });

  it('offers a way out of the Daily for someone who has never solved a cryptic', () => {
    renderAt(<DailyPage />);
    const escape = screen.getByRole('link', { name: /new to cryptics/i });
    expect(escape.getAttribute('href')).toBe('/learn');
  });
});

describe('returning visitor', () => {
  beforeEach(() => {
    localStorage.setItem(
      'cct:daily:v1',
      JSON.stringify({
        lastDate: dateKey(),
        streak: 1,
        best: 1,
        history: { [dateKey()]: { hintsUsed: 0, revealed: false } },
      }),
    );
  });

  it('shows the progress stats once there is progress to show', () => {
    renderAt(<HomePage />);
    expect(screen.getByText(/Clues solved in lessons/i)).toBeTruthy();
  });

  it('drops the beginner escape hatch from the Daily', () => {
    renderAt(<DailyPage />);
    expect(screen.queryByRole('link', { name: /new to cryptics/i })).toBeNull();
  });
});
