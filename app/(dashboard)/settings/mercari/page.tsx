import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

export default function MercariSettingsPage() {
  const mockActive = process.env.USE_MOCK_MERCARI === 'true';

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/settings" aria-label="連携設定ページへ戻る" style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ArrowLeftIcon aria-hidden="true" style={{ width: 20, height: 20 }} />
        </Link>
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>メルカリShops連携設定</h1>
      </div>

      {mockActive && (
        <div className="glass-card-mid" style={{ padding: 16, marginBottom: 24, border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.1)' }}>
          <p style={{ color: '#F59E0B', fontSize: 14, fontWeight: 600 }}>モードで動作中</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
            環境変数 USE_MOCK_MERCARI=true が設定されています。
            メルカリShops API審査期間中はモックデータでご利用いただけます。
          </p>
        </div>
      )}

      <div className="glass-card-mid" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>連携状態</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: mockActive ? '#F59E0B' : 'rgba(255,255,255,0.3)', display: 'inline-block' }} aria-hidden="true" />
          <span style={{ color: 'white', fontSize: 14 }}>
            {mockActive ? 'モックデータで動作中' : '未連携'}
          </span>
        </div>

        {!mockActive && (
          <a
            href="/api/mercari/auth"
            aria-label="メルカリShopsとの連携を開始するためにOAuth認証を行う"
            className="btn-primary"
            style={{ display: 'inline-flex', fontSize: 14 }}
          >
            メルカリShopsと連携する
          </a>
        )}
      </div>

      <div className="glass-card-mid" style={{ padding: 24 }}>
        <h2 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>API審査について</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7 }}>
          メルカリShops APIはパートナー申請が必要です。審査期間は通常2〜4週間です。
          審査通過後、クライアントIDとシークレットが発行されます。
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 12 }}>
          審査期間中もモックデータで全機能をお試しいただけます。
        </p>
      </div>
    </div>
  );
}
