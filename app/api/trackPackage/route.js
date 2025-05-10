export async function POST(request) {
  try {
    const formData = await request.formData();
    const trackingUrl = formData.get('trackingUrl');
    
    if (!trackingUrl) {
      return new Response(JSON.stringify({ error: 'Tracking URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Redirect to the tracking URL
    return Response.redirect(trackingUrl);
  } catch (error) {
    console.error('Error tracking package:', error);
    return new Response(JSON.stringify({ error: 'Failed to process the request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 