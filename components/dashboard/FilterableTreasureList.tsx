'use client';

import { useState } from 'react';
import { TreasureItem } from '@/types';
import { TreasureCard } from './TreasureCard';

interface FilterableTreasureListProps {
  items: TreasureItem[];
}

const CATEGORY_TABS = [
  { id: 'all', label: 'すべて' },
  { id: 'anime_figures', label: 'アニメフィギュア' },
  { id: 'vintage_cameras', label: 'カメラ' },
  { id: 'game_retro', label: 'レトロゲーム' },
  { id: 'vinyl_records', label: 'レコード' },
  { id: 'pottery_crafts', label: '和食器・工芸品' },
  { id: 'brand_accessories', label: 'ブランドアクセサリー' },
  { id: 'limited_sneakers', label: '限定スニーカー' },
  { id: 'manga_books', label: '絶版マンガ' },
];

type SortKey = 'roi_desc' | 'profit_desc' | 'pricediff_desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'roi_desc', label: 'ROI高い順' },
  { value: 'profit_desc', label: '利益高い順' },
  { value: 'pricediff_desc', label: '価格差大きい順' },
];

function useSortedItems(items: TreasureItem[], sortKey: SortKey): TreasureItem[] {
  return [...items].sort((a, b) => {
    if (sortKey === 'roi_desc') return b.roi_pct - a.roi_pct;
    if (sortKey === 'profit_desc') {
      const profitA = a.overseas_price_low - a.domestic_price_high;
      const profitB = b.overseas_price_low - b.domestic_price_high;
      return profitB - profitA;
    }
    if (sortKey === 'pricediff_desc') return b.price_diff_pct - a.price_diff_pct;
    return 0;
  });
}

export function FilterableTreasureList({ items }: FilterableTreasureListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('roi_desc');

  const filteredItems =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const sortedItems = useSortedItems(filteredItems, sortKey);

  const handleSave = (itemId: string) => {
    if (typeof window === 'undefined') return;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    try {
      const raw = localStorage.getItem('ecross_saved_items') || '[]';
      const saved: (TreasureItem & { savedAt: string })[] = JSON.parse(raw);
      if (!saved.find((s) => s.id === itemId)) {
        saved.push({ ...item, savedAt: new Date().toISOString() });
        localStorage.setItem('ecross_saved_items', JSON.stringify(saved));
      }
    } catch {
      // localStorage 利用不可時は無視
    }
  };

  // 実在カテゴリのみタブを表示
  const presentCategories = new Set<string>(items.map((i) => i.category));
  const visibleTabs = CATEGORY_TABS.filter(
    (t) => t.id === 'all' || presentCategories.has(t.id)
  );

  return (
    <div>
      {/* フィルタ + ソート行 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Category filter tabs */}
        <nav
          aria-label="カテゴリフィルタ"
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}
        >
        {visibleTabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              aria-label={`${tab.label}カテゴリのお宝を表示する`}
              aria-pressed={isActive}
              style={{
                background: isActive ? '#F59E0B' : 'rgba(15,23,42,0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${isActive ? '#F59E0B' : 'rgba(245,158,11,0.2)'}`,
                borderRadius: 8,
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                padding: '8px 16px',
                cursor: 'pointer',
                minHeight: 44,
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
        </nav>

        {/* ソートドロップダウン */}
        <div style={{ flexShrink: 0 }}>
          <label
            htmlFor="sort-select"
            style={{
              display: 'block',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            並び替え
          </label>
          <select
            id="sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="お宝リストの並び替えを選択"
            style={{
              background: 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 8,
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 12px',
              minHeight: 44,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#0F172A' }}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

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
        {sortedItems.map((item, index) => (
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
                <svg
                  aria-hidden="true"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <p
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
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
            <TreasureCard item={item} onSave={handleSave} />
          </div>
        ))}
      </div>

      {sortedItems.length === 0 && (
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            textAlign: 'center',
            padding: '48px 0',
          }}
        >
          このカテゴリのお宝はまだありません
        </p>
      )}
    </div>
  );
}
