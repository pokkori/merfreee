import Link from 'next/link';

export default function YayoiSettingsPage() {
  return (
    <div style={{ padding: 24 }}>
      <Link href="/dashboard" aria-label="ダッシュボードへ戻る" style={{ color: '#F59E0B', textDecoration: 'none' }}>
        ダッシュボードへ戻る
      </Link>
      <h1 style={{ color: 'white', marginTop: 16 }}>この機能は現在準備中です</h1>
    </div>
  );
}
