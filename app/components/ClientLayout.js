'use client';

import React, { useEffect } from 'react';
import analytics from '@/lib/analytics';

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Initialize analytics when the app loads
    analytics.initializeAnalytics({
      appName: 'NOVED Labels',
      environment: process.env.NODE_ENV
    });
  }, []);

  return <>{children}</>;
} 