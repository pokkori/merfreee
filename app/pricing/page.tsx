import type { Metadata } from 'next';
import { CheckIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: '料金プラン | 越境アービトラージ',
  description: '越境アービトラージの料金プラン一覧。Free・Standard（月額1,980円）・Pro（月額4,980円）。7日間無料トライアル付き。AIお宝発掘・利益シミュレーター・Slack/メールアラートを活用して副業収入を最大化。',
  alternates: { canonical: 'https://ecross-arbitrage.vercel.app/pricing' },
};

const MONTHLY_PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    color: '#6B7280',
    features: [
      'お宝リスト 月3件閲覧',
      '8カテゴリ閲覧（件数制限あり）',
      '利益シミュレーター（1日3回）',
      'メール通知なし',
    ],
    cta: '無料で始める',
    ctaHref: '/signup',
  },
  {
    key: 'standard',
    name: 'Standard',
    price: 1980,
    color: '#00B4D8',
    recommended: true,
    features: [
      'お宝リスト 月50件閲覧',
      '8カテゴリ全閲覧',
      '利益シミュレーター（無制限）',
      'メールアラート',
      'freee CSV出力',
      'メルカリ/eBay価格差分析',
    ],
    cta: '7日間無料で試す',
    ctaHref: '/api/komoju/checkout?plan=standard',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 4980,
    color: '#E85D04',
    features: [
      'お宝リスト 無制限閲覧',
      '8カテゴリ全閲覧（優先更新）',
      'AIお宝自動発掘（毎日更新）',
      '利益シミュレーター（無制限）',
      'Slack/メールアラート',
      'freee CSV出力',
      'メルカリ/eBay価格差分析',
      '優先サポート',
    ],
    cta: '7日間無料で試す',
    ctaHref: '/api/komoju/checkout?plan=pro',
  },
];

const ANNUAL_PLANS = [
  {
    key: 'standard-annual',
    name: 'Standard 年間',
    monthlyEquiv: 1650,
    annualPrice: 19800,
    color: '#00B4D8',
    saving: '月2,376円お得（年間28,512円→19,800円）',
  },
  {
    key: 'pro-annual',
    name: 'Pro 年間',
    monthlyEquiv: 4150,
    annualPrice: 49800,
    color: '#E85D04',
    saving: '月830円お得（年間59,760円→49,800円）',
  },
];

export default function PricingPage() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #03045e 0%, #0077b6 50%, #03045e 100%)',
        padding: '64px 16px',
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1
            style={{
              color: 'white',
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 800,
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            料金プラン
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
            全プラン7日間無料トライアル付き。いつでもキャンセル可能。
          </p>
        </div>

        {/* 月額プランカード */}
        <section aria-label="月額プラン一覧" style={{ marginBottom: 64 }}>
          <h2
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 24,
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}
          >
            月額プラン
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {MONTHLY_PLANS.map((plan) => (
              <div
                key={plan.key}
                role="region"
                aria-label={`${plan.name}プラン${plan.price > 0 ? `：月額${plan.price.toLocaleString()}円` : '：無料'}`}
                style={{
                  position: 'relative',
                  background: 'rgba(15,23,42,0.82)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: plan.recommended
                    ? `2px solid ${plan.color}`
                    : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 20,
                  padding: 28,
                }}
              >
                {plan.recommended && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: -13,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: plan.color,
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 14px',
                      borderRadius: 12,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    最もご利用多数
                  </div>
                )}

                <h3 style={{ color: plan.color, fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
                  {plan.name}
                </h3>

                <div style={{ marginBottom: 20 }}>
                  {plan.price === 0 ? (
                    <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>無料</span>
                  ) : (
                    <>
                      <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>
                        {plan.price.toLocaleString()}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>円/月</span>
                    </>
                  )}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        marginBottom: 10,
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      <CheckIcon
                        aria-hidden="true"
                        style={{ width: 15, height: 15, color: plan.color, flexShrink: 0, marginTop: 2 }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.ctaHref}
                  aria-label={`${plan.name}プランを選ぶ${plan.price > 0 ? `（月額${plan.price.toLocaleString()}円・7日間無料）` : '（無料）'}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    minHeight: 44,
                    lineHeight: '44px',
                    background: plan.recommended ? plan.color : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: plan.recommended ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 年間プランカード */}
        <section aria-label="年間プラン一覧" style={{ marginBottom: 64 }}>
          <h2
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 24,
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}
          >
            年間プラン（2ヶ月分お得）
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {ANNUAL_PLANS.map((plan) => (
              <div
                key={plan.key}
                role="region"
                aria-label={`${plan.name}：年額${plan.annualPrice.toLocaleString()}円`}
                style={{
                  background: 'rgba(15,23,42,0.82)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid ${plan.color}55`,
                  borderRadius: 20,
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <h3 style={{ color: plan.color, fontSize: 16, fontWeight: 800 }}>{plan.name}</h3>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ color: 'white', fontSize: 32, fontWeight: 800 }}>
                      {plan.monthlyEquiv.toLocaleString()}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>円/月相当</span>
                  </div>
                  <p style={{ color: '#F59E0B', fontSize: 13, fontWeight: 600, margin: '4px 0 0' }}>
                    年額 {plan.annualPrice.toLocaleString()}円（一括払い）
                  </p>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>{plan.saving}</p>
                <a
                  href={`/api/komoju/checkout?plan=${plan.key}`}
                  aria-label={`${plan.name}を選ぶ（年額${plan.annualPrice.toLocaleString()}円）`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    minHeight: 44,
                    lineHeight: '44px',
                    background: `${plan.color}22`,
                    color: plan.color,
                    border: `1px solid ${plan.color}55`,
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: 'none',
                    marginTop: 4,
                  }}
                >
                  年間プランを選ぶ
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section
          aria-label="よくある質問"
          style={{
            background: 'rgba(15,23,42,0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 16,
            padding: '32px 28px',
          }}
        >
          <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
            よくある質問
          </h2>
          <dl style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <dt style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                無料トライアルはクレジットカードなしで使えますか？
              </dt>
              <dd style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                いいえ、KOMOJUによる決済登録が必要ですが、7日間は課金されません。期間内のキャンセルは無料です。
              </dd>
            </div>
            <div>
              <dt style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                いつでもキャンセルできますか？
              </dt>
              <dd style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                はい、設定画面からいつでもキャンセル可能です。次回更新日まで引き続きご利用いただけます。
              </dd>
            </div>
            <div>
              <dt style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                プランは途中で変更できますか？
              </dt>
              <dd style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                はい、設定の「プラン変更」からいつでもアップグレード・ダウングレードが可能です。
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
