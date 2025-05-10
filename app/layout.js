'use client';

import React, { useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import AppDownloadBanner from './components/AppDownloadBanner';
import AnalyticsWrapper from './components/AnalyticsWrapper';
import { dynamicConfig } from './config';
import analytics from '@/lib/analytics';

const inter = Inter({ subsets: ['latin'] });

// Apply dynamic config settings to force server-side rendering
export const dynamic = dynamicConfig.dynamic;
export const revalidate = dynamicConfig.revalidate;
export const fetchCache = dynamicConfig.fetchCache;
export const runtime = dynamicConfig.runtime;

// Moving viewport to its own export per Next.js warnings
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'NOVED Labels - Simple Shipping Solution',
  description: 'Generate shipping labels quickly and easily with discounted rates',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize analytics when the app loads
    analytics.initializeAnalytics({
      appName: 'NOVED Labels',
      environment: process.env.NODE_ENV
    });
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#111827" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        {/* Google Analytics script */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-PLACEHOLDER'}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-PLACEHOLDER'}');
                `
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <ThemeProvider>
          <AppDownloadBanner />
          {children}
          <AnalyticsWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}