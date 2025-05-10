'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeContext = createContext();

const neonColors = {
  blue: {
    primary: 'rgb(59, 130, 246)',
    glow: 'rgba(59, 130, 246, 0.5)',
    shadow: '0 0 20px rgba(59, 130, 246, 0.5)',
  },
  purple: {
    primary: 'rgb(139, 92, 246)',
    glow: 'rgba(139, 92, 246, 0.5)',
    shadow: '0 0 20px rgba(139, 92, 246, 0.5)',
  },
  green: {
    primary: 'rgb(34, 197, 94)',
    glow: 'rgba(34, 197, 94, 0.5)',
    shadow: '0 0 20px rgba(34, 197, 94, 0.5)',
  },
};

export function ThemeProvider({ children }) {
  const [neonColor, setNeonColor] = useState('blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleNeonColor = () => {
    const colors = Object.keys(neonColors);
    const currentIndex = colors.indexOf(neonColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setNeonColor(colors[nextIndex]);
  };

  const getCurrentNeonTheme = () => neonColors[neonColor];

  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <ThemeContext.Provider value={{ neonColor, toggleNeonColor, getCurrentNeonTheme }}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={neonColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 