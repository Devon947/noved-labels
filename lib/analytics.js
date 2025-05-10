/**
 * Analytics tracking utility
 * 
 * This is a simple analytics wrapper that can be expanded to include
 * multiple analytics providers like Google Analytics, Mixpanel, etc.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Track a page view
 * @param {string} pagePath - The path of the page being viewed
 * @param {Object} properties - Additional properties to track
 */
export function trackPageView(pagePath, properties = {}) {
  if (!isBrowser) return;

  try {
    // Send to your analytics provider(s)
    console.log(`📊 Page View: ${pagePath}`, properties);
    
    // Send to Google Analytics if available
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        ...properties
      });
    }
    
    // Send to any other analytics providers here
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track a conversion event
 * @param {string} action - The conversion action (e.g., 'upgrade_plan', 'start_trial')
 * @param {Object} properties - Additional properties to track
 */
export function trackConversion(action, properties = {}) {
  if (!isBrowser) return;

  try {
    // Log locally (for development)
    console.log(`📊 Conversion: ${action}`, properties);
    
    // Send to Google Analytics if available
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your actual conversion ID
        'event_category': 'subscription',
        'event_action': action,
        'value': properties.value || 0,
        'currency': properties.currency || 'USD',
        ...properties
      });
    }
    
    // You can add more analytics providers here
    
    // If Facebook Pixel is available
    if (window.fbq) {
      switch (action) {
        case 'view_pricing':
          window.fbq('track', 'ViewContent', {
            content_type: 'pricing_page',
            ...properties
          });
          break;
        case 'start_checkout':
          window.fbq('track', 'InitiateCheckout', properties);
          break;
        case 'complete_subscription':
          window.fbq('track', 'Purchase', {
            value: properties.value || 0,
            currency: properties.currency || 'USD',
            ...properties
          });
          break;
        default:
          window.fbq('track', 'CustomEvent', {
            event: action,
            ...properties
          });
      }
    }
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
}

/**
 * Track user behavior/events
 * @param {string} category - Event category (e.g., 'subscription', 'label')
 * @param {string} action - Event action (e.g., 'click', 'submit')
 * @param {string} label - Event label (e.g., 'premium_plan_button')
 * @param {Object} properties - Additional properties to track
 */
export function trackEvent(category, action, label, properties = {}) {
  if (!isBrowser) return;

  try {
    // Log locally (for development)
    console.log(`📊 Event: ${category} - ${action} - ${label}`, properties);
    
    // Send to Google Analytics if available
    if (window.gtag) {
      window.gtag('event', action, {
        'event_category': category,
        'event_label': label,
        ...properties
      });
    }
    
    // Add additional analytics providers here
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Track feature usage
 * @param {string} feature - The feature being used
 * @param {Object} properties - Additional properties about usage
 */
export function trackFeatureUsage(feature, properties = {}) {
  if (!isBrowser) return;

  try {
    // Log locally (for development)
    console.log(`📊 Feature Usage: ${feature}`, properties);
    
    // Send to analytics provider
    if (window.gtag) {
      window.gtag('event', 'feature_use', {
        'feature_name': feature,
        ...properties
      });
    }
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
}

/**
 * Initialize analytics providers
 * Can be called in _app.js or layout.js
 * @param {Object} options - Initialization options
 */
export function initializeAnalytics(options = {}) {
  if (!isBrowser) return;

  try {
    console.log('📊 Initializing analytics', options);
    
    // Add your initialization code for different providers here
    
    // Track initial page view
    trackPageView(window.location.pathname);
  } catch (error) {
    console.error('Error initializing analytics:', error);
  }
}

// Export a default object with all methods
const analytics = {
  trackPageView,
  trackConversion,
  trackEvent,
  trackFeatureUsage,
  initializeAnalytics
};

export default analytics; 