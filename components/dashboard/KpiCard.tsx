'use client';

import { DashboardStats } from '@/types';

interface KpiCardProps {
  stats: DashboardStats;
}

export function KpiCard({ stats }: KpiCardProps) {
  const kpis = [
    {
      label: '今日のお宝',
      value: `${stats.today_items_count}件`,
      sub: '毎朝7時更新',
    },
    {
      label: '保存済みアイテム',
      value: `${stats.saved_items_count}件`,
      sub: '仕入れ候補',
    },
    {
      label: '平均ROI',
      value: `${stats.avg_roi_pct}%`,
      sub: '価格差平均',
    },
    {
      label: 'ストリーク',
      value: `${stats.streak_count}日`,
      sub: `${stats.total_points}ポイント`,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 20,
      }}
    >
      {kpis.map((kpi, i) => (
        <div
          key={i}
          style={{
            background: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 16,
            padding: '20px 24px',
          }}
          role="region"
          aria-label={kpi.label}
        >
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>{kpi.label}</p>
          <p style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{kpi.value}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{kpi.sub}</p>
        </div>
      ))}
    </div>
  );
}
