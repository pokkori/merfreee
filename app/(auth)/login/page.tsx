'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        setError('メールの送信に失敗しました。もう一度お試しください。');
      } else {
        setSent(true);
      }
    } catch {
      setError('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="hero-gradient"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div className="glass-card-mid" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        {/* ロゴ */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: '#E85D04', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 20 }}>M</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 22 }}>MerFreee</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '16px 0 8px' }}>ログイン</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            メールアドレスにマジックリンクを送信します
          </p>
        </div>

        {sent ? (
          <div
            role="alert"
            style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: 16, textAlign: 'center' }}
          >
            <p style={{ color: '#10B981', fontWeight: 600, marginBottom: 8 }}>メールを送信しました</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {email} にログインリンクを送りました。メールを確認してください。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="email"
                style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500, marginBottom: 8 }}
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                aria-label="メールアドレスを入力"
                aria-describedby={error ? 'email-error' : undefined}
                autoComplete="email"
              />
              {error && (
                <p id="email-error" role="alert" style={{ color: '#EF4444', fontSize: 13, marginTop: 6 }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              aria-label="マジックリンクをメールで送信する"
              className="btn-primary"
              style={{ width: '100%', fontSize: 15, opacity: (loading || !email) ? 0.6 : 1 }}
            >
              {loading ? '送信中...' : 'マジックリンクを送信'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          <Link href="/" aria-label="トップページへ戻る" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
            トップページへ戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
