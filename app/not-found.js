'use client';

import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="text-4xl font-bold mb-4">404</div>
      <h1 className="text-2xl font-bold mb-6">Page Not Found</h1>
      <p className="mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
} 