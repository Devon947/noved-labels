import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session_token');

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false });
    }

    // Here you would typically validate the session token
    // For now, we'll just check if it exists
    return NextResponse.json({
      authenticated: true,
      user: {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com'
      }
    });
  } catch (error) {
    console.error('Session check failed:', error);
    return NextResponse.json(
      { error: 'Session check failed' },
      { status: 500 }
    );
  }
} 