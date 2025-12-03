import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side operations
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      shippingType,
      routeType,
      origin,
      destination,
      selectedCarriers,
      carrierSpecificFields,
      cargoType,
      weight,
      dimensions,
      quantity,
      specialInstructions,
      contact
    } = body;

    // Validate required fields
    if (!contact?.email || !contact?.phone) {
      return NextResponse.json(
        { error: 'Email and phone are required' },
        { status: 400 }
      );
    }

    if (!selectedCarriers || selectedCarriers.length === 0) {
      return NextResponse.json(
        { error: 'At least one carrier must be selected' },
        { status: 400 }
      );
    }

    // Save to Supabase
    const { data: quoteData, error: dbError } = await supabase
      .from('quote_requests')
      .insert({
        user_email: contact.email,
        user_phone: contact.phone,
        pickup_island: origin,
        delivery_island: destination,
        cargo_type: cargoType,
        weight_lbs: parseFloat(weight) || 0,
        length_inches: dimensions?.length ? parseFloat(dimensions.length) : null,
        width_inches: dimensions?.width ? parseFloat(dimensions.width) : null,
        height_inches: dimensions?.height ? parseFloat(dimensions.height) : null,
        selected_carriers: selectedCarriers,
        special_instructions: specialInstructions || null,
        status: 'pending',
        metadata: {
          shipping_type: shippingType,
          route_type: routeType,
          quantity: quantity || '1',
          carrier_specific_fields: carrierSpecificFields,
          notification_preference: contact.notificationPref
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save quote request' },
        { status: 500 }
      );
    }

    // Format carrier names for email
    const carrierNames = selectedCarriers.map((key: string) => {
      const carrierMap: { [key: string]: string } = {
        youngBrothers: 'Young Brothers',
        matson: 'Matson Navigation',
        pasha: 'Pasha Hawaii',
        fedex: 'FedEx Cargo',
        ups: 'UPS Cargo',
        alohaAir: 'Aloha Air Cargo',
        hawaiianAir: 'Hawaiian Air Cargo',
        hawaiiAir: 'Hawaii Air Cargo',
        pacificAir: 'Pacific Air Cargo',
        dhx: 'DHX (Dependable Hawaiian Express)'
      };
      return carrierMap[key] || key;
    }).join(', ');

    // Send confirmation email
    try {
      await resend.emails.send({
        from: '808 Freight <quotes@808freight.com>',
        to: contact.email,
        subject: '🚢 Your Quote Request Has Been Received - 808 Freight',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f0f4f8; }
              .container { max-width: 600px; margin: 0 auto; background: white; }
              .header { background: linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%); padding: 30px; text-align: center; }
              .header img { max-width: 150px; }
              .header h1 { color: #00d4ff; margin: 15px 0 0; font-size: 24px; }
              .content { padding: 30px; }
              .success-badge { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 25px; border-radius: 8px; text-align: center; margin-bottom: 25px; }
              .success-badge h2 { margin: 0; font-size: 20px; }
              .details-box { background: #f8fafc; border-left: 4px solid #00d4ff; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
              .detail-row:last-child { border-bottom: none; }
              .detail-label { color: #64748b; font-weight: 500; }
              .detail-value { color: #1e293b; font-weight: 600; }
              .carriers-list { background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 15px; }
              .carriers-list h4 { color: #1e40af; margin: 0 0 10px; }
              .next-steps { background: #fefce8; border: 1px solid #fde047; padding: 20px; border-radius: 8px; margin-top: 25px; }
              .next-steps h3 { color: #ca8a04; margin-top: 0; }
              .footer { background: #0a1628; color: #94a3b8; padding: 25px; text-align: center; font-size: 14px; }
              .footer a { color: #00d4ff; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>808 FREIGHT</h1>
                <p style="color: #94a3b8; margin: 5px 0 0;">Hawaii's Shipping Solution</p>
              </div>
              
              <div class="content">
                <div class="success-badge">
                  <h2>✅ Quote Request Received!</h2>
                </div>
                
                <p>Aloha! Thank you for choosing 808 Freight. We've received your quote request and are working on getting you the best rates from your selected carriers.</p>
                
                <div class="details-box">
                  <h3 style="margin-top: 0; color: #1e3a5f;">📦 Shipment Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Reference #</span>
                    <span class="detail-value">${quoteData.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Shipping Type</span>
                    <span class="detail-value">${shippingType === 'ocean' ? '🚢 Ocean Freight' : '✈️ Air Cargo'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">From</span>
                    <span class="detail-value">${origin}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">To</span>
                    <span class="detail-value">${destination}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Cargo Type</span>
                    <span class="detail-value">${cargoType}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Weight</span>
                    <span class="detail-value">${weight} lbs</span>
                  </div>
                  ${dimensions?.length ? `
                  <div class="detail-row">
                    <span class="detail-label">Dimensions</span>
                    <span class="detail-value">${dimensions.length}" × ${dimensions.width}" × ${dimensions.height}"</span>
                  </div>
                  ` : ''}
                  
                  <div class="carriers-list">
                    <h4>🏢 Carriers Requested</h4>
                    <p style="margin: 0; color: #1e3a5f;">${carrierNames}</p>
                  </div>
                </div>
                
                <div class="next-steps">
                  <h3>📋 What Happens Next?</h3>
                  <ol style="margin: 0; padding-left: 20px; color: #713f12;">
                    <li style="margin-bottom: 8px;">Our team reviews your request and contacts the selected carriers</li>
                    <li style="margin-bottom: 8px;">You'll receive quotes via ${contact.notificationPref === 'both' ? 'email and text' : contact.notificationPref === 'sms' ? 'text message' : 'email'}</li>
                    <li style="margin-bottom: 8px;">Compare rates and choose the best option for your shipment</li>
                    <li>We'll help coordinate your booking - no extra fees!</li>
                  </ol>
                  <p style="margin: 15px 0 0; font-weight: 600;">⏱️ Expected Response: 24-48 hours</p>
                </div>
                
                <p style="margin-top: 25px; color: #64748b;">Questions? Reply to this email or call us at <strong>(808) 555-0808</strong></p>
              </div>
              
              <div class="footer">
                <p>🌺 Mahalo for using 808 Freight!</p>
                <p style="margin: 10px 0 0;">Hawaii's ONLY free quote comparison tool for freight shipping</p>
                <p style="margin: 15px 0 0;"><a href="https://808freight.com">www.808freight.com</a></p>
              </div>
            </div>
          </body>
          </html>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the request if email fails - quote is still saved
    }

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
      quoteId: quoteData.id
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


