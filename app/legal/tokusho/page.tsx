import Link from 'next/link';

export default function TokushoPage() {
  return (
    <div style={{ background: '#03045E', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/" aria-label="トップページへ戻る" style={{ color: '#00B4D8', textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 24 }}>
          トップへ戻る
        </Link>
        <div className="glass-card-mid" style={{ padding: 40 }}>
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>特定商取引法に基づく表記</h1>

          <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="特定商取引法表記">
            <tbody>
              {[
                { label: '販売業者', value: '越境アービトラージ運営者' },
                { label: '所在地', value: '請求があった場合は遅滞なく開示します' },
                { label: '電話番号', value: '請求があった場合は遅滞なく開示します' },
                { label: 'メールアドレス', value: 'support@ecross-arbitrage.vercel.app' },
                { label: '運営統括責任者', value: '越境アービトラージ運営責任者' },
                { label: '役務内容', value: 'メルカリ×eBay価格差情報サービス。AIが毎日発掘する越境EC価格差情報リストの提供、eBay出品推奨データの配信。' },
                { label: '販売価格', value: 'Freeプラン: 無料\nStandardプラン: 月額1,980円（税込）\nProプラン: 月額4,980円（税込）' },
                { label: '販売価格以外の費用', value: 'インターネット接続費用等はお客様負担となります' },
                { label: '支払い方法', value: 'クレジットカード（VISA/MasterCard/JCB/AMEX）' },
                { label: '支払い時期', value: '毎月自動引き落とし（初回は契約日）' },
                { label: 'サービス提供時期', value: '決済完了後すぐにご利用いただけます' },
                { label: '返品・キャンセル', value: 'デジタルコンテンツの性質上、原則として返金はお受けできません。ただし、サービスに重大な瑕疵がある場合はご相談ください。' },
                { label: '解約方法', value: 'ダッシュボードのプラン管理画面からいつでも解約できます。解約月末まで引き続きご利用いただけます。' },
              ].map((row) => (
                <tr key={row.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th scope="row" style={{ padding: '16px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, width: '35%', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    {row.label}
                  </th>
                  <td style={{ padding: '16px 12px', color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {row.value}
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
