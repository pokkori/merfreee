import Link from 'next/link';

export default function TransactionsPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          保存済みアイテム
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          仕入れ候補として保存したお宝商品の一覧
        </p>
      </div>

      <div
        style={{
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 16,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 16 }}>
          まだアイテムが保存されていません。
        </p>
        <Link
          href="/dashboard"
          aria-label="ダッシュボードでお宝リストを確認する"
          style={{
            background: '#F59E0B',
            color: 'white',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 700,
            minHeight: 44,
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0 20px',
            borderRadius: 8,
          }}
        >
          お宝リストを見る
        </Link>
      </div>
    </div>
  );
}
