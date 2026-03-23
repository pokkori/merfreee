import Link from 'next/link';

export default function VerifyPage() {
  return (
    <div
      className="hero-gradient"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div className="glass-card-mid" style={{ width: '100%', maxWidth: 420, padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: 'rgba(16,185,129,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width={32} height={32} fill="none" stroke="#10B981" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0l-8 5-8-5" />
          </svg>
        </div>
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
          メールを確認してください
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 24, lineHeight: 1.7 }}>
          ログインリンクを送信しました。<br />
          メールボックスを確認してリンクをクリックしてください。
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24 }}>
          メールが届かない場合は、迷惑メールフォルダもご確認ください。
        </p>
        <Link
          href="/login"
          aria-label="ログインページへ戻る"
          style={{ color: '#00B4D8', textDecoration: 'none', fontSize: 14 }}
        >
          別のアドレスで試す
        </Link>
      </div>
    </div>
  );
}
