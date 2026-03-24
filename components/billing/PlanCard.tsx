'use client';

import { useState } from 'react';
import { CheckIcon } from 'lucide-react';

type PlanKey = 'starter' | 'standard' | 'pro';

interface PlanConfig {
  key: PlanKey;
  name: string;
  price: number;
  features: string[];
  color: string;
  recommended?: boolean;
}

const PLANS: PlanConfig[] = [
  {
    key: 'starter',
    name: 'Starter',
    price: 980,
    color: '#10B981',
    features: ['AIお宝自動発掘（月10件）', '利益シミュレーター（1日3回）', '8カテゴリ閲覧', 'メール通知'],
  },
  {
    key: 'standard',
    name: 'Standard',
    price: 1980,
    color: '#00B4D8',
    recommended: true,
    features: ['AIお宝自動発掘（月50件）', '利益シミュレーター（無制限）', '8カテゴリ全閲覧', 'freee CSV出力', 'メルカリ/eBay価格差分析', 'メールアラート'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 4980,
    color: '#E85D04',
    features: ['AIお宝自動発掘（無制限・優先更新）', '利益シミュレーター（無制限）', '8カテゴリ全閲覧', 'freee CSV出力', 'メルカリ/eBay価格差分析', 'Slack/メールアラート', '優先サポート'],
  },
];

interface PlanCardProps {
  currentPlan: PlanKey | 'trial';
}

export function PlanCard({ currentPlan }: PlanCardProps) {
  const [loading, setLoading] = useState<PlanKey | null>(null);

  const handleSubscribe = async (plan: PlanKey) => {
    setLoading(plan);
    try {
      const res = await fetch('/api/komoju/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json() as { session_url?: string };
      if (data.session_url) {
        window.location.href = data.session_url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
      {PLANS.map((plan) => {
        const isCurrent = currentPlan === plan.key;
        return (
          <div
            key={plan.key}
            className="glass-card-enhanced"
            style={{ padding: 24, position: 'relative', border: plan.recommended ? `2px solid ${plan.color}` : undefined }}
            role="region"
            aria-label={`${plan.name}プラン: 月額${plan.price.toLocaleString()}円`}
          >
            {plan.recommended && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: plan.color, color: 'white', fontSize: 11, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 12, whiteSpace: 'nowrap',
                }}
              >
                最もご利用多数
              </div>
            )}
            <h3 style={{ color: plan.color, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: 'white', fontSize: 32, fontWeight: 800 }}>{plan.price.toLocaleString()}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>円/月</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
              {plan.features.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
                  <CheckIcon aria-hidden="true" style={{ width: 14, height: 14, color: plan.color, flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            {isCurrent ? (
              <div
                aria-label={`現在のプラン: ${plan.name}`}
                style={{ textAlign: 'center', padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}
              >
                現在のプラン
              </div>
            ) : (
              <button
                onClick={() => handleSubscribe(plan.key)}
                disabled={loading !== null}
                aria-label={`${plan.name}プランに変更する（月額${plan.price.toLocaleString()}円）`}
                style={{
                  width: '100%', minHeight: 44,
                  background: plan.recommended ? plan.color : 'rgba(255,255,255,0.1)',
                  color: 'white', border: plan.recommended ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading === plan.key ? '処理中...' : 'このプランを選ぶ'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
