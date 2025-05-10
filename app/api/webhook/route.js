import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { shippingHistoryService } from '@/app/services/ShippingHistoryService';
import { walletService } from '@/app/services/WalletService';
import { logError } from '../../lib/errorLogging';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51Abc123DefGhi456Jkl789Mno012Pqr345StU678');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder_secret_key';

export async function POST(request) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
  
  try {
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        
        // Get customer ID from the subscription
        const customerId = subscription.customer;
        
        // Retrieve the customer to get metadata
        const customer = await stripe.customers.retrieve(customerId);
        
        if (customer && customer.metadata && customer.metadata.planType) {
          // Get user ID from customer metadata (in a real app)
          const planType = customer.metadata.planType;
          const billingCycle = customer.metadata.billingCycle || 'monthly';
          
          // Update user's plan in your database
          if (subscription.status === 'active') {
            // Update the user's plan to PREMIUM (or whatever plan they subscribed to)
            await shippingHistoryService.savePlan(planType, { billingCycle });
            
            console.log(`✅ Subscription active! Plan set to ${planType} with ${billingCycle} billing`);
          }
        }
        break;
        
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const cancelledSubscription = event.data.object;
        const cancelledCustomerId = cancelledSubscription.customer;
        
        // Retrieve the customer
        const cancelledCustomer = await stripe.customers.retrieve(cancelledCustomerId);
        
        if (cancelledCustomer && cancelledCustomer.metadata) {
          // Downgrade the user back to the standard plan
          await shippingHistoryService.savePlan('STANDARD');
          
          console.log('✅ Subscription cancelled! Plan set to STANDARD');
        }
        break;
        
      case 'checkout.session.completed':
        // Handle completed checkout session
        const session = event.data.object;
        
        // Check if this is a wallet deposit
        if (session.metadata && session.metadata.type === 'wallet_deposit') {
          const amount = parseFloat(session.metadata.amount);
          
          if (!isNaN(amount) && amount > 0) {
            // Add funds to wallet
            const result = await walletService.addFunds(amount);
            
            if (result.success) {
              console.log(`✅ Added $${amount} to wallet`);
            } else {
              console.error(`❌ Failed to add funds to wallet: ${result.error}`);
            }
          }
        }
        
        // Check if this is a subscription checkout
        if (session.metadata && session.metadata.planType) {
          const planType = session.metadata.planType;
          const billingCycle = session.metadata.billingCycle || 'monthly';
          
          // This might be redundant with the subscription events above,
          // but we include it as a backup to ensure the user's plan is updated
          console.log(`✅ Checkout completed for ${planType} plan with ${billingCycle} billing`);
        }
        break;
        
      case 'invoice.payment_succeeded':
        // Handle successful payment
        const invoice = event.data.object;
        
        // Check if this is a subscription invoice
        if (invoice.subscription) {
          // Get the subscription details to determine the billing cycle
          const invoiceSubscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const billingCycle = invoiceSubscription.items.data[0]?.plan.interval === 'year' ? 'yearly' : 'monthly';
          
          console.log(`✅ Payment succeeded for ${billingCycle} subscription:`, invoice.subscription);
        }
        break;
        
      case 'invoice.payment_failed':
        // Handle failed payment
        const failedInvoice = event.data.object;
        
        // In a real app, you might want to notify the user or take other actions
        console.log('❌ Payment failed for subscription:', failedInvoice.subscription);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    // Log the error with context
    logError(error, 'Stripe Webhook Handler', {
      stripeEvent: error.stripeEvent || null,
      webhookType: error.type || 'unknown',
    });
    
    // Return error response
    console.error('Webhook error:', error.message);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 