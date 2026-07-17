'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/cn';

type ConsentState = 'granted' | 'declined' | null;

/**
 * CookieConsent — Instrument Grade reskin (PR-E): hairline popover surface
 * with the one sanctioned floating-layer shadow (--shadow-dropdown), 0
 * radius, no blur. Accept is a 28px signal control; Decline a quiet ghost.
 * Enter/exit is a 250ms/150ms opacity+translate fade (transition-based —
 * the old keyframes died with the module CSS).
 */
export function CookieConsent() {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('advizr-cookie-consent') as ConsentState;
    if (stored) return; // Already decided - don't show

    const timer = setTimeout(() => {
      setRender(true);
      requestAnimationFrame(() => setVisible(true));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => setRender(false), 200);
  }, []);

  function handleAccept() {
    localStorage.setItem('advizr-cookie-consent', 'granted');
    window.dispatchEvent(new Event('cookie-consent-granted'));
    dismiss();
  }

  function handleDecline() {
    localStorage.setItem('advizr-cookie-consent', 'declined');
    dismiss();
  }

  if (!render) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-100 w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2',
        'flex items-center gap-4 border border-border bg-[hsl(var(--popover))] p-4 [box-shadow:var(--shadow-dropdown)]',
        'max-sm:flex-col max-sm:items-stretch max-sm:gap-3',
        'transition-[opacity,translate] duration-[250ms] ease-out motion-reduce:transition-none',
        !visible && 'translate-y-2 opacity-0'
      )}
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-text"
    >
      <p
        id="cookie-consent-text"
        className="m-0 text-[0.8125rem] leading-relaxed text-[hsl(var(--text-2))]"
      >
        This site uses cookies to improve your experience and analyze site
        traffic. By clicking Accept, you consent to analytics cookies.
      </p>
      <div className="flex shrink-0 items-center gap-2 max-sm:justify-end">
        <button
          type="button"
          onClick={handleDecline}
          className={cn(
            'inline-flex h-7 cursor-pointer items-center whitespace-nowrap rounded-[2px] border border-transparent bg-transparent px-3 text-[0.8125rem] font-medium text-[hsl(var(--text-3))]',
            'transition-[color,background-color] duration-150 ease-out hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] hover:duration-0 motion-reduce:transition-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
          )}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className={cn(
            'inline-flex h-7 cursor-pointer items-center whitespace-nowrap rounded-[2px] border border-transparent bg-[hsl(var(--signal))] px-3 text-[0.8125rem] font-medium text-[hsl(var(--ink))]',
            'transition-[background-color] duration-150 ease-out hover:bg-[hsl(var(--signal-bright))] hover:duration-0 motion-reduce:transition-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
          )}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
