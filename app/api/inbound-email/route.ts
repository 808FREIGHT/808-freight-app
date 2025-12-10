import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Lazy-initialize Supabase client (avoid build-time errors)
let supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabase;
}

// Admin email for copies
const ADMIN_EMAIL = 'admin@808freight.com';

// Map email domains to carrier names
function getCarrierName(email: string): string {
  const domain = email.toLowerCase();
  if (domain.includes('matson')) return 'Matson Navigation';
  if (domain.includes('pasha')) return 'Pasha Hawaii';
  if (domain.includes('htbyb') || domain.includes('youngbrothers')) return 'Young Brothers';
  if (domain.includes('alohaair') || domain.includes('alohaaircargo')) return 'Aloha Air Cargo';
  if (domain.includes('hawaiianair') || domain.includes('alaskaair')) return 'Alaska/Hawaiian Air Cargo';
  if (domain.includes('pacificaircargo')) return 'Pacific Air Cargo';
  if (domain.includes('dhx')) return 'DHX - Dependable Hawaiian Express';
  if (domain.includes('fedex')) return 'FedEx Cargo';
  if (domain.includes('ups')) return 'UPS Cargo';
  return 'Carrier';
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Handle Resend inbound email webhook
    // Payload structure: { type: 'email.received', data: { from, to, subject, text, html, ... } }
    
    if (payload.type !== 'email.received') {
      return NextResponse.json({ message: 'Ignored event type' }, { status: 200 });
    }

    const emailData = payload.data;
    const toAddress = Array.isArray(emailData.to) ? emailData.to[0] : emailData.to;
    
    // Extract quote ID from email address (e.g., qt_abc12345@inbound.808freight.com)
    const quoteIdMatch = toAddress.match(/^(qt_[a-z0-9]+)@/i);
    
    if (!quoteIdMatch) {
      console.error('No quote ID found in to address:', toAddress);
      // Forward to admin anyway so nothing gets lost
      await resend.emails.send({
        from: '808 Freight <noreply@808freight.com>',
        to: [ADMIN_EMAIL],
        subject: `[UNMATCHED] ${emailData.subject || 'No Subject'}`,
        html: `
          <p><strong>Could not match this email to a quote request.</strong></p>
          <p><strong>To:</strong> ${toAddress}</p>
          <p><strong>From:</strong> ${emailData.from}</p>
          <hr>
          <div>${emailData.html || emailData.text?.replace(/\n/g, '<br>') || 'No content'}</div>
        `
      });
      return NextResponse.json({ error: 'Invalid quote ID - forwarded to admin' }, { status: 200 });
    }

    const quoteId = quoteIdMatch[1].toLowerCase();
    
    // Look up the original quote request
    const { data: quoteRequest, error: lookupError } = await getSupabase()
      .from('quote_requests')
      .select('*')
      .eq('quote_id', quoteId)
      .single();

    if (lookupError || !quoteRequest) {
      console.error('Quote not found:', quoteId, lookupError);
      // Forward to admin with context
      await resend.emails.send({
        from: '808 Freight <noreply@808freight.com>',
        to: [ADMIN_EMAIL],
        subject: `[QUOTE NOT FOUND: ${quoteId}] ${emailData.subject || 'No Subject'}`,
        html: `
          <p><strong>Quote ID not found in database:</strong> ${quoteId}</p>
          <p><strong>From:</strong> ${emailData.from}</p>
          <hr>
          <div>${emailData.html || emailData.text?.replace(/\n/g, '<br>') || 'No content'}</div>
        `
      });
      return NextResponse.json({ error: 'Quote not found - forwarded to admin' }, { status: 200 });
    }

    const carrierEmail = Array.isArray(emailData.from) ? emailData.from[0] : emailData.from;
    const carrierName = getCarrierName(carrierEmail);
    
    // Log the carrier response in database
    const { error: insertError } = await getSupabase()
      .from('carrier_responses')
      .insert({
        quote_id: quoteId,
        carrier_name: carrierName,
        carrier_email: carrierEmail,
        subject: emailData.subject,
        body: emailData.text || emailData.html,
        received_at: new Date().toISOString(),
        forwarded_to_customer: false
      });

    if (insertError) {
      console.error('Failed to log carrier response:', insertError);
    }

    // Forward to customer with simple flat design
    const forwardEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body bgcolor="#000435" style="margin: 0; padding: 40px 20px; background-color: #000435; font-family: Arial, Helvetica, sans-serif;">
  
  <h1 style="color: #1E9FD8; font-size: 36px; margin: 0 0 10px 0; font-weight: 900; text-align: center;">808 FREIGHT</h1>
  
  <h2 style="color: #39ff14; font-size: 28px; margin: 30px 0 10px 0; font-weight: 900; text-align: center;">QUOTE RESPONSE RECEIVED!</h2>
  <p style="color: #ffffff; font-size: 20px; margin: 0 0 30px 0; font-weight: 700; text-align: center;">You've received a response from ${carrierName}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">QUOTE DETAILS</h3>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Quote ID:</span> ${quoteId.toUpperCase()}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Carrier:</span> ${carrierName}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Subject:</span> ${emailData.subject || 'No Subject'}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">CARRIER MESSAGE</h3>
  <div style="color: #ffffff; font-size: 18px; line-height: 1.6; font-weight: 500; margin: 8px 0;">
    ${emailData.html || emailData.text?.replace(/\n/g, '<br>') || 'No content'}
  </div>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">REPLY DIRECTLY TO CARRIER</h3>
  <p style="color: #39ff14; font-size: 20px; margin: 8px 0; font-weight: 700;">${carrierEmail}</p>
  
  <p style="color: #1E9FD8; font-size: 14px; margin: 40px 0 5px 0; font-weight: 600; text-align: center;">This quote was facilitated by 808 Freight</p>
  <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 600; text-align: center;">admin@808freight.com</p>

</body>
</html>
    `;

    // Send to customer
    const { error: sendError } = await resend.emails.send({
      from: '808 Freight <quotes@808freight.com>',
      to: [quoteRequest.user_email],
      cc: [ADMIN_EMAIL], // Admin always gets a copy
      subject: `Quote Response from ${carrierName} - ${quoteId.toUpperCase()}`,
      html: forwardEmailHtml,
      replyTo: carrierEmail, // Customer can reply directly to carrier
    });

    if (sendError) {
      console.error('Failed to forward to customer:', sendError);
      return NextResponse.json({ error: 'Failed to forward' }, { status: 500 });
    }

    // Update forwarded status in database
    await getSupabase()
      .from('carrier_responses')
      .update({ 
        forwarded_to_customer: true,
        forwarded_at: new Date().toISOString()
      })
      .eq('quote_id', quoteId)
      .eq('carrier_email', carrierEmail)
      .order('received_at', { ascending: false })
      .limit(1);

    // Update quote status if this is the first response
    await getSupabase()
      .from('quote_requests')
      .update({ 
        status: 'responses_received',
        updated_at: new Date().toISOString()
      })
      .eq('quote_id', quoteId)
      .eq('status', 'pending');

    console.log(`Successfully forwarded response for ${quoteId} from ${carrierName} to ${quoteRequest.user_email}`);

    return NextResponse.json({ 
      success: true, 
      quoteId, 
      carrier: carrierName,
      forwardedTo: quoteRequest.user_email 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Verify webhook signature (optional but recommended for production)
// Resend sends a signature in the 'svix-signature' header

