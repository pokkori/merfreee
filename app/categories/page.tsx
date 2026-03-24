import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'カテゴリ一覧 | 越境アービトラージ',
  description: '越境アービトラージが対応する8カテゴリ（家電・ファッション・ホビー・スポーツ・おもちゃ・美容・ホーム・書籍）。各カテゴリの平均ROIとリスクレベルを確認して、最適な商品選定に活用。',
  alternates: { canonical: 'https://ecross-arbitrage.vercel.app/categories' },
};

const CATEGORIES = [
  {
    key: 'electronics',
    label: '家電・電子機器',
    description: '日本製の中古家電・ゲーム機・カメラは海外需要が高く、安定した利益を確保しやすいカテゴリです。型落ちモデルでも高値がつくことがあります。',
    avgRoi: 85,
    riskLevel: '低',
    riskColor: '#10B981',
    exampleItems: ['ゲーム機・周辺機器', 'デジタルカメラ', '生活家電（未使用品）'],
    updateFreq: '毎日更新',
  },
  {
    key: 'fashion',
    label: 'ファッション・衣類',
    description: '日本ブランドのヴィンテージ古着、ストリートウェア、スニーカーは北米・欧州で高い人気。状態のよい商品は高ROIが期待できます。',
    avgRoi: 120,
    riskLevel: '中',
    riskColor: '#F59E0B',
    exampleItems: ['ヴィンテージ古着', 'スニーカー', '日本ブランドウェア'],
    updateFreq: '毎日更新',
  },
  {
    key: 'hobby',
    label: 'ホビー・コレクション',
    description: 'プラモデル・フィギュア・アニメグッズは世界的な需要があります。絶版品・限定品は特に高値での取引事例が多いカテゴリです。',
    avgRoi: 200,
    riskLevel: '低',
    riskColor: '#10B981',
    exampleItems: ['ガンプラ・プラモデル', 'アニメフィギュア', '絶版トレカ'],
    updateFreq: '毎日更新',
  },
  {
    key: 'sports',
    label: 'スポーツ・アウトドア',
    description: '日本の登山・釣り・スキー用品はアジア圏での評価が高め。国内で安く入手できる専門ブランド品に注目です。',
    avgRoi: 70,
    riskLevel: '中',
    riskColor: '#F59E0B',
    exampleItems: ['登山用品（国産ブランド）', '釣り具', 'スキー・スノーボード'],
    updateFreq: '週3回更新',
  },
  {
    key: 'toys',
    label: 'おもちゃ・ゲーム',
    description: '日本製の知育玩具・ボードゲーム・ぬいぐるみは海外で根強い人気。ディズニーやキャラクター限定品は特に高需要です。',
    avgRoi: 150,
    riskLevel: '低',
    riskColor: '#10B981',
    exampleItems: ['絶版おもちゃ', '限定キャラクターグッズ', '日本製ボードゲーム'],
    updateFreq: '毎日更新',
  },
  {
    key: 'beauty',
    label: '美容・コスメ',
    description: '日本のスキンケア・コスメブランドはアジア圏で絶大な信頼。並行輸入品の需要が高く、定価以上の取引も見られます。',
    avgRoi: 60,
    riskLevel: '高',
    riskColor: '#EF4444',
    exampleItems: ['日本製スキンケア', '国内限定コスメ', '美容家電'],
    updateFreq: '週2回更新',
    riskNote: '使用期限・輸出規制に注意が必要',
  },
  {
    key: 'home',
    label: 'ホーム・インテリア',
    description: '日本の食器・生活雑貨・工芸品はMinimalism・Japandiブームで欧米需要が急拡大。職人技の伝統工芸品は高単価案件も多数。',
    avgRoi: 95,
    riskLevel: '低',
    riskColor: '#10B981',
    exampleItems: ['有田焼・波佐見焼', '南部鉄器', 'こけし・工芸品'],
    updateFreq: '週3回更新',
  },
  {
    key: 'books',
    label: '本・漫画・雑誌',
    description: '日本の漫画・アート本・デザイン書は海外コレクターの需要が継続的。絶版本・初版本は特にプレミア価格になりやすいカテゴリです。',
    avgRoi: 110,
    riskLevel: '低',
    riskColor: '#10B981',
    exampleItems: ['絶版漫画・初版本', 'アート・写真集', '日本語学習本'],
    updateFreq: '週2回更新',
  },
];

function RiskBadge({ level, color }: { level: string; color: string }) {
  return (
    <span
      aria-label={`リスクレベル: ${level}`}
      style={{
        display: 'inline-block',
        background: `${color}22`,
        color: color,
        border: `1px solid ${color}55`,
        borderRadius: 6,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      リスク: {level}
    </span>
  );
}

export default function CategoriesPage() {
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
              fontSize: 'clamp(26px, 5vw, 42px)',
              fontWeight: 800,
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            対応カテゴリ一覧
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
            AIが毎日価格差をスキャンする8カテゴリ。平均ROIとリスクレベルを参考に商品選定を最適化してください。
          </p>
        </div>

        {/* カテゴリグリッド */}
        <section aria-label="カテゴリ一覧" style={{ marginBottom: 48 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {CATEGORIES.map((cat) => (
              <article
                key={cat.key}
                aria-label={`${cat.label}カテゴリ - 平均ROI ${cat.avgRoi}%`}
                style={{
                  background: 'rgba(15,23,42,0.82)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 18,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {/* カテゴリ名 + バッジ */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <h2 style={{ color: '#F59E0B', fontSize: 16, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
                    {cat.label}
                  </h2>
                  <RiskBadge level={cat.riskLevel} color={cat.riskColor} />
                </div>

                {/* 平均ROI */}
                <div
                  style={{
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>平均ROI</span>
                  <span
                    aria-label={`平均ROI ${cat.avgRoi}パーセント`}
                    style={{ color: '#F59E0B', fontSize: 24, fontWeight: 800 }}
                  >
                    {cat.avgRoi}%
                  </span>
                </div>

                {/* 説明文 */}
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                  {cat.description}
                </p>

                {/* リスク注記 */}
                {cat.riskNote && (
                  <p
                    style={{
                      color: '#EF4444',
                      fontSize: 12,
                      margin: 0,
                      padding: '6px 10px',
                      background: 'rgba(239,68,68,0.08)',
                      borderRadius: 6,
                      border: '1px solid rgba(239,68,68,0.2)',
                    }}
                  >
                    注意: {cat.riskNote}
                  </p>
                )}

                {/* 代表商品例 */}
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em' }}>
                    商品例
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {cat.exampleItems.map((item) => (
                      <li
                        key={item}
                        style={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: 13,
                          paddingLeft: 12,
                          borderLeft: '2px solid rgba(245,158,11,0.3)',
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 更新頻度 */}
                <p
                  style={{
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: 11,
                    margin: 0,
                    textAlign: 'right',
                  }}
                >
                  {cat.updateFreq}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div
          style={{
            textAlign: 'center',
            background: 'rgba(15,23,42,0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 16,
            padding: '40px 24px',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 20 }}>
            全8カテゴリのリアルタイム価格差情報を今すぐ確認
          </p>
          <a
            href="/pricing"
            aria-label="料金プランを確認してAIお宝リストを使う"
            style={{
              display: 'inline-block',
              background: '#F59E0B',
              color: 'white',
              padding: '14px 36px',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              minHeight: 44,
            }}
          >
            料金プランを見る
          </a>
        </div>
      </div>
    </main>
  );
}
