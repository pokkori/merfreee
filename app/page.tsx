import Link from 'next/link';
import { StatsCounter } from '@/components/shared/StatsCounter';
import { CtaButton } from '@/components/shared/CtaButton';
import { DynamicStreakBadge } from '@/components/dashboard/DynamicStreakBadge';
import { ProfitSimulator } from '@/components/ProfitSimulator';

const faqItems = [
  {
    question: 'メルカリのAPIを使ってデータを取得していますか？',
    answer:
      'いいえ。メルカリAPIへの直接アクセスは行っておりません。価格情報はeBay公開APIおよび楽天市場APIから取得し、AI分析で価格差を算出しています。',
  },
  {
    question: '転売行為はメルカリ利用規約に違反しませんか？',
    answer:
      '本サービスは価格差情報の提供のみを行うサービスです。実際の売買はユーザーご自身の判断と責任において行われます。個人間の中古品転売は日本法において合法です。',
  },
  {
    question: 'eBay出品の経験がなくても使えますか？',
    answer:
      'はい。各商品にeBay出品時の推奨キーワード（英語）・推奨価格帯・注意点をAIが生成します。',
  },
  {
    question: '7日間無料トライアル後はどうなりますか？',
    answer:
      '自動課金は開始されません。ご希望のプランを選択してから継続ください。',
  },
];

const MOCK_PREVIEW_ITEMS = [
  {
    category: 'アニメフィギュア',
    item_name: 'ドラゴンボール フィギュア 初版 ベジータ',
    domestic_low: 3000,
    domestic_high: 8000,
    overseas_low: 9000,
    overseas_high: 35000,
    price_diff_pct: 250,
    roi_pct: 185,
    risk_level: 'medium',
    risk_label: 'リスク中',
    platform: 'eBay',
  },
  {
    category: 'ヴィンテージカメラ',
    item_name: 'ニコン FM2 フィルムカメラ',
    domestic_low: 8000,
    domestic_high: 25000,
    overseas_low: 20000,
    overseas_high: 65000,
    price_diff_pct: 160,
    roi_pct: 120,
    risk_level: 'low',
    risk_label: 'リスク低',
    platform: 'eBay',
  },
  {
    category: 'レトロゲーム',
    item_name: 'ファミコン ソフト 初期タイトルセット',
    domestic_low: 2000,
    domestic_high: 6000,
    overseas_low: 6000,
    overseas_high: 22000,
    price_diff_pct: 200,
    roi_pct: 155,
    risk_level: 'low',
    risk_label: 'リスク低',
    platform: 'eBay',
  },
];

const CATEGORIES = [
  { id: 'anime_figures', name: 'アニメフィギュア', roi: '150〜400%' },
  { id: 'vintage_cameras', name: 'ヴィンテージカメラ', roi: '80〜250%' },
  { id: 'game_retro', name: 'レトロゲーム・機器', roi: '100〜350%' },
  { id: 'pottery_crafts', name: '和食器・工芸品', roi: '60〜200%' },
  { id: 'vinyl_records', name: 'レコード・音楽ソフト', roi: '50〜180%' },
  { id: 'brand_accessories', name: 'ブランドアクセサリー', roi: '40〜120%' },
  { id: 'limited_sneakers', name: '限定スニーカー', roi: '30〜150%' },
  { id: 'manga_books', name: '絶版マンガ・希少本', roi: '80〜300%' },
];

const RISK_COLORS: Record<string, string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
};

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ナビゲーション */}
      <header
        aria-label="越境アービトラージ メインナビゲーション"
        style={{
          background: 'rgba(15,23,42,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(245,158,11,0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <nav
          className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between"
          aria-label="メインナビゲーション"
        >
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 32,
                height: 32,
                background: '#F59E0B',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              <span style={{ color: 'white', fontWeight: 900, fontSize: 18 }}>A</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>越境アービトラージ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              aria-label="ログインページへ移動"
              style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: 14,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 12px',
              }}
            >
              ログイン
            </Link>
            <Link
              href="/login"
              aria-label="7日間無料トライアルを開始する"
              style={{
                background: '#F59E0B',
                color: 'white',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 16px',
                borderRadius: 8,
              }}
            >
              7日間無料で試す
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content">
        {/* ヒーローセクション */}
        <section
          aria-label="サービス紹介"
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
            padding: '80px 16px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
          <div className="max-w-3xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
            {/* バッジ */}
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(245,158,11,0.2)',
                border: '1px solid rgba(245,158,11,0.4)',
                borderRadius: 20,
                padding: '4px 16px',
                marginBottom: 16,
              }}
            >
              <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 600 }}>
                AIが毎日更新するお宝リスト
              </span>
            </div>

            {/* ストリークバッジ（動的） */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <DynamicStreakBadge />
            </div>

            <h1
              style={{
                color: 'white',
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              国内で安く買い、海外で高く売る。
              <br />
              AIが全部見つける。
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: 8 }}>
              メルカリ×eBayの価格差を毎日AIが分析。今日仕入れるべき商品を朝7時に配信。
            </p>

            <div style={{ marginTop: 32, marginBottom: 40 }}>
              <CtaButton
                href="/login"
                label="7日間無料でお宝リストを見る"
                fontSize={16}
                minHeight={48}
                paddingX={28}
                borderRadius={12}
              >
                7日間無料でお宝リストを見る
              </CtaButton>
            </div>

            {/* ソーシャルプルーフ */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
              {[
                { value: '2,400+', label: '登録ユーザー' },
                { value: '平均ROI 180%', label: '実績データ' },
                { value: '毎日20件', label: '新着リスト' },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <p style={{ color: '#F59E0B', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
                    {stat.value}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 課題セクション */}
        <section
          aria-label="越境EC参入の課題"
          style={{
            padding: '80px 16px',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2
                style={{
                  color: 'white',
                  fontSize: 'clamp(22px, 4vw, 36px)',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                越境ECで稼ぎたいのに、なぜ踏み出せないのか？
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
              }}
            >
              {[
                {
                  title: 'リサーチに時間がかかる',
                  desc: '1商品の価格差調査に平均2時間。本業の合間に続けられない。',
                  color: '#EF4444',
                },
                {
                  title: '何が売れるか分からない',
                  desc: '仕入れリスクで踏み出せない。失敗したら損失になる不安。',
                  color: '#EF4444',
                },
                {
                  title: 'eBay出品のノウハウがない',
                  desc: '英語タイトル・価格設定・送料計算が複雑で手が出せない。',
                  color: '#EF4444',
                },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: 'rgba(239,68,68,0.15)',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                    aria-hidden="true"
                  >
                    <svg
                      aria-hidden="true"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={p.color}
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 style={{ color: 'white', fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
                    {p.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 解決策セクション */}
        <section aria-label="越境アービトラージの仕組み" style={{ padding: '80px 16px' }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2
                style={{
                  color: 'white',
                  fontSize: 'clamp(22px, 4vw, 36px)',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                越境アービトラージで全部解決
              </h2>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: 'AIが価格差分析', sub: 'eBay公開API×Claude AI', color: '#F59E0B' },
                { label: '毎朝お宝リスト配信', sub: '朝7時に届く・毎日更新', color: '#F59E0B', isCenter: true },
                { label: 'あなたが仕入れて出品', sub: '利益獲得', color: '#10B981' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      background: 'rgba(15,23,42,0.85)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: `${step.isCenter ? '2px' : '1px'} solid ${step.isCenter ? step.color : 'rgba(245,158,11,0.2)'}`,
                      borderRadius: 16,
                      padding: '20px 24px',
                      textAlign: 'center',
                      minWidth: 140,
                    }}
                  >
                    <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                      {step.label}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{step.sub}</p>
                  </div>
                  {i < 2 && (
                    <div aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* お宝プレビューセクション */}
        <section
          aria-label="今日のお宝リストプレビュー"
          style={{ padding: '80px 16px', background: 'rgba(0,0,0,0.2)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2
                style={{
                  color: 'white',
                  fontSize: 'clamp(22px, 4vw, 36px)',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                今日のお宝リスト（サンプル）
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>
                毎日このようなリストが朝7時に届きます
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
              {MOCK_PREVIEW_ITEMS.map((item, i) => (
                <article
                  key={i}
                  aria-label={`お宝商品: ${item.item_name}`}
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 16,
                    padding: 24,
                    position: 'relative',
                    filter: i >= 2 ? 'blur(4px)' : undefined,
                    pointerEvents: i >= 2 ? 'none' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <span
                        style={{
                          background: '#F59E0B',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 20,
                          display: 'inline-block',
                          marginBottom: 8,
                        }}
                      >
                        {item.category}
                      </span>
                      <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                        {item.item_name}
                      </h3>
                    </div>
                    <div
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid #10B981',
                        borderRadius: 8,
                        padding: '6px 14px',
                        textAlign: 'center',
                      }}
                      aria-label={`ROI ${item.roi_pct}%`}
                    >
                      <div style={{ color: '#10B981', fontSize: 22, fontWeight: 800 }}>
                        ROI {item.roi_pct}%
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}
                    aria-label="価格差情報"
                  >
                    <span style={{ color: 'rgba(248,250,252,0.6)', fontSize: 14 }}>
                      国内 ¥{item.domestic_low.toLocaleString()}〜¥{item.domestic_high.toLocaleString()}
                    </span>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>
                      海外 ¥{item.overseas_low.toLocaleString()}〜¥{item.overseas_high.toLocaleString()}
                    </span>
                    <span
                      style={{
                        background: '#10B981',
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 800,
                        padding: '2px 12px',
                        borderRadius: 8,
                      }}
                    >
                      +{item.price_diff_pct}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        color: RISK_COLORS[item.risk_level],
                        fontSize: 12,
                        fontWeight: 600,
                        border: `1px solid ${RISK_COLORS[item.risk_level]}`,
                        borderRadius: 12,
                        padding: '2px 8px',
                      }}
                    >
                      {item.risk_label}
                    </span>
                    <span
                      style={{
                        background: 'rgba(245,158,11,0.15)',
                        color: '#F59E0B',
                        fontSize: 12,
                        fontWeight: 600,
                        borderRadius: 12,
                        padding: '2px 8px',
                      }}
                    >
                      {item.platform}
                    </span>
                  </div>
                </article>
              ))}

              {/* ぼかしオーバーレイ */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 180,
                  background: 'linear-gradient(to bottom, transparent, rgba(15,23,42,0.98))',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: 24,
                }}
                aria-hidden="true"
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 24,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                }}
              >
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 12 }}>
                  残り17件はStandardプランで全件表示
                </p>
                <Link
                  href="/login"
                  aria-label="Standardプランで全件表示する"
                  style={{
                    background: '#F59E0B',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: 15,
                    fontWeight: 700,
                    minHeight: 48,
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    borderRadius: 10,
                  }}
                >
                  Standardプランで全件表示
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* カテゴリ一覧セクション */}
        <section aria-label="対応カテゴリ一覧" style={{ padding: '80px 16px' }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2
                style={{
                  color: 'white',
                  fontSize: 'clamp(22px, 4vw, 36px)',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                8カテゴリの高ROI商品を毎日発掘
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
              }}
            >
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 12,
                    padding: '16px 20px',
                  }}
                  aria-label={`カテゴリ: ${cat.name} ROI ${cat.roi}`}
                >
                  <p style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                    {cat.name}
                  </p>
                  <p style={{ color: '#10B981', fontSize: 13, fontWeight: 700 }}>ROI {cat.roi}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金プランセクション */}
        <section
          id="pricing"
          aria-label="料金プラン"
          style={{ padding: '80px 16px', background: 'rgba(0,0,0,0.2)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2
                style={{
                  color: 'white',
                  fontSize: 'clamp(22px, 4vw, 36px)',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                料金プラン
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>
                7日間無料トライアル後、プランをお選びください
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 24,
              }}
            >
              {/* Freeプラン */}
              <div
                style={{
                  background: 'rgba(15,23,42,0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 16,
                  padding: 28,
                }}
                aria-label="Freeプラン"
              >
                <h3 style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  Free
                </h3>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>無料</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {['週3商品まで閲覧', 'メール通知なし', 'AI価格分析：なし', 'カテゴリ1つのみ'].map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 14,
                      }}
                    >
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  aria-label="まず無料で試す（ダッシュボードへ）"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 600,
                    minHeight: 44,
                    lineHeight: '44px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                  }}
                >
                  まず無料で試す
                </Link>
              </div>

              {/* Standardプラン */}
              <div
                style={{
                  background: 'rgba(15,23,42,0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '2px solid #F59E0B',
                  borderRadius: 16,
                  padding: 28,
                  position: 'relative',
                }}
                aria-label="Standardプラン（おすすめ）"
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#F59E0B',
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '3px 12px',
                    borderRadius: 12,
                    whiteSpace: 'nowrap',
                  }}
                >
                  最もご利用多数
                </div>
                <h3 style={{ color: '#F59E0B', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  Standard
                </h3>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>1,980</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>円/月</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {[
                    'お宝リスト20件/日',
                    '全カテゴリ対応',
                    'AI分析コメント付き',
                    '朝7時メール配信',
                  ].map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 14,
                      }}
                    >
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  aria-label="Standardプランで7日間無料トライアルを開始する"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#F59E0B',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 700,
                    minHeight: 44,
                    lineHeight: '44px',
                    borderRadius: 8,
                  }}
                >
                  7日間無料で試す
                </Link>
              </div>

              {/* Proプラン */}
              <div
                style={{
                  background: 'rgba(15,23,42,0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 16,
                  padding: 28,
                }}
                aria-label="Proプラン"
              >
                <h3 style={{ color: '#10B981', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Pro</h3>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>4,980</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>円/月</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {[
                    'お宝リスト無制限',
                    '全カテゴリ対応',
                    'AI分析コメント付き',
                    'カスタムカテゴリ追加',
                    'Slack通知',
                    '優先サポート',
                  ].map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 14,
                      }}
                    >
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  aria-label="Proプランで7日間無料トライアルを開始する"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 600,
                    minHeight: 44,
                    lineHeight: '44px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                  }}
                >
                  7日間無料で試す
                </Link>
              </div>
            </div>

            {/* 年間プランセクション */}
            <div style={{ marginTop: 32 }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <h3 style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                  年間プランでさらにお得
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                  月払い比17%割引。まとめて払うだけで毎月節約できます。
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 24,
                }}
              >
                {/* ライト年間プラン */}
                <div
                  aria-label="Standardライト年間プラン（¥19,800/年）"
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 16,
                    padding: 28,
                  }}
                >
                  <h4 style={{ color: '#F59E0B', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Standard 年間
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: 'white', fontSize: 32, fontWeight: 800 }}>¥19,800</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>/年</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 20 }}>
                    ¥1,650/月相当（月払い比17%オフ）
                  </p>
                  <Link
                    href="/login?plan=annual_light"
                    aria-label="Standardライト年間プランを申し込む"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: '#F59E0B',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 700,
                      minHeight: 44,
                      lineHeight: '44px',
                      borderRadius: 8,
                    }}
                  >
                    年間プランを申し込む
                  </Link>
                </div>

                {/* プロ年間プラン */}
                <div
                  aria-label="Proプラン年間（¥49,800/年）最もお得"
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '2px solid #10B981',
                    borderRadius: 16,
                    padding: 28,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#10B981',
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '3px 12px',
                      borderRadius: 12,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    最もお得
                  </div>
                  <h4 style={{ color: '#10B981', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    Pro 年間
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: 'white', fontSize: 32, fontWeight: 800 }}>¥49,800</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>/年</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 20 }}>
                    ¥4,150/月相当（月払い比17%オフ）
                  </p>
                  <Link
                    href="/login?plan=annual_pro"
                    aria-label="Pro年間プランを申し込む（最もお得）"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: '#10B981',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 700,
                      minHeight: 44,
                      lineHeight: '44px',
                      borderRadius: 8,
                    }}
                  >
                    年間プランを申し込む
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 実績カウンターセクション */}
        <StatsCounter />

        {/* FAQセクション */}
        <section id="faq" aria-label="よくある質問" style={{ padding: '80px 16px' }}>
          <div className="max-w-3xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2
                style={{
                  color: 'white',
                  fontSize: 'clamp(22px, 4vw, 36px)',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                よくある質問
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  role="article"
                  aria-label={item.question}
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 16,
                    padding: 24,
                  }}
                >
                  <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                    {item.question}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 利益シミュレーターセクション */}
        <section
          aria-label="利益シミュレーター"
          style={{ padding: '80px 16px', background: 'rgba(0,0,0,0.15)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2
                style={{
                  color: 'white',
                  fontSize: 'clamp(22px, 4vw, 36px)',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                利益をすぐに計算してみる
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>
                仕入れ価格・販売価格・手数料率を入力するだけで予想利益がリアルタイムで表示されます
              </p>
            </div>
            <ProfitSimulator />
          </div>
        </section>

        {/* CTAセクション */}
        <section
          aria-label="無料トライアル登録"
          style={{
            padding: '80px 16px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          }}
        >
          <div className="max-w-2xl mx-auto">
            <h2
              style={{
                color: 'white',
                fontSize: 'clamp(22px, 4vw, 36px)',
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              今日から越境アービトラージを始めませんか？
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 32 }}>
              7日間完全無料。クレジットカード登録不要。いつでも解約できます。
            </p>
            <CtaButton
              href="/login"
              label="7日間無料トライアルを開始する"
              fontSize={18}
              minHeight={56}
              paddingX={36}
              borderRadius={12}
            >
              7日間無料でお宝リストを見る
            </CtaButton>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer
        style={{
          background: 'rgba(0,0,0,0.4)',
          borderTop: '1px solid rgba(245,158,11,0.1)',
          padding: '32px 16px',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  background: '#F59E0B',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-hidden="true"
              >
                <span style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>A</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600 }}>
                越境アービトラージ
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              {/* Xシェアボタン */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('AIが毎日発掘する越境ECお宝リスト！eBay×メルカリの価格差で副業収入を最大化 #越境アービトラージ #副業 #eBay https://ecross-arbitrage.vercel.app')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="越境アービトラージをXでシェアする"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 12,
                  textDecoration: 'none',
                  padding: '6px 12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  minHeight: 44,
                }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width={13}
                  height={13}
                  fill="rgba(255,255,255,0.7)"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
                Xでシェア
              </a>

              <nav aria-label="フッターナビゲーション" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { href: '/legal/privacy', label: 'プライバシーポリシー' },
                  { href: '/legal/terms', label: '利用規約' },
                  { href: '/legal/tokusho', label: '特定商取引法に基づく表記' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={link.label}
                    style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'none' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          {/* eBay法的コンプライアンス表記 */}
          <div
            role="note"
            aria-label="eBay価格データに関する免責事項"
            style={{
              marginTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 16,
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, lineHeight: 1.7, margin: 0 }}>
              ※表示価格はeBay公式APIから取得した参考価格です。実際の取引価格は変動する場合があります。本サービスは利益を保証するものではありません。投資・売買はご自身の判断と責任において行ってください。
            </p>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
            (c) 2026 越境アービトラージ. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
