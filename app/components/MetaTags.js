'use client';

// This is a client component that doesn't actually render any HTML
// It's meant to be used by page components that need to set metadata
// In Next.js 14+, we should use the metadata exports instead of this component
// This is kept for backward compatibility with existing code

import { useEffect } from 'react';

export default function MetaTags({
  title = 'NOVEDLabels - Professional Shipping Labels & E-commerce Solutions',
  description = 'Premium shipping labels and e-commerce solutions. Fast, reliable, and professional shipping services for your business needs.',
  keywords = 'shipping labels, e-commerce, professional shipping, business solutions, NOVEDLabels',
  ogImage = 'https://novedlabels.com/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonical = 'https://novedlabels.com',
  children
}) {
  // This component doesn't actually do anything in Next.js App Router
  // It's kept for backward compatibility
  // Use metadata exports in each page.js file instead
  
  useEffect(() => {
    // Console warning in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'MetaTags component is deprecated in Next.js App Router. Use metadata exports in page.js files instead. See: https://nextjs.org/docs/app/building-your-application/optimizing/metadata'
      );
    }
  }, []);
  
  return null; // This component doesn't render anything
} 