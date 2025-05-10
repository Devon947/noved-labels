'use client';

import React from 'react';
import { AlertTriangle, Home, RefreshCw, MailQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to Sentry
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error);
    }
    
    // Log to console
    console.error('Critical application error:', error, errorInfo);
    
    // Update state
    this.setState(prevState => ({ 
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
  }

  handleRetry = () => {
    // Try to recover by resetting the error state
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      // Check for multiple errors - if we're seeing repeated errors after retry,
      // it's likely a more serious issue
      const isRecurringError = this.state.errorCount > 1;
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
              {isRecurringError 
                ? "We're Having Technical Issues" 
                : "Something Went Wrong"}
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              {isRecurringError
                ? "We're experiencing unexpected technical difficulties. Our team has been notified of this issue."
                : "The application encountered an unexpected error. We apologize for the inconvenience."}
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-3 bg-gray-100 rounded-md overflow-auto max-h-40 text-xs">
                <p className="font-bold text-red-600 mb-1">Error: {this.state.error?.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-gray-700 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={this.handleRetry} disabled={isRecurringError} className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button asChild variant="outline" className="flex items-center justify-center">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="flex items-center justify-center">
                <Link href="/dashboard/tickets">
                  <MailQuestion className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary; 