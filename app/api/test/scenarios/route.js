import { NextResponse } from 'next/server';
import { mockService } from '@/app/services/MockService';
import { rateLimit } from '../../rate-limit';

const SCENARIOS = {
  successful_subscription: {
    steps: [
      {
        type: 'stripe',
        event: 'checkout.session.completed',
        data: {
          customer: 'cus_test',
          amount_total: 2000,
          currency: 'usd',
          metadata: {
            billingCycle: 'monthly'
          }
        }
      }
    ]
  },
  failed_payment: {
    steps: [
      {
        type: 'stripe',
        event: 'payment_intent.payment_failed',
        data: {
          id: 'pi_test',
          amount: 2000,
          currency: 'usd',
          last_payment_error: {
            message: 'Your card was declined'
          }
        }
      }
    ]
  },
  subscription_cancellation: {
    steps: [
      {
        type: 'stripe',
        event: 'customer.subscription.deleted',
        data: {
          id: 'sub_test',
          customer: 'cus_test',
          status: 'canceled',
          canceled_at: Date.now()
        }
      }
    ]
  },
  crypto_payment: {
    steps: [
      {
        type: 'coinbase',
        event: 'charge:confirmed',
        data: {
          id: 'ch_test',
          amount: '100.00',
          currency: 'USD',
          metadata: {
            email: 'test@example.com',
            billingCycle: 'monthly'
          }
        }
      }
    ]
  },
  crypto_payment_failed: {
    steps: [
      {
        type: 'coinbase',
        event: 'charge:failed',
        data: {
          id: 'ch_test',
          amount: '100.00',
          currency: 'USD',
          timeline: [
            {
              status: 'failed',
              time: Date.now()
            }
          ]
        }
      }
    ]
  }
};

// Wrap the GET handler with rate limiting
export const GET = rateLimit(async function GET(request) {
  const requestId = `scenarios_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Processing scenarios request`);

  try {
    return NextResponse.json({
      success: true,
      requestId,
      timestamp: new Date().toISOString(),
      scenarios: Object.keys(SCENARIOS)
    });
  } catch (error) {
    console.error(`[${requestId}] Error processing scenarios request:`, error);
    
    return NextResponse.json(
      {
        error: 'Failed to process scenarios request',
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
});

// Wrap the POST handler with rate limiting
export const POST = rateLimit(async function POST(request) {
  const requestId = `scenarios_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Processing scenario execution request`);

  try {
    const body = await request.json();
    const { scenario } = body;

    if (!scenario || !SCENARIOS[scenario]) {
      return NextResponse.json(
        {
          error: 'Invalid or missing scenario',
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    const results = [];
    for (const step of SCENARIOS[scenario].steps) {
      const webhookData = {
        id: `evt_${Date.now()}`,
        type: step.event,
        data: {
          object: step.data
        },
        created: Date.now()
      };

      const result = await mockService.simulateWebhook(step.event, webhookData);
      results.push({
        step: step.event,
        result
      });

      // Add a small delay between steps
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Track scenario execution
    await mockService.trackEvent('test', 'scenario_executed', {
      scenario,
      requestId,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      requestId,
      scenario,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`[${requestId}] Error executing scenario:`, error);
    
    return NextResponse.json(
      {
        error: 'Failed to execute scenario',
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}); 