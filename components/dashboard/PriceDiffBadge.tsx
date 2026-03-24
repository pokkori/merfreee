'use client';

interface PriceDiffBadgeProps {
  priceDiffPct: number;
}

export function PriceDiffBadge({ priceDiffPct }: PriceDiffBadgeProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#10B981',
        color: 'white',
        fontSize: 24,
        fontWeight: 700,
        borderRadius: 8,
        padding: '4px 12px',
        minHeight: 44,
      }}
      aria-label={`価格差率 ${priceDiffPct}パーセント`}
      role="status"
    >
      +{priceDiffPct}%
    </div>
  );
}
