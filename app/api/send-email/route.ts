import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Format selected services
    let servicesText = '';
    if (selectedServices && selectedServices.size > 0) {
      servicesText = Array.from(selectedServices.entries())
        .map(([carrier, services]: [string, any]) => {
          return `${carrier}: ${Array.from(services).join(', ')}`;
        })
        .join('\n');
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1e3a8a; color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 48px; margin: 0;">808 FREIGHT</h1>
          <div style="width: 100%; height: 3px; background: linear-gradient(90deg, #1E9FD8, #39FF14, #1E9FD8); margin: 20px 0;"></div>
        </div>
        
        <h2 style="color: #39FF14; text-align: center;">MAHALO!</h2>
        <p style="text-align: center; font-size: 18px; color: #1E9FD8;">Your quote request has been submitted successfully!</p>
        
        <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #1E9FD8; margin-top: 0;">Quote Details:</h3>
          
          <p><strong>Company:</strong> ${companyName || 'N/A'}</p>
          <p><strong>Name:</strong> ${name || 'N/A'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          
          <hr style="border: 1px solid rgba(255, 255, 255, 0.2); margin: 20px 0;" />
          
          <p><strong>Shipping Type:</strong> ${shippingType}</p>
          <p><strong>Route:</strong> ${routeType}</p>
          <p><strong>From:</strong> ${origin}</p>
          <p><strong>To:</strong> ${destination}</p>
          
          <hr style="border: 1px solid rgba(255, 255, 255, 0.2); margin: 20px 0;" />
          
          <p><strong>Carriers Selected:</strong> ${selectedCarriers?.join(', ') || 'N/A'}</p>
          ${servicesText ? `<p><strong>Services:</strong><br/>${servicesText.replace(/\n/g, '<br/>')}</p>` : ''}
          
          <hr style="border: 1px solid rgba(255, 255, 255, 0.2); margin: 20px 0;" />
          
          <p><strong>Cargo Type:</strong> ${cargoType}</p>
          <p><strong>Weight:</strong> ${weight} lbs</p>
          <p><strong>Dimensions:</strong> ${length}" L x ${width}" W x ${height}" H</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
        </div>
        
        <div style="background-color: #39FF14; color: #1e3a8a; padding: 15px; border-radius: 10px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-weight: bold;">Quote response times vary by carrier.</p>
          <p style="margin: 10px 0 0 0;">You will receive your quotes via ${notificationPrefs} once carriers respond.</p>
        </div>
        
        <p style="text-align: center; color: #1E9FD8; margin-top: 30px;">
          Questions? Reply to this email or contact us directly.
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid rgba(255, 255, 255, 0.2);">
          <p style="color: #1E9FD8; margin: 0;">808 FREIGHT</p>
          <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin: 5px 0;">Hawaii's Shipping Solution</p>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: '808 Freight <onboarding@resend.dev>', // You'll change this to your domain later
      to: [email],
      subject: '✅ Your 808 Freight Quote Request - Confirmed!',
      html: emailHtml,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

