/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  swcMinify: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://remrzuzzzsxmiumhfonq.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbXJ6dXp6enN4bWl1bWhmb25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDYxNjIsImV4cCI6MjA2MTk4MjE2Mn0.W8xPbiQ2nY-4txpGzWmMigjM18yqUvtTPebOeTWGkDw',
    ENCRYPTION_KEY: 'development_key_min_32_chars_long_here',
    NEXT_TELEMETRY_DISABLED: '1'
  },
  images: {
    domains: ['novedlabels.com'],
    unoptimized: true
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    instrumentationHook: true,
    // Allow useSearchParams without suspense boundaries
    missingSuspenseWithCSRBailout: false,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Configure output for fully dynamic rendering in production
  output: 'standalone',
  trailingSlash: true,
  // Disable static optimization to ensure cookies and dynamic features work
  staticPageGenerationTimeout: 1000,
  // Force all pages to be server-side rendered in production
  // This ensures cookies and dynamic data work properly
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

module.exports = nextConfig;