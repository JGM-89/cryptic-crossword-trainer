import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On every navigation: reset scroll to the top, and move focus to the new
 * page's heading. The scroll reset stops shared-layout routes (e.g. "Next
 * lesson" → another /lesson/:id) from keeping the previous scroll position;
 * the focus move means screen-reader users hear the new page's title instead
 * of being left on a now-unmounted control.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const h1 = document.querySelector<HTMLElement>('main h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }, [pathname]);
  return null;
}
