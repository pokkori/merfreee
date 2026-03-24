import { PlanCard } from '@/components/billing/PlanCard';

async function fetchTrialDaysLeft(): Promise<number> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return 14;

    const { createServerClient } = await import('@/lib/supabase/server');
    const supabase = createServerClient();

    // trial_ends_at または plan_expires_at を users テーブルから取得
    const { data, error } = await supabase
      .from('users')
      .select('plan_expires_at')
      .limit(1)
      .single();

    if (error || !data) return 14;

    const trialEndsAt: string | null = data.plan_expires_at;
    if (!trialEndsAt) return 14;

    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000)
    );
    return daysLeft;
  } catch {
    return 14;
  }
}

export default async function BillingPage() {
  const daysLeft = await fetchTrialDaysLeft();

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>プラン・請求</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>14日間無料トライアル中。いつでもプランを変更できます。</p>
      </div>

      <div className="glass-card-enhanced" style={{ padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} aria-hidden="true" />
        <div>
          <p style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>現在: 無料トライアル中</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            トライアル終了まで残り{daysLeft}日
          </p>
        </div>
      </div>

      <PlanCard currentPlan="trial" />
    </div>
  );
}
