import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  fedex: { 
    name: 'FedEx Cargo', 
    email: ADMIN_EMAIL,  // FedEx uses online system - forward manually
    phone: '1-800-463-3339',
    website: 'https://www.fedex.com'
  },
  ups: { 
    name: 'UPS Cargo', 
    email: ADMIN_EMAIL,  // UPS uses online system - forward manually
    phone: '1-800-742-5877',
    website: 'https://www.ups.com'
  },
  alohaAir: { 
    name: 'Aloha Air Cargo', 
    email: 'customerservice@alohaaircargo.com',  // Verified
    phone: '808-484-1170',
    website: 'https://www.alohaaircargo.com'
  },
  hawaiianAir: { 
    name: 'Hawaiian Airlines Cargo', 
    email: 'cargo.booking@alaskaair.com',  // Verified - Hawaiian partners with Alaska Air
    phone: '808-835-3415',
    website: 'https://www.hawaiianaircargo.com'
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

    // 1. Send confirmation email to CUSTOMER
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #000435;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000435;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #000435; max-width: 600px;">
                
                <tr>
                  <td align="center" style="padding: 30px 20px; background-color: #000435;">
                    <h2 style="color: #39ff14; font-size: 36px; margin: 0; font-family: Arial, sans-serif; font-weight: 900;">MAHALO!</h2>
                    <p style="color: #ffffff; font-size: 18px; font-family: Arial, sans-serif; margin: 15px 0; font-weight: 600;">Your quote request has been submitted successfully!</p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 20px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1e3a8a; border-radius: 10px;">
                      <tr>
                        <td style="padding: 25px;">
                          <h3 style="color: #1E9FD8; font-size: 22px; margin: 0 0 20px 0; font-family: Arial, sans-serif; font-weight: 800;">Quote Details</h3>
                          
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Company:</strong> ${companyName || 'N/A'}</p>
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Name:</strong> ${name || 'N/A'}</p>
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Email:</strong> ${email}</p>
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Phone:</strong> ${phone}</p>
                          
                          <hr style="border: none; border-top: 2px solid #1E9FD8; margin: 20px 0; opacity: 0.5;" />
                          
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Shipping Type:</strong> ${shippingType === 'ocean' ? 'Ocean Freight' : 'Air Cargo'}</p>
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Route:</strong> ${routeType}</p>
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">From:</strong> ${origin}</p>
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">To:</strong> ${destination}</p>
                          
                          <hr style="border: none; border-top: 2px solid #1E9FD8; margin: 20px 0; opacity: 0.5;" />
                          
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Carriers:</strong> ${selectedCarriers?.map((c: string) => CARRIER_CONTACTS[c]?.name || c).join(', ') || 'N/A'}</p>
                          
                          <hr style="border: none; border-top: 2px solid #1E9FD8; margin: 20px 0; opacity: 0.5;" />
                          
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Cargo:</strong> ${cargoType}</p>
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Weight:</strong> ${weight} lbs</p>
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Dimensions:</strong> ${length || '-'}" x ${width || '-'}" x ${height || '-'}"</p>
                          <p style="color: #ffffff; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800; color: #1E9FD8;">Quantity:</strong> ${quantity || '1'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td align="center" style="padding: 20px;">
                    <p style="color: #1E9FD8; font-size: 16px; margin: 0; font-family: Arial, sans-serif; font-weight: 600;">Quote response times vary by carrier.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
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

    // 2. Send quote request to EACH CARRIER
    for (const carrierKey of selectedCarriers || []) {
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
        <body style="margin: 0; padding: 0; background-color: #000435; font-family: Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000435;">
            <tr>
              <td style="padding: 30px;">
                <h2 style="color: #39ff14; margin: 0 0 20px 0; font-size: 24px; font-weight: 800;">Freight Quote Request</h2>
                
                <p style="color: #ffffff; font-size: 16px; margin: 0 0 20px 0; font-weight: 600;">A customer has submitted a shipping quote request via 808 Freight.</p>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1e3a8a; border-radius: 8px; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="color: #1E9FD8; margin: 0 0 15px 0; font-size: 18px; font-weight: 800;">Customer Information</h3>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Name:</strong> ${name || 'N/A'}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Company:</strong> ${companyName || 'N/A'}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Email:</strong> ${email}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Phone:</strong> ${phone}</p>
                    </td>
                  </tr>
                </table>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1e3a8a; border-radius: 8px; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="color: #1E9FD8; margin: 0 0 15px 0; font-size: 18px; font-weight: 800;">Shipment Details</h3>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Type:</strong> ${shippingType === 'ocean' ? 'Ocean Freight' : 'Air Cargo'}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Route:</strong> ${routeType}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Origin:</strong> ${origin}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Destination:</strong> ${destination}</p>
                    </td>
                  </tr>
                </table>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1e3a8a; border-radius: 8px; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="color: #1E9FD8; margin: 0 0 15px 0; font-size: 18px; font-weight: 800;">Cargo Information</h3>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Cargo Type:</strong> ${cargoType}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Weight:</strong> ${weight} lbs</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Dimensions:</strong> ${length || '-'}" L x ${width || '-'}" W x ${height || '-'}" H</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #ffffff;"><strong style="color: #1E9FD8;">Quantity:</strong> ${quantity || '1'}</p>
                    </td>
                  </tr>
                </table>
                
                <p style="color: #ffffff; font-size: 15px; margin: 20px 0; font-weight: 600;">
                  Please respond to the customer directly at <strong style="color: #39ff14;">${email}</strong> or <strong style="color: #39ff14;">${phone}</strong>.
                </p>
                
                <hr style="border: none; border-top: 1px solid #1E9FD8; margin: 30px 0; opacity: 0.5;" />
                
                <p style="color: #1E9FD8; font-size: 13px; margin: 0;">
                  Submitted via 808 Freight | Carrier: ${carrier.name}
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      // Send to carrier email (or admin if carrier email not verified)
      // Always CC admin so you have a record
      await resend.emails.send({
        from: '808 Freight <noreply@808freight.com>',
        to: [carrierEmail],
        cc: carrierEmail !== ADMIN_EMAIL ? [ADMIN_EMAIL] : undefined,
        subject: `Quote Request: ${origin} to ${destination}`,
        html: carrierEmailHtml,
        replyTo: email, // Customer can receive direct replies
      });
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
