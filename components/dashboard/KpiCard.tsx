'use client';

import { KpiData } from '@/types';

interface KpiCardProps {
  data: KpiData;
}

function ShareButton({ savedMinutes }: { savedMinutes: number }) {
  const shareText = `MerFreeeで今月の記帳作業を${savedMinutes}分節約しました。メルカリShopsの記帳自動化なら #MerFreee`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://merfreee.vercel.app')}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`今月${savedMinutes}分節約をXでシェアする`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        minHeight: 44,
        padding: '8px 16px',
        borderRadius: 8,
        background: '#1DA1F2',
        color: 'white',
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      シェアする
    </a>
  );
}

export function KpiCard({ data }: KpiCardProps) {
  const kpis = [
    { label: '今月の売上', value: `¥${data.totalSales.toLocaleString()}`, sub: `${data.totalTransactions}件` },
    { label: '弥生同期済み', value: `${data.syncedToYayoi}件`, sub: `未同期: ${data.totalTransactions - data.syncedToYayoi}件` },
    { label: 'freee同期済み', value: `${data.syncedToFreee}件`, sub: `未同期: ${data.totalTransactions - data.syncedToFreee}件` },
    { label: '節約した記帳時間', value: `${data.savedMinutes}分`, sub: `取引数 × 5分` },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="glass-card-enhanced backdrop-blur-sm"
            style={{ padding: '20px 24px' }}
            role="region"
            aria-label={kpi.label}
          >
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>{kpi.label}</p>
            <p style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{kpi.value}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{kpi.sub}</p>
          </div>
        ))}
      </div>
      {data.savedMinutes > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ShareButton savedMinutes={data.savedMinutes} />
        </div>
      )}
    </div>
  );
}
