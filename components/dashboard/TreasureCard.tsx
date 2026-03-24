'use client';

import { useState } from 'react';
import { TreasureItem } from '@/types';
import { PriceDiffBadge } from './PriceDiffBadge';
import { RoiAnimation } from './RoiAnimation';

interface TreasureCardProps {
  item: TreasureItem;
  onSave?: (itemId: string) => void;
}

const RISK_COLORS: Record<string, string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
};

const RISK_LABELS: Record<string, string> = {
  low: 'リスク低',
  medium: 'リスク中',
  high: 'リスク高',
};

const PLATFORM_LABELS: Record<string, string> = {
  ebay: 'eBay',
  etsy: 'Etsy',
  amazon_us: 'Amazon US',
  depop: 'Depop',
};

const CATEGORY_LABELS: Record<string, string> = {
  anime_figures: 'アニメフィギュア',
  vintage_cameras: 'ヴィンテージカメラ',
  game_retro: 'レトロゲーム',
  pottery_crafts: '和食器・工芸品',
  vinyl_records: 'レコード',
  brand_accessories: 'ブランドアクセサリー',
  limited_sneakers: '限定スニーカー',
  manga_books: '絶版マンガ',
};

export function TreasureCard({ item, onSave }: TreasureCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyKeywords = async () => {
    await navigator.clipboard.writeText(item.search_keywords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ebaySearchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.ebay_keywords)}`;

  return (
    <article
      style={{
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 16,
        padding: 24,
        position: 'relative',
      }}
      aria-label={`お宝商品: ${item.item_name}`}
    >
      {/* ROI badge top right */}
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <RoiAnimation targetValue={item.roi_pct} />
      </div>

      {/* Category tag */}
      <div style={{ marginBottom: 12 }}>
        <span
          style={{
            background: '#F59E0B',
            color: 'white',
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 20,
          }}
          aria-label={`カテゴリ: ${CATEGORY_LABELS[item.category] ?? item.category}`}
        >
          {CATEGORY_LABELS[item.category] ?? item.category}
        </span>
      </div>

      {/* Item name */}
      <h3
        style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 16,
          marginRight: 80,
          lineHeight: 1.4,
        }}
      >
        {item.item_name}
      </h3>

      {/* Price diff section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
        aria-label="価格差情報"
      >
        <div style={{ color: 'rgba(248,250,252,0.6)', fontSize: 14 }}>
          <span style={{ fontWeight: 600 }}>国内</span> ¥{item.domestic_price_low.toLocaleString()}〜¥{item.domestic_price_high.toLocaleString()}
        </div>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <div style={{ color: 'rgba(248,250,252,0.8)', fontSize: 14 }}>
          <span style={{ fontWeight: 600 }}>海外</span> ¥{item.overseas_price_low.toLocaleString()}〜¥{item.overseas_price_high.toLocaleString()}
        </div>
        <PriceDiffBadge priceDiffPct={item.price_diff_pct} />
      </div>

      {/* Risk and platform row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <span
          style={{
            color: RISK_COLORS[item.risk_level] ?? '#F59E0B',
            fontSize: 12,
            fontWeight: 600,
            border: `1px solid ${RISK_COLORS[item.risk_level] ?? '#F59E0B'}`,
            borderRadius: 12,
            padding: '2px 8px',
          }}
          aria-label={`リスクレベル: ${RISK_LABELS[item.risk_level] ?? item.risk_level}`}
        >
          {RISK_LABELS[item.risk_level] ?? item.risk_level}
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
          aria-label={`推奨プラットフォーム: ${PLATFORM_LABELS[item.recommended_platform] ?? item.recommended_platform}`}
        >
          {PLATFORM_LABELS[item.recommended_platform] ?? item.recommended_platform}
        </span>
      </div>

      {/* Search keywords */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: 'rgba(248,250,252,0.5)', fontSize: 12, marginBottom: 4 }}>メルカリ検索キーワード</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <code
            style={{
              color: 'rgba(248,250,252,0.8)',
              fontSize: 13,
              background: 'rgba(255,255,255,0.05)',
              padding: '4px 8px',
              borderRadius: 4,
              flex: 1,
            }}
          >
            {item.search_keywords}
          </code>
          <button
            onClick={handleCopyKeywords}
            aria-label="検索キーワードをコピーする"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              color: copied ? '#10B981' : 'rgba(248,250,252,0.7)',
              fontSize: 12,
              cursor: 'pointer',
              padding: '6px 12px',
              minHeight: 44,
              minWidth: 44,
            }}
          >
            {copied ? 'コピー済' : 'コピー'}
          </button>
        </div>
      </div>

      {/* AI comment */}
      {item.ai_comment && (
        <p
          style={{
            color: 'rgba(248,250,252,0.5)',
            fontSize: 14,
            fontStyle: 'italic',
            marginBottom: 16,
            lineHeight: 1.5,
          }}
          aria-label="AI分析コメント"
        >
          {item.ai_comment}
        </p>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => onSave?.(item.id)}
          aria-label={`${item.item_name}を保存する`}
          style={{
            background: '#F59E0B',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          保存
        </button>
        <a
          href={ebaySearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`eBayで${item.item_name}の相場を確認する（外部サイト）`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(248,250,252,0.8)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          eBayで相場確認
        </a>
      </div>
    </article>
  );
}
