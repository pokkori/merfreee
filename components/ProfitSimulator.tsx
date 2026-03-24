'use client';

import { useState } from 'react';

const SHIPPING_PRESETS = [
  { label: 'EMS', value: 2500 },
  { label: 'SAL便', value: 1200 },
  { label: '小型包装物', value: 900 },
  { label: 'カスタム', value: -1 },
];

export function ProfitSimulator() {
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [feeRate, setFeeRate] = useState<number>(13);
  const [shippingPreset, setShippingPreset] = useState<number>(2500);
  const [customShipping, setCustomShipping] = useState<number>(0);
  const [fxMarginPct, setFxMarginPct] = useState<number>(3);
  const [usdRate, setUsdRate] = useState<number>(150);

  const isCustomShipping = shippingPreset === -1;
  const shippingCost = isCustomShipping ? customShipping : shippingPreset;

  // 手数料（プラットフォーム）
  const platformFee = sellingPrice * (feeRate / 100);
  // PayPal 手数料: 販売価格 × 3.49% + ¥55
  const paypalFee = sellingPrice * 0.0349 + 55;
  // 為替マージン: 販売価格 × 為替マージン%
  const fxMargin = sellingPrice * (fxMarginPct / 100);
  // 合計コスト
  const totalCost = purchasePrice + platformFee + paypalFee + fxMargin + shippingCost;
  // 利益
  const profit = sellingPrice - totalCost;
  // 利益率
  const profitRate = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  // USD換算
  const profitUsd = usdRate > 0 ? profit / usdRate : 0;

  // 色分け: 10%以上→緑 / マイナス→赤 / 10%未満→黄
  const profitColor =
    profitRate >= 10 ? '#10B981' : profit < 0 ? '#EF4444' : '#F59E0B';
  const profitBg =
    profitRate >= 10
      ? 'rgba(16,185,129,0.1)'
      : profit < 0
        ? 'rgba(239,68,68,0.1)'
        : 'rgba(245,158,11,0.1)';
  const profitBorder =
    profitRate >= 10 ? '#10B981' : profit < 0 ? '#EF4444' : '#F59E0B';

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
        仕入れ価格・販売価格・送料・手数料を入力するとリアルタイムで予想利益を計算します
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginBottom: 20,
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

      {/* 越境特化コスト */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 10,
          padding: '16px 16px',
          marginBottom: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          越境特化コスト
        </p>

        {/* 国際送料 */}
        <div>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8 }}>
            国際送料
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {SHIPPING_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                aria-label={`国際送料を${preset.label}${preset.value > 0 ? `（¥${preset.value.toLocaleString()}）` : ''}に設定する`}
                aria-pressed={shippingPreset === preset.value}
                onClick={() => setShippingPreset(preset.value)}
                style={{
                  background: shippingPreset === preset.value ? '#F59E0B' : 'rgba(255,255,255,0.07)',
                  color: shippingPreset === preset.value ? 'white' : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${shippingPreset === preset.value ? '#F59E0B' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: 44,
                  whiteSpace: 'nowrap',
                }}
              >
                {preset.label}
                {preset.value > 0 ? ` ¥${preset.value.toLocaleString()}` : ''}
              </button>
            ))}
          </div>
          {isCustomShipping && (
            <input
              id="custom-shipping"
              type="number"
              min={0}
              value={customShipping || ''}
              onChange={(e) => setCustomShipping(Number(e.target.value) || 0)}
              aria-label="カスタム国際送料を入力（円）"
              placeholder="送料を入力（円）"
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
          )}
        </div>

        {/* PayPal手数料（自動計算） */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, marginBottom: 2 }}>
              PayPal手数料
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>
              販売価格 × 3.49% + ¥55（自動計算）
            </p>
          </div>
          <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: 15 }}>
            ¥{Math.round(paypalFee).toLocaleString()}
          </span>
        </div>

        {/* 為替マージン */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label htmlFor="fx-margin" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              為替マージン
            </label>
            <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: 15 }}>
              {fxMarginPct}%（¥{Math.round(fxMargin).toLocaleString()}）
            </span>
          </div>
          <input
            id="fx-margin"
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={fxMarginPct}
            onChange={(e) => setFxMarginPct(Number(e.target.value))}
            aria-label={`為替マージン ${fxMarginPct}%`}
            style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer', minHeight: 24 }}
          />
        </div>

        {/* USD換算レート */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label htmlFor="usd-rate" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              USD換算レート
            </label>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              1 USD = ¥{usdRate}
            </span>
          </div>
          <input
            id="usd-rate"
            type="number"
            min={1}
            max={500}
            step={1}
            value={usdRate || ''}
            onChange={(e) => setUsdRate(Number(e.target.value) || 150)}
            aria-label="USD換算レートを入力（円/USD）"
            placeholder="例: 150"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 8,
              padding: '8px 12px',
              color: 'white',
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box',
              minHeight: 44,
            }}
          />
        </div>
      </div>

      {/* コスト内訳 */}
      {sellingPrice > 0 && (
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
          aria-label="コスト内訳"
        >
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            コスト内訳
          </p>
          {[
            { label: '仕入れ価格', value: purchasePrice },
            { label: `プラットフォーム手数料（${feeRate}%）`, value: platformFee },
            { label: 'PayPal手数料', value: paypalFee },
            { label: `為替マージン（${fxMarginPct}%）`, value: fxMargin },
            { label: `国際送料（${isCustomShipping ? 'カスタム' : SHIPPING_PRESETS.find(p => p.value === shippingPreset)?.label ?? ''}）`, value: shippingCost },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{item.label}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>¥{Math.round(item.value).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700 }}>合計コスト</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700 }}>¥{Math.round(totalCost).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* 結果表示 */}
      <div
        role="status"
        aria-live="polite"
        aria-label={`予想利益: ${profit >= 0 ? '+' : ''}${Math.round(profit).toLocaleString()}円（利益率 ${Math.round(profitRate)}%）`}
        style={{
          background: profitBg,
          border: `1px solid ${profitBorder}`,
          borderRadius: 12,
          padding: '16px 20px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4 }}>予想利益</p>
        <p style={{ color: profitColor, fontSize: 36, fontWeight: 800, margin: 0 }}>
          {profit >= 0 ? '+' : ''}
          {Math.round(profit).toLocaleString()}円
        </p>
        {sellingPrice > 0 && (
          <>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
              利益率: <span style={{ color: profitColor, fontWeight: 700 }}>{Math.round(profitRate)}%</span>
              {profitRate < 10 && profitRate >= 0 && (
                <span style={{ color: '#F59E0B', marginLeft: 8 }}>利益率10%未満です</span>
              )}
              {profit < 0 && (
                <span style={{ color: '#EF4444', marginLeft: 8 }}>赤字になります</span>
              )}
            </p>
            {usdRate > 0 && (
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>
                USD換算: {profit >= 0 ? '+' : ''}{profitUsd.toFixed(2)} USD（@¥{usdRate}）
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
