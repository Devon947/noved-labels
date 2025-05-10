/**
 * Enhanced Analytics Module
 * Extends basic analytics with detailed user journey tracking and metrics
 */

import analytics from './analytics';
import { ttlCache } from './cache';

// Constants
const SESSION_KEY = 'session_data';
const SESSION_TTL = 30 * 60; // 30 minutes in seconds

// Store for user sessions and funnel tracking
let sessionHistory = [];
let userFunnels = new Map();
let heatmapData = new Map();

/**
 * Enhanced analytics with advanced metrics
 */
const enhancedAnalytics = {
  /**
   * Initialize enhanced analytics
   * @param {Object} options Configuration options
   */
  initialize(options = {}) {
    // Initialize basic analytics
    analytics.initializeAnalytics({
      appName: options.appName || 'NOVED Labels',
      environment: options.environment || process.env.NODE_ENV
    });
    
    // Load any persisted data
    this.loadPersistedData();
    
    // Start session tracking
    this.startSession();
  },
  
  /**
   * Start or resume user session
   */
  startSession() {
    // Check if there's an existing session
    const existingSession = ttlCache.get(SESSION_KEY);
    if (existingSession) {
      this.currentSession = existingSession;
      // Refresh the session TTL
      ttlCache.set(SESSION_KEY, this.currentSession, SESSION_TTL);
      return;
    }
    
    // Create new session
    this.currentSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      startTime: Date.now(),
      pageViews: [],
      events: [],
      conversionPoints: [],
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : 'unknown'
    };
    
    // Save to session cache
    ttlCache.set(SESSION_KEY, this.currentSession, SESSION_TTL);
    
    // Track session start
    analytics.trackEvent('session', 'start', 'Session Started');
  },
  
  /**
   * End current session
   */
  endSession() {
    if (!this.currentSession) return;
    
    // Calculate session duration
    const duration = Date.now() - this.currentSession.startTime;
    this.currentSession.duration = duration;
    this.currentSession.endTime = Date.now();
    
    // Store in history
    sessionHistory.push(this.currentSession);
    
    // Limit history size
    if (sessionHistory.length > 100) {
      sessionHistory = sessionHistory.slice(-100);
    }
    
    // Track session end
    analytics.trackEvent('session', 'end', 'Session Ended', {
      duration: Math.round(duration / 1000), // in seconds
      pageViews: this.currentSession.pageViews.length,
      events: this.currentSession.events.length
    });
    
    // Clear from cache
    ttlCache.delete(SESSION_KEY);
    this.currentSession = null;
    
    // Persist data
    this.persistData();
  },
  
  /**
   * Track detailed page view with enhanced metrics
   * @param {string} path Page path
   * @param {Object} properties Additional properties
   */
  trackPageView(path, properties = {}) {
    // Basic tracking
    analytics.trackPageView(path, properties);
    
    if (!this.currentSession) {
      this.startSession();
    }
    
    // Enhanced tracking
    const pageView = {
      path,
      timestamp: Date.now(),
      properties
    };
    
    // Add to current session
    this.currentSession.pageViews.push(pageView);
    
    // Update session in cache
    ttlCache.set(SESSION_KEY, this.currentSession, SESSION_TTL);
    
    // Update funnel tracking if applicable
    this.updateFunnel(path, 'pageView');
  },
  
  /**
   * Track enhanced user event
   * @param {string} category Event category
   * @param {string} action Event action
   * @param {string} label Event label
   * @param {Object} properties Additional properties
   */
  trackEvent(category, action, label, properties = {}) {
    // Basic tracking
    analytics.trackEvent(category, action, label, properties);
    
    if (!this.currentSession) {
      this.startSession();
    }
    
    // Enhanced tracking
    const event = {
      category,
      action,
      label,
      timestamp: Date.now(),
      properties
    };
    
    // Add to current session
    this.currentSession.events.push(event);
    
    // Update session in cache
    ttlCache.set(SESSION_KEY, this.currentSession, SESSION_TTL);
  },
  
  /**
   * Update user funnel progress
   * @param {string} step Funnel step identifier
   * @param {string} type Type of funnel progression
   */
  updateFunnel(step, type) {
    if (!this.currentSession) return;
    
    const userId = this.currentSession.userId || this.currentSession.id;
    
    if (!userFunnels.has(userId)) {
      userFunnels.set(userId, {
        steps: [],
        completed: false,
        startTime: Date.now()
      });
    }
    
    const funnel = userFunnels.get(userId);
    funnel.steps.push({
      step,
      type,
      timestamp: Date.now()
    });
    
    // Update user funnel
    userFunnels.set(userId, funnel);
  },
  
  /**
   * Track conversion point in user journey
   * @param {string} name Conversion name
   * @param {Object} properties Conversion properties
   */
  trackConversion(name, properties = {}) {
    // Basic tracking
    analytics.trackConversion(name, properties);
    
    if (!this.currentSession) {
      this.startSession();
    }
    
    // Enhanced tracking
    const conversion = {
      name,
      timestamp: Date.now(),
      properties
    };
    
    // Add to current session
    this.currentSession.conversionPoints.push(conversion);
    
    // Update session in cache
    ttlCache.set(SESSION_KEY, this.currentSession, SESSION_TTL);
    
    // Update funnel
    this.updateFunnel(name, 'conversion');
    
    // Mark funnel as completed if this is the final conversion
    if (name === 'purchase_complete' || name === 'signup_complete') {
      const userId = this.currentSession.userId || this.currentSession.id;
      if (userFunnels.has(userId)) {
        const funnel = userFunnels.get(userId);
        funnel.completed = true;
        funnel.completionTime = Date.now();
        userFunnels.set(userId, funnel);
      }
    }
  },
  
  /**
   * Track user interaction for heatmap data
   * @param {string} elementId Element identifier
   * @param {string} action Interaction type (click, hover, etc)
   * @param {Object} coordinates Interaction coordinates
   */
  trackInteraction(elementId, action, coordinates = {}) {
    if (!heatmapData.has(elementId)) {
      heatmapData.set(elementId, []);
    }
    
    heatmapData.get(elementId).push({
      action,
      coordinates,
      timestamp: Date.now(),
      sessionId: this.currentSession ? this.currentSession.id : 'unknown'
    });
    
    // Limit stored interactions
    if (heatmapData.get(elementId).length > 1000) {
      const interactions = heatmapData.get(elementId);
      heatmapData.set(elementId, interactions.slice(-1000));
    }
  },
  
  /**
   * Associate user ID with current session
   * @param {string} userId User identifier
   */
  identifyUser(userId) {
    if (!this.currentSession) {
      this.startSession();
    }
    
    this.currentSession.userId = userId;
    ttlCache.set(SESSION_KEY, this.currentSession, SESSION_TTL);
    
    // Update any existing funnel data
    if (userFunnels.has(this.currentSession.id)) {
      const funnelData = userFunnels.get(this.currentSession.id);
      userFunnels.delete(this.currentSession.id);
      userFunnels.set(userId, funnelData);
    }
    
    // Track in base analytics
    analytics.identifyUser(userId);
  },
  
  /**
   * Get analytics data for reporting
   * @returns {Object} Analytics data
   */
  getAnalyticsData() {
    return {
      sessions: sessionHistory,
      funnels: Array.from(userFunnels.entries()).map(([id, data]) => ({
        userId: id,
        ...data
      })),
      interactions: Array.from(heatmapData.entries()).map(([element, data]) => ({
        element,
        interactions: data
      }))
    };
  },
  
  /**
   * Save analytics data to localStorage
   */
  persistData() {
    if (typeof window === 'undefined') return;
    
    try {
      const analyticsData = {
        timestamp: Date.now(),
        sessions: sessionHistory,
        funnels: Array.from(userFunnels.entries()),
        interactions: Array.from(heatmapData.entries())
      };
      
      localStorage.setItem('noved_enhanced_analytics', JSON.stringify(analyticsData));
    } catch (error) {
      console.error('Failed to persist analytics data:', error);
    }
  },
  
  /**
   * Load analytics data from localStorage
   */
  loadPersistedData() {
    if (typeof window === 'undefined') return;
    
    try {
      const savedData = localStorage.getItem('noved_enhanced_analytics');
      if (!savedData) return;
      
      const analyticsData = JSON.parse(savedData);
      
      // Check if data is still relevant (less than 30 days old)
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      if (analyticsData.timestamp < thirtyDaysAgo) {
        localStorage.removeItem('noved_enhanced_analytics');
        return;
      }
      
      sessionHistory = analyticsData.sessions || [];
      userFunnels = new Map(analyticsData.funnels || []);
      heatmapData = new Map(analyticsData.interactions || []);
    } catch (error) {
      console.error('Failed to load persisted analytics data:', error);
    }
  }
};

export default enhancedAnalytics; 