'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, MailQuestion, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ErrorTypes = {
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error',
  SERVER_ERROR: 'server_error',
  RATE_LIMIT_ERROR: 'rate_limit_error',
  AUTHENTICATION_ERROR: 'authentication_error',
  UNKNOWN_ERROR: 'unknown_error',
};

// Helper to determine error type
const getErrorType = (error) => {
  if (!error) return ErrorTypes.UNKNOWN_ERROR;
  
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return ErrorTypes.RATE_LIMIT_ERROR;
  }
  
  if (message.includes('validation') || message.includes('invalid')) {
    return ErrorTypes.VALIDATION_ERROR;
  }
  
  if (message.includes('unauthorized') || message.includes('authentication') || message.includes('auth')) {
    return ErrorTypes.AUTHENTICATION_ERROR;
  }
  
  if (message.includes('500') || message.includes('server')) {
    return ErrorTypes.SERVER_ERROR;
  }
  
  if (message.includes('api') || message.includes('network') || message.includes('fetch') || message.includes('request')) {
    return ErrorTypes.API_ERROR;
  }
  
  return ErrorTypes.UNKNOWN_ERROR;
};

// Helper to get error display details
const getErrorDetails = (errorType) => {
  switch (errorType) {
    case ErrorTypes.API_ERROR:
      return {
        title: 'Shipping API Error',
        message: 'We\'re having trouble connecting to the shipping carrier. This could be due to a temporary service outage.',
        icon: <RefreshCw className="h-6 w-6 text-amber-500" />,
        actionText: 'Try Again',
      };
    case ErrorTypes.VALIDATION_ERROR:
      return {
        title: 'Invalid Shipping Information',
        message: 'Please check your shipping details. There may be an issue with the address, package weight, or dimensions.',
        icon: <AlertCircle className="h-6 w-6 text-amber-500" />,
        actionText: 'Edit Shipping Info',
      };
    case ErrorTypes.RATE_LIMIT_ERROR:
      return {
        title: 'Too Many Requests',
        message: 'We\'ve sent too many requests to the shipping carrier. Please wait a moment before trying again.',
        icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
        actionText: 'Try Again Later',
      };
    case ErrorTypes.AUTHENTICATION_ERROR:
      return {
        title: 'Authentication Error',
        message: 'There\'s an issue with your shipping carrier account credentials. Please check your API keys in settings.',
        icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
        actionText: 'Update API Keys',
      };
    case ErrorTypes.SERVER_ERROR:
      return {
        title: 'Server Error',
        message: 'The shipping carrier\'s server is experiencing issues. This is not a problem with your account or data.',
        icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
        actionText: 'Try Again Later',
      };
    case ErrorTypes.UNKNOWN_ERROR:
    default:
      return {
        title: 'Something Went Wrong',
        message: 'We encountered an unexpected error while generating your shipping label. Our team has been notified.',
        icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
        actionText: 'Try Again',
      };
  }
};

const ShippingLabelErrorFallback = ({ error, errorInfo, onRetry, onContact, onEditInfo }) => {
  const errorType = getErrorType(error);
  const { title, message, icon, actionText } = getErrorDetails(errorType);
  
  const handlePrimaryAction = () => {
    switch (errorType) {
      case ErrorTypes.VALIDATION_ERROR:
        if (onEditInfo) onEditInfo();
        break;
      case ErrorTypes.AUTHENTICATION_ERROR:
        // Navigate to settings page
        window.location.href = '/dashboard/settings';
        break;
      case ErrorTypes.RATE_LIMIT_ERROR:
      case ErrorTypes.SERVER_ERROR:
        // Just show message without immediate retry
        break;
      case ErrorTypes.API_ERROR:
      case ErrorTypes.UNKNOWN_ERROR:
      default:
        if (onRetry) onRetry();
        break;
    }
  };

  return (
    <Card className="w-full border-orange-200 bg-orange-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium text-orange-800">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-orange-700">{message}</p>
        
        {error && process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-xs text-orange-600 bg-orange-100 p-2 rounded-md">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.toString()}</pre>
            {errorInfo && <pre className="mt-2 whitespace-pre-wrap">{errorInfo.componentStack}</pre>}
          </details>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrimaryAction}
          disabled={
            errorType === ErrorTypes.RATE_LIMIT_ERROR || 
            errorType === ErrorTypes.SERVER_ERROR
          }
        >
          {actionText}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onContact}
          className="text-orange-700"
        >
          <MailQuestion className="h-4 w-4 mr-1" />
          Contact Support
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShippingLabelErrorFallback; 