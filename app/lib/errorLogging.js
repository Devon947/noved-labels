// Simple error logging utility for NOVED Labels

/**
 * Log an error to the console and optionally to a monitoring service
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @param {Object} metadata - Additional data
 */
export function logError(error, context, metadata = {}) {
  // Format error for logging
  const logEntry = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    context,
    metadata,
  };
  
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${context}] ${error.message}`, { 
      stack: error.stack,
      metadata
    });
  }
  
  // In production, you could send to a monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to your own API endpoint
    // fetch('/api/logs/error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logEntry),
    // }).catch(err => console.error('Failed to send error log:', err));
    
    // Or use a service like Sentry, LogRocket, etc.
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: { context, ...metadata } });
    // }
  }
  
  return logEntry;
}

/**
 * Create wrapped API handlers with error logging
 * @param {Function} handler - API route handler
 * @returns {Function} Wrapped handler with error logging
 */
export function withErrorLogging(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const path = req.url || 'unknown';
      logError(error, `API Handler [${path}]`, { 
        method: req.method,
        headers: req.headers,
      });
      
      // Don't expose internal errors to clients
      const publicMessage = process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message;
        
      // Return error response
      return Response.json(
        { error: publicMessage },
        { status: 500 }
      );
    }
  };
} 