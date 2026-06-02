import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll to the top on every navigation. Without this, moving between
 * routes that share a layout (e.g. "Next lesson" → another /lesson/:id) keeps
 * the previous scroll position, leaving the learner part-way down the new page.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}
