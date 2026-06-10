import { afterEach, describe, expect, it, vi } from 'vitest';

describe('analytics', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    delete (window as { umami?: unknown }).umami;
    document.querySelectorAll('script[data-website-id]').forEach((s) => s.remove());
  });

  it('track() does not throw when no provider is present', async () => {
    const { track } = await import('./analytics');
    expect(() => track('clue_solved', { type: 'anagram' })).not.toThrow();
  });

  it('track() forwards to window.umami.track when present', async () => {
    const spy = vi.fn();
    (window as { umami?: unknown }).umami = { track: spy };
    const { track } = await import('./analytics');
    track('clue_solved', { type: 'anagram', hints: 1 });
    expect(spy).toHaveBeenCalledWith('clue_solved', { type: 'anagram', hints: 1 });
  });

  it('initAnalytics() injects the script only when a website id is configured', async () => {
    vi.stubEnv('VITE_UMAMI_WEBSITE_ID', 'test-id-123');
    const { initAnalytics } = await import('./analytics');
    initAnalytics();
    const el = document.querySelector('script[data-website-id]');
    expect(el?.getAttribute('data-website-id')).toBe('test-id-123');
  });

  it('initAnalytics() is a no-op without a website id', async () => {
    // Force the env empty so the test is hermetic — a real id in `.env` is
    // loaded into import.meta.env during tests and would otherwise inject here.
    vi.stubEnv('VITE_UMAMI_WEBSITE_ID', '');
    const { initAnalytics } = await import('./analytics');
    initAnalytics();
    expect(document.querySelector('script[data-website-id]')).toBeNull();
  });
});
