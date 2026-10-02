// The Daily's play rules: bare clue, a menu of hints that each cost 1, letter
// reveals that cost 1, free wrong guesses, and a golf-style score vs par.
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DailyClueCard, type DailyFinish } from './DailyClueCard';
import { BANK } from '../data/bank/index';

const clue = BANK.find((c) => c.id === 'bank-elm') ?? BANK[0];
const answer = clue.solution.toUpperCase().replace(/[^A-Z]/g, '');

afterEach(cleanup);

function setup(par = 3) {
  const onFinished = vi.fn<(r: DailyFinish) => void>();
  render(<DailyClueCard clue={clue} par={par} onFinished={onFinished} />);
  return onFinished;
}

function type(word: string) {
  word.split('').forEach((ch, i) => {
    const cell = screen.getByLabelText(`Letter ${i + 1}`) as HTMLInputElement;
    if (!cell.disabled) fireEvent.change(cell, { target: { value: ch } });
  });
}

const score = () => screen.getByRole('img', { name: /score/i }).getAttribute('aria-label');

describe('DailyClueCard', () => {
  it('starts on the bare clue: no device badge, no hints showing, score 0', () => {
    setup();
    expect(screen.queryByText(clue.hints[1].text)).toBeNull();
    expect(document.querySelector('.badge')).toBeNull();
    expect(score()).toBe('Score 0, par 3');
  });

  it('wrong guesses are free', () => {
    setup();
    type('Z'.repeat(answer.length));
    fireEvent.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('alert').textContent).toMatch(/not quite/i);
    expect(score()).toBe('Score 0, par 3');
  });

  it('a hint from the menu costs 1 and shows its text', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /hints/i }));
    fireEvent.click(screen.getByRole('button', { name: /name the device/i }));
    expect(screen.getByText(clue.hints[1].text)).toBeTruthy();
    expect(score()).toBe('Score 1, par 3');
    // Each hint can be taken once.
    fireEvent.click(screen.getByRole('button', { name: /hints/i }));
    expect((screen.getByRole('button', { name: /name the device/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('showing a letter fills the first wrong cell, locks it, and costs 1', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /hints/i }));
    fireEvent.click(screen.getByRole('button', { name: /show a letter/i }));
    const first = screen.getByLabelText('Letter 1') as HTMLInputElement;
    expect(first.value).toBe(answer[0]);
    expect(first.disabled).toBe(true);
    expect(score()).toBe('Score 1, par 3');
  });

  it('solving reports the score against par', () => {
    const onFinished = setup(3);
    fireEvent.click(screen.getByRole('button', { name: /hints/i }));
    fireEvent.click(screen.getByRole('button', { name: /show the definition/i }));
    type(answer);
    fireEvent.click(screen.getByRole('button', { name: 'Check' }));
    expect(onFinished).toHaveBeenCalledWith(
      expect.objectContaining({ score: 1, par: 3, hintsUsed: 1, lettersShown: 0, revealed: false }),
    );
    expect(screen.getByRole('status').textContent).toMatch(/2 under par/);
  });

  it('revealing the answer ends the round as revealed', () => {
    const onFinished = setup();
    fireEvent.click(screen.getByRole('button', { name: /reveal answer/i }));
    expect(onFinished).toHaveBeenCalledWith(expect.objectContaining({ revealed: true }));
    expect(screen.getByRole('status').textContent).toMatch(/revealed/i);
  });

  it('a result from before par scoring shows as plain Solved', () => {
    render(
      <DailyClueCard clue={clue} par={3} result={{ hintsUsed: 1, revealed: false }} onFinished={() => {}} />,
    );
    expect(screen.getByRole('status').textContent).toMatch(/solved/i);
    expect(screen.getByRole('status').textContent).not.toMatch(/par/);
  });
});

describe('an unfinished Daily survives leaving the page', () => {
  it('hints and letters taken are remembered, so leaving cannot reset the score', () => {
    localStorage.clear();
    const props = { clue, par: 3, attemptKey: '2026-07-01', onFinished: () => {} };
    const first = render(<DailyClueCard {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /hints/i }));
    fireEvent.click(screen.getByRole('button', { name: /name the device/i }));
    fireEvent.click(screen.getByRole('button', { name: /hints/i }));
    fireEvent.click(screen.getByRole('button', { name: /show a letter/i }));
    first.unmount();

    render(<DailyClueCard {...props} />);
    expect(score()).toBe('Score 2, par 3');
    expect(screen.getByText(clue.hints[1].text)).toBeTruthy();
    expect((screen.getByLabelText('Letter 1') as HTMLInputElement).value).toBe(answer[0]);
  });
});
