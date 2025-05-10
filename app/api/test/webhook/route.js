import { NextResponse } from 'next/server';
import { mockService } from '@/app/services/MockService';
import { rateLimit } from '../../rate-limit';

// Wrap the POST handler with rate limiting
export const POST = rateLimit(async function POST(request) {
  const requestId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Processing test webhook request`);

  try {
    const body = await request.json();
    const { type, provider, data } = body;

    if (!type || !provider) {
      return NextResponse.json(
        {
          error: 'Missing required fields: type and provider',
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    let result;
    switch (provider.toLowerCase()) {
      case 'stripe': {
        // Simulate Stripe webhook
        const webhookData = {
          id: `evt_${Date.now()}`,
          type,
          data: {
            object: {
              id: `sub_${Date.now()}`,
              ...data
            }
          },
          created: Date.now()
        };
        result = await mockService.simulateWebhook(type, webhookData);
        break;
      }
      case 'coinbase': {
        // Simulate Coinbase webhook
        const webhookData = {
          id: `evt_${Date.now()}`,
          type,
          data: {
            id: `ch_${Date.now()}`,
            ...data
          },
          created: Date.now()
        };
        result = await mockService.simulateWebhook(type, webhookData);
        break;
      }
      default:
        return NextResponse.json(
          {
            error: 'Unsupported provider',
            requestId,
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
    }

    // Track test event
    await mockService.trackEvent('test', 'webhook_simulated', {
      type,
      provider,
      requestId,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      requestId,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`[${requestId}] Error processing test webhook:`, error);
    
    return NextResponse.json(
      {
        error: 'Failed to process test webhook',
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}); 