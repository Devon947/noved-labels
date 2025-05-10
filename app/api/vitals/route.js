'use server';

import { NextResponse } from 'next/server';

// In-memory storage for development (replace with database in production)
const metrics = new Map();

export async function POST(request) {
  try {
    const metric = await request.json();
    const timestamp = new Date().toISOString();

    // Enhanced metric logging
    const enhancedMetric = {
      ...metric,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      referrer: request.headers.get('referer'),
      path: request.headers.get('x-pathname'),
      country: request.headers.get('x-vercel-ip-country'),
      city: request.headers.get('x-vercel-ip-city'),
    };

    // Log metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', enhancedMetric);
    }

    // Store metrics (in production, this would go to a database)
    const key = `${metric.name}-${timestamp}`;
    metrics.set(key, enhancedMetric);

    // Clean up old metrics (keep last 1000)
    if (metrics.size > 1000) {
      const oldestKey = metrics.keys().next().value;
      metrics.delete(oldestKey);
    }

    // In production, you would:
    // 1. Store in a time-series database (e.g., InfluxDB, TimescaleDB)
    // 2. Send to analytics service (e.g., Google Analytics, Mixpanel)
    // 3. Alert on performance degradation
    // 4. Generate performance reports

    return NextResponse.json({ 
      received: true,
      metricCount: metrics.size,
      timestamp 
    });
  } catch (error) {
    console.error('Error processing web vital:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process web vital',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint for metrics retrieval (protected in production)
export async function GET() {
  try {
    const metricsArray = Array.from(metrics.values());
    return NextResponse.json({ metrics: metricsArray });
  } catch (error) {
    console.error('Error retrieving metrics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
} 