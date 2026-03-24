'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export default function AlertsPage() {
  const router = useRouter();
  const supabaseRef = useRef<SupabaseClient | null>(null);

  function getSupabase() {
    if (!supabaseRef.current) {
      supabaseRef.current = createBrowserClient();
    }
    return supabaseRef.current;
  }

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [slackWebhook, setSlackWebhook] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [profitThreshold, setProfitThreshold] = useState<number>(20);
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = getSupabase();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUserId(session.user.id);

      // 既存設定を取得
      const { data } = await supabase
        .from('user_alerts')
        .select('slack_webhook_url, alert_email, profit_threshold_pct')
        .eq('user_id', session.user.id)
        .single();

      if (data) {
        setSlackWebhook(data.slack_webhook_url ?? '');
        setAlertEmail(data.alert_email ?? '');
        setProfitThreshold(data.profit_threshold_pct ?? 20);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    const supabase = getSupabase();

    await supabase.from('user_alerts').upsert(
      {
        user_id: userId,
        slack_webhook_url: slackWebhook || null,
        alert_email: alertEmail || null,
        profit_threshold_pct: profitThreshold,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '48px 16px',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: 32 }}>
          <a
            href="/dashboard"
            aria-label="ダッシュボードに戻る"
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 13,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              minHeight: 44,
            }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            ダッシュボードに戻る
          </a>
          <h1
            style={{
              color: 'white',
              fontSize: 28,
              fontWeight: 800,
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            価格変動アラート設定
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
            条件に一致したお宝商品を即座にSlackやメールで通知します
          </p>
        </div>

        {/* フォームカード */}
        <form
          onSubmit={handleSave}
          aria-label="アラート設定フォーム"
          style={{
            background: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 16,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Slack Webhook URL */}
          <div>
            <label
              htmlFor="slack-webhook"
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.8)',
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Slack Webhook URL
            </label>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>
              Slack の Incoming Webhooks で発行した URL を入力してください
            </p>
            <input
              id="slack-webhook"
              type="url"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              aria-label="Slack Webhook URL を入力"
              placeholder="https://hooks.slack.com/services/..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 8,
                padding: '10px 12px',
                color: 'white',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                minHeight: 44,
              }}
            />
          </div>

          {/* アラートメール送信先 */}
          <div>
            <label
              htmlFor="alert-email"
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.8)',
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              アラートメール送信先
            </label>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>
              設定した条件を満たす物件が見つかった際にメールでお知らせします
            </p>
            <input
              id="alert-email"
              type="email"
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
              aria-label="アラートメール送信先メールアドレスを入力"
              placeholder="example@email.com"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 8,
                padding: '10px 12px',
                color: 'white',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                minHeight: 44,
              }}
            />
          </div>

          {/* Slackテスト通知ボタン */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              Slack接続テスト
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 10 }}>
              Webhook URLが入力済みの場合、テスト通知を送信して接続を確認できます
            </p>
            <button
              type="button"
              disabled={!slackWebhook || testSending}
              aria-label="Slackにテスト通知を送る"
              onClick={async () => {
                setTestSending(true);
                setTestResult(null);
                try {
                  const res = await fetch('/api/alerts/test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slackWebhookUrl: slackWebhook }),
                  });
                  setTestResult(res.ok ? 'success' : 'error');
                } catch {
                  setTestResult('error');
                } finally {
                  setTestSending(false);
                  setTimeout(() => setTestResult(null), 5000);
                }
              }}
              style={{
                background: !slackWebhook ? 'rgba(255,255,255,0.1)' : 'rgba(52,211,153,0.15)',
                color: !slackWebhook ? 'rgba(255,255,255,0.3)' : '#34D399',
                border: `1px solid ${!slackWebhook ? 'rgba(255,255,255,0.1)' : 'rgba(52,211,153,0.4)'}`,
                borderRadius: 8,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                minHeight: 44,
                cursor: !slackWebhook || testSending ? 'not-allowed' : 'pointer',
                opacity: testSending ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {testSending ? '送信中...' : 'Slackにテスト通知を送る'}
            </button>
            {testResult === 'success' && (
              <p style={{ color: '#34D399', fontSize: 13, marginTop: 8 }}>
                テスト通知を送信しました
              </p>
            )}
            {testResult === 'error' && (
              <p style={{ color: '#EF4444', fontSize: 13, marginTop: 8 }}>
                送信に失敗しました。Webhook URLを確認してください
              </p>
            )}
          </div>

          {/* 利益率閾値 */}
          <div>
            <label
              htmlFor="profit-threshold"
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.8)',
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              アラート閾値：利益率 {profitThreshold}% 以上で通知
            </label>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>
              設定した利益率を超えるお宝商品が見つかったときに通知します
            </p>
            <input
              id="profit-threshold"
              type="range"
              min={5}
              max={500}
              step={5}
              value={profitThreshold}
              onChange={(e) => setProfitThreshold(Number(e.target.value))}
              aria-label={`アラート閾値: 利益率 ${profitThreshold}% 以上`}
              style={{
                width: '100%',
                accentColor: '#F59E0B',
                minHeight: 44,
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
              <span>5%</span>
              <span
                style={{
                  color: '#F59E0B',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {profitThreshold}%
              </span>
              <span>500%</span>
            </div>
          </div>

          {/* 保存ボタン */}
          <button
            type="submit"
            disabled={saving}
            aria-label="アラート設定を保存する"
            style={{
              background: saved ? '#10B981' : '#F59E0B',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 15,
              fontWeight: 700,
              minHeight: 44,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'background 0.3s',
            }}
          >
            {saving ? '保存中...' : saved ? '保存しました' : '設定を保存する'}
          </button>
        </form>

        {/* 注意事項 */}
        <div
          style={{
            marginTop: 20,
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 12,
            padding: '14px 18px',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, lineHeight: 1.7 }}>
            アラートはProプランのユーザーが利用できます。通知はサーバーから送信されるため、Webhook URLやトークンはサーバーサイドで暗号化して保存されます。
          </p>
        </div>
      </div>
    </div>
  );
}
