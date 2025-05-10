'use client';

import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '../components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useReportWebVitals } from 'next/web-vitals';
import { StoreProvider } from './context/StoreContext';
import Navigation from './components/Navigation';

// Dynamically import components for better performance
const Sidebar = dynamic(() => import('../components/Sidebar'), { ssr: false });
const TrustBadges = dynamic(() => import('../components/TrustBadges'), { ssr: false });
const ThemeProvider = dynamic(() => import('../components/ThemeProvider').then(mod => mod.ThemeProvider), { ssr: false });
const Notifications = dynamic(() => import('../components/Notifications').then(mod => mod.Notifications), { ssr: false });
const LoadingScreen = dynamic(() => import('../components/LoadingScreen'), { ssr: false });

// Add PWA meta tags dynamically on the client side
function addPWAMetaTags() {
  if (typeof document !== 'undefined') {
    // Add manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);
    
    // Add theme color
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#3b82f6';
    document.head.appendChild(themeColorMeta);
    
    // Add apple touch icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/icons/apple-touch-icon.png';
    document.head.appendChild(appleTouchIcon);
    
    // Add description
    const descriptionMeta = document.createElement('meta');
    descriptionMeta.name = 'description';
    descriptionMeta.content = 'Create and manage shipping labels with ease';
    document.head.appendChild(descriptionMeta);
  }
}

export default function ClientLayout({ children }) {
  // Report Web Vitals - must be first hook
  useReportWebVitals(metric => {
    if (process.env.NODE_ENV === 'development') {
      console.log(metric);
    }
    
    if (process.env.NODE_ENV === 'production') {
      const body = JSON.stringify(metric);
      const url = '/api/vitals';
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
      } else {
        fetch(url, {
          body,
          method: 'POST',
          keepalive: true,
        });
      }
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    // Add PWA meta tags
    addPWAMetaTags();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered:', registration);
        }).catch(error => {
          console.log('SW registration failed:', error);
        });
      });
    }

    // Preload components while showing loading screen
    const preloadComponents = async () => {
      await Promise.all([
        import('../components/Sidebar'),
        import('../components/TrustBadges'),
        import('../components/ThemeProvider'),
        import('../components/Notifications')
      ]);
    };

    // Show loading screen for minimum 2 seconds and wait for preload
    Promise.all([
      new Promise(resolve => setTimeout(resolve, 2000)),
      preloadComponents()
    ]).then(() => {
      setIsLoading(false);
    });

    // Clean up any animations on unmount
    return () => {
      setIsLoading(false);
      setIsHydrated(false);
    };
  }, []);

  // Prevent flash of unstyled content
  if (!isHydrated) {
    return null;
  }

  return (
    <StoreProvider>
      <Navigation />
      <ErrorBoundary>
        <ThemeProvider>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen 
                key="loading"
                isLoading={isLoading} 
                onLoadingComplete={() => setIsLoading(false)}
              />
            ) : (
              <motion.div 
                key="content"
                className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  willChange: 'opacity, transform'
                }}
              >
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <TrustBadges />
                  <main className="flex-1 p-8 pt-24">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={children.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20
                        }}
                        style={{
                          willChange: 'opacity, transform'
                        }}
                      >
                        {children}
                      </motion.div>
                    </AnimatePresence>
                  </main>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Notifications />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #374151'
              }
            }} 
          />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </ErrorBoundary>
    </StoreProvider>
  );
} 