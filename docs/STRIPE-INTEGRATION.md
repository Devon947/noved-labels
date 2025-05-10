# Stripe Integration Guide

This document outlines how Stripe payment processing is integrated with NOVED Labels to handle subscriptions, wallet deposits, and payments.

## Configuration

Before deploying to production, you'll need to add the following environment variables:

```
# Stripe Integration
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

For local development, create a `.env.local` file in the root directory and add the environment variables above.

## Features Implemented

### 1. Premium Plan Subscription

- Users can upgrade to Premium ($99/month) from the pricing page
- Subscription is processed through Stripe Checkout
- Webhooks handle subscription creation, updates, and cancellation events
- Premium benefits applied immediately upon successful payment

### 2. Wallet Deposits

- Users can add funds to their wallet through Stripe Checkout
- Deposits are processed securely through Stripe
- Wallet balance updates automatically upon successful payment via webhooks
- Transaction history tracks all deposits

### 3. Label Purchases

- The wallet is charged automatically when creating shipping labels
- Different rates apply based on the user's plan:
  - Standard: $4.00 per label
  - Premium: $3.00 per label
- Users cannot generate labels without sufficient wallet balance

## Testing Stripe Integration

For testing, use Stripe's test card numbers:

- Success Card: 4242 4242 4242 4242
- Failure Card: 4000 0000 0000 0002

Use any future expiration date, any 3-digit CVC, and any billing postal code.

## Webhook Setup

For local development:
1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhook events to your local server:
   ```
   stripe listen --forward-to localhost:3000/api/webhook
   ```

For production:
1. Go to the Stripe Dashboard → Developers → Webhooks
2. Add an endpoint: `https://your-domain.com/api/webhook`
3. Subscribe to these events:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed

## Additional Documentation

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview) 