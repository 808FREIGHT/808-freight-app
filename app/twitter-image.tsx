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
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* 808 Text */}
        <div
          style={{
            fontSize: 180,
            fontWeight: 900,
            color: '#000435',
            letterSpacing: '-5px',
            marginBottom: -30,
          }}
        >
          808
        </div>
        
        {/* Ship Icon (simplified) */}
        <div
          style={{
            fontSize: 80,
            marginBottom: -20,
          }}
        >
          🚢
        </div>
        
        {/* FREIGHT Text */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: '#000435',
            letterSpacing: '8px',
          }}
        >
          FREIGHT
        </div>
        
        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#1E9FD8',
            marginTop: 30,
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

