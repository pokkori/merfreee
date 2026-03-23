import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ background: '#03045E', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/" aria-label="トップページへ戻る" style={{ color: '#00B4D8', textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 24 }}>
          トップへ戻る
        </Link>
        <div className="glass-card-mid" style={{ padding: 40 }}>
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>プライバシーポリシー</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 32 }}>最終更新: 2026年3月23日</p>

          {[
            {
              title: '1. 収集する情報',
              content: 'MerFreee（以下「本サービス」）は、サービス提供のために以下の情報を収集します。\n・メールアドレス（アカウント認証用）\n・メルカリShopsの売上データ（会計連携のため）\n・お支払い情報（KOMOJU経由で処理、カード番号は保存しません）',
            },
            {
              title: '2. 情報の利用目的',
              content: '収集した個人情報は、以下の目的で利用します。\n・サービスの提供・改善\n・自動同期機能の実行\n・月次レポートの送信\n・お問い合わせへの対応',
            },
            {
              title: '3. 第三者への提供',
              content: '法令に基づく場合を除き、収集した個人情報を第三者に販売・提供することはありません。ただし、以下のサービス提供者（サブプロセッサー）に処理を委託する場合があります。\n・Supabase（データベース・認証）\n・Vercel（ホスティング）\n・KOMOJU（決済処理）\n・Resend（メール送信）',
            },
            {
              title: '4. データの保管',
              content: 'トークンやAPIキーはAES-256-GCM方式で暗号化してデータベースに保存します。アカウント削除時にはすべての個人データを30日以内に消去します。',
            },
            {
              title: '5. Cookieの使用',
              content: '本サービスは、セッション管理のためにCookieを使用します。ブラウザの設定からCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。',
            },
            {
              title: '6. お問い合わせ',
              content: 'プライバシーポリシーに関するお問い合わせは、support@merfreee.jp までご連絡ください。',
            },
          ].map((section) => (
            <div key={section.title} style={{ marginBottom: 28 }}>
              <h2 style={{ color: 'white', fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{section.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
