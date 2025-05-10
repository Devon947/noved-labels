import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { shippingHistoryService } from '@/app/services/ShippingHistoryService';
import { analytics } from '@/lib/analytics';
import { rateLimit } from '../rate-limit';

const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

// Helper function to handle errors consistently
async function handleError(error, context, event = null) {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Log error with context
  console.error(`[${errorId}] Error in ${context}:`, {
    error: error.message,
    stack: error.stack,
    event: event?.type,
    timestamp: new Date().toISOString()
  });
  
  // Track error in analytics
  await analytics.trackEvent('error', context, {
    errorId,
    errorMessage: error.message,
    eventType: event?.type,
    timestamp: new Date().toISOString()
  });
  
  return errorId;
}

// Helper function to send email confirmations with retry logic
async function sendSubscriptionEmail(email, planType, billingCycle, previousPlan, isNewSubscription) {
  if (!email) return;
  
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          planType,
          billingCycle,
          previousPlan,
          isNewSubscription,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Email API responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send confirmation email');
      }
      
      console.log('✅ Subscription confirmation email sent successfully');
      return true;
    } catch (error) {
      retryCount++;
      if (retryCount === maxRetries) {
        await handleError(error, 'sendSubscriptionEmail', {
          type: 'email_send_failed',
          email,
          planType,
          billingCycle
        });
        return false;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
}

// Wrap the POST handler with rate limiting
export const POST = rateLimit(async function POST(request) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Processing crypto webhook request`);
  
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('x-cc-webhook-signature');
  
  try {
    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(body).digest('hex');
    
    if (digest !== signature) {
      throw new Error('Invalid webhook signature');
    }
    
    console.log(`[${requestId}] Webhook signature verified`);
    
    const event = JSON.parse(body);
    console.log(`[${requestId}] Processing event type: ${event.type}`);
    
    // Handle the event
    switch (event.type) {
      case 'charge:confirmed': {
        const charge = event.data;
        console.log(`[${requestId}] Processing confirmed charge: ${charge.id}`);
        
        // Update user's subscription status with retry logic
        const maxRetries = 3;
        let retryCount = 0;
        let success = false;
        
        while (retryCount < maxRetries && !success) {
          try {
            await shippingHistoryService.savePlan('PREMIUM');
            success = true;
          } catch (error) {
            retryCount++;
            if (retryCount === maxRetries) {
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
        
        // Send confirmation email if available
        if (charge.metadata?.email) {
          await sendSubscriptionEmail(
            charge.metadata.email,
            'PREMIUM',
            charge.metadata.billingCycle || 'monthly',
            'STANDARD',
            true
          );
        }
        
        // Track successful subscription
        await analytics.trackConversion('complete_subscription', {
          plan: 'PREMIUM',
          billingCycle: charge.metadata.billingCycle || 'monthly',
          value: charge.pricing.local.amount,
          isNewSubscription: true,
          paymentMethod: 'crypto',
          chargeId: charge.id,
          requestId
        });
        
        break;
      }
      
      case 'charge:failed': {
        const charge = event.data;
        console.log(`[${requestId}] Processing failed charge: ${charge.id}`);
        
        // Track failed payment
        await analytics.trackEvent('payment', 'failed', {
          type: 'Crypto Payment',
          amount: charge.pricing.local.amount,
          error: charge.timeline[charge.timeline.length - 1]?.status,
          chargeId: charge.id,
          requestId
        });
        
        break;
      }
      
      default:
        console.log(`[${requestId}] Unhandled event type: ${event.type}`);
    }
    
    console.log(`[${requestId}] Successfully processed webhook`);
    return NextResponse.json({ 
      received: true,
      requestId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const errorId = await handleError(error, 'crypto_webhook_processing', {
      type: 'webhook_error',
      requestId
    });
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        errorId,
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}); 