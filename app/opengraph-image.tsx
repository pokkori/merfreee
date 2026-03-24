import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '越境アービトラージ - AIが毎日発掘するお宝リスト';
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
          background: '#0F172A',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: '#F59E0B',
            display: 'flex',
          }}
        />

        {/* Main headline */}
        <div
          style={{
            color: '#F59E0B',
            fontSize: 72,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '24px',
          }}
        >
          AIが毎日発掘するお宝リスト
        </div>

        {/* Sub text */}
        <div
          style={{
            color: 'white',
            fontSize: 36,
            textAlign: 'center',
            marginBottom: '40px',
            fontWeight: 500,
          }}
        >
          eBay×メルカリ 価格差で稼ぐ
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginBottom: '40px',
          }}
        >
          {[
            { value: '2,400+', label: '登録ユーザー' },
            { value: '180%', label: '平均ROI' },
            { value: '毎日20件', label: '新着リスト' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: '#F59E0B', fontSize: 32, fontWeight: 700 }}>{stat.value}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Logo bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 48,
            color: '#F59E0B',
            fontSize: 24,
            fontWeight: 700,
            display: 'flex',
          }}
        >
          越境アービトラージ
        </div>

        {/* URL bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 48,
            color: 'rgba(255,255,255,0.4)',
            fontSize: 18,
            display: 'flex',
          }}
        >
          ecross-arbitrage.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
