import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MerFreee - メルカリShops記帳自動化SaaS';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #03045e 0%, #0077b6 50%, #00b4d8 100%)',
          padding: '60px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: '#E85D04',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white', fontWeight: 900, fontSize: 40, fontFamily: 'monospace' }}>M</span>
          </div>
          <span style={{ color: 'white', fontSize: 48, fontWeight: 800 }}>MerFreee</span>
        </div>

        {/* Main text */}
        <div
          style={{
            color: 'white',
            fontSize: 52,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '20px',
          }}
        >
          メルカリShopsの記帳、
          <br />全部自動化
        </div>

        {/* Sub text */}
        <div
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 24,
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          インボイス対応・弥生・freee両対応。月980円から。
        </div>

        {/* Badge */}
        <div
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 40,
            padding: '12px 32px',
            color: 'white',
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          14日間無料トライアル
        </div>
      </div>
    ),
    { ...size }
  );
}
