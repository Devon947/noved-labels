'use client';

import { supabase } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'All fields are required' }),
        { status: 400 }
      );
    }

    // Store message in Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject,
          message,
          status: 'new',
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;

    // Send email notification (you can integrate with your preferred email service)
    // For example, using SendGrid, Mailgun, etc.
    // await sendEmailNotification({ name, email, subject, message });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully' 
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send message. Please try again later.' 
      }),
      { status: 500 }
    );
  }
} 