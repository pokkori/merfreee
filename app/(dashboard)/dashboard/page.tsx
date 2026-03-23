import { KpiCard } from '@/components/dashboard/KpiCard';
import { SyncStatusBadge } from '@/components/dashboard/SyncStatusBadge';
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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SyncStatusBadge lastSyncedAt="2026-03-23T00:00:00Z" isActive={true} />
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
        <div className="glass-card-mid" style={{ padding: 0, overflow: 'hidden' }}>
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
