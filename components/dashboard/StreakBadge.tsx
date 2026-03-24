'use client';

interface StreakBadgeProps {
  streakCount: number;
  totalPoints: number;
}

export function StreakBadge({ streakCount, totalPoints }: StreakBadgeProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 12,
        padding: '8px 16px',
      }}
      aria-label={`ストリーク情報: ${streakCount}日連続ログイン、合計${totalPoints}ポイント`}
      role="status"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: 16 }}>
          {streakCount}日連続
        </span>
      </div>
      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span style={{ color: 'rgba(248,250,252,0.7)', fontSize: 14 }}>
          {totalPoints.toLocaleString()}pt
        </span>
      </div>
    </div>
  );
}
