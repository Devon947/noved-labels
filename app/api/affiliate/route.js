'use server';

import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

// In-memory storage (replace with database in production)
const affiliates = new Map();

export async function POST(request) {
  try {
    const { name, email, website } = await request.json();
    
    // Generate unique affiliate code
    const affiliateCode = createHash('md5')
      .update(`${email}-${Date.now()}`)
      .digest('hex')
      .substring(0, 8);

    const affiliate = {
      id: affiliateCode,
      name,
      email,
      website,
      commission: 0.15, // 15% commission
      earnings: 0,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    affiliates.set(affiliateCode, affiliate);

    return NextResponse.json({ 
      success: true, 
      affiliateCode,
      message: 'Affiliate application submitted successfully'
    });
  } catch (error) {
    console.error('Affiliate registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register affiliate' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Affiliate code required' },
      { status: 400 }
    );
  }

  const affiliate = affiliates.get(code);
  
  if (!affiliate) {
    return NextResponse.json(
      { error: 'Invalid affiliate code' },
      { status: 404 }
    );
  }

  return NextResponse.json({ affiliate });
} 