'use server';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * Handle feedback submission
 */
export async function POST(request) {
  try {
    const {
      userId,
      feedbackType,
      rating,
      message,
      source,
      metadata = {}
    } = await request.json();
    
    // Validate input
    if (!feedbackType || !rating) {
      return NextResponse.json(
        { error: 'Feedback type and rating are required' },
        { status: 400 }
      );
    }
    
    // Insert feedback into database
    const { data, error } = await supabase
      .from('user_feedback')
      .insert([
        {
          user_id: userId || null,
          feedback_type: feedbackType,
          rating: rating,
          message: message || '',
          source: source || 'web',
          metadata: metadata,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error('Error saving feedback:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }
    
    // Send notification for low ratings
    if (rating <= 2) {
      // You could trigger a notification to support team here
      console.log(`Low rating feedback received: ${rating}/5`);
    }
    
    return NextResponse.json({ 
      success: true,
      feedback: data[0]
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Error processing feedback' },
      { status: 500 }
    );
  }
}

/**
 * Get feedback statistics
 */
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const feedbackType = searchParams.get('type');
    const timeframe = searchParams.get('timeframe') || '30d'; // Default to 30 days
    
    // Calculate the date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      case '30d':
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
    }
    
    // Build the query
    let query = supabase
      .from('user_feedback')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (feedbackType) {
      query = query.eq('feedback_type', feedbackType);
    }
    
    if (timeframe !== 'all') {
      query = query.gte('created_at', startDate.toISOString());
    }
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching feedback:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }
    
    // Calculate statistics
    let totalRating = 0;
    const ratingsDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    
    data.forEach(item => {
      totalRating += item.rating;
      ratingsDistribution[item.rating]++;
    });
    
    const statistics = {
      count,
      averageRating: count > 0 ? totalRating / count : 0,
      ratingsDistribution,
      feedbackItems: data
    };
    
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Feedback statistics error:', error);
    return NextResponse.json(
      { error: 'Error generating feedback statistics' },
      { status: 500 }
    );
  }
} 