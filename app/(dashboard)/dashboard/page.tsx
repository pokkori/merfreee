import { TreasureCard } from '@/components/dashboard/TreasureCard';
import { StreakBadge } from '@/components/dashboard/StreakBadge';
import { ShareProfitButton } from '@/components/dashboard/ShareProfitButton';
import { TreasureItem, SavedItem } from '@/types';

// モックデータ（Supabase未接続時フォールバック）
const MOCK_TREASURE_ITEMS: TreasureItem[] = [
  {
    id: '1',
    category: 'anime_figures',
    item_name: 'ドラゴンボール フィギュア 初版 ベジータ',
    domestic_price_low: 3000,
    domestic_price_high: 8000,
    overseas_price_low: 9000,
    overseas_price_high: 35000,
    price_diff_pct: 250,
    roi_pct: 185,
    recommended_platform: 'ebay',
    search_keywords: 'フィギュア ドラゴンボール 初版 ベジータ',
    ebay_keywords: 'dragon ball figure vegeta vintage japan',
    ai_comment: 'eBayでのドラゴンボール初版フィギュアは海外コレクター需要が高く、状態が良ければ高値が期待できます。',
    risk_level: 'medium',
    plan_required: 'free',
    valid_date: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    category: 'vintage_cameras',
    item_name: 'ニコン FM2 フィルムカメラ',
    domestic_price_low: 8000,
    domestic_price_high: 25000,
    overseas_price_low: 20000,
    overseas_price_high: 65000,
    price_diff_pct: 160,
    roi_pct: 120,
    recommended_platform: 'ebay',
    search_keywords: 'ニコン フィルムカメラ FM2',
    ebay_keywords: 'nikon fm2 film camera japan vintage',
    ai_comment: '欧米のカメラ愛好家からの需要が安定しています。動作確認済みのものが特に高値。',
    risk_level: 'low',
    plan_required: 'standard',
    valid_date: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    category: 'game_retro',
    item_name: 'ファミコン ソフト 初期タイトルセット',
    domestic_price_low: 2000,
    domestic_price_high: 10000,
    overseas_price_low: 8000,
    overseas_price_high: 40000,
    price_diff_pct: 300,
    roi_pct: 210,
    recommended_platform: 'ebay',
    search_keywords: 'ファミコン ソフト レトロゲーム 初期',
    ebay_keywords: 'famicom retro game japan vintage software',
    ai_comment: 'レトロゲームは世界的に人気急上昇中。箱・説明書付きは価格が2〜3倍になることも。',
    risk_level: 'low',
    plan_required: 'free',
    valid_date: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    category: 'vinyl_records',
    item_name: '山下達郎 レコード Ride On Time',
    domestic_price_low: 2000,
    domestic_price_high: 6000,
    overseas_price_low: 8000,
    overseas_price_high: 28000,
    price_diff_pct: 280,
    roi_pct: 195,
    recommended_platform: 'ebay',
    search_keywords: 'シティポップ レコード LP 山下達郎',
    ebay_keywords: 'tatsuro yamashita ride on time vinyl city pop japan',
    ai_comment: 'シティポップブームで海外での人気継続中。盤質が重要。',
    risk_level: 'medium',
    plan_required: 'standard',
    valid_date: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  },
];

const MOCK_SAVED_ITEMS: SavedItem[] = [];

async function fetchTreasureItems(): Promise<TreasureItem[]> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return MOCK_TREASURE_ITEMS;

    // 動的インポートでサーバー専用クライアントを使用
    const { createServerClient } = await import('@/lib/supabase/server');
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('treasure_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return MOCK_TREASURE_ITEMS;
    }

    return data as TreasureItem[];
  } catch {
    // Supabase未接続時はMOCKデータをフォールバック
    return MOCK_TREASURE_ITEMS;
  }
}

const CATEGORY_TABS = [
  { id: 'all', label: 'すべて' },
  { id: 'anime_figures', label: 'アニメフィギュア' },
  { id: 'vintage_cameras', label: 'カメラ' },
  { id: 'game_retro', label: 'レトロゲーム' },
  { id: 'vinyl_records', label: 'レコード' },
];

export default async function DashboardPage() {
  const streakCount = 3;
  const totalPoints = 80;
  const items = await fetchTreasureItems();

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            今日のお宝: {items.length}件
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            毎日朝7時に新着お宝リストを更新
          </p>
          <div style={{ marginTop: 8 }}>
            <StreakBadge streakCount={streakCount} totalPoints={totalPoints} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <ShareProfitButton savedItems={MOCK_SAVED_ITEMS} />
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('越境アービトラージでeBay×メルカリの価格差情報を活用中！AIが毎日お宝を発掘してくれます #越境アービトラージ #副業 https://ecross-arbitrage.vercel.app')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="越境アービトラージを使ったことをXにシェアする"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              padding: '6px 14px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              borderRadius: 8,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              minHeight: 44,
            }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width={14} height={14} fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
            Xでシェア
          </a>
        </div>
      </div>

      {/* Category filter tabs */}
      <nav aria-label="カテゴリフィルタ" style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            aria-label={`${tab.label}カテゴリのお宝を表示する`}
            aria-pressed={tab.id === 'all'}
            style={{
              background: tab.id === 'all' ? '#F59E0B' : 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1px solid ${tab.id === 'all' ? '#F59E0B' : 'rgba(245,158,11,0.2)'}`,
              borderRadius: 8,
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 16px',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Treasure cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 24,
        }}
        role="list"
        aria-label="今日のお宝リスト"
      >
        {items.map((item, index) => (
          <div key={item.id} role="listitem" style={{ position: 'relative' }}>
            {/* Free plan: 4件目以降はぼかしオーバーレイ */}
            {index >= 3 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'rgba(15,23,42,0.7)',
                  borderRadius: 16,
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                }}
                aria-label="このアイテムはStandardプラン以上でご覧いただけます"
              >
                <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
                  Standardプランで全件表示
                </p>
                <a
                  href="/pricing"
                  aria-label="プランをアップグレードしてすべてのお宝を見る"
                  style={{
                    background: '#F59E0B',
                    color: 'white',
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: 14,
                    minHeight: 44,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  プランを確認する
                </a>
              </div>
            )}
            <TreasureCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
