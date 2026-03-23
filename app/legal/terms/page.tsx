import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ background: '#03045E', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/" aria-label="トップページへ戻る" style={{ color: '#00B4D8', textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 24 }}>
          トップへ戻る
        </Link>
        <div className="glass-card-mid" style={{ padding: 40 }}>
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>利用規約</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 32 }}>最終更新: 2026年3月23日</p>

          {[
            {
              title: '第1条（サービスの内容）',
              content: 'MerFreeeは、メルカリShopsの売上データを弥生会計Online・freee会計に自動連携するSaaSサービスです。インボイス制度に対応した適格請求書の自動生成機能も提供します。',
            },
            {
              title: '第2条（利用資格）',
              content: '本サービスは、日本国内でメルカリShopsを通じて事業を行う個人事業主および法人を対象としています。未成年者が利用する場合は保護者の同意が必要です。',
            },
            {
              title: '第3条（料金・お支払い）',
              content: '14日間の無料トライアル後、選択したプランの月額料金が発生します。料金はKOMOJUを通じてクレジットカードにて毎月自動引き落としとなります。',
            },
            {
              title: '第4条（禁止事項）',
              content: '以下の行為を禁止します。\n・不正アクセス・システムへの攻撃\n・他のユーザーへの迷惑行為\n・本サービスの転売・再配布\n・虚偽情報の登録',
            },
            {
              title: '第5条（免責）',
              content: '本サービスの利用により生じた損害について、当社は法令上許容される限度において責任を負いません。また、メルカリShops・弥生・freeeのAPIサービス停止により同期ができない場合の損害については免責とします。',
            },
            {
              title: '第6条（解約）',
              content: 'ユーザーはいつでもダッシュボードのプラン管理画面から解約できます。解約は翌月以降に有効となり、解約月末まで引き続きサービスをご利用いただけます。',
            },
            {
              title: '第7条（準拠法・管轄）',
              content: '本規約は日本法に準拠します。本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。',
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
