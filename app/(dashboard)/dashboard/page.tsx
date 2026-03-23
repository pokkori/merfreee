import { KpiCard } from '@/components/dashboard/KpiCard';
import { SyncStatusBadge } from '@/components/dashboard/SyncStatusBadge';
import { StreakBadge } from '@/components/dashboard/StreakBadge';
// streak tracking: updateStreak/loadStreak はStreakBadgeコンポーネント内で管理
import { KpiData } from '@/types';

// ダッシュボードはモックデータで表示（Supabase未接続時でも動作）
const mockKpiData: KpiData = {
  totalSales: 238700,
  totalTransactions: 20,
  totalFee: 13124,
  syncedToYayoi: 18,
  syncedToFreee: 15,
  savedMinutes: 100, // 20件 × 5分
};

export default function DashboardPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>ダッシュボード</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>2026年3月の売上サマリー</p>
          <div style={{ marginTop: 8 }}>
            <StreakBadge />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <SyncStatusBadge lastSyncedAt="2026-03-23T00:00:00Z" isActive={true} />
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("MerFreeeでメルカリShops×会計連携を自動化中！インボイス対応PDFも自動生成 #MerFreee #メルカリShops https://merfreee.vercel.app")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MerFreeeを使ったことをXにシェアする"
            style={{
              fontSize: 12,
              padding: '6px 14px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              borderRadius: 8,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              transition: 'background 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              minHeight: 44,
            }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width={14} height={14} fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
            Xでシェア
          </a>
          <form action="/api/sync" method="POST">
            <button
              type="submit"
              aria-label="メルカリShopsの売上データを今すぐ同期する"
              className="btn-primary"
              style={{ fontSize: 14, padding: '8px 16px' }}
            >
              今すぐ同期
            </button>
          </form>
        </div>
      </div>

      <KpiCard data={mockKpiData} />

      <div style={{ marginTop: 32 }}>
        <h2 style={{ color: 'white', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>最近の取引</h2>
        <div className="glass-card-enhanced backdrop-blur-sm" style={{ padding: 0, overflow: 'hidden' }}>
          <table
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}
            role="table"
            aria-label="最近の取引一覧"
          >
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['商品名', '金額', '税率', '販売日', '弥生', 'freee'].map((h) => (
                  <th key={h} scope="col" style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'ノートパソコン（テスト商品）', amount: 50000, taxRate: 10, soldAt: '2026-03-01', yayoi: true, freee: true },
                { name: 'デジタルカメラ（テスト商品）', amount: 35000, taxRate: 10, soldAt: '2026-03-10', yayoi: true, freee: false },
                { name: 'スマートウォッチ（テスト商品）', amount: 25000, taxRate: 10, soldAt: '2026-03-15', yayoi: false, freee: false },
              ].map((tx, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px', color: 'white' }}>{tx.name}</td>
                  <td style={{ padding: '12px 16px', color: 'white', fontWeight: 600 }}>¥{tx.amount.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)' }}>{tx.taxRate}%</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)' }}>{tx.soldAt}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span aria-label={tx.yayoi ? '弥生同期済み' : '弥生未同期'} style={{ color: tx.yayoi ? '#10B981' : '#F59E0B', fontSize: 12 }}>
                      {tx.yayoi ? '済' : '未'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span aria-label={tx.freee ? 'freee同期済み' : 'freee未同期'} style={{ color: tx.freee ? '#10B981' : '#F59E0B', fontSize: 12 }}>
                      {tx.freee ? '済' : '未'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
