import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/" aria-label="トップページへ戻る" style={{ color: '#F59E0B', textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 24 }}>
          トップへ戻る
        </Link>
        <div
          style={{
            background: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 16,
            padding: 40,
          }}
        >
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>利用規約</h1>
          <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: 13, marginBottom: 32 }}>最終更新: 2026年3月24日</p>

          {[
            {
              title: '第1条（サービスの内容）',
              content: '越境アービトラージ（以下「本サービス」）は、国内外の商品価格差情報リストを有料配信するSaaSサービスです。本サービスは価格差情報の提供のみを行い、メルカリAPIへの直接アクセス・スクレイピングは行いません。価格情報はeBay公開APIおよび楽天市場APIから取得し、AI分析で価格差を算出しています。',
            },
            {
              title: '第2条（合法性・免責）',
              content: '本サービスは、eBay公開API・楽天市場API等の合法的な公開APIのみを利用した価格差情報の提供サービスです。\n・実際の売買行為はユーザーご自身の判断と責任において行われます。\n・転売に関する各プラットフォーム（メルカリ・eBay・Etsy等）の利用規約はユーザー自身がご確認ください。\n・個人間の中古品転売は日本法において合法です（古物営業法に基づく古物商許可が必要な場合を除く）。\n・本サービスは情報提供のみを目的とし、特定商品の購入・転売を推奨するものではありません。',
            },
            {
              title: '第3条（利用資格）',
              content: '本サービスは、越境ECや副業・輸出転売に関心のある日本在住の成人を対象としています。未成年者が利用する場合は保護者の同意が必要です。',
            },
            {
              title: '第4条（料金・お支払い）',
              content: '7日間の無料トライアル後、選択したプランの月額料金が発生します。料金はKOMOJUを通じてクレジットカードにて毎月自動引き落としとなります。\n・Freeプラン: 無料\n・Standardプラン: 月額1,980円（税込）\n・Proプラン: 月額4,980円（税込）',
            },
            {
              title: '第5条（禁止事項）',
              content: '以下の行為を禁止します。\n・不正アクセス・システムへの攻撃\n・他のユーザーへの迷惑行為\n・本サービスの転売・再配布\n・虚偽情報の登録\n・本サービスの価格差情報を無断で第三者に再販売する行為',
            },
            {
              title: '第6条（免責事項）',
              content: '本サービスの利用により生じた損害について、当社は法令上許容される限度において責任を負いません。提供する価格差情報は参考情報であり、実際の取引結果を保証するものではありません。価格変動・在庫状況・各プラットフォームの規約変更等による損失については免責とします。',
            },
            {
              title: '第7条（解約）',
              content: 'ユーザーはいつでもダッシュボードのプラン管理画面から解約できます。解約は翌月以降に有効となり、解約月末まで引き続きサービスをご利用いただけます。',
            },
            {
              title: '第8条（準拠法・管轄）',
              content: '本規約は日本法に準拠します。本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。',
            },
          ].map((section) => (
            <div key={section.title} style={{ marginBottom: 28 }}>
              <h2 style={{ color: 'white', fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{section.title}</h2>
              <p style={{ color: 'rgba(248,250,252,0.65)', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
