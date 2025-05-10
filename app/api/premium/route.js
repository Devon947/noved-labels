'use server';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Use a mock if no Stripe key is provided
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : {
      subscriptions: {
        create: async () => ({
          id: 'mock_subscription_id',
          latest_invoice: {
            payment_intent: {
              client_secret: 'mock_client_secret'
            }
          }
        })
      }
    };

const PREMIUM_FEATURES = {
  basic: {
    name: 'Basic Plan',
    price: 9.99,
    features: [
      'Priority Support',
      'Advanced Analytics',
      'Custom Branding',
      'API Access'
    ]
  },
  pro: {
    name: 'Pro Plan',
    price: 19.99,
    features: [
      'All Basic Features',
      'Bulk Order Processing',
      'Custom Integrations',
      'Dedicated Support',
      'White Label Solution'
    ]
  },
  enterprise: {
    name: 'Enterprise Plan',
    price: 49.99,
    features: [
      'All Pro Features',
      'Custom Development',
      'SLA Guarantee',
      '24/7 Support',
      'Advanced Security',
      'Custom Workflows'
    ]
  }
};

export async function POST(request) {
  try {
    const { plan, customerId } = await request.json();
    const planDetails = PREMIUM_FEATURES[plan];

    if (!planDetails) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Create or update Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planDetails.priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      plan: planDetails
    });
  } catch (error) {
    console.error('Premium subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan');

  if (plan && PREMIUM_FEATURES[plan]) {
    return NextResponse.json({ plan: PREMIUM_FEATURES[plan] });
  }

  return NextResponse.json({ plans: PREMIUM_FEATURES });
} 