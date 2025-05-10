'use server';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51Abc123DefGhi456Jkl789Mno012Pqr345StU678');

export async function POST(request) {
  try {
    const { planType, origin } = await request.json();
    
    if (!planType || !['STANDARD', 'PREMIUM'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }
    
    // Set up pricing based on plan type
    const prices = {
      STANDARD: {
        unit_amount: 0, // Standard plan has no monthly fee
        name: 'Standard Plan',
        description: 'Pay-as-you-go shipping labels at $4.00 per label',
      },
      PREMIUM: {
        unit_amount: 9900, // $99.00 in cents
        name: 'Premium Plan',
        description: 'Monthly subscription with $3.00 per label pricing',
      }
    };
    
    const price = prices[planType];
    
    // For premium plans, create a subscription
    if (planType === 'PREMIUM') {
      // Create a new customer if needed
      // In a real app, you'd probably store and reuse customer IDs
      const customer = await stripe.customers.create({
        // Add customer data here if available
        metadata: {
          planType,
        },
      });
      
      // Create a checkout session for subscription
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: price.name,
                description: price.description,
              },
              unit_amount: price.unit_amount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${origin}/dashboard?checkout=success&plan=${planType}`,
        cancel_url: `${origin}/pricing?checkout=cancelled`,
        customer: customer.id,
        metadata: {
          planType,
        },
      });
      
      return NextResponse.json({ url: session.url });
    } 
    // For standard plan, just redirect to dashboard (no payment needed)
    else {
      return NextResponse.json({ 
        url: `${origin}/dashboard?plan=${planType}` 
      });
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 