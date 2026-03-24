'use client';

import { useState } from 'react';
import { SavedItem } from '@/types';

interface ShareProfitButtonProps {
  savedItems: SavedItem[];
}

function calculateEstimatedMonthlyProfit(savedItems: SavedItem[]): number {
  if (savedItems.length === 0) return 0;
  return savedItems.reduce((total, saved) => {
    const item = saved.treasure_item;
    if (!item) return total;
    // (domestic_price_low * 0.5) * (roi_pct / 100) * 4 の合計（月4回仕入れ想定）
    const profit = item.domestic_price_low * 0.5 * (item.roi_pct / 100) * 4;
    return total + profit;
  }, 0);
}

function generateCanvas(estimatedProfit: number, savedItems: SavedItem[]): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(null);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(null);
      return;
    }

    // 1. 背景
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 600, 400);

    // 2. トップバー
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, 0, 600, 6);

    // 3. タイトル
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('今月の利益見込み', 300, 80);

    // 4. 金額
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(`¥${Math.round(estimatedProfit).toLocaleString()}`, 300, 170);

    // 5. カテゴリ上位3件
    const topCategories = savedItems
      .slice(0, 3)
      .map((s) => s.treasure_item?.item_name ?? '')
      .filter(Boolean);

    ctx.fillStyle = 'white';
    ctx.font = '14px sans-serif';
    topCategories.forEach((name, i) => {
      ctx.fillText(name.slice(0, 30), 300, 230 + i * 28);
    });

    // 6. フッター
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '12px sans-serif';
    ctx.fillText('越境アービトラージ ecross-arbitrage.vercel.app', 300, 370);

    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export function ShareProfitButton({ savedItems }: ShareProfitButtonProps) {
  const [sharing, setSharing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleShare = async () => {
    if (savedItems.length === 0) {
      showToast('まず商品を保存してください');
      return;
    }

    setSharing(true);
    try {
      const estimatedProfit = calculateEstimatedMonthlyProfit(savedItems);
      const blob = await generateCanvas(estimatedProfit, savedItems);

      const text = `越境ECで今月の利益見込み${Math.round(estimatedProfit).toLocaleString()}円！\n\n#越境アービトラージ #副業\nhttps://ecross-arbitrage.vercel.app`;

      if (
        blob &&
        typeof navigator !== 'undefined' &&
        navigator.canShare?.({ files: [new File([blob], 'profit.png', { type: 'image/png' })] })
      ) {
        await navigator.share({
          files: [new File([blob], 'profit.png', { type: 'image/png' })],
          text,
        });
      } else if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ text });
      } else {
        // Xツイートフォールバック
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(tweetUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      // シェアキャンセル等は無視
    } finally {
      setSharing(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={handleShare}
        disabled={sharing}
        aria-label="今月の利益見込みをシェアする"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#F59E0B',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          cursor: sharing ? 'not-allowed' : 'pointer',
          minHeight: 44,
          opacity: sharing ? 0.7 : 1,
        }}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        {sharing ? 'シェア中...' : '今月の利益をシェア'}
      </button>

      {toastMessage && (
        <div
          role="alert"
          style={{
            position: 'absolute',
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 8,
            padding: '8px 16px',
            color: 'white',
            fontSize: 13,
            whiteSpace: 'nowrap',
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
