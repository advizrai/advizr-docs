'use client';

import { track } from '@vercel/analytics';
import { useEffect } from 'react';

function sendEvent(name: string, data: Record<string, string>) {
  // Vercel Analytics - always fires (privacy-first, no cookies)
  track(name, data);

  // GA4 - only if consent granted and gtag loaded
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, data);
  }
}

export function EventTracking() {
  useEffect(() => {
    let searchDebounceTimer: ReturnType<typeof setTimeout>;

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // CTA clicks: elements with data-track="cta"
      const ctaEl = target.closest<HTMLElement>('[data-track="cta"]');
      if (ctaEl) {
        const text = ctaEl.textContent?.trim().slice(0, 200) || '';
        const href =
          ctaEl.getAttribute('href') ||
          ctaEl.closest('a')?.getAttribute('href') ||
          '';
        sendEvent('cta_click', { button_text: text, destination: href });
      }

      // External link clicks
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        if (
          href.startsWith('http') &&
          !href.includes('docs.advizr.ca') &&
          !href.includes('advizr.ca')
        ) {
          sendEvent('external_link_click', {
            url: href,
            text: anchor.textContent?.trim().slice(0, 200) || '',
          });
        }
      }
    }

    function handleInput(event: Event) {
      const target = event.target as HTMLElement;

      // Search queries: input inside Nextra search
      if (
        target.tagName === 'INPUT' &&
        (target.closest('[class*="nextra-search"]') ||
          target.closest('search') ||
          target.getAttribute('placeholder')?.toLowerCase().includes('search'))
      ) {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          const query = (target as HTMLInputElement).value.trim();
          if (query.length > 1) {
            sendEvent('search_query', { query: query.slice(0, 200) });
          }
        }, 1000);
      }
    }

    document.addEventListener('click', handleClick, { capture: true });
    document.addEventListener('input', handleInput, { capture: true });

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      document.removeEventListener('input', handleInput, { capture: true });
      clearTimeout(searchDebounceTimer);
    };
  }, []);

  return null;
}
