// Privacy-first, provider-agnostic analytics.
//
// The whole module no-ops unless VITE_UMAMI_WEBSITE_ID is set at build time
// (set it in .env after creating the site on cloud.umami.is). No cookies, no
// PII — only the named events below plus Umami's automatic pageviews.
// Analytics must NEVER break the app: track() swallows everything.

type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    umami?: { track: (event: string, props?: EventProps) => void };
  }
}

const SCRIPT_SRC = 'https://cloud.umami.is/script.js';

function websiteId(): string | undefined {
  return import.meta.env.VITE_UMAMI_WEBSITE_ID;
}

export function analyticsEnabled(): boolean {
  return Boolean(websiteId());
}

/** Inject the provider script once, only when configured. Call from main.tsx. */
export function initAnalytics(): void {
  const id = websiteId();
  if (!id || typeof document === 'undefined') return;
  if (document.querySelector(`script[data-website-id="${id}"]`)) return;
  const s = document.createElement('script');
  s.defer = true;
  s.src = SCRIPT_SRC;
  s.setAttribute('data-website-id', id);
  document.head.appendChild(s);
}

/** Fire a named event. Safe to call anywhere, any time. */
export function track(event: string, props?: EventProps): void {
  try {
    window.umami?.track(event, props);
  } catch {
    /* analytics must never break the app */
  }
}
