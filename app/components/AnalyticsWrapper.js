'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, initAnalytics } from '../lib/analytics';

export default function AnalyticsWrapper({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize analytics once
    initAnalytics();
  }, []);

  useEffect(() => {
    // Track page view when path changes
    if (pathname) {
      const url = searchParams?.size
        ? `${pathname}?${searchParams}`
        : pathname;
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
} 