'use client';

import { useState } from 'react';
import { Smile, Frown, Meh, Star, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import enhancedAnalytics from '@/lib/enhanced-analytics';

/**
 * Feedback widget that can be placed throughout the application
 * to collect user feedback at various touchpoints
 */
export default function FeedbackWidget({ 
  type = 'general',
  placement = 'floating',
  onComplete = () => {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('rating');
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Determine the appropriate context message based on rating
  const getFeedbackPrompt = () => {
    if (rating >= 4) return "What did you love about your experience?";
    if (rating === 3) return "How can we improve your experience?";
    return "We're sorry to hear that. What went wrong?";
  };
  
  // Handle rating selection
  const handleRating = (value) => {
    setRating(value);
    
    // For high ratings, we can skip straight to submission
    if (value >= 4) {
      handleSubmit(value);
    } else {
      setStep('feedback');
    }
    
    // Track the rating event
    enhancedAnalytics.trackEvent('feedback', 'rate', `Rating: ${value}`, {
      feedbackType: type,
      rating: value
    });
  };
  
  // Submit feedback to the API
  const handleSubmit = async (ratingValue = rating) => {
    try {
      setIsSubmitting(true);
      
      // Prepare feedback data
      const feedbackData = {
        feedbackType: type,
        rating: ratingValue,
        message,
        source: placement,
        metadata: {
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        }
      };
      
      // Submit to API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }
      
      // Track successful submission
      enhancedAnalytics.trackConversion('feedback_submitted', {
        feedbackType: type,
        rating: ratingValue,
        hasMessage: message.length > 0
      });
      
      // Show thank you message
      setStep('completed');
      setIsCompleted(true);
      
      // Notify parent component
      onComplete({
        rating: ratingValue,
        message,
        success: true
      });
      
      // Close the widget after a delay
      setTimeout(() => {
        setIsOpen(false);
        
        // Reset for next time
        setTimeout(() => {
          setStep('rating');
          setIsCompleted(false);
          setRating(null);
          setMessage('');
        }, 500);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // Track error
      enhancedAnalytics.trackEvent('feedback', 'error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the rating step
  const renderRatingStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">How would you rate your experience?</h3>
      <div className="flex justify-between items-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleRating(value)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              rating === value
                ? 'bg-blue-100 text-blue-700 scale-110'
                : 'hover:bg-gray-100'
            }`}
          >
            {value === 1 && <Frown className="w-8 h-8 text-red-500" />}
            {value === 2 && <Frown className="w-8 h-8 text-orange-400" />}
            {value === 3 && <Meh className="w-8 h-8 text-yellow-400" />}
            {value === 4 && <Smile className="w-8 h-8 text-green-400" />}
            {value === 5 && <Smile className="w-8 h-8 text-green-500" />}
            <span className="mt-1">{value}</span>
          </button>
        ))}
      </div>
    </div>
  );
  
  // Render the feedback message step
  const renderFeedbackStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{getFeedbackPrompt()}</h3>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full resize-none"
        rows={4}
      />
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setStep('rating')}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  );
  
  // Render the completion step
  const renderCompletedStep = () => (
    <div className="text-center space-y-2">
      <div className="flex justify-center">
        <Smile className="w-12 h-12 text-green-500" />
      </div>
      <h3 className="text-lg font-medium">Thank You!</h3>
      <p className="text-sm text-gray-500">Your feedback helps us improve.</p>
    </div>
  );
  
  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 'feedback':
        return renderFeedbackStep();
      case 'completed':
        return renderCompletedStep();
      case 'rating':
      default:
        return renderRatingStep();
    }
  };
  
  // If widget is not open, show the trigger button
  if (!isOpen) {
    return (
      <div className={`feedback-widget ${placement}`}>
        <Button 
          onClick={() => setIsOpen(true)} 
          variant="outline" 
          className="rounded-full p-2 shadow-md"
          aria-label="Open feedback form"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </div>
    );
  }
  
  // Render the open widget
  return (
    <div className={`feedback-widget ${placement} ${isOpen ? 'open' : ''}`}>
      <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            {type === 'general' ? 'Feedback' : 
              type === 'feature' ? 'Feature Feedback' : 
              type === 'support' ? 'Support Experience' : 'Feedback'}
          </span>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close feedback form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="py-2">
          {renderStep()}
        </div>
      </div>
      
      <style jsx global>{`
        .feedback-widget {
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .feedback-widget.floating {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .feedback-widget.inline {
          margin: 1rem 0;
        }
        
        .feedback-widget.bottom-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
        }
        
        .feedback-widget.open {
          animation: fade-in 0.3s ease-out;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 