export default function handler(req, res) {
  // Set CORS headers to allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const formData = req.body;
    
    // Log the form progress to Vercel's console (visible in function logs)
    console.log('=== FORM PROGRESS UPDATE ===');
    console.log('Timestamp:', formData.timestamp || new Date().toISOString());
    console.log('Event Type:', formData.eventType || 'form_progress');
    
    // Log fields that have values
    if (formData.name) console.log('Name:', formData.name);
    if (formData.phone) console.log('Phone:', formData.phone);
    if (formData.email) console.log('Email:', formData.email);
    if (formData.date) console.log('Date:', formData.date);
    if (formData.time) console.log('Time:', formData.time);
    if (formData.guests) console.log('Guests:', formData.guests);
    if (formData.notes) console.log('Notes:', formData.notes);
    
    console.log('============================');
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Progress logged successfully'
    });
    
  } catch (error) {
    console.error('Error logging form progress:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to log progress' 
    });
  }
}