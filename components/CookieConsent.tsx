'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './CookieConsent.module.css';

type ConsentState = 'granted' | 'declined' | null;

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
      className={`${styles.banner} ${!visible ? styles.bannerHiding : ''}`}
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-text"
    >
      <p id="cookie-consent-text" className={styles.text}>
        This site uses cookies to improve your experience and analyze site
        traffic. By clicking Accept, you consent to analytics cookies.
      </p>
      <div className={styles.actions}>
        <button
          className={styles.decline}
          onClick={handleDecline}
          type="button"
        >
          Decline
        </button>
        <button
          className={styles.accept}
          onClick={handleAccept}
          type="button"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
