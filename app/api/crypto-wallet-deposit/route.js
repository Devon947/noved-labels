'use server';

import { NextResponse } from 'next/server';
import { Client as CoinbaseClient } from 'coinbase-commerce-node';
import { Webhook } from 'coinbase-commerce-node';

// Initialize Coinbase Commerce client
const client = CoinbaseClient.init(process.env.COINBASE_COMMERCE_API_KEY || 'test_api_key');
const Charge = require('coinbase-commerce-node').resources.Charge;

/**
 * Create a cryptocurrency deposit session
 */
export async function POST(request) {
  try {
    const { 
      amount,
      email,
      origin 
    } = await request.json();
    
    // Validate input
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return NextResponse.json({ error: 'Invalid deposit amount' }, { status: 400 });
    }
    
    // Create metadata for the transaction
    const metadata = {
      type: 'wallet_deposit',
      amount: depositAmount.toString(),
      customerEmail: email || 'anonymous',
    };
    
    // Set up the charge options
    const chargeData = {
      name: 'Wallet Deposit',
      description: `Add $${depositAmount.toFixed(2)} to your NOVED Labels wallet`,
      local_price: {
        amount: depositAmount.toString(),
        currency: 'USD'
      },
      pricing_type: 'fixed_price',
      metadata: metadata,
      redirect_url: `${origin}/dashboard?deposit=success&amount=${depositAmount}&method=crypto`,
      cancel_url: `${origin}/dashboard?deposit=cancelled&method=crypto`,
    };
    
    // Create a charge
    const charge = await Charge.create(chargeData);
    
    return NextResponse.json({ 
      url: charge.hosted_url,
      code: charge.code,
      id: charge.id
    });
  } catch (error) {
    console.error('Crypto deposit error:', error);
    return NextResponse.json(
      { error: 'Error creating crypto deposit session' },
      { status: 500 }
    );
  }
}

/**
 * Handle Coinbase Commerce webhook notifications for deposits
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
        
        if (metadata && metadata.type === 'wallet_deposit') {
          const amount = parseFloat(metadata.amount);
          
          // This would connect to your wallet service
          console.log(`✅ Crypto deposit confirmed for $${amount}`);
          
          // In a real implementation, you would update the user's wallet balance
          // await walletService.addFunds(amount);
          
          // Send confirmation email if there's a customer email
          if (metadata.customerEmail) {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/send-confirmation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: metadata.customerEmail,
                depositAmount: amount,
                paymentMethod: 'cryptocurrency'
              }),
            });
          }
        }
        break;
        
      case 'charge:failed':
        // Handle failed payment
        console.log('❌ Crypto deposit failed');
        break;
        
      case 'charge:delayed':
        // Handle delayed payment
        console.log('⏳ Crypto deposit delayed');
        break;
        
      case 'charge:pending':
        // Handle pending payment
        console.log('⏳ Crypto deposit pending');
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