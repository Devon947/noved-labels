'use server';

import { NextResponse } from 'next/server';
import { Client as CoinbaseClient } from 'coinbase-commerce-node';
import { Webhook } from 'coinbase-commerce-node';

// Initialize Coinbase Commerce client
// In production, use environment variables for the API key
const client = CoinbaseClient.init(process.env.COINBASE_COMMERCE_API_KEY || 'test_api_key');
const Charge = require('coinbase-commerce-node').resources.Charge;

/**
 * Create a cryptocurrency checkout session
 */
export async function POST(request) {
  try {
    const { 
      planType, 
      billingCycle = 'monthly', 
      email,
      origin 
    } = await request.json();
    
    if (!planType || !['STANDARD', 'PREMIUM'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }
    
    // Set up pricing based on plan type and billing cycle
    const prices = {
      STANDARD: {
        amount: 0, // Standard plan has no monthly fee
        name: 'Standard Plan',
        description: 'Pay-as-you-go shipping labels at $4.00 per label',
      },
      PREMIUM: {
        monthly: {
          amount: 99.00, // $99.00
          name: 'Premium Plan (Monthly)',
          description: 'Monthly subscription with $3.00 per label pricing',
          interval: 'month',
        },
        yearly: {
          amount: 999.00, // $999.00
          name: 'Premium Plan (Annual)',
          description: 'Annual subscription with $3.00 per label pricing (2 months free)',
          interval: 'year',
        }
      }
    };
    
    // For premium plans, create a crypto checkout
    if (planType === 'PREMIUM') {
      // Get the correct price based on billing cycle
      const priceData = prices[planType][billingCycle];
      
      // Create metadata for the transaction
      const metadata = {
        planType,
        billingCycle,
        customerEmail: email || 'anonymous',
      };
      
      // Set up the charge options
      const chargeData = {
        name: priceData.name,
        description: priceData.description,
        local_price: {
          amount: priceData.amount.toString(),
          currency: 'USD'
        },
        pricing_type: 'fixed_price',
        metadata: metadata,
        redirect_url: `${origin}/dashboard?checkout=success&plan=${planType}&cycle=${billingCycle}&method=crypto`,
        cancel_url: `${origin}/pricing?checkout=cancelled&method=crypto`,
      };
      
      // Create a charge
      const charge = await Charge.create(chargeData);
      
      return NextResponse.json({ 
        url: charge.hosted_url,
        code: charge.code,
        id: charge.id
      });
    } 
    // For standard plan, just redirect to dashboard (no payment needed)
    else {
      return NextResponse.json({ 
        url: `${origin}/dashboard?plan=${planType}` 
      });
    }
  } catch (error) {
    console.error('Crypto checkout error:', error);
    return NextResponse.json(
      { error: 'Error creating crypto checkout session' },
      { status: 500 }
    );
  }
}

/**
 * Handle Coinbase Commerce webhook notifications
 */
export async function PUT(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-cc-webhook-signature');
    const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET || 'test_webhook_secret';
    
    // Verify the webhook signature
    const event = Webhook.verifyEventBody(body, signature, webhookSecret);
    
    // Handle the event based on type
    switch(event.type) {
      case 'charge:confirmed':
        // Handle confirmed payment
        const charge = event.data;
        const metadata = charge.metadata;
        
        if (metadata && metadata.planType) {
          // Save the user's plan in your database
          // This would connect to your user service
          console.log(`✅ Crypto payment confirmed for ${metadata.planType} plan with ${metadata.billingCycle} billing`);
          
          // Here you'd update the user's subscription status
          // await shippingHistoryService.savePlan(metadata.planType, { billingCycle: metadata.billingCycle });
          
          // Send confirmation email if there's a customer email
          if (metadata.customerEmail) {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/send-confirmation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: metadata.customerEmail,
                planType: metadata.planType,
                billingCycle: metadata.billingCycle,
                isNewSubscription: true,
                paymentMethod: 'cryptocurrency'
              }),
            });
          }
        }
        break;
        
      case 'charge:failed':
        // Handle failed payment
        console.log('❌ Crypto payment failed');
        break;
        
      case 'charge:delayed':
        // Handle delayed payment
        console.log('⏳ Crypto payment delayed');
        break;
        
      case 'charge:pending':
        // Handle pending payment
        console.log('⏳ Crypto payment pending');
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 