/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
        },
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
          400: '#60A5FA',
        },
        green: {
          500: '#10B981',
          600: '#059669',
          400: '#34D399',
        },
        red: {
          500: '#EF4444',
          600: '#DC2626',
          400: '#F87171',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true
  },
  experimental: {
    optimizeUniversalDefaults: true
  }
}