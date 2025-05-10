import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import AppDownloadBanner from './components/AppDownloadBanner';
import AnalyticsWrapper from './components/AnalyticsWrapper';
import { dynamicConfig } from './config';

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
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  }
};

export default function RootLayout({ children }) {
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
      </head>
      <body className={inter.className}>
        <AnalyticsWrapper>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AnalyticsWrapper>
      </body>
    </html>
  );
}