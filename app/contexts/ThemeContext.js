'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const neonThemes = {
  blue: {
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    accent: '#60A5FA',
    glow: 'rgba(59, 130, 246, 0.5)',
    text: '#F3F4F6'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#6D28D9',
    accent: '#A78BFA',
    glow: 'rgba(139, 92, 246, 0.5)',
    text: '#F3F4F6'
  },
  green: {
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    glow: 'rgba(16, 185, 129, 0.5)',
    text: '#F3F4F6'
  },
  shipping: {
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    accent: '#60A5FA',
    glow: 'rgba(59, 130, 246, 0.5)',
    text: '#F3F4F6',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  }
};

export const animations = {
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  modalTransition: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 }
  },
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  },
  success: {
    scale: [1, 1.05, 1],
    borderColor: ['#374151', '#10B981', '#374151'],
    transition: { duration: 0.5 }
  },
  error: {
    scale: [1, 0.95, 1],
    borderColor: ['#374151', '#EF4444', '#374151'],
    transition: { duration: 0.5 }
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('shipping');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check system preference
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModePreference.matches);

    const handleChange = (e) => setIsDark(e.matches);
    darkModePreference.addEventListener('change', handleChange);

    return () => darkModePreference.removeEventListener('change', handleChange);
  }, []);

  const getCurrentNeonTheme = () => neonThemes[currentTheme];

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const setTheme = (themeName) => {
    if (neonThemes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme,
      currentTheme,
      setTheme,
      getCurrentNeonTheme,
      animations
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 