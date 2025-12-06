import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '808 FREIGHT - Compare Hawaii Shipping Quotes';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Logo */}
        <img
          src="https://808freight.com/808-freight-logo-white.png"
          alt="808 FREIGHT"
          width={600}
          height={370}
          style={{
            objectFit: 'contain',
          }}
        />
        
        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#1E9FD8',
            marginTop: 20,
            letterSpacing: '1px',
          }}
        >
          Compare Hawaii Shipping Quotes
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

