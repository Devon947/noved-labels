import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51Abc123DefGhi456Jkl789Mno012Pqr345StU678');

export async function POST(request) {
  try {
    const { amount, origin } = await request.json();
    
    // Validate input
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return NextResponse.json({ error: 'Invalid deposit amount' }, { status: 400 });
    }
    
    // Convert to cents for Stripe
    const amountInCents = Math.round(depositAmount * 100);
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Wallet Deposit',
              description: `Add $${depositAmount.toFixed(2)} to your NOVED Labels wallet`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard?deposit=success&amount=${depositAmount}`,
      cancel_url: `${origin}/dashboard?deposit=cancelled`,
      metadata: {
        type: 'wallet_deposit',
        amount: depositAmount.toString(),
      },
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe deposit error:', error);
    return NextResponse.json(
      { error: 'Error creating deposit session' },
      { status: 500 }
    );
  }
} 