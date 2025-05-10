export async function POST(request) {
  try {
    const formData = await request.formData();
    const labelUrl = formData.get('labelUrl');
    const trackingNumber = formData.get('trackingNumber');
    
    if (!labelUrl) {
      return new Response(JSON.stringify({ error: 'Label URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fetch the label content
    const response = await fetch(labelUrl);
    const labelContent = await response.blob();
    
    // Set headers for download
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="shipping-label-${trackingNumber || 'download'}.pdf"`);
    
    return new Response(labelContent, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error downloading label:', error);
    return new Response(JSON.stringify({ error: 'Failed to download the label' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 