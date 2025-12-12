import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { generateQuoteId } from '@/utils/generateQuoteId';

const resend = new Resend(process.env.RESEND_API_KEY);

// Inbound email domain for tracking carrier responses
const INBOUND_DOMAIN = 'inbound.808freight.com';

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

// Admin email - receives copies of all carrier requests
const ADMIN_EMAIL = 'admin@808freight.com';

// ===========================================
// YOUNG BROTHERS PORT-SPECIFIC EMAILS
// Routes quotes to the correct port office
// ===========================================
const YOUNG_BROTHERS_PORT_EMAILS: { [key: string]: string } = {
  'Honolulu': 'booking@htbyb.com',
  'Hilo': 'hilo@htbyb.com',
  'Kahului': 'maui@htbyb.com',
  'Kaunakakai': 'molokai@htbyb.com',
  'Nawiliwili': 'kauai@htbyb.com',
  'Kaumalapau': 'lanai@htbyb.com',
  'Kawaihae': 'kawaihae@htbyb.com',
};

// Helper function to get Young Brothers email based on port
function getYoungBrothersEmail(origin: string, destination: string): string {
  // Check origin first (where cargo is being picked up)
  for (const port of Object.keys(YOUNG_BROTHERS_PORT_EMAILS)) {
    if (origin.includes(port)) {
      return YOUNG_BROTHERS_PORT_EMAILS[port];
    }
  }
  // Then check destination
  for (const port of Object.keys(YOUNG_BROTHERS_PORT_EMAILS)) {
    if (destination.includes(port)) {
      return YOUNG_BROTHERS_PORT_EMAILS[port];
    }
  }
  // Default to Honolulu if no match
  return YOUNG_BROTHERS_PORT_EMAILS['Honolulu'];
}

// ===========================================
// CARRIER EMAIL CONFIGURATION
// Format: carrierKey: { name, email, phone, website }
// ===========================================
const CARRIER_CONTACTS: { [key: string]: { name: string; email: string; phone: string; website: string } } = {
  // OCEAN CARRIERS
  youngBrothers: { 
    name: 'Young Brothers', 
    email: 'booking@htbyb.com',  // Default - will be overridden by port-specific
    phone: '808-543-9311',
    website: 'https://www.htbyb.com'
  },
  matson: { 
    name: 'Matson Navigation', 
    email: 'customerservice@matson.com',  // Confirmed
    phone: '1-800-4MATSON',
    website: 'https://www.matson.com'
  },
  pasha: { 
    name: 'Pasha Hawaii', 
    email: 'ContainerQuotes@pashahawaii.com',  // Confirmed quote email
    phone: '(877) 322-9920',
    website: 'https://www.pashahawaii.com'
  },
  
  // AIR CARRIERS
  alohaAir: { 
    name: 'Aloha Air Cargo', 
    email: 'customerservice@alohaaircargo.com',  // Verified
    phone: '808-484-1170',
    website: 'https://www.alohaaircargo.com'
  },
  hawaiianAir: { 
    name: 'Alaska/Hawaiian Air Cargo', 
    email: 'cargo.booking@alaskaair.com',  // Verified - Hawaiian merged with Alaska Air
    phone: '808-835-3415',
    website: 'https://www.alaskaair.com/cargo'
  },
  hawaiiAir: { 
    name: 'Hawaii Air Cargo', 
    email: ADMIN_EMAIL,  // Need to find contact - forward manually
    phone: '',
    website: ''
  },
  pacificAir: { 
    name: 'Pacific Air Cargo', 
    email: 'quotes@pacificaircargo.com',  // Verified
    phone: '808-836-0011',
    website: 'https://www.pacificaircargo.com'
  },
  dhx: { 
    name: 'DHX (Dependable Hawaiian Express)', 
    email: 'rates@dhx.com',  // Verified
    phone: '808-836-2424',
    website: 'https://www.dhx.com'
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      name,
      companyName,
      phone,
      shippingType,
      routeType,
      origin,
      destination,
      selectedCarriers,
      selectedServices,
      cargoType,
      weight,
      length,
      width,
      height,
      quantity
    } = body;

    // Generate unique quote ID for tracking
    const quoteId = generateQuoteId();
    
    // Save quote request to database
    const { error: dbError } = await getSupabase()
      .from('quote_requests')
      .insert({
        quote_id: quoteId,
        user_email: email,
        user_name: name,
        user_phone: phone,
        company_name: companyName,
        pickup_island: origin,
        delivery_island: destination,
        cargo_type: cargoType,
        length_inches: length || null,
        width_inches: width || null,
        height_inches: height || null,
        weight_lbs: weight,
        selected_carriers: selectedCarriers,
        status: 'pending',
        metadata: {
          shippingType,
          routeType,
          quantity,
          selectedServices
        }
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway - don't fail the whole request if DB save fails
    }

    // 1. Send confirmation email to CUSTOMER - Simple flat design
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body bgcolor="#000435" style="margin: 0; padding: 40px 20px; background-color: #000435; font-family: Arial, Helvetica, sans-serif;">
  
  <h1 style="color: #1E9FD8; font-size: 36px; margin: 0 0 10px 0; font-weight: 900; text-align: center;">808 FREIGHT</h1>
  
  <h2 style="color: #39ff14; font-size: 32px; margin: 30px 0 10px 0; font-weight: 900; text-align: center;">MAHALO!</h2>
  <p style="color: #ffffff; font-size: 20px; margin: 0 0 5px 0; font-weight: 700; text-align: center;">Your quote request has been submitted successfully.</p>
  <p style="color: #1E9FD8; font-size: 18px; margin: 0 0 30px 0; font-weight: 700; text-align: center;">Quote ID: ${quoteId.toUpperCase()}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">QUOTE DETAILS</h3>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Name:</span> ${name || 'N/A'}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Company:</span> ${companyName || 'N/A'}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Email:</span> ${email}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Phone:</span> ${phone}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">SHIPPING INFO</h3>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Type:</span> ${shippingType === 'ocean' ? 'Ocean Freight' : 'Air Cargo'}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Route:</span> ${routeType}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">From:</span> ${origin}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">To:</span> ${destination}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">CARRIERS CONTACTED</h3>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;">${selectedCarriers?.map((c: string) => CARRIER_CONTACTS[c]?.name || c).join(', ') || 'N/A'}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">CARGO DETAILS</h3>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Cargo Type:</span> ${cargoType}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Weight:</span> ${weight} lbs</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Dimensions:</span> ${length || '-'}" x ${width || '-'}" x ${height || '-'}"</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Quantity:</span> ${quantity || '1'}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">WHAT HAPPENS NEXT?</h3>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 600; line-height: 1.6;">Your request has been sent to all selected carriers. Most quotes arrive within 24-48 hours. We'll compile your quotes and send you a side-by-side comparison once all carriers respond.</p>
  
  <p style="color: #1E9FD8; font-size: 16px; margin: 40px 0 5px 0; font-weight: 700; text-align: center;">Questions? Contact us:</p>
  <p style="color: #ffffff; font-size: 18px; margin: 0; font-weight: 700; text-align: center;">admin@808freight.com</p>

</body>
</html>
    `;

    // Send to customer
    await resend.emails.send({
      from: '808 Freight <noreply@808freight.com>',
      to: [email],
      subject: 'Your 808 Freight Quote Request - Confirmed!',
      html: customerEmailHtml,
    });

    // Helper function to add delay between emails (avoid rate limiting)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // 2. Send quote request to EACH CARRIER
    for (let i = 0; i < (selectedCarriers || []).length; i++) {
      const carrierKey = selectedCarriers[i];
      
      // Add delay between emails to avoid Resend rate limit (2 req/sec on free tier)
      if (i > 0) {
        await delay(600); // 600ms delay between each carrier email
      }
      const carrier = CARRIER_CONTACTS[carrierKey];
      if (!carrier) continue;

      // Get the correct email - use port-specific for Young Brothers
      let carrierEmail = carrier.email;
      if (carrierKey === 'youngBrothers') {
        carrierEmail = getYoungBrothersEmail(origin, destination);
      }

      const carrierEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body bgcolor="#000435" style="margin: 0; padding: 40px 20px; background-color: #000435; font-family: Arial, Helvetica, sans-serif;">
  
  <h1 style="color: #1E9FD8; font-size: 36px; margin: 0 0 10px 0; font-weight: 900; text-align: center;">808 FREIGHT</h1>
  
  <h2 style="color: #39ff14; font-size: 28px; margin: 30px 0 10px 0; font-weight: 900; text-align: center;">FREIGHT QUOTE REQUEST</h2>
  <p style="color: #ffffff; font-size: 18px; margin: 0 0 5px 0; font-weight: 600; text-align: center;">A customer has submitted a quote request via 808 Freight.</p>
  <p style="color: #1E9FD8; font-size: 16px; margin: 0 0 30px 0; font-weight: 700; text-align: center;">Quote ID: ${quoteId.toUpperCase()}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">CUSTOMER INFORMATION</h3>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Name:</span> ${name || 'N/A'}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Company:</span> ${companyName || 'N/A'}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Email:</span> ${email}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Phone:</span> ${phone}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">SHIPMENT DETAILS</h3>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Type:</span> ${shippingType === 'ocean' ? 'Ocean Freight' : 'Air Cargo'}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Route:</span> ${routeType}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Origin:</span> ${origin}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Destination:</span> ${destination}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">CARGO INFORMATION</h3>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Cargo Type:</span> ${cargoType}</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Weight:</span> ${weight} lbs</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Dimensions:</span> ${length || '-'}" L x ${width || '-'}" W x ${height || '-'}" H</p>
  <p style="color: #ffffff; font-size: 18px; margin: 8px 0; font-weight: 700;"><span style="color: #1E9FD8;">Quantity:</span> ${quantity || '1'}</p>
  
  <h3 style="color: #1E9FD8; font-size: 24px; margin: 30px 0 15px 0; font-weight: 800;">PLEASE RESPOND TO:</h3>
  <p style="color: #39ff14; font-size: 20px; margin: 8px 0; font-weight: 700;">${email}</p>
  <p style="color: #39ff14; font-size: 20px; margin: 8px 0; font-weight: 700;">${phone}</p>
  
  <p style="color: #1E9FD8; font-size: 14px; margin: 40px 0 5px 0; font-weight: 600; text-align: center;">Submitted via 808 Freight | Carrier: ${carrier.name}</p>
  <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 600; text-align: center;">admin@808freight.com</p>

</body>
</html>
      `;

      // Send to carrier email (or admin if carrier email not verified)
      // Always CC admin so you have a record
      // Reply-To uses quote-specific inbound address for automated tracking
      console.log(`📧 Sending carrier email for ${quoteId}:`);
      console.log(`   Carrier: ${carrier.name}`);
      console.log(`   TO: ${carrierEmail}`);
      console.log(`   CC: ${carrierEmail !== ADMIN_EMAIL ? ADMIN_EMAIL : 'none'}`);
      
      const sendResult = await resend.emails.send({
        from: '808 Freight <noreply@808freight.com>',
        to: [carrierEmail],
        cc: carrierEmail !== ADMIN_EMAIL ? [ADMIN_EMAIL] : undefined,
        subject: `Quote Request: ${origin} to ${destination} [${quoteId.toUpperCase()}]`,
        html: carrierEmailHtml,
        replyTo: `${quoteId}@${INBOUND_DOMAIN}`, // Routes carrier replies through our system
      });
      
      console.log(`   Result:`, JSON.stringify(sendResult));
    }

    return NextResponse.json({ success: true, message: 'Emails sent successfully' });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
