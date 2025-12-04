import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Carrier name mapping (same as email route)
const CARRIER_NAMES: { [key: string]: string } = {
  youngBrothers: 'Young Brothers',
  matson: 'Matson Navigation',
  pasha: 'Pasha Hawaii',
  fedex: 'FedEx Cargo',
  ups: 'UPS Cargo',
  alohaAir: 'Aloha Air Cargo',
  hawaiianAir: 'Hawaiian Air Cargo',
  hawaiiAir: 'Hawaii Air Cargo',
  pacificAir: 'Pacific Air Cargo',
  dhx: 'DHX',
};

// Format phone number to E.164 format for Twilio
function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 1 and is 11 digits, it's already US format
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  // If it's 10 digits, assume US and add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // Otherwise return as-is with + prefix (might be international)
  return `+${cleaned}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      phone,
      name,
      type, // 'confirmation' | 'quote_received'
      origin,
      destination,
      selectedCarriers,
      carrierName,
      quoteDetails
    } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!TWILIO_PHONE_NUMBER) {
      console.error('TWILIO_PHONE_NUMBER not configured');
      return NextResponse.json(
        { success: false, error: 'SMS service not configured' },
        { status: 500 }
      );
    }

    const formattedPhone = formatPhoneNumber(phone);
    let messageBody = '';

    if (type === 'confirmation') {
      // Quote submission confirmation SMS
      const carrierList = selectedCarriers
        ?.map((c: string) => CARRIER_NAMES[c] || c)
        .join(', ') || 'N/A';
      
      messageBody = `🚢 808 Freight - Mahalo, ${name || 'Valued Customer'}!\n\n` +
        `Your quote request has been submitted!\n\n` +
        `📍 Route: ${origin} → ${destination}\n` +
        `📦 Carriers: ${carrierList}\n\n` +
        `We'll notify you as quotes come in. Response times vary by carrier.\n\n` +
        `Questions? Reply to this text or email admin@808freight.com`;
    } else if (type === 'quote_received') {
      // Quote received notification SMS
      messageBody = `🎉 808 Freight Quote Alert!\n\n` +
        `${carrierName} has responded to your quote request.\n\n` +
        `${quoteDetails ? `Details: ${quoteDetails}\n\n` : ''}` +
        `Check your email for full details, or reply CALL to request a callback.`;
    } else {
      // Generic message
      messageBody = body.message || '808 Freight notification';
    }

    // Send SMS via Twilio
    const message = await twilioClient.messages.create({
      body: messageBody,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`✅ SMS sent to ${formattedPhone}: ${message.sid}`);

    return NextResponse.json({ 
      success: true, 
      message: 'SMS sent successfully',
      sid: message.sid 
    });

  } catch (error: any) {
    console.error('SMS send error:', error);
    
    // Handle specific Twilio errors
    if (error.code === 21211) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }
    
    if (error.code === 21608) {
      return NextResponse.json(
        { success: false, error: 'Phone number not verified (Twilio trial)' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

