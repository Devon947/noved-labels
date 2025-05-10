export async function POST(request) {
  try {
    const formData = await request.formData();
    const labelUrl = formData.get('labelUrl');
    
    if (!labelUrl) {
      return new Response(JSON.stringify({ error: 'Label URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Redirect to the label URL which will open in a new tab for printing
    return Response.redirect(labelUrl);
  } catch (error) {
    console.error('Error printing label:', error);
    return new Response(JSON.stringify({ error: 'Failed to process the request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 