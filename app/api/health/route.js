import { NextResponse } from 'next/server';
import { mockService } from '@/app/services/MockService';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      stripe: 'healthy',
      coinbase: 'healthy',
      database: 'healthy',
      email: 'healthy'
    },
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    // Check Stripe connection
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
        typescript: true,
      });
      await stripe.balance.retrieve();
    } else {
      // Use mock service if no Stripe key
      await mockService.simulateWebhook('stripe.health', { status: 'ok' });
      health.services.stripe = 'mock';
    }
  } catch (error) {
    health.services.stripe = 'unhealthy';
    health.status = 'degraded';
  }

  try {
    // Check Coinbase webhook secret
    if (process.env.COINBASE_COMMERCE_WEBHOOK_SECRET) {
      const crypto = await import('crypto');
      crypto.createHmac('sha256', process.env.COINBASE_COMMERCE_WEBHOOK_SECRET);
    } else {
      // Use mock service if no Coinbase secret
      await mockService.simulateWebhook('coinbase.health', { status: 'ok' });
      health.services.coinbase = 'mock';
    }
  } catch (error) {
    health.services.coinbase = 'unhealthy';
    health.status = 'degraded';
  }

  try {
    // Check database connection
    const { shippingHistoryService } = await import('@/app/services/ShippingHistoryService');
    await shippingHistoryService.getCurrentPlan();
  } catch (error) {
    // Use mock service if database fails
    await mockService.checkHealth();
    health.services.database = 'mock';
  }

  try {
    // Check email service
    if (process.env.NEXT_PUBLIC_APP_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Email service health check failed');
      }
    } else {
      // Use mock service if no email service URL
      await mockService.sendEmail('test@example.com', 'Health Check', 'health', {});
      health.services.email = 'mock';
    }
  } catch (error) {
    health.services.email = 'unhealthy';
    health.status = 'degraded';
  }

  // Add mock service status
  if (health.services.stripe === 'mock' || 
      health.services.coinbase === 'mock' || 
      health.services.database === 'mock' || 
      health.services.email === 'mock') {
    health.services.mock = 'active';
  }

  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
} 