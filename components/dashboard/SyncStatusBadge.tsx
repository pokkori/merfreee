'use client';

interface SyncStatusBadgeProps {
  lastSyncedAt: string | null;
  isActive: boolean;
}

export function SyncStatusBadge({ lastSyncedAt, isActive }: SyncStatusBadgeProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  if (!isActive) {
    return (
      <span
        aria-label="連携未設定"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: 'rgba(239,68,68,0.2)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)',
        }}
      >
        <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
        未連携
      </span>
    );
  }

  return (
    <span
      aria-label={`最終同期: ${lastSyncedAt ? formatDate(lastSyncedAt) : '未同期'}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
        background: 'rgba(16,185,129,0.2)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)',
      }}
    >
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
      {lastSyncedAt ? `最終同期: ${formatDate(lastSyncedAt)}` : '未同期'}
    </span>
  );
}
