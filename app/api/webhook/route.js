import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { shippingHistoryService } from '@/app/services/ShippingHistoryService';
import { walletService } from '@/app/services/WalletService';
import { analytics } from '@/lib/analytics';
import { rateLimit } from '../rate-limit';

// Initialize Stripe with proper error handling and retry configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
  maxNetworkRetries: 3,
  timeout: 20000,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
  console.log(`[${requestId}] Processing webhook request`);
  
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );
    
    console.log(`[${requestId}] Webhook signature verified for event: ${event.type}`);
  } catch (err) {
    const errorId = await handleError(err, 'webhook_signature_verification');
    return NextResponse.json(
      { 
        error: 'Webhook signature verification failed',
        errorId,
        requestId
      },
      { status: 400 }
    );
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`[${requestId}] Processing checkout.session.completed for session: ${session.id}`);
        
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
        
        // Send confirmation email
        if (session.customer_details?.email) {
          await sendSubscriptionEmail(
            session.customer_details.email,
            'PREMIUM',
            session.metadata.billingCycle || 'monthly',
            'STANDARD',
            true
          );
        }
        
        // Track successful subscription
        await analytics.trackConversion('complete_subscription', {
          plan: 'PREMIUM',
          billingCycle: session.metadata.billingCycle || 'monthly',
          value: session.amount_total / 100,
          isNewSubscription: true,
          sessionId: session.id,
          requestId
        });
        
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log(`[${requestId}] Processing subscription update: ${subscription.id}`);
        
        // Handle subscription updates with retry logic
        const maxRetries = 3;
        let retryCount = 0;
        let success = false;
        
        while (retryCount < maxRetries && !success) {
          try {
            if (subscription.status === 'active') {
              await shippingHistoryService.savePlan('PREMIUM');
            } else if (subscription.status === 'canceled') {
              await shippingHistoryService.savePlan('STANDARD');
            }
            success = true;
          } catch (error) {
            retryCount++;
            if (retryCount === maxRetries) {
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
        
        // Track subscription update
        await analytics.trackEvent('subscription', 'status_updated', {
          status: subscription.status,
          subscriptionId: subscription.id,
          requestId
        });
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        console.log(`[${requestId}] Processing subscription deletion`);
        
        // Handle subscription cancellation with retry logic
        const maxRetries = 3;
        let retryCount = 0;
        let success = false;
        
        while (retryCount < maxRetries && !success) {
          try {
            await shippingHistoryService.savePlan('STANDARD');
            success = true;
          } catch (error) {
            retryCount++;
            if (retryCount === maxRetries) {
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
        
        // Track subscription cancellation
        await analytics.trackEvent('subscription', 'cancelled', {
          requestId,
          timestamp: new Date().toISOString()
        });
        
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`[${requestId}] Processing successful payment: ${paymentIntent.id}`);
        
        // Add funds to user's wallet with retry logic
        const maxRetries = 3;
        let retryCount = 0;
        let success = false;
        
        while (retryCount < maxRetries && !success) {
          try {
            await walletService.addFunds(
              paymentIntent.metadata.userId,
              paymentIntent.amount / 100
            );
            success = true;
          } catch (error) {
            retryCount++;
            if (retryCount === maxRetries) {
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
        
        // Track successful payment
        await analytics.trackEvent('payment', 'success', {
          type: 'Wallet Deposit',
          amount: paymentIntent.amount / 100,
          paymentIntentId: paymentIntent.id,
          requestId
        });
        
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(`[${requestId}] Processing failed payment: ${paymentIntent.id}`);
        
        // Track failed payment
        await analytics.trackEvent('payment', 'failed', {
          type: 'Wallet Deposit',
          amount: paymentIntent.amount / 100,
          error: paymentIntent.last_payment_error?.message,
          paymentIntentId: paymentIntent.id,
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
    const errorId = await handleError(error, 'webhook_processing', event);
    
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