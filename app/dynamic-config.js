'use client';

// This file can be imported by any page that needs to use client-side hooks
// like useSearchParams() to avoid static generation errors

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

// Use this HOC to wrap any component that uses useSearchParams
export function withDynamicRendering(Component) {
  // This is just a passthrough function that ensures the dynamic export is included
  return Component;
} 