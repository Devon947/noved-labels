'use server';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend email service - https://resend.com
// In production, use environment variables for the API key
const resend = new Resend(process.env.RESEND_API_KEY || 'test_api_key');

/**
 * Send a subscription confirmation email
 */
export async function POST(request) {
  try {
    const { 
      email, 
      planType, 
      billingCycle, 
      previousPlan,
      isNewSubscription 
    } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Format the subscription details for the email
    const planName = planType === 'PREMIUM' ? 'Premium' : 'Standard';
    const cycleText = billingCycle === 'yearly' ? 'yearly' : 'monthly';
    const actionType = isNewSubscription ? 'subscribed to' : 'changed to';
    
    let priceInfo = '';
    if (planType === 'PREMIUM') {
      if (billingCycle === 'yearly') {
        priceInfo = '$999/year (Save $198 with 2 months free)';
      } else {
        priceInfo = '$99/month';
      }
    } else {
      priceInfo = 'No monthly fee, $4.00 per label';
    }
    
    // Create custom email content based on the subscription change
    let subject, textContent, actionDescription;
    
    if (isNewSubscription) {
      subject = `Welcome to NOVED Labels ${planName} Plan!`;
      actionDescription = 'Your new subscription has been activated';
    } else if (previousPlan === 'STANDARD' && planType === 'PREMIUM') {
      subject = 'Your NOVED Labels subscription has been upgraded!';
      actionDescription = 'Your subscription has been upgraded';
    } else if (previousPlan === 'PREMIUM' && planType === 'STANDARD') {
      subject = 'Your NOVED Labels subscription has been changed';
      actionDescription = 'Your subscription has been downgraded';
    } else {
      subject = 'Your NOVED Labels subscription has been updated';
      actionDescription = 'Your subscription has been updated';
    }
    
    textContent = `
      Hi there,
      
      ${actionDescription} to the ${planName} Plan with ${cycleText} billing.
      
      Plan details:
      - ${planName} Plan
      - ${priceInfo}
      ${planType === 'PREMIUM' ? '- Unlimited labels per month' : '- Limited to 100 labels per month'}
      ${planType === 'PREMIUM' ? '- Includes priority support, bulk shipping, and API access' : ''}
      
      You can manage your subscription at any time from your account dashboard.
      
      Thank you for choosing NOVED Labels!
      
      The NOVED Team
    `;
    
    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'NOVED Labels <notifications@novedlabels.com>',
      to: email,
      subject: subject,
      text: textContent,
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      messageId: data?.id,
      message: 'Confirmation email sent successfully' 
    });
    
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
} 