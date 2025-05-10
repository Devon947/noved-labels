import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Here you would typically validate credentials against your database
    // For demo purposes, we'll accept any email/password
    if (email && password) {
      // Set session cookie
      const cookieStore = cookies();
      cookieStore.set('session_token', 'demo_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return NextResponse.json({
        success: true,
        user: {
          id: '1',
          name: 'Demo User',
          email: email
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
} 