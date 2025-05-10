import { NextResponse } from 'next/server';
import { mockService } from '@/app/services/MockService';
import { rateLimit } from '../../rate-limit';

// Wrap the GET handler with rate limiting
export const GET = rateLimit(async function GET(request) {
  const requestId = `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Processing dashboard request`);

  try {
    // Get all mock data
    const subscriptions = Array.from(mockService.subscriptions.values());
    const payments = Array.from(mockService.payments.values());
    const webhooks = mockService.webhooks;

    // Calculate some statistics
    const stats = {
      subscriptions: {
        total: subscriptions.length,
        active: subscriptions.filter(s => s.status === 'active').length,
        canceled: subscriptions.filter(s => s.status === 'canceled').length
      },
      payments: {
        total: payments.length,
        pending: payments.filter(p => p.status === 'pending').length,
        confirmed: payments.filter(p => p.status === 'confirmed').length
      },
      webhooks: {
        total: webhooks.length,
        byType: webhooks.reduce((acc, w) => {
          acc[w.type] = (acc[w.type] || 0) + 1;
          return acc;
        }, {})
      }
    };

    return NextResponse.json({
      success: true,
      requestId,
      timestamp: new Date().toISOString(),
      data: {
        subscriptions,
        payments,
        webhooks,
        stats
      }
    });
  } catch (error) {
    console.error(`[${requestId}] Error processing dashboard request:`, error);
    
    return NextResponse.json(
      {
        error: 'Failed to process dashboard request',
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
});

// Wrap the POST handler with rate limiting
export const POST = rateLimit(async function POST(request) {
  const requestId = `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Processing dashboard action request`);

  try {
    const body = await request.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json(
        {
          error: 'Missing required field: action',
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case 'clear_data': {
        // Clear all mock data
        mockService.subscriptions.clear();
        mockService.payments.clear();
        mockService.webhooks = [];
        result = { message: 'All mock data cleared' };
        break;
      }
      case 'simulate_subscription': {
        // Create a test subscription
        result = await mockService.createSubscription(
          data?.customerId || 'cus_test',
          data?.planId || 'plan_test'
        );
        break;
      }
      case 'simulate_payment': {
        // Create a test payment
        result = await mockService.createCharge(
          data?.amount || '100.00',
          data?.currency || 'USD',
          data?.metadata || {}
        );
        break;
      }
      case 'simulate_error': {
        // Simulate various error scenarios
        const errorType = data?.type || 'random';
        switch (errorType) {
          case 'timeout':
            await new Promise(resolve => setTimeout(resolve, 10000));
            throw new Error('Request timeout');
          case 'validation':
            throw new Error('Invalid data format');
          case 'server':
            throw new Error('Internal server error');
          default:
            throw new Error('Random error occurred');
        }
      }
      default:
        return NextResponse.json(
          {
            error: 'Unsupported action',
            requestId,
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
    }

    // Track dashboard action
    await mockService.trackEvent('test', 'dashboard_action', {
      action,
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
    console.error(`[${requestId}] Error processing dashboard action:`, error);
    
    return NextResponse.json(
      {
        error: 'Failed to process dashboard action',
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}); 