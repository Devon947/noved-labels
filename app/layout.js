import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import AppDownloadBanner from './components/AppDownloadBanner';
import AnalyticsWrapper from './components/AnalyticsWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NOVED Labels - Simple Shipping Solution',
  description: 'Generate shipping labels quickly and easily with discounted rates',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#111827" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/icons/favicon.ico" />
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