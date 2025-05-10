'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error monitoring service (Sentry)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error);
    }
    
    // Log error details
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Update state with error details
    this.setState({ errorInfo });
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.state.errorInfo)
      ) : (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-800">
              {this.props.errorTitle || 'Something went wrong'}
            </h3>
          </div>
          <p className="text-sm text-red-700 mb-4">
            {this.props.errorMessage || 
              "We're having trouble displaying this content. Please try refreshing the page."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

// Hook for functional components to safely handle asynchronous errors
export function useErrorHandler() {
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (error && typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error);
    }
  }, [error]);
  
  const handleError = (err) => {
    console.error('Error caught by useErrorHandler:', err);
    setError(err);
    return err;
  };
  
  return [error, handleError];
}

export default ErrorBoundary; 