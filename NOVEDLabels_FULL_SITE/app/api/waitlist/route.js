'use server';

import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

// In-memory storage (replace with database in production)
const waitlist = new Map();
const GIVEAWAY_PRIZES = {
  first: {
    name: 'AirPods Pro 4 ANC',
    description: 'Latest generation AirPods with Active Noise Cancellation',
    image: '/images/airpods-pro.jpg'
  },
  second: {
    name: 'Nike Air Force 1 Low',
    description: 'Classic white Nike Air Force 1 Low Top Sneakers',
    image: '/images/air-force-1.jpg'
  }
};

export async function POST(request) {
  try {
    const { name, email, phone, referral } = await request.json();
    
    // Generate unique waitlist code
    const waitlistCode = createHash('md5')
      .update(`${email}-${Date.now()}`)
      .digest('hex')
      .substring(0, 8);

    const entry = {
      id: waitlistCode,
      name,
      email,
      phone,
      referral,
      points: 0,
      createdAt: new Date().toISOString(),
      status: 'active',
      entries: 1 // Each signup counts as one entry
    };

    // Add points for referral
    if (referral) {
      const referrer = waitlist.get(referral);
      if (referrer) {
        referrer.points += 10;
        referrer.entries += 1;
        waitlist.set(referral, referrer);
        entry.points += 5; // Bonus points for being referred
      }
    }

    waitlist.set(waitlistCode, entry);

    return NextResponse.json({ 
      success: true, 
      waitlistCode,
      message: 'Successfully joined the waitlist!',
      prizes: GIVEAWAY_PRIZES
    });
  } catch (error) {
    console.error('Waitlist registration error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const entry = waitlist.get(code);
    if (!entry) {
      return NextResponse.json(
        { error: 'Invalid waitlist code' },
        { status: 404 }
      );
    }
    return NextResponse.json({ entry });
  }

  // Return leaderboard
  const entries = Array.from(waitlist.values())
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  return NextResponse.json({ 
    leaderboard: entries,
    prizes: GIVEAWAY_PRIZES
  });
} 