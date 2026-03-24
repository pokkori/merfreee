import { DynamicStreakBadge } from '@/components/dashboard/DynamicStreakBadge';
import { ShareProfitButton } from '@/components/dashboard/ShareProfitButton';
import { FilterableTreasureList } from '@/components/dashboard/FilterableTreasureList';
import { DashboardKpiClient } from '@/components/dashboard/DashboardKpiClient';
import { DailyMission } from '@/components/dashboard/DailyMission';
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
    return MOCK_TREASURE_ITEMS;
  }
}

async function fetchServerStats(items: TreasureItem[]) {
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = items.filter((i) => i.created_at.slice(0, 10) === today).length;

  const avgRoi =
    items.length > 0
      ? Math.round(items.reduce((sum, i) => sum + i.roi_pct, 0) / items.length)
      : 0;

  return {
    today_items_count: todayCount,
    avg_roi_pct: avgRoi,
    top_category: null as null,
  };
}

export default async function DashboardPage() {
  const items = await fetchTreasureItems();
  const serverStats = await fetchServerStats(items);

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
            <DynamicStreakBadge />
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

      {/* KPI カード（Client Component: 保存済み件数・ストリークはlocalStorageから取得） */}
      <DashboardKpiClient serverStats={serverStats} />

      {/* 今日のミッション（Client Component） */}
      <DailyMission />

      {/* カテゴリフィルタ＋カード一覧（Client Component） */}
      <FilterableTreasureList items={items} />
    </div>
  );
}
