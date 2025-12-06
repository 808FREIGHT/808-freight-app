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
          background: '#000435',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Logo - white version using filter */}
        <img
          src="https://808freight.com/808-freight-logo-white.png"
          alt="808 FREIGHT"
          width={550}
          height={340}
          style={{
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
          }}
        />
        
        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#1E9FD8',
            marginTop: 25,
            letterSpacing: '2px',
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

