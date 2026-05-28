'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const [consentGranted, setConsentGranted] = useState(false);

  // Check initial consent state and listen for consent changes
  useEffect(() => {
    const stored = localStorage.getItem('advizr-cookie-consent');
    if (stored === 'granted') {
      setConsentGranted(true);
    }

    function onConsentGranted() {
      setConsentGranted(true);
    }

    window.addEventListener('cookie-consent-granted', onConsentGranted);
    return () => {
      window.removeEventListener('cookie-consent-granted', onConsentGranted);
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (consentGranted && measurementId && window.gtag) {
      window.gtag('config', measurementId, { page_path: pathname });
    }
  }, [pathname, consentGranted, measurementId]);

  if (!consentGranted || !measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
