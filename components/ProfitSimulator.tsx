'use client';

import { useState } from 'react';

export function ProfitSimulator() {
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [feeRate, setFeeRate] = useState<number>(13);

  const fee = sellingPrice * (feeRate / 100);
  const profit = sellingPrice - fee - purchasePrice;
  const isPositive = profit > 0;
  const profitColor = isPositive ? '#10B981' : profit < 0 ? '#EF4444' : 'rgba(255,255,255,0.6)';

  return (
    <section
      aria-label="利益シミュレーター"
      style={{
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 16,
        padding: 28,
        maxWidth: 640,
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          color: 'white',
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        利益シミュレーター
      </h2>
      <p
        style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: 13,
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        仕入れ価格・販売価格・手数料率を入力するとリアルタイムで予想利益を計算します
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* 仕入れ価格 */}
        <div>
          <label
            htmlFor="purchase-price"
            style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6 }}
          >
            仕入れ価格（円）
          </label>
          <input
            id="purchase-price"
            type="number"
            min={0}
            value={purchasePrice || ''}
            onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
            aria-label="仕入れ価格を入力（円）"
            placeholder="例: 3000"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 8,
              padding: '10px 12px',
              color: 'white',
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box',
              minHeight: 44,
            }}
          />
        </div>

        {/* 販売価格 */}
        <div>
          <label
            htmlFor="selling-price"
            style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6 }}
          >
            販売価格（円）
          </label>
          <input
            id="selling-price"
            type="number"
            min={0}
            value={sellingPrice || ''}
            onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
            aria-label="販売価格を入力（円）"
            placeholder="例: 9000"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 8,
              padding: '10px 12px',
              color: 'white',
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box',
              minHeight: 44,
            }}
          />
        </div>

        {/* 手数料率 */}
        <div>
          <label
            htmlFor="fee-rate"
            style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6 }}
          >
            手数料率（%）
          </label>
          <input
            id="fee-rate"
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={feeRate || ''}
            onChange={(e) => setFeeRate(Number(e.target.value) || 0)}
            aria-label="手数料率を入力（パーセント）"
            placeholder="例: 13"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 8,
              padding: '10px 12px',
              color: 'white',
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box',
              minHeight: 44,
            }}
          />
        </div>
      </div>

      {/* 結果表示 */}
      <div
        role="status"
        aria-live="polite"
        aria-label={`予想利益: ${profit >= 0 ? '+' : ''}${profit.toLocaleString()}円`}
        style={{
          background: isPositive
            ? 'rgba(16,185,129,0.1)'
            : profit < 0
              ? 'rgba(239,68,68,0.1)'
              : 'rgba(255,255,255,0.05)',
          border: `1px solid ${profitColor}`,
          borderRadius: 12,
          padding: '16px 20px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4 }}>予想利益</p>
        <p style={{ color: profitColor, fontSize: 36, fontWeight: 800, margin: 0 }}>
          {profit >= 0 ? '+' : ''}
          {profit.toLocaleString()}円
        </p>
        {sellingPrice > 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
            手数料: {fee.toLocaleString()}円 / 利益率:{' '}
            {sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0}%
          </p>
        )}
      </div>
    </section>
  );
}
