'use client';

// Simple analytics utility for NOVED Labels

// Initialize analytics
export function initAnalytics() {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  // Create analytics object if it doesn't exist
  if (!window.novedAnalytics) {
    window.novedAnalytics = {
      events: [],
      pageViews: [],
    };
  }
  
  console.log('NOVED Analytics initialized');
}

// Track page view
export function trackPageView(path) {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  // Initialize if needed
  if (!window.novedAnalytics) initAnalytics();
  
  // Add page view
  window.novedAnalytics.pageViews.push({
    path,
    timestamp: new Date().toISOString(),
    referrer: document.referrer || 'direct',
  });
  
  // Log page view (remove in production)
  console.log(`Page view: ${path}`);
  
  // You can send to your backend or third-party analytics here
  // Example: fetch('/api/analytics/pageview', { method: 'POST', body: JSON.stringify({ path }) });
}

// Track event
export function trackEvent(category, action, label = null, value = null) {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  // Initialize if needed
  if (!window.novedAnalytics) initAnalytics();
  
  // Create event
  const event = {
    category,
    action,
    label,
    value,
    timestamp: new Date().toISOString(),
  };
  
  // Add event
  window.novedAnalytics.events.push(event);
  
  // Log event (remove in production)
  console.log(`Event: ${category} / ${action}${label ? ` / ${label}` : ''}${value ? ` / ${value}` : ''}`);
  
  // You can send to your backend or third-party analytics here
  // Example: fetch('/api/analytics/event', { method: 'POST', body: JSON.stringify(event) });
} 