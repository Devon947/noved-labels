import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Generate a timestamp
    const timestamp = new Date().toISOString();
    
    // Create response with useful information
    return NextResponse.json({
      status: 'success',
      message: 'API test endpoint is working correctly',
      timestamp,
      environment: process.env.NODE_ENV || 'development',
      api_version: '1.0',
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodejs: process.version
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API test endpoint error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
} 