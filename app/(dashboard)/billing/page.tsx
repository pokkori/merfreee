import { PlanCard } from '@/components/billing/PlanCard';

export default function BillingPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>プラン・請求</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>14日間無料トライアル中。いつでもプランを変更できます。</p>
      </div>

      <div className="glass-card-mid" style={{ padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} aria-hidden="true" />
        <div>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>現在: 無料トライアル中</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>トライアル終了まで残り12日</p>
        </div>
      </div>

      <PlanCard currentPlan="trial" />
    </div>
  );
}
