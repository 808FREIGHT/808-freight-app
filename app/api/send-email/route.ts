import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Admin email - receives copies of all carrier requests
const ADMIN_EMAIL = 'imipono422@gmail.com';

// ===========================================
// CARRIER EMAIL CONFIGURATION
// Update these with real carrier quote emails when available
// Format: carrierKey: { name, email, phone, website }
// ===========================================
const CARRIER_CONTACTS: { [key: string]: { name: string; email: string; phone: string; website: string } } = {
  // OCEAN CARRIERS
  youngBrothers: { 
    name: 'Young Brothers', 
    email: 'customerservice@htbyb.com',  // General customer service
    phone: '808-543-9311',
    website: 'https://www.htbyb.com'
  },
  matson: { 
    name: 'Matson Navigation', 
    email: 'customerservice@matson.com',  // Update with sales/quotes email
    phone: '1-800-4-MATSON',
    website: 'https://www.matson.com'
  },
  pasha: { 
    name: 'Pasha Hawaii', 
    email: 'customerservice@pashahawaii.com',  // Update with quotes email
    phone: '808-842-5594',
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
    email: 'cargo@alohaaircargo.com',  // Verify this email
    phone: '808-484-1170',
    website: 'https://www.alohaaircargo.com'
  },
  hawaiianAir: { 
    name: 'Hawaiian Air Cargo', 
    email: 'cargo@hawaiianairlines.com',  // Verify this email
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
    email: 'sales@pacificaircargo.com',  // Verify this email
    phone: '808-836-0011',
    website: 'https://www.pacificaircargo.com'
  },
  dhx: { 
    name: 'DHX (Dependable Hawaiian Express)', 
    email: 'quotes@dhx.com',  // Verify this email
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
      quantity,
      notificationPrefs
    } = body;

    // 1. Send confirmation email to CUSTOMER
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; max-width: 600px;">
                
                <tr>
                  <td align="center" style="padding: 30px 20px; background-color: #ffffff;">
                    <h2 style="color: #1e3a8a; font-size: 36px; margin: 0; font-family: Arial, sans-serif; font-weight: 900;">MAHALO!</h2>
                    <p style="color: #1e3a8a; font-size: 18px; font-family: Arial, sans-serif; margin: 15px 0; font-weight: 600;">Your quote request has been submitted successfully!</p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 20px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1E9FD8; border-radius: 10px;">
                      <tr>
                        <td style="padding: 25px;">
                          <h3 style="color: #1e3a8a; font-size: 22px; margin: 0 0 20px 0; font-family: Arial, sans-serif; font-weight: 800;">Quote Details</h3>
                          
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Company:</strong> ${companyName || 'N/A'}</p>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Name:</strong> ${name || 'N/A'}</p>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Email:</strong> ${email}</p>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Phone:</strong> ${phone}</p>
                          
                          <hr style="border: none; border-top: 2px solid #1e3a8a; margin: 20px 0; opacity: 0.3;" />
                          
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Shipping Type:</strong> ${shippingType === 'ocean' ? 'Ocean Freight' : 'Air Cargo'}</p>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Route:</strong> ${routeType}</p>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">From:</strong> ${origin}</p>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">To:</strong> ${destination}</p>
                          
                          <hr style="border: none; border-top: 2px solid #1e3a8a; margin: 20px 0; opacity: 0.3;" />
                          
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Carriers:</strong> ${selectedCarriers?.map((c: string) => CARRIER_CONTACTS[c]?.name || c).join(', ') || 'N/A'}</p>
                          
                          <hr style="border: none; border-top: 2px solid #1e3a8a; margin: 20px 0; opacity: 0.3;" />
                          
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Cargo:</strong> ${cargoType}</p>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Weight:</strong> ${weight} lbs</p>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Dimensions:</strong> ${length || '-'}" x ${width || '-'}" x ${height || '-'}"</p>
                          <p style="color: #1e3a8a; font-size: 16px; margin: 10px 0; font-family: Arial, sans-serif; font-weight: 600;"><strong style="font-weight: 800;">Quantity:</strong> ${quantity || '1'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td align="center" style="padding: 20px;">
                    <p style="color: #1e3a8a; font-size: 16px; margin: 0; font-family: Arial, sans-serif; font-weight: 600;">Quote response times vary by carrier.</p>
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

      const carrierEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
            <tr>
              <td style="padding: 30px;">
                <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 24px; font-weight: 800;">Freight Quote Request</h2>
                
                <p style="color: #333; font-size: 16px; margin: 0 0 20px 0; font-weight: 600;">A customer has submitted a shipping quote request via 808 Freight.</p>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; border-radius: 8px; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; font-weight: 800;">Customer Information</h3>
                      <p style="margin: 8px 0; font-size: 15px;"><strong>Name:</strong> ${name || 'N/A'}</p>
                      <p style="margin: 8px 0; font-size: 15px;"><strong>Company:</strong> ${companyName || 'N/A'}</p>
                      <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> ${email}</p>
                      <p style="margin: 8px 0; font-size: 15px;"><strong>Phone:</strong> ${phone}</p>
                    </td>
                  </tr>
                </table>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1E9FD8; border-radius: 8px; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; font-weight: 800;">Shipment Details</h3>
                      <p style="margin: 8px 0; font-size: 15px; color: #1e3a8a;"><strong>Type:</strong> ${shippingType === 'ocean' ? 'Ocean Freight' : 'Air Cargo'}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #1e3a8a;"><strong>Route:</strong> ${routeType}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #1e3a8a;"><strong>Origin:</strong> ${origin}</p>
                      <p style="margin: 8px 0; font-size: 15px; color: #1e3a8a;"><strong>Destination:</strong> ${destination}</p>
                    </td>
                  </tr>
                </table>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; border-radius: 8px; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 20px;">
                      <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; font-weight: 800;">Cargo Information</h3>
                      <p style="margin: 8px 0; font-size: 15px;"><strong>Cargo Type:</strong> ${cargoType}</p>
                      <p style="margin: 8px 0; font-size: 15px;"><strong>Weight:</strong> ${weight} lbs</p>
                      <p style="margin: 8px 0; font-size: 15px;"><strong>Dimensions:</strong> ${length || '-'}" L x ${width || '-'}" W x ${height || '-'}" H</p>
                      <p style="margin: 8px 0; font-size: 15px;"><strong>Quantity:</strong> ${quantity || '1'}</p>
                    </td>
                  </tr>
                </table>
                
                <p style="color: #333; font-size: 15px; margin: 20px 0; font-weight: 600;">
                  Please respond to the customer directly at <strong>${email}</strong> or <strong>${phone}</strong>.
                </p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
                
                <p style="color: #666; font-size: 13px; margin: 0;">
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
        to: [carrier.email],
        cc: carrier.email !== ADMIN_EMAIL ? [ADMIN_EMAIL] : undefined,
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
